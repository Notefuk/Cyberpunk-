// [Claude Code · 2026-10-30] v5.9.1: recordatorio de negativos por Heridas Críticas (Core pp.187-188, p.223).
import { describe, expect, it } from 'vitest';
import { summarizeInjuryPenalties } from '../injuryPenalties';
import type { ActiveCriticalInjury, InjuryModifier } from '../../types/cyberpunk';

const inj = (id: string, name: string, modifiers: InjuryModifier, isTreated = false, effect = 'efecto'): ActiveCriticalInjury => ({
  id, name, location: 'head', effect, quickFixDv: '', treatmentDv: '', iconType: 'brain', modifiers, isTreated
});

describe('summarizeInjuryPenalties', () => {
  it('suma los −2 a todo de Concussion y Brain Injury y dice de dónde salen', () => {
    const r = summarizeInjuryPenalties([
      inj('a', 'Conmoción Cerebral (Concussion)', { allActionsPenalty: 2 }),
      inj('b', 'Trauma Cerebral (Brain Injury)', { allActionsPenalty: 2, bonusDeathSavePenalty: 1 })
    ]);
    expect(r.allActions).toBe(4);
    expect(r.lines[0]).toEqual({ text: '−4 a todas las acciones', sources: ['Conmoción Cerebral', 'Trauma Cerebral'] });
    expect(r.lines[1].text).toBe('+1 al Death Save Penalty');
  });

  it('una herida con Quick Fix o tratada no cuenta (Core p.223)', () => {
    const r = summarizeInjuryPenalties([inj('a', 'Conmoción Cerebral (Concussion)', { allActionsPenalty: 2 }, true)]);
    expect(r).toEqual({ activeCount: 0, allActions: 0, lines: [], situational: [] });
  });

  it('las heridas sin número fijo van como efecto aparte', () => {
    const r = summarizeInjuryPenalties([
      inj('a', 'Mandíbula Rota (Broken Jaw)', {}, false, '−4 a las acciones que usen el habla.'),
      inj('b', 'Ojo Perdido (Lost Eye)', { rangedAttackPenalty: 4, bonusDeathSavePenalty: 1 })
    ]);
    expect(r.situational).toEqual([{ name: 'Mandíbula Rota', effect: '−4 a las acciones que usen el habla.' }]);
    expect(r.lines.map((l) => l.text)).toEqual(['−4 a ataques a distancia y a Perception con la vista', '+1 al Death Save Penalty']);
  });
});
