// Motor puro de los roles sociales: Rockerboy, Fixer, Media, Exec y Lawman (plan 11, v4.9.3).
// [Claude Code · 2026-10-23]
// Lee las tablas de ROLE_RANKS (generadas desde data/creation-src/role-ranks-social.json); no inventa números.
// Todas las tiradas reciben un `rng` inyectable para poder probarlas con dados fijos.
import { ROLE_RANKS } from '../data/creation';
import { calculateMaxHp, calculateSeriouslyWoundedThreshold } from './characterEngine';
import { rollCheckD10 } from './combatEngine';

type Rng = () => number;

interface RankBand { fromRank: number; toRank: number }

const rollDie = (sides: number, rng: Rng): number => Math.floor(rng() * sides) + 1;

/** Fila de una tabla por bandas cuyo rango cae dentro de [fromRank, toRank]; rango > 10 usa la última, rango < 1 devuelve null. */
function bandForRank<T extends RankBand>(table: T[], rank: number): T | null {
  if (rank < 1 || table.length === 0) return null;
  const hit = table.find(row => rank >= row.fromRank && rank <= row.toRank);
  return hit ?? table[table.length - 1];
}

// ============================================================================
// Rockerboy (Core pp. 144-145)
// ============================================================================

export type FanGroupSize = 'single' | 'small' | 'huge';

export interface RankedRoll {
  natural: number;
  total: number;
  dv: number;
  success: boolean;
  breakdown: string;
}

const FAN_DV_INDEX: Record<FanGroupSize, number> = { single: 0, small: 1, huge: 2 };

/** Core p.144: DV 8 (una persona), 10 (grupo de hasta 6), 12 (grupo enorme). */
export function fanDv(size: FanGroupSize): number {
  const table = ROLE_RANKS.roles.Rockerboy.tables.fanDv as { dv: number }[];
  return table[FAN_DV_INDEX[size]].dv;
}

/** Core p.144: convertir en fan = Charismatic Impact (Rango) + 1d10 contra el DV del tamaño; hay que superar el DV. */
export function rollConvertFans(rank: number, size: FanGroupSize, rng: Rng = Math.random): RankedRoll {
  const dv = fanDv(size);
  const d = rollCheckD10(rng);
  const total = rank + d.value;
  return {
    natural: d.natural,
    total,
    dv,
    success: total > dv,
    breakdown: `Rango ${rank} + d10 ${d.value}${d.extra ? ` (${d.natural}${d.natural === 10 ? '+' : '-'}${d.extra})` : ''} = ${total} vs DV${dv}`
  };
}

export type FavorStatus = 'auto-fail-rank' | 'blocked-week' | 'rolled';

export interface FavorResult {
  status: FavorStatus;
  success: boolean;
  total?: number;
  dv: number;
  breakdown: string;
  blockUntilDay?: number;
}

/** Core p.145: favor fuera del Rango = falla automática; si falla la tirada, no se puede pedir el mismo favor 1 semana (7 días). */
export function rollFavor(opts: {
  rank: number;
  size: FanGroupSize;
  requiredRank: number;
  blockedUntilDay?: number;
  currentDay: number;
  rng?: Rng;
}): FavorResult {
  const dv = fanDv(opts.size);
  if (opts.requiredRank > opts.rank) {
    return {
      status: 'auto-fail-rank',
      success: false,
      dv,
      breakdown: `El favor pide Rango ${opts.requiredRank} y tenés Rango ${opts.rank}: falla automática, sin tirada.`
    };
  }
  if (opts.blockedUntilDay !== undefined && opts.blockedUntilDay >= opts.currentDay) {
    return {
      status: 'blocked-week',
      success: false,
      dv,
      breakdown: `Bloqueado hasta el día ${opts.blockedUntilDay}: no se puede pedir el mismo favor a esos fans durante una semana.`,
      blockUntilDay: opts.blockedUntilDay
    };
  }
  const roll = rollConvertFans(opts.rank, opts.size, opts.rng ?? Math.random);
  const result: FavorResult = {
    status: 'rolled',
    success: roll.success,
    total: roll.total,
    dv,
    breakdown: roll.breakdown
  };
  if (!roll.success) result.blockUntilDay = opts.currentDay + 7;
  return result;
}

export interface FavorExampleRow {
  fromRank: number;
  toRank: number;
  venue: string;
  singleFan: string;
  smallGroup: string;
  hugeGroup: string;
  applies: boolean;
}

/** Core p.145: filas de la tabla de favores y lugares para el Rango actual y los superiores; `applies` marca la del Rango actual. */
export function favorExamplesForRank(rank: number): FavorExampleRow[] {
  const table = ROLE_RANKS.roles.Rockerboy.tables.rankTable as Omit<FavorExampleRow, 'applies'>[];
  return table
    .filter(row => row.toRank >= rank)
    .map(row => ({ ...row, applies: rank >= row.fromRank && rank <= row.toRank }));
}

// ============================================================================
// Fixer (Core pp. 159-161)
// ============================================================================

export interface HaggleResult {
  fixerTotal: number;
  counterpartTotal: number;
  fixerWins: boolean;
  breakdownFixer: string;
  breakdownCounterpart: string;
}

/**
 * Core p.159: Haggle opuesto, COOL + Trading + Operator + 1d10 contra COOL + Trading (+ Operator solo si la otra parte es Fixer) + 1d10.
 * Core p.129: "In case of a tie, the Defender always wins": el empate lo gana la contraparte.
 */
export function rollHaggle(opts: {
  fixer: { cool: number; trading: number; operatorRank: number };
  counterpart: { cool: number; trading: number; operatorRank?: number; isFixer?: boolean };
  rng?: Rng;
}): HaggleResult {
  const rng = opts.rng ?? Math.random;
  const fd = rollCheckD10(rng);
  const cd = rollCheckD10(rng);
  const { fixer, counterpart } = opts;
  const counterpartOperator = counterpart.isFixer ? counterpart.operatorRank ?? 0 : 0;
  const fixerTotal = fixer.cool + fixer.trading + fixer.operatorRank + fd.value;
  const counterpartTotal = counterpart.cool + counterpart.trading + counterpartOperator + cd.value;
  return {
    fixerTotal,
    counterpartTotal,
    fixerWins: fixerTotal > counterpartTotal,
    breakdownFixer: `COOL ${fixer.cool} + Trading ${fixer.trading} + Operator ${fixer.operatorRank} + d10 ${fd.value} = ${fixerTotal}`,
    breakdownCounterpart: `COOL ${counterpart.cool} + Trading ${counterpart.trading}${counterpart.isFixer ? ` + Operator ${counterpartOperator}` : ''} + d10 ${cd.value} = ${counterpartTotal}`
  };
}

export interface HaggleDeal extends RankBand { textEs: string }

/** Core p.160: tratos de Haggle de tu Rango o inferior (solo se hace 1 por transacción). */
export function haggleDealsAvailable(rank: number): HaggleDeal[] {
  const table = ROLE_RANKS.roles.Fixer.tables.haggle as { byRank: HaggleDeal[] };
  return table.byRank.filter(row => row.fromRank <= rank);
}

/** Core p.160: Grease del Rango (null si el Rango es menor que 1). */
export function greaseForRank(rank: number): HaggleDeal | null {
  return bandForRank(ROLE_RANKS.roles.Fixer.tables.grease as HaggleDeal[], rank);
}

// ============================================================================
// Media (Core pp. 151-153)
// ============================================================================

export interface RumorRow {
  rumor: string;
  descEs: string;
  passiveDv: number;
  activeDv: number;
}

export interface PassiveRumorResult {
  total: number;
  breakdown: string;
  bestRumor: RumorRow | null;
}

const rumorTable = (): RumorRow[] => ROLE_RANKS.roles.Media.tables.rumorDv as RumorRow[];

/** Core p.151: Credibility (Rango) + 1d10; se informa el rumor de mayor DV pasivo superado (hay que superar, no igualar). */
export function rollPassiveRumor(credibilityRank: number, rng: Rng = Math.random): PassiveRumorResult {
  const d = rollCheckD10(rng);
  const total = credibilityRank + d.value;
  let bestRumor: RumorRow | null = null;
  for (const row of rumorTable()) {
    if (total > row.passiveDv && (!bestRumor || row.passiveDv > bestRumor.passiveDv)) bestRumor = row;
  }
  return {
    total,
    breakdown: `Credibility ${credibilityRank} + d10 ${d.value} = ${total}`,
    bestRumor
  };
}

export interface ActiveRumorResult {
  total: number;
  dv: number;
  success: boolean;
  breakdown: string;
}

/** Core p.151: rumor activo = STAT + Skill + 1d10 contra el DV activo de la fila `tier` (0 = Vague ... 3 = Detailed). */
export function rollActiveRumor(opts: { stat: number; skill: number; tier: number; rng?: Rng }): ActiveRumorResult {
  const table = rumorTable();
  const row = table[Math.max(0, Math.min(table.length - 1, opts.tier))];
  const d = rollCheckD10(opts.rng ?? Math.random);
  const total = opts.stat + opts.skill + d.value;
  return {
    total,
    dv: row.activeDv,
    success: total > row.activeDv,
    breakdown: `STAT ${opts.stat} + Skill ${opts.skill} + d10 ${d.value} = ${total} vs DV${row.activeDv} (${row.rumor})`
  };
}

/** Core p.152: probabilidad "X de 10" de Believability para el Rango (0 si el Rango es menor que 1). */
export function believabilityChance(rank: number): number {
  const row = bandForRank(ROLE_RANKS.roles.Media.tables.believability as (RankBand & { chanceOutOf10: number })[], rank);
  return row ? row.chanceOutOf10 : 0;
}

/** Core p.153: +1 con al menos 1 pieza de evidencia verificable, +2 con más de 4 piezas de evidencia dura; se acumulan (máx. +3). */
export function evidenceBonus(opts: { oneVerifiable: boolean; moreThanFourHard: boolean }): number {
  const table = ROLE_RANKS.roles.Media.tables.believabilityBonuses as { bonus: number }[];
  const bonus = (opts.oneVerifiable ? table[0].bonus : 0) + (opts.moreThanFourHard ? table[1].bonus : 0);
  return Math.min(3, bonus);
}

export interface BelievabilityResult {
  natural: number;
  target: number;
  believed: boolean;
}

/**
 * Core pp.152-153 (decisión 29 de discrepancias): 1d10 <= Believability + bonos.
 * Este d10 NO explota ni resta: no es un Skill Check sino una probabilidad "X de 10", y LUCK no se puede gastar.
 */
export function rollBelievability(opts: { rank: number; bonus: number; rng?: Rng }): BelievabilityResult {
  const natural = rollDie(10, opts.rng ?? Math.random);
  const target = believabilityChance(opts.rank) + opts.bonus;
  return { natural, target, believed: natural <= target };
}

// ============================================================================
// Exec (Core pp. 153-157)
// ============================================================================

export interface ExecTeamMember {
  id: string;
  position: string;
  d6Row: number;
  stats: Record<string, number>;
  hpMax: number;
  hpCurrent: number;
  seriouslyWounded: number;
  deathSave: number;
  loyalty: number;
  status: 'active' | 'resigned' | 'pending-replacement' | 'lost';
  packageNote: string;
  createdAt: string;
}

/** Core p.154: 1 Team Member desde el Rango 3, 2 desde el 5 y 3 desde el 9 (0 antes del Rango 3). */
export function teamMemberSlots(rank: number): number {
  const table = ROLE_RANKS.roles.Exec.tables.teamMemberCountByRank as (RankBand & { members: number })[];
  if (rank < table[0].fromRank) return 0;
  const row = bandForRank(table, rank);
  return row ? row.members : 0;
}

export interface ExecBenefit { rank: number; textEs: string }

/** Core pp.153-154: beneficios del Rango 1 hasta el Rango indicado (el Rango 4 trae una fila sin beneficio nuevo). */
export function execBenefitsUpTo(rank: number): ExecBenefit[] {
  return (ROLE_RANKS.roles.Exec.tables.benefitsByRank as ExecBenefit[]).filter(row => row.rank <= rank);
}

interface TeamMemberTable {
  roll1d6: ({ roll: number } & Record<string, number>)[];
  coverJobs: string[];
  trueJobEs: string;
  skills: Record<string, string[] | string>;
  cyberware: string[];
  gear: string[];
}

function teamMemberTable(position: string): { key: string; table: TeamMemberTable } {
  const tables = ROLE_RANKS.roles.Exec.tables.teamMemberTables as Record<string, TeamMemberTable>;
  const key = tables[position] ? position : `Company ${position}`;
  const table = tables[key];
  if (!table) throw new Error(`Puesto de Team Member desconocido: ${position}`);
  return { key, table };
}

function packageNoteOf(table: TeamMemberTable): string {
  const parts: string[] = [];
  for (const level of ['+2', '+4', '+6']) {
    const list = table.skills[level];
    if (Array.isArray(list)) parts.push(`Skills ${level}: ${list.join(', ')}`);
  }
  parts.push(`Cyberware: ${table.cyberware.join(', ')}`);
  parts.push(`Gear: ${table.gear.join(', ')}`);
  return parts.join(' | ');
}

function buildTeamMember(position: string, loyaltyOverride: number | null, rng: Rng): ExecTeamMember {
  const { key, table } = teamMemberTable(position);
  const columns = ROLE_RANKS.roles.Exec.tables.teamMemberStatColumns as string[];
  const d6Row = rollDie(6, rng);
  const row = table.roll1d6.find(r => r.roll === d6Row) ?? table.roll1d6[0];
  const stats: Record<string, number> = {};
  for (const col of columns) stats[col] = row[col];
  const loyalty = loyaltyOverride ?? rollDie(6, rng) + 1;
  // HP, Seriously Wounded y Death Save como un PJ (characterEngine): HP por BODY y WILL; Death Save = BODY.
  const hpMax = calculateMaxHp(stats.BODY, stats.WILL);
  const suffix = Math.floor(rng() * 1679616).toString(36);
  return {
    id: `tm-${Date.now().toString(36)}-${suffix}`,
    position,
    d6Row,
    stats,
    hpMax,
    hpCurrent: hpMax,
    seriouslyWounded: calculateSeriouslyWoundedThreshold(hpMax),
    deathSave: stats.BODY,
    loyalty,
    status: 'active',
    packageNote: `${key}: ${packageNoteOf(table)}`,
    createdAt: new Date().toISOString()
  };
}

/** Core pp.154-157: elige el puesto, tira 1d6 en su tabla de STATs y Loyalty inicial = 1d6 + 1. */
export function generateTeamMember(position: string, rng: Rng = Math.random): ExecTeamMember {
  return buildTeamMember(position, null, rng);
}

export interface LoyaltyOption { actionEs: string; value: number }

/** Core p.154: acciones que suben la Loyalty. */
export function loyaltyGainOptions(): LoyaltyOption[] {
  return (ROLE_RANKS.roles.Exec.tables.loyalty as { gain: LoyaltyOption[] }).gain;
}

/** Core p.154: acciones que bajan la Loyalty (valores negativos). */
export function loyaltyLossOptions(): LoyaltyOption[] {
  return (ROLE_RANKS.roles.Exec.tables.loyalty as { loss: LoyaltyOption[] }).loss;
}

/**
 * Core p.154 (decisión 30 de discrepancias): Loyalty Save = 1d6 por debajo de la Loyalty; el empate falla.
 * Es un d6 simple, no un Skill Check: no explota.
 */
export function rollLoyaltySave(loyalty: number, rng: Rng = Math.random): { natural: number; success: boolean } {
  const natural = rollDie(6, rng);
  return { natural, success: natural < loyalty };
}

/**
 * Core pp.154-156: entre sesiones la Loyalty tiene tope 10; con menos de 0 al terminar la sesión el miembro renuncia (RRHH).
 * Solo se evalúan los miembros activos.
 */
export function endOfSession(team: ExecTeamMember[]): { team: ExecTeamMember[]; resigned: string[] } {
  const numeric = (ROLE_RANKS.roles.Exec.tables.loyalty as { numeric: { capMax: number } }).numeric;
  const resigned: string[] = [];
  const next = team.map(member => {
    if (member.status !== 'active') return member;
    if (member.loyalty < 0) {
      resigned.push(member.id);
      return { ...member, status: 'resigned' as const };
    }
    if (member.loyalty > numeric.capMax) return { ...member, loyalty: numeric.capMax };
    return member;
  });
  return { team: next, resigned };
}

/** Core p.154: honorarios de contratación extra por el reemplazo (JSON: Exec.tables.loyalty.numeric.replacementFeeEb). */
export const REPLACEMENT_FEE_EB: number = (ROLE_RANKS.roles.Exec.tables.loyalty as { numeric: { replacementFeeEb: number } }).numeric.replacementFeeEb;

/** Core p.154: el reemplazo es del mismo puesto, con STATs nuevas y Loyalty inicial 1. */
export function replacementMember(old: ExecTeamMember, rng: Rng = Math.random): ExecTeamMember {
  const numeric = (ROLE_RANKS.roles.Exec.tables.loyalty as { numeric: { replacementLoyalty: number } }).numeric;
  return buildTeamMember(old.position, numeric.replacementLoyalty, rng);
}

// ============================================================================
// Lawman (Core pp. 158-159)
// ============================================================================

export interface BackupGroup extends RankBand {
  name: string;
  members: number;
  combatNumber: number;
  sp: number;
  hp: number;
  move: number;
  body: number;
  weapons: string;
  armor: string;
  vehicle: string;
  descEs: string;
}

const backupTable = (): BackupGroup[] => ROLE_RANKS.roles.Lawman.tables.backupGroups as BackupGroup[];

/** Core p.158: se puede llamar a un grupo de tu Rango o inferior (se usa el mínimo de cada banda). */
export function backupGroupsAvailable(rank: number): BackupGroup[] {
  return backupTable().filter(group => group.fromRank <= rank);
}

/**
 * Core p.158: la llamada es una Acción, 1d10 igual o menor que el Rango de Backup.
 * Este d10 NO explota ni resta: no es un Skill Check sino una probabilidad "X de 10".
 */
export function rollBackupCall(rank: number, rng: Rng = Math.random): { natural: number; success: boolean } {
  const natural = rollDie(10, rng);
  return { natural, success: natural <= rank };
}

export interface BackupArrival {
  rounds: number;
  groupIndex: number;
  upgraded: boolean;
  /** Grupos que llegan (índices de backupGroups). Normalmente uno; en Rango 10 con un 6, dos. */
  groupIndices: number[];
}

/**
 * Core p.158: 1d6 = Rondas hasta que llega; con un 6 llega el grupo del siguiente nivel (si existe), aunque supere el Rango.
 * "unless you are Rank 10, in which case two separate backup groups will arrive": decisión de Giuliano (2026-10-23):
 * en Rango 10 con un 6 llegan dos grupos independientes de Rango 10.
 */
export function rollBackupArrival(calledGroupIndex: number, rng: Rng = Math.random, lawmanRank = 0): BackupArrival {
  const rounds = rollDie(6, rng);
  const lastIndex = backupTable().length - 1;
  if (rounds === 6 && lawmanRank >= 10) {
    return { rounds, groupIndex: lastIndex, upgraded: true, groupIndices: [lastIndex, lastIndex] };
  }
  const hasNext = calledGroupIndex + 1 < backupTable().length;
  const upgraded = rounds === 6 && hasNext;
  const groupIndex = upgraded ? calledGroupIndex + 1 : calledGroupIndex;
  return { rounds, groupIndex, upgraded, groupIndices: [groupIndex] };
}

/** Core p.158: un agente por miembro del grupo, cada uno con el HP de la tabla. */
export function backupAgents(group: BackupGroup): { hpMax: number; hpCurrent: number }[] {
  return Array.from({ length: group.members }, () => ({ hpMax: group.hp, hpCurrent: group.hp }));
}

/** Core p.159: el Combat Number es Skill Base ofensiva y defensiva: CN + 1d10 (el Backup no esquiva balas). */
export function rollCombatNumber(cn: number, rng: Rng = Math.random): { natural: number; total: number; breakdown: string } {
  const d = rollCheckD10(rng);
  const total = cn + d.value;
  return { natural: d.natural, total, breakdown: `CN ${cn} + d10 ${d.value} = ${total}` };
}
