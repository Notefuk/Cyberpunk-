// [Claude Code · 2026-11-14] v5.41.0 (plan 33): Flash of Luck (Going Quiet p.3) en la bandeja de Luck del HUD.
// Solo aparece si el GM la prendió en la mesa (o el jugador en modo local).
import React, { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCombatStore } from '../../store/useCombatStore';
import { useGameClockStore } from '../../store/gameClockStore';
import {
  FLASH_OF_LUCK_MAX_PER_MISSION, FLASH_OF_LUCK_SOURCE, FLASH_OF_LUCK_TIERS, beatKey, canUseFlashOfLuck, flashOfLuckTier,
  type FlashOfLuckTier
} from '../../engine/flashOfLuck';

export const FlashOfLuckPanel: React.FC = () => {
  const enabled = useCombatStore((s) => s.flashOfLuckEnabled);
  const char = useCharacterStore((s) => s.characters.find((c) => c.id === s.activeCharacterId));
  const spendFlashOfLuck = useCharacterStore((s) => s.spendFlashOfLuck);
  const refundFlashOfLuck = useCharacterStore((s) => s.refundFlashOfLuck);
  const startFlashOfLuckMission = useCharacterStore((s) => s.startFlashOfLuckMission);
  const session = useGameClockStore((s) => s.session);
  const day = useGameClockStore((s) => s.day);
  const beat = useGameClockStore((s) => s.beat);
  const [tier, setTier] = useState<FlashOfLuckTier>('simple');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  if (!enabled || !char) return null;

  const key = beatKey({ session, day, beat });
  const state = char.flashOfLuck;
  const check = canUseFlashOfLuck(state, key, char.currentLuck, tier, enabled);
  const info = flashOfLuckTier(tier);
  const last = state?.log?.[0];

  const use = () => {
    const ok = spendFlashOfLuck(tier, note.trim(), key);
    setMsg(ok ? `Flash of Luck: −${info.luckCost} Luck. Pagá hasta ${info.maxSpendEb.toLocaleString('es-AR')}eb y las tiradas que pida el GM.` : null);
    if (ok) setNote('');
  };

  return (
    <div className="bg-[#171923] p-2 rounded border border-[#222636] space-y-2 text-[10px] font-mono-code" data-testid="flash-of-luck">
      <div className="flex items-center justify-between">
        <span className="text-[#f59e0b] font-bold uppercase">Flash of Luck</span>
        <span className="text-[#64748b]">{state?.missionUses ?? 0}/{FLASH_OF_LUCK_MAX_PER_MISSION} en la misión</span>
      </div>
      <p className="text-[#94a3b8]">Gastá Luck para haber hecho antes algo que ayuda ahora. 1 por Beat, 3 por misión; en combate es una Standard Action. El GM puede vetarla. ({FLASH_OF_LUCK_SOURCE})</p>
      <div className="grid grid-cols-3 gap-1">
        {FLASH_OF_LUCK_TIERS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTier(t.id)} title={t.summary}
            className={`p-1 rounded-xs border ${tier === t.id ? 'border-[#f59e0b] text-[#f59e0b]' : 'border-[#222636] text-[#94a3b8]'}`}>
            {t.label}<br />{t.luckCost} Luck · {t.maxSpendEb.toLocaleString('es-AR')}eb
          </button>
        ))}
      </div>
      <p className="text-[#64748b]">{info.summary}</p>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Qué hiciste, cuándo y cómo ayuda ahora" aria-label="Descripción del Flash of Luck"
        className="w-full bg-[#0f1118] border border-[#222636] text-white p-1.5 rounded-xs" />
      <div className="flex flex-wrap gap-1.5 items-center">
        <button type="button" disabled={!check.ok || !note.trim()} onClick={use}
          className="px-2 py-1 bg-[#f59e0b] text-black font-bold rounded-xs disabled:opacity-40">Usar (−{info.luckCost} Luck)</button>
        {last && !last.refunded && (
          <button type="button" onClick={() => { const ok = refundFlashOfLuck(); setMsg(ok ? 'Se devolvió la Luck: no se pudo conseguir lo necesario.' : null); }}
            className="px-2 py-1 border border-[#222636] text-[#94a3b8] rounded-xs" title="Si lo que hacía falta no se pudo comprar, vuelve la Luck (Going Quiet p.3)">No se pudo comprar</button>
        )}
        <button type="button" onClick={() => { startFlashOfLuckMission(); setMsg('Nueva misión: la cuenta vuelve a 0.'); }}
          className="px-2 py-1 border border-[#222636] text-[#94a3b8] rounded-xs">Nueva misión</button>
      </div>
      {!check.ok && <p className="text-amber-400">{check.reason}</p>}
      {msg && <p className="text-[#10b981]">{msg}</p>}
      {last && <p className="text-[#64748b]">Último: {flashOfLuckTier(last.tier).label}{last.refunded ? ' (devuelto)' : ''}: {last.note}</p>}
    </div>
  );
};
