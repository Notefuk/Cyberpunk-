// Contador local de cuota diaria de Firestore (plan gratis). v5.0.0 (plan 17). [Claude Code · 2026-10-24]
export const FREE_DAILY = { reads: 50000, writes: 20000 };
export const EXPECTED_DEVICES = 7;
export type QuotaMode = 'normal' | 'saving' | 'essential';

const STORAGE_KEY = 'cpr_quota_usage_v1';

export function pacificDayKey(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(now);
}

interface Usage { day: string; reads: number; writes: number }

export function createQuotaGuard(
  storage: { getItem(k: string): string | null; setItem(k: string, v: string): void },
  now: () => Date = () => new Date()
) {
  const load = (): Usage => {
    const day = pacificDayKey(now());
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Usage>;
        if (p && p.day === day && typeof p.reads === 'number' && typeof p.writes === 'number') {
          return { day, reads: p.reads, writes: p.writes };
        }
      }
    } catch {
      // almacenamiento no disponible o corrupto: se empieza de cero
    }
    return { day, reads: 0, writes: 0 };
  };

  const save = (u: Usage): void => {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // se ignora
    }
  };

  return {
    record(kind: 'read' | 'write', n = 1): void {
      const u = load();
      if (kind === 'read') u.reads += n;
      else u.writes += n;
      save(u);
    },
    usage(): { day: string; reads: number; writes: number } {
      return load();
    },
    mode(): QuotaMode {
      const u = load();
      const rShare = FREE_DAILY.reads / EXPECTED_DEVICES;
      const wShare = FREE_DAILY.writes / EXPECTED_DEVICES;
      const ratio = Math.max(u.reads / rShare, u.writes / wShare);
      if (ratio >= 0.9) return 'essential';
      if (ratio >= 0.6) return 'saving';
      return 'normal';
    },
  };
}
