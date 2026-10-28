// [Claude Code · 2026-10-21] Persistencia robusta de personajes (v4.8.0): migraciones versionadas,
// almacenamiento seguro, canal de avisos y respaldo completo. TS puro, sin React.
import { createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { CharacterSheet, IpLogEntry } from '../types/cyberpunk';
import { IP_LOG_MAX, capIpLog } from '../engine/ipLedger';
import coreRulesPack from '../data/core-rules.cprpack.json';
import { FBC_16_CYBERWARE } from '../data/goingMetalFbcData';
import { MARTIAL_ARTS_FORMS } from '../data/cyberfistsMartialArtsData';
import { applyFolioAllocation } from '../data/folioRoleAllocations';

export const CHARACTERS_STORAGE_KEY = 'cpr-omni-deck-characters-v2';
export const CHARACTERS_SCHEMA_VERSION = 6;
// No existe una constante de versión en la app; la última entrada del changelog in-app es v4.7.0 y este trabajo es v4.8.0.
export const APP_VERSION = 'v5.2.0';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Canal de avisos
// ---------------------------------------------------------------------------
type WarningListener = (message: string) => void;
const warningListeners = new Set<WarningListener>();
const lastWarnings: string[] = [];

export function emitPersistenceWarning(message: string): void {
  lastWarnings.push(message);
  warningListeners.forEach((cb) => {
    try {
      cb(message);
    } catch {
      // un listener roto no debe romper la persistencia
    }
  });
}

export function onPersistenceWarning(cb: WarningListener): () => void {
  warningListeners.add(cb);
  return () => {
    warningListeners.delete(cb);
  };
}

export function getPersistenceWarnings(): string[] {
  return [...lastWarnings];
}

export function clearPersistenceWarnings(): void {
  lastWarnings.length = 0;
}

// ---------------------------------------------------------------------------
// Catálogo de ciberware conocido (mismas fuentes que usan el Ripperdoc y el store:
// coreRulesPack.cyberware + FBC_16_CYBERWARE)
// ---------------------------------------------------------------------------
const KNOWN_CYBERWARE_IDS = new Set<string>([
  ...(coreRulesPack.cyberware as { id: string }[]).map((cw) => cw.id),
  ...FBC_16_CYBERWARE.map((cw) => cw.id)
]);

export function isKnownCyberwareId(id: string): boolean {
  return KNOWN_CYBERWARE_IDS.has(id);
}

// ---------------------------------------------------------------------------
// Migraciones: la clave N migra de N a N+1
// ---------------------------------------------------------------------------
// v4.9.7 [Claude Code · 2026-10-24]: claves donde van los movimientos viejos que superan los topes (incluidas en la copia de seguridad).
export const IP_LOG_ARCHIVE_KEY = 'cpr_ip_log_archive_v1';
export const SPEEDHEAL_ARCHIVE_KEY = 'cpr_speedheal_archive_v1';

export function archiveIpLogEntries(characterId: string, handle: string, entries: IpLogEntry[]): void {
  if (entries.length === 0) return;
  try {
    let map: Record<string, IpLogEntry[]> = {};
    try {
      const raw = localStorage.getItem(IP_LOG_ARCHIVE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) map = parsed;
    } catch {
      map = {};
    }
    const prev = Array.isArray(map[characterId]) ? map[characterId] : [];
    map[characterId] = [...prev, ...entries];
    localStorage.setItem(IP_LOG_ARCHIVE_KEY, JSON.stringify(map));
    emitPersistenceWarning(`Historial de IP de ${handle || characterId}: ${entries.length} movimiento(s) viejo(s) pasaron a la copia de seguridad (límite ${IP_LOG_MAX}). Descargá la copia de seguridad desde Street Lab para conservarlos.`);
  } catch {
    emitPersistenceWarning(`Historial de IP de ${handle || characterId}: no se pudo guardar el archivo de ${entries.length} movimiento(s) viejo(s) (sin espacio en el navegador). Descargá la copia de seguridad cuanto antes.`);
  }
}

export function archiveSpeedhealEntries(entries: unknown[]): void {
  if (entries.length === 0) return;
  try {
    let arr: unknown[] = [];
    try {
      const raw = localStorage.getItem(SPEEDHEAL_ARCHIVE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      arr = [];
    }
    localStorage.setItem(SPEEDHEAL_ARCHIVE_KEY, JSON.stringify([...arr, ...entries]));
    emitPersistenceWarning(`Registro de Speedheal: ${entries.length} uso(s) viejo(s) pasaron a la copia de seguridad (límite 500). Descargá la copia de seguridad desde Street Lab para conservarlos.`);
  } catch {
    emitPersistenceWarning(`Registro de Speedheal: no se pudo guardar el archivo de ${entries.length} uso(s) viejo(s) (sin espacio en el navegador). Descargá la copia de seguridad cuanto antes.`);
  }
}

export const MIGRATIONS: Record<number, (state: any) => any> = {
  // v0 -> v1: solo agrega campos opcionales (deathSavePenalty, isDead, preFbc*Armor); no hace falta transformar.
  0: (state) => state,
  // v1 -> v2
  1: (state) => {
    // v4.5.1: formas de artes marciales inventadas eliminadas (IR4 canon)
    if (state && typeof state === 'object') {
      const validFormIds = new Set(MARTIAL_ARTS_FORMS.map((f) => f.id));
      if (Array.isArray(state.characters)) {
        state.characters = state.characters.map((c: any) => {
          const cleaned = { ...c };
          if (c.knownMartialArts && typeof c.knownMartialArts === 'object') {
            cleaned.knownMartialArts = Object.fromEntries(
              Object.entries(c.knownMartialArts).filter(([formId]) => validFormIds.has(formId))
            );
          }
          if (Array.isArray(c.ownedMartialArtChips)) {
            cleaned.ownedMartialArtChips = c.ownedMartialArtChips.filter((formId: string) => validFormIds.has(formId));
          }
          if (Array.isArray(c.equippedMartialArtChips)) {
            cleaned.equippedMartialArtChips = c.equippedMartialArtChips.filter((formId: string) => validFormIds.has(formId));
          }
          return cleaned;
        });
      }
    }
    return state;
  },
  // v2 -> v3
  2: (state) => {
    if (!state || typeof state !== 'object' || !Array.isArray(state.characters)) return state;
    state.characters = state.characters.map((c: any) => {
      if (!c || typeof c !== 'object') return c;
      const updated = { ...c };
      // (a) sanitización legacy (antes vivía en merge)
      if (updated.improvementPoints === undefined) {
        updated.improvementPoints = 120;
      }
      if ((updated.skills?.martialArts || 0) > 0 && (!updated.knownMartialArts || Object.keys(updated.knownMartialArts).length === 0)) {
        updated.knownMartialArts = { karate: updated.skills.martialArts };
      }
      if (!updated.ownedMartialArtChips) {
        updated.ownedMartialArtChips = [];
      }
      if (!updated.equippedMartialArtChips) {
        updated.equippedMartialArtChips = [];
      }
      // (b) ciberware huérfano: ids que ya no existen en el catálogo
      const removed: string[] = [];
      if (Array.isArray(updated.installedCyberwareIds)) {
        updated.installedCyberwareIds = updated.installedCyberwareIds.filter((id: unknown) => {
          const ok = typeof id === 'string' && isKnownCyberwareId(id);
          if (!ok) removed.push(String(id));
          return ok;
        });
      }
      if (Array.isArray(updated.empDisabledCyberwareIds)) {
        updated.empDisabledCyberwareIds = updated.empDisabledCyberwareIds.filter((id: unknown) => {
          const ok = typeof id === 'string' && isKnownCyberwareId(id);
          if (!ok && !removed.includes(String(id))) removed.push(String(id));
          return ok;
        });
      }
      if (removed.length > 0) {
        const lines = removed.map((id) => `[v4.8.0] Ciberware que ya no existe en el catálogo, quitado: ${id}`);
        const prev = typeof updated.notes === 'string' && updated.notes.length > 0 ? `${updated.notes}\n` : '';
        updated.notes = prev + lines.join('\n');
      }
      return updated;
    });
    return state;
  },
  // v3 -> v4 (v4.9.1 [Claude Code · 2026-10-22]): variante CEMK -> Core, reparto de los Folios e historial de IP.
  3: (state) => {
    if (!state || typeof state !== 'object' || !Array.isArray(state.characters)) return state;
    state.characters = state.characters.map((c: any) => {
      if (!c || typeof c !== 'object') return c;
      let updated = { ...c };
      if (updated.roleAbilityVariant === 'cemk') {
        updated.roleAbilityVariant = 'core';
      }
      if ((typeof updated.id === 'string' && updated.id.startsWith('cemk-folio-')) || updated.sourceFolioId) {
        updated = applyFolioAllocation(updated as CharacterSheet, updated.sourceFolioId ?? updated.id);
      }
      if (!updated.ipLog) {
        const ip = typeof updated.improvementPoints === 'number' ? updated.improvementPoints : 0;
        updated.ipLog = ip > 0
          ? [{ id: 'ip-initial', at: new Date().toISOString(), kind: 'initial', delta: ip, reason: 'Saldo previo a v4.9.1', balanceAfter: ip }]
          : [];
      }
      return updated;
    });
    return state;
  },
  // v4 -> v5 (v4.9.4 [Claude Code · 2026-10-23]): Thorn del Folio guarda BODY base 8; el Grafted Muscle (Core p.114) pone el +2 en el motor.
  4: (state) => {
    if (!state || typeof state !== 'object' || !Array.isArray(state.characters)) return state;
    state.characters = state.characters.map((c: any) => {
      if (!c || typeof c !== 'object') return c;
      if (
        c.id === 'cemk-folio-thorn' &&
        c.stats?.BODY === 10 &&
        Array.isArray(c.installedCyberwareIds) &&
        c.installedCyberwareIds.includes('cw-cemk-grafted-muscle')
      ) {
        return { ...c, stats: { ...c.stats, BODY: 8 } };
      }
      return c;
    });
    return state;
  },
  // v5 -> v6 (v4.9.7 [Claude Code · 2026-10-24]): freno de 2.000 en el historial de IP.
  5: (state) => {
    if (!state || typeof state !== 'object' || !Array.isArray(state.characters)) return state;
    state.characters = state.characters.map((c: any) => {
      if (!c || typeof c !== 'object') return c;
      if (!Array.isArray(c.ipLog) || c.ipLog.length <= IP_LOG_MAX) return c;
      const capped = capIpLog(c.ipLog, c.ipLogArchivedTotals);
      archiveIpLogEntries(c.id, c.handle, capped.archived);
      return { ...c, ipLog: capped.log, ipLogArchivedTotals: capped.archivedTotals };
    });
    return state;
  }
};

export function runMigrations(state: unknown, fromVersion: number): { state: any; warnings: string[] } {
  const warnings: string[] = [];
  let current: any = state;
  const start = typeof fromVersion === 'number' && Number.isFinite(fromVersion) && fromVersion >= 0 ? Math.floor(fromVersion) : 0;
  for (let v = start; v < CHARACTERS_SCHEMA_VERSION; v++) {
    const step = MIGRATIONS[v];
    if (!step) continue;
    try {
      // cada paso trabaja sobre una copia para poder conservar el estado previo si falla
      const snapshot = cloneState(current);
      current = step(snapshot);
    } catch (err) {
      warnings.push(`Falló la migración ${v} -> ${v + 1}; se conservó el estado previo (${err instanceof Error ? err.message : String(err)}).`);
    }
  }
  return { state: current, warnings };
}

function cloneState<T>(value: T): T {
  try {
    if (typeof structuredClone === 'function') return structuredClone(value);
  } catch {
    // cae al clon JSON
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

// ---------------------------------------------------------------------------
// Almacenamiento seguro
// ---------------------------------------------------------------------------
export const safeCharacterStateStorage: StateStorage = {
  getItem: (name) => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(name);
    } catch {
      return null;
    }
    if (raw === null) return null;
    try {
      JSON.parse(raw);
      return raw;
    } catch {
      const corruptKey = `cpr-omni-deck-corrupt-${new Date().toISOString()}`;
      try {
        localStorage.setItem(corruptKey, raw);
      } catch {
        // sin espacio para copiar; seguimos
      }
      emitPersistenceWarning(`Los datos guardados estaban corruptos. Se guardó una copia en "${corruptKey}" y se arrancó con los personajes por defecto.`);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      emitPersistenceWarning('Sin espacio en el navegador: exportá un respaldo y borrá personajes que no uses');
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // ignorar
    }
  }
};

export const safeCharacterStorage = createJSONStorage<any>(() => safeCharacterStateStorage);

export function backupRawBeforeMigration(fromVersion: number): void {
  try {
    const raw = localStorage.getItem(CHARACTERS_STORAGE_KEY);
    if (raw === null) return;
    const backupKey = `cpr-omni-deck-backup-v${fromVersion}`;
    if (localStorage.getItem(backupKey) !== null) return;
    localStorage.setItem(backupKey, raw);
  } catch {
    // el respaldo previo es un extra; nunca debe romper la migración
  }
}

// ---------------------------------------------------------------------------
// Premades
// ---------------------------------------------------------------------------
// Re-inyecta los premades que faltan, salvo los descartados (por id o por handle en minúsculas).
export function injectPremades(
  characters: CharacterSheet[],
  dismissedPremadeIds: string[],
  folios: CharacterSheet[],
  cemkChars: CharacterSheet[]
): CharacterSheet[] {
  const dismissed = new Set(dismissedPremadeIds.map((d) => d.toLowerCase()));
  const merged = [...characters];
  const existingIds = new Set(merged.map((c) => c.id));

  for (const folio of folios) {
    if (dismissed.has(folio.id.toLowerCase())) continue;
    if (!existingIds.has(folio.id)) {
      merged.push({ ...folio });
      existingIds.add(folio.id);
    }
  }

  const existingHandles = new Set(merged.map((c) => c.handle.toLowerCase()));
  for (const cemk of cemkChars) {
    if (dismissed.has(cemk.id.toLowerCase()) || dismissed.has(cemk.handle.toLowerCase())) continue;
    if (!existingHandles.has(cemk.handle.toLowerCase())) {
      merged.push(cemk);
      existingHandles.add(cemk.handle.toLowerCase());
    }
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Respaldo completo
// ---------------------------------------------------------------------------
export const BACKUP_FORMAT = 'cpr-omni-deck-backup';
export const BACKUP_EXTRA_KEYS = [
  'cpr_custom_npcs_v1',
  'cpr_active_encounter_v1',
  'cpr_encounter_v1',
  'cpr_gm_secret_notes_v1',
  'cpr_custom_net_arch_v1',
  'cpr-omni-deck-combat-v2',
  'cpr_enemy_sheet_mode_v1',
  'cpr_creator_novice_v1',
  IP_LOG_ARCHIVE_KEY,
  SPEEDHEAL_ARCHIVE_KEY
];

export interface BackupFile {
  format: string;
  schemaVersion: number;
  exportedAt: string;
  appVersion: string;
  characters: {
    characters: CharacterSheet[];
    activeCharacterId: string;
    dismissedPremadeIds: string[];
  };
  extras: Record<string, string | null>;
}

export function buildFullBackup(
  charactersState: { characters: CharacterSheet[]; activeCharacterId: string; dismissedPremadeIds?: string[] },
  appVersion: string
): BackupFile {
  const extras: Record<string, string | null> = {};
  for (const key of BACKUP_EXTRA_KEYS) {
    try {
      extras[key] = localStorage.getItem(key);
    } catch {
      extras[key] = null;
    }
  }
  return {
    format: BACKUP_FORMAT,
    schemaVersion: CHARACTERS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion,
    characters: {
      characters: charactersState.characters,
      activeCharacterId: charactersState.activeCharacterId,
      dismissedPremadeIds: charactersState.dismissedPremadeIds ?? []
    },
    extras
  };
}

export type ParsedBackup =
  | {
      ok: true;
      characters: CharacterSheet[];
      activeCharacterId: string | null;
      dismissedPremadeIds: string[];
      extras: Record<string, string | null>;
      warnings: string[];
    }
  | { ok: false; error: string };

function isPlainObject(v: unknown): v is Record<string, any> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function looksLikeCharacter(v: unknown): boolean {
  return isPlainObject(v) && ('stats' in v || 'handle' in v) && 'id' in v;
}

function isValidCharacter(c: any): boolean {
  return (
    isPlainObject(c) &&
    typeof c.id === 'string' && c.id.length > 0 &&
    typeof c.handle === 'string' && c.handle.length > 0 &&
    isPlainObject(c.stats) &&
    isPlainObject(c.skills)
  );
}

export function parseFullBackup(text: string): ParsedBackup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' };
  }

  let rawChars: unknown[] = [];
  let activeCharacterId: string | null = null;
  let dismissedPremadeIds: string[] = [];
  let extras: Record<string, string | null> = {};
  let fromVersion = 0;
  const warnings: string[] = [];

  if (isPlainObject(data) && data.format === BACKUP_FORMAT) {
    const block = data.characters;
    if (!isPlainObject(block) || !Array.isArray(block.characters)) {
      return { ok: false, error: 'El respaldo no contiene la lista de personajes.' };
    }
    rawChars = block.characters;
    activeCharacterId = typeof block.activeCharacterId === 'string' ? block.activeCharacterId : null;
    dismissedPremadeIds = Array.isArray(block.dismissedPremadeIds)
      ? block.dismissedPremadeIds.filter((x: unknown): x is string => typeof x === 'string')
      : [];
    fromVersion = typeof data.schemaVersion === 'number' ? data.schemaVersion : 0;
    if (isPlainObject(data.extras)) {
      for (const key of BACKUP_EXTRA_KEYS) {
        const val = data.extras[key];
        if (typeof val === 'string') extras[key] = val;
        else if (val === null) extras[key] = null;
      }
    }
  } else if (Array.isArray(data) && data.length > 0 && data.every(looksLikeCharacter)) {
    rawChars = data;
  } else if (looksLikeCharacter(data)) {
    rawChars = [data];
  } else {
    return { ok: false, error: 'Formato no reconocido: no es un respaldo ni una ficha.' };
  }

  if (typeof fromVersion === 'number' && fromVersion > CHARACTERS_SCHEMA_VERSION) {
    warnings.push(`El archivo es de una versión más nueva (esquema ${fromVersion}); puede que se pierdan datos.`);
  }

  const migrated = runMigrations({ characters: rawChars }, fromVersion);
  warnings.push(...migrated.warnings);
  const migratedChars: unknown[] = Array.isArray(migrated.state?.characters) ? migrated.state.characters : [];

  const characters: CharacterSheet[] = [];
  migratedChars.forEach((c, i) => {
    if (isValidCharacter(c)) {
      characters.push(c as CharacterSheet);
    } else {
      const label = isPlainObject(c) && typeof c.handle === 'string' ? c.handle : `#${i + 1}`;
      warnings.push(`Ficha descartada por inválida: ${label}`);
    }
  });

  if (characters.length === 0) {
    return { ok: false, error: 'No se encontró ninguna ficha válida en el archivo.' };
  }

  if (!isPlainObject(data) || data.format !== BACKUP_FORMAT) extras = {};

  return { ok: true, characters, activeCharacterId, dismissedPremadeIds, extras, warnings };
}
