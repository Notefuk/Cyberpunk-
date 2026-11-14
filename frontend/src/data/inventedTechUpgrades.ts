// [Claude Code · 2026-11-14] v5.42.0 (plan 33): Invented Tech Upgrades Guide (DLC, 2026, pp.3-9).
// Mejoras inventadas (Core p.148, último punto de Upgrade Expertise) que venden o instalan los Techs de Night City.
// Por decisión de Giuliano el efecto queda en texto: no cambia tiradas ni stats.

export const INVENTED_TUPS_SOURCE = 'Invented Tech Upgrades Guide';

export type ThermometerLevel = 'mild' | 'medium' | 'hot' | 'extra_hot' | 'diablo';

export interface ThermometerEntry {
  id: ThermometerLevel;
  label: string;
  cost: number;
  /** true en Diablo: 5,000eb o más. */
  orMore?: boolean;
  priceCategory: string;
  examples: string[];
}

/** Termómetro de Invented TUps (p.4): guía para que el GM ponga el costo 2. */
export const TUP_THERMOMETER: ThermometerEntry[] = [
  { id: 'diablo', label: 'Diablo', cost: 5000, orMore: true, priceCategory: 'Super Luxury', examples: [
    'Efecto parecido al de otro ítem Super Luxury.',
    'Cualquier cosa que suba un STAT (salvo MOVE).',
    'Más ROF con una desventaja manejable.'
  ] },
  { id: 'extra_hot', label: 'Extra Hot', cost: 5000, priceCategory: 'Luxury', examples: [
    'Más ROF con desventajas importantes.',
    'Mejora que simula en parte o da una Role Ability.',
    'Mejora que reproduce un efecto que solo existe en Borgware.'
  ] },
  { id: 'hot', label: 'Hot', cost: 1000, priceCategory: 'Very Expensive', examples: [
    'Sube Skills de forma que se suma a otras subas de Skill.',
    '+1 MOVE, que no se suma a otras subas de MOVE.',
    'Hace menos peligrosa una mecánica peligrosa (como la adicción).',
    'Mejora defensiva útil en cualquier situación.',
    'Mejora ofensiva directa con una desventaja que lleva el arma al nivel de una de 5,000eb.',
    'Junta en una sola mejora el beneficio de dos Medium/Mild, con una desventaja extra.',
    'Mejora en dos los slots de un ítem, con una desventaja extra.'
  ] },
  { id: 'medium', label: 'Medium', cost: 500, priceCategory: 'Expensive', examples: [
    'Mejora defensiva para una situación.',
    'Sube Skills de forma que no se suma a otras subas de Skill.',
    'Mejoras económicas: menos tiempo de reparación, menos balas para usar Autofire.',
    'Mejora ofensiva directa que lleva el arma al nivel de una de 1,000eb.',
    'Mejora de arma para una situación que la hace más versátil: más fácil de ocultar, otra Range Table o el efecto de un Underbarrel.',
    'Más capacidad para un arma cuya desventaja principal no es la capacidad muy baja.',
    'Reduce sin eliminar una desventaja del arma: menos BODY requerido, un atasco muy castigador pasa a normal, munición extremadamente ineficiente pasa a más eficiente.',
    'Darle dos slots de accesorio a un arma Exótica que no tiene.',
    'Juntar dos ítems menos potentes en uno.'
  ] },
  { id: 'mild', label: 'Mild', cost: 100, priceCategory: 'Premium', examples: [
    'Mejora de color o con un beneficio menor para una situación.',
    'Mejora para la moda o relacionada con la moda.',
    'Mejora de Skill útil en una situación que difícilmente se repita.'
  ] }
];

export interface InventingTech {
  id: string;
  name: string;
  blurb: string;
  page: number;
}

export const INVENTING_TECHS: InventingTech[] = [
  { id: 'android-ace', name: 'Android Ace', page: 5, blurb: 'Dueño de Cyborg Station en Kabuki; lleva cualquier ciberware mucho más allá de lo de fábrica. Tiene contactos con los Tyger Claws.' },
  { id: 'jack-sawyer', name: 'Jack Sawyer', page: 6, blurb: 'Armera en ascenso que trabaja con Faisal; muy buena al pool en Greta\'s.' },
  { id: 'lotos', name: 'Lotos', page: 6, blurb: 'Netrunner misteriosa con décadas en el oficio; mezcla elegancia, moda y tecnología de hackeo.' },
  { id: 'never-naughty-nedd', name: 'Never Naughty Nedd', page: 7, blurb: 'Lleva la tecnología de armas al límite y ama el cine; tiene el GunMart Museum of Movie Weapons en Playland by the Sea.' },
  { id: 'troy-gordon', name: 'Troy Gordon', page: 8, blurb: 'Su garage en la Reclamation Zone convierte vehículos en tanques.' },
  { id: 'tweak', name: 'Tweak', page: 8, blurb: 'Tech sarcástica de Byte & Switch en North Heywood: arreglos y mejoras sin preguntas.' }
];

/** Cómo se calcula el costo 1 (materiales "de siempre" de cualquier Upgrade). */
export type Cost1Rule = 'item' | 'most_expensive_component';

export interface InventedUpgrade {
  id: string;
  name: string;
  techId: string;
  dv: number;
  cost1: Cost1Rule;
  /** Costo 2: materiales de la invención (lo que puso el GM). */
  cost2: number;
  thermometer: ThermometerLevel;
  /** Dónde se instala. */
  requirement: string;
  effect: string;
  /** Nota del GM del libro sobre el precio, si la hay. */
  priceNote?: string;
  page: number;
}

export const INVENTED_UPGRADES: InventedUpgrade[] = [
  { id: 'double-chip', name: 'Double Chip', techId: 'android-ace', dv: 24, cost1: 'most_expensive_component', cost2: 1000, thermometer: 'medium', page: 5,
    requirement: 'Dos Skill Chips, que se compran aparte.',
    effect: 'Junta dos Skill Chips en uno con Humanity Loss 7 (2d6). En un Chipware Socket da el beneficio de los dos; si los dos son de la misma Skill, la da a +4 en vez de +3.',
    priceNote: 'Termómetro: sube Skills de forma que no se suma a otras subas (el libro la pone a 1,000eb).' },
  { id: 'foundational-tuning', name: 'Foundational Tuning', techId: 'android-ace', dv: 24, cost1: 'item', cost2: 1000, thermometer: 'hot', page: 5,
    requirement: 'Ciberware que no sea Borgware y que tenga Option Slots o acepte Cyberfingers.',
    effect: 'La Humanity Depression (lo que baja la Humanidad máxima para recuperarla) de cada opción instalada en ese ciberware baja en 1.' },
  { id: 'rocket-runner', name: 'Rocket Runner', techId: 'android-ace', dv: 24, cost1: 'item', cost2: 500, thermometer: 'hot', page: 5,
    requirement: 'Un Skate Foot. Hacen falta dos (uno en cada Cyberleg). No sirve en Cyberchairs.',
    effect: '+1 MOVE en Move Actions cuando hay dos, uno en cada Skate Foot de dos Cyberlegs. Cada uno se compra e instala aparte.',
    priceNote: 'El GM partió a la mitad el costo 2 (Hot, +1 MOVE) porque hacen falta dos.' },
  { id: 'combined-underbarrel', name: 'Combined Underbarrel', techId: 'jack-sawyer', dv: 21, cost1: 'most_expensive_component', cost2: 500, thermometer: 'medium', page: 6,
    requirement: 'Dos Underbarrel Attachments, que se compran aparte, y un arma que acepte los dos.',
    effect: 'Junta dos Underbarrel en un solo accesorio que ocupa los slots del más caro. Al usarlo elegís cuál función; la munición de cada una se compra y carga aparte.' },
  { id: 'counterweight-system', name: 'Counterweight System', techId: 'jack-sawyer', dv: 21, cost1: 'item', cost2: 500, thermometer: 'medium', page: 6,
    requirement: 'Un arma.',
    effect: 'Baja en 3 cualquier requisito de BODY para empuñar o usar el arma o sus funciones.' },
  { id: 'optimized-popup', name: 'Optimized Popup', techId: 'jack-sawyer', dv: 24, cost1: 'item', cost2: 1000, thermometer: 'hot', page: 6,
    requirement: 'Un Cyberarm. No sirve en equipo equivalente como el Battleglove.',
    effect: 'El Cyberarm acepta un arma popup a distancia sin gastar Option Slots. El arma se compra aparte y no admite accesorios que usen slots, salvo un Smartgun Link. La Humanity Loss no cambia.',
    priceNote: 'El GM consideró que lo opuesto de mejorar slots (que ocupe menos) cuesta lo mismo.' },
  { id: 'function-driver', name: 'Function Driver', techId: 'lotos', dv: 17, cost1: 'item', cost2: 500, thermometer: 'medium', page: 6,
    requirement: 'Un cyberdeck. El programa se consigue aparte.',
    effect: 'El cyberdeck instala un programa de 1 slot (que no sea Black ICE) sin gastar slot. Mientras está, se puede derezzear pero no destruir por efecto de un programa.',
    priceNote: 'Concepto único: precio del GM comparando con otros cyberdecks.' },
  { id: 'netsuit-insulation', name: 'Netsuit Insulation', techId: 'lotos', dv: 21, cost1: 'item', cost2: 500, thermometer: 'medium', page: 7,
    requirement: 'Un Bodyweight Suit o armadura parecida.',
    effect: 'Da los beneficios del Insulated Wiring (Core p.208) sin ocupar el Option Slot de solo hardware del traje.' },
  { id: 'super-slide', name: 'Super Slide', techId: 'lotos', dv: 24, cost1: 'item', cost2: 1000, thermometer: 'hot', page: 7,
    requirement: 'Un programa Speedy Gonzalvez o Worm.',
    effect: 'Con el programa activo, el usuario puede hacer Slide dos veces por Turno.' },
  { id: 'experimental-load', name: 'Experimental Load', techId: 'never-naughty-nedd', dv: 21, cost1: 'most_expensive_component', cost2: 500, thermometer: 'medium', page: 7,
    requirement: 'Dos tipos de munición no smart ni explosiva, y un arma que dispare las dos. No sirve con granadas ni cohetes.',
    effect: 'Junta dos municiones en una: −4 a las tiradas de ataque, y el blanco sufre los efectos de las dos. El costo es por cada 10 balas.',
    priceNote: 'Concepto único: precio del GM.' },
  { id: 'stun-bunny', name: 'Stun Bunny', techId: 'never-naughty-nedd', dv: 21, cost1: 'item', cost2: 1000, thermometer: 'hot', page: 7,
    requirement: 'Un arma de fuego.',
    effect: 'Además de su función normal, el arma sirve como Microwaver (Core p.348) o Stun Gun (Core p.349). Ataca con la Skill del arma pero con la Range Table de Pistols. Los dos modos usan la misma batería de 8 disparos, que se recarga en 1 hora; baterías extra a 50eb (Costly).' },
  { id: 'vorpal-coating', name: 'Vorpal Coating', techId: 'never-naughty-nedd', dv: 24, cost1: 'item', cost2: 1000, thermometer: 'hot', page: 8,
    requirement: 'Un arma Melee con filo.',
    effect: 'Cuando el arma causa una Critical Injury al azar, el usuario tira dos veces en la tabla y elige.' },
  { id: 'flashbulb-beacon', name: 'Flashbulb Beacon', techId: 'troy-gordon', dv: 21, cost1: 'item', cost2: 500, thermometer: 'medium', page: 8,
    requirement: 'Un vehículo con la mejora Heavy Chassis.',
    effect: 'Como Acción, el conductor o el acompañante obliga a un blanco a 50 m/yds o menos con ojos de carne o ciberópticos a hacer Resist Torture/Drugs DV15 (el que lo usa no tira). Si falla, sufre la Critical Injury Damaged Eye durante 1 minuto. Lo evita una protección como Anti-Dazzle.',
    priceNote: 'El GM lo consideró equivalente a ponerle un Underbarrel a un arma.' },
  { id: 'metalgear-coating', name: 'MetalGear® Coating', techId: 'troy-gordon', dv: 24, cost1: 'item', cost2: 1000, thermometer: 'hot', page: 8,
    requirement: 'Un vehículo con la mejora Armored Chassis.',
    effect: 'El SP del Armored Chassis sube +3 y la Speed (Combat) del vehículo baja 5 MOVE.',
    priceNote: 'Por lo mucho que mejora, el GM le puso una desventaja para que el costo 2 no suba.' },
  { id: 'self-driving-vehicle', name: 'Self-Driving Vehicle', techId: 'troy-gordon', dv: 24, cost1: 'item', cost2: 1000, thermometer: 'hot', page: 8,
    requirement: 'Un vehículo con la mejora Communications Center.',
    effect: 'La SAAI del Agent de a bordo puede manejar sola el vehículo, con una Skill Base efectiva de 10.',
    priceNote: 'Concepto único: el GM lo consideró como agregar un Imp Demon a una NET Architecture.' },
  { id: 'calibrated-medscanner', name: 'Calibrated Medscanner', techId: 'tweak', dv: 21, cost1: 'item', cost2: 500, thermometer: 'medium', page: 9,
    requirement: 'Un Medscanner.',
    effect: 'Al guiar con él una inyección de Speedheal, el BODY del paciente cuenta +3 para recuperar HP.' },
  { id: 'shredding-ax', name: 'Shredding Ax', techId: 'tweak', dv: 17, cost1: 'item', cost2: 100, thermometer: 'mild', page: 9,
    requirement: 'Una guitarra eléctrica, keytar o instrumento parecido.',
    effect: 'El instrumento queda reforzado y con filo: sigue siendo instrumento y además es una Heavy Melee Weapon (Very Heavy Melee si es una KillStrom Power Chord, del DLC Hope Reborn+).' },
  { id: 'superscanner', name: 'Superscanner', techId: 'tweak', dv: 21, cost1: 'item', cost2: 500, thermometer: 'medium', page: 9,
    requirement: 'Un Techscanner.',
    effect: 'Guía un Microwaver o arma parecida en un ataque contra un solo blanco, con −4. Si pega, el atacante elige qué ciberware se apaga (no el GM). Solo ciberware que no sea fundacional.' }
];

export type InstallMode = 'npc_install' | 'kit';

export interface UpgradePrice {
  cost1: number;
  cost2: number;
  /** 50% de costo 1 + costo 2 si instala el Tech PNJ (p.3). */
  labor: number;
  /** Lo que se paga al Tech PNJ ahora. */
  payNow: number;
  /** Lo que paga después el Tech del grupo al instalar el kit (los materiales del costo 1). */
  payOnInstall: number;
  total: number;
}

/**
 * Precio de una Invented Upgrade (p.3).
 * - Contratar al Tech PNJ: costo 1 + costo 2 + 50% de los dos como mano de obra. Instala sin tirada (sugerencia del libro).
 * - Comprar el kit: se paga el costo 2 al Tech PNJ; el Tech del grupo paga el costo 1 al instalarla (con su tirada).
 */
export function priceInventedUpgrade(itemCost: number, cost2: number, mode: InstallMode): UpgradePrice {
  const cost1 = Math.max(0, Math.round(itemCost));
  if (mode === 'kit') return { cost1, cost2, labor: 0, payNow: cost2, payOnInstall: cost1, total: cost1 + cost2 };
  const labor = Math.round((cost1 + cost2) * 0.5);
  return { cost1, cost2, labor, payNow: cost1 + cost2 + labor, payOnInstall: 0, total: cost1 + cost2 + labor };
}

export function inventedUpgradeById(id: string): InventedUpgrade | undefined {
  return INVENTED_UPGRADES.find((u) => u.id === id);
}

export function thermometerById(id: ThermometerLevel): ThermometerEntry {
  return TUP_THERMOMETER.find((t) => t.id === id)!;
}

/** Mejora anotada en la ficha. El efecto queda en texto (decisión de Giuliano). */
export interface InventedUpgradeRecord {
  id: string;
  /** Id del catálogo, o 'custom' si la inventó la mesa con el termómetro. */
  upgradeId: string;
  name: string;
  /** Ítem mejorado: instanceId del arma si se eligió de la ficha. */
  weaponInstanceId?: string;
  itemName: string;
  effect: string;
  paid: number;
  at: string;
}
