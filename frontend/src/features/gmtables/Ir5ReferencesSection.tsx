// [Claude Code · 2026-11-13] v5.30.0 (plan 31): referencias del Interface RED Vol. 5 (roller derby, Hiring Hall,
// parámetros de misión mercenaria y DV para hackear Agents).
import { useState } from 'react';
import { IR5_REFERENCES } from '../../data/gmTables/ir5References';

const card = 'chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3';
const small = 'text-[11px] font-mono-code text-[#94a3b8]';

export function Ir5ReferencesSection() {
  const [open, setOpen] = useState<string>(IR5_REFERENCES[0]?.id ?? '');
  return (
    <div className="space-y-3">
      {IR5_REFERENCES.map((ref) => (
        <div key={ref.id} className={card}>
          <button
            type="button"
            className="w-full flex items-center justify-between text-left cursor-pointer"
            aria-expanded={open === ref.id}
            onClick={() => setOpen(open === ref.id ? '' : ref.id)}
          >
            <h3 className="font-tech text-sm font-bold text-white uppercase">{ref.title}</h3>
            <span className="text-[10px] font-mono-code text-[#64748b]">{ref.source}</span>
          </button>
          {open === ref.id && (
            <dl className="space-y-2">
              {ref.items.map((it) => (
                <div key={it.label}>
                  <dt className="text-[12px] font-tech font-bold text-[#22d3ee]">{it.label}</dt>
                  <dd className={`${small} whitespace-pre-line`}>{it.text}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ))}
    </div>
  );
}
