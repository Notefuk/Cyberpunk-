// [Claude Code · 2026-11-12] v5.23.0 (plan 28): lo que ve el jugador cuando el GM le pide una tirada.
// Tira con su ficha (STAT + skill + 1d10, Core p.130; heridas Core p.187), deja el resultado en el pedido y en el log.
import React, { useState } from 'react';
import { useRollRequests } from '../../sync/rollRequests';
import { useAuthStore } from '../../sync/authStore';
import { publishRollFor } from '../../sync/tableSync';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCombatStore } from '../../store/useCombatStore';
import { resolveRollRequest, describeResult, type RollRequest } from '../../engine/rollRequest';
import type { RollEntry, StatKey } from '../../types/cyberpunk';

const RollRequestPrompt: React.FC = () => {
  const uid = useAuthStore((s) => s.user?.uid);
  const requests = useRollRequests((s) => s.requests);
  const adapter = useRollRequests((s) => s.adapter);
  const characters = useCharacterStore((s) => s.characters);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mine = requests.filter((r) => r.status === 'pending' && r.targetUid === uid && characters.some((c) => c.id === r.targetCharId));
  if (!uid || !adapter || mine.length === 0) return null;

  const roll = async (req: RollRequest) => {
    const sheet = useCharacterStore.getState().characters.find((c) => c.id === req.targetCharId);
    if (!sheet) return;
    setBusy(req.id);
    setError(null);
    const result = resolveRollRequest(sheet, req.skill);
    try {
      await adapter.answer(req.id, result);
    } catch (e) {
      console.warn('[mesa] pedido de tirada:', e);
      setError('No se pudo mandar el resultado. Probá de nuevo.');
      setBusy(null);
      return;
    }
    const done: RollRequest = { ...req, status: 'done', result };
    const entry: RollEntry = {
      id: `roll-req-${req.id}`,
      timestamp: new Date().toISOString(),
      type: 'skill',
      weaponName: `🎲 Pedida por el GM (DV ${req.dv})`,
      statName: result.stat as StatKey,
      statVal: result.statVal,
      skillName: req.skill,
      skillVal: result.skillVal,
      d10: result.d10,
      totalAttack: result.total,
      targetDv: req.dv,
      isHit: result.total > req.dv,
      critDie: null,
      needsExplosionClick: false,
      explosionType: null,
      penaltyBreakdown: [describeResult(done)],
    };
    useCombatStore.getState().addRollEntry(entry);
    publishRollFor(entry, sheet.id, sheet.handle);
    setBusy(null);
  };

  return (
    <div className="mb-3 space-y-2">
      {mine.map((r) => {
        const handle = characters.find((c) => c.id === r.targetCharId)?.handle ?? r.targetHandle;
        return (
          <div key={r.id} className="w-full chamfer-card bg-amber-950/30 border border-amber-500/60 p-2 font-mono-code text-xs text-slate-200 flex flex-wrap gap-2 items-center min-w-0">
            <div className="min-w-0 flex-1">
              <div className="text-amber-200 font-bold">🎲 El GM le pide a {handle}: {r.skill} (DV {r.dv})</div>
              {r.note && <div className="whitespace-pre-wrap break-words text-slate-300">{r.note}</div>}
            </div>
            <button
              type="button"
              disabled={busy === r.id}
              onClick={() => void roll(r)}
              className="shrink-0 font-tech text-xs uppercase px-3 py-1 border border-amber-400 text-amber-200 hover:bg-amber-500/15 disabled:opacity-50 cursor-pointer"
            >
              Tirar
            </button>
          </div>
        );
      })}
      {error && <div className="font-mono-code text-xs text-red-300">{error}</div>}
    </div>
  );
};

export default RollRequestPrompt;
