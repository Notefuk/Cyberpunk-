// Resumen puro del historial de IP (Core p.410: costos de avance). [Claude Code · 2026-10-22]
import type { IpLogEntry } from '../types/cyberpunk';

export interface IpTotals { earned: number; adjusted: number; spentRole: number; spentSkills: number; spentMartial: number; gmEdits: number; available: number }

export function summarizeIpLog(log: IpLogEntry[] | undefined, available: number): IpTotals {
  const sum = (kinds: IpLogEntry['kind'][]) => (log ?? []).filter(e => kinds.includes(e.kind)).reduce((s, e) => s + e.delta, 0);
  return {
    earned: sum(['initial', 'award']),
    adjusted: sum(['adjust']),
    spentRole: Math.abs(sum(['spend_role'])),
    spentSkills: Math.abs(sum(['spend_skill'])),
    spentMartial: Math.abs(sum(['spend_martial'])),
    gmEdits: (log ?? []).filter(e => e.kind === 'gm').length,
    available,
  };
}
