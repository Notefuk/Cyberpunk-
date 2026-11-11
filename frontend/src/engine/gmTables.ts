// [Claude Code · 2026-11-11] v5.19.0 (plan 27): tiradas en las tablas de la pestaña del GM (Interface RED y DLC).
// Funciones puras con rng inyectable, como engine/nightMarket.ts.
import type { Rng } from './nightMarket';

export interface RollableRow {
  /** Como figura en el libro: "1", "2-3", "01-05", "00" o "100". */
  roll: string;
}

export interface DieSpec {
  count: number;
  sides: number;
}

/** "1d6", "2d6", "1d100", "d10"... Devuelve null si no es una tirada. */
export function parseDie(spec: string): DieSpec | null {
  const m = /^\s*(\d*)\s*d\s*(\d+)\s*$/i.exec(spec || '');
  if (!m) return null;
  return { count: m[1] ? Number(m[1]) : 1, sides: Number(m[2]) };
}

/** Rango que cubre una fila: "2-3" → [2,3], "00" → [100,100] (en d100, 00 es 100). */
export function rowRange(roll: string, sides: number): [number, number] | null {
  const parts = roll.replace(/[–—]/g, '-').split('-').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return null;
  const toNum = (p: string): number | null => {
    if (!/^\d+\+?$/.test(p)) return null;
    const n = Number(p.replace('+', ''));
    return sides === 100 && n === 0 ? 100 : n;
  };
  const a = toNum(parts[0]);
  if (a === null) return null;
  if (parts.length === 1) return parts[0].endsWith('+') ? [a, Number.MAX_SAFE_INTEGER] : [a, a];
  const b = toNum(parts[1]);
  return b === null ? null : [a, b];
}

export function rollDice(d: DieSpec, rng: Rng = Math.random): number {
  let total = 0;
  for (let i = 0; i < d.count; i++) total += Math.floor(rng() * d.sides) + 1;
  return total;
}

/** La fila que corresponde a un resultado, o null si ninguna lo cubre. */
export function rowFor<T extends RollableRow>(rows: T[], result: number, sides: number): T | null {
  return rows.find((r) => {
    const range = rowRange(r.roll, sides);
    return range !== null && result >= range[0] && result <= range[1];
  }) ?? null;
}

export interface TableRoll<T> {
  result: number;
  row: T | null;
}

/** Tira el dado de la tabla y devuelve el resultado y su fila. */
export function rollOnTable<T extends RollableRow>(rows: T[], die: string, rng: Rng = Math.random): TableRoll<T> | null {
  const d = parseDie(die);
  if (!d) return null;
  const result = rollDice(d, rng);
  return { result, row: rowFor(rows, result, d.sides) };
}

/** true si las filas cubren todos los resultados posibles del dado, sin huecos ni solapes. */
export function tableCoversDie(rows: RollableRow[], die: string): boolean {
  const d = parseDie(die);
  if (!d) return false;
  const min = d.count;
  const max = d.count * d.sides;
  for (let v = min; v <= max; v++) {
    const hits = rows.filter((r) => {
      const range = rowRange(r.roll, d.sides);
      return range !== null && v >= range[0] && v <= range[1];
    }).length;
    if (hits !== 1) return false;
  }
  return true;
}
