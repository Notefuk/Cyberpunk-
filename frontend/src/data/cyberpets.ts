// [Claude Code · 2026-11-13] v5.33.0 (plan 31): Cyberpets® de Biotechnica, Interface RED Vol. 5 pp.72-81.
export type PetTier = 'mook' | 'lieutenant' | 'mini_boss' | 'boss';
export interface CyberpetModel {
  /** Id del PNJ en el bestiario (data/enemies/interface-red.ts). */
  enemyId: string;
  name: string;
  cost: number;          // eb
  costTier: string;      // categoría impresa, ej. 'Very Expensive'
  lifestyle: string;     // Required Lifestyle impreso, ej. 'Generic Prepak'
  cyberwareSlots: number;
  tier: PetTier;
  description: string;   // en español, 1-3 frases fieles al texto
  page: number;          // página impresa de su ficha
}
export const CYBERPETS: CyberpetModel[] = [
  {
    enemyId: 'ir5-pet-datarabbit',
    name: 'Datarabbit™',
    cost: 1000,
    costTier: 'Very Expensive',
    lifestyle: 'Generic Prepak',
    cyberwareSlots: 2,
    tier: 'mook',
    description: 'Conejo biodiseñado como portador de datos: su ojo es un compartimento protegido contra EMP para chips de memoria. Es rápido y ágil, y se puede soltar para poner los datos a salvo y localizarlo después con su rastreador implantado.',
    page: 74,
  },
  {
    enemyId: 'ir5-pet-forever-turtle',
    name: 'Forever Turtle™',
    cost: 2000,
    costTier: 'Very Expensive',
    lifestyle: 'Good Prepak',
    cyberwareSlots: 2,
    tier: 'mook',
    description: 'Una de las Cyberpets® originales, con Trauma Response Nanomatrix para asegurar su longevidad. Veinte años de investigación y ADN de más de seis especies la convirtieron en una inquietante amalgama de tortuga.',
    page: 75,
  },
  {
    enemyId: 'ir5-pet-neon-newt',
    name: 'Neon Newt™',
    cost: 2000,
    costTier: 'Very Expensive',
    lifestyle: 'Good Prepak',
    cyberwareSlots: 1,
    tier: 'mook',
    description: 'Tritón de bolsillo genéticamente modificado que actúa como lanzallamas biológico: al apretarlo o agitarlo, escupe fuego. Su piel secreta ácido y viene en colores neón de laboratorio.',
    page: 76,
  },
  {
    enemyId: 'ir5-pet-obsidian-ocelot',
    name: 'Obsidian Ocelot™',
    cost: 4000,
    costTier: 'Luxury',
    lifestyle: 'Fresh Food',
    cyberwareSlots: 3,
    tier: 'lieutenant',
    description: 'Cibercazadores criados para clientes exigentes: hermosos adornos y asesinos sigilosos. La mayoría vive consentida lejos de la vista pública; unos pocos acompañan a asesinos que no podrías contratar.',
    page: 77,
  },
  {
    enemyId: 'ir5-pet-cyberbear',
    name: 'Cyberbear™',
    cost: 20000,
    costTier: 'Super Luxury',
    lifestyle: 'Fresh Food x2',
    cyberwareSlots: 3,
    tier: 'mini_boss',
    description: 'Hace muy bien una sola cosa: despedazar carne. Algunos escaparon y se han establecido en el Yukon de Alaska; se rumorea que su bioingeniería les llenó el cerebro de tumores y los volvió ferales. Su tercer brazo no es cibernético.',
    page: 78,
  },
  {
    enemyId: 'ir5-pet-cyberboa',
    name: 'Cyberboa™',
    cost: 4000,
    costTier: 'Luxury',
    lifestyle: 'Fresh Food',
    cyberwareSlots: 3,
    tier: 'lieutenant',
    description: 'Diseñada y vendida como operativa de búsqueda y rescate, en realidad es una serpiente con el ADN de las más peligrosas del mundo. Encarna el concepto de "mejor supervivencia mediante bioquímica" de Nicolo Loggagia.',
    page: 79,
  },
  {
    enemyId: 'ir5-pet-cyberrat',
    name: 'Cyberrat™',
    cost: 1000,
    costTier: 'Very Expensive',
    lifestyle: 'Generic Prepak',
    cyberwareSlots: 2,
    tier: 'mook',
    description: 'Rata venenosa bioaumentada para el espionaje corporativo, con cyberware de vigilancia y skinweave. Sirve como operativa prescindible o como mejor amiga que vigila tu apartamento.',
    page: 80,
  },
  {
    enemyId: 'ir5-pet-cyberwolf',
    name: 'Cyberwolf™',
    cost: 4000,
    costTier: 'Luxury',
    lifestyle: 'Good Prepak',
    cyberwareSlots: 3,
    tier: 'lieutenant',
    description: 'Cazadores de manada con cyberware, creados para ser la nueva cima de la cadena alimenticia, con mandíbulas hidráulicas para romper huesos de cerca. Suelen hallarse en manada, aunque algunos se venden como perros de seguridad; cada uno trae una Light Armorjack a medida.',
    page: 81,
  },
];
