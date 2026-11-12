# Plan 28: modo GM (panel de mesa, actores guardados, pedir tiradas)

[Claude Code · 2026-11-12]

## Contexto
Giuliano quiere un modo GM al estilo de los actores de Foundry VTT. En un solo panel, el GM tiene que poder:
- ver a todos los jugadores de un vistazo;
- pedir tiradas;
- spawnear enemigos.

Los enemigos tienen que quedar guardados con su estado: si "Guardia 1" termina herido y con menos balas, queda así para traerlo de vuelta.

**Qué hay hoy** (exploración del 2026-11-12):
- **Encuentro:**
  - `store/encounterStore.ts` lleva un único encuentro (`EncounterEnemy`) con HP, SP, iniciativa y armas, sin balas gastadas ni heridas.
  - Sacar a un enemigo, `clearEnemies` o `reset` lo borran: no hay biblioteca de instancias.
  - Se espeja en Firestore en `campaigns/{c}/encounters/current`: `combatants` es lo público y `gmCombatants` lo que ve solo el GM (`sync/encounterSync.ts`, `sync/encounterRepo.ts`).
- **Bestiario:** `features/gm/EnemiesCompendiumPanel.tsx`.
  - Spawnea con `spawnEnemy` y `addEnemyFromCatalog`.
  - Ya tiene creador de PNJ propios (`customNpcs`), guardado en `campaigns/{c}/gm/npcs` con `useGmSecretBinding`.
- **Party:**
  - `sync/partySummary.ts` publica HP, SP, estado de heridas e injuries, pero no Suerte, Humanidad, balas ni condiciones.
  - Las reglas de `party` no limitan los campos.
  - `features/gm/GmTargetDialog.tsx` ya deja al GM aplicar daño, críticas, condiciones y plata a un jugador (`gmUpdateCharacterVitals`).
- **Log de la mesa:** `sync/tableLog.ts`, en `campaigns/{c}/log`. No existe "pedir tirada".
- **Acceso:** `canSeeGmOnly` (`store/gmAccess.ts`) y `GM_ONLY_TABS` en `App.tsx`.

**Decisiones de Giuliano (2026-11-12)**
1. Todo enemigo spawneado queda guardado como **actor** de la campaña, con HP, SP, balas, heridas y notas. Si sale del combate queda en la lista: se trae de vuelta tal cual o se borra.
2. Con mesa online, los actores van a la **nube de la campaña** y solo los ve el GM. Sin mesa, quedan en el navegador.
3. **Pedir tirada:** al jugador le aparece el aviso "El GM te pide Perception (DV 15)" con un botón Tirar; tira con su ficha y el resultado va al log. Solo con mesa online.
4. **Extras:**
   - iniciativa de todos con un botón;
   - atacar con un actor contra un jugador;
   - dar ítems y plata;
   - notas privadas por actor y por jugador.

## Cómo se trabaja
- Una rama por versión, con commit y CHECKPOINT en cada paso.
- Push, PR, merge, beta, prod y reglas de Firestore piden un OK cada uno.
- Las reglas cambian en las versiones 2 y 3: cada cambio va con sus tests de `npm run test:rules`.
- Las reglas de juego citan libro y página:
  - iniciativa (Core p.168);
  - ataque y daño (Core pp.170-173);
  - SP y ablación (Core p.186);
  - críticas (Core pp.187-188);
  - munición y recarga (Core p.171).

## Versiones

### v5.21.0: pestaña "🎛️ MODO GM" y panel de jugadores
- **Pestaña:** nueva, solo para el GM, en `GM_ONLY_TABS`. Es el panel único del GM, con tres columnas: Jugadores, Encuentro y Actores (la de Actores se llena en la v5.22.0).
- **Tarjeta por jugador:**
  - HP con su barra y estado de heridas, SP de cabeza y cuerpo, Suerte, Humanidad;
  - el arma en mano con sus balas y las de reserva;
  - condiciones y heridas críticas.
  - Un clic abre `GmTargetDialog`.
- **Resumen de la party:** `PartySummary` suma `luck`, `luckMax`, `humanity`, `humanityMax`, `weaponInHand` (nombre, balas y reserva) y `conditions`.
  - Lo publica la capa de sync del dueño, como hoy.
  - Las reglas de `party` no limitan campos, así que no cambian; si hiciera falta, se agrega un límite de tamaño con su test.
- **Sin mesa:** el panel muestra las fichas locales de tipo jugador.
- **Iniciativa de todos:** un botón tira 1d10 + REF para los jugadores y los enemigos del encuentro (Core p.168) y los ordena. En la mesa, la iniciativa del jugador la sigue escribiendo su dispositivo, como hoy.
- **Tests:** `buildPartySummary` con los campos nuevos y `rollInitiativeForAll`.

### v5.22.0: actores guardados (como Foundry)
- **Modelo:** `GmActor` en `data/gmActors.ts`.
  - Lleva id, nombre ("Guardia 1"), `sourceId` (la ficha del bestiario o el PNJ propio), una copia del `EnemySheet` y su estado.
  - Estado: HP, SP de cabeza y cuerpo, balas por arma (cargador y reserva), heridas críticas, condiciones, notas, `inEncounter` y fecha de creación.
- **Spawn:**
  - Todo spawn (bestiario, PNJ propio o enemigo rápido) crea un actor y lo mete en el encuentro.
  - El nombre se numera solo ("Guardia 1", "Guardia 2"); en el número se fija en los actores que ya existen.
  - `EncounterEnemy` guarda el `actorId`.
- **Estado del actor:**
  - Cada cambio en el encuentro (daño, SP, balas, críticas) se escribe también en el actor.
  - Sacarlo del combate o cerrar el encuentro deja el actor guardado con su estado.
- **Lista de actores** en la columna de Actores:
  - búsqueda y filtro por "en combate" o "guardados";
  - botones "Traer al combate", "Duplicar", "Curar a tope" y "Borrar" (con confirmación).
- **Balas y recarga:** el encuentro suma, por arma, las balas del cargador y la reserva, con botón de recarga (Core p.171).
- **Heridas críticas** del actor: con la tabla del Core (pp.187-188) que ya usa la app.
- **Dónde se guarda:**
  - Con mesa, en la subcolección nueva `campaigns/{c}/actors/{actorId}`. Lee y escribe solo el GM. Se valida la forma y el tamaño, y hay como mucho 1 escritura por segundo por actor.
  - Sin mesa, en `localStorage` (`cpr_gm_actors_v1`).
  - La escritura va en una capa nueva, `sync/actorsRepo.ts`, con el mismo patrón que `gmSecrets`.
- **Reglas de Firestore:** el match `actors` y sus tests (GM sí, jugador no, tamaño, frecuencia). Piden OK aparte para desplegar.
- **Tests:**
  - spawn, numeración, estado que vuelve igual tras sacar y traer;
  - balas y recarga;
  - el adaptador con `fakeFirestore`.

### v5.23.0: pedir tiradas, atacar con un actor, dar ítems y notas
- **Pedir tirada:**
  - Desde la tarjeta del jugador, el GM elige la habilidad (la lista de la ficha), el DV y una nota opcional. Puede pedirla a varios jugadores a la vez.
  - Se guarda en la subcolección nueva `campaigns/{c}/rollRequests/{id}` con `{targetCharId, targetUid, skill, dv, note, status: 'pending'|'done'|'cancelled', result?, _by, at}`.
  - Al jugador le aparece un aviso fijo en la ficha y en el HUD de combate, con el botón "Tirar". Tira 1d10 + STAT + skill con la regla de crítico del Core (p.130), como las tiradas de skill de hoy.
  - El resultado va al log de la mesa (`kind: 'skill'`) y marca el pedido como hecho.
  - El GM ve en el panel el estado de cada pedido (pendiente o resultado contra el DV) y puede cancelarlo.
  - **Reglas:** crear y cancelar es del GM. El jugador destinatario solo puede pasar `status` a `done` y escribir `result`. Lo pueden leer el GM y ese jugador. Los pedidos viejos se borran (como mucho 20 por campaña).
- **Atacar con un actor:**
  - En la tarjeta del actor: elegir arma y jugador objetivo, tirar ataque (base del arma + 1d10) contra el DV que escriba el GM, y el daño.
  - Gasta las balas del actor.
  - El daño se aplica al jugador con la lógica de `GmTargetDialog`: SP, ablación (Core p.186) y log.
  - Fuego automático y supresión quedan para más adelante.
- **Dar ítems:**
  - `GmTargetDialog` suma "Dar ítem": se busca en el catálogo (el pack del Core y los demás) y entra al inventario del jugador con su `catalogId` y un movimiento a nombre del GM.
  - La plata ya existe.
- **Notas privadas:**
  - Por actor, dentro del actor.
  - Por jugador, en un doc nuevo `gm/playerNotes` (mapa `charId → texto`); se suma `playerNotes` a la lista de `gm/{docId}` en las reglas, con límite de tamaño.
- **Tests:**
  - el ciclo del pedido (crear, tirar, resultado, cancelar);
  - el ataque de actor (balas, daño con SP);
  - dar ítem;
  - las reglas de `rollRequests` y `playerNotes`.

## Archivos principales
- **Nuevos:**
  - `features/gmmode/GmModeView.tsx`, con sus partes `PlayersColumn`, `EncounterColumn` y `ActorsColumn`;
  - `data/gmActors.ts` y `engine/gmActors.ts` (funciones puras: spawn, numerar, aplicar daño, recargar);
  - `sync/actorsRepo.ts`, `sync/rollRequests.ts`;
  - `features/gmmode/RollRequestPrompt.tsx` (lo que ve el jugador).
- **Cambian:**
  - `App.tsx` (pestaña);
  - `sync/partySummary.ts`;
  - `store/encounterStore.ts` (`actorId`, balas y heridas);
  - `features/gm/EnemiesCompendiumPanel.tsx` (el spawn crea el actor);
  - `features/gm/GmTargetDialog.tsx` (dar ítem);
  - `sync/tableSync.ts` (arranca los repos nuevos);
  - `frontend/firestore.rules` y `src/sync/__tests__/rules/firestore.rules.ts`.
- **Se reusan:**
  - `addEnemyFromCatalog` y `enemyFromSheet` (encounterStore);
  - `enemyWoundState` (encounterSync);
  - `gmActionToLog` y `publishGmAction` (tableLog/tableSync);
  - `gmUpdateCharacterVitals` (useCharacterStore);
  - `useGmSecretBinding`;
  - `canSeeGmOnly`.

## Verificación (cada versión)
- **Código:** desde `frontend/`, `npx tsc -b --noEmit`, `npm test` y `npm run build`, con 0 errores. En las versiones 2 y 3, también `npm run test:rules`.
- **En local**, con el emulador y dos navegadores (GM y jugador), cuentas de prueba solo en el emulador:
  - **v5.21.0:** el GM ve la tarjeta del jugador con su Suerte, Humanidad y balas, que se actualizan cuando el jugador tira o gasta balas; la iniciativa de todos funciona.
  - **v5.22.0:**
    - Spawnear 2 guardias, herir a uno y gastarle balas, cerrar el encuentro y recargar la página: el actor sigue herido y con menos balas.
    - "Traer al combate" lo devuelve igual.
    - Lo mismo desde otro navegador con la cuenta del GM.
  - **v5.23.0:**
    - El GM pide Perception DV 15, al jugador le aparece el aviso, tira y el GM ve el resultado en el panel y en el log.
    - Un guardia ataca al jugador: le baja HP y SP y gasta balas.
    - Dar un ítem.
    - Las notas quedan guardadas.
  - Consola limpia en cada caso.
- Cada versión pasa por la beta y prod con su OK, y las reglas de Firestore con OK aparte.

## Cierre
- El plan aprobado se guarda como `docs/plans/plan28-modo-gm.md` (inmutable).
- El avance va en `CHECKPOINT.md` y el estado en `docs/plans/README.md`.
