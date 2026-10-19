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
  let rebuildType: 'power' | 'tech' | 'smart' | 'exotic' | null = null;
  let rebuildBadge: string | undefined = undefined;
  let rebuildTooltip: string | undefined = undefined;

  if (techType === 'power' || notes.includes('power weapon') || name.includes('(power)')) {
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
