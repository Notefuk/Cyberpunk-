// [Claude Code · 2026-11-13] v5.30.0 (plan 31): Gunpath, generador de armas de Toggle's Temple (Interface RED Vol. 5 pp.48-53).
// Lógica pura con Rng inyectable. Orden del libro: fabricante (1d100), tipo (1d10), calidad (1d6), attachments, nombre (1d100).
import {
  GUNPATH_ATTACHMENTS,
  GUNPATH_MANUFACTURERS,
  GUNPATH_NAMES,
  GUNPATH_QUALITY,
  GUNPATH_TYPES,
  type GunpathTypeRow,
} from '../data/gmTables/gunpath';
import { rollDie, type Rng } from './nightMarket';
import type { WeaponItem } from '../types/cyberpunk';

/** Escalera de Categorías de Costo (Core p.336). */
export const COST_TIERS: { tier: string; cost: number }[] = [
  { tier: 'Cheap', cost: 10 },
  { tier: 'Everyday', cost: 20 },
  { tier: 'Costly', cost: 50 },
  { tier: 'Premium', cost: 100 },
  { tier: 'Expensive', cost: 500 },
  { tier: 'Very Expensive', cost: 1000 },
  { tier: 'Luxury', cost: 5000 },
  { tier: 'Super Luxury', cost: 10000 },
];

/** ¿El número cae en la fila? Acepta '7', '1-10' y listas como '2, 4, 6'. */
export function rollMatches(roll: string, n: number): boolean {
  return roll.split(',').some((part) => {
    const [a, b] = part.trim().split('-').map(Number);
    return b === undefined ? n === a : n >= a && n <= b;
  });
}

function pick<T extends { roll: string }>(rows: T[], n: number): T {
  const row = rows.find((r) => rollMatches(r.roll, n));
  if (!row) throw new Error(`Gunpath: sin fila para ${n}`);
  return row;
}

const dieSides = (die: string) => Number(die.replace(/^1d/, ''));

export type GunpathSkill = GunpathTypeRow['skill'];
export type GunpathQuality = 'poor' | 'standard' | 'excellent';

export interface GunpathAttachment {
  name: string;
  cost: number;
}

export interface GunpathWeapon {
  manufacturer: string;
  manufacturerNote?: string;
  type: string;
  skill: GunpathSkill;
  baseCost: number;
  baseTier: string;
  quality: GunpathQuality;
  attachments: GunpathAttachment[];
  namePattern: string;
  nameExample?: string;
  /** Costo final y su Categoría, con calidad y attachments (IR5 pp.50-51). */
  cost: number;
  costTier: string;
}

/** Calidad: Poor baja una Categoría y Excellent sube una (IR5 p.50). Devuelve el costo de la Categoría resultante. */
export function qualityAdjustedCost(baseCost: number, quality: GunpathQuality): number {
  const i = COST_TIERS.findIndex((t) => t.cost === baseCost);
  const j = Math.max(0, Math.min(COST_TIERS.length - 1, i + (quality === 'poor' ? -1 : quality === 'excellent' ? 1 : 0)));
  return COST_TIERS[j].cost;
}

/** La Categoría solo sube si el costo iguala o supera la siguiente (IR5 p.51). */
export function tierForCost(cost: number): string {
  let tier = COST_TIERS[0].tier;
  for (const t of COST_TIERS) if (cost >= t.cost) tier = t.tier;
  return tier;
}

export function totalCost(baseCost: number, quality: GunpathQuality, attachments: GunpathAttachment[]): { cost: number; costTier: string } {
  const cost = qualityAdjustedCost(baseCost, quality) + attachments.reduce((s, a) => s + a.cost, 0);
  return { cost, costTier: tierForCost(cost) };
}

/**
 * Elegibilidad de Silencer y Grapple Gun Underbarrel (IR5 p.48): el Silencer no va en armas explosivas ni en
 * arcos y ballestas; el Grapple Gun Underbarrel solo en ballestas y armas de Shoulder Arms.
 */
export function attachmentEligible(name: string, type: string, skill: GunpathSkill): boolean {
  if (name === 'Silencer') return !['Bow', 'Crossbow', 'Grenade Launcher', 'Rocket Launcher'].includes(type);
  if (name === 'Grapple Gun Underbarrel') return type === 'Crossbow' || skill === 'Shoulder Arms';
  return true;
}

export function rollType(rng: Rng): { type: string; skill: GunpathSkill; baseCost: number; baseTier: string } {
  const row = pick(GUNPATH_TYPES.rows, rollDie(dieSides(GUNPATH_TYPES.die), rng));
  if (row.subRoll) {
    const sub = pick(row.subRoll.rows, rollDie(dieSides(row.subRoll.die), rng));
    return { type: sub.type, skill: row.skill, baseCost: sub.baseCost, baseTier: sub.costTier };
  }
  return { type: row.type, skill: row.skill, baseCost: row.baseCost, baseTier: row.costTier };
}

/**
 * Tira `count` attachments en la tabla de la Skill. El libro no fija cuántos ni dice nada de repetidos
 * (IR5 p.51): la app deja elegir la cantidad y vuelve a tirar los repetidos y los que no son elegibles.
 */
export function rollAttachments(skill: GunpathSkill, type: string, count: number, rng: Rng): GunpathAttachment[] {
  const table = GUNPATH_ATTACHMENTS[skill];
  const out: GunpathAttachment[] = [];
  for (let tries = 0; out.length < count && tries < 200; tries++) {
    const row = pick(table.rows, rollDie(dieSides(table.die), rng));
    const got = row.subRoll ? pick(row.subRoll.rows, rollDie(dieSides(row.subRoll.die), rng)) : row;
    if (!attachmentEligible(got.name, type, skill) || out.some((a) => a.name === got.name)) continue;
    out.push({ name: got.name, cost: got.cost });
  }
  return out;
}

export function rollGunpath(rng: Rng = Math.random, opts: { attachments?: number } = {}): GunpathWeapon {
  const m = pick(GUNPATH_MANUFACTURERS, rollDie(100, rng));
  const t = rollType(rng);
  const quality = pick(GUNPATH_QUALITY.rows, rollDie(dieSides(GUNPATH_QUALITY.die), rng)).quality;
  const attachments = rollAttachments(t.skill, t.type, opts.attachments ?? 0, rng);
  const n = pick(GUNPATH_NAMES.rows, rollDie(100, rng));
  return {
    manufacturer: m.name,
    manufacturerNote: m.note,
    ...t,
    quality,
    attachments,
    namePattern: n.pattern,
    nameExample: n.example,
    ...totalCost(t.baseCost, quality, attachments),
  };
}

/** Ficha base del Core para cada tipo (Core pp.340-345), por id del pack. */
export const GUNPATH_BASE_WEAPON_ID: Record<string, string> = {
  'Medium Pistol': 'medium-pistol',
  'Heavy Pistol': 'heavy-pistol',
  'Very Heavy Pistol': 'very-heavy-pistol',
  SMG: 'smg',
  'Heavy SMG': 'heavy-smg',
  Shotgun: 'shotgun',
  'Assault Rifle': 'assault-rifle',
  'Sniper Rifle': 'sniper-rifle',
  Bow: 'bows-crossbows',
  Crossbow: 'bows-crossbows',
  'Grenade Launcher': 'grenade-launcher',
  'Rocket Launcher': 'rocket-launcher',
};

/** Ids del catálogo de attachments de la app; los que no están ahí quedan en las notas del arma. */
export const GUNPATH_ATTACHMENT_ID: Record<string, string> = {
  Bayonet: 'att-bayonet',
  'Extended Magazine': 'att-extended-mag',
  'Drum Magazine': 'att-drum-mag',
  'Grenade Launcher Underbarrel': 'att-underbarrel-gl',
  'Shotgun Underbarrel': 'att-underbarrel-sg',
  'Infrared Nightvision Scope': 'att-ir-nv-scope',
  'Sniping Scope': 'att-sniping-scope',
  'Smartgun Link': 'att-smartgun-link',
  Silencer: 'att-silencer',
};

/** Arma lista para equipar: la ficha del Core con el nombre, la calidad, el costo y los attachments de fábrica. */
export function gunpathToWeapon(g: GunpathWeapon, name: string, base: WeaponItem): WeaponItem {
  const known = g.attachments.filter((a) => GUNPATH_ATTACHMENT_ID[a.name]).map((a) => GUNPATH_ATTACHMENT_ID[a.name]);
  const other = g.attachments.filter((a) => !GUNPATH_ATTACHMENT_ID[a.name]).map((a) => a.name);
  const notes = [
    `Gunpath (Interface RED Vol. 5 pp.48-53): ${g.manufacturer} ${g.type}.`,
    other.length ? `Attachments de fábrica sin ficha en la app: ${other.join(', ')}.` : '',
    base.notes ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return {
    ...base,
    id: `gunpath-${Date.now().toString(36)}`,
    name: `${g.manufacturer} ${name}`.trim(),
    quality: g.quality,
    preinstalledAttachments: known.length ? known : undefined,
    cost: g.cost,
    costTier: g.costTier,
    notes,
  };
}
