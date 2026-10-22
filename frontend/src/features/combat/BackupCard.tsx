// Tarjeta del Backup en el HUD de combate (Core pp. 158-159, plan 11, v4.9.3). [Claude Code · 2026-10-23]
import React, { useState } from 'react';
import { useCombatStore } from '../../store/useCombatStore';
import { backupGroupsAvailable, rollCombatNumber } from '../../engine/socialRoleRules';

const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';
const hpBtnCls = 'w-7 h-7 border border-slate-600 text-slate-200 hover:bg-slate-700 font-tech text-sm';

export const BackupCard: React.FC = () => {
  const backupCalls = useCombatStore((s) => s.backupCalls);
  const damageBackupAgent = useCombatStore((s) => s.damageBackupAgent);
  const dismissBackupCall = useCombatStore((s) => s.dismissBackupCall);
  const [rolls, setRolls] = useState<Record<string, string>>({});

  if (!backupCalls || backupCalls.length === 0) return null;

  const allGroups = backupGroupsAvailable(99);

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {backupCalls.map((call) => (
        <div key={call.id} className="chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
            <span className="font-tech text-[11px] uppercase tracking-wider text-cyan-300">Backup (Lawman)</span>
            <button type="button" className={btnCls} onClick={() => dismissBackupCall(call.id)}>Despedir</button>
          </div>
          {!call.arrived ? (
            <span className="text-[11px] text-amber-300">
              Backup en camino: {call.roundsLeft} {call.roundsLeft === 1 ? 'Ronda' : 'Rondas'} (baja con Siguiente Round)
            </span>
          ) : (
            <>
              {call.groupIndices.map((gi, pos) => {
                const g = allGroups[gi];
                if (!g) return null;
                return (
                  <div key={`${gi}-${pos}`} className="border border-slate-700 p-1.5 flex flex-col gap-1.5 min-w-0">
                    <span className="text-[11px] text-slate-200 break-words min-w-0">
                      <span className="font-tech">{g.name}</span> · CN {g.combatNumber} · SP {g.sp} · HP {g.hp} · MOVE {g.move} · BODY {g.body}
                      <br />Armas: {g.weapons} · Armadura: {g.armor} · Vehículo: {g.vehicle}
                    </span>
                    {call.agents.map((a, ai) => ({ a, ai }))
                      .filter(({ a }) => a.groupIndex === gi)
                      .filter((_, k, arr) => {
                        // Con dos grupos iguales (Rango 10) se reparten los agentes por mitades.
                        if (call.groupIndices.filter((x) => x === gi).length <= 1) return true;
                        const half = arr.length / 2;
                        return pos === call.groupIndices.indexOf(gi) ? k < half : k >= half;
                      })
                      .map(({ a, ai }) => {
                        const key = `${call.id}-${ai}`;
                        return (
                          <div key={key} className="flex flex-wrap items-center gap-2 min-w-0">
                            <span className="font-tech text-[11px] text-slate-300">Agente {ai + 1}</span>
                            <button type="button" className={hpBtnCls} onClick={() => damageBackupAgent(call.id, ai, -1)} aria-label="Restar 1 HP">−</button>
                            <span className="font-tech text-[11px] text-slate-100">HP {a.hpCurrent}/{a.hpMax}</span>
                            <button type="button" className={hpBtnCls} onClick={() => damageBackupAgent(call.id, ai, 1)} aria-label="Sumar 1 HP">+</button>
                            <button
                              type="button"
                              className={btnCls}
                              onClick={() => {
                                const r = rollCombatNumber(g.combatNumber);
                                setRolls((prev) => ({ ...prev, [key]: r.breakdown }));
                              }}
                            >
                              Tirada CN + 1d10
                            </button>
                            {rolls[key] && <span className="text-[11px] text-cyan-200 break-words min-w-0">{rolls[key]}</span>}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
              <span className="text-[11px] text-slate-400">
                El Backup no puede esquivar balas; el SP cubre cuerpo y cabeza (Core p.159).
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
