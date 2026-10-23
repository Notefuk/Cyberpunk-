// Piezas visuales compartidas de los pasos del creador (plan 7, v4.8.3). [Claude Code · 2026-10-22]
import React from 'react';
import type { CreatorDraft } from '../../../engine/characterCreation';
import { CREATOR_GUIDE, type CreatorGuideStep } from '../../../data/creation';
import { useCreatorNoviceStore } from '../../../store/creatorNoviceStore';

/** Props comunes de cada paso: el orquestador es dueño del borrador, los pasos lo modifican con funciones puras. */
export interface StepProps {
  draft: CreatorDraft;
  update: (fn: (d: CreatorDraft) => CreatorDraft) => void;
}

export const SourceBadge: React.FC<{ book: 'CEMK' | 'Core RED' | string; tone?: 'cemk' | 'core' | 'other' }> = ({ book, tone }) => {
  const t = tone ?? (book.startsWith('CEMK') ? 'cemk' : book.startsWith('Core') ? 'core' : 'other');
  const cls =
    t === 'cemk'
      ? 'bg-[#06b6d4]/15 text-[#06b6d4] border-[#06b6d4]/40'
      : t === 'core'
      ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
      : 'bg-[#64748b]/15 text-[#94a3b8] border-[#64748b]/40';
  return <span className={`inline-block text-[10px] font-mono-code font-bold uppercase px-1.5 py-0.5 border rounded ${cls}`}>{book}</span>;
};

export const StepHeader: React.FC<{ title: string; subtitle?: string; page?: string }> = ({ title, subtitle, page }) => (
  <div className="mb-4 border-b border-[#1f2538] pb-3">
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="font-tech text-lg font-black text-white tracking-wider uppercase">{title}</h2>
      {page && <span className="text-[10px] font-mono-code text-[#64748b]">{page}</span>}
    </div>
    {subtitle && <p className="text-xs text-[#94a3b8] mt-1">{subtitle}</p>}
  </div>
);

const pageLabel = (s: { book: string; page: number }): string => `${s.book} p.${s.page}`;

/** Recuadro "Qué es esto" del Modo Novato (plan 12): texto del libro con su página, solo si el modo está prendido. */
export const NoviceGuide: React.FC<{ step: CreatorGuideStep['step'] }> = ({ step }) => {
  const novice = useCreatorNoviceStore((s) => s.novice);
  if (!novice) return null;
  const g = CREATOR_GUIDE.steps.find((x) => x.step === step);
  if (!g || !g.whatEs) return null;
  return (
    <aside aria-label="Qué es esto" className="mb-4 bg-[#06b6d4]/10 border border-[#06b6d4]/40 rounded-xs p-3 break-words">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3 className="font-tech text-xs font-bold text-[#06b6d4] uppercase tracking-wider">Qué es esto</h3>
        {g.source && <SourceBadge book={pageLabel(g.source)} />}
      </div>
      <p className="text-xs text-[#cbd5e1]">{g.whatEs}</p>
      {g.extra?.map((e, i) => (
        <div key={i} className="mt-2">
          <p className="text-xs text-[#cbd5e1]">{e.whatEs}</p>
          {e.source && (
            <div className="mt-0.5">
              <SourceBadge book={pageLabel(e.source)} />
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

/** Botón ⓘ que despliega el texto completo debajo (funciona igual en celular y en PC). */
export const InfoToggle: React.FC<{ text: string; source?: { book: string; page: number } | null; label?: string }> = ({ text, source, label }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="inline-block max-w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Más información"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 px-1.5 text-[11px] font-mono-code text-[#06b6d4] border border-[#06b6d4]/40 rounded-xs cursor-pointer hover:bg-[#06b6d4]/15"
      >
        <span aria-hidden="true">ⓘ</span>
        {label && <span>{label}</span>}
      </button>
      {open && (
        <span className="block mt-1 bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-2 text-[11px] text-[#cbd5e1] whitespace-pre-line break-words">
          {text}
          {source && (
            <span className="block mt-1">
              <SourceBadge book={pageLabel(source)} />
            </span>
          )}
        </span>
      )}
    </span>
  );
};

export const Panel: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-[#10121a] border border-[#1e2334] rounded-xs p-3 ${className}`}>
    {title && <h3 className="font-tech text-sm font-bold text-[#06b6d4] uppercase tracking-wider mb-2">{title}</h3>}
    {children}
  </div>
);

type BtnTone = 'red' | 'green' | 'cyan' | 'gray';
const BTN_TONES: Record<BtnTone, string> = {
  red: 'bg-[#dc2626]/20 border-[#dc2626] text-white hover:bg-[#dc2626]/40',
  green: 'bg-[#10b981]/15 border-[#10b981] text-[#10b981] hover:bg-[#10b981]/30',
  cyan: 'bg-[#06b6d4]/15 border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/30',
  gray: 'bg-[#151926] border-[#2a3148] text-[#cbd5e1] hover:text-white hover:border-[#3b4259]'
};

export const Btn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: BtnTone }
> = ({ tone = 'gray', className = '', type = 'button', ...rest }) => (
  <button
    type={type}
    className={`px-3 py-1.5 border rounded-xs text-xs font-mono-code font-bold uppercase transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${BTN_TONES[tone]} ${className}`}
    {...rest}
  />
);

export const ErrorList: React.FC<{ errors: string[]; max?: number }> = ({ errors, max = 6 }) => {
  if (errors.length === 0) return null;
  return (
    <ul className="text-xs font-mono-code text-[#fca5a5] space-y-0.5" role="alert">
      {errors.slice(0, max).map((e, i) => (
        <li key={i}>• {e}</li>
      ))}
      {errors.length > max && <li>• … y {errors.length - max} más.</li>}
    </ul>
  );
};

export const SELECT_CLS =
  'bg-[#0a0b0e] border border-[#2a3148] text-[#cbd5e1] text-xs font-mono-code rounded-xs px-2 py-1.5 focus:outline-none focus:border-[#06b6d4]';
export const INPUT_CLS = SELECT_CLS;

export const eb = (n: number): string => `${n.toLocaleString('es-ES')} €$`;
