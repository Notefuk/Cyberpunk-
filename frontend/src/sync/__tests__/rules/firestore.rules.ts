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
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  FieldPath,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
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

  it('si el GM echa al dueño, deja de ver y editar su ficha aunque siga diciendo la campaña (plan 18)', async () => {
    await seed(['campaigns', 'camp1'], { ...camp, memberUids: ['gm', 'bob'] });
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await assertFails(getDoc(doc(db('gm'), 'characters/c1')));
    await assertFails(updateAs(db('gm'), 'c1', 'gm_dev1', 'currentHp', 20));
    await assertSucceeds(getDoc(doc(db('alice'), 'characters/c1')));
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

  it('unirse con arrayUnion y su nombre funciona; no se puede escribir el nombre de otro (plan 18)', async () => {
    await seed(['campaigns', 'camp1'], { ...camp, memberUids: ['gm'], memberNames: { gm: 'GM' } });
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1'), {
      memberUids: arrayUnion('alice'), lastJoinCode: 'codigo-secreto-123', 'memberNames.gm': 'Hackeado',
    }));
    await assertSucceeds(updateDoc(doc(db('alice'), 'campaigns/camp1'), {
      memberUids: arrayUnion('alice'), lastJoinCode: 'codigo-secreto-123', 'memberNames.alice': 'Alice',
    }));
  });

  it('salir con arrayRemove borra el propio nombre; el GM echa a un miembro (plan 18)', async () => {
    await seed(['campaigns', 'camp1'], { ...camp, memberNames: { gm: 'GM', alice: 'Alice', bob: 'Bob' } });
    await assertFails(updateDoc(doc(db('bob'), 'campaigns/camp1'), { memberUids: arrayRemove('bob'), 'memberNames.alice': deleteField() }));
    await assertSucceeds(updateDoc(doc(db('bob'), 'campaigns/camp1'), { memberUids: arrayRemove('bob'), 'memberNames.bob': deleteField() }));
    await assertSucceeds(updateDoc(doc(db('gm'), 'campaigns/camp1'), { memberUids: arrayRemove('alice'), 'memberNames.alice': deleteField() }));
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
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/gm/notes'), { text: 'el Fixer los traiciona', _ts: serverTimestamp() }));
    await assertFails(getDoc(doc(db('alice'), 'campaigns/camp1/gm/notes')));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/gm/npcs'), { items: [], _ts: serverTimestamp() }));
  });

  // [Claude Code · 2026-10-28] v5.3.0 (plan 20, B.1): forma y tamaño de los secretos.
  it('secretos del GM: solo notes/npcs/net, con su forma, tamaño y hora del servidor', async () => {
    await seed(['campaigns', 'camp1'], camp);
    const gm = db('gm');
    await assertFails(setDoc(doc(gm, 'campaigns/camp1/gm/otro'), { text: 'x', _ts: serverTimestamp() }));
    await assertFails(setDoc(doc(gm, 'campaigns/camp1/gm/notes'), { text: 'x'.repeat(100001), _ts: serverTimestamp() }));
    await assertFails(setDoc(doc(gm, 'campaigns/camp1/gm/notes'), { text: 'x', _ts: 5 }));
    await assertFails(setDoc(doc(gm, 'campaigns/camp1/gm/notes'), { text: 'x', extra: 1, _ts: serverTimestamp() }));
    await assertFails(setDoc(doc(gm, 'campaigns/camp1/gm/npcs'), { items: Array.from({ length: 201 }, (_, i) => ({ id: 'n' + i })), _ts: serverTimestamp() }));
    await assertSucceeds(setDoc(doc(gm, 'campaigns/camp1/gm/npcs'), { items: [{ id: 'n1', name: 'Fixer' }], _ts: serverTimestamp() }));
    await assertFails(setDoc(doc(gm, 'campaigns/camp1/gm/net'), { items: Array.from({ length: 51 }, (_, i) => ({ id: 'a' + i })), _ts: serverTimestamp() }));
    await assertSucceeds(setDoc(doc(gm, 'campaigns/camp1/gm/net'), { items: [], _ts: serverTimestamp() }));
  });

  // [Claude Code · 2026-10-28] v5.3.0 (plan 20, B.2): lo que revela el GM. La mesa lee; solo el GM escribe.
  it('revelado: el GM manda handouts y la corrida NET; un jugador lee pero no escribe', async () => {
    await seed(['campaigns', 'camp1'], camp);
    const note = (id: string, by: string, over: Record<string, unknown> = {}) => ({ id, kind: 'note', title: 'Pista', text: 'La puerta está abierta', at: serverTimestamp(), _by: by, ...over });
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/h1'), note('h1', 'gm')));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/reveals/h2'), note('h2', 'alice')));
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/h3'), note('h3', 'gm', { text: 'x'.repeat(2001) })));
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/h4'), note('otro', 'gm')));
    await assertFails(updateDoc(doc(db('gm'), 'campaigns/camp1/reveals/h1'), { text: 'cambiada' }));
    await assertSucceeds(getDoc(doc(db('alice'), 'campaigns/camp1/reveals/h1')));
    await assertFails(getDoc(doc(db('carol'), 'campaigns/camp1/reveals/h1')));
    const net = { archName: 'Arasaka', totalFloors: 6, currentFloor: 2, floors: [{ floorNumber: 1, type: 'Password', name: 'Puerta', dv: 8 }], _ts: serverTimestamp() };
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/net'), net));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/reveals/net'), net));
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/net'), { ...net, secreto: 'ICE HP 20' }));
    await assertSucceeds(getDoc(doc(db('alice'), 'campaigns/camp1/reveals/net')));
  });

  // [Claude Code · 2026-11-06] v5.14.0 (plan 26): el Night Market que el GM muestra a la mesa.
  it('revelado: el GM muestra un Night Market; la mesa lo lee y no lo escribe', async () => {
    await seed(['campaigns', 'camp1'], camp);
    const market = { title: 'Night Market', source: 'Core p.338', sections: [{ heading: 'Cyberware', items: ['Cybereye 100eb (Premium)'] }], _ts: serverTimestamp() };
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/market'), market));
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/market'), { ...market, title: 'Otro mercado' }));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/reveals/market'), market));
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/market'), { ...market, precioReal: 1 }));
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/market'), { ...market, sections: Array.from({ length: 13 }, () => ({ heading: 'x', items: [] })) }));
    // Un handout no puede usar el id 'market'.
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp1/reveals/market'), { id: 'market', kind: 'note', title: 'x', text: 'y', at: serverTimestamp(), _by: 'gm' }));
    await assertSucceeds(getDoc(doc(db('alice'), 'campaigns/camp1/reveals/market')));
    await assertFails(getDoc(doc(db('carol'), 'campaigns/camp1/reveals/market')));
    await assertSucceeds(deleteDoc(doc(db('gm'), 'campaigns/camp1/reveals/market')));
  });

  // [Claude Code · 2026-10-27] v5.1.0 (plan 19): forma fija del log (id propio, hora del servidor, tamaños).
  const logEntry = (id: string, by: string, over: Record<string, unknown> = {}) => ({
    id, _by: by, at: serverTimestamp(), handle: 'Vex', kind: 'attack', label: 'Ataque: Heavy Pistol', total: 17, ...over,
  });

  it('log de la mesa: los miembros agregan con su firma; nadie edita', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(setDoc(doc(db('alice'), 'campaigns/camp1/log/l1'), logEntry('l1', 'alice')));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/l2'), logEntry('l2', 'bob')));
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1/log/l1'), { total: 30 }));
    await assertFails(setDoc(doc(db('carol'), 'campaigns/camp1/log/l3'), logEntry('l3', 'carol')));
    await assertSucceeds(getDoc(doc(db('bob'), 'campaigns/camp1/log/l1')));
  });

  it('log de la mesa: no acepta ids ajenos, campos de más, tipos raros ni textos largos (plan 19)', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/l1'), logEntry('otro', 'alice')));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/l2'), logEntry('l2', 'alice', { hp: 0 })));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/l3'), logEntry('l3', 'alice', { kind: 'hack' })));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/l4'), logEntry('l4', 'alice', { detail: 'x'.repeat(301) })));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/l5'), logEntry('l5', 'alice', { at: 5 })));
    await assertSucceeds(setDoc(doc(db('alice'), 'campaigns/camp1/log/l6'), logEntry('l6', 'alice', { kind: 'deathSave', detail: 'Death Save 4 vs 6: salva' })));
  });

  // [Claude Code · 2026-10-28] v5.2.0 (plan 20): las acciones del GM sobre un PJ van al log solo de su mano.
  it('log de la mesa: solo el GM publica entradas "gm"', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/log/g1'), logEntry('g1', 'alice', { kind: 'gm' })));
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/log/g2'), logEntry('g2', 'gm', { kind: 'gm', charId: 'c1', detail: 'SP 11→10 · HP 25→21' })));
  });

  it('el GM borra entradas del log; un jugador no', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['campaigns', 'camp1', 'log', 'l1'], { id: 'l1', _by: 'alice' });
    await assertFails(deleteDoc(doc(db('alice'), 'campaigns/camp1/log/l1')));
    await assertSucceeds(deleteDoc(doc(db('gm'), 'campaigns/camp1/log/l1')));
  });
});

describe('mesa compartida (plan 19)', () => {
  it('reloj y era: solo el GM los escribe, y con forma válida', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1'), { clock: { session: 1, day: 2, beat: 1 } }));
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1'), { era: '2077' }));
    await assertSucceeds(updateDoc(doc(db('gm'), 'campaigns/camp1'), { clock: { session: 1, day: 2, beat: 1 }, era: '2077' }));
    await assertFails(updateDoc(doc(db('gm'), 'campaigns/camp1'), { clock: { session: 0, day: 2, beat: 1 } }));
    await assertFails(updateDoc(doc(db('gm'), 'campaigns/camp1'), { clock: { session: 1, day: 2, beat: 1, extra: 1 } }));
    await assertFails(updateDoc(doc(db('gm'), 'campaigns/camp1'), { era: '2020' }));
  });

  it('encuentro: los miembros leen round y orden; solo el GM los escribe', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/encounters/current'), { round: 1, turnIndex: 0, order: [] }));
    await assertSucceeds(getDoc(doc(db('alice'), 'campaigns/camp1/encounters/current')));
    await assertFails(getDoc(doc(db('carol'), 'campaigns/camp1/encounters/current')));
    await assertFails(updateDoc(doc(db('alice'), 'campaigns/camp1/encounters/current'), { round: 9 }));
  });

  it('un jugador no lee la ficha completa de los enemigos (gmCombatants)', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await assertSucceeds(setDoc(doc(db('gm'), 'campaigns/camp1/encounters/current/gmCombatants/e1'), { currentHp: 30 }));
    await assertFails(getDoc(doc(db('alice'), 'campaigns/camp1/encounters/current/gmCombatants/e1')));
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/encounters/current/gmCombatants/e2'), { currentHp: 1 }));
  });

  it('vista pública: la leen todos; el jugador solo toca la iniciativa de su propio PJ', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await seed(['characters', 'c2'], baseChar('bob', ['camp1']));
    const pub = 'campaigns/camp1/encounters/current/combatants/';
    await assertSucceeds(setDoc(doc(db('gm'), pub + 'e1'), { kind: 'enemy', name: 'Goon', initiative: 12, woundState: 'Sin heridas' }));
    await assertSucceeds(getDoc(doc(db('bob'), pub + 'e1')));
    await assertFails(updateDoc(doc(db('alice'), pub + 'e1'), { initiative: 1 }));
    // Se suma con su PJ y cambia su iniciativa.
    const pc = { kind: 'pc', name: 'Vex', initiative: 15, charId: 'c1', ownerUid: 'alice' };
    await assertSucceeds(setDoc(doc(db('alice'), pub + 'pc-c1'), pc));
    await assertSucceeds(updateDoc(doc(db('alice'), pub + 'pc-c1'), { initiative: 18 }));
    await assertFails(updateDoc(doc(db('alice'), pub + 'pc-c1'), { name: 'Otro' }));
    // No con la ficha de otro, ni con un id que no corresponde, ni tocando el PJ de otro.
    await assertFails(setDoc(doc(db('alice'), pub + 'pc-c2'), { ...pc, charId: 'c2' }));
    await assertFails(setDoc(doc(db('alice'), pub + 'pc-x'), pc));
    await assertFails(updateDoc(doc(db('bob'), pub + 'pc-c1'), { initiative: 1 }));
    // El GM corrige cualquier iniciativa.
    await assertSucceeds(updateDoc(doc(db('gm'), pub + 'pc-c1'), { initiative: 10 }));
  });
});

// v5.10.0 (plan 24): pasarle una ficha a otro jugador con un código de 24 h. [Claude Code · 2026-11-04]
describe('traspaso de fichas (plan 24)', () => {
  const CODE = 'K7P4QX9M2R';
  const inHours = (h: number) => Timestamp.fromMillis(Date.now() + h * 3600_000);
  const transfer = (over: Record<string, unknown> = {}) => ({
    charId: 'c1', fromUid: 'alice', fromName: 'Alice', handle: 'Vex', role: 'Nomad', roleRank: 4,
    createdAt: Timestamp.now(), expiresAt: inHours(24), ...over,
  });
  // Lo que hace el que recibe: un solo updateDoc con el dueño nuevo, sin código y con sus campos de escritor.
  const claim = (fs: Firestore, uidW: string, campaignIds: string[] = []) => updateDoc(
    doc(fs, 'characters', 'c1'),
    'ownerUid', uidW.split('_')[0],
    'transferCode', deleteField(),
    'campaignIds', campaignIds,
    new FieldPath('_w', uidW), serverTimestamp(),
    '_lastWriter', uidW,
    '_ts', serverTimestamp(),
  );

  it('el dueño crea el código de su ficha; nadie lo crea para una ficha ajena ni por más de 24 h', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await assertSucceeds(setDoc(doc(db('alice'), 'transfers', CODE), transfer()));
    await assertFails(setDoc(doc(db('bob'), 'transfers', 'AAAAABBBBB'), transfer({ fromUid: 'bob' })));
    await assertFails(setDoc(doc(db('alice'), 'transfers', 'CCCCCDDDDD'), transfer({ expiresAt: inHours(48) })));
    await assertFails(setDoc(doc(db('alice'), 'transfers', 'CORTO'), transfer()));
    await assertFails(setDoc(doc(db('alice'), 'transfers', 'EEEEEFFFFF'), transfer({ extra: 1 })));
  });

  it('con sesión se lee un código; nadie lista los códigos; el que lo creó lo cancela', async () => {
    await seed(['characters', 'c1'], baseChar('alice'));
    await seed(['transfers', CODE], transfer());
    await assertSucceeds(getDoc(doc(db('bob'), 'transfers', CODE)));
    await assertFails(getDoc(doc(anon(), 'transfers', CODE)));
    await assertFails(getDocs(collection(db('bob'), 'transfers')));
    await assertFails(deleteDoc(doc(db('bob'), 'transfers', CODE)));
    await assertSucceeds(deleteDoc(doc(db('alice'), 'transfers', CODE)));
  });

  it('otro jugador recibe la ficha con el código correcto; después la lee y el viejo dueño no', async () => {
    await seed(['characters', 'c1'], { ...baseChar('alice'), transferCode: CODE });
    await seed(['transfers', CODE], transfer());
    await assertSucceeds(claim(db('bob'), 'bob_dev1'));
    await assertSucceeds(getDoc(doc(db('bob'), 'characters/c1')));
    await assertFails(getDoc(doc(db('alice'), 'characters/c1')));
    // El nuevo dueño borra el código usado.
    await assertSucceeds(deleteDoc(doc(db('bob'), 'transfers', CODE)));
  });

  it('no se recibe con código vencido, de otra ficha, sin código en la ficha, ni cambiando otros campos', async () => {
    await seed(['characters', 'c1'], { ...baseChar('alice'), transferCode: CODE });
    await seed(['transfers', CODE], transfer({ expiresAt: Timestamp.fromMillis(Date.now() - 1000) }));
    await assertFails(claim(db('bob'), 'bob_dev1'));

    await seed(['transfers', CODE], transfer({ charId: 'otra' }));
    await assertFails(claim(db('bob'), 'bob_dev1'));

    await seed(['transfers', CODE], transfer());
    await assertFails(updateDoc(
      doc(db('bob'), 'characters', 'c1'),
      'ownerUid', 'bob', 'transferCode', deleteField(), 'campaignIds', [], 'currentHp', 1,
      new FieldPath('_w', 'bob_dev1'), serverTimestamp(), '_lastWriter', 'bob_dev1', '_ts', serverTimestamp(),
    ));
    // Ponerse otro dueño que no sea uno mismo, tampoco.
    await assertFails(updateDoc(
      doc(db('bob'), 'characters', 'c1'),
      'ownerUid', 'carol', 'transferCode', deleteField(), 'campaignIds', [],
      new FieldPath('_w', 'bob_dev1'), serverTimestamp(), '_lastWriter', 'bob_dev1', '_ts', serverTimestamp(),
    ));

    await seed(['characters', 'c1'], baseChar('alice'));
    await assertFails(claim(db('bob'), 'bob_dev1'));
  });

  it('la ficha sigue en la campaña si el que la recibe es miembro; si no, tiene que salir', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], { ...baseChar('gm', ['camp1']), transferCode: CODE });
    await seed(['transfers', CODE], transfer({ fromUid: 'gm' }));
    await assertFails(claim(db('carol'), 'carol_dev1', ['camp1']));
    await assertSucceeds(claim(db('bob'), 'bob_dev1', ['camp1']));
    // El GM la sigue viendo como ficha de un jugador de su campaña.
    await assertSucceeds(getDoc(doc(db('gm'), 'characters/c1')));
  });

  it('un no miembro la recibe sacándola de la campaña', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], { ...baseChar('gm', ['camp1']), transferCode: CODE });
    await seed(['transfers', CODE], transfer({ fromUid: 'gm' }));
    await assertSucceeds(claim(db('carol'), 'carol_dev1', []));
  });

  it('tras el traspaso, el nuevo dueño republica el resumen de party con su ownerUid; otro no', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], baseChar('bob', ['camp1']));
    await seed(['campaigns', 'camp1', 'party', 'c1'], { ownerUid: 'gm', handle: 'Vex', currentHp: 30 });
    await assertFails(setDoc(doc(db('alice'), 'campaigns/camp1/party/c1'), { ownerUid: 'alice', handle: 'Vex', currentHp: 30 }));
    await assertSucceeds(setDoc(doc(db('bob'), 'campaigns/camp1/party/c1'), { ownerUid: 'bob', handle: 'Vex', currentHp: 30 }));
  });
});

// v5.11.0 (plan 25): fichas fijas en la nube y fichas de NPC. [Claude Code · 2026-11-05]
describe('fichas fijas y NPC (plan 25)', () => {
  it('nadie borra una ficha de la nube, ni el dueño ni el GM', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await assertFails(deleteDoc(doc(db('alice'), 'characters/c1')));
    await assertFails(deleteDoc(doc(db('gm'), 'characters/c1')));
  });

  it('una ficha de jugador queda en su campaña mientras el dueño es miembro', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['campaigns', 'camp2'], { ...camp, memberUids: ['gm', 'alice'] });
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await assertFails(updateAs(db('alice'), 'c1', 'alice_dev1', 'campaignIds', []));
    await assertFails(updateAs(db('alice'), 'c1', 'alice_dev2', 'campaignIds', ['camp2']));
  });

  it('cuando el dueño salió (o lo echaron, o se borró la campaña) la libera o la pasa a otra', async () => {
    await seed(['campaigns', 'camp1'], { ...camp, memberUids: ['gm', 'bob'] });
    await seed(['campaigns', 'camp2'], { ...camp, memberUids: ['gm', 'alice'] });
    await seed(['characters', 'c1'], baseChar('alice', ['camp1']));
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev1', 'campaignIds', []));
    await seed(['characters', 'c2'], baseChar('alice', ['camp1']));
    await assertSucceeds(updateAs(db('alice'), 'c2', 'alice_dev1', 'campaignIds', ['camp2']));
    await seed(['characters', 'c3'], baseChar('alice', ['borrada']));
    await assertSucceeds(updateAs(db('alice'), 'c3', 'alice_dev1', 'campaignIds', []));
  });

  it('una ficha de NPC, o la del GM en su propia campaña, se mueve libre', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'c1'], { ...baseChar('alice', ['camp1']), sheetKind: 'npc' });
    await assertSucceeds(updateAs(db('alice'), 'c1', 'alice_dev1', 'campaignIds', []));
    await seed(['characters', 'c2'], baseChar('gm', ['camp1']));
    await assertSucceeds(updateAs(db('gm'), 'c2', 'gm_dev1', 'campaignIds', []));
  });

  it('el resumen de party de una ficha de NPC se rechaza; el de una de jugador no', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'npc1'], { ...baseChar('gm', ['camp1']), sheetKind: 'npc' });
    await assertFails(setDoc(doc(db('gm'), 'campaigns/camp1/party/npc1'), { ownerUid: 'gm', handle: 'Jefe', currentHp: 40 }));
    await seed(['characters', 'c1'], { ...baseChar('alice', ['camp1']), sheetKind: 'player' });
    await assertSucceeds(setDoc(doc(db('alice'), 'campaigns/camp1/party/c1'), { ownerUid: 'alice', handle: 'Vex', currentHp: 30 }));
  });

  it('un jugador no lee la ficha de NPC del GM', async () => {
    await seed(['campaigns', 'camp1'], camp);
    await seed(['characters', 'npc1'], { ...baseChar('gm'), sheetKind: 'npc' });
    await assertFails(getDoc(doc(db('alice'), 'characters/npc1')));
    await assertSucceeds(getDoc(doc(db('gm'), 'characters/npc1')));
  });
});
