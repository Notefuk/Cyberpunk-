// v5.8.0 (plan 23): botón ✎ para ponerle nombre propio a un ítem comprado. [Claude Code · 2026-10-30]
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCharacterStore } from '../../store/useCharacterStore';
import { displayItemName, getItemNickname } from '../../engine/itemNames';

/** Devuelve una función que da el nombre a mostrar de un ítem de la ficha activa. */
export function useItemDisplayName(): (key: string, original: string) => string {
  const nicks = useCharacterStore((s) => s.getActiveCharacter()?.itemNicknames);
  return (key, original) => displayItemName(nicks, key, original);
}

export const ItemNameButton: React.FC<{ nickKey: string; original: string; className?: string }> = ({ nickKey, original, className }) => {
  const nicks = useCharacterStore((s) => s.getActiveCharacter()?.itemNicknames);
  const setItemNickname = useCharacterStore((s) => s.setItemNickname);
  const current = getItemNickname(nicks, nickKey, original);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [showOriginal, setShowOriginal] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const start = (e: React.MouseEvent) => {
    e.stopPropagation();
    setName(current?.name ?? '');
    setShowOriginal(current?.showOriginal ?? true);
    setOpen(true);
  };

  const save = () => {
    setItemNickname(nickKey, original, name.trim() ? { name, showOriginal } : null);
    setOpen(false);
  };

  const preview = name.trim() ? (showOriginal ? `${name.trim()} (${original})` : name.trim()) : original;

  return (
    <>
      <button
        type="button"
        onClick={start}
        className={className ?? 'text-[11px] leading-none text-[#64748b] hover:text-amber-300 cursor-pointer px-0.5'}
        title={current ? `Nombre propio: ${current.name} (tocá para cambiarlo)` : 'Ponerle nombre propio'}
        aria-label={`Nombre propio de ${original}`}
      >
        ✎
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-3" role="dialog" aria-modal="true" aria-label="Nombre propio" onClick={() => setOpen(false)}>
            <div className="w-full max-w-md bg-[#10121a] border border-amber-500/60 rounded-xs p-4 space-y-3 font-mono-code" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-tech text-base font-bold text-amber-300 uppercase">✎ Nombre propio</h3>
              <p className="text-[11px] text-slate-400">
                Del libro: <strong className="text-slate-200">{original}</strong>. El ítem sigue funcionando igual; solo cambia cómo se ve en la ficha y en el HUD.
              </p>
              <input
                type="text"
                autoFocus
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
                placeholder="Ej.: Cuchillo"
                className="w-full bg-[#121624] border border-[#232f48] text-white text-sm px-2 py-2 rounded focus:outline-none focus:border-amber-500"
                aria-label="Nombre propio"
              />
              <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                <input type="checkbox" checked={showOriginal} onChange={(e) => setShowOriginal(e.target.checked)} />
                <span>Mostrar el nombre del libro entre paréntesis</span>
              </label>
              <div className="text-[11px] text-slate-400">
                Se va a ver: <strong className="text-white">{preview}</strong>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {current && (
                  <button
                    type="button"
                    onClick={() => { setItemNickname(nickKey, original, null); setOpen(false); }}
                    className="px-3 py-2 min-h-[44px] bg-[#2a1216] text-red-300 border border-red-500/40 rounded text-xs font-bold mr-auto"
                  >
                    Quitar nombre propio
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 min-h-[44px] bg-[#1c2235] text-slate-300 border border-[#2b334d] rounded text-xs font-bold">
                  Cancelar
                </button>
                <button type="button" onClick={save} className="px-3 py-2 min-h-[44px] bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold uppercase">
                  Guardar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
