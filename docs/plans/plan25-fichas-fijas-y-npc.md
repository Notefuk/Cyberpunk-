# Plan 25: fichas fijas en la nube, el GM ve las de sus jugadores y fichas de NPC (v5.11.0)

[Claude Code · 2026-11-05]

## Contexto

Hoy el GM solo ve la ficha de un jugador si el jugador la asigna a mano a la campaña. Además, las fichas hay que subirlas a mano. Por eso Giuliano, que es el GM, no ve a Dow Jones aunque 1swordhie esté en su campaña.

Lo que pide Giuliano: que las fichas queden **fijas en la nube**. Una vez creadas quedan ahí, y el jugador y el GM las usan cuando quieren. Además pide separar las **fichas de jugador** de las **fichas de NPC**: sus enemigos no los pueden abrir los jugadores, que solo ven lo resumido en combate.

**Decisiones de Giuliano (2026-11-05)**
1. **Subida automática:** con la cuenta abierta, toda ficha que se cree o se importe sube sola a la nube.
2. **Campaña automática y fija:** las fichas de jugador de un miembro entran solas a la campaña y el jugador no las puede sacar. Solo salen si el jugador sale de la campaña o el GM lo echa.
3. **Nadie borra una ficha de la nube desde la app**, ni el jugador ni el GM. Lo que sí sigue funcionando es pasarla a otro jugador con el código.
4. **Al salir de la cuenta** se quitan del dispositivo, como hoy. En la nube siguen.
5. **Ficha de jugador o ficha de NPC.** El jugador nunca abre una ficha de NPC del GM. En combate ve solo lo resumido.

**Supuesto (aprobado con el plan):**
- Las fichas que hoy están *solo en el dispositivo*, como Toto (Test), **no** suben solas: siguen con SUBIR A LA NUBE, para que una ficha de prueba no quede para siempre en la campaña.
- Las precargadas del CEMK Folio nunca suben solas.

## Cómo queda para el usuario

- **STREET LAB:** cada ficha tiene un selector **Ficha de jugador / Ficha de NPC**. Una ficha nueva es de jugador. Si la crea el GM desde el panel GM, es de NPC.
- **Jugador:** crea su ficha con la cuenta abierta y la ficha queda en la nube y en la campaña. El GM la ve y la edita al momento. En MESA // CAMPAÑA ya no hay SACAR para las fichas de jugador. ASIGNAR queda solo para una ficha que haya subido a mano.
- **GM:**
  - En PARTY ve las fichas de todos sus jugadores.
  - Sus fichas de NPC quedan en su nube. No entran a la party y los jugadores no las pueden leer, porque la regla de la nube ya lo impide: solo las lee el dueño.
  - Desde el combate puede **agregar una ficha de NPC como enemigo**. Los jugadores ven lo mismo que hoy ven de cualquier enemigo: nombre, iniciativa, estado de heridas y nivel de amenaza. Si el GM toca "Revelar", ven también el SP y las armas. El HP nunca lo ven.
- **Borrar:** en STREET LAB, a una ficha que está en la nube no se le ofrece "borrar". Se explica: "Queda guardada en la nube. Podés pasársela a otro jugador". Las locales se siguen borrando como hoy.

## Cambios

1. **Tipo de ficha.** Campo nuevo `sheetKind?: 'player' | 'npc'` en `CharacterSheet` (`types/cyberpunk.ts`); si falta, cuenta como `'player'`. Viaja con la ficha a la nube, así que el GM y el jugador lo ven igual. El selector va en STREET LAB (`features/sheet/StreetLabView.tsx`), cerca del nombre y el rol.
2. **Subida automática** (`sync/cloudCharacters.ts`).
   - Al iniciar la sesión se anotan los ids locales que ya existen.
   - Toda ficha local que aparece después y no es precargada (su id empieza con `char-`) se sube con `uploadCharacters([id])`, la misma función de hoy.
   - El aviso del store ya existe en la suscripción (L366-377).
3. **Campaña automática** (`sync/cloudCampaigns.ts`). Función nueva `autoAssignFree()`.
   - Corre cuando llega la lista de campañas del servidor (como `cleanupOrphans`) y después de cada subida.
   - Para cada ficha mía de jugador sin campaña y sin traspaso pendiente, hace `assign(id, campId)`.
   - `campId` sale de una función pura nueva, `pickAutoCampaign` (`sync/autoAssign.ts`):
     - si soy jugador en una sola campaña, esa;
     - si soy jugador en varias, la mesa activa si es de jugador; si no, ninguna y queda para ASIGNAR a mano;
     - nunca una campaña donde soy GM.
   - `leave()` cambia de orden: primero salgo de la campaña y después `cleanupOrphans` libera las fichas, que ya lo hace hoy cuando te echan.
4. **No se publican NPC en la party.** `ensureMyEntries`, `tick` y `assign` saltean las fichas `npc`. El selector de ASIGNAR no las muestra.
5. **NPC al combate.**
   - Función nueva `enemySheetFromCharacter(sheet)`, en `store/encounterStore.ts` junto a `enemyFromSheet` (L157), que arma un `EnemySheet` desde la ficha: stats, HP, SP, armas y skills. Así se reusa `addEnemies`.
   - En el panel de combate del GM, un selector "Agregar NPC de mis fichas".
6. **Reglas (`frontend/firestore.rules`).**
   - `characters`: `allow delete: if false` (decisión 3).
   - `campaignChangeOk`: el dueño solo cambia `campaignIds` desde `[]` hacia una campaña donde es miembro, o de vuelta a `[]` si ya no es miembro de la campaña anterior (salió o lo echaron). Con eso la ficha queda fija mientras sea miembro.
   - Party: no se crea ni se actualiza el resumen de una ficha con `sheetKind == 'npc'`. Se chequea con `get(characters/charId)`, como defensa extra.
7. **UI.**
   - `CampaignPanel.tsx`: se saca SACAR de las fichas de jugador y se suma la línea "Tus fichas de jugador entran solas a esta campaña".
   - `CloudTableView.tsx`: "TUS FICHAS EN LA NUBE" muestra la etiqueta JUGADOR o NPC.
   - STREET LAB: el aviso en lugar de borrar.

## Tests

- **Unit:**
  - `pickAutoCampaign`: una campaña, varias con y sin mesa activa, GM de la campaña, ficha NPC, ficha con traspaso pendiente;
  - `enemySheetFromCharacter`;
  - la subida automática que ignora precargadas y fichas viejas.
- **Reglas** (`npm run test:rules`):
  - nadie borra una ficha;
  - el dueño no la saca de la campaña mientras es miembro, pero sí la libera después de salir;
  - el resumen de party de una ficha NPC se rechaza;
  - los tests de traspaso y de asignar siguen pasando.
- Desde `frontend/`: `npx tsc -b --noEmit`, `npm test`, `npm run test:rules` y `npm run build`, con 0 errores.

## Verificación de punta a punta (emulador, dos cuentas de prueba)

1. A (GM) crea una campaña y B se une.
2. B crea una ficha: sube sola y A la ve en PARTY y la edita.
3. B no tiene SACAR.
4. A crea una ficha y la marca NPC:
   - B no la ve en ningún lado;
   - leerla desde la consola de B da permiso denegado.
5. A la agrega al combate: B la ve en el orden con nombre y heridas, sin HP.
6. B sale de la campaña: su ficha queda en su nube, sin campaña.
7. Borrar desde la consola da permiso denegado.

En prod, con los OK de siempre: primero las reglas y después el hosting.
- Después, 1swordhie abre la app y Dow Jones, Kessler e Insurance entran solas a la campaña de Giuliano.
- Antes se cancela el código `DNAGF-QAF6P` de ayer, porque una ficha con traspaso pendiente no entra sola.

## Cierre

- Checklist `cpr-version-release` (v5.11.0).
- Plan guardado en `docs/plans/plan25-fichas-fijas-y-npc.md`.
- CHECKPOINT y commit en cada paso.
- Rama `claude/v5.11.0-fichas-fijas`.
