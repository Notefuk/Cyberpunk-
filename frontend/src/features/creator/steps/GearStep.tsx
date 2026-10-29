// Paso 6 del creador: equipo, dinero y ciberware (Core pp. 97-119; CEMK RB pp. 25, 35-36). [Claude Code · 2026-10-22]
import React, { useMemo, useState } from 'react';
import pack from '../../../data/core-rules.cprpack.json';
import { CEMK_CREATION, CORE_GEAR_SKILLS } from '../../../data/creation';
import { parseHumanityLossAverage } from '../../../engine/characterEngine';
import { deckSlotUse, neuroportCovers, shopSourceLabel } from '../../../engine/creatorShop';
import {
  AMMO_CALIBERS,
  getFashionPrice,
  isPerUnitAmmo,
  getMoneyRemaining,
  getRolePackage,
  getRoleDisplayName,
  getStartingMoney,
  type CreatorDraft,
  type CreatorPurchase,
  type CreatorPurchaseCategory,
  type RolePackageEntry,
  usesRolePackage,
} from '../../../engine/characterCreation';
import { Btn, INPUT_CLS, Panel, SELECT_CLS, SourceBadge, NoviceGuide, StepHeader, eb, type StepProps } from './CreatorUi';

interface PackItem {
  id: string;
  name: string;
  cost: number;
  sourceBook?: string;
  sourceBookTitle?: string;
  sourcePage?: number | string;
  era?: string;
  humanityLoss?: string;
  type?: string;
  sp?: number;
  description?: string;
  class?: string;
  ammoType?: string;
}

const PACK = pack as unknown as Record<CreatorPurchaseCategory, PackItem[]>;

const TABS: Array<{ id: CreatorPurchaseCategory; label: string }> = [
  { id: 'weapons', label: 'Armas' },
  { id: 'armor', label: 'Armadura' },
  { id: 'cyberware', label: 'Ciberware' },
  { id: 'gear', label: 'Equipo' },
  { id: 'ammunition', label: 'Munición' },
  { id: 'programs', label: 'Programas' },
  { id: 'drugs', label: 'Drogas' }
];

// v5.3.2: la etiqueta dice libro y página (y el nombre del DLC) para que se vea de dónde sale cada ítem. [Claude Code · 2026-10-29]
const bookLabel = (item: PackItem): string => shopSourceLabel(item);

const isShield = (name: string): boolean => /shield/i.test(name);

const PackageList: React.FC<{
  title: string;
  entries: RolePackageEntry[];
  baseEntries: RolePackageEntry[];
  onChoose: (key: string, idx: number) => void;
}> = ({ title, entries, baseEntries, onChoose }) => {
  if (entries.length === 0) return null;
  return (
    <div className="mb-3">
      <h4 className="text-[11px] font-mono-code text-[#64748b] uppercase mb-1">{title}</h4>
      <ul className="space-y-2">
        {entries.map((e) => {
          const main = baseEntries.find((b) => b.key === e.key)?.name ?? e.name;
          const options = [main, ...e.alternatives];
          return (
            <li key={e.key} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-2 text-xs">
              {e.alternatives.length === 0 ? (
                <span className="text-white">
                  {e.qty > 1 ? `${e.qty}× ` : ''}
                  {e.name}
                </span>
              ) : (
                <fieldset>
                  <legend className="text-[10px] font-mono-code text-[#f59e0b]">Elegí una opción</legend>
                  {options.map((o, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-[#cbd5e1] cursor-pointer">
                      <input type="radio" name={`pkg-${e.key}`} checked={e.chosen === idx} onChange={() => onChoose(e.key, idx)} />
                      <span>{o}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              {e.notes && <p className="text-[10px] text-[#64748b] mt-1">{e.notes}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const GearStep: React.FC<StepProps> = ({ draft, update }) => {
  const { method, role, era } = draft;
  const [tab, setTab] = useState<CreatorPurchaseCategory>('weapons');
  const [query, setQuery] = useState('');
  const [fashionStyle, setFashionStyle] = useState<string>(CORE_GEAR_SKILLS.fashionStyles[0].name);
  const [fashionPiece, setFashionPiece] = useState<string>('Top');
  const [fashionQty, setFashionQty] = useState<number>(1);
  // Core p.344: la munición se compra para el tipo de arma; por defecto, el de la primera arma comprada. [Claude Code · 2026-10-25]
  const firstWeaponCaliber = useMemo(() => {
    const ids = draft.purchases.filter((p) => p.category === 'weapons').map((p) => p.catalogId);
    const w = PACK.weapons.find((x) => ids.includes(x.id) && (AMMO_CALIBERS as readonly string[]).includes(x.ammoType ?? ''));
    return w?.ammoType ?? AMMO_CALIBERS[0];
  }, [draft.purchases]);
  const [caliberPick, setCaliberPick] = useState<string | null>(null);
  const caliber = caliberPick ?? firstWeaponCaliber;

  const hasPackage = usesRolePackage(draft);
  const money = getStartingMoney(draft);
  const left = getMoneyRemaining(draft);
  const slots = deckSlotUse(draft.purchases);
  const pkg = useMemo(() => (role && hasPackage ? getRolePackage(role, era, draft.packageChoices) : null), [role, hasPackage, era, draft.packageChoices]);
  const basePkg = useMemo(() => (role && hasPackage ? getRolePackage(role, era, {}) : null), [role, hasPackage, era]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PACK[tab].filter((it) => {
      if (era === '2045' && (it.era === '2077' || it.sourceBook === 'cemk')) return false;
      // El Black ICE no es un programa que se compre para el cyberdeck (Core p.200).
      if (tab === 'programs' && it.class === 'Black ICE') return false;
      return !q || it.name.toLowerCase().includes(q);
    });
  }, [tab, query, era]);

  const canAfford = (extra: CreatorPurchase): boolean => getMoneyRemaining({ ...draft, purchases: [...draft.purchases, extra] }).cash >= 0;

  const makePurchase = (item: PackItem, category: CreatorPurchaseCategory, location?: 'head' | 'body'): CreatorPurchase => {
    const withCaliber = category === 'ammunition' && !isPerUnitAmmo(item.name);
    return {
      category,
      catalogId: item.id,
      name: withCaliber ? `${item.name} (${caliber})` : item.name,
      cost: item.cost,
      qty: 1,
      humanityLoss: category === 'cyberware' ? parseHumanityLossAverage(item.humanityLoss ?? '0') : 0,
      sourceBook: item.sourceBook,
      ...(location ? { location } : {}),
      ...(withCaliber ? { caliber } : {})
    };
  };

  const buy = (item: PackItem, location?: 'head' | 'body'): void => {
    const p = makePurchase(item, tab, location);
    if (!canAfford(p)) return;
    update((d) => {
      const idx = d.purchases.findIndex((x) => x.category === p.category && x.catalogId === p.catalogId && x.location === p.location && x.caliber === p.caliber);
      if (idx < 0) return { ...d, purchases: [...d.purchases, p] };
      return { ...d, purchases: d.purchases.map((x, i) => (i === idx ? { ...x, qty: x.qty + 1 } : x)) };
    });
  };
  const removeOne = (index: number): void =>
    update((d) => ({
      ...d,
      purchases: d.purchases.flatMap((x, i) => (i !== index ? [x] : x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []))
    }));

  const chooseOption = (key: string, idx: number): void => update((d) => ({ ...d, packageChoices: { ...d.packageChoices, [key]: idx } }));

  // Moda de Complete Package (Core p.105)
  const style = CORE_GEAR_SKILLS.fashionStyles.find((s) => s.name === fashionStyle);
  const pieces = style ? Object.keys(style.prices) : [];
  const unit = getFashionPrice(fashionStyle, fashionPiece);
  const addFashion = (): void => {
    if (unit === null) return;
    const qty = Math.max(1, fashionQty);
    const next: CreatorDraft = { ...draft, fashion: [...draft.fashion, { style: fashionStyle, piece: fashionPiece, qty, unitCost: unit }] };
    if (getMoneyRemaining(next).fashionBudget < 0) return;
    update((d) => ({ ...d, fashion: next.fashion }));
  };
  const fashionTooExpensive =
    unit !== null && getMoneyRemaining({ ...draft, fashion: [...draft.fashion, { style: fashionStyle, piece: fashionPiece, qty: Math.max(1, fashionQty), unitCost: unit }] }).fashionBudget < 0;

  const port = CEMK_CREATION.cyberdeckPort;
  const neuroport = CEMK_CREATION.neuroport;
  const housing = CORE_GEAR_SKILLS.housing;
  const roc = CORE_GEAR_SKILLS.runningOutOfCash;

  if (!method || !role) {
    return (
      <div>
        <StepHeader title="Equipo" />
        <p className="text-xs text-[#f59e0b]">Elegí método y rol antes de armar el equipo.</p>
      </div>
    );
  }

  return (
    <div>
      <StepHeader title="Equipo, dinero y ciberware" subtitle={`Rol: ${getRoleDisplayName(role, era)}`} page="Core pp. 97-119" />
      <NoviceGuide step="gear" />

      <Panel className="mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <div className="text-[10px] font-mono-code text-[#64748b] uppercase">Dinero restante</div>
            <div className={`font-tech text-2xl font-black ${left.cash < 0 ? 'text-[#dc2626]' : 'text-[#10b981]'}`} aria-live="polite">
              {eb(left.cash)}
            </div>
            <div className="text-[10px] font-mono-code text-[#64748b]">
              de {eb(money.cash)} · {money.source}
            </div>
          </div>
          {money.fashionBudget > 0 && (
            <div>
              <div className="text-[10px] font-mono-code text-[#64748b] uppercase">Presupuesto de moda</div>
              <div className={`font-tech text-2xl font-black ${left.fashionBudget < 0 ? 'text-[#dc2626]' : 'text-[#06b6d4]'}`}>{eb(left.fashionBudget)}</div>
              <div className="text-[10px] font-mono-code text-[#64748b]">los 800 €$ no usados se pierden (Core p.105)</div>
            </div>
          )}
        </div>
      </Panel>

      {pkg && basePkg && (
        <Panel title={`Paquete de ${getRoleDisplayName(role, era)} (Core pp. 98-99, 103, 117)`} className="mb-4">
          <p className="text-xs text-[#94a3b8] mb-2">
            El paquete es gratis. Además tenés {eb(CORE_GEAR_SKILLS.completePackageMoney.streetratEdgerunnerExtra)} libres para gastar en la tienda (Core p.98).
          </p>
          <PackageList title="Armas y munición" entries={pkg.weapons} baseEntries={basePkg.weapons} onChoose={chooseOption} />
          <PackageList title="Armadura" entries={pkg.armor} baseEntries={basePkg.armor} onChoose={chooseOption} />
          <PackageList title="Equipo" entries={pkg.gear} baseEntries={basePkg.gear} onChoose={chooseOption} />
          {pkg.fashion.length > 0 && (
            <div className="mb-3">
              <h4 className="text-[11px] font-mono-code text-[#64748b] uppercase mb-1">Moda (Core p.103)</h4>
              <ul className="text-xs text-[#cbd5e1] grid sm:grid-cols-2 gap-1">
                {pkg.fashion.map((f, i) => (
                  <li key={i} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs px-2 py-1">
                    {f.qty}× {f.style} · {f.piece}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pkg.cyberware.length > 0 && (
            <div className="mb-3">
              <h4 className="text-[11px] font-mono-code text-[#64748b] uppercase mb-1">Ciberware (Core p.117)</h4>
              <ul className="space-y-2">
                {pkg.cyberware.map((c) => {
                  const baseC = basePkg.cyberware.find((b) => b.key === c.key);
                  const options = [
                    c.coveredByNeuroport || baseC?.coveredByNeuroport
                      ? { name: `${baseC?.name ?? c.name} (lo cubre el Neuroport)`, humanityLoss: 0 }
                      : { name: baseC?.name ?? c.name, humanityLoss: baseC?.humanityLoss ?? c.humanityLoss },
                    ...c.alternatives
                  ];
                  return (
                    <li key={c.key} className="bg-[#0a0b0e] border border-[#1e2334] rounded-xs p-2 text-xs">
                      {c.alternatives.length === 0 ? (
                        <span className="text-white">
                          {c.name} <span className="text-[#f59e0b] font-mono-code">HL {c.humanityLoss}</span>
                        </span>
                      ) : (
                        <fieldset>
                          <legend className="text-[10px] font-mono-code text-[#f59e0b]">Elegí una opción</legend>
                          {options.map((o, idx) => (
                            <label key={idx} className="flex items-center gap-2 text-[#cbd5e1] cursor-pointer">
                              <input type="radio" name={`pkg-${c.key}`} checked={c.chosen === idx} onChange={() => chooseOption(c.key, idx)} />
                              <span>
                                {o.name} <span className="text-[#f59e0b] font-mono-code">HL {o.humanityLoss}</span>
                              </span>
                            </label>
                          ))}
                        </fieldset>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {pkg.notes.length > 0 && (
            <ul className="text-[11px] text-[#06b6d4] space-y-0.5">
              {pkg.notes.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <Panel title="Tienda" className="mb-4">
        <div className="flex flex-wrap gap-1 mb-2" role="tablist" aria-label="Categorías de la tienda">
          {TABS.map((t) => (
            <Btn key={t.id} role="tab" aria-selected={tab === t.id} tone={tab === t.id ? 'red' : 'gray'} onClick={() => setTab(t.id)}>
              {t.label}
            </Btn>
          ))}
        </div>
        <label htmlFor="shop-search" className="sr-only">
          Buscar por nombre
        </label>
        <input id="shop-search" className={`${INPUT_CLS} w-full mb-2`} placeholder="Buscar por nombre…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <p className="text-[10px] font-mono-code text-[#64748b] mb-2">
          {era === '2077' ? 'Core, CEMK y suplementos' : 'Core y suplementos (sin CEMK)'}: cada ítem dice de qué libro sale y, si está cargada, la página. Los suplementos (Black Chrome, DLC, Danger Gal) quedan marcados para que la mesa decida si los usa.
        </p>
        {tab === 'ammunition' && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <label htmlFor="shop-caliber" className="text-xs text-[#cbd5e1]">
              Para el arma
            </label>
            <select id="shop-caliber" className={SELECT_CLS} value={caliber} onChange={(e) => setCaliberPick(e.target.value)}>
              {AMMO_CALIBERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="text-[10px] font-mono-code text-[#64748b]">Cada compra son 10 balas; granadas y cohetes, de a una (Core p.344).</span>
          </div>
        )}
        {(tab === 'programs' || tab === 'gear') && (
          <p className={`text-[10px] font-mono-code mb-2 ${slots.overflow > 0 ? 'text-[#f59e0b]' : 'text-[#64748b]'}`}>
            Programas y Hardware comparten los slots del cyberdeck: Poor 5, Standard 7, Excellent 9 (Core p.196); el Bodyweight Suit suma 1 slot solo para Hardware (Core p.208).
            {' '}
            {slots.deckSlots > 0
              ? `Usás ${slots.programs + Math.max(0, slots.hardware - slots.hardwareOnlySlots)}/${slots.deckSlots} slots${slots.overflow > 0 ? `: sobran ${slots.overflow}` : ''}.`
              : slots.programs + slots.hardware > 0
              ? 'Todavía no compraste un cyberdeck.'
              : ''}
          </p>
        )}
        <ul className="max-h-96 overflow-y-auto space-y-1">
          {items.map((it) => {
            const candidate = makePurchase(it, tab);
            const covered = neuroportCovers(it.id, era, draft.installNeuroport);
            const affordable = canAfford(candidate) && !covered;
            const label = bookLabel(it);
            return (
              <li key={it.id} className="flex flex-wrap items-center gap-2 bg-[#0a0b0e] border border-[#1e2334] rounded-xs px-2 py-1.5">
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-white font-bold">{it.name}</span>
                  <span className="ml-2">
                    <SourceBadge book={label} />
                  </span>
                  {tab === 'cyberware' && (
                    <span className="ml-2 text-[10px] font-mono-code text-[#f59e0b]">HL {parseHumanityLossAverage(it.humanityLoss ?? '0')}</span>
                  )}
                  {tab === 'armor' && typeof it.sp === 'number' && <span className="ml-2 text-[10px] font-mono-code text-[#94a3b8]">SP {it.sp}</span>}
                  {tab === 'programs' && it.class && <span className="ml-2 text-[10px] font-mono-code text-[#a855f7]">{it.class}</span>}
                  {covered && <span className="block text-[10px] font-mono-code text-[#06b6d4]">Ya viene en el Neuroport: {covered} (CEMK RB p.36).</span>}
                </div>
                <span className="text-xs font-mono-code text-[#10b981]">{eb(it.cost)}</span>
                {tab === 'armor' && !isShield(it.name) ? (
                  <>
                    <Btn tone="green" disabled={!affordable} aria-label={`Comprar ${it.name} para la cabeza`} onClick={() => buy(it, 'head')}>
                      Cabeza
                    </Btn>
                    <Btn tone="green" disabled={!affordable} aria-label={`Comprar ${it.name} para el cuerpo`} onClick={() => buy(it, 'body')}>
                      Cuerpo
                    </Btn>
                  </>
                ) : (
                  <Btn tone="green" disabled={!affordable} aria-label={`Comprar ${it.name}`} onClick={() => buy(it)}>
                    Comprar
                  </Btn>
                )}
              </li>
            );
          })}
          {items.length === 0 && <li className="text-xs text-[#64748b]">Sin resultados.</li>}
        </ul>
        <p className="text-[10px] font-mono-code text-[#64748b] mt-2">Armadura por ubicación: se compra una pieza para la cabeza y otra para el cuerpo (Core p.97).</p>
      </Panel>

      <Panel title="Compras" className="mb-4">
        {draft.purchases.length === 0 ? (
          <p className="text-xs text-[#64748b]">Todavía no compraste nada.</p>
        ) : (
          <ul className="space-y-1">
            {draft.purchases.map((p, i) => (
              <li key={`${p.category}-${p.catalogId}-${p.location ?? ''}-${p.caliber ?? ''}`} className="flex items-center gap-2 text-xs bg-[#0a0b0e] border border-[#1e2334] rounded-xs px-2 py-1">
                <span className="flex-1 text-white">
                  {p.qty}× {p.name}
                  {p.location && <span className="ml-1 text-[#06b6d4]">({p.location === 'head' ? 'cabeza' : 'cuerpo'})</span>}
                  {p.category === 'cyberware' && <span className="ml-1 text-[#f59e0b] font-mono-code">HL {p.humanityLoss}</span>}
                </span>
                <span className="font-mono-code text-[#10b981]">{eb(p.cost * p.qty)}</span>
                <Btn tone="red" aria-label={`Quitar una unidad de ${p.name}`} onClick={() => removeOne(i)}>
                  Quitar
                </Btn>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {method === 'complete_package' && (
        <Panel title="Moda (Core p.105)" className="mb-4">
          <p className="text-xs text-[#94a3b8] mb-2">
            {eb(money.fashionBudget)} solo para moda; lo que no uses se pierde. Estilos: Core p.{CORE_GEAR_SKILLS.fashionStyles[0].source.page ?? '?'} en adelante.
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-[11px] text-[#cbd5e1]">
              Estilo
              <select className={`${SELECT_CLS} block`} value={fashionStyle} onChange={(e) => setFashionStyle(e.target.value)}>
                {CORE_GEAR_SKILLS.fashionStyles.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-[#cbd5e1]">
              Pieza
              <select className={`${SELECT_CLS} block`} value={fashionPiece} onChange={(e) => setFashionPiece(e.target.value)}>
                {pieces.map((p) => (
                  <option key={p} value={p}>
                    {p} ({eb(getFashionPrice(fashionStyle, p) ?? 0)})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-[#cbd5e1]">
              Cantidad
              <input type="number" min={1} className={`${INPUT_CLS} block w-16`} value={fashionQty} onChange={(e) => setFashionQty(Math.max(1, parseInt(e.target.value, 10) || 1))} />
            </label>
            <Btn tone="green" disabled={unit === null || fashionTooExpensive} onClick={addFashion}>
              Agregar {unit !== null ? `(${eb(unit * Math.max(1, fashionQty))})` : ''}
            </Btn>
          </div>
          {draft.fashion.length > 0 && (
            <ul className="mt-2 space-y-1">
              {draft.fashion.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs bg-[#0a0b0e] border border-[#1e2334] rounded-xs px-2 py-1">
                  <span className="flex-1 text-white">
                    {f.qty}× {f.style} · {f.piece}
                  </span>
                  <span className="font-mono-code text-[#10b981]">{eb(f.unitCost * f.qty)}</span>
                  <Btn tone="red" aria-label={`Quitar ${f.style} ${f.piece}`} onClick={() => update((d) => ({ ...d, fashion: d.fashion.filter((_, j) => j !== i) }))}>
                    Quitar
                  </Btn>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      {era === '2077' && (
        <Panel title="Neuroport y Cyberdeck Port (CEMK)" className="mb-4">
          <label className="flex items-start gap-2 text-xs text-[#cbd5e1] cursor-pointer">
            <input
              type="checkbox"
              checked={draft.installNeuroport}
              onChange={(e) => update((d) => ({ ...d, installNeuroport: e.target.checked, installCyberdeckPort: e.target.checked ? d.installCyberdeckPort : false }))}
            />
            <span>
              <b className="text-white">Neuroport</b> (gratis, HL 0): {neuroport.freeAtCreationEs} Trae Neural Link, Holophone, Biomonitor, Virtu, HUD (Chyron), dos Chipware Sockets y Personal Link (Interface Plug); no se compran aparte (CEMK RB pp. 35-36).
            </span>
          </label>
          <label className="flex items-start gap-2 text-xs text-[#cbd5e1] cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={draft.installCyberdeckPort}
              disabled={!draft.installNeuroport}
              onChange={(e) => update((d) => ({ ...d, installCyberdeckPort: e.target.checked }))}
            />
            <span>
              <b className="text-white">Cyberdeck Port</b> (opcional, CEMK RB p.{port.source.page ?? '?'}): {port.cost}, HL {parseHumanityLossAverage(port.humanityLoss)}. Requiere {port.requires}.
            </span>
          </label>
        </Panel>
      )}

      <Panel title="Running Out of Cash? (opcional, Core pp. 118-119)" className="mb-4">
        <label className="flex items-start gap-2 text-xs text-[#cbd5e1] cursor-pointer">
          <input
            type="checkbox"
            checked={draft.runningOutOfCash.enabled}
            onChange={(e) => update((d) => ({ ...d, runningOutOfCash: { ...d.runningOutOfCash, enabled: e.target.checked } }))}
          />
          <span>Usar esta regla opcional.</span>
        </label>
        <p className="text-[11px] text-[#f59e0b] mt-1">Toda la mesa debe aceptarla (Core p.119) y requiere permiso del GM.</p>
        {draft.runningOutOfCash.enabled && (
          <div className="mt-2">
            <label htmlFor="roc-employer" className="text-[11px] text-[#cbd5e1] block">
              Empleador
            </label>
            <select
              id="roc-employer"
              className={SELECT_CLS}
              value={draft.runningOutOfCash.employer ?? ''}
              onChange={(e) => update((d) => ({ ...d, runningOutOfCash: { ...d.runningOutOfCash, employer: e.target.value || null } }))}
            >
              <option value="">— elegir —</option>
              {roc.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#94a3b8] mt-2">
              Recibís +{eb(roc.cyberwareValue)} solo para ciberware y un Neural Link gratis; a cambio trabajás para ese empleador (Core pp. {roc.source.page}-{roc.catchSource.page}).
            </p>
          </div>
        )}
      </Panel>

      <Panel title="Vivienda inicial (Core p.105 y p.377)">
        <p className="text-xs text-[#94a3b8]">
          {role === 'Exec'
            ? `${housing.exec.housing} (${housing.exec.location}), estilo ${housing.exec.lifestyle}; sin renta este mes, ${eb(housing.exec.lifestyleMonthly)} el día 1 de cada mes.`
            : `${housing.default.housing} (${housing.default.location}), estilo ${housing.default.lifestyle}; primer mes gratis, ${eb(housing.default.owedNextMonth)} el día 1 del mes siguiente o desalojo el día ${housing.default.evictionDay}.`}
        </p>
        {role === 'Nomad' && <p className="text-[11px] text-[#06b6d4] mt-1">{housing.nomadExtra}</p>}
      </Panel>
    </div>
  );
};
