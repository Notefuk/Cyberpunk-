// [Claude Code · 2026-11-12] v5.23.0 (plan 28): el GM le pide una tirada a un jugador.
// El jugador tira con su ficha: STAT + skill + 1d10, con la regla del 10 y el 1 (Core p.130, CEMK p.5) y la penalización
// por heridas (Core p.187: Seriously Wounded -2, Mortally Wounded -4 a todas las Acciones). Gana si supera el DV (CEMK p.5).
// Funciones puras; el guardado está en sync/rollRequests.ts.
import type { StatKey } from '../types/cyberpunk';
import { getSkillCatalog } from './characterCreation';
import { normalizeCanonSkillName } from '../data/characterCreationData';
import { sheetSkillLevel } from './skillLookup';
import { rollCheckD10, beatsDv } from './combatEngine';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold, getEffectiveBody } from './characterEngine';
import { woundStateForStabilization } from './medicalRules';
import type { CharacterSheet } from '../types/cyberpunk';

export const ROLL_REQUEST_KEEP = 20;
export const ROLL_REQUEST_NOTE_MAX = 200;
export const ROLL_REQUEST_DV_MAX = 60;

export interface RollRequestResult {
  total: number;
  /** El d10 ya con el 10 que explota o el 1 que resta (el valor que suma). */
  d10: number;
  stat: string;
  statVal: number;
  skillVal: number;
  /** Penalización por heridas (0, -2 o -4). */
  penalty: number;
}

export interface RollRequest {
  id: string;
  _by: string;
  targetCharId: string;
  targetUid: string;
  targetHandle: string;
  skill: string;
  dv: number;
  note: string;
  status: 'pending' | 'done';
  result?: RollRequestResult;
  /** Milisegundos (al leer). */
  at?: number;
}

/** STAT de una skill del Core (pp.81-85). null si no está en la lista. */
export function skillStat(skill: string): StatKey | null {
  const n = normalizeCanonSkillName(skill);
  return getSkillCatalog().find((s) => normalizeCanonSkillName(s.name) === n)?.stat ?? null;
}

/** Nombres de las skills del Core, para el selector del GM. */
export function requestableSkills(): string[] {
  return getSkillCatalog().map((s) => s.name).sort((a, b) => a.localeCompare(b));
}

/** Core p.187: -2 con Seriously Wounded, -4 con Mortally Wounded. */
export function woundActionPenalty(currentHp: number, maxHp: number): number {
  const state = woundStateForStabilization(currentHp, maxHp, calculateSeriouslyWoundedThreshold(maxHp));
  if (state === 'mortal') return -4;
  if (state === 'serious') return -2;
  return 0;
}

/** Tira el pedido con la ficha del jugador. */
export function resolveRollRequest(sheet: CharacterSheet, skill: string, rng: () => number = Math.random): RollRequestResult {
  const stat = skillStat(skill) ?? 'INT';
  const statVal = sheet.stats?.[stat] ?? 0;
  const skillVal = sheetSkillLevel(sheet, skill);
  const maxHp = calculateMaxHp(getEffectiveBody(sheet), sheet.stats?.WILL ?? 0);
  const penalty = woundActionPenalty(sheet.currentHp, maxHp);
  const d10 = rollCheckD10(rng).value;
  return { total: statVal + skillVal + d10 + penalty, d10, stat, statVal, skillVal, penalty };
}

export function requestSucceeded(r: RollRequest): boolean | null {
  return r.result ? beatsDv(r.result.total, r.dv) : null;
}

/** "INT 6 + Perception 5 + d10 7 − 2 heridas = 16 vs DV 15: supera". */
export function describeResult(r: RollRequest): string {
  if (!r.result) return 'pendiente';
  const x = r.result;
  const parts = [`${x.stat} ${x.statVal}`, `${r.skill} ${x.skillVal}`, `d10 ${x.d10}`];
  if (x.penalty) parts.push(`heridas ${x.penalty}`);
  return `${parts.join(' + ')} = ${x.total} vs DV ${r.dv}: ${beatsDv(x.total, r.dv) ? 'supera' : 'falla'}`;
}

export function newRollRequest(
  input: { targetCharId: string; targetUid: string; targetHandle: string; skill: string; dv: number; note?: string },
  by: string,
): RollRequest {
  return {
    id: `rr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    _by: by,
    targetCharId: input.targetCharId,
    targetUid: input.targetUid,
    targetHandle: input.targetHandle.slice(0, 60),
    skill: input.skill.slice(0, 60),
    dv: Math.max(0, Math.min(ROLL_REQUEST_DV_MAX, Math.round(input.dv))),
    note: (input.note ?? '').slice(0, ROLL_REQUEST_NOTE_MAX),
    status: 'pending',
  };
}

export function parseRollRequest(data: Record<string, unknown> | null | undefined): RollRequest | null {
  if (!data || typeof data.id !== 'string' || typeof data.skill !== 'string' || typeof data.targetCharId !== 'string') return null;
  const out: RollRequest = {
    id: data.id,
    _by: String(data._by ?? ''),
    targetCharId: data.targetCharId,
    targetUid: String(data.targetUid ?? ''),
    targetHandle: String(data.targetHandle ?? ''),
    skill: data.skill,
    dv: typeof data.dv === 'number' ? data.dv : 0,
    note: typeof data.note === 'string' ? data.note : '',
    status: data.status === 'done' ? 'done' : 'pending',
  };
  const r = data.result as Record<string, unknown> | undefined;
  if (r && typeof r.total === 'number') {
    out.result = {
      total: r.total,
      d10: typeof r.d10 === 'number' ? r.d10 : 0,
      stat: String(r.stat ?? ''),
      statVal: typeof r.statVal === 'number' ? r.statVal : 0,
      skillVal: typeof r.skillVal === 'number' ? r.skillVal : 0,
      penalty: typeof r.penalty === 'number' ? r.penalty : 0,
    };
  }
  if (typeof data.at === 'number') out.at = data.at;
  return out;
}

/** El más nuevo primero. */
export function sortRequests(list: RollRequest[]): RollRequest[] {
  return [...list].sort((a, b) => (b.at ?? Number.MAX_SAFE_INTEGER) - (a.at ?? Number.MAX_SAFE_INTEGER));
}
