// [Claude Code · 2026-11-10] v5.15.0: Humanidad de los cuerpos FBC (Going Metal pp.94-95).
import coreRulesPack from '../data/core-rules.cprpack.json';
import { FBC_13_BODIES, FBC_16_CYBERWARE, type FbcBody } from '../data/goingMetalFbcData';
import type { ActiveFbcState } from '../types/cyberpunk';

const BORGWARE_NAMES = new Set(
  [...(coreRulesPack.cyberware as { name: string; type?: string }[]), ...FBC_16_CYBERWARE]
    .filter((cw) => /^borgware/i.test(cw.type || ''))
    .map((cw) => cw.name.toLowerCase())
);

/** Separa "Cyberarm x2" en 2 piezas. */
export function expandPackagePieces(list: readonly string[]): string[] {
  const out: string[] = [];
  for (const raw of list) {
    const m = raw.match(/^(.*?)\s+x(\d+)$/);
    const name = m ? m[1] : raw;
    const n = m ? Number(m[2]) : 1;
    for (let i = 0; i < n; i++) out.push(name);
  }
  return out;
}

/**
 * Going Metal p.95 ("Cyberware (HL)"): cada pieza del paquete del cuerpo que causa HL baja el máximo
 * de Humanidad recuperable con terapia como el ciberware suelto (Core p.230): 2 por pieza, 4 si es borgware.
 * Las piezas "No HL" no cuentan (p.94).
 */
export function fbcPackageTherapyReduction(body: Pick<FbcBody, 'cyberwareHl'>): number {
  return expandPackagePieces(body.cyberwareHl).reduce(
    (sum, name) => sum + (BORGWARE_NAMES.has(name.toLowerCase()) ? 4 : 2),
    0
  );
}

export function findFbcBody(id: string | undefined): FbcBody | undefined {
  return id ? FBC_13_BODIES.find((b) => b.id === id) : undefined;
}

/** Lo que baja el tope de terapia el cuerpo que se habita ahora (0 si no está en un cuerpo FBC). */
export function activeFbcTherapyReduction(fbc: ActiveFbcState | undefined): number {
  if (!fbc?.isFullBodyConversion) return 0;
  const body = findFbcBody(fbc.activeChassisId);
  return body ? fbcPackageTherapyReduction(body) : 0;
}

/** Cuerpos que ya habitó (los guardados, o el último si la ficha es de antes de v5.15.0). */
export function inhabitedChassisIds(fbc: ActiveFbcState | undefined): string[] {
  if (!fbc) return [];
  if (fbc.inhabitedChassisIds?.length) return fbc.inhabitedChassisIds;
  return fbc.activeChassisId ? [fbc.activeChassisId] : [];
}

/** Going Metal p.94: volver a un cuerpo que ya habitó no cobra de nuevo la Humanidad del paquete. */
export function isReturningToBody(fbc: ActiveFbcState | undefined, chassisId: string): boolean {
  return inhabitedChassisIds(fbc).includes(chassisId);
}

/**
 * Going Metal p.94: al volver a un cuerpo ya habitado, si la Humanidad actual supera el máximo por
 * depresión en ese cuerpo, baja a ese máximo.
 */
export function humanityOnReturn(currentHumanity: number, maxHumanityInBody: number): number {
  return Math.min(currentHumanity, maxHumanityInBody);
}
