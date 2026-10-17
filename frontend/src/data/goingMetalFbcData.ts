/**
 * GOING METAL // FULL BODY CONVERSIONS (FBC) COMPLETO
 * Interface RED Vol. 3 (Going Metal) + Cyberpunk RED Canonical Rules
 * 13 Cuerpos FBC Oficiales, 16 Piezas de Cyberware FBC, Equipo Especializado y Guía "About FBCs"
 */

export interface FbcBody {
  id: string;
  name: string;
  manufacturer: string;
  cost: number;
  costTier: string;
  humanityLoss: string;
  bodyOverride: number;
  moveOverride: number;
  baseArmorSp: number;
  builtInCyberware: string[];
  armSlots: number;
  legSlots: number;
  neuralSlots: number;
  internalSlots: number;
  specialRules: string[];
  loreDescription: string;
  tacticalRole: string;
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
  sourceBook: 'interface_red';
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
  sourceBook: 'interface_red';
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
// 1. LOS 13 CUERPOS FBC OFICIALES (GOING METAL)
// ============================================================================

export const FBC_13_BODIES: FbcBody[] = [
  {
    id: 'fbc-iec-alpha',
    name: 'IEC Alpha Class',
    manufacturer: 'International Electric Corporation (IEC)',
    cost: 15000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 10,
    moveOverride: 5,
    baseArmorSp: 11,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Dual Cyberarms (Standard)',
      'Dual Cyberlegs (Standard)',
      'Subdermal Sensor Grid',
      'Integrated Audio/Visual Suite'
    ],
    armSlots: 4,
    legSlots: 4,
    neuralSlots: 4,
    internalSlots: 4,
    specialRules: [
      'Chasis multipropósito estándar con compatibilidad universal de piezas.',
      'Costes de reparación reducidos en un 20% en talleres civiles certificados.'
    ],
    loreDescription: 'El estándar de la industria. Diseñado para trabajadores de rescate, técnicos pesados y ciudadanos que desean una transición estable a cuerpo completo sin extravagancias militares.',
    tacticalRole: 'Polivalente civil y plataforma modular equilibrada.'
  },
  {
    id: 'fbc-raven-gemini',
    name: 'Raven Microcybernetics Gemini',
    manufacturer: 'Raven Microcybernetics',
    cost: 25000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 8,
    moveOverride: 6,
    baseArmorSp: 11,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'RealSkinned Ultra-Realistic Exterior (Indistinguible al tacto y vista)',
      'Simulated Breath & Temperature Matrix',
      'Vocal Synthesizer Mimic',
      'Cyberaudio Suite con Bug Detector'
    ],
    armSlots: 3,
    legSlots: 3,
    neuralSlots: 5,
    internalSlots: 4,
    specialRules: [
      'Indistinguible de un ser humano biológico sin un escáner cibernético o médico exhaustivo (Perception DV 17).',
      'No sufre el estigma social habitual hacia los cyborgs de metal descubierto en entornos ejecutivos o de alta sociedad.'
    ],
    loreDescription: 'La cúspide de la bio-mímica. El Gemini está recubierto de capas dérmicas sintéticas vivas, pulso simulado y temperatura corporal real. Es el chasis preferido por espías de alto nivel, cortesanos corporativos e infiltradores.',
    tacticalRole: 'Infiltración social, espionaje encubierto y diplomacia.'
  },
  {
    id: 'fbc-militech-enforcer',
    name: 'Militech Enforcer',
    manufacturer: 'Militech Arms International',
    cost: 30000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 12,
    moveOverride: 5,
    baseArmorSp: 13,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Reinforced Combat Cyberarms (Heavy Hydraulic)',
      'Tactical HUD Link',
      'Subdermal Armor Plating (SP 13 Cabeza & Cuerpo)',
      'Weapon Mount Hardpoint (Hombro Derecho)'
    ],
    armSlots: 4,
    legSlots: 4,
    neuralSlots: 4,
    internalSlots: 5,
    specialRules: [
      'Optimizado para control de disturbios urbanos y asalto táctico de edificios.',
      'Inmune al derribo por armas ligeras o granadas aturdidoras.'
    ],
    loreDescription: 'El puño blindado de las divisiones de seguridad corporativa y los escuadrones SWAT de la policía metropolitana. Diseñado para resistir fuego concentrado en pasillos estrechos y derribar barricadas.',
    tacticalRole: 'Asalto urbano, punto de choque y soporte de armas pesadas.'
  },
  {
    id: 'fbc-zetatech-samson',
    name: 'Zetatech Samson',
    manufacturer: 'Zetatech',
    cost: 28000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 14,
    moveOverride: 4,
    baseArmorSp: 13,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Heavy Industrial Linear Frame (Built-in)',
      'Dual Reinforced Heavy Cargo Cyberarms',
      'Magnetic Anchor Grips',
      'Hazardous Material Resistant Seals'
    ],
    armSlots: 4,
    legSlots: 3,
    neuralSlots: 3,
    internalSlots: 6,
    specialRules: [
      'Capacidad de carga extrema: puede levantar y arrojar hasta 500 kg sin chequeo de atletismo.',
      'Brawling y puñetazos causan 4d6 de daño base.'
    ],
    loreDescription: 'Una bestia de construcción y minería pesada reconvertida en plataforma de demolición callejera. Sus pistones emiten un zumbido gutural capaz de doblar vigas de acero estructural con las manos desnudas.',
    tacticalRole: 'Fuerza bruta descomunal, demolición y levantamiento de carga pesada.'
  },
  {
    id: 'fbc-iec-dragoon',
    name: 'IEC Dragoon',
    manufacturer: 'International Electric Corporation (IEC)',
    cost: 50000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 15,
    moveOverride: 7,
    baseArmorSp: 15,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Military Grade Linear Frame Beta/Omega Hybrid',
      'Heavy Combat Plating SP 15',
      'Targeting Scope & Chyron Combat Matrix',
      'Dual High-Capacity Ammo Feed Bins',
      'Integrated Heavy Shoulder Weapon Hardpoint'
    ],
    armSlots: 5,
    legSlots: 5,
    neuralSlots: 5,
    internalSlots: 6,
    specialRules: [
      'Plataforma de guerra total diseñada exclusivamente para el combate militar irrestricto.',
      'Inmune a la supresión de fuego y penalizaciones por disparar armas pesadas a dos manos.'
    ],
    loreDescription: 'El vehículo de combate bípedo más temido de las Guerras Corporativas y el modelo original que convirtió a leyendas de la muerte en máquinas de picar carne. Su perfil blindado emite puro terror psicológico.',
    tacticalRole: 'Dominación militar total, aniquilación de escuadras y armamento pesado.'
  },
  {
    id: 'fbc-arasaka-daioni',
    name: 'Arasaka DaiOni',
    manufacturer: 'Arasaka Corporation (División Experimental de Armamento)',
    cost: 100000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 16,
    moveOverride: 6,
    baseArmorSp: 18,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Arasaka Demon Heavy Combat Exo-Skeleton',
      'Composite Heavy Ceramic Armor Plating SP 18',
      'Smartlink Dual Ballistic Computer',
      'Twin Retractable Heavy Blades',
      'Reinforced EMP Farady Mesh'
    ],
    armSlots: 6,
    legSlots: 6,
    neuralSlots: 6,
    internalSlots: 8,
    specialRules: [
      'La armadura SP 18 sólo se ablaciona ante impactos de daño que superen 20 puntos.',
      'Permite empuñar armamento montado en vehículos como si fueran armas de mano personales.'
    ],
    loreDescription: 'La pesadilla metálica personificada, diseñado a medida para gigantes como Adam Smasher durante la Cuarta Guerra Corporativa. Es menos un cuerpo humanoide y más un tanque acorazado con forma de demonio japonés.',
    tacticalRole: 'Jefe supremo de guerra corporativa y fortaleza andante invulnerable.'
  },
  {
    id: 'fbc-vermilion',
    name: 'Rocklin Augmentics Vermilion',
    manufacturer: 'Rocklin Augmentics',
    cost: 35000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 11,
    moveOverride: 8,
    baseArmorSp: 13,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'High-Torque Hydraulic Running Actuators (+2 MOVE)',
      'Jump Booster Pneumatic Thrusters',
      'Subdermal Kinetic Dampeners',
      'Thermal Baffling & Sound Silencer Gaskets'
    ],
    armSlots: 4,
    legSlots: 5,
    neuralSlots: 4,
    internalSlots: 4,
    specialRules: [
      'Puede saltar horizontalmente hasta 12 metros o verticalmente hasta 6 metros sin carrera previa.',
      'Bonificación pasiva de +2 a tiradas de Evasión e Iniciativa.'
    ],
    loreDescription: 'Diseñado para agentes de operaciones encubiertas, cazadores de recompensas y velocistas tácticos. Combina blindaje balístico respetable con una agilidad felina capaz de correr por paredes y techos.',
    tacticalRole: 'Alta movilidad, flanqueo táctico y asesinato de alta velocidad.'
  },
  {
    id: 'fbc-biotechnica-sigma',
    name: 'Biotechnica Biosystem Sigma',
    manufacturer: 'Biotechnica',
    cost: 32000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 11,
    moveOverride: 6,
    baseArmorSp: 12,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Hermetic Toxic Environment Seal',
      'Chemspec Air/Liquid Filtration Laboratory',
      'Radiation Hardened Polymeric Exterior',
      'Internal Specimen Containment Vault'
    ],
    armSlots: 4,
    legSlots: 4,
    neuralSlots: 5,
    internalSlots: 6,
    specialRules: [
      'Inmunidad absoluta a radiación, toxinas químicas, agentes biológicos y esporas mutágenas.',
      'Capacidad de operar indefinidamente en atmósferas con cero oxígeno o presión volcánica.'
    ],
    loreDescription: 'Chasis concebido para científicos de campo que exploran zonas biológicas contaminadas, laboratorios de armas químicas clausurados y páramos radioactivos tras el colapso.',
    tacticalRole: 'Supervivencia en entornos extremos, operaciones hazmat y soporte químico.'
  },
  {
    id: 'fbc-dynalar-lotus',
    name: 'Dynalar Executive Lotus',
    manufacturer: 'Dynalar Technologies',
    cost: 40000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 9,
    moveOverride: 6,
    baseArmorSp: 11,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Lacquered Ceramic & Polished Chrome Body Finish',
      'Subdermal Audio-Video Recording & Broadcaster',
      'Empathetic Resonance Analyzer (+2 Human Perception)',
      'Subdermal Holo-Projector Array'
    ],
    armSlots: 3,
    legSlots: 3,
    neuralSlots: 6,
    internalSlots: 5,
    specialRules: [
      'Otorga +2 a todas las habilidades de Interacción Social (Persuasion, Conversation, Human Perception).',
      'Batería silenciosa que no emite zumbidos mecánicos durante eventos diplomáticos.'
    ],
    loreDescription: 'La máxima expresión del estatus corporativo de lujo. Creado para directores generales, negociadores de megacorporaciones y diplomáticos que se niegan a envejecer pero exigen una presencia aristocrática deslumbrante.',
    tacticalRole: 'Negociación corporativa, influencia social y mando de escuadra.'
  },
  {
    id: 'fbc-lazarus-centurion',
    name: 'Lazarus Centurion Mk.IV',
    manufacturer: 'Lazarus Military Group',
    cost: 45000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 13,
    moveOverride: 6,
    baseArmorSp: 14,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Ablative Armor Composite Plates SP 14',
      'Combat Awareness Tacticon Suite',
      'Integrated Heavy Machinegun Feed Link',
      'Subdermal Trauma Alert Telemetry'
    ],
    armSlots: 5,
    legSlots: 4,
    neuralSlots: 5,
    internalSlots: 5,
    specialRules: [
      'Bonificación de +2 a tiradas de Táctica y Supressive Fire.',
      'El blindaje absorbe 2 puntos de daño directo antes de calcular la ablación.'
    ],
    loreDescription: 'Chasis de mando táctico en el frente de batalla diseñado por Lazarus para oficiales que lideran formaciones mecanizadas bajo fuego de artillería pesada.',
    tacticalRole: 'Liderazgo táctico, fuego de contención y choque frontal.'
  },
  {
    id: 'fbc-sovoil-koschei',
    name: 'SovOil Koschei Heavy Rig',
    manufacturer: 'SovOil Heavy Engineering',
    cost: 38000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 14,
    moveOverride: 4,
    baseArmorSp: 14,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Deep-Submergence Hydrostatic Pressure Armor SP 14',
      'Dual High-Output Sonar Eyes',
      'Hydro-Jet Propulsion Pack (Nado 10m/turno)',
      'Thermal Cryo-Heating Internal Coils'
    ],
    armSlots: 4,
    legSlots: 4,
    neuralSlots: 3,
    internalSlots: 6,
    specialRules: [
      'Inmune a la presión de fosas oceánicas abisales (hasta 5,000m) y temperaturas de -60°C.',
      'Ataques desarmados bajo el agua no sufren penalizadores por fricción hidrodinámica.'
    ],
    loreDescription: 'Bautizado en honor al hechicero inmortal del folclore eslavo, este chasis masivo fue construido para perforar plataformas petrolíferas en el Ártico y reparar gasoductos en el fondo del mar.',
    tacticalRole: 'Operaciones subacuáticas, salvamento abisal y climas extremos polares.'
  },
  {
    id: 'fbc-kangtao-fenghuang',
    name: 'Kang Tao Fenghuang Stealth Borg',
    manufacturer: 'Kang Tao',
    cost: 42000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 10,
    moveOverride: 7,
    baseArmorSp: 12,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Thermoptic Chameleon Shroud System',
      'Radar-Absorbent Honeycomb Skin',
      'Smart Smartgun Micro-Antennae Array',
      'Silent Footfall Pneumatic Baffles'
    ],
    armSlots: 4,
    legSlots: 4,
    neuralSlots: 5,
    internalSlots: 5,
    specialRules: [
      'Otorga +4 a chequeos de Sigilo (Stealth) cuando se activa el camuflaje termóptico.',
      'Invisible a visores térmicos e infrarrojos.'
    ],
    loreDescription: 'El "Fénix" de Kang Tao es una plataforma de infiltración y eliminación de objetivos de alto valor que parece una sombra estilizada de grafito mate capaz de desaparecer a plena luz del día.',
    tacticalRole: 'Infiltración furtiva, reconocimiento fantasma y francotirador.'
  },
  {
    id: 'fbc-continental-wiseman',
    name: 'Continental Brands Wiseman Tech-Med',
    manufacturer: 'Continental Brands Medical Division',
    cost: 36000,
    costTier: 'Super Luxury',
    humanityLoss: '0 (Requiere Biopod previo)',
    bodyOverride: 9,
    moveOverride: 5,
    baseArmorSp: 11,
    builtInCyberware: [
      'Biopod Quick-Coupling Mount',
      'Quad-Arm Rig (4 Cyberarms funcionales simultáneos)',
      'Integrated Surgical Tool Suite & Cryo-Injector',
      'Micro-Analyzer & Diagnostic Spectrometer',
      'Internal Tool Storage Bay'
    ],
    armSlots: 8,
    legSlots: 3,
    neuralSlots: 6,
    internalSlots: 6,
    specialRules: [
      'Dispone de 4 brazos cibernéticos activos que permiten realizar 2 tareas técnicas o médicas simultáneas.',
      'Otorga +2 a todas las tiradas de First Aid, Paramedic y Cybertech.'
    ],
    loreDescription: 'El quirófano andante. Diseñado para cirujanos y maestros ingenieros que necesitan cuatro manos con calibración micrométrica para reparar chasis cyborg y salvar vidas en medio de bombardeos.',
    tacticalRole: 'Cirugía de campaña, reparación rápida de cyborgs y maestría técnica.'
  }
];

// ============================================================================
// 2. LAS 16 NUEVAS PIEZAS DE CYBERWARE FBC (GOING METAL)
// ============================================================================

export const FBC_16_CYBERWARE: FbcCyberwareItem[] = [
  {
    id: 'fbc-biopod',
    name: 'Biopod (Núcleo Cerebral FBC)',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 10000,
    costTier: 'Super Luxury',
    description: 'Cápsula blindada con soporte vital neuroquímico donde se trasplanta el cerebro biológico, tronco encefálico y órganos sensoriales primarios. Blindaje SP 18 incorporado. Permite transferirse entre chasis FBC con 0 coste adicional de humanidad.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-internal-frame-sigma',
    name: 'Internal Linear Frame Sigma (FBC Tuned)',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '2d6 (7)',
    cost: 6000,
    costTier: 'Super Luxury',
    description: 'Esqueleto interno reforzado optimizado para chasis FBC. Eleva el atributo BODY del cyborg a 12 si era inferior.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-internal-frame-beta',
    name: 'Internal Linear Frame Beta (FBC Tuned)',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '3d6 (10)',
    cost: 10000,
    costTier: 'Super Luxury',
    description: 'Estructura hiper-densificada de titanio para chasis FBC de alta resistencia. Eleva el atributo BODY a 14.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-internal-frame-omega',
    name: 'Internal Linear Frame Omega (BODY 16)',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '4d6 (14)',
    cost: 18000,
    costTier: 'Super Luxury',
    description: 'La cumbre de la biomecánica militar pesada. Eleva el atributo BODY a 16 permitiendo empuñar cañones de asalto y realizar tiradas de daño desarmado de 4d6.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-hydraulic-rams',
    name: 'FBC Hydraulic Rams',
    type: 'Cyberarm Option',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 1000,
    costTier: 'Very Expensive',
    description: 'Pistones de fluidos de alta presión instalados en los brazos. Multiplica por dos la fuerza de prensión y añade +2 al daño de golpes desarmados o presas.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-magnetic-grip-feet',
    name: 'FBC Magnetic Grip Feet',
    type: 'Cyberleg Option',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 500,
    costTier: 'Expensive',
    description: 'Electroimanes de conmutación rápida en las plantas de los pies cyborg. Permite caminar por paredes de acero o cascos de barcos y otorga ventaja contra ser derribado.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-overclocked-actuators',
    name: 'FBC Overclocked Leg Actuators (+2 MOVE)',
    type: 'Cyberleg Option',
    install: 'Clinic',
    humanityLoss: '2d6 (7)',
    cost: 2000,
    costTier: 'Very Expensive',
    description: 'Servos de bobinado de cobre ultra-conductivo que aumentan el atributo MOVE del chasis en +2 permanente.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-armored-biopod-casing',
    name: 'FBC Armored Biopod Casing',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '1d6 (3)',
    cost: 3000,
    costTier: 'Very Expensive',
    description: 'Refuerzo de aleación carbo-cerámica alrededor de la cápsula Biopod. Incrementa el SP del cráneo/biovaina de SP 18 a SP 20 frente a disparos apuntados a la cabeza.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-integrated-cyberdeck-bay',
    name: 'FBC Integrated Cyberdeck Bay',
    type: 'Neuralware Option',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 1500,
    costTier: 'Very Expensive',
    description: 'Compartimento interno presurizado que aloja un Cyberdeck comercial sin ocupar slots de manos o cinturón, con conexión de fibra directa al cerebro.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-smartlink-ballistic-matrix',
    name: 'FBC Smartlink Ballistic Matrix',
    type: 'Neuralware Option',
    install: 'Clinic',
    humanityLoss: '2d6 (7)',
    cost: 2500,
    costTier: 'Very Expensive',
    description: 'Coprocesador balístico de combate para cyborgs que añade +1 adicional a las tiradas de ataque con armas Smartgun montadas en el chasis.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-shoulder-weapon-mount',
    name: 'FBC Heavy Shoulder Weapon Mount',
    type: 'Borgware',
    install: 'Hospital',
    humanityLoss: '2d6 (7)',
    cost: 3000,
    costTier: 'Very Expensive',
    description: 'Punto de anclaje de artillería en el omóplato que permite disparar un arma larga, lanzagranadas o escopeta mediante control neuronal sin ocupar manos.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-thermoptic-coating',
    name: 'FBC Thermoptic Chameleon Coating',
    type: 'External Body Cyberware',
    install: 'Hospital',
    humanityLoss: '3d6 (10)',
    cost: 5000,
    costTier: 'Luxury',
    description: 'Matriz electrocrómica externa que mimetiza los colores y refracción lumínica del entorno circundante, otorgando +3 a Sigilo (Stealth) en movimiento lento.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-self-repair-nanites',
    name: 'FBC Self-Repair Nanite Hive',
    type: 'Internal Body Cyberware',
    install: 'Hospital',
    humanityLoss: '2d6 (7)',
    cost: 4000,
    costTier: 'Very Expensive',
    description: 'Microfábrica interna de nanobots metalúrgicos que repara automáticamente 1 punto de SP ablacionado en el blindaje corporal cada hora.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-emp-hardened-shielding',
    name: 'FBC EMP/Hardened Shielding',
    type: 'Internal Body Cyberware',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 2000,
    costTier: 'Very Expensive',
    description: 'Jaula de Faraday interna con condensadores de descarga rápida. Otorga +4 a chequeos de salvación contra granadas EMP o ataques de microondas.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-micro-thruster-jump',
    name: 'FBC Micro-Thruster Jump Pack',
    type: 'External Body Cyberware',
    install: 'Clinic',
    humanityLoss: '2d6 (7)',
    cost: 2500,
    costTier: 'Very Expensive',
    description: 'Micro-propulsores vectoriales integrados en la espalda del cyborg que permiten amortiguar caídas de cualquier altura y realizar saltos asistidos de 8 metros.',
    sourceBook: 'interface_red',
    fbcOnly: true
  },
  {
    id: 'fbc-auxiliary-power-core',
    name: 'FBC Auxiliary Power Core',
    type: 'Internal Body Cyberware',
    install: 'Clinic',
    humanityLoss: '1d6 (3)',
    cost: 1500,
    costTier: 'Very Expensive',
    description: 'Batería secundaria de combustible de hidrógeno que provee hasta 72 horas de operación autónoma en caso de fallo o drenaje del generador principal.',
    sourceBook: 'interface_red',
    fbcOnly: true
  }
];

// ============================================================================
// 3. EQUIPO ESPECIALIZADO DE GOING METAL (LINEAR FRAME EXTERNO & GRANADA)
// ============================================================================

export const GOING_METAL_GEAR: GoingMetalGearItem[] = [
  {
    id: 'external-linear-frame-omega',
    name: 'External Linear Frame Omega (BODY 16)',
    category: 'gear',
    cost: 5000,
    costTier: 'Luxury',
    description: 'Exoesqueleto mecánico de alta potencia montado externamente sobre arneses de combate. Eleva temporalmente el BODY a 16 para labores extremas sin necesidad de cirugía invasiva. Requiere dos Interface Plugs activos.',
    sourceBook: 'interface_red',
    stats: {
      bodyOverride: 16,
      installType: 'Equipable / Externo',
      interfacePlugsRequired: 2
    }
  },
  {
    id: 'grenade-laser-chaff',
    name: 'Laser-Blinding / Chaff Grenade',
    category: 'weapons',
    cost: 100,
    costTier: 'Premium',
    description: 'Granada táctica anti-sensores. Al detonar, dispersa una nube densa de partículas de aerosol metalizado y flashes estroboscópicos láser de alta intensidad en un radio de 6 metros. Todas las tiradas de ataque a distancia que atraviesen la nube sufren un penalizador de +4 al DV, y las miras inteligentes/smartguns quedan temporalmente desactivadas.',
    sourceBook: 'interface_red',
    stats: {
      type: 'Heavy Weapon / Arrojable',
      blastRadius: '6m',
      duration: '2 Asaltos',
      effect: '+4 DV a ataques a distancia, bloquea Smartlinks'
    }
  }
];

// ============================================================================
// 4. GUÍA CANÓNICA "ABOUT FBCS" (REGLAS Y MECÁNICAS ESTRUCTURADAS)
// ============================================================================

export const ABOUT_FBCS_GUIDE: AboutFbcsGuide = {
  title: 'MANUAL DE CAMPO // FULL BODY CONVERSIONS (FBC)',
  subtitle: 'Doctrina Médica, Trasplante de Biopod y Reglas de Chasis de Metal Completo (Interface RED Vol. 3)',
  summary: 'Una Conversión de Cuerpo Completo (Full Body Conversion) consiste en extraer quirúrgicamente el cerebro, cerebelo, médula superior y órganos sensoriales biológicos primarios del paciente para instalarlos dentro de una cápsula blindada de soporte vital llamada Biopod. A partir de ese momento, el individuo deja de tener carne mortal y pasa a operar chasis mecánicos intercambiables de titanio y polímeros.',
  corePrinciples: [
    {
      ruleName: 'El Biopod y el Coste Cero de Intercambio',
      description: 'El paciente paga la pérdida de humanidad masiva únicamente una vez al trasplantar su cerebro al Biopod (4d6 HL). Una vez dentro del Biopod, cambiar de un chasis a otro (por ejemplo, pasar de un Gemini civil a un Dragoon militar) cuesta 0 puntos de Humanidad adicional.',
      mechanicalImpact: 'Coste de Humanidad = 0 HL al intercambiar chasis activos.'
    },
    {
      ruleName: 'Inmunidades Biológicas Absolutas',
      description: 'Al no poseer sistema cardiovascular, pulmones, sangre ni carne orgánica en el cuerpo, el cyborg es totalmente inmune a amenazas médicas biológicas.',
      mechanicalImpact: 'Inmune a: Sangrado, Asfixia, Ahogamiento, Venenos, Drogas biológicas, Biotoxina y desgarros musculares.'
    },
    {
      ruleName: 'Protocolo de Curación Mecánica (Cybertech)',
      description: 'Los cyborgs FBC no son tratados por médicos con Primeros Auxilios ni Cirugía biológica. Para recuperar Puntos de Golpe (HP) o reparar blindajes destrozados, se requiere un técnico certificado en Cybertech y repuestos mecánicos.',
      mechanicalImpact: 'Curación y estabilización se realizan con habilidad Cybertech (DV según gravedad).'
    },
    {
      ruleName: 'Ablación Estructural vs Blindaje',
      description: 'El chasis FBC cuenta con blindaje estructural integrado (típicamente SP 11 a SP 18 según el modelo). La armadura se ablaciona con impactos que penetren su SP de la misma forma que una armadura corporal.',
      mechanicalImpact: 'El SP estructural reduce el daño entrante antes de que afecte a los Puntos de Golpe del chasis.'
    },
    {
      ruleName: 'Vulnerabilidad a Daño de EMP y Microondas',
      description: 'Debido a la densidad de componentes electrónicos y actuadores en todo el cuerpo, los cyborgs sufren un 50% de daño adicional ante pulsos electromagnéticos y armas tipo Microwaver o descargas de EMP.',
      mechanicalImpact: '+50% daño ante fuentes de daño EMP a menos que instale EMP/Hardened Shielding.'
    }
  ],
  conversionSteps: [
    {
      step: 1,
      title: 'Cirugía de Enucleación y Cosecha Cerebral',
      detail: 'Intervención de 18 horas en un Hospital de Grado Quirúrgico clase A. Extracción del cerebro biológico y conexión del Biopod a interfaces neurales primarias.'
    },
    {
      step: 2,
      title: 'Aclimatación y Terapia Psicológica',
      detail: 'El sujeto debe someterse a terapia de reducción de alienación sensorial para evitar la ciberpsicosis inmediata inducida por la pérdida del ritmo cardíaco natural.'
    },
    {
      step: 3,
      title: 'Montaje en el Chasis Elegido',
      detail: 'El Biopod se atornilla al puerto dorsal o torácico del chasis mediante anclajes de desconexión rápida blindados con SP 18.'
    }
  ],
  medicalAndRepairRules: [
    {
      topic: 'Reparación de Daño Ligero (HP normales)',
      skill: 'Cybertech',
      dv: 13,
      effect: 'Restaura HP equivalente al BODY del chasis tras 1 hora de trabajo de taller.'
    },
    {
      topic: 'Tratamiento de Herida Crítica Estructural',
      skill: 'Cybertech',
      dv: 15,
      effect: 'Repara servomotores dañados, articulaciones destrozadas o fugas hidráulicas.'
    },
    {
      topic: 'Extracción de Emergencia del Biopod',
      skill: 'Cybertech o First Aid',
      dv: 13,
      effect: 'Desacopla el Biopod de un chasis destruido antes de que la explosión dañe el cerebro.'
    }
  ],
  tacticalProsAndCons: {
    pros: [
      'Valores de BODY descomunales (BODY 10 a 16) sin necesidad de entrenamiento físico biológico.',
      'Inmunidad completa al sangrado, asfixia, toxinas y venenos callejeros.',
      'Capacidad de cambiar de chasis según la misión (espionaje, demolición, combate o diplomacia).',
      'Blindajes estructurales muy elevados instalados de serie.'
    ],
    cons: [
      'Pérdida de humanidad severa inicial al entrar al Biopod.',
      'Costes de reparación y mantenimiento en Eurodólares elevados.',
      'Vulnerabilidad aumentada al daño EMP y descargas eléctricas pesadas.',
      'No puede recibir tratamiento de First Aid biológico convencional en medio del tiroteo.'
    ]
  }
};
