// [Claude Code · 2026-10-24] v5.0.0 (plan 16/17): une el motor de sync, Firestore y el store de fichas.
// Cuando el usuario entra a la nube se bajan sus fichas (la nube manda); al salir se quitan del dispositivo.
import type { CharacterSheet, EurodollarTransaction, IpLogEntry } from '../types/cyberpunk';
import { useCharacterStore } from '../store/useCharacterStore';
import { CHARACTERS_SCHEMA_VERSION, runMigrations } from '../store/persistence';
import { registerBeforeSignOut, useAuthStore } from './authStore';
import { getFirebase } from './firebaseClient';
import { createFirestoreAdapter, type CloudRepo, type LogEntryDoc, type TransferInfo } from './firestoreAdapter';
import { createCharacterSync } from './characterSync';
import { createQuotaGuard } from './quotaGuard';
import { fromSheetDoc, toSheetDoc, type LogField } from './sheetDoc';
import { getDeviceId, useCloudState } from './cloudState';
import { createCampaignRepo } from './campaignRepo';
import { createCampaignController, type CampaignController } from './cloudCampaigns';
import { TRANSFER_TTL_MS, campaignIdsAfterClaim, newTransferCode, parseTransferCode } from './transferCode';

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
  playerIds: Set<string>; // fichas de jugadores cargadas por ser GM (plan 18)
  unsubs: Map<string, (() => void)[]>;
  storeUnsub: () => void;
  interval: ReturnType<typeof setInterval> | null;
  pagehide: () => void;
  dirty: boolean;
  lastChangeAt: number;
  ticking: boolean;
  campaigns: CampaignController | null; // plan 18
}

let session: Session | null = null;
let sessionToken = 0;
let initialized = false;

const findChar = (id: string): CharacterSheet | undefined =>
  useCharacterStore.getState().characters.find((c) => c.id === id);

// putChar solo escribe lo que vino de la nube: la marca evita republicar el resumen de party (sin eco). [Claude Code · 2026-10-24]
let applyingRemote = false;

function putChar(sheet: CharacterSheet): void {
  applyingRemote = true;
  try {
    useCharacterStore.setState((s) => {
      const exists = s.characters.some((c) => c.id === sheet.id);
      return { characters: exists ? s.characters.map((c) => (c.id === sheet.id ? sheet : c)) : [...s.characters, sheet] };
    });
  } finally {
    applyingRemote = false;
  }
}

/** Acciones de campaña de la sesión actual (null sin sesión). Plan 18. */
export function getCampaignController(): CampaignController | null {
  return session?.campaigns ?? null;
}

const campaignIdOf = (data: Record<string, unknown>): string | null =>
  Array.isArray(data.campaignIds) && typeof data.campaignIds[0] === 'string' ? data.campaignIds[0] : null;

function setCharCampaign(id: string, campId: string | null): void {
  useCloudState.setState((st) => ({ charCampaign: { ...st.charCampaign, [id]: campId } }));
}

function myCloudIds(s: Session): string[] {
  const players = useCloudState.getState().playerOwners;
  return [...s.owned].filter((id) => players[id] === undefined && !s.playerIds.has(id));
}

/** GM: deja de seguir la ficha de un jugador y la quita de este dispositivo (sigue en la nube). */
async function dropPlayerSheet(s: Session, id: string): Promise<void> {
  if (session !== s || !s.playerIds.has(id)) return;
  await s.engine.untrack(id);
  for (const u of s.unsubs.get(id) ?? []) u();
  s.unsubs.delete(id);
  s.tracked.delete(id);
  s.owned.delete(id);
  s.playerIds.delete(id);
  useCharacterStore.setState((st) => {
    const characters = st.characters.filter((c) => c.id !== id);
    return {
      characters,
      activeCharacterId: st.activeCharacterId === id && characters.length > 0 ? characters[0].id : st.activeCharacterId,
    };
  });
  refreshCloudIds(s);
}

/**
 * v5.10.0 (plan 24): la ficha pasó a otro jugador (o se perdió el permiso). Se deja de seguir y se quita de este
 * dispositivo. Si soy el GM de su campaña, el controlador de campañas la vuelve a cargar como ficha de jugador.
 * [Claude Code · 2026-11-04]
 */
async function dropLostSheet(s: Session, id: string): Promise<void> {
  if (session !== s || !s.owned.has(id) || s.playerIds.has(id)) return;
  const handle = findChar(id)?.handle ?? 'La ficha';
  s.owned.delete(id);
  s.tracked.delete(id);
  try {
    await s.engine.untrack(id);
  } catch {
    // lo pendiente ya no se puede guardar: la ficha es de otro
  }
  for (const u of s.unsubs.get(id) ?? []) u();
  s.unsubs.delete(id);
  useCharacterStore.setState((st) => {
    const characters = st.characters.filter((c) => c.id !== id);
    return {
      characters,
      activeCharacterId: st.activeCharacterId === id && characters.length > 0 ? characters[0].id : st.activeCharacterId,
    };
  });
  useCloudState.setState((st) => {
    const pendingTransfers = { ...st.pendingTransfers };
    delete pendingTransfers[id];
    const charCampaign = { ...st.charCampaign };
    delete charCampaign[id];
    return { pendingTransfers, charCampaign, transferNotice: `${handle} ahora es de otro jugador.` };
  });
  refreshCloudIds(s);
}

const isDenied = (e: unknown): boolean =>
  typeof e === 'object' && e !== null && (e as { code?: unknown }).code === 'permission-denied';

/** Código activo de una ficha propia según el documento de la nube; busca el vencimiento una sola vez. */
function notePendingTransfer(s: Session, id: string, data: Record<string, unknown>): void {
  const code = typeof data.transferCode === 'string' ? data.transferCode : null;
  const cur = useCloudState.getState().pendingTransfers[id];
  if ((cur?.code ?? null) === code) return;
  useCloudState.setState((st) => {
    const pendingTransfers = { ...st.pendingTransfers };
    if (code) pendingTransfers[id] = { code, expiresAt: null };
    else delete pendingTransfers[id];
    return { pendingTransfers };
  });
  if (!code) return;
  void s.repo.getTransfer(code).then((t) => {
    if (session !== s || useCloudState.getState().pendingTransfers[id]?.code !== code) return;
    useCloudState.setState((st) => ({ pendingTransfers: { ...st.pendingTransfers, [id]: { code, expiresAt: t?.expiresAt ?? 0 } } }));
  }).catch(() => { /* sin vencimiento a la vista; el código igual vale */ });
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
    if (s.campaigns) await s.campaigns.tick(Date.now());
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
    const repo = createFirestoreAdapter(handles, uid, {
      onDocError: (id, err) => {
        const cur = session;
        if (cur && isDenied(err) && cur.owned.has(id) && !cur.playerIds.has(id)) void dropLostSheet(cur, id);
        else console.error('[nube] error escuchando la ficha', id, err);
      },
    });
    const quota = createQuotaGuard(localStorage);
    const writerId = `${uid}_${getDeviceId()}`;
    const engine = createCharacterSync({
      // subscribeDoc también avisa la campaña asignada de mis fichas (campaignIds no viaja en la ficha).
      adapter: {
        ...repo,
        subscribeDoc: (id, cb) => repo.subscribeDoc(id, (data, info) => {
          if (data && session?.owned.has(id) && !session.playerIds.has(id)) {
            // Plan 24: si la ficha ya es de otro (sigo viéndola por ser su GM), deja de ser mía en este dispositivo.
            if (typeof data.ownerUid === 'string' && data.ownerUid !== uid) {
              void dropLostSheet(session, id);
              return;
            }
            const campId = campaignIdOf(data);
            if (useCloudState.getState().charCampaign[id] !== campId) setCharCampaign(id, campId);
            notePendingTransfer(session, id, data);
          }
          cb(data, info);
        }),
      },
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
      tracked: new Set(), owned: new Set(), playerIds: new Set(), unsubs: new Map(),
      storeUnsub: () => {}, interval: null, pagehide: () => {},
      dirty: false, lastChangeAt: 0, ticking: false, campaigns: null,
    };
    session = s;

    const remote = await repo.listMyCharacters();
    useCloudState.setState({ charCampaign: Object.fromEntries(remote.map((r) => [r.id, campaignIdOf(r.data)])) });
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
          s.campaigns?.onSheetChanged(id, applyingRemote);
        }
      }
    });
    s.pagehide = () => void engine.flushAll();
    window.addEventListener('pagehide', s.pagehide);
    s.interval = setInterval(() => void tick(s), 1000);

    // Campañas (plan 18).
    const authUser = useAuthStore.getState().user;
    s.campaigns = createCampaignController({
      uid,
      myName: authUser?.displayName || authUser?.email?.split('@')[0] || 'Jugador',
      writerId,
      repo: createCampaignRepo(handles, uid),
      getSheet: (id) => findChar(id),
      myCloudIds: () => myCloudIds(s),
      loadPlayerSheet: async (charId) => {
        if (session !== s || s.owned.has(charId)) return true;
        const data = await repo.getCharacter(charId);
        if (!data || session !== s) return false;
        s.playerIds.add(charId);
        try {
          await loadRemoteCharacter(s, charId, data);
        } catch (e) {
          s.playerIds.delete(charId);
          throw e;
        }
        refreshCloudIds(s);
        return true;
      },
      dropPlayerSheet: (charId) => dropPlayerSheet(s, charId),
    });
    s.campaigns.start();
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
  s.campaigns?.stop();
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
  useCloudState.setState({ charCampaign: {}, pendingTransfers: {}, transferNotice: null });
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
        setCharCampaign(newId, null);
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

// ---------------------------------------------------------------------------
// v5.10.0 (plan 24): pasarle una ficha a otro jugador. [Claude Code · 2026-11-04]
// ---------------------------------------------------------------------------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** El freno por escritor rechaza dos escrituras del mismo dispositivo en menos de 1 s: se guarda lo pendiente y se reintenta una vez. */
async function withWriterRetry<T>(s: Session, fn: () => Promise<T>): Promise<T> {
  await s.engine.flushAll();
  try {
    return await fn();
  } catch (e) {
    if (!isDenied(e)) throw e;
    await sleep(1200);
    return fn();
  }
}

/** Crea el código para pasar una ficha propia de la nube. Devuelve el código y su vencimiento. */
export async function offerTransfer(id: string): Promise<{ code: string; expiresAt: number }> {
  const s = session;
  const sheet = findChar(id);
  if (!s || !sheet || !s.owned.has(id) || s.playerIds.has(id)) throw new Error('Esa ficha no es tuya en la nube.');
  if (useCloudState.getState().pendingTransfers[id]) await cancelOfferedTransfer(id);
  const user = useAuthStore.getState().user;
  const code = newTransferCode();
  const info: TransferInfo = {
    charId: id,
    fromUid: s.uid,
    fromName: user?.displayName || user?.email?.split('@')[0] || 'Jugador',
    handle: sheet.handle,
    role: sheet.role,
    roleRank: sheet.roleRank,
    campaignId: useCloudState.getState().charCampaign[id] ?? null,
    // Un minuto menos que el tope de las reglas, por si el reloj del dispositivo adelanta.
    expiresAt: Date.now() + TRANSFER_TTL_MS - 60_000,
  };
  await withWriterRetry(s, () => s.repo.createTransfer(code, info, s.writerId));
  useCloudState.setState((st) => ({ pendingTransfers: { ...st.pendingTransfers, [id]: { code, expiresAt: info.expiresAt } } }));
  return { code, expiresAt: info.expiresAt };
}

/** Cancela el código activo de una ficha propia: la ficha sigue siendo tuya. */
export async function cancelOfferedTransfer(id: string): Promise<void> {
  const s = session;
  const pending = useCloudState.getState().pendingTransfers[id];
  if (!s || !pending) return;
  await withWriterRetry(s, () => s.repo.cancelTransfer(pending.code, id, s.writerId));
  useCloudState.setState((st) => {
    const pendingTransfers = { ...st.pendingTransfers };
    delete pendingTransfers[id];
    return { pendingTransfers };
  });
}

export type TransferPreview =
  | { ok: true; code: string; info: TransferInfo }
  | { ok: false; error: string };

/** Lo que ve el que recibe antes de aceptar. */
export async function previewTransfer(input: string): Promise<TransferPreview> {
  const s = session;
  if (!s) return { ok: false, error: 'Entrá con tu cuenta de Google para recibir una ficha.' };
  const code = parseTransferCode(input);
  if (!code) return { ok: false, error: 'Ese código no tiene la forma correcta (10 letras y números, ej. K7P4Q-X9M2R).' };
  const info = await s.repo.getTransfer(code);
  if (!info) return { ok: false, error: 'No existe ese código. Puede que ya se haya usado o que lo hayan cancelado.' };
  if (info.fromUid === s.uid) return { ok: false, error: 'Es tu propia ficha: el código es para que la reciba otra cuenta.' };
  if (info.expiresAt <= Date.now()) return { ok: false, error: 'El código venció (duran 24 horas). Pedí uno nuevo.' };
  return { ok: true, code, info };
}

/** Recibe la ficha: queda en mi cuenta, con sus historiales. Devuelve el nombre de la ficha. */
export async function acceptTransfer(input: string): Promise<string> {
  const pre = await previewTransfer(input);
  if (!pre.ok) throw new Error(pre.error);
  const s = session;
  if (!s) throw new Error('No hay sesión en la nube.');
  const myCamps = useCloudState.getState().campaigns.map((c) => c.id);
  const campaignIds = campaignIdsAfterClaim(pre.info.campaignId ? [pre.info.campaignId] : [], myCamps);
  const { charId } = pre.info;
  try {
    await s.repo.claimTransfer(charId, campaignIds, s.writerId);
  } catch (e) {
    if (isDenied(e)) throw new Error('No se pudo recibir la ficha: el código ya no vale. Pedí uno nuevo.');
    throw e;
  }
  try {
    await s.repo.deleteTransfer(pre.code);
  } catch {
    // el código ya no sirve (la ficha no lo tiene); que quede no molesta
  }
  // Si yo era el GM y la tenía cargada como ficha de jugador, pasa a ser mía.
  if (s.playerIds.has(charId)) {
    await dropPlayerSheet(s, charId);
    useCloudState.setState((st) => {
      const playerOwners = { ...st.playerOwners };
      delete playerOwners[charId];
      return { playerOwners };
    });
  }
  const data = await s.repo.getCharacter(charId);
  if (!data || session !== s) throw new Error('La ficha se recibió pero no se pudo cargar: actualizá la página.');
  setCharCampaign(charId, campaignIdOf(data));
  await loadRemoteCharacter(s, charId, data);
  refreshCloudIds(s);
  useCharacterStore.setState({ activeCharacterId: charId });
  return pre.info.handle;
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
