// Cola de escritura con debounce por documento. v5.0.0 (plan 17). [Claude Code · 2026-10-24]
import { debounce, type Debounced } from '../utils/debounce';

export interface WriteQueue {
  touch(docId: string): void;
  flushAll(): Promise<void>;
  pendingIds(): string[];
  setTiming(wait: number, maxWait: number): void;
  dispose(): void;
}

export function createWriteQueue(opts: {
  wait: number;
  maxWait: number;
  flush: (docId: string) => Promise<void>;
}): WriteQueue {
  let wait = opts.wait;
  let maxWait = opts.maxWait;
  let disposed = false;
  const debouncers = new Map<string, Debounced<[string]>>();
  const running = new Map<string, Promise<void>>();
  const rerun = new Set<string>();

  const run = (id: string): void => {
    if (running.has(id)) {
      rerun.add(id);
      return;
    }
    const p = (async () => {
      do {
        rerun.delete(id);
        try {
          await opts.flush(id);
        } catch {
          // el flush es responsable de reportar sus errores
        }
      } while (rerun.has(id) && !disposed);
    })().finally(() => {
      running.delete(id);
    });
    running.set(id, p);
  };

  return {
    touch(docId) {
      if (disposed) return;
      let d = debouncers.get(docId);
      if (!d) {
        d = debounce(run, wait, { maxWait });
        debouncers.set(docId, d);
      }
      d(docId);
    },
    async flushAll() {
      for (const d of debouncers.values()) if (d.pending()) d.flush();
      while (running.size > 0) {
        await Promise.all(Array.from(running.values()));
      }
    },
    pendingIds() {
      const ids = new Set<string>();
      for (const [id, d] of debouncers) if (d.pending()) ids.add(id);
      for (const id of running.keys()) ids.add(id);
      for (const id of rerun) ids.add(id);
      return Array.from(ids);
    },
    setTiming(w, mw) {
      wait = w;
      maxWait = mw;
      // Los debouncers sin trabajo pendiente se recrean con el tiempo nuevo.
      for (const [id, d] of Array.from(debouncers)) {
        if (!d.pending()) debouncers.delete(id);
      }
    },
    dispose() {
      disposed = true;
      for (const d of debouncers.values()) d.cancel();
      debouncers.clear();
      rerun.clear();
    },
  };
}
