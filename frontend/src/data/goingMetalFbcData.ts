/**
 * GOING METAL // FULL BODY CONVERSIONS (FBC)
 * Fuente: Cyberpunk RED "Going Metal", pp. 91-111. Solo contenido canon del libro.
 * Cada entrada lleva su `sourcePage` (página impresa del libro).
 * Datos que el libro no da (p. ej. slots por cuerpo) se omiten a propósito.
 * BODY del frame: Implanted Linear Frame Sigma = 12, Beta = 14 (Core, tabla de Borgware), Omega = 16 (Going Metal p. 108).
 * SP: Skin Weave 7 y Subdermal Armor 11 (Core, tabla de Internal/External Cyberware); Heavy Subdermal Plating 13 (p. 107) y Dragoon Plating 15 (p. 105).
 * statFloor: Internal Hydraulics Upgrade 4, Tuned 6, Perfected 8 (Going Metal pp. 107-108).
 */

export interface FbcBody {
  id: string;
  name: string;
  manufacturer: string;
  cost: number;
  costTier: string;
  /** Texto del libro: "52 ([2d6/2 round up] + 15d6)". */
  humanityLoss: string;
  /** HL promedio del paquete de ciberware del cuerpo (sin el Biosystem). */
  packageHlAverage: number;
  install: string;
  /** BODY que da el Internal Linear Frame del cuerpo. */
  bodyOverride: number;
  /** Mínimo de REF/DEX/MOVE que garantiza la hidráulica (0 si el cuerpo no la trae). */
  statFloor: number;
  baseArmorSp: number;
  /** Penalizador de armadura a REF/DEX/MOVE (0 si no tiene). Positivo = penalización (Dragoon: 2). */
  armorPenalty: number;
  /** Ciberware incluido que NO causa HL ni baja el máximo de Humanidad por terapia. */
  cyberwareNoHl: string[];
  /** Ciberware incluido que SÍ causa HL. */
  cyberwareHl: string[];
  /** Unión de cyberwareNoHl y cyberwareHl. */
  builtInCyberware: string[];
  specialRules: string[];
  loreDescription: string;
  /** Página impresa de Going Metal. */
  sourcePage: number;
}

export interface FbcCyberwareItem {
  id: string;
  name: string;
  type: string;
  install: string;
  humanityLoss: string;
  cost: number;
  costTier: string;
  description: string;
  sourceBook: 'going_metal';
  sourcePage: number;
  slotsRequired?: number;
  fbcOnly?: boolean;
}

export interface GoingMetalGearItem {
  id: string;
  name: string;
  category: 'gear' | 'weapons' | 'armor';
  cost: number;
  costTier: string;
  description: string;
  sourceBook: 'going_metal';
  sourcePage: number;
  stats?: Record<string, string | number>;
}

export interface AboutFbcsGuide {
  title: string;
  subtitle: string;
  summary: string;
  corePrinciples: { ruleName: string; description: string; mechanicalImpact: string }[];
  conversionSteps: { step: number; title: string; detail: string }[];
  medicalAndRepairRules: { topic: string; skill: string; dv: number; effect: string }[];
  tacticalProsAndCons: { pros: string[]; cons: string[] };
}

// ============================================================================
// CONSTANTES DE REGLAS (Going Metal pp. 93-94, 104)
// ============================================================================

/** HL promedio del Biosystem: 4d6 (p. 104). */
export const BIOSYSTEM_HL_AVERAGE = 14;

/** Heridas Críticas a las que un usuario en cuerpo FBC es inmune, nombres del Core en inglés (p. 94). */
export const FBC_IMMUNE_CRITICAL_INJURIES: string[] = [
  'Broken Jaw',
  'Collapsed Lung',
  'Concussion',
  'Cracked Skull',
  'Crushed Windpipe',
  'Lost Ear',
  'Spinal Injury',
  'Torn Muscle',
  'Whiplash'
];

/** Inmunidades del usuario en cuerpo FBC (pp. 94, 104). */
export const FBC_IMMUNITIES: string[] = [
  'Efectos y daño adicional de las Heridas Críticas: Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash (se ignoran, sin re-tirar)',
  'Penalizadores de Check y STAT de todos los Wound States (los Death Saves siguen aplicando)',
  'Enfermedades, venenos, fármacos y drogas callejeras, salvo si se administran con Airhypo directo al puerto de acceso del Biosystem',
  'Radiación',
  'No necesita respirar, comer ni beber (requiere Glucose-Rich Brain Solution una vez al mes)',
  'Penalizadores por dormir incómodo o vivir hacinado'
];

/** Tabla de HP del Linear Frame Omega (p. 108): HP por BODY (16/17), columnas WILL 2 a 10. */
export const LINEAR_FRAME_OMEGA_HP_CHART: Record<number, number[]> = {
  16: [55, 60, 60, 65, 65, 70, 70, 75, 75],
  17: [60, 60, 65, 65, 70, 70, 75, 75, 80]
};

// ============================================================================
// 1. LOS 13 CUERPOS FBC (Going Metal pp. 96-104, tabla p. 110)
// ============================================================================

type FbcBodyRaw = Omit<FbcBody, 'builtInCyberware'>;

const FBC_BODIES_RAW: FbcBodyRaw[] = [
  {
    id: 'gm-copernicus',
    name: 'Cybermatrix Inc. Copernicus',
    manufacturer: 'Cybermatrix Incorporated',
    cost: 17300,
    costTier: 'Very Expensive',
    humanityLoss: '52 ([2d6/2 round up] + 15d6)',
    packageHlAverage: 52,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 4,
    baseArmorSp: 0,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Sigma', 'Kiroshi MonoVision', 'Neural Link'],
    cyberwareHl: ['Anti-Dazzle', 'FBC EMP Coating x2', 'Grapple Hand x2', 'Internal Hydraulics Upgrade', 'Prehensile Cyberfoot x2', 'Radar/Sonar Implant', 'Radio Communicator', 'Toolhand x2', 'Zero Gravity Thrusters x2'],
    specialRules: [],
    loreDescription: 'Cuerpo ideal para la exploración y construcción en el espacio profundo; columna vertebral de las operaciones espaciales modernas.',
    sourcePage: 96
  },
  {
    id: 'gm-aquarius',
    name: 'Dynalar Aquarius',
    manufacturer: 'Dynalar',
    cost: 13000,
    costTier: 'Very Expensive',
    humanityLoss: '37 ([2d6/2 round up] + 10d6)',
    packageHlAverage: 37,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 0,
    baseArmorSp: 11,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Sigma', 'Neural Link'],
    cyberwareHl: ['Low Light/Infrared/UV x2', 'Radar Detector', 'Radio Communicator', 'Radar/Sonar Implant', 'Subdermal Armor', 'Web Foot x2'],
    specialRules: [],
    loreDescription: 'Cuerpo de exploración y vida bajo el mar, apto para agua dulce y salada.',
    sourcePage: 96
  },
  {
    id: 'gm-brimstone',
    name: 'Dynalar Brimstone',
    manufacturer: 'Dynalar',
    cost: 17600,
    costTier: 'Very Expensive',
    humanityLoss: '53 ([1d6/2 round up] + 15d6)',
    packageHlAverage: 53,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 0,
    baseArmorSp: 13,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Sigma', 'Neural Link'],
    cyberwareHl: ['Amplified Hearing', 'FBC Brimstone Coating', 'Heavy Subdermal Plating', 'Low Light/Infrared/UV x2', 'Radar/Sonar Implant', 'Radio Communicator', 'Tech Upgraded (+1 Capacity) Popup Grenade Launcher x2'],
    specialRules: ['FBC Brimstone Coating: inmune al daño por fuego y no puede ser prendido en llamas (p. 106).'],
    loreDescription: 'Cuerpo ignífugo creado para combatir incendios, con herramientas de extinción basadas en CO2.',
    sourcePage: 96
  },
  {
    id: 'gm-dragoon',
    name: 'Militech Dragoon Revised War Platform',
    manufacturer: 'Militech',
    cost: 35000,
    costTier: 'Super Luxury',
    humanityLoss: '64 ([3d6/2 round up] + 18d6)',
    packageHlAverage: 64,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 16,
    statFloor: 6,
    baseArmorSp: 15,
    armorPenalty: 2,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Omega', 'Neural Link'],
    cyberwareHl: ['Anti-Dazzle x2', 'Chyron', 'Dragoon Plating', 'FBC EMP Coating x2', 'Internal Agent', 'Low Light/Infrared/UV x2', 'Reinforced Cyberlimb Upgrade x4', 'Subdermal Grip x2', 'Tuned Internal Hydraulics Upgrade'],
    specialRules: ['Dragoon Plating: SP 15 en cuerpo y cabeza con Armor Penalty -2 a REF, DEX y MOVE; se puede soltar con una Acción (p. 105).'],
    loreDescription: 'Revisión del cuerpo militar que ganó la 4ª Guerra Corporativa; el paquete de armas se vende aparte.',
    sourcePage: 98
  },
  {
    id: 'gm-eclipse',
    name: 'Militech Eclipse',
    manufacturer: 'Militech',
    cost: 29200,
    costTier: 'Luxury',
    humanityLoss: '67 ([2d6/2 round up] + 19d6)',
    packageHlAverage: 67,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 14,
    statFloor: 6,
    baseArmorSp: 11,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cyberleg x2', 'Cyberskull', 'Kiroshi MonoVision', 'Internal Linear Frame Beta', 'Neural Link'],
    cyberwareHl: ['Amplified Hearing', 'FBC Chameleon Coating x3', 'Grip Foot x2', 'Low Light/Infrared/UV', 'Radio Communicator', 'Scrambler/Descrambler', 'Subdermal Armor', 'Subdermal Pocket x2', 'Tech Upgraded (Oversized Weapon) Popup Melee Weapon (Kendachi Mono-Three)', 'Tuned Internal Hydraulics Upgrade'],
    specialRules: ['FBC Chameleon Coating x3: el camuflaje se activa tras 9 segundos (3 Rounds) inmóvil (p. 106).'],
    loreDescription: 'Cuerpo de sigilo de Militech, cuya existencia la corporación niega.',
    sourcePage: 98
  },
  {
    id: 'gm-enforcer',
    name: 'Militech Enforcer',
    manufacturer: 'Militech',
    cost: 16800,
    costTier: 'Very Expensive',
    humanityLoss: '53 ([3d6/2 round up] + 13d6)',
    packageHlAverage: 53,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 0,
    baseArmorSp: 13,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cyberleg x2', 'Cyberskull', 'Kiroshi MonoVision', 'Internal Linear Frame Sigma', 'Neural Link'],
    cyberwareHl: ['Anti-Dazzle', 'Audio Recorder', 'Heavy Subdermal Plating', 'Hidden Holster', 'Low Light/Infrared/UV', 'Popup Grenade Launcher', 'Popup Melee Weapon (Stun Baton)', 'Radio Communicator', 'Subdermal Grip', 'Targeting Scope', 'Voice Stress Analyzer'],
    specialRules: [],
    loreDescription: 'Cuerpo de seguridad y aplicación de la ley, pensado para aguantar situaciones activas.',
    sourcePage: 100
  },
  {
    id: 'gm-spyder-2',
    name: 'Militech Spyder 2.0',
    manufacturer: 'Militech',
    cost: 24900,
    costTier: 'Luxury',
    humanityLoss: '73 ([1d6/2 round up] + 22d6)',
    packageHlAverage: 73,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 14,
    statFloor: 6,
    baseArmorSp: 0,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x4', 'Cyberaudio Suite', 'Cyberleg x2', 'Cyberskull', 'Kiroshi MonoVision', 'Internal Linear Frame Beta', 'Neural Link'],
    cyberwareHl: ['Amplified Hearing', 'Artificial Shoulder Mount', 'Chipware Socket', 'FBC Chameleon Coating x1', 'Grapple Hand x4', 'Grip Foot x2', 'Image Enhance', 'Internal Agent', 'Low Light/Infrared/UV', 'Microvideo', 'Tactile Boost', 'TeleOptics', 'Tuned Internal Hydraulics Upgrade'],
    specialRules: [],
    loreDescription: 'Cuerpo de espionaje y operaciones encubiertas, con cuatro brazos.',
    sourcePage: 100
  },
  {
    id: 'gm-sheol',
    name: 'Moore Tech Sheol',
    manufacturer: 'Moore Technologies',
    cost: 19600,
    costTier: 'Very Expensive',
    humanityLoss: '32 ([1d6/2 round up] + 9d6)',
    packageHlAverage: 32,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 14,
    statFloor: 0,
    baseArmorSp: 13,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Beta', 'Neural Link'],
    cyberwareHl: ['Chemical Analyser', 'Chipware Socket', 'Chyron', 'Heavy Subdermal Plating', 'Internal Agent', 'Radiation Detector'],
    specialRules: [],
    loreDescription: 'Cuerpo de operaciones peligrosas, para entornos tóxicos o mortales.',
    sourcePage: 100
  },
  {
    id: 'gm-samson',
    name: 'NovelTech Samson',
    manufacturer: 'NovelTech',
    cost: 20500,
    costTier: 'Luxury',
    humanityLoss: '39 ([3d6/2 round up] + 10d6)',
    packageHlAverage: 39,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 16,
    statFloor: 0,
    baseArmorSp: 11,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Omega', 'Neural Link'],
    cyberwareHl: ['Anti-Dazzle x2', 'Chyron', 'Internal Agent', 'Radiation Detector', 'Subdermal Armor', 'Techscanner', 'Toolhand x2'],
    specialRules: [],
    loreDescription: 'El cuerpo industrial más resistente del mercado, para construcción y trabajo pesado.',
    sourcePage: 102
  },
  {
    id: 'gm-gemini',
    name: 'Raven Microcybernetics Gemini',
    manufacturer: 'Raven Microcybernetics',
    cost: 10200,
    costTier: 'Expensive',
    humanityLoss: '14 (4d6)',
    packageHlAverage: 14,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 0,
    baseArmorSp: 7,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'FBC Gemini Sculpt', 'Internal Linear Frame Sigma', 'Neural Link', 'Techhair', 'Shift Tacts'],
    cyberwareHl: ['Mr. Studd™ or Midnight Lady™ Sexual Implant', 'Skin Weave'],
    specialRules: ['FBC Gemini Sculpt: solo se distingue de un humano biológico con infrarrojo (p. 107).'],
    loreDescription: 'Cuerpo con apariencia de persona biológica; el más popular por ventas.',
    sourcePage: 102
  },
  {
    id: 'gm-wiseman',
    name: 'Raven Microcybernetics Wiseman',
    manufacturer: 'Raven Microcybernetics',
    cost: 27480,
    costTier: 'Luxury',
    humanityLoss: '70 ([3d6/2 round up] + 19d6)',
    packageHlAverage: 70,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 0,
    baseArmorSp: 0,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Sigma', 'Neural Link'],
    cyberwareHl: ['Chyron', 'Cyberdeck Cyberarm Option x4', 'FBC Integrated Bodyweight Coating x3', 'Internal Agent', 'Integrated Cyberdeck Upgrade x4', 'Virtuality x2'],
    specialRules: [
      'Hardware en FBC Bodyweight Coating: Hardened Circuitry, Insulated Wiring, KRASH Barrier, Snake Trap, Tech Upgraded Range Upgrade (10m Range).',
      'Excellent Quality Cyberdeck #1 (Cyberarm izquierdo): Armor, DeckKRASH, Hellbolt, Speedy Gonzalvez x2, Superglue, Sword x3, Worm x2.',
      'Microtech Warrior (Cyberarm izquierdo): Armor, Giant, Kraken x3.',
      'Excellent Quality Cyberdeck #2 (Cyberarm derecho): Eraser x9, Swifty Clean.',
      'Tech Upgraded (+1 slot) Raven Microcybernetics Kestrel 2 (Cyberarm derecho): Sabertooth x3, Speedy Gonzalvez x2, Worm x2.'
    ],
    loreDescription: 'Cuerpo de Netrunner con cyberdecks integrados en los brazos.',
    sourcePage: 103
  },
  {
    id: 'gm-alpha-class',
    name: 'Rocklin Augmentics Alpha Class',
    manufacturer: 'Rocklin Augmentics',
    cost: 9900,
    costTier: 'Expensive',
    humanityLoss: '21 (6d6)',
    packageHlAverage: 21,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 0,
    baseArmorSp: 11,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cybereye x2', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Sigma', 'Neural Link'],
    cyberwareHl: ['Interface Plugs', 'Subdermal Armor'],
    specialRules: ['Cuesta 9,900eb pero el GM debe tratarlo como Expensive (no Super Luxury) para determinar disponibilidad (p. 93).'],
    loreDescription: 'El cuerpo FBC por excelencia: modelo de entrada, asequible y probado.',
    sourcePage: 103
  },
  {
    id: 'gm-kildare',
    name: 'Trauma Team Kildare',
    manufacturer: 'Trauma Team',
    cost: 12200,
    costTier: 'Very Expensive',
    humanityLoss: '39 ([3d6/2 round up] + 10d6)',
    packageHlAverage: 39,
    install: 'Hospital (Requires Biosystem)',
    bodyOverride: 12,
    statFloor: 0,
    baseArmorSp: 0,
    armorPenalty: 0,
    cyberwareNoHl: ['Cyberarm x2', 'Cyberaudio Suite', 'Cyberleg x2', 'Cyberskull', 'Internal Linear Frame Sigma', 'Kiroshi MonoVision', 'Neural Link'],
    cyberwareHl: ['Amplified Hearing', 'Chyron', 'Image Enhance', 'Low Light/Infrared/UV', 'Medscanner', 'MicroOptics', 'Radio Communicator', 'Raven Microcybernetics MicroWaldo', 'Tech Upgraded Toolhand (installed Airhypo)', 'Techscanner'],
    specialRules: [],
    loreDescription: 'Cuerpo médico de Trauma Team, para cirujanos incansables.',
    sourcePage: 104
  }
];

export const FBC_13_BODIES: FbcBody[] = FBC_BODIES_RAW.map((b) => ({
  ...b,
  builtInCyberware: [...b.cyberwareNoHl, ...b.cyberwareHl]
}));

// ============================================================================
// 2. 20 CYBERWARE DE GOING METAL (pp. 104-109, tabla p. 111)
// ============================================================================

export const FBC_16_CYBERWARE: FbcCyberwareItem[] = [
  {
    id: 'gm-biosystem',
    name: 'Biosystem',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 10000,
    costTier: 'Super Luxury',
    description: 'Biopod integrado con el cerebro (y otras partes escogidas), sistemas informáticos y baterías. Blindado contra todo efecto EMP e inmune a la radiación. Fuera de un cuerpo FBC el usuario solo puede observar y comunicarse, y muere si lo sacan violentamente o pasa más de un minuto fuera tras la extracción. Instalarlo en un cuerpo requiere 4 horas y un Check de Cybertech o Surgery DV17. No admite instalar ciberware adicional directamente.',
    sourceBook: 'going_metal',
    sourcePage: 104
  },
  {
    id: 'gm-cyberskull',
    name: 'Cyberskull',
    type: 'Internal',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 5000,
    costTier: 'Luxury',
    description: 'Requiere 3 Option Slots. La cabeza deja de ser un punto débil x2 en Aimed Shot, y el usuario es inmune al efecto y daño adicional de Cracked Skull y Broken Jaw. Incluye una Faceplate personalizada; las adicionales cuestan 100eb (Premium).',
    sourceBook: 'going_metal',
    sourcePage: 105,
    slotsRequired: 3
  },
  {
    id: 'gm-dragoon-plating',
    name: 'Dragoon Plating',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 5000,
    costTier: 'Luxury',
    description: 'External Body Cyberware. Requiere BODY 16 o más salvo que el usuario sea FBC. Cuerpo y cabeza con SP 15 y Armor Penalty -2 a REF, DEX y MOVE. Se puede soltar con una Acción, o llamar un set suelto a menos de 6m/yds con una Acción. Se repara 1 SP al final de cada día en que no pierda SP. Sets adicionales: 1,000eb (Very Expensive); diseño y color a medida +100eb.',
    sourceBook: 'going_metal',
    sourcePage: 105
  },
  {
    id: 'gm-dragoon-plating-metalgear',
    name: 'Dragoon Plating, Metalgear',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 15000,
    costTier: 'Super Luxury',
    description: 'External Body Cyberware. Requiere BODY 16 o más salvo que el usuario sea FBC. Cuerpo y cabeza con SP 18 y Armor Penalty -3 a REF, DEX y MOVE. Se puede soltar o llamar como el Dragoon Plating (6m/yds). Se repara 1 SP al final de cada día en que no pierda SP. Sets adicionales: 5,000eb (Luxury); diseño y color a medida +100eb.',
    sourceBook: 'going_metal',
    sourcePage: 105
  },
  {
    id: 'gm-fbc-brimstone-coating',
    name: 'FBC Brimstone Coating',
    type: 'External',
    install: 'Hospital',
    humanityLoss: '2d6 (7)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Solo instalable en un FBC. El usuario es inmune al daño por fuego (incluida munición incendiaria y lanzallamas) y no puede ser prendido en llamas.',
    sourceBook: 'going_metal',
    sourcePage: 106,
    fbcOnly: true
  },
  {
    id: 'gm-fbc-chameleon-coating',
    name: 'FBC Chameleon Coating',
    type: 'External',
    install: 'Hospital',
    humanityLoss: '2d6 (7)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Solo instalable en un FBC. Tras 1 minuto (20 rounds) inmóvil, activa un camuflaje (sin Acción) que oculta de todos los sentidos visuales, incluido Low Light/Infrared/UV, salvo Perception DV17. Se desactiva si el usuario se mueve más de 2 m/yds en 3 segundos (1 Round). 2ª instalación: 30 segundos (10 Rounds); 3ª: 9 segundos (3 Rounds); más no hacen nada.',
    sourceBook: 'going_metal',
    sourcePage: 106,
    fbcOnly: true
  },
  {
    id: 'gm-fbc-emp-coating',
    name: 'FBC EMP Coating',
    type: 'External',
    install: 'Hospital',
    humanityLoss: '2d6 (7)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Solo instalable en un FBC. Cuando un solo efecto EMP dejaría inoperables una o más piezas de ciberware, una instalación de EMP Coating queda inoperable en su lugar. Varias instalaciones dan capas extra de protección.',
    sourceBook: 'going_metal',
    sourcePage: 106,
    fbcOnly: true
  },
  {
    id: 'gm-fbc-gemini-sculpt',
    name: 'FBC Gemini Sculpt',
    type: 'External',
    install: 'Hospital',
    humanityLoss: '0 (N/A)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Solo instalable en un FBC. Da forma humana base al cuerpo con una cubierta de Realskin; solo se detecta que no es humano con infrarrojo. FBC con Internal Linear Frame Omega o BODY 16 o más son demasiado grandes para el molde.',
    sourceBook: 'going_metal',
    sourcePage: 106,
    fbcOnly: true
  },
  {
    id: 'gm-fbc-integrated-bodyweight-coating',
    name: 'FBC Integrated Bodyweight Coating',
    type: 'External',
    install: 'Hospital',
    humanityLoss: '2d6 (7)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Solo instalable en un FBC. Instala 2 Cyberdeck option slots solo de hardware, compartidos por todos los Cyberdecks integrados en ciberware, que quedan conectados sin Interface Plugs. Solo se usa un Cyberdeck a la vez. Cada instalación adicional suma 2 slots compartidos. No se beneficia de un Bodyweight Suit mientras esté instalado.',
    sourceBook: 'going_metal',
    sourcePage: 107,
    fbcOnly: true
  },
  {
    id: 'gm-heavy-subdermal-plating',
    name: 'Heavy Subdermal Plating',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 5000,
    costTier: 'Luxury',
    description: 'External Body Cyberware, Subdermal Armor. Requiere BODY 10 salvo que el usuario sea FBC. Cuerpo y cabeza con SP 13. Armor Penalty -2 a REF, DEX y MOVE, anulado con BODY 14 o más o siendo FBC. Al completar un día de curación natural repara 1 SP en cuerpo y cabeza.',
    sourceBook: 'going_metal',
    sourcePage: 107
  },
  {
    id: 'gm-integrated-cyberdeck-upgrade',
    name: 'Integrated Cyberdeck Upgrade',
    type: 'Cyberlimb',
    install: 'Clinic',
    humanityLoss: '2d6 (7)',
    cost: 500,
    costTier: 'Expensive',
    description: 'Añade un slot extra (Programs o Hardware) a un Cyberdeck ya integrado en ciberware del mismo Cyberarm. Se puede instalar varias veces.',
    sourceBook: 'going_metal',
    sourcePage: 108
  },
  {
    id: 'gm-internal-hydraulics-upgrade',
    name: 'Internal Hydraulics Upgrade',
    type: 'Internal',
    install: 'Hospital',
    humanityLoss: '1d6 (3)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Solo en un FBC con Internal Linear Frame. REF, DEX y MOVE quedan en 4 salvo que ya sean mayores. Las Armor Penalties, Heridas Críticas, etc. aún pueden bajarlos.',
    sourceBook: 'going_metal',
    sourcePage: 107,
    fbcOnly: true
  },
  {
    id: 'gm-internal-hydraulics-upgrade-tuned',
    name: 'Internal Hydraulics Upgrade, Tuned',
    type: 'Internal',
    install: 'Hospital',
    humanityLoss: '1d6 (3)',
    cost: 5000,
    costTier: 'Luxury',
    description: 'Solo en un FBC con Internal Linear Frame. REF, DEX y MOVE quedan en 6 salvo que ya sean mayores. Las Armor Penalties, Heridas Críticas, etc. aún pueden bajarlos.',
    sourceBook: 'going_metal',
    sourcePage: 107,
    fbcOnly: true
  },
  {
    id: 'gm-internal-hydraulics-upgrade-perfected',
    name: 'Internal Hydraulics Upgrade, Perfected',
    type: 'Internal',
    install: 'Hospital',
    humanityLoss: '1d6 (3)',
    cost: 20000,
    costTier: 'Super Luxury',
    description: 'Solo en un FBC con Internal Linear Frame. REF, DEX y MOVE quedan en 8 salvo que ya sean mayores. Las Armor Penalties, Heridas Críticas, etc. aún pueden bajarlos.',
    sourceBook: 'going_metal',
    sourcePage: 108,
    fbcOnly: true
  },
  {
    id: 'gm-kiroshi-monovision',
    name: 'Kiroshi MonoVision',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 500,
    costTier: 'Expensive',
    description: 'Visor Cybereye artificial que reemplaza dos ojos con un solo cyberóptico gran angular. No se instala en un MultiOptic Mount. Tiene 3 slots para Cybereye Options, que cuentan como emparejadas. Si es la única fuente de visión y se sufre Lost Eye, su efecto, incluida la Base Death Save Penalty, se duplica.',
    sourceBook: 'going_metal',
    sourcePage: 109
  },
  {
    id: 'gm-linear-frame-omega-internal',
    name: 'Linear Frame Ω (Omega), Internal',
    type: 'Borgware x2',
    install: 'Hospital',
    humanityLoss: '8d6 (28)',
    cost: 10000,
    costTier: 'Super Luxury',
    description: 'El BODY sube a 16 (no a 17 o más) y esto cambia HP y Death Save. Requiere BODY 10 y 3 Grafted Muscle and Bone Lace. Una instalación cuenta como 2 Borgware para la depresión del máximo de Humanidad por terapia. En un FBC también ocupa el espacio de órganos.',
    sourceBook: 'going_metal',
    sourcePage: 108
  },
  {
    id: 'gm-prehensile-cyberfoot',
    name: 'Prehensile Cyberfoot',
    type: 'Cyberlimb',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Con una Acción, el Cyberleg opera como Cyberarm (el Cyberfoot pasa a ser Cyberhand); otra Acción lo revierte. Transformado, -4 a MOVE (mínimo 1) salvo en gravedad cero.',
    sourceBook: 'going_metal',
    sourcePage: 108
  },
  {
    id: 'gm-raven-microwaldo',
    name: 'Raven Microcybernetics MicroWaldo',
    type: 'Cyberlimb',
    install: 'Clinic',
    humanityLoss: '2d6 (7)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Cyberarm Option y Neuralware Option. Un Medtech que lo use gana +1 a los Checks de Surgery.',
    sourceBook: 'going_metal',
    sourcePage: 109
  },
  {
    id: 'gm-reinforced-cyberlimb-upgrade',
    name: 'Reinforced Cyberlimb Upgrade',
    type: 'Cyberlimb',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'El miembro es inmune a Broken Leg si es Cyberleg o a Broken Arm si es Cyberarm.',
    sourceBook: 'going_metal',
    sourcePage: 109
  },
  {
    id: 'gm-zero-gravity-thrusters',
    name: 'Zero Gravity Thrusters',
    type: 'Cyberlimb',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'En uso, anula los penalizadores de movimiento por gravedad cero. Usa tanques de combustible de 100eb cada uno, a reemplazar tras 24 horas de uso. Requiere dos Cyberlegs, ocupa 2 Option Slots y debe ir emparejado.',
    sourceBook: 'going_metal',
    sourcePage: 108,
    slotsRequired: 2
  }
];

// ============================================================================
// 3. EQUIPO NUEVO / REIMPRESO (pp. 105, 108-109, tabla p. 110)
// ============================================================================

export const GOING_METAL_FBC_GEAR: GoingMetalGearItem[] = [
  {
    id: 'gm-co2-grenade',
    name: 'CO2 Grenade',
    category: 'weapons',
    cost: 50,
    costTier: 'Costly',
    description: 'Munición de granada (Grenades Only). No hace daño: apaga todo el fuego dentro del área de la explosión. Se lanza o se carga en un Grenade Launcher; cualquier arma que dispare Smoke Grenades puede disparar CO2 Grenades.',
    sourceBook: 'going_metal',
    sourcePage: 105
  },
  {
    id: 'gm-linear-frame-omega-external',
    name: 'Linear Frame Ω (Omega), External',
    category: 'gear',
    cost: 10000,
    costTier: 'Super Luxury',
    description: 'Exoesqueleto motorizado. El BODY sube a 16 mientras el usuario está conectado (no a 17 o más). No aumenta HP ni cambia el Death Save. Requiere 3 instalaciones de Interface Plugs para operar.',
    sourceBook: 'going_metal',
    sourcePage: 108,
    stats: { bodyOverride: 16, interfacePlugsRequired: 3 }
  },
  {
    id: 'gm-microtech-warrior',
    name: 'Microtech Warrior',
    category: 'gear',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Cyberdeck de 7 slots que solo admite Programs. Tras Jack In, el usuario puede activar un Armor Program instalado sin gastar NET Action.',
    sourceBook: 'going_metal',
    sourcePage: 109,
    stats: { slots: 7, slotsHold: 'Programs' }
  },
  {
    id: 'gm-raven-kestrel-2',
    name: 'Raven Microcybernetics Kestrel 2',
    category: 'gear',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Cyberdeck de 7 slots que solo admite Programs. Tras Jack In, el usuario puede activar hasta 2 Programs Speedy Gonzalvez instalados sin gastar NET Action.',
    sourceBook: 'going_metal',
    sourcePage: 109,
    stats: { slots: 7, slotsHold: 'Programs' }
  },
  {
    id: 'gm-snaketrap',
    name: 'Snaketrap',
    category: 'gear',
    cost: 500,
    costTier: 'Expensive',
    description: 'Hardware de Cyberdeck. Mientras esté instalado, evita el primer efecto de Black ICE o Program durante un netrun que destruiría un Program al azar del deck. Varias instalaciones no hacen nada.',
    sourceBook: 'going_metal',
    sourcePage: 109
  },
  {
    id: 'gm-swifty-clean',
    name: 'Swifty Clean',
    category: 'gear',
    cost: 500,
    costTier: 'Expensive',
    description: 'Hardware de Cyberdeck. Permite hacer la Interface Ability Cloak dos veces con una NET Action, tomando el mejor resultado; pero Cloak solo se puede usar una vez por Netrun. Ocupa 2 Hardware Option Slots.',
    sourceBook: 'going_metal',
    sourcePage: 109,
    stats: { hardwareSlots: 2 }
  }
];

// Alias compatible con el nombre previo del export.
export const GOING_METAL_GEAR: GoingMetalGearItem[] = GOING_METAL_FBC_GEAR;

// ============================================================================
// 4. GUÍA "ABOUT FBCs" (pp. 92-96, 104-105)
// ============================================================================

export const ABOUT_FBCS_GUIDE: AboutFbcsGuide = {
  title: 'GOING METAL // FULL BODY CONVERSIONS (FBC)',
  subtitle: 'Reglas de conversión, Biosystem y cuerpos FBC (Going Metal pp. 91-111)',
  summary: 'Un FBC es un cerebro humano dentro de un cuerpo cibernético: un paquete de ciberware montado sobre un Internal Linear Frame, en el que se instala un Biosystem. El procedimiento es permanente; el costo en Eurobucks y Humanidad del Biosystem es aparte del cuerpo.',
  corePrinciples: [
    {
      ruleName: 'Conversión y Humanidad (p. 93)',
      description: 'La mayoría de cirujanos exigen quitar todo el ciberware no médico, incluido Neuralware, y hacer terapia antes de la cirugía del Biosystem. Si instalas ciberware viejo en el cuerpo FBC sin desinstalarlo antes ni hacer terapia, la Humanidad perdida se arrastra; si no, cuenta como instalación nueva. Al instalarte en el cuerpo pierdes la Humanidad del paquete, pudiendo tomar el promedio.',
      mechanicalImpact: 'HL = Biosystem 4d6 (14) + HL del paquete del cuerpo; siempre se puede elegir el promedio.'
    },
    {
      ruleName: 'Baselines de FBC (p. 93)',
      description: 'Skills y los STATS INT, COOL, TECH, WILL, LUCK y EMP se conservan. BODY, Hit Points y Death Save dependen del cuerpo. REF, DEX y MOVE pueden cambiar según el ciberware instalado.',
      mechanicalImpact: 'BODY/HP/Death Save = los del cuerpo; REF/DEX/MOVE según hidráulica y ciberware.'
    },
    {
      ruleName: 'Ciberware sin HL (p. 93)',
      description: 'Al instalarse en un FBC, Cyberarm, Cyberaudio Suite, Cybereye, Cyberleg, Cyberskull, Internal Linear Frame y Neural Link/Neuroport causan 0 (N/A) HL y no bajan el máximo de Humanidad recuperable con terapia.',
      mechanicalImpact: 'Esas piezas no suman HL ni depresión de Humanidad máxima.'
    },
    {
      ruleName: 'Slots y requisitos (p. 93)',
      description: 'Se duplican los option slots que dan el ciberware fundacional y las categorías Internal/External Body Cyberware. Un usuario en un FBC cumple los requisitos de Grafted Muscle and Bone Lace aunque no estén instalados.',
      mechanicalImpact: 'Option slots x2; Grafted Muscle and Bone Lace siempre cumplido.'
    },
    {
      ruleName: 'Daño y curación natural (pp. 93-94)',
      description: 'El daño va al cuerpo FBC, no al usuario. Con un Lifestyle de Good Prepack (600eb/mes) o mejor, al completar un día de curación natural en el cuerpo recupera HP igual a su BODY. Un cuerpo vacío recupera por día HP igual al BODY que tendría el usuario dentro.',
      mechanicalImpact: 'Curación natural diaria = BODY (requiere Good Prepack o mejor).'
    },
    {
      ruleName: 'Heridas Críticas (p. 94)',
      description: 'En un cuerpo FBC eres inmune al efecto y al daño adicional de Broken Jaw, Collapsed Lung, Concussion, Cracked Skull, Crushed Windpipe, Lost Ear, Spinal Injury, Torn Muscle y Whiplash. Si una saliera, se ignora por completo y no se vuelve a tirar.',
      mechanicalImpact: 'Ignorar esas 9 Heridas Críticas y su daño adicional.'
    },
    {
      ruleName: 'Wound States (p. 94)',
      description: 'En un cuerpo FBC eres inmune a los penalizadores de Check y STAT de todos los Wound States. Otros efectos, como los Death Saves, siguen aplicando.',
      mechanicalImpact: 'Sin penalizadores de Wound State; Death Saves normales.'
    },
    {
      ruleName: 'Inmunidades (p. 94)',
      description: 'Inmune a enfermedades, venenos, fármacos y drogas callejeras salvo que se administren con Airhypo directo al puerto de acceso del Biosystem (imposible contra tu voluntad salvo que estés inmovilizado o incapacitado). Inmune a la radiación, no necesitas respirar, comer ni beber.',
      mechanicalImpact: 'Ver FBC_IMMUNITIES.'
    },
    {
      ruleName: 'Glucose-Rich Brain Solution (p. 94)',
      description: 'Hay que inyectar una Glucose-Rich Brain Solution (100eb, Premium) al Biosystem por el puerto de acceso una vez al mes; va gratis en el Lifestyle Good Prepack. Sin ella un mes estás starving (-2 a todos los Checks); dos meses seguidos, el sistema biológico colapsa y mueres.',
      mechanicalImpact: '1 mes sin solución: -2 a todos los Checks. 2 meses: muerte.'
    },
    {
      ruleName: 'Ayudas de curación y sueño (p. 94)',
      description: 'Cryobags, Cryotanks y Speedheal no funcionan en un usuario FBC. Un FBC necesita dormir, pero es inmune a los penalizadores por dormir incómodo o vivir hacinado. Los sentidos de tacto, olfato y gusto son simulados y se pueden apagar sin Acción; un FBC puede comer y beber.',
      mechanicalImpact: 'Cryobags/Cryotanks/Speedheal inútiles en FBC.'
    },
    {
      ruleName: 'Biosystem (p. 104)',
      description: 'Resistente a todos los efectos EMP e inmune a la radiación. Fuera de un cuerpo, su carcasa es Cover (25HP) y el cerebro muere si lo golpean directamente. Un Biosystem implantado en un cuerpo no se puede apuntar. Sin cuerpo, el usuario solo puede observar y comunicarse y no puede defenderse.',
      mechanicalImpact: 'Biosystem no seleccionable como objetivo dentro de un cuerpo FBC.'
    },
    {
      ruleName: 'Techs y FBCs (p. 96)',
      description: 'Un Tech arma un cuerpo FBC reuniendo los componentes mínimos: Cyberarm x2, Cyberaudio Suite, Cybereye x2, Cyberleg x2, Cyberskull, Internal Linear Frame y Neural Link/Neuroport (con sustituciones apropiadas, p. ej. Kiroshi MonoVision por Cybereye x2). No se puede usar ciberware de grado médico. Las mejoras se aplican a cada componente, no al cuerpo entero.',
      mechanicalImpact: 'Ensamblaje con Cybertech DV29, 1 hora; no destruye componentes al fallar.'
    },
    {
      ruleName: 'EMP y FBCs (p. 96)',
      description: 'Ante efectos EMP, como los de un Microwaver, el cuerpo FBC se trata como un conjunto de piezas, no como un todo. Un EMP no apaga el cuerpo entero, solo componentes individuales de ciberware.',
      mechanicalImpact: 'EMP afecta piezas sueltas, no el cuerpo completo.'
    },
    {
      ruleName: 'Disponibilidad con el Fixer (p. 93)',
      description: 'El costo en Eurobucks y la categoría de precio pueden diferir en disponibilidad. Ejemplo del libro: el Alpha Class (9,900eb) se trata como Expensive y no como Super Luxury para determinar su disponibilidad.',
      mechanicalImpact: 'Usar la categoría de disponibilidad, no la del precio.'
    }
  ],
  conversionSteps: [
    { step: 1, title: 'Preparación', detail: 'Se retira el ciberware no médico (incluido Neuralware) y se hace terapia para prepararse al shock de Humanidad (p. 93).' },
    { step: 2, title: 'Cirugía del Biosystem', detail: 'El cerebro (y otras partes escogidas) pasa a un Biosystem. Costo 10,000eb (Super Luxury), HL 4d6 (14). El cuerpo meat se descompone si no se conserva criogénicamente (pp. 93, 104).' },
    { step: 3, title: 'Terapia intermedia (opcional)', detail: 'Con el Biosystem aún sin cuerpo, se puede hacer terapia (por ejemplo Braindance) para recuperar Humanidad antes de implantarse (p. 95).' },
    { step: 4, title: 'Instalación en el cuerpo', detail: 'Se implanta el Biosystem en el cuerpo FBC elegido (la instalación está incluida en el precio). Se sufre el HL del paquete, tirado o promedio (p. 93).' },
    { step: 5, title: 'Terapia posterior', detail: 'La Humanidad se recupera con terapia hasta el máximo permitido por el ciberware instalado que causa HL (p. 95).' }
  ],
  medicalAndRepairRules: [
    { topic: 'Reparar un cuerpo FBC a HP máximo (4 horas)', skill: 'Cybertech', dv: 15, effect: 'Requiere Lifestyle Good Prepack o mejor. Un fallo gasta las 4 horas y deja el HP en la mitad del máximo, salvo que el HP actual sea mayor. Un FBC puede repararse a sí mismo (p. 94).' },
    { topic: 'Cambiar de cuerpo FBC / instalar Biosystem (4 horas)', skill: 'Cybertech o Surgery', dv: 17, effect: 'Se puede reintentar sin límite, sin dañar al ocupante al fallar. Al cambiar, el ciberware del cuerpo anterior se desinstala (salvo el Biosystem) y se instala el del nuevo. Al transferirse, el HP queda al máximo del cuerpo nuevo (pp. 94, 105).' },
    { topic: 'Ensamblar un cuerpo FBC (1 hora)', skill: 'Cybertech', dv: 29, effect: 'Un Tech arma el cuerpo con sus componentes; un fallo no destruye los componentes (p. 96).' }
  ],
  tacticalProsAndCons: {
    pros: [
      'Inmune a 9 Heridas Críticas, a los penalizadores de Wound States, a enfermedades, venenos, drogas y radiación.',
      'No necesita respirar, comer ni beber.',
      'Curación natural diaria igual a su BODY y reparación completa con Cybertech DV15.',
      'Option slots duplicados y sin HL para el ciberware base del cuerpo.',
      'Puede cambiar de cuerpo con Cybertech o Surgery DV17.'
    ],
    cons: [
      'El procedimiento es permanente y el cuerpo meat se pierde para siempre.',
      'HL alto: Biosystem 4d6 más el paquete del cuerpo.',
      'Necesita una Glucose-Rich Brain Solution al mes o muere en dos.',
      'Cryobags, Cryotanks y Speedheal no funcionan.',
      'Un Biosystem sin cuerpo no puede actuar ni defenderse y muere si pasa más de un minuto fuera tras la extracción.',
      'No se puede instalar ciberware directamente en el Biosystem, solo en un cuerpo.'
    ]
  }
};
