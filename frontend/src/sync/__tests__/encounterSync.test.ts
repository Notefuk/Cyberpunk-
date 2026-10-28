// [Claude Code · 2026-10-27] v5.1.0 (plan 19, punto 3): encuentro compartido.
// Un solo encounterStore por proceso: cada test hace de GM o de jugador contra una "nube" en memoria.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createEncounterSync,
  publicToEncounter,
  type EncounterAdapter,
  type EncounterCommit,
  type EncounterHead,
  type PublicCombatant
} from '../encounterSync';
import { useEncounterStore, encounterEnemies, pcCombatantId, type EncounterEnemy } from '../../store/encounterStore';
import { useCombatStore } from '../../store/useCombatStore';

class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

function fakeCloud() {
  let head: EncounterHead | null = null;
  const pub = new Map<string, PublicCombatant>();
  const gm = new Map<string, EncounterEnemy>();
  const headSubs: ((h: EncounterHead | null) => void)[] = [];
  const listSubs: ((l: { id: string; data: PublicCombatant }[]) => void)[] = [];
  const commits: EncounterCommit[] = [];
  const myPcWrites: { id: string; data: PublicCombatant; exists: boolean }[] = [];
  const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
  const emit = () => {
    for (const cb of headSubs) cb(head ? clone(head) : null);
    const list = [...pub].map(([id, data]) => ({ id, data: clone(data) }));
    for (const cb of listSubs) cb(list);
  };
  const adapter: EncounterAdapter = {
    subscribeHead(cb) { headSubs.push(cb); cb(head ? clone(head) : null); return () => headSubs.splice(headSubs.indexOf(cb), 1); },
    subscribeCombatants(cb) { listSubs.push(cb); cb([...pub].map(([id, data]) => ({ id, data: clone(data) }))); return () => listSubs.splice(listSubs.indexOf(cb), 1); },
    async loadGmCombatants() { return Object.fromEntries([...gm].map(([k, v]) => [k, clone(v)])); },
    async commit(c) {
      commits.push(clone(c));
      if (c.head) head = clone(c.head);
      for (const w of c.set) (w.coll === 'combatants' ? pub : gm).set(w.id, clone(w.data) as never);
      for (const w of c.del) (w.coll === 'combatants' ? pub : gm).delete(w.id);
      emit();
    },
    async writeMyPc(id, data, exists) {
      myPcWrites.push({ id, data: clone(data), exists });
      pub.set(id, exists ? { ...pub.get(id)!, initiative: data.initiative } : clone(data));
      emit();
    }
  };
  return {
    adapter, commits, myPcWrites, pub, gm,
    get head() { return head; },
    /** Lo que escribe otro dispositivo (el jugador, o el GM visto desde el jugador). */
    remote(h: EncounterHead | null, list: [string, PublicCombatant][]) {
      head = h;
      pub.clear();
      for (const [id, d] of list) pub.set(id, d);
      emit();
    }
  };
}

const enc = () => useEncounterStore.getState();
const goon = () => enc().addQuickEnemy({ name: 'Goon', hp: 40, sp: 7, atkBase: 10, damageDice: '2d6' });
const tick = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  enc().reset();
});

describe('encuentro compartido: GM', () => {
  it('publica orden, vista pública y enemigo completo en una escritura agrupada', async () => {
    const cloud = fakeCloud();
    const sync = createEncounterSync({ adapter: cloud.adapter, role: 'gm', uid: 'gm', ownerOf: () => 'gm', flushMs: 5 });
    sync.start();
    await tick();
    const id = goon();
    enc().setInitiative(id, 12);
    await sync.flushNow();
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    expect(cloud.head).toMatchObject({ round: 1, order: [id] });
    expect(cloud.pub.get(id)).toMatchObject({ kind: 'enemy', name: 'Goon', initiative: 12, woundState: 'none' });
    expect(cloud.pub.get(id)).not.toHaveProperty('currentHp');
    expect(cloud.gm.get(id)!.currentHp).toBe(40);
    sync.stop();
  });

  it('un cambio de HP solo reescribe la vista pública si cambia el estado de heridas', async () => {
    const cloud = fakeCloud();
    const sync = createEncounterSync({ adapter: cloud.adapter, role: 'gm', uid: 'gm', ownerOf: () => 'gm', flushMs: 5 });
    sync.start();
    await tick();
    const id = goon();
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    const before = cloud.commits.length;
    enc().adjustEnemyHp(id, -1); // 39/40: Lightly Wounded
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    const c1 = cloud.commits.slice(before);
    expect(c1.flatMap((c) => c.set.map((w) => w.coll)).sort()).toEqual(['combatants', 'gmCombatants']);
    enc().adjustEnemyHp(id, -1); // 38/40: sigue Lightly Wounded
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    const c2 = cloud.commits.slice(before + c1.length);
    expect(c2.flatMap((c) => c.set.map((w) => w.coll))).toEqual(['gmCombatants']);
    enc().adjustEnemyHp(id, -20); // 18/40: Seriously Wounded
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    expect(cloud.pub.get(id)!.woundState).toBe('serious');
    sync.stop();
  });

  it('sin cambios no escribe (el eco de su propia escritura no vuelve a salir)', async () => {
    const cloud = fakeCloud();
    const sync = createEncounterSync({ adapter: cloud.adapter, role: 'gm', uid: 'gm', ownerOf: () => 'gm', flushMs: 5 });
    sync.start();
    await tick();
    goon();
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    const n = cloud.commits.length;
    useEncounterStore.setState({}); // notifica sin cambiar nada
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    expect(cloud.commits.length).toBe(n);
    sync.stop();
  });

  it('toma la iniciativa que tira un jugador y reordena', async () => {
    const cloud = fakeCloud();
    const sync = createEncounterSync({ adapter: cloud.adapter, role: 'gm', uid: 'gm', ownerOf: () => 'gm', flushMs: 5 });
    sync.start();
    await tick();
    const g = goon();
    enc().setInitiative(g, 10);
    await new Promise((r) => setTimeout(r, 20));
    await sync.flushNow();
    // El jugador se suma solo con su PJ.
    cloud.pub.set('pc-c1', { kind: 'pc', name: 'Vex', initiative: 18, charId: 'c1', ownerUid: 'alice' });
    cloud.remote(cloud.head, [...cloud.pub]);
    expect(enc().order).toEqual(['pc-c1', g]);
    expect(enc().combatants.find((c) => c.id === 'pc-c1')!.ownerUid).toBe('alice');
    sync.stop();
  });

  it('un dispositivo del GM sin encuentro toma el de la nube, con los enemigos completos', async () => {
    const cloud = fakeCloud();
    const enemy = { instanceId: 'e1', name: 'Boss', currentHp: 12, maxHp: 50, threatTier: 'boss' } as unknown as EncounterEnemy;
    cloud.gm.set('e1', enemy);
    cloud.remote({ round: 3, turnIndex: 0, order: ['e1'] }, [['e1', { kind: 'enemy', name: 'Boss', initiative: 15, woundState: 'serious', threatTier: 'boss' }]]);
    const sync = createEncounterSync({ adapter: cloud.adapter, role: 'gm', uid: 'gm', ownerOf: () => 'gm', flushMs: 5 });
    sync.start();
    await new Promise((r) => setTimeout(r, 10));
    expect(enc().round).toBe(3);
    expect(encounterEnemies(enc())[0].currentHp).toBe(12);
    expect(cloud.commits.length).toBe(0);
    sync.stop();
  });
});

describe('encuentro compartido: jugador', () => {
  it('ve la vista pública en el orden del GM, sin HP, y el round le resetea lo suyo', async () => {
    const cloud = fakeCloud();
    cloud.remote({ round: 1, turnIndex: 1, order: ['e1', 'pc-c1'] }, [
      ['pc-c1', { kind: 'pc', name: 'Vex', initiative: 9, charId: 'c1', ownerUid: 'alice' }],
      ['e1', { kind: 'enemy', name: 'Goon', initiative: 14, woundState: 'light' }]
    ]);
    const sync = createEncounterSync({ adapter: cloud.adapter, role: 'player', uid: 'alice', ownerOf: () => undefined });
    sync.start();
    expect(enc().order).toEqual(['e1', 'pc-c1']);
    expect(enc().turnIndex).toBe(1);
    expect(enc().combatants.find((c) => c.id === 'e1')).toMatchObject({ woundState: 'light' });
    expect(encounterEnemies(enc())).toEqual([]);
    useCombatStore.setState({ netActionsSpent: 3 });
    cloud.remote({ round: 2, turnIndex: 0, order: ['e1', 'pc-c1'] }, [...cloud.pub]);
    expect(enc().round).toBe(2);
    expect(useCombatStore.getState().round).toBe(2);
    expect(useCombatStore.getState().netActionsSpent).toBe(0);
    sync.stop();
    // Al dejar la mesa, la copia del encuentro del GM no queda en el dispositivo.
    expect(enc().combatants).toEqual([]);
    expect(enc().round).toBe(1);
  });

  it('tira iniciativa: crea su PJ la primera vez y después solo cambia la iniciativa', async () => {
    const cloud = fakeCloud();
    const sync = createEncounterSync({ adapter: cloud.adapter, role: 'player', uid: 'alice', ownerOf: () => undefined });
    sync.start();
    await sync.setMyInitiative('c1', 'Vex', 16);
    await sync.setMyInitiative('c1', 'Vex', 11);
    expect(cloud.myPcWrites).toEqual([
      { id: pcCombatantId('c1'), data: { kind: 'pc', name: 'Vex', initiative: 16, charId: 'c1', ownerUid: 'alice' }, exists: false },
      { id: pcCombatantId('c1'), data: { initiative: 11 }, exists: true }
    ]);
    expect(enc().combatants.find((c) => c.id === 'pc-c1')!.initiative).toBe(11);
    expect(cloud.commits).toEqual([]);
    sync.stop();
  });

  it('publicToEncounter ordena solo si el orden del GM no cubre a todos', () => {
    const data = publicToEncounter({ round: 1, turnIndex: 0, order: ['a'] }, [
      { id: 'a', data: { kind: 'pc', name: 'A', initiative: 5 } },
      { id: 'b', data: { kind: 'enemy', name: 'B', initiative: 9 } }
    ]);
    expect(data.order).toEqual(['b', 'a']);
  });
});
