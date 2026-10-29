// v5.4.0 [Claude Code · 2026-10-29]: qué armas usa cada skill de combate y cómo funciona Autofire (plan 21).
// Fuentes: Core pp.83-84 (skills), p.171 (tabla de armas a distancia), p.92 (melee), pp.172-174 (ataques), p.176 (melee y Brawling), p.178 (Martial Arts).

export interface WeaponSkillInfo {
  /** Qué armas cubre, en castellano. */
  weaponsEs: string;
  /** Tirada de ataque. */
  rollEs: string;
  page: string;
}

export const WEAPON_SKILL_GUIDE: Record<string, WeaponSkillInfo> = {
  Handgun: {
    weaponsEs: 'Todas las pistolas (Medium, Heavy y Very Heavy Pistol) y los SMG y Heavy SMG en tiro simple.',
    rollEs: 'REF + Handgun + 1d10',
    page: 'Core p.84 y p.171'
  },
  'Shoulder Arms': {
    weaponsEs: 'Escopetas (Shotgun), Assault Rifle y Sniper Rifle en tiro simple.',
    rollEs: 'REF + Shoulder Arms + 1d10',
    page: 'Core p.84 y p.171'
  },
  'Heavy Weapons': {
    weaponsEs: 'Grenade Launcher y Rocket Launcher.',
    rollEs: 'REF + Heavy Weapons + 1d10',
    page: 'Core p.84 y p.171'
  },
  Archery: {
    weaponsEs: 'Arcos y ballestas (Bows & Crossbows).',
    rollEs: 'REF + Archery + 1d10',
    page: 'Core p.83 y p.171'
  },
  Autofire: {
    weaponsEs: 'Solo las armas con modo Autofire, cuando disparás en ráfaga o hacés Suppressive Fire: SMG y Heavy SMG (hasta ×3) y Assault Rifle (hasta ×4).',
    rollEs: 'REF + Autofire + 1d10',
    page: 'Core pp.173-174'
  },
  'Melee Weapon': {
    weaponsEs: 'Todas las armas cuerpo a cuerpo: Light, Medium, Heavy y Very Heavy Melee (cuchillos, katanas, martillos…).',
    rollEs: 'DEX + Melee Weapon + 1d10',
    page: 'Core p.84, p.92 y p.176'
  },
  Brawling: {
    weaponsEs: 'Puños, patadas y agarres (Grab). El daño depende de tu BODY: 1d6 / 2d6 / 3d6 / 4d6; con Cyberarm, mínimo 2d6. No ignora la mitad de la armadura.',
    rollEs: 'DEX + Brawling + 1d10',
    page: 'Core p.83 y p.176'
  },
  'Martial Arts': {
    weaponsEs: 'Golpes de la forma que aprendiste. Daño por BODY como Brawling, pero ignora la mitad del SP, y cada forma tiene 2 movimientos especiales.',
    rollEs: 'DEX + Martial Arts (forma) + 1d10',
    page: 'Core p.83 y p.178'
  },
  Evasion: {
    weaponsEs: 'No es para atacar: es tu defensa. Contra golpes siempre; contra tiros solo si tenés REF 8 o más.',
    rollEs: 'DEX + Evasion + 1d10',
    page: 'Core p.83, p.172 y p.176'
  }
};

export const WEAPON_SKILLS_NOTE =
  'En Cyberpunk RED no hay "proficiencia": cada nivel de la skill suma +1 a pegar con todas las armas de ese tipo. Si subís Handgun, pegás mejor con cualquier pistola que lleves. La tirada es REF (a distancia) o DEX (cuerpo a cuerpo) + skill + 1d10 contra un DV o contra la defensa del otro (Core p.172 y p.176).';

/** Reglas de Autofire verificadas en el Core (pp.173-174). */
export const AUTOFIRE_RULES: string[] = [
  'Solo con armas que tienen modo Autofire: SMG y Heavy SMG (multiplicador máximo ×3) y Assault Rifle (×4) (Core p.171 y p.173).',
  'Cuesta 1 Acción y 10 balas; si el cargador tiene menos de 10, no se puede (Core p.173).',
  'Tirás REF + Autofire + 1d10, en lugar de la skill del arma, contra la tabla de DV de Autofire, que no es la del tiro simple. No se puede apuntar (Aimed Shot) (Core p.173).',
  'Si pegás: 2d6 × lo que superaste el DV, hasta el máximo del arma. Con dos 6 también hay Critical Injury. Después resta la armadura (Core p.173).',
  'Quien tenga REF 8 o más puede intentar esquivar la ráfaga (Core p.173).',
  'Suppressive Fire: 1 Acción y 10 balas. Todos a pie, a 25 m o menos, fuera de cobertura y a la vista, tiran WILL + Concentration + 1d10 contra tu REF + Autofire + 1d10; el que pierde usa su próximo Move para cubrirse (Core p.174).',
  'Es una skill ×2 (cuesta 2 puntos por nivel) (Core p.83).'
];

export const AUTOFIRE_WARNING =
  'Autofire no reemplaza a Handgun ni a Shoulder Arms: para los tiros simples seguís usando esas. Con un SMG, el tiro simple usa Handgun y la ráfaga usa Autofire; con un Assault Rifle, Shoulder Arms y Autofire.';
