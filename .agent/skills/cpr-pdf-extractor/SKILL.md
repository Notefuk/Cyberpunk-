---
name: cpr-pdf-extractor
description: Protocol and tooling to extract official Cyberpunk RED tables and content from sourcebook PDFs and convert them into validated .cprpack.json packs.
---

# CPR PDF Extractor Skill

Esta skill define el protocolo determinista para extraer contenido y tablas oficiales desde los PDFs del repositorio de reglas de Cyberpunk RED (`C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY`) e integrarlos en paquetes `.cprpack.json` para el motor CPR Omni-Deck.

## Herramienta de Inspección de Páginas

Para inspeccionar texto crudo de páginas sin saturar memoria ni contexto:

```powershell
.\.venv\Scripts\python.exe scripts/inspect_pdf_pages.py "<pdf_path>" <start_page> <end_page>
```

### Ejemplo de uso:
```powershell
.\.venv\Scripts\python.exe scripts/inspect_pdf_pages.py "C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\Core-Rules\Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf" 341 346
```

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

## Flujo de Trabajo
1. Inspeccionar las páginas del PDF con `inspect_pdf_pages.py`.
2. Actualizar el extractor en `scripts/extract_core_pack.py`.
3. Ejecutar `extract_core_pack.py` para generar tanto `data/core-rules.cprpack.json` como `frontend/src/data/core-rules.cprpack.json`.
4. Validar integridad de JSON y contratos de tipado.
