// [Claude Code · 2026-11-12] v5.23.0 (plan 28): notas privadas del GM sobre un jugador.
// Con mesa de GM van a campaigns/{c}/gm/playerNotes (solo el GM); sin mesa, a este navegador (cpr_gm_player_notes_v1).
import { useState } from 'react';
import { GM_SECRET_LOCAL_KEYS, useGmSecretBinding } from '../../sync/gmSecrets';
import { parsePlayerNotes, playerNote, setPlayerNote, PLAYER_NOTE_TEXT_MAX, type PlayerNote } from '../../engine/gmPlayerNotes';

const LOCAL_KEY = GM_SECRET_LOCAL_KEYS.playerNotes;

function readLocal(): PlayerNote[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? parsePlayerNotes(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function PlayerNotesEditor({ charId }: { charId: string }) {
  const [notes, setNotes] = useState<PlayerNote[]>(readLocal);
  const { cloud, campName } = useGmSecretBinding('playerNotes', notes, (v) => setNotes(parsePlayerNotes(v)), readLocal);

  const change = (text: string) => {
    const next = setPlayerNote(notes, charId, text);
    setNotes(next);
    if (!cloud) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      } catch {
        /* sin almacenamiento: queda en memoria */
      }
    }
  };

  return (
    <div className="space-y-1">
      <textarea
        className="w-full h-32 bg-[#0c0d12] border border-[#262b3c] text-white font-mono-code text-xs px-2 py-1 rounded-xs"
        maxLength={PLAYER_NOTE_TEXT_MAX}
        placeholder="Lo que sabés de este PJ y el jugador no: deudas, ganchos, secretos…"
        value={playerNote(notes, charId)}
        onChange={(e) => change(e.target.value)}
      />
      <p className="font-mono-code text-[10px] text-[#64748b]">
        {cloud ? `Privadas del GM, en la campaña ${campName}.` : 'Privadas, en este navegador (sin mesa online).'}
      </p>
    </div>
  );
}
