#!/usr/bin/env python3
"""Genera frontend/src/data/enemies/<libro>.ts desde data/enemies-src/<libro>.json.

Uso (desde la raiz del repo):
    .venv\\Scripts\\python.exe -I scripts\\gen_enemies.py

Solo libreria estandar. Los TS generados NO se editan a mano: se corrige el JSON
fuente y se vuelve a ejecutar este script.

[Claude Code · 2026-10-21]
"""
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / 'enemies-src'
OUT = ROOT / 'frontend' / 'src' / 'data' / 'enemies'

HEADER = '// Generado por scripts/gen_enemies.py desde data/enemies-src/. No editar a mano.\n'

STAT_ORDER = ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP']

# --------------------------------------------------------------------------
# Tablas de armas del Core (ROF y cargador estandar) para armas cuyo bloque
# de PNJ no imprime ROF/cargador. Clave: tipo de arma -> (rof, mag, pagina impresa).
# Core Rulebook v1.24: tabla de Melee Weapons p.92 (PDF 93) y tabla de
# Ranged Weapons p.94 (PDF 95). Exotic Weapons p.95.
# --------------------------------------------------------------------------
CORE_WEAPON_TABLE = {
    # Melee Weapons, Core p.92 (melee: sin cargador)
    'Light Melee Weapon': (2, 0, 92),
    'Medium Melee Weapon': (2, 0, 92),
    'Heavy Melee Weapon': (2, 0, 92),
    'Very Heavy Melee Weapon': (1, 0, 92),
    # Ranged Weapons, Core p.94 (cargador estandar; Bows & Crossbows imprime N/A -> 0)
    'Medium Pistol': (2, 12, 94),
    'Heavy Pistol': (2, 8, 94),
    'Very Heavy Pistol': (1, 8, 94),
    'SMG': (1, 30, 94),
    'Heavy SMG': (1, 40, 94),
    'Shotgun': (1, 4, 94),
    'Assault Rifle': (1, 25, 94),
    'Sniper Rifle': (1, 4, 94),
    'Bows & Crossbows': (1, 0, 94),
    'Grenade Launcher': (1, 2, 94),
    'Rocket Launcher': (1, 1, 94),
    # Brawling: "all Melee combat is 2 ROF" (Core p.176, PDF 177)
    'Brawling': (2, 0, 176),
    # Martial Arts Attacks are made at 2 ROF (Core p.178, PDF 179)
    'Martial Arts Strike': (2, 0, 178),
    # Cyberware melee (Core pp.114-115): clase de Melee Weapon -> ROF de la tabla p.92
    'Rippers': (2, 0, 115),  # Medium Melee Weapon
    'Wolvers': (2, 0, 115),  # Heavy Melee Weapon
    'Cybersnake': (1, 0, 114),  # Very Heavy Melee Weapon (no ataca dos veces)
}

# Alias nombre-en-ficha -> tipo de la tabla. Cada alias documenta su fuente.
WEAPON_ALIASES = {
    'Crossbow': 'Bows & Crossbows',  # p.94 "Bows & Crossbows"
    'Underbarrel Shotgun': 'Shotgun',  # accesorio tipo Shotgun
    'Assault Rifle w/ Shotgun Underbarrel': 'Assault Rifle',  # arma principal: Assault Rifle
    'Assault Rifle w/ Drum Magazine': 'Assault Rifle',  # capacidad del tambor no impresa: se usa la estandar
    'Sniper Rifle w/ Sniping Scope': 'Sniper Rifle',
    'Flamethrower': 'Shotgun',  # Exotic p.95: "Shotgun that fires incendiary shells"
}

# Override de NET Actions por turno (solo CEMK nativo) cuando el texto no se parsea.
NET_ACTIONS_OVERRIDE = {
    'cemk-enemy-netrunner': 2,  # The Jacket p.36: "Netrunner 3: Interface 3 y 2 Net Actions por turno"
}

BOOK_SPECS = {
    'core': dict(const='CORE_ENEMIES', sourceBook='core', era='2045', fmt='red'),
    'cemk': dict(const='CEMK_ENEMIES', sourceBook='cemk_2077', era='2077', fmt='cemk'),
    'hardened': dict(const='HARDENED_ENEMIES', sourceBook='dlc', era='2045', fmt='red'),
}


def book_title(book_key, npc):
    if book_key == 'core':
        return 'Cyberpunk RED Core Rulebook'
    if book_key == 'cemk':
        b = npc.get('book') or ''
        if 'Karaoke' in b:
            return 'Cyberpunk Edgerunners Mission Kit — Karaoke'
        if 'Jacket' in b:
            return 'Cyberpunk Edgerunners Mission Kit — Jacket'
        raise ValueError('CEMK sin book reconocible: ' + npc['id'])
    sub = npc.get('subtitle') or ''
    for t in ('Hardened Mooks', 'Hardened Lieutenants', 'Hardened Mini-Bosses'):
        if sub.startswith(t):
            return t
    raise ValueError('Hardened sin subtitulo reconocible: ' + npc['id'])


def weapon_lookup_key(name):
    n = name
    n = re.sub(r'^Poor Quality\s+', '', n)
    n = re.sub(r'^Popup\s+', '', n)
    if n in WEAPON_ALIASES:
        return WEAPON_ALIASES[n]
    return n


def weapon_display_name(w):
    name = w['name']
    q = w.get('quality')
    base = re.sub(r'^Poor Quality\s+', '', name)
    if q in ('Poor', 'Excellent'):
        return '%s (%s Quality)' % (base, q)
    return base


def build_weapon(w, skill_bases):
    rof, mag = w.get('rof'), w.get('mag')
    notes_parts = []
    if w.get('ammo'):
        notes_parts.append(w['ammo'])
    if w.get('notes'):
        notes_parts.append(w['notes'])
    if rof is None or mag is None:
        key = weapon_lookup_key(w['name'])
        if key in CORE_WEAPON_TABLE:
            t_rof, t_mag, page = CORE_WEAPON_TABLE[key]
            if rof is None:
                rof = t_rof
            if mag is None:
                mag = t_mag
            notes_parts.append('ROF/cargador según tabla Core p.%d' % page)
        elif key == 'Bulletproof Shield':
            rof = 0  # no es arma
            mag = 0 if mag is None else mag
            notes_parts.append('Escudo: no ataca')
        elif rof is None:
            rof = 1
            mag = 0 if mag is None else mag
            notes_parts.append('ROF/cargador no impresos')
        else:
            mag = 0  # CEMK: arma sin cargador impreso (cuerpo a cuerpo)
    skill = w.get('skill') or ''
    sb = w.get('skillBase')
    if sb is None:
        sb = skill_bases.get(skill, 0)
    out = {
        'name': weapon_display_name(w),
        'skillBase': sb,
        'damage': w['damage'],
        'rof': rof,
        'mag': mag,
    }
    if notes_parts:
        out['notes'] = ' · '.join(notes_parts)
    if w.get('weaponType2077'):
        out['weaponType2077'] = w['weaponType2077']
    if skill:
        out['skill'] = skill
    return out


def net_actions(npc):
    if npc['id'] in NET_ACTIONS_OVERRIDE:
        return NET_ACTIONS_OVERRIDE[npc['id']]
    for r in npc.get('specialRules', []):
        m = re.search(r'(\d+)\s+Net Actions', r)
        if m:
            return int(m.group(1))
    return None


def build_npc(book_key, npc):
    spec = BOOK_SPECS[book_key]
    rules = list(npc.get('specialRules') or [])
    ra = npc.get('roleAbility')
    if ra:
        rules.append('Role Ability: %s rank %d' % (ra['name'], ra['rank']))
    hp = npc['hp']
    sw = npc.get('seriouslyWounded')
    if sw is None:
        sw = int(math.ceil(hp / 2))
        rules.append('Seriously Wounded no impreso: HP/2')
    stats = {}
    emp_missing = False
    for k in STAT_ORDER:
        v = npc['stats'].get(k)
        if v is None:
            v = 0
            if k == 'EMP':
                emp_missing = True
        stats[k] = v
    if emp_missing:
        rules.append('EMP no impreso ("-")')
    armor = npc.get('armor') or {}
    skill_bases = npc.get('skillBases') or {}

    weapons = [build_weapon(w, skill_bases) for w in npc['weapons']]
    combat = []
    for w in weapons:
        cb = {'label': w['name'], 'totalBase': w['skillBase'], 'damage': w['damage'], 'rof': w['rof']}
        combat.append(cb)
    for key in ('Evasion', 'Perception', 'Interface'):
        if key in skill_bases:
            combat.append({'label': key, 'totalBase': skill_bases[key]})

    e = {
        'id': npc['id'],
        'name': npc['name'],
        'subtitle': npc.get('subtitle') or '',
        'faction': npc.get('faction') or '',
        'threatTier': npc['tier'],
        'sourceBook': spec['sourceBook'],
        'sourceBookTitle': book_title(book_key, npc),
        'era': spec['era'],
        'format': spec['fmt'],
        'sourcePage': npc['sourcePage'],
        'role': npc.get('role') or '',
        'hp': hp,
        'seriouslyWounded': sw,
        'deathSave': npc['deathSave'],
        'headSp': armor.get('headSp') or 0,
        'bodySp': armor.get('bodySp') or 0,
    }
    if armor.get('headSpVsMelee') is not None:
        e['headSpVsMelee'] = armor['headSpVsMelee']
    if armor.get('bodySpVsMelee') is not None:
        e['bodySpVsMelee'] = armor['bodySpVsMelee']
    e['stats'] = stats
    e['combatBases'] = combat
    e['weapons'] = weapons
    e['cyberware'] = list(npc.get('cyberware') or [])
    e['gear'] = list(npc.get('gear') or [])
    e['specialRules'] = rules
    e['loreSummary'] = npc.get('lore') or npc.get('subtitle') or ''
    if npc.get('level') is not None:
        e['level'] = npc['level']
    if npc.get('rep') is not None:
        e['rep'] = npc['rep']
    if npc['stats'].get('LUCK') is not None:
        e['luck'] = npc['stats']['LUCK']
    if ra:
        e['roleAbility'] = {'name': ra['name'], 'rank': ra['rank']}
    if skill_bases:
        e['skillBases'] = dict(skill_bases)
    e['isNetrunner'] = bool(npc.get('isNetrunner'))
    if npc.get('interfaceRank') is not None:
        e['interfaceRank'] = npc['interfaceRank']
    if npc.get('cyberdeckPrograms'):
        e['cyberdeckPrograms'] = list(npc['cyberdeckPrograms'])
    if npc.get('hasNeuroport') is not None:
        e['hasNeuroport'] = npc['hasNeuroport']
    if npc.get('selfIce') is not None:
        e['selfIce'] = npc['selfIce']
    if npc.get('quickhacks'):
        e['quickhacks'] = list(npc['quickhacks'])
    if book_key == 'cemk':
        na = net_actions(npc)
        if na is not None:
            e['netActionsPerTurn'] = na
    return e


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for book_key, spec in BOOK_SPECS.items():
        data = json.loads((SRC / (book_key + '.json')).read_text(encoding='utf-8'))
        entries = [build_npc(book_key, n) for n in data['npcs']]
        body = json.dumps(entries, ensure_ascii=False, indent=2)
        text = (
            HEADER
            + "import type { EnemySheet } from '../enemiesCatalog';\n\n"
            + 'export const %s: EnemySheet[] = %s;\n' % (spec['const'], body)
        )
        (OUT / (book_key + '.ts')).write_text(text, encoding='utf-8', newline='\n')
        print('%s: %d entradas' % (book_key, len(entries)))


if __name__ == '__main__':
    sys.exit(main())
