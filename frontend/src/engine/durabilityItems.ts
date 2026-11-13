// [Claude Code · 2026-11-13] v5.31.0 (plan 31): lista de lo que hay que mantener en una ficha (IR5 pp.5-7).
// Cada ítem lleva la clave de `engine/itemNames.ts`, su costo (del catálogo si la ficha no lo guarda) y su tipo de equipo.
import coreData from '../data/core-rules.cprpack.json';
import { CORE_VEHICLES } from '../data/creation/coreVehicles';
import { BLACK_CHROME_VEHICLES } from '../data/blackChromeVehicles';
import { INTERFACE_RED_VEHICLES } from '../data/interfaceRedVehicles';
import { FBC_16_CYBERWARE } from '../data/goingMetalFbcData';
import type { CharacterSheet } from '../types/cyberpunk';
import { nicknameKey } from './itemNames';
import { gearKindFor, malfunctionTableFor, type GearKind } from './maintenance';
import type { MalfunctionTableId } from '../data/malfunctionTables';

type Row = { id: string; name: string; cost?: number; type?: string };
const pack = coreData as unknown as { armor: Row[]; cyberware: Row[] };

export interface DurabilityItem {
  key: string;
  name: string;
  cost: number;
  kind: GearKind;
  table: MalfunctionTableId;
  group: 'Armas' | 'Armadura' | 'Ciberware' | 'Mochila' | 'Vehículos';
}

const VEHICLE_COSTS = new Map<string, number>([
  ...CORE_VEHICLES.vehicles.map((v) => [v.name.toLowerCase(), v.costEb] as [string, number]),
  ...[...BLACK_CHROME_VEHICLES, ...INTERFACE_RED_VEHICLES].map((v) => [v.name.toLowerCase(), v.cost] as [string, number]),
]);

/** Categorías de la mochila que son equipo (la munición, las drogas y los programas no se mantienen). */
const MAINTAINED = new Set(['weapons', 'armor', 'cyberware', 'attachments', 'gear']);

const slug = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stripPrefix = (id: string) => id.replace(/^(cw-cemk-|cw-|cemk-)/, '');
const titleFromId = (id: string) => stripPrefix(id).split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

/** Ciberware por id; las fichas de los Folios usan ids propios (`cw-cemk-…`), que se buscan por nombre. */
export function findCyberware(id: string): Row | undefined {
  const exact = [...pack.cyberware, ...FBC_16_CYBERWARE].find((x) => x.id === id);
  if (exact) return exact;
  const s = stripPrefix(id);
  return pack.cyberware.find((x) => slug(x.name) === s || stripPrefix(x.id) === s);
}

export function durabilityItems(sheet: CharacterSheet): DurabilityItem[] {
  const out: DurabilityItem[] = [];
  for (const w of sheet.equippedWeapons ?? []) {
    out.push({ key: nicknameKey.weapon(w.instanceId), name: w.name, cost: w.cost ?? 0, kind: 'weapon', table: 'weapon', group: 'Armas' });
  }
  for (const loc of ['head', 'body'] as const) {
    const a = loc === 'head' ? sheet.headArmor : sheet.bodyArmor;
    if (!a?.name || a.maxSp <= 0) continue;
    const plain = a.name.replace(/\s*\([^)]*\)\s*$/, '');
    const cost = (pack.armor.find((x) => x.name === a.name) ?? pack.armor.find((x) => x.name === plain))?.cost ?? 0;
    out.push({ key: nicknameKey.armor(loc), name: `${a.name} (${loc === 'head' ? 'cabeza' : 'cuerpo'})`, cost, kind: 'armor', table: 'armor', group: 'Armadura' });
  }
  for (const id of new Set(sheet.installedCyberwareIds ?? [])) {
    const c = findCyberware(id);
    const name = c?.name ?? titleFromId(id);
    out.push({ key: nicknameKey.cyberware(id), name, cost: c?.cost ?? 0, kind: 'cyberware', table: malfunctionTableFor('cyberware', c?.type, name), group: 'Ciberware' });
  }
  for (const it of sheet.inventory ?? []) {
    if (!MAINTAINED.has(it.category)) continue;
    const kind = it.category === 'attachments' ? 'weapon' : gearKindFor(it.category, it.name);
    out.push({ key: nicknameKey.inventory(it.id), name: it.name, cost: it.cost ?? 0, kind, table: malfunctionTableFor(kind, undefined, it.name), group: 'Mochila' });
  }
  for (const v of sheet.vehicles ?? []) {
    const kind: GearKind = v.category === 'air' ? 'vehicle_air' : v.category === 'sea' ? 'vehicle_sea' : 'vehicle_land';
    out.push({ key: `veh:${v.instanceId}`, name: v.name, cost: VEHICLE_COSTS.get(v.name.toLowerCase()) ?? 0, kind, table: 'vehicle', group: 'Vehículos' });
  }
  return out;
}
