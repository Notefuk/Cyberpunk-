import { CORE_ENEMIES } from './enemies/core';
import { CEMK_ENEMIES } from './enemies/cemk';
import { HARDENED_ENEMIES } from './enemies/hardened';
import { INTERFACE_RED_ENEMIES } from './enemies/interface-red';
import { DANGER_GAL_ENEMIES } from './enemies/danger-gal';
import { EVERYDAY_PEOPLE_ENEMIES } from './enemies/everyday-people';
import { LEGACY_INVENTED_ENEMIES } from './enemies/legacy-invented-danger-gal';
import { portEnemyToCemk } from '../engine/cemkPort';
import type {
  CharacterEra,
  CharacterSheet,
  CombatSkillKey,
  EquippedWeapon,
  StatKey
} from '../types/cyberpunk';

export type ThreatTier =
  | 'mook'
  | 'hardened_mook'
  | 'lieutenant'
  | 'hardened_lieutenant'
  | 'mini_boss'
  | 'boss'
  | 'cyberpsycho'
  | 'legend'
  | 'hardened_mini_boss'
  | 'hardened_boss';

export type SourceBookId =
  | 'core'
  | 'black_chrome'
  | 'cemk_2077'
  | 'interface_red'
  | 'danger_gal'
  | 'dlc';

export interface EnemyCombatBase {
  label: string;
  totalBase: number;
  damage?: string;
  rof?: number;
  notes?: string;
}

export interface EnemyWeaponProfile {
  name: string;
  skillBase: number;
  damage: string;
  rof: number;
  mag: number;
  notes?: string;
  weaponType2077?: 'Power' | 'Smart' | 'Tech' | 'Melee' | 'Automated'; // Tipo de arma CEMK (RB p.8)
  skill?: string; // Habilidad usada por el arma
}

export interface EnemySheet {
  id: string;
  name: string;
  subtitle: string;
  faction: string;
  threatTier: ThreatTier;
  sourceBook: SourceBookId;
  sourceBookTitle: string;
  era: CharacterEra;
  role: string;
  hp: number;
  seriouslyWounded: number;
  deathSave: number;
  headSp: number;
  bodySp: number;
  stats: Record<StatKey, number>;
  combatBases: EnemyCombatBase[];
  weapons: EnemyWeaponProfile[];
  cyberware: string[];
  gear: string[];
  specialRules: string[];
  loreSummary: string;
  sourcePage?: number; // Página del libro fuente
  format?: 'red' | 'cemk'; // Formato del bloque de stats
  level?: number; // Nivel del PNJ
  rep?: number; // Reputación (REP)
  luck?: number; // Suerte del PNJ
  roleAbility?: { name: string; rank: number }; // Habilidad de rol y su rango
  skillBases?: Record<string, number>; // Bases de habilidad (stat + skill)
  isNetrunner?: boolean; // Es netrunner
  interfaceRank?: number; // Rango de Interface
  cyberdeckPrograms?: string[]; // Programas del cyberdeck (RED)
  hasNeuroport?: boolean; // Tiene Neuroport
  selfIce?: number; // Cantidad de Passwalls Self-ICE
  netActionsPerTurn?: number; // Solo fichas CEMK nativas: NET Actions impresas en la ficha
  quickhacks?: string[]; // Quickhacks del PNJ
  headSpVsMelee?: number; // SP de cabeza vs melee
  bodySpVsMelee?: number; // SP de cuerpo vs melee
  /**
   * v5.44.0 [Claude Code · 2026-11-14]: ficha abreviada (Everyday People): el libro solo da HP, número de combate,
   * INIT (= REF) y MOVE. Los demás STATs y el Death Save valen 0 adentro y se muestran como "—".
   */
  abbreviated?: boolean;
}

/** STATs que una ficha abreviada sí imprime (Everyday People p.2-3: INIT y MOVE). */
export const ABBREVIATED_KNOWN_STATS: readonly StatKey[] = ['REF', 'MOVE'];

/** Valor de un STAT para mostrar: "—" si la ficha es abreviada y el libro no lo da. */
export function enemyStatLabel(enemy: Pick<EnemySheet, 'abbreviated' | 'stats'>, stat: StatKey): string {
  if (enemy.abbreviated && !ABBREVIATED_KNOWN_STATS.includes(stat)) return '—';
  return String(enemy.stats[stat]);
}

// [Claude Code · 2026-11-13] v5.35.0 (plan 32): las 15 facciones de Danger Gal Dossier son las canon de
// data/dangerGalFactions.ts. La lista anterior era inventada y se borró.
export { DANGER_GAL_15_FACTIONS, type DangerGalFaction } from './dangerGalFactions';

// ============================================================================
// MASTER ENEMIES & GOONS CATALOG (Base Canónica + Expansión Danger Gal Dossier)
// ============================================================================

export const ENEMIES_CATALOG: EnemySheet[] = [
  ...CORE_ENEMIES,
  ...CEMK_ENEMIES,
  ...HARDENED_ENEMIES,
  // Interface RED Vol. 2 (Jumpstart) y Vol. 4 (Halloween), plan 27 v5.20.0. [Claude Code · 2026-11-11]
  ...INTERFACE_RED_ENEMIES,
  // Danger Gal Dossier (plan 32, v5.36.0 a v5.38.0): fichas canon generadas. [Claude Code · 2026-11-13]
  ...DANGER_GAL_ENEMIES,
  // Everyday People (plan 33, v5.44.0): 20 civiles con ficha abreviada. [Claude Code · 2026-11-14]
  ...EVERYDAY_PEOPLE_ENEMIES
];

/** Ficha por id: primero el bestiario; si no está, las fichas inventadas viejas (solo para actores guardados que salieron de ellas). [Claude Code · 2026-11-13] */
export function findEnemySheet(id: string | undefined): EnemySheet | undefined {
  if (!id) return undefined;
  return ENEMIES_CATALOG.find((e) => e.id === id) ?? LEGACY_INVENTED_ENEMIES.find((e) => e.id === id);
}

// ============================================================================
// HELPER: Convert EnemySheet to a valid CharacterSheet (for Roster import)
// ============================================================================

export function convertEnemyToCharacterSheet(enemy: EnemySheet): CharacterSheet {
  const port = portEnemyToCemk(enemy);
  const defaultCombatSkills: Record<CombatSkillKey, number> = {
    handgun: 0,
    shoulderArms: 0,
    autofire: 0,
    heavyWeapons: 0,
    archery: 0,
    meleeWeapon: 0,
    brawling: 2,
    martialArts: 0,
    evasion: 2,
    athletics: 2,
    firstAid: 2,
    paramedic: 0,
    cybertech: 0,
    perception: 2,
    concentration: 2,
    resistTortureDrugs: 0
  };

  // Map high combat bases to matching skills
  for (const base of enemy.combatBases) {
    const l = base.label.toLowerCase();
    if (l.includes('pistola') || l.includes('pistol')) {
      defaultCombatSkills.handgun = Math.max(0, base.totalBase - enemy.stats.REF);
    } else if (l.includes('fusil') || l.includes('rifle') || l.includes('escopeta') || l.includes('shotgun')) {
      defaultCombatSkills.shoulderArms = Math.max(0, base.totalBase - enemy.stats.REF);
    } else if (l.includes('pesada') || l.includes('cohete') || l.includes('rocket') || l.includes('lanzador')) {
      defaultCombatSkills.heavyWeapons = Math.max(0, base.totalBase - enemy.stats.REF);
    } else if (l.includes('katana') || l.includes('cuchillo') || l.includes('espada') || l.includes('melee') || l.includes('navaja')) {
      defaultCombatSkills.meleeWeapon = Math.max(0, base.totalBase - enemy.stats.DEX);
    } else if (l.includes('esquiva') || l.includes('evasion')) {
      defaultCombatSkills.evasion = Math.max(0, base.totalBase - enemy.stats.DEX);
    }
  }

  const equippedWeapons: EquippedWeapon[] = enemy.weapons.map((w, idx) => ({
    id: `enemy-wep-${enemy.id}-${idx}`,
    instanceId: `wep-inst-${enemy.id}-${idx}-${Date.now()}`,
    name: w.name,
    type: w.mag > 0 ? 'Ranged' : 'Melee',
    skill: w.mag > 0 ? (w.name.toLowerCase().includes('pistol') ? 'Handgun' : 'Shoulder Arms') : 'Melee Weapon',
    damage: w.damage,
    rof: w.rof,
    hands: 1,
    concealable: false,
    cost: 500,
    standardMag: w.mag,
    currentMag: w.mag,
    ammoType: w.mag > 0 ? 'Standard' : 'N/A',
    loadedAmmoType: w.mag > 0 ? 'Standard' : 'N/A',
    inHand: idx === 0,
    reserveAmmo: w.mag * 3,
    notes: w.notes
  }));

  const rank =
    port.interfaceRank !== null
      ? port.interfaceRank
      : enemy.threatTier === 'legend' || enemy.threatTier === 'boss'
      ? 7
      : enemy.threatTier.includes('lieutenant') || enemy.threatTier === 'mini_boss'
      ? 5
      : 4;

  return {
    id: `char-enemy-${enemy.id}-${Date.now()}`,
    handle: enemy.name,
    role: enemy.role,
    roleRank: rank,
    sheetKind: 'npc', // v5.11.0 (plan 25): del bestiario sale como NPC. [Claude Code · 2026-11-05]
    notes: `[FICHA DE AMENAZA // ${enemy.faction.toUpperCase()}]\n${enemy.subtitle}\n\n${enemy.loreSummary}\n\nREGLAS ESPECIALES:\n${enemy.specialRules.map(r => `• ${r}`).join('\n')}`,
    stats: { ...enemy.stats },
    currentHp: enemy.hp,
    currentLuck: enemy.stats.LUCK,
    currentHumanity: Math.max(10, enemy.stats.EMP * 10),
    headArmor: {
      name: `${enemy.name} Head Armor`,
      maxSp: enemy.headSp,
      currentSp: enemy.headSp,
      penalty: 0
    },
    bodyArmor: {
      name: `${enemy.name} Body Armor`,
      maxSp: enemy.bodySp,
      currentSp: enemy.bodySp,
      penalty: enemy.bodySp >= 15 ? -2 : 0
    },
    skills: defaultCombatSkills,
    equippedWeapons,
    installedCyberwareIds: [],
    activeInjuries: [],
    eurodollars: 200,
    inventory: [],
    transactions: [],
    era: enemy.era,
    creationMethod: 'pregen',
    roleAbilityName: enemy.role === 'Solo' ? 'Combat Awareness' : (enemy.role === 'Netrunner' ? 'Interface' : 'Role Ability'),
    generalSkills: {
      Perception: 4,
      Athletics: 4,
      Stealth: 4,
      Streetwise: 4
    },
    fashionBudgetRemaining: 0,
    hasNeuroport: port.hasNeuroport,
    lifepath: {
      culturalRegion: 'Night City',
      personality: 'Combatiente hostil',
      clothingStyle: 'Equipo de combate táctico',
      hairstyle: 'Estándar',
      affectation: 'Marcas de combate visibles',
      valueMost: 'Cumplir la misión o defender su territorio',
      feelAboutPeople: 'Peligrosos o presas',
      valuedPerson: 'Líder de facción',
      valuedPossession: 'Armas de combate',
      familyBackground: 'Reclutado por su facción',
      childhoodEnvironment: 'Zonas de combate de Night City',
      familyCrisis: 'Perdió todo en la calle',
      friends: [],
      tragicLoveAffairs: [],
      enemies: [],
      roleLifepath: {},
      lifeGoal: 'Sobrevivir al próximo tiroteo'
    }
  };
}
