// [Claude Code · 2026-11-14] v5.43.0 (plan 33): "tira N veces en la tabla de Críticas y elegí" (Monowire, CEMK p.35;
// Double-Edged y Barbed Line, CEMK DLC 02 p.3). Muestra las N opciones y aplica la que elija el atacante.
import React, { useState } from 'react';
import { useRulesSettingsStore } from '../../store/rulesSettingsStore';
import { useCharacterStore } from '../../store/useCharacterStore';
import { rollCritOptions } from '../../engine/medicalRules';
import { rollCriticalInjury } from '../../data/criticalInjuries';

export const CritChoicePicker: React.FC<{ rolls: 2 | 3; source?: string }> = ({ rolls, source }) => {
  const table = useRulesSettingsStore((s) => s.criticalTable);
  const charId = useCharacterStore((s) => s.activeCharacterId);
  const inflict = useCharacterStore((s) => s.inflictSpecificInjury);
  const [opts, setOpts] = useState<{ location: 'head' | 'body'; list: { name: string; effect: string }[] } | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const roll = (location: 'head' | 'body') => {
    setDone(null);
    setOpts({ location, list: rollCritOptions(location, rolls, table, [], (loc, names) => rollCriticalInjury(loc, names)) });
  };
  return (
    <div className="mt-1 p-1.5 border border-[#dc2626]/60 rounded-xs bg-[#1a0d12] text-[10px] font-mono-code" data-testid="crit-choice">
      <div className="text-[#f87171] font-bold mb-1">🎲 Tirás {rolls} veces y elegís{source ? ` (${source})` : ''}</div>
      <div className="grid grid-cols-2 gap-1 mb-1">
        <button type="button" onClick={() => roll('head')} className="py-0.5 bg-[#dc2626] text-white font-bold rounded-xs">Tirar {rolls} en cabeza</button>
        <button type="button" onClick={() => roll('body')} className="py-0.5 bg-[#f59e0b] text-black font-bold rounded-xs">Tirar {rolls} en cuerpo</button>
      </div>
      {opts && opts.list.map((o) => (
        <button key={o.name} type="button" data-testid="crit-choice-option"
          onClick={() => { inflict(charId, opts.location, o.name, table); setDone(o.name); }}
          className="w-full text-left p-1 mb-1 border border-[#3a1f28] rounded-xs hover:bg-[#2a141a]">
          <b className="text-white">{o.name}</b> <span className="text-slate-400">{o.effect}</span>
        </button>
      ))}
      {done && <div className="text-[#10b981]">Aplicada: {done}.</div>}
    </div>
  );
};
