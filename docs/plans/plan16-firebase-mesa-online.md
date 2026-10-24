# Plan 16: Firebase, mesa online (v5.0.0 a v5.2.0)

[Claude Code · 2026-10-24]

Agrega cuentas de Google, fichas en la nube y campañas compartidas entre el GM y los jugadores, con Firebase (Auth + Firestore + Hosting). Va antes del plan 5 (Black Chrome y vehículos), que después hereda la sincronización sin trabajo extra.

## Por qué
Hoy todo vive en el `localStorage` de cada navegador: las fichas no pasan de la PC al celular, se pierden si se borra el navegador y nadie ve las fichas de los demás. El pendiente (6) del checkpoint (store de encuentro compartido) necesita un backend.

## Decisiones de Giuliano (2026-10-24)
1. **Login**: solo Google.
2. **Dos modos**: sin sesión la app funciona como hoy (localStorage, sin internet). Con sesión, las fichas viven en la nube y aparecen las campañas. Al iniciar sesión se ofrece subir las fichas locales; al cerrarla se vuelve al modo local y lo de la nube queda en la cuenta.
3. **Vista de la party**: cada jugador ve de los demás solo un resumen (handle, rol, HP, estado de heridas, SP, condiciones visibles). El GM ve las fichas completas.
4. **Cambios del GM**: directos sobre la ficha del jugador y con registro en el log de la mesa ("GM: -12 HP a Kiwi").
5. **Dados**: se tiran en cada dispositivo y se publican en el log. Sin tiradas en el servidor.
6. **Campañas**: varias, cada una con link de invitación. Un jugador puede estar en varias.
7. **GM**: quien crea la campaña. Puede pasarle el rol a otro miembro.
8. **Alcance**: fases 1 a 4 de este plan. La subida de imágenes (Cloud Storage) queda fuera.
9. **Tres entornos**: local con el emulador de Firebase, beta en GitHub Pages con el proyecto Firebase "dev", y estable en Firebase Hosting con el proyecto Firebase "prod". Las pruebas nunca tocan las fichas reales.
10. **Primera versión estable**: fichas en la nube, campañas y el GM viendo la party. Después la mesa compartida, después las acciones del GM y después el plan 5.

## Reglas de diseño (obligatorias en todas las fases)
- **Zustand sigue siendo la fuente local**. Una capa de sincronización (`sync/`) refleja los cambios en Firestore y aplica los que llegan. Las vistas no hablan con Firestore.
- **Sincronización genérica por campos**: se escriben solo los campos que cambiaron (diff de rutas), sin conocer el significado de cada campo. Los planes futuros que agreguen campos a la ficha se sincronizan solos.
- **Debounce de escritura** de 1 a 2 s por documento. Nunca una escritura por tecla.
- **Contadores atómicos**: HP, munición, Luck y Humanidad con `increment()`; Death Save y cambios encadenados en transacción.
- **1 ficha = 1 documento**. Logs (`transactions`, tiradas) en subcolecciones recortadas, nunca dentro de la ficha.
- **Privacidad por documento**: lo que el jugador no debe ver (secretos del GM, enemigos, pisos NET no revelados) va en documentos que las reglas de seguridad solo dejan leer al GM.
- **Versión obligatoria**: cada documento guarda `schemaVersion`. Un cliente con versión vieja no escribe y muestra "Actualizá la app". Las migraciones de `persistence.ts` se aplican también a las fichas de la nube al leerlas.
- **Datos estáticos sin Firestore**: compendio, catálogos, reglas y bestiario siguen dentro del bundle.
- **SDK con carga diferida**: Firebase se carga con `import()` solo al iniciar sesión. El modo local no suma peso.
- **Combat store dividido**: lo compartido (round, iniciativa, encuentro) va a Firestore; lo de la UI de cada jugador (autofire, distancia, Aimed Shot, Luck a gastar) queda local.

## Cuotas de Firebase: cómo la app evita pasarse
Límite gratis diario (plan Spark, por proyecto): unas 50k lecturas, 20k escrituras y 20k borrados. Objetivo: una sesión de 4 h con 6 jugadores y el GM debe usar menos de la mitad.

Escrituras:
1. **Debounce** de 1 a 2 s por documento: una ráfaga de cambios (escribir notas, mover un slider, varios clics) sale como una sola escritura.
2. **Solo campos cambiados**: el diff manda `currentHp`, no la ficha entera.
3. **Sin eco**: un cambio que llega de Firestore se aplica al store marcado como remoto y la capa de sync no lo vuelve a escribir. Sin esto, dos dispositivos se reescriben en bucle y agotan la cuota en minutos. Test obligatorio.
4. **Sin escrituras al abrir**: cargar la app, cambiar de pestaña o migrar no escribe nada. Una migración de `schemaVersion` escribe la ficha una sola vez.
5. **Resumen de party solo si cambió**: `party/{charId}` se escribe únicamente cuando cambia uno de sus campos (HP, heridas, SP, condiciones), no con cada cambio de la ficha.
6. **Log recortado**: una entrada por tirada o cambio del GM; se conservan las últimas 200 por campaña y el resto se borra al cerrar el encuentro.

Lecturas:
7. **Caché local de Firestore** (`persistentLocalCache`): al reabrir la app, lo que no cambió sale del caché y no cuenta como lectura.
8. **Escuchar solo lo que se ve**: cada vista abre sus suscripciones al montarse y las cierra al salir. Con la app en segundo plano se pausan.
9. **Consultas con límite**: el log se lee con `limit(50)`; las listas de campañas y personajes, sin escuchar en vivo.
10. **Jugadores sin fichas ajenas**: leen el resumen de party (1 doc chico por personaje), no las fichas completas.
11. **Datos estáticos en el bundle**: compendio, catálogos, reglas y bestiario no salen de Firestore. Cuestan 0.

Control:
12. **Contador de uso en modo debug** (local y beta): lecturas y escrituras de la sesión, visibles en un panel, para medir antes de salir a estable.
13. **Alertas**: alerta de presupuesto en USD 5 si algún proyecto pasa a Blaze; revisar el uso en la consola después de cada sesión de prueba.
14. **Si se agota la cuota en Spark**: la app sigue andando con los datos locales, muestra "Sincronización pausada hasta mañana" y vuelve a subir los cambios pendientes cuando se reinicia la cuota. Nada se pierde.

Estimación con estas reglas: unas 5k escrituras y 17k lecturas por sesión intensa (25 % y 35 % del límite diario).

## Modelo de datos (Firestore)
```
users/{uid}                          perfil, campañas a las que pertenece
characters/{charId}                  ficha completa (CharacterSheet + ownerUid, campaignIds, schemaVersion)
characters/{charId}/transactions/*   historial de €$, recortado
campaigns/{campId}                   nombre, gmUid, memberUids, inviteCode, reloj de juego
campaigns/{campId}/party/{charId}    resumen público de cada ficha (lo escribe la capa de sync)
campaigns/{campId}/gm/*              solo GM: notas secretas, NPCs, arquitecturas NET
campaigns/{campId}/encounters/{id}   round, orden de iniciativa, estado (fase 2)
  .../combatants/{id}                1 doc por combatiente, vista pública (fase 2)
  .../gmCombatants/{id}              stats completas de enemigos, solo GM (fase 2)
campaigns/{campId}/log/*             log de la mesa: tiradas y cambios del GM, recortado
```

## Reglas de seguridad (resumen)
- Una ficha: la lee y la escribe su dueño; la lee y la escribe el GM de una campaña en la que está.
- `party/*`: la leen los miembros de la campaña.
- `gm/*` y `gmCombatants/*`: solo el GM.
- `log/*`: lo leen los miembros; cada uno agrega entradas propias, nadie edita ni borra las ajenas.
- Unirse a una campaña: solo con el `inviteCode` vigente.
- Tests de reglas con el Emulator Suite (`@firebase/rules-unit-testing`) dentro de `npm test`.

## Entornos
| Entorno | Dónde | Firebase | Para qué |
|---|---|---|---|
| Local | `localhost:5173` | Emulator Suite | Desarrollo y tests |
| Beta | GitHub Pages (`notefuk.github.io/Cyberpunk-/`) | proyecto `dev` | Giuliano prueba con la campaña de prueba |
| Estable | Firebase Hosting (`*.web.app`) | proyecto `prod` | La mesa real |

- La configuración va en `.env.development`, `.env.beta` y `.env.production` (Vite). La config web de Firebase no es secreta: la protección son las reglas.
- Salida de una versión: local → beta → OK de Giuliano → el mismo build a estable. Rollback desde la consola de Hosting.
- Antes de cada salida a estable que suba `schemaVersion`, se prueba la migración en beta con una copia exportada de las fichas reales.
- Los dos proyectos en plan Spark. Si hace falta Blaze, alerta de presupuesto en USD 5 (el crédito de Google AI Pro lo cubre).

## Fases

### Fase 1, v5.0.0: entornos, cuenta, nube, campañas y vista del GM (primera versión estable)
1. Crear los proyectos `dev` y `prod` (Giuliano, desde su cuenta de Google; la consola necesita su login). Habilitar Auth con Google, Firestore y Hosting. Agregar `notefuk.github.io` a los dominios autorizados de `dev`.
2. `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc` con los alias `dev` y `prod`, y scripts `npm run emulators`, `build:beta` y `deploy:prod`.
3. `sync/firebaseClient.ts` (carga diferida, emulador en local), `sync/authStore.ts` (sesión, usuario, modo `local` | `cloud`).
4. Capa de sync de fichas: suscripción a las fichas del usuario, diff por campos, debounce, `increment()` en contadores, escritura del resumen `party/*`, gate de `schemaVersion`.
5. Al iniciar sesión: elegir qué fichas locales subir. Al cerrar: volver al modo local.
6. Campañas: crear, link de invitación, unirse, salir, pasar el GM, asignar ficha a campaña.
7. Vista del GM: lista de la party con las fichas completas en vivo (solo lectura en esta fase). Jugadores: el resumen de los demás.
8. Indicador de estado (local, sincronizado, sin conexión, guardando) y aviso de "Actualizá la app".
9. Tests: diff y debounce de la capa de sync, reglas de seguridad con el emulador, migración de fichas de la nube.

### Fase 2, v5.1.0: mesa compartida
1. Reloj de juego en la campaña (hoy `cpr_game_clock_v1`).
2. Encuentro compartido: round, orden de iniciativa, combatientes. Une los 3 modelos de enemigo desconectados (`ActiveEncounterEnemy`, `InitiativeCombatant`, `EnemySheet`) en uno solo con vista pública y vista del GM.
3. División de `useCombatStore`: lo compartido al encuentro, lo de la UI local.
4. Log de la mesa: las tiradas del HUD se publican en vivo.

### Fase 3, v5.2.0: el GM actúa sobre los jugadores
1. Desde el HUD o la vista de party, el GM aplica daño (con armadura y ablación del motor actual), críticas, condiciones (Prone y demás), Humanidad y €$ directo sobre la ficha del jugador. Cada cambio queda en el log.
2. Secretos del GM en la nube: notas secretas, NPCs propios y arquitecturas NET (`cpr_gm_secret_notes_v1`, `cpr_custom_npcs_v1`, `cpr_custom_net_arch_v1`), en `gm/*`.
3. Revelar: pisos NET al Netrunner, NPCs y enemigos a la mesa (copian su vista pública).
4. El PIN del GM (`cpr_gm_pin_v1`) queda solo para el modo local; en la nube manda el rol de la campaña.

### Fase 4: documentación y traspaso
1. `docs/FIREBASE.md`: entornos, cómo desplegar, cómo agregar un campo a la ficha sin romper la sync, cómo probar reglas.
2. `docs/COWORK.md` y `.agent/`: Antigravity también corre el emulador y `deploy:prod` solo con OK de Giuliano.
3. Changelogs, handoff, roadmap y checklist firmados.

Cada fase cierra con su versión, PR, beta y, con OK de Giuliano, estable.

## Fuera de alcance
Subida de imágenes (retratos, tokens) con Cloud Storage, tiradas en el servidor, co-GMs, chat, mapas compartidos.

## Riesgos
- **Refactor de `useCharacterStore`** (unas 3.000 líneas, todas las fichas en un array): la capa de sync se engancha al store en vez de reescribir sus 80 acciones. Si un diff por campos no alcanza para alguna acción (por ejemplo, reordenar listas), esa acción escribe la lista completa.
- **Conflictos sin conexión**: el último que escribe gana, salvo en los contadores atómicos.
- **Reglas de seguridad mal escritas**: tests obligatorios con el emulador antes de cada salida.
- **Cuotas**: ver la sección "Cuotas de Firebase". El riesgo mayor es el eco entre dispositivos, con test obligatorio.

## Verificación por fase
- `npx tsc -b --noEmit`, `npm test` (incluye reglas con el emulador) y `npm run build`.
- **Navegador, local con emulador**: dos ventanas con dos usuarios (GM y jugador). El cambio de HP del jugador se ve en el GM en menos de 2 s; el jugador no puede leer `gm/*` ni la ficha completa de otro jugador; sin sesión la app funciona como en v4.9.6.
- **Beta**: Giuliano prueba desde el celular con la campaña de prueba.
- **Cuotas**: después de una sesión de prueba, revisar el uso en la consola de Firebase.
