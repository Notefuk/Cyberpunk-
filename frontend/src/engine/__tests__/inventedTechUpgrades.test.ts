// [Claude Code · 2026-11-14] v5.42.0 (plan 33): Invented Tech Upgrades Guide (DLC pp.3-9).
import { describe, expect, it } from 'vitest';
import { INVENTED_UPGRADES, INVENTING_TECHS, TUP_THERMOMETER, priceInventedUpgrade, inventedUpgradeById } from '../../data/inventedTechUpgrades';

describe('Invented Tech Upgrades', () => {
  it('18 mejoras de 6 Techs, 3 cada uno, con página entre 5 y 9', () => {
    expect(INVENTING_TECHS).toHaveLength(6);
    expect(INVENTED_UPGRADES).toHaveLength(18);
    for (const t of INVENTING_TECHS) expect(INVENTED_UPGRADES.filter((u) => u.techId === t.id)).toHaveLength(3);
    expect(INVENTED_UPGRADES.every((u) => u.page >= 5 && u.page <= 9)).toBe(true);
  });
  it('valores del libro: Vorpal Coating DV24 1,000; Shredding Ax DV17 100; Rocket Runner 500 (p.5, mitad por ir de a dos)', () => {
    expect(inventedUpgradeById('vorpal-coating')).toMatchObject({ dv: 24, cost2: 1000 });
    expect(inventedUpgradeById('shredding-ax')).toMatchObject({ dv: 17, cost2: 100 });
    expect(inventedUpgradeById('rocket-runner')).toMatchObject({ dv: 24, cost2: 500 });
  });
  it('termómetro (p.4): Mild 100, Medium 500, Hot 1,000, Extra Hot 5,000 y Diablo 5,000+', () => {
    expect(TUP_THERMOMETER.map((t) => [t.label, t.cost])).toEqual([['Diablo', 5000], ['Extra Hot', 5000], ['Hot', 1000], ['Medium', 500], ['Mild', 100]]);
  });
  it('precio (p.3): con el Tech PNJ suma 50% de mano de obra; con el kit se paga el costo 2 y después el costo 1', () => {
    expect(priceInventedUpgrade(500, 1000, 'npc_install')).toEqual({ cost1: 500, cost2: 1000, labor: 750, payNow: 2250, payOnInstall: 0, total: 2250 });
    expect(priceInventedUpgrade(500, 1000, 'kit')).toEqual({ cost1: 500, cost2: 1000, labor: 0, payNow: 1000, payOnInstall: 500, total: 1500 });
  });
});
