// v5.8.0 (plan 23): el Compendium en una ventana encima de Street Lab, para comprar o sumar loot sin cambiar de pestaña. [Claude Code · 2026-10-30]
import React, { Suspense, lazy, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CompendiumCategory } from '../compendium/CompendiumView';

// Carga perezosa: el Compendium sigue en su propio chunk, como en App.tsx.
const CompendiumView = lazy(() => import('../compendium/CompendiumView').then((m) => ({ default: m.CompendiumView })));

export const CompendiumShopModal: React.FC<{ initialCategory: CompendiumCategory; onClose: () => void }> = ({ initialCategory, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Comprar o añadir" onClick={onClose}>
      <div className="w-full max-w-7xl my-2 bg-[#0b0c12] border border-emerald-500/50 rounded-xs" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-2 bg-[#0b0c12] border-b border-[#1f2230]">
          <h3 className="font-tech text-sm font-bold text-emerald-300 uppercase flex-1">+ Comprar / Añadir</h3>
          <span className="hidden sm:inline text-[10px] font-mono-code text-slate-500">Lo que compres o sumes va directo a la ficha activa.</span>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="min-h-[44px] min-w-[44px] text-slate-300 hover:text-white border border-[#2b334d] rounded">
            ✕
          </button>
        </div>
        <div className="p-2 sm:p-3">
          <Suspense fallback={<div className="p-6 text-center text-xs font-mono-code text-slate-400">Cargando el Compendium...</div>}>
            <CompendiumView initialCategory={initialCategory} />
          </Suspense>
        </div>
      </div>
    </div>,
    document.body
  );
};
