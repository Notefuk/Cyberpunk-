[Claude Code · 2026-10-27] Aprobado por Giuliano el 2026-10-27. Inmutable: si cambia, se escribe un plan nuevo que lo referencia.

# Plan 19: v5.1.0, mesa compartida (reloj, combate y log de tiradas)

[Claude Code · 2026-10-25] · revisado [Claude Code · 2026-10-27] después de la prueba con cuentas reales.

**Punto de partida:** la v5.0.2 ya se probó con cuentas reales de Google en gh-pages: GM y jugador, ficha nueva creada desde cero, acceso completo del GM y cambios de HP en vivo en los dos sentidos. Esa prueba está en `CHECKPOINT.md`. La rama `claude/v5.1.0-mesa` sale de `claude/prueba-real-gm`, que solo tiene commits del checkpoint.

Fase 2 del plan 16 (`docs/plans/plan16-firebase-mesa-online.md`), con la capa de sync del plan 17 (`docs/plans/plan17-sync-cuota.md`, puntos 10 a 12 y la tabla de presupuesto).
- **Al aprobarse:** se guarda como `docs/plans/plan19-v510-mesa-compartida.md`, firmado e inmutable, y se suma a `docs/plans/README.md`.
- **Cómo se trabaja:** según `docs/PRINCIPIOS.md`. Rama `claude/v5.1.0-mesa`, un commit con CHECKPOINT por paso, push solo con OK. Subagentes `cpr-scout` y `cpr-worker` con spec quirúrgica; reviso cada diff.

## Contexto
La v5.0.0 ya sincroniza fichas, campañas y el resumen de la party, pero cada dispositivo sigue con su propio reloj, su propio combate y sus propias tiradas. En una sesión online eso no sirve: el GM pasa el round y nadie se entera, y los enemigos solo existen en su pantalla.

El código de hoy tiene tres problemas:
- **El reloj** (`store/gameClockStore.ts`, clave `cpr_game_clock_v1`) es local.
- **El encuentro está partido en tres modelos sin vínculo:**
  - `ActiveEncounterEnemy`, en `features/gm/EnemiesCompendiumPanel.tsx:36`. Es `useState` y se guarda en `cpr_active_encounter_v1`.
  - `InitiativeCombatant`, en `features/gm/FixerDeckView.tsx:37`. Es `useState` y no se guarda.
  - `EnemySheet`, el catálogo, en `data/enemiesCatalog.ts:52`.

  Además hay dos contadores de round distintos: el del HUD (`useCombatStore.round`) y el del Fixer (`currentRound`). Agregar un enemigo desde el Fixer crea dos registros con HP e iniciativa distintos.
- **Las tiradas** (`useCombatStore.rollHistory`, que se llena con `addRollEntry`) quedan en cada dispositivo.

## Decisiones de Giuliano (2026-10-25)
1. **Reloj:** solo el GM lo avanza. Los jugadores lo ven.
2. **Enemigos:** aparecen al agregarlos. Los jugadores ven el nombre, el lugar en la iniciativa y el estado de heridas, no los HP exactos. Revelar cosas ocultas queda para la v5.2.0.
3. **Iniciativa:** cada jugador tira en su dispositivo con el botón Iniciativa del HUD (1d10 + REF) y la tirada entra sola al orden de la mesa. El GM la puede corregir.
4. **Era:** con campaña, la era la fija el GM para toda la mesa. Sin campaña, cada uno elige, como hoy.
- **Ya decidido en el plan 17, decisión 1:** al log de la mesa van las tiradas de combate (ataque, daño, Death Save, iniciativa) y las que el jugador marque "mostrar a la mesa".

## Diseño

### Mesa activa
- Un dispositivo puede estar en varias campañas, así que la mesa compartida usa una sola: la **mesa activa**.
  - Por defecto es la campaña de la ficha activa.
  - Si la ficha activa no está en ninguna campaña, se elige en un selector de MESA // CAMPAÑA.
  - Va en `useCloudState.activeTableId` y se recuerda en localStorage.
- Sin sesión o sin mesa activa, todo funciona local como hoy, incluido el encuentro unificado (punto 2).

### 1. Reloj y era en la campaña
- **Dónde se guarda:** campos en `campaigns/{campId}`:
  - `clock: { session, day, beat }`
  - `era: '2045' | '2077'`

  Los escribe el GM. La regla de update del GM ya los permite; se agrega un test que verifica que un jugador no puede escribirlos.
- **`gameClockStore`:**
  - Con mesa activa, `newBeat`, `newDay` y `endSession` escriben en la campaña; solo el GM las ve activas en `GameClockBar`.
  - Cada dispositivo aplica el snapshot remoto a su store local.
  - `speedhealLog` sigue local.
- **Efectos del reloj:** `expireQuickFixes` al pasar el día y `applyEndOfSessionToAll` al cerrar la sesión.
  - Cada dispositivo los aplica **solo a sus propias fichas**; el GM se saltea las de sus jugadores, así no se aplican dos veces.
  - `expireQuickFixes` se puede repetir sin problema.
  - El fin de sesión se marca por ficha con `lastSessionApplied`, así no se aplica dos veces aunque el snapshot llegue repetido.
- **Era:** con mesa activa, `useCombatStore.era` se reemplaza por la de la campaña. En `TopHudBar` el selector queda bloqueado para los jugadores y cambia la campaña si lo usa el GM.

### 2. Encuentro unificado (vale también sin nube)
- **Store nuevo `store/encounterStore.ts`:** reemplaza los dos `useState` y los dos contadores de round.
  - `Combatant`:
    - `id`
    - `kind: 'pc' | 'enemy'`
    - `name`
    - `initiative: number | null`
    - `charId` y `ownerUid` (solo los PJ)
    - `enemy?: EncounterEnemy`, con el contenido actual de `ActiveEncounterEnemy` (HP, SP de cabeza y cuerpo, stats, armas, `catalogId`)
  - Estado del encuentro:
    - `round`
    - `turnIndex`
    - `combatants`
    - `order` (ids ordenados por iniciativa)
  - Acciones:
    - `addEnemyFromCatalog(sheet)`, que reemplaza `spawnEnemy` y `handleAddGoonFromSheet`
    - `addPc(charId)`
    - `setInitiative`
    - `damageEnemy` y `setEnemySp`
    - `nextTurn`, `nextRound`, `reset`
    - `remove`
- **Persistencia y migración:** se guarda en localStorage (`cpr_encounter_v1`). La migración trae los enemigos de `cpr_active_encounter_v1`.
- **Las pantallas usan el mismo store:**
  - el cajón BESTIARIO del HUD;
  - `EnemiesCompendiumPanel`;
  - el tracker de iniciativa del Fixer Deck.

  Ya no hay registros duplicados.
- **Round:** `useCombatStore.round` pasa a ser el del encuentro. Al cambiar el round se siguen reseteando los campos por jugador (`firstDamageTakenThisRound`, `netActionsSpent`, `turnLog`, `backupCalls.roundsLeft`), pero cada dispositivo lo hace sobre lo suyo.
  - **Desvío del plan 16, fase 2, punto 3:** esos campos no suben a la nube, porque son del turno de cada personaje, no de la mesa. Solo `round` es de la mesa.
- **Fuera de alcance:** Red Chrome Cargo, que tiene su propio estado del oneshot, y la NET 2045.

### 3. Encuentro en Firestore (con mesa activa)
- **Documentos:**
  - `campaigns/{c}/encounters/current`: `round`, `turnIndex`, `order`. Lo escribe el GM.
  - `campaigns/{c}/encounters/current/combatants/{id}`: la vista pública (`name`, `kind`, `initiative`, `woundState`, `threatTier`, y `charId`/`ownerUid` si es un PJ). La leen todos los miembros. La escribe el GM; el dueño de un PJ solo puede tocar su `initiative`.
  - `campaigns/{c}/encounters/current/gmCombatants/{id}`: el `EncounterEnemy` completo. Solo lo lee y escribe el GM.
- **Cuándo se escribe:**
  - La vista pública se escribe solo cuando cambia el estado de heridas (plan 17, punto 12).
  - Los cambios del GM en los enemigos van por cola con diff, como las fichas.
- **Motor de sync:**
  - Se reusan `sync/writeQueue.ts`, `sync/diff.ts` (que incluye `increment`) y `sync/quotaGuard.ts`.
  - Se suma `sync/encounterSync.ts`, un motor chico que sigue el patrón de `characterSync` (base confirmada, sin eco, snapshots con escrituras pendientes ignorados).
  - `characterSync` no se toca: está atado a la ficha (`sheetDoc`, `COUNTER_PATHS`, logs).
  - `sync/encounterRepo.ts` se arma con el estilo de `campaignRepo.ts`.
- **Iniciativa de los PJ:** el botón Iniciativa del HUD (`handleRollInitiative`, `CombatHudView.tsx:1903`) llama a `encounterStore.setInitiative` para el PJ activo. Si el PJ no está en el encuentro, lo agrega.
- **Lo que ve cada uno:**
  - El jugador ve el orden con la marca de quién tiene el turno; los enemigos, con su estado de heridas.
  - El GM ve todo y maneja turnos y rounds.

### 4. Log de la mesa
- **Dónde se guarda:** `campaigns/{c}/log/{rollId}`, documentos de solo creación. Ya existe la regla; se endurece con `id == entryId`, un tamaño máximo y campos permitidos.
- **Cómo se publica:** con un `subscribe` a `useCombatStore` que detecta las entradas nuevas de `rollHistory` por `id`. Así no se toca el HUD en los 26 lugares que llaman a `addRollEntry`.
  - Se publica si la tirada es de combate (`attack`, `damage`, Death Save, iniciativa) o si tiene `shareWithTable`.
  - Se ignoran los cambios que no son tiradas nuevas (`triggerExplosionClick`, `markAttackDamageRolled`).
  - En el HUD, las tiradas que no son de combate llevan un botón "Mostrar a la mesa".
  - Hay que confirmar en el paso 1 qué ramas del HUD registran el Death Save y la iniciativa; si no pasan por `addRollEntry`, se agregan.
- **Lectura:** con `limit(50)`. El GM recorta a las últimas 200 por campaña, porque tiene permiso de borrar.
- **Pantalla:** panel "Log de la mesa" en MESA // CAMPAÑA y una tira compacta en el HUD.

### 5. Reglas y presupuesto
- **`frontend/firestore.rules`:** reglas de `encounters/current`, `combatants` y `gmCombatants`. Los campos `clock` y `era` quedan solo para el GM. Se endurece el log.
- **Tests de reglas nuevos:**
  - un jugador no puede mover el reloj;
  - un jugador no lee `gmCombatants`;
  - un jugador solo cambia la iniciativa de su propio PJ;
  - el log no se edita y no acepta ids ajenos.
- **`sync/__tests__/sessionBudget.test.ts`:** se suman el encuentro (cambios del GM y vista pública) y el log de tiradas. Tiene que quedar por debajo de 10.000 escrituras y 25.000 lecturas; la tabla del plan 17 estima unas 6.700 y 22.400.

## Orden de trabajo (un commit + CHECKPOINT por paso)
1. Guardar el plan 19, actualizar el README de planes y CHECKPOINT, y confirmar las ramas de Death Save e iniciativa del HUD (con `cpr-scout`). Además, dos arreglos chicos que salieron de la prueba real:
   - En la computadora, "Compartir link" copia el link directo. La ventana de compartir queda solo para el celular (`features/cloud/CampaignPanel.tsx:142`).
   - Los reintentos previstos del listener de la party al crear una campaña dejan de salir como error en la consola y pasan a `console.warn`. Solo el último intento fallido queda como error (`sync/cloudCampaigns.ts:152-158`).
2. `encounterStore` local con tests y migración desde `cpr_active_encounter_v1`. HUD, `EnemiesCompendiumPanel` y Fixer pasan a usarlo. Es el paso más grande: lo hace `cpr-worker` con spec por archivo.
3. Mesa activa, reloj y era en la campaña: `gameClockStore`, `GameClockBar`, `TopHudBar` y los efectos solo sobre fichas propias.
4. Reglas nuevas con sus tests (emulador).
5. `encounterRepo` + `encounterSync`: vista pública y del GM, iniciativa de los PJ.
6. Log de la mesa: publicador, botón "Mostrar a la mesa", panel y recorte a 200.
7. Prueba de presupuesto ampliada.
8. Prueba en el navegador y cierre de versión v5.1.0 (CHANGELOG, HANDOFF, ROADMAP, README de planes y changelog in-app).

## Verificación
- **Desde `frontend/`:** `npx tsc -b --noEmit`, `npm test`, `npm run build` y `npx vitest run --config vitest.rules.config.ts` con el emulador prendido.
- **Tests nuevos:**
  - `encounterStore`: orden, turnos, rounds y migración;
  - `encounterSync`: sin eco con dos clientes, y vista pública solo cuando cambia la herida;
  - publicador del log: no repite entradas y filtra las que no son de combate;
  - presupuesto ampliado.
- **Navegador, con el emulador, dos usuarios** (`localhost:5173` el GM, `[::1]:5173` el jugador):
  1. El GM pasa el beat, el día y la sesión, y el jugador lo ve. El jugador no tiene esos botones.
  2. El GM cambia la era y al jugador le cambia sola.
  3. El GM agrega dos enemigos desde el bestiario: el jugador los ve con su estado de heridas, sin HP.
  4. El jugador tira iniciativa y aparece ordenado en los dos.
  5. El GM pasa turnos y rounds, y el jugador ve quién tiene el turno.
  6. El GM daña a un enemigo hasta Seriously Wounded y el jugador ve el cambio de estado.
  7. El jugador ataca, la tirada aparece en el log del GM, y una tirada de skill marcada "Mostrar a la mesa" también.
  8. Sin sesión, el HUD y el Fixer usan el mismo encuentro local y nada se duplica.
  9. Recargar: el encuentro local persiste.
