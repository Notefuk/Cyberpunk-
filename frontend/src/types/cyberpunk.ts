export type StatKey =
  | 'INT'
  | 'REF'
  | 'DEX'
  | 'TECH'
  | 'COOL'
  | 'WILL'
  | 'LUCK'
  | 'MOVE'
  | 'BODY'
  | 'EMP';

export type CombatSkillKey =
  | 'handgun'
  | 'shoulderArms'
  | 'autofire'
  | 'heavyWeapons'
  | 'archery'
  | 'meleeWeapon'
  | 'brawling'
  | 'martialArts'
  | 'evasion'
  | 'athletics'
  | 'firstAid'
  | 'paramedic'
  | 'cybertech'
  | 'perception'
  | 'concentration'
  | 'resistTortureDrugs';

export interface SkillMeta {
  label: string;
  stat: StatKey;
  isDoubleCost?: boolean;
  category: 'ranged' | 'melee' | 'defense' | 'medical' | 'general';
}

export const SKILL_METADATA: Record<CombatSkillKey, SkillMeta> = {
  handgun: {
    label: 'Handgun',
    stat: 'REF',
    category: 'ranged'
  },
  shoulderArms: {
    label: 'Shoulder Arms',
    stat: 'REF',
    category: 'ranged'
  },
  autofire: {
    label: 'Autofire',
    stat: 'REF',
    isDoubleCost: true,
    category: 'ranged'
  },
  heavyWeapons: {
    label: 'Heavy Weapons',
    stat: 'REF',
    isDoubleCost: true,
    category: 'ranged'
  },
  archery: {
    label: 'Archery',
    stat: 'REF',
    category: 'ranged'
  },
  meleeWeapon: {
    label: 'Melee Weapon',
    stat: 'DEX',
    category: 'melee'
  },
  brawling: {
    label: 'Brawling',
    stat: 'DEX',
    category: 'melee'
  },
  martialArts: {
    label: 'Martial Arts',
    stat: 'DEX',
    isDoubleCost: true,
    category: 'melee'
  },
  evasion: {
    label: 'Evasion',
    stat: 'DEX',
    category: 'defense'
  },
  athletics: {
    label: 'Athletics',
    stat: 'DEX',
    category: 'general'
  },
  firstAid: {
    label: 'First Aid',
    stat: 'TECH',
    category: 'medical'
  },
  paramedic: {
    label: 'Paramedic',
    stat: 'TECH',
    isDoubleCost: true,
    category: 'medical'
  },
  cybertech: {
    label: 'Cybertech',
    stat: 'TECH',
    category: 'general'
  },
  perception: {
    label: 'Perception',
    stat: 'INT',
    category: 'general'
  },
  concentration: {
    label: 'Concentration',
    stat: 'WILL',
    category: 'general'
  },
  resistTortureDrugs: {
    label: 'Resist Torture/Drugs',
    stat: 'WILL',
    category: 'general'
  }
};

export interface InjuryModifier {
  statPenalties?: Partial<Record<StatKey, number>>;
  allActionsPenalty?: number;
  movePenalty?: number;
  rangedAttackPenalty?: number;
  meleeAttackPenalty?: number;
  bonusDeathSavePenalty?: number;
}

export interface WeaponItem {
  id: string;
  name: string;
  type: string;
  skill: string;
  damage: string;
  rof: number;
  hands: number;
  concealable: boolean;
  cost: number;
  costTier?: string;
  standardMag?: number;
  ammoType?: string;
  altFireModes?: string;
  autofireMaxMult?: number;
  dvTable?: string;
  notes?: string;
  examples?: string;
}

export interface ArmorItem {
  id: string;
  name: string;
  sp: number;
  penalty: number;
  cost: number;
  costTier?: string;
  description?: string;
  hp?: number;
}

export interface CyberwareItem {
  id: string;
  name: string;
  type: string;
  install: string;
  humanityLoss: string;
  cost: number;
  description?: string;
  slots?: number;
}

export interface ProgramItem {
  id: string;
  name: string;
  class: string;
  atk?: number;
  def?: number;
  rez?: number;
  per?: number;
  spd?: number;
  cost: number;
  description?: string;
}

export interface GearItem {
  id: string;
  name: string;
  cost: number;
  costTier?: string;
  description?: string;
  slots?: number;
  notes?: string;
}

export interface DrugItem {
  id: string;
  name: string;
  cost: number;
  costTier?: string;
  primaryEffect?: string;
  secondaryEffect?: string;
  duration?: string;
  addictionDv?: number;
  description?: string;
}

export interface AmmoItem {
  id: string;
  name: string;
  cost: number;
  costTier?: string;
  type?: string;
  quantity?: number;
  description?: string;
}

export interface EquippedWeapon extends WeaponItem {
  instanceId: string;
  currentMag: number;
  loadedAmmoType: string;
}

export interface ActiveCriticalInjury {
  id: string;
  name: string;
  location: 'head' | 'body';
  effect: string;
  quickFixDv: string;
  treatmentDv: string;
  iconType: 'skull' | 'brain' | 'eye' | 'bone' | 'limb' | 'organ' | 'ear';
  modifiers: InjuryModifier;
  isTreated: boolean;
}

export interface CharacterSheet {
  id: string;
  handle: string;
  role: string;
  roleRank: number;
  notes?: string;
  stats: Record<StatKey, number>;
  currentHp: number;
  currentLuck: number;
  currentHumanity: number;
  headArmor: {
    name: string;
    maxSp: number;
    currentSp: number;
    penalty: number;
  };
  bodyArmor: {
    name: string;
    maxSp: number;
    currentSp: number;
    penalty: number;
  };
  skills: Record<CombatSkillKey, number>;
  equippedWeapons: EquippedWeapon[];
  installedCyberwareIds: string[];
  activeInjuries: ActiveCriticalInjury[];
  eurodollars: number;
}

export interface RollEntry {
  id: string;
  timestamp: string;
  type: 'attack' | 'damage' | 'skill';
  weaponInstanceId?: string;
  weaponName: string;
  damageFormula?: string;
  distanceLabel?: string;
  // Datos de tirada 1d10
  d10?: number;
  critDie?: number | null;
  needsExplosionClick?: boolean; // true cuando d10 === 10 o d10 === 1 y el usuario aún no apretó el segundo botón de crítico/pifia
  explosionType?: 'crit_success' | 'crit_fail' | null;
  statName?: StatKey;
  statVal?: number;
  skillName?: string;
  skillVal?: number;
  luckSpent?: number;
  penaltiesTotal?: number;
  penaltyBreakdown?: string[];
  totalAttack?: number;
  targetDv?: number | null;
  margin?: number;
  isHit?: boolean;
  isCritSuccess?: boolean;
  isCritFail?: boolean;
  isAutofire?: boolean;
  autofireMaxMult?: number;
  autofireMultiplier?: number;
  damageRolled?: boolean;
  // Datos de tirada de daño Xd6
  diceResults?: number[];
  sixesCount?: number;
  isCriticalInjuryTrigger?: boolean; // true si sixesCount >= 2
  baseDamageTotal?: number;
  critBonusDamage?: number; // +5 si sixesCount >= 2
  finalDamageTotal?: number;
}
