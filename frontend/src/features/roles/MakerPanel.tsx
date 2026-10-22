// Panel del Maker del Tech: tirada por especialidad y Field Expertise (Core pp. 147-149; plan 11, v4.9.3). [Claude Code · 2026-10-23]
import React, { useMemo, useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGmModeStore } from '../../store/gmModeStore';
import { useCombatStore } from '../../store/useCombatStore';
import { getRoleRankInfo } from '../../engine/roleRules';
import type { MakerSpecialty } from '../../engine/roleRules';
import { getSkillCatalog } from '../../engine/characterCreation';
import type { CharacterSheet } from '../../types/cyberpunk';
import { sheetSkillLevel } from '../../engine/skillLookup';
import {
  priceCategoryForEb,
  makerDvAndTime,
  materialCost,
  vehicleUpgradeCategory,
  suggestedMakerSkill,
  specialtyRank,
  rollMakerCheck,
  fieldExpertiseSkills,
  fieldExpertiseBonus,
  juryRigDurationMinutes,
  MAKER_PRICE_EB
} from '../../engine/makerRules';
import type { MakerItemKind, MakerPriceCategory } from '../../engine/makerRules';

const KIND_LABELS: Record<MakerItemKind, string> = {
  weapon: 'Arma',
  armor: 'Armadura',
  clothing: 'Ropa',
  cyberware: 'Ciberware',
  electronics: 'Electrónica',
  landVehicle: 'Vehículo terrestre',
  seaVehicle: 'Vehículo marítimo',
  airVehicle: 'Vehículo aéreo',
  other: 'Otro'
};
const SPECIALTY_LABELS: Record<MakerSpecialty, string> = {
  field: 'Field Expertise',
  upgrade: 'Upgrade Expertise',
  fabrication: 'Fabrication Expertise',
  invention: 'Invention Expertise'
};
const SPECIALTIES: MakerSpecialty[] = ['upgrade', 'fabrication', 'invention', 'field'];
const PRICE_ORDER: MakerPriceCategory[] = ['Cheap', 'Everyday', 'Costly', 'Premium', 'Expensive', 'Very Expensive', 'Luxury', 'Super Luxury'];

// Nivel de una skill en la ficha: combat (skills) o general (generalSkills con claves compactas posibles).
// v4.9.3: también reconoce claves abreviadas de los Folios ('electronicssecurity'), ver engine/skillLookup.ts.
function skillLevelOf(char: CharacterSheet | undefined, skill: string): number {
  return sheetSkillLevel(char, skill);
}

const panelCls = 'chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0';
const titleCls = 'font-tech text-[11px] uppercase tracking-wider text-cyan-300';
const selCls = 'w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';
const txtCls = 'text-[11px] text-slate-300 break-words min-w-0';
const numCls = 'w-20 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';

export const MakerPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.getActiveCharacter());
  const spendEurodollarsFor = useCharacterStore((s) => s.spendEurodollarsFor);
  const gmFreeEdit = useGmModeStore((s) => s.gmFreeEdit);
  const era = useCombatStore((s) => s.era);

  const [specialty, setSpecialty] = useState<MakerSpecialty>('upgrade');
  const [kind, setKind] = useState<MakerItemKind>('weapon');
  const [skillOverride, setSkillOverride] = useState<string | null>(null);
  const [priceEb, setPriceEb] = useState(100);
  const [fieldDv, setFieldDv] = useState(13);
  const [manualRank, setManualRank] = useState(1);
  const [charge, setCharge] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [jury, setJury] = useState<string | null>(null);

  const techSkills = useMemo(() => getSkillCatalog().filter((s) => s.stat === 'TECH').map((s) => s.name), []);

  if (!char) {
    return <div className={panelCls}><span className={txtCls}>No hay ficha activa.</span></div>;
  }

  const isTech = char.role.toLowerCase() === 'tech';
  const canRoll = isTech || gmFreeEdit;
  const rank = isTech ? (char.roleRank || 1) : manualRank;
  const alloc = char.makerAllocation;
  const info = getRoleRankInfo('Tech', rank, era);
  const tech = char.stats?.TECH ?? 0;

  const skillName = skillOverride ?? suggestedMakerSkill(kind);
  const skillLevel = skillLevelOf(char, skillName);
  const specRank = isTech ? (specialty === 'field' ? fieldExpertiseBonus(alloc, skillName) : specialtyRank(alloc, specialty)) : manualRank;

  const isVehicle = kind === 'landVehicle' || kind === 'seaVehicle' || kind === 'airVehicle';
  let category: MakerPriceCategory = priceCategoryForEb(priceEb);
  let effectivePrice = priceEb;
  if (specialty === 'upgrade' && isVehicle) { category = vehicleUpgradeCategory(); effectivePrice = MAKER_PRICE_EB[category]; }
  if (specialty === 'invention' && PRICE_ORDER.indexOf(category) < PRICE_ORDER.indexOf('Expensive')) category = 'Expensive';
  const dvTime = makerDvAndTime(category, effectivePrice);
  const dv = specialty === 'field' ? fieldDv : dvTime.dv;
  const mats = specialty === 'field' ? null : materialCost(specialty, category, effectivePrice);

  const pushLog = (line: string) => setLog((l) => [line, ...l].slice(0, 12));

  const doRoll = () => {
    if (!canRoll) return;
    const r = rollMakerCheck({ tech, skillLevel, specialtyRank: specRank, dv });
    const head = `${SPECIALTY_LABELS[specialty]} (${KIND_LABELS[kind]}, ${skillName}): ${r.breakdown}.`;
    if (r.success) {
      let extra = '';
      if (charge && mats && mats.eb !== null) {
        const ok = spendEurodollarsFor(char.id, Math.ceil(mats.eb), `Materiales de Maker: ${SPECIALTY_LABELS[specialty]} (Core p.148)`);
        extra = ok ? ` Se descontaron ${Math.ceil(mats.eb)} €$ de materiales.` : ` No alcanzan los €$ para los materiales (${Math.ceil(mats.eb)} €$).`;
      }
      pushLog(`${head} ÉXITO. Tiempo: ${specialty === 'field' ? 'ver Field Expertise' : dvTime.timeLabel}.${extra}`);
    } else if (specialty === 'invention') {
      pushLog(`${head} FALLO. Una Invention fallida vuelve a empezar (Core p.148).`);
    } else {
      pushLog(`${head} FALLO. Se reinicia el trabajo con los materiales intactos (Core p.148).`);
    }
  };

  const fieldRank = isTech ? specialtyRank(alloc, 'field') : manualRank;

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className={panelCls}>
        <span className={titleCls}>Maker (Core pp. 147-149)</span>
        {!isTech && (
          <>
            <span className="text-[11px] text-amber-300">
              La ficha activa no es Tech. {gmFreeEdit ? 'Modo GM: podés tirar con un rango manual.' : 'Las tiradas solo se habilitan en modo GM.'}
            </span>
            <label className="text-[11px] text-slate-300 flex items-center gap-1 min-w-0">
              Rango de la especialidad (manual)
              <input type="number" min={0} max={10} value={manualRank} onChange={(e) => setManualRank(Math.max(0, Math.min(10, Number(e.target.value) || 0)))} className={numCls} />
            </label>
          </>
        )}
        <span className={txtCls}>
          Reparto actual: {SPECIALTIES.map((sp) => `${SPECIALTY_LABELS[sp]} ${specialtyRank(alloc, sp)}`).join(' · ')}
        </span>
        <span className="text-[11px] text-slate-500">Solo lectura: repartilo en la ficha (pestaña de rol de la ficha).</span>
        {info.tweaks2077.length > 0 && (
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-tech text-[11px] uppercase text-amber-300">Ajustes 2077</span>
            {info.tweaks2077.map((t, i) => (
              <span key={i} className={txtCls}>{t.textEs} ({t.source.book} p.{t.source.page})</span>
            ))}
          </div>
        )}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Tirada de Maker (Core p.148)</span>
        <div className="flex flex-wrap gap-2 min-w-0">
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value as MakerSpecialty)} className={`${selCls} flex-1`}>
            {SPECIALTIES.map((sp) => <option key={sp} value={sp}>{SPECIALTY_LABELS[sp]}</option>)}
          </select>
          <select
            value={kind}
            onChange={(e) => { setKind(e.target.value as MakerItemKind); setSkillOverride(null); }}
            className={`${selCls} flex-1`}
          >
            {(Object.keys(KIND_LABELS) as MakerItemKind[]).map((k) => <option key={k} value={k}>{KIND_LABELS[k]}</option>)}
          </select>
        </div>
        <label className="text-[11px] text-slate-300 flex flex-col gap-1 min-w-0">
          Skill TECH (sugerida: {suggestedMakerSkill(kind)})
          <select value={skillName} onChange={(e) => setSkillOverride(e.target.value)} className={selCls}>
            {techSkills.map((s) => <option key={s} value={s}>{s} ({skillLevelOf(char, s)})</option>)}
          </select>
        </label>
        <span className="text-[11px] text-slate-500">La ropa sugiere Basic Tech: la app no tiene la skill Fashion.</span>

        {specialty === 'field' ? (
          <label className="text-[11px] text-slate-300 flex items-center gap-1 min-w-0">
            DV (lo fija el GM)
            <input type="number" value={fieldDv} onChange={(e) => setFieldDv(Number(e.target.value) || 0)} className={numCls} />
          </label>
        ) : (
          <>
            <label className="text-[11px] text-slate-300 flex items-center gap-1 min-w-0">
              Precio del objeto (€$)
              <input type="number" min={0} value={priceEb} onChange={(e) => setPriceEb(Math.max(0, Number(e.target.value) || 0))} className={numCls} />
            </label>
            <span className={txtCls}>
              Categoría: {category}{specialty === 'upgrade' && isVehicle ? ' (un vehículo cuenta como 1.000 €$, Core p.148)' : ''} · DV {dvTime.dv} · Tiempo {dvTime.timeLabel} (Core p.149)
            </span>
            {mats && (
              <span className={txtCls}>
                Materiales: {mats.eb === null ? '—' : `${Math.ceil(mats.eb)} €$`}. {mats.note}.
              </span>
            )}
            {mats && mats.eb !== null && (
              <label className="text-[11px] text-slate-300 flex items-center gap-1.5 min-w-0">
                <input type="checkbox" checked={charge} onChange={(e) => setCharge(e.target.checked)} />
                Descontar los materiales de mis €$ si la tirada sale bien
              </label>
            )}
          </>
        )}

        <span className={txtCls}>
          TECH {tech} + {skillName} {skillLevel} + {specialty === 'field' ? 'bono Field' : 'Especialidad'} {specRank} = base {tech + skillLevel + specRank}
        </span>
        <div>
          <button type="button" className={btnCls} disabled={!canRoll} onClick={doRoll}>Tirar vs DV {dv}</button>
        </div>
        {log.map((l, i) => <span key={i} className={txtCls}>{l}</span>)}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Field Expertise (Core p.148)</span>
        <span className={txtCls}>Rango {fieldRank} se suma a: {fieldExpertiseSkills().join(', ')}.</span>
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <button
            type="button"
            className={btnCls}
            disabled={!canRoll}
            onClick={() => setJury(`Con Field Expertise podés reparar temporalmente un objeto (jury-rig): dura ${juryRigDurationMinutes(fieldRank)} minutos (10 por Rango de Field Expertise, ${fieldRank}) (Core p.148).`)}
          >
            Improvisar (jury-rig)
          </button>
        </div>
        {jury && <span className={txtCls}>{jury}</span>}
      </div>
    </div>
  );
};
