// [Claude Code · 2026-11-12] v5.23.0 (plan 28): notas privadas del GM por jugador, [{ charId, text }] (hasta 100).
export interface PlayerNote {
  charId: string;
  text: string;
}

export const PLAYER_NOTES_MAX = 100;
export const PLAYER_NOTE_TEXT_MAX = 4000;

export function parsePlayerNotes(raw: unknown): PlayerNote[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((n): n is PlayerNote => !!n && typeof n.charId === 'string' && typeof n.text === 'string');
}

export function playerNote(list: PlayerNote[], charId: string): string {
  return list.find((n) => n.charId === charId)?.text ?? '';
}

/** Pone la nota de un jugador; vacía la saca. La más reciente va primero y se corta en 100. */
export function setPlayerNote(list: PlayerNote[], charId: string, text: string): PlayerNote[] {
  const rest = list.filter((n) => n.charId !== charId);
  const t = text.slice(0, PLAYER_NOTE_TEXT_MAX);
  return (t.trim() ? [{ charId, text: t }, ...rest] : rest).slice(0, PLAYER_NOTES_MAX);
}
