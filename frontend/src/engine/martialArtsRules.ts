// Requisitos y efectos de los Special Moves de artes marciales (v4.9.6, plan15). [Claude Code · 2026-10-23]
// Motor puro: evalúa `req` de cada movimiento contra la ficha y el registro del turno, resuelve la tirada
// (empate gana el defensor, Core p.129) y describe los `effects` para el HUD. Fuente: Core pp.178-180 e Interface RED Vol. 4 pp.76-83.
import type { MartialArtMove, MartialHitKind, MartialMoveEffect } from '../data/cyberfistsMartialArtsData';
import { BODY_CRITICAL_INJURIES, HEAD_CRITICAL_INJURIES } from '../data/criticalInjuries';
import { CEMK_CRITICAL_INJURIES } from '../data/creation';
import { sheetSkillLevel } from './skillLookup';

export interface TurnLog {
  hitsByType: Record<MartialHitKind, number>;
  formHits: Record<string, number>;
  movedMeters: number;
  movesUsed: string[];
}

export function emptyTurnLog(): TurnLog {
  return {
    hitsByType: { brawling: 0, martial_arts: 0, melee: 0, ranged: 0 },
    formHits: {},
    movedMeters: 0,
    movesUsed: [],
  };
}

export interface MoveReqItem {
  label: string;
  ok: boolean;
  kind: 'stat' | 'skill' | 'rank' | 'turn' | 'confirm' | 'once';
}
export interface MoveReqCheck {
  ok: boolean;
  items: MoveReqItem[];
}

const HIT_KIND_LABEL: Record<MartialHitKind, string> = {
  brawling: 'Brawling',
  martial_arts: 'Martial Arts',
  melee: 'Melee Weapon',
  ranged: 'a distancia',
};

export function checkMoveRequirements(
  move: MartialArtMove,
  sheet: { stats: Record<string, number>; skills?: unknown; generalSkills?: Record<string, number> },
  formRank: number,
  log: TurnLog,
  confirmed: Record<string, boolean>
): MoveReqCheck {
  const items: MoveReqItem[] = [];
  const req = move.req;
  if (req) {
    for (const [k, v] of Object.entries(req.stats ?? {})) {
      if (typeof v !== 'number') continue;
      const have = sheet.stats[k] ?? 0;
      items.push({ label: `${k} ${v}+ (tenés ${have})`, ok: have >= v, kind: 'stat' });
    }
    for (const [name, v] of Object.entries(req.skills ?? {})) {
      const have = sheetSkillLevel(sheet, name);
      items.push({ label: `${name} ${v}+ (tenés ${have})`, ok: have >= v, kind: 'skill' });
    }
    if (typeof req.formRank === 'number') {
      items.push({
        label: `${move.formName} rango ${req.formRank}+ (tenés ${formRank})`,
        ok: formRank >= req.formRank,
        kind: 'rank',
      });
    }
    const turn = req.turn;
    if (turn) {
      for (const kind of turn.hitsOfKinds ?? []) {
        const n = log.hitsByType[kind] ?? 0;
        items.push({ label: `Golpe acertado de ${HIT_KIND_LABEL[kind]} este turno (${n})`, ok: n >= 1, kind: 'turn' });
      }
      if (typeof turn.formHits === 'number') {
        const n = log.formHits[move.formId] ?? 0;
        items.push({
          label: `${turn.formHits} golpes acertados de ${move.formName} este turno (${n})`,
          ok: n >= turn.formHits,
          kind: 'turn',
        });
      }
      if (typeof turn.movedMeters === 'number') {
        items.push({
          label: `Te moviste ${turn.movedMeters} m este turno (${log.movedMeters} m)`,
          ok: log.movedMeters >= turn.movedMeters,
          kind: 'turn',
        });
      }
    }
    for (const text of req.confirm ?? []) {
      items.push({ label: text, ok: confirmed[text] === true, kind: 'confirm' });
    }
    if (req.oncePerTurn && log.movesUsed.includes(move.id)) {
      items.push({ label: 'Ya lo usaste este turno', ok: false, kind: 'once' });
    }
  }
  return { ok: items.every(i => i.ok), items };
}

/** DV fijo si el movimiento lo trae y no es opuesto; si no, la defensa. Empate gana el defensor (Core p.129). */
export function resolveMoveRoll(move: MartialArtMove, total: number, defense: number): { hit: boolean; dv: number } {
  const dv = move.resolutionDv > 0 && !move.isOpposed ? move.resolutionDv : defense;
  return { hit: total > dv, dv };
}

export interface MoveEffectLine {
  label: string;
  detail: string;
  source?: { book: string; page: number | string };
}

function moveSource(move: MartialArtMove): { book: string; page: number | string } | undefined {
  const book = move.isNewCyberfists ? 'Interface RED Vol. 4' : 'Core';
  return move.sourcePage !== undefined ? { book, page: move.sourcePage } : { book, page: '' };
}

export function moveSupportsHeadShot(move: MartialArtMove): boolean {
  return (move.effects ?? []).some(e => e.kind === 'injury' && !!e.headAlt);
}

function coreInjuryName(name: string, location: 'head' | 'body'): string | null {
  const list = location === 'head' ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES;
  const found = list.find(i => i.name.includes(`(${name})`));
  return found ? found.name : null;
}

function cemkInjuryEffect(name: string, location: 'head' | 'body'): string | null {
  const list = location === 'head' ? CEMK_CRITICAL_INJURIES.head : CEMK_CRITICAL_INJURIES.body;
  const found = list.find(i => i.name === name);
  return found ? found.effectEs : null;
}

function injuryDetail(name: string, location: 'head' | 'body', table: 'core' | 'cemk'): string {
  const coreName = coreInjuryName(name, location) ?? name;
  if (table === 'cemk') {
    const effect = cemkInjuryEffect(name, location);
    if (effect !== null) return `${coreName}: ${effect}`;
    return `${coreName} (tabla Core: no está en la del CEMK, decisión 47)`;
  }
  return coreName;
}

function describeEffect(
  e: MartialMoveEffect,
  move: MartialArtMove,
  opts: { headShot: boolean; table: 'core' | 'cemk' }
): MoveEffectLine[] {
  const source = moveSource(move);
  const line = (label: string, detail: string): MoveEffectLine => ({ label, detail, source });
  switch (e.kind) {
    case 'injury': {
      if (e.name === 'random-body') {
        return [line('Herida crítica', 'Critical Injury de Cuerpo tirada al azar (si sale Foreign Object, se vuelve a tirar)')];
      }
      if (opts.headShot && e.headAlt) {
        return [
          line('Herida crítica', injuryDetail(e.headAlt, 'head', opts.table)),
          line('Disparo a la cabeza', 'Daño a la cabeza como Aimed Shot: el que pasa la armadura se duplica (decisión 43)'),
        ];
      }
      return [line('Herida crítica', injuryDetail(e.name, e.location, opts.table))];
    }
    case 'armorExtraAblation':
      return [line('Armadura', `Toda su armadura puesta pierde ${e.amount} SP extra`)];
    case 'prone':
      return [line('Derribo', 'El objetivo queda Prone')];
    case 'extraAttack': {
      const what = e.attack === 'brawling' ? 'Brawling' : e.attack === 'melee_weapon' ? 'Melee Weapon' : `Martial Arts (${move.formName})`;
      return [line('Ataque extra', `Un único ataque de ${what}`)];
    }
    case 'damage':
      return [line('Daño', e.alt ? `${e.formula} (${e.alt.formula} con ${e.alt.when})` : e.formula)];
    case 'aimedMod':
      return [line('Aimed Shot', `La penalización baja de ${e.from} a ${e.to}`)];
    case 'luck':
      return [line('Luck', `Recuperás hasta ${e.recover} punto(s) de Luck gastados`)];
    case 'initiative':
      return [line('Iniciativa', 'Pasás al primer puesto de la cola de Iniciativa')];
    case 'grapple': {
      const t: Record<typeof e.result, string> = {
        escape: 'Dejás de estar agarrado',
        reverse: 'Pasás a ser el atacante en el agarre',
        free_choke: 'Podés usar la Acción Choke',
        throw: 'Usás la Acción Throw',
      };
      return [line('Agarre', t[e.result])];
    }
    case 'disarm':
      return [line('Desarme', 'Un objeto en las manos del objetivo pasa a tus manos o cae al suelo')];
    case 'text':
      return [line('Efecto', e.text)];
  }
}

export function describeMoveEffects(move: MartialArtMove, opts: { headShot: boolean; table: 'core' | 'cemk' }): MoveEffectLine[] {
  return (move.effects ?? []).flatMap(e => describeEffect(e, move, opts));
}
