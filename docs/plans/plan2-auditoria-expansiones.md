[Claude Code · 2026-10-20]

# Plan 2: contenido canon de expansiones (CEMK, Interface RED, Going Metal) y resto del Core

Sigue a `plan1-auditoria-core.md` (terminado en v4.2.1). Informe: Claude Doc "Auditoría CPR Omni-Deck v4.0.2" (https://claude.ai/code/artifact/782d6a88-8444-4981-9ec0-c71e98eb31cc), sección "Auditoría de expansiones" (X1-X13).
Fuentes verificadas: Core v1.24 (página del libro; en el PDF es +1), Errata v1.25, CEMK Rulebook 2024-05-22, Interface RED Vol. 1-2 y 4 (Vol. 3 es imagen sin texto), Going Metal (página impresa = página del PDF + 90).
Este archivo es inmutable. El avance va en `CHECKPOINT.md`.

## Decisiones de Giuliano (ronda 2, 2026-10-20)

| Pregunta | Respuesta | Qué implica |
| --- | --- | --- |
| Modos de carga (R10) | "que sea todo canon" | Se borran `ENCUMBRANCE_MODES` y su UI; no hay regla de carga en el Core. |
| Ítems, quickhacks y reglas sin fuente | "Deja todo lo canónico" | Se borra lo inventado; no se marca como homebrew. |
| Going Metal e Interface RED 4 | "Ya están agregados" | FBC y Cyberfists se auditan y corrigen en este plan. |
| Acciones NET | "Usa CEMK, es el último, por ende el más oficial" | Máximo 3 NET Actions por turno (CEMK) para todo rango de Interface. |
| ¿Aprobar plan 2? | Sin respuesta explícita; respondió todas las preguntas de alcance | Se toma como aprobado; si pide cambios se hace un plan 3. |

Siguen vigentes del plan 1: premades CEMK vuelven siempre (B1 fuera de alcance), Death Save con botón.

## Hallazgos

NET y Quickhacks:
- X1 NET Actions con tablas +1 o cortes distintos. Canon elegido: CEMK, hasta 3.
- X2 Programas `qh-*` del pack y `expansionRulesData` con RAM y valores de videojuego; 7 quickhacks inventados (Contagion, Suicide, Memory Wipe, etc.). Canon: CEMK pp. 16-17 sin RAM (Overheat 4 a HP por turno, Synapse Burnout 3d6, Puppet DV 12). El catálogo de 11 de `netAndRolesData.ts` es correcto y queda como fuente única.
- X3 El chequeo de quickhack suma INT; falta Breach previo y el límite de 1 por objetivo por turno; rango fijo 50 m. Canon: Interface + 1d10; rango 6/8/50 m según conexión (CEMK pp. 15-16, 26).
- X7 Stats de Black ICE en 8 presets de arquitectura, Flak con el efecto de Shield, Scanner con DV 13 inventado, dificultades "Hardened"/"Apex" inexistentes (Core pp. 199-210).

Datos CEMK:
- X4 Costos y cargadores de 9 armas CEMK mal, falta Militech Crusher, 7 armas inventadas (CEMK pp. 30-34).
- X5 HL de Mantis Blades, Gorilla Arms y Projectile Launch System es 14 (4d6); Neuroport 1000eb HL 7; Self-ICE HL 3; Sandevistan de David 250.000eb; 10 ciberwares inventados (CEMK pp. 34-36).
- X6 Rebuilds 1000eb y 2 slots; Smart falla por 5 o menos; el humo no afecta a Smart; Tech recarga con Acción de Movimiento (CEMK pp. 30-31).
- X12 Errata: Boosterganger BODY 2 (Errata v1.25 p. 412). Premade Hardpoint: falta Local Expert, First Aid y Drive mal (CEMK p. 18).

Roles, combate y Humanidad (Core):
- X8 Solo "Damage Absorption" inexistente; Medtech con Veritine y Cryo-Stasis inventados, Surge mal; tiers de Lawman Backup, Fixer, Exec, Media y Nomad inventados (Core pp. 144-161).
- X9 Faltan los Special Moves del Core (Disarming Combination, Bone Breaking Strike, Counter Throw, Pressure Point Strike, Recovery, etc.); DVs 15/16/17 en vez de DV 15 (Recovery DV 13) (Core pp. 178-180).
- X10 Terapia instantánea y gratis; el máximo de Humanidad no baja 2 por ciberware (4 por borgware); efecto de Immunoblockers inventado (Core pp. 229-230; CEMK p. 30).
- X11 DV de granada fijo 15 en vez de la tabla de lanzamiento; Biotoxin con daño normal; Frag e Incendiaria 4d6 inventadas (Core pp. 173, 177, 345-347).
- X13 Curación sin exigir Stabilization; Speedheal usable Mortally Wounded y más de una vez al día; falta Antibiotic (Core pp. 150, 222).
- R10 Modos de carga sin fuente (`engine/characterEngine.ts:12-41`).

Going Metal (FBC), auditoría nueva:
- G1 Chasis: de 13 en la app, solo 5 existen (Alpha Class, Gemini, Enforcer, Samson, Dragoon) y con costo y HL mal (todos HL 0; ej. Alpha Class 9,900eb HL 21, Gemini 10,200eb HL 14). Wiseman es un cuerpo de Netrunner, no médico. 7 inventados (DaiOni, Vermilion, Biotechnica Sigma, Lotus, Centurion, Koschei, Fenghuang). Faltan 7: Copernicus, Aquarius, Brimstone, Eclipse, Spyder 2.0, Sheol, Kildare (Going Metal pp. 96-104, tabla p. 110).
- G2 Ciberware FBC: 10 inventados (overclocked actuators, hydraulic rams, etc.); costos/HL mal en Biosystem, Linear Frame Omega (10,000eb, HL 28, requisitos), Chameleon Coating, EMP Coating, Bodyweight Coating; faltan Heavy Subdermal Plating, Dragoon Plating, Cyberskull, Internal Hydraulics y otros (Going Metal pp. 104-109, tabla p. 111). Granada Chaff/Laser inventada.
- G3 Reglas: cambio de cuerpo cobra HL del cyberware aplicable (p. 94); FBC inmune a penalizadores de Wound States salvo Death Save (p. 94); inmunidades canon a ciertos críticos, venenos, drogas y radiación (p. 94); reparación DV 15 Cybertech 4 h y regeneración diaria con Prepack (p. 94); Hydraulics es mínimo REF/DEX/MOVE, no reemplazo (pp. 107-108); "+50% daño EMP", "18 horas" e "SP 18 del Biosystem" inventados.

Cyberfists of Fury (Interface RED Vol. 4 pp. 73-83), auditoría nueva:
- C1 De 23 formas, 12 coinciden en nombre pero ninguno de sus 24 movimientos coincide; 11 formas inventadas (Animal Kung Fu, Chornobog's Kommando, Cyber-Wrestling, Hapkido, Jeet Kune Do, Jiu-Jitsu BJJ, Lethwei, Militech CQC, Ninjutsu, Savate, Systema); faltan 11 (Arnis, Choy Li Fut, Jujutsu, Kendo, Kung Fu, Kyudo, Militech Commando Training, Multiarm Melee, Sov-System, Tai Chi, Thamoc).
- C2 Reglas: Special Moves se resuelven con DEX + Skill + 1d10 contra DEX + Evasion + 1d10 o contra el DV del movimiento; hay movimientos sin DV (Knockout Punch, Borg Fist); Shared Special Moves del Core usables por cualquier forma; no sirven para Aimed Shots salvo que lo digan (IR4 p. 75).

## Fases

1. **v4.3.0 NET y Quickhacks canon**: X1 (hasta 3 NET Actions), X2 (borrar RAM y quickhacks inventados, fuente única `netAndRolesData.ts`), X3 (Interface + 1d10, Breach, 1 por objetivo, rango por conexión), X7 (Black ICE, Flak, Scanner, dificultades).
2. **v4.3.1 Datos CEMK canon**: X4, X5, X6, X12.
3. **v4.4.0 Roles, Martial Arts del Core, Humanidad, granadas y curación**: X8, X9, X10, X11, X13 y R10 (borrar modos de carga).
4. **v4.5.0 Going Metal canon**: G1, G2, G3. Reescribir `goingMetalFbcData.ts` desde el libro, HL de paquete por chasis, reglas de FBC en el motor.
5. **v4.5.1 Cyberfists of Fury canon**: C1, C2. Reescribir `cyberfistsMartialArtsData.ts` con las 23 formas y 46 movimientos del libro; resolución enfrentada o por DV según el movimiento.

Cada borrado de contenido que pueda estar guardado en partidas (ítems equipados, formas aprendidas, chasis activos) necesita `migrate` en el store o un fallback que no rompa la carga.

## Criterio de terminado por fase

`npx tsc -b --noEmit`, `npm test` y `npm run build` con 0 errores, sin warnings nuevos de lint, tests nuevos para cada regla del motor que cambie, cada dato o regla citado con libro y página, docs de la raíz y changelog in-app actualizados según la skill `cpr-version-release`, avance en `CHECKPOINT.md`.
