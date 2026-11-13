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

### [v5.35.1] - 2026-11-13 (Plan 32: el bestiario y las facciones, solo para el GM) [Claude Code · 2026-11-13]
* **Category**: Mesa y GM (pedido de Giuliano: que los jugadores no se spoileen los PNJ ni las facciones).
* **What Changed**:
  * **Bestiario solo del GM**: el botón "Bestiario & Encuentro GM" de la pestaña de combate y el panel desplegable se ven solo si `canSeeGmOnly` (GM de la mesa, o sin mesa: sin PIN del GM o con el PIN desbloqueado). Si el panel se monta igual en otro lado, el jugador ve un cartel "solo el GM" en vez de las fichas.
  * **Haggle del Fixer**: el jugador ya no ve la opción "Bestiario" (que listaba todo el catálogo); regatea contra una ficha guardada o a mano con el COOL y el Trading que le diga el GM. El GM la sigue teniendo.
  * Ya eran solo del GM: TABLAS DEL GM, Modo GM, Red Chrome Cargo, el Fixer Deck, las arquitecturas NET en modo master y los enemigos del encuentro sin revelar.
  * Límite: los datos siguen dentro del código de la app; esconderlos del todo pediría guardarlos en la nube solo para el GM.
* **Files Modified**: `features/combat/CombatHudView.tsx`, `features/gm/EnemiesCompendiumPanel.tsx`, `features/roles/FixerPanel.tsx`, `engine/__tests__/dangerGal.test.ts` (+1 test); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 791 tests y build. En el navegador: con PIN de GM puesto (bloqueado) no aparecen el bestiario ni TABLAS DEL GM; sin PIN vuelven. Consola limpia y PIN de prueba borrado.

### [v5.35.0] - 2026-11-13 (Plan 32 I: las 15 facciones canon de Danger Gal Dossier) [Claude Code · 2026-11-13]
* **Category**: Contenido canon y herramientas del GM (Danger Gal Dossier pp.9-142; Edgerunners Handbook de CEMK pp.24-31).
* **What Changed**:
  * **Facciones canon**: `data/dangerGalFactions.ts` trae las 15 facciones del libro (6th Street, Bozos, Puma Squad, Digital Divas, Edgerunners, Generation Red, Maelstrom, NCPD Precinct #1, Network 54, Piranhas, Sightseers, Team Monster, Trauma Team NC4-2, Tyger Claws y Zoners), cada una con página, quién firma el informe y base, historia reciente, recursos y objetivos en paráfrasis corta. Reemplaza la lista inventada de `enemiesCatalog.ts` (tenía facciones que no están en el libro, como Continental Brands o Zhirafa).
  * **Ficha de facción en el bestiario**: tocar una facción en la barra la filtra y muestra su ficha. Generation Red trae el recuadro "Kids in Night City" (p.66).
  * **En 2077**: 6 facciones (6th Street, Maelstrom, NCPD, Network 54, Trauma Team y Tyger Claws) llevan lo que dice de ellas la Lore Guide de CEMK, con página. Las otras 9 no figuran en esa guía y la ficha lo aclara, sin inventar.
  * Conteo por facción exacto (antes contaba de más) y encabezado del bestiario sin la promesa falsa de "128 PNJ canónicos". El PNJ custom arranca con facción "Independiente".
* **Files Modified**: nuevos `data/dangerGalFactions.ts` y `engine/__tests__/dangerGal.test.ts` (5 tests); `data/enemiesCatalog.ts` (-167 líneas inventadas, reexporta la lista canon), `features/gm/EnemiesCompendiumPanel.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app; plan `docs/plans/plan32-danger-gal.md`.
* **Verificación**: tsc, 790 tests y build. En el navegador: barra con las 15 facciones, ficha de Maelstrom con su línea de 2077, consola limpia.
* **Pendiente del plan 32**: las 118 fichas (v5.36.0 a v5.38.0; las 95 inventadas siguen hasta la v5.36.0), New Gear y vehículos (v5.39.0) y el creador guiado (v5.40.0).

### [v5.34.0] - 2026-11-13 (Plan 31 VI: nivel mercenario de Solo of Fortune 2045; cierra el plan 31) [Claude Code · 2026-11-13]
* **Category**: Contenido canon, herramientas del GM y ficha (Interface RED Vol. 5 pp.106-108, 144-147).
* **What Changed**:
  * **Presupuesto operativo en la ficha** (panel en ARSENAL & BLINDAJE, `CharacterSheet.opBudget`): se empieza una misión con su presupuesto por persona (atajos para las 2 del libro: 5,000eb y 25,000eb), se compra con él y lo comprado va a la mochila marcado (`InventoryItem.fromOpBudget`). Al terminar la misión, lo comprado vuelve al armory y lo que sobra se pierde (p.108). No toca los €$ del PJ.
  * **Pestaña "Solo of Fortune" en TABLAS DEL GM**: las reglas de nivel mercenario (advertencia, Hot Tip para endurecer PNJ, balance, Crews rivales, botín, presupuesto, IP; pp.106-108) y las 2 misiones como aventuras. Georgia On My Mind incluye el rancho McAlister cuarto por cuarto con sus defensas, Kelly McAlister con su bloque completo, los drones Rock Razer y Mineral Softener, y el Wright Hotel. Trouble in Tanzania incluye la batería antiaérea, los 3 ataques y las fuerzas del ESC con sus ids del bestiario.
  * **NET del rancho McAlister** (p.145) en NET & ROLES: 6 pisos, Demon Efreet, Hellhound x2 en el piso 2 y el File de 5,000eb en el 6.
  * La tarjeta de aventura de Halloween se volvió componente compartido (`AdventureCard`).
  * `CLAUDE.md`: nueva regla "Resumen corto de cada cosa" (pedido de Giuliano): en planes y cierres, cada ítem con qué hace, dónde se ve, cómo afecta y qué se interpretó.
* **Files Modified**: nuevos `data/gmTables/solo-of-fortune.ts`, `engine/opBudget.ts`, `features/sheet/OpBudgetPanel.tsx` y el test `engine/__tests__/soloOfFortune.test.ts` (5 tests); `data/netArchitecturesInterfaceRed.ts`, `features/gmtables/GmTablesView.tsx`, `features/sheet/StreetLabView.tsx`, `types/cyberpunk.ts` (`OperationalBudget`, `fromOpBudget`), `store/useCharacterStore.ts` (`startOpBudget`, `spendOpBudget`, `closeOpBudget`); `store/persistence.ts` (APP_VERSION); changelog in-app; `CLAUDE.md`.
* **Verificación**: tsc, 785 tests y build. En el navegador: Georgia On My Mind con 5,000eb; Frag Grenade x3 por 300eb fue a la mochila, una compra de 9,000eb se rechazó, y al terminar la misión la granada volvió al armory y se perdieron 4,700eb. La pestaña Solo of Fortune muestra a Kelly y los 4 PNJ Hardened del bestiario.
* **Plan 31 cerrado**: v5.29.0 a v5.34.0, todo en ramas locales encadenadas (la última, `claude/plan31-v5.34.0`), sin pushear. Al publicar, las reglas de Firestore de la v5.32.0 piden su propio deploy.

### [v5.33.0] - 2026-11-13 (Plan 31 V: Cyberpets, "Your New Best Friend") [Claude Code · 2026-11-13]
* **Category**: Contenido canon y ficha (Interface RED Vol. 5 pp.71-82).
* **What Changed**:
  * **Bestiario**: las 8 Cyberpets® de Biotechnica (Datarabbit, Forever Turtle, Neon Newt, Obsidian Ocelot, Cyberbear, Cyberboa, Cyberrat y Cyberwolf; pp.74-81) con stats, HP, SP, ataques con su Combat Number, skill bases, ciberware y habilidades. Entran por `data/enemies-src/interface-red.json` (ids `ir5-pet-*`) y sirven como enemigos y actores. Los niveles Hardened del libro quedan como `hardened_mook` o `hardened_lieutenant`.
  * **"Mascota" en la ficha** (panel en ARSENAL & BLINDAJE, `CharacterSheet.pets`): se compra (costo más el primer mes de su Lifestyle, sin prorratear) o se agrega sin cobrar. Muestra HP, SP, ataques, ciberware de fábrica y habilidades. Lleva su Lifestyle mensual (el Cyberbear pide Fresh Food x2) y las camas de Housing que ocupa (Mook 0, Lieutenant 1, Mini-Boss 2, Boss 3).
  * **Obediencia** (p.73): obedece si INT + Animal Handling es 10 o más y está cuidada (Lifestyle pago, durmiendo bien, sin maltrato). Si no, el GM decide; hay botón de tirada de Animal Handling.
  * **Ciberware de la mascota** (p.73): ranuras libres del modelo, una pieza puede ocupar 0 con Tech Upgrade, y el entrenamiento de 1 día con Animal Handling contra la DV de instalación (sin entrenar, solo come y duerme).
  * Las fichas se revisaron contra el render del PDF; el Cyberrat (p.80) se volvió a comparar a mano.
* **Files Modified**: nuevos `data/cyberpets.ts`, `engine/cyberpets.ts`, `features/sheet/PetPanel.tsx` y el test `engine/__tests__/cyberpets.test.ts` (5 tests); `data/enemies-src/interface-red.json` y el generado `data/enemies/interface-red.ts`; `types/cyberpunk.ts` (`OwnedPet`), `store/useCharacterStore.ts` (`addPet`, `updatePet`, `removePet`), `features/sheet/StreetLabView.tsx`; `engine/__tests__/rules.test.ts` (los ids de interface_red admiten `ir5-pet-`); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 780 tests y build. En el navegador, Hardpoint no podía pagar el Cyberrat (1300eb con el primer mes). Agregado sin cobrar: 10 HP, SP 7, no obedece (INT 6 + Animal Handling 0 = 6). Le instalé un Cyberaudio (1 de 2 ranuras) y el entrenamiento falló (11 contra DV13). Se quitó después; consola limpia.

### [v5.32.0] - 2026-11-13 (Plan 31 IV: investigación y Focus, "Did Someone Say Murder?") [Claude Code · 2026-11-13]
* **Category**: Reglas opcionales del Interface RED Vol. 5 (pp.61-70) en la ficha y en el Modo GM. Toca `firestore.rules`.
* **What Changed**:
  * **Focus en la ficha** (`CharacterSheet.focus`, sin el campo está lleno): máximo `10 + 5 × ceil((INT+WILL)/2)`, igual a la tabla de la p.63. Panel en STREET LAB con botones para perder Focus, Deduction DV15 (cuesta 1d6) y Descansar un día (INT + WILL, +5 con Concentration DV15).
  * **Tracker de misterios en el Modo GM**: objetivo, Complexity (Easy 25 a Legendary 200), pistas con su tipo (los 12 de la p.65), DV, daño, Obfuscation y pifia, y obstáculos (los 13 de la p.67 más el Ticking Clock). La Evidence Check toma el total que tiró el jugador: si sale, baja la Complexity con el daño menos la Obfuscation; si falla, le baja el Focus al PJ elegido. Los obstáculos cuestan 1d6 (superado) o 2d6 (fallado). Trae los 2 misterios de ejemplo (pp.69-70) y un registro.
  * El Focus que pierde un PJ por el tracker se aplica a su ficha como el daño del GM y va al log de la mesa. La tarjeta de cada jugador en el Modo GM muestra su Focus.
  * **Mesa online**: el tracker se guarda en `campaigns/{c}/gm/mysteries` (solo el GM, hasta 30 misterios), un secreto del GM más en `sync/gmSecrets.ts`. Sin mesa, en este navegador (`cpr_gm_mysteries_v1`).
* **Files Modified**: nuevos `data/mysteryData.ts`, `engine/mystery.ts`, `features/sheet/FocusPanel.tsx`, `features/gmmode/MysteryTracker.tsx` y el test `engine/__tests__/mystery.test.ts` (9 tests); `types/cyberpunk.ts`, `store/useCharacterStore.ts` (`adjustFocusFor`), `engine/gmMode.ts`, `features/gmmode/GmModeView.tsx`, `features/sheet/StreetLabView.tsx`, `sync/gmSecrets.ts` y su test; `firestore.rules` y `sync/__tests__/rules/firestore.rules.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 775 tests, 52 tests de reglas con el emulador y build. En el navegador, Hardpoint (INT 6, WILL 6) tiene 40 de Focus; perdió 3d6 y lo recuperó descansando. En el Modo GM, con "Someone Stole It First!": Forensics con 18 cobró la pista (16 − 2 = 14, Complexity 36/50); Digital Scavenging con 8 y 1 natural le bajó 12 de Focus a Wrench, y un obstáculo superado 1 más. Todo se limpió después; consola limpia.
* **Publicación**: las reglas nuevas de Firestore hay que desplegarlas (OK aparte) antes o junto con el hosting, o el tracker no guarda en la mesa online.

### [v5.31.0] - 2026-11-13 (Plan 31 III: durabilidad y mantenimiento, "Breaking Your Stuff") [Claude Code · 2026-11-13]
* **Category**: Reglas opcionales del Interface RED Vol. 5 (pp.3-12) en la ficha.
* **What Changed**:
  * **Panel "Mantenimiento y estado del equipo"** en ARSENAL & BLINDAJE, con todo el equipo: armas, armadura, ciberware, mochila y vehículos. En el Ripperdoc aparece el mismo panel, solo con el ciberware.
  * **Estado por ítem** (`CharacterSheet.itemDurability`, con la clave de `engine/itemNames.ts`): Damaged (IR5 p.4), Destroyed y Destroyed Beyond Repair (Core p.140).
  * **Mantenimiento** (pp.5-7): el Lifestyle del mes (`CharacterSheet.lifestyle`) lo cubre si alcanza el de la tabla Maintenance Basics; si no, hay una tirada mensual con la Skill de Maintenance Skills, la DV y el tiempo. Los Roles: Tech +1 en todo; Solo y Lawman en armas y armaduras; Netrunner en cyberdecks; Media y Rockerboy en su equipo de Rol; Exec, Medtech y Nomad quedan exentos con su equipo de Rol (se marca por ítem). Mantener quita Damaged y la falla en curso.
  * **Fallas** (pp.8-12): las 11 tablas de 1d6 traducidas (`data/malfunctionTables.ts`). Cada ítem va a su tabla (el ciberware según su tipo) y se puede tirar en otra. La falla queda en el ítem con su duración, hasta que el jugador la termina. Jury rig del Maker: 10 minutos por punto de Field Expertise.
  * **Reventa** (p.5): el valor de venta o de materiales baja una Categoría si está Damaged y dos si está Destroyed; Beyond Repair no vale nada.
  * El ciberware de los Folios CEMK (`cw-cemk-…`) se busca por nombre para sacar su costo y su tabla.
* **Files Modified**: nuevos `data/malfunctionTables.ts`, `engine/maintenance.ts`, `engine/durabilityItems.ts`, `features/sheet/DurabilityPanel.tsx` y el test `engine/__tests__/maintenance.test.ts` (9 tests); `types/cyberpunk.ts`, `store/useCharacterStore.ts` (`setItemDurability`, `setLifestyle`), `features/sheet/StreetLabView.tsx`, `features/cyberware/CyberwareRipperdocView.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 766 tests y build. En el navegador, con Hardpoint (Solo) y Lifestyle Kibble: la Masamune (1000eb) pide Good Prepak y una tirada de Weaponstech DV17. Marcada Damaged, salió la falla 6 de armas y la tirada de mantenimiento falló (15 contra DV17). La armadura se mantiene sola con el +1 del Solo. En el Ripperdoc aparecen los 3 implantes. Todo se limpió después; consola limpia.

### [v5.30.0] - 2026-11-13 (Plan 31 II: generadores del GM del Interface RED Vol. 5) [Claude Code · 2026-11-13]
* **Category**: Herramientas del GM. Tres pestañas nuevas en TABLAS DEL GM.
* **What Changed**:
  * **Screamsheet (IR5 pp.83-96)**: la Tabla A (1d6) elige el tipo (Flash de Noticias, En Luces de Neón o Se Busca Personal), y se tira intro, cuerpo y cierre con 1d6 cada uno. El titular sale entre los que permite el cierre y se puede cambiar, y la firma es de uno de los 12 periodistas. Los campos entre corchetes se completan en la app, y el texto se copia para dárselo a los jugadores.
  * **Gunpath (IR5 pp.48-53)**: fabricante (1d100), tipo (1d10, con su sub-tirada para arco o ballesta y para lanzagranadas o lanzacohetes), calidad (1d6), attachments por Skill y esquema de nombre (1d100). El costo baja o sube una Categoría por la calidad, y los attachments solo suben la Categoría si el total llega a la siguiente (p.51). El arma se puede equipar al PJ activo: usa la ficha del Core con calidad, costo y attachments de fábrica.
  * El libro no dice cuántos attachments lleva un arma ni qué pasa con los repetidos: el GM elige la cantidad (0 a 3) y la app vuelve a tirar los repetidos y los que no son elegibles (Silencer y Grapple Gun Underbarrel, p.48).
  * **Referencias IR5**: reglas de roller derby (pp.18-21), los 13 avisos del Hiring Hall (p.132; el plan decía 14, el libro trae 13), parámetros de misión mercenaria (p.108) y DV para hackear Agents (pp.27-29). Se anotan las erratas del libro (diez o nueve penalizaciones en el derby; "10,0000" en Dangerous Mission).
* **Files Modified**: nuevos `data/gmTables/screamsheet.ts`, `data/gmTables/gunpath.ts`, `data/gmTables/ir5References.ts`, `engine/screamsheet.ts`, `engine/gunpath.ts`, `features/gmtables/ScreamsheetSection.tsx`, `GunpathSection.tsx`, `Ir5ReferencesSection.tsx` y el test `engine/__tests__/ir5Generators.test.ts` (11 tests); `features/gmtables/GmTablesView.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 757 tests y build. En el navegador salió una screamsheet de Se Busca Personal con sus campos, y un lanzagranadas Arasaka Excelente con Drum Magazine (1500eb, Very Expensive). Equipado al PJ da +1 al ataque; se sacó después. Consola limpia.

### [v5.29.0] - 2026-11-13 (Plan 31 I: catálogos del resto del Interface RED Vol. 5) [Claude Code · 2026-11-13]
* **Category**: Contenido canon. Primera versión del plan 31 (resto del Interface RED Vol. 5; página impresa = índice del PDF en base 0).
* **What Changed**:
  * **Toggle's Temple (pp.37-59)**: 62 armas con calidad (Poor, Standard o Excellent), ranuras libres y attachments de fábrica, tomadas de las tablas de las pp.54-59 y citando la página de cada ficha. De las 72 del libro, 10 ya estaban (9 del Core y el Type-18-S). Suma el Airhypo Bayonet y el Grapple Gun Underbarrel (p.48); el Silencer ya estaba.
  * **All About Agents (pp.28-33)**: Breacher, Crunch Whistle, 11 apps, 4 Agents y 4 Internal Agents (Cyberaudio). Las DV para hackear un Agent van en la descripción del Breacher.
  * **12 Days of REDmas (pp.98-101)**: Thermal Dagger, Nat's Long-Barreled Pistol (con su tabla de rango, p.99), E-TACK Rapid Responder (Burst Mode), High-Density Bulletproof Shield, CyberDude Smart Glove, Smart Ears, Stun Bayonet, el CyberConductor y su versión integrada, Quick Change Faceplate Mount, Quick Digits y Skydrivers. El Light Metalgear y el Sycust Cyberspine ya estaban.
  * **Roller derby (p.21)**: Padding (SP7) y Skates. **Cyberpets (p.82)**: Chipware Compartment y FBC Chameleon Coating; las otras 5 son reimpresiones de Black Chrome e IR2 que ya estaban.
  * **Calidad del arma** (`WeaponItem.quality`): Excellent suma +1 al ataque; Poor avisa que se encasquilla con un 1 natural (Interface RED Vol. 1 pp.3-4). **Ranuras** (`slots`) y **attachments de fábrica** (`preinstalledAttachments`, dan su efecto sin ocupar ranura).
  * Las ranuras de los 3 attachments nuevos no las da el libro: se toman las del Bayonet (1) y los underbarrel (2) del Core, anotado en cada uno.
* **Files Modified**: `data/core-rules.cprpack.json` (101 ítems), `data/rangeTables.ts`, `data/weaponAttachmentsAndTechData.ts`, `types/cyberpunk.ts`; tests `engine/__tests__/ir5CatalogRest.test.ts` (nuevo, 9 tests) y `ir5Catalog.test.ts` (acotado a pp.105-147); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 746 tests y build. En el navegador: la Towa Type-12 Police Pistol aparece en el Compendio (p.38); equipada da +2 (Calidad Excelente y Smartgun Link de fábrica) y 1 ranura. Consola limpia.

### [v5.28.0] - 2026-11-13 (Plan 30 IV: enemigos en ACPA; cierra el plan 30) [Claude Code · 2026-11-13]
* **Category**: Modo GM. Última versión del plan 30 (Solo of Fortune 2045, Interface RED Vol. 5 pp.133-142).
* **What Changed**:
  * **Subir y bajar a un enemigo** desde su fila en MODO GM: elige una de las 10 ACPA de fábrica (subir y bajar son 1 Acción, p.133). La fila muestra HP y SP de la ACPA, con botones para ajustarlos, "Crítica: −5 al piloto" (p.133), "Reparar" y "Bajar".
  * **Armas Onboard** (`engine/acpaActors.ts`): las de las 10 fichas se buscan en el catálogo ("EQ" = Excellent Quality, +1; "(x4)" = cuatro armas; los accesorios quedan como nota) y se suman al enemigo con sus cargadores. La base de ataque es la de otra arma suya con la misma habilidad o su REF/DEX. Al bajar, se sacan.
  * **Ataque**: mientras la ACPA protege, la base lleva el mod de REF (a distancia) o DEX (cuerpo a cuerpo) de la ACPA (p.134), también en Autofire.
  * **Daño** (`encounterStore.applyEnemyDamage`): en ACPA lo recibe la ACPA, con un solo SP, sin x2 en la cabeza y ablación; a 0 HP queda destruida y el golpe siguiente va al enemigo (pp.133-134). El bestiario avisa cuando el golpe fue a la ACPA.
  * **Actor guardado**: `GmActorState.acpa` guarda la ACPA con su HP y SP; al traerlo de vuelta sube otra vez con sus armas Onboard, y "Curar a tope" también la repara. Las reglas de Firestore no cambian (`gm/actors` limita la cantidad de ítems, no su forma).
* **Desvío del plan**: no hay botón "Spawnear en ACPA" en el bestiario; se spawnea como siempre y se sube desde su fila en MODO GM (dos clics, y sirve para cualquier enemigo, también los rápidos y los PNJ propios).
* **Files Modified**: `engine/acpaActors.ts` (nuevo), `engine/gmActors.ts`, `store/encounterStore.ts` (`acpa`, `acpaWeaponCount`, `setEnemyAcpa`, `patchEnemyAcpa`), `features/gmmode/GmActorsPanels.tsx`, `features/gmmode/ActorAttackForm.tsx`, `features/gm/EnemiesCompendiumPanel.tsx`; test `engine/__tests__/acpaActors.test.ts` (6 tests: lectura de las Onboard, las 10 en el catálogo, subir y bajar, mods, actor guardado y daño); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 737 tests (6 nuevos) y build. En el navegador (MODO GM sin mesa online): un Bodyguard sube a la Militech Commando, suma el MK.27 y el Mountain Goat al ataque, y un golpe de 25 a la cabeza baja la ACPA de 30 a 22 HP y de 17 a 16 SP sin tocar su HP. Consola limpia.

### [v5.27.0] - 2026-11-12 (Plan 30 III: el PJ pilotea una ACPA) [Claude Code · 2026-11-12]
* **Category**: Motor y ficha. Tercera versión del plan 30 (Solo of Fortune 2045, Interface RED Vol. 5 pp.133-135).
* **What Changed**:
  * **Ficha**: `CharacterSheet.acpaState` (`ActiveAcpaState`): nombre, HP y SP actuales y máximos, BODY, mods, Onboard y si pilotea. Se asigna desde el Compendio (pestaña ACPA, las 10 de fábrica o la armada) o desde ARSENAL & BLINDAJE.
  * **Panel ACPA** (`features/sheet/AcpaPanel.tsx`) en ARSENAL & BLINDAJE y, compacto, en la calculadora de impactos del HUD: Entrar y Salir (1 Acción; salir de una destruida es gratis, p.133), HP y SP a mano, reparación con su DV y tiempo (Weaponstech DV9, DV13 o DV17, p.135), Onboard, esquive de balas y fatiga (p.134).
  * **Daño**: con la ACPA puesta, el golpe del HUD y el del GM (`gmDamage.applyHitToPc`, también el ataque de un actor) los recibe la ACPA: un solo SP, sin x2 en la cabeza, ablación y destruida a 0 HP. La armadura del piloto no pierde SP. La crítica no es herida: 5 de daño directo al piloto, 0 si es FBC (p.133). Melee ignora la mitad del SP; Martial Arts no (p.133). Destruida deja de proteger (p.134). El diálogo del GM y el HUD muestran la vista previa.
  * **Stats** (p.134): mientras pilotea, REF y DEX de los ataques, el REF de la Iniciativa y el MOVE llevan los mods de la ACPA; el BODY de los ataques es el del frame si es mayor. No cambia el HP ni el Death Save.
  * **Mesa**: el resumen de party y la tarjeta del Modo GM muestran "En ACPA" con su HP y SP. Las reglas de Firestore no cambian (el resumen de party no limita campos).
* **Desvío del plan**: las armas Onboard se listan en el panel, no en el arsenal, porque las fichas del libro las nombran con accesorios y variantes que no son ítems del catálogo.
* **Files Modified**: `engine/acpa.ts` (`acpaTakeDamage` con tipo de ataque, `resolveHitOnAcpa`, `isPilotingAcpa`, `acpaStatMod`, `acpaBody`, `acpaStateFrom*`), `types/cyberpunk.ts`, `store/useCharacterStore.ts` (`setAcpaFor`), `engine/characterEngine.ts`, `engine/gmMode.ts`, `features/gm/gmDamage.ts`, `features/gm/GmTargetDialog.tsx`, `features/combat/CombatHudView.tsx`, `features/sheet/StreetLabView.tsx`, `features/sheet/AcpaPanel.tsx` (nuevo), `features/compendium/AcpaCatalog.tsx`, `features/gmmode/GmModeView.tsx`, `features/cloud/CampaignPanel.tsx`, `sync/partySummary.ts`; tests `engine/__tests__/acpaPilot.test.ts` (nuevo) y `acpa.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 731 tests (9 nuevos) y build. En el navegador: asignar la Nyx desde el Compendio, entrar (MOVE 7→10, DEX -1), golpe crítico de 24 a la cabeza (ACPA SP 16→15, HP 28→20; piloto 40→35; su armadura igual). Consola limpia.

### [v5.26.0] - 2026-11-12 (Plan 30 II: armador de ACPA y las 10 de fábrica) [Claude Code · 2026-11-12]
* **Category**: Contenido canon y motor. Segunda versión del plan 30 (Solo of Fortune 2045, Interface RED Vol. 5).
* **What Changed**:
  * **Datos** (`data/acpaData.ts`): 4 Linear Frames, 5 Shells y 4 tunings A/B (IR5 p.136); topes de 6 armas y 6 ciberware Onboard, base de 4.000eb y 500eb por Onboard (p.135); las 10 ACPA de fábrica (pp.138-142).
  * **Erratas del libro**: las fichas no dicen qué tunings llevan. En 5 de ellas ninguna combinación da lo impreso: Sewer Rat dice 4 SP (el Salvaged Shell da 14), Neo Standard imprime BODY 12 con frame Beta (14) y le falta +1 MOVE, y Grasshopper, Bombardier y Boris tienen el MOVE corrido. Por decisión de Giuliano la app usa el valor recalculado con la p.136 y muestra lo impreso en una nota.
  * **Motor** (`engine/acpa.ts`, funciones puras): `buildAcpa` (HP, SP, BODY, mods de REF, DEX y MOVE, costo y disponibilidad), `acpaTakeDamage` (un solo SP y HP, ablación, destruida a 0 HP; pp.133-134), `acpaCriticalFeedback` (5 al piloto, 0 si es FBC; p.133), `acpaRepair` (Weaponstech DV9, DV13 o DV17; p.135), `acpaFatiguePenalty` (p.134), `pilotStatsInAcpa` y `acpaAllowsBulletDodge` (p.134).
  * **Compendio**: pestaña "ACPA" con el armador (frame, shell, tunings y Onboard del catálogo) y las 10 de fábrica con sus stats, página y erratas.
* **Files Modified**: `data/acpaData.ts` (nuevo), `engine/acpa.ts` (nuevo), `features/compendium/AcpaCatalog.tsx` (nuevo), `features/compendium/CompendiumView.tsx`; test `engine/__tests__/acpa.test.ts` (15 tests: el ejemplo de la p.137, las 10 de fábrica, daño, crítica, reparación, fatiga, piloto y esquive); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 722 tests (15 nuevos) y build. En el navegador, el armador reproduce el ejemplo de la p.137 (24 HP, 13 SP, BODY 12, -1 DEX, 9.800eb Luxury) y muestra las 10 de fábrica. Consola limpia.

### [v5.25.0] - 2026-11-12 (Plan 30 I: arsenal de Solo of Fortune 2045) [Claude Code · 2026-11-12]
* **Category**: Contenido canon. Primera versión del plan 30 (Solo of Fortune 2045, Interface RED Vol. 5 pp.105-147; página impresa = PDF − 1).
* **What Changed**:
  * **Catálogo** (`sourceBookTitle` "Interface RED Volume 5", cada ítem con su página):
    * 13 armas: Neo Rapid Assault 16, Takanami SMG, Chaingun "Victoria", Dawnmaker AMR, Midnight Assault HB, MK.27 LMG, Mountain Goat, BMG-500 Silver, Helix Citrus, Scatter Ratter y "Deathwind" Railgun (pp.116-119), Stickybomb Launcher (p.122) y "Big Boomer" (p.123). También el Tsunami Arms Type-18-S, reimpreso en la p.143.
    * 8 attachments (pp.111-115), entre ellos Range Table Modification, Pistol Autosear, Shotgun Automatic Control Group y SMG Cyclic Internals.
    * 12 municiones y explosivos: 7 municiones (pp.120-121), C9 Charge, C9 Kill Switch y Mini C9 (pp.121-122), Arrowhypo y Airburst (pp.126-127).
    * Light, Hybrid y Heavy Metalgear (p.123); Authorization Handshake Port, Thermal Decoy y Multihypo (pp.122-126); las 8 drogas de Combat Chemistry (pp.127-129) y el Sycust Cyberspine (reimpreso en la p.143).
  * **Tablas de rango expandidas (p.113)**: las 21 de tiro único y las 4 de Autofire (Machine Pistol, SMG, Assault Rifle y Machine Gun). Las usan solo las armas que traen `rangeTable`; las del Core siguen con su tabla (Core p.173). La ficha, el HUD de combate y el Compendio leen la tabla con `getWeaponRangeProfile`.
  * **Autofire nuevo**: "Autofire (Machine Gun 5)" y "Autofire (Machine Pistol 4)" (p.115) se leen para el tope y la fila de DV, también en el ataque de un enemigo en Modo GM. La clase Machine Gun aparece en la clasificación del arma.
  * **Metalgear con penalización por stat (p.123)**: la armadura puede traer una penalización propia a DEX y MOVE (Heavy: -4 REF, -5 DEX, -5 MOVE); la de REF sigue siendo `penalty`. Las armaduras del Core no cambian.
* **Files Modified**: `data/core-rules.cprpack.json`, `data/rangeTables.ts` (tablas IR5, `parseAutofireMode`, `getWeaponRangeProfile`), `engine/actorAttack.ts`, `engine/characterEngine.ts` (`armorStatPenalty`), `types/cyberpunk.ts` (`rangeTable`, `penaltyDex`, `penaltyMove`), `store/useCharacterStore.ts`, `data/weaponAndCyberwareTooltips.ts`, `features/combat/CombatHudView.tsx`, `features/compendium/CompendiumView.tsx`, `features/sheet/StreetLabView.tsx`; test `engine/__tests__/ir5Catalog.test.ts` (incluye el conteo de Going Metal: 13 cuerpos y 20 piezas de ciberware); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 707 tests (13 nuevos) y build. En el navegador, el Compendio muestra la Midnight Assault HB como Machine Gun, con la tabla de Marksman Rifle y Autofire de Machine Gun hasta x5. El Heavy Metalgear muestra "REF -4 / DEX -5 / MOVE -5", y equipado baja MOVE de 7 a 2. Consola limpia.

### [v5.24.0] - 2026-11-12 (Modo GM: Autofire y supresión de un actor) [Claude Code · 2026-11-12]
* **Category**: Herramientas del GM. Sigue al plan 28, que había dejado afuera el fuego automático y la supresión.
* **What Changed**:
  * En el ataque de un enemigo del encuentro, las armas con Autofire suman un selector de modo: Tiro simple, Autofire xN y Supresión. El tope sale de "Autofire xN" en la ficha o, si no figura, SMG x3 y Assault Rifle x4 (Core p.173).
  * **Autofire (Core p.173)**:
    * Gasta 10 balas y no se puede con menos de 10 en el cargador.
    * Tira REF + Autofire + 1d10 contra la tabla de DV de Autofire por distancia (SMG 20/17/20/25/30, Assault Rifle 22/20/17/20/25), elegida en un selector.
    * Si impacta, el daño es 2d6 × lo que superó el DV, hasta el tope del arma, y entra a la ficha del jugador con su SP. Dos 6 = Herida Crítica.
    * No se puede apuntar. Si el jugador tiene REF 8+ y esquiva, el GM pone su tirada como DV.
  * **Supresión (Core p.174)**:
    * Gasta 10 balas.
    * El GM marca a los jugadores a pie, a 25 m, sin cobertura y a la vista. Cada uno tira WILL + Concentration + 1d10 con su ficha (con la penalización por heridas, Core p.187) contra el REF + Autofire + 1d10 del enemigo.
    * El empate lo gana el que resiste (CEMK p.5). El que falla usa su próximo Move para cubrirse.
    * Cada resultado va al log de la mesa.
  * La base REF + Autofire sale de la ficha (`skillBases.Autofire` o "Autofire base N" en las notas del arma) y se puede corregir a mano. Si la ficha no la trae, lo avisa.
* **Files Modified**: `engine/actorAttack.ts` (Autofire y supresión), `features/gmmode/ActorAttackForm.tsx`; test `engine/__tests__/autofire.test.ts` (incluye el ejemplo del libro: 21 contra DV 17 con un Assault Rifle, 2d6 = 10 × 4 = 40); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 694 tests (6 nuevos) y build. Sin cambios de reglas de Firestore. En local sin mesa, con un Security Officer (Assault Rifle, Autofire 12): Autofire 14 contra DV 17 falla y gasta 10 balas; contra DV 5 sale 19, el multiplicador queda en el tope de x4 y hace 32 de daño a Insurance (SP 11→10, HP 40→19). Con 5 balas se bloquea. La supresión tira 21: seis PJ se cubren y Connect resiste con 21 (empate). Consola limpia.

### [v5.23.0] - 2026-11-12 (Plan 28 III: pedir tiradas, atacar con un actor, dar ítems y notas) [Claude Code · 2026-11-12]
* **Category**: Herramientas del GM y mesa online (plan 28, `docs/plans/plan28-modo-gm.md`). Cierra el plan 28.
* **What Changed**:
  * **Pedir tirada** (solo con mesa online): en MODO GM, el GM elige uno o varios jugadores, la skill (las 66 del Core, pp.81-85), el DV (atajos de la tabla de Core p.129) y una nota. Al jugador le aparece un aviso arriba de cualquier pestaña con el botón Tirar: STAT + skill + 1d10 con su ficha, el 10 que explota y el 1 que resta (Core p.130, CEMK p.5) y −2 / −4 por Seriously / Mortally Wounded (Core p.187). El resultado vuelve al panel del GM ("INT 6 + Perception 5 + d10 4 = 15 vs DV 15: falla"; hay que superar el DV, CEMK p.5) y va al log de la mesa. El GM puede cancelar los pendientes y limpiar los hechos.
  * Guardado en `campaigns/{c}/rollRequests/{id}`: crea y borra el GM; lee el GM y el destinatario (la consulta del jugador filtra por `targetUid`); el destinatario solo puede pasar `status` a `done` una vez y escribir `result`. El GM ve los últimos 20 y recorta los viejos al abrir la mesa.
  * **Atacar con un actor**: en la fila de cada enemigo del encuentro, arma (o el ataque del goon rápido del Fixer), jugador objetivo, DV (a distancia, tabla de Core p.173; cuerpo a cuerpo, la defensa del jugador, Core p.176), tipo de ataque y "Cabeza (−8)" (Aimed Shot, Core p.170). Gasta 1 bala, tira base + 1d10 y, si impacta, aplica el daño a la ficha del jugador con su SP, ablación, cabeza x2 y el +5 del crítico por dos 6 (Core pp.186-188). Cada ataque va al log. Autofire y supresión quedan para más adelante.
  * El daño del GM a un PJ salió de `GmTargetDialog` a `features/gm/gmDamage.ts`, que usan el diálogo y el ataque del actor.
  * **Dar ítem**: pestaña nueva en el diálogo del jugador, con buscador del catálogo del Core por nombre y categoría. Entra al inventario (se suma a la pila si ya lo tiene) con un movimiento de €$ 0 "Del GM" en su historial. Equiparlo queda a cargo del jugador.
  * **Notas por jugador**: pestaña Notas en el mismo diálogo. Con mesa de GM van a `campaigns/{c}/gm/playerNotes` (lista de `{charId, text}`, hasta 100, solo el GM); sin mesa, al navegador (`cpr_gm_player_notes_v1`).
  * Desvíos del plan: cancelar un pedido lo borra (no hay estado `cancelled`); las notas por jugador son una lista y no un mapa, para usar la capa de secretos del GM tal cual.
* **Files Modified**: `engine/rollRequest.ts`, `engine/actorAttack.ts`, `engine/gmGive.ts`, `engine/gmPlayerNotes.ts`, `sync/rollRequests.ts`, `features/gmmode/RollRequestsPanel.tsx`, `features/gmmode/RollRequestPrompt.tsx`, `features/gmmode/ActorAttackForm.tsx`, `features/gm/gmDamage.ts`, `features/gm/GiveItemPanel.tsx`, `features/gm/PlayerNotesEditor.tsx` (nuevos); `sync/tableSync.ts` (arranca los pedidos y `publishRollFor`), `sync/gmSecrets.ts` (tipo `playerNotes`), `store/useCharacterStore.ts` (`gmGiveItemTo`), `features/gm/GmTargetDialog.tsx`, `features/gmmode/GmModeView.tsx`, `features/gmmode/GmActorsPanels.tsx`, `App.tsx`, `firestore.rules`; tests `engine/__tests__/rollRequest.test.ts`, `actorAttack.test.ts`, `gmGiveAndNotes.test.ts`, `sync/__tests__/gmSecrets.test.ts`, reglas; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 688 tests (19 nuevos), 52 tests de reglas en el emulador y build. Online con el emulador y dos usuarios (GM en `localhost`, jugador en `player.localhost`): pedido de Perception DV 15 con nota, aviso y tirada del jugador, resultado en el panel del GM y en el log; un goon ataca a Hardpoint (daño 13 contra SP 11: HP 40→38 y SP 11→10, llega a la ficha del jugador); Medtech Bag al inventario con su movimiento; la nota queda en `gm/playerNotes` y el jugador no la puede leer. Consola limpia. La prueba encontró dos fallos, ya arreglados: el ataque no aparecía para los goons rápidos (sin armas) y el DV del ataque no tenía tope.

### [v5.22.0] - 2026-11-12 (Plan 28 II: actores guardados) [Claude Code · 2026-11-12]
* **Category**: Herramientas del GM (plan 28, `docs/plans/plan28-modo-gm.md`).
* **What Changed**:
  * Actores como en Foundry: cada enemigo que se spawnea (bestiario, PNJ propio o goon del Fixer) queda guardado con su nombre numerado ("Guardia 1", "Guardia 2"), su HP, SP, balas y heridas críticas.
  * El encuentro manda mientras el enemigo pelea: cada cambio se copia al actor. "Sacar del combate" lo deja guardado tal cual; "Traer al combate" lo devuelve igual.
  * Columna Actores en MODO GM: búsqueda, filtro (todos, en combate, guardados), Traer al combate, Duplicar (uno nuevo y sano), Curar a tope (HP y SP al máximo, sin heridas, recarga con la reserva), Borrar y notas por actor.
  * En el encuentro, cada enemigo muestra sus balas por arma (−1, −10 para Autofire, Recargar con la reserva, Core p.169) y sus heridas críticas (tabla de Core pp.187-188).
  * Sin mesa se guardan en el navegador (`cpr_gm_actors_v1`); con mesa de GM, en `campaigns/{c}/gm/actors`, que solo ve el GM (hasta 200). La primera vez se copian los del navegador.
  * Desvío del plan: los actores van en un documento de la capa de secretos del GM (como las notas y los PNJ propios), no en una subcolección.
  * Reserva inicial de cada arma: 3 cargadores, la convención que ya usaba la app al pasar un PNJ a ficha.
* **Files Modified**: `engine/gmActors.ts`, `store/gmActorsStore.ts`, `features/gmmode/actorSpawn.ts`, `features/gmmode/GmActorsPanels.tsx` (nuevos); `store/encounterStore.ts` (`actorId`, `ammo`, `injuries`, `quickEnemy`), `sync/gmSecrets.ts` (tipo `actors`), `features/gmmode/GmModeView.tsx`, `features/gm/EnemiesCompendiumPanel.tsx`, `features/gm/FixerDeckView.tsx`, `App.tsx`, `firestore.rules`; tests `engine/__tests__/gmActors.test.ts`, `sync/__tests__/gmSecrets.test.ts`, reglas; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 673 tests (6 nuevos), 50 tests de reglas en el emulador y build. En local sin mesa: 2 guardias desde el Fixer, uno herido (−6 HP y Broken Arm), sacado del combate, página recargada y traído de vuelta igual; consola limpia.

### [v5.21.0] - 2026-11-12 (Plan 28 I: pestaña MODO GM) [Claude Code · 2026-11-12]
* **Category**: Herramientas del GM (plan 28, `docs/plans/plan28-modo-gm.md`).
* **What Changed**:
  * Pestaña nueva "🎛️ MODO GM", solo para el GM (`GM_ONLY_TABS`).
  * Tarjeta por jugador: HP con su barra y estado de heridas, SP de cabeza y cuerpo, Suerte, Humanidad, plata, arma en mano con balas y reserva, condiciones y críticas. Un clic abre el diálogo del GM (daño, críticas, condiciones, plata).
  * Con mesa salen los jugadores de la party; sin mesa, las fichas de jugador del navegador.
  * Encuentro con el orden de iniciativa y el botón "Iniciativa de todos" (REF + 1d10, Core p.168). En la mesa, la iniciativa de cada jugador la sigue tirando su dispositivo.
  * Desvío del plan: las tarjetas salen de la ficha completa que el GM ya tiene cargada, así que `PartySummary` no cambia.
* **Files Modified**: `features/gmmode/GmModeView.tsx` (nuevo), `engine/gmMode.ts` (nuevo), `App.tsx`; test `engine/__tests__/gmMode.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 667 tests (4 nuevos) y build. En local sin mesa: las 7 tarjetas, la iniciativa de todos y el diálogo del GM; consola limpia.

### [v5.20.0] - 2026-11-11 (Plan 27 VI: pregens, PNJ, NET y aventuras; cierre del plan 27) [Claude Code · 2026-11-11]
* **Category**: Contenido canon (plan 27; auditoría `docs/canon-audit/v5.20.0-pregens-pnj-interface-red.md`).
* **What Changed**:
  * Single Shot Pack (Interface RED Vol. 1 pp.10-31): las 10 pregens, una por rol, en el método "Pregen del Easy Mode" del creador, con el Neuroport de CEMK instalado (0 HL, CEMK RB p.25) y la Humanidad impresa en cada ficha.
  * 8 arquitecturas NET nuevas en el NET: 6 del Single Shot Pack (IR1 pp.32-36) y 2 de la Jumpstart Kit Conversion Guide (IR2 pp.30-31). Los Black ICE llevan sus stats del Core (pp.206-207).
  * 13 PNJ al bestiario: 11 de la Jumpstart Kit Conversion Guide (IR2 pp.25-30) y 2 de Halloween Screamsheets (IR4).
  * Las 3 aventuras de Halloween Screamsheets (IR4 pp.56-65) como referencia del GM, en la pestaña Tablas del GM.
  * Hardened revisado contra IR2: se suma el Brawling que IR2 imprime a 3 fichas; las erratas de IR2 quedan anotadas en la auditoría.
  * La tarjeta Hardened del Compendio de sistemas tenía rangos inventados (pools de Suerte, "Boss Legendario (Smasher)"): ahora trae los criterios y las proporciones de los 3 DLC.
  * Cierre del plan 27: Interface RED 1-4 en ✅ en la Biblioteca (sin Elflines) y el plan 22 queda cerrado.
* **Files Modified**: `data/characterCreationData.ts` (pregens de Single Shot), `data/creation/singleShotPack.json` (nuevo), `data/netArchitecturesInterfaceRed.ts` (nuevo), `data/netAndRolesData.ts`, `data/enemies-src/interface-red.json` (nuevo), `data/enemies-src/hardened.json`, `scripts/gen_enemies.py`, `data/enemies/interface-red.ts` (generado), `data/enemiesCatalog.ts`, `data/gmTables/halloween.ts` (nuevo), `features/gmtables/GmTablesView.tsx`, `features/creator/steps/MethodStep.tsx`, `data/expansionRulesData.ts`; test `engine/__tests__/interfaceRedPregensNpcs.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 663 tests (9 nuevos) y build. En local: Grease elegida en el creador (HP 35, Humanidad 44, 500eb, Neuroport) y la sección de Halloween; consola limpia.

### [v5.19.0] - 2026-11-11 (Plan 27 V: pestaña Tablas del GM) [Claude Code · 2026-11-11]
* **Category**: Herramientas del GM (plan 27; auditoría `docs/canon-audit/v5.19.0-tablas-del-gm.md`).
* **What Changed**:
  * Pestaña nueva "🎲 TABLAS DEL GM", solo para el GM (mismo filtro `canSeeGmOnly` que RED CHROME CARGO), con 5 secciones y botón de tirada en cada tabla:
    * Logros y cajas de botín (Interface RED Vol. 4 pp.24-29): 30 logros para tildar por jugador o por Crew y las Mystery Boxes de Mr. Amaze (1d10 para la caja, 1d6 para el contenido).
    * Clima de Night City (Interface RED Vol. 2 pp.16-19): tabla por estación (elige sola la del mes), Strange Weather y reglas de temperatura y lluvia; "Mostrar a la mesa" lo manda como handout.
    * Digital Dating (DLC, también en IR3): 31 tablas del Datepath.
    * Collecting the Random (DLC, también en IR3): 15 listas, entre ellas los sabores de Kibble (1d100).
    * Salvaging Night City (DLC, también en IR3): dónde buscar, categorías, DV por valor y peligros.
  * Stickball (Interface RED Vol. 4 pp.32-35) en el Compendio de sistemas, con la tabla de pases.
  * Las tablas se generan con `scripts/gen_gm_tables.py` desde los JSON de `docs/plans/work/plan27-v5.19.0/`.
* **Files Modified**: `App.tsx` (pestaña y `GM_ONLY_TABS`), `features/gmtables/GmTablesView.tsx` (nuevo), `engine/gmTables.ts` (nuevo), `data/gmTables/*.ts` (nuevos, generados), `data/expansionRulesData.ts`, `scripts/gen_gm_tables.py` (nuevo); test `engine/__tests__/gmTables.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 654 tests (54 nuevos: cada tabla cubre todo su dado) y build. En local: caja de botín elegida y abierta, 15 tiradas de clima de noviembre, las 5 secciones se dibujan; consola limpia.

### [v5.18.0] - 2026-11-11 (Plan 27 IV: vivienda de los Interface RED) [Claude Code · 2026-11-11]
* **Category**: Creador y catálogo (plan 27; auditoría `docs/canon-audit/v5.18.0-vivienda-interface-red.md`).
* **What Changed**:
  * Creador: al elegir Cube Hotel, Cargo Container, Studio Apartment o Corporate Conapt aparece "¿Dónde?", con los 10 lugares con nombre del libro y un botón para tirar 1d10. El lugar llega a las notas de la ficha. Cube Hotels y Cargo Containers: Interface RED Vol. 2 pp.35-36; Corporate Conapts y Studio Apartments: Interface RED Vol. 4 pp.47-53.
  * Catálogo: 17 muebles y accesorios. 3 juegos de muebles para Cargo Container y 5 accesorios (IR2 p.37); 3 juegos de muebles por ambiente y 6 accesorios, entre ellos el dron Zhirafa AN7-3TR con su NET Architecture (IR4 pp.51-52).
* **Files Modified**: `data/creation/namedHousing.ts` (nuevo), `engine/characterCreation.ts` (`housingPlace`), `features/creator/steps/GearStep.tsx`, `data/core-rules.cprpack.json`; test `engine/__tests__/housingInterfaceRed.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 600 tests (6 nuevos) y build. En local: el creador muestra "¿Dónde?" para Cargo Container, la tirada da el lugar con su descripción y página, y al cambiar a Studio Apartment aparece su lista de 10; consola limpia.

### [v5.17.0] - 2026-11-11 (Plan 27 III: movilidad de los Interface RED) [Claude Code · 2026-11-11]
* **Category**: Vehículos, catálogo y bestiario (plan 27; auditoría `docs/canon-audit/v5.17.0-movilidad-interface-red.md`).
* **What Changed**:
  * Vehículos nuevos en el Compendium y el garaje: la bici de Spinning Your Wheels (pp.3-7) y el Zonda Metrocar (Interface RED Vol. 4 p.68). El modo VEHÍCULOS filtra también por Interface RED.
  * Equipo: Inline Skates y Skateboard (Spinning Your Wheels p.5); Mercurius y Spider Cyberchair (Interface RED Vol. 1 p.38).
  * Compendio de sistemas: Spinning Your Wheels (reglas de la bici, cansancio, 14 mejoras y trucos) y Cyberchairs.
  * Bestiario del GM: armador del Dreaded Punknaught (Interface RED Vol. 4 pp.38-44), con piezas, ficha, construcción, manejo y tabla de muerte.
* **Files Modified**: `data/interfaceRedVehicles.ts` (nuevo), `data/blackChromeVehicles.ts` (`sourceTitle`), `engine/vehicleCatalog.ts`, `engine/punknaught.ts` (nuevo), `features/gm/PunknaughtBuilder.tsx` (nuevo), `features/gm/EnemiesCompendiumPanel.tsx`, `features/compendium/VehicleCatalogList.tsx`, `features/compendium/CompendiumView.tsx`, `features/netroles/NetAndRolesDeckView.tsx`, `data/expansionRulesData.ts`, `data/core-rules.cprpack.json`, `data/systemDocsAndChangelogData.ts`; test `engine/__tests__/mobilityCatalog.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 594 tests (14 nuevos) y build. En local: la bici se compra y entra al garaje con su origen; el Punknaught con un Extra Chassis y un motor da SDP 80, 30 asientos y 20 MOVE; consola limpia.

### [v5.16.0] - 2026-11-10 (Plan 27 II: armas, cyberdecks y equipo de los Interface RED) [Claude Code · 2026-11-10]
* **Category**: Catálogo y reglas (plan 27; auditoría `docs/canon-audit/v5.16.0-equipo-interface-red.md`).
* **What Changed**:
  * 63 ítems nuevos: Woodchipper's Garage (12 armas, pp.3-6), Midnight with the Upload (15 cyberdecks y 11 Hardware, pp.3-7), 12 Days of Gearmas (12 ítems, IR4 pp.66-68), All About Drones (6, IR1 pp.59-63), Night City Weather (5, IR2 p.20) y Stickball (2, IR4 p.34).
  * El Sternmeyer M-02 Heavy Rifle vuelve (Woodchipper p.5): el plan 26 lo había borrado por error.
  * Los slots de los cyberdecks y del Hardware nuevos cuentan en la tienda del creador.
  * El Militech Archimedes se dispara con Pilot Air Vehicle: la ficha y el HUD lo dicen, en vez de calcular Handgun.
  * Old Guns Never Die (IR1 pp.3-4): conversión de armas de 2020 a RED en el Compendio de sistemas.
  * DATA PACKS: las tarjetas de Woodchipper y Midnight dicen lo que trae el libro; se borra la de Toggle's Temple, que no existe.
* **Files Modified**: `data/core-rules.cprpack.json`, `data/removedCatalogItems.ts`, `data/expansionRulesData.ts`, `engine/creatorShop.ts`, `engine/weaponAttackLines.ts`, `features/combat/CombatHudView.tsx`, `features/datapacks/DataPackManagerView.tsx`; test `engine/__tests__/interfaceRedCatalog.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 580 tests (6 nuevos) y build. En local, el Compendium muestra el Sternmeyer M-02 y el SGI Kerberos (11 slots); consola limpia.

### [v5.15.0] - 2026-11-10 (Plan 27 I: cierre de FBC y ciberware de los Interface RED) [Claude Code · 2026-11-10]
* **Category**: Reglas y catálogo (plan 27, `docs/plans/plan27-interface-red-fbc.md`; auditoría `docs/canon-audit/v5.15.0-fbc-y-ciberware-interface-red.md`).
* **What Changed**:
  * FBC: las piezas con HL del cuerpo habitado bajan el tope de terapia (2 cada una, 4 el borgware; Going Metal p.95, Core p.230). Volver a un cuerpo ya habitado no cobra el paquete y baja la Humanidad al máximo de ese cuerpo (p.94); la ficha guarda los cuerpos (`fbcState.inhabitedChassisIds`). El Biosystem se cobra una sola vez.
  * 44 ciberware nuevos: Must Have Cyberware Deals (12, pp.2-4), The 12 Days of Cybermas (12, pp.3-5) y Exotics of 2045 de Interface RED Vol. 2 (17 paquetes de The Zoo y 3 implantes, pp.66-74). Los 5 repetidos (3 de Black Chrome, Appetite Controller y NeuTongue) no se duplican.
  * Tienda del creador: pestaña "Paquetes Exotic (The Zoo)". Ripperdoc: los paquetes van en External; PerfectFit Cyberfoot y Romanova Cyberlegs en piernas; Sponsored Covering como cobertura.
  * El Ripperdoc leía mal un HL fijo como "22" (lo tomaba como 1d6/2).
  * DATA PACKS: las tarjetas de Going Metal y de Must Have (ahora con Cybermas) dicen lo que trae el libro.
  * Notas de contradicciones del libro: Enforcer 53/55 y el precio y el tope del ejemplo de Bazooka Joe.
* **Files Modified**: `engine/fbcTherapy.ts` (nuevo), `engine/characterEngine.ts`, `store/useCharacterStore.ts`, `types/cyberpunk.ts`, `features/cyberware/CyberwareRipperdocView.tsx`, `features/cyberware/ripperdocZones.tsx`, `features/creator/steps/GearStep.tsx`, `features/datapacks/DataPackManagerView.tsx`, `data/core-rules.cprpack.json`; tests `engine/__tests__/interfaceRedCatalog.test.ts` (nuevo), `rules.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 574 tests (8 nuevos) y build. En local, un FBC en un Enforcer que pasa a un Copernicus y vuelve con 70 de Humanidad queda en 52; el Compendium muestra los ítems nuevos con libro y página; consola limpia.

### [v5.14.1] - 2026-11-10 (Auditoría del plan 26: Family Motorpool con tope y arreglos chicos) [Claude Code · 2026-11-10]
* **Category**: Arreglos de reglas y datos (auditoría del plan 26, `docs/canon-audit/v5.14.1-auditoria-plan26.md`).
* **What Changed**:
  * Family Motorpool: un vehículo gratis por rango de Moto (Core p.162; BC p.9), contando Core, Black Chrome y los viejos; antes no tenía límite. El garaje muestra cuántos quedan y avisa que una mejora cuenta como un vehículo menos.
  * NPC al combate: las armas de Athletics (granadas, boomerang) usan DEX + Athletics.
  * Explosivos que se colocan (5 de BC pp.87-90, skill Demolitions): la ficha y el HUD dicen que no se tiran para atacar, en vez de sumar Handgun.
  * Los 3 fluidos de la Weeping Reaver se venden en el puesto D2 (BC p.91).
  * Explicit Memory Stimulator (Chipware) y EL-F4-NT (solo externo): instalación "N/A" en vez de Mall.
  * La auditoría de datos contra las listas de Black Chrome (pp.157-169) y Black Chrome+ no encontró faltantes, inventados ni diferencias de costo o página.
* **Files Modified**: `engine/vehicleCatalog.ts`, `features/netroles/NetAndRolesDeckView.tsx`, `engine/npcEnemy.ts`, `engine/weaponAttackLines.ts`, `features/combat/CombatHudView.tsx`, `features/compendium/CompendiumView.tsx`, `data/core-rules.cprpack.json`; tests `engine/__tests__/placedExplosives.test.ts` (nuevo), `vehicleCatalog.test.ts`, `npcEnemy.test.ts`, `nightMarket.test.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 566 tests (6 nuevos) y build. En local, un Nomad de Moto 2 toma 2 vehículos gratis y el tercero queda bloqueado, también en la lista del Core.

### [v5.14.0] - 2026-11-06 (Black Chrome III: Night Markets y Economics 101) [Claude Code · 2026-11-06]
* **Category**: Contenido canon y mesa online (plan 26, `docs/plans/plan26-black-chrome.md`, tercera y última versión).
* **What Changed**:
  * FIXER DECK tiene un generador de Night Market para el GM (`features/gm/NightMarketPanel.tsx`):
    * **Al azar**, con el Night Market Generator del Core (pp.338-339): 1d6 dos veces para las categorías, 1d10 tipos por categoría y d100 en la columna, sin repetir. Se puede volver a tirar cada categoría y sumar los puestos de un mercado de Black Chrome (BC p.7) (`data/nightMarketTables.ts`, `engine/nightMarket.ts`).
    * **Mercados de Black Chrome**: los 6 (A-F, pp.131-156) con su Fixer, dónde y cuándo se hacen, cómo se entra, seguridad y reglas propias, en resumen propio, y sus 29 puestos con los ítems que los citan (`data/blackChromeMarkets.ts`, `engine/blackChromeBooths.ts`).
    * "Comprar" abre la tienda del Compendium con el ítem ya buscado; los vehículos se compran en el garaje.
  * **Mostrar a la mesa**: con mesa online, el GM comparte el mercado (`campaigns/{c}/reveals/market`) y los jugadores lo ven en la pestaña de la mesa (`features/cloud/SharedMarketPanel.tsx`). Regla nueva en `firestore.rules`: solo el GM escribe, forma fija y topes (título 120, 12 secciones).
  * **Economics 101** (BC pp.125-130) en el Compendio de sistemas: la tabla Find a Fixer/Tech (Streetwise DV15/17/21/24 por costo, p.129), cómo el Fixer consigue y cobra un ítem, y Lifestyles in Detail (p.130). El detalle de cada estilo de vida también aparece en el creador.
  * Arreglo de la v5.12.0: 57 ítems guardaban el puesto como frase ("Pick-up or Browse at Booth A3") y no como código; quedan como "A3".
* **Files Modified**: `data/nightMarketTables.ts`, `data/blackChromeMarkets.ts`, `engine/nightMarket.ts`, `engine/blackChromeBooths.ts`, `features/gm/NightMarketPanel.tsx`, `features/cloud/SharedMarketPanel.tsx` y `engine/__tests__/nightMarket.test.ts` (nuevos); `sync/tableReveals.ts`, `sync/tableSync.ts`, `firestore.rules` y su test; `features/gm/FixerDeckView.tsx`, `features/cloud/CampaignPanel.tsx`, `features/compendium/CompendiumView.tsx` y `features/sheet/CompendiumShopModal.tsx` (`initialSearch`); `data/expansionRulesData.ts`, `data/creation/housingOptions.ts`, `features/creator/steps/GearStep.tsx`; `data/core-rules.cprpack.json` (códigos de puesto); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 560 tests (10 nuevos: tabla d100 sin huecos, categorías distintas, tipos sin repetir y de la tabla, volver a tirar, 6 mercados con 29 puestos, todo puesto citado existe, ítems por puesto, categoría de precio, DV de Find a Fixer, estilos de vida, topes del mercado compartido), 50 tests de reglas (1 nuevo) y build. En local: mercado al azar, mercado F con sus puestos, "Comprar" abre la tienda con el ítem buscado; con el emulador, el GM lo muestra a la mesa, un jugador lo lee y no lo puede escribir, y se ve en la pestaña de la mesa.

### [v5.13.0] - 2026-11-06 (Black Chrome II: vehículos de Black Chrome y Nomad Access) [Claude Code · 2026-11-06]
* **Category**: Contenido canon (plan 26, `docs/plans/plan26-black-chrome.md`, segunda de tres versiones).
* **What Changed**:
  * Entran los 31 vehículos de *Black Chrome* (8 aéreos y 23 terrestres; tabla en pp.162-164, entradas en pp.58-84). Cada uno lleva tipo base del Core, Nomad Access, SDP, plazas, velocidades, costo, mejoras de serie, notas, página y puesto de Night Market (`data/blackChromeVehicles.ts`).
  * Se borra el viejo `VEHICLES_CATALOG` (14 vehículos: 12 inventados, y el Gorgon y el AeroVox con datos inventados). STREET LAB avisa si el garaje tiene uno; el vehículo queda con sus datos.
  * Garaje (NET, ROLES & VEHÍCULOS): "Comprar" descuenta el costo de los €$ (antes no cobraba). El Nomad puede tomar gratis del Family Motorpool los que tengan Nomad Access igual o menor a su Rango de Moto (BC p.9), con todas sus mejoras. Armored Chassis da SP13 (Core p.163) y las armas montadas pasan a `mountedWeapons` (`engine/vehicleCatalog.ts`).
  * Compendium: modo nuevo VEHÍCULOS con los 14 genéricos del Core (pp.189-191) y los 31 de Black Chrome, con filtro por tipo y libro y buscador (`features/compendium/VehicleCatalogList.tsx`).
  * La regla "Vehículos de Black Chrome y Nomad Access" del Compendio de sistemas se reescribe con datos del libro; la anterior tenía vehículos y valores inventados.
  * La pestaña del Compendium ya no dice "272 ÍTEMS" (número fijo viejo).
* **Files Modified**: `data/blackChromeVehicles.ts`, `engine/vehicleCatalog.ts`, `features/compendium/VehicleCatalogList.tsx` y `engine/__tests__/vehicleCatalog.test.ts` (nuevos); `data/netAndRolesData.ts` (sin `VEHICLES_CATALOG`), `data/removedCatalogItems.ts`, `data/expansionRulesData.ts`, `data/systemDocsAndChangelogData.ts`, `features/netroles/NetAndRolesDeckView.tsx`, `features/compendium/CompendiumView.tsx`, `features/sheet/RemovedItemsNotice.tsx`, `App.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 550 tests (9 nuevos: 31 vehículos 8/23 con página y puesto, mejoras de serie que existen en el Core, datos de la tabla, nada inventado en el catálogo, aviso por vehículo borrado, copia al garaje, armas montadas, Nomad Access por rango y JetBoy sin Nomad Access) y build. En local con un Nomad de Moto 4: The Grundy gratis del Motorpool (SP13 y sus mejoras), el TDT 004 bloqueado ("Necesita Moto 7") y comprado por 43,000 €$, aviso por un vehículo borrado y el modo VEHÍCULOS del Compendium; consola limpia.

### [v5.12.0] - 2026-11-06 (Black Chrome I: todos los ítems de Black Chrome y Black Chrome+) [Claude Code · 2026-11-06]
* **Category**: Contenido canon (plan 26, `docs/plans/plan26-black-chrome.md`, primera de tres versiones).
* **What Changed**:
  * Se reemplazan los 31 ítems "Black Chrome" que tenía el pack: solo 1 coincidía con el libro. 15 se borran (inventados, o vehículos cargados como equipo) y el resto se corrige con los datos del libro.
  * Entran los ítems de *Black Chrome Tech & Style Guide*, todos con página y con su puesto de Night Market (`booth`):
    * 52 armas (pp.85-124) y los 3 fluidos de la Weeping Reaver como equipo;
    * 20 piezas de ciberware, 16 Cyberfingers y 4 Linear Frames (pp.15-26, 51-56);
    * 14 armaduras y 2 de moda (pp.27-37);
    * 21 de equipo y 5 apps.
  * Entra *Black Chrome+*: 6 armas, 3 municiones, 1 armadura, 1 droga y 1 ítem más. "Looking the Part" queda citado en la guía de moda; "Looking at Linear" suma a los Linear Frames del Core la tirada de Cybertech para reconocerlos (DV13 Sigma, DV9 Beta).
  * STREET LAB avisa si una ficha tiene un ítem borrado: lo nombra y dice por qué; la ficha lo conserva (`data/removedCatalogItems.ts`, `features/sheet/RemovedItemsNotice.tsx`).
  * Las armas que se tiran con Athletics calculan su base con Athletics (antes caían en Handgun).
  * Detalle de lo borrado y corregido: `docs/canon-audit/v5.12.0-black-chrome-items.md`.
* **Files Modified**: `data/core-rules.cprpack.json` (v1.25), `data/removedCatalogItems.ts`, `features/sheet/RemovedItemsNotice.tsx` y `engine/__tests__/blackChromeCatalog.test.ts` (nuevos); `types/cyberpunk.ts` (`booth`, `sourcePage` en armadura), `engine/characterEngine.ts` (Athletics), `features/sheet/StreetLabView.tsx`, `data/creation/fashionGuide.ts`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 541 tests (6 nuevos: nada borrado sigue en el catálogo, todo ítem de BC y BC+ tiene página, cantidades por categoría, ids únicos, aviso en la ficha) y build. En local: el Compendium filtra 137 ítems de Black Chrome con su página; el aviso aparece con una ficha que tiene un ciberware borrado; consola limpia.

### [v5.11.1] - 2026-11-06 (Las fichas de jugador entran solas a la campaña también en prod) [Claude Code · 2026-11-06]
* **Category**: Mesa online (arreglo de la v5.11.0, plan 25).
* **What Changed**: en prod, Dow Jones y Kessler (1swordhie) no entraban solas a la campaña. La campaña automática esperaba una lectura de la lista de campañas "confirmada por el servidor"; con la caché persistente de Firestore, si el servidor no trae cambios esa lectura no llega nunca. En el emulador no se veía porque la caché arrancaba vacía. Ahora corre con cualquier lectura de la lista; si el caché está viejo (por ejemplo, te echaron), la regla rechaza la asignación y no pasa nada. Liberar fichas de campañas viejas (`cleanupOrphans`) sigue esperando la lectura del servidor, como antes.
* **Files Modified**: `sync/cloudCampaigns.ts`, `sync/__tests__/cloudCampaignsAuto.test.ts` (nuevo); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, tests (2 nuevos: con la lista solo del caché asigna las fichas de jugador libres y no las de NPC ni las que ya tienen campaña; no repite la asignación) y build.

### [v5.11.0] - 2026-11-05 (Fichas fijas en la nube y fichas de NPC) [Claude Code · 2026-11-05]
* **Category**: Mesa online (plan 25, `docs/plans/plan25-fichas-fijas-y-npc.md`). Pedido de Giuliano: el GM no veía las fichas de sus jugadores si no las asignaban a mano; las fichas tienen que quedar fijas en la nube, y las de NPC separadas de las de jugador.
* **What Changed**:
  * Con la cuenta abierta, toda ficha que se crea o se importa **sube sola** a la nube. Las que ya estaban solo en el dispositivo y las precargadas del CEMK Folio siguen con SUBIR A LA NUBE.
  * Las fichas de jugador **entran solas** a la campaña donde el dueño es jugador (si es jugador en varias, a la mesa activa; nunca a una donde es GM) y **quedan fijas** mientras sea miembro: no hay SACAR. Al salir de la campaña (o si lo echan) la ficha queda en su nube sin campaña.
  * **Nadie borra una ficha de la nube** (ni el dueño ni el GM); en STREET LAB el tacho se ve apagado con la explicación. Se puede pasar a otro jugador con el código (v5.10.0).
  * STREET LAB: selector **Ficha de jugador / Ficha de NPC**. Las importadas del bestiario salen como NPC. Una ficha de NPC no entra a la party ni a ASIGNAR, y los jugadores no la pueden leer.
  * BESTIARIO // tracker de encuentro: **"Agregar NPC de mis fichas"** suma una ficha de NPC como enemigo (stats, HP máximo, SP, armas con base STAT + skill). El jugador ve de ese NPC lo mismo que de cualquier enemigo: nombre, iniciativa, heridas y nivel de amenaza, nunca los HP.
  * MESA // CAMPAÑA: etiqueta JUGADOR o NPC en TUS FICHAS EN LA NUBE y avisos de cómo funciona.
  * Reglas de Firestore: `characters` sin `delete`; `campaignIds` fijo para una ficha de jugador mientras el dueño es miembro (se libera o se mueve cuando ya no lo es, o si la campaña se borró; las de NPC y las del GM en su campaña se mueven libres); el resumen de party de una ficha `sheetKind: 'npc'` se rechaza.
* **Files Modified**: `engine/npcEnemy.ts`, `sync/autoAssign.ts`, `features/gm/NpcToEncounter.tsx` y sus tests (nuevos); `types/cyberpunk.ts` (`sheetKind`), `store/useCharacterStore.ts`, `data/enemiesCatalog.ts`, `sync/cloudCharacters.ts` (subida automática), `sync/cloudCampaigns.ts` (campaña automática, NPC fuera de la party, `leave` libera después de salir), `features/sheet/StreetLabView.tsx`, `features/cloud/CampaignPanel.tsx`, `features/cloud/CloudTableView.tsx`, `features/gm/EnemiesCompendiumPanel.tsx`, `firestore.rules` y sus tests (6 nuevos); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 533 tests, 49 tests de reglas con el emulador y build. Con el emulador, un GM de prueba y el jugador Bob: Bob crea "Rata" y sube sola, entra sola a la campaña y el GM la lee y la ve en PARTY; el GM le baja el HP 40 → 33 y Bob lo ve; Bob no puede sacarla ni borrarla (permiso denegado); una ficha marcada NPC sube pero no entra a la campaña ni a la party; el NPC al combate entra con 40/40 HP y su vista pública no tiene HP; al salir, Rata queda sin campaña; al volver a unirse entra sola otra vez; las precargadas no subieron.
* **Publicación**: hay que publicar las reglas en dev y en prod antes del hosting; cada una con OK de Giuliano. Una ficha que hoy está en una campaña queda fija ahí.

### [v5.10.0] - 2026-11-04 (Pasarle una ficha a otro jugador) [Claude Code · 2026-11-04]
* **Category**: Mesa online (plan 24, `docs/plans/plan24-pasar-ficha.md`). Pedido de Giuliano: la ficha de un jugador quedó en la cuenta del GM y no había forma de pasársela.
* **What Changed**:
  * MESA // CAMPAÑA → TUS FICHAS EN LA NUBE: cada ficha tiene **PASAR A OTRO JUGADOR**. Crea un código de 10 caracteres (ej. `K7P4Q-X9M2R`, sin 0/O ni 1/I/L) que dura 24 horas, con Copiar y Cancelar; mientras tanto la ficha sigue siendo tuya y el código se ve al recargar.
  * Bloque nuevo **RECIBIR UNA FICHA**: se pega el código, se ve "X te pasa a Vex (Nomad 4)" y ACEPTAR. La ficha pasa a la cuenta del que la recibe, con sus historiales de IP y €$ (traspaso de dueño, no copia).
  * Campaña: si el que la recibe es miembro de la campaña de la ficha, queda en la campaña y el GM la sigue viendo y editando como ficha de jugador; si no, sale de la campaña (decisión de Giuliano, 2026-11-04).
  * El que la dio: la ficha se quita de su dispositivo al momento, con el aviso "Vex ahora es de otro jugador".
  * Reglas de Firestore: colección `transfers/{code}` (se lee de a uno con sesión, no se lista, vence a las 24 h, la crea solo el dueño de la ficha); campo `transferCode` en la ficha; rama nueva de update para recibir (solo cambia dueño, código y campaña; exige código válido y no vencido); el nuevo dueño puede republicar el resumen de party con su `ownerUid`.
* **Files Modified**: `sync/transferCode.ts`, `features/cloud/TransferPanel.tsx`, `sync/__tests__/transferCode.test.ts` (nuevos); `firestore.rules` y sus tests (7 nuevos), `sync/firestoreAdapter.ts`, `sync/cloudCharacters.ts`, `sync/cloudState.ts`, `sync/sheetDoc.ts` (`transferCode` en META_FIELDS), `features/cloud/CloudTableView.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 526 tests, 43 tests de reglas con el emulador y build. Con el emulador y dos cuentas de prueba: A pasa una ficha y B la recibe (A deja de verla con el aviso; B la tiene con sus €$ e historial); B se la devuelve por la pantalla RECIBIR UNA FICHA; con una campaña de A en la que B es miembro, la ficha queda en la campaña y A la edita como GM (HP 40 → 35 llega a la nube); cancelar borra el código; errores de código propio, inexistente y mal escrito; el código sigue al recargar; celular (375 px) sin scroll horizontal.
* **Publicación**: hay que publicar las reglas (`firebase deploy --only firestore:rules`) en dev y en prod antes del hosting; cada una con OK de Giuliano.

### [v5.9.3] - 2026-11-04 (El PDF para imprimir ya no corta las listas) [Claude Code · 2026-11-04]
* **Category**: Ficha (impresión). Pedido de Giuliano, sin plan (tarea chica): en el PDF de Dow Jones faltaban Paramedic, Cybertech, Perception, Concentration y Resist Torture/Drugs.
* **What Changed**: las listas con alto fijo y barra (skills de Street Lab con `max-h-[640px]`, arsenal, mochila, etc.) se imprimían cortadas. Una regla `@media print` las deja con alto libre y sin barra solo al imprimir; en pantalla no cambia nada.
* **Files Modified**: `frontend/src/index.css`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, tests y build. En el navegador local, aplicando la regla de impresión, la lista de skills pasa de 640 px visibles (de 922) a 922 px: se ven las 16.
* **Aparte**: la ficha de Dow Jones (jugador real) se rearmó desde su PDF y se subió a la nube de prod con la cuenta abierta en el Chrome de Giuliano; copia en `Documents\Rol\CEMK\dow_jones_sheet.json`. Le faltan 5 skills, OTRAS SKILLS, la mochila y el lifepath (no estaban en el PDF).

### [v5.9.2] - 2026-11-04 (Un solo botón DESCARGAR y aviso al importar un PDF) [Claude Code · 2026-11-04]
* **Category**: Ficha (STREET LAB). Pedido de Giuliano, sin plan (tarea chica): un jugador bajó la ficha como PDF con el botón de la impresora y después no se podía volver a cargar.
* **What Changed**:
  * Los dos íconos sin texto (⬇ JSON y 🖨️ PDF) pasan a ser un solo botón "DESCARGAR" con dos opciones: "Archivo de la ficha (.json)" (RECOMENDADO: trae toda la ficha, se vuelve a cargar con IMPORTAR FICHA o se le pasa a otro) y "PDF para imprimir + archivo (.json)" (baja también el .json en el mismo click y después abre la impresión; avisa que el PDF no se puede volver a cargar). El PDF no puede llevar los datos adentro porque lo arma la impresora del sistema. El menú va en un portal para que la tarjeta no lo recorte.
  * IMPORTAR FICHA y RESTAURAR RESPALDO aceptan elegir un PDF solo para explicar qué pasa: "Ese PDF es solo para leer o imprimir…" y cómo bajar el .json o subir la ficha a la nube desde MESA.
* **Files Modified**: `frontend/src/features/sheet/StreetLabView.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, tests y build. En el navegador local: la opción PDF baja el .json antes de abrir la impresión; DESCARGAR abre el menú con las dos opciones y se ve encima de la tarjeta; elegir un PDF en IMPORTAR FICHA muestra el aviso; consola limpia.

### [v5.9.1] - 2026-10-30 (Recordatorio de negativos por Heridas Críticas) [Claude Code · 2026-10-30]
* **Category**: HUD y ficha (STREET LAB). Pedido de Giuliano, sin plan (tarea chica).
* **What Changed**:
  * El panel HERIDAS CRÍTICAS del HUD empieza con "⚠️ Negativos activos por heridas": suma los negativos de las heridas activas y dice de cuál sale cada uno (−X a todas las acciones, a ataques a distancia y Perception con la vista, a melee, a MOVE y +X al Death Save Penalty; Core pp.187-188). Las heridas sin un número fijo (Broken Jaw, Foreign Object, Lost Ear, etc.) muestran su efecto. Aclara que los ataques con armas del HUD ya los restan, que en las demás tiradas hay que restarlos a mano, y que Quick Fix los saca hasta el final del día y Treatment para siempre (Core p.223). El resumen del panel plegado dice "· −X a todo".
  * En Street Lab, arriba de HABILIDADES y de OTRAS SKILLS, una línea roja avisa los negativos y que la BASE mostrada no los resta.
  * Las heridas con Quick Fix o tratadas no cuentan, igual que en el cálculo de ataques.
* **Files Modified**: `frontend/src/engine/injuryPenalties.ts` (nuevo); `frontend/src/features/sheet/InjuryPenaltyReminder.tsx` (nuevo); `frontend/src/features/combat/CombatHudView.tsx`; `frontend/src/features/sheet/StreetLabView.tsx`; `frontend/src/features/sheet/OtherSkillsPanel.tsx`; `frontend/src/engine/__tests__/injuryPenalties.test.ts` (nuevo); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, tests y build. En el navegador local: con Concussion, Damaged Eye, Broken Jaw y Lost Ear el HUD muestra −2 a todas las acciones, −2 a distancia, +1 al Death Save y los dos efectos aparte; Street Lab muestra la línea corta; al borrar las heridas desaparece; consola limpia.

### [v5.9.0] - 2026-10-30 (Bandeja de la columna izquierda del HUD) [Claude Code · 2026-10-30]
* **Category**: HUD (plan 23, `docs/plans/plan23-streetlab-hud-comodidades.md`, segunda y última versión).
* **What Changed**:
  * La columna izquierda del ACTIVE COMBAT HUD tiene su bandeja "🩺 BIOMONITOR & VITALES", igual que la de MÓDULOS TÁCTICOS: una tarjeta por panel (Biomonitor & Vitales, Matriz de Blindaje, Suerte, Heridas Críticas, Ciberware, Consumibles) con su resumen, "➕ AL CENTRO / ⬅️ A COLUMNA", "➡️ A BANDEJA" y "👁️ VISTA" (vista previa sin moverlo). El contador dice cuántos quedan en la columna (`n/6`).
  * Cada panel está en uno de tres lugares: la columna (como siempre), el centro (arriba de los módulos de la derecha) o la bandeja (oculto). Se puede arrastrar de la columna o de la bandeja al centro, y a la zona "Arrastrá un panel acá" para mandarlo a la bandeja. El botón chico del encabezado del panel lo manda a la bandeja (📥) o, en el centro, lo vuelve a la columna (⬅️).
  * Se guarda en el navegador. "Restaurar orden" vuelve todo a la columna. La bandeja arranca plegada para no empujar el Biomonitor hacia abajo (también en celular) y recuerda si la abrís. Subir/bajar un panel salta los que están en el centro o en la bandeja.
* **Files Modified**: `frontend/src/features/combat/leftTray.ts` (nuevo: `splitLeftPanels`, `moveLeftPanelTo`, claves de guardado); `frontend/src/features/combat/CombatHudView.tsx`; `frontend/src/features/combat/__tests__/leftTray.test.ts` (nuevo); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 517 tests y build. En el navegador local: Biomonitor al centro y Suerte a la bandeja dejan la columna en 4/6; al recargar sigue igual; ⬅️ en el panel del centro y "A COLUMNA" lo vuelven todo a 6/6; en celular (375 px) la bandeja está plegada y no hay scroll horizontal; consola limpia.

### [v5.8.0] - 2026-10-30 (Street Lab más cómodo: skills favoritas, reparar explicado, comprar desde la ficha y nombre propio de ítems) [Claude Code · 2026-10-30]
* **Category**: Ficha (STREET LAB) y HUD (plan 23, `docs/plans/plan23-streetlab-hud-comodidades.md`, primera de dos versiones).
* **What Changed**:
  * Skills favoritas: cada skill de HABILIDADES y de OTRAS SKILLS tiene una ☆ para marcarla. "★ SOLO FAVORITAS" muestra solo las marcadas (en las dos listas); en OTRAS SKILLS las favoritas van primero. Las favoritas viajan con la ficha (`favoriteSkills`); el filtro se guarda en el navegador.
  * Reparar armadura: los botones "Reparar" (Street Lab y HUD) abren una ventana con la regla del libro para tu armadura: TECH + Basic Tech + 1d10 contra el DV, el tiempo y la categoría de precio (Core p.140, Item Repair), que si fallás empezás de nuevo, y que un Tech con Field Expertise la puede emparchar 10 minutos por Rango (Core p.147). Costo por el libro: 0 €$. Campo opcional "Le pago a un Tech" (variante de mesa) que descuenta la plata y deja la transacción en la billetera. La Bodyweight Suit se repara entera (Core p.350). Si la armadura no está en el catálogo, avisa que le preguntes la categoría al GM.
  * "+ Comprar / Añadir" en ARSENAL y en MOCHILA: abre el Compendium en una ventana encima de la ficha (en Armas o en Equipo), con COMPRAR y GRATIS / LOOT. Se cierra con ✕ o Escape.
  * Nombre propio: un ✎ al lado de cada arma, ítem de la mochila, pieza de blindaje y ciberware. Se ve "Cuchillo (Light Melee Weapon)" o solo "Cuchillo". Se muestra en Street Lab y en el HUD (en mano, arsenal, blindaje y ciberware). Las reglas siguen usando el nombre del libro; si cambiás la armadura por otra, el apodo deja de valer. Los apodos de ítems que ya no están se limpian la próxima vez que ponés o quitás uno.
* **Files Modified**: `frontend/src/types/cyberpunk.ts` (`favoriteSkills`, `itemNicknames`, `ItemNickname`); `frontend/src/store/useCharacterStore.ts` (`toggleFavoriteSkill`, `setItemNickname`, texto de la transacción de reparación); `frontend/src/engine/armorRepair.ts` (nuevo); `frontend/src/engine/itemNames.ts` (nuevo); `frontend/src/features/sheet/ArmorRepairDialog.tsx` (nuevo); `frontend/src/features/sheet/CompendiumShopModal.tsx` (nuevo); `frontend/src/features/sheet/ItemNameButton.tsx` (nuevo); `frontend/src/features/sheet/favoriteSkills.ts` (nuevo); `frontend/src/features/sheet/StreetLabView.tsx`; `frontend/src/features/sheet/OtherSkillsPanel.tsx`; `frontend/src/features/compendium/CompendiumView.tsx` (prop `initialCategory`); `frontend/src/features/combat/CombatHudView.tsx`; tests `engine/__tests__/armorRepair.test.ts`, `engine/__tests__/itemNames.test.ts`, `store/__tests__/plan23.test.ts` (nuevos); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 514 tests y build. En el navegador local: ★ en Handgun y "SOLO FAVORITAS" deja HABILIDADES (1); "Reparar" de la Light Armorjack muestra DV 17 y 1 día; "+ Comprar / Añadir" de ARSENAL abre el Compendium en Armas; "La Negra" en la Masamune se ve en Street Lab y en el HUD y se quita con "Quitar nombre propio"; consola limpia. El descuento al pagarle a un Tech se cubre con test; no se compró nada en el navegador.

### [v5.7.1] - 2026-10-30 (Red Chrome Cargo solo para el GM) [Claude Code · 2026-10-30]
* **Category**: Mesa / GM. Pedido de Giuliano, sin plan (tarea chica).
* **What Changed**:
  * Red Chrome Cargo es una misión, así que solo la ve el GM: la pestaña "🚆 RED CHROME CARGO", el botón "RED CHROME CARGO // THE HAMMERHEAD" del HUD y su tarjeta en DATA PACKS se esconden para el jugador de una mesa y, sin mesa, mientras el PIN del GM esté puesto y sin desbloquear. Al desbloquear el PIN (Fixer Deck o NET) vuelven a aparecer. Sin mesa y sin PIN se ve, porque la app no puede saber quién es el GM.
  * Si alguien estaba en la pestaña y deja de tener acceso, vuelve al HUD.
* **Files Modified**: `frontend/src/store/gmAccess.ts` (`canSeeGmOnly`); `frontend/src/App.tsx`; `frontend/src/features/combat/CombatHudView.tsx`; `frontend/src/features/datapacks/DataPackManagerView.tsx`; `frontend/src/store/__tests__/gmOnly.test.ts` (nuevo); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, tests y build. En el navegador local: sin PIN se ve; con PIN puesto desaparecen la pestaña, el botón del HUD y la tarjeta; al desbloquear el PIN en el Fixer Deck vuelve la pestaña; consola limpia. El caso del jugador de una mesa se cubre con el test (mismo modo `table-player` que ya usa el Fixer Deck); no se probó en el navegador.

### [v5.7.0] - 2026-10-30 (Qué ganás en cada rango de rol y filtro de skills por libro en el wizard) [Claude Code · 2026-10-30]
* **Category**: Ficha (STREET LAB) y creador de personajes. Pedido de Giuliano, sin plan (tarea chica).
* **What Changed**:
  * Rangos de rol: la tira del rol arriba de HABILIDADES suma "¿Qué ganás más adelante?", con el próximo rango y su costo (60 × rango nuevo, Core p.410) y los 10 rangos con lo que da cada uno: el tuyo resaltado, los pasados con ✓ y los que vienen con su costo en IP. Los textos son los de la habilidad de rol del Core RED, con los ajustes de 2077 (CEMK RB p.25). En la pestaña ROL, los rangos bloqueados ya no se ven tan apagados.
  * Wizard, paso de skills: botones "Todas (66)", "CEMK (46)" y "Solo Core RED (20)". El filtro solo cambia lo que se ve y avisa qué skills con puntos quedan ocultas.
  * Moda en el wizard (Complete Package): "¿Para qué sirve la moda?" (no es armadura; da imagen, Core p.328; Wardrobe & Style, Core p.84; +2 del Agent si usás lo que sugiere, Core p.352; +2 de Light Tattoo y del recubrimiento de cyberlimb, Core pp.358, 367; ropa digital, Core p.327; 800 €$ solo para moda o Fashionware, Core p.105) y "Los 10 estilos": las 3 palabras del libro, el rango de precio por pieza (Core p.102), qué imagen da y dónde encaja (sugerencia de mesa). Debajo del selector se describe el estilo elegido. Datos en `data/creation/fashionGuide.ts`.
  * Vivienda inicial: aviso de que lo que elijas no cambia la plata inicial (el primer mes viene pagado; solo cambia lo que pagás desde el mes que viene; elegir distinto del libro es variante de mesa, Core p.105). Cada estilo de vida dice qué te da (Kibble, Generic Prepak, Good Prepak, Fresh Food, Core p.377), con sus reglas: gastar de más se cobra aparte, sin pagar hay una semana y después Death Save por día, mejor desalojo que hambre, dormir mal da −2.
  * Arreglo: en el paquete del rol, la opción principal de munición no decía la cantidad ("Basic Shotgun Shell Ammunition" sin el x100, mientras la alternativa sí lo decía). Ahora dice "x100" o "x10" igual que las alternativas (Core p.98). El dato ya estaba bien; solo faltaba mostrarlo.
* **Files Modified**: `frontend/src/features/sheet/StreetLabView.tsx`; `frontend/src/features/creator/steps/SkillsStep.tsx`; `frontend/src/features/creator/steps/GearStep.tsx`; `frontend/src/data/creation/fashionGuide.ts` (nuevo); `frontend/src/data/creation/housingOptions.ts`; `frontend/src/engine/__tests__/creatorV570.test.ts` (nuevo); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, tests y build. En el navegador local, tamaño iPad: Insurance (Medtech) y Connect (Fixer) muestran sus 10 rangos con costos; en el wizard, CEMK oculta Archery, "Solo Core RED" oculta Handgun, y se avisan las skills ocultas con puntos.

### [v5.6.0] - 2026-10-29 (La ficha que explica: STATs con tus números, líneas de ataque, Martial Arts en cuadros, Medtech y el rol primero) [Claude Code · 2026-10-29]
* **Category**: Ficha (STREET LAB) (plan 21, `docs/plans/plan21-creador-tienda-ficha.md`, tercera y última versión).
* **What Changed**:
  * STATs: cada STAT de la ficha se toca (sin hover, para el iPad) y abre debajo un panel con su explicación, sus reglas con página y "Con tus números": con REF 8 o más, "podés esquivar tiros con DEX + Evasion = N + 1d10" (Core p.172); HP, Death Save y daño de Brawling y Martial Arts según BODY (Core pp.79, 176, 222); Humanidad / EMP (Core p.80); MOVE × 2 m (Core p.169); Facedown con COOL (Core p.194); LUCK que queda. Botón "¿Qué hace cada STAT?" con la guía completa.
  * Armas: cada arma equipada dice con qué tirada pega ("Tiro simple: REF 7 + Handgun 6 = 13 + 1d10", o "Golpe: DEX + Melee Weapon"), con las penalizaciones. Las que tienen Autofire suman la ráfaga (REF + Autofire, tabla de Autofire, 10 balas, 2d6 × margen hasta ×3 en SMG o ×4 en Assault Rifle, Core p.173), un aviso si Autofire está en 0, y Suppressive Fire (Core p.174).
  * Skills de combate: al abrir una skill de arma se ve qué armas cubre, cuáles de tus armas la usan con su total y, en Autofire, sus reglas. Los botones +/− pasan a 32 px.
  * Martial Arts: los 2 movimientos de cada forma van en cuadros (requisito, DV o "contra…", efecto, reglas, daño y herida) y arriba un cuadro con las reglas de todas las formas (ROF 2, ignora la mitad del SP, daño por BODY, DEX + forma + 1d10, Recovery DV13; Core pp.178-179). En DOJO (formas activas y catálogo) y en NET, ROLES & VEHÍCULOS.
  * Medtech: el reparto de Medicine muestra qué heridas trata Surgery con su DV (y cuáles también Paramedic; Core pp.187-188), qué hace cada fármaco y cómo se fabrica (Medical Tech DV13, Core pp.149-150), qué da cada nivel de Cryosystem marcando el tuyo (Core p.150) y Quick Fix o Treatment (Core p.223). Botones de 32 px.
  * El rol primero: arriba de HABILIDADES, una tira con el rol, la habilidad, el rango y su reparto, y "Ver ROL" que abre esa pestaña.
* **Files Modified**: `frontend/src/engine/statInsights.ts`, `frontend/src/engine/weaponAttackLines.ts`, `frontend/src/engine/medicineInfo.ts`, `frontend/src/features/martial/MartialMoveBoxes.tsx`, `frontend/src/engine/__tests__/sheetV560.test.ts`, `frontend/src/engine/__tests__/medicineInfo.test.ts` (nuevos); `features/sheet/StreetLabView.tsx`; `features/sheet/RoleAllocationPanel.tsx`; `features/netroles/NetAndRolesDeckView.tsx`; `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Desvío del plan**: Martial Arts usa un componente de cuadros de movimientos y no una tarjeta entera; el encabezado de cada forma (rango, chip, IP) queda como estaba.
* **Verificación**: tsc, 494 tests y build. En el navegador local, tamaño iPad: cuadros de Martial Arts en NET y DOJO; Insurance (Medtech) con "Ver ROL", las 18 heridas de Surgery, fármacos y Cryosystem; botones de 32 px; consola sin errores.

### [v5.5.0] - 2026-10-29 (Tienda del creador: detalle de cada ítem, ciberware por parte del cuerpo, disponibilidad, Rebuilds y vivienda) [Claude Code · 2026-10-29]
* **Category**: Creador de personajes / tienda (plan 21, `docs/plans/plan21-creador-tienda-ficha.md`, segunda de tres versiones).
* **What Changed**:
  * Detalle: tocar el nombre de un ítem abre un panel con su descripción y sus datos (armas: skill, daño, ROF, manos, cargador, Autofire y slots; armadura: SP y penalización, Core pp.96-97; ciberware: ubicación, instalación y HL; drogas: efecto, adicción y DV, Core p.227; programas: ATK/DEF/REZ), su categoría de precio y su libro. Se compra desde ahí mismo.
  * Pestañas: el ciberware se separa por parte del cuerpo (Neuralware, Cyberoptics, Cyberaudio, Internal, External, Fashionware, Cyberlimbs, Borgware) y el equipo en "Cyberdecks y Hardware" y "Resto".
  * Disponibilidad: cada ítem muestra su categoría de precio (Core p.385); lo Expensive o más caro lleva ⚠ porque sin Fixer no se consigue. El interruptor "Sin Fixer: pagar el doble" duplica esos precios (CEMK p.26). Si hay compras así y el interruptor está apagado, el resumen avisa sin bloquear (decisión de Giuliano).
  * Mejorar armas: cada arma a distancia comprada tiene "Mejorar" para ponerle accesorios del Core (3 slots, Core p.342) y, en 2077, convertirla a Power, Smart o Tech. La mejora suma su costo y llega a la ficha (`installedAttachments` y `rebuild2077`). Si la compra tenía varias unidades, la mejorada se separa.
  * Arreglo de datos: los Rebuilds costaban 500 €$ y ocupaban 1 o 2 slots; ahora cuestan 1.000 €$ (Very Expensive), ocupan 2 slots, valen para toda arma a distancia no exótica (Tech, menos lanzagranadas y lanzacohetes) y solo Smart choca con el Smartgun Link (CEMK pp.30-31). Sus textos siguen el libro (Smart pide Interface Plug o Subdermal Grip, no Neuroport).
  * Vivienda: se elige de la tabla de Core p.378 o se escribe una propia, y el estilo de vida de Core p.377. Muestra lo que se paga desde el mes que viene, sin descontar nada (el primer mes viene pagado, Core p.105), y queda en las notas de la ficha.
* **Files Modified**: `frontend/src/features/creator/steps/ShopItemDetail.tsx`, `frontend/src/data/creation/housingOptions.ts`, `frontend/src/engine/__tests__/creatorV550.test.ts` (nuevos); `features/creator/steps/GearStep.tsx`; `engine/creatorShop.ts` (`priceTier`, `needsFixer`, `effectiveUnitCost`, `purchaseUnitCost`, `weaponModOptions`, `weaponModSlots`); `engine/characterCreation.ts` (`mods` en las compras, `noFixerDouble`, `housing`, `lifestyle`, aviso `expensive-no-fixer`); `data/weaponAttachmentsAndTechData.ts` (Rebuilds); `store/persistence.ts` (APP_VERSION); changelog in-app.
* **Verificación**: tsc, 483 tests y build. En el navegador local, tamaño iPad: detalle de la Heavy Pistol (3d6, ROF 2, 3 slots); comprarla y convertirla a Smart da 1.100 €$ y, con "pagar el doble", 2.100 €$; la pestaña Cyberoptics muestra solo ciberware de ojos; vivienda propia "Taller en Heywood" guardada en el borrador.

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
