import { describe, it, expect } from 'vitest';
import {
  ipCostSkillLevel, ipCostRoleRank, checkSkillRaise, checkRoleRankRaise,
  netActionsForInterface, maxQuickhackDv, neuroportFirewallDv, canUseQuickhacks, jackInRangeM,
  fixerReach, getRoleRankInfo, canApplySpeedheal, makerPointsTotal, makerPointsFree,
  validateMakerAllocation, medicinePointsFree, validateMedicineAllocation, surgeryLevel, medicalTechFromPharma,
  getInterfaceRank, medicalTechLevel,
} from '../roleRules';

describe('roleRules', () => {
  it('Core p.410: costo de nivel de skill', () => {
    expect(ipCostSkillLevel(1, false)).toBe(20);
    expect(ipCostSkillLevel(6, false)).toBe(120);
    expect(ipCostSkillLevel(6, true)).toBe(240);
  });
  it('Core p.410: costo de rango de rol', () => {
    expect(ipCostRoleRank(5)).toBe(300);
    expect(ipCostRoleRank(11)).toBeNaN();
  });
  it('Core p.410: subir sin IP suficientes falla con razón', () => {
    const r = checkSkillRaise(5, false, 10);
    expect(r.ok).toBe(false);
    expect(r.cost).toBe(120);
    expect(r.reason).toBe('Faltan 110 IP (cuesta 120, tenés 10).');
  });
  it('Core p.410: subir con IP suficientes y rango de rol', () => {
    expect(checkSkillRaise(5, false, 120).ok).toBe(true);
    expect(checkRoleRankRaise(0, 60).ok).toBe(true);
  });
  it('Core p.410: en el máximo (10) no se puede subir', () => {
    const r = checkSkillRaise(10, false, 9999);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('Ya está en el máximo (10).');
    expect(checkRoleRankRaise(10, 9999).ok).toBe(false);
  });
  it('Core p.197: Acciones NET por Interface', () => {
    const got = [1, 3, 4, 6, 7, 9, 10].map(netActionsForInterface);
    expect(got).toEqual([2, 2, 3, 3, 4, 4, 5]);
  });
  it('CEMK RB p.25: DV máximo de Quickhack', () => {
    expect([0, 1, 2, 3, 4, 5].map(maxQuickhackDv)).toEqual([0, 6, 8, 10, 12, 12]);
  });
  it('CEMK RB p.25: firewall del Neuroport', () => {
    expect(neuroportFirewallDv(1)).toBe(6);
    expect(neuroportFirewallDv(2)).toBe(6);
    expect(neuroportFirewallDv(3)).toBeNull();
  });
  it('CEMK RB p.26: Quickhacks según era y Neuroport', () => {
    expect(canUseQuickhacks('2045', false)).toBe(false);
    expect(canUseQuickhacks('2045', true)).toBe(true);
    expect(canUseQuickhacks('2077', undefined)).toBe(true);
    expect(canUseQuickhacks('2077', false)).toBe(false);
  });
  it('Core p.208 y CEMK RB pp. 16, 36: alcance de Jack In', () => {
    expect(jackInRangeM({})).toBe(6);
    expect(jackInRangeM({ rangeUpgrade: true })).toBe(8);
    expect(jackInRangeM({ cyberdeckPort: true })).toBe(50);
  });
  it('Core p.160: Fixer R1 2045 Everyday', () => {
    const r = fixerReach(1, '2045');
    expect(r.category).toBe('Everyday');
    expect(r.source).toBe('Core');
  });
  it('CEMK RB p.25: Fixer R1 2077 Expensive', () => {
    const r = fixerReach(1, '2077');
    expect(r.category).toBe('Expensive');
    expect(r.source).toBe('CEMK');
  });
  it('CEMK RB p.25: Fixer R4 2077 Very Expensive', () => {
    const r = fixerReach(4, '2077');
    expect(r.category).toBe('Very Expensive');
    expect(r.source).toBe('CEMK');
  });
  it('Core p.160: Fixer R5 2045 Expensive con Night Market', () => {
    const r = fixerReach(5, '2045');
    expect(r.category).toBe('Expensive');
    expect(r.nightMarket).toBe(true);
    expect(r.midnightMarket).toBe(false);
  });
  it('CEMK RB p.25: Fixer R7 2077 Luxury', () => {
    const r = fixerReach(7, '2077');
    expect(r.category).toBe('Luxury');
    expect(r.source).toBe('CEMK');
  });
  it('CEMK RB p.25: Fixer R9 2077 Super Luxury con Midnight Market', () => {
    const r = fixerReach(9, '2077');
    expect(r.category).toBe('Super Luxury');
    expect(r.source).toBe('CEMK');
    expect(r.midnightMarket).toBe(true);
  });
  it('Core p.160: Fixer R10 2045 Super Luxury', () => {
    const r = fixerReach(10, '2045');
    expect(r.category).toBe('Super Luxury');
    expect(r.source).toBe('Core');
  });
  it('Core p.197 y CEMK RB p.25: tweaks 2077 del Netrunner', () => {
    const info = getRoleRankInfo('Netrunner', 3, '2077');
    expect(info.tweaks2077.length).toBeGreaterThan(0);
    for (const t of info.tweaks2077) expect(t.fromRank === null || t.fromRank <= 3).toBe(true);
    const froms = info.tweaks2077.map(t => t.fromRank);
    expect(froms).toContain(1);
    expect(froms).toContain(2);
    expect(froms).toContain(3);
    expect(froms).toContain(null);
    expect(getRoleRankInfo('Netrunner', 3, '2045').tweaks2077).toEqual([]);
  });
  it('Core p.197: rango siguiente es null en rango 10', () => {
    expect(getRoleRankInfo('Netrunner', 10, '2045').next).toBeNull();
    expect(getRoleRankInfo('Netrunner', 3, '2045').next?.rank).toBe(4);
  });
  it('Core p.150 y CEMK Folios p.17: Speedheal', () => {
    const base = { medtechId: 'm1', patientId: 'p1', beatId: 'b1', dayKey: 'd1' };
    expect(canApplySpeedheal([base], { ...base, patientId: 'p2' }).ok).toBe(false);
    expect(canApplySpeedheal([base], { ...base, medtechId: 'm2', beatId: 'b2' }).ok).toBe(false);
    expect(canApplySpeedheal([base], { ...base, medtechId: 'm2', beatId: 'b2', dayKey: 'd2' }).ok).toBe(true);
    expect(canApplySpeedheal([], base).ok).toBe(true);
  });
  it('Core pp. 147-149: Maker puntos y validación', () => {
    expect(makerPointsTotal(4)).toBe(8);
    expect(makerPointsFree({ field: 4 }, 4)).toBe(4);
    expect(validateMakerAllocation({ field: 4 }, 4)).toEqual([]);
    expect(validateMakerAllocation({ field: 5 }, 4).length).toBeGreaterThan(0);
    expect(validateMakerAllocation({ field: 4, upgrade: 4, fabrication: 1 }, 4).length).toBeGreaterThan(0);
  });
  it('Core pp. 149-150: Medicine puntos y validación', () => {
    const a = { surgery: 2, pharmaceuticals: 1 };
    expect(medicinePointsFree(a, 4)).toBe(1);
    expect(surgeryLevel(a)).toBe(4);
    expect(medicalTechFromPharma(a)).toBe(1);
    expect(validateMedicineAllocation({ surgery: 6 }, 8).length).toBeGreaterThan(0);
  });

  it('Core p.147: getInterfaceRank Netrunner, otro rol y override', () => {
    expect(getInterfaceRank({ role: 'Netrunner', roleRank: 4 })).toBe(4);
    expect(getInterfaceRank({ role: 'Solo', roleRank: 4 })).toBe(0);
    expect(getInterfaceRank({ role: 'Solo', roleRank: 4, interfaceRankOverride: 2 })).toBe(2);
    expect(getInterfaceRank({ role: 'Netrunner', roleRank: 4, interfaceRankOverride: 1 })).toBe(1);
  });
  it('Core p.150: Medical Tech = Pharmaceuticals + Cryosystem', () => {
    expect(medicalTechLevel({ pharmaceuticals: 1, cryosystem: 2 })).toBe(3);
    expect(medicalTechLevel(undefined)).toBe(0);
  });
});
