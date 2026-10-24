// Conversión ficha <-> documento de Firestore. v5.0.0 (plan 16/17). [Claude Code · 2026-10-24]
// Lógica pura: sin importar firebase.
import type { CharacterSheet } from '../types/cyberpunk';

/** Logs que viven en subcolecciones de solo creación, no dentro del documento de la ficha. */
export const LOG_FIELDS = ['ipLog', 'transactions'] as const;
export type LogField = typeof LOG_FIELDS[number];

/** Campos de metadatos del documento que no pertenecen a la ficha. */
export const META_FIELDS = ['ownerUid', 'campaignIds', 'schemaVersion', '_w', '_ts'] as const;

// Se mandan como increment(delta) para que el GM y el jugador no se pisen;
// la munición vive en un array y va entera.
export const COUNTER_PATHS: string[][] = [
  ['currentHp'],
  ['currentLuck'],
  ['currentHumanity'],
  ['eurodollars'],
  ['improvementPoints'],
  ['deathSavePenalty'],
  ['headArmor', 'currentSp'],
  ['bodyArmor', 'currentSp'],
];

function isPlain(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function cleanCopy(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(cleanCopy);
  if (isPlain(v)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v)) {
      if (v[k] === undefined) continue;
      out[k] = cleanCopy(v[k]);
    }
    return out;
  }
  return v;
}

export function toSheetDoc(sheet: CharacterSheet): Record<string, unknown> {
  const out = cleanCopy(sheet) as Record<string, unknown>;
  for (const f of LOG_FIELDS) delete out[f];
  return out;
}

export function fromSheetDoc(data: Record<string, unknown>): Record<string, unknown> {
  const out = cleanCopy(data) as Record<string, unknown>;
  for (const f of META_FIELDS) delete out[f];
  return out;
}
