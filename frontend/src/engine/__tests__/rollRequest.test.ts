// [Claude Code · 2026-11-12] v5.23.0 (plan 28): pedidos de tirada del GM.
import { describe, it, expect } from 'vitest';
import { resolveRollRequest, skillStat, woundActionPenalty, newRollRequest, parseRollRequest, describeResult, requestSucceeded, sortRequests } from '../rollRequest';
import type { CharacterSheet } from '../../types/cyberpunk';

const seq = (...vals: number[]) => {
  let i = 0;
  return () => vals[i++ % vals.length];
};
// rng 0.6 → d10 7.
const sheet = (over: Partial<CharacterSheet> = {}) =>
  ({ stats: { INT: 6, REF: 7, DEX: 5, TECH: 4, COOL: 5, WILL: 6, LUCK: 5, MOVE: 5, BODY: 6, EMP: 5 }, skills: { perception: 5 }, currentHp: 40, ...over }) as unknown as CharacterSheet;

describe('pedir tirada (Core p.130, p.187)', () => {
  it('la skill sale con su STAT del Core (pp.81-85)', () => {
    expect(skillStat('Perception')).toBe('INT');
    expect(skillStat('Stealth')).toBe('DEX');
    expect(skillStat('Inventada')).toBeNull();
  });

  it('STAT + skill + 1d10', () => {
    const r = resolveRollRequest(sheet(), 'Perception', seq(0.6));
    expect(r).toEqual({ total: 6 + 5 + 7, d10: 7, stat: 'INT', statVal: 6, skillVal: 5, penalty: 0 });
  });

  it('el 10 explota y el 1 resta (CEMK p.5)', () => {
    expect(resolveRollRequest(sheet(), 'Perception', seq(0.95, 0.3)).d10).toBe(14);
    expect(resolveRollRequest(sheet(), 'Perception', seq(0.0, 0.3)).d10).toBe(-3);
  });

  it('Seriously Wounded -2 y Mortally Wounded -4 (Core p.187)', () => {
    expect(woundActionPenalty(40, 40)).toBe(0);
    expect(woundActionPenalty(19, 40)).toBe(-2);
    expect(woundActionPenalty(0, 40)).toBe(-4);
    // BODY 6 + WILL 6 → 40 HP; con 10 HP está Seriously Wounded.
    expect(resolveRollRequest(sheet({ currentHp: 10 }), 'Perception', seq(0.6)).penalty).toBe(-2);
  });

  it('supera el DV, no lo iguala (CEMK p.5)', () => {
    const req = newRollRequest({ targetCharId: 'c1', targetUid: 'alice', targetHandle: 'Vex', skill: 'Perception', dv: 18 }, 'gm');
    expect(requestSucceeded(req)).toBeNull();
    const done = { ...req, status: 'done' as const, result: { total: 18, d10: 7, stat: 'INT', statVal: 6, skillVal: 5, penalty: 0 } };
    expect(requestSucceeded(done)).toBe(false);
    expect(describeResult(done)).toBe('INT 6 + Perception 5 + d10 7 = 18 vs DV 18: falla');
    expect(requestSucceeded({ ...done, dv: 17 })).toBe(true);
  });

  it('el pedido se recorta a lo que aceptan las reglas y se lee de vuelta', () => {
    const req = newRollRequest({ targetCharId: 'c1', targetUid: 'alice', targetHandle: 'Vex', skill: 'Perception', dv: 99, note: 'x'.repeat(300) }, 'gm');
    expect(req.dv).toBe(60);
    expect(req.note.length).toBe(200);
    expect(req.status).toBe('pending');
    expect(parseRollRequest({ ...req, at: 5 })).toEqual({ ...req, at: 5 });
    expect(parseRollRequest({ id: 'x' })).toBeNull();
    expect(sortRequests([{ ...req, id: 'a', at: 1 }, { ...req, id: 'b', at: 3 }, { ...req, id: 'c' }]).map((r) => r.id)).toEqual(['c', 'b', 'a']);
  });
});
