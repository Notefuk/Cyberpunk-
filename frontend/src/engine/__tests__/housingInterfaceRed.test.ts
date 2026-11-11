// [Claude Code · 2026-11-11] v5.18.0 (plan 27): vivienda de los Interface RED.
import { describe, expect, it } from 'vitest';
import pack from '../../data/core-rules.cprpack.json';
import { NAMED_HOUSING, namedHousingFor, rollNamedHousing } from '../../data/creation/namedHousing';
import { HOUSING_OPTIONS } from '../../data/creation/housingOptions';
import { buildCharacterSheetFromDraft, createEmptyDraft } from '../characterCreation';

type Gear = { id: string; name: string; cost: number; sourceBookTitle?: string; sourcePage?: number };
const gear = (pack as unknown as { gear: Gear[] }).gear;

describe('Viviendas con nombre (IR2 pp.35-36, IR4 pp.47-53)', () => {
  it('10 por tipo, con tirada 1 a 10 y página', () => {
    for (const [type, list] of Object.entries(NAMED_HOUSING)) {
      expect(HOUSING_OPTIONS.some((h) => h.name === type), type).toBe(true);
      expect(list.map((h) => h.roll)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(list.every((h) => /Interface RED Vol\. [24] pp?\.\d/.test(h.source))).toBe(true);
    }
    expect(Object.keys(NAMED_HOUSING).sort()).toEqual(['Cargo Container', 'Corporate Conapt', 'Cube Hotel', 'Studio Apartment']);
  });

  it('la tabla de Studio Apartments sigue el orden del 1d10 de p.53, no el de las marcas', () => {
    const s = namedHousingFor('Studio Apartment');
    expect([s[0].name, s[0].marker]).toEqual(['Converted Motel Studio Apartments', 'S7']);
    expect([s[8].name, s[8].marker]).toEqual(['Silverhand Studios', 'S1']);
  });

  it('tirar 1d10 da la fila del resultado', () => {
    expect(rollNamedHousing('Cargo Container', () => 0)?.name).toBe('University Cargo Bay');
    expect(rollNamedHousing('Cargo Container', () => 0.99)?.name).toBe('East Cargo Village');
    expect(rollNamedHousing('Luxury Penthouse', () => 0.5)).toBeNull();
  });
});

describe('Muebles y accesorios', () => {
  it('Cargo Containers & Cube Hotels: 3 juegos y 5 accesorios (IR2 p.37)', () => {
    const items = gear.filter((g) => g.sourceBookTitle === 'Interface RED Volume 2' && g.sourcePage === 37);
    expect(items).toHaveLength(8);
    expect(items.find((g) => g.id === 'home-fire-safe')?.cost).toBe(100);
  });

  it('Corporate Conapts: 3 juegos y 6 accesorios (IR4 pp.51-52)', () => {
    const items = gear.filter((g) => g.sourceBookTitle === 'Interface RED Volume 4' && (g.sourcePage === 51 || g.sourcePage === 52));
    expect(items).toHaveLength(9);
    expect(items.find((g) => g.id === 'home-zhirafa-an7-3tr')?.cost).toBe(5000);
  });
});

describe('El lugar con nombre llega a las notas de la ficha', () => {
  it('Cargo Container en Bridgetown', () => {
    const draft = { ...createEmptyDraft(), method: 'complete_package' as const, role: 'Solo' as const, handle: 'X', housing: 'Cargo Container', housingPlace: 'Bridgetown' };
    const notes = buildCharacterSheetFromDraft(draft, 't').sheet.notes ?? '';
    expect(notes).toContain('Cargo Container (Bridgetown, Little China; Interface RED Vol. 2 p.36)');
  });
});
