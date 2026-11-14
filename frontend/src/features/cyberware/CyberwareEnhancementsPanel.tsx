// [Claude Code · 2026-11-14] v5.43.0 (plan 33): Cyberware Enhancements de CEMK (DLC 02, pp.1-3), solo para PJ de 2077.
// Se compran y las instala un Tech en 1 hora sin tirada; una sola por ciberware.
import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { CEMK_ENH_SOURCE, ENHANCEABLE_CYBERWARE, enhancementById, enhancementsFor } from '../../data/cemkCyberwareEnhancements';

const fmt = (n: number) => `${n.toLocaleString('es-AR')}eb`;

export const CyberwareEnhancementsPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.characters.find((c) => c.id === s.activeCharacterId));
  const spend = useCharacterStore((s) => s.spendEurodollarsFor);
  const setEnh = useCharacterStore((s) => s.setCyberwareEnhancement);
  const [msg, setMsg] = useState<string | null>(null);
  if (!char || char.era !== '2077') return null;
  const owned = ENHANCEABLE_CYBERWARE.filter((c) => (char.installedCyberwareIds ?? []).includes(c.id));
  if (owned.length === 0) return null;

  const buy = (cyberwareId: string, enhId: string, charge: boolean) => {
    const enh = enhancementById(enhId)!;
    if (charge && !spend(char.id, enh.cost, `Cyberware Enhancement: ${enh.name}`)) { setMsg(`No alcanza: cuesta ${fmt(enh.cost)}.`); return; }
    setEnh(cyberwareId, enhId);
    setMsg(`${enh.name} instalada${charge ? ` (${fmt(enh.cost)})` : ''}. La instala un Tech en 1 hora, sin tirada.`);
  };

  return (
    <div className="bg-[#0b0f17] border border-[#1b2234] p-3 rounded-xs space-y-3 text-[11px] font-mono-code text-slate-300" data-testid="cw-enhancements">
      <div className="font-tech font-bold text-[#22d3ee] uppercase">Cyberware Enhancements (2077)</div>
      <p className="text-slate-500">
        Mejoras de catálogo que instala un Tech en 1 hora, sin tirada. Va una sola por ciberware, no se pasa a otro tipo y no cuenta como Upgrade del Maker. {CEMK_ENH_SOURCE} pp.1-3.
      </p>
      {owned.map((cw) => {
        const current = enhancementById(char.cyberwareEnhancements?.[cw.id]);
        return (
          <div key={cw.id} className="bg-[#111420] border border-[#1e2538] p-2 rounded-xs space-y-2" data-testid={`cw-enh-${cw.id}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-white font-bold">{cw.name}</span>
              {current ? (
                <span className="text-[#22d3ee]">Instalada: <b>{current.name}</b>
                  <button type="button" onClick={() => { setEnh(cw.id, null); setMsg(`${current.name} desinstalada (1 hora, sin tirada; no devuelve la plata).`); }}
                    className="ml-2 text-red-400" title="Desinstalar (no devuelve la plata)">✕</button>
                </span>
              ) : <span className="text-slate-500">Sin mejora</span>}
            </div>
            {enhancementsFor(cw.id).map((e) => (
              <div key={e.id} className="border-t border-[#1b2234] pt-1 flex items-start gap-2">
                <div className="flex-1">
                  <b className="text-white">{e.name}</b> · {fmt(e.cost)} ({e.costTier}) · p.{e.page}
                  <div className="text-slate-400">{e.effect}</div>
                </div>
                {current?.id !== e.id && (
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => buy(cw.id, e.id, true)} className="px-2 py-0.5 bg-[#22d3ee] text-black font-bold rounded-xs whitespace-nowrap">
                      {current ? 'Cambiar' : 'Comprar'} {fmt(e.cost)}
                    </button>
                    <button type="button" onClick={() => buy(cw.id, e.id, false)} className="px-2 py-0.5 border border-[#273248] rounded-xs whitespace-nowrap">Sin cobrar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
      {msg && <p className="text-[#10b981]">{msg}</p>}
    </div>
  );
};
