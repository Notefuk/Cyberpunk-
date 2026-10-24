// [Claude Code · 2026-10-24] v4.9.7: mide el peso real de un movimiento de IP para justificar el tope de 2.000.
import { describe, it, expect } from 'vitest';
import type { IpLogEntry } from '../../types/cyberpunk';

describe('peso del historial de IP (v4.9.7)', () => {
  const entry: IpLogEntry = { id: 'ip-1729790000000-ab12cd', at: new Date('2026-10-24T20:00:00Z').toISOString(), kind: 'spend_skill', delta: -20, reason: 'Handgun 4 → 5', balanceAfter: 5 };

  it('un movimiento realista pesa menos de 300 bytes', () => {
    const bytes = new TextEncoder().encode(JSON.stringify(entry)).length;
    console.log(`Tamaño de un movimiento de IP: ${bytes} bytes`);
    expect(bytes).toBeLessThan(300);
  });

  it('2.000 movimientos pesan menos de 600 KB', () => {
    const bytes = new TextEncoder().encode(JSON.stringify(Array.from({ length: 2000 }, () => entry))).length;
    console.log(`Tamaño de 2.000 movimientos: ${bytes} bytes`);
    expect(bytes).toBeLessThan(600 * 1024);
  });
});
