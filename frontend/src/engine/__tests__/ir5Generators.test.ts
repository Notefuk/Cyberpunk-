// [Claude Code · 2026-11-13] v5.30.0 (plan 31): generadores del Interface RED Vol. 5.
// Screamsheet (pp.83-96) y Gunpath (pp.48-53): cobertura de dados, campos y costos.
import { describe, expect, it } from 'vitest';
import { SCREAMSHEET_BYLINES, SCREAMSHEET_KINDS, SCREAMSHEET_TOKENS } from '../../data/gmTables/screamsheet';
import { GUNPATH_ATTACHMENTS, GUNPATH_MANUFACTURERS, GUNPATH_NAMES, GUNPATH_TYPES } from '../../data/gmTables/gunpath';
import { IR5_REFERENCES } from '../../data/gmTables/ir5References';
import { allowedHeadlines, fillTokens, kindForRoll, rawTexts, rollScreamsheet, screamsheetText, screamsheetTokens } from '../screamsheet';
import { attachmentEligible, rollAttachments, rollGunpath, rollMatches, tierForCost, totalCost } from '../gunpath';

const seq = (vals: number[]) => {
  let i = 0;
  return () => vals[i++ % vals.length];
};
const covers = (rows: { roll: string }[], sides: number) => {
  for (let n = 1; n <= sides; n++) expect(rows.filter((r) => rollMatches(r.roll, n)), `${n}`).toHaveLength(1);
};

describe('Screamsheet (IR5 pp.83-96)', () => {
  it('Tabla A cubre el 1d6 con los 3 tipos', () => {
    expect(SCREAMSHEET_KINDS).toHaveLength(3);
    const ids = new Set([1, 2, 3, 4, 5, 6].map((n) => kindForRoll(n).id));
    expect(ids.size).toBe(3);
  });

  it('cada tipo tiene 6 intros, cuerpos, cierres y titulares, y los cierres apuntan a titulares que existen', () => {
    for (const k of SCREAMSHEET_KINDS) {
      for (const rows of [k.intro, k.body, k.conclusion, k.headlines]) expect(rows.map((r) => r.roll).sort(), k.id).toEqual([1, 2, 3, 4, 5, 6]);
      for (const c of k.conclusion) for (const h of allowedHeadlines(k, c.roll)) expect(k.headlines.some((x) => x.roll === h), `${k.id} ${c.roll}`).toBe(true);
    }
  });

  it('12 firmas y todos los campos de los textos tienen su ayuda', () => {
    expect(SCREAMSHEET_BYLINES).toHaveLength(12);
    const all = SCREAMSHEET_KINDS.flatMap((k) => [...k.intro, ...k.body, ...k.conclusion, ...k.headlines].map((r) => r.text));
    const used = screamsheetTokens(all);
    expect(new Set(SCREAMSHEET_TOKENS.map((t) => t.token))).toEqual(new Set(used));
  });

  it('la nota respeta el titular que permite el cierre y completa los campos', () => {
    for (let s = 0; s < 50; s++) {
      const r = rollScreamsheet(Math.random);
      const k = SCREAMSHEET_KINDS.find((x) => x.id === r.kind)!;
      expect(allowedHeadlines(k, r.conclusionRoll)).toContain(r.headlineRoll);
      const tokens = screamsheetTokens(rawTexts(r));
      const values = Object.fromEntries(tokens.map((t) => [t, 'X']));
      const t = screamsheetText(r, values);
      expect([t.headline, ...t.paragraphs].join(' ')).not.toMatch(/\[[^\]]+\]/);
      expect(t.paragraphs).toHaveLength(3);
    }
  });

  it('un campo vacío queda entre corchetes', () => {
    expect(fillTokens('Hola [Nombre] de [Lugar]', { '[Nombre]': 'Rogue' })).toBe('Hola Rogue de [Lugar]');
  });
});

describe('Gunpath (IR5 pp.48-53)', () => {
  it('las tablas cubren sus dados sin huecos ni solapes', () => {
    covers(GUNPATH_MANUFACTURERS, 100);
    covers(GUNPATH_TYPES.rows, 10);
    covers(GUNPATH_NAMES.rows, 100);
    for (const r of GUNPATH_TYPES.rows) if (r.subRoll) covers(r.subRoll.rows, 6);
    for (const [skill, t] of Object.entries(GUNPATH_ATTACHMENTS)) {
      covers(t.rows, Number(t.die.slice(2)));
      for (const r of t.rows) if (r.subRoll) covers(r.subRoll.rows, 6);
      expect(skill).toBeTruthy();
    }
  });

  it('la Categoría solo sube si el costo llega a la siguiente (ejemplo del libro, p.51)', () => {
    expect(totalCost(100, 'standard', [{ name: 'Extended Magazine', cost: 100 }])).toEqual({ cost: 200, costTier: 'Premium' });
    expect(totalCost(100, 'standard', [{ name: 'Drum Magazine', cost: 500 }])).toEqual({ cost: 600, costTier: 'Expensive' });
    expect(tierForCost(499)).toBe('Premium');
  });

  it('Poor baja una Categoría y Excellent sube una (p.50)', () => {
    expect(totalCost(100, 'poor', [])).toEqual({ cost: 50, costTier: 'Costly' });
    expect(totalCost(500, 'excellent', [])).toEqual({ cost: 1000, costTier: 'Very Expensive' });
  });

  it('el 9 del tipo es arco con par y ballesta con impar', () => {
    // 1d100 fabricante (0.0 → 1), 1d10 tipo (0.85 → 9), 1d6 sub (0.2 → 2 = par)
    const g = rollGunpath(seq([0, 0.85, 0.2, 0.9, 0]));
    expect(g.type).toBe('Bow');
    expect(g.skill).toBe('Archery');
    expect(g.quality).toBe('excellent');
  });

  it('Silencer y Grapple Gun Underbarrel solo donde corresponde (p.48)', () => {
    expect(attachmentEligible('Silencer', 'Grenade Launcher', 'Heavy Weapons')).toBe(false);
    expect(attachmentEligible('Silencer', 'SMG', 'Handgun')).toBe(true);
    expect(attachmentEligible('Grapple Gun Underbarrel', 'Bow', 'Archery')).toBe(false);
    expect(attachmentEligible('Grapple Gun Underbarrel', 'Crossbow', 'Archery')).toBe(true);
    for (let s = 0; s < 50; s++) {
      const a = rollAttachments('Heavy Weapons', 'Rocket Launcher', 3, Math.random);
      expect(a.map((x) => x.name)).not.toContain('Silencer');
      expect(new Set(a.map((x) => x.name)).size).toBe(a.length);
    }
  });
});

describe('Referencias IR5', () => {
  it('derby, Hiring Hall, parámetros de misión y hackeo de Agents', () => {
    expect(IR5_REFERENCES.map((r) => r.id)).toEqual(['roller-derby', 'hiring-hall', 'mission-parameters', 'agent-hacking']);
    for (const r of IR5_REFERENCES) expect(r.items.length, r.id).toBeGreaterThan(0);
  });
});
