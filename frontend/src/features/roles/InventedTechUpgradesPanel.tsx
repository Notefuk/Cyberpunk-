// [Claude Code · 2026-11-14] v5.42.0 (plan 33): Invented Tech Upgrades (DLC, pp.3-9).
// Catálogo de las 18 mejoras de 6 Techs, calculadora de precio (costo 1 + costo 2 + 50% de mano de obra, o el kit)
// y termómetro para que el GM le ponga precio a una mejora inventada. El efecto se anota en texto.
import React, { useMemo, useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import {
  INVENTED_TUPS_SOURCE, INVENTED_UPGRADES, INVENTING_TECHS, TUP_THERMOMETER, priceInventedUpgrade, thermometerById,
  type InstallMode, type ThermometerLevel
} from '../../data/inventedTechUpgrades';

const fmt = (n: number) => `${n.toLocaleString('es-AR')}eb`;

export const InventedTechUpgradesPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.characters.find((c) => c.id === s.activeCharacterId));
  const spend = useCharacterStore((s) => s.spendEurodollarsFor);
  const addInventedUpgrade = useCharacterStore((s) => s.addInventedUpgrade);
  const removeInventedUpgrade = useCharacterStore((s) => s.removeInventedUpgrade);
  const [upgradeId, setUpgradeId] = useState(INVENTED_UPGRADES[0].id);
  const [custom, setCustom] = useState<{ name: string; level: ThermometerLevel; cost2: number; effect: string }>({ name: '', level: 'medium', cost2: 500, effect: '' });
  const [weaponId, setWeaponId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState(0);
  const [mode, setMode] = useState<InstallMode>('npc_install');
  const [msg, setMsg] = useState<string | null>(null);
  const isCustom = upgradeId === 'custom';
  const up = INVENTED_UPGRADES.find((u) => u.id === upgradeId);
  const cost2 = isCustom ? custom.cost2 : up?.cost2 ?? 0;
  const price = useMemo(() => priceInventedUpgrade(itemCost, cost2, mode), [itemCost, cost2, mode]);
  if (!char) return null;
  const weapons = char.equippedWeapons ?? [];

  const pickWeapon = (id: string) => {
    setWeaponId(id);
    const w = weapons.find((x) => x.instanceId === id);
    if (w) { setItemName(w.name); setItemCost(w.cost ?? 0); }
  };

  const record = (charge: boolean) => {
    const name = isCustom ? custom.name.trim() : up!.name;
    if (!name || !itemName.trim()) { setMsg('Falta el nombre de la mejora o del ítem.'); return; }
    if (charge && !spend(char.id, price.payNow, `Invented Tech Upgrade: ${name} en ${itemName.trim()}`)) { setMsg(`No alcanza: hacen falta ${fmt(price.payNow)}.`); return; }
    addInventedUpgrade({
      id: `itu-${Date.now()}`, upgradeId: isCustom ? 'custom' : up!.id, name, weaponInstanceId: weaponId || undefined,
      itemName: itemName.trim(), effect: isCustom ? custom.effect.trim() : up!.effect, paid: charge ? price.payNow : 0, at: new Date().toISOString()
    });
    setMsg(charge ? `Anotada y cobrada (${fmt(price.payNow)}).` : 'Anotada sin cobrar.');
  };

  return (
    <div className="bg-[#0b0f17] border border-[#1b2234] p-3 rounded-xs space-y-3 text-[11px] font-mono-code text-slate-300" data-testid="invented-tups">
      <div className="font-tech font-bold text-[#f59e0b] uppercase">Invented Tech Upgrades</div>
      <p className="text-slate-500">Mejoras inventadas (Core p.148) que venden o instalan los Techs de Night City. {INVENTED_TUPS_SOURCE} pp.3-9. El efecto se anota en texto.</p>

      <label className="block">Mejora
        <select value={upgradeId} onChange={(e) => setUpgradeId(e.target.value)} aria-label="Mejora" className="w-full bg-[#141824] border border-[#273248] p-1">
          {INVENTING_TECHS.map((t) => (
            <optgroup key={t.id} label={t.name}>
              {INVENTED_UPGRADES.filter((u) => u.techId === t.id).map((u) => <option key={u.id} value={u.id}>{u.name} (DV{u.dv}, {fmt(u.cost2)})</option>)}
            </optgroup>
          ))}
          <option value="custom">Inventada en la mesa (termómetro)</option>
        </select>
      </label>

      {up && !isCustom && (
        <div className="bg-[#111420] border border-[#1e2538] p-2 rounded-xs space-y-1" data-testid="invented-tup-card">
          <div className="text-white font-bold">{up.name} · {INVENTING_TECHS.find((t) => t.id === up.techId)?.name} · p.{up.page}</div>
          <div>DV{up.dv} · Costo 1: {up.cost1 === 'item' ? 'lo que vale el ítem' : 'lo que vale el componente más caro'} · Costo 2: {fmt(up.cost2)} ({thermometerById(up.thermometer).label})</div>
          <div className="text-slate-400">Requisito: {up.requirement}</div>
          <div>{up.effect}</div>
          {up.priceNote && <div className="text-slate-500">{up.priceNote}</div>}
          <div className="text-slate-500">{INVENTING_TECHS.find((t) => t.id === up.techId)?.blurb}</div>
        </div>
      )}

      {isCustom && (
        <div className="grid grid-cols-2 gap-2">
          <label className="col-span-2">Nombre<input value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} className="w-full bg-[#141824] border border-[#273248] p-1" /></label>
          <label>Termómetro
            <select value={custom.level} onChange={(e) => { const lv = e.target.value as ThermometerLevel; setCustom({ ...custom, level: lv, cost2: thermometerById(lv).cost }); }} className="w-full bg-[#141824] border border-[#273248] p-1">
              {TUP_THERMOMETER.map((t) => <option key={t.id} value={t.id}>{t.label} ({fmt(t.cost)}{t.orMore ? '+' : ''})</option>)}
            </select></label>
          <label>Costo 2<input type="number" min={0} value={custom.cost2} onChange={(e) => setCustom({ ...custom, cost2: parseInt(e.target.value) || 0 })} className="w-full bg-[#141824] border border-[#273248] p-1" /></label>
          <label className="col-span-2">Efecto<input value={custom.effect} onChange={(e) => setCustom({ ...custom, effect: e.target.value })} className="w-full bg-[#141824] border border-[#273248] p-1" /></label>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <label className="col-span-2">Ítem a mejorar
          <select value={weaponId} onChange={(e) => pickWeapon(e.target.value)} className="w-full bg-[#141824] border border-[#273248] p-1">
            <option value="">Otro ítem (escribilo abajo)</option>
            {weapons.map((w) => <option key={w.instanceId} value={w.instanceId}>{w.name}</option>)}
          </select></label>
        <label>Nombre del ítem<input value={itemName} onChange={(e) => setItemName(e.target.value)} aria-label="Nombre del ítem" className="w-full bg-[#141824] border border-[#273248] p-1" /></label>
        <label>Costo 1 (eb)<input type="number" min={0} value={itemCost} onChange={(e) => setItemCost(parseInt(e.target.value) || 0)} aria-label="Costo del ítem" className="w-full bg-[#141824] border border-[#273248] p-1" /></label>
      </div>

      <div className="flex gap-3">
        <label className="flex items-center gap-1"><input type="radio" checked={mode === 'npc_install'} onChange={() => setMode('npc_install')} /> La instala el Tech PNJ</label>
        <label className="flex items-center gap-1"><input type="radio" checked={mode === 'kit'} onChange={() => setMode('kit')} /> Comprar el kit</label>
      </div>
      <div className="bg-[#111420] border border-[#1e2538] p-2 rounded-xs" data-testid="invented-tup-price">
        Costo 1 {fmt(price.cost1)} + Costo 2 {fmt(price.cost2)}{mode === 'npc_install' ? ` + mano de obra 50% ${fmt(price.labor)}` : ''} = <b className="text-[#f59e0b]">{fmt(price.total)}</b>
        <div className="text-slate-500">
          {mode === 'npc_install'
            ? `Se paga ahora ${fmt(price.payNow)}. El Tech PNJ la instala sin tirada (sugerencia del libro, p.3) en el tiempo del Core p.149.`
            : `Ahora ${fmt(price.payNow)} por el kit; al instalarla, el Tech del grupo paga ${fmt(price.payOnInstall)} de materiales y tira su DV. Si le sale, ya sabe instalarla en otros ítems.`}
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => record(true)} className="px-2 py-1 bg-[#f59e0b] text-black font-bold rounded-xs">Anotar y cobrar {fmt(price.payNow)}</button>
        <button type="button" onClick={() => record(false)} className="px-2 py-1 border border-[#273248] rounded-xs">Anotar sin cobrar</button>
      </div>
      {msg && <p className="text-[#10b981]">{msg}</p>}

      {(char.inventedUpgrades ?? []).length > 0 && (
        <div className="space-y-1" data-testid="invented-tups-list">
          <div className="text-slate-400 uppercase">Mejoras anotadas</div>
          {(char.inventedUpgrades ?? []).map((r) => (
            <div key={r.id} className="flex items-start gap-2 border-t border-[#1b2234] pt-1">
              <div className="flex-1"><b className="text-white">{r.name}</b> en {r.itemName}{r.paid ? ` (${fmt(r.paid)})` : ''}: {r.effect}</div>
              <button type="button" onClick={() => removeInventedUpgrade(r.id)} className="text-red-400" title="Quitar la anotación (no devuelve la plata)">✕</button>
            </div>
          ))}
        </div>
      )}

      <details>
        <summary className="cursor-pointer text-slate-400">Termómetro de precios para el GM (p.4)</summary>
        <div className="space-y-1 mt-1">
          {TUP_THERMOMETER.map((t) => (
            <div key={t.id}><b className="text-white">{t.label}: {fmt(t.cost)}{t.orMore ? '+' : ''} ({t.priceCategory})</b>
              <ul className="list-disc pl-4 text-slate-400">{t.examples.map((e) => <li key={e}>{e}</li>)}</ul></div>
          ))}
          <p className="text-slate-500">Es una guía: el GM puede ajustar y decir que no si una invención desbalancea el juego.</p>
        </div>
      </details>
    </div>
  );
};
