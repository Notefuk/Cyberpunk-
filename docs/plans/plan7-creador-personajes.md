# Plan 7: Creador de personajes canon, persistente y con guía

[Claude Code · 2026-10-22]

Pausa el plan 6 después de v4.7.0. v4.7.1 (Danger Gal) y v4.7.2 siguen pendientes y se retoman al terminar este plan.

## Contexto
Giuliano quiere un creador de personajes (`CREAR PJ // WIZARD`) que:
- funcione bien;
- guarde el personaje y lo mantenga entre sesiones y entre updates de la app;
- incluya cada set de cosas del libro;
- guíe a quien no conoce el sistema.

La exploración encontró bugs, contenido inventado y huecos en el guardado.

**Bugs del wizard** (`features/creator/CharacterCreatorWizard.tsx`, 2303 líneas, estado todo en `useState`):
- **Deuda rota**: los ids del catálogo son `debt_*` y el wizard compara contra `'none'`. Hasta "Sin Deudas" da 4550 €$, y cambiar de tarjeta borra lo que se compró.
- **Sin validación**: los stats pueden no sumar 62, los puntos de skill pueden quedar negativos y se puede saltar cualquier paso.
- **El borrador no se guarda**: al cerrar o recargar se pierde todo.
- **El lifepath viene pre-rellenado** con textos inventados.
- **El paquete del rol** carga sin armas ni armadura, cuesta 50 €$ fijos y se duplica en cada clic.
- **La Humanidad** no descuenta el ciberware.
- **Los costos x2** se aplican mal: faltan Paramedic, Demolitions y Pilot Air Vehicle.
- **El catálogo de skills está incompleto.**

**Contenido inventado o sin fuente** (`data/characterCreationData.ts`, 3212 líneas):
- Neuroport: los 7 subsistemas **son canon**, porque forman el paquete estándar (CEMK RB pp. 35-36; Edgerunner's Handbook pp. 8-10). Lo inventado está en el detalle:
  - Cada pieza tiene su propio costo y su propia HL (100/500 €$ y 2/3/7 HL), pero el libro solo pone precio al Neuroport entero.
  - El "ahorro de más de 2,500 €$ y 20+ HL".
  - La palabra "Agent", que en CEMK es el Holophone.
  - Adornos que no están en el libro: "retícula", "subdérmico", "retiniana", "2 m".
- Las tablas de STATs por rol (`edgerunnerStatTable`, `streetratStats`) están inventadas: ninguna fila coincide con el Core (pp. 74-77). Por ejemplo, la fila 1 del Solo en el libro es 6 7 7 3 8 6 5 5 6 5 y en la app es 6 8 7 4 6 7 6 6 7 5.
- Los `startingLoadout` **existen en el libro**: Core pp. 98-99 (armas y armadura), 103 (outfit) y 117 (ciberware). Pero los de la app solo coinciden en parte:
  - La armadura (Light Armorjack SP 11) coincide en los 10 roles, y el arma del Exec también.
  - El resto de las armas difiere en casi todos. Por ejemplo, el Solo del libro lleva Assault Rifle, Very Heavy Pistol y Heavy Melee o Bulletproof Shield, y la app le da Heavy Pistol y Medium Melee.
  - Hay outfits inventados (todo el del Exec) y faltan las "o" del libro (elegir entre Shotgun o Assault Rifle, etc.). La munición se omite.
  - El ciberware de Tech, Medtech, Media y Lawman está inventado.
  - La moda está en texto libre, en lugar de los estilos con cantidad de piezas del libro.
  - Las skills de Streetrat solo coinciden en parte (pp. 86-87: básicas en 2, de rol en 6).
  - Plan: reemplazar todo por el paquete exacto del libro, con las opciones "o" para elegir en el wizard.
- 9 de las 10 tablas de lifepath por rol (`weaponAttachmentsAndTechData.ts:509`); solo la de Tech cita página.
- 6 pregens que no existen (Torch, Redtail, Bug, Doc, Militech Trooper, Tyger Claws Ronin).
- El "−4 de Humanidad por implante" de las pregens.
- "Selling Out" convertido en efectivo: en el libro son 1,500 €$ de ciberware más un Neural Link.

**Guardado** (`store/useCharacterStore.ts`, persist `cpr-omni-deck-characters-v2`, v2):
- No hay respaldo completo ni importación desde archivo.
- El JSON importado no se valida ni se migra.
- Si el guardado se corrompe, se vuelve al estado inicial y se sobreescribe.
- No se maneja el límite de espacio de localStorage.
- Los ids huérfanos de ciberware no se limpian.
- Los premades borrados vuelven a aparecer en cada carga.
- El `merge` corre siempre y no tiene versión.
- No hay service worker, así que un update no borra datos. Pero la app muestra "OFFLINE PWA READY" sin que eso exista.

## Decisiones de Giuliano
- **Neuroport en 2077**: viene incluido gratis. Coincide con el libro: "en la creación, cualquier personaje puede instalar el Neuroport gratis, con 0 HL y sin bajar la Humanidad máxima" (CEMK RB p.25).
  - El wizard lo deja tildado por defecto y explica que sin él no se puede tener ciberware no médico ni hackear.
  - Muestra el paquete canon de 7 piezas (RB pp. 35-36): Neural Link con 5 ranuras, Holophone, Biomonitor, Virtu, HUD (Chyron), 2 Shard Slots y Personal Link (Interface Plug).
  - Precio de referencia fuera de la creación: 1,000 €$ (Very Expensive), HL 7 (2d6), instalación en Hospital.
  - Se quitan los costos y la HL por pieza y "Agent".
  - Se agrega como opcional el **Cyberdeck Port**: 100 €$ (Premium), HL 3 (1d6), requiere Neuroport (RB p.36).
- **Guía**: un **Modo Novato** activable, prendido por defecto.
  - En cada paso explica qué se está eligiendo, en 1-2 líneas, con la página del libro.
  - Recomienda Streetrat.
  - Muestra una lista de "qué falta" y un resumen final antes de crear.
- **Edición**: el wizard solo crea, con borrador autoguardado. Las correcciones posteriores siguen en Street Lab.

## CEMK primero (decisiones CEMK vs Core)
CEMK es la base de la creación y, por ser el libro más nuevo, tiene prioridad. Ante cualquier discrepancia nueva se le pregunta a Giuliano antes de implementarla.

**Cada dato lleva su libro.**
- Todo rol, skill, habilidad, tabla, ítem y regla del creador tiene `source: { book: 'CEMK' | 'Core RED', page }` y se muestra con una etiqueta.
- Lo que está en los dos libros dice los dos, por ejemplo "CEMK RB p.2 · Core p.82".

**Roles**
- Primero los 7 de CEMK: Fixer, Medtech, Netrunner, Nomad, Rocker, Solo y Tech (HB p.2).
- Después Media, Exec y Lawman, con la etiqueta "Core RED" (lo permite RB p.25).
- El nombre que se muestra es "Rocker".

**Habilidades de rol**
- Por defecto, la versión completa del Core en rango 4 (pp. 143-162): Combat Awareness con sus 6 opciones, Maker, Medicine, Operator, Moto, Charismatic Impact, etc.
- Un selector por personaje permite cambiar a la versión simple de CEMK (+4; Folios pp. 1-28).
- La guía explica las dos, cómo funcionan y en qué se diferencian.
- El Netrunner usa Interface con las acciones y Quickhacks de CEMK (RB pp. 15, 27 y 38).

**Skills**
- Se muestran las 66. Las 46 de CEMK (RB pp. 2-3) llevan la etiqueta "CEMK"; las 20 que solo están en el Core llevan "Core RED" (Martial Arts, Demolitions, Archery, Pilot Air/Sea, Weaponstech, Basic Tech, Language, etc.).
- Se mantiene el costo x2 del Core para las 7 skills que lo tienen.

**Método**
- Primera opción: "Jugar ya con una pregen CEMK".
  - Son las 7 Folio (Hardpoint, Wrench, Connect, Bluescreen, Insurance, Thorn, Maven), cargadas tal cual el libro.
  - Las skills que les faltan quedan en 0, con un aviso de que la ficha es de CEMK y no sigue los límites del Core.
- Para crear desde cero: Streetrat, Edgerunner y Complete Package, con las reglas del Core (pp. 40-42).
- Las pregens de Easy Mode quedan como extra, con la etiqueta "Core RED".

**Lifepath**
- Se elige entre las tablas de CEMK (RB pp. 19-24, las rápidas con d6, que quedan por defecto) y las del Core completo (pp. 44-70, con idioma de origen en 4 y lifepath por rol).

**Dinero**
- Depende de cómo se crea:
  - Las pregens CEMK conservan lo que imprime su ficha (50-250 €$).
  - Los métodos del Core dan 500 €$ más el paquete del rol, o 2,550 + 800 €$ en Complete Package.

**Humanidad**
- Regla del Core: EMP×10 menos la HL fija de cada implante (Core p.111; CEMK RB pp. 34-37 para los de CEMK).
- Se aplica también a las pregens CEMK.
- El Neuroport no descuenta (RB p.25).

**Paquetes de rol en 2077**
- Se sacan el Agent (equipo), el Neural Link y los Interface Plugs (ciberware) del paquete del Core, porque los cubre el Neuroport (Holophone, Neural Link y Personal Link; RB pp. 35-36). Una nota lo explica.
- El resto del ciberware del rol queda igual.
- En 2045, el paquete del Core se usa intacto.

**Ciberware y armas**
- Cada pieza va con su libro y sus valores, sin mezclarlos. Por ejemplo, el Sandevistan de CEMK y el del Core son dos ítems distintos.
- Power, Smart y Tech, y los Rebuilds, llevan la etiqueta CEMK.

**Discrepancias de combate**
- Evasion contra disparos, Aimed Shot, el límite de Seriously Wounded, Mortally Wounded, la tabla de Críticos 1d6 o 2d6, Voice Stress Analyzer, el costo y HL del ciberware análogo, y si las armas del Core usan Power, Smart y Tech.
- **No entran en este plan.** Se registran en `docs/canon-audit/discrepancias-cemk-core.md`, con las páginas de los dos libros, y se le preguntan a Giuliano una por una en un plan de combate aparte.

## Reglas canon que manda el libro (Core v1.24; página impresa, PDF = impresa + 1)
- **Pasos**, en el orden del libro (pp. 41-42): Rol (Role Ability rango 4) → Lifepath → STATs → Derivados → Skills → Armas y armadura → Outfit → Ciberware. En Complete Package, los últimos cuatro se juntan en "Buy Your Stuff". La era y el método se eligen antes del paso 1.
- **Streetrat** (p.73): se tira 1d10 y se copia la fila entera de la tabla del rol (pp. 74-77). Skills fijas (pp. 86-87). Armas y armadura (p.98), outfit (p.103) y ciberware (p.117) fijos, con su HL ya calculada. Más 500 €$.
- **Edgerunner**:
  - STATs: 1d10 por STAT, cada uno leído de su columna de la tabla del rol (p.77).
  - Skills: 86 puntos sobre las 20 skills fijas del rol, entre 2 y 6 cada una; las x2 cuestan doble (pp. 88-89).
  - Equipo: el mismo que Streetrat.
- **Complete Package**:
  - STATs: 62 puntos, entre 2 y 8 cada uno (p.78).
  - Skills: 86 puntos en cualquier skill, máximo 6, las 13 básicas en 2 o más (p.90).
  - Dinero: 2,550 €$ para equipo y ciberware (lo que sobra se guarda), más 800 €$ de moda que se pierden si no se usan (pp. 104-105).
- **Valores derivados** (pp. 79-80):
  - HP = 10 + 5×⌈(BODY+WILL)/2⌉. Seriously Wounded = HP/2 redondeado hacia arriba. Death Save = BODY.
  - Humanidad = EMP×10. El EMP baja cada vez que la Humanidad cruza una decena.
- **Skills** (pp. 81-85):
  - Lista completa de 9 categorías.
  - Cuestan x2: Pilot Air Vehicle, Autofire, Martial Arts, Heavy Weapons, Demolitions, Electronics/Security Tech y Paramedic.
  - 13 básicas en 2 como mínimo, más un idioma de origen cultural en 4 gratis.
- **Lifepath**: 11 tablas generales más Life Goals (pp. 45-53) y la tabla de cada rol (pp. 54-70).
- **Ciberware al crear**: se usa la HL fija de la tabla (p.111). La cirugía está incluida (p.110). La Humanidad perdida en Streetrat y Edgerunner viene por rol (p.117).
- **"Running out of cash"** (pp. 118-119), opcional: 1,500 €$ de ciberware más un Neural Link gratis, con su contrapartida.
- **Vivienda y estilo de vida** (p.105): Cargo Container con comida Kibble; el primer mes es gratis y después se pagan 1,100 €$. El Exec arranca en un Corporate Conapt con Good Prepak por 600 €$.
- **Pregens canon**: las 7 Folio de CEMK más las de Easy Mode (Rockerboy, Solo, Tech, Medtech y Media).

## Versiones
**v4.8.0: Guardado robusto** (va primero, porque protege todo lo demás):
1. Persist v3 con una cadena de migraciones versionada (`migrations[n]`):
   - Limpia ids huérfanos de ciberware, artes marciales y vehículos, y los anota en `character.notes`.
   - Normaliza los campos que faltan.
   - Saca de `merge` los parches legacy y los pasa a migraciones.
2. Seguridad:
   - **Copia previa a cada migración** (`cpr-omni-deck-backup-v<old>`).
   - `try/catch` al hidratar: si el JSON está corrupto, se guarda una copia y se avisa, nunca se sobreescribe en silencio.
   - Manejo del límite de espacio (aviso al usuario).
3. **Respaldo completo**: exportar e importar un archivo `.json` con todos los personajes y los datos del GM (PNJ custom, encuentro, notas, NetArch custom). La importación pasa por las mismas migraciones y una validación de esquema. Import por **archivo**, no solo por texto pegado.
4. Premades:
   - Los que se borran no vuelven (`dismissedPremadeIds`).
   - Botón "Restaurar premades".
5. Tests de migración: fixtures de v1, v2 y una ficha corrupta.
6. Se quita el texto "OFFLINE PWA READY", que es falso. El modo offline real queda fuera de alcance.
7. Se corrige el favicon con ruta absoluta (`index.html:5`).

**v4.8.1: Datos canon de creación** (extracción de PDF por scouts, con página por dato):
- Tablas Streetrat por rol: STATs (pp. 74-77) y skills (pp. 86-89). Se reemplazan las inventadas.
- Paquetes de rol exactos del libro, con las opciones "o" y la munición: armas y armadura (pp. 98-99), outfit con estilos y piezas (p.103) y ciberware con HL (p.117).
- La extracción de esas páginas se verifica de forma visual, porque las tablas salen por columnas y la asignación a cada rol es dudosa en Medtech/Tech y Fixer/Nomad.
- Catálogo completo de skills (pp. 82-85), con STAT vinculado y marca de x2.
- Lifepath general (pp. 45-53) y por rol (pp. 54-70), con tiradas reales.
- Moda: los 10 estilos y sus precios (pp. 102-103).
- Vivienda y estilo de vida (p.105).
- "Running out of cash" (pp. 118-119).
- Roles: los 7 de CEMK más los 3 del Core, cada uno con las dos versiones de su habilidad (Core completa y CEMK +4), con texto y página.
- Lifepath CEMK (RB pp. 19-24), además del Core.
- Pregens: las 7 Folio de CEMK tal cual el libro, más las de Easy Mode (Core).
- Etiqueta `source` (libro y página) en cada dato.
- `docs/canon-audit/discrepancias-cemk-core.md`: las 20 discrepancias detectadas, con la decisión tomada o pendiente.
- Neuroport en 2077: el paquete canon de 7 piezas con sus textos del libro, gratis en la creación (RB p.25) y el Cyberdeck Port como opcional (RB p.36). Se corrigen los costos y HL por pieza.
- Se borra lo inventado, que queda registrado en `docs/canon-audit/v4.8.1-creador.md` (qué se perdió, qué se ganó, qué se corrigió).
- Los datos fuente van en `data/creation-src/*.json`, con un generador como el de enemigos.

**v4.8.2: Wizard funcional**:
- Pasos en el orden del libro: Era y método (con "Jugar ya con pregen CEMK" como primera opción) → Rol → Lifepath (CEMK o Core) → STATs → Derivados → Skills → Equipo (por método) → Resumen.
- Selector de versión de la habilidad de rol (Core completa o CEMK +4), que se guarda en la ficha (`roleAbilityVariant`).
- Un **motor puro** `engine/characterCreation.ts` hace los cálculos, las validaciones por paso y el armado de la ficha, con tests. Se reutilizan el cálculo de HP y `parseHumanityLoss`.
- La deuda se reemplaza por el "Running out of cash" canon.
- Dinero según el método (500 €$ o 2,550 + 800 €$) con su contabilidad. El paquete del rol se aplica una sola vez, completo.
- La Humanidad descuenta el ciberware. El lifepath arranca vacío, con tiradas que muestran el número.
- **Borrador autoguardado** (`cpr_creator_draft_v1`): se retoma al volver, con un botón para descartarlo.

**v4.8.3: Modo Novato y guía**:
- Interruptor, prendido por defecto (`cpr_creator_novice_v1`).
- En cada paso: una línea de "qué es esto", otra de "qué te conviene" y la página del libro.
- Checklist de lo que falta, que bloquea "Crear" con mensajes claros.
- Resumen final antes de crear (stats, HP, Humanidad, skills, equipo, dinero y vivienda).
- Tooltips de skills completos, sin cortes.

El catálogo de vehículos y Black Chrome (antes v4.8.0 del plan 5) pasan a v4.9.x.

## Método
- Igual que en los planes 5 y 6:
  - Un **scout** extrae del PDF a JSON con página.
  - Un **worker** aplica cada cambio con una spec quirúrgica, siguiendo el contrato de AGENTS.md.
  - Yo audito con `git diff`, tsc, tests, build y el navegador.
- Las tablas largas se verifican de forma visual con el renderer pdf.js (`scratchpad/pages/view.html` + `python -m http.server`).
- Cada versión tiene su rama `claude/v4.8.x-*`, CHECKPOINT por fase, changelog firmado, registro canon, PR y gh-pages.

## Archivos críticos
- `frontend/src/store/useCharacterStore.ts`: persist, migraciones, import y export.
- `frontend/src/types/cyberpunk.ts`: `CharacterSheet`.
- `frontend/src/features/creator/CharacterCreatorWizard.tsx`: se parte en un componente por paso dentro de `features/creator/steps/`.
- `frontend/src/data/characterCreationData.ts` y `weaponAttachmentsAndTechData.ts`: lifepath por rol. Se migran a datos generados en `frontend/src/data/creation/`.
- `frontend/src/engine/characterCreation.ts` (nuevo).
- `frontend/src/features/sheet/StreetLabView.tsx`: respaldo y restauración, importar por archivo y premades.

## Verificación
- **Tests**:
  - Migraciones v1 y v2 a v3, sin pérdida de datos.
  - Limpieza de huérfanos.
  - JSON corrupto: se guarda la copia y no se sobreescribe.
  - Ida y vuelta del respaldo.
  - Por método:
    - Streetrat: copia la fila y el paquete exactos.
    - Edgerunner: 86 puntos sobre las 20 skills, entre 2 y 6.
    - Complete Package: 62 puntos de STAT y 2,550 + 800 €$.
  - HP, Seriously Wounded, Death Save y Humanidad con el ciberware.
  - Costos x2.
  - Checklist de validación.
- **Navegador**, de punta a punta:
  - Crear un personaje con cada método y en las dos eras.
  - Recargar a mitad del wizard y comprobar que el borrador sigue.
  - Exportar el respaldo, borrar localStorage, importarlo y comprobar que todo vuelve.
  - Borrar un premade y comprobar que no reaparece.
- `npx tsc -b --noEmit`, `npm test` y `npm run build`.
- Después de publicar, verificar en vivo.

## Fuera de alcance
- Modo offline o PWA real.
- Editar en el wizard un personaje ya creado.
- Las discrepancias de combate entre CEMK y el Core: van a un plan de combate aparte, decididas una por una con Giuliano.
- Danger Gal (v4.7.1), vehículos y Black Chrome.
