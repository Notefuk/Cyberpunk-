// [Claude Code · 2026-11-12] v5.28.0 (plan 30): enemigos del GM en ACPA ("Solo of Fortune 2045", IR5 pp.133-142).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ACPA_PREBUILTS } from '../../data/acpaData';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import { acpaStateFromPrebuilt } from '../acpa';
import { acpaAttackMod, boardEnemy, onboardWeaponProfiles, parseOnboardWeapon, unboardEnemy } from '../acpaActors';
import { actorStateFromEnemy, applyActorState, healedState } from '../gmActors';
import { useEncounterStore, type EncounterEnemy } from '../../store/encounterStore';

class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

const acpa = (id: string) => acpaStateFromPrebuilt(ACPA_PREBUILTS.find((p) => p.id === id)!);

describe('Armas Onboard de las ACPA de fábrica (IR5 pp.138-142)', () => {
  it('lee cantidad, Excellent Quality y accesorios', () => {
    expect(parseOnboardWeapon('EQ Rocket Launcher w/ Drum Magazine & Long Tube (x4)')).toEqual({ name: 'Rocket Launcher', count: 4, excellent: true, attachments: 'Drum Magazine & Long Tube' });
    expect(parseOnboardWeapon('Arasaka Neo Rapid Assault 16 (TUp +1 Attachment Slot) w/ Smartgun Link')).toMatchObject({ name: 'Arasaka Neo Rapid Assault 16', count: 1, excellent: false });
    expect(parseOnboardWeapon('Tsunami Arms Helix (Citrus Edition) w/ Smartgun Link').name).toBe('Tsunami Arms Helix (Citrus Edition)');
  });

  it('todas las armas Onboard de las 10 están en el catálogo', () => {
    const e = { weapons: [], stats: { REF: 6, DEX: 6 } } as unknown as EncounterEnemy;
    for (const p of ACPA_PREBUILTS) {
      const expected = p.onboardWeapons.reduce((n, w) => n + parseOnboardWeapon(w).count, 0);
      expect(onboardWeaponProfiles(p, e), p.id).toHaveLength(expected);
    }
  });
});

describe('Subir y bajar a un enemigo', () => {
  const guard = (): EncounterEnemy => {
    const sheet = ENEMIES_CATALOG.find((s) => s.weapons.some((w) => w.mag > 0))!;
    return {
      instanceId: 'e1', catalogId: sheet.id, name: 'Guardia 1', subtitle: '', faction: '', threatTier: sheet.threatTier, era: '2045', role: '',
      currentHp: 30, maxHp: 30, currentHeadSp: 11, maxHeadSp: 11, currentBodySp: 11, maxBodySp: 11, initiative: null,
      stats: sheet.stats, weapons: sheet.weapons.map((w) => ({ ...w })), combatBases: [], specialRules: [],
    } as EncounterEnemy;
  };

  it('suma las Onboard al final y las saca al bajar', () => {
    const g = guard();
    const n = g.weapons.length;
    const b = boardEnemy(g, acpa('militech-commando'));
    expect(b.weapons).toHaveLength(n + 2);
    expect(b.weapons[n].name).toBe('Militech MK.27 LMG (Onboard)');
    expect(b.ammo).toHaveLength(n + 2);
    const u = unboardEnemy(b);
    expect(u.weapons).toHaveLength(n);
    expect(u.acpa).toBeUndefined();
  });

  it('el ataque lleva el mod de REF o DEX solo si la ACPA protege', () => {
    const b = boardEnemy(guard(), acpa('sovoil-bombardier')); // -1 REF, -1 DEX
    expect(acpaAttackMod(b, { mag: 30, skill: 'Shoulder Arms' })).toBe(-1);
    expect(acpaAttackMod({ acpa: { ...b.acpa!, hp: 0 } }, { mag: 30 })).toBe(0);
  });

  it('el actor guardado vuelve en la ACPA con su HP, SP y armas Onboard', () => {
    const b = boardEnemy(guard(), acpa('zetatech-grasshopper'));
    const hurt = { ...b, acpa: { ...b.acpa!, hp: 9, sp: 14 } };
    const state = actorStateFromEnemy(hurt);
    const back = applyActorState(guard(), state);
    expect(back.acpa).toMatchObject({ hp: 9, sp: 14, isPiloting: true });
    expect(back.weapons.at(-1)?.name).toBe('Militech "Big Boomer" (Onboard)');
    expect(healedState(state, []).acpa).toMatchObject({ hp: 18, sp: 15 });
  });
});

describe('Daño a un enemigo en ACPA (IR5 pp.133-134)', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    useEncounterStore.getState().reset();
  });

  it('lo recibe la ACPA, sin x2 en la cabeza; destruida, pasa al piloto', () => {
    const st = useEncounterStore.getState;
    const sheet = ENEMIES_CATALOG[0];
    const [id] = st().addEnemyFromCatalog(sheet);
    st().setEnemyAcpa(id, acpa('arasaka-neo-guardian')); // 25 HP, 16 SP
    const hp0 = st().combatants.find((c) => c.id === id)!.enemy!.currentHp;
    const r = st().applyEnemyDamage(id, 20, 'head')!;
    expect(r.acpa).toEqual({ hp: 21, destroyed: false });
    const e = st().combatants.find((c) => c.id === id)!.enemy!;
    expect(e.currentHp).toBe(hp0);
    expect(e.acpa).toMatchObject({ hp: 21, sp: 15 });
    st().applyEnemyDamage(id, 60, 'body');
    expect(st().combatants.find((c) => c.id === id)!.enemy!.acpa?.hp).toBe(0);
    const r2 = st().applyEnemyDamage(id, 30, 'body')!;
    expect(r2.acpa).toBeUndefined();
    expect(st().combatants.find((c) => c.id === id)!.enemy!.currentHp).toBeLessThan(hp0);
  });
});
