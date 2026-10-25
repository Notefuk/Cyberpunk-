// Diff / merge de 3 vías entre documentos. v5.0.0 (plan 16/17). [Claude Code · 2026-10-24]
export type Path = string[];
export type Change =
  | { kind: 'set'; path: Path; value: unknown }
  | { kind: 'delete'; path: Path }
  | { kind: 'increment'; path: Path; delta: number };

function isPlain(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function clone<T>(v: T): T {
  if (Array.isArray(v)) return v.map(clone) as unknown as T;
  if (isPlain(v)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v)) out[k] = clone(v[k]);
    return out as T;
  }
  return v;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (isPlain(a) && isPlain(b)) {
    const ka = Object.keys(a).filter(k => a[k] !== undefined);
    const kb = Object.keys(b).filter(k => b[k] !== undefined);
    if (ka.length !== kb.length) return false;
    for (const k of ka) {
      if (b[k] === undefined || !deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

const SEP = '\u0000';

function diffInto(
  base: Record<string, unknown>,
  next: Record<string, unknown>,
  prefix: Path,
  counters: Set<string>,
  out: Change[]
): void {
  const keys = Array.from(new Set([...Object.keys(base), ...Object.keys(next)])).sort();
  for (const k of keys) {
    const b = base[k];
    const n = next[k];
    const path = [...prefix, k];
    if (b === undefined && n === undefined) continue;
    if (n === undefined) {
      out.push({ kind: 'delete', path });
    } else if (b === undefined) {
      out.push({ kind: 'set', path, value: clone(n) });
    } else if (counters.has(path.join(SEP)) && typeof b === 'number' && typeof n === 'number' && Number.isFinite(b) && Number.isFinite(n)) {
      const delta = n - b;
      if (delta !== 0) out.push({ kind: 'increment', path, delta });
    } else if (isPlain(b) && isPlain(n)) {
      diffInto(b, n, path, counters, out);
    } else if (!deepEqual(b, n)) {
      out.push({ kind: 'set', path, value: clone(n) });
    }
  }
}

export function diffDocs(
  base: Record<string, unknown>,
  next: Record<string, unknown>,
  counterPaths: Path[] = []
): Change[] {
  const out: Change[] = [];
  diffInto(base, next, [], new Set(counterPaths.map(p => p.join(SEP))), out);
  return out;
}

export function applyChanges(doc: Record<string, unknown>, changes: Change[]): Record<string, unknown> {
  const result = clone(doc);
  for (const ch of changes) {
    const parents = ch.path.slice(0, -1);
    const last = ch.path[ch.path.length - 1];
    let cur: Record<string, unknown> = result;
    let missing = false;
    for (const seg of parents) {
      const nxt = cur[seg];
      if (isPlain(nxt)) {
        cur = nxt;
      } else if (ch.kind === 'delete') {
        missing = true;
        break;
      } else {
        const created: Record<string, unknown> = {};
        cur[seg] = created;
        cur = created;
      }
    }
    if (missing) continue;
    if (ch.kind === 'set') {
      cur[last] = clone(ch.value);
    } else if (ch.kind === 'delete') {
      delete cur[last];
    } else {
      const prev = typeof cur[last] === 'number' ? (cur[last] as number) : 0;
      cur[last] = prev + ch.delta;
    }
  }
  return result;
}

/** Merge de 3 vías: las ediciones locales pendientes se reaplican sobre la versión remota. */
export function mergeRemote(
  oldBase: Record<string, unknown>,
  local: Record<string, unknown>,
  remote: Record<string, unknown>,
  counterPaths: Path[] = []
): Record<string, unknown> {
  return applyChanges(remote, diffDocs(oldBase, local, counterPaths));
}
