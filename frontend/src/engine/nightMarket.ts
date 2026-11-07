// [Claude Code · 2026-11-06] v5.14.0 (plan 26): generador de Night Market (Core pp.338-339). Lógica pura.
import {
  NIGHT_MARKET_CATEGORIES,
  NIGHT_MARKET_D100,
  type NightMarketCategoryId,
} from '../data/nightMarketTables';

/** Devuelve un número en [0, 1). Inyectable para los tests. */
export type Rng = () => number;

export const rollDie = (sides: number, rng: Rng = Math.random): number => Math.floor(rng() * sides) + 1;

export interface RolledMarketItem {
  roll: number;
  text: string;
}

export interface RolledMarketCategory {
  id: NightMarketCategoryId;
  /** 1d10: cuántos tipos de ítems hay en esta categoría. */
  count: number;
  items: RolledMarketItem[];
}

export interface RolledNightMarket {
  categories: RolledMarketCategory[];
}

/** Core p.338: 1d6 dos veces; si sale repetido, se vuelve a tirar. */
export function rollMarketCategories(rng: Rng = Math.random): NightMarketCategoryId[] {
  const first = rollDie(6, rng);
  let second = rollDie(6, rng);
  while (second === first) second = rollDie(6, rng);
  return [first, second].map((r) => NIGHT_MARKET_CATEGORIES.find((c) => c.roll === r)!.id);
}

/** Core p.338: 1d10 tipos de ítems; d100 por cada uno en la columna, sin repetir fila. */
export function rollCategoryItems(id: NightMarketCategoryId, rng: Rng = Math.random, count: number = rollDie(10, rng)): RolledMarketCategory {
  const usedRows = new Set<number>();
  const items: RolledMarketItem[] = [];
  const max = Math.min(count, NIGHT_MARKET_D100.length);
  while (items.length < max) {
    const roll = rollDie(100, rng);
    const idx = NIGHT_MARKET_D100.findIndex((r) => roll >= r.min && roll <= r.max);
    if (usedRows.has(idx)) continue;
    usedRows.add(idx);
    items.push({ roll, text: NIGHT_MARKET_D100[idx].items[id] });
  }
  items.sort((a, b) => a.roll - b.roll);
  return { id, count, items };
}

export function generateNightMarket(rng: Rng = Math.random): RolledNightMarket {
  return { categories: rollMarketCategories(rng).map((id) => rollCategoryItems(id, rng)) };
}

/** Vuelve a tirar una categoría del mercado (otra cantidad y otros ítems). */
export function rerollCategory(market: RolledNightMarket, id: NightMarketCategoryId, rng: Rng = Math.random): RolledNightMarket {
  return { categories: market.categories.map((c) => (c.id === id ? rollCategoryItems(id, rng) : c)) };
}
