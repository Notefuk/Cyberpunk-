# Plan 21: creador más libre, tienda con detalle y ficha que explica

[Claude Code · 2026-10-29]

- **Al aprobarse:** se guarda como `docs/plans/plan21-creador-tienda-ficha.md`, firmado e inmutable, y se suma a `docs/plans/README.md`.
- **Cómo se trabaja:** según `docs/PRINCIPIOS.md`. Una rama por versión (`claude/v5.4.0-creador`, `claude/v5.5.0-tienda`, `claude/v5.6.0-ficha`), un commit con CHECKPOINT por paso, push solo con OK. Subagentes `cpr-scout` y `cpr-worker` con spec quirúrgica; reviso cada diff.

## Contexto
Salió de la prueba del Complete Package (v5.3.2). Al crear un personaje:
- falta libertad para salirse de las tablas;
- falta explicación de qué hace cada STAT y cada skill de arma;
- las habilidades de rol se reparten recién en la ficha;
- la tienda no deja ver la descripción de los ítems y mezcla todo el ciberware.

En la ficha, Martial Arts y Medtech necesitan estar mejor explicados.

## Reglas verificadas en los libros
- **Idiomas:** el origen da UN idioma a rango 4 gratis (Core p.45; p.90 "Language (Based on Cultural Origin) 4 0"), y puede ser uno fuera de la lista. Aparte, Language (Streetslang) es Basic con mínimo 2 (Core p.85).

  El texto de hoy, "4 gratis, además de...", se lee como 4 idiomas: hay que corregirlo.
- **STATs (Core p.72):** REF sirve para pegar con armas a distancia; DEX, para pegar cuerpo a cuerpo y esquivar.

  Con REF 8 o más se puede esquivar un tiro con DEX + Evasion + 1d10 en lugar del DV por distancia (Core p.172, nota al pie; p.83). También vale contra Autofire (p.173) y Shotgun (p.174), y el empate lo gana el defensor.
- **Skills de arma (Core pp.83-84, tabla p.171 y melee p.92):**

  | Skill | Armas que cubre |
  |---|---|
  | Handgun | pistolas y SMG |
  | Shoulder Arms | escopetas y rifles |
  | Heavy Weapons | lanzagranadas y lanzacohetes |
  | Archery | arcos y ballestas |
  | Melee Weapon | armas cuerpo a cuerpo Light, Medium, Heavy y Very Heavy |
  | Brawling | puños, con daño según BODY (p.176) |

  Autofire reemplaza la skill del arma cuando disparás en ráfaga (p.173).
- **Autofire (Core pp.173-174; skill x2, REF, p.83):**
  - **Qué armas lo tienen:** solo las que tienen modo Autofire. SMG y Heavy SMG con multiplicador máximo ×3, Assault Rifle con ×4 (p.171 y p.173).
  - **Cómo funciona:**
    - Gasta 1 Acción y 10 balas. Si el cargador tiene menos de 10, no se puede.
    - La tirada es REF + **Autofire** + 1d10, en lugar de REF + skill del arma, contra la tabla de DV de Autofire, que es distinta de la de tiro simple.
    - No se puede apuntar (Aimed Shot).
    - El daño es 2d6 × lo que pasaste el DV, hasta el máximo del arma. Con dos 6 hay herida crítica. Después resta la armadura.
    - Quien tenga REF 8 o más puede esquivarlo.
  - **Suppressive Fire (p.174):** también gasta 1 Acción y 10 balas. Todos los que están a pie, a 25 m o menos, fuera de cobertura y a la vista, tiran WILL + Concentration + 1d10 contra tu REF + **Autofire** + 1d10. El que pierde usa su próximo Move para cubrirse.
  - **Cómo se relaciona con las otras skills:** no reemplaza a Handgun ni a Shoulder Arms. Con un SMG, el tiro simple usa Handgun y la ráfaga y la supresión usan Autofire. Con un Assault Rifle, Shoulder Arms y Autofire. Subir Autofire no mejora los tiros simples, y subir Handgun no mejora las ráfagas.
  - **En el código:** el motor ya calcula la ráfaga (`engine/combatEngine.ts` L86-135, multiplicador por margen con tope). La descripción de la skill es una sola línea (`data/creation/coreGearSkills.ts` L503-509). Suppressive Fire figura solo en el cheat sheet (`features/rules/RulesCheatSheetDrawer.tsx` L481), no en el HUD. Al empezar se verifica que `calculateWeaponAttackBreakdown` use la skill Autofire y la tabla de Autofire.
- **Martial Arts (Core pp.178-180):**
  - Reglas comunes: ROF 2 e ignora la mitad del SP.
  - Recovery, el move compartido, en p.179.
  - Cada forma tiene 2 moves. Las formas son las del Core más las de Interface RED que ya están en la data.
- **Medicine (Core pp.149-150):** cada rango da puntos en tres especialidades:
  - **Surgery:** 2 puntos de skill por punto, máx. 10. Trata las peores Critical Injuries.
  - **Pharmaceuticals:** 1 por punto. Fabrica Antibiotic, Rapidetox, Speedheal, Stim y Surge.
  - **Cryosystem:** 1 por punto, máx. 5. Da Cryopump y Cryotank.

  Quick Fix y Treatment, y quién trata cada herida (First Aid, Paramedic, Surgery), están en Core p.223 y en las tablas pp.187-188. Las filas de esas tablas se confirman mirando la página renderizada.
- **Paquetes de rol:** p.98 (armas y armadura, más 500 €$) y p.103 (outfit). Complete Package compra todo suelto (p.104).
- **Disponibilidad:** sin Fixer solo se consigue hasta Premium (Core p.385). El CEMK p.26 deja comprar a un fabricante pagando el doble. Las categorías de precio están en Core p.385.
- **Vivienda:** Cargo Container con el primer mes gratis (p.105); tabla de alquiler y compra en p.378; lifestyle en p.377.
- **Rebuilds Power, Smart y Tech (CEMK pp.30-31):** cada uno cuesta 1000 €$ y ocupa 2 slots. Va uno solo por arma. Tech no se puede poner en lanzagranadas ni lanzacohetes, y Smart no se combina con Smartgun Link.

  **Hay un error a corregir:** `data/weaponAttachmentsAndTechData.ts` (L180-203) los tiene a 500 €$. Se verifica la página y se corrige.

## Decisiones de Giuliano (2026-10-29)
1. **Paquete en Complete Package:** al comprar se elige entre "paquete del rol + 500 €$ libres" (como Streetrat y Edgerunner, Core p.98) y "2550 €$ para comprar suelto". Se marca como variante de mesa.
2. **Disponibilidad:**
   - Cada ítem muestra su categoría de precio.
   - Lo Expensive o más caro avisa "sin Fixer no se consigue (Core p.385)".
   - Hay un interruptor "Sin Fixer: pagar el doble (CEMK p.26)" que duplica esos precios.
3. **Vivienda:** por defecto el Cargo Container. Se puede elegir otra de la tabla de p.378, que muestra el alquiler pero no se cobra al crear, o escribir una propia.
4. **Tres versiones:** v5.4.0 creador, v5.5.0 tienda y v5.6.0 ficha.

## v5.4.0: creador
1. **"Otro (escribir)" en las tablas del lifepath** (`features/creator/steps/LifepathStep.tsx`, `TableRow` L46-89):
   - Se suma la opción al `<select>`. Al elegirla aparece un input que guarda `{ roll: null, value: texto }`.
   - `buildCharacterLifepath` ya acepta cualquier texto (`engine/characterCreation.ts` L589-591).
   - Donde se usa `countFromPick` (L38), un texto propio da cantidad null, y las cantidades de amigos y enemigos se cargan a mano como hoy.
   - En las elecciones del rol (RoleStep) y en las opciones de paquete se suma lo mismo donde haya `<select>` de tabla.
   - Se ve con letra y área táctil cómodas en el iPad (mínimo 44 px).
2. **Explicación de los STATs** (`data/characterCreationData.ts` L185, `STAT_TOOLTIPS`):
   - Se completan `beginnerExplanation` y `mechanicalBreakpoints` de los 10 STATs, con cita. Ejemplos de breakpoint: "REF 8+: podés esquivar tiros (Core p.172)" y "BODY y WILL: HP" (p.79).
   - `StatsStep.tsx` (`StatLabel` L21-29) muestra un panel expandible por STAT con la explicación, los breakpoints y `dependentSkills`.
3. **Habilidad de rol arriba de todo en el paso de skills** (`SkillsStep.tsx`):
   - Un bloque nuevo, primero en la pantalla, que reusa `features/sheet/RoleAllocationPanel.tsx`: Medicine (Surgery, Pharmaceuticals y Cryosystem), Maker y Combat Awareness, con sus puntos de rango 4.
   - Se guarda en el draft con un campo nuevo, `roleAllocation`, del mismo tipo que usa la ficha (`types/cyberpunk.ts` L634 `medicineAllocation` y similares). `buildCharacterSheetFromDraft` lo copia a la ficha.
   - Cada especialidad trae una explicación corta de para qué sirve. Ejemplo para Surgery: "trata las Critical Injuries graves (las de Treatment 'Surgery' en Core pp.187-188) y para implantar cyberware".
   - Los roles sin reparto muestran su habilidad, con qué hace en rango 4 y la página.
4. **Idiomas** (`SkillsStep.tsx` L201-221):
   - El texto pasa a decir: "1 idioma de tu origen cultural a rango 4, gratis (Core p.45). Language (Streetslang) va aparte y arranca en 2 (Core p.85). Otros idiomas se compran con puntos."
   - Se suma un botón "+ otro idioma", que crea `Language (X)` con puntos normales. Hoy ya existe la skill con especialidad (L259-272); se reusa.
5. **Skills de arma con sus armas** (`data/creation/coreGearSkills.ts`, skills):
   - Se agrega el campo `weaponsEs` a las skills de combate con la lista del libro: "Handgun: todas las pistolas y SMG que lleves (Core p.171)".
   - En `SkillsStep.tsx`, las skills de combate quedan agrupadas en "Combate" con esa línea visible, sin tener que tocar ⓘ.
   - También va una nota fija: "En RED no hay proficiencia: cada nivel de la skill suma +1 a pegar con todas las armas de ese tipo; la tirada es REF/DEX + skill + 1d10."
   - **Autofire** tiene un cuadro propio dentro de "Combate", con el resumen de las reglas verificadas:
     - qué armas lo tienen y su máximo (×3 o ×4);
     - que cuesta 10 balas y 1 Acción;
     - que la tirada es REF + Autofire;
     - que el daño es 2d6 × margen;
     - que sirve para Suppressive Fire;
     - que es x2.

     Lleva un aviso: "no reemplaza a Handgun ni a Shoulder Arms: para tiros simples seguís usando esas".
   - Si compraste o tenés en el paquete un SMG o un Assault Rifle, el creador sugiere (sin obligar) poner puntos en Autofire.
   - Se reescribe `descEs` de Autofire con la regla completa y las páginas.
6. **Paquete inicial en Complete Package** (`engine/characterCreation.ts`):
   - Un campo nuevo en el draft, `cpUsePackage: boolean`.
   - Si es true, `getRolePackage` se aplica igual que en Streetrat y Edgerunner (L1228-1229) y `getStartingMoney` (L798-807) da 500 €$. Si es false, da 2550 €$ como hoy.
   - En ambos casos siguen los 800 €$ de moda.
   - `GearStep.tsx` L112 (`hasPackage`) se extiende, y el selector se marca "variante de mesa (Core p.98 / p.104)".
7. **Migración del draft:** los campos nuevos son opcionales y tienen valor por defecto en `createEmptyDraft` y en `creatorDraftStorage.ts`, así que los drafts viejos cargan igual.
8. **Tests:**
   - idioma a 4 gratis y uno extra pagado;
   - Complete Package con paquete da 500 €$ y el paquete en el inventario;
   - lifepath con texto propio llega a la ficha;
   - `roleAllocation` llega a la ficha.

## v5.5.0: tienda del creador
1. **Detalle de cada ítem:** tocar una fila de `GearStep.tsx` (L325-364) abre un panel con:
   - la descripción (`description`, o `notes` en armas);
   - los datos de cada categoría:
     - armas: daño, ROF, manos, skill, munición y slots;
     - ciberware: HL, ubicación, instalación y requisitos;
     - drogas: efectos, duración y DV de adicción;
     - programas: ATK, DEF y REZ;
   - la categoría de precio y el libro con su página.

   Comprar sigue siendo el botón, que no abre el detalle. En el iPad es un modal grande.
2. **Pestañas:**
   - **Ciberware:** sub-pestañas por el campo `type` del pack (Neuralware, Cyberoptics, Cyberaudio, Internal, External, Fashionware, Cyberlimb y opciones de brazo, Borgware).
   - **Equipo:** sub-filtro por tipo cuando el pack lo trae; si no, se agrupa por prefijo de id (`hw-`, `cyberdeck-`).
   - **Mejoras de armas:** pestaña nueva con `attachments` del pack y los rebuilds del punto 4.
   - **Drogas:** ya existe; se le suma el detalle.
3. **Disponibilidad** (`engine/creatorShop.ts`):
   - `priceTier(item)` usa `costTier` si está y, si no, calcula desde el costo con la tabla de Core p.385 (el ciberware no trae `costTier`). Se muestra como badge.
   - Un interruptor nuevo del draft, `noFixerDouble`: con él, lo Expensive o más caro cuesta el doble (CEMK p.26).
   - `getSummaryWarnings` agrega `expensive-no-fixer`, que avisa sin bloquear.
   - Tests con las categorías y el doble costo.
4. **Rebuild de armas al comprarlas:**
   - En el detalle de un arma a distancia elegible aparece "Convertir a Power / Smart / Tech" (+1000 €$ y 2 slots, CEMK pp.30-31). Solo en era 2077, o si la mesa usa el CEMK.
   - Reusa `WEAPON_ATTACHMENTS_CATALOG` (`att-power-rebuild`, `att-smart-rebuild`, `att-tech-rebuild`) y las reglas de elegibilidad.
   - La compra guarda `rebuild2077` y `buildCharacterSheetFromDraft` lo pasa al arma (`types/cyberpunk.ts` L405). La ficha ya sabe mostrarlo (`StreetLabView.tsx` L1830).
   - También se pueden sumar attachments al arma comprada, respetando los slots (`calculateWeaponSlotCapacity` L206).
   - Se corrige el costo de los rebuilds a 1000 €$ y 2 slots, con test.
5. **Vivienda** (`GearStep.tsx` L495-509):
   - Un selector con la tabla de Core p.378, más "Otra (escribir)". Por defecto, Cargo Container (o Corporate Conapt para un Exec).
   - El lifestyle se elige con la tabla de p.377.
   - Se guarda en el draft como `housing` y `lifestyle` y llega a la ficha en el campo de vivienda que exista; si no hay, en las notas. Lo confirma el scout al empezar.
   - Muestra el alquiler mensual sin descontarlo.

## v5.6.0: ficha
1. **STATs:** el tooltip de `StreetLabView.tsx` (L1150-1190) muestra la explicación completa y los breakpoints de v5.4.0, calculados con los valores del personaje. Ejemplo: "Tenés REF 8: podés esquivar tiros con DEX 6 + Evasion 4 = 10 + 1d10."
2. **Skills de arma ↔ armas:**
   - En la tabla de skills (L969-1050), las de combate muestran "Armas tuyas que usan esta skill: Militech Avenger (Heavy Pistol)…".
   - En cada arma de la ficha, una línea "Pegás con REF 7 + Handgun 6 = 13 + 1d10".
   - Una función pura nueva en `engine/`, `weaponSkillFor(weapon)`, mapea el tipo de arma a la skill según Core p.171, con test.
   - **Las armas con Autofire muestran dos líneas:**
     - "Tiro simple: REF + Handgun = X + 1d10 (tabla normal)".
     - "Ráfaga: REF + Autofire = Y + 1d10 (tabla de Autofire, 10 balas, daño 2d6 × margen, máx ×3)". Si Autofire está en 0, lo marca: "Autofire en 0: tu ráfaga pega solo con REF".
   - **Suppressive Fire:** una línea en el arma con la fórmula (REF + Autofire contra WILL + Concentration, Core p.174).
   - En la tabla de skills, Autofire dice qué armas tuyas lo pueden usar.
   - **Tests:** la fórmula de ráfaga usa Autofire y no Handgun; el tope es ×3 en SMG y ×4 en Assault Rifle; un arma sin modo Autofire no muestra la línea.
3. **Martial Arts:**
   - En la ficha (L3068-3366) y en NET & ROLES (L1967+), cada forma es una tarjeta con su encabezado: nombre, libro y página, rank y ataque.
   - Abajo van 2 cuadros, uno por move, con nombre resaltado, requisito, DV, efecto y herida que causa.
   - También un cuadro de reglas comunes (ROF 2, ½ SP, daño por BODY y Recovery). Se reusa `describeMoveEffects` (`engine/martialArtsRules.ts` L195).
4. **Medtech:**
   - En `RoleAllocationPanel.tsx` (L85-110) y en la pestaña ROL de la ficha, cada especialidad tiene su descripción.
   - **Surgery:** se lista qué heridas trata, sacadas de `data/criticalInjuries.ts`, donde Treatment dice Surgery, con su DV. Ejemplo: "Dismembered Arm: Surgery DV17".
   - **Pharmaceuticals:** las 5 drogas, con qué hace cada una.
   - **Cryosystem:** qué da en cada nivel.
   - Una nota explica la diferencia entre Quick Fix y Treatment, y quién puede hacer cada uno (Core p.223).
5. **Rol primero:** en la ficha, la pestaña de skills muestra arriba un resumen de la habilidad de rol y su reparto, con un link a la pestaña ROL.

## Verificación (en cada versión)
- **Desde `frontend/`:** `npx tsc -b --noEmit`, `npm test` y `npm run build` con 0 errores.
- **Navegador:** localhost con emulador, en tamaño iPad (768×1024) y en celular.
  - **v5.4.0:** crear un Complete Package con un lifepath de texto propio, un Medtech con el reparto de Surgery arriba, un idioma de origen más uno extra, y el paquete del rol con 500 €$. Después revisar la ficha resultante.
  - **v5.5.0:** abrir el detalle de un arma, un ciberware y una droga; filtrar ciberware por ubicación; prender "pagar el doble" y ver que cambian los precios Expensive; convertir una pistola a Smart (1000 €$ y 2 slots) y verla en la ficha; elegir un Studio y escribir una vivienda propia.
  - **v5.6.0:** el tooltip de REF con REF 8 dice que puede esquivar; el arma muestra su fórmula; las tarjetas de Martial Arts muestran los 2 moves; Surgery lista sus heridas.
- **Publicación:** primero la beta y después prod, cada una con su OK.
