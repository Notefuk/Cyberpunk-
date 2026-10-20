import type { EquippedWeapon, TechWeaponUpgradeType } from '../types/cyberpunk';

export interface WeaponAttachmentSecondaryAttack {
  name: string;
  skill: 'meleeWeapon' | 'shoulderArms' | 'heavyWeapons' | 'handgun';
  damage: string;
  rof: number;
  range: string;
  mag?: number;
}

export interface WeaponAttachment {
  id: string;
  name: string;
  slots: 1 | 2;
  cost: number;
  costTier: 'Everyday' | 'Costly' | 'Premium' | 'Expensive' | 'Very Expensive' | 'Luxury';
  eligibleWeaponTypes: string[];
  incompatibleWith: string[];
  summary: string;
  fullRules: string;
  attackBonus?: number;
  secondaryAttack?: WeaponAttachmentSecondaryAttack;
  ignoresDarknessSmoke?: boolean;
  isSilenced?: boolean;
  rebuild2077?: 'standard' | 'power' | 'smart' | 'tech';
}

export const WEAPON_ATTACHMENTS_CATALOG: WeaponAttachment[] = [
  {
    id: 'att-bayonet',
    name: 'Bayoneta (Bayonet)',
    slots: 1,
    cost: 100,
    costTier: 'Premium',
    eligibleWeaponTypes: ['shoulderArms'],
    incompatibleWith: [],
    summary: 'Cuchilla de combate fijada al cañón de un arma de hombro para combate cuerpo a cuerpo.',
    fullRules: 'Permite realizar ataques cuerpo a cuerpo de 1d6 de daño a ROF 2 usando Melee Weapon sin soltar el arma ni cambiar de mano.',
    secondaryAttack: {
      name: 'Ataque con Bayoneta',
      skill: 'meleeWeapon',
      damage: '1d6',
      rof: 2,
      range: 'Melee'
    }
  },
  {
    id: 'att-extended-mag',
    name: 'Cargador Ampliado (Extended Magazine)',
    slots: 1,
    cost: 100,
    costTier: 'Premium',
    eligibleWeaponTypes: ['handgun', 'shoulderArms', 'heavyWeapons'],
    incompatibleWith: ['att-drum-mag'],
    summary: 'Incrementa la capacidad de munición del arma según la tabla oficial del Core Rulebook.',
    fullRules: 'Aumenta el tamaño del cargador del arma (Core pp. 342-343). Incompatible con cargador de tambor.'
  },
  {
    id: 'att-drum-mag',
    name: 'Cargador de Tambor (Drum Magazine)',
    slots: 2,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['handgun', 'shoulderArms', 'heavyWeapons'],
    incompatibleWith: ['att-extended-mag'],
    summary: 'Incrementa drásticamente la capacidad de munición del arma ocupando 2 ranuras.',
    fullRules: 'Aumenta masivamente el tamaño del cargador del arma (Core p. 343). Requiere 2 ranuras. Incompatible con cargador ampliado.'
  },
  {
    id: 'att-underbarrel-gl',
    name: 'Lanzagranadas Bajo Cañón (Underbarrel Grenade Launcher)',
    slots: 2,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['shoulderArms'],
    incompatibleWith: ['att-underbarrel-sg'],
    summary: 'Lanzagranadas secundario de 1 tiro acoplado bajo el guardamanos.',
    fullRules: 'Permite disparar 1 granada (6d6 de daño) usando Heavy Weapons sin soltar el arma. Requiere 2 ranuras. Incompatible con escopeta bajo cañón.',
    secondaryAttack: {
      name: 'Disparo de Granada Bajo Cañón',
      skill: 'heavyWeapons',
      damage: '6d6',
      rof: 1,
      range: 'Rango Lanzagranadas',
      mag: 1
    }
  },
  {
    id: 'att-underbarrel-sg',
    name: 'Escopeta Bajo Cañón (Underbarrel Shotgun)',
    slots: 2,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['shoulderArms'],
    incompatibleWith: ['att-underbarrel-gl'],
    summary: 'Escopeta secundaria de 2 tiros acoplada bajo el cañón.',
    fullRules: 'Permite disparar cartuchos de escopeta (5d6 slugs o 3d6 perdigones) a ROF 1 usando Shoulder Arms. Capacidad: 2 cartuchos. Incompatible con lanzagranadas bajo cañón.',
    secondaryAttack: {
      name: 'Disparo de Escopeta Bajo Cañón',
      skill: 'shoulderArms',
      damage: '5d6',
      rof: 1,
      range: 'Rango Escopeta',
      mag: 2
    }
  },
  {
    id: 'att-heavy-chassis',
    name: 'Chasis Reforzado con Bípode (Heavy Chassis / Bipod)',
    slots: 1,
    cost: 100,
    costTier: 'Premium',
    eligibleWeaponTypes: ['shoulderArms', 'heavyWeapons'],
    incompatibleWith: [],
    summary: 'Bípode plegable para estabilización en disparos apoyados sobre cobertura.',
    fullRules: 'Al disparar apostado sobre cobertura sólida agachado o cuerpo a tierra, estabiliza el arma eliminando penalizaciones por temblor o retroceso.'
  },
  {
    id: 'att-ir-nv-scope',
    name: 'Mira Infrarroja / Visión Nocturna (IR / Nightvision Scope)',
    slots: 1,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['handgun', 'shoulderArms', 'heavyWeapons'],
    incompatibleWith: [],
    summary: 'Óptica térmica avanzada que anula penalizaciones por oscuridad y humo.',
    fullRules: 'Elimina totalmente las penalizaciones al ataque a distancia producidas por oscuridad, penumbra o humo denso.',
    ignoresDarknessSmoke: true
  },
  {
    id: 'att-sniping-scope',
    name: 'Mira Telescópica de Francotirador (Sniping Scope)',
    slots: 1,
    cost: 100,
    costTier: 'Premium',
    eligibleWeaponTypes: ['shoulderArms'],
    incompatibleWith: [],
    summary: 'Mira telescópica de alta magnificación: otorga +1 al ataque a distancias de 51 metros o más.',
    fullRules: 'Añade un bonificador de +1 a la tirada de ataque cuando el blanco se encuentre a 51 metros o más.',
    attackBonus: 1
  },
  {
    id: 'att-smartgun-link',
    name: 'Enlace Smartgun (Smartgun Link)',
    slots: 2,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['handgun', 'shoulderArms', 'heavyWeapons'],
    incompatibleWith: ['att-power-rebuild', 'att-tech-rebuild'],
    summary: 'Convierte el arma en Smartgun. Confiere +1 al ataque con Subdermal Grip o Interface Plugs.',
    fullRules: 'Conecta el procesador de puntería con el ciberware del tirador, otorgando un bonificador constante de +1 a las tiradas de ataque. Requiere 2 ranuras.',
    attackBonus: 1
  },
  {
    id: 'att-silencer',
    name: 'Silenciador / Supresor (Silencer / Suppressor)',
    slots: 1,
    cost: 100,
    costTier: 'Premium',
    eligibleWeaponTypes: ['handgun', 'shoulderArms'],
    incompatibleWith: [],
    summary: 'Atenuador sónico para pistolas y SMGs. Solo detectable con Percepción DV 17.',
    fullRules: 'Los disparos no alertan a enemigos fuera de la estancia inmediata a menos que superen una prueba de Percepción DV 17.',
    isSilenced: true
  },
  {
    id: 'att-power-rebuild',
    name: 'Modificación 2077: Power (Rebote Cinético)',
    slots: 1,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['handgun', 'shoulderArms'],
    incompatibleWith: ['att-smart-rebuild', 'att-tech-rebuild', 'att-smartgun-link'],
    summary: 'Reconfiguración CEMK 2077 para proyectiles de alto impacto capaces de rebotar en superficies duras.',
    fullRules: 'Convierte el arma en un arma Power balística con capacidad de tiro con rebote táctico.',
    rebuild2077: 'power'
  },
  {
    id: 'att-smart-rebuild',
    name: 'Modificación 2077: Smart (Micro-misiles Guiados)',
    slots: 2,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['handgun', 'shoulderArms'],
    incompatibleWith: ['att-power-rebuild', 'att-tech-rebuild', 'att-smartgun-link'],
    summary: 'Reconfiguración CEMK 2077 con micro-misiles dirigidos. Confiere +1 al ataque con Neuroport.',
    fullRules: 'Convierte el arma en Smart 2077, otorgando un bono de +1 al ataque cuando se utiliza con Neuroport o Smartlink.',
    attackBonus: 1,
    rebuild2077: 'smart'
  },
  {
    id: 'att-tech-rebuild',
    name: 'Modificación 2077: Tech (Acelerador Electromagnético)',
    slots: 1,
    cost: 500,
    costTier: 'Expensive',
    eligibleWeaponTypes: ['handgun', 'shoulderArms'],
    incompatibleWith: ['att-power-rebuild', 'att-smart-rebuild', 'att-smartgun-link'],
    summary: 'Reconfiguración CEMK 2077 con raíles de inducción magnética para disparos cargados que penetran cobertura.',
    fullRules: 'Convierte el arma en Tech electromagnética capaz de atravesar cobertura sólida mediante disparos cargados.',
    rebuild2077: 'tech'
  }
];

export interface WeaponSlotCapacityResult {
  maxSlots: number;
  usedSlots: number;
  remainingSlots: number;
  isExotic: boolean;
}

export function calculateWeaponSlotCapacity(weapon: EquippedWeapon): WeaponSlotCapacityResult {
  const isMelee =
    weapon.skill === 'meleeWeapon' ||
    weapon.skill === 'brawling' ||
    weapon.skill === 'martialArts' ||
    (weapon as any).category === 'melee';
  const nameOrType = `${weapon.name} ${weapon.type ?? ''} ${weapon.notes ?? ''}`.toLowerCase();
  const isExotic = (weapon as any).quality === 'exotic' || nameOrType.includes('exotic') || isMelee;

  let maxSlots = isExotic ? 0 : 3;

  if (weapon.techUpgrade === 'extra_slot') {
    maxSlots += 1;
  }

  const installed = weapon.installedAttachments ?? [];
  let usedSlots = 0;
  for (const attId of installed) {
    const found = WEAPON_ATTACHMENTS_CATALOG.find((a) => a.id === attId);
    if (found) {
      usedSlots += found.slots;
    } else {
      usedSlots += 1;
    }
  }

  return {
    maxSlots,
    usedSlots,
    remainingSlots: Math.max(0, maxSlots - usedSlots),
    isExotic
  };
}

export function calculateModifiedMagazineSize(weapon: EquippedWeapon, baseMag?: number): number {
  const base = baseMag ?? weapon.baseStandardMag ?? weapon.standardMag ?? 0;
  if (base <= 0) return 0;

  const installed = weapon.installedAttachments ?? [];
  const hasDrum = installed.includes('att-drum-mag');
  const hasExt = installed.includes('att-extended-mag');

  if (!hasDrum && !hasExt) {
    return base;
  }

  const nameOrType = `${weapon.name} ${weapon.type ?? ''}`.toLowerCase();

  if (hasDrum) {
    if (nameOrType.includes('heavy pistol') || nameOrType.includes('pistola pesada')) return 28;
    if (nameOrType.includes('very heavy pistol') || nameOrType.includes('pistola muy pesada')) return 28;
    if (nameOrType.includes('medium pistol') || nameOrType.includes('pistola media')) return 36;
    if (nameOrType.includes('heavy smg') || nameOrType.includes('subfusil pesado')) return 60;
    if (nameOrType.includes('smg') || nameOrType.includes('subfusil')) return 50;
    if (nameOrType.includes('shotgun') || nameOrType.includes('escopeta')) return 16;
    if (nameOrType.includes('sniper') || nameOrType.includes('francotirador')) return 16;
    if (nameOrType.includes('assault rifle') || nameOrType.includes('rifle de asalto')) return 45;

    // Fallback based on base mag value
    if (base === 12) return 36;
    if (base === 8) return 28;
    if (base === 30) return 50;
    if (base === 40) return 60;
    if (base === 4) return 16;
    if (base === 25) return 45;
    return base * 2;
  }

  if (hasExt) {
    if (nameOrType.includes('heavy pistol') || nameOrType.includes('pistola pesada')) return 14;
    if (nameOrType.includes('very heavy pistol') || nameOrType.includes('pistola muy pesada')) return 14;
    if (nameOrType.includes('medium pistol') || nameOrType.includes('pistola media')) return 18;
    if (nameOrType.includes('heavy smg') || nameOrType.includes('subfusil pesado')) return 50;
    if (nameOrType.includes('smg') || nameOrType.includes('subfusil')) return 40;
    if (nameOrType.includes('shotgun') || nameOrType.includes('escopeta')) return 8;
    if (nameOrType.includes('sniper') || nameOrType.includes('francotirador')) return 8;
    if (nameOrType.includes('assault rifle') || nameOrType.includes('rifle de asalto')) return 35;

    // Fallback based on base mag value
    if (base === 12) return 18;
    if (base === 8) return 14;
    if (base === 30) return 40;
    if (base === 40) return 50;
    if (base === 4) return 8;
    if (base === 25) return 35;
    return base + (base >= 20 ? 10 : base >= 8 ? 6 : 4);
  }

  return base;
}

export interface WeaponAttachmentBonusesResult {
  attackBonus: number;
  bonusBreakdown: string[];
  hasBayonet: boolean;
  hasUnderbarrelSg: boolean;
  hasUnderbarrelGl: boolean;
  ignoresDarknessSmoke: boolean;
  isSilenced: boolean;
}

export function calculateWeaponAttachmentBonuses(
  weapon: EquippedWeapon,
  distanceMeters?: number
): WeaponAttachmentBonusesResult {
  let attackBonus = 0;
  const bonusBreakdown: string[] = [];
  const installed = weapon.installedAttachments ?? [];

  if (weapon.techUpgrade === 'excellent_quality') {
    attackBonus += 1;
    bonusBreakdown.push('+1 Calidad Excelente (Tech Maker Upgrade)');
  }

  const isSmart =
    installed.includes('att-smartgun-link') ||
    installed.includes('att-smart-rebuild') ||
    weapon.rebuild2077 === 'smart';

  if (isSmart) {
    attackBonus += 1;
    bonusBreakdown.push('+1 Smartgun Link / Smart Tech');
  }

  if (installed.includes('att-sniping-scope') && distanceMeters !== undefined && distanceMeters >= 51) {
    attackBonus += 1;
    bonusBreakdown.push('+1 Sniping Scope (Objetivo a 51m+)');
  }

  return {
    attackBonus,
    bonusBreakdown,
    hasBayonet: installed.includes('att-bayonet'),
    hasUnderbarrelSg: installed.includes('att-underbarrel-sg'),
    hasUnderbarrelGl: installed.includes('att-underbarrel-gl'),
    ignoresDarknessSmoke: installed.includes('att-ir-nv-scope'),
    isSilenced: installed.includes('att-silencer')
  };
}

export interface MakerUpgradeOption {
  id: TechWeaponUpgradeType | 'armor_plus_one_sp';
  label: string;
  targetType: 'weapon' | 'armor';
  description: string;
}

export const TECH_MAKER_UPGRADE_OPTIONS: MakerUpgradeOption[] = [
  {
    id: 'excellent_quality',
    label: 'Calidad Excelente (+1 Ataque)',
    targetType: 'weapon',
    description: 'Añade un bonificador de +1 permanente a todas las tiradas de ataque con esta arma.'
  },
  {
    id: 'extra_slot',
    label: 'Ranura Adicional de Accesorio (+1 Slot)',
    targetType: 'weapon',
    description: 'Incrementa la capacidad de accesorios del arma en +1 ranura adicional (máximo 4 ranuras).'
  },
  {
    id: 'concealable',
    label: 'Diseño Ocultable (Concealable)',
    targetType: 'weapon',
    description: 'Modifica y compacta el chasis para que el arma pueda ocultarse bajo una chaqueta o abrigo.'
  },
  {
    id: 'invention_damage_mod',
    label: 'Optimización de Cámara / Cerrojo (+1 Daño o Mod Especial)',
    targetType: 'weapon',
    description: 'Calibración de alta precisión en recámara y cañón que optimiza la entrega de energía balística.'
  },
  {
    id: 'armor_plus_one_sp',
    label: 'Refuerzo de Blindaje (+1 SP Máx y Actual)',
    targetType: 'armor',
    description: 'Refuerza las placas balísticas añadiendo permanentemente +1 SP al valor máximo y actual de la armadura.'
  }
];

export interface MakerDvEntry {
  costTier: string;
  itemPriceMax: number;
  upgradeDv: number;
  timeRequired: string;
}

export const MAKER_DV_AND_TIME_BY_COST: MakerDvEntry[] = [
  { costTier: 'Cheap/Everyday (10-20 eb)', itemPriceMax: 20, upgradeDv: 9, timeRequired: '1 hora' },
  { costTier: 'Costly (50 eb)', itemPriceMax: 50, upgradeDv: 13, timeRequired: '6 horas' },
  { costTier: 'Premium (100 eb)', itemPriceMax: 100, upgradeDv: 17, timeRequired: '1 día' },
  { costTier: 'Expensive (500 eb)', itemPriceMax: 500, upgradeDv: 21, timeRequired: '1 semana' },
  { costTier: 'Very Expensive (1,000 eb)', itemPriceMax: 1000, upgradeDv: 24, timeRequired: '2 semanas' },
  { costTier: 'Luxury (5,000 eb)', itemPriceMax: 5000, upgradeDv: 29, timeRequired: '1 mes' },
  { costTier: 'Super Luxury (10,000+ eb)', itemPriceMax: 999999, upgradeDv: 29, timeRequired: '1 mes por cada 10,000 eb' }
];

export interface TechLifepathTable {
  id: string;
  title: string;
  dice: '1d10' | '1d6';
  options: string[];
}

export const TECH_LIFEPATH_TABLES: Record<string, TechLifepathTable> = {
  whatKindOfTech: {
    id: 'whatKindOfTech',
    title: '1. ¿Qué tipo de Tech eres? (What Kind of Tech Are You?)',
    dice: '1d10',
    options: [
      'Técnico de Ciberware: Calibras implantes y diseñas prótesis cibernéticas a medida.',
      'Mecánico de Vehículos: Modificas motores de bólidos, aerodinos y convoyes blindados.',
      'Armero de Precisión: Fabricas y tuneas armas de fuego personalizadas y cañones pesados.',
      'Ingeniero Biotecnológico: Especialista en órganos clonados y sistemas médicos bio-sintéticos.',
      'Cerrahero y Experto en Seguridad: Reventador de cerraduras electrónicas, cajas fuertes y sensores.',
      'Constructor de Cyberdecks: Diseñas decks de Netrunning con procesadores optimizados de alta velocidad.',
      'Especialista en Robótica y Drones: Fabricas autómatas de patrulla, arañas de vigilancia y torretas.',
      'Experto en Demoliciones y Explosivos: Fabricas cargas huecas, granadas artesanales y bombas de racimo.',
      'Chatarrero y Chatarrero Genial: Construyes tecnología de alta gama usando chatarra de vertederos.',
      'Inventor Loco / Científico Rebelde: Experimentas con física de vanguardia y prototipos no autorizados.'
    ]
  },
  workAloneOrPartner: {
    id: 'workAloneOrPartner',
    title: '2. ¿Trabajas solo o con socios? (Solo or Partner?)',
    dice: '1d6',
    options: [
      'Completamente solo: No confías en nadie con tus planos ni con tus llaves.',
      'Solo, pero compartes alquiler de taller en un garaje cooperativo comunitario.',
      'Sociedad al 50% con un compañero de confianza o tu pareja.',
      'Parte de un equipo independiente especializado en encargos de alto riesgo.',
      'Contratado en exclusiva por un Fixer de barrio que te proporciona clientes.',
      'Mecánico bajo deuda forzada para una banda callejera que vigila tus movimientos.'
    ]
  },
  workspace: {
    id: 'workspace',
    title: '3. ¿Cómo es tu Taller o Espacio de Trabajo? (Workspace)',
    dice: '1d6',
    options: [
      'Furgoneta o camión blindado nómada, siempre en movimiento por las carreteras.',
      'Contenedor marítimo reforzado en un depósito de chatarra industrial.',
      'Sótano secreto debajo de un almacén abandonado en la Zona de Combate.',
      'Apartamento cúbico minúsculo con herramientas y soldadores colgando del techo.',
      'Trastienda camuflada detrás de un local de fideos 24 horas.',
      'Sala limpia de alta tecnología alquilada bajo identidad falsa en la Zona Corporativa.'
    ]
  },
  mainClients: {
    id: 'mainClients',
    title: '4. ¿Quiénes son tus clientes principales? (Main Clients)',
    dice: '1d6',
    options: [
      'Edgerunners y Solos de combate curtidos que pagan bien por armas fiables.',
      'Familias y vecinos de tu distrito que necesitan generadores y prótesis baratas.',
      'Lugartenientes de bandas callejeras que exigen más potencia de fuego para sus guerras.',
      'Operativos de operaciones encubiertas de megacorporaciones que buscan equipo sin rastreo.',
      'Caravanas Nómadas que cruzan las afueras de Night City buscando reparaciones de viaje.',
      'Agentes de policía del NCPD o guardias privados que acuden a ti fuera de servicio.'
    ]
  },
  supplySources: {
    id: 'supplySources',
    title: '5. ¿De dónde consigues tus suministros? (Supplies)',
    dice: '1d6',
    options: [
      'Rastreo y chatarrería en vertederos industriales y ruinas de combate.',
      'Tratos turbios en el mercado negro con Fixers de confianza.',
      'Asaltos coordinados a convoyes de suministros y contenedores corporativos robados.',
      'Intercambios comerciales con transportistas nómadas que traen piezas de otras ciudades.',
      'Desguace sistemático de ciberware enemigo y restos de tiroteos callejeros.',
      'Fundición y síntesis química casera a partir de plásticos y aleaciones recicladas.'
    ]
  },
  whoWantsYouDead: {
    id: 'whoWantsYouDead',
    title: '6. ¿Quién te busca para matarte o cobrarte una deuda? (Enemies/Guns on You)',
    dice: '1d6',
    options: [
      'Un Tech rival celoso que no tolera que tus diseños superen a los suyos.',
      'Un equipo de recuperación corporativa que reclama planos o piezas impagadas.',
      'Un jefe de banda que asegura que tu arma modificada falló y causó la muerte de su lugarteniente.',
      'Un antiguo socio al que abandonaste o que te estafó dejándote deudas impagables.',
      'Un Fixer furioso que asegura que filtraste los esquemas técnicos de su golpe secreto.',
      'Nadie todavía... pero tu paranoia es tan alta que duermes con una escopeta bajo la almohada.'
    ]
  }
};

export interface RoleLifepathQuestionDef {
  id: string;
  label: string;
  dice: '1d10' | '1d6';
  options: string[];
}

export const ROLE_SPECIFIC_LIFEPATH_TABLES_BY_ROLE: Record<string, RoleLifepathQuestionDef[]> = {
  tech: [
    {
      id: 'tech_whatKindOfTech',
      label: TECH_LIFEPATH_TABLES.whatKindOfTech.title,
      dice: TECH_LIFEPATH_TABLES.whatKindOfTech.dice,
      options: TECH_LIFEPATH_TABLES.whatKindOfTech.options
    },
    {
      id: 'tech_workAloneOrPartner',
      label: TECH_LIFEPATH_TABLES.workAloneOrPartner.title,
      dice: TECH_LIFEPATH_TABLES.workAloneOrPartner.dice,
      options: TECH_LIFEPATH_TABLES.workAloneOrPartner.options
    },
    {
      id: 'tech_workspace',
      label: TECH_LIFEPATH_TABLES.workspace.title,
      dice: TECH_LIFEPATH_TABLES.workspace.dice,
      options: TECH_LIFEPATH_TABLES.workspace.options
    },
    {
      id: 'tech_mainClients',
      label: TECH_LIFEPATH_TABLES.mainClients.title,
      dice: TECH_LIFEPATH_TABLES.mainClients.dice,
      options: TECH_LIFEPATH_TABLES.mainClients.options
    },
    {
      id: 'tech_supplySources',
      label: TECH_LIFEPATH_TABLES.supplySources.title,
      dice: TECH_LIFEPATH_TABLES.supplySources.dice,
      options: TECH_LIFEPATH_TABLES.supplySources.options
    },
    {
      id: 'tech_whoWantsYouDead',
      label: TECH_LIFEPATH_TABLES.whoWantsYouDead.title,
      dice: TECH_LIFEPATH_TABLES.whoWantsYouDead.dice,
      options: TECH_LIFEPATH_TABLES.whoWantsYouDead.options
    }
  ],
  solo: [
    {
      id: 'solo_type',
      label: '¿Qué tipo de Solo eres en la calle?',
      dice: '1d6',
      options: [
        'Guardaespaldas profesional que nunca se separa de su cliente.',
        'Asesino callejero que cobra por contrato y no hace preguntas morales.',
        'Veterano de guerra corporativa que solo conoce la disciplina militar de combate.',
        'Mercenario táctico de asalto especializado en demoliciones y armas pesadas.',
        'Espadachín de honor urbano que domina la katana y artes marciales.',
        'Justiciero violento que limpia los callejones de abusadores y escoria.'
      ]
    },
    {
      id: 'solo_moral',
      label: '¿Cuál es tu código ético en un contrato?',
      dice: '1d6',
      options: [
        'Si acepto el dinero, cumplo el contrato sin importar quién muera.',
        'Jamás mato a inocentes, niños o personal médico de campaña.',
        'El mejor postor manda: si el blanco me paga el doble, cambio de bando.',
        'Mi honor militar es sagrado; prefiero morir que romper un juramento.',
        'Solo mato corporativos y gánsteres corruptos; la calle es sagrada.',
        'Sin reglas: en un tiroteo sobrevive el más despiadado y rápido.'
      ]
    },
    {
      id: 'solo_territory',
      label: '¿Dónde prefieres operar?',
      dice: '1d6',
      options: [
        'En los callejones oscuros y edificios en ruinas de la Zona de Combate.',
        'En los pisos altos y recepciones blindadas del Distrito Corporativo.',
        'En las carreteras abiertas y refinerías ardientes de los Badlands.',
        'En almacenes portuarios y muelles de contrabando nocturno.',
        'En tejados y azoteas como francotirador solitario indetectable.',
        'En el cuadrilátero clandestino de peleas a puño limpio sin implantes.'
      ]
    }
  ],
  netrunner: [
    {
      id: 'net_workspace',
      label: '¿Dónde prefieres montar tu puesto de Netrunning?',
      dice: '1d6',
      options: [
        'En una furgoneta blindada con antenas camufladas en constante movimiento.',
        'En una bañera llena de hielo en un apartamento cochambroso.',
        'En una suite corporativa con refrigeración líquida de grado militar.',
        'En un cubículo clandestino en el sótano de un club de música electrónica.',
        'En un cyberdeck portátil corriendo por los pasillos a 5 metros de los servidores.',
        'En una tienda nómada en el desierto con generadores solares.'
      ]
    },
    {
      id: 'net_specialty',
      label: '¿Cuál es tu estilo o firma en la Red?',
      dice: '1d6',
      options: [
        'Dejar un logo holográfico burlón en cada nodo hackeado.',
        'Infiltración fantasma: nadie sabe que estuve allí ni faltan datos visibles.',
        'Fuerza bruta: destruir el Black ICE a base de programas ofensivos y quemar el servidor.',
        'Robo de secretos: extraer nóminas corporativas y venderlas a la competencia.',
        'Control ambiental: apagar luces, cerrar puertas y reprogramar torretas.',
        'Infección de virus durmientes que despiertan meses después.'
      ]
    },
    {
      id: 'net_partner',
      label: '¿Quién es tu contacto o soporte habitual de carne?',
      dice: '1d6',
      options: [
        'Un Solo de confianza que vigila mi cuerpo mientras navego en la Red.',
        'Una IA rebelde que habita en los bordes de la Vieja Red.',
        'Un Fixer que subasta mis datos robados al mejor postor.',
        'Un colega Netrunner con el que hago hackeo simultáneo a dos bandas.',
        'Trabajo completamente solo; no confío en nadie cuando estoy jackeado.',
        'Un técnico que me construye cyberdecks con procesadores militares robados.'
      ]
    }
  ],
  rockerboy: [
    {
      id: 'rocker_type',
      label: '¿Qué tipo de Rockerboy eres?',
      dice: '1d6',
      options: [
        'Cantante o líder carismático de una banda de punk rock antisistema.',
        'Poeta callejero y orador rebelde en protestas contra las megacorporaciones.',
        'DJ de música electrónica underground que pincha en naves clandestinas.',
        'Solista de guitarra acústica que canta baladas sobre la vida en las calles.',
        'Comediante satírico o streamer que destroza a los políticos en directo.',
        'Icono pop rebelde que ha desertado de un contrato millonario corporativo.'
      ]
    },
    {
      id: 'rocker_group',
      label: '¿Actúas en solitario o con banda?',
      dice: '1d6',
      options: [
        'Solista absoluto: el foco debe estar únicamente en mi voz y mensaje.',
        'Con una banda leal de hermanos que se matarían por el grupo.',
        'Con músicos de sesión mercenarios que tocan por dinero rápido.',
        'Dúo con un compañero inseparable que complementa mis canciones.',
        'Con una orquesta rebelde de sintetizadores y percusión de chatarrería.',
        'Banda rota: mis antiguos compañeros me traicionaron y ahora busco venganza.'
      ]
    },
    {
      id: 'rocker_enemy',
      label: '¿Quién quiere censurarte o destruirte?',
      dice: '1d6',
      options: [
        'Una discográfica corporativa a la que rompí un contrato multimillonario.',
        'Un político local corrupto cuyas vergüenzas expuse en una canción viral.',
        'Una pandilla de boosters que no tolera que toque en su territorio.',
        'Un antiguo fanático obsesionado que ahora me acosa con armas.',
        'Un ejecutivo conservador que considera mi arte "terrorismo cultural".',
        'Un crítico de música influyente que destruye carreras con sus reseñas.'
      ]
    }
  ],
  medtech: [
    {
      id: 'med_type',
      label: '¿Qué tipo de Medtech eres?',
      dice: '1d6',
      options: [
        'Cirujano de ripperdoc clandestino en un callejón sin licencia oficial.',
        'Médico táctico de combate que extrae heridos bajo fuego de ametralladora.',
        'Investigador farmacéutico que crea drogas de combate personalizadas.',
        'Especialista en criogenia y estabilización de víctimas de muerte clínica.',
        'Ex-cirujano corporativo expulsado por negarse a implantar chips letales.',
        'Médico voluntario en una clínica comunitaria de la Zona de Combate.'
      ]
    },
    {
      id: 'med_partner',
      label: '¿Quién es tu socio o cliente habitual?',
      dice: '1d6',
      options: [
        'Trabajo en solitario con un dron quirúrgico como único asistente.',
        'Asociado con un Fixer que me envía Solos heridos y se queda una comisión.',
        'En una ambulancia blindada independiente con un conductor temerario.',
        'En una clínica compartida con otro médico al que no le importan las preguntas.',
        'Contratado en secreto por una familia nómada para cuidar de sus ancianos.',
        'En deuda con una banda que me obliga a remendar a sus pistoleros.'
      ]
    },
    {
      id: 'med_ethics',
      label: '¿Cuál es tu código hipocrático en la calle?',
      dice: '1d6',
      options: [
        'Curo a cualquiera que pague en mano, sea un santo o un asesino en serie.',
        'Nunca atiendo a corporativos ni a policías corruptos.',
        'Primero salvo vidas de niños y civiles; los edgerunners van al final.',
        'Todo tratamiento tiene un precio en piezas o ciberware reciclado.',
        'El juramento hipocrático es sagrado: no dejo morir a nadie en mi camilla.',
        'Si el paciente no puede pagar, me cobro con uno de sus implantes.'
      ]
    }
  ],
  media: [
    {
      id: 'media_type',
      label: '¿Qué tipo de periodista eres?',
      dice: '1d6',
      options: [
        'Reportero de investigación de campo que se infiltra en zonas prohibidas.',
        'Paparazzi despiadado que caza escándalos sexuales y financieros corporativos.',
        'Camarógrafo de combate que graba tiroteos a quemarropa con dron.',
        'Presentador de noticias clandestinas por pirateo de frecuencias de TV.',
        'Ensayista político y podcaster antisistema con miles de suscriptores.',
        'Fotógrafo documental que inmortaliza la miseria y el heroísmo callejero.'
      ]
    },
    {
      id: 'media_creed',
      label: '¿Cuál es tu código deontológico?',
      dice: '1d6',
      options: [
        'La verdad sin censura debe salir a la luz, cueste las vidas que cueste.',
        'La exclusiva más morbosa y explosiva es la que vende; el morbo manda.',
        'Proteger a mis fuentes es más importante que mi propia vida.',
        'Uso la información como arma para derribar a los poderosos.',
        'Vendo mis investigaciones al mejor postor corporativo para jubilarme.',
        'No publico nada que pueda provocar la muerte de personas inocentes.'
      ]
    }
  ],
  exec: [
    {
      id: 'exec_division',
      label: '¿En qué departamento corporativo operas?',
      dice: '1d6',
      options: [
        'Operaciones encubiertas y eliminación de competencia desleal.',
        'Finanzas agresivas, fusiones hostiles y préstamos leoninos.',
        'Marketing viral, manipulación de medios y control de imagen pública.',
        'Recursos Humanos: selección y liquidación de empleados problemáticos.',
        'Investigación y desarrollo de armas biológicas y ciberware militar.',
        'Logística y transporte de cargamentos de alto secreto intercontinental.'
      ]
    },
    {
      id: 'exec_rival',
      label: '¿Quién es tu mayor amenaza interna en la corporación?',
      dice: '1d6',
      options: [
        'Un subordinado ambicioso que planea envenenarme para quedarse mi puesto.',
        'Mi superior directo, que teme que mis éxitos hagan sombra a su carrera.',
        'Un ejecutivo de una división rival con el que compito por el mismo presupuesto.',
        'El departamento de auditoría interna, que sospecha de mis desvíos de fondos.',
        'Un antiguo mentor al que traicioné para ascender al consejo de administración.',
        'Un mercenario al que no pagué y que ahora busca mi cabeza.'
      ]
    }
  ],
  lawman: [
    {
      id: 'law_division',
      label: '¿A qué división de seguridad perteneces?',
      dice: '1d6',
      options: [
        'Patrulla de calle en un coche blindado en pleno corazón de la ciudad.',
        'División de Homicidios investigando crímenes de ciberpsicópatas.',
        'Fuerzas especiales SWAT / C-SWAT para asaltos tácticos pesados.',
        'Seguridad privada de élite subcontratada por una megacorporación.',
        'Asuntos Internos persiguiendo a policías corruptos que cobran sobornos.',
        'Ranger de los Badlands patrullando carreteras fuera de la ley.'
      ]
    },
    {
      id: 'law_morals',
      label: '¿Cuán limpia es tu placa?',
      dice: '1d6',
      options: [
        'Totalmente incorruptible: no acepto ni un solo eurodólar bajo cuerda.',
        'Acepto sobornos menores para comida y munición, pero no encubro asesinatos.',
        'Trabajo a sueldo de una banda que me paga para mirar hacia otro lado.',
        'La ley soy yo: imparto justicia en la calle con plomo sin esperar al juez.',
        'Cansado y desilusionado; solo cuento los días para mi jubilación.',
        'Fanático de la ley que prefiere quemar un bloque entero antes que dejar escapar a un sospechoso.'
      ]
    }
  ],
  fixer: [
    {
      id: 'fixer_specialty',
      label: '¿En qué mercancía o servicios te especializas?',
      dice: '1d6',
      options: [
        'Armas pesadas, munición exótica y explosivos militares.',
        'Ciberware de grado militar, implantes prohibidos y nanotecnología.',
        'Información clasificada, identidades falsas y datos corporativos robados.',
        'Drogas sintéticas de diseño y productos farmacéuticos de contrabando.',
        'Contratación de mercenarios, asesinos a sueldo y guardaespaldas.',
        'Bienes de lujo auténticos: café de verdad, carne fresca y caviar pre-guerra.'
      ]
    },
    {
      id: 'fixer_turf',
      label: '¿Dónde está tu base de operaciones?',
      dice: '1d6',
      options: [
        'Un bar exclusivo donde solo entran edgerunners con recomendación.',
        'Una mesa reservada al fondo de un tugurio cochambroso en la Zona de Combate.',
        'Una oficina impecable con recepcionista en un rascacielos financiero.',
        'Una furgoneta o limusina blindada en constante movimiento por la ciudad.',
        'Un almacén portuario con muelles privados para lanchas de contrabando.',
        'Un puesto de empeños y cambio de divisas en un mercado al aire libre.'
      ]
    }
  ],
  nomad: [
    {
      id: 'nomad_clan',
      label: '¿Cuál es la especialidad de tu familia o clan nómada?',
      dice: '1d6',
      options: [
        'Transportistas y contrabandistas en convoyes de camiones pesados por los Badlands.',
        'Piratas de carretera que asaltan trenes y cargamentos de las megacorporaciones.',
        'Comunidad agrícola nómada que cultiva hidroponía y viaja en caravanas.',
        'Clan de mecánicos y pilotos de carreras clandestinas en desiertos.',
        'Compañía de seguridad nómada que escolta transportes VIP entre ciudades.',
        'Clan marinero que vive en barcos de carga y plataformas petrolíferas en el océano.'
      ]
    },
    {
      id: 'nomad_vehicle',
      label: '¿Cuál es tu transporte predilecto?',
      dice: '1d6',
      options: [
        'Una motocicleta tuneada con turbo y suspensiones reforzadas para dunas.',
        'Un coche clásico blindado con ametralladora montada en el techo.',
        'Una furgoneta taller con generador eléctrico y camas para la familia.',
        'Un camión tráiler acorazado con blindaje de grado militar.',
        'Un aerodino giroscópico ligero reparado con piezas de desguace.',
        'Un buggy todoterreno con jaula antivuelco y doble tracción extrema.'
      ]
    }
  ]
};
