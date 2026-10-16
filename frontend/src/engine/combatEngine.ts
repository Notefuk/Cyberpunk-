import type {
  CharacterSheet,
  RollEntry,
  WeaponItem
} from '../types/cyberpunk';
import {
  calculateWeaponAttackBreakdown,
  getAutofireRulesSummary
} from './characterEngine';

export interface InitialAttackRollOptions {
  targetDv?: number | null;
  distanceLabel?: string;
  luckSpent?: number;
  isAutofire?: boolean;
  weaponInstanceId?: string;
}

export function createInitialAttackRoll(
  character: CharacterSheet,
  weapon: WeaponItem,
  options: InitialAttackRollOptions = {}
): RollEntry {
  const {
    targetDv = null,
    distanceLabel = '',
    luckSpent = 0,
    isAutofire = false,
    weaponInstanceId
  } = options;

  const breakdown = calculateWeaponAttackBreakdown(character, weapon, isAutofire);
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

  const provisionalTotalAttack = breakdown.netBase + luckSpent + d10;

  let margin: number | undefined = undefined;
  let isHit: boolean | undefined = undefined;
  let autofireMultiplier: number | undefined = undefined;

  if (targetDv !== null && targetDv !== undefined) {
    margin = provisionalTotalAttack - targetDv;
    isHit = margin > 0;
    if (isAutofire) {
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
    penaltiesTotal: breakdown.totalPenalty,
    penaltyBreakdown: breakdown.penaltyBreakdown,
    totalAttack: provisionalTotalAttack,
    targetDv,
    margin,
    isHit,
    isCritSuccess,
    isCritFail,
    isAutofire,
    autofireMaxMult,
    autofireMultiplier,
    damageRolled: false
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
  weaponInstanceId?: string
): RollEntry {
  let diceResults: number[] = [];
  let baseDamageTotal = 0;

  if (isAutofire) {
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

  return {
    id: `roll-dmg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    timestamp: new Date().toISOString(),
    type: 'damage',
    weaponInstanceId,
    weaponName,
    damageFormula,
    isAutofire: !!isAutofire,
    autofireMultiplier,
    diceResults,
    sixesCount,
    isCriticalInjuryTrigger,
    baseDamageTotal,
    critBonusDamage,
    finalDamageTotal,
    damageRolled: true
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
