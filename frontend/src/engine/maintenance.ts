// [Claude Code · 2026-11-13] v5.31.0 (plan 31): durabilidad y mantenimiento, "Breaking Your Stuff" (Interface RED Vol. 5 pp.3-12).
// Reglas opcionales del libro. Lógica pura: estado de cada ítem, mantenimiento por Lifestyle o por tirada, fallas y reventa.
import { MALFUNCTION_TABLES, type MalfunctionRow, type MalfunctionTable, type MalfunctionTableId } from '../data/malfunctionTables';
import { COST_TIERS, tierForCost } from './gunpath';
import { rollDie, type Rng } from './nightMarket';
import type { ItemDurability } from '../types/cyberpunk';

export type { ItemDurability };

/** Condiciones del equipo: Destroyed y Destroyed Beyond Repair ya existían (Core p.140); Damaged es nueva (IR5 p.4). */
export type ItemCondition = 'damaged' | 'destroyed' | 'beyond_repair';

export const CONDITION_LABEL: Record<ItemCondition, string> = {
  damaged: 'Damaged',
  destroyed: 'Destroyed',
  beyond_repair: 'Destroyed Beyond Repair',
};

/** Tipos de equipo de la tabla Maintenance Skills (IR5 p.6). */
export type GearKind =
  | 'armor'
  | 'cyberdeck'
  | 'cyberware'
  | 'drone'
  | 'general'
  | 'electronics'
  | 'vehicle_air'
  | 'vehicle_land'
  | 'vehicle_sea'
  | 'weapon';

export const MAINTENANCE_SKILLS: Record<GearKind, { label: string; skill: string }> = {
  armor: { label: 'Armadura', skill: 'Basic Tech' },
  cyberdeck: { label: 'Cyberdeck', skill: 'Electronics/Security Tech' },
  cyberware: { label: 'Ciberware', skill: 'Cybertech' },
  drone: { label: 'Dron', skill: 'Electronics/Security Tech' },
  general: { label: 'Equipo general', skill: 'Basic Tech' },
  electronics: { label: 'Electrónica personal', skill: 'Electronics/Security Tech' },
  vehicle_air: { label: 'Vehículo aéreo', skill: 'Air Vehicle Tech' },
  vehicle_land: { label: 'Vehículo terrestre', skill: 'Land Vehicle Tech' },
  vehicle_sea: { label: 'Vehículo marítimo', skill: 'Sea Vehicle Tech' },
  weapon: { label: 'Arma', skill: 'Weaponstech' },
};

/** Lifestyles en orden (Core p.377). */
export const LIFESTYLE_LADDER = ['Kibble', 'Generic Prepak', 'Good Prepak', 'Fresh Food'] as const;
export type Lifestyle = (typeof LIFESTYLE_LADDER)[number];

/** Maintenance Basics (IR5 p.7): desde qué valor pide cada Lifestyle, con su DV y su tiempo si hay que tirar. */
export const MAINTENANCE_BASICS: { gearMin: number; vehicleMin: number; lifestyle: Lifestyle; dv: number; time: string }[] = [
  { gearMin: 0, vehicleMin: 0, lifestyle: 'Kibble', dv: 13, time: '30 minutos' },
  { gearMin: 500, vehicleMin: 20000, lifestyle: 'Generic Prepak', dv: 15, time: '1 hora' },
  { gearMin: 1000, vehicleMin: 50000, lifestyle: 'Good Prepak', dv: 17, time: '3 horas' },
  { gearMin: 5000, vehicleMin: 100000, lifestyle: 'Fresh Food', dv: 21, time: '1 día' },
];

export const isVehicleKind = (k: GearKind) => k === 'drone' || k.startsWith('vehicle_');

export function maintenanceRow(cost: number, kind: GearKind) {
  const vehicle = isVehicleKind(kind);
  let row = MAINTENANCE_BASICS[0];
  for (const r of MAINTENANCE_BASICS) if (cost >= (vehicle ? r.vehicleMin : r.gearMin)) row = r;
  return row;
}

/** Roles que suben un nivel de Lifestyle para mantener cierto equipo (IR5 p.6). Media y Rockerboy dependen del ítem: va por `roleGear`. */
export function roleLifestyleBonus(role: string, kind: GearKind, roleGear: boolean): number {
  const r = role.toLowerCase();
  if (r === 'tech') return 1;
  if ((r === 'solo' || r === 'lawman') && (kind === 'weapon' || kind === 'armor')) return 1;
  if (r === 'netrunner' && kind === 'cyberdeck') return 1;
  if ((r === 'media' || r === 'rockerboy') && roleGear) return 1;
  return 0;
}

/** Exec (equipo de su empresa), Medtech (lo que le da su Habilidad de Rol) y Nomad (vehículos de la familia) no mantienen (IR5 p.6). */
export function roleExempt(role: string, roleGear: boolean): boolean {
  return roleGear && ['exec', 'medtech', 'nomad'].includes(role.toLowerCase());
}

export interface MaintenanceInfo {
  kind: GearKind;
  skill: string;
  needed: Lifestyle;
  /** Lifestyle con el que cuenta, con el +1 del Rol si corresponde. */
  effective: string;
  automatic: boolean;
  exempt: boolean;
  dv: number;
  time: string;
}

/** Cómo se mantiene un ítem: gratis con el Lifestyle (o el Rol), o una tirada por mes con su DV y su tiempo (IR5 pp.5-7). */
export function maintenanceInfo(cost: number, kind: GearKind, lifestyle: Lifestyle | undefined, role: string, roleGear = false): MaintenanceInfo {
  const row = maintenanceRow(cost, kind);
  const exempt = roleExempt(role, roleGear);
  const base = lifestyle ? LIFESTYLE_LADDER.indexOf(lifestyle) : -1;
  const idx = base < 0 ? -1 : base + roleLifestyleBonus(role, kind, roleGear);
  const effective = idx < 0 ? 'Sin Lifestyle' : idx >= LIFESTYLE_LADDER.length ? `${LIFESTYLE_LADDER[LIFESTYLE_LADDER.length - 1]} +${idx - LIFESTYLE_LADDER.length + 1}` : LIFESTYLE_LADDER[idx];
  const automatic = exempt || idx >= LIFESTYLE_LADDER.indexOf(row.lifestyle);
  return { kind, skill: MAINTENANCE_SKILLS[kind].skill, needed: row.lifestyle, effective, automatic, exempt, dv: row.dv, time: row.time };
}

/** Tirada de mantenimiento: si falla, a mitad del trabajo te das cuenta y hay que empezar de nuevo (IR5 p.5). */
export function maintenanceCheck(total: number, dv: number): { success: boolean; text: string } {
  return total >= dv
    ? { success: true, text: `Mantenimiento hecho (${total} contra DV${dv}): se quita Damaged y cualquier falla en curso.` }
    : { success: false, text: `Falló (${total} contra DV${dv}): a mitad del trabajo te das cuenta del error y hay que empezar de nuevo.` };
}

/** Valor de venta o como materiales de Maker (IR5 p.5): Damaged baja una Categoría, Destroyed dos, Beyond Repair no vale nada. */
export function resaleValue(cost: number, condition: ItemCondition | undefined): { cost: number; tier: string; note?: string } {
  if (!condition) return { cost, tier: tierForCost(cost) };
  if (condition === 'beyond_repair') return { cost: 0, tier: '—', note: 'Pocos Fixers lo compran; para el Maker no vale nada.' };
  const i = COST_TIERS.findIndex((t) => t.tier === tierForCost(cost));
  const j = i - (condition === 'damaged' ? 1 : 2);
  if (j < 0) return { cost: 0, tier: '—', note: 'Ya no baja más: casi nadie lo compra.' };
  const note = condition === 'damaged' && cost <= 20 ? 'Pocos Fixers compran equipo Damaged de 20eb (Everyday) o menos.' : condition === 'destroyed' ? 'Solo algunos Fixers compran equipo Destroyed.' : undefined;
  return { cost: COST_TIERS[j].cost, tier: COST_TIERS[j].tier, note };
}

/** Qué tabla de fallas usa cada ítem (IR5 pp.8-12). Si un ítem entra en varias, el GM elige una (p.6). */
export function malfunctionTableFor(kind: GearKind, cyberwareType?: string, name = ''): MalfunctionTableId {
  const n = name.toLowerCase();
  if (kind === 'weapon') return 'weapon';
  if (kind === 'armor') return 'armor';
  if (kind === 'cyberdeck') return 'cyberdeck';
  if (kind === 'drone') return 'drone';
  if (kind.startsWith('vehicle_')) return 'vehicle';
  if (kind === 'cyberware') {
    const t = (cyberwareType ?? '').toLowerCase();
    if (n.includes('linear frame') || n.includes('cyberchair')) return 'linear_frame';
    if (t.includes('cyberlimb') || t.includes('cyberarm') || t.includes('cyberleg')) return 'cyberlimb';
    if (t.includes('cyberaudio') || t.includes('cyberoptic')) return 'cyberaudio_optics';
    if (t.includes('neuralware')) return 'neuralware';
    return 'cyberware_body';
  }
  if (n.includes('linear frame') || n.includes('cyberchair')) return 'linear_frame';
  return 'general_gear';
}

/** Tipo de equipo de un ítem de la mochila o un arma o armadura. */
export function gearKindFor(category: string, name = ''): GearKind {
  const n = name.toLowerCase();
  if (category === 'weapons') return 'weapon';
  if (category === 'armor') return 'armor';
  if (category === 'cyberware') return 'cyberware';
  if (n.includes('cyberdeck') || n.includes(' deck')) return 'cyberdeck';
  if (n.includes('drone')) return 'drone';
  if (/agent|phone|radio|scanner|computer|goggles|glasses|camera|recorder|jammer|tracer|ears|glove/.test(n)) return 'electronics';
  return 'general';
}

export function malfunctionTable(id: MalfunctionTableId): MalfunctionTable {
  return MALFUNCTION_TABLES.find((t) => t.id === id)!;
}

export function rollMalfunction(id: MalfunctionTableId, rng: Rng = Math.random): MalfunctionRow {
  const roll = rollDie(6, rng);
  return malfunctionTable(id).rows.find((r) => r.roll === roll)!;
}

/** Jury rig del Maker (IR5 p.8): con la DV de mantenimiento, el equipo anda 10 minutos por punto de Field Expertise. */
export function juryRigMinutes(fieldExpertise: number): number {
  return Math.max(0, fieldExpertise) * 10;
}

/** Reglas para mostrar (IR5 pp.4-8). */
export const DURABILITY_RULES: string[] = [
  'Reglas opcionales: si no suman a la mesa, no se usan, o se usan solo con algunos ítems (IR5 p.4).',
  'Damaged: el equipo funciona pero puede fallar. Lo pone el GM por falta de mantenimiento, mal uso o castigo: Critical Injury en la zona, electrocución, clima o ambiente, 20+ de daño después del SP, fuego o radiación 2+ Rounds, venenos o drogas en el ciberware (IR5 pp.4, 7-8).',
  'Darse cuenta de que algo está Damaged: Tech Skill DV13 y 1 minuto. Opcional: tirada opuesta contra la Forgery de quien lo maquilló (IR5 p.4).',
  'Mantenimiento: si tu Lifestyle alcanza el del valor del ítem, es automático. Si no, una vez por mes, tirada con la DV y el tiempo de la tabla. Cada attachment o mejora se mantiene aparte; cualquiera puede tirar por otro, pero el Lifestyle solo cubre lo tuyo. No cuesta plata (IR5 pp.5-7).',
  'El mantenimiento quita Damaged y cualquier falla en curso. Reparar HP, SDP o SP no es mantenimiento (IR5 pp.5-6, 8).',
  'Fallas: el GM las impone en el momento más dramático o, como regla automática, cuando sale un 1 natural usando un ítem mal mantenido. Duran lo que indica la tabla (IR5 p.8).',
  'Jury rig: un Tech con Field Expertise (Maker) tira como Acción contra la DV de mantenimiento; si pasa, el equipo anda bien 10 minutos por punto de Field Expertise y después vuelve la falla (IR5 p.8).',
  'Venta: Damaged se vende una Categoría abajo y Destroyed dos; Beyond Repair casi no se compra. Lo mismo para desarmarlo como materiales de Maker. Los Fixers con Operator 4+ notan el Damaged solos, salvo que lo hayan disimulado (IR5 p.5).',
];
