# [Claude Code · 2026-11-11] v5.19.0 (plan 27): genera frontend/src/data/gmTables/*.ts desde los JSON extraídos
# en docs/plans/work/plan27-v5.19.0/. Páginas: logros IR4 = DLC+22, clima IR2 = DLC+14;
# Salvaging, Digital Dating y Collecting the Random están en IR3 (imagen sin texto) y se citan por el DLC.
import io, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'docs', 'plans', 'work', 'plan27-v5.19.0')
OUT = os.path.join(ROOT, 'frontend', 'src', 'data', 'gmTables')
os.makedirs(OUT, exist_ok=True)

def load(name):
    p = os.path.join(SRC, name)
    return json.load(io.open(p, encoding='utf-8')) if os.path.exists(p) else None

def ts(v):
    return json.dumps(v, ensure_ascii=False, indent=2)

def strip_page(s):
    return re.sub(r'\s*\((?:p|pp)\.\s*[\d\-–, p.]+\)\s*\.?$', '', s).strip()

def die(spec):
    """Dado de la tabla para la app: '1d100 (x2)' y 'Par/impar; si impar 1d10' se tiran con su dado; las listas sin dado quedan sin tirada."""
    m = re.search(r'\d+d\d+', spec or '')
    return m.group(0) if m else 'lista'

def write(name, header, body):
    path = os.path.join(OUT, name)
    io.open(path, 'w', encoding='utf-8', newline='\n').write(header + '\n' + body)
    print('wrote', path)

HEAD = "// Generado por scripts/gen_gm_tables.py [Claude Code · 2026-11-11] v5.19.0 (plan 27). No editar a mano: editar el JSON de docs/plans/work/plan27-v5.19.0/ y volver a generar.\n// Los textos en español son resúmenes propios; nombres y números como en el libro.\nimport type { GmTable } from './types';\n"

# ---------- logros y cajas ----------
a = load('gm_achievements.json')
ir4 = lambda p: f'Interface RED Vol. 4 p.{p + 22}'
ach = [{'name': x['name'], 'conditionEs': x['conditionEs'], 'source': ir4(x['dlcPage'])} for x in a['achievements']]
rules = [strip_page(r) for r in a['rules']]
boxes = {'id': 'table-of-mystery', 'title': 'The Table of Mystery', 'die': a['lootBoxTable']['roll'],
         'rows': [{'roll': r['roll'], 'text': r['box']} for r in a['lootBoxTable']['rows']],
         'source': ir4(a['lootBoxTable']['rows'][0]['dlcPage'])}
contents = []
for i, t in enumerate(a['otherTables']):
    contents.append({'id': f'box-{i + 1}', 'title': t['title'].replace('Inside the Box: ', ''), 'die': t['roll'],
                     'rows': [{'roll': r['roll'], 'text': r['textEs']} for r in t['rows']], 'source': ir4(t['dlcPage'])})
write('achievements.ts', HEAD,
      "export interface Achievement { name: string; conditionEs: string; source: string }\n\n"
      f"export const ACHIEVEMENTS: Achievement[] = {ts(ach)};\n\n"
      f"export const ACHIEVEMENT_RULES: string[] = {ts(rules)};\n\n"
      f"export const TABLE_OF_MYSTERY: GmTable = {ts(boxes)};\n\n"
      "/** Contenido de cada caja (1d6), en el mismo orden que la Table of Mystery. */\n"
      f"export const MYSTERY_BOX_CONTENTS: GmTable[] = {ts(contents)};\n")

# ---------- clima ----------
w = load('gm_weather.json')
ir2 = lambda p: f'Interface RED Vol. 2 p.{p + 14}'
months = {'dec-feb': [12, 1, 2], 'mar-may': [3, 4, 5], 'jun-aug': [6, 7, 8], 'sep-nov': [9, 10, 11]}
seasons = []
for s in w['seasons']:
    seasons.append({'id': s['id'], 'title': s['title'], 'months': months[s['id']], 'die': s['roll'],
                    'rows': [{'roll': r['roll'], 'conditions': r['name'], 'temperature': r['effectEs'].replace('Temperature: ', '')} for r in s['rows']],
                    'source': ir2(s['dlcPage'])})
sw = w['strangeWeather']
strange = {'id': 'strange-weather', 'title': 'Strange Weather', 'die': sw['roll'],
           'rows': [{'roll': r['roll'], 'text': f"{r['name']}: {r['effectEs']}"} for r in sw['rows']], 'source': ir2(sw['dlcPage'])}
rules_w = [{'title': t['name'], 'textEs': (t['range'] + ': ' if t.get('range') else '') + t['effectEs'], 'source': ir2(t['dlcPage'])} for t in w['temperature']]
rules_w += [{'title': o['title'], 'textEs': o['textEs'], 'source': ir2(o['dlcPage'])} for o in w['otherRules']]
write('weather.ts', HEAD,
      "export interface WeatherRow { roll: string; conditions: string; temperature: string }\n"
      "export interface WeatherSeason { id: string; title: string; months: number[]; die: string; rows: WeatherRow[]; source: string }\n"
      "export interface WeatherRule { title: string; textEs: string; source: string }\n\n"
      f"export const WEATHER_HOW_TO: string[] = {ts([strip_page(x) for x in w['howToUseEs']])};\n\n"
      f"export const WEATHER_SEASONS: WeatherSeason[] = {ts(seasons)};\n\n"
      f"export const STRANGE_WEATHER: GmTable = {ts(strange)};\n\n"
      f"export const WEATHER_RULES: WeatherRule[] = {ts(rules_w)};\n")

# ---------- salvaging ----------
s = load('gm_salvaging.json')
sv = lambda p: f'Salvaging Night City p.{p}'
cat = s['otherTables'][0]
perils = s['perils']
# El libro dice "reduced by armor" también en el peril 4 (p.5).
perils = [dict(p, textEs=p['textEs'].replace('6d6 de daño salvo', '6d6 de daño (reducido por armadura) salvo')) for p in perils]
FIND = re.compile(r'Find (DV \d+|N/A)')
SPEC = re.compile(r'Category (DV \d+|N/A)')
worth = [{'worth': x['roll'], 'anyDv': FIND.search(x['textEs']).group(1), 'specificDv': SPEC.search(x['textEs']).group(1)} for x in s['worth']]
write('salvaging.ts', HEAD,
      "export interface SalvageWorth { worth: string; anyDv: string; specificDv: string }\n"
      "export interface SalvageLocation { name: string; textEs: string; source: string }\n\n"
      f"export const SALVAGING_INTRO = {ts(s['intro'])};\n\n"
      f"export const SALVAGING_STEPS: string[] = {ts([strip_page(x) for x in s['howItWorksEs']])};\n\n"
      f"export const SALVAGE_LOCATIONS: SalvageLocation[] = {ts([{'name': l['name'], 'textEs': l['textEs'], 'source': sv(l['dlcPage'])} for l in s['locations']])};\n\n"
      f"export const SALVAGE_CATEGORIES: GmTable = {ts({'id': 'salvage-categories', 'title': 'Salvage Categories', 'die': cat['roll'], 'rows': [{'roll': r['roll'], 'text': r['textEs']} for r in cat['rows']], 'source': sv(cat['dlcPage'])})};\n\n"
      "/** Basic Tech: el DV según el valor buscado y si se acepta cualquier categoría o una específica. */\n"
      f"export const SALVAGE_WORTH: SalvageWorth[] = {ts(worth)};\n"
      f"export const SALVAGE_WORTH_SOURCE = {ts(sv(s['worthPage']))};\n\n"
      f"export const PERILS_OF_SALVAGING: GmTable = {ts({'id': 'perils-of-salvaging', 'title': 'Perils of Salvaging', 'die': s['perilsRoll'], 'rows': [{'roll': p['roll'], 'text': p['textEs']} for p in perils], 'source': sv(s['perilsPage'])})};\n")

# ---------- citas ----------
d = load('gm_dating.json')
if d:
    dd = lambda p: f'Digital Dating in the Dark Future p.{p}'
    tables = [{'id': t['id'], 'title': t['title'], 'die': die(t['roll']), 'rows': [{'roll': r['roll'], 'text': r['textEs']} for r in t['rows']], 'source': dd(t['dlcPage'])} for t in d['tables']]
    write('dating.ts', HEAD,
          f"export const DATING_INTRO = {ts(d['intro'])};\n\n"
          f"export const DATING_STEPS: string[] = {ts([strip_page(x) for x in d['stepsEs']])};\n\n"
          f"export const DATING_TABLES: GmTable[] = {ts(tables)};\n\n"
          f"export const DATING_RULES: {{ title: string; textEs: string; source: string }}[] = {ts([{'title': o['title'], 'textEs': o['textEs'], 'source': dd(o['dlcPage'])} for o in d.get('otherRules', [])])};\n")

# ---------- colecciones ----------
c = load('gm_collecting.json')
if c:
    cr = lambda p: f'Collecting the Random p.{p}'
    cols = [{'id': t['id'], 'title': t['title'], 'die': die(t['roll']),
             'rows': [{'roll': r['roll'], 'text': r['name'] + (f": {r['textEs']}" if r.get('textEs') else '')} for r in t['rows']],
             'source': cr(t['dlcPage'])} for t in c['collections']]
    write('collecting.ts', HEAD,
          f"export const COLLECTING_INTRO = {ts(c['intro'])};\n\n"
          f"export const COLLECTING_HOW_TO: string[] = {ts([strip_page(x) for x in c['howToUseEs']])};\n\n"
          f"export const COLLECTIONS: GmTable[] = {ts(cols)};\n")
