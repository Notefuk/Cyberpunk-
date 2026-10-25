// [Claude Code · 2026-10-24] v5.0.0 (plan 16): sesión con Google y modo local/nube.
// El SDK de Firebase solo se carga si el usuario eligió entrar (o ya había entrado antes).
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFirebase, isCloudAvailable } from './firebaseClient';
import type { FirebaseHandles } from './firebaseClient';

export type CloudStatus = 'local' | 'connecting' | 'cloud' | 'error';
export interface CloudUser { uid: string; displayName: string | null; email: string | null; photoURL: string | null }

export function toCloudUser(u: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }): CloudUser {
  return {
    uid: u.uid,
    displayName: u.displayName ?? null,
    email: u.email ?? null,
    photoURL: u.photoURL ?? null,
  };
}

// null = no mostrar error (por ejemplo, el usuario cerró la ventana).
export function describeAuthError(code: string | undefined): string | null {
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
  if (code === 'auth/network-request-failed') return 'Sin conexión: revisá internet y probá de nuevo.';
  if (code === 'auth/unauthorized-domain') return 'Este sitio no está autorizado en Firebase (dominios autorizados).';
  return 'No se pudo iniciar sesión (' + code + ').';
}

interface AuthState {
  cloudAvailable: boolean;
  status: CloudStatus;
  user: CloudUser | null;
  error: string | null;
  cloudWanted: boolean;
  initAuth: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutCloud: () => Promise<void>;
}

let listenerAttached = false;

// Tareas a correr antes de cerrar la sesión de Firebase (la capa de sync guarda lo pendiente). [Claude Code · 2026-10-24]
const beforeSignOut: (() => Promise<void>)[] = [];
export function registerBeforeSignOut(fn: () => Promise<void>): void {
  beforeSignOut.push(fn);
}

const errorCode = (e: unknown): string | undefined =>
  typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : undefined;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const ensureAuthListener = (handles: FirebaseHandles) => {
        if (listenerAttached) return;
        listenerAttached = true;
        handles.authSdk.onAuthStateChanged(handles.auth, (u) => {
          if (u) set({ status: 'cloud', user: toCloudUser(u), error: null });
          else set({ status: 'local', user: null });
        });
      };

      return {
        cloudAvailable: isCloudAvailable(),
        status: 'local',
        user: null,
        error: null,
        cloudWanted: false,

        initAuth: async () => {
          const { cloudAvailable, cloudWanted } = get();
          if (!cloudAvailable || !cloudWanted) {
            set({ status: 'local' });
            return;
          }
          set({ status: 'connecting' });
          try {
            const handles = await getFirebase();
            ensureAuthListener(handles);
            // Si el listener ya estaba puesto (initAuth dos veces, p. ej. StrictMode), su aviso pudo llegar antes
            // de este 'connecting' y no se repite: se lee el usuario actual para no quedar colgado. [Claude Code · 2026-10-24]
            await handles.auth.authStateReady?.();
            const u = handles.auth.currentUser;
            if (get().status === 'connecting') set(u ? { status: 'cloud', user: toCloudUser(u), error: null } : { status: 'local', user: null });
          } catch (e) {
            set({ status: 'error', error: e instanceof Error ? e.message : 'No se pudo conectar con la nube.' });
          }
        },

        signInWithGoogle: async () => {
          set({ status: 'connecting', error: null });
          try {
            const handles = await getFirebase();
            ensureAuthListener(handles);
            const provider = new handles.authSdk.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            try {
              await handles.authSdk.signInWithPopup(handles.auth, provider);
              set({ cloudWanted: true });
            } catch (e) {
              const code = errorCode(e);
              if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
                set({ cloudWanted: true });
                await handles.authSdk.signInWithRedirect(handles.auth, provider);
                return;
              }
              throw e;
            }
          } catch (e) {
            const msg = describeAuthError(errorCode(e));
            if (msg === null) set({ status: 'local' });
            else set({ status: 'error', error: msg });
          }
        },

        signOutCloud: async () => {
          for (const fn of beforeSignOut) {
            try {
              await fn();
            } catch {
              // un fallo al guardar no impide salir
            }
          }
          try {
            const handles = await getFirebase();
            await handles.authSdk.signOut(handles.auth);
          } catch {
            // Si el SDK no cargó, igual volvemos a modo local.
          }
          set({ status: 'local', user: null, cloudWanted: false, error: null });
        },
      };
    },
    {
      name: 'cpr_cloud_mode_v1',
      partialize: (state) => ({ cloudWanted: state.cloudWanted }),
    }
  )
);

// Solo en el emulador local (npm run dev): permite probar sin la ventana emergente de Google, por
// ejemplo desde el panel del navegador de Claude Code, que no abre popups. No existe en beta ni en estable.
// Pasa por el store (cloudWanted + listener) para que arranque la sesión de nube igual que el login real.
// [Claude Code · 2026-10-24]
if (import.meta.env.DEV) {
  (globalThis as Record<string, unknown>).__cprEmulatorSignIn = async (email: string) => {
    const h = await getFirebase();
    if (h.env !== 'local') throw new Error('Solo en el emulador');
    useAuthStore.setState({ cloudWanted: true });
    await useAuthStore.getState().initAuth();
    const token = JSON.stringify({ sub: email, email, email_verified: true, name: email.split('@')[0] });
    await h.authSdk.signInWithCredential(h.auth, h.authSdk.GoogleAuthProvider.credential(token));
    return h.auth.currentUser?.uid;
  };
}
