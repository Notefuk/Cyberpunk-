import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RollEntry, AimedShotTarget } from '../types/cyberpunk';
import { resolveExplosionSecondDie } from '../engine/combatEngine';

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
  clearRollHistory: () => void;
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

      clearRollHistory: () => set({ rollHistory: [] })
    }),
    {
      name: 'cpr-omni-deck-combat-v2',
      // Versión del esquema persistido. Al cambiar la forma de los datos, subir el número y migrar aquí.
      version: 1,
      migrate: (persistedState: unknown) => persistedState as CombatStoreState
    }
  )
);
