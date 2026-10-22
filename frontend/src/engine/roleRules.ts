// Motor puro de reglas de rol (plan 9, v4.9.1). Cada regla cita libro y página. [Claude Code · 2026-10-22]
import { ROLE_RANKS } from '../data/creation';
import type { RoleRankRoleName, RoleRankStep, RoleTweak2077 } from '../data/creation';

export type RuleEra = '2045' | '2077';

// Core p.410: "Typical" 20 × nivel nuevo; "Difficult (x2)" 40 × nivel nuevo; rango de rol 60 × rango nuevo. No se saltean niveles.
export const IP_MAX_LEVEL = 10;

function validNew(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= IP_MAX_LEVEL;
}

export function ipCostSkillLevel(newLevel: number, x2: boolean): number {
  if (!validNew(newLevel)) return NaN;
  return (x2 ? 40 : 20) * newLevel;
}

export function ipCostRoleRank(newRank: number): number {
  if (!validNew(newRank)) return NaN;
  return 60 * newRank;
}

export interface IpRaiseCheck { ok: boolean; cost: number; reason?: string }

function checkRaise(current: number, cost: number, available: number): IpRaiseCheck {
  if (current >= IP_MAX_LEVEL) return { ok: false, cost: NaN, reason: 'Ya está en el máximo (10).' };
  if (available < cost) return { ok: false, cost, reason: `Faltan ${cost - available} IP (cuesta ${cost}, tenés ${available}).` };
  return { ok: true, cost };
}

export function checkSkillRaise(current: number, x2: boolean, available: number): IpRaiseCheck {
  return checkRaise(current, ipCostSkillLevel(current + 1, x2), available);
}

export function checkRoleRankRaise(current: number, available: number): IpRaiseCheck {
  return checkRaise(current, ipCostRoleRank(current + 1), available);
}

// Core p.197 (tabla en ROLE_RANKS.roles.Netrunner.tables.netActionsByRank); rango < 1 -> 0; > 10 -> el de 10.
export function netActionsForInterface(rank: number): number {
  if (!(rank >= 1)) return 0;
  const r = Math.min(IP_MAX_LEVEL, Math.floor(rank));
  const table = ROLE_RANKS.roles.Netrunner.tables.netActionsByRank as { fromRank: number; toRank: number; actions: number }[];
  const row = table.find(t => r >= t.fromRank && r <= t.toRank);
  return row ? row.actions : 0;
}

// CEMK RB p.25: R1 DV6, R2 DV8, R3 DV10, R4+ DV12; rango < 1 -> 0.
export function maxQuickhackDv(rank: number): number {
  if (!(rank >= 1)) return 0;
  const r = Math.floor(rank);
  if (r === 1) return 6;
  if (r === 2) return 8;
  if (r === 3) return 10;
  return 12;
}

// CEMK RB p.25: desde Interface 3 se supera automático el firewall base del Neuroport; con 1-2 hay que superar DV6.
export function neuroportFirewallDv(rank: number): number | null {
  if (!(rank >= 1)) return null;
  return Math.floor(rank) <= 2 ? 6 : null;
}

// CEMK RB p.26: en 2045 los Quickhacks solo con Neuroport; en 2077 se asume Neuroport salvo que hasNeuroport === false.
export function canUseQuickhacks(era: RuleEra, hasNeuroport: boolean | undefined): boolean {
  if (era === '2045') return hasNeuroport === true;
  return hasNeuroport !== false;
}

// Jack In (decisión de Giuliano, discrepancia 33): 6 m con cyberdeck común, 8 m con Range Upgrade (Core p.208), 50 m con Cyberdeck Port (CEMK RB pp. 16, 36).
export function jackInRangeM(opts: { rangeUpgrade?: boolean; cyberdeckPort?: boolean }): number {
  if (opts.cyberdeckPort) return 50;
  if (opts.rangeUpgrade) return 8;
  return 6;
}

export type PriceCategory = 'Everyday' | 'Expensive' | 'Very Expensive' | 'Luxury' | 'Super Luxury';
export interface FixerReach { category: PriceCategory; source: 'Core' | 'CEMK'; nightMarket: boolean; midnightMarket: boolean; citeEs: string }

const PRICE_ORDER: PriceCategory[] = ['Everyday', 'Expensive', 'Very Expensive', 'Luxury', 'Super Luxury'];

// Core pp. 159-161 (Reach por rango): R1-2 Everyday, R3-6 Expensive, R7-8 Very Expensive, R9 Luxury, R10 Super Luxury.
function coreReach(r: number): PriceCategory {
  if (r >= 10) return 'Super Luxury';
  if (r >= 9) return 'Luxury';
  if (r >= 7) return 'Very Expensive';
  if (r >= 3) return 'Expensive';
  return 'Everyday';
}

// CEMK RB p.25 (solo era 2077): R1 Expensive, R4 Very Expensive, R7 Luxury, R9 Super Luxury.
function cemkReach(r: number): PriceCategory {
  if (r >= 9) return 'Super Luxury';
  if (r >= 7) return 'Luxury';
  if (r >= 4) return 'Very Expensive';
  return 'Expensive';
}

// En 2077 se usa la categoría más alta de las dos (decisión de Giuliano, plan 8); en empate gana 'Core'.
export function fixerReach(rank: number, era: RuleEra): FixerReach {
  const r = Math.min(IP_MAX_LEVEL, Math.max(1, Math.floor(rank) || 1));
  const core = coreReach(r);
  let category = core;
  let source: 'Core' | 'CEMK' = 'Core';
  if (era === '2077') {
    const cemk = cemkReach(r);
    if (PRICE_ORDER.indexOf(cemk) > PRICE_ORDER.indexOf(core)) { category = cemk; source = 'CEMK'; }
  }
  return {
    category,
    source,
    nightMarket: r >= 5, // Core p.160
    midnightMarket: r >= 9, // Core p.160
    citeEs: source === 'Core' ? 'Core p.160' : 'CEMK RB p.25',
  };
}

export interface RoleRankInfo { role: RoleRankRoleName; rank: number; unlocked: RoleRankStep[]; next: RoleRankStep | null; tweaks2077: RoleTweak2077[] }

export function getRoleRankInfo(role: RoleRankRoleName, rank: number, era: RuleEra): RoleRankInfo {
  const data = ROLE_RANKS.roles[role];
  const unlocked = data.ranks.filter(s => s.rank <= rank);
  const next = data.ranks.find(s => s.rank > rank) ?? null;
  const tweaks2077 = era === '2077' ? data.tweak2077.filter(t => t.fromRank === null || t.fromRank <= rank) : [];
  return { role, rank, unlocked, next, tweaks2077 };
}

// Speedheal híbrido (decisión de mesa de Giuliano; Core p.150 y CEMK Folios p.17): un Medtech puede aplicar 1 Speedheal por Beat; un paciente no puede recibir más de 1 por día.
export interface SpeedhealUse { medtechId: string; patientId: string; beatId: string; dayKey: string }
export function canApplySpeedheal(log: SpeedhealUse[], use: SpeedhealUse): { ok: boolean; reason?: string } {
  if (log.some(l => l.medtechId === use.medtechId && l.beatId === use.beatId)) {
    return { ok: false, reason: 'Este Medtech ya usó Speedheal en este Beat (CEMK Folios p.17).' };
  }
  if (log.some(l => l.patientId === use.patientId && l.dayKey === use.dayKey)) {
    return { ok: false, reason: 'Este paciente ya recibió Speedheal hoy (Core p.150).' };
  }
  return { ok: true };
}

// Maker (Core pp. 147-149 + discrepancia 24): rango N = 2N rangos de especialidad; ninguna especialidad supera N.
export type MakerSpecialty = 'field' | 'upgrade' | 'fabrication' | 'invention';
export type MakerAllocation = Record<MakerSpecialty, number>;
const MAKER_KEYS: MakerSpecialty[] = ['field', 'upgrade', 'fabrication', 'invention'];
const MAKER_NAMES: Record<MakerSpecialty, string> = { field: 'Field Expertise', upgrade: 'Upgrade Expertise', fabrication: 'Fabrication Expertise', invention: 'Invention Expertise' };

export function makerPointsTotal(rank: number): number {
  return 2 * rank;
}
function sumKeys<K extends string>(alloc: Partial<Record<K, number>> | undefined, keys: K[]): number {
  return keys.reduce((s, k) => s + (alloc?.[k] ?? 0), 0);
}
export function makerPointsFree(alloc: Partial<MakerAllocation> | undefined, rank: number): number {
  return makerPointsTotal(rank) - sumKeys(alloc, MAKER_KEYS);
}
export function validateMakerAllocation(alloc: Partial<MakerAllocation> | undefined, rank: number): string[] {
  const errors: string[] = [];
  for (const k of MAKER_KEYS) {
    const v = alloc?.[k] ?? 0;
    if (!Number.isInteger(v) || v < 0) errors.push(`${MAKER_NAMES[k]}: el valor debe ser un entero mayor o igual a 0.`);
    else if (v > rank) errors.push(`${MAKER_NAMES[k]} no puede superar el rango de rol (${rank}).`);
  }
  const total = sumKeys(alloc, MAKER_KEYS);
  if (total > makerPointsTotal(rank)) errors.push(`Se asignaron ${total} rangos de especialidad pero solo hay ${makerPointsTotal(rank)}.`);
  return errors;
}

// Medicine (Core pp. 149-150 + discrepancias 26 y 27): rango N = N puntos; cada especialidad máx. 5 puntos; Surgery = 2 niveles por punto (máx. 10); cada punto de Pharmaceuticals = 1 nivel de Medical Tech y 1 fármaco conocido.
export interface MedicineAllocation { surgery: number; pharmaceuticals: number; cryosystem: number; knownPharmaceuticals?: string[] }
const MEDICINE_KEYS: ('surgery' | 'pharmaceuticals' | 'cryosystem')[] = ['surgery', 'pharmaceuticals', 'cryosystem'];
const MEDICINE_MAX_PER_SPECIALTY = 5;
const MEDICINE_NAMES = { surgery: 'Surgery', pharmaceuticals: 'Pharmaceuticals', cryosystem: 'Cryosystem Operation' };

export function medicinePointsFree(alloc: Partial<MedicineAllocation> | undefined, rank: number): number {
  return rank - sumKeys(alloc, MEDICINE_KEYS);
}
export function validateMedicineAllocation(alloc: Partial<MedicineAllocation> | undefined, rank: number): string[] {
  const errors: string[] = [];
  for (const k of MEDICINE_KEYS) {
    const v = alloc?.[k] ?? 0;
    if (!Number.isInteger(v) || v < 0) errors.push(`${MEDICINE_NAMES[k]}: el valor debe ser un entero mayor o igual a 0.`);
    else if (v > MEDICINE_MAX_PER_SPECIALTY) errors.push(`${MEDICINE_NAMES[k]} no puede superar ${MEDICINE_MAX_PER_SPECIALTY} puntos.`);
  }
  const total = sumKeys(alloc, MEDICINE_KEYS);
  if (total > rank) errors.push(`Se asignaron ${total} puntos de Medicine pero solo hay ${rank}.`);
  const known = alloc?.knownPharmaceuticals?.length ?? 0;
  if (known > (alloc?.pharmaceuticals ?? 0)) errors.push(`Hay ${known} fármacos conocidos pero solo ${alloc?.pharmaceuticals ?? 0} puntos de Pharmaceuticals.`);
  return errors;
}
export function surgeryLevel(alloc: Partial<MedicineAllocation> | undefined): number {
  return Math.min(10, (alloc?.surgery ?? 0) * 2);
}
export function medicalTechFromPharma(alloc: Partial<MedicineAllocation> | undefined): number {
  return Math.min(10, alloc?.pharmaceuticals ?? 0);
}
