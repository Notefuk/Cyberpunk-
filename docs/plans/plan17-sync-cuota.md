# Plan 17: sincronización con Firebase a prueba de cuota (v4.9.7 + capa de sync del plan 16)

[Claude Code · 2026-10-24]

Complementa al plan 16 (`docs/plans/plan16-firebase-mesa-online.md`). El plan 16 dice **qué** se sincroniza; este plan dice **cómo** hacerlo sin agotar la cuota gratis.
- **Al aprobarse:** se guarda como `docs/plans/plan17-sync-cuota.md`. Parte del borrador `recursive-moseying-metcalfe.md`, ya corregido contra el código y con las respuestas de Giuliano del 2026-10-24.
- **Reglas de trabajo:** este plan sigue `docs/PRINCIPIOS.md`:
  - **commits:** los hago yo;
  - **push:** cada uno con el OK explícito de Giuliano, un OK por push;
  - **gh-pages:** con un OK aparte;
  - **delegación:** solo en `cpr-scout`, `cpr-worker` (con el Contrato de Ejecución, por etapas y revisando el diff de cada una) y `github-web-deployer`.
- **Plan 16:** sigue siendo **borrador**. Aprobar el plan 17 autoriza solo la v4.9.7, que no usa Firebase. La v5.0.0 no arranca hasta que Giuliano apruebe el plan 16.

## Contexto
Giuliano pidió asegurar que usar la app en la mesa no agote la cuota gratis de Firebase: 50.000 lecturas y 20.000 escrituras por día y por proyecto. Revisé el código el 2026-10-24 y la app hoy escribe mucho más de lo que Firestore aguanta si se conecta tal cual.

**Campos que guardan con cada tecla.** Un nombre de 10 letras son 10 escrituras.
- `StreetLabView.tsx`: handle (647), rol (655), €$ escrito a mano (691) y textos del lifepath del rol (2797).
- `NetAndRolesDeckView.tsx:2638`: lifepath del rol.
- "Metros movidos" del HUD (`CombatHudView.tsx:8630`, que llama a `setMovedMeters`).
- Las notas secretas del GM (`FixerDeckView.tsx:255`, con un `useEffect` por cambio).

**Código existente**
- No hay ningún debounce ni throttle.
- Hay 93 `characters.map(...)` en `useCharacterStore`: cada acción reconstruye el array de fichas. Sin un diff, cada clic subiría la ficha entera.

**Listas que crecen sin tope**
- `ipLog`, el historial de Puntos de Mejora (`useCharacterStore.ts:64-80`).
- `speedhealLog`, en el store del reloj (`gameClockStore.ts:44`). No está en la ficha.
- `transactions`, el historial de €$: casi todas las acciones ya recortan a 50, salvo la compra de chips de Martial Arts (`useCharacterStore.ts:2788-2808`).

**Estado mezclado y guardado por fuera de los stores**
- `useCombatStore` mezcla en una sola clave, sin `partialize`:
  - la UI de cada jugador: `era`, `selectedDistance`, `autofireByWeapon`, `luckToSpendOnNextRoll`, `aimedShotTarget`;
  - el estado del combate: `rollHistory`, `round`, `turnLog`.
- El estado del GM se guarda con `localStorage.setItem` en `useEffect` por cada cambio:
  - el encuentro activo y los NPC propios (`EnemiesCompendiumPanel.tsx:276,334`);
  - las notas secretas (`FixerDeckView.tsx:255`);
  - las arquitecturas NET (`NetAndRolesDeckView.tsx:219`).

**Lo que queda igual**
- El borrador del creador (`creatorDraftStorage.ts`) guarda con cada tecla, pero es solo local y nunca va a la nube.
- No hay `setInterval` y ningún temporizador escribe solo.

## Decisiones de Giuliano (2026-10-24)
1. **Log de tiradas:** a la mesa van las de combate (ataques, daño, Death Saves, iniciativa) y las que el jugador marque "mostrar a la mesa". El resto queda en su celular.
2. **Primero la v4.9.7, sin Firebase:** arregla el guardado por tecla, pone topes a las listas y separa lo local del combate. También mejora el modo local.
3. **Firebase en el plan gratuito Spark, sin tarjeta.** Se pasa a Blaze solo si el uso real lo pide; se revisa después de las primeras sesiones.
4. **Espera para agrupar cambios:** 1,5 s, con un máximo de 5 s en las ráfagas largas.
5. **Historial de IP con un freno lejano de 2.000 movimientos.** Cada movimiento pesa unos 170 bytes; 2.000 son unos 340 KB, un tercio del techo de 1 MB por documento de Firestore. Los 170 bytes son una **estimación**: el tamaño real se mide en un test de la v4.9.7. Al llegar a 2.000:
   - los movimientos más viejos pasan a un archivo de historial dentro de la copia de seguridad, sin borrarse;
   - la app **avisa** y pide descargar la copia de seguridad.
6. **El freno anti-bucle cuenta por quien escribe, no por documento.** Si el GM hace daño a un player justo cuando este gasta munición, se aplican los dos cambios. Una escritura rechazada se reintenta sola y ningún cambio se pierde.
7. **El historial de €$ se queda en 50**, como hoy: se agrega el recorte que le falta a la compra de chips. **El `speedhealLog` sigue el mismo criterio que el de IP:** freno lejano en 500, lo viejo a la copia de seguridad y aviso.

## Cuánto cuesta (según el borrador del 2026-10-24; los reconfirmo en la documentación oficial de Firebase antes de la v5.0.0)
**Gratis por día y por proyecto** (en Spark, y también dentro de Blaze):
- 50.000 lecturas, 20.000 escrituras y 20.000 borrados;
- 1 GiB guardado y 10 GiB de transferencia por mes;
- Auth con Google sin costo.

**Si se pasa** (solo en Blaze): entre USD 0,03 y 0,06 cada 100.000 lecturas, y entre 0,09 y 0,18 cada 100.000 escrituras. Se confirma en la consola al crear el proyecto.

**Una sesión de 4 h con 6 jugadores y el GM:**

| Qué | Escrituras | Lecturas |
|---|---|---|
| Fichas: cambios agrupados, los leen el dueño y el GM | ~3.600 | ~7.200 |
| Resumen de party: cambia con HP, heridas o SP; lo leen 6 | ~700 | ~4.300 |
| Encuentro, cambios del GM en enemigos | ~1.200 | ~1.200 |
| Encuentro, vista pública con el estado de heridas | ~200 | ~1.400 |
| Log de tiradas: combate y públicas, lo leen 7 | ~1.000 | ~7.000 |
| Abrir la app y reconexiones | 0 | ~1.300 |
| **Total** | **~6.700 (34 %)** | **~22.400 (45 %)** |

- **Costo de la sesión:** USD 0.
- **Riesgo real:** un bug de eco entre dispositivos. El freno de las reglas (sync, punto 9) lo limita a 1 escritura por segundo por escritor y avisa al GM.
- **Si se agota la cuota en Spark:** la sincronización se pausa hasta la medianoche del Pacífico (4 o 5 de la mañana en Argentina). La app sigue con los datos locales y no se pierde nada.
- **Cuándo pasar a Blaze:** si una sesión normal pasa del 60 % del límite. En ese caso se pone una alerta de presupuesto en USD 5.

## Qué notan los jugadores
- **Retraso:** ven su cambio al instante en su celular, y a los demás les llega entre 1 y 3 s después.
- **Indicador:** muestra Guardando, Sincronizado, Sin conexión o Sincronización pausada.
- **Textos:** se suben al salir del campo o tras 1,5 s sin escribir. Si alguien cierra la app a mitad de un texto, queda en el celular y se sube al volver a abrirla.
- **Log de la mesa:** las tiradas que no son de combate tienen un botón "mostrar a la mesa".
- **Enemigos:** los jugadores ven el estado de heridas, no los HP exactos.
- **App en segundo plano:** después de 5 minutos deja de escuchar, y al volver tarda 1 o 2 s en ponerse al día.
- **Modo local, sin cuenta:** igual que hoy, más las mejoras de la v4.9.7.

## Cambios

### v4.9.7: preparación (sin Firebase, se publica sola)
Rama `claude/v4.9.7-preparacion-sync`.
1. **Hook `hooks/useCommittedField.ts`:** mientras se escribe, el texto queda en estado local. Se guarda en el store al salir del campo (`onBlur`), con Enter o tras 1,5 s sin escribir.
   - **Se aplica a:** handle, rol, €$ y lifepath del rol (`StreetLabView.tsx` 647, 655, 691 y 2797), `NetAndRolesDeckView.tsx:2638`, los metros movidos (`CombatHudView.tsx:8630`) y las notas secretas de `FixerDeckView.tsx`.
   - **No cambian** los botones +/-.
2. **Utilidad `utils/debounce.ts`**, con su test. La usan el punto 1 y los `useEffect` que escriben localStorage en `EnemiesCompendiumPanel.tsx:276,334`, `FixerDeckView.tsx:255` y `NetAndRolesDeckView.tsx:219`.
3. **Topes a las listas** (decisiones 5 y 7):
   - **`ipLog`:** freno en 2.000.
     - **Archivo:** lo viejo pasa a `ipLogArchive` dentro de la copia de seguridad (`buildFullBackup` / `parseFullBackup` en `store/persistence.ts`, líneas 323 y 378), que lo exportan y lo restauran.
     - **Los totales no pueden cambiar:** el panel de IP (`features/sheet/IpLedgerPanel.tsx:15`) suma todo el historial con `summarizeIpLog` (`engine/ipLedger.ts:6`). Al archivar, la ficha guarda los totales de lo archivado en un campo nuevo, `ipLogArchivedTotals` (ganados, ajustes, gastado en Rol, en skills y en artes marciales, y ediciones del GM), y `summarizeIpLog` los suma.
     - **Test:** los totales del panel son iguales antes y después de archivar.
   - **`speedhealLog`:** freno en 500, con el mismo criterio.
   - **`transactions`:** se agrega el `slice(0, 50)` que le falta a la compra de chips (`useCharacterStore.ts:2788`).
   - **Aviso:** usa `emitPersistenceWarning` (`store/persistence.ts`) y pide descargar la copia de seguridad.
   - **Fichas existentes:** la migración de persistencia v6 recorta lo que ya está guardado, con el mismo archivado y aviso. Ninguna ficha real llega hoy a 2.000, así que en la práctica no toca nada.
4. **Separar `useCombatStore`:** un `partialize` con dos grupos explícitos.
   - `local`: UI y preparación de la tirada.
   - `shared`: `rollHistory`, `round`, `turnLog` y los flags de la ronda.

   Por ahora los dos siguen en localStorage. En la v5.1.0 el grupo `shared` pasa al encuentro. Lleva la migración v3 del store de combate.
5. **Tests:**
   - el debounce;
   - el hook: blur, Enter y 1,5 s;
   - los frenos: 2.000 IP y 500 speedheal, con el archivo en la copia de seguridad y su restauración;
   - los totales de IP sin cambios al archivar;
   - el tamaño real en bytes de un movimiento de IP;
   - las migraciones v6 y v3 de combate.
6. **Cierre:**
   - APP_VERSION v4.9.7, changelogs firmados (lista de `docs/INDEX.md`) y CHECKPOINT;
   - tres OK separados de Giuliano: el push de la rama y el PR, el merge, y la publicación en gh-pages.

### Capa de sync a prueba de cuota (entra en la v5.0.0 y la v5.1.0 del plan 16, cuando se apruebe)
Módulo `frontend/src/sync/`. Las vistas no hablan con Firestore.
1. **`writeQueue.ts`, cola por documento:** agrupa los cambios 1,5 s después del último, con un máximo de 5 s.
2. **`diff.ts`, diff por campos:** manda solo las rutas que cambiaron, con `updateDoc`. Si cambia una lista entera, manda la lista.
3. **Contadores atómicos:** HP, Luck, Humanidad, €$, munición e IP se mandan con `increment(delta)`.
4. **Sin eco:**
   - el diff se calcula contra la última versión confirmada por el servidor;
   - un cambio remoto actualiza esa base y no genera una escritura;
   - se ignoran los snapshots con `hasPendingWrites`.

   Test obligatorio con dos clientes.
5. **Nada al abrir:** cargar o cambiar de pestaña no escribe. Una migración de `schemaVersion` escribe una sola vez.
6. **`party/{charId}`:** se escribe solo si cambia alguno de sus 6 campos.
7. **`listeners.ts`:** cada suscripción lleva conteo de referencias. Si la app pasa más de 5 minutos oculta, se pausan todas.
8. **Caché:** `persistentLocalCache` con `persistentMultipleTabManager`.
9. **Freno en las reglas por escritor** (decisión 6):
   - cada documento guarda `_ts` (hora del servidor) y `_by` (uid + dispositivo);
   - las reglas rechazan una escritura del **mismo escritor** si su anterior fue hace menos de 1 s;
   - el cliente reintenta las rechazadas con espera creciente y, si se repiten, le avisa al GM.
10. **Consultas con límite:** el log trae `limit(50)`. Las listas de campañas y personajes se leen una sola vez.
11. **Log de la mesa (v5.1.0):** combate y tiradas públicas, documentos de solo creación, y se conservan las últimas 200 por campaña.
12. **Enemigos en dos capas (v5.1.0):**
    - `gmCombatants`: completo, lo ve solo el GM;
    - `combatants`: la vista pública, que se escribe solo si cambia el estado de heridas.
13. **`quotaGuard.ts`, guardián de cuota:**
    - cuenta las operaciones de cada dispositivo por día del Pacífico;
    - con el 60 % pasa a modo ahorro, y con el 90 % sincroniza solo las fichas;
    - tiene un panel de uso.
14. **`sync/__tests__/sessionBudget.test.ts`:** simula una sesión de 4 h con 7 clientes contra un Firestore simulado. Falla si pasa de 10.000 escrituras o 25.000 lecturas.

## Orden de trabajo
1. Guardar este plan como `docs/plans/plan17-sync-cuota.md` (firmado e inmutable), sumarlo al índice `docs/plans/README.md` y anotar el avance en `CHECKPOINT.md`. Commit, y pedir el OK para el push.
2. Hacer la v4.9.7 (cambios 1 a 6).
3. La capa de sync espera a que se apruebe el plan 16. Antes de aprobarlo, se ajusta su sección "Cuotas" para que remita a este plan, y se le explica a Giuliano el plan 16 en limpio.

## Verificación
- `npx tsc -b --noEmit`, `npm test` y `npm run build`, desde `frontend/`.
- **Navegador** (`omni-deck-dev`):
  - un handle de 10 letras hace 1 sola escritura en localStorage (se mide con un espía en `setItem`);
  - +1 HP sigue siendo inmediato;
  - una ficha de prueba con 2.001 movimientos de IP queda con 2.000, avisa, el más viejo aparece en la copia de seguridad descargada y los totales del panel de IP no cambian;
  - las fichas viejas cargan bien.
- **Sync, con el emulador, en la v5.0.0:**
  - 10 clics de +1 HP en 2 s llegan como 1 escritura;
  - un cambio remoto no genera una escritura de vuelta;
  - el GM y el player escribiendo en el mismo segundo aplican los dos cambios;
  - un bucle forzado queda frenado a 1 escritura por segundo.
