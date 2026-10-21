// Tests del borrador autoguardado del creador (v4.8.3). [Claude Code · 2026-10-22]
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CREATOR_DRAFT_KEY, clearCreatorDraft, loadCreatorDraft, saveCreatorDraft } from '../../features/creator/creatorDraftStorage';
import { createEmptyDraft } from '../characterCreation';

class MemoryStorage {
  data = new Map<string, string>();
  quotaFull = false;
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) {
    if (this.quotaFull) {
      const err = new Error('quota');
      err.name = 'QuotaExceededError';
      throw err;
    }
    this.data.set(k, v);
  }
  removeItem(k: string) { this.data.delete(k); }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal('localStorage', storage);
});

describe('creatorDraftStorage', () => {
  it('sin nada guardado devuelve null', () => {
    expect(loadCreatorDraft()).toBeNull();
  });

  it('ida y vuelta conserva el borrador', () => {
    const d = { ...createEmptyDraft(), step: 3, method: 'streetrat' as const, role: 'Solo' as const, handle: 'Zed' };
    saveCreatorDraft(d);
    expect(storage.data.has(CREATOR_DRAFT_KEY)).toBe(true);
    expect(loadCreatorDraft()).toEqual(d);
  });

  it('JSON corrupto devuelve null', () => {
    storage.setItem(CREATOR_DRAFT_KEY, '{no es json');
    expect(loadCreatorDraft()).toBeNull();
  });

  it('versión distinta devuelve null', () => {
    storage.setItem(CREATOR_DRAFT_KEY, JSON.stringify({ ...createEmptyDraft(), version: 2 }));
    expect(loadCreatorDraft()).toBeNull();
  });

  it('forma mínima inválida devuelve null', () => {
    storage.setItem(CREATOR_DRAFT_KEY, JSON.stringify({ version: 1 }));
    expect(loadCreatorDraft()).toBeNull();
  });

  it('ignora errores de cuota al guardar', () => {
    storage.quotaFull = true;
    expect(() => saveCreatorDraft(createEmptyDraft())).not.toThrow();
  });

  it('clearCreatorDraft borra el borrador', () => {
    saveCreatorDraft(createEmptyDraft());
    clearCreatorDraft();
    expect(loadCreatorDraft()).toBeNull();
  });
});
