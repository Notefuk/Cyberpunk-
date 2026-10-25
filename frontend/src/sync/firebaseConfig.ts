// [Claude Code · 2026-10-24] v5.0.0 (plan 16): lectura pura de la configuración de Firebase desde variables VITE_*.
// Sin imports de firebase: si falta algo, la app queda en modo solo local.
export type FirebaseEnvName = 'local' | 'beta' | 'prod';
export interface FirebaseWebOptions { apiKey: string; authDomain: string; projectId: string; storageBucket: string; messagingSenderId: string; appId: string }
export interface ResolvedFirebaseConfig { env: FirebaseEnvName; options: FirebaseWebOptions }

export function readFirebaseConfig(env: Record<string, string | undefined>): ResolvedFirebaseConfig | null {
  const name = env.VITE_FIREBASE_ENV;
  if (name !== 'local' && name !== 'beta' && name !== 'prod') return null;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = env.VITE_FIREBASE_APP_ID;
  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) return null;
  return { env: name, options: { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } };
}

export function isEmulatorEnv(c: ResolvedFirebaseConfig): boolean {
  return c.env === 'local';
}
