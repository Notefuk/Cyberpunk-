# Plan 8: Roles y rangos, Core RED + CEMK combinados

[Claude Code · 2026-10-22]

Este plan va antes de v4.8.3 (Modo Novato), que pasa a después de este plan con los roles ya definitivos. Vehículos y Black Chrome se corren detrás.

## Contexto
Giuliano encontró muchas discrepancias de roles entre CEMK y el Core.
- **CEMK** no tiene rangos ni avance: sus 7 pregens son fijas y cada habilidad es un "+4 a algo" (Folios).
- **El Core** tiene rangos 1-10, con tablas por rango (pp. 143-162) y avance con IP (p.411).
- **Lo que se necesita de CEMK para 2077:** Interface, Quickhacks, Neuroport y los "Role Tweaks 2070s" (RB p.25).

Hoy la app mezcla todo sin mirar la era:
- Hay dos fuentes duplicadas de la progresión de rol: `ROLE_ABILITIES_COMPLETE_PROGRESSION` (`data/weaponAndCyberwareTooltips.ts` L696-899) y `ROLES_INTERACTIVE_GUIDES` (`data/netAndRolesData.ts` L630-892).
- La progresión del Netrunner es 100% CEMK, así que la "Core" no existe.
- Las NET Actions están fijas en 3. La tabla de la guía de rol está mal (Core p.197 dice 1-3: 2, 4-6: 3, 7-9: 4, 10: 5).
- El rango se sube gratis con ±, y todos arrancan con 120 IP, que es un número inventado.
- Del Solo solo se aplican Precision Attack y Spot Weakness. Moto no suma en las tiradas de vehículo.
- Operator, Teamwork, Backup, Credibility y Charismatic Impact son solo texto.
- El Self-ICE de los PNJ está mal: con 2 Self-ICE, los dos Passwalls deberían ser DV8 (CEMK RB pp. 17, 36). La app los pone en DV6 y DV8.

## Decisiones de Giuliano (2026-10-22)
1. **Rangos en 2077**: progresión completa del Core 1-10 (arranca en 4 y sube con IP). Encima se aplican los Role Tweaks 2070s de RB p.25 según el rango.
2. **Sin versión CEMK +4**: todo personaje usa la habilidad completa del Core, incluidos los 7 Folios.
   - Se quita el selector del creador.
   - En cada Folio queda escrito **lo que dice el Folio** y **en qué se convierte** en la habilidad usable.
3. **Folios convertidos a rango 4 del Core**, con un reparto inicial que reproduce su ficha. El jugador lo puede redistribuir después.
4. **NET Actions**: la tabla del Core siempre, en las dos eras (Core p.197: 2/3/4/5 por rango de Interface).
5. **Netrunning por era**:
   - En 2077 se usan los Quickhacks de CEMK más el netrunning del Core (Net Architecture, programas y Black ICE).
   - En 2045 se usa solo el del Core. Los Quickhacks aparecen solo si el personaje tiene Neuroport (RB p.26).
6. **Fixer en 2077**: el Reach usa el mejor valor entre el tweak 2070s y el Core. El resto de Operator queda como en el Core. En 2045, solo el Core.
7. **Avance con IP del Core** (p.411):
   - Rango de rol: 60 × el rango nuevo.
   - Skills: 20 × el nivel nuevo, y 40 × en las ×2.
   - Los IP arrancan en 0 y los da el GM. Queda un "modo GM" para editar libre.
8. **Speedheal híbrido** (decisión de mesa de Giuliano): el Medtech puede usarlo 1 vez por Beat, y cada paciente puede recibir como máximo 1 Speedheal por día (Folio p.17 y Core p.150).
9. **Todas las habilidades de rol pasan a ser herramientas** que calculan y tiran según su rango y su libro.

## Caso por caso: qué dice cada libro y cómo se combina
Páginas: Core v1.24 impresa · RB = CEMK Rule Book impresa · Folios = página del PDF.

| Rol | Core (rango 1-10) | CEMK | Combinación |
|---|---|---|---|
| **Solo**: Combat Awareness | Puntos = rango, repartidos entre 6 opciones con costo (p.146) | Hardpoint: +4 a Iniciativa (Folios p.1). Sin tweak | Core. Hardpoint arranca con 4 en Initiative Reaction. Las 6 opciones se aplican en el HUD |
| **Netrunner**: Interface | NET Actions 2/3/4/5 por rango (p.197). 9 habilidades NET (pp. 198-201) | Interface sin STAT (RB pp. 15-16). Quickhacks por rango: R1 DV6, R2 DV8, R3 DV10, R4+ DV12. Scanner pasa a NET Action. Desde R3 se saltea el firewall base (RB pp. 25-26). Alcance 50 m con Cyberdeck Port | Core para las NET Actions y la Net Architecture. CEMK para los Quickhacks (2077, o con Neuroport), el firewall, el alcance y Scanner. Bluescreen: Interface 4 |
| **Tech**: Maker | Cada rango da 1 rango en 2 especialidades (Field, Upgrade, Fabrication, Invention). Tabla de DV y tiempo (pp. 147-149) | Maven: +4 a Cybertech y Electronics/Security Tech (Folios p.25). Rebuilds Power/Smart/Tech (RB pp. 30-31) | Core. Maven arranca con 8 rangos repartidos de forma que reproduzcan su +4. Los Rebuilds siguen disponibles en 2077 |
| **Medtech**: Medicine | 1 punto por rango en Surgery (+2 por punto), Pharmaceuticals o Cryosystem (hasta 5 cada una). Speedheal (pp. 149-150) | Insurance: Surgery BASE 12 y Speedheal por Beat (Folios p.17). Surgery es solo del Medtech (RB pp. 13-14) | Core. Insurance arranca con 2 en Surgery (+4) más 2 puntos que reproducen su ficha. Speedheal híbrido |
| **Rockerboy**: Charismatic Impact | Rango + 1d10 contra DV 8/10/12. Tabla de favores y lugares por rango (pp. 144-145) | Thorn: +4 a 5 skills sociales contra fans (Folios p.21). Tweak: objetos Expensive desde R4 (RB p.25) | Core más el tweak en 2077. El nombre es "Rocker" en 2077 |
| **Fixer**: Operator | Reach, Haggle y Grease por rango (pp. 159-161) | Connect: +4 a Trading (Folios p.9). Tweak de Reach: R1 Expensive, R4 Very Expensive, R7 Luxury, R9 Super Luxury (RB p.25) | Core, con el mejor Reach en 2077 |
| **Nomad**: Moto | El rango suma a las skills de vehículos. Family Motorpool por rango (pp. 161-162) | Wrench: +4 a Drive (Folios p.5). Tweak: vehículos y mejoras desde R1 (RB p.25) | Core más el tweak en 2077. Moto suma en las tiradas. El motorpool se limita por rango |
| **Media**: Credibility | DV de rumores, Believability y alcance por rango (pp. 151-153) | Sin Folio. Tweak: Expensive desde R4 (RB p.25) | Core más el tweak en 2077 |
| **Exec**: Teamwork | Beneficios por rango, Team Members en tablas 1d6 y Loyalty (pp. 153-157) | Sin Folio. Tweak: Expensive desde R4 (RB p.25) | Core más el tweak en 2077 |
| **Lawman**: Backup | d10 ≤ rango, llegan en 1d6 Rondas. Grupos por rango con sus stats (pp. 158-159) | Sin Folio. Tweak: Expensive de su trabajo desde R4 (RB p.25) | Core más el tweak en 2077 |

Para todos, en 2077: Neuroport gratis al crear (RB p.25) y "Expanded Availability", que permite comprar directo al fabricante a doble precio (RB p.26).

**Cosas que el libro no aclara.** Se toma una lectura y queda anotada en `docs/canon-audit/discrepancias-cemk-core.md`:
- El rango N da N puntos en Medicine y N×2 rangos de especialidad en Maker.
- Cyberware Malfunction: la descripción de RB p.16 manda sobre la referencia de p.38.
- "Neuroport Cyberdeck Expansion" y "Cyberdeck Port" son el mismo ítem.

## Versiones
**v4.9.0: Datos de roles por rango** (scouts sobre los PDFs, con página en cada dato)
- `data/creation-src/role-ranks.json` trae, para cada rol:
  - la tabla del Core de los 10 rangos;
  - el tweak 2070s;
  - el texto del Folio;
  - la conversión del Folio: qué dice y en qué se convierte, con el reparto inicial.
- El generador (`scripts/gen_creation.py` ampliado) produce `frontend/src/data/creation/roleRanks.ts`.
- Una sola fuente de datos: `ROLE_ABILITIES_COMPLETE_PROGRESSION` y `ROLES_INTERACTIVE_GUIDES` pasan a derivarse del generado. Se borran el duplicado y las tablas mal cargadas (NET Actions, Netrunner solo CEMK).
- Se corrigen las citas: los tiers de Interface en RB p.25 y el "(Core p. 159)" duplicado.
- Corrección de Self-ICE en `engine/cemkPort.ts`: N Passwalls, todos con el DV del total (RB pp. 17, 36), con su test.
- Registro en `docs/canon-audit/v4.9.0-roles.md`.

**v4.9.1: Motor de roles, conversión y avance**
- `engine/roleRules.ts`, puro y con tests. Todo depende de la era del personaje (`sheet.era`, o la global si no tiene):
  - `getRoleRankInfo(role, rank, era)`: el Core más los tweaks; el mejor Reach para el Fixer.
  - `netActionsForInterface(rank)`: la tabla del Core.
  - `maxQuickhackDv(rank)` y `canUseQuickhacks(sheet, era)`.
  - Reglas del Speedheal híbrido.
  - `roleRankCost(rank)` = 60×rank y `skillLevelCost(level, x2)` = 20×/40× (p.411).
- Store: `raiseRoleRank` y `raiseSkill` cobran IP y no permiten saltear niveles. Hay un modo GM de edición libre. Los IP de las fichas nuevas arrancan en 0. Las fichas guardadas conservan sus IP, porque son datos del usuario.
- Creador: se quita el selector "CEMK simple (+4)".
- Folios: se convierten a Core rango 4 con el reparto que reproduce cada ficha, y queda la nota "El Folio dice: … → Pasa a: …".
- Migración de persistencia v4:
  - `roleAbilityVariant 'cemk'` pasa a `'core'`.
  - Los Folios guardados reciben su reparto si no lo tienen.
  - Todo con copia previa a la migración.

**v4.9.2: Herramientas de rol de combate**
- **Solo**: las 6 opciones aplicadas en el HUD. Damage Deflection al primer daño, Initiative Reaction, Threat Detection en Perception y Fumble Recovery.
- **Netrunner**:
  - Las NET Actions por rango.
  - Los Quickhacks según la era y el Neuroport.
  - El firewall base DV6 para R1-2.
  - El alcance (6/8/50 m).
  - Interface para cualquier rol que tenga rango o el override.
  - Se corrige el `roleRank||4` de Red Chrome Cargo.
- **Medtech**: Surgery, Pharmaceuticals y Cryosystem por puntos, y Speedheal híbrido con registro por paciente y por día.
- **Nomad**: Moto suma en las tiradas de vehículo. El motorpool se limita por rango (Core p.162) y queda el tweak de 2077.

**v4.9.3: Herramientas de rol sociales y de oficio**
- **Tech**: Maker por especialidad, con la tabla de DV y tiempo.
- **Fixer**: Reach, Haggle (tirada opuesta) y Grease.
- **Exec**: beneficios por rango, generador de Team Members y Loyalty Save.
- **Lawman**: tirada de Backup, Rondas de llegada y stats del grupo.
- **Media**: rumores pasivos y activos con DV y Believability.
- **Rockerboy**: tirada contra DV y tabla de favores por rango.
- Todas con su página y con los tweaks de 2077 donde aplique.

Después sigue v4.9.4 Modo Novato (el ex v4.8.3) y luego vehículos y Black Chrome.

## Método
- Igual que en los planes anteriores:
  - Scouts (Sonnet) extraen de los PDFs a JSON con página. Las tablas se verifican de forma visual con pdf.js.
  - Workers aplican cada cambio con una spec quirúrgica (contrato de AGENTS.md).
  - Yo audito con diff, tsc, tests, build y navegador.
- Cada versión tiene su rama `claude/v4.9.x-*`, CHECKPOINT en cada paso, changelog firmado, PR y gh-pages.
- Cualquier discrepancia nueva se le pregunta a Giuliano antes de implementarla.

## Archivos críticos
- **Datos**:
  - `data/weaponAndCyberwareTooltips.ts` (L696-899).
  - `data/netAndRolesData.ts` (L14-16, L389-523, L630-892).
  - `data/cemkFolioPremadesData.ts`.
  - `data/creation/` (generado).
- **Motor**: `engine/roleRules.ts` (nuevo), `engine/cemkPort.ts`, `engine/characterEngine.ts` (Combat Awareness L395-419) y `engine/characterCreation.ts`.
- **Store**: `store/useCharacterStore.ts` (IP L2216-2308) y `store/persistence.ts` (migración v4).
- **UI**:
  - `features/sheet/StreetLabView.tsx` (pestaña de rol L3410-3544, ± de rango L648-652).
  - `features/combat/CombatHudView.tsx` (rol en combate y quickhacks).
  - `features/net/NetAndRolesDeckView.tsx` (Netrunning 2045 y Quickhacking 2077).
  - `features/creator/steps/RoleStep.tsx`.
  - `features/oneshot/RedChromeCargoView.tsx`.

## Verificación
- **Tests**:
  - Tabla del Core por rango para los 10 roles.
  - Tweaks 2077 activos según el rango.
  - Mejor Reach del Fixer.
  - NET Actions 2/3/4/5.
  - DV de Quickhack por rango.
  - Quickhacks en 2045 solo con Neuroport.
  - Firewall base.
  - Self-ICE con el DV del total.
  - Speedheal híbrido.
  - Costos de IP sin saltear niveles.
  - Conversión de los 7 Folios.
  - Migración v4 con copia previa.
- `npx tsc -b --noEmit`, `npm test` y `npm run build`.
- **Navegador**:
  - Un personaje de cada rol en las dos eras.
  - Subir de rango con IP.
  - Bluescreen hackeando a un PNJ.
  - Hardpoint en combate con Damage Deflection.
  - Insurance curando a dos aliados.
  - Wrench tirando Drive con Moto.
- Ancho de celular (375 px) y verificación en vivo después de publicar.

## Fuera de alcance
- Las discrepancias de combate entre CEMK y el Core (discrepancias 16-23): tienen su plan aparte.
- El deep diving de 2077: CEMK lo deja para otro producto (RB pp. 16, 26).
- La sincronización de fichas entre dispositivos (anotada en el roadmap).
