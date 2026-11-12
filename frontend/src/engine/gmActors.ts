// [Claude Code · 2026-11-12] v5.22.0 (plan 28): actores del GM, como los de Foundry VTT.
// Cada enemigo que se spawnea queda guardado con su estado (HP, SP, balas, heridas) para traerlo de vuelta.
// Funciones puras; el guardado está en store/gmActorsStore.ts.
import type { EnemySheet, ThreatTier } from '../data/enemiesCatalog';
import type { EncounterEnemy } from '../store/encounterStore';

export interface ActorAmmo {
  /** Balas en el cargador. */
  current: number;
  /** Balas de reserva. */
  reserve: number;
}

export interface GmActorState {
  hp: number;
  maxHp: number;
  headSp: number;
  maxHeadSp: number;
  bodySp: number;
  maxBodySp: number;
  /** Una entrada por arma de la ficha, en el mismo orden. Melee: { current: 0, reserve: 0 }. */
  ammo: ActorAmmo[];
  injuries: string[];
}

export interface GmActor {
  id: string;
  /** "Guardia 1", "Guardia 2"... */
  name: string;
  /** Id de la ficha del bestiario o del PNJ propio; '' para un enemigo rápido. */
  sourceId: string;
  /** Copia de la ficha solo si no está en el bestiario (PNJ propio): así no se pierde si se borra. */
  sheet?: EnemySheet;
  /** Enemigo rápido del Fixer (sin ficha). */
  quick?: { atkBase: number; damageDice: string; notes?: string; threatTier?: ThreatTier };
  state: GmActorState;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export const MAX_ACTORS = 200;

/**
 * Reserva inicial de cada arma a distancia: 3 cargadores, la misma convención que usa la app al pasar un PNJ a ficha
 * (convertEnemyToCharacterSheet). El GM la puede cambiar.
 */
export const RESERVE_MAGS = 3;

/** Nombre base sin número final: "Guardia 3" → "Guardia". */
export function baseName(name: string): string {
  return name.replace(/\s+#?\d+$/, '').trim();
}

/** Siguiente nombre libre: "Guardia" con "Guardia 1" y "Guardia 3" ya creados → "Guardia 4". */
export function nextActorName(base: string, existing: string[]): string {
  const b = baseName(base);
  const re = new RegExp(`^${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+#?(\\d+)$`);
  let max = 0;
  for (const n of existing) {
    const m = re.exec(n);
    if (m) max = Math.max(max, Number(m[1]));
    else if (n === b) max = Math.max(max, 1);
  }
  return `${b} ${max + 1}`;
}

export function defaultAmmo(enemy: Pick<EncounterEnemy, 'weapons'>): ActorAmmo[] {
  return enemy.weapons.map((w) => (w.mag > 0 ? { current: w.mag, reserve: w.mag * RESERVE_MAGS } : { current: 0, reserve: 0 }));
}

/** Estado del actor a partir del enemigo del encuentro. */
export function actorStateFromEnemy(e: EncounterEnemy): GmActorState {
  return {
    hp: e.currentHp,
    maxHp: e.maxHp,
    headSp: e.currentHeadSp,
    maxHeadSp: e.maxHeadSp,
    bodySp: e.currentBodySp,
    maxBodySp: e.maxBodySp,
    ammo: e.ammo ? e.ammo.map((a) => ({ ...a })) : defaultAmmo(e),
    injuries: [...(e.injuries ?? [])],
  };
}

export function sameActorState(a: GmActorState, b: GmActorState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Pone el estado del actor sobre un enemigo recién armado desde su ficha. */
export function applyActorState(e: EncounterEnemy, s: GmActorState): EncounterEnemy {
  return {
    ...e,
    currentHp: s.hp,
    maxHp: s.maxHp,
    currentHeadSp: s.headSp,
    maxHeadSp: s.maxHeadSp,
    currentBodySp: s.bodySp,
    maxBodySp: s.maxBodySp,
    ammo: s.ammo.map((a) => ({ ...a })),
    injuries: [...s.injuries],
  };
}

/** Curar a tope: HP y SP al máximo, sin heridas, cargadores llenos (la reserva no vuelve). */
export function healedState(s: GmActorState, weaponMags: number[]): GmActorState {
  return {
    ...s,
    hp: s.maxHp,
    headSp: s.maxHeadSp,
    bodySp: s.maxBodySp,
    injuries: [],
    ammo: s.ammo.map((a, i) => {
      const mag = weaponMags[i] ?? 0;
      if (mag <= 0) return a;
      const need = Math.max(0, mag - a.current);
      const take = Math.min(need, a.reserve);
      return { current: a.current + take, reserve: a.reserve - take };
    }),
  };
}

/** Gastar balas del cargador (no baja de 0). */
export function spendAmmo(ammo: ActorAmmo[], idx: number, n: number): ActorAmmo[] {
  return ammo.map((a, i) => (i === idx ? { ...a, current: Math.max(0, a.current - n) } : a));
}

/** Core p.169, Reload: llena el cargador con la reserva que haya. */
export function reloadAmmo(ammo: ActorAmmo[], idx: number, mag: number): ActorAmmo[] {
  return ammo.map((a, i) => {
    if (i !== idx || mag <= 0) return a;
    const take = Math.min(Math.max(0, mag - a.current), a.reserve);
    return { current: a.current + take, reserve: a.reserve - take };
  });
}
