// Tests de los rangos de rol 1-10 (plan 8, v4.9.0). Cada caso cita la página del libro que fija el valor.
// [Claude Code · 2026-10-22]
import { describe, expect, it } from 'vitest';
import { ROLE_RANKS } from '../../data/creation';
import { ROLE_ABILITIES_COMPLETE_PROGRESSION } from '../../data/weaponAndCyberwareTooltips';
import { ROLES_INTERACTIVE_GUIDES } from '../../data/netAndRolesData';

const ROLES = ['Solo', 'Netrunner', 'Tech', 'Medtech', 'Nomad', 'Rockerboy', 'Fixer', 'Media', 'Exec', 'Lawman'] as const;

describe('Rangos de rol', () => {
  it('Core pp. 144-162: los 10 roles tienen rangos 1..10 consecutivos con texto', () => {
    expect(Object.keys(ROLE_RANKS.roles)).toEqual([...ROLES]);
    for (const r of ROLES) {
      const ranks = ROLE_RANKS.roles[r].ranks;
      expect(ranks.map(x => x.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      for (const step of ranks) expect(step.unlocksEs.length).toBeGreaterThan(0);
    }
  });

  it('Core p.197: Netrunner NET Actions por rango 1-3=2, 4-6=3, 7-9=4, 10=5', () => {
    expect(ROLE_RANKS.roles.Netrunner.tables.netActionsByRank).toEqual([
      { fromRank: 1, toRank: 3, actions: 2 },
      { fromRank: 4, toRank: 6, actions: 3 },
      { fromRank: 7, toRank: 9, actions: 4 },
      { fromRank: 10, toRank: 10, actions: 5 }
    ]);
  });

  it('CEMK RB p.25: Netrunner tiene ajustes 2077 desde rango 1, 2, 3, 4 y uno permanente', () => {
    const from = ROLE_RANKS.roles.Netrunner.tweak2077.map(t => t.fromRank);
    expect(from.filter(x => x !== null)).toEqual([1, 2, 3, 4]);
    expect(from.filter(x => x === null)).toHaveLength(1);
  });

  it('CEMK RB p.25: Fixer tiene ajustes 2077 desde rango 1, 4, 7, 9', () => {
    expect(ROLE_RANKS.roles.Fixer.tweak2077.map(t => t.fromRank)).toEqual([1, 4, 7, 9]);
  });

  it('CEMK Folios: asignación inicial de Solo, Netrunner y Nomad; Media, Exec y Lawman sin folio', () => {
    expect(ROLE_RANKS.roles.Solo.folio?.startingAllocation).toEqual({ initiative_reaction: 4 });
    expect(ROLE_RANKS.roles.Netrunner.folio?.startingAllocation).toEqual({ interface: 4 });
    expect(ROLE_RANKS.roles.Nomad.folio?.startingAllocation).toEqual({ moto: 4 });
    expect(ROLE_RANKS.roles.Media.folio).toBeNull();
    expect(ROLE_RANKS.roles.Exec.folio).toBeNull();
    expect(ROLE_RANKS.roles.Lawman.folio).toBeNull();
  });

  it('Core p.197: ROLE_ABILITIES_COMPLETE_PROGRESSION se deriva de ROLE_RANKS', () => {
    expect(Object.keys(ROLE_ABILITIES_COMPLETE_PROGRESSION)).toHaveLength(10);
    const n = ROLE_ABILITIES_COMPLETE_PROGRESSION.Netrunner;
    expect(n.abilityName).toBe(ROLE_RANKS.roles.Netrunner.ability);
    expect(n.ranks[0].unlocks).toContain('2 Acciones NET');
  });

  it('Core p.197: ROLES_INTERACTIVE_GUIDES tiene 10 guías y la de Netrunner no conserva la escalera vieja de NET Actions', () => {
    expect(ROLES_INTERACTIVE_GUIDES).toHaveLength(10);
    for (const g of ROLES_INTERACTIVE_GUIDES) expect(g.id).toBe(g.id.toLowerCase());
    const net = ROLES_INTERACTIVE_GUIDES.find(g => g.id === 'netrunner')!;
    const all = net.subBranchesOrTables.flatMap(b => b.content).join('\n');
    expect(all).not.toContain('Rango 3-6: 3 Acciones de Red por asalto.');
    expect(all).not.toContain('Rango 1-2: 2 Acciones de Red por asalto.');
  });

  it('Core p. 159: ninguna guía repite "(Core p. 159)" dos veces seguidas', () => {
    for (const g of ROLES_INTERACTIVE_GUIDES) {
      const all = [g.description, ...g.subBranchesOrTables.flatMap(b => b.content)].join(' ');
      expect(all).not.toMatch(/\(Core p\. 159\)\s*\(Core p\. 159\)/);
    }
  });
});
