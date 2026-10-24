// [Claude Code · 2026-10-24] v5.0.0 (plan 16/17): une el motor de sync, Firestore y el store de fichas.
// Cuando el usuario entra a la nube se bajan sus fichas (la nube manda); al salir se quitan del dispositivo.
import type { CharacterSheet, EurodollarTransaction, IpLogEntry } from '../types/cyberpunk';
import { useCharacterStore } from '../store/useCharacterStore';
import { CHARACTERS_SCHEMA_VERSION, runMigrations } from '../store/persistence';
import { registerBeforeSignOut, useAuthStore } from './authStore';
import { getFirebase } from './firebaseClient';
import { createFirestoreAdapter, type CloudRepo, type LogEntryDoc } from './firestoreAdapter';
import { createCharacterSync } from './characterSync';
import { createQuotaGuard } from './quotaGuard';
import { fromSheetDoc, toSheetDoc, type LogField } from './sheetDoc';
import { getDeviceId, useCloudState } from './cloudState';

const TX_CAP = 50;
const QUIET_MS = 2000;

// ---------------------------------------------------------------------------
// Helpers puros (con tests)
// ---------------------------------------------------------------------------

/** Junta los movimientos de IP por id (los que ya había se respetan) y los ordena por fecha ascendente. */
export function mergeIpLog(local: IpLogEntry[] | undefined, incoming: IpLogEntry[]): IpLogEntry[] {
  const byId = new Map<string, IpLogEntry>();
  for (const e of local ?? []) byId.set(e.id, e);
  for (const e of incoming) if (!byId.has(e.id)) byId.set(e.id, e);
  return [...byId.values()].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
}

/** Junta las transacciones por id, las más nuevas primero, hasta 50. */
export function mergeTransactions(local: EurodollarTransaction[] | undefined, incoming: EurodollarTransaction[]): EurodollarTransaction[] {
  const byId = new Map<string, EurodollarTransaction>();
  for (const e of local ?? []) byId.set(e.id, e);
  for (const e of incoming) if (!byId.has(e.id)) byId.set(e.id, e);
  return [...byId.values()]
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0))
    .slice(0, TX_CAP);
}

/** Id con el que se sube una ficha: el propio si es 'char-...' y no existe en la nube; si no, uno nuevo. */
export function chooseUploadId(localId: string, exists: boolean, now: number, rand: number): string {
  if (localId.startsWith('char-') && !exists) return localId;
  return `char-${now}-${rand.toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// Sesión
// ---------------------------------------------------------------------------

type Engine = ReturnType<typeof createCharacterSync>;

interface Session {
  uid: string;
  writerId: string;
  repo: CloudRepo;
  engine: Engine;
  tracked: Set<string>;
  owned: Set<string>; // todas las fichas que vinieron de la nube (incluye las solo lectura)
  unsubs: Map<string, (() => void)[]>;
  storeUnsub: () => void;
  interval: ReturnType<typeof setInterval> | null;
  pagehide: () => void;
  dirty: boolean;
  lastChangeAt: number;
  ticking: boolean;
}

let session: Session | null = null;
let sessionToken = 0;
let initialized = false;

const findChar = (id: string): CharacterSheet | undefined =>
  useCharacterStore.getState().characters.find((c) => c.id === id);

function putChar(sheet: CharacterSheet): void {
  useCharacterStore.setState((s) => {
    const exists = s.characters.some((c) => c.id === sheet.id);
    return { characters: exists ? s.characters.map((c) => (c.id === sheet.id ? sheet : c)) : [...s.characters, sheet] };
  });
}

const lastAt = (sheet: CharacterSheet | undefined): string | undefined => {
  const log = sheet?.ipLog;
  return log && log.length > 0 ? log[log.length - 1].at : undefined;
};

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

function watchLogs(s: Session, id: string): void {
  const unsubs = s.unsubs.get(id) ?? [];
  const listen = (field: LogField, afterKey: string | undefined) => {
    unsubs.push(
      s.repo.subscribeNewLogEntries(id, field, afterKey, (entries) => {
        if (session !== s) return;
        const cur = findChar(id);
        if (!cur) return;
        if (field === 'ipLog') {
          const merged = mergeIpLog(cur.ipLog, entries as unknown as IpLogEntry[]);
          if (merged.length !== (cur.ipLog?.length ?? 0)) putChar({ ...cur, ipLog: merged });
        } else {
          const merged = mergeTransactions(cur.transactions, entries as unknown as EurodollarTransaction[]);
          const same = merged.length === (cur.transactions?.length ?? 0) && merged.every((m, i) => m.id === cur.transactions?.[i]?.id);
          if (!same) putChar({ ...cur, transactions: merged });
        }
        s.engine.markLogsKnown(id, field, entries.map((e) => e.id));
      }),
    );
  };
  listen('ipLog', lastAt(findChar(id)));
  listen('transactions', undefined);
  s.unsubs.set(id, unsubs);
}

function logIdsOf(sheet: CharacterSheet, field: LogField): string[] {
  const arr = (field === 'ipLog' ? sheet.ipLog : sheet.transactions) as { id: string }[] | undefined;
  return (arr ?? []).map((e) => e.id);
}

async function loadRemoteCharacter(s: Session, id: string, data: Record<string, unknown>): Promise<void> {
  const remoteVersion = typeof data.schemaVersion === 'number' ? data.schemaVersion : 0;
  let sheet = { ...(fromSheetDoc(data) as unknown as CharacterSheet), id };
  const localExisting = findChar(id);

  // a) Ficha de una versión más nueva de la app: se muestra pero no se toca ni se sincroniza.
  const tooNew = remoteVersion > CHARACTERS_SCHEMA_VERSION;
  // b) Ficha vieja: se migra acá; el motor escribe la diferencia una sola vez.
  const needsMigration = remoteVersion < CHARACTERS_SCHEMA_VERSION;
  if (needsMigration) {
    sheet = { ...(runMigrations({ characters: [sheet] }, remoteVersion).state.characters[0] as CharacterSheet), id };
  }

  // c) Logs: si ya la teníamos, solo lo nuevo; si no, todo. Transacciones: las últimas 50.
  const [ipNew, txNew] = await Promise.all([
    s.repo.fetchLogEntries(id, 'ipLog', lastAt(localExisting)),
    s.repo.fetchLogEntries(id, 'transactions'),
  ]);
  const ipLog = mergeIpLog(localExisting?.ipLog, ipNew as unknown as IpLogEntry[]);
  const transactions = mergeTransactions(localExisting?.transactions, txNew as unknown as EurodollarTransaction[]);

  // d) La nube manda.
  putChar({ ...sheet, ipLog, transactions });
  s.owned.add(id);

  if (tooNew) {
    useCloudState.getState().setNeedsAppUpdate(true);
    return;
  }

  s.engine.track(id, data);
  s.tracked.add(id);
  s.engine.markLogsKnown(id, 'ipLog', ipLog.map((e) => e.id));
  s.engine.markLogsKnown(id, 'transactions', transactions.map((e) => e.id));
  if (needsMigration) {
    await s.repo.setSchemaVersion(id, CHARACTERS_SCHEMA_VERSION, s.writerId);
    s.engine.onLocalChange(id);
  }
  // e) Entradas nuevas que lleguen después.
  watchLogs(s, id);
}

function refreshCloudIds(s: Session): void {
  useCloudState.getState().setCloudIds([...s.owned]);
}

/**
 * Estado del chip. El motor no expone "pendientes", así que lo llevo acá: al cambiar una ficha se marca
 * `dirty`; cuando pasan 2 s sin cambios se hace flushAll() y recién ahí vuelve a 'saved'.
 */
async function tick(s: Session): Promise<void> {
  if (session !== s || s.ticking) return;
  s.ticking = true;
  try {
    const cs = useCloudState.getState();
    if (s.dirty && Date.now() - s.lastChangeAt >= QUIET_MS) {
      const stamp = s.lastChangeAt;
      await s.engine.flushAll();
      if (s.lastChangeAt === stamp) s.dirty = false;
    }
    if (session !== s) return;
    const quota = createQuotaGuard(localStorage);
    let next: ReturnType<typeof useCloudState.getState>['syncState'];
    if (cs.needsAppUpdate) next = 'readonly';
    else if (typeof navigator !== 'undefined' && navigator.onLine === false) next = 'offline';
    else if (quota.mode() === 'essential') next = 'paused';
    else if (s.dirty) next = 'saving';
    else next = 'saved';
    if (cs.syncState !== next) cs.setSyncState(next);
  } finally {
    s.ticking = false;
  }
}

async function startSession(uid: string): Promise<void> {
  if (session) await stopSession();
  const token = ++sessionToken;
  const cs = useCloudState.getState();
  cs.setSyncState('loading');
  cs.setLastError(null);
  cs.setNeedsAppUpdate(false);
  try {
    const handles = await getFirebase();
    if (token !== sessionToken) return;
    const repo = createFirestoreAdapter(handles, uid);
    const quota = createQuotaGuard(localStorage);
    const writerId = `${uid}_${getDeviceId()}`;
    const engine = createCharacterSync({
      adapter: repo,
      bridge: {
        getSheet: (id) => findChar(id),
        applyRemoteSheet: (id, sheet) => putChar({ ...sheet, id }),
      },
      writer: { writerId },
      quota,
      onError: (id, err) => {
        console.error('[nube] error guardando', id, err);
        useCloudState.getState().setLastError('No se pudo guardar una ficha en la nube: ' + errMsg(err));
      },
    });
    const s: Session = {
      uid, writerId, repo, engine,
      tracked: new Set(), owned: new Set(), unsubs: new Map(),
      storeUnsub: () => {}, interval: null, pagehide: () => {},
      dirty: false, lastChangeAt: 0, ticking: false,
    };
    session = s;

    const remote = await repo.listMyCharacters();
    for (const r of remote) {
      if (token !== sessionToken) return;
      try {
        await loadRemoteCharacter(s, r.id, r.data);
      } catch (e) {
        useCloudState.getState().setLastError('No se pudo cargar la ficha ' + r.id + ': ' + errMsg(e));
      }
    }
    if (token !== sessionToken) return;
    refreshCloudIds(s);

    s.storeUnsub = useCharacterStore.subscribe((state, prev) => {
      for (const id of s.tracked) {
        const now = state.characters.find((c) => c.id === id);
        const before = prev.characters.find((c) => c.id === id);
        if (now && now !== before) {
          s.dirty = true;
          s.lastChangeAt = Date.now();
          engine.onLocalChange(id);
        }
      }
    });
    s.pagehide = () => void engine.flushAll();
    window.addEventListener('pagehide', s.pagehide);
    s.interval = setInterval(() => void tick(s), 1000);
    useCloudState.getState().setSyncState(useCloudState.getState().needsAppUpdate ? 'readonly' : 'saved');
  } catch (e) {
    useCloudState.getState().setLastError('No se pudo conectar con la nube: ' + errMsg(e));
    useCloudState.getState().setSyncState('offline');
  }
}

export async function stopSession(): Promise<void> {
  sessionToken += 1;
  const s = session;
  if (!s) {
    useCloudState.getState().setSyncState('off');
    return;
  }
  session = null;
  if (s.interval !== null) clearInterval(s.interval);
  s.storeUnsub();
  window.removeEventListener('pagehide', s.pagehide);
  try {
    await s.engine.flushAll();
  } catch {
    // si falla el último guardado, igual se corta la sesión
  }
  await s.engine.dispose();
  for (const list of s.unsubs.values()) for (const u of list) u();

  // Las fichas de la nube se quitan de este dispositivo; siguen guardadas en la cuenta.
  useCharacterStore.setState((st) => {
    const characters = st.characters.filter((c) => !s.owned.has(c.id));
    const activeGone = s.owned.has(st.activeCharacterId);
    return {
      characters,
      activeCharacterId: activeGone && characters.length > 0 ? characters[0].id : st.activeCharacterId,
    };
  });
  const cs = useCloudState.getState();
  cs.setCloudIds([]);
  cs.setNeedsAppUpdate(false);
  cs.setUploading(false);
  cs.setSyncState('off');
}

export async function uploadCharacters(localIds: string[]): Promise<void> {
  const s = session;
  const cs = useCloudState.getState();
  if (!s) {
    cs.setLastError('No hay sesión en la nube.');
    return;
  }
  cs.setUploading(true);
  cs.setLastError(null);
  try {
    for (const localId of localIds) {
      const sheet = findChar(localId);
      if (!sheet) continue;
      try {
        const exists = await s.repo.docExists(localId);
        const newId = chooseUploadId(localId, exists, Date.now(), Math.random());
        const renamed: CharacterSheet = { ...sheet, id: newId };
        const data = await s.repo.createCharacter(newId, toSheetDoc(renamed), s.writerId);
        await s.repo.uploadLogEntries(newId, 'ipLog', (renamed.ipLog ?? []) as unknown as LogEntryDoc[]);
        await s.repo.uploadLogEntries(newId, 'transactions', (renamed.transactions ?? []) as unknown as LogEntryDoc[]);
        // Se cambia el id en el store (y el activo, si era este) antes de seguir la ficha.
        useCharacterStore.setState((st) => ({
          characters: st.characters.map((c) => (c.id === localId ? renamed : c)),
          activeCharacterId: st.activeCharacterId === localId ? newId : st.activeCharacterId,
        }));
        s.engine.track(newId, data);
        s.tracked.add(newId);
        s.owned.add(newId);
        s.engine.markLogsKnown(newId, 'ipLog', logIdsOf(renamed, 'ipLog'));
        s.engine.markLogsKnown(newId, 'transactions', logIdsOf(renamed, 'transactions'));
        watchLogs(s, newId);
        refreshCloudIds(s);
      } catch (e) {
        useCloudState.getState().setLastError('No se pudo subir la ficha "' + sheet.handle + '": ' + errMsg(e));
      }
    }
  } finally {
    useCloudState.getState().setUploading(false);
  }
}

/** Se llama una sola vez al arrancar la app: arranca/corta la sesión según el estado de la cuenta. */
export function initCloudSync(): void {
  if (initialized) return;
  initialized = true;
  // Guardar lo pendiente y cortar la sesión ANTES de cerrar la sesión de Firebase: después ya no hay permiso
  // para escribir y se perderían los últimos cambios. [Claude Code · 2026-10-24]
  registerBeforeSignOut(() => stopSession());
  const apply = (status: string, uid: string | undefined): void => {
    if (status === 'cloud' && uid) {
      if (session?.uid === uid) return;
      void startSession(uid);
    } else if (session) {
      void stopSession();
    }
  };
  useAuthStore.subscribe((st, prev) => {
    if (st.status === prev.status && st.user?.uid === prev.user?.uid) return;
    apply(st.status, st.user?.uid);
  });
  const cur = useAuthStore.getState();
  apply(cur.status, cur.user?.uid);
}
