// [Claude Code · 2026-10-27] v5.1.0 (plan 19, "Mesa activa" y punto 1): reloj y era de la mesa.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveActiveTable, compareClock, planClockSync, syncActiveTable, chooseEra, getActiveTable } from '../tableSync';
import type { CampaignDoc } from '../campaignRepo';
import { useCloudState } from '../cloudState';
import { useAuthStore } from '../authStore';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGameClockStore } from '../../store/gameClockStore';
import { useCombatStore } from '../../store/useCombatStore';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import type { CharacterSheet, ActiveCriticalInjury } from '../../types/cyberpunk';

class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

const camp = (id: string, over: Partial<CampaignDoc> = {}): CampaignDoc => ({
  id, name: id, gmUid: 'gm', memberUids: ['gm', 'p1'], memberNames: {}, inviteCode: 'x'.repeat(16), ...over
});

const quickFixed = { id: 'inj1', name: 'Broken Ribs', quickFixed: true, isTreated: true, quickFixUntilDay: 1 } as unknown as ActiveCriticalInjury;
const sheet = (id: string): CharacterSheet =>
  ({ ...structuredClone(CEMK_FOLIO_PREMADE_CHARACTERS[0]), id, activeInjuries: [quickFixed] });
const injuryOf = (id: string) => useCharacterStore.getState().characters.find((c) => c.id === id)!.activeInjuries[0];

function signIn(uid: string) {
  useAuthStore.setState({ user: { uid, displayName: uid } as never });
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  useCharacterStore.setState({ characters: [sheet('mine'), sheet('theirs')], activeCharacterId: 'mine' });
  useGameClockStore.setState({ session: 1, day: 1, beat: 1 });
  useCombatStore.setState({ era: '2045' });
  useCloudState.setState({ campaigns: [], charCampaign: {}, playerOwners: {}, activeTableId: null });
  signIn('p1');
});

describe('mesa activa', () => {
  it('elegida a mano, si no la de la ficha activa, si no la única', () => {
    const list = [camp('a'), camp('b')];
    expect(resolveActiveTable(list, 'b', { x: 'a' }, 'x')!.id).toBe('b');
    expect(resolveActiveTable(list, 'zz', { x: 'a' }, 'x')!.id).toBe('a');
    expect(resolveActiveTable(list, null, {}, 'x')).toBeNull();
    expect(resolveActiveTable([camp('a')], null, {}, null)!.id).toBe('a');
  });

  it('sin sesión no hay mesa', () => {
    useAuthStore.setState({ user: null });
    useCloudState.setState({ campaigns: [camp('a')] });
    expect(getActiveTable().table).toBeNull();
  });
});

describe('reloj de la mesa', () => {
  it('ordena por sesión, día y beat', () => {
    expect(compareClock({ session: 1, day: 3, beat: 9 }, { session: 2, day: 1, beat: 1 })).toBe(-1);
    expect(compareClock({ session: 2, day: 1, beat: 2 }, { session: 2, day: 1, beat: 1 })).toBe(1);
    expect(compareClock({ session: 2, day: 1, beat: 1 }, { session: 2, day: 1, beat: 1 })).toBe(0);
  });

  it('efectos solo si el remoto va adelante; el GM no retrocede por un snapshot atrasado', () => {
    const l = { session: 1, day: 2, beat: 3 };
    expect(planClockSync(l, { session: 1, day: 2, beat: 4 }, false)).toEqual({ adopt: true, expireDay: null, sessionEnded: false });
    expect(planClockSync(l, { session: 1, day: 3, beat: 1 }, false)).toEqual({ adopt: true, expireDay: 3, sessionEnded: false });
    expect(planClockSync(l, { session: 2, day: 3, beat: 1 }, false)).toEqual({ adopt: true, expireDay: 3, sessionEnded: true });
    expect(planClockSync(l, { session: 1, day: 1, beat: 1 }, false)).toEqual({ adopt: true, expireDay: null, sessionEnded: false });
    expect(planClockSync(l, { session: 1, day: 1, beat: 1 }, true).adopt).toBe(false);
    expect(planClockSync(l, l, false).adopt).toBe(false);
  });

  it('el jugador copia el reloj del GM y vence Quick Fix solo en sus fichas', () => {
    useCloudState.setState({
      campaigns: [camp('a', { clock: { session: 1, day: 2, beat: 1 } })],
      playerOwners: { theirs: 'Otro' }
    });
    syncActiveTable();
    expect(useGameClockStore.getState()).toMatchObject({ session: 1, day: 2, beat: 1 });
    expect(injuryOf('mine').quickFixed).toBe(false);
    expect(injuryOf('theirs').quickFixed).toBe(true);
    // El mismo snapshot otra vez no cambia nada.
    syncActiveTable();
    expect(useGameClockStore.getState().day).toBe(2);
  });

  it('el GM con mesa y Nuevo día solo toca sus fichas, no las de los jugadores', () => {
    signIn('gm');
    useCloudState.setState({ campaigns: [camp('a', { clock: { session: 1, day: 1, beat: 1 }, era: '2045' })], playerOwners: { theirs: 'Jugador' } });
    syncActiveTable();
    useGameClockStore.getState().newDay();
    expect(injuryOf('mine').quickFixed).toBe(false);
    expect(injuryOf('theirs').quickFixed).toBe(true);
  });
});

describe('era de la mesa', () => {
  it('el jugador toma la era de la campaña y no la puede cambiar', () => {
    useCloudState.setState({ campaigns: [camp('a', { era: '2077' })] });
    syncActiveTable();
    expect(useCombatStore.getState().era).toBe('2077');
    expect(chooseEra('2045')).toBe(false);
    expect(useCombatStore.getState().era).toBe('2077');
  });

  it('el GM sí la cambia; sin mesa cada uno elige', () => {
    signIn('gm');
    useCloudState.setState({ campaigns: [camp('a', { era: '2045' })] });
    expect(chooseEra('2077')).toBe(true);
    expect(useCombatStore.getState().era).toBe('2077');
    signIn('p1');
    useCloudState.setState({ campaigns: [] });
    expect(chooseEra('2045')).toBe(true);
    expect(useCombatStore.getState().era).toBe('2045');
  });
});
