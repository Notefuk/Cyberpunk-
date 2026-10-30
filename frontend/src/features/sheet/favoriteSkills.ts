// v5.8.0 (plan 23): filtro "Solo favoritas" de Street Lab, guardado por navegador. [Claude Code · 2026-10-30]
const FAV_ONLY_KEY = 'cpr_streetlab_fav_only_v1';

export function readFavOnly(): boolean {
  try {
    return localStorage.getItem(FAV_ONLY_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeFavOnly(value: boolean): void {
  try {
    localStorage.setItem(FAV_ONLY_KEY, value ? '1' : '0');
  } catch {
    // Sin localStorage el filtro vale solo para esta sesión.
  }
}
