// v5.1.0 [Claude Code · 2026-10-27]: mesa activa, reloj y era compartidos (plan 19, "Mesa activa" y punto 1).
// La mesa activa es una sola campaña por dispositivo: la elegida a mano o la de la ficha activa.
// Con mesa activa, el reloj y la era salen de la campaña (los escribe el GM) y cada dispositivo los copia a sus
// stores locales; los efectos del reloj van solo a sus fichas propias (gameClockStore.ownCharacterIds).
import { useCloudState } from './cloudState';
import { useAuthStore } from './authStore';
import type { CampaignDoc, TableClock, TableEra } from './campaignRepo';
import { getCampaignController } from './cloudCharacters';
import { useCharacterStore } from '../store/useCharacterStore';
import { useCombatStore } from '../store/useCombatStore';
import { useGameClockStore, setClockPublisher, ownCharacterIds } from '../store/gameClockStore';
import { useEncounterStore, pcCombatantId } from '../store/encounterStore';
import { getFirebase } from './firebaseClient';
import { createEncounterRepo, createTableLogRepo } from './encounterRepo';
import { createTableLogPublisher, gmActionToLog, useTableLog, TABLE_LOG_KEEP, type TableLogPublisher } from './tableLog';
import type { DeathSaveResult } from '../engine/characterEngine';
import { createEncounterSync, type EncounterAdapter, type EncounterSync } from './encounterSync';
import { startGmSecrets, stopGmSecrets, createGmSecretsRepo, GM_SECRET_LOCAL_KEYS, type GmSecretKind } from './gmSecrets';

export interface ActiveTable {
  table: CampaignDoc | null;
  isGm: boolean;
}

/** Elegida a mano (si sigo en esa campaña); si no, la de la ficha activa; si estoy en una sola campaña, esa. */
export function resolveActiveTable(
  campaigns: CampaignDoc[],
  explicitId: string | null,
  charCampaign: Record<string, string | null>,
  activeCharId: string | null
): CampaignDoc | null {
  const byId = (id: string | null | undefined) => (id ? campaigns.find((c) => c.id === id) ?? null : null);
  return byId(explicitId) ?? byId(activeCharId ? charCampaign[activeCharId] : null) ?? (campaigns.length === 1 ? campaigns[0] : null);
}

export function getActiveTable(): ActiveTable {
  const cs = useCloudState.getState();
  const uid = useAuthStore.getState().user?.uid ?? null;
  const table = uid
    ? resolveActiveTable(cs.campaigns, cs.activeTableId, cs.charCampaign, useCharacterStore.getState().activeCharacterId)
    : null;
  return { table, isGm: !!table && table.gmUid === uid };
}

/** Hook: la mesa activa y si soy su GM. */
export function useActiveTable(): ActiveTable {
  const campaigns = useCloudState((s) => s.campaigns);
  const explicitId = useCloudState((s) => s.activeTableId);
  const charCampaign = useCloudState((s) => s.charCampaign);
  const activeCharId = useCharacterStore((s) => s.activeCharacterId);
  const uid = useAuthStore((s) => s.user?.uid ?? null);
  const table = uid ? resolveActiveTable(campaigns, explicitId, charCampaign, activeCharId) : null;
  return { table, isGm: !!table && table.gmUid === uid };
}

const clockKey = (c: TableClock) => [c.session, c.day, c.beat];

/** -1, 0 o 1 según el orden (sesión, día, beat). */
export function compareClock(a: TableClock, b: TableClock): number {
  const ka = clockKey(a), kb = clockKey(b);
  for (let i = 0; i < 3; i++) if (ka[i] !== kb[i]) return ka[i] < kb[i] ? -1 : 1;
  return 0;
}

export interface ClockPlan {
  /** Copiar el reloj remoto al local. */
  adopt: boolean;
  /** Vencer Quick Fixes con este día (pasó al menos un día). */
  expireDay: number | null;
  /** Cerró al menos una sesión. */
  sessionEnded: boolean;
}

/**
 * Qué hacer cuando llega el reloj de la mesa. Los efectos corren solo si el remoto va adelante; si va atrás
 * (me uní a una mesa más nueva que mi reloj local) se copia sin efectos. El GM no retrocede su propio reloj
 * por un snapshot atrasado (sus escrituras en vuelo). Los dos efectos se pueden repetir sin cambiar nada
 * (Quick Fix vencido queda vencido; Core p.154: tope de Loyalty y renuncias), por eso no hace falta marca por ficha.
 */
export function planClockSync(local: TableClock, remote: TableClock, isGm: boolean): ClockPlan {
  const cmp = compareClock(remote, local);
  if (cmp === 0 || (cmp < 0 && isGm)) return { adopt: false, expireDay: null, sessionEnded: false };
  if (cmp < 0) return { adopt: true, expireDay: null, sessionEnded: false };
  const dayChanged = remote.session > local.session || remote.day > local.day;
  return { adopt: true, expireDay: dayChanged ? remote.day : null, sessionEnded: remote.session > local.session };
}

function localClock(): TableClock {
  const { session, day, beat } = useGameClockStore.getState();
  return { session, day, beat };
}

let lastTableId: string | null = null;
let lastIsGm = false;
/** Mesas a las que ya les subí el reloj o la era inicial (evita repetir mientras vuelve el snapshot). */
const seededClock = new Set<string>();
const seededEra = new Set<string>();

// Encuentro compartido de la mesa activa (plan 19, punto 3). [Claude Code · 2026-10-27]
let encounterSync: EncounterSync | null = null;
let encounterSession = 0;
// Log de la mesa (plan 19, punto 4).
let logPublisher: TableLogPublisher | null = null;
let logUnsubs: (() => void)[] = [];

export function getEncounterSync(): EncounterSync | null {
  return encounterSync;
}

/** Lo que el GM tiene en este dispositivo, para la primera copia a la campaña (v5.3.0, plan 20). */
function readLocalSecret(kind: GmSecretKind): unknown {
  try {
    const raw = localStorage.getItem(GM_SECRET_LOCAL_KEYS[kind]);
    if (kind === 'notes') return raw ?? '';
    return raw ? JSON.parse(raw) : [];
  } catch {
    return kind === 'notes' ? '' : [];
  }
}

function stopEncounterSync(): void {
  encounterSession += 1;
  stopGmSecrets();
  encounterSync?.stop();
  encounterSync = null;
  for (const u of logUnsubs.splice(0)) u();
  logPublisher?.flush();
  logPublisher = null;
  useTableLog.getState().set([]);
}

function whoAmI(uid: string) {
  const ch = useCharacterStore.getState().getActiveCharacter?.();
  return { uid, charId: ch?.id, handle: ch?.handle ?? '' };
}

/**
 * Una campaña recién creada todavía puede no estar en el servidor: los listeners de la mesa fallan por permisos
 * y mueren. Se reabre la mesa (encuentro + log) unas veces, como la party en cloudCampaigns. [Claude Code · 2026-10-27]
 */
const TABLE_MAX_RETRIES = 5;
const TABLE_RETRY_MS = 1500;
let tableRetries = 0;
let tableRetryTimer: ReturnType<typeof setTimeout> | null = null;

function retryTable(campId: string, isGm: boolean, session: number): void {
  if (session !== encounterSession || tableRetryTimer) return;
  tableRetries += 1;
  if (tableRetries > TABLE_MAX_RETRIES) {
    console.error('[mesa] no se pudo abrir la mesa', campId);
    return;
  }
  tableRetryTimer = setTimeout(() => {
    tableRetryTimer = null;
    if (session === encounterSession) startEncounterSync(campId, isGm);
  }, TABLE_RETRY_MS);
}

function startTableLog(h: Awaited<ReturnType<typeof getFirebase>>, campId: string, isGm: boolean, uid: string, onListenError: () => void): void {
  const repo = createTableLogRepo(h, campId);
  const pub = createTableLogPublisher({
    adapter: repo,
    who: () => whoAmI(uid),
    initial: useCombatStore.getState().rollHistory,
    onError: (e) => console.warn('[mesa] log:', e),
  });
  logPublisher = pub;
  logUnsubs.push(useCombatStore.subscribe((s, prev) => {
    if (s.rollHistory !== prev.rollHistory) pub.onHistory(s.rollHistory);
  }));
  logUnsubs.push(repo.subscribe((entries) => useTableLog.getState().set(entries), (e) => {
    console.warn('[mesa] log:', e);
    onListenError();
  }));
  // El GM recorta a las últimas 200 al abrir la mesa (tiene permiso de borrar).
  if (isGm) void repo.trim(TABLE_LOG_KEEP).catch((e) => console.warn('[mesa] recorte del log:', e));
}

/** "Mostrar a la mesa" en una tirada que no es de combate. */
export function shareRollWithTable(rollId: string): void {
  useCombatStore.getState().shareRollWithTable(rollId);
}

/** El Death Save no pasa por rollHistory: se publica aparte. */
export function publishDeathSave(r: DeathSaveResult): void {
  logPublisher?.publishDeathSave(r);
}

/** v5.2.0 (plan 20): el GM actuó sobre la ficha de un PJ; queda en el log de la mesa. [Claude Code · 2026-10-28] */
export function publishGmAction(a: { targetCharId: string; targetHandle: string; label: string; detail?: string; total?: number }): void {
  const uid = useAuthStore.getState().user?.uid;
  if (!uid || !logPublisher) return;
  logPublisher.publishEntry(gmActionToLog(a, { uid }));
}

export function hasTableLog(): boolean {
  return logPublisher !== null;
}

function startEncounterSync(campId: string, isGm: boolean): void {
  stopEncounterSync();
  const uid = useAuthStore.getState().user?.uid;
  if (!uid) return;
  const session = encounterSession;
  void getFirebase().then((h) => {
    if (session !== encounterSession) return; // cambió la mesa mientras cargaba
    const onListenError = () => retryTable(campId, isGm, session);
    const repo = createEncounterRepo(h, campId);
    const adapter: EncounterAdapter = {
      ...repo,
      subscribeHead: (cb, onError) => repo.subscribeHead(cb, (e) => { onError?.(e); onListenError(); }),
      subscribeCombatants: (cb, onError) => repo.subscribeCombatants(cb, (e) => { onError?.(e); onListenError(); }),
    };
    const sync = createEncounterSync({
      adapter,
      role: isGm ? 'gm' : 'player',
      uid,
      ownerOf: (charId) => {
        const cs = useCloudState.getState();
        return cs.party[campId]?.[charId]?.ownerUid ?? (cs.playerOwners[charId] === undefined ? uid : undefined);
      },
      onError: (e) => console.warn('[mesa] encuentro compartido:', e),
    });
    encounterSync = sync;
    sync.start();
    startTableLog(h, campId, isGm, uid, onListenError);
    // v5.3.0 (plan 20, B.1): secretos del GM de esta campaña. [Claude Code · 2026-10-28]
    if (isGm) {
      startGmSecrets({
        campId,
        campName: getActiveTable().table?.name ?? '',
        adapter: createGmSecretsRepo(h, campId),
        readLocal: readLocalSecret,
        onError: (e) => console.warn('[mesa] secretos del GM:', e),
      });
    }
  }).catch((e) => console.warn('[mesa] no se pudo abrir el encuentro compartido:', e));
}

/** Iniciativa del PJ propio (botón Iniciativa del HUD): entra al encuentro y, con mesa, a la mesa. */
export function recordMyInitiative(charId: string, name: string, initiative: number): void {
  if (encounterSync) {
    void encounterSync.setMyInitiative(charId, name, initiative);
    return;
  }
  useEncounterStore.getState().addPc(charId, name);
  useEncounterStore.getState().setInitiative(pcCombatantId(charId), initiative);
}

/** Aplica la mesa activa a los stores locales. Exportada para los tests. */
export function syncActiveTable(): void {
  const { table, isGm } = getActiveTable();
  if (!table) {
    if (lastTableId) {
      setClockPublisher(null);
      stopEncounterSync();
    }
    lastTableId = null;
    lastIsGm = false;
    return;
  }

  if (table.id !== lastTableId || isGm !== lastIsGm) {
    const campId = table.id;
    setClockPublisher(isGm ? (clock) => void getCampaignController()?.setTableClock(campId, clock).catch(() => {}) : null);
    lastTableId = table.id;
    lastIsGm = isGm;
    tableRetries = 0;
    if (!encounterSyncDisabled) startEncounterSync(campId, isGm);
  }

  const ctl = getCampaignController();

  if (table.clock) {
    const plan = planClockSync(localClock(), table.clock, isGm);
    if (plan.adopt) {
      const own = ownCharacterIds();
      if (plan.expireDay !== null) useCharacterStore.getState().expireQuickFixes(plan.expireDay, own);
      if (plan.sessionEnded) useCharacterStore.getState().applyEndOfSessionToAll(own);
      useGameClockStore.setState({ session: table.clock.session, day: table.clock.day, beat: table.clock.beat });
    }
  } else if (isGm && ctl && !seededClock.has(table.id)) {
    seededClock.add(table.id);
    void ctl.setTableClock(table.id, localClock()).catch(() => seededClock.delete(table.id));
  }

  const localEra = useCombatStore.getState().era;
  if (table.era) {
    if (table.era !== localEra) useCombatStore.getState().setEra(table.era);
  } else if (isGm && ctl && !seededEra.has(table.id)) {
    seededEra.add(table.id);
    void ctl.setTableEra(table.id, localEra).catch(() => seededEra.delete(table.id));
  }
}

/** Cambio de era desde el selector: con mesa, solo el GM, y se publica en la campaña. Devuelve false si no se pudo. */
export function chooseEra(era: TableEra): boolean {
  const { table, isGm } = getActiveTable();
  if (table && !isGm) return false;
  useCombatStore.getState().setEra(era);
  if (table) void getCampaignController()?.setTableEra(table.id, era).catch(() => {});
  return true;
}

let started = false;
/** En los tests de reloj y era no se abre Firestore. */
let encounterSyncDisabled = false;
export function disableEncounterSyncForTests(): void {
  encounterSyncDisabled = true;
}

/** Se llama una vez al arrancar la app (App.tsx). */
export function startTableSync(): void {
  if (started) return;
  started = true;
  useCloudState.subscribe(syncActiveTable);
  useCharacterStore.subscribe((s, prev) => {
    if (s.activeCharacterId !== prev.activeCharacterId) syncActiveTable();
  });
  useAuthStore.subscribe(syncActiveTable);
  syncActiveTable();
}
