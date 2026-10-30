// [Claude Code · 2026-10-30] v5.8.0 (plan 23): DV y tiempo para reparar armadura, Core p.140 (Item Repair).
import { describe, expect, it } from 'vitest';
import { armorRepairInfo } from '../armorRepair';

describe('armorRepairInfo (Core p.140)', () => {
  it('Light Armorjack es Premium: DV17, 1 día, con Basic Tech', () => {
    const r = armorRepairInfo('Light Armorjack (Body)');
    expect(r).toMatchObject({ tier: 'Premium', dv: 17, time: '1 día', skill: 'Basic Tech', repairsBothPieces: false });
  });

  it('Kevlar es Costly: DV13, 6 horas (el ® del nombre no molesta)', () => {
    expect(armorRepairInfo('Kevlar® (Head)')).toMatchObject({ tier: 'Costly', dv: 13, time: '6 horas' });
  });

  it('Metalgear es Luxury: DV29, 1 mes', () => {
    expect(armorRepairInfo('Metalgear® (Body)')).toMatchObject({ tier: 'Luxury', dv: 29, time: '1 mes' });
  });

  it('Heavy Armorjack no se confunde con Light: gana el nombre más largo que coincide', () => {
    expect(armorRepairInfo('Heavy Armorjack (Body)')).toMatchObject({ catalogName: 'Heavy Armorjack', tier: 'Expensive', dv: 21, time: '1 semana' });
  });

  it('la Bodyweight Suit se repara entera (Core p.350)', () => {
    expect(armorRepairInfo('Bodyweight Suit (Head)')).toMatchObject({ tier: 'Very Expensive', dv: 24, repairsBothPieces: true });
  });

  it('Super Luxury: 1 mes por cada 10.000 €$', () => {
    const r = armorRepairInfo('Prototipo X', [{ name: 'Prototipo X', cost: 25000, costTier: 'Super Luxury' }]);
    expect(r).toMatchObject({ dv: 29, time: '3 meses (1 mes por cada 10.000 €$)' });
  });

  it('un nombre que no está en el catálogo no rompe: sin DV', () => {
    expect(armorRepairInfo('Campera de cuero de mi abuelo')).toMatchObject({ tier: null, dv: null, time: null });
    expect(armorRepairInfo(undefined).tier).toBeNull();
  });
});
