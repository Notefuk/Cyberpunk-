import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// [Claude Code · 2026-10-22] Modo GM = edición libre sin costo de IP (plan 9, decisión 2: interruptor general del dispositivo).
export const useGmModeStore = create<{ gmFreeEdit: boolean; setGmFreeEdit: (v: boolean) => void }>()(
  persist(
    (set) => ({
      gmFreeEdit: false,
      setGmFreeEdit: (v: boolean) => set({ gmFreeEdit: v })
    }),
    { name: 'cpr_gm_free_edit_v1' }
  )
);
