# Plan 12: v4.9.4, Modo Novato del creador de personajes

[Claude Code · 2026-10-23]

Detalla la v4.8.3 del plan 7 (`docs/plans/plan7-creador-personajes.md`, que no se modifica), que pasa a ser la v4.9.4. Al aprobarse se guarda como `docs/plans/plan12-v494-modo-novato.md`, en la rama `claude/v4.9.4-modo-novato`.

## Contexto
El wizard (`frontend/src/features/creator/`) ya crea personajes completos, con reglas canon. Al explorarlo, el estado quedó así:
- **Ya existe**:
  - la checklist que bloquea "Crear", con un botón "Ir a <paso>" (`SummaryStep.tsx` L197-222, `getMissingChecklist` en `engine/characterCreation.ts` L1063);
  - el bloque "Para seguir falta" de cada paso (`CharacterCreatorWizard.tsx` L205-210);
  - un resumen con stats, derivados, skills, lifepath, equipo, dinero y vivienda;
  - `StepHeader` con subtítulo y página.
- **Falta**:
  - el interruptor del Modo Novato;
  - la explicación de "qué es esto" en cada paso, con la página del libro;
  - tooltips que funcionen en celular: hoy son `title=` nativos (`SkillsStep.tsx` L142, `StatsStep.tsx` L19-30);
  - un resumen ordenado como confirmación final, con avisos.

## Decisiones de Giuliano (2026-10-23)
1. **Solo texto del libro**: el Modo Novato explica cada paso con texto del libro y su página, sin consejos propios. Recomendar Streetrat solo si el Core lo dice (se verifica en p.41); si no, no se recomienda.
2. **Alcance**: solo el creador. Street Lab y el HUD no cambian.
3. **Tooltips**: un ⓘ al lado de cada skill y cada STAT que al tocarlo despliega el texto completo con su página. Funciona igual en celular y en PC.
4. **Resumen**:
   - se reordena como confirmación ("Revisá y confirmá") en el orden de la ficha;
   - se suman avisos que no bloquean: dinero sin gastar, Humanidad que baja la EMP, skills básicas en 0, sin arma o sin armadura. Se escriben como hechos de la ficha, y con página cuando hay una regla detrás.

## Cambios
1. **Interruptor**:
   - `store/creatorNoviceStore.ts`, nuevo, con el mismo patrón que `store/gmModeStore.ts`: zustand `persist`, `name: 'cpr_creator_novice_v1'`, `novice: true` por defecto y `toggle()`;
   - es independiente del borrador (`creatorDraftStorage.ts`), así que "Descartar borrador" no lo reinicia;
   - el interruptor "Modo Novato" va en la cabecera del wizard;
   - hay que revisar si `store/persistence.ts` (~L312) lista las claves del respaldo, y sumar esta si corresponde.
2. **Textos del libro por paso**:
   - un scout extrae del PDF los textos de cada paso con su página: Core pp. 40-44 (métodos y pasos de creación), Role p.30 y siguientes, Lifepath, STATs, skills (pp. 80-86), equipo, vivienda p.105 y Neuroport (RB p.25);
   - van a `data/creation-src/creator-guide.json`: `{ step, whatEs, source: { book, page } }[]`, más `recommendsStreetrat` solo si el libro lo dice;
   - se genera `data/creation/creatorGuide.ts` con `scripts/gen_creation.py`;
   - se reutiliza lo que ya está con página, sin duplicarlo: `methods[].rulesEs` (`coreRoleTables`), `roles[].descEs` (`coreRoles`), `housing.textEs` y `culturalLanguageRule.textEs` (`coreGearSkills`), `creationRules` de `cemkCreation` y `STAT_TOOLTIPS` (`data/characterCreationData.ts` L183).
3. **UI de la guía** (`features/creator/CreatorUi.tsx`):
   - `NoviceGuide { step }` muestra, debajo de `StepHeader`, el recuadro "Qué es esto" con su etiqueta de página, solo con el Modo Novato prendido;
   - se monta en los 7 pasos;
   - en el paso Método, si el libro recomienda Streetrat, una etiqueta "Recomendado por el libro" con la página.
4. **Tooltips desplegables**:
   - `InfoToggle { text, source }` en `CreatorUi.tsx`: un botón ⓘ que despliega el texto completo debajo (con `aria-expanded`) y muestra la página;
   - reemplaza los `title=` de `SkillsStep.tsx` L142 y de `StatLabel` en `StatsStep.tsx` L19-30;
   - se muestra siempre, con el Modo Novato prendido o apagado.
5. **Resumen**:
   - `SummaryStep.tsx` se reordena en tarjetas en el orden de la ficha: identidad y rol, STATs, derivados, skills, lifepath, ciberware y Humanidad, equipo, dinero y vivienda;
   - un encabezado "Revisá y confirmá" va antes de "Crear";
   - la checklist y el bloqueo actuales no cambian.
6. **Avisos** (motor puro):
   - `getSummaryWarnings(draft, built): { message: string; source?: { book; page } }[]` en `engine/characterCreation.ts`;
   - dinero sin gastar, Humanidad que baja la EMP efectiva (Core, regla de Humanidad), skills básicas en 0, ningún arma y ninguna armadura;
   - se muestran en el panel "Avisos" que ya existe (`SummaryStep.tsx` L212), separados de la checklist;
   - el scout verifica en el libro cada regla que se cite.
7. **Cierre**:
   - `APP_VERSION` pasa a v4.9.4;
   - changelog md e in-app con `author: 'Claude Code'`, CHECKPOINT, PR, merge y gh-pages.

## Partes (workers con archivos separados)
- **Scout**: los textos de la guía con su página, y la verificación de Streetrat y de las reglas de los avisos.
- **Worker A**:
  - `creator-guide.json` y el generador;
  - `getSummaryWarnings` y sus tests en `engine/__tests__/characterCreation.test.ts`: cada paso tiene texto y página, cada aviso tiene su caso, y el borrador vacío no da avisos espurios;
  - `creatorNoviceStore`.
- **Worker B**: `CreatorUi.tsx` (`NoviceGuide`, `InfoToggle`), los 7 pasos, el interruptor en `CharacterCreatorWizard.tsx` y el resumen.

## Verificación
- `npx tsc -b --noEmit`, `npm test` y `npm run build`.
- **Navegador** (`omni-deck-dev`):
  - el Modo Novato prendido por defecto; al apagarlo se ocultan las guías, y la elección queda guardada al recargar;
  - cada paso muestra su "Qué es esto" con página;
  - el ⓘ de una skill y de una STAT despliega el texto completo, en PC y a 375 px;
  - "Descartar borrador" no cambia el interruptor;
  - el resumen ordenado, con los avisos (por ejemplo, un Streetrat sin gastar el dinero) y la checklist que sigue bloqueando "Crear";
  - crear un personaje completo de punta a punta.
