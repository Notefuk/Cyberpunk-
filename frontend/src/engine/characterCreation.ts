// Motor de creación de personajes (plan 7, v4.8.2). Reglas: Core RED v1.24 pp. 40-119 y CEMK RB p.25. [Claude Code · 2026-10-22]
// Motor puro: sin React ni localStorage. El wizard solo muestra datos y llama a estas funciones.
import { CEMK_CREATION, CORE_GEAR_SKILLS, CORE_LIFEPATH, CORE_ROLE_TABLES, CORE_ROLES } from '../data/creation';
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
import { calculateMaxHp, calculateSeriouslyWoundedThreshold, calculateMaxHumanity, parseHumanityLossAverage } from './characterEngine';
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

export type CreatorPurchaseCategory = 'weapons' | 'armor' | 'cyberware' | 'gear' | 'ammunition' | 'drugs';

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
}

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
    textEs: `${coreRole.ability.summaryEs}\n\nRango 4: ${coreRole.ability.rank4Es}`,
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
}

export function computeDerived(draft: CreatorDraft): DerivedStats {
  const { BODY, WILL, EMP } = draft.stats;
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
    effectiveEmp: Math.max(0, Math.min(EMP, Math.floor(humanity / 10)))
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
  const spent = getSkillPointsSpent(d);
  if (d.method === 'edgerunner') {
    if (!d.role) return [...errs, 'Elige un rol antes de repartir skills.'];
    const allowed = getEdgerunnerSkillNames(d.role);
    for (const name of Object.keys(d.skills)) {
      if (!allowed.includes(name)) errs.push(`Edgerunner: "${name}" no es una de las 20 skills del rol (Core pp. 86-87).`);
    }
    for (const name of allowed) {
      const lvl = d.skills[name] ?? 0;
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
      // El idioma cultural (gratis en 4, Core p.90) cubre la skill básica Language.
      if (s.name === 'Language' && d.culturalLanguage.trim()) continue;
      const lvl = Object.entries(d.skills).find(([n]) => baseSkillName(n) === s.name)?.[1] ?? 0;
      if (lvl < 2) errs.push(`La skill básica ${s.name} debe empezar en 2 o más (Core p.85).`);
    }
    if (spent !== SKILL_POINTS) errs.push(`Las skills deben sumar ${SKILL_POINTS} puntos (llevas ${spent}) (Core p.81).`);
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
    const sheet = JSON.parse(JSON.stringify(folio)) as CharacterSheet;
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
  for (const [name, level] of Object.entries(draft.skills)) {
    const ref = resolveSkillKey(name);
    if (ref && ref.kind === 'combat') skills[ref.key as CombatSkillKey] = Math.max(skills[ref.key as CombatSkillKey], level);
    else generalSkills[ref ? ref.key : canonSkillKey(name)] = level;
  }
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
      loadedAmmoType: ammoType ?? '',
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
        // Munición "Basic ... Ammunition" del libro: se guarda como Basic Ammo del pack, con el tipo en el nombre.
        const basic = /^Basic .*Ammunition$/i.test(e.name) ? ammoDb.find((x) => x.id === 'basic-ammo') : undefined;
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
    } else if (p.category !== 'cyberware') {
      const cat = p.category === 'armor' || p.category === 'gear' || p.category === 'ammunition' || p.category === 'drugs' ? p.category : 'gear';
      addInventory(cat, p.catalogId, p.name, p.cost, p.qty, 'Compra de creación');
    }
  }
  for (const f of draft.fashion) addInventory('gear', '', `${f.style} - ${f.piece}`, f.unitCost, f.qty, 'Moda de creación');

  // Armadura: la de más SP entre el paquete y las compras (Light Armorjack SP 11 en los paquetes, Core p.98).
  const armorUnits = (kind: 'Head' | 'Body'): Array<{ name: string; sp: number; penalty: number }> => {
    const out: Array<{ name: string; sp: number; penalty: number }> = [];
    for (const e of rolePkg?.armor ?? []) {
      const sp = /\(SP(\d+)\)/.exec(e.name);
      if (new RegExp(`${kind} Armor`, 'i').test(e.name) && sp) {
        out.push({ name: e.name.replace(/\s*(Head|Body) Armor.*$/i, ''), sp: parseInt(sp[1], 10), penalty: lookupByName(armorDb, e.name.replace(/\s*(Head|Body) Armor.*$/i, ''))?.penalty ?? 0 });
      }
    }
    for (const p of draft.purchases) {
      const a = p.category === 'armor' ? armorDb.find((x) => x.id === p.catalogId) : undefined;
      const locationOk = !p.location || p.location === (kind === 'Head' ? 'head' : 'body');
      if (a && locationOk && !/shield/i.test(a.name)) out.push({ name: a.name, sp: a.sp ?? 0, penalty: a.penalty ?? 0 });
    }
    return out;
  };
  const best = (kind: 'Head' | 'Body'): CharacterSheet['headArmor'] => {
    const top = armorUnits(kind).sort((a, b) => b.sp - a.sp)[0];
    return top ? { name: `${top.name} (${kind})`, maxSp: top.sp, currentSp: top.sp, penalty: top.penalty } : emptyArmor();
  };
  const headArmor = best('Head');
  const bodyArmor = best('Body');

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

  const ability = getRoleAbilityInfo(role, draft.roleAbilityVariant, draft.era);
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
    roleAbilityVariant: draft.roleAbilityVariant,
    generalSkills,
    fashionBudgetRemaining: 0,
    hasNeuroport: draft.era === '2077' && draft.installNeuroport,
    lifepath: buildCharacterLifepath(draft)
  };
  return { sheet, warnings };
}
