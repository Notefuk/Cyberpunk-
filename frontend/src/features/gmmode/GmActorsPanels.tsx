// [Claude Code · 2026-11-12] v5.22.0 (plan 28): enemigos del encuentro con balas y heridas, y la lista de actores guardados.
import { useMemo, useState } from 'react';
import { useEncounterStore, type EncounterCombatant } from '../../store/encounterStore';
import { useGmActors, deleteActor, patchActor } from '../../store/gmActorsStore';
import { HEAD_CRITICAL_INJURIES, BODY_CRITICAL_INJURIES } from '../../data/criticalInjuries';
import { bringActorBack, duplicateActor, healActor, actorSheet } from './actorSpawn';
import type { GmActor } from '../../engine/gmActors';

const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const mini = 'font-mono-code text-[10px] px-1.5 py-0.5 border border-[#262b3c] text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const field = 'bg-[#0c0d12] border border-[#262b3c] text-white font-mono-code text-[11px] px-1.5 py-0.5 rounded-xs';

const INJURY_NAMES = [
  ...BODY_CRITICAL_INJURIES.map((i) => `${i.name} (cuerpo)`),
  ...HEAD_CRITICAL_INJURIES.map((i) => `${i.name} (cabeza)`),
];

/** Enemigo del encuentro: HP, balas por arma (gastar y recargar, Core p.169) y heridas críticas (Core pp.187-188). */
export function EnemyRow({ c, active }: { c: EncounterCombatant; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [injury, setInjury] = useState('');
  const st = useEncounterStore.getState;
  const e = c.enemy!;
  const ammo = e.ammo ?? e.weapons.map((w) => ({ current: w.mag, reserve: 0 }));
  return (
    <li className={`px-1 py-0.5 ${active ? 'bg-[#22d3ee]/10' : ''}`}>
      <div className="flex justify-between gap-2 text-[12px] font-mono-code">
        <button type="button" onClick={() => setOpen(!open)} className="text-left text-[#cbd5e1] hover:text-white cursor-pointer">
          {active ? '▶ ' : ''}💀 {c.name} {e.actorId ? '' : '(sin guardar)'}
        </button>
        <span className="text-[#94a3b8]">HP {e.currentHp}/{e.maxHp} · Init {c.initiative ?? '—'}</span>
      </div>
      {open && (
        <div className="pl-4 space-y-1 py-1">
          <div className="flex flex-wrap gap-1 items-center">
            <span className={small}>HP</span>
            {[-5, -1, 1, 5].map((d) => (
              <button key={d} type="button" className={mini} onClick={() => st().adjustEnemyHp(c.id, d)}>{d > 0 ? `+${d}` : d}</button>
            ))}
            <span className={small}>SP {e.currentHeadSp}/{e.currentBodySp}</span>
            <button type="button" className={mini} onClick={() => st().remove(c.id)} title="El actor queda guardado con su estado">Sacar del combate</button>
          </div>
          {e.weapons.map((w, i) => (
            <div key={`${w.name}-${i}`} className="flex flex-wrap gap-1 items-center">
              <span className={small}>🔫 {w.name}</span>
              {w.mag > 0 ? (
                <>
                  <span className="text-[11px] font-mono-code text-white">{ammo[i]?.current ?? 0}/{w.mag}</span>
                  <span className={small}>· reserva</span>
                  <input
                    type="number" min={0} className={`${field} w-14`} value={ammo[i]?.reserve ?? 0}
                    onChange={(ev) => st().setEnemyReserve(c.id, i, Number(ev.target.value) || 0)}
                  />
                  <button type="button" className={mini} onClick={() => st().spendEnemyAmmo(c.id, i, 1)} disabled={(ammo[i]?.current ?? 0) <= 0}>−1</button>
                  <button type="button" className={mini} onClick={() => st().spendEnemyAmmo(c.id, i, 10)} disabled={(ammo[i]?.current ?? 0) < 10} title="Autofire o supresión: 10 balas (Core p.173)">−10</button>
                  <button type="button" className={mini} onClick={() => st().reloadEnemyWeapon(c.id, i)} title="Reload (Core p.169)">Recargar</button>
                </>
              ) : (
                <span className={small}>(cuerpo a cuerpo)</span>
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-1 items-center">
            {(e.injuries ?? []).map((inj, i) => (
              <button key={`${inj}-${i}`} type="button" className={`${mini} text-[#f97316]`} onClick={() => st().removeEnemyInjury(c.id, i)} title="Quitar">
                {inj} ✕
              </button>
            ))}
            <select className={`${field} max-w-[12rem]`} value={injury} onChange={(ev) => setInjury(ev.target.value)}>
              <option value="">+ Herida crítica…</option>
              {INJURY_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <button type="button" className={mini} disabled={!injury} onClick={() => { st().addEnemyInjury(c.id, injury); setInjury(''); }}>Agregar</button>
          </div>
        </div>
      )}
    </li>
  );
}

type Filter = 'all' | 'combat' | 'saved';

function ActorCard({ a, inCombat }: { a: GmActor; inCombat: boolean }) {
  const [open, setOpen] = useState(false);
  const sheet = actorSheet(a);
  const s = a.state;
  const ammo = sheet
    ? sheet.weapons.map((w, i) => (w.mag > 0 ? `${w.name} ${s.ammo[i]?.current ?? 0}/${w.mag} (+${s.ammo[i]?.reserve ?? 0})` : null)).filter(Boolean)
    : [];
  const broken = !a.quick && !sheet;
  return (
    <div className="bg-[#0f1219] border border-[#1e2334] rounded-xs p-2 space-y-1">
      <div className="flex justify-between gap-2">
        <button type="button" onClick={() => setOpen(!open)} className="font-tech font-bold text-white uppercase text-left cursor-pointer">{a.name}</button>
        <span className={`text-[10px] font-mono-code ${inCombat ? 'text-[#22d3ee]' : 'text-[#64748b]'}`}>{inCombat ? 'EN COMBATE' : 'GUARDADO'}</span>
      </div>
      <p className={small}>
        HP {s.hp}/{s.maxHp} · SP {s.headSp}/{s.bodySp}
        {s.injuries.length > 0 && <span className="text-[#f97316]"> · {s.injuries.length} herida(s)</span>}
      </p>
      {ammo.length > 0 && <p className={small}>{ammo.join(' · ')}</p>}
      {broken && <p className="text-[11px] font-mono-code text-[#ef4444]">La ficha de origen ya no existe: no se puede traer al combate.</p>}
      <div className="flex flex-wrap gap-1">
        <button type="button" className={mini} disabled={inCombat || broken} onClick={() => bringActorBack(a)}>Traer al combate</button>
        <button type="button" className={mini} disabled={broken} onClick={() => duplicateActor(a)}>Duplicar</button>
        <button type="button" className={mini} disabled={inCombat} onClick={() => healActor(a)} title="HP y SP al máximo, sin heridas, recarga con la reserva">Curar a tope</button>
        <button
          type="button" className={`${mini} hover:border-[#ef4444] hover:text-[#ef4444]`} disabled={inCombat}
          onClick={() => { if (window.confirm(`¿Borrar a ${a.name}? No se puede deshacer.`)) deleteActor(a.id); }}
        >
          Borrar
        </button>
      </div>
      {open && (
        <div className="space-y-1">
          {s.injuries.length > 0 && <p className="text-[11px] font-mono-code text-[#f97316]">{s.injuries.join(' · ')}</p>}
          <textarea
            className={`${field} w-full h-16`} placeholder="Notas del GM sobre este actor" value={a.notes}
            onChange={(ev) => patchActor(a.id, { notes: ev.target.value })}
          />
        </div>
      )}
    </div>
  );
}

/** Lista de actores guardados (como los actores de Foundry). */
export function ActorsColumn() {
  const actors = useGmActors((s) => s.actors);
  const cloud = useGmActors((s) => s.cloud);
  const combatants = useEncounterStore((s) => s.combatants);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const inCombat = useMemo(() => new Set(combatants.map((c) => c.enemy?.actorId).filter(Boolean) as string[]), [combatants]);
  const shown = actors.filter((a) => {
    if (filter === 'combat' && !inCombat.has(a.id)) return false;
    if (filter === 'saved' && inCombat.has(a.id)) return false;
    return !q.trim() || a.name.toLowerCase().includes(q.trim().toLowerCase());
  });
  return (
    <section className="space-y-2">
      <h3 className="font-tech text-sm font-bold text-[#22d3ee] uppercase">Actores ({actors.length})</h3>
      <p className={small}>
        Cada enemigo que spawneás queda acá con su estado. {cloud ? 'Se guardan en la campaña (solo los ve el GM).' : 'Se guardan en este navegador.'}
      </p>
      <div className="flex flex-wrap gap-1">
        <input className={`${field} flex-1 min-w-0`} placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
        {(['all', 'combat', 'saved'] as Filter[]).map((f) => (
          <button key={f} type="button" className={`${mini} ${filter === f ? 'border-[#22d3ee] text-[#22d3ee]' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Todos' : f === 'combat' ? 'En combate' : 'Guardados'}
          </button>
        ))}
      </div>
      {actors.length === 0 && <p className={small}>Todavía no hay actores. Spawneá enemigos desde el bestiario o el Fixer.</p>}
      <div className="space-y-2">
        {shown.map((a) => <ActorCard key={a.id} a={a} inCombat={inCombat.has(a.id)} />)}
      </div>
    </section>
  );
}
