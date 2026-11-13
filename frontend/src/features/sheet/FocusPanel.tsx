// [Claude Code · 2026-11-13] v5.32.0 (plan 31): Focus, la estadística derivada de las investigaciones (Interface RED Vol. 5 pp.63-66).
import { useState } from 'react';
import type { CharacterSheet } from '../../types/cyberpunk';
import { useCharacterStore } from '../../store/useCharacterStore';
import { currentFocus, deductionCheck, focusRecovery, maxFocus, roll } from '../../engine/mystery';
import { sheetSkillLevel } from '../../engine/skillLookup';

const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const btn = 'px-2 py-1 bg-[#1a2030] hover:bg-[#a78bfa] hover:text-black text-[10px] font-tech font-bold uppercase rounded-xs cursor-pointer disabled:opacity-40';

/** 1d10 con crítico (Core p.129). */
function d10Check(): { total: number; natural: number; text: string } {
  const r = 1 + Math.floor(Math.random() * 10);
  if (r === 10 || r === 1) {
    const x = 1 + Math.floor(Math.random() * 10);
    return { total: r === 10 ? 10 + x : 1 - x, natural: r, text: r === 10 ? `10+${x}` : `1-${x}` };
  }
  return { total: r, natural: r, text: String(r) };
}

export function FocusPanel({ character }: { character: CharacterSheet }) {
  const adjust = useCharacterStore((s) => s.adjustFocusFor);
  const [msg, setMsg] = useState('');
  const { INT, WILL } = character.stats;
  const max = maxFocus(INT, WILL);
  const cur = currentFocus(character);
  const pct = max > 0 ? (cur / max) * 100 : 0;

  const lose = (spec: string) => {
    const n = roll(spec);
    adjust(character.id, -n);
    setMsg(`Perdés ${spec} = ${n} de Focus.`);
  };

  const rest = () => {
    const d = d10Check();
    const conc = sheetSkillLevel(character, 'Concentration');
    const total = WILL + conc + d.total;
    const ok = total >= 15;
    const gain = focusRecovery(INT, WILL, ok);
    adjust(character.id, gain);
    setMsg(`Descanso: INT + WILL = ${INT + WILL}. Concentration (WILL ${WILL} + ${conc} + d10 ${d.text} = ${total} contra DV15) ${ok ? 'sale: +5' : 'no sale'}. Recuperás ${gain}.`);
  };

  const deduce = () => {
    const d = d10Check();
    const ded = sheetSkillLevel(character, 'Deduction');
    const total = INT + ded + d.total;
    const r = deductionCheck(total);
    adjust(character.id, -r.focusDamage);
    setMsg(`Deduction (INT ${INT} + ${ded} + d10 ${d.text} = ${total} contra DV15): ${r.success ? 'el GM te da una pista de dónde buscar' : 'no se te ocurre nada'}. Cuesta 1d6 = ${r.focusDamage} de Focus.`);
  };

  return (
    <div className="chamfer-card bg-[#0e1017] border border-[#202538] p-3 space-y-2" data-testid="focus-panel">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-tech text-sm font-bold text-[#a78bfa] uppercase">🔎 Focus</h3>
        <span className="font-mono-code text-sm text-white">
          {cur} / {max}
        </span>
      </div>
      <div className="h-1.5 bg-[#1b2234] rounded-xs overflow-hidden">
        <div className="h-full bg-[#a78bfa]" style={{ width: `${pct}%` }} />
      </div>
      <p className={small}>
        10 + 5 × ((INT {INT} + WILL {WILL}) / 2, para arriba). {cur === 0 ? 'Con 0 de Focus no podés hacer Evidence Checks.' : 'Se gasta en investigaciones (IR5 pp.63-66).'}
      </p>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={btn} onClick={() => adjust(character.id, -1)} disabled={cur === 0}>
          −1
        </button>
        <button type="button" className={btn} onClick={() => adjust(character.id, 1)} disabled={cur >= max}>
          +1
        </button>
        {['1d6', '2d6', '3d6'].map((s) => (
          <button key={s} type="button" className={btn} onClick={() => lose(s)} disabled={cur === 0}>
            −{s}
          </button>
        ))}
        <button type="button" className={btn} onClick={deduce} disabled={cur === 0}>
          Deduction DV15
        </button>
        <button type="button" className={btn} onClick={rest} disabled={cur >= max}>
          Descansar un día
        </button>
      </div>
      {msg && <p className="text-[11px] font-mono-code text-[#c4b5fd]">{msg}</p>}
    </div>
  );
}
