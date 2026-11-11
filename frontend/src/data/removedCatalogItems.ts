// [Claude Code · 2026-11-06] v5.12.0 (plan 26): ítems que salieron del catálogo porque no están en ningún libro
// (o eran vehículos cargados como equipo). Las fichas que los tengan los conservan; STREET LAB avisa.
import type { CharacterSheet } from '../types/cyberpunk';

export interface RemovedCatalogItem {
  id: string;
  name: string;
  category: 'weapons' | 'armor' | 'cyberware' | 'gear' | 'ammunition' | 'drugs' | 'vehicles';
  reason: string;
}

export const REMOVED_CATALOG_ITEMS: RemovedCatalogItem[] = [
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
  // [Claude Code · 2026-11-06] v5.13.0: vehículos del viejo VEHICLES_CATALOG. El vehículo sigue en el garaje.
  { id: "veh-makigai-maimai", name: "Makigai MaiMai", category: 'vehicles', reason: "no está en ningún libro (el de Black Chrome es el Makigai Ebi, p.72)" },
  { id: "veh-yaiba-kusanagi", name: "Yaiba Kusanagi CT-3X", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-brennan-apollo", name: "Brennan Apollo 650", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-quadra-turbo-r", name: "Quadra Turbo-R V-Tech", category: 'vehicles', reason: "no está en ningún libro (el de Black Chrome es el Quadra Thunder-X, p.76)" },
  { id: "veh-thorton-galena", name: "Thorton Galena GA40XT", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-villefort-cortes", name: "Villefort Cortes V5000", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-chevillon-thrax", name: "Chevillon Thrax 388 Jefferson", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-militech-gorgon", name: "Militech Gorgon Security Van", category: 'vehicles', reason: "tenía datos inventados; el del libro (Black Chrome p.73) está en el catálogo de vehículos" },
  { id: "veh-peterbilt-combat-rig", name: "Peterbilt Combat Rig Juggernaut", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-sea-sprite", name: "Sea Sprite Patrol Cutter", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-grundy-salvage-sub", name: "Grundy Heavy Salvage Sub", category: 'vehicles', reason: "no está en ningún libro (el de Black Chrome es The Grundy, p.68)" },
  { id: "veh-bell-combat-gyro", name: "Bell Combat Gyrocopter", category: 'vehicles', reason: "no está en ningún libro" },
  { id: "veh-zetatech-aerovox-av4", name: "Zetatech AeroVox AV-4", category: 'vehicles', reason: "tenía datos inventados; el del libro (Black Chrome p.61) está en el catálogo de vehículos" },
  { id: "veh-arasaka-kenshin-av9", name: "Arasaka Kenshin Heavy AV-9", category: 'vehicles', reason: "no está en ningún libro" },
];

const BY_ID = new Map(REMOVED_CATALOG_ITEMS.map((i) => [i.id, i]));
const ARMOR_BY_NAME = new Map(REMOVED_CATALOG_ITEMS.filter((i) => i.category === 'armor').map((i) => [i.name.toLowerCase(), i]));

/** Ítems borrados del catálogo que tiene esta ficha (armas, mochila, ciberware, armadura puesta o garaje). */
export function removedItemsInSheet(sheet: CharacterSheet): RemovedCatalogItem[] {
  const found = new Map<string, RemovedCatalogItem>();
  const add = (i: RemovedCatalogItem | undefined) => { if (i) found.set(i.id, i); };
  for (const w of sheet.equippedWeapons ?? []) add(BY_ID.get(w.id));
  for (const it of sheet.inventory ?? []) add(BY_ID.get(it.catalogId));
  for (const id of sheet.installedCyberwareIds ?? []) add(BY_ID.get(id));
  for (const a of [sheet.headArmor, sheet.bodyArmor]) add(ARMOR_BY_NAME.get((a?.name ?? '').toLowerCase()));
  for (const v of sheet.vehicles ?? []) add(BY_ID.get(v.catalogId));
  return [...found.values()];
}
