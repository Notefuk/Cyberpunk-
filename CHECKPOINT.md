# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito. Qué es cada documento: `docs/INDEX.md`. Historia de versiones: `CHANGELOG_AND_ARCHITECTURE.md`. Estado de los planes: `docs/plans/README.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.
> **Regla**: "En curso" lista solo trabajo abierto. Lo terminado sale de acá; queda en el CHANGELOG.

**Última actualización**: [Claude Code · 2026-11-12] v5.25.0 (plan 30 I, arsenal de Solo of Fortune) terminada en claude/plan30-v5.25.0, sin pushear

**Versión de la app**: v5.22.0 en `main` @ 1feacac (PR #82), en la beta (gh-pages c1faf19, `index-Bo35K1XF.js`) y en Firebase prod (`index-9QyHIP8x.js`), con las reglas de `gm/actors` en dev y prod.

**Plan activo**: plan 28, modo GM (`docs/plans/plan28-modo-gm.md`), versiones v5.21.0 a v5.23.0.

## Traspaso
- Cierra: [Claude Code · 2026-11-12]
- Rama y último commit: `main` @ 59b0cd7 (pusheada: sí). El cierre de sesión queda en `claude/checkpoint-2026-11-12`, sin pushear: falta OK.
- A medias: nada en código.
- Siguiente paso exacto: crear `claude/v5.22.0-actores` desde `main` y empezar la v5.22.0 del plan 28 (actores guardados): `GmActor` en `data/gmActors.ts` y `engine/gmActors.ts`, `actorId` en `EncounterEnemy` (`store/encounterStore.ts`) y la subcolección `campaigns/{c}/actors` con reglas y tests. Hay que probar con el emulador y dos navegadores, incluida la mesa de la v5.21.0, que no se probó online.
- Preguntas abiertas para Giuliano: ninguna.

## En curso (a cargo)
- [Claude Code · 2026-11-12] **Plan 30** (`docs/plans/plan30-solo-of-fortune-acpa.md`): Solo of Fortune 2045, Interface RED Vol. 5 pp.105-147 (PDF `Sourcebooks/Interface-RED/ilide.info-interface-5-pr_…pdf`, página impresa = PDF − 1).
  - Hecho: v5.25.0 en la rama `claude/plan30-v5.25.0` (sin pushear). Arsenal en el pack, tablas de rango y Autofire de IR5 p.113, Metalgear con penalización por stat. tsc, 707 tests y build pasan; probado en local con la consola limpia.
  - Siguiente: push y PR de la v5.25.0 (con OK). Después, v5.26.0: `data/acpaData.ts` y `engine/acpa.ts` con frames, shells, tunings y las 10 ACPA (IR5 pp.133-142) y el armador en el Compendio. Luego v5.27.0 (el PJ pilotea) y v5.28.0 (enemigos en ACPA).
  - Desvíos: el pack de `data/` en la raíz quedó viejo desde la v5.3.2 y no se toca. El número 29 de plan lo tiene la sesión de Owlbear.

## Último trabajo terminado
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
