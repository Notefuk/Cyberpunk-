// [Claude Code · 2026-11-13] v5.32.0 (plan 31): "Did Someone Say Murder?", Interface RED Vol. 5 pp.61-70.
import { describe, expect, it } from 'vitest';
import { CLUE_TYPES, MYSTERY_COMPLEXITY, OBSTACLE_TYPES, SAMPLE_MYSTERIES } from '../../data/mysteryData';
import { applyEvidence, currentFocus, deductionCheck, evidenceCheck, focusRecovery, maxFocus, mysteryFromTemplate, obstacleFocusDamage, parseMysteries } from '../mystery';

const low = () => 0; // cada dado sale 1
const high = () => 0.99; // cada dado sale el máximo

describe('Focus (IR5 p.63)', () => {
  it('coincide con toda la tabla INT × WILL', () => {
    const table: Record<number, number[]> = {
      2: [20, 25, 25, 30, 30, 35, 35, 40, 40],
      5: [30, 30, 35, 35, 40, 40, 45, 45, 50],
      10: [40, 45, 45, 50, 50, 55, 55, 60, 60],
    };
    for (const [int, row] of Object.entries(table)) row.forEach((v, i) => expect(maxFocus(Number(int), i + 2), `INT ${int} WILL ${i + 2}`).toBe(v));
  });

  it('sin el campo, está lleno; nunca pasa del máximo', () => {
    expect(currentFocus({ stats: { INT: 6, WILL: 6 } })).toBe(40);
    expect(currentFocus({ focus: 99, stats: { INT: 6, WILL: 6 } })).toBe(40);
    expect(currentFocus({ focus: 12, stats: { INT: 6, WILL: 6 } })).toBe(12);
  });

  it('descanso: INT + WILL, +5 con Concentration', () => {
    expect(focusRecovery(6, 7, false)).toBe(13);
    expect(focusRecovery(6, 7, true)).toBe(18);
  });
});

describe('Misterios (IR5 pp.64-67)', () => {
  it('5 niveles de Complexity, 12 tipos de pista y 13 obstáculos más el Ticking Clock', () => {
    expect(MYSTERY_COMPLEXITY.map((c) => c.value)).toEqual([25, 50, 100, 150, 200]);
    expect(CLUE_TYPES).toHaveLength(12);
    expect(OBSTACLE_TYPES).toHaveLength(14);
  });

  it('Evidence Check que sale: daño menos Obfuscation, sin bajar de 0', () => {
    const m = mysteryFromTemplate(SAMPLE_MYSTERIES[1]);
    const digital = m.clues[0]; // 4d6, Obfuscation 4
    const ok = evidenceCheck(digital, 13, 5, high);
    expect(ok).toMatchObject({ success: true, rolledDamage: 24, complexityDamage: 20, focusDamage: 0 });
    const weak = evidenceCheck(digital, 20, 5, low);
    expect(weak.complexityDamage).toBe(0);
    const next = applyEvidence(m, digital.id, ok, 'Rogue');
    expect(next.complexity).toBe(30);
    expect(next.clues[0].collected).toBe(true);
  });

  it('Evidence Check que falla: Focus de la pista; con 1 natural es pifia', () => {
    const clue = { id: 'c', type: 'Autopsy', skill: 'Paramedic', dv: 15, damage: '4d6', obfuscation: 0, focusDamage: '3d6', text: '', fumble: 'El cuerpo se daña.' };
    const r = evidenceCheck(clue, 14, 1, high);
    expect(r).toMatchObject({ success: false, fumble: true, focusDamage: 18, complexityDamage: 0 });
    expect(r.text).toMatch(/cuerpo se daña/);
    expect(evidenceCheck(clue, 14, 4, high).fumble).toBe(false);
  });

  it('la Complexity no baja de 0', () => {
    const m = { ...mysteryFromTemplate(SAMPLE_MYSTERIES[0]), complexity: 3 };
    const r = evidenceCheck(m.clues[1], 20, 7, high);
    expect(applyEvidence(m, m.clues[1].id, r, 'X').complexity).toBe(0);
  });

  it('obstáculos y deducción cuestan Focus (p.66)', () => {
    expect(obstacleFocusDamage(true, high)).toBe(6);
    expect(obstacleFocusDamage(false, high)).toBe(12);
    expect(deductionCheck(15, low)).toEqual({ success: true, focusDamage: 1 });
    expect(deductionCheck(14, low).success).toBe(false);
  });

  it('ejemplos del libro (pp.69-70) y lectura de lo guardado', () => {
    expect(SAMPLE_MYSTERIES.map((m) => [m.complexity, m.clues.length, m.obstacles.length])).toEqual([
      [25, 6, 0],
      [50, 8, 6],
    ]);
    expect(mysteryFromTemplate(SAMPLE_MYSTERIES[1]).clues[0].fumble).toMatch(/Destroyed/);
    expect(parseMysteries([{ id: 'm1', clues: [] }, 'basura', null])).toHaveLength(1);
    expect(parseMysteries('x')).toEqual([]);
  });
});
