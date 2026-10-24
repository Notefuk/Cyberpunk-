# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito. Qué es cada documento: `docs/INDEX.md`. Historia de versiones: `CHANGELOG_AND_ARCHITECTURE.md`. Estado de los planes: `docs/plans/README.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.
> **Regla**: "En curso" lista solo trabajo abierto. Lo terminado sale de acá; queda en el CHANGELOG.

**Última actualización**: [Claude Code · 2026-10-24] v5.0.0 en curso en `claude/v5.0.0-nube`: etapa 1 hecha (base de Firebase y emulador con JDK 21 portátil); etapas 2 (login) y 3a (motor de sync puro) en manos de workers.
**Versión de la app**: v4.9.7 (en `main`, squash 35e4581, PR #33; publicada en gh-pages y verificada en vivo)
**Plan activo**: plan 16 `docs/plans/plan16-firebase-mesa-online.md` (Firebase, mesa online), APROBADO [Claude Code · 2026-10-24], con la capa de sync del plan 17 `docs/plans/plan17-sync-cuota.md`. Va antes del plan 5. Regla de Giuliano: CEMK tiene prioridad y ante cualquier discrepancia CEMK/Core se le pregunta.

## En curso (a cargo)

- [Claude Code · 2026-10-24] **v4.9.7 terminada (plan 17)** en `claude/v4.9.7-preparacion-sync`: guardado diferido (`CommittedInput`/`useCommittedField`), localStorage agrupado (`useDebouncedLocalStorage`), freno de 2.000 en IP y de 500 en Speedheal con archivo en la copia de seguridad, tope de 50 en la compra de chips y grupos local/shared en `useCombatStore`. tsc, 348 tests y build OK; verificada en el navegador. Desvíos del plan: el rol y el lifepath con menú (`StreetLabView` 655 y 2797) y las arquitecturas NET (`NetAndRolesDeckView:219`, un botón) no se tocaron porque guardan una sola vez por elección. Mergeada en `main` (PR #33, squash 35e4581). Publicada en gh-pages y verificada en vivo. La capa de sync espera la aprobación del plan 16.
- [Claude Code · 2026-10-24] **v5.0.0 en curso** en `claude/v5.0.0-nube` (sin pushear). Proyectos Firebase `cpr-omni-deck-dev` y `cpr-omni-deck-prod` creados por Giuliano; configs en `frontend/.env.beta` y `frontend/.env.production`. Etapas: (1) HECHA, commits da7a6ab y caf7a80: dependencias, `firebase.json`, `.firebaserc` (demo-cpr-omni-deck por defecto), reglas cerradas, `sync/firebaseConfig.ts`, `sync/firebaseClient.ts` (import dinámico), `npm run emulators` con el JDK 21 de `.tools/jdk-21` vía `scripts/firebase-with-jdk.mjs`. (2) EN CURSO: `sync/authStore.ts`, pestaña MESA // CAMPAÑA (`features/cloud/CloudTableView.tsx`), `CloudStatusChip`. (3a) EN CURSO: motor puro en `sync/` (diff, writeQueue, quotaGuard, characterSync, fakeFirestore). Faltan: 3b cableado con Firestore y subida de fichas, 4 reglas con tests, 5 campañas y party, 6 celulares, 7 pruebas y cierre. Si se corta: revisar `git status` en la rama; lo no commiteado es de los workers de las etapas 2 y 3a.

## Traspaso

- Cierra: [Claude Code · 2026-10-24].
- Rama: `claude/v5.0.0-nube` @ caf7a80 (pusheada: no — falta OK). `main` @ 191b647, pusheada.
- A medias: etapas 2 y 3a de la v5.0.0 (workers); ver "En curso".
- Siguiente paso exacto: revisar los diffs de las etapas 2 y 3a, commitearlos y seguir con la 3b (cablear el motor con Firestore real y el store de fichas).
- Pendientes encontrados: (1) La mejora de armadura usa siempre 100 €$ y DV 17. (2) El bestiario no trae Trading. (3) Desborde horizontal en celular: Street Lab, barra de pestañas de la vista de roles y el HUD (760 px a 375). (4) El Range Upgrade del cyberdeck no está en el modelo. (5) Desinstalar ciberware devuelve Humanidad, sin regla del libro revisada. (6) Store de encuentro compartido: entra en el plan 16, fase v5.1.0 (une `ActiveEncounterEnemy`, `InitiativeCombatant` y `EnemySheet`).
- Datos de prueba en localhost: Hardpoint, Wrench e Insurance quedaron con HP, dosis o vehículo cambiados al probar v4.9.2 y v4.9.3; el reloj está en Sesión 2; el personaje activo quedó en Hardpoint.
- Preguntas abiertas para Giuliano: ninguna.

## Último trabajo terminado

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

[Claude Code · 2026-10-24] Orden acordado con Giuliano:
1. Plan 16 (Firebase): v5.0.0 fichas en la nube + campañas + el GM ve la party; v5.1.0 mesa compartida; v5.2.0 el GM actúa sobre los jugadores.
2. Plan 5: Black Chrome completo + catálogo de vehículos, y docs con totales reales.
3. Plan 6 (en pausa): v4.7.1 Danger Gal y v4.7.2 New Gear.
4. Sin plan: combate (discrepancias 16-19 y 21-23), Modo Settings y GM Master Screen, libros nuevos. Detalle en `PROJECT_STATUS_AND_ROADMAP.md`.

## Notas y bloqueos

- Seguridad [Claude Code · 2026-10-23]: token "Gemini" revocado; `origin` sin token (`https://github.com/Notefuk/Cyberpunk-.git`). Push con Git Credential Manager (login por navegador) y `scripts/gh` con su propio login. No volver a pegar tokens en la URL.
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
