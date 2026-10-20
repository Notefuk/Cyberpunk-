# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.

**Última actualización**: [Claude Code · 2026-10-20]
**Versión de la app**: v4.1.0
**Plan activo**: `docs/plans/plan1-auditoria-core.md` (arreglos de la auditoría general, 5 fases v4.0.3 → v4.2.1)

## Último trabajo terminado

- [Claude Code · 2026-10-20] v4.1.0 (plan 1, fase 2): Mortally Wounded, botón Tirar Death Save, críticos automáticos en la calculadora, Cracked Skull x3, EMP efectiva. Desvío: B11 queda como texto (objetivo es PNJ).
- [Claude Code · 2026-10-20] v4.0.3 (plan 1, fase 1): tablas de críticos canon Core pp. 187-188 con re-tirada, Neural Link 500eb, munición Smart, Asp ATK 2, `<` de Seriously Wounded en CLAUDE.md.
- [Claude Code · 2026-10-20] Migración de las instrucciones de Antigravity a Claude Code (PRs #1-#4), `CHECKPOINT.md`, convención de firma de autoría y flujo de planificación con `docs/plans/`.
  - `CLAUDE.md`, subagentes `.claude/agents/` (`cpr-scout` Haiku, `cpr-worker` Sonnet, `github-web-deployer` Haiku) y skills `.claude/skills/` (`cpr-pdf-extractor`, `cpr-version-release`).
  - `.agent/` queda como config de Antigravity, con copia de `AGENTS.md`, `gemini-scout` y `gemini-worker`.
- [Claude Code · 2026-10-20] Acceso a los PDFs desde Claude verificado: se leyó el Core Rulebook p. 174 trayéndolo desde la PC del usuario.

## En curso

- [Claude Code · 2026-10-20] Plan 1 aprobado. Fases: 1 ✓ v4.0.3 críticos/equipo canon · 2 ✓ v4.1.0 Mortally Wounded + Death Saves + EMP · 3 ○ v4.1.1 bugs del store · 4 ○ v4.2.0 combate unificado · 5 ○ v4.2.1 deuda técnica.
- Auditoría de expansiones (CEMK 2077, Interface RED, Going Metal) en curso, solo lectura; sus arreglos irán en un plan 2.
- Pendiente del usuario: qué hacer con los modos de carga sin fuente (R10, `engine/characterEngine.ts:12-41`).

## Próximos pasos

1. Ejecutar plan 1, fase 3 (v4.1.1): bugs del store (B2 FBC reversible, B3 HP máx con BODY efectivo, B4 parseo HL, B12, B13, version+migrate).
2. Fase 4: modo Settings para activar o desactivar módulos (FBC/Going Metal, Garaje, Quickhacking 2077, Dojo, NET). Ver `AI_CONTEXT_HANDOFF.md` §4.
3. GM Master Screen (`FixerDeckView.tsx`).
4. Scripts de extracción: pasar las rutas Windows hardcodeadas (`scripts/extract_core_pack.py`, `scripts/find_sections.py`) a rutas configurables.

## Notas y bloqueos

- Antes de volver a Antigravity, hacer `git pull` en `C:\Users\TeseoHeracles\cpr-omni-deck`.
- Los docs mencionan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`, que no existen en el código.
