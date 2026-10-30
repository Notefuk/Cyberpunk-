// v5.9.1: recordatorio de los negativos de las Heridas Críticas activas (Core pp.187-188). [Claude Code · 2026-10-30]
import React from 'react';
import type { ActiveCriticalInjury } from '../../types/cyberpunk';
import { summarizeInjuryPenalties } from '../../engine/injuryPenalties';

export const InjuryPenaltyReminder: React.FC<{
  injuries: ActiveCriticalInjury[] | undefined;
  /** Una sola línea (para arriba de la lista de skills). */
  compact?: boolean;
}> = ({ injuries, compact }) => {
  const s = summarizeInjuryPenalties(injuries);
  if (s.activeCount === 0) return null;

  if (compact) {
    const parts = s.lines.filter((l) => !l.text.startsWith('+')).map((l) => l.text);
    if (parts.length === 0 && s.situational.length === 0) return null;
    return (
      <div className="mb-2 px-2 py-1.5 rounded border border-red-500/50 bg-red-950/40 text-[11px] font-mono-code text-red-200" role="note">
        <strong className="text-red-300">⚠️ Heridas críticas:</strong>{' '}
        {[...parts, ...(s.situational.length ? [`${s.situational.map((x) => x.name).join(', ')}: ver su efecto en HERIDAS CRÍTICAS del HUD`] : [])].join(' · ')}.{' '}
        <span className="text-red-300/80">La BASE de acá no lo resta: restalo en la tirada.</span>
      </div>
    );
  }

  return (
    <div className="mb-2 p-2 rounded border border-red-500/60 bg-red-950/40 space-y-1 font-mono-code" role="note">
      <div className="text-[11px] font-bold text-red-300 uppercase">⚠️ Negativos activos por heridas</div>
      <ul className="text-[11px] text-red-100 space-y-0.5">
        {s.lines.map((l) => (
          <li key={l.text}>
            <strong>{l.text}</strong> <span className="text-red-300/80">({l.sources.join(', ')})</span>
          </li>
        ))}
        {s.situational.map((x) => (
          <li key={x.name}>
            <strong>{x.name}:</strong> <span className="text-red-200/90">{x.effect}</span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-red-300/80 leading-snug">
        Los ataques con armas del HUD ya los restan. En las demás tiradas (skills, Evasion, Perception) restalos vos. Quick Fix los saca hasta el final del día; Treatment, para siempre (Core p.223).
      </p>
    </div>
  );
};
