import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RollEntry, AimedShotTarget } from '../types/cyberpunk';
import { resolveExplosionSecondDie } from '../engine/combatEngine';
import { emptyTurnLog, type TurnLog } from '../engine/martialArtsRules';
import type { MartialHitKind } from '../data/cyberfistsMartialArtsData';

// v4.9.3 [Claude Code · 2026-10-23] Backup del Lawman (Core p.158): llega tras 1d6 Rondas; un agente por miembro del grupo.
export interface BackupCall {
  id: string;
  lawmanId: string;
  groupIndices: number[];
  roundsLeft: number;
  arrived: boolean;
  agents: { groupIndex: number; hpMax: number; hpCurrent: number }[];
  calledAtRound: number;
}

export interface CombatStoreState {
  era: '2045' | '2077';
  selectedDistance: string;
  autofireByWeapon: Record<string, boolean>;
  luckToSpendOnNextRoll: number;
  aimedShotTarget: AimedShotTarget;
  rollHistory: RollEntry[];
  // v4.9.2 [Claude Code · 2026-10-22]: estado de Round (Core p.146: primer daño / primer Ataque exitoso del Round).
  round: number;
  firstDamageTakenThisRound: boolean;
  firstHitLandedThisRound: boolean;
  netActionsSpent: number;
  backupCalls: BackupCall[];
  // v4.9.6 [Claude Code · 2026-10-23] Registro del turno propio (decisión 48): golpes, movimientos usados y metros movidos.
  turnLog: TurnLog;
  recordHit: (kind: MartialHitKind, formId?: string) => void;
  recordMove: (moveId: string) => void;
  setMovedMeters: (n: number) => void;
  endTurn: () => void;
  addBackupCall: (call: Omit<BackupCall, 'id' | 'arrived' | 'calledAtRound'>) => void;
  damageBackupAgent: (callId: string, agentIndex: number, delta: number) => void;
  dismissBackupCall: (callId: string) => void;
  nextRound: () => void;
  markDamageTaken: () => void;
  markHitLanded: () => void;
  spendNetAction: () => void;
  resetCombatRound: () => void;

  setEra: (era: '2045' | '2077') => void;
  setSelectedDistance: (dist: string) => void;
  toggleWeaponAutofire: (weaponInstanceId: string) => void;
  setLuckToSpend: (amount: number) => void;
  setAimedShotTarget: (target: AimedShotTarget) => void;
  addRollEntry: (entry: RollEntry) => void;
  triggerExplosionClick: (rollId: string) => void;
  markAttackDamageRolled: (rollId: string) => void;
  /** v5.1.0 (plan 19): "Mostrar a la mesa". */
  shareRollWithTable: (rollId: string) => void;
  clearRollHistory: () => void;
}

// v4.9.7 [Claude Code · 2026-10-24] Grupos del estado persistido (plan 17, cambio 4).
// local: UI y preparación de la tirada de cada jugador; nunca sale de su dispositivo.
// shared: estado del combate; en v5.1.0 pasa al encuentro compartido.
export const COMBAT_LOCAL_KEYS = ['era', 'selectedDistance', 'autofireByWeapon', 'luckToSpendOnNextRoll', 'aimedShotTarget'] as const;
export const COMBAT_SHARED_KEYS = ['rollHistory', 'round', 'firstDamageTakenThisRound', 'firstHitLandedThisRound', 'netActionsSpent', 'backupCalls', 'turnLog'] as const;
export type CombatLocalKey = typeof COMBAT_LOCAL_KEYS[number];
export type CombatSharedKey = typeof COMBAT_SHARED_KEYS[number];
export type PersistedCombatState = Pick<CombatStoreState, CombatLocalKey | CombatSharedKey>;

// v4.9.7 [Claude Code · 2026-10-24] Devuelve un objeto plano (mismas claves de siempre) solo con los datos, sin funciones.
export function partializeCombat(state: CombatStoreState): PersistedCombatState {
  const out: Record<string, unknown> = {};
  for (const key of [...COMBAT_LOCAL_KEYS, ...COMBAT_SHARED_KEYS]) out[key] = state[key];
  return out as PersistedCombatState;
}

// v4.9.6 [Claude Code · 2026-10-23] Migración v1 -> v2: asegura el turnLog (decisión 48).
// v4.9.7 [Claude Code · 2026-10-24] v2 -> v3 no cambia la forma guardada (solo agrega partialize), no hace falta nada más.
export function migrateCombatState(persistedState: unknown, _version?: number): CombatStoreState {
  const st = persistedState as CombatStoreState;
  if (st && !st.turnLog) st.turnLog = emptyTurnLog();
  return st;
}

export const useCombatStore = create<CombatStoreState>()(
  persist(
    (set, get) => ({
      era: '2045',
      selectedDistance: '7-12m',
      autofireByWeapon: {},
      luckToSpendOnNextRoll: 0,
      aimedShotTarget: 'none',
      rollHistory: [],
      round: 1,
      firstDamageTakenThisRound: false,
      firstHitLandedThisRound: false,
      netActionsSpent: 0,
      backupCalls: [],
      turnLog: emptyTurnLog(),

      recordHit: (kind, formId) =>
        set((state) => ({
          turnLog: {
            ...state.turnLog,
            hitsByType: { ...state.turnLog.hitsByType, [kind]: (state.turnLog.hitsByType[kind] ?? 0) + 1 },
            formHits: formId
              ? { ...state.turnLog.formHits, [formId]: (state.turnLog.formHits[formId] ?? 0) + 1 }
              : state.turnLog.formHits
          }
        })),

      recordMove: (moveId) =>
        set((state) => ({ turnLog: { ...state.turnLog, movesUsed: [...state.turnLog.movesUsed, moveId] } })),

      setMovedMeters: (n) =>
        set((state) => ({ turnLog: { ...state.turnLog, movedMeters: Math.max(0, Number.isFinite(n) ? n : 0) } })),

      endTurn: () => set({ turnLog: emptyTurnLog() }),

      // Core p.158: cada llamada de Backup lleva su cuenta regresiva de Rondas.
      addBackupCall: (call) =>
        set((state) => ({
          backupCalls: [
            ...state.backupCalls,
            {
              ...call,
              id: `backup-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
              arrived: call.roundsLeft <= 0,
              calledAtRound: get().round
            }
          ]
        })),

      damageBackupAgent: (callId, agentIndex, delta) =>
        set((state) => ({
          backupCalls: state.backupCalls.map((bc) =>
            bc.id !== callId
              ? bc
              : {
                  ...bc,
                  agents: bc.agents.map((a, i) =>
                    i === agentIndex ? { ...a, hpCurrent: Math.max(0, Math.min(a.hpMax, a.hpCurrent + delta)) } : a
                  )
                }
          )
        })),

      dismissBackupCall: (callId) =>
        set((state) => ({ backupCalls: state.backupCalls.filter((bc) => bc.id !== callId) })),

      nextRound: () =>
        set((state) => ({
          round: state.round + 1,
          firstDamageTakenThisRound: false,
          firstHitLandedThisRound: false,
          netActionsSpent: 0,
          turnLog: emptyTurnLog(),
          backupCalls: state.backupCalls.map((bc) => {
            const roundsLeft = Math.max(0, bc.roundsLeft - 1);
            return { ...bc, roundsLeft, arrived: bc.arrived || roundsLeft === 0 };
          })
        })),

      markDamageTaken: () => set({ firstDamageTakenThisRound: true }),

      markHitLanded: () => set({ firstHitLandedThisRound: true }),

      spendNetAction: () => set((state) => ({ netActionsSpent: state.netActionsSpent + 1 })),

      resetCombatRound: () =>
        set({
          round: 1,
          firstDamageTakenThisRound: false,
          firstHitLandedThisRound: false,
          netActionsSpent: 0,
          turnLog: emptyTurnLog(),
          backupCalls: []
        }),

      setEra: (era) => set({ era }),

      setSelectedDistance: (selectedDistance) => set({ selectedDistance }),

      toggleWeaponAutofire: (weaponInstanceId) =>
        set((state) => ({
          autofireByWeapon: {
            ...state.autofireByWeapon,
            [weaponInstanceId]: !state.autofireByWeapon[weaponInstanceId]
          }
        })),

      setLuckToSpend: (amount) => set({ luckToSpendOnNextRoll: Math.max(0, amount) }),

      setAimedShotTarget: (aimedShotTarget) => set({ aimedShotTarget }),

      addRollEntry: (entry) =>
        set((state) => ({
          rollHistory: [entry, ...state.rollHistory].slice(0, 100)
        })),

      triggerExplosionClick: (rollId) =>
        set((state) => ({
          rollHistory: state.rollHistory.map((entry) => {
            if (entry.id === rollId && entry.needsExplosionClick) {
              return resolveExplosionSecondDie(entry);
            }
            return entry;
          })
        })),

      markAttackDamageRolled: (rollId) =>
        set((state) => ({
          rollHistory: state.rollHistory.map((entry) =>
            entry.id === rollId ? { ...entry, damageRolled: true } : entry
          )
        })),

      shareRollWithTable: (rollId) =>
        set((state) => ({
          rollHistory: state.rollHistory.map((entry) => (entry.id === rollId ? { ...entry, shareWithTable: true } : entry))
        })),

      clearRollHistory: () => set({ rollHistory: [] })
    }),
    {
      name: 'cpr-omni-deck-combat-v2',
      // Versión del esquema persistido. Al cambiar la forma de los datos, subir el número y migrar aquí.
      // v4.9.6 [Claude Code · 2026-10-23] versión 2: agrega turnLog (decisión 48).
      // v4.9.7 [Claude Code · 2026-10-24] versión 3: partialize con grupos local/shared.
      version: 3,
      partialize: partializeCombat,
      migrate: migrateCombatState
    }
  )
);
