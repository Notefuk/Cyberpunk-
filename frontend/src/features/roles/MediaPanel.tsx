// Panel del Media: Credibility (rumores y Believability), Core pp. 151-153. [Claude Code · 2026-10-23]
import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGmModeStore } from '../../store/gmModeStore';
import { useCombatStore } from '../../store/useCombatStore';
import { ROLE_RANKS } from '../../data/creation';
import { getRoleRankInfo } from '../../engine/roleRules';
import {
  rollPassiveRumor,
  rollActiveRumor,
  believabilityChance,
  evidenceBonus,
  rollBelievability
} from '../../engine/socialRoleRules';
import type { RumorRow, PassiveRumorResult, ActiveRumorResult, BelievabilityResult } from '../../engine/socialRoleRules';
import type { CharacterSheet, StatKey } from '../../types/cyberpunk';

const ROLE = 'Media';
const STATS: StatKey[] = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'];
const SKILL_PRESETS = ['Library Search', 'Conversation', 'Interrogation', 'Human Perception'];

const compact = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');

const panelCls = 'chamfer-card bg-slate-900/70 border border-slate-700 p-2 flex flex-col gap-2 min-w-0';
const titleCls = 'font-tech text-[11px] uppercase tracking-wider text-cyan-300';
const selCls = 'w-full min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const inpCls = 'min-w-0 bg-slate-950 border border-slate-700 text-[11px] text-slate-200 p-1.5 font-tech';
const btnCls = 'font-tech text-[11px] uppercase px-2 py-1 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed';
const txtCls = 'text-[11px] text-slate-300 break-words min-w-0';

interface BandText { fromRank: number; toRank: number; textEs: string }
const bandText = (table: BandText[], rank: number): string => {
  if (rank < 1 || table.length === 0) return '—';
  const hit = table.find((r) => rank >= r.fromRank && rank <= r.toRank) ?? table[table.length - 1];
  return hit.textEs;
};

// Nivel de una skill: skills de ficha (claves compactas) y generalSkills.
function skillLevelOf(char: CharacterSheet, skill: string): number {
  const k = compact(skill);
  let level = 0;
  for (const [sk, sv] of Object.entries((char.skills as unknown as Record<string, number> | undefined) ?? {})) {
    if (compact(sk) === k && typeof sv === 'number') level = Math.max(level, sv);
  }
  for (const [gk, gv] of Object.entries(char.generalSkills ?? {})) {
    if (compact(gk) === k && typeof gv === 'number') level = Math.max(level, gv);
  }
  return level;
}

export const MediaPanel: React.FC = () => {
  const char = useCharacterStore((s) => s.getActiveCharacter());
  const era = useCombatStore((s) => s.era);
  const gmFreeEdit = useGmModeStore((s) => s.gmFreeEdit);

  const [manualRank, setManualRank] = useState(1);
  const [passive, setPassive] = useState<PassiveRumorResult | null>(null);
  const [stat, setStat] = useState<StatKey>('INT');
  const [skill, setSkill] = useState(SKILL_PRESETS[0]);
  const [customSkill, setCustomSkill] = useState('');
  const [tier, setTier] = useState(0);
  const [active, setActive] = useState<ActiveRumorResult | null>(null);
  const [oneVerifiable, setOneVerifiable] = useState(false);
  const [moreThanFourHard, setMoreThanFourHard] = useState(false);
  const [belief, setBelief] = useState<(BelievabilityResult & { bonus: number }) | null>(null);

  if (!char) {
    return <div className={panelCls}><span className={txtCls}>No hay ficha activa.</span></div>;
  }

  const roleMatches = char.role === ROLE;
  const canRoll = roleMatches || gmFreeEdit;
  const rank = roleMatches ? (char.roleRank || 0) : manualRank;
  const info = getRoleRankInfo(ROLE, rank, era);
  const rumors = ROLE_RANKS.roles.Media.tables.rumorDv as RumorRow[];
  const tables = ROLE_RANKS.roles.Media.tables as Record<string, unknown>;
  const access = bandText(tables.accessSources as BandText[], rank);
  const audience = bandText(tables.audience as BandText[], rank);
  const impact = bandText(tables.impact as BandText[], rank);

  const skillName = skill === '__custom' ? customSkill.trim() : skill;
  const statVal = char.stats?.[stat] ?? 0;
  const skillVal = skillName ? skillLevelOf(char, skillName) : 0;
  const bonus = evidenceBonus({ oneVerifiable, moreThanFourHard });

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className={panelCls}>
        <span className={titleCls}>Credibility (Core pp. 151-153)</span>
        <span className={txtCls}>Media: {char.handle} · Rango {rank}</span>
        {!roleMatches && (
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-[11px] text-amber-300 min-w-0">Esta herramienta es del rol {ROLE}.{gmFreeEdit ? '' : ' Las tiradas solo se habilitan en modo GM.'}</span>
            {gmFreeEdit && (
              <label className="text-[11px] text-slate-300 flex items-center gap-1">
                Rango manual
                <input type="number" min={1} max={10} value={manualRank} onChange={(e) => setManualRank(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} className={`${inpCls} w-16`} />
              </label>
            )}
          </div>
        )}
        {era === '2077' && info.tweaks2077.length > 0 && (
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-tech text-[11px] uppercase text-slate-400">Ajustes 2070s</span>
            {info.tweaks2077.map((t, i) => (
              <span key={i} className={txtCls}>{t.textEs} ({t.source.book} p.{String(t.source.page)})</span>
            ))}
          </div>
        )}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Rumor pasivo (Core p.151)</span>
        <span className="text-[11px] text-slate-400">Lo tira el GM en secreto, al menos 2 veces por semana si no estás totalmente fuera de la red.</span>
        <div>
          <button type="button" className={btnCls} disabled={!canRoll} onClick={() => setPassive(rollPassiveRumor(rank))}>Tirar rumor pasivo</button>
        </div>
        {passive && (
          <span className={txtCls}>
            {passive.breakdown} · {passive.bestRumor ? `${passive.bestRumor.rumor} (DV pasivo ${passive.bestRumor.passiveDv}): ${passive.bestRumor.descEs}` : 'No supera ningún DV: no te llega ningún rumor.'} (Core p.151)
          </span>
        )}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Rumor activo (Core p.151)</span>
        <div className="flex flex-wrap gap-1.5 min-w-0">
          <select value={stat} onChange={(e) => setStat(e.target.value as StatKey)} className={`${selCls} sm:w-auto flex-1`}>
            {STATS.map((s) => <option key={s} value={s}>{s} ({char.stats?.[s] ?? 0})</option>)}
          </select>
          <select value={skill} onChange={(e) => setSkill(e.target.value)} className={`${selCls} sm:w-auto flex-1`}>
            {SKILL_PRESETS.map((s) => <option key={s} value={s}>{s}</option>)}
            <option value="__custom">Otra skill…</option>
          </select>
        </div>
        {skill === '__custom' && (
          <input value={customSkill} placeholder="Nombre de la skill" onChange={(e) => setCustomSkill(e.target.value)} className={`${inpCls} w-full`} />
        )}
        <span className={txtCls}>Base: {stat} {statVal} + {skillName || 'skill'} {skillVal}</span>
        <select value={tier} onChange={(e) => setTier(Number(e.target.value))} className={selCls}>
          {rumors.map((r, i) => <option key={r.rumor} value={i}>{r.rumor} (DV activo {r.activeDv})</option>)}
        </select>
        <span className="text-[11px] text-slate-400 break-words min-w-0">{rumors[tier]?.descEs}</span>
        <div>
          <button type="button" className={btnCls} disabled={!canRoll} onClick={() => setActive(rollActiveRumor({ stat: statVal, skill: skillVal, tier }))}>Buscar rumor</button>
        </div>
        {active && (
          <span className={`${txtCls} ${active.success ? 'text-emerald-300' : 'text-red-300'}`}>
            {active.breakdown} · {active.success ? 'ÉXITO' : 'FALLO'} (Core p.151)
          </span>
        )}
      </div>

      <div className={panelCls}>
        <span className={titleCls}>Publicar historia (Core pp. 152-153)</span>
        <span className={txtCls}>Access / Sources: {access}</span>
        <span className={txtCls}>Audience: {audience}</span>
        <span className={txtCls}>Impact: {impact}</span>
        <label className="text-[11px] text-slate-300 flex items-start gap-1.5 min-w-0">
          <input type="checkbox" checked={oneVerifiable} onChange={(e) => setOneVerifiable(e.target.checked)} />
          <span className="min-w-0">Al menos 1 pieza de evidencia verificable y fácil de entender para las masas (+1)</span>
        </label>
        <label className="text-[11px] text-slate-300 flex items-start gap-1.5 min-w-0">
          <input type="checkbox" checked={moreThanFourHard} onChange={(e) => setMoreThanFourHard(e.target.checked)} />
          <span className="min-w-0">Más de 4 piezas distintas de evidencia dura (+2)</span>
        </label>
        <span className={txtCls}>Believability: {believabilityChance(rank)} de 10 + bono {bonus} = {believabilityChance(rank) + bonus} de 10 · no se gasta LUCK (Core p.152)</span>
        <div>
          <button type="button" className={btnCls} disabled={!canRoll} onClick={() => setBelief({ ...rollBelievability({ rank, bonus }), bonus })}>Tirar Believability</button>
        </div>
        {belief && (
          <span className={`${txtCls} ${belief.believed ? 'text-emerald-300' : 'text-red-300'}`}>
            1d10 {belief.natural} vs {belief.target} (1d10 ≤ Believability + bono {belief.bonus}) · {belief.believed ? 'SE LA CREEN' : 'NO SE LA CREEN'} (Core pp. 152-153)
          </span>
        )}
      </div>
    </div>
  );
};
