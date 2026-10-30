// [Claude Code · 2026-10-30] v5.8.0 (plan 23): nombre propio de los ítems.
import { describe, expect, it } from 'vitest';
import { displayItemName, nicknameKey, pruneItemNicknames } from '../itemNames';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';
import type { CharacterSheet } from '../../types/cyberpunk';

const knife = { name: 'Cuchillo', showOriginal: true, original: 'Light Melee Weapon' };

describe('displayItemName', () => {
  it('"Cuchillo (Light Melee Weapon)" o solo "Cuchillo"', () => {
    const k = nicknameKey.weapon('w1');
    expect(displayItemName({ [k]: knife }, k, 'Light Melee Weapon')).toBe('Cuchillo (Light Melee Weapon)');
    expect(displayItemName({ [k]: { ...knife, showOriginal: false } }, k, 'Light Melee Weapon')).toBe('Cuchillo');
  });

  it('sin apodo, o si el ítem cambió, muestra el nombre del libro', () => {
    expect(displayItemName(undefined, 'w:x', 'Heavy Pistol')).toBe('Heavy Pistol');
    const k = nicknameKey.armor('body');
    expect(displayItemName({ [k]: { name: 'Mi campera', showOriginal: false, original: 'Leathers (Body)' } }, k, 'Kevlar® (Body)')).toBe('Kevlar® (Body)');
  });
});

describe('pruneItemNicknames', () => {
  it('borra los apodos de ítems que ya no están y deja los que siguen', () => {
    const base = structuredClone(CEMK_FOLIO_PREMADE_CHARACTERS[0]) as CharacterSheet;
    const w = base.equippedWeapons[0];
    const sheet: CharacterSheet = {
      ...base,
      installedCyberwareIds: ['cw-a'],
      itemNicknames: {
        [nicknameKey.weapon(w.instanceId)]: { name: 'La Negra', showOriginal: true, original: w.name },
        [nicknameKey.weapon('vendida')]: knife,
        [nicknameKey.cyberware('cw-a')]: { name: 'Ojo', showOriginal: false, original: 'Cyberoptic' },
        [nicknameKey.cyberware('cw-b')]: { name: 'Brazo', showOriginal: false, original: 'Cyberarm' }
      }
    };
    expect(Object.keys(pruneItemNicknames(sheet)!).sort()).toEqual([nicknameKey.cyberware('cw-a'), nicknameKey.weapon(w.instanceId)].sort());
  });
});
