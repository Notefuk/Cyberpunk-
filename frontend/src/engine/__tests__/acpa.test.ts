// [Claude Code · 2026-11-12] v5.26.0 (plan 30): ACPA, "Solo of Fortune 2045", Interface RED Vol. 5 pp.133-142.
import { describe, expect, it } from 'vitest';
import { ACPA_PREBUILTS } from '../../data/acpaData';
import {
  acpaAllowsBulletDodge,
  acpaCriticalFeedback,
  acpaFatiguePenalty,
  acpaRepair,
  acpaTakeDamage,
  buildAcpa,
  pilotStatsInAcpa,
  prebuiltAcpaStats,
} from '../acpa';

describe('Armado de ACPA (IR5 pp.135-137)', () => {
  it('reproduce el ejemplo de Jeremy de la p.137: 24 HP, 13 SP, BODY 12, -1 DEX, 9.800eb Luxury', () => {
    const s = buildAcpa({
      frame: 'sigma',
      shell: 'salvaged',
      tunings: { acceleration: 'B', hydraulics: 'A', maneuverability: 'A', weight: 'A' },
      onboardWeapons: [{ name: 'Highland Defense Stickybomb Launcher', cost: 1300 }],
      onboardCyberware: [{ name: 'Skate Foot', cost: 500 }],
    });
    expect(s).toMatchObject({ hp: 24, sp: 13, body: 12, ref: 0, dex: -1, move: 0, cost: 9800, costTier: 'Luxury', errors: [] });
  });

  it('marca error con más de 6 armas Onboard', () => {
    const w = Array.from({ length: 7 }, (_, i) => ({ name: `w${i}`, cost: 100 }));
    const s = buildAcpa({ frame: 'omega', shell: 'heavy', tunings: { acceleration: 'A', hydraulics: 'A', maneuverability: 'A', weight: 'A' }, onboardWeapons: w });
    expect(s.errors).toHaveLength(1);
  });
});

describe('Las 10 ACPA de fábrica (IR5 pp.138-142)', () => {
  const stats = (id: string) => prebuiltAcpaStats(ACPA_PREBUILTS.find((p) => p.id === id)!);
  /** Lee la línea impresa: "25 HP • 16 SP • BODY 12 • -1 DEX". */
  const printed = (line: string) => {
    const n = (re: RegExp) => Number(line.match(re)?.[1] ?? 0);
    return { hp: n(/(\d+) HP/), sp: n(/(\d+) SP/), body: n(/BODY (\d+)/), ref: n(/([+-]\d+) REF/), dex: n(/([+-]\d+) DEX/), move: n(/([+-]\d+) MOVE/) };
  };

  it('son 10', () => {
    expect(ACPA_PREBUILTS).toHaveLength(10);
  });

  it('las que no tienen errata dan exactamente lo impreso', () => {
    const clean = ACPA_PREBUILTS.filter((p) => !p.erratum);
    expect(clean).toHaveLength(5);
    for (const p of clean) {
      const { hp, sp, body, ref, dex, move } = prebuiltAcpaStats(p);
      expect({ hp, sp, body, ref, dex, move }, p.id).toEqual(printed(p.printedLine));
    }
  });

  it('las que tienen errata coinciden en HP con lo impreso y usan el valor recalculado', () => {
    for (const p of ACPA_PREBUILTS.filter((x) => x.erratum)) expect(prebuiltAcpaStats(p).hp, p.id).toBe(printed(p.printedLine).hp);
    expect(stats('blueraven-sewer-rat').sp).toBe(14);
    expect(stats('arasaka-neo-standard')).toMatchObject({ body: 14, move: 1 });
    expect(stats('sovoil-bombardier').move).toBe(-2);
    expect(stats('zetatech-grasshopper').move).toBe(1);
    expect(stats('zhirafa-boris').move).toBe(-2);
  });

  it('cada ACPA cita su página', () => {
    for (const p of ACPA_PREBUILTS) {
      expect(p.sourcePage).toBeGreaterThanOrEqual(138);
      expect(p.sourcePage).toBeLessThanOrEqual(142);
    }
  });
});

describe('Daño, críticas y reparación (IR5 pp.133-135)', () => {
  const full = { hp: 30, maxHp: 30, sp: 17, maxSp: 17 };

  it('el daño que no supera el SP no hace nada', () => {
    expect(acpaTakeDamage(full, 17)).toMatchObject({ hpLost: 0, ablated: false, destroyed: false });
  });

  it('el que lo supera baja HP y ablaciona 1 SP', () => {
    const r = acpaTakeDamage(full, 25);
    expect(r.state).toEqual({ hp: 22, maxHp: 30, sp: 16, maxSp: 17 });
    expect(r.ablated).toBe(true);
  });

  it('a 0 HP queda destruida y ya no absorbe', () => {
    const r = acpaTakeDamage({ ...full, hp: 3 }, 40);
    expect(r.state.hp).toBe(0);
    expect(r.destroyed).toBe(true);
    expect(acpaTakeDamage(r.state, 50).state).toBe(r.state);
  });

  it('la mitad del SP redondea para arriba', () => {
    expect(acpaTakeDamage(full, 10, { halveSp: true }).hpLost).toBe(1);
  });

  it('la crítica le hace 5 al piloto, 0 si es FBC', () => {
    expect(acpaCriticalFeedback(false)).toBe(5);
    expect(acpaCriticalFeedback(true)).toBe(0);
  });

  it('reparación: DV9, DV13 o DV17 según el daño', () => {
    expect(acpaRepair(full)).toBeNull();
    expect(acpaRepair({ ...full, hp: 20 })?.dv).toBe(9);
    expect(acpaRepair({ ...full, hp: 14 })?.dv).toBe(13);
    expect(acpaRepair({ ...full, hp: 0 })?.dv).toBe(17);
  });
});

describe('Piloto dentro de la ACPA (IR5 p.134)', () => {
  it('suma los mods a REF, DEX y MOVE y usa el BODY más alto', () => {
    expect(pilotStatsInAcpa({ REF: 7, DEX: 6, MOVE: 5, BODY: 6 }, { ref: -1, dex: -1, move: 3, body: 16 })).toEqual({ REF: 6, DEX: 5, MOVE: 8, BODY: 16 });
    expect(pilotStatsInAcpa({ REF: 7, DEX: 6, MOVE: 5, BODY: 16 }, { ref: 0, dex: 0, move: 0, body: 12 }).BODY).toBe(16);
  });

  it('fatiga: -1 pasadas 4 h salvo FBC o Moto/Interface 4+, -2 pasadas 8 h para todos', () => {
    expect(acpaFatiguePenalty(4)).toBe(0);
    expect(acpaFatiguePenalty(5)).toBe(-1);
    expect(acpaFatiguePenalty(5, { isFbc: true })).toBe(0);
    expect(acpaFatiguePenalty(5, { motoOrInterfaceRank: 4 })).toBe(0);
    expect(acpaFatiguePenalty(9, { isFbc: true })).toBe(-2);
  });

  it('esquivar balas solo con alguna de las condiciones', () => {
    const none = { ref: 0, dex: 0, move: 0 };
    expect(acpaAllowsBulletDodge({ ...none, move: 3 }, { pilotRef: 5, pilotDex: 5 })).toBe(true);
    expect(acpaAllowsBulletDodge(none, { pilotRef: 8, pilotDex: 5, hasReflexCoProcessor: true })).toBe(true);
    expect(acpaAllowsBulletDodge({ ...none, ref: -1 }, { pilotRef: 8, pilotDex: 5, hasReflexCoProcessor: true })).toBe(false);
    expect(acpaAllowsBulletDodge(none, { pilotRef: 5, pilotDex: 8 })).toBe(true);
    expect(acpaAllowsBulletDodge({ ...none, move: -1 }, { pilotRef: 5, pilotDex: 8 })).toBe(false);
    expect(acpaAllowsBulletDodge({ ...none, move: -1 }, { pilotRef: 5, pilotDex: 5, combatAwarenessRank: 6 })).toBe(true);
  });
});
