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
│   │   │   ├── rangeTables.ts            # Matrices oficiales de DVs por metro y Autofire
│   │   │   └── rulesCheatSheet.ts        # Machete canónico de reglas de combate, coberturas y asfixia
│   │   ├── engine/
│   │   │   ├── characterEngine.ts        # Motor matemático: HP máx, humanidad, penalizadores
│   │   │   └── combatEngine.ts           # Motor de resolución: d10 explosivo, Xd6, doble 6 crítico
│   │   ├── features/
│   │   │   ├── combat/
│   │   │   │   └── CombatHudView.tsx     # HUD de combate táctico, selector de DVs y dados
│   │   │   ├── compendium/
│   │   │   │   └── CompendiumView.tsx    # Compendio modular de 8 categorías con equipamiento
│   │   │   ├── cyberware/
│   │   │   │   └── CyberwareRipperdocView.tsx # Menú Ripperdoc 2077 con maniquí holográfico y ranuras
│   │   │   ├── gm/
│   │   │   │   └── FixerDeckView.tsx     # Consola GM Fixer con PIN, control global y monitor del equipo
│   │   │   ├── layout/
│   │   │   │   └── TopHudBar.tsx         # Barra superior persistente con vitals del edgerunner
│   │   │   ├── packs/
│   │   │   │   └── DataPacksView.tsx     # Gestor de paquetes .cprpack estilo COMP/CON
│   │   │   ├── rules/
│   │   │   │   └── RulesCheatSheetDrawer.tsx # Drawer táctico deslizable con machete de reglas de mesa
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
└── CONTENT_CHECKLIST.md                  # Checklist de cobertura de reglas por fases y versiones
```

---

## 🔮 Roadmap Pendiente (Fases 2 a 5 - NO IMPORTAR HASTA CREAR)

Los siguientes módulos son especificaciones de diseño para fases posteriores (Fase 0 y Fase 1 completadas). **Ningún componente debe intentar importarlos mientras no existan en disco**:

### Fase 2 (v2.6 – v2.9): Disparos Apuntados, Creador Guiado, Biblioteca de Enemigos, Compendio y Expansión PDF
* Selector Interactivo de Disparos Apuntados (`CombatHudView.tsx` & `combatEngine.ts`):
  - Penalizador canónico `-8`, restricción ROF 1, Cabeza (`×2` daño penetrante), Pierna (`Broken Leg -4 MOVE`), Objeto Sostenido (`Disarm`).
* Creador de Personajes Guiado Desde Cero (`src/features/creation/CharacterWizardModal.tsx`):
  - 3 métodos oficiales (*Streetrat*, *Edgerunner*, *Complete Package*) + plantillas 2077 (*CEMK*).
  - Lifepath híbrido (tirada de dados o redacción libre) con módulo detallado de Enemigos.
  - Economía inicial (`2,550 €$` + `800 €$` moda), paquetes por Rol y toggle opcional "Empezar con Deuda / Vender el Alma".
  - Onboarding para novatos con hover tooltips explicativos en STATs, habilidades y conceptos de reglas.
* Biblioteca Masiva de Enemigos y Jefes para el GM (`src/features/enemies/EnemiesCompendiumDrawer.tsx`):
  - Fichas pregeneradas listas para combate: Core Mooks/Lieutenants/Bosses, Hardened variants, Danger Gal Dossier, Tales of the RED, CEMK 2077, ciberpsicópatas y Adam Smasher.
  - Filtros por facción (Arasaka, Militech, Maelstrom, Tyger Claws, etc.), amenaza y era con inyección en 1 clic al combate.
* Compendio Dedicado para Reglas Nuevas de Expansiones (`src/features/rules/ExpansionRulesView.tsx`):
  - Full Body Conversions (FBC) de *Interface RED Vol 3*, Reglas Era 2077 de *CEMK* (Neuroport, armas Power/Tech/Smart, Ciberpsicosis), DLCs (*Hornet's Pharmacy*).
  - Descripciones contextuales e introductorias de lore y mecánicas en cada sistema.
* Filtro de Libro Origen (`sourceBook`), Badges Visuales y Sinopsis de Manual (`src/components/SourceBadge.tsx` & `CompendiumView.tsx`):
  - Filtro interactivo por manual con sinopsis de contenido y badges temáticos.
* Extracción e integración de `data/black-chrome.cprpack.json`:
  - 170+ ítems de lujo, vehículos con SDP y armas exóticas.
* Extracción e integración de `data/cemk-2077.cprpack.json`:
  - Reglas 2077 (Edgerunners Mission Kit): Neuroport integrado, armas Power/Tech/Smart y ciberpsicosis.
* Extracción e integración de `data/danger-gal.cprpack.json` & `data/interface-red.cprpack.json`.

### Fase 3 (v3.0 – v3.4): Sistemas Profundos & Funciones Premium Companion App
* `src/components/NetArchitectureRunner.tsx`:
  - Simulador piso a piso de Arquitecturas de Red (Archivos, Nodos de Control, Black ICE).
* `src/features/quickhacks/QuickhacksDeck.tsx`:
  - Gestor de memoria RAM y software de hackeo en combate para la era 2077.
* Habilidades de Rol Específicas:
  - Solos (Combat Awareness), Medtechs (Farmacia/Cirugía/Criogenia), Techs (Maker), Nomads (Moto).
* Paridad y Superación de Funciones Premium de Cyberpunk RED Companion App:
  - `src/features/combat/EncounterManager.tsx`: Gestor táctico de encuentros y combate multiobjetivo con seguimiento dinámico de Mooks/Bosses e iniciativa.
  - `src/features/vehicles/VehicleTracker.tsx`: Seguimiento de vehículos, monturas, SDP, blindaje y maniobras.
  - Creador y simulador de Arquitecturas de Red personalizadas multietapa con exportación.
  - Exportación e importación universal (JSON / PDF imprimible estilo hoja oficial).
  - Consola Fixer enriquecida: notas de sesión secretas, generador de botín y registro cronológico.

### Fase 4 (v3.5 – v3.9): VTT Táctico, Clima, Homebrew y Audio/VFX
* `src/components/MiniVTT.tsx`:
  - Rejilla táctil 2x2m con obstáculos y regla de distancia en metros vinculada a tabla de DVs.
* Generador de Condiciones Atmosféricas y Clima de Night City (Lluvia ácida, smog rojo, calor radiactivo).
* `src/components/HomebrewBuilderModal.tsx`:
  - Creador universal de armas, drogas y ciberware casero con algoritmo de conversión 2020 a RED.
* `src/utils/sfx.ts` & `src/utils/vfx.ts`:
  - Audio sintetizado táctil para disparos, recargas, zumbidos de Sandevistan y efectos visuales de glitch/herida.

### Fase 5 (v4.0): Auditoría Integral del Sistema (UI, Mecánicas y Revisión de ~60 PDFs)
* Guía de Verificación y Checklist de Auditoría Oficial contra reglas de R. Talsorian Games.
* Paseo Interactivo Funcional de la Interfaz (Live UI/Functional Walkthrough) en todas las vistas principales.
* Auditoría Exhaustiva Manual por Manual (~60 PDFs oficiales y DLCs) verificando completitud, balanceo canónico y erratas.

---

## 📜 Master Version Changelog

### [v2.5.0] - 2026-10-17 (Sprint 1 Complete: Right-Edge Rules Cheat Sheet Drawer, Situational Encumbrance & Full Fixer Deck GM Console)
* **Category**: Tabletop Utilities, Rules Engine, Economy & Master GM Operations (Sprint 1 Complete)
* **Files Modified / Created**:
  - `frontend/src/data/rulesCheatSheet.ts`
  - `frontend/src/features/rules/RulesCheatSheetDrawer.tsx`
  - `frontend/src/features/gm/FixerDeckView.tsx`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/App.tsx`
* **What Changed**:
  1. **Machete de Reglas Canónico Flotante (`RulesCheatSheetDrawer.tsx` & `rulesCheatSheet.ts`)**: Drawer lateral persistente accesible desde la pestaña vertical derecha en cualquier pantalla del Omni-Deck. Agrupa en 6 categorías filtrables (`Acciones de Combate`, `Grapple & Asfixia`, `Cobertura & Objetos`, `Trauma & Heridas`, `Peligros Ambientales` y `Matriz de DVs`) con búsqueda en tiempo real, fórmulas exactas del Core Rulebook y tiradas de dados integradas.
  2. **Reglas Situacionales de Sobrepeso (Encumbrance)**: Toggle táctico y cálculo automático según la regla oficial de Cyberpunk RED (`BODY * 10` ítems/lotes). Cuando el personaje supera su capacidad o activa la penalización situacional, se aplica un modificador dinámico de `-2 REF/DEX/MOVE` reflejado en la telemetría, Street Lab y HUD de combate.
  3. **Consola Central Fixer / Director de Juego (`FixerDeckView.tsx`)**: Nueva vista de control maestro para el GM protegida por PIN de seguridad (`0000` / configurable). Ofrece tablero de estado del equipo completo (HP, SP, Humanidad, Heridas Graves), inyector de daño o curación global rápida, distribuidor de Eurodólares (€$) o recompensas de Gig, y bitácora de eventos de la sesión.

---

### [v2.4.0] - 2026-10-17 (Cyberpunk 2077-Style CYBERWARE // RIPPERDOC Tab & Anatomical Hologram)
* **Category**: Deep Systems, Cyberware Ergonomics & 2077 Ripperdoc Interface
* **Files Modified / Created**:
  - `frontend/src/features/cyberware/CyberwareRipperdocView.tsx`
  - `frontend/src/App.tsx`
  - `frontend/src/store/useCharacterStore.ts`
* **What Changed**:
  1. **Nueva Pestaña Táctica `CYBERWARE // RIPPERDOC`**: Implementada vista inmersiva completa inspirada en el menú de ciberware de Cyberpunk 2077.
  2. **Maniquí Anatómico Holográfico en A-Pose**: Silueta cibernética central en SVG interactivo con animaciones de escaneo, flechas conectoras direccionales hacia las 8 zonas corporales (`Cerebro / Neuralware`, `Ojos / Cyberoptics`, `Oído / Cyberaudio`, `Torso / Internal`, `Piel / External`, `Brazo Izquierdo`, `Brazo Derecho`, `Piernas`) más `Fashionware`.
  3. **Biometría & Telemetría en Tiempo Real**: Medidores verticales segmentados de Humanidad, Umbral de Ciberpsicosis (EMP pérdida) y Blindaje/Biometría en tiempo real.
  4. **Ranuras Estilo 2077 con Ilustraciones Vectoriales e Instalador Ripperdoc**: Cada categoría muestra slots dinámicos con arte vectorial para cada implante instalado, desinstalación con un clic y modal de instalación directa desde el catálogo de 96 implantes oficiales con tirada Xd6 de pérdida de humanidad.

---

### [v2.3.3] - 2026-10-17 (Collapsible Rangefinder & Tabbed In-Hand Weapon Station)
* **Category**: Combat HUD Ergonomics & Modular Weapon Telemetry
* **Files Modified**:
  - `frontend/src/features/combat/CombatHudView.tsx`
* **What Changed**:
  1. **Telémetro de Distancia Colapsable**: El panel de selector de distancia y DVs ahora es plegable con botón toggle y resumen de estado (distancia actual, DV activo y modificador), optimizando el espacio vertical del HUD de combate.
  2. **Estación de Armas "En Mano" con Pestañas Modulares y Plegables**: Cada arma equipada en mano cuenta con control de colapso independiente y un sistema de 4 sub-pestañas (`Munición & Cartuchos`, `Distancias DV & Fórmula`, `Autofire & Datos Técnicos`, `Ver Todo`), permitiendo consultar rápidamente el cargador táctico interactivo, la matriz de dificultad con bonos o los perfiles de ráfaga y munición sin saturar la pantalla.

---

### [v2.3.2] - 2026-10-16 (Tactical Rack Dropdowns & Strict Equipped/Charges Consumables)
* **Category**: Combat HUD Ergonomics & Inventory-Driven Charges
* **Files Modified**:
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
* **What Changed**:
  1. **Filtro Estricto por Ítems Equipados y Cargas (`quantity > 0`)**: Las secciones de Granadas/Arrojables y Drogas/Consumibles en el Rack Táctico derecho ya no muestran ningún ítem por defecto si el personaje no lo tiene equipado en su inventario con cargas disponibles (`quantity > 0`). Se incluyó un selector compacto `[ + EQUIPAR AL CINTURÓN ]` para añadir cargas cuando el personaje realmente adquiera/equipe el ítem.
  2. **Acordeones Limpios (Solo Nombre + Cargas cuando está cerrado)**: Cada granada, droga o arma del Rack Derecho muestra en su estado cerrado únicamente el nombre y el contador de cargas (`X CARGAS / DOSIS`); al hacer clic sobre la fila, despliega un dropdown con todos los datos técnicos, reglas, ajuste manual `[-] Cargas [+]` y botones de uso/lanzamiento que descuentan `-1 carga` real (desapareciendo al llegar a `0`).

---

### [v2.3.1] - 2026-10-16 (Tactical Bullet Cartridge Visualizer & Digital Ammo Readout)
* **Category**: Combat HUD Visual Telemetry
* **Files Modified**:
  - `frontend/src/features/combat/CombatHudView.tsx`
* **What Changed**:
  1. **Visualizador de Cartuchitos de Munición (`AmmoCartridgeVisualizer`)**: Reemplazada la barra de progreso simple por cartuchos individuales estilizados con ojiva superior y vaina rectangular para cada bala del cargador (`1..standardMag`). Los proyectiles cargados brillan según el estado del cargador (cian/ámbar/rojo pulsante en reserva baja) y los disparados quedan como casquillos vacíos oscuros; además cada cartucho es clicable para ajustar la munición directamente.
  2. **Contador Numérico Superior + Tira Mini en el Rack Derecho**: Lectura digital grande arriba de los cartuchos (`ACTUAL / MÁX` + `RESERVA`) en la Estación "En Mano", y mini-tira de rectángulos de munición en las tarjetas del Rack Táctico derecho.

---

### [v2.3.0] - 2026-10-16 (Active Combat Overhaul: Attack Rack, Ammo Reserve, Unarmed & Consumables)
* **Category**: Combat HUD Architecture, Ammo Telemetry & Unarmed/Consumables Engine
* **Files Modified**:
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
* **What Changed**:
  1. **Rack Táctico de Formas de Atacar en Columna Derecha (`CombatHudView.tsx`)**: Separado en 4 categorías filtrables (`🔫 Armas`, `🥊 Puños & Artes Marciales`, `💣 Arrojables & Granadas`, `💉 Drogas & Consumibles`), permitiendo activar o sacar cualquier arma/ataque de la Estación Central **"En Mano"** (`inHand`) con un clic.
  2. **Sistema Completo de Munición y Cargador**: Cada arma con cargador en mano muestra **Balas en Cargador (`actual / máx`)** con barra visual y ajuste fino `[-1/+1]`, **Balas en Reserva (`reserveAmmo`)** que se descuentan automáticamente al presionar `[ 🔄 RECARGAR ]` (con botones rápidos `[-10/+10/+30]`), y selector de **Tipo de Bala (`AMMO_TYPE_CATALOG`: Básica, AP, Incendiaria, Smart, Goma, Biotoxina, EMP, etc.)** con su regla especial en vivo.
  3. **Puños (`Brawling`), Artes Marciales (`Martial Arts`), Grapple y Choke**: Daño desarmado calculado dinámicamente según `BODY` (`1d6` a `4d6`), botones rápidos de **Grapple** y **Choke** (`= BODY` daño directo ignorando SP) en Brawling, y perforación del 50% de SP en Artes Marciales.
  4. **Granadas Arrojables y Drogas Activas en Combate**: Lanzamiento con `DEX + Athletics`, tiradas de daño explosivo (`6d6` / `4d6`), inyección de drogas con curación automática en `Speedheal` (`BODY + WILL`), monitor de **Drogas en Sangre** en el Biomonitor y tirada directa de resistencia a la adicción (`WILL + Resist Torture/Drugs vs DV`).

---

### [v2.2.1] - 2026-10-16 (Tactical Tooltips on ROF/SP/HL/MAG & Full-Card Expand Hitbox)
* **Category**: UX/UI Ergonomics & Rule Tooltips
* **Files Modified**:
  - `frontend/src/features/compendium/CompendiumView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
* **What Changed**:
  1. **Tooltips Tácticos Flotantes (`ROF`, `SP`, `HL`, `MAG`, `1H/2H`)**: Al pasar el mouse por encima de cualquier etiqueta de `ROF` (y siglas clave en Compendio, HUD de Combate y Street Lab), se despliega un popup explicando qué significa la sigla y cómo funciona mecánicamente en tu turno.
  2. **Zona Clicable en Toda la Tarjeta + Barra Inferior Ancha (`CompendiumView.tsx`)**: Todo el contenedor de cada tarjeta (`p-3.5`) y su barra inferior de lado a lado (`[ ▾ VER DETALLES Y REGLAS DEL ÍTEM ]` / `[ ▴ OCULTAR DETALLES ]`) actúan como área interactiva para desplegar los detalles sin necesidad de apuntar a un icono pequeño.

---

### [v2.2.0] - 2026-10-16 (Compendium Full-Detail Accordions & Eurodollar Purchase/Wallet System)
* **Category**: Economy Engine, Inventory & Interactive Compendium Accordions
* **Files Modified**:
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/compendium/CompendiumView.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
* **What Changed**:
  1. **Acordeones Reales Ultra-Compactos en Compendium (`CompendiumView.tsx`)**: Cerrados ocupan ~60px mostrando solo nombre, precio y 2-3 pills clave; al hacer clic en cualquier parte de la tarjeta (o fila en modo Tabla Densa), se despliega el panel completo con todas las reglas asociadas: tabla completa de 8 distancias DV con punto óptimo (`★`) y fila DV de Autofire en armas de fuego, regla de ignorar 50% SP en armas Melee, duración/efectos/DV de adicción en drogas, clínica/HL en cyberware y notas completas de armas exóticas.
  2. **Sistema de Compra (`€$` vs Gratis / Loot)**: Switch global en el Compendio (`[ 💳 COMPRAR (Gastar €$) ]` vs `[ 🎁 GRATIS / LOOT (0 €$) ]`) más botones individuales dentro de cada acordeón para descontar Eurodólares automáticamente del saldo del personaje o adquirir sin costo.
  3. **Mochila de Inventario y Billetera de Transacciones (`StreetLabView.tsx` & `useCharacterStore.ts`)**: Pestañas dedicadas en la columna derecha de `Street Lab` para gestionar cantidades de munición, drogas, accesorios y equipo comprado (`inventory`), más registro de cobros de Gigs (ej. pago de Falco) y bitácora de transacciones (`transactions`).

---

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
