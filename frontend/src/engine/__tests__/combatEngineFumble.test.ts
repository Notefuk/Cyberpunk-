// Fumble Recovery en createInitialAttackRoll. Core p.146. [Claude Code · 2026-10-22]
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialAttackRoll } from '../combatEngine';
import type { CharacterSheet, WeaponItem } from '../../types/cyberpunk';

const sheet = { stats: { REF: 8 }, skills: [], cyberware: [], inventory: [] } as unknown as CharacterSheet;
const weapon = { name: 'Test', damage: '3d6', type: 'Pistol' } as unknown as WeaponItem;

afterEach(() => vi.restoreAllMocks());

describe('createInitialAttackRoll Fumble Recovery (Core p.146)', () => {
  it('sin Fumble Recovery, un 1 natural es fallo crítico y pide el dado de pifia', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const r = createInitialAttackRoll(sheet, weapon, {});
    expect(r.d10).toBe(1);
    expect(r.isCritFail).toBe(true);
    expect(r.needsExplosionClick).toBe(true);
  });
  it('con Fumble Recovery, el 1 natural no pifia y sigue valiendo 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const r = createInitialAttackRoll(sheet, weapon, {}, 'none', { ignoreCriticalFailure: true });
    expect(r.d10).toBe(1);
    expect(r.isCritFail).toBe(false);
    expect(r.needsExplosionClick).toBe(false);
    expect(r.explosionType).toBeNull();
    expect(r.penaltyBreakdown?.some(l => l.includes('Fumble Recovery'))).toBe(true);
  });
  it('con Fumble Recovery, un 10 sigue explotando', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const r = createInitialAttackRoll(sheet, weapon, {}, 'none', { ignoreCriticalFailure: true });
    expect(r.d10).toBe(10);
    expect(r.isCritSuccess).toBe(true);
    expect(r.needsExplosionClick).toBe(true);
  });
});
