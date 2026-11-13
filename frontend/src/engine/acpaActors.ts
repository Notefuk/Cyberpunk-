// [Claude Code · 2026-11-12] v5.28.0 (plan 30): enemigos y actores del GM en ACPA.
// Fuente: "Solo of Fortune 2045", Interface RED Vol. 5, pp.133-142.
import coreData from '../data/core-rules.cprpack.json';
import type { EnemyWeaponProfile } from '../data/enemiesCatalog';
import type { EncounterEnemy } from '../store/encounterStore';
import type { ActiveAcpaState } from '../types/cyberpunk';
import { isPilotingAcpa } from './acpa';

type PackWeapon = { name: string; skill?: string; damage?: string; rof?: number; standardMag?: number; notes?: string; altFireModes?: string };
const PACK_WEAPONS = (coreData as unknown as { weapons: PackWeapon[] }).weapons;

export interface OnboardWeaponEntry {
  /** Nombre del arma en el catálogo. */
  name: string;
  count: number;
  /** "EQ" del libro = Excellent Quality: +1 a la tirada de ataque (Core). */
  excellent: boolean;
  /** Accesorios que trae ("w/ Drum Magazine & Long Tube"), solo como nota. */
  attachments?: string;
}

/**
 * Lee una entrada de arma Onboard como la imprime el libro:
 * "EQ Rocket Launcher w/ Drum Magazine & Long Tube (x4)" → Rocket Launcher, x4, Excellent, con accesorios.
 */
export function parseOnboardWeapon(entry: string): OnboardWeaponEntry {
  let s = entry.trim();
  let count = 1;
  const cm = s.match(/\s*\(x(\d+)\)\s*$/i);
  if (cm) {
    count = Number(cm[1]);
    s = s.slice(0, cm.index).trim();
  }
  let attachments: string | undefined;
  const wi = s.search(/\s+w\/\s+/i);
  if (wi >= 0) {
    attachments = s.slice(wi).replace(/^\s+w\/\s+/i, '').trim();
    s = s.slice(0, wi).trim();
  }
  s = s.replace(/\s*\(TUp[^)]*\)/i, '').trim();
  const excellent = /^EQ\s+/i.test(s);
  if (excellent) s = s.replace(/^EQ\s+/i, '');
  return { name: s, count, excellent, ...(attachments ? { attachments } : {}) };
}

const MELEE_SKILLS = /melee|brawling|martial/i;

/** Mod de la ACPA al ataque de un enemigo: REF a distancia, DEX cuerpo a cuerpo (IR5 p.134). 0 si no pilotea. */
export function acpaAttackMod(e: Pick<EncounterEnemy, 'acpa'>, w: Pick<EnemyWeaponProfile, 'mag' | 'skill'>): number {
  if (!isPilotingAcpa({ acpaState: e.acpa })) return 0;
  const melee = w.skill ? MELEE_SKILLS.test(w.skill) : w.mag <= 0;
  return melee ? e.acpa!.dex : e.acpa!.ref;
}

/**
 * Armas Onboard como armas del enemigo (sin el mod de la ACPA, que se suma al atacar). La base de ataque es la de
 * otra arma suya con la misma habilidad; si no tiene, su REF (o DEX cuerpo a cuerpo) sin habilidad.
 * Las que no están en el catálogo se saltean.
 */
export function onboardWeaponProfiles(acpa: Pick<ActiveAcpaState, 'onboardWeapons'>, e: Pick<EncounterEnemy, 'weapons' | 'stats'>): EnemyWeaponProfile[] {
  const out: EnemyWeaponProfile[] = [];
  for (const raw of acpa.onboardWeapons) {
    const p = parseOnboardWeapon(raw);
    const w = PACK_WEAPONS.find((x) => x.name.toLowerCase() === p.name.toLowerCase());
    if (!w) continue;
    const skill = w.skill ?? '';
    const same = e.weapons.find((x) => (x.skill ?? '').toLowerCase() === skill.toLowerCase());
    const stat = MELEE_SKILLS.test(skill) ? e.stats.DEX : e.stats.REF;
    const base = (same ? same.skillBase : stat ?? 0) + (p.excellent ? 1 : 0);
    const notes = [p.excellent ? 'Excellent Quality' : '', p.attachments ? `con ${p.attachments}` : '', w.altFireModes ?? '', 'Onboard: no se puede desarmar (IR5 p.134)']
      .filter(Boolean)
      .join('; ');
    for (let i = 0; i < p.count; i++) {
      out.push({
        name: `${p.excellent ? 'EQ ' : ''}${w.name}${p.count > 1 ? ` ${i + 1}` : ''} (Onboard)`,
        skillBase: base,
        damage: w.damage ?? '',
        rof: w.rof ?? 1,
        mag: w.standardMag ?? 0,
        notes,
        ...(w.skill ? { skill: w.skill } : {}),
      });
    }
  }
  return out;
}

/** Sube un enemigo a una ACPA: guarda el estado y suma las armas Onboard (con cargadores llenos) al final. */
export function boardEnemy(e: EncounterEnemy, acpa: ActiveAcpaState): EncounterEnemy {
  const base = e.acpa ? unboardEnemy(e) : e;
  const onboard = onboardWeaponProfiles(acpa, base);
  const ammo = base.ammo ?? base.weapons.map((w) => ({ current: w.mag, reserve: 0 }));
  return {
    ...base,
    acpa: { ...acpa, isPiloting: true },
    acpaWeaponCount: onboard.length,
    weapons: [...base.weapons, ...onboard],
    ammo: [...ammo, ...onboard.map((w) => ({ current: w.mag, reserve: 0 }))],
  };
}

/** Lo baja de la ACPA: saca el estado y las armas Onboard. */
export function unboardEnemy(e: EncounterEnemy): EncounterEnemy {
  const n = e.acpaWeaponCount ?? 0;
  const keep = e.weapons.length - n;
  const { acpa: _a, acpaWeaponCount: _n, ...rest } = e;
  return { ...rest, weapons: e.weapons.slice(0, keep), ...(e.ammo ? { ammo: e.ammo.slice(0, keep) } : {}) };
}
