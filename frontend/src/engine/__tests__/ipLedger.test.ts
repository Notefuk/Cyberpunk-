// Tests del resumen de IP (Core p.410). [Claude Code · 2026-10-22]
import { describe, it, expect } from 'vitest';
import { summarizeIpLog, capIpLog } from '../ipLedger';
import type { IpLogEntry } from '../../types/cyberpunk';

const e = (kind: IpLogEntry['kind'], delta: number): IpLogEntry => ({ id: kind + delta, at: '2026-10-22T00:00:00Z', kind, delta, reason: kind, balanceAfter: 0 });

describe('summarizeIpLog (Core p.410)', () => {
  it('suma un caso de cada kind', () => {
    const t = summarizeIpLog([e('initial', 100), e('award', 50), e('adjust', -10), e('spend_role', -240), e('spend_skill', -60), e('spend_martial', -40), e('gm', 0)], 7);
    expect(t).toEqual({ earned: 150, adjusted: -10, spentRole: 240, spentSkills: 60, spentMartial: 40, gmEdits: 1, available: 7 });
  });
  it('log vacío o indefinido da ceros', () => {
    expect(summarizeIpLog(undefined, 3)).toEqual({ earned: 0, adjusted: 0, spentRole: 0, spentSkills: 0, spentMartial: 0, gmEdits: 0, available: 3 });
  });
});

// [Claude Code · 2026-10-24] v4.9.7: freno del historial de IP.
describe('summarizeIpLog con totales archivados (v4.9.7)', () => {
  it('suma los totales archivados a los del log', () => {
    const t = summarizeIpLog([e('award', 10)], 5, { earned: 100, adjusted: -5, spentRole: 20, spentSkills: 30, spentMartial: 40, gmEdits: 2 });
    expect(t).toEqual({ earned: 110, adjusted: -5, spentRole: 20, spentSkills: 30, spentMartial: 40, gmEdits: 2, available: 5 });
  });
});

describe('capIpLog (v4.9.7)', () => {
  it('con 2.001 movimientos conserva los 2.000 más nuevos y archiva el más viejo sin cambiar los totales', () => {
    const kinds: IpLogEntry['kind'][] = ['award', 'spend_skill', 'spend_role', 'adjust', 'gm', 'spend_martial'];
    const full: IpLogEntry[] = Array.from({ length: 2001 }, (_, i) => ({ ...e(kinds[i % kinds.length], i % kinds.length === 0 ? 5 : -2), id: `ip-${i}` }));
    const r = capIpLog(full, undefined);
    expect(r.log).toHaveLength(2000);
    expect(r.log[0].id).toBe('ip-1');
    expect(r.log[1999].id).toBe('ip-2000');
    expect(r.archived).toHaveLength(1);
    expect(r.archived[0].id).toBe('ip-0');
    expect(summarizeIpLog(r.log, 9, r.archivedTotals)).toEqual(summarizeIpLog(full, 9));
  });
  it('con un log dentro del tope devuelve la misma referencia y nada archivado', () => {
    const log = [e('award', 1)];
    const r = capIpLog(log, undefined);
    expect(r.log).toBe(log);
    expect(r.archived).toEqual([]);
  });
});
