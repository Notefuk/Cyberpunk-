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
