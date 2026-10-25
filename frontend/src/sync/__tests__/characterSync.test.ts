// Tests del motor de sync con dos clientes y un Firestore falso. v5.0.0 (plan 16/17). [Claude Code · 2026-10-24]
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterSheet } from '../../types/cyberpunk';
import { createCharacterSync, type SyncAdapter } from '../characterSync';
import { toSheetDoc } from '../sheetDoc';
import { createFakeFirestore } from '../testing/fakeFirestore';

const ID = 'c1';

function makeSheet(): CharacterSheet {
  return {
    id: ID,
    handle: 'Vex',
    role: 'Solo',
    roleRank: 4,
    stats: {},
    currentHp: 30,
    currentLuck: 5,
    currentHumanity: 40,
    headArmor: { name: 'Casco', maxSp: 11, currentSp: 11, penalty: 0 },
    bodyArmor: { name: 'Chaleco', maxSp: 11, currentSp: 11, penalty: 0 },
    skills: {},
    equippedWeapons: [],
    installedCyberwareIds: [],
    activeInjuries: [],
    eurodollars: 100,
    ipLog: [],
    transactions: [],
  } as unknown as CharacterSheet;
}

function setup(wrap?: (a: SyncAdapter) => SyncAdapter, initialSeed = true) {
  const fs = createFakeFirestore();
  if (initialSeed) fs.seedDoc(ID, { ...toSheetDoc(makeSheet()), ownerUid: 'u1', schemaVersion: 1 });
  const mk = (name: string) => {
    const sheets = new Map<string, CharacterSheet>([[ID, makeSheet()]]);
    const errors: unknown[] = [];
    const base = fs.adapterFor(name);
    const adapter = wrap && name === 'A' ? wrap(base) : base;
    // eslint-disable-next-line prefer-const
    let engine: ReturnType<typeof createCharacterSync>;
    engine = createCharacterSync({
      adapter,
      writer: { writerId: `u_${name}` },
      bridge: {
        getSheet: id => sheets.get(id),
        applyRemoteSheet: (id, sheet) => {
          sheets.set(id, sheet);
          engine.onLocalChange(id);
        },
      },
      onError: (_id, e) => errors.push(e),
    });
    const edit = (fn: (s: CharacterSheet) => CharacterSheet) => {
      sheets.set(ID, fn(sheets.get(ID)!));
      engine.onLocalChange(ID);
    };
    return { sheets, engine, edit, errors };
  };
  const A = mk('A');
  const B = mk('B');
  A.engine.track(ID);
  B.engine.track(ID);
  return { fs, A, B };
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('characterSync', () => {
  it('a) 10 ediciones de HP -1 en 2 s -> 1 updateDoc (increment -10) y B converge', async () => {
    const { fs, A, B } = setup();
    await vi.advanceTimersByTimeAsync(100);
    for (let i = 0; i < 10; i++) {
      A.edit(s => ({ ...s, currentHp: s.currentHp - 1 }));
      await vi.advanceTimersByTimeAsync(200);
    }
    await vi.advanceTimersByTimeAsync(10000);
    expect(fs.ops.updates).toBe(1);
    expect(fs.updateLog[0].changes).toEqual([{ kind: 'increment', path: ['currentHp'], delta: -10 }]);
    expect(fs.getDoc(ID)!.currentHp).toBe(20);
    expect(B.sheets.get(ID)!.currentHp).toBe(20);
  });

  it('b) eco: B no escribe tras aplicar el cambio de A', async () => {
    const { fs, A, B } = setup();
    await vi.advanceTimersByTimeAsync(100);
    A.edit(s => ({ ...s, currentHp: 25 }));
    await vi.advanceTimersByTimeAsync(10000);
    expect(B.sheets.get(ID)!.currentHp).toBe(25);
    const n = fs.ops.updates;
    expect(n).toBe(1);
    await vi.advanceTimersByTimeAsync(60000);
    expect(fs.ops.updates).toBe(n);
    expect(B.engine.stats().writes).toBe(0);
    expect(B.engine.stats().remoteApplied).toBe(1);
  });

  it('c) concurrente: handle en A y HP en B conviven', async () => {
    const { fs, A, B } = setup();
    await vi.advanceTimersByTimeAsync(100);
    A.edit(s => ({ ...s, handle: 'Nova' }));
    B.edit(s => ({ ...s, currentHp: 25 }));
    await vi.advanceTimersByTimeAsync(20000);
    for (const sh of [A.sheets.get(ID)!, B.sheets.get(ID)!, fs.getDoc(ID)!]) {
      expect(sh.handle).toBe('Nova');
      expect(sh.currentHp).toBe(25);
    }
  });

  it('d) GM y jugador cambian HP en la misma ventana: 30 -5 -3 = 22', async () => {
    const { fs, A, B } = setup();
    await vi.advanceTimersByTimeAsync(100);
    A.edit(s => ({ ...s, currentHp: s.currentHp - 5 }));
    B.edit(s => ({ ...s, currentHp: s.currentHp - 3 }));
    await vi.advanceTimersByTimeAsync(30000);
    expect(fs.getDoc(ID)!.currentHp).toBe(22);
    expect(A.sheets.get(ID)!.currentHp).toBe(22);
    expect(B.sheets.get(ID)!.currentHp).toBe(22);
  });

  it('e) entrada nueva de ipLog -> un solo createLogEntry', async () => {
    const { fs, A } = setup(undefined, true);
    A.engine.markLogsKnown(ID, 'ipLog', []);
    await vi.advanceTimersByTimeAsync(100);
    A.edit(s => ({
      ...s,
      ipLog: [{ id: 'l1', at: 'x', kind: 'earned', delta: 5, reason: 'r', balanceAfter: 5 }] as unknown as CharacterSheet['ipLog'],
    }));
    await vi.advanceTimersByTimeAsync(10000);
    expect(fs.ops.logCreates).toBe(1);
    expect(fs.logEntries(ID, 'ipLog')).toHaveLength(1);
    A.edit(s => ({ ...s, currentHp: s.currentHp - 1 }));
    await vi.advanceTimersByTimeAsync(10000);
    expect(fs.ops.logCreates).toBe(1);
    expect(A.engine.stats().logWrites).toBe(1);
  });

  it('f) error del adaptador una vez: reintenta con backoff y no se pierde el dato', async () => {
    let fail = 1;
    const { fs, A, B } = setup(a => ({
      ...a,
      updateDoc: async (...args) => {
        if (fail > 0) { fail--; throw new Error('unavailable'); }
        return a.updateDoc(...args);
      },
    }));
    await vi.advanceTimersByTimeAsync(100);
    A.edit(s => ({ ...s, currentHp: 12 }));
    await vi.advanceTimersByTimeAsync(2000);
    expect(A.errors).toHaveLength(1);
    expect(fs.ops.updates).toBe(0);
    await vi.advanceTimersByTimeAsync(10000);
    expect(fs.ops.updates).toBe(1);
    expect(fs.getDoc(ID)!.currentHp).toBe(12);
    expect(B.sheets.get(ID)!.currentHp).toBe(12);
  });

  // [Claude Code · 2026-10-24] En Firestore real la confirmación (snapshot sin escrituras pendientes) puede
  // llegar antes de que resuelva updateDoc. El increment no debe contarse dos veces.
  it('h) snapshot confirmado antes de que resuelva updateDoc: el daño cuenta una sola vez', async () => {
    const { fs, A, B } = setup(a => ({
      ...a,
      updateDoc: async (...args) => {
        await a.updateDoc(...args);
        await new Promise(r => setTimeout(r, 50)); // el snapshot (setTimeout 0) llega primero
      },
    }));
    await vi.advanceTimersByTimeAsync(100);
    A.edit(s => ({ ...s, currentHp: s.currentHp - 10 }));
    await vi.advanceTimersByTimeAsync(10000);
    expect(fs.ops.updates).toBe(1);
    expect(fs.getDoc(ID)!.currentHp).toBe(20);
    expect(A.sheets.get(ID)!.currentHp).toBe(20);
    expect(B.sheets.get(ID)!.currentHp).toBe(20);
    await vi.advanceTimersByTimeAsync(60000);
    expect(fs.ops.updates).toBe(1);
  });

  it('g) sin ediciones durante mucho tiempo: 0 escrituras', async () => {
    const { fs } = setup();
    await vi.advanceTimersByTimeAsync(60 * 60 * 1000);
    expect(fs.ops.updates).toBe(0);
    expect(fs.ops.logCreates).toBe(0);
  });
});
