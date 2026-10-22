# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.

**Última actualización**: [Claude Code · 2026-10-22]
**Versión de la app**: v4.9.0 lista en la rama `claude/v4.9.0-roles` (sin PR). `main` = v4.8.2, publicada.
**Plan activo**: plan 8 (`docs/plans/plan8-roles-core-cemk.md`, roles y rangos Core + CEMK combinados; v4.9.0-v4.9.3). Después: v4.9.4 Modo Novato (ex v4.8.3 del plan 7) y luego vehículos/Black Chrome. En pausa: plan 6 (v4.7.1 Danger Gal y v4.7.2). Regla de Giuliano: CEMK tiene prioridad y ante cualquier discrepancia CEMK/Core se le pregunta.

## En curso (a cargo)

- [Claude Code · 2026-10-22] v4.9.0 Datos de roles por rango (plan 8) terminada y verificada (tsc, 146 tests, build, navegador) en la rama `claude/v4.9.0-roles`. Falta: PR, merge y gh-pages. Después: v4.9.1 motor de roles (`engine/roleRules.ts`), avance con IP, quitar el selector +4 del creador, conversión de Folios y migración v4. Los datos de cada rol están en `ROLE_RANKS.roles.<Rol>` (tablas sin usar todavía). Antigravity: no tocar `data/roleProgression.ts`, `data/creation/` ni `engine/cemkPort.ts` hasta el merge.
- [Claude Code · 2026-10-22] Prueba de creación de PJs (sonda del motor: 10 roles × 2 eras × Streetrat/Edgerunner × 2 lifepaths, 7 Folios y 5 Easy Mode; y un Nomad 2077 en el wizard del navegador). HP, SW, Death Save, Humanidad y dinero dan bien. Encontrado: (1) [ARREGLADO en v4.9.0, verificado en navegador con Nomad y Rockerboy] BUG lifepath Core de rol: las tablas condicionales se exigen y se tiran todas aunque no apliquen (compañero de Netrunner/Tech/Medtech/Fixer con "Trabajás solo"; Nomad tierra, aire y mar a la vez; "Why Did You Leave?" del Rockerboy); "Tirar todo" no llena las tablas "a elección" y no avisa (`engine/characterCreation.ts` validateLifepath ~L871 y `LifepathStep.tsx`). (2) DUDA para Giuliano: en 2077 el Fixer y el Exec conservan el Internal Agent (ciberware, Core p.117) aunque el Neuroport trae el Agent (RB pp. 35-36). (3) Menor: la nota del Folio (p. ej. Wrench) se muestra en la pestaña de rol de cualquier Nomad, no solo del Folio. (4) Menor: munición "Incendiary Shotgun Shell" del Medtech sin ID en el catálogo.
- [Claude Code · 2026-10-22] Cierre de v4.9.0 (plan de cierre aprobado, en `~/.claude/plans/cryptic-juggling-stonebraker.md`): Giuliano decidió las dudas 24-33 y 4 nuevas (Internal Agent y Biomonitor fuera en 2077; nota del Folio solo en su ficha; agregar Incendiary Shotgun Shell). TODO HECHO y verificado (tsc, 156 tests, build, sonda y navegador): Neuroport cubre Internal Agent y Biomonitor (alternativas "o" elegibles), munición incendiaria mapeada, nota del Folio solo en su ficha, discrepancias 24-37 y `doubts` anotadas. Falta: PR, merge y gh-pages.

## Traspaso

- Cierra: [Claude Code · 2026-10-22]
- Rama y último commit: `main` @ commit "CHECKPOINT: v4.7.0 mergeada..." (pusheada: sí). gh-pages publicada con el build de v4.7.0.
- A medias: nada.
- Siguiente paso exacto: plan 6 v4.7.1 Danger Gal: 118 fichas y 15 facciones. Extraer por tandas de facciones con `data/enemies-src/SCHEMA.md`, agregar el libro a `scripts/gen_enemies.py` para generar `frontend/src/data/enemies/dangerGal.ts` y borrar las 95 fichas danger_gal inventadas de `enemiesCatalog.ts`.
- Preguntas abiertas para Giuliano: revocar el token de GitHub que está en la URL del remote `origin`.

## Último trabajo terminado

- [Claude Code · 2026-10-22] v4.8.2 Wizard funcional (plan 7, bloque 3), mergeada (PR #23, squash 0143f1a) y publicada: motor `engine/characterCreation.ts`, wizard por pasos con borrador `cpr_creator_draft_v1`, pregens CEMK y Easy Mode, sin el demo "V".
- [Claude Code · 2026-10-22] v4.8.1 Datos canon del creador (plan 7, bloque 2), mergeada (PR #22, squash 8985aa8) y publicada: STATs, skills y paquetes de los 10 roles del Core, Neuroport canon, 5 pregens de Easy Mode, 11 pregens sin ficha borradas. Registro: `docs/canon-audit/v4.8.1-creador.md`.
- [Claude Code · 2026-10-22] v4.8.0 Guardado robusto (plan 7, bloque 1), mergeada (PR #21, squash bcaaddc) y publicada: persist v3 con migraciones, copia previa, respaldo completo, importar por archivo, premades que no vuelven.
- [Claude Code · 2026-10-22] v4.7.0 Enemigos canon + porte CEMK (plan 6, bloque 1), mergeada (PR #20, squash ea8268f) y publicada:
  - 40 fichas canon (Core 10, CEMK 14, Hardened 16) reemplazan a 36 inventadas.
  - `cemkPort.ts` aplica las reglas del Rule Book de CEMK citadas; panel GM con selector CEMK | RED.
  - Red Chrome Cargo reescrito con canon.
  - Fuentes en `data/enemies-src/` + generador `scripts/gen_enemies.py`.
  - Verificación visual con pdf.js en el navegador: `scratchpad/pages/view.html` servido con `python -m http.server` (el visor de PDF del navegador no deja hacer clic).
  - Registro: `docs/canon-audit/v4.7.0-*.md`.
- [Claude Code · 2026-10-22] v4.6.2 Hornet's Pharmacy + 12 Days of Gunmas + Errata v1.25 canon (plan 5, bloque 2), mergeada (PR #19, squash e0de28c) y publicada:
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

1. Plan 5 v4.7.0: enemigos canon.
   - Danger Gal: 16 facciones y ~118 fichas de PNJ (pp. 10-143), más el New Gear (pp. 144-149).
   - Hardened: 4 Mooks, 6 Lieutenants, 6 Mini-Bosses y el Punknaught.
   - Red Chrome Cargo, las armas CEMK 2077 (verificarlas en el zip del Mission Kit) y la errata del Security Officer.
2. Plan 5 v4.8.0: Black Chrome completo (~160 ítems, más Black Chrome+ de IR4) y catálogo de vehículos. Después, v4.8.1: totales reales en los docs.
3. Después del plan 5: modo Settings, GM Master Screen (`FixerDeckView.tsx`) y libros nuevos (IR Vol. 1-3, Gang Guide, Woodchipper…).

## Notas y bloqueos

- Seguridad: el remote `origin` tiene un token de GitHub en la URL; Giuliano debe revocarlo. `gh` ya maneja el login, así que se puede pasar el remote a una URL sin token.
- El Engine no aplica el efecto de Grafted Muscle (el +2 a BODY es solo texto en el Compendium).
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
- Los docs mencionan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`, que no existen en el código.
