import { CEMK_CREATION, CORE_GEAR_SKILLS, CORE_ROLE_TABLES, CORE_ROLES } from './creation';
import type { CoreRoleName, PackageGearItem } from './creation';
import pack from './core-rules.cprpack.json';
import { SKILL_METADATA } from '../types/cyberpunk';
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
      'Neuroport incluido gratis al crear: 0 HL y no baja la Humanidad máxima (CEMK RB p.25).',
      'Armas de tecnología 2077: Power (rebotes tácticos), Tech (disparo perforante de coberturas) y Smart (guiado balístico).',
      'Soporte para Quickhacking en combate táctico: 1 NET Action por Quickhack, sin RAM (CEMK p. 16).',
      'Pregens canon: los 7 Folios de CEMK (Hardpoint, Wrench, Connect, Bluescreen, Insurance, Thorn, Maven).',
      'Mecánicas avanzadas de Estrés, Humanidad y Ciberpsicosis acelerada del Edgerunners Mission Kit.',
      'Catálogo de ciberware moderno: Sandevistan militar Militech, Monowire, Mantis Blades y Gorilla Arms.'
    ],
    // [Claude Code · 2026-10-22] Derivado de los datos canon CEMK (RB pp. 35-36).
    neuroportSubsystems: [
      ...CEMK_CREATION.neuroport.pieces.map((pieza) => ({
        name: pieza.name,
        benefit: pieza.descEs,
        savedCost: 'Incluido en el Neuroport (CEMK RB pp. 35-36)'
      })),
      {
        name: 'Cyberdeck Port (opcional)',
        benefit: CEMK_CREATION.cyberdeckPort.descEs,
        savedCost: `${CEMK_CREATION.cyberdeckPort.cost} · HL ${CEMK_CREATION.cyberdeckPort.humanityLoss} · requiere Neuroport (CEMK RB p.36)`
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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
    // Se completa con datos canon al final del archivo (Core pp. 74-77, 86-87, 98-99, 103, 117).
    streetratStats: { INT: 0, REF: 0, DEX: 0, TECH: 0, COOL: 0, WILL: 0, LUCK: 0, MOVE: 0, BODY: 0, EMP: 0 },
    edgerunnerStatTable: [],
    templateCombatSkills: {},
    templateGeneralSkills: {},
    startingLoadout: {
      weaponNames: [],
      armorNames: [],
      cyberwareIds: [],
      gearNames: [],
      fashionSummary: '',
      itemsBreakdown: []
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

export const PREGEN_TEMPLATES: PregenTemplate[] = [];

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

// ============================================================================
// 10. DATOS CANON DE CREACIÓN APLICADOS A ROLES Y PREGENS (al final para evitar TDZ)
// [Claude Code · 2026-10-22] Fuente: data/creation/* (Core RED pp. 74-77, 81-87, 98-99, 103, 117; Easy Mode pp. 37-45).
// ============================================================================

export type CanonSkillRef =
  | { kind: 'combat'; key: CombatSkillKey }
  | { kind: 'general'; key: string };

/** Nombres de habilidades del libro que no se pudieron resolver (el test exige que esté vacío). */
export const UNRESOLVED_CANON_SKILL_NAMES: string[] = [];
/** Ciberware canon sin id en el catálogo de la app: solo aparece en itemsBreakdown / whatYouGet. */
export const UNMAPPED_CANON_CYBERWARE: string[] = [];

const CANON_STAT_KEYS: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];

const CANON_ROLE_BOOK_NAME: Record<string, CoreRoleName> = {
  solo: 'Solo',
  netrunner: 'Netrunner',
  tech: 'Tech',
  medtech: 'Medtech',
  rockerboy: 'Rockerboy',
  fixer: 'Fixer',
  nomad: 'Nomad',
  lawman: 'Lawman',
  exec: 'Exec',
  media: 'Media'
};

const normalizeCanonSkillName = (name: string): string =>
  name
    .toLowerCase()
    // Core pp. 86-87: "Electronics/Security Tech (x2)" marca el doble de nivel; "(choose 1)" es la especialización a elegir.
    .replace(/\s*\(x2\)\s*$/, '')
    .replace(/\s*\(choose 1\)\s*$/, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();

// Alias explícitos (nombre normalizado -> habilidad de la app).
const CANON_SKILL_ALIASES: Record<string, CanonSkillRef> = {
  // Easy Mode pp. 37-45 abrevia la especialización: "Local Expert" = "Local Expert (Your Home)".
  'local expert': { kind: 'general', key: 'Local Expert (Your Home)' },
  // Easy Mode p.43 (Redtail, Medtech): "Surgery" viene de la Habilidad de Rol Medicine; no está en la lista de 66 (Core pp. 81-85).
  surgery: { kind: 'general', key: 'Surgery' }
};

/**
 * Resuelve un nombre de habilidad del libro: combat si coincide con el label de SKILL_METADATA,
 * general si coincide con key/label de GENERAL_SKILLS_CATALOG, alias explícito, o nombre canon de
 * CORE_GEAR_SKILLS.skills (Core pp. 81-85) como habilidad general por nombre canon.
 */
export function resolveSkillKey(bookName: string): CanonSkillRef | null {
  const n = normalizeCanonSkillName(bookName);
  for (const [key, meta] of Object.entries(SKILL_METADATA) as Array<[CombatSkillKey, { label: string }]>) {
    if (normalizeCanonSkillName(meta.label) === n) return { kind: 'combat', key };
  }
  const g = GENERAL_SKILLS_CATALOG.find(
    (x) => normalizeCanonSkillName(x.key) === n || normalizeCanonSkillName(x.label) === n
  );
  if (g) return g.combatSkillKey ? { kind: 'combat', key: g.combatSkillKey } : { kind: 'general', key: g.key };
  const alias = CANON_SKILL_ALIASES[n];
  if (alias) return alias;
  const canon = CORE_GEAR_SKILLS.skills.find((x) => normalizeCanonSkillName(x.name) === n);
  if (canon) return { kind: 'general', key: canon.name };
  return null;
}

function splitCanonSkills(entries: Array<{ name: string; level: number }>): {
  combat: Partial<Record<CombatSkillKey, number>>;
  general: Record<string, number>;
} {
  const combat: Partial<Record<CombatSkillKey, number>> = {};
  const general: Record<string, number> = {};
  for (const e of entries) {
    const ref = resolveSkillKey(e.name);
    if (!ref) {
      if (!UNRESOLVED_CANON_SKILL_NAMES.includes(e.name)) UNRESOLVED_CANON_SKILL_NAMES.push(e.name);
      continue;
    }
    if (ref.kind === 'combat') combat[ref.key] = Math.max(combat[ref.key] ?? 0, e.level);
    else general[ref.key] = Math.max(general[ref.key] ?? 0, e.level);
  }
  return { combat, general };
}

// Nombre canon de ciberware -> id del catálogo de la app (data/core-rules.cprpack.json). Solo coincidencias exactas o alias obvios.
const CANON_CYBERWARE_IDS: Record<string, string> = {
  'Neural Link': 'neuralware-processor',
  'Interface Plugs': 'interface-plugs',
  Biomonitor: 'biomonitor',
  Chemskin: 'chemskin',
  Techhair: 'techhair',
  'Shift Tacts': 'shift-tacts',
  Skinwatch: 'skinwatch',
  'Light Tattoo': 'light-tattoo',
  'Cyberaudio Suite': 'cyberaudio-suite',
  'Amplified Hearing': 'amplified-hearing',
  'Audio Recorder': 'audio-recorder-audio',
  'Internal Agent': 'internal-agent',
  'Voice Stress Analyzer': 'voice-stress-analyzer',
  'Subdermal Pocket': 'subdermal-pocket',
  'Hidden Holster': 'hidden-holster',
  'Nasal Filters': 'nasal-filters',
  'Toxin Binders': 'toxin-binders',
  Cybereye: 'cybereye',
  MicroOptics: 'micro-optics',
  TeleOptics: 'teleoptics',
  'Teleoptic Cybereye': 'teleoptics',
  'Image Enhance Cybereyes': 'image-enhance',
  'Tool Hand': 'tool-hand',
  'Sandevistan Speedware': 'sandevistan',
  'Pain Editor (Chipware)': 'pain-editor'
};

function mapCanonCyberwareId(name: string): string | undefined {
  const id = CANON_CYBERWARE_IDS[name];
  if (!id && !UNMAPPED_CANON_CYBERWARE.includes(name)) UNMAPPED_CANON_CYBERWARE.push(name);
  return id;
}

const canonQtySuffix = (qty: number): string => (qty > 1 ? ` x${qty}` : '');

function formatCanonGearItem(item: PackageGearItem): string {
  const opts = item.options && item.options.length > 0 ? ` o ${item.options.join(' o ')}` : '';
  const notes = item.notes ? ` (${item.notes})` : '';
  return `${item.name}${opts}${canonQtySuffix(item.qty)}${notes}`;
}

function buildCanonFashionSummary(pieces: Array<{ style: string; piece: string; qty: number }>, page: number | null): string {
  const byStyle = new Map<string, string[]>();
  for (const p of pieces) {
    const list = byStyle.get(p.style) ?? [];
    list.push(`${p.qty} ${p.piece}`);
    byStyle.set(p.style, list);
  }
  const parts = Array.from(byStyle.entries()).map(([style, list]) => `${style}: ${list.join(', ')}`);
  return `${parts.join('; ')} (Core p.${page ?? 103})`;
}

type CanonPackWeapon = {
  id: string;
  name: string;
  type: string;
  skill: string;
  hands: number;
  concealable: boolean;
  cost: number;
  ammoType?: string;
};

const canonSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function buildCanonPregens(): PregenTemplate[] {
  const packWeapons = (pack as unknown as { weapons: CanonPackWeapon[] }).weapons;
  // Íconos reutilizados por rol (los que usaba el archivo antes de las pregens canon).
  const iconByRole: Record<string, string> = {
    Rockerboy: 'music',
    Solo: 'shield',
    Tech: 'tool',
    Medtech: 'tool',
    Media: 'eye'
  };
  return CORE_ROLES.easyModePregens.map((ep) => {
    const stats = {} as Record<StatKey, number>;
    for (const k of CANON_STAT_KEYS) stats[k] = ep.stats[k];

    const split = splitCanonSkills(Object.entries(ep.skills).map(([name, level]) => ({ name, level })));
    const skills: Record<CombatSkillKey, number> = {
      handgun: 0,
      shoulderArms: 0,
      autofire: 0,
      heavyWeapons: 0,
      archery: 0,
      meleeWeapon: 0,
      brawling: 0,
      martialArts: 0,
      evasion: 0,
      athletics: 0,
      firstAid: 0,
      paramedic: 0,
      cybertech: 0,
      perception: 0,
      concentration: 0,
      resistTortureDrugs: 0,
      ...split.combat
    };

    const handleSlug = canonSlug(ep.handle);
    const weapons: EquippedWeapon[] = ep.weapons.map((w, idx) => {
      const cat = packWeapons.find((c) => c.name === w.name);
      const extraMatch = w.notes.match(/(\d+)\s*rondas extra/);
      const ammoType = cat?.ammoType && cat.ammoType !== 'N/A' ? cat.ammoType : undefined;
      return {
        id: cat?.id ?? canonSlug(w.name),
        instanceId: `wep-${handleSlug}-${idx}`,
        name: w.name,
        type: cat?.type ?? (w.ammo === null ? 'Melee' : 'Ranged'),
        skill: cat?.skill ?? (w.ammo === null ? 'Melee Weapon' : 'Handgun'),
        damage: w.dmg,
        rof: w.rof,
        hands: cat?.hands ?? 1,
        concealable: cat?.concealable ?? false,
        cost: cat?.cost ?? 0,
        standardMag: w.ammo ?? undefined,
        currentMag: w.ammo ?? 0,
        ammoType,
        loadedAmmoType: ammoType ?? '',
        inHand: idx === 0,
        reserveAmmo: extraMatch ? Number(extraMatch[1]) : undefined,
        notes: w.notes
      };
    });

    const cyberwareIds: string[] = [];
    for (const c of ep.cyberware) {
      const id = mapCanonCyberwareId(c.name);
      if (id) cyberwareIds.push(id);
    }

    return {
      id: `pregen-easy-${handleSlug}`,
      handle: ep.handle,
      role: ep.role,
      roleRank: 4,
      era: '2045',
      avatarIcon: iconByRole[ep.role] ?? 'shield',
      sourceBadge: `Core RED · Easy Mode p.${ep.source.page}`,
      bioSummary: '',
      whatYouGet: [
        `Habilidad de rol ${ep.roleAbility.name}: ${ep.roleAbility.notes}`,
        `Armas: ${ep.weapons.map((w) => `${w.name} (${w.dmg})`).join(', ')}.`,
        `Ciberware: ${ep.cyberware.map((c) => `${c.name} (${c.notes})`).join('; ')}.`
      ],
      stats,
      skills,
      generalSkills: split.general,
      weapons,
      headArmor: { name: `${ep.armor.name} (Head)`, maxSp: ep.armor.sp, currentSp: ep.armor.sp, penalty: 0 },
      bodyArmor: { name: `${ep.armor.name} (Body)`, maxSp: ep.armor.sp, currentSp: ep.armor.sp, penalty: 0 },
      cyberwareIds,
      // El Easy Mode no imprime €$ para sus pregens.
      eurodollars: 0,
      lifepath: {
        culturalRegion: '',
        personality: '',
        clothingStyle: '',
        hairstyle: '',
        affectation: '',
        valueMost: '',
        feelAboutPeople: '',
        valuedPerson: '',
        valuedPossession: '',
        familyBackground: '',
        childhoodEnvironment: '',
        familyCrisis: '',
        friends: [],
        tragicLoveAffairs: [],
        enemies: [],
        roleLifepath: {},
        lifeGoal: ''
      }
    };
  });
}

function applyCanonRoleData(): void {
  for (const role of ROLES_CATALOG) {
    const bookName = CANON_ROLE_BOOK_NAME[role.id];
    if (!bookName) continue;

    // Tabla de stats Edgerunner en orden de tirada 1..10 (Core pp. 74-77).
    role.edgerunnerStatTable = CORE_ROLE_TABLES.statTables[bookName].rows.map((row) => {
      const out = {} as Record<StatKey, number>;
      for (const k of CANON_STAT_KEYS) out[k] = row[k];
      return out;
    });
    // Streetrat: fila 1 por defecto (el wizard deja elegir/tirar la fila).
    role.streetratStats = { ...role.edgerunnerStatTable[0] };

    // Habilidades Streetrat (Core pp. 86-87).
    const split = splitCanonSkills(CORE_ROLE_TABLES.streetratSkills[bookName].skills);
    role.templateCombatSkills = split.combat;
    role.templateGeneralSkills = split.general;

    // Paquete de equipo inicial (Core pp. 98-99, 103, 117).
    const pkg = CORE_GEAR_SKILLS.rolePackages[bookName];
    const isAmmoOrArmor = (name: string) => /ammunition|armorjack/i.test(name);
    const weaponNames = pkg.weaponsArmor.items.filter((i) => !isAmmoOrArmor(i.name)).map((i) => i.name);
    const hasLightArmorjack = pkg.weaponsArmor.items.some((i) => /light armorjack/i.test(i.name));
    const cyberwareIds: string[] = [];
    for (const c of pkg.cyberware.items) {
      const id = mapCanonCyberwareId(c.name);
      if (id) cyberwareIds.push(id);
    }
    role.startingLoadout = {
      weaponNames,
      armorNames: hasLightArmorjack ? ['Light Armorjack (Head)', 'Light Armorjack (Body)'] : [],
      cyberwareIds,
      gearNames: pkg.outfit.gear.map((g) => `${g.name}${canonQtySuffix(g.qty)}`),
      fashionSummary: buildCanonFashionSummary(pkg.outfit.pieces, pkg.outfit.source.page),
      itemsBreakdown: [
        ...pkg.weaponsArmor.items.map(formatCanonGearItem),
        ...pkg.outfit.gear.map(formatCanonGearItem),
        ...pkg.cyberware.items.map(
          (c) => `${c.name}${c.options ? ` ${c.options}` : ''} (HL ${c.humanityLoss})`
        ),
        '(Core pp. 98-99, 103, 117)'
      ]
    };
  }

  // Pregens canon del Easy Mode (reemplazan a las inventadas).
  PREGEN_TEMPLATES.push(...buildCanonPregens());
}

applyCanonRoleData();
