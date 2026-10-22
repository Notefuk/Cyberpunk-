// Motor puro de Combat Awareness del Solo (plan 10, v4.9.2). Core p.146. [Claude Code · 2026-10-22]
// Los valores guardados en la asignación son el BONO (+N), no los puntos gastados.
import type { SoloCombatAwarenessAllocation } from '../types/cyberpunk';
import { rollCheckD10 } from './combatEngine';

type Alloc = SoloCombatAwarenessAllocation | undefined;

/** Core p.146: Damage Deflection reduce el primer daño que recibís en el Round; nunca baja de 0. */
export function applyDamageDeflection(incoming: number, alloc: Alloc, isFirstDamageThisRound: boolean): { damage: number; reduced: number } {
  const base = Math.max(0, incoming);
  if (!isFirstDamageThisRound) return { damage: base, reduced: 0 };
  const reduced = Math.min(base, Math.max(0, alloc?.damageDeflection ?? 0));
  return { damage: base - reduced, reduced };
}

/** Core p.146: Spot Weakness suma daño al primer ataque exitoso del Round. */
export function spotWeaknessBonus(alloc: Alloc, isFirstSuccessfulAttackThisRound: boolean): number {
  return isFirstSuccessfulAttackThisRound ? Math.max(0, alloc?.spotWeakness ?? 0) : 0;
}

/** Core p.146: Initiative Reaction. */
export function initiativeBonus(alloc: Alloc): number {
  return Math.max(0, alloc?.initiativeReaction ?? 0);
}

/** Core p.146: Threat Detection suma a Perception. */
export function threatDetectionBonus(alloc: Alloc): number {
  return Math.max(0, alloc?.threatDetection ?? 0);
}

/** Core p.146: Fumble Recovery ignora un 1 natural (fallo crítico). */
export function fumbleRecoveryIgnores(alloc: Alloc, naturalRoll: number): boolean {
  return !!alloc?.fumbleRecovery && naturalRoll === 1;
}

/**
 * Core p.126: Iniciativa = REF + 1d10 (+ Initiative Reaction, p.146).
 * Core pp. 126 y 168 dan "REF + 1d10" sin regla de explosión: la explosión (10/1) es de los Skill Checks (p.130), así que se tira un d10 simple.
 */
export function rollInitiative(ref: number, alloc: Alloc, rng: () => number = Math.random): { natural: number; total: number; breakdown: string } {
  const natural = Math.floor(rng() * 10) + 1;
  const bonus = initiativeBonus(alloc);
  const total = ref + natural + bonus;
  return { natural, total, breakdown: `REF ${ref} + d10 ${natural} + Initiative Reaction ${bonus} = ${total}` };
}

/** Core p.82 (Perception) y p.146 (Threat Detection): INT + Perception + 1d10 (10 explota, 1 resta, como un Skill Check) + Threat Detection. */
export function rollPerception(int: number, perceptionSkill: number, alloc: Alloc, rng: () => number = Math.random): { natural: number; total: number; breakdown: string } {
  const d = rollCheckD10(rng);
  const bonus = threatDetectionBonus(alloc);
  const total = int + perceptionSkill + d.value + bonus;
  const extra = d.extra ? (d.natural === 10 ? ` +${d.extra}` : ` -${d.extra}`) : '';
  return { natural: d.natural, total, breakdown: `INT ${int} + Perception ${perceptionSkill} + d10 ${d.natural}${extra} + Threat Detection ${bonus} = ${total}` };
}
