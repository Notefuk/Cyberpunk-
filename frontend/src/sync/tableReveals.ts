// v5.3.0 [Claude Code · 2026-10-28]: lo que el GM revela a la mesa (plan 20, B.2; decisión 4).
//   campaigns/{c}/reveals/{id}  { id, kind: 'note', title, text, at, _by }   handouts (los lee la mesa, los crea el GM)
//   campaigns/{c}/reveals/net   { archName, totalFloors, currentFloor, floors, forCharId?, _ts }   corrida NET compartida
// De los pisos NET solo van los desbloqueados y sus datos públicos: el HP, ATK y DEF del ICE nunca salen del GM.
import { create } from 'zustand';
import type { FirebaseHandles } from './firebaseClient';
import type { NetArchitecturePreset, NetFloor } from '../data/netAndRolesData';

export const HANDOUT_LIMIT = 20;
export const HANDOUT_TITLE_MAX = 80;
export const HANDOUT_TEXT_MAX = 2000;
export const NET_REVEAL_MAX_FLOORS = 30;

export interface Handout {
  id: string;
  title: string;
  text: string;
  /** Milisegundos (al leer). */
  at?: number;
}

export type PublicNetFloor = Pick<NetFloor, 'floorNumber' | 'type' | 'name' | 'dv' | 'iceType'>;

export interface NetReveal {
  archName: string;
  totalFloors: number;
  /** Número del piso donde está el Netrunner (1 = el primero). */
  currentFloor: number;
  floors: PublicNetFloor[];
  forCharId?: string;
}

/** Corrida NET para la mesa: solo los pisos desbloqueados, sin HP/ATK/DEF del ICE ni recompensas. */
export function buildNetReveal(arch: NetArchitecturePreset, unlockedFloors: number[], currentFloorIndex: number, forCharId?: string): NetReveal {
  const unlocked = new Set(unlockedFloors);
  const floors: PublicNetFloor[] = arch.floors
    .filter((f) => unlocked.has(f.floorNumber))
    .slice(0, NET_REVEAL_MAX_FLOORS)
    .map((f) => {
      const out: PublicNetFloor = { floorNumber: f.floorNumber, type: f.type, name: f.name };
      if (typeof f.dv === 'number') out.dv = f.dv;
      if (f.iceType) out.iceType = f.iceType;
      return out;
    });
  const out: NetReveal = { archName: arch.name, totalFloors: arch.floors.length, currentFloor: currentFloorIndex + 1, floors };
  if (forCharId) out.forCharId = forCharId;
  return out;
}

export function parseNetReveal(data: Record<string, unknown> | null | undefined): NetReveal | null {
  if (!data || typeof data.archName !== 'string' || !Array.isArray(data.floors)) return null;
  const floors = data.floors
    .filter((f): f is Record<string, unknown> => !!f && typeof f === 'object' && typeof (f as Record<string, unknown>).floorNumber === 'number')
    .map((f) => {
      const out: PublicNetFloor = { floorNumber: f.floorNumber as number, type: f.type as NetFloor['type'], name: String(f.name ?? '') };
      if (typeof f.dv === 'number') out.dv = f.dv;
      if (typeof f.iceType === 'string') out.iceType = f.iceType;
      return out;
    });
  const out: NetReveal = {
    archName: data.archName,
    totalFloors: typeof data.totalFloors === 'number' ? data.totalFloors : floors.length,
    currentFloor: typeof data.currentFloor === 'number' ? data.currentFloor : 1,
    floors
  };
  if (typeof data.forCharId === 'string') out.forCharId = data.forCharId;
  return out;
}

export interface TableRevealsAdapter {
  subscribeHandouts(cb: (list: Handout[]) => void, onError?: (e: unknown) => void): () => void;
  subscribeNet(cb: (net: NetReveal | null) => void, onError?: (e: unknown) => void): () => void;
  sendHandout(title: string, text: string): Promise<void>;
  deleteHandout(id: string): Promise<void>;
  /** null: deja de compartir la corrida. */
  setNet(net: NetReveal | null): Promise<void>;
}

/** Lo revelado en la mesa activa (en memoria). `adapter` existe mientras hay mesa. */
export const useTableReveals = create<{ handouts: Handout[]; net: NetReveal | null; adapter: TableRevealsAdapter | null }>()(() => ({
  handouts: [],
  net: null,
  adapter: null
}));

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export function createTableRevealsRepo(h: FirebaseHandles, campId: string, uid: string): TableRevealsAdapter {
  const fs = h.fsSdk;
  const coll = () => fs.collection(h.db, 'campaigns', campId, 'reveals');
  const netRef = () => fs.doc(h.db, 'campaigns', campId, 'reveals', 'net');
  return {
    subscribeHandouts(cb, onError) {
      // El documento 'net' no tiene 'at', así que esta consulta no lo trae.
      return fs.onSnapshot(
        fs.query(coll(), fs.orderBy('at', 'desc'), fs.limit(HANDOUT_LIMIT)),
        (snap) => cb(snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown> & { at?: { toMillis?: () => number } };
          return { id: d.id, title: String(data.title ?? ''), text: String(data.text ?? ''), at: data.at?.toMillis?.() };
        })),
        (err) => onError?.(err),
      );
    },
    subscribeNet(cb, onError) {
      return fs.onSnapshot(netRef(), (snap) => cb(snap.exists() ? parseNetReveal(snap.data() as Record<string, unknown>) : null), (err) => onError?.(err));
    },
    async sendHandout(title, text) {
      const id = `ho-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await fs.setDoc(fs.doc(coll(), id), {
        id,
        kind: 'note',
        title: cut(title.trim() || 'De parte del GM', HANDOUT_TITLE_MAX),
        text: cut(text, HANDOUT_TEXT_MAX),
        at: fs.serverTimestamp(),
        _by: uid
      });
    },
    async deleteHandout(id) {
      await fs.deleteDoc(fs.doc(coll(), id));
    },
    async setNet(net) {
      if (!net) {
        await fs.deleteDoc(netRef());
        return;
      }
      await fs.setDoc(netRef(), { ...JSON.parse(JSON.stringify(net)), _ts: fs.serverTimestamp() });
    }
  };
}
