// [Claude Code · 2026-11-14] v5.44.0 (plan 33): Everyday People (DLC 2026, v1.01), 20 civiles con ficha abreviada.
import { describe, expect, it } from 'vitest';
import { EVERYDAY_PEOPLE_ENEMIES } from '../../data/enemies/everyday-people';
import { ENEMIES_CATALOG, enemyStatLabel } from '../../data/enemiesCatalog';
import { npcTemplate, npcThreatTier } from '../../data/npcCreationGuidelines';
import { portEnemyToCemk } from '../cemkPort';

const byName = (n: string) => EVERYDAY_PEOPLE_ENEMIES.find((e) => e.name === n)!;

describe('Everyday People', () => {
  it('20 civiles, Mooks, con página entre 3 y 12 y en el bestiario', () => {
    expect(EVERYDAY_PEOPLE_ENEMIES).toHaveLength(20);
    for (const e of EVERYDAY_PEOPLE_ENEMIES) {
      expect(e.threatTier).toBe('mook');
      expect(e.abbreviated).toBe(true);
      expect(e.sourcePage).toBeGreaterThanOrEqual(3);
      expect(e.sourcePage).toBeLessThanOrEqual(12);
      expect(e.faction).toBe('Civiles (Everyday People)');
      expect(ENEMIES_CATALOG).toContain(e);
    }
  });
  it('valores del libro: Bouncer p.3, Corporate Researcher p.5 y Taxi Driver p.12', () => {
    expect(byName('Bouncer')).toMatchObject({ hp: 35, bodySp: 7, headSp: 0, rep: 1, sourcePage: 3, roleAbility: { name: 'Combat Awareness', rank: 2 } });
    expect(byName('Bouncer').stats).toMatchObject({ REF: 6, MOVE: 4 });
    expect(byName('Bouncer').weapons.map((w) => [w.name, w.skillBase, w.damage, w.rof])).toEqual([['Brawling Attack', 10, '2d6', 2], ['Stun Baton', 10, '2d6', 2]]);
    expect(byName('Corporate Researcher')).toMatchObject({ hp: 20, isNetrunner: true, interfaceRank: 2, sourcePage: 5 });
    expect(byName('Taxi Driver').weapons[1]).toMatchObject({ name: 'Very Heavy Pistol (Poor Quality)', damage: '5d6', rof: 1, skillBase: 8 });
  });
  it('las variantes van en las reglas especiales', () => {
    expect(byName('Busker').specialRules.filter((r) => r.startsWith('Variante '))).toHaveLength(3);
    expect(byName('Bartender').specialRules.some((r) => r.startsWith('Variante Dive Bar Bartender'))).toBe(true);
  });
  it('los STATs que el libro no da se ven como "—"; REF (INIT) y MOVE se ven', () => {
    const e = byName('Laborer');
    expect(enemyStatLabel(e, 'REF')).toBe('4');
    expect(enemyStatLabel(e, 'MOVE')).toBe('5');
    expect(enemyStatLabel(e, 'BODY')).toBe('—');
    expect(enemyStatLabel(ENEMIES_CATALOG[0], 'BODY')).toBe(String(ENEMIES_CATALOG[0].stats.BODY));
  });
  it('el porte CEMK no compara el HP con la fórmula en una ficha abreviada', () => {
    const notes = portEnemyToCemk(byName('Laborer')).notes.join(' | ');
    expect(notes).toContain('Ficha abreviada');
    expect(notes).not.toContain('fórmula CEMK (');
  });
  it('plantilla Civil (p.2): 33 STAT, 30 skill, HP 20-35, SP 0-7, combate 6-10, sin Hardened', () => {
    expect(npcTemplate('civilian', false)).toMatchObject({ statPoints: 33, maxStat: 6, skillPoints: 30, hp: [20, 35], sp: [0, 7], combatBase: [6, 10], nonCombatBase: [8, 12], gearBudget: 300, cyberwareBudget: 500 });
    expect(npcTemplate('civilian', true)).toEqual(npcTemplate('civilian', false));
    expect(npcThreatTier('civilian', true)).toBe('mook');
  });
});
