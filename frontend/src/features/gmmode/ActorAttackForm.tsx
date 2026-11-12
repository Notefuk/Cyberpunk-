// [Claude Code · 2026-11-12] v5.23.0 (plan 28): un enemigo del encuentro ataca a un jugador.
// Tira 1d10 + base del arma contra el DV que pone el GM (Core p.130; a distancia, tabla de DV por distancia Core p.173;
// cuerpo a cuerpo, DEX + Evasion + 1d10 del defensor, Core p.176). Gasta 1 bala y, si impacta, aplica el daño
// a la ficha del jugador con su SP (gmDamage.ts). Autofire y supresión quedan para más adelante.
import { useState } from 'react';
import { useEncounterStore, type EncounterCombatant } from '../../store/encounterStore';
import { rollActorAttack, AIMED_HEAD_PENALTY } from '../../engine/actorAttack';
import type { IncomingAttackType } from '../../engine/combatEngine';
import { applyHitToPc } from '../gm/gmDamage';
import { publishGmAction } from '../../sync/tableSync';

const small = 'text-[11px] font-mono-code text-[#94a3b8]';
const mini = 'font-mono-code text-[10px] px-1.5 py-0.5 border border-[#262b3c] text-[#cbd5e1] hover:border-[#22d3ee] hover:text-[#22d3ee] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const field = 'bg-[#0c0d12] border border-[#262b3c] text-white font-mono-code text-[11px] px-1.5 py-0.5 rounded-xs min-w-0';

const ATTACK_TYPES: { id: IncomingAttackType; label: string }[] = [
  { id: 'standard', label: 'Estándar' },
  { id: 'ap', label: 'Armor-Piercing' },
  { id: 'melee', label: 'Melee (mitad del SP)' },
  { id: 'brawling', label: 'Brawling' },
];

export interface AttackTarget {
  id: string;
  handle: string;
}

export function ActorAttackForm({ c, targets }: { c: EncounterCombatant; targets: AttackTarget[] }) {
  const e = c.enemy!;
  const [weaponIdx, setWeaponIdx] = useState(0);
  const [targetId, setTargetId] = useState(targets[0]?.id ?? '');
  const [dv, setDv] = useState(15);
  const [aimedHead, setAimedHead] = useState(false);
  const w = e.weapons[weaponIdx];
  const ranged = (w?.mag ?? 0) > 0;
  const [attackType, setAttackType] = useState<IncomingAttackType>(ranged ? 'standard' : 'melee');
  const [result, setResult] = useState('');

  if (e.weapons.length === 0) return null;
  if (targets.length === 0) return <p className={small}>Para atacar, sumá a los jugadores al encuentro (⚡ Iniciativa de todos).</p>;

  const ammoNow = e.ammo?.[weaponIdx]?.current ?? w.mag;
  const target = targets.find((t) => t.id === targetId) ?? targets[0];

  const pickWeapon = (i: number) => {
    setWeaponIdx(i);
    setAttackType((e.weapons[i]?.mag ?? 0) > 0 ? 'standard' : 'melee');
  };

  const attack = () => {
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

  return (
    <div className="space-y-1 border-t border-[#1e2334] pt-1">
      <div className="flex flex-wrap gap-1 items-center">
        <span className={small}>⚔️ Atacar</span>
        <select className={`${field} max-w-[9rem]`} value={weaponIdx} onChange={(ev) => pickWeapon(Number(ev.target.value))} aria-label="Arma">
          {e.weapons.map((x, i) => <option key={`${x.name}-${i}`} value={i}>{x.name} (+{x.skillBase}, {x.damage})</option>)}
        </select>
        <span className={small}>a</span>
        <select className={`${field} max-w-[8rem]`} value={target.id} onChange={(ev) => setTargetId(ev.target.value)} aria-label="Objetivo">
          {targets.map((t) => <option key={t.id} value={t.id}>{t.handle || 'Sin handle'}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-1 items-center">
        <span className={small}>DV</span>
        <input type="number" min={0} max={60} className={`${field} w-12`} value={dv} onChange={(ev) => setDv(Number(ev.target.value) || 0)} aria-label="DV" />
        <select className={`${field} max-w-[9rem]`} value={attackType} onChange={(ev) => setAttackType(ev.target.value as IncomingAttackType)} aria-label="Tipo de ataque">
          {ATTACK_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <label className={small}>
          <input type="checkbox" className="mr-1 align-middle" checked={aimedHead} onChange={(ev) => setAimedHead(ev.target.checked)} />
          Cabeza (−8, Core p.170)
        </label>
        <button type="button" className={mini} onClick={attack} disabled={ranged && ammoNow <= 0}>Tirar ataque</button>
      </div>
      {result && <p className="text-[11px] font-mono-code text-[#facc15]">{result}</p>}
    </div>
  );
}
