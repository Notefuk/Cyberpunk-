// [Claude Code · 2026-11-06] v5.11.1: la campaña automática corre aunque la lista de campañas salga del caché.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCampaignController } from '../cloudCampaigns';
import { useCloudState } from '../cloudState';
import type { CampaignDoc, CampaignRepo } from '../campaignRepo';
import type { CharacterSheet } from '../../types/cyberpunk';

const camp: CampaignDoc = { id: 'camp1', name: 'Mesa', gmUid: 'gm', memberUids: ['gm', 'me'], memberNames: {}, inviteCode: 'x' };

function setup(sheets: Record<string, Partial<CharacterSheet>>) {
  let listCb: ((list: CampaignDoc[], info: { fromCache: boolean }) => void) | null = null;
  const assignCharacter = vi.fn(async () => {});
  const repo = {
    subscribeMyCampaigns: (cb: typeof listCb) => { listCb = cb; return () => {}; },
    subscribeParty: () => () => {},
    writePartySummary: vi.fn(async () => {}),
    deletePartySummary: vi.fn(async () => {}),
    assignCharacter,
  } as unknown as CampaignRepo;
  const ctl = createCampaignController({
    uid: 'me', myName: 'Yo', writerId: 'me_dev', repo,
    getSheet: (id) => (sheets[id] ? ({ id, handle: id, role: 'Solo', stats: { BODY: 6, WILL: 6 }, currentHp: 40, ...sheets[id] } as unknown as CharacterSheet) : undefined),
    myCloudIds: () => Object.keys(sheets),
    loadPlayerSheet: async () => true,
    dropPlayerSheet: async () => {},
  });
  ctl.start();
  return { emit: (fromCache: boolean) => listCb!([camp], { fromCache }), assignCharacter };
}

describe('campaña automática (v5.11.1)', () => {
  beforeEach(() => {
    useCloudState.setState({ campaigns: [], party: {}, playerOwners: {}, charCampaign: {}, pendingTransfers: {}, activeTableId: null });
  });

  it('asigna las fichas de jugador libres aunque la lista venga solo del caché', async () => {
    useCloudState.setState({ charCampaign: { a: null, b: null, c: 'otra', n: null } });
    const { emit, assignCharacter } = setup({ a: {}, b: { sheetKind: 'player' }, c: {}, n: { sheetKind: 'npc' } });
    emit(true);
    await vi.waitFor(() => expect(assignCharacter).toHaveBeenCalledTimes(2));
    expect(assignCharacter.mock.calls.map((c) => (c as unknown[])[0]).sort()).toEqual(['a', 'b']);
    expect(assignCharacter.mock.calls.every((c) => (c as unknown[])[1] === 'camp1')).toBe(true);
  });

  it('no repite la asignación de una ficha con cada aviso de la lista', async () => {
    useCloudState.setState({ charCampaign: { a: null } });
    const { emit, assignCharacter } = setup({ a: {} });
    emit(true);
    emit(false);
    await vi.waitFor(() => expect(assignCharacter).toHaveBeenCalledTimes(1));
  });
});
