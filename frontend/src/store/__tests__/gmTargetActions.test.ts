// [Claude Code · 2026-10-28] v5.2.0 (plan 20): acciones sobre una ficha que no es la activa (el GM sobre un PJ).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterStore } from '../useCharacterStore';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import { calculateIncomingImpact, planImpactEffects } from '../../engine/combatEngine';
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

const sheet = (id: string): CharacterSheet => ({
  ...structuredClone(CEMK_FOLIO_PREMADE_CHARACTERS[0]),
  id,
  activeInjuries: [],
  currentHp: 30,
  deathSavePenalty: 0,
  bodyArmor: { ...structuredClone(CEMK_FOLIO_PREMADE_CHARACTERS[0]).bodyArmor, currentSp: 11 }
});
const get = (id: string) => useCharacterStore.getState().characters.find((c) => c.id === id)!;

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  useCharacterStore.setState({ characters: [sheet('gm'), sheet('pj')], activeCharacterId: 'gm' });
});

describe('el GM actúa sobre la ficha de un PJ', () => {
  it('15 de daño al cuerpo con SP 11: -4 HP y SP 10, sin tocar la ficha activa (Core p. 186)', () => {
    const input = { damage: 15, location: 'body' as const, attackType: 'standard' as const, isCritical: false, passExcess: true, headSp: 11, bodySp: 11, shieldSdp: 0 };
    const r = calculateIncomingImpact(input);
    expect(useCharacterStore.getState().applyImpactTo('pj', planImpactEffects(input, r, r.hpLoss, false))).toEqual([]);
    expect(get('pj').currentHp).toBe(26);
    expect(get('pj').bodyArmor.currentSp).toBe(10);
    expect(get('gm').currentHp).toBe(30);
    expect(get('gm').bodyArmor.currentSp).toBe(11);
  });

  it('crítica y Mortally Wounded: heridas y +1 al Death Save Penalty (Core pp. 187-188)', () => {
    const injuries = useCharacterStore.getState().applyImpactTo('pj', {
      ablation: null, hpLoss: 5, critical: { location: 'body', fbcRefund: 5 }, mortalCritical: { location: 'body' }
    });
    expect(injuries).toHaveLength(2);
    expect(get('pj').activeInjuries).toHaveLength(2);
    expect(get('pj').deathSavePenalty).toBe(1);
    expect(get('gm').activeInjuries).toHaveLength(0);
  });

  it('Humanidad sobre otra ficha', () => {
    const before = get('pj').currentHumanity;
    useCharacterStore.getState().adjustHumanityFor('pj', -2);
    expect(get('pj').currentHumanity).toBe(before - 2);
  });
});
