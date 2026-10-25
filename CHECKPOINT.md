# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito. Qué es cada documento: `docs/INDEX.md`. Historia de versiones: `CHANGELOG_AND_ARCHITECTURE.md`. Estado de los planes: `docs/plans/README.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.
> **Regla**: "En curso" lista solo trabajo abierto. Lo terminado sale de acá; queda en el CHANGELOG.

**Última actualización**: [Claude Code · 2026-10-25] v5.0.0 y v5.0.1 mergeadas en `main` (PR #34, squash 8b58c07, OK de Giuliano). v5.0.1 publicada en gh-pages (beta, Firebase dev; deploy 4ce0b86, verificada en vivo). La prueba con el Firebase real y la estable en Firebase Hosting quedan pendientes; por ahora se trabaja con GitHub Pages y local.
**Versión de la app**: v5.0.1 en `main` @ 8b58c07 (PR #34) y en gh-pages (build:beta, proyecto `cpr-omni-deck-dev`, deploy 4ce0b86). Las ramas `claude/v5.0.0-nube` y `claude/v5.0.1-wizard` ya están dentro de `main`.
**Plan activo**: plan 16 `docs/plans/plan16-firebase-mesa-online.md` (Firebase, mesa online), APROBADO [Claude Code · 2026-10-24], con la capa de sync del plan 17 `docs/plans/plan17-sync-cuota.md`. Va antes del plan 5. Regla de Giuliano: CEMK tiene prioridad y ante cualquier discrepancia CEMK/Core se le pregunta.

## En curso (a cargo)

- [Claude Code · 2026-10-24] **v4.9.7 terminada (plan 17)** en `claude/v4.9.7-preparacion-sync`: guardado diferido (`CommittedInput`/`useCommittedField`), localStorage agrupado (`useDebouncedLocalStorage`), freno de 2.000 en IP y de 500 en Speedheal con archivo en la copia de seguridad, tope de 50 en la compra de chips y grupos local/shared en `useCombatStore`. tsc, 348 tests y build OK; verificada en el navegador. Desvíos del plan: el rol y el lifepath con menú (`StreetLabView` 655 y 2797) y las arquitecturas NET (`NetAndRolesDeckView:219`, un botón) no se tocaron porque guardan una sola vez por elección. Mergeada en `main` (PR #33, squash 35e4581). Publicada en gh-pages y verificada en vivo. La capa de sync espera la aprobación del plan 16.
- [Claude Code · 2026-10-25] **v5.0.0 + v5.0.1 en `main`** (PR #34) y la v5.0.1 en gh-pages como beta (Firebase dev). Proyecto dev configurado por Giuliano (Google, Firestore, reglas pegadas a mano). FALTA para cerrar la estable del plan 16: (a) prueba con cuentas reales (Claude in Chrome conectado, la cuenta de Giuliano y una segunda cuenta; ver "Próximos pasos"); (b) Giuliano: revisar o activar Google, Firestore y Hosting en el proyecto `cpr-omni-deck-prod` y correr `npx firebase login` en `frontend/`; (c) con su OK: deploy de reglas y publicación estable en Firebase Hosting (`deploy:prod`); gh-pages pasa a beta con la estable (decisión 13). Después: v5.1.0 (mesa compartida), v5.2.0 y `docs/FIREBASE.md` (fase 4).

## Traspaso

- Cierra: [Claude Code · 2026-10-24].
- Rama: `main` @ 8b58c07 (PR #34, v5.0.0 + v5.0.1, OK de Giuliano); gh-pages = v5.0.1 beta (OK de Giuliano). [Claude Code · 2026-10-25]
- A medias: nada en código; falta publicar (ver "En curso").
- Siguiente paso exacto: cerrar la estable del plan 16 (ver "En curso", FALTA a-c) o empezar el plan de la v5.1.0. Decisión de Giuliano [2026-10-25]: por ahora se sigue con GitHub Pages y pruebas locales; Firebase Hosting prod queda para después.
- Pendientes encontrados: (1) La mejora de armadura usa siempre 100 €$ y DV 17. (2) El bestiario no trae Trading. (4) El Range Upgrade del cyberdeck no está en el modelo. (5) Desinstalar ciberware devuelve Humanidad, sin regla del libro revisada. (6) Store de encuentro compartido: entra en el plan 16, fase v5.1.0 (une `ActiveEncounterEnemy`, `InitiativeCombatant` y `EnemySheet`). (7) El creador guarda en `loadedAmmoType` el calibre del arma ("Heavy Pistol") y el HUD espera el tipo de bala ("Basic", "AP"…), `engine/characterCreation.ts` en `addWeapon`. [Claude Code · 2026-10-25]
- Datos de prueba en localhost: Hardpoint, Wrench e Insurance quedaron con HP, dosis o vehículo cambiados al probar v4.9.2 y v4.9.3; el reloj está en Sesión 2; el personaje activo quedó en Hardpoint.
- Preguntas abiertas para Giuliano: ninguna por ahora.

## Último trabajo terminado

- [Claude Code · 2026-10-25] v5.0.1 Creador: tildes y "Rango 4" del rol, Lifepath según la era, tiradas 1d10 − 7 de amigos/enemigos/romances (Core pp. 51-52), Streetslang básica en 2 + idioma de origen aparte (Core pp. 45 y 85), clics rápidos en skills, tienda con Programas, Virtuality Goggles y munición por calibre (Core pp. 200, 344, 351), simulador NET con los programas de la ficha y sin "Ir a Resumen". tsc, 409 tests y build OK; probado en el navegador local. Detalle en el CHANGELOG. Pusheada y publicada en gh-pages con OK de Giuliano [2026-10-25]. Fichas de prueba: "Bluewire2" en localhost y "Bluewire" en gh-pages (navegador del panel).
- [Claude Code · 2026-10-24] Regla de push de `docs/PRINCIPIOS.md` aplicada en las skills `checkpoint` y `cierre-sesion` y en el agente `github-web-deployer`: nunca pushear sin el OK explícito de Giuliano, un OK por push, y `gh-pages` con un OK aparte.
- [Claude Code · 2026-10-24] Orden v2 de la documentación (PR #32): `docs/INDEX.md`, `docs/archive/`, fuente única por dato (planes en `docs/plans/README.md`, historia en el CHANGELOG), HANDOFF como mapa técnico, checkpoint corto. Sin cambios de código.
- [Claude Code · 2026-10-23] v4.9.6 Movimientos especiales de Martial Arts en el HUD (plan 15, PR #31) y v4.9.5 Martial Arts por forma (plan 14, PR #30), mergeadas y publicadas. Referencia en `docs/rules/martial-arts.md`; decisiones 39-48.
- [Claude Code · 2026-10-23] v4.9.4 Modo Novato (planes 12 y 13, PR #29), mergeada y publicada. Con esto los planes 7 y 8 quedan completos.
- Versiones anteriores: `CHANGELOG_AND_ARCHITECTURE.md`.

## Contexto permanente

- Método de canon:
  - Un scout extrae el canon del PDF (`.venv\Scripts\python.exe -I scripts\inspect_pdf_pages.py "<pdf>" a b`) a un JSON con página.
  - Un worker aplica los cambios con una spec quirúrgica. Yo audito el diff y corro tsc, tests, build y navegador.
  - El registro va en `docs/canon-audit/` con tres listas: se perdió, se ganó y se corrigió.
  - Verificación visual de páginas de PDF: pdf.js en el navegador (`scratchpad/pages/view.html` con `python -m http.server`), porque el visor de PDF del navegador no deja hacer clic.
- **Pack**: las dos copias (`frontend/src/data/` y `data/`) deben quedar idénticas. Se editan a mano y el cambio se replica en `scripts/extract_core_pack.py`.
  - **No correr el script**: está desincronizado (tiene maxdoc-mk1 y bounceback-mk1, que no están en el pack).
- Decisiones de Giuliano:
  - Todo canon: borrar lo inventado, sin homebrew. NET Actions según CEMK (hasta 3).
  - Subagentes en Sonnet. Publicar en gh-pages al cerrar cada versión.
  - IR Vol. 1-3 quedan para después, como libros nuevos.
- PDFs: `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\`.
  - Carpetas: `Core-Rules\`, `Sourcebooks\` (Interface RED Vol. 1-4), `DLC-Supplements\` y `Reference-Aids\` (Errata).
  - Going Metal está en la raíz de esa carpeta (impresa = PDF + 90). En IR4, PDF = impresa + 1.
- Dev server: `.claude/launch.json` (`omni-deck-dev`, puerto 5173). GitHub CLI portable: `scripts\gh.cmd` / `./scripts/gh`.

## Próximos pasos

[Claude Code · 2026-10-25] **Prueba de la v5.0.0 con el Firebase real (proyecto `cpr-omni-deck-dev`), pendiente.** Ya verificado sin cuenta: Google habilitado, Firestore creado, `notefuk.github.io` autorizado; Giuliano publicó las reglas a mano desde la consola. Falta probar con cuentas reales: entrar con Google en gh-pages, subir ficha, crear campaña, unirse con otra cuenta. Para que la haga Claude Code: (1) instalar y conectar Claude in Chrome en la compu de Giuliano; (2) su cuenta de Google abierta en ese Chrome y su OK explícito para entrar con ella (contraseñas y códigos los pone él); (3) una segunda cuenta de Google para hacer de jugador; (4) opcional: `npx firebase login` en `frontend/` para que Claude Code suba las reglas con `node scripts/firebase-with-jdk.mjs deploy --only firestore --project dev` cuando cambien. Si las reglas cambian antes de eso, hay que volver a pegarlas en la consola.

[Claude Code · 2026-10-24] Orden acordado con Giuliano:
1. Plan 16 (Firebase): v5.0.0 fichas en la nube + campañas + el GM ve la party; v5.1.0 mesa compartida; v5.2.0 el GM actúa sobre los jugadores.
2. Plan 5: Black Chrome completo + catálogo de vehículos, y docs con totales reales.
3. Plan 6 (en pausa): v4.7.1 Danger Gal y v4.7.2 New Gear.
4. Sin plan: combate (discrepancias 16-19 y 21-23), Modo Settings y GM Master Screen, libros nuevos. Detalle en `PROJECT_STATUS_AND_ROADMAP.md`.

## Notas y bloqueos

- Seguridad [Claude Code · 2026-10-23]: token "Gemini" revocado; `origin` sin token (`https://github.com/Notefuk/Cyberpunk-.git`). Push con Git Credential Manager (login por navegador) y `scripts/gh` con su propio login. No volver a pegar tokens en la URL.
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
