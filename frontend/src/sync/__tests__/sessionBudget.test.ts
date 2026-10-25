// Presupuesto de cuota de una sesión (plan 17, punto 14). [Claude Code · 2026-10-24]
// Simula 4 h de mesa con 7 clientes (GM + 6 jugadores) contra el Firestore falso, con el motor de sync real
// y la misma regla de publicación del resumen de party que cloudCampaigns (2 s sin cambios + resumen distinto).
// Falla si pasa de 10.000 escrituras o 25.000 lecturas (Spark: 20.000 y 50.000 por día).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterSheet } from '../../types/cyberpunk';
import { createCharacterSync, type SyncAdapter } from '../characterSync';
import { toSheetDoc } from '../sheetDoc';
import { buildPartySummary, sameSummary, type PartySummary } from '../partySummary';
import { createFakeFirestore } from '../testing/fakeFirestore';

const PLAYERS = 6;
const MEMBERS = PLAYERS + 1;
const SESSION_S = 4 * 60 * 60;
const COMBAT_S = 2 * 60 * 60; // la mitad de la sesión en combate
const PARTY_QUIET_MS = 2000;
// Abrir la app y reconexiones (tabla del plan 17): no pasa por el motor, se suma aparte.
const OPEN_AND_RECONNECT_READS = 1300;
const MAX_WRITES = 10000;
const MAX_READS = 25000;

const charId = (i: number) => `c${i}`;

function makeSheet(i: number): CharacterSheet {
  return {
    id: charId(i),
    handle: 'PJ ' + i,
    role: 'Solo',
    roleRank: 4,
    stats: { BODY: 6, WILL: 6 },
    currentHp: 40,
    currentLuck: 6,
    currentHumanity: 40,
    headArmor: { name: 'Casco', maxSp: 11, currentSp: 11, penalty: 0 },
    bodyArmor: { name: 'Chaleco', maxSp: 11, currentSp: 11, penalty: 0 },
    skills: {},
    equippedWeapons: [],
    installedCyberwareIds: [],
    activeInjuries: [],
    eurodollars: 1000,
    notes: '',
    ipLog: [],
    transactions: [],
  } as unknown as CharacterSheet;
}

// Generador pseudoaleatorio con semilla: la simulación da siempre lo mismo.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('presupuesto de una sesión de 4 h (7 clientes)', () => {
  it('queda por debajo de 10.000 escrituras y 25.000 lecturas, sin eco', async () => {
    const fs = createFakeFirestore();
    for (let i = 0; i < PLAYERS; i++) fs.seedDoc(charId(i), { ...toSheetDoc(makeSheet(i)), ownerUid: 'u' + i, schemaVersion: 6 });

    let sheetReads = 0;
    let partyWrites = 0;
    const party = new Map<string, PartySummary>();
    const rand = rng(2077);

    const mkClient = (name: string, ids: string[]) => {
      const sheets = new Map(ids.map((id) => [id, makeSheet(Number(id.slice(1)))]));
      const base = fs.adapterFor(name);
      // Firestore cobra una lectura por documento entregado desde el servidor (no los locales pendientes).
      const adapter: SyncAdapter = {
        ...base,
        subscribeDoc: (id, cb) => base.subscribeDoc(id, (data, info) => {
          if (!info.hasPendingWrites) sheetReads += 1;
          cb(data, info);
        }),
      };
      const partyDirty = new Map<string, number>();
      // eslint-disable-next-line prefer-const
      let engine: ReturnType<typeof createCharacterSync>;
      engine = createCharacterSync({
        adapter,
        writer: { writerId: `${name}_dev` },
        bridge: {
          getSheet: (id) => sheets.get(id),
          applyRemoteSheet: (id, sheet) => {
            sheets.set(id, sheet);
            engine.onLocalChange(id); // como el store: el motor ve el cambio pero no escribe (diff contra la base)
          },
        },
      });
      for (const id of ids) engine.track(id);
      const edit = (id: string, fn: (s: CharacterSheet) => CharacterSheet) => {
        sheets.set(id, fn(sheets.get(id)!));
        engine.onLocalChange(id);
        partyDirty.set(id, Date.now());
      };
      const partyTick = () => {
        for (const [id, at] of [...partyDirty]) {
          if (Date.now() - at < PARTY_QUIET_MS) continue;
          partyDirty.delete(id);
          const sum = buildPartySummary(sheets.get(id)!, 'u' + id.slice(1), 'PJ');
          if (sameSummary(sum, party.get(id))) continue;
          party.set(id, sum);
          partyWrites += 1;
        }
      };
      return { engine, edit, partyTick, sheets };
    };

    const players = Array.from({ length: PLAYERS }, (_, i) => mkClient('p' + i, [charId(i)]));
    const gm = mkClient('gm', Array.from({ length: PLAYERS }, (_, i) => charId(i)));
    const clients = [...players, gm];

    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    // Cada clic cambia algo de verdad (si llega a 0 se repone): así no hay clics "gratis" y el número es pesimista.
    const hit = (s: CharacterSheet, dmg: number): CharacterSheet => ({
      ...s,
      currentHp: s.currentHp <= dmg ? 40 : s.currentHp - dmg,
      bodyArmor: { ...s.bodyArmor, currentSp: s.bodyArmor.currentSp <= 0 ? 11 : s.bodyArmor.currentSp - 1 },
    });
    let bursts = 0;

    // Una ráfaga: 1 a 4 clics en menos de 2 s (el motor los agrupa en una escritura).
    const burst = (c: (typeof clients)[number], id: string, combat: boolean) => {
      bursts += 1;
      const clicks = 1 + Math.floor(rand() * 4);
      const kind = rand();
      for (let k = 0; k < clicks; k++) {
        setTimeout(() => {
          c.edit(id, (s) => {
            if (!combat) return kind < 0.5 ? { ...s, eurodollars: s.eurodollars - 10 } : { ...s, notes: (s as unknown as { notes: string }).notes + '.' } as CharacterSheet;
            if (kind < 0.6) return { ...s, currentHp: s.currentHp <= 1 ? 40 : clamp(s.currentHp + (rand() < 0.7 ? -1 : 1), 1, 40) };
            if (kind < 0.8) return { ...s, currentLuck: s.currentLuck <= 0 ? 6 : s.currentLuck - 1 };
            return { ...s, headArmor: { ...s.headArmor, currentSp: s.headArmor.currentSp <= 0 ? 11 : s.headArmor.currentSp - 1 } };
          });
        }, k * 400);
      }
    };

    await vi.advanceTimersByTimeAsync(100); // snapshots iniciales
    for (let t = 0; t < SESSION_S; t++) {
      const combat = t < COMBAT_S;
      players.forEach((p, i) => {
        // combate: ~cada 30 s; exploración: ~cada 2 min
        if (rand() < (combat ? 1 / 30 : 1 / 120)) burst(p, charId(i), combat);
      });
      if (combat && rand() < 1 / 10) {
        const target = charId(Math.floor(rand() * PLAYERS));
        bursts += 1;
        gm.edit(target, (s) => hit(s, 1 + Math.floor(rand() * 6)));
      }
      await vi.advanceTimersByTimeAsync(1000);
      clients.forEach((c) => c.partyTick());
    }
    await vi.advanceTimersByTimeAsync(20000);
    for (const c of clients) await c.engine.flushAll();
    await vi.advanceTimersByTimeAsync(1000);

    const sheetWrites = fs.ops.updates + fs.ops.logCreates;
    const writes = sheetWrites + partyWrites;
    const partyReads = partyWrites * MEMBERS; // cada resumen lo leen los 7 miembros
    const reads = sheetReads + partyReads + OPEN_AND_RECONNECT_READS;
    console.info(`[presupuesto] ráfagas=${bursts} escrituras=${writes} (fichas ${sheetWrites}, party ${partyWrites}) lecturas=${reads} (fichas ${sheetReads}, party ${partyReads}, apertura ${OPEN_AND_RECONNECT_READS})`);

    // Sin eco: nunca hay más escrituras de fichas que ráfagas de cambios (cada ráfaga se agrupa en una).
    expect(fs.ops.updates).toBeLessThanOrEqual(bursts);
    expect(writes).toBeLessThanOrEqual(MAX_WRITES);
    expect(reads).toBeLessThanOrEqual(MAX_READS);

    // Al final todos ven lo mismo.
    for (let i = 0; i < PLAYERS; i++) {
      const id = charId(i);
      const truth = toSheetDoc(players[i].sheets.get(id)!);
      expect(toSheetDoc(gm.sheets.get(id)!)).toEqual(truth);
    }
    for (const c of clients) await c.engine.dispose();
  }, 120000);
});
