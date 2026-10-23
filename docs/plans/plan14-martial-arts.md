# Plan 14: Martial Arts completo (v4.9.5 y v4.9.6)

[Claude Code · 2026-10-23]

Al aprobarse se guarda como `docs/plans/plan14-martial-arts.md`, con las ramas `claude/v4.9.5-martial-arts-creador` y después `claude/v4.9.6-martial-arts-hud`.

## Contexto (scouts del 2026-10-23)
- **Reglas**: Core pp. 83, 137, 176-180 y 182.
  - Cada forma es una skill aparte, con DEX y costo ×2.
  - El ataque tiene ROF 2 y hace daño según el BODY (p.178): 1d6, 2d6, 3d6 o 4d6, ignorando la mitad de la armadura.
  - Los movimientos especiales se tiran contra la defensa del rival o contra un DV fijo; son 2 por forma, más "Recovery" (DV13) para todas.
  - Interface RED Vol. 4, "Cyberfists of Fury" (pp. 73-83), suma 23 formas con las mismas reglas base.
  - El CEMK no cambia nada.
  - Ningún rol ni Lifepath trae Martial Arts; en el creador solo se compra con Paquete Completo.
- **App hoy**:
  - `data/cyberfistsMartialArtsData.ts` tiene las 27 formas y los 54 movimientos con su página. Los tests de `rules.test.ts` L240 y L301-345 los validan, pero no se compararon uno por uno contra el PDF.
  - La ficha guarda `knownMartialArts` (rango por forma), `skills.martialArts` (el máximo) y los chips.
  - El HUD tira el ataque de forma y el movimiento especial (`CombatHudView.tsx` L2226-2354, panel L7020+), pero los efectos son solo texto.
  - Las tarjetas "En mano" (L5906-5994) usan el Martial Arts genérico, sin la forma.
- **Creador**:
  - `SkillsStep.tsx` no ofrece especialidad: Martial Arts es un solo número, y `buildCharacterSheetFromDraft` (L1157-1166) no escribe `knownMartialArts`, así que la ficha nueva queda sin forma.
  - Pasa lo mismo con "Play Instrument (choose 1)" y "Science (choose 1)" de las listas de rol (`coreRoleTables`, 7 casos).

## Decisiones de Giuliano (2026-10-23)
1. **Formas**: entran las 27 (Core + Interface RED Vol. 4).
2. **Efectos**: automáticos donde se pueda. La app chequea requisitos, tira contra el DV y aplica lo que tenga número; lo narrativo queda como texto para el GM.
3. **Ciberbrazo**: el mínimo de 2d6 es solo de Brawling (p.176). Martial Arts usa la tabla de p.178 tal cual.
4. **Creador**: cada forma se compra aparte (×2). También se arreglan Play Instrument y Science, para elegir cuál.

## Paso 0: auditoría canon (antes de codear)
- Un scout compara las 27 formas y los 54 movimientos de `cyberfistsMartialArtsData.ts` contra el PDF: nombre, requisito, DV, si es una vez por turno, si reemplaza los 2 golpes, efecto y página.
- Cada diferencia se le pregunta a Giuliano antes de corregirla, igual que las dudas de texto (por ejemplo la distancia de Flying Kick).
- Las decisiones van a `docs/canon-audit/discrepancias-cemk-core.md`.

## v4.9.5: creador, ficha y referencia
1. **Creador** (`SkillsStep.tsx`, `engine/characterCreation.ts`):
   - en Paquete Completo, "Martial Arts" se abre en las 27 formas (las de Interface RED marcadas así), y cada una es una skill con su nivel y costo ×2 (clave `Martial Arts (Karate)`);
   - `buildCharacterSheetFromDraft` escribe `knownMartialArts[formId] = nivel` y `skills.martialArts = el máximo`;
   - Play Instrument y Science: al subirla, elegís la especialidad (texto libre), y en las listas de rol con "(choose 1)" el creador la pide. Se guarda como `generalSkills['Play Instrument (Guitarra)']`;
   - la validación exige la especialidad elegida;
   - el resumen muestra cada forma con su nivel.
2. **Ficha y HUD**:
   - las tarjetas "En mano" eligen la forma conocida y usan su rango, no el Martial Arts genérico;
   - el daño sale de `calculateMartialArtsDamage(body)` según p.178, sin mínimo por ciberbrazo, separado de `calculateUnarmedDamage`, que es la de Brawling.
3. **Referencia**:
   - `docs/rules/martial-arts.md` explica las reglas generales y las 27 formas, cada una con su estilo, sus movimientos, los requisitos y el efecto mecánico y narrativo, con libro y página (paráfrasis, no copia);
   - en la app, el panel de Martial Arts de la vista de roles muestra lo mismo.
4. **Tests**: el creador con 2 formas da `knownMartialArts`, el costo ×2 y la ficha; el daño por BODY sigue p.178; Play Instrument y Science con especialidad.
5. **Cierre**: APP_VERSION v4.9.5, changelogs, checkpoint, PR, merge y publicar, con OK de Giuliano.

## v4.9.6: movimientos especiales automáticos en el HUD
1. **Datos estructurados**: cada movimiento de `MartialArtMove` gana campos:
   - `req` con STAT o skill mínima (WILL 8, MOVE 8, Handgun 4...), condición de combate (clave), una vez por turno y si reemplaza los 2 golpes;
   - `effects[]` tipados: herida crítica nombrada, SP extra perdido, Prone, ataque extra (Brawling, forma o arma), daño fijo (5d6/6d6), modificador a apuntar, LUCK recuperada, liberarse o invertir un agarre, desarme, Iniciativa y texto.
2. **Motor puro** (`engine/martialArtsRules.ts`, con tests):
   - `checkMoveRequirements(move, sheet, turnState)`;
   - `resolveMove(move, roll, target)`, que devuelve los efectos a aplicar;
   - el registro del turno: golpes por tipo, si esquivaste todo, metros movidos, daño cuerpo a cuerpo recibido desde tu último turno, y los movimientos ya usados.
3. **Combate** (`useCombatStore` + HUD):
   - el registro del turno se llena con las acciones del HUD y se reinicia con el turno;
   - las condiciones que el HUD no registra se confirman con una casilla ("¿esquivaste todos los ataques?");
   - al acertar se aplican al blanco del HUD (enemigo o ficha) los efectos con número, con el sistema de heridas críticas que ya existe (Core pp. 186-187), la armadura, Prone y el ataque extra;
   - lo narrativo se muestra con su página.
4. **Tests**: requisitos (WILL 8+, una vez por turno), Bone Breaking aplica Broken Ribs (y Cracked Skull con −8), Armor Breaking −2 SP, Flying Kick Prone, Borg Fist 5d6/6d6 y Recovery DV13.
5. **Cierre**: APP_VERSION v4.9.6, changelogs, PR y publicar, con OK de Giuliano.

## Partes
- **Scouts**: la auditoría del paso 0, y cómo el HUD elige el blanco y aplica heridas críticas (antes de v4.9.6).
- **v4.9.5**: worker A (motor del creador, ficha, daño y tests) y worker B (UI del creador, HUD "En mano" y panel de referencia). Yo escribo `docs/rules/martial-arts.md`.
- **v4.9.6**: worker A (datos estructurados y motor) y worker B (store y HUD).

## Verificación
- `npx tsc -b --noEmit`, `npm test` y `npm run build` en cada versión.
- **Navegador v4.9.5**: un Paquete Completo con Karate 4 y Judo 2 (costo ×2), con la ficha creada mostrando ambas formas en el HUD; Play Instrument con especialidad; a 375 px.
- **Navegador v4.9.6**: Bone Breaking con WILL 8 contra un enemigo aplica Broken Ribs; con WILL 7, bloqueado; un movimiento de una vez por turno no se repite; Flying Kick deja Prone; a 375 px.
