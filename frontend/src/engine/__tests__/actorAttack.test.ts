// [Claude Code · 2026-11-12] v5.23.0 (plan 28): un actor del GM ataca a un jugador.
import { describe, it, expect } from 'vitest';
import { rollActorAttack, parseDamageFormula } from '../actorAttack';
import { calculateIncomingImpact } from '../combatEngine';

const seq = (...vals: number[]) => {
  let i = 0;
  return () => vals[i++ % vals.length];
};
// d10: rng 0.6 → 7. d6: rng 0.99 → 6, 0.3 → 2.

describe('ataque de un actor (Core pp.170-176)', () => {
  it('lee la fórmula de daño', () => {
    expect(parseDamageFormula('3d6')).toEqual({ dice: 3, bonus: 0 });
    expect(parseDamageFormula('2d6+2')).toEqual({ dice: 2, bonus: 2 });
    expect(parseDamageFormula('5')).toEqual({ dice: 0, bonus: 5 });
  });

  it('base + 1d10 tiene que superar el DV, no igualarlo (CEMK p.5)', () => {
    expect(rollActorAttack({ skillBase: 8, damage: '2d6', dv: 15, aimedHead: false }, seq(0.6, 0.3)).hit).toBe(false);
    const hit = rollActorAttack({ skillBase: 9, damage: '2d6', dv: 15, aimedHead: false }, seq(0.6, 0.3));
    expect(hit).toEqual({ d10: 7, attackTotal: 16, hit: true, dice: [2, 4], damage: 6, critical: false });
  });

  it('apuntar a la cabeza resta 8 (Core p.170)', () => {
    const r = rollActorAttack({ skillBase: 14, damage: '2d6', dv: 15, aimedHead: true }, seq(0.6));
    expect(r.attackTotal).toBe(13);
    expect(r.hit).toBe(false);
  });

  it('dos 6 en el daño = crítico; el +5 lo suma el impacto aunque no atraviese el SP (Core p.187)', () => {
    const r = rollActorAttack({ skillBase: 20, damage: '3d6', dv: 15, aimedHead: false }, seq(0.6, 0.99, 0.99, 0.0));
    expect(r.dice).toEqual([6, 6, 1]);
    expect(r.critical).toBe(true);
    expect(r.damage).toBe(13);
    const impact = calculateIncomingImpact({ damage: r.damage, location: 'body', attackType: 'standard', isCritical: true, passExcess: false, headSp: 0, bodySp: 11, shieldSdp: 0 });
    expect(impact.hpLoss).toBe(2 + 5);
  });
});
