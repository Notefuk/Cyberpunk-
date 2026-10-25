// [Claude Code · 2026-10-24] v5.0.0 (plan 18): campañas en Firestore (crear, unirse, salir, echar, pasar el GM, link, party).
// Todas las funciones del SDK salen de h.fsSdk (cargado de forma diferida en firebaseClient.ts).
import type { FirebaseHandles } from './firebaseClient';

export interface CampaignDoc {
  id: string; name: string; gmUid: string; memberUids: string[];
  memberNames: Record<string, string>; inviteCode: string;
}

export function newInviteCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += chars[b % chars.length];
  return out;
}

export function buildInviteLink(baseUrl: string, campId: string, code: string): string {
  const cut = baseUrl.search(/[?#]/);
  const base = cut === -1 ? baseUrl : baseUrl.slice(0, cut);
  return `${base}?unirse=${campId}.${code}`;
}

export function parseInviteParam(value: string | null): { campId: string; code: string } | null {
  if (!value) return null;
  const i = value.indexOf('.');
  if (i === -1) return null;
  const campId = value.slice(0, i);
  const code = value.slice(i + 1);
  if (!campId || !code) return null;
  return { campId, code };
}

export interface CampaignRepo {
  createCampaign(name: string, myName: string): Promise<string>;
  /** info.fromCache: la lista salió del caché local (puede estar vieja); no se usa para liberar fichas. */
  subscribeMyCampaigns(cb: (list: CampaignDoc[], info: { fromCache: boolean }) => void, onError?: (e: unknown) => void): () => void;
  joinCampaign(campId: string, code: string, myName: string): Promise<void>;
  leaveCampaign(campId: string): Promise<void>;
  kickMember(campId: string, memberUid: string): Promise<void>;
  passGm(campId: string, newGmUid: string): Promise<void>;
  regenerateInvite(campId: string): Promise<string>;
  subscribeParty(campId: string, cb: (entries: { charId: string; data: Record<string, unknown> }[]) => void, onError?: (e: unknown) => void): () => void;
  writePartySummary(campId: string, charId: string, summary: Record<string, unknown>): Promise<void>;
  deletePartySummary(campId: string, charId: string): Promise<void>;
  assignCharacter(charId: string, campId: string | null, writerId: string): Promise<void>;
}

export function createCampaignRepo(h: FirebaseHandles, uid: string): CampaignRepo {
  const fs = h.fsSdk;
  const campRef = (id: string) => fs.doc(h.db, 'campaigns', id);
  const variadicUpdate = (ref: unknown, first: unknown, ...rest: unknown[]) =>
    (fs.updateDoc as (ref: unknown, f: unknown, ...more: unknown[]) => Promise<void>)(ref, first, ...rest);

  const toCampaign = (id: string, d: Record<string, unknown>): CampaignDoc => ({
    id,
    name: (d.name as string | undefined) ?? '',
    gmUid: (d.gmUid as string | undefined) ?? '',
    memberUids: (d.memberUids as string[] | undefined) ?? [],
    memberNames: (d.memberNames as Record<string, string> | undefined) ?? {},
    inviteCode: (d.inviteCode as string | undefined) ?? '',
  });

  const removeMember = async (campId: string, memberUid: string) => {
    await variadicUpdate(
      campRef(campId),
      new fs.FieldPath('memberUids'), fs.arrayRemove(memberUid),
      new fs.FieldPath('memberNames', memberUid), fs.deleteField(),
    );
  };

  return {
    async createCampaign(name, myName) {
      const id = fs.doc(fs.collection(h.db, 'campaigns')).id;
      await fs.setDoc(campRef(id), {
        name,
        gmUid: uid,
        memberUids: [uid],
        memberNames: { [uid]: myName },
        inviteCode: newInviteCode(),
        createdAt: fs.serverTimestamp(),
      });
      return id;
    },

    subscribeMyCampaigns(cb, onError) {
      return fs.onSnapshot(
        fs.query(fs.collection(h.db, 'campaigns'), fs.where('memberUids', 'array-contains', uid)),
        (snap) => cb(snap.docs.map((d) => toCampaign(d.id, d.data() as Record<string, unknown>)), { fromCache: snap.metadata.fromCache }),
        (err) => onError?.(err),
      );
    },

    async joinCampaign(campId, code, myName) {
      await variadicUpdate(
        campRef(campId),
        new fs.FieldPath('memberUids'), fs.arrayUnion(uid),
        new fs.FieldPath('lastJoinCode'), code,
        new fs.FieldPath('memberNames', uid), myName,
      );
    },

    async leaveCampaign(campId) {
      await removeMember(campId, uid);
    },

    async kickMember(campId, memberUid) {
      await removeMember(campId, memberUid);
    },

    async passGm(campId, newGmUid) {
      await fs.updateDoc(campRef(campId), { gmUid: newGmUid });
    },

    async regenerateInvite(campId) {
      const code = newInviteCode();
      await fs.updateDoc(campRef(campId), { inviteCode: code });
      return code;
    },

    subscribeParty(campId, cb, onError) {
      return fs.onSnapshot(
        fs.collection(h.db, 'campaigns', campId, 'party'),
        (snap) => cb(snap.docs.map((d) => ({ charId: d.id, data: d.data() as Record<string, unknown> }))),
        (err) => onError?.(err),
      );
    },

    async writePartySummary(campId, charId, summary) {
      await fs.setDoc(fs.doc(h.db, 'campaigns', campId, 'party', charId), summary);
    },

    async deletePartySummary(campId, charId) {
      await fs.deleteDoc(fs.doc(h.db, 'campaigns', campId, 'party', charId));
    },

    // Lleva los campos de escritor igual que setSchemaVersion (regla writerOk). [Claude Code · 2026-10-24]
    async assignCharacter(charId, campId, writerId) {
      await fs.updateDoc(
        fs.doc(h.db, 'characters', charId),
        new fs.FieldPath('campaignIds'), campId ? [campId] : [],
        new fs.FieldPath('_w', writerId), fs.serverTimestamp(),
        new fs.FieldPath('_lastWriter'), writerId,
        new fs.FieldPath('_ts'), fs.serverTimestamp(),
      );
    },
  };
}
