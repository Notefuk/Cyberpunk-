// v5.3.0 [Claude Code · 2026-10-28]: handouts del GM para la mesa (plan 20, B.2; decisión 4).
// El GM escribe una pista o descripción y le llega a toda la mesa; en el HUD aparece el último que no viste.
import React, { useState } from 'react';
import { useTableReveals, HANDOUT_TEXT_MAX, HANDOUT_TITLE_MAX } from '../../sync/tableReveals';
import { useActiveTable } from '../../sync/tableSync';

const SEEN_KEY = 'cpr_seen_handout_v1';
const readSeen = () => {
  try { return localStorage.getItem(SEEN_KEY) ?? ''; } catch { return ''; }
};

const field = 'bg-[#0c0d12] border border-[#262b3c] text-white font-mono-code text-xs px-2 py-1 rounded-xs w-full';

export const HandoutsPanel: React.FC = () => {
  const { isGm } = useActiveTable();
  const handouts = useTableReveals((s) => s.handouts);
  const adapter = useTableReveals((s) => s.adapter);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!adapter || !text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await adapter.sendHandout(title, text);
      setTitle('');
      setText('');
    } catch (e) {
      console.warn('[mesa] handout:', e);
      setError('No se pudo mandar. Probá de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="font-tech text-[11px] text-[#64748b] uppercase tracking-wider">De parte del GM</div>
      {isGm && adapter && (
        <div className="space-y-1">
          <input type="text" value={title} maxLength={HANDOUT_TITLE_MAX} placeholder="Título (opcional)" onChange={(e) => setTitle(e.target.value)} className={field} />
          <textarea value={text} maxLength={HANDOUT_TEXT_MAX} rows={3} placeholder="Una pista, una descripción, lo que encuentran…" onChange={(e) => setText(e.target.value)} className={field} />
          <button type="button" onClick={send} disabled={busy || !text.trim()}
            className="font-tech text-[11px] uppercase px-2 py-1 border border-sky-500/60 text-sky-200 hover:bg-sky-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            Mandar a la mesa
          </button>
          {error && <p className="font-mono-code text-[11px] text-red-300">{error}</p>}
        </div>
      )}
      {handouts.length === 0 ? (
        <p className="font-mono-code text-xs text-[#64748b]">Todavía no hay nada.</p>
      ) : (
        <ul className="space-y-1.5">
          {handouts.map((h) => (
            <li key={h.id} className="font-mono-code text-xs text-[#cbd5e1] border-l-2 border-sky-500/50 pl-2">
              <div className="flex items-center gap-2">
                <span className="text-sky-200 font-bold">{h.title}</span>
                {h.at && <span className="text-[10px] text-[#64748b]">{new Date(h.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                {isGm && adapter && (
                  <button type="button" onClick={() => void adapter.deleteHandout(h.id).catch((e) => console.warn('[mesa] handout:', e))}
                    className="ml-auto text-[10px] text-slate-500 hover:text-red-300 cursor-pointer">Borrar</button>
                )}
              </div>
              <div className="whitespace-pre-wrap">{h.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** Aviso en el HUD: el último handout que este dispositivo todavía no vio. */
export const HandoutNotice: React.FC = () => {
  const handouts = useTableReveals((s) => s.handouts);
  const [seen, setSeen] = useState(readSeen);
  const last = handouts[0];
  if (!last || last.id === seen) return null;
  const dismiss = () => {
    try { localStorage.setItem(SEEN_KEY, last.id); } catch { /* sin almacenamiento: solo en memoria */ }
    setSeen(last.id);
  };
  return (
    <div className="w-full chamfer-card bg-sky-950/30 border border-sky-500/50 p-2 font-mono-code text-xs text-slate-200 flex gap-2 items-start min-w-0">
      <div className="min-w-0">
        <div className="text-sky-200 font-bold">📜 De parte del GM: {last.title}</div>
        <div className="whitespace-pre-wrap break-words">{last.text}</div>
      </div>
      <button type="button" onClick={dismiss} className="ml-auto shrink-0 font-tech text-[10px] uppercase px-1.5 border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 cursor-pointer">Visto</button>
    </div>
  );
};
