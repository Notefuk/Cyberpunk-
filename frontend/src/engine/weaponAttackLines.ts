// v5.6.0 [Claude Code · 2026-10-29]: con qué tirada pega cada arma de la ficha, en tiro simple y en ráfaga (plan 21).
// Core p.172 (distancia), p.176 (cuerpo a cuerpo), pp.173-174 (Autofire y Suppressive Fire).
import type { CharacterSheet, WeaponItem } from '../types/cyberpunk';
import { calculateWeaponAttackBreakdown, getAutofireRulesSummary } from './characterEngine';

export interface WeaponAttackLines {
  /** "Tiro simple: REF 7 + Handgun 6 = 13 + 1d10" (o "Golpe" en cuerpo a cuerpo). */
  single: string;
  /** Penalizaciones que se restan (armadura, heridas…), si las hay. */
  penalties: string[];
  /** Línea de ráfaga, solo si el arma tiene modo Autofire. */
  burst?: string;
  /** Aviso si la skill Autofire está en 0. */
  burstWarning?: string;
  /** Suppressive Fire, solo si el arma tiene modo Autofire. */
  suppressive?: string;
  /** Skill que usa el tiro simple ('handgun', 'meleeWeapon'...). */
  skillKey: string;
}

export function weaponAttackLines(sheet: CharacterSheet, weapon: WeaponItem): WeaponAttackLines {
  const b = calculateWeaponAttackBreakdown(sheet, weapon);
  const melee = b.statKey === 'DEX';
  const minus = b.totalPenalty > 0 ? ` − ${b.totalPenalty}` : '';
  const extra = (b.soloPrecisionBonus ?? 0) + (b.attachmentBonus ?? 0);
  const plus = extra > 0 ? ` + ${extra}` : '';
  const out: WeaponAttackLines = {
    single: `${melee ? 'Golpe' : 'Tiro simple'}: ${b.statKey} ${b.statVal} + ${b.skillLabel} ${b.skillVal}${plus}${minus} = ${b.netBase} + 1d10`,
    penalties: b.penaltyBreakdown,
    skillKey: b.skillKey
  };
  const af = getAutofireRulesSummary(weapon);
  if (af.supportsAutofire) {
    const a = calculateWeaponAttackBreakdown(sheet, weapon, true);
    const aMinus = a.totalPenalty > 0 ? ` − ${a.totalPenalty}` : '';
    const aExtra = (a.soloPrecisionBonus ?? 0) + (a.attachmentBonus ?? 0);
    out.burst = `Ráfaga: REF ${a.statVal} + Autofire ${a.skillVal}${aExtra > 0 ? ` + ${aExtra}` : ''}${aMinus} = ${a.netBase} + 1d10 · tabla de Autofire · 10 balas · daño 2d6 × lo que pasás el DV, máx ×${af.maxMultiplier} (Core p.173)`;
    if (a.skillVal === 0) out.burstWarning = 'Autofire en 0: tu ráfaga pega solo con REF. Subí la skill Autofire para pegar mejor en ráfaga (Core p.173).';
    out.suppressive = `Suppressive Fire: REF + Autofire ${a.netBase} + 1d10 contra WILL + Concentration + 1d10 de cada uno a pie, a 25 m o menos y fuera de cobertura; el que pierde usa su próximo Move para cubrirse (Core p.174).`;
  }
  return out;
}
