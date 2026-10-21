# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito: el historial completo vive en `CHANGELOG_AND_ARCHITECTURE.md` y el contexto técnico en `AI_CONTEXT_HANDOFF.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.

**Última actualización**: [Claude Code · 2026-10-21]
**Versión de la app**: v4.5.0 (en `main`, commit 44baf2c, PR #16; publicada en gh-pages)
**Plan activo**: plan 2 (`docs/plans/plan2-auditoria-expansiones.md`), fases 1-4 hechas; falta la fase 5 (v4.5.1). Plan 1 terminado en v4.2.1. Plan 3 perdido (ver Próximos pasos).

## Traspaso

- Cierra: [Claude Code · 2026-10-21]
- Rama y último commit: `main` @ 606c15e "Protocolo de cowork..." (pusheada: sí). Web gh-pages publicada desde ese commit (deploy bacc1ce, con badges de autor en el changelog in-app).
- A medias: nada.
- Siguiente paso exacto: v4.5.1 Cyberfists of Fury (ver Próximos pasos 1), en una rama nueva `claude/...` o `antigravity/...` según quién la tome.
- Preguntas abiertas para Giuliano: revocar el token de GitHub que está en la URL del remote `origin`.
- Nuevo para Antigravity: leer `docs/COWORK.md` y `.agent/AGENTS.md` §8; el changelog in-app ahora tiene campo `author` (poner `'Antigravity'` en sus versiones); skill `.agent/skills/cierre-sesion/`.

## Último trabajo terminado

- [Claude Code · 2026-10-21] v4.5.0 (plan 2, fase 4) Going Metal canon, mergeada a `main` (PR #16, squash 44baf2c) y publicada en https://notefuk.github.io/Cyberpunk-/. Rehecha desde el PDF porque el trabajo a medias de claude.ai nunca se había pusheado (también se perdió el plan 3).
  - `goingMetalFbcData.ts` canon: 13 cuerpos `gm-*`, 20 ciberwares (con `gm-biosystem`), 6 de equipo, `ABOUT_FBCS_GUIDE`, `FBC_IMMUNE_CRITICAL_INJURIES`, `FBC_IMMUNITIES`, `BIOSYSTEM_HL_AVERAGE` = 14, `LINEAR_FRAME_OMEGA_HP_CHART`. Sin `moveOverride`.
  - Reglas: HL de conversión 14 + paquete y de cambio de cuerpo = paquete; HP al máximo; penalizador de armadura del chasis; REF/DEX/MOVE con mínimo `statFloor`; FBC sin Wound States, sin Speedheal ni Cryotank x2; inmune a 9 críticas y su +5; `Borgware x2` = -8 en terapia. Pack sin 29 `fbc-*` + 4 inventados; `fbc-rules` reescrito. 32 tests.
  - Desvíos: en el pack había 29 `fbc-*`, no 33; el +5 del crítico vive en `combatEngine.ts` (~l. 237), así que el HUD devuelve hasta 5 HP con `adjustHp` cuando un FBC es inmune.
- [Claude Code · 2026-10-21] Setup de Claude Code local: subagentes `cpr-scout`/`cpr-worker`/`github-web-deployer` en Sonnet; skill `checkpoint` + hook `Stop` `checkpoint-guard.sh`; skill de PDFs con lectura local; `.gitattributes` con LF para `.sh`; GitHub CLI portable v2.102.1 en `.tools/` (ignorado) con login de Notefuk, usar `scripts\gh.cmd` / `./scripts/gh` (ver CLAUDE.md "GitHub CLI portable").
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

- Nada a medias.
- Dudas del libro (anotadas en docs): `packageHlAverage` impreso no siempre cuadra con su fórmula (Enforcer 53 vs 55 en el ejemplo de p. 95); BODY de Sigma/Beta y SP de Skin Weave/Subdermal salen del Core.
- Fuera de alcance de v4.5.0: marcos Black Chrome (Vermilion, Fūma Kotarō); el HL de cada pieza del paquete no se instala como ciberware individual para el tope de terapia; volver a un cuerpo viejo no limita la Humanidad.
- Decisiones del usuario: todo canon, borrar lo inventado (no homebrew), NET Actions según CEMK (hasta 3), subagentes todos en Sonnet, publicar en gh-pages al cerrar versión.
- PDFs locales: Going Metal = `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\ilide.info-going-metal-pr_f86aec80bbb3b8b8c08ede7e5181f832.pdf` (21 págs.; impresa = PDF + 90). Interface RED Vol. 1-4 en `Sourcebooks\Interface-RED\`.

## Próximos pasos

1. v4.5.1 Cyberfists of Fury (IR4 pp. 73-83: 23 formas y 46 movimientos, `isOpposed` donde aplique) en `cyberfistsMartialArtsData.ts`. Cierra el plan 2.
2. Plan 3 (enemigos y Red Chrome Cargo): **se perdió**; hay que reescribirlo y volver a hacerle a Giuliano sus preguntas antes de ejecutarlo.
3. Fase 4 del roadmap: modo Settings para activar o desactivar módulos. Ver `AI_CONTEXT_HANDOFF.md` §4.
4. GM Master Screen (`FixerDeckView.tsx`).

## Notas y bloqueos

- Antes de volver a Antigravity, `git pull` en `main` en `C:\Users\TeseoHeracles\cpr-omni-deck`. Las ramas `claude/v4.5.0-going-metal` y `claude/project-thread-5rr1t9` ya no tienen nada que no esté en `main`.
- Seguridad: el remote `origin` tiene un token de GitHub en la URL; Giuliano debe revocarlo. Ahora `gh` maneja el login, así que se puede pasar el remote a una URL sin token.
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
- Los docs mencionan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS`, que no existen en el código.