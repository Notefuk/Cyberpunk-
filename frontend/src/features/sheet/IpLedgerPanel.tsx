// Contador general de IP (Core p.410) con historial. [Claude Code · 2026-10-22]
import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { summarizeIpLog } from '../../engine/ipLedger';

const QUICK_BUTTONS = [-10, 10, 50, 100];

export const IpLedgerPanel: React.FC = () => {
  const activeChar = useCharacterStore((state) => state.getActiveCharacter());
  const adjustImprovementPoints = useCharacterStore((state) => state.adjustImprovementPoints);
  const [amount, setAmount] = useState<number>(10);
  const [reason, setReason] = useState('');

  const totals = summarizeIpLog(activeChar?.ipLog, activeChar?.improvementPoints ?? 0, activeChar?.ipLogArchivedTotals);
  const history = [...(activeChar?.ipLog ?? [])].reverse().slice(0, 20);

  const rows: [string, number][] = [
    ['Ganados', totals.earned],
    ['Ajustes', totals.adjusted],
    ['Gastado en rango de rol', totals.spentRole],
    ['Gastado en skills', totals.spentSkills],
    ['Gastado en artes marciales', totals.spentMartial],
    ['Ediciones en modo GM', totals.gmEdits],
  ];

  return (
    <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-3 font-mono-code">
      <div className="flex items-center gap-2 pb-2 border-b border-[#1f2230]">
        <Award className="w-4 h-4 text-emerald-400" />
        <span className="font-tech text-xs font-bold text-white uppercase tracking-wider">IMPROVEMENT POINTS (Core p.410)</span>
      </div>

      <div className="text-center bg-[#171924] border border-[#232736] rounded py-2">
        <div className="text-[10px] text-slate-400 uppercase">Disponibles</div>
        <div className="text-3xl font-bold text-emerald-300">{totals.available} IP</div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2 bg-[#171924] border border-[#232736] rounded px-2 py-1">
            <span className="text-slate-400">{label}</span>
            <span className="text-white font-bold">{value}</span>
          </div>
        ))}
      </div>
      {activeChar?.ipLogArchivedTotals && (
        <div className="text-[10px] text-slate-500">Los movimientos más viejos están en la copia de seguridad (Street Lab).</div>
      )}

      <div className="flex flex-wrap items-center gap-1 text-[10px]">
        {QUICK_BUTTONS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => adjustImprovementPoints(n, `Botón ${n > 0 ? '+' : ''}${n}`)}
            className={`px-2 py-1 bg-[#1a2030] rounded cursor-pointer transition-colors ${n < 0 ? 'text-slate-300 hover:bg-red-600/40' : 'text-emerald-300 hover:bg-emerald-600/40'}`}
            title={`${n > 0 ? 'Añadir' : 'Restar'} ${Math.abs(n)} IP`}
          >
            {n > 0 ? `+${n}` : n}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          className="w-20 bg-[#0f1118] border border-[#2b334d] text-white px-1.5 py-1 rounded focus:outline-none"
          aria-label="Cantidad de IP"
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo (opcional)"
          className="flex-1 min-w-0 bg-[#0f1118] border border-[#2b334d] text-white px-1.5 py-1 rounded focus:outline-none"
          aria-label="Motivo"
        />
        <button
          type="button"
          disabled={amount === 0}
          onClick={() => { adjustImprovementPoints(amount, reason.trim() || undefined); setReason(''); }}
          className="px-2 py-1 bg-[#1a2030] hover:bg-emerald-600/40 text-emerald-300 font-bold rounded cursor-pointer disabled:opacity-30"
        >
          DAR IP
        </button>
      </div>

      <div className="space-y-1">
        <div className="text-[10px] text-slate-400 uppercase font-bold">Historial (últimas 20)</div>
        {history.length === 0 && <div className="text-[11px] text-slate-500">Sin movimientos.</div>}
        {history.map((h) => (
          <div key={h.id} className="flex items-center gap-2 text-[11px] bg-[#171924] border border-[#232736] rounded px-2 py-1">
            <span className="text-slate-500 shrink-0">{new Date(h.at).toLocaleDateString()}</span>
            <span className="flex-1 min-w-0 truncate text-slate-300" title={h.reason}>{h.reason}</span>
            <span className={`font-bold shrink-0 ${h.delta > 0 ? 'text-emerald-300' : h.delta < 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {h.delta > 0 ? `+${h.delta}` : h.delta}
            </span>
            <span className="text-slate-400 shrink-0">= {h.balanceAfter}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed border-t border-[#1f2230] pt-2">
        Skill: 20 × nivel nuevo · Skill x2: 40 × nivel nuevo · Rango de rol: 60 × rango nuevo · No se saltean niveles (Core p.410)
      </p>
    </div>
  );
};
