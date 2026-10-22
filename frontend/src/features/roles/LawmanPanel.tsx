// Panel del Lawman: pedir Backup (Core pp. 158-159, plan 11, v4.9.3). [Claude Code · 2026-10-23]
import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCombatStore } from '../../store/useCombatStore';
import { useGmModeStore } from '../../store/gmModeStore';
import { getRoleRankInfo } from '../../engine/roleRules';
import {
  backupGroupsAvailable,
  rollBackupCall,
  rollBackupArrival,
  backupAgents
} from '../../engine/socialRoleRules';

const panelCls = 'chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0';
const titleCls = 'font-tech text-[11px] uppercase tracking-wider text-cyan-300';
const selCls = 'w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';

export const LawmanPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.getActiveCharacter());
  const gmFreeEdit = useGmModeStore((s) => s.gmFreeEdit);
  const era = useCombatStore((s) => s.era);
  const addBackupCall = useCombatStore((s) => s.addBackupCall);

  const [manualRank, setManualRank] = useState(4);
  const [groupSel, setGroupSel] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);

  if (!char) {
    return <div className={panelCls}><span className="text-[11px] text-slate-400">No hay ficha activa.</span></div>;
  }

  const isLawman = char.role === 'Lawman';
  const canUse = isLawman || gmFreeEdit;
  const rank = isLawman ? (char.roleRank || 1) : manualRank;
  const groups = backupGroupsAvailable(rank);
  const selIndex = groupSel !== null && groupSel < groups.length ? groupSel : Math.max(0, groups.length - 1);
  const tweaks = era === '2077' && isLawman ? getRoleRankInfo('Lawman', rank, era).tweaks2077 : [];

  const pushLog = (line: string) => setLog((l) => [line, ...l].slice(0, 10));

  const handleCall = () => {
    const group = groups[selIndex];
    if (!group) return;
    const call = rollBackupCall(rank);
    if (!call.success) {
      pushLog(`Pedir Backup: 1d10 = ${call.natural} contra Rango ${rank} (hay que sacar igual o menos). Nadie responde: reintentá el Turno siguiente; abusar puede costarte una multa o el puesto.`);
      return;
    }
    const arrival = rollBackupArrival(selIndex, undefined, rank);
    const all = backupGroupsAvailable(99);
    addBackupCall({
      lawmanId: char.id,
      groupIndices: arrival.groupIndices,
      roundsLeft: arrival.rounds,
      agents: arrival.groupIndices.flatMap((gi) =>
        backupAgents(all[gi]).map((a) => ({ groupIndex: gi, ...a }))
      )
    });
    const names = arrival.groupIndices.map((gi) => all[gi].name).join(' + ');
    const extra = arrival.groupIndices.length > 1
      ? ' (Rango 10 con un 6: llegan dos grupos de Rango 10)'
      : arrival.upgraded ? ' (con un 6 llega el grupo siguiente)' : '';
    pushLog(`Pedir Backup: 1d10 = ${call.natural} contra Rango ${rank}. Responden: ${names} llega en ${arrival.rounds} ${arrival.rounds === 1 ? 'Ronda' : 'Rondas'}${extra}.`);
  };

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {!isLawman && (
        <div className={panelCls}>
          <span className="text-[11px] text-amber-300">
            La ficha activa no es Lawman: las tiradas de Backup solo se habilitan en modo GM con un Rango manual.
          </span>
          {gmFreeEdit && (
            <label className="text-[11px] text-slate-300 flex items-center gap-1 min-w-0">
              Rango de Backup
              <input
                type="number"
                min={1}
                max={10}
                value={manualRank}
                onChange={(e) => setManualRank(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="w-16 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech"
              />
            </label>
          )}
        </div>
      )}

      <div className={panelCls}>
        <span className={titleCls}>Backup (Core pp. 158-159) · Rango {rank}</span>
        <div className="flex flex-col gap-1 min-w-0">
          {groups.map((g, i) => (
            <div key={g.name + i} className={`border p-1.5 text-[11px] text-slate-300 min-w-0 break-words ${i === selIndex ? 'border-cyan-400' : 'border-slate-700'}`}>
              <span className="font-tech text-slate-100">{g.name}</span> (Rango {g.fromRank}+) · {g.members} {g.members === 1 ? 'miembro' : 'miembros'} · CN {g.combatNumber} · SP {g.sp} · HP {g.hp} · MOVE {g.move} · BODY {g.body}
              <br />Armas: {g.weapons} · Armadura: {g.armor} · Vehículo: {g.vehicle}
              <br /><span className="text-slate-500">{g.descEs}</span>
            </div>
          ))}
          {groups.length === 0 && <span className="text-[11px] text-slate-500">Sin grupos disponibles para este Rango.</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <select value={selIndex} onChange={(e) => setGroupSel(Number(e.target.value))} className={`${selCls} sm:w-auto flex-1`}>
            {groups.map((g, i) => <option key={g.name + i} value={i}>{g.name}</option>)}
          </select>
          <button type="button" className={btnCls} disabled={!canUse || groups.length === 0} onClick={handleCall}>
            Pedir Backup (Acción)
          </button>
        </div>
        <span className="text-[11px] text-slate-400">
          1d10 igual o menor que tu Rango; si responde, llega en 1d6 Rondas y con un 6 llega el grupo siguiente. En Rango 10, con un 6 llegan dos grupos de Rango 10.
        </span>
        <span className="text-[11px] text-slate-400">
          Rango 10: los mismos 2 agentes siguen el caso hasta cerrarlo y usan su CN para las skills de investigación.
        </span>
      </div>

      {tweaks.length > 0 && (
        <div className={panelCls}>
          <span className={titleCls}>Ajustes 2077</span>
          {tweaks.map((t, i) => (
            <span key={i} className="text-[11px] text-slate-300 break-words min-w-0">
              {t.fromRank !== null ? `Rango ${t.fromRank}: ` : ''}{t.textEs}
            </span>
          ))}
        </div>
      )}

      <div className={panelCls}>
        <span className={titleCls}>Registro</span>
        {log.length === 0 && <span className="text-[11px] text-slate-500">Sin llamados todavía.</span>}
        {log.map((l, i) => (
          <span key={i} className="text-[11px] text-slate-300 break-words min-w-0">{l}</span>
        ))}
      </div>
    </div>
  );
};
