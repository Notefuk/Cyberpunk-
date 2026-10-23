# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.

**Última actualización**: [Claude Code · 2026-10-23] v4.9.5 mergeada y publicada; v4.9.6 en curso.
**Versión de la app**: v4.9.5 (en `main`, squash 46948ba, PR #30; publicada en gh-pages y verificada en vivo)
**Plan activo**: plan 14, Martial Arts completo (`docs/plans/plan14-martial-arts.md`, aprobado): paso 0 auditoría canon, v4.9.5 creador/ficha/referencia, v4.9.6 movimientos especiales automáticos [Claude Code · 2026-10-23]. Estado de todos los planes: `PROJECT_STATUS_AND_ROADMAP.md`, sección 0. Regla de Giuliano: CEMK tiene prioridad y ante cualquier discrepancia CEMK/Core se le pregunta.

## En curso (a cargo)

- [Claude Code · 2026-10-23] Plan 14 Martial Arts: paso 0 y v4.9.5 MERGEADA (PR #30) y PUBLICADA. v4.9.6 (movimientos especiales automáticos en el HUD) EN CURSO en la rama `claude/v4.9.6-martial-arts-hud`. El HUD no tiene blanco (scout): Giuliano decidió plan 15 (`docs/plans/plan15-v496-martial-moves-hud.md`, aprobado): requisitos, una vez por turno, tirada y tarjeta "Efectos para aplicar", sin aplicar nada solo; store de encuentro compartido queda como plan futuro; decisiones 47-48. Paso actual: worker A (datos estructurados + motor) y worker B (store + HUD).
- [Claude Code · 2026-10-22] v4.9.0 Datos de roles por rango (plan 8) MERGEADA (PR #24) y PUBLICADA. Siguiente: v4.9.1 motor de roles (`engine/roleRules.ts`: NET Actions por rango, DV de Quickhack, mejor Reach, costos de IP), avance con IP (IP nuevos en 0, modo GM), quitar el selector +4 del creador, reparto inicial de los Folios aplicado a la ficha y migración de persistencia v4, en rama `claude/v4.9.1-*`. Datos en `ROLE_RANKS.roles.<Rol>`; reglas ya decididas en discrepancias 24-37.
- [Claude Code · 2026-10-22] v4.9.1 (plan 9) MERGEADA (PR #25) y PUBLICADA. Siguiente: v4.9.2 herramientas de rol de combate (Solo en el HUD, Netrunner con `engine/roleRules.ts`, Medtech con Speedheal híbrido, Nomad con Moto). Pendiente previo: desborde horizontal de Street Lab en celular (ya estaba en v4.9.0).
- [Claude Code · 2026-10-23] v4.9.2 (plan 10) MERGEADA (PR #26) y PUBLICADA. Damage Deflection después de armadura confirmado por Giuliano. Siguiente: v4.9.3 herramientas de rol sociales (Rockerboy, Fixer, Media, Exec, Lawman; tablas en `ROLE_RANKS.roles.<Rol>.tables`).
- [Claude Code · 2026-10-23] v4.9.3 (plan 11) MERGEADA (PR #27) y PUBLICADA. Con esto el plan 8 (roles Core + CEMK, v4.9.0-v4.9.3) queda completo. Siguiente: v4.9.4 Modo Novato (ex v4.8.3 del plan 7), que necesita plan nuevo.
- [Claude Code · 2026-10-23] v4.9.4 (planes 12 y 13) MERGEADA (PR #29) y PUBLICADA: Modo Novato, STATs del Core p.72, Grafted Muscle (+2 BODY, tope 10), ciberware repetible, Thorn con BODY base 8 (migración v5), cita CEMK RB y docs de lifepath. Con esto el plan 7 queda completo.
- [Claude Code · 2026-10-22] Cierre de v4.9.0 (plan de cierre aprobado, en `~/.claude/plans/cryptic-juggling-stonebraker.md`): Giuliano decidió las dudas 24-33 y 4 nuevas (Internal Agent y Biomonitor fuera en 2077; nota del Folio solo en su ficha; agregar Incendiary Shotgun Shell). TODO HECHO y verificado (tsc, 156 tests, build, sonda y navegador): Neuroport cubre Internal Agent y Biomonitor (alternativas "o" elegibles), munición incendiaria mapeada, nota del Folio solo en su ficha, discrepancias 24-37 y `doubts` anotadas. Falta: PR, merge y gh-pages.

## Traspaso

- Cierra: [Claude Code · 2026-10-23].
- Rama: `main` @ aef92c7 + este checkpoint (pusheada). v4.9.4 publicada en gh-pages.
- A medias: nada.
- Siguiente paso exacto: v4.9.6 del plan 14: datos estructurados de los movimientos (`req`, `effects[]`), `engine/martialArtsRules.ts`, registro del turno en `useCombatStore` y aplicación de efectos en el HUD.
- Datos de prueba en localhost: Hardpoint, Wrench e Insurance quedaron con HP, dosis o vehículo cambiados al probar v4.9.2 y v4.9.3; el reloj está en Sesión 2; el personaje activo quedó en Hardpoint.
- Preguntas abiertas para Giuliano: revocar el token de GitHub del remote `origin`.

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

[Claude Code · 2026-10-23] Orden acordado; el detalle está en `PROJECT_STATUS_AND_ROADMAP.md`, sección 0.
1. v4.9.4 Modo Novato (plan 7): plan 12, lo siguiente.
2. Black Chrome completo + catálogo de vehículos, y docs con totales reales (plan 5).
3. v4.7.1 Danger Gal y v4.7.2 New Gear (plan 6, en pausa).
4. Sin plan: combate (discrepancias 16-19 y 21-23), fichas entre dispositivos, modo Settings y GM Master Screen, libros nuevos.

## Notas y bloqueos

- Seguridad: el remote `origin` tiene un token de GitHub en la URL; Giuliano debe revocarlo. `gh` ya maneja el login, así que se puede pasar el remote a una URL sin token.
- [Claude Code · 2026-10-23] Desde v4.9.4 el motor aplica Grafted Muscle (+2 BODY por instalación, tope 10, Core p.114) con `engine/cyberwareEffects.ts`.
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
- [ARREGLADO en v4.9.4, Claude Code · 2026-10-23] Los docs mencionaban `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`; ahora nombran `coreLifepath.ts` y compañía.
