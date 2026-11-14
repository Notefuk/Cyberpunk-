// [Claude Code · 2026-11-14] v5.41.0 (plan 33): Flash of Luck, regla opcional de Going Quiet (p.3).
// Gastar Luck (Core p.130) para que el PJ "haya hecho antes" algo que ayuda ahora. Una vez por Beat y
// hasta tres por misión; en combate es una Standard Action. El GM puede vetarla (queda a la mesa).
// Si lo que hace falta no se puede comprar, se devuelve la Luck (interpretado: tampoco cuenta el uso).

export type FlashOfLuckTier = 'simple' | 'unlikely' | 'improbable';

export interface FlashOfLuckTierInfo {
  id: FlashOfLuckTier;
  label: string;
  luckCost: number;
  /** Lo máximo que se puede gastar en eb dentro del Flash of Luck (equipo, sobornos, etc.). */
  maxSpendEb: number;
  summary: string;
}

export const FLASH_OF_LUCK_SOURCE = 'Going Quiet p.3';
export const FLASH_OF_LUCK_MAX_PER_MISSION = 3;

export const FLASH_OF_LUCK_TIERS: FlashOfLuckTierInfo[] = [
  { id: 'simple', label: 'Simple', luckCost: 2, maxSpendEb: 100,
    summary: 'Algo simple o una coincidencia que pudo pasar "en cámara" en un Beat anterior (llamaste a un amigo de tu Lifepath para que esté en el club).' },
  { id: 'unlikely', label: 'Poco probable', luckCost: 4, maxSpendEb: 500,
    summary: 'Algo poco probable que no pudo pasar "en cámara" (el guardia es de tu póker de los miércoles; escondiste un rifle en el club).' },
  { id: 'improbable', label: 'Improbable', luckCost: 8, maxSpendEb: 1000,
    summary: 'Algo improbable que pide un conocimiento previo notable o mucha suerte (fuiste beta tester del modelo de caja fuerte).' }
];

export interface FlashOfLuckState {
  /** Beat en el que se usó por última vez (clave sesión-día-beat del reloj). */
  lastBeatKey?: string;
  /** Usos en la misión actual. */
  missionUses: number;
  log?: { at: string; tier: FlashOfLuckTier; note: string; refunded?: boolean }[];
}

export function beatKey(clock: { session: number; day: number; beat: number }): string {
  return `${clock.session}-${clock.day}-${clock.beat}`;
}

export function flashOfLuckTier(id: FlashOfLuckTier): FlashOfLuckTierInfo {
  return FLASH_OF_LUCK_TIERS.find((t) => t.id === id) ?? FLASH_OF_LUCK_TIERS[0];
}

/** Si se puede usar ahora; si no, el motivo en castellano. */
export function canUseFlashOfLuck(
  state: FlashOfLuckState | undefined,
  currentBeatKey: string,
  currentLuck: number,
  tier: FlashOfLuckTier,
  enabled: boolean
): { ok: true } | { ok: false; reason: string } {
  if (!enabled) return { ok: false, reason: 'El GM no prendió Flash of Luck en esta mesa.' };
  const s = state ?? { missionUses: 0 };
  if (s.lastBeatKey === currentBeatKey) return { ok: false, reason: 'Ya se usó en este Beat.' };
  if (s.missionUses >= FLASH_OF_LUCK_MAX_PER_MISSION) return { ok: false, reason: `Ya se usó ${FLASH_OF_LUCK_MAX_PER_MISSION} veces en esta misión.` };
  const cost = flashOfLuckTier(tier).luckCost;
  if (currentLuck < cost) return { ok: false, reason: `Hace falta ${cost} de Luck.` };
  return { ok: true };
}

export function applyFlashOfLuck(state: FlashOfLuckState | undefined, currentBeatKey: string, tier: FlashOfLuckTier, note: string, at: string): FlashOfLuckState {
  const s = state ?? { missionUses: 0 };
  return {
    lastBeatKey: currentBeatKey,
    missionUses: s.missionUses + 1,
    log: [{ at, tier, note }, ...(s.log ?? [])].slice(0, 10)
  };
}

/** Lo que hacía falta no se pudo comprar: vuelve la Luck y el uso no cuenta. */
export function refundLastFlashOfLuck(state: FlashOfLuckState | undefined): { state: FlashOfLuckState; luck: number } | null {
  const last = state?.log?.[0];
  if (!state || !last || last.refunded) return null;
  return {
    state: { lastBeatKey: undefined, missionUses: Math.max(0, state.missionUses - 1), log: [{ ...last, refunded: true }, ...state.log!.slice(1)] },
    luck: flashOfLuckTier(last.tier).luckCost
  };
}

export function newMission(state: FlashOfLuckState | undefined): FlashOfLuckState {
  return { missionUses: 0, log: state?.log };
}
