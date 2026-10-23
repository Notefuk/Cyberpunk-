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
  /** true: se resuelve contra DEX + Evasion + 1d10 del defensor en vez de un DV fijo (Core p. 178). */
  isOpposed?: boolean;
  opposedBy?: string; // Contra qué se enfrenta si isOpposed (por defecto DEX + Evasion)
  sourcePage?: number;
  damageBonusOrFormula?: string;
  effectDescription: string;
  criticalInjuryApplied?: string;
}

export interface MartialArtForm {
  id: string;
  name: string;
  sourceBook: 'core' | 'interface_red';
  badge: string;
  sourcePage?: number;
  originAndFlavor: string;
  /** DEX para tirar + STATs que piden sus movimientos (decisión 45). */
  keyStats: string[];
  tacticalRole: string;
  moves: [MartialArtMove, MartialArtMove];
}

// Core p. 179: Shared Special Move que puede usar cualquier forma.
export const SHARED_MARTIAL_ARTS_MOVES: MartialArtMove[] = [
  {
    id: 'shared-recovery',
    name: 'Recovery',
    formId: 'shared',
    formName: 'Todas las formas',
    isNewCyberfists: false,
    requirements: 'Sin requisito. Al usar la Acción Get Up.',
    resolutionDv: 13,
    sourcePage: 179,
    effectDescription: 'Si superas DV 13 con la resolución de Special Move, esa Acción Get Up no cuesta una Acción (Core p. 179).'
  }
];

export const MARTIAL_ARTS_FORMS: MartialArtForm[] = [
  // ==========================================================================
  // CORE RULEBOOK (4 Formas Oficiales - 8 Movimientos Especiales)
  // ==========================================================================
  {
    id: 'aikido',
    name: 'Aikido',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    sourcePage: 179,
    originAndFlavor: 'Forma suave: barridos de mano y cuerpo para inmovilizar y desarmar, usando la fuerza del rival en su contra (Core p. 179).',
    keyStats: ['DEX'],
    tacticalRole: 'Desarmes y control del agarre.',
    moves: [
      {
        id: 'aikido-disarming-combination',
        name: 'Disarming Combination',
        formId: 'aikido',
        formName: 'Aikido',
        isNewCyberfists: false,
        requirements: 'Impactaste al mismo objetivo con un Brawling Attack y un Martial Arts Attack este turno. Una vez por turno.',
        resolutionDv: 15,
        sourcePage: 179,
        effectDescription: 'Si superas DV 15, un objeto que el objetivo tenga en las manos pasa a tus manos o cae al suelo; el que desarma elige si queda en sus manos o en el piso (decisión 44) (Core p. 179).'
      },
      {
        id: 'aikido-iron-grip',
        name: 'Iron Grip',
        formId: 'aikido',
        formName: 'Aikido',
        isNewCyberfists: false,
        requirements: 'Tienes al objetivo agarrado (Grab) y no está ya bajo Iron Grip. Una vez por turno, como Acción.',
        resolutionDv: 15,
        sourcePage: 179,
        effectDescription: 'Si superas DV 15, el objetivo tiene -2 adicional a todos sus intentos de escapar de este Grapple y no puede hacer ataques a distancia mientras dure (Core p. 179).'
      }
    ]
  },
  {
    id: 'karate',
    name: 'Karate',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    sourcePage: 179,
    originAndFlavor: 'Forma dura: golpes pensados para romper huesos o armadura (Core p. 179).',
    keyStats: ['DEX', 'WILL'],
    tacticalRole: 'Romper armadura y huesos.',
    moves: [
      {
        id: 'karate-armor-breaking-combination',
        name: 'Armor Breaking Combination',
        formId: 'karate',
        formName: 'Karate',
        isNewCyberfists: false,
        requirements: 'Impactaste al mismo objetivo con un Melee Weapon y un Martial Arts Attack este turno. Una vez por turno.',
        resolutionDv: 15,
        sourcePage: 179,
        effectDescription: 'Si superas DV 15, toda su armadura puesta pierde 2 SP extra (Core p. 179).'
      },
      {
        id: 'karate-bone-breaking-strike',
        name: 'Bone Breaking Strike',
        formId: 'karate',
        formName: 'Karate',
        isNewCyberfists: false,
        requirements: 'WILL 8 o más. En lugar de los 2 ataques de la Acción de Martial Arts, como Acción contra un objetivo en rango cuerpo a cuerpo.',
        resolutionDv: 0,
        sourcePage: 179,
        isOpposed: true,
        effectDescription: 'Si impactas, además del daño de Martial Arts el objetivo sufre Broken Ribs; la herida se aplica después de calcular el daño. Con -8 al Check apuntás a la cabeza, se trata como un Aimed Shot a la cabeza (decisión 43) y causa Cracked Skull en lugar de Broken Ribs. Si ya tenía esa herida, no sufre otra (Core p. 179).',
        criticalInjuryApplied: 'Broken Ribs (o Cracked Skull a la cabeza con -8)'
      }
    ]
  },
  {
    id: 'judo',
    name: 'Judo',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    sourcePage: 179,
    originAndFlavor: 'Forma suave: agarres, proyecciones y escapes (Core p. 179).',
    keyStats: ['DEX'],
    tacticalRole: 'Proyecciones y escapes de agarres.',
    moves: [
      {
        id: 'judo-counter-throw',
        name: 'Counter Throw',
        formId: 'judo',
        formName: 'Judo',
        isNewCyberfists: false,
        requirements: 'Esquivaste todos los ataques cuerpo a cuerpo dirigidos a vos desde tu último turno, y al menos uno (decisión 42). Una vez por turno, como Acción.',
        resolutionDv: 15,
        sourcePage: 179,
        effectDescription: 'Si superas DV 15, usas la Acción Throw contra un objetivo en rango cuerpo a cuerpo cuyo ataque esquivaste; no se puede evitar y no hace falta tenerlo agarrado (Core p. 179).'
      },
      {
        id: 'judo-grab-escape',
        name: 'Grab Escape',
        formId: 'judo',
        formName: 'Judo',
        isNewCyberfists: false,
        requirements: 'Impactaste con 2 Melee Attacks este turno a quien te tiene agarrado. Una vez por turno.',
        resolutionDv: 15,
        sourcePage: 179,
        effectDescription: 'Si superas DV 15, dejas de estar agarrado por ese objetivo y sufre Broken Arm si no lo tenía; eliges el brazo (Core p. 179).',
        criticalInjuryApplied: 'Broken Arm'
      }
    ]
  },
  {
    id: 'taekwondo',
    name: 'Taekwondo',
    sourceBook: 'core',
    badge: 'CORE // CLÁSICO',
    sourcePage: 180,
    originAndFlavor: 'Forma dura: patadas altas y golpes de precisión a puntos de presión (Core p. 180).',
    keyStats: ['DEX', 'WILL', 'MOVE'],
    tacticalRole: 'Golpes a puntos de presión y patadas voladoras.',
    moves: [
      {
        id: 'tkd-pressure-point-strike',
        name: 'Pressure Point Strike',
        formId: 'taekwondo',
        formName: 'Taekwondo',
        isNewCyberfists: false,
        requirements: 'WILL 8 o más. En lugar de los 2 ataques de la Acción de Martial Arts, como Acción contra un objetivo en rango cuerpo a cuerpo.',
        resolutionDv: 0,
        sourcePage: 180,
        isOpposed: true,
        effectDescription: 'Si impactas, además del daño de Martial Arts el objetivo sufre Spinal Injury; la herida se aplica después de calcular el daño. Con -8 al Check apuntás a la cabeza, se trata como un Aimed Shot a la cabeza (decisión 43) y causa Brain Injury en lugar de Spinal Injury. Si ya tenía esa herida, no sufre otra (Core p. 180).',
        criticalInjuryApplied: 'Spinal Injury (o Brain Injury a la cabeza con -8)'
      },
      {
        id: 'tkd-flying-kick',
        name: 'Flying Kick',
        formId: 'taekwondo',
        formName: 'Taekwondo',
        isNewCyberfists: false,
        requirements: 'MOVE 8 o más y ya te moviste al menos 4 m este turno. En lugar de los 2 ataques de la Acción de Martial Arts, usando la Acción y todo tu movimiento restante, contra un objetivo a hasta 4 m en línea recta.',
        resolutionDv: 0,
        sourcePage: 180,
        isOpposed: true,
        damageBonusOrFormula: 'Daño de Martial Arts al cuerpo',
        effectDescription: 'Si impactas, haces daño de Martial Arts al cuerpo, el objetivo queda Prone y cae de cualquier moto o vehículo sin cabina cerrada (Core p. 180).'
      }
    ]
  },

  // ==========================================================================
  // CYBERFISTS OF FURY (23 Nuevas Formas - 46 Movimientos Especiales)
  // Interface RED Vol. 4
  // ==========================================================================
  {
    id: 'arasakate',
    name: 'Arasaka-te',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 76,
    originAndFlavor: 'Arte marcial corporativa creada por Arasaka antes de la Cuarta Guerra Corporativa; fácil de enseñar y franquiciada en dojos de centros comerciales.',
    keyStats: ['DEX'],
    tacticalRole: 'Un movimiento de contraataque que rebaja la penalización de Aimed Shot y otro para escapar de un agarre.',
    moves: [
      {
        id: 'arasakate-counter-strike',
        name: 'Counter Strike',
        formId: 'arasakate',
        formName: 'Arasaka-te',
        isNewCyberfists: true,
        requirements: 'Tu turno; recibiste daño de un ataque de Brawling, Martial Arts o Melee Weapon desde tu último turno.',
        resolutionDv: 15,
        sourcePage: 76,
        effectDescription: 'Una vez por turno. Si tienes éxito, la penalización de Aimed Shot de los ataques de Martial Arts/Melee Weapon baja de -8 a -5 durante el resto de tu turno, contra un personaje que te haya dañado con ese tipo de ataque desde tu último turno.'
      },
      {
        id: 'arasakate-escape-hold',
        name: 'Escape Hold',
        formId: 'arasakate',
        formName: 'Arasaka-te',
        isNewCyberfists: true,
        requirements: 'Tu turno; eres el defensor en un agarre (grapple).',
        resolutionDv: 15,
        sourcePage: 76,
        effectDescription: 'Una vez por turno. Si tienes éxito, dejas de estar agarrado.'
      }
    ]
  },
  {
    id: 'arnis',
    name: 'Arnis',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 76,
    originAndFlavor: 'Arte filipino centrado en las armas, considerado uno de los más letales.',
    keyStats: ['DEX'],
    tacticalRole: 'Un combo de dos golpes que causa Torn Muscle y un desarme tras esquivar ataques con arma cuerpo a cuerpo.',
    moves: [
      {
        id: 'arnis-coordinated-combination',
        name: 'Coordinated Combination',
        formId: 'arnis',
        formName: 'Arnis',
        isNewCyberfists: true,
        requirements: 'Impactaste al mismo objetivo con dos ataques de Martial Arts (Arnis) o dos ataques de Melee Weapon hechos con armas cuerpo a cuerpo Light/Medium (o cualquier Melee Weapon instalada como cyberware, dentro de cyberware o en un Battleglove) en este turno.',
        resolutionDv: 15,
        sourcePage: 76,
        effectDescription: 'Una vez por turno. Si tienes éxito, el objetivo sufre la Critical Injury Torn Muscle sin su Bonus Damage.',
        criticalInjuryApplied: 'Torn Muscle'
      },
      {
        id: 'arnis-disarming-technique',
        name: 'Disarming Technique',
        formId: 'arnis',
        formName: 'Arnis',
        isNewCyberfists: true,
        requirements: 'Tu turno; esquivaste al menos un ataque de Melee Weapon desde tu último turno y todos los ataques de Melee Weapon dirigidos contra ti desde entonces; empuñas una Melee Weapon.',
        resolutionDv: 15,
        sourcePage: 76,
        effectDescription: 'Una vez por turno. Si tienes éxito, una Melee Weapon sostenida por un objetivo en rango Melee que te haya atacado con un ataque de Melee Weapon desde tu último turno queda en tu poder o en el suelo; el que desarma elige si queda en sus manos o en el piso (decisión 44).'
      }
    ]
  },
  {
    id: 'boxing',
    name: 'Boxing',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 76,
    originAndFlavor: 'Arte directo de golpes y paradas; puede desgastar al rival o terminar rápido con ráfagas de golpes.',
    keyStats: ['DEX', 'BODY'],
    tacticalRole: 'Un golpe único a la cabeza que causa Broken Jaw y un ataque extra de Brawling tras dos golpes de Brawling.',
    moves: [
      {
        id: 'boxing-knockout-punch',
        name: 'Knockout Punch',
        formId: 'boxing',
        formName: 'Boxing',
        isNewCyberfists: true,
        requirements: 'BODY 8 o más.',
        resolutionDv: 0,
        isOpposed: true,
        sourcePage: 76,
        effectDescription: 'En lugar de hacer 2 ataques con tu Acción de Martial Arts Attack, usas tu Acción para la resolución de Special Move contra un único objetivo en rango Melee con una penalización de -5 a la tirada. Si impacta, apunta a la cabeza como un Aimed Shot y el objetivo sufre la Critical Injury Broken Jaw además del daño del Martial Arts Attack (no sufre una segunda Critical Injury si ya tiene Broken Jaw).',
        criticalInjuryApplied: 'Broken Jaw'
      },
      {
        id: 'boxing-punch-combination',
        name: 'Punch Combination',
        formId: 'boxing',
        formName: 'Boxing',
        isNewCyberfists: true,
        requirements: 'Impactaste al mismo objetivo con dos ataques de Brawling en este turno.',
        resolutionDv: 15,
        sourcePage: 77,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Brawling contra el objetivo.'
      }
    ]
  },
  {
    id: 'capoeira',
    name: 'Capoeira',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 77,
    originAndFlavor: 'Arte fluida y parecida a una danza, posiblemente desarrollada por esclavos brasileños; de extrema fluidez.',
    keyStats: ['DEX'],
    tacticalRole: 'Dos encadenados: un ataque de Brawling tras fallar y un ataque de Martial Arts tras una Critical Injury con arma o gasto de Luck.',
    moves: [
      {
        id: 'capoeira-rhythmic-recovery',
        name: 'Rhythmic Recovery',
        formId: 'capoeira',
        formName: 'Capoeira',
        isNewCyberfists: true,
        requirements: 'Fallaste a un objetivo con un ataque de Martial Arts (Capoeira) en este turno.',
        resolutionDv: 15,
        sourcePage: 77,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Brawling contra un objetivo en rango Melee.'
      },
      {
        id: 'capoeira-slash-dance',
        name: 'Slash Dance',
        formId: 'capoeira',
        formName: 'Capoeira',
        isNewCyberfists: true,
        requirements: 'En este turno infligiste una Critical Injury con una Melee Weapon Light/Medium (o Melee Weapon instalada como cyberware, dentro de cyberware o en Gear como un Battleglove), o gastaste más de 3 puntos de Luck en un ataque con esas armas o en Rhythmic Recovery (la tirada de resolución o el ataque de Brawling resultante).',
        resolutionDv: 15,
        sourcePage: 77,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Martial Arts (Capoeira) contra un objetivo en rango Melee.'
      }
    ]
  },
  {
    id: 'choy-li-fut',
    name: 'Choy Li Fut',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 77,
    originAndFlavor: 'Arte chino de gran velocidad y versatilidad; sus ataques de barrido sirven para pelear contra varios oponentes.',
    keyStats: ['DEX', 'MOVE'],
    tacticalRole: 'Una Acción Run gratuita tras esquivar y un ataque de Brawling extra contra otro objetivo.',
    moves: [
      {
        id: 'choy-li-fut-shaolin-step',
        name: 'Shaolin Step',
        formId: 'choy-li-fut',
        formName: 'Choy Li Fut',
        isNewCyberfists: true,
        requirements: 'MOVE 6 o más; tu turno; esquivaste al menos un ataque desde tu último turno y todos los ataques dirigidos contra ti desde entonces; aún no has realizado la Acción Run en este turno.',
        resolutionDv: 15,
        sourcePage: 77,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes realizar la Acción Run sin que cueste una Acción; no puedes volver a usar Run en este turno.'
      },
      {
        id: 'choy-li-fut-sweeping-fist',
        name: 'Sweeping Fist',
        formId: 'choy-li-fut',
        formName: 'Choy Li Fut',
        isNewCyberfists: true,
        requirements: 'MOVE 6 o más; impactaste al mismo objetivo con dos ataques de Martial Arts (Choy Li Fut) en este turno.',
        resolutionDv: 15,
        sourcePage: 77,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Brawling contra un objetivo en rango Melee al que no hayas impactado en este turno.'
      }
    ]
  },
  {
    id: 'drunken-fist',
    name: 'Drunken Fist',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 77,
    originAndFlavor: 'Arte chino que imita a una persona ebria para golpear y defenderse de forma inesperada enroscando el cuerpo.',
    keyStats: ['DEX', 'LUCK'],
    tacticalRole: 'Mejora tus ataques de Brawling con el entorno y permite esquivar ataques que no ves; los requisitos de LUCK se refieren al STAT.',
    moves: [
      {
        id: 'drunken-fist-environmental-improvisation',
        name: 'Environmental Improvisation',
        formId: 'drunken-fist',
        formName: 'Drunken Fist',
        isNewCyberfists: true,
        requirements: 'LUCK 4 o más (el STAT LUCK, no la reserva actual de Luck).',
        resolutionDv: 13,
        sourcePage: 77,
        effectDescription: 'Una vez por turno. Si tienes éxito, eliges un objeto o cobertura en rango Melee; si el GM acepta que resultaría doloroso como arma o al ser estrellado contra él, mientras estés en rango Melee de ello tus ataques de Brawling de este turno ignoran la mitad de la armadura del defensor. Para un objeto o superficie especialmente dolorosa, el GM puede mejorar tu daño en la tabla de Brawling hasta un máximo de 4d6.'
      },
      {
        id: 'drunken-fist-lucky-stumble',
        name: 'Lucky Stumble',
        formId: 'drunken-fist',
        formName: 'Drunken Fist',
        isNewCyberfists: true,
        requirements: 'LUCK 4 o más (STAT); te están atacando con un Attack del que tu personaje no es consciente. Se cumple siempre que se dé la condición (incluso inconsciente o incapacitado).',
        resolutionDv: 15,
        sourcePage: 77,
        effectDescription: 'Si tienes éxito, puedes intentar esquivar el Attack normalmente, como si pudieras esquivar balas, incluso si de otro modo no podrías. Primer éxito de la sesión de juego: puedes recuperar 2 puntos de Luck gastados de inmediato o al inicio de tu siguiente turno; el Luck no puede superar tu LUCK.'
      }
    ]
  },
  {
    id: 'gun-fu',
    name: 'Gun Fu',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 78,
    originAndFlavor: 'Mitad combate cuerpo a cuerpo y mitad manejo de pistola de combate; letal en espacios cerrados; trata la pistola como una extensión del cuerpo.',
    keyStats: ['DEX'],
    tacticalRole: 'Una recarga gratuita tras impactar y la Woo Technique, que extiende los ataques de Gun Fu hasta 25 m/yds.',
    moves: [
      {
        id: 'gun-fu-combat-reload',
        name: 'Combat Reload',
        formId: 'gun-fu',
        formName: 'Gun Fu',
        isNewCyberfists: true,
        requirements: 'Impactaste a un objetivo con un ataque de Martial Arts (Gun Fu); aún no has realizado la Acción Reload en este turno.',
        resolutionDv: 15,
        sourcePage: 78,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes realizar la Acción Reload sobre un arma que empuñes sin que cueste una Acción.'
      },
      {
        id: 'gun-fu-woo-technique',
        name: 'Woo Technique',
        formId: 'gun-fu',
        formName: 'Gun Fu',
        isNewCyberfists: true,
        requirements: 'Handgun Skill Nivel 4+ o Combat Awareness Rango 1; tu turno; sostienes un arma a distancia de una mano ROF2 disparada con Handgun Skill.',
        resolutionDv: 15,
        sourcePage: 78,
        effectDescription: 'Una vez por turno. Si tienes éxito, todo lo siguiente: (1) el alcance de los ataques de Martial Arts (Gun Fu) de este turno aumenta de Melee hasta 25 m/yds; son Melee Attacks, ignoran la mitad de la armadura y cualquiera puede esquivarlos aunque normalmente no pueda esquivar balas; (2) su daño aumenta al del arma usada para cumplir el requisito si es mayor; (3) tu Gun Fu Skill se reduce a tu nivel de Handgun Skill si este es menor; (4) cada ataque de Gun Fu gasta munición como si se disparara normalmente y se aplican los efectos de la munición; si no se puede gastar munición, el ataque falla. (Recuadro: también conocida como Blackhand/Wick/Gibbs Technique.)'
      }
    ]
  },
  {
    id: 'jujutsu',
    name: 'Jujutsu',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 78,
    originAndFlavor: 'Arte japonés que cede ante la fuerza del oponente y la redirige.',
    keyStats: ['DEX', 'WILL'],
    tacticalRole: 'Usa el BODY del rival para calcular el daño y permite un lanzamiento (Throw) tras dos golpes.',
    moves: [
      {
        id: 'jujutsu-aiki',
        name: 'Aiki',
        formId: 'jujutsu',
        formName: 'Jujutsu',
        isNewCyberfists: true,
        requirements: 'Impactaste a un objetivo con un ataque de Martial Arts que no sea de Gun Fu y estás a punto de dañarlo.',
        resolutionDv: 15,
        sourcePage: 78,
        effectDescription: 'Una vez por turno. Si tienes éxito, durante el resto del turno puedes usar el BODY del objetivo en lugar del tuyo al calcular el daño de los ataques de Brawling y Martial Arts contra él.'
      },
      {
        id: 'jujutsu-throwing-technique',
        name: 'Throwing Technique',
        formId: 'jujutsu',
        formName: 'Jujutsu',
        isNewCyberfists: true,
        requirements: 'WILL 6 o más; impactaste al mismo objetivo con dos ataques de Martial Arts (Jujutsu) en este turno.',
        resolutionDv: 15,
        sourcePage: 78,
        effectDescription: 'Una vez por turno. Si tienes éxito, usas la Acción Throw sobre un objetivo en rango Melee al que hayas atacado en este turno, aunque no lo estés agarrando; puedes usar el STAT BODY del objetivo en lugar del tuyo para el daño del lanzamiento.'
      }
    ]
  },
  {
    id: 'kendo',
    name: 'Kendo',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 79,
    originAndFlavor: 'Moderno Camino de la Espada japonés, con linaje que viene de los samuráis.',
    keyStats: ['DEX', 'WILL'],
    tacticalRole: 'Permite cortar una bala con un arma cuerpo a cuerpo y rebaja la penalización de Aimed Shot del primer ataque del siguiente turno.',
    moves: [
      {
        id: 'kendo-cut-the-bullet',
        name: 'Cut the Bullet',
        formId: 'kendo',
        formName: 'Kendo',
        isNewCyberfists: true,
        requirements: 'WILL 8+; Melee Weapons Skill Nivel 6+; eres consciente del atacante; empuñas un arma cuerpo a cuerpo mientras te disparan con un arma a distancia en modo estándar de Single Shot, o estás dentro del radio de explosión de un explosivo a distancia. Se cumple siempre que se dé la condición.',
        resolutionDv: 0,
        isOpposed: true,
        opposedBy: 'tirada de ataque',
        sourcePage: 79,
        effectDescription: 'Haces la resolución contra la tirada de ataque (Attack Check) del oponente. Si tienes éxito, el ataque no causa daño. Si fallas, te impacta, y un explosivo queda centrado en ti. Puedes desenfundar una Melee Weapon de fácil acceso (vaina, cyberware Popup Weapon) como parte de cumplir el requisito y guardarla inmediatamente después sin gastar una Acción.'
      },
      {
        id: 'kendo-ki-ken-tai-no-ichi',
        name: 'Ki Ken Tai No Ichi',
        formId: 'kendo',
        formName: 'Kendo',
        isNewCyberfists: true,
        requirements: 'Estás en combate.',
        resolutionDv: 15,
        sourcePage: 79,
        effectDescription: 'Una vez por turno, como Acción. Si tienes éxito, la penalización de Aimed Shot de tu primer ataque con una Melee Weapon en tu siguiente turno se reduce a -2.'
      }
    ]
  },
  {
    id: 'krav-maga',
    name: 'Krav Maga',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 79,
    originAndFlavor: 'Arte israelí que combina Aikido, Boxing, Judo, Karate y Wrestling para una defensa personal real.',
    keyStats: ['DEX'],
    tacticalRole: 'Dos ataques de Brawling extra: uno tras causar una Critical Injury y otro tras esquivar ataques cuerpo a cuerpo.',
    moves: [
      {
        id: 'krav-maga-contact-combat',
        name: 'Contact Combat',
        formId: 'krav-maga',
        formName: 'Krav Maga',
        isNewCyberfists: true,
        requirements: 'Infligiste una herida crítica con un Martial Arts Attack o una Special Move Resolution de Aikido, Boxing, Judo, Karate, Krav Maga o Wrestling (la lista califica a ambos, decisión 40) en este turno.',
        resolutionDv: 15,
        sourcePage: 79,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Brawling contra un objetivo al que hayas causado una Critical Injury en este turno.'
      },
      {
        id: 'krav-maga-punishing-blow',
        name: 'Punishing Blow',
        formId: 'krav-maga',
        formName: 'Krav Maga',
        isNewCyberfists: true,
        requirements: 'Esquivaste al menos un Melee Attack desde tu último turno y todos los Attacks dirigidos contra ti desde entonces.',
        resolutionDv: 15,
        sourcePage: 79,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Brawling contra un objetivo que te haya atacado con un Melee Attack desde tu último turno.'
      }
    ]
  },
  {
    id: 'kung-fu',
    name: 'Kung Fu',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 79,
    originAndFlavor: 'El arte marcial chino original y ancestro de muchos estilos; casi invencible cuando se usa bien.',
    keyStats: ['DEX'],
    tacticalRole: 'Un ataque Five Forms con efectos de animales y un movimiento que te sube al primer puesto de la Iniciativa.',
    moves: [
      {
        id: 'kung-fu-five-forms',
        name: 'Five Forms',
        formId: 'kung-fu',
        formName: 'Kung Fu',
        isNewCyberfists: true,
        requirements: 'Kung Fu Skill Nivel 4+.',
        resolutionDv: 0,
        isOpposed: true,
        sourcePage: 79,
        effectDescription: 'En lugar de 2 ataques, haces un ataque Five Forms: eliges dos opciones distintas entre Crane, Dragon, Leopard, Snake, Tiger. Usas tu Acción para la resolución de Special Move contra un único objetivo en rango Melee. Si impacta, además del daño de Martial Arts, el ataque gana el efecto del primer animal; tu siguiente Melee Attack en un turno futuro de este combate gana el efecto del segundo animal si impacta. Crane: el objetivo sufre la Critical Injury Damaged Eye sin su Bonus Damage. Dragon: +1 a la siguiente tirada de ataque contra el objetivo en este combate. Leopard: tu MOVE +2 hasta el final de tu turno. Snake: recuperas 1 punto de Luck gastado. Tiger: toda la armadura que lleve el objetivo se ablanda 1 SP adicional.'
      },
      {
        id: 'kung-fu-superior-stance',
        name: 'Superior Stance',
        formId: 'kung-fu',
        formName: 'Kung Fu',
        isNewCyberfists: true,
        requirements: 'Tu turno; impactaste a un objetivo con un ataque de Martial Arts en este turno.',
        resolutionDv: 17,
        sourcePage: 79,
        effectDescription: 'Una vez por turno. Si tienes éxito, pasas al primer puesto de la cola de Iniciativa.'
      }
    ]
  },
  {
    id: 'kyudo',
    name: 'Kyudo',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 80,
    originAndFlavor: 'Arte japonés del tiro con arco, con movimientos de mano a mano que complementan al arco.',
    keyStats: ['DEX'],
    tacticalRole: 'Una postura que da +2d6 al primer ataque con arma de Archery ROF1 y recuperación de Luck tras un Aimed Shot con arco.',
    moves: [
      {
        id: 'kyudo-hassetsu',
        name: 'Hassetsu',
        formId: 'kyudo',
        formName: 'Kyudo',
        isNewCyberfists: true,
        requirements: 'No estás derribado (prone) ni en un agarre; empuñas un arma disparada con Archery Skill (puedes desenfundar una de fácil acceso como parte del requisito).',
        resolutionDv: 15,
        sourcePage: 80,
        effectDescription: 'Una vez por turno, como Acción. Si tienes éxito, estableces una postura Kyudo: el daño de tu primer Attack en tu turno con un arma de Archery ROF1 es +2d6. Sales de la postura si te mueves más de 6 m/yds (3 casillas) en tu turno, recibes daño de un Melee Attack, quedas agarrado, quedas derribado, te desarman de tu última arma de Archery o termina el combate. Ir en un vehículo en movimiento no la rompe salvo que seas el conductor. Establecer la postura es una acción agresiva equivalente a desenfundar un arma de fuego.'
      },
      {
        id: 'kyudo-zaiteki',
        name: 'Zaiteki',
        formId: 'kyudo',
        formName: 'Kyudo',
        isNewCyberfists: true,
        requirements: 'Impactaste a un objetivo en este turno con un Aimed Shot hecho con un arma disparada con Archery Skill.',
        resolutionDv: 15,
        sourcePage: 80,
        effectDescription: 'Una vez por turno. Si tienes éxito, recuperas hasta 2 puntos de Luck gastados.'
      }
    ]
  },
  {
    id: 'militech-cqc',
    name: 'Militech Commando Training',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 80,
    originAndFlavor: 'Sistema de Militech que enseña a los soldados a usar cuchillos de combate.',
    keyStats: ['DEX'],
    tacticalRole: 'Convierte un arma cuerpo a cuerpo ligera/media en 4d6 con ROF 1 y permite arrebatar un arma al rival.',
    moves: [
      {
        id: 'militech-cqc-combat-knife-training',
        name: 'Combat Knife Training',
        formId: 'militech-cqc',
        formName: 'Militech Commando Training',
        isNewCyberfists: true,
        requirements: 'Atacas con una Melee Weapon Light o Medium como tu primer ataque de este turno. Se cumple siempre que se dé la condición.',
        resolutionDv: 15,
        sourcePage: 80,
        effectDescription: 'Si tienes éxito, hasta el final del turno el daño del arma pasa a ser 4d6 pero su ROF pasa a ser 1.'
      },
      {
        id: 'militech-cqc-commando-disarm',
        name: 'Commando Disarm',
        formId: 'militech-cqc',
        formName: 'Militech Commando Training',
        isNewCyberfists: true,
        requirements: 'Tienes dos o más manos libres.',
        resolutionDv: 0,
        isOpposed: true,
        opposedBy: 'Brawling del objetivo',
        sourcePage: 80,
        effectDescription: 'Como Acción, usas la resolución de Special Move contra la tirada de Brawling (Brawling Check) de un único objetivo en rango Melee que empuñe al menos un arma en las manos. Si tienes éxito, pasas una de sus armas empuñadas a tus manos; después puedes atacar al mismo objetivo con ella como si aún no hubieras gastado una Acción.'
      }
    ]
  },
  {
    id: 'muay-thai',
    name: 'Muay Thai',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 80,
    originAndFlavor: 'Arte de golpeo tailandés; implica un acondicionamiento corporal extremo y a menudo cyberware extremo.',
    keyStats: ['DEX'],
    tacticalRole: 'Dos bonos de daño encadenados entre ataques de Martial Arts y de Brawling.',
    moves: [
      {
        id: 'muay-thai-conditioned-ferocity',
        name: 'Conditioned Ferocity',
        formId: 'muay-thai',
        formName: 'Muay Thai',
        isNewCyberfists: true,
        requirements: 'Tu turno; dañaste a un objetivo con un ataque de Martial Arts desde el inicio de tu último turno.',
        resolutionDv: 15,
        sourcePage: 80,
        effectDescription: 'Una vez por turno. Si tienes éxito, hasta el final del turno el daño de los ataques de Brawling es +1d6 (máximo 4d6) y todos los ataques de Brawling reciben +1.'
      },
      {
        id: 'muay-thai-conditioned-power',
        name: 'Conditioned Power',
        formId: 'muay-thai',
        formName: 'Muay Thai',
        isNewCyberfists: true,
        requirements: 'Tu turno; dañaste a un objetivo con un ataque de Brawling desde el inicio de tu último turno.',
        resolutionDv: 15,
        sourcePage: 80,
        effectDescription: 'Una vez por turno. Si tienes éxito, el daño de tu siguiente ataque de Martial Arts de este turno es +1d6.'
      }
    ]
  },
  {
    id: 'multiarm-melee',
    name: 'Multiarm Melee',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 81,
    originAndFlavor: 'Arte de los habitantes del Yukon Valley del Alaska estado libre, creada para combatir a los osos aumentados de Biotechnica.',
    keyStats: ['DEX', 'BODY'],
    tacticalRole: 'Ventajas en ataques de Brawling si tienes más brazos que el objetivo y daño directo a quienes sujetas en agarres.',
    moves: [
      {
        id: 'multiarm-melee-armed-dangerous',
        name: 'Armed & Dangerous',
        formId: 'multiarm-melee',
        formName: 'Multiarm Melee',
        isNewCyberfists: true,
        requirements: 'Tu turno; tienes más brazos que un objetivo al que atacas con un ataque de Brawling.',
        resolutionDv: 15,
        sourcePage: 81,
        effectDescription: 'Una vez por ataque de Brawling, antes de tirar para atacar. Si tienes éxito, eliges una opción: tirar el d10 dos veces y tomar el resultado favorable; bajar la penalización de Aimed Shot de tu ataque de Brawling de -8 a -5; o, si eres Solo, reasignar puntos de Combat Awareness sin gastar una Acción. El DV es 17 si ya usaste este movimiento en este turno.'
      },
      {
        id: 'multiarm-melee-smack-together',
        name: 'Smack Together',
        formId: 'multiarm-melee',
        formName: 'Multiarm Melee',
        isNewCyberfists: true,
        requirements: 'BODY 6+; eres el atacante en dos o más agarres (grapples).',
        resolutionDv: 15,
        sourcePage: 81,
        effectDescription: 'Una vez por turno, como Acción. Si tienes éxito, infliges tu STAT BODY directamente a los Hit Points de todos los que estén defendiéndose de un agarre hecho por ti.'
      }
    ]
  },
  {
    id: 'panzerfaust',
    name: 'PanzerFaust',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 81,
    originAndFlavor: 'Arte desarrollada por la FBC que libera el poder de un cuerpo metálico contra los cuerpos blandos.',
    keyStats: ['DEX', 'BODY'],
    tacticalRole: 'Un golpe de 5d6/6d6 contra objetivos de menor BODY y un movimiento que repara y protege tu cyberware.',
    moves: [
      {
        id: 'panzerfaust-borg-fist',
        name: 'Borg Fist',
        formId: 'panzerfaust',
        formName: 'PanzerFaust',
        isNewCyberfists: true,
        requirements: 'BODY 10+.',
        resolutionDv: 0,
        isOpposed: true,
        sourcePage: 81,
        damageBonusOrFormula: '5d6 (6d6 con Humanidad menor que 0)',
        effectDescription: 'En lugar de 2 ataques, usas tu Acción para la resolución de Special Move contra un único objetivo en rango Melee con BODY menor que el tuyo. Si tienes éxito, haces un ataque de Martial Arts (PanzerFaust) que inflige 5d6 en lugar del daño normal, o 6d6 si tienes Humanidad menor que 0.'
      },
      {
        id: 'panzerfaust-inner-chrome',
        name: 'Inner Chrome',
        formId: 'panzerfaust',
        formName: 'PanzerFaust',
        isNewCyberfists: true,
        requirements: 'Eres una Full Body Conversion o tienes Humanidad menor que 0; estás en combate; al menos una pieza de cyberware está dañada, deshabilitada o inoperativa (por ejemplo por un EMP).',
        resolutionDv: 11,
        sourcePage: 81,
        effectDescription: 'Una vez por turno. El DV es 11, +2 por cada pieza de cyberware afectada. Si tienes éxito, el cyberware afectado vuelve a funcionar hasta el final del combate. Hasta tu siguiente turno tu cyberware es inmune a ser dañado, deshabilitado o dejado inoperativo. Si tu Humanidad es menor que 0 y el DV superado era 15 o más, las inmunidades duran hasta el final del combate y se extienden a que el cyberware sea destruido o destruido sin reparación posible.'
      }
    ]
  },
  {
    id: 'silat',
    name: 'Silat',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 81,
    originAndFlavor: 'Fusión de muchas artes indígenas del Sudeste Asiático; cientos de estilos variables.',
    keyStats: ['DEX', 'WILL'],
    tacticalRole: 'Dos movimientos que encadenan un ataque de Brawling o de Melee Weapon tras golpear o iniciar un agarre.',
    moves: [
      {
        id: 'silat-internal-power',
        name: 'Internal Power',
        formId: 'silat',
        formName: 'Silat',
        isNewCyberfists: true,
        requirements: 'WILL 6+; impactaste al mismo objetivo con dos ataques de Martial Arts (Silat) o dos ataques de Melee Weapon con Melee Weapons Light/Medium.',
        resolutionDv: 15,
        sourcePage: 81,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Brawling contra un objetivo en rango Melee.'
      },
      {
        id: 'silat-violent-leverage',
        name: 'Violent Leverage',
        formId: 'silat',
        formName: 'Silat',
        isNewCyberfists: true,
        requirements: 'Tu turno; en este turno iniciaste un agarre con un objetivo al que no habías agarrado antes en este combate.',
        resolutionDv: 15,
        sourcePage: 82,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes hacer un único ataque de Melee Weapon contra un objetivo en rango Melee.'
      }
    ]
  },
  {
    id: 'sov-system',
    name: 'Sov-System',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 82,
    originAndFlavor: 'Sucesor de Command Sambo creado por SovOil, pensado como arte comercial más popular que Arasaka-te.',
    keyStats: ['DEX', 'BODY'],
    tacticalRole: 'Un golpe que causa una Critical Injury de Cuerpo aleatoria y un contraataque tras sufrir una Critical Injury.',
    moves: [
      {
        id: 'sov-system-dirty-blow',
        name: 'Dirty Blow',
        formId: 'sov-system',
        formName: 'Sov-System',
        isNewCyberfists: true,
        requirements: 'BODY 4+.',
        resolutionDv: 0,
        isOpposed: true,
        sourcePage: 82,
        effectDescription: 'En lugar de 2 ataques, usas tu Acción para la resolución de Special Move contra un único objetivo en rango Melee. Si impacta, el objetivo sufre una Critical Injury de Cuerpo tirada al azar además del daño de Martial Arts; si sale Foreign Object, vuelves a tirar en la tabla de Cuerpo y se aplica ese nuevo resultado.'
      },
      {
        id: 'sov-system-revenge-strike',
        name: 'Revenge Strike',
        formId: 'sov-system',
        formName: 'Sov-System',
        isNewCyberfists: true,
        requirements: 'BODY 4+; tu turno; recibiste una Critical Injury de un Melee Attack o de un Special Move de Martial Arts desde tu último turno.',
        resolutionDv: 15,
        sourcePage: 82,
        effectDescription: 'Una vez por turno. Si tienes éxito, haces un único ataque de Martial Arts (Sov-System) contra un objetivo que cumpla la segunda frase del requisito; si causa una Critical Injury, recuperas hasta 2 puntos de Luck gastados.'
      }
    ]
  },
  {
    id: 'sumo',
    name: 'Sumo',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 82,
    originAndFlavor: 'Lucha japonesa que mueve al oponente con toda la fuerza del cuerpo.',
    keyStats: ['DEX', 'BODY', 'COOL'],
    tacticalRole: 'Evita un agarre o lanzamiento moviendo a ambos, y mejora tu Facedown.',
    moves: [
      {
        id: 'sumo-deashi',
        name: 'Deashi',
        formId: 'sumo',
        formName: 'Sumo',
        isNewCyberfists: true,
        requirements: 'BODY 7+; estás a punto de ser agarrado o lanzado. Se cumple siempre que se dé la condición.',
        resolutionDv: 15,
        sourcePage: 82,
        effectDescription: 'Si tienes éxito, no eres agarrado ni lanzado y puedes moverte a ti y al agarrador/lanzador hasta 6 m/yds (3 casillas) en la dirección que elijas.'
      },
      {
        id: 'sumo-niramiai',
        name: 'Niramiai',
        formId: 'sumo',
        formName: 'Sumo',
        isNewCyberfists: true,
        requirements: 'COOL 4+; estás en un Facedown. Se cumple siempre que se dé la condición.',
        resolutionDv: 15,
        sourcePage: 82,
        effectDescription: 'Si tienes éxito, tu Facedown se hace con un +2.'
      }
    ]
  },
  {
    id: 'tai-chi',
    name: 'Tai Chi',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 82,
    originAndFlavor: 'Arte chino que redirige y frustra los ataques manteniendo el equilibrio interior.',
    keyStats: ['DEX', 'WILL'],
    tacticalRole: 'Inutiliza una mano del atacante que falla y puede anular el Special Move de un rival.',
    moves: [
      {
        id: 'tai-chi-joint-manipulation',
        name: 'Joint Manipulation',
        formId: 'tai-chi',
        formName: 'Tai Chi',
        isNewCyberfists: true,
        requirements: 'Alguien en rango Melee falló contra ti con un Melee Attack. Se cumple siempre que se dé la condición.',
        resolutionDv: 15,
        sourcePage: 82,
        effectDescription: 'Si tienes éxito, eliges una de las manos del atacante; no podrá usarla hasta el final de su siguiente turno (no suelta lo que sostiene).'
      },
      {
        id: 'tai-chi-lu',
        name: 'Lu',
        formId: 'tai-chi',
        formName: 'Tai Chi',
        isNewCyberfists: true,
        requirements: 'WILL 8+; alguien en rango Melee acaba de tener éxito en una resolución de Special Move de Martial Arts.',
        resolutionDv: 0,
        isOpposed: true,
        opposedBy: 'la tirada de Special Move que lo provocó',
        sourcePage: 82,
        effectDescription: 'Una vez por turno. Haces tu resolución contra un DV igual a la tirada (Check) del rival. Si tienes éxito, su Special Move falla, salvo que responda de inmediato con Lu él mismo y supere el DV fijado por tu tirada de Lu.'
      }
    ]
  },
  {
    id: 'thamoc',
    name: 'Thamoc',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 83,
    originAndFlavor: 'Arte moderno (Arte de la Confrontación Moderna) que entrena a policías en retención de armas y agarres.',
    keyStats: ['DEX'],
    tacticalRole: 'Rebaja la penalización de Aimed Shot contra un agarrado y evita que te desarmen.',
    moves: [
      {
        id: 'thamoc-advantaged-position',
        name: 'Advantaged Position',
        formId: 'thamoc',
        formName: 'Thamoc',
        isNewCyberfists: true,
        requirements: 'Tu turno; eres el atacante en un agarre.',
        resolutionDv: 15,
        sourcePage: 83,
        effectDescription: 'Una vez por turno. Si tienes éxito, la penalización de Aimed Shot contra un objetivo que estés agarrando, con un ataque de Martial Arts o Melee Weapon, baja de -8 a -5 durante el resto de tu turno.'
      },
      {
        id: 'thamoc-weapon-retention',
        name: 'Weapon Retention',
        formId: 'thamoc',
        formName: 'Thamoc',
        isNewCyberfists: true,
        requirements: 'Estás a punto de ser desarmado de un arma por cualquier medio. Se cumple siempre que se dé la condición.',
        resolutionDv: 15,
        sourcePage: 83,
        effectDescription: 'Si tienes éxito, tu arma no es retirada de tus manos.'
      }
    ]
  },
  {
    id: 'thrash-sambo',
    name: 'Thrash Sambo',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 83,
    originAndFlavor: 'Fusión reciente de Command Sambo y Thrash Boxing, un estilo de inspiración bailable de los clubes nocturnos de Europa del Este de los años 2020.',
    keyStats: ['DEX'],
    tacticalRole: 'Aguante: anula el Bonus Damage de una Critical Injury y reduce el daño de ataques cuerpo a cuerpo.',
    moves: [
      {
        id: 'thrash-sambo-grit',
        name: 'Grit',
        formId: 'thrash-sambo',
        formName: 'Thrash Sambo',
        isNewCyberfists: true,
        requirements: 'Estás a punto de sufrir una Critical Injury. Se cumple siempre que se dé la condición.',
        resolutionDv: 15,
        sourcePage: 83,
        effectDescription: 'Si tienes éxito, no recibes el Bonus Damage de la Critical Injury, aunque sigues sufriendo su efecto.'
      },
      {
        id: 'thrash-sambo-thick-skin',
        name: 'Thick Skin',
        formId: 'thrash-sambo',
        formName: 'Thrash Sambo',
        isNewCyberfists: true,
        requirements: 'Estás recibiendo daño de un Melee Attack. Se cumple siempre que se dé la condición.',
        resolutionDv: 15,
        sourcePage: 83,
        effectDescription: 'Si tienes éxito, el daño se reduce en 2, o en 4 si fue un ataque de Martial Arts.'
      }
    ]
  },
  {
    id: 'wrestling',
    name: 'Wrestling',
    sourceBook: 'interface_red',
    badge: 'CYBERFISTS // IR4',
    sourcePage: 83,
    originAndFlavor: 'Una de las artes marciales más antiguas, centrada en agarrar e inmovilizar al oponente; muy practicada.',
    keyStats: ['DEX'],
    tacticalRole: 'Permite usar la Acción Choke durante un agarre y invertir un agarre para pasar a ser el atacante.',
    moves: [
      {
        id: 'wrestling-chokehold',
        name: 'Chokehold',
        formId: 'wrestling',
        formName: 'Wrestling',
        isNewCyberfists: true,
        requirements: 'Tu turno; eres el atacante en un agarre y no has usado la Acción Choke en este turno.',
        resolutionDv: 15,
        sourcePage: 83,
        effectDescription: 'Una vez por turno. Si tienes éxito, puedes usar la Acción Choke; no contra el mismo objetivo otra vez en este turno.'
      },
      {
        id: 'wrestling-reversal',
        name: 'Reversal',
        formId: 'wrestling',
        formName: 'Wrestling',
        isNewCyberfists: true,
        requirements: 'Tu turno; eres el defensor en un agarre.',
        resolutionDv: 15,
        sourcePage: 83,
        effectDescription: 'Una vez por turno. Si tienes éxito, pasas a ser el atacante en el agarre.'
      }
    ]
  }
];

// Arreglo plano con los 54 movimientos para búsqueda, filtrado y disparo táctico directo en el HUD de Combate
export const ALL_MARTIAL_ART_MOVES: MartialArtMove[] = MARTIAL_ARTS_FORMS.flatMap(form => form.moves);

export interface MartialArtsOfficialManualText {
  title: string;
  sourceReferences: string;
  overview: {
    title: string;
    definition: string;
    difficultyMultiplier: string;
    whySeparateSkills: string;
    requirementToUse: string;
  };
  combatMechanics: {
    title: string;
    rateOfFire: string;
    armorPenetrationRule: string;
    bodyDamageScaleTable: Array<{
      bodyRange: string;
      damageDice: string;
      examples: string;
    }>;
    specialMovesResolution: string;
  };
  howToBuyAndAcquire: {
    title: string;
    methods: Array<{
      id: string;
      name: string;
      sourcePage: string;
      costExplanation: string;
      mechanicDetails: string;
      ipCostTable?: Array<{ targetRank: number; cost: number }>;
    }>;
  };
}

export const MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT: MartialArtsOfficialManualText = {
  title: 'Reglamento Oficial Canónico de Artes Marciales // Cyberpunk RED & Cyberfists',
  sourceReferences: 'Core pp. 81, 83, 88, 90, 112, 137, 176-180, 182, 360 y 411; Interface RED Vol. 4 pp. 73-83; CEMK RB p.36',
  overview: {
    title: 'Naturaleza de las Artes Marciales (Habilidad Difícil x2)',
    definition: 'Martial Arts es la habilidad de combate cuerpo a cuerpo de entrenamiento formal. A diferencia del Brawling, cada forma es una skill aparte y tiene Special Moves propios (Core pp. 178-180).',
    difficultyMultiplier: 'Coste Doble (x2): Al ser una habilidad avanzada de alta complejidad motriz, cada punto de Martial Arts cuesta el doble tanto en la creación de personaje (2 puntos de habilidad por nivel) como al entrenar durante la partida con Puntos de Mejora (Nivel Objetivo × 40 IP).',
    whySeparateSkills: 'Hay 4 formas en el Core (p.178) y 23 en Interface RED Vol. 4 (pp. 73-83). Cada forma es una skill aparte (p.83).',
    requirementToUse: 'Para poder empuñar un estilo en combate y desbloquear sus golpes o Movimientos Especiales, tu personaje DEBE tener al menos Rango 1 aprendido de forma natural O tener equipado un Skill Chip (Nivel 3) de esa forma en su Chipware Socket / Neuroport; el chip habilita los movimientos (decisión 41).'
  },
  combatMechanics: {
    title: 'Mecánicas de Combate Canónicas: ROF 2, 50% SP & Movimientos Especiales',
    rateOfFire: 'ROF 2 (2 Ataques por Acción, Core p. 178): Al atacar con Artes Marciales, realizas dos ataques completos por cada Acción de Ataque en tu turno. Cada golpe se resuelve tirando 1d10 + DEX + Rango en ese Estilo de Arte Marcial contra 1d10 + DEX + Evasion del defensor.',
    armorPenetrationRule: 'Ignora la Mitad de la Armadura (Core p. 178): el ataque ignora la mitad de la armadura del defensor, redondeando para arriba. La armadura se desgasta normalmente (p. 176). Brawling no ignora armadura.',
    bodyDamageScaleTable: [
      { bodyRange: 'BODY 4 o menos', damageDice: '1d6', examples: '' },
      { bodyRange: 'BODY 5 a 6', damageDice: '2d6', examples: '' },
      { bodyRange: 'BODY 7 a 10', damageDice: '3d6', examples: '' },
      { bodyRange: 'BODY 11+', damageDice: '4d6', examples: 'Sin mínimo por ciberbrazo: eso es solo de Brawling (p.176, decisión 46).' }
    ],
    specialMovesResolution: 'Resolución de Special Moves (Core p. 178): DEX + Skill de esa forma + 1d10 contra DEX + Evasion + 1d10 del defensor, o contra el DV del movimiento cuando lo indica (DV 15 en los del Core; Recovery DV 13). Cada forma tiene 2 Special Moves propios y todas pueden usar los Shared Special Moves (Recovery). Hace falta al menos 1 punto en la forma y cumplir el requisito del movimiento. Salvo que el movimiento lo diga, no sirven para Aimed Shots.'
  },
  howToBuyAndAcquire: {
    title: 'Las 3 Vías Oficiales para Aprender o Adquirir un Arte Marcial',
    methods: [
      {
        id: 'creation',
        name: '1. En Creación de Personaje (Puntos de Habilidad)',
        sourcePage: 'Core pp. 81, 88 y 90',
        costExplanation: 'Cuesta 2 puntos de Habilidad por cada nivel. Los 86 puntos de creación son de Edgerunner y Paquete Completo; en Streetrat las skills vienen de la plantilla.',
        mechanicDetails: 'Subir un estilo a Nivel 1 cuesta 2 puntos; Nivel 2 = 4 puntos; Nivel 3 = 6 puntos; Nivel 4 = 8 puntos; Nivel 5 = 10 puntos; hasta el tope inicial de Nivel 6 = 12 puntos de habilidad.'
      },
      {
        id: 'improvement_points',
        name: '2. Durante la Campaña con Puntos de Mejora (IP)',
        sourcePage: 'Core Rulebook p. 411 (Tabla Oficial de IP)',
        costExplanation: 'Al ser una habilidad x2, subir de nivel cuesta exactamente: Nivel Objetivo × 40 IP.',
        mechanicDetails: 'Ganas IP al final de cada misión o sesión según el desempeño de tu personaje. Puedes invertir tus IP acumulados directamente para desbloquear o subir de rango cualquier estilo.',
        ipCostTable: [
          { targetRank: 1, cost: 40 },
          { targetRank: 2, cost: 80 },
          { targetRank: 3, cost: 120 },
          { targetRank: 4, cost: 160 },
          { targetRank: 5, cost: 200 },
          { targetRank: 6, cost: 240 },
          { targetRank: 7, cost: 280 },
          { targetRank: 8, cost: 320 },
          { targetRank: 9, cost: 360 },
          { targetRank: 10, cost: 400 }
        ]
      },
      {
        id: 'skill_chip',
        name: '3. Mediante Skill Chipware (Nivel 3 Instantáneo)',
        sourcePage: 'Core Rulebook pp. 112, 360',
        costExplanation: '1,000 €$ (Precio Oficial Very Expensive para habilidades x2)',
        mechanicDetails: 'Requiere tener instalado un Chipware Socket (en 2045: Neural Link [500 €$] + Chipware Socket [500 €$]; en 2077 el Neuroport trae 2 Chipware Sockets (CEMK RB p.36)). Mientras el Skill Chip esté insertado en tu ranura, tu mente recibe reflejos neurales descargados fijando tu Nivel en 3 (+3) en ese estilo específico de Arte Marcial si tu nivel natural es menor a 3. El chip habilita los movimientos (decisión 41).'
      }
    ]
  }
};
