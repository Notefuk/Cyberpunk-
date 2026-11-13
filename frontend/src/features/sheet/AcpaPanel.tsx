// [Claude Code · 2026-11-12] v5.27.0 (plan 30): la ACPA del personaje en su ficha.
// Fuente: "Solo of Fortune 2045", Interface RED Vol. 5, pp.133-142.
import { useState } from 'react';
import { ACPA_PREBUILTS } from '../../data/acpaData';
import { acpaAllowsBulletDodge, acpaRepair, acpaStateFromPrebuilt } from '../../engine/acpa';
import { useCharacterStore } from '../../store/useCharacterStore';
import type { CharacterSheet } from '../../types/cyberpunk';

const btn = 'px-2 py-1 text-[11px] font-mono-code border rounded-xs cursor-pointer disabled:opacity-40';
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

export function AcpaPanel({ character, compact = false }: { character: CharacterSheet; compact?: boolean }) {
  const setAcpaFor = useCharacterStore((s) => s.setAcpaFor);
  const [pick, setPick] = useState(ACPA_PREBUILTS[0].id);
  const a = character.acpaState;

  if (!a) {
    if (compact) return null;
    return (
      <div className="chamfer-card p-3 bg-[#121319] border border-[#232736] space-y-2" aria-label="ACPA">
        <div className="font-tech text-xs font-bold text-white uppercase">🦾 ACPA</div>
        <p className="text-[11px] font-mono-code text-slate-400">
          Asigná una ACPA de fábrica (IR5 pp.138-142). Para una propia, usá el armador del Compendio, pestaña ACPA.
        </p>
        <div className="flex gap-1.5">
          <select
            className="bg-[#0c0f1a] border border-[#262c3e] text-slate-200 text-xs font-mono-code rounded-xs px-2 py-1 flex-1"
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            aria-label="Elegir ACPA de fábrica"
          >
            {ACPA_PREBUILTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={`${btn} border-[#facc15] text-[#facc15]`}
            onClick={() => {
              const p = ACPA_PREBUILTS.find((x) => x.id === pick);
              if (p) setAcpaFor(character.id, acpaStateFromPrebuilt(p));
            }}
          >
            Asignar
          </button>
        </div>
      </div>
    );
  }

  const destroyed = a.hp <= 0;
  const update = (patch: Partial<typeof a>) => setAcpaFor(character.id, { ...a, ...patch });
  const repair = acpaRepair(a);
  const pilotRef = Math.max(0, (character.stats?.REF ?? 0) + a.ref);
  const pilotDex = Math.max(0, (character.stats?.DEX ?? 0) + a.dex);
  const canDodge = acpaAllowsBulletDodge(a, {
    pilotRef,
    pilotDex,
    hasReflexCoProcessor: (character.installedCyberwareIds ?? []).some((id) => /reflex-co-processor|reflex co-processor/i.test(id)),
    combatAwarenessRank: character.roleRank && /solo/i.test(character.role ?? '') ? character.roleRank : 0,
  });
  const status = destroyed ? 'DESTRUIDA' : a.isPiloting ? 'PILOTEANDO' : 'FUERA';
  const statusColor = destroyed ? 'text-[#f87171]' : a.isPiloting ? 'text-[#4ade80]' : 'text-slate-400';
  const mods = [a.ref && `${signed(a.ref)} REF`, a.dex && `${signed(a.dex)} DEX`, a.move && `${signed(a.move)} MOVE`].filter(Boolean).join(' · ');

  return (
    <div className="chamfer-card p-3 bg-[#121319] border border-[#facc15]/40 space-y-2" aria-label="ACPA" data-testid="acpa-panel">
      <div className="flex justify-between items-center gap-2">
        <div className="font-tech text-xs font-bold text-white uppercase">🦾 {a.name}</div>
        <span className={`text-[11px] font-mono-code font-bold ${statusColor}`}>{status}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono-code text-xs">
        {(
          [
            ['HP', 'hp', 'maxHp'],
            ['SP', 'sp', 'maxSp'],
          ] as const
        ).map(([label, cur, max]) => (
          <div key={label} className="bg-[#0c0f1a] rounded-xs px-2 py-1 flex items-center justify-between gap-1">
            <span className="text-slate-300">
              {label} {a[cur]}/{a[max]}
            </span>
            {!compact && (
              <span className="flex gap-1">
                <button type="button" className={`${btn} border-[#262c3e] text-slate-300`} aria-label={`Bajar ${label} de la ACPA`} onClick={() => update({ [cur]: Math.max(0, a[cur] - 1) })}>
                  −
                </button>
                <button type="button" className={`${btn} border-[#262c3e] text-slate-300`} aria-label={`Subir ${label} de la ACPA`} onClick={() => update({ [cur]: Math.min(a[max], a[cur] + 1) })}>
                  +
                </button>
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="text-[11px] font-mono-code text-slate-400">
        BODY {a.body}
        {mods ? ` · ${mods}` : ''}
        {a.isPiloting && !destroyed ? ' · aplicados a tu ficha' : ''}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {a.isPiloting ? (
          <button type="button" className={`${btn} border-[#38bdf8] text-[#38bdf8]`} onClick={() => update({ isPiloting: false })}>
            {destroyed ? 'Salir (gratis: está destruida)' : 'Salir (1 Acción)'}
          </button>
        ) : (
          <button type="button" className={`${btn} border-[#4ade80] text-[#4ade80]`} disabled={destroyed} onClick={() => update({ isPiloting: true })}>
            Entrar (1 Acción)
          </button>
        )}
        {repair && !compact && (
          <button
            type="button"
            className={`${btn} border-[#facc15] text-[#facc15]`}
            title="Weaponstech, sin Jury Rig. Si falla, a mitad de camino hay que empezar de nuevo (IR5 p.135)."
            onClick={() => update({ hp: a.maxHp, sp: a.maxSp })}
          >
            Reparada ({repair.label}: Weaponstech DV{repair.dv}, {repair.time})
          </button>
        )}
        {!compact && !a.isPiloting && (
          <button type="button" className={`${btn} border-[#f87171]/60 text-[#f87171]`} onClick={() => setAcpaFor(character.id, undefined)}>
            Quitar
          </button>
        )}
      </div>

      {a.isPiloting && !destroyed && (
        <ul className="text-[10px] font-mono-code text-slate-400 space-y-0.5 list-disc pl-4">
          <li>El daño que recibís lo absorbe la ACPA (SP y HP); tu armadura no pierde SP. Inmune a Aimed Shot y a Wound Threshold (pp.133-134).</li>
          <li>Herida Crítica: 5 de daño directo a tu HP, 0 si sos FBC (p.133).</li>
          <li>{canDodge ? 'Podés esquivar balas (p.134).' : 'No podés esquivar balas dentro de la ACPA (p.134).'}</li>
          <li>Más de 4 h piloteando en el día: -1 a todo (salvo FBC o Moto/Interface 4+); más de 8 h: -2 (p.134).</li>
        </ul>
      )}

      {!compact && (
        <div className="text-[11px] font-mono-code text-slate-300 space-y-0.5">
          <div>
            <b>Onboard:</b> {a.onboardWeapons.length ? a.onboardWeapons.join(', ') : 'Ninguna'}
            {a.onboardWeapons.length > 0 && <span className="text-slate-500"> (no ocupan manos ni se pueden desarmar; p.134)</span>}
          </div>
          <div>
            <b>Ciberware:</b> {a.onboardCyberware.length ? a.onboardCyberware.join(', ') : 'Ninguno'} · sensor tipo Radar/Sonar a 100 m (p.134)
          </div>
        </div>
      )}
    </div>
  );
}
