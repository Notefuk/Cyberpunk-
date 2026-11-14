// [Claude Code · 2026-11-13] v5.40.0 (plan 32): NPC Creation Guidelines de Danger Gal Dossier (pp.149-152).
// El libro aclara que son guías y no reglas fijas (p.150): todo lo que sale de acá es una sugerencia que el GM
// puede pasar por alto. El creador avisa cuando se sale de la plantilla, pero nunca bloquea el guardado
// (salvo el nombre). Lo que el libro no da (precios de cada ítem), no se calcula.
import type { CharacterEra, StatKey } from '../types/cyberpunk';
import type { EnemySheet, EnemyWeaponProfile, ThreatTier } from './enemiesCatalog';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold } from '../engine/characterEngine';

export const NPC_GUIDELINES_SOURCE = 'Danger Gal Dossier pp.149-152';

export type NpcLevel = 'mook' | 'lieutenant' | 'mini_boss' | 'boss';

export interface NpcTemplate {
  level: NpcLevel;
  label: string;
  /** Puntos de STAT a repartir: todos los STATs menos LUCK (así suman las 118 fichas del libro). */
  statPoints: number;
  maxStat: number;
  skillPoints: number;
  maxSkillLevel: number;
  hp: [number, number];
  sp: [number, number];
  combatBase: [number, number];
  nonCombatBase: [number, number];
  gearBudget: number;
  /** null = sin límite (Boss Hardened). */
  cyberwareBudget: number | null;
  weaponNote?: string;
  roleNote?: string;
  /** Qué se ve en una pelea (p.150). */
  encounterNote: string;
}

const BASE: Record<NpcLevel, NpcTemplate> = {
  mook: {
    level: 'mook', label: 'Mook', statPoints: 33, maxStat: 6, skillPoints: 30, maxSkillLevel: 10,
    hp: [20, 35], sp: [4, 7], combatBase: [10, 12], nonCombatBase: [8, 10],
    gearBudget: 300, cyberwareBudget: 500, weaponNote: 'Armas de calidad Poor.',
    roleNote: 'Por lo general Role Rank 2, si tiene.',
    encounterNote: 'Un Mook por cada Edgerunner del grupo.'
  },
  lieutenant: {
    level: 'lieutenant', label: 'Lieutenant', statPoints: 44, maxStat: 8, skillPoints: 60, maxSkillLevel: 10,
    hp: [30, 40], sp: [11, 13], combatBase: [13, 14], nonCombatBase: [10, 12],
    gearBudget: 700, cyberwareBudget: 1000, weaponNote: 'Nada de armas de calidad Excellent.',
    roleNote: 'Puede tener Role Ability (Rank 4).',
    encounterNote: 'Un Lieutenant por cada dos Edgerunners; suele liderar Mooks.'
  },
  mini_boss: {
    level: 'mini_boss', label: 'Mini-Boss', statPoints: 52, maxStat: 8, skillPoints: 90, maxSkillLevel: 10,
    hp: [35, 50], sp: [11, 15], combatBase: [14, 16], nonCombatBase: [13, 14],
    gearBudget: 1200, cyberwareBudget: 2000,
    roleNote: 'Tiene Role Ability (Rank 4).',
    encounterNote: 'Cuenta como tres Edgerunners; suele traer Lieutenants y Mooks.'
  },
  boss: {
    level: 'boss', label: 'Boss', statPoints: 57, maxStat: 8, skillPoints: 120, maxSkillLevel: 10,
    hp: [45, 50], sp: [11, 18], combatBase: [16, 16], nonCombatBase: [14, 16],
    gearBudget: 3300, cyberwareBudget: 10000,
    roleNote: 'Tiene Role Ability (Rank 6).',
    encounterNote: 'Puede enfrentar solo a todo el grupo, o con pocos Mooks. Usalo con moderación.'
  }
};

/** "To Harden" de cada plantilla (p.152). */
const HARDEN: Record<NpcLevel, { stat: number; maxStat?: number; gear: number; cyber: number | null; roleNote: string }> = {
  mook: { stat: 6, maxStat: 7, gear: 200, cyber: 500, roleNote: 'Puede tener Role Ability (Rank 2).' },
  lieutenant: { stat: 4, gear: 300, cyber: 500, roleNote: 'Probablemente tiene Role Ability (Rank 4).' },
  mini_boss: { stat: 2, gear: 800, cyber: 1200, roleNote: 'Tiene Role Ability (Rank 4); puede tenerla en Rank 6.' },
  boss: {
    stat: 5, gear: 5000, cyber: null,
    roleNote: 'Tiene Role Ability (Rank 6); puede tenerla en Rank 8. Ciberware sin límite (con más de 30 piezas, probablemente ciberpsicópata con EMP 0).'
  }
};

export function npcTemplate(level: NpcLevel, hardened: boolean): NpcTemplate {
  const t = BASE[level];
  if (!hardened) return t;
  const h = HARDEN[level];
  return {
    ...t,
    label: `Hardened ${t.label}`,
    statPoints: t.statPoints + h.stat,
    maxStat: h.maxStat ?? t.maxStat,
    gearBudget: t.gearBudget + h.gear,
    cyberwareBudget: h.cyber === null || t.cyberwareBudget === null ? null : t.cyberwareBudget + h.cyber,
    roleNote: h.roleNote
  };
}

export function npcThreatTier(level: NpcLevel, hardened: boolean): ThreatTier {
  return (hardened ? `hardened_${level}` : level) as ThreatTier;
}

/** Paso 3 (p.151): skills que todo PNJ tiene gratis. Native Language a 4, el resto a 2. */
export const NPC_FREE_SKILLS: { name: string; level: number }[] = [
  { name: 'Language (Native)', level: 4 },
  { name: 'Athletics', level: 2 },
  { name: 'Brawling', level: 2 },
  { name: 'Concentration', level: 2 },
  { name: 'Conversation', level: 2 },
  { name: 'Education', level: 2 },
  { name: 'Evasion', level: 2 },
  { name: 'First Aid', level: 2 },
  { name: 'Human Perception', level: 2 },
  { name: 'Language (Streetslang)', level: 2 },
  { name: 'Local Expert (Your Home)', level: 2 },
  { name: 'Perception', level: 2 },
  { name: 'Persuasion', level: 2 },
  { name: 'Stealth', level: 2 }
];

export const NPC_STAT_KEYS: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];

export interface NpcSkillRow {
  name: string;
  stat: StatKey;
  level: number;
  /** Skill de combate (cuenta para "Important Combat Skills Base"). */
  combat?: boolean;
}

/** Puntos de STAT gastados: todos menos LUCK (p.151: los PNJ casi nunca tienen LUCK). */
export function npcStatPointsUsed(stats: Record<StatKey, number>): number {
  return NPC_STAT_KEYS.filter((k) => k !== 'LUCK').reduce((sum, k) => sum + (stats[k] || 0), 0);
}

function freeLevelFor(name: string, nativeLanguage: string, localExpert: string): number {
  const n = name.trim().toLowerCase();
  if (n === `language (${nativeLanguage.trim().toLowerCase()})` || n === 'language (native)') return 4;
  if (n === `local expert (${localExpert.trim().toLowerCase()})` || n === 'local expert (your home)') return 2;
  return NPC_FREE_SKILLS.find((s) => s.name.toLowerCase() === n)?.level ?? 0;
}

/** Puntos de skill gastados: los niveles gratis del paso 3 no cuentan (p.151). */
export function npcSkillPointsUsed(skills: NpcSkillRow[], nativeLanguage = '', localExpert = ''): number {
  return skills.reduce((sum, s) => sum + Math.max(0, s.level - freeLevelFor(s.name, nativeLanguage, localExpert)), 0);
}

/** Paso 5 (p.152): bajar EMP en 1 por cada 5 piezas de ciberware, si el GM quiere. */
export function npcSuggestedEmpLoss(cyberwareCount: number): number {
  return Math.floor(cyberwareCount / 5);
}

export interface NpcDraft {
  name: string;
  subtitle: string;
  faction: string;
  era: CharacterEra;
  concept: string;
  level: NpcLevel;
  hardened: boolean;
  nativeLanguage: string;
  localExpert: string;
  stats: Record<StatKey, number>;
  hp: number;
  headSp: number;
  bodySp: number;
  role: string;
  roleRank: number;
  roleAbility: string;
  skills: NpcSkillRow[];
  weapons: { name: string; skill: string; damage: string; rof: number; mag: number }[];
  cyberware: string[];
  gear: string[];
  specialRules: string;
}

/** Avisos (no bloquean): dónde el borrador se sale de la plantilla. */
export function npcDraftWarnings(d: NpcDraft): string[] {
  const t = npcTemplate(d.level, d.hardened);
  const w: string[] = [];
  const used = npcStatPointsUsed(d.stats);
  if (used !== t.statPoints) w.push(`STATs: ${used} de ${t.statPoints} puntos.`);
  for (const k of NPC_STAT_KEYS) {
    const v = d.stats[k] || 0;
    if (k === 'LUCK') continue;
    if (v > t.maxStat && k !== 'BODY') w.push(`${k} ${v} pasa el máximo de ${t.maxStat}.`);
    if (v < 2 && k !== 'EMP') w.push(`${k} ${v} es menor que 2.`);
  }
  const sp = npcSkillPointsUsed(d.skills, d.nativeLanguage, d.localExpert);
  if (sp > t.skillPoints) w.push(`Skills: ${sp} de ${t.skillPoints} puntos.`);
  if (d.skills.some((s) => s.level > t.maxSkillLevel)) w.push(`Hay skills por encima de nivel ${t.maxSkillLevel}.`);
  if (d.hp < t.hp[0] || d.hp > t.hp[1]) w.push(`HP ${d.hp} fuera de lo sugerido (${t.hp[0]}-${t.hp[1]}).`);
  if (d.bodySp < t.sp[0] || d.bodySp > t.sp[1]) w.push(`SP ${d.bodySp} fuera de lo sugerido (${t.sp[0]}-${t.sp[1]}).`);
  return w;
}

function skillBase(d: NpcDraft, skillName: string): number {
  const row = d.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
  if (!row) return 0;
  return (d.stats[row.stat] || 0) + row.level;
}

/** Convierte el borrador en una ficha del bestiario. El porte CEMK lo hace después portEnemyToCemk, como con las del libro. */
export function buildGuidedNpc(d: NpcDraft, id: string): EnemySheet {
  const skillBases: Record<string, number> = {};
  for (const s of d.skills) {
    if (s.level <= 0) continue;
    const label = s.name.replace(/\(Native\)/i, `(${d.nativeLanguage || 'Native'})`).replace(/\(Your Home\)/i, `(${d.localExpert || 'Your Home'})`);
    skillBases[label] = (d.stats[s.stat] || 0) + s.level;
  }
  const weapons: EnemyWeaponProfile[] = d.weapons
    .filter((w) => w.name.trim())
    .map((w) => ({ name: w.name.trim(), skill: w.skill, skillBase: skillBase(d, w.skill), damage: w.damage || '—', rof: w.rof || 1, mag: w.mag || 0 }));
  const roleText = d.role.trim() || 'Sin rol';
  return {
    id,
    name: d.name.trim(),
    subtitle: d.subtitle.trim() || 'PNJ del GM',
    faction: d.faction.trim() || 'Independiente',
    threatTier: npcThreatTier(d.level, d.hardened),
    sourceBook: 'dlc',
    sourceBookTitle: `PNJ del GM (guías de ${NPC_GUIDELINES_SOURCE})`,
    era: d.era,
    role: roleText,
    hp: d.hp,
    seriouslyWounded: calculateSeriouslyWoundedThreshold(d.hp),
    deathSave: d.stats.BODY,
    headSp: d.headSp,
    bodySp: d.bodySp,
    stats: { ...d.stats },
    combatBases: weapons.map((w) => ({ label: w.skill || w.name, totalBase: w.skillBase, damage: w.damage, rof: w.rof })),
    weapons,
    cyberware: d.cyberware.filter((c) => c.trim()),
    gear: d.gear.filter((g) => g.trim()),
    specialRules: d.specialRules.trim() ? [d.specialRules.trim()] : [],
    loreSummary: d.concept.trim() || 'PNJ creado por el GM.',
    format: 'red',
    luck: d.stats.LUCK || undefined,
    roleAbility: d.roleAbility.trim() && d.roleRank > 0 ? { name: d.roleAbility.trim(), rank: d.roleRank } : undefined,
    skillBases
  };
}

/** HP sugerido por la fórmula del Core (p.79), para arrancar el paso 4. */
export function npcFormulaHp(stats: Record<StatKey, number>): number {
  return calculateMaxHp(stats.BODY || 0, stats.WILL || 0);
}
