// [Claude Code · 2026-11-13] v5.33.0 (plan 31): Cyberpets, Interface RED Vol. 5 pp.72-81.
import { describe, expect, it } from 'vitest';
import { CYBERPETS } from '../../data/cyberpets';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import { PET_BEDS, animalHandlingBase, canAddPetCyberware, petLifestyleMonthly, petObedience, petSlotsUsed } from '../cyberpets';

describe('Catálogo de Cyberpets (pp.74-81)', () => {
  it('8 modelos, cada uno con su ficha en el bestiario y su página', () => {
    expect(CYBERPETS).toHaveLength(8);
    for (const m of CYBERPETS) {
      const e = ENEMIES_CATALOG.find((x) => x.id === m.enemyId);
      expect(e, m.enemyId).toBeDefined();
      expect(e!.sourcePage, m.name).toBe(m.page);
      expect(m.page).toBeGreaterThanOrEqual(74);
      expect(m.page).toBeLessThanOrEqual(81);
      expect(petLifestyleMonthly(m), m.name).toBeGreaterThan(0);
    }
  });

  it('Datarabbit: 1000eb, Generic Prepak (300eb/mes), 2 ranuras, Mook (p.74)', () => {
    const r = CYBERPETS.find((m) => m.enemyId === 'ir5-pet-datarabbit')!;
    expect(r).toMatchObject({ cost: 1000, lifestyle: 'Generic Prepak', cyberwareSlots: 2, tier: 'mook' });
    expect(petLifestyleMonthly(r)).toBe(300);
    expect(petLifestyleMonthly({ lifestyle: 'Fresh Food x2' })).toBe(3000); // Cyberbear, p.78
    const e = ENEMIES_CATALOG.find((x) => x.id === r.enemyId)!;
    expect(e.stats).toMatchObject({ INT: 2, REF: 8, DEX: 8, MOVE: 10, BODY: 3 });
  });
});

describe('Reglas de mascotas (pp.72-73)', () => {
  it('camas: Mook 0, Lieutenant 1, Mini-Boss 2, Boss 3', () => {
    expect(PET_BEDS).toEqual({ mook: 0, lieutenant: 1, mini_boss: 2, boss: 3 });
  });

  it('obedece con INT + Animal Handling de 10 o más, si está cuidada', () => {
    const ok = { lifestylePaid: true, housed: true };
    expect(animalHandlingBase(6, 4)).toBe(10);
    expect(petObedience(10, ok).obeys).toBe(true);
    expect(petObedience(9, ok).obeys).toBe(false);
    expect(petObedience(12, { ...ok, lifestylePaid: false }).obeys).toBe(false);
    expect(petObedience(12, { ...ok, housed: false }).obeys).toBe(false);
    expect(petObedience(12, { ...ok, mistreated: true }).obeys).toBe(false);
  });

  it('ranuras: el ciberware agregado ocupa; uno solo puede ocupar 0 con Tech Upgrade', () => {
    const pet = { extraCyberware: [{ name: 'A', trained: true }, { name: 'B', trained: false, zeroSlot: true }] };
    expect(petSlotsUsed(pet)).toBe(1);
    expect(canAddPetCyberware(pet, { cyberwareSlots: 2 })).toBe(true);
    expect(canAddPetCyberware(pet, { cyberwareSlots: 1 })).toBe(false);
    expect(canAddPetCyberware(pet, { cyberwareSlots: 2 }, true)).toBe(false);
  });
});
