// Reparto de especialidades por rol: Maker (Core pp. 147-149), Medicine (Core pp. 149-150), Combat Awareness (solo lectura). [Claude Code · 2026-10-22]
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { ROLE_RANKS } from '../../data/creation';
import {
  makerPointsTotal,
  makerPointsFree,
  validateMakerAllocation,
  medicinePointsFree,
  validateMedicineAllocation,
  surgeryLevel,
  medicalTechFromPharma,
  type MakerAllocation,
  type MakerSpecialty,
  type MedicineAllocation,
} from '../../engine/roleRules';

const MAKER_ROWS: [MakerSpecialty, string][] = [
  ['field', 'Field'],
  ['upgrade', 'Upgrade'],
  ['fabrication', 'Fabrication'],
  ['invention', 'Invention'],
];
const MEDICINE_ROWS: ['surgery' | 'pharmaceuticals' | 'cryosystem', string][] = [
  ['surgery', 'Surgery'],
  ['pharmaceuticals', 'Pharmaceuticals'],
  ['cryosystem', 'Cryosystem'],
];
const MEDICINE_MAX = 5;
const SOLO_LABELS: Record<string, string> = {
  fumbleRecovery: 'Fumble Recovery',
  damageDeflection: 'Damage Deflection',
  initiativeReaction: 'Initiative Reaction',
  precisionAttack: 'Precision Attack',
  spotWeakness: 'Spot Weakness',
  threatDetection: 'Threat Detection',
};

const Stepper: React.FC<{ label: string; value: number; onMinus: () => void; onPlus: () => void; minusOff: boolean; plusOff: boolean }> = ({ label, value, onMinus, onPlus, minusOff, plusOff }) => (
  <div className="flex items-center justify-between gap-2 bg-[#171924] border border-[#232736] rounded px-2 py-1">
    <span className="text-[11px] text-slate-300">{label}</span>
    <div className="flex items-center gap-1">
      <button type="button" disabled={minusOff} onClick={onMinus} className="w-5 h-5 flex items-center justify-center bg-[#20273a] hover:bg-purple-600 text-white rounded disabled:opacity-30 cursor-pointer" aria-label={`Quitar ${label}`}>
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-5 text-center text-xs font-bold text-white">{value}</span>
      <button type="button" disabled={plusOff} onClick={onPlus} className="w-5 h-5 flex items-center justify-center bg-[#20273a] hover:bg-emerald-600 text-white rounded disabled:opacity-30 cursor-pointer" aria-label={`Sumar ${label}`}>
        <Plus className="w-3 h-3" />
      </button>
    </div>
  </div>
);

export const RoleAllocationPanel: React.FC = () => {
  const activeChar = useCharacterStore((state) => state.getActiveCharacter());
  const setMakerAllocation = useCharacterStore((state) => state.setMakerAllocation);
  const setMedicineAllocation = useCharacterStore((state) => state.setMedicineAllocation);

  if (!activeChar) return null;
  const rank = activeChar.roleRank;
  const box = 'p-2.5 bg-[#121319] border border-[#232736] rounded space-y-2 font-mono-code';

  if (activeChar.role === 'Tech') {
    const alloc: MakerAllocation = { field: 0, upgrade: 0, fabrication: 0, invention: 0, ...(activeChar.makerAllocation ?? {}) };
    const free = makerPointsFree(alloc, rank);
    const errors = validateMakerAllocation(alloc, rank);
    const change = (k: MakerSpecialty, d: number) => setMakerAllocation({ ...alloc, [k]: alloc[k] + d });
    return (
      <div className={box}>
        <div className="text-[11px] text-purple-300 font-bold">
          Maker: {free} de {makerPointsTotal(rank)} rangos de especialidad libres (Core pp. 147-149; máx. {rank} por especialidad)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {MAKER_ROWS.map(([k, label]) => (
            <Stepper key={k} label={label} value={alloc[k]} minusOff={alloc[k] <= 0} plusOff={alloc[k] >= rank || free <= 0} onMinus={() => change(k, -1)} onPlus={() => change(k, 1)} />
          ))}
        </div>
        {errors.map((er) => <div key={er} className="text-[10px] text-red-400">{er}</div>)}
      </div>
    );
  }

  if (activeChar.role === 'Medtech') {
    const alloc: MedicineAllocation = { surgery: 0, pharmaceuticals: 0, cryosystem: 0, ...(activeChar.medicineAllocation ?? {}) };
    const known = alloc.knownPharmaceuticals ?? [];
    const free = medicinePointsFree(alloc, rank);
    const errors = validateMedicineAllocation(alloc, rank);
    const pharmaList = ((ROLE_RANKS.roles.Medtech.tables as { pharmaceuticals?: { name: string }[] }).pharmaceuticals ?? []);
    const change = (k: 'surgery' | 'pharmaceuticals' | 'cryosystem', d: number) => {
      const next = { ...alloc, [k]: alloc[k] + d };
      if (k === 'pharmaceuticals' && known.length > next.pharmaceuticals) next.knownPharmaceuticals = known.slice(0, next.pharmaceuticals);
      setMedicineAllocation(next);
    };
    const toggleKnown = (name: string) => {
      const has = known.includes(name);
      if (!has && known.length >= alloc.pharmaceuticals) return;
      setMedicineAllocation({ ...alloc, knownPharmaceuticals: has ? known.filter((n) => n !== name) : [...known, name] });
    };
    return (
      <div className={box}>
        <div className="text-[11px] text-purple-300 font-bold">Medicine: {free} de {rank} puntos libres (Core pp. 149-150)</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {MEDICINE_ROWS.map(([k, label]) => (
            <Stepper key={k} label={label} value={alloc[k]} minusOff={alloc[k] <= 0} plusOff={alloc[k] >= MEDICINE_MAX || free <= 0} onMinus={() => change(k, -1)} onPlus={() => change(k, 1)} />
          ))}
        </div>
        <div className="text-[11px] text-slate-300">Surgery nivel {surgeryLevel(alloc)} · Medical Tech +{medicalTechFromPharma(alloc)}</div>
        <div className="space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Fármacos conocidos ({known.length}/{alloc.pharmaceuticals})</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {pharmaList.map((p) => {
              const has = known.includes(p.name);
              return (
                <label key={p.name} className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={has} disabled={!has && known.length >= alloc.pharmaceuticals} onChange={() => toggleKnown(p.name)} />
                  <span>{p.name}</span>
                </label>
              );
            })}
          </div>
        </div>
        {errors.map((er) => <div key={er} className="text-[10px] text-red-400">{er}</div>)}
      </div>
    );
  }

  if (activeChar.role === 'Solo') {
    const alloc = (activeChar.soloAllocation ?? {}) as unknown as Record<string, number | boolean>;
    const parts = Object.entries(alloc)
      .filter(([, v]) => v !== 0 && v !== false && v !== undefined)
      .map(([k, v]) => (v === true ? (SOLO_LABELS[k] ?? k) : `${SOLO_LABELS[k] ?? k} +${v}`));
    return (
      <div className={box}>
        <div className="text-[11px] text-purple-300 font-bold">Combat Awareness: {parts.length ? parts.join(' · ') : 'sin reparto'}</div>
        <div className="text-[10px] text-slate-400">Se edita en el HUD de combate</div>
      </div>
    );
  }

  return null;
};
