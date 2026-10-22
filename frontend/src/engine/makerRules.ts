// [Claude Code · 2026-10-23] Motor puro del Maker del Tech (Core pp. 147-149), plan 11 (v4.9.3).
import { ROLE_RANKS } from '../data/creation';
import { beatsDv, rollCheckD10 } from './combatEngine';
import type { MakerAllocation, MakerSpecialty } from './roleRules';

// ---------------------------------------------------------------- Categorías de precio
// Core pp. 338-339 (ejemplos del Night Market): umbrales de la categoría de precio.
export type MakerPriceCategory = 'Cheap' | 'Everyday' | 'Costly' | 'Premium' | 'Expensive' | 'Very Expensive' | 'Luxury' | 'Super Luxury';

export const MAKER_PRICE_EB: Record<MakerPriceCategory, number> = {
  Cheap: 10,
  Everyday: 20,
  Costly: 50,
  Premium: 100,
  Expensive: 500,
  'Very Expensive': 1000,
  Luxury: 5000,
  'Super Luxury': 10000,
};

const PRICE_ORDER: MakerPriceCategory[] = ['Cheap', 'Everyday', 'Costly', 'Premium', 'Expensive', 'Very Expensive', 'Luxury', 'Super Luxury'];

// Core pp. 338-339: el mayor umbral <= eb; menos de 10 es Cheap; 10.000 o más es Super Luxury.
export function priceCategoryForEb(eb: number): MakerPriceCategory {
  let result: MakerPriceCategory = 'Cheap';
  for (const c of PRICE_ORDER) {
    if (eb >= MAKER_PRICE_EB[c]) result = c;
  }
  return result;
}

// ---------------------------------------------------------------- DV y tiempo
interface MakerDvTimeRow { tier: string; dv: number; time: string }

const HOURS_BY_UNIT: Record<string, number> = { hora: 1, horas: 1, 'día': 24, 'días': 24, semana: 168, semanas: 168, mes: 720, meses: 720 };

function hoursFromLabel(label: string): number {
  const m = /^(\d+)\s+(\S+)/.exec(label.trim());
  if (!m) return 0;
  return Number(m[1]) * (HOURS_BY_UNIT[m[2]] ?? 0);
}

// Core p.149: tabla de DV y tiempo por categoría de precio (ROLE_RANKS.roles.Tech.tables.makerDvTime).
// Cheap y Everyday comparten fila; Super Luxury: 1 mes por cada 10.000 €$ de costo.
export function makerDvAndTime(category: MakerPriceCategory, priceEb?: number): { dv: number; timeLabel: string; hours: number } {
  const rows = (ROLE_RANKS.roles.Tech.tables as { makerDvTime: MakerDvTimeRow[] }).makerDvTime;
  const row = rows.find(r => r.tier.split('/').map(t => t.trim()).includes(category));
  if (!row) throw new Error(`makerDvAndTime: sin fila para ${category}`);
  if (category === 'Super Luxury') {
    const months = Math.max(1, Math.ceil((priceEb ?? MAKER_PRICE_EB['Super Luxury']) / 10000));
    return { dv: row.dv, timeLabel: months === 1 ? '1 mes' : `${months} meses`, hours: 720 * months };
  }
  return { dv: row.dv, timeLabel: row.time, hours: hoursFromLabel(row.time) };
}

// ---------------------------------------------------------------- Materiales
export type MakerMaterialSpecialty = 'upgrade' | 'fabrication' | 'invention';

// Core p.149 (Tech options[].effectEs): Upgrade = materiales de la misma categoría de precio;
// Fabrication = una categoría inferior (Cheap cuesta 5 €$; Super Luxury = la mitad del precio);
// Invention = el GM fija la categoría (mínimo Expensive).
export function materialCost(specialty: MakerMaterialSpecialty, category: MakerPriceCategory, priceEb: number): { eb: number | null; note: string } {
  if (specialty === 'invention') {
    return { eb: null, note: 'El GM fija la categoría (mínimo Expensive) y los materiales' };
  }
  if (specialty === 'upgrade') {
    return { eb: MAKER_PRICE_EB[category], note: 'Materiales de la misma categoría de precio que el objeto' };
  }
  if (category === 'Super Luxury') {
    return { eb: priceEb / 2, note: 'Super Luxury: materiales equivalentes a la mitad del precio' };
  }
  if (category === 'Cheap') {
    return { eb: 5, note: 'Fabricar un objeto Cheap cuesta 5 €$' };
  }
  const lower = PRICE_ORDER[PRICE_ORDER.indexOf(category) - 1];
  return { eb: MAKER_PRICE_EB[lower], note: `Materiales de una categoría inferior (${lower})` };
}

// Core p.148: las mejoras de vehículo se tratan como 1.000 €$ (Very Expensive).
export function vehicleUpgradeCategory(): MakerPriceCategory {
  return 'Very Expensive';
}

// ---------------------------------------------------------------- Skill sugerida
export type MakerItemKind = 'weapon' | 'armor' | 'clothing' | 'cyberware' | 'electronics' | 'landVehicle' | 'seaVehicle' | 'airVehicle' | 'other';

// Decisión 5 del plan 11, Core p.148: "the TECH Skill used to repair the item".
// Nota: el catálogo de skills de la app no tiene una skill "Fashion" (el Core solo trae "Wardrobe & Style",
// que no es una skill TECH), así que la ropa sugiere Basic Tech.
export function suggestedMakerSkill(kind: MakerItemKind): string {
  switch (kind) {
    case 'weapon': return 'Weaponstech';
    case 'armor': return 'Basic Tech';
    case 'clothing': return 'Basic Tech';
    case 'cyberware': return 'Cybertech';
    case 'electronics': return 'Electronics/Security Tech';
    case 'landVehicle': return 'Land Vehicle Tech';
    case 'seaVehicle': return 'Sea Vehicle Tech';
    case 'airVehicle': return 'Air Vehicle Tech';
    default: return 'Basic Tech';
  }
}

// ---------------------------------------------------------------- Tirada
export function specialtyRank(alloc: Partial<MakerAllocation> | undefined, specialty: MakerSpecialty): number {
  return alloc?.[specialty] ?? 0;
}

// Core p.148: Check = TECH + Skill TECH + rango de la especialidad + 1d10 contra el DV de la categoría.
// Si falla: Upgrade/Fabrication se reinician con los materiales intactos; una Invention vuelve a empezar.
export function rollMakerCheck(opts: { tech: number; skillLevel: number; specialtyRank: number; dv: number; rng?: () => number }): {
  natural: number; total: number; success: boolean; breakdown: string;
} {
  const roll = rollCheckD10(opts.rng);
  const base = opts.tech + opts.skillLevel + opts.specialtyRank;
  const total = base + roll.value;
  return {
    natural: roll.natural,
    total,
    success: beatsDv(total, opts.dv),
    breakdown: `TECH ${opts.tech} + Skill ${opts.skillLevel} + Especialidad ${opts.specialtyRank} + 1d10 (${roll.value}) = ${total} vs DV ${opts.dv}`,
  };
}

// ---------------------------------------------------------------- Field Expertise
// Core p.148: el rango de Field Expertise se suma a estas skills de Tech.
export function fieldExpertiseSkills(): string[] {
  return [...(ROLE_RANKS.roles.Tech.tables as { fieldExpertiseSkills: string[] }).fieldExpertiseSkills];
}

function normSkill(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase();
}

export function fieldExpertiseBonus(alloc: Partial<MakerAllocation> | undefined, skillName: string): number {
  const target = normSkill(skillName);
  return fieldExpertiseSkills().some(s => normSkill(s) === target) ? specialtyRank(alloc, 'field') : 0;
}

// Core p.148: el jury-rig dura 10 minutos por Rango de Field Expertise.
export function juryRigDurationMinutes(fieldRank: number): number {
  return 10 * fieldRank;
}
