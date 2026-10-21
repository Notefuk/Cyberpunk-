# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.

**Última actualización**: [Claude Code · 2026-10-21] (cierre de sesión)
**Versión de la app**: `main` = v4.6.1 (publicada en gh-pages). v4.6.2 está terminada en la rama `claude/v4.6.2-farmacia-gunmas-errata`, sin PR ni merge.
**Plan activo**: plan 5 (`docs/plans/plan5-canon-audit.md`): canonizar lo cargado, borrar lo inventado, completar, página de origen en cada ítem y registro en `docs/canon-audit/`. Bloques 1 (v4.6.1) y 2 (v4.6.2) hechos. Planes 1, 2 y 4 terminados. El plan 3 se perdió y lo reemplaza v4.7.0.

## En curso (a cargo)

- [Claude Code · 2026-10-21] v4.6.2 en la rama `claude/v4.6.2-farmacia-gunmas-errata`: falta PR, merge y gh-pages (Giuliano lo deja para la próxima sesión). Antigravity: no tocar el pack, `extract_core_pack.py` ni `expansionRulesData.ts` hasta el merge.

## Traspaso

- Cierra: [Claude Code · 2026-10-21]
- Rama y último commit: `claude/v4.6.2-farmacia-gunmas-errata` @ commit "CHECKPOINT: cierre de sesión" (pusheada: sí; e87c350 tiene el código de v4.6.2).
- A medias: nada de código. tsc, 44 tests, build y navegador OK.
- Siguiente paso exacto: abrir el PR de `claude/v4.6.2-farmacia-gunmas-errata` a `main`, mergear con squash, publicar en gh-pages (build de `frontend/dist` → force-push a `gh-pages`) y verificar en vivo.
- Después: plan 5 v4.7.0 enemigos canon (Danger Gal, Hardened, Red Chrome Cargo, armas CEMK 2077 Tamayura/Achilles/Chao y la errata del Security Officer del Core p.415).
- Preguntas abiertas para Giuliano: revocar el token de GitHub que está en la URL del remote `origin`.

## Último trabajo terminado

- [Claude Code · 2026-10-21] v4.6.2 Hornet's Pharmacy + 12 Days of Gunmas + Errata v1.25 canon (plan 5, bloque 2):
  - Se borraron 6 ítems inventados (Hover, Red Glass, Detox, Erebus, Fox, Kolokol) y se agregaron 19 canon (8 de Hornet's, 11 de Gunmas).
  - Se corrigieron Berserker, Prime Time, Sixgun, Timewarp, el Cityhunter y 5 erratas.
  - `sourcePage` en 5 tipos, visible en el Compendium (`renderSourceBookBadge(sourceBook, sourcePage)`).
  - Registro: `docs/canon-audit/v4.6.2-farmacia-gunmas-errata.md`.
- [Claude Code · 2026-10-21] v4.6.1 Cyberfists of Fury canon (PR #18, squash 5ed7296, publicada):
  - IR4 pp. 74-84: 23 formas y 46 movimientos con página; se borraron 10 formas inventadas y se agregaron 10.
  - `opposedBy` en los movimientos enfrentados; persist v2 migra los ids huérfanos.
  - Registro: `docs/canon-audit/v4.5.1-cyberfists.md`.
- Versiones anteriores (v4.0.3 a v4.6.0, setup de Claude Code y gh portable): ver `CHANGELOG_AND_ARCHITECTURE.md`.

## Contexto permanente

- Método del plan 5:
  - Un scout extrae el canon del PDF (`.venv\Scripts\python.exe -I scripts\inspect_pdf_pages.py "<pdf>" a b`) a un JSON con página.
  - Un worker aplica los cambios con una spec quirúrgica. Yo audito el diff y corro tsc, tests, build y navegador.
  - El registro va en `docs/canon-audit/` con tres listas: se perdió, se ganó y se corrigió.
- **Pack**: las dos copias (`frontend/src/data/` y `data/`) deben quedar idénticas. Se editan a mano y el cambio se replica en `scripts/extract_core_pack.py`.
  - **No correr el script**: está desincronizado (tiene maxdoc-mk1 y bounceback-mk1, que no están en el pack).
- Numeración: el plan 5 dice v4.5.1/v4.6.1/…, pero se corre un paso porque `main` ya estaba en v4.6.0. Próximas versiones: v4.7.0 enemigos, v4.8.0 Black Chrome + catálogo de vehículos (decidido: catálogo + vista simple), v4.8.1 docs.
- Decisiones de Giuliano:
  - Todo canon: borrar lo inventado, sin homebrew. NET Actions según CEMK (hasta 3).
  - Subagentes en Sonnet. Publicar en gh-pages al cerrar cada versión.
  - IR Vol. 1-3 quedan para después, como libros nuevos.
- PDFs: `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\`.
  - Carpetas: `Core-Rules\`, `Sourcebooks\` (Interface RED Vol. 1-4), `DLC-Supplements\` y `Reference-Aids\` (Errata).
  - Going Metal está en la raíz de esa carpeta (impresa = PDF + 90). En IR4, PDF = impresa + 1.
- Dev server: `.claude/launch.json` (`omni-deck-dev`, puerto 5173). GitHub CLI portable: `scripts\gh.cmd` / `./scripts/gh`.

## Próximos pasos

1. PR, merge y publicación de v4.6.2.
2. Plan 5 v4.7.0: enemigos canon.
   - Danger Gal: 16 facciones y ~118 fichas de PNJ (pp. 10-143), más el New Gear (pp. 144-149).
   - Hardened: 4 Mooks, 6 Lieutenants, 6 Mini-Bosses y el Punknaught.
   - Red Chrome Cargo, las armas CEMK 2077 (verificarlas en el zip del Mission Kit) y la errata del Security Officer.
3. Plan 5 v4.8.0: Black Chrome completo (~160 ítems, más Black Chrome+ de IR4) y catálogo de vehículos. Después, v4.8.1: totales reales en los docs.
4. Después del plan 5: modo Settings, GM Master Screen (`FixerDeckView.tsx`) y libros nuevos (IR Vol. 1-3, Gang Guide, Woodchipper…).

## Notas y bloqueos

- Seguridad: el remote `origin` tiene un token de GitHub en la URL; Giuliano debe revocarlo. `gh` ya maneja el login, así que se puede pasar el remote a una URL sin token.
- El Engine no aplica el efecto de Grafted Muscle (el +2 a BODY es solo texto en el Compendium).
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
- Los docs mencionan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`, que no existen en el código.
