// Firestore falso en memoria para tests del motor de sync. v5.0.0 (plan 16/17). [Claude Code · 2026-10-24]
import { applyChanges, type Change } from '../diff';
import type { SyncAdapter } from '../characterSync';
import type { LogField } from '../sheetDoc';

type Cb = (data: Record<string, unknown> | null, info: { hasPendingWrites: boolean }) => void;

export function createFakeFirestore() {
  const docs = new Map<string, Record<string, unknown>>();
  const logs = new Map<string, unknown[]>();
  const subs = new Map<string, { client: string; cb: Cb }[]>();
  const ops = { updates: 0, logCreates: 0, snapshotsDelivered: 0 };
  const updateLog: { docId: string; client: string; changes: Change[] }[] = [];

  const snap = (id: string): Record<string, unknown> | null => {
    const d = docs.get(id);
    return d ? (JSON.parse(JSON.stringify(d)) as Record<string, unknown>) : null;
  };

  const deliver = (id: string, writer: string): void => {
    setTimeout(() => {
      const list = [...(subs.get(id) ?? [])].sort((a, b) => Number(b.client === writer) - Number(a.client === writer));
      for (const s of list) {
        if (s.client === writer) {
          ops.snapshotsDelivered += 1;
          s.cb(snap(id), { hasPendingWrites: true });
        }
        ops.snapshotsDelivered += 1;
        s.cb(snap(id), { hasPendingWrites: false });
      }
    }, 0);
  };

  return {
    adapterFor(clientName: string): SyncAdapter {
      return {
        async updateDoc(docId, changes, meta) {
          const cur = docs.get(docId) ?? {};
          const next = applyChanges(cur, changes);
          const w = (next._w as Record<string, unknown> | undefined) ?? {};
          next._w = { ...w, [meta.writerId]: Date.now() };
          docs.set(docId, next);
          ops.updates += 1;
          updateLog.push({ docId, client: clientName, changes });
          deliver(docId, clientName);
        },
        async createLogEntry(docId, field, entry) {
          const key = `${docId}/${field}`;
          const arr = logs.get(key) ?? [];
          if (arr.some(e => (e as { id: string }).id === entry.id)) throw new Error('already-exists');
          arr.push(JSON.parse(JSON.stringify(entry)));
          logs.set(key, arr);
          ops.logCreates += 1;
        },
        subscribeDoc(docId, cb) {
          const entry = { client: clientName, cb };
          const list = subs.get(docId) ?? [];
          list.push(entry);
          subs.set(docId, list);
          let active = true;
          setTimeout(() => {
            if (!active) return;
            ops.snapshotsDelivered += 1;
            cb(snap(docId), { hasPendingWrites: false });
          }, 0);
          return () => {
            active = false;
            subs.set(docId, (subs.get(docId) ?? []).filter(s => s !== entry));
          };
        },
      };
    },
    getDoc(id: string): Record<string, unknown> | undefined {
      return snap(id) ?? undefined;
    },
    seedDoc(id: string, data: Record<string, unknown>): void {
      docs.set(id, JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    },
    logEntries(id: string, field: LogField): unknown[] {
      return [...(logs.get(`${id}/${field}`) ?? [])];
    },
    ops,
    updateLog,
  };
}
