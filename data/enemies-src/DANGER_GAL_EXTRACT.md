<!-- [Claude Code · 2026-11-13] plan 32: instrucciones de extracción usadas para las fichas de Danger Gal (v5.36.0 en adelante). -->
# Extracción de fichas de Danger Gal Dossier (plan 32, v5.36.0)

PDF: `C:/Users/TeseoHeracles/Documents/CP RED TEST ANTIGRAVITY/Sourcebooks/Cyberpunk-RED-Danger-Gal-Dossier_2023-07-07.pdf`
- **Página impresa = índice 0-based del PDF** (`doc[i]` es la página impresa `i`; el número aparece arriba del texto de la página).
- Texto de todo el libro ya volcado en `C:/Users/TESEOH~1/AppData/Local/Temp/claude/8fa5ce568348926a/1920c2e6-36a0-4869-b296-91a56e6bd1b2/scratchpad/dg_text.txt` (separador `@@PAGE <índice>`). El orden del texto está mezclado: los números de STATs salen en el orden INT REF DEX TECH COOL WILL MOVE BODY EMP; HP, Seriously Wounded y Death Save salen como tres números sueltos (identificalos: SW = ceil(HP/2), Death Save = BODY). **Ante cualquier duda, renderizá la página** con `python -I -c "import pymupdf; d=pymupdf.open(PDF); d[i].get_pixmap(dpi=110).save('<scratchpad>/pg<i>.png')"` y mirala con Read.
- Esquema exacto: `C:/Users/TeseoHeracles/cpr-omni-deck/data/enemies-src/SCHEMA.md`. Ejemplo real de una entrada: el último NPC de `C:/Users/TeseoHeracles/cpr-omni-deck/data/enemies-src/interface-red.json`.

## Reglas
- `id`: `dg-<faccion-corta>-<nombre-kebab>` (ej. `dg-6th-arbiter`, `dg-bozos-big-top`, `dg-puma-pantera`, `dg-divas-firewall`, `dg-edge-tetsuo`). Sin tildes ni símbolos.
- `name`: exacto como el libro. `subtitle`: el descriptor bajo el nombre (ej. "Squad Leader").
- `sourcePage`: página impresa de la ficha.
- `tier`: de la etiqueta de nivel de la ficha: Mook → `mook`, Lieutenant/LT → `lieutenant`, Mini-Boss → `mini_boss`, Boss → `boss`; si es Hardened, prefijo `hardened_` (ej. `hardened_mini_boss`). El índice del libro marca Hardened con "(H ...)".
- `faction`: EXACTAMENTE uno de: `6th Street`, `Bozos`, `Danger Gal Puma Squad`, `The Digital Divas`, `Edgerunners`.
- `role` y `roleAbility`: de "role" (ej. "Lawman: Backup 4" → role "Lawman", roleAbility {name:"Backup", rank:4}). Si no tiene, "" y null.
- `rep`: el número de "rep" si está. `level`: null.
- `weapons`: cada arma con `skill` (la skill que corresponde: Handgun, Shoulder Arms, Heavy Weapons, Archery, Melee Weapon, Brawling, Martial Arts, Autofire…) y `skillBase` = el valor de esa skill en Skill Bases. `quality`: "Excellent" si dice EQ, "Poor" si PQ, si no null. `rof`, `damage` tal cual. `mag`/`ammo` null salvo que el libro lo diga. `weaponType2077`: siempre null.
- `armor`: nombre (ej. "Kevlar® (cabeza) / Light Armorjack (cuerpo)"), headSp y bodySp; penalty si lo imprime.
- `skillBases`: todas, con el nombre tal cual (ej. "Language (English)": 13, "Local Expert (North Heywood)": 13).
- `cyberware` y `gear`: listas tal cual el libro, un ítem por elemento (separador •).
- Netrunners: `isNetrunner` true, `interfaceRank` (de "Netrunner: Interface N"), `cyberdeckPrograms` con los programas/deck listados. `hasNeuroport`/`quickhacks`: null/[] (son fichas RED; el porte CEMK lo calcula la app).
- `specialRules`: paráfrasis precisa en español de cada regla/habilidad especial del bloque (con números). Si la ficha tiene una NET portátil o drones (ej. CrAB Lord, p.42-43 con el CrAB Drone y su arquitectura), describilos acá con DVs, REZ, etc.
- `lore`: 1-2 frases en español, parafraseando la historia (no copiar).
- `doubts`: todo número dudoso, dígitos rotos por la extracción, o atribución inferida.
- Español con tildes correctas (daño, más, está, también…). Archivo UTF-8.
- **Nada inventado.** Si un campo no está, null o [].

## Salida
Un archivo JSON con un array de NPCs (solo el array, sin envoltorio), en el orden del libro. Respondé solo con: ruta del archivo, cantidad de fichas, y la lista de ids con su página y tier, más las dudas importantes. Cero texto conversacional.
