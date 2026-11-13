// v5.2.0 (plan 20, decisión 1) [Claude Code · 2026-10-28]: el GM actúa sobre la ficha de un PJ de su mesa.
// Daño con la armadura del jugador (SP, ablación, cabeza x2, crítica), heridas críticas, condiciones, Humanidad y €$.
// La ficha del jugador ya está en useCharacterStore (la party la carga) y se sincroniza sola; cada acción va al log de la mesa.
import React, { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useEncounterStore } from '../../store/encounterStore';
import { useRulesSettingsStore } from '../../store/rulesSettingsStore';
import type { IncomingAttackType } from '../../engine/combatEngine';
import { applyHitToPc, pcImpactInput, previewPcImpact } from './gmDamage';
import { isPilotingAcpa, resolveHitOnAcpa } from '../../engine/acpa';
import { PlayerNotesEditor } from './PlayerNotesEditor';

// v5.23.0 (plan 28): dar ítems (trae el catálogo entero, se carga al abrir la pestaña) y notas por jugador. [Claude Code · 2026-11-12]
const GiveItemPanel = lazy(() => import('./GiveItemPanel'));
import { calculateMaxHp, getEffectiveBody } from '../../engine/characterEngine';
import { HEAD_CRITICAL_INJURIES, BODY_CRITICAL_INJURIES } from '../../data/criticalInjuries';
import { CEMK_CRITICAL_INJURIES } from '../../data/creation';
import { CONDITIONS } from '../../data/conditions';
import { publishGmAction } from '../../sync/tableSync';

type Tab = 'damage' | 'crit' | 'cond' | 'humanity' | 'eddies' | 'item' | 'notes';

const TABS: { id: Tab; label: string }[] = [
  { id: 'damage', label: 'Daño' },
  { id: 'crit', label: 'Crítica' },
  { id: 'cond', label: 'Condiciones' },
  { id: 'humanity', label: 'Humanidad' },
  { id: 'eddies', label: '€$' },
  { id: 'item', label: 'Dar ítem' },
  { id: 'notes', label: 'Notas' }
];

const ATTACK_TYPES: { id: IncomingAttackType; label: string }[] = [
  { id: 'standard', label: 'Estándar (−1 SP)' },
  { id: 'ap', label: 'Armor-Piercing (−2 SP)' },
  { id: 'melee', label: 'Melee (mitad del SP)' },
  { id: 'martial_arts', label: 'Martial Arts (mitad del SP)' },
  { id: 'brawling', label: 'Brawling (SP completo)' },
  { id: 'direct', label: 'Directo (ignora SP)' }
];

const btn = 'font-tech text-[11px] uppercase px-2 py-1 border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const field = 'bg-[#0c0d12] border border-[#262b3c] text-white font-mono-code text-xs px-2 py-1 rounded-xs';

export const GmTargetDialog: React.FC<{ charId: string; onClose: () => void }> = ({ charId, onClose }) => {
  const char = useCharacterStore((s) => s.characters.find((c) => c.id === charId));
  const criticalTable = useRulesSettingsStore((s) => s.criticalTable);
  const round = useEncounterStore((s) => s.round);
  const [tab, setTab] = useState<Tab>('damage');
  const [damage, setDamage] = useState(10);
  const [location, setLocation] = useState<'body' | 'head'>('body');
  const [attackType, setAttackType] = useState<IncomingAttackType>('standard');
  const [isCritical, setIsCritical] = useState(false);
  const [critLocation, setCritLocation] = useState<'body' | 'head'>('body');
  const [critName, setCritName] = useState('');
  const [humanityDelta, setHumanityDelta] = useState(-2);
  const [eddiesDelta, setEddiesDelta] = useState(500);
  const [eddiesReason, setEddiesReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const done = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  if (!char) {
    return (
      <Shell title="Ficha del PJ" onClose={onClose}>
        <p className="font-mono-code text-xs text-[#94a3b8]">La ficha de este PJ todavía no cargó. Probá en unos segundos.</p>
      </Shell>
    );
  }

  const st = useCharacterStore.getState;
  const maxHp = calculateMaxHp(getEffectiveBody(char), char.stats.WILL);
  // v5.23.0 (plan 28): el cálculo y la aplicación están en gmDamage.ts (también los usa el ataque de un actor). [Claude Code · 2026-11-12]
  const hit = { damage, location, attackType, isCritical };
  const input = pcImpactInput(char, hit);
  const impact = previewPcImpact(char, hit);
  const where = location === 'head' ? 'cabeza' : 'cuerpo';
  // v5.27.0 [Claude Code · 2026-11-12]: si pilotea una ACPA, el golpe va a la ACPA (IR5 p.133).
  const acpaPreview = isPilotingAcpa(char) ? resolveHitOnAcpa(char.acpaState!, hit, Boolean(char.fbcState?.isFullBodyConversion)) : null;

  const applyDamage = () => {
    const summary = applyHitToPc(charId, hit, `daño ${damage} en ${where}${isCritical ? ' (crítico)' : ''}`);
    if (summary) done(`Aplicado: ${summary}`);
  };

  const critNames = criticalTable === 'cemk'
    ? (critLocation === 'head' ? CEMK_CRITICAL_INJURIES.head : CEMK_CRITICAL_INJURIES.body).map((i) => i.name)
    : (critLocation === 'head' ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES).map((i) => i.name);
  const applyCrit = (random: boolean) => {
    const injury = random
      ? st().inflictRandomInjuryFor(charId, critLocation)
      : st().inflictSpecificInjury(charId, critLocation, critName, criticalTable);
    if (!injury) {
      done(random ? 'No se aplicó: el PJ es inmune a esa herida (Going Metal p. 94).' : 'Elegí una herida de la tabla.');
      return;
    }
    publishGmAction({ targetCharId: charId, targetHandle: char.handle, label: `herida crítica: ${injury.name}`, detail: `${critLocation === 'head' ? 'Cabeza' : 'Cuerpo'} · tabla ${criticalTable === 'cemk' ? 'CEMK RB p.13' : 'Core pp.187-188'}` });
    done(`Herida: ${injury.name}`);
  };

  const active = new Set((char.conditions ?? []).map((c) => c.id));
  const toggleCondition = (id: string, name: string, source: string) => {
    if (active.has(id)) {
      st().removeConditionFor(charId, id);
      publishGmAction({ targetCharId: charId, targetHandle: char.handle, label: `sin ${name}`, detail: source });
    } else {
      st().addConditionFor(charId, id, round);
      publishGmAction({ targetCharId: charId, targetHandle: char.handle, label: `queda ${name}`, detail: source });
    }
  };

  const applyHumanity = () => {
    if (!humanityDelta) return;
    const before = char.currentHumanity;
    st().adjustHumanityFor(charId, humanityDelta);
    const after = st().characters.find((c) => c.id === charId)?.currentHumanity ?? before;
    publishGmAction({ targetCharId: charId, targetHandle: char.handle, label: `Humanidad ${humanityDelta > 0 ? '+' : ''}${humanityDelta}`, detail: `Humanidad ${before}→${after}` });
    done(`Humanidad ${before}→${after}`);
  };

  const applyEddies = () => {
    if (!eddiesDelta) return;
    const before = char.eurodollars ?? 0;
    const reason = eddiesReason.trim() || (eddiesDelta > 0 ? 'Pago del GM' : 'Cobro del GM');
    st().gmUpdateCharacterVitals(charId, { eurodollarsDelta: eddiesDelta, concept: `GM: ${reason}` });
    const after = st().characters.find((c) => c.id === charId)?.eurodollars ?? before;
    publishGmAction({ targetCharId: charId, targetHandle: char.handle, label: `€$ ${eddiesDelta > 0 ? '+' : ''}${eddiesDelta}`, detail: `${reason} · €$ ${before}→${after}` });
    done(`€$ ${before}→${after}`);
  };

  return (
    <Shell title={`${char.handle} · HP ${char.currentHp}/${maxHp} · SP ${input.headSp}/${input.bodySp}`} onClose={onClose}>
      <div className="flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`${btn} ${tab === t.id ? 'border-amber-400 text-amber-200 bg-amber-500/10' : 'border-[#293b5d] text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'damage' && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-mono-code text-xs text-slate-300">Daño
              <input type="number" min={0} value={damage} onChange={(e) => setDamage(Math.max(0, Number(e.target.value) || 0))} className={`${field} ml-1 w-16`} />
            </label>
            <select value={location} onChange={(e) => setLocation(e.target.value as 'body' | 'head')} className={field}>
              <option value="body">Cuerpo</option>
              <option value="head">Cabeza (Aimed Shot, x2)</option>
            </select>
            <select value={attackType} onChange={(e) => setAttackType(e.target.value as IncomingAttackType)} className={field}>
              {ATTACK_TYPES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            <label className="font-mono-code text-xs text-slate-300 flex items-center gap-1">
              <input type="checkbox" checked={isCritical} onChange={(e) => setIsCritical(e.target.checked)} /> Crítico (dos 6)
            </label>
          </div>
          {acpaPreview ? (
          <p className="font-mono-code text-[11px] text-[#facc15]">
            En ACPA ({char.acpaState!.name}): {acpaPreview.summary}. La recibe la ACPA: sin cabeza x2, sin herida crítica y la armadura del piloto no pierde SP (IR5 pp.133-134).
          </p>
          ) : (
          <p className="font-mono-code text-[11px] text-[#94a3b8]">
            SP efectivo {impact.effectiveSp} · −{impact.spAblation} SP · −{impact.hpLoss} HP
            {isCritical ? ' · herida crítica al azar (+5 directo, Core p.187)' : ''} · Core pp.176, 186-188.
            {char.currentHp < 1 && attackType !== 'direct' && impact.hpLoss > 0 ? ' Mortally Wounded: otra herida y +1 al Death Save Penalty (Core p.188).' : ''}
          </p>
          )}
          <p className="font-mono-code text-[10px] text-[#64748b]">El Damage Deflection del Solo (Core p.146) lo aplica el jugador desde su HUD.</p>
          <button type="button" onClick={applyDamage} disabled={damage <= 0} className={`${btn} border-red-500/60 text-red-200 hover:bg-red-500/10`}>Aplicar daño</button>
        </div>
      )}

      {tab === 'crit' && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <select value={critLocation} onChange={(e) => { setCritLocation(e.target.value as 'body' | 'head'); setCritName(''); }} className={field}>
              <option value="body">Cuerpo</option>
              <option value="head">Cabeza</option>
            </select>
            <button type="button" onClick={() => applyCrit(true)} className={`${btn} border-red-500/60 text-red-200`}>Al azar</button>
            <select value={critName} onChange={(e) => setCritName(e.target.value)} className={`${field} max-w-[14rem]`}>
              <option value="">Elegir de la tabla…</option>
              {critNames.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <button type="button" onClick={() => applyCrit(false)} disabled={!critName} className={`${btn} border-red-500/60 text-red-200`}>Aplicar</button>
          </div>
          <p className="font-mono-code text-[10px] text-[#64748b]">Tabla {criticalTable === 'cemk' ? 'CEMK (CEMK RB p.13)' : 'Core (Core pp.187-188)'}, según la configuración de reglas.</p>
        </div>
      )}

      {tab === 'cond' && (
        <ul className="space-y-1">
          {CONDITIONS.map((c) => (
            <li key={c.id} className="flex items-start gap-2 font-mono-code text-[11px]">
              <button type="button" onClick={() => toggleCondition(c.id, c.name, c.source)}
                className={`${btn} shrink-0 ${active.has(c.id) ? 'border-amber-400 text-amber-200 bg-amber-500/10' : 'border-[#293b5d] text-slate-300'}`}>
                {active.has(c.id) ? 'Sacar' : 'Poner'}
              </button>
              <span className="text-slate-300"><span className="text-white">{c.name}</span> · {c.effect} <span className="text-[#64748b]">({c.source})</span></span>
            </li>
          ))}
        </ul>
      )}

      {tab === 'humanity' && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono-code text-xs text-slate-300">Humanidad {char.currentHumanity}</span>
          <input type="number" value={humanityDelta} onChange={(e) => setHumanityDelta(Number(e.target.value) || 0)} className={`${field} w-16`} />
          <button type="button" onClick={applyHumanity} disabled={!humanityDelta} className={`${btn} border-[#293b5d] text-cyan-200`}>Aplicar</button>
        </div>
      )}

      {tab === 'eddies' && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono-code text-xs text-slate-300">€$ {char.eurodollars ?? 0}</span>
          <input type="number" value={eddiesDelta} onChange={(e) => setEddiesDelta(Number(e.target.value) || 0)} className={`${field} w-24`} />
          <input type="text" value={eddiesReason} maxLength={80} placeholder="Motivo" onChange={(e) => setEddiesReason(e.target.value)} className={`${field} w-40`} />
          <button type="button" onClick={applyEddies} disabled={!eddiesDelta} className={`${btn} border-[#293b5d] text-emerald-200`}>Aplicar</button>
        </div>
      )}

      {tab === 'item' && (
        <Suspense fallback={<p className="font-mono-code text-xs text-slate-400">Cargando el catálogo…</p>}>
          <GiveItemPanel charId={charId} onDone={done} />
        </Suspense>
      )}

      {tab === 'notes' && <PlayerNotesEditor charId={charId} />}

      {feedback && <p className="font-mono-code text-[11px] text-amber-300">{feedback}</p>}
    </Shell>
  );
};

// En un portal: las tarjetas con chamfer recortan lo que tienen adentro, incluso lo `fixed`.
const Shell: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => createPortal(
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
    <div role="dialog" aria-label={title} className="chamfer-card bg-[#12141f] border border-amber-500/40 p-3 w-full max-w-xl space-y-3 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2">
        <span className="font-tech text-xs uppercase tracking-wider text-amber-300 truncate">GM // {title}</span>
        <button type="button" onClick={onClose} className="ml-auto text-slate-400 hover:text-white cursor-pointer" aria-label="Cerrar"><X className="w-4 h-4" /></button>
      </div>
      {children}
    </div>
  </div>,
  document.body
);
