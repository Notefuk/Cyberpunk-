import type { ExecTeamMember } from '../engine/socialRoleRules';

// v4.9.3 [Claude Code · 2026-10-23] Grupo de fans del Rockerboy (Core pp.144-145).
export interface RockerboyFanGroup {
  id: string;
  name: string;
  size: 'single' | 'small' | 'huge';
  note?: string;
  favorBlockedUntilDay?: number;
  createdAt: string;
}

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

export interface SkillExample {
  label: string;
  dv: string;
}

export interface SkillMeta {
  label: string;
  stat: StatKey;
  isDoubleCost?: boolean;
  category: 'ranged' | 'melee' | 'defense' | 'medical' | 'general';
  summary: string;
  examples: SkillExample[];
}

export const SKILL_METADATA: Record<CombatSkillKey, SkillMeta> = {
  handgun: {
    label: 'Handgun',
    stat: 'REF',
    category: 'ranged',
    summary: 'Disparo y manejo de pistolas y revólveres (1 mano, distancias corta y media).',
    examples: [
      { label: 'A quemarropa (0-6m)', dv: 'DV 13' },
      { label: 'Corta distancia (7-12m)', dv: 'DV 15' },
      { label: 'Media distancia (13-25m)', dv: 'DV 20' }
    ]
  },
  shoulderArms: {
    label: 'Shoulder Arms',
    stat: 'REF',
    category: 'ranged',
    summary: 'Disparo de armas largas a dos manos (fusiles de asalto, francotirador y escopetas).',
    examples: [
      { label: 'Fusil Asalto - Óptimo (26-50m)', dv: 'DV 13' },
      { label: 'Escopeta Cartucho (6x6m zona)', dv: 'DV 13' },
      { label: 'Francotirador (51-100m)', dv: 'DV 15' }
    ]
  },
  autofire: {
    label: 'Autofire',
    stat: 'REF',
    isDoubleCost: true,
    category: 'ranged',
    summary: 'Ráfagas de fuego automático. Daño = 2d6 × margen sobre DV (hasta máx del arma).',
    examples: [
      { label: 'SMG Ráfaga - Óptimo (7-12m)', dv: 'DV 17' },
      { label: 'Fusil Asalto - Óptimo (13-25m)', dv: 'DV 17' },
      { label: 'Doble 6 en 2d6 de daño', dv: 'Crítico (+5)' }
    ]
  },
  heavyWeapons: {
    label: 'Heavy Weapons',
    stat: 'REF',
    isDoubleCost: true,
    category: 'ranged',
    summary: 'Lanzacohetes, lanzagranadas, ametralladoras pesadas y artillería antiblindaje.',
    examples: [
      { label: 'Lanzagranadas (13-25m)', dv: 'DV 15' },
      { label: 'Lanzacohetes (13-50m)', dv: 'DV 15' },
      { label: 'Impacto explosivo en área', dv: '10x10m' }
    ]
  },
  archery: {
    label: 'Archery',
    stat: 'REF',
    category: 'ranged',
    summary: 'Uso de arcos y ballestas silenciosos. Permite recuperar proyectiles no rotos.',
    examples: [
      { label: 'Ballesta - Óptimo (7-12m)', dv: 'DV 13' },
      { label: 'Arco compuesto (13-25m)', dv: 'DV 15' },
      { label: 'Tiro a larga distancia (26-50m)', dv: 'DV 17' }
    ]
  },
  meleeWeapon: {
    label: 'Melee Weapon',
    stat: 'DEX',
    category: 'melee',
    summary: 'Armas blancas y contundentes (katanas, bates, cuchillos). Divide a la mitad el SP defensor.',
    examples: [
      { label: 'Ataque cuerpo a cuerpo base', dv: 'Enfrentada DEX' },
      { label: 'Ignorar mitad de blindaje', dv: 'SP / 2' },
      { label: 'Arma ligera o media (ROF 2)', dv: '2 Ataques' }
    ]
  },
  brawling: {
    label: 'Brawling',
    stat: 'DEX',
    category: 'melee',
    summary: 'Pelea desarmada, agarres, proyecciones y llaves. Tirada enfrentada; NO ignora SP.',
    examples: [
      { label: 'Golpe de puño / patada (ROF 2)', dv: 'Enfrentada DEX' },
      { label: 'Inmovilizar / Agarrar rival', dv: 'Enfrentada' },
      { label: 'Escapar de un agarre', dv: 'Brawling vs Brawling' }
    ]
  },
  martialArts: {
    label: 'Martial Arts',
    stat: 'DEX',
    isDoubleCost: true,
    category: 'melee',
    summary: 'Artes marciales formales. Ignora el 50% de SP y permite maniobras especiales de estilo.',
    examples: [
      { label: 'Golpe marcial (ROF 2)', dv: 'Enfrentada DEX' },
      { label: 'Ignorar blindaje pesado', dv: 'SP / 2' },
      { label: 'Maniobra especial de estilo', dv: 'Requisito especial' }
    ]
  },
  evasion: {
    label: 'Evasion',
    stat: 'DEX',
    category: 'defense',
    summary: 'Esquivar golpes cuerpo a cuerpo y, si tienes REF 8+, esquivar balas antes del impacto.',
    examples: [
      { label: 'Esquivar ataque Melee/Brawling', dv: 'Enfrentada DEX' },
      { label: 'Esquivar proyectil (con REF 8+)', dv: 'vs Tirada Ataque' },
      { label: 'Esquivar explosión / área', dv: 'DV según arma' }
    ]
  },
  athletics: {
    label: 'Athletics',
    stat: 'DEX',
    category: 'general',
    summary: 'Correr, saltar, trepar, nadar y lanzar granadas con precisión atlética.',
    examples: [
      { label: 'Lanzar granada a blanco', dv: 'DV por distancia' },
      { label: 'Salto difícil o carrera con obstáculo', dv: 'DV 13 / 15' },
      { label: 'Trepar superficie resbaladiza', dv: 'DV 15' }
    ]
  },
  firstAid: {
    label: 'First Aid',
    stat: 'TECH',
    category: 'medical',
    summary: 'Estabilizar pacientes moribundos y aplicar Quick Fix básico a heridas críticas.',
    examples: [
      { label: 'Estabilizar herido grave', dv: 'DV 10' },
      { label: 'Quick Fix herida básica (ej. Oído)', dv: 'DV 13' },
      { label: 'Quick Fix trauma severo', dv: 'DV 15' }
    ]
  },
  paramedic: {
    label: 'Paramedic',
    stat: 'TECH',
    isDoubleCost: true,
    category: 'medical',
    summary: 'Medicina de campaña avanzada, Quick Fix complejo y tratamientos en clínica/ambulancia.',
    examples: [
      { label: 'Quick Fix miembro roto o pulmón', dv: 'DV 13 / 15' },
      { label: 'Tratamiento definitivo en clínica', dv: 'DV 13 / 15' },
      { label: 'Cirugía de neurofijación / espinal', dv: 'DV 17' }
    ]
  },
  cybertech: {
    label: 'Cybertech',
    stat: 'TECH',
    category: 'general',
    summary: 'Instalación, mantenimiento, diagnóstico y reparación de ciberware y prótesis.',
    examples: [
      { label: 'Diagnosticar ciberimplante dañado', dv: 'DV 13' },
      { label: 'Reparar ciberbrazo en taller', dv: 'DV 15' },
      { label: 'Calibrar ciberóptica / procesador', dv: 'DV 17' }
    ]
  },
  perception: {
    label: 'Perception',
    stat: 'INT',
    category: 'general',
    summary: 'Detectar emboscadas, trampas, pistas ocultas, escuchar ruidos y ver en penumbra.',
    examples: [
      { label: 'Detectar emboscada o trampa obvia', dv: 'DV 13' },
      { label: 'Escuchar susurro o pasos furtivos', dv: 'DV 15' },
      { label: 'Hallar microcámara o pista oculta', dv: 'DV 17' }
    ]
  },
  concentration: {
    label: 'Concentration',
    stat: 'WILL',
    category: 'general',
    summary: 'Mantener foco bajo fuego de supresión, resistir distracciones y memorizar datos.',
    examples: [
      { label: 'Resistir Fuego de Supresión', dv: 'vs Tirada Supresión' },
      { label: 'Mantener concentración con dolor', dv: 'DV 13' },
      { label: 'Memorizar plano de seguridad complejo', dv: 'DV 15' }
    ]
  },
  resistTortureDrugs: {
    label: 'Resist Torture/Drugs',
    stat: 'WILL',
    category: 'general',
    summary: 'Resistir efectos de toxinas, drogas callejeras, interrogatorios duros y flashbangs.',
    examples: [
      { label: 'Resistir aturdimiento por Flashbang', dv: 'DV 13' },
      { label: 'Resistir adicción a drogas', dv: 'DV 15' },
      { label: 'Resistir interrogatorio químico', dv: 'DV 17' }
    ]
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

export type AimedShotTarget = 'none' | 'head' | 'leg' | 'held_item';
export type SourceBookId = 'core' | 'black_chrome' | 'cemk_2077' | 'interface_red' | 'danger_gal' | 'dlc';

export interface PreGeneratedEnemyTemplate {
  id: string;
  name: string;
  subtitle: string;
  faction: string;
  threatTier: 'mook' | 'hardened_mook' | 'lieutenant' | 'hardened_lieutenant' | 'mini_boss' | 'boss' | 'cyberpsycho' | 'legend';
  sourceBook: SourceBookId;
  sourceBookTitle: string;
  era: '2045' | '2077';
  role: string;
  hp: number;
  seriouslyWounded: number;
  deathSave: number;
  headSp: number;
  bodySp: number;
  stats: Record<StatKey, number>;
  combatBases: Array<{ label: string; totalBase: number; damage?: string; rof?: number; notes?: string }>;
  weapons: Array<{ name: string; skillBase: number; damage: string; rof: number; mag: number; notes?: string }>;
  cyberware: string[];
  gear: string[];
  specialRules: string[];
  loreSummary: string;
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
  sourceBook?: SourceBookId;
  sourceBookTitle?: string;
  sourcePage?: number;
  era?: '2045' | '2077';
  weaponTechType?: 'standard' | 'power' | 'tech' | 'smart';
  rebuild2077?: 'standard' | 'power' | 'smart' | 'tech';
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
  sourceBook?: SourceBookId;
  sourceBookTitle?: string;
  era?: '2045' | '2077';
  weaponTechType?: 'standard' | 'power' | 'tech' | 'smart';
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
  sourceBook?: SourceBookId;
  sourceBookTitle?: string;
  sourcePage?: number;
  era?: '2045' | '2077';
  weaponTechType?: 'standard' | 'power' | 'tech' | 'smart';
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
  sourceBook?: SourceBookId;
  sourceBookTitle?: string;
  era?: '2045' | '2077';
  weaponTechType?: 'standard' | 'power' | 'tech' | 'smart';
}

export interface GearItem {
  id: string;
  name: string;
  cost: number;
  costTier?: string;
  description?: string;
  slots?: number;
  notes?: string;
  sourceBook?: SourceBookId;
  sourceBookTitle?: string;
  sourcePage?: number;
  era?: '2045' | '2077';
  weaponTechType?: 'standard' | 'power' | 'tech' | 'smart';
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
  sourceBook?: SourceBookId;
  sourceBookTitle?: string;
  sourcePage?: number;
  era?: '2045' | '2077';
  weaponTechType?: 'standard' | 'power' | 'tech' | 'smart';
}

export interface AmmoItem {
  id: string;
  name: string;
  cost: number;
  costTier?: string;
  type?: string;
  quantity?: number;
  description?: string;
  sourceBook?: SourceBookId;
  sourceBookTitle?: string;
  sourcePage?: number;
  era?: '2045' | '2077';
  weaponTechType?: 'standard' | 'power' | 'tech' | 'smart';
}

export type TechWeaponUpgradeType = 'none' | 'excellent_quality' | 'extra_slot' | 'concealable' | 'invention_damage_mod';

export interface EquippedWeapon extends WeaponItem {
  instanceId: string;
  currentMag: number;
  loadedAmmoType: string;
  inHand?: boolean;
  reserveAmmo?: number;
  rebuild2077?: 'standard' | 'power' | 'smart' | 'tech';
  installedAttachments?: string[];
  techUpgrade?: TechWeaponUpgradeType;
  baseStandardMag?: number;
  underbarrelSgAmmo?: number;
  underbarrelGlAmmo?: number;
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
  // v4.9.2 [Claude Code · 2026-10-22]: tabla de origen y estado de Quick Fix (vence al pasar de día; Core p.223 / CEMK RB p.14).
  table?: 'core' | 'cemk';
  quickFixUntilDay?: number;
  quickFixed?: boolean;
}

export interface ActiveDrugEffect {
  id: string;
  name: string;
  duration: string;
  primaryEffect: string;
  secondaryEffect: string;
  addictionDv: string;
}

export interface InventoryItem {
  id: string;
  catalogId: string;
  name: string;
  category: 'weapons' | 'armor' | 'cyberware' | 'programs' | 'ammunition' | 'attachments' | 'drugs' | 'gear';
  cost: number;
  quantity: number;
  details?: string;
}

export interface EurodollarTransaction {
  id: string;
  timestamp: string;
  concept: string;
  amount: number; // negativo para compras/gastos, positivo para pagos de gigs
  balanceAfter: number;
}

export type CharacterEra = '2045' | '2077';
export type CreationMethod = 'streetrat' | 'edgerunner' | 'complete_package' | 'pregen';

export interface LifepathEnemy {
  id: string;
  who: string;
  cause: string;
  throwAtYou: string;
  reaction: string;
  customNotes?: string;
}

export interface CharacterLifepath {
  culturalRegion: string;
  personality: string;
  clothingStyle: string;
  hairstyle: string;
  affectation: string;
  valueMost: string;
  feelAboutPeople: string;
  valuedPerson: string;
  valuedPossession: string;
  familyBackground: string;
  childhoodEnvironment: string;
  familyCrisis: string;
  friends: string[];
  tragicLoveAffairs: string[];
  enemies: LifepathEnemy[];
  roleLifepath: Record<string, string>;
  roleSpecificLifepath?: Record<string, string>;
  lifeGoal: string;
}

export interface CharacterDebt {
  isActive: boolean;
  amount: number;
  creditorType: 'corp' | 'law' | 'gang' | 'custom';
  creditorName: string;
  terms: string;
}

export type AppThemeId = 'neo_red' | 'edgerunners_2077' | 'danger_gal_pink';

export interface SoloCombatAwarenessAllocation {
  fumbleRecovery: boolean; // Costs 4 pts: ignore natural 1 critical failures
  damageDeflection: number; // Costs 2 pts per 1 dmg reduction on first hit
  initiativeReaction: number; // Costs 1 pt per +1 to Initiative
  precisionAttack: number; // Costs 3 pts per +1 to all Attacks
  spotWeakness: number; // Costs 1 pt per +1 damage to first successful attack
  threatDetection: number; // Costs 1 pt per +1 to Perception
}

export interface ActiveFbcState {
  isFullBodyConversion: boolean;
  hasBiopod: boolean;
  activeChassisId: string;
  activeChassisName: string;
  bodyOverride: number;
  moveOverride?: number; // legacy, ignorado
  statFloor?: number;
  armorPenalty?: number;
  baseArmorSp: number;
  immunities: string[];
  /** Armadura que tenía el personaje antes de la conversión, para restaurarla al desactivar. */
  preFbcHeadArmor?: CharacterSheet['headArmor'];
  preFbcBodyArmor?: CharacterSheet['bodyArmor'];
}

export interface OwnedVehicle {
  instanceId: string;
  catalogId: string;
  name: string;
  category: 'land' | 'sea' | 'air';
  maxSdp: number;
  currentSdp: number;
  armorSp: number;
  seats: number;
  combatSpeed: string;
  narrativeSpeed: string;
  upgrades: string[];
  mountedWeapons: string[];
  notes?: string;
}

export interface TechMakerProject {
  id: string;
  name: string;
  specialty: 'field' | 'upgrade' | 'fabrication' | 'invention';
  dv: number;
  hoursRequired: number;
  hoursCompleted: number;
  cost: number;
  isCompleted: boolean;
}

export interface MedtechCryoAndPharma {
  pharmaceuticalsRank: number;
  cryoSystemRank: number;
  synthesizedDoses: Record<string, number>;
  activeCryotanks: Array<{ id: string; patientName: string; condition: string }>;
}

// v4.9.1 [Claude Code · 2026-10-22]
export type IpLogKind = 'initial' | 'award' | 'adjust' | 'spend_role' | 'spend_skill' | 'spend_martial' | 'gm';
export interface IpLogEntry { id: string; at: string; kind: IpLogKind; delta: number; reason: string; balanceAfter: number }
// v4.9.7 [Claude Code · 2026-10-24]: totales de los movimientos de IP archivados, para que el panel no cambie.
export interface IpArchivedTotals { earned: number; adjusted: number; spentRole: number; spentSkills: number; spentMartial: number; gmEdits: number }

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
    techUpgradedSp?: boolean;
  };
  bodyArmor: {
    name: string;
    maxSp: number;
    currentSp: number;
    penalty: number;
    techUpgradedSp?: boolean;
  };
  skills: Record<CombatSkillKey, number>;
  equippedWeapons: EquippedWeapon[];
  installedCyberwareIds: string[];
  empDisabledCyberwareIds?: string[];
  activeInjuries: ActiveCriticalInjury[];
  /** Death Save Penalty acumulado mientras está Mortally Wounded (Core p. 188). Vuelve a 0 al estabilizar a 1+ HP. */
  deathSavePenalty?: number;
  /** Falló un Death Save (Core p. 188). */
  isDead?: boolean;
  eurodollars: number;
  inventory?: InventoryItem[];
  transactions?: EurodollarTransaction[];
  unarmedInHand?: { brawling?: boolean; martialArts?: boolean };
  activeDrugs?: ActiveDrugEffect[];
  era?: CharacterEra;
  creationMethod?: CreationMethod;
  roleAbilityName?: string;
  /** Variante de la Habilidad de Rol elegida en la creación: texto del Core o ajuste CEMK (plan 7, v4.8.2). [Claude Code · 2026-10-22] */
  roleAbilityVariant?: 'core' | 'cemk';
  /** Id del Folio de CEMK del que se copió la ficha (creador, método pregen). [Claude Code · 2026-10-22] */
  sourceFolioId?: string;
  generalSkills?: Record<string, number>;
  fashionBudgetRemaining?: number;
  hasNeuroport?: boolean;
  lifepath?: CharacterLifepath;
  debt?: CharacterDebt;
  portraitId?: string;
  fbcState?: ActiveFbcState;
  soloAllocation?: SoloCombatAwarenessAllocation;
  knownMartialArts?: Record<string, number>;
  vehicles?: OwnedVehicle[];
  techProjects?: TechMakerProject[];
  medtechLab?: MedtechCryoAndPharma;
  improvementPoints?: number; // IP disponibles para mejorar habilidades/rol
  interfaceRankOverride?: number; // Permite fijar/ajustar el rango de Interface (0-10) para desbloquear Quickhacks
  ownedMartialArtChips?: string[]; // IDs de estilos cuyos Skill Chips (Nivel 3) fueron comprados/adquiridos
  equippedMartialArtChips?: string[]; // IDs de Skill Chips de Artes Marciales actualmente insertados en Chipware Socket / Neuroport
  // v4.9.1 [Claude Code · 2026-10-22]
  makerAllocation?: { field: number; upgrade: number; fabrication: number; invention: number };
  // v4.9.3 [Claude Code · 2026-10-23]
  execTeam?: ExecTeamMember[];
  // v4.9.3 [Claude Code · 2026-10-23]
  rockerboyFans?: RockerboyFanGroup[];
  // v4.9.1 [Claude Code · 2026-10-22]
  medicineAllocation?: { surgery: number; pharmaceuticals: number; cryosystem: number; knownPharmaceuticals?: string[] };
  // v4.9.1 [Claude Code · 2026-10-22]
  ipLog?: IpLogEntry[];
  ipLogArchivedTotals?: IpArchivedTotals;
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
  aimedShotTarget?: AimedShotTarget;
  aimedShotLabel?: string;
  aimedShotEffectSummary?: string;
}
