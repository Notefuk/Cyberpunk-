// [Claude Code · 2026-11-12] v5.21.0 (plan 28): datos del panel MODO GM.
// Tarjeta de jugador a partir de su ficha completa (la que el GM ya tiene cargada) e iniciativa de todos.
import type { CharacterSheet } from '../types/cyberpunk';
import { calculateMaxHumanity, calculateMaxHp, calculateSeriouslyWoundedThreshold, getEffectiveBody } from './characterEngine';
import { woundStateForStabilization } from './medicalRules';
import { conditionById } from '../data/conditions';

export interface GmPlayerCard {
  charId: string;
  handle: string;
  role: string;
  roleRank: number;
  currentHp: number;
  maxHp: number;
  woundState: 'none' | 'light' | 'serious' | 'mortal';
  headSp: number; headSpMax: number;
  bodySp: number; bodySpMax: number;
  luck: number; luckMax: number;
  humanity: number; humanityMax: number;
  /** Arma en mano (o la primera equipada). Melee: mag null. */
  weapon: { name: string; mag: number | null; magMax: number | null; reserve: number | null } | null;
  conditions: string[];
  injuries: string[];
  eurodollars: number;
  /** v5.27.0 [Claude Code · 2026-11-12]: ACPA que pilotea (IR5 pp.133-142). */
  acpa?: { name: string; hp: number; maxHp: number; sp: number; maxSp: number; destroyed: boolean };
}

export function buildGmPlayerCard(sheet: CharacterSheet): GmPlayerCard {
  const maxHp = calculateMaxHp(getEffectiveBody(sheet), sheet.stats?.WILL ?? 6);
  const weapons = sheet.equippedWeapons ?? [];
  const w = weapons.find((x) => x.inHand) ?? weapons[0];
  const ranged = !!w && typeof w.standardMag === 'number' && w.standardMag > 0;
  return {
    charId: sheet.id,
    handle: sheet.handle ?? '',
    role: sheet.role ?? '',
    roleRank: sheet.roleRank ?? 0,
    currentHp: sheet.currentHp,
    maxHp,
    woundState: woundStateForStabilization(sheet.currentHp, maxHp, calculateSeriouslyWoundedThreshold(maxHp)),
    headSp: sheet.headArmor?.currentSp ?? 0,
    headSpMax: sheet.headArmor?.maxSp ?? 0,
    bodySp: sheet.bodyArmor?.currentSp ?? 0,
    bodySpMax: sheet.bodyArmor?.maxSp ?? 0,
    luck: sheet.currentLuck ?? 0,
    luckMax: sheet.stats?.LUCK ?? 0,
    humanity: sheet.currentHumanity ?? 0,
    // Core pp.79-80: Humanidad = EMP × 10 (el máximo sin ciberware).
    humanityMax: calculateMaxHumanity(sheet.stats?.EMP ?? 0),
    weapon: w
      ? { name: w.name, mag: ranged ? w.currentMag ?? 0 : null, magMax: ranged ? w.standardMag ?? null : null, reserve: ranged ? w.reserveAmmo ?? 0 : null }
      : null,
    conditions: (sheet.conditions ?? []).map((c) => conditionById(c.id)?.name ?? c.id),
    injuries: (sheet.activeInjuries ?? []).map((i) => i.name),
    eurodollars: sheet.eurodollars ?? 0,
    ...(sheet.acpaState?.isPiloting
      ? { acpa: { name: sheet.acpaState.name, hp: sheet.acpaState.hp, maxHp: sheet.acpaState.maxHp, sp: sheet.acpaState.sp, maxSp: sheet.acpaState.maxSp, destroyed: sheet.acpaState.hp <= 0 } }
      : {}),
  };
}

export interface InitiativeTarget {
  id: string;
  ref: number;
}

/** Core p.168: Iniciativa = REF + 1d10 (d10 simple, sin explosión). Devuelve el total de cada uno. */
export function rollInitiativeForAll(targets: InitiativeTarget[], rng: () => number = Math.random): Array<{ id: string; total: number }> {
  return targets.map((t) => ({ id: t.id, total: t.ref + Math.floor(rng() * 10) + 1 }));
}
