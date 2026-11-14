// [Claude Code · 2026-11-14] v5.41.0 (plan 33): netrunning en sigilo (Going Quiet pp.4-5) en el corredor de NET.
// Los Watchers (Demons y netrunners enemigos) los carga el GM a mano con su Interface: la app no tiene IA de Demons.
// El bonus de Cloak/Pathfinder también va a mano (Eraser y See Ya no están en la app).
import React, { useState } from 'react';
import { rollCheckD10 } from '../../engine/combatEngine';
import {
  NET_STEALTH_SOURCE, STEALTH_ALLOWED, STEALTH_BREAKERS, STEALTH_RESTORE, blackIceStealth, quietJackIn, watcherEncounter, watcherSearch,
  type Watcher
} from '../../engine/netStealth';
import { BLACK_ICE_STATS, type NetFloor } from '../../data/netAndRolesData';

export const NetStealthPanel: React.FC<{ interfaceRank: number; floor?: NetFloor; onSpendNetAction?: () => void }> = ({ interfaceRank, floor, onSpendNetAction }) => {
  const [stealthed, setStealthed] = useState<boolean | null>(null);
  const [cloak, setCloak] = useState(0);
  const [watchers, setWatchers] = useState<Watcher[]>([]);
  const [wName, setWName] = useState('');
  const [wInt, setWInt] = useState(3);
  const [wPath, setWPath] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog((l) => [line, ...l].slice(0, 8));
  const icePer = floor?.type === 'Black ICE' && floor.iceType ? BLACK_ICE_STATS[floor.iceType]?.per : undefined;

  const jackIn = () => {
    onSpendNetAction?.();
    const me = rollCheckD10().value;
    const r = quietJackIn(interfaceRank, me, watchers.map((w) => ({ watcher: w, d10: rollCheckD10().value })));
    setStealthed(r.stealthed);
    add(`Quietly Jack In: ${r.total} ${r.results.length ? `vs ${r.results.map((x) => `${x.name} ${x.total}`).join(', ')}` : '(sin Watchers)'} → ${r.stealthed ? 'en sigilo' : 'detectado'}`);
  };
  const ice = () => {
    if (icePer === undefined) return;
    const r = blackIceStealth(interfaceRank, cloak, rollCheckD10().value, icePer, rollCheckD10().value);
    if (!r.success) setStealthed(false);
    add(`${floor?.iceType} (PER ${icePer}): ${r.attacker} vs ${r.defender} → ${r.success ? 'no te ve, no entra a la iniciativa' : 'te ve: sufrís su efecto como en un Speed Check fallido y va primero en la iniciativa'}`);
  };
  const meet = (w: Watcher) => {
    const r = watcherEncounter(interfaceRank, cloak, rollCheckD10().value, w, rollCheckD10().value);
    if (!r.success) setStealthed(false);
    add(`Te cruzás con ${w.name}: ${r.attacker} vs ${r.defender} → ${r.success ? 'sigue el sigilo' : 'se rompe el sigilo'}`);
  };
  const search = (w: Watcher) => {
    const r = watcherSearch(w, rollCheckD10().value, interfaceRank, cloak, rollCheckD10().value);
    if (r.success) setStealthed(false);
    add(`${w.name} busca (Pathfinder): ${r.attacker} vs ${r.defender} → ${r.success ? 'te encuentra: se rompe el sigilo' : 'no te encuentra'}`);
  };

  return (
    <div className="bg-[#0b0f17] border border-[#1b2234] p-3 rounded-xs space-y-2 text-[11px] font-mono-code text-slate-300" data-testid="net-stealth">
      <div className="flex items-center justify-between">
        <span className="font-tech font-bold text-[#00f5d4] uppercase">Netrunning en sigilo</span>
        <span className={stealthed === null ? 'text-slate-500' : stealthed ? 'text-[#10b981]' : 'text-red-400'} data-testid="net-stealth-state">
          {stealthed === null ? 'Sin entrar en sigilo' : stealthed ? 'EN SIGILO' : 'DETECTADO'}
        </span>
      </div>
      <p className="text-slate-500">Interface {interfaceRank}. {NET_STEALTH_SOURCE}.</p>
      <div className="flex flex-wrap gap-2 items-end">
        <label>Bonus de Cloak <input type="number" min={0} value={cloak} onChange={(e) => setCloak(parseInt(e.target.value) || 0)} className="w-12 bg-[#141824] border border-[#273248] text-center" /></label>
        <button type="button" onClick={jackIn} className="px-2 py-1 bg-[#00f5d4] text-black font-bold rounded-xs" title="Cuesta una NET Action extra">Quietly Jack In (+1 NET Action)</button>
        {icePer !== undefined && stealthed && (
          <button type="button" onClick={ice} className="px-2 py-1 border border-[#00f5d4] text-[#00f5d4] rounded-xs">Pasar el Black ICE de este piso</button>
        )}
      </div>
      <div className="border-t border-[#1b2234] pt-2 space-y-1">
        <span className="text-slate-400">Watchers (Demons y netrunners enemigos; suelen estar en el piso de abajo o junto a un Control Node):</span>
        <div className="flex flex-wrap gap-1 items-end">
          <input value={wName} onChange={(e) => setWName(e.target.value)} placeholder="Nombre" aria-label="Nombre del Watcher" className="w-28 bg-[#141824] border border-[#273248] px-1" />
          <label>Interface <input type="number" min={0} value={wInt} onChange={(e) => setWInt(parseInt(e.target.value) || 0)} className="w-10 bg-[#141824] border border-[#273248] text-center" /></label>
          <label>Pathfinder + <input type="number" min={0} value={wPath} onChange={(e) => setWPath(parseInt(e.target.value) || 0)} className="w-10 bg-[#141824] border border-[#273248] text-center" /></label>
          <button type="button" disabled={!wName.trim()} onClick={() => { setWatchers([...watchers, { name: wName.trim(), interface: wInt, pathfinderBonus: wPath }]); setWName(''); }} className="px-2 border border-[#273248] rounded-xs disabled:opacity-40">Agregar</button>
        </div>
        {watchers.map((w, i) => (
          <div key={`${w.name}-${i}`} className="flex flex-wrap items-center gap-1">
            <span>{w.name} (Interface {w.interface}{w.pathfinderBonus ? `, Pathfinder +${w.pathfinderBonus}` : ''})</span>
            {stealthed && <button type="button" onClick={() => meet(w)} className="px-1.5 border border-[#273248] rounded-xs">Cruzarse</button>}
            {stealthed && <button type="button" onClick={() => search(w)} className="px-1.5 border border-[#273248] rounded-xs">Busca (su Turno)</button>}
            <button type="button" onClick={() => setWatchers(watchers.filter((_, k) => k !== i))} className="px-1.5 text-slate-500">quitar</button>
          </div>
        ))}
      </div>
      {stealthed && (
        <button type="button" onClick={() => { setStealthed(false); add('Se rompió el sigilo (Control Node o ataque).'); }} className="px-2 py-1 border border-red-500/50 text-red-300 rounded-xs">Tomé un Control Node / ataqué</button>
      )}
      <ul className="text-slate-400 list-disc pl-4">
        {STEALTH_BREAKERS.map((b) => <li key={b}>{b}</li>)}
        <li>{STEALTH_ALLOWED}</li>
        <li>{STEALTH_RESTORE}</li>
      </ul>
      {log.length > 0 && <ul className="text-slate-300 space-y-0.5" data-testid="net-stealth-log">{log.map((l, i) => <li key={i}>› {l}</li>)}</ul>}
    </div>
  );
};
