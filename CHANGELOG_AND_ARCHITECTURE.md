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

## 🗺️ Current Real Tree on Disk (`v3.9.0 - Taller de Reconstrucción CEMK 2077, Gestor de Averías/EMP, Progresión de Rol 1-10, Motor de Descanso/Reparación y Filtro de Decluttering del HUD`)

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
│   │   │   └── weaponAndCyberwareTooltips.ts # Diccionario canónico de tooltips de armas, ciberware y municiones
│   │   ├── engine/
│   │   │   ├── characterEngine.ts        # Motor matemático: HP máx, humanidad, penalizadores
│   │   │   └── combatEngine.ts           # Motor de resolución: d10 explosivo, Xd6, doble 6 crítico
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
│   │   │   ├── datapacks/
│   │   │   │   └── DataPackManagerView.tsx # Gestor interactivo de paquetes .cprpack estilo COMP/CON
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

## 🔮 Roadmap y Evolución de Fases (Fases 4 y 5 Pendientes)

Las Fases 0, 1, 2 y 3 se encuentran **COMPLETADAS**. Los siguientes módulos representan las especificaciones para las fases subsiguientes. **Ningún componente debe intentar importarlos mientras no existan en disco**:

### Fase 2 (v2.6 – v2.9): Disparos Apuntados, Creador Guiado, Biblioteca de Enemigos, Compendio y Expansión PDF [COMPLETADO]
* Selector Interactivo de Disparos Apuntados (`CombatHudView.tsx` & `combatEngine.ts`):
  - Penalizador canónico `-8`, restricción ROF 1, Cabeza (`×2` daño penetrante), Pierna (`Broken Leg -4 MOVE`), Objeto Sostenido (`Disarm`).
* Creador de Personajes Guiado Desde Cero (`src/features/creator/CharacterCreatorWizard.tsx`):
  - 3 métodos oficiales (*Streetrat*, *Edgerunner*, *Complete Package*) + plantillas 2077 (*CEMK*).
  - Lifepath híbrido (tirada de dados o redacción libre) con módulo detallado de Enemigos.
  - Economía inicial (`2,550 €$` + `800 €$` moda), paquetes por Rol y toggle opcional "Empezar con Deuda / Vender el Alma".
  - Onboarding para novatos con hover tooltips explicativos en STATs, habilidades y conceptos de reglas.
* Biblioteca Masiva de Enemigos y Jefes para el GM (`src/features/gm/EnemiesCompendiumPanel.tsx`):
  - Fichas pregeneradas listas para combate: Core Mooks/Lieutenants/Bosses, Hardened variants, Danger Gal Dossier, Tales of the RED, CEMK 2077, ciberpsicópatas y Adam Smasher.
  - Filtros por facción (Arasaka, Militech, Maelstrom, Tyger Claws, etc.), amenaza y era con inyección en 1 clic al combate.
* Compendio Dedicado para Reglas Nuevas de Expansiones (`src/features/compendium/CompendiumView.tsx` & `src/data/expansionRulesData.ts`):
  - Full Body Conversions (FBC) de *Interface RED Vol 3*, Reglas Era 2077 de *CEMK* (Neuroport, armas Power/Tech/Smart, Ciberpsicosis), DLCs (*Hornet's Pharmacy*).
  - Descripciones contextuales e introductorias de lore y mecánicas en cada sistema.
* Filtro de Libro Origen (`sourceBook`), Badges Visuales y Sinopsis de Manual (`src/features/compendium/CompendiumView.tsx`):
  - Filtro interactivo por manual con sinopsis de contenido y badges temáticos.
* Extracción e integración de `data/black-chrome.cprpack.json`:
  - 170+ ítems de lujo, vehículos con SDP y armas exóticas.
* Extracción e integración de `data/cemk-2077.cprpack.json`:
  - Reglas 2077 (Edgerunners Mission Kit): Neuroport integrado, armas Power/Tech/Smart y ciberpsicosis.
* Extracción e integración de `data/danger-gal.cprpack.json` & `data/interface-red.cprpack.json`.

### Fase 3 (v3.0 – v3.5): Sistemas Profundos, Oneshot Oficial & Companion App [COMPLETADO]
* `src/features/netroles/NetAndRolesDeckView.tsx` & `src/data/netAndRolesData.ts`:
  - Simulador piso a piso de Arquitecturas de Red (Archivos, Nodos de Control, Black ICE).
  - Gestor de memoria RAM y software de hackeo en combate para la era 2077 (Quickhacks).
  - Habilidades de Rol Específicas: Solos (Combat Awareness), Medtechs (Farmacia/Cirugía/Criogenia), Techs (Maker), Nomads (Moto/Garaje).
* `src/features/oneshot/RedChromeCargoView.tsx` & `src/data/redChromeCargoData.ts`:
  - Centro de comando táctico interactivo para la aventura oficial Red Chrome Cargo CEMK 2077 (mapa del tren, grilla táctica de 4 vagones, Screamsheet original, 7 Edgerunners CEMK precargados, Mainframe NET de 5 pisos, botín y pago de Hornet).
* `src/features/docs/SystemChangelogAndDocsView.tsx` & `src/data/systemDocsAndChangelogData.ts`:
  - Portal in-app de documentación, registro interactivo de changelogs versión por versión (`v1.0.0` a `v3.5.0`), visor de inventario canónico y arquitectura técnica.
* Paridad y Superación de Funciones Premium de Cyberpunk RED Companion App:
  - Gestor táctico de encuentros y combate multiobjetivo con seguimiento dinámico de Mooks/Bosses e iniciativa en `CombatHudView.tsx` y `FixerDeckView.tsx`.
  - Seguimiento de vehículos, monturas, SDP, blindaje y maniobras en la pestaña Garaje de `NetAndRolesDeckView.tsx`.
  - Creador y simulador de Arquitecturas de Red personalizadas multietapa con exportación.
  - Exportación e importación universal (JSON / PDF imprimible estilo hoja oficial).
  - Consola Fixer enriquecida: notas de sesión secretas, generador de botín y registro cronológico.
* **Integración de Módulos Premium Companion App (Fase 3)**:
  - **`Going Metal` (FBC & Cyberware)**: 13 Cuerpos FBC (+6 chasis restantes sobre los 7 de Fase 2), 16 piezas de cyberware FBC, nuevo Linear Frame externo, nueva granada y conmutador interactivo FBC en Hoja de Personaje y Ripperdoc (`CyberwareRipperdocView.tsx`).
  - **`Cyberfists of Fury` (Artes Marciales Avanzadas)**: 23 nuevas formas de artes marciales y 46 movimientos especiales integrados en `CombatHudView.tsx` con evaluación de requisitos de STATs y DVs.
  - **`Danger Gal Dossier` (Facciones, NPCs & Tema)**: 118 PNJs oficiales en 15 facciones en `EnemiesCompendiumPanel.tsx`, flujo de creación de PNJs custom en `FixerDeckView.tsx`, tema visual "Danger Gal" y nuevos retratos de personajes oficiales.

### Fase 4 (v3.9.x – v4.0): GM Role Master Control Deck, Tracker de Iniciativa, Orquestación de Roles & Campaña
* **GM Role Master Control Deck (`GmRoleMasterControlState`)**:
  - Consola central para el Árbitro para orquestar y arbitrar en tiempo real las 10 Habilidades de Rol oficiales de Cyberpunk RED:
    - **Solo (Combat Awareness)**: Priorización de amenazas y bonificaciones de spotter en telemetría.
    - **Netrunner (Interface)**: Topología de arquitectura de red activa, seguimiento de pisos y nivel de alerta de Black ICE.
    - **Tech (Maker)**: Cronómetros y cálculo de DVs para Jury Rig, Field Upgrade, Fabrication e Invention.
    - **Medtech (Medicine)**: Seguimiento de lotes de síntesis de fármacos, crioterapia activa y días de terapia.
    - **Media (Credibility)**: Gestión de rumores, publicaciones en la Red y verificación de fuentes.
    - **Exec (Teamwork)**: Gestión de nóminas, lealtad y cobertura de operativos corporativos subordinados.
    - **Lawman (Backup)**: Tiempos de respuesta de refuerzos policiales y tiradas de radio de auxilio.
    - **Fixer (Operator)**: Arbitraje de disponibilidad de mercados negros, contactos y márgenes de regateo.
    - **Nomad (Moto)**: Mantenimiento de vehículos del clan, mejoras mecánicas y soporte de convoy.
    - **Rockerboy (Charismatic Impact)**: Tamaño de audiencia, categoría del local y economía de favores de fans.
* **Tracker Táctico de Iniciativa de Combate**:
  - Secuencia de turnos multiobjetivo con inserción fluida de PNJs desde el catálogo de 44 enemigos base y 118 operativos de *Danger Gal Dossier*.
* **Generador de Encuentros & Peligros Ambientales**:
  - Tablas de calor urbano por distrito de Night City y condiciones climáticas extremas (lluvia ácida, smog tóxico, tormenta electromagnética).
* **Gestor de Economía y Campaña**:
  - Registro de deudas, alquileres mensuales (Container, Cube, Studio, Penthouse) y estilo de vida (Core pg. 377).
* `src/components/MiniVTT.tsx`:
  - Rejilla táctil 2x2m con obstáculos y regla de distancia en metros vinculada a tabla de DVs.
* `src/components/HomebrewBuilderModal.tsx`:
  - Creador universal de armas, drogas y ciberware casero con algoritmo de conversión 2020 a RED.
* `src/utils/sfx.ts` & `src/utils/vfx.ts`:
  - Audio sintetizado táctil para disparos, recargas, zumbidos de Sandevistan y efectos visuales de glitch/herida.
* **Integración de Módulos Premium Companion App (Fase 4)**:
  - **`Night City 2045` (Atlas Interactivo & Cartografía Urbana)**: Mapa interactivo en SVG/Canvas, 25 distritos buscables, 700+ ubicaciones con filtros por categoría, 73 facciones buscables con guaridas georreferenciadas, 112 nuevos PNJs de distrito, 130 ganchos de trama (plot hooks) y creador de ubicaciones personalizadas (Custom Locations).
  - **`Solo of Fortune` (Armaduras de Poder ACPA & Arsenal Militar)**: Tipo de armadura ACPA (*Assisted Combat Personnel Armor*) y Constructor Personalizado de ACPA (*Custom ACPA Builder*), 10 modelos ACPA equipables, 13 nuevas armas, 8 accesorios de armas, 15 tablas de rango dedicadas, 12 municiones y explosivos, 3 sets de blindaje y 10 piezas de equipo.

### 💎 Índice de Módulos Premium por Nombre (Paridad Companion App)
> Especificaciones derivadas directamente de las capturas de la Companion App oficial. Este índice mantiene el desglose por pack independiente y deja preparado el espacio para las próximas capturas enviadas por el usuario.

* **1. `GOING METAL` (Full Body Conversions Completo)**:
  - *(Nota: En Fase 2 ya se implementó la sección explicativa "About FBCs", la Biovaina y los primeros 7 cuerpos FBC).*
  - **13 Cuerpos FBC (`13 FBC Bodies`)**: Añadir los 6 chasis FBC restantes para llegar a los 13 oficiales.
  - **16 Nuevas Piezas de Cyberware FBC (`16 New Pieces of Cyberware`)**: Implantes exclusivos y adaptados para cuerpos cyborg.
  - **Nuevo Linear Frame Externo (`New External Linear Frame`)** y **Nuevo Tipo de Granada (`New Grenade Type`)**.
  - **Modo Interactivo FBC en Hoja de Personaje y Ripperdoc**: Conmutador para transformar un personaje activo en Full Body Conversion aplicando automáticamente sus reglas de chasis intercambiable, inmunidades y cálculo de Humanidad/Reparación.
* **2. `NIGHT CITY 2045` (Atlas Interactivo, Distritos, Facciones y Plot Hooks)**:
  - **Mapa Interactivo de Night City 2045 (`Interactive Map of Night City`)** en SVG/Canvas.
  - **25 Distritos Buscables (`25 Searchable Districts`)** y **700+ Ubicaciones Buscables (`700+ Searchable Locations`)** con filtros por tipo (*Médico, Transporte, Night Markets, Corporativo, Ripperdocs, Bares, etc.*).
  - **73 Facciones Buscables (`73 Searchable Factions`)** asociadas a sus guaridas y zonas de influencia directamente en el mapa interactivo.
  - **112 Nuevos PNJs de Distrito (`112 New NPCs`)** vinculados a su distrito correspondiente.
  - **130 Ganchos de Trama / Misiones (`130 Plot Hooks`)** para inspirar a GMs y jugadores.
  - **Ubicaciones Personalizadas (`Custom Locations`)**: Capacidad de añadir ubicaciones propias al mapa interactivo y compartirlas/hacerlas buscables para los jugadores de la sesión.
* **3. `CYBERFISTS OF FURY` (Artes Marciales Completas — *Interface RED Vol. 4*)**:
  - **23 Nuevas Formas/Estilos de Artes Marciales (`23 New Martial Art Forms`)** (además de Aikido, Karate, Judo y Taekwondo del Core Book).
  - **46 Nuevos Movimientos Especiales de Artes Marciales (`46 New Martial Art Moves`)** integrados en el HUD de Combate para ejecutar llaves, golpes especiales y combos con sus requisitos de STATS y DVs.
* **4. `SOLO OF FORTUNE` (Armaduras de Poder ACPA & Arsenal Pesado)**:
  - **Tipo de Armadura ACPA (`ACPA Armor Type` — *Assisted Combat Personnel Armor*)** y **Constructor Personalizado de ACPA (`Custom ACPA Builder`)**.
  - **10 Modelos de ACPA (`10 ACPAs`)** listos para equipar y pilotar.
  - **13 Nuevas Armas (`13 New Weapons`)**, **8 Nuevos Accesorios de Armas (`8 New Weapon Attachments`)** y **15 Nuevas Tablas de Rango de Armas (`15 New Weapon Range Tables`)**.
  - **12 Nuevas Municiones y Explosivos (`12 New Ammunition & Explosives`)**, **3 Nuevos Sets de Armadura (`3 New Armor Sets`)** y **10 Nuevas Piezas de Equipo (`10 New Pieces of Gear`)**.
* **5. `DANGER GAL DOSSIER` (Expansión Completa de Facciones, Creador de NPCs y Tema Visual)**:
  - *(Nota: En Fase 2 ya se integró una primera tanda de operativos y armas de Danger Gal).*
  - **Completar los 118 PNJs Oficiales (`118 New NPCs`)** distribuidos en las **15 Facciones (`15 Factions`)**.
  - **Nuevo Flujo de Creación de PNJs Personalizados (`New Workflow for Custom NPCs`)** para el Director de Juego.
  - **Tema Visual "Danger Gal" (`Danger Gal Theme`)** seleccionable en la interfaz y **Retratos de Personajes (`New Character Portraits`)**.
* **[Espacio Reservado para Próximos Módulos Premium]**:
  - *(Ranuras preparadas para capturas adicionales: Black Chrome Packs, Interface RED Vol. 1-2 Packs, etc.)*

### Fase 5 (v4.0): Auditoría Integral del Sistema (UI, Mecánicas y Revisión de ~60 PDFs)
* Guía de Verificación y Checklist de Auditoría Oficial contra reglas de R. Talsorian Games.
* Paseo Interactivo Funcional de la Interfaz (Live UI/Functional Walkthrough) en todas las vistas principales.
* Auditoría Exhaustiva Manual por Manual (~60 PDFs oficiales y DLCs) verificando completitud, balanceo canónico y erratas.

---

## 📜 Master Version Changelog

### [v3.9.0] - 2026-10-19 (CEMK 2077 Weapon Rebuild Workshop, EMP Cyberware Manager, Role Rank 1-10 Progression, Resting & Armor Repair, Combat Clutter Filter)
* **Category**: Weapon Rebuild Engine, EMP/Malfunction Systems, Role Progression, Natural Healing & Combat Ergonomics
* **Files Modified**:
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
  - `AI_CONTEXT_HANDOFF.md`
* **What Changed**:
  1. **Taller Interactivo de Reconstrucción de Armas CEMK 2077 (`convertWeaponRebuild2077`)**:
     - Conversión táctica bidireccional de armas clásicas 2045 en sus análogos tecnológicos 2077 (*Smart, Tech, Power*) con cálculo de coste de conversión y sincronización reactiva en el inventario activo.
     - Soportado e integrado tanto en `StreetLabView.tsx` (Arsenal) como en `CombatHudView.tsx` (Estación En Mano y Cinturón Táctico).
  2. **Toggles Tácticos de Combate 2077 en Tiempo Real**:
     - Modificadores interactivos integrados en el HUD de combate:
       - **Smart Cover Bypass**: -4 a las tiradas del defensor para intentar esquivar o refugiarse tras cobertura frente a armas guiadas inteligentes.
       - **Power Ricochet**: -4 a la tirada de ataque para ejecutar disparos calculados de rebote balístico en esquinas y paredes.
       - **Tech Charge Shot**: Ignora un 50% de SP adicional de blindaje mediante pulso electromagnético concentrado antes de evaluar penetración.
  3. **Gestor de Malfunciones & Pulso Electromagnético (EMP) en Ciberware (`toggleEmpDisableCyberware`, `clearAllEmpDisabledCyberware`)**:
     - Protocolo de resistencia ante ataques EMP con tirada canónica `TECH + Cybertech + 1d10 vs DV 15` y registro de telemetría militar.
     - Desactivación y encendido selectivo de implantes afectados con insignia de alerta visual `⚡ EMP OFF`, anulando dinámicamente sus bonificaciones a estadísticas y habilidades.
     - Botón de Reinicio Maestro (`Reboot Todo`) para restaurar la totalidad de sistemas cibernéticos tras mantenimiento.
  4. **Pestaña Táctica de Progresión de Habilidad de Rol Rango 1-10 (`StreetLabView.tsx`)**:
     - Selector directo de Rango 1 a 10 con actualización reactiva de metadatos de ficha (`updateCharacterMeta({ roleRank })`).
     - Despliegue de fichas completas de los 10 roles oficiales con estadística asociada, resumen mecánico canónico, fórmulas de tirada y árbol de progresión multinivel (`ROLE_ABILITIES_COMPLETE_PROGRESSION`) destacando rangos activos, desbloqueados y bloqueados.
  5. **Motor de Descanso Natural & Reparación de Blindaje (Core Rulebook pp. 140, 222-223)**:
     - Descanso y Sanación: Selector rápido de días de reposo (1, 3, 7 días), multiplicador de Anticuerpos Mejorados (×2) y Cámara Criogénica (+BODY/día) ejecutando la acción `restAndHealDays`.
     - Matriz de Reparación de Blindaje: Control táctico para Cabeza y Torso con opciones de parche rápido (-1 punto de daño de SP) o restauración completa (`repairCharacterArmor`), acompañado de la tabla oficial de DV de Tech y tiempos reglamentarios.
  6. **Filtro de Decluttering en Bandeja Derecha del HUD de Combate (`disabledRightModules`)**:
     - Selector desplegable de visibilidad con persistencia local (`cpr_combat_disabled_right_modules_v1`) para silenciar o mostrar selectivamente cualquiera de los 7 módulos secundarios del HUD.
     - Modo atenuado con conmutador individual `Eye`/`EyeOff` por tarjeta para maximizar la concentración en combate táctico.

### [v3.8.0] - 2026-10-19 (Weapons, Cyberware & Ammo Tooltips Engine, 2077 Rebuild System & Collapsible Martial Arts Deck)
* **Category**: Weapons, Cyberware & Ammo Tooltips Engine, 2077 Rebuild System & Collapsible Martial Arts Deck
* **Files Modified**:
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/roles/NetAndRolesDeckView.tsx`
  - `frontend/src/features/compendium/CompendiumView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
* **What Changed**:
  1. **Motor Táctico de Tooltips para Armas y Subclases Canónicas (`weaponAndCyberwareTooltips.ts`)**:
     - Detección reactiva y automática de subclases de armamento (Power Weapons, Tech Weapons, Smart Weapons, Armas Exóticas, Melée Pesada y Armas de Asta).
     - Despliegue de tooltips militares tácticos con explicación detallada de mecánicas de penetración, daño, modos de disparo, reducción de cobertura y reglas oficiales de combate.
  2. **Sistema de Insignias y Reglas para Armas CEMK 2077 Reconstruidas (`rebuildBadge` & `rebuildTooltip`)**:
     - Identificación e integración de insignias doradas tácticas para armas CEMK 2077 adaptadas de bases clásicas 2045 (ej. *Malorian Arms 3516*, *Arasaka Tamayura*, *Budget Arms Carnage*, *Militech Crusher*, *Militech Achilles*).
     - Visualización del origen de reconstrucción y advertencias tácticas de compatibilidad balística en StreetLabView, CombatHudView y CompendiumView.
  3. **Barra Táctica y Selector Rápido de 10 Tipos de Munición Canónica**:
     - Selector rápido en tiempo real para 10 municiones oficiales: *Basic*, *Armor-Piercing (AP)*, *Expansive*, *Incendiary*, *Smart*, *Rubber*, *EMP*, *Biotoxin*, *Poison* y *Sleep*.
     - Actualización instantánea de la munición activa en el store del personaje (`setWeaponAmmoType`).
     - Tooltips contextuales interactivos con daño, efectos de estado, ablación de SP y coste por caja de unidades.
  4. **Tooltips Anatómicos y Clínicos de Ciberware**:
     - Categorización táctica universal por ranura y tipo de instalación: *Neuroport 2077*, *Neuralware*, *Cyberoptics*, *Cyberaudio*, *Cyberarm*, *Cyberleg*, *Internal Cyberware*, *External Cyberware* y *Borgware*.
     - Resumen in-situ de costo de Humanidad (HL) y nivel clínico de instalación requerida (Mall, Clinic, Hospital).
  5. **Rediseño Ergonómico de las 27 Formas de Artes Marciales a Cartas Colapsables**:
     - Conversión completa de las 27 disciplinas marciales (*Core Rulebook* y *Cyberfists of Fury / Interface RED Vol 4*) a formato de tarjetas colapsables ultracompactas.
     - Cabecera plegada limpia y estandarizada: `Nombre • Stats (DEX x2 • ROF 2 • 50% SP • Nvl X) • Fuente (Core Rulebook / Cyberfists of Fury)`.
     - Implementado de forma unificada en `StreetLabView.tsx` (Dojo & Estilos Activos), `CombatHudView.tsx` (Modal Dojo) y `NetAndRolesDeckView.tsx` (Catálogo Maestro).
  6. **Espacio de Trabajo de Combate Limpio al Iniciar Sesión**:
     - Migración de clave de persistencia del HUD a `cpr_combat_active_center_v3` inicializando por defecto con centro despejado para máxima claridad táctica.

### [v3.7.0] - 2026-10-18 (CEMK 2077 Folio Premades Roster, 28-Page Canonical Skills & Red Chrome Cargo Hub)
* **Category**: CEMK 2077 Folio Premades Roster, 28-Page Canonical Skills & Red Chrome Cargo Hub
* **Files Modified**:
  - `frontend/src/data/cemkFolioPremadesData.ts`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/oneshot/RedChromeCargoView.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
* **What Changed**:
  1. **Conversión 100% Canónica de los 7 Folios Oficiales CEMK 2077 (28 Páginas)**:
     - Conversión estricta de las 28 páginas oficiales de `CEMK-Edgerunners-Character-Folios-Letter_2024-05-22.pdf`.
     - 7 personajes listos para combate: Hardpoint (Solo), Wrench (Nomad), Connect (Fixer), Bluescreen/Scribe (Netrunner), Insurance/Retro (Medtech), Thorn/Bullseye (Rockerboy) y Maven/Slider (Tech).
     - Matriz de 66 habilidades canónicas por personaje con fórmula matemática canónica `LVL Entrenado + Valor STAT = BASE Canónica`.
     - Armamento 2077 completo (Arasaka Masamune, Malorian Arms 3516, Mantis Blades, Gorilla Arms, Smart Weapons, Tech Weapons) y cromo de grado militar (Moore Tech Berserk, Sandevistan, Cyberware suite universal Neuroport 2077).
     - Inclusión de los 7 tokens oficiales en `public/tokens/cemk/`.
  2. **Persistencia y Sincronización en `useCharacterStore`**:
     - `DEFAULT_CHARACTERS` ahora incluye los 7 Folios oficiales, el personaje canónico V y los 7 Edgerunners de la tripulación del anime.
     - Implementación de `syncOrRestoreCemkFolioCharacters()` para restablecer los folios canónicos al estado de fábrica sin alterar personajes personalizados creados por el usuario en `localStorage`.
     - Fusión automática en `persist.merge` garantizando que cualquier usuario existente reciba los folios canónicos de inmediato.
  3. **Pestaña 4 en Red Chrome Cargo (`4. 👥 PREMADES 2077`)**:
     - Selector de roster dual: `📋 ROSTER OFICIAL CEMK FOLIOS (7 PJs)` vs `🎬 BANDA DEL ANIME (7 PJs)`.
     - Tarjetas tácticas completas con avatar/token oficial, badges de HP, SP Cabeza/Torso, Humanidad, Eurodólares, 10 STATS, armas en mano y ciberimplantes.
     - Botón de 1-click para seleccionar personaje activo (`🎮 JUGAR CON ESTE PJ`).
     - Modal de Dossier de 66 habilidades con buscador reactivo, filtros rápidos por STAT y visualización de biografía/trasfondo canónico.
  4. **Dossier Canónico Desplegable en `StreetLabView`**:
     - Visualización del token oficial del personaje folio en el avatar de cabecera con badge `📋 FOLIO`.
     - Acordeón prominente `📋 DOSSIER OFICIAL CEMK FOLIO (4 PÁGINAS: 66 SKILLS CANÓNICAS, REGLAS DE ROL & ARSENAL 2077)` con 4 pestañas interactivas: 66 skills canónicas, reglas de rol 2077, arsenal/cromo 2077 y biografía canónica completa.

### [v3.6.1] - 2026-10-18 (Resizable Telemetry Window & 3-Zone Right Tactical Module Dock with Bidirectional Drag & Drop)
* **Category**: Combat HUD Ergonomics, Window Resizing & Modular Workspace Customization
* **Files Modified**:
  - `frontend/src/features/combat/CombatHudView.tsx`
* **What Changed**:
  1. **Consola de Telemetría Redimensionable como Ventana Real**:
     - Tirador interactivo de esquina inferior derecha (`Resize Handle`) para estirar o achicar libremente el ancho (`260px–900px`) y alto (`110px–780px`) de la consola.
     - Presets rápidos de tamaño con 1 clic (`[XS] 300px`, `[S] 380px`, `[M] 500px`, `[L] 660px`) y ajuste fino incremental `[-10%]/[+10%]`.
     - Modo ultra-compacto adaptativo automático al achicar la consola por debajo de 380px para evitar desbordes.
     - Posicionamiento libre bidimensional `{x, y}` con arrastre de barra de título en modo Ventana Flotante (`🪟 Flotante`).
     - Conmutador `⚡ Auto-abrir`: opción para evitar que la ventana se des-colapse sola tras una tirada si el usuario decidió deliberadamente minimizarla.
  2. **Layout Táctico de 3 Zonas con Bandeja Lateral Derecha (`🗂️ MÓDULOS TÁCTICOS`)**:
     - Nueva columna derecha dedicada donde residen todas las cajas tácticas desacopladas individualmente (`📡 Telemetría`, `🔫 Armas En Mano`, `📏 Telémetro DV`, `🎒 Cartuchera/Arsenal`, `🥋 Artes Marciales`, `⚡ Quickhacks 2077`, `🎭 Habilidad de Rol` + controles de soporte izquierdo).
     - **Drag & Drop Bidireccional Total**: Arrastre fluido de cualquier caja entre la bandeja derecha y el espacio de trabajo central, o reordenación vertical mediante drag handles táctiles.
     - Botones de acción directa: `[ ➕ Al Centro ]` para desplegar en el área de combate activa y `[ ➡️ Guardar en Derecha ]` para despejar el centro.
     - Modo de vista previa rápida in-situ `[ 👁️ Abrir aquí ]` directamente en la bandeja derecha para consultar datos sin saturar el centro.
     - **5 Presets Tácticos de Configuración Inmediata en 1 Clic**:
       - `🎯 Esencial Tiro`: Despliega solo Armas En Mano y Telémetro DV.
       - `🥋 Melee/Dojo`: Despliega Armas En Mano y Artes Marciales.
       - `⚡ Netrunner 2077`: Despliega Quickhacks 2077 y Telemetría.
       - `🌌 Todo al Centro`: Abre y despliega todos los módulos simultáneamente.
       - `🧹 Limpiar Centro`: Mueve todos los módulos a la bandeja derecha para máxima visibilidad.

---

### [v3.6.0] - 2026-10-18 (Dedicated Quickhacks 2077 Interface Unlocking Zone & Martial Arts Dojo / IP / Skill Chip System)
* **Category**: Combat Telemetry, Netrunning 2077, Martial Arts Engine & Skill Chip Progression
* **Files Modified**:
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/netroles/NetAndRolesDeckView.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/data/cyberfistsMartialArtsData.ts`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/types/cyberpunk.ts`
* **What Changed**:
  1. **Zona Dedicada, Plegable y Arrastrable de Quickhacks 2077 (`quickhacks2077`)**:
     - Nuevo panel flotante/arrastrable independiente en `CombatHudView.tsx` y `NetAndRolesDeckView.tsx` para lanzar hackeos rápidos sin saturar la consola central.
     - **Desbloqueo Automático Escalonado por Rango de Interface**:
       - *Rango 1+*: Quickhacks Simples (`Simple [DV 6]`: Reboot Optics, Weapon Glitch).
       - *Rango 2-3+*: Quickhacks Estándar (`Standard [DV 8]`: Short Circuit, Overheat, Cyberware Malfunction).
       - *Rango 4-6+*: Quickhacks Difíciles (`Difficult [DV 10]`: Memory Wipe, Synapse Burnout).
       - *Rango 7+*: Quickhacks Avanzados (`Advanced [DV 12]`: Suicide, Cyberpsychosis).
     - Incorporación en pantalla de la guía oficial completa de reglas de Quickhacking (`QUICKHACKING_OFFICIAL_RULES_GUIDE` del CEMK 2077).
  2. **Sistema Integral de Adquisición, Entrenamiento (IP) y Chipware de Artes Marciales**:
     - Nueva pestaña `🥋 DOJO & IP` en `StreetLabView.tsx` para entrenar estilos marciales mediante Puntos de Mejora (`IP`), equipar *Skill Chips Nivel 3* o adquirir licencias en el dojo.
     - **Filtrado Estricto en Combate**: `CombatHudView.tsx` y `NetAndRolesDeckView.tsx` ahora muestran únicamente los estilos de combate que el edgerunner ha aprendido orgánicamente o equipado mediante Chipware en su zócalo neural.
     - Inclusión del manual oficial completo de artes marciales extraído de los PDFs (`MARTIAL_ARTS_OFFICIAL_MANUAL_TEXT` de *Interface RED Vol. 4*), detallando los requisitos de STATs, DVs y efectos de las 23 disciplinas y 46 movimientos especiales.

### [v3.6.2] - 2026-10-18 (Combat HUD Ergonomics, Visual SP/SDP Plates, Damage Calculator & Workspace Sizing)
* **Category**: Combat HUD Ergonomics, Visual SP/SDP Matrix, Damage Calculator & Workspace Layout
* **Files Modified / Created**:
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `PROJECT_STATUS_AND_ROADMAP.md`
* **What Changed**:
  1. **Placas de Blindaje Visuales e Interactivas (SP Plates)**:
     - Cuadrícula de insignias tácticas (`🛡️` intactas vs `💥` ablacionadas) para Cabeza y Torso (hasta 20 placas) con click directo para fijar el SP exacto.
     - Botones de acción rápida para ablación (-1 SP) y reparación inmediata al SP máximo.
  2. **Rastreador de SDP para Escudos y Coberturas**:
     - Monitor estructural dedicado de Puntos de Daño Estructural (SDP) persistido en `localStorage` (`cpr_shield_cover_sdp_v1`).
     - Presets oficiales: Escudo Antibalas (10 SDP), Cobertura Madera/Puerta (15 SDP), Cobertura Vehículo/Metal (25 SDP) y Cobertura Muro de Acero (35 SDP).
     - Representación gráfica de placas (`🔰/💥`), reparación en 1 clic y botones de incremento/decremento (-5, -1, +1, +5).
  3. **Calculadora Táctica de Daño, SP y SDP en Tiempo Real**:
     - Selector de daño entrante bruto mediante teclado o presets rápidos (`[5, 8, 10, 12, 15, 18, 22, 25]`).
     - Selector de objetivo: Escudo/Cobertura (`shield`), Torso (`body`), Cabeza (`head` con daño penetrante ×2).
     - Tipos de ataque: Estándar (100% SP, -1 SP), Perforante AP (100% SP, -2 SP), Melee (50% SP, -1 SP), Artes Marciales (50% SP, -1 SP), Brawling (100% SP, -1 SP) y Directo (0% SP, 0 ablación).
     - Modificadores: Herida Crítica (+5 HP directo) y transferencia táctica opcional de daño excedente a Torso tras destrucción del escudo.
     - Previsualización reactiva y dictamen de reglas, con botón de ejecución en 1 clic que aplica el daño y registra la telemetría en el log.
  4. **Acordeón de Reglas Oficiales de Blindaje CP RED**:
     - Guía interactiva desplegable integrada explicando las mecánicas del Core Rulebook pp. 183-187 (ablación, disparos a la cabeza, melee vs brawling, SDP vs SP y heridas críticas).
  5. **Controles de Ergonomía del Workspace y Auto-Expansión**:
     - Selector de ancho para la columna izquierda (3 Cols, 4 Cols, 5 Cols) con reajuste dinámico de la columna central para totalizar siempre 12 columnas en el grid de Tailwind.
     - Controles de altura en cabeceras de todos los paneles izquierdos: `[ S ]` (160px), `[ M ]` (280px), `[ L ]` (480px), `[ ↕ Todo ]` (sin límite) y botones `[-]` / `[+]`.
     - Grip de arrastre vertical con ratón (`Resize Grip 📏`) en el borde inferior de cada tarjeta del panel izquierdo.
     - Auto-expansión inteligente con badge `🔓 Auto-expandido ({count})` cuando la lista de heridas, implantes o consumibles supera 3 elementos.

---

### [v3.5.0] - 2026-10-18 (In-App System Codex, Interactive Changelog & Documentation Portal + 10/10 Markdown Docs Sync)
* **Category**: System Codex, In-App Interactive Documentation & Comprehensive Docs Synchronization
* **Files Modified / Created**:
  - `frontend/src/data/systemDocsAndChangelogData.ts`
  - `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`
  - `frontend/src/features/layout/TopHudBar.tsx`
  - `frontend/src/App.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md`
  - `CONTENT_CHECKLIST.md`
  - `README.md`
  - `frontend/README.md`
* **What Changed**:
  1. **Portal Interactivo de Documentación, Changelogs e Inventario In-App (`SystemChangelogAndDocsView.tsx` & `systemDocsAndChangelogData.ts`)**:
     - Nueva pestaña oficial en el TopHudBar (`📜 DOCS & CHANGELOG`) para consultar toda la documentación arquitectónica, inventario de mecánicas y registro histórico sin salir del navegador.
     - **Vista de Historial de Versiones**: Visor interactivo y filtrable de todas las versiones desde `v1.0.0` hasta `v3.5.0` con desglose por categoría, fecha, archivos afectados y listas de cambios.
     - **Inventario Canónico de Contenido**: Resumen en vivo de los 391+ ítems oficiales, 8 sistemas de reglas de expansiones, 44+ enemigos y 118 PNJs de Danger Gal Dossier, 23 artes marciales con 46 movimientos, 13 cuerpos FBC y 16 ciberwares de *Going Metal*.
     - **Visualizador de Arquitectura Técnica**: Esquema interactivo de dependencias (Zustand Stores, Motores desacoplados `characterEngine`/`combatEngine`, Flujo COMP/CON y Árbol real del proyecto).
     - **Estado del Roadmap en Vivo**: Monitoreo de fases completadas (Fases 0 a 3 + Oneshot) y detalle de especificaciones para Fases 4 y 5.
  2. **Consolidación y Auditoría 10/10 de la Documentación Markdown del Repositorio**:
     - Sincronización total entre `CHANGELOG_AND_ARCHITECTURE.md`, `CONTENT_CHECKLIST.md`, `README.md` y `frontend/README.md`.
     - Actualización del árbol real de disco reflejando `public/hammerhead-map.png`, `public/screamsheet-p2.png`, `systemDocsAndChangelogData.ts` y `SystemChangelogAndDocsView.tsx`.
     - Alineación definitiva de componentes consolidados en todas las fases del Roadmap (`CharacterCreatorWizard.tsx`, `EnemiesCompendiumPanel.tsx`, `NetAndRolesDeckView.tsx`, `RedChromeCargoView.tsx`, `SystemChangelogAndDocsView.tsx`).
     - Creación de la guía técnica del Frontend en `frontend/README.md` documentando la arquitectura `React 19 + TypeScript 5.8 + Vite 6 + Tailwind v4 + Zustand 5`.
     - Actualización del `README.md` raíz con enlace al despliegue web en vivo (`https://notefuk.github.io/Cyberpunk-/`), resumen de las 9 pestañas del sistema, guía de arranque local y flujo de despliegue.

---

### [v3.4.5] - 2026-10-17 (Oneshot Command Center: RED CHROME CARGO [CEMK 2077 Edition] + Precarga de los 7 Edgerunners CEMK)
* **Category**: Official Adventure Engine, Oneshot Operations & Roster Automation
* **Files Modified / Created**:
  - `frontend/src/data/redChromeCargoData.ts`
  - `frontend/src/features/oneshot/RedChromeCargoView.tsx`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/gm/FixerDeckView.tsx`
  - `frontend/src/data/enemiesCatalog.ts`
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/App.tsx`
* **What Changed**:
  1. **Centro de Comando Táctico para Oneshot `RED CHROME CARGO` (`RedChromeCargoView.tsx` & `redChromeCargoData.ts`)**:
     - Adaptación oficial completa de la aventura canónica de *Cyberpunk Edgerunners Mission Kit (CEMK 2077)*.
     - **Diagrama Táctico Interactivo del Tren Maglev "Hammerhead"**: Plano esquemático vectorizado de los 5 vagones (*Locomotora, Vagón de Tropas/Seguridad, Contenedor Criogénico de Alto Secreto, Vagón de Pasajeros/Personal y Vagón de Cola*) con telemetría de compuertas, terminales de acceso, puntos de inserción y alarmas.
     - **Secuenciador de Fases de Misión**: Guía paso a paso para el GM y la crew (*Briefing de Falco/Maine, Inserción Táctica, Brecha de Seguridad, Hackeo de la Red del Tren, Huida con el Contenedor y Enfrentamiento con Militech*).
     - **Terminales de Red & Ciberseguridad Integrada**: Nodos de red del tren con DVs de Interfaz/Quickhacks para abrir puertas estancas, anular torretas automatizadas y sabotear frenos electromagnéticos.
     - **Generador de Encuentros & Inyección Directa en 1 Clic**: Spawneo instantáneo de patrullas de Militech y drones de combate directo al tracker de iniciativa y al HUD de combate.
  2. **Precarga Automática de la Banda Completa de Edgerunners CEMK (`useCharacterStore.ts`)**:
     - Incorporación directa en el store de los 7 personajes pregenerados oficiales de la serie de anime y el Mission Kit: **David Martinez, Lucy, Rebecca, Maine, Kiwi, Falco y Pilar**.
     - Cada personaje incluye sus estadísticas canónicas, inventario con armas icónicas (Lexington, Shotgun Carnage, Monowire, Malorian, etc.), blindaje corporal, cyberware de la era 2077 (Neuroport universal, Sandevistan, mantis blades, cyberóptica) y trasfondo del Lifepath.
  3. **Acceso Rápido Global en Barra Superior (`App.tsx`)**:
     - Nueva pestaña dedicada `🚂 RED CHROME CARGO` en el Top Hud Bar para alternar instantáneamente entre la hoja de personaje, combate, compendio y la consola de la misión.

---

### [v3.4.0] - 2026-10-17 (Cierre Completo de Fase 3: Netrunning 2045, Quickhacks 2077, 10 Roles Interactivos, Garaje de Vehículos SDP & Módulos Premium Going Metal, Cyberfists of Fury y Danger Gal Dossier)
* **Category**: Phase 3 Complete (Netrunning 2045, Quickhacking 2077, Role Abilities, Vehicle Tracker & Premium Expansions)
* **Files Modified / Created**:
  - `frontend/src/data/cyberfistsMartialArtsData.ts`
  - `frontend/src/data/goingMetalFbcData.ts`
  - `frontend/src/data/netAndRolesData.ts`
  - `frontend/src/features/netroles/NetAndRolesDeckView.tsx`
  - `frontend/src/data/enemiesCatalog.ts`
  - `data/core-rules.cprpack.json` & `frontend/src/data/core-rules.cprpack.json`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/cyberware/CyberwareRipperdocView.tsx`
  - `frontend/src/features/gm/FixerDeckView.tsx`
  - `frontend/src/features/gm/EnemiesCompendiumPanel.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/features/layout/TopHudBar.tsx`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/engine/characterEngine.ts`
  - `frontend/src/App.tsx`
* **What Changed**:
  1. **Simulador Táctico de Pisos de Red 2045 (`NetAndRolesDeckView.tsx` & `netAndRolesData.ts`)**:
     - Visualizador interactivo piso a piso de Arquitecturas de Red (Archivos DV, Nodos de Control, Contraseñas DV, Black ICE hostil y Demonios).
     - Contador dinámico de Acciones de Red (*Net Actions: 2..5*) basado en el Rango de Interfaz del Netrunner.
     - Combate en la Red contra Black ICE (Asp, Hellhound, Giant, Kraken, Raven, etc.) con simulación de rez/derez de programas atacantes y defensores (Sword, Banhammer, Armor, Flak, Shield).
     - Creador y simulador de Arquitecturas de Red personalizadas multietapa con exportación/guardado.
  2. **Sistema de Quickhacking Era 2077 (`NetAndRolesDeckView.tsx`)**:
     - Consola de hackeo inalámbrico en tiempo real mediante pool dinámico de RAM con recuperación reactiva.
     - Biblioteca completa de Quickhacks ofensivos y de control (Short Circuit, Cyberware Malfunction, Overheat, Reboot Optics, Weapon Glitch, Memory Wipe, Suicide, Cyberpsychosis) con cálculo de costes de RAM, rangos y tiradas de ataque Cyberdeck vs Defensa objetivo.
  3. **Estación de Habilidades de Rol Interactivas para los 10 Roles Oficiales**:
     - Paneles dedicados con modificadores en vivo, calculadoras y tiradas en 1 clic:
       - **Solo**: *Combat Awareness* con reparto interactivo de puntos a Iniciativa, Faded, Percepción Dañina y Esquiva.
       - **Medtech**: *Medicine* con especialización en Cirugía (reparación de extremidades y órganos), Criogenia y Farmacia (creación de Speedheal, Stim y fármacos avanzados).
       - **Tech**: *Maker* con subdisciplinas de Reparación de Campo, Fabricación, Modificación e Ingeniería inversa.
       - **Nomad**: *Moto* con selección de vehículos de flota y mejoras mecánicas.
       - **Rockerboy**: *Charismatic Impact* (afinidad de masas e influencia social).
       - **Netrunner**: *Interface* (telemetría de cyberdeck y virus).
       - **Fixer**: *Operator* (redes de contactos, regateo de precios y acceso al Night Market).
       - **Media**: *Credibility* (publicación de noticias, credibilidad y scoops).
       - **Exec**: *Teamwork* (cobertura corporativa, subordinados y beneficios de lujo).
       - **Lawman**: *Backup* (llamada táctica por radio de refuerzos según el nivel de amenaza).
  4. **Gestor de Vehículos y Monturas con SDP & Persecución (`StreetLabView.tsx` & `useCharacterStore.ts`)**:
     - Pestaña de Garaje / Vehículos con seguimiento de SDP (*Structural Damage Points*), blindaje corporal/lunas, asientos, armas montadas, estado funcional (Operativo, Dañado, Crítico, Destruido) y modificadores de maniobras de persecución.
  5. **Integración Completa del Módulo Premium `GOING METAL`**:
     - Catálogo exhaustivo de los 13 Cuerpos FBC canónicos de *Interface RED Vol. 3* (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.).
     - 16 nuevas piezas de ciberware FBC especializadas, nuevo Linear Frame externo y nuevo tipo de granada.
     - Conmutador FBC interactivo en `CyberwareRipperdocView.tsx` y `StreetLabView.tsx` para transformar edgerunners en Full Body Conversions con chasis intercambiable, inmunidades de borgware y recálculo automático de Humanidad/Reparación.
  6. **Integración Completa del Módulo Premium `CYBERFISTS OF FURY`**:
     - 23 formas y estilos marciales avanzados de *Interface RED Vol. 4* sumadas a las 4 canónicas del Core Rulebook.
     - 46 movimientos especiales de artes marciales en `CombatHudView.tsx` con verificación de requisitos de STATs, habilidades y DVs para llaves, proyecciones y combos devastadores.
  7. **Integración Completa del Módulo Premium `DANGER GAL DOSSIER`**:
     - Bestiario ampliado a 118 PNJs oficiales en sus 15 facciones en `EnemiesCompendiumPanel.tsx`.
     - Flujo de creación de PNJs personalizados (*Custom NPC Creator*) en `FixerDeckView.tsx`.
     - Tema visual "Danger Gal" (neón rosa/magenta/negro) y retratos de personajes oficiales.
  8. **Cierre Oficial de Fase 3**: Todas las metas y dependencias arquitectónicas de la Fase 3 y los módulos premium de paridad quedan 100% integrados y verificados.

---

### [v2.9.0] - 2026-10-17 (Cierre Completo de Fase 2: Ataques Apuntados, Biblioteca de 44 Enemigos/Jefes, Compendio Doble de 8 Sistemas FBC/2077 & Catálogo Multi-Libro de 368 Ítems)
* **Category**: Phase 2 Complete (Aimed Shots, NPC Bestiary, Multi-Book Compendium & Expansion Systems)
* **Files Modified / Created**:
  - `data/core-rules.cprpack.json` & `frontend/src/data/core-rules.cprpack.json`
  - `frontend/src/data/enemiesCatalog.ts`
  - `frontend/src/data/expansionRulesData.ts`
  - `frontend/src/engine/combatEngine.ts`
  - `frontend/src/features/combat/CombatHudView.tsx`
  - `frontend/src/features/compendium/CompendiumView.tsx`
  - `frontend/src/features/gm/EnemiesCompendiumPanel.tsx`
  - `frontend/src/features/gm/FixerDeckView.tsx`
  - `frontend/src/features/packs/DataPacksView.tsx`
  - `frontend/src/features/rules/RulesCheatSheetDrawer.tsx`
  - `frontend/src/store/useCombatStore.ts`
  - `frontend/src/types/cyberpunk.ts`
  - `scripts/extract_core_pack.py`
* **What Changed**:
  1. **Disparos y Golpes Apuntados Interactivos (`Aimed Shots`)**:
     - Selector táctico integrado en `CombatHudView.tsx` y resolución matemática en `combatEngine.ts`.
     - Aplica el penalizador reglamentario de `-8` a la tirada de ataque y restringe automáticamente la cadencia a ROF 1 (desactivando ráfagas o dobles ataques).
     - Automatización de efectos por localización:
       - **Cabeza**: El daño penetrante (daño que supere el `SP`) se multiplica `×2` directamente a HP.
       - **Pierna**: Aplica automáticamente la Herida Crítica oficial de *Pierna Rota* (`Broken Leg`: `-4 MOVE`, mínimo 1).
       - **Objeto Sostenido (Held Item)**: Provoca Desarme forzado (`Disarm`) con mensaje contextual en el log de combate.
  2. **Biblioteca Táctica de 44 Enemigos, Goons y Jefes (`enemiesCatalog.ts` & `EnemiesCompendiumPanel.tsx`)**:
     - Catálogo maestro de 44 fichas completas clasificadas por nivel de amenaza (*Mook, Lieutenant, Boss*) y facciones (*Arasaka, Militech, Maelstrom, Tyger Claws, Bozos, 6th Street, NCPD, MaxTac, Inceptores/Ciberpsicópatas y Leyendas como Adam Smasher*).
     - Incluye perfiles canónicos de Core Book, Hardened Variants, Danger Gal Dossier, Tales of the RED y CEMK 2077.
     - Pestaña interactiva de Bestiario en la Consola Fixer (`FixerDeckView.tsx`) con filtros por facción, búsqueda en tiempo real, desglose de estadísticas de combate, armas, blindaje, habilidades y botón de inyección directa al tracker de combate en 1 clic.
  3. **Compendio de 8 Nuevos Sistemas de Reglas de Expansiones (`expansionRulesData.ts`)**:
     - Documentación exhaustiva con sinopsis de lore, desglose mecánico, reglas paso a paso y tablas de referencia para 8 sistemas mayores:
       - *Full Body Conversions (FBC)* de *Interface RED Vol 3* (cuerpos ciborg, biovainas, blindaje estructural y humanidad).
       - *Neuroport Universal 2077* de *CEMK 2077* (los 7 subsistemas gratuitos, Chyrons y vulnerabilidad a hackeo).
       - *Armas 2077 (Power, Tech, Smart)* con mecánicas de rebote, perforación de cobertura y seguimiento autónomo.
       - *Ciberpsicosis & Estrés 2077* (escalas de degradación mental y episodios psicóticos).
       - *Hornet's Pharmacy* (aditivos químicos, dispersión osmótica y fármacos experimentales).
       - *Drogas Callejeras & Adicciones* (tabla de abstinencia, sobredosis y tolerancia).
       - *Vehículos y Combate Motorizado* (SDP, puntos de daño estructural y maniobras).
       - *Salvamento Náutico & Buceo Táctico*.
     - Acceso dual: disponible como pestaña dedicada en `RulesCheatSheetDrawer.tsx` y en el Compendio Maestro.
  4. **Catálogo Maestro Multi-Libro de 368 Ítems & Selector con Sinopsis (`core-rules.cprpack.json` & `CompendiumView.tsx`)**:
     - Expansión del catálogo canónico de 272 a 368 ítems (+96 ítems de *Black Chrome*, *CEMK 2077*, *Interface RED* y *Danger Gal Dossier*).
     - Filtro interactivo multi-libro por manual fuente (`sourceBook`) con insignias visuales distintivas.
     - Banner y drawer desplegable con la sinopsis contextual, aportes de ambientación y novedades mecánicas de cada libro oficial.
  5. **Cierre Oficial de Fase 2**: Todos los objetivos planificados para la Fase 2 (v2.6 – v2.9) quedan completamente implementados, verificados y operando en vivo.

---

### [v2.6.0] - 2026-10-17 (Guided 6-Step Character Creator Wizard, 2045/2077 CEMK Pregens, Hybrid Lifepath & Selling Out Debt System)
* **Category**: Character Creation Engine, Onboarding Wizard, Lifepath & Economy
* **Files Modified / Created**:
  - `frontend/src/data/characterCreationData.ts`
  - `frontend/src/features/creator/CharacterCreatorWizard.tsx`
  - `frontend/src/features/sheet/StreetLabView.tsx`
  - `frontend/src/store/useCharacterStore.ts`
  - `frontend/src/types/cyberpunk.ts`
  - `frontend/src/App.tsx`
* **What Changed**:
  1. **Catálogo Canónico Maestro de Creación (`characterCreationData.ts`)**:
     - Soporte completo de eras: **2045 Clásico** vs **2077 CEMK** (con los 7 subsistemas canónicos integrados gratuitos del `Neuroport`: *Chyron HUD, Subdermal Pocket, Neuralware, Interface Plugs, Virtu/Holophone, Biomonitor y Personal Link*).
     - Las 3 metodologías oficiales del Core Rulebook: *Streetrat* (plantillas rápidas con STATs fijas por Rol), *Edgerunner* (tiradas 1d10 en tablas de stats por Rol) y *Complete Package* (reparto de 62/66/70/75/80 puntos de STATs + 86 puntos de Skills con las 13 Basic Skills reglamentarias preasignadas).
     - `STAT_TOOLTIPS` para novatos explicando el impacto mecánico de cada una de las 10 estadísticas en lenguaje claro.
     - Paquetes de armas, armaduras y equipo por cada uno de los 10 Roles oficiales.
     - Tablas completas de Lifepath Core: origen cultural, estilo personal, ropa, valores, sentimientos, persona más querida, posesión más preciada, trasfondo familiar, entorno de crianza, amigos, amantes trágicos y **Enemigos en 4D** (quién, qué causó la enemistad, recursos/alianzas y plan de venganza).
     - Lifepath especializado por cada uno de los 10 Roles (territorios de Rockerboy, jerarquías Solo, contratos Netrunner, etc.).
     - Sistema de Deuda / "Vender el Alma" (*Selling Out*, Core p. 118): pactos con Corporaciones, Fixers o Sindicatos del Crimen otorgando bono inicial (+1,000 €$, ciberware de grado militar o equipo avanzado) a cambio de una deuda financiera o lealtad forzada con intereses.
     - 17 plantillas pregeneradas completas: 7 Edgerunners oficiales de CEMK 2077 (David Martinez, Lucy, Rebecca, Maine, Kiwi, Falco, Dorio), 6 arquetipos icónicos de 2045 (Solo Merc, Street Netrunner, Combat Tech, Rocker Rebel, Nomad Wheelman, Medtech Sawbones) y 4 plantillas de rivales/enemigos.
  2. **Asistente Guiado de 6 Pasos (`CharacterCreatorWizard.tsx`)**:
     - Stepper táctico militar: `1. ERA & MÉTODO` ➔ `2. ROL & CONCEPTO` ➔ `3. ESTADÍSTICAS (STATS)` ➔ `4. HABILIDADES (SKILLS)` ➔ `5. TIENDA & DEUDA` ➔ `6. LIFEPATH & BIO`.
     - Modo híbrido total: tirada automática `1d10` con animación de dados o personalización y edición manual en cada campo.
     - Tienda integrada en paso 5: presupuesto oficial de `2,550 €$` para equipo + `800 €$` exclusivos para Moda/Estilo de Vida + bonificaciones de Deuda seleccionada, con compra directa y control de saldo en vivo.
     - Carga de plantillas pregeneradas o paquetes de Rol con 1 solo clic.
  3. **Integración en Street Lab, Bio & Navegación Global (`StreetLabView.tsx` & `App.tsx`)**:
     - Hover tooltips tácticos en cada una de las 10 STATS en la barra de Street Lab.
     - Nueva pestaña `BIO, LIFEPATH & DEUDA` en Street Lab con visor completo del trasfondo, lista de enemigos y caja de control de Deuda con amortización en Eurodólares (`payOffCharacterDebt`).
     - Botón y pestaña global `CREAR PJ // WIZARD` en la barra superior del Omni-Deck para iniciar el asistente en cualquier momento.

---

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
