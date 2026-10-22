// Tests del motor de roles sociales (plan 11, v4.9.3). Cada caso cita la página del libro que fija la regla.
// [Claude Code · 2026-10-23]
import { describe, expect, it } from 'vitest';
import {
  REPLACEMENT_FEE_EB,
  backupAgents,
  backupGroupsAvailable,
  believabilityChance,
  endOfSession,
  evidenceBonus,
  fanDv,
  favorExamplesForRank,
  generateTeamMember,
  haggleDealsAvailable,
  replacementMember,
  rollActiveRumor,
  rollBackupArrival,
  rollBackupCall,
  rollBelievability,
  rollCombatNumber,
  rollFavor,
  rollHaggle,
  rollLoyaltySave,
  rollPassiveRumor,
  teamMemberSlots,
  type ExecTeamMember
} from '../socialRoleRules';

/** rng que devuelve, en orden, el valor que hace salir esa cara en un dado de `sides` caras. */
const dice = (sides: number, ...faces: number[]) => {
  let i = 0;
  return () => (faces[i++ % faces.length] - 1) / sides + 0.01;
};
/** rng mixto: cada elemento es [caras, valor]. */
const mixed = (...rolls: [number, number][]) => {
  let i = 0;
  return () => {
    const [sides, face] = rolls[i++ % rolls.length];
    return (face - 1) / sides + 0.01;
  };
};
const mustNotRoll = () => {
  throw new Error('no debía tirar dados');
};

const member = (over: Partial<ExecTeamMember> = {}): ExecTeamMember => ({
  id: 'tm-1',
  position: 'Bodyguard',
  d6Row: 1,
  stats: {},
  hpMax: 40,
  hpCurrent: 40,
  seriouslyWounded: 20,
  deathSave: 6,
  loyalty: 5,
  status: 'active',
  packageNote: '',
  createdAt: '2026-10-23T00:00:00.000Z',
  ...over
});

describe('Rockerboy', () => {
  it('Core p.144: DV 8 una persona, 10 grupo pequeño, 12 grupo enorme', () => {
    expect([fanDv('single'), fanDv('small'), fanDv('huge')]).toEqual([8, 10, 12]);
  });

  it('Core p.145: un favor que pide más Rango del que tenés falla automático sin tirar', () => {
    const r = rollFavor({ rank: 3, size: 'small', requiredRank: 5, currentDay: 1, rng: mustNotRoll });
    expect(r.status).toBe('auto-fail-rank');
    expect(r.success).toBe(false);
    expect(r.blockUntilDay).toBeUndefined();
  });

  it('Core p.145: tras un favor fallido hay bloqueo de 1 semana (blockUntilDay = día + 7)', () => {
    const r = rollFavor({ rank: 4, size: 'small', requiredRank: 4, currentDay: 10, rng: dice(10, 2) });
    expect(r.status).toBe('rolled');
    expect(r.total).toBe(6);
    expect(r.success).toBe(false);
    expect(r.blockUntilDay).toBe(17);
  });

  it('Core p.145: mientras dura el bloqueo no se tira (blockedUntilDay >= día actual)', () => {
    const r = rollFavor({ rank: 4, size: 'small', requiredRank: 4, blockedUntilDay: 17, currentDay: 17, rng: mustNotRoll });
    expect(r.status).toBe('blocked-week');
    expect(r.blockUntilDay).toBe(17);
  });

  it('Core p.145: rango 4 + 8 contra DV10 del grupo pequeño es éxito sin bloqueo', () => {
    const r = rollFavor({ rank: 4, size: 'small', requiredRank: 3, currentDay: 1, rng: dice(10, 8) });
    expect(r.success).toBe(true);
    expect(r.blockUntilDay).toBeUndefined();
  });

  it('Core p.145: la tabla de favores muestra el Rango actual y los superiores, marcando el que aplica', () => {
    const rows = favorExamplesForRank(4);
    expect(rows[0].fromRank).toBe(3);
    expect(rows.map(r => r.applies)).toEqual([true, false, false, false, false]);
  });
});

describe('Fixer', () => {
  it('Core p.159: la contraparte que no es Fixer no suma Operator', () => {
    const r = rollHaggle({
      fixer: { cool: 8, trading: 6, operatorRank: 4 },
      counterpart: { cool: 6, trading: 4, operatorRank: 9, isFixer: false },
      rng: dice(10, 5, 5)
    });
    expect(r.fixerTotal).toBe(23);
    expect(r.counterpartTotal).toBe(15);
    expect(r.fixerWins).toBe(true);
  });

  it('Core p.159: si la contraparte es Fixer suma su Operator', () => {
    const r = rollHaggle({
      fixer: { cool: 5, trading: 5, operatorRank: 3 },
      counterpart: { cool: 5, trading: 5, operatorRank: 3, isFixer: true },
      rng: dice(10, 5, 5)
    });
    expect(r.counterpartTotal).toBe(18);
  });

  it('Core p.129: en un empate gana la contraparte (el que se defiende)', () => {
    const r = rollHaggle({
      fixer: { cool: 5, trading: 5, operatorRank: 3 },
      counterpart: { cool: 6, trading: 7 },
      rng: dice(10, 5, 5)
    });
    expect(r.fixerTotal).toBe(18);
    expect(r.counterpartTotal).toBe(18);
    expect(r.fixerWins).toBe(false);
  });

  it('Core p.160: con Operator 4 hay tratos de los escalones 1-2 y 3-4 (no el 5-6)', () => {
    const deals = haggleDealsAvailable(4);
    expect(deals.map(d => d.fromRank)).toEqual([1, 3]);
  });
});

describe('Media', () => {
  it('Core p.151: el rumor pasivo informa el de mayor DV superado (Credibility 4 + 7 = 11 supera DV 7 y 9, no el 11)', () => {
    const r = rollPassiveRumor(4, dice(10, 7));
    expect(r.total).toBe(11);
    expect(r.bestRumor?.passiveDv).toBe(9);
  });

  it('Core p.151: sin superar el DV 7 no hay rumor', () => {
    expect(rollPassiveRumor(2, dice(10, 5)).bestRumor).toBeNull();
  });

  it('Core p.151: rumor activo STAT + Skill + 1d10 contra el DV activo 17 de Substantial', () => {
    const ok = rollActiveRumor({ stat: 6, skill: 6, tier: 2, rng: dice(10, 7) });
    expect(ok.dv).toBe(17);
    expect(ok.total).toBe(19);
    expect(ok.success).toBe(true);
    const fail = rollActiveRumor({ stat: 6, skill: 6, tier: 3, rng: dice(10, 7) });
    expect(fail.dv).toBe(21);
    expect(fail.success).toBe(false);
  });

  it('Core p.152: Believability de Rango 4 es 3 de 10 y de Rango 10 es 7 de 10', () => {
    expect(believabilityChance(4)).toBe(3);
    expect(believabilityChance(10)).toBe(7);
  });

  it('Core p.153: Believability 3 + bonus 2 = objetivo 5; 1d10 <= 5 se cree, 6 no (el 10 no explota)', () => {
    expect(rollBelievability({ rank: 4, bonus: 2, rng: dice(10, 5) })).toEqual({ natural: 5, target: 5, believed: true });
    expect(rollBelievability({ rank: 4, bonus: 2, rng: dice(10, 6) }).believed).toBe(false);
    expect(rollBelievability({ rank: 4, bonus: 2, rng: dice(10, 10) }).natural).toBe(10);
  });

  it('Core p.153: los bonos de evidencia son +1 y +2 y suman como máximo +3', () => {
    expect(evidenceBonus({ oneVerifiable: true, moreThanFourHard: false })).toBe(1);
    expect(evidenceBonus({ oneVerifiable: false, moreThanFourHard: true })).toBe(2);
    expect(evidenceBonus({ oneVerifiable: true, moreThanFourHard: true })).toBe(3);
    expect(evidenceBonus({ oneVerifiable: false, moreThanFourHard: false })).toBe(0);
  });
});

describe('Exec', () => {
  it('Core p.154: Team Members 0 en R2, 1 en R3, 2 en R5 y 3 en R9', () => {
    expect([teamMemberSlots(2), teamMemberSlots(3), teamMemberSlots(4), teamMemberSlots(5), teamMemberSlots(8), teamMemberSlots(9), teamMemberSlots(10)]).toEqual([
      0, 1, 1, 2, 2, 3, 3
    ]);
  });

  it('Core p.155: Bodyguard con 1d6=3 usa la fila 3 y Loyalty 1d6+1 (4+1 = 5)', () => {
    const m = generateTeamMember('Bodyguard', dice(6, 3, 4, 1));
    expect(m.d6Row).toBe(3);
    expect(m.stats).toEqual({ INT: 4, REF: 8, DEX: 5, TECH: 3, COOL: 7, WILL: 8, MOVE: 6, BODY: 6, EMP: 3 });
    expect(m.loyalty).toBe(5);
    // HP como el PJ (Core p.79): 10 + 5 * ceil((BODY + WILL) / 2) = 10 + 5 * 7 = 45
    expect(m.hpMax).toBe(45);
    expect(m.hpCurrent).toBe(45);
    expect(m.seriouslyWounded).toBe(23);
    expect(m.deathSave).toBe(6);
    expect(m.status).toBe('active');
  });

  it('Core p.154: Loyalty Save es 1d6 por debajo de la Loyalty; el empate falla', () => {
    expect(rollLoyaltySave(4, dice(6, 4))).toEqual({ natural: 4, success: false });
    expect(rollLoyaltySave(4, dice(6, 3)).success).toBe(true);
  });

  it('Core p.154: fin de sesión recorta Loyalty 12 a 10', () => {
    const out = endOfSession([member({ loyalty: 12 })]);
    expect(out.team[0].loyalty).toBe(10);
    expect(out.resigned).toEqual([]);
  });

  it('Core p.154: fin de sesión con Loyalty -1 marca renuncia', () => {
    const out = endOfSession([member({ id: 'a', loyalty: -1 }), member({ id: 'b', loyalty: 0 })]);
    expect(out.team[0].status).toBe('resigned');
    expect(out.team[1].status).toBe('active');
    expect(out.resigned).toEqual(['a']);
  });

  it('Core p.154: el reemplazo es del mismo puesto, con Loyalty 1 y 200 eb de honorarios', () => {
    const n = replacementMember(member({ position: 'Driver' }), dice(6, 2));
    expect(n.position).toBe('Driver');
    expect(n.loyalty).toBe(1);
    expect(n.status).toBe('active');
    expect(REPLACEMENT_FEE_EB).toBe(200);
  });
});

describe('Lawman', () => {
  it('Core p.158: con Rango 4 hay Corporate Security y Local Beat Cops', () => {
    expect(backupGroupsAvailable(4).map(g => g.name)).toEqual(['Corporate Security', 'Local Beat Cops']);
  });

  it('Core p.158: la llamada tiene éxito con 1d10 <= Rango (4 sí, 5 no)', () => {
    expect(rollBackupCall(4, dice(10, 4)).success).toBe(true);
    expect(rollBackupCall(4, dice(10, 5)).success).toBe(false);
  });

  it('Core p.158: la llegada es 1d6 Rondas; con un 6 llega el grupo siguiente', () => {
    expect(rollBackupArrival(1, dice(6, 3))).toEqual({ rounds: 3, groupIndex: 1, upgraded: false });
    expect(rollBackupArrival(1, dice(6, 6))).toEqual({ rounds: 6, groupIndex: 2, upgraded: true });
  });

  it('Core p.158: Local Beat Cops son 4 agentes de 25 HP', () => {
    const group = backupGroupsAvailable(4)[1];
    const agents = backupAgents(group);
    expect(agents).toHaveLength(4);
    expect(agents[0]).toEqual({ hpMax: 25, hpCurrent: 25 });
  });

  it('Core p.159: Combat Number + 1d10 (CN 10 + 6 = 16)', () => {
    expect(rollCombatNumber(10, mixed([10, 6])).total).toBe(16);
  });
});
