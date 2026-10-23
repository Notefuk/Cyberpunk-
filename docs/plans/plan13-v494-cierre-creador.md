# Plan 13: cierre del creador dentro de la v4.9.4 (STATs del libro, Grafted Muscle, ciberware repetible y docs)

[Claude Code · 2026-10-23]

Suma cuatro arreglos a la v4.9.4 (plan 12, que no se modifica), en la misma rama `claude/v4.9.4-modo-novato`, antes de publicarla. Al aprobarse se guarda como `docs/plans/plan13-v494-cierre-creador.md`.

## Contexto (scouts del 2026-10-23)
- **STATs**:
  - `STAT_TOOLTIPS` (`data/characterCreationData.ts` L174-310) es texto propio de la app, sin página.
  - Trae "umbrales" que no son reglas del libro (REF 8+ Bullet Dodging, INT 6+ netrunners, BODY 8+ armas pesadas).
  - Lo usan el ⓘ de `StatsStep.tsx` y `StreetLabView.tsx` L1166-1190.
  - El Core describe las 10 STATs en p.72.
- **Neuroport**: verificado en el PDF del CEMK Rulebook. Va en p.25 impresa (PDF 26): gratis, 0 HL, no baja la Humanidad Máxima y es requisito para el ciberware no médico. El dato está bien; solo la guía lo cita como "CEMK" en vez de "CEMK RB".
- **Grafted Muscle and Bone Lace**:
  - Core p.114 (errata v1.25): +2 BODY por instalación, acumulable, sin pasar de 10. Cambia HP, Seriously Wounded y Death Save.
  - Ids: `grafted-muscle-bone-lace` (Core) y `cw-cemk-grafted-muscle` (CEMK).
  - El motor no lo aplica: `getEffectiveBody` (`engine/characterEngine.ts` L132) solo mira el FBC y `computeDerived` (`engine/characterCreation.ts` L881) usa el BODY crudo.
  - Thorn (CEMK Folios p.21-22) guarda BODY 10 con el bono ya incluido (base 8).
- **Ciberware repetido**: `installedCyberwareIds: string[]` admite ids repetidos y el creador ya los genera por cantidad. Pero la UI no deja repetir: `installCyberwareAdvanced` L1582 y la compra L1971 bloquean con `includes`, y `toggleCyberwareInstall` y `uninstallCyberware` sacan todas las copias.
- **Docs**: `characterLifepathData.ts` y `ROLE_SPECIFIC_LIFEPATHS` no existen. Aparecen en AI_CONTEXT_HANDOFF.md L147 y L215, CLAUDE.md L55, CHECKPOINT.md L86 y PROJECT_STATUS_AND_ROADMAP.md L48. Hoy son `data/creation/coreLifepath.ts` (`CORE_LIFEPATH.byRole`), `ROLE_LIFEPATH_QUESTIONS` y `getApplicableRoleLifepathTables`.

## Decisiones de Giuliano (2026-10-23)
1. **STATs**: el texto del Core p.72 en todos lados, el creador y Street Lab. Se quitan los umbrales inventados.
2. **Grafted Muscle**: la regla del Core en las dos eras, también para el id de CEMK. El "a 10" del CEMK es el resultado de Thorn (8 + 2), no otra regla.
3. **Folios**: el BODY de base va sin el bono. Thorn pasa a BODY 8, y el motor le da 10. La migración solo corrige la ficha de Thorn del Folio.
4. **Ciberware repetible**: se puede instalar cualquier ciberware más de una vez, y desinstalar saca una sola instalación. Cada ciberware con efecto escalable lo declara en el dato (por ejemplo, Grafted Muscle +2 BODY con tope 10).
5. **Versión**: todo entra en la v4.9.4, que se publica una sola vez.

## Cambios
1. **STATs del libro**:
   - `STAT_TOOLTIPS` conserva `name` y `spanishName`. `shortSummary` pasa a ser la paráfrasis en castellano del Core p.72 (verificada por el scout en el PDF), y se agrega `source: { book: 'Core RED', page: 72 }`.
   - `beginnerExplanation` y `mechanicalBreakpoints` se vacían o se quitan; `dependentSkills` queda solo si sale del libro.
   - El ⓘ de `StatsStep` y el bloque de `StreetLabView` L1166-1190 muestran el texto y la página.
2. **Efectos de STAT por ciberware**:
   - Nuevo `engine/cyberwareEffects.ts`, con una tabla de efectos por id: `{ 'grafted-muscle-bone-lace': { stat: 'BODY', perInstall: 2, max: 10, source: Core p.114 }, 'cw-cemk-grafted-muscle': lo mismo }`.
   - `cyberwareStatBonus(ids, stat, base)` cuenta las copias y aplica `min(max, base + n·perInstall)`, sin bajar nunca del base.
   - `getEffectiveBody` aplica el bono sobre el BODY base y después el FBC (`Math.max` con `bodyOverride`, como hoy).
   - `computeDerived` del creador aplica el bono con el ciberware del borrador (`getCyberwareList`, por `catalogId`), así que HP, SW y Death Save salen bien en la vista previa y en la ficha creada.
   - Todo lo que hoy usa `stats.BODY` crudo para reglas pasa por el BODY efectivo: Choke/Throw en `CombatHudView` L2037, el Brawling en `NetAndRolesDeckView` L1618-1623 y `CyberwareRipperdocView` L511/L643. `socialRoleRules` L332 es para PNJ (Team Members), así que queda igual.
3. **Ciberware repetible**:
   - `installCyberwareAdvanced` y la compra de ciberware dejan de bloquear el duplicado.
   - `uninstallCyberware` y `toggleCyberwareInstall` sacan una sola copia (la última).
   - La Humanidad que se pierde se descuenta por instalación (se verifica que cada copia cuente).
   - Donde la UI usa `.includes(id)` como "instalado", se muestra el conteo (×2) cuando hay más de una, y un botón para instalar otra.
   - En Grafted Muscle, el botón se desactiva cuando el BODY efectivo ya es 10, con el aviso "tope 10 (Core p.114)".
4. **Thorn y migración**:
   - `cemkFolioPremadesData.ts` L4619: Thorn pasa a BODY 8.
   - Paso de migración `4:` en `store/persistence.ts`, y `CHARACTERS_SCHEMA_VERSION` pasa a 5. A la ficha con id `cemk-folio-thorn`, BODY 10 y `cw-cemk-grafted-muscle` instalado le pone BODY 8. HP y SW se recalculan con el BODY efectivo, así que siguen dando 55 y 28.
   - Se revisan los datos de Thorn en `cemkCreation`/`roleRanks` (L2728, L2924, L1594, L1731) por si usan el BODY base.
5. **Guía**: en `creator-guide.json` el Neuroport pasa a citar `"CEMK RB"` p.25, y se regenera.
6. **Docs**: los 5 lugares que citan `characterLifepathData.ts` / `ROLE_SPECIFIC_LIFEPATHS` pasan a nombrar los archivos reales, con firma.
7. **Cierre**:
   - se amplían la entrada v4.9.4 del changelog (md e in-app) y el checkpoint;
   - se quita de los pendientes el Grafted Muscle, los STATs y los docs;
   - PR, merge y gh-pages, después de que Giuliano lo confirme.

## Partes (workers con archivos separados)
- **Scout**: la paráfrasis de las 10 STATs del Core p.72 en castellano, verificada en el PDF.
- **Worker A, motor y datos**: `cyberwareEffects.ts`, `characterEngine.ts`, `characterCreation.ts` (`computeDerived`), `characterCreationData.ts` (`STAT_TOOLTIPS`), Thorn, migración y tests:
  - Grafted ×1 y ×2 con tope 10 y sus HP, SW y Death Save (Core p.114);
  - el FBC sigue mandando;
  - el creador con Grafted;
  - la migración de Thorn;
  - las STATs con página.
- **Worker B, store y UI**: install y uninstall en `useCharacterStore`, el conteo y el botón en Ripperdoc, Compendium y GoingMetalBanner, el uso del BODY efectivo en CombatHud y NetAndRoles, y el bloque de STATs en StreetLab y StatsStep.
- **Yo**: la guía (`CEMK RB`), los docs, la auditoría de los diffs y el cierre.

## Verificación
- `npx tsc -b --noEmit`, `npm test` y `npm run build`.
- **Navegador**:
  - Thorn (después de migrar) muestra BODY 10, HP 55 y SW 28;
  - un personaje con BODY 6 instala Grafted dos veces y llega a 10, con el HP recalculado; una tercera instalación queda bloqueada por el tope, y desinstalar saca una sola;
  - en el creador, comprar Grafted cambia el HP de la vista previa;
  - el ⓘ de la STAT muestra el texto del Core p.72;
  - a 375 px.
