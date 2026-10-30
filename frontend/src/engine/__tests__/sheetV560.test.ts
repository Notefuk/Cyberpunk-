// Tests de la ficha v5.6.0 (plan 21): STATs con tus números y líneas de ataque de cada arma. [Claude Code · 2026-10-29]
import { describe, expect, it } from 'vitest';
import { buildCharacterSheetFromDraft, createEmptyDraft } from '../characterCreation';
import { statInsights } from '../statInsights';
import { weaponAttackLines } from '../weaponAttackLines';
import type { CharacterSheet, WeaponItem } from '../../types/cyberpunk';
import pack from '../../data/core-rules.cprpack.json';

const weapons = (pack as unknown as { weapons: WeaponItem[] }).weapons;
const w = (id: string): WeaponItem => weapons.find((x) => x.id === id)!;

function sheet(stats: Partial<CharacterSheet['stats']> = {}, skills: Partial<CharacterSheet['skills']> = {}): CharacterSheet {
  const { sheet: s } = buildCharacterSheetFromDraft(
    { ...createEmptyDraft(), era: '2045', method: 'complete_package', role: 'Solo', culturalLanguage: 'Spanish', handle: 'T' },
    'sheet-test'
  );
  const base = { INT: 6, REF: 6, DEX: 6, TECH: 6, COOL: 6, WILL: 6, LUCK: 6, MOVE: 6, BODY: 6, EMP: 6 };
  return {
    ...s,
    stats: { ...base, ...stats },
    skills: { ...s.skills, ...skills },
    currentHp: 40,
    headArmor: { ...s.headArmor, penalty: 0 },
    bodyArmor: { ...s.bodyArmor, penalty: 0 },
    activeInjuries: [],
    installedCyberwareIds: []
  };
}

describe('STATs con tus números (Core pp.79, 169, 172, 176, 222)', () => {
  it('con REF 8 se pueden esquivar tiros con DEX + Evasion; con REF 7, no', () => {
    const ok = statInsights(sheet({ REF: 8, DEX: 6 }, { evasion: 4 })).REF.join(' ');
    expect(ok).toContain('podés esquivar tiros con DEX 6 + Evasion 4 = 10 + 1d10');
    const no = statInsights(sheet({ REF: 7 })).REF.join(' ');
    expect(no).toContain('Con REF 8 o más podrías esquivar');
  });

  it('daño de Brawling por BODY: 1d6, 2d6, 3d6 y 4d6', () => {
    expect(statInsights(sheet({ BODY: 4 })).BODY.join(' ')).toContain('Brawling: 1d6');
    expect(statInsights(sheet({ BODY: 6 })).BODY.join(' ')).toContain('Brawling: 2d6');
    expect(statInsights(sheet({ BODY: 8 })).BODY.join(' ')).toContain('Brawling: 3d6');
    expect(statInsights(sheet({ BODY: 11 })).BODY.join(' ')).toContain('Brawling: 4d6');
  });

  it('Death Save = BODY y HP con la fórmula del Core', () => {
    const body = statInsights(sheet({ BODY: 7, WILL: 6 })).BODY.join(' ');
    expect(body).toContain('Death Save: 7');
    expect(body).toContain('= 45');
    expect(statInsights(sheet({ MOVE: 5 })).MOVE[0]).toContain('= 10 m/yds');
  });
});

describe('Líneas de ataque (Core pp.172-176)', () => {
  it('la Heavy Pistol pega con REF + Handgun y no tiene ráfaga', () => {
    const a = weaponAttackLines(sheet({ REF: 7 }, { handgun: 6 }), w('heavy-pistol'));
    expect(a.single).toBe('Tiro simple: REF 7 + Handgun 6 = 13 + 1d10');
    expect(a.burst).toBeUndefined();
    expect(a.suppressive).toBeUndefined();
  });

  it('la ráfaga usa Autofire y no Handgun; tope ×3 en SMG y ×4 en Assault Rifle (Core p.173)', () => {
    const s = sheet({ REF: 7 }, { handgun: 6, autofire: 3, shoulderArms: 5 });
    const smg = weaponAttackLines(s, w('smg'));
    expect(smg.single).toContain('Handgun 6');
    expect(smg.burst).toContain('Autofire 3 = 10 + 1d10');
    expect(smg.burst).toContain('máx ×3');
    expect(smg.suppressive).toContain('Core p.174');
    const ar = weaponAttackLines(s, w('assault-rifle'));
    expect(ar.single).toContain('Shoulder Arms 5');
    expect(ar.burst).toContain('máx ×4');
  });

  it('con Autofire en 0 avisa que la ráfaga pega solo con REF', () => {
    expect(weaponAttackLines(sheet({ REF: 7 }, { handgun: 4, autofire: 0 }), w('smg')).burstWarning).toContain('Autofire en 0');
  });

  it('un arma cuerpo a cuerpo pega con DEX + Melee Weapon', () => {
    const a = weaponAttackLines(sheet({ DEX: 8 }, { meleeWeapon: 5 }), w('medium-melee'));
    expect(a.single).toBe('Golpe: DEX 8 + Melee Weapon 5 = 13 + 1d10');
  });
});
