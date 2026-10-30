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
import { QUICK_FIX_VS_TREATMENT, surgeryInjuries } from '../../engine/medicineInfo';

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
      <button type="button" disabled={minusOff} onClick={onMinus} className="w-8 h-8 flex items-center justify-center bg-[#20273a] hover:bg-purple-600 text-white rounded disabled:opacity-30 cursor-pointer" aria-label={`Quitar ${label}`}>
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-5 text-center text-xs font-bold text-white">{value}</span>
      <button type="button" disabled={plusOff} onClick={onPlus} className="w-8 h-8 flex items-center justify-center bg-[#20273a] hover:bg-emerald-600 text-white rounded disabled:opacity-30 cursor-pointer" aria-label={`Sumar ${label}`}>
        <Plus className="w-3 h-3" />
      </button>
    </div>
  </div>
);

// v5.4.0 [Claude Code · 2026-10-29]: qué hace cada especialidad (plan 21). Se muestra debajo de cada contador.
const MAKER_HELP: Record<MakerSpecialty, string> = {
  field: 'Suma tu rango a las tiradas de Basic Tech, Cybertech, Electronics/Security Tech, Weaponstech y Vehicle Tech, y te deja emparchar un ítem como Acción por 10 minutos por rango (Core p.147).',
  upgrade: 'Mejorar un ítem que ya existe (por ejemplo, un arma a Excellent Quality o hacerla ocultable), pagando materiales de su misma categoría de precio (Core p.148).',
  fabrication: 'Fabricar un ítem desde materiales que cuestan una categoría de precio menos que el ítem (Core p.148).',
  invention: 'Inventar un ítem o mejora que no está en el libro, con el GM (Core p.148).',
};
const MEDICINE_HELP: Record<'surgery' | 'pharmaceuticals' | 'cryosystem', string> = {
  surgery: 'Cada punto da 2 niveles de Surgery (TECH). Es la única skill que trata las Critical Injuries más graves (las de Treatment "Surgery" en Core pp.187-188) y la que implanta cyberware. Solo la tiene el Medtech (Core p.149).',
  pharmaceuticals: 'Cada punto da +1 a Medical Tech (máx. 10) y te deja fabricar fármacos: Antibiotic, Rapidetox, Speedheal, Stim o Surge, con DV13 (Core pp.149-150).',
  cryosystem: 'Cada punto da +1 a Medical Tech (máx. 10) y equipo de frío: Cryopump y Cryotank según el nivel (Core p.150).',
};

/** Editor del reparto de rol sin store: lo usan la ficha y el creador. */
export interface RoleAllocationEditorProps {
  role: string | null | undefined;
  rank: number;
  makerAllocation?: Partial<MakerAllocation>;
  medicineAllocation?: Partial<MedicineAllocation>;
  soloAllocation?: unknown;
  setMakerAllocation: (a: MakerAllocation) => void;
  setMedicineAllocation: (a: MedicineAllocation) => void;
  showHelp?: boolean;
}

export const RoleAllocationPanel: React.FC = () => {
  const activeChar = useCharacterStore((state) => state.getActiveCharacter());
  const setMakerAllocation = useCharacterStore((state) => state.setMakerAllocation);
  const setMedicineAllocation = useCharacterStore((state) => state.setMedicineAllocation);
  if (!activeChar) return null;
  return (
    <RoleAllocationEditor
      role={activeChar.role}
      rank={activeChar.roleRank}
      makerAllocation={activeChar.makerAllocation}
      medicineAllocation={activeChar.medicineAllocation}
      soloAllocation={activeChar.soloAllocation}
      setMakerAllocation={setMakerAllocation}
      setMedicineAllocation={setMedicineAllocation}
      showHelp
    />
  );
};

export const RoleAllocationEditor: React.FC<RoleAllocationEditorProps> = ({ role, rank, makerAllocation, medicineAllocation, soloAllocation, setMakerAllocation, setMedicineAllocation, showHelp }) => {
  const activeChar = { role, makerAllocation, medicineAllocation, soloAllocation };
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
            <div key={k}>
              <Stepper label={label} value={alloc[k]} minusOff={alloc[k] <= 0} plusOff={alloc[k] >= rank || free <= 0} onMinus={() => change(k, -1)} onPlus={() => change(k, 1)} />
              {showHelp && <p className="text-[10px] text-slate-400 mt-0.5 font-sans">{MAKER_HELP[k]}</p>}
            </div>
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
    const medTables = ROLE_RANKS.roles.Medtech.tables as {
      pharmaceuticals?: { name: string; effectEs?: string }[];
      cryosystemByRank?: { level: number; benefitEs: string }[];
    };
    const pharmaList = medTables.pharmaceuticals ?? [];
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
            <div key={k}>
              <Stepper label={label} value={alloc[k]} minusOff={alloc[k] <= 0} plusOff={alloc[k] >= MEDICINE_MAX || free <= 0} onMinus={() => change(k, -1)} onPlus={() => change(k, 1)} />
              {showHelp && <p className="text-[10px] text-slate-400 mt-0.5 font-sans">{MEDICINE_HELP[k]}</p>}
            </div>
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
        {/* v5.6.0 [Claude Code · 2026-10-29]: qué cura y qué da cada especialidad (plan 21). */}
        <details className="text-[11px] text-slate-300 font-sans bg-[#11131c] border border-[#232736] rounded px-2 py-1">
          <summary className="cursor-pointer text-purple-300 font-bold">Surgery: heridas que trata ({surgeryInjuries().length}) · Core pp.187-188</summary>
          {(['head', 'body'] as const).map((loc) => (
            <div key={loc} className="mt-1">
              <div className="text-[10px] uppercase text-slate-400 font-bold">{loc === 'head' ? 'Cabeza' : 'Cuerpo'}</div>
              <ul className="space-y-0.5">
                {surgeryInjuries().filter((i) => i.location === loc).map((i) => (
                  <li key={i.id} className="flex flex-wrap gap-x-2">
                    <span>{i.name}</span>
                    <span className="font-mono text-[10px] text-amber-300">Surgery DV {i.surgeryDv}</span>
                    {i.paramedicDv !== undefined && <span className="font-mono text-[10px] text-emerald-300">o Paramedic DV {i.paramedicDv}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </details>
        <details className="text-[11px] text-slate-300 font-sans bg-[#11131c] border border-[#232736] rounded px-2 py-1">
          <summary className="cursor-pointer text-purple-300 font-bold">Pharmaceuticals: qué hace cada fármaco · Core pp.149-150</summary>
          <ul className="mt-1 space-y-0.5">
            {pharmaList.map((p) => (
              <li key={p.name}>
                <b className={known.includes(p.name) ? 'text-emerald-300' : 'text-white'}>{p.name}</b>: {p.effectEs}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[10px] text-slate-400">Fabricar: Medical Tech DV13, 1 hora y 200 €$ de materiales por tanda; hacés tantas dosis como tu nivel de Medical Tech. Si fallás, perdés los materiales. Aplicar una dosis es 1 Acción.</p>
        </details>
        <details className="text-[11px] text-slate-300 font-sans bg-[#11131c] border border-[#232736] rounded px-2 py-1">
          <summary className="cursor-pointer text-purple-300 font-bold">Cryosystem: qué da cada nivel (tenés {alloc.cryosystem}) · Core p.150</summary>
          <ul className="mt-1 space-y-0.5">
            {(medTables.cryosystemByRank ?? []).map((c) => (
              <li key={c.level} className={c.level <= alloc.cryosystem ? 'text-emerald-300' : 'text-slate-500'}>
                <b>Nivel {c.level}</b>{c.level <= alloc.cryosystem ? ' ✓' : ''}: {c.benefitEs}
              </li>
            ))}
          </ul>
        </details>
        <details className="text-[11px] text-slate-300 font-sans bg-[#11131c] border border-[#232736] rounded px-2 py-1">
          <summary className="cursor-pointer text-purple-300 font-bold">Quick Fix o Treatment · Core p.223</summary>
          <ul className="mt-1 list-disc pl-4 space-y-0.5">
            {QUICK_FIX_VS_TREATMENT.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </details>
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
