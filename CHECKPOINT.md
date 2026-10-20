# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.

**Última actualización**: [Claude Code · 2026-10-20]
**Versión de la app**: v4.3.1
**Plan activo**: plan 2 (`docs/plans/plan2-auditoria-expansiones.md`). Plan 1 terminado en v4.2.1.

## Último trabajo terminado

- [Claude Code · 2026-10-20] v4.3.1 (plan 2, fase 2): 13 armas CEMK canon, ciberware y Immunoblockers con costo/HL del libro, inventados borrados, Rebuilds 1,000 €$ sin Maker ni Ballistic Coprocessor, Boosterganger BODY 2. Desvío: X12 Hardpoint era falso positivo. Quedan menciones a Ballistic Coprocessor/Tamayura en `enemiesCatalog.ts` (~355, 1009-1011, 1129) y `redChromeCargoData.ts` (~792, 1012, 1058, 1087) para v4.4.0.
- [Claude Code · 2026-10-20] v4.3.0 (plan 2, fase 1): NET Actions = 3 (`NET_ACTIONS_PER_TURN`), Quickhacks sin RAM (14 `qh-*` fuera del pack), alcance por conexión y 1 Quickhack por turno en el HUD, `BLACK_ICE_STATS`, dificultades Core, Scanner sin DV, Flak/Shield, `rollCheckD10`/`beatsDv`. Desvío: los Checks de rol con `>= DV` (Medtech DV 13, EMP DV 15 del HUD) pasan a v4.4.0.
- [Claude Code · 2026-10-20] v4.2.1 (plan 1, fase 5): React.lazy, calculateIncomingImpact en el motor, 14 tests Vitest (`npm test`), código/deps muertas fuera, PIN GM `cpr_gm_pin_v1`. Plan 1 completo.
- [Claude Code · 2026-10-20] v4.2.0 (plan 1, fase 4): melee enfrentado, Cyberarm 2d6, munición/autofire, empates, quickhacks con WILL real. Desvíos: la "tabla de DV duplicada" de types/cyberpunk.ts eran ejemplos correctos; la calculadora al motor pasa a fase 5.
- [Claude Code · 2026-10-20] v4.1.1 (plan 1, fase 3): FBC reversible, HP máx con BODY efectivo, parseHumanityLossAverage, validaciones, version+migrate. B1 se mantiene (premades vuelven, pedido del usuario).
- [Claude Code · 2026-10-20] v4.1.0 (plan 1, fase 2): Mortally Wounded, botón Tirar Death Save, críticos automáticos en la calculadora, Cracked Skull x3, EMP efectiva. Desvío: B11 queda como texto (objetivo es PNJ).
- [Claude Code · 2026-10-20] v4.0.3 (plan 1, fase 1): tablas de críticos canon Core pp. 187-188 con re-tirada, Neural Link 500eb, munición Smart, Asp ATK 2, `<` de Seriously Wounded en CLAUDE.md.
- [Claude Code · 2026-10-20] Migración de las instrucciones de Antigravity a Claude Code (PRs #1-#4), `CHECKPOINT.md`, convención de firma de autoría y flujo de planificación con `docs/plans/`.
  - `CLAUDE.md`, subagentes `.claude/agents/` (`cpr-scout` Haiku, `cpr-worker` Sonnet, `github-web-deployer` Haiku) y skills `.claude/skills/` (`cpr-pdf-extractor`, `cpr-version-release`).
  - `.agent/` queda como config de Antigravity, con copia de `AGENTS.md`, `gemini-scout` y `gemini-worker`.
- [Claude Code · 2026-10-20] Acceso a los PDFs desde Claude verificado: se leyó el Core Rulebook p. 174 trayéndolo desde la PC del usuario.

## En curso

- [Claude Code · 2026-10-20] Plan 2 guardado. Fases: 1 ✓ v4.3.0 NET/Quickhacks (X1-X3, X7) · 2 ✓ v4.3.1 datos CEMK (X4-X6, X12) · 3 ○ v4.4.0 roles/Martial Arts/Humanidad/granadas/curación + borrar modos de carga (X8-X11, X13, R10) · 4 ○ v4.5.0 Going Metal canon (G1-G3) · 5 ○ v4.5.1 Cyberfists of Fury canon (C1-C2).
- Decisiones del usuario: todo canon, borrar lo inventado (no homebrew), NET Actions según CEMK (hasta 3).
- Texto de los PDFs extraído en el contenedor (no persiste): Going Metal es un PDF de 21 páginas (página impresa = PDF + 90); Interface RED 4 tiene Cyberfists of Fury en pp. 73-83.

## Próximos pasos

1. Ejecutar la fase 3 del plan 2 (v4.4.0: X8-X11, X13, R10, Checks de rol con `>= DV` y las menciones a Ballistic Coprocessor de PNJ y Red Chrome Cargo).
2. Fase 4 del roadmap: modo Settings para activar o desactivar módulos. Ver `AI_CONTEXT_HANDOFF.md` §4.
3. GM Master Screen (`FixerDeckView.tsx`).
4. Scripts de extracción: pasar las rutas Windows hardcodeadas a rutas configurables.

## Notas y bloqueos

- Antes de volver a Antigravity, hacer `git pull` en `C:\Users\TeseoHeracles\cpr-omni-deck`.
- Los docs mencionan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`, que no existen en el código.
