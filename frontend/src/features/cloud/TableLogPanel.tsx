// v5.1.0 [Claude Code · 2026-10-27]: log de tiradas de la mesa activa (plan 19, punto 4).
import React from 'react';
import { ScrollText } from 'lucide-react';
import { useTableLog, type TableLogKind } from '../../sync/tableLog';

const KIND: Record<TableLogKind, { icon: string; cls: string }> = {
  attack: { icon: '🎯', cls: 'text-cyan-300' },
  damage: { icon: '💥', cls: 'text-orange-300' },
  skill: { icon: '🎲', cls: 'text-slate-200' },
  initiative: { icon: '⏱️', cls: 'text-emerald-300' },
  deathSave: { icon: '☠️', cls: 'text-red-300' }
};

export const TableLogPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const entries = useTableLog((s) => s.entries);
  const shown = compact ? entries.slice(0, 5) : entries;
  if (compact && shown.length === 0) return null;

  return (
    <div className={`chamfer-card bg-slate-900/70 border border-slate-700 min-w-0 ${compact ? 'p-2' : 'p-3'} space-y-1.5`}>
      <div className="flex items-center gap-2">
        <ScrollText className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span className="font-tech text-[11px] uppercase tracking-wider text-amber-200">Log de la mesa</span>
        <span className="font-mono-code text-[10px] text-slate-500">últimas {entries.length}</span>
      </div>
      {shown.length === 0 ? (
        <div className="font-mono-code text-xs text-slate-500">Todavía no hay tiradas en la mesa.</div>
      ) : (
        <ul className="space-y-1 min-w-0">
          {shown.map((e) => (
            <li key={e.id} className="font-mono-code text-[11px] text-slate-300 min-w-0 break-words">
              <span>{KIND[e.kind]?.icon ?? '🎲'} </span>
              <span className="text-white">{e.handle}</span>
              <span className={`ml-1 ${KIND[e.kind]?.cls ?? ''}`}>{e.label}</span>
              {typeof e.total === 'number' && <span className="ml-1 text-white font-bold">{e.total}</span>}
              {e.detail && !compact && <span className="ml-1 text-slate-500">· {e.detail}</span>}
              {e.at && !compact && (
                <span className="ml-1 text-slate-600">{new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
