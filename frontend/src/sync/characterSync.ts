// Motor de sincronización de fichas (lógica pura, puertos inyectados). v5.0.0 (plan 16/17). [Claude Code · 2026-10-24]
import type { CharacterSheet } from '../types/cyberpunk';
import { applyChanges, deepEqual, diffDocs, mergeRemote, type Change } from './diff';
import { COUNTER_PATHS, LOG_FIELDS, fromSheetDoc, toSheetDoc, type LogField } from './sheetDoc';
import { createWriteQueue } from './writeQueue';
import type { createQuotaGuard } from './quotaGuard';

export interface WriterMeta { writerId: string } // uid + '_' + deviceId

export interface SyncAdapter {
  updateDoc(docId: string, changes: Change[], meta: WriterMeta): Promise<void>;
  createLogEntry(docId: string, field: LogField, entry: { id: string } & Record<string, unknown>, meta: WriterMeta): Promise<void>;
  subscribeDoc(docId: string, cb: (data: Record<string, unknown> | null, info: { hasPendingWrites: boolean }) => void): () => void;
}

export interface LocalBridge {
  getSheet(id: string): CharacterSheet | undefined;
  applyRemoteSheet(id: string, sheet: CharacterSheet): void;
}

export interface CharacterSyncOptions {
  adapter: SyncAdapter;
  bridge: LocalBridge;
  writer: WriterMeta;
  wait?: number;
  maxWait?: number;
  quota?: ReturnType<typeof createQuotaGuard>;
  onError?: (docId: string, err: unknown) => void;
}

interface TrackState {
  base: Record<string, unknown> | undefined;
  known: Record<LogField, Set<string>>;
  unsubscribe: () => void;
  failures: number;
  retryTimer: ReturnType<typeof setTimeout> | null;
}

const DEFAULT_TIMING = { wait: 1500, maxWait: 5000 };
const SAVING_TIMING = { wait: 5000, maxWait: 10000 };

export function createCharacterSync(opts: CharacterSyncOptions) {
  const { adapter, bridge, writer, quota, onError } = opts;
  const normalTiming = { wait: opts.wait ?? DEFAULT_TIMING.wait, maxWait: opts.maxWait ?? DEFAULT_TIMING.maxWait };
  const states = new Map<string, TrackState>();
  const stats = { writes: 0, logWrites: 0, remoteApplied: 0 };
  let currentTiming: 'normal' | 'saving' = 'normal';
  let disposed = false;

  const logIds = (sheet: CharacterSheet, field: LogField): string[] => {
    const arr = (sheet as unknown as Record<string, unknown>)[field];
    return Array.isArray(arr) ? (arr as { id: string }[]).map(e => e.id) : [];
  };

  const scheduleRetry = (id: string, st: TrackState): void => {
    if (st.retryTimer !== null || disposed) return;
    const delay = Math.min(1000 * 2 ** st.failures, 30000);
    st.failures += 1;
    st.retryTimer = setTimeout(() => {
      st.retryTimer = null;
      queue.touch(id);
    }, delay);
  };

  const flush = async (id: string): Promise<void> => {
    const st = states.get(id);
    if (!st || !st.base) return;
    const sheet = bridge.getSheet(id);
    if (!sheet) return;
    const local = toSheetDoc(sheet);
    try {
      for (const field of LOG_FIELDS) {
        const arr = (sheet as unknown as Record<string, unknown>)[field];
        if (!Array.isArray(arr)) continue;
        for (const entry of arr as ({ id: string } & Record<string, unknown>)[]) {
          if (st.known[field].has(entry.id)) continue;
          await adapter.createLogEntry(id, field, entry, writer);
          st.known[field].add(entry.id);
          stats.logWrites += 1;
          quota?.record('write', 1);
        }
      }
      const base = st.base;
      if (!base) return;
      const changes = diffDocs(base, local, COUNTER_PATHS);
      if (changes.length > 0) {
        // La base se adelanta ANTES de esperar la confirmación. En Firestore, un snapshot sin escrituras
        // pendientes ya incluye la nuestra: si llegara antes de que resuelva updateDoc y la base fuera la
        // vieja, mergeRemote volvería a aplicar el increment y el daño contaría dos veces.
        // [Claude Code · 2026-10-24]
        const optimistic = applyChanges(base, changes);
        st.base = optimistic;
        try {
          await adapter.updateDoc(id, changes, writer);
        } catch (err) {
          // Falló: si ningún snapshot reemplazó la base mientras tanto, se vuelve a la anterior para que
          // el reintento recalcule el diff completo.
          if (st.base === optimistic) st.base = base;
          throw err;
        }
        stats.writes += 1;
        quota?.record('write', 1);
      }
      st.failures = 0;
    } catch (err) {
      onError?.(id, err);
      scheduleRetry(id, st);
    }
  };

  const queue = createWriteQueue({ wait: normalTiming.wait, maxWait: normalTiming.maxWait, flush });

  const applyRemote = (id: string, remote: Record<string, unknown>, sheet: CharacterSheet | undefined, merged: Record<string, unknown>): void => {
    const s = sheet as unknown as Record<string, unknown> | undefined;
    const full = { ...merged, ipLog: s?.ipLog, transactions: s?.transactions } as unknown as CharacterSheet;
    void remote;
    bridge.applyRemoteSheet(id, full);
    stats.remoteApplied += 1;
  };

  const onSnapshot = (id: string, data: Record<string, unknown> | null, info: { hasPendingWrites: boolean }): void => {
    const st = states.get(id);
    if (!st || info.hasPendingWrites || data === null) return;
    quota?.record('read', 1);
    const remote = fromSheetDoc(data);
    const sheet = bridge.getSheet(id);
    if (st.base === undefined) {
      st.base = remote;
      if (!sheet || !deepEqual(toSheetDoc(sheet), remote)) applyRemote(id, remote, sheet, remote);
      return;
    }
    if (!sheet) {
      st.base = remote;
      applyRemote(id, remote, sheet, remote);
      return;
    }
    const local = toSheetDoc(sheet);
    const merged = mergeRemote(st.base, local, remote, COUNTER_PATHS);
    st.base = remote;
    if (!deepEqual(merged, local)) applyRemote(id, remote, sheet, merged);
  };

  return {
    track(id: string, initialRemote?: Record<string, unknown> | null): void {
      if (states.has(id) || disposed) return;
      const st: TrackState = {
        base: initialRemote ? fromSheetDoc(initialRemote) : undefined,
        known: { ipLog: new Set<string>(), transactions: new Set<string>() },
        unsubscribe: () => {},
        failures: 0,
        retryTimer: null,
      };
      if (initialRemote) {
        const sheet = bridge.getSheet(id);
        if (sheet) for (const f of LOG_FIELDS) for (const lid of logIds(sheet, f)) st.known[f].add(lid);
      }
      states.set(id, st);
      st.unsubscribe = adapter.subscribeDoc(id, (data, info) => onSnapshot(id, data, info));
    },
    async untrack(id: string): Promise<void> {
      const st = states.get(id);
      if (!st) return;
      await queue.flushAll();
      if (st.retryTimer !== null) clearTimeout(st.retryTimer);
      st.unsubscribe();
      states.delete(id);
    },
    onLocalChange(id: string): void {
      if (!states.has(id)) return;
      if (quota) {
        const want = quota.mode() === 'normal' ? 'normal' : 'saving';
        if (want !== currentTiming) {
          currentTiming = want;
          if (want === 'saving') queue.setTiming(SAVING_TIMING.wait, SAVING_TIMING.maxWait);
          else queue.setTiming(normalTiming.wait, normalTiming.maxWait);
        }
      }
      queue.touch(id);
    },
    markLogsKnown(id: string, field: LogField, ids: string[]): void {
      const st = states.get(id);
      if (!st) return;
      for (const lid of ids) st.known[field].add(lid);
    },
    flushAll(): Promise<void> {
      return queue.flushAll();
    },
    async dispose(): Promise<void> {
      await queue.flushAll();
      disposed = true;
      for (const st of states.values()) {
        if (st.retryTimer !== null) clearTimeout(st.retryTimer);
        st.unsubscribe();
      }
      states.clear();
      queue.dispose();
    },
    stats(): { writes: number; logWrites: number; remoteApplied: number } {
      return { ...stats };
    },
  };
}
