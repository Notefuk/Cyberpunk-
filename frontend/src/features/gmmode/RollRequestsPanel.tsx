// [Claude Code · 2026-11-12] v5.23.0 (plan 28): el GM pide tiradas a uno o varios jugadores y ve el resultado.
// Solo con mesa online: el pedido viaja por campaigns/{c}/rollRequests (sync/rollRequests.ts).
import { useMemo, useState } from 'react';
import { useRollRequests } from '../../sync/rollRequests';
import { useAuthStore } from '../../sync/authStore';
import { newRollRequest, requestableSkills, requestSucceeded, describeResult, ROLL_REQUEST_DV_MAX } from '../../engine/rollRequest';

const card = 'bg-[#0f1219] border border-[#1e2334] rounded-xs p-3 space-y-2';
const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const input = 'bg-[#0a0d14] border border-[#262b3c] text-[12px] font-mono-code text-white px-2 py-1 rounded-xs min-w-0';
const btn = 'font-tech text-[11px] uppercase px-2 py-1 border border-[#262b3c] text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

// Core p.129: DV de referencia (Simple 9, Everyday 13, Difficult 15, Professional 17, Heroic 21, Incredible 24, Legendary 29).
const DV_PRESETS = [9, 13, 15, 17, 21, 24, 29];

export interface RequestTarget {
  id: string;
  handle: string;
  ownerUid?: string;
}

export function RollRequestsPanel({ targets }: { targets: RequestTarget[] }) {
  const uid = useAuthStore((s) => s.user?.uid);
  const requests = useRollRequests((s) => s.requests);
  const adapter = useRollRequests((s) => s.adapter);
  const skills = useMemo(() => requestableSkills(), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [skill, setSkill] = useState('Perception');
  const [dv, setDv] = useState(15);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  const ready = targets.filter((t) => t.ownerUid);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const send = async () => {
    if (!adapter || !uid) return;
    const chosen = ready.filter((t) => selected.includes(t.id));
    if (chosen.length === 0) {
      setMsg('Elegí al menos un jugador.');
      return;
    }
    try {
      for (const t of chosen) {
        await adapter.create(newRollRequest({ targetCharId: t.id, targetUid: t.ownerUid!, targetHandle: t.handle, skill, dv, note }, uid));
      }
      setMsg(`Pedido: ${skill} DV ${dv} a ${chosen.map((t) => t.handle).join(', ')}.`);
      setNote('');
    } catch (e) {
      console.warn('[mesa] pedir tirada:', e);
      setMsg('No se pudo mandar el pedido.');
    }
  };

  const cancel = (id: string) => void adapter?.cancel(id).catch((e) => console.warn('[mesa] cancelar pedido:', e));
  const clearDone = () => {
    for (const r of requests) if (r.status === 'done') cancel(r.id);
  };

  if (!adapter) return null;

  return (
    <div className={card}>
      <h4 className="font-tech text-xs font-bold text-amber-300 uppercase">🎲 Pedir tirada</h4>
      <div className="flex flex-wrap gap-1.5">
        {ready.map((t) => (
          <label key={t.id} className={`text-[11px] font-mono-code px-1.5 py-0.5 border cursor-pointer ${selected.includes(t.id) ? 'border-amber-400 text-amber-200' : 'border-[#262b3c] text-[#94a3b8]'}`}>
            <input type="checkbox" className="mr-1 align-middle" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} />
            {t.handle || 'Sin handle'}
          </label>
        ))}
        {ready.length > 1 && (
          <button type="button" className={btn} onClick={() => setSelected(selected.length === ready.length ? [] : ready.map((t) => t.id))}>
            {selected.length === ready.length ? 'Ninguno' : 'Todos'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <select className={input} value={skill} onChange={(e) => setSkill(e.target.value)} aria-label="Skill">
          {skills.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className={`${input} w-16`} type="number" min={0} max={ROLL_REQUEST_DV_MAX} value={dv} onChange={(e) => setDv(Math.max(0, Math.min(ROLL_REQUEST_DV_MAX, Number(e.target.value) || 0)))} aria-label="DV" />
      </div>
      <div className="flex flex-wrap gap-1">
        {DV_PRESETS.map((v) => (
          <button key={v} type="button" className={`${btn} ${dv === v ? 'border-amber-400 text-amber-200' : ''}`} onClick={() => setDv(v)}>DV {v}</button>
        ))}
      </div>
      <input className={`${input} w-full`} maxLength={200} placeholder="Nota (opcional): qué buscan, qué ven…" value={note} onChange={(e) => setNote(e.target.value)} />
      <button type="button" className={btn} onClick={() => void send()} disabled={selected.length === 0}>Pedir</button>
      {msg && <p className="text-[11px] font-mono-code text-[#10b981]">{msg}</p>}

      {requests.length > 0 && (
        <div className="space-y-1 pt-1 border-t border-[#1e2334]">
          <div className="flex justify-between items-center">
            <span className={small}>Pedidos</span>
            {requests.some((r) => r.status === 'done') && <button type="button" className={btn} onClick={clearDone}>Limpiar hechos</button>}
          </div>
          <ul className="space-y-1">
            {requests.map((r) => {
              const ok = requestSucceeded(r);
              const color = ok === null ? '#facc15' : ok ? '#10b981' : '#ef4444';
              return (
                <li key={r.id} className="text-[11px] font-mono-code flex gap-2 items-start">
                  <span className="min-w-0 flex-1">
                    <span className="text-white">{r.targetHandle}</span> · {r.skill} DV {r.dv} ·{' '}
                    <span style={{ color }}>{r.status === 'pending' ? 'esperando…' : describeResult(r)}</span>
                  </span>
                  {r.status === 'pending' && (
                    <button type="button" className="text-[10px] text-slate-500 hover:text-red-300 cursor-pointer" onClick={() => cancel(r.id)}>Cancelar</button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
