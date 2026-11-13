# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito. Qué es cada documento: `docs/INDEX.md`. Historia de versiones: `CHANGELOG_AND_ARCHITECTURE.md`. Estado de los planes: `docs/plans/README.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.
> **Regla**: "En curso" lista solo trabajo abierto. Lo terminado sale de acá; queda en el CHANGELOG.

**Última actualización**: [Claude Code · 2026-11-13] v5.37.0 (79 de 118 fichas de Danger Gal) terminada en `claude/plan32-v5.37.0`, sin pushear

**Versión de la app**: v5.34.0 en `main` @ 87b1091, en la beta (gh-pages 2a8327a, `index-7aUPZNE2.js`) y en Firebase prod (hosting `index-n44uUOG_.js` y reglas con `gm/mysteries`). [Claude Code · 2026-11-13]

**Plan activo**: plan 32, Danger Gal Dossier completo con porte CEMK (`docs/plans/plan32-danger-gal.md`), v5.35.0 a v5.40.0. [Claude Code · 2026-11-13]

## Traspaso
- Cierra: [Claude Code · 2026-11-12]
- Rama y último commit: `main` @ 59b0cd7 (pusheada: sí). El cierre de sesión queda en `claude/checkpoint-2026-11-12`, sin pushear: falta OK.
- A medias: nada en código.
- Siguiente paso exacto: crear `claude/v5.22.0-actores` desde `main` y empezar la v5.22.0 del plan 28 (actores guardados): `GmActor` en `data/gmActors.ts` y `engine/gmActors.ts`, `actorId` en `EncounterEnemy` (`store/encounterStore.ts`) y la subcolección `campaigns/{c}/actors` con reglas y tests. Hay que probar con el emulador y dos navegadores, incluida la mesa de la v5.21.0, que no se probó online.
- Preguntas abiertas para Giuliano: ninguna.

## En curso (a cargo)
- [Claude Code · 2026-11-13] **Plan 32** (`docs/plans/plan32-danger-gal.md`): Danger Gal Dossier (PDF `Sourcebooks/Cyberpunk-RED-Danger-Gal-Dossier_2023-07-07.pdf`; página impresa = índice del PDF). Reemplaza la v4.7.1 y la v4.7.2 del plan 6.
  - Hecho: plan guardado; v5.35.0 (`data/dangerGalFactions.ts`, ficha de facción en el bestiario, test `dangerGal.test.ts`). v5.35.1 (pedido de Giuliano, fuera del plan): bestiario y facciones solo para el GM (`canSeeGmOnly` en CombatHudView, EnemiesCompendiumPanel y el Haggle de FixerPanel). v5.36.0: 42 fichas (6th Street, Bozos, Puma Squad, Digital Divas, Edgerunners) en `data/enemies-src/danger-gal.json`; las 95 inventadas pasaron a `data/enemies/legacy-invented-danger-gal.ts` (solo para actores viejos, `findEnemySheet`). v5.37.0: 37 fichas más (Generation Red, Maelstrom, NCPD, Network 54, Piranhas); erratas del libro guardadas tal cual: Flenser SW 13 (p.72), Stringer Death Save 4 (p.94).
  - Siguiente: v5.38.0 en `claude/plan32-v5.38.0` (desde v5.37.0): Sightseers, Team Monster, Trauma Team, Tyger Claws, Zoners, más Darius y Nymph de The Incident (pp.100-142 y 165-166; Darius es de Arasaka, que no es una de las 15 facciones: decidir su `faction`). Mismo método: `data/enemies-src/DANGER_GAL_EXTRACT.md`, 3 workers, 2 fichas sobre el render, agregar a `npcs`, `scripts/gen_enemies.py`.
  - Pendiente: v5.36.0 a v5.38.0 (118 fichas en 3 tandas, se borran las 95 inventadas), v5.39.0 (New Gear, vehículos, CrAB Drone y su NET) y v5.40.0 (creador de PNJ guiado).
  - Desvío: el plan cita algunas páginas con +1 (las del índice del PDF son 1-based). En los datos va la página impresa: facciones 9-131, CrAB Drone 42, Herakles 112, Mi-60 120, Chupacabra 139, New Gear 143-148, guía de PNJ 149-152, Darius y Nymph 165-166.

## Último trabajo terminado
- [Claude Code · 2026-11-13] Plan 31 cerrado: resto del Interface RED Vol. 5, v5.29.0 a v5.34.0 (PR #91), publicado en la beta, en las reglas de Firestore y en prod. Ramas borradas.
- [Claude Code · 2026-11-13] Plan 30 cerrado: Solo of Fortune 2045 y ACPA, v5.25.0 a v5.28.0 (PR #89), publicado en la beta y en prod.
- [Claude Code · 2026-11-12] v5.21.0 (plan 28 I): pestaña MODO GM (PR #79), publicada en la beta y en prod.
- [Claude Code · 2026-11-11] Plan 27 cerrado con la v5.20.0 (PR #77):
  - pregens del Single Shot Pack con Neuroport;
  - 8 NET;
  - 13 PNJ de IR2 e IR4;
  - aventuras de Halloween;
  - Hardened revisado contra IR2.
  Interface RED 1-4 quedan en ✅ (sin Elflines) y el plan 22 queda cerrado.
- Versiones anteriores: `CHANGELOG_AND_ARCHITECTURE.md`.

## Contexto permanente
- **Método de canon:**
  - Un subagente `cpr-worker` extrae el texto del PDF a un JSON con página, en `docs/plans/work/<plan>/`. Yo lo valido contra el texto y lo cargo; el registro va en `docs/canon-audit/`.
  - pypdf no renderiza. Para diagramas y tablas sirve `extract_text(extraction_mode='layout')`.
  - Página impresa = PDF − 1 en IR1, IR2 e IR4. IR3 es imagen: se citan los DLC sueltos. Going Metal: impresa = PDF + 90.
- **Generadores (no se editan a mano los TS que generan):**
  - `scripts/gen_enemies.py`: de `data/enemies-src/*.json` (core, cemk, hardened, interface-red) a `frontend/src/data/enemies/`. JSON con indent 1.
  - `scripts/gen_gm_tables.py`: tablas del GM.
- **Pack:** las dos copias (`frontend/src/data/` y `data/`) deben quedar idénticas. No correr `scripts/extract_core_pack.py`, que está desincronizado.
- **Decisiones de Giuliano:**
  - Todo canon: borrar lo inventado, sin homebrew. NET Actions según CEMK (hasta 3).
  - Elflines Online queda fuera de alcance.
- **PDFs:** `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\`, con las carpetas `Core-Rules\`, `Sourcebooks\` (Interface RED 1-4), `DLC-Supplements\` (Hardened en `Hardened-Enemies\`) y `Reference-Aids\`.
- **Publicar:**
  - GitHub CLI: `GH_CONFIG_DIR=.tools/gh-config .tools/gh/bin/gh.exe` (PR con `--squash`).
  - Beta: desde `frontend/`, `npm run build:beta`, después `git init` en `dist`, branch `gh-pages`, push -f y borrar `dist/.git`.
  - Prod: desde `frontend/`, `npm run build` y después `node scripts/firebase-with-jdk.mjs deploy --only hosting --project prod`. Reglas con `--only firestore`, siempre con OK aparte.
- **Dev server:** `.claude/launch.json` (`omni-deck-dev`, puerto 5173).

## Próximos pasos
1. Plan 28, v5.22.0: actores guardados.
2. Plan 28, v5.23.0: pedir tiradas, atacar con un actor, dar ítems y notas.
3. Sin plan: libros que quedan en la Biblioteca (⬜ 19, 🟡 3), combate (discrepancias 16-19 y 21-23). Detalle en `PROJECT_STATUS_AND_ROADMAP.md`.

## Notas y bloqueos
- **Seguridad:** `origin` sin token. Push con Git Credential Manager; `gh` con su propio login en `.tools/gh-config`. No volver a pegar tokens en la URL.
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
