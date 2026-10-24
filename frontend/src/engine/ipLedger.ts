// Resumen puro del historial de IP (Core p.410: costos de avance). [Claude Code · 2026-10-22]
import type { IpLogEntry, IpArchivedTotals } from '../types/cyberpunk';

export interface IpTotals { earned: number; adjusted: number; spentRole: number; spentSkills: number; spentMartial: number; gmEdits: number; available: number }

// v4.9.7 [Claude Code · 2026-10-24]: freno lejano al historial de IP; lo más viejo pasa a la copia de seguridad.
export const IP_LOG_MAX = 2000;

export function summarizeIpLog(log: IpLogEntry[] | undefined, available: number, archived?: IpArchivedTotals): IpTotals {
  const sum = (kinds: IpLogEntry['kind'][]) => (log ?? []).filter(e => kinds.includes(e.kind)).reduce((s, e) => s + e.delta, 0);
  return {
    earned: sum(['initial', 'award']) + (archived?.earned ?? 0),
    adjusted: sum(['adjust']) + (archived?.adjusted ?? 0),
    spentRole: Math.abs(sum(['spend_role'])) + (archived?.spentRole ?? 0),
    spentSkills: Math.abs(sum(['spend_skill'])) + (archived?.spentSkills ?? 0),
    spentMartial: Math.abs(sum(['spend_martial'])) + (archived?.spentMartial ?? 0),
    gmEdits: (log ?? []).filter(e => e.kind === 'gm').length + (archived?.gmEdits ?? 0),
    available,
  };
}

// v4.9.7 [Claude Code · 2026-10-24]: los movimientos van del más viejo al más nuevo; se archivan los primeros.
export function capIpLog(
  log: IpLogEntry[],
  archivedTotals: IpArchivedTotals | undefined,
  max: number = IP_LOG_MAX,
): { log: IpLogEntry[]; archived: IpLogEntry[]; archivedTotals: IpArchivedTotals | undefined } {
  if (log.length <= max) return { log, archived: [], archivedTotals };
  const archived = log.slice(0, log.length - max);
  const kept = log.slice(log.length - max);
  const t = summarizeIpLog(archived, 0);
  const prev = archivedTotals;
  return {
    log: kept,
    archived,
    archivedTotals: {
      earned: (prev?.earned ?? 0) + t.earned,
      adjusted: (prev?.adjusted ?? 0) + t.adjusted,
      spentRole: (prev?.spentRole ?? 0) + t.spentRole,
      spentSkills: (prev?.spentSkills ?? 0) + t.spentSkills,
      spentMartial: (prev?.spentMartial ?? 0) + t.spentMartial,
      gmEdits: (prev?.gmEdits ?? 0) + t.gmEdits,
    },
  };
}
