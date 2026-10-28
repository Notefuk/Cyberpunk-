// [Claude Code · 2026-10-24] v5.0.0 (plan 18): campañas en la pestaña MESA // CAMPAÑA.
// Crear, link de invitación (compartir / cambiar), unirse, asignar ficha, party, pasar el GM, echar y salir.
import { useState } from 'react';
import { useAuthStore } from '../../sync/authStore';
import { useCloudState } from '../../sync/cloudState';
import { getCampaignController } from '../../sync/cloudCharacters';
import { useActiveTable } from '../../sync/tableSync';
import { TableLogPanel } from './TableLogPanel';
import { HandoutsPanel } from './HandoutsPanel';
import { GmTargetDialog } from '../gm/GmTargetDialog';
import { buildInviteLink, type CampaignDoc } from '../../sync/campaignRepo';
import { clearPendingInvite, readPendingInvite } from '../../sync/inviteLink';
import { useCharacterStore } from '../../store/useCharacterStore';
import type { PartySummary } from '../../sync/partySummary';

const btn = 'px-3 py-1.5 bg-[#dc2626] hover:bg-white text-white hover:text-black font-tech font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
const btnGhost = 'px-2 py-1 border border-[#262c3e] hover:border-white text-[#94a3b8] hover:text-white font-tech text-[11px] uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50';
const input = 'bg-[#0f1016] border border-[#262c3e] text-white font-mono-code text-xs rounded-xs px-2 py-1.5 focus:outline-none focus:border-[#dc2626]';

// Core p. 220-222: Lightly / Seriously / Mortally Wounded.
const WOUND_LABEL: Record<PartySummary['woundState'], string> = {
  none: 'Sin heridas',
  light: 'Lightly Wounded',
  serious: 'Seriously Wounded',
  mortal: 'Mortally Wounded',
};
const WOUND_COLOR: Record<PartySummary['woundState'], string> = {
  none: 'text-emerald-400',
  light: 'text-amber-300',
  serious: 'text-orange-400',
  mortal: 'text-[#ef4444]',
};

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

export function CampaignPanel() {
  const uid = useAuthStore((s) => s.user?.uid);
  const campaigns = useCloudState((s) => s.campaigns);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [invite, setInvite] = useState(() => readPendingInvite());

  const run = async (fn: () => Promise<void>, ok?: string) => {
    const ctl = getCampaignController();
    if (!ctl) {
      setMsg('Todavía no hay conexión con la nube. Probá en unos segundos.');
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      if (ok) setMsg(ok);
    } catch (e) {
      setMsg('No se pudo: ' + errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const join = () => {
    if (!invite) return;
    void run(async () => {
      try {
        await getCampaignController()!.join(invite.campId, invite.code);
      } catch {
        throw new Error('el link no sirve. Puede que el GM lo haya cambiado: pedile uno nuevo.');
      }
      clearPendingInvite();
      setInvite(null);
    }, 'Listo, ya estás en la campaña. Asignale una de tus fichas.');
  };

  return (
    <div className="chamfer-card bg-[#10121a] border border-[#262c3e] p-5 space-y-4">
      <h3 className="font-tech text-sm text-white uppercase tracking-wider">Campañas</h3>

      {invite && (
        <div className="border border-[#dc2626] bg-[#dc2626]/10 p-3 space-y-2 rounded-xs">
          <p className="text-sm text-white">Te invitaron a una campaña.</p>
          <div className="flex gap-2 flex-wrap">
            <button type="button" className={btn} disabled={busy} onClick={join}>Unirme</button>
            <button type="button" className={btnGhost} disabled={busy} onClick={() => { clearPendingInvite(); setInvite(null); }}>Ignorar</button>
          </div>
        </div>
      )}

      {msg && <p className="font-mono-code text-xs text-amber-300">{msg}</p>}

      {campaigns.length === 0 && !invite && (
        <p className="font-mono-code text-xs text-[#64748b]">No estás en ninguna campaña. Creá una (vas a ser el GM) o pedile el link a tu GM.</p>
      )}

      {campaigns.map((c) => (
        <CampaignCard key={c.id} camp={c} uid={uid ?? ''} busy={busy} run={run} />
      ))}

      <div className="flex gap-2 flex-wrap items-center pt-2 border-t border-[#262c3e]">
        <input
          className={input + ' flex-1 min-w-0'}
          placeholder="Nombre de la campaña nueva"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="button"
          className={btn}
          disabled={busy || name.trim() === ''}
          onClick={() => {
            const n = name;
            setName('');
            void run(() => getCampaignController()!.createCampaign(n), 'Campaña creada. Compartí el link con tus jugadores.');
          }}
        >
          Crear campaña
        </button>
      </div>
    </div>
  );
}

interface CardProps {
  camp: CampaignDoc;
  uid: string;
  busy: boolean;
  run: (fn: () => Promise<void>, ok?: string) => Promise<void>;
}

function CampaignCard({ camp, uid, busy, run }: CardProps) {
  const isGm = camp.gmUid === uid;
  const party = useCloudState((s) => s.party[camp.id]) ?? {};
  const charCampaign = useCloudState((s) => s.charCampaign);
  const playerOwners = useCloudState((s) => s.playerOwners);
  const cloudIds = useCloudState((s) => s.cloudIds);
  const characters = useCharacterStore((s) => s.characters);
  const [pick, setPick] = useState('');
  // v5.1.0 (plan 19): mesa activa = la campaña cuyo reloj, era y combate usa este dispositivo. [Claude Code · 2026-10-27]
  const { table: activeTable } = useActiveTable();
  const isActiveTable = activeTable?.id === camp.id;
  // v5.2.0 (plan 20): el GM de la mesa activa actúa sobre un PJ desde la party. [Claude Code · 2026-10-28]
  const [targetCharId, setTargetCharId] = useState<string | null>(null);

  const myCloud = characters.filter((ch) => cloudIds.includes(ch.id) && playerOwners[ch.id] === undefined);
  const mineHere = myCloud.filter((ch) => charCampaign[ch.id] === camp.id);
  const free = myCloud.filter((ch) => !charCampaign[ch.id]);
  const memberName = (m: string) => camp.memberNames[m] || 'Miembro ' + m.slice(0, 5);
  const ctl = () => getCampaignController()!;

  const share = async () => {
    const link = buildInviteLink(window.location.origin + window.location.pathname, camp.id, camp.inviteCode);
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    // En la compu se copia directo: la ventana de compartir de Windows estorba. Solo en pantallas táctiles. [Claude Code · 2026-10-27]
    const touch = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    if (touch && typeof nav.share === 'function') {
      try {
        await nav.share({ title: 'OMNI-DECK', text: `Unite a la campaña "${camp.name}"`, url: link });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      }
    }
    await navigator.clipboard.writeText(link);
  };

  const rows = Object.entries(party).sort((a, b) => a[1].handle.localeCompare(b[1].handle));

  return (
    <div className="border border-[#262c3e] p-3 space-y-3 rounded-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-tech text-white font-bold">{camp.name}</span>
        <span className={'font-mono-code text-[10px] px-1.5 py-0.5 rounded-xs ' + (isGm ? 'bg-[#dc2626] text-white' : 'bg-[#262c3e] text-[#94a3b8]')}>
          {isGm ? 'GM' : 'JUGADOR'}
        </span>
        {isActiveTable ? (
          <span className="font-mono-code text-[10px] px-1.5 py-0.5 rounded-xs bg-[#0e7490] text-white" title="El reloj, la era y el combate de este dispositivo son los de esta campaña">
            MESA ACTIVA
          </span>
        ) : (
          <button type="button" className={btnGhost} onClick={() => useCloudState.getState().setActiveTableId(camp.id)}>
            Usar como mesa activa
          </button>
        )}
        {isGm && (
          <div className="ml-auto flex gap-2 flex-wrap">
            <button type="button" className={btn} disabled={busy} onClick={() => void run(share, 'Link listo para compartir (si no se abrió el menú, quedó copiado).')}>Compartir link</button>
            <button
              type="button"
              className={btnGhost}
              disabled={busy}
              onClick={() => {
                if (window.confirm('¿Cambiar el link? El link viejo deja de servir.')) void run(() => ctl().regenerateInvite(camp.id), 'Link nuevo generado: el viejo ya no sirve.');
              }}
            >
              Cambiar link
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="font-tech text-[11px] text-[#64748b] uppercase tracking-wider">Miembros</div>
        <ul className="space-y-1">
          {camp.memberUids.map((m) => (
            <li key={m} className="flex items-center gap-2 flex-wrap font-mono-code text-xs text-[#94a3b8]">
              <span className="text-white">{memberName(m)}</span>
              {m === camp.gmUid && <span className="text-[#dc2626]">(GM)</span>}
              {m === uid && <span className="text-[#64748b]">(vos)</span>}
              {isGm && m !== uid && (
                <span className="ml-auto flex gap-2">
                  <button
                    type="button"
                    className={btnGhost}
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`¿Pasarle el rol de GM a ${memberName(m)}? Vas a quedar como jugador.`)) void run(() => ctl().passGm(camp.id, m), 'Rol de GM pasado.');
                    }}
                  >
                    Pasar GM
                  </button>
                  <button
                    type="button"
                    className={btnGhost}
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`¿Echar a ${memberName(m)}? Su ficha vuelve a ser solo suya.`)) void run(() => ctl().kick(camp.id, m), 'Jugador echado.');
                    }}
                  >
                    Echar
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <div className="font-tech text-[11px] text-[#64748b] uppercase tracking-wider">Tus fichas en esta campaña</div>
        {mineHere.length === 0 && <p className="font-mono-code text-xs text-[#64748b]">Ninguna todavía.</p>}
        {mineHere.map((ch) => (
          <div key={ch.id} className="flex items-center gap-2 font-mono-code text-xs text-[#94a3b8]">
            <span>{ch.handle} ({ch.role})</span>
            <button type="button" className={btnGhost + ' ml-auto'} disabled={busy} onClick={() => void run(() => ctl().assign(ch.id, null))}>Sacar</button>
          </div>
        ))}
        {free.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap">
            <select className={input + ' flex-1 min-w-0'} value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Elegí una ficha de la nube…</option>
              {free.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.handle} ({ch.role})</option>
              ))}
            </select>
            <button
              type="button"
              className={btn}
              disabled={busy || pick === ''}
              onClick={() => {
                const id = pick;
                setPick('');
                void run(() => ctl().assign(id, camp.id), 'Ficha asignada.');
              }}
            >
              Asignar
            </button>
          </div>
        )}
        {free.length === 0 && myCloud.length === 0 && (
          <p className="font-mono-code text-[11px] text-[#64748b]">Primero subí una ficha a la nube.</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="font-tech text-[11px] text-[#64748b] uppercase tracking-wider">
          Party {isGm ? '(sus fichas completas están en el selector de arriba)' : ''}
        </div>
        {rows.length === 0 ? (
          <p className="font-mono-code text-xs text-[#64748b]">Nadie asignó una ficha todavía.</p>
        ) : (
          <ul className="space-y-1.5">
            {rows.map(([charId, p]) => (
              <li key={charId} className="font-mono-code text-xs text-[#94a3b8] border-l-2 border-[#262c3e] pl-2">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-white font-bold">{p.handle}</span>
                  <span>({p.role})</span>
                  <span className="text-[#64748b]">· {memberName(p.ownerUid) || p.ownerName}</span>
                  {isGm && isActiveTable && (
                    <button
                      type="button"
                      onClick={() => setTargetCharId(charId)}
                      className="font-tech text-[10px] uppercase px-1.5 border border-amber-500/50 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                      title="Daño, críticas, condiciones, Humanidad y €$ sobre este PJ"
                    >
                      Daño
                    </button>
                  )}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <span>HP {p.currentHp}/{p.maxHp}</span>
                  <span className={WOUND_COLOR[p.woundState]}>{WOUND_LABEL[p.woundState]}</span>
                  <span>SP cabeza {p.headSp}/{p.headSpMax}</span>
                  <span>SP torso {p.bodySp}/{p.bodySpMax}</span>
                </div>
                {p.injuries.length > 0 && <div className="text-[#ef4444]">Críticas: {p.injuries.join(', ')}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isActiveTable && <HandoutsPanel />}
      {isActiveTable && <TableLogPanel />}
      {targetCharId && <GmTargetDialog charId={targetCharId} onClose={() => setTargetCharId(null)} />}

      {!isGm && (
        <button
          type="button"
          className={btnGhost}
          disabled={busy}
          onClick={() => {
            if (window.confirm(`¿Salir de "${camp.name}"? Tus fichas dejan de estar en la campaña.`)) void run(() => ctl().leave(camp.id), 'Saliste de la campaña.');
          }}
        >
          Salir de la campaña
        </button>
      )}
    </div>
  );
}
