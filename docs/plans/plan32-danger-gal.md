# Plan 32: Danger Gal Dossier completo, con porte CEMK

[Claude Code · 2026-11-13]

Reemplaza las versiones v4.7.1 y v4.7.2 del plan 6 (en pausa) y las amplía.

## Contexto

### Qué trae el libro
*Danger Gal Dossier* (2023, 178 páginas). La página impresa coincide con el índice del PDF.

| Parte | Páginas | Qué trae |
|---|---|---|
| Introducción y uso | 5-9 | Cómo usar el libro, glosario y el memo "Emergency Protocol Appleseed" (marco narrativo). |
| 15 facciones | 9-143 | Cada facción trae base de operaciones, historia reciente, recursos y objetivos. |
| Fichas de PNJ | 9-143 y 166-167 | 118 en total: 9 Boss, 16 Mini-Boss, 57 Lieutenant y 36 Mook. 60 de ellas son Hardened. Cada una trae historia, STATs, armas, ciberware y equipo. |
| Kids in Night City | 67 | Recuadro sobre YoGangs: chicos como aliados o enemigos. |
| Extras de facción | 43, 113, 121, 140 | El CrAB Drone, con la NET portátil del CrAB Lord. El Zetatech Herakles de Team Monster, el SovOil Mi-60 de Trauma Team y el Chupacabra de Speed Demon (los tres vehículos son de Black Chrome, con mejoras). |
| New Gear | 144-149 | 15 armas, 8 ciberware y 8 de equipo. 27 de esos 31 ya están en la app, porque vinieron de otros DLC. |
| NPC Creation Guidelines | 150-153 | Niveles de PNJ, Hardening y 6 pasos para crear un PNJ, con plantillas de Mook, LT, Mini-Boss y Boss. |
| The Incident | 154-167 | Aventura. **Queda afuera** por decisión de Giuliano. Sus 2 PNJ (Darius y Nymph) sí entran al bestiario. |
| Listas | 168-174 | Personajes ordenados por facción y por rol. |

Las 15 facciones son 6th Street, Bozos, Danger Gal Puma Squad, Digital Divas, Edgerunners, Generation Red, Maelstrom, NCPD Precinct #1, Network 54, Piranhas, Sightseers, Team Monster, Trauma Team NC4-2, Tyger Claws y Zoners.

### Qué hay hoy en la app
Casi nada de Danger Gal es canon:
- `enemiesCatalog.ts` tiene 95 fichas inventadas, sin página: 11 en L273-599 y 84 en L601-2535.
- La lista `DANGER_GAL_15_FACTIONS` (L94-259) es inventada. Tiene facciones que no están en el libro, como "Continental Brands" y "Zhirafa Combat Robotics".
- Otros inventos: el arma `danger-gal-kitty-smg` del pack, sin página, y la NET `net-danger-gal-archive` (`netAndRolesData.ts` L315).
- Hay docs que mienten: `CONTENT_CHECKLIST.md` L219-224 y L256-259 marcan todo como hecho, y `systemDocsAndChangelogData.ts` dice "118/128 PNJ oficiales".

### Decisiones de Giuliano (2026-11-13)
- Las 95 fichas inventadas **se borran**.
- Entran las fichas de facción, un creador de PNJ guiado y los vehículos y drones de las facciones.
- La aventura The Incident queda afuera.
- **Todas las fichas tienen que tener el porte CEMK**, porque se usan en el setting 2077.
- No hay botón "Usar como PJ".

## Lo que ya existe y se reusa
- **Bestiario generado:**
  - Fuentes en `data/enemies-src/*.json`, con el esquema de `SCHEMA.md`; el prefijo `dg-` ya está previsto.
  - `scripts/gen_enemies.py` (`BOOK_SPECS` L75-81) escribe `frontend/src/data/enemies/<libro>.ts`.
  - `enemiesCatalog.ts` L265-270 junta todo en `ENEMIES_CATALOG`.
- **Porte CEMK:** `engine/cemkPort.ts`, con `portEnemyToCemk(enemy)`.
  - Se aplica solo a toda ficha del bestiario: Neuroport, hackeable, Quickhacks por rango de Interface, Cyberdeck Port, SP contra melee a la mitad, armas Power/Smart/Tech/Melee y control de HP contra la fórmula CEMK.
  - Ya lo usan `EnemiesCompendiumPanel.tsx` L147 (selector CEMK/RED) y `convertEnemyToCharacterSheet` (`enemiesCatalog.ts` L2542).
- **Vehículos y NET:** el catálogo de Black Chrome (`data/blackChromeVehicles.ts`) y las arquitecturas NET (`data/netArchitecturesInterfaceRed.ts` como patrón).
- **Actores y mesa:** los actores guardados del Modo GM (`engine/gmActors.ts`) copian los stats al crearse.
- **Extracción:** la skill `cpr-pdf-extractor`, revisando cada ficha contra el PDF.

## Versiones (una rama por versión, CHECKPOINT y commit en cada paso)

### v5.35.0: las 15 facciones canon
- **Qué es:** fichas de lectura de las 15 facciones.
  - Cada una con base de operaciones, historia reciente, recursos y objetivos, en paráfrasis corta en español, con página.
  - Más el recuadro "Kids in Night City" (p.67).
- **Dónde se ve:** en el bestiario del GM, con la barra de facciones y el filtro (`EnemiesCompendiumPanel.tsx` L1100-1128). Tocar una facción abre su ficha.
- **Cómo afecta:**
  - `DANGER_GAL_15_FACTIONS` pasa a ser la lista canon, en el archivo nuevo `data/dangerGalFactions.ts`.
  - El selector de facción del PNJ custom usa esa lista.
  - No toca fichas guardadas ni reglas de Firestore.
- **Qué se interpretó:** la ficha de facción lleva el texto del libro (año 2045) y una línea "en 2077" solo si la Lore Guide de CEMK la menciona, con su página. Si no la menciona, no se inventa nada.

### v5.36.0 a v5.38.0: las 118 fichas, en tres tandas
| Versión | Facciones | Fichas |
|---|---|---|
| v5.36.0 | 6th Street, Bozos, Puma Squad, Digital Divas y Edgerunners | 41 |
| v5.37.0 | Generation Red, Maelstrom, NCPD, Network 54 y Piranhas | 37 |
| v5.38.0 | Sightseers, Team Monster, Trauma Team, Tyger Claws, Zoners, más Darius y Nymph (pp.166-167) | 40 |

- **Qué es:** cada ficha completa tal cual el libro.
  - STATs, HP, armadura, armas, skills, ciberware, equipo, habilidades especiales y página.
  - Una historia de 1-2 frases en español.
  - Si la ficha es Hardened, su nivel.
- **Dónde se ve:**
  - En el bestiario. Se pueden spawnear en el combate y guardar como actor del Modo GM.
  - Se ven en CEMK por defecto, con el botón para ver la ficha RED original.
- **Cómo afecta:**
  - Archivo fuente `data/enemies-src/danger-gal.json`, nueva entrada en `BOOK_SPECS` y archivo generado `data/enemies/danger-gal.ts`.
  - En la v5.36.0 se borran las 95 inventadas de `enemiesCatalog.ts`.
  - Un actor ya guardado que venía de una ficha inventada conserva sus stats, porque son una copia. Se verifica que el Modo GM no falle al no encontrar el id.
- **Porte CEMK de todas:** sale solo de `portEnemyToCemk`.
  - Los netrunners (como las Digital Divas o el CrAB Lord) pasan el Cyberdeck a Cyberdeck Port y reciben Quickhacks según su Interface.
  - Si el HP del libro no coincide con la fórmula CEMK, gana el libro y la ficha lo anota.
  - Un test confirma que las 118 portean sin errores.
- **Qué se interpretó:** el esquema no tiene campo para la NET portátil del CrAB Lord, así que va en sus `specialRules` y como arquitectura en la v5.39.0.

### v5.39.0: New Gear y vehículos/drones de las facciones
- **Ítems (pp.144-149):**
  - Entran al Compendio los 4 que faltan: Constitutional Arms Multiple Ammo Pistol, Sanroo Hello Cutie MicroCutie, Bicycle y Smart Lens.
  - Los otros 27 ya existen. Se comparan sus stats con el libro: si coinciden, se anota Danger Gal como segunda fuente con su página; si difieren, entran como variante.
  - Se borra la `danger-gal-kitty-smg` inventada.
- **Porte CEMK de los ítems:** las armas nuevas llevan el tipo Power/Smart/Tech que ya calcula el motor del 2077.
- **Vehículos:**
  - El Herakles (p.113), el Mi-60 (p.121) y el Chupacabra (p.140) se muestran en la ficha de su facción.
  - Cada uno con el link al vehículo de Black Chrome y las mejoras propias que lista el libro.
- **Drones y NET:**
  - El CrAB Drone (p.43) entra como defensa.
  - La NET portátil del CrAB Lord (Black ICE Giant, Password, 2 Control Nodes y el Demon Rock Lobster) entra como arquitectura NET.
  - Se borra la `net-danger-gal-archive` inventada.
- **Dónde se ve:** en el Compendio y la tienda (ítems), en las fichas de facción del bestiario (vehículos) y en las arquitecturas NET del GM.
- **Cómo afecta:** si un PJ tiene la kitty-smg inventada, se la deja como ítem suelto y no se rompe su ficha.

### v5.40.0: creador de PNJ guiado (pp.150-153)
- **Qué es:** un asistente de 6 pasos que sigue las NPC Creation Guidelines.
  - Primero se elige el nivel: Mook, LT, Mini-Boss o Boss, y si es Hardened.
  - Después propone los rangos de STATs, skills, armas, armadura y ciberware de la plantilla. El GM los puede pasar por alto, como dice el libro.
  - Se elige la facción de la lista canon y la era (2045 o 2077).
- **Dónde se ve:** en el bestiario del GM, reemplazando el formulario de PNJ custom actual (L310-320).
- **Cómo afecta:**
  - El PNJ creado entra al bestiario custom con su porte CEMK, igual que los del libro.
  - Los PNJ custom ya guardados siguen andando.
- **Qué se interpretó:** el libro aclara que son guías y no reglas fijas, así que los valores son sugerencias editables. Lo que no esté en la tabla de plantillas no se rellena.

## Docs y cierre
- Corregir `CONTENT_CHECKLIST.md` (L219-224 y L256-259) y los textos "118/128 oficiales" de `systemDocsAndChangelogData.ts` para que digan lo real en cada versión.
- El plan aprobado se guarda como `docs/plans/plan32-danger-gal.md` (inmutable).
- En `docs/plans/README.md`, el plan 6 pasa a "reemplazado por el plan 32" y se agrega la fila 32.
- El avance va en `CHECKPOINT.md`.
- Cada cierre de versión lleva el resumen corto (qué es, dónde se ve, cómo afecta, qué se interpretó).

## Archivos principales
- **Datos:** `data/enemies-src/danger-gal.json` (nuevo), `frontend/src/data/enemies/danger-gal.ts` (generado), `frontend/src/data/dangerGalFactions.ts` (nuevo), `frontend/src/data/core-rules.cprpack.json` (+ `data/` espejo), `frontend/src/data/netArchitecturesInterfaceRed.ts` o un archivo NET de Danger Gal.
- **Código:** `scripts/gen_enemies.py` (`BOOK_SPECS`), `frontend/src/data/enemiesCatalog.ts` (se borran L94-259 y L272-2535 y se importa lo generado), `frontend/src/features/gm/EnemiesCompendiumPanel.tsx` (facciones, ficha de facción, creador guiado), `frontend/src/data/netAndRolesData.ts` (se borra la NET inventada).
- **Tests nuevos (`frontend/src/engine/__tests__/dangerGal.test.ts`):**
  - 118 fichas, 15 facciones y conteos por tier.
  - Cada ficha con `sourcePage` entre 9 y 167.
  - Ninguna ficha con un id inventado.
  - Las 118 pasan por `portEnemyToCemk` sin errores, y los netrunners tienen Quickhacks.
  - Los 31 ítems de New Gear existen con su página.
  - Plantillas del creador guiado.

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npx vitest run` y `npm run build` con 0 errores. Este plan no toca `firestore.rules`.
- **En el navegador (local):**
  - Abrir una facción y su ficha.
  - Spawnear un PNJ de cada tanda en el combate y alternar CEMK/RED.
  - Hackear un PNJ con Quickhack.
  - Guardar un actor en el Modo GM.
  - Comprar un ítem nuevo.
  - Crear un PNJ con el asistente.
  - Consola limpia y datos de prueba borrados.
- **Revisión contra el PDF:** muestreo de 2 fichas por tanda (STATs, HP y armas).
- **Publicación:** push, PR, merge, beta y prod piden un OK cada uno.
