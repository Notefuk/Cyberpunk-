// Presupuesto de cuota de una sesión (plan 17, punto 14). [Claude Code · 2026-10-24]
// Simula 4 h de mesa con 7 clientes (GM + 6 jugadores) contra el Firestore falso, con el motor de sync real
// y la misma regla de publicación del resumen de party que cloudCampaigns (2 s sin cambios + resumen distinto).
// Falla si pasa de 10.000 escrituras o 35.000 lecturas (Spark: 20.000 y 50.000 por día; tope de lecturas subido en la v5.1.0).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterSheet } from '../../types/cyberpunk';
import { createCharacterSync, type SyncAdapter } from '../characterSync';
import { toSheetDoc } from '../sheetDoc';
import { buildPartySummary, sameSummary, type PartySummary } from '../partySummary';
import { createFakeFirestore } from '../testing/fakeFirestore';
import { createEncounterSync, type EncounterAdapter } from '../encounterSync';
import { useEncounterStore } from '../../store/encounterStore';
import { HANDOUT_LIMIT } from '../tableReveals';

const PLAYERS = 6;
const MEMBERS = PLAYERS + 1;
const SESSION_S = 4 * 60 * 60;
const COMBAT_S = 2 * 60 * 60; // la mitad de la sesión en combate
const PARTY_QUIET_MS = 2000;
// Abrir la app y reconexiones (tabla del plan 17): no pasa por el motor, se suma aparte.
const OPEN_AND_RECONNECT_READS = 1300;
const MAX_WRITES = 10000;
// v5.1.0 [Claude Code · 2026-10-27]: con la mesa compartida una sesión de 4 h lee ~30.000 (60 % del gratis diario).
// Decisión de Giuliano (2026-10-27): se acepta, con el ataque y su daño en una sola línea del log; tope 35.000 (70 %).
// Una sesión larga por día entra en Spark; dos el mismo día pueden pausar la sync hasta la medianoche del Pacífico.
const MAX_READS = 35000;
// v5.3.0 (plan 20, B.4) [Claude Code · 2026-10-28]: secretos del GM y lo que revela. Los secretos (gm/notes|npcs|net) los
// lee solo el GM: ~30 guardados por sesión (cada uno espera 1,5 s) y 3 lecturas al abrir. Revelar: ~40 por sesión
// (handouts, corrida NET, enemigo revelado u oculto), cada una la leen los 7; al abrir, los últimos HANDOUT_LIMIT (10) handouts y la corrida.
const GM_SECRET_SAVES = 30;
const GM_SECRET_OPEN_READS = 3;
const REVEALS = 40;
const REVEAL_OPEN_READS = (HANDOUT_LIMIT + 1) * MEMBERS;
// Mesa compartida (plan 19, paso 7): 6 peleas de 20 min en las 2 h de combate, 4 enemigos por pelea, un turno cada
// 8 s. En su turno el jugador ataca: una línea de log (con el daño si pega, 70 %) y el GM baja HP al enemigo.
// Las tiradas de los enemigos (bestiario del GM) no van al log. Cada documento del encuentro y del log lo leen los 7.
const FIGHT_S = 20 * 60;
const TURN_S = 8;
const ENEMIES_PER_FIGHT = 4;
const LOG_TRIM_READS = 201; // el GM recorta el log al abrir la mesa

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

class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('localStorage', new MemoryStorage()); });
afterEach(() => { vi.useRealTimers(); });

describe('presupuesto de una sesión de 4 h (7 clientes)', () => {
  it('queda por debajo de 10.000 escrituras y 35.000 lecturas, sin eco', async () => {
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

    // Encuentro compartido: el motor real del GM contra una nube que solo cuenta.
    const enc = { headWrites: 0, publicWrites: 0, gmWrites: 0, deletes: 0, playerInitWrites: 0 };
    let logWrites = 0;
    const encAdapter: EncounterAdapter = {
      subscribeHead: (cb) => { cb(null); return () => {}; },
      subscribeCombatants: (cb) => { cb([]); return () => {}; },
      loadGmCombatants: async () => ({}),
      commit: async (c) => {
        if (c.head) enc.headWrites += 1;
        for (const w of c.set) { if (w.coll === 'combatants') enc.publicWrites += 1; else enc.gmWrites += 1; }
        enc.deletes += c.del.length;
      },
      writeMyPc: async () => { enc.playerInitWrites += 1; },
    };
    useEncounterStore.getState().reset();
    const encSync = createEncounterSync({ adapter: encAdapter, role: 'gm', uid: 'gm', ownerOf: () => 'u' });
    encSync.start();
    const encState = () => useEncounterStore.getState();

    await vi.advanceTimersByTimeAsync(100); // snapshots iniciales
    for (let t = 0; t < SESSION_S; t++) {
      const combat = t < COMBAT_S;
      if (combat && t % FIGHT_S === 0) {
        encState().reset();
        for (let e = 0; e < ENEMIES_PER_FIGHT; e++) {
          const id = encState().addQuickEnemy({ name: 'Goon ' + e, hp: 35, sp: 11, atkBase: 12, damageDice: '3d6' });
          encState().setInitiative(id, 5 + Math.floor(rand() * 15));
        }
        for (let i = 0; i < PLAYERS; i++) {
          enc.playerInitWrites += 1; // el jugador escribe su iniciativa; el GM la toma
          logWrites += 1;
          encState().addPc(charId(i), 'PJ ' + i, 'u' + i);
          encState().setInitiative('pc-' + charId(i), 5 + Math.floor(rand() * 15));
        }
      }
      if (combat && t % TURN_S === 0 && t % FIGHT_S !== 0) {
        const st = encState();
        const current = st.combatants.find((c) => c.id === st.order[st.turnIndex]);
        const enemies = st.combatants.filter((c) => c.enemy && c.enemy.currentHp > 0);
        if (current?.kind === 'pc') {
          logWrites += 1; // ataque (con su daño en la misma línea)
          if (rand() < 0.7 && enemies.length > 0) {
            const target = enemies[Math.floor(rand() * enemies.length)];
            st.applyEnemyDamage(target.id, 4 + Math.floor(rand() * 12), rand() < 0.2 ? 'head' : 'body');
          }
        }
        st.nextTurn();
      }
      players.forEach((p, i) => {
        // combate: ~cada 30 s; exploración: ~cada 2 min
        if (rand() < (combat ? 1 / 30 : 1 / 120)) burst(p, charId(i), combat);
      });
      if (combat && rand() < 1 / 10) {
        const target = charId(Math.floor(rand() * PLAYERS));
        bursts += 1;
        logWrites += 1; // v5.2.0 (plan 20): cada acción del GM sobre un PJ deja una línea 'gm' en el log [Claude Code · 2026-10-28]
        gm.edit(target, (s) => hit(s, 1 + Math.floor(rand() * 6)));
      }
      await vi.advanceTimersByTimeAsync(1000);
      clients.forEach((c) => c.partyTick());
    }
    await vi.advanceTimersByTimeAsync(20000);
    for (const c of clients) await c.engine.flushAll();
    await encSync.flushNow();
    await vi.advanceTimersByTimeAsync(1000);
    encSync.stop();

    const sheetWrites = fs.ops.updates + fs.ops.logCreates;
    const tableWrites = enc.headWrites + enc.publicWrites + enc.gmWrites + enc.deletes + enc.playerInitWrites + logWrites + GM_SECRET_SAVES + REVEALS;
    const writes = sheetWrites + partyWrites + tableWrites;
    const partyReads = partyWrites * MEMBERS; // cada resumen lo leen los 7 miembros
    // Lo que escucha toda la mesa: orden y turno, vista pública, iniciativas y log. El documento del GM no lo lee nadie.
    const tableReads = (enc.headWrites + enc.publicWrites + enc.deletes + enc.playerInitWrites + logWrites) * MEMBERS + LOG_TRIM_READS
      + GM_SECRET_SAVES + GM_SECRET_OPEN_READS + REVEALS * MEMBERS + REVEAL_OPEN_READS;
    const reads = sheetReads + partyReads + OPEN_AND_RECONNECT_READS + tableReads;
    console.info(`[presupuesto] ráfagas=${bursts} escrituras=${writes} (fichas ${sheetWrites}, party ${partyWrites}, mesa ${tableWrites}) lecturas=${reads} (fichas ${sheetReads}, party ${partyReads}, apertura ${OPEN_AND_RECONNECT_READS}, mesa ${tableReads})`);
    console.info(`[presupuesto] mesa: turnos/orden ${enc.headWrites}, vista pública ${enc.publicWrites}, enemigos (GM) ${enc.gmWrites}, borrados ${enc.deletes}, iniciativas ${enc.playerInitWrites}, log ${logWrites}`);

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
