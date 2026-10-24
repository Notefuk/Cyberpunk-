// Tests de debounce y commit diferido (v4.9.7, plan17). [Claude Code · 2026-10-24]
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCommitController } from '../useCommittedField';

describe('createCommitController', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('10 teclas a 100 ms -> un commit con el texto completo tras 1500 ms de pausa', () => {
    const commit = vi.fn();
    const c = createCommitController(commit);
    const text = 'abcdefghij';
    for (let i = 1; i <= 10; i++) { c.change(text.slice(0, i)); vi.advanceTimersByTime(100); }
    expect(commit).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1500);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith(text);
  });

  it('flush (blur/Enter) guarda ya y el timer posterior no vuelve a guardar', () => {
    const commit = vi.fn();
    const c = createCommitController(commit);
    c.change('hola');
    c.flush();
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith('hola');
    vi.advanceTimersByTime(10000);
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it('flush sin cambios pendientes no guarda', () => {
    const commit = vi.fn();
    const c = createCommitController(commit);
    c.flush();
    expect(commit).not.toHaveBeenCalled();
  });

  it('flush dos veces -> un solo commit', () => {
    const commit = vi.fn();
    const c = createCommitController(commit);
    c.change('x');
    c.flush();
    c.flush();
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it('ráfaga larga (cada 200 ms durante 6 s) guarda al menos una vez a los 5000 ms', () => {
    const commit = vi.fn();
    const c = createCommitController(commit);
    for (let t = 0; t < 5000; t += 200) { c.change('v' + t); vi.advanceTimersByTime(200); }
    expect(commit.mock.calls.length).toBeGreaterThanOrEqual(1);
    for (let t = 5000; t < 6000; t += 200) { c.change('v' + t); vi.advanceTimersByTime(200); }
  });

  it('isDirty transiciona', () => {
    const c = createCommitController(vi.fn());
    expect(c.isDirty()).toBe(false);
    c.change('a');
    expect(c.isDirty()).toBe(true);
    vi.advanceTimersByTime(1500);
    expect(c.isDirty()).toBe(false);
    c.change('b');
    c.flush();
    expect(c.isDirty()).toBe(false);
  });
});
