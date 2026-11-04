// [Claude Code · 2026-10-24] v5.0.0 (plan 16/17): adaptador de Firestore para el motor de sync.
// Todas las funciones del SDK salen de h.fsSdk (cargado de forma diferida en firebaseClient.ts).
import type { FirebaseHandles } from './firebaseClient';
import type { SyncAdapter, WriterMeta } from './characterSync';
import type { Change } from './diff';
import type { LogField } from './sheetDoc';
import { CHARACTERS_SCHEMA_VERSION } from '../store/persistence';

export type LogEntryDoc = { id: string } & Record<string, unknown>;

/** v5.10.0 (plan 24): código para pasarle una ficha a otro jugador (`transfers/{code}`). [Claude Code · 2026-11-04] */
export interface TransferInfo {
  charId: string;
  fromUid: string;
  fromName: string;
  handle: string;
  role: string;
  roleRank: number;
  /** Campaña de la ficha al crear el código (el que la recibe no puede leer la ficha antes). */
  campaignId: string | null;
  /** ms desde 1970. */
  expiresAt: number;
}

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
  // v5.10.0 (plan 24): pasar una ficha a otro jugador. [Claude Code · 2026-11-04]
  /** Crea el código y lo anota en la ficha (dos escrituras: primero el código, que las reglas piden que exista). */
  createTransfer(code: string, info: TransferInfo, writerId: string): Promise<void>;
  /** null si no existe (o ya se usó / se canceló). */
  getTransfer(code: string): Promise<TransferInfo | null>;
  /** Quita el código de la ficha y lo borra. */
  cancelTransfer(code: string, charId: string, writerId: string): Promise<void>;
  /** El que recibe: se pone como dueño, saca el código y deja la campaña que corresponda. */
  claimTransfer(charId: string, campaignIds: string[], writerId: string): Promise<void>;
  deleteTransfer(code: string): Promise<void>;
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

/** onDocError (plan 24): avisa si se cortó la escucha de una ficha (p. ej. sin permiso porque se la pasaron a otro). */
export function createFirestoreAdapter(
  h: FirebaseHandles,
  uid: string,
  opts: { onDocError?: (id: string, err: unknown) => void } = {},
): SyncAdapter & CloudRepo {
  const fs = h.fsSdk;
  const charRef = (id: string) => fs.doc(h.db, 'characters', id);
  const transferRef = (code: string) => fs.doc(h.db, 'transfers', code);

  // Escribe campos sueltos con los campos de escritor que piden las reglas (freno por escritor). Plan 24.
  const writeMeta = (id: string, writerId: string, ...pairs: unknown[]): Promise<void> => {
    const [first, ...rest] = [
      ...pairs,
      new fs.FieldPath('_w', writerId), fs.serverTimestamp(),
      new fs.FieldPath('_lastWriter'), writerId,
      new fs.FieldPath('_ts'), fs.serverTimestamp(),
    ];
    return (fs.updateDoc as (ref: unknown, f: unknown, ...more: unknown[]) => Promise<void>)(charRef(id), first, ...rest);
  };

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
        (err) => {
          if (opts.onDocError) opts.onDocError(docId, err);
          else console.error('[nube] error escuchando la ficha', docId, err);
        },
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

    // v5.10.0 (plan 24). [Claude Code · 2026-11-04]
    async createTransfer(code, info, writerId) {
      await fs.setDoc(transferRef(code), {
        charId: info.charId,
        fromUid: uid,
        fromName: info.fromName,
        handle: info.handle,
        role: info.role,
        roleRank: info.roleRank,
        campaignId: info.campaignId,
        createdAt: fs.serverTimestamp(),
        expiresAt: fs.Timestamp.fromMillis(info.expiresAt),
      });
      await writeMeta(info.charId, writerId, new fs.FieldPath('transferCode'), code);
    },

    async getTransfer(code) {
      const snap = await fs.getDoc(transferRef(code));
      if (!snap.exists()) return null;
      const d = snap.data() as Record<string, unknown>;
      const exp = d.expiresAt as { toMillis?: () => number } | undefined;
      return {
        charId: String(d.charId ?? ''),
        fromUid: String(d.fromUid ?? ''),
        fromName: String(d.fromName ?? ''),
        handle: String(d.handle ?? ''),
        role: String(d.role ?? ''),
        roleRank: typeof d.roleRank === 'number' ? d.roleRank : 0,
        campaignId: typeof d.campaignId === 'string' ? d.campaignId : null,
        expiresAt: typeof exp?.toMillis === 'function' ? exp.toMillis() : 0,
      };
    },

    async cancelTransfer(code, charId, writerId) {
      await writeMeta(charId, writerId, new fs.FieldPath('transferCode'), fs.deleteField());
      await fs.deleteDoc(transferRef(code));
    },

    async claimTransfer(charId, campaignIds, writerId) {
      await writeMeta(
        charId, writerId,
        new fs.FieldPath('ownerUid'), uid,
        new fs.FieldPath('transferCode'), fs.deleteField(),
        new fs.FieldPath('campaignIds'), campaignIds,
      );
    },

    async deleteTransfer(code) {
      await fs.deleteDoc(transferRef(code));
    },
  };
}
