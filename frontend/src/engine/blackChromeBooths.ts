// [Claude Code · 2026-11-06] v5.14.0 (plan 26): qué se vende en cada puesto de los Night Markets de Black Chrome.
// Cada ítem de Black Chrome dice "Pick-up or Browse at Booth X#" (BC p.7): la letra es el mercado y el número el puesto.
import coreData from '../data/core-rules.cprpack.json';
import { BLACK_CHROME_VEHICLES } from '../data/blackChromeVehicles';

export interface BoothItem {
  id: string;
  name: string;
  /** Categoría del pack ('weapons', 'cyberware'...) o 'vehicles'. */
  category: string;
  cost: number;
  costTier: string;
  sourcePage?: number;
  sourceBook: string;
}

/** Categoría de precio por costo (Core p.385). */
export function costTierFor(cost: number): string {
  if (cost >= 10000) return 'Super Luxury';
  if (cost >= 5000) return 'Luxury';
  if (cost >= 1000) return 'Very Expensive';
  if (cost >= 500) return 'Expensive';
  if (cost >= 100) return 'Premium';
  if (cost >= 50) return 'Costly';
  if (cost >= 20) return 'Everyday';
  return 'Cheap';
}

const PACK_CATEGORIES = ['weapons', 'armor', 'attachments', 'ammunition', 'cyberware', 'drugs', 'gear', 'programs'] as const;

interface PackLike {
  id: string;
  name: string;
  cost?: number;
  costTier?: string;
  sourcePage?: number;
  sourceBook?: string;
  booth?: string[];
}

function buildIndex(): Map<string, BoothItem[]> {
  const idx = new Map<string, BoothItem[]>();
  const add = (code: string, item: BoothItem) => {
    const list = idx.get(code) ?? [];
    list.push(item);
    idx.set(code, list);
  };
  const pack = coreData as unknown as Record<string, PackLike[]>;
  for (const cat of PACK_CATEGORIES) {
    for (const it of pack[cat] ?? []) {
      for (const code of it.booth ?? []) {
        add(code, { id: it.id, name: it.name, category: cat, cost: it.cost ?? 0, costTier: it.costTier ?? costTierFor(it.cost ?? 0), sourcePage: it.sourcePage, sourceBook: it.sourceBook ?? '' });
      }
    }
  }
  for (const v of BLACK_CHROME_VEHICLES) {
    for (const code of v.booth) {
      add(code, { id: v.id, name: v.name, category: 'vehicles', cost: v.cost, costTier: v.priceCategory, sourcePage: v.sourcePage, sourceBook: 'black_chrome' });
    }
  }
  for (const list of idx.values()) list.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
  return idx;
}

let INDEX: Map<string, BoothItem[]> | null = null;

/** Ítems de Black Chrome (y Black Chrome+) que se consiguen en un puesto, del más barato al más caro. */
export function itemsAtBooth(code: string): BoothItem[] {
  INDEX ??= buildIndex();
  return INDEX.get(code) ?? [];
}

/** Todos los códigos de puesto que citan los ítems. */
export function citedBoothCodes(): string[] {
  INDEX ??= buildIndex();
  return [...INDEX.keys()].sort();
}
