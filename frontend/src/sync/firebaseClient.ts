// [Claude Code · 2026-10-24] v5.0.0 (plan 16): carga diferida del SDK de Firebase.
// Ningún archivo de la app debe importar 'firebase/*' de forma estática, solo a través de getFirebase()
// (así el modo local no suma peso al bundle).
import { readFirebaseConfig, isEmulatorEnv } from './firebaseConfig';
import type { FirebaseEnvName } from './firebaseConfig';

export interface FirebaseHandles {
  env: FirebaseEnvName;
  app: import('firebase/app').FirebaseApp;
  auth: import('firebase/auth').Auth;
  db: import('firebase/firestore').Firestore;
  // [Claude Code · 2026-10-24] Módulos ya cargados, para que ningún otro archivo importe firebase.
  authSdk: typeof import('firebase/auth');
  fsSdk: typeof import('firebase/firestore');
}

const readEnv = (): Record<string, string | undefined> =>
  import.meta.env as unknown as Record<string, string | undefined>;

export function isCloudAvailable(): boolean {
  return readFirebaseConfig(readEnv()) !== null;
}

let handlesPromise: Promise<FirebaseHandles> | null = null;

async function initFirebase(): Promise<FirebaseHandles> {
  const config = readFirebaseConfig(readEnv());
  if (!config) throw new Error('Firebase no está configurado en este entorno');
  const [{ initializeApp }, authMod, fsMod] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);
  const app = initializeApp(config.options);
  const auth = authMod.getAuth(app);
  const db = fsMod.initializeFirestore(app, {
    localCache: fsMod.persistentLocalCache({ tabManager: fsMod.persistentMultipleTabManager() }),
  });
  if (isEmulatorEnv(config)) {
    authMod.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    fsMod.connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  return { env: config.env, app, auth, db, authSdk: authMod, fsSdk: fsMod };
}

// Solo en el emulador local (npm run dev): permite probar sin la ventana emergente de Google, por
// ejemplo desde el panel del navegador de Claude Code, que no abre popups. No existe en beta ni en estable.
if (import.meta.env.DEV) {
  (globalThis as Record<string, unknown>).__cprEmulatorSignIn = async (email: string) => {
    const h = await getFirebase();
    if (h.env !== 'local') throw new Error('Solo en el emulador');
    const token = JSON.stringify({ sub: email, email, email_verified: true, name: email.split('@')[0] });
    await h.authSdk.signInWithCredential(h.auth, h.authSdk.GoogleAuthProvider.credential(token));
    return h.auth.currentUser?.uid;
  };
}

export async function getFirebase(): Promise<FirebaseHandles> {
  if (!handlesPromise) {
    handlesPromise = initFirebase().catch((e) => {
      handlesPromise = null;
      throw e;
    });
  }
  return handlesPromise;
}
