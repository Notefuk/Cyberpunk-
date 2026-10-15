# CPR OMNI-DECK // System Architecture, Dependency Graph & Master Changelog

> **DOCUMENT PURPOSE**: This document serves as the single source of truth for the project's technical architecture, component dependency chains, and detailed version evolution. It is explicitly authored to be read and understood by human developers and future Large Language Models (LLMs such as Claude, ChatGPT, etc.) so that any future modification respects the underlying system mechanics without accidental regressions.

---

## 🤖 Instructions for Future AI Models (Claude, ChatGPT, etc.)
When tasked with modifying, refactoring, or extending this repository, **you must read and adhere to the following rules**:

1. **Architecture Decoupling (The COMP/CON Model)**:
   - Never hardcode rules or items into UI views directly.
   - Core static rules and book data reside in `data/` and `src/data/` as modular `.cprpack.json` files and typed TypeScript registry modules (`rangeTables.ts`, `criticalInjuries.ts`, etc.).
   - The UI in `src/App.tsx` and `src/components/` acts as a pure reactive consumer.
2. **System Dependencies & Cascade Effects**:
   - **Range & DV System (`src/data/rangeTables.ts`)**: If you alter distance brackets or weapon classifications, check `getDvForWeapon()` and `executeRoll()` in `App.tsx`. Do NOT change DV values without citing official Cyberpunk RED Core Rulebook (pg. 174).
   - **Weapons & Ammo (`src/App.tsx`)**: The attack trigger consumes ammo (`currentMag`). Autofire consumes 10 bullets. Ensure any weapon modification respects magazine bounds and reload states.
   - **Critical Injuries (`src/data/criticalInjuries.ts`)**: Uses exact 2d6 tables from Core Book (pg. 187-188). If adding new injury tables (e.g. Black Chrome vehicle crits), maintain the `CriticalInjury` interface.
   - **Visual Placeholders (`src/components/ItemVisualPlaceholder.tsx`)**: Every item rendered in combat or compendium must map cleanly to an item type placeholder to preserve the high-end tactile aesthetic.
3. **Always Update This Document**: Whenever you increment a version or modify system mechanics, document your changes in the **Master Version Changelog** below with: *What was changed*, *Files modified*, and *Potential regression areas*.

---

## 🗺️ System Architecture & Data Flow

```
cpr-omni-deck/
├── data/                                 # Raw extracted modular .cprpack JSON bundles
│   └── core-rules.cprpack.json           # Extracted Core Rulebook catalog
├── scripts/                              # Isolated Python extractors using pypdf
│   ├── extract_core_pack.py              # Ingests Core Rulebook PDF into JSON
│   └── find_sections.py                  # Bookmark and outline inspector
├── frontend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── core-rules.cprpack.json   # Frontend active copy of core data
│   │   │   ├── rangeTables.ts            # Official Ranged & Autofire DV matrices
│   │   │   └── criticalInjuries.ts       # Official 2d6 Head & Body injury tables
│   │   ├── components/
│   │   │   └── ItemVisualPlaceholder.tsx # High-tech SVG/Lucide visual frames
│   │   ├── App.tsx                       # Unified Tactical Command Deck
│   │   ├── index.css                     # Chamfered corner styles & design tokens
│   │   └── main.tsx                      # Vite React entry point
│   ├── index.html                        # Google Fonts (Rajdhani, Inter, JetBrains Mono)
│   └── vite.config.ts                    # Vite config with Tailwind CSS v4
├── CHANGELOG_AND_ARCHITECTURE.md         # THIS DOCUMENT
└── CONTENT_CHECKLIST.md                  # Granular rulebook adaptation tracking
```

---

## 🏗️ Planned Subsystem Specifications (For Future LLM Implementation)

### 1. Era Rules Switcher: RED (2045) vs CEMK (2077)
* **File Target**: `src/data/eraRules.ts` & state `era: '2045' | '2077'`
* **Rules Matrix**:
  - `2045 (Time of the RED)`: Scarcity economy (Night Markets), physical Cyberdecks with interface cables, traditional humanity loss with therapy sessions.
  - `2077 (Edgerunners Mission Kit)`: Standard Neuroport installed on all characters (contains integrated Agent, Biomonitor, Virtu HUD, chipware sockets). Quickhacking replaces netrunning in combat. Weapons gain Power (ricochet), Tech (cover penetration), or Smart (tracking) traits.
* **UI Behavior**: When toggling between `2045` and `2077`, the inventory and combat deck conditionally display either Cyberdeck Programs or Quickhack RAM decks.

### 2. Economy & Transaction Ledger (€$)
* **File Target**: `src/data/economy.ts`
* **Schema**:
  ```ts
  interface Transaction {
    id: string;
    timestamp: string;
    description: string; // e.g. "Pago de Falco por el trabajo de la chaqueta"
    amount: number;      // positive for income, negative for expense
    category: 'gig' | 'market' | 'lifestyle' | 'medical' | 'bribe';
  }
  ```
* **UI Behavior**: A clean slide-over wallet that tracks total balance, quick "+ Pay" / "- Expense" modal with pre-filled gig templates, and lifestyle maintenance deductions.

### 3. Inventory & Carry Capacity (ENC)
* **File Target**: `src/data/inventory.ts`
* **Mechanics**: Max Carry Capacity = `BODY * 10` kg / lbs. Overencumbrance inflicts -2 to MOVE, DEX, and REF.
* **Slots**: Equipped (Hands, Quick-draw holster), Backpack, Stash (Safehouse/Apartment).

### 4. Street Drugs & Addiction System
* **File Target**: `src/data/drugs.ts`
* **Mechanics**: Duration counter in combat turns / hours. Automatic addiction check (`WILL + 1d10` vs Drug DV). Active buffs (e.g. Black Lace ignores Serious Wound penalties; Synthcoke grants +1 REF) and withdrawal penalties (-2 to all actions when craving).

### 5. Night City Weather & Environmental Hazards
* **File Target**: `src/data/weather.ts`
* **Mechanics**: 
  - Acid Rain: Deals 1 damage to armor SP every 10 min without protective gear.
  - Dust Storm: Target ranges beyond 12m suffer a +2 DV penalty.
  - Blood Red Sky: Visual impairment for snipers (DVs over 25m increase by 2).

### 6. Role-Specific Automation & Lawman/Exec Spawners
* **File Target**: `src/data/roleAbilities.ts`
* **Lawman Backup**: Button to summon backup based on Lawman Rank. Immediately spawns full statblocks into the combat tracker:
  - Ranks 1-4: 2 Patrol Officers (SP 11, Heavy Pistols)
  - Ranks 5-7: 2 Deputies / Detectives (SP 11, Shotguns)
  - Ranks 8-9: 4 SWAT Officers (SP 13, Assault Rifles)
  - Rank 10: 4 Max-Tac Operatives (SP 15 Flak, Sandevistan, Heavy Tech Weapons)
* **Exec Teamwork**: Preloaded company subordinates (Bodyguard, Chauffeur, Netrunner, Technician).
* **Solo Combat Awareness**: Point pool allocator at initiative time (Damage Absorb, Precision Attack, Spot Weakness).
* **Tech Maker**: Fabrication & upgrade timers with calculated DVs.

### 7. Preloaded NPC & Canon Boss Library
* **File Target**: `src/data/npcs.ts`
* **Coverage**: Full combat cards for Adam Smasher, Edgerunners crew (David Martinez, Lucy, Rebecca, Maine, Falco), Danger Gal Dossier factions (NCPD, Maelstrom, Tyger Claws, Arasaka, Militech), and generic street mooks.
* **1-Click Spawn**: Spawns directly into the GM encounter tracker with full HP, armor, weapons, and AI tactics.

### 8. Cyberpunk 2077-Style Anatomical Cyberware Mannequin
* **File Target**: `src/components/CyberwareMannequin.tsx`
* **Design**: High-tech neutral anatomical wireframe silhouette. Clickable interactive nodes:
  - Frontal Cortex / Operating System (Cyberdeck, Sandevistan, Kerenzikov)
  - Ocular System (Cybereyes L/R)
  - Audio System (Cyberaudio)
  - Circulatory System (Biomonitor, Blood Pump)
  - Nervous System (Reflex Co-processor)
  - Integumentary System (Subdermal Armor, Skinweave)
  - Skeleton (Linear Frame Sigma/Beta)
  - Arms (Gorilla Arms, Mantis Blades, Monowire, Pop-up Gun)
  - Legs (Jump Boosters)
* Clicking a node opens a slide-over showing installed chrome, option slots, humanity loss, and medical installation requirements.

### 9. 2077 Quickhacks & Cyberdeck Deck
* **File Target**: `src/data/quickhacks.ts` & `src/components/QuickhackDeck.tsx`
* **Catalog**: Short Circuit, Overheat, Cyberware Malfunction, Synapse Burnout, Reboot Optics, Weapon Glitch, Ping, Memory Wipe, Suicide, Cyberpsychosis.
* **UI**: RAM meter bar (Available vs Max RAM), RAM cost per hack, upload time, and cooldown tracker.

### 10. Universal Character Sheet Importer
* **File Target**: `src/utils/sheetImporter.ts`
* **Supported Formats**:
  - Official Companion App share codes / JSON export.
  - Standard CPR Omni-Deck JSON schema.
  - Fillable PDF character sheet extractor (reads form field values: `STAT_*`, `SKILL_*`, `ARMOR_*`).
* **Validation**: Validates required fields, calculates derived values (HP, Humanity, SP), and outputs friendly error messages if fields are missing.

---

## 📜 Master Version Changelog

### [v1.2.0] - 2026-10-15
* **Category**: Visual Hierarchy & Rule Mechanics Expansion
* **Files Modified**:
  - `frontend/src/components/ItemVisualPlaceholder.tsx` (CREATED)
  - `frontend/src/data/criticalInjuries.ts` (CREATED)
  - `frontend/src/App.tsx`
  - `CHANGELOG_AND_ARCHITECTURE.md` (CREATED)
  - `CONTENT_CHECKLIST.md` (CREATED)
* **What Changed**:
  1. Created `ItemVisualPlaceholder.tsx` featuring tactical military viewfinder frames (`chamfer-card` thumbnails) with category badges (`[HG]`, `[RF]`, `[SMG]`, `[SG]`, `[CQC]`, `[HVY]`, `[BODY]`, `[HEAD]`, `[CYBER]`, `[NET]`).
  2. Implemented the official Cyberpunk RED Critical Injuries tables (pg. 187-188) in `criticalInjuries.ts` for both Head and Body, including roll index (2-12), rule penalties, quick fixes, and clinic/hospital surgical treatments.
  3. Embedded an interactive Critical Injuries manager into the `Active Combat` deck with 1-click `[ + CRÍTICO CABEZA (2d6) ]` and `[ + CRÍTICO CUERPO (2d6) ]` rollers.
  4. Assigned dynamic trauma icons: cracked skull (`Skull`), brain trauma (`Brain`), eye trauma (`Eye`), broken bone (`Bone`), and chest puncture (`HeartCrack`).
  5. Added a `[ TRATAR / CURAR ]` button to instantly clear healed injuries.
  6. Connected visual placeholders across all weapons, armor, cyberware, and compendium catalog cards.
* **Potential Regression / Dependency Warnings**:
  - Active injuries display in the top command bar. If the injury ID format is altered, ensure `removeInjury(id)` filters properly.

---

### [v1.1.5] - 2026-10-15
* **Category**: Combat Mechanics & Range Engine
* **Files Modified**:
  - `frontend/src/data/rangeTables.ts` (CREATED)
  - `frontend/src/App.tsx`
* **What Changed**:
  1. Implemented the official Ranged Weapon Range Table from Core Rulebook (pg. 174).
  2. Defined 8 standard meter brackets: `0-6m`, `7-12m`, `13-25m`, `26-50m`, `51-100m`, `101-200m`, `201-400m`, `401-800m`.
  3. Added weapon range profiles for Pistol, SMG, Shotgun Slug, Assault Rifle, Sniper Rifle, Bows, Grenade Launcher, and Rocket Launcher.
  4. Added the official **Autofire Range Table** (SMG max multiplier 3, Assault Rifle max multiplier 4).
  5. Added an interactive Global Distance Selector and per-weapon Distance Ladders on each weapon card with a green `★ ÓPTIMO` highlight on the weapon's sweet spot.
  6. Added an Autofire mode toggle that expends 10 bullets and calculates `(Total - DV) * 2d6` damage multiplier.
* **Potential Regression / Dependency Warnings**:
  - Melee weapons do not use distance brackets; they bypass `rangeTables.ts` and roll against defender evasion DV. Do not enforce range brackets on `Melee` items.

---

### [v1.1.0] - 2026-10-15
* **Category**: Visual Styling & UX Overhaul
* **Files Modified**:
  - `frontend/index.html`
  - `frontend/src/index.css`
  - `frontend/src/App.tsx`
* **What Changed**:
  1. Replaced generic prototype styles with bespoke COMP/CON and Cyberpunk RED military aesthetic.
  2. Integrated Google Fonts: `Rajdhani` (tech/numbers/headers), `Inter` (readable UI body), and `JetBrains Mono` (code/stats).
  3. Added chamfered corner clipping (`clip-path: polygon(...)`) to all cards and buttons.
  4. Enforced universal `cursor: pointer` on all interactive elements with mechanical active press states (`active:scale-95 active:translate-y-[1px]`).
  5. Created an interactive magazine counter for ranged weapons with real-time bullet consumption and auto-switching `RELOAD MAG` button.
  6. Reorganized combat into clear vitals, armor ablation, weapon deck, and tactical dice log columns.

---

### [v1.0.0] - 2026-10-15
* **Category**: Project Scaffolding & Data Pipeline Foundation
* **Files Modified**:
  - `scripts/find_sections.py` (CREATED)
  - `scripts/extract_core_pack.py` (CREATED)
  - `data/core-rules.cprpack.json` (CREATED)
  - `Dockerfile`, `docker-compose.yml`, `start_app.bat`, `run_extractors.bat` (CREATED)
  - `frontend/` (Vite + React + TypeScript + Tailwind CSS initialized)
* **What Changed**:
  1. Built isolated sandbox in `C:\Users\TeseoHeracles\cpr-omni-deck` to avoid Windows Defender Controlled Folder Access restrictions.
  2. Setup isolated Python `.venv` with `pypdf`.
  3. Built initial PDF extractor targeting `Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf` and generated `core-rules.cprpack.json`.
  4. Initialized local Git repository with 5 structured commits.
