// Reloj de partida: Día / Beat (plan 10, v4.9.2). [Claude Code · 2026-10-22]
import React from 'react';
import { Clock } from 'lucide-react';
import { useGameClockStore } from '../../store/gameClockStore';

export const GameClockBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const day = useGameClockStore((s) => s.day);
  const beat = useGameClockStore((s) => s.beat);
  const newBeat = useGameClockStore((s) => s.newBeat);
  const newDay = useGameClockStore((s) => s.newDay);

  const handleNewDay = () => {
    if (window.confirm('Pasar al día siguiente: los Quick Fix vencen (Core p.223 / CEMK RB p.14). ¿Continuar?')) {
      newDay();
    }
  };

  return (
    <div
      className={`chamfer-card bg-slate-900/70 border border-slate-700 flex flex-wrap items-center gap-2 min-w-0 ${compact ? 'p-1.5' : 'p-2'}`}
      title="Speedheal: 1 por Beat por Medtech y 1 por día por paciente."
    >
      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <span className="font-tech text-[11px] uppercase tracking-wider text-cyan-300 min-w-0">
        Día {day} · Beat {beat}
      </span>
      <div className="flex flex-wrap gap-1.5 min-w-0">
        <button
          type="button"
          onClick={newBeat}
          className="font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
        >
          Nuevo Beat
        </button>
        <button
          type="button"
          onClick={handleNewDay}
          className="font-tech text-[11px] uppercase px-2 py-1 border border-amber-500/50 text-amber-300 hover:bg-amber-500/10"
        >
          Nuevo día
        </button>
      </div>
      {!compact && (
        <span className="text-[11px] text-slate-400 min-w-0 basis-full">
          Speedheal: 1 por Beat por Medtech y 1 por día por paciente.
        </span>
      )}
    </div>
  );
};
