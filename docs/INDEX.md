# Índice de la documentación

[Claude Code · 2026-10-24]

Qué es cada documento, cuándo se toca y quién lo lee. Si dudas dónde va algo, la respuesta está en la columna "Va acá".

Regla general: **cada dato vive en un solo lugar**. Los demás documentos enlazan, no copian.

## 1. Dónde estamos (leer al empezar)

| Documento | Va acá | Cuándo se toca |
|---|---|---|
| `CHECKPOINT.md` | Trabajo abierto, traspaso entre herramientas, pendientes chicos, contexto permanente | Cada paso terminado |
| `docs/plans/README.md` | **Estado de cada plan** (fuente única) | Al aprobar, avanzar o cerrar un plan |
| `docs/plans/planN-*.md` | El plan aprobado. Inmutable | Solo al aprobarlo |
| `PROJECT_STATUS_AND_ROADMAP.md` | Pendientes de planes aprobados, temas sin plan, arreglos chicos, contratos técnicos | Al cerrar un plan o anotar un tema nuevo |

## 2. Qué se hizo y cómo está armado

| Documento | Va acá | Cuándo se toca |
|---|---|---|
| `CHANGELOG_AND_ARCHITECTURE.md` | **Historia de versiones** (fuente única, v4.0.0 en adelante) + reglas de arquitectura y árbol de archivos | Cada versión |
| `AI_CONTEXT_HANDOFF.md` | Mapa técnico: archivos críticos y directivas para subagentes. Sin historia | Cuando cambian archivos críticos o contratos |
| `CONTENT_CHECKLIST.md` | Qué reglas y libros están cubiertos (`[x]`, `[~]`, `[ ]`) | Cuando entra o se corrige contenido |
| Changelog in-app (`features/docs/SystemChangelogAndDocsView.tsx`) | Lo que ven los usuarios, con badge de autor | Cada versión |
| `README.md` | Presentación del repo | Rara vez |

## 3. Reglas y canon

| Documento | Va acá |
|---|---|
| `docs/canon-audit/discrepancias-cemk-core.md` | Decisiones de Giuliano numeradas (CEMK contra Core) |
| `docs/canon-audit/vX.Y.Z-*.md` | Qué se comparó contra cada libro en esa versión: se perdió, se ganó, se corrigió |
| `docs/rules/` | Referencias de reglas por sistema (hoy: Martial Arts) |
| `data/enemies-src/SCHEMA.md` | Formato de las fichas de enemigos |

## 4. Instrucciones para las IAs

| Documento | Para quién |
|---|---|
| `CLAUDE.md` | Claude Code |
| `.agent/AGENTS.md` y el `AGENTS.md` de la carpeta de PDFs | Antigravity |
| `docs/COWORK.md` | Las dos: firma, inicio, ramas y cierre de sesión |
| `.claude/skills/`, `.agent/skills/` | Skills: checkpoint, cierre-sesion, cpr-version-release, cpr-pdf-extractor |
| `.claude/agents/`, `.agent/agents/` | Subagentes: scout, worker, deployer |

## 5. Archivo

`docs/archive/`: copias textuales de secciones viejas que ya no se actualizan (changelog v1.0 a v3.9, resúmenes de handoff v3.9 a v4.6, roadmaps de fases 4 y 5, estado de v4.0.2). Se consultan, no se editan. Ver `docs/archive/README.md`.

## Al cerrar una versión, qué se actualiza

1. `CHANGELOG_AND_ARCHITECTURE.md`: entrada nueva arriba del changelog.
2. Changelog in-app con `author`.
3. `docs/plans/README.md`: estado del plan.
4. `CONTENT_CHECKLIST.md` si entró contenido.
5. `AI_CONTEXT_HANDOFF.md` solo si cambiaron archivos críticos o contratos. Cabecera `SYSTEM VERSION` siempre.
6. `PROJECT_STATUS_AND_ROADMAP.md`: cabecera de versión y pendientes.
7. `CHECKPOINT.md`: sacar lo terminado de "En curso".
