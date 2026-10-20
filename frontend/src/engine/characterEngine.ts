import type {
  CharacterSheet,
  CombatSkillKey,
  EncumbranceMode,
  EquippedWeapon,
  StatKey,
  WeaponItem
} from '../types/cyberpunk';
import { SKILL_METADATA } from '../types/cyberpunk';
import { calculateWeaponAttachmentBonuses } from '../data/weaponAttachmentsAndTechData';

export const ENCUMBRANCE_MODES: Record<
  EncumbranceMode,
  { label: string; attackPenalty: number; movePenalty: number; description: string }
> = {
  none: {
    label: 'Normal (Sin sobrepeso)',
    attackPenalty: 0,
    movePenalty: 0,
    description: 'Movimiento y combate sin penalización por carga.'
  },
  heavy_box: {
    label: 'Carga Pesada / Caja (-2)',
    attackPenalty: 2,
    movePenalty: 2,
    description: 'Cargando equipo voluminoso o caja pesada: -2 a REF/DEX (Ataques) y -2 MOVE.'
  },
  carrying_body: {
    label: 'Cargando Cuerpo / Aliado (-2 Atk, -4 MOVE)',
    attackPenalty: 2,
    movePenalty: 4,
    description: 'Arrastrando o cargando un cuerpo: -2 a ataques (solo armas 1H) y -4 MOVE.'
  },
  extreme_load: {
    label: 'Sobrecarga Extrema (-4)',
    attackPenalty: 4,
    movePenalty: 4,
    description: 'Exceso severo de peso situacional: -4 a ataques y -4 MOVE.'
  }
};

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
  encumbrancePenalty?: number;
  soloPrecisionBonus?: number;
  attachmentBonus?: number;
  attachmentBreakdown?: string[];
  totalPenalty: number;
  penaltyBreakdown: string[];
  netBase: number;
}

export function getEffectiveBody(character: CharacterSheet): number {
  const baseBody = character.stats?.BODY ?? 0;
  if (character.fbcState?.isFullBodyConversion && (character.fbcState.bodyOverride ?? 0) > 0) {
    return Math.max(baseBody, character.fbcState.bodyOverride);
  }
  return baseBody;
}

export function calculateWeaponAttackBreakdown(
  character: CharacterSheet,
  weapon: WeaponItem,
  isAutofire?: boolean,
  distanceMeters?: number
): WeaponAttackBreakdown {
  const skillKey = mapWeaponSkillToKey(weapon.skill, isAutofire);
  const skillMeta = SKILL_METADATA[skillKey];
  const statKey: StatKey = skillMeta.stat;
  const skillLabel = skillMeta.label;

  let statVal = character.stats?.[statKey] ?? 0;
  if (statKey === 'BODY' && character.fbcState?.isFullBodyConversion && (character.fbcState.bodyOverride ?? 0) > 0) {
    statVal = Math.max(statVal, character.fbcState.bodyOverride);
  }
  if (statKey === 'MOVE' && character.fbcState?.isFullBodyConversion && (character.fbcState.moveOverride ?? 0) > 0) {
    statVal = character.fbcState.moveOverride;
  }
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
  const effectiveBody = getEffectiveBody(character);
  const maxHp = calculateMaxHp(effectiveBody, character.stats?.WILL ?? 0);
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

  // 4. Penalizador de Carga / Sobrepeso Situacional
  const encMode = character.encumbranceMode || 'none';
  const encConfig = ENCUMBRANCE_MODES[encMode] || ENCUMBRANCE_MODES.none;
  const encumbrancePenalty = encConfig.attackPenalty;
  if (encumbrancePenalty > 0) {
    penaltyBreakdown.push(`[Carga] ${encConfig.label}: -${encumbrancePenalty}`);
  }

  // 5. Bonificador de Solo: Combat Awareness (Precision Attack)
  const soloPrecisionBonus = character.soloAllocation?.precisionAttack ?? 0;
  if (soloPrecisionBonus > 0) {
    penaltyBreakdown.push(`[Combat Awareness] Precision Attack: +${soloPrecisionBonus}`);
  }

  // 6. Bonificador de Accesorios y Tech Upgrade
  const equippedWep = weapon as EquippedWeapon;
  const attachmentData = calculateWeaponAttachmentBonuses(equippedWep, distanceMeters);
  const attachmentBonus = attachmentData.attackBonus;
  const attachmentBreakdown = attachmentData.bonusBreakdown;
  for (const bonusText of attachmentBreakdown) {
    penaltyBreakdown.push(`[Accesorio/Mejora] ${bonusText}`);
  }

  const totalPenalty = armorPenalty + seriousWoundPenalty + injuryPenalty + encumbrancePenalty;
  const netBase = statVal + skillVal - totalPenalty + soloPrecisionBonus + attachmentBonus;

  return {
    statKey,
    statVal,
    skillKey,
    skillLabel,
    skillVal,
    armorPenalty,
    seriousWoundPenalty,
    injuryPenalty,
    encumbrancePenalty,
    soloPrecisionBonus,
    attachmentBonus,
    attachmentBreakdown,
    totalPenalty,
    penaltyBreakdown,
    netBase
  };
}

export function getEffectiveMove(character: CharacterSheet): number {
  let baseMove = character.stats?.MOVE ?? 0;
  if (character.fbcState?.isFullBodyConversion && (character.fbcState.moveOverride ?? 0) > 0) {
    baseMove = character.fbcState.moveOverride;
  }
  let penalty = 0;
  const headPen = Math.abs(character.headArmor?.penalty ?? 0);
  const bodyPen = Math.abs(character.bodyArmor?.penalty ?? 0);
  penalty += Math.max(headPen, bodyPen);

  const encMode = character.encumbranceMode || 'none';
  const encConfig = ENCUMBRANCE_MODES[encMode];
  if (encConfig) {
    penalty += encConfig.movePenalty;
  }

  character.activeInjuries?.forEach((inj) => {
    if (!inj.isTreated && inj.modifiers?.statPenalties?.MOVE) {
      penalty += inj.modifiers.statPenalties.MOVE;
    }
    if (!inj.isTreated && inj.modifiers?.movePenalty) {
      penalty += inj.modifiers.movePenalty;
    }
  });

  return Math.max(1, baseMove - penalty);
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

export function calculateUnarmedDamage(body: number): string {
  if (body <= 4) return '1d6';
  if (body <= 6) return '2d6';
  if (body <= 10) return '3d6';
  return '4d6';
}

export interface AmmoTypeMeta {
  id: string;
  label: string;
  shortRule: string;
  spAblation?: number;
  isNonLethal?: boolean;
}

export const AMMO_TYPE_CATALOG: AmmoTypeMeta[] = [
  {
    id: 'Basic',
    label: 'Basic',
    shortRule: 'Ablación estándar 1 SP',
    spAblation: 1
  },
  {
    id: 'Armor-Piercing',
    label: 'Armor-Piercing',
    shortRule: 'Abla 2 puntos de SP al penetrar blindaje',
    spAblation: 2
  },
  {
    id: 'Incendiary',
    label: 'Incendiary',
    shortRule: 'Prende fuego al objetivo: 2 HP directos/turno hasta apagarse'
  },
  {
    id: 'Expansive',
    label: 'Expansive',
    shortRule: 'Si causa Herida Crítica de Cuerpo Extraño, tira una segunda herida'
  },
  {
    id: 'Rubber',
    label: 'Rubber',
    shortRule: 'No letal [1 HP mín]; no causa Heridas Críticas ni abla armadura',
    spAblation: 0,
    isNonLethal: true
  },
  {
    id: 'Smart',
    label: 'Smart',
    shortRule: 'Requiere Targeting Scope. Si fallas un tiro simple por 4 o menos, segunda tirada con 10 + 1d10 (+LUCK) contra el mismo DV (Core p. 346)'
  },
  {
    id: 'Biotoxin',
    label: 'Biotoxin',
    shortRule: 'Ignora SP; DV 15 Resist Torture/Drugs o recibe 3d6 directos a HP'
  },
  {
    id: 'Poison',
    label: 'Poison',
    shortRule: 'Ignora SP; DV 13 Resist Torture/Drugs o recibe 2d6 directos a HP'
  },
  {
    id: 'EMP',
    label: 'EMP',
    shortRule: 'DV 15 Cybertech o desactiva 2 piezas de Cyberware por 1 minuto'
  },
  {
    id: 'Sleep',
    label: 'Sleep',
    shortRule: 'Ignora SP; DV 13 Resist Torture/Drugs o cae inconsciente 1 min',
    isNonLethal: true
  }
];
