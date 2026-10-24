---
name: cpr-version-release
description: Checklist para cerrar una versión de CPR Omni-Deck (vX.Y.Z), sincronizando los 4 docs de la raíz y el changelog in-app. Úsala cuando una feature o fix está terminado y hay que registrarlo como versión nueva.
---

# Cierre de versión CPR Omni-Deck

Cada versión deja registro en los docs de la raíz **y** dentro de la app. Mantener todo sincronizado evita que la próxima sesión parta de información falsa.

## 1. Elegir número de versión

Lee la última versión en `CHANGELOG_AND_ARCHITECTURE.md` (sección `## 📜 Master Version Changelog`) y en `git log --oneline -5`.
- Patch (`v4.0.2` → `v4.0.3`): fixes, ajustes de UI, corrección de datos.
- Minor (`v4.0.x` → `v4.1.0`): sistema o módulo nuevo.
- Major: cambio de fase del roadmap.

## 2. Verificar el código

Desde `frontend/`: `npx tsc -b --noEmit` y `npm run build` con 0 errores.

## 3. Actualizar docs (solo lo que cambió)

| Archivo | Qué actualizar |
|---|---|
| `CHANGELOG_AND_ARCHITECTURE.md` | Nueva entrada arriba del changelog: `### [vX.Y.Z] - AAAA-MM-DD (Título)`, con `Category`, `Files Modified`, `What Changed`. Actualizar el árbol "Current Real Tree on Disk" si se crearon o movieron archivos. |
| `AI_CONTEXT_HANDOFF.md` | Cabecera `SYSTEM VERSION` / `LAST UPDATED`. Solo si cambiaron archivos críticos o contratos, actualizar el mapa técnico. Sin resúmenes de versión: la historia va solo al CHANGELOG [Claude Code · 2026-10-24]. |
| `PROJECT_STATUS_AND_ROADMAP.md` | Cabecera de versión y fecha, y pendientes. |
| `docs/plans/README.md` | Estado del plan (fuente única) [Claude Code · 2026-10-24]. |
| `CONTENT_CHECKLIST.md` | Marcar `[x]` / `[~]` los ítems de reglas que se completaron. |

## 4. Actualizar el changelog in-app

- `frontend/src/features/docs/SystemChangelogAndDocsView.tsx`: agregar la entrada al inicio de `LOCAL_CHANGELOG_EXTENSIONS` (mismo formato que `v4.0.2`: `version`, `date`, `summary`, `metricsBadge`, etc.) y su clave `'vX.Y.Z': true` en el estado inicial `expandedVersions`.
- `frontend/src/data/systemDocsAndChangelogData.ts`: ajustar `SYSTEM_METRICS_SUMMARY`, `ADDED_FEATURES_INVENTORY` o `PHASES_ROADMAP_OVERVIEW` si la versión cambia métricas, sistemas o fases.

Vuelve a compilar después de estos cambios.

## 5. Reglas de contenido

- Todo dato de reglas cita libro y página (ej. "Core pp. 222-226", "CEMK pp. 16-18").
- Escribir en español; nombres oficiales de reglas/ítems en inglés si así figuran en el libro.
- No describir como hecho algo que no está en el código: verifica con grep antes de escribirlo en los docs.

## 6. Commit y publicación

Mensaje de commit: `vX.Y.Z <Resumen corto de lo principal>`. Delega build + commit + push (y la web, si el usuario la pidió) al subagente `github-web-deployer`.
