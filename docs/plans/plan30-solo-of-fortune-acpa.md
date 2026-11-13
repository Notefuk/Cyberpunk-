# Plan 30: Solo of Fortune 2045 (Interface RED Vol. 5): ACPA y arsenal pesado

[Claude Code · 2026-11-12]

## Contexto
La checklist tenía dos expansiones pendientes: Going Metal y Solo of Fortune.

- **Going Metal ya está completo.** Tiene 13 cuerpos, 16 ciberware, 39 piezas de equipo, terapia y tests (`data/goingMetalFbcData.ts`, `engine/fbcTherapy.ts`). Le falta solo un test de conteos.
- **Solo of Fortune no tiene nada en el código.**

La fuente es el artículo "Solo of Fortune 2045" del **Interface RED Vol. 5**, pp.105-147:
- Archivo: `Sourcebooks\Interface-RED\ilide.info-interface-5-pr_…pdf`.
- **Página impresa = PDF − 1.**
- El texto se puede extraer. Hay un volcado en el scratchpad (`out.txt`).

Este plan se numera 30 porque el 29 (Owlbear) lo tiene otra sesión.

**Decisiones de Giuliano (2026-11-12)**
1. **Alcance:** solo Solo of Fortune. El resto del Vol. 5 se anota como pendiente para un plan futuro.
2. **ACPA:** la pueden pilotear los PJ (desde su ficha) y los enemigos o actores del GM.

## Reglas clave del libro (IR5)
- **Entrar y salir:** 1 Acción cada una, con Interface Plugs. Si está destruida, salir no gasta Acción (p.133).
- **SP y HP:** la ACPA tiene **un solo SP y un solo HP**, sin cabeza ni extremidades, y es inmune a Aimed Shot (pp.133-134).
- **Daño:**
  - Lo que dañaría al piloto le baja HP a la ACPA y ablaciona su SP. La armadura del piloto no pierde SP.
  - No le afecta el Wound Threshold.
  - A 0 HP queda Destruida y no protege.
  - Una Herida Crítica no se aplica: en su lugar, el piloto recibe 5 de daño directo (0 si es FBC) (p.133).
- **Stats:** se usan REF, DEX y MOVE del piloto con los bonos y penalizadores de la ACPA, que se suman a los de su armadura. El BODY sale del frame (p.134).
- **Inmunidades:** EMP, fuego, electricidad, gases, flash, ruido y entorno. No se la puede agarrar con BODY 14 o menos (pp.133-134).
- **Armas:** las de 2 manos se usan con 1. Las Onboard no ocupan manos y no se pueden desarmar. Trae un sensor de 100 m (p.134).
- **Fatiga:** más de 4 h, −1; más de 8 h, −2. Hay excepciones (p.134).
- **Esquivar balas:** solo con MOVE +3 o con las condiciones de la p.134.
- **Reparar:** Weaponstech, sin Jury Rig. Leve DV9 en 4 h; menos de 1/2 HP, DV13 en 1 día; destruida, DV17 en 1 semana (p.135).
- **Armador** (pp.135-137):
  - Frame: Salvaged, Sigma, Beta u Omega (p.136).
  - Shell: 5, con SP 14-19 (p.136).
  - 4 tunings, A o B en cada uno (p.136).
  - Hasta 6 armas Onboard y 6 ciberware Onboard.
  - Costo: 4.000 + frame + shell + cada Onboard + 500 por Onboard. Ejemplo del libro: 9.800 (p.137).
  - Fabricación: p.135.
- **Catálogo:**
  - 10 ACPA (pp.138-142).
  - 13 armas (pp.116-119, 122-123).
  - 8 attachments (pp.111-115).
  - Tablas de rango (p.113), con las nuevas Machine Pistol y Machine Gun para Autofire.
  - 12 municiones o explosivos (pp.120-122, 126-127).
  - 3 Metalgear (p.123).
  - Equipo y 8 drogas de combate (pp.122-129).
  - Reimpresiones (p.143).

## Cómo se trabaja
- Una rama por versión, con commit y CHECKPOINT en cada paso.
- Push, PR, merge, beta y prod piden un OK cada uno. Si se cambian las reglas de Firestore, también.
- Cada dato cita IR5 y la página impresa.
- La extracción sigue la skill `cpr-pdf-extractor`. Cada fila se revisa contra el PDF, porque hay encabezados rotos en la p.113.

## Versiones

### v5.25.0: arsenal de Solo of Fortune (catálogo)
- **Pack:** `data/core-rules.cprpack.json`, también en la copia de `data/` de la raíz si existe. `sourceBook: 'IR5'`, título "Interface RED Vol. 5" y `sourcePage` impresa. Va todo esto:
  - 13 armas, con su `dvTable` en el formato actual (`DV 13 (0-6m) | …`; las celdas N/A quedan fuera de rango);
  - 8 attachments;
  - 12 municiones o explosivos;
  - 3 Metalgear;
  - el equipo (Authorization Handshake Port, Thermal Decoy, Multihypo, etc.);
  - las 8 drogas de combate.
- **Autofire:**
  - Se suman las clases Machine Pistol y Machine Gun a `AUTOFIRE_DV` y `autofireMax` en `engine/actorAttack.ts`, con su fila de DV (p.113).
  - `ammo`/`autofireMaxMult` pasan a leer "Autofire (Machine Gun 5)".
- **Tests:** conteos por sección con `sourceBook` IR5 (como `interfaceRedCatalog.test.ts`). También el test de conteo de Going Metal (13 cuerpos, 16 ciberware).
- **Metalgear (SP 16-19, un solo SP):** en esta versión entra como armadura de cuerpo y cabeza con el mismo SP y su penalización (p.123). Si el libro pide otra cosa, se ajusta.

### v5.26.0: ACPA, datos, motor y armador
- **Datos:** `data/acpaData.ts`:
  - `ACPA_FRAMES`, `ACPA_SHELLS`, `ACPA_TUNINGS` (A/B);
  - las 10 ACPA canon con su frame, shell, tunings, HP, SP, modificadores de REF, DEX y MOVE, BODY, Onboard y costo;
  - cada una con su página.
- **Motor:** `engine/acpa.ts`, funciones puras:
  - `buildAcpa(frame, shell, tunings, onboard)`: calcula HP, SP, mods, costo, disponibilidad y valida los topes;
  - `acpaTakeDamage(state, dmg)`: SP, ablación y HP; a 0, destruida;
  - `acpaCriticalFeedback(isFbc)`: 5 o 0;
  - `pilotStatsInAcpa(sheet, acpa)`;
  - `acpaFatiguePenalty(hours, exceptions)`;
  - `repairDv(state)`.
- **Tests:** el ejemplo de la p.137 (9.800 eb), las 10 ACPA canon recalculadas con el armador para que den lo impreso, el daño, la ablación y el estado destruida, y la crítica por feedback.
- **UI:** "Armador de ACPA" en el Compendio, junto a las fichas de las 10 ACPA.

### v5.27.0: el PJ pilotea una ACPA
- **Ficha:** `CharacterSheet.acpaState?: ActiveAcpaState`, modelado sobre `ActiveFbcState`. Guarda id, nombre, HP y SP actuales y máximos, mods, onboard y destruida.
- **Acciones:** "Entrar" y "Salir" (1 Acción) en Street Lab y en el HUD de combate.
- **Daño con la ACPA puesta:**
  - El daño que recibe el PJ lo absorbe la ACPA (SP con ablación, después HP). La armadura y el HP del piloto quedan intactos.
  - Las críticas se convierten en 5 de daño directo al piloto.
  - Se enchufa donde hoy se aplica el daño al PJ: el daño propio y `features/gm/gmDamage.ts` (`applyHitToPc`).
- **Stats:**
  - REF, DEX y MOVE efectivos con los mods (`characterEngine`).
  - BODY del frame, si es mayor.
  - Sin Aimed Shot contra la ACPA.
  - Las armas Onboard aparecen en el arsenal mientras está puesta.
- **Mesa:** la tarjeta de party y el Modo GM muestran "En ACPA" con su HP y SP.
- **Reparar:** botón con el DV que corresponde.
- **Tests:** daño con y sin ACPA, salir con la ACPA destruida, stats efectivos.

### v5.28.0: enemigos y actores en ACPA (Modo GM)
- **Bestiario:** "Spawnear en ACPA" elige una de las 10. El actor (`GmActor`) guarda su `acpaState`.
- **Daño a un actor en ACPA:** pasa por `acpaTakeDamage`.
- **Ataque del actor:** puede usar las armas Onboard (`ActorAttackForm`).
- **Tests y persistencia:** el estado de la ACPA vuelve igual al sacar y traer el actor. Los actores ya validan forma y tamaño en las reglas; si suman campos, se ajustan las reglas con sus tests.

## Pendiente anotado para otro plan
El resto del Interface RED Vol. 5 se anota como pendiente en `CONTENT_CHECKLIST.md` y en `docs/plans/README.md`, con sus páginas:
- Breaking Your Stuff (3-12)
- roller derby (13-22)
- Agents (23-34)
- Toggle's Temple, la armería con generador de armas (35-60)
- investigación (61-70)
- cyberpets (71-82)
- Screamsheet Generator (83-96)
- 12 Days of REDmas (97-104)
- el resto de Solo of Fortune: nivel mercenario (107-108), misiones (144-147) y Hiring Hall (132)

## Archivos principales
- **Nuevos:**
  - `data/acpaData.ts`, `engine/acpa.ts`;
  - `features/compendium/AcpaBuilder.tsx` (o donde estén las vistas del Compendio);
  - tests `acpa.test.ts` e `ir5Catalog.test.ts`.
- **Cambian:**
  - `data/core-rules.cprpack.json`;
  - `engine/actorAttack.ts`;
  - `types/cyberpunk.ts` (`ActiveAcpaState`, `CharacterSheet.acpaState`);
  - `engine/characterEngine.ts`;
  - `store/useCharacterStore.ts`;
  - `features/gm/gmDamage.ts`;
  - `sync/partySummary.ts`;
  - `features/gmmode/*`, `data/gmActors.ts`;
  - `CONTENT_CHECKLIST.md`.
- **Se reusan:**
  - el patrón de `ActiveFbcState` y `GoingMetalBanner` (entrar y salir de un cuerpo);
  - `applyHitToPc` y `previewPcImpact`;
  - `rollAutofire`;
  - la skill `cpr-pdf-extractor`.

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npx vitest run` y `npm run build`, con 0 errores. Si cambian las reglas de Firestore, también `npm run test:rules`.
- En el navegador (local):
  - **v5.25.0:** las armas nuevas aparecen en el compendio y se pueden equipar; Autofire de un Machine Gun.
  - **v5.26.0:** el armador reproduce el ejemplo de la p.137 y las 10 ACPA.
  - **v5.27.0:** entrar con un PJ, recibir daño (baja la ACPA, no el PJ), una crítica (5 al piloto), quedar destruida, salir y reparar.
  - **v5.28.0:** spawnear un enemigo en ACPA y atacar o recibir daño.
- Consola limpia en cada caso.
- Cada versión pasa por la beta y prod con su OK.

## Cierre
- El plan aprobado se guarda como `docs/plans/plan30-solo-of-fortune-acpa.md` (inmutable).
- El avance va en `CHECKPOINT.md` y el estado en `docs/plans/README.md`.
