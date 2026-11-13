// [Claude Code · 2026-11-13] v5.34.0 (plan 31): nivel mercenario de Solo of Fortune 2045 (Interface RED Vol. 5 pp.106-108, 144-147).
import { describe, expect, it } from 'vitest';
import { KELLY_MCALISTER, MERC_LEVEL_RULES, SOLO_OF_FORTUNE_ADVENTURES } from '../../data/gmTables/solo-of-fortune';
import { INTERFACE_RED_NET_PRESETS } from '../../data/netArchitecturesInterfaceRed';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import { BOOK_MISSION_BUDGETS, MISSION_PARAMETERS, opBudgetLeft, opBudgetSpent } from '../opBudget';

describe('Presupuesto operativo (p.108)', () => {
  it('lo gastado se resta y lo que sobra nunca es negativo', () => {
    const b = { total: 5000, purchases: [{ name: 'Granadas', cost: 1500 }, { name: 'Smartgun Link', cost: 500 }] };
    expect(opBudgetSpent(b)).toBe(2000);
    expect(opBudgetLeft(b)).toBe(3000);
    expect(opBudgetLeft({ total: 100, purchases: [{ name: 'x', cost: 500 }] })).toBe(0);
  });

  it('parámetros de misión y presupuestos de las misiones del libro', () => {
    expect(MISSION_PARAMETERS.map((p) => p.budget)).toEqual([[1000, 5000], [2000, 7000], [10000, 30000]]);
    expect(BOOK_MISSION_BUDGETS.map((m) => m.total)).toEqual([5000, 25000]);
  });
});

describe('Misiones (pp.144-147)', () => {
  it('las 2 aventuras, con sus PNJ en el bestiario', () => {
    expect(SOLO_OF_FORTUNE_ADVENTURES.map((a) => a.pages)).toEqual(['144-145', '146-147']);
    for (const a of SOLO_OF_FORTUNE_ADVENTURES) for (const id of a.npcIds) expect(ENEMIES_CATALOG.some((e) => e.id === id), id).toBe(true);
    expect(MERC_LEVEL_RULES.length).toBeGreaterThanOrEqual(10);
  });

  it('Kelly McAlister: HP 40, Combat # 15, SP 13 (p.145)', () => {
    expect(KELLY_MCALISTER).toMatchObject({ hp: 40, combatNumber: 15, init: 6, move: 6, headSp: 13, bodySp: 13 });
  });

  it('NET del rancho McAlister: 6 pisos, Hellhound x2 en el 2 y el File en el 6 (p.145)', () => {
    const n = INTERFACE_RED_NET_PRESETS.find((x) => x.id === 'net-ir5-mcalister-ranch')!;
    expect(n.totalFloors).toBe(6);
    expect(n.floors.map((f) => f.dv ?? null)).toEqual([8, null, 12, 12, 12, 12]);
    expect(n.floors[1].name).toBe('Black ICE: Hellhound x2');
    expect(n.floors[5].type).toBe('File');
  });
});
