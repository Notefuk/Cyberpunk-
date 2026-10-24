# Plan 18: v5.0.0, etapa 5. Campañas, link de invitación y vista de la party

[Claude Code · 2026-10-24]

Complementa al plan 16 (`docs/plans/plan16-firebase-mesa-online.md`, fase 1, puntos 6 y 7) y al plan 17. **Cambia una decisión del plan 16:** el GM ya puede **editar** las fichas de sus jugadores en la v5.0.0. El plan 16 decía "solo lectura" hasta la v5.2.0. Como el plan 16 no se edita, va en este plan nuevo.

- **Al aprobarse:** se guarda como `docs/plans/plan18-v5-campanias.md` (firmado e inmutable) y se suma a `docs/plans/README.md`.
- **Reglas de trabajo:** `docs/PRINCIPIOS.md`. Commits en la rama `claude/v5.0.0-nube`, push solo con OK, y los subagentes con su contrato.

## Contexto
Las etapas 1 a 4 ya andan y están probadas con el simulador. Cada jugador entra con Google, sube sus fichas y los cambios se sincronizan sin perder ninguno.

Falta lo social, que es la etapa 5:
- el GM crea una campaña y manda un link;
- los jugadores se unen y le asignan una ficha;
- el GM ve y toca las fichas de todos;
- cada jugador ve un resumen de los demás.

La base ya está:
- **Reglas de seguridad:** ya están escritas (`frontend/firestore.rules`, campañas, `party`, `gm`, `log`) y tienen 24 tests.
- **Sincronización:** el motor ya sincroniza cualquier ficha que se le pase (`sync/characterSync.ts`, `loadRemoteCharacter` en `sync/cloudCharacters.ts`).

## Decisiones de Giuliano (2026-10-24)
1. **El GM edita ya:** sus cambios le llegan al jugador en 1 a 3 s, y si los dos tocan a la vez se aplican los dos. Lo que queda para la v5.2.0:
   - el log de qué hizo el GM;
   - las acciones especiales, como daño con armadura o críticas.
2. **Dónde ve el GM las fichas de sus jugadores:**
   - en el selector de fichas de arriba, marcadas "jugador: Nombre", así se abren con el HUD, Street Lab y las demás vistas;
   - en MESA // CAMPAÑA, en una lista de la party con HP y heridas de todos.
3. **Una ficha está en una sola campaña.** Un jugador puede estar en varias campañas, cada una con una ficha distinta. Para jugar el mismo personaje en otra mesa, se hace una copia.
4. **Extras:**
   - **cambiar el link:** el viejo deja de servir;
   - **echar a un jugador:** su ficha vuelve a ser solo suya;
   - **compartir el link:** con el menú de compartir del celular (WhatsApp y otros), o copiarlo en la compu.

   Borrar una campaña queda **fuera** de esta etapa.

## Qué ve cada uno
- **GM:**
  - crea una campaña con un nombre, y le aparecen los botones "Compartir link" y "Cambiar link";
  - ve la lista de miembros con los botones "Pasar el rol de GM" y "Echar";
  - ve la party: handle, rol, HP, estado de heridas, SP y heridas críticas de cada ficha asignada;
  - tiene las fichas de los jugadores en su selector, editables.
- **Jugador:**
  - abre el link; si no tenía sesión, entra con Google;
  - se une y elige qué ficha de la nube asigna a la campaña;
  - ve el resumen de los demás, no sus fichas completas;
  - puede salir de la campaña.
- **Echado:** la campaña le desaparece, su ficha queda solo suya y el GM deja de verla.

## Cambios

### 1. Reglas (`frontend/firestore.rules`)
- **Echar a un jugador:** el GM ve una ficha solo si el **dueño sigue siendo miembro** de la campaña. En `charCampaignGm` se agrega `data.ownerUid in campaign(...).memberUids`.
  - Así, al echarlo, el GM pierde el acceso aunque la ficha todavía diga esa campaña.
  - El dueño la limpia solo después.
- **Nombre del miembro:** se agrega `memberNames: { uid: nombre }` a la campaña.
  - Al unirse, cada uno solo puede escribir **su propia** clave (en las reglas de unirse y de salir).
  - El GM puede cambiar cualquier clave, por ejemplo al echar a alguien.
- **Tests de reglas nuevos:**
  - el GM no lee la ficha de un echado;
  - un jugador no puede escribir el nombre de otro;
  - unirse con `arrayUnion` funciona.

### 2. Repositorio de campañas (`sync/campaignRepo.ts`, nuevo)
Usa el SDK que ya expone `getFirebase()` (`fsSdk`), igual que `sync/firestoreAdapter.ts`.
- **`createCampaign(name)`:** el código de invitación son 16 caracteres al azar, con `crypto.getRandomValues`.
- **`subscribeMyCampaigns(cb)`:** consulta `memberUids array-contains uid`.
- **Unirse y salir:**
  - `joinCampaign(campId, code, name)` usa `arrayUnion` y escribe `lastJoinCode`;
  - `leaveCampaign`.
- **Acciones del GM:**
  - `kickMember` saca de `memberUids` y `memberNames`, y borra su `party`;
  - `passGm`;
  - `regenerateInvite`.
- **Party:** `subscribeParty(campId, cb)`, `writePartySummary` y `deletePartySummary`.
- **`assignCharacter(charId, campId | null)`:** escribe `campaignIds` con los campos de escritor, igual que `setSchemaVersion` en el adaptador.

### 3. Resumen de party (`sync/partySummary.ts`, nuevo, lógica pura con tests)
- **Contenido:** `buildPartySummary(sheet, ownerUid, ownerName)` arma lo siguiente:
  - handle y rol;
  - HP actual y máximo, con el cálculo que ya usa el HUD;
  - estado de heridas, con `woundStateForStabilization` (`engine/medicalRules.ts:60`);
  - SP de cabeza y torso;
  - nombres de las heridas críticas activas (`activeInjuries`).
- **`sameSummary(a, b)`:** se escribe solo si cambió alguno de esos campos (plan 17, punto 6).

### 4. Sesión de campañas (`sync/cloudCampaigns.ts`, nuevo, enganchado en `startSession`/`stopSession` de `sync/cloudCharacters.ts`)
- **Mis campañas:** se escuchan en vivo y se guardan en `cloudState`.
- **Si soy GM:** escucho la `party` de esa campaña. Por cada ficha que no es mía, reuso `loadRemoteCharacter`, que la carga, la migra si hace falta, la sigue y la deja editable.
  - Se guarda `cloudState.playerOwners[charId] = nombre` para la etiqueta del selector.
  - Si la ficha sale de la party, se deja de seguir y se quita del dispositivo del GM, sin borrarla de la nube.
- **Si soy jugador:** escucho la `party` para mostrar los resúmenes.
- **Escribir la party:** la escribe quien hizo el cambio.
  - **Cómo:** en el `tick` de 1 s que ya existe, si la ficha cambió **localmente**, su resumen es distinto del último de la party y pasaron 2 s sin cambios, se escribe.
  - **Cambios que vienen de la nube:** se marcan en `applyRemoteSheet` y no disparan una escritura, así no hay eco.
- **Echado o fuera de la campaña:** si una ficha mía apunta a una campaña que ya no está en mi lista, la app le limpia `campaignIds` sola.

### 5. Link de invitación
- **Formato:** `?unirse=<campId>.<código>`. Sirve igual en gh-pages y en `*.web.app`.
- **Al abrir la app** (`App.tsx`):
  1. se guarda la invitación en `sessionStorage`;
  2. se limpia la dirección con `history.replaceState`;
  3. se abre MESA // CAMPAÑA.
- **Con la sesión arrancada:** se une a la campaña y pide elegir una ficha.
- **Compartir:** `navigator.share` si existe, que en el celular abre WhatsApp y los demás; si no, `navigator.clipboard`.

### 6. Pantalla (`features/cloud/CloudTableView.tsx`)
- **Reemplazo:** la sección "CAMPAÑAS (se activa en las próximas etapas)" se cambia por esto:
  - crear campaña;
  - lista de mis campañas, con la etiqueta GM o jugador;
  - por cada campaña:
    - miembros y su ficha asignada;
    - botones según el rol;
    - selector "asignar ficha" con mis fichas de la nube que no están en otra campaña;
    - la party.
- **Selector de fichas de arriba** (el `combobox` de `App.tsx`): las fichas de jugadores muestran " · jugador: Nombre".
- **Estilo:** el mismo de la pestaña (`chamfer-card`, botón rojo `btn`).

### 7. Sin cambios en esta etapa
- celulares (etapa 6);
- prueba de presupuesto y cierre (etapa 7);
- reloj compartido y encuentro (v5.1.0);
- log del GM (v5.2.0).

## Orden de trabajo (un commit + CHECKPOINT por paso)
1. Guardar el plan 18 en `docs/plans/` y actualizar `README.md` y `CHECKPOINT.md`.
2. Reglas y sus tests (cambio 1).
3. `partySummary` con tests y `campaignRepo` (cambios 2 y 3), delegados a `cpr-worker` con spec quirúrgica. Reviso el diff.
4. `cloudCampaigns` y su enganche en la sesión (cambio 4).
5. Link de invitación y pantalla (cambios 5 y 6).
6. Prueba en el navegador y commit.

## Verificación
- **Desde `frontend/`:** `npx tsc -b --noEmit`, `npm test`, `npm run build`, y `npx vitest run --config vitest.rules.config.ts` con el simulador prendido.
- **Navegador, con el simulador:** dos usuarios en dos pestañas, con orígenes distintos para que no compartan la sesión: `localhost:5173` es el GM y `127.0.0.1:5173` el jugador. Se prueba que:
  1. el GM crea la campaña y copia el link;
  2. el jugador abre el link, se une y asigna su ficha;
  3. el GM ve la ficha en su selector con " · jugador: …";
  4. el GM le resta HP y el jugador lo ve en 1 a 3 s, y al revés;
  5. el jugador ve el resumen en la party y el GM la lista;
  6. el GM cambia el link y el viejo ya no sirve;
  7. el GM echa al jugador: la ficha desaparece del GM, y el jugador la conserva sin campaña;
  8. pasar el rol de GM;
  9. salir de la campaña.
