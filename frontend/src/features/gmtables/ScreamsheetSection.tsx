// [Claude Code · 2026-11-13] v5.30.0 (plan 31): generador de screamsheets, Interface RED Vol. 5 pp.83-96.
import { useMemo, useState } from 'react';
import { SCREAMSHEET_BYLINES, SCREAMSHEET_KINDS, SCREAMSHEET_STEPS, SCREAMSHEET_TOKENS, type ScreamsheetKindId } from '../../data/gmTables/screamsheet';
import {
  allowedHeadlines,
  kindById,
  rawTexts,
  rollScreamsheet,
  screamsheetPlain,
  screamsheetText,
  screamsheetTokens,
  type RolledScreamsheet,
} from '../../engine/screamsheet';

const card = 'chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3';
const btn = 'px-3 py-1.5 bg-[#1a2030] hover:bg-[#22d3ee] hover:text-black text-[11px] font-tech font-bold uppercase rounded-xs cursor-pointer disabled:opacity-40';
const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const field = 'bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white';

export function ScreamsheetSection() {
  const [kind, setKind] = useState<ScreamsheetKindId | 'random'>('random');
  const [sheet, setSheet] = useState<RolledScreamsheet | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setSheet(rollScreamsheet(Math.random, kind === 'random' ? {} : { kind }));
    setValues({});
    setCopied(false);
  };

  const tokens = useMemo(() => (sheet ? screamsheetTokens(rawTexts(sheet)) : []), [sheet]);
  const text = sheet ? screamsheetText(sheet, values) : null;
  const hint = (t: string) => SCREAMSHEET_TOKENS.find((x) => x.token === t)?.hint ?? '';
  const k = sheet ? kindById(sheet.kind) : null;

  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(screamsheetPlain(text));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <h3 className="font-tech text-sm font-bold text-white uppercase">Cómo se arma</h3>
        <ol className="list-decimal pl-5 space-y-0.5">{SCREAMSHEET_STEPS.map((s) => <li key={s} className={small}>{s}</li>)}</ol>
        <span className="text-[10px] font-mono-code text-[#64748b]">Interface RED Vol. 5 pp.83-96</span>
      </div>

      <div className={card}>
        <div className="flex flex-wrap items-center gap-2">
          <select className={field} value={kind} onChange={(e) => setKind(e.target.value as ScreamsheetKindId | 'random')} aria-label="Tipo de nota">
            <option value="random">Tipo al azar (Tabla A, 1d6)</option>
            {SCREAMSHEET_KINDS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title} ({x.typeRoll})
              </option>
            ))}
          </select>
          <button type="button" className={btn} onClick={generate}>
            🎲 Generar screamsheet
          </button>
        </div>

        {sheet && k && text && (
          <div className="space-y-3" data-testid="screamsheet-result">
            <p className={small}>
              {k.title} ({k.titleEn}) · Tabla A {sheet.typeRoll} · intro {sheet.introRoll} · cuerpo {sheet.bodyRoll} · cierre {sheet.conclusionRoll} · titular{' '}
              <select
                className={field}
                value={sheet.headlineRoll}
                aria-label="Titular"
                onChange={(e) => setSheet({ ...sheet, headlineRoll: Number(e.target.value) })}
              >
                {allowedHeadlines(k, sheet.conclusionRoll).map((n) => (
                  <option key={n} value={n}>
                    {k.headlines.find((h) => h.roll === n)?.code}
                  </option>
                ))}
              </select>
              {' · firma '}
              <select
                className={field}
                value={sheet.byline ?? ''}
                aria-label="Firma"
                onChange={(e) => setSheet({ ...sheet, byline: e.target.value === '' ? null : Number(e.target.value) })}
              >
                <option value="">Sin firma</option>
                {SCREAMSHEET_BYLINES.map((b, i) => (
                  <option key={b.name} value={i}>
                    {b.name}
                  </option>
                ))}
              </select>
            </p>

            {tokens.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {tokens.map((t) => (
                  <label key={t} className="flex flex-col gap-0.5">
                    <span className={small}>
                      {t}
                      {hint(t) ? ` · ${hint(t)}` : ''}
                    </span>
                    <input className={field} value={values[t] ?? ''} onChange={(e) => setValues({ ...values, [t]: e.target.value })} />
                  </label>
                ))}
              </div>
            )}

            <article className="bg-[#f5f1e6] text-[#1a1a1a] p-4 rounded-xs space-y-2 font-serif">
              <h4 className="text-lg font-black uppercase leading-tight">{text.headline}</h4>
              {text.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-snug">
                  {p}
                </p>
              ))}
              {text.byline && <p className="text-xs italic">— {text.byline}</p>}
            </article>
            <div className="flex items-center gap-2">
              <button type="button" className={btn} onClick={copy}>
                📋 Copiar texto
              </button>
              {copied && <span className="text-[11px] font-mono-code text-[#4ade80]">Copiado.</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
