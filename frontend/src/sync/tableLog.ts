// v5.1.0 [Claude Code · 2026-10-27]: log de tiradas de la mesa (plan 19, punto 4; plan 17, decisión 1).
// Van a la mesa las tiradas de combate (ataque, daño, Death Save, iniciativa) y las que el jugador marca
// "Mostrar a la mesa". Se publica escuchando `rollHistory`, así no se tocan los 26 lugares que llaman a addRollEntry.
//   campaigns/{c}/log/{rollId}: id, _by, at, charId, handle, kind, label, detail?, total?  (solo creación)
import { create } from 'zustand';
import type { RollEntry } from '../types/cyberpunk';
import type { DeathSaveResult } from '../engine/characterEngine';

export type TableLogKind = 'attack' | 'damage' | 'skill' | 'initiative' | 'deathSave';

export const TABLE_LOG_LIMIT = 50;
export const TABLE_LOG_KEEP = 200;

export interface TableLogEntry {
  id: string;
  _by: string;
  charId?: string;
  handle: string;
  kind: TableLogKind;
  label: string;
  detail?: string;
  total?: number;
  /** Milisegundos (al leer); al escribir lo pone el servidor. */
  at?: number;
}

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export function isInitiativeRoll(e: RollEntry): boolean {
  return e.type === 'skill' && e.skillName === 'Iniciativa';
}

/** Va a la mesa sola: combate e iniciativa. Las demás, solo si el jugador la comparte. */
export function isAutoShared(e: RollEntry): boolean {
  return e.type === 'attack' || e.type === 'damage' || isInitiativeRoll(e);
}

/** Pasa una tirada del HUD a una entrada corta del log (con los topes de las reglas de Firestore). */
export function rollToLog(e: RollEntry, who: { uid: string; charId?: string; handle: string }): TableLogEntry {
  let kind: TableLogKind;
  let label: string;
  let detail: string | undefined;
  let total: number | undefined;
  if (e.type === 'attack') {
    kind = 'attack';
    label = `Ataque: ${e.weaponName}`;
    total = e.totalAttack;
    const parts = [e.targetDv != null ? `vs DV ${e.targetDv}` : '', e.isHit ? 'impacta' : 'falla', e.distanceLabel ?? ''];
    if (e.isCritSuccess) parts.push('crítico');
    if (e.isCritFail) parts.push('pifia');
    detail = parts.filter(Boolean).join(' · ');
  } else if (e.type === 'damage') {
    kind = 'damage';
    label = `Daño: ${e.weaponName}`;
    total = e.finalDamageTotal ?? e.baseDamageTotal;
    const dice = e.diceResults?.length ? `dados ${e.diceResults.join(', ')}` : '';
    detail = [dice, e.isCriticalInjuryTrigger ? 'herida crítica' : '', e.aimedShotLabel ?? ''].filter(Boolean).join(' · ');
  } else if (isInitiativeRoll(e)) {
    kind = 'initiative';
    label = 'Iniciativa';
    total = e.totalAttack;
    detail = e.penaltyBreakdown?.join(' · ');
  } else {
    kind = 'skill';
    label = e.skillName ? `${e.skillName}${e.weaponName && e.weaponName !== e.skillName ? ` (${e.weaponName})` : ''}` : e.weaponName;
    total = e.totalAttack;
    detail = e.penaltyBreakdown?.join(' · ');
  }
  const out: TableLogEntry = { id: e.id, _by: who.uid, handle: cut(who.handle || 'Sin nombre', 60), kind, label: cut(label, 120) };
  if (who.charId) out.charId = who.charId;
  if (detail) out.detail = cut(detail, 300);
  if (typeof total === 'number' && Number.isFinite(total)) out.total = total;
  return out;
}

export function deathSaveToLog(r: DeathSaveResult, who: { uid: string; charId?: string; handle: string }): TableLogEntry {
  const pen = r.basePenalty + r.accumulatedPenalty;
  const result = r.success ? 'sobrevive' : r.autoFail ? 'falla (10 natural)' : 'falla';
  const out: TableLogEntry = {
    id: `ds-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    _by: who.uid,
    handle: cut(who.handle || 'Sin nombre', 60),
    kind: 'deathSave',
    label: 'Death Save',
    detail: `d10 ${r.d10} + ${pen} = ${r.total} vs BODY ${r.deathSaveValue}: ${result} (Core p.188)`,
    total: r.total
  };
  if (who.charId) out.charId = who.charId;
  return out;
}

export interface TableLogAdapter {
  create(entry: TableLogEntry): Promise<void>;
  subscribe(cb: (entries: TableLogEntry[]) => void, onError?: (e: unknown) => void): () => void;
  /** GM: borra lo que pasa de las últimas `keep`. */
  trim(keep: number): Promise<number>;
}

/** Las últimas tiradas de la mesa activa (en memoria). */
export const useTableLog = create<{ entries: TableLogEntry[]; set: (e: TableLogEntry[]) => void }>()((set) => ({
  entries: [],
  set: (entries) => set({ entries })
}));

/**
 * Publicador: compara `rollHistory` (más nueva primero) con lo ya visto. Lo que había al arrancar no se publica.
 * `markShared` (el botón "Mostrar a la mesa") publica una tirada vieja que no era de combate.
 */
export function createTableLogPublisher(opts: {
  adapter: TableLogAdapter;
  who: () => { uid: string; charId?: string; handle: string };
  initial: RollEntry[];
  onError?: (e: unknown) => void;
}) {
  const seen = new Set(opts.initial.map((e) => e.id));
  const published = new Set<string>();

  const publish = (entry: TableLogEntry) => {
    if (published.has(entry.id)) return;
    published.add(entry.id);
    opts.adapter.create(entry).catch((e) => {
      published.delete(entry.id);
      opts.onError?.(e);
    });
  };

  return {
    /** Llamar con cada nuevo `rollHistory`. */
    onHistory(history: RollEntry[]): void {
      for (const e of history) {
        if (seen.has(e.id)) {
          if (e.shareWithTable && !published.has(e.id)) publish(rollToLog(e, opts.who()));
          continue;
        }
        seen.add(e.id);
        if (isAutoShared(e) || e.shareWithTable) publish(rollToLog(e, opts.who()));
      }
    },
    publishDeathSave(r: DeathSaveResult): void {
      publish(deathSaveToLog(r, opts.who()));
    },
    isPublished(id: string): boolean {
      return published.has(id);
    }
  };
}

export type TableLogPublisher = ReturnType<typeof createTableLogPublisher>;
