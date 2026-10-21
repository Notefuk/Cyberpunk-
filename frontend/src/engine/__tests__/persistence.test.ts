// [Claude Code · 2026-10-21] Tests de persistencia v4.8.0: migraciones, almacenamiento seguro y respaldo completo.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BACKUP_EXTRA_KEYS,
  BACKUP_FORMAT,
  CHARACTERS_SCHEMA_VERSION,
  CHARACTERS_STORAGE_KEY,
  backupRawBeforeMigration,
  buildFullBackup,
  clearPersistenceWarnings,
  getPersistenceWarnings,
  injectPremades,
  onPersistenceWarning,
  parseFullBackup,
  runMigrations,
  safeCharacterStateStorage
} from '../../store/persistence';
import coreRulesPack from '../../data/core-rules.cprpack.json';

class MemoryStorage {
  data = new Map<string, string>();
  quotaFull = false;
  getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
  setItem(k: string, v: string) {
    if (this.quotaFull) {
      const err = new Error('quota');
      err.name = 'QuotaExceededError';
      throw err;
    }
    this.data.set(k, v);
  }
  removeItem(k: string) { this.data.delete(k); }
  get keys() { return [...this.data.keys()]; }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal('localStorage', storage);
  clearPersistenceWarnings();
});

const knownCyberId = (coreRulesPack.cyberware as { id: string }[])[0].id;

function makeChar(over: Record<string, unknown> = {}): any {
  return {
    id: 'c1',
    handle: 'Test',
    stats: { INT: 5 },
    skills: { brawling: 2 },
    installedCyberwareIds: [knownCyberId, 'cyberware-fantasma'],
    empDisabledCyberwareIds: ['cyberware-fantasma'],
    notes: 'nota previa',
    customField: 'se conserva',
    ...over
  };
}

describe('runMigrations', () => {
  it.each([0, 1, 2])('migra desde v%i a v3 conservando personajes y campos', (from) => {
    const { state, warnings } = runMigrations({ characters: [makeChar(), makeChar({ id: 'c2', handle: 'Dos' })], activeCharacterId: 'c1' }, from);
    expect(warnings).toEqual([]);
    expect(state.characters).toHaveLength(2);
    expect(state.activeCharacterId).toBe('c1');
    expect(state.characters[0].customField).toBe('se conserva');
    expect(state.characters[0].improvementPoints).toBe(120);
    expect(state.characters[0].ownedMartialArtChips).toEqual([]);
    expect(state.characters[0].equippedMartialArtChips).toEqual([]);
  });

  it('quita ciberware huérfano y deja una nota', () => {
    const { state } = runMigrations({ characters: [makeChar()] }, 2);
    const c = state.characters[0];
    expect(c.installedCyberwareIds).toEqual([knownCyberId]);
    expect(c.empDisabledCyberwareIds).toEqual([]);
    expect(c.notes).toContain('nota previa');
    expect(c.notes).toContain('[v4.8.0] Ciberware que ya no existe en el catálogo, quitado: cyberware-fantasma');
  });

  it('limpia artes marciales inventadas (v<2) y mueve skills.martialArts a karate', () => {
    const { state } = runMigrations({
      characters: [makeChar({
        knownMartialArts: { inventada: 3 },
        ownedMartialArtChips: ['inventada'],
        equippedMartialArtChips: ['inventada'],
        skills: { martialArts: 4 }
      })]
    }, 0);
    const c = state.characters[0];
    expect(c.ownedMartialArtChips).toEqual([]);
    expect(c.equippedMartialArtChips).toEqual([]);
    expect(c.knownMartialArts).toEqual({ karate: 4 });
  });

  it.each([null, undefined, 'texto', 42, { characters: 'x' }, { characters: [null, 5] }])('no lanza con basura: %j', (garbage) => {
    expect(() => runMigrations(garbage, 0)).not.toThrow();
    expect(() => runMigrations(garbage, 2)).not.toThrow();
    expect(() => runMigrations(garbage, NaN)).not.toThrow();
  });
});

describe('safeCharacterStateStorage', () => {
  it('JSON corrupto: copia el raw a cpr-omni-deck-corrupt-*, avisa y devuelve null', () => {
    const listener = vi.fn();
    const off = onPersistenceWarning(listener);
    storage.setItem(CHARACTERS_STORAGE_KEY, '{no es json');
    expect(safeCharacterStateStorage.getItem(CHARACTERS_STORAGE_KEY)).toBeNull();
    const corruptKey = storage.keys.find((k) => k.startsWith('cpr-omni-deck-corrupt-'));
    expect(corruptKey).toBeDefined();
    expect(storage.getItem(corruptKey!)).toBe('{no es json');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(getPersistenceWarnings()).toHaveLength(1);
    off();
  });

  it('JSON válido se devuelve igual', () => {
    storage.setItem(CHARACTERS_STORAGE_KEY, '{"a":1}');
    expect(safeCharacterStateStorage.getItem(CHARACTERS_STORAGE_KEY)).toBe('{"a":1}');
  });

  it('error de cuota: avisa y no lanza', () => {
    const listener = vi.fn();
    const off = onPersistenceWarning(listener);
    storage.quotaFull = true;
    expect(() => safeCharacterStateStorage.setItem(CHARACTERS_STORAGE_KEY, 'x')).not.toThrow();
    expect(listener).toHaveBeenCalledWith(expect.stringContaining('Sin espacio en el navegador'));
    off();
  });

  it('backupRawBeforeMigration copia una sola vez', () => {
    storage.setItem(CHARACTERS_STORAGE_KEY, '{"v":1}');
    backupRawBeforeMigration(1);
    storage.setItem(CHARACTERS_STORAGE_KEY, '{"v":2}');
    backupRawBeforeMigration(1);
    expect(storage.getItem('cpr-omni-deck-backup-v1')).toBe('{"v":1}');
  });
});

describe('respaldo completo', () => {
  it('buildFullBackup -> parseFullBackup conserva fichas, activo, descartados y extras', () => {
    const chars = [makeChar({ installedCyberwareIds: [knownCyberId], empDisabledCyberwareIds: [] }), makeChar({ id: 'c2', handle: 'Dos', installedCyberwareIds: [], empDisabledCyberwareIds: [] })];
    storage.setItem('cpr_custom_npcs_v1', '[1,2]');
    const backup = buildFullBackup({ characters: chars, activeCharacterId: 'c2', dismissedPremadeIds: ['x'] }, 'v4.8.0');
    expect(backup.format).toBe(BACKUP_FORMAT);
    expect(backup.schemaVersion).toBe(CHARACTERS_SCHEMA_VERSION);
    expect(Object.keys(backup.extras)).toEqual(BACKUP_EXTRA_KEYS);
    const parsed = parseFullBackup(JSON.stringify(backup));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.characters.map((c) => c.id)).toEqual(['c1', 'c2']);
    expect(parsed.characters[0]).toMatchObject({ id: 'c1', handle: 'Test', customField: 'se conserva', notes: 'nota previa' });
    expect(parsed.activeCharacterId).toBe('c2');
    expect(parsed.dismissedPremadeIds).toEqual(['x']);
    expect(parsed.extras['cpr_custom_npcs_v1']).toBe('[1,2]');
  });

  it('acepta una ficha suelta y un arreglo de fichas', () => {
    const one = parseFullBackup(JSON.stringify(makeChar()));
    expect(one.ok && one.characters).toHaveLength(1);
    const many = parseFullBackup(JSON.stringify([makeChar(), makeChar({ id: 'c2', handle: 'Dos' })]));
    expect(many.ok && many.characters).toHaveLength(2);
  });

  it('acepta un respaldo con schemaVersion 2 y lo migra', () => {
    const old = {
      format: BACKUP_FORMAT,
      schemaVersion: 2,
      characters: { characters: [makeChar()], activeCharacterId: 'c1' },
      extras: {}
    };
    const parsed = parseFullBackup(JSON.stringify(old));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.characters[0].installedCyberwareIds).toEqual([knownCyberId]);
    expect(parsed.characters[0].improvementPoints).toBe(120);
  });

  it('descarta fichas inválidas con aviso', () => {
    const data = {
      format: BACKUP_FORMAT,
      schemaVersion: 3,
      characters: { characters: [makeChar(), { id: 'malo' }, null], activeCharacterId: 'c1' },
      extras: {}
    };
    const parsed = parseFullBackup(JSON.stringify(data));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.characters).toHaveLength(1);
    expect(parsed.warnings.filter((w) => w.includes('descartada'))).toHaveLength(2);
  });

  it('rechaza texto no JSON y formatos desconocidos', () => {
    expect(parseFullBackup('no json').ok).toBe(false);
    expect(parseFullBackup('{"hola":1}').ok).toBe(false);
    expect(parseFullBackup('null').ok).toBe(false);
  });
});

describe('injectPremades', () => {
  const folio = makeChar({ id: 'cemk-folio-x', handle: 'Folio X' });
  const cemk = makeChar({ id: 'char-cemk-david', handle: 'David Martinez' });

  it('inyecta los faltantes', () => {
    const out = injectPremades([], [], [folio], [cemk]);
    expect(out.map((c) => c.id)).toEqual(['cemk-folio-x', 'char-cemk-david']);
  });

  it('no re-inyecta los descartados (por id ni por handle)', () => {
    expect(injectPremades([], ['cemk-folio-x'], [folio], [cemk]).map((c) => c.id)).toEqual(['char-cemk-david']);
    expect(injectPremades([], ['david martinez'], [folio], [cemk]).map((c) => c.id)).toEqual(['cemk-folio-x']);
    expect(injectPremades([], ['char-cemk-david'], [folio], [cemk]).map((c) => c.id)).toEqual(['cemk-folio-x']);
  });

  it('no duplica los que ya existen', () => {
    const out = injectPremades([makeChar({ id: 'cemk-folio-x', handle: 'Folio X' })], [], [folio], [cemk]);
    expect(out.filter((c) => c.id === 'cemk-folio-x')).toHaveLength(1);
  });
});
