export interface CoverItem {
  id: string;
  material: string;
  thinHp: string;
  thickHp: string;
  examples: string;
  notes: string;
}

export interface RulePoint {
  title: string;
  badge?: string;
  content: string;
  mechanic?: string;
}

export interface CheatSheetSection {
  id: string;
  category: 'grapple' | 'cover' | 'aimed' | 'hazards' | 'healing' | 'turn';
  icon: string;
  title: string;
  pageRef: string;
  summary: string;
  rules: RulePoint[];
}

export const COVER_RULES_EXPLANATION = {
  title: 'Mecánica Canónica de Cobertura (Cyberpunk RED Core pág. 182)',
  keyRules: [
    'En Cyberpunk RED la cobertura es BINARIA: o estás completamente a cubierto o no lo estás. Si estás detrás de cobertura completa, no pueden seleccionarte como blanco directo para disparos estándar.',
    'Para dañarte, el atacante debe destruir primero los HP de la cobertura hasta reducirlos a 0 HP.',
    'REGLA DE ABSORCIÓN TOTAL: El daño sobrante del disparo que destruye la cobertura NO pasa al defensor (la cobertura absorbe todo el excedente de ese impacto), salvo munición/explosivos de área o armamento Tech especializado.',
    'Una vez destruida (0 HP), esa sección de cobertura deja de existir y quedas expuesto a los siguientes ataques de la ronda.'
  ]
};

export const COVER_HP_TABLE: CoverItem[] = [
  {
    id: 'drywall',
    material: 'Drywall / Pladur',
    thinHp: '10 HP',
    thickHp: '20 HP',
    examples: 'Paredes interiores de departamento, tabiques de oficina, cielo falso',
    notes: 'Destruible rápidamente con armas pesadas o fuego automático (Autofire).'
  },
  {
    id: 'wood',
    material: 'Madera / Puertas / Muebles',
    thinHp: '5 HP',
    thickHp: '15 HP',
    examples: 'Puerta de madera estándar (5 HP), mesa pesada de conferencias, tronco de árbol (15 HP)',
    notes: 'Material ligero. Ofrece poca protección ante armas de alto calibre.'
  },
  {
    id: 'thin_metal',
    material: 'Metal Fino / Vehículos',
    thinHp: '25 HP',
    thickHp: '50 HP',
    examples: 'Puerta de auto (25 HP), carrocería civil, contenedor de basura, bloque de motor (50 HP)',
    notes: 'Una puerta de auto civil detiene 25 HP. El bloque de motor es metal grueso (50 HP).'
  },
  {
    id: 'brick',
    material: 'Ladrillo / Mampostería',
    thinHp: '25 HP',
    thickHp: '50 HP',
    examples: 'Muro exterior residencial, esquina de callejón, chimenea',
    notes: 'Excelente cobertura urbana común en las calles de Night City.'
  },
  {
    id: 'concrete',
    material: 'Hormigón / Concreto / Roca',
    thinHp: '25 HP',
    thickHp: '50 HP',
    examples: 'Barrera Jersey de autopista, pilar estructural, muro de búnker corporativo',
    notes: 'Muy resistente. Capaz de absorber múltiples ráfagas de fusil antes de romperse.'
  },
  {
    id: 'bulletproof_glass',
    material: 'Cristal Antibalas / Blindado',
    thinHp: '15 HP',
    thickHp: '30 HP',
    examples: 'Ventanilla corporativa AV, cabina de seguridad bancaria, parabrisas blindado',
    notes: 'Permite visibilidad bidireccional mientras conserva sus puntos de vida.'
  },
  {
    id: 'ice_industrial_plastic',
    material: 'Hielo / Plástico Industrial',
    thinHp: '15 HP',
    thickHp: '30 HP',
    examples: 'Contenedor químico, cámara frigorífica de carnicería, barril sintético',
    notes: 'Material semi-rígido o congelado de uso industrial.'
  },
  {
    id: 'soft_concealment',
    material: 'Sofá / Vidrio común / Cartón',
    thinHp: '0 HP',
    thickHp: '0 HP',
    examples: 'Sillón, cortinas, escaparate de vidrio simple, cajas de embalaje',
    notes: 'SOLO OCULTACIÓN VISUAL: No detiene balas (0 HP). Los disparos impactan directamente al objetivo.'
  }
];

export const CHEAT_SHEET_SECTIONS: CheatSheetSection[] = [
  {
    id: 'grapple_system',
    category: 'grapple',
    icon: '🤼',
    title: 'GRAPPLE, CHOKE, THROW & ESCUDO HUMANO',
    pageRef: 'Core pág. 177',
    summary: 'Agarres cuerpo a cuerpo, asfixia letal que ignora armadura, derribos y uso de enemigos como escudo.',
    rules: [
      {
        title: '¿Importa la diferencia de tamaño corporal?',
        badge: 'REGLA OFICIAL BODY',
        content: 'En Cyberpunk RED NO hay penalizadores en la tirada de dados por diferencia de tamaño físico o corpulencia. Sin embargo, el STAT BODY determina la letalidad absoluta: tanto Choke (Ahorcar) como Throw (Lanzar) infligen un daño igual a tu valor de BODY directo a los HP de la víctima ignorando toda armadura. Un personaje con Linear Frame Beta (BODY 14) inflige 14 de daño verdadero directo por turno.',
        mechanic: 'Daño de Choke / Throw = STAT BODY directo a HP (ignora SP de armadura).'
      },
      {
        title: 'Iniciar o Romper un Grapple',
        badge: 'TIRADA ENFRENTADA',
        content: 'Requiere 1 Acción y tener al menos una mano libre. Se resuelve mediante tirada enfrentada del atacante contra el defensor. Para romper el Grapple en su turno, la víctima gasta su Acción intentando superar la misma tirada enfrentada.',
        mechanic: 'Atacante: DEX + Brawling + 1d10  vs  Defensor: DEX + Brawling + 1d10'
      },
      {
        title: 'Efectos de estar en Grapple',
        badge: 'ESTADO ALTERADO',
        content: 'Ambos participantes sufren un penalizador de -2 a todas sus acciones mientras el agarre continúe. Ninguno puede usar armas que requieran dos manos (2H). El atacante puede arrastrar a la víctima consigo cuando utiliza su Movimiento.',
        mechanic: '-2 a todas las acciones • Prohibido armas 2H • Atacante arrastra a víctima.'
      },
      {
        title: 'Choke (Ahorcar)',
        badge: 'DAÑO DIRECTO A HP',
        content: 'Acción del atacante en su turno mientras mantiene a la víctima agarrada. No requiere tirada adicional: inflige automáticamente tu STAT BODY en daño directo a los puntos de vida de la víctima (ignora SP). Si mantienes el Choke durante 3 turnos consecutivos, la víctima cae Inconsciente automáticamente, sin importar cuántos HP le queden.',
        mechanic: 'Inflige BODY directo a HP cada turno. 3 turnos seguidos = Inconsciencia automática.'
      },
      {
        title: 'Throw (Lanzar al suelo)',
        badge: 'DERRIBO + DAÑO',
        content: 'Acción del atacante mientras mantiene el Grapple. Lanza al defensor contra el suelo u otra superficie a hasta 2 metros. Inflige daño igual a tu STAT BODY directo a HP (ignora SP), termina el Grapple de inmediato y deja a la víctima Prone (Derribada).',
        mechanic: 'Inflige BODY directo a HP • Termina agarre • Objetivo queda Prone (debe gastar Move para levantarse).'
      },
      {
        title: 'Equipar como Escudo Humano',
        badge: 'COBERTURA VIVA',
        content: 'Acción del atacante en Grapple. Colocas a la víctima entre tú y la línea de fuego enemiga. La víctima actúa como cobertura viva: todos los disparos dirigidos contra ti impactan en la víctima con SP 0 (su cuerpo absorbe el daño restando directamente de sus HP).',
        mechanic: 'Ataques dirigidos a ti impactan a la víctima con SP 0 contra su propio HP.'
      }
    ]
  },
  {
    id: 'aimed_shots',
    category: 'aimed',
    icon: '🎯',
    title: 'DISPAROS APUNTADOS (AIMED SHOTS)',
    pageRef: 'Core pág. 171',
    summary: 'Ataques de precisión a partes corporales específicas u objetos sostenidos.',
    rules: [
      {
        title: 'Requisitos y Penalizador General',
        badge: 'PENALIZADOR -8',
        content: 'Un Disparo Apuntado requiere que toda tu Acción de Ataque se concentre en un solo disparo (ROF máximo 1, incluso si el arma tiene ROF 2). Aplica un penalizador de -8 a la tirada de ataque.',
        mechanic: 'Penalizador: -8 a la tirada de ataque • ROF fijo: 1 por Acción de Ataque.'
      },
      {
        title: 'Disparo a la Cabeza (Headshot)',
        badge: 'DAÑO MULTIPLICADO ×2',
        content: 'Apunta a la cabeza del objetivo (-8). Se resuelve contra el SP del casco/cabeza del defensor. Todo el daño que supere el SP de la cabeza se multiplica por 2 (×2) directamente a los HP del defensor.',
        mechanic: 'Daño a HP = (Daño total - SP Cabeza) × 2. Provoca Herida Crítica en cabeza con dos 6s.'
      },
      {
        title: 'Disparo a la Pierna',
        badge: 'HERIDA CRÍTICA AUTOMÁTICA',
        content: 'Apunta a la pierna del objetivo (-8). Se resuelve contra el SP corporal. Si al menos 1 punto de daño supera el SP del defensor, este sufre automáticamente la Herida Crítica Pierna Rota (-4 MOVE, no acumulable) sin necesidad de sacar dos 6s en los dados.',
        mechanic: 'Si daño > SP Torso: Herida Crítica "Pierna Rota" automática (-4 a MOVE).'
      },
      {
        title: 'Disparo a la Mano / Objeto Sostenido',
        badge: 'DESARME INMEDIATO',
        content: 'Apunta a la mano del objetivo o al objeto/arma que sostiene (-8). Se resuelve contra el SP corporal. Si al menos 1 punto de daño supera el SP del defensor, este suelta inmediatamente el arma u objeto sostenido en esa mano al suelo.',
        mechanic: 'Si daño > SP Torso: La víctima suelta el objeto o arma al suelo inmediatamente.'
      }
    ]
  },
  {
    id: 'hazards_environment',
    category: 'hazards',
    icon: '🔥',
    title: 'FUEGO, CAÍDAS, ASFIXIA & ATROPELLOS',
    pageRef: 'Core pág. 180-181',
    summary: 'Peligros ambientales, daño por fuego continuo, caídas desde alturas y colisiones vehiculares.',
    rules: [
      {
        title: 'Estar en Llamas (On Fire)',
        badge: 'DAÑO DIRECTO AL TURNO',
        content: 'Al final de tu turno sufres daño directo a tus puntos de vida ignorando armadura según la intensidad del fuego: Leve (2 HP/turno), Fuerte (4 HP/turno), Químico o Mortal (6 HP/turno). El fuego persiste hasta que el personaje o un aliado adyacente gaste 1 Acción Principal completa en apagarlo.',
        mechanic: 'Leve: 2 HP/turno • Fuerte: 4 HP/turno • Químico: 6 HP/turno (ignora SP). Apagar = 1 Acción.'
      },
      {
        title: 'Caídas desde Altura',
        badge: '2d6 CADA 10 METROS',
        content: 'Caer 10 metros o más inflige 2d6 puntos de daño por cada 10 metros de caída directamente al cuerpo. Además, provoca automáticamente la Herida Crítica Pierna Rota a menos que el personaje supere una tirada de DEX + Athletics DV 15.',
        mechanic: 'Daño: 2d6 por cada 10m. Tirada de salvación: DEX + Athletics vs DV 15 para evitar Pierna Rota.'
      },
      {
        title: 'Asfixia y Ahogamiento',
        badge: 'AGUANTE = WILL',
        content: 'Puedes aguantar la respiración durante un número de minutos igual a tu STAT WILL (o un número de turnos igual a tu WILL si fuiste arrojado al vacío/agua de sorpresa sin tomar aire). Pasado ese tiempo, sufres daño directo a HP igual a tu STAT BODY al final de cada turno hasta respirar o morir.',
        mechanic: 'Aguante: WILL minutos (o turnos por sorpresa). Daño posterior: BODY directo a HP/turno.'
      },
      {
        title: 'Atropello / Colisión Vehicular',
        badge: '6d6 + LATIGAZO CERVICAL',
        content: 'Ser impactado por un vehículo en movimiento inflige 6d6 puntos de daño, derriba al personaje (queda Prone) y causa automáticamente la Herida Crítica Latigazo Cervical (Whiplash), que inflige penalizadores severos hasta ser tratada.',
        mechanic: 'Daño: 6d6 • Estado: Prone • Herida Crítica automática: Whiplash.'
      }
    ]
  },
  {
    id: 'healing_death_save',
    category: 'healing',
    icon: '💉',
    title: 'CURACIÓN, ESTABILIZACIÓN & DEATH SAVE',
    pageRef: 'Core pág. 222-224',
    summary: 'Estabilización médica, recuperación natural de HP y tiradas de salvación contra la muerte a 0 HP.',
    rules: [
      {
        title: 'Estabilizar Heridas (Primeros Auxilios / Paramédico)',
        badge: 'DV SEGÚN ESTADO VITAL',
        content: 'Detiene el deterioro vital. Se realiza con First Aid o Paramedic: DV 10 si el objetivo está en estado Herido Leve (> 50% HP), DV 13 si está en Herida Grave (≤ 50% HP), y DV 15 si está Mortalmente Herido (0 HP). Un paciente solo puede recibir un intento de estabilización por día a menos que su estado empeore.',
        mechanic: 'Herido Leve: DV 10 • Herida Grave: DV 13 • Mortalmente Herido (0 HP): DV 15.'
      },
      {
        title: 'Curación Natural Diaria',
        badge: 'RECUPERACIÓN = BODY/DÍA',
        content: 'Una vez estabilizado, el personaje recupera un número de HP igual a su STAT BODY por cada período de 24 horas continuas de descanso ligero. La atención médica profesional o el uso de Speedheal puede acelerar este proceso.',
        mechanic: 'Recuperación: BODY puntos de HP por día completo de descanso estabilizado.'
      },
      {
        title: 'Salvación de Muerte (Death Save a 0 HP)',
        badge: '1d10 < BODY',
        content: 'Si tu personaje tiene 0 HP, al inicio de cada uno de tus turnos debes tirar 1d10 (Death Save). Para sobrevivir, debes sacar un resultado MENOR que tu valor de STAT BODY. Un 10 siempre es fallo y muerte instantánea. Cada turno que continúes a 0 HP sin estabilizar, recibes un penalizador acumulativo de +1 a tus tiradas de Death Save.',
        mechanic: 'Tirada: 1d10 + Penalizador acumulativo (+1 por cada turno a 0 HP) DEBE ser MENOR que BODY.'
      }
    ]
  },
  {
    id: 'turn_structure',
    category: 'turn',
    icon: '⏱️',
    title: 'ESTRUCTURA DEL TURNO & ACCIONES',
    pageRef: 'Core pág. 126-127',
    summary: 'Tiempo de ronda (3 segundos), Acción de Movimiento y Acciones Principales disponibles.',
    rules: [
      {
        title: 'Presupuesto de Acción por Turno',
        badge: '1 MOVE + 1 ACCIÓN',
        content: 'Cada ronda de combate representa 3 segundos en Night City. En tu turno tienes exactamente: 1 Acción de Movimiento (te permite desplazarte hasta MOVE × 2 metros) y 1 Acción Principal. Puedes intercalar tu movimiento antes, durante y después de tu acción principal.',
        mechanic: '1 Movimiento (MOVE × 2m) + 1 Acción Principal por turno.'
      },
      {
        title: 'Catálogo de Acciones Principales',
        badge: 'ACCIONES DISPONIBLES',
        content: 'Atacar (según ROF del arma), Correr (Run: gastas tu acción principal para mover otros MOVE × 2m adicionales), Recargar arma, Agarrar (Grapple), Escapar de agarre, Apuntar (Aim: +1 a tu siguiente ataque si no te mueves), Levantarse (Get Up: levantarse de Prone cuesta 2m de movimiento o tu acción), Usar objeto o droga, Estabilizar herido, y Acciones de Red (Netrun).',
        mechanic: 'Atacar • Correr • Recargar • Grapple • Escapar • Apuntar • Levantarse • Usar Objeto • Estabilizar'
      }
    ]
  }
];
