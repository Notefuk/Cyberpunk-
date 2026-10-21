#!/usr/bin/env python3
"""Genera frontend/src/data/creation/<modulo>.ts desde data/creation-src/<archivo>.json.

Uso (desde la raiz del repo):
    .venv\\Scripts\\python.exe -I scripts\\gen_creation.py

Solo libreria estandar. Los TS generados NO se editan a mano: se corrige el JSON
fuente y se vuelve a ejecutar este script. Los datos se vuelcan tal cual, salvo la
clave "pdf" (ruta local) que se omite.

[Claude Code · 2026-10-22]
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / 'creation-src'
OUT = ROOT / 'frontend' / 'src' / 'data' / 'creation'

HEADER = '// Generado por scripts/gen_creation.py desde data/creation-src/. No editar a mano.\n'

# (json, modulo ts, const exportada, tipo)
FILES = [
    ('core-role-tables', 'coreRoleTables', 'CORE_ROLE_TABLES', 'CoreRoleTablesSrc'),
    ('core-gear-skills', 'coreGearSkills', 'CORE_GEAR_SKILLS', 'CoreGearSkillsSrc'),
    ('core-lifepath', 'coreLifepath', 'CORE_LIFEPATH', 'CoreLifepathSrc'),
    ('core-roles', 'coreRoles', 'CORE_ROLES', 'CoreRolesSrc'),
    ('cemk-creation', 'cemkCreation', 'CEMK_CREATION', 'CemkCreationSrc'),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for json_name, module, const, type_name in FILES:
        data = json.loads((SRC / (json_name + '.json')).read_text(encoding='utf-8'))
        data.pop('pdf', None)
        body = json.dumps(data, ensure_ascii=False, indent=2)
        text = (
            HEADER
            + "import type { %s } from './types';\n\n" % type_name
            + 'export const %s: %s = %s;\n' % (const, type_name, body)
        )
        (OUT / (module + '.ts')).write_text(text, encoding='utf-8', newline='\n')
        print('%s: %d claves' % (module, len(data)))


if __name__ == '__main__':
    sys.exit(main())
