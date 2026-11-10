// [Claude Code · 2026-11-06] v5.14.0 (plan 26): el Night Market que el GM le muestra a la mesa (solo lectura).
import { useTableReveals } from '../../sync/tableReveals';

export function SharedMarketPanel() {
  const market = useTableReveals((s) => s.market);
  if (!market) return null;
  return (
    <div className="bg-[#0c0f1a] border border-[#f59e0b]/40 p-3 rounded-xs space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-tech text-xs font-bold text-[#f59e0b] uppercase">Night Market: {market.title}</h4>
        <span className="text-[10px] font-mono-code text-[#64748b]">{market.source} • lo muestra el GM</span>
      </div>
      {market.sections.map((sec, i) => (
        <div key={i} className="space-y-0.5">
          <div className="text-[11px] font-tech font-bold text-white">{sec.heading}</div>
          {sec.items.length === 0 ? (
            <p className="text-[10px] font-mono-code text-[#64748b]">A cargo del GM.</p>
          ) : (
            <ul className="text-[10px] font-mono-code text-[#cbd5e1] list-disc pl-4">
              {sec.items.map((it, j) => <li key={j}>{it}</li>)}
            </ul>
          )}
        </div>
      ))}
      <p className="text-[10px] font-mono-code text-[#64748b]">Para comprar, buscá el ítem en MASTER COMPENDIUM o en STREET LAB (+ Comprar).</p>
    </div>
  );
}
