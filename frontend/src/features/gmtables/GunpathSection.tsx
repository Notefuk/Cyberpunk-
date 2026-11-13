// [Claude Code · 2026-11-13] v5.30.0 (plan 31): generador Gunpath de Toggle's Temple, Interface RED Vol. 5 pp.48-53.
import { useMemo, useState } from 'react';
import coreData from '../../data/core-rules.cprpack.json';
import { GUNPATH_RULES } from '../../data/gmTables/gunpath';
import { GUNPATH_BASE_WEAPON_ID, gunpathToWeapon, rollGunpath, type GunpathWeapon } from '../../engine/gunpath';
import { fillTokens, screamsheetTokens } from '../../engine/screamsheet';
import { useCharacterStore } from '../../store/useCharacterStore';
import type { WeaponItem } from '../../types/cyberpunk';

const PACK_WEAPONS = (coreData as unknown as { weapons: WeaponItem[] }).weapons;
const QUALITY_LABEL = { poor: 'Pobre', standard: 'Estándar', excellent: 'Excelente' } as const;

const card = 'chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3';
const btn = 'px-3 py-1.5 bg-[#1a2030] hover:bg-[#22d3ee] hover:text-black text-[11px] font-tech font-bold uppercase rounded-xs cursor-pointer disabled:opacity-40';
const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const field = 'bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white';

export function GunpathSection() {
  const [count, setCount] = useState(1);
  const [gun, setGun] = useState<GunpathWeapon | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [done, setDone] = useState('');
  const character = useCharacterStore((s) => s.characters.find((c) => c.id === s.activeCharacterId));
  const equip = useCharacterStore((s) => s.equipWeaponFromCatalog);

  const tokens = useMemo(() => (gun ? screamsheetTokens([gun.namePattern]) : []), [gun]);
  const name = gun ? fillTokens(gun.namePattern, values) : '';
  const base = gun ? PACK_WEAPONS.find((w) => w.id === GUNPATH_BASE_WEAPON_ID[gun.type]) : undefined;

  const generate = () => {
    setGun(rollGunpath(Math.random, { attachments: count }));
    setValues({});
    setDone('');
  };

  const give = () => {
    if (!gun || !base) return;
    equip(gunpathToWeapon(gun, name.replace(/\[[^\]]+\]/g, '').replace(/\s+/g, ' ').trim() || gun.type, base));
    setDone(`Equipada a ${character?.handle || 'el personaje activo'}.`);
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <h3 className="font-tech text-sm font-bold text-white uppercase">Cómo funciona</h3>
        <ul className="list-disc pl-5 space-y-0.5">{GUNPATH_RULES.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
      </div>

      <div className={card}>
        <div className="flex flex-wrap items-center gap-2">
          <label className={small}>
            Attachments{' '}
            <select className={field} value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="Cantidad de attachments">
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className={btn} onClick={generate}>
            🎲 Generar arma
          </button>
        </div>
        <p className="text-[10px] font-mono-code text-[#64748b]">
          El libro no dice cuántos attachments lleva un arma: elegí la cantidad. Los repetidos y los que no corresponden al arma se vuelven a tirar.
        </p>

        {gun && (
          <div className="space-y-2" data-testid="gunpath-result">
            <h4 className="font-tech text-base font-bold text-[#22d3ee]">
              {gun.manufacturer} {name}
            </h4>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
              <dt className={small}>Fabricante</dt>
              <dd className="text-[12px] text-white">
                {gun.manufacturer}
                {gun.manufacturerNote ? ` · ${gun.manufacturerNote}` : ''}
              </dd>
              <dt className={small}>Tipo</dt>
              <dd className="text-[12px] text-white">
                {gun.type} ({gun.skill}) · base {gun.baseCost}eb ({gun.baseTier})
              </dd>
              <dt className={small}>Calidad</dt>
              <dd className="text-[12px] text-white">{QUALITY_LABEL[gun.quality]}</dd>
              <dt className={small}>Attachments</dt>
              <dd className="text-[12px] text-white">{gun.attachments.length ? gun.attachments.map((a) => `${a.name} (+${a.cost}eb)`).join(', ') : 'Ninguno'}</dd>
              <dt className={small}>Costo</dt>
              <dd className="text-[12px] text-white font-bold">
                {gun.cost}eb ({gun.costTier})
              </dd>
              <dt className={small}>Nombre</dt>
              <dd className="text-[12px] text-white">
                {gun.namePattern}
                {gun.nameExample ? ` · ej.: ${gun.nameExample}` : ''}
              </dd>
            </dl>
            {tokens.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {tokens.map((t) => (
                  <label key={t} className="flex flex-col gap-0.5">
                    <span className={small}>{t}</span>
                    <input className={field} value={values[t] ?? ''} onChange={(e) => setValues({ ...values, [t]: e.target.value })} />
                  </label>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className={btn} onClick={give} disabled={!character || !base}>
                ➕ Equipar a {character?.handle || 'personaje activo'}
              </button>
              {done && <span className="text-[11px] font-mono-code text-[#4ade80]">{done}</span>}
            </div>
            <p className="text-[10px] font-mono-code text-[#64748b]">
              Usa la ficha del {base?.name ?? gun.type} del Core con la calidad, el costo y los attachments de fábrica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
