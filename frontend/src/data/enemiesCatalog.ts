import type {
  CharacterEra,
  CharacterSheet,
  CombatSkillKey,
  EquippedWeapon,
  StatKey
} from '../types/cyberpunk';

export type ThreatTier =
  | 'mook'
  | 'hardened_mook'
  | 'lieutenant'
  | 'hardened_lieutenant'
  | 'mini_boss'
  | 'boss'
  | 'cyberpsycho'
  | 'legend';

export type SourceBookId =
  | 'core'
  | 'black_chrome'
  | 'cemk_2077'
  | 'interface_red'
  | 'danger_gal'
  | 'dlc';

export interface EnemyCombatBase {
  label: string;
  totalBase: number;
  damage?: string;
  rof?: number;
  notes?: string;
}

export interface EnemyWeaponProfile {
  name: string;
  skillBase: number;
  damage: string;
  rof: number;
  mag: number;
  notes?: string;
}

export interface EnemySheet {
  id: string;
  name: string;
  subtitle: string;
  faction: string;
  threatTier: ThreatTier;
  sourceBook: SourceBookId;
  sourceBookTitle: string;
  era: CharacterEra;
  role: string;
  hp: number;
  seriouslyWounded: number;
  deathSave: number;
  headSp: number;
  bodySp: number;
  stats: Record<StatKey, number>;
  combatBases: EnemyCombatBase[];
  weapons: EnemyWeaponProfile[];
  cyberware: string[];
  gear: string[];
  specialRules: string[];
  loreSummary: string;
}

// ============================================================================
// MASTER ENEMIES & GOONS CATALOG (44 Canonical Sheets)
// ============================================================================

export const ENEMIES_CATALOG: EnemySheet[] = [
  // --------------------------------------------------------------------------
  // 1. CORE RULEBOOK (2045 Core)
  // --------------------------------------------------------------------------
  {
    id: 'core-boosterganger',
    name: 'Boosterganger',
    subtitle: 'Pandillero callejero adicto al cromo y a la violencia',
    faction: 'Pandillas Callejeras',
    threatTier: 'mook',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Solo',
    hp: 20,
    seriouslyWounded: 10,
    deathSave: 4,
    headSp: 4,
    bodySp: 4,
    stats: { INT: 2, REF: 6, DEX: 6, TECH: 2, COOL: 4, WILL: 3, LUCK: 0, MOVE: 6, BODY: 4, EMP: 2 },
    combatBases: [
      { label: 'Disparo Pistola', totalBase: 10, damage: '2d6', rof: 2 },
      { label: 'Pelea Desarmada / Navaja', totalBase: 10, damage: '1d6', rof: 2 },
      { label: 'Esquiva General', totalBase: 10 }
    ],
    weapons: [
      { name: 'Medium Pistol', skillBase: 10, damage: '2d6', rof: 2, mag: 12 },
      { name: 'Light Melee Weapon (Navaja)', skillBase: 10, damage: '1d6', rof: 2, mag: 0 }
    ],
    cyberware: ['Techhair', 'Chemskin', 'Cybereye (Color Shift)'],
    gear: ['Leathers (SP 4 Cabeza y Torso)', 'Agent barato', 'Dosis de Smash'],
    specialRules: ['Comportamiento imprudente: huye si recibe una Herida Crítica o queda a Seriously Wounded.'],
    loreSummary: 'Carne de cañón estándar de las calles de Night City. Suelen emboscar en grupos de 3 o más armados con armas baratas.'
  },
  {
    id: 'core-bodyguard',
    name: 'Bodyguard',
    subtitle: 'Guardaespaldas profesional de contrato privado',
    faction: 'Seguridad Privada',
    threatTier: 'mook',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Solo',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 7,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 4, REF: 7, DEX: 6, TECH: 3, COOL: 6, WILL: 5, LUCK: 0, MOVE: 5, BODY: 7, EMP: 4 },
    combatBases: [
      { label: 'Pistola Pesada', totalBase: 12, damage: '3d6', rof: 2 },
      { label: 'Escopeta Cartucho', totalBase: 11, damage: '5d6', rof: 1 },
      { label: 'Combate Cuerpo a Cuerpo', totalBase: 11, damage: '2d6', rof: 2 },
      { label: 'Esquiva', totalBase: 11 }
    ],
    weapons: [
      { name: 'Heavy Pistol', skillBase: 12, damage: '3d6', rof: 2, mag: 8 },
      { name: 'Shotgun', skillBase: 11, damage: '5d6', rof: 1, mag: 4 }
    ],
    cyberware: ['Neuralware Processor', 'Interface Plugs', 'Subdermal Pocket'],
    gear: ['Kevlar Head (SP 7)', 'Light Armorjack Body (SP 11)', 'Agent', 'Radio Communicator'],
    specialRules: ['Prioridad de escolta: usará su cuerpo para otorgar cobertura a su VIP asignado.'],
    loreSummary: 'Entrenados para repeler secuestros y tiroteos repentinos en eventos de Fixers o reuniones de negocios.'
  },
  {
    id: 'core-road-ganger',
    name: 'Road Ganger',
    subtitle: 'Pirata del asfalto de los Badlands y autopistas',
    faction: 'Bandas Nómadas / Asaltantes',
    threatTier: 'mook',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Nomad',
    hp: 30,
    seriouslyWounded: 15,
    deathSave: 6,
    headSp: 7,
    bodySp: 7,
    stats: { INT: 3, REF: 6, DEX: 6, TECH: 5, COOL: 4, WILL: 4, LUCK: 0, MOVE: 6, BODY: 6, EMP: 3 },
    combatBases: [
      { label: 'Fusil Asalto / Carrocería', totalBase: 11, damage: '5d6', rof: 1 },
      { label: 'Pistola Pesada', totalBase: 11, damage: '3d6', rof: 2 },
      { label: 'Conducción Vehículo', totalBase: 12 }
    ],
    weapons: [
      { name: 'Assault Rifle', skillBase: 11, damage: '5d6', rof: 1, mag: 25 },
      { name: 'Heavy Pistol', skillBase: 11, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Interface Plugs'],
    gear: ['Kevlar (SP 7 Cabeza y Cuerpo)', 'Kit de herramientas', 'Gafas antipolvo'],
    specialRules: ['Asalto motorizado: +2 a tiradas de disparo mientras su vehículo está en movimiento.'],
    loreSummary: 'Asaltan convoyes de suministros en las rutas periféricas de Night City en motos y camionetas modificadas.'
  },
  {
    id: 'core-security-operative',
    name: 'Security Operative',
    subtitle: 'Guardia de seguridad de instalaciones corporativas',
    faction: 'Corporaciones',
    threatTier: 'mook',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Lawman',
    hp: 30,
    seriouslyWounded: 15,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 4, REF: 6, DEX: 6, TECH: 3, COOL: 5, WILL: 5, LUCK: 0, MOVE: 5, BODY: 6, EMP: 4 },
    combatBases: [
      { label: 'Subfusil Pesado', totalBase: 11, damage: '3d6', rof: 1 },
      { label: 'Porra Aturdidora', totalBase: 10, damage: '2d6', rof: 2 },
      { label: 'Percepción de Alarma', totalBase: 11 }
    ],
    weapons: [
      { name: 'Heavy SMG', skillBase: 11, damage: '3d6', rof: 1, mag: 30, notes: 'Autofire x3' },
      { name: 'Stun Baton', skillBase: 10, damage: '2d6', rof: 2, mag: 0 }
    ],
    cyberware: ['Internal Agent', 'Audio Communicator'],
    gear: ['Kevlar Head (SP 7)', 'Light Armorjack Body (SP 11)', 'Esposas de seguridad', 'Tarjeta de acceso'],
    specialRules: ['Protocolo de alarma: Si no es abatido en 2 turnos, activa la alarma general del edificio.'],
    loreSummary: 'Vigilan plantas de datos, vestíbulos corporativos y almacenes de Night City.'
  },
  {
    id: 'core-outrider',
    name: 'Outrider',
    subtitle: 'Explorador y francotirador nómada veterano',
    faction: 'Familias Nómadas',
    threatTier: 'lieutenant',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Nomad',
    hp: 40,
    seriouslyWounded: 20,
    deathSave: 7,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 6, REF: 8, DEX: 7, TECH: 5, COOL: 6, WILL: 6, LUCK: 2, MOVE: 7, BODY: 7, EMP: 5 },
    combatBases: [
      { label: 'Fusil Francotirador', totalBase: 14, damage: '5d6', rof: 1 },
      { label: 'Pistola Pesada', totalBase: 13, damage: '3d6', rof: 2 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 13 },
      { label: 'Rastreo y Percepción', totalBase: 13 }
    ],
    weapons: [
      { name: 'Sniper Rifle', skillBase: 14, damage: '5d6', rof: 1, mag: 4 },
      { name: 'Heavy Pistol', skillBase: 13, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Cybereye (Targeting Scope)', 'Interface Plugs', 'Teleoptics'],
    gear: ['Light Armorjack (SP 11 Cabeza y Cuerpo)', 'Prismáticos IR', 'Moto Nómada'],
    specialRules: ['Tirador emboscado: Su primer disparo desde cobertura oculta inflige +3 al daño base.'],
    loreSummary: 'Guarda las fronteras de los convoyes nómadas y embosca a patrullas corporativas a cientos de metros de distancia.'
  },
  {
    id: 'core-netrunner-operative',
    name: 'Netrunner Operativo',
    subtitle: 'Especialista en intrusión de sistemas y Black ICE',
    faction: 'Mercenarios Libres',
    threatTier: 'lieutenant',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Netrunner',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 5,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 8, REF: 6, DEX: 6, TECH: 7, COOL: 5, WILL: 6, LUCK: 2, MOVE: 5, BODY: 5, EMP: 5 },
    combatBases: [
      { label: 'Interface Netrunning', totalBase: 14 },
      { label: 'Pistola Pesada', totalBase: 11, damage: '3d6', rof: 2 },
      { label: 'Electrónica y Cibertech', totalBase: 13 }
    ],
    weapons: [
      { name: 'Heavy Pistol', skillBase: 11, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Neural Link', 'Interface Plugs', 'Chyron'],
    gear: ['Cyberdeck estándar (7 ranuras)', 'Programas: Sword, Armor, Eraser, Hellhound Black ICE', 'Light Armorjack Body (SP 11)'],
    specialRules: ['3 Net Actions por turno dentro de una Arquitectura de Red.'],
    loreSummary: 'Contratado para desactivar torretas, borrar grabaciones y defender terminales de datos.'
  },
  {
    id: 'core-reclaimer-chief',
    name: 'Reclaimer Chief',
    subtitle: 'Líder de supervivientes de las ruinas nucleares',
    faction: 'Reclaimers',
    threatTier: 'mini_boss',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Solo',
    hp: 50,
    seriouslyWounded: 25,
    deathSave: 8,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 6, REF: 7, DEX: 7, TECH: 6, COOL: 7, WILL: 7, LUCK: 3, MOVE: 6, BODY: 8, EMP: 5 },
    combatBases: [
      { label: 'Escopeta Pesada', totalBase: 14, damage: '5d6', rof: 1 },
      { label: 'Maza Pesada / Martillo', totalBase: 13, damage: '3d6', rof: 2 },
      { label: 'Esquiva y Atletismo', totalBase: 13 }
    ],
    weapons: [
      { name: 'Shotgun', skillBase: 14, damage: '5d6', rof: 1, mag: 8 },
      { name: 'Heavy Melee Weapon (Martillo Industrial)', skillBase: 13, damage: '3d6', rof: 2, mag: 0 }
    ],
    cyberware: ['Subdermal Pocket', 'Cyberarm (Big Knucks)', 'Nasal Filters'],
    gear: ['Light Armorjack Head (SP 11)', 'Heavy Armorjack Body (SP 13)', 'Medtech Bag'],
    specialRules: ['Comandante de trinchera: Los aliados dentro de 10m ganan +1 a tiradas de Concentration.'],
    loreSummary: 'Guerreros endurecidos que reconstruyen las zonas radiactivas de Night City defendiéndose de corps y saqueadores.'
  },
  {
    id: 'core-street-cyberpsycho',
    name: 'Cyberpsycho Callejero',
    subtitle: 'Edgerunner devorado por el cromo en frenesí homicida',
    faction: 'Ciberpsicópatas',
    threatTier: 'cyberpsycho',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Solo',
    hp: 55,
    seriouslyWounded: 28,
    deathSave: 10,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 3, REF: 8, DEX: 8, TECH: 4, COOL: 4, WILL: 8, LUCK: 1, MOVE: 8, BODY: 10, EMP: 0 },
    combatBases: [
      { label: 'Garras / Ciberbrazos Asalto', totalBase: 15, damage: '3d6', rof: 2 },
      { label: 'Subfusil Automático', totalBase: 14, damage: '3d6', rof: 1 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 15 }
    ],
    weapons: [
      { name: 'Heavy SMG', skillBase: 14, damage: '3d6', rof: 1, mag: 40, notes: 'Autofire x3' },
      { name: 'Cyberarm with Ripper Blades', skillBase: 15, damage: '3d6', rof: 2, mag: 0 }
    ],
    cyberware: ['Sandevistan Speedware (+3 Init)', '2x Cyberarms', 'Subdermal Armor (SP 11)', 'Pain Editor'],
    gear: ['Heavy Armorjack (SP 13 Body)', 'Restos de munición'],
    specialRules: [
      'Inmune al dolor: Ignora todas las penalizaciones de Seriously Wounded por Pain Editor.',
      'Frenesí de cromo: Ataca al objetivo visible más cercano sin importar lealtades.'
    ],
    loreSummary: 'Una tragedia andante de metal y locura. El objetivo prioritario de las patrullas MaxTac.'
  },
  {
    id: 'core-pyro',
    name: 'Pyro / Especialista en Incendios',
    subtitle: 'Fanático pirómano armado con lanzallamas y cócteles',
    faction: 'Pandillas Callejeras / Inquisidores',
    threatTier: 'mook',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook',
    era: '2045',
    role: 'Solo',
    hp: 30,
    seriouslyWounded: 15,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 3, REF: 6, DEX: 6, TECH: 4, COOL: 4, WILL: 6, LUCK: 0, MOVE: 5, BODY: 6, EMP: 2 },
    combatBases: [
      { label: 'Lanzallamas / Armas Pesadas', totalBase: 11, damage: '4d6', rof: 1, notes: 'Área fuego' },
      { label: 'Lanzar Granadas Incendiarias', totalBase: 11, damage: 'Incendiario' }
    ],
    weapons: [
      { name: 'Flamethrower', skillBase: 11, damage: '4d6', rof: 1, mag: 4, notes: 'Prende fuego al objetivo (2 HP/turno)' }
    ],
    cyberware: ['Nasal Filters', 'Subdermal Pocket'],
    gear: ['Traje ignífugo Kevlar (SP 7 Cabeza, SP 11 Torso)', '2x Granadas Incendiarias'],
    specialRules: ['Depósito inestable: Si el Pyro recibe un impacto crítico en el torso, el tanque puede detonar (DV 13 TECH).'],
    loreSummary: 'Usado por bandas como los Inquisidores para quemar ciberclínicas y purificar la carne.'
  },

  // --------------------------------------------------------------------------
  // 2. HARDENED ENEMIES DLCS (2045 DLC)
  // --------------------------------------------------------------------------
  {
    id: 'dlc-hardened-bodyguard',
    name: 'Hardened Bodyguard',
    subtitle: 'Escolta táctico blindado con implantes de reflejos',
    faction: 'Seguridad Corporativa / Élite',
    threatTier: 'hardened_mook',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 45,
    seriouslyWounded: 23,
    deathSave: 8,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 5, REF: 8, DEX: 7, TECH: 4, COOL: 6, WILL: 6, LUCK: 1, MOVE: 6, BODY: 8, EMP: 4 },
    combatBases: [
      { label: 'Pistola Muy Pesada', totalBase: 14, damage: '4d6', rof: 1 },
      { label: 'Escopeta Asalto', totalBase: 14, damage: '5d6', rof: 1 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 13 }
    ],
    weapons: [
      { name: 'Very Heavy Pistol', skillBase: 14, damage: '4d6', rof: 1, mag: 8 },
      { name: 'Shotgun', skillBase: 14, damage: '5d6', rof: 1, mag: 8 }
    ],
    cyberware: ['Subdermal Armor', 'Kerenzikov (+2 Init)', 'Cybereye (Low Light / Anti-Dazzle)'],
    gear: ['Light Armorjack Head (SP 11)', 'Heavy Armorjack Body (SP 13)', 'Airhypo con Stim'],
    specialRules: ['Vigilancia de élite: Inmune a ser sorprendido en emboscadas gracias a Kerenzikov y óptica.'],
    loreSummary: 'Guardaespaldas veterano contratado para proteger a ejecutivos de alto rango en Night City.'
  },
  {
    id: 'dlc-hardened-boosterganger',
    name: 'Hardened Boosterganger',
    subtitle: 'Pandillero veterano con ciberware militar reciclado',
    faction: 'Maelstrom / Tyger Claws',
    threatTier: 'hardened_mook',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 6,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 3, REF: 7, DEX: 7, TECH: 3, COOL: 5, WILL: 5, LUCK: 1, MOVE: 7, BODY: 6, EMP: 2 },
    combatBases: [
      { label: 'Subfusil Pesado Autofire', totalBase: 13, damage: '3d6', rof: 1 },
      { label: 'Cuchillo Monofilo', totalBase: 13, damage: '2d6', rof: 2 },
      { label: 'Esquiva', totalBase: 13 }
    ],
    weapons: [
      { name: 'Heavy SMG', skillBase: 13, damage: '3d6', rof: 1, mag: 40, notes: 'Autofire x3' },
      { name: 'Medium Melee Weapon', skillBase: 13, damage: '2d6', rof: 2, mag: 0 }
    ],
    cyberware: ['Cyberarm', 'Big Knucks', 'Subdermal Plating (Head SP 11)', 'Sandevistan (+3 Init)'],
    gear: ['Light Armorjack Body (SP 11)', '2x Dosis de Black Lace'],
    specialRules: ['Dosis de combate: Al inicio del tiroteo inhala Black Lace (ignora Seriously Wounded por 1 hora).'],
    loreSummary: 'Sobreviviente de docenas de guerras de bandas con cicatrices cromadas y reflejos aumentados.'
  },
  {
    id: 'dlc-hardened-security-operative',
    name: 'Hardened Security Operative',
    subtitle: 'Soldado de seguridad Militech / Arasaka de respuesta rápida',
    faction: 'Corporaciones',
    threatTier: 'hardened_mook',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 40,
    seriouslyWounded: 20,
    deathSave: 7,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 5, REF: 7, DEX: 7, TECH: 4, COOL: 6, WILL: 6, LUCK: 1, MOVE: 6, BODY: 7, EMP: 3 },
    combatBases: [
      { label: 'Fusil Asalto Militar', totalBase: 13, damage: '5d6', rof: 1 },
      { label: 'Pistola Pesada', totalBase: 13, damage: '3d6', rof: 2 },
      { label: 'Tácticas de Escuadra', totalBase: 12 }
    ],
    weapons: [
      { name: 'Assault Rifle', skillBase: 13, damage: '5d6', rof: 1, mag: 30, notes: 'Autofire x4' },
      { name: 'Heavy Pistol', skillBase: 13, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Neuralware Processor', 'Smartgun Link', 'Chyron'],
    gear: ['Light Armorjack Head (SP 11)', 'Heavy Armorjack Body (SP 13)', 'Granada Flashbang'],
    specialRules: ['Fuego coordinado: Si dispara al mismo objetivo que otro operador de su escuadra, suma +1 a la tirada.'],
    loreSummary: 'Tropas entrenadas por contratistas militares privados para defender activos estratégicos.'
  },
  {
    id: 'dlc-hardened-road-ganger',
    name: 'Hardened Road Ganger',
    subtitle: 'Incursor acorazado de carreteras con lanzacohetes',
    faction: 'Asaltantes de Autopista',
    threatTier: 'hardened_mook',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Nomad',
    hp: 45,
    seriouslyWounded: 23,
    deathSave: 8,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 4, REF: 7, DEX: 7, TECH: 6, COOL: 5, WILL: 6, LUCK: 1, MOVE: 6, BODY: 8, EMP: 3 },
    combatBases: [
      { label: 'Lanzacohetes / Pesadas', totalBase: 13, damage: '8d6', rof: 1 },
      { label: 'Fusil Asalto', totalBase: 13, damage: '5d6', rof: 1 },
      { label: 'Conducción Extrema', totalBase: 14 }
    ],
    weapons: [
      { name: 'Rocket Launcher', skillBase: 13, damage: '8d6', rof: 1, mag: 1, notes: 'Explosivo en área' },
      { name: 'Assault Rifle', skillBase: 13, damage: '5d6', rof: 1, mag: 25 }
    ],
    cyberware: ['Interface Plugs', 'Grafted Muscle'],
    gear: ['Light Armorjack (SP 11 Cabeza y Cuerpo)', 'Vehículo artillado con SDP 50'],
    specialRules: ['Blindaje de vehículo: Utiliza su todoterreno como cobertura destructible de SP 20.'],
    loreSummary: 'Veterano de emboscadas a transportes corporativos en la autopista interestatal de Night City.'
  },
  {
    id: 'dlc-hardened-netrunner',
    name: 'Hardened Netrunner',
    subtitle: 'Hacker de combate con Black ICE letal precargado',
    faction: 'Sindicatos / Mercenarios',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Netrunner',
    hp: 40,
    seriouslyWounded: 20,
    deathSave: 6,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 8, REF: 7, DEX: 6, TECH: 7, COOL: 6, WILL: 7, LUCK: 3, MOVE: 6, BODY: 6, EMP: 4 },
    combatBases: [
      { label: 'Interface Netrunning', totalBase: 16 },
      { label: 'Subfusil Inteligente', totalBase: 13, damage: '3d6', rof: 1 },
      { label: 'Esquiva', totalBase: 12 }
    ],
    weapons: [
      { name: 'Smart Heavy SMG', skillBase: 13, damage: '3d6', rof: 1, mag: 40, notes: 'Autofire x3, Smart (+1 attack)' }
    ],
    cyberware: ['Neural Link', 'Interface Plugs', 'Smartgun Link', 'Pain Editor'],
    gear: ['Cyberdeck excelente (8 slots)', 'Programas: Giant, Hellhound, Sword, Superglue, Banhammer'],
    specialRules: ['4 Net Actions por turno. Puede rezear 2 programas en la misma acción.'],
    loreSummary: 'Un operador de élite capaz de freír cyberdecks rivales y neutralizar sistemas de seguridad en segundos.'
  },
  {
    id: 'dlc-hardened-arasaka-assassin',
    name: 'Hardened Arasaka Assassin',
    subtitle: 'Ejecutor ninja de la corporación Arasaka',
    faction: 'Arasaka',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 45,
    seriouslyWounded: 23,
    deathSave: 7,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 6, REF: 8, DEX: 8, TECH: 4, COOL: 8, WILL: 7, LUCK: 3, MOVE: 8, BODY: 7, EMP: 3 },
    combatBases: [
      { label: 'Katana Monomolecular', totalBase: 16, damage: '3d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Pistola Pesada Silenciada', totalBase: 15, damage: '3d6', rof: 2 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 16 },
      { label: 'Sigilo de Sombra', totalBase: 16 }
    ],
    weapons: [
      { name: 'Kendachi Mono-Katana', skillBase: 16, damage: '3d6', rof: 2, mag: 0 },
      { name: 'Arasaka Silenced Heavy Pistol', skillBase: 15, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Sandevistan (+3 Init)', 'Subdermal Armor (SP 11)', 'Kiroshi Optics (Anti-Dazzle, Thermal)'],
    gear: ['Mono de camuflaje Arasaka', '2x Granadas de Humo'],
    specialRules: ['Paso silencioso: Si ataca desde sigilo, su víctima no puede esquivar el primer ataque.'],
    loreSummary: 'Asesino entrenado en Japón enviado para limpiar testigos y ejecutar objetivos prioritarios.'
  },
  {
    id: 'dlc-hardened-militech-commando',
    name: 'Hardened Militech Commando',
    subtitle: 'Soldado de operaciones especiales fuertemente blindado',
    faction: 'Militech',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 50,
    seriouslyWounded: 25,
    deathSave: 8,
    headSp: 13,
    bodySp: 15,
    stats: { INT: 6, REF: 8, DEX: 7, TECH: 5, COOL: 7, WILL: 7, LUCK: 2, MOVE: 6, BODY: 8, EMP: 4 },
    combatBases: [
      { label: 'Fusil Asalto Militech', totalBase: 15, damage: '5d6', rof: 1 },
      { label: 'Lanzagranadas Acoplado', totalBase: 13, damage: '6d6', rof: 1 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 14 }
    ],
    weapons: [
      { name: 'Militech Heavy Assault Rifle', skillBase: 15, damage: '5d6', rof: 1, mag: 35, notes: 'Autofire x4' },
      { name: 'Underbarrel Grenade Launcher', skillBase: 13, damage: '6d6', rof: 1, mag: 2 }
    ],
    cyberware: ['Kerenzikov (+2 Init)', 'Neural Link', 'Smartgun Link', 'Subdermal Armor'],
    gear: ['Heavy Armorjack Head (SP 13)', 'Flak Vest Body (SP 15)', '2x Granadas EMP'],
    specialRules: ['Disciplina militar: Inmune a efectos de pánico y Fuego de Supresión.'],
    loreSummary: 'Veteranos de asaltos a búnkeres armados con equipo de última generación militar.'
  },
  {
    id: 'dlc-hardened-maelstrom-enforcer',
    name: 'Hardened Maelstrom Enforcer',
    subtitle: 'Bruto cibernético acorazado con ametralladora pesada',
    faction: 'Maelstrom',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 55,
    seriouslyWounded: 28,
    deathSave: 9,
    headSp: 11,
    bodySp: 15,
    stats: { INT: 3, REF: 7, DEX: 7, TECH: 5, COOL: 5, WILL: 7, LUCK: 1, MOVE: 6, BODY: 9, EMP: 1 },
    combatBases: [
      { label: 'Ametralladora Pesada / Shotgun', totalBase: 14, damage: '5d6', rof: 1 },
      { label: 'Big Knucks Ciberbrazo', totalBase: 14, damage: '3d6', rof: 2 }
    ],
    weapons: [
      { name: 'Heavy Machine Gun', skillBase: 14, damage: '5d6', rof: 1, mag: 50, notes: 'Autofire x4' },
      { name: 'Cyberarm Big Knucks', skillBase: 14, damage: '3d6', rof: 2, mag: 0 }
    ],
    cyberware: ['2x Cyberarms reforzados', 'Subdermal Plating', 'Pain Editor', 'Pentagonal Cybereye'],
    gear: ['Flak Body Armor (SP 15)', 'Dosis de Timewarp'],
    specialRules: ['Ignora penalizaciones de Seriously Wounded por Pain Editor.'],
    loreSummary: 'El terror de los callejones de Northside, con más del 70% de su cuerpo sustituido por cromo.'
  },
  {
    id: 'dlc-hardened-bozo-prankster',
    name: 'Hardened Bozo Prankster',
    subtitle: 'Payaso cibernético sádico con bromas explosivas',
    faction: 'Bozos',
    threatTier: 'hardened_mook',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 6,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 4, REF: 7, DEX: 7, TECH: 6, COOL: 6, WILL: 6, LUCK: 2, MOVE: 7, BODY: 6, EMP: 1 },
    combatBases: [
      { label: 'Pistola Pesada Ácida', totalBase: 13, damage: '3d6', rof: 2 },
      { label: 'Lanzar Tartas Explosivas', totalBase: 13, damage: '6d6', rof: 1 },
      { label: 'Esquiva', totalBase: 13 }
    ],
    weapons: [
      { name: 'Acid Spray Gun', skillBase: 13, damage: '3d6', rof: 2, mag: 8, notes: 'Ablaciona SP en 2 puntos' },
      { name: 'Explosive Pie Grenade', skillBase: 13, damage: '6d6', rof: 1, mag: 2 }
    ],
    cyberware: ['Chemskin blanco payaso', 'Techhair rojo', 'Cyberaudio (Bocina de feria)'],
    gear: ['Traje de payaso reforzado (SP 11)', 'Flores de solapa con gas tóxico'],
    specialRules: ['Broma póstuma: Si muere en combate, una bomba de confeti químico explota a 2m (DV 13 DEX o SP -2).'],
    loreSummary: 'Miembro de la aterradora banda de payasos psicópatas de Night City que aterrorizan a la población.'
  },
  {
    id: 'dlc-hardened-6th-street-veteran',
    name: 'Hardened 6th Street Veteran',
    subtitle: 'Miliciano patriota fuertemente armado de Santo Domingo',
    faction: '6th Street',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'dlc',
    sourceBookTitle: 'Hardened Enemies DLC',
    era: '2045',
    role: 'Solo',
    hp: 45,
    seriouslyWounded: 23,
    deathSave: 7,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 5, REF: 8, DEX: 7, TECH: 5, COOL: 6, WILL: 7, LUCK: 2, MOVE: 6, BODY: 7, EMP: 4 },
    combatBases: [
      { label: 'Fusil Asalto Patriota', totalBase: 14, damage: '5d6', rof: 1 },
      { label: 'Revólver Pesado', totalBase: 14, damage: '4d6', rof: 1 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 14 }
    ],
    weapons: [
      { name: '6th Street Custom Assault Rifle', skillBase: 14, damage: '5d6', rof: 1, mag: 30, notes: 'Autofire x4' },
      { name: 'Very Heavy Revolver', skillBase: 14, damage: '4d6', rof: 1, mag: 6 }
    ],
    cyberware: ['Cybereye (Targeting Scope)', 'Neural Link', 'Interface Plugs'],
    gear: ['Light Armorjack Head (SP 11)', 'Heavy Armorjack Body (SP 13 con bandera patriótica)'],
    specialRules: ['Veterano de guerra: Gana +2 en tiradas de Concentration contra Fuego de Supresión.'],
    loreSummary: 'Ex-soldados que formaron una milicia de autodefensa vecinal que terminó convertida en cartel callejero.'
  },

  // --------------------------------------------------------------------------
  // 3. CEMK 2077 (2077 CEMK)
  // --------------------------------------------------------------------------
  {
    id: 'cemk-arasaka-agent-2077',
    name: 'Arasaka 2077 Counter-Intel Agent',
    subtitle: 'Agente encubierto de contra-inteligencia con tecnología Power',
    faction: 'Arasaka',
    threatTier: 'lieutenant',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 40,
    seriouslyWounded: 20,
    deathSave: 7,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 7, REF: 8, DEX: 7, TECH: 5, COOL: 7, WILL: 7, LUCK: 3, MOVE: 6, BODY: 7, EMP: 5 },
    combatBases: [
      { label: 'Pistola Power Tamayura', totalBase: 14, damage: '4d6', rof: 1, notes: 'Power (Rebote)' },
      { label: 'Combate Cuerpo a Cuerpo', totalBase: 13, damage: '2d6', rof: 2 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 14 }
    ],
    weapons: [
      { name: 'Arasaka Tamayura (Power Pistol)', skillBase: 14, damage: '4d6', rof: 1, mag: 8, notes: 'Power (Rebote con Coprocesador)' }
    ],
    cyberware: ['Neuroport 2077', 'Ballistic Coprocessor (Rebote sin penalizador)', 'Subdermal Armor SP 11'],
    gear: ['Traje Arasaka Black (SP 11)', 'Shard de datos encriptado'],
    specialRules: ['Rebote letal: Puede disparar en esquinas usando rebotes Power sin penalización de cobertura.'],
    loreSummary: 'Operan en las sombras de Night City interrogando y eliminando amenazas antes de que lleguen a los medios.'
  },
  {
    id: 'cemk-arasaka-heavy-specops-2077',
    name: 'Arasaka Heavy Spec-Ops (2077)',
    subtitle: 'Soldado de asalto pesado con armadura acorazada y fusil Smart',
    faction: 'Arasaka',
    threatTier: 'mini_boss',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 60,
    seriouslyWounded: 30,
    deathSave: 9,
    headSp: 15,
    bodySp: 18,
    stats: { INT: 6, REF: 8, DEX: 7, TECH: 5, COOL: 7, WILL: 7, LUCK: 2, MOVE: 5, BODY: 9, EMP: 3 },
    combatBases: [
      { label: 'Fusil Asalto Smart Masamune', totalBase: 15, damage: '5d6', rof: 1, notes: 'Smart (+1 hit, reroll <=4)' },
      { label: 'Lanzaproyectiles de Brazo (PLS)', totalBase: 13, damage: '6d6', rof: 1 },
      { label: 'Esquiva Balas', totalBase: 14 }
    ],
    weapons: [
      { name: 'Arasaka HJSH-18 Masamune [Smart]', skillBase: 15, damage: '5d6', rof: 1, mag: 30, notes: 'Autofire x4, Smartguiado' },
      { name: 'Projectile Launch System (PLS)', skillBase: 13, damage: '6d6', rof: 1, mag: 2 }
    ],
    cyberware: ['Neuroport 2077', 'Subdermal Plating', 'Kerenzikov 2077', 'Self-ICE (+2 defensa Netrunning)'],
    gear: ['Metalgear Arasaka Plate (SP 18 Body, SP 15 Head)', 'Inmunobloqueadores'],
    specialRules: ['Self-ICE activo: Quien intente un Quickhack contra él sufre DV +2.'],
    loreSummary: 'La fuerza de asalto definitiva desplegada cuando la Torre Arasaka entra en código rojo.'
  },
  {
    id: 'cemk-tyger-claws-samurai-2077',
    name: 'Tyger Claws Street Samurai (2077)',
    subtitle: 'Espadachín de katana con implantes de celeridad reflectante',
    faction: 'Tyger Claws',
    threatTier: 'mook',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 30,
    seriouslyWounded: 15,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 4, REF: 8, DEX: 8, TECH: 3, COOL: 6, WILL: 5, LUCK: 1, MOVE: 7, BODY: 6, EMP: 4 },
    combatBases: [
      { label: 'Katana Kusanagi', totalBase: 14, damage: '3d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Pistola Smart Yukimura', totalBase: 13, damage: '3d6', rof: 2 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 14 }
    ],
    weapons: [
      { name: 'Katana', skillBase: 14, damage: '3d6', rof: 2, mag: 0 },
      { name: 'Arasaka Yukimura (Smart Pistol)', skillBase: 13, damage: '3d6', rof: 2, mag: 15 }
    ],
    cyberware: ['Neuroport 2077', 'Kerenzikov (+2 Init)', 'Tatuajes luminosos Tyger'],
    gear: ['Chaqueta moto reforzada (SP 11 Torso, SP 7 Cabeza)', 'Moto Yaiba'],
    specialRules: ['Desvío de proyectiles: Si supera la tirada de esquiva por 5+, puede reflejar el disparo a un blanco adyacente.'],
    loreSummary: 'Patrullan Japantown armados con katanas de alta frecuencia y pistolas inteligentes.'
  },
  {
    id: 'cemk-maelstrom-totentanz-borg-2077',
    name: 'Maelstrom Totentanz Borg (2077)',
    subtitle: 'Bruto de Totentanz con Mantis Blades y escopeta Tech',
    faction: 'Maelstrom',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 55,
    seriouslyWounded: 28,
    deathSave: 9,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 3, REF: 8, DEX: 8, TECH: 5, COOL: 5, WILL: 7, LUCK: 1, MOVE: 7, BODY: 9, EMP: 1 },
    combatBases: [
      { label: 'Mantis Blades 2077', totalBase: 15, damage: '3d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Escopeta Tech Satara', totalBase: 14, damage: '5d6', rof: 1, notes: 'Tech (Atraviesa cobertura)' },
      { label: 'Esquiva Balas (REF 8)', totalBase: 15 }
    ],
    weapons: [
      { name: 'Mantis Blades', skillBase: 15, damage: '3d6', rof: 2, mag: 0 },
      { name: 'Rostović DB-2 Satara (Tech Shotgun)', skillBase: 14, damage: '5d6', rof: 1, mag: 2, notes: 'Perfora coberturas' }
    ],
    cyberware: ['Neuroport 2077', 'Sandevistan militar (+3 Init)', 'Mantis Blades', 'Subdermal Plating (Head SP 11)'],
    gear: ['Heavy Armorjack (SP 13 Torso)', 'Inhaladores MaxDoc'],
    specialRules: ['Carga Tech: Puede gastar su acción completa para disparar la Satara atravesando muros de pladur/madera sin penalizador.'],
    loreSummary: 'Habitual de la pista de baile del club Totentanz y ejecutor principal de las operaciones de Maelstrom en 2077.'
  },
  {
    id: 'cemk-valentino-sicario-2077',
    name: 'Valentino Sicario (2077)',
    subtitle: 'Gatillero estilizado de Heywood con pistolas gemelas doradas',
    faction: 'Valentinos',
    threatTier: 'mook',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 4, REF: 8, DEX: 7, TECH: 3, COOL: 7, WILL: 6, LUCK: 1, MOVE: 6, BODY: 6, EMP: 5 },
    combatBases: [
      { label: 'Pistolas Power Gemelas', totalBase: 14, damage: '3d6', rof: 2, notes: 'Power (Rebote)' },
      { label: 'Esquiva Balas (REF 8)', totalBase: 13 }
    ],
    weapons: [
      { name: 'Dual Nue Power Pistols', skillBase: 14, damage: '3d6', rof: 2, mag: 16 }
    ],
    cyberware: ['Neuroport 2077', 'Ballistic Coprocessor', 'Tatuajes dorados de Santa Muerte'],
    gear: ['Traje urbano sastre reforzado (SP 11)', 'Rosario cibernético'],
    specialRules: ['Orgullo del barrio: Si pelea en Heywood, suma +1 a tiradas de Willpower para no huir.'],
    loreSummary: 'Guerreros leales a la familia y al código de honor de los Valentinos en Vista del Rey.'
  },
  {
    id: 'cemk-animals-pit-fighter-2077',
    name: 'Animals Pit Fighter (2077)',
    subtitle: 'Coloso hinchado con esteroides y Gorilla Arms',
    faction: 'Animals',
    threatTier: 'hardened_mook',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 55,
    seriouslyWounded: 28,
    deathSave: 10,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 2, REF: 7, DEX: 7, TECH: 2, COOL: 5, WILL: 7, LUCK: 1, MOVE: 6, BODY: 11, EMP: 2 },
    combatBases: [
      { label: 'Puñetazos Gorilla Arms', totalBase: 15, damage: '4d6', rof: 2, notes: 'Destrucción de blindaje' },
      { label: 'Lanzar Objetos / Enemigos', totalBase: 14, damage: '3d6' }
    ],
    weapons: [
      { name: 'Gorilla Arms 2077', skillBase: 15, damage: '4d6', rof: 2, mag: 0 }
    ],
    cyberware: ['Gorilla Arms', 'Subdermal Armor (SP 11)', 'Grafted Muscle & Bone Lace (BODY 11)'],
    gear: ['Pantalones de boxeo reforzados (SP 13)', 'Inyectores de Juicy Juice (Esteroides)'],
    specialRules: ['Agarre aplastante: Si impacta un agarre, realiza daño directo a HP igual a su BODY (11) cada turno.'],
    loreSummary: 'Luchadores clandestinos de Pacifica que desprecian el cromo invasivo y prefieren la fuerza muscular bruta.'
  },
  {
    id: 'cemk-voodoo-boys-netrunner-2077',
    name: 'Voodoo Boys Netrunner (2077)',
    subtitle: 'Hacker sombrío de Pacifica obsesionado con el Muro Negro',
    faction: 'Voodoo Boys',
    threatTier: 'lieutenant',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Netrunner',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 8, REF: 6, DEX: 6, TECH: 7, COOL: 6, WILL: 8, LUCK: 2, MOVE: 5, BODY: 5, EMP: 3 },
    combatBases: [
      { label: 'Quickhacking Remoto (2077)', totalBase: 16, notes: 'Alcance 50m' },
      { label: 'Pistola Smart Chao', totalBase: 12, damage: '3d6', rof: 2 },
      { label: 'Defensa de Red / Expulsión', totalBase: 16 }
    ],
    weapons: [
      { name: 'Kang Tao Chao (Smart Pistol)', skillBase: 12, damage: '3d6', rof: 2, mag: 30 }
    ],
    cyberware: ['Neuroport 2077 de Grado Militar', 'Cyberdeck Raven Microcyber', 'Subdermal Armor'],
    gear: ['Túnica de inmersión en red (SP 11 Torso, SP 7 Cabeza)', 'Shards con código militar'],
    specialRules: [
      'Quickhacks preparados: Puede ejecutar Overheat (DV 6, 2d6/turno), Synapse Burnout (DV 8, daño directo) y Cyberware Malfunction (DV 8) a 50 metros.'
    ],
    loreSummary: 'Pioneros en el contacto con inteligencias artificiales más allá del Muro Negro desde los hoteles abandonados de Pacifica.'
  },
  {
    id: 'cemk-scavenger-harvester-2077',
    name: 'Scavenger Harvester (2077)',
    subtitle: 'Cirujano carnicero que arranca implantes a víctimas vivas',
    faction: 'Scavengers',
    threatTier: 'mook',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Medtech',
    hp: 30,
    seriouslyWounded: 15,
    deathSave: 5,
    headSp: 7,
    bodySp: 7,
    stats: { INT: 5, REF: 6, DEX: 6, TECH: 7, COOL: 3, WILL: 5, LUCK: 0, MOVE: 6, BODY: 5, EMP: 1 },
    combatBases: [
      { label: 'Sierra Quirúrgica / Bisturí', totalBase: 12, damage: '2d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Pistola Pesada Robada', totalBase: 11, damage: '3d6', rof: 2 }
    ],
    weapons: [
      { name: 'Surgical Bone Saw', skillBase: 12, damage: '2d6', rof: 2, mag: 0 },
      { name: 'Stolen Heavy Pistol', skillBase: 11, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Neuroport 2077', 'Cyberaudio Suite'],
    gear: ['Delantal manchado de sangre con Kevlar (SP 7)', 'Bolsa de refrigeración de órganos y cromo'],
    specialRules: ['Extracción de emergencia: Intenta rematar a objetivos moribundos para robar su ciberware al instante.'],
    loreSummary: 'Secuestran a incautos en callejones oscuros para despiezarlos y revender sus prótesis en el mercado negro.'
  },
  {
    id: 'cemk-militech-heavy-trooper-2077',
    name: 'Militech Heavy Trooper (2077)',
    subtitle: 'Soldado de infantería mecanizada con rifle Tech Achilles',
    faction: 'Militech',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 50,
    seriouslyWounded: 25,
    deathSave: 8,
    headSp: 13,
    bodySp: 15,
    stats: { INT: 5, REF: 8, DEX: 7, TECH: 5, COOL: 6, WILL: 7, LUCK: 2, MOVE: 6, BODY: 8, EMP: 3 },
    combatBases: [
      { label: 'Rifle Tech Achilles', totalBase: 15, damage: '5d6', rof: 1, notes: 'Tech (Carga penetrante)' },
      { label: 'Pistola Lexington Power', totalBase: 14, damage: '3d6', rof: 2 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 14 }
    ],
    weapons: [
      { name: 'Militech M-179E Achilles [Tech Rifle]', skillBase: 15, damage: '5d6', rof: 1, mag: 30, notes: 'Atraviesa coberturas' },
      { name: 'Militech Lexington [Power]', skillBase: 14, damage: '3d6', rof: 2, mag: 15 }
    ],
    cyberware: ['Neuroport 2077', 'Kerenzikov (+2 Init)', 'Subdermal Armor', 'Smartgun Link'],
    gear: ['Militech Heavy Armorjack (SP 15 Body, SP 13 Head)', 'Granada Flashbang'],
    specialRules: ['Ráfaga de supresión Tech: Puede perforar parapetos defensivos de SP hasta 15 sin perder daño.'],
    loreSummary: 'Fuerzas de intervención militar utilizadas para escoltar convoyes corporativos a través de las Zonas de Combate.'
  },
  {
    id: 'cemk-trauma-team-platinum-medsec-2077',
    name: 'Trauma Team Platinum Med-Sec (2077)',
    subtitle: 'Médico artillero con armadura blindada y escopeta de contención',
    faction: 'Trauma Team',
    threatTier: 'mini_boss',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Medtech',
    hp: 50,
    seriouslyWounded: 25,
    deathSave: 8,
    headSp: 15,
    bodySp: 15,
    stats: { INT: 7, REF: 8, DEX: 7, TECH: 8, COOL: 7, WILL: 7, LUCK: 2, MOVE: 6, BODY: 8, EMP: 4 },
    combatBases: [
      { label: 'Escopeta Contención / Asalto', totalBase: 15, damage: '5d6', rof: 1 },
      { label: 'Pistola Smart de Apoyo', totalBase: 14, damage: '3d6', rof: 2 },
      { label: 'Paramédico / Cirugía Rápida', totalBase: 16 }
    ],
    weapons: [
      { name: 'Trauma Team Tactical Shotgun', skillBase: 15, damage: '5d6', rof: 1, mag: 8 },
      { name: 'Smart Heavy Pistol', skillBase: 14, damage: '3d6', rof: 2, mag: 12 }
    ],
    cyberware: ['Neuroport 2077', 'Biomonitor Avanzado', 'Subdermal Armor (SP 11)', 'Kerenzikov'],
    gear: ['Trauma Team Heavy Armor (SP 15 Head & Body)', 'Airhypo con Speedheal y Stim', 'Desfibrilador'],
    specialRules: [
      'Estabilización en 1 Acción: Puede revivir a un cliente o aliado moribundo sin chequeo en 1 turno.',
      'Soporte aéreo AV-4: Puede solicitar extracción aérea o fuego de cobertura en 3 turnos.'
    ],
    loreSummary: 'Llegan en un AV-4 en menos de 3 minutos para extraer a clientes de tarjeta Platinum abriendo fuego contra todo lo que se mueva.'
  },
  {
    id: 'cemk-maxtac-psycho-squad-officer-2077',
    name: 'MaxTac Psycho Squad Officer (2077)',
    subtitle: 'Cazador de ciberpsicópatas de élite con Sandevistan militar',
    faction: 'NCPD MaxTac',
    threatTier: 'boss',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 65,
    seriouslyWounded: 33,
    deathSave: 10,
    headSp: 15,
    bodySp: 18,
    stats: { INT: 7, REF: 8, DEX: 8, TECH: 6, COOL: 8, WILL: 8, LUCK: 4, MOVE: 8, BODY: 10, EMP: 2 },
    combatBases: [
      { label: 'Mantis Blades / Cuchillas', totalBase: 17, damage: '4d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Fusil Tech Achilles', totalBase: 16, damage: '5d6', rof: 1 },
      { label: 'Esquiva Balas Legendaria', totalBase: 17 }
    ],
    weapons: [
      { name: 'MaxTac Issue Mantis Blades', skillBase: 17, damage: '4d6', rof: 2, mag: 0 },
      { name: 'Militech M-179E Achilles [Tech]', skillBase: 16, damage: '5d6', rof: 1, mag: 30 }
    ],
    cyberware: ['Neuroport 2077', 'Sandevistan militar (+3 Init)', 'Mantis Blades reforzadas', 'Subdermal Armor SP 11', 'Self-ICE'],
    gear: ['MaxTac Heavy Tactical Armor (SP 18 Body, SP 15 Head)', 'Granadas EMP', 'Inmunobloqueadores grado militar'],
    specialRules: [
      'Cazador implacable: Sus ataques cuerpo a cuerpo causan Herida Crítica con dos o más 5s o 6s.',
      'Despliegue aéreo: Saltan desde aerodinos en rapel directo al centro del combate.'
    ],
    loreSummary: 'Antiguos ciberpsicópatas rehabilitados químicamente que el NCPD utiliza como perros de presa para abatir amenazas de alto cromo.'
  },

  // --------------------------------------------------------------------------
  // 4. DANGER GAL DOSSIER (2045 Danger Gal)
  // --------------------------------------------------------------------------
  {
    id: 'dg-puma-squad-operative',
    name: 'Danger Gal Puma Squad Operative',
    subtitle: 'Investigadora privada de élite y agente encubierta',
    faction: 'Danger Gal',
    threatTier: 'lieutenant',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 40,
    seriouslyWounded: 20,
    deathSave: 6,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 7, REF: 8, DEX: 7, TECH: 5, COOL: 7, WILL: 6, LUCK: 3, MOVE: 7, BODY: 6, EMP: 6 },
    combatBases: [
      { label: 'Smart SMG Kitty', totalBase: 14, damage: '3d6', rof: 1 },
      { label: 'Artes Marciales Puma', totalBase: 14, damage: '2d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Esquiva Balas (REF 8)', totalBase: 14 },
      { label: 'Percepción e Investigación', totalBase: 15 }
    ],
    weapons: [
      { name: 'Danger Gal "Kitty" Smart SMG', skillBase: 14, damage: '3d6', rof: 1, mag: 35, notes: 'Smart (+1), Autofire x3' },
      { name: 'Martial Arts (Puma Style)', skillBase: 14, damage: '2d6', rof: 2, mag: 0 }
    ],
    cyberware: ['Neural Link', 'Smartgun Link', 'Cybereye (Image Enhance, Anti-Dazzle)'],
    gear: ['Traje Puma Squad reforzado (SP 11 Cabeza y Cuerpo)', 'Micrograbadora espía', 'Agent'],
    specialRules: ['Reflejos felinos: Puede levantarse de la posición derribada como acción gratuita.'],
    loreSummary: 'Agentes de la agencia de investigación de Michiko Sanderson disfrazadas de personajes extravagantes pero letales.'
  },
  {
    id: 'dg-michiko-specops-bodyguard',
    name: "Michiko's Spec-Ops Bodyguard",
    subtitle: 'Escolta personal de alta fidelidad con fusil de precisión',
    faction: 'Danger Gal',
    threatTier: 'mini_boss',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 50,
    seriouslyWounded: 25,
    deathSave: 8,
    headSp: 13,
    bodySp: 13,
    stats: { INT: 7, REF: 8, DEX: 8, TECH: 5, COOL: 8, WILL: 7, LUCK: 3, MOVE: 7, BODY: 8, EMP: 5 },
    combatBases: [
      { label: 'Fusil Asalto de Élite', totalBase: 16, damage: '5d6', rof: 1 },
      { label: 'Pistola Pesada Silenciada', totalBase: 15, damage: '3d6', rof: 2 },
      { label: 'Esquiva Balas Legendaria', totalBase: 16 }
    ],
    weapons: [
      { name: 'Arasaka WSSA Heavy Assault Rifle', skillBase: 16, damage: '5d6', rof: 1, mag: 30, notes: 'Autofire x4' },
      { name: 'Heavy Pistol Silenced', skillBase: 15, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Sandevistan (+3 Init)', 'Subdermal Armor (SP 11)', 'Kiroshi Optics', 'Interface Plugs'],
    gear: ['Heavy Armorjack Body & Head (SP 13)', '2x Granadas EMP', 'Comunicador cuántico'],
    specialRules: ['Voto de protección: Si Michiko Sanderson o su VIP es atacado, gana +2 a todas las tiradas de ataque contra el agresor.'],
    loreSummary: 'Los mejores combatientes seleccionados para velar por la seguridad de la heredera Arasaka en Night City.'
  },
  {
    id: 'dg-maelstrom-warlord-lieutenant',
    name: 'Maelstrom Warlord Lieutenant',
    subtitle: 'Subjefe de asalto de Maelstrom con lanzagranadas',
    faction: 'Maelstrom',
    threatTier: 'lieutenant',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 45,
    seriouslyWounded: 23,
    deathSave: 8,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 4, REF: 7, DEX: 7, TECH: 5, COOL: 5, WILL: 7, LUCK: 2, MOVE: 6, BODY: 8, EMP: 1 },
    combatBases: [
      { label: 'Lanzagranadas de Asalto', totalBase: 14, damage: '6d6', rof: 1, notes: 'Área 10x10m' },
      { label: 'Subfusil Pesado', totalBase: 13, damage: '3d6', rof: 1 },
      { label: 'Ciberbrazo Destructor', totalBase: 14, damage: '3d6', rof: 2 }
    ],
    weapons: [
      { name: 'Grenade Launcher', skillBase: 14, damage: '6d6', rof: 1, mag: 4 },
      { name: 'Heavy SMG', skillBase: 13, damage: '3d6', rof: 1, mag: 40 }
    ],
    cyberware: ['Cyberarm', 'Big Knucks', 'Subdermal Plating', 'Pain Editor'],
    gear: ['Heavy Armorjack (SP 13)', '2x Granadas Perforantes'],
    specialRules: ['Ignora Seriously Wounded gracias a Pain Editor.'],
    loreSummary: 'Lidera células de asalto armadas hasta los dientes con explosivos en Watson.'
  },
  {
    id: 'dg-tyger-claws-oyabun-enforcer',
    name: 'Tyger Claws Oyabun Enforcer',
    subtitle: 'Teniente de la mafia japonesa armado con katana gemela',
    faction: 'Tyger Claws',
    threatTier: 'lieutenant',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 45,
    seriouslyWounded: 23,
    deathSave: 7,
    headSp: 11,
    bodySp: 11,
    stats: { INT: 5, REF: 8, DEX: 8, TECH: 4, COOL: 7, WILL: 6, LUCK: 2, MOVE: 7, BODY: 7, EMP: 4 },
    combatBases: [
      { label: 'Katana de Maeda', totalBase: 15, damage: '3d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Pistola Muy Pesada', totalBase: 14, damage: '4d6', rof: 1 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 15 }
    ],
    weapons: [
      { name: 'High-Grade Katana', skillBase: 15, damage: '3d6', rof: 2, mag: 0 },
      { name: 'Very Heavy Pistol', skillBase: 14, damage: '4d6', rof: 1, mag: 8 }
    ],
    cyberware: ['Kerenzikov (+2 Init)', 'Neural Link', 'Subdermal Armor'],
    gear: ['Traje tradicional blindado (SP 11)', 'Incienso ritual'],
    specialRules: ['Duelo de honor: Si pelea 1 contra 1 sin intervención exterior, sus impactos críticos suman +5 de daño extra.'],
    loreSummary: 'Cobra tributo a los locales de Japantown y ejecuta a traidores con precisión marcial.'
  },
  {
    id: 'dg-zhirafa-combat-tech',
    name: 'Zhirafa Combat Tech',
    subtitle: 'Ingeniero de combate con dron armado y escopeta',
    faction: 'Zhirafa Technical',
    threatTier: 'mook',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Tech',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 6, REF: 6, DEX: 6, TECH: 8, COOL: 5, WILL: 5, LUCK: 1, MOVE: 6, BODY: 6, EMP: 5 },
    combatBases: [
      { label: 'Escopeta Cartucho', totalBase: 12, damage: '5d6', rof: 1 },
      { label: 'Control de Drones', totalBase: 14 },
      { label: 'Reparación en Combate', totalBase: 15 }
    ],
    weapons: [
      { name: 'Shotgun', skillBase: 12, damage: '5d6', rof: 1, mag: 8 }
    ],
    cyberware: ['Interface Plugs', 'Techhair'],
    gear: ['Kit de herramientas Techtool', 'Dron de reconocimiento armado (HP 20, SP 7, daño 2d6)', 'Light Armorjack Body (SP 11)'],
    specialRules: ['Dron guardián: Su dron dispara como acción secundaria cada turno.'],
    loreSummary: 'Desplegados para reparar torretas y sistemas de seguridad automatizados bajo fuego.'
  },
  {
    id: 'dg-lazarus-military-contractor',
    name: 'Lazarus Military Contractor',
    subtitle: 'Soldado de élite privado de la corporación militar Lazarus',
    faction: 'Lazarus Group',
    threatTier: 'hardened_lieutenant',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 50,
    seriouslyWounded: 25,
    deathSave: 8,
    headSp: 13,
    bodySp: 13,
    stats: { INT: 6, REF: 8, DEX: 7, TECH: 5, COOL: 7, WILL: 7, LUCK: 2, MOVE: 6, BODY: 8, EMP: 4 },
    combatBases: [
      { label: 'Fusil Asalto Lazarus', totalBase: 15, damage: '5d6', rof: 1 },
      { label: 'Pistola Pesada', totalBase: 14, damage: '3d6', rof: 2 },
      { label: 'Esquiva Balas (REF 8)', totalBase: 14 }
    ],
    weapons: [
      { name: 'Militech Ronin Assault Rifle', skillBase: 15, damage: '5d6', rof: 1, mag: 30, notes: 'Autofire x4' },
      { name: 'Heavy Pistol', skillBase: 14, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Kerenzikov', 'Subdermal Armor', 'Neural Link'],
    gear: ['Heavy Armorjack (SP 13 Cabeza y Torso)', 'Granada de Humo', 'Ración de combate'],
    specialRules: ['Retirada táctica: Si sufre una emboscada, lanza humo inmediatamente sin consumir acción.'],
    loreSummary: 'Mercenarios militares contratados para pacificar distritos rebeldes o escoltar convoyes pesados.'
  },
  {
    id: 'dg-biotechnica-field-operative',
    name: 'Biotechnica Field Operative',
    subtitle: 'Agente biológico con pistolas de biotoxina',
    faction: 'Biotechnica',
    threatTier: 'mook',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Medtech',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 7, REF: 6, DEX: 6, TECH: 7, COOL: 5, WILL: 6, LUCK: 1, MOVE: 6, BODY: 6, EMP: 4 },
    combatBases: [
      { label: 'Pistola de Dardos / Biotoxina', totalBase: 12, damage: 'Biotoxina (3d6 directo)', rof: 2 },
      { label: 'Inyección de Veneno', totalBase: 12 }
    ],
    weapons: [
      { name: 'Dartgun', skillBase: 12, damage: 'Biotoxin (3d6 a HP si falla DV 15 Resist)', rof: 2, mag: 8 }
    ],
    cyberware: ['Nasal Filters', 'Toxin Binders (+2 Resist)'],
    gear: ['Traje de protección biológica (SP 7 Cabeza, SP 11 Torso)', '2x Viales de Biotoxina'],
    specialRules: ['Toxina virulenta: Sus proyectiles obligan a chequeo de Resist Torture/Drugs DV 15.'],
    loreSummary: 'Vigilan las granjas sintéticas y laboratorios genéticos de Biotechnica en los alrededores de la ciudad.'
  },
  {
    id: 'dg-piranhas-party-ganger',
    name: 'Piranhas Party Ganger',
    subtitle: 'Joven frenético armado con cuchillos y drogas fiesteras',
    faction: 'Piranhas',
    threatTier: 'mook',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 25,
    seriouslyWounded: 13,
    deathSave: 4,
    headSp: 4,
    bodySp: 7,
    stats: { INT: 3, REF: 7, DEX: 7, TECH: 2, COOL: 5, WILL: 4, LUCK: 0, MOVE: 7, BODY: 4, EMP: 4 },
    combatBases: [
      { label: 'Cuchillo Ligero', totalBase: 11, damage: '1d6', rof: 2 },
      { label: 'Pistola Ligera', totalBase: 11, damage: '1d6', rof: 2 }
    ],
    weapons: [
      { name: 'Combat Knife', skillBase: 11, damage: '1d6', rof: 2, mag: 0 },
      { name: 'Medium Pistol', skillBase: 11, damage: '2d6', rof: 2, mag: 12 }
    ],
    cyberware: ['Chemskin fluorescente', 'Techhair'],
    gear: ['Leathers fiesteros (SP 4 Cabeza, SP 7 Torso)', 'Dosis de Blue Glass'],
    specialRules: ['Enjambre de pirañas: Si atacan 3 o más al mismo objetivo, ganan +1 a tiradas de ataque cuerpo a cuerpo.'],
    loreSummary: 'Pandilla juvenil adicta a las fiestas clandestinas, robos rápidos y vandalismo en grupo.'
  },
  {
    id: 'dg-red-chrome-legion-trooper',
    name: 'Red Chrome Legion Trooper',
    subtitle: 'Neofascista callejero armado con bates y cadenas',
    faction: 'Red Chrome Legion',
    threatTier: 'mook',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 7,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 2, REF: 6, DEX: 6, TECH: 3, COOL: 4, WILL: 5, LUCK: 0, MOVE: 5, BODY: 7, EMP: 1 },
    combatBases: [
      { label: 'Bate con Púas / Cadena', totalBase: 11, damage: '2d6', rof: 2 },
      { label: 'Escopeta Recortada', totalBase: 10, damage: '5d6', rof: 1 }
    ],
    weapons: [
      { name: 'Spiked Baseball Bat', skillBase: 11, damage: '2d6', rof: 2, mag: 0 },
      { name: 'Shotgun', skillBase: 10, damage: '5d6', rof: 1, mag: 4 }
    ],
    cyberware: ['Cyberarm cromado barato'],
    gear: ['Botas con punta de acero', 'Kevlar con parches de odio (SP 7 Cabeza, SP 11 Torso)'],
    specialRules: ['Odio ciego: Nunca intentará dialogar ni aceptará sobornos de edgerunners.'],
    loreSummary: 'Banda callejera de ideología supremacista y violenta que busca imponer su ley en los suburbios.'
  },
  {
    id: 'dg-iron-sights-sniper',
    name: 'Iron Sights Sniper',
    subtitle: 'Tirador de precisión oculto en las azoteas de la Zona de Combate',
    faction: 'Iron Sights',
    threatTier: 'lieutenant',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Solo',
    hp: 40,
    seriouslyWounded: 20,
    deathSave: 6,
    headSp: 7,
    bodySp: 11,
    stats: { INT: 6, REF: 8, DEX: 7, TECH: 4, COOL: 7, WILL: 6, LUCK: 2, MOVE: 6, BODY: 6, EMP: 3 },
    combatBases: [
      { label: 'Fusil Francotirador', totalBase: 15, damage: '5d6', rof: 1 },
      { label: 'Pistola Pesada', totalBase: 13, damage: '3d6', rof: 2 },
      { label: 'Percepción y Camuflaje', totalBase: 14 }
    ],
    weapons: [
      { name: 'Sniper Rifle with Scope', skillBase: 15, damage: '5d6', rof: 1, mag: 4 },
      { name: 'Heavy Pistol', skillBase: 13, damage: '3d6', rof: 2, mag: 8 }
    ],
    cyberware: ['Cybereye (Teleoptics, Targeting Scope)'],
    gear: ['Light Armorjack (SP 11 Torso, SP 7 Cabeza)', 'Manta de ocultación térmica'],
    specialRules: ['Disparo a la cabeza preparado: Si pasa 1 turno apuntando, su penalizador de disparo apuntado a la cabeza baja de -8 a -4.'],
    loreSummary: 'Controlan los corredores y tejados de Santo Domingo cobrando peajes mortales a quien cruce sin permiso.'
  },
  {
    id: 'dg-ncpd-riot-officer',
    name: 'NCPD Riot Officer',
    subtitle: 'Policía antidisturbios con escudo antibalas y escopeta de postas',
    faction: 'NCPD',
    threatTier: 'mook',
    sourceBook: 'danger_gal',
    sourceBookTitle: 'Danger Gal Dossier',
    era: '2045',
    role: 'Lawman',
    hp: 35,
    seriouslyWounded: 18,
    deathSave: 7,
    headSp: 11,
    bodySp: 13,
    stats: { INT: 4, REF: 6, DEX: 6, TECH: 3, COOL: 6, WILL: 6, LUCK: 0, MOVE: 5, BODY: 7, EMP: 4 },
    combatBases: [
      { label: 'Escopeta Cartucho de Goma', totalBase: 12, damage: '5d6 no letal', rof: 1 },
      { label: 'Golpe de Escudo Antidisturbios', totalBase: 11, damage: '1d6', rof: 2 }
    ],
    weapons: [
      { name: 'Shotgun (Rubber Slugs)', skillBase: 12, damage: '5d6', rof: 1, mag: 8, notes: 'Munición de goma no letal' },
      { name: 'Bulletproof Shield', skillBase: 11, damage: '1d6', rof: 2, mag: 0, notes: 'Escudo portátil con HP 20' }
    ],
    cyberware: ['Internal Agent', 'Audio Communicator'],
    gear: ['Casco antidisturbios con visera (SP 11)', 'Heavy Armorjack Body (SP 13)', 'Escudo antibalas (HP 20)'],
    specialRules: ['Línea de escudos: Si dos o más oficiales están cuerpo a cuerpo, sus escudos cubren los flancos.'],
    loreSummary: 'Desplegados para reprimir disturbios en las calles céntricas de Night City.'
  },

  // --------------------------------------------------------------------------
  // 5. LEYENDAS Y JEFES ICÓNICOS
  // --------------------------------------------------------------------------
  {
    id: 'legend-adam-smasher',
    name: 'Adam Smasher',
    subtitle: 'El Demonio de Arasaka // IEC Dragoon Full Body Conversion (Boss Legendario)',
    faction: 'Arasaka / Leyendas de Night City',
    threatTier: 'legend',
    sourceBook: 'core',
    sourceBookTitle: 'Cyberpunk RED Core Rulebook / CEMK 2077',
    era: '2077',
    role: 'Solo',
    hp: 95,
    seriouslyWounded: 48,
    deathSave: 15,
    headSp: 18,
    bodySp: 20,
    stats: { INT: 7, REF: 8, DEX: 8, TECH: 6, COOL: 9, WILL: 10, LUCK: 5, MOVE: 8, BODY: 15, EMP: 0 },
    combatBases: [
      { label: 'Cañón Automático / Ametralladora', totalBase: 18, damage: '6d6', rof: 1, notes: 'Autofire x4 devastador' },
      { label: 'Lanzacohetes de Hombro Pod', totalBase: 17, damage: '8d6', rof: 1, notes: 'Área 10x10m' },
      { label: 'Golpe Demoledor Borg', totalBase: 18, damage: '4d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Esquiva Balas Legendaria', totalBase: 18 }
    ],
    weapons: [
      { name: 'Tsunami Arms Helix / Borg Heavy Cannon', skillBase: 18, damage: '6d6', rof: 1, mag: 60, notes: 'Autofire x4' },
      { name: 'Shoulder Rocket Pod', skillBase: 17, damage: '8d6', rof: 1, mag: 4, notes: 'Explosivo antiblindaje' },
      { name: 'Hydraulic Borg Fist', skillBase: 18, damage: '4d6', rof: 2, mag: 0 }
    ],
    cyberware: [
      'Chasis FBC IEC Dragoon Superpesado (SP 20 Torso, SP 18 Cabeza)',
      'Sandevistan Militar Arasaka (+3 Init, esquiva continua)',
      'Linear Frame Borg BODY 15 integrado',
      'Pain Editor (Inmune a penalizaciones de heridas)',
      'Kiroshi Optics Mk.III con visión térmica y telemetría',
      'Self-ICE Militar (+4 defensa Quickhacking)'
    ],
    gear: ['Traje de blindaje reactivo', 'Comunicaciones seguras satelitales Arasaka'],
    specialRules: [
      'Inmunidad FBC Total: Es inmune a toxinas, asfixia, ahogamiento y drogas.',
      'Cero Empatía: Es un ciberpsicópata funcional despiadado, inmune a intimidación o persuasión.',
      'Cuerpos Rompibles: Cuando impacta con sus puños o pisa a un objetivo a 0 HP, lo desmiembra y mata al instante sin Death Save.',
      'Ablación Reducida: El blindaje de su chasis FBC solo se ablaciona 1 punto por cada 15 puntos de daño penetrante.'
    ],
    loreSummary: 'El mercenario más letal de la historia de Night City. Un cerebro humano dentro de un chasis militar acorazado de casi tres metros de altura leal a la familia Arasaka.'
  },
  {
    id: 'boss-full-borg-cyberpsycho',
    name: 'Full Borg Cyberpsycho Rampager',
    subtitle: 'Chasis Vermilion de asalto desquiciado (Interface RED Vol. 3)',
    faction: 'Ciberpsicópatas / FBC',
    threatTier: 'cyberpsycho',
    sourceBook: 'interface_red',
    sourceBookTitle: 'Interface RED Vol. 3 (Going Metal)',
    era: '2045',
    role: 'Solo',
    hp: 80,
    seriouslyWounded: 40,
    deathSave: 12,
    headSp: 15,
    bodySp: 15,
    stats: { INT: 4, REF: 8, DEX: 8, TECH: 5, COOL: 4, WILL: 9, LUCK: 2, MOVE: 8, BODY: 12, EMP: 0 },
    combatBases: [
      { label: 'Espada de Alta Frecuencia Borg', totalBase: 17, damage: '4d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Escopeta de Tambor Pesada', totalBase: 16, damage: '5d6', rof: 1 },
      { label: 'Esquiva Balas Legendaria', totalBase: 17 }
    ],
    weapons: [
      { name: 'Borg High-Frequency Blade', skillBase: 17, damage: '4d6', rof: 2, mag: 0 },
      { name: 'Drum Magazine Combat Shotgun', skillBase: 16, damage: '5d6', rof: 1, mag: 20 }
    ],
    cyberware: [
      'Chasis FBC Vermilion Borg (Interface RED Vol 3)',
      'Biopod sellado blindado',
      'Sandevistan Speedware',
      'Subdermal Plating militar',
      'Pain Editor'
    ],
    gear: ['Blindaje estructural integrado SP 15', 'Cargadores de postas incendiarias'],
    specialRules: [
      'Inmunidad FBC: Inmune a asfixia, biotoxinas y venenos biológicos.',
      'Carga desquiciada: Puede recorrer el doble de su MOVE si termina el movimiento trabado en combate cuerpo a cuerpo.'
    ],
    loreSummary: 'Un antiguo mercenario cuya Biovaina cerebral sufrió un fallo crítico de estabilidad neural, desatando una masacre en la Zona de Combate.'
  },
  {
    id: 'boss-maxtac-apex-commander',
    name: 'MaxTac Apex Squad Commander',
    subtitle: 'Comandante supremo del escuadrón de élite MaxTac',
    faction: 'NCPD MaxTac',
    threatTier: 'boss',
    sourceBook: 'cemk_2077',
    sourceBookTitle: 'Cyberpunk Edgerunners Mission Kit',
    era: '2077',
    role: 'Solo',
    hp: 75,
    seriouslyWounded: 38,
    deathSave: 11,
    headSp: 15,
    bodySp: 18,
    stats: { INT: 8, REF: 8, DEX: 8, TECH: 6, COOL: 9, WILL: 9, LUCK: 4, MOVE: 8, BODY: 10, EMP: 3 },
    combatBases: [
      { label: 'Fusil Tech Achilles Avanzado', totalBase: 17, damage: '5d6', rof: 1, notes: 'Tech perforante' },
      { label: 'Monowire de Alta Tensión', totalBase: 17, damage: '4d6', rof: 2, notes: 'Ignora mitad SP' },
      { label: 'Esquiva Balas Legendaria', totalBase: 17 }
    ],
    weapons: [
      { name: 'Achilles Tech Rifle Mk.II', skillBase: 17, damage: '5d6', rof: 1, mag: 30 },
      { name: 'Monowire Implant', skillBase: 17, damage: '4d6', rof: 2, mag: 0 }
    ],
    cyberware: [
      'Neuroport 2077 de Grado Militar',
      'Sandevistan Militar Mk.V (+4 Init)',
      'Subdermal Armor SP 11',
      'Self-ICE Militar Nivel 2 (+3 defensa)',
      'Monowire'
    ],
    gear: ['MaxTac Commander Exosuit (SP 18 Torso, SP 15 Cabeza)', 'Inmunobloqueadores', 'Baliza de despliegue de AV-4'],
    specialRules: [
      'Comando táctico: Todos los oficiales MaxTac en su escena ganan +2 a la Iniciativa y +1 a tiradas de ataque.',
      'Reflejos de Sandevistan: Puede esquivar proyectiles balísticos con DV igual a la tirada de ataque enemiga.'
    ],
    loreSummary: 'El último recurso del alcalde y el comisionado cuando una amenaza cibernética sobrepasa a todas las fuerzas policiales de Night City.'
  }
];

// ============================================================================
// HELPER: Convert EnemySheet to a valid CharacterSheet (for Roster import)
// ============================================================================

export function convertEnemyToCharacterSheet(enemy: EnemySheet): CharacterSheet {
  const defaultCombatSkills: Record<CombatSkillKey, number> = {
    handgun: 0,
    shoulderArms: 0,
    autofire: 0,
    heavyWeapons: 0,
    archery: 0,
    meleeWeapon: 0,
    brawling: 2,
    martialArts: 0,
    evasion: 2,
    athletics: 2,
    firstAid: 2,
    paramedic: 0,
    cybertech: 0,
    perception: 2,
    concentration: 2,
    resistTortureDrugs: 0
  };

  // Map high combat bases to matching skills
  for (const base of enemy.combatBases) {
    const l = base.label.toLowerCase();
    if (l.includes('pistola') || l.includes('pistol')) {
      defaultCombatSkills.handgun = Math.max(0, base.totalBase - enemy.stats.REF);
    } else if (l.includes('fusil') || l.includes('rifle') || l.includes('escopeta') || l.includes('shotgun')) {
      defaultCombatSkills.shoulderArms = Math.max(0, base.totalBase - enemy.stats.REF);
    } else if (l.includes('pesada') || l.includes('cohete') || l.includes('rocket') || l.includes('lanzador')) {
      defaultCombatSkills.heavyWeapons = Math.max(0, base.totalBase - enemy.stats.REF);
    } else if (l.includes('katana') || l.includes('cuchillo') || l.includes('espada') || l.includes('melee') || l.includes('navaja')) {
      defaultCombatSkills.meleeWeapon = Math.max(0, base.totalBase - enemy.stats.DEX);
    } else if (l.includes('esquiva') || l.includes('evasion')) {
      defaultCombatSkills.evasion = Math.max(0, base.totalBase - enemy.stats.DEX);
    }
  }

  const equippedWeapons: EquippedWeapon[] = enemy.weapons.map((w, idx) => ({
    id: `enemy-wep-${enemy.id}-${idx}`,
    instanceId: `wep-inst-${enemy.id}-${idx}-${Date.now()}`,
    name: w.name,
    type: w.mag > 0 ? 'Ranged' : 'Melee',
    skill: w.mag > 0 ? (w.name.toLowerCase().includes('pistol') ? 'Handgun' : 'Shoulder Arms') : 'Melee Weapon',
    damage: w.damage,
    rof: w.rof,
    hands: 1,
    concealable: false,
    cost: 500,
    standardMag: w.mag,
    currentMag: w.mag,
    ammoType: w.mag > 0 ? 'Standard' : 'N/A',
    loadedAmmoType: w.mag > 0 ? 'Standard' : 'N/A',
    inHand: idx === 0,
    reserveAmmo: w.mag * 3,
    notes: w.notes
  }));

  const rank =
    enemy.threatTier === 'legend' || enemy.threatTier === 'boss'
      ? 7
      : enemy.threatTier.includes('lieutenant') || enemy.threatTier === 'mini_boss'
      ? 5
      : 4;

  return {
    id: `char-enemy-${enemy.id}-${Date.now()}`,
    handle: enemy.name,
    role: enemy.role,
    roleRank: rank,
    notes: `[FICHA DE AMENAZA // ${enemy.faction.toUpperCase()}]\n${enemy.subtitle}\n\n${enemy.loreSummary}\n\nREGLAS ESPECIALES:\n${enemy.specialRules.map(r => `• ${r}`).join('\n')}`,
    stats: { ...enemy.stats },
    currentHp: enemy.hp,
    currentLuck: enemy.stats.LUCK,
    currentHumanity: Math.max(10, enemy.stats.EMP * 10),
    headArmor: {
      name: `${enemy.name} Head Armor`,
      maxSp: enemy.headSp,
      currentSp: enemy.headSp,
      penalty: 0
    },
    bodyArmor: {
      name: `${enemy.name} Body Armor`,
      maxSp: enemy.bodySp,
      currentSp: enemy.bodySp,
      penalty: enemy.bodySp >= 15 ? -2 : 0
    },
    skills: defaultCombatSkills,
    equippedWeapons,
    installedCyberwareIds: [],
    activeInjuries: [],
    eurodollars: 200,
    inventory: [],
    transactions: [],
    era: enemy.era,
    creationMethod: 'pregen',
    roleAbilityName: enemy.role === 'Solo' ? 'Combat Awareness' : (enemy.role === 'Netrunner' ? 'Interface' : 'Role Ability'),
    generalSkills: {
      Perception: 4,
      Athletics: 4,
      Stealth: 4,
      Streetwise: 4
    },
    fashionBudgetRemaining: 0,
    hasNeuroport: enemy.era === '2077',
    lifepath: {
      culturalRegion: 'Night City',
      personality: 'Combatiente hostil',
      clothingStyle: 'Equipo de combate táctico',
      hairstyle: 'Estándar',
      affectation: 'Marcas de combate visibles',
      valueMost: 'Cumplir la misión o defender su territorio',
      feelAboutPeople: 'Peligrosos o presas',
      valuedPerson: 'Líder de facción',
      valuedPossession: 'Armas de combate',
      familyBackground: 'Reclutado por su facción',
      childhoodEnvironment: 'Zonas de combate de Night City',
      familyCrisis: 'Perdió todo en la calle',
      friends: [],
      tragicLoveAffairs: [],
      enemies: [],
      roleLifepath: {},
      lifeGoal: 'Sobrevivir al próximo tiroteo'
    }
  };
}
