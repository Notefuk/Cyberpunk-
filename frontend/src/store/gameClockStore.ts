import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SpeedhealUse } from '../engine/roleRules';
import { useCharacterStore } from './useCharacterStore';

// v4.9.2 [Claude Code · 2026-10-22]
// Speedheal híbrido (plan 8, decisión 8): 1 por Beat por Medtech y 1 por día por paciente;
// Quick Fix vence al pasar de día (Core p.223 / CEMK RB p.14).
interface GameClockState {
  day: number;
  beat: number;
  session: number; // v4.9.3 [Claude Code · 2026-10-23]: número de sesión (Core p.154)
  speedhealLog: SpeedhealUse[];
  newBeat: () => void;
  newDay: () => void;
  endSession: () => { characterId: string; handle: string; resigned: string[] }[];
  recordSpeedheal: (u: SpeedhealUse) => void;
  resetClock: () => void;
}

export const useGameClockStore = create<GameClockState>()(
  persist(
    (set, get) => ({
      day: 1,
      beat: 1,
      session: 1,
      speedhealLog: [],

      newBeat: () => set((s) => ({ beat: s.beat + 1 })),

      newDay: () => {
        const nextDay = get().day + 1;
        set({ day: nextDay, beat: 1 });
        useCharacterStore.getState().expireQuickFixes(nextDay);
      },

      // Core p.154: fin de sesión = tope de Loyalty 10 y renuncias de Team Members con Loyalty < 0.
      endSession: () => {
        const summary = useCharacterStore.getState().applyEndOfSessionToAll();
        set((s) => ({ session: s.session + 1 }));
        return summary;
      },

      recordSpeedheal: (u) => set((s) => ({ speedhealLog: [...s.speedhealLog, u] })),

      resetClock: () => set({ day: 1, beat: 1, session: 1, speedhealLog: [] })
    }),
    { name: 'cpr_game_clock_v1' }
  )
);

export function currentDayKey(): string {
  return `D${useGameClockStore.getState().day}`;
}

export function currentBeatId(): string {
  const { day, beat } = useGameClockStore.getState();
  return `D${day}-B${beat}`;
}
