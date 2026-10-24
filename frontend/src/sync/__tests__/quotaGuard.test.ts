// Tests del guardián de cuota. v5.0.0 (plan 17). [Claude Code · 2026-10-24]
import { describe, expect, it } from 'vitest';
import { EXPECTED_DEVICES, FREE_DAILY, createQuotaGuard, pacificDayKey } from '../quotaGuard';

function memStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => { m.set(k, v); },
  };
}

describe('quotaGuard', () => {
  it('pacificDayKey usa hora del Pacífico', () => {
    expect(pacificDayKey(new Date('2026-10-24T06:59:00Z'))).toBe('2026-10-23');
    expect(pacificDayKey(new Date('2026-10-24T07:01:00Z'))).toBe('2026-10-24');
  });

  it('reinicia al cruzar la medianoche del Pacífico', () => {
    let t = new Date('2026-10-24T06:59:00Z');
    const g = createQuotaGuard(memStorage(), () => t);
    g.record('read', 10);
    g.record('write', 2);
    expect(g.usage()).toEqual({ day: '2026-10-23', reads: 10, writes: 2 });
    t = new Date('2026-10-24T07:01:00Z');
    expect(g.usage()).toEqual({ day: '2026-10-24', reads: 0, writes: 0 });
  });

  it('modos al 59 / 60 / 90 % de la cuota del dispositivo', () => {
    const share = FREE_DAILY.reads / EXPECTED_DEVICES;
    const g = createQuotaGuard(memStorage());
    g.record('read', Math.floor(share * 0.59));
    expect(g.mode()).toBe('normal');
    g.record('read', Math.ceil(share * 0.6) - Math.floor(share * 0.59));
    expect(g.mode()).toBe('saving');
    g.record('read', Math.ceil(share * 0.9) - Math.ceil(share * 0.6));
    expect(g.mode()).toBe('essential');
  });

  it('las escrituras también cuentan', () => {
    const share = FREE_DAILY.writes / EXPECTED_DEVICES;
    const g = createQuotaGuard(memStorage());
    g.record('write', Math.ceil(share * 0.6));
    expect(g.mode()).toBe('saving');
  });

  it('un storage que lanza no rompe', () => {
    const bad = {
      getItem: () => { throw new Error('x'); },
      setItem: () => { throw new Error('x'); },
    };
    const g = createQuotaGuard(bad);
    expect(() => g.record('read', 1)).not.toThrow();
    expect(() => g.usage()).not.toThrow();
    expect(g.mode()).toBe('normal');
  });
});
