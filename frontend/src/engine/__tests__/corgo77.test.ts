// [Claude Code · 2026-11-25] v5.48.0 (plan 35): drones y robots de Corgo's 77 Collection V3. HOMEBREW, no canon:
// excepción aprobada por Giuliano, siempre con sello propio. Las páginas son las del PDF de Corgo.
import { describe, expect, it } from 'vitest';
import { CORGO77_ENEMIES } from '../../data/enemies/corgo77';
import { ENEMIES_CATALOG, convertEnemyToCharacterSheet, enemyInitiativeBase, enemyStatLabel } from '../../data/enemiesCatalog';

const byName = (n: string) => CORGO77_ENEMIES.find((e) => e.name === n)!;

describe("Corgo's 77 (homebrew)", () => {
  it('33 máquinas, todas homebrew, con fuente propia, página y en el bestiario', () => {
    expect(CORGO77_ENEMIES).toHaveLength(33);
    for (const e of CORGO77_ENEMIES) {
      expect(e.id.startsWith('c77-')).toBe(true);
      expect(e.homebrew).toBe(true);
      expect(e.sourceBook).toBe('homebrew_corgo77');
      expect(e.machine).toBeDefined();
      expect(e.sourcePage).toBeGreaterThanOrEqual(6);
      expect(e.sourcePage).toBeLessThanOrEqual(163);
      expect(ENEMIES_CATALOG).toContain(e);
    }
  });

  it('ninguna ficha canon queda marcada como homebrew ni usa la fuente de Corgo', () => {
    for (const e of ENEMIES_CATALOG.filter((x) => !x.id.startsWith('c77-'))) {
      expect(e.homebrew).toBeUndefined();
      expect(e.sourceBook).not.toBe('homebrew_corgo77');
    }
  });

  it('los ids del bestiario completo son únicos', () => {
    const ids = ENEMIES_CATALOG.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('valores del PDF: Militech Griffin p.155 y Militech Chimera p.159', () => {
    expect(byName('Militech Griffin')).toMatchObject({ hp: 20, bodySp: 7, combatNumber: 14, sourcePage: 155, machine: { move: 6 } });
    expect(byName('Militech Chimera')).toMatchObject({ hp: 200, bodySp: 18, combatNumber: 18, threatTier: 'boss', machine: { move: 3 } });
  });

  it('una máquina ataca con su Combat Number y no muestra STATs salvo MOVE', () => {
    const griffin = byName('Militech Griffin');
    expect(griffin.weapons.length).toBeGreaterThan(0);
    for (const w of griffin.weapons) expect(w.skillBase).toBe(14);
    expect(enemyStatLabel(griffin, 'REF')).toBe('—');
    expect(enemyStatLabel(griffin, 'MOVE')).toBe('6');
    const sheet = convertEnemyToCharacterSheet(griffin);
    expect(sheet.skills.shoulderArms).toBe(14);
    expect(sheet.skills.evasion).toBe(14);
    expect(sheet.stats.REF).toBe(0);
  });

  it('la iniciativa de una máquina usa su Combat Number; la de un PNJ canon, su REF', () => {
    expect(enemyInitiativeBase(byName('Militech Griffin'))).toBe(14);
    const canon = ENEMIES_CATALOG[0];
    expect(enemyInitiativeBase(canon)).toBe(canon.stats.REF);
  });
});
