// Panel de tratamiento del Medtech: Quick Fix / Treatment, estabilización y Speedheal (plan 10, v4.9.2). [Claude Code · 2026-10-22]
import React, { useMemo, useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGameClockStore, currentDayKey, currentBeatId } from '../../store/gameClockStore';
import { useRulesSettingsStore } from '../../store/rulesSettingsStore';
import {
  getTreatmentOptions,
  stabilizationDv,
  woundStateForStabilization,
  canMedicUseSkill,
  canSelfApply,
  QUICK_FIX_NOTE,
  rollMedicalCheck
} from '../../engine/medicalRules';
import type { CritTable } from '../../engine/medicalRules';
import { canApplySpeedheal, surgeryLevel } from '../../engine/roleRules';
import {
  speedhealAmount,
  calculateSeriouslyWoundedThreshold,
  calculateMaxHp,
  getEffectiveBody
} from '../../engine/characterEngine';
import { HEAD_CRITICAL_INJURIES, BODY_CRITICAL_INJURIES } from '../../data/criticalInjuries';
import { CEMK_CRITICAL_INJURIES } from '../../data/creation';
import type { CharacterSheet } from '../../types/cyberpunk';

type Mode = 'generic' | 'table' | 'injury';
type SkillName = 'First Aid' | 'Paramedic' | 'Surgery' | 'Cybertech';
const SKILLS: SkillName[] = ['First Aid', 'Paramedic', 'Surgery', 'Cybertech'];

const compact = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');

// Lee el nivel de una skill del médico: skills de combate/ficha (firstAid, paramedic, cybertech) y generalSkills (claves compactas posibles).
function skillLevelOf(char: CharacterSheet | undefined, skill: string): number | null {
  if (!char) return null;
  const k = compact(skill);
  let level = 0;
  let known = false;
  if (k === 'firstaid' || k === 'paramedic' || k === 'cybertech') {
    const key = k === 'firstaid' ? 'firstAid' : k;
    const v = (char.skills as Record<string, number> | undefined)?.[key];
    if (typeof v === 'number') { level = Math.max(level, v); known = true; }
  }
  for (const [gk, gv] of Object.entries(char.generalSkills ?? {})) {
    if (compact(gk) === k && typeof gv === 'number') { level = Math.max(level, gv); known = true; }
  }
  if (k === 'surgery') {
    level = Math.max(level, surgeryLevel(char.medicineAllocation));
    known = true;
  }
  return known ? level : 0;
}

const panelCls = 'chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0';
const titleCls = 'font-tech text-[11px] uppercase tracking-wider text-cyan-300';
const selCls = 'w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';

export const MedtechTreatmentPanel: React.FC<{ defaultPatientId?: string }> = ({ defaultPatientId }) => {
  const characters = useCharacterStore((s) => s.characters);
  const medic = useCharacterStore((s) => s.getActiveCharacter());
  const applyQuickFix = useCharacterStore((s) => s.applyQuickFix);
  const applyTreatment = useCharacterStore((s) => s.applyTreatment);
  const stabilizeCharacter = useCharacterStore((s) => s.stabilizeCharacter);
  const adjustHpFor = useCharacterStore((s) => s.adjustHpFor);
  const updateMedtechLab = useCharacterStore((s) => s.updateMedtechLab);
  const day = useGameClockStore((s) => s.day);
  const speedhealLog = useGameClockStore((s) => s.speedhealLog);
  const recordSpeedheal = useGameClockStore((s) => s.recordSpeedheal);
  const defaultTable = useRulesSettingsStore((s) => s.criticalTable);

  const [patientSel, setPatientSel] = useState<string | undefined>(defaultPatientId);
  const [mode, setMode] = useState<Mode>('injury');
  const [log, setLog] = useState<string[]>([]);

  // Genérica
  const [gSkill, setGSkill] = useState<SkillName>('First Aid');
  const [gDv, setGDv] = useState(13);
  // De la tabla
  const [tTable, setTTable] = useState<CritTable | null>(null);
  const [tLoc, setTLoc] = useState<'head' | 'body'>('body');
  const [tName, setTName] = useState('');
  // Estabilización
  const [stabSkill, setStabSkill] = useState<'First Aid' | 'Paramedic'>('First Aid');

  const patientId = patientSel ?? defaultPatientId ?? medic?.id ?? '';
  const patient = characters.find((c) => c.id === patientId);
  const table: CritTable = tTable ?? defaultTable;

  const tech = medic?.stats?.TECH ?? 0;
  const medicRole = medic?.role ?? '';
  const isSelf = !!medic && !!patient && medic.id === patient.id;

  const levels = useMemo(() => {
    const out: Record<string, number> = {};
    for (const s of SKILLS) out[s] = skillLevelOf(medic, s) ?? 0;
    return out;
  }, [medic]);

  const pushLog = (line: string) => setLog((l) => [line, ...l].slice(0, 20));

  const roll = (skill: string, dv: number) => {
    const level = skillLevelOf(medic, skill) ?? 0;
    const r = rollMedicalCheck({ tech, skillLevel: level, dv });
    return { r, text: `${skill}: 1d10 + TECH + skill → ${r.breakdown} · ${r.success ? 'ÉXITO' : 'FALLO'}` };
  };

  if (!medic) {
    return <div className={panelCls}><span className="text-[11px] text-slate-400">No hay ficha activa (el médico es la ficha activa).</span></div>;
  }

  // Tabla elegida
  const tableEntries = table === 'cemk'
    ? (tLoc === 'head' ? CEMK_CRITICAL_INJURIES.head : CEMK_CRITICAL_INJURIES.body).map((e) => ({
        name: e.name, effect: e.effectEs, quickFix: '', treatment: ''
      }))
    : (tLoc === 'head' ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES).map((e) => ({
        name: e.name, effect: e.effect, quickFix: e.quickFix, treatment: e.treatment
      }));
  const tEntry = tableEntries.find((e) => e.name === tName) ?? tableEntries[0];
  const tOpts = tEntry
    ? getTreatmentOptions({ name: tEntry.name, quickFixDv: tEntry.quickFix, treatmentDv: tEntry.treatment, table })
    : null;

  // Estabilización
  let stabState: 'none' | 'light' | 'serious' | 'mortal' = 'none';
  let stabDv = 0;
  if (patient) {
    const maxHp = calculateMaxHp(getEffectiveBody(patient), patient.stats.WILL);
    stabState = woundStateForStabilization(patient.currentHp, maxHp, calculateSeriouslyWoundedThreshold(maxHp));
    if (stabState !== 'none') stabDv = stabilizationDv(stabState);
  }

  const handleStabilize = () => {
    if (!patient || stabState === 'none') return;
    const { r, text } = roll(stabSkill, stabDv);
    if (r.success) {
      stabilizeCharacter(patient.id, { wasMortallyWounded: stabState === 'mortal' });
      const extra = stabState === 'mortal' && patient.era === '2045' ? ' Queda inconsciente 1 minuto (Core p.223).' : '';
      pushLog(`Estabilizar a ${patient.handle} — ${text}. Aplicado: estabilizado.${extra}`);
    } else {
      pushLog(`Estabilizar a ${patient.handle} — ${text}. No se aplicó nada.`);
    }
  };

  const handleInjuryRoll = (injuryId: string, kind: 'quickFix' | 'treatment', skill: string, dv: number, permanent: boolean) => {
    if (!patient) return;
    const injury = patient.activeInjuries.find((i) => i.id === injuryId);
    if (!injury) return;
    const can = canMedicUseSkill(skill, medicRole);
    if (!can.ok) { pushLog(can.reason ?? 'Skill no permitida.'); return; }
    if (kind === 'treatment' && isSelf && !canSelfApply('treatment')) {
      pushLog('El Treatment no se puede aplicar a uno mismo (Core p.223 / CEMK RB p.14).');
      return;
    }
    const { r, text } = roll(skill, dv);
    const label = `${kind === 'quickFix' ? 'Quick Fix' : 'Treatment'} de ${injury.name} en ${patient.handle}`;
    if (!r.success) { pushLog(`${label} — ${text}. No se aplicó nada.`); return; }
    if (kind === 'treatment' || permanent) {
      applyTreatment(patient.id, injury.id);
      pushLog(`${label} — ${text}. Aplicado: herida eliminada.`);
    } else {
      applyQuickFix(patient.id, injury.id, useGameClockStore.getState().day);
      pushLog(`${label} — ${text}. Aplicado: Quick Fix hasta el día ${useGameClockStore.getState().day}.`);
    }
  };

  // Speedheal (Core p.150; plan 8 decisión 8)
  const isMedtech = medicRole === 'Medtech';
  const knowsSpeedheal = (medic.medicineAllocation?.knownPharmaceuticals ?? []).some((d) => d.toLowerCase() === 'speedheal');
  const medtechData = medic.medtechLab ?? {
    pharmaceuticalsRank: medic.roleRank || 4,
    cryoSystemRank: 2,
    synthesizedDoses: { Speedheal: 2, Stim: 1, Surge: 1, Antibiotic: 0, Rapidetox: 0 },
    activeCryotanks: []
  };
  const doses = medtechData.synthesizedDoses?.Speedheal ?? 0;

  const handleSpeedheal = () => {
    if (!patient) return;
    const use = { medtechId: medic.id, patientId: patient.id, beatId: currentBeatId(), dayKey: currentDayKey() };
    const chk = canApplySpeedheal(speedhealLog, use);
    if (!chk.ok) { pushLog(`Speedheal bloqueado: ${chk.reason}`); return; }
    if (doses < 1) { pushLog('No quedan dosis de Speedheal en el laboratorio Medtech.'); return; }
    const body = getEffectiveBody(patient);
    const amount = speedhealAmount(body, patient.stats.WILL, patient.currentHp, Boolean(patient.fbcState?.isFullBodyConversion));
    if (amount === 0) {
      pushLog('Speedheal no funciona en un paciente Mortally Wounded ni en un FBC (Core p.150).');
      return;
    }
    adjustHpFor(patient.id, amount);
    recordSpeedheal(use);
    updateMedtechLab({ ...medtechData, synthesizedDoses: { ...medtechData.synthesizedDoses, Speedheal: doses - 1 } });
    pushLog(`Speedheal a ${patient.handle}: +${amount} HP (BODY ${body} + WILL ${patient.stats.WILL}, Core p.150). Quedan ${doses - 1} dosis.`);
  };

  const tabCls = (m: Mode) =>
    `font-tech text-[11px] uppercase px-2 py-1 border ${mode === m ? 'border-cyan-400 text-cyan-200 bg-cyan-500/10' : 'border-slate-700 text-slate-400'}`;

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {/* a. Paciente */}
      <div className={panelCls}>
        <span className={titleCls}>Paciente</span>
        <select value={patientId} onChange={(e) => setPatientSel(e.target.value)} className={selCls}>
          {characters.map((c) => (
            <option key={c.id} value={c.id}>{c.handle}{c.id === medic.id ? ' (yo)' : ''} · HP {c.currentHp}</option>
          ))}
        </select>
        {/* b. Skills del médico */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-300 min-w-0">
          <span className="min-w-0">Médico: {medic.handle} ({medicRole || 'sin rol'}) · TECH {tech}</span>
          {SKILLS.map((s) => (
            <span key={s} className="min-w-0">{s} {levels[s]} (base {tech + levels[s]})</span>
          ))}
        </div>
      </div>

      {/* c. Modo de tirada */}
      <div className={panelCls}>
        <div className="flex flex-wrap gap-1.5 min-w-0">
          <button type="button" className={tabCls('generic')} onClick={() => setMode('generic')}>Genérica</button>
          <button type="button" className={tabCls('table')} onClick={() => setMode('table')}>De la tabla</button>
          <button type="button" className={tabCls('injury')} onClick={() => setMode('injury')}>Herida del paciente</button>
        </div>

        {mode === 'generic' && (
          <div className="flex flex-wrap items-end gap-2 min-w-0">
            <select value={gSkill} onChange={(e) => setGSkill(e.target.value as SkillName)} className={`${selCls} sm:w-auto flex-1`}>
              {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="text-[11px] text-slate-300 flex items-center gap-1 min-w-0">
              DV
              <input
                type="number"
                value={gDv}
                onChange={(e) => setGDv(Number(e.target.value))}
                className="w-16 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech"
              />
            </label>
            <button type="button" className={btnCls} onClick={() => pushLog(`Genérica — ${roll(gSkill, gDv).text}`)}>Tirar</button>
          </div>
        )}

        {mode === 'table' && (
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap gap-2 min-w-0">
              <select value={table} onChange={(e) => { setTTable(e.target.value as CritTable); setTName(''); }} className={`${selCls} flex-1`}>
                <option value="core">Core 2d6 (Core pp. 187-188)</option>
                <option value="cemk">CEMK 1d6 (CEMK RB p.13)</option>
              </select>
              <select value={tLoc} onChange={(e) => { setTLoc(e.target.value as 'head' | 'body'); setTName(''); }} className={`${selCls} flex-1`}>
                <option value="body">Cuerpo</option>
                <option value="head">Cabeza</option>
              </select>
            </div>
            <select value={tEntry?.name ?? ''} onChange={(e) => setTName(e.target.value)} className={selCls}>
              {tableEntries.map((e) => <option key={e.name} value={e.name}>{e.name}</option>)}
            </select>
            {tEntry && tOpts && (
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-[11px] text-slate-300">{tEntry.effect}</span>
                {([['Quick Fix', tOpts.quickFix], ['Treatment', tOpts.treatment]] as const).map(([label, opts]) => (
                  <div key={label} className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="font-tech text-[11px] uppercase text-slate-400">{label}:</span>
                    {opts.length === 0 && (
                      <span className="text-[11px] text-slate-500">
                        {label === 'Quick Fix' && tOpts.quickFixPermanent ? 'Elimina el efecto de forma permanente' : 'N/A'}
                      </span>
                    )}
                    {opts.map((o) => (
                      <button
                        key={`${label}-${o.skill}-${o.dv}`}
                        type="button"
                        className={btnCls}
                        onClick={() => pushLog(`${label} de ${tEntry.name} (tabla) — ${roll(o.skill, o.dv).text}`)}
                      >
                        {o.skill} DV {o.dv}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'injury' && patient && (
          <div className="flex flex-col gap-2 min-w-0">
            {patient.activeInjuries.length === 0 && <span className="text-[11px] text-slate-500">Sin heridas críticas activas.</span>}
            {patient.activeInjuries.map((inj) => {
              const opts = getTreatmentOptions({
                name: inj.name, quickFixDv: inj.quickFixDv, treatmentDv: inj.treatmentDv, table: inj.table ?? 'core'
              });
              const tbl = inj.table ?? 'core';
              return (
                <div key={inj.id} className="border border-slate-700 p-1.5 flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 min-w-0">
                    <span className="font-tech text-[11px] text-slate-200 min-w-0">{inj.name}</span>
                    {inj.quickFixed ? (
                      <span className="text-[11px] text-amber-300">Quick Fix hasta el día {inj.quickFixUntilDay}</span>
                    ) : inj.isTreated ? (
                      <span className="text-[11px] text-emerald-300">TRATADA</span>
                    ) : null}
                  </div>
                  <span className="text-[11px] text-slate-400">Quick Fix: {QUICK_FIX_NOTE[tbl]}</span>
                  {([['quickFix', 'Quick Fix', opts.quickFix], ['treatment', 'Treatment', opts.treatment]] as const).map(([kind, label, list]) => (
                    <div key={kind} className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="font-tech text-[11px] uppercase text-slate-400">{label}:</span>
                      {list.length === 0 && (
                        <span className="text-[11px] text-slate-500">
                          {kind === 'quickFix' && opts.quickFixPermanent ? 'Elimina el efecto de forma permanente' : 'N/A'}
                        </span>
                      )}
                      {list.map((o) => {
                        const surgeryBlocked = !canMedicUseSkill(o.skill, medicRole).ok;
                        const selfBlocked = kind === 'treatment' && isSelf && !canSelfApply('treatment');
                        return (
                          <button
                            key={`${kind}-${o.skill}-${o.dv}`}
                            type="button"
                            disabled={surgeryBlocked || selfBlocked}
                            title={surgeryBlocked ? 'Surgery solo la puede usar un Medtech (Core p.223).' : selfBlocked ? 'El Treatment no se puede aplicar a uno mismo (Core p.223).' : undefined}
                            className={btnCls}
                            onClick={() => handleInjuryRoll(inj.id, kind, o.skill, o.dv, opts.quickFixPermanent && kind === 'quickFix')}
                          >
                            {o.skill} DV {o.dv}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* d. Estabilización */}
      <div className={panelCls}>
        <span className={titleCls}>Estabilización (Core p.222)</span>
        {!patient || stabState === 'none' ? (
          <span className="text-[11px] text-slate-500">El paciente no está herido: no hace falta.</span>
        ) : (
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-[11px] text-slate-300 min-w-0">
              Estado: {stabState === 'light' ? 'Lightly Wounded' : stabState === 'serious' ? 'Seriously Wounded' : 'Mortally Wounded'} · DV {stabDv}
            </span>
            <select value={stabSkill} onChange={(e) => setStabSkill(e.target.value as 'First Aid' | 'Paramedic')} className={`${selCls} sm:w-auto`}>
              <option value="First Aid">First Aid</option>
              <option value="Paramedic">Paramedic</option>
            </select>
            <button type="button" className={btnCls} onClick={handleStabilize}>Estabilizar{isSelf ? ' (a uno mismo, Core p.222)' : ''}</button>
          </div>
        )}
      </div>

      {/* e. Speedheal */}
      {isMedtech && knowsSpeedheal && (
        <div className={panelCls}>
          <span className={titleCls}>Speedheal (Core p.150)</span>
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-[11px] text-slate-300">Dosis: {doses} · Día {day} · cura BODY + WILL del paciente; 1 por Beat por Medtech y 1 por día por paciente.</span>
            <button type="button" className={btnCls} disabled={!patient || doses < 1} onClick={handleSpeedheal}>Aplicar Speedheal</button>
          </div>
        </div>
      )}

      {/* f. Registro */}
      <div className={panelCls}>
        <span className={titleCls}>Registro de resultados</span>
        {log.length === 0 && <span className="text-[11px] text-slate-500">Sin tiradas todavía.</span>}
        {log.map((l, i) => (
          <span key={i} className="text-[11px] text-slate-300 break-words min-w-0">{l}</span>
        ))}
      </div>
    </div>
  );
};
