/**
 * NET ARCHITECTURES, 2077 QUICKHACKS, ROLES & VEHICLES DATA CATALOG
 * Fase 3 Deep Systems: Netrunning 2045, Quickhacking 2077, 10 Role Guides, 14 Vehicles, GM Loot & Portraits
 */

// ============================================================================
// 1. ACCIONES DE INTERFAZ & PRESETS DE ARQUITECTURAS DE RED (NETRUNNING 2045)
// ============================================================================

export interface NetAction {
  id: string;
  name: string;
  cost: string;
  dv: string;
  description: string;
  checkFormula: string;
}

export const NET_ACTIONS_CATALOG: NetAction[] = [
  {
    id: 'pathfinder',
    name: 'Pathfinder',
    cost: '1 NET Action',
    dv: 'Variable (DV 6 a 12)',
    description: 'Permite mapear la arquitectura NET desde tu posición actual hacia arriba o abajo, revelando pisos, nodos de control y Black ICE.',
    checkFormula: 'Interface + 1d10 vs DV'
  },
  {
    id: 'backdoor',
    name: 'Backdoor',
    cost: '1 NET Action',
    dv: 'Password DV (DV 6 a 14)',
    description: 'Fuerza la brecha a través de un piso de Contraseña (Password) para desbloquear el acceso a niveles inferiores.',
    checkFormula: 'Interface + 1d10 vs DV de la Contraseña'
  },
  {
    id: 'eye-dee',
    name: 'Eye-Dee',
    cost: '1 NET Action',
    dv: 'Automático o DV 8',
    description: 'Analiza un archivo encriptado, nodo de control o programa enemigo para identificar su función exacta y valor de reventa o táctico.',
    checkFormula: 'Interface + 1d10'
  },
  {
    id: 'control',
    name: 'Control',
    cost: '1 NET Action',
    dv: 'Control Node DV (DV 6 a 12)',
    description: 'Toma el mando de los dispositivos conectados al nodo de control: cámaras de seguridad, torretas automáticas, aspersores o puertas de esclusa.',
    checkFormula: 'Interface + 1d10 vs DV del Nodo'
  },
  {
    id: 'slide',
    name: 'Slide',
    cost: '1 NET Action',
    dv: 'Percepción del Black ICE (DV 6 a 10)',
    description: 'Movimiento evasivo en el ciberespacio que te permite desengancharte de un combate con Black ICE y cambiar de piso.',
    checkFormula: 'Interface + 1d10 vs Perception de Black ICE'
  },
  {
    id: 'virus',
    name: 'Virus',
    cost: '2 NET Actions',
    dv: 'Fijado por el GM (DV 8 a 14)',
    description: 'Implanta un código malicioso persistente en el sistema una vez que has alcanzado el piso más profundo de la arquitectura.',
    checkFormula: 'Interface + 1d10 vs DV del Sistema'
  },
  {
    id: 'cloak',
    name: 'Cloak',
    cost: '1 NET Action',
    dv: 'Fija el DV para el SysAdmin',
    description: 'Oculta tus rastros de intrusión y borra los registros de acceso para que los administradores no detecten tu presencia.',
    checkFormula: 'Resultado = DV que debe superar el SysAdmin'
  },
  {
    id: 'scanner',
    name: 'Scanner',
    cost: '1 Acción de Meatspace',
    dv: 'DV 13 (Percepción)',
    description: 'Escanea en un radio de 6 metros en el mundo real en busca de puntos de acceso inalámbricos (Access Points) a la red.',
    checkFormula: 'INT + Perception + 1d10 vs DV 13'
  },
  {
    id: 'zap',
    name: 'Zap',
    cost: '1 NET Action',
    dv: 'Defensa del programa / Netrunner',
    description: 'Disparo de energía neuronal directo contra un programa hostil o la mente de un Netrunner enemigo.',
    checkFormula: 'Interface + 1d10 vs Defensa del Objetivo'
  }
];

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
  difficulty: 'Basic' | 'Standard' | 'Hardened' | 'Corporate Apex';
  totalFloors: number;
  floors: NetFloor[];
  loreDescription: string;
}

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
      { floorNumber: 2, type: 'Black ICE', name: 'Asp (Anti-Netrunner)', iceType: 'Asp', iceHp: 15, iceAtk: 4, iceDef: 2 },
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
      { floorNumber: 2, type: 'Black ICE', name: 'Raven (Rastreador)', iceType: 'Raven', iceHp: 15, iceAtk: 4, iceDef: 3 },
      { floorNumber: 3, type: 'File', name: 'Códigos de Acceso a Farmacia', dv: 8, rewardOrDevice: 'Acceso a Speedheal & Drogas' },
      { floorNumber: 4, type: 'Black ICE', name: 'Hellhound (Anti-Personal Ígneo)', iceType: 'Hellhound', iceHp: 20, iceAtk: 6, iceDef: 2 },
      { floorNumber: 5, type: 'Control Node', name: 'Cámaras Criogénicas y Escáneres', dv: 10, rewardOrDevice: 'Sobrecargar criotanques' }
    ]
  },
  {
    id: 'net-militech-outpost',
    name: 'Puesto Táctico Avanzado de Militech',
    difficulty: 'Hardened',
    totalFloors: 6,
    loreDescription: 'Instalación fortificada con torretas de defensa automatizadas y personal de seguridad privada.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Protocolo Aegis Militar', dv: 10 },
      { floorNumber: 2, type: 'Black ICE', name: 'Hellhound (Sabueso Devastador)', iceType: 'Hellhound', iceHp: 20, iceAtk: 6, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Torreta Automática de Techo (5d6)', dv: 10, rewardOrDevice: 'Disparar contra tropas Militech' },
      { floorNumber: 4, type: 'File', name: 'Rutas de Patrulla y Armería', dv: 10, rewardOrDevice: 'Clave de bóveda de armas pesadas' },
      { floorNumber: 5, type: 'Black ICE', name: 'Kraken (Anti-Programa Devorador)', iceType: 'Kraken', iceHp: 30, iceAtk: 8, iceDef: 4 },
      { floorNumber: 6, type: 'Control Node', name: 'Puertas Blindadas y Esclusas de Asalto', dv: 10, rewardOrDevice: 'Aislar el complejo' }
    ]
  },
  {
    id: 'net-arasaka-vault',
    name: 'Bóveda de Proyectos Negros de Arasaka',
    difficulty: 'Corporate Apex',
    totalFloors: 7,
    loreDescription: 'La arquitectura más implacable de Night City. Custodiada por Black ICE letal de grado militar.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Cifrado Cuántico Arasaka', dv: 12 },
      { floorNumber: 2, type: 'Black ICE', name: 'Giant (Aplastador Mental)', iceType: 'Giant', iceHp: 25, iceAtk: 6, iceDef: 4 },
      { floorNumber: 3, type: 'File', name: 'Esquema de Ciberware Experimental', dv: 12, rewardOrDevice: 'Datos clasificados (5,000 €$)' },
      { floorNumber: 4, type: 'Black ICE', name: 'Dragon (Guardián Imperial)', iceType: 'Dragon', iceHp: 35, iceAtk: 8, iceDef: 4 },
      { floorNumber: 5, type: 'Control Node', name: 'Defensas Láser y Gas Nervioso', dv: 12, rewardOrDevice: 'Desactivar medidas letales' },
      { floorNumber: 6, type: 'Black ICE', name: 'Liche (Muerte Cerebral Automática)', iceType: 'Liche', iceHp: 25, iceAtk: 8, iceDef: 6 },
      { floorNumber: 7, type: 'File', name: 'Núcleo Maestro del Proyecto Soulkiller', dv: 14, rewardOrDevice: 'Información que cambia el mundo' }
    ]
  },
  {
    id: 'net-zetatech-lab',
    name: 'Laboratorio de Drones Zetatech R&D',
    difficulty: 'Hardened',
    totalFloors: 6,
    loreDescription: 'Red de investigación que controla líneas de ensamblaje robóticas y prototipos autónomos.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Barrera Criptográfica Zeta', dv: 10 },
      { floorNumber: 2, type: 'Black ICE', name: 'Killer (Desmantelador de Software)', iceType: 'Killer', iceHp: 20, iceAtk: 6, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Drones de Patrulla Aérea Octocópteros', dv: 10, rewardOrDevice: 'Ordenar aterrizaje de emergencia' },
      { floorNumber: 4, type: 'Black ICE', name: 'Sabertooth (Perseguidor Rápido)', iceType: 'Sabertooth', iceHp: 25, iceAtk: 6, iceDef: 4 },
      { floorNumber: 5, type: 'Control Node', name: 'Línea de Montaje de Torretas', dv: 10, rewardOrDevice: 'Causar explosión en cadena' },
      { floorNumber: 6, type: 'File', name: 'Planos de Fabricación del Samson FBC', dv: 12, rewardOrDevice: 'Planos industriales de valor supremo' }
    ]
  },
  {
    id: 'net-danger-gal-archive',
    name: 'Archivo Central de Inteligencia Danger Gal',
    difficulty: 'Hardened',
    totalFloors: 6,
    loreDescription: 'Servidor central protegido por la red de Michiko Sanderson con expedientes confidenciales.',
    floors: [
      { floorNumber: 1, type: 'Password', name: 'Acceso Gatuno Encriptado', dv: 10 },
      { floorNumber: 2, type: 'Black ICE', name: 'Wisp (Interferidor Óptico)', iceType: 'Wisp', iceHp: 15, iceAtk: 4, iceDef: 2 },
      { floorNumber: 3, type: 'Control Node', name: 'Micrófonos y Cámaras Espía del Edificio', dv: 10, rewardOrDevice: 'Intercepción de audio' },
      { floorNumber: 4, type: 'Black ICE', name: 'Skunk (Rastreador Fétido)', iceType: 'Skunk', iceHp: 20, iceAtk: 4, iceDef: 4 },
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
      { floorNumber: 2, type: 'Black ICE', name: 'Scorpion (Picadura Neuronal)', iceType: 'Scorpion', iceHp: 20, iceAtk: 6, iceDef: 2 },
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
      iceHp: 20,
      iceAtk: 6,
      iceDef: 3
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
// 2. CATÁLOGO DE LOS 15 QUICKHACKS OFICIALES (ERA 2077 - CEMK)
// ============================================================================

export interface Quickhack2077 {
  id: string;
  name: string;
  tier: 'Simple' | 'Standard' | 'Difficult' | 'Advanced';
  dv: number;
  ramCost: number;
  duration: string;
  damage?: string;
  effect: string;
  loreDescription: string;
}

export const QUICKHACKS_2077_CATALOG: Quickhack2077[] = [
  {
    id: 'qh-overheat',
    name: 'Overheat',
    tier: 'Simple',
    dv: 6,
    ramCost: 3,
    duration: '2 Asaltos',
    damage: '2d6 Térmico por asalto',
    effect: 'Inyecta un bucle térmico que sobrecalienta los circuitos subcutáneos del objetivo, infligiendo 2d6 daño directo a HP por asalto.',
    loreDescription: 'Quema los procesadores térmicos del Neuroport enemigo.'
  },
  {
    id: 'qh-short-circuit',
    name: 'Short Circuit',
    tier: 'Simple',
    dv: 6,
    ramCost: 3,
    duration: 'Instantáneo',
    damage: '3d6 EMP a HP (x2 vs Drones/FBC)',
    effect: 'Descarga un pico de voltaje directo al sistema nervioso y servos. Causa 3d6 daño a HP, duplicándose contra drones y cuerpos Full Borg.',
    loreDescription: 'El ataque predilecto para freír ciberware y robots.'
  },
  {
    id: 'qh-optics-jammer',
    name: 'Optics Jammer',
    tier: 'Simple',
    dv: 6,
    ramCost: 2,
    duration: '1 Asalto',
    effect: 'Ciega la visión del objetivo transmitiendo estática brillante. El objetivo sufre un penalizador de -4 a todas sus tiradas de ataque.',
    loreDescription: 'Ciega temporalmente las retinas Kiroshi o biológicas con señal parásita.'
  },
  {
    id: 'qh-weapon-glitch',
    name: 'Weapon Glitch',
    tier: 'Simple',
    dv: 6,
    ramCost: 2,
    duration: 'Hasta que se repare con 1 Acción',
    effect: 'Hackea el percutor electrónico del arma sostenida, trabándola de inmediato. Requiere una acción de Meatspace para despejar la recámara.',
    loreDescription: 'Inutiliza el cargador de armas Smart o Power.'
  },
  {
    id: 'qh-lure',
    name: 'Lure',
    tier: 'Simple',
    dv: 6,
    ramCost: 2,
    duration: '1 Asalto',
    effect: 'Emite una señal auditiva o visual falsa forzando al objetivo a abandonar su cobertura e investigar el punto señalado.',
    loreDescription: 'Desaloja a centinelas sin alertar al resto del escuadrón.'
  },
  {
    id: 'qh-cyberware-malfunction',
    name: 'Cyberware Malfunction',
    tier: 'Standard',
    dv: 8,
    ramCost: 4,
    duration: '1 Minuto',
    effect: 'Apaga temporalmente un implante de ciberware activo del objetivo (Sandevistan, Cyberarm, Kiroshi o Blindaje Subdérmico).',
    loreDescription: 'Corta la alimentación eléctrica del implante seleccionado.'
  },
  {
    id: 'qh-contagion',
    name: 'Contagion',
    tier: 'Standard',
    dv: 8,
    ramCost: 4,
    duration: 'Instantáneo',
    damage: '2d6 Viral a HP',
    effect: 'Afecta al objetivo principal y salta automáticamente a un segundo objetivo enemigo situado a menos de 6 metros.',
    loreDescription: 'Un gusano bio-viral que salta entre interfaces inalámbricas abiertas.'
  },
  {
    id: 'qh-sonic-shock',
    name: 'Sonic Shock',
    tier: 'Standard',
    dv: 8,
    ramCost: 3,
    duration: '1 Minuto',
    effect: 'Ensordece totalmente al objetivo y corta su enlace de radiofrecuencia, impidiendo que escuche o pida refuerzos a sus aliados.',
    loreDescription: 'Aísla acústica y telemáticamente a la víctima.'
  },
  {
    id: 'qh-cripple-movement',
    name: 'Cripple Movement',
    tier: 'Standard',
    dv: 8,
    ramCost: 3,
    duration: '2 Asaltos',
    effect: 'Bloquea los actuadores de las piernas o extremidades motoras. Reduce la estadística MOVE del objetivo a 2.',
    loreDescription: 'Inmoviliza a corredores rápidos y ciberpsicópatas.'
  },
  {
    id: 'qh-synapse-burnout',
    name: 'Synapse Burnout',
    tier: 'Standard',
    dv: 8,
    ramCost: 5,
    duration: 'Instantáneo',
    damage: '4d6 daño a HP + 1d6 por cada 10 HP que le falten al objetivo',
    effect: 'Descarga neurotrópica masiva. Causa más daño cuanto más herida esté la víctima, rematándola con brutalidad.',
    loreDescription: 'Acelerador letal de daño neuronal terminal.'
  },
  {
    id: 'qh-detonate-grenade',
    name: 'Detonate Grenade',
    tier: 'Difficult',
    dv: 10,
    ramCost: 5,
    duration: 'Instantáneo',
    damage: 'Daño completo de la granada detonada',
    effect: 'Sobrecarga el temporizador de una granada en el arnés de combate del objetivo, detonándola de forma inmediata sobre su propio cuerpo.',
    loreDescription: 'Convierte el arsenal del enemigo en su propia tumba.'
  },
  {
    id: 'qh-memory-wipe',
    name: 'Memory Wipe',
    tier: 'Difficult',
    dv: 10,
    ramCost: 4,
    duration: '1 Asalto',
    effect: 'Borra temporalmente el estado de alerta del enemigo. El objetivo sale del combate y pierde su siguiente turno preguntándose qué ocurría.',
    loreDescription: 'Reinicio táctico de memoria a corto plazo.'
  },
  {
    id: 'qh-reboot-optics-mass',
    name: 'Reboot Optics (Mass)',
    tier: 'Difficult',
    dv: 10,
    ramCost: 5,
    duration: '2 Asaltos',
    effect: 'Reinicia las ópticas cibernéticas de hasta 2 enemigos situados a menos de 4 metros, cegándolos por completo durante 2 asaltos.',
    loreDescription: 'Apagón óptico coordinado para escuadras enteras.'
  },
  {
    id: 'qh-cyberpsychosis-protocol',
    name: 'Cyberpsychosis Protocol',
    tier: 'Advanced',
    dv: 12,
    ramCost: 7,
    duration: '2 Asaltos',
    effect: 'Induce un ataque de paranoia violenta. El objetivo debe atacar con su arma más dañina al aliado más cercano durante su siguiente turno.',
    loreDescription: 'Desata el frenesí psicótico simulado en mentes con alto cromo.'
  },
  {
    id: 'qh-suicide',
    name: 'Suicide',
    tier: 'Advanced',
    dv: 12,
    ramCost: 8,
    duration: 'Instantáneo',
    damage: 'Disparo a la cabeza con su propia arma',
    effect: 'Invalida la voluntad motora del objetivo, obligándole a colocar su arma activa en la sien y apretar el gatillo con daño apuntado a la cabeza (x2 daño penetrante).',
    loreDescription: 'El Quickhack definitivo de control absoluto.'
  }
];

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

export const ROLES_INTERACTIVE_GUIDES: RoleGuide[] = [
  {
    id: 'solo',
    name: 'Solo',
    abilityName: 'Combat Awareness',
    description: 'El mercenario de élite definitivo. Sus puntos de habilidad pueden repartirse y reconfigurarse cada asalto entre 5 especialidades tácticas.',
    rankProgressionSummary: 'Puntos iguales a su Rango en Combat Awareness asignables entre daño, detección, iniciativa y defensa.',
    subBranchesOrTables: [
      {
        title: 'Las 5 Especialidades de Combat Awareness',
        content: [
          '• Threat Detection: +1 a Percepción por punto asignado contra emboscadas y trampas.',
          '• Initiative Reaction: +1 a tiradas de Iniciativa por punto asignado.',
          '• Spot Weakness: +1 al daño que penetre armadura por punto asignado.',
          '• Precision Attack: +1 a tiradas de ataque con armas designadas por cada 3 puntos.',
          '• Damage Absorption: Reduce en 1 punto el daño recibido por cada 2 puntos asignados.'
        ]
      }
    ]
  },
  {
    id: 'medtech',
    name: 'Medtech',
    abilityName: 'Medicine',
    description: 'El ángel de la guarda de la calle. Domina la cirugía de emergencia, el mantenimiento de criotanques y la sintetización de fármacos avanzados.',
    rankProgressionSummary: 'Cada rango en Medicine otorga 1 punto a repartir entre Surgery, Medical Tech y Pharmaceuticals.',
    subBranchesOrTables: [
      {
        title: 'Los 5 Fármacos Canónicos de Farmacia',
        content: [
          '• Speedheal: Cura inmediatamente HP equivalente a (BODY + WILL) del paciente.',
          '• Stim: Elimina penalizaciones de Herida Grave durante 1 hora completa.',
          '• Surge: Restaura 2d6 Puntos de Suerte (LUCK) temporalmente para la sesión.',
          '• Veritine: Suero de la verdad que impone -4 a mentiras y engaños.',
          '• Cryo-Stasis: Suspende el deterioro de heridas críticas y detiene la muerte durante 24h.'
        ]
      },
      {
        title: 'Operaciones de Criotanque & Cirugía',
        content: [
          '• Surgery permite operar heridas críticas de Cabeza y Cuerpo reduciendo el tiempo de recuperación a días en lugar de semanas.',
          '• Cryotank duplica la velocidad de recuperación de HP natural en reposo.'
        ]
      }
    ]
  },
  {
    id: 'tech',
    name: 'Tech',
    abilityName: 'Maker',
    description: 'El genio del taller. Capaz de reparar cualquier chatarra, mejorar armas más allá de especificaciones de fábrica e inventar prototipos únicos.',
    rankProgressionSummary: 'Puntos asignables entre Field Expertise, Upgrade, Fabrication e Invention.',
    subBranchesOrTables: [
      {
        title: 'Tabla de DVs y Tiempos de Fabricación por Coste',
        content: [
          '• Everyday (10-20 €$): DV 9 / Tiempo: 1 hora',
          '• Costly (50 €$): DV 13 / Tiempo: 6 horas',
          '• Premium (100 €$): DV 17 / Tiempo: 1 día',
          '• Expensive (500 €$): DV 21 / Tiempo: 1 semana',
          '• Very Expensive (1,000 €$): DV 25 / Tiempo: 2 semanas',
          '• Luxury (5,000 €$): DV 29 / Tiempo: 1 mes',
          '• Super Luxury (10,000+ €$): DV 33+ / Tiempo: Varios meses'
        ]
      }
    ]
  },
  {
    id: 'nomad',
    name: 'Nomad',
    abilityName: 'Moto',
    description: 'Señor del asfalto y miembro leal de una Familia Nómada. Tiene acceso a vehículos blindados y mejoras mecánicas especializadas.',
    rankProgressionSummary: 'Cada rango en Moto añade o mejora vehículos de la flota familiar (Motos, Coches, Camiones blindados y AVs).',
    subBranchesOrTables: [
      {
        title: 'Opciones de Vehículos por Rango',
        content: [
          '• Rango 1-3: Moto terrestre deportiva o Sedán económico con blindaje SP 10.',
          '• Rango 4-6: Camioneta todoterreno o Furgón de asalto con blindaje SP 13.',
          '• Rango 7-9: Camión blindado articulado o Lancha de asalto pesada.',
          '• Rango 10: Aerodino táctico AV-4 o Helicóptero de combate con armas montadas.'
        ]
      }
    ]
  },
  {
    id: 'lawman',
    name: 'Lawman',
    abilityName: 'Backup',
    description: 'Oficial de policía o seguridad corporativa con placa y radio para solicitar refuerzos tácticos inmediatos en tiroteos.',
    rankProgressionSummary: 'Tirada de 1d10 al pedir Backup; si es menor o igual al Rango, llegan refuerzos en 1d6 asaltos.',
    subBranchesOrTables: [
      {
        title: 'Escalafón de Refuerzos Oficiales',
        content: [
          '• Rango 1-2: 2 Patrulleros Novatos (Pistolas y Kevlar SP 7).',
          '• Rango 3-4: 2 Oficiales de Patrulla Veteranos (Escopetas y Light Armorjack SP 11).',
          '• Rango 5-7: 2 Agentes de Intervención Rápida en Coche Patrulla (Fusiles y SP 13).',
          '• Rango 8-9: Escuadrón Táctico SWAT de 4 agentes con armas pesadas y escudos.',
          '• Rango 10: Equipo de Asalto MaxTac aerotransportado en AV-4 con ciberware militar.'
        ]
      }
    ]
  },
  {
    id: 'exec',
    name: 'Exec',
    abilityName: 'Teamwork',
    description: 'Ejecutivo corporativo con respaldo financiero, apartamento en rascacielos, chofer privado y guardaespaldas a sueldo.',
    rankProgressionSummary: 'Otorga vivienda corporativa de lujo, seguro médico Trauma Team y subordinados leales.',
    subBranchesOrTables: [
      {
        title: 'Beneficios Corporativos por Rango',
        content: [
          '• Subordinados disponibles: Chofer privado, Guardaespaldas armado, Asistente técnico.',
          '• Cobertura Trauma Team Silver/Executive gratuita.',
          '• Armario de ropa corporativa de alta costura renovado mensualmente.'
        ]
      }
    ]
  },
  {
    id: 'fixer',
    name: 'Fixer',
    abilityName: 'Operator',
    description: 'El intermediario del mercado negro. Sabe quién vende qué, cómo conseguir armas prohibidas y organizar Night Markets clandestinos.',
    rankProgressionSummary: 'Puntos en Operator amplían el alcance geográfico de contactos y el nivel de lujo de ítems que puede conseguir.',
    subBranchesOrTables: [
      {
        title: 'Capacidad de Adquisición',
        content: [
          '• Rango 1-4: Acceso a ítems hasta 100 €$ y contactos de barrio.',
          '• Rango 5-7: Acceso a ítems de 500 a 1,000 €$ y convocatoria de Night Markets.',
          '• Rango 8-10: Acceso a armamento militar y acuerdos corporativos internacionales.'
        ]
      }
    ]
  },
  {
    id: 'rockerboy',
    name: 'Rockerboy',
    abilityName: 'Charismatic Impact',
    description: 'La voz rebelde del pueblo. Sus canciones, discursos y presencia magnética pueden inspirar lealtad fanática o desatar disturbios.',
    rankProgressionSummary: 'Rango determina cuántas personas puede convencer y qué tipo de favores están dispuestas a realizar por él.',
    subBranchesOrTables: [
      {
        title: 'Niveles de Influencia',
        content: [
          '• Un individuo particular: pedir alojamiento, favores menores o protección.',
          '• Grupo pequeño (pandilla local): convencerlos de no atacar o apoyar una causa.',
          '• Multitud masiva (concierto): desatar disturbios callejeros contra una corporación.'
        ]
      }
    ]
  },
  {
    id: 'media',
    name: 'Media',
    abilityName: 'Credibility',
    description: 'Periodista intrépido que arriesga el pellejo para publicar la verdad y destruir la reputación de los poderosos.',
    rankProgressionSummary: 'Credibility permite que sus historias sean creídas por el público y abran puertas de investigación inaccesibles.',
    subBranchesOrTables: [
      {
        title: 'Impacto de Reportajes',
        content: [
          '• Acceso a fuentes protegidas y filtradores corporativos anónimos.',
          '• Publicación de escándalos que hunden acciones de megacorporaciones.',
          '• Inmunidad social temporal gracias al foco mediático del público.'
        ]
      }
    ]
  },
  {
    id: 'netrunner',
    name: 'Netrunner',
    abilityName: 'Interface',
    description: 'El jinete de la red. Hackea en tiempo real arquitecturas virtuales usando Cyberdecks y programas de software de asalto.',
    rankProgressionSummary: 'Rango en Interface determina la cantidad de Acciones de Red por turno (de 2 a 5 acciones).',
    subBranchesOrTables: [
      {
        title: 'Acciones de Red por Rango',
        content: [
          '• Rango 1-2: 2 Acciones de Red por asalto.',
          '• Rango 3-6: 3 Acciones de Red por asalto.',
          '• Rango 7-9: 4 Acciones de Red por asalto.',
          '• Rango 10: 5 Acciones de Red por asalto.'
        ]
      }
    ]
  }
];

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
      { roll: 2, item: '3 Dosis de Timewarp en sellos sublinguales', value: '150 €$' },
      { roll: 3, item: 'Inyector con 2 dosis de Black Lace pura de laboratorio', value: '100 €$' },
      { roll: 4, item: 'Frasco con 5 dosis de Smash de alta graduación', value: '50 €$' },
      { roll: 5, item: 'Estimulante neuronal Sixgun de la Farmacia de Hornet', value: '100 €$' },
      { roll: 6, item: 'Dosis de Berserk con adrenalina sintética de choque', value: '100 €$' },
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
