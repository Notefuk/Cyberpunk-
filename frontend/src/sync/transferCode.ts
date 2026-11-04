// [Claude Code · 2026-11-04] v5.10.0 (plan 24): código para pasarle una ficha a otro jugador.
// Lógica pura: sin importar firebase.

/** Sin 0/O ni 1/I/L, para que se pueda dictar o copiar a mano sin errores. */
export const TRANSFER_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const TRANSFER_CODE_LENGTH = 10;
/** Cuánto dura un código (decisión de Giuliano, 2026-11-04). */
export const TRANSFER_TTL_MS = 24 * 60 * 60 * 1000;

/** `rand` devuelve números en [0, 1); se pasa para poder testearlo. */
export function newTransferCode(rand: () => number = Math.random): string {
  let out = '';
  for (let i = 0; i < TRANSFER_CODE_LENGTH; i++) {
    out += TRANSFER_ALPHABET[Math.floor(rand() * TRANSFER_ALPHABET.length) % TRANSFER_ALPHABET.length];
  }
  return out;
}

/** "K7P4QX9M2R" -> "K7P4Q-X9M2R". */
export function formatTransferCode(code: string): string {
  return code.length === TRANSFER_CODE_LENGTH ? `${code.slice(0, 5)}-${code.slice(5)}` : code;
}

/** Acepta el código con o sin guion, espacios o minúsculas. null si no tiene la forma de un código. */
export function parseTransferCode(input: string): string | null {
  const code = input.toUpperCase().replace(/[\s-]/g, '');
  if (code.length !== TRANSFER_CODE_LENGTH) return null;
  for (const ch of code) if (!TRANSFER_ALPHABET.includes(ch)) return null;
  return code;
}

/**
 * Campaña con la que queda la ficha al recibirla: la misma si el que la recibe es miembro de esa campaña;
 * si no, ninguna (la agrega él cuando se una). Decisión de Giuliano, 2026-11-04.
 */
export function campaignIdsAfterClaim(current: string[] | undefined, myCampaignIds: string[]): string[] {
  const c = current?.[0];
  return c && current?.length === 1 && myCampaignIds.includes(c) ? [c] : [];
}
