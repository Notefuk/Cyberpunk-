# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.

**Última actualización**: [Claude Code · 2026-10-21]
**Versión de la app**: v4.4.0 (v4.5.0 en curso en la rama `claude/v4.5.0-going-metal`, Claude Code local)

> [Claude Code · 2026-10-21] **El trabajo a medias de v4.5.0 se perdió**: la rama `claude/project-thread-5rr1t9` apunta al mismo commit que `main` (v4.4.0) porque el sandbox de claude.ai nunca pusheó. Se perdieron la reescritura de `goingMetalFbcData.ts`, el parche de `CyberwareRipperdocView.tsx` y `docs/plans/plan3-auditoria-enemigos-red-chrome.md` (con sus 5 preguntas). Se rehace en la rama nueva. Setup local: subagentes `cpr-scout`/`cpr-worker`/`github-web-deployer` en Sonnet, skill `checkpoint` + hook `Stop` `checkpoint-guard.sh`, skill de PDFs con lectura local (Going Metal = `ilide.info-going-metal-pr_*.pdf` en la raíz de la carpeta de PDFs).
**Plan activo**: plan 2 (`docs/plans/plan2-auditoria-expansiones.md`), fase 4 a medias. Plan 1 terminado en v4.2.1. Plan 3 escrito, sin aprobar.

## Último trabajo terminado

- [Claude Code · 2026-10-20] v4.4.0 (plan 2, fase 3): sin modos de carga, roles del Core pp. 143-162, Combat Awareness validado, Pharmaceuticals canon, Special Moves del Core, tope de Humanidad por terapia, granadas por tabla de rango, curación con estabilización. Desvío: las menciones a Ballistic Coprocessor/Tamayura/Achilles/Chao en `enemiesCatalog.ts` y `redChromeCargoData.ts` no se tocaron: el catálogo de PNJ entero parece tener contenido inventado y necesita su propia auditoría (preguntar al usuario).
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

- [Claude Code · 2026-10-21] **v4.5.0 Going Metal (plan 2, fase 4): código terminado, falta cerrar.** Rama `claude/v4.5.0-going-metal` (Claude Code local). `tsc` limpio y 32/32 tests.
  - Hecho (rehecho desde el PDF): `goingMetalFbcData.ts` canon (13 cuerpos `gm-*`, 20 ciberwares con `gm-biosystem`, 6 de equipo, `ABOUT_FBCS_GUIDE`, `FBC_IMMUNE_CRITICAL_INJURIES`, `FBC_IMMUNITIES`, `BIOSYSTEM_HL_AVERAGE` = 14, `LINEAR_FRAME_OMEGA_HP_CHART`).
  - Hecho: ítems 1-6 del checkpoint anterior (Ripperdoc con HL real, `ActiveFbcState.statFloor/armorPenalty`, store, motor, StreetLab, HUD, pack sin 29 `fbc-*` + 4 inventados, `fbc-rules` reescrito) y 4 tests FBC. Desvíos: en el pack había 29 `fbc-*`, no 33; el +5 del crítico vive en `combatEngine.ts` (~l. 237), así que el HUD devuelve hasta 5 HP con `adjustHp` cuando un FBC es inmune.
  - Hecho: docs firmados (CHANGELOG, HANDOFF, STATUS, CONTENT_CHECKLIST), changelog in-app v4.5.0, `npm run build` OK, commit local `v4.5.0 Going Metal canon: Full Body Conversion`.
  - Falta: push de la rama y PR a `main` (esperando OK de Giuliano).
- Dudas del libro (anotadas en docs): `packageHlAverage` impreso no siempre cuadra con su fórmula (Enforcer 53 vs 55 en el ejemplo de p. 95); BODY de Sigma/Beta y SP de Skin Weave/Subdermal salen del Core; el filtro por zona del Ripperdoc ahora usa `Internal`/`External`/`Cyberlimb`.
- Fuera de alcance de v4.5.0: marcos Black Chrome (Vermilion, Fūma Kotarō); el HL de cada pieza del paquete no se instala como ciberware individual para el tope de terapia; volver a un cuerpo viejo no limita la Humanidad.
- Decisiones del usuario: todo canon, borrar lo inventado (no homebrew), NET Actions según CEMK (hasta 3), subagentes todos en Sonnet. Pendiente de respuesta: ¿publicar en gh-pages?
- PDFs locales: Going Metal = `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\ilide.info-going-metal-pr_f86aec80bbb3b8b8c08ede7e5181f832.pdf` (21 págs.; impresa = PDF + 90). Interface RED Vol. 1-4 en `Sourcebooks\Interface-RED\`.

## Próximos pasos

1. Cerrar v4.5.0 (docs, commit, push, PR).
2. v4.5.1 Cyberfists of Fury (IR4 pp. 73-83: 23 formas y 46 movimientos, `isOpposed` donde aplique) en `cyberfistsMartialArtsData.ts`. Cierra el plan 2.
3. Plan 3 (enemigos y Red Chrome Cargo): **se perdió**; hay que reescribirlo y volver a hacerle a Giuliano sus preguntas antes de ejecutarlo.
4. Fase 4 del roadmap: modo Settings para activar o desactivar módulos. Ver `AI_CONTEXT_HANDOFF.md` §4.
5. GM Master Screen (`FixerDeckView.tsx`).

## Notas y bloqueos

- Antes de volver a Antigravity, `git pull` en `C:\Users\TeseoHeracles\cpr-omni-deck` y traer la rama `claude/v4.5.0-going-metal` hasta que se mergee. `claude/project-thread-5rr1t9` no tiene nada nuevo.
- Seguridad: el remote `origin` tiene un token de GitHub en la URL; Giuliano debe revocarlo y pasar a Git Credential Manager.
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
- Los docs mencionan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`, que no existen en el código.