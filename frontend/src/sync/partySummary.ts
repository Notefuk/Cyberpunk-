// [Claude Code · 2026-10-24] v5.0.0 (plan 18): resumen público de una ficha para la party (lo ven los demás miembros).
import type { CharacterSheet } from '../types/cyberpunk';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold, getEffectiveBody } from '../engine/characterEngine';
import { woundStateForStabilization } from '../engine/medicalRules';

export interface PartySummary {
  ownerUid: string;
  ownerName: string;
  handle: string;
  role: string;
  currentHp: number;
  maxHp: number;
  woundState: 'none' | 'light' | 'serious' | 'mortal';
  headSp: number; headSpMax: number;
  bodySp: number; bodySpMax: number;
  injuries: string[]; // nombres de activeInjuries
  /** v5.27.0 [Claude Code · 2026-11-12]: la ACPA que está piloteando (IR5 pp.133-142). */
  acpa?: { name: string; hp: number; maxHp: number; sp: number; maxSp: number };
}

export function buildPartySummary(sheet: CharacterSheet, ownerUid: string, ownerName: string): PartySummary {
  const maxHp = calculateMaxHp(getEffectiveBody(sheet), sheet.stats?.WILL ?? 6);
  const woundState = woundStateForStabilization(sheet.currentHp, maxHp, calculateSeriouslyWoundedThreshold(maxHp));
  return {
    ownerUid,
    ownerName,
    handle: sheet.handle ?? '',
    role: sheet.role ?? '',
    currentHp: sheet.currentHp,
    maxHp,
    woundState,
    headSp: sheet.headArmor?.currentSp ?? 0,
    headSpMax: sheet.headArmor?.maxSp ?? 0,
    bodySp: sheet.bodyArmor?.currentSp ?? 0,
    bodySpMax: sheet.bodyArmor?.maxSp ?? 0,
    injuries: (sheet.activeInjuries ?? []).map((i) => i.name),
    ...(sheet.acpaState?.isPiloting
      ? { acpa: { name: sheet.acpaState.name, hp: sheet.acpaState.hp, maxHp: sheet.acpaState.maxHp, sp: sheet.acpaState.sp, maxSp: sheet.acpaState.maxSp } }
      : {}),
  };
}

export function sameSummary(a: PartySummary | null | undefined, b: PartySummary | null | undefined): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (
    a.ownerUid !== b.ownerUid || a.ownerName !== b.ownerName || a.handle !== b.handle || a.role !== b.role ||
    a.currentHp !== b.currentHp || a.maxHp !== b.maxHp || a.woundState !== b.woundState ||
    a.headSp !== b.headSp || a.headSpMax !== b.headSpMax || a.bodySp !== b.bodySp || a.bodySpMax !== b.bodySpMax
  ) return false;
  const acpaKey = (s: PartySummary) => (s.acpa ? `${s.acpa.name}|${s.acpa.hp}|${s.acpa.maxHp}|${s.acpa.sp}|${s.acpa.maxSp}` : '');
  if (acpaKey(a) !== acpaKey(b)) return false;
  if (a.injuries.length !== b.injuries.length) return false;
  return a.injuries.every((n, i) => n === b.injuries[i]);
}

const WOUND_STATES = ['none', 'light', 'serious', 'mortal'] as const;

function parseAcpa(v: unknown): Pick<PartySummary, 'acpa'> {
  if (!v || typeof v !== 'object') return {};
  const o = v as Record<string, unknown>;
  if (typeof o.name !== 'string' || typeof o.hp !== 'number' || typeof o.sp !== 'number') return {};
  const n = (x: unknown) => (typeof x === 'number' ? x : 0);
  return { acpa: { name: o.name, hp: o.hp, maxHp: n(o.maxHp), sp: o.sp, maxSp: n(o.maxSp) } };
}

export function parsePartySummary(data: Record<string, unknown>): PartySummary | null {
  if (typeof data.ownerUid !== 'string' || typeof data.handle !== 'string') return null;
  if (typeof data.currentHp !== 'number' || typeof data.maxHp !== 'number') return null;
  const num = (v: unknown) => (typeof v === 'number' ? v : 0);
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const wound = WOUND_STATES.find((w) => w === data.woundState) ?? 'none';
  return {
    ownerUid: data.ownerUid,
    ownerName: str(data.ownerName),
    handle: data.handle,
    role: str(data.role),
    currentHp: data.currentHp,
    maxHp: data.maxHp,
    woundState: wound,
    headSp: num(data.headSp),
    headSpMax: num(data.headSpMax),
    bodySp: num(data.bodySp),
    bodySpMax: num(data.bodySpMax),
    injuries: Array.isArray(data.injuries) ? data.injuries.filter((x): x is string => typeof x === 'string') : [],
    ...parseAcpa(data.acpa),
  };
}
