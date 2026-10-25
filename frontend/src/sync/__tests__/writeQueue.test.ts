// Tests de la cola de escritura. v5.0.0 (plan 17). [Claude Code · 2026-10-24]
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWriteQueue } from '../writeQueue';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('writeQueue', () => {
  it('10 touches en 1 s -> 1 flush a los 1.5 s del último', async () => {
    const flush = vi.fn(async () => {});
    const q = createWriteQueue({ wait: 1500, maxWait: 5000, flush });
    for (let i = 0; i < 10; i++) {
      q.touch('a');
      await vi.advanceTimersByTimeAsync(100);
    }
    expect(flush).toHaveBeenCalledTimes(0);
    await vi.advanceTimersByTimeAsync(1500);
    expect(flush).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(10000);
    expect(flush).toHaveBeenCalledTimes(1);
    q.dispose();
  });

  it('ráfaga de más de 6 s -> flush a los 5 s', async () => {
    const flush = vi.fn(async () => {});
    const q = createWriteQueue({ wait: 1500, maxWait: 5000, flush });
    for (let t = 0; t < 4900; t += 100) {
      q.touch('a');
      await vi.advanceTimersByTimeAsync(100);
    }
    expect(flush).toHaveBeenCalledTimes(0);
    q.touch('a');
    await vi.advanceTimersByTimeAsync(100);
    expect(flush).toHaveBeenCalledTimes(1);
    q.dispose();
  });

  it('nunca dos flush simultáneos del mismo doc', async () => {
    let active = 0;
    let maxActive = 0;
    const flush = vi.fn(async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise(r => setTimeout(r, 3000));
      active--;
    });
    const q = createWriteQueue({ wait: 1500, maxWait: 5000, flush });
    q.touch('a');
    await vi.advanceTimersByTimeAsync(1500);
    expect(flush).toHaveBeenCalledTimes(1);
    q.touch('a');
    await vi.advanceTimersByTimeAsync(1500);
    expect(flush).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(2000);
    expect(flush).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(5000);
    expect(maxActive).toBe(1);
    q.dispose();
  });

  it('flushAll vacía lo pendiente y espera', async () => {
    const flush = vi.fn(async () => {});
    const q = createWriteQueue({ wait: 1500, maxWait: 5000, flush });
    q.touch('a');
    q.touch('b');
    expect(q.pendingIds().sort()).toEqual(['a', 'b']);
    await q.flushAll();
    expect(flush).toHaveBeenCalledTimes(2);
    expect(q.pendingIds()).toEqual([]);
    q.dispose();
  });

  it('setTiming aplica a debouncers nuevos', async () => {
    const flush = vi.fn(async () => {});
    const q = createWriteQueue({ wait: 1500, maxWait: 5000, flush });
    q.touch('a');
    await q.flushAll();
    q.setTiming(5000, 10000);
    q.touch('a');
    await vi.advanceTimersByTimeAsync(4000);
    expect(flush).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1100);
    expect(flush).toHaveBeenCalledTimes(2);
    q.dispose();
  });
});
