// [Claude Code · 2026-11-12] v5.27.0 (plan 30): el PJ pilotea una ACPA ("Solo of Fortune 2045", IR5 pp.133-134).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterStore } from '../../store/useCharacterStore';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import { ACPA_PREBUILTS } from '../../data/acpaData';
import { acpaStateFromPrebuilt, isPilotingAcpa, resolveHitOnAcpa } from '../acpa';
import { calculateWeaponAttackBreakdown, getEffectiveMove } from '../characterEngine';
import { applyHitToPc } from '../../features/gm/gmDamage';
import { buildPartySummary } from '../../sync/partySummary';
import type { ActiveAcpaState, CharacterSheet, WeaponItem } from '../../types/cyberpunk';

class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

const prebuilt = (id: string) => acpaStateFromPrebuilt(ACPA_PREBUILTS.find((p) => p.id === id)!);
// Nyx: 28 HP, 16 SP, BODY 16, +3 MOVE, -1 DEX (IR5 p.140).
const nyx = (over: Partial<ActiveAcpaState> = {}): ActiveAcpaState => ({ ...prebuilt('metacorp-nyx'), isPiloting: true, ...over });

function sheet(over: Partial<CharacterSheet> = {}): CharacterSheet {
  return {
    ...structuredClone(CEMK_FOLIO_PREMADE_CHARACTERS[0]),
    id: 'p',
    activeInjuries: [],
    deathSavePenalty: 0,
    isDead: false,
    fbcState: undefined,
    headArmor: { name: 'Kevlar', maxSp: 7, currentSp: 7, penalty: 0 },
    bodyArmor: { name: 'Kevlar', maxSp: 7, currentSp: 7, penalty: 0 },
    ...over,
  };
}
const get = () => useCharacterStore.getState().characters.find((c) => c.id === 'p')!;

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  useCharacterStore.setState({ characters: [sheet()], activeCharacterId: 'p' });
});

describe('Golpe a un PJ dentro de una ACPA (IR5 p.133)', () => {
  it('lo recibe la ACPA: baja su HP y su SP, no el del piloto ni su armadura', () => {
    useCharacterStore.getState().setAcpaFor('p', nyx());
    const hpBefore = get().currentHp;
    applyHitToPc('p', { damage: 24, location: 'head', attackType: 'standard', isCritical: false }, 'test');
    expect(get().acpaState).toMatchObject({ hp: 20, sp: 15 }); // 24 - 16 = 8, sin x2 a la cabeza
    expect(get().currentHp).toBe(hpBefore);
    expect(get().headArmor.currentSp).toBe(7);
  });

  it('la crítica no es herida: 5 directo al piloto', () => {
    useCharacterStore.getState().setAcpaFor('p', nyx());
    const hpBefore = get().currentHp;
    applyHitToPc('p', { damage: 10, location: 'body', attackType: 'standard', isCritical: true }, 'test');
    expect(get().acpaState?.hp).toBe(28);
    expect(get().currentHp).toBe(hpBefore - 5);
    expect(get().activeInjuries).toHaveLength(0);
  });

  it('un piloto FBC no recibe nada por la crítica', () => {
    const r = resolveHitOnAcpa(nyx(), { damage: 10, attackType: 'standard', isCritical: true }, true);
    expect(r.pilotDamage).toBe(0);
  });

  it('destruida deja de proteger: el golpe siguiente va al piloto', () => {
    useCharacterStore.getState().setAcpaFor('p', nyx({ hp: 2 }));
    applyHitToPc('p', { damage: 30, location: 'body', attackType: 'standard', isCritical: false }, 'test');
    expect(get().acpaState?.hp).toBe(0);
    expect(isPilotingAcpa(get())).toBe(false);
    const hpBefore = get().currentHp;
    applyHitToPc('p', { damage: 17, location: 'body', attackType: 'standard', isCritical: false }, 'test');
    expect(get().currentHp).toBe(hpBefore - 10);
  });

  it('fuera de la ACPA el golpe es normal', () => {
    useCharacterStore.getState().setAcpaFor('p', nyx({ isPiloting: false }));
    const hpBefore = get().currentHp;
    applyHitToPc('p', { damage: 17, location: 'body', attackType: 'standard', isCritical: false }, 'test');
    expect(get().currentHp).toBe(hpBefore - 10);
    expect(get().acpaState?.hp).toBe(28);
  });
});

describe('Stats del piloto (IR5 p.134)', () => {
  it('MOVE con el mod de la ACPA solo mientras pilotea', () => {
    const base = getEffectiveMove(sheet());
    expect(getEffectiveMove(sheet({ acpaState: nyx() }))).toBe(base + 3);
    expect(getEffectiveMove(sheet({ acpaState: nyx({ isPiloting: false }) }))).toBe(base);
    expect(getEffectiveMove(sheet({ acpaState: nyx({ hp: 0 }) }))).toBe(base);
  });

  it('el DEX de un ataque Melee lleva el -1 de la Nyx', () => {
    const knife = { id: 'k', name: 'Knife', skill: 'Melee Weapon', damage: '1d6', rof: 2 } as unknown as WeaponItem;
    const out = calculateWeaponAttackBreakdown(sheet(), knife);
    const inAcpa = calculateWeaponAttackBreakdown(sheet({ acpaState: nyx() }), knife);
    expect(inAcpa.statVal).toBe(Math.max(0, out.statVal - 1));
  });

  it('quitar la ACPA borra el campo', () => {
    useCharacterStore.getState().setAcpaFor('p', nyx());
    useCharacterStore.getState().setAcpaFor('p', undefined);
    expect('acpaState' in get()).toBe(false);
  });
});

describe('Party', () => {
  it('el resumen muestra la ACPA solo si pilotea', () => {
    expect(buildPartySummary(sheet({ acpaState: nyx() }), 'u', 'n').acpa).toEqual({ name: 'MetaCorp Nyx', hp: 28, maxHp: 28, sp: 16, maxSp: 16 });
    expect(buildPartySummary(sheet({ acpaState: nyx({ isPiloting: false }) }), 'u', 'n').acpa).toBeUndefined();
  });
});
