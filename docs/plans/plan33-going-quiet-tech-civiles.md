# Plan 33: Going Quiet, Invented Tech Upgrades, Cyberware Enhancements y Everyday People

[Claude Code · 2026-11-14]

## Contexto
Giuliano eligió, de los libros sin adaptar, 4 DLC de reglas y PNJ. El equipo y los vehículos (Cutiemas, Vehiclemas, VA-11 Hall-A) quedan para el plan siguiente.

Los cuatro DLC están en `Documents/CP RED TEST ANTIGRAVITY/DLC-Supplements/`. La página impresa coincide con el índice del PDF.

| DLC | Páginas | Qué trae |
|---|---|---|
| *Going Quiet* (2025) | 7 | Flash of Luck (regla opcional), Stealth Netrunning y 14 ítems de espionaje |
| *Invented Tech Upgrades Guide* (2026) | 9 | Precio de las mejoras inventadas de los Tech: dos costos, mano de obra, termómetro de precios y 18 mejoras de ejemplo de 6 Techs |
| *CEMK DLC 02: Cyberware Enhancements* (2024) | 3 | 9 mejoras de catálogo para Gorilla Arms, Mantis Blades y Monowire |
| *Everyday People* (2026) | 12 | 20 PNJ civiles con sus variantes, y una guía para crear civiles |

### Decisiones de Giuliano (2026-11-14)
- **Everyday People:** las fichas van tal cual el libro, abreviadas y sin inventar STATs. Las variantes van como texto en cada ficha.
- **Invented Tech Upgrades:** catálogo y precio. El efecto queda en texto, sin mecanizar.
- **Cyberware Enhancements:** solo para PJ de 2077, con los efectos de combate automáticos.
- **Flash of Luck:** apagada por defecto. El GM la prende.

### Lo que ya hay y se reusa
- **Luck:**
  - `currentLuck` y `spendLuck`/`restoreLuck` en `store/useCharacterStore.ts` (~L873-910).
  - La bandeja de Luck del HUD está en `features/combat/CombatHudView.tsx` (~L4190-4250).
- **Reloj de la campaña:** `clock {session, day, beat}` en `campaigns/{id}` (plan 19), validado por `tableFieldsOk` en `frontend/firestore.rules` (~L187).
- **NET:**
  - `features/netroles/NetAndRolesDeckView.tsx`: `handleRollNetAction` L242, estado de pisos L162.
  - `BLACK_ICE_STATS` con PER, en `data/netAndRolesData.ts` L169.
- **Maker:**
  - `engine/makerRules.ts` (`makerDvAndTime`, `materialCost`).
  - `features/roles/MakerPanel.tsx`.
  - `TECH_MAKER_UPGRADE_OPTIONS` en `data/weaponAttachmentsAndTechData.ts` L364.
- **Ciberware y combate:**
  - Ids del pack: `cw-cemk-gorilla-arms`, `cw-cemk-mantis-blades` y `cw-cemk-monowire`, con sus armas `gorilla-arms-2077` y `mantis-blades-2077`. El Monowire no tiene arma.
  - `engine/combatEngine.ts`: `createDamageRoll` L215 (crítico +5), `calculateIncomingImpact` L312 y `planImpactEffects` L369.
  - `engine/weaponAttackLines.ts`.
  - `features/combat/CritTableSelector.tsx`.
- **Bestiario:**
  - `scripts/gen_enemies.py` (`BOOK_SPECS` L75) y `data/enemies-src/`.
  - `data/npcCreationGuidelines.ts`, con las plantillas del creador guiado.

## Versiones (una rama por versión, CHECKPOINT y commit en cada paso)

### v5.41.0: Going Quiet
- **Qué es, en 3 partes:**
  1. **Flash of Luck (p.3):**
     - Gastás 2, 4 u 8 de Luck para "haber hecho antes" algo que ayuda ahora. El tope de gasto en eb es 100, 500 o 1,000, según el tipo.
     - Va 1 vez por Beat y hasta 3 por misión. Durante el combate es una Standard Action. El GM puede vetarla.
     - Si no se puede comprar lo que hace falta, se devuelve la Luck.
  2. **Stealth Netrunning (pp.4-5):**
     - Jack In en silencio: cuesta una NET Action extra y es Interface + 1d10 contra cada Watcher.
     - En sigilo, el Black ICE se esquiva con Interface + bonus de Cloak + 1d10 contra su PER + 1d10.
     - Los Watchers buscan con Pathfinder. Tomar un Control Node o atacar rompe el sigilo.
  3. **Los 14 ítems de Harry the Shrimp (pp.5-7):** Binary Compound, Branded Jumpsuit (4 precios), Concealment Sleeve, Handprint Glove, Handprint Scanner (app), Laser Microphone, Militech M97 Ghostsuit, Nymph Perfume, Parabolic Microphone, Professional Disguise Kit, Retina Lens, Retina Scanner (app), Translation Chip (chipware, HL 7) y Zetatech Tank Commander Headset.
- **Dónde se ve:**
  - Flash of Luck: un botón en la bandeja de Luck del HUD, visible solo si está prendida.
  - El GM la prende en la campaña. Sin campaña, se prende en el modo local.
  - El sigilo: en el corredor de NET (NET & ROLES).
  - Los ítems: en el Compendio y la tienda.
- **Cómo afecta:**
  - Nuevo campo de la campaña `flashOfLuck: boolean`. Se valida en `tableFieldsOk` de `firestore.rules`, así que lleva su test de reglas y **un deploy de reglas, con su OK**.
  - La ficha guarda la cuenta de Flash of Luck: en qué Beat se usó (del reloj de la campaña) y cuántas veces en la misión. El jugador o el GM la reinician con "Nueva misión".
  - La Luck se cobra con `spendLuck` y queda en el log de tiradas.
  - Los 14 ítems entran al pack con su página (ids `gq-*`).
- **Qué se interpretó:**
  - El veto del GM y la compra del ítem quedan a la mesa: el botón cobra la Luck y anota lo que el jugador describe.
  - Los programas Eraser y See Ya no existen en la app, así que el bonus de Cloak o Pathfinder se carga a mano.
  - Los Watchers (Demons y netrunners enemigos) se cargan a mano con su Interface. La app no tiene IA de Demons.

### v5.42.0: Invented Tech Upgrades
- **Qué es:**
  - El precio de una mejora inventada (p.3):
    - Costo 1 = lo que vale el ítem.
    - Costo 2 = lo que puso el GM al inventarla.
    - Si la instala un Tech PNJ, se suma un 50% de mano de obra. También se puede comprar el kit y que la instale el Tech del grupo.
  - El termómetro de precios (p.4): Mild 100, Medium 500, Hot 1,000, Extra Hot 5,000 y Diablo 5,000+, con sus ejemplos.
  - Las 18 mejoras de ejemplo (pp.5-9), de Android Ace, Jack Sawyer, Lotos, Never Naughty Nedd, Troy Gordon y Tweak. Cada una con su DV, sus dos costos, su requisito y su efecto.
- **Dónde se ve:**
  - En el panel del Maker (rol Tech) y en NET & ROLES: catálogo, calculadora de precio y "anotar en un ítem".
  - El GM usa el termómetro para ponerle precio a una mejora que invente un PJ.
- **Cómo afecta:**
  - Datos en `data/inventedTechUpgrades.ts` (nuevo).
  - La ficha guarda las mejoras anotadas en `inventedUpgrades?: { itemName, upgradeId, notes }[]` y se ven en el ítem.
  - Se cobra con una transacción de €$ normal.
  - No cambia el modelo de las mejoras del Core.
- **Qué se interpretó:**
  - Los efectos quedan en texto: no cambian tiradas ni stats.
  - Que el Tech PNJ instale sin tirar es la sugerencia del libro, y es lo que hace la calculadora.

### v5.43.0: Cyberware Enhancements de CEMK (solo 2077)
- **Qué es:** 9 mejoras de catálogo (pp.1-3). Las instala un Tech en 1 hora, sin tirada, y va una sola por pieza de ciberware.

  | Ciberware | Mejora | Precio | Efecto |
  |---|---|---|---|
  | Gorilla Arms | Hydraulic Ram | 1,000 | +3d6 contra cobertura |
  | Gorilla Arms | Pneumatic Actuation | 1,000 | +5 al daño extra de sus Critical Injuries |
  | Gorilla Arms | Tungsten Reinforcement | 500 | Arma combinada: Heavy Melee 3d6 ROF2 o Very Heavy Melee 4d6 ROF1, Excelente |
  | Mantis Blades | Double-Edged | 1,000 | Tira dos veces en la tabla de críticos y elige |
  | Mantis Blades | Monomolecular Edge | 1,000 | Ignora la armadura con SP menor a 7 |
  | Mantis Blades | Streamlined | 1,000 | +1 al ataque con Speedware activo si gasta Luck |
  | Monowire | Barbed Line | 1,000 | Tira tres veces en la tabla de críticos y elige |
  | Monowire | Electroshock | 500 | Puede dejar Unconscious a 1 HP en vez de bajar de 1 |
  | Monowire | Thermal-Bladed | 1,000 | Ablación +1 |
- **Dónde se ve:**
  - En la tienda y el Ripperdoc, solo para PJ de 2077 que tengan ese ciberware.
  - Los efectos se ven en el ataque del HUD.
- **Cómo afecta:**
  - Ficha: `cyberwareEnhancements?: Record<cyberwareId, enhancementId>`, una por pieza. Se cobra en €$.
  - Combate:
    - Las líneas de ataque de esas armas muestran la mejora.
    - El crítico suma +5 con Pneumatic Actuation.
    - El selector de críticos ofrece 2 o 3 tiradas para elegir.
    - El cálculo de impacto ignora SP menor a 7 con Monomolecular Edge y suma 1 de ablación con Thermal-Bladed.
    - Tungsten Reinforcement da los dos modos al atacar.
    - Electroshock agrega la opción de dejar inconsciente.
  - El Monowire de CEMK recibe su línea de ataque con los datos de su ficha del pack.
- **Qué se interpretó:**
  - Hydraulic Ram (solo contra cobertura) y Streamlined (Speedware más Luck) quedan como recordatorio en la línea de ataque, porque la app no modela daño a cobertura ni Speedware activo.
  - "Solo 2077" fue decisión de Giuliano.

### v5.44.0: Everyday People
- **Qué es:**
  - 20 civiles (pp.3-12): Bartender, Bouncer, Busker, Construction Worker, Corporate Researcher, Deal Maker, Glitterkid, Graffiti Artist, Guerrilla Gardener, Laborer, Line Cook, Neighborhood Tech, Paramedic, Scavver, Screamsheet Writer, Security Guard, Store Clerk, Streetrat, Taxi Driver y Wage Slave.
  - Cada uno trae HP, número de combate, INIT, MOVE, rol (si tiene), reputación, armadura, armas, ciberware, equipo y bases de skill, más sus 2-3 variantes.
  - La guía para crear civiles (p.2): como un Mook, pero con SP 0-7, combate 6-10 y skills no de combate 8-12.
- **Dónde se ve:**
  - En el bestiario del GM, con la facción "Civiles (Everyday People)". Lo ven solo el GM, como el resto del bestiario.
  - Una plantilla "Civil" nueva en el creador de PNJ guiado.
- **Cómo afecta:**
  - Fuente nueva `data/enemies-src/everyday-people.json`, entrada nueva en `BOOK_SPECS` y archivo generado `data/enemies/everyday-people.ts`.
  - `EnemySheet` suma `abbreviated?: true`. La ficha muestra solo lo que da el libro: REF sale de INIT y MOVE es el del libro; el resto de los STATs y el Death Save se ven como "—".
  - El porte CEMK se aplica igual y no controla el HP con la fórmula en las fichas abreviadas.
  - Las variantes van en `specialRules`, como texto.
  - La plantilla "Civil" se suma a `data/npcCreationGuidelines.ts`.
- **Qué se interpretó:**
  - El "número de combate" es la base de ataque de todas sus armas.
  - Los STATs que el libro no da no se inventan. Internamente valen 0 y no se muestran.

## Archivos principales
- Datos:
  - `data/core-rules.cprpack.json` (ítems `gq-*`).
  - Nuevos: `data/inventedTechUpgrades.ts` y `data/cemkCyberwareEnhancements.ts`.
  - `data/enemies-src/everyday-people.json`, más el generado `data/enemies/everyday-people.ts`.
  - `data/npcCreationGuidelines.ts`.
- Código:
  - `features/combat/CombatHudView.tsx` (Flash of Luck y ataques).
  - `features/netroles/NetAndRolesDeckView.tsx` (sigilo y Tech Upgrades).
  - `features/roles/MakerPanel.tsx`.
  - `engine/combatEngine.ts`, `engine/weaponAttackLines.ts` y `features/combat/CritTableSelector.tsx`.
  - La tienda y el Ripperdoc (enhancements).
  - `types/cyberpunk.ts` y `store/useCharacterStore.ts` (campos nuevos).
  - `data/enemiesCatalog.ts` (`abbreviated`), `scripts/gen_enemies.py` y `features/gm/EnemiesCompendiumPanel.tsx` ("—").
  - `sync/` y `frontend/firestore.rules`, con su test (`flashOfLuck`).
- Tests nuevos, en `engine/__tests__/`:
  - Flash of Luck: costos y topes.
  - Sigilo: tiradas opuestas.
  - Precio de las Tech Upgrades.
  - Efectos de los enhancements en `combatEngine`.
  - Los 20 civiles con su página.
  - Las reglas de Firestore con `flashOfLuck`.

## Verificación (cada versión)
- Desde `frontend/`: `npx tsc -b --noEmit`, `npx vitest run` y `npm run build`.
- `npm run test:rules` en la v5.41.0, porque cambian las reglas.
- En el navegador (local):
  - **v5.41.0:** prender Flash of Luck y gastarla; ver que se respeta el tope por Beat; Jack In en silencio y esquivar un Black ICE; comprar el Ghostsuit.
  - **v5.42.0:** calcular el precio de una mejora (con mano de obra y con kit) y anotarla en un arma.
  - **v5.43.0:** instalar Double-Edged en un PJ de 2077 y ver la doble tirada de crítico. Comprobar que un PJ de 2045 no lo ve.
  - **v5.44.0:** abrir un civil y ver los STATs con "—"; spawnearlo en el combate; crear un PNJ con la plantilla "Civil".
- Contra el PDF: 2 ítems, 2 mejoras, 2 enhancements y 3 civiles.
- **Publicación:** push, PR, merge, beta, reglas y prod piden un OK cada uno.
