# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.

**Última actualización**: [Claude Code · 2026-10-20]
**Versión de la app**: v4.0.2 (sin cambios de código desde entonces)

## Último trabajo terminado

- [Claude Code · 2026-10-20] Migración de las instrucciones de Antigravity a Claude Code (PRs #1-#4), `CHECKPOINT.md` y convención de firma de autoría.
  - `CLAUDE.md`, subagentes `.claude/agents/` (`cpr-scout` Haiku, `cpr-worker` Sonnet, `github-web-deployer` Haiku) y skills `.claude/skills/` (`cpr-pdf-extractor`, `cpr-version-release`).
  - `.agent/` queda como config de Antigravity, con copia de `AGENTS.md`, `gemini-scout` y `gemini-worker`.
- [Claude Code · 2026-10-20] Acceso a los PDFs desde Claude verificado: se leyó el Core Rulebook p. 174 trayéndolo desde la PC del usuario.

## En curso

- Nada a medias.

## Próximos pasos

1. Fase 4: modo Settings para activar o desactivar módulos (FBC/Going Metal, Garaje, Quickhacking 2077, Dojo, NET). Ver `AI_CONTEXT_HANDOFF.md` §4.
2. GM Master Screen (`FixerDeckView.tsx`).
3. Scripts de extracción: pasar las rutas Windows hardcodeadas (`scripts/extract_core_pack.py`, `scripts/find_sections.py`) a rutas configurables.

## Notas y bloqueos

- Antes de volver a Antigravity, hacer `git pull` en `C:\Users\TeseoHeracles\cpr-omni-deck`.
- Los docs mencionan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`, que no existen en el código.
