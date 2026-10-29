// Tests del creador v5.4.0 (plan 21): idiomas, paquete en Complete Package, lifepath propio y reparto de rol. [Claude Code · 2026-10-29]
import { describe, expect, it } from 'vitest';
import { buildCharacterSheetFromDraft, createEmptyDraft, getStartingMoney, getSkillPointsSpent, usesRolePackage, validateStep, type CreatorDraft } from '../characterCreation';
import { AUTOFIRE_RULES, WEAPON_SKILL_GUIDE } from '../../data/creation/weaponSkillGuide';

const cp = (extra: Partial<CreatorDraft> = {}): CreatorDraft => ({
  ...createEmptyDraft(),
  era: '2045',
  method: 'complete_package',
  role: 'Medtech',
  culturalLanguage: 'Spanish',
  handle: 'Tester',
  ...extra
});

describe('Idiomas (Core p.45, p.84, p.85 y p.90)', () => {
  it('el idioma de origen es uno solo a 4 y no gasta puntos; uno extra se paga', () => {
    const d = cp({ skills: { 'Language (Streetslang)': 2, 'Language (Japanese)': 3 } });
    expect(getSkillPointsSpent(d)).toBe(5);
    const { sheet } = buildCharacterSheetFromDraft(d, 'lang-test');
    expect(sheet.generalSkills?.['Language (Spanish)']).toBe(4);
    expect(sheet.generalSkills?.['Language (Japanese)']).toBe(3);
    expect(sheet.generalSkills?.['Language (Streetslang)']).toBe(2);
  });

  it('un idioma extra no rompe el mínimo de Streetslang', () => {
    const d = cp({ skills: { 'Language (Japanese)': 1, 'Language (Streetslang)': 2 } });
    expect(validateStep(d, 'skills').some((e) => e.includes('Language debe empezar en 2'))).toBe(false);
    const bad = cp({ skills: { 'Language (Japanese)': 3, 'Language (Streetslang)': 1 } });
    expect(validateStep(bad, 'skills').some((e) => e.includes('Language debe empezar en 2'))).toBe(true);
  });
});

describe('Paquete del rol en Complete Package (variante de mesa, Core p.98 / p.104)', () => {
  it('sin paquete: 2.550 €$; con paquete: 500 €$ y la moda igual', () => {
    expect(getStartingMoney(cp()).cash).toBe(2550);
    expect(usesRolePackage(cp())).toBe(false);
    const withPkg = cp({ cpUsePackage: true });
    expect(usesRolePackage(withPkg)).toBe(true);
    expect(getStartingMoney(withPkg).cash).toBe(500);
    expect(getStartingMoney(withPkg).fashionBudget).toBe(800);
  });

  it('con paquete, las armas del rol llegan a la ficha', () => {
    const { sheet: base } = buildCharacterSheetFromDraft(cp(), 'no-pkg');
    const { sheet } = buildCharacterSheetFromDraft(cp({ cpUsePackage: true }), 'pkg');
    expect(sheet.equippedWeapons.length).toBeGreaterThan(base.equippedWeapons.length);
  });
});

describe('Lifepath con texto propio', () => {
  it('un resultado escrito a mano llega a la ficha', () => {
    const d = cp({ lifepath: { cultural_origins: { roll: null, value: 'Colonia lunar de Tycho' } } });
    const { sheet } = buildCharacterSheetFromDraft(d, 'lp-test');
    expect(JSON.stringify(sheet.lifepath)).toContain('Colonia lunar de Tycho');
  });
});

describe('Reparto de la habilidad de rol en el creador (Core pp.147-150)', () => {
  it('Medicine del Medtech llega a la ficha', () => {
    const d = cp({ medicineAllocation: { surgery: 2, pharmaceuticals: 1, cryosystem: 1, knownPharmaceuticals: ['Speedheal'] } });
    const { sheet } = buildCharacterSheetFromDraft(d, 'med-test');
    expect(sheet.medicineAllocation).toEqual({ surgery: 2, pharmaceuticals: 1, cryosystem: 1, knownPharmaceuticals: ['Speedheal'] });
  });

  it('Maker del Tech llega a la ficha; un Medtech no recibe Maker', () => {
    const tech = cp({ role: 'Tech', makerAllocation: { field: 2, upgrade: 1, fabrication: 1, invention: 0 } });
    expect(buildCharacterSheetFromDraft(tech, 'tech-test').sheet.makerAllocation?.field).toBe(2);
    const med = cp({ makerAllocation: { field: 2, upgrade: 0, fabrication: 0, invention: 0 } });
    expect(buildCharacterSheetFromDraft(med, 'med2').sheet.makerAllocation).toBeUndefined();
  });
});

describe('Guía de skills de arma (Core pp.83-84, 171-174)', () => {
  it('Handgun cubre los SMG en tiro simple y Autofire es REF + Autofire', () => {
    expect(WEAPON_SKILL_GUIDE.Handgun.weaponsEs).toContain('SMG');
    expect(WEAPON_SKILL_GUIDE.Autofire.rollEs).toBe('REF + Autofire + 1d10');
    expect(AUTOFIRE_RULES.some((r) => r.includes('10 balas'))).toBe(true);
  });
});
