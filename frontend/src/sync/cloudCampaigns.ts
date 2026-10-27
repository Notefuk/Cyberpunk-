// [Claude Code · 2026-10-24] v5.0.0 (plan 18): campañas dentro de la sesión de nube.
// Escucha mis campañas y sus resúmenes de party, carga en el dispositivo del GM las fichas de sus jugadores
// (editables, decisión 1 del plan 18) y escribe el resumen de party cuando una ficha cambia en este dispositivo.
import type { CharacterSheet } from '../types/cyberpunk';
import type { CampaignDoc, CampaignRepo } from './campaignRepo';
import { buildPartySummary, parsePartySummary, sameSummary, type PartySummary } from './partySummary';
import { useCloudState } from './cloudState';

export interface CampaignHost {
  uid: string;
  myName: string;
  writerId: string;
  repo: CampaignRepo;
  getSheet(id: string): CharacterSheet | undefined;
  /** Ids de mis fichas de la nube (sin las de jugadores). */
  myCloudIds(): string[];
  /** Baja y sigue la ficha de un jugador (solo GM). false si no se pudo leer. */
  loadPlayerSheet(charId: string): Promise<boolean>;
  /** Deja de seguir la ficha de un jugador y la quita del dispositivo (no la borra de la nube). */
  dropPlayerSheet(charId: string): Promise<void>;
}

const PARTY_QUIET_MS = 2000;
const PARTY_RETRY_MS = 2000;
const PARTY_MAX_RETRIES = 5;
const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));
const isDenied = (e: unknown): boolean =>
  typeof e === 'object' && e !== null && (e as { code?: unknown }).code === 'permission-denied';

/**
 * La regla del freno (writerOk) rechaza dos escrituras del mismo escritor en menos de 1 s sobre la misma ficha.
 * Asignar la ficha justo después de un cambio de HP puede chocar: se reintenta pasado el segundo.
 */
async function withBrakeRetry(fn: () => Promise<void>): Promise<void> {
  for (let i = 0; ; i++) {
    try {
      await fn();
      return;
    } catch (e) {
      if (!isDenied(e) || i >= 2) throw e;
      await new Promise((r) => setTimeout(r, 1100));
    }
  }
}

export function createCampaignController(host: CampaignHost) {
  const { uid, repo } = host;
  const cs = () => useCloudState.getState();
  let campUnsub: (() => void) | null = null;
  const partyUnsubs = new Map<string, () => void>();
  const partyDirty = new Map<string, number>(); // charId -> último cambio local
  const playerCamp = new Map<string, string>(); // charId de jugador -> campId (solo GM)
  const loading = new Set<string>();
  const failed = new Set<string>();
  const partyRetries = new Map<string, number>();
  let stopped = false;

  const setError = (prefix: string, e: unknown) => cs().setLastError(prefix + errMsg(e));

  const campaignOf = (id: string): string | null => cs().charCampaign[id] ?? playerCamp.get(id) ?? null;

  const setCharCampaign = (id: string, campId: string | null) =>
    useCloudState.setState((st) => ({ charCampaign: { ...st.charCampaign, [id]: campId } }));

  const setPartyEntry = (campId: string, charId: string, summary: PartySummary | null) =>
    useCloudState.setState((st) => {
      const cur = { ...(st.party[campId] ?? {}) };
      if (summary) cur[charId] = summary;
      else delete cur[charId];
      return { party: { ...st.party, [campId]: cur } };
    });

  const writeSummary = async (campId: string, charId: string, summary: PartySummary) => {
    setPartyEntry(campId, charId, summary);
    await repo.writePartySummary(campId, charId, summary as unknown as Record<string, unknown>);
  };

  const ownSummary = (sheet: CharacterSheet) => buildPartySummary(sheet, uid, host.myName);

  /** Fichas de jugadores que tiene que ver el GM: las de la party de sus campañas que no son suyas. */
  function reconcilePlayers(): void {
    if (stopped) return;
    const { campaigns, party } = cs();
    const desired = new Map<string, { campId: string; ownerName: string }>();
    for (const c of campaigns) {
      if (c.gmUid !== uid) continue;
      for (const [charId, sum] of Object.entries(party[c.id] ?? {})) {
        if (sum.ownerUid === uid) continue;
        desired.set(charId, { campId: c.id, ownerName: c.memberNames[sum.ownerUid] ?? sum.ownerName });
      }
    }
    const owners: Record<string, string> = {};
    for (const [charId, info] of desired) {
      owners[charId] = info.ownerName;
      playerCamp.set(charId, info.campId);
      if (cs().playerOwners[charId] !== undefined || loading.has(charId) || failed.has(charId)) continue;
      loading.add(charId);
      void host.loadPlayerSheet(charId)
        .then((ok) => { if (!ok) failed.add(charId); })
        .catch((e) => { failed.add(charId); console.error('[nube] no se pudo cargar la ficha del jugador', charId, e); })
        .finally(() => {
          loading.delete(charId);
          if (stopped) return;
          if (!failed.has(charId)) useCloudState.setState((st) => ({ playerOwners: { ...st.playerOwners, [charId]: owners[charId] ?? '' } }));
        });
    }
    for (const charId of Object.keys(cs().playerOwners)) {
      if (desired.has(charId)) continue;
      playerCamp.delete(charId);
      partyDirty.delete(charId);
      useCloudState.setState((st) => {
        const next = { ...st.playerOwners };
        delete next[charId];
        return { playerOwners: next };
      });
      void host.dropPlayerSheet(charId);
    }
    for (const charId of [...failed]) if (!desired.has(charId)) failed.delete(charId);
  }

  /** Mis fichas asignadas a esta campaña sin resumen todavía (recién asignadas desde otro dispositivo). */
  function ensureMyEntries(campId: string): void {
    const entries = cs().party[campId] ?? {};
    for (const id of host.myCloudIds()) {
      if (cs().charCampaign[id] !== campId || entries[id]) continue;
      const sheet = host.getSheet(id);
      // Sin permiso = me acaban de echar (la lista de campañas todavía no se actualizó): no es un error.
      if (sheet) void writeSummary(campId, id, ownSummary(sheet)).catch((e) => { if (!isDenied(e)) setError('No se pudo publicar el resumen de party: ', e); });
    }
  }

  function syncPartySubs(list: CampaignDoc[]): void {
    const ids = new Set(list.map((c) => c.id));
    for (const c of list) {
      if (partyUnsubs.has(c.id)) continue;
      partyUnsubs.set(c.id, repo.subscribeParty(
        c.id,
        (entries) => {
          if (stopped) return;
          partyRetries.delete(c.id);
          const map: Record<string, PartySummary> = {};
          for (const e of entries) {
            const sum = parsePartySummary(e.data);
            if (sum) map[e.charId] = sum;
          }
          useCloudState.setState((st) => ({ party: { ...st.party, [c.id]: map } }));
          ensureMyEntries(c.id);
          reconcilePlayers();
        },
        // Una campaña recién creada todavía puede no estar en el servidor (la lista sale del caché con la
        // escritura pendiente): la regla falla y el listener muere. Se reintenta unas veces.
        (e) => {
          partyUnsubs.delete(c.id);
          const n = (partyRetries.get(c.id) ?? 0) + 1;
          partyRetries.set(c.id, n);
          // Los reintentos son normales al crear una campaña: aviso; solo el último fallo es error. [Claude Code · 2026-10-27]
          (n <= PARTY_MAX_RETRIES ? console.warn : console.error)('[nube] error escuchando la party', c.id, e);
          if (n <= PARTY_MAX_RETRIES) setTimeout(() => { if (!stopped) syncPartySubs(cs().campaigns); }, PARTY_RETRY_MS);
        },
      ));
    }
    for (const [campId, unsub] of partyUnsubs) {
      if (ids.has(campId)) continue;
      unsub();
      partyUnsubs.delete(campId);
      useCloudState.setState((st) => {
        const next = { ...st.party };
        delete next[campId];
        return { party: next };
      });
    }
  }

  /** Fichas mías que apuntan a una campaña de la que ya no soy miembro (me echaron): se liberan. */
  function cleanupOrphans(list: CampaignDoc[]): void {
    const ids = new Set(list.map((c) => c.id));
    for (const id of host.myCloudIds()) {
      const campId = cs().charCampaign[id];
      if (!campId || ids.has(campId)) continue;
      setCharCampaign(id, null);
      void withBrakeRetry(() => repo.assignCharacter(id, null, host.writerId))
        .catch((e) => setError('No se pudo liberar la ficha de la campaña: ', e));
    }
  }

  return {
    start(): void {
      campUnsub = repo.subscribeMyCampaigns(
        (list, info) => {
          if (stopped) return;
          useCloudState.setState({ campaigns: list });
          syncPartySubs(list);
          reconcilePlayers();
          if (!info.fromCache) cleanupOrphans(list);
        },
        (e) => setError('No se pudieron leer las campañas: ', e),
      );
    },

    stop(): void {
      stopped = true;
      campUnsub?.();
      for (const u of partyUnsubs.values()) u();
      partyUnsubs.clear();
      useCloudState.setState({ campaigns: [], party: {}, playerOwners: {} });
    },

    /** Lo llama la sesión con cada cambio del store; `remote` = vino de la nube (no se republica: sin eco). */
    onSheetChanged(id: string, remote: boolean): void {
      if (remote || !campaignOf(id)) return;
      partyDirty.set(id, Date.now());
    },

    /** Cada 1 s: publica el resumen de las fichas que cambiaron acá, si pasaron 2 s y el resumen cambió. */
    async tick(now: number): Promise<void> {
      for (const [id, at] of [...partyDirty]) {
        if (now - at < PARTY_QUIET_MS) continue;
        partyDirty.delete(id);
        const campId = campaignOf(id);
        const sheet = host.getSheet(id);
        if (!campId || !sheet) continue;
        const prev = cs().party[campId]?.[id];
        const summary = playerCamp.has(id)
          ? buildPartySummary(sheet, prev?.ownerUid ?? '', prev?.ownerName ?? '')
          : ownSummary(sheet);
        if (playerCamp.has(id) && !prev) continue;
        if (sameSummary(summary, prev)) continue;
        try {
          await writeSummary(campId, id, summary);
        } catch (e) {
          if (!isDenied(e)) setError('No se pudo publicar el resumen de party: ', e);
        }
      }
    },

    async createCampaign(name: string): Promise<void> {
      await repo.createCampaign(name.trim() || 'Campaña', host.myName);
    },

    async join(campId: string, code: string): Promise<void> {
      await repo.joinCampaign(campId, code, host.myName);
    },

    /** Asigna (o saca, con null) una ficha mía a una campaña. Una ficha, una campaña (decisión 3). */
    async assign(charId: string, campId: string | null): Promise<void> {
      const prev = cs().charCampaign[charId] ?? null;
      if (prev === campId) return;
      if (prev) {
        setPartyEntry(prev, charId, null);
        await repo.deletePartySummary(prev, charId).catch(() => {});
      }
      await withBrakeRetry(() => repo.assignCharacter(charId, campId, host.writerId));
      setCharCampaign(charId, campId);
      const sheet = host.getSheet(charId);
      if (campId && sheet) await writeSummary(campId, charId, ownSummary(sheet));
    },

    /** Salir: primero libero mis fichas de esa campaña (después ya no tendría permiso). */
    async leave(campId: string): Promise<void> {
      for (const id of host.myCloudIds()) {
        if (cs().charCampaign[id] === campId) await this.assign(id, null);
      }
      await repo.leaveCampaign(campId);
    },

    /** Echar (GM): borra los resúmenes de sus fichas y lo saca; el jugador libera su ficha solo. */
    async kick(campId: string, memberUid: string): Promise<void> {
      for (const [charId, sum] of Object.entries(cs().party[campId] ?? {})) {
        if (sum.ownerUid === memberUid) await repo.deletePartySummary(campId, charId);
      }
      await repo.kickMember(campId, memberUid);
    },

    async passGm(campId: string, newGmUid: string): Promise<void> {
      await repo.passGm(campId, newGmUid);
    },

    async regenerateInvite(campId: string): Promise<void> {
      await repo.regenerateInvite(campId);
    },
  };
}

export type CampaignController = ReturnType<typeof createCampaignController>;
