// [Claude Code · 2026-11-06] v5.14.0 (plan 26): Night Markets (Core pp.338-339, Black Chrome pp.131-156) y Economics 101.
import { describe, it, expect } from 'vitest';
import { NIGHT_MARKET_CATEGORIES, NIGHT_MARKET_D100 } from '../../data/nightMarketTables';
import { BLACK_CHROME_MARKETS, ECONOMICS_101 } from '../../data/blackChromeMarkets';
import { generateNightMarket, rerollCategory, rollCategoryItems, rollMarketCategories, type Rng } from '../nightMarket';
import { citedBoothCodes, itemsAtBooth, costTierFor } from '../blackChromeBooths';
import { buildMarketReveal, parseMarketReveal, MARKET_MAX_ITEMS, MARKET_MAX_SECTIONS } from '../../sync/tableReveals';
import { LIFESTYLE_OPTIONS } from '../../data/creation/housingOptions';

/** Generador determinista para los tests. */
function seeded(seed: number): Rng {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const allTableTexts = new Set(NIGHT_MARKET_D100.flatMap((r) => Object.values(r.items)));

describe('Night Market del Core (pp.338-339)', () => {
  it('6 categorías (1d6) y 20 filas de d100 que cubren 1-100 sin huecos', () => {
    expect(NIGHT_MARKET_CATEGORIES.map((c) => c.roll)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(NIGHT_MARKET_D100).toHaveLength(20);
    let next = 1;
    for (const r of NIGHT_MARKET_D100) {
      expect(r.min).toBe(next);
      next = r.max + 1;
    }
    expect(next).toBe(101);
  });

  it('dos categorías distintas; 1d10 tipos sin repetir fila, todos de la tabla', () => {
    for (let seed = 1; seed < 200; seed++) {
      const rng = seeded(seed);
      const cats = rollMarketCategories(rng);
      expect(new Set(cats).size).toBe(2);
      const m = generateNightMarket(seeded(seed + 1000));
      for (const c of m.categories) {
        expect(c.count).toBeGreaterThanOrEqual(1);
        expect(c.count).toBeLessThanOrEqual(10);
        expect(c.items).toHaveLength(c.count);
        const rows = c.items.map((i) => NIGHT_MARKET_D100.findIndex((r) => i.roll >= r.min && i.roll <= r.max));
        expect(new Set(rows).size).toBe(rows.length);
        for (const i of c.items) expect(allTableTexts.has(i.text)).toBe(true);
      }
    }
  });

  it('tirar 10 tipos en una columna da 10 filas distintas; volver a tirar cambia solo esa categoría', () => {
    const c = rollCategoryItems('weapons', seeded(7), 10);
    expect(c.items).toHaveLength(10);
    const m = generateNightMarket(seeded(3));
    const [a, b] = m.categories;
    const r = rerollCategory(m, a.id, seeded(99));
    expect(r.categories[1]).toBe(b);
    expect(r.categories[0].id).toBe(a.id);
  });
});

describe('Night Markets de Black Chrome (pp.131-156)', () => {
  it('son 6 (A-F) con sus 29 puestos', () => {
    expect(BLACK_CHROME_MARKETS.map((m) => m.letter)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    expect(BLACK_CHROME_MARKETS.map((m) => m.booths.length)).toEqual([5, 7, 6, 3, 3, 5]);
    for (const m of BLACK_CHROME_MARKETS) for (const b of m.booths) expect(b.code.startsWith(m.letter)).toBe(true);
  });

  it('todo puesto que cita un ítem existe en su mercado, y los códigos son letra + número', () => {
    const codes = new Set(BLACK_CHROME_MARKETS.flatMap((m) => m.booths.map((b) => b.code)));
    const cited = citedBoothCodes();
    expect(cited.length).toBeGreaterThan(20);
    for (const c of cited) {
      expect(c).toMatch(/^[A-F]\d$/);
      expect(codes.has(c)).toBe(true);
    }
  });

  it('el puesto B1 tiene vehículos de Black Chrome; los ítems van del más barato al más caro', () => {
    const b1 = itemsAtBooth('B1');
    expect(b1.some((i) => i.category === 'vehicles' && i.name === 'The Grundy')).toBe(true);
    const d2 = itemsAtBooth('D2');
    for (let i = 1; i < d2.length; i++) expect(d2[i].cost).toBeGreaterThanOrEqual(d2[i - 1].cost);
  });

  // v5.14.1 [Claude Code · 2026-11-10]: los fluidos de la Weeping Reaver se venden con la katana (BC p.91, Booth D2).
  it('los 3 fluidos de la Weeping Reaver están en el puesto D2', () => {
    const d2 = itemsAtBooth('D2').map((i) => i.id);
    for (const id of ['arasaka-acid', 'arasaka-fire', 'arasaka-wound-salt']) expect(d2).toContain(id);
  });

  it('categoría de precio por costo (Core p.385)', () => {
    expect([10, 20, 50, 100, 500, 1000, 5000, 10000].map(costTierFor)).toEqual(['Cheap', 'Everyday', 'Costly', 'Premium', 'Expensive', 'Very Expensive', 'Luxury', 'Super Luxury']);
  });
});

describe('Economics 101 (BC pp.125-130)', () => {
  it('Find a Fixer/Tech: DV 15, 17, 21 y 24 según el costo (p.129)', () => {
    expect(ECONOMICS_101.findFixerTech.page).toBe(129);
    expect(ECONOMICS_101.findFixerTech.rows.map((r) => r.dv)).toEqual([15, 17, 21, 24]);
  });

  it('los 4 estilos de vida del creador tienen su detalle de Black Chrome (p.130)', () => {
    expect(ECONOMICS_101.lifestyles.page).toBe(130);
    for (const l of LIFESTYLE_OPTIONS) expect(l.detailBcEs, l.name).toBeTruthy();
  });
});

describe('Night Market compartido con la mesa', () => {
  it('se recorta a los topes de las reglas y se lee igual', () => {
    const big = {
      title: 'x'.repeat(300),
      source: 'Core p.338',
      sections: Array.from({ length: 20 }, (_, i) => ({ heading: `S${i}`, items: Array.from({ length: 60 }, (_, j) => `ítem ${j}`) })),
    };
    const r = buildMarketReveal(big);
    expect(r.title.length).toBeLessThanOrEqual(120);
    expect(r.sections).toHaveLength(MARKET_MAX_SECTIONS);
    expect(r.sections[0].items).toHaveLength(MARKET_MAX_ITEMS);
    expect(parseMarketReveal({ ...r, _ts: 1 } as unknown as Record<string, unknown>)).toEqual(r);
    expect(parseMarketReveal(null)).toBeNull();
  });
});
