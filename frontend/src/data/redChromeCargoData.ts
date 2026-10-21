/**
 * RED CHROME CARGO // ONESHOT CANÓNICO OFICIAL CYBERPUNK RED
 * Fuente: aventura "Red Chrome Cargo" (Screamsheet, 4 págs.). Las páginas citadas son las del PDF de la aventura;
 * las referencias al Core van en página impresa.
 * [Claude Code · 2026-10-22] Contenido reescrito solo con lo que dice el libro (auditoría canon v4.7.0).
 * Los PNJ usan los bloques del Core (Boosterganger p.412, Security Operative p.413, Automated Turret p.214).
 */

import type { EnemySheet, EnemyWeaponProfile } from './enemiesCatalog';
import type { NetArchitecturePreset } from './netAndRolesData';
import { BLACK_ICE_STATS } from './netAndRolesData';
import type { StatKey } from '../types/cyberpunk';

// ============================================================================
// 1. SCREAMSHEET: NIGHT CITY TODAY NEWS (PÁGINA 2)
// ============================================================================

export interface ScreamsheetData {
  newspaperTitle: string;
  time: string;
  headline: string;
  byline: string;
  paragraphsEs: string[];
  paragraphsEn: string[];
  links: string[];
  adBanner: {
    brand: string;
    slogan: string;
    description: string;
  };
}

export const RED_CHROME_SCREAMSHEET: ScreamsheetData = {
  newspaperTitle: 'NIGHT CITY TODAY NEWS',
  time: '9:37 AM',
  headline: 'Gang War Erupts in Combat Zone // Guerra de Pandillas Estalla en la Zona de Combate',
  byline: 'Por Jericho Hunt',
  paragraphsEs: [
    'Hoy, el sector norte de la Zona de Combate cayó en el caos: la tensión entre los Iron Sights y la Red Chrome Legion estalló en un conflicto a gran escala. Volaron balas y rippers cortaron carne mientras ambas pandillas descargaban meses de hostilidad contra la otra y contra cualquier vecino de Night City que se cruzara en su camino. El NCPD ya está en la zona intentando frenar la violencia, pero la presencia de varios full-body conversions ha obligado a intervenir a la C-SWAT. Se da por hecho que el conflicto se desbordará más allá de la Zona de Combate.',
    'Night City Today se pregunta qué hay detrás de esta matanza: si es algo más que fronteras mal definidas y palabras inflamadas, o si es obra de un actor externo en las sombras.',
    'Es fácil suponer que todo nace de las escaramuzas territoriales de los últimos años, desde que la Legion empezó a reclutar jóvenes en territorio tradicional de los Iron Sights. Tras la caída de Arasaka en la 4ª Guerra Corporativa, los Iron Sights (respaldados por corporaciones) perdieron gran parte de su influencia y la Legion, entre otras pandillas, puso la mira en ellos. La Legion es conocida por aplastar pandillas rivales, anexar su territorio y adoctrinar a los más jóvenes en su grupo neofascista, pero los combates recientes indican que los Iron Sights son ahora el agresor. Los reporteros de Night City Today encontraron una pista sobre el motivo.',
    'Los Iron Sights, compuestos casi por completo de full-body conversions e individuos muy aumentados al borde de la ciberpsicosis o ya en ella, perdieron influencia y territorio durante el Time of the Red, pero en los últimos años han vuelto con fuerza. Se atribuía el aumento de miembros a ciberpsicóticos que no lograron reintegrarse a la sociedad. Sin embargo, de incógnito en una estación de tren operada por Nómadas en las afueras de la ciudad, Jericho Hunt presenció un intercambio entre afiliados conocidos de los Iron Sights y una misteriosa cábala de hombres de traje negro. El intercambio dejó a los Iron Sights varias cajas de equipo militar reciente, claramente procedente de un Midnight Market. Los Iron Sights parecen contar con un nuevo benefactor.',
    'Pocos días después del intercambio, el NCPD informó de un ataque de la Red Chrome Legion contra un camión sin marcas que entraba en la ciudad, sin duda con un nuevo cargamento de la cábala. Hunt cree que el último giro de la guerra es una venganza de los Iron Sights, que buscan destruir a la Legion y recuperar lo que les robaron.'
  ],
  paragraphsEn: [
    'Earlier today the northern Combat Zone was thrown into chaos as tension between the Iron Sights and the Red Chrome Legion exploded into a full-scale conflict, with both gangs taking months of hostility out on each other and on any Night City resident caught in the way. NCPD is on scene, but multiple full-body conversions have required C-SWAT to be called in. The conflict is expected to spill beyond the Combat Zone.',
    'Night City Today asks what lies behind the bloodbath: more than ill-defined borders and inflammatory words, perhaps a shadowy outside player.',
    'It is easy to assume the conflict comes from territory skirmishes over recent years, since the Legion began recruiting junior members in traditional Iron Sights territory. After Arasaka fell in the 4th Corporate War, the Corp-backed Iron Sights lost much of their influence and the Legion, among other gangs, set its sights on them. The Legion is known for crushing rival gangs, annexing their territory and indoctrinating young members into its neo-fascist group, yet recent fighting shows the Iron Sights acting as the aggressor. Reporters found a lead on why.',
    'The Iron Sights, almost entirely full-body conversions and heavily augmented people on the edge of (or in the grip of) cyberpsychosis, lost influence during the Time of the Red but have recently made a comeback. Their growth was credited to cyberpsychotics who failed to reintegrate into society. Undercover at a Nomad-run train station outside the city, Jericho Hunt witnessed a handoff between known Iron Sights affiliates and a mysterious cabal of men in black suits: several cases of recent military hardware sourced from a Midnight Market. The Iron Sights seem to have a new benefactor.',
    'Days later, NCPD reported a Red Chrome Legion attack on an unmarked truck entering the city, no doubt carrying a new shipment from the cabal. Hunt believes the latest turn in the war is Iron Sights revenge, seeking to destroy the Legion and take back what was stolen.'
  ],
  links: [
    'Link: Iron Sights Get New Guns',
    'Link: Night City Gang Landscape Breakdown',
    'Link: Third Trucking Hijack This Week'
  ],
  adBanner: {
    brand: 'ZHIRAFA // GRAF 3',
    slogan: 'HAUL ANYTHING.',
    description: 'Anuncio ilustrado de la screamsheet: dron cuadrúpedo GRAF 3 de Zhirafa (Zhirafa Strategic Manufacturers).'
  }
};

// ============================================================================
// 2. BRIEFING DE HORNET & NOTAS SECRETAS DEL GM (PÁGINA 3)
// ============================================================================

export interface RedChromeBriefingData {
  playerBriefing: {
    fixerName: string;
    fixerSource: string;
    payoutPerPlayer: number;
    targetGang: string;
    targetGangSource: string;
    missionGoal: string;
    cargoDescription: string;
    trainName: string;
    trainType: string;
    destination: string;
    transitMethod: string;
  };
  gmSecretNotes: {
    cratesOneToThreeContent: string;
    crateFourContent: string;
    toxicChemicalEffect: string;
    whyUnopened: string;
    factionTies: string;
  };
}

export const RED_CHROME_BRIEFING: RedChromeBriefingData = {
  playerBriefing: {
    fixerName: 'Hornet',
    fixerSource: 'CPRED pág. 305',
    payoutPerPlayer: 2000,
    targetGang: 'Red Chrome Legion',
    targetGangSource: 'CPRED pág. 309',
    missionGoal: 'Recuperar el envío de 4 cajas grandes robado por la Red Chrome Legion y entregárselo a Hornet para cobrar 2,000 €$ cada uno (p. 3).',
    cargoDescription: '4 cajas grandes con cerraduras codificadas por ADN. Hornet no dijo qué contienen; solo que se transporten con mucho cuidado.',
    trainName: 'The Hammerhead',
    trainType: 'Tren de carga Militech fuertemente blindado, secuestrado por la pandilla',
    destination: 'Una instalación de la Red Chrome Legion fuera de la ciudad (nota del GM: un pueblo abandonado en las afueras del norte de Night City).',
    transitMethod: 'Hornet organiza el paso en su propio tren, que corre en paralelo al de la Legion; los PJs saltan desde el techo del tren de Hornet al tren de la Legion (Athletics DV13).'
  },
  gmSecretNotes: {
    cratesOneToThreeContent: 'Tres de los contenedores están llenos de explosivos de grado militar y cyberware originalmente destinados a los Iron Sights (CPRED pág. 308).',
    crateFourContent: 'El último contenedor guarda varios canisters de una neurotoxina mortal ideada por el propio Hornet.',
    toxicChemicalEffect: 'La aventura no da reglas de exposición ni de efecto de la neurotoxina; si los canisters se abren, el GM decide.',
    whyUnopened: 'La Legion robó los contenedores, pero las cerraduras codificadas por ADN y las gruesas paredes metálicas resultaron demasiado difíciles de abrir sin dañar el contenido. El envío va a un pueblo abandonado en las afueras del norte de Night City, donde un Tech de la Legion puede romper las cerraduras.',
    factionTies: 'La neurotoxina se compró a precio alto como as bajo la manga de los Iron Sights contra la Legion y cualquier otra pandilla problemática. Si los PJs entregan los contenedores, al final de la semana la guerra en el norte de la Zona de Combate termina cuando los Iron Sights usan su nuevo envío de tecnología y veneno para aplastar a la Legion.'
  }
};

// ============================================================================
// 3. PRUEBAS DE HABILIDAD CANÓNICAS // SKILL CHECKS (PÁGINA 3)
// ============================================================================

export interface RedChromeSkillCheck {
  id: string;
  title: string;
  skill: string;
  stat: StatKey;
  dv: number;
  formula: string;
  successDesc: string;
  failureDesc: string;
  mechanicalImpact: string;
  page?: number;
}

export const RED_CHROME_SKILL_CHECKS: RedChromeSkillCheck[] = [
  {
    id: 'jump_train',
    title: 'Saltar al Tren de la Legion',
    skill: 'Athletics',
    stat: 'DEX',
    dv: 13,
    formula: 'DEX + Athletics + 1d10 vs DV 13',
    successDesc: 'Saltas desde el techo del tren de Hornet y aterrizas en el tren de la Legion.',
    failureDesc: 'Caes corto y chocas contra el costado del vagón trasero. Logras agarrarte y no caes al suelo, pero la colisión alerta a los guardias del interior.',
    mechanicalImpact: 'Un fallo alerta a los guardias (isTrainAlerted = true); con guardias alertados, la torreta del vagón delantero está activa.',
    page: 3
  },
  {
    id: 'open_hatch',
    title: 'Abrir la Escotilla del Techo',
    skill: 'Basic Tech',
    stat: 'TECH',
    dv: 13,
    formula: 'TECH + Basic Tech + 1d10 vs DV 13',
    successDesc: 'Abres la escotilla de mantenimiento del techo del vagón trasero y accedes al interior del tren.',
    failureDesc: 'La aventura no especifica la consecuencia del fallo.',
    mechanicalImpact: 'Da acceso al interior del vagón trasero.',
    page: 3
  },
  {
    id: 'stop_train',
    title: 'Detener el Hammerhead',
    skill: 'Drive Land Vehicle',
    stat: 'REF',
    dv: 9,
    formula: 'REF + Drive Land Vehicle + 1d10 vs DV 9',
    successDesc: 'Desde los controles del vagón del conductor detienes el Hammerhead, que normalmente es automático.',
    failureDesc: 'La aventura no especifica la consecuencia del fallo.',
    mechanicalImpact: 'Alternativa a salir por donde entraron y saltar de vuelta al tren de Hornet.',
    page: 3
  },
  {
    id: 'leap_with_crate',
    title: 'Saltar de Vuelta Cargando una Caja',
    skill: 'Athletics',
    stat: 'DEX',
    dv: 15,
    formula: 'DEX + Athletics + 1d10 vs DV 15 (la caja requiere dos manos)',
    successDesc: 'Saltas de vuelta al tren de Hornet cargando una caja.',
    failureDesc: 'La aventura no especifica la consecuencia del fallo.',
    mechanicalImpact: 'Cada caja la carga un solo PJ y requiere dos manos.',
    page: 3
  },
  {
    id: 'throw_crate',
    title: 'Lanzar una Caja al Otro Tren',
    skill: 'Athletics',
    stat: 'DEX',
    dv: 13,
    formula: 'DEX + Athletics + 1d10 vs DV 13',
    successDesc: 'Lanzas el contenedor al otro tren (el de Hornet).',
    failureDesc: 'La aventura no especifica la consecuencia del fallo.',
    mechanicalImpact: 'Alternativa a cruzar saltando con la caja en brazos (DV 15).',
    page: 3
  }
];

// ============================================================================
// 4. ARQUITECTURA NET: HAMMERHEAD MAINFRAME (5 PISOS, PÁGINA 3)
// ============================================================================

export const HAMMERHEAD_MAINFRAME_NET: NetArchitecturePreset = {
  id: 'net-hammerhead-mainframe',
  name: 'Hammerhead Cargo Train Mainframe (Red Chrome Cargo, 5 Pisos)',
  difficulty: 'Standard',
  totalFloors: 5,
  loreDescription: 'Mainframe del tren de carga Hammerhead (tabla "HammerHead mainframe", p. 3). Se accede mediante el puerto de mantenimiento del vagón central (Middle Car).',
  floors: [
    {
      floorNumber: 1,
      type: 'Password',
      name: 'Password',
      dv: 6
    },
    {
      floorNumber: 2,
      type: 'File',
      name: 'File: Cargo Manifest original del Hammerhead',
      dv: 8,
      rewardOrDevice: 'Lista de todo lo que había a bordo cuando la Legion secuestró el tren; el GM puede dar equipo nuevo o ganchos de trama con ella.'
    },
    {
      floorNumber: 3,
      type: 'Password',
      name: 'Password',
      dv: 8
    },
    {
      floorNumber: 4,
      type: 'Black ICE',
      name: 'Hellhound (Black ICE)',
      iceType: 'Hellhound',
      iceHp: BLACK_ICE_STATS.Hellhound.rez,
      iceAtk: BLACK_ICE_STATS.Hellhound.atk,
      iceDef: BLACK_ICE_STATS.Hellhound.def,
      rewardOrDevice: 'Stats del Core (Black ICE, p. 206): PER 6, SPD 6, ATK 6, DEF 2, REZ 20. 2d6 de daño directo al cerebro del Netrunner; si no está aislado, su Cyberdeck y su ropa se incendian (2 daño a HP al terminar cada turno hasta gastar una Meat Action en apagarse).'
    },
    {
      floorNumber: 5,
      type: 'Control Node',
      name: 'Control Node: controla la Automated Turret',
      dv: 8,
      rewardOrDevice: 'Permite conocer la torreta del vagón siguiente y tomar su control.'
    }
  ]
};

// ============================================================================
// 5. PERFILES DE ENEMIGOS: DUAL VARIANT (2045 ORIGINAL + 2077 CEMK)
// ============================================================================

export interface RedChromeSpawnRule {
  formula: string;
  byPartySize: Record<number, { rearCar: number; middleCar: number; frontCar: number; driverCar: number; total: number }>;
  defaultRearCount: number;
  defaultFrontCount: number;
  alertedBehavior: string;
  notes: string;
}

export interface RedChromeArmorDetail {
  headName: string;
  headSp: number;
  bodyName: string;
  bodySp: number;
  notes: string;
  shieldHp?: number;
}

export interface RedChromeWeaponProfile extends EnemyWeaponProfile {
  category?: 'pistol' | 'shotgun' | 'rifle' | 'heavy' | 'melee' | 'exotic' | 'turret';
  weaponType2077?: 'Power' | 'Tech' | 'Smart' | 'Melee' | 'Automated';
  ammoType?: string;
  currentAmmo?: number;
  criticalHitBonus?: string;
  armorPiercing?: boolean;
  specialFeatures?: string[];
}

export interface RedChromeQuickhackVulnerability {
  hackName: string;
  dv: number;
  costRam?: number;
  targetEffect: string;
  lucyKiwiSpecial?: string;
}

export interface RedChromeCyberwarePiece {
  name: string;
  slot: 'Neural' | 'Optics' | 'Internal' | 'External' | 'Cyberarm' | 'Cyberleg' | 'Skeleton' | 'Hardware';
  effect: string;
  quickhackVulnerability?: RedChromeQuickhackVulnerability;
}

export interface RedChromeLootItem {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'ammo' | 'eb' | 'cyberware' | 'gear' | 'shard';
  quantity: number;
  valueEb: number; // Valor canónico en Eurodólares (€$)
  description: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'exotic';
  dropChance?: string;
  harvestDifficultyDv?: number; // Para cyberware extraíble con Cybertech o Surgery
}

export interface RedChromeEnemySheet extends EnemySheet {
  armorHead?: string;
  armorBody?: string;
  roleRank?: number;
  armorDetail?: RedChromeArmorDetail;
  weapons: RedChromeWeaponProfile[];
  cyberwareDetailed?: RedChromeCyberwarePiece[];
  lootDrops?: RedChromeLootItem[];
}

export interface RedChromeDualEnemyProfile {
  id: string;
  name: string;
  role: string;
  placement: string;
  notes: string;
  spawnRules?: RedChromeSpawnRule;
  lootDrops?: RedChromeLootItem[];
  variant2045: RedChromeEnemySheet;
  variant2077Cemk: RedChromeEnemySheet;
}

// --- Boosterganger (Core p.412, errata v1.25) + Shotgun (RCC p.3) ---
const RCL_GUARD_2045: RedChromeEnemySheet = {
  id: 'rcc-shotgun-guard-2045',
  name: 'Red Chrome Legion Guard (2045)',
  subtitle: 'Boosterganger del Core (p. 412) + Shotgun',
  faction: 'Red Chrome Legion',
  threatTier: 'mook',
  sourceBook: 'core',
  sourceBookTitle: 'Core Rulebook p.412 // Red Chrome Cargo p.3',
  era: '2045',
  role: 'Mook',
  hp: 20,
  seriouslyWounded: 10,
  deathSave: 2,
  headSp: 4,
  bodySp: 4,
  armorDetail: {
    headName: 'Leather (SP 4)',
    headSp: 4,
    bodyName: 'Leather (SP 4)',
    bodySp: 4,
    notes: 'Armadura del bloque Boosterganger del Core.'
  },
  stats: {
    INT: 2,
    REF: 6,
    DEX: 5,
    TECH: 2,
    COOL: 4,
    WILL: 2,
    LUCK: 0,
    MOVE: 4,
    BODY: 2,
    EMP: 3
  },
  combatBases: [
    { label: 'Handgun (Poor Quality Very Heavy Pistol)', totalBase: 12, damage: '4d6', rof: 1 },
    { label: 'Melee Weapon (Rippers)', totalBase: 11, damage: '2d6', rof: 2 },
    { label: 'Brawling', totalBase: 9 },
    { label: 'Evasion', totalBase: 7 }
  ],
  weapons: [
    {
      name: 'Shotgun',
      skillBase: 5,
      damage: '5d6',
      rof: 1,
      mag: 4,
      category: 'shotgun',
      notes: 'Añadida por la aventura (p. 3: "Add Shotgun"). El bloque Boosterganger no trae Shoulder Arms; se usa DEX 5 (nivel 0).'
    },
    {
      name: 'Poor Quality Very Heavy Pistol',
      skillBase: 12,
      damage: '4d6',
      rof: 1,
      mag: 8,
      category: 'pistol',
      notes: 'Calidad Poor (Core p. 412).'
    },
    {
      name: 'Rippers',
      skillBase: 11,
      damage: '2d6',
      rof: 2,
      mag: 0,
      category: 'melee'
    }
  ],
  armorHead: 'Leather (SP 4)',
  armorBody: 'Leather (SP 4)',
  cyberware: ['Rippers', 'Techhair'],
  gear: ['Very Heavy Pistol Ammo x30', 'Disposable Cellphone'],
  specialRules: [
    'Mook (Core p. 412, errata v1.25: BODY 2, Death Save 2).'
  ],
  loreSummary: 'Guardia de la Red Chrome Legion: Boosterganger del Core con Shotgun añadida.',
  sourcePage: 412
};

// --- Security Operative (Core p.413), sin modificaciones ---
const RCL_OFFICER_2045: RedChromeEnemySheet = {
  id: 'rcc-officer-2045',
  name: 'Red Chrome Legion Officer (2045)',
  subtitle: 'Security Operative del Core (p. 413), sin modificaciones',
  faction: 'Red Chrome Legion',
  threatTier: 'mook',
  sourceBook: 'core',
  sourceBookTitle: 'Core Rulebook p.413 // Red Chrome Cargo p.3',
  era: '2045',
  role: 'Mook',
  hp: 30,
  seriouslyWounded: 15,
  deathSave: 5,
  headSp: 7,
  bodySp: 7,
  armorDetail: {
    headName: 'Kevlar (SP 7)',
    headSp: 7,
    bodyName: 'Kevlar (SP 7)',
    bodySp: 7,
    notes: 'Armadura del bloque Security Operative del Core.'
  },
  stats: {
    INT: 3,
    REF: 7,
    DEX: 4,
    TECH: 2,
    COOL: 2,
    WILL: 3,
    LUCK: 0,
    MOVE: 3,
    BODY: 5,
    EMP: 3
  },
  combatBases: [
    { label: 'Shoulder Arms (Poor Quality Assault Rifle)', totalBase: 10, damage: '5d6', rof: 1 },
    { label: 'Autofire', totalBase: 10 },
    { label: 'Handgun (Very Heavy Pistol)', totalBase: 10, damage: '4d6', rof: 1 },
    { label: 'Melee Weapon (Medium Melee Weapon)', totalBase: 6, damage: '2d6', rof: 2 },
    { label: 'Evasion', totalBase: 6 }
  ],
  weapons: [
    {
      name: 'Poor Quality Assault Rifle',
      skillBase: 10,
      damage: '5d6',
      rof: 1,
      mag: 25,
      category: 'rifle',
      notes: 'Calidad Poor (Core p. 413).'
    },
    {
      name: 'Very Heavy Pistol',
      skillBase: 10,
      damage: '4d6',
      rof: 1,
      mag: 8,
      category: 'pistol'
    },
    {
      name: 'Medium Melee Weapon',
      skillBase: 6,
      damage: '2d6',
      rof: 2,
      mag: 0,
      category: 'melee'
    }
  ],
  armorHead: 'Kevlar (SP 7)',
  armorBody: 'Kevlar (SP 7)',
  cyberware: [],
  gear: ['Rifle x40', 'Very Heavy Pistol Ammo x20', 'Radio Communicator'],
  specialRules: [
    'Mook (Core p. 413). La aventura lo usa sin modificaciones (p. 3).'
  ],
  loreSummary: 'Oficial de la Red Chrome Legion en el vagón delantero: Security Operative del Core.',
  sourcePage: 413
};

// --- Automated Turret (Core p.214), RCC p.3 ---
const HAMMERHEAD_TURRET_2045: RedChromeEnemySheet = {
  id: 'rcc-turret-2045',
  name: 'Hammerhead Automated Turret',
  subtitle: 'Automated Turret del Core (p. 214), Emplaced Defense',
  faction: 'Red Chrome Legion',
  threatTier: 'mook',
  sourceBook: 'core',
  sourceBookTitle: 'Core Rulebook p.214 // Red Chrome Cargo p.3',
  era: '2045',
  role: 'Emplaced Defense',
  hp: 25,
  seriouslyWounded: 0,
  deathSave: 0,
  headSp: 0,
  bodySp: 0,
  armorDetail: {
    headName: 'Sin armadura (25 HP)',
    headSp: 0,
    bodyName: 'Sin armadura (25 HP)',
    bodySp: 0,
    notes: 'El Core define la torreta por sus 25 HP; no es una criatura y no tiene STATs.'
  },
  stats: {
    INT: 0,
    REF: 0,
    DEX: 0,
    TECH: 0,
    COOL: 0,
    WILL: 0,
    LUCK: 0,
    MOVE: 0,
    BODY: 0,
    EMP: 0
  },
  combatBases: [
    { label: 'Combat Number (+1d10)', totalBase: 14, notes: 'Sin Demon/Netrunner usa su Combat Number + 1d10; no esquiva (estacionaria). Controlada por un Netrunner usa las Skills del Netrunner.' }
  ],
  weapons: [
    { name: 'Assault Rifle (25 Basic Bullets)', skillBase: 14, damage: '5d6', rof: 1, mag: 25, category: 'turret', notes: 'Opción 1 de 5 del Core; el GM elige el arma.' },
    { name: 'Flamethrower (4 Incendiary Shotgun Shells)', skillBase: 14, damage: '3d6', rof: 1, mag: 4, category: 'turret', notes: 'Opción 2 de 5 del Core; el GM elige el arma.' },
    { name: 'Dartgun (8 Poison Arrows)', skillBase: 14, damage: 'Según munición (ver Core)', rof: 1, mag: 8, category: 'turret', notes: 'Opción 3 de 5 del Core; el GM elige el arma.' },
    { name: 'Very Heavy Pistol (8 Armor Piercing Bullets)', skillBase: 14, damage: '4d6', rof: 1, mag: 8, category: 'turret', notes: 'Opción 4 de 5 del Core; el GM elige el arma.' },
    { name: 'Heavy SMG (40 Basic Bullets)', skillBase: 14, damage: '3d6', rof: 1, mag: 40, category: 'turret', notes: 'Opción 5 de 5 del Core; el GM elige el arma.' }
  ],
  cyberware: [],
  gear: [],
  specialRules: [
    'La aventura no dice con cuál de las 5 armas del Core está equipada: la elige el GM.',
    'Dispara a quien entre sin pase/credencial adecuada, hasta que muera, salga de rango o presente el pase correcto (área: perímetro de la zona defendida).',
    'Contrarrestar: Electronics/Security Tech DV17, 5 minutos. Una vez contrarrestada se controla a distancia (6 m de un Access Point) con un Agent usando una Acción (Control).',
    'En la aventura: se activa si los guardias fueron alertados al abordar; si no, un guardia gasta su primer turno en correr a los controles y activarla. El Control Node del mainframe (Piso 5, DV8) permite tomar su control.'
  ],
  loreSummary: 'Torreta automática en el centro del vagón delantero del Hammerhead.',
  sourcePage: 214
};

export const RED_CHROME_ENEMY_PROFILES: Record<string, RedChromeDualEnemyProfile> = {
  rcl_shotgun_guard: {
    id: 'rcc-shotgun-guard',
    name: 'Red Chrome Legion Guard (Boosterganger + Shotgun)',
    role: 'Mook / Boosterganger',
    placement: 'Vagón trasero: 2 guardias (3 si hay 5+ PJs). Vagón delantero: PJs - 1 guardias.',
    notes: 'Boosterganger del Core (p. 412) con Shotgun añadida (RCC p. 3).',
    spawnRules: {
      formula: 'Vagón trasero: 2 guardias (+1 si hay 5+ PJs). Vagón delantero: número de PJs menos 1.',
      byPartySize: {
        3: { rearCar: 2, middleCar: 0, frontCar: 2, driverCar: 0, total: 4 },
        4: { rearCar: 2, middleCar: 0, frontCar: 3, driverCar: 0, total: 5 },
        5: { rearCar: 3, middleCar: 0, frontCar: 4, driverCar: 0, total: 7 },
        6: { rearCar: 3, middleCar: 0, frontCar: 5, driverCar: 0, total: 8 }
      },
      defaultRearCount: 2,
      defaultFrontCount: 3,
      alertedBehavior: 'Si el salto falla, la colisión alerta a los guardias del interior. En el vagón delantero, si los guardias fueron alertados la torreta está activa; si no, un guardia gasta su primer turno en correr a los controles de la torreta y activarla.',
      notes: 'Los contenedores del vagón trasero ocultan la escotilla y permiten intentar una entrada sigilosa para sorprender a los guardias (la aventura no da DV).'
    },
    variant2045: RCL_GUARD_2045,
    variant2077Cemk: {
      ...RCL_GUARD_2045,
      id: 'rcc-shotgun-guard-2077',
      name: 'Red Chrome Legion Guard (2077 CEMK)',
      era: '2077',
      cyberware: ['Rippers', 'Techhair', 'Neuroport (regla CEMK: todos los PNJ lo tienen, plan 6)'],
      hasNeuroport: true,
      cyberwareDetailed: [
        {
          name: 'Neuroport',
          slot: 'Neural',
          effect: 'Regla CEMK (plan 6): todos los PNJ tienen Neuroport, por lo que son hackeables con los quickhacks del catálogo CEMK. No figura en el bloque del Core.'
        }
      ],
      specialRules: [
        ...RCL_GUARD_2045.specialRules,
        'Neuroport CEMK (plan 6): hackeable. Los quickhacks disponibles son los de QUICKHACKS_2077_CATALOG (netAndRolesData.ts).'
      ]
    }
  },

  rcl_officer: {
    id: 'rcc-officer',
    name: 'Red Chrome Legion Officer (Security Operative)',
    role: 'Mook / Security Operative',
    placement: 'Vagón delantero: 1 Oficial.',
    notes: 'Security Operative del Core (p. 413), sin modificaciones (RCC p. 3).',
    spawnRules: {
      formula: 'Vagón delantero: 1 Oficial.',
      byPartySize: {
        3: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        4: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        5: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        6: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 }
      },
      defaultRearCount: 0,
      defaultFrontCount: 1,
      alertedBehavior: 'La aventura no describe un comportamiento específico del Oficial.',
      notes: 'Sin notas adicionales en el libro.'
    },
    variant2045: RCL_OFFICER_2045,
    variant2077Cemk: {
      ...RCL_OFFICER_2045,
      id: 'rcc-officer-2077',
      name: 'Red Chrome Legion Officer (2077 CEMK)',
      era: '2077',
      cyberware: ['Neuroport (regla CEMK: todos los PNJ lo tienen, plan 6)'],
      hasNeuroport: true,
      cyberwareDetailed: [
        {
          name: 'Neuroport',
          slot: 'Neural',
          effect: 'Regla CEMK (plan 6): todos los PNJ tienen Neuroport, por lo que son hackeables con los quickhacks del catálogo CEMK. No figura en el bloque del Core.'
        }
      ],
      specialRules: [
        ...RCL_OFFICER_2045.specialRules,
        'Neuroport CEMK (plan 6): hackeable. Los quickhacks disponibles son los de QUICKHACKS_2077_CATALOG (netAndRolesData.ts).'
      ]
    }
  },

  hammerhead_turret: {
    id: 'rcc-hammerhead-turret',
    name: 'Hammerhead Automated Turret',
    role: 'Emplaced Defense',
    placement: 'Vagón delantero: en el centro de la sala.',
    notes: 'Automated Turret del Core (p. 214): Combat Number 14, 25 HP; contrarrestar con Electronics/Security Tech DV17 (5 minutos). Dispara a cualquiera sin pase. El GM elige el arma entre las 5 opciones del Core.',
    spawnRules: {
      formula: 'Vagón delantero: 1 torreta en el centro de la sala.',
      byPartySize: {
        3: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        4: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        5: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        6: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 }
      },
      defaultRearCount: 0,
      defaultFrontCount: 1,
      alertedBehavior: 'Activa si los guardias fueron alertados al abordar el tren. Si no está activada, un guardia Legion gasta su primer turno en correr a los controles y activarla.',
      notes: 'Si el Netrunner conquista el Control Node (Piso 5), conoce la torreta del siguiente vagón y puede tomar su control.'
    },
    variant2045: HAMMERHEAD_TURRET_2045,
    variant2077Cemk: {
      ...HAMMERHEAD_TURRET_2045,
      id: 'rcc-turret-2077',
      era: '2077',
      specialRules: [
        ...HAMMERHEAD_TURRET_2045.specialRules,
        'Hackeable: Control Node del mainframe (Piso 5, DV8). La torreta no es una criatura: no tiene Neuroport.'
      ]
    }
  }
};

// ============================================================================
// 6. ESTRUCTURA DE LOS 4 VAGONES Y POSICIONES // TRAIN MAP & TOKENS (PÁG 4)
// ============================================================================

export interface TrainCarLayout {
  carId: 'rear' | 'middle' | 'front' | 'driver';
  name: string;
  gridDimensions?: { width: number; height: number }; // El libro no da medidas (mapa p. 4 solo ilustrado)
  description: string;
  features: string[];
  initialEnemiesDesc: string;
}

export const HAMMERHEAD_TRAIN_CARS: TrainCarLayout[] = [
  {
    carId: 'rear',
    name: 'Rear Car (Vagón Trasero)',
    description: 'Vagón de cola con escotilla de mantenimiento en el techo. Los contenedores del interior son lo bastante altos para ocultar la escotilla.',
    features: [
      'Techo: se llega saltando desde el tren de Hornet (Athletics DV13)',
      'Escotilla de mantenimiento (Hatch): Basic Tech DV13',
      'Contenedores altos que ocultan la escotilla y permiten intentar una entrada sigilosa para sorprender a los guardias'
    ],
    initialEnemiesDesc: '2 guardias Legion (Boosterganger + Shotgun); +1 si hay 5+ PJs'
  },
  {
    carId: 'middle',
    name: 'Middle Car (Vagón Central)',
    description: 'Vagón vacío salvo algunos contenedores y un puerto de mantenimiento.',
    features: [
      'Network Port (puerto de mantenimiento): un Netrunner puede conectarse al Hammerhead Mainframe (5 pisos)',
      'Algunos contenedores'
    ],
    initialEnemiesDesc: 'Sin enemigos indicados en la aventura.'
  },
  {
    carId: 'front',
    name: 'Front Car (Vagón Delantero)',
    description: 'Vagón con guardias y un Oficial de la Legion, la Automated Turret en el centro de la sala y los contenedores que buscan los PJs.',
    features: [
      "Hornet's Cargo: los 4 contenedores (cada uno lo carga un PJ con dos manos)",
      'Automated Turret en el centro de la sala (Core p. 214)',
      'Turret Control (controles de la torreta)'
    ],
    initialEnemiesDesc: '1 Oficial (Security Operative) + (número de PJs - 1) guardias (Boosterganger + Shotgun)'
  },
  {
    carId: 'driver',
    name: "Driver's Car (Vagón del Conductor)",
    description: 'Desde sus controles se puede detener el Hammerhead, que normalmente es automático.',
    features: [
      'Train Control: detener el tren con Drive Land Vehicle DV9'
    ],
    initialEnemiesDesc: 'Sin enemigos indicados en la aventura.'
  }
];

export interface TrainTokenPlacement {
  id: string;
  name: string;
  carId: 'rear' | 'middle' | 'front' | 'driver';
  symbol: string;
  color: string;
  description: string;
}

export const INITIAL_TRAIN_TOKENS: TrainTokenPlacement[] = [
  {
    id: 'token-hatch',
    name: 'Escotilla de Techo',
    carId: 'rear',
    symbol: '▼',
    color: '#38bdf8',
    description: 'Escotilla de mantenimiento del techo del vagón trasero (Basic Tech DV13).'
  },
  {
    id: 'token-net-port',
    name: 'Network Port',
    carId: 'middle',
    symbol: '▲',
    color: '#00f5d4',
    description: 'Puerto de mantenimiento: acceso del Netrunner al Hammerhead Mainframe de 5 pisos.'
  },
  {
    id: 'token-cargo-crates',
    name: "Hornet's Cargo (4 Cajas)",
    carId: 'front',
    symbol: '★',
    color: '#f59e0b',
    description: '4 contenedores grandes con cerraduras codificadas por ADN; en el vagón delantero.'
  },
  {
    id: 'token-turret-control',
    name: 'Turret Control',
    carId: 'front',
    symbol: '▣',
    color: '#eab308',
    description: 'Controles de la torreta: un guardia corre a activarla en su primer turno si no estaba activa.'
  },
  {
    id: 'token-turret',
    name: 'Automated Turret',
    carId: 'front',
    symbol: '⬢',
    color: '#ef4444',
    description: 'Automated Turret (Core p. 214): Combat Number 14, 25 HP; Electronics/Security Tech DV17 para contrarrestarla.'
  },
  {
    id: 'token-train-control',
    name: 'Train Control',
    carId: 'driver',
    symbol: '●',
    color: '#10b981',
    description: 'Controles del tren (Drive Land Vehicle DV9 para detener el Hammerhead).'
  }
];

// ============================================================================
// 7. HAMMERHEAD MANIFEST & HORNET'S 4 CRATES DATASET
// ============================================================================

export interface RedChromeManifestEntry {
  consignmentId: string;
  car: 'rear' | 'middle' | 'front' | 'driver';
  cargoTitle: string;
  senderRecipient: string;
  securityRating: string;
  description: string;
  items: RedChromeLootItem[];
  totalValueEb: number;
  plotHook: string;
}

export interface RedChromeCrateLoot {
  crateNumber: 1 | 2 | 3 | 4;
  label: string;
  intendedRecipient: string;
  securityDv: string;
  transportRequirement: string;
  biologicalRisk: string;
  contents: RedChromeLootItem[];
  totalValueEb: number;
  gmNotes: string;
}

/**
 * La aventura no lista los envíos del manifiesto: el File del Piso 2 contiene "una lista de todo lo que había a bordo"
 * y el GM la usa a su criterio (p. 3). Por eso no hay entradas.
 */
export const HAMMERHEAD_MANIFEST_LOOT: RedChromeManifestEntry[] = [];

const CRATE_TRANSPORT =
  'Un solo PJ puede cargarla, pero requiere dos manos (p. 3). Saltar de vuelta al tren de Hornet cargándola: Athletics DV15; lanzarla al otro tren: Athletics DV13.';
const CRATE_LOCK = 'Cerradura codificada por ADN (la aventura no da DV)';

export const HORNET_CRATES_LOOT: RedChromeCrateLoot[] = [
  {
    crateNumber: 1,
    label: 'Contenedor 1: explosivos y cyberware de grado militar',
    intendedRecipient: 'Iron Sights (CPRED pág. 308)',
    securityDv: CRATE_LOCK,
    transportRequirement: CRATE_TRANSPORT,
    biologicalRisk: '',
    contents: [],
    totalValueEb: 0,
    gmNotes: 'Tres de los cuatro contenedores contienen explosivos de grado militar y cyberware; el libro no los reparte por contenedor.'
  },
  {
    crateNumber: 2,
    label: 'Contenedor 2: explosivos y cyberware de grado militar',
    intendedRecipient: 'Iron Sights (CPRED pág. 308)',
    securityDv: CRATE_LOCK,
    transportRequirement: CRATE_TRANSPORT,
    biologicalRisk: '',
    contents: [],
    totalValueEb: 0,
    gmNotes: 'Tres de los cuatro contenedores contienen explosivos de grado militar y cyberware; el libro no los reparte por contenedor.'
  },
  {
    crateNumber: 3,
    label: 'Contenedor 3: explosivos y cyberware de grado militar',
    intendedRecipient: 'Iron Sights (CPRED pág. 308)',
    securityDv: CRATE_LOCK,
    transportRequirement: CRATE_TRANSPORT,
    biologicalRisk: '',
    contents: [],
    totalValueEb: 0,
    gmNotes: 'Tres de los cuatro contenedores contienen explosivos de grado militar y cyberware; el libro no los reparte por contenedor.'
  },
  {
    crateNumber: 4,
    label: 'Contenedor 4: canisters de neurotoxina',
    intendedRecipient: 'Iron Sights (as bajo la manga contra la Legion y otras pandillas)',
    securityDv: CRATE_LOCK,
    transportRequirement: CRATE_TRANSPORT,
    biologicalRisk: 'Contiene varios canisters de una neurotoxina mortal ideada por Hornet. La aventura no da reglas de exposición.',
    contents: [],
    totalValueEb: 0,
    gmNotes: 'La neurotoxina se compró a precio alto a Hornet (p. 3).'
  }
];
