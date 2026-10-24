# Resúmenes de versión v3.9.0 a v4.6.0 (handoff)

> [Claude Code · 2026-10-24] Archivado al ordenar la documentación. Copia textual de `AI_CONTEXT_HANDOFF.md` (secciones "What Was Added" e "Historical Summary"). No se actualiza más.

---

## 🚀 2. What Was Added in v4.6.0

[Claude Code · 2026-10-21] Plan 4 (`docs/plans/plan4-ripperdoc-visual-2077.md`), Ripperdoc estilo Cyberpunk 2077, solo visual. `CyberwareRipperdocView.tsx` 2235 a ~1030 líneas con componentes nuevos en `features/cyberware/`: `ripperdocZones.tsx`, `HoloBody.tsx`, `ZoneCard.tsx`, `SlotBox.tsx`, `GoingMetalBanner.tsx`, `ZoneConnectors.tsx`, `ZoneDetailPanel.tsx`, `cyberwareCardArt.ts`. Figura holográfica con 9 zonas interactivas (nueva: Fashionware), slots biselados `.chamfer-slot`, conectores medidos en xl, panel de detalle y layout móvil. 6 cartas CEMK de ciberware en `frontend/public/cemk/cyberware/` (se ven al inspeccionar; los slots muestran ▣). Fix de `itemMatchesZone` para 'Cyberarm Option', 'Neuralware Option' y 'Borgware x2', con test de cobertura de zonas (33 tests). Textos de Going Metal corregidos; `animate-in`/`fade-in`/`zoom-in-95` definidos en `index.css`. `.claude/launch.json` para el dev server (puerto 5173). Pendiente: v4.5.1 Cyberfists of Fury (plan 2 fase 5), plan 3 perdido, modo Settings, GM Master Screen.

## 📦 2.0 Historical Summary: What Was Added in v4.5.0

[Claude Code · 2026-10-21] Plan 2, fase 4 (Going Metal canon, pp. 91-111). `goingMetalFbcData.ts` reescrito: 13 cuerpos `gm-*` con `statFloor`, `armorPenalty`, `packageHlAverage`, 20 ciberwares, 6 de equipo, `FBC_IMMUNE_CRITICAL_INJURIES`, `FBC_IMMUNITIES`, `BIOSYSTEM_HL_AVERAGE` = 14. Conversión: HL = 14 + HL del paquete, cambiar de cuerpo cuesta el HL del paquete, HP al máximo. Motor: REF/DEX/MOVE = max(base, `statFloor`), sin penalizadores de Wound State, sin Speedheal ni doble Cryotank, inmune a 9 heridas críticas, terapia 'Borgware x2' = -8. Se borraron del pack 29 `fbc-*` y 4 ítems inventados (ambas copias de `core-rules.cprpack.json`) y se reescribió `fbc-rules`. Tests: 32. Pendiente: marcos Black Chrome (Vermilion, Fūma Kotarō), HL por pieza del paquete para el tope de terapia, tope de Humanidad al volver a un cuerpo viejo. Siguiente: v4.5.1 Cyberfists of Fury.

## 📦 2.0 Historical Summary: What Was Added in v4.4.0

[Claude Code · 2026-10-20] Plan 2, fase 3. Reglas del Core: sin modos de carga (`ENCUMBRANCE_MODES` borrado), Role Abilities reescritas desde Core pp. 143-162, Combat Awareness validado (`isValidSoloAllocation`), Pharmaceuticals canon, Special Moves del Core con `isOpposed` y `SHARED_MARTIAL_ARTS_MOVES`, tope de Humanidad por terapia (`calculateTherapyMaxHumanity`), terapias Standard/Extreme, granadas por tabla de rango y municiones del Core, `naturalHealingPerDay` y `speedhealAmount`. Siguiente: v4.5.0 Going Metal.

## 📦 2.0 Historical Summary: What Was Added in v4.3.1

[Claude Code · 2026-10-20] Plan 2, fase 2. Datos CEMK canon: un solo set de 13 armas (CEMK pp. 31-34, 6 inventadas borradas, Crusher agregada), ciberware con costo y HL del libro (Neuroport 1,000 €$ HL 7, Mantis Blade HL 14, Sandevistan de David 250,000 €$), Immunoblockers de CEMK p. 30, MaxDoc y BounceBack borradas, Rebuilds a 1,000 €$ sin Maker ni Ballistic Coprocessor (`CEMK_WEAPON_REBUILD_SYSTEM_GUIDE`), Boosterganger BODY 2 (Errata p. 412). Siguiente: v4.4.0 roles, Martial Arts, Humanidad, granadas, curación y borrar modos de carga.

## 📦 2.0 Historical Summary: What Was Added in v4.3.0

[Claude Code · 2026-10-20] Plan 2, fase 1 (`docs/plans/plan2-auditoria-expansiones.md`). NET y Quickhacks canon: hasta 3 NET Actions en todo rango (`NET_ACTIONS_PER_TURN`, CEMK p. 15), Quickhacks sin RAM con alcance 6/8/50 m y 1 por objetivo por turno, 14 programas `qh-*` borrados del pack, `BLACK_ICE_STATS` del Core pp. 206-207, dificultades Basic/Standard/Uncommon/Advanced, Scanner sin DV, Flak y Shield corregidos, `rollCheckD10`/`beatsDv` en el motor (los Checks contra DV deben superarlo, CEMK p. 5). Siguiente: v4.3.1 datos CEMK.

## 📦 2.0 Historical Summary: What Was Added in v4.2.1

[Claude Code · 2026-10-20] Plan 1 terminado (fase 5). Vistas con `React.lazy` (bundle inicial 598 kB), `calculateIncomingImpact` en `combatEngine.ts`, tests Vitest de reglas canon (`npm test`), borrado de `DataPacksView.tsx`, `clsx`, `tailwind-merge` y `applyIncomingDamage`, PIN del GM en `cpr_gm_pin_v1`. Para Antigravity: la sección 7 nueva de `.agent/AGENTS.md` pide correr `npm test`; replicarla en el AGENTS.md de la carpeta de PDFs. Siguiente: plan 2 (expansiones, hallazgos X1-X13), pendiente de aprobación.

## 📦 2.0 Historical Summary: What Was Added in v4.2.0

[Claude Code · 2026-10-20] Plan 1, fase 4. Melee enfrentado contra DEX + Evasion del defensor (estado `meleeDefenseBase` en `CombatHudView`), Cyberarm mín. 2d6, munición validada antes del alcance, apuntado sin autofire, multiplicador de autofire del último ataque, empates para el defensor en todos los módulos, quickhacks con WILL/Concentration del objetivo y sin daño antes de la explosión.

## 📦 2.0 Historical Summary: What Was Added in v4.1.1

[Claude Code · 2026-10-20] Plan 1, fase 3. FBC reversible (el chasis ya no pisa stats.BODY/MOVE; se aplica con getEffectiveBody/getEffectiveMove y se restaura la armadura previa), HP máximo con BODY efectivo en todo el código, `parseHumanityLossAverage`, validaciones de munición/NaN/transacciones y `version: 1` + `migrate` en los dos stores persistidos.

## 📦 2.0 Historical Summary: What Was Added in v4.1.0

[Claude Code · 2026-10-20] Plan 1, fase 2. Mortally Wounded (-4 a todo, -6 MOVE), botón Tirar Death Save con penalizador base + acumulado y estado MUERTO (Core pp. 186, 188); críticos automáticos al aplicar daño con Crítico o estando Mortally Wounded; Cracked Skull x3; EMP efectiva derivada de la Humanidad (Core p. 80). Funciones en `engine/characterEngine.ts`; campos opcionales `deathSavePenalty` e `isDead` en `CharacterSheet`.

## 📦 2.0 Historical Summary: What Was Added in v4.0.3

[Claude Code · 2026-10-20] Primera fase del plan de arreglos de la auditoría general (`docs/plans/plan1-auditoria-core.md`). Informe completo: Claude Doc "Auditoría CPR Omni-Deck v4.0.2".
- Tablas de Heridas Críticas (cuerpo y cabeza) reescritas según Core pp. 187-188, con re-tirada de críticos repetidos.
- `neuralware-processor` corregido a *Neural Link* 500eb (Core p. 111).
- Munición Smart según Core p. 346 y Asp ATK 2 (Core p. 206).
- Ojo: varias secciones históricas de abajo (escritas por Antigravity) describen reglas que la auditoría encontró inventadas o incompletas. Antes de confiar en una, verifícala contra el código y el libro. Pendientes del plan 1: Mortally Wounded + Death Saves, EMP derivada de Humanidad, melee enfrentado, bugs del store.

## 📦 2.0 Historical Summary: What Was Added in v4.0.2

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
* **Data Source** [Claude Code · 2026-10-23]: `CORE_LIFEPATH.byRole[rol].tables` en `data/creation/coreLifepath.ts` (generado desde `data/creation-src/`), las preguntas en `ROLE_LIFEPATH_QUESTIONS` (`data/characterCreationData.ts`) y las tablas que aplican en `getApplicableRoleLifepathTables` (`engine/characterCreation.ts`). El estado del creador va en `draft.roleLifepath`.
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

