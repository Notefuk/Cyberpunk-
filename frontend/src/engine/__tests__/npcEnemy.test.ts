// [Claude Code · 2026-11-05] v5.11.0 (plan 25): una ficha de NPC entra al combate como enemigo.
import { describe, expect, it } from 'vitest';
import { enemySheetFromCharacter, weaponSkillBase } from '../npcEnemy';
import { calculateMaxHp, getEffectiveBody } from '../characterEngine';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../../data/cemkFolioPremadesData';

const base = CEMK_FOLIO_PREMADE_CHARACTERS[0];

describe('NPC al combate', () => {
  it('lleva nombre, rol, stats, SP y el HP máximo de la ficha', () => {
    const npc = { ...base, sheetKind: 'npc' as const, currentHp: 5 };
    const e = enemySheetFromCharacter(npc);
    expect(e.name).toBe(base.handle);
    expect(e.role).toBe(base.role);
    expect(e.stats).toEqual(base.stats);
    expect(e.hp).toBe(calculateMaxHp(getEffectiveBody(npc), npc.stats.WILL));
    expect(e.headSp).toBe(base.headArmor.currentSp);
    expect(e.bodySp).toBe(base.bodyArmor.currentSp);
    expect(e.weapons).toHaveLength(base.equippedWeapons.length);
  });

  it('la base de ataque es STAT + skill del arma', () => {
    const sheet = { ...base, stats: { ...base.stats, REF: 7, DEX: 6 }, skills: { ...base.skills, handgun: 5, meleeWeapon: 3 } };
    expect(weaponSkillBase(sheet, 'Handgun')).toBe(12);
    expect(weaponSkillBase(sheet, 'Melee Weapon')).toBe(9);
  });
});
