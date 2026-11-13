// [Claude Code · 2026-11-13] v5.30.0 (plan 31): Gunpath (generador de armas: fabricante, tipo, calidad, attachments, nombre), Interface RED Vol. 5 pp.48-53.

/** roll: como figura en el libro ('1-10', '32', '99-100'). */
export interface GunpathRow { roll: string }

// Tabla "Manufacturer" (1d100, IR5 p.49). note: sesgo sugerido por el libro.
export interface GunpathManufacturer extends GunpathRow { name: string; note?: string }

export const GUNPATH_MANUFACTURERS: GunpathManufacturer[] = [
  { roll: '1-10', name: 'A local Tech' },
  { roll: '11-12', name: 'A nomad weaponsmith' },
  { roll: '13-20', name: 'Arasaka' },
  { roll: '21-23', name: 'BudgetArms', note: 'Probablemente de Calidad Poor' },
  { roll: '24-25', name: 'Centurion Essentials' },
  { roll: '26-27', name: 'Chadran Arms' },
  { roll: '28-29', name: 'Constitutional Arms' },
  { roll: '30-31', name: 'Dai Lung', note: 'Probablemente de Calidad Poor' },
  { roll: '32', name: 'Eagletech', note: 'Probablemente un arco o una ballesta' },
  { roll: '33', name: 'Everest VentureWare', note: 'Probablemente un arco, una ballesta o un rifle' },
  { roll: '34', name: 'Faisal\'s Customs' },
  { roll: '35-37', name: 'Federated Arms' },
  { roll: '38', name: 'Georgia Arms', note: 'Probablemente de Calidad Poor' },
  { roll: '39-54', name: 'GunMart', note: 'Probablemente de Calidad Poor' },
  { roll: '55', name: 'IMI' },
  { roll: '56', name: 'Kendachi' },
  { roll: '57-58', name: 'KTech' },
  { roll: '59-60', name: 'Magnum Opus' },
  { roll: '61', name: 'Malorian Arms', note: 'Probablemente de Calidad Excellent' },
  { roll: '62', name: 'MetaCorp' },
  { roll: '63-65', name: 'Midnight Arms' },
  { roll: '66-76', name: 'Militech' },
  { roll: '77-78', name: 'Mustang Arms' },
  { roll: '79-80', name: 'Nova Arms' },
  { roll: '81-82', name: 'Pursuit Security Inc.' },
  { roll: '83-85', name: 'Rostović' },
  { roll: '86', name: 'Sanroo Firearms of Tokyo', note: '¡Hacela tierna (cute)!' },
  { roll: '87', name: 'Segotari', note: 'Probablemente una vinculación con Elflines Online' },
  { roll: '88-89', name: 'Sternmeyer', note: 'Rara vez de Calidad Poor' },
  { roll: '90-91', name: 'Stolbovoy' },
  { roll: '92-95', name: 'Techtronika Russia' },
  { roll: '96-97', name: 'Towa Manufacturing' },
  { roll: '98', name: 'Tsunami Arms', note: 'Probablemente de Calidad Excellent' },
  { roll: '99-100', name: 'UrbanTech', note: 'Rara vez de Calidad Excellent' },
];

// Tabla "Weapon Type" (1d10, IR5 p.50). La Skill de cada tipo no figura en las tablas de Gunpath:
// se completó con la Skill canon de Cyberpunk RED para cada arma (ver informe).
export interface GunpathTypeRow extends GunpathRow {
  type: string;
  baseCost: number;
  costTier: string;
  skill: 'Handgun' | 'Shoulder Arms' | 'Heavy Weapons' | 'Archery';
  subRoll?: { die: string; rows: (GunpathRow & { type: string; baseCost: number; costTier: string })[] };
}

export const GUNPATH_TYPES: { die: string; rows: GunpathTypeRow[] } = {
  die: '1d10',
  rows: [
    { roll: '1', type: 'Medium Pistol', baseCost: 50, costTier: 'Costly', skill: 'Handgun' },
    { roll: '2', type: 'Heavy Pistol', baseCost: 100, costTier: 'Premium', skill: 'Handgun' },
    { roll: '3', type: 'Very Heavy Pistol', baseCost: 100, costTier: 'Premium', skill: 'Handgun' },
    { roll: '4', type: 'SMG', baseCost: 100, costTier: 'Premium', skill: 'Handgun' },
    { roll: '5', type: 'Heavy SMG', baseCost: 100, costTier: 'Premium', skill: 'Handgun' },
    { roll: '6', type: 'Shotgun', baseCost: 500, costTier: 'Expensive', skill: 'Shoulder Arms' },
    { roll: '7', type: 'Assault Rifle', baseCost: 500, costTier: 'Expensive', skill: 'Shoulder Arms' },
    { roll: '8', type: 'Sniper Rifle', baseCost: 500, costTier: 'Expensive', skill: 'Shoulder Arms' },
    {
      roll: '9',
      type: 'Bow o Crossbow (tirá 1d6: par = Bow, impar = Crossbow)',
      baseCost: 100,
      costTier: 'Premium',
      skill: 'Archery',
      subRoll: {
        die: '1d6',
        rows: [
          { roll: '2, 4, 6', type: 'Bow', baseCost: 100, costTier: 'Premium' },
          { roll: '1, 3, 5', type: 'Crossbow', baseCost: 100, costTier: 'Premium' },
        ],
      },
    },
    {
      roll: '10',
      type: 'Grenade Launcher o Rocket Launcher (tirá 1d6: 1-4 = Grenade Launcher, 5-6 = Rocket Launcher)',
      baseCost: 500,
      costTier: 'Expensive',
      skill: 'Heavy Weapons',
      subRoll: {
        die: '1d6',
        rows: [
          { roll: '1-4', type: 'Grenade Launcher', baseCost: 500, costTier: 'Expensive' },
          { roll: '5-6', type: 'Rocket Launcher', baseCost: 500, costTier: 'Expensive' },
        ],
      },
    },
  ],
};

// Tabla "Weapon Quality" (1d6, IR5 p.50).
export interface GunpathQualityRow extends GunpathRow { quality: 'poor' | 'standard' | 'excellent'; effect: string }

export const GUNPATH_QUALITY: { die: string; rows: GunpathQualityRow[] } = {
  die: '1d6',
  rows: [
    { roll: '1-3', quality: 'poor', effect: 'Reduce una Categoría de Costo (Decrease one Cost Category)' },
    { roll: '4-5', quality: 'standard', effect: 'Sin cambio (No change)' },
    { roll: '6', quality: 'excellent', effect: 'Aumenta una Categoría de Costo (Increase one Cost Category)' },
  ],
};

// Tablas "Attachments" por Skill (IR5 pp.51-52). cost = monto que se suma (Add NNNeb).
export interface GunpathAttachmentRow extends GunpathRow {
  name: string;
  cost: number;
  note?: string;
  subRoll?: { die: string; rows: (GunpathRow & { name: string; cost: number; note?: string })[] };
}

export const GUNPATH_ATTACHMENTS: Record<'Handgun' | 'Shoulder Arms' | 'Heavy Weapons' | 'Archery', { die: string; rows: GunpathAttachmentRow[] }> = {
  // Fired with Handgun Skill (IR5 p.51)
  Handgun: {
    die: '1d6',
    rows: [
      { roll: '1', name: 'Drum Magazine', cost: 500 },
      { roll: '2', name: 'Extended Magazine', cost: 100 },
      { roll: '3', name: 'Infrared Nightvision Scope', cost: 500 },
      { roll: '4', name: 'Silencer', cost: 100 },
      { roll: '5', name: 'Smartgun Link', cost: 500 },
      { roll: '6', name: 'Sniping Scope', cost: 100 },
    ],
  },
  // Fired with Shoulder Arms Skill (IR5 p.51)
  'Shoulder Arms': {
    die: '1d10',
    rows: [
      {
        roll: '1',
        name: 'Bayonet o Airhypo Bayonet (tirá 1d6: 1-5 = Bayonet, 6 = Airhypo Bayonet)',
        cost: 100,
        subRoll: {
          die: '1d6',
          rows: [
            { roll: '1-5', name: 'Bayonet', cost: 100 },
            { roll: '6', name: 'Airhypo Bayonet', cost: 100 },
          ],
        },
      },
      { roll: '2', name: 'Drum Magazine', cost: 500 },
      { roll: '3', name: 'Extended Magazine', cost: 100 },
      { roll: '4', name: 'Grapple Gun Underbarrel', cost: 100 },
      { roll: '5', name: 'Grenade Launcher Underbarrel', cost: 500 },
      { roll: '6', name: 'Infrared Nightvision Scope', cost: 500 },
      { roll: '7', name: 'Shotgun Underbarrel', cost: 500 },
      { roll: '8', name: 'Silencer', cost: 100 },
      { roll: '9', name: 'Smartgun Link', cost: 500 },
      { roll: '10', name: 'Sniping Scope', cost: 100 },
    ],
  },
  // Fired with Heavy Weapons Skill (IR5 p.52)
  'Heavy Weapons': {
    die: '1d6',
    rows: [
      { roll: '1', name: 'Drum Magazine', cost: 500 },
      { roll: '2', name: 'Extended Magazine', cost: 100 },
      { roll: '3', name: 'Infrared Nightvision Scope', cost: 500 },
      { roll: '4', name: 'Silencer', cost: 100, note: 'Si es elegible; si no, tirá de nuevo' },
      { roll: '5', name: 'Smartgun Link', cost: 500 },
      { roll: '6', name: 'Sniping Scope', cost: 100 },
    ],
  },
  // Fired with Archery Skill (IR5 p.52)
  Archery: {
    die: '1d6',
    rows: [
      { roll: '1', name: 'Grapple Gun Underbarrel', cost: 100, note: 'Si es elegible; si no, tirá de nuevo' },
      { roll: '2-3', name: 'Infrared Nightvision Scope', cost: 500 },
      { roll: '4', name: 'Smartgun Link', cost: 500 },
      { roll: '5-6', name: 'Sniping Scope', cost: 100 },
    ],
  },
};

// Tabla "Weapon Name" (1d100, IR5 p.53). pattern: esquema con sus huecos entre corchetes (mapeo único EN -> ES):
// <Letter(s)> [Letra(s)], <Number(s)> [Número(s)], <Descriptor> [Descriptor], <Model/Mark/Version> [Modelo/Mark/Versión],
// <Deadly Animal Name> [Animal Mortal], <Noun> [Sustantivo], <Mythological/Fictional Name> [Nombre Mitológico/Ficticio],
// <Type of Person> [Tipo de Persona], <Descriptive Noun> [Sustantivo Descriptivo], <Location> [Lugar],
// <Technobabble Word> [Palabra Tecnobabble], <Something Geeky> [Algo Geek].
// example: ejemplo del libro, tal cual (en inglés).
export interface GunpathNameRow extends GunpathRow { pattern: string; example?: string }

export const GUNPATH_NAMES: { die: string; rows: GunpathNameRow[] } = {
  die: '1d100',
  rows: [
    { roll: '1-9', pattern: '[Letra(s)]-[Número(s)]', example: 'CP-2020' },
    { roll: '10-15', pattern: '[Descriptor] [Número(s)]', example: 'Cyberpunk 2020' },
    { roll: '16-21', pattern: '[Modelo/Mark/Versión] [Número]', example: 'Mark 2020' },
    { roll: '22-24', pattern: '[Animal Mortal]', example: 'Polar Bear' },
    { roll: '25-27', pattern: '[Descriptor] [Animal Mortal]', example: 'Ballistic Polar Bear' },
    { roll: '28-30', pattern: '[Animal Mortal] [Descriptor]', example: 'Polar Bear Deluxe' },
    { roll: '31-33', pattern: '[Sustantivo] [Animal Mortal]', example: 'Survival Polar Bear' },
    { roll: '34-36', pattern: '[Animal Mortal] [Sustantivo]', example: 'Polar Bear Rocket' },
    { roll: '37-39', pattern: '[Nombre Mitológico/Ficticio]', example: 'Jabberwock' },
    { roll: '40-42', pattern: '[Descriptor] [Nombre Mitológico/Ficticio]', example: 'Vorpal Jabberwock' },
    { roll: '43-45', pattern: '[Nombre Mitológico/Ficticio] [Descriptor]', example: 'Jabberwock Mimsy' },
    { roll: '46-48', pattern: '[Sustantivo] [Nombre Mitológico/Ficticio]', example: 'Wrath Jabberwock' },
    { roll: '49-51', pattern: '[Nombre Mitológico/Ficticio] [Sustantivo]', example: 'Jabberwock Decapitator' },
    { roll: '52-54', pattern: '[Descriptor] [Tipo de Persona]', example: 'Weekend Warrior' },
    { roll: '55-57', pattern: '[Tipo de Persona] [Descriptor]', example: 'Warrior Special' },
    { roll: '58-60', pattern: '[Tipo de Persona] [Tipo de Persona]', example: 'Corporate Warrior' },
    { roll: '61-63', pattern: '[Sustantivo] [Sustantivo]', example: 'Gangland Destroyer' },
    { roll: '64-66', pattern: '[Sustantivo] [Sustantivo] (sin espacio)', example: 'Urbandestroyer' },
    { roll: '67-69', pattern: '[Sustantivo][Sustantivo] (sin espacio, camelCase)', example: 'UrbanDestroyer' },
    { roll: '70-72', pattern: '[Descriptor] [Sustantivo Descriptivo]', example: 'Shredding Shotgun' },
    { roll: '73-75', pattern: '[Sustantivo Descriptivo] [Descriptor]', example: 'Shotgun Shredder' },
    { roll: '76-78', pattern: '[Lugar]', example: 'Miami' },
    { roll: '79-81', pattern: '[Lugar] [Descriptor]', example: 'Miami Topdown' },
    { roll: '82-84', pattern: '[Descriptor] [Lugar]', example: 'Bloody Miami' },
    { roll: '85-87', pattern: '[Lugar] [Sustantivo]', example: 'Miami Rooster' },
    { roll: '88-90', pattern: '[Sustantivo] [Lugar]', example: 'Hotline Miami' },
    { roll: '91-93', pattern: '[Palabra Tecnobabble] [Número]', example: 'Autoslicer 2020' },
    { roll: '94-96', pattern: '[Palabra Tecnobabble] [Descriptor]', example: 'Autoslicer Modern' },
    { roll: '97-99', pattern: '[Palabra Tecnobabble] [Sustantivo]', example: 'Autoslicer Celebration' },
    { roll: '100', pattern: '[Algo Geek]', example: '+1 Very Heavy Pistol of Protection' },
  ],
};

// Reglas del procedimiento Gunpath (IR5 pp.48-53).
export const GUNPATH_RULES: string[] = [
  'Gunpath sirve para diseñar rápido un arma nueva (por ejemplo, para los mooks del GM): se recorren en orden las tablas Manufacturer, Weapon Type, Weapon Quality, Attachments y Weapon Name. (IR5 p.48)',
  'En cada tabla se puede tirar el dado indicado (Manufacturer 1d100, Weapon Type 1d10, Weapon Quality 1d6, Attachments 1d6 o 1d10 según la Skill, Weapon Name 1d100) o elegir el resultado directamente. (IR5 pp.49-53)',
  'Las notas de Manufacturer ("Probablemente Poor", "Probablemente un arco o ballesta", "Make it cute!", etc.) son sesgos sugeridos para el resto de las tiradas, no reglas cerradas. (IR5 p.49)',
  'Weapon Type da el Base Cost y su Categoría de Costo: Medium Pistol 50eb (Costly); Heavy Pistol, Very Heavy Pistol, SMG y Heavy SMG 100eb (Premium); Shotgun, Assault Rifle y Sniper Rifle 500eb (Expensive). (IR5 p.50)',
  'En Weapon Type, el 9 pide una tirada extra de 1d6 (par = Bow, impar = Crossbow; 100eb, Premium) y el 10 otra de 1d6 (1-4 = Grenade Launcher, 5-6 = Rocket Launcher; 500eb, Expensive). (IR5 p.50)',
  'Weapon Quality (1d6): 1-3 Poor Quality = reduce una Categoría de Costo; 4-5 Standard Quality = sin cambio; 6 Excellent Quality = aumenta una Categoría de Costo. (IR5 p.50)',
  'Los attachments se tiran en la tabla de la Skill con la que se dispara el arma (Handgun, Shoulder Arms, Heavy Weapons o Archery). El libro solo dice "Some guns come with extras. Does yours?": no fija cuántas tiradas hacer ni la probabilidad de llevar attachments. (IR5 p.51)',
  'Cada attachment tiene un "Cost Adjustment" fijo (Add 100eb o Add 500eb) que se suma al costo del arma. En Shoulder Arms, el 1 pide una tirada extra de 1d6 (1-5 Bayonet, 6 Airhypo Bayonet; ambos 100eb). (IR5 pp.51-52)',
  'Al ajustar el costo por attachments no se sube de Categoría de Costo salvo que el costo iguale o supere el de la siguiente Categoría: Extended Magazine (100eb) en un Heavy Pistol Standard (100eb) no pasa de Premium a Expensive (100+100 < 500), pero un Drum Magazine (500eb) sí (100+500 > 500). (IR5 p.51)',
  'Silencer (Heavy Weapons, 4) y Grapple Gun Underbarrel (Archery, 1) llevan "si es elegible, si no tirá de nuevo". Elegibilidad según las fichas de IR5 p.48: Silencer solo en armas a distancia no Exotic y no explosivas, excluidos Bows y Crossbows; Grapple Gun Underbarrel solo en Crossbows no Exotic y armas con Shoulder Arms. (IR5 pp.48, 52)',
  'El libro no dice nada sobre resultados repetidos de attachments; la única indicación de volver a tirar es la de elegibilidad del punto anterior. (IR5 pp.51-52)',
  'Weapon Name (1d100): el resultado es un esquema de nombre con huecos ([Descriptor], [Animal Mortal], [Lugar], etc.) que el GM completa; el libro da un ejemplo por esquema, y el 100 es "[Algo Geek]". (IR5 p.53)',
];
