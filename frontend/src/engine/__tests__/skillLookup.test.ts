// Tests de sheetSkillLevel: claves de skills guardadas de distintas formas. [Claude Code · 2026-10-23]
import { describe, it, expect } from 'vitest';
import { sheetSkillLevel } from '../skillLookup';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';

describe('sheetSkillLevel', () => {
  const maven = CEMK_FOLIO_PREMADE_CHARACTERS.find((c) => c.handle.startsWith('Maven'))!;

  it('CEMK Folios p.25: Maven tiene Electronics/Security Tech 6 aunque la clave sea "electronicssecurity"', () => {
    expect(sheetSkillLevel(maven, 'Electronics/Security Tech')).toBe(6);
  });

  it('CEMK Folios p.25: Maven tiene Cybertech 5 (skills y generalSkills)', () => {
    expect(sheetSkillLevel(maven, 'Cybertech')).toBe(5);
  });

  it('lee claves con el nombre del libro y claves de combate', () => {
    expect(sheetSkillLevel({ generalSkills: { 'Drive Land Vehicle': 4 } }, 'Drive Land Vehicle')).toBe(4);
    expect(sheetSkillLevel({ skills: { firstAid: 3 } }, 'First Aid')).toBe(3);
  });

  it('no confunde skills distintas ni toma prefijos cortos', () => {
    expect(sheetSkillLevel({ generalSkills: { tech: 5 } }, 'Basic Tech')).toBe(0);
    expect(sheetSkillLevel({ generalSkills: { 'Language (Streetslang)': 4 } }, 'Language')).toBe(0);
    expect(sheetSkillLevel(undefined, 'Cybertech')).toBe(0);
  });
});
