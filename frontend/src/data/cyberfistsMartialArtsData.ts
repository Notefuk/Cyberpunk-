/**
 * CYBERFISTS OF FURY & CORE RULEBOOK // CATÁLOGO MAESTRO DE ARTES MARCIALES
 * 27 Formas de Artes Marciales (4 Core Rulebook + 23 Cyberfists of Fury / Interface RED Vol. 4)
 * 54 Movimientos Especiales de Combate Cuerpo a Cuerpo (8 Core + 46 Cyberfists of Fury)
 */

export interface MartialArtMove {
  id: string;
  name: string;
  formId: string;
  formName: string;
  isNewCyberfists: boolean;
  requirements: string;
  resolutionDv: number;
  damageBonusOrFormula?: string;
  effectDescription: string;
  criticalInjuryApplied?: string;
}

export interface MartialArtForm {
  id: string;
  name: string;
  sourceBook: 'core' | 'interface_red';
  badge: string;
  originAndFlavor: string;
  keyStats: string[];
  tacticalRole: string;
  moves: [MartialArtMove, MartialArtMove];
}

export const MARTIAL_ARTS_FORMS: MartialArtForm[] = [
  // ==========================================================================
  // CORE RULEBOOK (4 Formas Oficiales - 8 Movimientos Especiales)
  // ==========================================================================
  {
    id: 'aikido',
    name: 'Aikido',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    originAndFlavor: 'Arte marcial tradicional japonés basado en desviar el impulso y la fuerza del oponente para neutralizarlo sin esfuerzo bruto.',
    keyStats: ['DEX', 'WILL'],
    tacticalRole: 'Control de masa, desarmes defensivos y contraataques fluidos.',
    moves: [
      {
        id: 'aikido-iron-defense',
        name: 'Iron Defense',
        formId: 'aikido',
        formName: 'Aikido',
        isNewCyberfists: false,
        requirements: 'Debe haber esquivado exitosamente un ataque cuerpo a cuerpo este asalto.',
        resolutionDv: 15,
        effectDescription: 'Desvías la inercia del agresor desestabilizándolo. El objetivo sufre -2 a su próxima tirada de ataque y no puede usar acciones de movimiento hasta su siguiente turno.'
      },
      {
        id: 'aikido-joint-lock-throw',
        name: 'Joint Lock Throw',
        formId: 'aikido',
        formName: 'Aikido',
        isNewCyberfists: false,
        requirements: 'Debe tener al objetivo apresado (Grapple) o haber esquivado su golpe.',
        resolutionDv: 15,
        damageBonusOrFormula: 'Daño base de Brawling + 2d6 directo a HP',
        effectDescription: 'Proyectas al oponente contra el suelo o una estructura. Queda derribado (Prone) y sufre daño de caída/luxación ignorando el 50% de SP.',
        criticalInjuryApplied: 'Foreign Object / Whiplash'
      }
    ]
  },
  {
    id: 'karate',
    name: 'Karate',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    originAndFlavor: 'Estilo de impacto lineal centrado en golpes secos de mano abierta, puñetazos de nudillo duro y patadas devastadoras de ruptura.',
    keyStats: ['DEX', 'BODY'],
    tacticalRole: 'Perforación de blindajes densos y daño contundente bruto.',
    moves: [
      {
        id: 'karate-armor-breaking-strike',
        name: 'Armor Breaking Strike',
        formId: 'karate',
        formName: 'Karate',
        isNewCyberfists: false,
        requirements: 'Impactar 2 ataques de Artes Marciales exitosos en el mismo turno.',
        resolutionDv: 15,
        effectDescription: 'Un golpe focalizado de talón de mano contra la armadura. Ablaciona 2 puntos de SP adicionales en la localización impactada.'
      },
      {
        id: 'karate-flying-reverse-kick',
        name: 'Flying Reverse Kick',
        formId: 'karate',
        formName: 'Karate',
        isNewCyberfists: false,
        requirements: 'Moverse al menos 4 metros en línea recta hacia el objetivo antes del ataque.',
        resolutionDv: 17,
        damageBonusOrFormula: '+3d6 daño contundente',
        effectDescription: 'Patada giratoria con salto de máxima potencia. Si el daño supera el SP, el objetivo sale despedido 2 metros hacia atrás y cae derribado (Prone).'
      }
    ]
  },
  {
    id: 'judo',
    name: 'Judo',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    originAndFlavor: 'Especialidad en proyecciones de cadera, barridos de pierna y sumisiones implacables en el suelo.',
    keyStats: ['DEX', 'BODY'],
    tacticalRole: 'Derribos garantizados, control en el suelo y luxaciones severas.',
    moves: [
      {
        id: 'judo-hip-throw',
        name: 'Hip Throw (O-Goshi)',
        formId: 'judo',
        formName: 'Judo',
        isNewCyberfists: false,
        requirements: 'Tener una mano libre y estar adyacente a un enemigo.',
        resolutionDv: 15,
        damageBonusOrFormula: 'Daño de Artes Marciales completo ignorando armadura SP',
        effectDescription: 'Cargas al enemigo sobre tu centro de gravedad y lo estampas contra el asfalto. El objetivo queda derribado (Prone) y pierde 1 acción de movimiento.'
      },
      {
        id: 'judo-ground-grapple-lock',
        name: 'Ground Grapple Lock',
        formId: 'judo',
        formName: 'Judo',
        isNewCyberfists: false,
        requirements: 'El objetivo debe estar ya derribado (Prone) y en rango cuerpo a cuerpo.',
        resolutionDv: 16,
        effectDescription: 'Inmovilización total mediante palanca de brazo o cuello. El objetivo no puede levantarse ni disparar armas de dos manos hasta superar una tirada de Brawling vs tu tirada de Artes Marciales.'
      }
    ]
  },
  {
    id: 'taekwondo',
    name: 'Taekwondo',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    originAndFlavor: 'Estilo coreano caracterizado por acrobacias dinámicas, patadas giratorias altas y combinaciones rápidas de extremidades inferiores.',
    keyStats: ['DEX', 'MOVE'],
    tacticalRole: 'Ataques rápidos a distancia de paso, patadas a la cabeza y combos ágiles.',
    moves: [
      {
        id: 'tkd-spinning-back-kick',
        name: 'Spinning Back Kick',
        formId: 'taekwondo',
        formName: 'Taekwondo',
        isNewCyberfists: false,
        requirements: 'Haber conectado un ataque previo en este turno.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño a la cabeza o torso',
        effectDescription: 'Giro veloz de talón que impacta con violencia. Si impacta en la cabeza, ignora el penalizador de disparo apuntado habitual (-8 a 0).'
      },
      {
        id: 'tkd-tornado-kick-combo',
        name: 'Tornado Kick Combo',
        formId: 'taekwondo',
        formName: 'Taekwondo',
        isNewCyberfists: false,
        requirements: 'MOVE 6+ y espacio despejado de al menos 2 metros.',
        resolutionDv: 17,
        damageBonusOrFormula: 'Aplica daño completo a 2 enemigos adyacentes',
        effectDescription: 'Salto circular con barrido aéreo que golpea a dos objetivos distintos adyacentes en una sola acción de ataque.'
      }
    ]
  },

  // ==========================================================================
  // CYBERFISTS OF FURY (23 Nuevas Formas - 46 Movimientos Especiales)
  // Interface RED Vol. 4
  // ==========================================================================
  {
    id: 'animal-kung-fu',
    name: 'Animal Kung Fu',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Estilo tradicional mimético de los cinco animales (Tigre, Grulla, Leopardo, Serpiente, Dragón) adaptado con garras cibernéticas y reflejos potenciados.',
    keyStats: ['DEX', 'REF'],
    tacticalRole: 'Ataques lacerantes continuos y cambios impredecibles de postura.',
    moves: [
      {
        id: 'akf-tiger-claw-shred',
        name: 'Tiger Claw Shred',
        formId: 'animal-kung-fu',
        formName: 'Animal Kung Fu',
        isNewCyberfists: true,
        requirements: 'Impactar 2 ataques con garras, cuchillas o manos desnudas en el mismo turno.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño cortante lacerante',
        effectDescription: 'Zarpazo profundo que desgarra tejidos blandos y conexiones cibernéticas. Provoca que el enemigo comience a sangrar profusamente (-2 HP por asalto hasta recibir Primeros Auxilios).',
        criticalInjuryApplied: 'Torn Muscle'
      },
      {
        id: 'akf-crane-peck-counter',
        name: 'Crane Peck Counter',
        formId: 'animal-kung-fu',
        formName: 'Animal Kung Fu',
        isNewCyberfists: true,
        requirements: 'Esquivar exitosamente un ataque cuerpo a cuerpo de un enemigo en este asalto.',
        resolutionDv: 16,
        damageBonusOrFormula: 'Daño base + impacto directo a ojos/sensores',
        effectDescription: 'Picotazo fulgurante con los dedos agrupados dirigido a las cuencas oculares u ópticas del agresor. El objetivo queda cegado temporalmente (-4 a todas las acciones durante 1 asalto).'
      }
    ]
  },
  {
    id: 'arasakate',
    name: 'ArasakaTe',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Doctrina de combate marcial ultracorporativo diseñada por Arasaka Security para sus guardaespaldas de élite y fuerzas especiales.',
    keyStats: ['REF', 'WILL'],
    tacticalRole: 'Ejecuciones quirúrgicas, contra-netrunning físico y protección de VIPS.',
    moves: [
      {
        id: 'arasakate-corporate-execution',
        name: 'Corporate Execution Strike',
        formId: 'arasakate',
        formName: 'ArasakaTe',
        isNewCyberfists: true,
        requirements: 'Objetivo sorprendido o sufriendo una condición negativa.',
        resolutionDv: 16,
        damageBonusOrFormula: '+3d6 daño perforante a puntos vitales',
        effectDescription: 'Golpe seco con la base de la palma reforzada dirigido a la base del cráneo o caja torácica. Duplica el daño que supere la armadura SP.'
      },
      {
        id: 'arasakate-neural-disruption',
        name: 'Neural Disruption Jab',
        formId: 'arasakate',
        formName: 'ArasakaTe',
        isNewCyberfists: true,
        requirements: 'El objetivo debe poseer Neuralware o Cyberware en cabeza/torso.',
        resolutionDv: 15,
        effectDescription: 'Impacto electro-cinético en el plexo solar que genera interferencia nerviosa. Si impacta, el objetivo pierde 2 puntos de Interfaz/RAM o sufre -2 REF durante 2 asaltos.'
      }
    ]
  },
  {
    id: 'boxing',
    name: 'Boxing',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'El noble arte de las doce cuerdas destilado en los bajos fondos: jab cortante, ganchos pesados al hígado y directos implacables.',
    keyStats: ['BODY', 'DEX'],
    tacticalRole: 'Castigo implacable al cuerpo, noqueos y control de distancia corta.',
    moves: [
      {
        id: 'boxing-liver-hook',
        name: 'Liver Hook (Gancho al Hígado)',
        formId: 'boxing',
        formName: 'Boxing',
        isNewCyberfists: true,
        requirements: 'Impactar un ataque de puño al torso en rango cuerpo a cuerpo.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño contundente interno',
        effectDescription: 'Impacto devastador que comprime los órganos internos. El defensor debe superar un chequeo de Resist Torture/Drugs DV 15 o quedar aturdido (Stunned) perdiendo su siguiente acción.',
        criticalInjuryApplied: 'Collapsed Lung'
      },
      {
        id: 'boxing-counter-cross',
        name: 'Counter Cross (Directo de Contra)',
        formId: 'boxing',
        formName: 'Boxing',
        isNewCyberfists: true,
        requirements: 'Esquivar un ataque entrante por 3 o más puntos de margen.',
        resolutionDv: 16,
        damageBonusOrFormula: '+3d6 daño a la cabeza',
        effectDescription: 'Aprovechas el desbalanceo del atacante para clavar un derechazo en la mandíbula. Si supera el SP, fuerza tirada de salvación de muerte inmediata o noqueo inmediato.'
      }
    ]
  },
  {
    id: 'capoeira',
    name: 'Capoeira',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Danza y combate afrobrasileño con movimientos acrobáticos en ginga, patadas invertidas y constante movilidad de suelo.',
    keyStats: ['DEX', 'MOVE'],
    tacticalRole: 'Evasión constante mientras se inflige daño periférico.',
    moves: [
      {
        id: 'capoeira-meia-lua-de-compasso',
        name: 'Meia Lua de Compasso',
        formId: 'capoeira',
        formName: 'Capoeira',
        isNewCyberfists: true,
        requirements: 'MOVE 6+ y realizar una finta previa.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño de talón giratorio',
        effectDescription: 'Apoyas una o ambas manos en el suelo y lanzas un talón curvo a la cabeza del oponente. Otorga +2 a tu tirada de Evasión hasta el final de la ronda.'
      },
      {
        id: 'capoeira-ginga-sweep',
        name: 'Rasteira Ginga Sweep',
        formId: 'capoeira',
        formName: 'Capoeira',
        isNewCyberfists: true,
        requirements: 'Estar adyacente a uno o dos enemigos.',
        resolutionDv: 15,
        effectDescription: 'Barrido bajo en semicírculo que engancha los tobillos del adversario. Todos los enemigos adyacentes caen al suelo derribados (Prone) si no superan DEX + Athletics vs tu tirada.'
      }
    ]
  },
  {
    id: 'chornobogs-kommando',
    name: 'Chornobog’s Kommando',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Estilo brutal desarrollado por tropas especiales sov-oil en la Zona de Exclusión: combate salvaje con bayonetas, culatazos y cuchillos pesados.',
    keyStats: ['BODY', 'WILL'],
    tacticalRole: 'Supervivencia extrema, combate con armas improvisadas y aplastamiento.',
    moves: [
      {
        id: 'chornobog-trench-cleaver',
        name: 'Trench Cleaver Bash',
        formId: 'chornobogs-kommando',
        formName: 'Chornobog’s Kommando',
        isNewCyberfists: true,
        requirements: 'Empuñar un arma cuerpo a cuerpo pesada o culata de fusil.',
        resolutionDv: 15,
        damageBonusOrFormula: '+3d6 daño de fractura ósea',
        effectDescription: 'Golpe seco descendente a la clavícula o esternón. Rompe armaduras ligeras (ablaciona 3 SP de golpe) y deja al enemigo sin respiración.'
      },
      {
        id: 'chornobog-radiation-gut-rip',
        name: 'Reactor Gut Rip',
        formId: 'chornobogs-kommando',
        formName: 'Chornobog’s Kommando',
        isNewCyberfists: true,
        requirements: 'Tener al enemigo en presa (Grapple).',
        resolutionDv: 16,
        damageBonusOrFormula: 'Daño de arma cuerpo a cuerpo + 2d6 directo a HP',
        effectDescription: 'Apuñalas repetidamente en el abdomen o desgarres con filo serrado mientras mantienes al objetivo como escudo humano frente a otros disparos.'
      }
    ]
  },
  {
    id: 'cyber-wrestling',
    name: 'Cyber-Wrestling',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Lucha libre hipertecnológica con implantes hidráulicos, marcos lineales y acrobacias de alto impacto desde el ring subterráneo.',
    keyStats: ['BODY', 'DEX'],
    tacticalRole: 'Lanzamientos de alto impacto, suplex contra vehículos y aplastamientos.',
    moves: [
      {
        id: 'cyberwrestling-hydraulic-suplex',
        name: 'Hydraulic German Suplex',
        formId: 'cyber-wrestling',
        formName: 'Cyber-Wrestling',
        isNewCyberfists: true,
        requirements: 'BODY 8+ (o Linear Frame) y agarrar por la espalda.',
        resolutionDv: 16,
        damageBonusOrFormula: '4d6 daño por impacto contra el asfalto',
        effectDescription: 'Levantas al rival por la cintura y te arqueas hacia atrás estrellando su cuello y hombros contra el suelo. Aplica Herida Crítica inmediata en la cabeza/cuello.',
        criticalInjuryApplied: 'Spinal Injury'
      },
      {
        id: 'cyberwrestling-meat-piledriver',
        name: 'Piledriver Destructor',
        formId: 'cyber-wrestling',
        formName: 'Cyber-Wrestling',
        isNewCyberfists: true,
        requirements: 'Presa activa en el turno anterior.',
        resolutionDv: 17,
        damageBonusOrFormula: '5d6 daño contundente vertical',
        effectDescription: 'Inviertes verticalmente al oponente y caes de rodillas incrustando su cabeza en el suelo. Ignora el 50% del SP del blindaje corporal del defensor.'
      }
    ]
  },
  {
    id: 'drunken-fist',
    name: 'Drunken Fist (Zui Quan)',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'El mítico boxeo del borracho adaptado al ciberespacio: tambaleos intencionados, quiebres de cintura imposibles y golpes desde ángulos ciegos.',
    keyStats: ['REF', 'DEX'],
    tacticalRole: 'Engaño constante, evasión errática y ataques desde posturas falsas.',
    moves: [
      {
        id: 'drunken-stagger-feint',
        name: 'Staggering Sway Feint',
        formId: 'drunken-fist',
        formName: 'Drunken Fist',
        isNewCyberfists: true,
        requirements: 'Tirada exitosa de Streetwise o Deceit vs Concentración del enemigo.',
        resolutionDv: 14,
        effectDescription: 'Te tambaleas fingiendo perder el equilibrio. El próximo ataque que realices este turno ignora la habilidad de Evasión del enemigo (su DV es pasivo 10).'
      },
      {
        id: 'drunken-wine-pot-strike',
        name: 'Wine Pot Jaw Cracker',
        formId: 'drunken-fist',
        formName: 'Drunken Fist',
        isNewCyberfists: true,
        requirements: 'Moverse en zigzag durante el asalto.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño contundente imprevisto',
        effectDescription: 'Un revés ascendente con nudillos semicerrados que impacta por debajo de la guardia. Provoca desorientación sensorial (-2 a las tiradas de REF durante 2 asaltos).'
      }
    ]
  },
  {
    id: 'gun-fu',
    name: 'Gun Fu',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'La letal síntesis de artes marciales cuerpo a cuerpo con pistolas semiautomáticas a quemarropa popularizada en el cine de acción de Hong Kong y Night City.',
    keyStats: ['REF', 'DEX'],
    tacticalRole: 'Transición fluida entre disparos a quemarropa y bloqueos de cañón.',
    moves: [
      {
        id: 'gunfu-point-blank-clearing',
        name: 'Point Blank Execution',
        formId: 'gun-fu',
        formName: 'Gun Fu',
        isNewCyberfists: true,
        requirements: 'Empuñar una pistola o revólver en rango cuerpo a cuerpo (0-2m).',
        resolutionDv: 15,
        damageBonusOrFormula: 'Daño de pistola estándar + 1d6 daño de Artes Marciales',
        effectDescription: 'Desvías el arma del rival con tu antebrazo y disparas tu pistola directamente contra su abdomen a quemarropa ignorando el penalizador de disparo en melé.'
      },
      {
        id: 'gunfu-barrel-strike-disarm',
        name: 'Pistol-Whip Disarm',
        formId: 'gun-fu',
        formName: 'Gun Fu',
        isNewCyberfists: true,
        requirements: 'Estar adyacente a un enemigo que empuñe un arma de fuego.',
        resolutionDv: 16,
        effectDescription: 'Golpeas la mano del enemigo con la culata o cañón de tu arma y arrebatas su arma con un giro de muñeca. El arma cae al suelo o queda en tu mano libre.'
      }
    ]
  },
  {
    id: 'hapkido',
    name: 'Hapkido',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Arte marcial coreano centrado en manipular articulaciones pequeñas (muñecas, dedos), patadas circulares y control de agresores armados.',
    keyStats: ['DEX', 'WILL'],
    tacticalRole: 'Neutralización sin letalidad obligatoria y desarticulación de extremidades.',
    moves: [
      {
        id: 'hapkido-wrist-lock-snap',
        name: 'Wrist Lock Fracture',
        formId: 'hapkido',
        formName: 'Hapkido',
        isNewCyberfists: true,
        requirements: 'Haber bloqueado o esquivado un ataque de puño o cuchillo.',
        resolutionDv: 15,
        damageBonusOrFormula: 'Daño base de Brawling directo a HP',
        effectDescription: 'Torsión hiperbólica de muñeca. El enemigo suelta cualquier arma sostenida en esa mano y no puede usar dicha extremidad hasta ser tratada.',
        criticalInjuryApplied: 'Broken Arm'
      },
      {
        id: 'hapkido-circular-redirection',
        name: 'Circular Redirection Strike',
        formId: 'hapkido',
        formName: 'Hapkido',
        isNewCyberfists: true,
        requirements: 'Atacado por múltiples enemigos adyacentes.',
        resolutionDv: 16,
        effectDescription: 'Atrapas el brazo del primer atacante y usas su cuerpo para bloquear la línea de fuego o ataque de un segundo agresor adyacente.'
      }
    ]
  },
  {
    id: 'jeet-kune-do',
    name: 'Jeet Kune Do',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'El camino del puño interceptor de Bruce Lee: economía de movimiento, golpe directo sin telegrafiar y ataque simultáneo a la defensa.',
    keyStats: ['REF', 'DEX'],
    tacticalRole: 'Intercepción en carrera, ataques simultáneos y velocidad reactiva.',
    moves: [
      {
        id: 'jkd-intercepting-fist',
        name: 'Stop-Hit (Puño Interceptor)',
        formId: 'jeet-kune-do',
        formName: 'Jeet Kune Do',
        isNewCyberfists: true,
        requirements: 'Declarado en respuesta al ataque de un oponente.',
        resolutionDv: 16,
        damageBonusOrFormula: '+2d6 daño de impacto directo',
        effectDescription: 'Golpeas al oponente en el mismo instante en que inicia su golpe, conectando milésimas de segundo antes gracias a la línea central recta. Si impactas, cancelas su ataque.'
      },
      {
        id: 'jkd-one-inch-punch',
        name: 'One-Inch Kinetic Punch',
        formId: 'jeet-kune-do',
        formName: 'Jeet Kune Do',
        isNewCyberfists: true,
        requirements: 'Contacto físico cuerpo a cuerpo sin espacio de retroceso.',
        resolutionDv: 17,
        damageBonusOrFormula: '+3d6 daño cinético concentrado',
        effectDescription: 'Descarga instantánea de energía explosiva desde la cadera con apenas 2.5 cm de recorrido. El enemigo sale despedido 3 metros hacia atrás y cae derribado (Prone).'
      }
    ]
  },
  {
    id: 'jiu-jitsu',
    name: 'Jiu-Jitsu (BJJ)',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Combate en el suelo revolucionario basado en palancas mecánicas, estrangulaciones sanguíneas y pasajes de guardia técnica.',
    keyStats: ['DEX', 'BODY'],
    tacticalRole: 'Sumisión de enemigos superiores en peso y neutralización por estrangulamiento.',
    moves: [
      {
        id: 'bjj-triangle-choke',
        name: 'Triangle Choke (Sankaku-Jime)',
        formId: 'jiu-jitsu',
        formName: 'Jiu-Jitsu',
        isNewCyberfists: true,
        requirements: 'Enemigo en rango cuerpo a cuerpo o en el suelo.',
        resolutionDv: 15,
        damageBonusOrFormula: 'Daño igual a tu BODY * 2 directo a HP (ignora armadura SP)',
        effectDescription: 'Cierras tus piernas alrededor de su cuello y un brazo atrapando la arteria carótida. El oponente se desmaya en 2 asaltos a menos que escape con una tirada de Brawling.'
      },
      {
        id: 'bjj-armbar-hyper-extension',
        name: 'Kimura / Armbar Destruction',
        formId: 'jiu-jitsu',
        formName: 'Jiu-Jitsu',
        isNewCyberfists: true,
        requirements: 'Presa exitosa en asalto anterior.',
        resolutionDv: 16,
        damageBonusOrFormula: '+3d6 daño directo a la extremidad',
        effectDescription: 'Palanca sobre el codo o articulación del hombro. Si penetra armadura, destruye el brazo biológico o desarticula los servos del cyberbrazo.',
        criticalInjuryApplied: 'Dismembered Arm'
      }
    ]
  },
  {
    id: 'krav-maga',
    name: 'Krav Maga',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Sistema de defensa militar táctica: agresión simultánea, ataques a ojos, garganta e ingle, y eliminación fulgurante de amenazas armadas.',
    keyStats: ['REF', 'BODY'],
    tacticalRole: 'Violencia táctica brutal sin reglas deportivas y desarme rápido de cuchillos/pistolas.',
    moves: [
      {
        id: 'kravmaga-throat-crush',
        name: 'Trachea Strike (Aplastamiento Traqueal)',
        formId: 'krav-maga',
        formName: 'Krav Maga',
        isNewCyberfists: true,
        requirements: 'Ataque apuntado a la cabeza sin penalizador.',
        resolutionDv: 16,
        damageBonusOrFormula: '+2d6 daño directo a HP',
        effectDescription: 'Impacto con el borde de la mano o pulgar en la tráquea. El objetivo queda sin aire (Suffocating), sufriendo daño continuo por asfixia si no es asistido.',
        criticalInjuryApplied: 'Crushed Windpipe'
      },
      {
        id: 'kravmaga-groin-kick-disarm',
        name: 'Groin Shatter & Weapon Strip',
        formId: 'krav-maga',
        formName: 'Krav Maga',
        isNewCyberfists: true,
        requirements: 'Rango cuerpo a cuerpo inmediato.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño contundente',
        effectDescription: 'Patada fulminante a la ingle seguida de palanca desarmadora. El oponente queda de rodillas doblado por el dolor y suelta cualquier arma que sostenga.'
      }
    ]
  },
  {
    id: 'lethwei',
    name: 'Lethwei',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'El arte birmano de las nueve extremidades: puños, codos, rodillas, pies y el temible cabezazo sin guantes.',
    keyStats: ['BODY', 'WILL'],
    tacticalRole: 'Cabezazos demoledores, combate en clinch salvaje y tenacidad extrema.',
    moves: [
      {
        id: 'lethwei-skull-ram-headbutt',
        name: 'Burmese Skull Ram (Cabezazo Letal)',
        formId: 'lethwei',
        formName: 'Lethwei',
        isNewCyberfists: true,
        requirements: 'Estar trabado en clinch o a menos de 1 metro.',
        resolutionDv: 15,
        damageBonusOrFormula: '+3d6 daño contundente a la cabeza',
        effectDescription: 'Cabezazo frontal con la zona más gruesa de la frente al tabique nasal del rival. Si tienes cráneo reforzado o Subdermal Armor, causa conmoción cerebral instantánea.',
        criticalInjuryApplied: 'Concussion'
      },
      {
        id: 'lethwei-clinch-knee-barrage',
        name: 'Clinch Rib-Cracker Knee',
        formId: 'lethwei',
        formName: 'Lethwei',
        isNewCyberfists: true,
        requirements: 'Control del cuello del rival con dos manos.',
        resolutionDv: 16,
        damageBonusOrFormula: '+3d6 daño a las costillas',
        effectDescription: 'Rodillazo ascendente al costado del torso. Quiebra costillas y ablaciona 2 puntos de armadura corporal SP.',
        criticalInjuryApplied: 'Broken Ribs'
      }
    ]
  },
  {
    id: 'militech-cqc',
    name: 'Militech CQC',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Protocolo de combate cerrado estándar de los contratistas militares de Militech para limpiar habitaciones y neutralizar insurgentes.',
    keyStats: ['REF', 'BODY'],
    tacticalRole: 'Uso de escudos balísticos, derribos de choque y remates tácticos.',
    moves: [
      {
        id: 'militechcqc-shield-bash-stagger',
        name: 'Tactical Shield Ram',
        formId: 'militech-cqc',
        formName: 'Militech CQC',
        isNewCyberfists: true,
        requirements: 'Empuñar un Escudo Antibalas o Cyberarm reforzado.',
        resolutionDv: 14,
        damageBonusOrFormula: '2d6 daño contundente + derribo',
        effectDescription: 'Embestida con el escudo antibalas. El objetivo retrocede 3 metros y queda desbalanceado perdiendo su turno de iniciativa en la ronda.'
      },
      {
        id: 'militechcqc-room-clearing-takedown',
        name: 'Door-Breaker Takedown',
        formId: 'militech-cqc',
        formName: 'Militech CQC',
        isNewCyberfists: true,
        requirements: 'Objetivo adyacente a una pared, puerta o cobertura.',
        resolutionDv: 16,
        damageBonusOrFormula: '+3d6 daño por impacto contra la superficie',
        effectDescription: 'Estrellas la cabeza o espalda del sospechoso contra la pared o marco de la puerta. Destruye la cobertura ligera y noquea al defensor si supera su SP.'
      }
    ]
  },
  {
    id: 'muay-thai',
    name: 'Muay Thai',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'El arte de las ocho extremidades tailandés: temibles patadas de tibia al nervio ciático, codazos cortantes y rodillazos en salto.',
    keyStats: ['BODY', 'DEX'],
    tacticalRole: 'Destrucción de movilidad enemiga con patadas bajas y cortes de codo.',
    moves: [
      {
        id: 'muaythai-spinning-elbow-slash',
        name: 'Spinning Horizontal Elbow',
        formId: 'muay-thai',
        formName: 'Muay Thai',
        isNewCyberfists: true,
        requirements: 'Rango cuerpo a cuerpo (0-1m).',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño cortante a la cabeza',
        effectDescription: 'Codo giratorio que abre una brecha en la frente o ceja del rival. La sangre nubla su visión provocando un penalizador de -2 a sus tiradas de ataque.',
        criticalInjuryApplied: 'Damaged Eye'
      },
      {
        id: 'muaythai-low-shin-chop',
        name: 'Low Leg-Kick Destruction',
        formId: 'muay-thai',
        formName: 'Muay Thai',
        isNewCyberfists: true,
        requirements: 'Impactar 2 patadas bajas continuas.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño a las piernas',
        effectDescription: 'Machete de tibia contra el muslo o nervio ciático. El objetivo sufre una reducción permanente de -2 a su estadística MOVE durante todo el combate.',
        criticalInjuryApplied: 'Broken Leg'
      }
    ]
  },
  {
    id: 'ninjutsu',
    name: 'Ninjutsu',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Método histórico de sigilo, engaño sensorial, estrangulación silenciosa y asesinato encubierto de los shinobi.',
    keyStats: ['DEX', 'COOL'],
    tacticalRole: 'Eliminaciones silenciosas desde las sombras y bombas de humo/distracción.',
    moves: [
      {
        id: 'ninjutsu-shadow-choke',
        name: 'Silent Garrote Takedown',
        formId: 'ninjutsu',
        formName: 'Ninjutsu',
        isNewCyberfists: true,
        requirements: 'Atacar desde Sigilo (Stealth) sin ser detectado.',
        resolutionDv: 16,
        damageBonusOrFormula: 'Daño triple de Brawling ignorando armadura SP',
        effectDescription: 'Ataque por la espalda atrapando las cuerdas vocales. El objetivo no puede gritar ni alertar a sus aliados y queda neutralizado silenciosamente.'
      },
      {
        id: 'ninjutsu-smoke-vanish-strike',
        name: 'Smoke Vanish Feint',
        formId: 'ninjutsu',
        formName: 'Ninjutsu',
        isNewCyberfists: true,
        requirements: 'Tener una granada de humo o distractora disponible.',
        resolutionDv: 14,
        effectDescription: 'Detonas una pequeña cápsula de humo y cambias de ángulo al instante. Realizas un ataque con bonificación de +3 y puedes reingresar a Sigilo inmediatamente.'
      }
    ]
  },
  {
    id: 'panzerfaust',
    name: 'PanzerFaust',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Estilo de combate para cyborgs y supersoldados con implantes de cromo pesado: golpes de pistón neumático y aplastamiento de armaduras pesadas.',
    keyStats: ['BODY', 'TECH'],
    tacticalRole: 'Aplastamiento de chasis blindados, daño a vehículos y shock destructivo.',
    moves: [
      {
        id: 'panzerfaust-piston-strike',
        name: 'Pneumatic Hammer Strike',
        formId: 'panzerfaust',
        formName: 'PanzerFaust',
        isNewCyberfists: true,
        requirements: 'BODY 11+ o ciberbrazo con actuador hidráulico.',
        resolutionDv: 16,
        damageBonusOrFormula: '+4d6 daño contundente puro',
        effectDescription: 'Descarga un puñetazo con fuerza de prensa industrial. Destruye 4 puntos de SP de cualquier blindaje o reduce el SDP de un vehículo en 10 puntos.'
      },
      {
        id: 'panzerfaust-kinetic-ground-slam',
        name: 'Seismic Shockwave Slam',
        formId: 'panzerfaust',
        formName: 'PanzerFaust',
        isNewCyberfists: true,
        requirements: 'Dos ciberbrazos instalados o Linear Frame activo.',
        resolutionDv: 17,
        effectDescription: 'Golpeas el suelo con ambos puños canalizando fuerza hidráulica masiva. Todas las criaturas a 3 metros deben superar DEX + Athletics DV 16 o caer derribadas.'
      }
    ]
  },
  {
    id: 'savate',
    name: 'Savate',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'El boxeo francés con botas de punta dura desarrollado por marineros y pandilleros de Marsella y París: patadas de filo y estocadas de talón.',
    keyStats: ['DEX', 'REF'],
    tacticalRole: 'Golpes de filo de bota a distancia segura y ataques a las articulaciones bajas.',
    moves: [
      {
        id: 'savate-chasse-talon-thrust',
        name: 'Chassé Frontal Thrust',
        formId: 'savate',
        formName: 'Savate',
        isNewCyberfists: true,
        requirements: 'Rango de 2 metros con calzado reforzado o Cyberleg.',
        resolutionDv: 14,
        damageBonusOrFormula: '+2d6 daño perforante',
        effectDescription: 'Estocada de talón en pistón al esternón o cadera. Empuja al rival 2 metros hacia atrás manteniéndolo fuera de distancia de armas de corto alcance.'
      },
      {
        id: 'savate-fouette-shin-snap',
        name: 'Fouetté Knee Buckle',
        formId: 'savate',
        formName: 'Savate',
        isNewCyberfists: true,
        requirements: 'Haber realizado una finta con las manos.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño a la rodilla',
        effectDescription: 'Patada de látigo con la punta de la bota impactando en la rótula. Deja la rodilla hiperextendida reduciendo a la mitad el movimiento del enemigo.'
      }
    ]
  },
  {
    id: 'silat',
    name: 'Silat (Pencak Silat)',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Arte marcial indonesio con movimientos fluidos, uso magistral del cuchillo Karambit curvo y desmembramiento rápido de articulaciones.',
    keyStats: ['DEX', 'REF'],
    tacticalRole: 'Laceraciones con hojas curvas, derribos enmarañados y lucha en corta distancia.',
    moves: [
      {
        id: 'silat-karambit-tendon-hook',
        name: 'Karambit Tendon Hook',
        formId: 'silat',
        formName: 'Silat',
        isNewCyberfists: true,
        requirements: 'Empuñar un cuchillo curvo o cuchillas retráctiles.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño cortante',
        effectDescription: 'Enganchas la hoja curva detrás del tendón de Aquiles o bíceps y tiras con violencia. Inutiliza la extremidad impactada provocando sangrado continuo.',
        criticalInjuryApplied: 'Torn Muscle'
      },
      {
        id: 'silat-low-sweeping-harimau',
        name: 'Harimau Tiger Takedown',
        formId: 'silat',
        formName: 'Silat',
        isNewCyberfists: true,
        requirements: 'Atacar agachado o desde el suelo.',
        resolutionDv: 16,
        effectDescription: 'Enroscas tus piernas alrededor de los tobillos del enemigo y giras tu tronco como un tornillo. El objetivo es proyectado violentamente contra el suelo.'
      }
    ]
  },
  {
    id: 'sumo',
    name: 'Sumo',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'La ancestral lucha de peso pesada japonesa: empujes explosivos con las palmas abiertas (harite), anclaje inamovible al suelo y embestidas.',
    keyStats: ['BODY', 'WILL'],
    tacticalRole: 'Inmunidad al derribo, control de esquinas y desalojo de coberturas.',
    moves: [
      {
        id: 'sumo-harite-palm-blast',
        name: 'Harite Palm Slap Barrage',
        formId: 'sumo',
        formName: 'Sumo',
        isNewCyberfists: true,
        requirements: 'BODY 8+ y embestida frontal.',
        resolutionDv: 15,
        damageBonusOrFormula: '+3d6 daño contundente a la cabeza/pecho',
        effectDescription: 'Bofetada abierta de palma masiva en la mandíbula del oponente. El objetivo queda desorientado con pérdida de equilibrio (-3 a la Evasión durante 1 asalto).'
      },
      {
        id: 'sumo-ring-out-charge',
        name: 'Tsuppari Ring-Out Charge',
        formId: 'sumo',
        formName: 'Sumo',
        isNewCyberfists: true,
        requirements: 'Moverse al menos 3 metros hacia el enemigo.',
        resolutionDv: 16,
        effectDescription: 'Cargas con todo el peso de tu chasis contra el oponente. Lo desplazas 4 metros en línea recta y lo expulsas de su cobertura o a través de barandillas y ventanas.'
      }
    ]
  },
  {
    id: 'systema',
    name: 'Systema',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Arte marcial ruso basado en la relajación muscular continua, absorción de energía de impactos y golpes bio-mecánicos de onda interna.',
    keyStats: ['WILL', 'DEX'],
    tacticalRole: 'Absorción de daño cinético y disipación de golpes contundentes.',
    moves: [
      {
        id: 'systema-kinetic-wave-strike',
        name: 'Heavy Kinetic Wave Punch',
        formId: 'systema',
        formName: 'Systema',
        isNewCyberfists: true,
        requirements: 'Permanecer relajado sin haber corrido este turno.',
        resolutionDv: 15,
        damageBonusOrFormula: '+2d6 daño interno ignorando 50% de SP',
        effectDescription: 'Golpe de puño con respiración controlada que transmite una onda expansiva a los órganos internos del objetivo sin necesidad de fuerza bruta externa.'
      },
      {
        id: 'systema-fluid-impact-absorption',
        name: 'Fluid Shock Absorption',
        formId: 'systema',
        formName: 'Systema',
        isNewCyberfists: true,
        requirements: 'Recibir un impacto cuerpo a cuerpo en este asalto.',
        resolutionDv: 14,
        effectDescription: 'Disipas la inercia del golpe girando con el impacto. Reduces el daño recibido a la mitad y rediriges la energía en un contraataque inmediato gratuito.'
      }
    ]
  },
  {
    id: 'thrash-sambo',
    name: 'Thrash Sambo',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'Evolución salvaje del Sambo militar soviético mezclada con la anarquía del rock pesado callejero: llaves destructivas de talón, derribos y rodillazos.',
    keyStats: ['BODY', 'REF'],
    tacticalRole: 'Destrucción de articulaciones inferiores y agresividad caótica.',
    moves: [
      {
        id: 'thrashsambo-heel-hook-shred',
        name: 'Combat Heel Hook (Llave de Talón Rusa)',
        formId: 'thrash-sambo',
        formName: 'Thrash Sambo',
        isNewCyberfists: true,
        requirements: 'Enemigo en el suelo o adyacente a tus piernas.',
        resolutionDv: 16,
        damageBonusOrFormula: '+3d6 daño directo a la rodilla/tobillo',
        effectDescription: 'Torsión hiperbólica del talón y ligamentos cruzados. Si penetra SP, destroza la rodilla del oponente dejándolo incapacitado para caminar.',
        criticalInjuryApplied: 'Broken Leg'
      },
      {
        id: 'thrashsambo-head-spike-throw',
        name: 'Fireman’s Head Spike',
        formId: 'thrash-sambo',
        formName: 'Thrash Sambo',
        isNewCyberfists: true,
        requirements: 'Presa activa en el tren superior.',
        resolutionDv: 15,
        damageBonusOrFormula: '+3d6 daño de impacto de cráneo',
        effectDescription: 'Levantas al rival sobre tus hombros en un agarre de bombero y lo clavas de cabeza contra el suelo o una superficie sólida. Aplica Concussion inmediata.',
        criticalInjuryApplied: 'Concussion'
      }
    ]
  },
  {
    id: 'wrestling',
    name: 'Wrestling (Lucha Grecorromana / Libre)',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    originAndFlavor: 'El deporte de combate más antiguo de la humanidad: control del centro de masa, derribos de doble pierna y sujeción inquebrantable.',
    keyStats: ['BODY', 'DEX'],
    tacticalRole: 'Derribos de doble pierna garantizados y control absoluto de masa corporal.',
    moves: [
      {
        id: 'wrestling-double-leg-blast',
        name: 'Blast Double Leg Takedown',
        formId: 'wrestling',
        formName: 'Wrestling',
        isNewCyberfists: true,
        requirements: 'Cargar hacia el oponente desde al menos 2 metros.',
        resolutionDv: 15,
        damageBonusOrFormula: 'Daño de Brawling + derribo forzado',
        effectDescription: 'Penetras por debajo de la cadera del oponente, atrapas ambas piernas por detrás de las rodillas y embistes con tu hombro en su estómago proyectándolo contra el suelo.'
      },
      {
        id: 'wrestling-gut-wrench-turn',
        name: 'Gut Wrench Slam',
        formId: 'wrestling',
        formName: 'Wrestling',
        isNewCyberfists: true,
        requirements: 'El objetivo debe estar en el suelo (Prone).',
        resolutionDv: 16,
        damageBonusOrFormula: '+3d6 daño lumbar directo',
        effectDescription: 'Abrazas la cintura del rival caído, lo levantas horizontalmente y lo azotas contra el suelo. El rival queda sin aire y no puede levantarse durante 1 asalto.'
      }
    ]
  }
];

// Arreglo plano con los 54 movimientos para búsqueda, filtrado y disparo táctico directo en el HUD de Combate
export const ALL_MARTIAL_ART_MOVES: MartialArtMove[] = MARTIAL_ARTS_FORMS.flatMap(form => form.moves);
