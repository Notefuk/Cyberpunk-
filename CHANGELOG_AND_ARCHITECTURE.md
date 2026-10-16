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

## 🗺️ Current Real Tree on Disk (`v2.0.0 - Phase 0 Overhaul`)

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
│   └── inspect_pdf_pages.py              # Inspector CLI UTF-8 de páginas por rango
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ItemVisualPlaceholder.tsx # Frames militares tácticos SVG/Lucide por categoría
│   │   ├── data/
│   │   │   ├── core-rules.cprpack.json   # Copia activa del catálogo para el frontend
│   │   │   ├── criticalInjuries.ts       # Tablas oficiales 2d6 de heridas críticas (Head/Body)
│   │   │   └── rangeTables.ts            # Matrices oficiales de DVs por metro y Autofire
│   │   ├── engine/
│   │   │   ├── characterEngine.ts        # Motor matemático: HP máx, humanidad, penalizadores
│   │   │   └── combatEngine.ts           # Motor de resolución: d10 explosivo, Xd6, doble 6 crítico
│   │   ├── features/
│   │   │   ├── combat/
│   │   │   │   └── CombatHudView.tsx     # HUD de combate táctico, selector de DVs y dados
│   │   │   ├── compendium/
│   │   │   │   └── CompendiumView.tsx    # Compendio modular de 8 categorías con equipamiento
│   │   │   ├── layout/
│   │   │   │   └── TopHudBar.tsx         # Barra superior persistente con vitals del edgerunner
│   │   │   ├── packs/
│   │   │   │   └── DataPacksView.tsx     # Gestor de paquetes .cprpack estilo COMP/CON
│   │   │   └── sheet/
│   │   │       └── StreetLabView.tsx     # Ficha completa, editor de stats y roster de personajes
│   │   ├── store/
│   │   │   ├── useCharacterStore.ts      # Store Zustand con persistencia (fichas, inventario, heridas)
│   │   │   └── useCombatStore.ts         # Store Zustand de combate (DVs, objetivos, logs de tiradas)
│   │   ├── types/
│   │   │   └── cyberpunk.ts              # Tipos de TypeScript canónicos de Cyberpunk RED
│   │   ├── App.tsx                       # Integrador de vistas principales del Omni-Deck
│   │   ├── index.css                     # Chamfered corner styles y tokens visuales de interfaz
│   │   └── main.tsx                      # Vite React entry point
│   ├── index.html                        # Google Fonts (Rajdhani, Inter, JetBrains Mono)
│   ├── package.json
│   └── vite.config.ts                    # Vite config con Tailwind CSS
├── CHANGELOG_AND_ARCHITECTURE.md         # ESTE DOCUMENTO
└── CONTENT_CHECKLIST.md                  # Checklist de cobertura de reglas por sprints
```

---

## 🔮 Roadmap Pendiente (Sprints 1 a 4 - NO IMPORTAR HASTA CREAR)

Los siguientes módulos son especificaciones de diseño para fases posteriores. **Ningún componente debe intentar importarlos mientras no existan en disco**:

### Sprint 1: Utilidades de Mesa & Economía
* `src/data/rulesCheatSheet.ts` & `src/components/RulesCheatSheetModal.tsx`:
  - Grappling, Choking (`BODY * 2` daño directo a HP), Coberturas con SP/HP destructibles.
* `src/features/inventory/InventoryManager.tsx`:
  - Cartera de Eurodólares (€$), peso de carga, gestión de munición comprada por lote de 10.
* `src/utils/storage.ts` & `src/utils/auth.ts`:
  - Bloqueo por PIN de Director de Juego (GM Lock) para ocultar tiradas y notas de campaña.

### Sprint 2: Expansión de Libros PDF (2045 vs 2077)
* Extracción e integración de `data/black-chrome.cprpack.json`:
  - 170+ ítems de lujo, vehículos con SDP y armas exóticas.
* Extracción e integración de `data/cemk-2077.cprpack.json`:
  - Reglas 2077 (Edgerunners Mission Kit): Neuroport integrado, armas Power/Tech/Smart y ciberpsicosis.
* Extracción e integración de `data/danger-gal.cprpack.json` & `data/interface-red.cprpack.json`.
* `src/components/SourceBadge.tsx`: Badges visuales por libro origen.

### Sprint 3: Sistemas Profundos
* `src/components/CyberwareMannequin.tsx`:
  - Maniquí anatómico 2077 con silueta interactiva y ranuras corporales.
* `src/components/NetArchitectureRunner.tsx`:
  - Simulador piso a piso de Arquitecturas de Red (Archivos, Nodos de Control, Black ICE).
* `src/features/quickhacks/QuickhacksDeck.tsx`:
  - Gestor de memoria RAM y software de hackeo en combate para la era 2077.

### Sprint 4: VTT, Audio & Homebrew
* `src/components/MiniVTT.tsx`:
  - Rejilla táctil 2x2m con obstáculos y regla de distancia en metros.
* `src/utils/sfx.ts` & `src/utils/vfx.ts`:
  - Audio sintetizado táctil para disparos, recargas y zumbidos de Sandevistan.
* `src/components/HomebrewBuilderModal.tsx`:
  - Creador de armas, drogas y ciberware casero con exportación JSON.

---

## 📜 Master Version Changelog

### [v2.1.0] - 2026-10-16 (UI Density Overhaul: Compact Street Lab & Low-Noise Compendium)
* **Category**: UX/UI High-Density Layout & Rule Examples Integration
* **Files Modified**:
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/compendium/CompendiumView.tsx`
* **What Changed**:
  1. **Street Lab Compact Dashboard**: Reestructurado en 3 zonas sin scroll excesivo: Barra de Identidad en 1 línea, Cinta Táctica Horizontal con los 10 STATS y 4 derivadas en fila única, y Dashboard en 2 Columnas Paralelas (`7 cols` para Habilidades filtrables por categoría + `5 cols` para Blindaje, Arsenal y Cyberware siempre visibles al lado).
  2. **Dropdowns de Ejemplos y DVs por Habilidad**: Ampliado `SKILL_METADATA` con resúmenes y 3 ejemplos con DVs oficiales del Core Rulebook para las 16 habilidades, desplegables al hacer clic en cada fila.
  3. **Compendium Low-Noise & Tabla Densa COMP/CON**: Tarjetas compactas (`p-2.5`) con tira horizontal adaptativa de píldoras (ocultando cargador/munición en armas Melee), notas discretas en 1 línea expandibles al hacer clic, botón `[+ Equipar]` integrado en cabecera, y nuevo selector de vista **`[ ☰ TABLA DENSA ]`** de 1 fila por ítem.

---

### [v2.0.0] - 2026-10-16 (Phase 0 Architectural Overhaul & Full Core Catalog)
* **Category**: Arquitectura Modular, Motor Matemático Real & Catálogo Completo
* **Files Modified / Created**:
  - `data/core-rules.cprpack.json` (EXPANDIDO a 272 ítems canónicos)
  - `frontend/src/data/core-rules.cprpack.json` (SINCRONIZADO)
  - `frontend/src/types/cyberpunk.ts` (CREADO - Tipos canónicos del sistema)
  - `frontend/src/engine/characterEngine.ts` (CREADO - Fórmulas de HP, humanidad, umbral de herida grave)
  - `frontend/src/engine/combatEngine.ts` (CREADO - Motor de combate real de 2 clics)
  - `frontend/src/store/useCharacterStore.ts` (CREADO - Store Zustand con persistencia)
  - `frontend/src/store/useCombatStore.ts` (CREADO - Store de combate y DVs)
  - `frontend/src/features/layout/TopHudBar.tsx` (CREADO - Barra de estado táctico)
  - `frontend/src/features/combat/CombatHudView.tsx` (CREADO - HUD de combate en 2 clics)
  - `frontend/src/features/sheet/StreetLabView.tsx` (CREADO - Ficha de personaje y editor de stats)
  - `frontend/src/features/compendium/CompendiumView.tsx` (CREADO - Compendio de 8 categorías con equipamiento)
  - `frontend/src/features/packs/DataPacksView.tsx` (CREADO - Gestor de paquetes .cprpack estilo COMP/CON)
  - `scripts/inspect_pdf_pages.py` (CREADO - Inspector CLI de páginas UTF-8)
  - `scripts/extract_core_pack.py` (ACTUALIZADO - Verificación real de páginas y extracción completa)
  - `.agent/skills/cpr-pdf-extractor/SKILL.md` (CREADO - Skill documentada para agentes de IA)
* **What Changed**:
  1. **Motor de Tirada en 2 Clics**: Separación estricta entre la Tirada de Ataque (`STAT + Skill + 1d10`, con explosión en 10 y pifia en 1) y la Tirada de Daño independiente (`Xd6`).
  2. **Regla Oficial de Críticos**: Dos o más dados con valor `6` en la tirada de daño provocan automáticamente una Herida Crítica oficial de la tabla 2d6 y añaden +5 de daño directo a los HP.
  3. **Ablación de Blindaje**: Si el daño supera el SP actual de la localización impactada, el exceso pasa a los HP y el SP se reduce en 1 punto (o 2 con Munición Perforante).
  4. **Modo Autofire y Supresivo**: Selector de Autofire que consume 10 balas, evalúa contra la tabla de DVs de Autofire y multiplica el daño de 2d6 por el margen de acierto (hasta el máximo permitido por el arma: x3 para SMG, x4 para Fusil de Asalto).
  5. **Catálogo Canónico Oficial Completo (272 ítems extraídos del Core v1.24)**:
     - **66 Armas**: Todas las armas cuerpo a cuerpo, a distancia estándar, marcas de calidad (Dai Lung, Militech, Arasaka, GunMart) y las 15 Armas Exóticas del manual (Malorian 3516, Kendachi Mono-Three, SlamDance Fang, Shrieker, Hurricane, etc.).
     - **10 Blindajes**: Leathers, Kevlar, Light Armorjack, Bodyweight Suit, Medium Armorjack, Heavy Armorjack, Flak, Metalgear, Bulletproof Shield, Radiation Suit.
     - **10 Accesorios de Armas**: Bayoneta, Cargador Tambor, Cargador Extendido, Lanzagranadas acoplado, Chasis pesado, Mira Nocturna IR, Escopeta acoplada, Enlace Smartgun, Mira de Francotirador, Silenciador.
     - **13 Tipos de Munición**: Básica, Perforante, Biotoxina, EMP, Expansiva, Granada Aturdidora, Incendiaria, Veneno, Goma, Sueño, Smart, Humo, Gas Lacrimógeno.
     - **96 Implantes de Ciberware**: Cobertura exhaustiva de las 7 categorías oficiales (Fashionware, Neuralware, Cyberoptics, Cyberaudio, Internal Body, External Body, Cyberlimbs y Borgware).
     - **9 Drogas Callejeras y Fármacos**: Black Lace, Blue Glass, Boost, Smash, Synthcoke, Timewarp, Rapidetox, Speedheal, Stim con sus efectos primarios, secundarios y DVs de adicción.
     - **41 Objetos de Equipo General**: Agent, Airhypo, Máscara anti-smog, Analizador químico, Cyberdecks, Gafas inteligentes, Traje de radiación, Herramientas técnicas, etc.
     - **27 Programas y Black ICE**: Boosters, Defenders, Attackers y Black ICE anti-programa y anti-personal.
  6. **Vistas Modulares Compendium & DataPacks**:
     - `CompendiumView`: Filtro dinámico de 8 categorías con botones táctiles para equipar armas en la ficha activa, blindar cabeza/cuerpo e instalar/desinstalar ciberware con recálculo automático de Humanidad y SP.
     - `DataPacksView`: Interfaz COMP/CON para inspeccionar el estado del paquete Core y vista previa de expansiones planeadas (Black Chrome, CEMK 2077, Danger Gal, Interface RED).

---

### [v1.2.0] - 2026-10-15
* **Category**: Visual Hierarchy & Rule Mechanics Expansion
* **Files Modified**:
  - `frontend/src/components/ItemVisualPlaceholder.tsx` (CREATED)
  - `frontend/src/data/criticalInjuries.ts` (CREATED)
  - `frontend/src/App.tsx`
* **What Changed**:
  1. Created `ItemVisualPlaceholder.tsx` con marcos militares tácticos.
  2. Implementación de tablas 2d6 de heridas críticas (Head/Body).
  3. Gestor de heridas interactivas con tratamiento y remoción.

---

### [v1.1.5] - 2026-10-15
* **Category**: Combat Mechanics & Range Engine
* **Files Modified**:
  - `frontend/src/data/rangeTables.ts` (CREATED)
* **What Changed**:
  1. Matrices de distancia de combate y tabla de DVs de disparo a distancia y Autofire.

---

### [v1.0.0] - 2026-10-15
* **Category**: Project Scaffolding & Initial Data Pipeline
* **Files Modified**:
  - `scripts/extract_core_pack.py` (CREATED)
  - `data/core-rules.cprpack.json` (CREATED)
