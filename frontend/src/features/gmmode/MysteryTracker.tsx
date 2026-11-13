// [Claude Code · 2026-11-13] v5.32.0 (plan 31): tracker de misterios del GM, "Did Someone Say Murder?" (Interface RED Vol. 5 pp.61-70).
// Con mesa de GM se guarda en campaigns/{c}/gm/mysteries (solo el GM); sin mesa, en este navegador (cpr_gm_mysteries_v1).
// El Focus que pierde un PJ se le baja de la ficha, como el daño del GM, y va al log de la mesa.
import { useState } from 'react';
import { GM_SECRET_LOCAL_KEYS, useGmSecretBinding } from '../../sync/gmSecrets';
import { publishGmAction } from '../../sync/tableSync';
import { useCharacterStore } from '../../store/useCharacterStore';
import { CLUE_TYPES, MYSTERY_COMPLEXITY, MYSTERY_RULES, MYSTERY_SOURCE, OBFUSCATION_LEVELS, OBSTACLE_TYPES, SAMPLE_MYSTERIES } from '../../data/mysteryData';
import {
  MYSTERY_LIMITS,
  applyEvidence,
  evidenceCheck,
  mysteryFromTemplate,
  newMystery,
  obstacleFocusDamage,
  parseMysteries,
  type Mystery,
  type MysteryClue,
} from '../../engine/mystery';

const LOCAL_KEY = GM_SECRET_LOCAL_KEYS.mysteries;
const card = 'bg-[#0f1219] border border-[#1e2334] rounded-xs p-3 space-y-2';
const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const field = 'bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white';
const btn = 'font-tech text-[11px] uppercase px-2 py-1 border border-[#262b3c] text-[#cbd5e1] hover:border-[#a78bfa] hover:text-[#a78bfa] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

function readLocal(): Mystery[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? parseMysteries(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

const uid = () => Math.random().toString(36).slice(2, 9);
const cut = (s: string) => s.slice(0, MYSTERY_LIMITS.text);

export function MysteryTracker({ players }: { players: { id: string; handle: string }[] }) {
  const [list, setList] = useState<Mystery[]>(readLocal);
  const [selId, setSelId] = useState<string>('');
  const [pcId, setPcId] = useState<string>('');
  const [draft, setDraft] = useState({ title: '', goal: '', complexity: 50 });
  const [clueDraft, setClueDraft] = useState({ type: CLUE_TYPES[0].id, dv: 13, obfuscation: 0, text: '' });
  const [obsDraft, setObsDraft] = useState({ type: OBSTACLE_TYPES[0].label, text: '' });
  const [totals, setTotals] = useState<Record<string, { total: string; nat1: boolean }>>({});
  const adjustFocusFor = useCharacterStore((s) => s.adjustFocusFor);
  const { cloud, campName } = useGmSecretBinding('mysteries', list, (v) => setList(parseMysteries(v)), readLocal);

  const save = (next: Mystery[]) => {
    setList(next);
    if (!cloud) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      } catch {
        /* sin almacenamiento: queda en memoria */
      }
    }
  };
  const sel = list.find((m) => m.id === selId) ?? list[0];
  const update = (m: Mystery) => save(list.map((x) => (x.id === m.id ? m : x)));
  const pc = players.find((p) => p.id === pcId);
  const who = pc?.handle || 'Crew';

  const loseFocus = (n: number, label: string) => {
    if (!pc || n <= 0) return '';
    adjustFocusFor(pc.id, -n);
    publishGmAction({ targetCharId: pc.id, targetHandle: pc.handle, label, detail: `−${n} Focus (IR5 p.63)`, total: n });
    return ` ${pc.handle} pierde ${n} de Focus.`;
  };

  const add = (m: Mystery) => {
    if (list.length >= MYSTERY_LIMITS.mysteries) return;
    save([m, ...list]);
    setSelId(m.id);
  };

  const check = (m: Mystery, c: MysteryClue) => {
    const t = totals[c.id];
    const total = Number(t?.total);
    if (!Number.isFinite(total) || t?.total === '') return;
    const r = evidenceCheck(c, total, t?.nat1 ? 1 : 2);
    const extra = r.success ? '' : loseFocus(r.focusDamage, `Evidence Check: ${c.type}`);
    const next = applyEvidence(m, c.id, { ...r, text: r.text + extra }, who);
    update(next.complexity === 0 && m.complexity > 0 ? { ...next, log: [`🔓 Complexity en 0: la Crew tiene todo para resolverlo.`, ...next.log] } : next);
    setTotals({ ...totals, [c.id]: { total: '', nat1: false } });
  };

  const obstacle = (m: Mystery, id: string, overcome: boolean) => {
    const o = m.obstacles.find((x) => x.id === id)!;
    const n = obstacleFocusDamage(overcome);
    const extra = loseFocus(n, `Obstáculo: ${o.type}`);
    update({
      ...m,
      obstacles: m.obstacles.map((x) => (x.id === id ? { ...x, resolved: overcome || x.resolved } : x)),
      log: [`${who} · ${o.type} ${overcome ? 'superado' : 'fallado'}: ${overcome ? '1d6' : '2d6'} = ${n} de Focus.${extra}`, ...m.log].slice(0, MYSTERY_LIMITS.log),
    });
  };

  const addClue = (m: Mystery) => {
    const t = CLUE_TYPES.find((x) => x.id === clueDraft.type)!;
    if (m.clues.length >= MYSTERY_LIMITS.clues) return;
    const c: MysteryClue = { id: `c-${uid()}`, type: t.label, skill: t.skills, dv: clueDraft.dv, damage: t.damage, obfuscation: clueDraft.obfuscation, focusDamage: t.focusDamage, fumble: t.fumble, text: cut(clueDraft.text) };
    update({ ...m, clues: [...m.clues, c] });
    setClueDraft({ ...clueDraft, text: '' });
  };

  const addObstacle = (m: Mystery) => {
    if (m.obstacles.length >= MYSTERY_LIMITS.obstacles) return;
    update({ ...m, obstacles: [...m.obstacles, { id: `o-${uid()}`, type: obsDraft.type, text: cut(obsDraft.text) }] });
    setObsDraft({ ...obsDraft, text: '' });
  };

  return (
    <section className="space-y-2" data-testid="mystery-tracker">
      <h3 className="font-tech text-sm font-bold text-[#a78bfa] uppercase">🔎 Misterios</h3>
      <p className={small}>
        {cloud ? `Se guardan en la mesa ${campName} (solo vos los ves). ` : 'Se guardan en este navegador. '}
        {MYSTERY_SOURCE}.
      </p>
      <details className={card}>
        <summary className={`${small} cursor-pointer`}>Reglas y tablas</summary>
        <ul className="list-disc pl-5 space-y-0.5">{MYSTERY_RULES.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
        <p className={small}>Obfuscation: {OBFUSCATION_LEVELS.map((o) => `${o.label} ${o.value} (${o.example})`).join(' · ')}</p>
        <p className={small}>Obstáculos: {OBSTACLE_TYPES.map((o) => `${o.label}: ${o.desc}`).join(' · ')}</p>
      </details>

      <div className={card}>
        <div className="flex flex-wrap gap-2 items-center">
          <input className={field} placeholder="Título" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} aria-label="Título del misterio" />
          <select className={field} value={draft.complexity} onChange={(e) => setDraft({ ...draft, complexity: Number(e.target.value) })} aria-label="Complexity">
            {MYSTERY_COMPLEXITY.map((c) => (
              <option key={c.id} value={c.value} title={c.example}>
                {c.label} ({c.value})
              </option>
            ))}
          </select>
          <button type="button" className={btn} disabled={!draft.title.trim()} onClick={() => { add(newMystery(cut(draft.title.trim()), cut(draft.goal.trim()), draft.complexity)); setDraft({ title: '', goal: '', complexity: 50 }); }}>
            + Nuevo misterio
          </button>
          {SAMPLE_MYSTERIES.map((t) => (
            <button key={t.id} type="button" className={btn} onClick={() => add(mysteryFromTemplate(t))}>
              + Ejemplo: {t.title}
            </button>
          ))}
        </div>
        <textarea className={`${field} w-full h-12`} placeholder="Objetivo: qué tiene que averiguar la Crew" value={draft.goal} onChange={(e) => setDraft({ ...draft, goal: e.target.value })} aria-label="Objetivo del misterio" />
      </div>

      {list.length > 0 && sel && (
        <div className={card}>
          <div className="flex flex-wrap gap-2 items-center">
            <select className={field} value={sel.id} onChange={(e) => setSelId(e.target.value)} aria-label="Misterio">
              {list.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.complexity}/{m.complexityMax})
                </option>
              ))}
            </select>
            <label className={small}>
              PJ que tira{' '}
              <select className={field} value={pcId} onChange={(e) => setPcId(e.target.value)} aria-label="PJ que tira">
                <option value="">Nadie en particular</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.handle}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className={btn} onClick={() => save(list.filter((m) => m.id !== sel.id))}>
              Borrar misterio
            </button>
          </div>
          <p className="text-[12px] text-white">{sel.goal}</p>
          <div>
            <div className="flex justify-between text-[11px] font-mono-code">
              <span className="text-white">
                Complexity {sel.complexity}/{sel.complexityMax}
              </span>
              <span className={sel.complexity === 0 ? 'text-[#4ade80]' : 'text-[#a78bfa]'}>{sel.complexity === 0 ? 'Resuelto' : 'En curso'}</span>
            </div>
            <div className="h-1.5 bg-[#1b2234] rounded-xs overflow-hidden">
              <div className="h-full bg-[#a78bfa]" style={{ width: `${sel.complexityMax ? (sel.complexity / sel.complexityMax) * 100 : 0}%` }} />
            </div>
            <div className="flex gap-1.5 mt-1">
              <button type="button" className={btn} onClick={() => update({ ...sel, complexity: 0, log: ['El GM da el misterio por resuelto (p.66).', ...sel.log].slice(0, MYSTERY_LIMITS.log) })}>
                Dar por resuelto
              </button>
              <input className={`${field} flex-1`} placeholder="Ticking Clock: plazo (opcional)" value={sel.clock ?? ''} onChange={(e) => update({ ...sel, clock: cut(e.target.value) || undefined })} aria-label="Ticking Clock" />
            </div>
          </div>

          <h4 className="font-tech text-xs font-bold text-white uppercase">Pistas</h4>
          <div className="space-y-1.5">
            {sel.clues.map((c) => (
              <div key={c.id} className={`border rounded-xs p-2 space-y-1 ${c.collected ? 'border-[#14532d] opacity-70' : 'border-[#1b2336]'}`} data-testid={`clue-${c.id}`}>
                <p className="text-[12px] text-white">
                  <b>{c.type}</b> · {c.skill} DV{c.dv} · daño {c.damage} · Obfuscation {c.obfuscation} · Focus {c.focusDamage} {c.collected ? '· ✅ cobrada' : ''}
                </p>
                <p className={small}>{c.text}</p>
                {c.fumble && <p className="text-[10px] font-mono-code text-[#f97316]">Pifia: {c.fumble}</p>}
                <div className="flex flex-wrap items-center gap-1.5">
                  <input
                    className={`${field} w-20`}
                    inputMode="numeric"
                    placeholder="Total"
                    value={totals[c.id]?.total ?? ''}
                    onChange={(e) => setTotals({ ...totals, [c.id]: { total: e.target.value, nat1: totals[c.id]?.nat1 ?? false } })}
                    aria-label={`Total de la Evidence Check de ${c.type}`}
                  />
                  <label className={`${small} flex items-center gap-1`}>
                    <input type="checkbox" checked={totals[c.id]?.nat1 ?? false} onChange={(e) => setTotals({ ...totals, [c.id]: { total: totals[c.id]?.total ?? '', nat1: e.target.checked } })} />
                    Salió 1 natural
                  </label>
                  <button type="button" className={btn} onClick={() => check(sel, c)} disabled={!totals[c.id]?.total}>
                    Evidence Check
                  </button>
                  <button type="button" className={btn} onClick={() => update({ ...sel, clues: sel.clues.filter((x) => x.id !== c.id) })}>
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <select className={field} value={clueDraft.type} onChange={(e) => setClueDraft({ ...clueDraft, type: e.target.value })} aria-label="Tipo de pista">
              {CLUE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.skills}, {t.damage})
                </option>
              ))}
            </select>
            <label className={small}>
              DV <input className={`${field} w-14`} inputMode="numeric" value={clueDraft.dv} onChange={(e) => setClueDraft({ ...clueDraft, dv: Number(e.target.value) || 0 })} aria-label="DV de la pista" />
            </label>
            <select className={field} value={clueDraft.obfuscation} onChange={(e) => setClueDraft({ ...clueDraft, obfuscation: Number(e.target.value) })} aria-label="Obfuscation">
              {OBFUSCATION_LEVELS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} ({o.value})
                </option>
              ))}
            </select>
            <input className={`${field} flex-1 min-w-[10rem]`} placeholder="Qué descubren" value={clueDraft.text} onChange={(e) => setClueDraft({ ...clueDraft, text: e.target.value })} aria-label="Texto de la pista" />
            <button type="button" className={btn} onClick={() => addClue(sel)}>
              + Pista
            </button>
          </div>

          <h4 className="font-tech text-xs font-bold text-white uppercase">Obstáculos</h4>
          <div className="space-y-1">
            {sel.obstacles.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-1.5">
                <span className={`text-[12px] ${o.resolved ? 'text-[#4ade80]' : 'text-white'}`}>
                  <b>{o.type}</b>: {o.text}
                </span>
                <button type="button" className={btn} onClick={() => obstacle(sel, o.id, true)}>
                  Superado (−1d6)
                </button>
                <button type="button" className={btn} onClick={() => obstacle(sel, o.id, false)}>
                  Fallado (−2d6)
                </button>
                <button type="button" className={btn} onClick={() => update({ ...sel, obstacles: sel.obstacles.filter((x) => x.id !== o.id) })}>
                  Quitar
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <select className={field} value={obsDraft.type} onChange={(e) => setObsDraft({ ...obsDraft, type: e.target.value })} aria-label="Tipo de obstáculo">
              {OBSTACLE_TYPES.map((o) => (
                <option key={o.id} value={o.label} title={o.desc}>
                  {o.label}
                </option>
              ))}
            </select>
            <input className={`${field} flex-1 min-w-[10rem]`} placeholder="Qué pasa" value={obsDraft.text} onChange={(e) => setObsDraft({ ...obsDraft, text: e.target.value })} aria-label="Texto del obstáculo" />
            <button type="button" className={btn} onClick={() => addObstacle(sel)}>
              + Obstáculo
            </button>
          </div>

          {sel.log.length > 0 && (
            <>
              <h4 className="font-tech text-xs font-bold text-white uppercase">Registro</h4>
              <ul className="space-y-0.5">{sel.log.map((l, i) => <li key={i} className={small}>{l}</li>)}</ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
