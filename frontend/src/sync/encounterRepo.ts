// v5.1.0 [Claude Code · 2026-10-27]: encuentro compartido en Firestore (plan 19, punto 3), estilo campaignRepo.
// Todas las funciones del SDK salen de h.fsSdk (cargado de forma diferida en firebaseClient.ts).
import type { FirebaseHandles } from './firebaseClient';
import type { EncounterEnemy } from '../store/encounterStore';
import { parseHead, parsePublic, type EncounterAdapter, type PublicCombatant } from './encounterSync';
import { TABLE_LOG_LIMIT, type TableLogAdapter, type TableLogEntry } from './tableLog';

export const ENCOUNTER_DOC_ID = 'current';

/** Firestore no acepta undefined: se quitan con un viaje por JSON (los datos son simples). */
const clean = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export function createEncounterRepo(h: FirebaseHandles, campId: string): EncounterAdapter {
  const fs = h.fsSdk;
  const headRef = () => fs.doc(h.db, 'campaigns', campId, 'encounters', ENCOUNTER_DOC_ID);
  const collRef = (coll: string) => fs.collection(h.db, 'campaigns', campId, 'encounters', ENCOUNTER_DOC_ID, coll);
  const itemRef = (coll: string, id: string) => fs.doc(h.db, 'campaigns', campId, 'encounters', ENCOUNTER_DOC_ID, coll, id);

  return {
    subscribeHead(cb, onError) {
      return fs.onSnapshot(
        headRef(),
        (snap) => cb(snap.exists() ? parseHead(snap.data() as Record<string, unknown>) : null),
        (err) => onError?.(err),
      );
    },

    subscribeCombatants(cb, onError) {
      return fs.onSnapshot(
        collRef('combatants'),
        (snap) => cb(snap.docs
          .map((d) => ({ id: d.id, data: parsePublic(d.data() as Record<string, unknown>) }))
          .filter((x): x is { id: string; data: PublicCombatant } => x.data !== null)),
        (err) => onError?.(err),
      );
    },

    async loadGmCombatants() {
      const snap = await fs.getDocs(collRef('gmCombatants'));
      const out: Record<string, EncounterEnemy> = {};
      for (const d of snap.docs) out[d.id] = d.data() as EncounterEnemy;
      return out;
    },

    // Una sola escritura agrupada (batch) por flush: hasta 500 operaciones, de sobra para un encuentro.
    async commit(c) {
      const batch = fs.writeBatch(h.db);
      if (c.head) batch.set(headRef(), clean(c.head));
      for (const w of c.set) batch.set(itemRef(w.coll, w.id), clean(w.data));
      for (const w of c.del) batch.delete(itemRef(w.coll, w.id));
      await batch.commit();
    },

    async writeMyPc(id, data, exists) {
      if (exists) await fs.updateDoc(itemRef('combatants', id), { initiative: data.initiative });
      else await fs.setDoc(itemRef('combatants', id), clean(data));
    },
  };
}

// v5.1.0 [Claude Code · 2026-10-27]: log de la mesa (plan 19, punto 4). Lectura con límite; el GM recorta a las últimas 200.
export function createTableLogRepo(h: FirebaseHandles, campId: string): TableLogAdapter {
  const fs = h.fsSdk;
  const logColl = () => fs.collection(h.db, 'campaigns', campId, 'log');
  const newest = () => fs.query(logColl(), fs.orderBy('at', 'desc'));

  return {
    async create(entry) {
      await fs.setDoc(fs.doc(logColl(), entry.id), { ...clean(entry), at: fs.serverTimestamp() });
    },

    subscribe(cb, onError) {
      return fs.onSnapshot(
        fs.query(logColl(), fs.orderBy('at', 'desc'), fs.limit(TABLE_LOG_LIMIT)),
        (snap) => cb(snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown> & { at?: { toMillis?: () => number } };
          return { ...(data as unknown as TableLogEntry), id: d.id, at: data.at?.toMillis?.() };
        })),
        (err) => onError?.(err),
      );
    },

    async trim(keep) {
      const head = await fs.getDocs(fs.query(newest(), fs.limit(keep + 1)));
      if (head.size <= keep) return 0;
      const old = await fs.getDocs(fs.query(newest(), fs.startAfter(head.docs[keep - 1]), fs.limit(400)));
      if (old.empty) return 0;
      const batch = fs.writeBatch(h.db);
      for (const d of old.docs) batch.delete(d.ref);
      await batch.commit();
      return old.size;
    },
  };
}
