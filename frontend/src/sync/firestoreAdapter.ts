// [Claude Code · 2026-10-24] v5.0.0 (plan 16/17): adaptador de Firestore para el motor de sync.
// Todas las funciones del SDK salen de h.fsSdk (cargado de forma diferida en firebaseClient.ts).
import type { FirebaseHandles } from './firebaseClient';
import type { SyncAdapter, WriterMeta } from './characterSync';
import type { Change } from './diff';
import type { LogField } from './sheetDoc';
import { CHARACTERS_SCHEMA_VERSION } from '../store/persistence';

export type LogEntryDoc = { id: string } & Record<string, unknown>;

export interface CloudRepo {
  listMyCharacters(): Promise<{ id: string; data: Record<string, unknown> }[]>;
  docExists(id: string): Promise<boolean>;
  /** Lee una ficha (la de un jugador, para el GM). null si no existe. [Claude Code · 2026-10-24] */
  getCharacter(id: string): Promise<Record<string, unknown> | null>;
  createCharacter(id: string, sheetDoc: Record<string, unknown>, writerId: string): Promise<Record<string, unknown>>;
  uploadLogEntries(id: string, field: LogField, entries: LogEntryDoc[]): Promise<void>;
  fetchLogEntries(id: string, field: LogField, afterKey?: string): Promise<LogEntryDoc[]>;
  subscribeNewLogEntries(id: string, field: LogField, afterKey: string | undefined, cb: (entries: LogEntryDoc[]) => void): () => void;
  /** Escribe solo schemaVersion (una escritura), usado al migrar una ficha vieja. */
  setSchemaVersion(id: string, version: number, writerId: string): Promise<void>;
}

const BATCH_SIZE = 400;
const TX_LIMIT = 50;

function stripBy(data: Record<string, unknown>): LogEntryDoc {
  const { _by, ...rest } = data;
  void _by;
  return rest as LogEntryDoc;
}

// '_lastWriter' lo pide la regla de seguridad; no es parte de la ficha, así que no se le pasa al motor (si no, el diff lo borraría).
function withoutLastWriter(data: Record<string, unknown>): Record<string, unknown> {
  const { _lastWriter, ...rest } = data;
  void _lastWriter;
  return rest;
}

export function createFirestoreAdapter(h: FirebaseHandles, uid: string): SyncAdapter & CloudRepo {
  const fs = h.fsSdk;
  const charRef = (id: string) => fs.doc(h.db, 'characters', id);

  // ipLog: orden por 'at' ascendente (solo lo nuevo si hay afterKey). transactions: las 50 más nuevas.
  const logQuery = (id: string, field: LogField, afterKey?: string) => {
    const col = fs.collection(h.db, 'characters', id, field);
    if (field === 'ipLog') {
      return afterKey
        ? fs.query(col, fs.where('at', '>', afterKey), fs.orderBy('at', 'asc'))
        : fs.query(col, fs.orderBy('at', 'asc'));
    }
    return fs.query(col, fs.orderBy('timestamp', 'desc'), fs.limit(TX_LIMIT));
  };

  return {
    async updateDoc(docId: string, changes: Change[], meta: WriterMeta): Promise<void> {
      const args: unknown[] = [];
      for (const c of changes) {
        const fp = new fs.FieldPath(...c.path);
        args.push(fp);
        if (c.kind === 'set') args.push(c.value);
        else if (c.kind === 'delete') args.push(fs.deleteField());
        else args.push(fs.increment(c.delta));
      }
      args.push(new fs.FieldPath('_w', meta.writerId), fs.serverTimestamp());
      args.push(new fs.FieldPath('_lastWriter'), meta.writerId);
      args.push(new fs.FieldPath('_ts'), fs.serverTimestamp());
      const [first, ...rest] = args;
      await (fs.updateDoc as (ref: unknown, f: unknown, ...more: unknown[]) => Promise<void>)(charRef(docId), first, ...rest);
    },

    async createLogEntry(docId: string, field: LogField, entry: LogEntryDoc, meta: WriterMeta): Promise<void> {
      void meta;
      await fs.setDoc(fs.doc(h.db, 'characters', docId, field, entry.id), { ...entry, _by: uid });
    },

    subscribeDoc(docId, cb) {
      return fs.onSnapshot(
        charRef(docId),
        { includeMetadataChanges: true },
        (snap) => cb(snap.exists() ? withoutLastWriter(snap.data() as Record<string, unknown>) : null, { hasPendingWrites: snap.metadata.hasPendingWrites }),
        (err) => console.error('[nube] error escuchando la ficha', docId, err),
      );
    },

    async listMyCharacters() {
      const snap = await fs.getDocs(fs.query(fs.collection(h.db, 'characters'), fs.where('ownerUid', '==', uid)));
      return snap.docs.map((d) => ({ id: d.id, data: withoutLastWriter(d.data() as Record<string, unknown>) }));
    },

    async docExists(id: string) {
      try {
        const snap = await fs.getDoc(charRef(id));
        return snap.exists();
      } catch (e) {
        // Sin permiso = la ficha existe y es de otro: se sube con un id nuevo. [Claude Code · 2026-10-24]
        if (typeof e === 'object' && e !== null && (e as { code?: unknown }).code === 'permission-denied') return true;
        throw e;
      }
    },

    async getCharacter(id: string) {
      const snap = await fs.getDoc(charRef(id));
      return snap.exists() ? withoutLastWriter(snap.data() as Record<string, unknown>) : null;
    },

    async createCharacter(id, sheetDoc, writerId) {
      const plain = { ...sheetDoc, ownerUid: uid, campaignIds: [] as string[], schemaVersion: CHARACTERS_SCHEMA_VERSION };
      await fs.setDoc(charRef(id), {
        ...plain,
        _w: { [writerId]: fs.serverTimestamp() },
        _ts: fs.serverTimestamp(),
        _lastWriter: writerId,
      });
      return plain;
    },

    async uploadLogEntries(id, field, entries) {
      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        const batch = fs.writeBatch(h.db);
        for (const e of entries.slice(i, i + BATCH_SIZE)) {
          batch.set(fs.doc(h.db, 'characters', id, field, e.id), { ...e, _by: uid });
        }
        await batch.commit();
      }
    },

    async fetchLogEntries(id, field, afterKey) {
      const snap = await fs.getDocs(logQuery(id, field, afterKey));
      return snap.docs.map((d) => stripBy(d.data() as Record<string, unknown>));
    },

    subscribeNewLogEntries(id, field, afterKey, cb) {
      return fs.onSnapshot(
        logQuery(id, field, afterKey),
        (snap) => {
          const added = snap.docChanges().filter((c) => c.type === 'added').map((c) => stripBy(c.doc.data() as Record<string, unknown>));
          if (added.length > 0) cb(added);
        },
        (err) => console.error('[nube] error escuchando', field, id, err),
      );
    },

    // Lleva los campos de escritor: sin ellos la regla del freno (writerOk) rechaza la escritura. [Claude Code · 2026-10-24]
    async setSchemaVersion(id, version, writerId) {
      await fs.updateDoc(
        charRef(id),
        new fs.FieldPath('schemaVersion'), version,
        new fs.FieldPath('_w', writerId), fs.serverTimestamp(),
        new fs.FieldPath('_lastWriter'), writerId,
        new fs.FieldPath('_ts'), fs.serverTimestamp(),
      );
    },
  };
}
