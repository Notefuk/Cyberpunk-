/// <reference types="node" />
// Tests de las reglas de seguridad de Firestore (v5.0.0, plan 16 y 17). [Claude Code · 2026-10-24]
// Corren contra el emulador: npm run test:rules.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  FieldPath,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Firestore,
} from 'firebase/firestore';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-cpr-omni-deck',
    firestore: {
      rules: readFileSync(fileURLToPath(new URL('../../../../firestore.rules', import.meta.url)), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

const db = (uid: string): Firestore => env.authenticatedContext(uid).firestore() as unknown as Firestore;
const anon = (): Firestore => env.unauthenticatedContext().firestore() as unknown as Firestore;

// Campos de escritor para crear (freno por escritor, plan 17 punto 9).
const writerFields = (writer: string) => ({
  _lastWriter: writer,
  _w: { [writer]: serverTimestamp() },
  _ts: serverTimestamp(),
});

// updateDoc con los campos de escritor, como lo hace firestoreAdapter.
function updateAs(fs: Firestore, charId: string, writer: string, field: string, value: unknown) {
  return updateDoc(
    doc(fs, 'characters', charId),
    field, value,
    new FieldPath('_w', writer), serverTimestamp(),
    '_lastWriter', writer,
    '_ts', serverTimestamp(),
  );
}

async function seed(pathSegments: string[], data: Record<string, unknown>) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const fs = ctx.firestore() as unknown as Firestore;
    await setDoc(doc(fs, pathSegments.join('/')), data);
  });
}

const baseChar = (ownerUid: string, campaignIds: string[] = []) => ({
  handle: 'Vex',
  currentHp: 30,
  ownerUid,
  campaignIds,
  schemaVersion: 6,
  _w: {},
});

const camp = { name: 'Mesa', gmUid: 'gm', memberUids: ['gm', 'alice', 'bob'], inviteCode: 'codigo-secreto-123' };

describe('fichas', () => {
  it('el dueño crea su ficha con los campos de escritor', async () => {
    await assertSucceeds(setDoc(doc(db('alice'), 'characters/c1'), { ...baseChar('alice'), ...writerFields('alice_dev1') }));
  });

  it('no se puede crear una ficha a nombre de otro, ya asignada a una campaña o sin campos de escritor', async () => {
    await assertFails(setDoc(doc(db('alice'), 'characters/c1'), { ...baseChar('bob'), ...writerFields('alice_dev1') }));
    await assertFails(setDoc(doc(db('alice'), 'characters/c2'), { ...baseChar('alice', ['camp1']), ...writerFields('alice_dev1') }));
    await assertFails(setDoc(doc(db('alice'), 'characters/c3'), baseChar('alice')));
    await assertFails(setDoc(doc(db('alice'), 'characters/c4'), { ...baseChar('alice'), ...writerFields('bob_dev1') }));
  });

  it('sin sesión no se lee ni se escribe nada', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertFails(getDoc(doc(anon(), 'characters/c1')));
  });

  it('el dueño lee su ficha; otro jugador no', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertSucceeds(getDoc(doc(db('alice'), 'characters/c1')));
    await assertFails(getDoc(doc(db('bob'), 'characters/c1')));
  });

  it('con sesión se puede preguntar si un id de ficha está libre (no existe); sin sesión no', async () => {
    await assertSucceeds(getDoc(doc(db('alice'), 'characters/libre')));
    await assertFails(getDoc(doc(anon(), 'characters/libre')));
  });

  it('listar "mis fichas" (where ownerUid == uid) funciona', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertSucceeds(getDocs(query(collection(db('alice'), 'characters'), where('ownerUid', '==', 'alice'))));
    await assertFails(getDocs(query(collection(db('bob'), 'characters'), where('ownerUid', '==', 'alice'))));
  });

  it('el GM de la campaña lee y edita la ficha; otro miembro no la ve', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await assertSucceeds(getDoc(doc(db('gm'), 'characters/c1')));
    await assertSucceeds(updateAs(db('gm'), 'c1', 'gm_dev1', 'currentHp', 20));
    await assertFails(getDoc(doc(db('bob'), 'characters/c1')));
    await assertFails(updateAs(db('bob'), 'c1', 'bob_dev1', 'currentHp', 1));
  });

  it('freno: el mismo escritor no puede escribir dos veces en menos de 1 s', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev1', 'currentHp', 29));
    await assertFails(updateAs(db('alice'), 'c1', 'alice_dev1', 'currentHp', 28));
  });

  it('freno por escritor: otro dispositivo del mismo jugador o el GM sí pueden escribir enseguida (decisión 6)', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev1', 'currentHp', 29));
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev2', 'currentHp', 28));
    await assertSucceeds(updateAs(db('gm'), 'c1', 'gm_dev1', 'currentHp', 20));
  });

  it('el freno vuelve a dejar escribir pasado 1 s', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev1', 'currentHp', 29));
    await new Promise((r) => setTimeout(r, 1200));
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev1', 'currentHp', 28));
  });

  it('no se puede escribir con el id de escritor de otro usuario', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertFails(updateAs(db('alice'), 'c1', 'bob_dev1', 'currentHp', 29));
  });

  it('no se puede cambiar el dueño ni bajar la versión del esquema', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertFails(updateAs(db('alice'), 'c1', 'alice_dev1', 'ownerUid', 'bob'));
    await assertFails(updateAs(db('alice'), 'c1', 'alice_dev2', 'schemaVersion', 5));
  });

  it('el dueño asigna su ficha a una campaña de la que es miembro; no a una ajena', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['campaigns', 'camp2'], { ...camp, memberUids: ['gm'] });
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev1', 'campaignIds', ['camp1']));
    await seed(['characters', 'c2'], baseChar('alice'));
    await assertFails(updateAs(db('alice'), 'c2', 'alice_dev1', 'campaignIds', ['camp2']));
  });

  it('el GM no puede cambiar las campañas de la ficha', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await assertFails(updateAs(db('gm'), 'c1', 'gm_dev1', 'campaignIds', []));
  });
});

describe('historiales de IP y €$ (solo creación)', () => {
  it('el dueño y el GM agregan entradas; nadie las edita; un extraño no agrega', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    const entry = (id: string, by: string) => ({ id, at: '2026-10-24T00:00:00Z', kind: 'award', delta: 5, reason: 'x', balanceAfter: 5, _by: by });
    await assertSucceeds(setDoc(doc(db('alice'), 'characters/c1/ipLog/ip-1'), entry('ip-1', 'alice')));
    await assertSucceeds(setDoc(doc(db('gm'), 'characters/c1/ipLog/ip-2'), entry('ip-2', 'gm')));
    await assertFails(setDoc(doc(db('alice'), 'characters/c1/ipLog/ip-1'), { ...entry('ip-1', 'alice'), delta: 500 }));
    await assertFails(setDoc(doc(db('bob'), 'characters/c1/ipLog/ip-3'), entry('ip-3', 'bob')));
    await assertFails(setDoc(doc(db('alice'), 'characters/c1/ipLog/ip-4'), entry('ip-4', 'gm')));
    await assertFails(setDoc(doc(db('alice'), 'characters/c1/notes/n1'), { id: 'n1', _by: 'alice' }));
  });

  it('el dueño lee su historial; otro jugador no', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await seed(['characters', 'c1', 'transactions', 'tx-1'], { id: 'tx-1', amount: -100, _by: 'alice' });
    await assertSucceeds(getDoc(doc(db('alice'), 'characters/c1/transactions/tx-1')));
    await assertFails(getDoc(doc(db('bob'), 'characters/c1/transactions/tx-1')));
  });
});

describe('campañas', () => {
  it('cualquiera con sesión crea una campaña donde es GM y único miembro', async () => {
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1'), { name: 'Mesa', gmUid: 'gm', memberUids: ['gm'], inviteCode: 'codigo-secreto-123' }));
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp2'), { name: 'Mesa', gmUid: 'otro', memberUids: ['gm'], inviteCode: 'codigo-secreto-123' }));
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp3'), { name: 'Mesa', gmUid: 'gm', memberUids: ['gm'], inviteCode: 'corto' }));
  });

  it('unirse con el código correcto funciona; con el incorrecto no; no se puede sumar a otro', async () => {
    await seed(['campaigns', 'camp1'], { ...camp, memberUids: ['gm'] });
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1'), { memberUids: ['gm', 'alice'], lastJoinCode: 'codigo-malo-0000' }));
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1'), { memberUids: ['gm', 'carol'], lastJoinCode: 'codigo-secreto-123' }));
    await assertSucceeds(updateDoc(doc(db('alice'), 'campaigns/camp1'), { memberUids: ['gm', 'alice'], lastJoinCode: 'codigo-secreto-123' }));
  });

  it('los miembros leen la campaña; los demás no', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(getDoc(doc(db('alice'), 'campaigns/camp1')));
    await assertFails(getDoc(doc(db('carol'), 'campaigns/camp1')));
  });

  it('un jugador sale; el GM no puede salir sin pasar el rol', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(updateDoc(doc(db('bob'), 'campaigns/camp1'), { memberUids: ['gm', 'alice'] }));
    await assertFails(updateDoc(doc(db('gm'), 'campaigns/camp1'), { memberUids: ['alice'] }));
  });

  it('el GM pasa el rol a un miembro; un jugador no puede editar la campaña', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1'), { name: 'Mía' }));
    await assertFails(updateDoc(doc(db('gm'), 'campaigns/camp1'), { gmUid: 'carol' }));
    await assertSucceeds(updateDoc(doc(db('gm'), 'campaigns/camp1'), { gmUid: 'alice' }));
  });

  it('resumen de party: lo leen los miembros; cada uno escribe el de su ficha', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(setDoc(doc(db('alice'), 'campaigns/camp1/party/c1'), { ownerUid: 'alice', handle: 'Vex', currentHp: 30 }));
    await assertSucceeds(getDoc(doc(db('bob'), 'campaigns/camp1/party/c1')));
    await assertFails(getDoc(doc(db('carol'), 'campaigns/camp1/party/c1')));
    await assertFails(setDoc(doc(db('bob'), 'campaigns/camp1/party/c1'), { ownerUid: 'alice', handle: 'Hackeado', currentHp: 0 }));
    await assertFails(setDoc(doc(db('bob'), 'campaigns/camp1/party/c1'), { ownerUid: 'bob', handle: 'Mío', currentHp: 0 }));
  });

  it('los secretos del GM solo los ve el GM', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/gm/notas'), { text: 'el Fixer los traiciona' }));
    await assertFails(getDoc(doc(db('alice'), 'campaigns/camp1/gm/notas')));
  });

  it('log de la mesa: los miembros agregan con su firma; nadie edita', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(setDoc(doc(db('alice'), 'campaigns/camp1/log/l1'), { _by: 'alice', text: 'Tirada 17' }));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/l2'), { _by: 'bob', text: 'falsa' }));
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1/log/l1'), { text: 'Tirada 30' }));
    await assertFails(setDoc(doc(db('carol'), 'campaigns/camp1/log/l3'), { _by: 'carol', text: 'intrusa' }));
  });
});
