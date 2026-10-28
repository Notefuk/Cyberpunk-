// v5.1.0 [Claude Code · 2026-10-27]: encuentro unificado (plan 19, punto 2).
// Un solo encuentro para el cajón BESTIARIO del HUD, el EnemiesCompendiumPanel y el tracker de iniciativa
// del Fixer Deck. Reemplaza los useState `activeEnemies` (cpr_active_encounter_v1) y `combatants`, y el
// contador de round del Fixer. El round del encuentro manda sobre `useCombatStore.round`.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnemySheet, ThreatTier, EnemyCombatBase, EnemyWeaponProfile } from '../data/enemiesCatalog';
import type { StatKey, CharacterEra } from '../types/cyberpunk';
import { useCombatStore } from './useCombatStore';

export const ENCOUNTER_STORAGE_KEY = 'cpr_encounter_v1';
export const LEGACY_ENCOUNTER_KEY = 'cpr_active_encounter_v1';

/** Enemigo vivo en el encuentro (antes `ActiveEncounterEnemy` del EnemiesCompendiumPanel). */
export interface EncounterEnemy {
  instanceId: string;
  catalogId: string;
  name: string;
  subtitle: string;
  faction: string;
  threatTier: ThreatTier;
  era: CharacterEra;
  role: string;
  currentHp: number;
  maxHp: number;
  currentHeadSp: number;
  maxHeadSp: number;
  currentBodySp: number;
  maxBodySp: number;
  initiative: number | null;
  stats: Record<StatKey, number>;
  weapons: EnemyWeaponProfile[];
  combatBases: EnemyCombatBase[];
  specialRules: string[];
  /** Goons rápidos del Fixer (presets y a mano): ataque base y daño, sin ficha del catálogo. */
  quick?: { atkBase: number; damageDice: string; notes?: string };
}

export interface EncounterCombatant {
  id: string;
  kind: 'pc' | 'enemy';
  name: string;
  initiative: number | null;
  /** Solo PJ: id de la ficha y dueño en la nube (si la tiene). */
  charId?: string;
  ownerUid?: string;
  /** Solo enemigos. `enemy.instanceId === id` y `enemy.initiative` sigue a `initiative`. */
  enemy?: EncounterEnemy;
  /** Vista pública de la mesa (lo que ve el jugador de un enemigo, sin HP). Plan 19, punto 3. */
  woundState?: WoundState;
}

export type WoundState = 'none' | 'light' | 'serious' | 'mortal';

export interface QuickEnemyInput {
  name: string;
  hp: number;
  sp: number;
  atkBase: number;
  damageDice: string;
  notes?: string;
  threatTier?: ThreatTier;
}

export interface EnemyDamageResult {
  penetrating: number;
  hpLost: number;
  newSp: number;
  ablated: boolean;
}

export interface EncounterData {
  round: number;
  /** Índice dentro de `order` de quien tiene el turno. */
  turnIndex: number;
  combatants: EncounterCombatant[];
  /** Ids ordenados por iniciativa (mayor primero; sin tirar, al final, en orden de llegada). */
  order: string[];
}

interface EncounterState extends EncounterData {
  addEnemyFromCatalog: (sheet: EnemySheet, count?: number) => string[];
  addQuickEnemy: (input: QuickEnemyInput) => string;
  addPc: (charId: string, name: string, ownerUid?: string) => string;
  setInitiative: (id: string, initiative: number | null) => void;
  adjustEnemyHp: (id: string, delta: number) => void;
  adjustEnemySp: (id: string, location: 'head' | 'body', delta: number) => void;
  repairEnemySp: (id: string) => void;
  applyEnemyDamage: (id: string, damage: number, location: 'head' | 'body') => EnemyDamageResult | null;
  remove: (id: string) => void;
  clearEnemies: () => void;
  nextTurn: () => void;
  nextRound: () => void;
  reset: () => void;
  /**
   * Pone el encuentro que llegó de la mesa (vista pública en el jugador; el guardado en la nube en el GM).
   * Si el round avanzó, `useCombatStore` hace sus reseteos por personaje; si volvió a 1, se reinicia. [Claude Code · 2026-10-27]
   */
  applyRemote: (data: EncounterData) => void;
}

const EMPTY: EncounterData = { round: 1, turnIndex: 0, combatants: [], order: [] };

export function pcCombatantId(charId: string): string {
  return `pc-${charId}`;
}

function newEnemyId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

/** Orden de iniciativa: mayor primero; empate y sin tirar, por orden de llegada (sort estable). */
export function computeOrder(combatants: EncounterCombatant[]): string[] {
  return combatants
    .map((c, i) => ({ c, i }))
    .sort((a, b) => {
      const ai = a.c.initiative, bi = b.c.initiative;
      if (ai === null && bi === null) return a.i - b.i;
      if (ai === null) return 1;
      if (bi === null) return -1;
      return bi - ai || a.i - b.i;
    })
    .map(({ c }) => c.id);
}

export function enemyFromSheet(sheet: EnemySheet, name: string, instanceId: string): EncounterEnemy {
  return {
    instanceId,
    catalogId: sheet.id,
    name,
    subtitle: sheet.subtitle,
    faction: sheet.faction,
    threatTier: sheet.threatTier,
    era: sheet.era,
    role: sheet.role,
    currentHp: sheet.hp,
    maxHp: sheet.hp,
    currentHeadSp: sheet.headSp,
    maxHeadSp: sheet.headSp,
    currentBodySp: sheet.bodySp,
    maxBodySp: sheet.bodySp,
    initiative: null,
    stats: { ...sheet.stats },
    weapons: [...sheet.weapons],
    combatBases: [...sheet.combatBases],
    specialRules: [...sheet.specialRules]
  };
}

function enemyCombatant(enemy: EncounterEnemy): EncounterCombatant {
  return { id: enemy.instanceId, kind: 'enemy', name: enemy.name, initiative: enemy.initiative, enemy };
}

/** Trae los enemigos del encuentro viejo (`cpr_active_encounter_v1`, un array plano). */
export function migrateLegacyEncounter(raw: string | null): EncounterData {
  if (!raw) return EMPTY;
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return EMPTY;
    const combatants = list
      .filter((e): e is EncounterEnemy => !!e && typeof e.instanceId === 'string' && typeof e.name === 'string')
      .map((e) => enemyCombatant({ ...e, initiative: typeof e.initiative === 'number' ? e.initiative : null }));
    return { ...EMPTY, combatants, order: computeOrder(combatants) };
  } catch {
    return EMPTY;
  }
}

function initialData(): EncounterData {
  try {
    if (typeof localStorage === 'undefined' || localStorage.getItem(ENCOUNTER_STORAGE_KEY)) return EMPTY;
    return migrateLegacyEncounter(localStorage.getItem(LEGACY_ENCOUNTER_KEY));
  } catch {
    return EMPTY;
  }
}

function clamp(v: number, max: number): number {
  return Math.max(0, Math.min(max, v));
}

/**
 * Cambia la lista y rehace el orden, manteniendo el turno en quien lo tenía (si sigue).
 * Antes del primer turno (round 1, índice 0) el turno es siempre del primero del orden.
 */
function withCombatants(s: EncounterData, combatants: EncounterCombatant[]): Partial<EncounterData> {
  const order = computeOrder(combatants);
  if (s.round === 1 && s.turnIndex === 0) return { combatants, order, turnIndex: 0 };
  const current = s.order[s.turnIndex];
  const idx = current ? order.indexOf(current) : -1;
  const turnIndex = idx >= 0 ? idx : Math.min(s.turnIndex, Math.max(0, order.length - 1));
  return { combatants, order, turnIndex };
}

function mapEnemy(s: EncounterData, id: string, fn: (e: EncounterEnemy) => EncounterEnemy): EncounterCombatant[] {
  return s.combatants.map((c) => (c.id === id && c.enemy ? { ...c, enemy: fn(c.enemy) } : c));
}

export const useEncounterStore = create<EncounterState>()(
  persist(
    (set, get) => ({
      ...initialData(),

      addEnemyFromCatalog: (sheet, count = 1) => {
        const added: EncounterCombatant[] = [];
        for (let i = 0; i < count; i++) {
          const suffix = count > 1 ? ` #${i + 1}` : '';
          added.push(enemyCombatant(enemyFromSheet(sheet, `${sheet.name}${suffix}`, newEnemyId(`enc-${sheet.id}`))));
        }
        set((s) => withCombatants(s, [...s.combatants, ...added]));
        return added.map((c) => c.id);
      },

      addQuickEnemy: (input) => {
        const id = newEnemyId('goon');
        const enemy: EncounterEnemy = {
          instanceId: id,
          catalogId: '',
          name: input.name,
          subtitle: '',
          faction: '',
          threatTier: input.threatTier ?? 'mook',
          era: '2045' as CharacterEra,
          role: '',
          currentHp: input.hp,
          maxHp: input.hp,
          currentHeadSp: input.sp,
          maxHeadSp: input.sp,
          currentBodySp: input.sp,
          maxBodySp: input.sp,
          initiative: null,
          stats: {} as Record<StatKey, number>,
          weapons: [],
          combatBases: [],
          specialRules: [],
          quick: { atkBase: input.atkBase, damageDice: input.damageDice, notes: input.notes }
        };
        set((s) => withCombatants(s, [...s.combatants, enemyCombatant(enemy)]));
        return id;
      },

      addPc: (charId, name, ownerUid) => {
        const id = pcCombatantId(charId);
        set((s) => {
          const exists = s.combatants.some((c) => c.id === id);
          const combatants = exists
            ? s.combatants.map((c) => (c.id === id ? { ...c, name, ownerUid: ownerUid ?? c.ownerUid } : c))
            : [...s.combatants, { id, kind: 'pc' as const, name, initiative: null, charId, ownerUid }];
          return withCombatants(s, combatants);
        });
        return id;
      },

      setInitiative: (id, initiative) =>
        set((s) =>
          withCombatants(
            s,
            s.combatants.map((c) =>
              c.id === id ? { ...c, initiative, enemy: c.enemy ? { ...c.enemy, initiative } : undefined } : c
            )
          )
        ),

      adjustEnemyHp: (id, delta) =>
        set((s) => ({ combatants: mapEnemy(s, id, (e) => ({ ...e, currentHp: clamp(e.currentHp + delta, e.maxHp) })) })),

      adjustEnemySp: (id, location, delta) =>
        set((s) => ({
          combatants: mapEnemy(s, id, (e) =>
            location === 'head'
              ? { ...e, currentHeadSp: clamp(e.currentHeadSp + delta, e.maxHeadSp) }
              : { ...e, currentBodySp: clamp(e.currentBodySp + delta, e.maxBodySp) }
          )
        })),

      repairEnemySp: (id) =>
        set((s) => ({ combatants: mapEnemy(s, id, (e) => ({ ...e, currentHeadSp: e.maxHeadSp, currentBodySp: e.maxBodySp })) })),

      // Core p.186: el daño que supera el SP pasa y ablaciona 1; en la cabeza, el que pasa se duplica.
      applyEnemyDamage: (id, damage, location) => {
        const target = get().combatants.find((c) => c.id === id)?.enemy;
        if (!target) return null;
        const sp = location === 'head' ? target.currentHeadSp : target.currentBodySp;
        const penetrating = Math.max(0, damage - sp);
        const ablated = damage > sp;
        const hpLost = location === 'head' ? penetrating * 2 : penetrating;
        const newSp = ablated ? Math.max(0, sp - 1) : sp;
        set((s) => ({
          combatants: mapEnemy(s, id, (e) => ({
            ...e,
            currentHp: Math.max(0, e.currentHp - hpLost),
            currentHeadSp: location === 'head' ? newSp : e.currentHeadSp,
            currentBodySp: location === 'body' ? newSp : e.currentBodySp
          }))
        }));
        return { penetrating, hpLost, newSp, ablated };
      },

      remove: (id) => set((s) => withCombatants(s, s.combatants.filter((c) => c.id !== id))),

      clearEnemies: () => set((s) => withCombatants(s, s.combatants.filter((c) => c.kind !== 'enemy'))),

      nextTurn: () => {
        const { order, turnIndex } = get();
        if (order.length === 0) return;
        if (turnIndex >= order.length - 1) {
          get().nextRound();
          return;
        }
        set({ turnIndex: turnIndex + 1 });
      },

      // El round es de la mesa: avanza acá y `useCombatStore` hace sus reseteos por personaje
      // (primer daño, NET Actions, turnLog, refuerzos) y copia el número. [Claude Code · 2026-10-27]
      nextRound: () => {
        const round = get().round + 1;
        set({ round, turnIndex: 0 });
        useCombatStore.getState().nextRound();
        useCombatStore.setState({ round });
      },

      reset: () => {
        set({ ...EMPTY });
        useCombatStore.getState().resetCombatRound();
      },

      applyRemote: (data) => {
        const prevRound = get().round;
        set({ round: data.round, turnIndex: data.turnIndex, combatants: data.combatants, order: data.order });
        if (data.round > prevRound) {
          for (let r = prevRound; r < data.round; r++) useCombatStore.getState().nextRound();
          useCombatStore.setState({ round: data.round });
        } else if (data.round < prevRound) {
          useCombatStore.getState().resetCombatRound();
          useCombatStore.setState({ round: data.round });
        }
      }
    }),
    {
      name: ENCOUNTER_STORAGE_KEY,
      version: 1,
      partialize: (s): EncounterData => ({ round: s.round, turnIndex: s.turnIndex, combatants: s.combatants, order: s.order })
    }
  )
);

/** Combatientes en orden de iniciativa. */
export function orderedCombatants(s: Pick<EncounterData, 'combatants' | 'order'>): EncounterCombatant[] {
  const byId = new Map(s.combatants.map((c) => [c.id, c]));
  return s.order.map((id) => byId.get(id)).filter((c): c is EncounterCombatant => !!c);
}

/** Solo los enemigos, en el orden en que se agregaron (como la lista del bestiario). */
export function encounterEnemies(s: Pick<EncounterData, 'combatants'>): EncounterEnemy[] {
  return s.combatants.filter((c) => c.enemy).map((c) => c.enemy!);
}
