// Motor puro de cobertura. Core p.182. [Claude Code · 2026-11-20]
import { getCoverMaterial, type CoverMaterialId, type CoverThickness } from '../data/coverTable';

export interface CoverState {
  material: CoverMaterialId;
  thickness: CoverThickness;
  maxHp: number;
  hp: number;
  destroyed: boolean;
}

export interface CoverDamageResult {
  cover: CoverState;
  /** HP que realmente perdió la cobertura. */
  absorbed: number;
  /** Daño que sobró: se pierde, no pasa a quien está detrás (Core p.182). Los explosivos son la excepción (Core p.174) y los resuelve el GM. */
  lost: number;
}

/** HP de una sección de 2 m x 2 m (1 casilla). `null` si no es cobertura (Plaster/Foam/Plastic fino, Core p.182). */
export function coverMaxHp(material: CoverMaterialId, thickness: CoverThickness): number | null {
  const m = getCoverMaterial(material);
  const hp = thickness === 'thick' ? m.thickHp : m.thinHp;
  return hp > 0 ? hp : null;
}

export function createCover(material: CoverMaterialId, thickness: CoverThickness): CoverState | null {
  const maxHp = coverMaxHp(material, thickness);
  if (maxHp === null) return null;
  return { material, thickness, maxHp, hp: maxHp, destroyed: false };
}

/** Core p.182: a 0 HP la cobertura se destruye y el daño que sobra se pierde. */
export function applyCoverDamage(cover: CoverState, damage: number): CoverDamageResult {
  const dmg = Math.max(0, Math.floor(damage));
  if (cover.destroyed) return { cover, absorbed: 0, lost: dmg };
  const absorbed = Math.min(cover.hp, dmg);
  const hp = cover.hp - absorbed;
  return { cover: { ...cover, hp, destroyed: hp === 0 }, absorbed, lost: dmg - absorbed };
}

export function restoreCover(cover: CoverState): CoverState {
  return { ...cover, hp: cover.maxHp, destroyed: false };
}

/** Core p.182: el acero no recibe daño de Martial Arts ni Brawling, salvo con Cyberarm o BODY 10 o más. */
export function canDamageSteelUnarmed(hasCyberarm: boolean, body: number): boolean {
  return hasCyberarm || body >= 10;
}

export function isUnarmedBlockedBySteel(material: CoverMaterialId, hasCyberarm: boolean, body: number): boolean {
  return material === 'steel' && !canDamageSteelUnarmed(hasCyberarm, body);
}
