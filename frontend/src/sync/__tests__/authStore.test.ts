// [Claude Code · 2026-10-24] v5.0.0 (plan 16): tests del store de sesión (Firebase simulado, sin red).
import { describe, it, expect, vi, beforeEach } from 'vitest';

const h = vi.hoisted(() => {
  const mem = new Map<string, string>();
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
    setItem: (k: string, v: string) => { mem.set(k, v); },
    removeItem: (k: string) => { mem.delete(k); },
    clear: () => mem.clear(),
  };
  class GoogleAuthProvider { setCustomParameters = vi.fn(); }
  const authSdk = {
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
    signInWithRedirect: vi.fn(),
    signOut: vi.fn(),
    GoogleAuthProvider,
  };
  const handles = { env: 'local', auth: {}, authSdk };
  return { authSdk, handles, getFirebase: vi.fn() };
});

vi.mock('../firebaseClient', () => ({
  isCloudAvailable: () => true,
  getFirebase: h.getFirebase,
}));

import { useAuthStore, toCloudUser, describeAuthError } from '../authStore';

beforeEach(() => {
  vi.clearAllMocks();
  h.getFirebase.mockResolvedValue(h.handles);
  h.authSdk.signInWithPopup.mockResolvedValue({});
  h.authSdk.signInWithRedirect.mockResolvedValue(undefined);
  h.authSdk.signOut.mockResolvedValue(undefined);
  useAuthStore.setState({ status: 'local', user: null, error: null, cloudWanted: false });
});

describe('toCloudUser', () => {
  it('mapea campos y completa con null', () => {
    expect(toCloudUser({ uid: 'a' })).toEqual({ uid: 'a', displayName: null, email: null, photoURL: null });
    expect(toCloudUser({ uid: 'b', displayName: 'Ana', email: 'a@b.c', photoURL: 'x' }))
      .toEqual({ uid: 'b', displayName: 'Ana', email: 'a@b.c', photoURL: 'x' });
  });
});

describe('describeAuthError', () => {
  it('devuelve null cuando el usuario cierra la ventana', () => {
    expect(describeAuthError('auth/popup-closed-by-user')).toBeNull();
    expect(describeAuthError('auth/cancelled-popup-request')).toBeNull();
  });
  it('traduce errores conocidos y el resto', () => {
    expect(describeAuthError('auth/network-request-failed')).toBe('Sin conexión: revisá internet y probá de nuevo.');
    expect(describeAuthError('auth/unauthorized-domain')).toBe('Este sitio no está autorizado en Firebase (dominios autorizados).');
    expect(describeAuthError('auth/xyz')).toBe('No se pudo iniciar sesión (auth/xyz).');
  });
});

describe('useAuthStore', () => {
  it('initAuth con cloudWanted false no carga el SDK', async () => {
    await useAuthStore.getState().initAuth();
    expect(h.getFirebase).not.toHaveBeenCalled();
    expect(useAuthStore.getState().status).toBe('local');
  });

  it('initAuth llamado dos veces no queda en "conectando" si ya hay usuario', async () => {
    useAuthStore.setState({ cloudWanted: true });
    const auth = { currentUser: { uid: 'u1', email: 'a@b.c' }, authStateReady: vi.fn().mockResolvedValue(undefined) };
    h.getFirebase.mockResolvedValue({ ...h.handles, auth });
    await useAuthStore.getState().initAuth();
    await useAuthStore.getState().initAuth();
    expect(useAuthStore.getState().status).toBe('cloud');
    expect(useAuthStore.getState().user?.uid).toBe('u1');
  });

  it('signInWithGoogle exitoso marca cloudWanted y usa popup', async () => {
    await useAuthStore.getState().signInWithGoogle();
    expect(h.authSdk.signInWithPopup).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().cloudWanted).toBe(true);
  });

  it('popup bloqueado cae a redirect', async () => {
    h.authSdk.signInWithPopup.mockRejectedValue({ code: 'auth/popup-blocked' });
    await useAuthStore.getState().signInWithGoogle();
    expect(h.authSdk.signInWithRedirect).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().cloudWanted).toBe(true);
  });

  it('popup cerrado por el usuario vuelve a local sin error', async () => {
    h.authSdk.signInWithPopup.mockRejectedValue({ code: 'auth/popup-closed-by-user' });
    await useAuthStore.getState().signInWithGoogle();
    const s = useAuthStore.getState();
    expect(s.status).toBe('local');
    expect(s.error).toBeNull();
  });

  it('signOutCloud resetea el estado', async () => {
    useAuthStore.setState({ status: 'cloud', user: { uid: 'a', displayName: null, email: null, photoURL: null }, cloudWanted: true });
    await useAuthStore.getState().signOutCloud();
    const s = useAuthStore.getState();
    expect(h.authSdk.signOut).toHaveBeenCalledTimes(1);
    expect(s.status).toBe('local');
    expect(s.user).toBeNull();
    expect(s.cloudWanted).toBe(false);
    expect(s.error).toBeNull();
  });
});
