# CPR Omni-Deck — Guía para Claude Code

Companion app offline-first para **Cyberpunk RED** (Core Rulebook + CEMK 2077 + Interface RED Vol. 1-4 + Danger Gal Dossier + Going Metal), inspirada en la arquitectura desacoplada de COMP/CON (Lancer).

- Repo: `Notefuk/Cyberpunk-` · Web en vivo: https://notefuk.github.io/Cyberpunk-/ (rama `gh-pages`)
- Stack: React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand 5 (todo dentro de `frontend/`)
- Idioma: la UI, los docs y los mensajes al usuario van en **español**. Nombres de reglas/ítems oficiales se mantienen en inglés cuando así figuran en los libros (ej. *Synapse Burnout*, *Autofire*).

Principios de trabajo del agente principal (criterio, reglas solo RAW, push solo con OK de Giuliano, subagentes): [Claude Code · 2026-10-24]

@docs/PRINCIPIOS.md

## Convivencia con Antigravity

El proyecto se trabaja alternando Claude Code y Antigravity (cuando se agota el cupo de uno se sigue con el otro). Por eso:
- **No borrar ni mover** `.agent/` (config de Antigravity) ni los docs de la raíz (`AI_CONTEXT_HANDOFF.md`, `PROJECT_STATUS_AND_ROADMAP.md`, `CHANGELOG_AND_ARCHITECTURE.md`, `CONTENT_CHECKLIST.md`). Son la memoria compartida entre ambas herramientas. Lo histórico se mueve como copia textual a `docs/archive/`; nunca se borra [Claude Code · 2026-10-24].
- `.claude/` es la config de Claude Code. Si cambias una instrucción en un lado, replícala en el otro (`.agent/skills/` ↔ `.claude/skills/`, `.agent/agents/` ↔ `.claude/agents/`).
- Al cerrar cada versión, actualiza los docs de la lista "Al cerrar una versión" de `docs/INDEX.md`, para que la otra herramienta pueda retomar sin perder contexto [Claude Code · 2026-10-24].
- **Protocolo de cowork en `docs/COWORK.md`** (compartido con Antigravity): firma, inicio de sesión, ramas por herramienta y cierre de sesión. Al inicio el hook `SessionStart` (`.claude/hooks/checkpoint-start.sh`) carga `CHECKPOINT.md` en contexto; cuando Giuliano se va o cambia de herramienta, usa la skill `cierre-sesion` (checkpoint comprimido con `## Traspaso`, docs firmados, commit y push con OK de Giuliano).

## CHECKPOINT.md (obligatorio)

`CHECKPOINT.md` en la raíz es el estado vivo del trabajo, compartido con Antigravity.
- **Léelo primero** al iniciar sesión o tras una compactación de contexto.
- **Actualízalo** al terminar cada tarea, antes de compactar contexto (o cuando la conversación ya sea larga) y antes de que el usuario cambie de herramienta: último trabajo terminado, qué quedó a medias (archivos y líneas), próximos pasos y bloqueos. Mantenlo breve y reemplaza lo viejo en vez de acumular historial.
- Commitéalo junto con el trabajo al que corresponde y **pedile a Giuliano el OK para pushearlo** (nunca se pushea sin su OK, ver `docs/PRINCIPIOS.md`) [Claude Code · 2026-10-24]: un trabajo a medias que no está en GitHub se pierde (le pasó a v4.5.0 al pasar de claude.ai a Claude Code local).
- Para actualizarlo usa la skill `checkpoint`. El hook `Stop` (`.claude/hooks/checkpoint-guard.sh`) frena el cierre de un turno si hay archivos cambiados más nuevos que `CHECKPOINT.md`.

## Firma de autoría (Claude Code ↔ Antigravity)

Toda entrada o actualización de documentación se firma con quién la escribió y la fecha, para que cada herramienta sepa qué escribió la otra:
- Formato: `[Claude Code · AAAA-MM-DD]` (Antigravity firma `[Antigravity · AAAA-MM-DD]`).
- Dónde: cada actualización de `CHECKPOINT.md`, cada entrada de versión en `CHANGELOG_AND_ARCHITECTURE.md`, la cabecera `LAST UPDATED` y cada sección nueva de `AI_CONTEXT_HANDOFF.md` y `PROJECT_STATUS_AND_ROADMAP.md`, los ítems nuevos de `CONTENT_CHECKLIST.md`, la cabecera de cada plan en `docs/plans/` y las páginas de la app: cada entrada del changelog in-app (`VersionChangelogEntry`) lleva `author: 'Claude Code'`.
- En los commits, agrega la línea `Autor-IA: Claude Code` al final del mensaje; en los PRs, como primera línea de la descripción.
- Lo firmado por Antigravity se verifica contra el código antes de darlo por cierto. No borres su firma; agrega la tuya debajo.

## Planificación de features grandes (plan primero)

Para cualquier feature grande (nuevo módulo, cambio de varios archivos, cambio de reglas o del modelo de datos):

1. **Planifica antes de codear**: usa el modo plan (`/plan` o Shift+Tab en Claude Code). Explora con `cpr-scout`, no edites nada todavía.
2. **Pregunta**: antes de cerrar el plan, hazle al usuario las preguntas de alcance y diseño que falten (qué incluir, cómo se ve, qué libro/regla aplica). No asumas.
3. **Guarda el plan aprobado** en `docs/plans/planN-<slug>.md` (siguiente número libre: `plan1-...`, `plan2-...`), firmado `[Claude Code · AAAA-MM-DD]`. **Ese archivo es inmutable**: nunca se edita después de aprobado. Si el plan cambia, se crea un plan nuevo con el siguiente número que referencia al anterior.
4. **El avance va en `CHECKPOINT.md`**, no en el plan: plan activo, pasos hechos / pendientes, desvíos respecto al plan y por qué. Así cualquiera de las dos herramientas retoma sin depender del chat.

Tareas chicas (un fix, un ajuste de UI, un dato) no necesitan plan.

## Antes de tocar nada: leer contexto

Al empezar una tarea nueva, lee en este orden (solo las secciones relevantes). Qué es cada documento: `docs/INDEX.md` [Claude Code · 2026-10-24].

0. `CHECKPOINT.md` — dónde quedó el trabajo.
1. `docs/plans/README.md` — estado de cada plan (fuente única).
2. `PROJECT_STATUS_AND_ROADMAP.md` — pendientes, temas sin plan y arreglos chicos.
3. `CHANGELOG_AND_ARCHITECTURE.md` — reglas de arquitectura, árbol real de archivos y changelog (fuente única de historia).
4. `AI_CONTEXT_HANDOFF.md` — mapa técnico de archivos críticos y directivas para subagentes.
5. `CONTENT_CHECKLIST.md` — cobertura de reglas/libros por fase (`[x]`, `[~]`, `[ ]`).

**Los docs pueden estar desfasados respecto al código.** Antes de afirmar que algo existe, verifícalo con grep. Desfases conocidos:
- Los lifepaths de rol viven en `data/creation/coreLifepath.ts` (`CORE_LIFEPATH.byRole`), `ROLE_LIFEPATH_QUESTIONS` y `getApplicableRoleLifepathTables`; `characterLifepathData.ts` no existe (docs corregidos en v4.9.4) [Claude Code · 2026-10-23].
- Algunos docs citan `features/roles/NetAndRolesDeckView.tsx`; la ruta real es `features/netroles/`.

## Comandos

Todo se corre desde `frontend/`:

```bash
npm ci                    # instalar dependencias
npm run dev               # servidor de desarrollo Vite
npx tsc -b --noEmit       # chequeo de tipos
npm run build             # tsc -b && vite build -> frontend/dist
npm run lint              # oxlint (hay warnings react(purity) preexistentes en CombatHudView.tsx)
npm test                  # vitest: tests de reglas canon del motor (src/engine/__tests__)
```

Hay tests de reglas del motor con Vitest (`src/engine/__tests__/rules.test.ts`, cada caso cita su página); si cambias una regla, actualiza o agrega su test. **Definición de "terminado"**: `npx tsc -b --noEmit`, `npm test` y `npm run build` pasan con 0 errores. El aviso de chunk > 500 kB es preexistente.

Los `.bat` de la raíz (`start_app.bat`, `run_extractors.bat`, `push_to_github.bat`) son atajos de Windows del entorno original; en Linux/cloud usa los comandos de arriba.

## Arquitectura (modelo COMP/CON)

- **Datos y reglas** en `frontend/src/data/` (registros TypeScript tipados) y `.cprpack.json` (`data/core-rules.cprpack.json` y su copia `frontend/src/data/core-rules.cprpack.json`). Nunca hardcodear reglas o ítems dentro de las vistas.
- **Motores puros** en `frontend/src/engine/`: `characterEngine.ts` (HP, humanidad, derivados, filtros EMP) y `combatEngine.ts` (d10 explosivo, Xd6, ablación de SP, críticos).
- **Estado** en `frontend/src/store/`: `useCharacterStore.ts` y `useCombatStore.ts` (Zustand con persistencia en `localStorage`).
- **Vistas** en `frontend/src/features/<módulo>/`: consumidores reactivos de los stores. Las más grandes (`CombatHudView.tsx` ~8.7k líneas, `StreetLabView.tsx` ~4k) se editan de forma quirúrgica; lee solo la zona que tocas.
- **Tipos** compartidos en `frontend/src/types/cyberpunk.ts`.
- Las claves de `localStorage` llevan sufijo de versión (ej. `cpr_combat_disabled_right_modules_v1`, `cpr_combat_active_center_v3`). Si cambias la forma de un dato persistido, sube el sufijo en lugar de romper datos guardados.

### Reglas canónicas que no se cambian sin cita

- Tirada: `STAT + Skill + 1d10`; 10 explota (+1d10), 1 resta 1d10.
- Daño `Xd6` aparte; dos o más 6 = Herida Crítica (+5 daño directo a HP).
- Ablación: si daño > SP, pasa `daño - SP` a HP y el SP baja 1 (2 con munición perforante).
- HP máx `10 + 5 * ceil((BODY + WILL) / 2)`; Herida Grave (Seriously Wounded) con HP `< ceil(MaxHP/2)` (Core p. 186) con -2 global.
- Brackets de distancia en `rangeTables.ts` (Core p. 174). Críticos en `criticalInjuries.ts` (Core pp. 187-188).
- Quickhacking CEMK 2077: **sin RAM**; cada quickhack cuesta 1 NET Action, 1 por objetivo por turno, flujo de 4 pasos (Jack In, Breach Passwalls, Quickhack, Boot Out).

Todo cambio de reglas debe citar libro y página (ej. "Core p. 174", "CEMK pp. 16-18"). Si no tienes la fuente, pregunta en vez de inventar.

## Directivas Zero-Drift (heredadas de Antigravity)

1. **Sin refactors no pedidos**: no renombrar variables, reordenar imports ni "limpiar" código adyacente.
2. **Alcance de archivos**: tocar solo los archivos que la tarea necesita.
3. **Verificación de compilador** antes de dar algo por terminado (ver Comandos).
4. **Preservar comentarios** y directivas de linter existentes.
5. **No inventar archivos**: no importar nada que no exista en disco; lo del roadmap se crea primero en su carpeta asignada.

## Orquestación con subagentes (port de AGENTS.md de Antigravity)

El agente principal es el arquitecto: su contexto es caro, así que delega la carga bruta de tokens.

- **No** leas archivos largos (>150 líneas) enteros si no conoces las líneas exactas, ni hagas barridos masivos del repo, ni leas logs extensos: delega en **`cpr-scout`** (solo lectura, devuelve rutas + rangos de líneas + resumen ≤15 líneas).
- **No** escribas en persona bloques largos y mecánicos (boilerplate, migraciones de datos, catálogos): delega en **`cpr-worker`** con el Contrato de Ejecución de abajo. Nunca le des instrucciones abiertas ("arregla el módulo X").
- Al terminar el worker, revisa `git diff` y revierte cualquier cambio fuera de alcance.
- Cambios chicos y puntuales los puedes hacer tú directamente.

Flujo: **A.** Exploración con `cpr-scout` → **B.** Diseño y especificación quirúrgica (tú) → **C.** Ejecución con `cpr-worker` + auditoría del diff.

Contrato de Ejecución para `cpr-worker`:

```text
[OBJETIVO EXACTO]: <descripción precisa de la tarea>
[ARCHIVOS PERMITIDOS]: <lista explícita de archivos que puedes tocar>
[CAMBIOS REQUERIDOS]:
- En <archivo> (líneas X-Y): <cambio exacto a realizar>

[RESTRICCIONES ESTRICTAS - CERO DESVIACIÓN]:
1. PROHIBIDO modificar cualquier archivo fuera de [ARCHIVOS PERMITIDOS].
2. PROHIBIDO tocar líneas, funciones, imports o estilos no necesarios para [CAMBIOS REQUERIDOS].
3. PROHIBIDO renombrar variables, cambiar firmas públicas o "mejorar/limpiar" código adyacente.
4. PROHIBIDO eliminar comentarios o docstrings existentes.
5. Al finalizar, responde ÚNICAMENTE con archivos modificados, rangos de líneas y verificación.
```

## Flujo de versión

Cada entrega se publica como versión semántica (`vX.Y.Z`) y el commit lleva ese prefijo, ej. `v4.0.3 Descripción corta`. La skill `cpr-version-release` describe qué docs y datos in-app actualizar. El subagente `github-web-deployer` compila, sincroniza el changelog y publica.

En sesiones cloud de Claude Code se trabaja en una rama y se abre PR hacia `main`; no se hace push directo a `main` ni a `gh-pages` salvo que el usuario lo pida explícitamente.

## PDFs de reglas

Los PDFs oficiales **no están en el repo** (`*.pdf` en `.gitignore`, por tamaño y licencia). Viven en la PC del usuario, en `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\` (Core-Rules, Sourcebooks incl. Interface RED, DLC-Supplements, Adventures, Reference-Aids, CEMK). La copia local del repo donde trabaja Antigravity es `C:\Users\TeseoHeracles\cpr-omni-deck`.

En una sesión de Claude con la PC conectada (app de escritorio), los PDFs se traen al contenedor con `device_stage_files` y se leen con `scripts/inspect_pdf_pages.py`. Detalle en la skill `cpr-pdf-extractor`. Los scripts `extract_core_pack.py` y `find_sections.py` tienen rutas de Windows hardcodeadas.

## GitHub CLI portable

`gh` no está instalado en el sistema: vive en `.tools/gh/` (ignorado por git) y su configuración y login en `.tools/gh-config/`.
- PowerShell / cmd: `scripts\gh.cmd <comando>`. Git Bash: `./scripts/gh <comando>`.
- Login (lo hace el usuario, una vez por PC): `scripts\gh.cmd auth login --hostname github.com --git-protocol https --web --insecure-storage`. `--insecure-storage` guarda el token en `.tools/gh-config/hosts.yml` en lugar del Administrador de credenciales de Windows, para que todo quede dentro de la carpeta.
- Si falta `.tools/gh/` en otra PC, bajar el zip `windows_amd64` de https://github.com/cli/cli/releases, verificar el SHA256 contra `checksums.txt` y descomprimirlo en `.tools/gh/`.
