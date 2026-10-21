// Autoguardado del borrador del creador de personajes (plan 7, v4.8.3). [Claude Code · 2026-10-22]
import type { CreatorDraft } from '../../engine/characterCreation';

export const CREATOR_DRAFT_KEY = 'cpr_creator_draft_v1';

/** Devuelve el borrador guardado o null si no hay, está corrupto o es de otra versión. */
export function loadCreatorDraft(): CreatorDraft | null {
  try {
    const raw = localStorage.getItem(CREATOR_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CreatorDraft> | null;
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.version !== 1) return null;
    if (typeof parsed.step !== 'number' || !parsed.stats || typeof parsed.stats !== 'object') return null;
    if (!parsed.skills || typeof parsed.skills !== 'object' || !Array.isArray(parsed.purchases)) return null;
    return parsed as CreatorDraft;
  } catch {
    return null;
  }
}

export function saveCreatorDraft(draft: CreatorDraft): void {
  try {
    localStorage.setItem(CREATOR_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Cuota llena o almacenamiento no disponible: el borrador es opcional, se ignora.
  }
}

export function clearCreatorDraft(): void {
  try {
    localStorage.removeItem(CREATOR_DRAFT_KEY);
  } catch {
    // Sin almacenamiento: nada que borrar.
  }
}
