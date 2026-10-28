// v5.1.0 [Claude Code · 2026-10-27]: orden de iniciativa del encuentro en el HUD (plan 19, punto 3).
// El jugador ve quién tiene el turno y, de los enemigos, solo el estado de heridas. El GM ve también los HP.
import React, { useState } from 'react';
import { Swords } from 'lucide-react';
import { useEncounterStore, orderedCombatants, type WoundState } from '../../store/encounterStore';
import { enemyWoundState } from '../../sync/encounterSync';
import { useActiveTable } from '../../sync/tableSync';
import { GmTargetDialog } from '../gm/GmTargetDialog';

const WOUND_LABEL: Record<WoundState, { text: string; cls: string }> = {
  none: { text: 'Sin heridas', cls: 'text-emerald-300' },
  light: { text: 'Lightly Wounded', cls: 'text-amber-300' },
  serious: { text: 'Seriously Wounded', cls: 'text-orange-400' },
  mortal: { text: 'Mortally Wounded', cls: 'text-red-400' }
};

export const EncounterOrderStrip: React.FC = () => {
  const combatants = useEncounterStore((s) => s.combatants);
  const order = useEncounterStore((s) => s.order);
  const turnIndex = useEncounterStore((s) => s.turnIndex);
  const round = useEncounterStore((s) => s.round);
  const nextTurn = useEncounterStore((s) => s.nextTurn);
  const { table, isGm } = useActiveTable();
  // v5.2.0 (plan 20): el GM de la mesa abre la calculadora sobre un PJ. [Claude Code · 2026-10-28]
  const [targetCharId, setTargetCharId] = useState<string | null>(null);
  // v5.3.0 (plan 20, B.2): ficha pública de un enemigo revelado. [Claude Code · 2026-10-28]
  const [openRevealId, setOpenRevealId] = useState<string | null>(null);
  const setRevealed = useEncounterStore((s) => s.setRevealed);
  const list = orderedCombatants({ combatants, order });
  if (list.length === 0) return null;
  const canDrive = !table || isGm;

  return (
    <div className="chamfer-card bg-slate-900/70 border border-slate-700 p-2 min-w-0 space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        <span className="font-tech text-[11px] uppercase tracking-wider text-rose-300">
          Orden de iniciativa · Round {round}
        </span>
        {table && <span className="font-tech text-[10px] uppercase text-slate-400 truncate">Mesa: {table.name}</span>}
        {canDrive && (
          <button
            type="button"
            onClick={nextTurn}
            className="ml-auto font-tech text-[11px] uppercase px-2 py-1 border border-rose-500/50 text-rose-300 hover:bg-rose-500/10"
          >
            Siguiente turno
          </button>
        )}
      </div>
      <ol className="flex flex-wrap gap-1.5 min-w-0">
        {list.map((c, i) => {
          const active = i === turnIndex;
          const wound = c.enemy ? enemyWoundState(c.enemy) : c.woundState;
          return (
            <li
              key={c.id}
              className={`font-mono-code text-[11px] px-2 py-1 border rounded-xs min-w-0 ${
                active ? 'border-cyan-400 bg-cyan-500/15 text-white' : 'border-slate-700 text-slate-300'
              }`}
              title={active ? 'Tiene el turno' : undefined}
            >
              {active && <span aria-label="Tiene el turno">▶ </span>}
              <span className="text-slate-400">{c.initiative ?? '—'}</span>{' '}
              <span className={c.kind === 'pc' ? 'text-cyan-200' : 'text-rose-200'}>{c.name}</span>
              {c.kind === 'enemy' && wound && <span className={`ml-1 ${WOUND_LABEL[wound].cls}`}>· {WOUND_LABEL[wound].text}</span>}
              {c.enemy && <span className="ml-1 text-slate-500">({c.enemy.currentHp}/{c.enemy.maxHp})</span>}
              {table && isGm && c.kind === 'enemy' && c.enemy && (
                <button
                  type="button"
                  onClick={() => setRevealed(c.id, !c.revealed)}
                  className={`ml-1.5 font-tech text-[10px] uppercase px-1 border cursor-pointer ${c.revealed ? 'border-sky-400 text-sky-200 bg-sky-500/10' : 'border-slate-600 text-slate-400 hover:text-sky-200'}`}
                  title={c.revealed ? 'La mesa ve su ficha pública (sin HP). Tocá para ocultarla.' : 'Mostrar a la mesa su ficha pública (nunca los HP)'}
                >
                  {c.revealed ? 'Revelado' : 'Revelar'}
                </button>
              )}
              {!isGm && c.reveal && (
                <button
                  type="button"
                  onClick={() => setOpenRevealId(openRevealId === c.id ? null : c.id)}
                  className="ml-1.5 font-tech text-[10px] uppercase px-1 border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 cursor-pointer"
                  title="El GM reveló su ficha"
                >
                  Ficha
                </button>
              )}
              {table && isGm && c.kind === 'pc' && c.charId && (
                <button
                  type="button"
                  onClick={() => setTargetCharId(c.charId!)}
                  className="ml-1.5 font-tech text-[10px] uppercase px-1 border border-amber-500/50 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                  title="Daño, críticas, condiciones, Humanidad y €$ sobre este PJ"
                >
                  Daño
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {(() => {
        const open = list.find((c) => c.id === openRevealId && c.reveal);
        const r = open?.reveal;
        if (!open || !r) return null;
        return (
          <div className="border border-sky-500/40 bg-sky-950/20 p-2 font-mono-code text-[11px] text-slate-300 space-y-0.5">
            <div className="text-sky-200 font-bold">{open.name}{r.subtitle ? ` · ${r.subtitle}` : ''}</div>
            <div>{[r.faction, r.threatTier].filter(Boolean).join(' · ')} · SP cabeza {r.headSp} / cuerpo {r.bodySp}</div>
            {r.weapons.length > 0 && <div>Armas: {r.weapons.join(', ')}</div>}
            {r.specialRules.map((rule, i) => <div key={i} className="text-slate-400">• {rule}</div>)}
          </div>
        );
      })()}
      {targetCharId && <GmTargetDialog charId={targetCharId} onClose={() => setTargetCharId(null)} />}
    </div>
  );
};
