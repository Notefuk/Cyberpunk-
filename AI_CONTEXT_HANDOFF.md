# CPR OMNI-DECK // AI Context Handoff & Technical Briefing

> **SYSTEM VERSION**: `v4.0.0 OPERATIVO`  
> **LAST UPDATED**: 2026-10-19  
> **STACK**: React 19 + TypeScript 5.8 + Vite + Tailwind CSS v4 + Zustand 5  
> **RULESET**: Cyberpunk RED Core Rulebook + CEMK 2077 + Interface RED Vol. 1-4 + Danger Gal Dossier  
> **ARCHITECTURE**: COMP/CON decoupled offline-first model. Single source of truth in typed registries and Zustand stores.

---

## 🎯 1. Purpose of this Document
This file is the official AI-to-AI handoff document for future LLMs, subagents, and orchestrators working on the **CPR Omni-Deck** repository. Whenever a new context window is initialized, read this file to immediately understand:
1. What was just built and verified in `v4.0.0` (and previously in `v3.9.0`).
2. Where all critical systems, stores, and data structures reside on disk.
3. How state transitions cascade across views without regressions.
4. The exact scope and technical contracts planned for **Phase 4 (GM Role Master Control Deck)**.

---

## 🚀 2. What Was Added in v4.0.0

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

## 📦 2.1 Historical Summary: What Was Added in v3.9.0

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

## 🔮 4. Phase 4 Roadmap: GM Role Master Control Deck
The next major architectural milestone is **Phase 4**:
1. **GM Master Screen (`FixerDeckView.tsx` / `GmRoleMasterControlDeck.tsx`)**:
   - Tablero unificado para el Árbitro para orquestar y reaccionar a las 10 Habilidades de Rol en vivo.
   - Arbitraje de tiradas de *Combat Awareness*, *Interface*, *Maker* (tiempos de fabricación), *Medicine* (lotes farmacéuticos y criocámaras), *Backup* (cronómetros de refuerzos), y *Charismatic Impact* (audiencias y favores).
2. **Multi-Participant Combat Initiative Tracker**:
   - Sincronización bidireccional entre la ficha del jugador activo, los 44 goons del catálogo y los 118 PNJs de *Danger Gal Dossier*.
3. **Generador Procedural de Encuentros & Clima Callejero**:
   - Tablas de calor urbano por distrito (Watson, City Center, Santo Domingo, Pacifica, Combat Zone) y eventos ambientales (lluvia ácida, smog rojo, interferencias EMP).
4. **Seguimiento de Economía & Campaña**:
   - Alquiler mensual, cuotas de deuda corporativa y gastos de estilo de vida (Core p. 377).

---

## ⚠️ 5. Strict Zero-Drift Directives for Subagents
1. **NO UNSOLICITED REFACTORING**: Do not alter variable names, rearrange imports, or "clean up" adjacent code blocks.
2. **MAINTAIN FILE SCOPE**: Only modify the files explicitly authorized by the orchestrator.
3. **COMPILER VERIFICATION**: Always verify with `cmd /c npx tsc -b --noEmit` and `cmd /c npm run build` before reporting completion.
4. **PRESERVE COMMENTS & DIRECTIVES**: Never delete existing comments, linter directives, or documentation headers.
