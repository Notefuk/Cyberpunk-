import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// [Claude Code · 2026-10-23] Modo Novato del creador (plan 12): interruptor del dispositivo, independiente del borrador.
export const useCreatorNoviceStore = create<{ novice: boolean; toggle: () => void }>()(
  persist(
    (set) => ({
      novice: true,
      toggle: () => set((s) => ({ novice: !s.novice }))
    }),
    { name: 'cpr_creator_novice_v1' }
  )
);
