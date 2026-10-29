// Motor de creación de personajes (plan 7, v4.8.2). Reglas: Core RED v1.24 pp. 40-119 y CEMK RB p.25. [Claude Code · 2026-10-22]
// Motor puro: sin React ni localStorage. El wizard solo muestra datos y llama a estas funciones.
import { CEMK_CREATION, CORE_GEAR_SKILLS, CORE_LIFEPATH, CORE_ROLE_TABLES, CORE_ROLES, CREATOR_GUIDE } from '../data/creation';
import type {
  CoreRoleName,
  LifepathResult,
  LifepathTable,
  OutfitPiece,
  PackageGearItem,
  SourceRef
} from '../data/creation';
import pack from '../data/core-rules.cprpack.json';
import {
  CANON_CYBERWARE_IDS,
  PREGEN_TEMPLATES,
  buildCharacterSheetFromPregen,
  createDefaultCombatSkills,
  resolveSkillKey
} from '../data/characterCreationData';
import { CEMK_FOLIO_PREMADE_CHARACTERS } from '../data/cemkFolioPremadesData';
import { MARTIAL_ARTS_FORMS } from '../data/cyberfistsMartialArtsData';
import { applyFolioAllocation } from '../data/folioRoleAllocations';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold, calculateMaxHumanity, parseHumanityLossAverage } from './characterEngine';
import { cyberwareStatBonus } from './cyberwareEffects';
import { deckSlotUse, neuroportCovers } from './creatorShop';
import type {
  CharacterEra,
  CharacterLifepath,
  CharacterSheet,
  CombatSkillKey,
  EquippedWeapon,
  InventoryItem,
  LifepathEnemy,
  StatKey
} from '../types/cyberpunk';

// ============================================================================
// 1. TIPOS
// ============================================================================

export type CreationMethodId = 'cemk_pregen' | 'easy_pregen' | 'streetrat' | 'edgerunner' | 'complete_package';
export type LifepathSource = 'cemk' | 'core';
export type RoleAbilityVariant = 'core' | 'cemk';
export type CreatorStepId = 'method' | 'role' | 'lifepath' | 'stats' | 'skills' | 'gear' | 'summary';

/** roll es null si el valor se eligió a mano. */
export interface LifepathPick {
  roll: string | null;
  value: string;
}

export type CreatorPurchaseCategory = 'weapons' | 'armor' | 'cyberware' | 'gear' | 'ammunition' | 'drugs' | 'programs';

export interface CreatorPurchase {
  category: CreatorPurchaseCategory;
  catalogId: string;
  name: string;
  cost: number;
  qty: number;
  humanityLoss: number;
  sourceBook?: string;
  /** Armadura por ubicación (Core p.97). Sin location = vale para cabeza y cuerpo (compatibilidad). */
  location?: 'head' | 'body';
  /** Munición: tipo de arma para el que se compra (Core p.344). Va también en el nombre. [Claude Code · 2026-10-25] */
  caliber?: string;
}

/** Core p.344: la munición se compra para el tipo de arma; granadas y cohetes van aparte, por unidad. */
export const AMMO_CALIBERS = ['Medium Pistol', 'Heavy Pistol', 'Very Heavy Pistol', 'Slug', 'Rifle', 'Shotgun Shell', 'Arrow'] as const;
/** Core p.344: todo menos granadas y cohetes se compra de a 10 unidades. */
export const isPerUnitAmmo = (name: string): boolean => /grenade|rocket/i.test(name);

export interface FashionPurchase {
  style: string;
  piece: string;
  qty: number;
  unitCost: number;
}

export interface CreatorDraft {
  version: 1;
  step: number;
  era: CharacterEra;
  method: CreationMethodId | null;
  pregenId: string | null;
  role: CoreRoleName | null;
  roleAbilityVariant: RoleAbilityVariant;
  handle: string;
  statRow: number | null;
  statRolls: Partial<Record<StatKey, number>>;
  stats: Record<StatKey, number>;
  /** Clave = nombre canon del Core (p. ej. 'Handgun', 'Electronics/Security Tech'). */
  skills: Record<string, number>;
  culturalLanguage: string;
  lifepathSource: LifepathSource;
  lifepath: Record<string, LifepathPick>;
  roleLifepath: Record<string, LifepathPick>;
  friendsCount: number;
  enemiesCount: number;
  loveCount: number;
  /** Clave `${sección}:${índice}` -> índice de opción elegida (0 = principal, 1.. = alternativas "o"). */
  packageChoices: Record<string, number>;
  runningOutOfCash: { enabled: boolean; employer: string | null };
  purchases: CreatorPurchase[];
  fashion: FashionPurchase[];
  installNeuroport: boolean;
  installCyberdeckPort: boolean;
}

// ============================================================================
// 2. CONSTANTES Y BORRADOR VACÍO
// ============================================================================

export const STAT_KEYS: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
// Core p.78: Complete Package reparte 62 puntos entre las 10 STATs, cada una de 2 a 8.
export const STAT_POINTS_COMPLETE_PACKAGE = 62;
export const STAT_MIN = 2;
export const STAT_MAX = 8;
// Core p.81: 86 puntos de habilidad (Edgerunner y Complete Package; la plantilla Streetrat también suma 86, p.86).
export const SKILL_POINTS = 86;
export const SKILL_MAX_LEVEL = 6;
export const SKILL_MIN_EDGERUNNER = 2;

export function createEmptyDraft(): CreatorDraft {
  const stats = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) stats[k] = STAT_MIN;
  return {
    version: 1,
    step: 0,
    era: '2077',
    method: null,
    pregenId: null,
    role: null,
    roleAbilityVariant: 'core',
    handle: '',
    statRow: null,
    statRolls: {},
    stats,
    skills: {},
    culturalLanguage: '',
    lifepathSource: 'cemk',
    lifepath: {},
    roleLifepath: {},
    friendsCount: 0,
    enemiesCount: 0,
    loveCount: 0,
    packageChoices: {},
    runningOutOfCash: { enabled: false, employer: null },
    purchases: [],
    fashion: [],
    installNeuroport: true,
    installCyberdeckPort: false
  };
}

const isPregenMethod = (m: CreationMethodId | null): boolean => m === 'cemk_pregen' || m === 'easy_pregen';

// ============================================================================
// 3. NOMBRES Y ETIQUETAS DE ROL
// ============================================================================

// Decisión de Giuliano: en 2077 (CEMK RB p.25) el rol se llama "Rocker"; en 2045 (Core p.40) "Rockerboy".
export function getRoleDisplayName(role: CoreRoleName, era: CharacterEra): string {
  if (role === 'Rockerboy' && era === '2077') return 'Rocker';
  return role;
}

// CEMK RB p.25: los 7 roles de CEMK, en este orden.
export const CEMK_ROLES: CoreRoleName[] = ['Fixer', 'Medtech', 'Netrunner', 'Nomad', 'Rockerboy', 'Solo', 'Tech'];
// Core pp. 40-41: roles que CEMK no trae.
export const CORE_ONLY_ROLES: CoreRoleName[] = ['Media', 'Exec', 'Lawman'];

export function getRoleOrder(): CoreRoleName[] {
  return [...CEMK_ROLES, ...CORE_ONLY_ROLES];
}

// Decisión: Media/Exec/Lawman solo existen en versión Core.
export function roleSupportsCemkVariant(role: CoreRoleName): boolean {
  return !CORE_ONLY_ROLES.includes(role);
}

export interface RoleAbilityInfo {
  roleName: string;
  name: string;
  textEs: string;
  source: SourceRef;
  /** true si CEMK no nombra la habilidad y se usa el nombre del Core (discrepancia 13, decidida: nombres del Core). */
  nameFromCore?: boolean;
}

export function getRoleAbilityInfo(role: CoreRoleName, variant: RoleAbilityVariant, era: CharacterEra): RoleAbilityInfo {
  const roleName = getRoleDisplayName(role, era);
  const coreRole = CORE_ROLES.roles.find((r) => r.role === role);
  if (!coreRole) throw new Error(`Rol sin datos en CORE_ROLES: ${role}`);
  const coreName = coreRole.ability.name;
  if (variant === 'cemk' && roleSupportsCemkVariant(role)) {
    const cemkKey = role === 'Rockerboy' ? 'Rocker' : role;
    const cemkRole = CEMK_CREATION.roles.find((r) => r.role === cemkKey);
    if (cemkRole) {
      const nameFromCore = cemkRole.ability.name === null;
      const tweak = era === '2077' && cemkRole.tweak2070sEs ? `\n\n${cemkRole.tweak2070sEs}` : '';
      return {
        roleName,
        name: cemkRole.ability.name ?? coreName,
        textEs: `${cemkRole.ability.cemkRulesEs}${tweak}`,
        source: cemkRole.ability.source,
        ...(nameFromCore ? { nameFromCore: true } : {})
      };
    }
  }
  return {
    roleName,
    name: coreName,
    // Algunos textos ya empiezan con "Rango 4:" o "Rangos 3 y 4:": no se repite el prefijo. [Claude Code · 2026-10-25]
    textEs: `${coreRole.ability.summaryEs}\n\n${/^rangos?\s/i.test(coreRole.ability.rank4Es) ? '' : 'Rango 4: '}${coreRole.ability.rank4Es}`,
    source: coreRole.ability.source
  };
}

// ============================================================================
// 4. CATÁLOGO DE SKILLS (Core pp. 81-85 + etiqueta CEMK)
// ============================================================================

export interface SkillCatalogEntry {
  name: string;
  category: string;
  stat: StatKey;
  x2: boolean;
  basic: boolean;
  specialization: boolean;
  descEs: string;
  books: Array<'CEMK' | 'Core RED'>;
  source: SourceRef;
}

const normalizeSkillName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\s*\(x2\)\s*$/, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();

/** Core pp. 86-87: "(x2)" marca el doble costo y "(choose 1)" la especialización a elegir; la clave del borrador no los lleva. */
export function canonSkillKey(name: string): string {
  return name
    .replace(/\s*\(x2\)\s*$/i, '')
    .replace(/\s*\(choose 1\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// "Language (Streetslang)" -> "Language": nombre base para buscar en el catálogo.
const baseSkillName = (name: string): string => canonSkillKey(name).replace(/\s*\(.*\)\s*$/, '').trim();

// Plan 14 v4.9.5 (Core p.83, decisiones 39-46): Martial Arts se compra por forma y Play Instrument/Science exigen especialidad. [Claude Code · 2026-10-23]
export interface MartialArtsFormSkill { key: string; formId: string; name: string; sourceBook: 'core' | 'interface_red'; sourcePage?: number | string }

/** Las 27 formas (Core primero) como claves 'Martial Arts (Forma)'. Cuestan x2 por nivel como su base (Core p.83). */
export function getMartialArtsFormSkills(): MartialArtsFormSkill[] {
  const toSkill = (f: (typeof MARTIAL_ARTS_FORMS)[number]): MartialArtsFormSkill => ({
    key: `Martial Arts (${f.name})`,
    formId: f.id,
    name: f.name,
    sourceBook: f.sourceBook,
    sourcePage: f.sourcePage
  });
  return [
    ...MARTIAL_ARTS_FORMS.filter((f) => f.sourceBook === 'core').map(toSkill),
    ...MARTIAL_ARTS_FORMS.filter((f) => f.sourceBook !== 'core').map(toSkill)
  ];
}

/** Bases que exigen elegir una especialidad (Core p.83). */
export const SPECIALTY_SKILLS: readonly string[] = ['Play Instrument', 'Science'];

/** 'Play Instrument (Guitarra)' -> 'Guitarra'; sin paréntesis o '(choose 1)' -> null. */
export function skillSpecialty(key: string): string | null {
  const m = /\(([^)]*)\)\s*$/.exec(key);
  if (!m) return null;
  const v = m[1].trim();
  if (!v || /^choose 1$/i.test(v) || /^x2$/i.test(v)) return null;
  return v;
}

/** Renombra la clave a 'Base (especialidad)' conservando el nivel. Si la especialidad queda vacía devuelve el borrador igual. */
export function setSkillSpecialty(draft: CreatorDraft, oldKey: string, specialty: string): CreatorDraft {
  const spec = specialty.trim();
  if (!spec) return draft;
  const newKey = `${baseSkillName(oldKey)} (${spec})`;
  if (newKey === oldKey) return draft;
  const skills: Record<string, number> = {};
  for (const [k, v] of Object.entries(draft.skills)) {
    if (k === oldKey) continue;
    skills[k] = v;
  }
  skills[newKey] = Math.max(skills[newKey] ?? 0, draft.skills[oldKey] ?? 0);
  return { ...draft, skills };
}

const isFormKeyBase = (name: string): boolean => baseSkillName(name) === 'Martial Arts';
const isSpecialtyBase = (name: string): boolean => SPECIALTY_SKILLS.includes(baseSkillName(name));

let skillCatalogCache: SkillCatalogEntry[] | null = null;

// Core pp. 81-85: las 66 skills. Surgery NO es skill general (discrepancia 10): no se agrega.
export function getSkillCatalog(): SkillCatalogEntry[] {
  if (!skillCatalogCache) {
    const cemkNames = new Set(CEMK_CREATION.skills.map((s) => normalizeSkillName(s.name)));
    skillCatalogCache = CORE_GEAR_SKILLS.skills.map((s) => ({
      name: s.name,
      category: s.category,
      stat: s.stat as StatKey,
      x2: s.x2,
      basic: s.basic,
      specialization: s.specialization,
      descEs: s.descEs,
      books: cemkNames.has(normalizeSkillName(s.name)) ? (['CEMK', 'Core RED'] as Array<'CEMK' | 'Core RED'>) : (['Core RED'] as Array<'CEMK' | 'Core RED'>),
      source: s.source
    }));
  }
  return skillCatalogCache;
}

// ============================================================================
// 5. REGLAS DE PUNTOS
// ============================================================================

function findCatalogSkill(name: string): SkillCatalogEntry | undefined {
  const base = normalizeSkillName(baseSkillName(name));
  return getSkillCatalog().find((s) => normalizeSkillName(s.name) === base);
}

// Core p.81: las skills (x2) cuestan el doble por nivel.
export function skillLevelCost(name: string, level: number): number {
  const entry = findCatalogSkill(name);
  return level * (entry?.x2 || /\(x2\)\s*$/i.test(name) ? 2 : 1);
}

export function getStatPointsSpent(stats: Record<StatKey, number>): number {
  return STAT_KEYS.reduce((sum, k) => sum + (stats[k] ?? 0), 0);
}

// El idioma cultural es gratis en 4 (Core p.90 / culturalLanguageRule) y no se cuenta aquí.
export function getSkillPointsSpent(draft: CreatorDraft): number {
  return Object.entries(draft.skills).reduce((sum, [name, level]) => sum + skillLevelCost(name, level), 0);
}

// ============================================================================
// 6. MÉTODOS DE STATS Y SKILLS (Core pp. 40-42, 73-90)
// ============================================================================

export function rollDie(spec: string, rng: () => number = Math.random): number {
  // Formatos: '1d10', '1d6', '2d6', '1d10-7'.
  const m = /^(\d+)d(\d+)\s*([+-]\s*\d+)?$/i.exec(spec.trim());
  if (!m) throw new Error(`Dado no válido: ${spec}`);
  const n = parseInt(m[1], 10);
  const sides = parseInt(m[2], 10);
  const mod = m[3] ? parseInt(m[3].replace(/\s+/g, ''), 10) : 0;
  let total = 0;
  for (let i = 0; i < n; i++) total += Math.floor(rng() * sides) + 1;
  return total + mod;
}

export function rollD10(rng: () => number = Math.random): number {
  return rollDie('1d10', rng);
}

// Core pp. 74-77: tabla de stats del rol; Streetrat copia la fila entera (p.74) y fija las skills de la plantilla (p.86).
export function applyStreetratRow(draft: CreatorDraft, row: number): CreatorDraft {
  if (!draft.role) throw new Error('Falta elegir el rol.');
  const table = CORE_ROLE_TABLES.statTables[draft.role];
  const found = table.rows.find((r) => r.roll === row);
  if (!found) throw new Error(`Fila de stats inexistente: ${row}`);
  const stats = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) stats[k] = found[k];
  const skills: Record<string, number> = {};
  for (const s of CORE_ROLE_TABLES.streetratSkills[draft.role].skills) skills[canonSkillKey(s.name)] = s.level;
  return { ...draft, statRow: row, statRolls: {}, stats, skills };
}

// Core p.77: Edgerunner tira 1d10 por STAT y toma el valor de esa columna en la fila obtenida.
export function applyEdgerunnerRoll(draft: CreatorDraft, stat: StatKey, roll: number): CreatorDraft {
  if (!draft.role) throw new Error('Falta elegir el rol.');
  if (!Number.isInteger(roll) || roll < 1 || roll > 10) throw new Error(`Tirada fuera de 1..10: ${roll}`);
  const row = CORE_ROLE_TABLES.statTables[draft.role].rows.find((r) => r.roll === roll);
  if (!row) throw new Error(`Fila de stats inexistente: ${roll}`);
  return {
    ...draft,
    statRolls: { ...draft.statRolls, [stat]: roll },
    stats: { ...draft.stats, [stat]: row[stat] }
  };
}

// Core pp. 86-87: las 20 skills del rol para Edgerunner (sin marcas "(x2)" ni "(choose 1)"; el x2 sale del catálogo).
export function getEdgerunnerSkillNames(role: CoreRoleName): string[] {
  return CORE_ROLE_TABLES.edgerunnerSkills[role].skills.map(canonSkillKey);
}

// ============================================================================
// 7. LIFEPATH (Core pp. 44-69 y CEMK RB)
// ============================================================================

export interface LifepathTables {
  general: LifepathTable[];
  role: LifepathTable[];
}

export function getLifepathTables(source: LifepathSource, role: CoreRoleName | null): LifepathTables {
  if (source === 'cemk') {
    // El JSON de CEMK no marca ninguna tabla como de rol: todas son generales.
    return { general: CEMK_CREATION.lifepath as LifepathTable[], role: [] };
  }
  return { general: CORE_LIFEPATH.general, role: role ? CORE_LIFEPATH.byRole[role].tables : [] };
}

export interface LifepathGroups {
  /** Tablas que se tiran una vez por amigo / enemigo / romance trágico. */
  friends: string[];
  enemies: string[];
  love: string[];
  /** Tablas que definen la cantidad (solo CEMK). */
  counts: string[];
}

export function getLifepathGroups(source: LifepathSource): LifepathGroups {
  if (source === 'cemk') {
    return {
      friends: ['friend_relationship', 'friend_enemy_role', 'friend_enemy_circle'],
      enemies: ['enemy_relationship', 'friend_enemy_role', 'friend_enemy_circle'],
      love: ['tragic_love'],
      counts: ['friends_count', 'enemies_count']
    };
  }
  return {
    friends: ['friends_relationship'],
    enemies: ['enemies_who', 'enemies_cause', 'enemies_throw', 'sweet_revenge'],
    love: ['tragic_love'],
    counts: []
  };
}

/** Clave del borrador para amigos/enemigos/romances: `friends.0.friend_relationship`. Las tablas simples usan su id. */
export function lifepathKey(group: 'friends' | 'enemies' | 'love', index: number, tableId: string): string {
  return `${group}.${index}.${tableId}`;
}

/** Tablas generales simples (una tirada), sin las de amigos/enemigos/romances ni las de cantidad. */
export function getSingleLifepathTables(source: LifepathSource): LifepathTable[] {
  const g = getLifepathGroups(source);
  const skip = new Set([...g.friends, ...g.enemies, ...g.love, ...g.counts]);
  return getLifepathTables(source, null).general.filter((t) => !skip.has(t.id));
}

// Core pp. 54-68: tablas de rol que solo aplican según una elección previa (el libro dice "If You Have a Partner…",
// "If on Land…", "Why Did You Leave?" para el solista que estuvo en un grupo). Clave = id de la tabla condicionada;
// cada condición pide que la tabla `table` tenga elegido un resultado cuyo `roll` esté en `rolls`. [Claude Code · 2026-10-22]
interface RoleLifepathCondition {
  table: string;
  rolls: string[];
}
const PARTNER_CONDITION: Record<string, RoleLifepathCondition[]> = { partner: [{ table: 'partner_choice', rolls: ['1'] }] };
export const ROLE_LIFEPATH_CONDITIONS: Partial<Record<CoreRoleName, Record<string, RoleLifepathCondition[]>>> = {
  Rockerboy: {
    once_in_group: [{ table: 'group_or_solo', rolls: ['2'] }],
    why_left: [
      { table: 'group_or_solo', rolls: ['2'] },
      { table: 'once_in_group', rolls: ['1'] }
    ]
  },
  Netrunner: PARTNER_CONDITION,
  Tech: PARTNER_CONDITION,
  Medtech: PARTNER_CONDITION,
  Fixer: PARTNER_CONDITION,
  Nomad: {
    land: [{ table: 'base', rolls: ['1'] }],
    air: [{ table: 'base', rolls: ['2'] }],
    sea: [{ table: 'base', rolls: ['3'] }]
  }
};

/** Tablas de lifepath de rol (Core) que aplican con las elecciones actuales; las condicionadas sin su elección no aparecen. */
export function getApplicableRoleLifepathTables(role: CoreRoleName | null, roleLifepath: Record<string, LifepathPick>, source: LifepathSource = 'core'): LifepathTable[] {
  const all = getLifepathTables(source, role).role;
  const conditions = role ? ROLE_LIFEPATH_CONDITIONS[role] ?? {} : {};
  const rollOf = (tableId: string): string | undefined => {
    const pick = roleLifepath[tableId];
    const t = all.find((x) => x.id === tableId);
    return pick && t ? t.results.find((r) => r.es === pick.value)?.roll : undefined;
  };
  return all.filter((t) =>
    (conditions[t.id] ?? []).every((c) => {
      const r = rollOf(c.table);
      return r !== undefined && c.rolls.includes(r);
    })
  );
}

function rollMatches(roll: string, n: number): boolean {
  return roll.split(',').some((part) => {
    const bounds = part.trim().split(/[-–]/).map((x) => parseInt(x, 10));
    if (bounds.length === 1) return bounds[0] === n;
    return n >= bounds[0] && n <= bounds[1];
  });
}

// Core p.45: "choose" = el jugador elige, no hay tirada. Discrepancia 14 (decidida): en CEMK gana la tabla impresa.
export function rollLifepathTable(table: LifepathTable, rng: () => number = Math.random): LifepathPick | null {
  if (table.die === 'choose') return null;
  const n = rollDie(table.die, rng);
  const result: LifepathResult | undefined = table.results.find((r) => rollMatches(r.roll, n));
  if (!result) return null;
  return { roll: String(n), value: result.es };
}

// Mapa de ids de tabla -> campo de CharacterLifepath. Varias tablas en un campo se unen con " / ".
// Lo que no esté aquí (ni sea de amigos/enemigos/romances/cantidad) va a roleSpecificLifepath.
type StringLifepathField =
  | 'culturalRegion'
  | 'personality'
  | 'clothingStyle'
  | 'hairstyle'
  | 'affectation'
  | 'valueMost'
  | 'feelAboutPeople'
  | 'valuedPerson'
  | 'valuedPossession'
  | 'familyBackground'
  | 'childhoodEnvironment'
  | 'familyCrisis'
  | 'lifeGoal';

export const LIFEPATH_FIELD_MAP: Record<LifepathSource, Record<string, StringLifepathField>> = {
  core: {
    cultural_origins: 'culturalRegion',
    personality: 'personality',
    clothing_style: 'clothingStyle',
    hairstyle: 'hairstyle',
    affectation: 'affectation',
    value_most: 'valueMost',
    feelings_about_people: 'feelAboutPeople',
    valued_person: 'valuedPerson',
    valued_possession: 'valuedPossession',
    family_background: 'familyBackground',
    childhood_environment: 'childhoodEnvironment',
    family_crisis: 'familyCrisis',
    life_goals: 'lifeGoal'
  },
  // CEMK no trae Affectation, Valued Person ni Valued Possession: esos campos quedan vacíos.
  cemk: {
    cultural_origins: 'culturalRegion',
    personality: 'personality',
    personal_style_wardrobe: 'clothingStyle',
    personal_style_hair_length: 'hairstyle',
    personal_style_hair_color: 'hairstyle',
    value_most: 'valueMost',
    feel_about_people: 'feelAboutPeople',
    family_background: 'familyBackground',
    environment: 'childhoodEnvironment',
    crisis: 'familyCrisis',
    life_goal: 'lifeGoal'
  }
};

export function buildCharacterLifepath(draft: CreatorDraft): CharacterLifepath {
  const source = draft.lifepathSource;
  const map = LIFEPATH_FIELD_MAP[source];
  const groups = getLifepathGroups(source);
  const fields: Record<StringLifepathField, string[]> = {
    culturalRegion: [],
    personality: [],
    clothingStyle: [],
    hairstyle: [],
    affectation: [],
    valueMost: [],
    feelAboutPeople: [],
    valuedPerson: [],
    valuedPossession: [],
    familyBackground: [],
    childhoodEnvironment: [],
    familyCrisis: [],
    lifeGoal: []
  };
  const roleSpecific: Record<string, string> = {};
  const tables = getLifepathTables(source, draft.role);

  for (const t of tables.general) {
    const pick = draft.lifepath[t.id];
    if (!pick || !pick.value.trim()) continue;
    const field = map[t.id];
    if (field) fields[field].push(pick.value);
    else if (![...groups.friends, ...groups.enemies, ...groups.love].includes(t.id)) roleSpecific[t.name] = pick.value;
  }

  const valueAt = (group: 'friends' | 'enemies' | 'love', i: number, tableId: string): string =>
    draft.lifepath[lifepathKey(group, i, tableId)]?.value ?? '';

  const friends: string[] = [];
  for (let i = 0; i < draft.friendsCount; i++) {
    friends.push(groups.friends.map((id) => valueAt('friends', i, id)).filter(Boolean).join(' · '));
  }
  const tragicLoveAffairs: string[] = [];
  for (let i = 0; i < draft.loveCount; i++) {
    tragicLoveAffairs.push(groups.love.map((id) => valueAt('love', i, id)).filter(Boolean).join(' · '));
  }
  const enemies: LifepathEnemy[] = [];
  for (let i = 0; i < draft.enemiesCount; i++) {
    if (source === 'core') {
      // Core pp. 66-68: quién, causa, qué puede lanzarte y venganza.
      enemies.push({
        id: `enemy-${i + 1}`,
        who: valueAt('enemies', i, 'enemies_who'),
        cause: valueAt('enemies', i, 'enemies_cause'),
        throwAtYou: valueAt('enemies', i, 'enemies_throw'),
        reaction: valueAt('enemies', i, 'sweet_revenge')
      });
    } else {
      // CEMK no trae causa ni represalia: relación, rol y círculo van en "who".
      enemies.push({
        id: `enemy-${i + 1}`,
        who: groups.enemies.map((id) => valueAt('enemies', i, id)).filter(Boolean).join(' · '),
        cause: '',
        throwAtYou: '',
        reaction: ''
      });
    }
  }

  const roleLifepath: Record<string, string> = {};
  for (const t of getApplicableRoleLifepathTables(draft.role, draft.roleLifepath, source)) {
    const pick = draft.roleLifepath[t.id];
    if (pick && pick.value.trim()) roleLifepath[t.name] = pick.value;
  }

  const join = (f: StringLifepathField): string => fields[f].join(' / ');
  const lifepath: CharacterLifepath = {
    culturalRegion: join('culturalRegion'),
    personality: join('personality'),
    clothingStyle: join('clothingStyle'),
    hairstyle: join('hairstyle'),
    affectation: join('affectation'),
    valueMost: join('valueMost'),
    feelAboutPeople: join('feelAboutPeople'),
    valuedPerson: join('valuedPerson'),
    valuedPossession: join('valuedPossession'),
    familyBackground: join('familyBackground'),
    childhoodEnvironment: join('childhoodEnvironment'),
    familyCrisis: join('familyCrisis'),
    friends,
    tragicLoveAffairs,
    enemies,
    roleLifepath,
    lifeGoal: join('lifeGoal')
  };
  if (Object.keys(roleSpecific).length > 0) lifepath.roleSpecificLifepath = roleSpecific;
  return lifepath;
}

// ============================================================================
// 8. PAQUETE DE ROL (Core pp. 98-99, 103, 117)
// ============================================================================

export interface RolePackageEntry {
  /** `${sección}:${índice}`; el índice es el de la fila en la tabla del libro (weapons y armor comparten lista). */
  key: string;
  /** Nombre ya resuelto con la opción elegida. */
  name: string;
  qty: number;
  /** Alternativas "o" del libro (la principal no se repite aquí). */
  alternatives: string[];
  /** 0 = principal, 1.. = alternativas. */
  chosen: number;
  notes: string;
}

export interface RolePackageCyberware {
  key: string;
  name: string;
  /** HL fija del dato (Core p.117). */
  humanityLoss: number;
  chosen: number;
  alternatives: Array<{ name: string; humanityLoss: number }>;
  /** En 2077 la opción principal la cubre el Neuroport: no se instala ni descuenta HL, pero se puede elegir la alternativa "o". */
  coveredByNeuroport?: boolean;
}

export interface RolePackageResult {
  weapons: RolePackageEntry[];
  armor: RolePackageEntry[];
  gear: RolePackageEntry[];
  fashion: OutfitPiece[];
  cyberware: RolePackageCyberware[];
  notes: string[];
}

const NEUROPORT_NOTE = 'Lo cubre el Neuroport (CEMK RB pp. 35-36)';

// Una alternativa con "/" entre cantidades (p. ej. "Basic Shotgun Shell Ammunition x100/Basic Slug Ammunition x100") son dos alternativas.
function flattenOptions(options: string[] | null): string[] {
  const out: string[] = [];
  for (const o of options ?? []) {
    const parts = o.split('/').map((p) => p.trim());
    if (parts.length > 1 && parts.every((p) => / x\d+$/.test(p))) out.push(...parts);
    else out.push(o.trim());
  }
  return out;
}

function splitQty(text: string, fallbackQty: number): { name: string; qty: number } {
  const m = /^(.*?)\s+x(\d+)$/.exec(text);
  return m ? { name: m[1], qty: parseInt(m[2], 10) } : { name: text, qty: fallbackQty };
}

const isArmorPackageName = (name: string): boolean => /\b(Body|Head) Armor\b/i.test(name);

function resolvePackageItem(
  item: PackageGearItem,
  key: string,
  choices: Record<string, number>,
  inheritedChoice: number | null
): RolePackageEntry {
  const alternatives = flattenOptions(item.options);
  let chosen = choices[key] ?? inheritedChoice ?? 0;
  if (chosen < 0 || chosen > alternatives.length) chosen = 0;
  const picked = chosen === 0 ? { name: item.name, qty: item.qty } : splitQty(alternatives[chosen - 1], item.qty);
  return { key, name: picked.name, qty: picked.qty, alternatives, chosen, notes: item.notes };
}

const CYBERWARE_ALT = /^o\s+(.+?)\s*\(HL\s*(\d+)\)\s*$/i;
const NEUROPORT_COVERED_CYBERWARE = ['Neural Link', 'Interface Plugs', 'Internal Agent', 'Biomonitor'];

export function getRolePackage(role: CoreRoleName, era: CharacterEra, choices: Record<string, number>): RolePackageResult {
  const pkg = CORE_GEAR_SKILLS.rolePackages[role];
  const notes: string[] = [];
  const weapons: RolePackageEntry[] = [];
  const armor: RolePackageEntry[] = [];
  // La munición "ligada al arma elegida" sigue por defecto la opción del arma larga/pistola anterior (Core pp. 98-99).
  let lastWeaponChoice: number | null = null;
  pkg.weaponsArmor.items.forEach((item, i) => {
    const key = `${isArmorPackageName(item.name) ? 'armor' : 'weapons'}:${i}`;
    const linked = /ligada a/i.test(item.notes) && !/\(s\)/.test(item.notes);
    const entry = resolvePackageItem(item, key, choices, linked ? lastWeaponChoice : null);
    if (isArmorPackageName(item.name)) {
      armor.push(entry);
      return;
    }
    if (!/ammunition/i.test(item.name) && item.options) lastWeaponChoice = entry.chosen;
    weapons.push(entry);
  });

  const gear: RolePackageEntry[] = [];
  pkg.outfit.gear.forEach((item, i) => {
    const entry = resolvePackageItem(item, `gear:${i}`, choices, null);
    // CEMK RB pp. 35-36: en 2077 el Neuroport trae el Agent (Holophone).
    if (era === '2077' && entry.name === 'Agent') {
      notes.push(`Agent: ${NEUROPORT_NOTE}`);
      return;
    }
    gear.push(entry);
  });

  const cyberware: RolePackageCyberware[] = [];
  pkg.cyberware.items.forEach((item, i) => {
    const key = `cyberware:${i}`;
    const alt = CYBERWARE_ALT.exec(item.options);
    const alternatives = alt ? [{ name: alt[1], humanityLoss: parseInt(alt[2], 10) }] : [];
    let chosen = choices[key] ?? 0;
    if (chosen < 0 || chosen > alternatives.length) chosen = 0;
    const picked = chosen === 0 ? { name: item.name, humanityLoss: item.humanityLoss } : alternatives[chosen - 1];
    // CEMK RB pp. 35-36: el Neuroport reemplaza Neural Link e Interface Plugs (si se elige la alternativa, se conserva).
    // Discrepancias 34-35 (decididas por Giuliano, 2026-10-22): también el Internal Agent (lo cubre el Holophone) y el Biomonitor (pieza del Neuroport).
    if (era === '2077' && chosen === 0 && NEUROPORT_COVERED_CYBERWARE.includes(item.name)) {
      notes.push(`${item.name}: ${NEUROPORT_NOTE}`);
      // Con alternativa "o" queda en la lista para poder elegirla (p. ej. Techhair del Exec, Wolvers del Nomad).
      if (alternatives.length > 0) cyberware.push({ key, name: item.name, humanityLoss: 0, chosen, alternatives, coveredByNeuroport: true });
      return;
    }
    cyberware.push({ key, name: picked.name, humanityLoss: picked.humanityLoss, chosen, alternatives });
  });

  return { weapons, armor, gear, fashion: pkg.outfit.pieces, cyberware, notes };
}

// ============================================================================
// 9. DINERO (Core pp. 98, 104-105, 118-119)
// ============================================================================

export interface StartingMoney {
  cash: number;
  fashionBudget: number;
  source: string;
}

function getFolioSheet(pregenId: string | null): CharacterSheet | undefined {
  return pregenId ? CEMK_FOLIO_PREMADE_CHARACTERS.find((c) => c.id === pregenId) : undefined;
}

export function getStartingMoney(draft: CreatorDraft): StartingMoney {
  const money = CORE_GEAR_SKILLS.completePackageMoney;
  switch (draft.method) {
    case 'streetrat':
    case 'edgerunner':
      // Core p.98: paquete fijo + 500 €$ libres.
      return { cash: money.streetratEdgerunnerExtra, fashionBudget: 0, source: `Core RED p.${money.extraSource.page}` };
    case 'complete_package':
      // Core pp. 104-105: 2.550 €$ para equipo y 800 €$ solo para moda (lo no gastado de moda se pierde).
      return { cash: money.gear, fashionBudget: money.fashion, source: `Core RED p.${money.source.page}` };
    case 'cemk_pregen':
      return { cash: getFolioSheet(draft.pregenId)?.eurodollars ?? 0, fashionBudget: 0, source: 'CEMK Folios' };
    default:
      // Easy Mode no imprime €$ para sus pregens.
      return { cash: 0, fashionBudget: 0, source: 'Core RED Easy Mode' };
  }
}

export function getFashionPrice(style: string, piece: string): number | null {
  const s = CORE_GEAR_SKILLS.fashionStyles.find((x) => x.name === style);
  if (!s) return null;
  const price = (s.prices as unknown as Record<string, number>)[piece];
  return typeof price === 'number' ? price : null;
}

function purchaseCost(p: CreatorPurchase): number {
  return p.cost * p.qty;
}

export function getCyberwareSpend(draft: CreatorDraft): number {
  let total = draft.purchases.filter((p) => p.category === 'cyberware').reduce((s, p) => s + purchaseCost(p), 0);
  const port = getCyberdeckPortData();
  if (draft.installCyberdeckPort) total += port.cost;
  return total;
}

/** Running Out of Cash (Core pp. 118-119, opcional): +1.500 €$ SOLO para ciberware. */
export function getRunningOutOfCashCoverage(draft: CreatorDraft): number {
  if (!draft.runningOutOfCash.enabled) return 0;
  return Math.min(CORE_GEAR_SKILLS.runningOutOfCash.cyberwareValue, getCyberwareSpend(draft));
}

export function getMoneySpent(draft: CreatorDraft): { cash: number; fashion: number } {
  const total = draft.purchases.reduce((s, p) => s + purchaseCost(p), 0) + (draft.installCyberdeckPort ? getCyberdeckPortData().cost : 0);
  const fashion = draft.fashion.reduce((s, f) => s + f.unitCost * f.qty, 0);
  return { cash: total - getRunningOutOfCashCoverage(draft), fashion };
}

export function getMoneyRemaining(draft: CreatorDraft): { cash: number; fashionBudget: number } {
  const start = getStartingMoney(draft);
  const spent = getMoneySpent(draft);
  // Core p.105: lo que sobra del presupuesto de moda se pierde (no pasa a cash).
  return { cash: start.cash - spent.cash, fashionBudget: start.fashionBudget - spent.fashion };
}

// ============================================================================
// 10. HUMANIDAD Y DERIVADOS (Core pp. 79-80, 111; CEMK RB p.25)
// ============================================================================

export interface CreatorCyberware {
  name: string;
  humanityLoss: number;
  qty: number;
  cost: number;
  source: 'package' | 'purchase' | 'neuroport' | 'cyberdeckPort' | 'runningOutOfCash';
  catalogId?: string;
}

interface PackCyberware {
  id: string;
  name: string;
  humanityLoss: string;
  cost: number;
}

const packCyberware = (): PackCyberware[] => (pack as unknown as { cyberware: PackCyberware[] }).cyberware;

function getCyberdeckPortData(): { name: string; humanityLoss: number; cost: number; catalogId?: string } {
  const fromPack = packCyberware().find((c) => c.id === 'cw-cemk-cyberdeck-port');
  if (fromPack) {
    return { name: fromPack.name, humanityLoss: parseHumanityLossAverage(fromPack.humanityLoss), cost: fromPack.cost, catalogId: fromPack.id };
  }
  const port = CEMK_CREATION.cyberdeckPort;
  const cost = /(\d[\d,.]*)/.exec(port.cost);
  return {
    name: 'Cyberdeck Port',
    humanityLoss: parseHumanityLossAverage(port.humanityLoss),
    cost: cost ? parseInt(cost[1].replace(/[,.]/g, ''), 10) : 0
  };
}

export function getCyberwareList(draft: CreatorDraft): CreatorCyberware[] {
  if (isPregenMethod(draft.method)) return [];
  const list: CreatorCyberware[] = [];
  if (draft.role && (draft.method === 'streetrat' || draft.method === 'edgerunner')) {
    for (const c of getRolePackage(draft.role, draft.era, draft.packageChoices).cyberware) {
      if (c.coveredByNeuroport) continue;
      list.push({ name: c.name, humanityLoss: c.humanityLoss, qty: 1, cost: 0, source: 'package' });
    }
  }
  for (const p of draft.purchases) {
    if (p.category === 'cyberware') {
      list.push({ name: p.name, humanityLoss: p.humanityLoss, qty: p.qty, cost: p.cost, source: 'purchase', catalogId: p.catalogId });
    }
  }
  // CEMK RB p.25: el Neuroport se instala con HL 0 en la creación.
  if (draft.era === '2077' && draft.installNeuroport) {
    list.push({ name: 'Neuroport', humanityLoss: 0, qty: 1, cost: 0, source: 'neuroport', catalogId: 'cw-cemk-neuroport' });
  }
  if (draft.installCyberdeckPort) {
    const port = getCyberdeckPortData();
    list.push({ name: port.name, humanityLoss: port.humanityLoss, qty: 1, cost: port.cost, source: 'cyberdeckPort', catalogId: port.catalogId });
  }
  // Core p.118: Running Out of Cash da un Neural Link gratis; en 2077 con Neuroport ya lo trae (CEMK RB pp. 35-36).
  if (draft.runningOutOfCash.enabled && !isPregenMethod(draft.method)) {
    const hasLink = list.some((c) => c.name === 'Neural Link');
    const coveredByNeuroport = draft.era === '2077' && draft.installNeuroport;
    if (!hasLink && !coveredByNeuroport) {
      const link = packCyberware().find((c) => c.id === 'neuralware-processor');
      list.push({
        name: 'Neural Link',
        humanityLoss: link ? parseHumanityLossAverage(link.humanityLoss) : 7,
        qty: 1,
        cost: 0,
        source: 'runningOutOfCash',
        catalogId: link?.id
      });
    }
  }
  return list;
}

export interface DerivedStats {
  maxHp: number;
  seriouslyWounded: number;
  deathSave: number;
  maxHumanity: number;
  humanityLoss: number;
  humanity: number;
  effectiveEmp: number;
  /** BODY con el bono de ciberware (Core p.114, Grafted Muscle). La ficha guarda el BODY base. */
  effectiveBody: number;
}

export function computeDerived(draft: CreatorDraft): DerivedStats {
  const { WILL, EMP } = draft.stats;
  // [Claude Code · 2026-10-23] Core p.114: Grafted Muscle suma +2 BODY por instalación (tope 10).
  const cyberIds: string[] = [];
  for (const c of getCyberwareList(draft)) {
    const id = c.catalogId ?? CANON_CYBERWARE_IDS[c.name];
    if (id) for (let i = 0; i < c.qty; i++) cyberIds.push(id);
  }
  const BODY = cyberwareStatBonus(cyberIds, 'BODY', draft.stats.BODY);
  const maxHp = calculateMaxHp(BODY, WILL);
  const maxHumanity = calculateMaxHumanity(EMP);
  const humanityLoss = getCyberwareList(draft).reduce((s, c) => s + c.humanityLoss * c.qty, 0);
  const humanity = maxHumanity - humanityLoss;
  return {
    maxHp,
    // Core pp. 79-80: Seriously Wounded = mitad de HP; Death Save = BODY; Humanity = EMP x 10.
    seriouslyWounded: calculateSeriouslyWoundedThreshold(maxHp),
    deathSave: BODY,
    maxHumanity,
    humanityLoss,
    humanity,
    // Core p.80: la EMP baja cada vez que baja una decena de Humanity.
    effectiveEmp: Math.max(0, Math.min(EMP, Math.floor(humanity / 10))),
    effectiveBody: BODY
  };
}

// ============================================================================
// 11. VALIDACIÓN
// ============================================================================

function validateMethod(d: CreatorDraft): string[] {
  const errs: string[] = [];
  if (!d.era) errs.push('Elige la era.');
  if (!d.method) errs.push('Elige un método de creación.');
  else if (isPregenMethod(d.method) && !d.pregenId) errs.push('Elige un personaje prearmado.');
  return errs;
}

function validateRole(d: CreatorDraft): string[] {
  if (isPregenMethod(d.method)) return [];
  const errs: string[] = [];
  if (!d.role) errs.push('Elige un rol.');
  else if (d.roleAbilityVariant === 'cemk' && !roleSupportsCemkVariant(d.role)) {
    errs.push(`${d.role} solo tiene versión Core de la Habilidad de Rol.`);
  }
  return errs;
}

function validateLifepath(d: CreatorDraft): string[] {
  if (isPregenMethod(d.method)) return [];
  const errs: string[] = [];
  const has = (key: string): boolean => !!d.lifepath[key]?.value.trim();
  for (const t of getSingleLifepathTables(d.lifepathSource)) {
    if (!has(t.id)) errs.push(`Lifepath: falta "${t.name}".`);
  }
  const g = getLifepathGroups(d.lifepathSource);
  const tablesById = new Map(getLifepathTables(d.lifepathSource, d.role).general.map((t) => [t.id, t.name]));
  const groupDefs: Array<[ 'friends' | 'enemies' | 'love', number, string[], string ]> = [
    ['friends', d.friendsCount, g.friends, 'amigo'],
    ['enemies', d.enemiesCount, g.enemies, 'enemigo'],
    ['love', d.loveCount, g.love, 'romance trágico']
  ];
  for (const [group, count, ids, label] of groupDefs) {
    for (let i = 0; i < count; i++) {
      for (const id of ids) {
        if (!has(lifepathKey(group, i, id))) errs.push(`Lifepath: falta "${tablesById.get(id) ?? id}" del ${label} ${i + 1}.`);
      }
    }
  }
  if (d.role) {
    for (const t of getApplicableRoleLifepathTables(d.role, d.roleLifepath, d.lifepathSource)) {
      if (!d.roleLifepath[t.id]?.value.trim()) errs.push(`Lifepath de rol: falta "${t.name}"${t.die === 'choose' ? ' (se elige a mano)' : ''}.`);
    }
  }
  return errs;
}

function validateStats(d: CreatorDraft): string[] {
  const errs: string[] = [];
  if (d.method === 'streetrat') {
    if (d.statRow === null) errs.push('Streetrat: elige o tira la fila de stats (Core p.74).');
  } else if (d.method === 'edgerunner') {
    if (!d.role) return ['Elige un rol antes de tirar los stats.'];
    const rows = CORE_ROLE_TABLES.statTables[d.role].rows;
    for (const k of STAT_KEYS) {
      const r = d.statRolls[k];
      if (r === undefined) errs.push(`Edgerunner: falta tirar ${k} (Core p.77).`);
      else if (rows.find((x) => x.roll === r)?.[k] !== d.stats[k]) errs.push(`Edgerunner: ${k} no coincide con la tirada ${r}.`);
    }
  } else if (d.method === 'complete_package') {
    for (const k of STAT_KEYS) {
      if (d.stats[k] < STAT_MIN || d.stats[k] > STAT_MAX) errs.push(`${k} debe estar entre ${STAT_MIN} y ${STAT_MAX} (Core p.78).`);
    }
    const spent = getStatPointsSpent(d.stats);
    if (spent !== STAT_POINTS_COMPLETE_PACKAGE) errs.push(`Los stats deben sumar ${STAT_POINTS_COMPLETE_PACKAGE} puntos (llevas ${spent}) (Core p.78).`);
  }
  return errs;
}

function validateSkills(d: CreatorDraft): string[] {
  if (isPregenMethod(d.method)) return [];
  const errs: string[] = [];
  if (!d.culturalLanguage.trim()) errs.push('Elige el idioma cultural (Core p.90).');
  // Core p.45: todos hablan Streetslang; el idioma de origen es otra lengua. [Claude Code · 2026-10-25]
  else if (d.culturalLanguage.trim().toLowerCase() === 'streetslang') errs.push('El idioma de origen es otra lengua: Streetslang ya va como skill básica (Core pp. 45 y 85).');
  const spent = getSkillPointsSpent(d);
  if (d.method === 'edgerunner') {
    if (!d.role) return [...errs, 'Elige un rol antes de repartir skills.'];
    const allowed = getEdgerunnerSkillNames(d.role);
    // Martial Arts por forma y Play Instrument/Science con especialidad cuentan como la skill base del rol (Core p.83).
    const matchesAllowed = (key: string, name: string): boolean =>
      key === name || (baseSkillName(key) === name && (isFormKeyBase(key) || isSpecialtyBase(key)));
    for (const name of Object.keys(d.skills)) {
      if (!allowed.some((a) => matchesAllowed(name, a))) errs.push(`Edgerunner: "${name}" no es una de las 20 skills del rol (Core pp. 86-87).`);
    }
    for (const name of allowed) {
      const lvl = Math.max(0, ...Object.entries(d.skills).filter(([k]) => matchesAllowed(k, name)).map(([, v]) => v));
      if (lvl < SKILL_MIN_EDGERUNNER || lvl > SKILL_MAX_LEVEL) {
        errs.push(`Edgerunner: ${name} debe estar entre ${SKILL_MIN_EDGERUNNER} y ${SKILL_MAX_LEVEL} (Core p.77).`);
      }
    }
    if (spent !== SKILL_POINTS) errs.push(`Las skills deben sumar ${SKILL_POINTS} puntos (llevas ${spent}) (Core p.81).`);
  } else if (d.method === 'complete_package') {
    for (const [name, lvl] of Object.entries(d.skills)) {
      if (lvl > SKILL_MAX_LEVEL || lvl < 0) errs.push(`${name} no puede pasar de ${SKILL_MAX_LEVEL} (Core p.81).`);
    }
    for (const s of getSkillCatalog().filter((x) => x.basic)) {
      // Language es Language (Streetslang), mínimo 2; el idioma de origen va aparte (Core pp. 45 y 85). [Claude Code · 2026-10-25]
      const lvl = Object.entries(d.skills).find(([n]) => baseSkillName(n) === s.name)?.[1] ?? 0;
      if (lvl < 2) errs.push(`La skill básica ${s.name} debe empezar en 2 o más (Core p.85).`);
    }
    if (spent !== SKILL_POINTS) errs.push(`Las skills deben sumar ${SKILL_POINTS} puntos (llevas ${spent}) (Core p.81).`);
  }
  // Core p.83 (decisiones 39-46): forma de Martial Arts y especialidad de Play Instrument/Science obligatorias.
  for (const [name, lvl] of Object.entries(d.skills)) {
    if (lvl <= 0) continue;
    const base = baseSkillName(name);
    if (base === 'Martial Arts' && !skillSpecialty(name)) errs.push('Elegí la forma de Martial Arts (Core p.83).');
    else if (SPECIALTY_SKILLS.includes(base) && !skillSpecialty(name)) errs.push(`Elegí la especialidad de ${base} (Core p.83).`);
  }
  return errs;
}

function validateGear(d: CreatorDraft): string[] {
  if (isPregenMethod(d.method)) return [];
  const errs: string[] = [];
  const left = getMoneyRemaining(d);
  if (left.cash < 0) errs.push(`Te pasaste del dinero por ${-left.cash} €$.`);
  if (left.fashionBudget < 0) errs.push(`Te pasaste del presupuesto de moda por ${-left.fashionBudget} €$ (Core p.105).`);
  if (d.runningOutOfCash.enabled) {
    const options = CORE_GEAR_SKILLS.runningOutOfCash.options;
    if (!d.runningOutOfCash.employer || !options.includes(d.runningOutOfCash.employer)) {
      errs.push('Running Out of Cash: elige uno de los tres empleadores (Core p.118).');
    }
    // Core p.118: los 1.500 €$ extra cubren solo ciberware (getRunningOutOfCashCoverage); el resto sale del dinero normal.
  }
  if (d.installCyberdeckPort && !(d.era === '2077' && d.installNeuroport)) {
    errs.push('El Cyberdeck Port requiere el Neuroport (CEMK RB p.36).');
  }
  // v5.3.2: lo que ya trae el Neuroport no se compra de nuevo (CEMK RB p.36). [Claude Code · 2026-10-29]
  for (const p of d.purchases) {
    const piece = neuroportCovers(p.catalogId, d.era, d.installNeuroport);
    if (piece) errs.push(`${p.name} ya viene en el Neuroport${piece === p.name ? '' : ` (${piece})`}: sacalo de las compras (CEMK RB p.36).`);
  }
  if (d.role && (d.method === 'streetrat' || d.method === 'edgerunner')) {
    const src = CORE_GEAR_SKILLS.rolePackages[d.role];
    const optionCounts: Record<string, number> = {};
    src.weaponsArmor.items.forEach((it, i) => {
      const n = flattenOptions(it.options).length;
      optionCounts[`${isArmorPackageName(it.name) ? 'armor' : 'weapons'}:${i}`] = n;
    });
    src.outfit.gear.forEach((it, i) => (optionCounts[`gear:${i}`] = flattenOptions(it.options).length));
    src.cyberware.items.forEach((it, i) => (optionCounts[`cyberware:${i}`] = CYBERWARE_ALT.test(it.options) ? 1 : 0));
    for (const [key, idx] of Object.entries(d.packageChoices)) {
      if (!(key in optionCounts)) continue;
      if (idx < 0 || idx > optionCounts[key]) errs.push(`Paquete de rol: opción inválida en ${key}.`);
    }
  }
  return errs;
}

export function validateStep(draft: CreatorDraft, stepId: CreatorStepId): string[] {
  switch (stepId) {
    case 'method':
      return validateMethod(draft);
    case 'role':
      return validateRole(draft);
    case 'lifepath':
      return validateLifepath(draft);
    case 'stats':
      return validateStats(draft);
    case 'skills':
      return validateSkills(draft);
    case 'gear':
      return validateGear(draft);
    case 'summary': {
      const errs: string[] = [];
      if (!draft.handle.trim() && !isPregenMethod(draft.method)) errs.push('Falta el handle del personaje.');
      const steps: CreatorStepId[] = ['method', 'role', 'lifepath', 'stats', 'skills', 'gear'];
      for (const s of steps) errs.push(...validateStep(draft, s));
      return errs;
    }
  }
}

export function getMissingChecklist(draft: CreatorDraft): Array<{ step: CreatorStepId; message: string }> {
  const out: Array<{ step: CreatorStepId; message: string }> = [];
  const steps: CreatorStepId[] = ['method', 'role', 'lifepath', 'stats', 'skills', 'gear'];
  for (const step of steps) for (const message of validateStep(draft, step)) out.push({ step, message });
  if (!draft.handle.trim() && !isPregenMethod(draft.method)) out.push({ step: 'summary', message: 'Falta el handle del personaje.' });
  return out;
}

// ============================================================================
// 12. CONSTRUCCIÓN DE LA FICHA
// ============================================================================

interface PackWeapon {
  id: string;
  name: string;
  ammoType?: string;
  standardMag?: number;
  [k: string]: unknown;
}
interface PackNamed {
  id: string;
  name: string;
  cost: number;
  sp?: number;
  penalty?: number;
}

const lookupByName = <T extends { name: string }>(list: T[], name: string): T | undefined =>
  list.find((x) => x.name === name) ?? list.find((x) => x.name.toLowerCase() === name.toLowerCase());

const newCharacterId = (nowId?: string): string => `char-${nowId ?? `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`}`;

function emptyArmor(): CharacterSheet['headArmor'] {
  return { name: 'Sin armadura', maxSp: 0, currentSp: 0, penalty: 0 };
}

function buildPregenSheet(draft: CreatorDraft, nowId: string | undefined, warnings: string[]): CharacterSheet {
  const id = newCharacterId(nowId);
  if (draft.method === 'cemk_pregen') {
    const folio = getFolioSheet(draft.pregenId);
    if (!folio) throw new Error(`Folio inexistente: ${draft.pregenId}`);
    let sheet = JSON.parse(JSON.stringify(folio)) as CharacterSheet;
    sheet.id = id;
    if (draft.handle.trim()) sheet.handle = draft.handle.trim();
    sheet.roleRank = 4; // Discrepancia 12 (decidida): rango inicial 4.
    // Core pp. 79-80 / CEMK RB p.25: Humanity = EMP x 10 - HL del ciberware instalado (Neuroport 0).
    const cw = packCyberware();
    const loss = sheet.installedCyberwareIds.reduce((s, cid) => {
      if (cid === 'cw-cemk-neuroport') return s;
      const item = cw.find((c) => c.id === cid);
      return s + (item ? parseHumanityLossAverage(item.humanityLoss) : 0);
    }, 0);
    sheet.currentHumanity = Math.max(0, sheet.stats.EMP * 10 - loss);
    sheet.creationMethod = 'pregen';
    sheet.sourceFolioId = folio.id;
    sheet.era = '2077';
    sheet.roleAbilityVariant = 'core';
    sheet.improvementPoints = 0;
    sheet.ipLog = [];
    sheet = applyFolioAllocation(sheet, folio.id);
    warnings.push('Ficha de CEMK: no sigue los límites del Core; las skills que no trae quedan en 0.');
    return sheet;
  }
  const tpl = PREGEN_TEMPLATES.find((p) => p.id === draft.pregenId);
  if (!tpl) throw new Error(`Pregen inexistente: ${draft.pregenId}`);
  const sheet = buildCharacterSheetFromPregen(tpl);
  sheet.id = id;
  if (draft.handle.trim()) sheet.handle = draft.handle.trim();
  sheet.creationMethod = 'pregen';
  return sheet;
}

export function buildCharacterSheetFromDraft(draft: CreatorDraft, nowId?: string): { sheet: CharacterSheet; warnings: string[] } {
  const warnings: string[] = [];
  if (isPregenMethod(draft.method)) return { sheet: buildPregenSheet(draft, nowId, warnings), warnings };
  if (!draft.role || !draft.method) throw new Error('Faltan método y rol para construir la ficha.');
  const role = draft.role;
  const method = draft.method as 'streetrat' | 'edgerunner' | 'complete_package';
  const derived = computeDerived(draft);
  const money = getMoneyRemaining(draft);
  const hasPackage = method === 'streetrat' || method === 'edgerunner';
  const rolePkg = hasPackage ? getRolePackage(role, draft.era, draft.packageChoices) : null;

  // Skills: 16 de combate vía resolveSkillKey, el resto a generalSkills con nombre canon (Core pp. 81-85).
  const skills = createDefaultCombatSkills();
  const generalSkills: Record<string, number> = {};
  const knownMartialArts: Record<string, number> = {};
  for (const [name, level] of Object.entries(draft.skills)) {
    // Core p.83: cada forma de Martial Arts va a knownMartialArts y skills.martialArts toma el máximo.
    const formName = isFormKeyBase(name) ? skillSpecialty(name) : null;
    const form = formName ? MARTIAL_ARTS_FORMS.find((f) => f.name.toLowerCase() === formName.toLowerCase()) : undefined;
    if (form) {
      if (level > 0) knownMartialArts[form.id] = level;
      continue;
    }
    // Play Instrument/Science con especialidad conservan su clave completa en generalSkills.
    if (isSpecialtyBase(name) && skillSpecialty(name)) {
      generalSkills[canonSkillKey(name)] = level;
      continue;
    }
    const ref = resolveSkillKey(name);
    if (ref && ref.kind === 'combat') skills[ref.key as CombatSkillKey] = Math.max(skills[ref.key as CombatSkillKey], level);
    else generalSkills[ref ? ref.key : canonSkillKey(name)] = level;
  }
  const martialLevels = Object.values(knownMartialArts);
  if (martialLevels.length > 0) skills.martialArts = Math.max(skills.martialArts, ...martialLevels);
  // Core p.90: 4 niveles de idioma cultural gratis.
  if (draft.culturalLanguage.trim()) generalSkills[`Language (${draft.culturalLanguage.trim()})`] = 4;

  const weaponsDb = (pack as unknown as { weapons: PackWeapon[] }).weapons;
  const armorDb = (pack as unknown as { armor: PackNamed[] }).armor;
  const gearDb = (pack as unknown as { gear: PackNamed[] }).gear;
  const ammoDb = (pack as unknown as { ammunition: PackNamed[] }).ammunition;

  const equippedWeapons: EquippedWeapon[] = [];
  const inventory: InventoryItem[] = [];
  let invCounter = 0;
  const addInventory = (category: InventoryItem['category'], catalogId: string, name: string, cost: number, quantity: number, details?: string): void => {
    inventory.push({ id: `inv-${++invCounter}`, catalogId, name, category, cost, quantity, ...(details ? { details } : {}) });
  };
  const addWeapon = (w: PackWeapon): void => {
    const ammoType = w.ammoType && w.ammoType !== 'N/A' ? w.ammoType : undefined;
    equippedWeapons.push({
      ...(w as unknown as EquippedWeapon),
      instanceId: `wep-${equippedWeapons.length}-${w.id}`,
      currentMag: w.standardMag ?? 0,
      // Tipo de bala, no el calibre (que queda en ammoType): Basic al crear (Core p.345). [Claude Code · 2026-10-25]
      loadedAmmoType: ammoType ? 'Basic' : '',
      inHand: equippedWeapons.length === 0
    });
  };

  // Paquete del rol (Core pp. 98-99): armas, munición y granadas.
  if (rolePkg) {
    for (const e of rolePkg.weapons) {
      const w = lookupByName(weaponsDb, e.name);
      if (w) {
        for (let i = 0; i < e.qty; i++) addWeapon(w);
        continue;
      }
      const a = lookupByName(armorDb, e.name);
      const am = lookupByName(ammoDb, e.name);
      if (a) addInventory('armor', a.id, a.name, a.cost, e.qty, 'Paquete de rol');
      else if (am) addInventory('ammunition', am.id, am.name, am.cost, e.qty, 'Paquete de rol');
      else {
        // Munición "<Tipo> ... Ammunition" del libro (Basic, Incendiary...): se guarda como "<Tipo> Ammo" del pack, con el tipo
        // de arma en el nombre. Core p.345: la Incendiary existe para Shotgun Shells.
        const ammoKind = /^(\S+) .*Ammunition$/i.exec(e.name)?.[1];
        const basic = ammoKind ? ammoDb.find((x) => x.name.toLowerCase() === `${ammoKind.toLowerCase()} ammo`) : undefined;
        addInventory(basic ? 'ammunition' : 'weapons', basic?.id ?? '', e.name, basic?.cost ?? 0, e.qty, 'Paquete de rol');
        if (!basic) warnings.push(`"${e.name}" no está en el catálogo del pack: queda en el inventario sin ID.`);
      }
    }
    for (const e of rolePkg.gear) {
      const g = lookupByName(gearDb, e.name);
      addInventory('gear', g?.id ?? '', e.name, g?.cost ?? 0, e.qty, 'Paquete de rol');
    }
    for (const p of rolePkg.fashion) addInventory('gear', '', `${p.style} - ${p.piece}`, 0, p.qty, 'Moda del paquete (Core p.103)');
  }

  // Compras (Complete Package o dinero libre).
  for (const p of draft.purchases) {
    if (p.category === 'weapons') {
      const w = weaponsDb.find((x) => x.id === p.catalogId) ?? lookupByName(weaponsDb, p.name);
      if (w) for (let i = 0; i < p.qty; i++) addWeapon(w);
      else {
        addInventory('weapons', p.catalogId, p.name, p.cost, p.qty, 'Compra de creación');
        warnings.push(`"${p.name}" no está en el catálogo de armas: queda en el inventario.`);
      }
    } else if (p.category === 'ammunition') {
      // Core p.344: cada compra son 10 balas (granadas y cohetes, de a una); el inventario cuenta unidades. [Claude Code · 2026-10-25]
      addInventory('ammunition', p.catalogId, p.name, p.cost, isPerUnitAmmo(p.name) ? p.qty : p.qty * 10, 'Compra de creación');
    } else if (p.category !== 'cyberware' && p.category !== 'armor') {
      const cat = p.category === 'gear' || p.category === 'drugs' || p.category === 'programs' ? p.category : 'gear';
      addInventory(cat, p.catalogId, p.name, p.cost, p.qty, 'Compra de creación');
    }
  }
  for (const f of draft.fashion) addInventory('gear', '', `${f.style} - ${f.piece}`, f.unitCost, f.qty, 'Moda de creación');

  // Armadura: la de más SP entre el paquete y las compras (Light Armorjack SP 11 en los paquetes, Core p.98).
  type ArmorUnit = { name: string; sp: number; penalty: number; purchaseIndex?: number };
  const armorUnits = (kind: 'Head' | 'Body'): ArmorUnit[] => {
    const out: ArmorUnit[] = [];
    for (const e of rolePkg?.armor ?? []) {
      const sp = /\(SP(\d+)\)/.exec(e.name);
      if (new RegExp(`${kind} Armor`, 'i').test(e.name) && sp) {
        out.push({ name: e.name.replace(/\s*(Head|Body) Armor.*$/i, ''), sp: parseInt(sp[1], 10), penalty: lookupByName(armorDb, e.name.replace(/\s*(Head|Body) Armor.*$/i, ''))?.penalty ?? 0 });
      }
    }
    draft.purchases.forEach((p, purchaseIndex) => {
      const a = p.category === 'armor' ? armorDb.find((x) => x.id === p.catalogId) : undefined;
      const locationOk = !p.location || p.location === (kind === 'Head' ? 'head' : 'body');
      if (a && locationOk && !/shield/i.test(a.name)) out.push({ name: a.name, sp: a.sp ?? 0, penalty: a.penalty ?? 0, purchaseIndex });
    });
    return out;
  };
  const equippedFrom: number[] = [];
  const best = (kind: 'Head' | 'Body'): CharacterSheet['headArmor'] => {
    const top = armorUnits(kind).sort((a, b) => b.sp - a.sp)[0];
    if (top?.purchaseIndex !== undefined) equippedFrom.push(top.purchaseIndex);
    return top ? { name: `${top.name} (${kind})`, maxSp: top.sp, currentSp: top.sp, penalty: top.penalty } : emptyArmor();
  };
  const headArmor = best('Head');
  const bodyArmor = best('Body');
  // v5.3.2: la pieza que queda puesta no se repite en la mochila; solo van las de más y los escudos. [Claude Code · 2026-10-29]
  draft.purchases.forEach((p, i) => {
    if (p.category !== 'armor') return;
    const qty = p.qty - equippedFrom.filter((x) => x === i).length;
    if (qty > 0) addInventory('armor', p.catalogId, p.name, p.cost, qty, 'Compra de creación');
  });

  // Ciberware: ids del pack por nombre; sin id -> warning y nota.
  const installedCyberwareIds: string[] = [];
  const cyberNotes: string[] = [];
  for (const c of getCyberwareList(draft)) {
    const id = c.catalogId ?? CANON_CYBERWARE_IDS[c.name] ?? lookupByName(packCyberware(), c.name)?.id;
    if (id) for (let i = 0; i < c.qty; i++) installedCyberwareIds.push(id);
    else {
      warnings.push(`Ciberware sin ID en el catálogo: ${c.name}.`);
      cyberNotes.push(`${c.name} (HL ${c.humanityLoss})`);
    }
  }

  // Notas: vivienda inicial (Core p.377 / housing) y Running Out of Cash.
  const notes: string[] = [];
  const h = CORE_GEAR_SKILLS.housing;
  if (role === 'Exec') {
    notes.push(`Vivienda inicial: ${h.exec.housing} (${h.exec.location}), estilo ${h.exec.lifestyle}; sin renta este mes, ${h.exec.lifestyleMonthly} €$ el día 1 de cada mes.`);
  } else {
    notes.push(`Vivienda inicial: ${h.default.housing} (${h.default.location}), estilo ${h.default.lifestyle}; primer mes gratis, ${h.default.owedNextMonth} €$ el día 1 del mes siguiente o desalojo el día ${h.default.evictionDay}.`);
  }
  if (draft.runningOutOfCash.enabled) {
    notes.push(
      `Running Out of Cash (Core pp. 118-119): ${draft.runningOutOfCash.employer ?? 'empleador sin elegir'}. +${CORE_GEAR_SKILLS.runningOutOfCash.cyberwareValue} €$ solo para ciberware y Neural Link gratis${draft.era === '2077' && draft.installNeuroport ? ' (el Neuroport ya lo trae)' : ''}.`
    );
  }
  if (cyberNotes.length > 0) notes.push(`Ciberware sin ID: ${cyberNotes.join(', ')}.`);
  if (rolePkg) notes.push(...rolePkg.notes);

  const ability = getRoleAbilityInfo(role, 'core', draft.era);
  const sheet: CharacterSheet = {
    id: newCharacterId(nowId),
    handle: draft.handle.trim(),
    role,
    roleRank: 4,
    notes: notes.join('\n'),
    stats: { ...draft.stats },
    currentHp: derived.maxHp,
    currentLuck: draft.stats.LUCK,
    currentHumanity: derived.humanity,
    headArmor,
    bodyArmor,
    skills,
    equippedWeapons,
    installedCyberwareIds,
    activeInjuries: [],
    eurodollars: money.cash,
    inventory,
    transactions: [],
    era: draft.era,
    creationMethod: method,
    roleAbilityName: ability.name,
    roleAbilityVariant: 'core',
    improvementPoints: 0,
    ipLog: [],
    generalSkills,
    ...(Object.keys(knownMartialArts).length > 0 ? { knownMartialArts } : {}),
    fashionBudgetRemaining: 0,
    hasNeuroport: draft.era === '2077' && draft.installNeuroport,
    lifepath: buildCharacterLifepath(draft)
  };
  return { sheet, warnings };
}

// ============================================================================
// 13. AVISOS DEL RESUMEN (plan 12, v4.9.4) [Claude Code · 2026-10-23]
// ============================================================================

export interface SummaryWarning {
  id: string;
  message: string;
  source?: { book: string; page: number };
}

/** Avisos que no bloquean la creación. `built` acepta la forma con sheet null (checklist incompleta). */
export function getSummaryWarnings(draft: CreatorDraft, built: { sheet: CharacterSheet | null }): SummaryWarning[] {
  if (!draft.method || isPregenMethod(draft.method)) return [];
  const out: SummaryWarning[] = [];
  const push = (id: string, message: string, withSource: boolean): void => {
    const src = withSource ? CREATOR_GUIDE.warningRules.find((r) => r.id === id)?.source : null;
    out.push(src ? { id, message, source: { book: src.book, page: src.page } } : { id, message });
  };

  const left = getMoneyRemaining(draft);
  if (left.cash > 0) {
    const how =
      draft.method === 'complete_package'
        ? 'en Paquete Completo lo que no se gasta se conserva'
        : 'en Streetrat y Edgerunner se guardan para después';
    push('unspent-money', `Te quedan ${left.cash}eb sin gastar: ${how}.`, true);
    // Streetrat y Edgerunner: Core p.98; Paquete Completo: Core p.104.
    const last = out[out.length - 1];
    if (last.source && draft.method !== 'complete_package') last.source = { ...last.source, page: 98 };
  }
  if (draft.method === 'complete_package' && left.fashionBudget > 0) {
    const src = CREATOR_GUIDE.warningRules.find((r) => r.id === 'unspent-money')?.source;
    out.push({
      id: 'unspent-fashion',
      message: `Te quedan ${left.fashionBudget}eb de moda sin gastar: se pierden.`,
      ...(src ? { source: { book: src.book, page: 105 } } : {})
    });
  }

  const derived = computeDerived(draft);
  if (derived.effectiveEmp < draft.stats.EMP) {
    push('humanity-emp', `Tu Humanidad (${derived.humanity}) baja tu EMP de ${draft.stats.EMP} a ${derived.effectiveEmp}.`, true);
  }

  // Si validateSkills ya lo marca como error bloqueante, no se duplica el aviso.
  if ((draft.method === 'edgerunner' || draft.method === 'complete_package') && validateStep(draft, 'skills').length === 0) {
    const low = getSkillCatalog()
      .filter((x) => x.basic)
      .filter((s) => (Object.entries(draft.skills).find(([n]) => baseSkillName(n) === s.name)?.[1] ?? 0) < 2)
      .map((s) => s.name);
    if (low.length > 0) push('basic-skills-zero', `Skills básicas por debajo de 2: ${low.join(', ')}.`, true);
  }

  // v5.3.2: programas y Hardware contra los slots del cyberdeck; solo avisa (decisión de Giuliano). [Claude Code · 2026-10-29]
  const slots = deckSlotUse(draft.purchases);
  if (slots.programs + slots.hardware > 0 && slots.deckSlots === 0) {
    out.push({ id: 'no-cyberdeck', message: 'Compraste programas o Hardware pero no un cyberdeck.', source: { book: 'Core RED', page: 196 } });
  } else if (slots.overflow > 0) {
    out.push({
      id: 'deck-slots',
      message: `Programas y Hardware ocupan ${slots.deckSlots + slots.overflow} slots y el cyberdeck tiene ${slots.deckSlots}: lo que sobra queda en la mochila.`,
      source: { book: 'Core RED', page: 196 }
    });
  }

  if (built.sheet) {
    if (built.sheet.equippedWeapons.length === 0) push('no-weapon', 'El personaje no tiene armas.', false);
    if (built.sheet.headArmor.maxSp <= 0 && built.sheet.bodyArmor.maxSp <= 0) push('no-armor', 'El personaje no tiene armadura.', false);
  }
  return out;
}
