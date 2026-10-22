import { describe, it, expect } from 'vitest';
import {
  applyDamageDeflection, spotWeaknessBonus, initiativeBonus, threatDetectionBonus,
  fumbleRecoveryIgnores, rollInitiative, rollPerception,
} from '../combatAwareness';
import type { SoloCombatAwarenessAllocation } from '../../types/cyberpunk';

const alloc: SoloCombatAwarenessAllocation = {
  fumbleRecovery: true, damageDeflection: 2, initiativeReaction: 4, precisionAttack: 0, spotWeakness: 1, threatDetection: 3,
};

describe('combatAwareness', () => {
  it('Core p.146: Damage Deflection reduce el primer daño del Round', () => {
    expect(applyDamageDeflection(7, alloc, true)).toEqual({ damage: 5, reduced: 2 });
  });
  it('Core p.146: Damage Deflection no actúa en el segundo daño ni baja de 0', () => {
    expect(applyDamageDeflection(7, alloc, false)).toEqual({ damage: 7, reduced: 0 });
    expect(applyDamageDeflection(1, alloc, true)).toEqual({ damage: 0, reduced: 1 });
    expect(applyDamageDeflection(5, undefined, true)).toEqual({ damage: 5, reduced: 0 });
  });
  it('Core p.146: Spot Weakness solo en el primer ataque exitoso', () => {
    expect(spotWeaknessBonus(alloc, true)).toBe(1);
    expect(spotWeaknessBonus(alloc, false)).toBe(0);
  });
  it('Core p.146: bonos de Iniciativa y Threat Detection', () => {
    expect(initiativeBonus(alloc)).toBe(4);
    expect(threatDetectionBonus(alloc)).toBe(3);
    expect(initiativeBonus(undefined)).toBe(0);
  });
  it('Core p.146: Fumble Recovery ignora un 1 natural', () => {
    expect(fumbleRecoveryIgnores(alloc, 1)).toBe(true);
    expect(fumbleRecoveryIgnores(alloc, 2)).toBe(false);
    expect(fumbleRecoveryIgnores({ ...alloc, fumbleRecovery: false }, 1)).toBe(false);
  });
  it('Core p.126 y p.146: Iniciativa = REF + d10 + Initiative Reaction', () => {
    const r = rollInitiative(7, alloc, () => 0.5);
    expect(r.natural).toBe(6);
    expect(r.total).toBe(17);
  });
  it('Core p.82 y p.146: Perception = INT + skill + d10 + Threat Detection', () => {
    const r = rollPerception(6, 4, alloc, () => 0.5);
    expect(r.natural).toBe(6);
    expect(r.total).toBe(19);
  });
});
