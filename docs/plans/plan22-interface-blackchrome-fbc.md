# Plan 22: terminar Interface RED 1-4, Black Chrome y FBC

[Claude Code · 2026-10-30]

> **Estado: en espera** [Claude Code · 2026-10-30]. Giuliano lo guardó como la próxima adaptación de manuales; mientras tanto se siguen haciendo cambios a la app. Los números de versión (v5.8.0 a v5.13.0) son tentativos: se asignan al arrancar cada parte, según la versión que haya en ese momento.

## Contexto
Giuliano quiere cerrar tres frentes que `docs/BIBLIOTECA.md` marca como a medias: los Interface RED, Black Chrome y FBC (Going Metal).

**Qué encontré**
- **Los Interface RED son recopilaciones de los DLC gratis**, más un artículo exclusivo en cada volumen:
  - **Vol. 1:** Old Guns Never Die, Red Chrome Cargo ✅, Single Shot Pack (10 pregens y arquitecturas NET), Cyberchairs, Elflines Online, Elflines Expansion Pack 1 y All About Drones (exclusivo).
  - **Vol. 2:** Hardened Mooks ✅, Hardened Lieutenants ✅, Night City Weather, Jumpstart Kit Conversion Guide, Cargo Containers & Cube Hotels, Daeric Sylar's Guide to ELO, 12 Days of Gunmas ✅ y Exotics of 2045.
  - **Vol. 3:** Hardened Mini Bosses ✅, Digital Dating, Woodchipper's Garage, Salvaging Night City, Midnight with the Upload, Must Have Cyberware Deals, Collecting the Random, Elflines TCG, Spinning Your Wheels, 12 Days of Cybermas y Going Metal ✅.
    - El PDF del Vol. 3 es una imagen sin texto: se lee desde los PDF de cada DLC, que sí tienen texto.
  - **Vol. 4:** Hornet's Pharmacy ✅, Black Chrome+, Achievements & Loot Boxes, Stickball, The Dreaded Punknaught, Corporate Conapts & Studio Apts, Halloween Screamsheets, 12 Days of Gearmas y Cyberfists ✅.
- **Black Chrome** trae unos 160 ítems:
  - 22 piezas de ciberware y 16 Cyberfingers;
  - 16 de moda y armadura;
  - 18 de equipo;
  - 4 Linear Frames;
  - 31 vehículos;
  - 52 armas;
  - 5 apps;
  - además, Economics 101 y los Night Markets.
- **Lo que hay hoy de Black Chrome en la app**: el pack `data/core-rules.cprpack.json` tiene 31 ítems marcados como Black Chrome. 20 están en el libro; los otros 10 no aparecen en ningún libro (Sternmeyer M-02, Borg Assault Rifle, Rasetsu, Hyper-Hammer, Tac-Vest, Trauma Team Medtech Armor, Stealth Suit, Sponsored Cyberarm, MaiMai y Grundy Salvage Suit).
- **Vehículos**: el catálogo `VEHICLES_CATALOG` (`data/netAndRolesData.ts` L647-820) tiene 14, y 13 son inventados; solo el Militech Gorgon está en Black Chrome. Los vehículos del Core son genéricos (Compact Groundcar, Roadbike, AV-4…; Core pp.162-165, Family Motorpool del Nomad).
- **FBC (Going Metal)**: está cargado desde la v4.5.0 (`data/goingMetalFbcData.ts`). La CO2 Grenade y el Linear Frame Ω External ya existen, aunque `CONTENT_CHECKLIST.md` L177-178 los da por pendientes.
  - Falta: el HL de cada pieza para el tope de terapia; que volver a un cuerpo viejo no limite la Humanidad; dos dudas del libro (Enforcer 53 en p.110 contra 55 en p.95, y los precios del ejemplo Bazooka Joe).
  - Los Linear Frames de Black Chrome (Fūma Kotarō, LF-001 SWAT, Vermilion y EL-F4-NT, pp.52-56) van en la parte de Black Chrome.

**Decisiones de Giuliano (2026-10-30)**
- Interface RED: se carga **todo** el contenido de los 4 volúmenes, también las reglas y los Elflines.
- Vehículos: **catálogo nuevo**, con su lista en el Compendium y "agregar al garaje".
- Lo inventado (sin libro): **se borra**. Si un personaje lo tiene, se le avisa.

## Cómo se trabaja
- Una rama por versión (`claude/vX.Y.Z-<tema>`) y un commit con CHECKPOINT en cada paso.
- Push, PR, merge, beta y prod: cada uno con su OK.
- Cada dato cita libro y página. Las páginas son las del volumen Interface RED cuando el artículo está ahí, y las del DLC cuando solo está en el DLC (Vol. 3).
- Lectura de PDFs: el texto ya está extraído en el scratchpad (`ir1.txt`, `ir2.txt`, `ir4.txt`, `bc.txt`, `bcplus.txt`, `gm.txt`). Los DLC del Vol. 3 se leen con PyMuPDF desde `DLC-Supplements/`. Las lecturas largas las hace `cpr-scout`, que devuelve JSON compacto.
- Al cerrar cada versión se actualizan `docs/BIBLIOTECA.md` (estado de cada PDF), `CONTENT_CHECKLIST.md` y `docs/canon-audit/` (un archivo por versión: qué se borró, qué entró y qué se corrigió).

## Reusar
- **Ítems**: el pack `data/core-rules.cprpack.json` (weapons, armor, cyberware, gear, ammunition, attachments, drugs, programs), con `source` / `sourceBook`.
- **Tienda del creador y detalle**: `engine/creatorShop.ts` y `features/creator/steps/ShopItemDetail.tsx`. Los ítems nuevos aparecen solos si están en el pack.
- **Reglas de expansión**: `EXPANSION_RULE_SYSTEMS` y `SOURCEBOOKS_CATALOG` en `data/expansionRulesData.ts` (tipo `ExpansionRuleSystem` con pasos, beneficios, riesgos y tabla).
- **PNJ**: `data/enemiesCatalog.ts` (`SourceBookId`) y el esquema `data/enemies-src/SCHEMA.md`.
- **Pregens**: el formato de `data/cemkFolioPremadesData.ts`.
- **Vehículos**: el tipo `OwnedVehicle` (`types/cyberpunk.ts` L524) y el garaje en `features/netroles/NetAndRolesDeckView.tsx` (L545, L2863).
- **FBC**: `data/goingMetalFbcData.ts` y su motor (`statFloor`, terapia "Borgware x2").
- **Vivienda**: `data/creation/housingOptions.ts` (v5.5.0 y v5.7.0).
- **Tarjetas de libros**: las de `features/datapacks/DataPackManagerView.tsx` (woodchipper, must-have, etc.) pasan a mostrar el contenido real.

## Versiones

### v5.8.0: Black Chrome I (ítems) + cierre de FBC
1. **Limpieza:**
   - Borrar los 10 ítems inventados del pack.
   - Si una ficha guardada tiene uno, al cargarla se muestra un aviso y el ítem queda como ítem propio (texto libre), sin borrarse de la ficha.
   - Verificar contra el libro los 20 que sí existen.
2. **Black Chrome:** cargar armas (pp.86-125), moda y armadura (pp.28-38), ciberware y Cyberfingers (pp.16-27), equipo (pp.40-51), los 4 Linear Frames (pp.52-56) y las 5 apps (pp.12-15) como equipo con su texto.
3. **Black Chrome+ (IR4 pp.10-23):** la munición, las armas, la armadura, los tragos y lo demás que vende Molly, más "Looking the Part" y "Looking at Linear".
4. **Nomad Access (BC p.10):** regla nueva, en `EXPANSION_RULE_SYSTEMS`.
5. **FBC:**
   - Corregir el checklist (la CO2 Grenade y el Linear Frame Ω External ya están).
   - HL de cada pieza del paquete como ciberware individual para el tope de terapia.
   - Volver a un cuerpo viejo no limita la Humanidad.
   - Resolver Enforcer 53/55 y Bazooka Joe leyendo pp.95 y 110; si el libro se contradice, se pregunta.
6. **Tests:** cada categoría nueva tiene cantidad y página; no queda ningún id inventado; el tope de terapia con HL por pieza da lo esperado.

### v5.9.0: catálogo de vehículos
1. Nueva categoría `vehicles` en el pack, con:
   - SDP, SP, asientos, velocidad de combate y narrativa;
   - costo y categoría de precio;
   - mejoras posibles;
   - libro y página.
2. **Vehículos que entran:**
   - los genéricos del Core, con sus mejoras (Core pp.162-165);
   - los 31 de Black Chrome (pp.58-85);
   - Spinning Your Wheels (bicis y patines);
   - Cyberchairs (IR1 pp.38-40);
   - el Zonda Metrocar (Gearmas, IR4 p.69);
   - The Dreaded Punknaught (IR4 pp.38-45: piezas, construcción y planilla).
3. **Inventados:** se borran los 13 de `VEHICLES_CATALOG`. Las fichas que los tengan en el garaje reciben aviso y conservan el vehículo como propio.
4. **Pantallas:**
   - Compendium: lista de vehículos con filtro por tipo y libro.
   - Garaje: "Agregar al garaje" sobre `OwnedVehicle`.
   - Tienda del creador: pestaña Vehículos.
5. **Black Chrome:** Economics 101 (Today at the Source y Lifestyles in Detail, pp.126-131) y los Night Markets (pp.132-…) como tablas de referencia para el GM.
6. **Tests:** los vehículos del Core coinciden con la tabla del Nomad; no queda ningún vehículo inventado; agregar uno al garaje copia SDP y SP.

### v5.10.0: equipo de los Interface RED
Al pack:
- 12 Days of Gearmas (IR4 pp.66-73) y 12 Days of Cybermas (DLC);
- Woodchipper's Garage (explosivos) y Midnight with the Upload (cyberdecks y hardware);
- Must Have Cyberware Deals;
- Exotics of 2045 (paquetes Bioexotics y FantaForms, IR2 pp.66-75);
- All About Drones (IR1 pp.58-65: drones de Zhirafa y personales);
- el equipo de Night City Weather (IR2 p.21) y de Stickball (IR4 p.35);
- Old Guns Never Die (IR1 pp.3-5): el método de conversión como regla y las armas de ejemplo.

Las tarjetas de DATA PACKS de esos libros muestran el contenido real.

### v5.11.0: vivienda y downtime
- **Cargo Containers & Cube Hotels (IR2 pp.34-39)** y **Corporate Conapts & Studio Apts (IR4 pp.46-55)**: viviendas con nombre, juegos de muebles y accesorios del hogar, y tabla de vivienda al azar. Entran como opciones en la Vivienda inicial del creador y como equipo de hogar en la tienda.
- **Salvaging Night City (DLC)**: reglas de rescate de chatarra en downtime, con tabla.
- **Achievements & Loot Boxes (IR4 pp.24-31)**: los logros como lista en la ficha, que se tilda a mano, y las cajas de botín como tabla.
- **Digital Dating (DLC)** y **Collecting the Random (DLC)**: tablas aleatorias que se tiran desde el Fixer Deck.

### v5.12.0: reglas, pregens y PNJ de los Interface RED
- **Night City Weather (IR2 pp.16-21)**: pronóstico y efectos del clima, con tirada en el Fixer Deck.
- **Stickball (IR4 pp.32-37)**: reglas del deporte.
- **Single Shot Pack (IR1 pp.10-37)**: 10 pregens (uno por rol) y sus arquitecturas NET.
- **Jumpstart Kit Conversion Guide (IR2 pp.22-33)**: PNJ y arquitecturas NET convertidos.
- **Halloween Screamsheets (IR4 pp.56-65)** y la aventura de Red Chrome Cargo: referencia para el GM; los PNJ y arquitecturas al bestiario y al NET.
- **Hardened**: revisar que Mooks, Lieutenants y Mini Bosses coincidan con su versión en IR2 e IR3.

### v5.13.0: Elflines Online
- **ELO Core y Expansion Pack 1 (IR1 pp.41-57)**: reglas para jugar un elfo dentro del MMO, 10 jugadores y 10 PJ del servidor de NC, y elfos pregenerados.
- **Daeric Sylar's Guide (IR2 pp.40-57)**: mapa, camino de niveles y monstruos.
- **Elflines TCG (DLC)**: reglas del juego de cartas, como referencia.
- Va en una sección propia "Elflines Online", aparte del juego principal. Los monstruos van al bestiario con su propia facción.

### Cierre de cada versión
Checklist `cpr-version-release`:
- CHANGELOG, cabeceras de HANDOFF y ROADMAP, README de planes;
- `APP_VERSION` y entrada in-app con `author: 'Claude Code'`;
- `docs/BIBLIOTECA.md` con los PDFs que pasan a ✅.

Al terminar la v5.13.0, los 4 Interface RED, Black Chrome (y Black Chrome+), Going Metal y los DLC que contienen pasan a ✅.

## Archivos críticos
- `frontend/src/data/core-rules.cprpack.json`: ítems y la categoría `vehicles` nueva.
- `frontend/src/data/netAndRolesData.ts`: `VEHICLES_CATALOG` sale de acá o pasa a leer el pack.
- `frontend/src/data/goingMetalFbcData.ts` y el motor de terapia (`engine/`).
- `frontend/src/data/expansionRulesData.ts`, `frontend/src/data/enemiesCatalog.ts` y `frontend/src/data/creation/housingOptions.ts`.
- `frontend/src/features/compendium/CompendiumView.tsx`, `features/netroles/NetAndRolesDeckView.tsx`, `features/creator/steps/GearStep.tsx` y `features/datapacks/DataPackManagerView.tsx`.
- `store/useCharacterStore.ts`: aviso al cargar fichas con ítems o vehículos borrados.
- Docs: `docs/BIBLIOTECA.md`, `CONTENT_CHECKLIST.md`, `docs/canon-audit/`.

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npm test` y `npm run build`, con 0 errores.
- Tests nuevos por versión: cantidades por libro, página en cada ítem, ningún id inventado, y la regla del motor que cambie (terapia FBC, garaje).
- En el navegador local, en tamaño iPad:
  - el Compendium filtra por el libro nuevo;
  - la tienda del creador muestra los ítems nuevos con su detalle;
  - el garaje agrega un vehículo de Black Chrome;
  - una ficha vieja con un ítem borrado muestra el aviso y no pierde el ítem;
  - consola limpia.
- Contra el libro: una muestra de 5 ítems por versión comparada a mano con la página.
