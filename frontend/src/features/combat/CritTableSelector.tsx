// Selector de tabla de Heridas Críticas, independiente de la era (plan 10, v4.9.2). [Claude Code · 2026-10-22]
import React from 'react';
import { useRulesSettingsStore } from '../../store/rulesSettingsStore';
import type { CritTable } from '../../engine/medicalRules';

export const CritTableSelector: React.FC = () => {
  const criticalTable = useRulesSettingsStore((s) => s.criticalTable);
  const setCriticalTable = useRulesSettingsStore((s) => s.setCriticalTable);

  return (
    <div className="chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-1 min-w-0">
      <label className="font-tech text-[11px] uppercase tracking-wider text-slate-300">Tabla de Críticas</label>
      <select
        value={criticalTable}
        onChange={(e) => setCriticalTable(e.target.value as CritTable)}
        className="w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech"
      >
        <option value="core">Core 2d6 · con amputaciones (Core pp. 187-188)</option>
        <option value="cemk">CEMK 1d6 (CEMK RB p.13)</option>
      </select>
      <span className="text-[11px] text-slate-400">
        Independiente del modo 2045/2077. En CEMK los Quickhacks no generan Críticas (CEMK RB p.12).
      </span>
    </div>
  );
};
