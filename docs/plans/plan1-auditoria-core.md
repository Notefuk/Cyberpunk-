[Claude Code · 2026-10-20]

# Plan 1: arreglos de la auditoría general (Core Rulebook)

Aprobado por Giuliano el 2026-10-20. Informe completo: Claude Doc "Auditoría CPR Omni-Deck v4.0.2" (https://claude.ai/code/artifact/782d6a88-8444-4981-9ec0-c71e98eb31cc).
Reglas verificadas contra `Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf` (número de página impreso del libro; en el PDF es +1).
Este archivo es inmutable. CEMK 2077, Interface RED y Going Metal se auditan aparte (plan siguiente).

## Objetivo

Corregir las reglas que contradicen el Core, los bugs de estado y la deuda técnica que encontró la auditoría de v4.0.2, en 5 versiones chicas con su PR cada una.

## Decisiones con el usuario

| Pregunta | Respuesta |
| --- | --- |
| ¿Aprobar plan y orden? | Sí ("continúa"). |
| Melee (R6): tirada enfrentada completa o DV editable | Sin respuesta; se elige tirada enfrentada completa con campo DEX + Evasion del defensor (Core p. 176), que es la regla del libro. |
| Death Saves (R5): automáticas o botón | Botón "Tirar Death Save". |
| Modos de carga (R10) | Pidió aclaración; queda pendiente de su respuesta. No se tocan hasta que conteste. |
| Personajes CEMK (B1) | Deben seguir como premades: se mantiene la re-inyección. B1 sale del alcance. |
| Auditoría de expansiones | Sí, hacerla también (plan aparte). |

## Hallazgos (IDs del informe)

Reglas (P0):
- R1 Tabla de críticos al cuerpo desordenada, falta Dismembered Hand, "Bone Fracture" inventada (`data/criticalInjuries.ts:159-306`). Canon: Core p. 187.
- R2 Efectos, Quick Fix y Treatment inventados en críticos de cabeza y cuerpo. Canon: Core pp. 187-188.
- R3 Falta "+1 Base Death Save Penalty" y re-tirar críticos que el objetivo ya tiene (Core p. 187).
- R4 El +5 de crítico es checkbox manual; debe aplicarse solo, directo a HP, sin ablación, aunque el daño no pase el SP (Core p. 187).
- R5 No hay Mortally Wounded ni Death Saves: <1 HP = -4 a todo, -6 MOVE (mín. 1), Death Save al inicio del turno (d10 < BODY, 10 siempre falla, +1 por tirada), crítico por cada golpe (Core pp. 186, 188).
- R6 Melee, Brawling y Grab con DV 13 fijo; canon tirada enfrentada DEX + skill + 1d10 vs DEX + Evasion + 1d10, empate gana el defensor; Grab vs DEX + Brawling (Core pp. 176-177).
- R7 EMP no baja con la Humanidad: baja cada vez que baja la decena (Core p. 80).
- R8 Falta Neural Link en el pack: 500eb, HL 2d6 (7) (Core p. 111).
- R9 Munición Smart: requiere Targeting Scope; segunda tirada 10 + 1d10 (+LUCK) vs el mismo DV si fallas por 4 o menos, solo tiro simple (Core p. 346).
- R10 Modos de carga (`engine/characterEngine.ts:12-41`) sin fuente en el Core. Pendiente de respuesta.

Bugs (P1):
- B2 FBC no revierte BODY/MOVE ni el SP del chasis (`useCharacterStore.ts:2152-2213`).
- B3 HP máximo con BODY crudo en `adjustHp`, `setHp`, `updateStat`, GM vitals vs BODY efectivo en el resto.
- B4 Parseo de Humanity Loss (`useCharacterStore.ts:1782`): "2d6 (7)" -> 267.
- B5 Munición gastada antes de validar rango (`CombatHudView.tsx:1718-1728`).
- B6 Autofire + apuntado gasta 10 balas y usa DV de autofire.
- B7 Multiplicador de autofire tomado del último acierto del historial (`CombatHudView.tsx:1753-1756`).
- B8 Criterio de impacto `>= 0` en Cyberfists, combos y quickhacks vs `> 0` del motor.
- B9 Quickhack calcula daño con d10 provisional antes de la explosión (`CombatHudView.tsx:2320`).
- B10 Jack In / Boot Out con WILL 6 y Concentration 2 fijos; hit forzado (`CombatHudView.tsx:2209, 2226, 2345`).
- B11 Apuntado a pierna/mano solo texto; x2 de cabeza fuera del motor.
- B12 `consumeAmmo` acepta negativos; setters sin validar NaN.
- B13 Transacciones con saldo clampado registran el monto completo.
- B14 Asp ATK 2 en el pack vs 4 en el preset de `netAndRolesData.ts:223` (verificar contra el libro).

Deuda (P2): lógica de daño duplicada fuera del motor, tabla de DV duplicada en `types/cyberpunk.ts:46-200`, constantes repetidas, persist sin `version`/`migrate`, `cpr-gm-pin` sin sufijo y en texto plano, bundle de 2.1 MB sin `React.lazy`, código y dependencias muertas, 81 `any`, sin tests.

También: brawling con Cyberarm hace mínimo 2d6 (Core p. 176) y `calculateUnarmedDamage` no lo contempla; se incluye en la fase 4. El `<=` de Seriously Wounded en `CLAUDE.md` es un error del doc: el libro dice "less than 1/2 HP (round up)" (Core p. 186) y el código ya usa `<`.

## Fases

1. **v4.0.3 Datos canon de críticos y equipo**: R1, R2, R3 (datos + re-tirada), R8, R9, B14, corregir `CLAUDE.md` (`<=` -> `<`).
2. **v4.1.0 Heridas, muerte y Humanidad**: R5 (estado Mortally Wounded + botón "Tirar Death Save" con penalizador acumulado y base por críticos), R4, R7, B11.
3. **v4.1.1 Bugs del store**: B2, B3, B4, B12, B13, y `version` + `migrate` en el persist de los stores.
4. **v4.2.0 Combate unificado**: R6 (incluye Grab y mínimo 2d6 con Cyberarm), B5, B6, B7, B8, B9, B10; mover la calculadora de daño al motor y borrar la tabla de DV duplicada.
5. **v4.2.1 Deuda técnica**: `React.lazy` por vista, código y dependencias muertas, PIN del GM con sufijo de versión, tests Vitest para `combatEngine` y `characterEngine`.

R10 entra en la fase que corresponda cuando Giuliano responda.

## Criterio de terminado por fase

`npx tsc -b --noEmit` y `npm run build` con 0 errores, sin warnings nuevos de lint, cada cambio de regla citado con libro y página en el código o en el changelog, docs de la raíz y changelog in-app actualizados según la skill `cpr-version-release`, avance registrado en `CHECKPOINT.md`.
