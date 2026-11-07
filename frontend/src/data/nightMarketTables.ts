// [Claude Code · 2026-11-06] v5.14.0 (plan 26): Night Market Generator del Core (Cyberpunk RED Core pp.338-339).
// Paso 1: 1d6 dos veces en la tabla de categorías (si sale repetido, se vuelve a tirar).
// Paso 2: por cada categoría, 1d10 = cuántos tipos de ítems hay; se tira d100 esa cantidad de veces
// en la columna (repetido: se vuelve a tirar). Es una lista de tipos de cosas, no el inventario total.

export type NightMarketCategoryId = 'food' | 'electronics' | 'weapons' | 'cyberware' | 'clothing' | 'survival';

export interface NightMarketCategory {
  id: NightMarketCategoryId;
  roll: number;
  name: string;
  descriptionEs: string;
  /** Regla extra de la categoría (Core p.338). */
  noteEs?: string;
}

export const NIGHT_MARKET_CATEGORIES: NightMarketCategory[] = [
  { id: 'food', roll: 1, name: 'Food and Drugs', descriptionEs: 'Comida procesada, verdura fresca, animales vivos y a veces drogas callejeras.' },
  { id: 'electronics', roll: 2, name: 'Personal Electronics', descriptionEs: 'Aparatos de todo tipo; en los puestos más turbios, hasta Black ICE.' },
  { id: 'weapons', roll: 3, name: 'Weapons and Armor', descriptionEs: 'Todo lo necesario para armar lío en la calle.' },
  {
    id: 'cyberware', roll: 4, name: 'Cyberware', descriptionEs: 'El mejor cybertech de la calle, probablemente ni robado ni cosechado.',
    noteEs: 'Si sale una Opción, también está el ciberware base que necesita (por ejemplo, el Cybereye o el Neural Link). No se instala en el mercado: el vendedor te manda gratis a su Ripperdoc.',
  },
  {
    id: 'clothing', roll: 5, name: 'Clothing and Fashionware', descriptionEs: 'La moda callejera del momento y algo de cromo para acompañar.',
    noteEs: 'El Fashionware se puede instalar en el mismo mercado.',
  },
  { id: 'survival', roll: 6, name: 'Survival Gear', descriptionEs: 'El equipo práctico para sobrevivir al Time of the Red.' },
];

/** Una fila de la tabla d100 (Core pp.338-339): rango y una entrada por categoría. */
export interface NightMarketRow {
  min: number;
  max: number;
  items: Record<NightMarketCategoryId, string>;
}

const row = (min: number, max: number, food: string, electronics: string, weapons: string, cyberware: string, clothing: string, survival: string): NightMarketRow =>
  ({ min, max, items: { food, electronics, weapons, cyberware, clothing, survival } });

/** El libro imprime la primera fila como "0-5"; con d100 (1-100) cubre 1-5. */
export const NIGHT_MARKET_D100: NightMarketRow[] = [
  row(1, 5, 'Canned Goods 10eb (Cheap)', 'Agent 100eb (Premium)', 'Medium Pistol 50eb (Costly)', 'Cybereye 100eb (Premium)', 'Bag Lady Chic', 'Anti-Smog Breathing Mask 20eb (Everyday)'),
  row(6, 10, 'Packaged Goods 10eb (Cheap)', 'Programs or Hardware of 100eb or less', 'Heavy Pistol or Very Heavy Pistol 100eb (Premium)', 'Cyberaudio Suite 500eb (Expensive)', 'Gang Colors', 'Auto Level Dampening Ear Protectors 1,000eb (Very Expensive)'),
  row(11, 15, 'Frozen Goods 10eb (Cheap)', 'Audio Recorder 100eb (Premium)', 'SMG 100eb (Premium)', 'Neural Link 500eb (Expensive)', 'Generic Chic', 'Binoculars 50eb (Costly)'),
  row(16, 20, 'Bags of Grain 20eb (Everyday)', 'Bug Detector 500eb (Expensive)', 'Heavy SMG 100eb (Premium)', 'Cyberarm 500eb (Expensive)', 'Bohemian', 'Carryall 20eb (Everyday)'),
  row(21, 25, 'Kibble Pack 10eb (Cheap)', 'Chemical Analyzer 1,000eb (Very Expensive)', 'Shotgun 500eb (Expensive)', 'Cyberleg 100eb (Premium)', 'Leisurewear', 'Flashlight 20eb (Everyday)'),
  row(26, 30, 'Bags of Prepak 20eb (Everyday)', 'Computer 50eb (Costly)', 'Assault Rifle 500eb (Expensive)', 'External Cyberware of exactly 1,000eb', 'Nomad Leathers', 'Duct Tape 20eb (Everyday)'),
  row(31, 35, 'Street Drugs of 20eb or less', 'Cyberdeck 500eb (Expensive)', 'Sniper Rifle 500eb (Expensive)', 'External Cyberware of 500eb or less', 'Asia Pop', 'Inflatable Bed & Sleep-bag 20eb (Everyday)'),
  row(36, 40, 'Poor Quality Alcohol 10eb (Cheap)', 'Disposable Cell Phone 50eb (Costly)', 'Bows or Crossbow 100eb (Premium)', 'Internal Cyberware of exactly 1,000eb', 'Urban Flash', 'Lock Picking Set 20eb (Everyday)'),
  row(41, 45, 'Alcohol 20eb (Everyday)', 'Electric Guitar or Other Instrument 500eb (Expensive)', 'Grenade Launcher or Rocket Launcher 500eb (Expensive)', 'Internal Cyberware of 500eb or less', 'Businesswear', 'Handcuffs 50eb (Costly)'),
  row(46, 50, 'Excellent Quality Alcohol 100eb (Premium)', 'Programs or Hardware of exactly 500eb', 'Ammunition of 500eb or less', 'Cybereye Option of exactly 1,000eb', 'High Fashion', 'Medtech Bag 100eb (Premium)'),
  row(51, 55, 'MRE 10eb (Cheap)', 'Medscanner 1,000eb (Very Expensive)', "A Single Exotic Weapon of GM's choice", 'Cybereye Option of 500eb or less', 'Biomonitor 100eb (Premium)', 'Tent and Camping Equipment 50eb (Costly)'),
  row(56, 60, 'Live Chicken 50eb (Costly)', 'Homing Tracer 500eb (Expensive)', 'Light Melee Weapon 50eb (Costly)', 'Cyberaudio Option of exactly 1,000eb', 'Chemskin 100eb (Premium)', 'Rope (60m/yds) 20eb (Everyday)'),
  row(61, 65, 'Live Fish 50eb (Costly)', 'Radio Communicator 100eb (Premium)', 'Medium Melee Weapon 50eb (Costly)', 'Cyberaudio Option of 500eb or less', 'EMP Threading 10eb (Cheap)', 'Techtool 100eb (Premium)'),
  row(66, 70, 'Fresh Fruits 50eb (Costly)', 'Techscanner 1,000eb (Very Expensive)', 'Heavy Melee Weapon 100eb (Premium)', 'Neuralware Option of exactly 1,000eb', 'Light Tattoo 100eb (Premium)', 'Personal CarePak 20eb (Everyday)'),
  row(71, 75, 'Fresh Vegetables 50eb (Costly)', 'Smart Glasses 500eb (Expensive)', 'Very Heavy Melee Weapon 100eb (Premium)', 'Neuralware Option of 500eb or less', 'Shift Tacts 100eb (Premium)', 'Radiation Suit 1,000eb (Very Expensive)'),
  row(76, 80, 'Root Vegetables 20eb (Everyday)', 'Radar Detector 500eb (Expensive)', 'Armor of 100eb or less', 'Cyberlimb Option of exactly 1,000eb', 'Skinwatch 100eb (Premium)', 'Road Flare 10eb (Cheap)'),
  row(81, 85, 'Live Pigs 100eb (Premium)', 'Scrambler/Descrambler 500eb (Expensive)', 'Armor of exactly 500eb', 'Cyberlimb Option of 500eb or less', 'Techhair 100eb (Premium)', 'Grapple Gun 100eb (Premium)'),
  row(86, 90, 'Exotic Fruits 100eb (Premium)', 'Radio Scanner/Music Player 50eb (Costly)', 'Armor of exactly 1,000eb', "Fashionware of GM's Choice", 'Generic Chic', 'Tech Bag 500eb (Expensive)'),
  row(91, 95, 'Exotic Vegetables 100eb (Premium)', 'Braindance Viewer 1,000eb (Very Expensive)', 'Weapon Attachments of 100eb or less', "Borgware of GM's Choice", 'Leisurewear', 'Shovel or Axe 50eb (Costly)'),
  row(96, 100, 'Street Drugs of exactly 50eb', 'Virtuality Goggles 100eb (Premium)', 'Weapon Attachments of 500eb or higher', "Any Cyberware of GM's Choice", 'Gang Colors', 'Airhypo 50eb (Costly)'),
];
