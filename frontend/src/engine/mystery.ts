// [Claude Code · 2026-11-13] v5.32.0 (plan 31): Focus y misterios, "Did Someone Say Murder?" (Interface RED Vol. 5 pp.61-70). Lógica pura.
import { CLUE_TYPES, SAMPLE_MYSTERIES, type MysteryTemplate } from '../data/mysteryData';
import { parseDie, rollDice } from './gmTables';
import type { Rng } from './nightMarket';

/** Focus máximo: 10 + 5 × ceil((INT + WILL) / 2) (p.63). */
export function maxFocus(int: number, will: number): number {
  return 10 + 5 * Math.ceil((int + will) / 2);
}

/** Focus actual de una ficha; sin el campo, está lleno. */
export function currentFocus(sheet: { focus?: number; stats: { INT: number; WILL: number } }): number {
  const max = maxFocus(sheet.stats.INT, sheet.stats.WILL);
  return Math.max(0, Math.min(max, sheet.focus ?? max));
}

/** Recuperación por descanso: INT + WILL, +5 con Concentration DV15 (p.63). */
export function focusRecovery(int: number, will: number, concentrationOk: boolean): number {
  return int + will + (concentrationOk ? 5 : 0);
}

export const roll = (spec: string, rng: Rng = Math.random): number => {
  const d = parseDie(spec);
  return d ? rollDice(d, rng) : 0;
};

export interface MysteryClue {
  id: string;
  type: string;
  skill: string;
  dv: number;
  damage: string;
  obfuscation: number;
  focusDamage: string;
  text: string;
  /** Qué pasa con una pifia (si el tipo de pista lo dice). */
  fumble?: string;
  collected?: boolean;
}

export interface MysteryObstacle {
  id: string;
  type: string;
  text: string;
  resolved?: boolean;
}

/** Misterio del tracker del GM (se guarda en campaigns/{c}/gm/mysteries o en este navegador). */
export interface Mystery {
  id: string;
  title: string;
  goal: string;
  complexityMax: number;
  complexity: number;
  clues: MysteryClue[];
  obstacles: MysteryObstacle[];
  /** Plazo del Ticking Clock, texto libre. */
  clock?: string;
  log: string[];
}

export const MYSTERY_LIMITS = { mysteries: 30, clues: 40, obstacles: 20, log: 40, text: 500 } as const;

const uid = () => Math.random().toString(36).slice(2, 9);

export function newMystery(title: string, goal: string, complexity: number): Mystery {
  return { id: `m-${uid()}`, title, goal, complexityMax: complexity, complexity, clues: [], obstacles: [], log: [] };
}

export function mysteryFromTemplate(t: MysteryTemplate): Mystery {
  return {
    ...newMystery(t.title, t.goal, t.complexity),
    // La pifia sale del tipo de pista de la tabla de la p.65 (los ejemplos de pp.69-70 no la repiten).
    clues: t.clues.map((c) => ({ ...c, id: `c-${uid()}`, fumble: CLUE_TYPES.find((x) => x.label === c.type)?.fumble })),
    obstacles: t.obstacles.map((o) => ({ ...o, id: `o-${uid()}` })),
  };
}

export const SAMPLE_MYSTERY_IDS = SAMPLE_MYSTERIES.map((m) => m.id);

export interface EvidenceResult {
  success: boolean;
  fumble: boolean;
  /** Daño a la Complexity, ya sin la Obfuscation. */
  complexityDamage: number;
  rolledDamage: number;
  /** Focus que pierde quien tiró (solo si falla). */
  focusDamage: number;
  text: string;
}

/**
 * Evidence Check (pp.64-66): total contra la DV. Si sale, daño de la pista menos la Obfuscation a la Complexity.
 * Si falla, daño de Focus; con 1 natural y falla es pifia.
 */
export function evidenceCheck(clue: MysteryClue, total: number, naturalD10: number, rng: Rng = Math.random): EvidenceResult {
  if (total >= clue.dv) {
    const rolledDamage = roll(clue.damage, rng);
    const complexityDamage = Math.max(0, rolledDamage - clue.obfuscation);
    return {
      success: true,
      fumble: false,
      complexityDamage,
      rolledDamage,
      focusDamage: 0,
      text: `${clue.type}: ${total} contra DV${clue.dv}, pista cobrada. ${clue.damage} = ${rolledDamage} − Obfuscation ${clue.obfuscation} = ${complexityDamage} a la Complexity.`,
    };
  }
  const fumble = naturalD10 === 1;
  const focusDamage = roll(clue.focusDamage, rng);
  return {
    success: false,
    fumble,
    complexityDamage: 0,
    rolledDamage: 0,
    focusDamage,
    text: `${clue.type}: ${total} contra DV${clue.dv}, falló. ${clue.focusDamage} = ${focusDamage} de Focus.${fumble ? ` Pifia${clue.fumble ? `: ${clue.fumble}` : ': puede haber una complicación.'}` : ''}`,
  };
}

/** Aplica un resultado al misterio: baja la Complexity (mínimo 0), marca la pista y anota en el log. */
export function applyEvidence(m: Mystery, clueId: string, r: EvidenceResult, who: string): Mystery {
  const log = [`${who} · ${r.text}`, ...m.log].slice(0, MYSTERY_LIMITS.log);
  if (!r.success) return { ...m, log };
  return {
    ...m,
    complexity: Math.max(0, m.complexity - r.complexityDamage),
    clues: m.clues.map((c) => (c.id === clueId ? { ...c, collected: true } : c)),
    log,
  };
}

/** Obstáculo superado: 1d6 de Focus; fallado: 2d6 (p.66). */
export function obstacleFocusDamage(overcome: boolean, rng: Rng = Math.random): number {
  return roll(overcome ? '1d6' : '2d6', rng);
}

/** Deducción DV15 para saber dónde buscar: siempre cuesta 1d6 de Focus (p.66). */
export function deductionCheck(total: number, rng: Rng = Math.random): { success: boolean; focusDamage: number } {
  return { success: total >= 15, focusDamage: roll('1d6', rng) };
}

/** Lista guardada → misterios válidos (lo que baja de la nube o del navegador). */
export function parseMysteries(v: unknown): Mystery[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((m): m is Mystery => !!m && typeof m === 'object' && typeof (m as Mystery).id === 'string' && Array.isArray((m as Mystery).clues))
    .slice(0, MYSTERY_LIMITS.mysteries)
    .map((m) => ({ ...m, obstacles: Array.isArray(m.obstacles) ? m.obstacles : [], log: Array.isArray(m.log) ? m.log : [] }));
}
