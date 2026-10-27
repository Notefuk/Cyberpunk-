// [Claude Code · 2026-10-27] v5.1.0 (plan 19, punto 2): encuentro unificado.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useEncounterStore,
  computeOrder,
  migrateLegacyEncounter,
  orderedCombatants,
  encounterEnemies,
  pcCombatantId,
  type EncounterCombatant
} from '../../store/encounterStore';
import { useCombatStore } from '../../store/useCombatStore';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';

class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

const enc = () => useEncounterStore.getState();
const sheet = ENEMIES_CATALOG[0];

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  enc().reset();
});

describe('encuentro unificado', () => {
  it('agrega enemigos del catálogo con HP y SP llenos y sufijo si son varios', () => {
    const ids = enc().addEnemyFromCatalog(sheet, 2);
    expect(ids).toHaveLength(2);
    const enemies = encounterEnemies(enc());
    expect(enemies.map((e) => e.name)).toEqual([`${sheet.name} #1`, `${sheet.name} #2`]);
    expect(enemies[0].currentHp).toBe(sheet.hp);
    expect(enemies[0].currentHeadSp).toBe(sheet.headSp);
    expect(enemies[0].catalogId).toBe(sheet.id);
    expect(enemies[0].instanceId).toBe(ids[0]);
  });

  it('un PJ entra una sola vez por ficha', () => {
    enc().addPc('a', 'Hardpoint');
    enc().addPc('a', 'Hardpoint', 'uid1');
    const pcs = enc().combatants.filter((c) => c.kind === 'pc');
    expect(pcs).toHaveLength(1);
    expect(pcs[0].id).toBe(pcCombatantId('a'));
    expect(pcs[0].ownerUid).toBe('uid1');
  });

  it('ordena por iniciativa, sin tirar al final, y la del enemigo queda en su ficha', () => {
    const [e1] = enc().addEnemyFromCatalog(sheet);
    const pc = enc().addPc('a', 'Hardpoint');
    const goon = enc().addQuickEnemy({ name: 'Goon', hp: 20, sp: 7, atkBase: 10, damageDice: '2d6' });
    enc().setInitiative(goon, 12);
    enc().setInitiative(pc, 15);
    expect(orderedCombatants(enc()).map((c) => c.id)).toEqual([pc, goon, e1]);
    enc().setInitiative(e1, 20);
    expect(enc().order).toEqual([e1, pc, goon]);
    expect(encounterEnemies(enc()).find((e) => e.instanceId === e1)!.initiative).toBe(20);
  });

  it('empates: el que llegó primero va antes', () => {
    const list: EncounterCombatant[] = [
      { id: 'x', kind: 'pc', name: 'X', initiative: 10 },
      { id: 'y', kind: 'pc', name: 'Y', initiative: 10 },
      { id: 'z', kind: 'pc', name: 'Z', initiative: null }
    ];
    expect(computeOrder(list)).toEqual(['x', 'y', 'z']);
  });

  it('HP y SP con tope; reparar SP vuelve al máximo', () => {
    const [id] = enc().addEnemyFromCatalog(sheet);
    enc().adjustEnemyHp(id, -1000);
    enc().adjustEnemySp(id, 'head', -1000);
    let e = encounterEnemies(enc())[0];
    expect(e.currentHp).toBe(0);
    expect(e.currentHeadSp).toBe(0);
    enc().adjustEnemyHp(id, 1000);
    enc().repairEnemySp(id);
    e = encounterEnemies(enc())[0];
    expect(e.currentHp).toBe(e.maxHp);
    expect(e.currentHeadSp).toBe(e.maxHeadSp);
  });

  it('daño: lo que pasa el SP baja HP, ablaciona 1, y en la cabeza se duplica (Core p.186)', () => {
    const id = enc().addQuickEnemy({ name: 'Goon', hp: 40, sp: 7, atkBase: 10, damageDice: '2d6' });
    expect(enc().applyEnemyDamage(id, 5, 'body')).toEqual({ penetrating: 0, hpLost: 0, newSp: 7, ablated: false });
    expect(enc().applyEnemyDamage(id, 10, 'head')).toEqual({ penetrating: 3, hpLost: 6, newSp: 6, ablated: true });
    const e = encounterEnemies(enc())[0];
    expect(e.currentHp).toBe(34);
    expect(e.currentHeadSp).toBe(6);
    expect(e.currentBodySp).toBe(7);
  });

  it('turnos: al pasar el último arranca otro round y useCombatStore lo sigue', () => {
    const a = enc().addPc('a', 'A');
    const b = enc().addPc('b', 'B');
    enc().setInitiative(a, 10);
    enc().setInitiative(b, 5);
    useCombatStore.setState({ netActionsSpent: 2 });
    expect(enc().order[enc().turnIndex]).toBe(a);
    enc().nextTurn();
    expect(enc().order[enc().turnIndex]).toBe(b);
    enc().nextTurn();
    expect(enc().round).toBe(2);
    expect(enc().turnIndex).toBe(0);
    expect(useCombatStore.getState().round).toBe(2);
    expect(useCombatStore.getState().netActionsSpent).toBe(0);
  });

  it('el turno sigue en quien lo tenía aunque cambie el orden o se borre otro', () => {
    const a = enc().addPc('a', 'A');
    const b = enc().addPc('b', 'B');
    const c = enc().addPc('c', 'C');
    enc().setInitiative(a, 10);
    enc().setInitiative(b, 8);
    enc().setInitiative(c, 6);
    enc().nextTurn();
    expect(enc().order[enc().turnIndex]).toBe(b);
    enc().setInitiative(c, 20);
    expect(enc().order[enc().turnIndex]).toBe(b);
    enc().remove(a);
    expect(enc().order[enc().turnIndex]).toBe(b);
  });

  it('antes del primer turno, el turno es del que tiene más iniciativa', () => {
    const e = enc().addQuickEnemy({ name: 'Goon', hp: 20, sp: 7, atkBase: 10, damageDice: '2d6' });
    enc().setInitiative(e, 8);
    const pc = enc().addPc('a', 'A');
    enc().setInitiative(pc, 15);
    expect(enc().order[enc().turnIndex]).toBe(pc);
  });

  it('vaciar enemigos deja a los PJ; reset deja todo en cero', () => {
    enc().addEnemyFromCatalog(sheet, 3);
    enc().addPc('a', 'A');
    enc().clearEnemies();
    expect(enc().combatants.map((c) => c.kind)).toEqual(['pc']);
    enc().nextRound();
    enc().reset();
    expect(enc().combatants).toEqual([]);
    expect(enc().round).toBe(1);
    expect(useCombatStore.getState().round).toBe(1);
  });

  it('migra el encuentro viejo (cpr_active_encounter_v1)', () => {
    const old = [{ instanceId: 'enc-1', catalogId: sheet.id, name: 'Viejo', currentHp: 5, maxHp: 30, initiative: 14 }, { basura: true }];
    const data = migrateLegacyEncounter(JSON.stringify(old));
    expect(data.combatants).toHaveLength(1);
    expect(data.combatants[0]).toMatchObject({ id: 'enc-1', kind: 'enemy', name: 'Viejo', initiative: 14 });
    expect(data.combatants[0].enemy!.currentHp).toBe(5);
    expect(data.order).toEqual(['enc-1']);
    expect(migrateLegacyEncounter('no es json').combatants).toEqual([]);
    expect(migrateLegacyEncounter(null).combatants).toEqual([]);
  });
});
