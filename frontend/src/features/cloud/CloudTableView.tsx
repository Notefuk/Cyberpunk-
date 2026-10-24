// [Claude Code · 2026-10-24] v5.0.0 (plan 16): pestaña "MESA // CAMPAÑA" (login y estado; sin sync de fichas todavía).
import { readFirebaseConfig } from '../../sync/firebaseConfig';
import { useAuthStore } from '../../sync/authStore';

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

  const config = readFirebaseConfig(import.meta.env as unknown as Record<string, string | undefined>);
  if (!config) {
    return (
      <div className="bg-[#10121a] border border-[#262c3e] rounded-xs p-6 font-mono-code text-xs text-[#94a3b8]">
        La mesa online no está configurada en esta versión.
      </div>
    );
  }

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
            <p className="font-mono-code text-xs text-[#64748b]">{PENDING}</p>
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
