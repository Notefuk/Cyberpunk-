# Plan 15: v4.9.6, movimientos especiales de Martial Arts en el HUD (sin blanco)

[Claude Code · 2026-10-23]

Reemplaza la sección v4.9.6 del plan 14 (`docs/plans/plan14-martial-arts.md`, que no se modifica). Al aprobarse se guarda como `docs/plans/plan15-v496-martial-moves-hud.md`, en la rama `claude/v4.9.6-martial-arts-hud`.

## Por qué cambia
El scout (2026-10-23) encontró que el HUD no tiene un blanco:
- la defensa es un número manual (`meleeDefenseBase`);
- el daño que hacés solo queda en el registro de tiradas;
- los enemigos están en tres modelos desconectados (`ActiveEncounterEnemy` del panel de encuentro, `InitiativeCombatant` del Fixer Deck y `EnemySheet`), sin heridas ni estados.

Aplicar los efectos solos exigiría un store de encuentro compartido.

## Decisiones de Giuliano (2026-10-23)
1. **Sin store de encuentro por ahora**: queda como plan futuro. Los efectos los aplican y recuerdan los jugadores; la app los calcula y los muestra.
2. **Tabla CEMK sin la herida**: si está elegida la tabla del CEMK (1d6), que no tiene Spinal Injury ni Broken Jaw, se usa la del Core igual (pp. 187-188). Va como decisión 47.
3. **Turno**: un botón "Fin de turno" en el HUD reinicia el registro de tu turno, y "Siguiente Round" también lo reinicia. Va como decisión 48.

## Cambios
1. **Datos estructurados** (`data/cyberfistsMartialArtsData.ts`): cada uno de los 55 movimientos gana campos opcionales, y el texto actual queda igual.
   - `req`:
     - `stats` (por ejemplo `{ WILL: 8 }`), `skills` (por ejemplo `{ Handgun: 4 }`) y `formRank` (Five Forms: 4);
     - `turn`: claves de lo que el HUD puede saber del turno, como `hitsSameTarget: ['brawling','martial_arts']`, `hits: 2` o `movedMeters: 4`;
     - `confirm`: condiciones que el HUD no registra ("¿esquivaste todos los ataques cuerpo a cuerpo desde tu último turno, y al menos uno?");
     - `oncePerTurn`, `replacesAttacks` y `usesAction`.
   - `effects[]`, todos para mostrar:
     - `injury { name, location, headAlt? }` con el nombre del Core;
     - `armorExtraAblation`, `prone`, `extraAttack { kind }` y `damage { formula, alt? }` (Borg Fist 5d6/6d6, Combat Knife 4d6);
     - `aimedMod` (−8 a −5), `luck { recover }`, `initiative: 'top'`, `grapple` (soltarse o invertir), `disarm` y `text`.
   - Se derivan del texto y la página que ya están auditados, sin inventar nada.
2. **Motor puro** (`engine/martialArtsRules.ts`, con tests):
   - `checkMoveRequirements(move, sheet, turnLog, confirmed)`: dice qué falta (STAT, skill, rango de la forma, condición del turno, una vez por turno);
   - `resolveMoveRoll(move, total, defense)`: contra el DV o contra la defensa que se escribió, con empate a favor del defensor (Core p.129);
   - `describeMoveEffects(move, { headShot, tableIsCemk })`: la lista de efectos para mostrar, con el nombre de la herida en la tabla elegida (con la del Core si en el CEMK no está, decisión 47) y su página;
   - `TurnLog { hitsByType, hitsSameTarget, movedMeters, movesUsed }` y `emptyTurnLog()`.
3. **Store** (`useCombatStore`):
   - `turnLog`, con `recordHit(kind)`, `recordMove(id)`, `setMovedMeters(n)` y `endTurn()`;
   - `nextRound` también lo reinicia;
   - se sube la versión de persistencia, con una migración que arranca el `turnLog` vacío.
4. **HUD** (`CombatHudView.tsx`):
   - los ataques de Brawling, Martial Arts y armas cuerpo a cuerpo que aciertan suman al `turnLog`, después de resolver la explosión del 10 o el 1;
   - cada movimiento muestra sus requisitos con ✓ o ✗ y las casillas de `confirm`;
   - "EJECUTAR" se bloquea, con el motivo, si falta algo o si ya se usó este turno;
   - los movimientos con cabeza tienen una casilla "−8 a la cabeza (como Aimed Shot, decisión 43)";
   - el daño usa la fórmula del movimiento si la trae;
   - al acertar aparece una tarjeta "Efectos para aplicar" con cada efecto calculado y su página. La app no aplica nada sola;
   - un campo "metros movidos este turno" y el botón "Fin de turno".
5. **Cierre**: APP_VERSION v4.9.6, changelogs, checkpoint y decisiones 47-48. En pendientes queda "store de encuentro compartido". PR y publicar con OK de Giuliano.

## Partes
- **Worker A**: datos estructurados de los 55 movimientos, motor y tests.
- **Worker B**: store y HUD, con el contrato del motor.
- **Yo**: decisiones 47-48, auditoría de los diffs (los datos estructurados contra el texto auditado) y cierre.

## Verificación
- `npx tsc -b --noEmit`, `npm test` y `npm run build`.
- **Navegador**:
  - Bone Breaking con WILL 7 queda bloqueado ("WILL 8") y con WILL 8 se habilita; con −8 la tarjeta dice Cracked Skull;
  - Disarming Combination se habilita recién después de un golpe de Brawling y uno de Martial Arts;
  - un movimiento de una vez por turno queda bloqueado después de usarlo y vuelve con "Fin de turno";
  - Pressure Point con la tabla CEMK muestra Spinal Injury del Core;
  - a 375 px.
