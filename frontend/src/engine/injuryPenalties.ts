// v5.9.1: resumen de los negativos de las Heridas Críticas activas, para recordarlos en la ficha y el HUD. [Claude Code · 2026-10-30]
// Tablas: Core p.187 (cuerpo) y p.188 (cabeza). Quick Fix quita el efecto por el resto del día; Treatment, para siempre (Core p.223).
// En la app, una herida con Quick Fix o tratada tiene `isTreated` y no cuenta.
import type { ActiveCriticalInjury, StatKey } from '../types/cyberpunk';

export interface InjuryPenaltyLine {
  /** Texto corto del negativo, ej. "−2 a todas las acciones". */
  text: string;
  /** Heridas que lo causan. */
  sources: string[];
}

export interface InjuryPenaltySummary {
  activeCount: number;
  allActions: number;
  lines: InjuryPenaltyLine[];
  /** Heridas activas cuyo efecto no es un número fijo (ej. Broken Jaw: −4 a lo que use el habla). */
  situational: { name: string; effect: string }[];
}

/** Saca el nombre corto: "Conmoción Cerebral (Concussion)" -> "Conmoción Cerebral". */
const shortName = (name: string) => name.replace(/\s*\([^)]*\)\s*$/, '').trim() || name;

export function summarizeInjuryPenalties(injuries: ActiveCriticalInjury[] | undefined): InjuryPenaltySummary {
  const active = (injuries ?? []).filter((i) => !i.isTreated);
  const buckets = new Map<string, { amount: number; sources: string[]; order: number }>();
  const add = (key: string, amount: number, source: string, order: number) => {
    if (!amount) return;
    const b = buckets.get(key) ?? { amount: 0, sources: [], order };
    b.amount += amount;
    b.sources.push(source);
    buckets.set(key, b);
  };
  const situational: { name: string; effect: string }[] = [];

  for (const inj of active) {
    const m = inj.modifiers ?? {};
    const name = shortName(inj.name);
    add('all', m.allActionsPenalty ?? 0, name, 0);
    add('ranged', m.rangedAttackPenalty ?? 0, name, 1);
    add('melee', m.meleeAttackPenalty ?? 0, name, 2);
    add('move', m.movePenalty ?? 0, name, 3);
    for (const [stat, v] of Object.entries(m.statPenalties ?? {})) add(`stat:${stat}`, v ?? 0, name, 4);
    add('dsp', m.bonusDeathSavePenalty ?? 0, name, 5);
    const hasNumbers = !!(m.allActionsPenalty || m.rangedAttackPenalty || m.meleeAttackPenalty || m.movePenalty || Object.keys(m.statPenalties ?? {}).length);
    if (!hasNumbers) situational.push({ name, effect: inj.effect });
  }

  const label = (key: string, amount: number): string => {
    if (key === 'all') return `−${amount} a todas las acciones`;
    if (key === 'ranged') return `−${amount} a ataques a distancia y a Perception con la vista`;
    if (key === 'melee') return `−${amount} a ataques cuerpo a cuerpo`;
    if (key === 'move') return `−${amount} a MOVE (mínimo 1)`;
    if (key === 'dsp') return `+${amount} al Death Save Penalty`;
    return `−${amount} a ${key.slice(5) as StatKey}`;
  };

  const lines = [...buckets.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, b]) => ({ text: label(key, b.amount), sources: b.sources }));

  return { activeCount: active.length, allActions: buckets.get('all')?.amount ?? 0, lines, situational };
}
