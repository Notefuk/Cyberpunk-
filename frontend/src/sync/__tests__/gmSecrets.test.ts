// [Claude Code · 2026-10-28] v5.3.0 (plan 20, B.1): secretos del GM en la nube, por campaña.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startGmSecrets, stopGmSecrets, saveGmSecret, useGmSecrets, GM_SECRET_SAVE_MS, type GmSecretKind, type GmSecretsAdapter } from '../gmSecrets';

type Cb = (data: unknown | null, meta: { hasPendingWrites: boolean }) => void;

function fakeCloud(initial: Partial<Record<GmSecretKind, unknown>> = {}) {
  const docs = new Map<GmSecretKind, unknown>(Object.entries(initial) as [GmSecretKind, unknown][]);
  const cbs = new Map<GmSecretKind, Cb>();
  const saves: { kind: GmSecretKind; value: unknown }[] = [];
  const adapter: GmSecretsAdapter = {
    subscribe(kind, cb) {
      cbs.set(kind, cb);
      cb(docs.has(kind) ? docs.get(kind)! : null, { hasPendingWrites: false });
      return () => cbs.delete(kind);
    },
    async save(kind, value) {
      saves.push({ kind, value });
      docs.set(kind, value);
    },
  };
  const remote = (kind: GmSecretKind, value: unknown, pending = false) => cbs.get(kind)?.(value, { hasPendingWrites: pending });
  return { adapter, saves, remote };
}

const local: Record<GmSecretKind, unknown> = { notes: 'notas viejas', npcs: [{ id: 'custom-npc-1' }], net: [] };

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  stopGmSecrets();
  vi.useRealTimers();
});

describe('secretos del GM', () => {
  it('la primera vez copia lo local que tenga algo y avisa; lo vacío no se sube', () => {
    const cloud = fakeCloud();
    startGmSecrets({ campId: 'c1', campName: 'Mesa', adapter: cloud.adapter, readLocal: (k) => local[k] });
    expect(cloud.saves.map((s) => s.kind)).toEqual(['notes', 'npcs']);
    expect(useGmSecrets.getState().values).toEqual({ notes: 'notas viejas', npcs: [{ id: 'custom-npc-1' }], net: [] });
    expect(useGmSecrets.getState().notice).toContain('Mesa');
  });

  it('si la campaña ya tiene secretos, se usan esos y no se copia nada', () => {
    const cloud = fakeCloud({ notes: 'de la campaña', npcs: [], net: [{ id: 'arch' }] });
    startGmSecrets({ campId: 'c1', campName: 'Mesa', adapter: cloud.adapter, readLocal: (k) => local[k] });
    expect(cloud.saves).toEqual([]);
    expect(useGmSecrets.getState().values.notes).toBe('de la campaña');
    expect(useGmSecrets.getState().notice).toBeNull();
  });

  it('agrupa lo que se escribe seguido en una sola subida y no la pisa un snapshot viejo', async () => {
    const cloud = fakeCloud({ notes: '', npcs: [], net: [] });
    startGmSecrets({ campId: 'c1', campName: 'Mesa', adapter: cloud.adapter, readLocal: () => '' });
    saveGmSecret('notes', 'a');
    saveGmSecret('notes', 'ab');
    cloud.remote('notes', ''); // llega algo viejo mientras espera: no pisa lo local
    expect(useGmSecrets.getState().values.notes).toBe('ab');
    await vi.advanceTimersByTimeAsync(GM_SECRET_SAVE_MS);
    expect(cloud.saves).toEqual([{ kind: 'notes', value: 'ab' }]);
    cloud.remote('notes', 'desde otra compu');
    expect(useGmSecrets.getState().values.notes).toBe('desde otra compu');
  });

  it('al cerrar la mesa sube lo pendiente y vuelve al modo local', () => {
    const cloud = fakeCloud({ notes: '', npcs: [], net: [] });
    startGmSecrets({ campId: 'c1', campName: 'Mesa', adapter: cloud.adapter, readLocal: () => '' });
    saveGmSecret('notes', 'último');
    stopGmSecrets();
    expect(cloud.saves).toEqual([{ kind: 'notes', value: 'último' }]);
    expect(useGmSecrets.getState().campId).toBeNull();
  });
});
