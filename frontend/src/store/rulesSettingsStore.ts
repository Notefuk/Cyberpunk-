import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CritTable } from '../engine/medicalRules';

// v4.9.2 [Claude Code · 2026-10-22]
// Decisión de Giuliano (plan 10, punto 6): selector propio, independiente de la era.
// Core 2d6 con amputaciones (Core pp. 187-188) o CEMK 1d6 (CEMK RB p.13).
interface RulesSettingsState {
  criticalTable: CritTable;
  setCriticalTable: (t: CritTable) => void;
}

export const useRulesSettingsStore = create<RulesSettingsState>()(
  persist(
    (set) => ({
      criticalTable: 'core',
      setCriticalTable: (criticalTable) => set({ criticalTable })
    }),
    { name: 'cpr_rules_settings_v1' }
  )
);
