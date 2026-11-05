// [Claude Code · 2026-11-05] v5.11.0 (plan 25): sumar al encuentro una ficha de NPC propia (STREET LAB → "Ficha de NPC").
import { useState } from 'react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useCloudState } from '../../sync/cloudState';
import { enemySheetFromCharacter } from '../../engine/npcEnemy';
import type { EnemySheet } from '../../data/enemiesCatalog';

export function NpcToEncounter({ onAdd }: { onAdd: (enemy: EnemySheet, count?: number) => void }) {
  const characters = useCharacterStore((s) => s.characters);
  const playerOwners = useCloudState((s) => s.playerOwners);
  const npcs = characters.filter((c) => c.sheetKind === 'npc' && playerOwners[c.id] === undefined);
  const [pick, setPick] = useState('');

  if (npcs.length === 0) {
    return (
      <p className="font-mono-code text-[11px] text-slate-500">
        Tus fichas de NPC aparecen acá para sumarlas al combate. En STREET LAB, marcá una ficha como "Ficha de NPC".
      </p>
    );
  }

  const chosen = npcs.find((c) => c.id === pick) ?? null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-mono-code text-[11px] text-slate-400">Agregar NPC de mis fichas:</span>
      <select
        value={pick}
        onChange={(e) => setPick(e.target.value)}
        className="bg-[#0b0d14] border border-[#2a3044] rounded-xs px-2 py-1 font-mono-code text-xs text-white"
        aria-label="Ficha de NPC para sumar al combate"
      >
        <option value="">Elegí un NPC…</option>
        {npcs.map((c) => (
          <option key={c.id} value={c.id}>{c.handle} ({c.role} {c.roleRank})</option>
        ))}
      </select>
      <button
        type="button"
        disabled={!chosen}
        onClick={() => { if (chosen) { onAdd(enemySheetFromCharacter(chosen)); setPick(''); } }}
        className="px-2.5 py-1 bg-[#25151c] hover:bg-[#ef4444] text-[#f87171] hover:text-white border border-[#48202d] font-mono-code text-[11px] font-bold rounded-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Entra como enemigo: los jugadores ven nombre, iniciativa y heridas, nunca los HP"
      >
        ⚔️ Al combate
      </button>
    </div>
  );
}
