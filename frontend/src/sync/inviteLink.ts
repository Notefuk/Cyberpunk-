// [Claude Code · 2026-10-24] v5.0.0 (plan 18): link de invitación ?unirse=<campId>.<código>.
// Al abrir la app se guarda en sessionStorage y se limpia la dirección; la pestaña MESA ofrece unirse.
import { parseInviteParam } from './campaignRepo';

const KEY = 'cpr_pending_invite_v1';

export interface PendingInvite { campId: string; code: string }

export function readPendingInvite(): PendingInvite | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? parseInviteParam(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingInvite(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // sin sessionStorage no hay nada que limpiar
  }
}

/** Toma la invitación de la dirección (si hay) y avisa si queda una pendiente. Se puede llamar dos veces. */
export function captureInviteFromUrl(): boolean {
  try {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('unirse');
    if (raw && parseInviteParam(raw)) {
      sessionStorage.setItem(KEY, raw);
      url.searchParams.delete('unirse');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  } catch {
    // dirección rara o sin sessionStorage: se ignora la invitación
  }
  return readPendingInvite() !== null;
}
