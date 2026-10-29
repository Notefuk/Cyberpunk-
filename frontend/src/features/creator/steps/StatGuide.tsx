// v5.4.0 [Claude Code · 2026-10-29]: guía "qué hace cada STAT" (Core p.72 y reglas con página). Se reusa en la ficha (plan 21).
import React from 'react';
import { STAT_TOOLTIPS } from '../../../data/characterCreationData';
import type { StatKey } from '../../../types/cyberpunk';

const ORDER: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];

export const StatGuide: React.FC<{ values?: Partial<Record<StatKey, number>>; className?: string }> = ({ values, className = '' }) => (
  <div className={`bg-[#10121a] border border-[#1e2334] rounded-xs p-3 ${className}`}>
    <h3 className="font-tech text-sm font-bold text-[#06b6d4] uppercase tracking-wider mb-1">Qué hace cada STAT</h3>
    <p className="text-[11px] text-[#94a3b8] mb-2">
      Casi toda tirada es STAT + skill + 1d10 contra un DV o contra la tirada del otro (Core p.129). Tocá un STAT para ver para qué sirve.
    </p>
    <div className="grid gap-1 sm:grid-cols-2">
      {ORDER.map((k) => {
        const t = STAT_TOOLTIPS[k];
        const v = values?.[k];
        return (
          <details key={k} className="border border-[#1e2334] rounded-xs bg-[#0a0b0e] open:border-[#06b6d4]/50">
            <summary className="cursor-pointer select-none px-2 py-2 min-h-[44px] flex items-center gap-2 text-xs">
              <span className="font-tech font-bold text-white w-10">{k}</span>
              <span className="text-[#cbd5e1]">{t.spanishName}</span>
              {v !== undefined && <span className="ml-auto font-mono-code text-[#10b981]">{v}</span>}
            </summary>
            <div className="px-2 pb-2 text-[11px] text-[#cbd5e1] space-y-1">
              <p>{t.beginnerExplanation || t.shortSummary}</p>
              {t.mechanicalBreakpoints.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5">
                  {t.mechanicalBreakpoints.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {t.dependentSkills.length > 0 && (
                <p className="text-[#94a3b8]">
                  <span className="text-[#64748b]">Skills que usa: </span>
                  {t.dependentSkills.join(', ')}
                </p>
              )}
              <p className="text-[10px] font-mono-code text-[#64748b]">
                {t.source.book} p.{t.source.page}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  </div>
);
