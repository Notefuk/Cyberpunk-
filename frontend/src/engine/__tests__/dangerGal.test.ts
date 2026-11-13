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

  it('la tanda 2 trae las 37 de Generation Red, Maelstrom, NCPD, Network 54 y Piranhas (pp.58-98)', () => {
    expect(byFaction('Generation Red')).toBe(8);
    expect(byFaction('Maelstrom')).toBe(12);
    expect(byFaction('NCPD Precinct #1')).toBe(11);
    expect(byFaction('Network 54')).toBe(3);
    expect(byFaction('Piranhas')).toBe(3);
  });

  it('la tanda 3 cierra el libro: Sightseers, Team Monster, Trauma Team, Tyger Claws, Zoners y los 2 de Arasaka de The Incident', () => {
    expect(byFaction('Sightseers')).toBe(5);
    expect(byFaction('Team Monster')).toBe(6);
    expect(byFaction('Trauma Team Squad NC4-2')).toBe(6);
    expect(byFaction('Tyger Claws')).toBe(10);
    expect(byFaction('Zoners')).toBe(10);
    expect(byFaction('Arasaka')).toBe(2);
  });

  it('son las 118 del libro, con el reparto de niveles de su índice (9 Boss, 16 Mini-Boss, 57 LT, 36 Mook; 60 Hardened)', () => {
    expect(DANGER_GAL_ENEMIES).toHaveLength(118);
    const t = (pred: (x: string) => boolean) => DANGER_GAL_ENEMIES.filter((e) => pred(e.threatTier)).length;
    expect(t((x) => x === 'boss' || x === 'hardened_boss')).toBe(9);
    expect(t((x) => x.endsWith('mini_boss'))).toBe(16);
    expect(t((x) => x.endsWith('lieutenant'))).toBe(57);
    expect(t((x) => x.endsWith('mook'))).toBe(36);
    expect(t((x) => x.startsWith('hardened_'))).toBe(60);
    expect(DANGER_GAL_ENEMIES.filter((e) => e.isNetrunner)).toHaveLength(8);
  });

  it('toda ficha tiene id dg-, página del libro, facción canon y sale del libro Danger Gal', () => {
    // Arasaka no es una de las 15 facciones, pero el libro pone ahí a Darius y Nymph (lista p.168).
    const names = new Set([...DANGER_GAL_15_FACTIONS.map((f) => f.name), 'Arasaka']);
    for (const e of DANGER_GAL_ENEMIES) {
      expect(e.id).toMatch(/^dg-/);
      expect(e.sourcePage).toBeGreaterThanOrEqual(10);
      expect(e.sourcePage).toBeLessThanOrEqual(166);
      expect(names.has(e.faction), e.id).toBe(true);
      expect(e.sourceBook).toBe('danger_gal');
      expect(e.hp).toBeGreaterThan(0);
      // Erratas del libro que se guardan tal cual: Flenser SW 13 con HP 35 (p.72) y Stringer Death Save 4 con BODY 6 (p.94).
      if (e.id !== 'dg-maelstrom-flenser') expect(e.seriouslyWounded, e.id).toBe(Math.ceil(e.hp / 2));
      if (e.id !== 'dg-n54-stringer') expect(e.deathSave, e.id).toBe(e.stats.BODY);
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
    for (const id of DANGER_GAL_ENEMIES.filter((e) => e.isNetrunner).map((e) => e.id)) {
      const e = findEnemySheet(id)!;
      expect(e.isNetrunner, id).toBe(true);
      expect(portEnemyToCemk(e).availableQuickhacks.length, id).toBeGreaterThan(0);
    }
  });
});

// v5.39.0 [Claude Code · 2026-11-13]: New Gear (DGD pp.143-148), vehículos de facción (pp.112, 120, 139) y NET del CrAB Lord (p.42).
import pack from '../../data/core-rules.cprpack.json';
import { BLACK_CHROME_VEHICLES } from '../../data/blackChromeVehicles';
import { NET_ARCHITECTURE_PRESETS } from '../../data/netAndRolesData';

describe('Danger Gal Dossier: New Gear, vehículos y NET', () => {
  type Item = { id: string; name: string; sourceBook?: string; sourcePage?: number; notes?: string; description?: string };
  const all = (['weapons', 'armor', 'ammunition', 'cyberware', 'drugs', 'gear'] as const).flatMap((k) => (pack as unknown as Record<string, Item[]>)[k]);
  const byId = (id: string) => all.find((i) => i.id === id);

  it('entran los 4 ítems que faltaban, con su página', () => {
    expect(byId('dg-conarms-multiple-ammo-pistol')?.sourcePage).toBe(144);
    expect(byId('dg-sanroo-microcutie')?.sourcePage).toBe(145);
    expect(byId('dg-bicycle')?.sourcePage).toBe(146);
    expect(byId('dg-smart-lens')?.sourcePage).toBe(148);
    for (const id of ['dg-conarms-multiple-ammo-pistol', 'dg-sanroo-microcutie', 'dg-bicycle', 'dg-smart-lens']) expect(byId(id)?.sourceBook).toBe('danger_gal');
  });

  it('los otros 27 ítems del New Gear anotan Danger Gal como segunda fuente; el SMG inventado ya no está', () => {
    const noted = all.filter((i) => /También en Danger Gal Dossier p\.14[4-8]/.test(`${i.notes ?? ''}${i.description ?? ''}`));
    expect(noted).toHaveLength(27);
    expect(byId('danger-gal-kitty-smg')).toBeUndefined();
    expect(all.filter((i) => i.sourceBook === 'danger_gal' && !i.sourcePage)).toHaveLength(0);
  });

  it('3 vehículos de facción, con base en Black Chrome cuando el libro la da', () => {
    const vs = DANGER_GAL_15_FACTIONS.flatMap((f) => f.vehicles ?? []);
    expect(vs.map((v) => [v.name, v.page, v.sdp])).toEqual([
      ['Zetatech Herakles', 112, 120],
      ['SovOil Mi-60', 120, 120],
      ['Diego Motors Chupacabra', 139, 70],
    ]);
    for (const v of vs) if (v.base?.catalogId) expect(BLACK_CHROME_VEHICLES.some((b) => b.id === v.base!.catalogId), v.name).toBe(true);
  });

  it('la NET del CrAB Lord reemplaza a la NET inventada de Danger Gal', () => {
    const crab = NET_ARCHITECTURE_PRESETS.find((n) => n.id === 'net-dg-crab-lord-portable');
    expect(crab?.floors.map((f) => f.type)).toEqual(['Black ICE', 'Password', 'Control Node', 'Control Node']);
    expect(crab?.floors[0].iceHp).toBe(25); // Giant, Core pp.206-207
    expect(NET_ARCHITECTURE_PRESETS.some((n) => n.id === 'net-danger-gal-archive')).toBe(false);
  });
});
