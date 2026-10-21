# Plan 6 — Enemigos canon, porteados a reglas CEMK

[Claude Code · 2026-10-22]

Continúa el plan 5 (bloque "enemigos", v4.7.x) y reemplaza al plan 3 perdido. El plan 5 queda vigente para Black Chrome (v4.8.0) y docs (v4.8.1).

## Contexto
El catálogo de enemigos (`frontend/src/data/enemiesCatalog.ts`, 131 fichas) mezcla libros y tiene mucho contenido inventado:
- 95 fichas "Danger Gal" que no existen en el libro.
- 10 Hardened, de las que solo unas pocas son reales.
- Fichas CEMK y de Red Chrome Cargo inventadas: Tamayura, Achilles, Chao y Ballistic Coprocessor no están en ningún PDF.
- Neuroport y Quickhacks solo como texto libre.

Giuliano quiere que **todos los enemigos sean canon y se jueguen con reglas CEMK** (Neuroport, Quickhacks, NET Actions).

CEMK no trae ninguna guía para convertir PNJ de RED a CEMK. Por eso el porte no se escribe a mano por ficha: se **calcula con reglas fijas**, cada una citando su página de CEMK, sobre la ficha original del libro. Así el dato sigue siendo canon y el porte es reproducible.

## Decisiones de Giuliano
- **Neuroport a todos** los PNJ porteados, como en las 14 fichas de CEMK: todos son hackeables.
- **Ficha del libro + porte CEMK.** Se guardan los datos tal cual el libro y el porte se calcula. La app muestra CEMK por defecto, con un botón para ver la ficha RED original.
- **Netrunners:** en el porte, el Cyberdeck pasa a Cyberdeck Port, se habilitan Quickhacks según el rango de Interface y hasta 3 NET Actions. Los programas RED quedan solo en la ficha RED.

## Inventario canon (qué entra)
| Libro | Fichas | Netrunners | Notas |
|---|---|---|---|
| Core pp. 412-416 | 10 | 1 | Bodyguard, Boosterganger, Road Ganger, Security Operative, Netrunner, Reclaimer Chief, Security Officer, Outrider, Pyro, Cyberpsycho |
| CEMK (Jacket pp. 33-40, Karaoke pp. 8-10) | 14 | 1 | Ya en formato CEMK: no se portean, se cargan tal cual |
| Hardened (3 PDFs) | 16 | 2 | 4 Mooks, 6 Lieutenants, 6 Mini-Bosses. El Punknaught es un vehículo y va a v4.8.0 (catálogo de vehículos) |
| Danger Gal Dossier | 118 | 8 | 15 facciones (pp. 9-131) + 2 PNJ Arasaka de la misión (pp. 165-166). New Gear pp. 144-148 |
| Red Chrome Cargo | 0 propias | 0 | Usa el Boosterganger y el Security Operative del Core (por id), la Automated Turret (Core p.214) y el mainframe de 5 pisos |

Total: ~158 fichas canon. Se borran todas las inventadas.

## Modelo de datos
- Catálogo partido por libro:
  - Archivos: `frontend/src/data/enemies/core.ts`, `cemk.ts`, `hardened.ts` y `dangerGal.ts`.
  - `enemiesCatalog.ts` reexporta `ENEMIES_CATALOG` y mantiene `convertEnemyToCharacterSheet`, para no romper a los consumidores.
- `EnemySheet` conserva sus campos actuales y agrega campos opcionales, para no romper los encuentros y PNJ custom guardados en localStorage:
  - Procedencia y rango: `sourcePage`, `level?`, `rep?`, `luck?`, `roleAbility?: { name, rank }` y `skillBases?: Record<string, number>`.
  - Netrunning: `isNetrunner?`, `interfaceRank?` y `cyberdeckPrograms?` (los RED originales).
  - CEMK: `selfIce?` (cantidad de Passwalls, solo si el libro los lista).
  - Ficha de origen: `format: 'red' | 'cemk'`. Las fichas CEMK nativas traen los campos CEMK directamente.
- `faction`: id normalizado (por ejemplo `maelstrom`) + nombre mostrado. `DANGER_GAL_FACTIONS` pasa a 15 facciones canon, con página.

## Reglas de porte (`frontend/src/engine/cemkPort.ts`, función pura `portEnemyToCemk(enemy)`)
Cada regla vive en una constante comentada con su página de CEMK (RB = Rule Book):
1. **Neuroport:** a todos los PNJ (decisión de Giuliano, en línea con RB pp. 35-36 y las 14 fichas CEMK). Todos son hackeables (RB p.15).
2. **Netrunner:**
   - El Cyberdeck pasa a Cyberdeck Port en el Neuroport, con alcance de 50 m (RB p.16).
   - NET Actions: hasta 3 por turno, o 1 Meat Action (RB pp. 16-17).
   - Check: Interface + 1d10 (RB p.16).
   - Quickhacks según el rango de Interface (RB p.25): rango 1 → DV6, rango 2 → DV8, rango 3 → DV10, rango 4+ → DV12.
   - Los programas RED y el Black ICE no se portean.
3. **Self-ICE:** solo si la ficha del libro lo trae (RB p.36: hasta 3, Passwall DV 6/8/10). No se inventa.
4. **Armas:** las RED cuentan como Power (RB p.8). Las Smartgun cuentan como Smart. Los stats del libro no cambian y no se aplica Rebuild.
5. **Armadura:** SP completo y SP a la mitad contra melee (RB p.10), mostrados como en las fichas CEMK.
6. **HP y Death Save:** se verifica la fórmula CEMK (HP = 10 + 5×⌈(BODY+WILL)/2⌉, Death Save = BODY). Si el libro imprime otro valor, gana el libro y la diferencia queda anotada.
7. **Críticos:** usan la tabla 1d6 de CEMK (RB p.13), que ya maneja el motor.
8. **Sin LUCK** en el porte, porque las fichas CEMK no la tienen. La ficha RED la conserva.

El HUD/GM usa el porte para hackear: alcance y Quickhacks disponibles. `convertEnemyToCharacterSheet` toma `hasNeuroport` y la Interface del porte.

## Versiones
1. **v4.7.0 Motor de porte + Core + CEMK + Hardened + Red Chrome Cargo:**
   - Modelo, `cemkPort.ts` con tests y división del catálogo.
   - Se cargan Core (10), CEMK (14) y Hardened (16).
   - `redChromeCargoData.ts`: se reescribe con los ids del Core, se corrigen el mainframe y los DV 13/9/15, y se borran Tamayura, Achilles, Chao y el Ballistic Coprocessor.
   - Errata del Security Officer del Core p.415, pendiente desde v4.6.2.
   - UI: en el panel GM, selector CEMK/RED en la ficha, badge de Neuroport, Quickhacks disponibles y página del libro.
2. **v4.7.1 Danger Gal (118 fichas + 15 facciones):** extracción por tandas de facciones, todas canon, y se borran las 95 inventadas.
3. **v4.7.2 New Gear de Danger Gal:**
   - Se agregan las armas que todavía no están. 9 de las 15 ya entraron con Gunmas; de esas solo se anota Danger Gal como fuente secundaria.
   - También entran 8 ciberwares y 8 ítems de equipo, con su página.

## Método
- **Extracción (scout, Sonnet):** por libro, o por tandas de 3-4 facciones en Danger Gal. Sale un JSON con cada ficha completa y su página. Los números con espacios ("1 1" = 11) se revisan contra la página.
- **Generador:** script en `scripts/` que pasa los JSON a `frontend/src/data/enemies/*.ts`. Así no se escriben 118 fichas a mano y el resultado es reproducible.
- **Aplicación (worker):** spec quirúrgica para el modelo, el porte, la UI y los consumidores. Hoy los consumidores son:
  - `EnemiesCompendiumPanel.tsx` (filtros, spawn y PNJ custom).
  - `FixerDeckView.tsx` L357.
  - `DataPackManagerView.tsx` y `systemDocsAndChangelogData.ts` (solo leen `.length`).
  - `rules.test.ts` L199 (`core-boosterganger`).
- **Auditoría (yo):** diff, tsc, tests y build. Navegador en el panel GM: spawn de un enemigo, porte CEMK y vista RED, y un Quickhack contra un PNJ.
- **Muestreo canon:** un scout coteja el 10% de las fichas de cada libro contra el PDF.
- **Registro:** `docs/canon-audit/v4.7.x-*.md` con qué se perdió, qué se ganó y qué se corrigió, ficha por ficha, con libro y página. Además: CHECKPOINT por fase, changelog firmado, rama `claude/v4.7.x-*`, PR y gh-pages por versión.

## Persistencia
- Encuentros (`cpr_active_encounter_v1`) y PNJ custom (`cpr_custom_npcs_v1`) son copias completas: no se rompen.
- Los campos nuevos son opcionales. Al cargar, si un PNJ custom no los trae, se porta igual: Neuroport sí y Netrunner solo si su rol es Netrunner.
- Los ids del catálogo que coinciden con el canon se conservan (por ejemplo `core-boosterganger`).

## Verificación
- Tests:
  - Conteos por libro (Core 10, CEMK 14, Hardened 16, Danger Gal 118, 15 facciones).
  - Ningún id inventado.
  - Todas las fichas con `sourcePage`.
  - `portEnemyToCemk`: Neuroport en todos, DV máximo de Quickhack según el rango, NET Actions = 3 y SP a la mitad contra melee.
  - HP del libro contra la fórmula, listando las diferencias.
- `npx tsc -b --noEmit`, `npm test` y `npm run build`.
- Navegador en el panel GM y en el Combat HUD (Quickhack a un PNJ porteado).
- Verificación en vivo después de publicar.

## Fuera de alcance
- El Punknaught va a v4.8.0, con los vehículos.
- La guía de creación de PNJ y la aventura "The Incident" de Danger Gal, salvo referencias.
- Los PNJ de otros libros (IR Vol. 1-3, Gang Guide…).
