// Tipos de los datos canon de creación (plan 7, v4.8.1). Fuente: data/creation-src/*.json. [Claude Code · 2026-10-22]

export interface SourceRef {
  book: string;
  page: number | null;
  [k: string]: unknown;
}

/** Fuente con claves extra que aparecen solo en algunos ítems. */
export interface SourceRefExt extends SourceRef {
  pageType?: string;
  pages?: number[];
  note?: string;
  refDetail?: string;
}

export type CoreRoleName =
  | 'Rockerboy'
  | 'Solo'
  | 'Netrunner'
  | 'Tech'
  | 'Medtech'
  | 'Media'
  | 'Lawman'
  | 'Exec'
  | 'Fixer'
  | 'Nomad';

export interface StatBlock {
  INT: number;
  REF: number;
  DEX: number;
  TECH: number;
  COOL: number;
  WILL: number;
  LUCK: number;
  MOVE: number;
  BODY: number;
  EMP: number;
}

// ---------------------------------------------------------------- core-role-tables.json
export interface StatMethod {
  id: string;
  rulesEs: string;
  source: SourceRef;
}

export interface StatTableRow extends StatBlock {
  roll: number;
}

export interface StatTable {
  source: SourceRef;
  rows: StatTableRow[];
}

export interface SkillLevel {
  name: string;
  level: number;
}

export interface StreetratSkills {
  source: SourceRef;
  skills: SkillLevel[];
}

export interface EdgerunnerSkills {
  source: SourceRef;
  skills: string[];
}

export interface CoreRoleTablesSrc {
  book: string;
  pageConvention: string;
  methods: StatMethod[];
  statTables: Record<CoreRoleName, StatTable>;
  streetratSkills: Record<CoreRoleName, StreetratSkills>;
  edgerunnerSkills: Record<CoreRoleName, EdgerunnerSkills>;
  doubts: string[];
}

// ---------------------------------------------------------------- core-gear-skills.json
export interface CoreSkill {
  name: string;
  category: string;
  stat: string;
  x2: boolean;
  basic: boolean;
  specialization: boolean;
  descEs: string;
  source: SourceRef;
}

export interface CulturalLanguageRule {
  textEs: string;
  basicSkillsMin: number;
  culturalLanguageLevels: number;
  source: SourceRef;
}

export interface PackageGearItem {
  name: string;
  qty: number;
  options: string[] | null;
  notes: string;
}

export interface PackageWeaponsArmor {
  source: SourceRef;
  items: PackageGearItem[];
}

export interface OutfitPiece {
  style: string;
  piece: string;
  qty: number;
}

export interface PackageOutfit {
  source: SourceRef;
  gear: PackageGearItem[];
  pieces: OutfitPiece[];
}

export interface PackageCyberwareItem {
  name: string;
  options: string;
  humanityLoss: number;
}

export interface PackageCyberware {
  source: SourceRef;
  items: PackageCyberwareItem[];
  humanityAfter: null;
  totalHumanityLoss: number;
  empLoss: number;
}

export interface RolePackage {
  weaponsArmor: PackageWeaponsArmor;
  outfit: PackageOutfit;
  cyberware: PackageCyberware;
}

export interface FashionPrices {
  Bottoms: number;
  Top: number;
  Jacket: number;
  Footwear: number;
  Jewelry: number;
  Mirrorshades: number;
  Glasses: number;
  'Contact Lenses': number;
  Hats: number;
}

export interface FashionStyle {
  name: string;
  descriptors: string[];
  pricePerPiece: null;
  prices: FashionPrices;
  source: SourceRef;
}

export interface HousingDefault {
  housing: string;
  location: string;
  lifestyle: string;
  firstMonthFree: boolean;
  owedNextMonth: number;
  evictionDay: number;
}

export interface HousingExec {
  housing: string;
  location: string;
  lifestyle: string;
  rentFree: boolean;
  firstMonthPaid: boolean;
  lifestyleMonthly: number;
}

export interface HousingRule {
  textEs: string;
  default: HousingDefault;
  exec: HousingExec;
  nomadExtra: string;
  source: SourceRef;
}

export interface CompletePackageMoney {
  gear: number;
  fashion: number;
  rulesEs: string;
  source: SourceRef;
  fashionSource: SourceRef;
  streetratEdgerunnerExtra: number;
  extraSource: SourceRef;
}

export interface RunningOutOfCash {
  rulesEs: string;
  options: string[];
  cyberwareValue: number;
  source: SourceRef;
  catchSource: SourceRef;
}

export interface HumanityLossRule {
  textEs: string;
  source: SourceRef;
}

export interface CoreGearSkillsSrc {
  book: string;
  pageConvention: string;
  skills: CoreSkill[];
  culturalLanguageRule: CulturalLanguageRule;
  rolePackages: Record<CoreRoleName, RolePackage>;
  fashionStyles: FashionStyle[];
  housing: HousingRule;
  completePackageMoney: CompletePackageMoney;
  runningOutOfCash: RunningOutOfCash;
  humanityLossRule: HumanityLossRule;
  doubts: string[];
}

// ---------------------------------------------------------------- core-lifepath.json
export interface LifepathResultExtra {
  languages?: string[];
  description?: string;
}

export interface LifepathResult {
  roll: string;
  en: string;
  es: string;
  extra?: LifepathResultExtra;
}

export interface LifepathTable {
  id: string;
  name: string;
  die: string;
  source: SourceRef;
  results: LifepathResult[];
  note?: string;
}

export interface LifepathRoleBlock {
  source: SourceRef;
  tables: LifepathTable[];
}

export interface CoreLifepathSrc {
  book: string;
  pageConvention: string;
  general: LifepathTable[];
  byRole: Record<CoreRoleName, LifepathRoleBlock>;
  doubts: string[];
}

// ---------------------------------------------------------------- core-roles.json
export interface RoleAbilityOption {
  name: string;
  costOrRank: string;
  effectEs: string;
}

export interface CoreRoleAbility {
  name: string;
  summaryEs: string;
  rank4Es: string;
  options: RoleAbilityOption[];
  source: SourceRef;
}

export interface CoreRoleInfo {
  role: string;
  descEs: string;
  source: SourceRef;
  ability: CoreRoleAbility;
}

export interface EasyPregenStats {
  INT: number;
  REF: number;
  DEX: number;
  TECH: number;
  COOL: number;
  WILL: number;
  EMP: number;
  BODY: number;
  MOVE: number;
  LUCK: number;
  HP: number;
  seriouslyWounded: number;
  deathSave: number;
}

export interface EasyPregenWeapon {
  name: string;
  dmg: string;
  ammo: number | null;
  rof: number;
  notes: string;
}

export interface NamedNote {
  name: string;
  notes: string;
}

export interface EasyPregen {
  handle: string;
  role: string;
  stats: EasyPregenStats;
  skills: Record<string, number>;
  weapons: EasyPregenWeapon[];
  armor: { name: string; sp: number };
  cyberware: NamedNote[];
  gear: NamedNote[];
  roleAbility: NamedNote;
  eurodollars: null;
  source: SourceRef;
}

export interface CoreRolesSrc {
  book: string;
  pageNote: string;
  roles: CoreRoleInfo[];
  easyModePregens: EasyPregen[];
  doubts: string[];
}

// ---------------------------------------------------------------- cemk-creation.json
export interface CemkSkill {
  name: string;
  stat: string;
  descEs: string;
  source: SourceRef;
}

export interface CemkRoleAbility {
  name: string | null;
  cemkRulesEs: string;
  source: SourceRefExt;
}

export interface CemkRole {
  role: string;
  displayName: string;
  descEs: string;
  ability: CemkRoleAbility;
  tweak2070sEs: string | null;
  tweakSource: SourceRef | null;
  source: SourceRefExt;
}

export interface CemkCreationRule {
  id: string;
  textEs: string;
  source: SourceRefExt;
}

export interface InterfaceRankDv {
  rank: number;
  maxDv: number;
}

export interface CemkQuickhack {
  name: string;
  dv: number;
  tier: string;
  descEs: string;
  source: SourceRef;
}

export interface CemkLifepathTable {
  id: string;
  name: string;
  die: string;
  source: SourceRef;
  results: LifepathResult[];
  note?: string;
}

export interface CemkNeuroportPiece {
  name: string;
  descEs: string;
}

export interface CemkNeuroport {
  pieces: CemkNeuroportPiece[];
  cost: string;
  humanityLoss: string;
  install: string;
  freeAtCreationEs: string;
  descEs: string;
  source: SourceRefExt;
}

export interface CemkCyberdeckPort {
  cost: string;
  humanityLoss: string;
  requires: string;
  install: string;
  descEs: string;
  source: SourceRef;
}

export interface CemkCyberwareItem {
  name: string;
  cost: string;
  humanityLoss: string;
  install: string;
  descEs: string;
  source: SourceRef;
}

export interface CemkPregenStats {
  INT: number;
  REF: number;
  DEX: number;
  TECH: number;
  COOL: number;
  WILL: number;
  MOVE: number;
  BODY: number;
  EMP: number;
}

export interface CemkPregenWeapon {
  name: string;
  skill: string;
  baseCalc: string;
  damage: string;
  type2077: string | null;
  rof: number;
  mag: number | null;
  notes: string;
  // La clave real del JSON es literal e incluye los rangos (no es un nombre de campo estable).
  'dvByRange_0-6_7-12_13-25_26-50_51-100_101-200_201-400_401-800'?: Record<string, string>;
}

export interface CemkPregenArmor {
  name: string;
  sp: number;
  spHead: number;
  spVsMeleeChargedTech: number;
  spHeadVsMeleeChargedTech: number;
}

export interface CemkPregen {
  handle: string;
  role: string;
  roleRank: number | null;
  stats: CemkPregenStats;
  luck: number;
  hp: number;
  seriouslyWoundedThreshold: number;
  deathSave: number;
  humanity: null;
  skills: Record<string, number>;
  skillBonuses: Record<string, number>;
  skillBases: Record<string, number>;
  brawlingDamage: string;
  weapons: CemkPregenWeapon[];
  armor: CemkPregenArmor;
  cyberware: string[];
  gear: string[];
  eurodollars: number;
  roleAbilityEs: string;
  source: SourceRefExt;
  brawlingNotesEs: string;
}

export interface CemkCreationSrc {
  book: string;
  skills: CemkSkill[];
  roles: CemkRole[];
  creationRules: CemkCreationRule[];
  interfaceRankQuickhackDv: InterfaceRankDv[];
  quickhacks: CemkQuickhack[];
  lifepath: CemkLifepathTable[];
  neuroport: CemkNeuroport;
  cyberdeckPort: CemkCyberdeckPort;
  cyberware: CemkCyberwareItem[];
  pregens: CemkPregen[];
  doubts: string[];
  pageNote: string;
}

// Rangos de rol 1-10 (plan 8, v4.9.0). [Claude Code · 2026-10-22]
export interface RoleRankSource { book: string; page: number | string; pageType?: string; pages?: number[] }
export interface RoleRankStep { rank: number; unlocksEs: string[]; tierFromRank?: number; tierToRank?: number }
export interface RoleOptionCost { points: number; effectEs: string }
export interface RoleOption { id: string; name: string; costs: RoleOptionCost[]; effectEs: string; dvEs?: string; netActionCost?: string; minMotoRank?: number; appliesTo?: string }
export interface RoleTweak2077 { fromRank: number | null; textEs: string; source: RoleRankSource }
export interface RoleFolioConversion { pregen: string; folioTextEs: string; source: RoleRankSource; convertsToEs: string; startingAllocation: Record<string, unknown> }
export interface RoleRankData {
  ability: string;
  source: RoleRankSource;
  rulesEs: string;
  ranks: RoleRankStep[];
  options: RoleOption[];
  tables: Record<string, unknown>;
  tweak2077: RoleTweak2077[];
  cemk?: { textEs: string; source: unknown; data: unknown } | null;
  folio: RoleFolioConversion | null;
}
export type RoleRankRoleName = 'Solo' | 'Netrunner' | 'Tech' | 'Medtech' | 'Nomad' | 'Rockerboy' | 'Fixer' | 'Media' | 'Exec' | 'Lawman';
export interface RoleRanksSrc {
  pageConvention: unknown;
  general: { expandedAvailability: { textEs: string; source: RoleRankSource }; roleTweaksNoteEs: string };
  roles: Record<RoleRankRoleName, RoleRankData>;
  doubts: string[];
}
