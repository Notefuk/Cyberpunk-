[Claude Code · 2026-11-25] Plan aprobado por Giuliano el 2026-11-25.

# Plan 35: Drones y robots de Corgo's 77 (homebrew con sello)

[Claude Code · 2026-11-25]

## Contexto
Giuliano quiere sumar al bestiario del Omni-Deck los enemigos de **Corgo's 77 Collection V3**, un PDF homebrew de Corgopolis que está en la carpeta de trabajo. Tienen que quedar marcados como homebrew, distintos de todo el contenido canon.

Lo que trae el PDF:
- No tiene NPCs humanos.
- Tiene **33 máquinas con ficha de combate** (MOVE, HP, SP, Combat Number):
  - 4 Exec Drone Team Members (p.6) y el tipo genérico Humanoid Ground Drone (p.153).
  - 28 del catálogo (pp.154-163): drones aéreos, robots humanoides, mechs, torretas y drones personales.
  - Un jefe: el **Militech Chimera** (pp.159-160; 200 HP, SP 18, CN 18, 3 armas, drones de reparación, ICE propio).

Hay que cambiar una regla anotada: el CHECKPOINT dice "Todo canon: borrar lo inventado, sin homebrew". Giuliano aprobó una **excepción**: el contenido de Corgo se ve en el bestiario con una fuente y un sello propios, y se puede filtrar.

Decisiones de Giuliano (2026-11-25): cargar los 33 drones; visibles con sello (no ocultos por defecto). Las armas homebrew del PDF **no** van al catálogo de equipo: solo aparecen dentro de la ficha de cada drone.

## Resumen corto de cada cosa
- **Fuente nueva "Corgo's 77 (homebrew)"**
  - Qué hace: los 33 drones aparecen en el bestiario del GM con un sello violeta "HOMEBREW" que no usa ninguna otra fuente. Se pueden filtrar por fuente.
  - Dónde se ve: el bestiario, el selector de enemigos del Fixer, las tablas del GM y el contador de Data Packs, que pasa a contarlos aparte como "homebrew" y no como "canónicos".
  - Cómo afecta: a la mesa, a los actores del GM y a las tiradas de ataque de esos actores. No toca fichas de jugador ni reglas de Firestore.
- **Ficha de máquina (Combat Number)**
  - Qué hace: estas fichas no tienen STATs. Muestran MOVE, HP, SP y Combat Number, y la app usa el Combat Number para atacar y para cualquier tirada.
  - Dónde se ve: la ficha del bestiario y el actor en la mesa.
  - Qué interpreté: con el Combat Number como base de ataque de cada arma, la tirada es CN + 1d10. Las 9 Critical Injuries que los drones ignoran (p.153) van como regla especial escrita; no se aplican solas.
- **Qué se deja afuera**
  - Las armas, accesorios, cyberware y vehículos homebrew del PDF no entran al catálogo.
  - Las Iconics (armas de Johnny, Panam, etc.) no entran.
  - El ajuste de rol "Exec Drone Team" de la p.5 no se carga como regla de rol; se carga solo la ficha de cada drone.
  - El ICE "Phaeton" del Chimera va como texto, sin arquitectura de NET jugable.

## Cambios

### 1. Datos fuente (generador, sin editar a mano)
- **`data/enemies-src/corgo77.json`** (nuevo): las 33 fichas, transcritas del PDF y siguiendo `data/enemies-src/SCHEMA.md`.
  - Ids con prefijo `c77-`.
  - Cada ficha lleva `sourcePage`, la cita "Corgo's 77 V3 p.N" y el costo.
  - `faction` es el fabricante: Militech, Arasaka, NCPD, MAX-TAC, Aldecaldos, Zetatech, Kang Tao, Kiroshi o Zhirafa.
  - Tier sugerido: torretas y drones personales como mook, drones de combate como lieutenant, Cerberus y Superheavy como mini_boss, Chimera como boss. Es una interpretación: el PDF no pone tiers.
- **`scripts/gen_enemies.py`**: agregar `corgo77` en `BOOK_SPECS` (L75-86) y una rama en `book_title()` (L88-108).
  - Si viene `combatNumber`, el script arma `combatBases` y `weapons[].skillBase` con ese número y no exige STATs.
  - Nuevos campos que pasan al TS: `combatNumber`, `machine`, `homebrew`.
- **`frontend/src/data/enemies/corgo77.ts`**: generado por el script, con la cabecera "No editar a mano".

### 2. Tipos y fuente
- **`frontend/src/data/enemiesCatalog.ts`**:
  - `SourceBookId` (L29-35) suma `'homebrew_corgo77'`.
  - `EnemySheet` (L56-99) suma los campos opcionales `homebrew?: true`, `machine?: { type: string; move: number }` y `combatNumber?: number`.
  - `ENEMIES_CATALOG` (L118-128) suma `CORGO77_ENEMIES`.
- **`frontend/src/types/cyberpunk.ts` L252**: la misma unión `SourceBookId` también suma `'homebrew_corgo77'`.
- **`convertEnemyToCharacterSheet`** (L140-267): si es máquina, las STATs quedan en un valor neutro y la base de ataque se toma de `combatBases`, sin recalcularla desde las STATs.

### 3. UI
- **`features/gm/EnemiesCompendiumPanel.tsx`**:
  - Entrada en `SOURCEBOOK_LABELS` (L113-120) con una clase de sello violeta nueva.
  - Opción "Corgo's 77 (homebrew)" en el `<select>` (L1012-1021).
  - En la tarjeta: si `homebrew`, sello "HOMEBREW", fuente "Corgo's 77 V3 p.N (no oficial)" y nota de licencia en la ficha.
  - Si `machine`, se muestra la fila MOVE / HP / SP / Combat Number en lugar de la grilla de STATs.
- **`features/roles/FixerPanel.tsx`** y **`features/gmtables/GmTablesView.tsx`**: un sufijo " · homebrew" en el nombre del listado, para que nunca se confunda con un enemigo canon.
- **`features/datapacks/DataPackManagerView.tsx` L463**: el conteo de "canónicos" excluye los `homebrew`, que se cuentan aparte.

### 4. Tests (`frontend/src/engine/__tests__/corgo77.test.ts`, nuevo)
- Hay 33 fichas con id `c77-`, página, `homebrew: true` y fuente `homebrew_corgo77`.
- Chimera: 200 HP, SP 18, CN 18.
- `convertEnemyToCharacterSheet` de un drone da base de ataque igual al CN.
- Ninguna ficha canon tiene `homebrew`.
- Los ids son únicos en todo `ENEMIES_CATALOG`.

### 5. Docs y cierre (firmado Claude Code)
- `docs/plans/plan35-drones-corgo77.md`: este plan, inmutable.
- `docs/plans/README.md`: índice.
- CHECKPOINT: plan activo y la excepción a "sin homebrew", acotada a Corgo's 77 con sello.
- Versión v5.48.0 en el changelog in-app, con `author: 'Claude Code'` y el resumen corto.
- `CHANGELOG_AND_ARCHITECTURE.md`.
- Rama `claude/plan35-corgo77`, que sale de `main`. Commit por paso con `Autor-IA: Claude Code`. Push, beta y prod: cada uno con su OK aparte.

## Verificación
1. `python scripts/gen_enemies.py` regenera sin errores y no cambia los otros libros (`git diff --stat` muestra solo `corgo77.ts`).
2. Desde `frontend/`: `npx tsc -b --noEmit`, `npm test` y `npm run build` con 0 errores.
3. App en el navegador (dev server local, como GM):
   - El bestiario filtra por "Corgo's 77" y aparecen 33 fichas con sello HOMEBREW.
   - La ficha del Chimera muestra la fila de máquina.
   - Mandar un drone a la mesa y tirar un ataque: la base de la tirada es su CN.
   - Captura como prueba.
4. Revisar a mano 5 fichas contra el PDF: Griffin p.155, Cerberus p.159, Chimera pp.159-160, Security Turret p.161 y Stealth Drone p.6.
