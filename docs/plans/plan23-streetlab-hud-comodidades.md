# Plan 23: comodidades de Street Lab y bandeja izquierda del HUD

[Claude Code · 2026-10-30]

## Contexto
Giuliano pidió cinco cambios para jugar más cómodo:
1. que la columna izquierda del ACTIVE COMBAT HUD (Biomonitor & Vitales, Matriz de blindaje, etc.) funcione como la bandeja de la derecha;
2. skills favoritas con una estrella;
3. que el botón de reparar armadura diga cómo se repara y qué cuesta;
4. un botón para comprar o añadir cosas desde Street Lab;
5. nombre propio para los ítems comprados (por ejemplo, "Cuchillo" para una Light Melee Weapon).

**Decisiones de Giuliano (2026-10-30)**
- **HUD:** la izquierda queda igual que la derecha. Tiene su propia bandeja, con "+ al centro", "Vista" y "Bandeja".
- **Reparar:** canon (Core p.140) más un campo opcional para pagarle a un Tech, como variante de mesa.
- **Comprar:** una ventana con el Compendium encima de Street Lab, con COMPRAR y GRATIS / LOOT.
- **Nombres:** valen para todo lo comprado: armas, armadura, mochila y ciberware. Se elige si se ve "Cuchillo (Light Melee Weapon)" o solo "Cuchillo".

**Lo que hay hoy**
- **HUD** (`features/combat/CombatHudView.tsx`):
  - Los paneles de la izquierda son `LeftPanelId` (vitals, armor, luck, injuries, cyberware, consumables; L478 y L482). Se pliegan, se reordenan y se pueden arrastrar, pero siempre están todos (L8874 `leftColumnOrder.map(renderLeftPanel)`).
  - La derecha tiene la bandeja "MÓDULOS TÁCTICOS" (L8961-9230): `activeCenterModules` (L978, `cpr_combat_active_center_v3`), módulos desactivados (`cpr_combat_disabled_right_modules_v1`), presets (`applyCenterPreset`), arrastre desde 'tray' (L1462-1480, L8880) y botones "➕ AL CENTRO / ➡️ A BANDEJA / VISTA".
- **Reparar** está en tres lugares, y en ninguno se explica la regla ni se descuenta plata:
  - HUD L3453 y L3538, con `repairArmor(location)`;
  - Street Lab L1723 y L1757;
  - Street Lab L4079-4103, con `repairCharacterArmor(loc, 'full', 0)`, que ya acepta un costo en €$ (`store/useCharacterStore.ts` L1432).
- **Regla de reparar (Core p.140, "Item Repair")**: se tira TECH + la skill que corresponde al ítem. La armadura no tiene una skill propia, así que va con Basic Tech (Core p.84). El DV y el tiempo dependen de la categoría de precio:

  | Categoría | DV | Tiempo |
  |---|---|---|
  | Cheap / Everyday | 9 | 1 hora |
  | Costly | 13 | 6 horas |
  | Premium | 17 | 1 día |
  | Expensive | 21 | 1 semana |
  | Very Expensive | 24 | 2 semanas |
  | Luxury | 29 | 1 mes |
  | Super Luxury | 29 | 1 mes por cada 10.000 €$ |

  - Si la tirada falla, a mitad de camino te das cuenta de que tenés que empezar de nuevo.
  - El libro no pide materiales: no cuesta plata.
  - El Tech con Field Expertise puede emparchar el ítem (jury-rig) como Acción, al mismo DV, y le dura 10 minutos por rango (Core p.147).
- **Comprar**: `features/compendium/CompendiumView.tsx` (L284, sin props) ya tiene "💳 COMPRAR (−X €$)" y "🎁 GRATIS / LOOT (0 €$)" por categoría (`handleAcquire`).
- **Ítems del personaje** (`types/cyberpunk.ts`):
  - armadura en `headArmor` y `bodyArmor` (L574, L581);
  - armas en `equippedWeapons` (L589, con `instanceId`);
  - mochila en `InventoryItem` (L438, con `id`);
  - ciberware en `installedCyberwareIds` (L590, solo ids).
  - Hay lógica que compara por nombre (por ejemplo, Compendium L835 `headArmor.name.includes(item.name)`), así que el nombre original no se toca.
- **Skills de Street Lab**: `filteredSkillKeys` (`StreetLabView.tsx` L543); no hay favoritas.

## v5.8.0: comodidades de Street Lab

1. **Skills favoritas**
   - Campo `favoriteSkills?: string[]` en `CharacterSheet`. Viaja con la ficha a la nube igual que el resto.
   - Cada fila de la lista de habilidades (Street Lab, L1366 en adelante) suma una ☆/★ para marcarla.
   - Arriba de la lista va el botón "★ Solo favoritas", que filtra `filteredSkillKeys`. Ese filtro es por persona y se guarda en el navegador (`cpr_streetlab_fav_only_v1`).
   - Si no hay favoritas, el botón avisa "Tocá ☆ en una skill para marcarla".
   - Acción del store: `toggleFavoriteSkill(key)`.

2. **Reparar armadura explicado**
   - Función pura nueva, `armorRepairInfo(armorName)`, en `engine/armorRepair.ts`.
     - Busca la armadura en el pack por nombre y devuelve `{ tier, dv, time, skill: 'Basic Tech', page: 'Core p.140' }`.
     - Si no la encuentra, devuelve "categoría desconocida: preguntale al GM".
     - La Bodyweight y la Flak se reparan las dos piezas juntas (Core p.350).
   - Al tocar "Reparar" se abre un panel chico con:
     - "Tirada: TECH + Basic Tech + 1d10 contra DV 17 · Tiempo: 1 día · Si fallás, empezás de nuevo (Core p.140)";
     - "Costo por el libro: 0 €$";
     - un campo opcional "Le pago a un Tech: ___ €$ (variante de mesa)";
     - una nota sobre el jury-rig del Tech (Core p.147);
     - el botón "Reparado" llama a `repairCharacterArmor(loc, 'full', costo)`, que descuenta y deja la transacción en la billetera.
   - Componente compartido nuevo, `features/sheet/ArmorRepairDialog.tsx`. Se usa en los tres lugares (Street Lab x2 y HUD x2) en vez del reparado instantáneo.
   - **Tests:** Light Armorjack (Premium) da DV17 y 1 día; Kevlar (Costly), DV13 y 6 horas; Metalgear (Luxury), DV29 y 1 mes; un nombre desconocido no rompe.

3. **Comprar / Añadir desde Street Lab**
   - El botón "+ Comprar / Añadir" va en ARSENAL (arriba de la lista de armas) y en MOCHILA.
   - Abre una ventana (portal, como `Modal` de `ShopItemDetail.tsx`) con `CompendiumView` adentro.
   - `CompendiumView` suma una prop opcional `initialCategory`, para abrirse en la categoría de donde viene (armas o equipo) y no cambiar su uso actual.
   - Se cierra con ✕ o con Escape. Lo comprado aparece en la ficha al momento, porque es el mismo store.

4. **Nombre propio de los ítems**
   - Campo `itemNicknames?: Record<string, { name: string; showOriginal: boolean }>` en `CharacterSheet`. La clave es la del ejemplar:
     - el `instanceId` en las armas;
     - el `id` en la mochila;
     - `armor-head` y `armor-body` en la armadura;
     - el id del ciberware.
   - Helper `displayItemName(sheet, key, original)` en `engine/itemNames.ts`: devuelve "Cuchillo (Light Melee Weapon)", solo "Cuchillo" o el original si no hay apodo.
   - Un botón ✎ al lado del nombre (en ARSENAL, MOCHILA, blindaje y ciberware de Street Lab) abre un campo para el nombre propio, la casilla "Mostrar el nombre del libro entre paréntesis" y "Quitar nombre propio".
   - El nombre propio se ve en Street Lab, en el HUD (En mano, Arsenal y Blindaje) y en la ficha imprimible si existe. Las reglas, los totales y las comparaciones siguen usando el nombre original.
   - Al borrar el ítem se borra su apodo.
   - Acciones del store: `setItemNickname(key, nick | null)`.
   - **Tests:** las dos formas de mostrarlo; quitar el apodo; borrar el ítem limpia el apodo.

5. **Cierre de versión**
   - Checklist `cpr-version-release`.
   - CHECKPOINT y commit en cada paso.

## v5.9.0: bandeja izquierda del HUD

1. **Estado nuevo**, igual que la derecha y en el navegador:
   - `activeCenterLeftModules` (`cpr_combat_active_center_left_v1`);
   - `disabledLeftModules` (`cpr_combat_disabled_left_modules_v1`).
2. **Columna izquierda**
   - Arriba lleva la bandeja "🩺 BIOMONITOR & VITALES" (contador `n/6`) con los 6 paneles. Cada uno tiene "➕ AL CENTRO / ➡️ A BANDEJA", "VISTA" y se puede arrastrar.
   - Abajo de la bandeja se ven solo los paneles que no están en el centro ni desactivados, en el orden de `leftColumnOrder`.
3. **Centro**
   - Muestra primero los paneles de la izquierda que se mandaron ahí (con `renderLeftPanel`) y después los de la derecha.
   - Acepta lo que se suelta desde las dos bandejas (`draggedItem.column` suma 'leftTray').
4. **Botones**
   - "Restaurar orden" vuelve también a la izquierda por defecto: los 6 visibles en la columna y ninguno en el centro.
   - "Contraer secundarias" sigue igual.
   - Los presets del centro no tocan la izquierda.
5. **Celular**: las bandejas se apilan como hoy; la bandeja izquierda arranca plegada para no empujar el Biomonitor hacia abajo.
6. **Tests**: una función pura `splitLeftPanels(order, center, disabled)` devuelve `{ column, center }` sin repetidos.
7. **Cierre de versión**: igual que la v5.8.0.

## Archivos críticos
- `frontend/src/types/cyberpunk.ts`: `favoriteSkills` e `itemNicknames`.
- `frontend/src/store/useCharacterStore.ts`: `toggleFavoriteSkill`, `setItemNickname` y limpieza al borrar ítems.
- Nuevos:
  - `frontend/src/engine/armorRepair.ts`
  - `frontend/src/engine/itemNames.ts`
  - `frontend/src/features/sheet/ArmorRepairDialog.tsx`
- `frontend/src/features/sheet/StreetLabView.tsx`: estrella, reparar, botón de comprar y ✎.
- `frontend/src/features/compendium/CompendiumView.tsx`: prop `initialCategory`.
- `frontend/src/features/combat/CombatHudView.tsx`: reparar, nombres propios y bandeja izquierda.
- Tests:
  - `engine/__tests__/armorRepair.test.ts`
  - `engine/__tests__/itemNames.test.ts`
  - `splitLeftPanels`

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npm test` y `npm run build`, con 0 errores.
- En el navegador local, en tamaño iPad y en escritorio:
  - ★ en Handgun y "Solo favoritas" muestra solo Handgun; al recargar sigue marcada.
  - Reparar la Light Armorjack muestra DV17 y 1 día. Con "Le pago a un Tech: 50" descuenta 50 €$ y aparece en la billetera; sin monto, no descuenta nada.
  - "+ Comprar / Añadir" en ARSENAL abre el Compendium en armas. Comprar una Heavy Pistol la agrega a la ficha y descuenta la plata.
  - Ponerle "Cuchillo" a la Light Melee Weapon se ve en Street Lab y en el HUD. El ataque sigue con DEX + Melee Weapon.
  - v5.9.0: mandar Biomonitor al centro, esconder Suerte, recargar y ver que queda igual; "Restaurar orden" vuelve todo.
  - Consola limpia.
