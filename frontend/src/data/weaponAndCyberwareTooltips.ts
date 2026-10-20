// ============================================================================
// WEAPON & CYBERWARE TOOLTIPS AND OFFICIAL RULES DESCRIPTIONS
// Cyberpunk RED & Cyberpunk: Edgerunners Mission Kit (2077)
// Clasificadores de armas, munición táctica y categorías de ciberware
// ============================================================================

export interface WeaponClassAndRebuildInfo {
  weaponClass: string;
  rebuildType?: 'power' | 'tech' | 'smart' | 'exotic' | null;
  rebuildBadge?: string;
  skillDisplayName: string;
  weaponClassTooltip: string;
  rebuildTooltip?: string;
  fullRulesSummary: string;
}

// ----------------------------------------------------------------------------
// 1. CLASIFICADOR DINÁMICO DE SUBCLASES DE ARMAS Y REBUILDS 2077
// ----------------------------------------------------------------------------

export function getWeaponClassAndRebuildInfo(weapon: any): WeaponClassAndRebuildInfo {
  if (!weapon) {
    return {
      weaponClass: 'Arma Estándar',
      skillDisplayName: 'Handgun (REF)',
      weaponClassTooltip: 'Arma de fuego genérica.',
      fullRulesSummary: 'Arma de fuego estándar.'
    };
  }

  const name = (weapon.name || '').toLowerCase();
  const notes = (weapon.notes || '').toLowerCase();
  const examples = (weapon.examples || '').toLowerCase();
  const type = (weapon.type || '').toLowerCase();
  const rawSkill = (weapon.skill || '').toLowerCase();
  const damage = weapon.damage || '';
  const rof = weapon.rof || 1;
  const techType = weapon.weaponTechType || '';

  // Determinar Nombre Legible de la Skill
  let skillDisplayName = 'Shoulder Arms (REF)';
  if (rawSkill.includes('handgun') || rawSkill === 'pistol') {
    skillDisplayName = 'Handgun (REF)';
  } else if (rawSkill.includes('shoulder')) {
    skillDisplayName = 'Shoulder Arms (REF)';
  } else if (rawSkill.includes('autofire')) {
    skillDisplayName = 'Autofire (REF)';
  } else if (rawSkill.includes('heavy') && !rawSkill.includes('melee')) {
    skillDisplayName = 'Heavy Weapons (REF)';
  } else if (rawSkill.includes('archery') || rawSkill.includes('bow')) {
    skillDisplayName = 'Archery (REF)';
  } else if (rawSkill.includes('melee')) {
    skillDisplayName = 'Melee Weapon (DEX)';
  } else if (rawSkill.includes('brawl')) {
    skillDisplayName = 'Brawling (DEX)';
  } else if (rawSkill.includes('martial')) {
    skillDisplayName = 'Martial Arts (DEX)';
  }

  // Determinar Subclase Específica del Arma
  let weaponClass = 'Ranged Weapon';
  let weaponClassTooltip = '';

  if (type.includes('melee') || rawSkill.includes('melee')) {
    if (name.includes('mantis') || damage === '3d6') {
      weaponClass = 'Heavy Melee Weapon';
      weaponClassTooltip =
        'Arma Cuerpo a Cuerpo Pesada (3d6 de daño, ROF 2). Empuñada con 1 o 2 manos. Ignora el 50% del blindaje SP del defensor (redondeado hacia arriba). Ejemplos: Katanas, Cuchillas Mantis, Puños Gorilla, Mazas.';
    } else if (damage === '4d6') {
      weaponClass = 'Very Heavy Melee Weapon';
      weaponClassTooltip =
        'Arma Cuerpo a Cuerpo Muy Pesada (4d6 de daño, ROF 1). Requiere 2 manos. Ignora el 50% del blindaje SP del defensor. Ejemplos: Espadones de dos manos, Alabardas, Martillos de demolición.';
    } else if (damage === '2d6') {
      weaponClass = 'Medium Melee Weapon';
      weaponClassTooltip =
        'Arma Cuerpo a Cuerpo Media (2d6 de daño, ROF 2). Empuñada a 1 mano y ocultable. Ignora el 50% del blindaje SP del defensor. Ejemplos: Machetes, Cuchillos de trinchera, Porras tácticas.';
    } else {
      weaponClass = 'Light Melee Weapon';
      weaponClassTooltip =
        'Arma Cuerpo a Cuerpo Ligera (1d6 de daño, ROF 2). Empuñada a 1 mano y fácilmente ocultable. Ignora el 50% del blindaje SP del defensor. Ejemplos: Cuchillos de combate, Navajas, Bisturís quirúrgicos.';
    }
  } else if (rawSkill.includes('brawl')) {
    weaponClass = 'Brawling / Combate Desarmado';
    weaponClassTooltip =
      'Pelea Desarmada (Puños, patadas, cabezazos). Daño según la estadística BODY (1d6 a 4d6, ROF 2). No ignora blindaje SP, pero permite agarres (Grapple), asfixias (Choke directo a HP) y proyecciones (Slam directo a HP).';
  } else if (rawSkill.includes('martial')) {
    weaponClass = 'Martial Arts Form';
    weaponClassTooltip =
      'Forma de Artes Marciales (ROF 2). Daño según BODY (1d6 a 4d6). A diferencia de Brawling, ¡las Artes Marciales ignoran el 50% del blindaje SP del defensor! Permite maniobras especiales únicas de cada estilo.';
  } else if (name.includes('shotgun') || name.includes('satara') || name.includes('carnage') || name.includes('zhuo') || notes.includes('slug') || notes.includes('shell')) {
    weaponClass = 'Shotgun';
    weaponClassTooltip =
      'Escopeta (Shoulder Arms, 2 manos). Puede disparar Postas (Slugs, 5d6 daño a un único objetivo según tabla de distancias) o Cartuchos de Perdigones (Shells, 3d6/4d6 de daño en un área de cono de 6x6m frente al tirador contra DV 13).';
  } else if (name.includes('sniper') || name.includes('grad') || name.includes('nekomata') || name.includes('achilles') || notes.includes('sniper')) {
    weaponClass = 'Sniper Rifle';
    weaponClassTooltip =
      'Fusil de Francotirador (Shoulder Arms, 2 manos, 5d6 de daño, ROF 1). Alcance óptimo devastador a 51-100m (DV 15) y 101-200m (DV 16). No ocultable. Muchas variantes requieren acción de cerrojo o trípode.';
  } else if (name.includes('masamune') || name.includes('assault') || notes.includes('autofire (x4)') || notes.includes('autofire (x3)')) {
    weaponClass = 'Assault Rifle';
    weaponClassTooltip =
      'Fusil de Asalto (Shoulder Arms, 2 manos, 5d6 de daño, ROF 1). Dispone de modo de Fuego Automático (Autofire x4 con habilidad Autofire consumiendo 10 balas). Alcance óptimo a 26-50m (DV 13).';
  } else if (name.includes('smg') || name.includes('shingen') || name.includes('shigure') || name.includes('dian')) {
    weaponClass = name.includes('heavy') || damage === '3d6' ? 'Heavy SMG' : 'SMG';
    weaponClassTooltip =
      'Subfusil SMG (Handgun / Autofire, 1 o 2 manos). Permite fuego semiautomático (ROF 1) o ráfagas automáticas de hasta x3 o x4. Compacto y letal en distancias cortas (7-12m, DV 15 o DV 17 en Autofire).';
  } else if (damage === '4d6' && rof === 1) {
    weaponClass = 'Very Heavy Pistol';
    weaponClassTooltip =
      'Pistola Muy Pesada (Handgun, 1 mano, 4d6 de daño, ROF 1). No ocultable. El poder de frenada máximo en armas cortas (ej. Malorian 3516, Desert Eagle, Tamayura).';
  } else if (damage === '3d6') {
    weaponClass = 'Heavy Pistol';
    weaponClassTooltip =
      'Pistola Pesada (Handgun, 1 mano, 3d6 de daño, ROF 2). Ocultable. El estándar táctico de mercenarios y corporativos (ej. Lexington, Omaha, Unity, Mustang Arms).';
  } else if (damage === '2d6') {
    weaponClass = 'Medium Pistol';
    weaponClassTooltip =
      'Pistola Media (Handgun, 1 mano, 2d6 de daño, ROF 2). Ocultable. Arma de defensa personal ligera y común en el mercado negro (ej. Budget Arms C-13, Dai Lung).';
  } else if (name.includes('rocket') || name.includes('grenade') || name.includes('missile')) {
    weaponClass = 'Heavy Weapon';
    weaponClassTooltip =
      'Arma Pesada de Destrucción Masiva (Heavy Weapons, 6d6 a 8d6 de daño explosivo en área de 10x10m). Requiere 2 manos y munición costosa antiblindaje.';
  } else if (name.includes('bow') || name.includes('crossbow')) {
    weaponClass = 'Bow / Crossbow';
    weaponClassTooltip =
      'Arma de Proyectiles Silenciosa (Archery, 2 manos). Dispara flechas o virotes reutilizables si no se rompen. Silenciosa e indetectable por sensores acústicos.';
  }

  // Determinar Rebuild 2077 si aplica
  const rebuildOverride = weapon.rebuild2077;
  let rebuildType: 'power' | 'tech' | 'smart' | 'exotic' | null = null;
  let rebuildBadge: string | undefined = undefined;
  let rebuildTooltip: string | undefined = undefined;

  if (rebuildOverride === 'power') {
    rebuildType = 'power';
    rebuildBadge = '💥 POWER REBUILD 2077';
    rebuildTooltip =
      'Tecnología Power 2077: Proyectiles cinéticos pesados. +5 al daño adicional de Heridas Críticas. Permite disparos con rebote (ricochet) contra paredes o techos con un penalizador de -4 a la tirada (o penalizador 0 si se utiliza un Coprocesador Balístico).';
  } else if (rebuildOverride === 'tech') {
    rebuildType = 'tech';
    rebuildBadge = '⚡ TECH REBUILD 2077';
    rebuildTooltip =
      'Tecnología Tech 2077: Aceleración electromagnética tipo Gauss/Railgun. Equipada con visor de detección de siluetas tras Cobertura Delgada (Thin Cover). Sacrificando la Acción de Movimiento, el tirador Carga el arma. El Disparo Cargado atraviesa coberturas delgadas e ignora la mitad del blindaje SP del defensor (redondeado hacia arriba).';
  } else if (rebuildOverride === 'smart') {
    rebuildType = 'smart';
    rebuildBadge = '🎯 SMART REBUILD 2077';
    rebuildTooltip =
      'Tecnología Smart 2077: Micro-misiles teledirigidos con enlace neuronal. Otorga +1 permanente a Tiradas de Ataque cuando se enlaza mediante Neuroport y Subdermal Grip / Smart Link. Si se utiliza Munición Smart Mejorada, si el disparo falla por 5 o menos, permite una tirada inmediata de segunda oportunidad con 14 + 1d10 contra el DV original.';
  } else if (rebuildOverride === 'standard') {
    rebuildType = null;
    rebuildBadge = undefined;
    rebuildTooltip = undefined;
  } else if (techType === 'power' || notes.includes('power weapon') || name.includes('(power)')) {
    rebuildType = 'power';
    rebuildBadge = '💥 POWER REBUILD 2077';
    rebuildTooltip =
      'Tecnología Power 2077: Proyectiles cinéticos pesados. +5 al daño adicional de Heridas Críticas. Permite disparos con rebote (ricochet) contra paredes o techos con un penalizador de -4 a la tirada (o penalizador 0 si se utiliza un Coprocesador Balístico).';
  } else if (techType === 'tech' || notes.includes('tech weapon') || name.includes('(tech)')) {
    rebuildType = 'tech';
    rebuildBadge = '⚡ TECH REBUILD 2077';
    rebuildTooltip =
      'Tecnología Tech 2077: Aceleración electromagnética tipo Gauss/Railgun. Equipada con visor de detección de siluetas tras Cobertura Delgada (Thin Cover). Sacrificando la Acción de Movimiento, el tirador Carga el arma. El Disparo Cargado atraviesa coberturas delgadas e ignora la mitad del blindaje SP del defensor (redondeado hacia arriba).';
  } else if (techType === 'smart' || notes.includes('smart weapon') || name.includes('(smart)')) {
    rebuildType = 'smart';
    rebuildBadge = '🎯 SMART REBUILD 2077';
    rebuildTooltip =
      'Tecnología Smart 2077: Micro-misiles teledirigidos con enlace neuronal. Otorga +1 permanente a Tiradas de Ataque cuando se enlaza mediante Neuroport y Subdermal Grip / Smart Link. Si se utiliza Munición Smart Mejorada, si el disparo falla por 5 o menos, permite una tirada inmediata de segunda oportunidad con 14 + 1d10 contra el DV original.';
  } else if (techType === 'exotic' || notes.includes('exotic') || examples.includes('exotic')) {
    rebuildType = 'exotic';
    rebuildBadge = '✨ EXOTIC';
    rebuildTooltip =
      'Arma Exótica: Diseño fuera de catálogo estándar con especificaciones mecánicas únicas, munición propietaria o mecanismos no compatibles con accesorios comunes.';
  }

  const fullRulesSummary = [
    `Clase: ${weaponClass}`,
    `Habilidad: ${skillDisplayName}`,
    rebuildBadge ? `Sistema: ${rebuildBadge}` : null,
    weaponClassTooltip,
    rebuildTooltip
  ].filter(Boolean).join(' | ');

  return {
    weaponClass,
    rebuildType,
    rebuildBadge,
    skillDisplayName,
    weaponClassTooltip,
    rebuildTooltip,
    fullRulesSummary
  };
}

// ----------------------------------------------------------------------------
// 2. DICCIONARIO COMPLETO DE TIPOS DE MUNICIÓN (CANÓNICO CP RED & CEMK)
// ----------------------------------------------------------------------------

export interface AmmoTypeTooltip {
  id: string;
  name: string;
  costEb: number;
  perUnits: number;
  combatEffect: string;
  ruleExplanation: string;
  source: string;
}

export const AMMO_TYPE_TOOLTIPS: Record<string, AmmoTypeTooltip> = {
  basic: {
    id: 'basic',
    name: 'Basic Ammunition (Estándar)',
    costEb: 10,
    perUnits: 10,
    combatEffect: 'Daño cinético convencional sin modificadores.',
    ruleExplanation:
      'Munición estándar con núcleo de plomo o camisa metálica. Si penetra el blindaje SP del defensor (hace al menos 1 daño tras restar el SP), reduce el SP del objetivo en 1 punto.',
    source: 'Cyberpunk RED Core p. 344'
  },
  'armor-piercing': {
    id: 'armor-piercing',
    name: 'Armor-Piercing Ammunition (Perforante)',
    costEb: 100,
    perUnits: 10,
    combatEffect: 'Doble ablación de blindaje (-2 SP por impacto).',
    ruleExplanation:
      'Proyectiles de núcleo de carburo de tungsteno o uranio empobrecido. Siempre que penetre el blindaje SP del defensor, degrada el SP del objetivo en 2 puntos en lugar de 1.',
    source: 'Cyberpunk RED Core p. 345'
  },
  expansive: {
    id: 'expansive',
    name: 'Expansive Ammunition (Punta Hueca)',
    costEb: 100,
    perUnits: 10,
    combatEffect: 'Heridas críticas devastadoras en tejido blando.',
    ruleExplanation:
      'Proyectiles diseñados para deformarse al contacto con el cuerpo. Si penetra el blindaje y la tirada de daño saca dos o más 6es, causa una Herida Crítica letal con mayor severidad o añade daño directo a la salud.',
    source: 'Cyberpunk RED Core p. 345'
  },
  incendiary: {
    id: 'incendiary',
    name: 'Incendiary Ammunition (Incendiaria)',
    costEb: 100,
    perUnits: 10,
    combatEffect: 'Prende fuego al objetivo (2 daño/turno directo a HP).',
    ruleExplanation:
      'Compuestos químicos pirofóricos. Si el daño penetra el blindaje SP, el objetivo empieza a arder, sufriendo 2 puntos de daño directo a sus HP al final de cada turno hasta que consuma una Acción para apagarse.',
    source: 'Cyberpunk RED Core p. 345'
  },
  smart: {
    id: 'smart',
    name: 'Smart Ammunition (Inteligente 2077)',
    costEb: 100,
    perUnits: 10,
    combatEffect: '+1 Ataque & Homing Tracking balístico.',
    ruleExplanation:
      'Micro-proyectiles giroscópicos con aletas vectoriales. Requiere arma Smart enlazada a Neuroport/Smart Link. Otorga +1 a las tiradas de ataque. Si es munición Smart Mejorada (500 eb/10), un fallo por 5 o menos permite repetir el tiro con 14 + 1d10.',
    source: 'CEMK Rulebook p. 32'
  },
  biotoxin: {
    id: 'biotoxin',
    name: 'Biotoxin Ammunition (Biotoxina)',
    costEb: 500,
    perUnits: 10,
    combatEffect: '3d6 de daño directo a HP si falla chequeo de resistencia.',
    ruleExplanation:
      'Agente neurotóxico sintético militar. Si el proyectil penetra el blindaje SP, la víctima debe superar inmediatamente un chequeo de Resist Torture/Drugs DV 15 o sufrir 3d6 de daño directo a sus HP sin importar el SP.',
    source: 'Cyberpunk RED Core p. 345'
  },
  poison: {
    id: 'poison',
    name: 'Poison Ammunition (Veneno Orgánico)',
    costEb: 100,
    perUnits: 10,
    combatEffect: '2d6 de daño directo a HP si falla chequeo de resistencia.',
    ruleExplanation:
      'Toxina incapacitante de acción rápida. Si penetra el blindaje SP, el objetivo debe superar un chequeo de Resist Torture/Drugs DV 13 o sufrir 2d6 de daño directo a sus HP sin importar el SP.',
    source: 'Cyberpunk RED Core p. 345'
  },
  emp: {
    id: 'emp',
    name: 'EMP Ammunition (Pulso Electromagnético)',
    costEb: 500,
    perUnits: 1,
    combatEffect: 'Apagón de ciberware, ciberdecks y motores de vehículos.',
    ruleExplanation:
      'Micro-generador de pulso electromagnético concentrado. Todo ciberware o aparato electrónico en el área o blanco impactado se desactiva durante 1 minuto salvo que supere un chequeo de Cybertech DV 15.',
    source: 'Black Chrome p. 64'
  },
  rubber: {
    id: 'rubber',
    name: 'Rubber Ammunition (Goma / No Letal)',
    costEb: 10,
    perUnits: 10,
    combatEffect: 'Daño no letal: incapacita sin causar la muerte.',
    ruleExplanation:
      'Proyectiles de elastómero de alta densidad empleados por el NCPD para control de disturbios. Todo el daño es no letal: si reduce los HP a 0, el objetivo queda inconsciente en lugar de sufrir muerte o herida mortal.',
    source: 'Cyberpunk RED Core p. 346'
  },
  sleep: {
    id: 'sleep',
    name: 'Sleep Ammunition (Dardos Narcóticos)',
    costEb: 100,
    perUnits: 10,
    combatEffect: 'Inconsciencia inmediata durante 1 hora.',
    ruleExplanation:
      'Dardos cargados con un potente anestésico hipnótico. Si penetra el blindaje SP, el objetivo debe superar Resist Torture/Drugs DV 13 o caer inconsciente durante 1 hora entera.',
    source: 'Cyberpunk RED Core p. 346'
  },
  smoke: {
    id: 'smoke',
    name: 'Smoke Projectile (Granada / Proyectil de Humo)',
    costEb: 50,
    perUnits: 1,
    combatEffect: 'Crea una nube densa de 10x10m que bloquea visión.',
    ruleExplanation:
      'Al detonar, despliega una nube densa opaca de 10x10 metros durante 1 minuto. Bloquea la línea de visión convencional (-4 a tiradas); las miras infrarrojas térmicas y Smart pueden ver a través de ella.',
    source: 'Cyberpunk RED Core p. 346'
  },
  teargas: {
    id: 'teargas',
    name: 'Teargas Projectile (Gas Lacrimógeno)',
    costEb: 50,
    perUnits: 1,
    combatEffect: 'Nube de 10x10m: -2 a todas las acciones y ceguera temporal.',
    ruleExplanation:
      'Nube irritante de 10x10 metros durante 1 minuto. Quien se encuentre dentro sin máscara de gas o pulmones cibernéticos sufre -2 a todas las acciones y queda cegado.',
    source: 'Cyberpunk RED Core p. 346'
  },
  flashbang: {
    id: 'flashbang',
    name: 'Flashbang (Granada Aturdidora)',
    costEb: 50,
    perUnits: 1,
    combatEffect: 'Aturde y ciega a todos en radio de 8m durante 1 asalto.',
    ruleExplanation:
      'Detonación audiovisual cegadora. Todos los objetivos en un radio de 8m deben superar Resist Torture/Drugs DV 15 o sufrir -4 a todas las acciones durante 1 asalto completo por ceguera y desorientación.',
    source: 'Cyberpunk RED Core p. 346'
  },
  'shotgun shell': {
    id: 'shotgun shell',
    name: 'Shotgun Shell (Cartucho de Perdigones)',
    costEb: 10,
    perUnits: 10,
    combatEffect: 'Daño en cono de 6x6m (3 casillas) frente al tirador contra DV 13.',
    ruleExplanation:
      'Disparo de dispersión de perdigones. Se utiliza la habilidad Shoulder Arms contra DV 13 sin importar la distancia. Causa 3d6 (o 4d6 en armas Smart como la Zhuo) a todos los objetivos situados en el cono de 6m delante del arma.',
    source: 'Cyberpunk RED Core p. 344'
  },
  'shotgun slug': {
    id: 'shotgun slug',
    name: 'Shotgun Slug (Posta de Escopeta Sólida)',
    costEb: 10,
    perUnits: 10,
    combatEffect: '5d6 de daño concentrado a un único objetivo según DV métrico.',
    ruleExplanation:
      'Proyectil sólido de calibre 12 pesado. Causa 5d6 de daño directo al blanco usando la tabla estándar de DVs de Escopeta según la distancia en metros.',
    source: 'Cyberpunk RED Core p. 344'
  }
};

// ----------------------------------------------------------------------------
// 3. DICCIONARIO COMPLETO DE CATEGORÍAS DE CIBERWARE (REGLAS Y REQUISITOS)
// ----------------------------------------------------------------------------

export interface CyberwareCategoryTooltip {
  id: string;
  categoryName: string;
  baseRequirement: string;
  slotsInfo: string;
  installationSite: 'Mall' | 'Clinic' | 'Hospital';
  humanityLossRule: string;
  description: string;
  keyExamples: string[];
}

export const CYBERWARE_CATEGORY_TOOLTIPS: Record<string, CyberwareCategoryTooltip> = {
  fashionware: {
    id: 'fashionware',
    categoryName: 'Fashionware & Estética',
    baseRequirement: 'Ninguno (independiente).',
    slotsInfo: '7 ranuras dedicadas libres en el chasis del personaje.',
    installationSite: 'Mall',
    humanityLossRule: '0 (N/A) — ¡Cero pérdida de Humanidad! No afecta nunca a la Empatía.',
    description:
      'Ciberware cosmético, estético y de utilidad ligera de consumo masivo. Instalable en tiendas de centros comerciales por técnicos de estética con tiempo de intervención casi nulo.',
    keyExamples: ['Biomonitor', 'Tatuajes de luz LED', 'Techhair', 'Skinwatch', 'Chemskin']
  },
  neuralware: {
    id: 'neuralware',
    categoryName: 'Neuralware & Enlaces Cerebrales',
    baseRequirement: 'Neural Link (Implante base en espina dorsal y cerebro).',
    slotsInfo: 'El Neural Link provee 5 ranuras internas para opciones de Neuralware.',
    installationSite: 'Clinic',
    humanityLossRule: '-2 a la Humanidad Máxima por pieza instalada; pérdida actual tirada (2d6 a 4d6).',
    description:
      'Procesadores y coprocesadores conectados al sistema nervioso central para acelerar reflejos, interpretar datos tácticos o controlar vehículos y ciberdecks con el pensamiento.',
    keyExamples: ['Kerenzikov', 'Sandevistan', 'Chipware Socket', 'Subdermal Grip', 'Braindance Recorder']
  },
  cyberoptics: {
    id: 'cyberoptics',
    categoryName: 'Cyberoptics & Ojos Cibernéticos',
    baseRequirement: 'Cybereye (Cada ojo cibernético se instala individualmente, máx 2).',
    slotsInfo: 'Cada Cybereye cuenta con 3 ranuras para opciones ópticas.',
    installationSite: 'Clinic',
    humanityLossRule: '-2 a la Humanidad Máxima por Cybereye y por cada opción instalada.',
    description:
      'Reemplazos completos de los ojos biológicos por cámaras y sensores cibernéticos de alta definición con zoom telescópico, visión térmica, miras HUD y filtros de destello.',
    keyExamples: ['Kiroshi Optics', 'Visión Térmica', 'Micro-óptica', 'Teleóptica', 'Dardo Óptico Emergente']
  },
  cyberaudio: {
    id: 'cyberaudio',
    categoryName: 'Cyberaudio & Suites Auditivas',
    baseRequirement: 'Cyberaudio Suite (Implante auditivo bilateral interno).',
    slotsInfo: 'La Cyberaudio Suite cuenta con 3 ranuras para opciones de audio.',
    installationSite: 'Clinic',
    humanityLossRule: '-2 a la Humanidad Máxima por la Suite y por cada opción instalada.',
    description:
      'Módulo auditivo cibernético coclear que permite sintonizar frecuencias de radio, amplificar susurros a distancia, detectar micrófonos ocultos y cancelar detonaciones.',
    keyExamples: ['Amplificador de Audio', 'Detector de Radar', 'Radio Comunicador de Banda Ancha', 'Bug Detector']
  },
  internal: {
    id: 'internal',
    categoryName: 'Internal Body Cyberware (Órganos & Esqueleto)',
    baseRequirement: 'Ninguno (se acopla directamente al organismo interno biológico).',
    slotsInfo: 'Hasta 7 ranuras anatómicas internas en el cuerpo.',
    installationSite: 'Clinic',
    humanityLossRule: '-2 a la Humanidad Máxima por pieza instalada (o -4 en cirugías masivas).',
    description:
      'Órganos artificiales, bombas químicas, filtros metabólicos de toxinas y refuerzos óseos que mejoran drásticamente la resistencia y supervivencia en combate.',
    keyExamples: ['Grafted Muscle and Bone Lace', 'Pulmones Sintéticos', 'Filtro Antitoxinas', 'Bomba de Adrenalina']
  },
  external: {
    id: 'external',
    categoryName: 'External Body Cyberware (Blindaje & Piel)',
    baseRequirement: 'Ninguno (se injerta sobre la dermis y epidermis del sujeto).',
    slotsInfo: 'Hasta 3 ranuras externas en el cuerpo.',
    installationSite: 'Clinic',
    humanityLossRule: '-2 a la Humanidad Máxima por pieza instalada.',
    description:
      'Capas de blindaje dérmico balístico, nanopolímeros protectores y camuflaje activo que proporcionan protección permanente sin penalizador de movimiento.',
    keyExamples: ['Subdermal Armor (SP 11 permanente)', 'Camuflaje Óptico Activo', 'Sensores Térmicos Dérmicos']
  },
  cyberlimbs: {
    id: 'cyberlimbs',
    categoryName: 'Cyberlimbs (Brazos & Piernas Cibernéticos)',
    baseRequirement: 'Cyberarm (Brazos) o Cyberleg (Piernas) como chasis protésico.',
    slotsInfo: 'Cada Cyberarm o Cyberleg cuenta con 4 ranuras para opciones de extremidad.',
    installationSite: 'Hospital',
    humanityLossRule: '-2 a la Humanidad Máxima por cada miembro y por cada opción instalada.',
    description:
      'Extremidades completas de aleación ligera y motores hidráulicos. Soportan armas emergentes ocultas, puños hidráulicos de combate pesado y puntos de estructura propios.',
    keyExamples: ['Gorilla Arms', 'Mantis Blades', 'Jump Boosters', 'Arma Popup Oculta', 'Revestimiento Superchrome']
  },
  borgware: {
    id: 'borgware',
    categoryName: 'Borgware (Ciberware Pesado Militar)',
    baseRequirement: 'Neural Link y con frecuencia chasis cibernéticos o esqueleto reforzado previo.',
    slotsInfo: 'Ranuras pesadas en el sistema esquelético y nervioso.',
    installationSite: 'Hospital',
    humanityLossRule: '¡ALTO IMPACTO! -4 a la Humanidad Máxima por pieza (el doble que el ciberware normal).',
    description:
      'Ciberware militar extremo diseñado para convertir soldados en tanques andantes. Su desgaste psicológico es brutal: requiere alta Empatía inicial para evitar la Ciberpsicosis.',
    keyExamples: ['Linear Frame Sigma (BODY 12)', 'Linear Frame Beta (BODY 14)', 'Lanzador de Misiles PLS', 'Multi-Arm Mount']
  },
  neuroport: {
    id: 'neuroport',
    categoryName: 'Neuroport 2077 (Sistema Operativo Universal)',
    baseRequirement: 'Estándar fundacional universal de la era 2077 (CEMK).',
    slotsInfo: 'Integra Holófono, Biomonitor, Virtu, HUD, 2 Shard Slots y Personal Link. Admite Cyberdeck y Self-ICE.',
    installationSite: 'Clinic',
    humanityLossRule: '0 (Cero) para la suite universal estándar en la era 2077.',
    description:
      'La plataforma neuronal omnipresente de 2077. Conecta todos los sentidos con la red, permite pagos instantáneos con crédito cifrado, proyección de HUD y ejecución de Quickhacks a 50m.',
    keyExamples: ['Paraline Mk.1-5 Cyberdeck', 'Paraline Self-ICE', 'Kiroshi Starlight Optics', 'Moore Tech Berserk']
  },
  fbc: {
    id: 'fbc',
    categoryName: 'Full Body Conversion (FBC / Going Metal)',
    baseRequirement: 'Biopod blindado con cerebro humano e interfaces bio-cibernéticas.',
    slotsInfo: 'Chasis completo con 13 variantes (BODY 10-14, SP 11-15 y ranuras modulares masivas).',
    installationSite: 'Hospital',
    humanityLossRule: '-14 de Humanidad Fija por la cirugía de Biopod inicial. Si la Humanidad restante cae a 0, ciberpsicosis irreversible.',
    description:
      'La sustitución total del cuerpo humano por un chasis mecánico de grado industrial o militar. Elimina órganos vulnerables, asfixia o sangrado, pero exige mantenimiento de fluidos biológicos y calibración.',
    keyExamples: ['Chasis Samson', 'Chasis Dragoon', 'Chasis Alpha Class', 'Chasis Spyder', 'Chasis Aquarius']
  }
};

// Aliases para búsquedas insensibles a mayúsculas/variaciones de texto
export function getCyberwareCategoryTooltip(categoryOrZone: string): CyberwareCategoryTooltip | undefined {
  if (!categoryOrZone) return undefined;
  const key = categoryOrZone.toLowerCase().trim();
  
  if (key.includes('fashion')) return CYBERWARE_CATEGORY_TOOLTIPS.fashionware;
  if (key.includes('neural')) return CYBERWARE_CATEGORY_TOOLTIPS.neuralware;
  if (key.includes('optic') || key.includes('eye')) return CYBERWARE_CATEGORY_TOOLTIPS.cyberoptics;
  if (key.includes('audio') || key.includes('ear')) return CYBERWARE_CATEGORY_TOOLTIPS.cyberaudio;
  if (key.includes('internal')) return CYBERWARE_CATEGORY_TOOLTIPS.internal;
  if (key.includes('external')) return CYBERWARE_CATEGORY_TOOLTIPS.external;
  if (key.includes('limb') || key.includes('arm') || key.includes('leg')) return CYBERWARE_CATEGORY_TOOLTIPS.cyberlimbs;
  if (key.includes('borg')) return CYBERWARE_CATEGORY_TOOLTIPS.borgware;
  if (key.includes('neuroport') || key.includes('2077')) return CYBERWARE_CATEGORY_TOOLTIPS.neuroport;
  if (key.includes('fbc') || key.includes('metal') || key.includes('conversion') || key.includes('chassis')) {
    return CYBERWARE_CATEGORY_TOOLTIPS.fbc;
  }
  
  return undefined;
}

export function getAmmoTypeTooltip(ammoName: string): AmmoTypeTooltip | undefined {
  if (!ammoName) return undefined;
  const key = ammoName.toLowerCase().trim();
  
  for (const [k, v] of Object.entries(AMMO_TYPE_TOOLTIPS)) {
    if (key.includes(k) || k.includes(key)) {
      return v;
    }
  }
  
  if (key.includes('slug')) return AMMO_TYPE_TOOLTIPS['shotgun slug'];
  if (key.includes('shell')) return AMMO_TYPE_TOOLTIPS['shotgun shell'];
  if (key.includes('piercing') || key.includes('ap')) return AMMO_TYPE_TOOLTIPS['armor-piercing'];
  if (key.includes('expans')) return AMMO_TYPE_TOOLTIPS.expansive;
  if (key.includes('incendi')) return AMMO_TYPE_TOOLTIPS.incendiary;
  if (key.includes('smart')) return AMMO_TYPE_TOOLTIPS.smart;
  if (key.includes('biotoxin')) return AMMO_TYPE_TOOLTIPS.biotoxin;
  if (key.includes('poison')) return AMMO_TYPE_TOOLTIPS.poison;
  if (key.includes('emp')) return AMMO_TYPE_TOOLTIPS.emp;
  if (key.includes('rubber') || key.includes('goma')) return AMMO_TYPE_TOOLTIPS.rubber;
  if (key.includes('sleep') || key.includes('dardo')) return AMMO_TYPE_TOOLTIPS.sleep;
  if (key.includes('smoke') || key.includes('humo')) return AMMO_TYPE_TOOLTIPS.smoke;
  if (key.includes('teargas') || key.includes('gas')) return AMMO_TYPE_TOOLTIPS.teargas;
  if (key.includes('flash') || key.includes('aturd')) return AMMO_TYPE_TOOLTIPS.flashbang;
  
  return AMMO_TYPE_TOOLTIPS.basic;
}

// ----------------------------------------------------------------------------
// 4. GUÍA OFICIAL DEL SISTEMA DE REBUILDS 2077 (CEMK pp. 30-33)
// ----------------------------------------------------------------------------

export interface RebuildSystemOption {
  type: 'power' | 'smart' | 'tech';
  name: string;
  badge: string;
  costEb: number;
  costTier: string;
  attachmentSlots: number;
  prerequisites: string;
  combatRules: string;
  specialAbility: string;
  makerFabrication: {
    skill: string;
    dv: number;
    time: string;
    materialsCostEb: number;
  };
  notes: string;
}

export const CEMK_WEAPON_REBUILD_SYSTEM_GUIDE = {
  title: 'Sistema Canónico de Rebuilds de Armamento CEMK 2077 (pp. 30-33)',
  description:
    'Cualquier arma de fuego estándar convencional puede ser transformada en una variante de última tecnología 2077 (Power, Smart o Tech) mediante reacondicionamiento técnico en taller o compra directa.',
  conversionRulesSummary:
    'Un arma convertida mediante Rebuild 2077 pasa a costar 500 €$ adicionales (Categoría Expensive), gana 2 ranuras de accesorios dedicadas y adopta la tecnología de disparo elegida. Un Tech con la habilidad Maker puede fabricar la conversión con una tirada de DV 17 y 1 semana de trabajo (250 €$ en materiales).',
  rebuildOptions: [
    {
      type: 'power',
      name: 'Power Rebuild 2077',
      badge: '💥 POWER REBUILD 2077',
      costEb: 500,
      costTier: 'Expensive',
      attachmentSlots: 2,
      prerequisites: 'Arma de fuego estándar (pistola, subfusil, escopeta o fusil).',
      combatRules:
        'Dispara munición cinética de alta densidad. Permite disparos con rebote (Ricochet) en superficies duras (paredes, techos, suelo) ignorando coberturas completas con un penalizador de -4 a la tirada (o penalizador 0 si se cuenta con Ballistic Coprocessor cibernético).',
      specialAbility: '+5 al daño adicional cuando se inflige una Herida Crítica (Critical Injury).',
      makerFabrication: {
        skill: 'Maker (Upgrade / Fabrication Expertise)',
        dv: 17,
        time: '1 semana',
        materialsCostEb: 250
      },
      notes: 'No compatible con armas Exóticas o armas Melee.'
    },
    {
      type: 'smart',
      name: 'Smart Rebuild 2077',
      badge: '🎯 SMART REBUILD 2077',
      costEb: 500,
      costTier: 'Expensive',
      attachmentSlots: 2,
      prerequisites: 'Requiere Neuroport con interfaz Smart Link o Subdermal Grip con enlace cibernético + Targeting Scope.',
      combatRules:
        'Balas giroscópicas guiadas por micro-propulsores y giroscopio interno. Otorga un bono pasivo de +1 a todas las tiradas de Ataque. Permite disparar alrededor de coberturas a objetivos fuera de línea de visión directa con un penalizador de -4.',
      specialAbility:
        'Con Munición Smart Especializada: si el disparo falla por 5 o menos puntos respecto al DV objetivo, realiza un reroll automático inmediato (14 + 1d10 contra el DV original).',
      makerFabrication: {
        skill: 'Maker (Upgrade / Fabrication Expertise)',
        dv: 17,
        time: '1 semana',
        materialsCostEb: 250
      },
      notes: 'Si el enlace neuronal es interrumpido o interferido (EMP/Microwaver), opera como un arma convencional sin bonos.'
    },
    {
      type: 'tech',
      name: 'Tech Rebuild 2077',
      badge: '⚡ TECH REBUILD 2077',
      costEb: 500,
      costTier: 'Expensive',
      attachmentSlots: 2,
      prerequisites: 'Batería interna de condensadores electromagnéticos y cañón con bobinas de aceleración Gauss.',
      combatRules:
        'Equipada con visor de detección de siluetas térmicas/electromagnéticas a través de Coberturas Delgadas (placas de yeso, madera, puertas ligeras, chapa de metal).',
      specialAbility:
        'Acción Completa "Charge Shot" (Disparo Cargado): Sacrifica la Acción de Movimiento para cargar los condensadores. El disparo atraviesa coberturas delgadas e ignora el 50% del blindaje SP del defensor (redondeado hacia arriba).',
      makerFabrication: {
        skill: 'Maker (Upgrade / Fabrication Expertise)',
        dv: 17,
        time: '1 semana',
        materialsCostEb: 250
      },
      notes: 'Consume 2 proyectiles o 1 carga de celda energética por cada disparo cargado.'
    }
  ] as RebuildSystemOption[]
};

// ----------------------------------------------------------------------------
// 5. GUÍA OFICIAL DE DESCANSO, CURACIÓN Y REPARACIÓN DE ARMADURAS
// ----------------------------------------------------------------------------

export const RESTING_AND_ARMOR_REPAIR_OFFICIAL_GUIDE = {
  restingAndHealing: {
    title: 'Reglas Canónicas de Descanso y Curación Médica (CP RED Core pp. 114, 149, 222-224, 363)',
    rules: [
      {
        type: 'Natural Rest & Estabilización (Descanso Natural)',
        healingRate: '+1 × BODY HP por día completo (24h)',
        cost: 'Gratis (requiere lugar seguro y comida básica)',
        requirements: 'Prerrequisito Obligatorio: Haber sido Estabilizado previamente (First Aid / Paramedic: DV 10 Levemente Herido, DV 13 Gravemente Herido, DV 15 Mortalmente Herido). Requiere al menos 8h de sueño y solo actividad ligera (leer, descansar, conversar).',
        description: 'El cuerpo repara tejidos orgánicos a razón de su estadística BODY base por cada ciclo de 24 horas continuas de reposo.',
        buffs: 'Recupera 1 × BODY HP cada 24 horas sin coste médico.',
        debuffs: 'Penalizador de Actividad Extenuante: Si durante las 24 horas el personaje realiza esfuerzo físico intenso (combate, correr, nadar, trepar o recibir nuevo daño), PIERDE TODA la curación del día (0 HP recuperados) y si estaba herido de gravedad debe volver a ser estabilizado.'
      },
      {
        type: 'Enhanced Antibodies (Ciberware Corporal Interno)',
        healingRate: '2 × BODY HP por día (3 × BODY con Cryotank)',
        cost: '500 €$ (Expensive) • Instalación en Mall / Clínica (1 Slot Internal Body)',
        humanityLoss: '2 HL (1d6/2 hacia arriba) • Reduce Humanidad Máxima en -2',
        requirements: 'Ciberware Enhanced Antibodies instalado en 1 de las 7 ranuras de Internal Body.',
        description: 'Nanoinyecciones celulares y colonias de leucocitos clonados que aceleran drásticamente la síntesis proteica una vez que el paciente está estabilizado.',
        buffs: 'Duplica la curación biológica natural a 2 × BODY HP por día. Se acumula con el Tanque Criogénico para alcanzar 3 × BODY HP por día.',
        debuffs: 'No estabiliza por sí solo ni sana Heridas Críticas no tratadas; la actividad extenuante anula igualmente la curación diaria.'
      },
      {
        type: 'Tanque Criogénico (Cryotank — Cápsula Médica)',
        healingRate: '2 × BODY HP por día (3 × BODY con Enhanced Antibodies)',
        cost: 'Compra propia: 5,000 €$ (Luxury) | Alquiler Hospital: 500 €$ ingreso o 100 €$/día + 50 €$ químicos | Medtech Rango 4+: Gratis en casa (solo 50 €$ químicos)',
        requirements: 'Paciente sumergido en fluido perfluorocarbonado y gel bio-refrigerante.',
        description: 'Cápsula médica sellada de cuerpo entero que induce un coma metabólico controlado mientras satura de oxígeno e inmunosupresores los tejidos dañados.',
        buffs: 'Garantiza Actividad Ligera perfecta, duplica la velocidad de regeneración (2 × BODY HP/día o 3 × BODY con Antibodies) y suspende los penalizadores de Heridas Críticas no tratadas mientras se permanezca sumergido.',
        debuffs: 'Inconsciente e Indefenso: El paciente no puede hablar, moverse, percibir el entorno ni defenderse. Vulnerabilidad Estructural: El chasis cilíndrico tiene 30 SDP; si es destruido en combate, el tanque estalla arrojando al paciente empapado e indefenso.'
      },
      {
        type: 'Cryopump (Bomba Criogénica Portátil)',
        healingRate: 'Mantiene paciente estable indefinidamente sin tiradas de Muerte',
        cost: '5,000 €$ (Luxury) | Gratis para Medtech Cryosystem Op 1+ | Recarga química: 50 €$',
        requirements: 'Maletín criogénico conectado al paciente mediante catéteres corporales.',
        description: 'Bomba portátil de soporte vital que congela las constantes biológicas de un paciente en estado Mortalmente Herido (<1 HP), suspendiendo los Death Saves durante el transporte hacia un hospital o base.',
        buffs: 'Inmunidad a chequeos de Muerte (Death Saves) durante el traslado en campo.',
        debuffs: 'Requiere recargas de 50 €$ por uso prolongado y no regenera HP por sí misma sin reposo.'
      },
      {
        type: 'Speedheal (Fármaco Biológico Medtech)',
        healingRate: 'Instantáneo: BODY + WILL HP al momento de la inyección',
        cost: 'Lote de síntesis Medtech: 200 €$ (Premium)',
        requirements: 'Inyección intramuscular o hipodérmica (Airhypo / jeringa).',
        description: 'Compuesto estimulante hiper-metabólico diseñado para sintetizar plaquetas y cerrar hemorragias en combate activo.',
        buffs: 'Restaura inmediatamente una suma igual a tu estadística BODY + WILL en HP.',
        debuffs: 'Restricción Severa: Máximo 1 dosis cada 24 horas. Administrar una segunda dosis antes de 24h no otorga HP, produce 1 punto de pérdida de Humanidad permanente y aplica estado de Fatiga Crítica.'
      },
      {
        type: 'Estabilización y Cirugía de Heridas Críticas',
        healingRate: 'Tiempo variable (días o semanas) tras Tratamiento Quirúrgico',
        cost: 'Honorarios médicos o kit de trauma (First Aid / Paramedic / Surgery)',
        requirements: 'First Aid / Paramedic para Estabilizar (DV 10/13/15), Surgery para Tratar.',
        description: 'Una herida estabilizada ya no causa sangrado continuo ni empeora. Una vez tratada quirúrgicamente con éxito por un cirujano/Medtech, cura de forma natural en el número de días o semanas especificado en la tabla de Heridas Críticas.'
      }
    ]
  },
  armorRepair: {
    title: 'Reglas Canónicas de Reparación de Armaduras (CP RED Core p. 140 & Black Chrome)',
    explanation:
      'Un personaje con la habilidad apropiada (Basic Tech para armaduras convencionales, Cybertech para blindaje corporal cibernético) puede reparar armaduras ablacionadas restaurando su SP completo.',
    table: [
      { costTier: 'Cheap (10-20 €$)', examples: 'Ropa blindada improvisada, Parches balísticos', dv: 9, repairTime: '1 Hora', skill: 'Basic Tech' },
      { costTier: 'Everyday / Costly (50-100 €$)', examples: 'Kevlar® (SP 7)', dv: 13, repairTime: '6 Horas', skill: 'Basic Tech' },
      { costTier: 'Premium (500 €$)', examples: 'Light Armorjack (SP 11)', dv: 17, repairTime: '1 Día (8 horas de trabajo)', skill: 'Basic Tech' },
      { costTier: 'Expensive (1,000 €$)', examples: 'Medium Armorjack (SP 12), Heavy Armorjack (SP 13)', dv: 21, repairTime: '1 Semana', skill: 'Basic Tech' },
      { costTier: 'Very Expensive (5,000 €$)', examples: 'Flak (SP 15), Metalgear® (SP 18)', dv: 24, repairTime: '2 Semanas', skill: 'Basic Tech' },
      { costTier: 'Luxury / Super Luxury (10,000+ €$)', examples: 'Trajes blindados de alta costura, Exoarmaduras', dv: 29, repairTime: '1 Mes', skill: 'Basic Tech' }
    ],
    cyberwareRegeneration: {
      type: 'Subdermal Armor & Skin Weave',
      rule: 'El blindaje dérmico cibernético regenera +1 SP por día de descanso natural sin requerir tirada de Basic Tech, gracias a sus nanomateriales biocompatibles autorreparables.'
    }
  }
};

// ----------------------------------------------------------------------------
// 6. PROGRESIÓN COMPLETA DE HABILIDADES DE LOS 10 ROLES (RANGOS 1 AL 10)
// ----------------------------------------------------------------------------

export interface RoleRankProgression {
  rank: number;
  title: string;
  unlocks: string;
}

export interface RoleAbilityProgression {
  role: string;
  abilityName: string;
  summary: string;
  statUsed: string;
  mechanicsOverview: string;
  ranks: RoleRankProgression[];
}

export const ROLE_ABILITIES_COMPLETE_PROGRESSION: Record<string, RoleAbilityProgression> = {
  Solo: {
    role: 'Solo',
    abilityName: 'Combat Awareness (Conciencia de Combate)',
    summary: 'Instinto táctico marcial que permite reasignar puntos de combate cada turno.',
    statUsed: 'REF / DEX',
    mechanicsOverview: 'Al inicio del combate o con 1 Acción en tu turno, distribuyes tus puntos de Combat Awareness (igual a tu Rango de Rol) libremente entre 5 sub-habilidades tácticas: Damage Absorption, Solo Initiative, Threat Detection, Precision Attack y Spot Weakness.',
    ranks: [
      { rank: 1, title: 'Matón de Callejón (Street Scum)', unlocks: '1 punto de Combat Awareness. Acceso básico a +1 Iniciativa o +1 Ataque/Daño.' },
      { rank: 2, title: 'Mercenario Novato (Local Muscle)', unlocks: '2 puntos de Combat Awareness. Puedes absorber 2 puntos de daño de tu primer impacto por ronda.' },
      { rank: 3, title: 'Guardaespaldas Confiable (Enforcer)', unlocks: '3 puntos de Combat Awareness. Mayor flexibilidad para dividir entre Iniciativa y Ataque.' },
      { rank: 4, title: 'Operativo Curtido (Seasoned Merc)', unlocks: '4 puntos de Combat Awareness. Desbloquea bonos significativos contra emboscadas y trampas.' },
      { rank: 5, title: 'Veterano de Escuadrón (Veteran Gunner)', unlocks: '5 puntos de Combat Awareness. Permite anular 5 puntos de daño del primer ataque enemigo recibido.' },
      { rank: 6, title: 'Asesino de Élite (Elite Hitman)', unlocks: '6 puntos de Combat Awareness. Capacidad de superar casi siempre la iniciativa de oponentes estándar.' },
      { rank: 7, title: 'Especialista Táctico (Tactical Specialist)', unlocks: '7 puntos de Combat Awareness. Bono acumulable de +3 o +4 a tiradas de impacto en momentos decisivos.' },
      { rank: 8, title: 'Máquina de Guerra (War Machine)', unlocks: '8 puntos de Combat Awareness. Absorción masiva de daño y letalidad quirúrgica contra blindajes pesados.' },
      { rank: 9, title: 'Leyenda del Afterlife (Afterlife Legend)', unlocks: '9 puntos de Combat Awareness. Dominio total del campo de batalla; anticipa cualquier emboscada.' },
      { rank: 10, title: 'Cibermonstruo Imparable (Solo Prime)', unlocks: '10 puntos de Combat Awareness. Nivel Morgan Blackhand: +10 puntos para distribuir a discreción.' }
    ]
  },
  Netrunner: {
    role: 'Netrunner',
    abilityName: 'Interface (Interfaz)',
    summary: 'Conexión neuronal directa con el ciberespacio y arquitecturas de red.',
    statUsed: 'INT / Interface',
    mechanicsOverview: 'Permite interactuar con Cyberdecks y Neuroports. Otorga Net Actions en tu turno (2 acciones en rangos 1-3, 3 acciones en rangos 4-6, 4 acciones en rangos 7-10). Rige tiradas de Pathfinder, Scanner, Backdoor, Cloak, Control, Eye-Dee, Virus y combate de Black ICE.',
    ranks: [
      { rank: 1, title: 'Script Kiddie', unlocks: '2 Net Actions/turno. DV Virus base 7. Capacidad de explorar 1 piso de red con Pathfinder.' },
      { rank: 2, title: 'Hacker de Azotea (Console Jockey)', unlocks: '2 Net Actions/turno. DV Virus 8. Mayor fiabilidad al atravesar contraseñas básicas.' },
      { rank: 3, title: 'Ciberbuzo Urbano (Net Diver)', unlocks: '2 Net Actions/turno. DV Virus 9. Capacidad de eludir Black ICE defensivo ligero.' },
      { rank: 4, title: 'Corredor de Sombras (Shadow Runner)', unlocks: '¡Desbloquea 3 Net Actions/turno! DV Virus 10. Puede controlar torretas y cámaras en paralelo.' },
      { rank: 5, title: 'Explorador Profundo (Deep Navigator)', unlocks: '3 Net Actions/turno. DV Virus 11. Detección y mapeo de hasta 5 pisos de red en 1 tirada de Pathfinder.' },
      { rank: 6, title: 'Infiltrador de Mainframes (System Slicer)', unlocks: '3 Net Actions/turno. DV Virus 12. Creación de virus personalizados destructivos.' },
      { rank: 7, title: 'Fantasma en la Red (Ghost in the Wire)', unlocks: '¡Desbloquea 4 Net Actions/turno! DV Virus 13. Ataques simultáneos y destrucción de Black ICE de élite.' },
      { rank: 8, title: 'Maestro de Arquitecturas (Architecture Overlord)', unlocks: '4 Net Actions/turno. DV Virus 14. Escribe virus capaces de fundir servidores enteros.' },
      { rank: 9, title: 'Cibermístico del Data Pool (Data Deity)', unlocks: '4 Net Actions/turno. DV Virus 15. Invisibilidad virtual casi indetectable por I.C.E. corporativo.' },
      { rank: 10, title: 'Avatar del Ciberespacio (Bartmoss Legacy)', unlocks: '4 Net Actions/turno. DV Virus 16+. Capacidad de desafiar las fortalezas de datos de Arasaka y Militech.' }
    ]
  },
  Tech: {
    role: 'Tech',
    abilityName: 'Maker (Creador)',
    summary: 'Genio artesanal, reparación, modificación y fabricación de ciberware, armas y vehículos.',
    statUsed: 'TECH',
    mechanicsOverview: 'Otorga puntos de Maker para asignar entre 4 especialidades: Field Expertise (reparaciones rápidas en combate), Upgrade Fabrication (mejorar estadísticas de objetos), Invention Expertise (diseñar equipo inédito) y Fabrication Expertise (fabricar objetos a mitad de precio).',
    ranks: [
      { rank: 1, title: 'Chatarrero (Grease Monkey)', unlocks: '2 puntos de Maker. Reparaciones de campo improvisadas (+1) y fabricación de consumibles baratos.' },
      { rank: 2, title: 'Técnico de Taller (Bench Tech)', unlocks: '4 puntos de Maker. Fabricación de armas cotidianas y mejoras simples de cargador o blindaje.' },
      { rank: 3, title: 'Modder Callejero (Street Customizer)', unlocks: '6 puntos de Maker. Instalación de accesorios especializados y personalización ergonómica.' },
      { rank: 4, title: 'Ingeniero Práctico (Practical Engineer)', unlocks: '8 puntos de Maker. Fabricación de armas Premium (500 €$) y blindaje Light Armorjack.' },
      { rank: 5, title: 'Maestro Artesano (Master Craftsman)', unlocks: '10 puntos de Maker. Fabricación de equipo Expensive (1,000 €$) y Rebuilds CEMK 2077 (DV 17).' },
      { rank: 6, title: 'Innovador Clandestino (Black-Market Fabricator)', unlocks: '12 puntos de Maker. Invención de prototipos cibernéticos no catalogados.' },
      { rank: 7, title: 'Arquitecto Tecnológico (Tech Architect)', unlocks: '14 puntos de Maker. Fabricación de vehículos y exoarmaduras de alta gama.' },
      { rank: 8, title: 'Visionario Cibernético (Cybernetic Visionary)', unlocks: '16 puntos de Maker. Mejoras legendarias: +1 ROF o añadir ranuras adicionales a implantes.' },
      { rank: 9, title: 'Forjador del Futuro (Apex Fabricator)', unlocks: '18 puntos de Maker. Creación de blindaje Metalgear y chasis de Full Body Conversion.' },
      { rank: 10, title: 'Demiurgo de Night City (Technological God)', unlocks: '20 puntos de Maker. Todo invento puede fabricarse; ninguna tecnología está fuera de su alcance.' }
    ]
  },
  Medtech: {
    role: 'Medtech',
    abilityName: 'Medicine (Medicina)',
    summary: 'Cirugía de trauma, farmacéutica avanzada y crioterapia intensiva.',
    statUsed: 'TECH',
    mechanicsOverview: 'Distribuye puntos de Medicina entre 3 ramas: Surgery (reparación y trasplante de órganos, amputaciones, ciberware invasivo), Medical Tech / Pharmaceuticals (síntesis de Speedheal, Boost, Blue Glass) y Cryosystem Operation (estabilización en criotanque y regeneración acelerada).',
    ranks: [
      { rank: 1, title: 'Camillero de Choque (Trauma Orderly)', unlocks: '2 puntos de Medicina. Acceso a 1 dosis de Speedheal sintetizada por semana o cirugía básica.' },
      { rank: 2, title: 'Técnico de Emergencias (EMT Responded)', unlocks: '4 puntos de Medicina. Operación de Cryotank portátil y cura de heridas críticas leves.' },
      { rank: 3, title: 'Enfermero de Combate (Combat Nurse)', unlocks: '6 puntos de Medicina. Síntesis de fármacos estimulantes y estabilización garantizada.' },
      { rank: 4, title: 'Médico Residente (Field Doctor)', unlocks: '8 puntos de Medicina. Síntesis de Speedheal y Boost. Tratamiento quirúrgico de huesos rotos (DV 15).' },
      { rank: 5, title: 'Cirujano de Trauma (Trauma Surgeon)', unlocks: '10 puntos de Medicina. Reemplazo de extremidades orgánicas y tratamiento de órganos colapsados.' },
      { rank: 6, title: 'Especialista en Farmacia (Bio-Pharma Specialist)', unlocks: '12 puntos de Medicina. Capacidad de mantener a múltiples pacientes en criosuspensión simultánea.' },
      { rank: 7, title: 'Cirujano Mayor (Chief Surgeon)', unlocks: '14 puntos de Medicina. Instalación de Borgware invasivo y cirugías de emergencia a corazón abierto en combate.' },
      { rank: 8, title: 'Director Médico de Clínica (Clinic Director)', unlocks: '16 puntos de Medicina. Síntesis de antibióticos biotecnológicos que anulan toxinas corporales.' },
      { rank: 9, title: 'Director de Trauma Team (Trauma Team Director)', unlocks: '18 puntos de Medicina. Procedimientos de Biopod e inicio de conversiones FBC completas.' },
      { rank: 10, title: 'Milagroso de la Carne (Miracle Worker)', unlocks: '20 puntos de Medicina. Puede devolver a la vida a personajes muertos clínicamente hace minutos.' }
    ]
  },
  Media: {
    role: 'Media',
    abilityName: 'Credibility (Credibilidad)',
    summary: 'Acceso periodístico, obtención de primicias y publicación de reportajes que conmocionan a la opinión pública.',
    statUsed: 'COOL / INT',
    mechanicsOverview: 'Al investigar o publicar, tira Credibility + 1d10 contra DV para convencer a testigos, obtener rumores fidedignos de fuentes corporativas y publicar noticias que fuerzan a corporaciones o autoridades a actuar.',
    ranks: [
      { rank: 1, title: 'Blogger Callejero (Screamer)', unlocks: 'Credibility 1. Acceso a rumores barriales de bajo nivel y fuentes anónimas en la Zona de Combate.' },
      { rank: 2, title: 'Corresponsal Independiente (Freelance Stringer)', unlocks: 'Credibility 2. Capacidad de conseguir pases de prensa de nivel local y entrevistas con pandilleros.' },
      { rank: 3, title: 'Reportero de Guardia (Cub Reporter)', unlocks: 'Credibility 3. Detección de mentiras oficiales y acceso a informes de radio de la policía.' },
      { rank: 4, title: 'Periodista de Investigación (Investigative Journalist)', unlocks: 'Credibility 4. Publicación en el Data Pool local; puede desacreditar a figuras públicas menores.' },
      { rank: 5, title: 'Editor de Sección (Beat Editor)', unlocks: 'Credibility 5. Red de informantes en corporaciones secundarias y protección legal básica.' },
      { rank: 6, title: 'Presentador de Noticias (Anchorperson)', unlocks: 'Credibility 6. Reportajes con impacto en toda la ciudad; convocatorias de protestas masivas.' },
      { rank: 7, title: 'Columnista Célebre (Celebrity Columnist)', unlocks: 'Credibility 7. Contactos de alto nivel con ejecutivos y políticos; acceso a conferencias de prensa exclusivas.' },
      { rank: 8, title: 'Investigador Pulitzer (Pulitzer Hunter)', unlocks: 'Credibility 8. Sus publicaciones causan caídas en la bolsa de valores y despidos de directivos.' },
      { rank: 9, title: 'Voz de la Verdad (Voice of Truth)', unlocks: 'Credibility 9. Protección de informantes blindada; la policía no se atreve a censurarlo sin consecuencias.' },
      { rank: 10, title: 'Icono Mediático Global (Media Tycoon)', unlocks: 'Credibility 10. Puede derrocar administraciones municipales y obligar a megacorporaciones a pedir perdón.' }
    ]
  },
  Exec: {
    role: 'Exec',
    abilityName: 'Teamwork (Trabajo en Equipo)',
    summary: 'Respaldo corporativo, vivienda pagada, seguro médico y subordinados leales.',
    statUsed: 'COOL',
    mechanicsOverview: 'Otorga un paquete corporativo (trajes ejecutivos, vivienda en Zona Corporativa, trauma team plateado) y el reclutamiento de miembros de equipo leales (Driver, Bodyguard, Netrunner, Technician) cuyos salarios paga la corporación.',
    ranks: [
      { rank: 1, title: 'Oficinista Jr. (Junior Associate)', unlocks: 'Vivienda corporativa tipo Estudio y ropa de negocios estándar. 0 subordinados.' },
      { rank: 2, title: 'Analista de División (Account Rep)', unlocks: 'Acceso al comedor ejecutivo y transporte corporativo para misiones de la empresa.' },
      { rank: 3, title: 'Gerente Adjunto (Assistant Manager)', unlocks: 'Apartamento corporativo de 2 habitaciones. Desbloquea tu 1er Subordinado (ej. Bodyguard o Conductor).' },
      { rank: 4, title: 'Gerente de Proyectos (Project Manager)', unlocks: 'Coche de empresa y cuenta de gastos corporativos para reuniones (500 €$/mes).' },
      { rank: 5, title: 'Director de Departamento (Department Head)', unlocks: 'Desbloquea tu 2do Subordinado (ej. Netrunner o Técnico de taller). Suite corporativa de lujo.' },
      { rank: 6, title: 'Subdirector de Operaciones (Senior Director)', unlocks: 'Cobertura médica Trauma Team Silver para ti y tus agentes. Aumento de nivel de lealtad de equipo.' },
      { rank: 7, title: 'Vicepresidente de Área (Vice President)', unlocks: 'Desbloquea tu 3er Subordinado. Residencia en Beaverville o Zona Corporativa de máxima seguridad.' },
      { rank: 8, title: 'Vicepresidente Senior (Senior VP)', unlocks: 'Aerodeslizador AV-4 con piloto disponible para viajes de negocios. Custodia armada corporativa.' },
      { rank: 9, title: 'Miembro del Consejo (Board Member)', unlocks: 'Cobertura médica Trauma Team Executive Platinum. Acceso a fondos negros corporativos.' },
      { rank: 10, title: 'Director Ejecutivo / CEO (Corporate Overlord)', unlocks: 'Suite Penthouse en lo más alto de la torre corporativa. 4 subordinados de élite leales a muerte.' }
    ]
  },
  Lawman: {
    role: 'Lawman',
    abilityName: 'Backup (Refuerzos)',
    summary: 'Capacidad de pedir asistencia armada por radio a patrullas, SWAT o MAX-TAC.',
    statUsed: 'WILL',
    mechanicsOverview: 'Tira 1d10. Si el resultado es igual o menor a tu Rango de Backup, los refuerzos responden y llegan en 1d6 rondas de combate. El tipo y letalidad de la unidad depende de tu rango.',
    ranks: [
      { rank: 1, title: 'Agente Novato (Rookie Beat Cop)', unlocks: 'Backup 1. 2 agentes de patrulla novatos (Medium Pistols, Kevlar SP 7). Respuesta en 1d6 rondas.' },
      { rank: 2, title: 'Patrullero (Patrolman)', unlocks: 'Backup 2. Probabilidad 20% de respuesta. Patrulleros armados con Heavy Pistols.' },
      { rank: 3, title: 'Oficial Primero (Senior Officer)', unlocks: 'Backup 3. Probabilidad 30% de respuesta. Patrulla armada con escopeta de apoyo.' },
      { rank: 4, title: 'Detective de Distrito (District Detective)', unlocks: 'Backup 4. Despacho de 2 oficiales veteranos (Armorjack SP 11, Heavy SMGs o Escopetas).' },
      { rank: 5, title: 'Sargento de Calle (Street Sergeant)', unlocks: 'Backup 5. 50% de probabilidad. Llegada en coche patrulla blindado Cruiser.' },
      { rank: 6, title: 'Teniente de Comisaría (Lieutenant)', unlocks: 'Backup 6. 60% de probabilidad. Unidad táctica C-SWAT ligera con rifles de asalto.' },
      { rank: 7, title: 'Capitán de SWAT (SWAT Captain)', unlocks: 'Backup 7. Despacho de 4 agentes SWAT fuertemente armados (Flak SP 15, Assault Rifles).' },
      { rank: 8, title: 'Comandante de Operaciones (Tactical Commander)', unlocks: 'Backup 8. 80% de probabilidad de respuesta rápida. Vehículos blindados antidisturbios.' },
      { rank: 9, title: 'Inspector General (Chief Inspector)', unlocks: 'Backup 9. 90% de probabilidad. Despacho de escuadra de MAX-TAC (Ciberpsicópatas con licencia).' },
      { rank: 10, title: 'Comisionado de Policía (Police Chief / MAX-TAC Commander)', unlocks: 'Backup 10. ¡Respuesta 100% garantizada! Escuadrón completo de MAX-TAC / C-SWAT con AV blindado.' }
    ]
  },
  Fixer: {
    role: 'Fixer',
    abilityName: 'Operator (Operador)',
    summary: 'Red de contactos, contrabando, regateo de precios y acceso a Mercados de Medianoche.',
    statUsed: 'COOL',
    mechanicsOverview: 'Se divide en 3 áreas: Contacts (determina el alcance de tu red de clientes e influencias), Haggling (ahorro o sobreprecio al comprar y vender) y Sourcing (acceso a comprar objetos de alto coste fuera del mercado común).',
    ranks: [
      { rank: 1, title: 'Revendedor de Esquina (Street Peddler)', unlocks: 'Operator 1. Puede localizar objetos Cheap y Everyday (hasta 100 €$). Contactos locales de barrio.' },
      { rank: 2, title: 'Tráfico de Maletero (Bootlegger)', unlocks: 'Operator 2. Regateo básico: +/- 10% en tratos selectos. Acceso a munición estándar en volumen.' },
      { rank: 3, title: 'Intermediario de Barrio (Local Broker)', unlocks: 'Operator 3. Puede conseguir objetos Costly y Premium (hasta 500 €$). Red en 2 distritos.' },
      { rank: 4, title: 'Fixer Establecido (Connected Broker)', unlocks: 'Operator 4. Acceso a objetos Expensive (hasta 1,000 €$). Puede organizar Midnight Markets locales.' },
      { rank: 5, title: 'Mercader de Sombras (Shadow Merchant)', unlocks: 'Operator 5. Regateo habitual de +/- 20%. Acceso a armamento militar y drogas de diseño.' },
      { rank: 6, title: 'Señor del Mercado Negro (Black-Market Boss)', unlocks: 'Operator 6. Localiza objetos Very Expensive (hasta 5,000 €$) como chasis FBC o Metalgear.' },
      { rank: 7, title: 'Operador de Élite (Elite Operator)', unlocks: 'Operator 7. Conexiones con contrabandistas internacionales y aerolíneas de carga clandestinas.' },
      { rank: 8, title: 'Corredor de Alianzas (Alliance Broker)', unlocks: 'Operator 8. Puede adquirir objetos Luxury (hasta 10,000 €$). Organiza Midnight Markets exclusivos.' },
      { rank: 9, title: 'Socio del Afterlife (Afterlife Kingpin)', unlocks: 'Operator 9. Mueve cargamentos de armas pesadas y ciberware militar de grado corporativo.' },
      { rank: 10, title: 'Amo de los Contratos (Night City Shadow Emperor)', unlocks: 'Operator 10. Nivel Rogue Amendiares: puede conseguir cualquier objeto Super Luxury del planeta.' }
    ]
  },
  Nomad: {
    role: 'Nomad',
    abilityName: 'Moto (Motor)',
    summary: 'Acceso a vehículos de la Familia Nómada, modificaciones y personalizaciones mecánicas.',
    statUsed: 'REF / TECH',
    mechanicsOverview: 'Cada rango en Moto te permite sumar 1 vehículo al garaje familiar o añadir 1 mejora especializada (Heavy Chassis, NOS, Blindaje SP, Montura de Armas Pesadas, Camuflaje, etc.) a tus vehículos de tierra, mar o aire.',
    ranks: [
      { rank: 1, title: 'Cachorro de Clan (Pack Cub)', unlocks: 'Moto 1. Acceso a 1 Vehículo Terrestre básico (Compact Car o Moto) o 1 mejora de garaje.' },
      { rank: 2, title: 'Explorador de Carretera (Outrider)', unlocks: 'Moto 2. 2 opciones de vehículo/mejora. Permite instalar mejoras de navegación todoterreno.' },
      { rank: 3, title: 'Conductor de Caravana (Convoy Driver)', unlocks: 'Moto 3. Acceso a vehículos tipo Sedán o Pickup de carga. Reparaciones en convoy familiar.' },
      { rank: 4, title: 'Piloto de Pistas (Highway Runner)', unlocks: 'Moto 4. 4 opciones. Acceso a Jet Ski o lanchas fueraborda para rutas fluviales.' },
      { rank: 5, title: 'Guerrero del Camino (Road Warrior)', unlocks: 'Moto 5. Acceso a blindaje corporal reforzado en vehículos y monturas de ametralladora.' },
      { rank: 6, title: 'Jefe de Escuadrón (Squad Leader)', unlocks: 'Moto 6. 6 opciones. Acceso a Camiones Pesados (Heavy Groundcar / Semirremolque) o Girocópteros.' },
      { rank: 7, title: 'Capitán de Caravana (Caravan Captain)', unlocks: 'Moto 7. Vehículos de transporte masivo equipados con torretas controladas por cable.' },
      { rank: 8, title: 'Jefe de Taller Nómada (Chief Gearhead)', unlocks: 'Moto 8. 8 opciones. Acceso a Aerodeslizadores AV-4 o lanchas blindadas de combate.' },
      { rank: 9, title: 'Señor del Asfalto (Highway Legend)', unlocks: 'Moto 9. Conducción en condiciones extremas y velocidad sobrehumana con NOS militar.' },
      { rank: 10, title: 'Jefe de Familia / Aldecaldo (Nomad Clan Chieftain)', unlocks: 'Moto 10. Toda una flota nómada a tu disposición con vehículos armados y helicópteros.' }
    ]
  },
  Rockerboy: {
    role: 'Rockerboy',
    abilityName: 'Charismatic Impact (Impacto Carismático)',
    summary: 'Magnetismo escénico, movilización de multitudes y devoción incondicional de los fanáticos.',
    statUsed: 'COOL',
    mechanicsOverview: 'Tira Charismatic Impact + 1d10 contra el DV según el tamaño de la audiencia o la dificultad de la petición. Puede convencer a un fan individual o a cientos de personas de ayudarte, conseguirte refugio, armar un motín o enfrentarse a la policía.',
    ranks: [
      { rank: 1, title: 'Músico de Garaje (Open-Mic Rebel)', unlocks: 'Impact 1. Afecta a un fan individual con DV 8. Puede conseguir bebidas gratis o firmas de apoyo.' },
      { rank: 2, title: 'Artista Callejero (Busker)', unlocks: 'Impact 2. Puede convencer a un fan de hacer un favor menor (llevar un paquete, prestar un auto).' },
      { rank: 3, title: 'Banda Local (Club Headliner)', unlocks: 'Impact 3. Afecta a grupos pequeños (hasta 6 fans). Refugio temporal en casa de un seguidor.' },
      { rank: 4, title: 'Fenómeno Indie (Indie Sensation)', unlocks: 'Impact 4. Afecta a audiencias de 10-20 personas. Capaz de crear un tumulto que bloquee una calle.' },
      { rank: 5, title: 'Estrella en Ascenso (Rising Star)', unlocks: 'Impact 5. Fanáticos devotos dispuestos a distraer guardias o esconder equipo clandestino.' },
      { rank: 6, title: 'Héroe Contracultural (Counterculture Hero)', unlocks: 'Impact 6. Afecta a grupos de 100 personas. Puede convencer a un fan de cometer un delito menor por ti.' },
      { rank: 7, title: 'Icono del Rock (Rock Icon)', unlocks: 'Impact 7. Multitudes de 500 personas. Capacidad de provocar disturbios contra una corporación rival.' },
      { rank: 8, title: 'Voz de la Generación (Voice of a Generation)', unlocks: 'Impact 8. Fanáticos dispuestos a arriesgar su integridad física para protegerte de la policía.' },
      { rank: 9, title: 'Mito Viviente (Living Myth)', unlocks: 'Impact 9. Movilización de miles de personas en conciertos callejeros clandestinos.' },
      { rank: 10, title: 'Leyenda Inmortal (Johnny Silverhand Tier)', unlocks: 'Impact 10. Con un discurso puede iniciar una revolución armada contra las torres de Arasaka.' }
    ]
  }
};

