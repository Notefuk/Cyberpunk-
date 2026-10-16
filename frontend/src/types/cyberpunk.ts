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
