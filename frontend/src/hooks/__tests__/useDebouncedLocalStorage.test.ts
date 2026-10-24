// Tests de la escritura agrupada a localStorage (v4.9.7, plan17). [Claude Code · 2026-10-24]
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStorageWriter } from '../useDebouncedLocalStorage';

describe('createStorageWriter', () => {
  const setItem = vi.fn();

  beforeEach(() => {
    setItem.mockReset();
    vi.stubGlobal('localStorage', { setItem, getItem: vi.fn() });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('agrupa 10 escrituras en 1 s y guarda solo la última tras 1500 ms', () => {
    const w = createStorageWriter('k');
    for (let i = 1; i <= 10; i++) {
      w.write('v' + i);
      vi.advanceTimersByTime(100);
    }
    expect(setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1500);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith('k', 'v10');
  });

  it('flush() guarda de inmediato', () => {
    const w = createStorageWriter('k');
    w.write('x');
    w.flush();
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith('k', 'x');
  });

  it('si setItem lanza, el writer no propaga el error', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    setItem.mockImplementation(() => {
      throw new Error('cuota');
    });
    const w = createStorageWriter('k');
    w.write('x');
    expect(() => w.flush()).not.toThrow();
    err.mockRestore();
  });
});
