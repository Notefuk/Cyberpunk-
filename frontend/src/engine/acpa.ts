/**
 * [Claude Code · 2026-11-12] v5.26.0 (plan 30): motor de ACPA, funciones puras.
 * Fuente: "Solo of Fortune 2045", Interface RED Vol. 5, pp.133-137 (páginas impresas).
 */
import {
  ACPA_BASE_COST,
  ACPA_FRAMES,
  ACPA_MAX_ONBOARD_CYBERWARE,
  ACPA_MAX_ONBOARD_WEAPONS,
  ACPA_ONBOARD_SURCHARGE,
  ACPA_SHELLS,
  ACPA_TUNINGS,
  type AcpaFrameId,
  type AcpaPrebuilt,
  type AcpaShellId,
  type AcpaTunings,
} from '../data/acpaData';

export interface AcpaOnboardItem {
  name: string;
  cost: number;
}

export interface AcpaBuildInput {
  frame: AcpaFrameId;
  shell: AcpaShellId;
  tunings: AcpaTunings;
  onboardWeapons?: AcpaOnboardItem[];
  onboardCyberware?: AcpaOnboardItem[];
}

export interface AcpaStats {
  hp: number;
  sp: number;
  body: number;
  ref: number;
  dex: number;
  move: number;
  cost: number;
  costTier: string;
  /** Topes superados (más de 6 armas o 6 ciberware Onboard). Vacío si es válida. */
  errors: string[];
}

/** Categorías de precio del Core, de más barata a más cara, con su precio de referencia. */
const COST_TIERS = ['Cheap', 'Everyday', 'Costly', 'Premium', 'Expensive', 'Very Expensive', 'Luxury', 'Super Luxury'];
const COST_TIER_PRICES = [10, 20, 50, 100, 500, 1000, 5000, 10000];

function tierOfPrice(cost: number): string {
  const i = COST_TIER_PRICES.findIndex((p) => cost <= p);
  return COST_TIERS[i === -1 ? COST_TIERS.length - 1 : i];
}

function harderTier(a: string, b: string): string {
  return COST_TIERS.indexOf(b) > COST_TIERS.indexOf(a) ? b : a;
}

/**
 * Arma una ACPA (IR5 pp.135-136): HP y MOVE del frame más el shell, SP del shell, BODY del frame,
 * y los cuatro tunings. Costo: 4.000eb + frame + shell + cada Onboard + 500eb por Onboard.
 * La disponibilidad es la de la pieza más difícil de conseguir (p.135).
 */
export function buildAcpa(input: AcpaBuildInput): AcpaStats {
  const frame = ACPA_FRAMES.find((f) => f.id === input.frame);
  const shell = ACPA_SHELLS.find((s) => s.id === input.shell);
  if (!frame || !shell) throw new Error(`ACPA: frame o shell desconocido (${input.frame}, ${input.shell})`);
  const weapons = input.onboardWeapons ?? [];
  const cyber = input.onboardCyberware ?? [];

  let hp = frame.hp + shell.hp;
  let sp = shell.sp;
  let ref = 0;
  let dex = 0;
  let move = frame.move + shell.move;
  for (const tuning of ACPA_TUNINGS) {
    const m = tuning[input.tunings[tuning.id]];
    hp += m.hp ?? 0;
    sp += m.sp ?? 0;
    ref += m.ref ?? 0;
    dex += m.dex ?? 0;
    move += m.move ?? 0;
  }

  const onboard = [...weapons, ...cyber];
  const cost = ACPA_BASE_COST + frame.cost + shell.cost + onboard.reduce((s, i) => s + i.cost + ACPA_ONBOARD_SURCHARGE, 0);
  const costTier = onboard.reduce((tier, i) => harderTier(tier, tierOfPrice(i.cost)), harderTier(frame.costTier, shell.costTier));

  const errors: string[] = [];
  if (weapons.length > ACPA_MAX_ONBOARD_WEAPONS) errors.push(`Máximo ${ACPA_MAX_ONBOARD_WEAPONS} armas Onboard (IR5 p.135).`);
  if (cyber.length > ACPA_MAX_ONBOARD_CYBERWARE) errors.push(`Máximo ${ACPA_MAX_ONBOARD_CYBERWARE} piezas de ciberware Onboard (IR5 p.135).`);

  return { hp, sp, body: frame.body, ref, dex, move, cost, costTier, errors };
}

/** Stats de una ACPA de fábrica recalculados con las reglas de armado (ver erratas en acpaData). */
export function prebuiltAcpaStats(p: AcpaPrebuilt): AcpaStats {
  return buildAcpa({ frame: p.frame, shell: p.shell, tunings: p.tunings });
}

/** Estado de una ACPA en uso: un solo SP y un solo HP (IR5 p.133). */
export interface AcpaDamageState {
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
}

export interface AcpaDamageResult {
  state: AcpaDamageState;
  /** HP que perdió la ACPA. */
  hpLost: number;
  /** true si el ataque atravesó el SP y lo ablacionó en 1. */
  ablated: boolean;
  destroyed: boolean;
}

/**
 * Daño a una ACPA (IR5 pp.133-134): el daño que supera el SP baja el HP y ablaciona el SP en 1.
 * No hay Wound Threshold ni Aimed Shot; a 0 HP queda Destruida y deja de proteger.
 * `halveSp`: para ataques que ignoran la mitad del SP. Las Martial Arts y los Special Moves
 * NO la ignoran contra una ACPA (p.133), así que quien llama no debe pasarlo en ese caso.
 * Una ACPA destruida no absorbe nada: devuelve el estado sin cambios.
 */
export function acpaTakeDamage(state: AcpaDamageState, damage: number, opts: { halveSp?: boolean } = {}): AcpaDamageResult {
  if (state.hp <= 0) return { state, hpLost: 0, ablated: false, destroyed: true };
  const effectiveSp = opts.halveSp ? Math.ceil(state.sp / 2) : state.sp;
  const through = Math.max(0, damage - effectiveSp);
  if (through === 0) return { state, hpLost: 0, ablated: false, destroyed: false };
  const hp = Math.max(0, state.hp - through);
  const sp = Math.max(0, state.sp - 1);
  return { state: { ...state, hp, sp }, hpLost: state.hp - hp, ablated: true, destroyed: hp === 0 };
}

/** Una Herida Crítica a la ACPA no se aplica: el piloto recibe 5 de daño directo, 0 si es FBC (IR5 p.133). */
export function acpaCriticalFeedback(pilotIsFbc: boolean): number {
  return pilotIsFbc ? 0 : 5;
}

export interface AcpaRepair {
  label: 'Minor Damage' | 'Major Damage' | 'Destroyed';
  dv: number;
  time: string;
}

/** Reparación con Weaponstech, sin Jury Rig (IR5 p.135). null si está intacta. */
export function acpaRepair(state: AcpaDamageState): AcpaRepair | null {
  if (state.hp <= 0) return { label: 'Destroyed', dv: 17, time: '1 semana' };
  if (state.hp < state.maxHp / 2) return { label: 'Major Damage', dv: 13, time: '1 día' };
  if (state.hp < state.maxHp || state.sp < state.maxSp) return { label: 'Minor Damage', dv: 9, time: '4 horas' };
  return null;
}

/**
 * Penalización por horas de piloteo en el día (IR5 p.134): más de 4 h, -1 a todas las tiradas,
 * salvo FBC o Rank 4+ en Moto o Interface; más de 8 h, -2 para todos.
 */
export function acpaFatiguePenalty(hours: number, pilot: { isFbc?: boolean; motoOrInterfaceRank?: number } = {}): number {
  if (hours > 8) return -2;
  if (hours > 4) return pilot.isFbc || (pilot.motoOrInterfaceRank ?? 0) >= 4 ? 0 : -1;
  return 0;
}

export interface PilotStats {
  REF: number;
  DEX: number;
  MOVE: number;
  BODY: number;
}

/**
 * Stats del piloto dentro de la ACPA (IR5 p.134): REF, DEX y MOVE del piloto con los mods de la ACPA;
 * el BODY es el del Linear Frame, salvo que el piloto ya tenga uno más alto. No cambia su HP ni su Death Save.
 */
export function pilotStatsInAcpa(pilot: PilotStats, acpa: Pick<AcpaStats, 'ref' | 'dex' | 'move' | 'body'>): PilotStats {
  return {
    REF: Math.max(0, pilot.REF + acpa.ref),
    DEX: Math.max(0, pilot.DEX + acpa.dex),
    MOVE: Math.max(0, pilot.MOVE + acpa.move),
    BODY: Math.max(pilot.BODY, acpa.body),
  };
}

/**
 * ¿Puede esquivar balas dentro de la ACPA? (IR5 p.134). Basta una de estas:
 * MOVE +3 o más en la ACPA; REF 8+ con Reflex Co-Processor y sin penalización de REF;
 * DEX 8+ y sin penalización de REF, DEX ni MOVE; Combat Awareness Rank 6+.
 * `pilotRef` y `pilotDex` son los valores ya con bonos y penalizaciones.
 */
export function acpaAllowsBulletDodge(
  acpa: Pick<AcpaStats, 'ref' | 'dex' | 'move'>,
  pilot: { pilotRef: number; pilotDex: number; hasReflexCoProcessor?: boolean; combatAwarenessRank?: number },
): boolean {
  if (acpa.move >= 3) return true;
  if (pilot.pilotRef >= 8 && pilot.hasReflexCoProcessor && acpa.ref >= 0) return true;
  if (pilot.pilotDex >= 8 && acpa.ref >= 0 && acpa.dex >= 0 && acpa.move >= 0) return true;
  return (pilot.combatAwarenessRank ?? 0) >= 6;
}
