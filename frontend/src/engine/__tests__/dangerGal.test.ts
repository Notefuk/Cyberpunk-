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

// v5.36.0 [Claude Code · 2026-11-13]: primera tanda de fichas (6th Street, Bozos, Puma Squad, Digital Divas y Edgerunners, DGD pp.10-56).
import { DANGER_GAL_ENEMIES } from '../../data/enemies/danger-gal';
import { ENEMIES_CATALOG, findEnemySheet } from '../../data/enemiesCatalog';
import { LEGACY_INVENTED_ENEMIES } from '../../data/enemies/legacy-invented-danger-gal';
import { portEnemyToCemk } from '../cemkPort';

describe('Danger Gal Dossier: fichas', () => {
  const byFaction = (f: string) => DANGER_GAL_ENEMIES.filter((e) => e.faction === f).length;

  it('la tanda 1 trae las 42 fichas de sus 5 facciones', () => {
    expect(byFaction('6th Street')).toBe(5);
    expect(byFaction('Bozos')).toBe(11);
    expect(byFaction('Danger Gal Puma Squad')).toBe(5);
    expect(byFaction('The Digital Divas')).toBe(5);
    expect(byFaction('Edgerunners')).toBe(16);
  });

  it('toda ficha tiene id dg-, página del libro, facción canon y sale del libro Danger Gal', () => {
    const names = new Set(DANGER_GAL_15_FACTIONS.map((f) => f.name));
    for (const e of DANGER_GAL_ENEMIES) {
      expect(e.id).toMatch(/^dg-/);
      expect(e.sourcePage).toBeGreaterThanOrEqual(10);
      expect(e.sourcePage).toBeLessThanOrEqual(166);
      expect(names.has(e.faction), e.id).toBe(true);
      expect(e.sourceBook).toBe('danger_gal');
      expect(e.hp).toBeGreaterThan(0);
      expect(e.seriouslyWounded).toBe(Math.ceil(e.hp / 2));
      expect(e.deathSave).toBe(e.stats.BODY);
    }
  });

  it('las fichas inventadas salieron del bestiario, pero un actor viejo encuentra la suya', () => {
    expect(LEGACY_INVENTED_ENEMIES).toHaveLength(95);
    const ids = new Set(ENEMIES_CATALOG.map((e) => e.id));
    for (const l of LEGACY_INVENTED_ENEMIES) expect(ids.has(l.id), l.id).toBe(false);
    expect(findEnemySheet(LEGACY_INVENTED_ENEMIES[0].id)?.id).toBe(LEGACY_INVENTED_ENEMIES[0].id);
    expect(findEnemySheet('dg-6th-arbiter')?.name).toBe('Arbiter');
  });

  it('todas tienen porte CEMK: Neuroport, hackeables y los netrunners con Quickhacks (CEMK RB pp.15-16, 25)', () => {
    for (const e of DANGER_GAL_ENEMIES) {
      const p = portEnemyToCemk(e);
      expect(p.hasNeuroport).toBe(true);
      expect(p.hackable).toBe(true);
    }
    for (const id of ['dg-puma-pantera', 'dg-divas-firewall', 'dg-edge-crab-lord']) {
      const e = findEnemySheet(id)!;
      expect(e.isNetrunner, id).toBe(true);
      expect(portEnemyToCemk(e).availableQuickhacks.length, id).toBeGreaterThan(0);
    }
  });
});
