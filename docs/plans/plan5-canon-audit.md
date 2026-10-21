# Plan 5 — Canonizar lo que ya está cargado (contenido inventado y a medias)

[Claude Code · 2026-10-21]

## Contexto
La auditoría del scout contra los PDFs mostró que gran parte del contenido "a medias" de la app es **inventado**: hay formas de artes marciales, NPCs, facciones, drogas y armas que no existen en los libros, y valores que no coinciden con ellos. El objetivo es que todo lo que ya está cargado sea **canon, correcto y completo**. Se borra todo lo inventado; no queda homebrew. Los libros nuevos (IR Vol. 1-3, Gang Guide, Woodchipper, etc.) quedan **fuera** de esta pasada, por decisión de Giuliano.

## Hallazgos (qué se arregla)
| # | Bloque | Problema | Archivo principal | Tamaño |
|---|---|---|---|---|
| 1 | Cyberfists (IR4 pp. 77-84) | 10 formas inventadas, 10 faltantes y valores inventados en las que coinciden. Canon: 23 formas × 2 movimientos | `frontend/src/data/cyberfistsMartialArtsData.ts` | M |
| 2 | Danger Gal | ~95 NPCs y 15 facciones inventados. Canon: 16 facciones, ~118 stat blocks (pp. 10-143), New Gear (pp. 144-149) | `frontend/src/data/enemiesCatalog.ts` (`DANGER_GAL_15_FACTIONS` l.83) | L |
| 3 | Hardened | De 10 entradas `dlc` (l.690-960), solo 3-4 son reales. Canon: 4 Mooks, 6 Lieutenants, 6 Mini-Bosses y el Punknaught | `enemiesCatalog.ts` | M |
| 4 | Red Chrome Cargo | Datos mayormente inventados (p. ej. "Ballistic Coprocessor"). Canon: Boosterganger, Security Operative y Automated Turret del Core, mainframe de 5 pisos y DV 13/9/15 | `frontend/src/data/redChromeCargoData.ts` | S-M |
| 5 | Hornet's Pharmacy | Hover, Red Glass y Detox son inventados; "Berserk" debe ser Berserker; Timewarp figura como core. Canon: 12 entradas | pack + `expansionRulesData.ts` l.379-420 | S |
| 6 | 12 Days of Gunmas | Faltan las 12 armas. Erebus, Fox y Kolokol no son de ese libro | pack | S |
| 7 | Black Chrome (+ BC+ de IR4) | Hay 31 de ~160 ítems y los vehículos están cargados como gear | pack + vista nueva | L |
| 8 | Errata v1.25 | ~15 erratas tocan datos de la app (Grafted Muscle, munición, Linear Frames Beta/Sigma, Techtool, Autofire, Security Officer…) | pack + data | S-M |
| 9 | Docs | CONTENT_CHECKLIST (l.143-158, 244-250, 262), README (l.55-56) y STATUS (l.16) declaran totales falsos; el pack real tiene 349 ítems | docs | S |
| 10 | Armas CEMK 2077 (Tamayura, Achilles, Chao) | No aparecen en ningún PDF. Antes de decidir, verificar en el zip del Mission Kit: si están, quedan; si no, se borran | `enemiesCatalog.ts` l.1004, 1009, 1180, 1225, 1239, 1303, 1751 | S |

## Versiones (en orden de valor)
1. **v4.5.1 Cyberfists:** 23 formas canon, se borran las 10 inventadas y se corrigen los movimientos.
2. **v4.6.1 Farmacia + Gunmas + Errata:** bloques 5, 6 y 8. Son chicos y tocan el mismo pack.
3. **v4.7.0 Enemigos canon:** Danger Gal + Hardened + Red Chrome Cargo + verificación CEMK (bloques 2, 3, 4 y 10). Reemplaza al plan 3 perdido. Incluye el New Gear de Danger Gal. La aventura "The Incident" no se carga como contenido jugable; queda solo una referencia.
4. **v4.8.0 Black Chrome completo + catálogo de vehículos:** categoría `vehicles` en el pack (SDP, SP, asientos, velocidad combate/narrativa, costo, notas), una lista en el Compendium y "agregar al personaje" sobre el tipo `OwnedVehicle` existente. Los 5 vehículos que hoy son gear se migran. Incluye Black Chrome+ de IR4 y el Punknaught de Hardened. Night Markets como tabla de referencia.
5. **v4.8.1 Docs:** totales reales en CONTENT_CHECKLIST, README y STATUS, firmados.

## Método (por versión, siempre con subagentes en Sonnet)
1. **Extracción (scout):** con `.venv\Scripts\python.exe -I scripts\inspect_pdf_pages.py "<pdf>" a b`, el scout devuelve los datos canon en JSON compacto y la lista de ids inventados que hay que borrar. Los números se verifican a mano en las páginas donde la extracción rompe ligaduras.
2. **Consumidores (scout):** buscar los ids que se borran en `rules.test`, `weaponAndCyberwareTooltips.ts`, premades, CombatHudView, StreetLabView y NetAndRolesDeckView.
3. **Aplicación (worker):** con una spec quirúrgica (contrato de AGENTS.md), escribe los datos canon, borra lo inventado y reapunta o borra las referencias rotas. Para el pack edita **ambas copias** (`frontend/src/data/core-rules.cprpack.json` y `data/`) y también las listas `EXPANSION_*` de `scripts/extract_core_pack.py` (l.1464-2977), para que regenerar el pack no reintroduzca lo inventado.
4. **Auditoría (yo):** `git diff` fuera de alcance, `tsc`, `npm test`, build y navegador en la pestaña afectada.
5. **Cierre:** changelog con `author: 'Claude Code'`, CHECKPOINT firmado, una rama `claude/<tema>` por versión, PR a main y publicación en gh-pages al cerrar cada versión.

## Documentación obligatoria (cada versión)
- **Procedencia en cada ítem:** cada entrada canon lleva un campo `source` con libro y página (p. ej. `{ book: 'Danger Gal Dossier', page: 42 }`), que se muestra en la UI como "Fuente: DGD p.42". Lo que no tenga fuente verificable no entra.
- **Registro de cambios por versión:** `docs/canon-audit/v<X>.md`, firmado `[Claude Code · AAAA-MM-DD]`, con tres listas:
  - **Se perdió:** cada ítem inventado borrado, con su id, nombre y motivo ("no existe en <libro>").
  - **Se ganó:** cada ítem canon nuevo, con su id, nombre, libro y página.
  - **Se corrigió:** cada ítem existente cuyo valor cambió, con el valor anterior, el nuevo y la fuente.
  - Las referencias reapuntadas (tests, tooltips y premades) también se anotan.
- **Índice:** `docs/canon-audit/README.md` con el estado de cada libro (canon completo / parcial / fuera de alcance) y los conteos reales.
- **Changelog** de la app y `CHANGELOG_AND_ARCHITECTURE.md` con un resumen de lo perdido, lo ganado y lo corregido, más un enlace al registro.
- **Checkpoints:** CHECKPOINT.md se actualiza y se firma al terminar cada fase (extracción, aplicación, auditoría, publicación) y antes de compactar, siguiendo el skill `checkpoint` / `cierre-sesion`. El hook Stop lo controla.

## Archivos críticos
- `frontend/src/data/cyberfistsMartialArtsData.ts`, `enemiesCatalog.ts`, `redChromeCargoData.ts` y `expansionRulesData.ts`
- `frontend/src/data/core-rules.cprpack.json` + `data/core-rules.cprpack.json` + `scripts/extract_core_pack.py`
- Nuevos para v4.8.0: tipo `vehicles` en los tipos del pack, una vista de vehículos en el Compendium y el uso de `OwnedVehicle` en `useCharacterStore.ts`
- Docs: `CHECKPOINT.md`, `CONTENT_CHECKLIST.md`, `README.md`, `PROJECT_STATUS_AND_ROADMAP.md` y `CHANGELOG_AND_ARCHITECTURE.md`

## Verificación
- `npx tsc --noEmit`, `npm test` (33 tests más los nuevos: conteo de formas = 23, de facciones = 16, sin ids inventados en ninguna data y cobertura de zonas del cyberware) y `npm run build`.
- Navegador (`omni-deck-dev`, puerto 5173): Street Lab y Combat HUD con cyberfists, enemigos en el Compendium/GM, Compendium de vehículos y agregar un vehículo a un personaje.
- Muestreo canon: el scout coteja 5 ítems al azar de cada bloque contra la página del PDF.
- Tras publicar, verificar en vivo en https://notefuk.github.io/Cyberpunk-/.

## Fuera de alcance
IR Vol. 1-3 (incluido el OCR del Vol. 3), Gang Guide, Woodchipper, Must-Have Cyberware, Midnight with the Upload, Settings mode y GM Master Screen.
