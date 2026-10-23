// [Claude Code · 2026-10-23] Efectos de STAT por ciberware instalado (plan 13).
// Core RED p.114 (errata v1.25), Grafted Muscle and Bone Lace: "Increases BODY by 2... Multiple installments stack.
// Cannot raise BODY above 10". Los ids repetidos en installedCyberwareIds cuentan como instalaciones separadas.
// La ficha guarda el STAT base; el bono se aplica en el motor (getEffectiveBody) y en el creador (computeDerived).

export interface CyberwareStatEffect {
  stat: 'BODY';
  perInstall: number;
  max: number;
  source: { book: string; page: number };
}

const GRAFTED_MUSCLE_EFFECT: CyberwareStatEffect = {
  stat: 'BODY',
  perInstall: 2,
  max: 10,
  source: { book: 'Core RED', page: 114 }
};

export const CYBERWARE_EFFECTS: Record<string, CyberwareStatEffect> = {
  'grafted-muscle-bone-lace': { ...GRAFTED_MUSCLE_EFFECT, source: { ...GRAFTED_MUSCLE_EFFECT.source } },
  'cw-cemk-grafted-muscle': { ...GRAFTED_MUSCLE_EFFECT, source: { ...GRAFTED_MUSCLE_EFFECT.source } }
};

export function countInstalls(ids: readonly string[], id: string): number {
  let n = 0;
  for (const x of ids) if (x === id) n++;
  return n;
}

/** Devuelve el STAT final: base + suma de n*perInstall de cada efecto de ese stat, sin pasar el max ni bajar del base. */
export function cyberwareStatBonus(ids: readonly string[], stat: 'BODY', base: number): number {
  let result = base;
  for (const [id, effect] of Object.entries(CYBERWARE_EFFECTS)) {
    if (effect.stat !== stat) continue;
    const n = countInstalls(ids, id);
    if (n <= 0 || result >= effect.max) continue;
    result = Math.min(effect.max, result + n * effect.perInstall);
  }
  return Math.max(base, result);
}

/** false solo si el id tiene efecto y el STAT final ya llegó al máximo. */
export function canInstallAnother(
  ids: readonly string[],
  id: string,
  base: Record<string, number>
): { ok: boolean; reason?: string } {
  const effect = CYBERWARE_EFFECTS[id];
  if (!effect) return { ok: true };
  const final = cyberwareStatBonus(ids, effect.stat, base[effect.stat] ?? 0);
  if (final >= effect.max) {
    return { ok: false, reason: `Tope ${effect.stat} ${effect.max} (Core p.${effect.source.page})` };
  }
  return { ok: true };
}
