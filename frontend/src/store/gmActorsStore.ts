// [Claude Code · 2026-11-12] v5.22.0 (plan 28): actores guardados del GM.
// Sin mesa se guardan en este navegador (cpr_gm_actors_v1). Con mesa de GM, en campaigns/{c}/gm/actors, por la misma
// capa que las notas y los PNJ propios (sync/gmSecrets.ts): solo los ve el GM y se suben 1,5 s después del último cambio.
// El encuentro manda mientras el enemigo está en combate: cada cambio de HP, SP, balas o heridas se copia al actor.
import { create } from 'zustand';
import { GM_SECRET_LOCAL_KEYS, saveGmSecret, useGmSecrets } from '../sync/gmSecrets';
import { useEncounterStore } from './encounterStore';
import { actorStateFromEnemy, sameActorState, MAX_ACTORS, type GmActor } from '../engine/gmActors';

const LOCAL_KEY = GM_SECRET_LOCAL_KEYS.actors;

interface GmActorsState {
  actors: GmActor[];
  /** true: en la nube de la campaña (mesa de GM). */
  cloud: boolean;
}

export const useGmActors = create<GmActorsState>()(() => ({ actors: readLocalActors(), cloud: false }));

function isActor(x: unknown): x is GmActor {
  const a = x as GmActor;
  return !!a && typeof a.id === 'string' && typeof a.name === 'string' && !!a.state && typeof a.state.hp === 'number';
}

export function readLocalActors(): GmActor[] {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_KEY) : null;
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter(isActor) : [];
  } catch {
    return [];
  }
}

/** Guarda la lista: en la nube si hay mesa de GM, si no en este navegador. */
export function commitActors(actors: GmActor[]): void {
  const list = actors.slice(0, MAX_ACTORS);
  useGmActors.setState({ actors: list });
  if (useGmActors.getState().cloud) {
    saveGmSecret('actors', list);
    return;
  }
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    /* sin almacenamiento: queda en memoria */
  }
}

export function upsertActor(actor: GmActor): void {
  const list = useGmActors.getState().actors;
  const idx = list.findIndex((a) => a.id === actor.id);
  commitActors(idx >= 0 ? list.map((a) => (a.id === actor.id ? actor : a)) : [actor, ...list]);
}

export function patchActor(id: string, patch: Partial<GmActor>): void {
  const list = useGmActors.getState().actors;
  commitActors(list.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a)));
}

export function deleteActor(id: string): void {
  commitActors(useGmActors.getState().actors.filter((a) => a.id !== id));
}

/** Ids de actores que están ahora en el encuentro. */
export function actorIdsInEncounter(): Set<string> {
  const ids = new Set<string>();
  for (const c of useEncounterStore.getState().combatants) if (c.enemy?.actorId) ids.add(c.enemy.actorId);
  return ids;
}

/** Copia al actor el estado de su enemigo en el encuentro (si cambió). Exportada para los tests. */
export function syncActorsFromEncounter(): void {
  const list = useGmActors.getState().actors;
  if (list.length === 0) return;
  const byId = new Map(list.map((a) => [a.id, a]));
  let changed = false;
  const next = new Map<string, GmActor>();
  for (const c of useEncounterStore.getState().combatants) {
    const e = c.enemy;
    if (!e?.actorId) continue;
    const actor = byId.get(e.actorId);
    if (!actor) continue;
    const state = actorStateFromEnemy(e);
    if (!sameActorState(actor.state, state)) {
      next.set(actor.id, { ...actor, state, updatedAt: Date.now() });
      changed = true;
    }
  }
  if (changed) commitActors(list.map((a) => next.get(a.id) ?? a));
}

let started = false;

/** Se llama una vez al arrancar la app. */
export function initGmActorsSync(): void {
  if (started) return;
  started = true;
  useEncounterStore.subscribe(() => syncActorsFromEncounter());
  // Mesa de GM: la lista sigue a la de la campaña; al salir de la mesa vuelve la de este navegador.
  useGmSecrets.subscribe((s, prev) => {
    if (s.campId !== prev.campId) {
      if (!s.campId) useGmActors.setState({ cloud: false, actors: readLocalActors() });
      else useGmActors.setState({ cloud: true, actors: [] });
    }
    if (s.campId && s.values.actors !== prev.values.actors && Array.isArray(s.values.actors)) {
      const remote = (s.values.actors as unknown[]).filter(isActor);
      if (JSON.stringify(remote) !== JSON.stringify(useGmActors.getState().actors)) useGmActors.setState({ actors: remote });
    }
  });
}
