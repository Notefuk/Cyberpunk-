// [Claude Code · 2026-11-12] v5.22.0 (plan 28): actores guardados del GM.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import { useEncounterStore } from '../../store/encounterStore';
import { useGmActors, syncActorsFromEncounter, commitActors } from '../../store/gmActorsStore';
import { spawnActorsFromSheet, spawnQuickActor, bringActorBack, duplicateActor, healActor } from '../../features/gmmode/actorSpawn';
import { nextActorName, reloadAmmo, spendAmmo, baseName } from '../gmActors';

const bodyguard = ENEMIES_CATALOG.find((e) => e.id === 'hardened-bodyguard')!;

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  get length() { return this.m.size; }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  useEncounterStore.getState().reset();
  useGmActors.setState({ actors: [], cloud: false });
});

describe('Nombres y balas', () => {
  it('numera según los actores que ya existen', () => {
    expect(nextActorName('Guardia', [])).toBe('Guardia 1');
    expect(nextActorName('Guardia', ['Guardia 1', 'Guardia 3', 'Otro 7'])).toBe('Guardia 4');
    expect(nextActorName('Ganger #2', ['Ganger 1'])).toBe('Ganger 2');
    expect(baseName('Guardia 12')).toBe('Guardia');
  });

  it('Reload (Core p.169) llena el cargador con lo que haya de reserva', () => {
    expect(reloadAmmo([{ current: 1, reserve: 10 }], 0, 8)).toEqual([{ current: 8, reserve: 3 }]);
    expect(reloadAmmo([{ current: 0, reserve: 3 }], 0, 8)).toEqual([{ current: 3, reserve: 0 }]);
    expect(spendAmmo([{ current: 2, reserve: 0 }], 0, 5)).toEqual([{ current: 0, reserve: 0 }]);
  });
});

describe('Ciclo de un actor', () => {
  it('spawnear 2 guardias, herir a uno y gastarle balas, sacarlo y traerlo: vuelve igual', () => {
    const [id1, id2] = spawnActorsFromSheet(bodyguard, 2);
    const actors = useGmActors.getState().actors;
    expect(actors.map((a) => a.name).sort()).toEqual(['Hardened Bodyguard 1', 'Hardened Bodyguard 2']);
    expect(actors.every((a) => !a.sheet)).toBe(true); // del bestiario: no copia la ficha

    const enc = useEncounterStore.getState();
    enc.applyEnemyDamage(id1, 20, 'body'); // SP 11: pasan 9 y el SP baja a 10 (Core p.186)
    enc.spendEnemyAmmo(id1, 0, 3);
    enc.addEnemyInjury(id1, 'Broken Arm (cuerpo)');
    syncActorsFromEncounter();

    const actorId = useEncounterStore.getState().combatants.find((c) => c.id === id1)!.enemy!.actorId!;
    useEncounterStore.getState().remove(id1);
    const saved = useGmActors.getState().actors.find((a) => a.id === actorId)!;
    expect(saved.state.hp).toBe(31);
    expect(saved.state.bodySp).toBe(10);
    expect(saved.state.ammo[0].current).toBe(bodyguard.weapons[0].mag - 3);
    expect(saved.state.injuries).toEqual(['Broken Arm (cuerpo)']);

    const back = bringActorBack(saved)!;
    const e = useEncounterStore.getState().combatants.find((c) => c.id === back)!.enemy!;
    expect(e.currentHp).toBe(31);
    expect(e.currentBodySp).toBe(10);
    expect(e.ammo![0].current).toBe(bodyguard.weapons[0].mag - 3);
    expect(e.injuries).toEqual(['Broken Arm (cuerpo)']);
    expect(useEncounterStore.getState().combatants.some((c) => c.id === id2)).toBe(true);
  });

  it('se guarda en este navegador sin mesa', () => {
    spawnActorsFromSheet(bodyguard, 1);
    expect(JSON.parse(localStorage.getItem('cpr_gm_actors_v1')!)).toHaveLength(1);
  });

  it('PNJ propio: guarda la copia de la ficha', () => {
    spawnActorsFromSheet({ ...bodyguard, id: 'custom-npc-x', name: 'Matón' }, 1);
    const a = useGmActors.getState().actors[0];
    expect(a.name).toBe('Matón 1');
    expect(a.sheet?.id).toBe('custom-npc-x');
  });

  it('enemigo rápido, duplicar y curar a tope', () => {
    spawnQuickActor({ name: 'Ganger', hp: 20, sp: 7, atkBase: 10, damageDice: '2d6' });
    const a = useGmActors.getState().actors[0];
    expect(a.quick?.damageDice).toBe('2d6');
    const copy = duplicateActor(a)!;
    expect(copy.name).toBe('Ganger 2');

    commitActors(useGmActors.getState().actors.map((x) => (x.id === copy.id ? { ...x, state: { ...x.state, hp: 3, injuries: ['x'] } } : x)));
    healActor(useGmActors.getState().actors.find((x) => x.id === copy.id)!);
    const healed = useGmActors.getState().actors.find((x) => x.id === copy.id)!;
    expect(healed.state.hp).toBe(20);
    expect(healed.state.injuries).toEqual([]);
  });
});
