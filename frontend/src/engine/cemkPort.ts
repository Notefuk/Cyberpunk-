// Porte de PNJ RED a reglas CEMK (plan 6). CEMK no trae guía de conversión: cada regla cita su página del Rule Book (RB).
import type { EnemySheet, EnemyWeaponProfile } from '../data/enemiesCatalog';
import { NET_ACTIONS_PER_TURN, QUICKHACKS_2077_CATALOG } from '../data/netAndRolesData';

// RB p.25: rango de Interface -> DV máximo de Quickhack (1 Simple 6, 2 Standard 8, 3 Difficult 10, 4+ Advanced 12).
export const INTERFACE_RANK_MAX_QUICKHACK_DV: Array<{ minRank: number; maxDv: number }> = [
  { minRank: 1, maxDv: 6 },
  { minRank: 2, maxDv: 8 },
  { minRank: 3, maxDv: 10 },
  { minRank: 4, maxDv: 12 }
];

// RB p.16-17: hasta 3 Net Actions por turno.
export const CEMK_NET_ACTIONS_PER_TURN = NET_ACTIONS_PER_TURN;

// RB p.16: el Cyberdeck Port del Neuroport alcanza Neuroports a 50 m.
export const CYBERDECK_PORT_RANGE_M = 50;

// RB p.36: Self-ICE = Passwalls DV 6, 8, 10 (máximo 3).
const SELF_ICE_PASSWALL_DVS = [6, 8, 10];

export interface CemkEnemyPort {
  hasNeuroport: true;
  hackable: true;
  isNetrunner: boolean;
  interfaceRank: number | null;
  netActionsPerTurn: number | null;
  cyberdeckPortRangeM: number | null;
  maxQuickhackDv: number | null;
  availableQuickhacks: string[];
  selfIcePasswalls: Array<{ dv: number }>;
  headSp: number;
  bodySp: number;
  headSpVsMelee: number;
  bodySpVsMelee: number;
  weapons: Array<EnemyWeaponProfile & { weaponType2077: 'Power' | 'Smart' | 'Tech' | 'Melee' }>;
  hp: number;
  hpFormula: number;
  hpMatchesFormula: boolean;
  deathSave: number;
  notes: string[];
}

function maxDvForRank(rank: number | null): number | null {
  if (rank === null || rank < 1) return null;
  let dv: number | null = null;
  for (const row of INTERFACE_RANK_MAX_QUICKHACK_DV) {
    if (rank >= row.minRank) dv = row.maxDv;
  }
  return dv;
}

export function portEnemyToCemk(enemy: EnemySheet): CemkEnemyPort {
  const notes: string[] = [];
  notes.push('Neuroport presente: el PNJ es hackeable (RB pp.15, 35-36)');

  const isNetrunner = enemy.isNetrunner ?? (enemy.role === 'Netrunner');
  const interfaceRank = enemy.interfaceRank ?? (isNetrunner ? enemy.roleAbility?.rank ?? null : null);

  let netActionsPerTurn: number | null = null;
  let cyberdeckPortRangeM: number | null = null;
  let maxQuickhackDv: number | null = null;
  let availableQuickhacks: string[] = [];
  if (isNetrunner) {
    netActionsPerTurn = CEMK_NET_ACTIONS_PER_TURN;
    cyberdeckPortRangeM = CYBERDECK_PORT_RANGE_M;
    maxQuickhackDv = maxDvForRank(interfaceRank);
    const cap = maxQuickhackDv;
    availableQuickhacks = cap === null ? [] : QUICKHACKS_2077_CATALOG.filter(q => q.dv <= cap).map(q => q.name);
    // Ficha CEMK nativa: gana lo que imprime la ficha (p. ej. Enemy Netrunner con 2 NET Actions, Jacket p.36).
    if (enemy.format === 'cemk') {
      if (enemy.netActionsPerTurn !== undefined) netActionsPerTurn = enemy.netActionsPerTurn;
      if (enemy.quickhacks && enemy.quickhacks.length > 0) availableQuickhacks = enemy.quickhacks;
    } else {
      notes.push('Cyberdeck → Cyberdeck Port en el Neuroport (RB p.16)');
    }
    notes.push('Quickhacks limitados por rango de Interface (RB p.25)');
    if (enemy.cyberdeckPrograms && enemy.cyberdeckPrograms.length > 0) {
      notes.push('Programas RED no se portean');
    }
  }

  const passwallCount = Math.min(3, Math.max(0, enemy.selfIce ?? 0));
  const selfIcePasswalls = SELF_ICE_PASSWALL_DVS.slice(0, passwallCount).map(dv => ({ dv }));
  if (passwallCount > 0) notes.push('Self-ICE como Passwalls DV 6/8/10 (RB p.36)');

  // Misma regla que combatEngine (L294): melee/artes marciales = Math.ceil(SP / 2). RB p.10.
  const headSpVsMelee = enemy.headSpVsMelee ?? Math.ceil(enemy.headSp / 2);
  const bodySpVsMelee = enemy.bodySpVsMelee ?? Math.ceil(enemy.bodySp / 2);
  notes.push('SP contra melee/artes marciales a la mitad, redondeo hacia arriba (RB p.10)');

  const isCemkType = (t: unknown): t is 'Power' | 'Smart' | 'Tech' => t === 'Power' || t === 'Smart' || t === 'Tech';
  // Las fichas CEMK imprimen "Melee Weapon" como tipo aparte; RED: Melee Weapon/Brawling/Martial Arts cuentan como melee.
  const isMelee = (w: EnemyWeaponProfile) =>
    w.weaponType2077 === 'Melee' || /melee|brawling|martial/i.test(w.skill ?? '');
  const weapons = enemy.weapons.map(w => ({
    ...w,
    weaponType2077: isCemkType(w.weaponType2077)
      ? w.weaponType2077
      : isMelee(w)
        ? 'Melee'
        : (/smart/i.test(`${w.name} ${w.notes ?? ''}`) ? 'Smart' : 'Power') as 'Power' | 'Smart' | 'Tech' | 'Melee'
  }));
  notes.push('Armas clasificadas Power/Smart/Tech (RB p.8)');

  const hpFormula = 10 + 5 * Math.ceil((enemy.stats.BODY + enemy.stats.WILL) / 2);
  const hp = enemy.hp;
  const hpMatchesFormula = hp === hpFormula;
  if (!hpMatchesFormula) notes.push(`HP del libro (${hp}) ≠ fórmula CEMK (${hpFormula})`);

  return {
    hasNeuroport: true,
    hackable: true,
    isNetrunner,
    interfaceRank,
    netActionsPerTurn,
    cyberdeckPortRangeM,
    maxQuickhackDv,
    availableQuickhacks,
    selfIcePasswalls,
    headSp: enemy.headSp,
    bodySp: enemy.bodySp,
    headSpVsMelee,
    bodySpVsMelee,
    weapons,
    hp,
    hpFormula,
    hpMatchesFormula,
    deathSave: enemy.deathSave,
    notes
  };
}
