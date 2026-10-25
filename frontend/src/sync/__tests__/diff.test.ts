// Tests de diff/merge. v5.0.0 (plan 16/17). [Claude Code · 2026-10-24]
import { describe, expect, it } from 'vitest';
import { applyChanges, deepEqual, diffDocs, mergeRemote } from '../diff';

const COUNTERS = [['currentHp'], ['headArmor', 'currentSp']];

describe('diffDocs', () => {
  it('set anidado', () => {
    const ch = diffDocs({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 3 } });
    expect(ch).toEqual([{ kind: 'set', path: ['a', 'c'], value: 3 }]);
  });
  it('delete y set de clave nueva', () => {
    const ch = diffDocs({ a: 1, b: 2 }, { b: 2, c: 3 });
    expect(ch).toEqual([
      { kind: 'delete', path: ['a'] },
      { kind: 'set', path: ['c'], value: 3 },
    ]);
  });
  it('arrays van enteros', () => {
    const ch = diffDocs({ l: [1, 2] }, { l: [1, 2, 3] });
    expect(ch).toEqual([{ kind: 'set', path: ['l'], value: [1, 2, 3] }]);
    expect(diffDocs({ l: [1, 2] }, { l: [1, 2] })).toEqual([]);
  });
  it('contadores como increment', () => {
    const ch = diffDocs({ currentHp: 30, headArmor: { currentSp: 7 } }, { currentHp: 25, headArmor: { currentSp: 7 } }, COUNTERS);
    expect(ch).toEqual([{ kind: 'increment', path: ['currentHp'], delta: -5 }]);
    const ch2 = diffDocs({ headArmor: { currentSp: 7 } }, { headArmor: { currentSp: 5 } }, COUNTERS);
    expect(ch2).toEqual([{ kind: 'increment', path: ['headArmor', 'currentSp'], delta: -2 }]);
  });
  it('sin contador, el número va como set', () => {
    expect(diffDocs({ currentHp: 3 }, { currentHp: 2 })).toEqual([{ kind: 'set', path: ['currentHp'], value: 2 }]);
  });
});

describe('applyChanges', () => {
  it('crea objetos intermedios y no muta la entrada', () => {
    const doc = { x: 1 };
    const out = applyChanges(doc, [{ kind: 'set', path: ['a', 'b', 'c'], value: 9 }]);
    expect(out).toEqual({ x: 1, a: { b: { c: 9 } } });
    expect(doc).toEqual({ x: 1 });
  });
  it('increment suma y trata ausente como 0; delete borra', () => {
    const out = applyChanges({ hp: 10, z: 1 }, [
      { kind: 'increment', path: ['hp'], delta: -3 },
      { kind: 'increment', path: ['n', 'm'], delta: 2 },
      { kind: 'delete', path: ['z'] },
    ]);
    expect(out).toEqual({ hp: 7, n: { m: 2 } });
  });
});

describe('mergeRemote', () => {
  it('conserva edición local pendiente y toma la remota de otro campo', () => {
    const base = { handle: 'A', role: 'Solo', currentHp: 30 };
    const local = { handle: 'B', role: 'Solo', currentHp: 30 };
    const remote = { handle: 'A', role: 'Netrunner', currentHp: 30 };
    expect(mergeRemote(base, local, remote, COUNTERS)).toEqual({ handle: 'B', role: 'Netrunner', currentHp: 30 });
  });
  it('contadores suman: base 30, local 25, remoto 20 -> 15', () => {
    expect(mergeRemote({ currentHp: 30 }, { currentHp: 25 }, { currentHp: 20 }, COUNTERS)).toEqual({ currentHp: 15 });
  });
});

describe('deepEqual', () => {
  it('compara estructuras', () => {
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual([1], [1, 2])).toBe(false);
  });
});
