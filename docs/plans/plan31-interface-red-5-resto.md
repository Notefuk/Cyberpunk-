# Plan 31: resto del Interface RED Vol. 5

[Claude Code · 2026-11-13]

## Contexto
El plan 30 cerró "Solo of Fortune 2045" (IR5 pp.105-147: arsenal y ACPA), y el resto del volumen quedó anotado en `CONTENT_CHECKLIST.md`. Este plan lo trae completo.

Decisiones de Giuliano (2026-11-13):
- Entra todo: catálogos, generadores del GM, durabilidad, investigación, cyberpets y nivel mercenario.
- **Durabilidad completa en la ficha.** Estado Damaged por ítem, mantenimiento, fallas y reventa.
- **Investigación con Focus en la ficha.** Además, un tracker de misterios en el Modo GM.
- **Cyberpets en el bestiario.** También como "Mascota" en la ficha del PJ.

Fuente:
- PDF: `Sourcebooks\Interface-RED\ilide.info-interface-5-pr_…pdf`.
- Página impresa = índice del PDF en base 0; o sea, la página del visor menos 1.
- Convenciones:
  - `sourceBook: 'interface_red'`, título "Interface RED Volume 5" y `sourcePage` impresa.
  - Cada archivo nuevo lleva la cabecera `// [Claude Code · fecha] vX.Y.Z (plan 31): …` con libro y páginas.
  - Extracción con la skill `cpr-pdf-extractor`, revisando cada fila contra el PDF.

## Lo que ya existe y se reusa
- **Generadores:** el patrón de Night Market (`data/nightMarketTables.ts`, `engine/nightMarket.ts` con `Rng` inyectable, `features/gm/NightMarketPanel.tsx`) y las tablas genéricas (`data/gmTables/types.ts` `GmTable`, `engine/gmTables.ts` `rollOnTable`).
- **Aventuras:** `GmAdventure` y `HALLOWEEN_ADVENTURES` en `data/gmTables/halloween.ts`. Se muestran en `features/gmtables/GmTablesView.tsx`, con una pestaña por set.
- **Reparación:** `engine/armorRepair.ts` (`ITEM_REPAIR_TABLE`, `armorRepairInfo`) y `engine/makerRules.ts` (`juryRigDurationMinutes`, `makerDvAndTime`).
- **Calidad y accesorios de armas:** `data/weaponAttachmentsAndTechData.ts`.
- **Enemigos y actores:** `data/enemies/interface-red.ts`, el bestiario y los actores guardados (`engine/gmActors.ts`).
- **NET:** `data/netArchitecturesInterfaceRed.ts`, para la arquitectura del rancho McAlister.
- **Docs del GM:** el doc `gm/{docId}` de Firestore, que tiene una allowlist de ids con forma y tamaño.

## Versiones (una rama por versión, commit y CHECKPOINT en cada paso)

### v5.29.0: catálogos
- **Agents (pp.23-34):**
  - Breacher y Crunch Whistle.
  - 11 apps y 4 Agents externos.
  - 4 Internal Agents como opción de Cyberaudio, con su HL.
  - Las DV de hackear un Agent (remoto, acceso físico, implantar comandos) como tabla de referencia.
- **Toggle's Temple:**
  - 72 armas (6 por cada uno de los 12 tipos), tomadas de las tablas de resumen de las pp.54-59.
  - Cada una con calidad, slots, sus accesorios preinstalados y sus reglas especiales en `notes`.
  - 3 accesorios nuevos (p.48).
- **12 Days of REDmas (pp.97-104):** 14 ítems.
  - Sin duplicados: el Sycust Cyberspine ya está, y el Stun Bayonet y el Light Metalgear se comparan con lo existente. Si los stats difieren, entra como variante con su página.
  - El Long-Barreled Pistol de Nat lleva su tabla de rango propia en `rangeTables.ts`.
- **Otros:** Roller Derby Padding y Skates (p.21), y los 7 ciberware de cyberpets (p.82). El costo "1,00eb" del Nanomatrix es una errata y se anota.
- **Tests:** conteos por sección y página citada, como en `ir5Catalog.test.ts`.

### v5.30.0: generadores del GM (pestañas nuevas en TABLAS DEL GM)
- **Screamsheet (pp.83-96):**
  - Tabla A (1d6) elige el tipo; después, intro, cuerpo y cierre (1d6 cada uno) y el titular según los códigos que permite el cierre.
  - Los campos entre corchetes quedan como inputs, para completarlos al estilo improv que propone el libro.
  - Firma de uno de los 12 periodistas.
  - Se puede copiar como texto para dárselo a los jugadores.
- **Gunpath (pp.48-53):**
  - Fabricante (1d100), tipo (1d10 y sub-tirada), calidad (1d6), accesorios por habilidad, costo y categoría.
  - El nombre sale de su tabla (1d100). El libro no da listas de palabras, así que los huecos quedan para completar.
  - Botón "Llevar al Night Market o al inventario" si se puede reusar la ficha de arma existente.
- **Referencias:**
  - Reglas de roller derby (pp.18-21): posiciones, penalizaciones, Iniciativa con MOVE y las 4 maniobras.
  - Los 14 avisos del Hiring Hall (p.132).
  - La tabla de parámetros de misión mercenaria (p.108).
- **Motor:** `engine/screamsheet.ts` y `engine/gunpath.ts`, puros con `Rng` inyectable, con tests de cobertura de dados.

### v5.31.0: durabilidad (Breaking Your Stuff, pp.3-12)
- **Ficha:** estado por ítem `condition?: 'damaged' | 'destroyed' | 'beyond_repair'` en armas, armaduras, ciberware y equipo. Se marca y se desmarca desde ARSENAL & BLINDAJE y el Ripperdoc.
- **Mantenimiento** (`engine/maintenance.ts`):
  - Es automático si el Lifestyle del PJ alcanza el tier del ítem.
  - Si no, va un chequeo mensual con DV y tiempo según la tabla Maintenance Basics y la habilidad según Maintenance Skills.
  - Los Roles suben un nivel (Tech, Solo y Lawman en armas y armaduras, etc.), y el equipo de Rol del Exec, el Medtech y el Nomad queda exento.
  - El mantenimiento quita Damaged.
- **Fallas:** las 11 tablas 1d6, tiradas desde el ítem dañado y con su duración. Va también la regla opcional del 1 natural y el Jury Rig del Maker.
- **Reventa:** Damaged baja una categoría y Destroyed baja dos, en la venta, el Night Market y el saqueo.
- **Detectarlo:** DV13 Tech; los Fixer con Operator 4+ lo ven automáticamente.

### v5.32.0: investigación (Did Someone Say Murder?, pp.61-70)
- **Focus en la ficha:**
  - Máximo `10 + 5 × ceil((INT+WILL)/2)` (tabla de la p.63).
  - Daño y recuperación: INT+WILL con el descanso, +5 con una tirada DV15 de Concentration.
  - Con 0 Focus no se hacen Evidence Checks.
- **Tracker de misterios en el Modo GM:**
  - Objetivo, Complexity (5 niveles) y pistas con su tipo (12), su DV y su Obfuscation.
  - La Evidence Check resta el daño menos la Obfuscation; si falla, el PJ pierde Focus; con pifia, aparece una complicación.
  - Obstáculos (13 tipos más el Ticking Clock), y la deducción DV15, que cuesta 1d6 de Focus.
  - Los 2 misterios de ejemplo como presets.
- **Mesa online:**
  - El tracker se guarda en el doc `gm/mysteries`. Hay que agregarlo a la allowlist de `firestore.rules` con forma y tamaño, más sus tests de reglas.
  - El daño de Focus a un PJ va por la misma vía que el daño del GM.

### v5.33.0: cyberpets (pp.71-82)
- **Bestiario:** las 8 mascotas con su ficha completa (pp.74-81) y sus habilidades especiales. Entran en `data/enemies/interface-red.ts` y sirven como enemigos y actores.
- **"Mascota" en la ficha:**
  - Se compra desde el bestiario o el Compendio y guarda su HP, su SP y sus slots de ciberware.
  - Su Lifestyle mensual aparece junto al del PJ, y ocupa camas de Housing según su nivel.
  - Obedece si INT + Animal Handling del dueño es 10 o más; si no, hay un botón de tirada.
  - Ciberware para la mascota: Medtech con Science (Biology) 4+ y entrenamiento de 1 día con DV igual a la de instalación.

### v5.34.0: nivel mercenario (pp.106-108, 132, 144-147)
- **Presupuesto operativo:** una billetera aparte en la ficha para gastar en equipo de la misión. Al terminar la misión se vacía; lo comprado vuelve al armory y la plata que sobra se pierde.
- **Reglas de nivel mercenario** como referencia, incluido el "Hot Tip" para endurecer PNJ (p.106).
- **Las 2 misiones** como aventuras (`GmAdventure`), en una pestaña "Solo of Fortune":
  - Georgia On My Mind, con Kelly McAlister, los 2 drones, las trampas y la arquitectura NET de 6 pisos.
  - Trouble in Tanzania, con la batería antiaérea y las oleadas. Las oleadas usan las ACPA y los enemigos Hardened que ya existen.

## Archivos principales
- **Datos:** `data/core-rules.cprpack.json`, `data/rangeTables.ts`, `data/gmTables/screamsheet.ts` y `gunpath.ts` (nuevos), `data/maintenanceTables.ts` (nuevo), `data/mysteryData.ts` (nuevo), `data/enemies/interface-red.ts`, `data/gmTables/solo-of-fortune.ts` (nuevo), `data/netArchitecturesInterfaceRed.ts`.
- **Motor:** `engine/screamsheet.ts`, `engine/gunpath.ts`, `engine/maintenance.ts`, `engine/mystery.ts` (todos nuevos) y `engine/characterEngine.ts` (Focus).
- **Tipos y store:** `types/cyberpunk.ts` (`condition`, `focus`, `pet`, `opBudget`) y `store/useCharacterStore.ts`.
- **UI:** `features/gmtables/GmTablesView.tsx`, `features/sheet/StreetLabView.tsx` y paneles nuevos en `features/sheet/`, `features/gmmode/` (tracker), `features/cyberware/CyberwareRipperdocView.tsx`.
- **Reglas:** `firestore.rules`, solo en la v5.32.0, con sus tests.

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npx vitest run` y `npm run build`, con 0 errores. En la v5.32.0, también `npm run test:rules`.
- **Tests:** conteos y páginas del catálogo, cobertura de dados de cada tabla, las fórmulas de Focus y de mantenimiento, y la reventa.
- **En el navegador (local):**
  - v5.29.0: los ítems en el Compendio y una compra.
  - v5.30.0: una screamsheet y un arma generadas.
  - v5.31.0: marcar Damaged, mantenimiento y tirada de falla.
  - v5.32.0: un misterio de ejemplo de punta a punta.
  - v5.33.0: comprar una mascota y que obedezca.
  - v5.34.0: gastar el presupuesto y cerrar la misión.
- Consola limpia.
- **Publicación:** push, PR, merge, beta, prod y reglas de Firestore piden un OK cada uno.

## Cierre
- El plan aprobado se guarda como `docs/plans/plan31-interface-red-5-resto.md` (inmutable).
- El avance va en `CHECKPOINT.md`.
- El estado va en `docs/plans/README.md`.
