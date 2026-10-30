// v5.6.0 [Claude Code · 2026-10-29]: los 2 movimientos de una forma de Martial Arts en cuadros, y las reglas comunes (plan 21).
// Lo usan la ficha (DOJO) y NET, ROLES & VEHÍCULOS. Reglas comunes: Core pp.178-179.
import React from 'react';
import type { MartialArtMove } from '../../data/cyberfistsMartialArtsData';
import { SHARED_MARTIAL_ARTS_MOVES } from '../../data/cyberfistsMartialArtsData';
import { describeMoveEffects } from '../../engine/martialArtsRules';

const resolution = (m: MartialArtMove): string =>
  m.isOpposed || m.resolutionDv === 0 ? `Contra ${m.opposedBy ?? 'DEX + Evasion del rival'}` : `DV ${m.resolutionDv}`;

/** `wide`: los 2 cuadros lado a lado (solo donde la tarjeta ocupa el ancho). */
export const MartialMoveBoxes: React.FC<{ moves: readonly MartialArtMove[]; wide?: boolean }> = ({ moves, wide }) => (
  <div className="space-y-1.5">
    <span className="text-[10px] font-tech font-bold text-red-400 uppercase tracking-wider block">⚡ Movimientos especiales ({moves.length})</span>
    <div className={`grid grid-cols-1 gap-2 ${wide ? 'sm:grid-cols-2' : ''}`}>
      {moves.map((m) => {
        // Sin las líneas que repiten el efecto o la herida (que va abajo).
        const lines = describeMoveEffects(m, { headShot: false, table: 'core' }).filter((l) => !m.effectDescription.includes(l.detail.slice(0, 40)) && !(m.criticalInjuryApplied && /herida/i.test(l.label)));
        return (
          <div key={m.id} className="bg-[#0b0e16] p-2.5 rounded-xs border border-[#f59e0b]/40 space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-tech text-sm font-bold text-[#f59e0b] uppercase tracking-wide flex-1">{m.name}</span>
              <span className="text-[10px] font-mono-code font-bold text-white bg-[#1f2434] px-1.5 py-0.5 rounded">{resolution(m)}</span>
              {m.sourcePage && <span className="text-[10px] font-mono-code text-[#64748b]">p.{m.sourcePage}</span>}
            </div>
            <div className="text-[11px] text-slate-300 font-sans leading-snug">
              <span className="text-[10px] font-mono-code text-[#64748b] uppercase">Requisito: </span>
              {m.requirements}
            </div>
            <div className="text-[11px] text-white font-sans leading-snug">
              <span className="text-[10px] font-mono-code text-[#64748b] uppercase">Efecto: </span>
              {m.effectDescription}
            </div>
            {lines.length > 0 && (
              <ul className="text-[10px] font-mono-code text-[#cbd5e1] space-y-0.5 border-t border-[#1d2538] pt-1">
                {lines.map((l, i) => (
                  <li key={`${l.label}-${i}`}>
                    <span className="text-[#38bdf8]">{l.label}:</span> {l.detail}
                    {l.source && <span className="text-[#64748b] ml-1">({l.source.book} p.{l.source.page})</span>}
                  </li>
                ))}
              </ul>
            )}
            {m.damageBonusOrFormula && <div className="text-[10px] font-mono-code text-amber-300 font-bold">Daño: {m.damageBonusOrFormula}</div>}
            {m.criticalInjuryApplied && <div className="text-[10px] font-mono-code text-red-400 font-bold">Herida: {m.criticalInjuryApplied}</div>}
          </div>
        );
      })}
    </div>
  </div>
);

/** Lo que vale para todas las formas (Core pp.178-179). */
export const MartialCommonRules: React.FC = () => {
  const recovery = SHARED_MARTIAL_ARTS_MOVES[0];
  return (
    <div className="bg-[#0b0e16] border border-[#38bdf8]/40 rounded-xs p-2.5 text-[11px] text-[#cbd5e1] font-sans">
      <div className="font-tech text-xs font-bold text-[#38bdf8] uppercase mb-1">Reglas de todas las formas (Core pp.178-179)</div>
      <ul className="list-disc pl-4 space-y-0.5">
        <li>Se tira DEX + la skill de esa forma + 1d10 contra DEX + Evasion + 1d10 del rival. Cada forma es una skill ×2 aparte.</li>
        <li>ROF 2: dos golpes por Acción. Ignora la mitad del SP de la armadura (Brawling no).</li>
        <li>Daño según BODY: 4 o menos 1d6, 5-6 2d6, 7-10 3d6, 11 o más 4d6.</li>
        <li>Cada forma tiene 2 movimientos especiales propios.</li>
        {recovery && (
          <li>
            <b className="text-white">{recovery.name}</b> (todas las formas, DV {recovery.resolutionDv}): {recovery.effectDescription}
          </li>
        )}
      </ul>
    </div>
  );
};
