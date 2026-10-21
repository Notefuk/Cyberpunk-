---
name: cpr-pdf-extractor
description: Protocolo para extraer tablas y contenido oficial de Cyberpunk RED desde los PDFs de los libros y convertirlo en packs .cprpack.json validados. Úsala al importar armas, armaduras, ciberware, drogas, equipo o programas desde un PDF, o al verificar una regla contra el libro.
---

# CPR PDF Extractor

Protocolo determinista para extraer contenido y tablas oficiales desde los PDFs de Cyberpunk RED e integrarlos en paquetes `.cprpack.json` para el motor CPR Omni-Deck.

## Dónde están los PDFs

Los PDFs **no están en el repo** (`*.pdf` está en `.gitignore`). En el entorno original (Antigravity, Windows) vivían en:

```
C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\
└── Core-Rules\Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf
```

Subcarpetas: `Core-Rules/` (Core Rulebook v1.24, CEMK Rulebook, Easy Mode), `Sourcebooks/` (Black Chrome, Danger Gal Dossier, Night City Gang Guide, CEMK Handbook, `Interface-RED/` Vol. 1-3), `DLC-Supplements/`, `Adventures/`, `Reference-Aids/` (errata v1.25, Data Pack, folios CEMK), `Cyberpunk Edgerunners Mission Kit Digital/` (mapas, tokens y cartas en JPG/PNG).

### Acceso desde Claude Code local (Windows, la PC del usuario)

Los PDFs se leen directo del disco, sin traerlos a ningún contenedor:

```powershell
.\.venv\Scripts\python.exe scripts\inspect_pdf_pages.py "C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\<subcarpeta>\<archivo>.pdf" <inicio> <fin>
```

- Going Metal **no** está en `Sourcebooks/`: es `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\ilide.info-going-metal-pr_f86aec80bbb3b8b8c08ede7e5181f832.pdf` (página impresa = página del PDF + 90).
- Interface RED Vol. 1-4 están en `Sourcebooks\Interface-RED\`.
- Las lecturas de PDF las hace siempre `cpr-scout`, que devuelve solo los datos pedidos.

### Acceso desde Claude Code en la nube (claude.ai)

Con la PC del usuario conectada (app de escritorio de Claude y carpeta autorizada):
1. Ubica el archivo con `device_list_dir` sobre `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY`.
2. Tráelo al contenedor con `device_stage_files` (queda en `/mnt/user-data/uploads/CP RED TEST ANTIGRAVITY/<subcarpeta>/<archivo>.pdf`; los archivos grandes tardan unos segundos en aparecer).
3. Léelo con `inspect_pdf_pages.py`. Para lecturas largas delega en el subagente `cpr-scout`.

Trae solo los PDFs que la tarea necesita. Si no hay dispositivo conectado ni PDFs disponibles, **no inventes contenido**: pide al usuario que conecte la PC o comparta el archivo. Los scripts `scripts/extract_core_pack.py` y `scripts/find_sections.py` tienen rutas de Windows hardcodeadas (PDF de entrada y carpetas de salida); hay que pasarlos a rutas configurables antes de usarlos fuera de esa máquina.

## Herramienta de inspección de páginas

Requiere `pypdf` (`pip install pypdf`). Para leer texto crudo de un rango de páginas sin saturar contexto:

```bash
python scripts/inspect_pdf_pages.py "<ruta_al_pdf>" <pagina_inicio> <pagina_fin>
```

Las páginas son del PDF (1-indexadas), que van +1 respecto a la numeración impresa del Core Rulebook. `scripts/find_sections.py` lista los marcadores (outline) del PDF con su página.

## Índice de Referencia del Core Rulebook (v1.24)
- **Melee Weapons**: Páginas 340–341 (PDF 341–342)
- **Ranged Weapons**: Páginas 341–342 (PDF 342–343)
- **Weapon Attachments**: Páginas 342–344 (PDF 343–345)
- **Ammunition**: Páginas 344–346 (PDF 345–347)
- **Exotic Weapons**: Páginas 347–350 (PDF 348–351)
- **Armor**: Páginas 350–351 (PDF 351–352)
- **General Gear**: Páginas 351–356 (PDF 352–357)
- **Street Drugs & Pharmaceuticals**: Páginas 150, 357–358 (PDF 150, 358–359)
- **Cyberware**: Páginas 358–367 (PDF 359–368)
- **Cyberdeck Hardware & Programs**: Páginas 368–372 (PDF 369–373)

## Esquema Obligatorio para `.cprpack.json`

Cualquier pack extraído debe mantener la compatibilidad con el frontend TypeScript:

### 1. `weapons`
Campos obligatorios:
- `id` (string, slug kebab-case)
- `name` (string)
- `type` ("Melee" | "Ranged" | "Exotic")
- `skill` (string, ej: "Handgun", "Shoulder Arms", "Melee Weapon", "Heavy Weapons", "Archery")
- `damage` (string, ej: "1d6", "2d6", "3d6", "4d6", "5d6", "8d6")
- `rof` (number: 1 ó 2)
- `hands` (number: 1 ó 2)
- `concealable` (boolean)
- `cost` (number)
- `costTier` (string: "Cheap", "Everyday", "Costly", "Premium", "Expensive", "Very Expensive", "Luxury", "Super Luxury")
- Para Ranged/Exotic: `standardMag` (number), `ammoType` (string), opcional `altFireModes` (string, ej: "Autofire (3), Suppressive Fire"), `dvTable` (string).
- `notes` (string)

### 2. `armor`
Campos obligatorios:
- `id` (string)
- `name` (string)
- `sp` (number)
- `penalty` (number, 0, -2, -4)
- `cost` (number)
- `costTier` (string)
- `description` (string)
- Para escudos: opcional `hp` (number).

### 3. `attachments`
Campos obligatorios:
- `id` (string)
- `name` (string)
- `cost` (number)
- `slots` (number)
- `description` (string)

### 4. `ammunition`
Campos obligatorios:
- `id` (string)
- `name` (string)
- `cost` (number)
- `costTier` (string)
- `description` (string)

### 5. `cyberware`
Campos obligatorios:
- `id` (string)
- `name` (string)
- `type` ("Fashionware" | "Neuralware" | "Cyberoptics" | "Cyberaudio" | "Internal" | "External" | "Cyberlimb" | "Borgware")
- `install` ("Mall" | "Clinic" | "Hospital")
- `humanityLoss` (string, ej: "2d6 (7)")
- `cost` (number)
- `description` (string)
- Opcional: `slots` (number)

### 6. `drugs`
Campos obligatorios:
- `id` (string)
- `name` (string)
- `cost` (number)
- `costTier` (string)
- `duration` (string)
- `primaryEffect` (string)
- `secondaryEffect` (string)
- `addictionDv` (number)
- `description` (string)

### 7. `gear`
Campos obligatorios:
- `id` (string)
- `name` (string)
- `cost` (number)
- `costTier` (string)
- `description` (string)

### 8. `programs`
Campos obligatorios:
- `id` (string)
- `name` (string)
- `class` (string: "Booster", "Defender", "Attacker (Anti-Program)", "Attacker (Anti-Personnel)", "Black ICE")
- `cost` (number)
- `description` (string)
- Si aplica: `atk` (number), `def` (number), `rez` (number), `per` (number), `spd` (number).

## Flujo de trabajo

1. Inspeccionar las páginas del PDF con `inspect_pdf_pages.py`.
2. Actualizar el extractor en `scripts/extract_core_pack.py`.
3. Ejecutar el extractor para regenerar **ambas** copias: `data/core-rules.cprpack.json` y `frontend/src/data/core-rules.cprpack.json`.
4. Validar el JSON (`python -m json.tool <archivo> > /dev/null`) y que el frontend compile (`cd frontend && npx tsc -b --noEmit && npm run build`).
5. Citar libro y página de cada dato nuevo en el changelog de la versión.
