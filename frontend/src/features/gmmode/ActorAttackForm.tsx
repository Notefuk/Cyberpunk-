// [Claude Code · 2026-11-12] v5.23.0 (plan 28): un enemigo del encuentro ataca a un jugador.
// Tira 1d10 + base del arma contra el DV que pone el GM (Core p.130; a distancia, tabla de DV por distancia Core p.173;
// cuerpo a cuerpo, DEX + Evasion + 1d10 del defensor, Core p.176). Gasta 1 bala y, si impacta, aplica el daño
// a la ficha del jugador con su SP (gmDamage.ts).
// v5.24.0 [Claude Code · 2026-11-12]: Autofire (Core p.173) y Suppressive Fire (Core p.174) para las armas que tienen Autofire.
import { useState } from 'react';
import { useEncounterStore, type EncounterCombatant } from '../../store/encounterStore';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useGmActors } from '../../store/gmActorsStore';
import {
  rollActorAttack,
  AIMED_HEAD_PENALTY,
  AUTOFIRE_BULLETS,
  AUTOFIRE_BANDS,
  AUTOFIRE_DV,
  autofireMax,
  autofireClass,
  enemyAutofireBase,
  rollAutofire,
  rollSuppression,
  resistsSuppression,
} from '../../engine/actorAttack';
import { resolveRollRequest } from '../../engine/rollRequest';
import type { IncomingAttackType } from '../../engine/combatEngine';
import { applyHitToPc } from '../gm/gmDamage';
import { publishGmAction } from '../../sync/tableSync';
import { findEnemySheet, type EnemyWeaponProfile } from '../../data/enemiesCatalog';
import { actorSheet } from './actorSpawn';
import { acpaAttackMod } from '../../engine/acpaActors';

const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const mini = 'font-mono-code text-[10px] px-1.5 py-0.5 border border-[#262b3c] text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const field = 'bg-[#0c0d12] border border-[#262b3c] text-white font-mono-code text-[11px] px-1.5 py-0.5 rounded-xs min-w-0';

const ATTACK_TYPES: { id: IncomingAttackType; label: string }[] = [
  { id: 'standard', label: 'Estándar' },
  { id: 'ap', label: 'Armor-Piercing' },
  { id: 'melee', label: 'Melee (mitad del SP)' },
  { id: 'brawling', label: 'Brawling' },
];

type Mode = 'single' | 'autofire' | 'suppress';

export interface AttackTarget {
  id: string;
  handle: string;
}

/** Las armas de la ficha; el goon rápido del Fixer (sin ficha) ataca con su base y su daño, sin cargador. */
// v5.28.0 [Claude Code · 2026-11-12]: en ACPA, la base lleva el mod de REF (a distancia) o DEX (cuerpo a cuerpo) (IR5 p.134).
function attackWeapons(e: NonNullable<EncounterCombatant['enemy']>): EnemyWeaponProfile[] {
  if (e.weapons.length > 0) return e.weapons.map((w) => ({ ...w, skillBase: Math.max(0, w.skillBase + acpaAttackMod(e, w)) }));
  if (e.quick) return [{ name: 'Ataque', skillBase: e.quick.atkBase, damage: e.quick.damageDice, rof: 1, mag: 0 }];
  return [];
}

const defaultType = (w: EnemyWeaponProfile | undefined, quick: boolean): IncomingAttackType => ((w?.mag ?? 0) > 0 || quick ? 'standard' : 'melee');

const clampDv = (v: number) => Math.max(0, Math.min(60, v || 0));

export function ActorAttackForm({ c, targets }: { c: EncounterCombatant; targets: AttackTarget[] }) {
  const e = c.enemy!;
  const actors = useGmActors((s) => s.actors);
  const weapons = attackWeapons(e);
  const quick = e.weapons.length === 0 && !!e.quick;
  const [weaponIdx, setWeaponIdx] = useState(0);
  const [targetId, setTargetId] = useState(targets[0]?.id ?? '');
  const [dv, setDv] = useState(15);
  const [aimedHead, setAimedHead] = useState(false);
  const w = weapons[weaponIdx];
  const ranged = (w?.mag ?? 0) > 0;
  const [attackType, setAttackType] = useState<IncomingAttackType>(defaultType(w, quick));
  const [mode, setMode] = useState<Mode>('single');
  const [band, setBand] = useState(2);
  const [afBaseEdit, setAfBaseEdit] = useState<number | null>(null);
  const [suppressed, setSuppressed] = useState<string[]>(targets.map((t) => t.id));
  const [result, setResult] = useState('');

  if (!w) return null;
  if (targets.length === 0) return <p className={small}>Para atacar, sumá a los jugadores al encuentro (⚡ Iniciativa de todos).</p>;

  const ammoNow = e.ammo?.[weaponIdx]?.current ?? w.mag;
  const target = targets.find((t) => t.id === targetId) ?? targets[0];

  // Autofire: el tope y la base salen de la ficha (bestiario o PNJ propio); la base se puede corregir a mano.
  const afMax = ranged ? autofireMax(w) : null;
  const sheet = findEnemySheet(e.catalogId) ?? (() => {
    const a = actors.find((x) => x.id === e.actorId);
    return a ? actorSheet(a) : undefined;
  })();
  const afBaseSheet = afMax ? enemyAutofireBase(sheet?.skillBases, w) : null;
  const afBase = afBaseEdit ?? (afBaseSheet != null ? Math.max(0, afBaseSheet + acpaAttackMod(e, w)) : w.skillBase);
  const afClass = afMax ? autofireClass(w, afMax) : 'ar';
  const afMode = mode !== 'single' && afMax !== null;

  const pickWeapon = (i: number) => {
    setWeaponIdx(i);
    setAttackType(defaultType(weapons[i], quick));
    setAfBaseEdit(null);
    if (!autofireMax(weapons[i])) setMode('single');
  };

  const pickMode = (m: Mode) => {
    setMode(m);
    if (m === 'autofire' && afMax) setDv(AUTOFIRE_DV[afClass][band]);
  };

  const pickBand = (b: number) => {
    setBand(b);
    setDv(AUTOFIRE_DV[afClass][b]);
  };

  const single = () => {
    if (ranged && ammoNow <= 0) {
      setResult('Sin balas: recargá primero (Core p.169).');
      return;
    }
    if (ranged) useEncounterStore.getState().spendEnemyAmmo(c.id, weaponIdx, 1);
    const r = rollActorAttack({ skillBase: w.skillBase, damage: w.damage, dv, aimedHead });
    const head = aimedHead ? ` −${AIMED_HEAD_PENALTY} cabeza` : '';
    const roll = `${w.skillBase} + d10 ${r.d10}${head} = ${r.attackTotal} vs DV ${dv}`;
    if (!r.hit) {
      publishGmAction({ targetCharId: target.id, targetHandle: target.handle, label: `${c.name} ataca con ${w.name}: falla`, detail: roll, total: r.attackTotal });
      setResult(`Falla: ${roll}.`);
      return;
    }
    const where = aimedHead ? 'cabeza' : 'cuerpo';
    const summary = applyHitToPc(
      target.id,
      { damage: r.damage, location: aimedHead ? 'head' : 'body', attackType, isCritical: r.critical },
      `${c.name} con ${w.name}: daño ${r.damage} en ${where}${r.critical ? ' (crítico)' : ''}`,
    );
    const dice = r.dice.length ? ` [${r.dice.join(', ')}]` : '';
    setResult(`Impacta (${roll}). Daño ${r.damage}${dice}${r.critical ? ', crítico +5' : ''} → ${target.handle}: ${summary ?? 'la ficha no cargó'}.`);
  };

  // Core p.173: 10 balas, REF + Autofire + 1d10 contra la tabla de Autofire; 2d6 x lo que superó el DV (tope del arma).
  const autofire = () => {
    if (!afMax) return;
    useEncounterStore.getState().spendEnemyAmmo(c.id, weaponIdx, AUTOFIRE_BULLETS);
    const r = rollAutofire({ base: afBase, dv, maxMultiplier: afMax });
    const roll = `Autofire ${afBase} + d10 ${r.d10} = ${r.total} vs DV ${dv}`;
    if (!r.hit) {
      publishGmAction({ targetCharId: target.id, targetHandle: target.handle, label: `${c.name} Autofire con ${w.name}: falla`, detail: roll, total: r.total });
      setResult(`Falla: ${roll}. Gastó ${AUTOFIRE_BULLETS} balas.`);
      return;
    }
    const summary = applyHitToPc(
      target.id,
      { damage: r.damage, location: 'body', attackType, isCritical: r.critical },
      `${c.name} Autofire con ${w.name}: daño ${r.damage} (2d6 x${r.multiplier})${r.critical ? ' (crítico)' : ''}`,
    );
    setResult(
      `Impacta (${roll}). 2d6 [${r.dice.join(', ')}] x${r.multiplier} = ${r.damage}${r.critical ? ', crítico +5' : ''} → ${target.handle}: ${summary ?? 'la ficha no cargó'}.`,
    );
  };

  // Core p.174: 10 balas; cada jugador marcado tira WILL + Concentration + 1d10 con su ficha contra REF + Autofire + 1d10.
  const suppress = () => {
    useEncounterStore.getState().spendEnemyAmmo(c.id, weaponIdx, AUTOFIRE_BULLETS);
    const s = rollSuppression(afBase);
    const lines: string[] = [];
    for (const t of targets.filter((x) => suppressed.includes(x.id))) {
      const pc = useCharacterStore.getState().characters.find((x) => x.id === t.id);
      if (!pc) continue;
      const d = resolveRollRequest(pc, 'Concentration');
      const ok = resistsSuppression(d.total, s.total);
      const pen = d.penalty ? ` ${d.penalty} heridas` : '';
      const detail = `WILL ${d.statVal} + Concentration ${d.skillVal} + d10 ${d.d10}${pen} = ${d.total} vs ${s.total}`;
      publishGmAction({
        targetCharId: t.id,
        targetHandle: t.handle,
        label: `${c.name} suprime: ${ok ? 'resiste' : 'tiene que cubrirse'}`,
        detail: `${detail}${ok ? '' : ' · usa su próximo Move para ir a cobertura (Core p.174)'}`,
        total: d.total,
      });
      lines.push(`${t.handle} ${d.total}: ${ok ? 'resiste' : 'se cubre con su próximo Move'}`);
    }
    setResult(`Supresión ${afBase} + d10 ${s.d10} = ${s.total}. ${lines.length ? `${lines.join(' · ')}.` : 'Nadie marcado.'} Gastó ${AUTOFIRE_BULLETS} balas.`);
  };

  const needBullets = afMode ? AUTOFIRE_BULLETS : 1;
  const noAmmo = ranged && ammoNow < needBullets;

  return (
    <div className="space-y-1 border-t border-[#1e2334] pt-1">
      <div className="flex flex-wrap gap-1 items-center">
        <span className={small}>⚔️ Atacar</span>
        <select className={`${field} max-w-[9rem]`} value={weaponIdx} onChange={(ev) => pickWeapon(Number(ev.target.value))} aria-label="Arma">
          {weapons.map((x, i) => <option key={`${x.name}-${i}`} value={i}>{x.name} (+{x.skillBase}, {x.damage})</option>)}
        </select>
        {afMax !== null && (
          <select className={`${field} max-w-[8rem]`} value={mode} onChange={(ev) => pickMode(ev.target.value as Mode)} aria-label="Modo de fuego">
            <option value="single">Tiro simple</option>
            <option value="autofire">Autofire x{afMax}</option>
            <option value="suppress">Supresión</option>
          </select>
        )}
        {mode !== 'suppress' && (
          <>
            <span className={small}>a</span>
            <select className={`${field} max-w-[8rem]`} value={target.id} onChange={(ev) => setTargetId(ev.target.value)} aria-label="Objetivo">
              {targets.map((t) => <option key={t.id} value={t.id}>{t.handle || 'Sin handle'}</option>)}
            </select>
          </>
        )}
      </div>

      {afMode && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className={small}>REF + Autofire</span>
          <input type="number" min={0} max={40} className={`${field} w-12`} value={afBase} onChange={(ev) => setAfBaseEdit(Math.max(0, Math.min(40, Number(ev.target.value) || 0)))} aria-label="Base de Autofire" />
          {afBaseSheet === null && afBaseEdit === null && <span className="text-[10px] font-mono-code text-[#f97316]">la ficha no la trae: revisala</span>}
          {mode === 'autofire' && (
            <select className={`${field} max-w-[8rem]`} value={band} onChange={(ev) => pickBand(Number(ev.target.value))} aria-label="Distancia">
              {AUTOFIRE_BANDS.map((b, i) => <option key={b} value={i}>{b} (DV {AUTOFIRE_DV[afClass][i]})</option>)}
            </select>
          )}
        </div>
      )}

      {mode === 'suppress' && afMax !== null ? (
        <div className="flex flex-wrap gap-1 items-center">
          <span className={small}>A pie, a 25 m, sin cobertura y a la vista:</span>
          {targets.map((t) => (
            <label key={t.id} className={small}>
              <input
                type="checkbox"
                className="mr-1 align-middle"
                checked={suppressed.includes(t.id)}
                onChange={() => setSuppressed((s) => (s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id]))}
              />
              {t.handle || 'Sin handle'}
            </label>
          ))}
          <button type="button" className={mini} onClick={suppress} disabled={noAmmo || suppressed.length === 0}>Suprimir (10 balas)</button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1 items-center">
          <span className={small}>DV</span>
          <input type="number" min={0} max={60} className={`${field} w-12`} value={dv} onChange={(ev) => setDv(clampDv(Number(ev.target.value)))} aria-label="DV" />
          <select className={`${field} max-w-[9rem]`} value={attackType} onChange={(ev) => setAttackType(ev.target.value as IncomingAttackType)} aria-label="Tipo de ataque">
            {ATTACK_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          {mode === 'single' && (
            <label className={small}>
              <input type="checkbox" className="mr-1 align-middle" checked={aimedHead} onChange={(ev) => setAimedHead(ev.target.checked)} />
              Cabeza (−8, Core p.170)
            </label>
          )}
          <button type="button" className={mini} onClick={mode === 'autofire' ? autofire : single} disabled={noAmmo}>
            {mode === 'autofire' ? 'Autofire (10 balas)' : 'Tirar ataque'}
          </button>
        </div>
      )}
      {afMode && noAmmo && <p className="text-[10px] font-mono-code text-[#f97316]">Hacen falta 10 balas en el cargador (Core pp.173-174).</p>}
      {mode === 'autofire' && afMode && (
        <p className="text-[10px] font-mono-code text-[#64748b]">Sin Aimed Shot. Si el jugador tiene REF 8+ y esquiva, poné su DEX + Evasion + 1d10 como DV (Core p.173).</p>
      )}
      {result && <p className="text-[11px] font-mono-code text-[#facc15]">{result}</p>}
    </div>
  );
}
