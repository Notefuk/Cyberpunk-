// [Claude Code · 2026-10-24] v5.0.0 (plan 16): pestaña "MESA // CAMPAÑA" (login y estado; sin sync de fichas todavía).
import { readFirebaseConfig } from '../../sync/firebaseConfig';
import { useState } from 'react';
import { useAuthStore } from '../../sync/authStore';
import { useCloudState } from '../../sync/cloudState';
import { uploadCharacters } from '../../sync/cloudCharacters';
import { useCharacterStore } from '../../store/useCharacterStore';

const ENV_LINES = {
  local: 'Entorno: local (emulador, datos de prueba)',
  beta: 'Entorno: beta (Firebase de prueba)',
  prod: 'Entorno: estable',
} as const;

const PENDING = 'Se activa en las próximas etapas de la v5.0.0.';

export function CloudTableView() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const error = useAuthStore((s) => s.error);
  const signIn = useAuthStore((s) => s.signInWithGoogle);
  const signOut = useAuthStore((s) => s.signOutCloud);
  const characters = useCharacterStore((s) => s.characters);
  const cloudIds = useCloudState((s) => s.cloudIds);
  const needsAppUpdate = useCloudState((s) => s.needsAppUpdate);
  const lastError = useCloudState((s) => s.lastError);
  const uploading = useCloudState((s) => s.uploading);
  const [selected, setSelected] = useState<string[]>([]);

  const config = readFirebaseConfig(import.meta.env as unknown as Record<string, string | undefined>);
  if (!config) {
    return (
      <div className="bg-[#10121a] border border-[#262c3e] rounded-xs p-6 font-mono-code text-xs text-[#94a3b8]">
        La mesa online no está configurada en esta versión.
      </div>
    );
  }

  const cloudChars = characters.filter((c) => cloudIds.includes(c.id));
  const localChars = characters.filter((c) => !cloudIds.includes(c.id));

  const btn = 'px-4 py-2 bg-[#dc2626] hover:bg-white text-white hover:text-black font-tech font-bold text-sm uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-1">
        <h2 className="font-tech text-xl font-black text-white tracking-widest uppercase">MESA ONLINE // CAMPAÑA</h2>
        <p className="font-mono-code text-[11px] text-[#64748b]">{ENV_LINES[config.env]}</p>
      </div>

      <div className="chamfer-card bg-[#10121a] border border-[#262c3e] p-5 space-y-4">
        {status === 'local' && (
          <>
            <p className="text-sm text-[#94a3b8]">
              Sin cuenta, tus fichas viven solo en este dispositivo. Con tu cuenta de Google se guardan en la nube, las ves en cualquier dispositivo y podés unirte a la campaña de tu GM.
            </p>
            <button type="button" className={btn} onClick={() => void signIn()}>Entrar con Google</button>
          </>
        )}
        {status === 'connecting' && (
          <>
            <p className="text-sm text-amber-300 font-mono-code">Conectando con la nube…</p>
            <button type="button" className={btn} disabled>Entrar con Google</button>
          </>
        )}
        {status === 'cloud' && (
          <div className="flex items-center gap-3 flex-wrap">
            {user?.photoURL && (
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" width={32} height={32} className="w-8 h-8 rounded-full" />
            )}
            <div className="min-w-0">
              <div className="font-tech text-white">{user?.displayName ?? 'Sin nombre'}</div>
              {user?.email && <div className="font-mono-code text-[11px] text-[#94a3b8]">{user.email}</div>}
            </div>
            <button type="button" className={btn + ' ml-auto'} onClick={() => void signOut()}>Salir (volver al modo local)</button>
          </div>
        )}
        {status === 'error' && (
          <>
            <p className="text-sm text-[#ef4444] font-mono-code">{error}</p>
            <button type="button" className={btn} onClick={() => void signIn()}>Reintentar</button>
          </>
        )}
      </div>

      {status === 'cloud' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="chamfer-card bg-[#10121a] border border-[#262c3e] p-5 space-y-2">
            <h3 className="font-tech text-sm text-white uppercase tracking-wider">Tus fichas en la nube</h3>
            {needsAppUpdate && (
              <p className="font-mono-code text-xs text-[#ef4444]">Hay fichas guardadas con una versión más nueva de la app. Actualizá la página (Ctrl+F5) antes de editarlas.</p>
            )}
            {lastError && <p className="font-mono-code text-xs text-[#ef4444]">{lastError}</p>}
            {cloudChars.length === 0 ? (
              <p className="font-mono-code text-xs text-[#64748b]">Todavía no tenés fichas en la nube.</p>
            ) : (
              <ul className="space-y-1">
                {cloudChars.map((c) => (
                  <li key={c.id} className="font-mono-code text-xs text-[#94a3b8]">{c.handle} <span className="text-[#64748b]">({c.role})</span></li>
                ))}
              </ul>
            )}
            <h3 className="font-tech text-sm text-white uppercase tracking-wider pt-3">Fichas solo en este dispositivo</h3>
            {localChars.length === 0 ? (
              <p className="font-mono-code text-xs text-[#64748b]">No hay fichas locales para subir.</p>
            ) : (
              <ul className="space-y-1">
                {localChars.map((c) => (
                  <li key={c.id}>
                    <label className="flex items-center gap-2 font-mono-code text-xs text-[#94a3b8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.includes(c.id)}
                        onChange={(e) => setSelected((prev) => (e.target.checked ? [...prev, c.id] : prev.filter((x) => x !== c.id)))}
                      />
                      <span>{c.handle} ({c.role}){c.id.startsWith('char-') ? '' : ' (precargada: se sube como copia)'}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className={btn}
              disabled={uploading || selected.length === 0}
              onClick={() => {
                const ids = selected;
                setSelected([]);
                void uploadCharacters(ids);
              }}
            >
              {uploading ? 'Subiendo…' : 'Subir a la nube'}
            </button>
            <p className="font-mono-code text-[11px] text-[#64748b]">Al salir de tu cuenta, las fichas de la nube se quitan de este dispositivo y quedan guardadas en tu cuenta.</p>
          </div>
          <div className="chamfer-card bg-[#10121a] border border-[#262c3e] p-5 space-y-2">
            <h3 className="font-tech text-sm text-white uppercase tracking-wider">Campañas</h3>
            <p className="font-mono-code text-xs text-[#64748b]">{PENDING}</p>
          </div>
        </div>
      )}
    </div>
  );
}
