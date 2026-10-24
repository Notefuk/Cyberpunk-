// [Claude Code · 2026-10-24] v5.0.0 (plan 16): indicador chico del modo local/nube.
import { useAuthStore } from '../sync/authStore';

interface CloudStatusChipProps {
  onClick?: () => void;
}

export function CloudStatusChip({ onClick }: CloudStatusChipProps) {
  const cloudAvailable = useAuthStore((s) => s.cloudAvailable);
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  if (!cloudAvailable) return null;

  let label = 'Local';
  let tone = 'border-slate-500/50 text-slate-300 bg-slate-500/10';
  if (status === 'connecting') {
    label = 'Conectando…';
    tone = 'border-amber-500/50 text-amber-300 bg-amber-500/10';
  } else if (status === 'cloud') {
    const first = user?.displayName?.trim().split(/\s+/)[0];
    label = first ? 'Nube · ' + first : 'Nube';
    tone = 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10';
  } else if (status === 'error') {
    label = 'Error de nube';
    tone = 'border-red-500/50 text-red-300 bg-red-500/10';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title="Modo local / nube"
      className={`ml-auto self-center shrink-0 font-mono-code text-[10px] uppercase tracking-wider px-2 py-1 border rounded-xs whitespace-nowrap cursor-pointer ${tone}`}
    >
      {label}
    </button>
  );
}
