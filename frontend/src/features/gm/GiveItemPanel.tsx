// [Claude Code · 2026-11-12] v5.23.0 (plan 28): el GM busca un ítem del catálogo y se lo da a un jugador.
// Se carga aparte (lazy) porque trae el pack del Core entero.
import { useMemo, useState } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { useCharacterStore } from '../../store/useCharacterStore';
import { publishGmAction } from '../../sync/tableSync';
import { GIVE_MAX_QTY, type GiveItem } from '../../engine/gmGive';
import type { InventoryItem } from '../../types/cyberpunk';

type Category = InventoryItem['category'];
const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'weapons', label: 'Armas' },
  { id: 'armor', label: 'Armaduras' },
  { id: 'ammunition', label: 'Munición' },
  { id: 'gear', label: 'Equipo' },
  { id: 'drugs', label: 'Drogas' },
  { id: 'cyberware', label: 'Ciberware' },
  { id: 'programs', label: 'Programas' },
  { id: 'attachments', label: 'Accesorios' },
];

interface CatalogRow extends GiveItem {
  source: string;
}

type RawItem = { id?: string; name?: string; cost?: number | string; description?: string; notes?: string; damage?: string; sourceBook?: string; sourcePage?: number | string };

function buildCatalog(): CatalogRow[] {
  const data = coreData as unknown as Record<string, RawItem[] | undefined>;
  const out: CatalogRow[] = [];
  for (const { id: category } of CATEGORIES) {
    for (const it of data[category] ?? []) {
      if (!it?.name) continue;
      out.push({
        catalogId: it.id || it.name,
        name: it.name,
        category,
        cost: Number(it.cost || 0),
        details: String(it.description || it.notes || it.damage || '').slice(0, 300),
        source: [it.sourceBook, it.sourcePage ? `p.${it.sourcePage}` : ''].filter(Boolean).join(' '),
      });
    }
  }
  return out;
}

const field = 'bg-[#0c0d12] border border-[#262b3c] text-white font-mono-code text-xs px-2 py-1 rounded-xs min-w-0';
const btn = 'font-tech text-[11px] uppercase px-2 py-1 border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

export default function GiveItemPanel({ charId, onDone }: { charId: string; onDone: (msg: string) => void }) {
  const catalog = useMemo(buildCatalog, []);
  const handle = useCharacterStore((s) => s.characters.find((c) => c.id === charId)?.handle ?? '');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [picked, setPicked] = useState<CatalogRow | null>(null);
  const [qty, setQty] = useState(1);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog
      .filter((r) => (cat === 'all' || r.category === cat) && (!needle || r.name.toLowerCase().includes(needle)))
      .slice(0, 40);
  }, [catalog, q, cat]);

  const give = () => {
    if (!picked) return;
    const ok = useCharacterStore.getState().gmGiveItemTo(charId, picked, qty);
    if (!ok) return;
    publishGmAction({ targetCharId: charId, targetHandle: handle, label: `recibe ${picked.name}${qty > 1 ? ` x${qty}` : ''}`, detail: 'Del GM, al inventario' });
    onDone(`${handle} recibió ${picked.name}${qty > 1 ? ` x${qty}` : ''}.`);
    setPicked(null);
    setQty(1);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input className={`${field} flex-1`} placeholder="Buscar en el catálogo…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={field} value={cat} onChange={(e) => setCat(e.target.value as Category | 'all')} aria-label="Categoría">
          <option value="all">Todo</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <ul className="max-h-56 overflow-y-auto border border-[#1e2334] divide-y divide-[#1e2334]">
        {results.map((r) => (
          <li key={`${r.category}-${r.catalogId}`}>
            <button
              type="button"
              onClick={() => setPicked(r)}
              className={`w-full text-left px-2 py-1 font-mono-code text-[11px] cursor-pointer ${picked?.catalogId === r.catalogId && picked.category === r.category ? 'bg-[#22d3ee]/10 text-white' : 'text-[#cbd5e1] hover:bg-white/5'}`}
            >
              {r.name} <span className="text-[#64748b]">· {CATEGORIES.find((c) => c.id === r.category)?.label} · €$ {r.cost}{r.source ? ` · ${r.source}` : ''}</span>
            </button>
          </li>
        ))}
        {results.length === 0 && <li className="px-2 py-1 font-mono-code text-[11px] text-[#64748b]">Sin resultados.</li>}
      </ul>
      {picked && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono-code text-xs text-white">{picked.name}</span>
          <input type="number" min={1} max={GIVE_MAX_QTY} className={`${field} w-16`} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} aria-label="Cantidad" />
          <button type="button" onClick={give} className={`${btn} border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10`}>Dar al inventario</button>
        </div>
      )}
      <p className="font-mono-code text-[10px] text-[#64748b]">Entra al inventario sin cobrarle (queda un movimiento "Del GM" en su historial de €$). Equiparlo es cosa del jugador.</p>
    </div>
  );
}
