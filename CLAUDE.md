# CPR Omni-Deck — Guía para Claude Code

Companion app offline-first para **Cyberpunk RED** (Core Rulebook + CEMK 2077 + Interface RED Vol. 1-4 + Danger Gal Dossier + Going Metal), inspirada en la arquitectura desacoplada de COMP/CON (Lancer).

- Repo: `Notefuk/Cyberpunk-` · Web en vivo: https://notefuk.github.io/Cyberpunk-/ (rama `gh-pages`)
- Stack: React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand 5 (todo dentro de `frontend/`)
- Idioma: la UI, los docs y los mensajes al usuario van en **español**. Nombres de reglas/ítems oficiales se mantienen en inglés cuando así figuran en los libros (ej. *Synapse Burnout*, *Autofire*).

## Convivencia con Antigravity

El proyecto se trabaja alternando Claude Code y Antigravity (cuando se agota el cupo de uno se sigue con el otro). Por eso:
- **No borrar ni mover** `.agent/` (config de Antigravity) ni los docs de la raíz (`AI_CONTEXT_HANDOFF.md`, `PROJECT_STATUS_AND_ROADMAP.md`, `CHANGELOG_AND_ARCHITECTURE.md`, `CONTENT_CHECKLIST.md`). Son la memoria compartida entre ambas herramientas.
- `.claude/` es la config de Claude Code. Si cambias una instrucción en un lado, replícala en el otro (`.agent/skills/` ↔ `.claude/skills/`, `.agent/agents/` ↔ `.claude/agents/`).
- Al cerrar cada versión, deja `AI_CONTEXT_HANDOFF.md` al día para que la otra herramienta pueda retomar sin perder contexto.

## Antes de tocar nada: leer contexto

Al empezar una tarea nueva, lee en este orden (solo las secciones relevantes, son archivos largos):

1. `AI_CONTEXT_HANDOFF.md` — qué se hizo en las últimas versiones y el roadmap inmediato (Fase 4).
2. `PROJECT_STATUS_AND_ROADMAP.md` — estado por módulo y fases futuras.
3. `CHANGELOG_AND_ARCHITECTURE.md` — reglas de arquitectura, árbol real de archivos y changelog maestro.
4. `CONTENT_CHECKLIST.md` — cobertura de reglas/libros por fase (`[x]`, `[~]`, `[ ]`).

**Los docs pueden estar desfasados respecto al código.** Antes de afirmar que algo existe, verifícalo con grep. Desfases conocidos:
- `AI_CONTEXT_HANDOFF.md` menciona `characterLifepathData.ts` y `ROLE_SPECIFIC_LIFEPATHS`: ese archivo/símbolo no existe; los lifepaths de rol viven en otros módulos de `src/data/`.
- Algunos docs citan `features/roles/NetAndRolesDeckView.tsx`; la ruta real es `features/netroles/`.

## Comandos

Todo se corre desde `frontend/`:

```bash
npm ci                    # instalar dependencias
npm run dev               # servidor de desarrollo Vite
npx tsc -b --noEmit       # chequeo de tipos
npm run build             # tsc -b && vite build -> frontend/dist
npm run lint              # oxlint (hay warnings react(purity) preexistentes en CombatHudView.tsx)
```

No hay tests automatizados. **Definición de "terminado"**: `npx tsc -b --noEmit` y `npm run build` pasan con 0 errores. El aviso de chunk > 500 kB es preexistente.

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
- HP máx `10 + 5 * ceil((BODY + WILL) / 2)`; Herida Grave a `<= ceil(MaxHP/2)` con -2 global.
- Brackets de distancia en `rangeTables.ts` (Core p. 174). Críticos en `criticalInjuries.ts` (Core pp. 187-188).
- Quickhacking CEMK 2077: **sin RAM**; cada quickhack cuesta 1 NET Action, 1 por objetivo por turno, flujo de 4 pasos (Jack In, Breach Passwalls, Quickhack, Boot Out).

Todo cambio de reglas debe citar libro y página (ej. "Core p. 174", "CEMK pp. 16-18"). Si no tienes la fuente, pregunta en vez de inventar.

## Directivas Zero-Drift (heredadas de Antigravity)

1. **Sin refactors no pedidos**: no renombrar variables, reordenar imports ni "limpiar" código adyacente.
2. **Alcance de archivos**: tocar solo los archivos que la tarea necesita.
3. **Verificación de compilador** antes de dar algo por terminado (ver Comandos).
4. **Preservar comentarios** y directivas de linter existentes.
5. **No inventar archivos**: no importar nada que no exista en disco; lo del roadmap se crea primero en su carpeta asignada.

## Flujo de versión

Cada entrega se publica como versión semántica (`vX.Y.Z`) y el commit lleva ese prefijo, ej. `v4.0.3 Descripción corta`. La skill `cpr-version-release` describe qué docs y datos in-app actualizar. El subagente `github-web-deployer` compila, sincroniza el changelog y publica.

En sesiones cloud de Claude Code se trabaja en una rama y se abre PR hacia `main`; no se hace push directo a `main` ni a `gh-pages` salvo que el usuario lo pida explícitamente.

## PDFs de reglas

Los PDFs oficiales **no están en el repo** (`*.pdf` en `.gitignore`, por tamaño y licencia). En Antigravity vivían en `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\` y los scripts de `scripts/` tienen esas rutas de Windows hardcodeadas. Ver la skill `cpr-pdf-extractor`. El acceso a los PDFs desde Claude Code está pendiente de configurar.
