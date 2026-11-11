// [Claude Code · 2026-11-11] v5.17.0 (plan 27): armador del Dreaded Punknaught para el bestiario del GM.
// Interface RED Vol. 4 pp.38-44. Las cuentas están en engine/punknaught.ts.
import { useMemo, useState } from 'react';
import {
  PUNKNAUGHT_CORE,
  PUNKNAUGHT_PARTS,
  PUNKNAUGHT_DEATH_TABLE,
  clampPunknaughtBuild,
  punknaughtMax,
  punknaughtStats,
  type PunknaughtBuild,
  type PunknaughtPartId,
} from '../../engine/punknaught';

export function PunknaughtBuilder() {
  const [open, setOpen] = useState(false);
  const [build, setBuild] = useState<PunknaughtBuild>({});
  const b = useMemo(() => clampPunknaughtBuild(build), [build]);
  const s = useMemo(() => punknaughtStats(b), [b]);

  const set = (id: PunknaughtPartId, delta: number) =>
    setBuild((prev) => clampPunknaughtBuild({ ...prev, [id]: (prev[id] ?? 0) + delta }));

  const stat = (label: string, value: string) => (
    <div className="bg-[#10141f] border border-[#1b2336] px-2 py-1 rounded-xs">
      <div className="text-[9px] font-mono-code text-[#64748b] uppercase">{label}</div>
      <div className="text-xs font-tech font-bold text-white">{value}</div>
    </div>
  );

  return (
    <div className="chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between cursor-pointer text-left">
        <div>
          <h2 className="font-tech text-base font-bold text-white uppercase tracking-wider">
            🚧 Vehículo jefe: The Dreaded Punknaught
          </h2>
          <p className="text-[11px] font-mono-code text-slate-400">
            Chatarra con motores de AV, armada por una banda. Elegí las piezas y sale la ficha • Interface RED Vol. 4 pp.38-44
          </p>
        </div>
        <span className="text-[10px] font-mono-code text-[#38bdf8]">{open ? 'Cerrar' : 'Abrir'}</span>
      </button>

      {open && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stat('SDP', String(s.sdp))}
            {stat('SP', s.sp ? `${s.sp}${s.armorGaps ? ' (con huecos)' : ''}` : '0')}
            {stat('Asientos', String(s.seats))}
            {stat('Velocidad', `${s.combatMove} MOVE • ${s.mph} MPH/${s.kph} KPH`)}
            {stat('Construcción', `${s.constructionDays} días`)}
            {stat('DV de Land Vehicle Tech', String(s.constructionDv))}
            {stat('Manejo sin tirar', `Base > ${s.driveBaseOver} y BODY > ${s.bodyOver}`)}
            {stat('Embestida', `+${s.rammingBonusD6}d6${s.spikesNosBonusD6 ? ` (+${s.spikesNosBonusD6}d6 más con NOS)` : ''}`)}
          </div>
          {s.maneuverPenalty > 0 && (
            <p className="text-[10px] font-mono-code text-[#f59e0b]">
              Maniobras: -{s.maneuverPenalty} a Drive Land Vehicle por los Extra Chassis (p.42).
            </p>
          )}

          <div className="space-y-1">
            <div className="text-[10px] font-mono-code text-[#94a3b8]">
              <strong className="text-white">{PUNKNAUGHT_CORE.name}</strong> (siempre) • {PUNKNAUGHT_CORE.days} días • Salvage DV{PUNKNAUGHT_CORE.salvageDv} — {PUNKNAUGHT_CORE.effectEs}
            </div>
            {PUNKNAUGHT_PARTS.map((p) => {
              const id = p.id as PunknaughtPartId;
              const n = b[id] ?? 0;
              const max = punknaughtMax(id, b);
              return (
                <div key={p.id} className="flex items-start gap-2 text-[10px] font-mono-code text-[#94a3b8]">
                  <div className="flex items-center gap-1 shrink-0">
                    <button aria-label={`Quitar ${p.name}`} disabled={n === 0} onClick={() => set(id, -1)}
                      className="w-5 h-5 bg-[#1a2030] text-white rounded-xs disabled:opacity-30 cursor-pointer">−</button>
                    <span className="w-6 text-center text-white font-bold">{n}</span>
                    <button aria-label={`Sumar ${p.name}`} disabled={n >= max} onClick={() => set(id, 1)}
                      className="w-5 h-5 bg-[#1a2030] text-white rounded-xs disabled:opacity-30 cursor-pointer">+</button>
                  </div>
                  <div>
                    <strong className="text-white">{p.name}</strong> (máx. {max}) • {p.days} día{p.days > 1 ? 's' : ''} • Salvage DV{p.salvageDv} • +{p.constructionMod} al DV — {p.effectEs}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-mono-code text-[#94a3b8] space-y-1 border-t border-[#1b2234] pt-2">
            <p><strong className="text-white">Cómo se arma (p.39):</strong> equipo de 10, con un Tech como Construction Boss y un Salvage Boss. El Salvage Boss tira Basic Tech por cada pieza; si falla, no la encuentra pero el tiempo cuenta igual. Al final, el Construction Boss tira Land Vehicle Tech (suma Field Expertise) contra el DV: si falla, todo queda destruido. Funciona tantas horas como superó el DV. El GM puede saltear las tiradas para un Punknaught de PNJ (1d6 horas, Death Saves contra TECH 6).</p>
            <p><strong className="text-white">Al embestir (p.42):</strong> de frente no recibe daño y nadie adentro sufre Whiplash. Flota a 1 m: no le afectan las Spike Strips. No admite mejoras de vehículo normales.</p>
            <p><strong className="text-white">Muerte (pp.42-43):</strong> sin tiempo o con 0 SDP, hace Death Saves contra la TECH del Construction Boss. Si falla, 1d6:</p>
            <ol className="list-decimal pl-5 space-y-0.5">
              {PUNKNAUGHT_DEATH_TABLE.map((r) => <li key={r}>{r}</li>)}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
