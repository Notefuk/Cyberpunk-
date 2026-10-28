// v5.3.0 [Claude Code · 2026-10-28]: quién puede usar las herramientas del GM (plan 20, B.3).
// Con mesa activa manda el rol de la campaña: el GM entra sin PIN y el jugador no ve las herramientas.
// Sin mesa, el PIN del GM (cpr_gm_pin_v1) se pide una vez por sesión y vale para el Fixer y el modo GM del NET.
import { create } from 'zustand';
import { useActiveTable } from '../sync/tableSync';

export const GM_PIN_STORAGE_KEY = 'cpr_gm_pin_v1';

export function readGmPin(): string | null {
  try {
    const pin = localStorage.getItem(GM_PIN_STORAGE_KEY);
    return pin && pin.length === 4 ? pin : null;
  } catch {
    return null;
  }
}

/** Desbloqueo del PIN en esta sesión (en memoria: al recargar se vuelve a pedir, como antes). */
export const useGmPinSession = create<{ unlocked: boolean; unlock: () => void; lock: () => void }>()((set) => ({
  unlocked: false,
  unlock: () => set({ unlocked: true }),
  lock: () => set({ unlocked: false })
}));

export type GmAccessMode = 'table-gm' | 'table-player' | 'local-open' | 'local-locked';

export function useGmAccess(): { mode: GmAccessMode; campName: string } {
  const { table, isGm } = useActiveTable();
  const unlocked = useGmPinSession((s) => s.unlocked);
  if (table) return { mode: isGm ? 'table-gm' : 'table-player', campName: table.name };
  return { mode: readGmPin() && !unlocked ? 'local-locked' : 'local-open', campName: '' };
}
