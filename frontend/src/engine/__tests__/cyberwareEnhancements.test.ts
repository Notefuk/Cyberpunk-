// [Claude Code · 2026-11-14] v5.43.0 (plan 33): Cyberware Enhancements (CEMK DLC 02, pp.1-3).
import { describe, expect, it } from 'vitest';
import {
  CYBERWARE_ENHANCEMENTS, applyEnhancementToDamage, canInstallEnhancement, critRollsFor, enhancementById,
  enhancementForWeapon, weaponWithTungstenMode
} from '../../data/cemkCyberwareEnhancements';
import { calculateIncomingImpact, type IncomingImpactInput } from '../combatEngine';
import { rollCritOptions } from '../medicalRules';
import { rollCriticalInjury } from '../../data/criticalInjuries';
import type { RollEntry } from '../../types/cyberpunk';

const char2077 = { era: '2077' as const, installedCyberwareIds: ['cw-cemk-gorilla-arms', 'cw-cemk-mantis-blades', 'cw-cemk-monowire'], cyberwareEnhancements: {} as Record<string, string> };
const dmg = (over: Partial<RollEntry> = {}): RollEntry => ({ id: 'd', timestamp: '', type: 'damage', weaponName: 'x', diceResults: [6, 6, 2], isCriticalInjuryTrigger: true, baseDamageTotal: 14, critBonusDamage: 5, finalDamageTotal: 19, ...over });
const impact = (over: Partial<IncomingImpactInput>): IncomingImpactInput => ({ damage: 10, location: 'body', attackType: 'melee', isCritical: false, passExcess: false, headSp: 0, bodySp: 6, shieldSdp: 0, ...over });

describe('Cyberware Enhancements (CEMK DLC 02)', () => {
  it('9 mejoras, 3 por ciberware, con los precios de la tabla rápida (p.3)', () => {
    expect(CYBERWARE_ENHANCEMENTS).toHaveLength(9);
    expect(CYBERWARE_ENHANCEMENTS.map((e) => [e.name, e.cost])).toEqual([
      ['Hydraulic Ram', 1000], ['Pneumatic Actuation', 1000], ['Tungsten Reinforcement', 500],
      ['Double-Edged', 1000], ['Monomolecular Edge', 1000], ['Streamlined', 1000],
      ['Barbed Line', 1000], ['Electroshock', 500], ['Thermal-Bladed', 1000]
    ]);
  });
  it('solo 2077 y con el ciberware instalado', () => {
    const e = enhancementById('double-edged')!;
    expect(canInstallEnhancement(char2077, e).ok).toBe(true);
    expect(canInstallEnhancement({ ...char2077, era: '2045' }, e).ok).toBe(false);
    expect(canInstallEnhancement({ era: '2077', installedCyberwareIds: [] }, e).ok).toBe(false);
    const withEnh = { ...char2077, cyberwareEnhancements: { 'cw-cemk-mantis-blades': 'double-edged' } };
    expect(enhancementForWeapon(withEnh, { id: 'mantis-blades-2077' })?.name).toBe('Double-Edged');
    expect(enhancementForWeapon({ ...withEnh, era: '2045' }, { id: 'mantis-blades-2077' })).toBeUndefined();
  });
  it('Críticas para elegir: Monowire 2 (CEMK p.35), Barbed Line 3, Double-Edged 2', () => {
    expect(critRollsFor({ id: 'monowire-2077' }, undefined)).toBe(2);
    expect(critRollsFor({ id: 'monowire-2077' }, enhancementById('barbed-line'))).toBe(3);
    expect(critRollsFor({ id: 'mantis-blades-2077' }, enhancementById('double-edged'))).toBe(2);
    expect(critRollsFor({ id: 'gorilla-arms-2077' }, undefined)).toBe(1);
  });
  it('Pneumatic Actuation: el crítico hace +10 en vez de +5; sin crítico no cambia nada', () => {
    const e = enhancementById('pneumatic-actuation');
    expect(applyEnhancementToDamage(dmg(), { id: 'gorilla-arms-2077' }, e)).toMatchObject({ critBonusDamage: 10, finalDamageTotal: 24 });
    expect(applyEnhancementToDamage(dmg({ isCriticalInjuryTrigger: false, critBonusDamage: 0, finalDamageTotal: 14 }), { id: 'gorilla-arms-2077' }, e)).toMatchObject({ critBonusDamage: 0, finalDamageTotal: 14 });
  });
  it('Tungsten Reinforcement: Heavy 3d6 ROF 2 o Very Heavy 4d6 ROF 1', () => {
    const e = enhancementById('tungsten-reinforcement');
    expect(weaponWithTungstenMode({ damage: '3d6', rof: 2 }, e, 'veryHeavy')).toEqual({ damage: '4d6', rof: 1 });
    expect(weaponWithTungstenMode({ damage: '3d6', rof: 2 }, undefined, 'veryHeavy')).toEqual({ damage: '3d6', rof: 2 });
  });
  it('Monomolecular Edge ignora SP menor a 7 (antes de dividir); SP 7 o más funciona normal', () => {
    expect(calculateIncomingImpact(impact({ ignoreSpBelow7: true }))).toMatchObject({ effectiveSp: 0, hpLoss: 10, spAblation: 0 });
    expect(calculateIncomingImpact(impact({ ignoreSpBelow7: false }))).toMatchObject({ effectiveSp: 3, hpLoss: 7, spAblation: 1 });
    expect(calculateIncomingImpact(impact({ bodySp: 11, ignoreSpBelow7: true }))).toMatchObject({ effectiveSp: 6, hpLoss: 4 });
  });
  it('Thermal-Bladed: ablaciona 1 más, solo si ablaciona', () => {
    expect(calculateIncomingImpact(impact({ bodySp: 11, extraAblation: 1 })).spAblation).toBe(2);
    expect(calculateIncomingImpact(impact({ damage: 4, bodySp: 11, extraAblation: 1 })).spAblation).toBe(0);
  });
  it('rollCritOptions da opciones distintas en las dos tablas', () => {
    for (const table of ['cemk', 'core'] as const) {
      const o = rollCritOptions('body', 3, table, [], (loc, names) => rollCriticalInjury(loc, names));
      expect(o).toHaveLength(3);
      expect(new Set(o.map((x) => x.name)).size).toBe(3);
    }
  });
});
