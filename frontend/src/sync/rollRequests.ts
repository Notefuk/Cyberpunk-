// [Claude Code · 2026-11-12] v5.23.0 (plan 28): pedidos de tirada del GM.
//   campaigns/{c}/rollRequests/{id}  { id, _by, at, targetCharId, targetUid, targetHandle, skill, dv, note, status, result? }
// El GM los crea y los borra (cancelar = borrar). El jugador destinatario los lee (consulta por targetUid) y solo puede
// pasar status a 'done' con su result. El GM ve los últimos 20 y borra los más viejos al abrir la mesa.
import { create } from 'zustand';
import type { FirebaseHandles } from './firebaseClient';
import { parseRollRequest, sortRequests, ROLL_REQUEST_KEEP, type RollRequest, type RollRequestResult } from '../engine/rollRequest';

export interface RollRequestsAdapter {
  subscribe(cb: (list: RollRequest[]) => void, onError?: (e: unknown) => void): () => void;
  create(req: RollRequest): Promise<void>;
  answer(id: string, result: RollRequestResult): Promise<void>;
  cancel(id: string): Promise<void>;
  trim(keep: number): Promise<number>;
}

/** Pedidos de la mesa activa (en memoria). `adapter` existe mientras hay mesa. */
export const useRollRequests = create<{ requests: RollRequest[]; adapter: RollRequestsAdapter | null }>()(() => ({
  requests: [],
  adapter: null,
}));

type Snap = { docs: { id: string; data: () => unknown }[] };

function fromSnap(snap: Snap): RollRequest[] {
  const out: RollRequest[] = [];
  for (const d of snap.docs) {
    const data = d.data() as Record<string, unknown> & { at?: { toMillis?: () => number } };
    const r = parseRollRequest({ ...data, id: d.id, at: data.at?.toMillis?.() });
    if (r) out.push(r);
  }
  return sortRequests(out);
}

export function createRollRequestsRepo(h: FirebaseHandles, campId: string, uid: string, isGm: boolean): RollRequestsAdapter {
  const fs = h.fsSdk;
  const coll = () => fs.collection(h.db, 'campaigns', campId, 'rollRequests');
  const newest = () => fs.query(coll(), fs.orderBy('at', 'desc'));
  return {
    subscribe(cb, onError) {
      // El jugador solo puede leer los suyos: la consulta tiene que filtrar por targetUid (sin orderBy, así no pide índice).
      const q = isGm ? fs.query(coll(), fs.orderBy('at', 'desc'), fs.limit(ROLL_REQUEST_KEEP)) : fs.query(coll(), fs.where('targetUid', '==', uid));
      return fs.onSnapshot(q, (snap) => cb(fromSnap(snap)), (err) => onError?.(err));
    },
    async create(req) {
      const { at: _at, result: _result, ...rest } = req;
      await fs.setDoc(fs.doc(coll(), req.id), { ...rest, _by: uid, status: 'pending', at: fs.serverTimestamp() });
    },
    async answer(id, result) {
      await fs.updateDoc(fs.doc(coll(), id), { status: 'done', result });
    },
    async cancel(id) {
      await fs.deleteDoc(fs.doc(coll(), id));
    },
    async trim(keep) {
      const head = await fs.getDocs(fs.query(newest(), fs.limit(keep + 1)));
      if (head.size <= keep) return 0;
      const old = await fs.getDocs(fs.query(newest(), fs.startAfter(head.docs[keep - 1]), fs.limit(200)));
      if (old.empty) return 0;
      const batch = fs.writeBatch(h.db);
      for (const d of old.docs) batch.delete(d.ref);
      await batch.commit();
      return old.size;
    },
  };
}
