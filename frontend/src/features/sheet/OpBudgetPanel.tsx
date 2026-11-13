// [Claude Code · 2026-11-13] v5.34.0 (plan 31): presupuesto operativo de una misión mercenaria (Interface RED Vol. 5 p.108).
import { useState } from 'react';
import type { CharacterSheet, InventoryItem } from '../../types/cyberpunk';
import { useCharacterStore } from '../../store/useCharacterStore';
import { BOOK_MISSION_BUDGETS, MISSION_PARAMETERS, opBudgetLeft, opBudgetSpent } from '../../engine/opBudget';

const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const field = 'bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white';
const btn = 'px-2 py-1 bg-[#1a2030] hover:bg-[#facc15] hover:text-black text-[10px] font-tech font-bold uppercase rounded-xs cursor-pointer disabled:opacity-40';

const CATEGORIES: { id: InventoryItem['category'] | ''; label: string }[] = [
  { id: 'gear', label: 'Equipo' },
  { id: 'weapons', label: 'Arma' },
  { id: 'armor', label: 'Armadura' },
  { id: 'ammunition', label: 'Munición' },
  { id: 'attachments', label: 'Accesorio' },
  { id: 'drugs', label: 'Droga' },
  { id: '', label: 'No va a la mochila (servicio, ACPA, vehículo…)' },
];

export function OpBudgetPanel({ character }: { character: CharacterSheet }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ mission: '', total: '' });
  const [buy, setBuy] = useState({ name: '', cost: '', category: 'gear' as InventoryItem['category'] | '' });
  const [msg, setMsg] = useState('');
  const start = useCharacterStore((s) => s.startOpBudget);
  const spend = useCharacterStore((s) => s.spendOpBudget);
  const close = useCharacterStore((s) => s.closeOpBudget);
  const b = character.opBudget;

  return (
    <div className="chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3" data-testid="opbudget-panel">
      <button type="button" className="w-full flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)} aria-expanded={open}>
        <h3 className="font-tech text-sm font-bold text-[#facc15] uppercase">🎖️ Presupuesto operativo</h3>
        <span className={small}>
          {b ? `${b.mission}: quedan ${opBudgetLeft(b)}eb · ` : ''}IR5 p.108 {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <>
          <p className={small}>
            Plata del empleador para equiparte en una misión mercenaria, aparte de tus €$. Lo que compres con ella vuelve al armory al terminar y lo que no gastes se pierde.
          </p>
          {!b && (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <input className={field} placeholder="Misión" value={draft.mission} onChange={(e) => setDraft({ ...draft, mission: e.target.value })} aria-label="Nombre de la misión" />
                <input className={`${field} w-24`} inputMode="numeric" placeholder="eb" value={draft.total} onChange={(e) => setDraft({ ...draft, total: e.target.value })} aria-label="Presupuesto por persona" />
                <button
                  type="button"
                  className={btn}
                  disabled={!draft.mission.trim() || !(Number(draft.total) > 0)}
                  onClick={() => {
                    start(draft.mission, Number(draft.total));
                    setMsg('');
                  }}
                >
                  Empezar misión
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BOOK_MISSION_BUDGETS.map((m) => (
                  <button key={m.mission} type="button" className={btn} onClick={() => setDraft({ mission: m.mission, total: String(m.total) })}>
                    {m.mission} ({m.total}eb, p.{m.page})
                  </button>
                ))}
              </div>
              <p className={small}>
                Guía del libro (por persona): {MISSION_PARAMETERS.map((p) => `${p.label} ${p.budget[0]}-${p.budget[1]}eb`).join(' · ')}.
              </p>
            </div>
          )}
          {b && (
            <div className="space-y-2">
              <p className="text-[12px] font-mono-code text-white">
                {b.mission}: {b.total}eb · gastado {opBudgetSpent(b)}eb · quedan <b className="text-[#facc15]">{opBudgetLeft(b)}eb</b>
              </p>
              {b.purchases.length > 0 && (
                <ul className="list-disc pl-5">
                  {b.purchases.map((p, i) => (
                    <li key={i} className={small}>
                      {p.name}: {p.cost}eb{p.inventoryId ? ' (en la mochila)' : ''}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                <input className={field} placeholder="Qué comprás" value={buy.name} onChange={(e) => setBuy({ ...buy, name: e.target.value })} aria-label="Compra con el presupuesto" />
                <input className={`${field} w-20`} inputMode="numeric" placeholder="eb" value={buy.cost} onChange={(e) => setBuy({ ...buy, cost: e.target.value })} aria-label="Costo de la compra" />
                <select className={field} value={buy.category} onChange={(e) => setBuy({ ...buy, category: e.target.value as InventoryItem['category'] | '' })} aria-label="Dónde va">
                  {CATEGORIES.map((c) => (
                    <option key={c.label} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={btn}
                  disabled={!buy.name.trim() || !(Number(buy.cost) > 0)}
                  onClick={() => {
                    const ok = spend(buy.name, Number(buy.cost), buy.category || null);
                    setMsg(ok ? `Compraste ${buy.name.trim()} con el presupuesto.` : `No alcanza: quedan ${opBudgetLeft(b)}eb.`);
                    if (ok) setBuy({ ...buy, name: '', cost: '' });
                  }}
                >
                  Comprar
                </button>
              </div>
              <button
                type="button"
                className={btn}
                onClick={() => {
                  const r = close();
                  if (r) setMsg(`Misión cerrada: ${r.returned === 1 ? '1 ítem volvió' : `${r.returned} ítems volvieron`} al armory y se perdieron ${r.lost}eb sin gastar.`);
                }}
              >
                Terminar misión
              </button>
            </div>
          )}
          {msg && <p className="text-[11px] font-mono-code text-[#fde68a]">{msg}</p>}
        </>
      )}
    </div>
  );
}
