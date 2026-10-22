// Tests del resumen de IP (Core p.410). [Claude Code · 2026-10-22]
import { describe, it, expect } from 'vitest';
import { summarizeIpLog } from '../ipLedger';
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
