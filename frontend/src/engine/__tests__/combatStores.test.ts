// [Claude Code · 2026-10-22] Stores v4.9.2: reloj de partida, Round de combate, heridas y HP sobre cualquier ficha (plan 10).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGameClockStore, currentBeatId, currentDayKey } from '../../store/gameClockStore';
import { useRulesSettingsStore } from '../../store/rulesSettingsStore';
import { useCombatStore, migrateCombatState, partializeCombat, COMBAT_LOCAL_KEYS, COMBAT_SHARED_KEYS } from '../../store/useCombatStore';
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

const get = (id: string) => useCharacterStore.getState().characters.find(c => c.id === id)!;

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  useCharacterStore.setState({ characters: [sheet('a'), sheet('b')], activeCharacterId: 'a' });
  useGameClockStore.getState().resetClock();
  useRulesSettingsStore.setState({ criticalTable: 'core' });
  useCombatStore.getState().resetCombatRound();
});

describe('reloj de partida', () => {
  it('newBeat y newDay actualizan ids', () => {
    expect(currentDayKey()).toBe('D1');
    expect(currentBeatId()).toBe('D1-B1');
    useGameClockStore.getState().newBeat();
    expect(currentBeatId()).toBe('D1-B2');
    useGameClockStore.getState().newDay();
    expect(currentDayKey()).toBe('D2');
    expect(currentBeatId()).toBe('D2-B1');
  });

  it('newDay expira los Quick Fix vencidos (Core p.223)', () => {
    const inj = useCharacterStore.getState().inflictSpecificInjury('b', 'body', 'Pierna Rota (Broken Leg)', 'core');
    expect(inj).not.toBeNull();
    useCharacterStore.getState().applyQuickFix('b', inj!.id, 1);
    expect(get('b').activeInjuries[0].isTreated).toBe(true);
    useGameClockStore.getState().newDay();
    const after = get('b').activeInjuries[0];
    expect(after.isTreated).toBe(false);
    expect(after.quickFixed).toBe(false);
  });
});

describe('Round de combate (Core p.146)', () => {
  it('nextRound resetea los flags', () => {
    const s = useCombatStore.getState();
    s.markDamageTaken();
    s.markHitLanded();
    s.spendNetAction();
    expect(useCombatStore.getState().netActionsSpent).toBe(1);
    useCombatStore.getState().nextRound();
    const n = useCombatStore.getState();
    expect(n.round).toBe(2);
    expect(n.firstDamageTakenThisRound).toBe(false);
    expect(n.firstHitLandedThisRound).toBe(false);
    expect(n.netActionsSpent).toBe(0);
  });
});

describe('heridas y HP', () => {
  it("inflictRandomInjury con tabla 'cemk' marca table", () => {
    useRulesSettingsStore.getState().setCriticalTable('cemk');
    const inj = useCharacterStore.getState().inflictRandomInjury('body');
    if (inj) {
      expect(inj.table).toBe('cemk');
      expect(inj.name.length).toBeGreaterThan(0);
    }
  });

  it('applyTreatment quita la herida', () => {
    const inj = useCharacterStore.getState().inflictSpecificInjury('b', 'body', 'Pierna Rota (Broken Leg)', 'core');
    expect(get('b').activeInjuries).toHaveLength(1);
    useCharacterStore.getState().applyTreatment('b', inj!.id);
    expect(get('b').activeInjuries).toHaveLength(0);
  });

  it('stabilizeCharacter mortal deja 1 HP y reinicia la penalidad (Core p.223)', () => {
    useCharacterStore.setState({
      characters: useCharacterStore.getState().characters.map(c => (c.id === 'b' ? { ...c, currentHp: 0, deathSavePenalty: 3 } : c))
    });
    useCharacterStore.getState().stabilizeCharacter('b', { wasMortallyWounded: true });
    expect(get('b').currentHp).toBe(1);
    expect(get('b').deathSavePenalty).toBe(0);
  });

  it('adjustHpFor actúa sobre una ficha no activa', () => {
    const before = get('b').currentHp;
    useCharacterStore.getState().adjustHpFor('b', -2);
    expect(get('b').currentHp).toBe(Math.max(0, before - 2));
    expect(get('a').currentHp).toBe(before);
  });
});

// [Claude Code · 2026-10-23] v4.9.6: registro del turno (decisión 48).
describe('turnLog del combate', () => {
  it('recordHit, recordMove y endTurn', () => {
    const st = useCombatStore.getState();
    st.recordHit('brawling');
    st.recordHit('martial_arts', 'f1');
    st.recordHit('martial_arts', 'f1');
    st.recordMove('m1');
    st.setMovedMeters(4);
    const log = useCombatStore.getState().turnLog;
    expect(log.hitsByType.brawling).toBe(1);
    expect(log.hitsByType.martial_arts).toBe(2);
    expect(log.formHits.f1).toBe(2);
    expect(log.movesUsed).toEqual(['m1']);
    expect(log.movedMeters).toBe(4);
    useCombatStore.getState().endTurn();
    const cleared = useCombatStore.getState().turnLog;
    expect(cleared.hitsByType.brawling).toBe(0);
    expect(cleared.movesUsed).toEqual([]);
    expect(cleared.movedMeters).toBe(0);
  });

  it('nextRound reinicia el turnLog', () => {
    useCombatStore.getState().recordHit('melee');
    useCombatStore.getState().recordMove('m1');
    useCombatStore.getState().nextRound();
    const log = useCombatStore.getState().turnLog;
    expect(log.hitsByType.melee).toBe(0);
    expect(log.movesUsed).toEqual([]);
  });

  it('migrate sin turnLog lo crea', () => {
    const migrate = migrateCombatState;
    const migrated = migrate({ round: 3 }) as { turnLog?: { movesUsed: string[] } };
    expect(migrated.turnLog?.movesUsed).toEqual([]);
  });
});

// [Claude Code · 2026-10-24] v4.9.7: grupos local/shared del estado persistido (plan 17, cambio 4).
describe('persistencia del combate: grupos local y shared', () => {
  it('partializeCombat devuelve exactamente las claves de ambos grupos y ninguna función', () => {
    const persisted = partializeCombat(useCombatStore.getState()) as Record<string, unknown>;
    expect(Object.keys(persisted).sort()).toEqual([...COMBAT_LOCAL_KEYS, ...COMBAT_SHARED_KEYS].sort());
    for (const value of Object.values(persisted)) expect(typeof value).not.toBe('function');
  });

  it('cada campo de datos del store está en exactamente un grupo y los grupos no se solapan', () => {
    const dataKeys = Object.entries(useCombatStore.getState())
      .filter(([, value]) => typeof value !== 'function')
      .map(([key]) => key);
    const local = COMBAT_LOCAL_KEYS as readonly string[];
    const shared = COMBAT_SHARED_KEYS as readonly string[];
    for (const key of dataKeys) {
      const count = Number(local.includes(key)) + Number(shared.includes(key));
      expect(count, `el campo "${key}" debe estar en exactamente un grupo`).toBe(1);
    }
    expect(local.filter((k) => shared.includes(k))).toEqual([]);
    expect([...local, ...shared].sort()).toEqual([...dataKeys].sort());
  });

  it('migrateCombatState con un objeto de forma v2 conserva los valores y el turnLog', () => {
    const v2 = {
      era: '2077',
      round: 5,
      rollHistory: [],
      turnLog: { hitsByType: {}, formHits: {}, movesUsed: ['m9'], movedMeters: 2 }
    };
    const migrated = migrateCombatState(v2, 2) as unknown as typeof v2;
    expect(migrated.round).toBe(5);
    expect(migrated.rollHistory).toEqual([]);
    expect(migrated.era).toBe('2077');
    expect(migrated.turnLog.movesUsed).toEqual(['m9']);
  });
});
