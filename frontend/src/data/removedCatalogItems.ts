// [Claude Code · 2026-11-06] v5.12.0 (plan 26): ítems que salieron del catálogo porque no están en ningún libro
// (o eran vehículos cargados como equipo). Las fichas que los tengan los conservan; STREET LAB avisa.
import type { CharacterSheet } from '../types/cyberpunk';

export interface RemovedCatalogItem {
  id: string;
  name: string;
  category: 'weapons' | 'armor' | 'cyberware' | 'gear' | 'ammunition' | 'drugs';
  reason: string;
}

export const REMOVED_CATALOG_ITEMS: RemovedCatalogItem[] = [
  { id: "sternmeyer-m02", name: "Sternmeyer M-02 Heavy Rifle", category: 'weapons', reason: "no está en el libro (el de Black Chrome es el Sternmeyer M-04)" },
  { id: "borg-assault-rifle", name: "Borg Assault Rifle", category: 'weapons', reason: "no está en ningún libro" },
  { id: "tsunami-rasetsu", name: "Tsunami Arms Rasetsu", category: 'weapons', reason: "no está en ningún libro" },
  { id: "slamdance-hyper-hammer", name: "SlamDance Hyper-Hammer", category: 'weapons', reason: "no está en ningún libro" },
  { id: "sponsored-cyberarm", name: "Sponsored Cyberarm", category: 'cyberware', reason: "no está en ningún libro" },
  { id: "militech-tacvest", name: "Militech Tac-Vest", category: 'armor', reason: "no está en ningún libro" },
  { id: "trauma-team-armor", name: "Trauma Team Medtech Armor", category: 'armor', reason: "no está en ningún libro" },
  { id: "gibson-battlegear", name: "Gibson Battlegear", category: 'armor', reason: "no está en ningún libro" },
  { id: "skunkworks-stealth-suit", name: "Skunkworks Stealth Suit", category: 'armor', reason: "no está en ningún libro" },
  { id: "makigai-maimai", name: "Makigai MaiMai", category: 'gear', reason: "no está en ningún libro" },
  { id: "yaiba-kusanagi", name: "Yaiba Kusanagi CT-3X", category: 'gear', reason: "no está en ningún libro" },
  { id: "quadra-turbo-r", name: "Quadra Turbo-R V-Tech", category: 'gear', reason: "no está en ningún libro" },
  { id: "militech-gorgon", name: "Militech Gorgon Security Van", category: 'gear', reason: "es un vehículo de Black Chrome (vuelve con el catálogo de vehículos)" },
  { id: "zetatech-aerovox-av4", name: "Zetatech AeroVox AV-4", category: 'gear', reason: "es un vehículo de Black Chrome (vuelve con el catálogo de vehículos)" },
  { id: "grundy-salvage-suit", name: "Grundy Salvage Suit", category: 'gear', reason: "no está en ningún libro" },
];

const BY_ID = new Map(REMOVED_CATALOG_ITEMS.map((i) => [i.id, i]));
const ARMOR_BY_NAME = new Map(REMOVED_CATALOG_ITEMS.filter((i) => i.category === 'armor').map((i) => [i.name.toLowerCase(), i]));

/** Ítems borrados del catálogo que tiene esta ficha (armas, mochila, ciberware o armadura puesta). */
export function removedItemsInSheet(sheet: CharacterSheet): RemovedCatalogItem[] {
  const found = new Map<string, RemovedCatalogItem>();
  const add = (i: RemovedCatalogItem | undefined) => { if (i) found.set(i.id, i); };
  for (const w of sheet.equippedWeapons ?? []) add(BY_ID.get(w.id));
  for (const it of sheet.inventory ?? []) add(BY_ID.get(it.catalogId));
  for (const id of sheet.installedCyberwareIds ?? []) add(BY_ID.get(id));
  for (const a of [sheet.headArmor, sheet.bodyArmor]) add(ARMOR_BY_NAME.get((a?.name ?? '').toLowerCase()));
  return [...found.values()];
}
