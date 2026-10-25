# CPR OMNI-DECK // AI Context Handoff & Technical Briefing

> **SYSTEM VERSION**: `v5.0.1 OPERATIVO`  
> **LAST UPDATED**: [Claude Code · 2026-10-25]  
> **STACK**: React 19 + TypeScript 5.8 + Vite + Tailwind CSS v4 + Zustand 5  
> **RULESET**: Cyberpunk RED Core Rulebook + CEMK 2077 + Interface RED Vol. 1-4 + Danger Gal Dossier  
> **ARCHITECTURE**: COMP/CON decoupled offline-first model. Single source of truth in typed registries and Zustand stores.

> **WORK STATE**: Leer primero `CHECKPOINT.md` (estado vivo compartido Claude Code ↔ Antigravity) y actualizarlo al terminar cada tarea.
> **AUTORÍA**: Cada sección o actualización se firma `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`. Las secciones sin firma son anteriores a 2026-10-20 y las escribió Antigravity.

---

## 🎯 1. Para qué sirve este documento

[Claude Code · 2026-10-24] Desde el orden de la documentación este archivo es el **mapa técnico**: dónde vive cada sistema y qué directivas siguen los subagentes. La historia de versiones vive solo en `CHANGELOG_AND_ARCHITECTURE.md`; el estado de los planes en `docs/plans/README.md`; el trabajo en curso en `CHECKPOINT.md`. Qué es cada documento: `docs/INDEX.md`.

Los resúmenes de versión viejos (v3.9.0 a v4.6.0) y el roadmap de fase 4 y módulos premium están en `docs/archive/`.

---

## 🗂️ 2. Critical Files on Disk

```text
frontend/src/
├── data/
│   ├── core-rules.cprpack.json          # 391+ ítems oficiales multi-libro
│   ├── weaponAttachmentsAndTechData.ts  # 23 accesorios canónicos, slots, Maker Tech upgrades & DVs
│   ├── creation/coreLifepath.ts         # CORE_LIFEPATH (general + byRole), generado [Claude Code · 2026-10-23]
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
    ├── useCombatStore.ts                # Estado de combate, DVs activos, objetivos y telemetría (v4.9.7: partialize con grupos local/shared)
    └── persistence.ts                   # Migraciones (esquema 6), copia de seguridad y archivos de historial (v4.9.7)
```

[Claude Code · 2026-10-24] v4.9.7, contratos nuevos (plan 17):
- **Campos de texto que escriben en un store**: usar `components/CommittedInput.tsx` (o `hooks/useCommittedField.ts`), que guarda al salir, con Enter o tras 1,5 s. No escribir en el store con cada tecla.
- **useEffect que escribe localStorage**: usar `hooks/useDebouncedLocalStorage.ts`.
- **Historiales**: `ipLog` tiene freno en 2.000 (`capIpLog`, `engine/ipLedger.ts`) y `speedhealLog` en 500; lo viejo va a `cpr_ip_log_archive_v1` / `cpr_speedheal_archive_v1`, incluidas en `BACKUP_EXTRA_KEYS`. Los totales archivados viven en `ipLogArchivedTotals`.
- **Campos nuevos de `useCombatStore`**: agregarlos a `COMBAT_LOCAL_KEYS` o a `COMBAT_SHARED_KEYS` (un test falla si quedan afuera).

[Claude Code · 2026-10-24] v5.0.0, mesa online (planes 16, 17 y 18). Todo en `frontend/src/sync/`; las vistas no hablan con Firestore:
- **Sesión**: `authStore.ts` (login, modo local/nube) → `cloudCharacters.ts` (`initCloudSync`, `startSession`/`stopSession`, subir fichas) → `characterSync.ts` (motor puro: cola, diff, `increment()`, sin eco) con `firestoreAdapter.ts`. Campañas: `cloudCampaigns.ts` (controlador) + `campaignRepo.ts` (Firestore) + `partySummary.ts` (resumen puro).
- **Campos que no viajan en la ficha**: `ipLog` y `transactions` van a subcolecciones (`sheetDoc.ts`, `LOG_FIELDS`); `ownerUid`, `campaignIds`, `schemaVersion`, `_w`, `_ts`, `_lastWriter` son metadatos (`META_FIELDS`). Un campo nuevo de la ficha sincroniza solo; si es un contador que el GM y el jugador tocan a la vez, sumarlo a `COUNTER_PATHS`.
- **Escrituras directas al documento de la ficha** fuera del motor: llevan los campos de escritor (`_w.<writerId>`, `_lastWriter`, `_ts`) o las reglas las rechazan (ver `setSchemaVersion` y `assignCharacter`).
- **Reglas**: `frontend/firestore.rules`, tests en `src/sync/__tests__/rules/` (`npx vitest run --config vitest.rules.config.ts` con el emulador prendido; borra sus datos). Presupuesto de cuota: `src/sync/__tests__/sessionBudget.test.ts`.

---

## ⚠️ 3. Strict Zero-Drift Directives for Subagents
1. **NO UNSOLICITED REFACTORING**: Do not alter variable names, rearrange imports, or "clean up" adjacent code blocks.
2. **MAINTAIN FILE SCOPE**: Only modify the files explicitly authorized by the orchestrator.
3. **COMPILER VERIFICATION**: Always verify with `cmd /c npx tsc -b --noEmit` and `cmd /c npm run build` before reporting completion.
4. **PRESERVE COMMENTS & DIRECTIVES**: Never delete existing comments, linter directives, or documentation headers.
