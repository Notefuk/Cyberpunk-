// v5.5.0 [Claude Code · 2026-10-29]: detalle de un ítem de la tienda del creador y mejoras de un arma comprada (plan 21).
import React from 'react';
import { createPortal } from 'react-dom';
import { needsFixer, priceTier, shopSourceLabel, weaponModOptions, weaponModSlots, effectiveUnitCost } from '../../../engine/creatorShop';
import { parseHumanityLossAverage } from '../../../engine/characterEngine';
import { Btn, eb } from './CreatorUi';

/** Campos del pack que puede mostrar el detalle (cada categoría trae algunos). */
export interface ShopPackItem {
  id: string;
  name: string;
  cost: number;
  costTier?: string;
  sourceBook?: string;
  sourceBookTitle?: string;
  sourcePage?: number | string;
  era?: string;
  description?: string;
  notes?: string;
  // armas
  type?: string;
  skill?: string;
  damage?: string;
  rof?: number;
  hands?: number;
  concealable?: boolean;
  standardMag?: number;
  ammoType?: string;
  altFireModes?: string;
  autofireMaxMult?: number;
  examples?: string;
  // armadura
  sp?: number;
  penalty?: number;
  // ciberware
  humanityLoss?: string;
  install?: string;
  // drogas
  duration?: string;
  primaryEffect?: string;
  secondaryEffect?: string;
  addictionDv?: number;
  // programas
  class?: string;
  atk?: number;
  def?: number;
  rez?: number;
  per?: number;
  spd?: number;
  slots?: number;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) =>
  value === undefined || value === null || value === '' ? null : (
    <div className="flex gap-2 text-xs py-0.5">
      <span className="w-28 shrink-0 text-[#64748b] font-mono-code uppercase text-[10px] pt-0.5">{label}</span>
      <span className="text-[#e2e8f0]">{value}</span>
    </div>
  );

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) =>
  createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#10121a] border border-[#06b6d4]/60 rounded-xs p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-2 mb-2">
          <h3 className="font-tech text-base font-bold text-white flex-1">{title}</h3>
          <Btn aria-label="Cerrar" className="min-h-[44px] min-w-[44px]" onClick={onClose}>
            ✕
          </Btn>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );

export const ShopItemDetail: React.FC<{
  item: ShopPackItem;
  category: string;
  noFixerDouble?: boolean;
  onClose: () => void;
  buyActions?: React.ReactNode;
}> = ({ item, category, noFixerDouble, onClose, buyActions }) => {
  const tier = priceTier(item);
  const price = effectiveUnitCost(item.cost, noFixerDouble, item.costTier);
  const slots = category === 'weapons' ? weaponModSlots(item) : null;
  return (
    <Modal title={item.name} onClose={onClose}>
      <p className="text-[10px] font-mono-code text-[#06b6d4] mb-2">{shopSourceLabel(item)}</p>
      {(item.description || item.notes) && <p className="text-xs text-[#cbd5e1] mb-3 whitespace-pre-line">{item.description || item.notes}</p>}
      <div className="border-t border-[#1e2334] pt-2 mb-3">
        <Row label="Precio" value={`${eb(price)}${price !== item.cost ? ` (doble sin Fixer; lista ${eb(item.cost)})` : ''}`} />
        <Row label="Categoría" value={`${tier}${needsFixer(item) ? ' · sin Fixer no se consigue (Core p.385)' : ''}`} />
        {category === 'weapons' && (
          <>
            <Row label="Skill" value={item.skill} />
            <Row label="Daño" value={item.damage} />
            <Row label="ROF" value={item.rof} />
            <Row label="Manos" value={item.hands} />
            <Row label="Ocultable" value={item.concealable === undefined ? undefined : item.concealable ? 'Sí' : 'No'} />
            <Row label="Cargador" value={item.standardMag ? `${item.standardMag} (${item.ammoType ?? ''})` : undefined} />
            <Row label="Autofire" value={item.autofireMaxMult ? `Sí, hasta ×${item.autofireMaxMult} (Core p.173)` : undefined} />
            <Row label="Otros modos" value={item.altFireModes} />
            <Row label="Slots de mejoras" value={slots ? `${slots} (Core p.342)` : 'Ninguno (exótica o cuerpo a cuerpo)'} />
            <Row label="Ejemplos" value={item.examples} />
          </>
        )}
        {category === 'armor' && (
          <>
            <Row label="SP" value={item.sp} />
            <Row label="Penalización" value={item.penalty ? `−${item.penalty} a REF, DEX y MOVE (Core pp.96-97)` : 'Ninguna'} />
          </>
        )}
        {category === 'cyberware' && (
          <>
            <Row label="Ubicación" value={item.type} />
            <Row label="Instalación" value={item.install} />
            <Row label="Humanity Loss" value={item.humanityLoss ? `${item.humanityLoss} (promedio ${parseHumanityLossAverage(item.humanityLoss)})` : undefined} />
          </>
        )}
        {category === 'drugs' && (
          <>
            <Row label="Duración" value={item.duration} />
            <Row label="Efecto" value={item.primaryEffect} />
            <Row label="Adicción" value={item.secondaryEffect} />
            <Row label="DV de adicción" value={item.addictionDv ? `WILL + Resist Torture/Drugs + 1d10 contra ${item.addictionDv} (Core p.227)` : undefined} />
          </>
        )}
        {category === 'programs' && (
          <>
            <Row label="Clase" value={item.class} />
            <Row label="ATK / DEF / REZ" value={`${item.atk ?? 0} / ${item.def ?? 0} / ${item.rez ?? 0}`} />
            <Row label="PER / SPD" value={item.per !== undefined ? `${item.per} / ${item.spd ?? 0}` : undefined} />
          </>
        )}
      </div>
      {buyActions && <div className="flex flex-wrap gap-2">{buyActions}</div>}
    </Modal>
  );
};

/** Mejoras de un arma comprada: attachments del Core y, en 2077, los Rebuilds del CEMK. */
export const WeaponModsEditor: React.FC<{
  weapon: ShopPackItem;
  mods: string[];
  era: string | null | undefined;
  noFixerDouble?: boolean;
  cashLeft: number;
  onChange: (mods: string[]) => void;
  onClose: () => void;
}> = ({ weapon, mods, era, noFixerDouble, cashLeft, onChange, onClose }) => {
  const options = weaponModOptions(weapon, mods, era);
  const max = weaponModSlots(weapon);
  const used = options.filter((o) => o.installed).reduce((n, o) => n + o.att.slots, 0);
  const rebuilds = options.filter((o) => o.att.rebuild2077);
  const attachments = options.filter((o) => !o.att.rebuild2077);
  const renderOption = (o: (typeof options)[number]): React.ReactNode => {
    const price = effectiveUnitCost(o.att.cost, noFixerDouble, o.att.costTier);
    const tooExpensive = !o.installed && price > cashLeft;
    return (
      <li key={o.att.id} className={`border rounded-xs p-2 ${o.installed ? 'border-[#10b981] bg-[#10b981]/10' : 'border-[#1e2334] bg-[#0a0b0e]'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-white flex-1">{o.att.name}</span>
          <span className="text-[10px] font-mono-code text-[#94a3b8]">
            {o.att.slots} slot{o.att.slots > 1 ? 's' : ''} · {eb(price)}
          </span>
          <Btn
            tone={o.installed ? 'red' : 'green'}
            className="min-h-[40px]"
            disabled={!o.installed && (!!o.blocked || tooExpensive)}
            onClick={() => onChange(o.installed ? mods.filter((m) => m !== o.att.id) : [...mods, o.att.id])}
          >
            {o.installed ? 'Sacar' : 'Poner'}
          </Btn>
        </div>
        <p className="text-[11px] text-[#cbd5e1] mt-1">{o.att.summary}</p>
        <p className="text-[10px] text-[#94a3b8]">{o.att.fullRules}</p>
        {!o.installed && (o.blocked || tooExpensive) && <p className="text-[10px] text-[#f59e0b] mt-0.5">{o.blocked ?? 'No te alcanza la plata.'}</p>}
      </li>
    );
  };
  return (
    <Modal title={`Mejorar: ${weapon.name}`} onClose={onClose}>
      <p className="text-xs text-[#cbd5e1] mb-2">
        Slots usados: {used}/{max} (Core p.342). El costo de cada mejora se suma a la compra.
      </p>
      {max === 0 && <p className="text-xs text-[#f59e0b]">Esta arma no tiene slots de mejoras.</p>}
      {rebuilds.length > 0 && (
        <div className="mb-3">
          <h4 className="text-[11px] font-mono-code text-[#a855f7] uppercase mb-1">Convertir a Power / Smart / Tech (CEMK pp.30-31)</h4>
          <p className="text-[10px] text-[#94a3b8] mb-1">
            Cada Rebuild cuesta 1.000 €$ y ocupa 2 slots; va uno solo por arma y se instala en 1 hora. Power: +5 al daño extra de las heridas críticas y rebote. Smart: +1 a pegar con Interface Plug o Subdermal Grip. Tech: se carga con el Move y el próximo tiro atraviesa cobertura fina e ignora la mitad del SP.
          </p>
          <ul className="space-y-1">{rebuilds.map(renderOption)}</ul>
        </div>
      )}
      {era !== '2077' && <p className="text-[10px] text-[#64748b] mb-2">Los Rebuilds (Power, Smart, Tech) son del CEMK: aparecen en era 2077.</p>}
      {attachments.length > 0 && (
        <div>
          <h4 className="text-[11px] font-mono-code text-[#06b6d4] uppercase mb-1">Accesorios (Core pp.342-343)</h4>
          <ul className="space-y-1">{attachments.map(renderOption)}</ul>
        </div>
      )}
    </Modal>
  );
};
