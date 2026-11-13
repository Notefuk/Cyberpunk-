// [Claude Code · 2026-11-13] v5.31.0 (plan 31): durabilidad y mantenimiento en la ficha, "Breaking Your Stuff" (Interface RED Vol. 5 pp.3-12).
import { useMemo, useState } from 'react';
import type { CharacterSheet } from '../../types/cyberpunk';
import { useCharacterStore } from '../../store/useCharacterStore';
import { durabilityItems, type DurabilityItem } from '../../engine/durabilityItems';
import {
  CONDITION_LABEL,
  DURABILITY_RULES,
  LIFESTYLE_LADDER,
  MAINTENANCE_SKILLS,
  juryRigMinutes,
  maintenanceCheck,
  maintenanceInfo,
  malfunctionTable,
  resaleValue,
  rollMalfunction,
  type ItemCondition,
  type Lifestyle,
} from '../../engine/maintenance';
import { sheetSkillLevel } from '../../engine/skillLookup';
import { displayItemName } from '../../engine/itemNames';
import { MALFUNCTION_TABLES } from '../../data/malfunctionTables';

const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const field = 'bg-[#10141f] border border-[#1b2336] rounded-xs px-2 py-1 text-[11px] font-mono-code text-white';
const btn = 'px-2 py-1 bg-[#1a2030] hover:bg-[#22d3ee] hover:text-black text-[10px] font-tech font-bold uppercase rounded-xs cursor-pointer disabled:opacity-40';
const ROLE_GEAR_LABEL: Record<string, string> = {
  exec: 'Equipo de la empresa (exento)',
  medtech: 'De su Habilidad de Rol (exento)',
  nomad: 'De la familia (exento)',
  media: 'Para la historia (+1 Lifestyle)',
  rockerboy: 'Para tocar (+1 Lifestyle)',
};

const d10 = () => 1 + Math.floor(Math.random() * 10);
/** 1d10 con crítico: un 10 suma otro d10 y un 1 resta otro (Core p.129). */
const checkRoll = (): { total: number; text: string } => {
  const r = d10();
  if (r === 10) {
    const x = d10();
    return { total: 10 + x, text: `d10 10+${x}` };
  }
  if (r === 1) {
    const x = d10();
    return { total: 1 - x, text: `d10 1-${x}` };
  }
  return { total: r, text: `d10 ${r}` };
};

export function DurabilityPanel({ character, groups }: { character: CharacterSheet; groups?: DurabilityItem['group'][] }) {
  const [open, setOpen] = useState(false);
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [log, setLog] = useState<Record<string, string>>({});
  const setDurability = useCharacterStore((s) => s.setItemDurability);
  const setLifestyle = useCharacterStore((s) => s.setLifestyle);

  const items = useMemo(() => durabilityItems(character).filter((i) => !groups || groups.includes(i.group)), [character, groups]);
  const states = character.itemDurability ?? {};
  const lifestyle = (LIFESTYLE_LADDER as readonly string[]).includes(character.lifestyle ?? '') ? (character.lifestyle as Lifestyle) : undefined;
  const roleKey = character.role.toLowerCase();
  const tech = character.stats.TECH ?? 0;
  const field_ = character.makerAllocation?.field ?? 0;
  const flagged = items.filter((i) => states[i.key]?.condition || states[i.key]?.malfunction).length;
  const shown = onlyFlagged ? items.filter((i) => states[i.key]?.condition || states[i.key]?.malfunction) : items;

  const note = (key: string, text: string) => setLog((l) => ({ ...l, [key]: text }));

  const maintain = (it: DurabilityItem) => {
    const info = maintenanceInfo(it.cost, it.kind, lifestyle, character.role, states[it.key]?.roleGear);
    const roll = checkRoll();
    const skill = sheetSkillLevel(character, info.skill);
    const total = tech + skill + roll.total;
    const r = maintenanceCheck(total, info.dv);
    note(it.key, `TECH ${tech} + ${info.skill} ${skill} + ${roll.text} = ${r.text}`);
    if (r.success) setDurability(it.key, { condition: states[it.key]?.condition === 'damaged' ? undefined : states[it.key]?.condition, malfunction: undefined, lastMaintained: new Date().toLocaleDateString() });
  };

  const malfunction = (it: DurabilityItem, table = it.table) => {
    const row = rollMalfunction(table);
    setDurability(it.key, { malfunction: { table, roll: row.roll, text: row.text, duration: row.duration } });
  };

  const juryRig = (it: DurabilityItem) => {
    const info = maintenanceInfo(it.cost, it.kind, lifestyle, character.role, states[it.key]?.roleGear);
    const roll = checkRoll();
    const skill = sheetSkillLevel(character, info.skill);
    const total = tech + skill + roll.total;
    note(
      it.key,
      total >= info.dv
        ? `Jury rig (${total} contra DV${info.dv}): anda bien ${juryRigMinutes(field_)} minutos; después vuelve la falla.`
        : `Jury rig falló (${total} contra DV${info.dv}).`
    );
  };

  return (
    <div className="chamfer-card bg-[#0e1017] border border-[#202538] p-4 space-y-3" data-testid="durability-panel">
      <button type="button" className="w-full flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)} aria-expanded={open}>
        <h3 className="font-tech text-sm font-bold text-white uppercase">🔧 Mantenimiento y estado del equipo</h3>
        <span className={small}>
          {flagged ? `${flagged} con problemas · ` : ''}IR5 pp.3-12 {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <label className={small}>
              Lifestyle del mes{' '}
              <select className={field} value={lifestyle ?? ''} onChange={(e) => setLifestyle(e.target.value || undefined)} aria-label="Lifestyle del mes">
                <option value="">Sin pagar</option>
                {LIFESTYLE_LADDER.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className={`${small} flex items-center gap-1`}>
              <input type="checkbox" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} /> Solo lo dañado o con falla
            </label>
          </div>
          <details>
            <summary className={`${small} cursor-pointer`}>Reglas (opcionales)</summary>
            <ul className="list-disc pl-5 space-y-0.5 mt-1">{DURABILITY_RULES.map((r) => <li key={r} className={small}>{r}</li>)}</ul>
          </details>

          {shown.length === 0 && <p className={small}>No hay equipo para mostrar.</p>}
          <div className="space-y-2">
            {shown.map((it) => {
              const st = states[it.key] ?? {};
              const info = maintenanceInfo(it.cost, it.kind, lifestyle, character.role, st.roleGear);
              const resale = resaleValue(it.cost, st.condition);
              const name = displayItemName(character.itemNicknames, it.key, it.name);
              return (
                <div key={it.key} className="border border-[#1b2336] rounded-xs p-2 space-y-1" data-testid={`durability-${it.key}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-tech font-bold text-white">{name}</span>
                    <span className={small}>
                      {it.group} · {MAINTENANCE_SKILLS[it.kind].label} · {it.cost ? `${it.cost}eb` : 'costo desconocido'}
                    </span>
                    <select
                      className={field}
                      value={st.condition ?? ''}
                      aria-label={`Estado de ${name}`}
                      onChange={(e) => setDurability(it.key, { condition: (e.target.value || undefined) as ItemCondition | undefined })}
                    >
                      <option value="">Bien</option>
                      {(Object.keys(CONDITION_LABEL) as ItemCondition[]).map((c) => (
                        <option key={c} value={c}>
                          {CONDITION_LABEL[c]}
                        </option>
                      ))}
                    </select>
                    {ROLE_GEAR_LABEL[roleKey] && (
                      <label className={`${small} flex items-center gap-1`}>
                        <input type="checkbox" checked={!!st.roleGear} onChange={(e) => setDurability(it.key, { roleGear: e.target.checked || undefined })} />
                        {ROLE_GEAR_LABEL[roleKey]}
                      </label>
                    )}
                  </div>
                  <p className={small}>
                    {info.exempt
                      ? 'Exento de mantenimiento por su Rol.'
                      : info.automatic
                        ? `Se mantiene solo con ${info.effective} (pide ${info.needed}).`
                        : `Pide ${info.needed} (tenés ${info.effective}): una vez por mes, ${info.skill} DV${info.dv}, ${info.time}.`}
                    {st.condition ? ` · Venta: ${resale.cost ? `${resale.cost}eb (${resale.tier})` : 'nada'}${resale.note ? `. ${resale.note}` : ''}` : ''}
                    {st.lastMaintained ? ` · Último mantenimiento: ${st.lastMaintained}` : ''}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {!info.automatic && (
                      <button type="button" className={btn} onClick={() => maintain(it)}>
                        Tirar mantenimiento
                      </button>
                    )}
                    {info.automatic && (st.condition === 'damaged' || st.malfunction) && (
                      <button type="button" className={btn} onClick={() => setDurability(it.key, { condition: st.condition === 'damaged' ? undefined : st.condition, malfunction: undefined, lastMaintained: new Date().toLocaleDateString() })}>
                        Mantener (Lifestyle)
                      </button>
                    )}
                    {st.condition === 'damaged' && (
                      <>
                        <button type="button" className={btn} onClick={() => malfunction(it)}>
                          🎲 Falla ({malfunctionTable(it.table).title})
                        </button>
                        {it.table !== 'general_gear' && (
                          <select
                            className={field}
                            value=""
                            aria-label="Tirar en otra tabla"
                            onChange={(e) => e.target.value && malfunction(it, e.target.value as DurabilityItem['table'])}
                          >
                            <option value="">Otra tabla…</option>
                            {MALFUNCTION_TABLES.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.title}
                              </option>
                            ))}
                          </select>
                        )}
                      </>
                    )}
                    {st.malfunction && field_ > 0 && (
                      <button type="button" className={btn} onClick={() => juryRig(it)}>
                        Jury rig (Maker)
                      </button>
                    )}
                  </div>
                  {st.malfunction && (
                    <div className="bg-[#2a1215] border border-[#7f1d1d] rounded-xs p-2 space-y-1">
                      <p className="text-[11px] text-[#fca5a5]">
                        <b>Falla {st.malfunction.roll}</b> ({malfunctionTable(st.malfunction.table as DurabilityItem['table']).titleEn}, IR5 p.{malfunctionTable(st.malfunction.table as DurabilityItem['table']).page}) · dura: {st.malfunction.duration}
                      </p>
                      <p className="text-[11px] text-white">{st.malfunction.text}</p>
                      <button type="button" className={btn} onClick={() => setDurability(it.key, { malfunction: undefined })}>
                        Terminó la falla
                      </button>
                    </div>
                  )}
                  {log[it.key] && <p className="text-[11px] font-mono-code text-[#4ade80]">{log[it.key]}</p>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
