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

* **1. `GOING METAL` (Auditoría de Paridad Completa — Full Body Conversions)**:
  - **✅ Ya Implementado (Fase 3)**:
    - **Addition of Full Body Conversions**: Arquitectura canónica de FBC con chasis desacoplado del cerebro orgánico.
    - **13 Cuerpos FBC (`13 FBC Bodies`)**: Los 13 chasis oficiales completos (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.).
    - **16 Nuevas Piezas de Cyberware FBC (`16 New Pieces of Cyberware`)**: Implantes exclusivos y adaptados para cuerpos cyborg.
    - **About FBCs Section**: Guía canónica de lore, protocolos de instalación y conversión en compendio.
    - **Modo Interactivo FBC en Hoja de Personaje y Ripperdoc**: Conmutador para transformar un personaje activo en Full Body Conversion aplicando automáticamente sus reglas de chasis intercambiable, inmunidades y cálculo de Humanidad/Reparación.
  - **⏳ Pendiente de Cierre Going Metal**:
    - **Verificar/añadir el `New External Linear Frame` específico**: Comprobar y dar de alta la variante canónica externa individualizada de Going Metal si no figura ya como Linear Frame independiente.
    - **Verificar/añadir el `New Grenade Type`**: Comprobar y dar de alta el tipo específico de granada de Going Metal (Laser/Chaff o variante especializada) en el catálogo de arrojables.
* **2. `NIGHT CITY 2045` (Interactive Atlas & Campaign Gazetteer — Planeado para Fase 5 / Premium Expansion)**:
  - **Interactive map of Night City**: Mapa interactivo de Night City en SVG/Canvas con controles de navegación táctica.
  - **700+ searchable Locations**: Más de 700 ubicaciones canónicas buscables con ficha detallada.
  - **25 searchable Districts**: 25 distritos buscables con límites territoriales georreferenciados.
  - **Ability to filter locations by medical, transportation, etc.**: Filtros por categoría de servicio (médico, transporte, armerías, Night Markets, corporativo, ripperdocs, etc.).
  - **73 searchable Factions, with their associated hangout locations on the interactive map**: 73 facciones buscables con guaridas y zonas de influencia desplegables en el mapa interactivo.
  - **112 new NPCs, each with their corresponding district**: 112 nuevos PNJs indexados y vinculados a su distrito territorial correspondiente.
  - **130 plot hooks to inspire GMs and players**: 130 ganchos narrativos y semillas de misiones listos para detonar en mesa.
  - **Interactive map automatically unlocks for your players while hosting an online session**: Desbloqueo automático del mapa interactivo para jugadores conectados en sesión remota/local.
  - **Ability to add your own custom locations to the interactive map**: Capacidad de dar de alta ubicaciones personalizadas (Custom Locations) con coordenadas y notas.
  - **Custom locations visible and searchable for players connected to online session**: Ubicaciones personalizadas visibles y buscables en tiempo real para los jugadores de la sesión.
* **3. `CYBERFISTS OF FURY` (Artes Marciales Completas — *Interface RED Vol. 4*)**:
  - **23 Nuevas Formas/Estilos de Artes Marciales (`23 New Martial Art Forms`)** (además de Aikido, Karate, Judo y Taekwondo del Core Book).
  - **46 Nuevos Movimientos Especiales de Artes Marciales (`46 New Martial Art Moves`)** integrados en el HUD de Combate para ejecutar llaves, golpes especiales y combos con sus requisitos de STATS y DVs.
* **4. `SOLO OF FORTUNE` (ACPA Power Armor & Heavy Ordinance Expansion — Planeado para Fase 5 / Premium Expansion)**:
  - **ACPA Armor Type (Assisted Combat Personnel Armor)**: Nuevo tipo canónico de armadura pesada asistida con reglas de integridad de chasis.
  - **Custom ACPA Builder**: Taller de ensamblaje modular para diseñar, configurar y costear armaduras de poder personalizadas.
  - **10 ACPAs**: 10 chasis oficiales completos de ACPA listos para equipar y pilotar.
  - **13 New Weapons**: 13 nuevas armas militares y pesadas de alto calibre.
  - **8 New Weapon Attachments**: 8 nuevos accesorios tácticos especializados para armamento ACPA y militar.
  - **15 New Weapon Range Tables**: 15 nuevas tablas y matrices de rango de combate por metro adaptadas a armamento pesado.
  - **12 New Ammunition & Explosives**: 12 tipos de municiones especiales, proyectiles pesados y explosivos de demolición.
  - **3 New Armor Sets**: 3 nuevos conjuntos de blindaje corporal táctico.
  - **10 New Pieces of Gear**: 10 nuevas piezas de equipo especializado para operadores pesados.
* **5. `DANGER GAL DOSSIER` (Expansión Completa de Facciones, Creador de NPCs y Tema Visual)**:
  - *(Nota: En Fase 2 ya se integró una primera tanda de operativos y armas de Danger Gal).*
  - **Completar los 118 PNJs Oficiales (`118 New NPCs`)** distribuidos en las **15 Facciones (`15 Factions`)**.
  - **Nuevo Flujo de Creación de PNJs Personalizados (`New Workflow for Custom NPCs`)** para el Director de Juego.
  - **Tema Visual "Danger Gal" (`Danger Gal Theme`)** seleccionable en la interfaz y **Retratos de Personajes (`New Character Portraits`)**.
* **6. `SETTINGS & MODULARIDAD GLOBAL` (Prender / Apagar Sistemas por Campaña o Personaje — Planeado para Fase 4 / Future Architecture)**:
  - **Modular System Switches**: Conmutadores reactivos en la configuración global de la aplicación y por personaje para habilitar o desactivar subsistemas completos:
    - *Full Body Conversions (Going Metal)*: Ocultación completa de biovainas y chasis FBC para mesas a nivel de calle orgánicas.
    - *Garaje & Vehículos Nómada*: Desactivación de la pestaña y mecánicas vehiculares si el personaje no dispone de transporte o la campaña es exclusivamente peatonal.
    - *Quickhacking & Cyberware CEMK 2077*: Aislamiento de software y ciberware 2077 para mesas con ambientación histórica estricta de la Era del Rojo (2045).
    - *Dojo de Artes Marciales*: Ocultación de las 27 disciplinas y 54 movimientos de Cyberfists of Fury si el edgerunner no utiliza combate marcial desarmado.
    - *Consola y Pisos de Netrunning*: Ocultación de la suite de ciberdecks y simulación de arquitectura de Red en mesas sin Netrunners activos.
* **[Espacio Reservado para Próximos Módulos Premium]**:
  - *(Ranuras preparadas para capturas adicionales: Black Chrome Packs, Interface RED Vol. 1-2 Packs, etc.)*

### Fase 5 (v4.0): Auditoría Integral del Sistema (UI, Mecánicas y Revisión de ~60 PDFs)
* Guía de Verificación y Checklist de Auditoría Oficial contra reglas de R. Talsorian Games.
* Paseo Interactivo Funcional de la Interfaz (Live UI/Functional Walkthrough) en todas las vistas principales.
* Auditoría Exhaustiva Manual por Manual (~60 PDFs oficiales y DLCs) verificando completitud, balanceo canónico y erratas.

---

## 📜 Master Version Changelog

### [v4.9.2] - 2026-10-23 (Roles de combate) [Claude Code · 2026-10-23]
* **Category**: Roles (plan 10 = v4.9.2 del plan 8, con las decisiones de Giuliano del 2026-10-22).
* **Datos**: `data/creation-src/cemk-critical-injuries.json` (RB p.13, 1d6, Quick Fix y Treatment estructurados) y `core-vehicles.json` (14 vehículos genéricos, Core pp. 189-191, con rango de Family Motorpool p.162, y 19 mejoras de Nomad pp. 163-165), generados a `data/creation/`.
* **Motor puro**: `engine/medicalRules.ts` (opciones de tratamiento por herida, estabilización Core p.222, Surgery solo Medtech, Treatment no a uno mismo, síntesis Core pp. 149-150, tirada CEMK 1d6), `engine/combatAwareness.ts` (Core p.146), `getInterfaceRank` y `medicalTechLevel` en `roleRules.ts`, `createInitialAttackRoll(..., { ignoreCriticalFailure })` para Fumble Recovery.
* **Stores**: `gameClockStore` (`cpr_game_clock_v1`: día, Beat, registro de Speedheal; "Nuevo día" vence los Quick Fix), `rulesSettingsStore` (`cpr_rules_settings_v1`: tabla de Críticas), Round en `useCombatStore`, acciones sobre cualquier ficha (`inflictSpecificInjury`, `applyQuickFix`, `applyTreatment`, `expireQuickFixes`, `stabilizeCharacter`, `adjustHpFor`, `spendEurodollarsFor`).
* **UI**: barra de Round, Iniciativa, Perception y reloj en el HUD; efectos del Solo; NET Actions y Quickhacks por rango y era; `CritTableSelector`; `MedtechTreatmentPanel` (en el HUD y en la sección Medtech); síntesis al Core; Speedheal con reloj; maniobra con Moto; Motorpool familiar y catálogo de vehículos del Core; Interface real en Red Chrome Cargo.
* **Correcciones canon**: Medical Tech = Pharmaceuticals + Cryosystem (Core p.150); Seriously Wounded = menos de la mitad (Core p.220); el d10 de Iniciativa no explota (Core pp. 126, 168). Discrepancia 20 decidida.
* **Lectura a confirmar con Giuliano**: Damage Deflection ("decrease the first damage you take this Round", Core p.146) se aplica después de la armadura, sobre el daño al HP.
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
