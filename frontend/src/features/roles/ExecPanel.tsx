// Panel del Exec: beneficios y Team Members con Loyalty (Core pp. 153-157; plan 11, v4.9.3). [Claude Code · 2026-10-23]
import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGmModeStore } from '../../store/gmModeStore';
import { useCombatStore } from '../../store/useCombatStore';
import { getRoleRankInfo } from '../../engine/roleRules';
import {
  teamMemberSlots,
  execBenefitsUpTo,
  generateTeamMember,
  loyaltyGainOptions,
  loyaltyLossOptions,
  rollLoyaltySave,
  REPLACEMENT_FEE_EB
} from '../../engine/socialRoleRules';

const POSITIONS = ['Bodyguard', 'Covert Operative', 'Driver', 'Netrunner', 'Technician'] as const;

const panelCls = 'chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0';
const titleCls = 'font-tech text-[11px] uppercase tracking-wider text-cyan-300';
const selCls = 'w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';
const txtCls = 'text-[11px] text-slate-300 break-words min-w-0';

export const ExecPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.getActiveCharacter());
  const addExecTeamMember = useCharacterStore((s) => s.addExecTeamMember);
  const removeExecTeamMember = useCharacterStore((s) => s.removeExecTeamMember);
  const adjustExecMemberLoyalty = useCharacterStore((s) => s.adjustExecMemberLoyalty);
  const adjustExecMemberHp = useCharacterStore((s) => s.adjustExecMemberHp);
  const replaceExecTeamMember = useCharacterStore((s) => s.replaceExecTeamMember);
  const gmFreeEdit = useGmModeStore((s) => s.gmFreeEdit);
  const era = useCombatStore((s) => s.era);

  const [position, setPosition] = useState<string>(POSITIONS[0]);
  const [manualRank, setManualRank] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  const pushLog = (line: string) => setLog((l) => [line, ...l].slice(0, 12));

  if (!char) {
    return <div className={panelCls}><span className={txtCls}>No hay ficha activa.</span></div>;
  }

  const isExec = char.role.toLowerCase() === 'exec';
  const canAct = isExec || gmFreeEdit;
  const rank = isExec ? (char.roleRank || 1) : manualRank;
  const team = char.execTeam ?? [];
  const slots = teamMemberSlots(rank);
  const activeCount = team.filter((m) => m.status === 'active').length;
  const info = getRoleRankInfo('Exec', rank, era);
  const gains = loyaltyGainOptions();
  const losses = loyaltyLossOptions();

  const hire = () => {
    if (!canAct || activeCount >= slots) return;
    const member = generateTeamMember(position);
    addExecTeamMember(member);
    pushLog(`Contrataste a un ${position} (fila d6 ${member.d6Row}, Loyalty ${member.loyalty}).`);
  };

  const loyaltySave = (memberId: string, loyalty: number, label: string) => {
    const r = rollLoyaltySave(loyalty);
    pushLog(
      r.success
        ? `Loyalty Save de ${label}: d6 ${r.natural} < ${loyalty}, ÉXITO.`
        : `Loyalty Save de ${label}: d6 ${r.natural} no es menor que ${loyalty} (el empate falla), FALLA: puede negarse, arruinar la tarea o traicionar (Core p.154).`
    );
    void memberId;
  };

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className={panelCls}>
        <span className={titleCls}>Exec: Teamwork (Core pp. 153-157)</span>
        {!isExec && (
          <span className="text-[11px] text-amber-300">
            La ficha activa no es Exec. {gmFreeEdit ? 'Modo GM: podés operar con un rango manual.' : 'Las tiradas y cambios solo se habilitan en modo GM.'}
          </span>
        )}
        {!isExec && (
          <label className="text-[11px] text-slate-300 flex items-center gap-1 min-w-0">
            Rango manual
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
        <span className={txtCls}>Rango {rank}</span>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-tech text-[11px] uppercase text-slate-400">Beneficios hasta el rango (Core pp. 153-154)</span>
          {execBenefitsUpTo(rank).map((b) => (
            <span key={b.rank} className={txtCls}>R{b.rank}: {b.textEs}</span>
          ))}
        </div>
        {info.tweaks2077.length > 0 && (
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-tech text-[11px] uppercase text-amber-300">Ajustes 2077</span>
            {info.tweaks2077.map((t, i) => (
              <span key={i} className={txtCls}>{t.textEs} ({t.source.book} p.{t.source.page})</span>
            ))}
          </div>
        )}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Team Members (Core pp. 154-157): slots {activeCount} / {slots}</span>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <select value={position} onChange={(e) => setPosition(e.target.value)} className={`${selCls} sm:w-auto flex-1`}>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="button" className={btnCls} disabled={!canAct || activeCount >= slots} onClick={hire}>Contratar</button>
        </div>
        {slots === 0 && <span className="text-[11px] text-slate-500">Los Team Members llegan en el Rango 3 (Core p.154).</span>}
        <span className="text-[11px] text-slate-500">El tope de Loyalty 10 y las renuncias se aplican con "Fin de sesión" en el reloj de partida (Core p.154).</span>

        {team.length === 0 && <span className="text-[11px] text-slate-500">Sin Team Members.</span>}
        {team.map((m) => {
          const label = `${m.position}`;
          return (
            <div key={m.id} className="border border-slate-700 p-1.5 flex flex-col gap-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 min-w-0">
                <span className="font-tech text-[11px] text-slate-200 min-w-0">{m.position}</span>
                <span className="text-[11px] text-slate-400">fila d6 {m.d6Row}</span>
                <span className="text-[11px] text-slate-400">{m.status === 'active' ? 'activo' : m.status}</span>
              </div>
              <span className={txtCls}>{Object.entries(m.stats).map(([k, v]) => `${k} ${v}`).join(' · ')}</span>
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="text-[11px] text-slate-300">HP {m.hpCurrent}/{m.hpMax}</span>
                <button type="button" className={btnCls} disabled={!canAct} onClick={() => adjustExecMemberHp(m.id, -1)}>−</button>
                <button type="button" className={btnCls} disabled={!canAct} onClick={() => adjustExecMemberHp(m.id, 1)}>+</button>
                <span className="text-[11px] text-slate-400">Seriously Wounded {m.seriouslyWounded} · Death Save {m.deathSave}</span>
              </div>
              <span className={txtCls}>{m.packageNote}</span>
              <span className="text-[11px] text-slate-400">Usa solo Light Armorjack (Core p.154).</span>
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="text-[11px] text-slate-300">Loyalty {m.loyalty}</span>
                <button type="button" className={btnCls} disabled={!canAct} onClick={() => adjustExecMemberLoyalty(m.id, -1)}>−</button>
                <button type="button" className={btnCls} disabled={!canAct} onClick={() => adjustExecMemberLoyalty(m.id, 1)}>+</button>
                <button type="button" className={btnCls} disabled={!canAct} onClick={() => loyaltySave(m.id, m.loyalty, label)}>Loyalty Save</button>
              </div>
              <div className="flex flex-wrap gap-2 min-w-0">
                <select
                  className={`${selCls} flex-1`}
                  value=""
                  disabled={!canAct}
                  onChange={(e) => {
                    const opt = gains[Number(e.target.value)];
                    if (opt) { adjustExecMemberLoyalty(m.id, opt.value); pushLog(`${label}: Loyalty ${opt.value >= 0 ? '+' : ''}${opt.value} (${opt.actionEs}).`); }
                  }}
                >
                  <option value="">Ganar Loyalty…</option>
                  {gains.map((o, i) => <option key={i} value={i}>{o.actionEs} (+{o.value})</option>)}
                </select>
                <select
                  className={`${selCls} flex-1`}
                  value=""
                  disabled={!canAct}
                  onChange={(e) => {
                    const opt = losses[Number(e.target.value)];
                    if (opt) { adjustExecMemberLoyalty(m.id, opt.value); pushLog(`${label}: Loyalty ${opt.value} (${opt.actionEs}).`); }
                  }}
                >
                  <option value="">Perder Loyalty…</option>
                  {losses.map((o, i) => <option key={i} value={i}>{o.actionEs} ({o.value})</option>)}
                </select>
              </div>
              {m.status === 'active' && m.loyalty <= 0 && (
                <span className="text-[11px] text-red-300">Loyalty 0 o menos: este miembro intenta traicionarte (Core p.154).</span>
              )}
              {m.status === 'resigned' && (
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="text-[11px] text-amber-300">Renunció.</span>
                  <button
                    type="button"
                    className={btnCls}
                    disabled={!canAct}
                    onClick={() => pushLog(replaceExecTeamMember(m.id).message)}
                  >
                    Pedir reemplazo ({REPLACEMENT_FEE_EB} €$, Loyalty 1)
                  </button>
                </div>
              )}
              <div>
                <button type="button" className={btnCls} disabled={!canAct} onClick={() => removeExecTeamMember(m.id)}>Borrar</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Registro</span>
        {log.length === 0 && <span className="text-[11px] text-slate-500">Sin movimientos todavía.</span>}
        {log.map((l, i) => <span key={i} className={txtCls}>{l}</span>)}
      </div>
    </div>
  );
};
