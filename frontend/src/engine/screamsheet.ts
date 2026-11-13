// [Claude Code · 2026-11-13] v5.30.0 (plan 31): generador de screamsheets, Interface RED Vol. 5 pp.83-96. Lógica pura.
// Paso 1: Tabla A (1d6) elige el tipo. Paso 2: 1d6 en intro, cuerpo y cierre. Paso 3: el titular sale entre los que
// permite el cierre. Paso 4: se completan los campos entre corchetes. Paso 5: se pule el texto (lo hace el GM).
import { SCREAMSHEET_BYLINES, SCREAMSHEET_KINDS, type ScreamsheetKind, type ScreamsheetKindId } from '../data/gmTables/screamsheet';
import { rollDie, type Rng } from './nightMarket';
import { rowRange } from './gmTables';

export interface RolledScreamsheet {
  kind: ScreamsheetKindId;
  typeRoll: number;
  introRoll: number;
  bodyRoll: number;
  conclusionRoll: number;
  headlineRoll: number;
  /** Índice en SCREAMSHEET_BYLINES, o null sin firma. */
  byline: number | null;
}

export function kindById(id: ScreamsheetKindId): ScreamsheetKind {
  return SCREAMSHEET_KINDS.find((k) => k.id === id)!;
}

/** Tabla A (1d6): qué tipo de nota sale. */
export function kindForRoll(roll: number): ScreamsheetKind {
  return SCREAMSHEET_KINDS.find((k) => {
    const r = rowRange(k.typeRoll, 6);
    return r !== null && roll >= r[0] && roll <= r[1];
  })!;
}

/** Titulares que permite el cierre: los números que da el libro, o los 6 si dice "Any". */
export function allowedHeadlines(kind: ScreamsheetKind, conclusionRoll: number): number[] {
  const c = kind.conclusion.find((x) => x.roll === conclusionRoll)!;
  return c.headlines === 'any' ? [1, 2, 3, 4, 5, 6] : c.headlines;
}

/** Elige un titular al azar entre los permitidos (el libro deja elegir; la app sortea y deja cambiarlo). */
export function rollHeadline(kind: ScreamsheetKind, conclusionRoll: number, rng: Rng = Math.random): number {
  const allowed = allowedHeadlines(kind, conclusionRoll);
  return allowed[Math.floor(rng() * allowed.length)];
}

export function rollScreamsheet(rng: Rng = Math.random, opts: { kind?: ScreamsheetKindId; withByline?: boolean } = {}): RolledScreamsheet {
  const typeRoll = rollDie(6, rng);
  const kind = opts.kind ? kindById(opts.kind) : kindForRoll(typeRoll);
  const introRoll = rollDie(6, rng);
  const bodyRoll = rollDie(6, rng);
  const conclusionRoll = rollDie(6, rng);
  const headlineRoll = rollHeadline(kind, conclusionRoll, rng);
  const byline = opts.withByline === false ? null : Math.floor(rng() * SCREAMSHEET_BYLINES.length);
  return { kind: kind.id, typeRoll, introRoll, bodyRoll, conclusionRoll, headlineRoll, byline };
}

const TOKEN_RE = /\[[^\]]+\]/g;

/** Los campos entre corchetes que aparecen en la nota, sin repetir y en orden de aparición. */
export function screamsheetTokens(texts: string[]): string[] {
  const seen: string[] = [];
  for (const t of texts) for (const m of t.match(TOKEN_RE) ?? []) if (!seen.includes(m)) seen.push(m);
  return seen;
}

/** Reemplaza cada campo por lo que escribió el GM; los vacíos quedan entre corchetes. */
export function fillTokens(text: string, values: Record<string, string>): string {
  return text.replace(TOKEN_RE, (m) => (values[m]?.trim() ? values[m].trim() : m));
}

export interface ScreamsheetText {
  headline: string;
  paragraphs: string[];
  byline: string | null;
}

export function screamsheetText(r: RolledScreamsheet, values: Record<string, string> = {}): ScreamsheetText {
  const k = kindById(r.kind);
  const line = (rows: { roll: number; text: string }[], roll: number) => rows.find((x) => x.roll === roll)!.text;
  const b = r.byline !== null ? SCREAMSHEET_BYLINES[r.byline] : null;
  return {
    headline: fillTokens(k.headlines.find((h) => h.roll === r.headlineRoll)!.text, values),
    paragraphs: [line(k.intro, r.introRoll), line(k.body, r.bodyRoll), line(k.conclusion, r.conclusionRoll)].map((t) => fillTokens(t, values)),
    byline: b ? `${b.name} (${b.beat})` : null,
  };
}

/** Todos los textos sin completar de una nota, para listar sus campos. */
export function rawTexts(r: RolledScreamsheet): string[] {
  const k = kindById(r.kind);
  return [
    k.headlines.find((h) => h.roll === r.headlineRoll)!.text,
    k.intro.find((x) => x.roll === r.introRoll)!.text,
    k.body.find((x) => x.roll === r.bodyRoll)!.text,
    k.conclusion.find((x) => x.roll === r.conclusionRoll)!.text,
  ];
}

/** Texto plano para copiar y dárselo a los jugadores. */
export function screamsheetPlain(t: ScreamsheetText): string {
  return [t.headline.toUpperCase(), '', ...t.paragraphs.flatMap((p) => [p, '']), t.byline ? `— ${t.byline}` : ''].join('\n').trim();
}
