// [Claude Code · 2026-11-13] v5.33.0 (plan 31): Cyberpets del PJ, "Your New Best Friend" (Interface RED Vol. 5 pp.72-81).
import { useState } from 'react';
import type { CharacterSheet, OwnedPet } from '../../types/cyberpunk';
import { useCharacterStore } from '../../store/useCharacterStore';
import { CYBERPETS, type CyberpetModel } from '../../data/cyberpets';
import { ENEMIES_CATALOG } from '../../data/enemiesCatalog';
import { sheetSkillLevel } from '../../engine/skillLookup';
import {
  CYBERPET_RULES,
  PET_BEDS,
  PET_TIER_LABEL,
  animalHandlingBase,
  canAddPetCyberware,
  petLifestyleMonthly,
  petObedience,
  petSlotsUsed,
} from '../../engine/cyberpets';

const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const field = 'bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white';
const btn = 'px-2 py-1 bg-[#1a2030] hover:bg-[#f472b6] hover:text-black text-[10px] font-tech font-bold uppercase rounded-xs cursor-pointer disabled:opacity-40';

const enemyOf = (id: string) => ENEMIES_CATALOG.find((e) => e.id === id);
const modelOf = (id: string) => CYBERPETS.find((m) => m.enemyId === id);

/** 1d10 con crítico (Core p.129). */
function d10(): { total: number; text: string } {
  const r = 1 + Math.floor(Math.random() * 10);
  if (r === 10 || r === 1) {
    const x = 1 + Math.floor(Math.random() * 10);
    return { total: r === 10 ? 10 + x : 1 - x, text: r === 10 ? `10+${x}` : `1-${x}` };
  }
  return { total: r, text: String(r) };
}

function PetCard({ pet, model, character }: { pet: OwnedPet; model: CyberpetModel; character: CharacterSheet }) {
  const update = useCharacterStore((s) => s.updatePet);
  const remove = useCharacterStore((s) => s.removePet);
  const [cw, setCw] = useState({ name: '', zeroSlot: false });
  const [dv, setDv] = useState(13);
  const [msg, setMsg] = useState('');
  const e = enemyOf(pet.enemyId);
  const skill = sheetSkillLevel(character, 'Animal Handling');
  const base = animalHandlingBase(character.stats.INT, skill);
  const ob = petObedience(base, pet);
  const maxHp = e?.hp ?? 0;

  const handle = (what: string) => {
    const r = d10();
    const total = base + r.total;
    setMsg(`${what}: INT ${character.stats.INT} + Animal Handling ${skill} + d10 ${r.text} = ${total} contra DV${dv}: ${total >= dv ? 'sale' : 'no sale'}.`);
    return total >= dv;
  };

  return (
    <div className="border border-[#3b1d33] rounded-xs p-2 space-y-1.5" data-testid={`pet-${pet.instanceId}`}>
      <div className="flex flex-wrap items-center gap-2">
        <input className={`${field} font-tech font-bold`} value={pet.name} onChange={(ev) => update(pet.instanceId, { name: ev.target.value.slice(0, 40) })} aria-label="Nombre de la mascota" />
        <span className={small}>
          {model.name} · {PET_TIER_LABEL[model.tier]} · IR5 p.{model.page}
        </span>
        <button type="button" className={btn} onClick={() => remove(pet.instanceId)}>
          Quitar
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-mono-code text-white">
          HP {pet.currentHp}/{maxHp}
        </span>
        <button type="button" className={btn} onClick={() => update(pet.instanceId, { currentHp: Math.max(0, pet.currentHp - 1) })}>
          −1
        </button>
        <button type="button" className={btn} onClick={() => update(pet.instanceId, { currentHp: Math.min(maxHp, pet.currentHp + 1) })}>
          +1
        </button>
        {e && (
          <span className={small}>
            SP {e.headSp}/{e.bodySp} · Seriously Wounded {e.seriouslyWounded} · Death Save {e.deathSave} · MOVE {e.stats.MOVE}
          </span>
        )}
      </div>
      {e && (
        <p className={small}>
          Ataques: {e.weapons.map((w) => `${w.name} (C# ${w.skillBase}, ROF${w.rof}, ${w.damage})`).join(' · ') || '—'}
        </p>
      )}
      {e && <p className={small}>Ciberware de fábrica: {e.cyberware.join(' · ') || '—'}</p>}
      {e && e.specialRules.length > 0 && <p className={small}>Especial: {e.specialRules.join(' · ')}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <label className={`${small} flex items-center gap-1`}>
          <input type="checkbox" checked={pet.lifestylePaid} onChange={(ev) => update(pet.instanceId, { lifestylePaid: ev.target.checked })} />
          Lifestyle pago ({model.lifestyle}, {petLifestyleMonthly(model)}eb/mes)
        </label>
        <label className={`${small} flex items-center gap-1`}>
          <input type="checkbox" checked={pet.housed} onChange={(ev) => update(pet.instanceId, { housed: ev.target.checked })} />
          Duerme bien ({PET_BEDS[model.tier] === 0 ? 'no ocupa cama' : `${PET_BEDS[model.tier]} cama${PET_BEDS[model.tier] > 1 ? 's' : ''}`})
        </label>
        <label className={`${small} flex items-center gap-1`}>
          <input type="checkbox" checked={!!pet.mistreated} onChange={(ev) => update(pet.instanceId, { mistreated: ev.target.checked || undefined })} />
          Maltratada
        </label>
      </div>
      <p className={`text-[11px] font-mono-code ${ob.obeys ? 'text-[#4ade80]' : 'text-[#f97316]'}`}>
        {ob.obeys ? '🐾 Obedece. ' : '⚠️ No obedece. '}
        {ob.reason}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <label className={small}>
          DV <input className={`${field} w-12`} inputMode="numeric" value={dv} onChange={(ev) => setDv(Number(ev.target.value) || 0)} aria-label="DV de Animal Handling" />
        </label>
        <button type="button" className={btn} onClick={() => handle('Recuperar el control')}>
          Animal Handling
        </button>
      </div>

      <div className="space-y-1">
        <p className={small}>
          Ciberware agregado: {petSlotsUsed(pet)}/{model.cyberwareSlots} ranuras
        </p>
        {pet.extraCyberware.map((c, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-white">
              {c.name}
              {c.zeroSlot ? ' (0 ranuras, Tech Upgrade)' : ''}
            </span>
            {c.trained ? (
              <span className="text-[10px] font-mono-code text-[#4ade80]">entrenada</span>
            ) : (
              <button
                type="button"
                className={btn}
                onClick={() => {
                  if (handle(`Entrenar ${c.name} (1 día, DV de instalación)`)) update(pet.instanceId, { extraCyberware: pet.extraCyberware.map((x, j) => (j === i ? { ...x, trained: true } : x)) });
                }}
              >
                Entrenar (DV de instalación)
              </button>
            )}
            <button type="button" className={btn} onClick={() => update(pet.instanceId, { extraCyberware: pet.extraCyberware.filter((_, j) => j !== i) })}>
              Sacar
            </button>
          </div>
        ))}
        {pet.extraCyberware.some((c) => !c.trained) && <p className="text-[10px] font-mono-code text-[#f97316]">Sin entrenar, solo come y duerme hasta que el entrenamiento salga (p.73).</p>}
        <div className="flex flex-wrap items-center gap-1.5">
          <input className={field} placeholder="Ciberware nuevo" value={cw.name} onChange={(ev) => setCw({ ...cw, name: ev.target.value })} aria-label="Ciberware nuevo de la mascota" />
          <label className={`${small} flex items-center gap-1`}>
            <input type="checkbox" checked={cw.zeroSlot} onChange={(ev) => setCw({ ...cw, zeroSlot: ev.target.checked })} /> Ocupa 0 (Tech Upgrade)
          </label>
          <button
            type="button"
            className={btn}
            disabled={!cw.name.trim() || !canAddPetCyberware(pet, model, cw.zeroSlot)}
            onClick={() => {
              update(pet.instanceId, { extraCyberware: [...pet.extraCyberware, { name: cw.name.trim().slice(0, 80), trained: false, zeroSlot: cw.zeroSlot || undefined }] });
              setCw({ name: '', zeroSlot: false });
            }}
          >
            Instalar
          </button>
        </div>
        <p className="text-[10px] font-mono-code text-[#64748b]">Lo instala un Medtech con Science (Biology) 4+ en un lugar especial, con las DV de un humano (p.73).</p>
      </div>
      {msg && <p className="text-[11px] font-mono-code text-[#f9a8d4]">{msg}</p>}
    </div>
  );
}

export function PetPanel({ character }: { character: CharacterSheet }) {
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState(CYBERPETS[0]?.enemyId ?? '');
  const [msg, setMsg] = useState('');
  const addPet = useCharacterStore((s) => s.addPet);
  const spend = useCharacterStore((s) => s.spendEurodollarsFor);
  const pets = character.pets ?? [];
  const monthly = pets.reduce((s, p) => s + (modelOf(p.enemyId) ? petLifestyleMonthly(modelOf(p.enemyId)!) : 0), 0);
  const beds = pets.reduce((s, p) => s + (modelOf(p.enemyId) ? PET_BEDS[modelOf(p.enemyId)!.tier] : 0), 0);
  const chosen = modelOf(pick);

  const add = (pay: boolean) => {
    if (!chosen) return;
    const e = enemyOf(chosen.enemyId);
    const total = chosen.cost + petLifestyleMonthly(chosen);
    if (pay && !spend(character.id, total, `Cyberpet ${chosen.name} + primer mes de Lifestyle (IR5 p.72)`)) {
      setMsg(`No te alcanza: hacen falta ${total}eb.`);
      return;
    }
    addPet({ instanceId: `pet-${Date.now().toString(36)}`, enemyId: chosen.enemyId, name: chosen.name.replace(/™/g, ''), currentHp: e?.hp ?? 0, extraCyberware: [], lifestylePaid: true, housed: true });
    setMsg(pay ? `Compraste ${chosen.name}: ${chosen.cost}eb + ${petLifestyleMonthly(chosen)}eb del primer mes de su Lifestyle.` : `Agregaste ${chosen.name} sin cobrar.`);
  };

  return (
    <div className="chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3" data-testid="pet-panel">
      <button type="button" className="w-full flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)} aria-expanded={open}>
        <h3 className="font-tech text-sm font-bold text-[#f472b6] uppercase">🐾 Mascota</h3>
        <span className={small}>
          {pets.length ? `${pets.length} · ${monthly}eb/mes · ${beds} cama${beds === 1 ? '' : 's'} · ` : ''}IR5 pp.72-81 {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <>
          <details>
            <summary className={`${small} cursor-pointer`}>Reglas</summary>
            <ul className="list-disc pl-5 space-y-0.5 mt-1">{CYBERPET_RULES.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
          </details>
          <div className="flex flex-wrap items-center gap-2">
            <select className={field} value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Modelo de Cyberpet">
              {CYBERPETS.map((m) => (
                <option key={m.enemyId} value={m.enemyId}>
                  {m.name} · {m.cost}eb ({m.costTier}) · {m.lifestyle}
                </option>
              ))}
            </select>
            <button type="button" className={btn} onClick={() => add(true)} disabled={!chosen}>
              Comprar
            </button>
            <button type="button" className={btn} onClick={() => add(false)} disabled={!chosen}>
              Agregar sin cobrar
            </button>
          </div>
          {chosen && <p className={small}>{chosen.description} Ranuras libres: {chosen.cyberwareSlots}.</p>}
          {msg && <p className="text-[11px] font-mono-code text-[#f9a8d4]">{msg}</p>}
          {pets.map((p) => {
            const m = modelOf(p.enemyId);
            return m ? <PetCard key={p.instanceId} pet={p} model={m} character={character} /> : null;
          })}
        </>
      )}
    </div>
  );
}
