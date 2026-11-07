// [Claude Code · 2026-11-06] v5.12.0 (plan 26): aviso cuando la ficha tiene ítems que salieron del catálogo.
import { useState } from 'react';
import type { CharacterSheet } from '../../types/cyberpunk';
import { removedItemsInSheet } from '../../data/removedCatalogItems';

const KEY = 'cpr_removed_items_seen_v1';

function readSeen(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

export function RemovedItemsNotice({ sheet }: { sheet: CharacterSheet | undefined }) {
  const [seen, setSeen] = useState<Record<string, string>>(readSeen);
  if (!sheet) return null;
  const items = removedItemsInSheet(sheet);
  const sig = items.map((i) => i.id).sort().join(',');
  if (items.length === 0 || seen[sheet.id] === sig) return null;

  const dismiss = () => {
    const next = { ...seen, [sheet.id]: sig };
    setSeen(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* sin localStorage: queda en memoria */ }
  };

  return (
    <div className="p-2 border border-amber-500/40 bg-[#1f1a0f] rounded-xs font-mono-code text-[11px] text-amber-200 space-y-1" role="status">
      <div className="flex items-start gap-2">
        <span className="font-bold">Ítems que ya no están en el catálogo</span>
        <button type="button" onClick={dismiss} className="ml-auto text-[#94a3b8] hover:text-white" aria-label="Cerrar aviso">✕</button>
      </div>
      <p>Esta ficha los tiene y los conserva, pero la app ya no los ofrece porque no salen de ningún libro oficial o tenían datos inventados:</p>
      <ul className="list-disc pl-5">
        {items.map((i) => (
          <li key={i.id}><strong>{i.name}</strong>: {i.reason}.</li>
        ))}
      </ul>
      <p className="text-[#94a3b8]">Si querés seguir usándolos, quedan como ítems propios. El ciberware borrado ya no muestra sus datos: anotalo en NOTAS si lo necesitás. Los vehículos siguen en tu garaje con sus datos.</p>
    </div>
  );
}
