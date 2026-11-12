// [Claude Code · 2026-11-12] v5.21.0 (plan 28): pestaña MODO GM, el panel del GM en la mesa.
// Jugadores de un vistazo (de sus fichas completas, que el GM ya tiene cargadas) y el encuentro con la iniciativa de todos.
import { useMemo, useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCloudState } from '../../sync/cloudState';
import { useActiveTable } from '../../sync/tableSync';
import { useEncounterStore, orderedCombatants } from '../../store/encounterStore';
import { buildGmPlayerCard, rollInitiativeForAll, type GmPlayerCard } from '../../engine/gmMode';
import { GmTargetDialog } from '../gm/GmTargetDialog';
import type { PartySummary } from '../../sync/partySummary';
import { ActorsColumn, EnemyRow } from './GmActorsPanels';
import { RollRequestsPanel } from './RollRequestsPanel';

const card = 'bg-[#0f1219] border border-[#1e2334] rounded-xs p-3 space-y-2';
const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const btn = 'font-tech text-[11px] uppercase px-2 py-1 border border-[#262b3c] text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

const WOUND_LABEL: Record<GmPlayerCard['woundState'], { text: string; color: string }> = {
  none: { text: 'Ileso', color: '#10b981' },
  light: { text: 'Herido', color: '#facc15' },
  serious: { text: 'Seriously Wounded', color: '#f97316' },
  mortal: { text: 'Mortally Wounded', color: '#ef4444' },
};

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="h-1.5 bg-[#1b2234] rounded-xs overflow-hidden">
      <div className="h-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function PlayerCard({ c, onOpen }: { c: GmPlayerCard; onOpen: () => void }) {
  const wound = WOUND_LABEL[c.woundState];
  return (
    <button type="button" onClick={onOpen} className={`${card} text-left w-full cursor-pointer hover:border-[#22d3ee]`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-tech font-bold text-white uppercase">{c.handle || 'Sin handle'}</span>
        <span className="text-[11px] font-mono-code text-[#10b981]">{c.role} {c.roleRank}</span>
      </div>
      <div>
        <div className="flex justify-between text-[11px] font-mono-code">
          <span className="text-white">HP {c.currentHp}/{c.maxHp}</span>
          <span style={{ color: wound.color }}>{wound.text}</span>
        </div>
        <Bar value={c.currentHp} max={c.maxHp} color={wound.color} />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <span className={small}>SP cabeza {c.headSp}/{c.headSpMax}</span>
        <span className={small}>SP cuerpo {c.bodySp}/{c.bodySpMax}</span>
        <span className={small}>Suerte {c.luck}/{c.luckMax}</span>
        <span className={small}>Humanidad {c.humanity}/{c.humanityMax}</span>
        <span className={small}>€$ {c.eurodollars}</span>
      </div>
      {c.weapon && (
        <p className={small}>
          🔫 {c.weapon.name}
          {c.weapon.mag !== null && <> · {c.weapon.mag}/{c.weapon.magMax} · reserva {c.weapon.reserve}</>}
        </p>
      )}
      {(c.conditions.length > 0 || c.injuries.length > 0) && (
        <p className="text-[11px] font-mono-code text-[#f97316]">{[...c.conditions, ...c.injuries].join(' · ')}</p>
      )}
    </button>
  );
}

/** Jugador de la mesa cuya ficha todavía no cargó: se muestra el resumen público. */
function SummaryCard({ s }: { s: PartySummary }) {
  return (
    <div className={card}>
      <span className="font-tech font-bold text-white uppercase">{s.handle}</span>
      <p className={small}>HP {s.currentHp}/{s.maxHp} · SP {s.headSp}/{s.bodySp} · cargando la ficha…</p>
    </div>
  );
}

export function GmModeView() {
  const { table, isGm } = useActiveTable();
  const characters = useCharacterStore((s) => s.characters);
  const party = useCloudState((s) => (table ? s.party[table.id] : undefined));
  const encounter = useEncounterStore();
  const [targetId, setTargetId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const online = !!table && isGm;
  // Con mesa: los jugadores de la party. Sin mesa: las fichas locales de jugador.
  const players = useMemo(() => {
    if (online) {
      const ids = Object.keys(party ?? {});
      return ids.map((id) => ({ id, sheet: characters.find((c) => c.id === id), summary: party?.[id] }));
    }
    return characters.filter((c) => c.sheetKind !== 'npc').map((c) => ({ id: c.id, sheet: c, summary: undefined }));
  }, [online, party, characters]);

  const combatants = orderedCombatants(encounter);
  const current = combatants[encounter.turnIndex];

  // Core p.168: REF + 1d10 para todos. En la mesa, la iniciativa del jugador la tira su dispositivo:
  // el GM solo lo suma al encuentro.
  const rollAll = () => {
    const st = useEncounterStore.getState();
    for (const p of players) {
      const name = p.sheet?.handle ?? p.summary?.handle ?? '';
      if (!st.combatants.some((c) => c.kind === 'pc' && c.charId === p.id)) st.addPc(p.id, name, p.summary?.ownerUid);
    }
    const now = useEncounterStore.getState().combatants;
    const targets = now
      .filter((c) => (c.kind === 'enemy' ? !!c.enemy : !online))
      .map((c) => ({
        id: c.id,
        ref: c.kind === 'enemy' ? c.enemy?.stats.REF ?? 0 : characters.find((ch) => ch.id === c.charId)?.stats.REF ?? 0,
      }));
    for (const r of rollInitiativeForAll(targets)) st.setInitiative(r.id, r.total);
    setFeedback(online ? 'Iniciativa tirada para los enemigos; cada jugador tira la suya.' : 'Iniciativa tirada para todos (REF + 1d10, Core p.168).');
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <h2 className="font-tech text-base font-bold text-white uppercase tracking-wider">🎛️ Modo GM</h2>
        <p className={small}>
          {online ? `Mesa: ${table?.name}. ` : 'Sin mesa online: se muestran las fichas de jugador de este navegador. '}
          Tocá un jugador para aplicarle daño, condiciones, críticas o plata.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <section className="space-y-2">
          <h3 className="font-tech text-sm font-bold text-[#22d3ee] uppercase">Jugadores ({players.length})</h3>
          {players.length === 0 && <p className={small}>No hay jugadores todavía.</p>}
          <div className="grid gap-2">
            {players.map((p) =>
              p.sheet ? (
                <PlayerCard key={p.id} c={buildGmPlayerCard(p.sheet)} onOpen={() => setTargetId(p.id)} />
              ) : p.summary ? (
                <SummaryCard key={p.id} s={p.summary} />
              ) : null
            )}
          </div>
          {/* v5.23.0 (plan 28): pedir tiradas, solo con mesa online. [Claude Code · 2026-11-12] */}
          {online && (
            <RollRequestsPanel
              targets={players.map((p) => ({ id: p.id, handle: p.sheet?.handle ?? p.summary?.handle ?? '', ownerUid: p.summary?.ownerUid }))}
            />
          )}
        </section>

        <section className="space-y-2">
          <h3 className="font-tech text-sm font-bold text-[#22d3ee] uppercase">Encuentro · Ronda {encounter.round}</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={rollAll}>⚡ Iniciativa de todos</button>
            <button type="button" className={btn} onClick={() => encounter.nextTurn()} disabled={combatants.length === 0}>Siguiente turno</button>
            <button type="button" className={btn} onClick={() => encounter.nextRound()} disabled={combatants.length === 0}>Siguiente ronda</button>
          </div>
          {feedback && <p className="text-[11px] font-mono-code text-[#10b981]">{feedback}</p>}
          <div className={card}>
            {combatants.length === 0 && <p className={small}>No hay nadie en el encuentro. Los enemigos se suman desde el bestiario.</p>}
            <ol className="space-y-1">
              {combatants.map((c) => c.enemy ? (
                <EnemyRow key={c.id} c={c} active={current?.id === c.id} />
              ) : (
                <li key={c.id} className={`flex justify-between gap-2 text-[12px] font-mono-code px-1 ${current?.id === c.id ? 'bg-[#22d3ee]/10 text-white' : 'text-[#cbd5e1]'}`}>
                  <span>
                    {current?.id === c.id ? '▶ ' : ''}
                    {c.kind === 'pc' ? '🧑 ' : '💀 '}
                    {c.name}
                  </span>
                  <span className="text-[#94a3b8]">
                    Init {c.initiative ?? '—'}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className={small}>Tocá un enemigo para ver sus balas y heridas. "Sacar del combate" lo deja guardado en Actores.</p>
        </section>

        <ActorsColumn />
      </div>

      {targetId && <GmTargetDialog charId={targetId} onClose={() => setTargetId(null)} />}
    </div>
  );
}
