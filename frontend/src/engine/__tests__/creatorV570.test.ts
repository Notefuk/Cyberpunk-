// v5.7.0: filtro de skills por libro en el wizard y rangos de rol en la ficha. [Claude Code · 2026-10-30]
import { describe, expect, it } from 'vitest';
import { getSkillCatalog } from '../characterCreation';
import { ROLE_ABILITIES_COMPLETE_PROGRESSION } from '../../data/weaponAndCyberwareTooltips';
import { ipCostRoleRank } from '../roleRules';

describe('Skills por libro (Core pp.81-85)', () => {
  it('el Core RED tiene 66 skills y el CEMK trae 46 de ellas', () => {
    const c = getSkillCatalog();
    expect(c).toHaveLength(66);
    expect(c.filter((s) => s.books.includes('CEMK'))).toHaveLength(46);
    expect(c.every((s) => s.books.includes('Core RED'))).toBe(true);
  });

  it('Handgun está en los dos; Archery solo en el Core RED', () => {
    const c = getSkillCatalog();
    expect(c.find((s) => s.name === 'Handgun')!.books).toContain('CEMK');
    expect(c.find((s) => s.name === 'Archery')!.books).not.toContain('CEMK');
  });
});

describe('Rangos de rol', () => {
  it('cada rol tiene los rangos 1 a 10 con su texto', () => {
    for (const prog of Object.values(ROLE_ABILITIES_COMPLETE_PROGRESSION)) {
      expect(prog.ranks.map((r) => r.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      for (const r of prog.ranks) expect(r.unlocks.length).toBeGreaterThan(10);
    }
  });

  it('subir de rango cuesta 60 × el rango nuevo (Core p.410)', () => {
    expect(ipCostRoleRank(5)).toBe(300);
    expect(ipCostRoleRank(10)).toBe(600);
  });
});
