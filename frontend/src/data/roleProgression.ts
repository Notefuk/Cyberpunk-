// Progresión de rol derivada de data/creation/roleRanks.ts (fuente única, plan 8 v4.9.0). [Claude Code · 2026-10-22]
import { ROLE_RANKS } from './creation';
import type { RoleRankRoleName, RoleRankSource } from './creation';
import type { RoleAbilityProgression } from './weaponAndCyberwareTooltips';
import type { RoleGuide } from './netAndRolesData';

const cite = (s: RoleRankSource) => `${s.book} p.${s.page}`;

export const ROLE_RANK_ROLE_ORDER = Object.keys(ROLE_RANKS.roles) as RoleRankRoleName[];

export function buildRoleAbilityProgression(): Record<string, RoleAbilityProgression> {
  const out: Record<string, RoleAbilityProgression> = {};
  for (const R of ROLE_RANK_ROLE_ORDER) {
    const D = ROLE_RANKS.roles[R];
    let mechanicsOverview = D.rulesEs;
    if (D.cemk) mechanicsOverview += ` · 2077 (CEMK): ${D.cemk.textEs}`;
    for (const t of D.tweak2077) {
      if (t.fromRank === null) mechanicsOverview += ` · 2077 (${cite(t.source)}): ${t.textEs}`;
    }
    out[R] = {
      role: R,
      abilityName: D.ability,
      summary: `Habilidad de rol del Core RED, rangos 1 a 10 (${cite(D.source)}).` + (D.tweak2077.length > 0 ? ' En 2077 se suman los ajustes de CEMK RB p.25.' : ''),
      statUsed: `${cite(D.source)}`,
      mechanicsOverview,
      ...(D.folio
        ? {
            folioNote: `Folio CEMK de ${D.folio.pregen} (${cite(D.folio.source)}). El Folio dice: "${D.folio.folioTextEs}" → Pasa a: ${D.folio.convertsToEs}`,
            folioId: `cemk-folio-${D.folio.pregen.toLowerCase()}`,
          }
        : {}),
      ranks: D.ranks.map(r => ({
        rank: r.rank,
        title: `Rango ${r.rank}`,
        unlocks: [r.unlocksEs.join(' '), ...D.tweak2077.filter(t => t.fromRank === r.rank).map(t => `[2077, ${cite(t.source)}] ${t.textEs}`)].join(' '),
      })),
    };
  }
  return out;
}

export function buildRoleGuides(): RoleGuide[] {
  return ROLE_RANK_ROLE_ORDER.map(R => {
    const D = ROLE_RANKS.roles[R];
    const blocks: { title: string; content: string[] }[] = [];
    blocks.push({
      title: `Progresión por rango (${cite(D.source)})`,
      content: D.ranks.map(r => `• Rango ${r.rank}: ${r.unlocksEs.join(' ')}`),
    });
    if (D.options.length > 0) {
      blocks.push({
        title: `Opciones (${cite(D.source)})`,
        content: D.options.map(o =>
          `• ${o.name}: ${o.effectEs}`
          + (o.dvEs ? ` Tirada: ${o.dvEs}` : '')
          + (o.minMotoRank ? ` Desde Moto ${o.minMotoRank}.` : '')
          + (o.appliesTo ? ` Aplica a: ${o.appliesTo}.` : '')
          + (o.costs.length ? ' ' + o.costs.map(c => `${c.points} pts: ${c.effectEs}`).join(' / ') : '')),
      });
    }
    if (D.cemk) {
      blocks.push({ title: 'Quickhacking 2077 (CEMK)', content: [D.cemk.textEs] });
    }
    blocks.push({
      title: 'Ajustes 2077 (CEMK RB pp. 25-26)',
      content: [
        ...D.tweak2077.map(t => t.fromRank === null
          ? `• Siempre: ${t.textEs} (${cite(t.source)})`
          : `• Desde Rango ${t.fromRank}: ${t.textEs} (${cite(t.source)})`),
        `• Todos los roles: ${ROLE_RANKS.general.expandedAvailability.textEs} (${cite(ROLE_RANKS.general.expandedAvailability.source)})`,
      ],
    });
    if (D.folio) {
      blocks.push({
        title: `Folio CEMK: ${D.folio.pregen} (${cite(D.folio.source)})`,
        content: [`El Folio dice: "${D.folio.folioTextEs}"`, `Pasa a (Core): ${D.folio.convertsToEs}`],
      });
    }
    return {
      id: R.toLowerCase(),
      name: R,
      abilityName: D.ability,
      description: `${D.rulesEs} (${cite(D.source)})`,
      rankProgressionSummary: `Rangos 1 a 10 del Core RED (${cite(D.source)}).` + (D.tweak2077.length ? ' En 2077 se aplican además los ajustes de CEMK RB p.25.' : ''),
      subBranchesOrTables: blocks,
    };
  });
}
