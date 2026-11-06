# Plan 26: todo Black Chrome (y Black Chrome+) en la app (v5.12.0 a v5.14.0)

[Claude Code · 2026-11-06]

## Contexto

Giuliano pide sumar todo Black Chrome. Ya estaba previsto en el plan 22 (en espera), que también abarcaba los Interface RED y FBC. Este plan **reemplaza la parte de Black Chrome del plan 22** y la ordena en versiones nuevas. El plan 22 queda en espera para el resto: los Interface RED y FBC.

**Qué hay en los libros** (leído con PyMuPDF; texto en el scratchpad: `bc.txt`, `bcplus.txt`)
- **Black Chrome (CR3061).** La página impresa es la del PDF menos 1. Trae **166 ítems**:
  - apps 5 (pp.11-14);
  - ciberware 20 y Cyberfingers 16 (pp.15-26);
  - moda y armadura 16 (pp.27-37);
  - equipo 19 (pp.39-50);
  - Linear Frames 4 (pp.51-56);
  - vehículos 31: 8 aéreos y 23 terrestres (pp.57-84);
  - armas 55: 8 explosivos, 15 cuerpo a cuerpo, 3 arrojadizas y 29 de fuego (pp.85-124).
  - Además:
    - Economics 101 (pp.125-130): la tabla "Find a Fixer/Tech" con el DV de Streetwise según el costo, y Lifestyles in Detail;
    - los **6 Night Markets** (pp.131-156), que son A 3-Piece's Joint, B Woodchipper's Block Party, C Molly Anderson's Market, D Mister K's Midnight Market, E Ms. Mynah's Night Market y F Rex Royale's Casino. Cada uno trae su Fixer, cómo entrar, la seguridad y un mapa con puestos;
    - las listas-resumen (pp.157-169);
    - la regla **Nomad Access** (p.9).
  - Cada ítem dice en qué puesto se vende, por ejemplo "Booth B1/F4".
- **Black Chrome+** (DLC): 12 ítems.
  - Munición 3, armas 6, armadura 1, droga 1 y otros 1.
  - También "Looking the Part" (pp.7-11) y "Looking at Linear" (pp.12-13), que son guías de estilo.
- **Night Markets al azar:** Black Chrome no trae tablas propias. Dice que el GM arma el mercado con las tablas del **Core p.338** y le suma los ítems de Black Chrome por puesto (BC p.7).

**Lo que hay hoy en la app**
- 31 ítems marcados Black Chrome en `data/core-rules.cprpack.json`. Hay que revisarlos: según el plan 22, 10 son inventados.
- `VEHICLES_CATALOG` (`data/netAndRolesData.ts` L664) tiene 14 vehículos y 13 son inventados.
- No hay generador de Night Market.

**Decisiones de Giuliano (2026-11-06)**
1. **Vehículos:** catálogo completo, con los 31 de Black Chrome y los genéricos del Core (pp.162-165).
   - Tienen lista en el Compendium y botón "Agregar al garaje".
   - Se borran los 13 inventados. Quien tenga uno lo conserva como vehículo propio y recibe un aviso.
2. **Ítems inventados:** se borran. Si una ficha tiene uno, se le avisa y el ítem queda como propio, sin borrarse de la ficha.
3. **Night Markets:** generador para el GM.
4. **Black Chrome+** entra en este plan.

## Cómo se trabaja
- Una rama por versión, con un commit y CHECKPOINT en cada paso. Push, PR, merge, beta y prod piden un OK cada uno.
- Cada dato cita libro y página. Las lecturas largas de los PDF las hace `cpr-scout` y devuelve JSON.
- Al cerrar cada versión se actualizan `docs/BIBLIOTECA.md`, `CONTENT_CHECKLIST.md` y `docs/canon-audit/vX.Y.Z.md` (qué se borró, qué entró, qué se corrigió).
- Para extraer los datos se sigue la skill `cpr-pdf-extractor`, con packs validados.

## Reusar
- **Ítems:** el pack `data/core-rules.cprpack.json` (weapons, armor, cyberware, gear, ammunition, drugs), con `sourceBook: 'black_chrome'` y `sourcePage`. Los ítems nuevos aparecen solos en la tienda del creador (`engine/creatorShop.ts`), en el detalle (`features/creator/steps/ShopItemDetail.tsx`) y en el Compendium.
- **Vehículos:** `OwnedVehicle` (`types/cyberpunk.ts` L524) y el garaje de `features/netroles/NetAndRolesDeckView.tsx`. `VehicleSpec` (`data/netAndRolesData.ts` L647) se cambia por la categoría nueva del pack.
- **Reglas:** `EXPANSION_RULE_SYSTEMS` en `data/expansionRulesData.ts`, para Nomad Access y la tabla Find a Fixer/Tech.
- **Aviso por ítems borrados:** la carga de fichas en `store/useCharacterStore.ts`, con la migración del persist.
- **Tienda para comprar desde el mercado:** `CompendiumShopModal` (`features/sheet/CompendiumShopModal.tsx`).

## Versiones

### v5.12.0: ítems de Black Chrome y Black Chrome+
1. **Limpieza:**
   - revisar los 31 ítems Black Chrome del pack contra el libro;
   - borrar los inventados;
   - al cargar una ficha que tenga uno, mostrar un aviso y dejar el ítem como propio (texto libre);
   - corregir los que existen pero tienen datos distintos al libro.
2. **Cargar los ítems de Black Chrome:**
   - ciberware 20 y Cyberfingers 16, con su HL, slots y requisitos;
   - moda y armadura 16;
   - equipo 19, incluidos S.I.C. (p.38), SovOil (p.56) y Triti-Fizz (p.124);
   - Linear Frames 4;
   - armas 55, con su tipo, daño, ROF, cargador y reglas especiales;
   - apps 5, como equipo con su texto.
   - Cada ítem lleva su puesto (`booth: ['B1','F4']`) para el generador de mercados.
3. **Cargar Black Chrome+:**
   - los 12 ítems;
   - "Looking the Part" y "Looking at Linear" como guías en el Compendium.
4. **Tests:**
   - la cantidad por categoría coincide con las listas del libro (pp.157-169);
   - todo ítem Black Chrome tiene página;
   - no queda ningún id inventado;
   - una ficha con un ítem borrado conserva el ítem y muestra el aviso.

### v5.13.0: catálogo de vehículos y Nomad Access
1. **Categoría nueva `vehicles` en el pack**, con:
   - empresa, tipo, Nomad Access, SDP, asientos y velocidad de combate y narrativa;
   - costo y categoría de precio;
   - mejoras incluidas y notas;
   - página.
2. **Vehículos que entran:**
   - los 31 de Black Chrome (pp.57-84; tabla en pp.162-164);
   - los genéricos del Core con sus mejoras (Core pp.162-165, Family Motorpool del Nomad).
3. **Inventados:** se borran los 13 de `VEHICLES_CATALOG`. Las fichas que los tengan en el garaje los conservan como propios y reciben un aviso.
4. **Pantallas:**
   - Compendium: lista de vehículos con filtro por tipo y libro.
   - Garaje: "Agregar al garaje", que copia SDP, asientos, velocidades y mejoras.
   - Tienda del creador: pestaña Vehículos.
5. **Nomad Access (BC p.9):**
   - al agregar un vehículo al Motorpool de un Nomad, solo se ofrecen gratis los que tienen Nomad Access menor o igual a su rango de Moto;
   - el vehículo llega con sus mejoras incluidas.
   - La regla también va en `EXPANSION_RULE_SYSTEMS`.
6. **Tests:**
   - hay 31 vehículos de Black Chrome y los del Core coinciden con la tabla del Nomad;
   - no queda ningún vehículo inventado;
   - agregar uno al garaje copia sus datos;
   - Nomad Access filtra por rango.

### v5.14.0: Night Markets y Economics 101
1. **Generador de Night Market para el GM** (panel GM):
   - **Mercado al azar:** usa las tablas del Core p.338, que se verifican contra el libro al implementar.
     - Se tiran las categorías y los ítems y se muestra la lista con precios.
     - Se puede volver a tirar una categoría.
     - Se suman los ítems de Black Chrome según el puesto (BC p.7).
   - **Mercados de Black Chrome:** se elige uno de los 6 (A-F) y la app muestra:
     - su Fixer, frecuencia, cómo conseguir invitación y seguridad, en un resumen, no el texto del libro;
     - los puestos con sus ítems, armados desde el campo `booth`.
   - Desde la lista, el GM puede abrir el detalle de un ítem, y un jugador puede comprarlo con la tienda que ya existe.
   - Si hay mesa online, el GM puede **mostrarle el mercado a la mesa**: los jugadores ven la lista y los precios.
2. **Economics 101:**
   - la tabla Find a Fixer/Tech (p.129): DV de Streetwise según el costo (500 → DV15, 1.000 → DV17, 5.000 → DV21, 10.000+ → DV24), como referencia;
   - Lifestyles in Detail (p.130) se suma a la información de estilos de vida que ya está (`housingOptions.ts`, `LIFESTYLE_RULES`).
3. **Tests:**
   - el generador usa solo ítems que existen;
   - cada mercado A-F tiene sus puestos;
   - la tabla de DV coincide con p.129.

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npm test` y `npm run build`, con 0 errores. Si cambian reglas de la nube, también `npm run test:rules`.
- En local:
  - **v5.12.0:** comprar un arma de Black Chrome en la tienda del creador y verla en la ficha. Cargar una ficha con un ítem borrado y ver el aviso.
  - **v5.13.0:** agregar un vehículo de Black Chrome al garaje y probar Nomad Access con un Nomad de rango 4.
  - **v5.14.0:** generar un mercado al azar y uno de Black Chrome, y mostrarlo a la mesa con el emulador.
- Cada versión pasa por la beta y prod con su OK.

## Cierre
- Checklist `cpr-version-release` en cada versión.
- Plan guardado como `docs/plans/plan26-black-chrome.md`. En `docs/plans/README.md` se anota que el plan 22 sigue en espera sin la parte de Black Chrome.
- Al terminar la v5.14.0, Black Chrome y Black Chrome+ pasan a ✅ en `docs/BIBLIOTECA.md`.
