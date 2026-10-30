// v5.9.0 (plan 23): bandeja de la columna izquierda del HUD (Biomonitor & Vitales y compañía). [Claude Code · 2026-10-30]
// Cada panel izquierdo está en uno de tres lugares: la columna (como siempre), el centro o la bandeja (oculto, con vista previa).

export const STORAGE_KEY_LEFT_CENTER = 'cpr_combat_active_center_left_v1';
export const STORAGE_KEY_LEFT_TRAY = 'cpr_combat_disabled_left_modules_v1';
export const STORAGE_KEY_LEFT_TRAY_OPEN = 'cpr_combat_left_tray_open_v1';

export type LeftPanelPlace = 'column' | 'center' | 'tray';

/** Reparte los paneles: la columna sigue el orden de la columna; el centro, el orden en que se mandaron. Sin repetidos. */
export function splitLeftPanels<T extends string>(order: T[], center: T[], tray: T[]): { column: T[]; center: T[]; tray: T[] } {
  const known = new Set(order);
  const centerClean = [...new Set(center)].filter((id) => known.has(id));
  const inCenter = new Set(centerClean);
  const trayClean = [...new Set(tray)].filter((id) => known.has(id) && !inCenter.has(id));
  const inTray = new Set(trayClean);
  return {
    column: order.filter((id) => !inCenter.has(id) && !inTray.has(id)),
    center: centerClean,
    tray: order.filter((id) => inTray.has(id))
  };
}

export function placeOf<T extends string>(id: T, center: T[], tray: T[]): LeftPanelPlace {
  if (center.includes(id)) return 'center';
  if (tray.includes(id)) return 'tray';
  return 'column';
}

/** Mueve un panel a otro lugar y devuelve las dos listas nuevas (centro y bandeja). */
export function moveLeftPanelTo<T extends string>(id: T, place: LeftPanelPlace, center: T[], tray: T[]): { center: T[]; tray: T[] } {
  const c = center.filter((x) => x !== id);
  const t = tray.filter((x) => x !== id);
  if (place === 'center') c.push(id);
  if (place === 'tray') t.push(id);
  return { center: c, tray: t };
}

export function loadIdList<T extends string>(key: string, valid: readonly T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed.filter((id) => valid.includes(id)) as T[]) : [];
  } catch {
    return [];
  }
}

export function saveIdList(key: string, ids: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Sin localStorage, el acomodo vale solo para esta sesión.
  }
}
