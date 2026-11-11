// [Claude Code · 2026-11-11] v5.19.0 (plan 27): forma común de las tablas de la pestaña del GM.
import type { RollableRow } from '../../engine/gmTables';

export interface GmRow extends RollableRow {
  text: string;
}

export interface GmTable {
  id: string;
  title: string;
  /** Dado del libro: "1d6", "1d10", "1d100"... */
  die: string;
  rows: GmRow[];
  /** Libro y página. */
  source: string;
}
