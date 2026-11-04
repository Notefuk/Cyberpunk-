// [Claude Code · 2026-11-04] v5.10.0 (plan 24): pasarle una ficha de la nube a otro jugador con un código de 24 h.
import { useState } from 'react';
import { useCloudState } from '../../sync/cloudState';
import {
  acceptTransfer,
  cancelOfferedTransfer,
  offerTransfer,
  previewTransfer,
  type TransferPreview,
} from '../../sync/cloudCharacters';
import { formatTransferCode } from '../../sync/transferCode';

const smallBtn = 'px-2 py-1 border rounded-xs font-tech text-[11px] uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

const errText = (e: unknown): string => (e instanceof Error ? e.message : String(e));

function formatExpiry(ms: number | null): string {
  if (ms === null) return '…';
  if (ms <= Date.now()) return 'ya venció';
  return 'vence el ' + new Date(ms).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/** Botón por ficha en "TUS FICHAS EN LA NUBE": crea el código, lo muestra para copiar y permite cancelarlo. */
export function TransferRowAction({ charId, handle }: { charId: string; handle: string }) {
  const pending = useCloudState((s) => s.pendingTransfers[charId]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(formatTransferCode(code));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('No se pudo copiar: anotalo a mano.');
    }
  };

  if (!pending) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          className={smallBtn + ' border-[#38bdf8]/50 text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black'}
          disabled={busy}
          title="Crea un código para que otro jugador reciba esta ficha en su cuenta"
          onClick={() => {
            if (!window.confirm(`¿Pasarle "${handle}" a otro jugador?\n\nSe crea un código que dura 24 horas. Cuando lo use, la ficha deja de ser tuya y pasa a su cuenta (si está en tu campaña, la seguís viendo como GM).`)) return;
            void run(() => offerTransfer(charId));
          }}
        >
          {busy ? 'Creando…' : 'Pasar a otro jugador'}
        </button>
        {error && <p className="font-mono-code text-[11px] text-[#ef4444]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-1 p-2 border border-[#38bdf8]/40 bg-[#0d1a24] rounded-xs space-y-1.5">
      <div className="font-mono-code text-[11px] text-[#94a3b8]">
        Pasale este código al jugador. Lo pone en MESA // CAMPAÑA → RECIBIR UNA FICHA ({formatExpiry(pending.expiresAt)}).
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <code className="font-mono-code text-base font-bold tracking-widest text-white select-all">{formatTransferCode(pending.code)}</code>
        <button type="button" className={smallBtn + ' border-[#2a3044] text-white hover:bg-white hover:text-black'} onClick={() => void copy(pending.code)}>
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
        <button
          type="button"
          className={smallBtn + ' border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444] hover:text-white'}
          disabled={busy}
          onClick={() => void run(() => cancelOfferedTransfer(charId))}
        >
          {busy ? '…' : 'Cancelar'}
        </button>
      </div>
      <div className="font-mono-code text-[11px] text-amber-300">Esperando que la reciban. Hasta entonces sigue siendo tuya.</div>
      {error && <p className="font-mono-code text-[11px] text-[#ef4444]">{error}</p>}
    </div>
  );
}

/** Bloque "RECIBIR UNA FICHA": se pega el código, se ve de quién es y se acepta. */
export function ReceiveTransferBox() {
  const notice = useCloudState((s) => s.transferNotice);
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<TransferPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const look = async () => {
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      setPreview(await previewTransfer(input));
    } catch (e) {
      setPreview({ ok: false, error: errText(e) });
    } finally {
      setBusy(false);
    }
  };

  const accept = async () => {
    setBusy(true);
    setError(null);
    try {
      const handle = await acceptTransfer(input);
      useCloudState.setState({ transferNotice: null });
      setDone(`Listo: ${handle} ya es tuya. La tenés abierta en STREET LAB.`);
      setPreview(null);
      setInput('');
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-3 space-y-2">
      <h3 className="font-tech text-sm text-white uppercase tracking-wider">Recibir una ficha</h3>
      {notice && (
        <p className="font-mono-code text-xs text-amber-300 flex items-start gap-2">
          <span>{notice}</span>
          <button type="button" className="text-[#64748b] hover:text-white" onClick={() => useCloudState.setState({ transferNotice: null })} aria-label="Cerrar aviso">✕</button>
        </p>
      )}
      <p className="font-mono-code text-[11px] text-[#64748b]">Si alguien te pasa una ficha, pegá acá el código que te dio.</p>
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setPreview(null); setError(null); }}
          placeholder="K7P4Q-X9M2R"
          maxLength={14}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 min-w-[10rem] bg-[#0b0d14] border border-[#2a3044] rounded-xs px-2 py-1.5 font-mono-code text-sm tracking-widest text-white uppercase"
          aria-label="Código para recibir una ficha"
        />
        <button type="button" className={smallBtn + ' border-[#2a3044] text-white hover:bg-white hover:text-black'} disabled={busy || input.trim() === ''} onClick={() => void look()}>
          {busy && !preview ? 'Buscando…' : 'Ver'}
        </button>
      </div>
      {preview && !preview.ok && <p className="font-mono-code text-xs text-[#ef4444]">{preview.error}</p>}
      {preview && preview.ok && (
        <div className="p-2 border border-emerald-500/40 bg-[#0f1f1a] rounded-xs space-y-1.5">
          <p className="font-mono-code text-xs text-emerald-200">
            <strong>{preview.info.fromName}</strong> te pasa a <strong>{preview.info.handle}</strong> ({preview.info.role} {preview.info.roleRank}).
          </p>
          <p className="font-mono-code text-[11px] text-[#94a3b8]">
            Al aceptar, la ficha queda en tu cuenta con sus historiales de IP y €$, y deja de ser de quien te la pasó.
          </p>
          <button type="button" className={smallBtn + ' border-emerald-500/60 text-emerald-300 hover:bg-emerald-500 hover:text-black'} disabled={busy} onClick={() => void accept()}>
            {busy ? 'Recibiendo…' : 'Aceptar'}
          </button>
        </div>
      )}
      {error && <p className="font-mono-code text-xs text-[#ef4444]">{error}</p>}
      {done && <p className="font-mono-code text-xs text-emerald-300">{done}</p>}
    </div>
  );
}
