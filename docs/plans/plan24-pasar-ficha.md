# Plan 24: pasarle una ficha a otro jugador (v5.10.0)

[Claude Code · 2026-11-04]

## Contexto
La ficha de Dow Jones quedó en la nube de la cuenta de Giuliano, pero es de un jugador. Hoy no hay forma de pasarla: cada ficha de la nube tiene un dueño fijo. La regla `request.resource.data.ownerUid == resource.data.ownerUid` (`frontend/firestore.rules` L91) impide cambiarlo.

**Decisiones de Giuliano (2026-11-04)**
- **Cómo:** traspaso. La ficha deja de ser tuya y pasa a la cuenta del jugador. No es una copia.
- **Dónde:** en MESA // CAMPAÑA, en la lista "TUS FICHAS EN LA NUBE".
- **Código:** vence a las **24 horas**, y se puede cancelar antes.
- **Campaña:**
  - Si quien la recibe ya es miembro de la campaña de la ficha, la ficha **queda en la campaña**. El GM la sigue viendo y editando, como cualquier ficha de jugador.
  - Si no es miembro, la ficha sale de la campaña (`campaignIds: []`) y él la agrega cuando se una.

## Cómo funciona (para el usuario)
1. **Quien la da:** en "TUS FICHAS EN LA NUBE", cada ficha suma un botón **PASAR A OTRO JUGADOR**.
   - Al tocarlo, la app crea un código, por ejemplo `K7P4Q-X9M2R`, con botón **Copiar**.
   - Muestra a qué hora vence y un botón **Cancelar**.
   - Mientras el código está activo, la fila dice "Esperando que la reciban (vence 05/11 18:00)".
2. **Quien la recibe:** en un bloque nuevo, **RECIBIR UNA FICHA**, pega el código.
   - La app le muestra "Hie te pasa a Dow Jones (Nomad 4)" y el botón **ACEPTAR**.
   - Al aceptar, la ficha queda en su cuenta, con sus historiales de IP y €$.
3. **Del lado de quien la dio:** la ficha se quita de ese dispositivo y aparece el aviso "Dow Jones ahora es de otro jugador".
   - Si es el GM y la ficha quedó en su campaña, la vuelve a ver como ficha de jugador, igual que las otras de la party.

## Datos y reglas (`frontend/firestore.rules`)
- **Colección nueva `transfers/{code}`**:
  - campos: `{ charId, fromUid, fromName, handle, role, roleRank, createdAt, expiresAt }`;
  - el código tiene 10 caracteres de un alfabeto sin letras que se confundan (ni 0/O ni 1/I).
  - **get:** cualquiera con sesión, para ver la vista previa. **list:** prohibido, así nadie puede recorrer los códigos.
  - **create:** solo si `fromUid == uid()`, la ficha `charId` es del que crea, `expiresAt` es como mucho `request.time + 24 h` (más un margen chico) y el id tiene 10 caracteres.
  - **delete:** quien lo creó (para cancelar), o el nuevo dueño de la ficha (para limpiar después de recibirla).
- **Ficha `characters/{id}`, campo nuevo `transferCode`** (string opcional):
  - Lo pone y lo saca el dueño con el update normal.
  - Se suma a `META_FIELDS` en `sync/sheetDoc.ts`, para que el motor de sync no lo borre ni lo meta en la ficha.
- **Rama nueva en `allow update` de `characters` ("recibir")**, para quien no es el dueño. Exige todo esto:
  - `resource.data.transferCode` coincide con un `transfers/{code}` que existe;
  - `transfer.charId == charId`;
  - `transfer.fromUid == resource.data.ownerUid`;
  - `request.time < transfer.expiresAt`;
  - `request.resource.data.ownerUid == uid()`;
  - `transferCode` se borra;
  - solo cambian `ownerUid`, `transferCode`, `campaignIds`, `_w`, `_ts` y `_lastWriter` (`diff().affectedKeys().hasOnly`);
  - `campaignIds` queda `[]`, o queda igual si `isMemberOf` esa campaña;
  - `writerOk`.
- **Party `campaigns/{c}/party/{charId}`:** hoy `ownerUid` no puede cambiar (L171). Se permite que cambie cuando el nuevo `ownerUid` es el dueño actual de la ficha: `get(characters/charId).ownerUid`. Así el nuevo dueño republica el resumen.
- Los historiales `ipLog` y `transactions` no cambian: ya los lee y escribe quien puede editar la ficha.

## Código
- **`sync/firestoreAdapter.ts`**, funciones nuevas en `CloudRepo`:
  - `createTransfer(charId, info, writerId)`: escribe `transfers/{code}` y el `transferCode` de la ficha;
  - `cancelTransfer(code, charId, writerId)`;
  - `getTransfer(code)`;
  - `claimTransfer(code, charId, campaignIds, writerId)`: un `updateDoc` con `ownerUid`, borra `transferCode`, y escribe `campaignIds` y los campos de escritor;
  - `deleteTransfer(code)`.
  - El código se genera con una función pura nueva `newTransferCode(rand)`, en `sync/transferCode.ts`, junto con `formatTransferCode` y `parseTransferCode`. Acepta el código con o sin guion y en minúsculas.
- **`sync/cloudCharacters.ts`**, funciones exportadas nuevas:
  - `offerTransfer(id)`, `cancelOfferedTransfer(id)`, `previewTransfer(code)` y `acceptTransfer(code)`.
  - `acceptTransfer` hace esto:
    1. lee el transfer y revisa que no venció;
    2. decide `campaignIds`: los mantiene si la campaña está en `useCloudState.campaigns`, que son las mías; si no, `[]`;
    3. llama a `claimTransfer` y después a `deleteTransfer`;
    4. carga la ficha con `getCharacter` y `loadRemoteCharacter`, que ya existen, y la agrega a `owned`.
  - **Pérdida de la ficha:** en `subscribeDoc`, si llega `ownerUid !== uid` o un `permission-denied`, se llama a una función nueva `dropLostSheet(s, id)`. Es la misma lógica que `dropPlayerSheet` (L111): deja de seguirla y la saca del store. Además muestra un aviso en `useCloudState`.
    - Si soy el GM de la campaña, el controlador de campañas la vuelve a cargar sola desde la party (`loadPlayerSheet`).
    - `firestoreAdapter.subscribeDoc` gana un callback de error opcional. Hoy el error solo va a `console.error`.
  - El estado "código activo" se lee del `transferCode` de la ficha. La hora de vencimiento sale de `getTransfer`, se busca una sola vez y se guarda en `useCloudState.pendingTransfers`.
- **`features/cloud/CloudTableView.tsx`:**
  - el botón por fila, con un modal chico que tiene el código, Copiar, el vencimiento y Cancelar;
  - el bloque "RECIBIR UNA FICHA", con un campo, la vista previa y ACEPTAR;
  - los mensajes de error: "El código venció", "No existe ese código" y "No podés recibir tu propia ficha".
- La ficha local no cambia de forma: `CharacterSheet` no suma campos, porque `transferCode` es meta de la nube.

## Tests
- **Reglas** (`src/sync/__tests__/rules/firestore.rules.ts`, `npm run test:rules` con el emulador):
  - el dueño crea y cancela el código;
  - nadie crea un código para una ficha ajena, ni con vencimiento de más de 24 h;
  - `list` de `transfers` prohibido;
  - otro jugador recibe con el código correcto;
  - no se recibe con un código vencido, con un código de otra ficha, ni cambiando otros campos;
  - la campaña se mantiene si es miembro y no si no lo es;
  - el viejo dueño ya no lee la ficha, salvo que sea el GM;
  - el nuevo dueño republica la party con su `ownerUid`.
- **Unit:**
  - `transferCode.test.ts`: genera, formatea y parsea, sin caracteres confusos;
  - la decisión de `campaignIds`.
- Desde `frontend/`: `npx tsc -b --noEmit`, `npm test`, `npm run test:rules` y `npm run build`, con 0 errores.

## Publicación
- Las reglas nuevas van con el código. Hay que publicarlas con `firebase deploy --only firestore:rules`:
  - en dev (`cpr-omni-deck-dev`), para la beta;
  - en prod (`cpr-omni-deck-prod`).
  - Cada deploy de reglas a prod pide un **OK aparte**, igual que el hosting.
- **Orden:** primero las reglas y después el hosting. Las reglas nuevas aceptan todo lo que la app vieja hace.

## Verificación de punta a punta
- Local, con el emulador de Firebase y dos cuentas de prueba (A y B) en `demo-cpr-omni-deck`:
  1. A sube una ficha, toca PASAR y copia el código.
  2. B pega el código, ve la vista previa, acepta, y ve la ficha con sus IP y €$.
  3. A deja de verla y le aparece el aviso.
  4. Con una campaña de A en la que B es miembro, la ficha sigue en la party y A la edita como GM.
  5. Con un código vencido (expiresAt forzado), sale el error.
- Consola limpia.
- **Después, en prod con el OK:** Giuliano le pasa a Dow Jones a su jugador real.

## Cierre
- Checklist `cpr-version-release`, con v5.10.0 (minor: sistema nuevo).
- Guardar este plan en `docs/plans/plan24-pasar-ficha.md`.
- CHECKPOINT y commit en cada paso.
- Rama `claude/v5.10.0-pasar-ficha`.
