# Plan 16: Firebase, mesa online (v5.0.0 a v5.2.0)

[Claude Code · 2026-10-24]

[Claude Code · 2026-10-24] Ajustado antes de aprobar, después de la v4.9.7: las cuotas remiten al plan 17, los historiales de IP y €$ van fuera de la ficha, la v5.0.0 incluye el arreglo para celulares y la fase 2 parte de lo que ya separó la v4.9.7 (decisiones 11 a 13).

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
11. **Historiales fuera de la ficha** (2026-10-24): el historial de IP también va aparte, igual que el de €$. Cada movimiento nuevo sube un documento chico; el panel de IP se ve igual.
12. **Celulares en la v5.0.0** (2026-10-24): la primera versión estable ya llega sin desborde a 375 px en Street Lab, la barra de pestañas de la vista de roles y el HUD (pendiente 3 del checkpoint).
13. **Direcciones** (2026-10-24): la mesa real se muda a Firebase Hosting (`*.web.app`) y la dirección de hoy, `notefuk.github.io/Cyberpunk-/`, pasa a ser la beta. Giuliano les manda la dirección nueva a los players cuando salga la v5.0.0.

## Reglas de diseño (obligatorias en todas las fases)
- **Zustand sigue siendo la fuente local**. Una capa de sincronización (`sync/`) refleja los cambios en Firestore y aplica los que llegan. Las vistas no hablan con Firestore.
- **Sincronización genérica por campos**: se escriben solo los campos que cambiaron (diff de rutas), sin conocer el significado de cada campo. Los planes futuros que agreguen campos a la ficha se sincronizan solos.
- **Debounce de escritura**: 1,5 s por documento, con un máximo de 5 s (plan 17). Nunca una escritura por tecla; los campos de texto ya guardan diferido desde la v4.9.7.
- **Contadores atómicos**: HP, munición, Luck y Humanidad con `increment()`; Death Save y cambios encadenados en transacción.
- **1 ficha = 1 documento**. Logs (`transactions`, `ipLog`, tiradas) en subcolecciones, nunca dentro del documento de la ficha (decisión 11). En el modo local siguen dentro de la ficha, con los topes de la v4.9.7; la capa de sync los traduce a documentos de solo creación y el documento de la ficha no los lleva. `ipLogArchivedTotals` sí viaja en la ficha.
- **Privacidad por documento**: lo que el jugador no debe ver (secretos del GM, enemigos, pisos NET no revelados) va en documentos que las reglas de seguridad solo dejan leer al GM.
- **Versión obligatoria**: cada documento guarda `schemaVersion`. Un cliente con versión vieja no escribe y muestra "Actualizá la app". Las migraciones de `persistence.ts` se aplican también a las fichas de la nube al leerlas.
- **Datos estáticos sin Firestore**: compendio, catálogos, reglas y bestiario siguen dentro del bundle.
- **SDK con carga diferida**: Firebase se carga con `import()` solo al iniciar sesión. El modo local no suma peso.
- **Combat store dividido**: lo compartido (round, iniciativa, encuentro) va a Firestore; lo de la UI de cada jugador (autofire, distancia, Aimed Shot, Luck a gastar) queda local. Los dos grupos ya están separados desde la v4.9.7 (`COMBAT_LOCAL_KEYS` y `COMBAT_SHARED_KEYS` en `useCombatStore.ts`).

## Cuotas de Firebase: cómo la app evita pasarse

[Claude Code · 2026-10-24] Lo define el **plan 17** (`docs/plans/plan17-sync-cuota.md`), que reemplaza la versión anterior de esta sección. Resumen:
- Plan Spark gratis: 50.000 lecturas y 20.000 escrituras por día y por proyecto. Una sesión de 4 h con 6 jugadores y el GM usa unas 6.700 escrituras (34 %) y 22.400 lecturas (45 %).
- Cola por documento (1,5 s, máximo 5 s), diff por campos, contadores con `increment()`, sin eco entre dispositivos (test obligatorio), nada al abrir.
- Freno en las reglas por escritor (1 escritura por segundo por persona y dispositivo, con reintento), guardián de cuota por dispositivo y prueba de presupuesto de una sesión simulada dentro de `npm test`.
- Si se agota la cuota, la sincronización se pausa hasta la medianoche del Pacífico y la app sigue con los datos locales; nada se pierde.

## Modelo de datos (Firestore)
```
users/{uid}                          perfil, campañas a las que pertenece
characters/{charId}                  ficha completa (CharacterSheet + ownerUid, campaignIds, schemaVersion)
characters/{charId}/transactions/*   historial de €$, recortado
characters/{charId}/ipLog/*          historial de IP, solo creación (decisión 11)
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
| Estable | Firebase Hosting (`*.web.app`, dirección nueva) | proyecto `prod` | La mesa real (decisión 13) |

- La configuración va en `.env.development`, `.env.beta` y `.env.production` (Vite). La config web de Firebase no es secreta: la protección son las reglas.
- Salida de una versión: local → beta → OK de Giuliano → el mismo build a estable. Rollback desde la consola de Hosting.
- Antes de cada salida a estable que suba `schemaVersion`, se prueba la migración en beta con una copia exportada de las fichas reales.
- Los dos proyectos en plan Spark. Si hace falta Blaze, alerta de presupuesto en USD 5 (el crédito de Google AI Pro lo cubre).

## Fases

### Fase 1, v5.0.0: entornos, cuenta, nube, campañas y vista del GM (primera versión estable)
1. Crear los proyectos `dev` y `prod` (Giuliano, desde su cuenta de Google; la consola necesita su login). Habilitar Auth con Google, Firestore y Hosting. Agregar `notefuk.github.io` a los dominios autorizados de `dev`.
2. `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc` con los alias `dev` y `prod`, y scripts `npm run emulators`, `build:beta` y `deploy:prod`.
3. `sync/firebaseClient.ts` (carga diferida, emulador en local), `sync/authStore.ts` (sesión, usuario, modo `local` | `cloud`).
4. Capa de sync de fichas con las medidas del plan 17: suscripción a las fichas del usuario, diff por campos, cola de 1,5 s, `increment()` en contadores, sin eco, historiales de IP y €$ como subcolecciones, escritura del resumen `party/*`, gate de `schemaVersion`, freno en las reglas y guardián de cuota.
5. Al iniciar sesión: elegir qué fichas locales subir. Al cerrar: volver al modo local.
6. Campañas: crear, link de invitación, unirse, salir, pasar el GM, asignar ficha a campaña.
7. Vista del GM: lista de la party con las fichas completas en vivo (solo lectura en esta fase). Jugadores: el resumen de los demás.
8. Indicador de estado (local, sincronizado, sin conexión, guardando, sincronización pausada) y aviso de "Actualizá la app".
8b. Celulares (decisión 12): Street Lab, la barra de pestañas de la vista de roles y el HUD sin desborde horizontal a 375 px.
9. Tests: diff y cola de la capa de sync, eco con dos clientes, prueba de presupuesto (plan 17), reglas de seguridad con el emulador, migración de fichas de la nube.

### Fase 2, v5.1.0: mesa compartida
1. Reloj de juego en la campaña (hoy `cpr_game_clock_v1`).
2. Encuentro compartido: round, orden de iniciativa, combatientes. Une los 3 modelos de enemigo desconectados (`ActiveEncounterEnemy`, `InitiativeCombatant`, `EnemySheet`) en uno solo con vista pública y vista del GM.
3. `useCombatStore`: el grupo `shared` (ya separado en la v4.9.7) pasa al encuentro; el grupo `local` queda en cada dispositivo.
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
- **Navegador, local con emulador**: dos ventanas con dos usuarios (GM y jugador). El cambio de HP del jugador se ve en el GM en menos de 3 s; el jugador no puede leer `gm/*` ni la ficha completa de otro jugador; sin sesión la app funciona como en la v4.9.7.
- **Celular (v5.0.0)**: a 375 px, Street Lab, la vista de roles y el HUD no desbordan.
- **Beta**: Giuliano prueba desde el celular con la campaña de prueba.
- **Cuotas**: después de una sesión de prueba, revisar el uso en la consola de Firebase.
