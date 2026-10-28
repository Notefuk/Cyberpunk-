// v5.1.0 [Claude Code · 2026-10-27]: log de tiradas de la mesa (plan 19, punto 4; plan 17, decisión 1).
// Van a la mesa las tiradas de combate (ataque, daño, Death Save, iniciativa) y las que el jugador marca
// "Mostrar a la mesa". Se publica escuchando `rollHistory`, así no se tocan los 26 lugares que llaman a addRollEntry.
//   campaigns/{c}/log/{rollId}: id, _by, at, charId, handle, kind, label, detail?, total?  (solo creación)
import { create } from 'zustand';
import type { RollEntry } from '../types/cyberpunk';
import type { DeathSaveResult } from '../engine/characterEngine';

/** 'gm': el GM actuó sobre la ficha de un PJ (v5.2.0, plan 20). [Claude Code · 2026-10-28] */
export type TableLogKind = 'attack' | 'damage' | 'skill' | 'initiative' | 'deathSave' | 'gm';

export const TABLE_LOG_LIMIT = 50;
export const TABLE_LOG_KEEP = 200;
/**
 * Decisión de Giuliano (2026-10-27, cuota): el ataque y su daño van en una sola línea del log.
 * Un ataque que pega espera su daño hasta este tiempo; si no llega, sale solo.
 */
export const ATTACK_DAMAGE_WAIT_MS = 20000;

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
    // Si weaponName ya nombra la skill (p. ej. "👁️ Perception (Core p.82)"), no se repite.
    const extra = e.weaponName && !e.weaponName.includes(e.skillName ?? '') ? ` (${e.weaponName})` : '';
    label = e.skillName ? `${e.skillName}${extra}` : e.weaponName;
    total = e.totalAttack;
    detail = e.penaltyBreakdown?.join(' · ');
  }
  const out: TableLogEntry = { id: e.id, _by: who.uid, handle: cut(who.handle || 'Sin nombre', 60), kind, label: cut(label, 120) };
  if (who.charId) out.charId = who.charId;
  if (detail) out.detail = cut(detail, 300);
  if (typeof total === 'number' && Number.isFinite(total)) out.total = total;
  return out;
}

/** Ataque + su daño en una sola entrada (con el id del ataque). */
export function mergeAttackDamage(attack: RollEntry, damage: RollEntry, who: { uid: string; charId?: string; handle: string }): TableLogEntry {
  const a = rollToLog(attack, who);
  const d = rollToLog(damage, who);
  const dmg = `daño ${d.total ?? '?'}${d.detail ? ` (${d.detail})` : ''}`;
  return { ...a, detail: cut([a.detail, dmg].filter(Boolean).join(' · '), 300) };
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

/** v5.2.0 (plan 20): una acción del GM sobre la ficha de un PJ (daño, crítica, condición, Humanidad, €$). */
export function gmActionToLog(a: { targetCharId: string; targetHandle: string; label: string; detail?: string; total?: number }, who: { uid: string }): TableLogEntry {
  const out: TableLogEntry = {
    id: `gm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    _by: who.uid,
    charId: a.targetCharId,
    handle: 'GM',
    kind: 'gm',
    label: cut(`→ ${a.targetHandle || 'PJ'}: ${a.label}`, 120)
  };
  if (a.detail) out.detail = cut(a.detail, 300);
  if (typeof a.total === 'number' && Number.isFinite(a.total)) out.total = a.total;
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
 * Una tirada vieja marcada "Mostrar a la mesa" (`shareWithTable`) se publica al marcarla.
 * Un ataque que pega espera su daño (mismo arma) para salir en una sola línea.
 */
export function createTableLogPublisher(opts: {
  adapter: TableLogAdapter;
  who: () => { uid: string; charId?: string; handle: string };
  initial: RollEntry[];
  onError?: (e: unknown) => void;
  waitMs?: number;
}) {
  const seen = new Set(opts.initial.map((e) => e.id));
  const published = new Set<string>();
  const waitMs = opts.waitMs ?? ATTACK_DAMAGE_WAIT_MS;
  /** Ataques que pegaron y esperan su daño. */
  const pending = new Map<string, { attack: RollEntry; timer: ReturnType<typeof setTimeout> }>();
  const sameWeapon = (a: RollEntry, d: RollEntry) =>
    a.weaponInstanceId && d.weaponInstanceId ? a.weaponInstanceId === d.weaponInstanceId : a.weaponName === d.weaponName;

  const publish = (entry: TableLogEntry) => {
    if (published.has(entry.id)) return;
    published.add(entry.id);
    opts.adapter.create(entry).catch((e) => {
      published.delete(entry.id);
      opts.onError?.(e);
    });
  };

  const flushPending = (id: string) => {
    const p = pending.get(id);
    if (!p) return;
    clearTimeout(p.timer);
    pending.delete(id);
    publish(rollToLog(p.attack, opts.who()));
  };

  const handleNew = (e: RollEntry) => {
    if (e.type === 'attack' && e.isHit) {
      const timer = setTimeout(() => flushPending(e.id), waitMs);
      pending.set(e.id, { attack: e, timer });
      return;
    }
    if (e.type === 'damage') {
      const match = [...pending.values()].find((p) => sameWeapon(p.attack, e));
      if (match) {
        clearTimeout(match.timer);
        pending.delete(match.attack.id);
        published.add(e.id);
        publish(mergeAttackDamage(match.attack, e, opts.who()));
        return;
      }
    }
    if (isAutoShared(e) || e.shareWithTable) publish(rollToLog(e, opts.who()));
  };

  return {
    /** Llamar con cada nuevo `rollHistory`. */
    onHistory(history: RollEntry[]): void {
      // De la más vieja a la más nueva, así el daño llega después de su ataque.
      for (const e of [...history].reverse()) {
        if (seen.has(e.id)) {
          if (e.shareWithTable && !published.has(e.id)) publish(rollToLog(e, opts.who()));
          continue;
        }
        seen.add(e.id);
        handleNew(e);
      }
    },
    /** Al cerrar la mesa: lo que esperaba su daño sale solo. */
    flush(): void {
      for (const id of [...pending.keys()]) flushPending(id);
    },
    publishDeathSave(r: DeathSaveResult): void {
      publish(deathSaveToLog(r, opts.who()));
    },
    /** Una entrada ya armada (p. ej. `gmActionToLog`). */
    publishEntry(entry: TableLogEntry): void {
      publish(entry);
    },
    isPublished(id: string): boolean {
      return published.has(id);
    }
  };
}

export type TableLogPublisher = ReturnType<typeof createTableLogPublisher>;
