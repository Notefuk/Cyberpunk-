# CPR OMNI-DECK // AI Context Handoff & Technical Briefing

> **SYSTEM VERSION**: `v4.0.2 OPERATIVO`  
> **LAST UPDATED**: 2026-10-20  
> **STACK**: React 19 + TypeScript 5.8 + Vite + Tailwind CSS v4 + Zustand 5  
> **RULESET**: Cyberpunk RED Core Rulebook + CEMK 2077 + Interface RED Vol. 1-4 + Danger Gal Dossier  
> **ARCHITECTURE**: COMP/CON decoupled offline-first model. Single source of truth in typed registries and Zustand stores.

---

## 🎯 1. Purpose of this Document
This file is the official AI-to-AI handoff document for future LLMs, subagents, and orchestrators working on the **CPR Omni-Deck** repository. Whenever a new context window is initialized, read this file to immediately understand:
1. What was just built and verified in `v4.0.2` (and previously in `v4.0.1` / `v4.0.0` / `v3.9.0`).
2. Where all critical systems, stores, and data structures reside on disk.
3. How state transitions cascade across views without regressions.
4. The exact scope and technical contracts planned for future phases.

---

## 🚀 2. What Was Added in v4.0.2

### A. Quickhacking Canónico CEMK 2077 (Purga de RAM de Videojuego)
* **Files**: `netAndRolesData.ts`, `NetAndRolesDeckView.tsx`, `CombatHudView.tsx`, `RedChromeCargoView.tsx`.
* **Zero RAM Law**: En el TTRPG Cyberpunk Edgerunners Mission Kit (pp. 16-18, 26-28, 39, 42), la RAM del videojuego no existe. Todos los quickhacks cuestan **1 NET Action** en combate táctico (con un límite estricto de 1 quickhack por objetivo por Turno).
* **11 Quickhacks Oficiales de CEMK**:
  - **Simple (Interface 1+, DV 6)**: *Impair Movement* (-1 MOVE por 60s), *Sonic Shock* (condición Damaged Ear por 60s).
  - **Standard (Interface 2+, DV 8)**: *Overheat* (fuego térmico: 4 daño directo a HP/turno ignorando SP hasta que se apague con 1 Acción), *Short Circuit* (apaga 3 piezas de ciberware secundario por 60s).
  - **Difficult (Interface 3+, DV 10)**: *Cyberware Malfunction* (anula 1 implante crítico por 60s), *Lure* (distracción acústica simulada), *Slow* (reduce el MOVE en 1d6 durante 60s), *Synapse Burnout* (3d6 daño directo a HP ignorando SP; ¡a Interface 3+ el hacker supera automáticamente el Firewall base DV 6 de cualquier Neuroport!).
  - **Advanced (Interface 4+, DV 12)**: *Puppet* (secuestro motor total: controla la Acción y el Movimiento del blanco en su turno), *Shard Ejection* (expulsión forzosa de Chipware), *System Reset* (deja al blanco Inconsciente y Prone durante 60s o hasta que sufra daño).
* **Flujo Canónico de 4 Pasos Interactivo**:
  - **Paso 1: Jack In**: 1 NET Action · Interface + 1d10 vs WILL del blanco + 1d10 (si falla la tirada, el objetivo detecta la intrusión).
  - **Paso 2: Breach Passwalls**: 1 NET Action / Passwall · Romper Firewall base (DV 6; superado automáticamente a Interface 3+) y Self-ICE (1 Self-ICE = DV 6, 2 Self-ICE = DV 8, 3 Self-ICE = DV 10).
  - **Paso 3: Perform Quickhack**: 1 NET Action · Interface + 1d10 vs DV del Quickhack (6, 8, 10, 12). Resolución y tirada de daño automática para Synapse Burnout (3d6) y Slow (1d6).
  - **Paso 4: Boot Out / Expulsión**: 1 Acción Meatspace del objetivo · WILL + Concentration + 1d10 vs Interface + 1d10 (si el objetivo gana, expulsa al hacker e inhabilita reconexión por 60 minutos).

### B. Rediseño de la Calculadora de Daño e Impactos (`CombatHudView.tsx`)
* **Problem**: 8 botones presets fijos (`[5] [8] [10] [12] [15] [18] [22] [25]`) ocupaban espacio visual innecesario y limitaban la flexibilidad en mesa.
* **Fix**: Sustituidos por un campo numérico libre `<input type="number" min={0} max={200} ... />` centrado con tipografía monospace de alta legibilidad, flanqueado por botones `-1` y `+1` para ajuste fino de daño bruto entrante.

### C. Arquitectura de Cabeceras HUD de Dos Filas (`CombatHudView.tsx`)
* **Problem**: En monitores o layouts estrechos de 3 columnas, la inclusión de botones de tamaño (`[S] [M] [L] [↕ Todo]`) junto al título y badges hacía que el título e icono (`✨ SUERTE (LUCK)`) se recortasen o superpusieran.
* **Fix**: `CollapsibleHudCard` reestructurado en 2 filas limpias:
  - **Fila 1 (Principal)**: Iconos de arrastre, botón de colapso, icono y título con truncado elegante, y `headerRight` para badges (`GRAVE -2`) o acciones prioritarias (`🔄 Restaurar`).
  - **Fila 2 (Sub-barra de Espacio)**: Controles `[S] [M] [L] [↕ Todo] [-] [+]` visibles únicamente cuando la tarjeta está expandida (`!isCollapsed && subHeaderControls`).
* **Ergonomía de Suerte**: Pips de LUCK reorganizados con `flex flex-wrap gap-1.5` y contador de inversión `[-] +0 [+]` proporcional.

---

## 📦 2.1 Historical Summary: What Was Added in v4.0.1

### A. Corrección de Clipping en Tooltips de STATS (`StreetLabView.tsx`)
* **Problem**: The `.chamfer-card` class on the 10 STATS container used `clip-path: polygon(...)`, which clipped any child tooltips rendered via `absolute top-full`.
* **Fix**: Replaced `.chamfer-card` with standard Tailwind `rounded-xl border border-red-500/30`, applied `relative z-30 overflow-visible` on both the container and inner stat cards. Tooltips now float seamlessly above adjacent sections.

### B. Especificación Exhaustiva de Descanso y Asistencia Médica Canónica
* **Files**: `weaponAndCyberwareTooltips.ts`, `StreetLabView.tsx`, `CombatHudView.tsx`.
* **Data Source**: `RESTING_AND_ARMOR_REPAIR_OFFICIAL_GUIDE.restingAndHealing` updated with exact RTG Core pp. 140, 222-226 rules.
* **Mechanics & Interactive Actions**:
  - **Estabilización & Reposo Natural**: DVs 10 (Herida Leve), 13 (Gravemente Herido), 15 (Mortalmente Herido). Regla canónica de esfuerzo: cualquier actividad física o intelectual extenuante reduce a 0 los HP recuperados en el día. Tasa base: 1x BODY HP/día.
  - **Anticuerpos Mejorados (Enhanced Antibodies)**: 500 eb, 1 slot interno, 2 HL (1d6). Duplica la recuperación natural a 2x BODY HP/día (o 3x con Criotanque). Botón interactivo de compra e instalación inmediata en Street Lab y HUD de Combate.
  - **Criotanque (Cryotank)**: 5.000 eb coste de compra, 30 SDP. Estancia hospitalaria a 100 eb/día (+50 eb de suministros médicos) o uso de taller para Medtech Rango 4+ (solo 50 eb de suministros químicos). Otorga curación acelerada (+BODY HP/día) e inmunidad a penalizadores de heridas críticas mientras el paciente permanezca dentro. Botones para pagar estancia hospitalaria o suministros Medtech con curación automática.
  - **Criobomba (Cryopump)**: 5.000 eb coste de compra. Unidad portátil de soporte vital que congela las tiradas de salvación de muerte (<1 HP) por 1 hora por dosis consumiendo 50 eb de suministros químicos durante transporte médico.
  - **Speedheal**: 200 eb por dosis. Inyección de emergencia que cura BODY + WILL HP al instante (máximo 1 dosis cada 24 horas; sobredosis causa daño). Botón interactivo en Street Lab y HUD de Combate con actualización en Biomonitor.

### C. Modo Master (GM) en Netrunning (`NetAndRolesDeckView.tsx`)
* **Player-First Ergonomics**: Por defecto, la lista de las 9 arquitecturas de red preconstruidas y el botón `+ AÑADIR PISO` permanecen ocultos a los jugadores, presentando un panel de punto de acceso limpio con estado de conexión.
* **GM Toggle**: Conmutador `👑 MODO MASTER (GM): SELECCIONAR / EDITAR ARQUITECTURA` controlado por el estado local `isGmArchitectureManagerOpen` (default `false`) para que el Árbitro administre y configure pisos sin saturar la pantalla del jugador.

### D. 9 Acciones de Interfaz & Fix del Bug DV 612
* **Files**: `netAndRolesData.ts`, `NetAndRolesDeckView.tsx`.
* **Canonical Fields**: Todas las 9 acciones (Jack In/Out, Meat Actions, Scanner, Backdoor, Cloak, Control, Eye-Dee, Pathfinder, Slide, Virus) incluyen coste exacto en acciones NET (1 o 2), efecto canónico exacto (Core pp. 198-199), prerrequisitos, tabla/resolución de DVs y fórmula de tirada.
* **Bug Fix DV 612**: Erradicado el bug donde `Variable (DV 6 a 12)` se parseaba extrayendo dígitos concatenados (`612`).
* **Target DV Selector Bar**: Barra interactiva de selección de dificultad (`DV 6`, `DV 8`, `DV 10`, `DV 12`, `DV 13`, `DV 14`) que permite al jugador fijar el DV objetivo antes de realizar la tirada de Interface.

---

## 📦 2.1 Historical Summary: What Was Added in v4.0.0

### A. Catálogo Canónico de 23 Accesorios de Armas
* **Data Source**: `weaponAttachmentsAndTechData.ts` (`WEAPON_ATTACHMENTS_CATALOG`).
* **Actions**: `installWeaponAttachment(charId, weaponId, attachmentId)` and `removeWeaponAttachment(charId, weaponId, attachmentId)` in `useCharacterStore.ts`.
* **Mechanics**:
  - **Capacidad de Ranuras**: `calculateWeaponSlotCapacity(quality, hasMakerSlotUpgrade, isExotic)`. Armas estándar tienen 2 slots; Mala calidad 1 slot; Excelente calidad 3 slots; Exóticas 0 slots salvo mejora Tech Maker (`extra_slot`).
  - **Restricciones Canónicas**: Filtro estricto por categoría de arma (e.g., Lanzagranadas bajo cañón solo en escopetas/rifles; bayoneta solo en armas de dos manos; silenciador solo en pistolas/SMGs).
  - **Ataques Secundarios Integrados en `CombatHudView.tsx`**:
    - *Bayoneta*: 1d6 daño cuerpo a cuerpo con ROF 2.
    - *Escopeta Bajo Cañón*: 3d6 daño (Shell) con tabla de dispersión.
    - *Lanzagranadas Bajo Cañón*: 6d6 daño explosivo (Grenade) con tabla de DV de explosivos.
  - **Modificadores Balísticos Activos**: Integración de bonos en el cálculo de ataque (`distMeters`, Smartgun Link, miras telescópicas e infrarrojas para anular penalizaciones de oscuridad/distancia).

### B. Sistema Maker de Mejoras Tech (Armas & Armaduras)
* **Data Sources**: `TECH_MAKER_UPGRADE_OPTIONS`, `MAKER_DV_AND_TIME_BY_COST`, `TechWeaponUpgradeType` en `weaponAttachmentsAndTechData.ts`.
* **Actions**: `applyTechUpgradeToWeapon(charId, weaponId, upgradeType)` and `applyTechUpgradeToArmor(charId, location, upgraded)` in `useCharacterStore.ts`.
* **Mechanics**:
  - **Mejoras de Armas**: Ranura de accesorio extra (`extra_slot`), subida de calidad (`quality_step`), bonificación de daño balístico (`damage_boost`) y aumento de cadencia de fuego (`rof_increase`).
  - **Mejora de Blindaje (+1 SP)**: Modificador canónico Tech Maker para armaduras de Cabeza y Torso con toggle interactivo en el panel de armaduras de `CombatHudView.tsx` y en `StreetLabView.tsx`.
  - **Matriz de Fabricación Maker**: Consulta en tiempo real de DVs de Tech (Cybertech/Weaponstech/Basic Tech) y tiempos reglamentarios según valor en Eurodólares del ítem base (Core pp. 147-148).

### C. Lifepaths Específicos de Rol
* **Data Source**: `ROLE_SPECIFIC_LIFEPATHS` en `characterLifepathData.ts`.
* **View**: Pestaña 8 en `StreetLabView.tsx` (`roleLifepath`).
* **Mechanics**:
  - Cobertura completa de los 10 roles del Core Rulebook (pp. 44-71): Rockero, Solo, Netrunner, Tech, Medtech, Media, Policía (Lawman), Ejecutivo, Fixer y Nómada.
  - Generador de tiradas 1d10 o selección manual guiada con persistencia en el folio del personaje.

---

## 📦 2.2 Historical Summary: What Was Added in v3.9.0

### A. Taller Interactivo de Reconstrucción CEMK 2077
* **Action**: `convertWeaponRebuild2077(characterId, weaponItemId, targetRebuild)` in `useCharacterStore.ts`.
* **Data Source**: `CEMK_WEAPON_REBUILD_SYSTEM_GUIDE` in `weaponAndCyberwareTooltips.ts`.
* **Mechanics**:
  - Permite transformar armas estándar 2045 en sus variantes tecnológicas 2077: **Smart** (+Smart link, tracking guiado), **Tech** (+penetración y electromagnetismo), o **Power** (+rebote cinético).
  - Integrado con dropdown interactivo en `StreetLabView.tsx` (pestaña Arsenal) y en `CombatHudView.tsx` (Estación En Mano y Cinturón).
  - Coste automático deducido en Eurodólares (€$) o modo gratis según preferencia.
* **Toggles Tácticos de Combate 2077**:
  - `smartCoverBypass`: -4 a tiradas de defensa/evasión tras cobertura.
  - `powerRicochetActive`: -4 a tiradas de ataque para impactos de rebote balístico en esquinas.
  - `techChargeShotActive`: Reduce un 50% de SP adicional de la armadura antes de evaluar daño neto.

### B. Gestor de Averías & Pulso Electromagnético (EMP) en Ciberware
* **Actions**: `toggleEmpDisableCyberware(characterId, cyberwareItemId)` and `clearAllEmpDisabledCyberware(characterId)`.
* **Field**: `empDisabled?: boolean` en `InstalledCyberwareItem`.
* **Mechanics**:
  - **Tirada de Resistencia Canónica**: Botón directo para tirar `TECH + Cybertech + 1d10 vs DV 15`. Si falla, los implantes electrónicos sufren malfunción de 1 minuto o hasta reparación.
  - **Insignia Visual**: Badge pulsante `⚡ EMP OFF` en implantes desactivados tanto en `StreetLabView.tsx` como en `CombatHudView.tsx`.
  - **Neutralización de Bonos**: `characterEngine.ts` anula dinámicamente cualquier bono a STAT o habilidad proveniente de un ciberware con `empDisabled === true`.
  - **Reboot Maestro**: Botón de reinicio en un clic (`Reboot Todo`) para reactivar la totalidad del ciberware.

### C. Progresión de Habilidad de Rol Rango 1-10
* **View**: Pestaña 6 en `StreetLabView.tsx` (`roleAbility`).
* **Data Source**: `ROLE_ABILITIES_COMPLETE_PROGRESSION` en `netAndRolesData.ts`.
* **Mechanics**:
  - Selector interactivo de Rango 1 a 10 con actualización de `updateCharacterMeta({ roleRank })`.
  - Visualización del desglose mecánico, fórmulas oficiales, stat utilizado y árbol de progresión completo para los 10 roles:
    *Solo (Combat Awareness), Netrunner (Interface), Tech (Maker), Medtech (Medicine), Media (Credibility), Exec (Teamwork), Lawman (Backup), Fixer (Operator), Nomad (Moto) y Rockerboy (Charismatic Impact)*.
  - Resaltado visual en verde para rangos activos/desbloqueados y en gris bloqueado para rangos superiores.

### D. Motor de Descanso Natural & Reparación de Blindaje
* **Actions**: `restAndHealDays(days, enhancedAntibodies, cryotank)` and `repairCharacterArmor(location, mode, customAmount)`.
* **Data Source**: `RESTING_AND_ARMOR_REPAIR_OFFICIAL_GUIDE` (Core Rulebook pp. 140, 222-223).
* **Mechanics**:
  - **Descanso Natural**: Recupera `BODY` HP por cada día completo de reposo.
    - Con *Enhanced Antibodies*: `BODY * 2` HP/día.
    - Con *Cryotank*: suma `+BODY` adicional por día.
  - **Reparación de Blindaje**: Restaura SP de cabeza y torso.
    - Soporte para parche rápido (+1 SP) o reparación total a su valor máximo.
    - Tabla oficial de DVs de Tech y tiempos reglamentarios integrada como referencia directa.
  - Integrado en `StreetLabView.tsx` (pestaña 7 `restingRepair`) y en `CombatHudView.tsx` (dentro de las tarjetas de `vitals` y `armor`).

### E. Filtro de Decluttering en Bandeja Derecha del HUD de Combate
* **State & Persistence**: `disabledRightModules` array persistido en `localStorage` con la clave `cpr_combat_disabled_right_modules_v1`.
* **Mechanics**:
  - Selector desplegable `⚙️ Filtro` en la cabecera de la bandeja derecha de `CombatHudView.tsx`.
  - Permite ocultar selectivamente cualquiera de los 7 módulos laterales (`inHand`, `arsenalBelt`, `cyberware`, `unarmed`, `throwables`, `consumables`, `criticalInjuries`).
  - Botón individual `Eye`/`EyeOff` en la cabecera de cada tarjeta para silenciarla instantáneamente en combate.

---

## 🗂️ 3. Critical Files on Disk

```text
frontend/src/
├── data/
│   ├── core-rules.cprpack.json          # 391+ ítems oficiales multi-libro
│   ├── weaponAttachmentsAndTechData.ts  # 23 accesorios canónicos, slots, Maker Tech upgrades & DVs
│   ├── characterLifepathData.ts         # ROLE_SPECIFIC_LIFEPATHS para los 10 roles
│   ├── netAndRolesData.ts               # ROLE_ABILITIES_COMPLETE_PROGRESSION, Quickhacks, NET Topologies
│   ├── weaponAndCyberwareTooltips.ts    # CEMK_WEAPON_REBUILD_SYSTEM_GUIDE, RESTING_AND_ARMOR_REPAIR_OFFICIAL_GUIDE
│   ├── criticalInjuries.ts              # Tablas oficiales 2d6 de heridas críticas
│   ├── cyberfistsMartialArtsData.ts     # 27 formas marciales canónicas
│   ├── enemiesCatalog.ts                # 44 enemigos base + 15 facciones (118 PNJs de Danger Gal)
│   └── systemDocsAndChangelogData.ts    # Changelogs, inventario y arquitectura
├── engine/
│   ├── characterEngine.ts               # Fórmulas de STATs, derivados, cálculo de HP y filtros de EMP
│   └── combatEngine.ts                  # Tiradas d10 explosivas, Xd6, ablación de SP y críticos
├── features/
│   ├── combat/
│   │   └── CombatHudView.tsx            # HUD de combate táctico, accesorios, ataques secundarios y +1 SP Tech
│   ├── sheet/
│   │   └── StreetLabView.tsx            # Ficha de personaje, Rebuild, EMP, Roles 1-10, Descanso, Accesorios & Lifepath
│   ├── docs/
│   │   └── SystemChangelogAndDocsView.tsx # Portal in-app de documentación y changelogs (v1.0.0 a v4.0.0)
│   ├── roles/
│   │   └── NetAndRolesDeckView.tsx      # NET architectures, Quickhacks 2077, Garaje y Roles
│   ├── compendium/
│   │   └── CompendiumView.tsx           # Compendio 8 categorías con tooltips y filtros de libro
│   ├── creator/
│   │   └── CharacterCreatorWizard.tsx   # Wizard de 6 pasos de creación canónica
│   ├── cyberware/
│   │   └── CyberwareRipperdocView.tsx   # Menú Ripperdoc 2077 interactivo con maniquí anatómico
│   └── oneshot/
│       └── RedChromeCargoView.tsx       # Misión interactiva CEMK 2077 con mapa Maglev y roster dual
└── store/
    ├── useCharacterStore.ts             # Estado de personajes, inventario, accesorios, EMP, descanso y reparación
    └── useCombatStore.ts                # Estado de combate, DVs activos, objetivos y telemetría
```

---

## 🔮 4. Phase 4 Roadmap: GM Role Master Control Deck & Modular Settings
The next major architectural milestone is **Phase 4**:
1. **⚙️ MODO SETTINGS & MODULARIDAD GLOBAL (Prender / Apagar Sistemas)**:
   - Capacidad en configuración del sistema y perfil del personaje para activar o desactivar módulos globales completos según el tipo de mesa:
     - *Full Body Conversions (Going Metal)*: Ocultar chasis cyborg si la campaña es de nivel callejero o purista orgánica.
     - *Garaje & Vehículos Nómada*: Ocultar panel de vehículos si el personaje no conduce ni posee vehículos.
     - *Quickhacking & Cyberware CEMK 2077*: Desactivar mecánicas de 2077 para mesas puristas de la Era del Rojo (2045).
     - *Dojo de Artes Marciales*: Ocultar disciplinas marciales para personajes que no usan combate cuerpo a cuerpo desarmado.
     - *Consola NET & Pisos de Red*: Ocultar herramientas de Netrunning en grupos sin Netrunners.
2. **GM Master Screen (`FixerDeckView.tsx` / `GmRoleMasterControlDeck.tsx`)**:
   - Tablero unificado para el Árbitro para orquestar y reaccionar a las 10 Habilidades de Rol en vivo.
   - Arbitraje de tiradas de *Combat Awareness*, *Interface*, *Maker* (tiempos de fabricación), *Medicine* (lotes farmacéuticos y criocámaras), *Backup* (cronómetros de refuerzos), y *Charismatic Impact* (audiencias y favores).
3. **Multi-Participant Combat Initiative Tracker**:
   - Sincronización bidireccional entre la ficha del jugador activo, los 44 goons del catálogo y los 118 PNJs de *Danger Gal Dossier*.
4. **Generador Procedural de Encuentros & Clima Callejero**:
   - Tablas de calor urbano por distrito (Watson, City Center, Santo Domingo, Pacifica, Combat Zone) y eventos ambientales (lluvia ácida, smog rojo, interferencias EMP).
5. **Seguimiento de Economía & Campaña**:
   - Alquiler mensual, cuotas de deuda corporativa y gastos de estilo de vida (Core p. 377).

---

## 💎 5. Premium Modules & Fases Futuras (Paridad Companion App)
Desglose canónico derivado directamente de la catalogación oficial de la *Cyberpunk RED Companion App*, garantizando cero duplicación:

### A. `NIGHT CITY 2045` (Interactive Atlas & Campaign Gazetteer — Planeado para Fase 5 / Premium Expansion)
* **Interactive map of Night City**: Atlas interactivo en formato vectorial SVG/Canvas con navegación táctica y zoom fluido.
* **700+ searchable Locations**: Más de 700 localizaciones canónicas indexadas y buscables al instante.
* **25 searchable Districts**: Cobertura exhaustiva de los 25 distritos de Night City 2045 con límites georreferenciados.
* **Ability to filter locations by medical, transportation, etc.**: Filtros por categoría de servicio (médico, transporte, armerías, Night Markets, corporativo, ripperdocs, etc.).
* **73 searchable Factions, with their associated hangout locations on the interactive map**: 73 facciones urbanas con sus guaridas y zonas de influencia desplegables en el mapa.
* **112 new NPCs, each with their corresponding district**: 112 nuevos personajes no jugadores indexados y vinculados a su distrito territorial.
* **130 plot hooks to inspire GMs and players**: 130 ganchos narrativos y semillas de misiones listos para detonar en mesa.
* **Interactive map automatically unlocks for your players while hosting an online session**: Desbloqueo automático del mapa interactivo para jugadores conectados en sesión remota/local.
* **Ability to add your own custom locations to the interactive map**: Herramienta de autor para dar de alta ubicaciones personalizadas (Custom Locations) con coordenadas y notas.
* **Custom locations visible and searchable for players connected to online session**: Sincronización en vivo de ubicaciones personalizadas para que sean visibles y buscables por los jugadores.

### B. `SOLO OF FORTUNE` (ACPA Power Armor & Heavy Ordinance Expansion — Planeado para Fase 5 / Premium Expansion)
* **ACPA Armor Type (Assisted Combat Personnel Armor)**: Nueva categoría canónica de blindaje de combate asistido con reglas estructurales de chasis.
* **Custom ACPA Builder**: Taller de ensamblaje modular para diseñar, configurar y costear armaduras de poder personalizadas.
* **10 ACPAs**: 10 chasis oficiales completos de ACPA listos para equipar, tripular y desplegar en combate.
* **13 New Weapons**: 13 nuevas armas militares y pesadas de grado bélico.
* **8 New Weapon Attachments**: 8 nuevos accesorios tácticos especializados para armamento ACPA y militar.
* **15 New Weapon Range Tables**: 15 nuevas matrices y tablas de rango de combate por metro adaptadas a armamento pesado.
* **12 New Ammunition & Explosives**: 12 tipos de municiones especiales, proyectiles pesados y explosivos de demolición.
* **3 New Armor Sets**: 3 nuevos conjuntos completos de blindaje corporal táctico.
* **10 New Pieces of Gear**: 10 nuevas piezas de equipo especializado para operadores pesados.

### C. `GOING METAL` (Auditoría de Paridad Completa)
* **✅ Ya Implementado (Fase 3)**:
  - *Addition of Full Body Conversions*: Arquitectura canónica de FBC con chasis desacoplado del cerebro orgánico.
  - *13 FBC Bodies*: 13 cuerpos FBC oficiales completos (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.).
  - *16 New Pieces of Cyberware*: 16 implantes exclusivos para chasis cyborg y blindajes estructurales.
  - *About FBCs Section*: Guía canónica de lore, protocolos de instalación y conversión en compendio.
* **⏳ Pendiente de Cierre Going Metal**:
  - *Verificar/añadir el `New External Linear Frame` específico*: Comprobar y dar de alta la variante canónica externa individualizada de Going Metal si no figura ya como Linear Frame independiente.
  - *Verificar/añadir el `New Grenade Type`*: Comprobar y dar de alta el tipo específico de granada de Going Metal (Laser/Chaff o variante especializada) en el catálogo de arrojables.

---

## ⚠️ 6. Strict Zero-Drift Directives for Subagents
1. **NO UNSOLICITED REFACTORING**: Do not alter variable names, rearrange imports, or "clean up" adjacent code blocks.
2. **MAINTAIN FILE SCOPE**: Only modify the files explicitly authorized by the orchestrator.
3. **COMPILER VERIFICATION**: Always verify with `cmd /c npx tsc -b --noEmit` and `cmd /c npm run build` before reporting completion.
4. **PRESERVE COMMENTS & DIRECTIVES**: Never delete existing comments, linter directives, or documentation headers.
