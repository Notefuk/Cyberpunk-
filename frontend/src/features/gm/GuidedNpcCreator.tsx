// [Claude Code · 2026-11-13] v5.40.0 (plan 32): creador de PNJ guiado con las NPC Creation Guidelines de
// Danger Gal Dossier (pp.149-152). Reemplaza al formulario libre de PNJ custom. Seis pasos como el libro;
// los números son sugerencias: los avisos no bloquean el guardado (p.150: "son guías, no reglas").
import React, { useMemo, useState } from 'react';
import { Wrench, X } from 'lucide-react';
import type { StatKey } from '../../types/cyberpunk';
import type { EnemySheet } from '../../data/enemiesCatalog';
import { DANGER_GAL_15_FACTIONS } from '../../data/dangerGalFactions';
import { requestableSkills, skillStat } from '../../engine/rollRequest';
import {
  NPC_FREE_SKILLS, NPC_GUIDELINES_SOURCE, NPC_STAT_KEYS, buildGuidedNpc, npcDraftWarnings, npcFormulaHp,
  npcSkillPointsUsed, npcStatPointsUsed, npcSuggestedEmpLoss, npcTemplate,
  type NpcDraft, type NpcLevel, type NpcSkillRow
} from '../../data/npcCreationGuidelines';

const COMBAT_SKILLS = ['Handgun', 'Shoulder Arms', 'Heavy Weapons', 'Autofire', 'Archery', 'Melee Weapon', 'Brawling', 'Martial Arts', 'Evasion'];
const LEVELS: NpcLevel[] = ['mook', 'lieutenant', 'mini_boss', 'boss', 'civilian'];
const STEP_TITLES = ['Concepto', 'Nivel', 'Skills gratis', 'STATs y skills', 'Equipo', 'Ajustes finales'];

const inputCls = 'w-full bg-[#141824] border border-[#273248] focus:border-[#10b981] text-white p-2 rounded-xs focus:outline-none text-xs';
const labelCls = 'text-[10px] uppercase text-slate-400 block';

function evenStats(points: number, maxStat: number): Record<StatKey, number> {
  const keys = NPC_STAT_KEYS.filter((k) => k !== 'LUCK');
  const base = Math.min(maxStat, Math.floor(points / keys.length));
  let rest = points - base * keys.length;
  const out = { LUCK: 0 } as Record<StatKey, number>;
  for (const k of keys) {
    const extra = rest > 0 && base < maxStat ? 1 : 0;
    out[k] = base + extra;
    rest -= extra;
  }
  return out;
}

function initialDraft(): NpcDraft {
  const t = npcTemplate('mook', false);
  const stats = evenStats(t.statPoints, t.maxStat);
  return {
    name: '', subtitle: '', faction: 'Independiente', era: '2077', concept: '',
    level: 'mook', hardened: false, nativeLanguage: 'Spanish', localExpert: 'Your Home',
    stats, hp: npcFormulaHp(stats), headSp: t.sp[0], bodySp: t.sp[0],
    role: '', roleRank: 0, roleAbility: '',
    skills: NPC_FREE_SKILLS.map((s) => ({
      name: s.name, level: s.level,
      stat: (skillStat(s.name.replace(/ \(.*\)$/, '')) ?? 'INT') as StatKey,
      combat: COMBAT_SKILLS.includes(s.name)
    })),
    weapons: [{ name: '', skill: 'Handgun', damage: '', rof: 2, mag: 0 }],
    cyberware: [], gear: [], specialRules: ''
  };
}

function Range({ value, range }: { value: number; range: [number, number] }) {
  const ok = value >= range[0] && value <= range[1];
  return <span className={ok ? 'text-[#10b981]' : 'text-amber-400'}>{range[0] === range[1] ? range[0] : `${range[0]}-${range[1]}`}</span>;
}

export const GuidedNpcCreator: React.FC<{ onClose: () => void; onSave: (npc: EnemySheet) => void }> = ({ onClose, onSave }) => {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<NpcDraft>(initialDraft);
  const [newSkill, setNewSkill] = useState('');
  const t = npcTemplate(d.level, d.hardened);
  const statUsed = npcStatPointsUsed(d.stats);
  const skillUsed = npcSkillPointsUsed(d.skills, d.nativeLanguage, d.localExpert);
  const warnings = useMemo(() => npcDraftWarnings(d), [d]);
  const allSkills = useMemo(() => requestableSkills(), []);
  const set = (patch: Partial<NpcDraft>) => setD((prev) => ({ ...prev, ...patch }));
  const setSkill = (i: number, patch: Partial<NpcSkillRow>) => set({ skills: d.skills.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  // Funcional: dos clics seguidos (nivel y Hardened) no se pisan.
  const pickLevel = (patch: { level?: NpcLevel; hardened?: boolean }) => setD((prev) => {
    const level = patch.level ?? prev.level;
    const hardened = patch.hardened ?? prev.hardened;
    const nt = npcTemplate(level, hardened);
    const stats = evenStats(nt.statPoints, nt.maxStat);
    return { ...prev, level, hardened, stats, hp: Math.min(nt.hp[1], Math.max(nt.hp[0], npcFormulaHp(stats))), headSp: nt.sp[0], bodySp: nt.sp[0] };
  });

  const addSkill = () => {
    const name = newSkill.trim();
    if (!name || d.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    set({ skills: [...d.skills, { name, level: 2, stat: (skillStat(name) ?? 'INT') as StatKey, combat: COMBAT_SKILLS.includes(name) }] });
    setNewSkill('');
  };

  const save = () => {
    if (!d.name.trim()) {
      setStep(0);
      return;
    }
    onSave(buildGuidedNpc(d, `custom-npc-${Date.now()}`));
  };

  const empLoss = npcSuggestedEmpLoss(d.cyberware.filter((c) => c.trim()).length);
  const skillNames = d.skills.filter((s) => s.level > 0).map((s) => s.name);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs" data-testid="guided-npc-creator">
      <div className="bg-[#0e1017] border-2 border-[#10b981] w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xs p-5 shadow-2xl space-y-4 font-mono-code text-xs text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2638]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#10b981]/20 border border-[#10b981] rounded-xs text-[#10b981]"><Wrench className="w-5 h-5" /></div>
            <div>
              <h3 className="font-tech text-base font-black text-white uppercase tracking-wider">Creador de PNJ guiado</h3>
              <p className="text-[11px] text-slate-400">NPC Creation Guidelines ({NPC_GUIDELINES_SOURCE}). Son guías, no reglas: podés salirte.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="p-1 hover:bg-[#20273a] text-slate-400 hover:text-white rounded"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-wrap gap-1" role="tablist">
          {STEP_TITLES.map((title, i) => (
            <button key={title} type="button" role="tab" aria-selected={step === i} onClick={() => setStep(i)}
              className={`px-2 py-1 rounded-xs text-[10px] uppercase font-bold border ${step === i ? 'bg-[#10b981] text-black border-[#10b981]' : 'border-[#273248] text-slate-400 hover:text-white'}`}>
              {i + 1}. {title}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-3" data-testid="npc-step-concept">
            <p className="text-slate-400">Paso 1: la idea del PNJ. Si te trabás, podés tirarle un Lifepath (Core p.44).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="text-[10px] uppercase text-[#10b981] font-bold block">Nombre *</label>
                <input aria-label="Nombre del PNJ" className={inputCls} value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ej. Razor Jack" />
                {!d.name.trim() && <span className="text-[10px] text-amber-400">Hace falta un nombre para guardar.</span>}</div>
              <div><label className={labelCls}>Subtítulo</label>
                <input className={inputCls} value={d.subtitle} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Ej. Ex policía arrepentido" /></div>
              <div><label className={labelCls}>Facción</label>
                <input className={inputCls} list="guided-npc-factions" value={d.faction} onChange={(e) => set({ faction: e.target.value })} />
                <datalist id="guided-npc-factions">
                  {DANGER_GAL_15_FACTIONS.map((f) => <option key={f.id} value={f.name} />)}
                  <option value="Independiente" />
                </datalist></div>
              <div><label className={labelCls}>Era</label>
                <select className={inputCls} value={d.era} onChange={(e) => set({ era: e.target.value as NpcDraft['era'] })}>
                  <option value="2077">2077 (CEMK)</option>
                  <option value="2045">2045 (RED)</option>
                </select></div>
            </div>
            <div><label className={labelCls}>Concepto / historia</label>
              <textarea rows={3} className={inputCls} value={d.concept} onChange={(e) => set({ concept: e.target.value })} placeholder="Ej. Un miembro de poca monta de una boostergang." /></div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3" data-testid="npc-step-level">
            <p className="text-slate-400">Paso 2: el nivel. Hardened es para grupos optimizados para el combate; Mini-Boss y Boss Hardened, solo para desafíos especiales.</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {LEVELS.map((lv) => (
                <button key={lv} type="button" onClick={() => pickLevel({ level: lv })}
                  className={`p-2 rounded-xs border font-bold uppercase ${d.level === lv ? 'border-amber-400 text-amber-300 bg-amber-400/10' : 'border-[#273248] text-slate-300'}`}>
                  {npcTemplate(lv, false).label}
                </button>
              ))}
            </div>
            {d.level === 'civilian'
              ? <p className="text-slate-500" data-testid="npc-civilian-note">Civil: guías de Everyday People (p.2). El libro no tiene versión Hardened del civil.</p>
              : <label className="flex items-center gap-2"><input type="checkbox" checked={d.hardened} onChange={(e) => pickLevel({ hardened: e.target.checked })} /> Hardened</label>}
            <div className="bg-[#111420] border border-[#1e2538] p-3 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-1" data-testid="npc-template-card">
              <div className="sm:col-span-2 font-tech font-bold text-amber-300 uppercase">{t.label}</div>
              <div>Puntos de STAT: <b>{t.statPoints}</b> (máximo {t.maxStat})</div>
              <div>Puntos de skill: <b>{t.skillPoints}</b> (máximo nivel {t.maxSkillLevel})</div>
              <div>HP sugerido: {t.hp[0]}-{t.hp[1]}</div>
              <div>SP sugerido: {t.sp[0]}-{t.sp[1]}</div>
              <div>Base de skills de combate: {t.combatBase[0] === t.combatBase[1] ? t.combatBase[0] : `${t.combatBase[0]}-${t.combatBase[1]}`}</div>
              <div>Base de skills no de combate: {t.nonCombatBase[0]}-{t.nonCombatBase[1]}</div>
              <div>Equipo: {t.gearBudget.toLocaleString('es-AR')}eb</div>
              <div>Ciberware: {t.cyberwareBudget === null ? 'sin límite' : `${t.cyberwareBudget.toLocaleString('es-AR')}eb`}</div>
              {t.weaponNote && <div className="sm:col-span-2">Armas: {t.weaponNote}</div>}
              {t.roleNote && <div className="sm:col-span-2">Rol: {t.roleNote}</div>}
              <div className="sm:col-span-2 text-slate-400">{t.encounterNote}</div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3" data-testid="npc-step-free-skills">
            <p className="text-slate-400">Paso 3: todo PNJ arranca con su idioma nativo a 4 y estas skills a 2, gratis (no gastan puntos).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={labelCls}>Idioma nativo</label><input className={inputCls} value={d.nativeLanguage} onChange={(e) => set({ nativeLanguage: e.target.value })} /></div>
              <div><label className={labelCls}>Local Expert (dónde vive)</label><input className={inputCls} value={d.localExpert} onChange={(e) => set({ localExpert: e.target.value })} /></div>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-slate-300">
              {NPC_FREE_SKILLS.map((s) => (
                <li key={s.name}>{s.name.replace('(Native)', `(${d.nativeLanguage || 'Native'})`).replace('(Your Home)', `(${d.localExpert || 'Your Home'})`)} {s.level}</li>
              ))}
            </ul>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3" data-testid="npc-step-stats">
            <p className="text-slate-400">Paso 4: repartí STATs y skills. Ningún STAT menor que 2 (salvo EMP) ni mayor que el máximo (salvo BODY con ciberware). Casi ningún PNJ tiene LUCK, y LUCK no gasta puntos.</p>
            <div className={statUsed === t.statPoints ? 'text-[#10b981]' : 'text-amber-400'} data-testid="npc-stat-counter">STATs: {statUsed} de {t.statPoints}</div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {NPC_STAT_KEYS.map((k) => (
                <label key={k} className="bg-[#141824] border border-[#22293c] p-1.5 rounded-xs text-center">
                  <span className="text-[8px] uppercase text-slate-400 block font-bold">{k}</span>
                  <input type="number" min={0} max={10} aria-label={k} value={d.stats[k]}
                    onChange={(e) => set({ stats: { ...d.stats, [k]: Math.max(0, parseInt(e.target.value) || 0) } })}
                    className="w-full bg-transparent text-white font-tech font-bold text-center text-xs focus:outline-none" />
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div><label className={labelCls}>HP (sugerido {t.hp[0]}-{t.hp[1]})</label>
                <input type="number" className={inputCls} value={d.hp} onChange={(e) => set({ hp: parseInt(e.target.value) || 1 })} />
                <button type="button" className="text-[10px] text-[#38bdf8] underline" onClick={() => set({ hp: npcFormulaHp(d.stats) })}>Usar la fórmula ({npcFormulaHp(d.stats)})</button></div>
              <div><label className={labelCls}>SP cabeza</label><input type="number" className={inputCls} value={d.headSp} onChange={(e) => set({ headSp: parseInt(e.target.value) || 0 })} /></div>
              <div><label className={labelCls}>SP cuerpo ({t.sp[0]}-{t.sp[1]})</label><input type="number" className={inputCls} value={d.bodySp} onChange={(e) => set({ bodySp: parseInt(e.target.value) || 0 })} /></div>
              <div><label className={labelCls}>Rol</label><input className={inputCls} value={d.role} onChange={(e) => set({ role: e.target.value })} placeholder="Ej. Solo" /></div>
              <div className="col-span-2"><label className={labelCls}>Role Ability</label><input className={inputCls} value={d.roleAbility} onChange={(e) => set({ roleAbility: e.target.value })} placeholder="Ej. Combat Awareness" /></div>
              <div><label className={labelCls}>Rank</label><input type="number" min={0} max={10} className={inputCls} value={d.roleRank} onChange={(e) => set({ roleRank: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className={skillUsed <= t.skillPoints ? 'text-[#10b981]' : 'text-amber-400'} data-testid="npc-skill-counter">Skills: {skillUsed} de {t.skillPoints} puntos (los niveles gratis no cuentan)</div>
            <table className="w-full text-left">
              <thead><tr className="text-[10px] uppercase text-slate-500"><th>Skill</th><th>STAT</th><th>Nivel</th><th>Base</th><th>Sugerida</th></tr></thead>
              <tbody>
                {d.skills.map((s, i) => {
                  const base = (d.stats[s.stat] || 0) + s.level;
                  return (
                    <tr key={s.name} className="border-t border-[#1e2538]">
                      <td>{s.name}</td>
                      <td>{s.stat}</td>
                      <td><input type="number" min={0} max={10} aria-label={`Nivel de ${s.name}`} value={s.level} onChange={(e) => setSkill(i, { level: Math.max(0, parseInt(e.target.value) || 0) })} className="w-12 bg-[#141824] border border-[#273248] text-center" /></td>
                      <td className="font-bold">{base}</td>
                      <td><Range value={base} range={s.combat ? t.combatBase : t.nonCombatBase} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex gap-2">
              <input className={inputCls} list="guided-npc-skills" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Agregar skill (ej. Handgun)" aria-label="Agregar skill" />
              <datalist id="guided-npc-skills">{allSkills.map((s) => <option key={s} value={s} />)}</datalist>
              <button type="button" onClick={addSkill} className="px-3 bg-[#1b202e] border border-[#273248] uppercase font-bold">Agregar</button>
            </div>
            <p className="text-[10px] text-slate-500">"Sugerida" compara la base (STAT + nivel) con la plantilla: skills de combate {t.combatBase[0]}-{t.combatBase[1]}, el resto {t.nonCombatBase[0]}-{t.nonCombatBase[1]}. Solo importa en las skills que definen al PNJ.</p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3" data-testid="npc-step-gear">
            <p className="text-slate-400">Paso 5: equipalo con lo que cuenta su historia. Presupuesto: equipo {t.gearBudget.toLocaleString('es-AR')}eb, ciberware {t.cyberwareBudget === null ? 'sin límite' : `${t.cyberwareBudget.toLocaleString('es-AR')}eb`} (mejor no gastarlo todo). {t.weaponNote ?? ''}</p>
            {d.weapons.map((w, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end">
                <div className="col-span-2"><label className={labelCls}>Arma</label><input className={inputCls} value={w.name} onChange={(e) => set({ weapons: d.weapons.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} placeholder="Ej. Heavy Pistol" /></div>
                <div><label className={labelCls}>Skill</label>
                  <select className={inputCls} value={w.skill} onChange={(e) => set({ weapons: d.weapons.map((x, k) => (k === i ? { ...x, skill: e.target.value } : x)) })}>
                    {[...new Set([w.skill, ...skillNames])].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div><label className={labelCls}>Daño</label><input className={inputCls} value={w.damage} onChange={(e) => set({ weapons: d.weapons.map((x, k) => (k === i ? { ...x, damage: e.target.value } : x)) })} placeholder="3d6" /></div>
                <div><label className={labelCls}>ROF</label><input type="number" className={inputCls} value={w.rof} onChange={(e) => set({ weapons: d.weapons.map((x, k) => (k === i ? { ...x, rof: parseInt(e.target.value) || 1 } : x)) })} /></div>
                <div><label className={labelCls}>Cargador</label><input type="number" className={inputCls} value={w.mag} onChange={(e) => set({ weapons: d.weapons.map((x, k) => (k === i ? { ...x, mag: parseInt(e.target.value) || 0 } : x)) })} /></div>
              </div>
            ))}
            <button type="button" className="text-[10px] text-[#38bdf8] underline" onClick={() => set({ weapons: [...d.weapons, { name: '', skill: 'Handgun', damage: '', rof: 1, mag: 0 }] })}>+ Otra arma</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={labelCls}>Ciberware (uno por línea)</label>
                <textarea rows={4} className={inputCls} value={d.cyberware.join('\n')} onChange={(e) => set({ cyberware: e.target.value.split('\n') })} /></div>
              <div><label className={labelCls}>Equipo (uno por línea)</label>
                <textarea rows={4} className={inputCls} value={d.gear.join('\n')} onChange={(e) => set({ gear: e.target.value.split('\n') })} /></div>
            </div>
            {empLoss > 0 && (
              <div className="text-amber-300">Con {d.cyberware.filter((c) => c.trim()).length} piezas de ciberware, la guía sugiere bajar EMP en {empLoss} (opcional).{' '}
                <button type="button" className="underline" onClick={() => set({ stats: { ...d.stats, EMP: Math.max(0, d.stats.EMP - empLoss) } })}>Bajar EMP a {Math.max(0, d.stats.EMP - empLoss)}</button></div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3" data-testid="npc-step-review">
            <p className="text-slate-400">Paso 6: los últimos retoques. De nuevo: son guías, no reglas.</p>
            <div><label className={labelCls}>Reglas especiales</label>
              <textarea rows={2} className={inputCls} value={d.specialRules} onChange={(e) => set({ specialRules: e.target.value })} /></div>
            <div className="bg-[#111420] border border-[#1e2538] p-3 rounded-xs space-y-1">
              <div className="font-tech font-bold text-white">{d.name || '(sin nombre)'} · {t.label} · {d.faction || 'Independiente'} · {d.era}</div>
              <div>HP {d.hp} · SP {d.headSp}/{d.bodySp} · {NPC_STAT_KEYS.map((k) => `${k} ${d.stats[k]}`).join(' · ')}</div>
              {d.era === '2077' && <div className="text-slate-400">Se va a ver en formato CEMK 2077, como las fichas del libro; se puede pasar a la ficha RED.</div>}
            </div>
            {warnings.length > 0 ? (
              <ul className="text-amber-300 list-disc pl-4" data-testid="npc-warnings">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>
            ) : (
              <div className="text-[#10b981]">Dentro de la plantilla.</div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#1f2638]">
          <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="px-4 py-2 bg-[#1b202e] text-slate-300 font-tech font-bold uppercase rounded-xs disabled:opacity-40">Atrás</button>
          {step < 5 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="px-4 py-2 bg-[#1b202e] border border-[#10b981] text-[#10b981] font-tech font-bold uppercase rounded-xs">Siguiente</button>
          ) : (
            <button type="button" onClick={save} disabled={!d.name.trim()} className="px-4 py-2 bg-[#10b981] hover:bg-white text-black font-tech font-bold uppercase rounded-xs disabled:opacity-40">Guardar PNJ</button>
          )}
        </div>
      </div>
    </div>
  );
};
