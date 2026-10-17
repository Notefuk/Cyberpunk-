/**
 * RED CHROME CARGO // ONESHOT CANÓNICO OFICIAL CYBERPUNK RED
 * Conversión completa y dual (2045 Clásico + 2077 CEMK Escalado)
 * Fuentes: Cyberpunk RED Core Rulebook Screamsheet "Red Chrome Cargo" (págs. 1-4)
 */

import type { EnemySheet } from './enemiesCatalog';
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

export interface RedChromeEnemySheet extends EnemySheet {
  armorHead?: string;
  armorBody?: string;
  roleRank?: number;
}

export interface RedChromeDualEnemyProfile {
  id: string;
  name: string;
  role: string;
  placement: string;
  notes: string;
  variant2045: RedChromeEnemySheet;
  variant2077Cemk: RedChromeEnemySheet;
}

export const RED_CHROME_ENEMY_PROFILES: Record<string, RedChromeDualEnemyProfile> = {
  rcl_shotgun_guard: {
    id: 'rcc-shotgun-guard',
    name: 'Red Chrome Legion Guard (Escopetero)',
    role: 'Solo / Boosterganger',
    placement: 'Rear Car: 2 guardias (3 si hay 5+ PJs). Front Car: PJs - 1 guardias.',
    notes: 'Poco disciplinados pero fanáticos y despiadados. Usan escopetas para controlar los pasillos angostos del tren.',
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
        { name: 'Shotgun', skillBase: 10, damage: '5d6', rof: 1, mag: 4, notes: 'Postas / Balines en cono' },
        { name: 'Very Heavy Pistol', skillBase: 10, damage: '4d6', rof: 1, mag: 8 },
        { name: 'Rippers', skillBase: 9, damage: '2d6', rof: 2, mag: 0 }
      ],
      armorHead: 'Sin Blindaje (SP 0)',
      armorBody: 'Chaqueta de Cuero Reforzado (Leathers SP 4)',
      cyberware: [
        'Neuroport Básico (Vulnerable a Quickhacks)',
        'Cybereye con Chyron',
        'Rippers (Cuchillas de Dedos retractiles)'
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
          name: 'Rostović DB-2 Satara [Tech Shotgun] / Carnage [Power Shotgun]',
          skillBase: 12,
          damage: '5d6',
          rof: 1,
          mag: 4,
          notes: 'Disparo Tech que atraviesa cobertura del tren o Power con +5 a daño crítico'
        },
        {
          name: 'Militech Lexington [Power Pistol]',
          skillBase: 12,
          damage: '3d6',
          rof: 2,
          mag: 21,
          notes: 'Disparo de ráfaga rápida con rebote'
        },
        {
          name: 'Rippers Cromados',
          skillBase: 11,
          damage: '2d6',
          rof: 2,
          mag: 0
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
          notes: 'Disparo único (5d6) o Autofire (2d6×4, multiplicador máx 4)'
        },
        {
          name: 'Very Heavy Pistol',
          skillBase: 13,
          damage: '4d6',
          rof: 1,
          mag: 8
        },
        {
          name: 'Heavy Melee Weapon (Maza Pesada)',
          skillBase: 11,
          damage: '3d6',
          rof: 2,
          mag: 0,
          notes: 'Ignora la mitad del SP del objetivo'
        }
      ],
      armorHead: 'Casco Kevlar (SP 7)',
      armorBody: 'Chaleco Táctico Kevlar (SP 7)',
      cyberware: [
        'Neuroport Básico',
        'Subdermal Pocket (Bolsillo subdérmico)',
        'Nasal Filters (Inmunidad a gases y humos)'
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
          notes: 'Ráfaga de precisión militar. Autofire 2d6×4 (DV 17) con rebote de metralla y +5 daño crítico'
        },
        {
          name: 'Tsunami Nue [Power Heavy Pistol]',
          skillBase: 14,
          damage: '4d6',
          rof: 1,
          mag: 10
        },
        {
          name: 'Espada Térmica Pesada [Thermal Blade]',
          skillBase: 13,
          damage: '3d6',
          rof: 2,
          mag: 0,
          notes: 'Ignora mitad de SP y prende fuego si inflige herida crítica'
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
          notes: 'Disparo único 5d6 o ráfaga de Autofire 2d6×4 (multiplicador máx 4)'
        }
      ],
      armorHead: 'Estructura Mecánica SDP (25 HP)',
      armorBody: 'Estructura Mecánica SDP (25 HP)',
      cyberware: ['Mira I.A. Militech con Sensor Térmico'],
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
          name: 'Militech Automated Heavy Rifle [Power]',
          skillBase: 14,
          damage: '5d6',
          rof: 1,
          mag: 30,
          notes: 'Fuego automatizado pesado con +5 a daño de heridas críticas y Autofire 2d6×4'
        }
      ],
      armorHead: 'Carcasa Blindada de Titanio Militech (SP 7)',
      armorBody: 'Carcasa Blindada de Titanio Militech (SP 7)',
      cyberware: ['Sensor I.A. con enlace a sub-red cableada'],
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
