// [Claude Code · 2026-10-24] v5.0.0 (plan 16): tests de la lectura de configuración de Firebase.
import { describe, it, expect } from 'vitest';
import { readFirebaseConfig, isEmulatorEnv } from '../firebaseConfig';

const base = {
  VITE_FIREBASE_API_KEY: 'k',
  VITE_FIREBASE_AUTH_DOMAIN: 'd.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'p',
  VITE_FIREBASE_STORAGE_BUCKET: 'p.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
  VITE_FIREBASE_APP_ID: 'a',
};

describe('readFirebaseConfig', () => {
  it.each(['local', 'beta', 'prod'] as const)('resuelve el entorno %s', (name) => {
    const c = readFirebaseConfig({ ...base, VITE_FIREBASE_ENV: name });
    expect(c).not.toBeNull();
    expect(c!.env).toBe(name);
    expect(c!.options.projectId).toBe('p');
    expect(c!.options.appId).toBe('a');
  });

  it('devuelve null si falta una clave', () => {
    const rest: Record<string, string> = { ...base };
    delete rest.VITE_FIREBASE_APP_ID;
    expect(readFirebaseConfig({ ...rest, VITE_FIREBASE_ENV: 'beta' })).toBeNull();
  });

  it('devuelve null si ENV es inválido o falta', () => {
    expect(readFirebaseConfig({ ...base, VITE_FIREBASE_ENV: 'staging' })).toBeNull();
    expect(readFirebaseConfig({ ...base })).toBeNull();
  });

  it('devuelve null si una clave está vacía', () => {
    expect(readFirebaseConfig({ ...base, VITE_FIREBASE_ENV: 'prod', VITE_FIREBASE_API_KEY: '' })).toBeNull();
  });

  it('isEmulatorEnv es true solo para local', () => {
    expect(isEmulatorEnv(readFirebaseConfig({ ...base, VITE_FIREBASE_ENV: 'local' })!)).toBe(true);
    expect(isEmulatorEnv(readFirebaseConfig({ ...base, VITE_FIREBASE_ENV: 'beta' })!)).toBe(false);
    expect(isEmulatorEnv(readFirebaseConfig({ ...base, VITE_FIREBASE_ENV: 'prod' })!)).toBe(false);
  });
});
