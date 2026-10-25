// [Claude Code · 2026-10-24] v5.0.0 (plan 18): tests del resumen de party.
import { describe, it, expect } from 'vitest';
import { buildPartySummary, sameSummary, parsePartySummary } from '../partySummary';
import { calculateMaxHp, getEffectiveBody } from '../../engine/characterEngine';
import type { CharacterSheet } from '../../types/cyberpunk';

const mkSheet = (over: Record<string, unknown> = {}): CharacterSheet =>
  ({
    handle: 'Vex',
    role: 'Solo',
    stats: { BODY: 6, WILL: 6 },
    currentHp: 40,
    headArmor: { currentSp: 7, maxSp: 11 },
    bodyArmor: { currentSp: 9, maxSp: 11 },
    activeInjuries: [{ name: 'Brazo roto' }, { name: 'Ojo dañado' }],
    installedCyberwareIds: [],
    ...over,
  }) as unknown as CharacterSheet;

describe('buildPartySummary', () => {
  it('maxHp coincide con el motor y woundState sigue el HP', () => {
    const base = mkSheet();
    const max = calculateMaxHp(getEffectiveBody(base), 6);
    const at = (hp: number) => buildPartySummary(mkSheet({ currentHp: hp }), 'u1', 'Ana');
    expect(at(max).maxHp).toBe(max);
    expect(at(max).woundState).toBe('none');
    expect(at(max - 1).woundState).toBe('light');
    expect(at(Math.ceil(max / 2) - 1).woundState).toBe('serious');
    expect(at(0).woundState).toBe('mortal');
  });
  it('lista los nombres de las heridas y copia armadura', () => {
    const s = buildPartySummary(mkSheet(), 'u1', 'Ana');
    expect(s.injuries).toEqual(['Brazo roto', 'Ojo dañado']);
    expect([s.headSp, s.headSpMax, s.bodySp, s.bodySpMax]).toEqual([7, 11, 9, 11]);
  });
});

describe('sameSummary', () => {
  it('compara campos', () => {
    const a = buildPartySummary(mkSheet(), 'u1', 'Ana');
    expect(sameSummary(a, buildPartySummary(mkSheet(), 'u1', 'Ana'))).toBe(true);
    expect(sameSummary(a, buildPartySummary(mkSheet({ currentHp: 30 }), 'u1', 'Ana'))).toBe(false);
    expect(sameSummary(a, buildPartySummary(mkSheet({ activeInjuries: [{ name: 'Brazo roto' }, { name: 'Otra' }] }), 'u1', 'Ana'))).toBe(false);
  });
  it('maneja null', () => {
    const a = buildPartySummary(mkSheet(), 'u1', 'Ana');
    expect(sameSummary(null, null)).toBe(true);
    expect(sameSummary(null, a)).toBe(false);
  });
});

describe('parsePartySummary', () => {
  it('devuelve null si falta ownerUid', () => {
    expect(parsePartySummary({ handle: 'x', currentHp: 1, maxHp: 2 })).toBeNull();
  });
  it('round-trip', () => {
    const a = buildPartySummary(mkSheet(), 'u1', 'Ana');
    const back = parsePartySummary({ ...a, extra: 1 } as unknown as Record<string, unknown>);
    expect(sameSummary(a, back)).toBe(true);
  });
});
