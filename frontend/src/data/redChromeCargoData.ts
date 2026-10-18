/**
 * RED CHROME CARGO // ONESHOT CANÓNICO OFICIAL CYBERPUNK RED
 * Conversión completa y dual (2045 Clásico + 2077 CEMK Escalado)
 * Fuentes: Cyberpunk RED Core Rulebook Screamsheet "Red Chrome Cargo" (págs. 1-4)
 */

import type { EnemySheet, EnemyWeaponProfile } from './enemiesCatalog';
import type { NetArchitecturePreset } from './netAndRolesData';
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
    'Disparos pesados y explosiones estructurales sacudieron los límites de la Zona de Combate esta madrugada cuando miembros de los Iron Sights chocaron contra pistoleros de la Red Chrome Legion en las inmediaciones del antiguo patio de maniobras de ferrocarril.',
    'Los Iron Sights, un contingente de ciborgs pesados y ex-operativos que perdieron el patrocinio corporativo de Arasaka tras el final de la 4ª Guerra Corporativa, fueron vistos recientemente en una estación de paso Nómada recibiendo cajas de suministros militares de manos de una misteriosa cábala de hombres de traje negro vinculados al Midnight Market.',
    'Testigos presenciales afirman que la Red Chrome Legion, una pandilla neofascista y xenófoba conocida por sembrar el terror en los suburbios, emboscó días después un convoy de transporte sin distintivos en plena autopista, huyendo con el cargamento blindado hacia paradero desconocido.',
    'Fuentes policiales del NCPD reportan que la Legion habría cargado los contenedores sellados a bordo de "The Hammerhead", un tren de carga militar automatizado que recorre a gran velocidad las vías industriales secundarias hacia las afueras desiertas al norte de Night City.',
    'Los analistas advierten que si la Red Chrome Legion logra desencriptar el cargamento robado, la correlación de fuerzas bélicas en la Zona de Combate se desestabilizará catastróficamente, desatando una masacre urbana sin precedentes.'
  ],
  paragraphsEn: [
    'Heavy gunfire and structural detonations shook the borders of the Combat Zone early this morning as combatants from the Iron Sights clashed with gunmen belonging to the Red Chrome Legion near the decommissioned rail switching yard.',
    'The Iron Sights, a battered cadre of full-body cyborgs and cyberpsychos who lost Arasaka\'s backing in the wake of the 4th Corporate War, were recently spotted at an outlying Nomad rail depot receiving crates of military-grade hardware from a secretive cabal of black-suited men operating out of the Midnight Market.',
    'Eyewitness reports confirm that the Red Chrome Legion, a violent neo-fascist gang notorious for brutalizing city outskirts, ambushed an unmarked logistics transport along the freeway days later, making off with the high-security armored haul.',
    'NCPD dispatch chatter indicates the Legion has moved the locked containers onto "The Hammerhead," a Militech automated freight train hurtling along secondary rail spurs toward an abandoned township north of Night City.',
    'Street analysts warn that should the Red Chrome Legion succeed in breaching the locked crates, the local balance of terror in the Combat Zone will collapse, sparking an uncontrollable citywide gang war.'
  ],
  links: [
    'Link: Iron Sights Get New Guns',
    'Link: Night City Gang Landscape Breakdown',
    'Link: Third Trucking Hijack This Week'
  ],
  adBanner: {
    brand: 'ZHIRAFA // GRAF 3',
    slogan: 'HAUL ANYTHING.',
    description: 'Dron cuadrúpedo de carga pesada industrial GRAF 3 de Zhirafa.'
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
    missionGoal: 'Abordar el tren en movimiento "The Hammerhead", neutralizar a los guardias de la Red Chrome Legion y recuperar intactas las 4 cajas de cargamento blindadas.',
    cargoDescription: '4 grandes cajas metálicas selladas con cerraduras biométricas codificadas por ADN. Hornet no reveló el contenido, pero ordenó manipularlas con extrema precaución.',
    trainName: 'The Hammerhead',
    trainType: 'Tren de carga blindado y automatizado de Militech',
    destination: 'Un pueblo fantasma abandonado al norte de Night City',
    transitMethod: 'Hornet facilita un dresina/vagón de servicio de alta velocidad en vías paralelas que puede emparejarse con el Hammerhead para un salto directo sobre el techo del vagón trasero.'
  },
  gmSecretNotes: {
    cratesOneToThreeContent: 'Cajas 1, 2 y 3: Llenas de explosivos militares pesados, detonadores y cibérware de alta potencia originalmente suministrados por Hornet para rearmar a los Iron Sights (CPRED pág. 308).',
    crateFourContent: 'Caja 4: Contiene cilindros presurizados de una neurotoxina letal de laboratorio desarrollada por Hornet en persona como arma biológica definitiva para erradicar a la Red Chrome Legion.',
    toxicChemicalEffect: 'Si la Caja 4 sufre una brecha catastrófica (ej. fuego concentrado o explosión), libera una nube de neurotoxina de 6m de radio. Quienes no posean Nasal Filters o traje hermético sufren 3d6 de daño directo al cuerpo y quedan Asfixiados.',
    whyUnopened: 'La Red Chrome Legion no ha podido abrirlas porque las cerraduras de ADN detonarían los explosivos si se fuerzan a golpes; viajan hacia el norte para que un Tech renegado las abra con sopletes láser de taller.',
    factionTies: 'El Fixer Hornet opera en ambos lados del submundo. Esta misión salvaguarda su reputación comercial frente a los Iron Sights y evita que armas químicas prohibidas caigan en manos de supremacistas desquiciados.'
  }
};

// ============================================================================
// 3. PRUEBAS DE HABILIDAD CANÓNICAS // SKILL CHECKS
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
}

export const RED_CHROME_SKILL_CHECKS: RedChromeSkillCheck[] = [
  {
    id: 'jump_train',
    title: 'Saltar del Tren de Hornet al Techo del Hammerhead',
    skill: 'Athletics',
    stat: 'DEX',
    dv: 13,
    formula: 'DEX + Athletics + 1d10 vs DV 13',
    successDesc: 'Aterrizas firmemente sobre la pasarela metálica del techo del vagón trasero (Rear Car).',
    failureDesc: 'Te quedas corto y te estrellas ruidosamente contra el costado del vagón; logras aferrarte milagrosamente a una escalerilla exterior sin caer a las vías, pero el impacto activa la alarma general del tren y enciende la Torreta Automática del Vagón Delantero.',
    mechanicalImpact: 'Fallo activa alerta global del tren (isTrainAlerted = true) y enciende de inmediato la Torreta Automática en el Vagón Delantero.'
  },
  {
    id: 'open_hatch',
    title: 'Abrir la Escotilla de Mantenimiento del Techo (Rear Car)',
    skill: 'Basic Tech',
    stat: 'TECH',
    dv: 13,
    formula: 'TECH + Basic Tech + 1d10 vs DV 13',
    successDesc: 'Desactivas el cerrojo neumático manual y abres la escotilla sin chirridos permitiendo descender sigilosamente al interior del Rear Car.',
    failureDesc: 'El cerrojo está agarrotado por la herrumbre. Requiere forzarlo con palanca haciendo un estruendo metálico o gastar otro turno de trabajo técnico.',
    mechanicalImpact: 'Permite descender al interior del Rear Car por encima de los contenedores altos.'
  },
  {
    id: 'stealth_entry',
    title: 'Entrada Sigilosa tras los Contenedores Altos (Rear Car)',
    skill: 'Stealth',
    stat: 'DEX',
    dv: 10,
    formula: 'DEX + Stealth + 1d10 vs Perception de Guardias (DV 10 / 1d10+7)',
    successDesc: 'Te deslizas en la penumbra tras los grandes contenedores de carga sin ser detectado, ganando un Asalto de Sorpresa completo contra los guardias.',
    failureDesc: 'Un guardia escopetero oye el crujido de tus botas en la chapa metálica y gira su arma al grito de intrusos.',
    mechanicalImpact: 'Si el tren no estaba alertado por el salto, otorga Emboscada por Sorpresa contra los 2 guardias del Rear Car.'
  },
  {
    id: 'stop_train',
    title: 'Frenar el Tren Automatizado en la Cabina (Driver\'s Car)',
    skill: 'Drive Land Vehicle',
    stat: 'REF',
    dv: 9,
    formula: 'REF + Drive Land Vehicle + 1d10 vs DV 9',
    successDesc: 'Acoplas los frenos neumáticos de emergencia y cortas la tracción magnética de Militech, deteniendo el Hammerhead de forma segura en las vías.',
    failureDesc: 'El ordenador de a bordo rechaza la anulación manual por bloqueo de seguridad; el tren sigue avanzando a toda velocidad hacia el pueblo hostil.',
    mechanicalImpact: 'Detiene el convoy por completo, evitando que llegue a los refuerzos de la Red Chrome Legion en el pueblo abandonado.'
  },
  {
    id: 'leap_with_crate',
    title: 'Saltar de Vuelta al Tren de Hornet Cargando una Caja',
    skill: 'Athletics',
    stat: 'DEX',
    dv: 15,
    formula: 'DEX + Athletics + 1d10 vs DV 15 (Requiere 2 Manos)',
    successDesc: 'Cruzas el vacío entre ambos trenes con el pesado cajón en brazos y ruedas sobre la plataforma del vagón de Hornet sano y salvo.',
    failureDesc: 'El peso del contenedor te desequilibra en pleno aire; debes soltar la caja para sujetarte a la barandilla o caer al vacío sufriendo 4d6 de daño por impacto contra el balasto.',
    mechanicalImpact: 'Permite transferir 1 de las 4 cajas de Hornet mientras el tren sigue en marcha.'
  },
  {
    id: 'throw_crate',
    title: 'Lanzar una Caja al Tren de Hornet en Movimiento',
    skill: 'Athletics',
    stat: 'DEX',
    dv: 13,
    formula: 'DEX + Athletics + 1d10 vs DV 13',
    successDesc: 'Arrojas la caja de forma limpia sobre el colchón de amarre del vagón de Hornet donde un operario la asegura con correas.',
    failureDesc: 'El lanzamiento se desvía por el viento de velocidad; la caja golpea el flanco metálico y queda colgando peligrosamente.',
    mechanicalImpact: 'Alternativa segura para que un personaje fuerte transfiera cajas sin tener que saltar personalmente.'
  }
];

// ============================================================================
// 4. ARQUITECTURA NET: HAMMERHEAD MAINFRAME (5 PISOS, PÁGINA 3)
// ============================================================================

export const HAMMERHEAD_MAINFRAME_NET: NetArchitecturePreset = {
  id: 'net-hammerhead-mainframe',
  name: 'Hammerhead Cargo Train Mainframe (Red Chrome Cargo — 5 Pisos)',
  difficulty: 'Standard',
  totalFloors: 5,
  loreDescription: 'Arquitectura NET militarizada de 5 pisos de Militech instalada en el vagón central (Middle Car) del tren The Hammerhead. Controla el manifiesto y la torreta automática de techo.',
  floors: [
    {
      floorNumber: 1,
      type: 'Password',
      name: 'Contraseña de Acceso Militech (Piso 1)',
      dv: 6
    },
    {
      floorNumber: 2,
      type: 'File',
      name: "File: Hammerhead's Original Cargo Manifest",
      dv: 8,
      rewardOrDevice: 'Revela el manifiesto militar de Militech (posibles ganchos de trama / equipo extra)'
    },
    {
      floorNumber: 3,
      type: 'Password',
      name: 'Firewall de Seguridad Táctica (Piso 3)',
      dv: 8
    },
    {
      floorNumber: 4,
      type: 'Black ICE',
      name: 'Black ICE: Hellhound',
      iceType: 'Hellhound',
      iceHp: 20,
      iceAtk: 6,
      iceDef: 2,
      rewardOrDevice: 'PER 6, SPD 6, ATK 6, DEF 2, REZ 20 — Causa 2d6 daño directo al cerebro e incendia ropa/cyberdeck (2 daño/turno)'
    },
    {
      floorNumber: 5,
      type: 'Control Node',
      name: 'Control Node: Controls the Automated Turret',
      dv: 8,
      rewardOrDevice: 'Toma el control de la Torreta Automática del Vagón Delantero (+14 ataque, 5d6 daño, Autofire 2d6×4)'
    }
  ]
};

// ============================================================================
// 5. PERFILES DE ENEMIGOS: DUAL VARIANT (2045 ORIGINAL + 2077 CEMK ESCALADO)
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

export const RED_CHROME_ENEMY_PROFILES: Record<string, RedChromeDualEnemyProfile> = {
  rcl_shotgun_guard: {
    id: 'rcc-shotgun-guard',
    name: 'Red Chrome Legion Guard (Escopetero)',
    role: 'Solo / Boosterganger',
    placement: 'Rear Car: 2 guardias (3 si hay 5+ PJs). Front Car: (PJs - 1) guardias.',
    notes: 'Poco disciplinados pero fanáticos y despiadados. Usan escopetas para controlar los pasillos angostos del tren y acorralar intrusos.',
    spawnRules: {
      formula: 'Rear Car: 2 guardias (3 si party >= 5 PJs). Front Car: (PJs - 1) guardias. Middle Car: 0 iniciales (acuden tras 1 turno si hay disparos).',
      byPartySize: {
        3: { rearCar: 2, middleCar: 0, frontCar: 2, driverCar: 0, total: 4 },
        4: { rearCar: 2, middleCar: 0, frontCar: 3, driverCar: 0, total: 5 },
        5: { rearCar: 3, middleCar: 0, frontCar: 4, driverCar: 0, total: 7 },
        6: { rearCar: 3, middleCar: 0, frontCar: 5, driverCar: 0, total: 8 }
      },
      defaultRearCount: 2,
      defaultFrontCount: 3,
      alertedBehavior: 'Si el abordaje alertó al convoy (fallo en salto DV 13 Athletics), los guardias del Rear Car toman cobertura tras los contenedores y preparan una Acción Aguantada para disparar cuando la escotilla se abra. En el Front Car, si la torreta no está activa, un guardia correrá en el Turno 1 a activarla en la consola.',
      notes: 'Si el Oficial de Asalto muere, los guardias supervivientes sufren -2 a Tiradas de Moral y pueden intentar huir a la locomotora.'
    },
    lootDrops: [
      {
        id: 'rcl-loot-g-shotgun',
        name: 'Escopeta Rostović DB-2 Satara (Tech) / Shotgun Standard',
        category: 'weapon',
        quantity: 1,
        valueEb: 500,
        rarity: 'uncommon',
        description: 'Escopeta con cañones limpios, lista para disparar postas pesadas o flechettes electromagnéticas.'
      },
      {
        id: 'rcl-loot-g-pistol',
        name: 'Militech Lexington [Power] / Very Heavy Pistol',
        category: 'weapon',
        quantity: 1,
        valueEb: 100,
        rarity: 'common',
        description: 'Pistola de dotación corporativa con raspones en la corredera y cargador estándar.'
      },
      {
        id: 'rcl-loot-g-ammo-sg',
        name: 'Cartuchos de Escopeta 12ga (Shells / Tech Flechettes)',
        category: 'ammo',
        quantity: 12,
        valueEb: 40,
        rarity: 'common',
        description: 'Cartuchos militares de alta dispersión para combate en espacios cerrados.'
      },
      {
        id: 'rcl-loot-g-ammo-pistol',
        name: 'Munición de Pistola Pesada (9mm / .454 Casull)',
        category: 'ammo',
        quantity: 20,
        valueEb: 20,
        rarity: 'common',
        description: 'Cargadores de repuesto con munición estándar.'
      },
      {
        id: 'rcl-loot-g-armor',
        name: 'Light Armorjack RCL Rojo y Cromo / Chaqueta de Cuero Reforzado',
        category: 'armor',
        quantity: 1,
        valueEb: 100,
        rarity: 'common',
        description: 'Chaqueta reforzada con parches neo-fascistas de la Legion (ablarada según el daño sufrido).'
      },
      {
        id: 'rcl-loot-g-cyber',
        name: 'Rippers de Aleación de Titanio Extraíbles',
        category: 'cyberware',
        quantity: 1,
        valueEb: 500,
        rarity: 'uncommon',
        harvestDifficultyDv: 13,
        description: 'Cuchillas retráctiles de titanio intactas. Requiere Cybertech o Surgery DV 13 para extracción limpia.'
      },
      {
        id: 'rcl-loot-g-eb',
        name: 'Fajo de Eddies Sucios de Pandilla',
        category: 'eb',
        quantity: 1,
        valueEb: 80,
        rarity: 'common',
        description: 'Billetes arrugados de €$ en un bolsillo interior de la chaqueta.'
      },
      {
        id: 'rcl-loot-g-med',
        name: 'Inyector Dérmico Bounce Back Mk.1 / Slap Patch',
        category: 'gear',
        quantity: 1,
        valueEb: 50,
        rarity: 'common',
        description: 'Parche médico que restaura +3 HP por turno durante 2 turnos.'
      },
      {
        id: 'rcl-loot-g-shard',
        name: 'Datashard: "Órdenes de Ruta del Hammerhead"',
        category: 'shard',
        quantity: 1,
        valueEb: 30,
        rarity: 'common',
        description: 'Shard encriptado con horarios de paso del tren y coordenadas del punto de descarga norteño.'
      }
    ],
    variant2045: {
      id: 'rcc-shotgun-guard-2045',
      name: 'Red Chrome Legion Guard (2045)',
      subtitle: 'Guardia de Asalto con Escopeta de la Legion (Core Boosterganger)',
      faction: 'Red Chrome Legion',
      threatTier: 'mook',
      sourceBook: 'core',
      sourceBookTitle: 'Red Chrome Cargo // Core Screamsheet',
      era: '2045',
      role: 'Solo',
      hp: 20,
      seriouslyWounded: 10,
      deathSave: 4,
      headSp: 0,
      bodySp: 4,
      armorDetail: {
        headName: 'Sin Blindaje Craneal (SP 0)',
        headSp: 0,
        bodyName: 'Chaqueta de Cuero Reforzado (Leathers RCL)',
        bodySp: 4,
        notes: 'Cuero grueso con remaches metálicos y parches neo-fascistas de la Legion. Protección elemental contra cortes leves.'
      },
      stats: {
        INT: 3,
        REF: 6,
        DEX: 5,
        TECH: 2,
        COOL: 4,
        WILL: 3,
        LUCK: 0,
        MOVE: 4,
        BODY: 4,
        EMP: 3
      },
      combatBases: [
        { label: 'Shoulder Arms (Shotgun)', totalBase: 10, damage: '5d6', rof: 1 },
        { label: 'Handgun (Very Heavy Pistol)', totalBase: 10, damage: '4d6', rof: 1 },
        { label: 'Brawling / Rippers', totalBase: 9, damage: '2d6', rof: 2 },
        { label: 'Evasion', totalBase: 8 }
      ],
      weapons: [
        {
          name: 'Shotgun',
          skillBase: 10,
          damage: '5d6',
          rof: 1,
          mag: 4,
          category: 'shotgun',
          weaponType2077: 'Power',
          ammoType: '12ga Shells (Postas / Balines en cono)',
          currentAmmo: 4,
          criticalHitBonus: 'Herida Crítica estándar en tiradas con dobles de 6',
          armorPiercing: false,
          notes: 'Dispara postas sólidas o perdigones en cono ideales para los pasillos estrechos del tren.'
        },
        {
          name: 'Very Heavy Pistol',
          skillBase: 10,
          damage: '4d6',
          rof: 1,
          mag: 8,
          category: 'pistol',
          weaponType2077: 'Power',
          ammoType: '.454 Casull Very Heavy Ammo',
          currentAmmo: 8,
          criticalHitBonus: 'Poder de detención contundente',
          armorPiercing: false,
          notes: 'Pistola pesada de gran contundencia para distancias medias.'
        },
        {
          name: 'Rippers',
          skillBase: 9,
          damage: '2d6',
          rof: 2,
          mag: 0,
          category: 'melee',
          weaponType2077: 'Melee',
          ammoType: 'None',
          currentAmmo: 0,
          criticalHitBonus: 'Causa laceraciones profundas con sangrado activo',
          armorPiercing: false,
          notes: 'Cuchillas de aleación implantadas bajo las uñas para combate cuerpo a cuerpo.'
        }
      ],
      armorHead: 'Sin Blindaje (SP 0)',
      armorBody: 'Chaqueta de Cuero Reforzado (Leathers SP 4)',
      cyberware: [
        'Neuroport Básico (Vulnerable a Quickhacks)',
        'Cybereye con Chyron',
        'Rippers (Cuchillas de Dedos retractiles)'
      ],
      cyberwareDetailed: [
        {
          name: 'Neuroport Básico',
          slot: 'Neural',
          effect: 'Interfaz neural básica con enlace biológico y lector de chips.',
          quickhackVulnerability: {
            hackName: 'Short Circuit',
            dv: 6,
            costRam: 2,
            targetEffect: '3d6 de daño directo al HP ignorando armadura y aturdimiento por 1 turno.',
            lucyKiwiSpecial: 'Lucy o Kiwi causan +1d6 extra si conectan desde el terminal NET del tren.'
          }
        },
        {
          name: 'Cybereye con Chyron',
          slot: 'Optics',
          effect: 'Visor óptico que proyecta datos y texto directamente en el campo visual.',
          quickhackVulnerability: {
            hackName: 'Reboot Optics',
            dv: 6,
            costRam: 2,
            targetEffect: 'Ciega por completo al guardia durante 1 turno (-4 a ataques y defensas).'
          }
        },
        {
          name: 'Rippers Retráctiles',
          slot: 'Cyberarm',
          effect: 'Cuchillas de combate integradas en las falanges de los dedos.'
        }
      ],
      gear: ['Cartuchos de escopeta x12', 'Balas Very Heavy Pistol x16', 'Radio de banda corta'],
      specialRules: [
        'Fanatismo Neofascista: Si el Oficial sigue con vida, repiten chequeos de moral o miedo fallidos.',
        'Vulnerable a Quickhacks mediante su enlace de Neuroport.'
      ],
      loreSummary: 'Pandillero fanatizado reclutado en las barriadas de Santo Domingo. Se le encomendó custodiar el tren Hammerhead hasta el pueblo norteño.'
    },
    variant2077Cemk: {
      id: 'rcc-shotgun-guard-2077',
      name: 'Red Chrome Legion Guard (2077 CEMK)',
      subtitle: 'Escopetero Cibernético Calibrado para Edgerunners 2077',
      faction: 'Red Chrome Legion',
      threatTier: 'hardened_mook',
      sourceBook: 'cemk_2077',
      sourceBookTitle: 'Red Chrome Cargo // CEMK 2077',
      era: '2077',
      role: 'Solo',
      hp: 30,
      seriouslyWounded: 15,
      deathSave: 6,
      headSp: 7,
      bodySp: 11,
      armorDetail: {
        headName: 'Gorra Balística Reforzada Militech Surplus (SP 7)',
        headSp: 7,
        bodyName: 'Light Armorjack RCL Rojo y Cromo (SP 11)',
        bodySp: 11,
        notes: 'Chaleco antibalas compuesto con placas frontales de choque que absorben el primer impacto crítico sin ablación de armadura.'
      },
      stats: {
        INT: 3,
        REF: 6,
        DEX: 5,
        TECH: 3,
        COOL: 4,
        WILL: 4,
        LUCK: 0,
        MOVE: 5,
        BODY: 6,
        EMP: 3
      },
      combatBases: [
        { label: 'Shoulder Arms (Satara / Carnage)', totalBase: 12, damage: '5d6', rof: 1 },
        { label: 'Handgun (Militech Lexington)', totalBase: 12, damage: '3d6', rof: 2 },
        { label: 'Brawling / Rippers Cromados', totalBase: 11, damage: '2d6', rof: 2 },
        { label: 'Evasion', totalBase: 10 }
      ],
      weapons: [
        {
          name: 'Rostović DB-2 Satara [Tech Shotgun]',
          skillBase: 12,
          damage: '5d6',
          rof: 1,
          mag: 4,
          category: 'shotgun',
          weaponType2077: 'Tech',
          ammoType: '12ga Flechette Magnética Tech',
          currentAmmo: 4,
          criticalHitBonus: '+5 a daño crítico en disparo cargado. Si impacta en torso, desgarra blindaje ablando 2 SP en lugar de 1.',
          armorPiercing: true,
          specialFeatures: [
            'Disparo Tech cargado: Atraviesa cajas de carga y mamparos metálicos del tren de hasta 25 SDP sin penalizador de cobertura.'
          ],
          notes: 'Escopeta técnica de dos cañones modificada por la Legion para disparar a través de las cajas del Hammerhead.'
        },
        {
          name: 'Militech Lexington [Power Pistol]',
          skillBase: 12,
          damage: '3d6',
          rof: 2,
          mag: 21,
          category: 'pistol',
          weaponType2077: 'Power',
          ammoType: '9mm Power Ricochet Rounds',
          currentAmmo: 21,
          criticalHitBonus: 'Permite rebotes calculados reduciendo el valor de cobertura enemiga.',
          armorPiercing: false,
          specialFeatures: [
            'Power Ricochet: Rebota en mamparos de acero para impactar a enemigos ocultos tras las esquinas de los vagones.'
          ],
          notes: 'Pistola semiautomática de alta cadencia de fuego para combate de corto alcance.'
        },
        {
          name: 'Rippers Cromados de Titanio',
          skillBase: 11,
          damage: '2d6',
          rof: 2,
          mag: 0,
          category: 'melee',
          weaponType2077: 'Melee',
          ammoType: 'None',
          currentAmmo: 0,
          criticalHitBonus: 'Laceración Crítica (Foreign Object / Bleed continuo de 2 daño/turno)',
          armorPiercing: false,
          notes: 'Cuchillas de titanio pulido con filo monomolecular implantadas en los dedos.'
        }
      ],
      armorHead: 'Casco Kevlar Ligero (SP 7)',
      armorBody: 'Light Armorjack RCL Rojo y Cromo (SP 11)',
      cyberware: [
        'Neuroport 2077 (Holocall, HUD, Biomonitor, Personal Link)',
        'Subdermal Grip (Enlace inteligente de arma)',
        'Rippers de Aleación de Titanio',
        'Kevlar Subdermal básico'
      ],
      cyberwareDetailed: [
        {
          name: 'Neuroport 2077 Integrado',
          slot: 'Neural',
          effect: 'Interfaz ciberespacial base con Personal Link, HUD táctico de combate, lector de shards y biomonitor.',
          quickhackVulnerability: {
            hackName: 'Short Circuit',
            dv: 6,
            costRam: 2,
            targetEffect: '3d6 daño directo ignorando armadura y sobrecarga de HUD causando Aturdimiento por 1 turno.',
            lucyKiwiSpecial: 'Lucy o Kiwi causan +1d6 extra si el hack se lanza en sigilo desde el puerto de red central.'
          }
        },
        {
          name: 'Subdermal Grip (Copiloto de Tiro)',
          slot: 'Cyberarm',
          effect: 'Sincroniza la retícula del arma y munición directamente con su visor (+1 a disparos en pasillos).',
          quickhackVulnerability: {
            hackName: 'Weapon Glitch',
            dv: 6,
            costRam: 2,
            targetEffect: 'Bloquea el percutor del arma durante 1 turno completo impidiendo que dispare.',
            lucyKiwiSpecial: 'Obliga al guardia a desechar el arma o gastar una Acción en reiniciarla.'
          }
        },
        {
          name: 'Cybereye Kiroshi Optics v1',
          slot: 'Optics',
          effect: 'Óptica cibernética con visor Chyron e identificador térmico de siluetas tras cobertura ligera.',
          quickhackVulnerability: {
            hackName: 'Reboot Optics',
            dv: 6,
            costRam: 2,
            targetEffect: 'Ciega por completo al guardia durante 1 turno (-4 a todas las tiradas de ataque y defensa).',
            lucyKiwiSpecial: 'Kiwi puede encadenar el hack al siguiente guardia contiguo por 1 RAM adicional.'
          }
        },
        {
          name: 'Kevlar Subdérmico Básico',
          slot: 'External',
          effect: 'Malla balística subcutánea que preserva SP 7 en caso de que la chaqueta externa sufra ablación.',
          quickhackVulnerability: {
            hackName: 'Cyberware Malfunction',
            dv: 8,
            costRam: 3,
            targetEffect: 'Desactiva la amortiguación del kevlar y le inflige 2 de daño eléctrico directo.'
          }
        }
      ],
      gear: ['Munición Tech cargada', 'Biomonitor de salud', 'Inyector de Bounce Back Mk.1'],
      specialRules: [
        'Neuroport 2077 Activo: Puede ser objetivo de Quickhacks (Short Circuit DV 6, Cyberware Malfunction DV 8, Overheat DV 8, Synapse Burnout DV 10).',
        'Blindaje RCL: El peto metálico absorbe el primer impacto crítico sin ablación de armadura.'
      ],
      loreSummary: 'Tropas de asalto de la Red Chrome Legion en 2077, mejoradas con cibérware militar de segunda mano y escopetas tecnológicas capaces de perforar los contenedores del tren.'
    }
  },

  rcl_officer: {
    id: 'rcc-officer',
    name: 'Red Chrome Legion Officer (Oficial de Asalto)',
    role: 'Solo / Security Operative',
    placement: 'Front Car: 1 Oficial liderando la defensa en el vagón delantero.',
    notes: 'Comandante despiadado con armadura militar y entrenamiento táctico. Si la torreta está apagada, ordenará a un guardia activarla mientras él abre fuego con fusil de asalto.',
    spawnRules: {
      formula: 'Front Car: 1 Oficial fijo comandando el tren. Nunca aparece en Rear ni Middle car.',
      byPartySize: {
        3: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        4: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        5: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        6: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 }
      },
      defaultRearCount: 0,
      defaultFrontCount: 1,
      alertedBehavior: 'Si el tren entra en alerta o escucha detonaciones, se atrinchera tras las cajas blindadas del vagón delantero con su fusil desenfundado. Si la torreta no está activa, ordena gritar a un mook que la encienda en la consola mientras él efectúa fuego de supresión con Autofire. Si se ve acorralado, intentará replegarse a la locomotora para acelerar el tren al máximo.',
      notes: 'Lleva la tarjeta maestra magnética de Militech en su bolsillo subdérmico, necesaria para desbloquear los mandos de la locomotora sin tirar dados.'
    },
    lootDrops: [
      {
        id: 'rcl-loot-o-masamune',
        name: 'Arasaka HJSH-18 Masamune [Power Assault Rifle] / Assault Rifle Militar',
        category: 'weapon',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        description: 'Fusil de asalto militar de tres disparos, perfectamente equilibrado y con acabado anticorrosión.'
      },
      {
        id: 'rcl-loot-o-nue',
        name: 'Tsunami Nue [Power Heavy Pistol] / Very Heavy Pistol',
        category: 'weapon',
        quantity: 1,
        valueEb: 500,
        rarity: 'uncommon',
        description: 'Pistola de combate de alta precisión con dos cargadores llenos.'
      },
      {
        id: 'rcl-loot-o-thermal',
        name: 'Thermal Katana / Maza Pesada con Púas',
        category: 'weapon',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        description: 'Arma pesada de combate cuerpo a cuerpo capaz de fundir o quebrar armaduras.'
      },
      {
        id: 'rcl-loot-o-armor',
        name: 'Militech Tactical Helmet & Combat Armorjack (SP 11 / SP 7)',
        category: 'armor',
        quantity: 1,
        valueEb: 400,
        rarity: 'uncommon',
        description: 'Conjunto completo de protección balística de grado táctico corporativo.'
      },
      {
        id: 'rcl-loot-o-ammo',
        name: 'Lote de Munición Militar Perforante (5.56mm x60, 10mm x30)',
        category: 'ammo',
        quantity: 1,
        valueEb: 120,
        rarity: 'common',
        description: 'Cargadores de alta capacidad con proyectiles de punta de tungsteno.'
      },
      {
        id: 'rcl-loot-o-kerenzikov',
        name: 'Kerenzikov Reflex Booster Extraíble',
        category: 'cyberware',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        harvestDifficultyDv: 15,
        description: 'Acelerador de reflejos sinápticos intacto. Requiere Cybertech o Surgery DV 15 para extracción limpia.'
      },
      {
        id: 'rcl-loot-o-coprocessor',
        name: 'Ballistic Coprocessor Chipset Desmontable',
        category: 'cyberware',
        quantity: 1,
        valueEb: 500,
        rarity: 'uncommon',
        harvestDifficultyDv: 13,
        description: 'Procesador neural de cálculo balístico instalado en el antebrazo.'
      },
      {
        id: 'rcl-loot-o-keycard',
        name: 'Militech Master Train Keycard & Crypto-Token',
        category: 'shard',
        quantity: 1,
        valueEb: 250,
        rarity: 'rare',
        description: 'Tarjeta magnética que desbloquea la consola del tren y detiene el convoy sin tirada de conducción.'
      },
      {
        id: 'rcl-loot-o-credchip',
        name: 'Credchip Encriptado de la Red Chrome Legion',
        category: 'eb',
        quantity: 1,
        valueEb: 500,
        rarity: 'uncommon',
        description: 'Chip bancario al portador con fondos de la pandilla para sobornos en el destino.'
      },
      {
        id: 'rcl-loot-o-maxdoc',
        name: 'Inyector Militar MaxDoc Mk.2',
        category: 'gear',
        quantity: 2,
        valueEb: 200,
        rarity: 'uncommon',
        description: 'Inyectores de choque que restauran 20 HP de inmediato a un herido.'
      }
    ],
    variant2045: {
      id: 'rcc-officer-2045',
      name: 'Red Chrome Legion Officer (2045)',
      subtitle: 'Comandante de Operaciones de la Legion (Core Security Operative)',
      faction: 'Red Chrome Legion',
      threatTier: 'lieutenant',
      sourceBook: 'core',
      sourceBookTitle: 'Red Chrome Cargo // Core Screamsheet',
      era: '2045',
      role: 'Solo',
      hp: 40,
      seriouslyWounded: 20,
      deathSave: 7,
      headSp: 7,
      bodySp: 7,
      armorDetail: {
        headName: 'Casco Militar de Kevlar (SP 7)',
        headSp: 7,
        bodyName: 'Chaleco Táctico Reforzado Kevlar (SP 7)',
        bodySp: 7,
        notes: 'Equipo de ex-seguridad privada. Protección balística completa contra armas ligeras en cabeza y torso.'
      },
      stats: {
        INT: 5,
        REF: 7,
        DEX: 7,
        TECH: 4,
        COOL: 6,
        WILL: 5,
        LUCK: 0,
        MOVE: 5,
        BODY: 7,
        EMP: 5
      },
      combatBases: [
        { label: 'Shoulder Arms (Assault Rifle)', totalBase: 13, damage: '5d6', rof: 1 },
        { label: 'Autofire (Assault Rifle)', totalBase: 11, damage: '2d6×4', rof: 1 },
        { label: 'Handgun (Very Heavy Pistol)', totalBase: 13, damage: '4d6', rof: 1 },
        { label: 'Melee Weapon (Maza con Púas)', totalBase: 11, damage: '3d6', rof: 2 },
        { label: 'Evasion', totalBase: 12 }
      ],
      weapons: [
        {
          name: 'Assault Rifle',
          skillBase: 13,
          damage: '5d6',
          rof: 1,
          mag: 30,
          category: 'rifle',
          weaponType2077: 'Power',
          ammoType: '5.56 NATO Rifle Ammo',
          currentAmmo: 30,
          criticalHitBonus: 'Disparo único 5d6 o Autofire 2d6×4 (multiplicador máx 4)',
          armorPiercing: true,
          notes: 'Fusil de asalto militar de alta precisión. Excelente para controlar la línea recta del vagón delantero.'
        },
        {
          name: 'Very Heavy Pistol',
          skillBase: 13,
          damage: '4d6',
          rof: 1,
          mag: 8,
          category: 'pistol',
          weaponType2077: 'Power',
          ammoType: '.454 Casull Very Heavy Ammo',
          currentAmmo: 8,
          criticalHitBonus: 'Alto poder de parada',
          armorPiercing: false,
          notes: 'Arma secundaria potente para distancias cortas.'
        },
        {
          name: 'Heavy Melee Weapon (Maza Pesada)',
          skillBase: 11,
          damage: '3d6',
          rof: 2,
          mag: 0,
          category: 'melee',
          weaponType2077: 'Melee',
          ammoType: 'None',
          currentAmmo: 0,
          criticalHitBonus: 'Ignora la mitad del SP del objetivo al ser arma cuerpo a cuerpo pesada',
          armorPiercing: true,
          notes: 'Maza de combate tachonada de acero para aplastar oponentes.'
        }
      ],
      armorHead: 'Casco Kevlar (SP 7)',
      armorBody: 'Chaleco Táctico Kevlar (SP 7)',
      cyberware: [
        'Neuroport Básico',
        'Subdermal Pocket (Bolsillo subdérmico)',
        'Nasal Filters (Inmunidad a gases y humos)'
      ],
      cyberwareDetailed: [
        {
          name: 'Neuroport Básico',
          slot: 'Neural',
          effect: 'Interfaz neural para coordinación táctica y radio interna.',
          quickhackVulnerability: {
            hackName: 'Short Circuit',
            dv: 6,
            costRam: 2,
            targetEffect: '3d6 de daño directo al HP ignorando armadura y aturdimiento por 1 turno.'
          }
        },
        {
          name: 'Nasal Filters',
          slot: 'Internal',
          effect: 'Filtros bio-mecánicos nasales que brindan inmunidad total a gases y toxinas aerosolizadas.',
          quickhackVulnerability: {
            hackName: 'Cyberware Malfunction',
            dv: 8,
            costRam: 3,
            targetEffect: 'Desactiva los filtros nasales por 2 turnos, haciéndolo vulnerable a la neurotoxina de la Caja 4.'
          }
        },
        {
          name: 'Subdermal Pocket',
          slot: 'External',
          effect: 'Bolsillo subcutáneo oculto bajo la piel del pecho donde guarda la tarjeta magnética de la locomotora.'
        }
      ],
      gear: ['3 cargadores de fusil de asalto', 'Esposas de plastiacero', 'Tarjeta magnética de la cabina del tren'],
      specialRules: [
        'Comando Táctico: Otorga +1 a la Iniciativa a todos los guardias de la Red Chrome Legion en el mismo vagón.',
        'Filtros Nasales: Inmune a la nube de toxina si la Caja 4 sufre una fuga.'
      ],
      loreSummary: 'Veterano paramilitar que coordina el robo del tren Hammerhead. Lleva la llave de los mandos del tren en su cinturón.'
    },
    variant2077Cemk: {
      id: 'rcc-officer-2077',
      name: 'Red Chrome Legion Officer (2077 CEMK)',
      subtitle: 'Teniente Blindado con Masamune y Kerenzikov (Edgerunners 2077)',
      faction: 'Red Chrome Legion',
      threatTier: 'hardened_lieutenant',
      sourceBook: 'cemk_2077',
      sourceBookTitle: 'Red Chrome Cargo // CEMK 2077',
      era: '2077',
      role: 'Solo',
      hp: 45,
      seriouslyWounded: 23,
      deathSave: 7,
      headSp: 11,
      bodySp: 11,
      armorDetail: {
        headName: 'Casco Táctico Balístico Militech con HUD (Light Armorjack SP 11)',
        headSp: 11,
        bodyName: 'Traje de Combate Blindado RCL Élite (Light Armorjack SP 11)',
        bodySp: 11,
        notes: 'Blindaje de polímero cerámico militar completo. Su blindaje reduce la severidad de metralla y su visor calcula trayectorias de rebote ricochet.'
      },
      stats: {
        INT: 5,
        REF: 8,
        DEX: 7,
        TECH: 5,
        COOL: 6,
        WILL: 6,
        LUCK: 0,
        MOVE: 6,
        BODY: 7,
        EMP: 5
      },
      combatBases: [
        { label: 'Shoulder Arms (Masamune)', totalBase: 14, damage: '5d6', rof: 1 },
        { label: 'Autofire (Masamune)', totalBase: 13, damage: '2d6×4', rof: 1 },
        { label: 'Handgun (Tsunami Nue)', totalBase: 14, damage: '4d6', rof: 1 },
        { label: 'Melee Weapon (Espada Térmica)', totalBase: 13, damage: '3d6', rof: 2 },
        { label: 'Evasion (Esquiva Balas)', totalBase: 13 }
      ],
      weapons: [
        {
          name: 'Arasaka HJSH-18 Masamune [Power Assault Rifle]',
          skillBase: 14,
          damage: '5d6',
          rof: 1,
          mag: 30,
          category: 'rifle',
          weaponType2077: 'Power',
          ammoType: '5.56x45mm Match Militar',
          currentAmmo: 30,
          criticalHitBonus: '+5 a daño crítico con ráfagas de 3 disparos. Autofire 2d6×4 (DV 17) con ablación doble en impacto crítico.',
          armorPiercing: true,
          specialFeatures: [
            'Ráfaga de 3 disparos hiperprecisa de grado corporativo militar',
            'Coprocesador Balístico integrado: Disparos de rebote (Ricochet) en mamparos y techos'
          ],
          notes: 'Fusil de asalto insignia de Arasaka, robado de un convoy militar. Letal a cualquier distancia dentro de los vagones.'
        },
        {
          name: 'Tsunami Nue [Power Heavy Pistol]',
          skillBase: 14,
          damage: '4d6',
          rof: 1,
          mag: 10,
          category: 'pistol',
          weaponType2077: 'Power',
          ammoType: 'Heavy Pistol 10mm Auto High-Velocity',
          currentAmmo: 10,
          criticalHitBonus: 'Crítico masivo con probabilidad de mutilar extremidades',
          armorPiercing: false,
          specialFeatures: [
            'Power Ricochet',
            'Estabilizador ergonómico de retroceso'
          ],
          notes: 'Pistola japonesa de élite de gran contundencia y precisión implacable.'
        },
        {
          name: 'Espada Térmica Pesada [Thermal Blade]',
          skillBase: 13,
          damage: '3d6',
          rof: 2,
          mag: 0,
          category: 'melee',
          weaponType2077: 'Melee',
          ammoType: 'Micro-Batería Térmica (50 cargas)',
          currentAmmo: 50,
          criticalHitBonus: 'Ignora la mitad del SP del objetivo y prende fuego causando 2 daño térmico por turno hasta extinguirse',
          armorPiercing: true,
          specialFeatures: [
            'Filo de plasma sobrecalentado a 2000°C',
            'Ablación acelerada de blindajes metálicos'
          ],
          notes: 'Hoja de monocarbono con resistencia térmica activa que rebana planchas de blindaje.'
        }
      ],
      armorHead: 'Casco Balístico Militech (Light Armorjack SP 11)',
      armorBody: 'Traje Táctico Reforzado RCL (Light Armorjack SP 11)',
      cyberware: [
        'Neuroport 2077 con Self-ICE (+2 a DVs de Quickhacks hostiles)',
        'Kerenzikov (+2 a tiradas de Iniciativa)',
        'Ballistic Coprocessor (Permite tiros de rebote calculados)',
        'Nasal Filters 2077 (Inmune a neurotoxinas)'
      ],
      cyberwareDetailed: [
        {
          name: 'Neuroport 2077 Militar con Self-ICE',
          slot: 'Neural',
          effect: 'Procesador neural militar con cortafuegos autónomo (+2 al DV de cualquier Quickhack hostil dirigido contra él).',
          quickhackVulnerability: {
            hackName: 'Short Circuit',
            dv: 8,
            costRam: 4,
            targetEffect: '3d6 de daño directo al HP ignorando armadura, inhabilita su Self-ICE por 2 turnos y causa aturdimiento.',
            lucyKiwiSpecial: 'Lucy puede quemar el Self-ICE permanentemente si supera el DV por 4 o más.'
          }
        },
        {
          name: 'Kerenzikov Reflex Booster',
          slot: 'Neural',
          effect: 'Acelera la percepción del tiempo (+2 a tiradas de Iniciativa y permite esquivar balas gracias a REF 8).',
          quickhackVulnerability: {
            hackName: 'Cyberware Malfunction',
            dv: 8,
            costRam: 3,
            targetEffect: 'Desactiva el Kerenzikov durante 2 turnos; pierde el bono de iniciativa y su capacidad de esquivar balas.',
            lucyKiwiSpecial: 'Kiwi reduce su REF efectiva a 6 mientras dure el fallo sináptico.'
          }
        },
        {
          name: 'Ballistic Coprocessor',
          slot: 'Internal',
          effect: 'Calcula trayectorias de rebote ricochet con armas Power, ignorando penalizadores angulares de cobertura.',
          quickhackVulnerability: {
            hackName: 'Weapon Glitch',
            dv: 8,
            costRam: 3,
            targetEffect: 'Desincroniza la Masamune provocando un encasquillamiento en el siguiente turno de disparo.'
          }
        },
        {
          name: 'Nasal Filters 2077',
          slot: 'Internal',
          effect: 'Inmunidad total a gases biológicos, humo sofocante y a la neurotoxina de la Caja 4.',
          quickhackVulnerability: {
            hackName: 'Overheat',
            dv: 10,
            costRam: 4,
            targetEffect: 'Sobrecalienta los filtros infligiendo 4d6 de daño térmico en 2 turnos y anulando la protección contra toxinas por 1 turno.',
            lucyKiwiSpecial: 'Si la Caja 4 sufre una fuga de gas en ese momento, el Oficial debe chequear contra la neurotoxina de inmediato.'
          }
        },
        {
          name: 'Subdermal Pocket Cifrado',
          slot: 'External',
          effect: 'Bolsillo subcutáneo blindado bajo la clavícula izquierda donde oculta la tarjeta llave maestra del tren.'
        }
      ],
      gear: ['Cargadores militares perforantes', 'Inyector de MaxDoc Mk.2', 'Llave cifrada de la locomotora'],
      specialRules: [
        'Esquiva de Balas Activa: Gracias a su REF 8 puede esquivar proyectiles a distancia con Evasion (+13).',
        'Self-ICE Defensivo: Los Netrunners enemigos sufren un penalizador de +2 al DV de cualquier Quickhack dirigido contra él.',
        'Iniciativa Aumentada: Su Kerenzikov le permite reaccionar antes que la mayoría de atacantes.'
      ],
      loreSummary: 'Oficial de élite de la Red Chrome Legion en 2077, equipado con fusil Arasaka de contrabando militar y reflejos cableados para neutralizar mercenarios de alto calibre.'
    }
  },

  hammerhead_turret: {
    id: 'rcc-hammerhead-turret',
    name: 'Hammerhead Automated Ceiling Turret (Torreta Automática)',
    role: 'Emplaced Weapon / Automated Defense',
    placement: 'Front Car: Centro del vagón [⬢]. Empieza activa si el salto alertó al tren; si no, un guardia corre a activarla en el Turno 1 en [▣ Turret Control].',
    notes: 'Torreta blindada colgada del techo del vagón delantero. Puede ser controlada por un Netrunner en el Piso 5 del Mainframe para disparar contra la Legion.',
    spawnRules: {
      formula: 'Front Car: 1 Torreta empotrada fija en el centro del techo del vagón delantero [⬢].',
      byPartySize: {
        3: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        4: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        5: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 },
        6: { rearCar: 0, middleCar: 0, frontCar: 1, driverCar: 0, total: 1 }
      },
      defaultRearCount: 0,
      defaultFrontCount: 1,
      alertedBehavior: 'Si los PJs fallaron el salto de abordaje (alerta general), la torreta está ACTIVA e inicia disparando en el Turno 1 contra los intrusos. Si el abordaje fue sigiloso, permanece apagada hasta que un guardia use su acción en la Consola [▣ Turret Control] para activarla. Si un Netrunner conquista el Nodo de Control (Piso 5 del Mainframe), puede redirigir su fuego contra los guardias de la Legion.',
      notes: 'Montada en riel giroscópico de 360 grados en el techo. No tiene ángulos muertos en el Front Car y ofrece supresión implacable.'
    },
    lootDrops: [
      {
        id: 'rcl-loot-t-rifle',
        name: 'Militech Assault Rifle Desmontable (Militar)',
        category: 'weapon',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        harvestDifficultyDv: 13,
        description: 'Fusil de asalto pesado desmontable del afuste del techo mediante chequeo de Basic Tech DV 13.'
      },
      {
        id: 'rcl-loot-t-ammo',
        name: 'Cinta de Munición 5.56mm Belt-Fed (100 proyectiles)',
        category: 'ammo',
        quantity: 1,
        valueEb: 200,
        rarity: 'uncommon',
        description: 'Caja metálica de munición de alimentación por cinta para armas de soporte.'
      },
      {
        id: 'rcl-loot-t-core',
        name: 'Militech Targeting Optical Sensor & Coprocessor Unit',
        category: 'gear',
        quantity: 1,
        valueEb: 500,
        rarity: 'uncommon',
        harvestDifficultyDv: 14,
        description: 'Módulo óptico inteligente con cámara termográfica y procesador de telemetría extraíble con Cybertech DV 14.'
      },
      {
        id: 'rcl-loot-t-scrap',
        name: 'Chapas de Titanio y Blindaje SDP Desguazable',
        category: 'gear',
        quantity: 4,
        valueEb: 200,
        rarity: 'common',
        description: 'Placas de blindaje de aleación pesada útiles para reparación de vehículos o armaduras de combate.'
      },
      {
        id: 'rcl-loot-t-shard',
        name: 'Datashard de Diagnóstico Militech Autosecurity',
        category: 'shard',
        quantity: 1,
        valueEb: 100,
        rarity: 'uncommon',
        description: 'Shard de mantenimiento con credenciales de servicio y registros de telemetría del convoy.'
      }
    ],
    variant2045: {
      id: 'rcc-turret-2045',
      name: 'Hammerhead Automated Turret (2045)',
      subtitle: 'Torreta de Techo Militech Automatizada (CPRED pág. 214)',
      faction: 'Militech Automated Systems',
      threatTier: 'mini_boss',
      sourceBook: 'core',
      sourceBookTitle: 'Red Chrome Cargo // CPRED pág. 214',
      era: '2045',
      role: 'Emplaced Defense',
      hp: 25,
      seriouslyWounded: 13,
      deathSave: 5,
      headSp: 0,
      bodySp: 0,
      armorDetail: {
        headName: 'Domo Sensor Blindado SDP (25 HP)',
        headSp: 0,
        bodyName: 'Chasis Estructural de Acero y Titanio (25 HP)',
        bodySp: 0,
        notes: 'Objeto de resistencia estructural pura (25 SDP). No sufre ablación clásica de armadura; el daño reduce directamente sus puntos de estructura hasta quedar inoperativa.'
      },
      stats: {
        INT: 0,
        REF: 7,
        DEX: 0,
        TECH: 0,
        COOL: 0,
        WILL: 0,
        LUCK: 0,
        MOVE: 0,
        BODY: 5,
        EMP: 0
      },
      combatBases: [
        { label: 'Combat Number (Targeting AI)', totalBase: 14, damage: '5d6', rof: 1 },
        { label: 'Autofire Combat Number', totalBase: 14, damage: '2d6×4', rof: 1 }
      ],
      weapons: [
        {
          name: 'Automated Assault Rifle',
          skillBase: 14,
          damage: '5d6',
          rof: 1,
          mag: 30,
          category: 'turret',
          weaponType2077: 'Automated',
          ammoType: '5.56mm NATO Belt-Fed',
          currentAmmo: 100,
          criticalHitBonus: 'Fuego automatizado continuo. Disparo único 5d6 o ráfaga de Autofire 2d6×4 (multiplicador máx 4)',
          armorPiercing: true,
          notes: 'Alimentación por cinta interior de 100 disparos con sistema de guiado automatizado.'
        }
      ],
      armorHead: 'Estructura Mecánica SDP (25 HP)',
      armorBody: 'Estructura Mecánica SDP (25 HP)',
      cyberware: ['Mira I.A. Militech con Sensor Térmico'],
      cyberwareDetailed: [
        {
          name: 'Mira I.A. Militech con Sensor Térmico',
          slot: 'Hardware',
          effect: 'Módulo de apuntado térmico con Combat Number 14 integrado.',
          quickhackVulnerability: {
            hackName: 'Short Circuit',
            dv: 6,
            costRam: 2,
            targetEffect: '3d6 de daño directo al chasis eléctrico y aturdimiento del procesador por 1 turno.'
          }
        }
      ],
      gear: ['Montaje de techo giratorio de 360 grados'],
      specialRules: [
        'Disparo Automatizado: Dispara automáticamente al objetivo más cercano que no porte una baliza de identificación Militech.',
        'Controlable por Netrunner: Si un Netrunner hackea el Nodo de Control (Piso 5), puede tomar el mando como Acción de Red y disparar a los guardias de la Legion.'
      ],
      loreSummary: 'Sistema de armas robotizado instalado por Militech para evitar asaltos piratas al convoy de trenes.'
    },
    variant2077Cemk: {
      id: 'rcc-turret-2077',
      name: 'Hammerhead Automated Turret (2077 CEMK)',
      subtitle: 'Torreta Pesada Militech con Blindaje SP 7 y Fuego Inteligente',
      faction: 'Militech Automated Systems',
      threatTier: 'mini_boss',
      sourceBook: 'cemk_2077',
      sourceBookTitle: 'Red Chrome Cargo // CEMK 2077',
      era: '2077',
      role: 'Emplaced Defense',
      hp: 30,
      seriouslyWounded: 15,
      deathSave: 6,
      headSp: 7,
      bodySp: 7,
      armorDetail: {
        headName: 'Cúpula Blindada de Titanio Militech Hardened (SP 7)',
        headSp: 7,
        bodyName: 'Chasis Anti-Material Blindado (SP 7, SDP 30)',
        bodySp: 7,
        notes: 'En 2077 CEMK la torreta dispone de coraza deflectora SP 7 combinada con 30 HP estructurales. Daño igual o menor a 7 no penetra el chasis.'
      },
      stats: {
        INT: 0,
        REF: 7,
        DEX: 0,
        TECH: 0,
        COOL: 0,
        WILL: 0,
        LUCK: 0,
        MOVE: 0,
        BODY: 6,
        EMP: 0
      },
      combatBases: [
        { label: 'Combat Number (Militech Smart AI)', totalBase: 14, damage: '5d6', rof: 1 },
        { label: 'Autofire Combat Number', totalBase: 14, damage: '2d6×4', rof: 1 }
      ],
      weapons: [
        {
          name: 'Militech Automated Heavy Rifle [Power/Smart Hybrid]',
          skillBase: 14,
          damage: '5d6',
          rof: 1,
          mag: 30,
          category: 'turret',
          weaponType2077: 'Smart',
          ammoType: '5.56mm Smart Gyrojet Perforante',
          currentAmmo: 100,
          criticalHitBonus: '+5 a daño en heridas críticas. Autofire 2d6×4 con algoritmo Smart que reduce la penalización de cobertura a la mitad.',
          armorPiercing: true,
          specialFeatures: [
            'Riel giratorio motorizado de 360 grados en el techo',
            'Apuntado biométrico IFF Militech',
            'Supresión de área continua'
          ],
          notes: 'Fuego automatizado pesado con alta penetración y capacidad de supresión de pasillo.'
        }
      ],
      armorHead: 'Carcasa Blindada de Titanio Militech (SP 7)',
      armorBody: 'Carcasa Blindada de Titanio Militech (SP 7)',
      cyberware: ['Sensor I.A. con enlace a sub-red cableada'],
      cyberwareDetailed: [
        {
          name: 'Militech Smart Targeting AI Core',
          slot: 'Hardware',
          effect: 'Microordenador dedicado al rastreo térmico, IFF (amigo/enemigo) y seguimiento predictivo.',
          quickhackVulnerability: {
            hackName: 'Cyberware Malfunction / Weapon Glitch',
            dv: 6,
            costRam: 2,
            targetEffect: 'Bloquea el rotor de alimentación durante 1 turno completo impidiendo que abra fuego.',
            lucyKiwiSpecial: 'Lucy puede desviar su sensor térmico para que pierda el blanco fijado.'
          }
        },
        {
          name: 'Sub-Red Uplink Bus (Enlace al Mainframe del Tren)',
          slot: 'Hardware',
          effect: 'Conexión cableada por fibra óptica blindada al Piso 5 de la arquitectura NET del tren.',
          quickhackVulnerability: {
            hackName: 'Turret Friendly Fire / Memory Wipe',
            dv: 8,
            costRam: 4,
            targetEffect: 'Invierte la baliza de identificación durante 1 turno; la torreta dispara contra los miembros de la Red Chrome Legion más cercanos.',
            lucyKiwiSpecial: 'Kiwi puede hackearla directamente a distancia con línea de visión sin necesidad de jack-in físico.'
          }
        },
        {
          name: 'Servomotores Rotatorios de Techo 360°',
          slot: 'Hardware',
          effect: 'Giroscopio de rotación continua a 120 RPM para cubrir todo el vagón sin puntos ciegos.',
          quickhackVulnerability: {
            hackName: 'Short Circuit',
            dv: 6,
            costRam: 2,
            targetEffect: '3d6 de daño directo al chasis eléctrico e inmoviliza el rotor en su orientación actual por 2 turnos.'
          }
        }
      ],
      gear: ['Blindaje estructural y servomotores protegidos'],
      specialRules: [
        'Blindaje de Carcasa (SP 7): Requiere armas pesadas o tiros perforantes para dañarla de forma efectiva.',
        'Hackeable vía Quickhack: Puede ser desactivada o apagada con un Quickhack de Cyberware Malfunction o Turret Shutdown a través del enlace del vagón.'
      ],
      loreSummary: 'Torreta defensiva de grado militar actualizada en 2077 con blindaje balístico y microprocesador de disparo Militech.'
    }
  }
};

// ============================================================================
// 6. ESTRUCTURA DE LOS 4 VAGONES Y POSICIONES // TRAIN MAP & TOKENS (PÁG 4)
// ============================================================================

export interface TrainCarLayout {
  carId: 'rear' | 'middle' | 'front' | 'driver';
  name: string;
  gridDimensions: { width: number; height: number }; // En metros / casillas de 2m
  description: string;
  features: string[];
  initialEnemiesDesc: string;
}

export const HAMMERHEAD_TRAIN_CARS: TrainCarLayout[] = [
  {
    carId: 'rear',
    name: 'Rear Car (Vagón Trasero de Acceso)',
    gridDimensions: { width: 4, height: 12 },
    description: 'Vagón de cola con escotilla de mantenimiento en el techo y filas de contenedores altos que ofrecen cobertura.',
    features: [
      'Techo: Pasarela metálica para el salto inicial (DV 13 Athletics)',
      'Escotilla de Mantenimiento (Hatch): Cierre manual (DV 13 Basic Tech)',
      'Interior: Contenedores altos (Tall Crates) que bloquean línea de visión y permiten emboscadas sigilosas'
    ],
    initialEnemiesDesc: '2 Guardias con Escopeta (3 si hay 5+ jugadores)'
  },
  {
    carId: 'middle',
    name: 'Middle Car (Vagón Central — Almacén & Red)',
    gridDimensions: { width: 4, height: 12 },
    description: 'Vagón de carga pesada donde se aloja el cargamento secreto de Hornet y el terminal de acceso al Mainframe.',
    features: [
      "★ Cargamento de Hornet: 4 grandes cajas metálicas con cerraduras biométricas de ADN",
      "▲ Network Access Port: Puerto físico de conexión para Netrunners al Hammerhead Mainframe (5 pisos)",
      "Contenedores medianos apilados a ambos costados"
    ],
    initialEnemiesDesc: 'Vagón desocupado en el turno 1, pero los guardias de los vagones adyacentes pueden acudir si se desata el combate.'
  },
  {
    carId: 'front',
    name: 'Front Car (Vagón Delantero de Combate)',
    gridDimensions: { width: 4, height: 12 },
    description: 'Vagón blindado fuertemente custodiado con la Torreta Automática de techo y la consola de activación.',
    features: [
      "⬢ Automated Ceiling Turret: Torreta Militech colgada en el centro del techo",
      "▣ Turret Control Console: Consola de control manual para activar la torreta si el tren no fue alertado",
      "Puerta blindada que conecta con la cabina del conductor"
    ],
    initialEnemiesDesc: '1 Oficial de Asalto de la Legion + (Número de PJs - 1) Guardias con Escopeta'
  },
  {
    carId: 'driver',
    name: "Driver's Car (Cabina de Locomotora Blindada)",
    gridDimensions: { width: 4, height: 6 },
    description: 'Cabina delantera con ventanales blindados y consola de conducción autónoma de Militech.',
    features: [
      "● Train Control Console: Mandos de aceleración y parada de emergencia (DV 9 Drive Land Vehicle)",
      "Sistemas de radio y enlace de telemetría de vía"
    ],
    initialEnemiesDesc: 'Conducción automatizada sin tripulantes vivos; el Oficial de Asalto tiene la tarjeta de desbloqueo.'
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
    description: 'Punto de entrada desde el techo al interior del Rear Car (DV 13 Basic Tech).'
  },
  {
    id: 'token-net-port',
    name: 'Puerto de Acceso NET',
    carId: 'middle',
    symbol: '▲',
    color: '#00f5d4',
    description: 'Jack-in físico para conectar Cyberdecks a la arquitectura Hammerhead Mainframe de 5 pisos.'
  },
  {
    id: 'token-cargo-crates',
    name: "Cargamento de Hornet (4 Cajas)",
    carId: 'middle',
    symbol: '★',
    color: '#f59e0b',
    description: '4 contenedores militares sellados con cerraduras biométricas de ADN.'
  },
  {
    id: 'token-turret-control',
    name: 'Consola de Control de Torreta',
    carId: 'front',
    symbol: '▣',
    color: '#eab308',
    description: 'Interruptor manual para encender/apagar la torreta automática.'
  },
  {
    id: 'token-turret',
    name: 'Torreta Automática de Techo',
    carId: 'front',
    symbol: '⬢',
    color: '#ef4444',
    description: 'Torreta Militech de 360 grados con rifle de asalto (+14 atk, 5d6 daño, Autofire).'
  },
  {
    id: 'token-train-control',
    name: 'Mandos de Locomotora',
    carId: 'driver',
    symbol: '●',
    color: '#10b981',
    description: 'Consola de frenado de emergencia del tren (DV 9 Drive Land Vehicle).'
  }
];

// ============================================================================
// 7. HAMMERHEAD MANIFEST LOOT & HORNET'S 4 CRATES DATASET
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

export const HAMMERHEAD_MANIFEST_LOOT: RedChromeManifestEntry[] = [
  {
    consignmentId: 'consign-01',
    car: 'rear',
    cargoTitle: 'Envío Zhirafa Industrial: Servomotores y Chasis Robóticos',
    senderRecipient: 'Remitente: Zhirafa Robotics Mfg // Destino: Taller Mecánico North Oak',
    securityRating: 'Cierre Comercial de Muelle (DV 11 Basic Tech)',
    description: 'Palés de repuestos para maquinaria pesada GRAF 3, servomotores hidráulicos y cableado industrial blindado.',
    items: [
      {
        id: 'man-loot-01-servos',
        name: 'Servomotores Hidráulicos de Carga GRAF 3 (x2)',
        category: 'gear',
        quantity: 2,
        valueEb: 400,
        rarity: 'uncommon',
        description: 'Servomotores industriales de alta resistencia aplicables a vehículos o ciberextremidades pesadas.'
      },
      {
        id: 'man-loot-01-kit',
        name: 'Kit de Herramientas Tech Industrial Avanzado',
        category: 'gear',
        quantity: 1,
        valueEb: 300,
        rarity: 'uncommon',
        description: 'Herramientas de diagnóstico de taller que otorgan +1 a chequeos de Basic Tech en vehículos y maquinaria.'
      },
      {
        id: 'man-loot-01-batteries',
        name: 'Baterías Industriales de Litio-Grafeno (x4)',
        category: 'gear',
        quantity: 4,
        valueEb: 100,
        rarity: 'common',
        description: 'Células de energía recargables de alta densidad para equipo pesado.'
      }
    ],
    totalValueEb: 800,
    plotHook: 'Un Tech del grupo puede desguazar los servomotores para fabricar o reparar extremidades cibernéticas de alta calidad.'
  },
  {
    consignmentId: 'consign-02',
    car: 'middle',
    cargoTitle: "Cargamento Especial Encubierto: Las 4 Cajas Blindadas de Hornet",
    senderRecipient: 'Remitente: Cábala de Hombres de Traje Negro (Midnight Market) // Destinatario Original: Iron Sights (Robado por Red Chrome Legion)',
    securityRating: 'Cerraduras Biométricas ADN Arasaka / Hornet (DV 17 Pick Lock / Basic Tech)',
    description: 'Cuatro grandes cajas metálicas selladas al vacío con cerraduras codificadas por ADN. El botín prioritario de la misión.',
    items: [
      {
        id: 'man-loot-02-crate1',
        name: 'Caja 1: C2 y Granadas Militares de Demolición',
        category: 'gear',
        quantity: 1,
        valueEb: 2400,
        rarity: 'rare',
        description: 'Explosivos militares y detonadores encriptados para demoler barricadas de pandilla.'
      },
      {
        id: 'man-loot-02-crate2',
        name: 'Caja 2: Cyberware Militar Pesado (Sandevistan & Gorilla Arms)',
        category: 'cyberware',
        quantity: 1,
        valueEb: 4600,
        rarity: 'exotic',
        description: 'Lote de implantes de combate militar para acondicionamiento de operativos de choque.'
      },
      {
        id: 'man-loot-02-crate3',
        name: 'Caja 3: Armamento Pesado Especial (Sniper Tech & Lanzagranadas)',
        category: 'weapon',
        quantity: 1,
        valueEb: 4800,
        rarity: 'rare',
        description: 'Rifles y lanzagranadas pesados de precisión de contrabando militar.'
      },
      {
        id: 'man-loot-02-crate4',
        name: 'Caja 4: Botes de Neurotoxina Sintética "Hornet-V3"',
        category: 'gear',
        quantity: 1,
        valueEb: 4400,
        rarity: 'exotic',
        description: 'Frascos de neurotoxina letal aerosolizada diseñada personalmente por Hornet.'
      }
    ],
    totalValueEb: 16200,
    plotHook: 'El objetivo principal de la misión. Hornet paga 2,000 eb a cada mercenario por recuperar las 4 cajas intactas.'
  },
  {
    consignmentId: 'consign-03',
    car: 'middle',
    cargoTitle: 'Cargamento de Emergencia Traumatech / Biomédico',
    senderRecipient: 'Remitente: Trauma Team Logistics Depot // Destinatario: Puesto Médico Avanzado',
    securityRating: 'Sello Médico Electrónico (DV 13 Electronics/Security Tech)',
    description: 'Contenedor refrigerado presurizado con sueros sintéticos, fármacos de estabilización rápida y estimulantes de combate.',
    items: [
      {
        id: 'man-loot-03-blood',
        name: 'Bolsas de Sangre Sintética y Expansores de Plasma (x6)',
        category: 'gear',
        quantity: 6,
        valueEb: 300,
        rarity: 'common',
        description: 'Fluidos para transfusiones de choque que estabilizan instantáneamente a personajes en Death Save.'
      },
      {
        id: 'man-loot-03-speedheal',
        name: 'Inyectores Militares Speedheal (x4)',
        category: 'gear',
        quantity: 4,
        valueEb: 400,
        rarity: 'uncommon',
        description: 'Fármaco de regeneración celular que cura el doble del BODY de HP durante 24 horas tras el descanso.'
      },
      {
        id: 'man-loot-03-stims',
        name: 'Estimulantes de Combate Black Lace / Synthcoke (x5)',
        category: 'gear',
        quantity: 5,
        valueEb: 250,
        rarity: 'uncommon',
        description: 'Drogas de combate que anestesian el dolor (+2 a tiradas de Resist Torture/Drugs e inmunidad a penalizadores de herida).'
      },
      {
        id: 'man-loot-03-defib',
        name: 'Desfibrilador de Bolsillo Traumatech',
        category: 'gear',
        quantity: 1,
        valueEb: 250,
        rarity: 'uncommon',
        description: 'Dispositivo médico portátil para revivir a un personaje cuyo Death Save ha fallado en el mismo turno (First Aid DV 15).'
      }
    ],
    totalValueEb: 1200,
    plotHook: 'Proporciona una fuente crucial de salvamento médico inmediato a personajes heridos en combate sobre el tren.'
  },
  {
    consignmentId: 'consign-04',
    car: 'front',
    cargoTitle: 'Armero de Campaña y Racks de Munición Militech',
    senderRecipient: 'Remitente: Militech Armory 04 // Destino: Puesto de Guarnición Norte',
    securityRating: 'Jaula Blindada de Armamento (DV 15 Basic Tech / Pick Lock)',
    description: 'Armero fijado a los mamparos del vagón delantero con cajas metálicas de munición pesada y granadas tácticas.',
    items: [
      {
        id: 'man-loot-04-ammo-rifle',
        name: 'Cajas de Munición Perforante 5.56mm AP (x120)',
        category: 'ammo',
        quantity: 120,
        valueEb: 240,
        rarity: 'common',
        description: 'Proyectiles de punta de carburo que ablaran 2 SP de blindaje en impactos exitosos.'
      },
      {
        id: 'man-loot-04-ammo-sg',
        name: 'Cajas de Postas Sólidas Slug 12ga (x40)',
        category: 'ammo',
        quantity: 40,
        valueEb: 160,
        rarity: 'common',
        description: 'Cartuchos sólidos de escopeta para alcance medio con 5d6 de daño.'
      },
      {
        id: 'man-loot-04-emp',
        name: 'Granadas de Pulso EMP Militech (x4)',
        category: 'gear',
        quantity: 4,
        valueEb: 400,
        rarity: 'rare',
        description: 'Granadas arrojadizas que desactivan implantes cibernéticos y la torreta durante 1 turno completo (DV 15 Athletics para lanzar).'
      },
      {
        id: 'man-loot-04-flashbang',
        name: 'Granadas de Aturdimiento Flashbang y Humo Térmico (x6)',
        category: 'gear',
        quantity: 6,
        valueEb: 300,
        rarity: 'common',
        description: 'Granadas tácticas que ciegan y aturden a los ocupantes de un vagón (DV 13 Resist Torture/Drugs).'
      },
      {
        id: 'man-loot-04-plates',
        name: 'Placas Balísticas de Kevlar de Repuesto (SP 11, x2)',
        category: 'armor',
        quantity: 2,
        valueEb: 400,
        rarity: 'uncommon',
        description: 'Placas de inserción rápida para reparar armaduras ablaradas en combate.'
      }
    ],
    totalValueEb: 1500,
    plotHook: 'Permite a los jugadores rearmarse antes de asegurar las cajas o enfrentarse a la torreta automática.'
  },
  {
    consignmentId: 'consign-05',
    car: 'driver',
    cargoTitle: 'Caja Fuerte de Contingencia de la Locomotora',
    senderRecipient: 'Remitente: Militech Payroll Division // Custodia: Conductor Automatizado',
    securityRating: 'Caja Fuerte Digital Blindada (DV 15 Electronics/Security Tech o Llave Maestra del Oficial)',
    description: 'Compartimento blindado de acero al wolframio empotrado bajo los mandos de la locomotora con fondos de contingencia.',
    items: [
      {
        id: 'man-loot-05-credchips',
        name: 'Credchips Corporativos al Portador Sin Rastrear',
        category: 'eb',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        description: 'Eurodólares en efectivo digital listos para gastar sin dejar rastro de red.'
      },
      {
        id: 'man-loot-05-route-shard',
        name: 'Datashard: "Protocolo de Emergencia Ferroviaria Militech"',
        category: 'shard',
        quantity: 1,
        valueEb: 100,
        rarity: 'uncommon',
        description: 'Documentación técnica con códigos de desvío de agujas y frecuencias de radio del convoy.'
      },
      {
        id: 'man-loot-05-firstaid',
        name: 'Botiquín de Primeros Auxilios de Cabina',
        category: 'gear',
        quantity: 1,
        valueEb: 50,
        rarity: 'common',
        description: 'Vendas hemostáticas, antisépticos y analgésicos de urgencia.'
      }
    ],
    totalValueEb: 1150,
    plotHook: 'Botín extra directo para mercenarios astutos que investiguen la locomotora antes de abandonar el Hammerhead.'
  }
];

export const HORNET_CRATES_LOOT: RedChromeCrateLoot[] = [
  {
    crateNumber: 1,
    label: 'Caja 1: Suministros Militares de Demolición',
    intendedRecipient: 'Iron Sights (Célula de Asalto de la Zona de Combate)',
    securityDv: 'DV 17 Pick Lock / Basic Tech (Cerradura biométrica ADN Arasaka/Iron Sights)',
    transportRequirement: 'Requiere ambas manos de 1 PJ para transportar (o 2 PJs si se corre a toda velocidad). Salto de vuelta DV 15 Athletics cargándola, o DV 13 lanzarla.',
    biologicalRisk: 'Sin riesgo biológico. Peligro de detonación si sufre 25 puntos de daño estructural por fuego concentrado.',
    contents: [
      {
        id: 'crate-1-c2',
        name: 'Bloques de C2 Plastique Militar (x6)',
        category: 'gear',
        quantity: 6,
        valueEb: 1200,
        rarity: 'rare',
        description: 'Explosivo plástico militar de alta densidad. Cada bloque inflige 6d6 de daño a estructuras o vehículos.'
      },
      {
        id: 'crate-1-detonators',
        name: 'Detonadores Remotos de Frecuencia Encriptada (x8)',
        category: 'gear',
        quantity: 8,
        valueEb: 400,
        rarity: 'uncommon',
        description: 'Detonadores a control remoto con alcance de 1 km y código de activación inmune a inhibidores de radio.'
      },
      {
        id: 'crate-1-thermite',
        name: 'Granadas Térmicas Incendiarias de Magnesio (x4)',
        category: 'gear',
        quantity: 4,
        valueEb: 800,
        rarity: 'rare',
        description: 'Granadas que funden cerraduras, mamparos y blindajes generando 4d6 daño térmico continuo durante 3 turnos.'
      }
    ],
    totalValueEb: 2400,
    gmNotes: 'Suministrado por la cábala de hombres de traje negro para que los Iron Sights vuelen los búnkeres de la Red Chrome Legion en la Zona de Combate.'
  },
  {
    crateNumber: 2,
    label: 'Caja 2: Implantes de Cyberware Militar Pesado',
    intendedRecipient: 'Iron Sights (Célula Cibernética / FBC Refits)',
    securityDv: 'DV 17 Pick Lock / Basic Tech (Cerradura biométrica ADN)',
    transportRequirement: 'Requiere ambas manos de 1 PJ para transportar. Salto de vuelta DV 15 Athletics o lanzar DV 13.',
    biologicalRisk: 'Contiene fluido de conservación biónico criogénico neutro y sellado al vacío.',
    contents: [
      {
        id: 'crate-2-sandevistan',
        name: 'Sandevistan Speedware Militar Mk.1',
        category: 'cyberware',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        description: 'Acelerador neural de velocidad de combate (+3 a Reflejos e Iniciativa durante 3 turnos tras activarlo).'
      },
      {
        id: 'crate-2-gorilla',
        name: 'Par de Brazos Cibernéticos Reforzados con Gorilla Arms',
        category: 'cyberware',
        quantity: 2,
        valueEb: 2000,
        rarity: 'exotic',
        description: 'Brazos cibernéticos de aleación pesada con servomotores hidráulicos que conceden BODY 11 para levantar pesos y daño 3d6 en Brawling.'
      },
      {
        id: 'crate-2-subdermal',
        name: 'Placas Subdérmicas de Blindaje SP 12',
        category: 'cyberware',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        description: 'Blindaje subcutáneo militar completo de polímero compuesto con SP 12 sin penalizador de movimiento.'
      },
      {
        id: 'crate-2-chips',
        name: 'Chipware de Táctica Militar M80 y Armas Pesadas (x2)',
        category: 'cyberware',
        quantity: 2,
        valueEb: 600,
        rarity: 'uncommon',
        description: 'Chips de datos que conceden base +12 en Tactics y Heavy Weapons a quien tenga un Neural Link.'
      }
    ],
    totalValueEb: 4600,
    gmNotes: 'El botín más valioso para los mercenarios. Si los PJs deciden quedarse este cyberware y no entregárselo a Hornet, Hornet pondrá precio a sus cabezas de inmediato.'
  },
  {
    crateNumber: 3,
    label: 'Caja 3: Armamento Pesado Especial y Munición Especializada',
    intendedRecipient: 'Iron Sights (Tiradores de Apoyo Pesado)',
    securityDv: 'DV 17 Pick Lock / Basic Tech (Cerradura biométrica ADN)',
    transportRequirement: 'Requiere ambas manos de 1 PJ para transportar. Salto de vuelta DV 15 Athletics o lanzar DV 13.',
    biologicalRisk: 'Sin riesgo biológico.',
    contents: [
      {
        id: 'crate-3-sniper',
        name: 'Militech Urban Tech Sniper Rifle con Óptica Térmica',
        category: 'weapon',
        quantity: 1,
        valueEb: 1500,
        rarity: 'rare',
        description: 'Rifle de francotirador Tech (5d6 daño, ROF 1, mag 6) capaz de disparar a través de muros y vehículos.'
      },
      {
        id: 'crate-3-grenade-launcher',
        name: 'Lanzagranadas Compacto Tsunami Arms',
        category: 'weapon',
        quantity: 1,
        valueEb: 2000,
        rarity: 'rare',
        description: 'Lanzagranadas de tambor de 6 proyectiles con munición de alto explosivo (6d6 daño en área de 6m).'
      },
      {
        id: 'crate-3-ap-ammo',
        name: 'Cajas de Munición AP Perforante .50 BMG y 7.62mm (x100)',
        category: 'ammo',
        quantity: 100,
        valueEb: 800,
        rarity: 'uncommon',
        description: 'Munición perforante militar de alta velocidad que ignora 2 puntos de SP en cada impacto.'
      },
      {
        id: 'crate-3-tech-batteries',
        name: 'Micro-Baterías de Carga Rápida para Armas Tech (x5)',
        category: 'gear',
        quantity: 5,
        valueEb: 500,
        rarity: 'common',
        description: 'Baterías de ferro-titanio de recarga rápida indispensables para armamento Tech.'
      }
    ],
    totalValueEb: 4800,
    gmNotes: 'Armas de grado militar pesado destinadas a nivelar la balanza bélica en el norte de Night City a favor de los Iron Sights.'
  },
  {
    crateNumber: 4,
    label: 'Caja 4: El As Secreto de Hornet — Neurotoxina Sintética "Hornet-V3"',
    intendedRecipient: 'Hornet (Bajo custodia encubierta para los Iron Sights)',
    securityDv: 'DV 17 Pick Lock / Basic Tech (Cerradura codificada con ADN personal de Hornet)',
    transportRequirement: 'Manejar con extrema delicadeza. Si un PJ cae o falla el salto de vuelta por 5 o más, los viales sufren microfisuras.',
    biologicalRisk: '¡PELIGRO EXTREMO! Fuga química aerosolizada: Quien esté en el mismo vagón sin filtros nasales debe superar Resist Torture/Drugs DV 15 o sufrir 4d6 de daño directo al HP e incapacitación inmediata por asfixia.',
    contents: [
      {
        id: 'crate-4-toxin-vials',
        name: 'Botes Herméticos de Cristal de Titanio con Neurotoxina "Hornet-V3" (x6)',
        category: 'gear',
        quantity: 6,
        valueEb: 3000,
        rarity: 'exotic',
        description: 'Viales con neurotoxina sintética de grado militar fabricada por Hornet para exterminar a la Red Chrome Legion.'
      },
      {
        id: 'crate-4-hornet-shard',
        name: 'Datashard Personal de Hornet: "Protocolo Asesino Iron Sights"',
        category: 'shard',
        quantity: 1,
        valueEb: 1000,
        rarity: 'rare',
        description: 'Shard personal con las notas y fórmulas químicas de Hornet, de altísimo valor para periodistas de investigación o el NCPD.'
      },
      {
        id: 'crate-4-antidote',
        name: 'Viales de Inyector con Antídoto Universal contra Toxina (x2)',
        category: 'gear',
        quantity: 2,
        valueEb: 400,
        rarity: 'rare',
        description: 'Contramedida química que neutraliza instantáneamente los efectos letales de la neurotoxina Hornet-V3.'
      }
    ],
    totalValueEb: 4400,
    gmNotes: 'El secreto más oscuro de Hornet. Ocultó este cargamento biológico a los mercenarios. Si la Red Chrome Legion o los Iron Sights lo liberan, la Zona de Combate sufrirá un genocidio químico.'
  }
];

