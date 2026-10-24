# Protocolo de cowork: Claude Code ↔ Antigravity

> [Claude Code · 2026-10-21] Creado a pedido de Giuliano. Las dos herramientas lo siguen igual; si una lo cambia, firma el cambio debajo.

Claude Code y Antigravity (Google) trabajan sobre el mismo repo, a veces el mismo día. Ninguna ve el chat de la otra: **todo lo que la otra necesita saber tiene que quedar escrito en el repo y pusheado**.

> [Claude Code · 2026-10-24] Qué es cada documento y dónde va cada dato: `docs/INDEX.md`. Cada dato vive en un solo lugar; lo histórico va a `docs/archive/` sin borrarse.

## 1. Firma: quién escribió qué

Todo texto que se agrega o cambia en docs, changelogs, planes o páginas de la app lleva autor y fecha.

| Dónde | Cómo se firma |
|---|---|
| `CHECKPOINT.md` | Línea "Última actualización" y cada viñeta nueva: `[Claude Code · AAAA-MM-DD]` / `[Antigravity · AAAA-MM-DD]` |
| `CHANGELOG_AND_ARCHITECTURE.md` | Cada entrada de versión, en su encabezado |
| `AI_CONTEXT_HANDOFF.md`, `PROJECT_STATUS_AND_ROADMAP.md` | Cabecera `LAST UPDATED` y cada sección nueva |
| `docs/plans/README.md` | Cada cambio de estado de un plan [Claude Code · 2026-10-24] |
| `CONTENT_CHECKLIST.md` | Cada ítem o sección nueva |
| `docs/plans/*.md` | Cabecera del plan (autor y fecha de aprobación). El plan es inmutable: el avance va en `CHECKPOINT.md` |
| Changelog in-app (`VersionChangelogEntry`) | Campo `author: 'Claude Code' \| 'Antigravity'`; la app lo muestra como badge `✍ autor` |
| Commits | Última línea del mensaje: `Autor-IA: Claude Code` / `Autor-IA: Antigravity` |
| PRs | Primera línea de la descripción: `Autor-IA: ...` |

Reglas:
- Nunca borres la firma de la otra herramienta. Si corriges algo suyo, deja su firma y agrega la tuya debajo con lo que cambiaste.
- Lo que firmó la otra herramienta se **verifica contra el código** antes de darlo por cierto.

## 2. Inicio de sesión

1. `git fetch` y `git pull` en la rama de trabajo (normalmente `main`).
2. Leer `CHECKPOINT.md` entero. La sección **Traspaso** dice qué dejó la sesión anterior y quién.
3. Si "En curso" está a cargo de la otra herramienta, **no tocar esos archivos** sin que Giuliano lo pida.
4. Verificar que lo que el checkpoint da por hecho existe en el código (rama, commit, archivos).
5. Anotar en "En curso" qué vas a hacer, con tu firma y la rama.

## 3. Durante el trabajo

- Una tarea, una rama: `claude/<tema>` o `antigravity/<tema>`. Nada de trabajar las dos en la misma rama a la vez.
- Al cerrar cada paso: actualizar `CHECKPOINT.md` y commitear. Pushear seguido: lo que no está en GitHub no existe para la otra herramienta (así se perdió v4.5.0 en claude.ai). Claude Code pide el OK de Giuliano antes de cada push [Claude Code · 2026-10-24].
- Planes grandes: van primero a `docs/plans/` firmados; el avance va en `CHECKPOINT.md`, no en el plan.

## 4. Cierre de sesión (Giuliano se va, se corta o se cambia de herramienta)

Claude Code usa la skill `cierre-sesion`; Antigravity sigue `.agent/skills/cierre-sesion/SKILL.md`. Las dos hacen lo mismo:
1. Terminar o dejar en un punto estable el paso actual (que compile).
2. `CHECKPOINT.md` comprimido: reemplazar lo viejo, no acumular. Completar la sección **Traspaso** (quién cierra, fecha, rama y último commit, qué quedó a medias con archivos y líneas, siguiente paso exacto, preguntas abiertas para Giuliano).
3. Docs firmados si se cerró una versión: la lista "Al cerrar una versión" de `docs/INDEX.md` [Claude Code · 2026-10-24].
4. Commit firmado y **push** de la rama (Claude Code, con OK de Giuliano [Claude Code · 2026-10-24]). Si hay una rama sin mergear, dejar su nombre en el Traspaso.
5. Decirle a Giuliano en 3-5 líneas dónde quedó todo y cuál es el primer paso de la próxima sesión.
