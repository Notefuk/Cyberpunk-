// [Claude Code · 2026-11-11] v5.17.0 (plan 27): The Dreaded Punknaught, el vehículo jefe armado con chatarra.
// Interface RED Vol. 4 pp.38-44 (también DLC "Hardened: The Dreaded Punknaught" pp.2-7).
// Funciones puras: piezas, ficha, construcción, manejo y tabla de muerte.

export type PunknaughtPartId =
  | 'armor'
  | 'buzzsawArm'
  | 'catapult'
  | 'cockpitGlass'
  | 'combatSpikes'
  | 'extraEngine'
  | 'extraChassis'
  | 'nos'
  | 'spikeStripLauncher'
  | 'turret';

export interface PunknaughtPart {
  id: PunknaughtPartId | 'core';
  name: string;
  /** Días que suma a la construcción. */
  days: number;
  /** DV de Basic Tech del Salvage Boss para encontrarla. */
  salvageDv: number;
  /** Lo que suma al DV de Land Vehicle Tech del Construction Boss. */
  constructionMod: number;
  /** Cuántas veces se puede poner (la hoja de p.44). */
  max: number;
  effectEs: string;
}

/** Tabla de piezas (IR4 p.43; descripciones pp.40-42). */
export const PUNKNAUGHT_CORE: PunknaughtPart = {
  id: 'core', name: 'Punknaught Core', days: 7, salvageDv: 15, constructionMod: 0, max: 1,
  effectEs: 'Un bus o camión destruido y cuatro motores de AV: sin el Core no hay Punknaught.',
};

export const PUNKNAUGHT_PARTS: PunknaughtPart[] = [
  { id: 'armor', name: 'Armor', days: 1, salvageDv: 13, constructionMod: 1, max: 2,
    effectEs: 'SP13. Con una sola, un 10 natural en el ataque que pega va directo al SDP; con dos, se tapan los huecos.' },
  { id: 'buzzsawArm', name: 'Buzzsaw Arm', days: 1, salvageDv: 9, constructionMod: 1, max: 1,
    effectEs: 'Very Heavy Melee Weapon que usa un pasajero; sacarlo o guardarlo es una Acción.' },
  { id: 'catapult', name: 'Catapult', days: 1, salvageDv: 13, constructionMod: 1, max: 1,
    effectEs: 'Lanza carga (hasta una persona) con Heavy Weapons a una casilla, tabla del Grenade Launcher, hasta 25 m. Sin dos Cyberlegs, el lanzado tira Athletics DV15 o recibe 2d6 a los HP.' },
  { id: 'cockpitGlass', name: 'Cockpit Glass', days: 3, salvageDv: 15, constructionMod: 1, max: 1,
    effectEs: 'Thick Bulletproof Glass de 30 HP sobre la cabina.' },
  { id: 'combatSpikes', name: 'Combat Spikes', days: 3, salvageDv: 13, constructionMod: 1, max: 2,
    effectEs: 'Si embiste en un Turno con NOS: +2d6 de daño (+3d6 con dos).' },
  { id: 'extraEngine', name: 'Extra AV-4 Engine', days: 2, salvageDv: 15, constructionMod: 2, max: 3,
    effectEs: '+5 MOVE y +20 MPH (32 KPH). Uno por cada Extra Chassis.' },
  { id: 'extraChassis', name: 'Extra Chassis', days: 3, salvageDv: 13, constructionMod: 2, max: 3,
    effectEs: '+20 SDP, +10 asientos y +1d6 al embestir.' },
  { id: 'nos', name: 'NOS', days: 1, salvageDv: 13, constructionMod: 2, max: 5,
    effectEs: 'Un tanque: una Move Action extra en un Turno, una sola vez.' },
  { id: 'spikeStripLauncher', name: 'Spike Strip Launcher', days: 1, salvageDv: 9, constructionMod: 1, max: 1,
    effectEs: '3 tiras con Heavy Weapons (tabla del Grenade Launcher, hasta 25 m). Quien pase con ruedas tira Drive Land Vehicle DV17 o su vehículo recibe 4d6 en el punto débil.' },
  { id: 'turret', name: 'Turret', days: 1, salvageDv: 13, constructionMod: 1, max: 12,
    effectEs: 'Torreta para un arma a distancia de dos manos (aparte), que dispara y recarga un pasajero. Hasta 3 por chasis (el Core cuenta).' },
];

export type PunknaughtBuild = Partial<Record<PunknaughtPartId, number>>;

const partById = (id: PunknaughtPartId) => PUNKNAUGHT_PARTS.find((p) => p.id === id)!;

/** Máximo de cada pieza con lo que ya tiene (motores y torretas dependen de los chasis). */
export function punknaughtMax(id: PunknaughtPartId, build: PunknaughtBuild): number {
  const chassis = Math.min(build.extraChassis ?? 0, 3);
  if (id === 'extraEngine') return chassis;
  if (id === 'turret') return 3 * (1 + chassis);
  return partById(id).max;
}

/** Recorta la build a los máximos del libro. */
export function clampPunknaughtBuild(build: PunknaughtBuild): PunknaughtBuild {
  const out: PunknaughtBuild = {};
  out.extraChassis = Math.max(0, Math.min(build.extraChassis ?? 0, 3));
  for (const p of PUNKNAUGHT_PARTS) {
    if (p.id === 'extraChassis') continue;
    out[p.id as PunknaughtPartId] = Math.max(0, Math.min(build[p.id as PunknaughtPartId] ?? 0, punknaughtMax(p.id as PunknaughtPartId, out)));
  }
  return out;
}

export interface PunknaughtStats {
  sdp: number;
  sp: number;
  /** true si tiene una sola Armor: un 10 natural la saltea. */
  armorGaps: boolean;
  seats: number;
  combatMove: number;
  mph: number;
  kph: number;
  /** Días de construcción si se encuentran todas las piezas a la primera. */
  constructionDays: number;
  /** DV de Land Vehicle Tech del Construction Boss. */
  constructionDv: number;
  /** El conductor no tira cada Ronda si su Drive Land Vehicle Base y su BODY superan esto. */
  driveBaseOver: number;
  bodyOver: number;
  maneuverPenalty: number;
  /** Dados extra al embestir por los Extra Chassis. */
  rammingBonusD6: number;
  /** Dados extra al embestir con NOS y Combat Spikes. */
  spikesNosBonusD6: number;
}

/** Ficha del Punknaught: la básica (IR4 p.42) más lo que suma cada pieza. */
export function punknaughtStats(raw: PunknaughtBuild): PunknaughtStats {
  const b = clampPunknaughtBuild(raw);
  const n = (id: PunknaughtPartId) => b[id] ?? 0;
  const chassis = n('extraChassis');
  const engines = n('extraEngine');
  let days = PUNKNAUGHT_CORE.days;
  let dv = 13;
  for (const p of PUNKNAUGHT_PARTS) {
    days += p.days * n(p.id as PunknaughtPartId);
    dv += p.constructionMod * n(p.id as PunknaughtPartId);
  }
  return {
    sdp: 60 + 20 * chassis,
    sp: n('armor') > 0 ? 13 : 0,
    armorGaps: n('armor') === 1,
    seats: 20 + 10 * chassis,
    combatMove: 15 + 5 * engines,
    mph: 60 + 20 * engines,
    kph: 97 + 32 * engines,
    constructionDays: days,
    constructionDv: dv,
    driveBaseOver: 10 + chassis,
    bodyOver: 5 + chassis,
    maneuverPenalty: chassis,
    rammingBonusD6: chassis,
    spikesNosBonusD6: n('combatSpikes') === 0 ? 0 : n('combatSpikes') === 1 ? 2 : 3,
  };
}

/** Horas que funciona: lo que el Construction Boss superó el DV (IR4 p.39). 0 o menos = se desarma. */
export function punknaughtHours(checkTotal: number, dv: number): number | null {
  return checkTotal >= dv ? checkTotal - dv : null;
}

/** Tabla de muerte 1d6 (IR4 p.43): cuando se le acaba el tiempo o llega a 0 SDP y falla el Death Save. */
export const PUNKNAUGHT_DEATH_TABLE: string[] = [
  'Se detiene y deja de funcionar.',
  'Los motores rugen: sale disparado a todo su MOVE hacia donde diga el GM y se detiene; si choca algo, cuenta como embestida.',
  'Se prende el combustible: todo el que esté adentro o encima queda On Fire (Strong) (Core p.180).',
  'Se prende el combustible y los motores rugen: pasan el 2 y el 3, y lo que embiste se prende, junto con todo a 20 m o menos, On Fire (Mild).',
  'Tiembla y se desarma: todo el que esté adentro o encima recibe daño de Very Heavy Melee Weapon, sin poder esquivarlo.',
  'Explota: todo a 6 m (3 casillas) o menos, y quien esté adentro o encima, recibe daño de Armor Piercing Grenade, sin poder esquivarlo.',
];

/** En todos los resultados, el Punknaught y sus piezas quedan Destroyed Beyond Repair. */
export function punknaughtDeath(d6: number): string {
  const i = Math.max(1, Math.min(6, Math.trunc(d6))) - 1;
  return `${i + 1}: ${PUNKNAUGHT_DEATH_TABLE[i]} El Punknaught y sus piezas quedan destruidos sin arreglo.`;
}
