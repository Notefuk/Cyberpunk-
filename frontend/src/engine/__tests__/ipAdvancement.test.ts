// [Claude Code · 2026-10-22] Avance con IP y migración 3 -> 4 (v4.9.1, plan 9). Core p.410.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runMigrations } from '../../store/persistence';
import { applyFolioAllocation } from '../../data/folioRoleAllocations';
import { useCharacterStore } from '../../store/useCharacterStore';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import type { CharacterSheet } from '../../types/cyberpunk';

/* eslint-disable @typescript-eslint/no-explicit-any */
class MemoryStorage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
});

function makeChar(over: Record<string, unknown> = {}): any {
  return { id: 'c1', handle: 'Test', stats: { INT: 5 }, skills: {}, role: 'Solo', roleRank: 4, ...over };
}

describe('migración 3 -> 4 (v4.9.1)', () => {
  it("la variante 'cemk' pasa a 'core' (plan 8)", () => {
    const { state } = runMigrations({ characters: [makeChar({ roleAbilityVariant: 'cemk' })] }, 3);
    expect(state.characters[0].roleAbilityVariant).toBe('core');
  });

  it('el Folio Insurance guardado sin reparto recibe medicineAllocation (Folios p.17, Core pp. 149-150)', () => {
    const { state } = runMigrations({ characters: [makeChar({ id: 'cemk-folio-insurance', role: 'Medtech', generalSkills: {} })] }, 3);
    const c = state.characters[0];
    expect(c.medicineAllocation).toEqual({ surgery: 2, pharmaceuticals: 1, cryosystem: 0, knownPharmaceuticals: ['Speedheal'] });
    expect(c.generalSkills.medicaltech).toBe(1);
  });

  it('una ficha con 120 IP conserva 120 y su historial tiene la entrada inicial (Core p.410)', () => {
    const { state } = runMigrations({ characters: [makeChar({ improvementPoints: 120 })] }, 3);
    const c = state.characters[0];
    expect(c.improvementPoints).toBe(120);
    expect(c.ipLog).toHaveLength(1);
    expect(c.ipLog[0]).toMatchObject({ kind: 'initial', delta: 120, balanceAfter: 120 });
  });

  it('una ficha sin IP queda con ipLog vacío', () => {
    const { state } = runMigrations({ characters: [makeChar()] }, 3);
    expect(state.characters[0].ipLog).toEqual([]);
  });

  it('applyFolioAllocation no pisa un reparto existente', () => {
    const sheet = { ...makeChar(), makerAllocation: { field: 1, upgrade: 1, fabrication: 1, invention: 1 } } as CharacterSheet;
    expect(applyFolioAllocation(sheet, 'cemk-folio-maven').makerAllocation).toEqual({ field: 1, upgrade: 1, fabrication: 1, invention: 1 });
  });
});

describe('avance con IP en el store (Core p.410)', () => {
  const setup = (over: Partial<CharacterSheet>): void => {
    const base = JSON.parse(JSON.stringify(CEMK_FOLIO_PREMADE_CHARACTERS[0])) as CharacterSheet;
    const sheet = { ...base, id: 'ip-test', ipLog: [], improvementPoints: 0, roleRank: 4, ...over } as CharacterSheet;
    useCharacterStore.setState({ characters: [sheet], activeCharacterId: 'ip-test' });
  };
  const active = (): CharacterSheet => useCharacterStore.getState().characters[0];

  it('raiseRoleRankWithIp con 0 IP falla', () => {
    setup({ improvementPoints: 0 });
    expect(useCharacterStore.getState().raiseRoleRankWithIp().success).toBe(false);
    expect(active().roleRank).toBe(4);
  });

  it('raiseRoleRankWithIp con 300 IP sube de 4 a 5 (60 x 5), deja 0 y registra spend_role', () => {
    setup({ improvementPoints: 300 });
    expect(useCharacterStore.getState().raiseRoleRankWithIp().success).toBe(true);
    expect(active().roleRank).toBe(5);
    expect(active().improvementPoints).toBe(0);
    expect(active().ipLog?.[0].kind).toBe('spend_role');
  });

  it('raiseSkillWithIp en una skill x2 de nivel 5 cuesta 240 (40 x 6)', () => {
    setup({ improvementPoints: 300, skills: { ...CEMK_FOLIO_PREMADE_CHARACTERS[0].skills, martialArts: 5 } });
    expect(useCharacterStore.getState().raiseSkillWithIp('martialArts').success).toBe(true);
    expect(active().skills.martialArts).toBe(6);
    expect(active().improvementPoints).toBe(60);
    expect(active().ipLog?.[0]).toMatchObject({ kind: 'spend_skill', delta: -240 });
  });
});
