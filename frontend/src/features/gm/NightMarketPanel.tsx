// [Claude Code · 2026-11-06] v5.14.0 (plan 26): generador de Night Market para el GM.
// Al azar con las tablas del Core (pp.338-339), o uno de los 6 mercados de Black Chrome (pp.131-156) con sus puestos.
// Con mesa online, el GM se lo muestra a los jugadores (campaigns/{c}/reveals/market).
import { useMemo, useState } from 'react';
import { NIGHT_MARKET_CATEGORIES } from '../../data/nightMarketTables';
import { BLACK_CHROME_MARKETS, BC_MARKETS_HOW_TO, type BlackChromeMarket } from '../../data/blackChromeMarkets';
import { generateNightMarket, rerollCategory, type RolledNightMarket } from '../../engine/nightMarket';
import { itemsAtBooth, type BoothItem } from '../../engine/blackChromeBooths';
import { useActiveTable } from '../../sync/tableSync';
import { useTableReveals, type MarketReveal } from '../../sync/tableReveals';
import { CompendiumShopModal } from '../sheet/CompendiumShopModal';
import type { CompendiumCategory } from '../compendium/CompendiumView';

const CATEGORY_LABEL: Record<string, string> = {
  weapons: 'Arma', armor: 'Armadura', attachments: 'Accesorio', ammunition: 'Munición', cyberware: 'Ciberware',
  drugs: 'Droga', gear: 'Equipo', programs: 'Programa', vehicles: 'Vehículo',
};
const SHOP_CATEGORIES = new Set(['weapons', 'armor', 'attachments', 'ammunition', 'cyberware', 'drugs', 'gear', 'programs']);

const marketByLetter = (l: string) => BLACK_CHROME_MARKETS.find((m) => m.letter === l);
const itemLine = (i: BoothItem) => `${i.name} — ${i.cost.toLocaleString()}eb (${i.costTier})${i.sourcePage ? ` • p.${i.sourcePage}` : ''}`;

function boothSections(m: BlackChromeMarket): MarketReveal['sections'] {
  return m.booths.map((b) => ({
    heading: `Puesto ${b.code}: ${b.name}`,
    items: itemsAtBooth(b.code).map(itemLine),
  }));
}

export function NightMarketPanel() {
  const [mode, setMode] = useState<'random' | 'bc'>('random');
  const [rolled, setRolled] = useState<RolledNightMarket | null>(null);
  const [extraLetter, setExtraLetter] = useState<string>('');
  const [letter, setLetter] = useState<string>('A');
  const [shop, setShop] = useState<{ category: CompendiumCategory; search: string } | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const { table, isGm } = useActiveTable();
  const adapter = useTableReveals((s) => s.adapter);
  const shared = useTableReveals((s) => s.market);
  const canShare = !!table && isGm && !!adapter;

  const bcMarket = marketByLetter(letter)!;
  const extraMarket = extraLetter ? marketByLetter(extraLetter) : undefined;

  const reveal: MarketReveal | null = useMemo(() => {
    if (mode === 'bc') {
      return { title: `${bcMarket.letter}. ${bcMarket.name}`, source: `Black Chrome pp.${bcMarket.pages[0]}-${bcMarket.pages[1]}`, sections: boothSections(bcMarket) };
    }
    if (!rolled) return null;
    const sections: MarketReveal['sections'] = rolled.categories.map((c) => ({
      heading: `${NIGHT_MARKET_CATEGORIES.find((x) => x.id === c.id)!.name} (${c.count} tipos)`,
      items: c.items.map((i) => i.text),
    }));
    if (extraMarket) sections.push(...boothSections(extraMarket));
    return { title: 'Night Market', source: extraMarket ? `Core pp.338-339 + Black Chrome ${extraMarket.letter}` : 'Core pp.338-339', sections };
  }, [mode, rolled, bcMarket, extraMarket]);

  const share = async (m: MarketReveal | null) => {
    if (!adapter) return;
    try {
      await adapter.setMarket(m);
      setShareMsg(m ? 'La mesa ya ve este mercado.' : 'La mesa dejó de ver el mercado.');
    } catch (e) {
      console.warn('[mesa] mercado:', e);
      setShareMsg('No se pudo compartir el mercado. Probá de nuevo.');
    }
  };

  const chip = (active: boolean) =>
    `px-2 py-1 rounded-xs text-[10px] font-tech font-bold uppercase cursor-pointer border ${active ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]' : 'bg-[#10141f] border-[#1b2336] text-[#94a3b8] hover:text-white'}`;

  const renderBoothItems = (code: string) => {
    const items = itemsAtBooth(code);
    if (items.length === 0) return <p className="text-[10px] font-mono-code text-[#64748b]">Ningún ítem del libro cita este puesto: lo arma el GM.</p>;
    return (
      <ul className="space-y-0.5">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-2 text-[10px] font-mono-code text-[#cbd5e1]">
            <span className="text-[#64748b] w-16 shrink-0">{CATEGORY_LABEL[i.category] ?? i.category}</span>
            <span className="flex-1">{i.name}</span>
            <span className="text-[#f59e0b]">{i.cost.toLocaleString()}eb</span>
            {i.sourcePage && <span className="text-[#64748b]">p.{i.sourcePage}</span>}
            {SHOP_CATEGORIES.has(i.category) ? (
              <button type="button" onClick={() => setShop({ category: i.category as CompendiumCategory, search: i.name })} className="px-1.5 py-0.5 border border-emerald-600/50 text-emerald-300 hover:bg-emerald-600/20 rounded-xs">
                Comprar
              </button>
            ) : (
              <span className="text-[#64748b]" title="Los vehículos se compran en NET, ROLES & VEHÍCULOS">garaje</span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-[#0c0f1a] border border-[#f59e0b]/40 p-4 rounded-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2234] pb-2">
        <h3 className="font-tech text-sm font-bold text-[#f59e0b] uppercase">Night Market // generador del GM</h3>
        <div className="flex gap-2">
          <button type="button" className={chip(mode === 'random')} onClick={() => setMode('random')}>Al azar (Core p.338)</button>
          <button type="button" className={chip(mode === 'bc')} onClick={() => setMode('bc')}>Mercados de Black Chrome</button>
        </div>
      </div>

      {mode === 'random' ? (
        <div className="space-y-3">
          <p className="text-[10px] font-mono-code text-[#94a3b8]">
            Core p.338: 1d6 dos veces para las categorías (sin repetir); por cada una, 1d10 tipos de ítems y d100 en su columna. Es la lista de tipos de cosas, no el inventario total.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setRolled(generateNightMarket())} className="px-3 py-1.5 bg-[#f59e0b] text-black font-tech font-bold text-[11px] uppercase rounded-xs">
              {rolled ? 'Tirar otro mercado' : 'Generar mercado'}
            </button>
            <label className="text-[10px] font-mono-code text-[#94a3b8] flex items-center gap-1">
              Sumar puestos de Black Chrome (BC p.7):
              <select value={extraLetter} onChange={(e) => setExtraLetter(e.target.value)} className="bg-[#10141f] border border-[#1b2336] text-white rounded-xs px-1 py-0.5">
                <option value="">ninguno</option>
                {BLACK_CHROME_MARKETS.map((m) => <option key={m.letter} value={m.letter}>{m.letter}. {m.name}</option>)}
              </select>
            </label>
          </div>
          {rolled && rolled.categories.map((c) => {
            const cat = NIGHT_MARKET_CATEGORIES.find((x) => x.id === c.id)!;
            return (
              <div key={c.id} className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-tech text-xs font-bold text-white uppercase">{cat.name} <span className="text-[#64748b]">(1d6 = {cat.roll}; 1d10 = {c.count})</span></span>
                  <button type="button" onClick={() => setRolled(rerollCategory(rolled, c.id))} className="text-[10px] font-mono-code text-[#38bdf8] hover:text-white">Volver a tirar</button>
                </div>
                <p className="text-[10px] font-mono-code text-[#64748b]">{cat.descriptionEs}{cat.noteEs ? ` ${cat.noteEs}` : ''}</p>
                <ul className="text-[11px] font-mono-code text-[#cbd5e1] space-y-0.5">
                  {c.items.map((i) => <li key={i.roll}><span className="text-[#64748b]">d100 {i.roll}:</span> {i.text}</li>)}
                </ul>
              </div>
            );
          })}
          {rolled && extraMarket && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono-code text-[#94a3b8]">Puestos de {extraMarket.letter}. {extraMarket.name}:</p>
              {extraMarket.booths.map((b) => (
                <div key={b.code} className="bg-[#10141f] border border-[#1b2336] p-2 rounded-xs space-y-1">
                  <span className="font-tech text-[11px] font-bold text-white">{b.code} · {b.name}</span>
                  {renderBoothItems(b.code)}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[10px] font-mono-code text-[#94a3b8]">{BC_MARKETS_HOW_TO.summaryEs} (Black Chrome p.{BC_MARKETS_HOW_TO.page})</p>
          <div className="flex flex-wrap gap-2">
            {BLACK_CHROME_MARKETS.map((m) => (
              <button key={m.letter} type="button" className={chip(letter === m.letter)} onClick={() => setLetter(m.letter)}>{m.letter}. {m.name}</button>
            ))}
          </div>
          <div className="bg-[#10141f] border border-[#1b2336] p-3 rounded-xs space-y-1 text-[11px] font-mono-code text-[#cbd5e1]">
            <div className="font-tech text-xs font-bold text-white uppercase">{bcMarket.name} <span className="text-[#64748b]">· Black Chrome pp.{bcMarket.pages[0]}-{bcMarket.pages[1]}</span></div>
            <p className="text-[#94a3b8]">{bcMarket.vibeEs}</p>
            <div><span className="text-[#64748b]">Fixer:</span> {bcMarket.fixerName}</div>
            <div><span className="text-[#64748b]">Dónde:</span> {bcMarket.location}</div>
            <div><span className="text-[#64748b]">Cuándo:</span> {bcMarket.frequency}</div>
            <div><span className="text-[#64748b]">Cómo se entra:</span> {bcMarket.access}</div>
            <div><span className="text-[#64748b]">Seguridad:</span> {bcMarket.security}</div>
            {bcMarket.specialRules.map((r) => <div key={r.name}><span className="text-[#64748b]">{r.name}:</span> {r.summaryEs}</div>)}
            {bcMarket.otherStalls.length > 0 && <div><span className="text-[#64748b]">Otros locales del mapa:</span> {bcMarket.otherStalls.join(' • ')}</div>}
          </div>
          {bcMarket.booths.map((b) => (
            <div key={b.code} className="bg-[#10141f] border border-[#1b2336] p-2 rounded-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-tech text-[11px] font-bold text-white">{b.code} · {b.name}</span>
                <span className="text-[10px] font-mono-code text-[#64748b]">p.{b.page}</span>
              </div>
              {renderBoothItems(b.code)}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-[#1b2234] pt-2">
        {canShare ? (
          <>
            <button type="button" disabled={!reveal} onClick={() => reveal && void share(reveal)} className="px-3 py-1.5 border border-[#38bdf8] text-[#38bdf8] disabled:opacity-40 font-tech font-bold text-[11px] uppercase rounded-xs">
              Mostrar a la mesa
            </button>
            {shared && (
              <button type="button" onClick={() => void share(null)} className="px-3 py-1.5 border border-[#64748b] text-[#94a3b8] font-tech font-bold text-[11px] uppercase rounded-xs">
                Dejar de mostrar ({shared.title})
              </button>
            )}
          </>
        ) : (
          <span className="text-[10px] font-mono-code text-[#64748b]">Con una mesa online donde seas el GM, podés mostrarle el mercado a los jugadores.</span>
        )}
        {shareMsg && <span className="text-[10px] font-mono-code text-[#f59e0b]">{shareMsg}</span>}
      </div>

      {shop && <CompendiumShopModal initialCategory={shop.category} initialSearch={shop.search} onClose={() => setShop(null)} />}
    </div>
  );
}
