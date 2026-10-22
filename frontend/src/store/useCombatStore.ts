import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RollEntry, AimedShotTarget } from '../types/cyberpunk';
import { resolveExplosionSecondDie } from '../engine/combatEngine';

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
    (set) => ({
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

      nextRound: () =>
        set((state) => ({
          round: state.round + 1,
          firstDamageTakenThisRound: false,
          firstHitLandedThisRound: false,
          netActionsSpent: 0
        })),

      markDamageTaken: () => set({ firstDamageTakenThisRound: true }),

      markHitLanded: () => set({ firstHitLandedThisRound: true }),

      spendNetAction: () => set((state) => ({ netActionsSpent: state.netActionsSpent + 1 })),

      resetCombatRound: () =>
        set({
          round: 1,
          firstDamageTakenThisRound: false,
          firstHitLandedThisRound: false,
          netActionsSpent: 0
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
