# CPR OMNI-DECK // Frontend Technical Architecture & Developer Guide

> **Tech Stack**: React 19 • TypeScript 5.8+ • Vite 6+ • Tailwind CSS v4 • Zustand 5 • Lucide React • Oxlint

This directory contains the single-page application (SPA) client for **CPR OMNI-DECK**. The application is engineered following the **COMP/CON architectural model**: a strict decoupling between canonical tabletop rules, pure deterministic mathematical engines, reactive Zustand state stores, and tactile UI feature modules.

---

## 🏛️ Layered Architecture & Separation of Concerns

```text
frontend/src/
├── types/       ➔ Single Source of Truth for Domain Modeling (cyberpunk.ts)
├── engine/      ➔ Pure Deterministic Mathematical Engines (characterEngine, combatEngine)
├── store/       ➔ Reactive State Stores with Persistence (useCharacterStore, useCombatStore)
├── data/        ➔ Static Rulebooks, Data Packs & Range Tables (.cprpack.json, TS registries)
├── features/    ➔ Modular UI Views & Tactical Military HUD Panels (combat, sheet, creator, etc.)
└── components/  ➔ Shared Reusable Components & Vector Placeholders (ItemVisualPlaceholder)
```

### 1. `src/types/` — Modelado Canónico de Dominio
- **`cyberpunk.ts`**: Contrato tipográfico estricto para todas las entidades del juego. Define tipos para las 10 estadísticas (`StatKey`), 16+ habilidades de combate y generales, estructuras de armas (`EquippedWeapon`), armaduras con SP por localización, ciberware con impacto en Humanidad, heridas críticas de 2d6, arquitecturas NET, roles y adversarios del bestiario.

### 2. `src/engine/` — Motores Matemáticos Puros (Zero Side-Effects)
- **`characterEngine.ts`**:
  - `calculateMaxHp(body, will)`: Fórmula oficial `10 + 5 * ceil((BODY + WILL) / 2)`.
  - `calculateSeriouslyWounded(maxHp)`: Umbral $\le \text{ceil}(\text{MaxHP} / 2)$ que aplica penalizador global `-2`.
  - `calculateDeathSave(body)`: Umbral igual a BODY base.
  - `calculateMaxHumanity(emp)`: `EMP * 10` y recálculo reactivo de EMP actual.
  - `calculateEncumbrance(body, inventoryWeight)`: Control de capacidad de carga y sobrepeso situacional.
- **`combatEngine.ts`**:
  - `rollAttack(stat, skill, luck, modifiers)`: Tirada canónica desacoplada `STAT + Skill + 1d10` con explosión en `10` (+1d10) y pifia en `1` (-1d10).
  - `rollDamage(diceExpression, isAutofire, multiplier)`: Tirada independiente de daño `Xd6` con evaluación de dos o más `6`s para herida crítica automática (+5 daño directo a HP).
  - `ablateArmor(currentSp, damage, isArmorPiercing)`: Reducción de 1 punto de SP (o 2 con munición perforante) si el daño supera la armadura.
  - `calculateAimedShotPenalty()`: Aplicación estricta de `-8` a la tirada y ROF 1.

### 3. `src/store/` — Gestión de Estado Reactivo (Zustand 5)
- **`useCharacterStore.ts`**:
  - Mantiene el roster completo de edgerunners con persistencia en `localStorage`.
  - Control de personaje activo, inventario de armas, blindaje, ciberware instalado, monedero de Eurodólares (€$) y conmutador Full Body Conversion (*Going Metal*).
  - Precarga automática de la banda de 7 Edgerunners de *Cyberpunk 2077 (CEMK)*.
- **`useCombatStore.ts`**:
  - Tracker dinámico de iniciativa de combate multiobjetivo (Mooks, Lieutenants, Bosses).
  - Estado de distancia seleccionada, DV contra la tabla de rangos y registro cronológico de tiradas.

### 4. `src/data/` — Catálogos Canónicos y Data Packs
- **`core-rules.cprpack.json`**: Catálogo maestro de 391+ ítems oficiales extraídos de los manuales.
- **`rangeTables.ts`**: Matrices oficiales de DVs por metro (8 brackets de `0-6m` a `401-800m`) y Autofire.
- **`criticalInjuries.ts`**: Tablas 2d6 oficiales para Cabeza y Cuerpo (Core Book págs. 187-188).
- **`cyberfistsMartialArtsData.ts`**: 23 artes marciales y 46 movimientos especiales (*Interface RED Vol 4*).
- **`enemiesCatalog.ts`**: Bestiario de 44 enemigos Core/Tales + 118 PNJs de *Danger Gal Dossier*.
- **`goingMetalFbcData.ts`**: 13 cuerpos FBC, 16 ciberwares borg y reglas de chasis (*Interface RED Vol 3*).
- **`netAndRolesData.ts`**: Arquitecturas NET 2045, software Black ICE, Quickhacks 2077 y 10 Habilidades de Rol.
- **`redChromeCargoData.ts`**: Datos canónicos de la misión oficial Red Chrome Cargo CEMK 2077.
- **`systemDocsAndChangelogData.ts`**: Base de datos de versiones (`v1.0.0` – `v3.5.0`), inventario y arquitectura.

### 5. `src/features/` — Módulos de Interfaz Táctica
- **`combat/` (`CombatHudView.tsx`)**: HUD táctico de combate, selector de DVs y dados.
- **`sheet/` (`StreetLabView.tsx`)**: Ficha interactiva completa, vitals y roster de edgerunners.
- **`creator/` (`CharacterCreatorWizard.tsx`)**: Asistente guiado de 6 pasos para creación de PJs.
- **`cyberware/` (`CyberwareRipperdocView.tsx`)**: Ripperdoc 2077 con maniquí anatómico en A-Pose.
- **`netroles/` (`NetAndRolesDeckView.tsx`)**: Simulador NET 2045, Quickhacks 2077, garaje y 10 roles.
- **`compendium/` (`CompendiumView.tsx`)**: Compendio de 391 ítems y 8 sistemas de reglas de expansiones.
- **`packs/` (`DataPacksView.tsx`)**: Gestor de paquetes `.cprpack` estilo COMP/CON.
- **`gm/` (`FixerDeckView.tsx`, `EnemiesCompendiumPanel.tsx`)**: Consola del GM con PIN y bestiario.
- **`oneshot/` (`RedChromeCargoView.tsx`)**: Centro de mando táctico de Red Chrome Cargo CEMK 2077.
- **`docs/` (`SystemChangelogAndDocsView.tsx`)**: Portal in-app de documentación e historial de versiones.
- **`layout/` (`TopHudBar.tsx`)**: Barra superior persistente con vitals y selector de vistas.
- **`rules/` (`RulesCheatSheetDrawer.tsx`)**: Drawer deslizante con machete de reglas de mesa.

---

## 🛠️ Scripts y Flujo de Desarrollo

Todos los comandos deben ejecutarse dentro del directorio `frontend/`:

### 1. Servidor de Desarrollo Local (Vite HMR)
```bash
npm run dev
```
Inicia el servidor de desarrollo local con recarga rápida de módulos (HMR) en `http://localhost:5173/`.

### 2. Linter Ultrarrápido (Oxlint)
```bash
npx oxlint
```
Ejecuta el linter de Rust `oxlint` sobre todos los archivos TypeScript y TSX del frontend para verificar reglas de Hooks, pureza, variables no utilizadas y estándares de código sin demoras.

### 3. Compilación de Producción & Comprobación de Tipos
```bash
npm run build
```
Ejecuta primero `tsc -b` para verificar la conformidad estricta de tipos de TypeScript y luego `vite build` para empaquetar los assets optimizados en `frontend/dist/`.

### 4. Vista Previa de la Compilación
```bash
npm run preview
```
Sirve localmente el directorio compilado `dist/` para probar la versión de producción antes de desplegar.
