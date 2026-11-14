// [Claude Code · 2026-11-14] v5.41.0 (plan 33): Stealth Netrunning de Going Quiet (pp.4-5).
// Tiradas opuestas con 1d10 (con explosión y pifia). En una tirada opuesta el empate lo gana el que
// se defiende (como en el resto de la app, CEMK pp.5 y 16): el netrunner tiene que superar cuando él actúa (entrar, esquivar, cruzarse con un
// Watcher) y el Watcher tiene que superar cuando busca con Pathfinder.

export const NET_STEALTH_SOURCE = 'Going Quiet pp.4-5';

export interface Watcher {
  name: string;
  interface: number;
  /** Bonus a Pathfinder (por ejemplo, el programa See Ya). */
  pathfinderBonus?: number;
}

export interface OpposedResult {
  attacker: number;
  defender: number;
  success: boolean;
}

/** Quietly Jack In: una NET Action extra. Interface + 1d10 contra Interface + 1d10 de cada Watcher; hay que ganarles a todos. */
export function quietJackIn(netrunnerInterface: number, netrunnerD10: number, watchers: { watcher: Watcher; d10: number }[]) {
  const total = netrunnerInterface + netrunnerD10;
  const results = watchers.map(({ watcher, d10 }) => ({ name: watcher.name, total: watcher.interface + d10, beaten: total > watcher.interface + d10 }));
  return { total, results, stealthed: results.every((r) => r.beaten) };
}

/** Black ICE en sigilo: Interface + Cloak + 1d10 contra PER + 1d10 del Black ICE, en vez del Speed Check. */
export function blackIceStealth(netrunnerInterface: number, cloakBonus: number, netrunnerD10: number, icePer: number, iceD10: number): OpposedResult {
  const attacker = netrunnerInterface + cloakBonus + netrunnerD10;
  const defender = icePer + iceD10;
  return { attacker, defender, success: attacker > defender };
}

/** Cruzarse con un Watcher: Interface + Cloak + 1d10 contra Interface + Pathfinder + 1d10. No gasta NET Actions. */
export function watcherEncounter(netrunnerInterface: number, cloakBonus: number, netrunnerD10: number, watcher: Watcher, watcherD10: number): OpposedResult {
  const attacker = netrunnerInterface + cloakBonus + netrunnerD10;
  const defender = watcher.interface + (watcher.pathfinderBonus ?? 0) + watcherD10;
  return { attacker, defender, success: attacker > defender };
}

/** Búsqueda del Watcher (una NET Action, una vez por Turno): si supera al netrunner, se rompe el sigilo. */
export function watcherSearch(watcher: Watcher, watcherD10: number, netrunnerInterface: number, cloakBonus: number, netrunnerD10: number): OpposedResult {
  const attacker = watcher.interface + (watcher.pathfinderBonus ?? 0) + watcherD10;
  const defender = netrunnerInterface + cloakBonus + netrunnerD10;
  return { attacker, defender, success: attacker > defender };
}

/** Qué rompe el sigilo (p.4): tomar un Control Node o interactuar directo con Black ICE o un Watcher (por ejemplo, atacarlo). */
export const STEALTH_BREAKERS = [
  'Tomar el control de un Control Node.',
  'Atacar o interactuar directamente con Black ICE o un Watcher.',
  'Perder una tirada contra Black ICE o contra un Watcher.'
];
export const STEALTH_ALLOWED = 'Dejar Virus y robar Files no rompe el sigilo (aunque un Virus llamativo llama la atención cuando se activa).';
export const STEALTH_RESTORE = 'Para volver a estar en sigilo hay que hacer Jack Out y otro Quietly Jack In. La alarma ya sonó; el GM puede poner penalizador si el enemigo te acaba de ver (Core p.130).';
