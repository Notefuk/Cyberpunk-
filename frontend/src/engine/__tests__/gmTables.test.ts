// [Claude Code · 2026-11-11] v5.19.0 (plan 27): tablas de la pestaña del GM.
import { describe, expect, it } from 'vitest';
import { parseDie, rowRange, rowFor, rollOnTable, tableCoversDie } from '../gmTables';
import { ACHIEVEMENTS, TABLE_OF_MYSTERY, MYSTERY_BOX_CONTENTS } from '../../data/gmTables/achievements';
import { WEATHER_SEASONS, STRANGE_WEATHER } from '../../data/gmTables/weather';
import { SALVAGE_CATEGORIES, SALVAGE_WORTH, PERILS_OF_SALVAGING } from '../../data/gmTables/salvaging';
import { DATING_TABLES } from '../../data/gmTables/dating';
import { COLLECTIONS } from '../../data/gmTables/collecting';
import { EXPANSION_RULE_SYSTEMS } from '../../data/expansionRulesData';
import type { GmTable } from '../../data/gmTables/types';

describe('motor de tiradas', () => {
  it('lee dados y rangos (00 es 100 en d100)', () => {
    expect(parseDie('1d10')).toEqual({ count: 1, sides: 10 });
    expect(parseDie('lista')).toBeNull();
    expect(rowRange('2-3', 10)).toEqual([2, 3]);
    expect(rowRange('00', 100)).toEqual([100, 100]);
    expect(rowFor([{ roll: '1-4' }, { roll: '5-8' }, { roll: '9-10' }], 7, 10)?.roll).toBe('5-8');
  });

  it('rollOnTable usa el rng', () => {
    expect(rollOnTable(TABLE_OF_MYSTERY.rows, '1d10', () => 0)?.row?.roll).toBe('1');
    expect(rollOnTable(TABLE_OF_MYSTERY.rows, '1d10', () => 0.999)?.row?.roll).toBe('10');
  });
});

describe('cada tabla cubre todo su dado, sin huecos ni filas repetidas', () => {
  const rollable = (t: GmTable) => parseDie(t.die) !== null;
  const all: GmTable[] = [TABLE_OF_MYSTERY, ...MYSTERY_BOX_CONTENTS, STRANGE_WEATHER, SALVAGE_CATEGORIES, PERILS_OF_SALVAGING,
    ...DATING_TABLES, ...COLLECTIONS].filter(rollable);
  it.each(all.map((t) => [t.title, t] as const))('%s', (_title, t) => {
    expect(tableCoversDie(t.rows, t.die)).toBe(true);
  });
  it('todas citan libro y página', () => {
    for (const t of [...all, ...COLLECTIONS]) expect(t.source).toMatch(/p\.\d+/);
  });
});

describe('contenido (Interface RED y DLC)', () => {
  it('30 logros y 10 cajas de 1d6 (IR4 pp.25-29)', () => {
    expect(ACHIEVEMENTS).toHaveLength(30);
    expect(MYSTERY_BOX_CONTENTS).toHaveLength(10);
    expect(ACHIEVEMENTS.find((a) => a.name === 'One is the Loneliest #')?.conditionEs).toMatch(/1 HP/);
  });

  it('clima: 4 estaciones de 1d6 y Strange Weather de 1d10 (IR2 p.17)', () => {
    expect(WEATHER_SEASONS.map((s) => s.rows.length)).toEqual([6, 6, 6, 6]);
    expect(WEATHER_SEASONS.flatMap((s) => s.months).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(STRANGE_WEATHER.rows).toHaveLength(10);
  });

  it('Salvage Worth: 1000eb solo con "lo que haya" (DV 29)', () => {
    expect(SALVAGE_WORTH.find((w) => w.worth === '1000eb')).toEqual({ worth: '1000eb', anyDv: 'DV 29', specificDv: 'N/A' });
  });

  it('Digital Dating: 20 zonas y las tablas de la cita', () => {
    expect(DATING_TABLES.filter((t) => t.id.endsWith('-date') && t.rows.length === 6 && t.die === '1d6')).toHaveLength(20);
    expect(DATING_TABLES.find((t) => t.id === 'keywords')?.die).toBe('1d100');
  });

  it('Stickball en el Compendio de sistemas, con la tabla de pases', () => {
    const s = EXPANSION_RULE_SYSTEMS.find((x) => x.id === 'stickball');
    expect(s?.referenceTable?.rows[0]).toEqual(['DV de Athletics', '16', '15', '15', '17', '20', '22', '25']);
  });
});
