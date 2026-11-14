// [Claude Code · 2026-11-14] v5.43.0 (plan 33): Cyberware Enhancements (CEMK DLC 02, pp.1-3).
// Mejoras de catálogo para Gorilla Arms, Mantis Blades y Monowire de 2077. Las instala un Tech en 1 hora,
// sin tirada; va una sola por pieza y no se pasa a otro tipo de ciberware (p.1-2).
import type { CharacterSheet, RollEntry, WeaponItem } from '../types/cyberpunk';

export const CEMK_ENH_SOURCE = 'CEMK DLC 02: Cyberware Enhancements';

export type EnhancementEffectKind =
  | 'cover_3d6'          // Hydraulic Ram
  | 'crit_bonus_plus5'   // Pneumatic Actuation
  | 'tungsten_modes'     // Tungsten Reinforcement
  | 'crit_roll_twice'    // Double-Edged
  | 'ignore_sp_below_7'  // Monomolecular Edge
  | 'speedware_luck_plus1' // Streamlined
  | 'crit_roll_thrice'   // Barbed Line
  | 'stun_at_1hp'        // Electroshock
  | 'ablation_plus1';    // Thermal-Bladed

export type EnhanceableCyberwareId = 'cw-cemk-gorilla-arms' | 'cw-cemk-mantis-blades' | 'cw-cemk-monowire';

export interface CyberwareEnhancement {
  id: string;
  name: string;
  cyberwareId: EnhanceableCyberwareId;
  cost: number;
  costTier: 'Expensive' | 'Very Expensive';
  kind: EnhancementEffectKind;
  /** Efecto en español, como lo dice el DLC. */
  effect: string;
  page: number;
}

export const ENHANCEABLE_CYBERWARE: { id: EnhanceableCyberwareId; name: string; weaponIds: string[] }[] = [
  { id: 'cw-cemk-gorilla-arms', name: 'Gorilla Arms', weaponIds: ['gorilla-arms-2077'] },
  { id: 'cw-cemk-mantis-blades', name: 'Mantis Blades', weaponIds: ['mantis-blades-2077'] },
  { id: 'cw-cemk-monowire', name: 'Monowire', weaponIds: ['monowire-2077'] }
];

export const CYBERWARE_ENHANCEMENTS: CyberwareEnhancement[] = [
  { id: 'hydraulic-ram', name: 'Hydraulic Ram', cyberwareId: 'cw-cemk-gorilla-arms', cost: 1000, costTier: 'Very Expensive', kind: 'cover_3d6', page: 2,
    effect: 'Contra cobertura (y solo contra cobertura) suma 3d6 a la tirada de daño base.' },
  { id: 'pneumatic-actuation', name: 'Pneumatic Actuation', cyberwareId: 'cw-cemk-gorilla-arms', cost: 1000, costTier: 'Very Expensive', kind: 'crit_bonus_plus5', page: 2,
    effect: 'Cuando causa una Herida Crítica, el daño extra de esa Herida Crítica sube 5 (+10 en vez de +5).' },
  { id: 'tungsten-reinforcement', name: 'Tungsten Reinforcement', cyberwareId: 'cw-cemk-gorilla-arms', cost: 500, costTier: 'Expensive', kind: 'tungsten_modes', page: 2,
    effect: 'Arma combinada de Excellent Quality con dos modos: Heavy Melee (ROF 2, 3d6) o Very Heavy Melee (ROF 1, 4d6). Se elige al atacar y cambiar no cuesta Acción.' },
  { id: 'double-edged', name: 'Double-Edged', cyberwareId: 'cw-cemk-mantis-blades', cost: 1000, costTier: 'Very Expensive', kind: 'crit_roll_twice', page: 3,
    effect: 'Cuando causa una Herida Crítica, se tira dos veces en la tabla y el atacante elige cuál sufre la víctima.' },
  { id: 'monomolecular-edge', name: 'Monomolecular Edge', cyberwareId: 'cw-cemk-mantis-blades', cost: 1000, costTier: 'Very Expensive', kind: 'ignore_sp_below_7', page: 3,
    effect: 'Su daño ignora por completo la armadura de SP menor a 7 (antes de dividir a la mitad). Con SP 7 o más, la armadura funciona normal.' },
  { id: 'streamlined', name: 'Streamlined', cyberwareId: 'cw-cemk-mantis-blades', cost: 1000, costTier: 'Very Expensive', kind: 'speedware_luck_plus1', page: 3,
    effect: 'Con Speedware activo, si gastás al menos 1 de Luck en un ataque con esta arma, sumás +1 a la tirada, además de lo que da la Luck.' },
  { id: 'barbed-line', name: 'Barbed Line', cyberwareId: 'cw-cemk-monowire', cost: 1000, costTier: 'Very Expensive', kind: 'crit_roll_thrice', page: 3,
    effect: 'Cuando causa una Herida Crítica, se tira tres veces en la tabla (en vez de dos) y el atacante elige cuál sufre la víctima.' },
  { id: 'electroshock', name: 'Electroshock', cyberwareId: 'cw-cemk-monowire', cost: 500, costTier: 'Expensive', kind: 'stun_at_1hp', page: 3,
    effect: 'Si el daño dejaría al objetivo por debajo de 1 HP, el atacante puede dejarlo Unconscious a 1 HP.' },
  { id: 'thermal-bladed', name: 'Thermal-Bladed', cyberwareId: 'cw-cemk-monowire', cost: 1000, costTier: 'Very Expensive', kind: 'ablation_plus1', page: 3,
    effect: 'Cuando ablaciona armadura, le saca 1 punto más de SP.' }
];

export const TUNGSTEN_MODES = {
  heavy: { label: 'Heavy Melee', damage: '3d6', rof: 2 },
  veryHeavy: { label: 'Very Heavy Melee', damage: '4d6', rof: 1 }
} as const;
export type TungstenMode = keyof typeof TUNGSTEN_MODES;

export function enhancementById(id: string | undefined): CyberwareEnhancement | undefined {
  return CYBERWARE_ENHANCEMENTS.find((e) => e.id === id);
}

export function enhancementsFor(cyberwareId: string): CyberwareEnhancement[] {
  return CYBERWARE_ENHANCEMENTS.filter((e) => e.cyberwareId === cyberwareId);
}

/** El ciberware del que sale esta arma (por id del pack), o undefined si no es una de las tres. */
export function cyberwareIdForWeapon(weapon: Pick<WeaponItem, 'id'>): EnhanceableCyberwareId | undefined {
  return ENHANCEABLE_CYBERWARE.find((c) => c.weaponIds.includes(weapon.id))?.id;
}

/** La mejora instalada en el ciberware de esta arma, solo para un PJ de 2077 que tenga ese ciberware. */
export function enhancementForWeapon(
  char: Pick<CharacterSheet, 'era' | 'installedCyberwareIds' | 'cyberwareEnhancements'>,
  weapon: Pick<WeaponItem, 'id'>
): CyberwareEnhancement | undefined {
  const cw = cyberwareIdForWeapon(weapon);
  if (!cw || char.era !== '2077' || !(char.installedCyberwareIds ?? []).includes(cw)) return undefined;
  return enhancementById(char.cyberwareEnhancements?.[cw]);
}

/** Se puede instalar si el PJ es de 2077, tiene ese ciberware en el cuerpo y la mejora es de ese tipo (pp.1-2). */
export function canInstallEnhancement(
  char: Pick<CharacterSheet, 'era' | 'installedCyberwareIds'>,
  enh: CyberwareEnhancement
): { ok: boolean; reason?: string } {
  if (char.era !== '2077') return { ok: false, reason: 'Solo para PJ de 2077.' };
  if (!(char.installedCyberwareIds ?? []).includes(enh.cyberwareId)) return { ok: false, reason: 'Primero hay que tener ese ciberware instalado en el cuerpo.' };
  return { ok: true };
}

/**
 * Cuántas veces se tira en la tabla de Críticas. El Monowire ya tira 2 (CEMK p.35); Barbed Line lo sube a 3
 * y Double-Edged le da 2 a la Mantis Blade (DLC p.3).
 */
export function critRollsFor(weapon: Pick<WeaponItem, 'id'>, enh: CyberwareEnhancement | undefined): 1 | 2 | 3 {
  if (enh?.kind === 'crit_roll_thrice') return 3;
  if (enh?.kind === 'crit_roll_twice') return 2;
  return cyberwareIdForWeapon(weapon) === 'cw-cemk-monowire' ? 2 : 1;
}

/**
 * Aplica la mejora a una tirada de daño ya hecha: +5 al crítico con Pneumatic Actuation, cuántas tiradas de
 * Crítica se eligen y los recordatorios de lo que se resuelve contra el objetivo. `coverRoll` son los 3d6 de
 * Hydraulic Ram (solo cuentan contra cobertura).
 */
export function applyEnhancementToDamage(
  entry: RollEntry,
  weapon: Pick<WeaponItem, 'id'>,
  enh: CyberwareEnhancement | undefined,
  coverRoll?: number[]
): RollEntry {
  const out: RollEntry = { ...entry };
  const rolls = critRollsFor(weapon, enh);
  if (rolls !== 1) out.critRolls = rolls;
  if (!enh) return out;
  out.enhancementName = enh.name;
  const notes: string[] = [];
  if (enh.kind === 'crit_bonus_plus5' && out.isCriticalInjuryTrigger) {
    out.critBonusDamage = (out.critBonusDamage ?? 0) + 5;
    out.finalDamageTotal = (out.finalDamageTotal ?? 0) + 5;
    notes.push('Pneumatic Actuation: la Herida Crítica hace +5 más (+10 en total).');
  }
  if (enh.kind === 'cover_3d6') {
    const sum = (coverRoll ?? []).reduce((a, b) => a + b, 0);
    notes.push(`Hydraulic Ram: si le pegás a una cobertura, suma 3d6${coverRoll?.length ? ` (salió ${sum}: ${(out.finalDamageTotal ?? 0) + sum} contra la cobertura)` : ''}.`);
  }
  if (enh.kind === 'ignore_sp_below_7') notes.push('Monomolecular Edge: si la armadura del objetivo tiene SP menor a 7 (antes de dividir), la ignora entera.');
  if (enh.kind === 'ablation_plus1') notes.push('Thermal-Bladed: si ablaciona, saca 1 SP más.');
  if (enh.kind === 'stun_at_1hp') notes.push('Electroshock: si lo baja de 1 HP, podés dejarlo Unconscious a 1 HP.');
  if (notes.length) out.enhancementNotes = notes;
  return out;
}

/** Recordatorio en la línea de ataque (lo que la app no puede saber sola). */
export function enhancementAttackNote(enh: CyberwareEnhancement | undefined): string | undefined {
  if (!enh) return undefined;
  if (enh.kind === 'speedware_luck_plus1') return 'Streamlined: +1 si tenés Speedware activo y gastás Luck en este ataque (DLC p.3).';
  if (enh.kind === 'cover_3d6') return 'Hydraulic Ram: +3d6 de daño solo contra cobertura (DLC p.2).';
  return `${enh.name}: ${enh.effect} (${CEMK_ENH_SOURCE} p.${enh.page})`;
}

/** Arma con el modo de Tungsten Reinforcement aplicado (DLC p.2). Sin esa mejora, la devuelve igual. */
export function weaponWithTungstenMode<T extends Pick<WeaponItem, 'damage' | 'rof'>>(weapon: T, enh: CyberwareEnhancement | undefined, mode: TungstenMode): T {
  if (enh?.kind !== 'tungsten_modes') return weapon;
  const m = TUNGSTEN_MODES[mode];
  return { ...weapon, damage: m.damage, rof: m.rof };
}
