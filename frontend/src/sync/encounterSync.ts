// v5.1.0 [Claude Code · 2026-10-27]: encuentro compartido en la nube (plan 19, punto 3).
// Motor chico con el patrón de characterSync (base confirmada, sin eco), separado de él porque aquel está
// atado a la ficha. Firestore va detrás de un adaptador (encounterRepo.ts; en los tests, uno en memoria).
//
//   campaigns/{c}/encounters/current               round, turnIndex, order        (escribe el GM)
//   campaigns/{c}/encounters/current/combatants/x  vista pública                  (GM; el dueño de un PJ, su iniciativa)
//   campaigns/{c}/encounters/current/gmCombatants/x  enemigo completo, solo el GM
//
// GM: publica lo que cambió del encounterStore (agrupado, ENCOUNTER_FLUSH_MS); la vista pública de un enemigo
// cambia solo si cambia su estado de heridas (plan 17, punto 12). Toma de la mesa la iniciativa que tiran los jugadores.
// Jugador: copia la vista pública al encounterStore y solo escribe la iniciativa de su PJ.
import {
  useEncounterStore,
  computeOrder,
  pcCombatantId,
  revealOf,
  type RevealedEnemy,
  type EncounterCombatant,
  type EncounterData,
  type EncounterEnemy,
  type WoundState
} from '../store/encounterStore';
import { woundStateForStabilization } from '../engine/medicalRules';
import { calculateSeriouslyWoundedThreshold } from '../engine/characterEngine';

export const ENCOUNTER_FLUSH_MS = 600;

export interface EncounterHead {
  round: number;
  turnIndex: number;
  order: string[];
}

/** Lo que ve toda la mesa de cada combatiente. */
export interface PublicCombatant {
  kind: 'pc' | 'enemy';
  name: string;
  initiative: number | null;
  woundState?: WoundState;
  threatTier?: string;
  charId?: string;
  ownerUid?: string;
  /** v5.3.0 (plan 20, B.2): ficha pública de un enemigo que reveló el GM (sin HP). */
  reveal?: RevealedEnemy;
}

export type CombatantColl = 'combatants' | 'gmCombatants';

export interface EncounterCommit {
  head?: EncounterHead;
  set: { coll: CombatantColl; id: string; data: Record<string, unknown> }[];
  del: { coll: CombatantColl; id: string }[];
}

export interface EncounterAdapter {
  subscribeHead(cb: (head: EncounterHead | null) => void, onError?: (e: unknown) => void): () => void;
  subscribeCombatants(cb: (list: { id: string; data: PublicCombatant }[]) => void, onError?: (e: unknown) => void): () => void;
  loadGmCombatants(): Promise<Record<string, EncounterEnemy>>;
  commit(c: EncounterCommit): Promise<void>;
  /** El jugador crea o actualiza su PJ en la vista pública (solo iniciativa después de creado). */
  writeMyPc(id: string, data: PublicCombatant, exists: boolean): Promise<void>;
}

export interface EncounterSyncOptions {
  adapter: EncounterAdapter;
  role: 'gm' | 'player';
  uid: string;
  /** Dueño de una ficha (para la vista pública de los PJ que agrega el GM). */
  ownerOf: (charId: string) => string | undefined;
  onError?: (e: unknown) => void;
  flushMs?: number;
}

export function enemyWoundState(e: EncounterEnemy): WoundState {
  return woundStateForStabilization(e.currentHp, e.maxHp, calculateSeriouslyWoundedThreshold(e.maxHp));
}

export function toPublic(c: EncounterCombatant, ownerOf: (charId: string) => string | undefined): PublicCombatant {
  if (c.kind === 'pc') {
    const out: PublicCombatant = { kind: 'pc', name: c.name, initiative: c.initiative };
    if (c.charId) out.charId = c.charId;
    const owner = c.ownerUid ?? (c.charId ? ownerOf(c.charId) : undefined);
    if (owner) out.ownerUid = owner;
    return out;
  }
  const out: PublicCombatant = { kind: 'enemy', name: c.name, initiative: c.initiative };
  if (c.enemy) {
    out.woundState = enemyWoundState(c.enemy);
    out.threatTier = c.enemy.threatTier;
    if (c.revealed) out.reveal = revealOf(c.enemy);
  } else if (c.woundState) {
    out.woundState = c.woundState;
  }
  return out;
}

export function parsePublic(data: Record<string, unknown>): PublicCombatant | null {
  if ((data.kind !== 'pc' && data.kind !== 'enemy') || typeof data.name !== 'string') return null;
  const out: PublicCombatant = {
    kind: data.kind,
    name: data.name,
    initiative: typeof data.initiative === 'number' ? data.initiative : null
  };
  if (['none', 'light', 'serious', 'mortal'].includes(data.woundState as string)) out.woundState = data.woundState as WoundState;
  if (typeof data.threatTier === 'string') out.threatTier = data.threatTier;
  if (typeof data.charId === 'string') out.charId = data.charId;
  if (typeof data.ownerUid === 'string') out.ownerUid = data.ownerUid;
  const r = data.reveal as Record<string, unknown> | undefined;
  if (r && typeof r === 'object' && typeof r.headSp === 'number' && typeof r.bodySp === 'number') {
    const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
    out.reveal = { headSp: r.headSp, bodySp: r.bodySp, weapons: strs(r.weapons), specialRules: strs(r.specialRules) };
    if (typeof r.subtitle === 'string') out.reveal.subtitle = r.subtitle;
    if (typeof r.faction === 'string') out.reveal.faction = r.faction;
    if (typeof r.threatTier === 'string') out.reveal.threatTier = r.threatTier;
  }
  return out;
}

export function parseHead(data: Record<string, unknown> | null | undefined): EncounterHead | null {
  if (!data) return null;
  const round = typeof data.round === 'number' && data.round >= 1 ? data.round : 1;
  const turnIndex = typeof data.turnIndex === 'number' && data.turnIndex >= 0 ? data.turnIndex : 0;
  const order = Array.isArray(data.order) ? data.order.filter((x): x is string => typeof x === 'string') : [];
  return { round, turnIndex, order };
}

/** Encuentro que ve un jugador: la vista pública, en el orden del GM. */
export function publicToEncounter(head: EncounterHead | null, list: { id: string; data: PublicCombatant }[]): EncounterData {
  const combatants: EncounterCombatant[] = list.map(({ id, data }) => ({
    id,
    kind: data.kind,
    name: data.name,
    initiative: data.initiative,
    charId: data.charId,
    ownerUid: data.ownerUid,
    woundState: data.woundState,
    reveal: data.reveal
  }));
  const ids = new Set(combatants.map((c) => c.id));
  const known = (head?.order ?? []).filter((id) => ids.has(id));
  const order = known.length === combatants.length ? known : computeOrder(combatants);
  const turnIndex = Math.min(head?.turnIndex ?? 0, Math.max(0, order.length - 1));
  return { round: head?.round ?? 1, turnIndex, combatants, order };
}

const key = (v: unknown) => JSON.stringify(v);

export function createEncounterSync(opts: EncounterSyncOptions) {
  const { adapter, role, uid, ownerOf } = opts;
  const flushMs = opts.flushMs ?? ENCOUNTER_FLUSH_MS;
  const onError = (e: unknown) => opts.onError?.(e);

  /** Lo último que sé que está en la nube (escrito por mí o recibido), como JSON. */
  const confirmed = { head: null as string | null, combatants: new Map<string, string>(), gm: new Map<string, string>() };
  let head: EncounterHead | null = null;
  let headSeen = false;
  let publicList: { id: string; data: PublicCombatant }[] = [];
  let listSeen = false;
  let ready = role === 'player';
  let loading = false;
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let flushing: Promise<void> | null = null;
  const unsubs: (() => void)[] = [];

  function desired() {
    const s = useEncounterStore.getState();
    const pub = new Map<string, string>();
    const gm = new Map<string, string>();
    const pubData = new Map<string, PublicCombatant>();
    const gmData = new Map<string, EncounterEnemy>();
    for (const c of s.combatants) {
      const p = toPublic(c, ownerOf);
      pub.set(c.id, key(p));
      pubData.set(c.id, p);
      if (c.enemy) {
        gm.set(c.id, key(c.enemy));
        gmData.set(c.id, c.enemy);
      }
    }
    const h: EncounterHead = { round: s.round, turnIndex: s.turnIndex, order: s.order };
    return { h, pub, gm, pubData, gmData };
  }

  async function flush(): Promise<void> {
    if (stopped || role !== 'gm' || !ready) return;
    const d = desired();
    const commit: EncounterCommit = { set: [], del: [] };
    if (key(d.h) !== confirmed.head) commit.head = d.h;
    for (const [id, k] of d.pub) if (confirmed.combatants.get(id) !== k) commit.set.push({ coll: 'combatants', id, data: { ...d.pubData.get(id)! } });
    for (const [id, k] of d.gm) if (confirmed.gm.get(id) !== k) commit.set.push({ coll: 'gmCombatants', id, data: { ...d.gmData.get(id)! } });
    for (const id of confirmed.combatants.keys()) if (!d.pub.has(id)) commit.del.push({ coll: 'combatants', id });
    for (const id of confirmed.gm.keys()) if (!d.gm.has(id)) commit.del.push({ coll: 'gmCombatants', id });
    if (!commit.head && commit.set.length === 0 && commit.del.length === 0) return;
    // Base confirmada optimista: el eco de esta escritura no se toma como cambio de otro.
    if (commit.head) confirmed.head = key(commit.head);
    for (const w of commit.set) (w.coll === 'combatants' ? confirmed.combatants : confirmed.gm).set(w.id, key(w.data));
    for (const w of commit.del) (w.coll === 'combatants' ? confirmed.combatants : confirmed.gm).delete(w.id);
    try {
      await adapter.commit(commit);
    } catch (e) {
      // Se pierde la base: el próximo flush vuelve a escribir todo lo que difiera.
      confirmed.head = null;
      confirmed.combatants.clear();
      confirmed.gm.clear();
      onError(e);
    }
  }

  function schedule(): void {
    if (stopped || role !== 'gm' || !ready) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      flushing = flush().finally(() => { flushing = null; });
    }, flushMs);
  }

  /** GM: lo que cambió otro en la vista pública (la iniciativa de un jugador) entra al store local. */
  function adoptForeignPcs(): void {
    for (const { id, data } of publicList) {
      const k = key(data);
      if (confirmed.combatants.get(id) === k) continue;
      confirmed.combatants.set(id, k);
      if (data.kind !== 'pc' || !data.charId) continue;
      const st = useEncounterStore.getState();
      const local = st.combatants.find((c) => c.id === id);
      if (!local) st.addPc(data.charId, data.name, data.ownerUid);
      if (local?.initiative !== data.initiative) useEncounterStore.getState().setInitiative(id, data.initiative);
    }
  }

  async function gmInitialLoad(): Promise<void> {
    // Base confirmada = lo que hay en la nube.
    confirmed.head = head ? key(head) : null;
    for (const { id, data } of publicList) confirmed.combatants.set(id, key(data));
    const local = useEncounterStore.getState();
    const remoteHasData = publicList.length > 0;
    if (remoteHasData) {
      const gm = await adapter.loadGmCombatants();
      for (const [id, e] of Object.entries(gm)) confirmed.gm.set(id, key(e));
      // Si este dispositivo no tiene encuentro, toma el de la nube (otro dispositivo del GM, o recargó).
      if (local.combatants.length === 0) {
        const data = publicToEncounter(head, publicList);
        data.combatants = data.combatants.map((c) => (gm[c.id] ? { ...c, enemy: gm[c.id], woundState: undefined, revealed: c.reveal ? true : undefined, reveal: undefined } : c));
        useEncounterStore.getState().applyRemote(data);
      } else {
        // Manda el encuentro local, pero los PJ que se sumaron solos desde su dispositivo se conservan.
        for (const { id, data } of publicList) {
          if (data.kind !== 'pc' || !data.charId || local.combatants.some((c) => c.id === id)) continue;
          useEncounterStore.getState().addPc(data.charId, data.name, data.ownerUid);
          useEncounterStore.getState().setInitiative(id, data.initiative);
        }
      }
    }
    ready = true;
    adoptForeignPcs();
    schedule();
  }

  function onRemote(): void {
    if (stopped || !headSeen || !listSeen) return;
    if (role === 'player') {
      useEncounterStore.getState().applyRemote(publicToEncounter(head, publicList));
      return;
    }
    if (!ready) {
      if (!loading) {
        loading = true;
        void gmInitialLoad().catch((e) => { loading = false; onError(e); });
      }
      return;
    }
    adoptForeignPcs();
  }

  return {
    start(): void {
      unsubs.push(adapter.subscribeHead((h) => {
        head = h;
        headSeen = true;
        if (role === 'gm' && ready && h) confirmed.head = key(h);
        onRemote();
      }, onError));
      unsubs.push(adapter.subscribeCombatants((list) => {
        publicList = list;
        listSeen = true;
        onRemote();
      }, onError));
      if (role === 'gm') unsubs.push(useEncounterStore.subscribe(schedule));
    },

    /** Iniciativa del PJ propio (botón del HUD). */
    async setMyInitiative(charId: string, name: string, initiative: number): Promise<void> {
      const st = useEncounterStore.getState();
      const id = pcCombatantId(charId);
      const existed = publicList.some((p) => p.id === id);
      st.addPc(charId, name, uid);
      useEncounterStore.getState().setInitiative(id, initiative);
      if (role === 'gm') return; // lo publica el flush
      const data: PublicCombatant = { kind: 'pc', name, initiative, charId, ownerUid: uid };
      try {
        await adapter.writeMyPc(id, existed ? ({ initiative } as PublicCombatant) : data, existed);
      } catch (e) {
        onError(e);
      }
    },

    /** Espera lo pendiente (para tests y al cerrar). */
    async flushNow(): Promise<void> {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        await flush();
      }
      if (flushing) await flushing;
    },

    stop(): void {
      if (role === 'gm' && timer) {
        clearTimeout(timer);
        timer = null;
        void flush();
      }
      stopped = true;
      for (const u of unsubs.splice(0)) u();
      // El jugador tenía una copia del encuentro del GM: no queda en el dispositivo al dejar la mesa
      // (si no, al ser GM de otra campaña la publicaría como propia). [Claude Code · 2026-10-27]
      if (role === 'player') useEncounterStore.setState({ round: 1, turnIndex: 0, combatants: [], order: [] });
    },

    get role() { return role; }
  };
}

export type EncounterSync = ReturnType<typeof createEncounterSync>;
