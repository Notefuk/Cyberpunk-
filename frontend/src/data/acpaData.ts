/**
 * [Claude Code · 2026-11-12] v5.26.0 (plan 30): ACPA (Assisted Combat Power Armor).
 * Fuente: "Solo of Fortune 2045", Interface RED Vol. 5, pp.133-142. Páginas impresas.
 * Armado: frame, shell y cuatro tunings A/B (p.136); costo y disponibilidad (p.135).
 *
 * Erratas: las fichas de las ACPA de fábrica (pp.138-142) no dicen qué tunings llevan.
 * Los tunings de abajo son la combinación que reproduce lo impreso. En 5 fichas ninguna
 * combinación da lo impreso; por decisión de Giuliano (2026-11-12) la app usa el valor
 * recalculado con las reglas de la p.136 y guarda lo impreso en `printedLine` con una nota.
 */

export type AcpaFrameId = 'salvaged' | 'sigma' | 'beta' | 'omega';
export type AcpaShellId = 'salvaged' | 'light' | 'hybrid' | 'metalgear' | 'heavy';
export type AcpaTuningId = 'acceleration' | 'hydraulics' | 'maneuverability' | 'weight';
export type AcpaTuningChoice = 'A' | 'B';
export type AcpaTunings = Record<AcpaTuningId, AcpaTuningChoice>;

/** Modificadores que suma una pieza o un tuning. Todos opcionales; 0 si no está. */
export interface AcpaMods {
  hp?: number;
  sp?: number;
  ref?: number;
  dex?: number;
  move?: number;
}

export interface AcpaFrame {
  id: AcpaFrameId;
  name: string;
  cost: number;
  costTier: string;
  body: number;
  hp: number;
  move: number;
}

export interface AcpaShell {
  id: AcpaShellId;
  name: string;
  cost: number;
  costTier: string;
  sp: number;
  hp: number;
  move: number;
}

export interface AcpaTuning {
  id: AcpaTuningId;
  name: string;
  description: string;
  A: AcpaMods;
  B: AcpaMods;
}

/** IR5 p.136, paso 1. */
export const ACPA_FRAMES: AcpaFrame[] = [
  { id: 'salvaged', name: 'Salvaged Frame', cost: 1000, costTier: 'Very Expensive', body: 10, hp: 14, move: 0 },
  { id: 'sigma', name: 'Sigma', cost: 2000, costTier: 'Luxury', body: 12, hp: 22, move: 1 },
  { id: 'beta', name: 'Beta', cost: 10000, costTier: 'Super Luxury', body: 14, hp: 27, move: 2 },
  { id: 'omega', name: 'Omega', cost: 20000, costTier: 'Super Luxury', body: 16, hp: 32, move: 3 },
];

/** IR5 p.136, paso 2. */
export const ACPA_SHELLS: AcpaShell[] = [
  { id: 'salvaged', name: 'Salvaged Shell', cost: 1000, costTier: 'Very Expensive', sp: 14, hp: 2, move: -1 },
  { id: 'light', name: 'Light Metalgear®', cost: 2000, costTier: 'Luxury', sp: 16, hp: 3, move: 0 },
  { id: 'hybrid', name: 'Hybrid Metalgear®', cost: 5124, costTier: 'Luxury', sp: 17, hp: 10, move: -1 },
  { id: 'metalgear', name: 'Metalgear®', cost: 10000, costTier: 'Super Luxury', sp: 18, hp: 17, move: -3 },
  { id: 'heavy', name: 'Heavy Metalgear®', cost: 10000, costTier: 'Super Luxury', sp: 19, hp: 21, move: -4 },
];

/** IR5 p.136, paso 3: hay que elegir A o B en cada uno. */
export const ACPA_TUNINGS: AcpaTuning[] = [
  { id: 'acceleration', name: 'Acceleration', description: 'Aliviar peso para llegar antes a la máxima maniobrabilidad.', A: { hp: -7 }, B: { dex: -1 } },
  { id: 'hydraulics', name: 'Hydraulics', description: 'Blindar la hidráulica a costa de rango de movimiento.', A: { sp: -1 }, B: { move: -1 } },
  { id: 'maneuverability', name: 'Maneuverability', description: 'Piernas más finas para girar rápido a alta velocidad.', A: { hp: -7 }, B: { ref: -1 } },
  { id: 'weight', name: 'Weight', description: 'Segmentos interiores que algunos pilotos consideran innecesarios.', A: { hp: 7 }, B: { move: 1 } },
];

/** IR5 p.135: hasta 6 armas Onboard y 6 piezas de ciberware Onboard. */
export const ACPA_MAX_ONBOARD_WEAPONS = 6;
export const ACPA_MAX_ONBOARD_CYBERWARE = 6;
/** IR5 p.135: base de 4.000eb y 500eb extra por cada arma o ciberware Onboard. */
export const ACPA_BASE_COST = 4000;
export const ACPA_ONBOARD_SURCHARGE = 500;

export interface AcpaPrebuilt {
  id: string;
  name: string;
  manufacturer: string;
  /** Costo impreso en el libro (no se recalcula: el libro no da el precio de todo lo Onboard). */
  printedCost: number;
  printedCostTier: string;
  frame: AcpaFrameId;
  shell: AcpaShellId;
  tunings: AcpaTunings;
  /** Tal como figura en el libro, con cantidades y accesorios. */
  onboardWeapons: string[];
  onboardCyberware: string[];
  /** Línea de stats impresa en el libro. */
  printedLine: string;
  /** Si lo impreso no cierra con las reglas de armado, qué cambia la app y por qué. */
  erratum?: string;
  description: string;
  sourcePage: number;
}

const t = (acceleration: AcpaTuningChoice, hydraulics: AcpaTuningChoice, maneuverability: AcpaTuningChoice, weight: AcpaTuningChoice): AcpaTunings => ({
  acceleration,
  hydraulics,
  maneuverability,
  weight,
});

/** IR5 pp.138-142. */
export const ACPA_PREBUILTS: AcpaPrebuilt[] = [
  {
    id: 'arasaka-neo-guardian',
    name: 'Arasaka Neo Guardian',
    manufacturer: 'Arasaka',
    printedCost: 17900,
    printedCostTier: 'Luxury',
    frame: 'sigma',
    shell: 'light',
    tunings: t('B', 'B', 'A', 'A'),
    onboardWeapons: ['Arasaka Takanami SMG (x2)', 'Malorian Arms Sub-Flechette Gun', 'Stun Baton'],
    onboardCyberware: ['Internal Agent', 'Targeting Scope'],
    printedLine: '25 HP • 16 SP • BODY 12 • -1 DEX',
    description: 'Guardaespaldas grande y amenazante para clientes VIP. Arasaka suele contratar FBC para turnarse en la misma ACPA todo el día.',
    sourcePage: 138,
  },
  {
    id: 'arasaka-neo-standard',
    name: 'Arasaka Neo Standard',
    manufacturer: 'Arasaka',
    printedCost: 25100,
    printedCostTier: 'Super Luxury',
    frame: 'beta',
    shell: 'light',
    tunings: t('B', 'B', 'B', 'A'),
    onboardWeapons: ['Malorian Arms Sub-Flechette Gun', 'Tsunami Arms Type-18-S'],
    onboardCyberware: ['Internal Agent', 'Targeting Scope'],
    printedLine: '37 HP • 16 SP • BODY 12 • -1 REF • -1 DEX',
    erratum:
      'El libro no imprime MOVE ni cambio de BODY. Con frame Beta y 16 SP las reglas dan +1 MOVE y BODY 14 (pp.136, 134); la app usa eso.',
    description: 'La ACPA de línea de Arasaka, rediseñada después de la 4ª Guerra Corporativa. Pensada contra blancos civiles y fuego sostenido de armas chicas.',
    sourcePage: 138,
  },
  {
    id: 'arasaka-shin-daioni',
    name: 'Arasaka Shin DaiOni',
    manufacturer: 'Arasaka',
    printedCost: 61350,
    printedCostTier: 'Super Luxury',
    frame: 'omega',
    shell: 'heavy',
    tunings: t('A', 'B', 'A', 'B'),
    onboardWeapons: [
      'Arasaka Neo Rapid Assault 16 (TUp +1 Attachment Slot) w/ Smartgun Link',
      'Kendachi Mono-Three (x2)',
      'Midnight Arms Dawnmaker AMR w/ Sniper Scout Barrel',
      'Tsunami Arms Type-18-S',
      'Tsunami Arms Helix (Citrus Edition) w/ Smartgun Link',
    ],
    onboardCyberware: ['Jump Booster', 'Targeting Scope', 'Teleoptics'],
    printedLine: '39 HP • 19 SP • BODY 16 • -1 MOVE',
    description: 'El cuco de Arasaka. Depende de un piloto muy hábil, típicamente un FBC muy modificado.',
    sourcePage: 139,
  },
  {
    id: 'blueraven-sewer-rat',
    name: 'BlueRaven "Sewer Rat"',
    manufacturer: 'BlueRaven',
    printedCost: 14104,
    printedCostTier: 'Very Expensive',
    frame: 'salvaged',
    shell: 'salvaged',
    tunings: t('B', 'B', 'B', 'A'),
    onboardWeapons: ['Scatter Ratter (x2)'],
    onboardCyberware: ['Popup Shield (x2)'],
    printedLine: '23 HP • 4 SP • BODY 10 • -2 MOVE • -1 REF • -1 DEX',
    erratum: 'El libro dice 4 SP, pero el Salvaged Shell da SP 14 (p.136) y estos tunings no lo bajan; la app usa 14.',
    description: 'ACPA casera de BlueRaven, armadora de Night City: "para lugares y presupuestos ajustados", con piezas conseguibles fuera de las corpos.',
    sourcePage: 139,
  },
  {
    id: 'metacorp-nyx',
    name: 'MetaCorp Nyx',
    manufacturer: 'MetaCorp',
    printedCost: 35400,
    printedCostTier: 'Super Luxury',
    frame: 'omega',
    shell: 'light',
    tunings: t('B', 'B', 'A', 'B'),
    onboardWeapons: ['EQ Sniper Rifle w/ Drum Magazine & Sniper Rifle Rechamber', 'MetaCorp Chaingun "Victoria"'],
    onboardCyberware: ['Low Light/Infrared/UV', 'Radio Communicator', 'Web Foot'],
    printedLine: '28 HP • 16 SP • BODY 16 • +3 MOVE • -1 DEX',
    description: 'Versión moderna del Nemesis Assault, ahuecada para darle más Linear Frame: muy rápida. Defiende New Galveston y el MetaKey de los piratas.',
    sourcePage: 140,
  },
  {
    id: 'militech-commando',
    name: 'Militech Commando',
    manufacturer: 'Militech',
    printedCost: 25274,
    printedCostTier: 'Super Luxury',
    frame: 'beta',
    shell: 'hybrid',
    tunings: t('A', 'B', 'A', 'A'),
    onboardWeapons: ['Militech MK.27 LMG', 'Militech Mountain Goat Rifle'],
    onboardCyberware: ['Low Light/Infrared/UV', 'Radio Communicator', 'Scrambler/Descrambler'],
    printedLine: '30 HP • 17 SP • BODY 14',
    description: 'El caballo de batalla de Militech. Va en equipos chicos con apoyo de artillería y suele llevar lanzacohetes descartables.',
    sourcePage: 140,
  },
  {
    id: 'sovoil-bombardier',
    name: 'SovOil Bombardier',
    manufacturer: 'SovOil',
    printedCost: 32200,
    printedCostTier: 'Super Luxury',
    frame: 'beta',
    shell: 'metalgear',
    tunings: t('B', 'B', 'B', 'A'),
    onboardWeapons: ['EQ Rocket Launcher w/ Drum Magazine & Long Tube (x4)'],
    onboardCyberware: [],
    printedLine: '51 HP • 18 SP • BODY 14 • -1 REF • -1 DEX',
    erratum: 'El libro no imprime MOVE. Con 18 SP las reglas dan -2 MOVE (p.136); la app usa eso.',
    description: 'ACPA pesada de apoyo de artillería, diseño de Russian Arms comprado por SovOil. Hermana del Zhirafa Boris, un 30% más barata.',
    sourcePage: 141,
  },
  {
    id: 'tsunami-arms-magus',
    name: 'Tsunami Arms Magus',
    manufacturer: 'Tsunami Arms',
    printedCost: 26624,
    printedCostTier: 'Super Luxury',
    frame: 'sigma',
    shell: 'hybrid',
    tunings: t('A', 'B', 'A', 'A'),
    onboardWeapons: ['Tsunami Arms "Deathwind" Railgun'],
    onboardCyberware: ['Grip Foot', 'Targeting Scope', 'Teleoptics'],
    printedLine: '25 HP • 17 SP • BODY 12 • -1 MOVE',
    description: 'Nació como unidad de comando e inteligencia y terminó como francotiradora gracias al Railgun "Deathwind".',
    sourcePage: 141,
  },
  {
    id: 'zetatech-grasshopper',
    name: 'Zetatech Grasshopper',
    manufacturer: 'Zetatech',
    printedCost: 12050,
    printedCostTier: 'Luxury',
    frame: 'sigma',
    shell: 'light',
    tunings: t('A', 'A', 'A', 'A'),
    onboardWeapons: ['Militech "Big Boomer"'],
    onboardCyberware: ['Interface Plugs', 'Skate Foot'],
    printedLine: '18 HP • 15 SP • BODY 12',
    erratum: 'El libro no imprime MOVE. Con 15 SP las reglas dan +1 MOVE (p.136); la app usa eso.',
    description: 'La ACPA más liviana del mercado y la primera que se fabricó. La única que entra en el asiento de un vehículo sin modificar.',
    sourcePage: 142,
  },
  {
    id: 'zhirafa-boris',
    name: 'Zhirafa Boris',
    manufacturer: 'Zhirafa',
    printedCost: 46900,
    printedCostTier: 'Super Luxury',
    frame: 'omega',
    shell: 'heavy',
    tunings: t('B', 'B', 'B', 'A'),
    onboardWeapons: ['EQ Rocket Launcher w/ Extended Magazine & Smartgun Link (x4)', 'Techtronika Russia BMG-500 (Silver Edition)'],
    onboardCyberware: ['Targeting Scope'],
    printedLine: '60 HP • 19 SP • BODY 16 • -1 REF • -1 DEX • -1 MOVE',
    erratum: 'El libro dice -1 MOVE. Con 19 SP las reglas dan -2 MOVE (p.136); la app usa eso.',
    description: 'Actualización del Boris de los 2020, con más armamento y blindaje más pesado. Punto de reunión de las fuerzas neosoviéticas.',
    sourcePage: 142,
  },
];
