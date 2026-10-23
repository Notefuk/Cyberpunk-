import type {
  CharacterSheet,
  CombatSkillKey,
  SoloCombatAwarenessAllocation,
  EquippedWeapon,
  StatKey,
  WeaponItem
} from '../types/cyberpunk';
import { SKILL_METADATA } from '../types/cyberpunk';
import { calculateWeaponAttachmentBonuses } from '../data/weaponAttachmentsAndTechData';
import { cyberwareStatBonus } from './cyberwareEffects';

export function calculateMaxHp(body: number, will: number): number {
  return 10 + 5 * Math.ceil((body + will) / 2);
}

export function calculateSeriouslyWoundedThreshold(maxHp: number): number {
  return Math.ceil(maxHp / 2);
}

export function calculateMaxHumanity(emp: number): number {
  return emp * 10;
}

// Core p. 80: la EMP baja cada vez que baja la decena de la Humanidad (44 HUM = EMP 4, 39 HUM = EMP 3).
export function getEffectiveEmp(character: CharacterSheet): number {
  const baseEmp = character.stats?.EMP ?? 0;
  const humanity = character.currentHumanity ?? baseEmp * 10;
  return Math.max(0, Math.min(baseEmp, Math.floor(humanity / 10)));
}

// Core p. 186: Mortally Wounded con menos de 1 HP.
export function isMortallyWounded(currentHp: number): boolean {
  return currentHp < 1;
}

// Core pp. 187-188: varias Heridas Críticas suben en 1 el Death Save Penalty base.
export function getBaseDeathSavePenalty(character: CharacterSheet): number {
  return (character.activeInjuries ?? []).reduce(
    (sum, inj) => sum + (!inj.isTreated ? inj.modifiers?.bonusDeathSavePenalty ?? 0 : 0),
    0
  );
}

export interface DeathSaveResult {
  d10: number;
  basePenalty: number;
  accumulatedPenalty: number;
  total: number;
  deathSaveValue: number;
  autoFail: boolean;
  success: boolean;
}

// Core p. 188: tira 1d10 + Death Save Penalty; vives si el resultado es menor que tu BODY.
// Un 10 natural falla siempre. Cada tirada sube el penalizador acumulado en 1.
export function rollDeathSave(character: CharacterSheet): DeathSaveResult {
  const deathSaveValue = getEffectiveBody(character);
  const basePenalty = getBaseDeathSavePenalty(character);
  const accumulatedPenalty = character.deathSavePenalty ?? 0;
  const d10 = Math.floor(Math.random() * 10) + 1;
  const total = d10 + basePenalty + accumulatedPenalty;
  const autoFail = d10 === 10;
  return {
    d10,
    basePenalty,
    accumulatedPenalty,
    total,
    deathSaveValue,
    autoFail,
    success: !autoFail && total < deathSaveValue
  };
}

// Valor promedio de Humanity Loss en los formatos del pack: "2d6 (7)", "7 (2d6)", "3 (1d6)", "0 (N/A)".
export function parseHumanityLossAverage(humanityLoss: string): number {
  const text = humanityLoss.trim();
  const leading = text.match(/^(\d+)\b(?!\s*d)/i);
  if (leading) return parseInt(leading[1], 10);
  const inParens = text.match(/\((\d+)\)/);
  if (inParens) return parseInt(inParens[1], 10);
  const dice = text.match(/^(\d+)d6/i);
  if (dice) return Math.ceil(parseInt(dice[1], 10) * 3.5);
  return 7;
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
  soloPrecisionBonus?: number;
  attachmentBonus?: number;
  attachmentBreakdown?: string[];
  totalPenalty: number;
  penaltyBreakdown: string[];
  netBase: number;
}

export function getEffectiveBody(character: CharacterSheet): number {
  // [Claude Code · 2026-10-23] Core p.114: Grafted Muscle and Bone Lace suma al BODY base antes del FBC.
  const baseBody = cyberwareStatBonus(character.installedCyberwareIds ?? [], 'BODY', character.stats?.BODY ?? 0);
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
  // Going Metal p. 107-108: en FBC, REF/DEX/MOVE no bajan del mínimo del chasis.
  if ((statKey === 'REF' || statKey === 'DEX' || statKey === 'MOVE') && character.fbcState?.isFullBodyConversion) {
    statVal = Math.max(statVal, character.fbcState.statFloor ?? 0);
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
  // Core p. 186: cada Wound State reemplaza al anterior; Mortally Wounded (< 1 HP) es -4 a todas las Acciones.
  const effectiveBody = getEffectiveBody(character);
  const maxHp = calculateMaxHp(effectiveBody, character.stats?.WILL ?? 0);
  const woundThreshold = calculateSeriouslyWoundedThreshold(maxHp);
  const isMortallyWoundedNow = isMortallyWounded(character.currentHp ?? 0);
  const isSeriouslyWounded = (character.currentHp ?? 0) < woundThreshold;
  // Going Metal p. 94: un FBC ignora los penalizadores de Wound State.
  const isFbcChar = Boolean(character.fbcState?.isFullBodyConversion);
  const seriousWoundPenalty = isFbcChar ? 0 : isMortallyWoundedNow ? 4 : isSeriouslyWounded ? 2 : 0;
  if (isFbcChar) {
    // sin penalizador de Wound State
  } else if (isMortallyWoundedNow) {
    penaltyBreakdown.push('[Salud] Mortalmente Herido (<1 HP): -4');
  } else if (seriousWoundPenalty > 0) {
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

  const totalPenalty = armorPenalty + seriousWoundPenalty + injuryPenalty;
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
    soloPrecisionBonus,
    attachmentBonus,
    attachmentBreakdown,
    totalPenalty,
    penaltyBreakdown,
    netBase
  };
}

export function getEffectiveMove(character: CharacterSheet): number {
  const isFbc = Boolean(character.fbcState?.isFullBodyConversion);
  const baseMove = isFbc
    ? Math.max(character.stats?.MOVE ?? 0, character.fbcState?.statFloor ?? 0)
    : (character.stats?.MOVE ?? 0);
  let penalty = 0;
  const headPen = Math.abs(character.headArmor?.penalty ?? 0);
  const bodyPen = Math.abs(character.bodyArmor?.penalty ?? 0);
  penalty += Math.max(headPen, bodyPen);

  // Core p. 186: Mortally Wounded da -6 a MOVE (mínimo 1).
  if (!isFbc && isMortallyWounded(character.currentHp ?? 0)) {
    penalty += 6;
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

// Core p. 176: con un Cyberarm el daño de Brawling es al menos 2d6.
export function calculateUnarmedDamage(body: number, hasCyberarm: boolean = false): string {
  if (body <= 4) return hasCyberarm ? '2d6' : '1d6';
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


// Core p. 146: costo en puntos de Combat Awareness. Los valores guardados son el bono (+N), no los puntos.
export const SOLO_AWARENESS_MAX_BONUS: Partial<Record<keyof SoloCombatAwarenessAllocation, number>> = {
  precisionAttack: 3,
  damageDeflection: 5
};

export function soloAwarenessPointCost(alloc: SoloCombatAwarenessAllocation): number {
  return (
    (alloc.fumbleRecovery ? 4 : 0) +
    (alloc.damageDeflection || 0) * 2 +
    (alloc.initiativeReaction || 0) +
    (alloc.precisionAttack || 0) * 3 +
    (alloc.spotWeakness || 0) +
    (alloc.threatDetection || 0)
  );
}

// Devuelve true si el reparto entra en el rango de Combat Awareness y respeta los topes del Core p. 146.
export function isValidSoloAllocation(alloc: SoloCombatAwarenessAllocation, roleRank: number): boolean {
  for (const [key, max] of Object.entries(SOLO_AWARENESS_MAX_BONUS)) {
    if (((alloc[key as keyof SoloCombatAwarenessAllocation] as number) || 0) > (max ?? 0)) return false;
  }
  return soloAwarenessPointCost(alloc) <= roleRank;
}

// Core p. 223: tras estabilizar se cura BODY por día de descanso. Enhanced Antibodies: BODY x 2 (Core p. 114).
// Cryotank: dobla la tasa normal mientras el paciente esté dentro (Core p. 353).
export function naturalHealingPerDay(body: number, hasEnhancedAntibodies = false, inCryotank = false): number {
  return Math.max(1, body) * (hasEnhancedAntibodies ? 2 : 1) * (inCryotank ? 2 : 1);
}

// Core p. 150: Speedheal cura BODY + WILL; no sirve en Mortally Wounded y solo 1 vez por día.
export function speedhealAmount(body: number, will: number, currentHp: number, isFbc = false): number {
  if (isFbc) return 0;
  return isMortallyWounded(currentHp) ? 0 : body + will;
}

// Core p. 230: cada ciberware instalado baja 2 la Humanidad máxima que se puede recuperar con terapia;
// el borgware baja 4 y el ciberware de 0 Humanity Loss no la baja.
export function calculateTherapyMaxHumanity(
  emp: number,
  installed: { humanityLoss?: string | number; type?: string }[]
): number {
  let cap = emp * 10;
  for (const cw of installed) {
    const hl = cw.humanityLoss === undefined ? 7 : parseHumanityLossAverage(String(cw.humanityLoss));
    if (hl === 0) continue;
    const cwType = (cw.type || '').toLowerCase();
    cap -= cwType === 'borgware x2' ? 8 : cwType === 'borgware' ? 4 : 2;
  }
  return Math.max(0, cap);
}
