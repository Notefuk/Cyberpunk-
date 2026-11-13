# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito. Qué es cada documento: `docs/INDEX.md`. Historia de versiones: `CHANGELOG_AND_ARCHITECTURE.md`. Estado de los planes: `docs/plans/README.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.
> **Regla**: "En curso" lista solo trabajo abierto. Lo terminado sale de acá; queda en el CHANGELOG.

**Última actualización**: [Claude Code · 2026-11-13] v5.34.0 publicada en todos lados: beta, reglas de Firestore y hosting de prod

**Versión de la app**: v5.34.0 en `main` @ 87b1091, en la beta (gh-pages 2a8327a, `index-7aUPZNE2.js`) y en Firebase prod (hosting `index-n44uUOG_.js` y reglas con `gm/mysteries`). [Claude Code · 2026-11-13]

**Plan activo**: ninguno. El plan 31 (resto del Interface RED Vol. 5, v5.29.0 a v5.34.0) está terminado y publicado. [Claude Code · 2026-11-13]

## Traspaso
- Cierra: [Claude Code · 2026-11-12]
- Rama y último commit: `main` @ 59b0cd7 (pusheada: sí). El cierre de sesión queda en `claude/checkpoint-2026-11-12`, sin pushear: falta OK.
- A medias: nada en código.
- Siguiente paso exacto: crear `claude/v5.22.0-actores` desde `main` y empezar la v5.22.0 del plan 28 (actores guardados): `GmActor` en `data/gmActors.ts` y `engine/gmActors.ts`, `actorId` en `EncounterEnemy` (`store/encounterStore.ts`) y la subcolección `campaigns/{c}/actors` con reglas y tests. Hay que probar con el emulador y dos navegadores, incluida la mesa de la v5.21.0, que no se probó online.
- Preguntas abiertas para Giuliano: ninguna.

## En curso (a cargo)
- [Claude Code · 2026-11-13] **Plan 31** (`docs/plans/plan31-interface-red-5-resto.md`): resto del Interface RED Vol. 5 (PDF `Sourcebooks/Interface-RED/ilide.info-interface-5-pr_…pdf`, página impresa = índice del PDF en base 0).
  - Hecho (todo el plan): v5.29.0 (catálogos), v5.30.0 (Screamsheet, Gunpath y Referencias IR5), v5.31.0 (mantenimiento), v5.32.0 (Focus y tracker de misterios, con `gm/mysteries` en `firestore.rules`), v5.33.0 (Cyberpets) y v5.34.0 (presupuesto operativo, pestaña Solo of Fortune y NET McAlister). Mergeado a `main` con el PR #91 (squash 87b1091). tsc, 785 tests, 52 de reglas y build pasan; probado en local.
  - Publicado: beta (gh-pages 2a8327a), reglas de Firestore y hosting de prod. El aviso `[W] 125:21 Invalid type` del compilador de reglas es viejo (`writerOk(null, …)`, 2026-10-25) y no bloquea. Las ramas `claude/plan31-v5.29.0` a `v5.34.0` se pueden borrar.
  - Desvíos: el pack de `data/` en la raíz quedó viejo desde la v5.3.2 y no se toca. El Hiring Hall trae 13 avisos, no 14. Gunpath: el GM elige cuántos attachments. Durabilidad: la regla del 1 natural queda como texto. Misterios: el GM escribe el total de la Evidence Check. Cyberpets: se compran desde la ficha. Kelly McAlister va como bloque en la aventura, no en el bestiario (el libro no da sus stats completos). Nueva regla en `CLAUDE.md`: resumen corto de cada cosa en planes y cierres.

## Último trabajo terminado
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
