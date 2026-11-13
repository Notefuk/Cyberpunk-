// [Claude Code · 2026-11-13] v5.34.0 (plan 31): presupuesto operativo de las misiones mercenarias (Interface RED Vol. 5 p.108).
// La plata del empleador para equiparse: lo que se compra con ella no queda después de la misión y lo que sobra se pierde.
import type { OperationalBudget } from '../types/cyberpunk';

export function opBudgetSpent(b: Pick<OperationalBudget, 'purchases'>): number {
  return b.purchases.reduce((s, p) => s + p.cost, 0);
}

export function opBudgetLeft(b: Pick<OperationalBudget, 'total' | 'purchases'>): number {
  return Math.max(0, b.total - opBudgetSpent(b));
}

/** Parámetros de misión (p.108): presupuesto y pago por persona, en eb. "10,0000" del libro se lee 10,000 (errata). */
export const MISSION_PARAMETERS: { id: string; label: string; budget: [number, number]; pay: [number, number] }[] = [
  { id: 'easy', label: '"Easy" Mission', budget: [1000, 5000], pay: [3000, 4000] },
  { id: 'typical', label: 'Typical Mission', budget: [2000, 7000], pay: [4000, 7000] },
  { id: 'dangerous', label: 'Dangerous Mission', budget: [10000, 30000], pay: [6000, 9000] },
];

/** Presupuestos de las 2 misiones del libro (pp.144, 146). */
export const BOOK_MISSION_BUDGETS: { mission: string; total: number; page: number }[] = [
  { mission: 'Georgia On My Mind', total: 5000, page: 144 },
  { mission: 'Trouble in Tanzania', total: 25000, page: 146 },
];
