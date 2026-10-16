import type {
  CharacterSheet,
  CombatSkillKey,
  StatKey,
  WeaponItem
} from '../types/cyberpunk';
import { SKILL_METADATA } from '../types/cyberpunk';

export function calculateMaxHp(body: number, will: number): number {
  return 10 + 5 * Math.ceil((body + will) / 2);
}

export function calculateSeriouslyWoundedThreshold(maxHp: number): number {
  return Math.ceil(maxHp / 2);
}

export function calculateMaxHumanity(emp: number): number {
  return emp * 10;
}

export function mapWeaponSkillToKey(weaponSkillLabel: string, isAutofire?: boolean): CombatSkillKey {
  if (isAutofire) {
    return 'autofire';
  }

  const normalized = (weaponSkillLabel || '').toLowerCase().replace(/[^a-z]/g, '');
  switch (normalized) {
    case 'handgun':
      return 'handgun';
    case 'shoulderarms':
      return 'shoulderArms';
    case 'autofire':
      return 'autofire';
    case 'heavyweapons':
      return 'heavyWeapons';
    case 'archery':
      return 'archery';
    case 'meleeweapon':
    case 'melee':
      return 'meleeWeapon';
    case 'brawling':
      return 'brawling';
    case 'martialarts':
      return 'martialArts';
    default:
      return 'handgun';
  }
}

export interface WeaponAttackBreakdown {
  statKey: StatKey;
  statVal: number;
  skillKey: CombatSkillKey;
  skillLabel: string;
  skillVal: number;
  armorPenalty: number;
  seriousWoundPenalty: number;
  injuryPenalty: number;
  totalPenalty: number;
  penaltyBreakdown: string[];
  netBase: number;
}

export function calculateWeaponAttackBreakdown(
  character: CharacterSheet,
  weapon: WeaponItem,
  isAutofire?: boolean
): WeaponAttackBreakdown {
  const skillKey = mapWeaponSkillToKey(weapon.skill, isAutofire);
  const skillMeta = SKILL_METADATA[skillKey];
  const statKey: StatKey = skillMeta.stat;
  const skillLabel = skillMeta.label;

  const statVal = character.stats?.[statKey] ?? 0;
  const skillVal = character.skills?.[skillKey] ?? 0;

  const penaltyBreakdown: string[] = [];

  // 1. Penalizador de Armadura (Afecta a REF y DEX; se toma el mayor entre cabeza y cuerpo)
  const headPen = Math.abs(character.headArmor?.penalty ?? 0);
  const bodyPen = Math.abs(character.bodyArmor?.penalty ?? 0);
  const armorPenalty = (statKey === 'REF' || statKey === 'DEX') ? Math.max(headPen, bodyPen) : 0;
  if (armorPenalty > 0) {
    penaltyBreakdown.push(`[Armadura] Penalizador de blindaje: -${armorPenalty}`);
  }

  // 2. Penalizador por Gravemente Herido (HP actual < 50% de Max HP: -2 a todas las acciones)
  const maxHp = calculateMaxHp(character.stats?.BODY ?? 0, character.stats?.WILL ?? 0);
  const woundThreshold = calculateSeriouslyWoundedThreshold(maxHp);
  const isSeriouslyWounded = (character.currentHp ?? 0) < woundThreshold;
  const seriousWoundPenalty = isSeriouslyWounded ? 2 : 0;
  if (seriousWoundPenalty > 0) {
    penaltyBreakdown.push(`[Salud] Gravemente Herido (<${woundThreshold} HP): -2`);
  }

  // 3. Heridas Críticas Activas
  // Si isTreated === true, sus penalizadores de acción/ataque quedan anulados
  let injuryPenalty = 0;
  if (character.activeInjuries && character.activeInjuries.length > 0) {
    for (const injury of character.activeInjuries) {
      if (injury.isTreated) continue;
      const mods = injury.modifiers;
      if (!mods) continue;

      let subtotal = 0;
      if (mods.allActionsPenalty) {
        subtotal += mods.allActionsPenalty;
      }
      if (mods.statPenalties && mods.statPenalties[statKey]) {
        subtotal += mods.statPenalties[statKey]!;
      }
      if (skillMeta.category === 'ranged' && mods.rangedAttackPenalty) {
        subtotal += mods.rangedAttackPenalty;
      }
      if (skillMeta.category === 'melee' && mods.meleeAttackPenalty) {
        subtotal += mods.meleeAttackPenalty;
      }

      if (subtotal > 0) {
        injuryPenalty += subtotal;
        penaltyBreakdown.push(`[Herida] ${injury.name}: -${subtotal}`);
      }
    }
  }

  const totalPenalty = armorPenalty + seriousWoundPenalty + injuryPenalty;
  const netBase = statVal + skillVal - totalPenalty;

  return {
    statKey,
    statVal,
    skillKey,
    skillLabel,
    skillVal,
    armorPenalty,
    seriousWoundPenalty,
    injuryPenalty,
    totalPenalty,
    penaltyBreakdown,
    netBase
  };
}

export interface AutofireRulesSummary {
  supportsAutofire: boolean;
  maxMultiplier: number;
  ammoCost: 10;
  skillUsed: 'Autofire (REF x2)';
  damageRule: string;
  howItWorks: string;
}

export function getAutofireRulesSummary(weapon: WeaponItem): AutofireRulesSummary {
  let maxMultiplier = 0;

  if (typeof weapon.autofireMaxMult === 'number' && weapon.autofireMaxMult > 0) {
    maxMultiplier = weapon.autofireMaxMult;
  } else if (weapon.altFireModes) {
    const match = weapon.altFireModes.match(/Autofire(?:\s*\(([0-9]+)\))?/i);
    if (match) {
      maxMultiplier = match[1] ? parseInt(match[1], 10) : 3;
    }
  } else if ((weapon.skill || '').toLowerCase() === 'autofire') {
    maxMultiplier = 3;
  }

  const supportsAutofire = maxMultiplier > 0;

  return {
    supportsAutofire,
    maxMultiplier,
    ammoCost: 10,
    skillUsed: 'Autofire (REF x2)',
    damageRule: supportsAutofire
      ? `Tira 2d6 y multiplica el resultado por el margen de éxito sobre el DV (máximo x${maxMultiplier}). El total impacta contra la armadura.`
      : 'Esta arma no soporta Fuego Automático.',
    howItWorks: supportsAutofire
      ? `Consume 10 balas del cargador. Se resuelve con REF + Autofire (x2) + 1d10 contra la tabla de DV correspondiente.`
      : 'Esta arma opera exclusivamente en modo estándar o tiro único.'
  };
}
