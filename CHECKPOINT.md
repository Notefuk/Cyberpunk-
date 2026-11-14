# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito. Qué es cada documento: `docs/INDEX.md`. Historia de versiones: `CHANGELOG_AND_ARCHITECTURE.md`. Estado de los planes: `docs/plans/README.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.
> **Regla**: "En curso" lista solo trabajo abierto. Lo terminado sale de acá; queda en el CHANGELOG.

**Última actualización**: [Claude Code · 2026-11-14] plan 33 terminado (v5.41.0 a v5.44.0) en `claude/plan33-v5.44.0`, sin pushear

**Versión de la app**: v5.40.0 en `main` @ 4a05c4e, en la beta (gh-pages fedc9c8) y en Firebase prod (hosting `index--Iw6CGkO.js`; reglas sin cambios, con `gm/mysteries`) [Claude Code · 2026-11-14].

**Plan activo**: plan 33 (`docs/plans/plan33-going-quiet-tech-civiles.md`), v5.41.0 a v5.44.0. [Claude Code · 2026-11-14]

## Traspaso
- Cierra: [Claude Code · 2026-11-13]
- Rama y último commit: `claude/plan33-v5.44.0` (encadenada: v5.41.0 → v5.42.0 → v5.43.0 → v5.44.0, desde `claude/checkpoint-post-96`, que sale de `main` @ 08b741b). Pusheada: no — falta OK. [Claude Code · 2026-11-14]
- A medias: nada. tsc, 806 tests y build pasan en v5.40.0.
- Siguiente paso exacto: publicar el plan 33, cada paso con su OK: push de `claude/plan33-v5.44.0`, PR y merge a `main`, beta (gh-pages), deploy de reglas de Firestore (cambió `flashOfLuck` en v5.41.0) y prod. Después, el plan de equipo y vehículos (Cutiemas, Vehiclemas, VA-11 Hall-A).
- Notas: el creador guiado está en `features/gm/GuidedNpcCreator.tsx` y las plantillas en `data/npcCreationGuidelines.ts` (los puntos de STAT no cuentan LUCK). Erratas del libro guardadas tal cual: Flenser SW 13, Stringer Death Save 4; Drop y Paddles: la lista de pp.168-170 difiere de la ficha, se usa la ficha. Hay un solo pack: `frontend/src/data/core-rules.cprpack.json` (770 ítems). `scripts/extract_core_pack.py <salida.json>` escribe aparte (genera 405 ítems) y se niega a pisar el pack de la app; lo nuevo se copia a mano.
- Preguntas abiertas para Giuliano: ninguna.

## En curso (a cargo)
- [Claude Code · 2026-11-14] **Plan 33** (`docs/plans/plan33-going-quiet-tech-civiles.md`). PDFs en `Documents/CP RED TEST ANTIGRAVITY/DLC-Supplements/` (página impresa = índice).
  - Hecho: plan guardado. v5.41.0: ítems `gq-*`, `engine/flashOfLuck.ts` + `FlashOfLuckPanel` (campo `flashOfLuck` en la ficha, `flashOfLuckEnabled` en useCombatStore, `flashOfLuck` en la campaña y en `firestore.rules`), `engine/netStealth.ts` + `NetStealthPanel`. v5.42.0: `data/inventedTechUpgrades.ts` + `features/roles/InventedTechUpgradesPanel.tsx` (en NET & ROLES → rol Tech), campo `inventedUpgrades` en la ficha, etiqueta 🧪 en el Street Lab. v5.43.0: `data/cemkCyberwareEnhancements.ts` + `CyberwareEnhancementsPanel` (Ripperdoc) + `CritChoicePicker` (HUD), campo `cyberwareEnhancements` en la ficha, `ignoreSpBelow7`/`extraAblation` en `calculateIncomingImpact`, arma `monowire-2077`. v5.44.0: `data/enemies-src/everyday-people.json` + `BOOK_SPECS` (20 civiles, `abbreviated`), `enemyStatLabel` ("—"), botón "Civiles" en el bestiario, nivel `civilian` en `npcCreationGuidelines.ts`.
  - Siguiente: publicar con OK (push, PR, merge, beta, reglas, prod).
  - Decisiones: civiles abreviados sin inventar STATs; Tech Upgrades solo catálogo y precio; enhancements solo 2077; Flash of Luck apagada, la prende el GM.

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
