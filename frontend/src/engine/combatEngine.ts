import type {
  CharacterSheet,
  RollEntry,
  WeaponItem,
  AimedShotTarget
} from '../types/cyberpunk';
import {
  calculateWeaponAttackBreakdown,
  getAutofireRulesSummary
} from './characterEngine';

export interface AimedShotOption {
  id: AimedShotTarget;
  label: string;
  shortBadge: string;
  penalty: number;
  forceRof1: boolean;
  benefitTitle: string;
  benefitDescription: string;
  onHitMechanicalRule: string;
}

export const AIMED_SHOT_OPTIONS: Record<AimedShotTarget, AimedShotOption> = {
  none: {
    id: 'none',
    label: 'Tiro Normal (Centro de Masa)',
    shortBadge: 'Centro de Masa',
    penalty: 0,
    forceRof1: false,
    benefitTitle: 'Disparo Estándar',
    benefitDescription: 'Ataque dirigido al torso o centro de masa general sin modificador de puntería. Aplica daño al SP de Cuerpo y cadencia de fuego (ROF) normal.',
    onHitMechanicalRule: 'Abla el SP de Cuerpo en 1 punto si el daño penetra.'
  },
  head: {
    id: 'head',
    label: '🎯 Apuntar a la Cabeza (Headshot)',
    shortBadge: 'Headshot',
    penalty: 8,
    forceRof1: true,
    benefitTitle: 'Daño Penetrante ×2 al HP',
    benefitDescription: 'Todo el daño que atraviese la Armadura de Cabeza (SP) se multiplica ×2 directamente a los Puntos de Vida (HP), además de ablandar 1 punto de SP.',
    onHitMechanicalRule: 'Impacta contra el SP de Cabeza. Daño penetrante × 2 directo a HP + abla 1 SP.'
  },
  leg: {
    id: 'leg',
    label: '🦵 Apuntar a la Pierna (Leg Shot)',
    shortBadge: 'Tiro a la Pierna',
    penalty: 8,
    forceRof1: true,
    benefitTitle: 'Pierna Rota Automática (-4 MOVE)',
    benefitDescription: 'Si al menos 1 punto de daño atraviesa el SP del cuerpo, el objetivo sufre automáticamente la Herida Crítica Pierna Rota (-4 MOVE, mín. 1) además del daño.',
    onHitMechanicalRule: 'Si penetra el SP de Cuerpo, aplica Herida Crítica Pierna Rota (-4 MOVE) sin requerir doble 6.'
  },
  held_item: {
    id: 'held_item',
    label: '✋ Apuntar a Objeto en Mano (Disarm)',
    shortBadge: 'Desarme',
    penalty: 8,
    forceRof1: true,
    benefitTitle: 'Desarme Instantáneo',
    benefitDescription: 'Si al menos 1 punto de daño atraviesa el SP del cuerpo, el objetivo suelta inmediatamente el arma u objeto que sostiene en esa mano (cae al suelo intacto).',
    onHitMechanicalRule: 'Si penetra el SP de Cuerpo, el enemigo suelta el arma u objeto sostenido inmediatamente.'
  }
};

export interface InitialAttackRollOptions {
  targetDv?: number | null;
  distanceLabel?: string;
  luckSpent?: number;
  isAutofire?: boolean;
  weaponInstanceId?: string;
  aimedShotTarget?: AimedShotTarget;
}

export function createInitialAttackRoll(
  character: CharacterSheet,
  weapon: WeaponItem,
  options: InitialAttackRollOptions = {},
  aimedShotTargetParam: AimedShotTarget = 'none'
): RollEntry {
  const {
    targetDv = null,
    distanceLabel = '',
    luckSpent = 0,
    isAutofire = false,
    weaponInstanceId
  } = options;

  const aimedShotTarget = options.aimedShotTarget || aimedShotTargetParam || 'none';
  const aimedConfig = AIMED_SHOT_OPTIONS[aimedShotTarget];
  const aimedPenalty = aimedConfig ? aimedConfig.penalty : 0;

  const effectiveIsAutofire = isAutofire && aimedShotTarget === 'none';
  const breakdown = calculateWeaponAttackBreakdown(character, weapon, effectiveIsAutofire);
  const autofireSummary = getAutofireRulesSummary(weapon);
  const autofireMaxMult = autofireSummary.maxMultiplier;

  // Lanza el primer 1d10
  const d10 = Math.floor(Math.random() * 10) + 1;
  const isCritSuccess = d10 === 10;
  const isCritFail = d10 === 1;

  // Si d10 === 10 o d10 === 1: NO lanzar todavía critDie.
  // needsExplosionClick = true, critDie = null, cálculo provisional.
  const needsExplosionClick = isCritSuccess || isCritFail;
  const explosionType: 'crit_success' | 'crit_fail' | null = isCritSuccess
    ? 'crit_success'
    : isCritFail
    ? 'crit_fail'
    : null;

  const totalPenalty = breakdown.totalPenalty + aimedPenalty;
  const penaltyBreakdown = [...breakdown.penaltyBreakdown];
  if (aimedPenalty > 0 && aimedConfig) {
    penaltyBreakdown.push(`Ataque Apuntado (-${aimedPenalty}): ${aimedConfig.label}`);
  }

  const provisionalTotalAttack = breakdown.netBase - aimedPenalty + luckSpent + d10;

  let margin: number | undefined = undefined;
  let isHit: boolean | undefined = undefined;
  let autofireMultiplier: number | undefined = undefined;

  if (targetDv !== null && targetDv !== undefined) {
    margin = provisionalTotalAttack - targetDv;
    isHit = margin > 0;
    if (effectiveIsAutofire) {
      autofireMultiplier = isHit
        ? Math.min(Math.max(1, margin), autofireMaxMult || 1)
        : 0;
    }
  }

  return {
    id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    timestamp: new Date().toISOString(),
    type: 'attack',
    weaponInstanceId,
    weaponName: weapon.name,
    damageFormula: weapon.damage,
    distanceLabel,
    d10,
    critDie: null,
    needsExplosionClick,
    explosionType,
    statName: breakdown.statKey,
    statVal: breakdown.statVal,
    skillName: breakdown.skillLabel,
    skillVal: breakdown.skillVal,
    luckSpent,
    penaltiesTotal: totalPenalty,
    penaltyBreakdown,
    totalAttack: provisionalTotalAttack,
    targetDv,
    margin,
    isHit,
    isCritSuccess,
    isCritFail,
    isAutofire: effectiveIsAutofire,
    autofireMaxMult,
    autofireMultiplier,
    damageRolled: false,
    aimedShotTarget,
    aimedShotLabel: aimedShotTarget !== 'none' && aimedConfig ? aimedConfig.label : undefined,
    aimedShotEffectSummary: aimedShotTarget !== 'none' && aimedConfig ? aimedConfig.benefitDescription : undefined
  };
}

export function resolveExplosionSecondDie(entry: RollEntry): RollEntry {
  const critDie = Math.floor(Math.random() * 10) + 1;
  let totalAttack = entry.totalAttack ?? 0;

  if (entry.explosionType === 'crit_success') {
    totalAttack += critDie;
  } else if (entry.explosionType === 'crit_fail') {
    totalAttack -= critDie;
  }

  let margin = entry.margin;
  let isHit = entry.isHit;
  let autofireMultiplier = entry.autofireMultiplier;

  if (entry.targetDv !== null && entry.targetDv !== undefined) {
    margin = totalAttack - entry.targetDv;
    isHit = margin > 0;
    if (entry.isAutofire) {
      if (isHit) {
        autofireMultiplier = Math.min(
          Math.max(1, totalAttack - entry.targetDv),
          entry.autofireMaxMult || 1
        );
      } else {
        autofireMultiplier = 0;
      }
    }
  }

  return {
    ...entry,
    critDie,
    totalAttack,
    margin,
    isHit,
    autofireMultiplier,
    needsExplosionClick: false
  };
}

export function createDamageRoll(
  weaponName: string,
  damageFormula: string,
  isAutofire?: boolean,
  autofireMultiplier?: number,
  weaponInstanceId?: string,
  aimedShotTarget: AimedShotTarget = 'none'
): RollEntry {
  let diceResults: number[] = [];
  let baseDamageTotal = 0;

  if (isAutofire && aimedShotTarget === 'none') {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    diceResults = [d1, d2];
    const mult = autofireMultiplier && autofireMultiplier > 0 ? autofireMultiplier : 1;
    baseDamageTotal = (d1 + d2) * mult;
  } else {
    const match = (damageFormula || '').match(/^(\d+)d6/i);
    const diceCount = match ? parseInt(match[1], 10) : 1;
    for (let i = 0; i < diceCount; i++) {
      diceResults.push(Math.floor(Math.random() * 6) + 1);
    }
    baseDamageTotal = diceResults.reduce((sum, val) => sum + val, 0);
  }

  const sixesCount = diceResults.filter(die => die === 6).length;
  const isCriticalInjuryTrigger = sixesCount >= 2;
  const critBonusDamage = isCriticalInjuryTrigger ? 5 : 0;
  const finalDamageTotal = baseDamageTotal + critBonusDamage;

  const aimedConfig = AIMED_SHOT_OPTIONS[aimedShotTarget];

  return {
    id: `roll-dmg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    timestamp: new Date().toISOString(),
    type: 'damage',
    weaponInstanceId,
    weaponName,
    damageFormula,
    isAutofire: !!isAutofire && aimedShotTarget === 'none',
    autofireMultiplier,
    diceResults,
    sixesCount,
    isCriticalInjuryTrigger,
    baseDamageTotal,
    critBonusDamage,
    finalDamageTotal,
    damageRolled: true,
    aimedShotTarget,
    aimedShotLabel: aimedShotTarget !== 'none' && aimedConfig ? aimedConfig.label : undefined,
    aimedShotEffectSummary: aimedShotTarget !== 'none' && aimedConfig ? aimedConfig.benefitDescription : undefined
  };
}

export interface ArmorAblationResult {
  penetratingDamage: number;
  ablation: number;
  newSp: number;
  newHp: number;
  critBonusDamage: number;
  totalDamageToHp: number;
}

export function calculateArmorAblation(
  incomingDamage: number,
  currentSp: number,
  currentHp: number,
  critBonusDamage: number = 0
): ArmorAblationResult {
  const penetratingDamage = Math.max(0, incomingDamage - currentSp);
  const ablation = incomingDamage > currentSp ? 1 : 0;
  const newSp = Math.max(0, currentSp - ablation);
  const totalDamageToHp = penetratingDamage + critBonusDamage;
  const newHp = Math.max(0, currentHp - totalDamageToHp);

  return {
    penetratingDamage,
    ablation,
    newSp,
    newHp,
    critBonusDamage,
    totalDamageToHp
  };
}
