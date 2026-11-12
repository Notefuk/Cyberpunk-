// [Claude Code · 2026-11-12] v5.23.0 (plan 28): un actor del GM ataca a un jugador.
// Ataque = base del arma (STAT + skill de la ficha) + 1d10, con el 10 que explota y el 1 que resta (Core p.130, CEMK p.5);
// apuntar a la cabeza resta 8 (Aimed Shot, Core p.170). Impacta si supera el DV (CEMK p.5).
// Daño: los d6 del arma; dos o más 6 = Herida Crítica y +5 directo a HP, que suma calculateIncomingImpact (Core p.187).
// Funciones puras; aplicar el daño a la ficha está en features/gm/gmDamage.ts.
import { rollCheckD10, beatsDv } from './combatEngine';

export const AIMED_HEAD_PENALTY = 8;

export interface ActorAttackInput {
  skillBase: number;
  /** "3d6", "2d6+2"… */
  damage: string;
  dv: number;
  aimedHead: boolean;
}

export interface ActorAttackResult {
  d10: number;
  attackTotal: number;
  hit: boolean;
  dice: number[];
  /** Suma de los dados (+ el fijo de la fórmula). Sin el +5 del crítico. */
  damage: number;
  critical: boolean;
}

/** "3d6+2" → 3 dados y +2. Sin dados reconocibles: 0 dados y el número que haya. */
export function parseDamageFormula(formula: string): { dice: number; bonus: number } {
  const m = /(\d+)\s*d6(?:\s*\+\s*(\d+))?/i.exec(formula || '');
  if (!m) return { dice: 0, bonus: parseInt((formula || '').replace(/\D/g, ''), 10) || 0 };
  return { dice: parseInt(m[1], 10), bonus: m[2] ? parseInt(m[2], 10) : 0 };
}

export function rollActorAttack(input: ActorAttackInput, rng: () => number = Math.random): ActorAttackResult {
  const d10 = rollCheckD10(rng).value;
  const attackTotal = input.skillBase + d10 - (input.aimedHead ? AIMED_HEAD_PENALTY : 0);
  const hit = beatsDv(attackTotal, input.dv);
  if (!hit) return { d10, attackTotal, hit, dice: [], damage: 0, critical: false };
  const f = parseDamageFormula(input.damage);
  const dice = Array.from({ length: f.dice }, () => Math.floor(rng() * 6) + 1);
  const damage = dice.reduce((a, b) => a + b, 0) + f.bonus;
  return { d10, attackTotal, hit, dice, damage, critical: dice.filter((d) => d === 6).length >= 2 };
}

// ============================================================================
// [Claude Code · 2026-11-12] v5.24.0: Autofire y Suppressive Fire de un actor (Core pp.173-174).
// ============================================================================

/** Core p.173: Autofire y Suppressive Fire gastan 10 balas; con menos de 10 en el cargador no se pueden usar. */
export const AUTOFIRE_BULLETS = 10;

export type AutofireClass = 'smg' | 'ar';

/** Core p.173, "Autofire DVs based on Range". Más de 100 m: no hay entrada. */
export const AUTOFIRE_BANDS = ['0 a 6 m', '7 a 12 m', '13 a 25 m', '26 a 50 m', '51 a 100 m'] as const;
export const AUTOFIRE_DV: Record<AutofireClass, readonly number[]> = {
  smg: [20, 17, 20, 25, 30],
  ar: [22, 20, 17, 20, 25],
};

interface WeaponLike {
  name: string;
  notes?: string;
}

/**
 * Tope del multiplicador de Autofire del arma: "Autofire xN" en las notas de la ficha; si no figura,
 * SMG 3 y Assault Rifle 4 (Core p.173). null: el arma no tiene Autofire.
 */
export function autofireMax(w: WeaponLike): number | null {
  const m = /autofire\s*x\s*(\d+)/i.exec(w.notes ?? '');
  if (m) return Number(m[1]);
  if (/\bSMG\b|submachine/i.test(w.name)) return 3;
  if (/assault rifle/i.test(w.name)) return 4;
  return null;
}

/** Qué fila de la tabla de Autofire usa: por el nombre, y si no lo dice, x3 es SMG y x4 o más es Assault Rifle. */
export function autofireClass(w: WeaponLike, max: number): AutofireClass {
  if (/\bSMG\b|submachine/i.test(w.name)) return 'smg';
  if (/assault rifle/i.test(w.name)) return 'ar';
  return max <= 3 ? 'smg' : 'ar';
}

/** REF + Autofire del actor: la base de la ficha ("Autofire" en skillBases) o "Autofire base N" en las notas del arma. */
export function enemyAutofireBase(skillBases: Record<string, number> | undefined, w: WeaponLike): number | null {
  if (typeof skillBases?.Autofire === 'number') return skillBases.Autofire;
  const m = /autofire\s+base\s+(\d+)/i.exec(w.notes ?? '');
  return m ? Number(m[1]) : null;
}

export interface AutofireResult {
  d10: number;
  total: number;
  hit: boolean;
  /** Cuánto superó el DV, con el tope del arma: el multiplicador del daño. */
  multiplier: number;
  dice: number[];
  /** 2d6 x multiplicador. */
  damage: number;
  /** Los dos dados en 6: Herida Crítica (Core p.173 y p.187). */
  critical: boolean;
}

/** Core p.173: REF + Autofire + 1d10 contra el DV; si impacta, 2d6 x lo que superó el DV (hasta el tope del arma). */
export function rollAutofire(input: { base: number; dv: number; maxMultiplier: number }, rng: () => number = Math.random): AutofireResult {
  const d10 = rollCheckD10(rng).value;
  const total = input.base + d10;
  const hit = beatsDv(total, input.dv);
  if (!hit) return { d10, total, hit, multiplier: 0, dice: [], damage: 0, critical: false };
  const multiplier = Math.max(1, Math.min(input.maxMultiplier, total - input.dv));
  const dice = [Math.floor(rng() * 6) + 1, Math.floor(rng() * 6) + 1];
  return { d10, total, hit, multiplier, dice, damage: (dice[0] + dice[1]) * multiplier, critical: dice[0] === 6 && dice[1] === 6 };
}

/** Core p.174: el que suprime tira REF + Autofire + 1d10. */
export function rollSuppression(base: number, rng: () => number = Math.random): { d10: number; total: number } {
  const d10 = rollCheckD10(rng).value;
  return { d10, total: base + d10 };
}

/**
 * Core p.174: cada uno tira WILL + Concentration + 1d10 contra la tirada del que suprime; el que falla usa su próximo
 * Move para cubrirse. Es una tirada enfrentada: el empate gana el defensor (CEMK p.5).
 */
export function resistsSuppression(defenderTotal: number, suppressorTotal: number): boolean {
  return defenderTotal >= suppressorTotal;
}
