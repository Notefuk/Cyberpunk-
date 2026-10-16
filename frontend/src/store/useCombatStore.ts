import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RollEntry } from '../types/cyberpunk';
import { resolveExplosionSecondDie } from '../engine/combatEngine';

export interface CombatStoreState {
  era: '2045' | '2077';
  selectedDistance: string;
  autofireByWeapon: Record<string, boolean>;
  luckToSpendOnNextRoll: number;
  rollHistory: RollEntry[];

  setEra: (era: '2045' | '2077') => void;
  setSelectedDistance: (dist: string) => void;
  toggleWeaponAutofire: (weaponInstanceId: string) => void;
  setLuckToSpend: (amount: number) => void;
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
      rollHistory: [],

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
      name: 'cpr-omni-deck-combat-v2'
    }
  )
);
