// Tests de las reglas de seguridad de Firestore: corren contra el emulador (npm run test:rules). [Claude Code · 2026-10-24]
// Van aparte de npm test porque necesitan el emulador (Java 21, ver scripts/firebase-with-jdk.mjs).
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/sync/__tests__/rules/**/*.rules.ts'],
    environment: 'node',
    testTimeout: 20000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
});
