// [Claude Code · 2026-10-30] v5.8.0 (plan 23): favoritas, reparar armadura y nombre propio de ítems.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharacterStore } from '../useCharacterStore';
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

const sheet = (id: string): CharacterSheet => ({ ...structuredClone(CEMK_FOLIO_PREMADE_CHARACTERS[0]), id });
const active = () => useCharacterStore.getState().getActiveCharacter()!;

beforeEach(() => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  useCharacterStore.setState({ characters: [sheet('a'), sheet('b')], activeCharacterId: 'a' });
});

describe('skills favoritas', () => {
  it('☆ marca y desmarca solo en la ficha activa', () => {
    const { toggleFavoriteSkill } = useCharacterStore.getState();
    toggleFavoriteSkill('handgun');
    toggleFavoriteSkill('Electronics/Security Tech');
    expect(active().favoriteSkills).toEqual(['handgun', 'Electronics/Security Tech']);
    toggleFavoriteSkill('handgun');
    expect(active().favoriteSkills).toEqual(['Electronics/Security Tech']);
    expect(useCharacterStore.getState().characters.find((c) => c.id === 'b')!.favoriteSkills).toBeUndefined();
  });
});

describe('reparar blindaje pagándole a un Tech', () => {
  it('sin monto no descuenta nada; con 50 €$ descuenta y deja la transacción', () => {
    useCharacterStore.setState((st) => ({
      characters: st.characters.map((c) => (c.id === 'a' ? { ...c, eurodollars: 200, transactions: [], bodyArmor: { ...c.bodyArmor, maxSp: 11, currentSp: 4 } } : c))
    }));
    const { repairCharacterArmor } = useCharacterStore.getState();
    repairCharacterArmor('body', 'full', 0);
    expect(active().bodyArmor.currentSp).toBe(11);
    expect(active().eurodollars).toBe(200);
    useCharacterStore.setState((st) => ({ characters: st.characters.map((c) => (c.id === 'a' ? { ...c, bodyArmor: { ...c.bodyArmor, currentSp: 4 } } : c)) }));
    repairCharacterArmor('body', 'full', 50);
    expect(active().eurodollars).toBe(150);
    expect(active().transactions?.[0]).toMatchObject({ amount: -50, concept: 'Reparación de blindaje (torso): pago a un Tech' });
  });
});

describe('nombre propio de ítems', () => {
  it('se pone y se quita sin tocar el nombre del libro', () => {
    const w = active().equippedWeapons[0];
    const key = `w:${w.instanceId}`;
    useCharacterStore.getState().setItemNickname(key, w.name, { name: '  Cuchillo  ', showOriginal: false });
    expect(active().itemNicknames?.[key]).toEqual({ name: 'Cuchillo', showOriginal: false, original: w.name });
    expect(active().equippedWeapons[0].name).toBe(w.name);
    useCharacterStore.getState().setItemNickname(key, w.name, null);
    expect(active().itemNicknames?.[key]).toBeUndefined();
  });
});
