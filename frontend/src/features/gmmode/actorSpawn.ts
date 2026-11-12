// [Claude Code · 2026-11-12] v5.22.0 (plan 28): spawnear enemigos como actores guardados y traerlos de vuelta.
import { ENEMIES_CATALOG, type EnemySheet } from '../../data/enemiesCatalog';
import {
  useEncounterStore,
  enemyFromSheet,
  quickEnemy,
  newEnemyInstanceId,
  type EncounterEnemy,
  type QuickEnemyInput,
} from '../../store/encounterStore';
import { useGmActors, upsertActor, patchActor } from '../../store/gmActorsStore';
import { actorStateFromEnemy, applyActorState, defaultAmmo, healedState, nextActorName, type GmActor } from '../../engine/gmActors';

const newActorId = () => `actor-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
const inCatalog = (id: string) => ENEMIES_CATALOG.some((e) => e.id === id);

/** La ficha de un actor: la copia guardada o la del bestiario. */
export function actorSheet(actor: GmActor): EnemySheet | undefined {
  return actor.sheet ?? ENEMIES_CATALOG.find((e) => e.id === actor.sourceId);
}

function existingNames(): string[] {
  return useGmActors.getState().actors.map((a) => a.name);
}

function newActor(enemy: EncounterEnemy, extra: Pick<GmActor, 'sourceId'> & Partial<GmActor>): GmActor {
  const now = Date.now();
  return { id: enemy.actorId!, name: enemy.name, notes: '', createdAt: now, updatedAt: now, state: actorStateFromEnemy(enemy), ...extra };
}

/** Spawnea `count` enemigos de una ficha: cada uno queda guardado como actor ("Guardia 1", "Guardia 2"…). */
export function spawnActorsFromSheet(sheet: EnemySheet, count = 1): string[] {
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    const name = nextActorName(sheet.name, existingNames());
    const actorId = newActorId();
    const base = enemyFromSheet(sheet, name, newEnemyInstanceId(`enc-${sheet.id}`));
    const enemy: EncounterEnemy = { ...base, actorId, ammo: defaultAmmo(base), injuries: [] };
    upsertActor(newActor(enemy, { sourceId: sheet.id, ...(inCatalog(sheet.id) ? {} : { sheet }) }));
    ids.push(useEncounterStore.getState().addEnemy(enemy));
  }
  return ids;
}

/** Enemigo rápido del Fixer, también como actor. */
export function spawnQuickActor(input: QuickEnemyInput): string {
  const name = nextActorName(input.name, existingNames());
  const actorId = newActorId();
  const enemy: EncounterEnemy = { ...quickEnemy({ ...input, name }, newEnemyInstanceId('goon')), actorId, ammo: [], injuries: [] };
  upsertActor(
    newActor(enemy, {
      sourceId: '',
      quick: { atkBase: input.atkBase, damageDice: input.damageDice, threatTier: input.threatTier ?? 'mook', ...(input.notes ? { notes: input.notes } : {}) },
    }),
  );
  return useEncounterStore.getState().addEnemy(enemy);
}

/** Arma el enemigo del encuentro con el estado guardado del actor. null si ya no hay ficha. */
export function enemyFromActor(actor: GmActor): EncounterEnemy | null {
  const id = newEnemyInstanceId(`enc-${actor.sourceId || 'goon'}`);
  let base: EncounterEnemy;
  if (actor.quick) {
    base = quickEnemy(
      { name: actor.name, hp: actor.state.maxHp, sp: actor.state.maxBodySp, atkBase: actor.quick.atkBase, damageDice: actor.quick.damageDice, notes: actor.quick.notes, threatTier: actor.quick.threatTier },
      id,
    );
  } else {
    const sheet = actorSheet(actor);
    if (!sheet) return null;
    base = enemyFromSheet(sheet, actor.name, id);
  }
  return { ...applyActorState(base, actor.state), actorId: actor.id };
}

/** "Traer al combate": vuelve tal cual quedó. */
export function bringActorBack(actor: GmActor): string | null {
  const enemy = enemyFromActor(actor);
  return enemy ? useEncounterStore.getState().addEnemy(enemy) : null;
}

/** Duplicar: un actor nuevo de la misma ficha, sano y con el siguiente número. */
export function duplicateActor(actor: GmActor): GmActor | null {
  const enemy = enemyFromActor(actor);
  if (!enemy) return null;
  const sheet = actor.quick ? undefined : actorSheet(actor);
  const fresh = sheet ? enemyFromSheet(sheet, actor.name, enemy.instanceId) : { ...enemy, currentHp: enemy.maxHp, currentHeadSp: enemy.maxHeadSp, currentBodySp: enemy.maxBodySp };
  const now = Date.now();
  const copy: GmActor = {
    ...actor,
    id: newActorId(),
    name: nextActorName(actor.name, existingNames()),
    notes: '',
    createdAt: now,
    updatedAt: now,
    state: { ...actorStateFromEnemy({ ...fresh, ammo: defaultAmmo(fresh), injuries: [] }) },
  };
  upsertActor(copy);
  return copy;
}

/** Curar a tope (fuera del combate): HP y SP al máximo, sin heridas y cargadores llenos con la reserva. */
export function healActor(actor: GmActor): void {
  const sheet = actorSheet(actor);
  const mags = sheet ? sheet.weapons.map((w) => w.mag) : [];
  patchActor(actor.id, { state: healedState(actor.state, mags) });
}
