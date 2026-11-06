// [Claude Code · 2026-11-05] v5.11.0 (plan 25): a qué campaña entra sola una ficha de jugador.
// Lógica pura: sin importar firebase.

export interface AutoCampaign {
  id: string;
  gmUid: string;
  memberUids: string[];
}

/**
 * Campaña donde soy jugador (nunca una donde soy el GM: ahí mis fichas son NPC o del GM).
 * Si soy jugador en una sola, esa. Si soy jugador en varias, la mesa activa si es una de ellas;
 * si no, ninguna (queda para ASIGNAR a mano).
 */
export function pickAutoCampaign(campaigns: AutoCampaign[], uid: string, activeTableId: string | null): string | null {
  const asPlayer = campaigns.filter((c) => c.gmUid !== uid && c.memberUids.includes(uid));
  if (asPlayer.length === 1) return asPlayer[0].id;
  if (activeTableId && asPlayer.some((c) => c.id === activeTableId)) return activeTableId;
  return null;
}

/** Una ficha mía entra sola si es de jugador, no tiene campaña y no la estoy pasando a otro jugador. */
export function shouldAutoAssign(sheet: { sheetKind?: 'player' | 'npc' } | undefined, campId: string | null | undefined, hasPendingTransfer: boolean): boolean {
  return !!sheet && sheet.sheetKind !== 'npc' && !campId && !hasPendingTransfer;
}
