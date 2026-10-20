import type {
  CharacterDebt,
  CharacterEra,
  CharacterLifepath,
  CharacterSheet,
  CombatSkillKey,
  CreationMethod,
  EquippedWeapon,
  LifepathEnemy,
  StatKey
} from '../types/cyberpunk';

export type { CharacterDebt, LifepathEnemy };

// ============================================================================
// 1. ERA CATALOG (2045 RED vs 2077 CEMK)
// ============================================================================

export interface EraInfo {
  id: CharacterEra;
  title: string;
  subtitle: string;
  badge: string;
  summary: string;
  whatYouGet: string[];
  neuroportSubsystems?: Array<{
    name: string;
    benefit: string;
    savedCost: string;
  }>;
  tacticalWarnings: string[];
}

export const ERA_CATALOG: EraInfo[] = [
  {
    id: '2045',
    title: 'Tiempo del Rojo (Time of the Red - 2045)',
    subtitle: 'Posguerra de la 4ª Guerra Corporativa, cielos carmesí y reconstrucción callejera',
    badge: '2045 CORE',
    summary:
      'La era canónica de Cyberpunk RED. Night City se levanta de sus cenizas tras la detonación nuclear de la Torre Arasaka. La Red global fue destruida por Rache Bartmoss y sustituida por Arquitecturas de Red locales no interconectadas. La economía opera bajo escasez y los Night Markets gobernados por Fixers son la única vía para conseguir equipo militar o cibernética avanzada.',
    whatYouGet: [
      'Presupuesto inicial canónico: 2,550 €$ en equipo/cromo + 800 €$ exclusivos de Moda y Estilo de Vida.',
      'Sistemas de Netrunning con Cyberdeck analógico conectado por cables físicos Interface Plugs.',
      'Disponibilidad de armas estándar y exóticas de la posguerra (Militech, Arasaka, GunMart, Federated Arms).',
      'Acceso a las 10 Habilidades de Rol clásicas del Core Rulebook a Rango 4.',
      'Instalación manual de Neuralware y Ciberware en Clínicas y Hospitales locales.',
      'Seguimiento tradicional de Humanidad y Ciberpsicosis según la pérdida por implante.'
    ],
    tacticalWarnings: [
      'Todo implante de Neural Link cuesta 500 €$ y reduce 7 puntos de Humanidad (2d6).',
      'Sin conexión inalámbrica universal a la Red: hackear exige conectarse físicamente con cables dentro de 6m.',
      'Cualquier ítem de más de 500 €$ requiere contactos con un Fixer o visitar un Night Market.'
    ]
  },
  {
    id: '2077',
    title: 'Era de Edgerunners (Cyberpunk 2077 - CEMK)',
    subtitle: 'Megacorporaciones renacidas, Neuroport unificado de serie y Quickhacking inalámbrico',
    badge: '2077 CEMK',
    summary:
      'La era tecnológica plasmada en Cyberpunk: Edgerunners y el videojuego 2077. Arasaka y Militech dominan las alturas en una Night City hiperconectada, resplandeciente y despiadada. Todo ciudadano y edgerunner porta un Neuroport de serie desde su adolescencia, unificando comunicaciones, escaneo biológico y proyecciones de realidad aumentada en el sistema nervioso.',
    whatYouGet: [
      'Neuroport Universal de serie preinstalado gratuitamente (ahorro de más de 2,500 €$ y 20+ HL).',
      'Armas de tecnología 2077: Power (rebotes tácticos), Tech (disparo perforante de coberturas) y Smart (guiado balístico).',
      'Soporte para Quickhacking en combate táctico: 1 NET Action por Quickhack, sin RAM (CEMK p. 16).',
      'Acceso a las plantillas pregeneradas y estilos de la tripulación de Maine y David Martinez.',
      'Mecánicas avanzadas de Estrés, Humanidad y Ciberpsicosis acelerada del Edgerunners Mission Kit.',
      'Catálogo de ciberware moderno: Sandevistan militar Militech, Monowire, Mantis Blades y Gorilla Arms.'
    ],
    neuroportSubsystems: [
      {
        name: 'Neural Link Integrado',
        benefit: 'Procesador neural base con 5 ranuras de opción para ciberware de combate.',
        savedCost: '500 €$ / 7 Humanidad'
      },
      {
        name: 'Holocall + Agent Interno',
        benefit: 'Comunicaciones de voz, videollamadas y base de datos con IA asistencial en el cerebro.',
        savedCost: '100 €$ / 3 Humanidad'
      },
      {
        name: 'HUD Ocular + Chyron',
        benefit: 'Proyección holográfica retiniana de munición, retícula de puntería y estado de blindaje.',
        savedCost: '100 €$ / 2 Humanidad'
      },
      {
        name: 'Biomonitor Subdérmico',
        benefit: 'Monitoreo de signos vitales, HP en tiempo real y alerta de toxinas en sangre.',
        savedCost: '100 €$ / 2 Humanidad'
      },
      {
        name: 'Virtuality Retiniana',
        benefit: 'Visualización directa de interfaces virtuales y ciberespacio superpuesto al mundo real.',
        savedCost: '100 €$ / 2 Humanidad'
      },
      {
        name: 'Personal Link (Cable de 2m)',
        benefit: 'Cable retráctil en muñeca para interactuar con vehículos, terminales y Smartguns.',
        savedCost: '500 €$ / 7 Humanidad'
      },
      {
        name: '2x Ranuras para Chipware',
        benefit: 'Conexión plug-and-play instantánea de Skill Chips y fragmentos de datos en la nuca.',
        savedCost: '500 €$ / 7 Humanidad'
      }
    ],
    tacticalWarnings: [
      '¡Vulnerabilidad cibernética!: Al tener Neuroport inalámbrico, eres vulnerable a Quickhacks de Netrunners rivales.',
      'Mayor riesgo de sobrecalentamiento y ciberpsicosis rápida si instalas cromo militar sin descansos.',
      'La ley corporativa de Trauma Team y MaxTac responde con fuerza letal ante incidentes cibernéticos.'
    ]
  }
];

// ============================================================================
// 2. CREATION METHODS CATALOG
// ============================================================================

export interface CreationMethodInfo {
  id: CreationMethod;
  name: string;
  subtitle: string;
  difficultyBadge: string;
  summary: string;
  whatYouGet: string[];
}

export const CREATION_METHODS_CATALOG: CreationMethodInfo[] = [
  {
    id: 'streetrat',
    name: 'Streetrat (Rata Callejera - Plantillas Rápidas)',
    subtitle: 'Ideal para principiantes y partidas inmediatas sin cálculos complejos',
    difficultyBadge: 'Principiante / Instantáneo',
    summary:
      'El método más rápido y balanceado del Core Rulebook. Eliges tu Rol y el sistema asigna automáticamente un bloque canónico de estadísticas optimizado (~62 puntos) y un paquete de habilidades equilibrado, junto con el equipo oficial de inicio para ese rol.',
    whatYouGet: [
      'Bloque de 10 STATS oficiales prediseñados y balanceados por diseñadores de R. Talsorian Games.',
      'Asignación automática de las 16 habilidades de combate y las 13 habilidades básicas canónicas.',
      'Paquete inicial de armas, blindaje SP 11 (Head/Body) y ciberware reglamentario de Rol.',
      'Cálculo automático de HP, LUCK, Humanidad y umbrales de Herida Grave sin errores.',
      'Generación rápida del Lifepath mediante tiradas de dados automáticas o personalización libre.'
    ]
  },
  {
    id: 'edgerunner',
    name: 'Edgerunner (Tiradas Rápidas en Tabla)',
    subtitle: 'El balance perfecto entre azar temático y especialización de Rol',
    difficultyBadge: 'Intermedio / Guiado',
    summary:
      'Cada Rol dispone de una tabla oficial de 10 filas de combinaciones de estadísticas. Tiras 1d10 (o eliges manualmente tu fila favorita) para determinar tus atributos, asegurando que tu personaje tenga virtudes destacadas y defectos interesantes sin romper el balance de mesa.',
    whatYouGet: [
      'Tirada de 1d10 en la tabla canónica de arquetipos de tu Rol (páginas 44-77 del Core Rulebook).',
      'Variaciones estadísticas orgánicas respetando siempre la identidad y requerimientos de tu Rol.',
      'Paquetes de habilidades sugeridos con opción de reasignar puntos tácticos.',
      'Equipamiento de inicio completo por Rol más la cartera reglamentaria de 2,550 €$ + 800 €$ de moda.',
      'Permite combinar tiradas de Lifepath con ajustes de trasfondo según los dados.'
    ]
  },
  {
    id: 'complete_package',
    name: 'Complete Package (Paquete Completo - Compra por Puntos)',
    subtitle: 'Libertad absoluta de min-maxing y personalización táctica para veteranos',
    difficultyBadge: 'Avanzado / Personalización Total',
    summary:
      'Construcción punto por punto según las reglas de la página 40 del Core Rulebook. Dispones de un pool de 62 puntos para comprar tus 10 STATS (entre 2 y 8) y 86 puntos para distribuir libremente entre las habilidades del sistema, con acceso completo a la tienda para gastar tus 2,550 €$.',
    whatYouGet: [
      'Pool de 62 puntos de Atributo (STATS) para repartir entre INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY y EMP.',
      'Pool de 86 puntos de Habilidades (Skills) para comprar habilidades de combate y soporte a nivel 2 a 6.',
      'Tienda inicial interactiva para gastar tus 2,550 €$ en cualquier arma, blindaje, ciberware o equipo del catálogo.',
      'Presupuesto exclusivo de 800 €$ para ropa, peinados y estilo de vida.',
      'Apto para crear híbridos tácticos (ej. Solo-Tech, Netrunner de combate cuerpo a cuerpo, etc.).'
    ]
  },
  {
    id: 'pregen',
    name: 'Pregen (Edgerunner Oficial Preconstruido)',
    subtitle: 'Salta directo a Night City encarnando leyendas de 2045 o 2077',
    difficultyBadge: 'Instant-Play / Canónico',
    summary:
      'Fichas oficiales completas listas para la acción, extraídas directamente del Single-Shot Pack 2045 y del Cyberpunk Edgerunners Mission Kit 2077. Incluyen estadísticas canónicas, inventario, ciberware preinstalado, trasfondo e ilustraciones.',
    whatYouGet: [
      '7 Edgerunners oficiales de CEMK 2077: David Martinez, Lucy, Rebecca, Maine, Kiwi, Falco y Pilar.',
      '6 Edgerunners oficiales de 2045 (Single-Shot Pack): Forty, Torch, Redtail, Hound, Bug y Doc.',
      '4 Plantillas de Rivales/Enemigos jugables: Arasaka Agent, Maelstrom Psycho, Militech Trooper y Tyger Claws Ronin.',
      'Ficha 100% armada con armas en mano, munición, SP y Lifepath canónico listo en 1 clic.'
    ]
  }
];

// ============================================================================
// 3. STAT TOOLTIPS & NOVICE ONBOARDING
// ============================================================================

export interface StatTooltipInfo {
  name: string;
  spanishName: string;
  shortSummary: string;
  beginnerExplanation: string;
  dependentSkills: string[];
  mechanicalBreakpoints: string[];
}

export const STAT_TOOLTIPS: Record<StatKey, StatTooltipInfo> = {
  INT: {
    name: 'Intelligence (INT)',
    spanishName: 'Inteligencia',
    shortSummary: 'Capacidad de deducción, memoria, análisis táctico y conocimientos técnicos.',
    beginnerExplanation:
      'Representa tu astucia, agudeza mental y capacidad para resolver problemas bajo presión. Si quieres ser un Netrunner que hackea códigos complejos, un Detective que descubre pistas o un estratega que predice emboscadas, necesitas INT alta.',
    dependentSkills: ['Perception', 'Deduction', 'Interface (Netrunning)', 'Library Search', 'Tactics', 'Local Expert'],
    mechanicalBreakpoints: [
      'INT 6+: Requerido para Netrunners competentes en arquitecturas de red complejas.',
      'INT 8: Nivel genial; permite resolver enigmas científicos y hackeos de grado militar sin apenas margen de fallo.'
    ]
  },
  REF: {
    name: 'Reflexes (REF)',
    spanishName: 'Reflejos',
    shortSummary: 'Velocidad de reacción física, puntería balística y tiempo de respuesta.',
    beginnerExplanation:
      'Tu velocidad nerviosa para apuntar y disparar armas a distancia. Gobierna el uso de pistolas, fusiles, ametralladoras y vehículos. ¡Y lo más importante en Cyberpunk: si tienes REF 8 o más, tus reflejos son tan inhumanos que puedes esquivar balas en pleno vuelo!',
    dependentSkills: ['Handgun', 'Shoulder Arms', 'Autofire', 'Heavy Weapons', 'Archery', 'Drive Land Vehicle'],
    mechanicalBreakpoints: [
      '★ REF 8+: Habilidad legendaria de "Bullet Dodging" (Esquivar Proyectiles con la habilidad Evasion contra tirada de ataque enemiga).',
      'REF 7+: Puntería de élite recomendada para francotiradores y soldados Solo.'
    ]
  },
  DEX: {
    name: 'Dexterity (DEX)',
    spanishName: 'Destreza',
    shortSummary: 'Coordinación corporal, atletismo, combate cuerpo a cuerpo y sigilo.',
    beginnerExplanation:
      'Tu agilidad física, flexibilidad y control motor fino. Si quieres cortar a tus enemigos con katanas, pelear a puño limpio con artes marciales, saltar tejados, colarte por conductos en silencio o esquivar golpes y explosiones, DEX es tu estadística reina.',
    dependentSkills: ['Evasion', 'Athletics', 'Melee Weapon', 'Brawling', 'Martial Arts', 'Stealth'],
    mechanicalBreakpoints: [
      'DEX alta + Evasion alta: La mejor defensa pasiva del juego para no recibir daño en combate cuerpo a cuerpo.',
      'DEX 8: Permite maximizar maniobras especiales de Artes Marciales y acrobacias extremas.'
    ]
  },
  TECH: {
    name: 'Technique (TECH)',
    spanishName: 'Técnica',
    shortSummary: 'Habilidad manual, reparación de ciberware, medicina y fabricación.',
    beginnerExplanation:
      'Mide la habilidad con tus manos, el pulso de cirujano y la comprensión de circuitos, armas y prótesis mecánicas. Los Medtechs que operan en ambulancias y los Techs que mejoran y construyen armas caseras dependen totalmente de TECH.',
    dependentSkills: ['First Aid', 'Paramedic', 'Cybertech', 'Electronics/Security Tech', 'Weaponstech', 'Maker'],
    mechanicalBreakpoints: [
      'TECH 6+: Permite reparar blindajes y realizar primeros auxilios (Quick Fix) con éxito regular en combate.',
      'TECH 8: Requerido para cirugías cibernéticas mayores y fabricación de mejoras exóticas de armas (Maker).'
    ]
  },
  COOL: {
    name: 'Cool (COOL)',
    spanishName: 'Frialdad / Temple',
    shortSummary: 'Carisma, temple bajo fuego, presencia intimidatoria y don de gentes.',
    beginnerExplanation:
      'Tu capacidad de mantener la calma cuando te apuntan con una escopeta a la cara, tu carisma para convencer a guardias de seguridad o tu magnetismo para mover multitudes en un concierto de rock. Muy importante para Rockerboys, Fixers y Medias.',
    dependentSkills: ['Persuasion', 'Interrogation', 'Streetwise', 'Trading', 'Charismatic Impact'],
    mechanicalBreakpoints: [
      'COOL alto: Permite superar chequeos de negociación y sobornos críticos sin disparar una sola bala.',
      'Base de la habilidad de intimidación y negociación de precios en los Night Markets.'
    ]
  },
  WILL: {
    name: 'Willpower (WILL)',
    spanishName: 'Fuerza de Voluntad',
    shortSummary: 'Determinación mental, tolerancia al dolor y componente clave de tus Puntos de Golpe (HP).',
    beginnerExplanation:
      'Tu resistencia mental para no quebrarte ante el estrés, resistir torturas, drogas callejeras y el pánico del Fuego de Supresión. Junto con BODY, determina cuántos Puntos de Golpe (HP) tienes en tu ficha.',
    dependentSkills: ['Concentration', 'Resist Torture/Drugs'],
    mechanicalBreakpoints: [
      'Fórmula de HP: 10 + 5 * ceil((BODY + WILL) / 2). Cada punto de WILL incrementa directamente tu supervivencia en combate.',
      'WILL 6+: Permite resistir drogas y el pánico de granadas flashbang con solvencia.'
    ]
  },
  LUCK: {
    name: 'Luck (LUCK)',
    spanishName: 'Suerte Táctil',
    shortSummary: 'Reserva de puntos rejugable que puedes sumar a cualquier tirada de dados crítica.',
    beginnerExplanation:
      'Un pool de puntos táctiles que gastas en momentos desesperados. Cada punto de Suerte gastado suma +1 directo al resultado de tu tirada de 1d10 (ataque, esquiva, habilidad o medicina). La reserva se gasta durante la sesión y se restaura por completo al inicio de la siguiente.',
    dependentSkills: ['Aplica a cualquier tirada de 1d10 antes de lanzar el dado'],
    mechanicalBreakpoints: [
      'LUCK 6+: Te permite asegurar aciertos en disparos apuntados a la cabeza (-8) o estabilizaciones críticas.',
      'LUCK 8: Un auténtico ángel guardián para sobrevivir a situaciones casi imposibles.'
    ]
  },
  MOVE: {
    name: 'Movement (MOVE)',
    spanishName: 'Movimiento',
    shortSummary: 'Metros de desplazamiento por turno en combate y velocidad de carrera.',
    beginnerExplanation:
      'Determina qué tan rápido corres en combate táctico. Cada punto de MOVE te otorga 2 metros de movimiento estándar por turno (o MOVE * 4 metros si usas tu Acción completa para correr).',
    dependentSkills: ['Velocidad de combate', 'Alcance de salto con Athletics'],
    mechanicalBreakpoints: [
      'MOVE 6: 12 metros por turno. Estándar cómodo para posicionarte detrás de coberturas.',
      'MOVE 8+: 16 metros por turno. Flanqueador nato capaz de cruzar la calle y acuchillar antes de que reaccionen.'
    ]
  },
  BODY: {
    name: 'Body Type (BODY)',
    spanishName: 'Constitución Física',
    shortSummary: 'Fuerza muscular, masa corporal, resistencia al daño y capacidad de carga.',
    beginnerExplanation:
      'Tu resistencia física pura y potencia atlética. Determina junto con WILL tus Puntos de Golpe (HP), el daño que infliges a puño limpio, tu umbral de muerte y si puedes disparar armas pesadas sin apoyo.',
    dependentSkills: ['Brawling Damage', 'Death Saves'],
    mechanicalBreakpoints: [
      'BODY 8+: Permite disparar armas pesadas de dos manos a una mano y empuñar armas de cuerpo a cuerpo pesadas sin penalizador.',
      'Base para Death Save: Cuanto mayor sea tu BODY, más difícil es que mueras cuando tus HP llegan a cero.'
    ]
  },
  EMP: {
    name: 'Empathy (EMP)',
    spanishName: 'Empatía y Humanidad',
    shortSummary: 'Capacidad de conectar con otros seres humanos y margen de seguridad de Ciberpsicosis.',
    beginnerExplanation:
      'Mide tu humanidad, calidez y conexión emocional con los demás. Tu reserva máxima de Humanidad es EMP * 10. Cada vez que instalas ciberware en tu cuerpo, pierdes puntos de Humanidad. Si tu EMP cae a 0, te conviertes en un Ciberpsicópata homicida controlado por el Director de Juego.',
    dependentSkills: ['Human Perception', 'Conversation', 'Pérdida de Humanidad'],
    mechanicalBreakpoints: [
      'MaxHumanity = EMP * 10: Cada punto de EMP te da 10 puntos de "colchón" de Humanidad para instalar ciberware.',
      'Si pierdes 10 puntos de Humanidad, tu EMP baja en 1 punto, afectando tus tiradas de empatía y negociación.'
    ]
  }
};

// ============================================================================
// 4. ROLES CATALOG & LOADOUTS
// ============================================================================

export interface RoleInfo {
  id: string;
  name: string;
  spanishSubtitle: string;
  roleAbility: string;
  roleAbilitySummary: string;
  beginnerTooltip: string;
  whatYouGet: string[];
  streetratStats: Record<StatKey, number>;
  edgerunnerStatTable: Array<Record<StatKey, number>>;
  templateCombatSkills: Partial<Record<CombatSkillKey, number>>;
  templateGeneralSkills: Record<string, number>;
  startingLoadout: {
    weaponNames: string[];
    armorNames: string[];
    cyberwareIds: string[];
    gearNames: string[];
    fashionSummary: string;
    itemsBreakdown: string[];
  };
}

export const ROLES_CATALOG: RoleInfo[] = [
  {
    id: 'solo',
    name: 'Solo',
    spanishSubtitle: 'Asesino a sueldo, guardaespaldas militar y máquina de guerra',
    roleAbility: 'Combat Awareness',
    roleAbilitySummary:
      'Dispones de un pool de puntos tácticos que puedes distribuir entre daño aumentado, iniciativa relámpago, puntería mejorada y percepción de amenazas.',
    beginnerTooltip:
      'Si quieres disparar primero, resistir balas y dominar cada tiroteo en la mesa, el Solo es la elección definitiva.',
    whatYouGet: [
      'Habilidad Combat Awareness a Rango 4 (permite redistribuir 4 puntos tácticos cada turno).',
      'Plantilla estadística de élite militar con REF 8 (capaz de esquivar proyectiles de inicio).',
      'Arsenal de asalto: Fusil de asalto militar (5d6, Autofire x4) y Pistola pesada (3d6).',
      'Blindaje Light Armorjack completo (Cabeza SP 11 + Cuerpo SP 11).',
      'Cybereye con módulo de puntería o Neural Link preinstalado.'
    ],
    streetratStats: {
      INT: 6,
      REF: 8,
      DEX: 7,
      TECH: 3,
      COOL: 7,
      WILL: 7,
      LUCK: 5,
      MOVE: 6,
      BODY: 8,
      EMP: 5
    },
    edgerunnerStatTable: [
      { INT: 6, REF: 8, DEX: 7, TECH: 4, COOL: 6, WILL: 7, LUCK: 6, MOVE: 6, BODY: 7, EMP: 5 },
      { INT: 5, REF: 8, DEX: 8, TECH: 3, COOL: 7, WILL: 7, LUCK: 5, MOVE: 6, BODY: 8, EMP: 5 },
      { INT: 7, REF: 8, DEX: 6, TECH: 3, COOL: 8, WILL: 6, LUCK: 6, MOVE: 6, BODY: 7, EMP: 5 },
      { INT: 6, REF: 8, DEX: 7, TECH: 3, COOL: 7, WILL: 8, LUCK: 5, MOVE: 5, BODY: 8, EMP: 5 },
      { INT: 5, REF: 8, DEX: 7, TECH: 4, COOL: 6, WILL: 7, LUCK: 7, MOVE: 7, BODY: 6, EMP: 5 },
      { INT: 6, REF: 8, DEX: 8, TECH: 3, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 8, EMP: 5 },
      { INT: 7, REF: 8, DEX: 7, TECH: 3, COOL: 7, WILL: 7, LUCK: 5, MOVE: 6, BODY: 7, EMP: 5 },
      { INT: 6, REF: 8, DEX: 6, TECH: 4, COOL: 8, WILL: 7, LUCK: 6, MOVE: 5, BODY: 8, EMP: 4 },
      { INT: 5, REF: 8, DEX: 7, TECH: 4, COOL: 7, WILL: 8, LUCK: 5, MOVE: 6, BODY: 7, EMP: 5 },
      { INT: 6, REF: 8, DEX: 8, TECH: 3, COOL: 7, WILL: 6, LUCK: 6, MOVE: 7, BODY: 6, EMP: 5 }
    ],
    templateCombatSkills: {
      handgun: 6,
      shoulderArms: 6,
      autofire: 4,
      heavyWeapons: 2,
      meleeWeapon: 5,
      brawling: 4,
      evasion: 6,
      athletics: 4,
      perception: 5,
      firstAid: 3,
      concentration: 4,
      resistTortureDrugs: 4
    },
    templateGeneralSkills: {
      Stealth: 4,
      Tactics: 4,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Assault Rifle', 'Heavy Pistol', 'Medium Melee Weapon'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor', 'interface-plugs'],
      gearNames: ['Agent', 'Airhypo', 'Flashlight', 'Pocket Amp'],
      fashionSummary: 'Chaqueta de combate táctico reforzada, botas militares y gafas polarizadas.',
      itemsBreakdown: [
        'Fusil de asalto estándar (5d6, 25 balas, Autofire x4)',
        'Pistola pesada (3d6, cargador de 8 balas)',
        'Cuchillo de combate táctico (2d6)',
        'Blindaje Light Armorjack Cabeza y Cuerpo (SP 11)',
        '50x Balas de Rifle y 30x Balas de Pistola Pesada'
      ]
    }
  },
  {
    id: 'netrunner',
    name: 'Netrunner',
    spanishSubtitle: 'Vaquero del ciberespacio, hacker táctico e infiltrador de sistemas',
    roleAbility: 'Interface',
    roleAbilitySummary:
      'Te permite penetrar arquitecturas de red piso por piso, rezear programas ofensivos y Black ICE, y desactivar cámaras y torretas.',
    beginnerTooltip:
      'Si disfrutas quebrar defensas informáticas, controlar drones y freír cerebros con virus digitales, este es tu rol.',
    whatYouGet: [
      'Habilidad Interface a Rango 4 (permite realizar 3 Net Actions por turno).',
      'Cyberdeck estándar con 7 ranuras de memoria cargado con programas ofensivos y Black ICE.',
      'Neural Link e Interface Plugs de serie instalados en la nuca.',
      'Armamento de defensa personal: Subfusil o Pistola Pesada compacta.',
      'Blindaje Light Armorjack completo (SP 11).'
    ],
    streetratStats: {
      INT: 8,
      REF: 7,
      DEX: 6,
      TECH: 7,
      COOL: 6,
      WILL: 7,
      LUCK: 6,
      MOVE: 5,
      BODY: 4,
      EMP: 6
    },
    edgerunnerStatTable: [
      { INT: 8, REF: 7, DEX: 6, TECH: 7, COOL: 5, WILL: 7, LUCK: 6, MOVE: 5, BODY: 5, EMP: 6 },
      { INT: 8, REF: 6, DEX: 7, TECH: 8, COOL: 6, WILL: 6, LUCK: 6, MOVE: 5, BODY: 4, EMP: 6 },
      { INT: 7, REF: 7, DEX: 6, TECH: 7, COOL: 6, WILL: 8, LUCK: 5, MOVE: 6, BODY: 4, EMP: 6 },
      { INT: 8, REF: 7, DEX: 5, TECH: 7, COOL: 6, WILL: 7, LUCK: 7, MOVE: 5, BODY: 4, EMP: 6 },
      { INT: 8, REF: 6, DEX: 6, TECH: 8, COOL: 5, WILL: 7, LUCK: 6, MOVE: 6, BODY: 4, EMP: 6 },
      { INT: 7, REF: 7, DEX: 7, TECH: 7, COOL: 6, WILL: 6, LUCK: 6, MOVE: 5, BODY: 5, EMP: 6 },
      { INT: 8, REF: 8, DEX: 5, TECH: 6, COOL: 6, WILL: 7, LUCK: 5, MOVE: 5, BODY: 5, EMP: 7 },
      { INT: 8, REF: 6, DEX: 6, TECH: 7, COOL: 7, WILL: 7, LUCK: 6, MOVE: 5, BODY: 4, EMP: 6 },
      { INT: 7, REF: 7, DEX: 6, TECH: 8, COOL: 5, WILL: 7, LUCK: 6, MOVE: 6, BODY: 4, EMP: 6 },
      { INT: 8, REF: 7, DEX: 6, TECH: 6, COOL: 6, WILL: 8, LUCK: 5, MOVE: 5, BODY: 5, EMP: 6 }
    ],
    templateCombatSkills: {
      handgun: 6,
      autofire: 2,
      evasion: 5,
      athletics: 3,
      cybertech: 6,
      perception: 6,
      firstAid: 2,
      concentration: 6,
      resistTortureDrugs: 3
    },
    templateGeneralSkills: {
      'Electronics/Security Tech': 6,
      'Library Search': 5,
      Stealth: 4,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Heavy Pistol', 'Light Melee Weapon'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor', 'interface-plugs', 'chyron'],
      gearNames: ['Cyberdeck', 'Virtuality Goggles', 'Agent', 'Cables de Datos'],
      fashionSummary: 'Sudadera holgada impermeable con capucha, zapatillas ligeras y visores cibernéticos.',
      itemsBreakdown: [
        'Pistola pesada (3d6, cargador de 8 balas)',
        'Cyberdeck básico (7 ranuras)',
        'Programas: Sword (Attacker), Armor (Defender), Eraser (Booster)',
        'Blindaje Light Armorjack (Cabeza SP 11, Torso SP 11)',
        'Neural Link e Interface Plugs instalados'
      ]
    }
  },
  {
    id: 'tech',
    name: 'Tech',
    spanishSubtitle: 'Ingeniero callejero, armero rebelde y modificador de tecnología',
    roleAbility: 'Maker',
    roleAbilitySummary:
      'Capacidad para reparar, mejorar, inventar y fabricar armas caseras, blindajes y ciberware modificado.',
    beginnerTooltip:
      'Si quieres que tus armas hagan más daño, construir tus propios drones o blindar el coche del equipo, sé un Tech.',
    whatYouGet: [
      'Habilidad Maker a Rango 4 (subespecialidades de Fabricación, Modificación e Ingeniería).',
      'Kit completo de herramientas Techtool con escáneres diagnósticos de campo.',
      'Escopeta pesada o Fusil táctico con pistola de apoyo.',
      'Blindaje Light Armorjack completo (SP 11).',
      'Capacidad de reparar armaduras dañadas de tus compañeros entre combates.'
    ],
    streetratStats: {
      INT: 7,
      REF: 6,
      DEX: 6,
      TECH: 8,
      COOL: 5,
      WILL: 6,
      LUCK: 6,
      MOVE: 6,
      BODY: 6,
      EMP: 6
    },
    edgerunnerStatTable: [
      { INT: 7, REF: 6, DEX: 6, TECH: 8, COOL: 5, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 6 },
      { INT: 6, REF: 7, DEX: 6, TECH: 8, COOL: 5, WILL: 7, LUCK: 5, MOVE: 6, BODY: 6, EMP: 6 },
      { INT: 7, REF: 6, DEX: 7, TECH: 8, COOL: 4, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 6 },
      { INT: 8, REF: 6, DEX: 6, TECH: 8, COOL: 5, WILL: 6, LUCK: 5, MOVE: 5, BODY: 7, EMP: 6 },
      { INT: 7, REF: 7, DEX: 5, TECH: 8, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 5, EMP: 6 },
      { INT: 6, REF: 6, DEX: 7, TECH: 8, COOL: 5, WILL: 7, LUCK: 6, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 7, REF: 6, DEX: 6, TECH: 8, COOL: 6, WILL: 6, LUCK: 5, MOVE: 7, BODY: 5, EMP: 6 },
      { INT: 8, REF: 5, DEX: 6, TECH: 8, COOL: 5, WILL: 7, LUCK: 6, MOVE: 6, BODY: 5, EMP: 6 },
      { INT: 6, REF: 7, DEX: 6, TECH: 8, COOL: 4, WILL: 6, LUCK: 7, MOVE: 6, BODY: 6, EMP: 6 },
      { INT: 7, REF: 6, DEX: 6, TECH: 8, COOL: 5, WILL: 7, LUCK: 6, MOVE: 5, BODY: 6, EMP: 6 }
    ],
    templateCombatSkills: {
      shoulderArms: 6,
      handgun: 5,
      evasion: 5,
      athletics: 4,
      cybertech: 6,
      firstAid: 4,
      perception: 5,
      concentration: 4,
      resistTortureDrugs: 3
    },
    templateGeneralSkills: {
      'Electronics/Security Tech': 6,
      'Weaponstech': 6,
      'Drive Land Vehicle': 3,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Shotgun', 'Heavy Pistol'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor'],
      gearNames: ['Techtool', 'Agent', 'Duct Tape', 'Flashlight'],
      fashionSummary: 'Mono de trabajo resistente a chispas y ácido, guantes aislantes y cinturón portaherramientas.',
      itemsBreakdown: [
        'Escopeta estándar (5d6 / área 6x6m con postas)',
        'Pistola pesada (3d6)',
        'Maletín de herramientas Techtool',
        'Blindaje Light Armorjack (SP 11 Cabeza y Cuerpo)'
      ]
    }
  },
  {
    id: 'medtech',
    name: 'Medtech',
    spanishSubtitle: 'Médico de combate, cirujano clandestino y químico farmacéutico',
    roleAbility: 'Medicine',
    roleAbilitySummary:
      'Subespecialidades en Cirugía, Fabricación de Fármacos/Drogas y Criogenia para salvar edgerunners moribundos.',
    beginnerTooltip:
      'El ángel de la guarda del equipo. Si quieres curar heridas críticas, revivir aliados y fabricar drogas de combate, elige Medtech.',
    whatYouGet: [
      'Habilidad Medicine a Rango 4 (permite estabilizar a Moribundos y aplicar Quick Fixes sin fallos).',
      'Bolsa Médica con inyectores Airhypo, sedantes, apósitos hemostáticos y fármacos Speedheal.',
      'Escopeta o Subfusil de contención y Pistola de servicio.',
      'Blindaje Light Armorjack completo (SP 11).',
      'Acceso a drogas estimulantes de combate para potenciar a tus aliados.'
    ],
    streetratStats: {
      INT: 8,
      REF: 6,
      DEX: 6,
      TECH: 8,
      COOL: 5,
      WILL: 7,
      LUCK: 5,
      MOVE: 5,
      BODY: 6,
      EMP: 6
    },
    edgerunnerStatTable: [
      { INT: 8, REF: 6, DEX: 6, TECH: 8, COOL: 5, WILL: 7, LUCK: 5, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 7, REF: 7, DEX: 6, TECH: 8, COOL: 5, WILL: 6, LUCK: 6, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 8, REF: 6, DEX: 7, TECH: 8, COOL: 4, WILL: 7, LUCK: 5, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 7, REF: 6, DEX: 6, TECH: 8, COOL: 6, WILL: 7, LUCK: 5, MOVE: 6, BODY: 5, EMP: 6 },
      { INT: 8, REF: 7, DEX: 5, TECH: 8, COOL: 5, WILL: 6, LUCK: 6, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 7, REF: 6, DEX: 7, TECH: 8, COOL: 5, WILL: 6, LUCK: 6, MOVE: 6, BODY: 5, EMP: 6 },
      { INT: 8, REF: 6, DEX: 6, TECH: 8, COOL: 6, WILL: 6, LUCK: 5, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 8, REF: 5, DEX: 7, TECH: 8, COOL: 4, WILL: 7, LUCK: 6, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 7, REF: 7, DEX: 6, TECH: 8, COOL: 5, WILL: 7, LUCK: 5, MOVE: 5, BODY: 6, EMP: 6 },
      { INT: 8, REF: 6, DEX: 6, TECH: 8, COOL: 5, WILL: 8, LUCK: 5, MOVE: 5, BODY: 5, EMP: 6 }
    ],
    templateCombatSkills: {
      handgun: 6,
      firstAid: 6,
      paramedic: 6,
      cybertech: 4,
      evasion: 5,
      athletics: 3,
      perception: 5,
      concentration: 5,
      resistTortureDrugs: 4
    },
    templateGeneralSkills: {
      'Basic Tech': 4,
      Deduction: 4,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Heavy Pistol', 'Shotgun'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor'],
      gearNames: ['Medtech Bag', 'Airhypo', 'Agent', 'Flashlight'],
      fashionSummary: 'Uniforme de paramédico Trauma Team modificado con cruces rojas y chaleco antibalas.',
      itemsBreakdown: [
        'Pistola pesada (3d6)',
        'Bolsa Médica (Medtech Bag)',
        'Inyector Airhypo con 2 dosis de Speedheal y 1 dosis de Stim',
        'Blindaje Light Armorjack (SP 11 Cabeza y Cuerpo)'
      ]
    }
  },
  {
    id: 'rockerboy',
    name: 'Rockerboy',
    spanishSubtitle: 'Músico rebelde, poeta callejero y líder de las masas insurreccionales',
    roleAbility: 'Charismatic Impact',
    roleAbilitySummary:
      'Fascina, conmueve e incita a multitudes a rebelarse contra las corporaciones o crear disturbios callejeros.',
    beginnerTooltip:
      'Si quieres mover masas con tus canciones, inspirar a tus compañeros y desatar revoluciones en la calle.',
    whatYouGet: [
      'Habilidad Charismatic Impact a Rango 4.',
      'Pistola Pesada o Muy Pesada cromada y Guitarra/Instrumento eléctrico con amplificador de bolsillo.',
      'Blindaje Light Armorjack estilizado (SP 11).',
      'Presupuesto de vestuario deslumbrante estilo Urban Flash.',
      'Red de fans y seguidores leales en los clubes nocturnos.'
    ],
    streetratStats: {
      INT: 6,
      REF: 7,
      DEX: 7,
      TECH: 3,
      COOL: 8,
      WILL: 7,
      LUCK: 6,
      MOVE: 6,
      BODY: 5,
      EMP: 7
    },
    edgerunnerStatTable: [
      { INT: 6, REF: 7, DEX: 7, TECH: 3, COOL: 8, WILL: 7, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 5, REF: 8, DEX: 6, TECH: 3, COOL: 8, WILL: 7, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 6, REF: 6, DEX: 8, TECH: 4, COOL: 8, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 7 },
      { INT: 7, REF: 7, DEX: 6, TECH: 3, COOL: 8, WILL: 7, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 6, REF: 7, DEX: 7, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 5, BODY: 5, EMP: 7 },
      { INT: 5, REF: 7, DEX: 7, TECH: 3, COOL: 8, WILL: 8, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 6, DEX: 7, TECH: 3, COOL: 8, WILL: 7, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 6, REF: 8, DEX: 6, TECH: 3, COOL: 8, WILL: 6, LUCK: 6, MOVE: 7, BODY: 5, EMP: 7 },
      { INT: 5, REF: 7, DEX: 8, TECH: 4, COOL: 8, WILL: 6, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 6, REF: 7, DEX: 7, TECH: 3, COOL: 8, WILL: 7, LUCK: 6, MOVE: 6, BODY: 6, EMP: 6 }
    ],
    templateCombatSkills: {
      handgun: 6,
      brawling: 5,
      meleeWeapon: 4,
      evasion: 6,
      athletics: 4,
      perception: 4,
      firstAid: 3,
      concentration: 4,
      resistTortureDrugs: 4
    },
    templateGeneralSkills: {
      Persuasion: 6,
      'Play Instrument': 6,
      Streetwise: 5,
      'Wardrobe & Style': 5,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Very Heavy Pistol', 'Light Melee Weapon'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor', 'techhair'],
      gearNames: ['Pocket Amp', 'Electric Guitar', 'Agent', 'Audio Recorder'],
      fashionSummary: 'Pantalones de cuero brillante, cadenas metálicas, parches de bandas y peinado con luces Techhair.',
      itemsBreakdown: [
        'Pistola muy pesada cromada (4d6)',
        'Cuchillo de combate estilizado (1d6)',
        'Amplificador de bolsillo y guitarra eléctrica',
        'Blindaje Light Armorjack Urban Flash (SP 11)'
      ]
    }
  },
  {
    id: 'fixer',
    name: 'Fixer',
    spanishSubtitle: 'Traficante de contactos, intermediario del Night Market y rey del contrabando',
    roleAbility: 'Operator',
    roleAbilitySummary:
      'Acceso privilegiado a Night Markets, consecución de material vetado y red de contactos corporativos y callejeros.',
    beginnerTooltip:
      'El cerebro comercial del grupo. Si quieres conseguir el mejor equipo, armas raras y contratos lucrativos.',
    whatYouGet: [
      'Habilidad Operator a Rango 4 (permite convocar y abastecer Night Markets con stock exclusivo).',
      'Pistola pesada o subfusil ocultable.',
      'Blindaje Light Armorjack con corte sastre elegante (SP 11).',
      'Doble comunicador Agent para gestionar negocios paralelos sin interrupciones.',
      'Contactos clave en las 5 principales pandillas de Night City.'
    ],
    streetratStats: {
      INT: 7,
      REF: 6,
      DEX: 6,
      TECH: 4,
      COOL: 8,
      WILL: 6,
      LUCK: 7,
      MOVE: 6,
      BODY: 5,
      EMP: 7
    },
    edgerunnerStatTable: [
      { INT: 7, REF: 6, DEX: 6, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 8, REF: 6, DEX: 6, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 7, DEX: 6, TECH: 4, COOL: 8, WILL: 5, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 6, REF: 6, DEX: 7, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 6, DEX: 6, TECH: 4, COOL: 8, WILL: 7, LUCK: 6, MOVE: 5, BODY: 6, EMP: 7 },
      { INT: 8, REF: 5, DEX: 7, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 7, DEX: 5, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 6, REF: 6, DEX: 6, TECH: 4, COOL: 8, WILL: 7, LUCK: 8, MOVE: 5, BODY: 5, EMP: 7 },
      { INT: 7, REF: 6, DEX: 7, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 8, REF: 6, DEX: 6, TECH: 4, COOL: 8, WILL: 5, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 }
    ],
    templateCombatSkills: {
      handgun: 6,
      evasion: 5,
      brawling: 4,
      athletics: 3,
      perception: 6,
      firstAid: 3,
      concentration: 4,
      resistTortureDrugs: 3
    },
    templateGeneralSkills: {
      Trading: 6,
      Streetwise: 6,
      Persuasion: 6,
      Bribery: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Heavy Pistol', 'Heavy SMG'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor', 'internal-agent'],
      gearNames: ['Agent', 'Bug Detector', 'Computer', 'Flashlight'],
      fashionSummary: 'Traje de terciopelo o chaqueta sastre de corte fino con gafas de montura dorada.',
      itemsBreakdown: [
        'Pistola pesada estándar (3d6)',
        'Subfusil pesado ocultable (3d6, Autofire x3)',
        'Detector de escuchas (Bug Detector)',
        'Blindaje Light Armorjack estilizado (SP 11)'
      ]
    }
  },
  {
    id: 'nomad',
    name: 'Nomad',
    spanishSubtitle: 'Guerrero de la carretera, mecánico del desierto y explorador de los Badlands',
    roleAbility: 'Moto',
    roleAbilitySummary:
      'Proporciona acceso y conducción experta de vehículos terrestres, aéreos o náuticos de la Familia Nómada.',
    beginnerTooltip:
      'El rey del asfalto. Si quieres tener tu propio coche, moto o convoy blindado y dominar las persecuciones.',
    whatYouGet: [
      'Habilidad Moto a Rango 4 (te otorga un vehículo propio mejorado sin coste de compra).',
      'Fusil de asalto militar o Escopeta pesada y Pistola de cinto.',
      'Blindaje Nomad Leathers / Light Armorjack (SP 11).',
      'Kit de supervivencia y herramientas para reparaciones de vehículos en ruta.',
      'El respaldo incondicional del Clan Nómada en caso de persecución corporativa.'
    ],
    streetratStats: {
      INT: 6,
      REF: 7,
      DEX: 7,
      TECH: 6,
      COOL: 6,
      WILL: 6,
      LUCK: 6,
      MOVE: 7,
      BODY: 7,
      EMP: 4
    },
    edgerunnerStatTable: [
      { INT: 6, REF: 7, DEX: 7, TECH: 6, COOL: 6, WILL: 6, LUCK: 6, MOVE: 7, BODY: 7, EMP: 4 },
      { INT: 5, REF: 8, DEX: 7, TECH: 6, COOL: 5, WILL: 6, LUCK: 6, MOVE: 7, BODY: 7, EMP: 5 },
      { INT: 6, REF: 7, DEX: 6, TECH: 7, COOL: 6, WILL: 6, LUCK: 6, MOVE: 7, BODY: 7, EMP: 4 },
      { INT: 7, REF: 7, DEX: 6, TECH: 6, COOL: 6, WILL: 6, LUCK: 5, MOVE: 8, BODY: 7, EMP: 4 },
      { INT: 6, REF: 8, DEX: 6, TECH: 6, COOL: 6, WILL: 5, LUCK: 7, MOVE: 7, BODY: 7, EMP: 4 },
      { INT: 5, REF: 7, DEX: 8, TECH: 6, COOL: 5, WILL: 6, LUCK: 6, MOVE: 7, BODY: 8, EMP: 4 },
      { INT: 6, REF: 7, DEX: 7, TECH: 7, COOL: 5, WILL: 6, LUCK: 6, MOVE: 6, BODY: 7, EMP: 5 },
      { INT: 7, REF: 8, DEX: 6, TECH: 5, COOL: 6, WILL: 6, LUCK: 6, MOVE: 7, BODY: 7, EMP: 4 },
      { INT: 6, REF: 7, DEX: 7, TECH: 6, COOL: 6, WILL: 7, LUCK: 5, MOVE: 7, BODY: 6, EMP: 5 },
      { INT: 5, REF: 8, DEX: 7, TECH: 6, COOL: 6, WILL: 6, LUCK: 6, MOVE: 7, BODY: 7, EMP: 4 }
    ],
    templateCombatSkills: {
      shoulderArms: 6,
      handgun: 5,
      evasion: 6,
      athletics: 5,
      meleeWeapon: 4,
      firstAid: 3,
      perception: 6,
      concentration: 4,
      resistTortureDrugs: 4
    },
    templateGeneralSkills: {
      'Drive Land Vehicle': 6,
      'Basic Tech': 5,
      Tracking: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Assault Rifle', 'Heavy Pistol'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['interface-plugs'],
      gearNames: ['Techtool', 'Agent', 'Flashlight', 'Radio Communicator'],
      fashionSummary: 'Chaleco de cuero desgastado con insignias del clan, botas camperas y gafas antipolvo.',
      itemsBreakdown: [
        'Fusil de asalto estándar (5d6)',
        'Pistola pesada (3d6)',
        'Vehículo Nómada otorgado por habilidad Moto',
        'Blindaje Light Armorjack (SP 11 Cabeza y Cuerpo)'
      ]
    }
  },
  {
    id: 'lawman',
    name: 'Lawman',
    spanishSubtitle: 'Agente de la ley, sheriff metropolitano y pacificador de las calles',
    roleAbility: 'Backup',
    roleAbilitySummary:
      'Llama por radio a refuerzos armados del cuerpo policial (NCPD o agentes de seguridad corporativa).',
    beginnerTooltip:
      'Si quieres disparar con placa, llamar a patrullas armadas de apoyo y encarnar la justicia en una ciudad sin ley.',
    whatYouGet: [
      'Habilidad Backup a Rango 4 (permite solicitar 2 oficiales armados en patrulla en 1d6 turnos).',
      'Escopeta reglamentaria y Pistola Pesada de servicio.',
      'Blindaje Heavy o Light Armorjack con rotulado policial (SP 11).',
      'Grilletes de alta seguridad, radio transceptora y linterna militar.',
      'Autoridad legal reconocida en distritos corporativos y céntricos.'
    ],
    streetratStats: {
      INT: 6,
      REF: 7,
      DEX: 7,
      TECH: 4,
      COOL: 6,
      WILL: 7,
      LUCK: 6,
      MOVE: 6,
      BODY: 7,
      EMP: 6
    },
    edgerunnerStatTable: [
      { INT: 6, REF: 7, DEX: 7, TECH: 4, COOL: 6, WILL: 7, LUCK: 6, MOVE: 6, BODY: 7, EMP: 6 },
      { INT: 5, REF: 8, DEX: 6, TECH: 4, COOL: 7, WILL: 7, LUCK: 6, MOVE: 6, BODY: 7, EMP: 6 },
      { INT: 7, REF: 7, DEX: 6, TECH: 3, COOL: 6, WILL: 8, LUCK: 5, MOVE: 6, BODY: 7, EMP: 6 },
      { INT: 6, REF: 7, DEX: 8, TECH: 3, COOL: 6, WILL: 7, LUCK: 6, MOVE: 6, BODY: 7, EMP: 5 },
      { INT: 6, REF: 8, DEX: 6, TECH: 4, COOL: 6, WILL: 7, LUCK: 7, MOVE: 5, BODY: 7, EMP: 6 },
      { INT: 7, REF: 7, DEX: 7, TECH: 4, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 7, EMP: 5 },
      { INT: 5, REF: 8, DEX: 7, TECH: 3, COOL: 7, WILL: 7, LUCK: 5, MOVE: 6, BODY: 8, EMP: 5 },
      { INT: 6, REF: 6, DEX: 7, TECH: 4, COOL: 7, WILL: 7, LUCK: 6, MOVE: 6, BODY: 8, EMP: 5 },
      { INT: 7, REF: 7, DEX: 6, TECH: 4, COOL: 6, WILL: 7, LUCK: 6, MOVE: 6, BODY: 7, EMP: 6 },
      { INT: 6, REF: 8, DEX: 7, TECH: 3, COOL: 6, WILL: 7, LUCK: 6, MOVE: 6, BODY: 7, EMP: 6 }
    ],
    templateCombatSkills: {
      handgun: 6,
      shoulderArms: 6,
      brawling: 5,
      evasion: 5,
      athletics: 4,
      firstAid: 3,
      perception: 6,
      concentration: 5,
      resistTortureDrugs: 4
    },
    templateGeneralSkills: {
      Interrogation: 6,
      Deduction: 5,
      Tactics: 4,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Shotgun', 'Heavy Pistol'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor'],
      gearNames: ['Handcuffs', 'Radio Communicator', 'Agent', 'Flashlight'],
      fashionSummary: 'Uniforme táctico policial azul marino, placa de metal identificativa y botas de intervención.',
      itemsBreakdown: [
        'Escopeta policial (5d6)',
        'Pistola pesada de servicio (3d6)',
        'Esposas de seguridad y radio de banda segura',
        'Blindaje Light Armorjack (SP 11 Cabeza y Cuerpo)'
      ]
    }
  },
  {
    id: 'exec',
    name: 'Exec',
    spanishSubtitle: 'Operativo corporativo, estratega de rascacielos y tiburón de negocios',
    roleAbility: 'Teamwork',
    roleAbilitySummary:
      'Controla un equipo de guardaespaldas, chóferes o investigadores corporativos pagados por la megacorporación.',
    beginnerTooltip:
      'Si prefieres mandar subordinados, vestir trajes blindados de 1,000 €$ y tener un piso franco de lujo pagado por la empresa.',
    whatYouGet: [
      'Habilidad Teamwork a Rango 4 (incluye un guardaespaldas personal o asistente ejecutivo leal).',
      'Pistola Muy Pesada de alta gama con acabados corporativos de lujo.',
      'Traje sastre blindado de ejecutivo (SP 11) sin penalizadores de movimiento.',
      'Vivienda corporativa de lujo en zona segura subvencionada por la empresa.',
      'Suscripción médica Trauma Team Silver preinstalada.'
    ],
    streetratStats: {
      INT: 7,
      REF: 6,
      DEX: 6,
      TECH: 4,
      COOL: 8,
      WILL: 6,
      LUCK: 7,
      MOVE: 5,
      BODY: 5,
      EMP: 8
    },
    edgerunnerStatTable: [
      { INT: 7, REF: 6, DEX: 6, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 5, BODY: 5, EMP: 8 },
      { INT: 8, REF: 6, DEX: 6, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 5, BODY: 5, EMP: 8 },
      { INT: 7, REF: 7, DEX: 5, TECH: 4, COOL: 8, WILL: 7, LUCK: 6, MOVE: 5, BODY: 5, EMP: 8 },
      { INT: 7, REF: 6, DEX: 6, TECH: 4, COOL: 8, WILL: 7, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 8, REF: 6, DEX: 5, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 5, BODY: 5, EMP: 8 },
      { INT: 6, REF: 7, DEX: 6, TECH: 4, COOL: 8, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 6, DEX: 7, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 5, BODY: 5, EMP: 8 },
      { INT: 8, REF: 5, DEX: 6, TECH: 4, COOL: 8, WILL: 7, LUCK: 6, MOVE: 5, BODY: 5, EMP: 8 },
      { INT: 7, REF: 7, DEX: 6, TECH: 3, COOL: 8, WILL: 6, LUCK: 7, MOVE: 5, BODY: 5, EMP: 8 },
      { INT: 8, REF: 6, DEX: 6, TECH: 4, COOL: 8, WILL: 6, LUCK: 6, MOVE: 5, BODY: 6, EMP: 7 }
    ],
    templateCombatSkills: {
      handgun: 6,
      evasion: 5,
      brawling: 3,
      athletics: 3,
      perception: 5,
      firstAid: 3,
      concentration: 5,
      resistTortureDrugs: 3
    },
    templateGeneralSkills: {
      Persuasion: 6,
      HumanPerception: 6,
      Deduction: 5,
      Education: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Very Heavy Pistol'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor', 'internal-agent'],
      gearNames: ['Agent', 'Computer', 'Trauma Team Silver Card', 'Briefcase'],
      fashionSummary: 'Traje de alta costura de negocios (Businesswear), reloj suizo de lujo y maletín ignífugo.',
      itemsBreakdown: [
        'Pistola muy pesada de lujo (4d6)',
        'Traje ejecutivo blindado Light Armorjack (SP 11)',
        'Subordinado corporativo otorgado por Teamwork',
        'Tarjeta de afiliación Trauma Team Silver'
      ]
    }
  },
  {
    id: 'media',
    name: 'Media',
    spanishSubtitle: 'Periodista de investigación, cronista de la verdad y reportero de guerra',
    roleAbility: 'Credibility',
    roleAbilitySummary:
      'Tu palabra e investigaciones tienen el peso de desenmascarar conspiraciones corporativas y cambiar la opinión pública.',
    beginnerTooltip:
      'La pluma es más fuerte que la bala. Si quieres investigar crímenes corporativos, tener fuentes secretas y filmar la verdad.',
    whatYouGet: [
      'Habilidad Credibility a Rango 4.',
      'Cámara de video digital de alta definición, grabadoras de audio ocultas y dron espía.',
      'Pistola pesada oculta para salir de tiroteos.',
      'Blindaje Light Armorjack con chaleco de prensa reforzado (SP 11).',
      'Acceso privilegiado a canales de noticias y foros del Data Pool.'
    ],
    streetratStats: {
      INT: 7,
      REF: 6,
      DEX: 6,
      TECH: 4,
      COOL: 7,
      WILL: 7,
      LUCK: 7,
      MOVE: 6,
      BODY: 5,
      EMP: 7
    },
    edgerunnerStatTable: [
      { INT: 7, REF: 6, DEX: 6, TECH: 4, COOL: 7, WILL: 7, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 8, REF: 6, DEX: 6, TECH: 3, COOL: 7, WILL: 7, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 7, DEX: 6, TECH: 4, COOL: 6, WILL: 7, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 6, DEX: 7, TECH: 4, COOL: 7, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 8, REF: 6, DEX: 5, TECH: 4, COOL: 7, WILL: 8, LUCK: 6, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 6, REF: 7, DEX: 6, TECH: 4, COOL: 8, WILL: 7, LUCK: 7, MOVE: 5, BODY: 5, EMP: 7 },
      { INT: 7, REF: 6, DEX: 6, TECH: 4, COOL: 7, WILL: 7, LUCK: 8, MOVE: 6, BODY: 5, EMP: 6 },
      { INT: 8, REF: 5, DEX: 7, TECH: 4, COOL: 6, WILL: 7, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 7, REF: 7, DEX: 6, TECH: 3, COOL: 7, WILL: 7, LUCK: 7, MOVE: 6, BODY: 5, EMP: 7 },
      { INT: 8, REF: 6, DEX: 6, TECH: 4, COOL: 7, WILL: 6, LUCK: 7, MOVE: 6, BODY: 5, EMP: 8 }
    ],
    templateCombatSkills: {
      handgun: 6,
      evasion: 5,
      athletics: 3,
      brawling: 3,
      perception: 6,
      firstAid: 3,
      concentration: 5,
      resistTortureDrugs: 3
    },
    templateGeneralSkills: {
      Deduction: 6,
      'Library Search': 6,
      Persuasion: 6,
      Streetwise: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Your Home)': 2
    },
    startingLoadout: {
      weaponNames: ['Heavy Pistol'],
      armorNames: ['Light Armorjack (Head)', 'Light Armorjack (Body)'],
      cyberwareIds: ['neuralware-processor', 'braindance-recorder'],
      gearNames: ['Video Camera', 'Audio Recorder', 'Agent', 'Disguise Kit'],
      fashionSummary: 'Gabardina de reportero con bolsillos ocultos, chaleco con parche de PRENSA y libreta digital.',
      itemsBreakdown: [
        'Pistola pesada (3d6)',
        'Cámara de video profesional y grabadora',
        'Blindaje Light Armorjack con parche de PRENSA (SP 11)',
        'Grabador Braindance integrado en Neural Link'
      ]
    }
  }
];

// ============================================================================
// 5. GENERAL SKILLS CATALOG (Official Core List)
// ============================================================================

export interface GeneralSkillMeta {
  key: string;
  label: string;
  stat: StatKey;
  isBasic: boolean;
  isDoubleCost?: boolean;
  combatSkillKey?: CombatSkillKey;
  tooltip: string;
}

export const GENERAL_SKILLS_CATALOG: GeneralSkillMeta[] = [
  // 13 Habilidades Básicas Obligatorias a nivel >= 2
  {
    key: 'Athletics',
    label: 'Athletics',
    stat: 'DEX',
    isBasic: true,
    combatSkillKey: 'athletics',
    tooltip: 'Correr, saltar, trepar, nadar y lanzar granadas u objetos arrojadizos a distancia.'
  },
  {
    key: 'Brawling',
    label: 'Brawling',
    stat: 'DEX',
    isBasic: true,
    combatSkillKey: 'brawling',
    tooltip: 'Lucha callejera desarmada, puñetazos, llaves de inmovilización y zafarse de agarres.'
  },
  {
    key: 'Concentration',
    label: 'Concentration',
    stat: 'WILL',
    isBasic: true,
    combatSkillKey: 'concentration',
    tooltip: 'Mantener la compostura mental bajo fuego de supresión, memorizar datos y resistir dolor.'
  },
  {
    key: 'Conversation',
    label: 'Conversation',
    stat: 'EMP',
    isBasic: true,
    tooltip: 'Extraer información casual de personas en un bar o fiesta sin parecer sospechoso.'
  },
  {
    key: 'Education',
    label: 'Education',
    stat: 'INT',
    isBasic: true,
    tooltip: 'Conocimientos generales académicos, historia corporativa, ciencia básica y cultura.'
  },
  {
    key: 'Evasion',
    label: 'Evasion',
    stat: 'DEX',
    isBasic: true,
    combatSkillKey: 'evasion',
    tooltip: 'Esquivar ataques cuerpo a cuerpo, explosiones y, con REF 8+, proyectiles balísticos.'
  },
  {
    key: 'First Aid',
    label: 'First Aid',
    stat: 'TECH',
    isBasic: true,
    combatSkillKey: 'firstAid',
    tooltip: 'Estabilizar a moribundos a 0 HP y realizar Quick Fixes rápidos a heridas críticas.'
  },
  {
    key: 'Human Perception',
    label: 'Human Perception',
    stat: 'EMP',
    isBasic: true,
    tooltip: 'Detectar mentiras, leer lenguaje corporal y medir el estado emocional de un interlocutor.'
  },
  {
    key: 'Language (Streetslang)',
    label: 'Language (Streetslang)',
    stat: 'INT',
    isBasic: true,
    tooltip: 'La jerga universal de la calle en Night City hablada por edgerunners, punks y fixers.'
  },
  {
    key: 'Local Expert (Your Home)',
    label: 'Local Expert (Your Home)',
    stat: 'INT',
    isBasic: true,
    tooltip: 'Conocimiento íntimo de tu barrio natal: callejones, bandas, policías y escondites seguros.'
  },
  {
    key: 'Perception',
    label: 'Perception',
    stat: 'INT',
    isBasic: true,
    combatSkillKey: 'perception',
    tooltip: 'Detectar emboscadas, escuchar pasos furtivos, ver en la oscuridad y notar pistas ocultas.'
  },
  {
    key: 'Persuasion',
    label: 'Persuasion',
    stat: 'COOL',
    isBasic: true,
    tooltip: 'Convencer a otros de tus planes, negociar acuerdos y defender tu postura con carisma.'
  },
  {
    key: 'Stealth',
    label: 'Stealth',
    stat: 'DEX',
    isBasic: true,
    tooltip: 'Moverse en silencio absoluto, camuflarse en las sombras y evadir guardias o cámaras.'
  },

  // Habilidades de Soporte, Técnicas y Sociales Icónicas
  {
    key: 'Bribery',
    label: 'Bribery',
    stat: 'COOL',
    isBasic: false,
    tooltip: 'Saber a quién sobornar, cuánto dinero ofrecer y cómo deslizar el fajo sin ser arrestado.'
  },
  {
    key: 'Cybertech',
    label: 'Cybertech',
    stat: 'TECH',
    isBasic: false,
    combatSkillKey: 'cybertech',
    tooltip: 'Diagnóstico, instalación, reparación y mantenimiento de prótesis y ciberware.'
  },
  {
    key: 'Deduction',
    label: 'Deduction',
    stat: 'INT',
    isBasic: false,
    tooltip: 'Conectar pistas aisladas para resolver crímenes, asesinatos y conspiraciones corporativas.'
  },
  {
    key: 'Drive Land Vehicle',
    label: 'Drive Land Vehicle',
    stat: 'REF',
    isBasic: false,
    tooltip: 'Conducir coches, motos, furgonetas blindadas y maniobras evasivas en persecuciones.'
  },
  {
    key: 'Electronics/Security Tech',
    label: 'Electronics/Security Tech',
    stat: 'TECH',
    isBasic: false,
    isDoubleCost: true,
    tooltip: 'Desactivar cerraduras electrónicas, hackear alarmas analógicas y puentear terminales de seguridad.'
  },
  {
    key: 'Interrogation',
    label: 'Interrogation',
    stat: 'COOL',
    isBasic: false,
    tooltip: 'Forzar confesiones y extraer secretos mediante presión psicológica o amenazas creíbles.'
  },
  {
    key: 'Library Search',
    label: 'Library Search',
    stat: 'INT',
    isBasic: false,
    tooltip: 'Buscar expedientes clasificados, registros criminales y noticias antiguas en el Data Pool.'
  },
  {
    key: 'Lip Reading',
    label: 'Lip Reading',
    stat: 'INT',
    isBasic: false,
    tooltip: 'Leer labios a distancia a través de prismáticos o cámaras de vigilancia sin audio.'
  },
  {
    key: 'Pick Lock',
    label: 'Pick Lock',
    stat: 'TECH',
    isBasic: false,
    tooltip: 'Forzar ganzúas en candados físicos tradicionales, cajas fuertes mecánicas y cerrojos.'
  },
  {
    key: 'Play Instrument',
    label: 'Play Instrument',
    stat: 'TECH',
    isBasic: false,
    tooltip: 'Tocar un instrumento musical (guitarra, bajo, sintetizador) a nivel profesional.'
  },
  {
    key: 'Streetwise',
    label: 'Streetwise',
    stat: 'COOL',
    isBasic: false,
    tooltip: 'Conocer las reglas no escritas del bajo mundo, jerarquías de bandas y etiquetas de los bajos fondos.'
  },
  {
    key: 'Tactics',
    label: 'Tactics',
    stat: 'INT',
    isBasic: false,
    tooltip: 'Planificar asaltos militares, reconocer zonas de emboscada y predecir movimientos de tropas enemigas.'
  },
  {
    key: 'Tracking',
    label: 'Tracking',
    stat: 'INT',
    isBasic: false,
    tooltip: 'Rastrear huellas en el desierto o manchas de aceite y sangre en los callejones.'
  },
  {
    key: 'Trading',
    label: 'Trading',
    stat: 'COOL',
    isBasic: false,
    tooltip: 'Regatear precios en el Night Market, vender botín saqueado y detectar fraudes comerciales.'
  },
  {
    key: 'Wardrobe & Style',
    label: 'Wardrobe & Style',
    stat: 'COOL',
    isBasic: false,
    tooltip: 'Saber vestirse para cada ocasión y proyectar el estilo callejero con máxima credibilidad.'
  }
];

// ============================================================================
// 6. LIFEPATH TABLES & HYBRID GENERATOR
// ============================================================================

export const LIFEPATH_TABLES = {
  culturalRegions: [
    'América del Norte (Night City / Badlands / Estados Libres)',
    'América del Sur y Central (Brasil, Colombia, Panamá)',
    'Europa Occidental (Francia, Alemania, Reino Unido)',
    'Europa del Este y SovOil (Polonia, Ucrania, Neo-Rusia)',
    'Oriente Medio y Golfo Pérsico',
    'África del Norte y África Subsahariana',
    'Sur de Asia (India, Pakistán, Sri Lanka)',
    'Sudeste Asiático (Vietnam, Tailandia, Singapur)',
    'Asia Oriental (Japón Arasaka, China, Corea)',
    'Islas del Pacífico y Oceanía (Australia, Nueva Zelanda)'
  ],
  personalities: [
    'Tímido, reservado y desconfiado con extraños',
    'Rebelde, insolente y visceral ante la autoridad',
    'Arrogante, orgulloso y seguro de ser el mejor',
    'Melancólico, callado y cargado de rencor',
    'Hablador rápido, persuasivo y encantador',
    'Frío como el hielo, calculador y metódico',
    'Amigable, leal y cálido con su círculo íntimo',
    'Solemne, serio y atado a un código de honor estricto',
    'Despreocupado, cínico y viviendo al día',
    'Impulsivo, salvaje y adicto a la adrenalina'
  ],
  clothingStyles: [
    'Generic Chic (Ropa estándar cómoda y funcional)',
    'Leisurewear (Ropa deportiva de colores vivos y zapatillas)',
    'Urban Flash (Colores neón chillones, luces LED y cuero)',
    'Businesswear (Traje sastre corporativo impecable)',
    'High Fashion (Prendas de diseñador exclusivas y caras)',
    'Bohemian (Estilo vintage deshilachado, bufandas y parches)',
    'Bag Lady Chic (Capas superpuestas de ropa raída de supervivencia)',
    'Gang Colors (Colores e insignias de tu pandilla local)',
    'Nomad Leathers (Cuero reforzado desgastado por la arena y polvo)',
    'Asia Pop (Moda cibernética tokiota con estampados extravagantes)'
  ],
  hairstyles: [
    'Cresta Mohicana teñida con colores neón',
    'Rastas cibernéticas con hilos de fibra óptica',
    'Rapado al cero militar / Calvo con tatuajes en el cráneo',
    'Coleta corporativa engominada hacia atrás',
    'Melena salvaje y desgreñada al viento',
    'Teñido bicolor asimétrico con cortes laterales',
    'Pelo corto militar estricto y limpio',
    'Rastas teñidas con puntas cromadas',
    'Afro voluminoso con figuras afeitadas en las sienes',
    'Despeinado cyberpunk natural al estilo Edgerunner'
  ],
  affectations: [
    'Tatuajes biomecánicos cubriendo brazos o cuello',
    'Gafas de sol de espejo que nunca te quitas, ni de noche',
    'Cicatriz ritual de combate cruzando el rostro',
    'Lentes de contacto con pupilas de reptil o logos corporativos',
    'Chaqueta cubierta de pinchos metálicos y tachuelas',
    'Dientes frontales cromados o colmillos afilados',
    'Guantes de cuero negro que llevas en todo momento',
    'Joyería pesada de oro y titanio en orejas y nariz',
    'Fumas cigarrillos exóticos de aroma penetrante continuamente',
    'Tic nervioso sutil en los dedos de tu mano cibernética'
  ],
  valuesMost: [
    'El Dinero (€$): Es lo único que compra la libertad real en Night City',
    'El Honor: Tu palabra y reputación valen más que el cromo',
    'La Lealtad: Jamás traicionar a los tuyos, pase lo que pase',
    'La Honestidad: Decir la verdad aunque te cueste un tiroteo',
    'El Conocimiento: Saber los secretos que los poderosos ocultan',
    'La Venganza: Hacer pagar con sangre a quien te perjudicó',
    'El Amor: Encontrar a alguien por quien valga la pena morir',
    'El Poder: Tener la fuerza para que nadie vuelva a pisotearte',
    'La Diversión: Disfrutar al máximo porque mañana puedes ser cadáver',
    'La Familia: El clan o los camaradas que te cubren la espalda'
  ],
  feelingsAboutPeople: [
    'La gente es solo carne de cañón; cuídate a ti mismo primero',
    'Todo el mundo tiene un precio; solo debes averiguar cuál es',
    'Las personas son instrumentos útiles para alcanzar tus metas',
    'La mayoría son ovejas esperando ser devoradas por las corporaciones',
    'Desconfía de todos hasta que hayan sangrado contigo en un tiroteo',
    'Hay bondad oculta en la calle si sabes buscar bien',
    'Nadie te debe nada y tú no le debes nada a nadie',
    'Las personas son interesantes, pero peligrosas de cerca',
    'La amistad verdadera es el único ciberware que no se descalibra',
    'Solo confías en aquellos que comparten tu código personal'
  ],
  valuedPersons: [
    'Un progenitor que dio la vida por ti en la guerra',
    'Un hermano o hermana que aún vive en peligro en la ciudad',
    'Tu primer amor trágico al que nunca pudiste olvidar',
    'Un mentor callejero veterano que te enseñó a disparar y sobrevivir',
    'Tú mismo: nadie te salvará si tú no te salvas primero',
    'Tu mejor amigo de la infancia que ahora milita en una banda rival',
    'Una figura legendaria de Night City a la que aspiras superar',
    'Un niño huérfano al que juraste proteger en secreto',
    'Tu fiel compañero de armas con el que hiciste tu primer gig',
    'Nadie: los lazos son puntos débiles que las corps pueden explotar'
  ],
  valuedPossessions: [
    'Un arma personalizada heredada con muescas en la empuñadura',
    'Un instrumento musical o herramienta con la que te ganas la vida',
    'Un trozo de ciberware antiguo que perteneció a un ser querido',
    'Una fotografía física en papel real de tus padres sonriendo',
    'Un libro de papel real, una reliquia casi extinta del siglo XX',
    'Tu vehículo o moto tuneada con tus propias manos',
    'Un chip de datos encriptado cuyo contenido aún no has podido descifrar',
    'Un amuleto de la suerte que desvió una bala en tu primer tiroteo',
    'Tu chaqueta favorita manchada de pólvora y sangre seca',
    'Un reloj analógico suizo de tu abuelo que aún marca la hora'
  ],
  familyBackgrounds: [
    'Corporativo de élite: Creciste en una torre lujosa hasta que tus padres cayeron en desgracia',
    'Familia Nómada: Creciste en un convoy en las carreteras polvorientas de los Badlands',
    'Rata de callejón: Huérfano criado por bandas en la Zona de Combate de Santo Domingo',
    'Familia de clase trabajadora: Padres obreros en una fábrica química automatizada',
    'Dinastía criminal: Parientes en el contrabando del puerto y el juego clandestino',
    'Exiliados de ultramar: Llegaron a Night City huyendo de una guerra biológica',
    'Familia de Fixers: Creciste entre el regateo constante de los Night Markets',
    'Familia militar: Disciplina estricta y entrenamiento con armas desde los siete años',
    'Edgerunners independientes: Tus padres vivieron rápido y murieron jóvenes en un trabajo',
    'Familia rota por la Deuda: Vendidos como mano de obra esclava a una corporación'
  ],
  childhoodEnvironments: [
    'En un rascacielos blindado con seguridad privada y escuelas corporativas',
    'En el asiento trasero de un camión nómada atravesando tormentas radiactivas',
    'En las ruinas derruidas y barricadas de la Zona de Combate',
    'En un suburbio degradado de clase media con toques de queda frecuentes',
    'En los muelles portuarios entre contenedores y tráfico marítimo clandestino',
    'En el taller mecánico de un pariente oliendo a gasolina y refrigerante',
    'En un campamento de refugiados temporal que se convirtió en barriada fija',
    'Oculto en los túneles subterráneos abandonados de la antigua Night City',
    'En un apartamento minúsculo de 2x2 metros oyendo disparos en el pasillo',
    'En una comuna nómada o cooperativa callejera con educación colectiva'
  ],
  familyCrises: [
    'Tus padres fueron ejecutados por Arasaka o Militech en una purga interna',
    'La familia lo perdió todo cuando su banco corporativo quebró de la noche a la mañana',
    'Uno de tus familiares cayó en la ciberpsicosis y tuvo que ser abatido por MaxTac',
    'Tus padres fueron encarcelados por un crimen que no cometieron para encubrir a un pez gordo',
    'La casa familiar fue bombardeada durante un ajuste de cuentas entre pandillas rivales',
    'Una deuda médica impagable obligó a tu familia a dispersarse para escapar de los cobradores',
    'Tu clan nómada sufrió una emboscada de Raffen Shiv y fuiste de los pocos supervivientes',
    'Tus padres desaparecieron sin dejar rastro mientras investigaban un proyecto secreto',
    'Una enfermedad infecciosa incurable arrasó con tus seres queridos en un invierno crudo',
    'Tus padres te abandonaron a tu suerte en la calle para salvar sus propias vidas'
  ],
  friendsRelationships: [
    'Un amigo íntimo de la infancia que ahora es médico callejero y te cose gratis',
    'Un compañero Solo con el que hiciste un trabajo que salió horriblemente mal',
    'Un detective de la policía que te pasa avisos a cambio de favores discretos',
    'Un comerciante del Night Market que siempre te guarda munición difícil de conseguir',
    'Un camarero de tu club favorito que escucha todo lo que se dice en la barra',
    'Un técnico que mejora tus implantes a cambio de piezas que tú saqueas',
    'Un contrabandista que puede sacarte de Night City si las cosas se ponen feas',
    'Un periodista que publica las pruebas que tú le entregas anónimamente',
    'Un pandillero leal que te debe la vida por sacarlo de una línea de fuego',
    'Un fixer novato al que proteges y que te ofrece los mejores gigs antes que a nadie'
  ],
  tragicLoveAffairs: [
    'Tu gran amor murió en un fuego cruzado en el que tú estabas involucrado',
    'Tu pareja te vendió a una corporación rival a cambio de un puesto directivo',
    'Tu amante desapareció en el ciberespacio tras sufrir un ataque mortal de Black ICE',
    'La familia o clan de tu amante prohibió su relación y tuvieron que separarse a punta de pistola',
    'Tu pareja se convirtió en ciberpsicópata y tú tuviste que apretar el gatillo con tus manos',
    'Una corporación reclutó forzosamente a tu amor y le borró la memoria con implantes',
    'Ambos eran demasiado orgullosos y destructivos para estar juntos sin matarse',
    'Tu pareja fue arrestada y purga una condena de 20 años en una prisión de alta seguridad',
    'Tu amante pertenecía a una pandilla enemiga y la guerra callejera los separó',
    'Decidiste alejarte voluntariamente para que tus enemigos no usaran a tu amor como rehén'
  ],
  lifeGoals: [
    'Convertirme en una Leyenda viva del Afterlife antes de cumplir los treinta',
    'Vengar la muerte de mi familia y ver arder la torre corporativa responsable',
    'Ahorrar 500,000 €$ y retirarme a una isla tropical lejos del smog de Night City',
    'Descubrir la cura definitiva para la ciberpsicosis y salvar a un ser querido',
    'Liderar mi propia banda o familia nómada y gobernar mi propio territorio',
    'Comprar mi propia clínica ripperdoc clandestina y ayudar a los marginados',
    'Publicar el reportaje que derribe a la mayor megacorporación del planeta',
    'Reemplazar todo mi cuerpo por cromo de élite hasta ser inmune al dolor humano',
    'Pagar todas mis deudas de sangre y lograr que nadie conozca mi verdadero nombre',
    'Morir en una llamarada de gloria en un trabajo legendario del que se hable por décadas'
  ]
};

export const ENEMY_TABLES = {
  who: [
    'Un ex-amigo de la infancia que siente envidia corrosiva de tus éxitos',
    'Un ex-amante despechado con recursos y ansias de venganza pública',
    'Un pariente resentido que te culpa de la ruina económica familiar',
    'Un colega o socio al que delataste o dejaste tirado en un gig anterior',
    'Un líder pandillero callejero cuyo orgullo heriste frente a sus secuaces',
    'Un ejecutivo corporativo de mandos medios al que humillaste en un contrato',
    'Un detective de la ley corrupto que te tiene en su lista negra personal',
    'Un fixer peligroso al que le debes dinero o un favor no cumplido',
    'Un mercenario Solo rival que compite por los mismos contratos que tú',
    'Un completo desconocido que te culpa por la muerte de un ser querido en un fuego cruzado'
  ],
  cause: [
    'Le robaste un trabajo lucrativo o te quedaste con su parte del botín',
    'Provocaste su arresto o lo delataste a la policía para salvar tu propio pellejo',
    'Lo dejaste atrás herido para que muriera mientras tú escapabas con el botín',
    'Le quitaste la pareja o destrozaste su relación amorosa de forma pública',
    'Hiciste que lo despidieran de su empresa corporativa o lo expulsaran de su clan',
    'Mataste a su hermano, socio o camarada más cercano en un tiroteo',
    'Te negó ayuda cuando la necesitabas y tú respondiste destruyendo su negocio',
    'Una disputa ideológica o traición a los principios compartidos del grupo',
    'Una deuda monetaria acumulada con intereses abusivos que te negaste a pagar',
    'Fue una bala perdida tuya la que destrozó su vehículo o hirió a alguien inocente'
  ],
  throwAtYou: [
    'A sí mismo, armado con una escopeta y esperándote a la salida de tu apartamento',
    'A toda su pandilla callejera armada con bates, cuchillos y pistolas automáticas',
    'A un escuadrón de mercenarios Solos contratados para darte caza profesional',
    'A la policía local con cargos falsos para que te capturen legalmente',
    'A un asesino a sueldo profesional con rifle de francotirador desde las azoteas',
    'A sicarios corporativos con ciberware militar y vehículos blindados',
    'A un Netrunner que hackea tus cuentas bancarias y borra tus identificaciones legales',
    'A matones que amenazan y hostigan a tus amigos y seres queridos para acorralarte',
    'A ciberpsicópatas manipulados químicamente liberados en tu bloque de edificios',
    'Trampas explosivas colocadas en tu vehículo o en los lugares que frecuentas'
  ],
  reaction: [
    'Si se cruzan por la calle, desenfundará de inmediato y disparará a matar sin mediar palabra',
    'Está tramando una venganza fría y metódica para arruinar tu reputación antes de liquidarte',
    'Te exigirá el doble del dinero que le debes o te romperá las piernas como advertencia',
    'Te ofrecerá un trabajo suicida para saldar la deuda o de lo contrario te delatará a MaxTac',
    'Buscará herir o secuestrar a alguien importante para ti para obligarte a arrodillarte',
    'Se jacta públicamente de que eres un cobarde y ofrece una recompensa por tu cabeza',
    'Hará que te veten de todos los Night Markets y bares edgerunner de la zona',
    'Intentará destruir todo lo que construyas hasta que no te quede ni un eurodólar en el bolsillo',
    'Quiere una disculpa pública humillante en el local más concurrido del distrito',
    'No parará hasta verte mendigando en un callejón sin armas, sin cromo y sin amigos'
  ]
};

export const ROLE_LIFEPATH_QUESTIONS: Record<
  string,
  Array<{ id: string; label: string; options: string[] }>
> = {
  solo: [
    {
      id: 'solo_type',
      label: '¿Qué tipo de Solo eres en la calle?',
      options: [
        'Guardaespaldas profesional que no se separa de su cliente',
        'Asesino callejero que cobra por cabeza y no hace preguntas',
        'Soldado veterano de guerra corporativa que solo conoce el combate',
        'Mercenario táctico de asalto especializado en armas pesadas',
        'Espadachín de honor con katana que desprecia a los pistoleros cobardes',
        'Justiciero violento que limpia los callejones de abusadores'
      ]
    },
    {
      id: 'solo_moral',
      label: '¿Cuál es tu código ético en un contrato?',
      options: [
        'Si acepto el dinero, cumplo el trabajo sin importar quién muera',
        'Jamás mato a inocentes, niños o personal médico de campaña',
        'El mejor postor manda: si el blanco me paga el doble, cambio de bando',
        'Mi honor militar es sagrado; prefiero morir que romper una promesa',
        'Solo mato corporativos y gánsteres corruptos; la calle es sagrada',
        'Sin reglas: en un tiroteo sobrevive el más rápido y cruel'
      ]
    },
    {
      id: 'solo_territory',
      label: '¿Dónde prefieres operar?',
      options: [
        'En los callejones oscuros de la Zona de Combate',
        'En los pisos altos y recepciones blindadas de la Zona Corporativa',
        'En las carreteras abiertas y refinerías de los Badlands',
        'En almacenes portuarios y muelles de contrabando',
        'En tejados y azoteas como francotirador solitario',
        'En el cuadrilátero clandestino de peleas a puño limpio'
      ]
    }
  ],
  netrunner: [
    {
      id: 'net_workspace',
      label: '¿Dónde prefieres montar tu espacio de Netrunning?',
      options: [
        'En una furgoneta blindada con antenas camufladas en constante movimiento',
        'En una bañera llena de hielo en un apartamento cochambroso',
        'En una suite corporativa con aire acondicionado y refrigeración de grado militar',
        'En un cubículo clandestino en el sótano de un club de música electrónica',
        'En un cyberdeck portátil corriendo por los pasillos a 5 metros de los servidores',
        'En una tienda nómada en el desierto con generadores solares'
      ]
    },
    {
      id: 'net_specialty',
      label: '¿Cuál es tu firma o estilo en la Red?',
      options: [
        'Dejar un logo holográfico burlón en cada nodo hackeado',
        'Infiltración fantasma: nadie sabe que estuve allí ni faltan datos visibles',
        'Fuerza bruta: destruir el Black ICE a base de programas ofensivos y prender fuego al servidor',
        'Robo de secretos: extraer nóminas corporativas y venderlas a la competencia',
        'Control ambiental: apagar luces, cerrar puertas y reprogramar torretas para que maten a los guardias',
        'Infección de virus durmientes que despiertan meses después'
      ]
    },
    {
      id: 'net_partner',
      label: '¿Quién es tu contacto o soporte habitual?',
      options: [
        'Un Solo de confianza que vigila mi cuerpo mientras navego en la Red',
        'Una IA rebelde que habita en los bordes de la Vieja Red',
        'Un Fixer que subasta mis datos robados al mejor postor',
        'Un colega Netrunner con el que hago hackeo simultáneo a dos bandas',
        'Trabajo completamente solo; no confío en nadie cuando estoy jackeado',
        'Un técnico que me construye cyberdecks con procesadores militares robados'
      ]
    }
  ],
  tech: [
    {
      id: 'tech_type',
      label: '¿Cuál es tu especialidad técnica principal?',
      options: [
        'Armero: modificar fusiles y katanas para que causen daño devastador',
        'Cibernético: calibrar implantes y diseñar prótesis personalizadas',
        'Mecánico de bólidos: tunear motores de coches y motos para carreras mortales',
        'Ingeniero de demoliciones: crear bombas caseras y trampas explosivas',
        'Técnico de seguridad: reventar cerraduras electrónicas y alarmas',
        'Chatarrero genial: fabricar tecnología funcional con basura de vertedero'
      ]
    },
    {
      id: 'tech_philosophy',
      label: '¿Cuál es tu filosofía de trabajo?',
      options: [
        'Si no está roto, mejóralo hasta que sea peligroso',
        'Las armas de fábrica son basura; solo el trabajo artesanal es confiable',
        'El cromo es superior a la carne débil y corruptible',
        'Cobro por hora y por pieza; el dinero por delante o no toco una llave',
        'Construyo para la gente común que no puede pagar precios corporativos',
        'La elegancia mecánica es una obra de arte tan bella como un concierto'
      ]
    },
    {
      id: 'tech_dream',
      label: '¿Cuál es tu proyecto soñado?',
      options: [
        'Construir un Linear Frame acorazado indestructible',
        'Fabricar un arma exótica legendaria con nombre propio',
        'Restaurar un coche deportivo clásico de antes de la guerra',
        'Diseñar un sistema de energía autosuficiente para todo un vecindario',
        'Crear una prótesis cibernética indistinguible del tejido vivo',
        'Diseñar un dron de combate con IA táctica leal'
      ]
    }
  ]
};

// ============================================================================
// 7. SELLING OUT / IN DEBT OPTIONAL RULE (Core Rulebook p. 118)
// ============================================================================

export interface SellingOutOption {
  id: string;
  level: 'none' | 'minor' | 'major' | 'custom';
  extraCash: number;
  label: string;
  description: string;
  creditorTypes: Array<{
    type: 'corp' | 'law' | 'gang' | 'custom';
    suggestedName: string;
    terms: string;
    perk: string;
    risk: string;
  }>;
}

export const SELLING_OUT_CATALOG: SellingOutOption[] = [
  {
    id: 'debt_none',
    level: 'none',
    extraCash: 0,
    label: 'Sin Deudas (Hombre Libre)',
    description: 'Empiezas con los 2,550 €$ reglamentarios. No le debes un céntimo ni un favor a nadie.',
    creditorTypes: []
  },
  {
    id: 'debt_minor',
    level: 'minor',
    extraCash: 1500,
    label: 'Deuda Menor (+1,500 €$)',
    description:
      'Consigues 1,500 €$ adicionales para equipo de élite o cibernética avanzada desde el día 1, pero tienes un acreedor peligroso en tu espalda.',
    creditorTypes: [
      {
        type: 'gang',
        suggestedName: 'Tyger Claws / Maelstrom Loan Shark',
        terms: 'Interés del 20% mensual y disponibilidad obligatoria para 1 gig sucio cuando te llamen.',
        perk: 'Acceso inmediato a armas callejeras prohibidas y drogas.',
        risk: 'Si te retrasas en un pago, mandan sicarios a partirte las piernas.'
      },
      {
        type: 'corp',
        suggestedName: 'Arasaka / Militech Credit Division',
        terms: 'Deuda formal registrada con chip de rastreo subdérmico de localización.',
        perk: 'Historial crediticio corporativo y acceso a suministros médicos de grado militar.',
        risk: 'Si te saltas un pago, Trauma Team revoca tus servicios y la corp emite orden de captura.'
      },
      {
        type: 'law',
        suggestedName: 'Capitán Corrupto del NCPD',
        terms: 'Te prestó el dinero confiscado de una redada; debes ser su informante callejero.',
        perk: 'Avisos previos de redadas policiales en tu distrito.',
        risk: 'Si la policía de asuntos internos lo investiga, te sacrificará como cabeza de turco.'
      }
    ]
  },
  {
    id: 'debt_major',
    level: 'major',
    extraCash: 3000,
    label: 'Vender el Alma / Deuda Mayor (+3,000 €$)',
    description:
      'Empiezas cargado de cromo de grado militar o con un arsenal impresionante, pero tu vida ya no te pertenece.',
    creditorTypes: [
      {
        type: 'corp',
        suggestedName: 'Megacorporación (Arasaka / Biotechnica / Kang Tao)',
        terms:
          'Firmaste un contrato de servidumbre: les debes 3,000 €$ más intereses y pueden obligarte a realizar misiones de asesinato encubiertas en cualquier momento.',
        perk: 'Instalación gratuita de implantes exóticos y armas militares en clínicas privadas.',
        risk: 'Tienen un interruptor de desactivación o bomba remota en tu ciberware si te rebelas.'
      },
      {
        type: 'gang',
        suggestedName: 'Padrino del Crimen Organizado / Cartel',
        terms: 'Te financiaron el cromo para que seas su ejecutor principal en la guerra territorial.',
        perk: 'Respaldo armado de pandilleros armados si te acorralan.',
        risk: 'Eres el blanco prioritario de todas las bandas rivales de Night City.'
      }
    ]
  }
];

// ============================================================================
// 8. PREGEN TEMPLATES (CEMK 2077 + 2045 Single-Shot Pack + Rivals)
// ============================================================================

export interface PregenTemplate {
  id: string;
  handle: string;
  role: string;
  roleRank: number;
  era: CharacterEra;
  avatarIcon: string;
  sourceBadge: string;
  bioSummary: string;
  whatYouGet: string[];
  stats: Record<StatKey, number>;
  skills: Record<CombatSkillKey, number>;
  generalSkills: Record<string, number>;
  weapons: EquippedWeapon[];
  headArmor: { name: string; maxSp: number; currentSp: number; penalty: number };
  bodyArmor: { name: string; maxSp: number; currentSp: number; penalty: number };
  cyberwareIds: string[];
  eurodollars: number;
  lifepath: CharacterLifepath;
}

export const PREGEN_TEMPLATES: PregenTemplate[] = [
  // --- CEMK 2077 EDGERUNNERS ---
  {
    id: 'pregen-david-2077',
    handle: 'David Martinez',
    role: 'Solo',
    roleRank: 4,
    era: '2077',
    avatarIcon: 'zap',
    sourceBadge: 'CEMK 2077',
    bioSummary:
      'El chico de Santo Domingo que desafió a las megacorporaciones. Equipado con la legendaria chaqueta de paramédico de su madre y un Sandevistan militar Militech de velocidad sobrenatural.',
    whatYouGet: [
      'Implante militar Militech Sandevistan Speedware (+3 a Iniciativa y esquiva acelerada).',
      'Neuroport 2077 integrado de serie con Holocall, HUD y ranuras de chipware.',
      'REF 8 y DEX 8 de inicio: Capacidad canónica de esquivar balas en pleno vuelo.',
      'Pistola Tech/Power y Escopeta de combate.',
      'Blindaje Light Armorjack con la chaqueta amarilla icónica (Cabeza SP 11, Cuerpo SP 11).'
    ],
    stats: {
      INT: 5,
      REF: 8,
      DEX: 8,
      TECH: 4,
      COOL: 7,
      WILL: 8,
      LUCK: 7,
      MOVE: 7,
      BODY: 8,
      EMP: 6
    },
    skills: {
      handgun: 6,
      shoulderArms: 5,
      autofire: 4,
      heavyWeapons: 2,
      archery: 0,
      meleeWeapon: 5,
      brawling: 6,
      martialArts: 2,
      evasion: 8,
      athletics: 6,
      firstAid: 3,
      paramedic: 1,
      cybertech: 3,
      perception: 6,
      concentration: 5,
      resistTortureDrugs: 5
    },
    generalSkills: {
      Stealth: 4,
      Streetwise: 5,
      'Drive Land Vehicle': 4,
      'Language (Streetslang)': 2,
      'Local Expert (Santo Domingo)': 4
    },
    weapons: [
      {
        id: 'heavy-pistol',
        instanceId: 'wep-david-hp',
        name: 'Militech Lexington (Heavy Pistol)',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '3d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 100,
        standardMag: 12,
        currentMag: 12,
        ammoType: 'Heavy Pistol',
        loadedAmmoType: 'Heavy Pistol',
        inHand: true,
        reserveAmmo: 48
      },
      {
        id: 'shotgun',
        instanceId: 'wep-david-sg',
        name: 'Budget Arms Carnage (Shotgun)',
        type: 'Ranged',
        skill: 'Shoulder Arms',
        damage: '5d6',
        rof: 1,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 8,
        currentMag: 8,
        ammoType: 'Slug',
        loadedAmmoType: 'Slug',
        inHand: false,
        reserveAmmo: 24
      }
    ],
    headArmor: { name: 'Kevlar Hood / Cap (Head)', maxSp: 7, currentSp: 7, penalty: 0 },
    bodyArmor: { name: "Gloria's EMT Jacket (Light Armorjack)", maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['sandevistan', 'neuralware-processor', 'interface-plugs'],
    eurodollars: 450,
    lifepath: {
      culturalRegion: 'América del Norte (Night City - Santo Domingo)',
      personality: 'Impulsivo, salvaje y adicto a la adrenalina',
      clothingStyle: 'Urban Flash (Chaqueta amarilla EMT, pantalones anchos y zapatillas deportivas)',
      hairstyle: 'Cresta cyberpunk rapada en los laterales',
      affectation: 'Tic nervioso en la mano cuando recuerda el dolor de su madre',
      valueMost: 'La Familia y la Lealtad a su tripulación',
      feelAboutPeople: 'Desconfía de las corporaciones; daría la vida por sus amigos',
      valuedPerson: 'Lucy y su madre Gloria Martinez',
      valuedPossession: 'La chaqueta amarilla de paramédico de su madre',
      familyBackground: 'Familia de clase trabajadora rota por las deudas médicas',
      childhoodEnvironment: 'En un apartamento de 2x2 en Arroyo oyendo sirenas policiales',
      familyCrisis: 'Su madre murió tras un tiroteo en la autopista por falta de Trauma Team',
      friends: ['Maine (Líder mentor)', 'Rebecca (Pistolera leal)', 'Falco (Piloto de fuga)'],
      tragicLoveAffairs: ['Su amor por Lucy marcado por el peligro constante de Arasaka'],
      enemies: [
        {
          id: 'en-david-1',
          who: 'Faraday (Fixer traidor con implantes oculares triples)',
          cause: 'Conspiró para entregar la tecnología del Sandevistan a Arasaka',
          throwAtYou: 'Mercenarios Solos armados con fusiles de asalto',
          reaction: 'Si se cruzan, disparar a quemarropa sin dudar'
        }
      ],
      roleLifepath: {
        solo_type: 'Líder callejero impulsado por el cromo y la lealtad',
        solo_moral: 'Proteger a su tripulación a cualquier coste humano'
      },
      lifeGoal: 'Llevar a Lucy a la Luna y no dejar a nadie atrás'
    }
  },
  {
    id: 'pregen-lucy-2077',
    handle: 'Lucy (Kushinada)',
    role: 'Netrunner',
    roleRank: 4,
    era: '2077',
    avatarIcon: 'wifi',
    sourceBadge: 'CEMK 2077',
    bioSummary:
      'Netrunner misteriosa y letal de la Vieja Red. Entrenada de niña en instalaciones secretas de Arasaka, huyó para vivir como fantasma en Night City. Especialista en hackeo profundo y combate con cable Monowire.',
    whatYouGet: [
      'Cyberdeck militar 2077 para Quickhacking (sin RAM, CEMK p. 16).',
      'Ciberarma Monowire integrada en el antebrazo (ataques a 2m que ignoran mitad de blindaje).',
      'INT 8 y REF 8: Dominio total tanto en el ciberespacio como en el esquive acrobático.',
      'Neuroport 2077 de serie con interfaz de Virtuality y cables Interface Plugs.',
      'Programas de contra-hackeo y escudo defensivo de red.'
    ],
    stats: {
      INT: 8,
      REF: 8,
      DEX: 7,
      TECH: 6,
      COOL: 7,
      WILL: 7,
      LUCK: 6,
      MOVE: 6,
      BODY: 4,
      EMP: 6
    },
    skills: {
      handgun: 6,
      shoulderArms: 2,
      autofire: 2,
      heavyWeapons: 0,
      archery: 0,
      meleeWeapon: 7,
      brawling: 4,
      martialArts: 2,
      evasion: 7,
      athletics: 5,
      firstAid: 3,
      paramedic: 2,
      cybertech: 6,
      perception: 7,
      concentration: 6,
      resistTortureDrugs: 4
    },
    generalSkills: {
      'Electronics/Security Tech': 7,
      Stealth: 6,
      'Library Search': 6,
      'Language (Streetslang)': 2,
      'Language (Japanese)': 4
    },
    weapons: [
      {
        id: 'light-melee',
        instanceId: 'wep-lucy-monowire',
        name: 'Monowire Implant (Cyberarm)',
        type: 'Melee',
        skill: 'Melee Weapon',
        damage: '3d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 500,
        standardMag: 0,
        currentMag: 0,
        ammoType: 'N/A',
        loadedAmmoType: 'N/A',
        inHand: true,
        reserveAmmo: 0,
        notes: 'Filamento molecular retráctil. Ignora el 50% del blindaje defensor.'
      },
      {
        id: 'heavy-pistol',
        instanceId: 'wep-lucy-unity',
        name: 'Constitutional Arms Unity (Heavy Pistol)',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '3d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 100,
        standardMag: 12,
        currentMag: 12,
        ammoType: 'Heavy Pistol',
        loadedAmmoType: 'Heavy Pistol',
        inHand: false,
        reserveAmmo: 36
      }
    ],
    headArmor: { name: 'None (Head)', maxSp: 0, currentSp: 0, penalty: 0 },
    bodyArmor: { name: 'Kevlar Bodysuit (Body SP 7)', maxSp: 7, currentSp: 7, penalty: 0 },
    cyberwareIds: ['neuralware-processor', 'interface-plugs', 'chyron'],
    eurodollars: 1200,
    lifepath: {
      culturalRegion: 'Asia Oriental (Instalación secreta Arasaka)',
      personality: 'Fría como el hielo, calculadora y reservada',
      clothingStyle: 'High Fashion / Urban Chic (Mono blanco ceñido y chaqueta corta reflectante)',
      hairstyle: 'Corte asimétrico con mechas arcoíris pastel',
      affectation: 'Fuma cigarrillos delgados mientras contempla el cielo nocturno',
      valueMost: 'La Libertad absoluta y no volver a ser una esclava corporativa',
      feelAboutPeople: 'La mayoría son marionetas de Arasaka; solo confía en David',
      valuedPerson: 'David Martinez',
      valuedPossession: 'Su suite de Virtuality con simulaciones de la superficie lunar',
      familyBackground: 'Niña huérfana secuestrada por Arasaka para bucear en la Vieja Red',
      childhoodEnvironment: 'Laboratorio subterráneo frío conectado a servidores 14 horas al día',
      familyCrisis: 'Sus compañeros niños murieron calcinados por Black ICE en el escape',
      friends: ['David Martinez', 'Kiwi (Colega Netrunner veterana)', 'Maine'],
      tragicLoveAffairs: ['Amor secreto y protector hacia David'],
      enemies: [
        {
          id: 'en-lucy-1',
          who: 'División de Contra-Inteligencia de Arasaka',
          cause: 'Huyó de sus laboratorios de inmersión profunda con secretos clasificados',
          throwAtYou: 'Netrunners de grado militar y escuadrones de asalto',
          reaction: 'Caza sin tregua para borrarle el cerebro'
        }
      ],
      roleLifepath: {
        net_workspace: 'Bañera con hielo en su apartamento con vista a las estrellas',
        net_specialty: 'Hackeo fantasma y corte letal con cable Monowire'
      },
      lifeGoal: 'Comprar un boleto de ida a la Luna y escapar de Night City para siempre'
    }
  },
  {
    id: 'pregen-rebecca-2077',
    handle: 'Rebecca',
    role: 'Solo',
    roleRank: 4,
    era: '2077',
    avatarIcon: 'target',
    sourceBadge: 'CEMK 2077',
    bioSummary:
      'Gatillera feroz, leal y de mecha corta. Amante de las armas de gran calibre y las explosiones. Cuando entra en combate, suelta una lluvia de plomo con una sonrisa salvaje.',
    whatYouGet: [
      'Brazos cibernéticos de alta resistencia pintados en verde y rosa neón.',
      'Dominio de armas a dos manos y Akimbo (dos pistolas o escopetas pesadas).',
      'REF 8 y COOL 7: Temple para aguantar tiroteos masivos a quemarropa.',
      'Blindaje Light Armorjack con ropa deportiva ligera.',
      'Arsenal devastador: Escopeta Carnage y Pistola muy pesada con munición expansiva.'
    ],
    stats: {
      INT: 5,
      REF: 8,
      DEX: 7,
      TECH: 5,
      COOL: 7,
      WILL: 7,
      LUCK: 7,
      MOVE: 6,
      BODY: 6,
      EMP: 6
    },
    skills: {
      handgun: 7,
      shoulderArms: 6,
      autofire: 5,
      heavyWeapons: 4,
      archery: 0,
      meleeWeapon: 4,
      brawling: 5,
      martialArts: 0,
      evasion: 7,
      athletics: 5,
      firstAid: 3,
      paramedic: 0,
      cybertech: 3,
      perception: 6,
      concentration: 5,
      resistTortureDrugs: 5
    },
    generalSkills: {
      Streetwise: 6,
      Stealth: 4,
      'Language (Streetslang)': 2,
      'Local Expert (Watson)': 4
    },
    weapons: [
      {
        id: 'shotgun',
        instanceId: 'wep-rebecca-carnage',
        name: 'Custom Pink Carnage (Shotgun)',
        type: 'Ranged',
        skill: 'Shoulder Arms',
        damage: '5d6',
        rof: 1,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 8,
        currentMag: 8,
        ammoType: 'Slug',
        loadedAmmoType: 'Slug',
        inHand: true,
        reserveAmmo: 32
      },
      {
        id: 'very-heavy-pistol',
        instanceId: 'wep-rebecca-vhp',
        name: 'Budget Arms Guts (Very Heavy Pistol)',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '4d6',
        rof: 1,
        hands: 1,
        concealable: false,
        cost: 100,
        standardMag: 8,
        currentMag: 8,
        ammoType: 'Very Heavy Pistol',
        loadedAmmoType: 'Very Heavy Pistol',
        inHand: true,
        reserveAmmo: 40
      }
    ],
    headArmor: { name: 'None (Head)', maxSp: 0, currentSp: 0, penalty: 0 },
    bodyArmor: { name: 'Urban Flash Bra & Shorts (Light Armorjack SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['cyberarm', 'neuralware-processor'],
    eurodollars: 600,
    lifepath: {
      culturalRegion: 'América del Norte (Night City - Watson)',
      personality: 'Impulsiva, ruidosa y ferozmente leal a sus amigos',
      clothingStyle: 'Urban Flash (Sujetador negro, chaqueta gigante turquesa y tatuajes de color rosa)',
      hairstyle: 'Dos coletas teñidas de verde menta brillante',
      affectation: 'Gesticula exageradamente con sus ciberbrazos de gran tamaño',
      valueMost: 'La Lealtad incondicional: jamás abandona a un amigo en combate',
      feelAboutPeople: 'O estás con su grupo o eres una diana con patas',
      valuedPerson: 'Su hermano Pilar y David Martinez',
      valuedPossession: 'Su colección de armas modificadas con colores chillones',
      familyBackground: 'Pandilleros huérfanos criados a los tiros en Northside',
      childhoodEnvironment: 'En talleres clandestinos y callejones de Watson',
      familyCrisis: 'Su hermano Pilar fue asesinado por un ciberpsicópata en la calle',
      friends: ['David Martinez', 'Maine', 'Dorio', 'Falco'],
      tragicLoveAffairs: ['Sentimientos no correspondidos hacia David, a quien cuida en silencio'],
      enemies: [
        {
          id: 'en-reb-1',
          who: 'Maelstrom Gang (Watson)',
          cause: 'Les reventó un cargamento de ciberware y mató a su teniente',
          throwAtYou: 'Matones cromados con implantes faciales y ametralladoras',
          reaction: 'Tiroteo a quemarropa inmediato'
        }
      ],
      roleLifepath: {
        solo_type: 'Pistolera caótica de asalto con armas de gran calibre',
        solo_moral: 'Si tocas a David o a mi tripulación, te vuelo la cabeza'
      },
      lifeGoal: 'Que la tripulación siga junta y llena de dinero'
    }
  },
  {
    id: 'pregen-maine-2077',
    handle: 'Maine',
    role: 'Solo',
    roleRank: 5,
    era: '2077',
    avatarIcon: 'shield',
    sourceBadge: 'CEMK 2077',
    bioSummary:
      'Líder veterano, ex-militar corpulento y figura paterna de la tripulación. Su cuerpo es un templo de cromo pesado con brazos Gorilla Arms y cañón de proyectiles integrado.',
    whatYouGet: [
      'Gorilla Arms cibernéticos con potencia de demolición (BODY 10 en fuerza de golpe).',
      'Lanzagranadas o lanzaproyectiles integrado en Cyberarm (Popup Projectile Launcher).',
      'Fusil de asalto militar y resistencia física titánica (BODY 10 / HP 55).',
      'Blindaje Heavy Armorjack completo (SP 13).',
      'Mecánicas de advertencia de Estrés y Ciberpsicosis por sobrecarga de cromo.'
    ],
    stats: {
      INT: 6,
      REF: 8,
      DEX: 7,
      TECH: 5,
      COOL: 7,
      WILL: 7,
      LUCK: 5,
      MOVE: 6,
      BODY: 10,
      EMP: 4
    },
    skills: {
      handgun: 6,
      shoulderArms: 7,
      autofire: 6,
      heavyWeapons: 6,
      archery: 0,
      meleeWeapon: 5,
      brawling: 7,
      martialArts: 4,
      evasion: 6,
      athletics: 6,
      firstAid: 3,
      paramedic: 0,
      cybertech: 4,
      perception: 6,
      concentration: 5,
      resistTortureDrugs: 6
    },
    generalSkills: {
      Tactics: 6,
      Leadership: 6,
      Streetwise: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Santo Domingo)': 4
    },
    weapons: [
      {
        id: 'assault-rifle',
        instanceId: 'wep-maine-ar',
        name: 'Militech M251s Ajax (Assault Rifle)',
        type: 'Ranged',
        skill: 'Shoulder Arms',
        damage: '5d6',
        rof: 1,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 30,
        currentMag: 30,
        ammoType: 'Rifle',
        loadedAmmoType: 'Rifle',
        altFireModes: 'Autofire (4)',
        autofireMaxMult: 4,
        inHand: true,
        reserveAmmo: 60
      },
      {
        id: 'heavy-melee',
        instanceId: 'wep-maine-gorilla',
        name: 'Gorilla Arms (Cyberarms)',
        type: 'Melee',
        skill: 'Brawling',
        damage: '3d6',
        rof: 2,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 0,
        currentMag: 0,
        ammoType: 'N/A',
        loadedAmmoType: 'N/A',
        inHand: false,
        reserveAmmo: 0,
        notes: 'Brazos mecánicos de demolición industrial.'
      }
    ],
    headArmor: { name: 'Subdermal Plating (Head SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    bodyArmor: { name: 'Heavy Armorjack Tactical Vest (Body SP 13)', maxSp: 13, currentSp: 13, penalty: -2 },
    cyberwareIds: ['cyberarm', 'subdermal-armor', 'neuralware-processor'],
    eurodollars: 1500,
    lifepath: {
      culturalRegion: 'América del Norte (Veterano de guerra corporativa)',
      personality: 'Solemne, paternal y orgulloso de su fuerza',
      clothingStyle: 'Nomad Leathers / Military Wear (Chaleco táctico pesado sin mangas)',
      hairstyle: 'Calvo con barba corta cuidada',
      affectation: 'Crujido metálico constante de sus hombros hidráulicos',
      valueMost: 'El Honor y la reputación de su equipo en el Afterlife',
      feelAboutPeople: 'Protector nato con los suyos; despiadado con quien los amenace',
      valuedPerson: 'Dorio (Su pareja y mano derecha) y David (Su protegido)',
      valuedPossession: 'Sus brazos de cromo pesado y su reloj de combate',
      familyBackground: 'Militar de carrera desmovilizado tras la guerra',
      childhoodEnvironment: 'En barracones militares de la Guardia Nacional',
      familyCrisis: 'Sus compañeros de pelotón murieron en una emboscada no oficial',
      friends: ['Dorio', 'David Martinez', 'Kiwi', 'Pilar', 'Falco'],
      tragicLoveAffairs: ['Amor profundo con Dorio, unidos en el combate y la gloria'],
      enemies: [
        {
          id: 'en-maine-1',
          who: 'Fixers traidores de Heywood',
          cause: 'Disputa por el pago de un prototipo militar',
          throwAtYou: 'Sicarios Solos con ametralladoras pesadas',
          reaction: 'Aplastarlos con sus propias manos'
        }
      ],
      roleLifepath: {
        solo_type: 'Comandante de escuadrón de asalto pesado',
        solo_moral: 'La tripulación siempre come primero'
      },
      lifeGoal: 'Llevar a la tripulación a la cima de Night City antes de que el cromo lo consuma'
    }
  },
  {
    id: 'pregen-kiwi-2077',
    handle: 'Kiwi',
    role: 'Netrunner',
    roleRank: 4,
    era: '2077',
    avatarIcon: 'cpu',
    sourceBadge: 'CEMK 2077',
    bioSummary:
      'Netrunner veterana, cínica y calculadora. Lleva una máscara de respiración cibernética que cubre la mitad de su rostro. Mentora de Lucy con una regla de oro: "Nunca confíes en nadie en Night City".',
    whatYouGet: [
      'Cyberdeck militar Arasaka con potentes programas ofensivos y defensivos.',
      'Máscara de filtración cibernética y procesador neural avanzado.',
      'Subfusil pesado y Pistola de apoyo.',
      'INT 8 y TECH 7: Hacker maestra de arquitecturas corporativas complejas.',
      'Blindaje Light Armorjack encubierto (SP 11).'
    ],
    stats: {
      INT: 8,
      REF: 7,
      DEX: 6,
      TECH: 7,
      COOL: 6,
      WILL: 7,
      LUCK: 6,
      MOVE: 5,
      BODY: 5,
      EMP: 5
    },
    skills: {
      handgun: 6,
      shoulderArms: 2,
      autofire: 4,
      heavyWeapons: 0,
      archery: 0,
      meleeWeapon: 2,
      brawling: 3,
      martialArts: 0,
      evasion: 5,
      athletics: 3,
      firstAid: 3,
      paramedic: 2,
      cybertech: 6,
      perception: 6,
      concentration: 6,
      resistTortureDrugs: 4
    },
    generalSkills: {
      'Electronics/Security Tech': 7,
      'Library Search': 6,
      Stealth: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Santo Domingo)': 3
    },
    weapons: [
      {
        id: 'heavy-smg',
        instanceId: 'wep-kiwi-smg',
        name: 'Saratoga Heavy SMG',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '3d6',
        rof: 1,
        hands: 1,
        concealable: false,
        cost: 100,
        standardMag: 30,
        currentMag: 30,
        ammoType: 'Heavy Pistol',
        loadedAmmoType: 'Heavy Pistol',
        altFireModes: 'Autofire (3)',
        autofireMaxMult: 3,
        inHand: true,
        reserveAmmo: 60
      }
    ],
    headArmor: { name: 'Cybernetic Respirator Mask (Head SP 7)', maxSp: 7, currentSp: 7, penalty: 0 },
    bodyArmor: { name: 'Trench Coat with Light Armorjack (Body SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['neuralware-processor', 'interface-plugs', 'nasal-filters'],
    eurodollars: 1800,
    lifepath: {
      culturalRegion: 'Europa Occidental / Night City',
      personality: 'Cínica, silenciosa y extremadamente desconfiada',
      clothingStyle: 'Bag Lady Chic / Minimalist (Gabardina roja holgada y zapatillas gastadas)',
      hairstyle: 'Corte bob rubio platino angular',
      affectation: 'Máscara metálica de respiración que distorsiona ligeramente su voz',
      valueMost: 'La Supervivencia personal por encima de cualquier lealtad ciega',
      feelAboutPeople: 'Cualquiera te apuñalará si el precio es suficientemente alto',
      valuedPerson: 'Ella misma (y en el fondo, un afecto reprimido por Lucy)',
      valuedPossession: 'Su Cyberdeck militar con algoritmos de evasión de rastro',
      familyBackground: 'Huérfana callejera que aprendió a hackear en terminales rotas',
      childhoodEnvironment: 'En los distritos industriales en ruinas de Santo Domingo',
      familyCrisis: 'Traicionada en su juventud por su primer equipo de Netrunning',
      friends: ['Lucy (Su alumna más talentosa)', 'Maine', 'Dorio'],
      tragicLoveAffairs: ['Una relación pasada que terminó en traición corporativa'],
      enemies: [
        {
          id: 'en-kiwi-1',
          who: 'NetWatch (División de Seguridad de Red)',
          cause: 'Buceó en nodos clasificados con código ilegal',
          throwAtYou: 'Agentes de campo NetWatch con inhibidores EMP',
          reaction: 'Caza para confiscar su deck y enviarla a prisión'
        }
      ],
      roleLifepath: {
        net_workspace: 'Habitación acolchada en penumbra con humo de cigarrillo',
        net_specialty: 'Desactivación de Black ICE y robo de datos limpios'
      },
      lifeGoal: 'Asegurar su retiro en una cuenta cifrada antes de que Night City la mate'
    }
  },
  {
    id: 'pregen-falco-2077',
    handle: 'Falco',
    role: 'Nomad',
    roleRank: 4,
    era: '2077',
    avatarIcon: 'truck',
    sourceBadge: 'CEMK 2077',
    bioSummary:
      'El chófer de fuga con más estilo de Night City. Nómada de origen con reflejos de piloto de carreras, mostacho icónico y puntería letal desde la ventanilla del vehículo.',
    whatYouGet: [
      'Vehículo de fuga Nómada tuneado con blindaje reforzado y alerones de persecución.',
      'Interface Plugs para conexión mental directa con el volante y sistemas del coche.',
      'Fusil de precisión o Escopeta para disparar a toda velocidad.',
      'MOVE 7 y REF 8: Dominio absoluto en persecuciones a alta velocidad.',
      'Blindaje Light Armorjack con chaqueta de aviador.'
    ],
    stats: {
      INT: 6,
      REF: 8,
      DEX: 7,
      TECH: 6,
      COOL: 7,
      WILL: 6,
      LUCK: 6,
      MOVE: 7,
      BODY: 7,
      EMP: 5
    },
    skills: {
      handgun: 6,
      shoulderArms: 6,
      autofire: 4,
      heavyWeapons: 2,
      archery: 0,
      meleeWeapon: 4,
      brawling: 5,
      martialArts: 0,
      evasion: 6,
      athletics: 5,
      firstAid: 3,
      paramedic: 0,
      cybertech: 4,
      perception: 6,
      concentration: 4,
      resistTortureDrugs: 4
    },
    generalSkills: {
      'Drive Land Vehicle': 7,
      'Basic Tech': 6,
      Streetwise: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Badlands)': 4
    },
    weapons: [
      {
        id: 'heavy-pistol',
        instanceId: 'wep-falco-hp',
        name: 'Nue Heavy Pistol',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '3d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 100,
        standardMag: 8,
        currentMag: 8,
        ammoType: 'Heavy Pistol',
        loadedAmmoType: 'Heavy Pistol',
        inHand: true,
        reserveAmmo: 40
      },
      {
        id: 'sniper-rifle',
        instanceId: 'wep-falco-sr',
        name: 'Overwatch Sniper Rifle',
        type: 'Ranged',
        skill: 'Shoulder Arms',
        damage: '5d6',
        rof: 1,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 4,
        currentMag: 4,
        ammoType: 'Rifle',
        loadedAmmoType: 'Rifle',
        inHand: false,
        reserveAmmo: 16
      }
    ],
    headArmor: { name: 'Aviator Cap (Head SP 7)', maxSp: 7, currentSp: 7, penalty: 0 },
    bodyArmor: { name: 'Nomad Aviator Jacket (Light Armorjack SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['interface-plugs', 'neuralware-processor'],
    eurodollars: 1100,
    lifepath: {
      culturalRegion: 'América del Norte (Nómadas de los Badlands)',
      personality: 'Tranquilo, bromista y con nervios de acero al volante',
      clothingStyle: 'Nomad Leathers (Chaqueta de aviador marrón con cuello de borreguillo)',
      hairstyle: 'Pelo castaño peinado hacia atrás con bigote espeso icónico',
      affectation: 'Gafas de sol de gota de aviador siempre puestas al volante',
      valueMost: 'La Familia y la palabra empeñada a un amigo',
      feelAboutPeople: 'Trata a todo el mundo con respeto hasta que intentan tocar su coche',
      valuedPerson: 'David Martinez y Lucy',
      valuedPossession: 'Su furgoneta modificada con doble turbo y blindaje',
      familyBackground: 'Clan Nómada Aldecaldos que opera en los alrededores de Night City',
      childhoodEnvironment: 'En campamentos itinerantes alrededor de hogueras en el desierto',
      familyCrisis: 'Dejó el clan temporalmente para ayudar a mercenarios de confianza en la ciudad',
      friends: ['David Martinez', 'Lucy', 'Rebecca', 'Maine'],
      tragicLoveAffairs: ['Una historia de carretera con una piloto que siguió su camino'],
      enemies: [
        {
          id: 'en-falco-1',
          who: 'Raffen Shiv (Nómadas exiliados bandidos)',
          cause: 'Impidió que asaltaran una caravana familiar y abatió a su jefe',
          throwAtYou: 'Camionetas armadas con ametralladoras pesadas en la autopista',
          reaction: 'Persecución mortal en el desierto'
        }
      ],
      roleLifepath: {
        nomad_vehicle: 'Furgoneta táctica de asalto con blindaje SP 15 y motor nitro',
        nomad_clan: 'Vínculos con la Nación Aldecaldos'
      },
      lifeGoal: 'Sacar a los que queden con vida de Night City cueste lo que cueste'
    }
  },
  {
    id: 'pregen-pilar-2077',
    handle: 'Pilar',
    role: 'Tech',
    roleRank: 4,
    era: '2077',
    avatarIcon: 'tool',
    sourceBadge: 'CEMK 2077',
    bioSummary:
      'Técnico excéntrico, bocazas y hermano mayor de Rebecca. Con ciberbrazos dorados hipertrofiados y una afición desmedida por las armas caseras modificadas y los chistes groseros.',
    whatYouGet: [
      'Brazos cibernéticos alargados personalizados con herramientas de precisión.',
      'Escopeta pesada modificada y pistola ligera para tiroteos repentinos.',
      'Kit completo Techtool y soldador térmico para reparaciones instantáneas.',
      'TECH 8: Capacidad de reparar y modificar armaduras de combate.',
      'Blindaje Light Armorjack con mono de trabajo reforzado.'
    ],
    stats: {
      INT: 7,
      REF: 6,
      DEX: 6,
      TECH: 8,
      COOL: 6,
      WILL: 6,
      LUCK: 6,
      MOVE: 6,
      BODY: 6,
      EMP: 5
    },
    skills: {
      handgun: 6,
      shoulderArms: 5,
      autofire: 3,
      heavyWeapons: 3,
      archery: 0,
      meleeWeapon: 4,
      brawling: 5,
      martialArts: 0,
      evasion: 5,
      athletics: 4,
      firstAid: 4,
      paramedic: 2,
      cybertech: 7,
      perception: 6,
      concentration: 4,
      resistTortureDrugs: 4
    },
    generalSkills: {
      'Electronics/Security Tech': 6,
      'Weaponstech': 7,
      Streetwise: 5,
      'Language (Streetslang)': 2,
      'Local Expert (Watson)': 3
    },
    weapons: [
      {
        id: 'shotgun',
        instanceId: 'wep-pilar-sg',
        name: 'Crusher Shotgun (Custom Tech)',
        type: 'Ranged',
        skill: 'Shoulder Arms',
        damage: '5d6',
        rof: 1,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 12,
        currentMag: 12,
        ammoType: 'Slug',
        loadedAmmoType: 'Slug',
        inHand: true,
        reserveAmmo: 24
      }
    ],
    headArmor: { name: 'None (Head)', maxSp: 0, currentSp: 0, penalty: 0 },
    bodyArmor: { name: 'Reinforced Tech Overalls (Light Armorjack SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['cyberarm', 'neuralware-processor'],
    eurodollars: 850,
    lifepath: {
      culturalRegion: 'América del Norte (Night City - Watson)',
      personality: 'Insolente, bocazas, amante de las bromas pesadas y leal',
      clothingStyle: 'Bohemian / Gang Colors (Peto vaquero de trabajo abierto y tirantes)',
      hairstyle: 'Pelo verde azulado alocado y despeinado',
      affectation: 'Brazos cibernéticos dorados brillantes anormalmente largos',
      valueMost: 'Su hermana pequeña Rebecca y el respeto callejero',
      feelAboutPeople: 'Los tipos estirados merecen que les bajen los humos de un tiro',
      valuedPerson: 'Rebecca',
      valuedPossession: 'Sus brazos mecánicos dorados tuneados por él mismo',
      familyBackground: 'Huérfanos de Northside criados entre pólvora y piezas rotas',
      childhoodEnvironment: 'En talleres de desguace de vehículos de Watson',
      familyCrisis: 'Perdieron a sus padres en un asalto de pandilleros Maelstrom',
      friends: ['Rebecca', 'Maine', 'David Martinez', 'Dorio'],
      tragicLoveAffairs: ['Ligoteos callejeros efímeros que siempre acaban en pelea de bar'],
      enemies: [
        {
          id: 'en-pilar-1',
          who: 'Pandilleros de Santo Domingo',
          cause: 'Se burló de su líder en un bar y le robó una caja de ciberware',
          throwAtYou: 'Matones con bates con púas y revólveres',
          reaction: 'Pelea callejera instantánea'
        }
      ],
      roleLifepath: {
        tech_type: 'Armero y modificador de cromo callejero',
        tech_philosophy: 'El cromo dorado luce mejor cuando dispara más rápido'
      },
      lifeGoal: 'Que a Rebecca nunca le falte nada y montar el mejor taller de Watson'
    }
  },

  // --- 2045 EDGERUNNERS (SINGLE-SHOT PACK) ---
  {
    id: 'pregen-forty-2045',
    handle: 'Forty',
    role: 'Rockerboy',
    roleRank: 4,
    era: '2045',
    avatarIcon: 'music',
    sourceBadge: '2045 CORE',
    bioSummary:
      'Frontman de la banda callejera The Dissonance. Armado con una guitarra eléctrica que también sirve de maza contundente y un carisma que prende fuego a cualquier multitud.',
    whatYouGet: [
      'Habilidad Charismatic Impact a Rango 4.',
      'Guitarra eléctrica reforzada con amplificador de bolsillo y Pistola Pesada.',
      'Blindaje Light Armorjack con estilo Urban Flash.',
      'COOL 8 y EMP 7: Dominio de la persuasión y la agitación social.',
      'Presupuesto y seguidores en los clubes nocturnos del distrito de Watson.'
    ],
    stats: {
      INT: 6,
      REF: 7,
      DEX: 7,
      TECH: 3,
      COOL: 8,
      WILL: 7,
      LUCK: 6,
      MOVE: 6,
      BODY: 5,
      EMP: 7
    },
    skills: {
      handgun: 6,
      shoulderArms: 2,
      autofire: 2,
      heavyWeapons: 0,
      archery: 0,
      meleeWeapon: 5,
      brawling: 5,
      martialArts: 0,
      evasion: 6,
      athletics: 4,
      firstAid: 3,
      paramedic: 0,
      cybertech: 2,
      perception: 5,
      concentration: 4,
      resistTortureDrugs: 4
    },
    generalSkills: {
      Persuasion: 6,
      'Play Instrument': 6,
      Streetwise: 5,
      'Wardrobe & Style': 5,
      'Language (Streetslang)': 2,
      'Local Expert (Watson)': 3
    },
    weapons: [
      {
        id: 'heavy-pistol',
        instanceId: 'wep-forty-hp',
        name: 'Dai Lung Streetmaster (Heavy Pistol)',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '3d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 100,
        standardMag: 8,
        currentMag: 8,
        ammoType: 'Heavy Pistol',
        loadedAmmoType: 'Heavy Pistol',
        inHand: true,
        reserveAmmo: 32
      },
      {
        id: 'medium-melee',
        instanceId: 'wep-forty-guitar',
        name: 'Heavy Electric Guitar (Medium Melee)',
        type: 'Melee',
        skill: 'Melee Weapon',
        damage: '2d6',
        rof: 2,
        hands: 2,
        concealable: false,
        cost: 50,
        standardMag: 0,
        currentMag: 0,
        ammoType: 'N/A',
        loadedAmmoType: 'N/A',
        inHand: false,
        reserveAmmo: 0
      }
    ],
    headArmor: { name: 'None (Head)', maxSp: 0, currentSp: 0, penalty: 0 },
    bodyArmor: { name: 'Rockstar Studded Jacket (Light Armorjack SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['neuralware-processor', 'techhair'],
    eurodollars: 500,
    lifepath: {
      culturalRegion: 'América del Norte (Night City)',
      personality: 'Rebelde, visceral y magnético',
      clothingStyle: 'Urban Flash (Cuero rojo, cadenas y luces Techhair)',
      hairstyle: 'Cresta roja brillante con puntas teñidas',
      affectation: 'Tatuaje del logo de su banda en la garganta',
      valueMost: 'La Rebelión contra el control corporativo',
      feelAboutPeople: 'Las masas necesitan una chispa para levantarse',
      valuedPerson: 'Johnny Silverhand (Su ídolo inmortal)',
      valuedPossession: 'Su guitarra eléctrica de antes de la 4ª Guerra',
      familyBackground: 'Hijo de obreros fabriles que murieron en una huelga reprimida',
      childhoodEnvironment: 'En los sótanos de ensayo de los clubes de Night City',
      familyCrisis: 'Su hermano mayor fue secuestrado por una corp para experimentos',
      friends: ['Torch (Técnico de su banda)', 'Bug (Netrunner que piratea las pantallas de sus conciertos)'],
      tragicLoveAffairs: ['Una bajista que firmó un contrato corporativo exclusivo y lo abandonó'],
      enemies: [
        {
          id: 'en-forty-1',
          who: 'Directora de Seguridad de Petrochem',
          cause: 'Provocó un motín en la puerta de su refinería con un concierto improvisado',
          throwAtYou: 'Guardias corporativos armados con porras aturdidoras y gas lacrimógeno',
          reaction: 'Arrestarlo e inhabilitarlo de por vida'
        }
      ],
      roleLifepath: {
        rocker_group: 'Líder de The Dissonance',
        rocker_message: 'Hacer que la gente despierte del letargo corporativo'
      },
      lifeGoal: 'Organizar el mayor concierto clandestino en lo alto de una torre corporativa'
    }
  },
  {
    id: 'pregen-hound-2045',
    handle: 'Hound',
    role: 'Solo',
    roleRank: 4,
    era: '2045',
    avatarIcon: 'shield',
    sourceBadge: '2045 CORE',
    bioSummary:
      'Ex-soldado mercenario con años de barro y pólvora en la espalda. Especialista en reconocimiento urbano, asalto táctico y cobertura pesada.',
    whatYouGet: [
      'Combat Awareness a Rango 4.',
      'Fusil de asalto militar y pistola pesada fiable.',
      'Blindaje Light Armorjack completo (SP 11 Cabeza y Cuerpo).',
      'REF 8 y BODY 8: Letal en puntería y muy resistente al daño.',
      'Equipo de supervivencia y primeros auxilios de campaña.'
    ],
    stats: {
      INT: 6,
      REF: 8,
      DEX: 7,
      TECH: 3,
      COOL: 7,
      WILL: 7,
      LUCK: 5,
      MOVE: 6,
      BODY: 8,
      EMP: 5
    },
    skills: {
      handgun: 6,
      shoulderArms: 6,
      autofire: 4,
      heavyWeapons: 2,
      archery: 0,
      meleeWeapon: 5,
      brawling: 4,
      martialArts: 0,
      evasion: 6,
      athletics: 4,
      firstAid: 4,
      paramedic: 0,
      cybertech: 2,
      perception: 6,
      concentration: 4,
      resistTortureDrugs: 4
    },
    generalSkills: {
      Tactics: 5,
      Stealth: 4,
      'Language (Streetslang)': 2,
      'Local Expert (Heywood)': 3
    },
    weapons: [
      {
        id: 'assault-rifle',
        instanceId: 'wep-hound-ar',
        name: 'Militech Ronin (Assault Rifle)',
        type: 'Ranged',
        skill: 'Shoulder Arms',
        damage: '5d6',
        rof: 1,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 25,
        currentMag: 25,
        ammoType: 'Rifle',
        loadedAmmoType: 'Rifle',
        altFireModes: 'Autofire (4)',
        autofireMaxMult: 4,
        inHand: true,
        reserveAmmo: 50
      },
      {
        id: 'heavy-pistol',
        instanceId: 'wep-hound-hp',
        name: 'Militech Avenger (Heavy Pistol)',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '3d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 100,
        standardMag: 8,
        currentMag: 8,
        ammoType: 'Heavy Pistol',
        loadedAmmoType: 'Heavy Pistol',
        inHand: true,
        reserveAmmo: 32
      }
    ],
    headArmor: { name: 'Kevlar Combat Helmet (Head SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    bodyArmor: { name: 'Militech Combat Vest (Light Armorjack SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['neuralware-processor', 'interface-plugs'],
    eurodollars: 750,
    lifepath: {
      culturalRegion: 'América del Norte (Heywood)',
      personality: 'Frío, disciplinado y calculador',
      clothingStyle: 'Businesswear / Tactical (Pantalones cargo militares y chaleco negro)',
      hairstyle: 'Corte militar estricto rapado a los lados',
      affectation: 'Cicatriz de bayoneta en la mandíbula',
      valueMost: 'Cumplir la misión y la lealtad militar',
      feelAboutPeople: 'La disciplina lo es todo; los aficionados mueren primero',
      valuedPerson: 'Su antiguo sargento que le salvó la vida',
      valuedPossession: 'Su placa de identificación militar de acero',
      familyBackground: 'Hijo de un sargento de la 3ª Guerra Corporativa',
      childhoodEnvironment: 'En bases militares cerradas y campos de tiro',
      familyCrisis: 'Su unidad fue sacrificada como cebo táctico por un general corrupto',
      friends: ['Torch (Tech)', 'Doc (Medtech)'],
      tragicLoveAffairs: ['Una enfermera militar que murió en un bombardeo aéreo'],
      enemies: [
        {
          id: 'en-hound-1',
          who: 'Comandante de Militech retirado',
          cause: 'Hound se negó a disparar contra civiles en una evacuación',
          throwAtYou: 'Escuadrones de cazarrecompensas',
          reaction: 'Emboscada en callejones'
        }
      ],
      roleLifepath: {
        solo_type: 'Soldado profesional de asalto',
        solo_moral: 'Cumplir la palabra dada al cliente'
      },
      lifeGoal: 'Vivir lo suficiente para comprar una granja en los Badlands'
    }
  },

  // --- RIVAL / ENEMY PREGENS (PLAYABLE) ---
  {
    id: 'pregen-arasaka-specops',
    handle: 'Arasaka Black Ops Agent',
    role: 'Solo',
    roleRank: 5,
    era: '2077',
    avatarIcon: 'eye',
    sourceBadge: 'RIVAL 2077',
    bioSummary:
      'Operativo de élite de la división de Operaciones Negras de Arasaka. Ciberware cibernético militar, sigilo letal y obediencia absoluta a la corporación.',
    whatYouGet: [
      'Subdermal Armor SP 11 permanente en Cabeza y Cuerpo.',
      'Pistola Smart Tsunami Arms con seguimiento de blanco guiado.',
      'Katana de aleación de titanio monomolecular (ignora 50% SP).',
      'REF 8, DEX 8 y COOL 8: Máquina de matar disciplinada.',
      'Soporte corporativo y recursos de infiltración militar.'
    ],
    stats: {
      INT: 7,
      REF: 8,
      DEX: 8,
      TECH: 5,
      COOL: 8,
      WILL: 8,
      LUCK: 5,
      MOVE: 7,
      BODY: 8,
      EMP: 3
    },
    skills: {
      handgun: 7,
      shoulderArms: 6,
      autofire: 5,
      heavyWeapons: 3,
      archery: 0,
      meleeWeapon: 8,
      brawling: 6,
      martialArts: 6,
      evasion: 8,
      athletics: 6,
      firstAid: 4,
      paramedic: 0,
      cybertech: 4,
      perception: 7,
      concentration: 6,
      resistTortureDrugs: 6
    },
    generalSkills: {
      Stealth: 7,
      Tactics: 6,
      'Language (Japanese)': 6,
      'Language (Streetslang)': 2
    },
    weapons: [
      {
        id: 'heavy-melee',
        instanceId: 'wep-arasaka-katana',
        name: 'Arasaka Monomolecular Katana',
        type: 'Melee',
        skill: 'Melee Weapon',
        damage: '3d6',
        rof: 2,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 0,
        currentMag: 0,
        ammoType: 'N/A',
        loadedAmmoType: 'N/A',
        inHand: true,
        reserveAmmo: 0,
        notes: 'Katana de élite con borde monomolecular. Ignora 50% de armadura.'
      },
      {
        id: 'heavy-pistol',
        instanceId: 'wep-arasaka-smart-pistol',
        name: 'Arasaka Kenshin Smart Pistol',
        type: 'Ranged',
        skill: 'Handgun',
        damage: '3d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 500,
        standardMag: 15,
        currentMag: 15,
        ammoType: 'Heavy Pistol',
        loadedAmmoType: 'Heavy Pistol',
        inHand: false,
        reserveAmmo: 45
      }
    ],
    headArmor: { name: 'Arasaka Tactical Mask (Head SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    bodyArmor: { name: 'Arasaka Monogear Bodysuit (Body SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['subdermal-armor', 'sandevistan', 'neuralware-processor', 'interface-plugs'],
    eurodollars: 3000,
    lifepath: {
      culturalRegion: 'Asia Oriental (Tokio / Arasaka Waterfront)',
      personality: 'Frío, calculador y obediente a la jerarquía corporativa',
      clothingStyle: 'Businesswear / Tactical Black (Traje militar negro mate con máscara reflectante)',
      hairstyle: 'Pelo corto negro engominado',
      affectation: 'Máscara táctica con visor rojo monocular que oculta su rostro',
      valueMost: 'El Honor y la obediencia al clan Arasaka',
      feelAboutPeople: 'Los edgerunners son cucarachas que desafían el orden natural',
      valuedPerson: 'Saburo Arasaka',
      valuedPossession: 'Su katana monomolecular forjada en Tokio',
      familyBackground: 'Dinastía militar al servicio de Arasaka por tres generaciones',
      childhoodEnvironment: 'En instalaciones corporativas militares en Japón',
      familyCrisis: 'Su familia ascendió tras eliminar a una facción traidora',
      friends: ['Compañeros operativos del escuadrón Kerez'],
      tragicLoveAffairs: ['Los lazos emocionales fueron extirpados por protocolo'],
      enemies: [
        {
          id: 'en-ara-1',
          who: 'Militech Special Forces',
          cause: 'Guerra fría corporativa constante por tecnología robada',
          throwAtYou: 'Escuadrones con lanzacohetes y blindaje Metalgear',
          reaction: 'Eliminación total sin testigos'
        }
      ],
      roleLifepath: {
        solo_type: 'Asesino de contra-inteligencia corporativo',
        solo_moral: 'La orden corporativa está por encima de la vida humana'
      },
      lifeGoal: 'Purgar a los edgerunners que amenazan los secretos de la Torre Arasaka'
    }
  },
  {
    id: 'pregen-maelstrom-psycho',
    handle: 'Maelstrom Chrome Psycho',
    role: 'Solo',
    roleRank: 4,
    era: '2045',
    avatarIcon: 'skull',
    sourceBadge: 'RIVAL CORE',
    bioSummary:
      'Gángster fanático de Maelstrom con el rostro completamente extirpado y sustituido por una óptica de cinco ojos rojos. Vive en el límite de la ciberpsicosis alimentado por drogas de combate.',
    whatYouGet: [
      'Óptica Cyberoptics pentagonal con Anti-Dazzle e infrarrojos de serie.',
      'Ciberbrazo reforzado con garras retráctiles Big Knucks.',
      'Escopeta pesada recortada y Subfusil pesado.',
      'BODY 9 y REF 8: Fuerza bruta aterradora y velocidad de reacción inhumana.',
      'Inmune al miedo con drogas callejeras Black Lace en el torrente sanguíneo.'
    ],
    stats: {
      INT: 4,
      REF: 8,
      DEX: 7,
      TECH: 6,
      COOL: 5,
      WILL: 8,
      LUCK: 4,
      MOVE: 6,
      BODY: 9,
      EMP: 2
    },
    skills: {
      handgun: 6,
      shoulderArms: 6,
      autofire: 5,
      heavyWeapons: 4,
      archery: 0,
      meleeWeapon: 6,
      brawling: 6,
      martialArts: 0,
      evasion: 6,
      athletics: 5,
      firstAid: 2,
      paramedic: 0,
      cybertech: 5,
      perception: 6,
      concentration: 5,
      resistTortureDrugs: 7
    },
    generalSkills: {
      Streetwise: 6,
      'Weaponstech': 5,
      'Language (Streetslang)': 2,
      'Local Expert (Watson - Northside)': 4
    },
    weapons: [
      {
        id: 'shotgun',
        instanceId: 'wep-maelstrom-sg',
        name: 'Maelstrom Sawed-Off Shotgun',
        type: 'Ranged',
        skill: 'Shoulder Arms',
        damage: '5d6',
        rof: 1,
        hands: 2,
        concealable: false,
        cost: 500,
        standardMag: 4,
        currentMag: 4,
        ammoType: 'Slug',
        loadedAmmoType: 'Slug',
        inHand: true,
        reserveAmmo: 20
      },
      {
        id: 'big-knucks',
        instanceId: 'wep-maelstrom-knucks',
        name: 'Armored Big Knucks (Cyberarm)',
        type: 'Melee',
        skill: 'Brawling',
        damage: '2d6',
        rof: 2,
        hands: 1,
        concealable: true,
        cost: 100,
        standardMag: 0,
        currentMag: 0,
        ammoType: 'N/A',
        loadedAmmoType: 'N/A',
        inHand: false,
        reserveAmmo: 0
      }
    ],
    headArmor: { name: 'Chrome Faceplate (Head SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    bodyArmor: { name: 'Spiked Leathers & Plates (Body SP 11)', maxSp: 11, currentSp: 11, penalty: 0 },
    cyberwareIds: ['cybereye', 'cyberarm', 'big-knucks', 'neuralware-processor'],
    eurodollars: 300,
    lifepath: {
      culturalRegion: 'América del Norte (Watson - Northside Industrial)',
      personality: 'Violento, impulsivo y rozando el delirio homicida',
      clothingStyle: 'Gang Colors (Cuero negro con pinchos, cables expuestos y manchas de óxido)',
      hairstyle: 'Calvo con placas de circuito soldadas al cráneo',
      affectation: 'Cinco ojos ópticos rojos parpadeando en la oscuridad',
      valueMost: 'El Cromo y la destrucción de la carne débil',
      feelAboutPeople: 'Cualquiera sin implantes es ganado esperando el matadero',
      valuedPerson: 'El líder supremo de Maelstrom',
      valuedPossession: 'Su procesador neural overclockeado',
      familyBackground: 'Huérfano callejero capturado y modificado por Maelstrom',
      childhoodEnvironment: 'En la planta cárnica clausurada de Totentanz',
      familyCrisis: 'Su cuerpo biológico original fue casi completamente extirpado',
      friends: ['Sus hermanos de banda de Maelstrom'],
      tragicLoveAffairs: ['Incapaz de sentir empatía o amor biológico'],
      enemies: [
        {
          id: 'en-mael-1',
          who: 'MaxTac (División de Ciberpsicosis del NCPD)',
          cause: 'Múltiples homicidios callejeros y acumulación ilegal de cromo',
          throwAtYou: 'Operativos con rifles Gauss y drones de gas',
          reaction: 'Tiroteo suicida hasta que lo abatan'
        }
      ],
      roleLifepath: {
        solo_type: 'Psicópata de choque frontal',
        solo_moral: 'La masacre es la única plegaria válida'
      },
      lifeGoal: 'Alcanzar el 100% de conversión en cromo antes de que su mente se apague'
    }
  }
];

// ============================================================================
// 9. HELPER FACTORY FUNCTIONS
// ============================================================================

export function buildCharacterSheetFromPregen(pregen: PregenTemplate): CharacterSheet {
  const hp = 10 + 5 * Math.ceil((pregen.stats.BODY + pregen.stats.WILL) / 2);
  const maxHumanity = pregen.stats.EMP * 10;

  return {
    id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    handle: pregen.handle,
    role: pregen.role,
    roleRank: pregen.roleRank,
    notes: pregen.bioSummary,
    stats: { ...pregen.stats },
    currentHp: hp,
    currentLuck: pregen.stats.LUCK,
    currentHumanity: Math.max(10, maxHumanity - pregen.cyberwareIds.length * 4),
    headArmor: { ...pregen.headArmor },
    bodyArmor: { ...pregen.bodyArmor },
    skills: { ...pregen.skills },
    equippedWeapons: pregen.weapons.map(w => ({ ...w })),
    installedCyberwareIds: [...pregen.cyberwareIds],
    activeInjuries: [],
    eurodollars: pregen.eurodollars,
    inventory: [],
    transactions: [
      {
        id: `tx-init-${Date.now()}`,
        timestamp: new Date().toISOString(),
        concept: 'Fondos iniciales de partida',
        amount: pregen.eurodollars,
        balanceAfter: pregen.eurodollars
      }
    ],
    era: pregen.era,
    creationMethod: 'pregen',
    roleAbilityName: ROLES_CATALOG.find(r => r.name.toLowerCase() === pregen.role.toLowerCase())?.roleAbility || 'Role Ability',
    generalSkills: { ...pregen.generalSkills },
    fashionBudgetRemaining: 800,
    hasNeuroport: pregen.era === '2077',
    lifepath: { ...pregen.lifepath }
  };
}

export function createDefaultCombatSkills(): Record<CombatSkillKey, number> {
  return {
    handgun: 0,
    shoulderArms: 0,
    autofire: 0,
    heavyWeapons: 0,
    archery: 0,
    meleeWeapon: 0,
    brawling: 2, // Basic skill default
    martialArts: 0,
    evasion: 2, // Basic skill default
    athletics: 2, // Basic skill default
    firstAid: 2, // Basic skill default
    paramedic: 0,
    cybertech: 0,
    perception: 2, // Basic skill default
    concentration: 2, // Basic skill default
    resistTortureDrugs: 0
  };
}
