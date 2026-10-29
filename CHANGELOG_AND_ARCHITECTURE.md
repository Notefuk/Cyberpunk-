# CPR OMNI-DECK // System Architecture, Dependency Graph & Master Changelog

> **DOCUMENT PURPOSE**: This document serves as the single source of truth for the project's technical architecture, component dependency chains, and detailed version evolution. It is explicitly authored to be read and understood by human developers and future Large Language Models (LLMs such as Claude, ChatGPT, etc.) so that any future modification respects the underlying system mechanics without accidental regressions or phantom file imports.

---

## 🤖 Instructions for Future AI Models (Claude, ChatGPT, etc.)
When tasked with modifying, refactoring, or extending this repository, **you must read and adhere to the following rules**:

1. **Architecture Decoupling (The COMP/CON Model)**:
   - Never hardcode rules or items into UI views directly.
   - Core static rules and book data reside in `data/` and `src/data/` as modular `.cprpack.json` files and typed TypeScript registry modules (`rangeTables.ts`, `criticalInjuries.ts`, etc.).
   - The UI in `src/features/` acts as a pure reactive consumer of Zustand stores (`useCharacterStore`, `useCombatStore`).
2. **System Dependencies & Cascade Effects**:
   - **Range & DV System (`src/data/rangeTables.ts`)**: Distance brackets: `0-6m`, `7-12m`, `13-25m`, `26-50m`, `51-100m`, `101-200m`, `201-400m`, `401-800m`. Do NOT change DV values without citing official Cyberpunk RED Core Rulebook (pg. 174).
   - **Combat Engine (`src/engine/combatEngine.ts`)**:
     - Check: `STAT + Skill + 1d10`. On 10, explodes with another `+1d10`. On 1, critical failure rolls `1d10` and subtracts.
     - Damage is rolled separately: `Xd6` (or `2d6 * multiplier` for Autofire). Two or more `6`s trigger an automatic Critical Injury (inflicting +5 bonus HP damage).
     - Armor ablation: if rolled damage exceeds target current SP, target takes `damage - SP` to HP and armor SP is reduced by 1 (or 2 for Armor-Piercing ammo).
   - **Weapons & Ammo**: Attack execution consumes ammunition (`consumeAmmo`). Autofire consumes 10 bullets. Reload resets `currentMag` to `standardMag`.
   - **Critical Injuries (`src/data/criticalInjuries.ts`)**: Uses exact 2d6 tables from Core Book (pg. 187-188) for Head and Body.
   - **Visual Placeholders (`src/components/ItemVisualPlaceholder.tsx`)**: Every item rendered in combat or compendium maps cleanly to an item type placeholder (`pistol`, `rifle`, `smg`, `shotgun`, `melee`, `heavy`, `armor_body`, `shield`, `cyberware`, `program`).
3. **DO NOT INVENT FILES**:
   - Only files listed in the **Current Real Tree on Disk** section exist.
   - Any feature listed under **Roadmap Pendiente** must be implemented cleanly in its assigned directory before importing it anywhere.

---

### 🗺️ Current Real Tree on Disk (`v4.0.2 - CEMK Canonical Quickhacking [Zero RAM], Damage Calculator & Two-Row HUD Headers`)

```text
cpr-omni-deck/
├── .agent/
│   └── skills/
│       └── cpr-pdf-extractor/
│           └── SKILL.md                  # Protocolo de extracción CLI y esquema .cprpack.json
├── data/
│   └── core-rules.cprpack.json           # Catálogo maestro canónico (272 ítems oficiales)
├── scripts/
│   ├── extract_core_pack.py              # Ingesta y validación real de páginas del Core Rulebook
│   ├── find_sections.py                  # Inspector de bookmarks y outline del PDF
│   ├── inspect_pdf_pages.py              # Inspector CLI UTF-8 de páginas por rango
├── frontend/
│   ├── public/
│   │   ├── hammerhead-map.png            # Plano esquemático canónico del tren Maglev Hammerhead (Red Chrome Cargo)
│   │   ├── screamsheet-p2.png            # Recorte canónico original del Screamsheet pág. 2
│   │   └── tokens/cemk/                  # 7 tokens oficiales PNG recortados de folios canónicos CEMK
│   ├── src/
│   │   ├── components/
│   │   │   └── ItemVisualPlaceholder.tsx # Frames militares tácticos SVG/Lucide por categoría
│   │   ├── data/
│   │   │   ├── cemkFolioPremadesData.ts  # 7 Folios oficiales CEMK 2077 (28 págs, 66 skills, armas y cromo)
│   │   │   ├── characterCreationData.ts  # Catálogo canónico de creación, Lifepath, pregenerados y deuda
│   │   │   ├── core-rules.cprpack.json   # Catálogo maestro multi-libro (368 ítems canónicos)
│   │   │   ├── criticalInjuries.ts       # Tablas oficiales 2d6 de heridas críticas (Head/Body)
│   │   │   ├── cyberfistsMartialArtsData.ts # 23 artes marciales y 46 movimientos (Interface RED Vol 4)
│   │   │   ├── enemiesCatalog.ts         # Bestiario táctico de 44 enemigos, goons y bosses para el GM
│   │   │   ├── expansionRulesData.ts     # Compendio de 8 sistemas de reglas de expansiones (FBC/2077)
│   │   │   ├── goingMetalFbcData.ts      # 13 chasis FBC, 16 cyberware borg e inmunidades (Interface RED 3)
│   │   │   ├── netAndRolesData.ts        # Arquitecturas de red 2045, Quickhacks 2077 y 10 Habilidades de Rol
│   │   │   ├── rangeTables.ts            # Matrices oficiales de DVs por metro y Autofire
│   │   │   ├── redChromeCargoData.ts     # Misión oficial Red Chrome Cargo CEMK 2077 (mapa, escenas, botín)
│   │   │   ├── rulesCheatSheet.ts        # Machete canónico de reglas de combate, coberturas y asfixia
│   │   │   ├── systemDocsAndChangelogData.ts # Base de datos canónica de versiones, inventario y arquitectura
│   │   │   ├── weaponAndCyberwareTooltips.ts # Diccionario canónico de tooltips de armas, ciberware y municiones
│   │   │   └── weaponAttachmentsAndTechData.ts # Catálogo oficial de 13 accesorios, ranuras, taller Maker y Lifepaths
│   │   ├── engine/
│   │   │   ├── __tests__/rules.test.ts   # Tests Vitest de reglas canon con cita de página [Claude Code · 2026-10-20]
│   │   │   ├── characterEngine.ts        # Motor matemático: HP máx, humanidad, penalizadores, Death Saves, EMP efectiva
│   │   │   └── combatEngine.ts           # Motor de resolución: d10 explosivo, Xd6, doble 6 crítico, calculadora de impactos
│   │   ├── features/
│   │   │   ├── combat/
│   │   │   │   └── CombatHudView.tsx     # HUD de combate táctico, selector de DVs y dados
│   │   │   ├── compendium/
│   │   │   │   └── CompendiumView.tsx    # Compendio modular de 8 categorías con equipamiento
│   │   │   ├── creator/
│   │   │   │   └── CharacterCreatorWizard.tsx # Asistente guiado de 6 pasos para creación de personajes
│   │   │   ├── cyberware/
│   │   │   │   └── CyberwareRipperdocView.tsx # Menú Ripperdoc 2077 con maniquí holográfico y ranuras
│   │   │   ├── docs/
│   │   │   │   └── SystemChangelogAndDocsView.tsx # Portal in-app de documentación, changelog e inventario
│   │   │   ├── gm/
│   │   │   │   ├── EnemiesCompendiumPanel.tsx # Bestiario con filtros por facción e inyección al combate
│   │   │   │   └── FixerDeckView.tsx     # Consola GM Fixer con PIN, control global y monitor del equipo
│   │   │   ├── layout/
│   │   │   │   └── TopHudBar.tsx         # Barra superior persistente con vitals del edgerunner
│   │   │   ├── netroles/
│   │   │   │   └── NetAndRolesDeckView.tsx # Simulador Netrunning 2045, Quickhacks 2077, Garaje y 10 Roles
│   │   │   ├── oneshot/
│   │   │   │   └── RedChromeCargoView.tsx # Centro de mando táctico interactivo de Red Chrome Cargo CEMK
│   │   │   ├── cloud/                    # [Claude Code · 2026-10-24] v5.0.0
│   │   │   │   ├── CloudTableView.tsx    # Pestaña MESA // CAMPAÑA: login, fichas en la nube y subida
│   │   │   │   └── CampaignPanel.tsx     # Campañas: link, unirse, asignar ficha, party, GM
│   │   │   ├── datapacks/
│   │   │   │   └── DataPackManagerView.tsx # Gestor interactivo de paquetes .cprpack estilo COMP/CON
│   │   │   ├── rules/
│   │   │   │   └── RulesCheatSheetDrawer.tsx # Drawer táctico deslizable con machete de reglas de mesa
│   │   │   └── sheet/
│   │   │       └── StreetLabView.tsx     # Ficha completa, editor de stats y roster de personajes
│   │   ├── store/
│   │   │   ├── useCharacterStore.ts      # Store Zustand con persistencia (fichas, inventario, heridas)
│   │   │   └── useCombatStore.ts         # Store Zustand de combate (DVs, objetivos, logs de tiradas)
│   │   ├── sync/                         # [Claude Code · 2026-10-24] v5.0.0: mesa online (Firebase), ver AI_CONTEXT_HANDOFF.md
│   │   ├── types/
│   │   │   └── cyberpunk.ts              # Tipos de TypeScript canónicos de Cyberpunk RED
│   │   ├── App.tsx                       # Integrador de vistas principales del Omni-Deck
│   │   ├── index.css                     # Chamfered corner styles y tokens visuales de interfaz
│   │   └── main.tsx                      # Vite React entry point
│   ├── index.html                        # Google Fonts (Rajdhani, Inter, JetBrains Mono)
│   ├── package.json
│   └── vite.config.ts                    # Vite config con Tailwind CSS
├── CHANGELOG_AND_ARCHITECTURE.md         # ESTE DOCUMENTO
└── CONTENT_CHECKLIST.md                  # Checklist de cobertura de reglas por fases y versiones
```

---

## 📜 Master Version Changelog

### [v5.4.0] - 2026-10-29 (Creador más libre y que explica: texto propio, STATs, rol arriba, idiomas, skills de arma y Autofire, paquete en Complete Package) [Claude Code · 2026-10-29]
* **Category**: Creador de personajes (plan 21, `docs/plans/plan21-creador-tienda-ficha.md`, primera de tres versiones).
* **What Changed**:
  * Lifepath: cada tabla suma "✎ Otro (escribir)" para poner un resultado propio que no está en la tabla; llega a la ficha igual que uno de la tabla. Vale también para el Lifepath de rol.
  * STATs: el paso de STATs muestra "Qué hace cada STAT", una tarjeta por STAT con qué hace, las reglas que dependen de él con su página (por ejemplo, REF 8 o más para esquivar tiros, Core p.172; HP, Death Save y daño de Brawling por BODY, Core pp.79, 176 y 222; Humanidad = EMP × 10, Core p.80; Facedown con COOL, Core p.194) y las skills que lo usan. El ⓘ de cada STAT también lo muestra.
  * Habilidad de rol arriba de todo en el paso de skills, con su texto de rango 4 y página. El Medtech reparte Medicine (Surgery, Pharmaceuticals, Cryosystem) y el Tech, Maker, ahí mismo, con una explicación de qué hace cada especialidad (Core pp.147-150); el reparto llega a la ficha. El panel de la ficha (pestaña ROL) muestra las mismas explicaciones.
  * Idiomas: el texto dice que es UN idioma de origen a rango 4 gratis (Core p.45 y p.90), con Streetslang aparte en 2 (Core p.85). En Complete Package se pueden sumar otros idiomas con puntos ("+ otro idioma").
  * Skills de arma: cada skill de combate dice qué armas cubre y su tirada (Handgun: pistolas y SMG en tiro simple; Shoulder Arms: escopetas y rifles; etc., Core pp.83-84, 171, 176), con una nota de que en RED no hay "proficiencia". Cuadro "Cómo funciona Autofire" con las reglas de Core pp.173-174 (10 balas, REF + Autofire, 2d6 × margen hasta ×3/×4, Suppressive Fire, no reemplaza a Handgun ni a Shoulder Arms); si el paquete o las compras traen un SMG o un Assault Rifle se abre solo y sugiere poner puntos.
  * Complete Package: en EQUIPO se elige entre comprar todo suelto con 2.550 €$ (Core p.104) o el paquete del rol + 500 €$ (Core p.98), marcado como variante de mesa (decisión de Giuliano). Los 800 €$ de moda siguen en los dos casos.
* **Files Modified**: `frontend/src/features/creator/steps/StatGuide.tsx`, `frontend/src/data/creation/weaponSkillGuide.ts`, `frontend/src/engine/__tests__/creatorV540.test.ts` (nuevos); `features/creator/steps/LifepathStep.tsx`, `StatsStep.tsx`, `SkillsStep.tsx`, `GearStep.tsx`, `SummaryStep.tsx`; `features/sheet/RoleAllocationPanel.tsx` (`RoleAllocationEditor` sin store); `engine/characterCreation.ts` (`usesRolePackage`, `cpUsePackage`, `makerAllocation`/`medicineAllocation` en el borrador, idiomas extra); `data/characterCreationData.ts` (STAT_TOOLTIPS completos); `data/creation/coreGearSkills.ts` (descripción de Autofire); `engine/__tests__/cyberwareEffects.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 474 tests y build. En el navegador local, tamaño iPad (768×1024): "Otro (escribir)" guarda "Colonia lunar de Tycho" y cuenta como respondida; guía de STATs con REF; bloque de Medicine con Surgery 2 → "Surgery nivel 4" guardado en el borrador; idioma extra "Language (Japanese)"; selector de paquete con el paquete del Netrunner y 500 €$.

### [v5.3.2] - 2026-10-29 (Arreglos del creador que salieron de probar el Complete Package) [Claude Code · 2026-10-29]
* **Category**: Creador de personajes / tienda (pedido de Giuliano tras crear "Kuroi" y "Kessler" en prod; sin plan: arreglos).
* **What Changed**:
  * Neuroport (2077): la tienda bloquea, con cartel, lo que ya trae el Neuroport (Neural Link, Interface Plugs, Biomonitor, Chipware Socket, Chyron, Virtuality y Virtuality Goggles; CEMK RB p.36), y el paso de equipo no avanza si quedó alguno en las compras. La nota del Neuroport lista las 7 piezas del libro (antes decía "Agent").
  * Ficha: el Neuroport de la creación muestra "HL: 0" y desinstalarlo no devuelve Humanidad (CEMK RB p.25). Desinstalar cualquier ciberware desde STREET LAB devuelve su HL real (antes, siempre 7).
  * Cyberdecks: se suman el Poor (100 €$, 5 slots) y el Excellent (1.000 €$, 9 slots) (Core p.196) y las 6 piezas de Hardware (Backup Drive, DNA Lock, Hardened Circuitry, Insulated Wiring, KRASH Barrier, Range Upgrade; 100 €$, 1 o 2 slots; Core p.208). Programas y Hardware cuentan contra los slots del mazo, y el Bodyweight Suit suma 1 slot solo para Hardware. Pasarse solo avisa (decisión de Giuliano), en la tienda y en el resumen; la pestaña NET muestra los slots con el Hardware.
  * Tienda: cada ítem dice de qué libro sale y la página si el pack la trae (p. ej. "Core RED p.196", "DLC: 12 Days of Gunmas p.5", "Black Chrome"). No se bloquea nada por libro (decisión de Giuliano).
  * La armadura comprada que queda puesta ya no se repite en la mochila.
  * STREET LAB: la fórmula de HP se muestra "10+5×⌈(BODY+WILL)/2⌉".
* **Revisado sin cambios**: la tabla de origen cultural del CEMK se tira con 2d6 y va de 2 a 12 (CEMK RB p.19).
* **Files Modified**: `frontend/src/engine/creatorShop.ts`, `frontend/src/engine/__tests__/creatorShop.test.ts` (nuevos); `engine/characterCreation.ts`, `features/creator/steps/GearStep.tsx`, `features/sheet/StreetLabView.tsx`, `features/netroles/NetAndRolesDeckView.tsx`, `data/core-rules.cprpack.json` (y su copia en `data/`); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 466 tests y build. En el navegador local: Neural Link e Interface Plugs bloqueados con cartel, error si quedan en las compras, "Usás 7/5 slots: sobran 2", etiquetas con libro y página; ficha con Neuroport "HL: 0" (desinstalar no cambia la Humanidad), HP "10+5×⌈(5+6)/2⌉", Kevlar sin copia en la mochila y NET "6/5 slots (Hardware: 2)".

### [v5.3.1] - 2026-10-29 (Descargar todas las fichas de la nube) [Claude Code · 2026-10-29]
* **Category**: Nube / respaldo (pedido de Giuliano, sin plan: tarea chica).
* **What Changed**: en MESA // CAMPAÑA, "Tus fichas en la nube" suma el botón "Descargar todas las fichas ⬇". Baja un archivo por ficha, llamado "Personaje - Rol (Jugador).json": las tuyas, con tu nombre de cuenta, y, si sos GM, las de tus jugadores que tenés cargadas, con el nombre de cada jugador. El contenido es el mismo que "Descargar" de STREET LAB, así que se vuelven a cargar con "IMPORTAR FICHA (archivo)". Se sacan del nombre los caracteres que Windows no acepta.
* **Files Modified**: `frontend/src/utils/characterFile.ts`, `frontend/src/utils/__tests__/characterFile.test.ts` (nuevos); `frontend/src/features/cloud/CloudTableView.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 459 tests y build. En el navegador, con el emulador: el GM baja "Hardpoint [CEMK Folio] - Solo (gm).json", "Insurance [CEMK Folio] - Medtech (gm).json" y la ficha de la jugadora de su campaña, "Wrench [CEMK Folio] - Nomad (jugadora).json"; los archivos los lee el importador (`parseFullBackup`).

### [v5.3.0] - 2026-10-28 (Secretos del GM en la nube, revelar a la mesa y PIN solo local) [Claude Code · 2026-10-28]
* **Category**: Nube / GM (plan 20, `docs/plans/plan20-gm-actua-sobre-la-mesa.md`; segunda mitad de la fase 3 del plan 16).
* **Secretos del GM por campaña** (`sync/gmSecrets.ts`, nuevo): con mesa activa de GM, las notas secretas del Fixer, los PNJ propios y las arquitecturas NET propias se leen y guardan en `campaigns/{c}/gm/notes|npcs|net` (solo los ve el GM). Se suben 1,5 s después de dejar de escribir (máximo 5 s) y lo pendiente se sube al cerrar la mesa. La primera vez se copia lo que el GM tiene local, con aviso ("Copié tus notas, NPCs, NET..."); la clave local no se toca. Sin mesa, todo sigue local como antes.
* **Revelar a la mesa**:
  * Enemigo: el GM toca "Revelar" en el orden de iniciativa y los jugadores ven "Ficha" con facción, nivel de amenaza, SP de cabeza y cuerpo, armas y reglas especiales. Nunca los HP. "Revelado" lo vuelve a ocultar.
  * Handouts (`sync/tableReveals.ts`, `features/cloud/HandoutsPanel.tsx`, nuevos): el GM manda una pista o descripción desde MESA // CAMPAÑA ("De parte del GM"); le llega a toda la mesa y el HUD avisa del último que no viste. La mesa carga los últimos 10.
  * Corrida NET: con "Mostrar la corrida a la mesa", el Netrunner ve en vivo los pisos desbloqueados con su DV y tipo de ICE. HP, ATK y DEF del ICE y las recompensas no salen del GM (`buildNetReveal`).
* **PIN y rol** (`store/gmAccess.ts`, nuevo): con mesa activa manda el rol de la campaña. El GM entra sin PIN; el jugador ve "Solo el GM de <campaña>" en el Fixer Deck y en Modo Master del NET, y no ve el control de pisos ni CREAR PNJ. Sin mesa, el PIN del GM protege el Fixer y ahora también el modo GM del NET (se pide una vez por sesión; "Bloquear ahora" bloquea los dos).
* **Reglas**: `gm/*` solo acepta notes, npcs o net, con su forma, tamaño (100.000 caracteres, 200 PNJ, 50 arquitecturas), hora del servidor y 1 escritura por segundo. `reveals/*`: los miembros leen y solo el GM crea y borra; `reveals/net` con hasta 30 pisos.
* **Presupuesto**: `sessionBudget.test.ts` suma 30 guardados de secretos y 40 revelaciones por sesión. Con 20 handouts al abrir pasaba el tope de 35.000 lecturas; con 10 entra, con muy poco margen.
* **Files Modified**: `sync/gmSecrets.ts`, `sync/tableReveals.ts`, `store/gmAccess.ts`, `features/cloud/HandoutsPanel.tsx`, `sync/__tests__/gmSecrets.test.ts`, `sync/__tests__/tableReveals.test.ts` (nuevos); `sync/tableSync.ts`, `sync/encounterSync.ts`, `store/encounterStore.ts`, `hooks/useDebouncedLocalStorage.ts`, `features/gm/FixerDeckView.tsx`, `features/gm/EnemiesCompendiumPanel.tsx`, `features/netroles/NetAndRolesDeckView.tsx`, `features/combat/EncounterOrderStrip.tsx`, `features/combat/CombatHudView.tsx`, `features/cloud/CampaignPanel.tsx`, `firestore.rules` y sus tests, `sync/__tests__/sessionBudget.test.ts`, `store/persistence.ts`, `features/docs/SystemChangelogAndDocsView.tsx`.
* **Verificación**: tsc, 456 tests, 36 tests de reglas y build. En el navegador, con el emulador y dos usuarios:
  * La primera copia sube notas, PNJ y NET a la campaña, con aviso; la nota sigue ahí al recargar.
  * El handout le llega al jugador.
  * Enemigo revelado sin HP; al ocultarlo desaparece.
  * El jugador ve los pisos 1 y 2 de la corrida con su DV; el documento no trae HP, ATK ni DEF del ICE.
  * El jugador no entra al Fixer ni a Modo Master. Sin sesión, Modo Master pide el PIN, rechaza uno incorrecto y desbloquea también el Fixer.
  * Arreglado en la prueba: el control de pisos del NET se veía siempre.

### [v5.2.0] - 2026-10-28 (El GM actúa sobre los PJ: daño, críticas, condiciones, Humanidad y €$) [Claude Code · 2026-10-28]
* **Category**: Nube / combate (plan 20, `docs/plans/plan20-gm-actua-sobre-la-mesa.md`; primera mitad de la fase 3 del plan 16).
* **Calculadora del GM** (`features/gm/GmTargetDialog.tsx`, nueva): botón "Daño" al lado de cada PJ en el orden de iniciativa y en la party (solo el GM de la mesa activa). Pestañas:
  * Daño: con la armadura del jugador, SP, ablación, cabeza x2 (x3 con Cracked Skull), Melee y Martial Arts con la mitad del SP, crítico +5 y Mortally Wounded (Core pp.176, 186-188).
  * Crítica: al azar o elegida de la tabla Core o CEMK.
  * Condiciones, Humanidad y €$ con motivo.
  * Se abre en un portal porque las tarjetas con chamfer la recortaban.
* **Un solo camino para el daño**: `planImpactEffects` (`engine/combatEngine.ts`) arma los efectos de un impacto y `applyImpactTo` (`store/useCharacterStore.ts`) los aplica a cualquier ficha. El HUD (`handleApplyCalculatedDamage`) los usa igual que antes. Se suman `ablateArmorFor`, `adjustHumanityFor`, `addDeathSavePenaltyFor` e `inflictRandomInjuryFor`; las versiones de la ficha activa ahora llaman a estas.
* **Condiciones** (`data/conditions.ts`, campo `conditions?` en la ficha). Solo las que tienen regla en el Core v1.24; Stunned, Blinded y Deafened no existen como regla:
  * Prone (p.169)
  * Grappled (p.177)
  * On Fire Mild, Strong o Deadly (p.180)
  * Drowning (p.180)
  * Exposure (p.181)
  * Unconscious (pp.186, 188)

  Se ven como chips en BIOMONITOR del HUD, con su cita y un botón para sacarlas.
* **Log de la mesa**: tipo nuevo `gm` (`gmActionToLog`, `publishGmAction`) para cada acción del GM sobre un PJ; la regla del log lo permite solo al GM. HP, SP, Humanidad y €$ ya viajan como `increment`, así que el GM y el jugador no se pisan.
* **Presupuesto**: `sessionBudget.test.ts` suma una línea de log por cada acción del GM: 6.579 escrituras y 34.594 lecturas (tope 35.000; queda poco margen).
* **Files Modified**: `features/gm/GmTargetDialog.tsx`, `data/conditions.ts`, `store/__tests__/gmTargetActions.test.ts` (nuevos); `engine/combatEngine.ts`, `store/useCharacterStore.ts`, `types/cyberpunk.ts`, `features/combat/CombatHudView.tsx`, `features/combat/EncounterOrderStrip.tsx`, `features/cloud/CampaignPanel.tsx`, `features/cloud/TableLogPanel.tsx`, `sync/tableLog.ts`, `sync/tableSync.ts`, `firestore.rules` y sus tests, `engine/__tests__/rules.test.ts`, `sync/__tests__/tableLog.test.ts`, `sync/__tests__/sessionBudget.test.ts`.
* **Verificación**: tsc, 450 tests, 34 tests de reglas y build. En el navegador, con el emulador y dos usuarios:
  * 15 al cuerpo con SP 11: −4 HP y SP 10.
  * 15 a la cabeza: −8 HP.
  * Prone: el jugador lo ve como chip y desaparece al sacarlo.
  * Humanidad 70→68 y €$ +500.
  * GM +100 y jugador −50 a la vez: queda 650 en los dos.
  * 5 líneas `gm` en el log del jugador.
  * El jugador no tiene el botón "Daño".

### [v5.1.0] - 2026-10-27 (Mesa compartida: reloj, era, encuentro y log de tiradas) [Claude Code · 2026-10-27]
* **Category**: Nube (plan 19, `docs/plans/plan19-v510-mesa-compartida.md`; fase 2 del plan 16; capa de sync del plan 17, puntos 10 a 12).
* **Mesa activa**: la campaña que se comparte en vivo. Es la elegida en MESA // CAMPAÑA ("Usar como mesa activa"), o la de la ficha activa, o la única (`sync/tableSync.ts`, `cloudState.activeTableId`). Sin sesión o sin mesa, todo sigue local.
* **Reloj y era de la campaña**: solo el GM pasa beat, día y sesión, y cambia la era; los jugadores lo ven y sus botones quedan bloqueados ("Mesa: X · lo mueve el GM"). Los efectos del reloj (vencer Quick Fix, fin de sesión, Core pp. 154 y 223) se aplican en cada dispositivo solo a sus propias fichas. Sin `lastSessionApplied`: los dos efectos se pueden repetir sin cambiar nada (desvío del plan).
* **Encuentro unificado** (`store/encounterStore.ts`, clave `cpr_encounter_v1`, migra `cpr_active_encounter_v1`): el bestiario del HUD, `EnemiesCompendiumPanel` y el tracker del Fixer usan el mismo encuentro (PJ y enemigos, orden por iniciativa, turno y round). Ya no hay registros duplicados ni dos contadores de round. Daño a enemigos con SP y ablación (Core p.186).
* **Encuentro en Firestore** (`sync/encounterSync.ts`, `sync/encounterRepo.ts`): `encounters/current` (round, turno, orden), `combatants` (vista pública: nombre, iniciativa, estado de heridas) y `gmCombatants` (enemigo completo, solo el GM). El GM escribe en lotes de 600 ms y la vista pública solo cuando cambia el estado de heridas. El jugador tira Iniciativa en su HUD y entra solo al orden. Tira nueva en el HUD con el orden, el turno y las heridas (los HP solo para el GM).
* **Log de la mesa** (`sync/tableLog.ts`, `features/cloud/TableLogPanel.tsx`): ataque, daño, iniciativa y Death Save (Core p.188) van solos; las demás tiradas, con "Mostrar a la mesa". Decisión de Giuliano (cuota): el ataque y su daño salen en una sola línea (espera 20 s el daño). Lectura `limit(50)`; el GM recorta a las últimas 200.
* **Reglas de Firestore**: reloj y era solo del GM y con forma válida; encuentro (el jugador solo crea su PJ `pc-<charId>` de una ficha suya y cambia su iniciativa); `gmCombatants` solo el GM; log endurecido (campos, tamaños, `id == entryId`, hora del servidor). 33 tests de reglas.
* **Presupuesto**: `sessionBudget.test.ts` simula una sesión larga con encuentro y log: 5.859 escrituras y 29.554 lecturas (tope del test 35.000, decisión de Giuliano).
* **Arreglos de la prueba real (v5.0.2)**: "Compartir link" copia directo en la compu (la ventana de compartir queda para el celular); los reintentos previstos del listener de la party salen como aviso.
* **Arreglos de la prueba con dos usuarios**: (1) con una campaña recién creada, los listeners de la mesa fallaban por permisos y no se reabrían: ahora la mesa se reabre hasta 5 veces, como la party. (2) Al dejar la mesa, el jugador ya no se queda con la copia del encuentro del GM (antes, si después era GM de otra campaña, la publicaba como propia). (3) El log no repite el nombre de la skill.
* **Files Modified**: `store/encounterStore.ts`, `sync/tableSync.ts`, `sync/encounterSync.ts`, `sync/encounterRepo.ts`, `sync/tableLog.ts`, `features/combat/EncounterOrderStrip.tsx` y `features/cloud/TableLogPanel.tsx` (nuevos); `sync/campaignRepo.ts`, `sync/cloudCampaigns.ts`, `sync/cloudState.ts`, `store/gameClockStore.ts`, `store/useCharacterStore.ts`, `store/useCombatStore.ts`, `types/cyberpunk.ts`, `features/combat/CombatHudView.tsx`, `features/combat/GameClockBar.tsx`, `features/layout/TopHudBar.tsx`, `features/gm/EnemiesCompendiumPanel.tsx`, `features/gm/FixerDeckView.tsx`, `features/cloud/CampaignPanel.tsx`, `App.tsx`, `firestore.rules`, tests nuevos (`encounterStore`, `tableSync`, `encounterSync`, `tableLog`, reglas, presupuesto), `store/persistence.ts`, `features/docs/SystemChangelogAndDocsView.tsx`.
* **Verificación**: tsc, 444 tests, 33 tests de reglas y build. En el navegador, con el emulador y dos usuarios (GM y jugador): reloj y era del GM llegan al jugador, que no tiene los botones; dos enemigos del bestiario aparecen en el jugador con su estado de heridas y sin HP; la iniciativa del jugador entra ordenada en las dos pantallas; turnos y rounds; el enemigo bajado a 15/35 aparece "Seriously Wounded"; el ataque del jugador (con su daño) y una tirada de Perception con "Mostrar a la mesa" llegan al log del GM; el Fixer y el HUD muestran el mismo encuentro y todo persiste al recargar. Las reglas nuevas todavía no están publicadas en el Firebase dev.

### [v5.0.2] - 2026-10-25 (Tipo de bala cargada en el HUD) [Claude Code · 2026-10-25]
* **Category**: Combate / datos. Pendiente (7) del checkpoint.
* **Problema**: `loadedAmmoType` es el tipo de bala (Basic, Armor-Piercing… Core p.345) y el HUD lo usa así, pero el creador, las pregens del Easy Mode y equipar un arma desde el Compendio guardaban ahí el calibre ("Heavy Pistol") o "Standard", y las premades del CEMK, el nombre del libro ("Basic Heavy Pistol Ammunition"). El HUD mostraba "Bala: Heavy Pistol", el selector apuntaba a una opción inexistente y no aparecía la regla de la bala. Solo afectaba lo que se ve: el cálculo de daño usa su propio selector de tipo de ataque.
* **Arreglo**:
  * `normalizeLoadedAmmoType()` en `engine/characterEngine.ts` traduce cualquier valor viejo al id del catálogo (palabras clave para los tipos especiales; lo demás, Basic). El HUD la usa en la etiqueta, el selector, los botones rápidos y la regla. La etiqueta ahora dice "Bala: Basic · Heavy Pistol" (tipo · calibre).
  * Las armas nuevas (creador, pregens del Easy Mode, Compendio) arrancan con `loadedAmmoType: 'Basic'`; el calibre sigue en `ammoType`. Las fichas guardadas no se migran: se traducen al mostrarlas y se corrigen solas al elegir otra bala.
* **Files Modified**: `engine/characterEngine.ts`, `engine/characterCreation.ts`, `data/characterCreationData.ts`, `store/useCharacterStore.ts`, `features/combat/CombatHudView.tsx`, `engine/__tests__/characterCreation.test.ts`, `store/persistence.ts`, `features/docs/SystemChangelogAndDocsView.tsx`.
* **Verificación**: tsc, 410 tests (1 nuevo) y build. En el navegador (local): la ficha Bluewire2, creada con el valor viejo, muestra "Bala: Basic · Heavy Pistol", el selector en Basic y la regla "Ablación estándar 1 SP".

### [v5.0.1] - 2026-10-25 (Creador: arreglos de la prueba con un Netrunner) [Claude Code · 2026-10-25]
* **Category**: Canon / Creador de personajes. Sale de la prueba del wizard en gh-pages: un Netrunner rango 4 por Complete Package en 2045 ("Bluewire"). Sin plan: son nueve arreglos chicos, cada uno con su página.
* **Textos del rol**: tildes y eñes en todos los textos en español de `data/creation/coreRoles.ts` (solo diacríticos: el texto sin tildes es idéntico al anterior). La habilidad de rol ya no dice "Rango 4: Rango 4:" (tampoco "Rango 4: Rangos 3 y 4:").
* **Lifepath según la era**: al elegir 2045 arranca con las tablas de Core (pp. 44-53); en 2077, con las de CEMK (RB pp. 19-24). Se puede seguir cambiando a mano.
* **Amigos, enemigos y romances trágicos (Core)**: botón "Tirar 1d10 − 7" para cada uno (mínimo 0, Core pp. 51-52), y "Tirar todo" también los tira. Con CEMK siguen los botones de sus tablas de cantidad.
* **Idiomas**: Language (Streetslang) es skill básica y arranca en 2 en Complete Package (Core p.85). El idioma de origen, gratis en 4, va aparte y no puede ser Streetslang (Core p.45). El campo ahora dice "p. ej. Spanish".
* **Clics rápidos en skills**: los botones − y + suman sobre el valor guardado, no sobre el que se ve en pantalla; tres clics seguidos ya no se pierden.
* **Tienda del creador**:
  * Pestaña **Programas** con los 15 programas de Core (Black ICE afuera), su clase y el aviso de slots del cyberdeck (Core pp. 196 y 200).
  * **Virtuality Goggles** (100 €$, Core p.351) agregadas al pack en las dos copias y en `scripts/extract_core_pack.py`.
  * **Munición por tipo de arma**: un selector elige el calibre (por defecto, el de la primera arma comprada) y la compra se llama "Basic Ammo (Heavy Pistol)". Cada compra son 10 balas en el inventario; granadas y cohetes, de a una (Core p.344).
* **Simulador NET**: los programas del cyberdeck salen de la ficha (inventario `programs` o "Program: X" del paquete de rol) y muestra los slots usados del cyberdeck (Core p.196). Antes mostraba cuatro programas de ejemplo fijos.
* **Resumen**: lo que falta completar en el mismo resumen (el handle) ya no muestra el botón "Ir a Resumen".
* **Revisado y correcto, sin cambios**: 2.550 €$ y 800 de moda (Core pp. 104-105), Humanidad con Neural Link y Plugs, EMP efectivo, Interface 4 = 3 acciones NET (Core p.197) y `hasNeuroport` en false en 2045 (el Neuroport es de 2077, CEMK p.26).
* **Files Modified**: `data/creation/coreRoles.ts`, `engine/characterCreation.ts`, `features/creator/steps/MethodStep.tsx`, `LifepathStep.tsx`, `SkillsStep.tsx`, `GearStep.tsx`, `SummaryStep.tsx`, `features/netroles/NetAndRolesDeckView.tsx`, `data/core-rules.cprpack.json` (y `data/` en la raíz), `scripts/extract_core_pack.py`, `engine/__tests__/characterCreation.test.ts`, `store/persistence.ts`, `features/docs/SystemChangelogAndDocsView.tsx`.
* **Verificación**: tsc, 409 tests (3 nuevos: idiomas, munición y programas, prefijo de rango) y build. En el navegador (local): wizard completo 2045 + Complete Package + Netrunner, tiradas 1d10 − 7, Streetslang trabado en 2, tres clics rápidos = +3, tienda con programas, goggles y calibre, ficha creada con Streetslang 2 + Hindi 4, 20 balas de Heavy Pistol y 3 programas, y el simulador NET mostrando "3/7 slots".

### [v5.0.0] - 2026-10-24 (Mesa online: cuentas, fichas en la nube y campañas) [Claude Code · 2026-10-24]
* **Category**: Nube (plan 16 fase 1, `docs/plans/plan16-firebase-mesa-online.md`; capa de sync del plan 17; campañas del plan 18, `docs/plans/plan18-v5-campanias.md`). Firebase Auth + Firestore, plan Spark gratuito.
* **Dos modos**: sin cuenta la app funciona como siempre (solo en el dispositivo). Con Google, las fichas viven en la nube, se ven en cualquier dispositivo y aparecen las campañas. El SDK de Firebase se carga solo si el usuario entra. Pestaña nueva **MESA // CAMPAÑA** y chip de estado (Guardando / Sincronizado / Sin conexión / Pausado).
* **Sincronización a prueba de cuota** (plan 17): cola por ficha de 1,5 s (máximo 5 s), diff por campos, contadores con `increment()` (HP, Luck, Humanidad, €$, IP, SP, Death Save), sin eco (base confirmada por el servidor, snapshots con escrituras pendientes ignorados), historiales de IP y €$ como subcolecciones de solo creación, guardián de cuota diario con modo ahorro y gate de `schemaVersion`.
* **Campañas** (plan 18): crear, link de invitación `?unirse=` (compartir con el menú del celular o copiar; cambiar el link invalida el viejo), unirse, asignar una ficha (una ficha, una campaña), salir, echar y pasar el rol de GM. El GM tiene las fichas de sus jugadores en el selector ("· jugador: Nombre") y las puede editar; cada miembro ve un resumen de la party (HP, estado de heridas Core pp. 220-222, SP y heridas críticas).
* **Reglas de seguridad** (`frontend/firestore.rules`): cada uno lee y escribe lo suyo; el GM, las fichas de su campaña mientras el dueño siga siendo miembro; freno anti-bucle por escritor (1 escritura por segundo por dispositivo); unirse solo con el código vigente.
* **Celulares** (decisión 12 del plan 16): sin desborde horizontal a 375 px (barras de pestañas de Street Lab, NET/roles y filtro de Quickhacking); en el celular el encabezado ya no queda fijo y la barra de pestañas sí; en pantallas grandes la barra queda justo debajo del encabezado aunque ocupe dos renglones.
* **Entornos**: `.env.development` (emulador local, `npm run emulators` con JDK 21 portátil vía `scripts/firebase-with-jdk.mjs`), `.env.beta` (proyecto `cpr-omni-deck-dev`, `npm run build:beta`) y `.env.production` (proyecto `cpr-omni-deck-prod`, `npm run deploy:prod`).
* **Files Modified**: `sync/` (nuevo: `firebaseConfig.ts`, `firebaseClient.ts`, `authStore.ts`, `cloudState.ts`, `diff.ts`, `writeQueue.ts`, `quotaGuard.ts`, `sheetDoc.ts`, `characterSync.ts`, `firestoreAdapter.ts`, `cloudCharacters.ts`, `campaignRepo.ts`, `partySummary.ts`, `cloudCampaigns.ts`, `inviteLink.ts`, `testing/fakeFirestore.ts` y tests), `features/cloud/CloudTableView.tsx`, `features/cloud/CampaignPanel.tsx`, `components/CloudStatusChip.tsx` (nuevos); `App.tsx`, `features/layout/TopHudBar.tsx`, `features/sheet/StreetLabView.tsx`, `features/netroles/NetAndRolesDeckView.tsx`, `store/persistence.ts`; `frontend/firestore.rules`, `firebase.json`, `.firebaserc`, `firestore.indexes.json`, `vitest.rules.config.ts`.
* **Verificación**: tsc, 406 tests (incluye `sessionBudget.test.ts`: 4 h con GM + 6 jugadores dan ~4.050 escrituras y ~17.950 lecturas, contra 20.000 / 50.000 diarias del plan Spark), 27 tests de reglas contra el emulador y build. En el navegador con el emulador y dos usuarios: subir fichas, daño agrupado en una escritura, cambio remoto sin eco, GM y jugador restando HP en el mismo segundo (se aplican los dos), crear campaña, link, unirse, asignar, edición cruzada, party, cambiar link, echar, pasar GM y salir; medición a 375 px de todas las pestañas.
* **Pendiente**: publicar la beta en el proyecto dev (requiere activar Google y Firestore en la consola y `firebase login`) y después la estable en Firebase Hosting; el botón "Compartir link" no se probó en un celular real.

### [v4.9.7] - 2026-10-24 (Preparación para la sincronización: guardado diferido y topes de historial) [Claude Code · 2026-10-24]
* **Category**: Persistencia (plan 17, `docs/plans/plan17-sync-cuota.md`). Sin Firebase: prepara la app para que la sincronización del plan 16 no agote la cuota gratis y mejora el modo local.
* **Guardado diferido**: `hooks/useCommittedField.ts` y `components/CommittedInput.tsx`. El Handle y los €$ de Street Lab, el lifepath personalizado de la vista de roles y los metros movidos del HUD guardan una sola vez: al salir del campo, con Enter o tras 1,5 s sin escribir (máximo 5 s). Un cambio de ficha con texto pendiente lo descarta (`resetKey`) para no guardarlo en otra ficha. El rol y el lifepath con menú no cambian (ya guardaban una vez por elección).
* **localStorage agrupado**: `utils/debounce.ts` y `hooks/useDebouncedLocalStorage.ts`. Las notas secretas del GM, el encuentro activo y los NPC propios se guardan agrupados, con guardado al cerrar la pestaña.
* **Topes de historial**:
  * Historial de IP: freno en 2.000 movimientos (141 bytes cada uno, medido; 2.000 son unos 282 KB). Lo más viejo pasa a `cpr_ip_log_archive_v1`, que entra en la copia de seguridad, y la app avisa. Los totales del panel de IP no cambian (`ipLogArchivedTotals`, sumado por `summarizeIpLog`).
  * Registro de Speedheal: freno en 500 con el mismo criterio (`cpr_speedheal_archive_v1`).
  * Historial de €$: la compra de chips de Martial Arts ahora pone el movimiento más nuevo primero y respeta el tope de 50, como el resto.
  * Migraciones: fichas v6 y reloj de juego v1.
* **Combate**: `useCombatStore` con `partialize` y dos grupos explícitos, `local` (UI y preparación de la tirada) y `shared` (estado del combate, que en v5.1.0 pasa al encuentro). Persistencia versión 3; el formato guardado no cambia.
* **Files Modified**: `utils/debounce.ts`, `hooks/useCommittedField.ts`, `hooks/useDebouncedLocalStorage.ts`, `components/CommittedInput.tsx` (nuevos); `store/persistence.ts`, `store/useCharacterStore.ts`, `store/gameClockStore.ts`, `store/useCombatStore.ts`, `engine/ipLedger.ts`, `types/cyberpunk.ts`, `features/sheet/StreetLabView.tsx`, `features/sheet/IpLedgerPanel.tsx`, `features/netroles/NetAndRolesDeckView.tsx`, `features/combat/CombatHudView.tsx`, `features/gm/FixerDeckView.tsx`, `features/gm/EnemiesCompendiumPanel.tsx`.
* **Verificación**: tsc, 348 tests y build. En el navegador: un Handle de 10 letras hizo 0 escrituras mientras se tipeaba y 1 sola tras 1,5 s, con el texto completo; una ficha de prueba con 2.001 movimientos de IP quedó con 2.000, avisó, el más viejo quedó en el archivo y el panel siguió mostrando Ganados 2718 y Gastado en skills 666.

### [v4.9.6] - 2026-10-23 (Movimientos especiales de Martial Arts en el HUD) [Claude Code · 2026-10-23]
* **Category**: Combate (plan 15, que reemplaza la sección v4.9.6 del plan 14).
* **Contexto**: el HUD no tiene blanco, porque la defensa es manual y los enemigos están en modelos desconectados. Giuliano decidió que los efectos los aplican los jugadores; el store de encuentro compartido queda como plan futuro.
* **Datos**: los 55 movimientos ganan `req` (STATs, skills, rango de la forma, golpes y metros del turno, confirmaciones, una vez por turno, reemplaza los 2 ataques o gasta la Acción) y `effects[]` tipados, derivados del texto auditado.
  * Correcciones al revisar: Woo Technique (Handgun 4+ **o** Combat Awareness 1, como confirmación), Grab Escape (los 2 golpes van como confirmación), Flying Kick (gasta la Acción) y Combat Reload (golpe de Gun Fu).
* **Motor**: `engine/martialArtsRules.ts`, con `checkMoveRequirements`, `resolveMoveRoll` (empate a favor del defensor, Core p.129), `describeMoveEffects` (con la herida del Core si no está en la tabla CEMK, decisión 47) y `moveSupportsHeadShot`.
* **Store**: `useCombatStore.turnLog`, con `recordHit`, `recordMove`, `setMovedMeters` y `endTurn`. `nextRound` lo reinicia. Persistencia en versión 2, migrada con `migrateCombatState`.
* **HUD**:
  * los golpes que aciertan (Brawling, Martial Arts por forma y armas cuerpo a cuerpo) se cuentan después de resolver el 10 o el 1;
  * requisitos con ✓/✗ y casillas de confirmación;
  * EJECUTAR bloqueado con el motivo;
  * −8 a la cabeza;
  * daño propio del movimiento;
  * tarjeta "Efectos para aplicar";
  * barra de turno con metros movidos y "Fin de turno".
* **Decisiones**: 47 y 48 en `docs/canon-audit/discrepancias-cemk-core.md`.
* **Verificación**: tsc, 323 tests y build. En el navegador:
  * Disarming Combination se habilitó después de acertar con Brawling y con Aikido y de marcar "mismo objetivo"; al acertar mostró el desarme y quedó bloqueado con "Ya lo usaste este turno"; "Fin de turno" lo reinició;
  * Bone Breaking con WILL 7 queda bloqueado con "WILL 8+ (tenés 7)" y con WILL 8 se habilita.
  * La herida a la cabeza (Cracked Skull) y la herida del Core con la tabla CEMK las cubren los tests, no el navegador.
  * A 375 px, la barra de turno y las tarjetas entran. El resto del HUD ya desbordaba antes (pendiente anotado).

### [v4.9.5] - 2026-10-23 (Martial Arts por forma) [Claude Code · 2026-10-23]
* **Category**: Creador (plan 14, primera parte, con las decisiones de Giuliano del 2026-10-23).
* **Auditoría canon**: `data/cyberfistsMartialArtsData.ts` contra Core pp. 83, 137, 176-182, 360 y 411 e Interface RED Vol. 4 pp. 73-83.
  * Los 55 movimientos (Recovery, 8 del Core y 46 de IR4) coinciden en requisito, DV, una vez por turno, Acción y efecto.
  * Se corrigieron las páginas de las formas del Core, las citas (creación, p.181 y Neuroport en CEMK RB p.36) y se quitó el texto sin fuente.
  * Decisiones 39-46 en `docs/canon-audit/discrepancias-cemk-core.md`: Contact Combat como el libro, el chip habilita los movimientos, Counter Throw pide esquivar al menos un ataque, el golpe a la cabeza con −8 es Aimed Shot, desarma quien elige, STATs clave = DEX + requisitos y sin mínimo por ciberbrazo.
* **Motor** (`engine/characterCreation.ts`):
  * `getMartialArtsFormSkills`: claves `Martial Arts (Forma)`, que cuestan ×2;
  * `SPECIALTY_SKILLS`, `skillSpecialty` y `setSkillSpecialty`;
  * la validación exige la forma y la especialidad (Core p.83);
  * `buildCharacterSheetFromDraft` escribe `knownMartialArts` y `skills.martialArts` como el máximo.
  * En `engine/characterEngine.ts`: `calculateMartialArtsDamage` (Core p.178).
* **UI**:
  * `SkillsStep`: bloque desplegable con las 27 formas (Core / IR Vol. 4), con nivel, página y ⓘ; campo de especialidad.
  * HUD "En mano": selector de forma, tirada DEX + rango de la forma y daño por BODY.
  * Vista de roles: STATs clave "según los requisitos de sus movimientos" y "contra DEX + Evasion del rival" en lugar de "DV 0".
  * Grilla del creador con `grid-cols-1`, para que no desborde a 375 px.
* **Docs**: `docs/rules/martial-arts.md`, con las reglas generales y las 27 formas.
* **Verificación**: tsc, 306 tests y build. En el navegador:
  * Paquete Completo: Karate 4 y Judo 2 cuestan 12 puntos y la ficha da `knownMartialArts {karate: 4, judo: 2}`;
  * Play Instrument pide especialidad y queda "Play Instrument (Guitarra)";
  * HUD: selector con Karate (R4) y Judo (R2), la base cambia con la forma y el daño es 2d6 con BODY 6;
  * a 375 px, el creador sin desborde.

### [v4.9.4] - 2026-10-23 (Modo Novato del creador) [Claude Code · 2026-10-23]
* **Category**: Creador (plan 12, ex v4.8.3 del plan 7, con las decisiones de Giuliano del 2026-10-23: solo texto del libro, solo el creador, ⓘ desplegables y resumen como confirmación con avisos).
* **Datos**: `data/creation-src/creator-guide.json`, generado a `data/creation/creatorGuide.ts` (`CREATOR_GUIDE`): texto de cada paso con su página del Core, `recommendsStreetrat` (Core p.40) y las reglas de los avisos.
* **Motor**: `getSummaryWarnings(draft, built)` en `engine/characterCreation.ts`. Avisos que no bloquean:
  * dinero sin gastar (Core p.98 en Streetrat y Edgerunner, p.104 en Paquete Completo);
  * moda sin gastar en Paquete Completo, que se pierde (p.105);
  * Humanidad que baja la EMP (p.80);
  * skills básicas por debajo de 2 en Edgerunner y Paquete Completo (p.90), solo si la validación no lo bloquea ya;
  * sin armas y sin armadura.
* **Store**: `store/creatorNoviceStore.ts` (`cpr_creator_novice_v1`, prendido por defecto), sumado a `BACKUP_EXTRA_KEYS`.
* **UI**:
  * interruptor "Modo Novato" en la cabecera del creador;
  * `NoviceGuide` ("Qué es esto" con página) en los pasos;
  * "Recomendado por el libro" en Streetrat;
  * `InfoToggle` (ⓘ desplegable con `aria-expanded`) en skills y STATs;
  * resumen en tarjetas con "Revisá y confirmá". La checklist que bloquea "Crear" no cambia.
* **Verificación**: tsc, 280 tests y build. En el navegador:
  * el modo sale prendido por defecto, se guarda al recargar y "Descartar borrador" no lo cambia;
  * la guía y la página aparecen en método, rol, Lifepath, STATs, skills y equipo;
  * los ⓘ de STAT y de skill se despliegan, también a 375 px sin desborde;
  * en el resumen de un Solo Streetrat salen los avisos de 500eb sin gastar (p.98) y Humanidad 33 que baja la EMP de 4 a 3 (p.80);
  * la checklist bloqueó "Crear" hasta poner el handle, y el personaje se creó (después se borró).

* **Plan 13 (mismo release)** [Claude Code · 2026-10-23]:
  * **STATs**: `STAT_TOOLTIPS` pasa al texto del Core p.72 con `source`; se quitaron los umbrales inventados (REF 8+ Bullet Dodging, BODY 8+ armas pesadas). Lo usan el creador y Street Lab.
  * **Grafted Muscle and Bone Lace** (Core p.114, errata v1.25): `engine/cyberwareEffects.ts` (`CYBERWARE_EFFECTS`, `cyberwareStatBonus`, `canInstallAnother`). Suma +2 BODY por instalación, acumulable, tope 10, para el id del Core y el de CEMK. Lo aplican `getEffectiveBody` (antes del FBC) y `computeDerived` del creador. Choke, Throw, Brawling y el Ripperdoc usan el BODY efectivo.
  * **Ciberware repetible**: instalar otra copia (×N) en Compendium, Ripperdoc y Going Metal; desinstalar saca una sola copia. En Grafted, el botón se bloquea con el tope (Core p.114). El Compendium ahora descuenta el HL del libro de cada copia, no 7 fijo.
  * **Thorn**: BODY base 8 y el motor le da 10 (HP 55, SW 28). Migración de fichas v4 a v5 solo para la ficha de Thorn del Folio.
  * **Guía y docs**: el Neuroport cita CEMK RB p.25 (verificado en el PDF). Los docs que nombraban `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS` ahora nombran `coreLifepath.ts`.
  * **Verificación**: tsc, 296 tests y build. En el navegador:
    * Thorn migrado: BODY 8 de base, 10 efectivo, HP 55 y SW 28;
    * Hardpoint (BODY 6): Grafted ×1 da BODY 8 y HP 45; ×2 da 10 y HP 50, con "Instalar otro" bloqueado por el tope; desinstalar saca una sola copia; cada copia descuenta 14 de Humanidad;
    * las 10 STATs de Street Lab con Core p.72;
    * a 375 px, los botones del Compendium entran.
  * El HP de la vista previa del creador con Grafted lo cubren los tests (no lo probé en el navegador).

### [v4.9.3.1] - 2026-10-23 (Arreglo de skills) [Claude Code · 2026-10-23]
* **Problema**: en el panel de Maker, Maven mostraba Electronics/Security Tech 0. El dato estaba bien (`electronicssecurity: 6`, CEMK Folios p.25), pero la búsqueda no reconocía la clave abreviada.
* **Arreglo**: `engine/skillLookup.ts` (`sheetSkillLevel`) busca la skill en `skills` y `generalSkills`. Acepta la clave de combate, el nombre del libro, la clave compacta y el prefijo abreviado (mínimo 6 letras, sin especialidad), con la misma regla que el panel "Otras skills". La usan `MakerPanel` y `MediaPanel`.
* **Verificación**: tsc, 274 tests (4 nuevos en `skillLookup.test.ts`) y build. En el navegador, Maven: Electronics/Security Tech 6 y Cybertech 5.

### [v4.9.3] - 2026-10-23 (Roles sociales y de oficio) [Claude Code · 2026-10-23]
* **Category**: Roles (plan 11 = v4.9.3 del plan 8, con las decisiones de Giuliano del 2026-10-23).
* **Motor puro**:
  * `engine/socialRoleRules.ts`: Rockerboy (fans y favores, Core pp. 144-145), Fixer (Haggle opuesto con empate a favor de quien se defiende, Core pp. 129 y 159-161), Media (rumores y Believability, pp. 151-153), Exec (Team Members, Loyalty, fin de sesión, reemplazo, pp. 153-157) y Lawman (llamada, llegada, grupos, CN, pp. 158-159).
  * `engine/makerRules.ts`: categoría de precio por monto (Core pp. 338-339), DV y tiempo (p.149), materiales por especialidad, skill sugerida por tipo de objeto, tirada y Field Expertise (pp. 147-148).
* **Datos**: `role-ranks-social.json` gana `Exec.tables.loyalty.numeric` (tope 10, Loyalty 1 del reemplazo y 200 €$, Core p.154).
* **Ficha y stores**: `CharacterSheet.execTeam` y `rockerboyFans` (opcionales, sin migración); acciones de Team Members y fans; `backupCalls` en `useCombatStore` (bajan con `nextRound`); `session` y `endSession()` en `gameClockStore`; botón "Fin de sesión" en `GameClockBar`.
* **UI**: `features/roles/` con los paneles de Rockerboy, Fixer, Media, Exec, Lawman y Maker, montados en la vista de roles; `BackupCard` en el HUD. La tirada de mejora de armas ahora usa Weaponstech y Upgrade Expertise, y los materiales siguen la regla de la misma categoría. Se quitaron los proyectos de Tech inventados.
* **Decisiones de Giuliano**: las 8 del plan 11, más la discrepancia 38: en R10, con un 6 de llegada, vienen dos grupos de R10.
* **Corregido al probar**: el bloqueo de un favor fallido del Rockerboy duraba 8 días; ahora dura 7 contando el día del fallo.
* **Verificación**: tsc, 270 tests y build. Navegador:
  * Thorn: favor de rango 7 con falla automática, y bloqueo de una semana tras fallar;
  * Connect: Haggle contra Thorn, con los tratos de R4 y el Reach de 2077;
  * Exec en modo GM con R5: 2 Team Members (HP 45 con BODY 6 y WILL 8), "Fin de sesión" recorta 12 a 10 y marca la renuncia de quien tenía −1, y el reemplazo cobra 200 €$;
  * Lawman con R4: tarjeta de Backup con cuenta regresiva, 4 agentes y tirada CN + 1d10;
  * Maven: Fabrication de 500 €$ con DV 21 y materiales de 100 €$;
  * Media: rumor pasivo y Believability con +3;
  * a 375 px, los paneles entran.
* **Pendientes encontrados (no de esta versión)**:
  * en la ficha guardada de Maven, Electronics/Security Tech vale 0, cuando el Folio le da 6 (+4);
  * la mejora de armadura usa siempre 100 €$ y DV 17, porque la ficha no guarda el precio de la armadura;
  * el bestiario no trae Trading.

### [v4.9.2] - 2026-10-23 (Roles de combate) [Claude Code · 2026-10-23]
* **Category**: Roles (plan 10 = v4.9.2 del plan 8, con las decisiones de Giuliano del 2026-10-22).
* **Datos**: `data/creation-src/cemk-critical-injuries.json` (RB p.13, 1d6, Quick Fix y Treatment estructurados) y `core-vehicles.json` (14 vehículos genéricos, Core pp. 189-191, con rango de Family Motorpool p.162, y 19 mejoras de Nomad pp. 163-165), generados a `data/creation/`.
* **Motor puro**: `engine/medicalRules.ts` (opciones de tratamiento por herida, estabilización Core p.222, Surgery solo Medtech, Treatment no a uno mismo, síntesis Core pp. 149-150, tirada CEMK 1d6), `engine/combatAwareness.ts` (Core p.146), `getInterfaceRank` y `medicalTechLevel` en `roleRules.ts`, `createInitialAttackRoll(..., { ignoreCriticalFailure })` para Fumble Recovery.
* **Stores**: `gameClockStore` (`cpr_game_clock_v1`: día, Beat, registro de Speedheal; "Nuevo día" vence los Quick Fix), `rulesSettingsStore` (`cpr_rules_settings_v1`: tabla de Críticas), Round en `useCombatStore`, acciones sobre cualquier ficha (`inflictSpecificInjury`, `applyQuickFix`, `applyTreatment`, `expireQuickFixes`, `stabilizeCharacter`, `adjustHpFor`, `spendEurodollarsFor`).
* **UI**: barra de Round, Iniciativa, Perception y reloj en el HUD; efectos del Solo; NET Actions y Quickhacks por rango y era; `CritTableSelector`; `MedtechTreatmentPanel` (en el HUD y en la sección Medtech); síntesis al Core; Speedheal con reloj; maniobra con Moto; Motorpool familiar y catálogo de vehículos del Core; Interface real en Red Chrome Cargo.
* **Correcciones canon**: Medical Tech = Pharmaceuticals + Cryosystem (Core p.150); Seriously Wounded = menos de la mitad (Core p.220); el d10 de Iniciativa no explota (Core pp. 126, 168). Discrepancia 20 decidida.
* **Decidido por Giuliano (2026-10-23)**: Damage Deflection ("decrease the first damage you take this Round", Core p.146) se aplica después de la armadura, sobre el daño al HP.
* **Verificación**: tsc, 222 tests y build. Navegador: Iniciativa de Hardpoint +4; Damage Deflection 1 en el primer daño del Round y no en el segundo, y de nuevo tras "Siguiente Round"; Crítica CEMK; Insurance trata con Surgery una herida de Hardpoint; Speedheal bloqueado en el mismo Beat; Bluescreen con 3 NET Actions y DV 12; Wrench con Drive + Moto 4 y motorpool limitado a Moto 4.
* **Pendientes previos (no de esta versión)**: en celular, desborde horizontal en Street Lab, en la vista de roles y en la barra del centro del HUD cuando tiene módulos.

### [v4.9.1] - 2026-10-22 (Avance con IP) [Claude Code · 2026-10-22]
* **Category**: Roles (plan 9 = v4.9.1 del plan 8, más el contador de IP y el panel de skills pedidos por Giuliano).
* **Motor puro** `engine/roleRules.ts`: `ipCostSkillLevel`, `ipCostRoleRank`, `checkSkillRaise`, `checkRoleRankRaise` (Core p.410), `netActionsForInterface` (Core p.197), `maxQuickhackDv`, `neuroportFirewallDv`, `canUseQuickhacks` (RB pp. 25-26), `jackInRangeM` (Core p.208, RB pp. 16, 36), `fixerReach` (Core pp. 159-161 contra RB p.25), `getRoleRankInfo`, `canApplySpeedheal` (Core p.150, Folios p.17), Maker y Medicine (Core pp. 147-150). `engine/ipLedger.ts`: `summarizeIpLog`.
* **Store**: `raiseRoleRankWithIp`, `raiseSkillWithIp`, `raiseGeneralSkillWithIp`, `setGeneralSkill`, `gmSetRoleRank`, `setMakerAllocation`, `setMedicineAllocation`; `adjustImprovementPoints(delta, reason?)` y `trainMartialArtWithIp` registran en `CharacterSheet.ipLog`. El default de IP pasa de 120 (inventado) a 0. Modo GM en `store/gmModeStore.ts` (`cpr_gm_free_edit_v1`).
* **Persistencia**: schema 4 con copia previa. La migración 3→4 pasa `cemk` a `core`, da a los Folios guardados su reparto (`data/folioRoleAllocations.ts`) y deja el saldo previo de IP como entrada "initial" del historial.
* **Ficha**: `IpLedgerPanel`, `OtherSkillsPanel` (también reconoce las claves compactas de los Folios, como 'medicaltech' y 'concealreveal'; Medical Tech y Surgery figuran como skills de Medicine) y `RoleAllocationPanel`. El + cobra IP, y el − y el selector de rango solo funcionan en modo GM.
* **Creador**: sin el selector "CEMK simple (+4)"; los PJ salen con `roleAbilityVariant: 'core'`, 0 IP e historial vacío.
* **Verificación**: tsc, 188 tests y build. Navegador:
  * migración de v3 a v4 con copia;
  * Maven: subida a R5 bloqueada sin IP, y con 300 IP sube y deja el historial;
  * Insurance: Medicine 1 punto libre, Surgery 4 y Medical Tech 1;
  * el modo GM;
  * el creador sin el selector.
* **Pendiente anterior a v4.9.1**: en celular, Street Lab tiene un desborde horizontal que ya estaba en v4.9.0.

### [v4.9.0] - 2026-10-22 (Roles por rango) [Claude Code · 2026-10-22]
* **Category**: Roles (plan 8, bloque 1).
* **Datos**: `data/creation-src/role-ranks-combat.json` (Solo, Netrunner, Tech, Medtech, Nomad) y `role-ranks-social.json` (Rockerboy, Fixer, Media, Exec, Lawman y Expanded Availability). Por rol: habilidad, 10 rangos, opciones, tablas, ajustes 2070s (RB p.25) y conversión del Folio con su reparto inicial.
* **Generador**: `scripts/gen_creation.py` produce `frontend/src/data/creation/roleRanks.ts` (`ROLE_RANKS`, tipos `RoleRanksSrc` en `types.ts`).
* **Fuente única**: `frontend/src/data/roleProgression.ts` deriva `ROLE_ABILITIES_COMPLETE_PROGRESSION` y `ROLES_INTERACTIVE_GUIDES`; se borraron los literales a mano (Netrunner solo CEMK, escalera de NET Actions equivocada, cita duplicada). En la ficha, "Estadística Asociada" pasa a "Fuente".
* **Self-ICE** (`engine/cemkPort.ts`): N Passwalls, todos con el DV del total (RB pp. 16, 36).
* **Lifepath de rol condicional** (bug de v4.8.2 hallado al probar PJs): `ROLE_LIFEPATH_CONDITIONS` y `getApplicableRoleLifepathTables` en `engine/characterCreation.ts`; validación, ficha, "Tirar todo" y `LifepathStep.tsx` usan solo las tablas que aplican (Core pp. 54-68). Nueva tabla `once_in_group` del Rockerboy en `core-lifepath.json` (Core p.54). 4 tests.
* **Neuroport en 2077** (discrepancias 34-35): `NEUROPORT_COVERED_CYBERWARE` suma Internal Agent y Biomonitor; las piezas cubiertas con alternativa "o" quedan en el paquete con `coveredByNeuroport` para poder elegir la alternativa (Techhair, Wolvers) y `getCyberwareList` las salta. `GearStep.tsx` las muestra como "(lo cubre el Neuroport)".
* **Munición del paquete** (37): "<Tipo> ... Ammunition" apunta a "<Tipo> Ammo" del pack (Incendiary, Core p.345).
* **Nota del Folio** (36): `folioNote`/`folioId` en `RoleAbilityProgression`; `StreetLabView` la muestra solo si la ficha es el Folio o una copia (`CharacterSheet.sourceFolioId`, lo pone el creador).
* **Docs**: `docs/canon-audit/v4.9.0-roles.md` y discrepancias 24-37, todas decididas por Giuliano; `doubts` de `role-ranks-*.json` anotadas con lo decidido. Thorn: "Solo Core" (decisión de Giuliano).
* **Verificación**: tsc, 156 tests (10 en `roleRanks.test.ts`, 4 de lifepath, 3 de Neuroport y 1 de munición); sonda de los 10 roles en 2 eras sin ciberware duplicado ni avisos; navegador: Exec 2077 con Biomonitor cubierto y Techhair elegible, nota del Folio en Wrench y Hardpoint y no en un Nomad propio y build; navegador: guía del Netrunner con la progresión del Core, sin errores de consola.

### [v4.8.2] - 2026-10-22 (Wizard funcional) [Claude Code · 2026-10-22]
* **Category**: Creador de personajes (plan 7, bloque 3).
* **Motor puro** `frontend/src/engine/characterCreation.ts` (sin React ni storage): `CreatorDraft` v1, métodos (`applyStreetratRow`, `applyEdgerunnerRoll`), puntos (62 STAT, 86 skills, ×2), lifepath CEMK/Core (`getLifepathTables`, `rollLifepathTable`, `buildCharacterLifepath` con `LIFEPATH_FIELD_MAP`), paquete de rol (`getRolePackage`), dinero (`getStartingMoney`, Running Out of Cash), Humanidad (`getCyberwareList`, `computeDerived`), validación (`validateStep`, `getMissingChecklist`) y `buildCharacterSheetFromDraft`. 36 tests.
* **Wizard** `features/creator/CharacterCreatorWizard.tsx` (orquestador, mismas props) + `features/creator/steps/` (Method, Role, Lifepath, Stats, Skills, Gear, Summary, CreatorUi). Borrador `cpr_creator_draft_v1` (`creatorDraftStorage.ts`, 7 tests).
* **Ficha**: `CharacterSheet.roleAbilityVariant?: 'core' | 'cemk'`. `CreatorPurchase.location` para la armadura por ubicación (Core p.97).
* **Store**: se quita el personaje demo "V" (`INITIAL_CHARACTER_V`); si no queda ninguna ficha se usa el Folio de Hardpoint.
* **Discrepancias 10-15** decididas por Giuliano y registradas en `docs/canon-audit/discrepancias-cemk-core.md`; nota de daño 3d6/4d6 en la Zhuo de Wrench.
* **Decisiones de diseño**: "Rocker" en 2077 / "Rockerboy" en 2045; tienda de 2077 Core + CEMK etiquetada; lifepath tirar o elegir; Media/Exec/Lawman solo con la habilidad del Core.
* **Verificación**: tsc, 138 tests y build. Navegador: Streetrat Solo 2077 de punta a punta (HP 45, Humanidad 33/40, Neuroport, paquete y compra), recarga a mitad con borrador retomado, pregen CEMK (copia con Humanidad EMP×10 − HL) y validación de Complete Package 2045.

### [v4.8.1] - 2026-10-22 (Datos canon del creador) [Claude Code · 2026-10-22]
* **Category**: Canon / creador (plan 7, bloque 2). Registro: `docs/canon-audit/v4.8.1-creador.md`. Discrepancias: `docs/canon-audit/discrepancias-cemk-core.md`.
* **Datos**: `data/creation-src/*.json` (5 archivos con página por dato y lista `doubts`) → `scripts/gen_creation.py` → `frontend/src/data/creation/*.ts` (generados) + `types.ts`.
* **`characterCreationData.ts`**:
  - `ROLES_CATALOG`: los campos `streetratStats`, `edgerunnerStatTable`, `templateCombatSkills`, `templateGeneralSkills` y `startingLoadout` quedan vacíos en el literal y los completa `applyCanonRoleData()` al final del módulo desde los datos canon (Core pp. 74-77, 86-87, 98-99, 103, 117).
  - `resolveSkillKey` resuelve los nombres del libro a claves de la app; `UNRESOLVED_CANON_SKILL_NAMES` y `UNMAPPED_CANON_CYBERWARE` están vacíos y el test lo exige.
  - Era 2077: `neuroportSubsystems` sale de `CEMK_CREATION.neuroport.pieces` más el Cyberdeck Port opcional.
  - `PREGEN_TEMPLATES`: se borran 11 pregens sin ficha en los libros y entran las 5 de Easy Mode.
* **Store**: `DEFAULT_CHARACTERS` ya no inyecta la banda del anime (`buildCemk2077Characters` devuelve []).
* **Wizard**: en 2077, el paquete de rol omite Agent, Neural Link e Interface Plugs; el texto del Neuroport sale del RB (pp. 25, 35).
* **Red Chrome Cargo**: se quitan los botones y la pestaña que cargaban la banda del anime.
* **Verificación**: pdf.js contra el JSON (STATs p.74, paquetes p.98, Easy Mode y Folio de Hardpoint; MOVE/LUCK de Easy Mode corregido). 95 tests. Navegador: tabla de STATs del Solo, Neuroport en 2077 y pregens de Easy Mode.

### [v4.8.0] - 2026-10-22 (Guardado robusto) [Claude Code · 2026-10-22]
* **Category**: Persistencia (plan 7, bloque 1: `docs/plans/plan7-creador-personajes.md`).
* **Persist v3**: `frontend/src/store/persistence.ts`. La clave `cpr-omni-deck-characters-v2` no cambia; `CHARACTERS_SCHEMA_VERSION = 3`, `APP_VERSION` se actualiza a mano.
  - `MIGRATIONS` 0→1 (nada), 1→2 (limpieza de artes marciales), 2→3 (sanitizado legacy + ciberware huérfano quitado y anotado en `notes`). `runMigrations(state, from)` → `{state, warnings}`.
  - `backupRawBeforeMigration` guarda `cpr-omni-deck-backup-v<N>` antes de migrar.
  - `safeCharacterStorage`: JSON corrupto → copia `cpr-omni-deck-corrupt-<ts>` + aviso; error de cuota → aviso. Canal `onPersistenceWarning` → `PersistenceBanner.tsx`.
  - `merge` solo inyecta premades (salteando `dismissedPremadeIds`) y corrige el id activo.
* **Respaldo completo**: `buildFullBackup` / `parseFullBackup` (fichas + `cpr_custom_npcs_v1`, `cpr_active_encounter_v1`, `cpr_gm_secret_notes_v1`, `cpr_custom_net_arch_v1`, `cpr-omni-deck-combat-v2`, `cpr_enemy_sheet_mode_v1`). La importación pasa por las mismas migraciones. Store: `exportFullBackup`, `importFullBackup(text, 'replace' | 'merge')`, `restorePremades`.
* **UI**: botones en `StreetLabView.tsx`; se quita "OFFLINE PWA READY" de `TopHudBar.tsx`; favicon `./favicon.svg`.
* **Verificación**: 85 tests (28 de persistencia). En el navegador, un guardado v2 con un implante inexistente migra a v3, deja la copia previa y anota lo quitado.

### [v4.7.0] - 2026-10-22 (Enemigos canon Core/CEMK/Hardened + porte CEMK) [Claude Code · 2026-10-22]
* **Category**: Canon / enemigos (plan 6, bloque 1: `docs/plans/plan6-enemigos-canon-cemk.md`). Registro: `docs/canon-audit/v4.7.0-enemigos-core-cemk-hardened.md` y `docs/canon-audit/v4.7.0-rcc-notes.md`.
* **Se perdió**: 36 fichas inventadas (sourceBook core 11, cemk_2077 14, dlc 10, interface_red 1) y Tamayura, Achilles, Chao y el Ballistic Coprocessor.
* **Se ganó**: 40 fichas canon (Core 10, CEMK 14, Hardened 16) con `sourcePage`. Las fuentes están en `data/enemies-src/*.json`; `scripts/gen_enemies.py` genera `frontend/src/data/enemies/*.ts` (no se editan a mano).
* **Se corrigió**: Security Officer SP 13 → 12 (Errata v1.25, Core p.415).
* **Porte CEMK**: `frontend/src/engine/cemkPort.ts` (`portEnemyToCemk`), con reglas del Rule Book de CEMK:
  - Neuroport para todos (pp. 15, 35-36).
  - Cyberdeck Port de 50 m y hasta 3 NET Actions (pp. 16-17).
  - Quickhacks según el rango de Interface (p.25).
  - Self-ICE solo si el libro lo trae (p.36).
  - Power/Smart/Tech/Melee (p.8) y SP contra melee a la mitad (p.10).
  - En las fichas CEMK nativas gana lo impreso.
* **UI**:
  - Selector CEMK | RED en `EnemiesCompendiumPanel.tsx` (`cpr_enemy_sheet_mode_v1`).
  - Botón de Quickhack restaurado en `RedChromeCargoView.tsx`.
  - `convertEnemyToCharacterSheet` usa el porte.
* **Red Chrome Cargo**: `redChromeCargoData.ts` pasa de 1940 a ~800 líneas, solo con canon.
* **Tests**: 62.
* **Persistencia**: los encuentros y los PNJ custom guardados son copias completas; los campos nuevos son opcionales.

### [v4.6.2] - 2026-10-21 (Hornet's Pharmacy, 12 Days of Gunmas y Errata v1.25 canon) [Claude Code · 2026-10-21]
* **Category**: Canon / datos (plan 5, bloque 2). Registro detallado: `docs/canon-audit/v4.6.2-farmacia-gunmas-errata.md`.
* **Hornet's Pharmacy** (pp. 2-5). Se perdió: Hover, Red Glass y Detox (inventados). Se ganó: 3 compuestos aditivos, Sedative, Veritas, el Suzumebachi Assassin Drone, Bodyweight AutoInjector y el Gas Jet. Se corrigió: Berserker, Prime Time, Sixgun y Timewarp (antes etiquetado como Core).
* **12 Days of Gunmas** (pp. 3-7). Se perdió: Erebus, Fox y Kolokol (inventados). Se ganaron 11 armas. Se corrigió el Nova 757 Cityhunter.
* **Errata v1.25**: Grafted Muscle & Bone Lace, Techtool, Rubber Ammo y Smoke corregidos en el pack.
* **Modelo/UI**: `sourcePage?: number` en WeaponItem, CyberwareItem, GearItem, DrugItem y AmmoItem; `renderSourceBookBadge(sourceBook, sourcePage)` lo muestra en el Compendium.
* **Pack**: se editaron a mano las dos copias (idénticas) y se replicaron los mismos cambios en `extract_core_pack.py`. **No se regenera** el pack con el script: este no está sincronizado (maxdoc-mk1, bounceback-mk1).
* **Desvío**: la errata del Security Officer (Core p.415) no se aplicó porque el Security Operative de `enemiesCatalog.ts` no coincide con esa ficha; pasa a v4.7.0 (enemigos).
* **Tests**: 44 (6 nuevos).

### [v4.6.1] - 2026-10-21 (Cyberfists of Fury canon) [Claude Code · 2026-10-21]
* **Category**: Canon / reglas (plan 5, bloque 1: `docs/plans/plan5-canon-audit.md`). Fuente: Interface RED Vol. 4 pp. 74-84. Registro detallado (qué se perdió, qué se ganó y qué se corrigió, con páginas): `docs/canon-audit/v4.5.1-cyberfists.md`.
* **Se perdió** (inventado, no existe en IR4): 10 formas (Animal Kung Fu, Chornobog's Kommando, Cyber-Wrestling, Hapkido, Jeet Kune Do, Jiu-Jitsu, Lethwei, Ninjutsu, Savate y Systema) y sus 20 movimientos.
* **Se ganó**: 10 formas canon (Arnis, Choy Li Fut, Jujutsu, Kendo, Kung Fu, Kyudo, Multiarm Melee, Sov-System, Tai Chi y Thamoc) con sus 20 movimientos.
* **Se corrigió**: los 26 movimientos de las 13 formas que ya estaban (sus ids se mantienen).
* **Modelo**: `MartialArtMove.sourcePage`, `MartialArtMove.opposedBy` y `MartialArtForm.sourcePage`. La UI (Combat HUD, Street Lab y NET/Roles) muestra la página y contra qué se enfrenta cada movimiento.
* **Migración**: persist `version` 2. Quita de los personajes guardados los rangos y chips de las formas borradas.
* **Tests**: 5 nuevos (23 formas IR4 con nombres canon, 27/54, páginas entre 74 y 84, sin ids inventados, DV > 0 si no es enfrentado). 38 tests en total.
* **Desvío**: se publica como v4.6.1 y no como v4.5.1 (numeración de los planes 2 y 5) porque `main` ya está en v4.6.0. Los nombres de la rama y del registro conservan "v4.5.1".

### [v4.6.0] - 2026-10-21 (Ripperdoc estilo Cyberpunk 2077) [Claude Code · 2026-10-21]
* **Category**: Diseño visual del Ripperdoc (plan 4: `docs/plans/plan4-ripperdoc-visual-2077.md`, aprobado por Giuliano). Solo visual: no cambia reglas ni datos salvo el fix de zonas.
* **Files Modified**:
  - `frontend/src/features/cyberware/CyberwareRipperdocView.tsx`
  - `frontend/src/features/cyberware/ripperdocZones.tsx` (nuevo)
  - `frontend/src/features/cyberware/HoloBody.tsx` (nuevo)
  - `frontend/src/features/cyberware/ZoneCard.tsx` (nuevo)
  - `frontend/src/features/cyberware/SlotBox.tsx` (nuevo)
  - `frontend/src/features/cyberware/GoingMetalBanner.tsx` (nuevo)
  - `frontend/src/features/cyberware/ZoneConnectors.tsx` (nuevo)
  - `frontend/src/features/cyberware/ZoneDetailPanel.tsx` (nuevo)
  - `frontend/src/features/cyberware/cyberwareCardArt.ts` (nuevo)
  - `frontend/public/cemk/cyberware/` (6 cartas JPG nuevas)
  - `frontend/src/index.css`
  - `frontend/src/engine/__tests__/rules.test.ts`
  - `.claude/launch.json` (nuevo)
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CONTENT_CHECKLIST.md`
* **What Changed**:
  1. Fase 1: `CyberwareRipperdocView.tsx` pasó de 2235 a ~1030 líneas. Componentes nuevos en `features/cyberware/`: `ripperdocZones.tsx` (zonas, colores, `ZONE_HOTSPOTS`, `itemMatchesZone`), `HoloBody.tsx`, `ZoneCard.tsx`, `SlotBox.tsx` y `GoingMetalBanner.tsx`. El HTML se verificó idéntico al original antes de cambiar el diseño.
  2. Fase 2: figura holográfica (silueta anatómica en pose A, glow, rejilla hexagonal, columna, costillas y articulaciones, retícula y regla de altura). 9 zonas interactivas generadas desde datos (nueva: Fashionware en la muñeca), hover y selección con el color de la zona, badge de implantes, líneas guía, foco por teclado y animaciones `holo-scanline`, `holo-flicker` y `holo-pulse` con soporte de reduced motion.
  3. Fase 3: slots biselados (`.chamfer-slot`, hover amarillo 2077 `#fcee0a`, compactos en desktop), tarjetas de zona con contador en segmentos y botón de catálogo 2077, `ZoneConnectors.tsx` (líneas medidas tarjeta a cuerpo en xl), `ZoneDetailPanel.tsx` (implantes de la zona, inspección y catálogo) y layout móvil con la figura primero y torres compactas.
  4. Fase 4: 6 cartas oficiales de ciberware del Cyberpunk Edgerunners Mission Kit en `frontend/public/cemk/cyberware/` y `cyberwareCardArt.ts`. Son cartas de texto, así que se ven completas al inspeccionar el implante y los slots muestran un indicador ▣ (decisión de Giuliano).
  5. Fix: `itemMatchesZone` no ubicaba 'Cyberarm Option' (Mantis Blade, Gorilla Arm, Monowire...), 'Neuralware Option' (Berserk...) ni 'Borgware x2' (Omega Internal), por lo que no aparecían en ningún catálogo ni slot. Test nuevo de cobertura de zonas (33 tests en total).
  6. Fase 5: textos de Going Metal del banner y los chips corregidos (ya no dicen "Interface RED Vol. 3", "16 implantes", "-14 HL" ni "0 HL al intercambiar"). Las animaciones `animate-in`, `fade-in` y `zoom-in-95` se definieron en `index.css`: no había plugin y no hacían nada; ahora la entrada de modales y paneles se anima en toda la app.
  7. Setup: `.claude/launch.json` para el dev server (`omni-deck-dev`, puerto 5173).
  8. Pendiente: v4.5.1 Cyberfists of Fury (plan 2 fase 5), plan 3 (se perdió al reescribirse), modo Settings y GM Master Screen.

### [v4.5.0] - 2026-10-21 (Going Metal canon: Full Body Conversion) [Claude Code · 2026-10-21]
* **Category**: Datos de expansión y reglas (plan 2, fase 4: `docs/plans/plan2-auditoria-expansiones.md`)
* **Files Modified**:
  - `data/core-rules.cprpack.json`
  - `frontend/src/data/core-rules.cprpack.json`
  - `frontend/src/data/expansionRulesData.ts`
  - `frontend/src/data/goingMetalFbcData.ts`
  - `frontend/src/engine/__tests__/rules.test.ts`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/cyberware/CyberwareRipperdocView.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CONTENT_CHECKLIST.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. Datos canon de Going Metal pp. 91-111 en `goingMetalFbcData.ts` (reescrito): 13 cuerpos `gm-*` (Copernicus, Aquarius, Brimstone, Dragoon, Eclipse, Enforcer, Spyder-2, Sheol, Samson, Gemini, Wiseman, Alpha Class, Kildare) con BODY del frame, `statFloor` (mínimo REF/DEX/MOVE por hidráulica), SP base, `armorPenalty` (Dragoon -2), `packageHlAverage` y ciberware con y sin HL y página. 20 ciberwares (incluye Biosystem y Borgware), 6 de equipo, guía About FBCs, `FBC_IMMUNE_CRITICAL_INJURIES` (9 heridas), `FBC_IMMUNITIES`, `BIOSYSTEM_HL_AVERAGE` = 14 y tabla de HP de Linear Frame Omega. Se quitó `moveOverride`.
  2. Conversión: HL = 14 (Biosystem) + HL del paquete del cuerpo; cambiar de cuerpo cuesta el HL del paquete (p. 95). HP al máximo del cuerpo nuevo (p. 94). Armadura del chasis con su penalizador. `gm-biosystem` se instala en la primera conversión y cuenta como Borgware para el tope de terapia.
  3. Motor (`characterEngine.ts`): REF/DEX/MOVE = max(base, `statFloor`) (pp. 107-108); el FBC no sufre penalizadores de Wound State ni el -6 MOVE de Mortally Wounded (p. 94); Speedheal no funciona en FBC; Cryotank no duplica la curación en FBC; inmune a 9 heridas críticas y a su +5 de daño (p. 94); la terapia cuenta 'Borgware x2' como -8.
  4. Ripperdoc: textos con el HL real, 'Going Metal' en lugar de 'Interface RED Vol. 3', y tope de Humanidad que suma todo el ciberware (pack + Going Metal).
  5. Pack `core-rules.cprpack.json` (ambas copias): borrados 29 `fbc-*` inventados y `borg-heavy-autocannon`, `borg-super-shotgun`, `grenade-laser-chaff`, `external-linear-frame-omega`.
  6. `expansionRulesData.ts`: `fbc-rules` reescrito desde la guía canon; se borró lo inventado (medio HL, 7 chasis, DaiOni, Vermilion).
  7. Tests: 32 en total (4 nuevos de FBC). `tsc -b --noEmit` limpio.
  8. Setup local de Claude Code (no afecta a la app): subagentes en Sonnet, skill `checkpoint` + hook Stop `checkpoint-guard.sh`, skill de PDFs con lectura local.
  9. Pendiente (fuera de alcance): marcos Black Chrome (Vermilion, Fūma Kotarō); el HL de cada pieza del paquete no se instala como ciberware individual para el tope de terapia; volver a un cuerpo viejo no limita la Humanidad. Dudas del libro: el `packageHlAverage` impreso no siempre cuadra con su fórmula (Enforcer 53 vs el ejemplo de p. 95 con 55); los precios del ejemplo Bazooka Joe son inconsistentes.

### [v4.4.0] - 2026-10-20 (Roles, Martial Arts, curación, terapia y granadas del Core; sin modos de carga) [Claude Code · 2026-10-20]
* **Category**: Reglas del Core (plan 2, fase 3: `docs/plans/plan2-auditoria-expansiones.md`)
* **Files Modified**:
  - `data/core-rules.cprpack.json`
  - `frontend/src/data/characterCreationData.ts`
  - `frontend/src/data/core-rules.cprpack.json`
  - `frontend/src/data/cyberfistsMartialArtsData.ts`
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/data/weaponAndCyberwareTooltips.ts`
  - `frontend/src/data/weaponAttachmentsAndTechData.ts`
  - `frontend/src/engine/__tests__/rules.test.ts`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/cyberware/CyberwareRipperdocView.tsx`
  - `frontend/src/features/gm/FixerDeckView.tsx`
  - `frontend/src/features/netroles/NetAndRolesDeckView.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CONTENT_CHECKLIST.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **Modos de carga borrados (R10)**: `ENCUMBRANCE_MODES`, el tipo `EncumbranceMode`, `setEncumbranceMode` y los selectores de Street Lab, HUD y Fixer Deck. El Core no tiene regla de carga. El campo viejo `encumbranceMode` que quede en partidas guardadas se ignora.
  2. **Roles (X8)**: `ROLE_ABILITIES_COMPLETE_PROGRESSION` y `ROLES_INTERACTIVE_GUIDES` reescritos desde el Core pp. 143-162, sin títulos ni beneficios inventados (Backup, Operator, Teamwork, Credibility, Moto y Charismatic Impact con sus tablas por rango). Combat Awareness con las 6 opciones del Core p. 146 (no existe Damage Absorption); `soloAwarenessPointCost` e `isValidSoloAllocation` impiden gastar más puntos que el rango y respetan los topes (+3 Precision, -5 Deflection); Fumble Recovery cuesta 4. Medtech: los 5 Pharmaceuticals son Antibiotic, Rapidetox, Speedheal, Stim y Surge (Veritine y Cryo-Stasis borrados); síntesis TECH + Medical Tech contra DV 13 (Core p. 149). Maker: TECH + Skill + rango contra la tabla del Core p. 149 (Very Expensive DV 24, Super Luxury 1 mes por cada 10,000eb). Los Checks de rol, Maker y resistencia a EMP deben superar el DV.
  3. **Martial Arts (X9)**: los 8 Special Moves del Core pp. 179-180 (Disarming Combination, Iron Grip, Armor Breaking Combination, Bone Breaking Strike, Counter Throw, Grab Escape, Pressure Point Strike, Flying Kick) reemplazan a los inventados; Bone Breaking Strike, Pressure Point Strike y Flying Kick se resuelven contra DEX + Evasion (`isOpposed`). `SHARED_MARTIAL_ARTS_MOVES` con Recovery (DV 13).
  4. **Humanidad (X10)**: `calculateTherapyMaxHumanity` (Core p. 230): -2 por ciberware, -4 por borgware, 0 HL no cuenta. La Humanidad recuperada no pasa ese tope. Terapia Standard (500 €$, 2d6, DV 15) y Extreme (1,000 €$, 4d6, DV 17) en el Ripperdoc.
  5. **Granadas (X11)**: lanzar usa la fila Grenade Launcher de la tabla de rango hasta 25 m (Core pp. 173, 177). Las granadas siguen las municiones del Core pp. 345-347: la básica es Armor-Piercing 6d6, Incendiary 6d6 + fuego, Biotoxin/Poison/Sleep/Teargas/Flashbang/EMP/Smoke sin daño y con su tirada; se agregaron Poison, Sleep y Teargas.
  6. **Curación (X13)**: `naturalHealingPerDay` (BODY por día, x2 Enhanced Antibodies, x2 Cryotank, Core pp. 114, 223, 353) y `speedhealAmount` (BODY + WILL, no en Mortally Wounded, Core p. 150). Sin estabilizar a 1+ HP no hay descanso. Antibiotic y Surge agregadas al pack.
  7. **Tests**: 5 casos nuevos (Combat Awareness, curación, Speedheal, tope de terapia, Special Moves). Total 28.
  8. **Pendiente**: Damage Deflection y Fumble Recovery no se aplican solos en las tiradas; el "1 vez por día" de Speedheal no se registra (la app no lleva el tiempo de juego). El catálogo de PNJ (`enemiesCatalog.ts`) y Red Chrome Cargo usan armas y ciberware que no existen (Ballistic Coprocessor, Tamayura, Achilles, Chao): queda para una auditoría aparte.

### [v4.3.1] - 2026-10-20 (Datos CEMK canon: 13 armas, ciberware, Immunoblockers y Rebuilds de 1,000 €$) [Claude Code · 2026-10-20]
* **Category**: Datos de expansión (plan 2, fase 2: `docs/plans/plan2-auditoria-expansiones.md`)
* **Files Modified**:
  - `frontend/src/data/core-rules.cprpack.json`
  - `data/core-rules.cprpack.json`
  - `frontend/src/data/weaponAndCyberwareTooltips.ts`
  - `frontend/src/data/expansionRulesData.ts`
  - `frontend/src/data/enemiesCatalog.ts`
  - `frontend/src/engine/__tests__/rules.test.ts`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/rules/RulesCheatSheetDrawer.tsx`
  - `frontend/src/features/datapacks/DataPackManagerView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CONTENT_CHECKLIST.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **Armas CEMK**: se unificaron los dos sets duplicados (`cemk_2077` y `cemk`) en uno solo con las 13 armas de CEMK pp. 31-34 (Yukimura, Masamune, Shingen, Carnage, Unity, Zhuo, Crusher, Lexington, Omaha, Satara, Burya, Grad y Nekomata), con costo, cargador y tipo de Rebuild del libro. Se borraron 6 armas inventadas (Tamayura, Shigure, Kenshin, Chao, Dian, Achilles). Militech Crusher agregada. Mantis Blades y Gorilla Arms quedan como entradas melee. Total del pack: 109 → 98 armas.
  2. **Ciberware CEMK** (CEMK pp. 34-36): Neuroport 1,000 €$ y HL 7 (gratis y sin HL al crear el personaje, CEMK p. 25), Berserk HL 7, Mantis Blade 500 €$ y HL 14, Self-ICE HL 3 en Hospital. Agregados David's Sandevistan (250,000 €$, HL 14), Ex-Disk, Monowire, Neuroport Cyberdeck Port y Projectile Launch System. Borradas las 12 entradas `cemk_2077` inventadas o duplicadas. Total: 159 → 152.
  3. **Drogas**: Immunoblockers reescrita desde CEMK p. 30 (2d6 Humanidad, Secondary Effect DV 21). Borradas MaxDoc Mk.1 y BounceBack Mk.1, que no existen en CEMK.
  4. **Rebuilds** (CEMK pp. 30-31): 1,000 €$ (Very Expensive), 2 ranuras, 1 hora de instalación. Se borró la fabricación con Maker (DV 17, 1 semana, 250 €$) y el Ballistic Coprocessor, que no existen. Power: el rebote con Aimed Shot solo usa el penalizador del Aimed Shot. Smart: Personal Link o Subdermal Grip, incompatible con Smartgun Link; con Improved Smart Ammunition ignora humo y oscuridad y repite el ataque con 14 si falla por 5 o menos. Tech: carga con la Acción de Movimiento, dura 20 Rounds, el disparo cargado es ROF 1. El taller de Street Lab cobra 1,000 €$.
  5. **Boosterganger**: BODY 2 y Death Save 2 (Errata v1.25 p. 412).
  6. **Tests**: 4 casos nuevos en `rules.test.ts` (Rebuilds, armas CEMK, Neuroport y Mantis Blade, Boosterganger). Total 23.
  7. **Sin migración**: el inventario guarda copias completas de cada ítem, así que los personajes que tengan un ítem borrado lo conservan.
  8. **Revisado sin cambios**: la ficha de Hardpoint coincide con el folio (X12 era un falso positivo) y el ciberware de los folios es equipo premade canon.
  9. **Pendiente**: menciones a Ballistic Coprocessor y Tamayura en `enemiesCatalog.ts` y `redChromeCargoData.ts` (PNJ y aventura), y el coprocesador de `goingMetalFbcData.ts` (fase de Going Metal).

### [v4.3.0] - 2026-10-20 (NET y Quickhacks canon: 3 NET Actions, sin RAM, Black ICE del Core) [Claude Code · 2026-10-20]
* **Category**: Reglas de NET (plan 2, fase 1: `docs/plans/plan2-auditoria-expansiones.md`)
* **Files Modified**:
  - `frontend/src/data/core-rules.cprpack.json`
  - `data/core-rules.cprpack.json`
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/data/expansionRulesData.ts`
  - `frontend/src/data/weaponAndCyberwareTooltips.ts`
  - `frontend/src/data/enemiesCatalog.ts`
  - `frontend/src/data/characterCreationData.ts`
  - `frontend/src/data/systemDocsAndChangelogData.ts`
  - `frontend/src/engine/combatEngine.ts`
  - `frontend/src/engine/__tests__/rules.test.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/netroles/NetAndRolesDeckView.tsx`
  - `frontend/src/features/oneshot/RedChromeCargoView.tsx`
  - `frontend/src/features/rules/RulesCheatSheetDrawer.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CONTENT_CHECKLIST.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **NET Actions**: hasta 3 por turno en cualquier rango (CEMK p. 15, decisión del usuario sobre la tabla 2/3/4/5 del Core p. 197). Constantes `NET_ACTIONS_PER_TURN` y `NET_ACTIONS_DIRECT_CONNECTION_BONUS` (+1 por Interface Plug, CEMK p. 27) en `netAndRolesData.ts`; se usan en la consola NET, la guía de Quickhacking, los tooltips de Netrunner, la hoja de reglas y el Hardened Netrunner.
  2. **Quickhacks sin RAM**: la sección de expansiones y la guía oficial se reescribieron desde CEMK pp. 15-17 y 26-27 (Jack In, Breach, Quickhack, Boot Out; alcance 6/8/50 m según el Cyberdeck; 1 Quickhack por objetivo por turno). Se borraron los 14 programas `qh-*` del pack (RAM, costos y 7 quickhacks inventados: Contagion, Suicide, Memory Wipe, Detonate Grenade, Optics Jammer, Weapon Glitch, Cripple Movement); el catálogo de 11 de `netAndRolesData.ts` es la única fuente.
  3. **HUD de combate**: selector de conexión con el alcance de CEMK p. 26, bloqueo de un segundo Quickhack en el mismo turno con botón "Nuevo turno", Breach que debe superar el DV y el log ya no muestra INT (Interface no suma STAT, CEMK p. 16).
  4. **Consola NET y Quickhacks de la pestaña NET**: Jack In y Boot Out con WILL y Concentration editables del objetivo (antes fijos en 6 y 2), Boot Out contra una tirada nueva de Interface, empates para el defensor, d10 que explota y pifia, y DV que hay que superar, no igualar (CEMK p. 5).
  5. **Black ICE y arquitecturas**: tabla `BLACK_ICE_STATS` con PER/SPD/ATK/DEF/REZ del Core pp. 206-207; los presets y el generador de pisos la usan (había 8 presets con stats inventados). Dificultades canon Basic/Standard/Uncommon/Advanced (Core p. 210) en lugar de "Hardened"/"Corporate Apex"; fuera los DV 13 y 14.
  6. **Acciones de Interface**: Scanner es Meat Action sin DV (el GM interpreta el total, Core p. 199); Backdoor hasta DV 12; Eye-Dee usa el DV del File; Control y Virus con el texto del Core pp. 199-200.
  7. **Programas del pack**: Flak reduce a 0 el ATK de los Attacker no Black ICE (antes tenía el efecto de Shield), Flak y Shield con REZ 7; Armor, Skunk y Wisp con el texto del Core pp. 203, 207.
  8. **Motor**: `rollCheckD10` y `beatsDv` en `combatEngine.ts`; 5 tests nuevos (19 en total).

### [v4.2.1] - 2026-10-20 (Deuda técnica: carga por pestaña, calculadora en el motor, tests de reglas) [Claude Code · 2026-10-20]
* **Category**: Arquitectura y calidad (plan 1, fase 5: `docs/plans/plan1-auditoria-core.md`)
* **Files Modified**:
  - `frontend/src/App.tsx`
  - `frontend/src/engine/combatEngine.ts`
  - `frontend/src/engine/__tests__/rules.test.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/gm/FixerDeckView.tsx`
  - `frontend/src/features/packs/DataPacksView.tsx (eliminado)`
  - `frontend/package.json`
  - `frontend/package-lock.json`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CLAUDE.md`
  - `.agent/AGENTS.md`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **Carga por pestaña**: `App.tsx` carga cada vista con `React.lazy` + `Suspense`. El bundle inicial baja de 2.126 kB a 598 kB; cada módulo se descarga al abrir su pestaña.
  2. **Calculadora de impactos en el motor**: la lógica de SP, ablación, cabeza x2/x3, crítico +5 y escudos pasa de `CombatHudView.tsx` a `calculateIncomingImpact` en `combatEngine.ts` (mismo resultado). Se borró `calculateArmorAblation` y la acción sin uso `applyIncomingDamage` del store.
  3. **Tests de reglas**: Vitest con 14 casos en `src/engine/__tests__/rules.test.ts` (HP, Wound States, Death Saves, EMP, HL, Brawling, críticos, ablación, AP, melee, cabeza, orden de la tabla de críticos y re-tirada), cada uno con su página del Core. Nuevo script `npm test`; `CLAUDE.md` y `.agent/AGENTS.md` lo agregan a la definición de terminado.
  4. **Código muerto**: se borró `features/packs/DataPacksView.tsx` (no se importaba) y las dependencias sin uso `clsx` y `tailwind-merge`.
  5. **PIN del GM**: la clave pasa a `cpr_gm_pin_v1` y se migra sola desde `cpr-gm-pin`.

### [v4.2.0] - 2026-10-20 (Combate: melee enfrentado, munición y autofire corregidos, quickhacks con WILL real) [Claude Code · 2026-10-20]
* **Category**: Reglas de combate (plan 1, fase 4: `docs/plans/plan1-auditoria-core.md`)
* **Files Modified**:
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **Melee enfrentado (R6, Core p. 176)**: armas Melee, Brawling, Grab, Martial Arts, bayoneta y golpes Cyberfists ya no usan DV 13 fijo. Hay un campo "DEX + Evasion del defensor" en el panel de cuerpo a cuerpo y cada ataque tira 1d10 para el defensor; el empate lo gana el defensor.
  2. **Cyberarm (Core p. 176)**: el daño de Brawling es al menos 2d6 con Cyberarm o Gorilla Arms instalados.
  3. **Munición y autofire (B5, B6)**: se valida el alcance antes de gastar balas; un Ataque Apuntado nunca usa autofire (ni 10 balas ni su DV).
  4. **Multiplicador de autofire (B7)**: el daño usa el último ataque del arma; si ese ataque falló, no se arrastra el multiplicador de un acierto anterior.
  5. **Empates (B8, Core p. 129)**: Cyberfists, combos, quickhacks y adicción usan `margen > 0`, igual que el motor.
  6. **Quickhacks (B9, B10, CEMK p. 16)**: con 10 o 1 en el d10 ya no se tira daño antes de resolver la explosión; Jack In y Boot Out usan la WILL y Concentration del objetivo (campos editables), y el empate en Jack In detecta al hacker.
  7. **Desvíos del plan**: la "tabla de DV duplicada" de `types/cyberpunk.ts` resultó ser ejemplos de habilidades con valores correctos (no se borró). Mover la calculadora de impactos al motor pasa a la fase 5, junto con los tests.

### [v4.1.1] - 2026-10-20 (Bugs del store: FBC reversible, HP máximo único, parseo de Humanity Loss) [Claude Code · 2026-10-20]
* **Category**: Corrección de bugs de estado (plan 1, fase 3: `docs/plans/plan1-auditoria-core.md`)
* **Files Modified**:
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/store/useCombatStore.ts`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/gm/FixerDeckView.tsx`
  - `frontend/src/features/layout/TopHudBar.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **FBC reversible (B2)**: `activateFullBodyConversion` ya no pisa `stats.BODY` ni `stats.MOVE`; el chasis se aplica con `getEffectiveBody` / `getEffectiveMove`. Guarda la armadura previa en `fbcState.preFbcHeadArmor` / `preFbcBodyArmor` y `deactivateFullBodyConversion` la restaura y recorta el HP al nuevo máximo. Activar ya no revive a un personaje en 0 HP. Los personajes convertidos antes de esta versión conservan los stats que ya se habían pisado.
  2. **HP máximo único (B3)**: `adjustHp`, `setHp`, `updateStat`, `gmUpdateCharacterVitals`, la ficha, el TopHudBar y el Fixer Deck usan el BODY efectivo. La ficha muestra BODY y MOVE del chasis cuando hay FBC.
  3. **Parseo de Humanity Loss (B4)**: `parseHumanityLossAverage` lee "2d6 (7)", "14 (4d6)" y "0 (N/A)" correctamente (antes "2d6 (7)" restaba 267).
  4. **Validaciones (B12, B13)**: `consumeAmmo` rechaza cantidades no positivas; `updateStat`, `adjustHp` y `setHp` ignoran NaN; las transacciones registran el monto realmente movido cuando el saldo no alcanza.
  5. **Persistencia**: los dos stores Zustand declaran `version: 1` y `migrate`, listos para futuras migraciones sin perder partidas.
  6. **Desvío del plan**: B1 (re-inyección de premades CEMK) se mantiene a pedido del usuario.

### [v4.1.0] - 2026-10-20 (Mortally Wounded, Death Saves, críticos automáticos y EMP por Humanidad) [Claude Code · 2026-10-20]
* **Category**: Reglas de heridas y muerte del Core Rulebook (plan 1, fase 2: `docs/plans/plan1-auditoria-core.md`)
* **Files Modified**:
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CONTENT_CHECKLIST.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **Mortally Wounded (Core p. 186)**: con menos de 1 HP el penalizador de herida pasa de -2 a -4 a todas las Acciones (los Wound States se reemplazan) y MOVE baja 6 (mínimo 1). Funciones nuevas `isMortallyWounded`, `getBaseDeathSavePenalty` y `rollDeathSave` en `characterEngine.ts`.
  2. **Death Saves (Core p. 188)**: botón "Tirar Death Save" en Biomonitor y Vitales del HUD de combate. Tira 1d10 + penalizador base (críticos) + acumulado; vive si el total es menor que BODY, un 10 natural falla siempre, cada tirada suma 1 al acumulado. Si falla, el personaje queda MUERTO (con botón Deshacer). El acumulado vuelve a 0 al subir a 1+ HP. Campos opcionales nuevos `deathSavePenalty` e `isDead` en `CharacterSheet` (no rompen datos guardados).
  3. **Críticos automáticos en la calculadora de impactos (Core pp. 187-188)**: si se marca Crítico, además del +5 directo a HP se tira la Herida Crítica en la ubicación (cabeza o cuerpo). Si el personaje ya estaba Mortally Wounded y un ataque le hace daño, sufre otra Herida Crítica y su Death Save Penalty sube 1. Con *Cracked Skull* el daño a la cabeza se multiplica x3.
  4. **EMP efectiva (Core p. 80)**: `getEffectiveEmp` = mín(EMP, piso(Humanidad/10)). La ficha muestra la pérdida como penalizador en la casilla de EMP y la tabla de habilidades usa la EMP efectiva.
  5. **Desvío del plan**: B11 (efectos de apuntado a pierna y mano) queda como texto, porque el objetivo de esos ataques es un PNJ que la app no modela.

### [v4.0.3] - 2026-10-20 (Tablas canon de Heridas Críticas, Neural Link y correcciones de datos) [Claude Code · 2026-10-20]
* **Category**: Corrección de reglas contra el Core Rulebook (plan 1, fase 1: `docs/plans/plan1-auditoria-core.md`)
* **Files Modified**:
  - `frontend/src/data/criticalInjuries.ts`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/data/core-rules.cprpack.json`
  - `data/core-rules.cprpack.json`
  - `frontend/src/data/characterCreationData.ts`
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CLAUDE.md`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `AI_CONTEXT_HANDOFF.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `CHECKPOINT.md`
* **What Changed**:
  1. **Heridas Críticas canon (Core pp. 187-188)**: la tabla de Cuerpo estaba desordenada (9 de 11 entradas), faltaba *Dismembered Hand* y existía una entrada inventada (*Bone Fracture*). Se reescribieron ambas tablas con el orden, efecto, Quick Fix y Treatment del libro, y sus modificadores (`allActionsPenalty`, `movePenalty`, `rangedAttackPenalty`, `meleeAttackPenalty`, `bonusDeathSavePenalty`) se ajustaron al texto. Se quitaron efectos sin fuente (Brain Injury solo a INT/WILL/COOL, Crushed Windpipe con daño por turno, Spinal Injury con 1d10 de parálisis, Broken Leg a la mitad de MOVE, entre otros).
  2. **Re-tirada de críticos repetidos (Core p. 187)**: `rollCriticalInjury` recibe las heridas activas sin tratar y vuelve a tirar 2d6 hasta sacar una que el objetivo no tenga.
  3. **Neural Link (Core p. 111)**: el ítem `neuralware-processor` pasaba como "Neuralware Processor" a 1000eb; ahora es *Neural Link*, 500eb, HL 2d6 (7), 5 Option Slots. Se mantiene el id para no romper paquetes ni partidas guardadas.
  4. **Munición Smart (Core p. 346)**: requiere Targeting Scope; si fallas un tiro simple por 4 o menos, segunda tirada con 10 + 1d10 (+LUCK) contra el mismo DV.
  5. **Black ICE Asp (Core p. 206)**: ATK 2 en el preset de arquitectura "Bar El Coyote Cojo" (decía 4).
  6. **`CLAUDE.md`**: Seriously Wounded es HP `<` ceil(MaxHP/2) (Core p. 186), no `<=`.

### [v4.0.2] - 2026-10-20 (CEMK Canonical Quickhacking [Zero RAM, 11 Hacks, 4-Step Combat Flow], Combat HUD Damage Calculator & Ergonomic Header Layout)
* **Category**: Canonical CEMK 2077 Rules, Combat HUD Ergonomics & Two-Row Card Header Architecture
* **Files Modified**:
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/features/netroles/NetAndRolesDeckView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/oneshot/RedChromeCargoView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `AI_CONTEXT_HANDOFF.md`
* **What Changed**:
  1. **Purga Integral de RAM y Quickhacking Canónico CEMK 2077 (`netAndRolesData.ts`, `NetAndRolesDeckView.tsx`, `CombatHudView.tsx`, `RedChromeCargoView.tsx`)**:
     - *Erradicación total de la RAM de videojuego*: En el juego de rol de mesa Cyberpunk Edgerunners Mission Kit (pp. 16-18, 26-28, 39, 42), el Quickhacking opera 100% mediante NET Actions en combate táctico (1 NET Action por Quickhack, con límite de 1 Quickhack por objetivo por Turno).
     - *Catálogo Estricto de los 11 Quickhacks Oficiales*:
       - **Simple (Interface R1+, DV 6)**: *Impair Movement* (-1 MOVE por 60s), *Sonic Shock* (condición Damaged Ear por 60s sin daño extra).
       - **Standard (Interface R2+, DV 8)**: *Overheat* (fuego térmico: 4 daño directo a HP/turno ignorando SP hasta que se apague con 1 Acción), *Short Circuit* (apaga 3 piezas de ciberware secundario por 60s).
       - **Difficult (Interface R3+, DV 10)**: *Cyberware Malfunction* (el Netrunner anula 1 implante crítico por 60s), *Lure* (distracción acústica simulada), *Slow* (reduce el MOVE del blanco en 1d6 durante 60s), *Synapse Burnout* (inflicción de 3d6 daño directo a HP ignorando SP; ¡además, a Interface 3+ el hacker supera automáticamente el Firewall base DV 6 de cualquier Neuroport!).
       - **Advanced (Interface R4+, DV 12)**: *Puppet* (secuestro motor total: el Netrunner controla la Acción y el Movimiento del blanco en su turno), *Shard Ejection* (expulsión forzosa de Chipware), *System Reset* (síncope total: deja al blanco Inconsciente y Prone durante 60s o hasta que sufra daño).
     - *Flujo Canónico de 4 Pasos*: Integración interactiva y telemétrica del procedimiento canónico: Paso 1 (Jack In vs WILL del blanco con detección de intrusión), Paso 2 (Romper Passwalls / Self-ICE DV 6/8/10, con Bypass automático de Firewall base DV 6 para Interface 3+), Paso 3 (Lanzar Quickhack a 1 NET Action con resolución de daño automático 3d6/1d6) y Paso 4 (Contramedida de Expulsión / Boot Out del objetivo mediante tirada de WILL + Concentration vs Interface).
  2. **Rediseño Integral de la Calculadora de Daño e Impactos (`CombatHudView.tsx`)**:
     - Eliminados los 8 botones preset fijos (`[5] [8] [10] [12] [15] [18] [22] [25]`).
     - Sustituidos por un campo numérico libre `<input type="number" min={0} max={200} ... />` centrado y tipografía monospace de alta legibilidad, flanqueado por botones tácticos `-1` y `+1` para ajuste fino de daño bruto entrante.
  3. **Arquitectura de Cabeceras HUD de Dos Filas (`CombatHudView.tsx`)**:
     - Reestructuración de `CollapsibleHudCard` en dos filas diferenciadas: Fila 1 (controles de arrastre/colapso, título de sección y botones de acción rápida como `🔄 Restaurar Suerte` o badges `GRAVE (-2)`); Fila 2 (sub-barra de espacio `[S] [M] [L] [↕ Todo] [-] [+]` visible únicamente cuando la tarjeta está desplegada).
     - Previene completamente el solapamiento de textos, títulos o iconos (`✨ SUERTE (LUCK)`) incluso en resoluciones ultra compactas de 3 columnas.
     - Pips de Suerte ajustados con `flex flex-wrap gap-1.5` y contador de inversión `[-] +0 [+]` redimensionado armónicamente.

### [v4.0.1] - 2026-10-20 (STATS Tooltip Clipping Fix, Canonical Resting & Medical Assistance, Netrunning GM Mode & Interface Actions DV Fix)
* **Category**: UI Ergonomics, Resting & Medical Systems, Netrunning GM Mode & Interface Rules
* **Files Modified**:
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/data/weaponAndCyberwareTooltips.ts`
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/features/netroles/NetAndRolesDeckView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `frontend/src/data/systemDocsAndChangelogData.ts`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `AI_CONTEXT_HANDOFF.md`
* **What Changed**:
  1. **Corrección de Clipping en Tooltips de STATS (`StreetLabView.tsx`)**:
     - Retirada la clase `.chamfer-card` del contenedor de estadísticas básicas (`ESTADÍSTICAS BÁSICAS (10 STATS)`), ya que su propiedad CSS `clip-path` recortaba los tooltips emergentes en pantalla.
     - Reemplazado por bordes redondeados (`rounded-xl border border-red-500/30`) y estilo `relative z-30 overflow-visible` tanto en el contenedor como en la rejilla interna para renderizado impecable.
  2. **Especificación Exhaustiva de Descanso Natural y Asistencia Médica (`weaponAndCyberwareTooltips.ts`, `StreetLabView.tsx`, `CombatHudView.tsx`)**:
     - *Estabilización & Reposo Natural*: DVs 10, 13 y 15 para Estabilización según condición médica; regla de esfuerzo severo (0 HP recuperados si se realizan tareas extenuantes); curación base de 1x BODY HP por día de descanso completo.
     - *Anticuerpos Mejorados (Enhanced Antibodies)*: Coste 500 eb, 1 ranura interna, 2 HL (1d6), duplica la tasa de curación natural a 2x BODY HP/día (o 3x BODY HP/día combinado con Criotanque). Botón interactivo de compra e instalación rápida en Street Lab y Combat HUD.
     - *Criotanque (Cryotank)*: Coste 5.000 eb de compra, 30 SDP, servicio hospitalario a 100 eb/día (+50 eb en suministros médicos), uso gratuito para Medtech Rango 4+ (pagando solo 50 eb de químicos). Otorga curación acelerada (+BODY HP adicionales al día) e ignora penalizadores de heridas críticas mientras el paciente permanezca conectado. Botones de acción directa para costear estancia hospitalaria o suministros Medtech.
     - *Criobomba (Cryopump)*: Coste 5.000 eb de compra, unidad portátil que congela salvadas de muerte para pacientes con menos de 1 HP durante 1 hora por dosis consumiendo 50 eb de suministros químicos.
     - *Speedheal*: Coste 200 eb, inyección de emergencia que restaura BODY + WILL HP al instante (máximo 1 dosis cada 24 horas; dosis adicionales causan daño en lugar de curación). Botón interactivo de inyección inmediata con actualización en el biomonitor.
  3. **Modo Master (GM) en Netrunning (`NetAndRolesDeckView.tsx`)**:
     - Ocultación por defecto del catálogo de 9 arquitecturas de red y del botón `+ AÑADIR PISO` para jugadores.
     - Nuevo toggle `👑 MODO MASTER (GM): SELECCIONAR / EDITAR ARQUITECTURA` para desplegar la administración de arquitecturas únicamente cuando el Árbitro lo requiera.
     - Panel compacto de información y estado de conexión para jugadores cuando el modo GM está cerrado.
  4. **Detalle Reglamentario de 9 Acciones de Interfaz & Fix del Bug DV 612 (`netAndRolesData.ts`, `NetAndRolesDeckView.tsx`)**:
     - Enriquecimiento de `NetAction` y `NET_ACTIONS_CATALOG` con campos canónicos del Core pp. 198-199: coste exacto en acciones de red (1 Net Action o 2 para Desconectar), efecto canónico exacto, prerrequisitos, tabla/resolución de DVs y fórmula de tirada.
     - Selector interactivo de Target DV (`DV 6`, `DV 8`, `DV 10`, `DV 12`, `DV 13`, `DV 14`) para tiradas contra nodos y programas.
     - Erradicación definitiva del bug de concatenación de texto que convertía `Variable (DV 6 a 12)` en `DV 612`.
  5. **Especificación del Modo Settings & Modularidad Global**:
     - Documentación de arquitectura para la habilitación o desactivación modular de subsistemas (FBC, Vehículos, Quickhacks 2077, Artes Marciales, Netrunning) según las preferencias de mesa y tipo de personaje.

### [v4.0.0] - 2026-10-19 (Weapon Attachments Engine, Maker Tech Upgrade Workshop, Armor +1 SP & Official Role/Tech Lifepath)
* **Category**: Weapon Attachments, Maker Workshop, Armor Upgrades, Distance Breakdown & Role Lifepaths
* **Files Modified**:
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `AI_CONTEXT_HANDOFF.md`
* **What Changed**:
  1. **Motor Canónico de Accesorios de Armas (13 Tipos Oficiales • Core Rulebook pp. 342-344)**:
     - Catálogo maestro de 13 accesorios canónicos: *Bayoneta* (ataque melee 1d6 ROF 2), *Cargador Ampliado* (aumenta capacidad según categoría), *Cargador de Tambor* (máxima capacidad balística), *Smartgun Link* (+1 ataque con ciberware Smart), *Silenciador / Supresor* (disparos sigilosos DV 17 de Percepción), *Visor Infrarrojo / Visión Nocturna* (ignora oscuridad y humo), *Mirilla Telescópica* (+1 ataque a 51m+), *Escopeta Acoplada* (ataque secundario 3d6 Shells), *Lanzagranadas Acoplado* (ataque secundario 6d6 Grenades) y adaptaciones CEMK 2077 (*Power, Smart, Tech Rebuilds* que consumen ranuras).
     - Regla canónica de ranuras: máximo 3 ranuras por arma estándar, 0 ranuras para armas de categoría Melee y armas Exóticas.
  2. **Ataques Secundarios de Accesorios Acoplados en Combat HUD**:
     - Botones de acción directa integrados en las tarjetas de armas en mano para disparar la *Escopeta Acoplada* (3d6 de daño vs tabla de escopeta), lanzar con el *Lanzagranadas Acoplado* (6d6 de daño) o clavar la *Bayoneta* (1d6 de daño cuerpo a cuerpo a ROF 2 con habilidad Melee Weapon) sin soltar el arma principal.
  3. **Pase de Distancia al Desglose de Ataque (`calculateWeaponAttackBreakdown`)**:
     - Conexión del bracket de distancia seleccionado en el telémetro con la mirilla telescópica (*Sniping Scope*), sumando automáticamente +1 a la tirada base cuando el objetivo se sitúa a 51m o más.
  4. **Taller Maker: Upgrade Expertise (Core Rulebook p. 148)**:
     - 4 mejoras canónicas de armamento: *Calidad Excelente* (+1 ataque), *Ranura Adicional de Accesorio* (+1 ranura extra, permitiendo hasta 4 slots o 1 slot en exóticas), *Diseño Ocultable* (permite ocultar armas grandes) y *Optimización de Cámara / Cerrojo* (+1 daño balístico / invención).
     - Cálculo de coste de materiales (50% del valor base del arma), tabla oficial de DVs y tiempos de trabajo según el tramo de coste del arma, y botón de tirada interactiva d10 con base TECH vs DV oficial.
  5. **Refuerzo de Blindaje Tech Maker (+1 SP en Cabeza y Cuerpo)**:
     - Toggles tácticos en StreetLabView y CombatHudView para aplicar o retirar la mejora Tech de +1 SP a la armadura de Cabeza y Torso, ajustando el SP máximo y actual con deducción de costes de materiales.
  6. **Lifepath Específico de Rol (10 Roles) & Tech Lifepath Completo (Core Rulebook p. 55)**:
     - Preguntas y opciones canónicas para los 10 roles (Rockerboy, Solo, Netrunner, Tech, Medtech, Media, Exec, Lawman, Fixer y Nomad) integradas en la pestaña Bio & Lifepath de StreetLabView.
     - Modal dedicado con las 6 tablas completas del Tech Lifepath oficial: Especialidad Técnica, Socio vs Solo, Cómo es tu Taller, Clientes Principales, Proveedores de Suministros y Quién te Busca.

### Versiones anteriores

[Claude Code · 2026-10-24] Las entradas de v1.0.0 a v3.9.0 están en `docs/archive/changelog-v1.0-a-v3.9.md`. El roadmap viejo de fases 4 y 5 está en `docs/archive/roadmap-fases-4-5-changelog.md`; el estado vivo de planes está en `docs/plans/README.md`.
