// v5.8.0 (plan 23): ventana de "Reparar" blindaje con la regla del libro y el pago opcional a un Tech. [Claude Code · 2026-10-30]
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCharacterStore } from '../../store/useCharacterStore';
import { armorRepairInfo } from '../../engine/armorRepair';

export type ArmorRepairTarget = 'head' | 'body' | 'both';

const LABEL: Record<'head' | 'body', string> = { head: 'Cabeza', body: 'Torso' };

export const ArmorRepairDialog: React.FC<{
  target: ArmorRepairTarget;
  onClose: () => void;
  /** Se llama después de reparar, con un texto para mostrar. */
  onDone?: (message: string) => void;
}> = ({ target, onClose, onDone }) => {
  const activeChar = useCharacterStore((s) => s.getActiveCharacter());
  const repairCharacterArmor = useCharacterStore((s) => s.repairCharacterArmor);
  const [techCost, setTechCost] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!activeChar) return null;

  const headInfo = armorRepairInfo(activeChar.headArmor?.name);
  const bodyInfo = armorRepairInfo(activeChar.bodyArmor?.name);
  // Bodyweight Suit: las dos piezas se reparan juntas (Core p.350).
  const effective: ArmorRepairTarget =
    target !== 'both' && (target === 'head' ? headInfo : bodyInfo).repairsBothPieces ? 'both' : target;
  const pieces: ('head' | 'body')[] = effective === 'both' ? ['head', 'body'] : [effective];

  const cost = Math.max(0, Math.floor(Number(techCost) || 0));
  const balance = activeChar.eurodollars ?? 0;
  const tooExpensive = cost > balance;

  const confirm = () => {
    if (tooExpensive) return;
    repairCharacterArmor(effective, 'full', cost);
    const where = effective === 'both' ? 'Cabeza y torso' : LABEL[effective];
    onDone?.(`${where} reparado al SP máximo${cost > 0 ? `; le pagaste ${cost.toLocaleString('es-AR')} €$ a un Tech` : ''}.`);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3" role="dialog" aria-modal="true" aria-label="Reparar blindaje" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#10121a] border border-amber-500/60 rounded-xs p-4 space-y-3 font-mono-code" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-2">
          <h3 className="font-tech text-base font-bold text-amber-300 flex-1 uppercase">🛡️ Reparar blindaje</h3>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="min-h-[44px] min-w-[44px] text-slate-300 hover:text-white border border-[#2b334d] rounded">
            ✕
          </button>
        </div>

        {pieces.map((loc) => {
          const armor = loc === 'head' ? activeChar.headArmor : activeChar.bodyArmor;
          const info = loc === 'head' ? headInfo : bodyInfo;
          return (
            <div key={loc} className="bg-[#151722] border border-[#222638] rounded p-2.5 space-y-1 text-[11px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-tech text-xs font-bold text-white">{LABEL[loc]}: {armor?.name || 'sin armadura'}</span>
                <span className="text-cyan-300 font-bold">SP {armor?.currentSp ?? 0}/{armor?.maxSp ?? 0}</span>
              </div>
              {info.tier ? (
                <>
                  <div className="text-slate-200">
                    Tirada: <strong className="text-amber-300">TECH + Basic Tech + 1d10</strong> contra <strong className="text-amber-300">DV {info.dv}</strong>
                  </div>
                  <div className="text-slate-300">Tiempo: <strong className="text-white">{info.time}</strong> · categoría {info.tier}</div>
                </>
              ) : (
                <div className="text-slate-400">
                  No encontré esta armadura en el catálogo: preguntale al GM su categoría de precio. La tabla está abajo.
                </div>
              )}
            </div>
          );
        })}

        {effective === 'both' && target !== 'both' && (
          <p className="text-[10px] text-cyan-300">La Bodyweight Suit se repara entera: cabeza y torso a la vez (Core p.350).</p>
        )}

        <div className="text-[10px] text-slate-400 leading-relaxed space-y-1">
          <p>
            <strong className="text-slate-200">Regla (Core p.140, Item Repair):</strong> el DV y el tiempo dependen de la categoría de precio:
            Cheap/Everyday DV9, 1 hora · Costly DV13, 6 horas · Premium DV17, 1 día · Expensive DV21, 1 semana · Very Expensive DV24, 2 semanas ·
            Luxury DV29, 1 mes · Super Luxury DV29, 1 mes por cada 10.000 €$. Si fallás, a mitad de camino te das cuenta de que tenés que empezar de nuevo.
          </p>
          <p>La armadura se repara con <strong className="text-slate-200">Basic Tech</strong>: cubre todo lo que no tiene otra skill TECH (Core p.140).</p>
          <p>
            Un Tech con <strong className="text-slate-200">Field Expertise</strong> la puede emparchar como Acción, al mismo DV: queda perfecta 10 minutos por Rango y después vuelve como estaba (Core p.147).
          </p>
        </div>

        <div className="bg-[#0f1118] border border-[#2b334d] rounded p-2.5 space-y-2 text-[11px]">
          <div className="text-emerald-300 font-bold">Costo por el libro: 0 €$ (no pide materiales).</div>
          <label className="flex flex-wrap items-center gap-2 text-slate-300">
            <span>Le pago a un Tech (variante de mesa):</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={techCost}
              onChange={(e) => setTechCost(e.target.value)}
              placeholder="0"
              className="w-24 bg-[#121624] border border-[#232f48] text-white px-2 py-1 rounded focus:outline-none focus:border-amber-500"
              aria-label="Monto que le pagás a un Tech"
            />
            <span>€$</span>
          </label>
          <div className="text-[10px] text-slate-500">Lo que cobre el Tech lo decide el GM. Tenés {balance.toLocaleString('es-AR')} €$.</div>
          {tooExpensive && <div className="text-[10px] text-red-400">No te alcanza la plata.</div>}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 min-h-[44px] bg-[#1c2235] text-slate-300 border border-[#2b334d] rounded text-xs font-bold">
            Cancelar
          </button>
          <button
            type="button"
            disabled={tooExpensive}
            onClick={confirm}
            className="px-3 py-2 min-h-[44px] bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black rounded text-xs font-bold uppercase"
          >
            ✓ Reparado{cost > 0 ? ` (−${cost.toLocaleString('es-AR')} €$)` : ''}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
