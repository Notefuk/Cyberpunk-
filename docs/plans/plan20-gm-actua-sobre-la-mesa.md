# Plan 20: v5.2.0 y v5.3.0, el GM actúa sobre la mesa

[Claude Code · 2026-10-28]

Fase 3 del plan 16 (`docs/plans/plan16-firebase-mesa-online.md`, líneas 104-108), con la capa de sync del plan 17 (`docs/plans/plan17-sync-cuota.md`).
- **Al aprobarse:** se guarda como `docs/plans/plan20-gm-actua-sobre-la-mesa.md`, firmado e inmutable, y se suma a `docs/plans/README.md`.
- **Cómo se trabaja:** según `docs/PRINCIPIOS.md`. Rama `claude/v5.2.0-gm`, un commit con CHECKPOINT por paso, push solo con OK. Subagentes `cpr-scout` y `cpr-worker` con spec quirúrgica; reviso cada diff.

## Contexto
La v5.1.0 (en prod, `cpr-omni-deck-prod.web.app`) comparte reloj, era, encuentro y log, pero el GM todavía no actúa sobre los jugadores. Lo que hay hoy:
- **El GM ya puede escribir la ficha de un jugador.**
  - Las reglas lo permiten (`charCampaignGm`/`canEditCharacter`, `firestore.rules:47-60`).
  - La ficha del jugador vive en `useCharacterStore.characters` y se sincroniza sola (`sync/cloudCharacters.ts:298-333`, `putChar`, `loadPlayerSheet`).
  - Falta una forma cómoda de hacerlo y que quede en el log.
- **La cuenta del daño (SP, ablación, cabeza x2, críticas) está metida dentro del componente.** Vive en `handleApplyCalculatedDamage` (`features/combat/CombatHudView.tsx:1808-1860`) y solo actúa sobre la ficha activa (`ablateArmor`, `adjustHp`, `inflictRandomInjury`).
- **No existen las condiciones.** La ficha no tiene ningún campo para eso; "Prone" aparece solo como texto.
- **Los secretos del GM son locales:**
  - notas secretas: `cpr_gm_secret_notes_v1`, en `FixerDeckView.tsx:283-293`;
  - NPCs propios: `cpr_custom_npcs_v1` (`EnemySheet[]`), en `EnemiesCompendiumPanel.tsx:288-299`;
  - arquitecturas NET: `cpr_custom_net_arch_v1` (`NetArchitecturePreset[]`), en `NetAndRolesDeckView.tsx:141-226`.

  La regla `campaigns/{c}/gm/{doc}` (`firestore.rules:175-177`) ya existe, pero no hay código que la use.
- **El NET no se comparte.** `unlockedNetFloors` es un `useState`, y el "modo GM" del NET se abre sin ningún control.
- **El PIN del GM (`cpr_gm_pin_v1`) protege solo el Fixer Deck** (`FixerDeckView.tsx:96-160, 434`).

## Decisiones de Giuliano (2026-10-28)
1. **Daño al PJ:** en el orden de iniciativa y en la party, un botón "Daño" al lado de cada PJ abre una calculadora con la armadura del jugador (SP, ablación, cabeza x2, críticas). Queda en el log de la mesa.
2. **Condiciones:** van en esta tanda.
   - Es un campo nuevo en la ficha, con la lista canon: solo las que tienen regla en el libro, cada una con libro y página.
   - El GM las pone y las saca; el jugador las ve en su HUD.
3. **Secretos:** por campaña. Solo los ve el GM de esa campaña. Lo que el GM tiene local se copia a la mesa activa la primera vez.
4. **Revelar:** tres cosas.
   - los pisos NET al Netrunner;
   - la ficha pública de un enemigo (nunca los HP);
   - notas o handouts para toda la mesa.

**Desvío del plan 16:** la fase 3 sale en dos versiones para bajar el riesgo.
- **v5.2.0:** el GM actúa sobre los PJ (daño, críticas, condiciones, Humanidad y €$) y todo queda en el log.
- **v5.3.0:** secretos en la nube, revelar y PIN solo para el modo local.

## Diseño

### A. v5.2.0: el GM actúa sobre los PJ
1. **Motor de daño puro** (`engine/damageEngine.ts`, nuevo):
   - `computeHit({ damage, location, sp, ablationMode, isFbc, critSixes })` devuelve `{ hpLoss, spAfter, ablation, critical }`.
   - Sale de la cuenta inline de `CombatHudView.tsx:1808-1860`. El HUD pasa a llamarla, sin cambiar lo que hace.
   - Tests en `engine/__tests__/rules.test.ts` con cita:
     - el SP frena el daño y la armadura se abla 1 por impacto que pasa (Core p.186-187);
     - la cabeza multiplica el daño x2 (Core p.187);
     - dos 6 o más en los dados de daño dan herida crítica (Core p.187);
     - la regla de FBC que ya tiene el HUD.

     Las páginas se confirman contra el PDF en el paso 1.
2. **Acciones del store sobre cualquier ficha** (`store/useCharacterStore.ts`): se agregan `ablateArmorFor(charId, loc, n)`, `adjustHumanityFor(charId, delta)` e `inflictRandomInjuryFor(charId, loc)`.
   - Copian la lógica de las versiones que usan la ficha activa (líneas 769, 1672 y 1684, con la tabla Core o CEMK y la inmunidad de FBC).
   - Las versiones actuales pasan a llamar a las nuevas con `activeCharacterId`.
   - Se reusan `adjustHpFor`, `inflictSpecificInjury`, `spendEurodollarsFor` y `gmUpdateCharacterVitals`.
3. **Condiciones:**
   - **Datos:** `data/conditions.ts` con `CONDITIONS: { id, name, effect, source }[]`. La lista sale del libro con `cpr-pdf-extractor` en el paso 1, sin inventar: candidatas Prone, Grappled y On Fire (Core pp.178-180); se agregan las que tengan regla y se descartan las que no.
   - **Ficha:** campo opcional `conditions?: { id: string; since?: number }[]` en `types/cyberpunk.ts`. Sin migración y sin cambiar `schemaVersion`; sube por el diff normal de la ficha.
   - **Acciones:** `addConditionFor` y `removeConditionFor`.
   - **Pantalla:** chips en el HUD del jugador (`CombatHudView`, cerca de Biomonitor) con el efecto y la cita.
4. **Calculadora del GM** (`features/gm/GmTargetDialog.tsx`, nueva). Se abre desde `EncounterOrderStrip`, en las filas `kind: 'pc'`, y desde las filas de la party en `features/cloud/CampaignPanel.tsx`.
   - **Pestañas:**
     - **Daño:** dados o total, cabeza o cuerpo, tipo de ablación y "crítica". Muestra cómo queda antes de aplicar.
     - **Crítica:** al azar, o una elegida de la tabla.
     - **Condiciones.**
     - **Humanidad ±.**
     - **€$ ±, con motivo.**
   - **Ficha del jugador:** si no está cargada, se carga con `loadPlayerSheet` (`sync/cloudCharacters.ts:323`).
   - **Escritura:** los cambios van por `characterSync`. HP, Humanidad, €$ y SP ya van como `increment` (`COUNTER_PATHS`, `sheetDoc.ts:15-24`), así que no se pisan con lo que haga el jugador al mismo tiempo.
   - **Quién lo ve:** solo el GM de la mesa activa. Sin mesa, el botón no aparece.
5. **Log de la mesa:**
   - Se suma `kind: 'gm'` a `TableLogKind` (`sync/tableLog.ts:9`) y a la regla del log (`firestore.rules:187`). Solo el GM puede crearlo.
   - Ejemplo de entrada: label "GM → Doc Varela: daño 12 en cuerpo", detail "SP 11→10 · HP 25→24 · herida: Brazo Roto (Core p.188)".
   - Se publica con una función nueva, `publishGmAction(entry)`, en `sync/tableSync.ts`, al lado de `publishDeathSave` (línea 172).
6. **Reglas y tests:**
   - `kind 'gm'` solo para `isGmOf`.
   - El campo `conditions` lo escriben el dueño o el GM, igual que el resto de la ficha.
   - Test: un jugador no puede publicar un `gm`.
   - `sessionBudget.test.ts`: se suman unas 60 acciones del GM por sesión. Tiene que seguir por debajo de 10.000 escrituras y 25.000 lecturas.

### B. v5.3.0: secretos, revelar y PIN
1. **Secretos en `campaigns/{c}/gm/*`**, tres documentos:
   - `gm/notes`: `{ text }`, con un tope de 100.000 caracteres en la regla.
   - `gm/npcs`: `{ items: EnemySheet[] }`, hasta 200.
   - `gm/net`: `{ items: NetArchitecturePreset[] }`, hasta 50.
   - **Escritura:** se sube 1,5 s después de dejar de escribir (plan 17, línea 84) y la regla exige `writerOk`.
   - **Código:** un módulo chico, `sync/gmSecrets.ts`: `subscribe` mientras la mesa activa es del GM y `save` con espera.
   - **Pantallas:** `FixerDeckView`, `EnemiesCompendiumPanel` y `NetAndRolesDeckView`. Con mesa activa de GM leen y escriben ahí; si no, usan la clave local como hoy.
   - **Primera vez:** si el documento no existe y hay datos locales, se copian a la mesa activa y se avisa ("Copié tus notas, NPCs y NET a <campaña>").
2. **Revelar:**
   - **Enemigo:**
     - Se suma el campo `revealed` a la vista pública del combatiente (`combatants/{id}`, `sync/encounterSync.ts`) con lo que se muestra: facción, nivel de amenaza, SP de cabeza y cuerpo, nombres de las armas, reglas especiales y lore. Nunca los HP.
     - El GM lo revela o lo oculta desde el tracker. Los jugadores lo abren desde `EncounterOrderStrip`.
   - **Handouts:**
     - Colección `campaigns/{c}/reveals/{id}` con `{ kind: 'note', title, text, at, _by }`. Los miembros leen; el GM crea y borra.
     - Se muestran en un panel "De parte del GM", en MESA // CAMPAÑA, con un aviso en el HUD.
   - **Pisos NET:**
     - Documento `campaigns/{c}/reveals/net` con `{ archName, totalFloors, currentFloor, floors: NetFloor[], forCharId? }`. Solo lleva los pisos desbloqueados, con los campos públicos: número, tipo, nombre, DV y tipo de ICE. Los HP, ATK y DEF del ICE no van.
     - Se escribe cuando el GM desbloquea o cambia de piso en `NetAndRolesDeckView` (columna derecha, líneas 905-1060).
     - El Netrunner lo ve en vivo en la vista "Modo jugador" (líneas 666-701). Si se elige un `forCharId`, se resalta para él; igual los demás lo pueden leer.
3. **PIN y rol:**
   - Con mesa activa, el rol de la campaña manda. El GM no necesita PIN. El jugador no ve el Fixer Deck ni el modo GM del NET ni el editor de NPCs, y en su lugar aparece "Solo el GM de <campaña>".
   - Sin mesa, el PIN sigue como hoy y pasa a proteger también el modo GM del NET.
   - Se reusa `useActiveTable()` (`sync/tableSync.ts:45`).
4. **Reglas y tests:**
   - Validar la forma y el tamaño de `gm/*` y de `reveals/*`.
   - Tests: un jugador no lee `gm/*`; un jugador no escribe en `reveals`; el pedido de `reveals/net` no trae los HP del ICE.
   - Se suman al presupuesto: unos 30 guardados de secretos y 40 revelaciones por sesión.

## Orden de trabajo (un commit + CHECKPOINT por paso)
**v5.2.0**
1. Guardar el plan 20, actualizar el README de planes y CHECKPOINT, y crear la rama. Extraer del PDF, con `cpr-pdf-extractor`, la lista canon de condiciones y las páginas de la armadura y el daño.
2. `engine/damageEngine.ts` con tests de reglas. El HUD pasa a usarlo sin cambiar lo que hace.
3. Acciones `...For(charId)` en el store y condiciones (datos, campo, chips en el HUD).
4. `GmTargetDialog` en el orden de iniciativa y en la party, y log `kind: 'gm'`.
5. Reglas y presupuesto. Prueba con dos usuarios en el emulador. Cierre de la v5.2.0.

**v5.3.0**
6. `sync/gmSecrets.ts`, las tres pantallas con la nube y la primera copia.
7. Revelar enemigo, handouts y pisos NET.
8. PIN y rol, reglas, tests y presupuesto.
9. Prueba con dos usuarios en el emulador y cierre de la v5.3.0.

Cada versión se publica primero en la beta (gh-pages y Firebase dev). Después va a prod, que pide el deploy de reglas y hosting. Cada publicación lleva su propio OK.

## Verificación
- **Desde `frontend/`:** `npx tsc -b --noEmit`, `npm test`, `npm run build` y `npx vitest run --config vitest.rules.config.ts` con el emulador prendido.
- **Navegador, con el emulador, dos usuarios** (`localhost:5173` el GM, `[::1]:5173` el jugador):
  - **v5.2.0:**
    1. El GM abre "Daño" en el PJ desde el orden: 15 de daño al cuerpo con SP 11 → el HP del jugador baja 4, el SP queda en 10, y en los dos aparece la línea del log.
    2. Cabeza: el daño se duplica.
    3. El GM pone Prone y el jugador ve el chip con su cita. Después lo saca.
    4. Humanidad −2 y €$ +500 con motivo: el jugador lo ve en su ficha y en el log. Si el jugador gasta €$ al mismo tiempo, no se pisa.
    5. El jugador no ve ningún botón "Daño".
  - **v5.3.0:**
    1. El GM escribe una nota secreta, recarga y sigue ahí. El jugador no puede leerla.
    2. Los NPCs propios y los NET locales se copian solos a la mesa.
    3. El GM revela un enemigo y el jugador ve su ficha sin HP. El GM lo oculta y desaparece.
    4. El GM manda un handout y le llega al jugador.
    5. El GM desbloquea el piso 2 y el Netrunner lo ve con su DV y su ICE, sin los HP del ICE.
    6. El jugador no ve el Fixer Deck ni el modo GM del NET. Sin sesión, el PIN funciona como hoy.
