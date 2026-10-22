// [Claude Code · 2026-10-23] Tests del Maker del Tech (Core pp. 147-149, 338-339).
import { describe, it, expect } from 'vitest';
import {
  priceCategoryForEb, makerDvAndTime, materialCost, vehicleUpgradeCategory, suggestedMakerSkill,
  rollMakerCheck, fieldExpertiseBonus, juryRigDurationMinutes, specialtyRank,
} from '../makerRules';

describe('makerRules', () => {
  it('priceCategoryForEb: umbrales de categoría (Core pp. 338-339)', () => {
    expect(priceCategoryForEb(5)).toBe('Cheap');
    expect(priceCategoryForEb(10)).toBe('Cheap');
    expect(priceCategoryForEb(20)).toBe('Everyday');
    expect(priceCategoryForEb(49)).toBe('Everyday');
    expect(priceCategoryForEb(50)).toBe('Costly');
    expect(priceCategoryForEb(100)).toBe('Premium');
    expect(priceCategoryForEb(500)).toBe('Expensive');
    expect(priceCategoryForEb(999)).toBe('Expensive');
    expect(priceCategoryForEb(1000)).toBe('Very Expensive');
    expect(priceCategoryForEb(5000)).toBe('Luxury');
    expect(priceCategoryForEb(12000)).toBe('Super Luxury');
  });

  it('makerDvAndTime: Premium DV 17 y 1 día (Core p.149)', () => {
    expect(makerDvAndTime('Premium')).toEqual({ dv: 17, timeLabel: '1 día', hours: 24 });
    expect(makerDvAndTime('Cheap').dv).toBe(9);
    expect(makerDvAndTime('Everyday').hours).toBe(1);
  });

  it('makerDvAndTime: Super Luxury 25000 €$ tarda 3 meses (Core p.149)', () => {
    const r = makerDvAndTime('Super Luxury', 25000);
    expect(r.dv).toBe(29);
    expect(r.hours).toBe(720 * 3);
    expect(r.timeLabel).toBe('3 meses');
  });

  it('materialCost: upgrade Expensive = 500 (misma categoría, Core p.148)', () => {
    expect(materialCost('upgrade', 'Expensive', 500).eb).toBe(500);
  });

  it('materialCost: fabrication Expensive = 100 (una categoría menos, Core p.149)', () => {
    expect(materialCost('fabrication', 'Expensive', 500).eb).toBe(100);
  });

  it('materialCost: fabrication Cheap = 5 (Core p.149)', () => {
    expect(materialCost('fabrication', 'Cheap', 10).eb).toBe(5);
  });

  it('materialCost: fabrication Super Luxury 20000 = 10000 (mitad del precio, Core p.149)', () => {
    expect(materialCost('fabrication', 'Super Luxury', 20000).eb).toBe(10000);
  });

  it('materialCost: invention lo fija el GM (Core p.149)', () => {
    expect(materialCost('invention', 'Expensive', 500).eb).toBeNull();
  });

  it('vehicleUpgradeCategory: Very Expensive (Core p.148)', () => {
    expect(vehicleUpgradeCategory()).toBe('Very Expensive');
  });

  it('suggestedMakerSkill: arma, ciberware y vehículo aéreo (Core p.148, decisión 5 plan 11)', () => {
    expect(suggestedMakerSkill('weapon')).toBe('Weaponstech');
    expect(suggestedMakerSkill('cyberware')).toBe('Cybertech');
    expect(suggestedMakerSkill('airVehicle')).toBe('Air Vehicle Tech');
  });

  it('rollMakerCheck: TECH + skill + especialidad + 1d10 con rng fijo (Core p.148)', () => {
    // rng 0.4 -> d10 = 5
    const r = rollMakerCheck({ tech: 8, skillLevel: 4, specialtyRank: 2, dv: 17, rng: () => 0.4 });
    expect(r.natural).toBe(5);
    expect(r.total).toBe(19);
    expect(r.success).toBe(true);
    const f = rollMakerCheck({ tech: 8, skillLevel: 4, specialtyRank: 1, dv: 17, rng: () => 0.4 });
    expect(f.total).toBe(18);
    const tie = rollMakerCheck({ tech: 8, skillLevel: 4, specialtyRank: 0, dv: 17, rng: () => 0.4 });
    expect(tie.total).toBe(17);
    expect(tie.success).toBe(false);
  });

  it('fieldExpertiseBonus: Weaponstech suma el rango, Handgun 0 (Core p.148)', () => {
    const alloc = { field: 4, upgrade: 2 };
    expect(fieldExpertiseBonus(alloc, 'Weaponstech')).toBe(4);
    expect(fieldExpertiseBonus(alloc, ' weaponstech ')).toBe(4);
    expect(fieldExpertiseBonus(alloc, 'Handgun')).toBe(0);
    expect(specialtyRank(alloc, 'upgrade')).toBe(2);
    expect(specialtyRank(undefined, 'invention')).toBe(0);
  });

  it('juryRigDurationMinutes: rango 4 = 40 minutos (Core p.148)', () => {
    expect(juryRigDurationMinutes(4)).toBe(40);
  });
});
