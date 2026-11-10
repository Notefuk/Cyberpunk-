# Plan 27: terminar lo que queda del plan 22 (Interface RED 1-4 y Going Metal), sin Elflines (v5.15.0 a v5.20.0)

[Claude Code · 2026-11-10] Aprobado por Giuliano el 2026-11-10. Reemplaza lo que quedaba del plan 22 (`plan22-interface-blackchrome-fbc.md`); la parte de Black Chrome se hizo en el plan 26. Este archivo no se edita: el avance va en `CHECKPOINT.md`.

## Contexto
El plan 22 (`docs/plans/plan22-interface-blackchrome-fbc.md`, en espera) tenía tres partes: Interface RED, Black Chrome y FBC. Black Chrome ya se hizo en el plan 26 (v5.12.0 a v5.14.1). Este plan **reemplaza lo que queda del plan 22** y lo ordena en versiones nuevas. Cuando se cierre, el plan 22 pasa a "reemplazado por los planes 26 y 27".

**Qué falta (inventario del 2026-11-10)**
- **Going Metal / FBC:**
  - el tope de terapia no usa el HL de cada pieza del paquete (`calculateTherapyMaxHumanity`, `engine/characterEngine.ts` L471);
  - no está la regla de volver a un cuerpo viejo (Going Metal p.94);
  - `CONTENT_CHECKLIST.md` L177-178 da por pendientes la CO2 Grenade y el Linear Frame Ω External, que ya existen;
  - dos contradicciones del libro: el HL del Enforcer (53 en p.100, 55 en el ejemplo de p.95) y el precio del ejemplo Bazooka Joe (27,700eb contra 26,800eb de la suma).
- **Ítems sin cargar:**
  - Must Have Cyberware Deals (12 ciberware);
  - 12 Days of Cybermas (12 ciberware);
  - Exotics of 2045 (17 paquetes Bioexotic y FantaForm, y 8 ciberware, IR2 pp.66-76);
  - Woodchipper's Garage (12 armas explosivas);
  - Midnight with the Upload (15 cyberdecks, y 11 de hardware y programas);
  - 12 Days of Gearmas (13 ítems, IR4 pp.66-73);
  - All About Drones (6 drones, IR1 pp.58-65);
  - el equipo de Night City Weather (5) y el de Stickball;
  - Old Guns Never Die (regla de conversión, IR1 pp.3-5).
- **Error del plan 26:** el Sternmeyer M-02 se borró como "inventado", pero está en Woodchipper's Garage. Vuelve.
- **Tarjetas inventadas en DATA PACKS:** las de Woodchipper's Garage, Must Have Cyberware Deals, Midnight with the Upload y Toggle's Temple tienen texto que no coincide con el libro (`features/datapacks/DataPackManagerView.tsx` L260-370).
- **Movilidad:**
  - Spinning Your Wheels (bici, patines, skateboard, mejoras y trucos);
  - Cyberchairs (2 sillas y sus reglas, IR1 pp.38-40);
  - Zonda Metrocar (Gearmas);
  - The Dreaded Punknaught (vehículo jefe, IR4 pp.38-45).
- **Vivienda:**
  - Cargo Containers & Cube Hotels (muebles y accesorios, IR2 pp.34-39);
  - Corporate Conapts & Studio Apts (10 y 10 con tirada 1d10, muebles corporativos y tabla de vivienda al azar, IR4 pp.46-55).
- **Tablas del GM:**
  - Achievements & Loot Boxes (unos 35 logros y 10 cajas de botín, IR4 pp.24-31);
  - Night City Weather (tablas 1d6 por estación, Strange Weather y temperatura, IR2 pp.16-21);
  - Digital Dating (Datepath);
  - Collecting the Random;
  - Salvaging Night City.
- **Pregens y PNJ:**
  - Single Shot Pack (10 pregens y 4 arquitecturas NET, IR1 pp.10-37);
  - Jumpstart Kit Conversion Guide (11 PNJ y 2 NET, IR2 pp.22-33);
  - Halloween Screamsheets (3 aventuras, IR4 pp.56-65);
  - revisar Hardened contra IR2 e IR3.
- **Stickball:** reglas del deporte (IR4 pp.32-37).

**Decisiones de Giuliano (2026-11-10)**
1. **Elflines Online queda afuera:** Core, Expansion Pack 1, Daeric Sylar's Guide y Elflines TCG, del que además no hay PDF. Se anota como fuera de alcance.
2. **Enforcer:** se queda en 53, como su ficha (p.100), con una nota sobre el 55 del ejemplo de p.95.
3. **Pregens:**
   - Las 10 de Single Shot entran como fichas jugables, con el **Neuroport de CEMK ya instalado**, igual que las del Folio CEMK.
   - Los PNJ de Jumpstart y Halloween van al bestiario.
   - Las arquitecturas NET van al NET.
4. **Pestaña nueva solo para el GM** con:
   - logros y cajas de botín;
   - clima de Night City;
   - Digital Dating;
   - Collecting the Random;
   - Salvaging Night City.

## Cómo se trabaja
- Una rama por versión, con un commit y CHECKPOINT en cada paso. Push, PR, merge, beta y prod piden un OK cada uno. Las reglas de Firestore solo si cambian.
- Cada dato cita libro y página. Se usa la página del Interface RED cuando el artículo está ahí. Para el Vol. 3, que es una imagen sin texto, se usa la página del DLC suelto.
- La extracción sigue la skill `cpr-pdf-extractor`:
  - `cpr-worker` arma un JSON por artículo en el scratchpad;
  - se valida contra el libro antes de pasarlo al pack;
  - los textos en español son resúmenes propios.
- Al cerrar cada versión:
  - se actualizan `docs/BIBLIOTECA.md`, `CONTENT_CHECKLIST.md` y `docs/canon-audit/vX.Y.Z-*.md`;
  - se corre el checklist `cpr-version-release`.

## Reusar
- **Ítems:**
  - el pack `data/core-rules.cprpack.json`, con `sourceBook`, `sourceBookTitle` y `sourcePage`. Aparecen solos en la tienda del creador, el Compendium y la tienda de STREET LAB;
  - el test `engine/__tests__/blackChromeCatalog.test.ts` sirve de modelo para cantidades y páginas.
- **Ítems borrados:** `data/removedCatalogItems.ts`, de donde se saca el Sternmeyer M-02.
- **Vehículos:**
  - `data/blackChromeVehicles.ts`, `engine/vehicleCatalog.ts` y `features/compendium/VehicleCatalogList.tsx`, que se generaliza a vehículos de otros libros;
  - el garaje de `features/netroles/NetAndRolesDeckView.tsx`.
- **Reglas:** `EXPANSION_RULE_SYSTEMS` (`data/expansionRulesData.ts`) para Stickball, Old Guns Never Die, Cyberchairs y Salvaging.
- **FBC:** `data/goingMetalFbcData.ts` (listas `cyberwareHl` y `cyberwareNoHl`) y `calculateTherapyMaxHumanity`. El HL de cada pieza sale del pack del Core.
- **Vivienda:** `data/creation/housingOptions.ts` y el paso Gear del creador (`features/creator/steps/GearStep.tsx`).
- **Pregens:** el formato de `data/cemkFolioPremadesData.ts`, con el Neuroport como en las del Folio, y `NEUROPORT_INCLUDED` (`engine/creatorShop.ts` L9).
- **PNJ:** `data/enemiesCatalog.ts` y `data/enemies-src/SCHEMA.md`. NET: `NET_ARCHITECTURE_PRESETS` (`data/netAndRolesData.ts`).
- **Pestaña del GM:** `TABS` en `App.tsx`, con acceso según `canSeeGmOnly` (`store/gmAccess.ts`), como RED CHROME CARGO. Las tiradas usan el patrón de `engine/nightMarket.ts`, con funciones puras y un rng inyectable.
- **Mostrar a la mesa:** `reveals` (`sync/tableReveals.ts`), para el clima si hace falta.

## Versiones

### v5.15.0: cierre de FBC y ciberware de los Interface RED
1. **FBC:**
   - El HL de cada pieza del paquete cuenta para el tope de terapia: las piezas con HL suman como ciberware individual.
   - Volver a un cuerpo viejo (p.94): la Humanidad baja al máximo por Depresión de ese cuerpo y suma el HL del ciberware agregado desde entonces.
   - Nota del Enforcer 53/55 y del precio de Bazooka Joe en `docs/canon-audit`.
   - Tildar la CO2 Grenade y el Linear Frame Ω en el checklist.
2. **Ciberware:**
   - Must Have Cyberware Deals (12);
   - 12 Days of Cybermas (12);
   - Exotics of 2045: los 8 ciberware, y los 17 paquetes Bioexotic y FantaForm como ítems con su costo, HL y efecto.
3. **Tarjeta de Must Have en DATA PACKS:** se cambia por el contenido real.
4. **Tests:**
   - el tope de terapia con HL por pieza y la vuelta a un cuerpo viejo;
   - cantidades y páginas de cada artículo.

### v5.16.0: armas, cyberdecks y equipo de los Interface RED
- **Woodchipper's Garage:** 12 armas explosivas. El Sternmeyer M-02 vuelve y sale de la lista de borrados.
- **Midnight with the Upload:** 15 cyberdecks, y 11 de hardware y programas.
- **12 Days of Gearmas:** 13 ítems. El Zonda Metrocar entra en la v5.17.0.
- **All About Drones:** 6 drones.
- **Night City Weather:** 5 ítems.
- **Stickball:** su equipo.
- **Old Guns Never Die:** la conversión de CP2020 a RED como regla, con su ejemplo.
- **Tarjetas de DATA PACKS de Woodchipper y Midnight:** se cambian por el contenido real.
- **Tests:** cantidades, páginas, que el Sternmeyer M-02 ya no figure como borrado y ningún ítem inventado.

### v5.17.0: movilidad
- **Spinning Your Wheels:** Bicycle, Inline Skates y Skateboard, la tabla de mejoras de bici y la de trucos (DV13-17).
- **Cyberchairs:** Mercurius y Spider, con sus reglas.
- **Zonda Metrocar:** Gearmas.
- **The Dreaded Punknaught:** el vehículo jefe en el bestiario del GM, con sus piezas, cómo se arma y su ficha.
- **Compendium:** el modo VEHÍCULOS suma los vehículos de estos libros, con filtro por libro, y se pueden agregar al garaje.

### v5.18.0: vivienda
- **Cargo Containers & Cube Hotels:** juegos de muebles y accesorios del hogar, como equipo en la tienda.
- **Corporate Conapts & Studio Apts:**
  - los 10 Corporate Conapts y los 10 Studio Apartments, con su tirada 1d10, como opciones con nombre en la Vivienda del creador;
  - los muebles corporativos;
  - la tabla de vivienda al azar.

### v5.19.0: pestaña nueva del GM
Una pestaña solo para el GM, con el mismo control de acceso que RED CHROME CARGO. Trae:
- **Logros:** la lista para tildar por jugador.
- **Cajas de botín:** con su tabla 1d6 de contenido.
- **Clima de Night City:**
  - tirada por estación y Strange Weather;
  - efectos de la temperatura;
  - opción de mostrarlo a la mesa.
- **Digital Dating:** el Datepath, con sus tablas.
- **Collecting the Random:** las listas y la tabla d100.
- **Salvaging Night City:** el DV por categoría y sus tablas.
- **Stickball:** reglas en el Compendio de sistemas.

### v5.20.0: pregens, PNJ y aventuras
- **Single Shot Pack:**
  - 10 pregens jugables, una por rol, con el Neuroport de CEMK instalado;
  - 4 arquitecturas NET.
- **Jumpstart Kit Conversion Guide:** 11 PNJ al bestiario y 2 arquitecturas NET.
- **Halloween Screamsheets:** las 3 aventuras como referencia del GM, y sus PNJ al bestiario.
- **Hardened Mooks, Lieutenants y Mini Bosses:** revisar que coincidan con su versión en IR2 e IR3.
- **Cierre:**
  - `docs/canon-audit/README.md` deja de decir que IR1-3 están fuera de alcance; solo Elflines queda afuera;
  - IR1-4 y Going Metal pasan a ✅ en `docs/BIBLIOTECA.md`, salvo Elflines;
  - el plan 22 queda cerrado en `docs/plans/README.md`.

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npm test` y `npm run build`, con 0 errores. Si cambian las reglas de la nube, también `npm run test:rules`.
- Tests nuevos: cantidad por artículo, página en cada ítem, ningún id inventado y la regla del motor que cambie.
- En local:
  - **v5.15.0:** terapia de un FBC y vuelta a un cuerpo viejo.
  - **v5.16.0:** comprar un arma de Woodchipper y un cyberdeck de Midnight.
  - **v5.17.0:** agregar una bici al garaje y ver el Punknaught en el bestiario.
  - **v5.18.0:** elegir un Corporate Conapt en el creador.
  - **v5.19.0:** la pestaña del GM con y sin acceso de GM.
  - **v5.20.0:** elegir una pregen de Single Shot y ver su Neuroport.
  - Consola limpia.
- Contra el libro: una muestra de 5 ítems por versión, revisada a mano.
- Cada versión pasa por la beta y prod con su OK.

## Cierre
- El plan se guarda como `docs/plans/plan27-interface-red-fbc.md` (inmutable) y referencia al plan 22.
- En `docs/plans/README.md`, el plan 22 queda reemplazado por los planes 26 y 27.
