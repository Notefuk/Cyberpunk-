// [Claude Code · 2026-11-05] v5.11.0 (plan 25): una ficha de NPC del GM entra al combate como enemigo.
// Se arma un EnemySheet (el mismo formato del bestiario) para reusar addEnemyFromCatalog; así el jugador
// ve de ese NPC lo mismo que de cualquier enemigo (nombre, iniciativa, heridas; nunca los HP).
import type { CharacterSheet, CombatSkillKey } from '../types/cyberpunk';
import type { EnemySheet, EnemyWeaponProfile, ThreatTier } from '../data/enemiesCatalog';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold, getEffectiveBody } from './characterEngine';

// Skill de la ficha según el nombre de skill del arma (Core pp.173-174: Handgun, Shoulder Arms, etc.).
const WEAPON_SKILL: { match: RegExp; key: CombatSkillKey; stat: 'REF' | 'DEX' }[] = [
  { match: /handgun/i, key: 'handgun', stat: 'REF' },
  { match: /shoulder/i, key: 'shoulderArms', stat: 'REF' },
  { match: /heavy/i, key: 'heavyWeapons', stat: 'REF' },
  { match: /autofire/i, key: 'autofire', stat: 'REF' },
  { match: /archery/i, key: 'archery', stat: 'REF' },
  { match: /martial/i, key: 'martialArts', stat: 'DEX' },
  { match: /brawl/i, key: 'brawling', stat: 'DEX' },
  { match: /melee/i, key: 'meleeWeapon', stat: 'DEX' },
  // v5.14.1 [Claude Code · 2026-11-10]: granadas y arrojadizas de Black Chrome (DEX + Athletics).
  { match: /athletic/i, key: 'athletics', stat: 'DEX' },
];

/** Base de ataque del arma: STAT + skill, como en la ficha. */
export function weaponSkillBase(sheet: CharacterSheet, skillName: string): number {
  const hit = WEAPON_SKILL.find((w) => w.match.test(skillName));
  if (!hit) return sheet.stats.REF ?? 0;
  return (sheet.stats[hit.stat] ?? 0) + (sheet.skills?.[hit.key] ?? 0);
}

export function enemySheetFromCharacter(sheet: CharacterSheet, threatTier: ThreatTier = 'lieutenant'): EnemySheet {
  const hp = calculateMaxHp(getEffectiveBody(sheet), sheet.stats?.WILL ?? 6);
  const weapons: EnemyWeaponProfile[] = (sheet.equippedWeapons ?? []).map((w) => ({
    name: w.name,
    skillBase: weaponSkillBase(sheet, w.skill ?? ''),
    damage: w.damage,
    rof: w.rof,
    mag: w.standardMag ?? 0,
    notes: w.notes,
    skill: w.skill,
  }));
  return {
    id: `npc-${sheet.id}`,
    name: sheet.handle || 'NPC',
    subtitle: `${sheet.role} ${sheet.roleRank}`,
    faction: 'NPC del GM',
    threatTier,
    sourceBook: 'core',
    sourceBookTitle: 'Ficha propia',
    era: sheet.era ?? '2045',
    role: sheet.role,
    // HP máximo, con la misma fórmula que la ficha: addEnemyFromCatalog usa este valor como actual y máximo.
    hp,
    seriouslyWounded: calculateSeriouslyWoundedThreshold(hp),
    deathSave: sheet.stats.BODY ?? 0,
    headSp: sheet.headArmor?.currentSp ?? 0,
    bodySp: sheet.bodyArmor?.currentSp ?? 0,
    stats: { ...sheet.stats },
    combatBases: [
      { label: 'Evasion (DEX + Evasion)', totalBase: (sheet.stats.DEX ?? 0) + (sheet.skills?.evasion ?? 0) },
      ...weapons.map((w) => ({ label: w.name, totalBase: w.skillBase, damage: w.damage, rof: w.rof })),
    ],
    weapons,
    cyberware: [...(sheet.installedCyberwareIds ?? [])],
    gear: [],
    specialRules: [],
    loreSummary: '',
  };
}
