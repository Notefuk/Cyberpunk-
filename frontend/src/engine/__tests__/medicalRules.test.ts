import { describe, it, expect } from 'vitest';
import {
  parseTreatmentText, getTreatmentOptions, stabilizationDv, woundStateForStabilization,
  canMedicUseSkill, canSelfApply, rollMedicalCheck, SYNTHESIS_DV, SYNTHESIS_MATERIALS_EB,
  synthesisDoses, canSynthesize, rollCemkCriticalInjury, QUICK_FIX_NOTE,
} from '../medicalRules';

describe('medicalRules', () => {
  it('Core pp. 187-188: parsea "Paramedic DV 15 o Surgery DV 13"', () => {
    expect(parseTreatmentText('Paramedic DV 15 o Surgery DV 13')).toEqual({
      options: [{ skill: 'Paramedic', dv: 15 }, { skill: 'Surgery', dv: 13 }], removesPermanently: false,
    });
  });
  it('Core pp. 187-188: parsea "First Aid o Paramedic DV 13" con el mismo DV', () => {
    expect(parseTreatmentText('First Aid o Paramedic DV 13').options).toEqual([
      { skill: 'First Aid', dv: 13 }, { skill: 'Paramedic', dv: 13 },
    ]);
  });
  it('Core pp. 187-188: "N/A" no tiene opciones', () => {
    expect(parseTreatmentText('N/A')).toEqual({ options: [], removesPermanently: false });
  });
  it('Core pp. 187-188: el Quick Fix que elimina el efecto de forma permanente', () => {
    expect(parseTreatmentText('El Quick Fix elimina el efecto de forma permanente')).toEqual({ options: [], removesPermanently: true });
  });
  it('Core pp. 187-188: Broken Arm (Core) usa las cadenas del Core', () => {
    const t = getTreatmentOptions({ name: 'Brazo Roto (Broken Arm)', quickFixDv: 'Paramedic DV 13', treatmentDv: 'Surgery DV 15', table: 'core' });
    expect(t.quickFix).toEqual([{ skill: 'Paramedic', dv: 13 }]);
    expect(t.treatment).toEqual([{ skill: 'Surgery', dv: 15 }]);
    expect(t.quickFixPermanent).toBe(false);
  });
  it('CEMK RB p.13: Broken Arm (CEMK) sale de la tabla CEMK', () => {
    const t = getTreatmentOptions({ name: 'Broken Arm', quickFixDv: 'x', treatmentDv: 'y', table: 'cemk' });
    expect(t.quickFix.length + t.treatment.length).toBeGreaterThan(0);
    expect(t.quickFix.every(o => typeof o.dv === 'number')).toBe(true);
  });
  it('Core p.222 / CEMK RB p.14: DV de estabilización 10/13/15', () => {
    expect(stabilizationDv('light')).toBe(10);
    expect(stabilizationDv('serious')).toBe(13);
    expect(stabilizationDv('mortal')).toBe(15);
  });
  it('Core p.222: estados de herida para estabilizar', () => {
    expect(woundStateForStabilization(40, 40, 20)).toBe('none');
    expect(woundStateForStabilization(30, 40, 20)).toBe('light');
    expect(woundStateForStabilization(20, 40, 20)).toBe('light');
    expect(woundStateForStabilization(19, 40, 20)).toBe('serious');
    expect(woundStateForStabilization(0, 40, 20)).toBe('mortal');
  });
  it('Core p.223 / CEMK RB pp. 13-14: Surgery bloqueado para no Medtech', () => {
    expect(canMedicUseSkill('Surgery', 'Solo').ok).toBe(false);
    expect(canMedicUseSkill('Surgery', 'Medtech').ok).toBe(true);
    expect(canMedicUseSkill('Paramedic', 'Solo').ok).toBe(true);
  });
  it('Core p.223 / CEMK RB p.14: Treatment no se aplica a uno mismo', () => {
    expect(canSelfApply('treatment')).toBe(false);
    expect(canSelfApply('quickFix')).toBe(true);
    expect(canSelfApply('stabilize')).toBe(true);
    expect(QUICK_FIX_NOTE.core).toContain('Core p.223');
  });
  it('Core p.130: tirada médica contra DV con rng fijo (d10 = 6)', () => {
    const r = rollMedicalCheck({ tech: 6, skillLevel: 4, dv: 15, rng: () => 0.5 });
    expect(r.natural).toBe(6);
    expect(r.total).toBe(16);
    expect(r.success).toBe(true);
    expect(rollMedicalCheck({ tech: 6, skillLevel: 3, dv: 15, rng: () => 0.5 }).success).toBe(false);
  });
  it('Core pp. 149-150: síntesis da dosis = nivel de Medical Tech, DV 13 y 200 eb', () => {
    expect(SYNTHESIS_DV).toBe(13);
    expect(SYNTHESIS_MATERIALS_EB).toBe(200);
    expect(synthesisDoses(3)).toBe(3);
  });
  it('Core p.150: un no Medtech no sintetiza', () => {
    expect(canSynthesize({ role: 'Tech', knownPharmaceuticals: ['Antibiotic'], drug: 'Antibiotic' }).ok).toBe(false);
  });
  it('Core p.150: un fármaco no conocido no se sintetiza', () => {
    expect(canSynthesize({ role: 'Medtech', knownPharmaceuticals: ['Antibiotic'], drug: 'Speedheal' }).ok).toBe(false);
    expect(canSynthesize({ role: 'Medtech', knownPharmaceuticals: ['Antibiotic'], drug: 'Antibiotic' }).ok).toBe(true);
    expect(canSynthesize({ role: 'Medtech', knownPharmaceuticals: undefined, drug: 'Antibiotic' }).ok).toBe(false);
  });
  it('CEMK RB p.13: 1d6 con rng fijo y sin repetir lesiones', () => {
    const first = rollCemkCriticalInjury('body', [], () => 0);
    expect(first.roll).toBe(1);
    // rng alterna: 0 (tira 1, ya la sufre) y luego 0.5 (tira 4)
    const seq = [0, 0.5];
    let i = 0;
    const second = rollCemkCriticalInjury('body', [first.name], () => seq[Math.min(i++, seq.length - 1)]);
    expect(second.name).not.toBe(first.name);
    expect(second.roll).toBe(4);
  });
});
