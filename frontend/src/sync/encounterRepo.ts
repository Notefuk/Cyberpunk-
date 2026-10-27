// v5.1.0 [Claude Code · 2026-10-27]: encuentro compartido en Firestore (plan 19, punto 3), estilo campaignRepo.
// Todas las funciones del SDK salen de h.fsSdk (cargado de forma diferida en firebaseClient.ts).
import type { FirebaseHandles } from './firebaseClient';
import type { EncounterEnemy } from '../store/encounterStore';
import { parseHead, parsePublic, type EncounterAdapter, type PublicCombatant } from './encounterSync';

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
