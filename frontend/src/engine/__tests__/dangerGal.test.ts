// [Claude Code · 2026-11-13] v5.35.0 (plan 32): Danger Gal Dossier. Facciones canon (pp.9-142) y su línea de 2077 (Lore Guide de CEMK).
import { describe, expect, it } from 'vitest';
import { DANGER_GAL_15_FACTIONS, dangerGalFactionByName } from '../../data/dangerGalFactions';
import { DANGER_GAL_15_FACTIONS as REEXPORT } from '../../data/enemiesCatalog';

describe('Danger Gal Dossier: facciones', () => {
  it('son las 15 del libro, en orden de página (DGD p.6: "fifteen factions")', () => {
    expect(DANGER_GAL_15_FACTIONS).toHaveLength(15);
    expect(DANGER_GAL_15_FACTIONS.map((f) => f.sourcePage)).toEqual([9, 15, 27, 33, 39, 57, 67, 79, 91, 95, 99, 105, 113, 121, 131]);
    expect(new Set(DANGER_GAL_15_FACTIONS.map((f) => f.id)).size).toBe(15);
    expect(REEXPORT).toBe(DANGER_GAL_15_FACTIONS);
  });

  it('no queda ninguna facción inventada de la lista vieja', () => {
    const names = DANGER_GAL_15_FACTIONS.map((f) => f.name);
    for (const fake of ['Danger Gal Operations', 'Continental Brands', 'Zhirafa Combat Robotics', '6th Street Patriots', 'Arasaka']) {
      expect(names).not.toContain(fake);
    }
  });

  it('cada facción trae base, historia, recursos y objetivos', () => {
    for (const f of DANGER_GAL_15_FACTIONS) {
      for (const k of ['summary', 'base', 'history', 'resources', 'goals', 'preparedBy', 'territory'] as const) {
        expect(f[k].length, `${f.name}.${k}`).toBeGreaterThan(10);
      }
    }
  });

  it('la línea de 2077 cita la Lore Guide (42 páginas) y solo está donde la guía las nombra', () => {
    const with2077 = DANGER_GAL_15_FACTIONS.filter((f) => f.in2077).map((f) => [f.name, f.in2077!.page]);
    expect(with2077).toEqual([
      ['6th Street', 25],
      ['Maelstrom', 25],
      ['NCPD Precinct #1', 28],
      ['Network 54', 31],
      ['Trauma Team Squad NC4-2', 24],
      ['Tyger Claws', 26],
    ]);
  });

  it('Kids in Night City (p.66) va con Generation Red', () => {
    expect(dangerGalFactionByName('generation red')?.sidebar?.page).toBe(66);
    expect(dangerGalFactionByName('Nadie')).toBeUndefined();
  });
});

// v5.35.1 [Claude Code · 2026-11-13]: el bestiario (PNJ y facciones) solo lo ve el GM.
import { canSeeGmOnly } from '../../store/gmAccess';
describe('Bestiario solo para el GM', () => {
  it('lo ve el GM de la mesa o, sin mesa, quien no tiene PIN o lo desbloqueó; el jugador de la mesa y el PIN bloqueado no', () => {
    expect(canSeeGmOnly('table-gm')).toBe(true);
    expect(canSeeGmOnly('local-open')).toBe(true);
    expect(canSeeGmOnly('table-player')).toBe(false);
    expect(canSeeGmOnly('local-locked')).toBe(false);
  });
});
