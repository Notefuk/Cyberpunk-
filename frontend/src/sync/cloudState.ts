// [Claude Code · 2026-10-24] v5.0.0 (plan 16/17): estado de la sincronización con la nube (solo memoria).
import { create } from 'zustand';
import type { CampaignDoc } from './campaignRepo';
import type { PartySummary } from './partySummary';

export type SyncState = 'off' | 'loading' | 'saved' | 'saving' | 'offline' | 'paused' | 'readonly';

interface CloudState {
  syncState: SyncState;
  cloudIds: string[];
  needsAppUpdate: boolean;
  lastError: string | null;
  uploading: boolean;
  // Campañas (plan 18). [Claude Code · 2026-10-24]
  campaigns: CampaignDoc[];
  /** Resumen de party por campaña: campId -> charId -> resumen. */
  party: Record<string, Record<string, PartySummary>>;
  /** Fichas de jugadores que ve el GM en su dispositivo: charId -> nombre del dueño. */
  playerOwners: Record<string, string>;
  /** Campaña asignada a cada ficha propia de la nube (null = ninguna). */
  charCampaign: Record<string, string | null>;
  setSyncState: (s: SyncState) => void;
  setCloudIds: (ids: string[]) => void;
  setNeedsAppUpdate: (v: boolean) => void;
  setLastError: (e: string | null) => void;
  setUploading: (v: boolean) => void;
}

export const useCloudState = create<CloudState>()((set) => ({
  syncState: 'off',
  cloudIds: [],
  needsAppUpdate: false,
  lastError: null,
  uploading: false,
  campaigns: [],
  party: {},
  playerOwners: {},
  charCampaign: {},
  setSyncState: (syncState) => set({ syncState }),
  setCloudIds: (cloudIds) => set({ cloudIds }),
  setNeedsAppUpdate: (needsAppUpdate) => set({ needsAppUpdate }),
  setLastError: (lastError) => set({ lastError }),
  setUploading: (uploading) => set({ uploading }),
}));

const DEVICE_KEY = 'cpr_device_id_v1';
let memoryDeviceId: string | null = null;

const randomId = (): string => {
  let out = '';
  while (out.length < 12) out += Math.random().toString(36).slice(2);
  return out.slice(0, 12);
};

/** Id aleatorio de este dispositivo, guardado en localStorage (si no se puede, queda en memoria). */
export function getDeviceId(): string {
  try {
    const saved = localStorage.getItem(DEVICE_KEY);
    if (saved) return saved;
    const fresh = randomId();
    localStorage.setItem(DEVICE_KEY, fresh);
    return fresh;
  } catch {
    if (!memoryDeviceId) memoryDeviceId = randomId();
    return memoryDeviceId;
  }
}
