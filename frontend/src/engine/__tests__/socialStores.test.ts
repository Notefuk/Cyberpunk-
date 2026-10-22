// [Claude Code · 2026-10-23] Stores v4.9.3: Team del Exec, fans del Rockerboy, Backup del Lawman y Fin de sesión (plan 11).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGameClockStore } from '../../store/gameClockStore';
import { useCombatStore } from '../../store/useCombatStore';
import { REPLACEMENT_FEE_EB } from '../socialRoleRules';
import type { ExecTeamMember } from '../socialRoleRules';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import type { CharacterSheet } from '../../types/cyberpunk';

class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

function sheet(id: string, over: Partial<CharacterSheet> = {}): CharacterSheet {
  return { ...structuredClone(CEMK_FOLIO_PREMADE_CHARACTERS[0]), id, activeInjuries: [], deathSavePenalty: 0, isDead: false, ...over };
}

function member(id: string, over: Partial<ExecTeamMember> = {}): ExecTeamMember {
  return {
    id,
    position: 'Bodyguard',
    d6Row: 1,
    stats: { INT: 5, REF: 5, DEX: 5, TECH: 5, COOL: 5, WILL: 5, MOVE: 5, BODY: 5 },
    hpMax: 35,
    hpCurrent: 35,
    seriouslyWounded: 18,
    deathSave: 5,
    loyalty: 5,
    status: 'active',
    packageNote: '',
    createdAt: new Date().toISOString(),
    ...over
  };
}

const active = () => useCharacterStore.getState().characters.find(c => c.id === 'a')!;
const store = () => useCharacterStore.getState();

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  useCharacterStore.setState({ characters: [sheet('a', { eurodollars: 1000 }), sheet('b')], activeCharacterId: 'a' });
  useGameClockStore.getState().resetClock();
  useCombatStore.getState().resetCombatRound();
});

describe('Team del Exec (Core p.154)', () => {
  it('agrega y ajusta Loyalty sin tope y HP con clamp', () => {
    store().addExecTeamMember(member('m1'));
    expect(active().execTeam).toHaveLength(1);
    store().adjustExecMemberLoyalty('m1', 7);
    expect(active().execTeam![0].loyalty).toBe(12);
    store().adjustExecMemberHp('m1', -100);
    expect(active().execTeam![0].hpCurrent).toBe(0);
    store().adjustExecMemberHp('m1', 100);
    expect(active().execTeam![0].hpCurrent).toBe(35);
    store().updateExecTeamMember('m1', { packageNote: 'x' });
    expect(active().execTeam![0].packageNote).toBe('x');
    store().removeExecTeamMember('m1');
    expect(active().execTeam).toHaveLength(0);
  });

  it('applyEndOfSessionToAll recorta 12 a 10 y marca la renuncia', () => {
    store().addExecTeamMember(member('hi', { loyalty: 12 }));
    store().addExecTeamMember(member('lo', { loyalty: -1 }));
    const summary = store().applyEndOfSessionToAll();
    expect(summary).toHaveLength(1);
    expect(summary[0].characterId).toBe('a');
    expect(summary[0].resigned).toEqual(['lo']);
    expect(active().execTeam!.find(m => m.id === 'hi')!.loyalty).toBe(10);
    expect(active().execTeam!.find(m => m.id === 'lo')!.status).toBe('resigned');
  });

  it('replaceExecTeamMember descuenta honorarios y deja Loyalty 1', () => {
    store().addExecTeamMember(member('m1', { loyalty: -2, status: 'resigned' }));
    const res = store().replaceExecTeamMember('m1');
    expect(res.success).toBe(true);
    expect(REPLACEMENT_FEE_EB).toBe(200);
    expect(active().eurodollars).toBe(1000 - REPLACEMENT_FEE_EB);
    expect(active().transactions![0].amount).toBe(-REPLACEMENT_FEE_EB);
    expect(active().execTeam![0].loyalty).toBe(1);
    expect(active().execTeam![0].status).toBe('active');
  });

  it('replaceExecTeamMember falla sin fondos y no reemplaza', () => {
    useCharacterStore.setState({ characters: [sheet('a', { eurodollars: 50 })], activeCharacterId: 'a' });
    store().addExecTeamMember(member('m1', { loyalty: -2 }));
    const res = store().replaceExecTeamMember('m1');
    expect(res.success).toBe(false);
    expect(active().eurodollars).toBe(50);
    expect(active().execTeam![0].id).toBe('m1');
  });
});

describe('Fans del Rockerboy (Core pp.144-145)', () => {
  it('agrega, actualiza y borra grupos', () => {
    store().addRockerboyFanGroup({ name: 'Los del bar', size: 'small' });
    const g = active().rockerboyFans![0];
    expect(g.id).toBeTruthy();
    store().updateRockerboyFanGroup(g.id, { size: 'huge', favorBlockedUntilDay: 5 });
    expect(active().rockerboyFans![0]).toMatchObject({ size: 'huge', favorBlockedUntilDay: 5 });
    store().removeRockerboyFanGroup(g.id);
    expect(active().rockerboyFans).toHaveLength(0);
  });
});

describe('Backup del Lawman (Core p.158)', () => {
  it('nextRound baja roundsLeft y marca arrived; damageBackupAgent hace clamp', () => {
    useCombatStore.getState().addBackupCall({
      lawmanId: 'a',
      groupIndices: [0],
      roundsLeft: 2,
      agents: [{ groupIndex: 0, hpMax: 20, hpCurrent: 20 }]
    });
    const id = useCombatStore.getState().backupCalls[0].id;
    expect(useCombatStore.getState().backupCalls[0].arrived).toBe(false);
    useCombatStore.getState().nextRound();
    expect(useCombatStore.getState().backupCalls[0]).toMatchObject({ roundsLeft: 1, arrived: false });
    useCombatStore.getState().nextRound();
    expect(useCombatStore.getState().backupCalls[0]).toMatchObject({ roundsLeft: 0, arrived: true });
    useCombatStore.getState().damageBackupAgent(id, 0, -50);
    expect(useCombatStore.getState().backupCalls[0].agents[0].hpCurrent).toBe(0);
    useCombatStore.getState().damageBackupAgent(id, 0, 99);
    expect(useCombatStore.getState().backupCalls[0].agents[0].hpCurrent).toBe(20);
    useCombatStore.getState().dismissBackupCall(id);
    expect(useCombatStore.getState().backupCalls).toHaveLength(0);
  });
});

describe('Fin de sesión', () => {
  it('endSession incrementa session y devuelve el resumen', () => {
    store().addExecTeamMember(member('lo', { loyalty: -1 }));
    expect(useGameClockStore.getState().session).toBe(1);
    const summary = useGameClockStore.getState().endSession();
    expect(useGameClockStore.getState().session).toBe(2);
    expect(summary[0].resigned).toEqual(['lo']);
  });
});
