import { buildRoleGuides } from './roleProgression';
/**
 * NET ARCHITECTURES, 2077 QUICKHACKS, ROLES & VEHICLES DATA CATALOG
 * Fase 3 Deep Systems: Netrunning 2045, Quickhacking 2077, 10 Role Guides, 14 Vehicles, GM Loot & Portraits
 */

// ============================================================================
// 1. ACCIONES DE INTERFAZ & PRESETS DE ARQUITECTURAS DE RED (NETRUNNING 2045)
// ============================================================================

/**
 * NET Actions por turno. CEMK p. 15: "1 Meat Action or up to 3 Net Actions" para cualquier rango.
 * Decisión del usuario (2026-10-20): CEMK manda sobre la tabla 2/3/4/5 del Core p. 197.
 */
export const NET_ACTIONS_PER_TURN = 3;
/** Conexión directa por Interface Plug al Neuroport: +1 NET Action por turno (CEMK p. 27). */
export const NET_ACTIONS_DIRECT_CONNECTION_BONUS = 1;

export interface NetAction {
  id: string;
  name: string;
  cost: string;
  dv: string;
  defaultDv: number;
  description: string;
  exactEffect: string;
  prerequisites: string;
  dvResolution: string;
  checkFormula: string;
}

export const NET_ACTIONS_CATALOG: NetAction[] = [
  {
    id: 'pathfinder',
    name: 'Pathfinder',
    cost: '1 NET Action',
    dv: 'Dificultad de Red (DV 6 a 12)',
    defaultDv: 8,
    description: 'Mapea la topología de la arquitectura revelando pisos, nodos de control y Black ICE.',
    exactEffect: 'Escanea la arquitectura revelando 1 piso por cada punto obtenido en tu tirada (1d10 + Interface). Se detiene prematuramente si choca con un Password cuyo DV sea mayor al resultado de tu tirada.',
    prerequisites: 'Estar conectado a un Punto de Acceso (Access Point) a <= 6 metros.',
    dvResolution: 'Basic DV 6, Standard DV 8, Uncommon DV 10, Advanced DV 12.',
    checkFormula: 'Interface + 1d10 vs DV de Dificultad'
  },
  {
    id: 'backdoor',
    name: 'Backdoor',
    cost: '1 NET Action',
    dv: 'Password DV (DV 6 a 12)',
    defaultDv: 8,
    description: 'Fuerza la brecha a través de un piso de Contraseña (Password) para acceder a niveles inferiores.',
    exactEffect: 'Hackea y desactiva el bloqueo de un Password. Con éxito, el piso queda desbloqueado permanentemente para ti y tus aliados, permitiendo el tránsito libre a los pisos siguientes.',
    prerequisites: 'Estar en el mismo piso que el nodo de Password bloqueado.',
    dvResolution: 'Basic DV 6, Standard DV 8, Uncommon DV 10, Advanced DV 12 (Core p. 210). Si conoces el Password pasas automáticamente (Core p. 199).',
    checkFormula: 'Interface + 1d10 vs DV del Password'
  },
  {
    id: 'eye-dee',
    name: 'Eye-Dee',
    cost: '1 NET Action',
    dv: 'DV del File (algunos no tienen DV)',
    defaultDv: 8,
    description: 'Examina e identifica archivos, programas hostiles y nodos de control.',
    exactEffect: 'Te dice qué es un dato encontrado (como un File) y cuánto vale. Algunos Files tienen un DV que hay que superar para saber algo de ellos (Core p. 199).',
    prerequisites: 'Estar en el mismo piso que el File, Control Node o Black ICE objetivo.',
    dvResolution: 'El DV del File según la dificultad de la arquitectura: Basic 6, Standard 8, Uncommon 10, Advanced 12 (Core p. 210).',
    checkFormula: 'Interface + 1d10 vs DV del File'
  },
  {
    id: 'control',
    name: 'Control',
    cost: '1 NET Action',
    dv: 'Control Node DV (DV 6 a 12)',
    defaultDv: 8,
    description: 'Toma el dominio de dispositivos físicos conectados en el mundo real.',
    exactEffect: 'Tomas el Control Node (cámaras, drones, torretas, ascensores, aspersores, etc.). Operar cada cosa conectada cuesta otra NET Action, desde cualquier piso mientras lo controles. Cada Control Node se activa una sola vez por turno. Para quitárselo a otro Netrunner o Demon el DV es su Control Check. Lo pierdes al hacer Jack Out (Core p. 199).',
    prerequisites: 'Estar en el mismo piso que el Control Node y haber superado Passwords previos.',
    dvResolution: 'Basic DV 6, Standard DV 8, Uncommon DV 10, Advanced DV 12.',
    checkFormula: 'Interface + 1d10 vs DV del Nodo de Control'
  },
  {
    id: 'slide',
    name: 'Slide',
    cost: '1 NET Action',
    dv: 'Perception del Black ICE',
    defaultDv: 8,
    description: 'Movimiento evasivo en el ciberespacio para desengancharse de un combate.',
    exactEffect: 'Huye del combate con un Black ICE hostil (no Demonio central) hacia un piso adyacente (arriba o abajo). Si tu tirada supera la Perception del Black ICE, este pierde tu rastro y no te sigue.',
    prerequisites: 'Estar trabado en combate con Black ICE en el piso actual. Máximo 1 intento de Slide por turno.',
    dvResolution: 'Tirada enfrentada: Interface + 1d10 vs Perception del Black ICE + 1d10.',
    checkFormula: 'Interface + 1d10 vs Perception de Black ICE'
  },
  {
    id: 'virus',
    name: 'Virus',
    cost: 'Las NET Actions que fije el GM',
    dv: 'Fijado por el GM',
    defaultDv: 10,
    description: 'Crea y programa un efecto permanente o sabotaje en el núcleo del sistema.',
    exactEffect: 'En el piso más bajo dejas un Virus que hace hasta 2 acciones o cambios razonables; es lo único que persiste tras el Jack Out. El DV para destruirlo es tu Virus Check (Core p. 200).',
    prerequisites: 'Haber llegado al piso más bajo de la arquitectura.',
    dvResolution: 'Ejemplos del Core p. 200: cambiar iconos DV 6 y 1 NET Action; desactivar un Black ICE o un Control Node DV 10 y 2 NET Actions; borrar todo el Black ICE DV 12 y 10 NET Actions.',
    checkFormula: 'Interface + 1d10 vs DV de Complejidad'
  },
  {
    id: 'cloak',
    name: 'Cloak',
    cost: '1 NET Action',
    dv: 'Tu resultado fija el DV del SysAdmin',
    defaultDv: 8,
    description: 'Borra huellas neuronales y oculta virus o brechas dejadas en la arquitectura.',
    exactEffect: 'Oculta tus rastros y cualquier Virus implantado. El resultado total de tu tirada (1d10 + Interface) se convierte en el DV que el SysAdmin o Netrunner defensor deberá superar con Pathfinder para detectar tu presencia.',
    prerequisites: 'Estar conectado a la red tras haber realizado acciones o implantado un Virus.',
    dvResolution: 'El total obtenido se registra como DV de detección para la red.',
    checkFormula: 'Total Roll = DV Defensivo contra SysAdmin'
  },
  {
    id: 'scanner',
    name: 'Scanner',
    cost: '1 Meat Action (NET Action con Quickhacking, CEMK p. 26)',
    dv: 'Sin DV: el GM interpreta el total',
    defaultDv: 0,
    description: 'Rastrea puntos de acceso inalámbricos (Access Points) en el entorno físico.',
    exactEffect: 'Encuentra la ubicación en Meatspace de los access points de las arquitecturas NET de la zona. Cuanto más alto el total, más encuentras y desde más lejos; el GM decide cuánto (Core p. 199).',
    prerequisites: 'Usa una Meat Action, no una NET Action (Core p. 199).',
    dvResolution: 'Sin DV fijo (Core p. 199).',
    checkFormula: 'Interface + 1d10 (el GM interpreta el total)'
  },
  {
    id: 'zap',
    name: 'Zap',
    cost: '1 NET Action',
    dv: 'Defensa del Objetivo',
    defaultDv: 8,
    description: 'Descarga eléctrica y neural contra un programa hostil o Netrunner enemigo.',
    exactEffect: 'Dispara un pulso neuronal que inflige 1d6 de daño directo al REZ de un programa/Black ICE enemigo o a la mente de un Netrunner enemigo (daño directo a HP ignorando armadura corporal).',
    prerequisites: 'Estar en el mismo piso que el programa, Black ICE o Netrunner objetivo.',
    dvResolution: 'Tirada enfrentada: Interface + 1d10 vs Defensa del programa o Interface + 1d10 del Netrunner.',
    checkFormula: 'Interface + 1d10 vs Defensa (Daño: 1d6)'
  }
];

export const NET_INTERFACE_ACTIONS = NET_ACTIONS_CATALOG;

export interface NetFloor {
  floorNumber: number;
  type: 'Password' | 'File' | 'Control Node' | 'Black ICE' | 'Empty';
  name: string;
  dv?: number;
  iceType?: string;
  iceHp?: number;
  iceAtk?: number;
  iceDef?: number;
  rewardOrDevice?: string;
}

export interface NetArchitecturePreset {
  id: string;
  name: string;
  difficulty: 'Basic' | 'Standard' | 'Uncommon' | 'Advanced'; // Core p. 210
  totalFloors: number;
  floors: NetFloor[];
  loreDescription: string;
}

/** Black ICE del Core pp. 206-207: PER, SPD, ATK, DEF, REZ. */
export const BLACK_ICE_STATS: Record<string, { per: number; spd: number; atk: number; def: number; rez: number }> = {
  Asp: { per: 4, spd: 6, atk: 2, def: 2, rez: 15 },
  Giant: { per: 2, spd: 2, atk: 8, def: 4, rez: 25 },
  Hellhound: { per: 6, spd: 6, atk: 6, def: 2, rez: 20 },
  Kraken: { per: 6, spd: 2, atk: 8, def: 4, rez: 30 },
  Liche: { per: 8, spd: 2, atk: 6, def: 2, rez: 25 },
  Raven: { per: 6, spd: 4, atk: 4, def: 2, rez: 15 },
  Scorpion: { per: 2, spd: 6, atk: 2, def: 2, rez: 15 },
  Skunk: { per: 2, spd: 4, atk: 4, def: 2, rez: 10 },
  Wisp: { per: 4, spd: 4, atk: 4, def: 2, rez: 15 },
  Dragon: { per: 6, spd: 4, atk: 6, def: 6, rez: 30 },
  Killer: { per: 4, spd: 8, atk: 6, def: 2, rez: 20 },
  Sabertooth: { per: 8, spd: 6, atk: 6, def: 2, rez: 25 },
};

export const NET_ARCHITECTURE_PRESETS: NetArchitecturePreset[] = [
  {
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
        rewardOrDevice: 'PER 6, SPD 6, ATK 6, DEF 2, REZ 20 — Causa 2d6 daño mental e incendia ropa/cyberdeck'
      },
      {
        floorNumber: 5,
        type: 'Control Node',
        name: 'Control Node: Controls the Automated Turret',
        dv: 8,
        rewardOrDevice: 'Toma el control de la Torreta Automática del Vagón Delantero (+14 ataque, 5d6 daño, Autofire 2d6×4)'
      }
    ]
  },
  {
    id: 'net-basic-kiosk',
    name: 'Kiosco Nocturno / Terminal de Venta',
    difficulty: 'Basic',
    totalFloors: 3,
    loreDescription: 'Sub-red comercial de bajo costo usada en Night Markets para validar transacciones de Eurodólares.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Firewall Básico', dv: 6 },
      { floorNumber: 2, type: 'File', name: 'Registro de Ventas del Día', dv: 6, rewardOrDevice: 'Datos financieros (100 €$)' },
      { floorNumber: 3, type: 'Control Node', name: 'Cámara de Seguridad y Alarma', dv: 6, rewardOrDevice: 'Desactivar alarma del puesto' }
    ]
  },
  {
    id: 'net-local-bar',
    name: 'Red Interna de Bodega / Bar El Coyote Cojo',
    difficulty: 'Basic',
    totalFloors: 4,
    loreDescription: 'Arquitectura de seguridad modesta para proteger inventario de licor y cámaras de barullo.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Enlace Wi-Fi Corporativo', dv: 6 },
      { floorNumber: 2, type: 'Black ICE', name: 'Asp (Anti-Netrunner)', iceType: 'Asp', iceHp: 15, iceAtk: 2, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Luces y Cierre de Puerta Trasera', dv: 8, rewardOrDevice: 'Bloquear/desbloquear salidas' },
      { floorNumber: 4, type: 'File', name: 'Lista de Deudores y Contrabando', dv: 8, rewardOrDevice: 'Chantaje a clientes (300 €$)' }
    ]
  },
  {
    id: 'net-trauma-clinic',
    name: 'Clínica de Traumatología Regional',
    difficulty: 'Standard',
    totalFloors: 5,
    loreDescription: 'Red médica de nivel medio que custodia bóvedas de fármacos y registros de implantes instalados.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Gateway de Pacientes', dv: 8 },
      { floorNumber: 2, type: 'Black ICE', name: 'Raven (Rastreador)', iceType: 'Raven', iceHp: 15, iceAtk: 4, iceDef: 2 },
      { floorNumber: 3, type: 'File', name: 'Códigos de Acceso a Farmacia', dv: 8, rewardOrDevice: 'Acceso a Speedheal & Drogas' },
      { floorNumber: 4, type: 'Black ICE', name: 'Hellhound (Anti-Personal Ígneo)', iceType: 'Hellhound', iceHp: 20, iceAtk: 6, iceDef: 2 },
      { floorNumber: 5, type: 'Control Node', name: 'Cámaras Criogénicas y Escáneres', dv: 10, rewardOrDevice: 'Sobrecargar criotanques' }
    ]
  },
  {
    id: 'net-militech-outpost',
    name: 'Puesto Táctico Avanzado de Militech',
    difficulty: 'Uncommon',
    totalFloors: 6,
    loreDescription: 'Instalación fortificada con torretas de defensa automatizadas y personal de seguridad privada.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Protocolo Aegis Militar', dv: 10 },
      { floorNumber: 2, type: 'Black ICE', name: 'Hellhound (Sabueso Devastador)', iceType: 'Hellhound', iceHp: 20, iceAtk: 6, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Torreta Automática de Techo (5d6)', dv: 10, rewardOrDevice: 'Disparar contra tropas Militech' },
      { floorNumber: 4, type: 'File', name: 'Rutas de Patrulla y Armería', dv: 10, rewardOrDevice: 'Clave de bóveda de armas pesadas' },
      { floorNumber: 5, type: 'Black ICE', name: 'Kraken (Anti-Personnel)', iceType: 'Kraken', iceHp: 30, iceAtk: 8, iceDef: 4 },
      { floorNumber: 6, type: 'Control Node', name: 'Puertas Blindadas y Esclusas de Asalto', dv: 10, rewardOrDevice: 'Aislar el complejo' }
    ]
  },
  {
    id: 'net-arasaka-vault',
    name: 'Bóveda de Proyectos Negros de Arasaka',
    difficulty: 'Advanced',
    totalFloors: 7,
    loreDescription: 'La arquitectura más implacable de Night City. Custodiada por Black ICE letal de grado militar.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Cifrado Cuántico Arasaka', dv: 12 },
      { floorNumber: 2, type: 'Black ICE', name: 'Giant (Aplastador Mental)', iceType: 'Giant', iceHp: 25, iceAtk: 8, iceDef: 4 },
      { floorNumber: 3, type: 'File', name: 'Esquema de Ciberware Experimental', dv: 12, rewardOrDevice: 'Datos clasificados (5,000 €$)' },
      { floorNumber: 4, type: 'Black ICE', name: 'Dragon (Guardián Imperial)', iceType: 'Dragon', iceHp: 30, iceAtk: 6, iceDef: 6 },
      { floorNumber: 5, type: 'Control Node', name: 'Defensas Láser y Gas Nervioso', dv: 12, rewardOrDevice: 'Desactivar medidas letales' },
      { floorNumber: 6, type: 'Black ICE', name: 'Liche (Muerte Cerebral Automática)', iceType: 'Liche', iceHp: 25, iceAtk: 6, iceDef: 2 },
      { floorNumber: 7, type: 'File', name: 'Núcleo Maestro del Proyecto Soulkiller', dv: 12, rewardOrDevice: 'Información que cambia el mundo' }
    ]
  },
  {
    id: 'net-zetatech-lab',
    name: 'Laboratorio de Drones Zetatech R&D',
    difficulty: 'Uncommon',
    totalFloors: 6,
    loreDescription: 'Red de investigación que controla líneas de ensamblaje robóticas y prototipos autónomos.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Barrera Criptográfica Zeta', dv: 10 },
      { floorNumber: 2, type: 'Black ICE', name: 'Killer (Desmantelador de Software)', iceType: 'Killer', iceHp: 20, iceAtk: 6, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Drones de Patrulla Aérea Octocópteros', dv: 10, rewardOrDevice: 'Ordenar aterrizaje de emergencia' },
      { floorNumber: 4, type: 'Black ICE', name: 'Sabertooth (Perseguidor Rápido)', iceType: 'Sabertooth', iceHp: 25, iceAtk: 6, iceDef: 2 },
      { floorNumber: 5, type: 'Control Node', name: 'Línea de Montaje de Torretas', dv: 10, rewardOrDevice: 'Causar explosión en cadena' },
      { floorNumber: 6, type: 'File', name: 'Planos de Fabricación del Samson FBC', dv: 12, rewardOrDevice: 'Planos industriales de valor supremo' }
    ]
  },
  {
    id: 'net-danger-gal-archive',
    name: 'Archivo Central de Inteligencia Danger Gal',
    difficulty: 'Uncommon',
    totalFloors: 6,
    loreDescription: 'Servidor central protegido por la red de Michiko Sanderson con expedientes confidenciales.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Acceso Gatuno Encriptado', dv: 10 },
      { floorNumber: 2, type: 'Black ICE', name: 'Wisp (Interferidor Óptico)', iceType: 'Wisp', iceHp: 15, iceAtk: 4, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Micrófonos y Cámaras Espía del Edificio', dv: 10, rewardOrDevice: 'Intercepción de audio' },
      { floorNumber: 4, type: 'Black ICE', name: 'Skunk (Rastreador Fétido)', iceType: 'Skunk', iceHp: 10, iceAtk: 4, iceDef: 2 },
      { floorNumber: 5, type: 'File', name: 'Expedientes de Operativos de Night City', dv: 12, rewardOrDevice: 'Secretos de todas las facciones' },
      { floorNumber: 6, type: 'Control Node', name: 'Servidor de Borrado Térmico de Emergencia', dv: 12, rewardOrDevice: 'Purgar base de datos' }
    ]
  },
  {
    id: 'net-nomad-convoy',
    name: 'Red Telemétrica del Mega-Convoy Nómada',
    difficulty: 'Standard',
    totalFloors: 5,
    loreDescription: 'Red de radioenlace satelital que coordina camiones blindados y escoltas armadas en las Badlands.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Filtro de Frecuencia Nómada', dv: 8 },
      { floorNumber: 2, type: 'Black ICE', name: 'Scorpion (Picadura Neuronal)', iceType: 'Scorpion', iceHp: 15, iceAtk: 2, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Navegación GPS y Freno del Convoy', dv: 8, rewardOrDevice: 'Detener los vehículos' },
      { floorNumber: 4, type: 'File', name: 'Manifiesto de Carga y Rutas de Contrabando', dv: 10, rewardOrDevice: 'Ubicación de alijos en el desierto' },
      { floorNumber: 5, type: 'Control Node', name: 'Lanzacohetes Montado en Camión Líder', dv: 10, rewardOrDevice: 'Disparo de cohetes tácticos' }
    ]
  }
];

// Helper para generar pisos procedurales
export function generateRandomNetFloor(floorNumber: number, difficulty: 'easy' | 'medium' | 'hard'): NetFloor {
  const types: NetFloor['type'][] = ['Password', 'File', 'Control Node', 'Black ICE'];
  const t = types[Math.floor(Math.random() * types.length)];
  const dv = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;

  if (t === 'Black ICE') {
    const iceNames = ['Asp', 'Raven', 'Hellhound', 'Kraken', 'Giant', 'Dragon'];
    const chosen = iceNames[Math.floor(Math.random() * iceNames.length)];
    return {
      floorNumber,
      type: 'Black ICE',
      name: `${chosen} Guardián`,
      iceType: chosen,
      iceHp: BLACK_ICE_STATS[chosen].rez,
      iceAtk: BLACK_ICE_STATS[chosen].atk,
      iceDef: BLACK_ICE_STATS[chosen].def
    };
  }

  return {
    floorNumber,
    type: t,
    name: `${t} Nivel ${floorNumber}`,
    dv
  };
}

// ============================================================================
// 2. CATÁLOGO DE LOS 11 QUICKHACKS OFICIALES (ERA 2077 - CEMK pp. 16-17)
// ============================================================================

export interface Quickhack2077 {
  id: string;
  name: string;
  tier: 'Simple' | 'Standard' | 'Difficult' | 'Advanced';
  dv: number;
  actionCost: string; // '1 NET Action'
  duration: string;
  damage?: string;
  damageFormula?: '1d6' | '3d6';
  effect: string;
  loreDescription: string;
  requiredInterfaceRank: number;
}

export const QUICKHACKS_2077_CATALOG: Quickhack2077[] = [
  // 1. Simple Quickhacks (DV 6 — Desbloqueados en Interface Rango 1+)
  {
    id: 'qh-impair-movement',
    name: 'Impair Movement',
    tier: 'Simple',
    dv: 6,
    actionCost: '1 NET Action',
    duration: '60 segundos (20 Rondas)',
    effect: 'El MOVE del objetivo se reduce en 1 durante los próximos 60 segundos (20 Rondas). Si se reduce a 0 MOVE, no puede realizar una Acción de Movimiento (Move Action).',
    loreDescription: 'Sobrecarga los micro-servomotores o impulsos motores corporales frenando el desplazamiento.',
    requiredInterfaceRank: 1
  },
  {
    id: 'qh-sonic-shock',
    name: 'Sonic Shock',
    tier: 'Simple',
    dv: 6,
    actionCost: '1 NET Action',
    duration: '60 segundos (20 Rondas)',
    effect: 'El objetivo sufre el efecto de la Herida Crítica "Damaged Ear" (Oído Dañado: si se mueve más de 4m en un turno no puede moverse en el siguiente, y -2 a Perception auditiva), pero NO sufre el Daño Bono (+5). El efecto dura 60 segundos (20 Rondas).',
    loreDescription: 'Dispara una frecuencia resonante ensordecedora directo al córtex auditivo o suite cibernética.',
    requiredInterfaceRank: 1
  },

  // 2. Standard Quickhacks (DV 8 — Desbloqueados en Interface Rango 2+)
  {
    id: 'qh-overheat',
    name: 'Overheat',
    tier: 'Standard',
    dv: 8,
    actionCost: '1 NET Action',
    duration: 'Hasta apagar el fuego',
    damage: '4 Daño directo a HP/turno (ignora SP)',
    effect: 'El objetivo está en llamas. Sufre 4 puntos de daño directamente a sus HP al final de cada uno de sus Turnos hasta que apague el fuego. Este daño ignora la armadura (SP) y NO la ablaciona. Apagar el fuego requiere 1 Acción (ROF 1) en el turno del objetivo.',
    loreDescription: 'Inyecta un bucle térmico que sobrecalienta los disipadores subcutáneos del Neuroport enemigo.',
    requiredInterfaceRank: 2
  },
  {
    id: 'qh-short-circuit',
    name: 'Short Circuit',
    tier: 'Standard',
    dv: 8,
    actionCost: '1 NET Action',
    duration: '60 segundos (20 Rondas)',
    effect: 'El GM elige 3 piezas de ciberware del objetivo que NO sean Cyberarm, Cyberleg, Cybereye, Cyberaudio Suite, Neuroport ni Neuroport Cyberdeck Expansion (las opciones instaladas en ellos como Mantis Blades o Low Light/IR/UV SÍ pueden ser elegidas). El ciberware seleccionado deja de funcionar durante 60 segundos (20 Rondas).',
    loreDescription: 'Descarga un pico de alto voltaje selectivo para freír circuitos integrados y actuadores secundarios.',
    requiredInterfaceRank: 2
  },

  // 3. Difficult Quickhacks (DV 10 — Desbloqueados en Interface Rango 3+)
  {
    id: 'qh-cyberware-malfunction',
    name: 'Cyberware Malfunction',
    tier: 'Difficult',
    dv: 10,
    actionCost: '1 NET Action',
    duration: '60 segundos (20 Rondas)',
    effect: 'El jugador del Netrunner elige 1 pieza de ciberware del objetivo (excepto Neuroport o Neuroport Cyberdeck Port) para que quede inoperativa durante 60 segundos (20 Rondas). Las Ciberextremidades (Cyberlimbs) inoperativas actúan como si tuvieran la Herida Crítica "Broken Arm" o "Broken Leg". Todas las opciones acopladas a ese implante también dejan de funcionar.',
    loreDescription: 'Ataque quirúrgico con control total del atacante para anular el implante más peligroso del enemigo.',
    requiredInterfaceRank: 3
  },
  {
    id: 'qh-lure',
    name: 'Lure',
    tier: 'Difficult',
    dv: 10,
    actionCost: '1 NET Action',
    duration: '1 Turno',
    effect: 'Al inicio del próximo Turno del objetivo, está forzado a realizar una Acción de Movimiento (Move Action) controlada por el Netrunner, sintiéndose compelido a investigar un ruido fantasma que solo él oye. Lure solo funciona si el objetivo NO sabe que un Netrunner hizo Jack In. A diferencia de otros Quickhacks, Lure NO alerta al objetivo de que fue hackeado. No puedes atraer a alguien por un precipicio ni hacia un peligro físico evidente.',
    loreDescription: 'Genera alucinaciones auditivas subliminales para mover centinelas sin romper el sigilo.',
    requiredInterfaceRank: 3
  },
  {
    id: 'qh-slow',
    name: 'Slow',
    tier: 'Difficult',
    dv: 10,
    actionCost: '1 NET Action',
    duration: '60 segundos (20 Rondas)',
    damage: '1d6 reducción de MOVE',
    damageFormula: '1d6',
    effect: 'El MOVE del objetivo se reduce en 1d6 durante los próximos 60 segundos (20 Rondas). Si se reduce a 0 MOVE, no puede realizar una Acción de Movimiento (Move Action).',
    loreDescription: 'Bloquea drásticamente los enlaces bio-ópticos motores dejando al objetivo casi inmóvil.',
    requiredInterfaceRank: 3
  },
  {
    id: 'qh-synapse-burnout',
    name: 'Synapse Burnout',
    tier: 'Difficult',
    dv: 10,
    actionCost: '1 NET Action',
    duration: 'Instantáneo',
    damage: '3d6 daño directo a HP (ignora SP)',
    damageFormula: '3d6',
    effect: 'Causa 3d6 de daño directamente a los HP del objetivo. Este daño ignora la armadura (SP) y NO la ablaciona.',
    loreDescription: 'Sobrecarga neuroeléctrica brutal dirigida contra el córtex del objetivo, friendo tejido vivo.',
    requiredInterfaceRank: 3
  },

  // 4. Advanced Quickhacks (DV 12 — Desbloqueados en Interface Rango 4+)
  {
    id: 'qh-puppet',
    name: 'Puppet',
    tier: 'Advanced',
    dv: 12,
    actionCost: '1 NET Action',
    duration: '1 Turno',
    effect: 'Controlas tanto la Acción (Action) como la Acción de Movimiento (Move Action) del objetivo durante su próximo Turno. Puedes hacer que se ataque a sí mismo con su arma, que saque el seguro de su propia granada (pull a pin on their grenade), o que le dispare a su propio compañero (choomba). Todas las tiradas se realizan usando los STATs y Skills del objetivo en lugar de los del Netrunner.',
    loreDescription: 'Secuestro psicomotor total del cuerpo anfitrión forzándolo a cometer fratricidio o suicidio.',
    requiredInterfaceRank: 4
  },
  {
    id: 'qh-shard-ejection',
    name: 'Shard Ejection',
    tier: 'Advanced',
    dv: 12,
    actionCost: '1 NET Action',
    duration: 'Instantáneo',
    effect: 'Desinstala por la fuerza y expulsa 1 pieza de Chipware del objetivo (a tu elección si tiene varias instaladas) hacia una casilla adyacente. No funciona si el objetivo tiene un cobertor de ranura de fragmentos (Shard Slot Cover) o incluso cinta adhesiva sobre la ranura.',
    loreDescription: 'Obliga a los eyectores neumáticos del Neuroport a disparar sus fragmentos de habilidad o memoria.',
    requiredInterfaceRank: 4
  },
  {
    id: 'qh-system-reset',
    name: 'System Reset',
    tier: 'Advanced',
    dv: 12,
    actionCost: '1 NET Action',
    duration: '60 segundos o al recibir daño',
    effect: 'El objetivo cae Inconsciente (Unconscious) durante 60 segundos (20 Rondas) o hasta que despierte al recibir daño. Además, cae Cuerpo a Tierra (Prone).',
    loreDescription: 'Envía una señal de parada cardiorrespiratoria simulada provocando un síncope total inmediato.',
    requiredInterfaceRank: 4
  }
];

export interface QuickhackingOfficialRulesGuide {
  title: string;
  source: string;
  howUnlockingWorks: {
    title: string;
    summary: string;
    ranks: Array<{
      interfaceRank: string;
      tierName: string;
      dv: string;
      unlockedHacks: string[];
      notes: string;
    }>;
  };
  rangeAndLineOfSight: {
    title: string;
    maxDistance: string;
    lineOfSightRules: string;
    neuroportRequirement: string;
    freeActionConnection: string;
  };
  breachingAndPasswords: {
    title: string;
    netActionsPerTurn: Array<{
      rankRange: string;
      actions: number;
    }>;
    breachProcedure: string[];
  };
  selfIceAndDefense: {
    title: string;
    selfIceEffect: string;
    countermeasureAction: string;
    rebootRecovery: string;
  };
}

export const QUICKHACKING_OFFICIAL_RULES_GUIDE: QuickhackingOfficialRulesGuide = {
  title: 'Reglas Canónicas de Quickhacking Remoto // CEMK 2077 (Sin RAM)',
  source: 'Cyberpunk Edgerunners Mission Kit (CEMK Rulebook pp. 16–18, 26–28, 39, 42)',
  howUnlockingWorks: {
    title: 'Desbloqueo Canónico de Quickhacks según Rango de Interface',
    summary: 'En el TTRPG de CEMK NO existe la RAM de los videojuegos. Todas las acciones de Quickhacking se gestionan mediante NET Actions en combate. Los Quickhacks se desbloquean en 4 escalones según tu Rango de Interface:',
    ranks: [
      {
        interfaceRank: 'Interface Rango 1',
        tierName: 'Simple Quickhacks',
        dv: 'DV 6',
        unlockedHacks: ['Impair Movement', 'Sonic Shock'],
        notes: 'Reducción de MOVE (-1) o condición Damaged Ear sin daño extra durante 60 segundos.'
      },
      {
        interfaceRank: 'Interface Rango 2',
        tierName: 'Standard Quickhacks',
        dv: 'DV 8',
        unlockedHacks: ['Overheat', 'Short Circuit'],
        notes: 'Fuego térmico (4 HP/turno ignorando SP) o apagado de 3 piezas de ciberware por 60 segundos.'
      },
      {
        interfaceRank: 'Interface Rango 3',
        tierName: 'Difficult Quickhacks',
        dv: 'DV 10',
        unlockedHacks: ['Cyberware Malfunction', 'Lure', 'Slow (1d6 MOVE)', 'Synapse Burnout (3d6 HP)'],
        notes: 'Apagado de ciberware clave, señuelo silencioso, frenado motor drástico y daño letal 3d6. ¡A Rango 3 superas automáticamente el Firewall base (DV 6) de cualquier Neuroport sin gastar NET Action!'
      },
      {
        interfaceRank: 'Interface Rango 4+',
        tierName: 'Advanced Quickhacks',
        dv: 'DV 12',
        unlockedHacks: ['Puppet', 'Shard Ejection', 'System Reset'],
        notes: 'Control total de acciones/movimiento del blanco, eyección forzosa de Chipware e inconsciencia total con derribo.'
      }
    ]
  },
  rangeAndLineOfSight: {
    title: 'Alcance Operativo & Línea de Visión (Meatspace)',
    maxDistance: '6 m (3 casillas) con Cyberdeck externo, 8 m (4 casillas) con la opción de hardware adecuada, 50 m (25 casillas) con Cyberdeck en Neuroport Cyberdeck Port (CEMK p. 26)',
    lineOfSightRules: 'Siempre se necesita línea de visión con el objetivo (CEMK pp. 16, 26).',
    neuroportRequirement: 'Si el objetivo no tiene Neuroport, no se le pueden hacer Quickhacks (CEMK p. 15).',
    freeActionConnection: 'Conectarse es la NET Action Jack In; cada Neuroport es una NET Action aparte y puedes quedar conectado a todos los que quieras (CEMK p. 16). Por conexión directa con Interface Plug ganas +1 NET Action por turno e ignoras Passwalls, no Black ICE (CEMK p. 27).'
  },
  breachingAndPasswords: {
    title: 'Flujo Canónico de 4 Pasos en Combate (Por NET Actions)',
    netActionsPerTurn: [
      { rankRange: 'Cualquier rango de Interface (CEMK p. 15: "up to 3 Net Actions")', actions: NET_ACTIONS_PER_TURN }
    ],
    breachProcedure: [
      'Paso 1: Jack In (1 NET Action) — Interface + 1d10 vs WILL del objetivo + 1d10. Entras siempre a su Neuroport; pero si fallas la tirada, el objetivo detecta tu intrusión.',
      'Paso 2: Breach Passwalls (1 NET Action por Passwall) — Romper el Firewall base (DV 6; ignorado automáticamente a Interface 3+) y los Self-ICE del objetivo (1 Self-ICE = DV 6, 2 Self-ICE = DV 8, 3 Self-ICE = DV 10).',
      'Paso 3: Perform a Quickhack (1 NET Action) — Tira Interface + 1d10 vs DV del Quickhack (6, 8, 10 o 12). Límite estricto: máximo 1 Quickhack por objetivo por Turno.',
      'Paso 4: Expulsión / Boot Out (1 Acción de Meatspace del Objetivo) — En su turno, si el objetivo sabe que estás dentro, puede gastar su Acción para tirar WILL + Concentration + 1d10 vs tu Interface + 1d10. Si gana, te expulsa y no puedes volver a entrar por 60 minutos.'
    ]
  },
  selfIceAndDefense: {
    title: 'Defensas del Objetivo: Self-ICE y Protocolo de Expulsión',
    selfIceEffect: 'Cada implante Self-ICE crea un Passwall defensivo adicional dentro del Neuroport (1 Self-ICE = DV 6, 2 Self-ICE = DV 8, 3 Self-ICE = DV 10) que debe ser superado antes de inyectar Quickhacks.',
    countermeasureAction: 'Si el objetivo sabe que estás dentro, gasta su Acción de Meatspace en su turno para tirar WILL + Concentration + 1d10 vs tu Interface + 1d10. Si supera la tirada, el hacker es expulsado y bloqueado por 60 minutos.',
    rebootRecovery: 'Si el Netrunner sale por cualquier vía que no sea la NET Action Jack Out, es un Jack Out inseguro con sus consecuencias normales, y no puede volver a entrar en ese objetivo durante 60 minutos (CEMK p. 26).'
  }
};

// ============================================================================
// 3. GUÍAS INTERACTIVAS Y METADATOS DE LOS 10 ROLES OFICIALES
// ============================================================================

export interface RoleGuide {
  id: string;
  name: string;
  abilityName: string;
  description: string;
  rankProgressionSummary: string;
  subBranchesOrTables: { title: string; content: string[] }[];
}

// Derivada de data/creation/roleRanks.ts (fuente única, plan 8 v4.9.0). [Claude Code · 2026-10-22]
export const ROLES_INTERACTIVE_GUIDES: RoleGuide[] = buildRoleGuides();

// ============================================================================
// 4. CATÁLOGO DE 14 VEHÍCULOS OFICIALES (CORE & BLACK CHROME)
// ============================================================================

export interface VehicleSpec {
  id: string;
  name: string;
  category: 'Moto' | 'Coche' | 'Furgón/Camión' | 'Acuático' | 'Aéreo/AV';
  sdp: number;
  armorSp: number;
  seats: number;
  combatSpeed: string;
  narrativeSpeed: string;
  cost: number;
  costTier: string;
  upgrades: string[];
  mountedWeapons?: string[];
  sourceBook: 'core' | 'black_chrome';
  description: string;
}

export const VEHICLES_CATALOG: VehicleSpec[] = [
  {
    id: 'veh-makigai-maimai',
    name: 'Makigai MaiMai',
    category: 'Coche',
    sdp: 35,
    armorSp: 10,
    seats: 2,
    combatSpeed: '20m por acción',
    narrativeSpeed: '100 km/h',
    cost: 10000,
    costTier: 'Luxury',
    upgrades: ['Radio FM', 'Sensor de aparcamiento'],
    sourceBook: 'black_chrome',
    description: 'Coche utilitario biplaza ultra-compacto. Muy popular en el distrito centro para maniobrar entre atascos.'
  },
  {
    id: 'veh-yaiba-kusanagi',
    name: 'Yaiba Kusanagi CT-3X',
    category: 'Moto',
    sdp: 30,
    armorSp: 11,
    seats: 2,
    combatSpeed: '35m por acción',
    narrativeSpeed: '250 km/h',
    cost: 20000,
    costTier: 'Super Luxury',
    upgrades: ['Chasis aerodinámico', 'Frenos ABS Kiroshi', 'Smartlink Cockpit'],
    sourceBook: 'black_chrome',
    description: 'La supermoto de carreras más codiciada de Night City. Aceleración salvaje inspirada en el anime.'
  },
  {
    id: 'veh-brennan-apollo',
    name: 'Brennan Apollo 650',
    category: 'Moto',
    sdp: 35,
    armorSp: 11,
    seats: 2,
    combatSpeed: '25m por acción',
    narrativeSpeed: '160 km/h',
    cost: 15000,
    costTier: 'Super Luxury',
    upgrades: ['Suspensión todoterreno', 'Depósito extendido de biocombustible'],
    sourceBook: 'core',
    description: 'Moto todoterreno indestructible empleada por nómadas Aldecaldos para cruzar las dunas de las Badlands.'
  },
  {
    id: 'veh-quadra-turbo-r',
    name: 'Quadra Turbo-R V-Tech',
    category: 'Coche',
    sdp: 50,
    armorSp: 12,
    seats: 2,
    combatSpeed: '30m por acción',
    narrativeSpeed: '220 km/h',
    cost: 40000,
    costTier: 'Super Luxury',
    upgrades: ['Motor V8 Turboalimentado', 'Escape deportivo', 'Blindaje ligero integrado'],
    sourceBook: 'black_chrome',
    description: 'Icono del músculo automovilístico de los años 40. Rugido ensordecedor y tracción trasera para derrapes de película.'
  },
  {
    id: 'veh-thorton-galena',
    name: 'Thorton Galena GA40XT',
    category: 'Coche',
    sdp: 45,
    armorSp: 10,
    seats: 4,
    combatSpeed: '20m por acción',
    narrativeSpeed: '120 km/h',
    cost: 15000,
    costTier: 'Super Luxury',
    upgrades: ['Baca de techo', 'Repuestos económicos'],
    sourceBook: 'core',
    description: 'El utilitario del pueblo. Chasis espartano y fácil de reparar incluso con herramientas improvisadas.'
  },
  {
    id: 'veh-villefort-cortes',
    name: 'Villefort Cortes V5000',
    category: 'Coche',
    sdp: 55,
    armorSp: 13,
    seats: 5,
    combatSpeed: '22m por acción',
    narrativeSpeed: '140 km/h',
    cost: 35000,
    costTier: 'Super Luxury',
    upgrades: ['Vidrios tintados blindados', 'Asientos de cuero sintético', 'Minibar'],
    sourceBook: 'black_chrome',
    description: 'Sedán ejecutivo de lujo con presencia imponente, elegido por fixers de renombre y capos de la mafia.'
  },
  {
    id: 'veh-chevillon-thrax',
    name: 'Chevillon Thrax 388 Jefferson',
    category: 'Coche',
    sdp: 60,
    armorSp: 14,
    seats: 5,
    combatSpeed: '20m por acción',
    narrativeSpeed: '130 km/h',
    cost: 45000,
    costTier: 'Super Luxury',
    upgrades: ['Blindaje compuesto SP 14', 'Sistema de extinción de incendios'],
    sourceBook: 'black_chrome',
    description: 'El acorazado de los diplomáticos. Protege a sus ocupantes contra emboscadas con fusiles de asalto.'
  },
  {
    id: 'veh-militech-gorgon',
    name: 'Militech Gorgon Security Van',
    category: 'Furgón/Camión',
    sdp: 65,
    armorSp: 18,
    seats: 8,
    combatSpeed: '18m por acción',
    narrativeSpeed: '110 km/h',
    cost: 50000,
    costTier: 'Super Luxury',
    upgrades: ['Troneras de disparo laterales', 'Ariete frontal reforzado'],
    mountedWeapons: ['Torreta Heavy Machinegun montada en techo'],
    sourceBook: 'black_chrome',
    description: 'Furgón táctico de asalto pesado. Utilizado por escuadras antiterroristas y transporte de prisioneros de alto riesgo.'
  },
  {
    id: 'veh-peterbilt-combat-rig',
    name: 'Peterbilt Combat Rig Juggernaut',
    category: 'Furgón/Camión',
    sdp: 100,
    armorSp: 18,
    seats: 6,
    combatSpeed: '15m por acción',
    narrativeSpeed: '100 km/h',
    cost: 80000,
    costTier: 'Super Luxury',
    upgrades: ['Doble remolque blindado', 'Generador de taller nómada'],
    mountedWeapons: ['Doble lanzamisiles y torreta de defensa'],
    sourceBook: 'core',
    description: 'La fortaleza rodante de los convoyes nómadas. Capaz de embestir barricadas enteras sin perder velocidad.'
  },
  {
    id: 'veh-sea-sprite',
    name: 'Sea Sprite Patrol Cutter',
    category: 'Acuático',
    sdp: 50,
    armorSp: 12,
    seats: 6,
    combatSpeed: '25m por acción',
    narrativeSpeed: '90 km/h (nudos)',
    cost: 30000,
    costTier: 'Super Luxury',
    upgrades: ['Sonar de profundidad', 'Foco de alta potencia'],
    sourceBook: 'core',
    description: 'Lancha patrullera rápida para intercepción de contrabandistas en la bahía de Coronado.'
  },
  {
    id: 'veh-grundy-salvage-sub',
    name: 'Grundy Heavy Salvage Sub',
    category: 'Acuático',
    sdp: 60,
    armorSp: 15,
    seats: 3,
    combatSpeed: '10m por acción',
    narrativeSpeed: '40 km/h',
    cost: 60000,
    costTier: 'Super Luxury',
    upgrades: ['Brazo robótico manipulador', 'Presurización abisal'],
    sourceBook: 'black_chrome',
    description: 'Submarino de salvamento para explorar pecios sumergidos de la Cuarta Guerra Corporativa.'
  },
  {
    id: 'veh-bell-combat-gyro',
    name: 'Bell Combat Gyrocopter',
    category: 'Aéreo/AV',
    sdp: 40,
    armorSp: 11,
    seats: 2,
    combatSpeed: '30m por acción',
    narrativeSpeed: '180 km/h',
    cost: 50000,
    costTier: 'Super Luxury',
    upgrades: ['Rotor silencioso', 'Cabina abierta de asalto'],
    mountedWeapons: ['Ametralladora ligera acoplada'],
    sourceBook: 'core',
    description: 'Girocóptero de reconocimiento aéreo ligero y despegue vertical inmediato desde azoteas.'
  },
  {
    id: 'veh-zetatech-aerovox-av4',
    name: 'Zetatech AeroVox AV-4',
    category: 'Aéreo/AV',
    sdp: 70,
    armorSp: 15,
    seats: 6,
    combatSpeed: '40m por acción',
    narrativeSpeed: '350 km/h',
    cost: 100000,
    costTier: 'Super Luxury',
    upgrades: ['Turbinas vectoriales orientables', 'Módulo médico Trauma Team'],
    mountedWeapons: ['Torreta automática ventral opcional'],
    sourceBook: 'black_chrome',
    description: 'El vehículo aéreo urbano definitivo. Salva vidas como ambulancia aérea o siembra el caos como transporte de tropas.'
  },
  {
    id: 'veh-arasaka-kenshin-av9',
    name: 'Arasaka Kenshin Heavy AV-9',
    category: 'Aéreo/AV',
    sdp: 90,
    armorSp: 18,
    seats: 10,
    combatSpeed: '45m por acción',
    narrativeSpeed: '400 km/h',
    cost: 150000,
    costTier: 'Super Luxury',
    upgrades: ['Blindaje compuesto militar', 'Jaula de Faraday completa'],
    mountedWeapons: ['Cañón rotatorio pesado y lanzacohetes inteligentes'],
    sourceBook: 'core',
    description: 'Fortaleza voladora corporativa de asalto pesado. Utilizada por el séquito personal de la familia Arasaka.'
  }
];

// ============================================================================
// 5. TABLAS DE BOTÍN PARA EL GM / FIXER DECK (6 TABLAS 1d10)
// ============================================================================

export interface LootTable {
  id: string;
  name: string;
  description: string;
  entries: { roll: number; item: string; value: string; notes?: string }[];
}

export const GM_LOOT_TABLES: LootTable[] = [
  {
    id: 'loot-street-junk',
    name: '1. Chatarra Callejera y Bolsillos de Pandilleros',
    description: 'Objetos cotidianos encontrados al registrar a mooks derrotados.',
    entries: [
      { roll: 1, item: 'Mechero con logo borroso y paquete de cigarrillos sintéticos', value: '5 €$' },
      { roll: 2, item: 'Agent astillado con mensajes de texto amenazantes de su ex', value: '20 €$' },
      { roll: 3, item: 'Lata de Smash a medio consumir y navaja oxidada', value: '15 €$' },
      { roll: 4, item: 'Tarjetas de crédito clonadas vacías y 3 balas de pistola', value: '25 €$' },
      { roll: 5, item: 'Gafas de sol de plástico neón baratas', value: '10 €$' },
      { roll: 6, item: 'Bolsita con polvo blanco de baja calidad (Synthcoke cortado)', value: '30 €$' },
      { roll: 7, item: 'Chip de memoria con pornografía virtu ilegal', value: '50 €$' },
      { roll: 8, item: 'Llave electrónica de un trastero clandestino en Heywood', value: 'Variable' },
      { roll: 9, item: 'Daga de combate bien afilada y cargador de subfusil lleno', value: '70 €$' },
      { roll: 10, item: 'Billetera abultada con 120 €$ en billetes sin marcar', value: '120 €$' }
    ]
  },
  {
    id: 'loot-weapons-ammo',
    name: '2. Alijo de Armas y Municiones de Night Market',
    description: 'Armas de fuego y pertrechos recuperados de un alijo o furgón.',
    entries: [
      { roll: 1, item: 'Caja con 30 balas básicas de Heavy Pistol y 2 cargadores', value: '40 €$' },
      { roll: 2, item: 'Pistola Medium Pistol GunMart con número de serie limado', value: '50 €$' },
      { roll: 3, item: 'Escopeta corredera estándar con 20 cartuchos', value: '100 €$' },
      { roll: 4, item: 'Caja con 20 proyectiles Armor-Piercing de fusil de asalto', value: '100 €$' },
      { roll: 5, item: 'Subfusil SMG Militech con cargador ampliado instalado', value: '200 €$' },
      { roll: 6, item: '2 Granadas de Fragmentación militares en funda de espuma', value: '200 €$' },
      { roll: 7, item: 'Fusil de Asalto Arasaka de excelente manufactura (+1 ataque)', value: '500 €$' },
      { roll: 8, item: 'Fusil de Francotirador con mira telescópica IR nocturna', value: '600 €$' },
      { roll: 9, item: 'Lanzacohetes de un solo disparo con 1 cohete perforante', value: '500 €$' },
      { roll: 10, item: 'Maletín hermético con una Malorian Arms 3516 personalizada', value: '1,500 €$' }
    ]
  },
  {
    id: 'loot-cyberware-medical',
    name: '3. Alijo de Ciberware y Suministros Médicos',
    description: 'Implantes cosechados y fármacos de grado hospitalario.',
    entries: [
      { roll: 1, item: '2 Dosis de Speedheal en aplicador hipodérmico estéril', value: '100 €$' },
      { roll: 2, item: 'Bolsa de sangre sintética universal y kit de sutura', value: '50 €$' },
      { roll: 3, item: 'Inyector de Stim de combate militar', value: '50 €$' },
      { roll: 4, item: 'Ciberóptica Kiroshi recuperada en líquido conservante', value: '200 €$' },
      { roll: 5, item: 'Chipware de habilidad: Manejo de Armas de Fuego +2', value: '500 €$' },
      { roll: 6, item: 'Ciberbrazo de combate estándar desmontado', value: '500 €$' },
      { roll: 7, item: 'Conjunto de Garras Wolvers de titanio sin usar', value: '500 €$' },
      { roll: 8, item: 'Procesador Neuralware con ranuras de chipware libres', value: '1,000 €$' },
      { roll: 9, item: 'Módulo de Sandevistan de segunda mano en buen estado', value: '1,000 €$' },
      { roll: 10, item: 'Cápsula Biopod intacta para conversión FBC', value: '5,000 €$' }
    ]
  },
  {
    id: 'loot-corporate-cargo',
    name: '4. Carga Corporativa de Alta Tecnología',
    description: 'Contenedores interceptados a convoyes de megacorporaciones.',
    entries: [
      { roll: 1, item: 'Caja con 5 radioteléfonos encriptados Militech', value: '250 €$' },
      { roll: 2, item: 'Chaleco antibalas Heavy Armorjack corporativo SP 13 nuevo', value: '500 €$' },
      { roll: 3, item: 'Lote de gafas inteligentes corporativas con enlace HUD', value: '500 €$' },
      { roll: 4, item: 'Dispositivo emisor de interferencias EMP portátil', value: '500 €$' },
      { roll: 5, item: 'Blindaje corporal de aramida y cerámica Metalgear SP 18', value: '1,500 €$' },
      { roll: 6, item: 'Caja de 10 tarjetas de acceso a oficinas de Arasaka Tower', value: '1,000 €$' },
      { roll: 7, item: 'Prototipo de enlace Smartgun con firmware no registrado', value: '1,000 €$' },
      { roll: 8, item: 'Exoesqueleto de carga Linear Frame Sigma en embalaje sellado', value: '2,000 €$' },
      { roll: 9, item: 'Maleta blindada con 5,000 €$ en bonos al portador no rastreables', value: '5,000 €$' },
      { roll: 10, item: 'Contrato de transporte clasificado y prototipo de arma experimental', value: '10,000 €$' }
    ]
  },
  {
    id: 'loot-netrunner-programs',
    name: '5. Ciberdecks y Shards de Programas de Netrunning',
    description: 'Hardware y software recuperados de Netrunners caídos.',
    entries: [
      { roll: 1, item: 'Shard con programa de ataque Sword (3d6 a programas)', value: '50 €$' },
      { roll: 2, item: 'Shard con programa de defensa Shield (detiene daño)', value: '50 €$' },
      { roll: 3, item: 'Shard con programa potenciador Speedy Gonzalvez (+2 MOVE)', value: '100 €$' },
      { roll: 4, item: 'Programa Banhammer de asalto pesado (3d6 a Black ICE)', value: '100 €$' },
      { roll: 5, item: 'Programa Black ICE Asp con código anti-personal', value: '500 €$' },
      { roll: 6, item: 'Cyberdeck básico Kirama con 5 slots de memoria', value: '500 €$' },
      { roll: 7, item: 'Programa Black ICE Hellhound en shard presurizado', value: '1,000 €$' },
      { roll: 8, item: 'Cyberdeck táctico Microtech Apex con 7 slots y +1 a Interface', value: '1,000 €$' },
      { roll: 9, item: 'Programa Black ICE Liche (extremadamente raro y prohibido)', value: '2,000 €$' },
      { roll: 10, item: 'Cyberdeck legendario Arasaka Raven con 9 slots de programas', value: '3,000 €$' }
    ]
  },
  {
    id: 'loot-drugs-contraband',
    name: '6. Drogas Callejeras, Fármacos y Oro Negro',
    description: 'Sustancias ilícitas y contrabando valioso en el mercado clandestino.',
    entries: [
      { roll: 1, item: '4 Dosis de Blue Glass en frascos cuentagotas', value: '80 €$' },
      { roll: 2, item: '3 Dosis de Timewarp en sellos sublinguales', value: '300 €$' },
      { roll: 3, item: 'Inyector con 2 dosis de Black Lace pura de laboratorio', value: '100 €$' },
      { roll: 4, item: 'Frasco con 5 dosis de Smash de alta graduación', value: '50 €$' },
      { roll: 5, item: 'Estimulante neuronal Sixgun de la Farmacia de Hornet', value: '100 €$' },
      { roll: 6, item: 'Dosis de Berserker con adrenalina sintética de choque', value: '100 €$' },
      { roll: 7, item: 'Bolsa con 5 dosis de Boost para hackers', value: '250 €$' },
      { roll: 8, item: 'Lingote de oro de contrabando con sello corporativo raspado', value: '1,000 €$' },
      { roll: 9, item: 'Lote de 10 dosis de Immunoblockers 2077 para ciberpsicosis', value: '1,000 €$' },
      { roll: 10, item: 'Maleta refrigerada con muestra biológica de clonación clandestina', value: '4,000 €$' }
    ]
  }
];

// ============================================================================
// 6. CATÁLOGO DE 20 RETRATOS / AVATARES ESTILIZADOS
// ============================================================================

export interface CharacterPortrait {
  id: string;
  name: string;
  category: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  accentColor: string;
  loreTags: string[];
}

export const CHARACTER_PORTRAITS_CATALOG: CharacterPortrait[] = [
  // 1-5: Facciones & Leyendas
  {
    id: 'portrait-michiko-sanderson',
    name: 'Michiko Sanderson (Danger Gal CEO)',
    category: 'Danger Gal',
    badge: 'DANGER GAL',
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
    iconName: 'Cat',
    accentColor: '#ec4899',
    loreTags: ['CEO', 'Detective', 'Arasaka Bloodline', 'High Charisma']
  },
  {
    id: 'portrait-puma-operative',
    name: 'Operativa Puma (Danger Gal Strike)',
    category: 'Danger Gal',
    badge: 'PUMA SQUAD',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    iconName: 'Zap',
    accentColor: '#f43f5e',
    loreTags: ['Tactical', 'CQB', 'Stealth', 'Subdermal Armor']
  },
  {
    id: 'portrait-david-martinez',
    name: 'David Martinez (Santo Domingo Kid)',
    category: 'Edgerunners 2077',
    badge: 'CEMK 2077',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    iconName: 'Flame',
    accentColor: '#10b981',
    loreTags: ['Sandevistan', 'Speed', 'Yellow Jacket', 'Solo']
  },
  {
    id: 'portrait-lucy-netrunner',
    name: 'Lucy (Deep Net Infiltrator)',
    category: 'Edgerunners 2077',
    badge: 'CEMK 2077',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    iconName: 'Cpu',
    accentColor: '#06b6d4',
    loreTags: ['Monowire', 'Deep Dive', 'Ex-Arasaka', 'Moon Dreamer']
  },
  {
    id: 'portrait-rebecca-gunner',
    name: 'Rebecca (Heavy Trigger Happy)',
    category: 'Edgerunners 2077',
    badge: 'CEMK 2077',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
    iconName: 'Crosshair',
    accentColor: '#14b8a6',
    loreTags: ['Shotguns', 'Cyberarms', 'Carnage', 'Solo']
  },

  // 6-8: Borgs & Facciones Hostiles
  {
    id: 'portrait-full-borg-dragoon',
    name: 'Cyborg Dragoon (Heavy Military FBC)',
    category: 'Full Borg',
    badge: 'GOING METAL',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    iconName: 'Shield',
    accentColor: '#a855f7',
    loreTags: ['BODY 15', 'Full Metal', 'Biopod', 'Cold Terror']
  },
  {
    id: 'portrait-arasaka-specops',
    name: 'Operativo Especial Arasaka (Black Guard)',
    category: 'Megacorp',
    badge: 'ARASAKA',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    iconName: 'Eye',
    accentColor: '#ef4444',
    loreTags: ['Smartgun', 'Corporate Honor', 'Kevlar SP 13', 'Lethal']
  },
  {
    id: 'portrait-maelstrom-cyborg',
    name: 'Iniciador Maelstrom (Multi-Optic Fanatic)',
    category: 'Pandillas',
    badge: 'MAELSTROM',
    badgeColor: 'bg-red-600/20 text-red-400 border-red-600/40',
    iconName: 'Radio',
    accentColor: '#dc2626',
    loreTags: ['Red Optics', 'Cyberpsychosis', 'Shotguns', 'Meat is Weak']
  },
  {
    id: 'portrait-tyger-claws-ronin',
    name: 'Ronin Garra de Tigre (Katana Duelist)',
    category: 'Pandillas',
    badge: 'TYGER CLAWS',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    iconName: 'Swords',
    accentColor: '#f59e0b',
    loreTags: ['Monokatana', 'Speed', 'Japantown', 'Tattoos']
  },
  {
    id: 'portrait-bozos-prankster',
    name: 'Bufón Bozo (Happy Slaughter)',
    category: 'Pandillas',
    badge: 'BOZOS',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    iconName: 'Smile',
    accentColor: '#eab308',
    loreTags: ['Carnival Terror', 'Pie Grenades', 'Laughing Gas', 'Circus']
  },

  // 11-20: Los 10 Roles Canónicos de Cyberpunk RED
  {
    id: 'portrait-role-solo',
    name: 'Solo Mercenario de Asalto',
    category: 'Roles',
    badge: 'SOLO',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    iconName: 'Crosshair',
    accentColor: '#ef4444',
    loreTags: ['Combat Awareness', 'Gunslinger', 'Assault Rifle', 'Vigilant']
  },
  {
    id: 'portrait-role-netrunner',
    name: 'Netrunner de Trinchera',
    category: 'Roles',
    badge: 'NETRUNNER',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    iconName: 'Terminal',
    accentColor: '#06b6d4',
    loreTags: ['Interface', 'Cyberdeck', 'Quickhacks', 'Black ICE']
  },
  {
    id: 'portrait-role-tech',
    name: 'Maker Callejero / Ingeniero',
    category: 'Roles',
    badge: 'TECH',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    iconName: 'Wrench',
    accentColor: '#f59e0b',
    loreTags: ['Maker', 'Field Expertise', 'Fabrication', 'Upgrades']
  },
  {
    id: 'portrait-role-medtech',
    name: 'Cirujano de Campaña / Sawbones',
    category: 'Roles',
    badge: 'MEDTECH',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    iconName: 'HeartPulse',
    accentColor: '#10b981',
    loreTags: ['Medicine', 'Surgery', 'Speedheal', 'Cryotank']
  },
  {
    id: 'portrait-role-nomad',
    name: 'Jinete del Asfalto / Wheelman',
    category: 'Roles',
    badge: 'NOMAD',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    iconName: 'Truck',
    accentColor: '#f97316',
    loreTags: ['Moto', 'Family Clan', 'Badlands', 'Turbocharged']
  },
  {
    id: 'portrait-role-fixer',
    name: 'Operador de Mercado Negro',
    category: 'Roles',
    badge: 'FIXER',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    iconName: 'Briefcase',
    accentColor: '#6366f1',
    loreTags: ['Operator', 'Night Market', 'Brokering', 'Eurodollars']
  },
  {
    id: 'portrait-role-lawman',
    name: 'Detective Placa de Cobre',
    category: 'Roles',
    badge: 'LAWMAN',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    iconName: 'Shield',
    accentColor: '#3b82f6',
    loreTags: ['Backup', 'NCPD', 'Badge', 'Shotgun']
  },
  {
    id: 'portrait-role-exec',
    name: 'Director de Seguridad Junior',
    category: 'Roles',
    badge: 'EXEC',
    badgeColor: 'bg-slate-400/20 text-slate-300 border-slate-400/40',
    iconName: 'Building',
    accentColor: '#94a3b8',
    loreTags: ['Teamwork', 'Penthouse', 'Trauma Silver', 'Tailored Suit']
  },
  {
    id: 'portrait-role-rockerboy',
    name: 'Frontman Revolucionario',
    category: 'Roles',
    badge: 'ROCKERBOY',
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
    iconName: 'Mic',
    accentColor: '#ec4899',
    loreTags: ['Charismatic Impact', 'Guitar', 'Riots', 'Anti-Corp']
  },
  {
    id: 'portrait-role-media',
    name: 'Corresponsal de Zona de Guerra',
    category: 'Roles',
    badge: 'MEDIA',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    iconName: 'Camera',
    accentColor: '#0ea5e9',
    loreTags: ['Credibility', 'Truth', 'Drone Cam', 'Live Stream']
  }
];
