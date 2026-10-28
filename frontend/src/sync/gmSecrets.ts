// v5.3.0 [Claude Code · 2026-10-28]: secretos del GM en la nube, por campaña (plan 20, B.1; decisión 3).
//   campaigns/{c}/gm/notes  { text, _ts }      notas secretas (cpr_gm_secret_notes_v1)
//   campaigns/{c}/gm/npcs   { items, _ts }     NPCs propios (cpr_custom_npcs_v1)
//   campaigns/{c}/gm/net    { items, _ts }     arquitecturas NET (cpr_custom_net_arch_v1)
// Solo los lee y escribe el GM de esa campaña. Con mesa activa de GM, las pantallas leen y escriben acá; si no, su
// clave local como siempre. Si el documento no existe y hay datos locales, se copian la primera vez.
// Se sube 1,5 s después de dejar de escribir (máximo 5 s; plan 17, línea 84).
import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { debounce, type Debounced } from '../utils/debounce';
import type { FirebaseHandles } from './firebaseClient';

export type GmSecretKind = 'notes' | 'npcs' | 'net';
export const GM_SECRET_KINDS: GmSecretKind[] = ['notes', 'npcs', 'net'];
export const GM_SECRET_LOCAL_KEYS: Record<GmSecretKind, string> = {
  notes: 'cpr_gm_secret_notes_v1',
  npcs: 'cpr_custom_npcs_v1',
  net: 'cpr_custom_net_arch_v1',
};
export const GM_SECRET_SAVE_MS = 1500;
export const GM_SECRET_MAX_WAIT_MS = 5000;

export interface GmSecretsAdapter {
  /** data: el valor (texto o lista), o null si el documento no existe. */
  subscribe(kind: GmSecretKind, cb: (data: unknown | null, meta: { hasPendingWrites: boolean }) => void, onError?: (e: unknown) => void): () => void;
  save(kind: GmSecretKind, value: unknown): Promise<void>;
}

interface GmSecretsState {
  /** Campaña cuyos secretos se están usando (null = modo local). */
  campId: string | null;
  campName: string;
  values: Partial<Record<GmSecretKind, unknown>>;
  /** Aviso de la primera copia ("Copié tus notas… a X"). */
  notice: string | null;
}

export const useGmSecrets = create<GmSecretsState>()(() => ({ campId: null, campName: '', values: {}, notice: null }));

const isEmpty = (v: unknown) => v == null || v === '' || (Array.isArray(v) && v.length === 0);
const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

let current: {
  adapter: GmSecretsAdapter;
  unsubs: (() => void)[];
  savers: Record<GmSecretKind, Debounced<[unknown]>>;
} | null = null;

/** Abre los secretos de una campaña (solo el GM). readLocal: lo que hay en este dispositivo, para la primera copia. */
export function startGmSecrets(opts: {
  campId: string;
  campName: string;
  adapter: GmSecretsAdapter;
  readLocal: (kind: GmSecretKind) => unknown;
  onError?: (e: unknown) => void;
}): void {
  stopGmSecrets();
  const { adapter } = opts;
  const savers = {} as Record<GmSecretKind, Debounced<[unknown]>>;
  for (const kind of GM_SECRET_KINDS) {
    savers[kind] = debounce((value: unknown) => {
      adapter.save(kind, value).catch((e) => opts.onError?.(e));
    }, GM_SECRET_SAVE_MS, { maxWait: GM_SECRET_MAX_WAIT_MS });
  }
  current = { adapter, unsubs: [], savers };
  useGmSecrets.setState({ campId: opts.campId, campName: opts.campName, values: {}, notice: null });
  const copied: string[] = [];
  const LABEL: Record<GmSecretKind, string> = { notes: 'notas', npcs: 'NPCs', net: 'NET' };

  for (const kind of GM_SECRET_KINDS) {
    current.unsubs.push(adapter.subscribe(kind, (data, meta) => {
      if (!current || meta.hasPendingWrites || savers[kind].pending()) return; // lo local es más nuevo
      let value = data;
      if (data === null) {
        const local = opts.readLocal(kind);
        if (!isEmpty(local)) {
          value = local;
          adapter.save(kind, local).catch((e) => opts.onError?.(e));
          copied.push(LABEL[kind]);
          useGmSecrets.setState({ notice: `Copié tus ${copied.join(', ')} de este dispositivo a "${opts.campName}".` });
        } else {
          value = kind === 'notes' ? '' : [];
        }
      }
      const prev = useGmSecrets.getState().values[kind];
      if (!same(prev, value)) useGmSecrets.setState((s) => ({ values: { ...s.values, [kind]: value } }));
    }, (e) => opts.onError?.(e)));
  }
}

/** Cambio desde la pantalla: se ve al instante y se sube con espera. */
export function saveGmSecret(kind: GmSecretKind, value: unknown): void {
  if (!current) return;
  if (same(useGmSecrets.getState().values[kind], value)) return;
  useGmSecrets.setState((s) => ({ values: { ...s.values, [kind]: value } }));
  current.savers[kind](value);
}

export function stopGmSecrets(): void {
  if (current) {
    for (const kind of GM_SECRET_KINDS) current.savers[kind].flush();
    for (const u of current.unsubs.splice(0)) u();
  }
  current = null;
  useGmSecrets.setState({ campId: null, campName: '', values: {}, notice: null });
}

/** Firestore: un documento por tipo en campaigns/{c}/gm. */
export function createGmSecretsRepo(h: FirebaseHandles, campId: string): GmSecretsAdapter {
  const fs = h.fsSdk;
  const ref = (kind: GmSecretKind) => fs.doc(h.db, 'campaigns', campId, 'gm', kind);
  const field = (kind: GmSecretKind) => (kind === 'notes' ? 'text' : 'items');
  return {
    subscribe(kind, cb, onError) {
      return fs.onSnapshot(
        ref(kind),
        { includeMetadataChanges: true },
        (snap) => cb(snap.exists() ? ((snap.data() as Record<string, unknown>)[field(kind)] ?? null) : null, { hasPendingWrites: snap.metadata.hasPendingWrites }),
        (err) => onError?.(err),
      );
    },
    async save(kind, value) {
      // Firestore no acepta undefined: viaje por JSON (los datos son simples).
      await fs.setDoc(ref(kind), { [field(kind)]: JSON.parse(JSON.stringify(value ?? (kind === 'notes' ? '' : []))), _ts: fs.serverTimestamp() });
    },
  };
}

/**
 * Para las pantallas: con secretos en la nube, el estado local de la pantalla sigue al de la campaña y sus cambios
 * suben; al volver al modo local se recarga lo de este dispositivo. Devuelve si está en la nube (para no tocar la clave local).
 */
export function useGmSecretBinding<T>(kind: GmSecretKind, value: T, setValue: (v: T) => void, readLocal: () => T): { cloud: boolean; campName: string } {
  const campId = useGmSecrets((s) => s.campId);
  const campName = useGmSecrets((s) => s.campName);
  const remote = useGmSecrets((s) => s.values[kind]);
  const prevCamp = useRef<string | null>(campId);
  // Lo último que bajó de la nube a la pantalla: eso no se vuelve a subir.
  const applied = useRef<unknown>(undefined);

  useEffect(() => {
    if (!campId || remote === undefined) return;
    applied.current = remote;
    if (!same(remote, value)) setValue(remote as T);
    // value se omite a propósito: solo baja lo remoto cuando cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campId, remote]);

  // Solo sube lo que cambió el usuario: ni al montar la pantalla ni al abrir la mesa (el valor local viejo pelearía con el remoto).
  const lastValue = useRef<T>(value);
  useEffect(() => {
    const changed = !same(lastValue.current, value);
    lastValue.current = value;
    if (!changed || !campId || useGmSecrets.getState().values[kind] === undefined || same(value, applied.current)) return;
    saveGmSecret(kind, value);
    // campId se omite a propósito: cambiar de mesa no es un cambio del usuario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, value]);

  useEffect(() => {
    if (prevCamp.current && !campId) setValue(readLocal());
    prevCamp.current = campId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campId]);

  return { cloud: campId !== null, campName };
}
