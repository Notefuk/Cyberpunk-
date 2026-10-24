// Tests de debounce y commit diferido (v4.9.7, plan17). [Claude Code · 2026-10-24]
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('10 llamadas rápidas -> una sola con los últimos args', () => {
    const fn = vi.fn();
    const d = debounce(fn, 1500);
    for (let i = 0; i < 10; i++) { d(i); vi.advanceTimersByTime(100); }
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1500);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(9);
  });

  it('flush ejecuta ya con los últimos args', () => {
    const fn = vi.fn();
    const d = debounce(fn, 1500);
    d('a'); d('b');
    d.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
    vi.advanceTimersByTime(10000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancel evita la llamada', () => {
    const fn = vi.fn();
    const d = debounce(fn, 1500);
    d('a');
    d.cancel();
    vi.advanceTimersByTime(10000);
    expect(fn).not.toHaveBeenCalled();
  });

  it('maxWait dispara a los 5000 ms aunque sigan llegando llamadas', () => {
    const fn = vi.fn();
    const d = debounce(fn, 1500, { maxWait: 5000 });
    let t = 0;
    while (t < 4900) { d(t); vi.advanceTimersByTime(100); t += 100; }
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('pending refleja el estado', () => {
    const d = debounce(vi.fn(), 1500);
    expect(d.pending()).toBe(false);
    d();
    expect(d.pending()).toBe(true);
    vi.advanceTimersByTime(1500);
    expect(d.pending()).toBe(false);
  });
});
