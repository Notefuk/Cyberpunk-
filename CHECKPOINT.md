# CHECKPOINT — Estado de trabajo en curso

> Archivo compartido entre Claude Code y Antigravity. **Léelo primero** al abrir una sesión nueva o después de compactar contexto.
> **Actualízalo** al terminar cada tarea, antes de compactar contexto y antes de cambiar de herramienta.
> Toda actualización va firmada: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
> Es corto a propósito. Qué es cada documento: `docs/INDEX.md`. Historia de versiones: `CHANGELOG_AND_ARCHITECTURE.md`. Estado de los planes: `docs/plans/README.md`.
> Protocolo de cowork (firma, inicio y cierre de sesión): `docs/COWORK.md`. Al cerrar sesión se reemplaza la sección **Traspaso**.
> **Regla**: "En curso" lista solo trabajo abierto. Lo terminado sale de acá; queda en el CHANGELOG.

**Última actualización**: [Claude Code · 2026-11-25] plan 35 (Corgo's 77, homebrew con sello) en curso en la rama `claude/plan35-corgo77`, worktree `C:\Users\TeseoHeracles\cpr-wt-plan35`. Antes: [Claude Code · 2026-11-21] v5.47.1 en `main` (PR #102), en la beta (gh-pages 3db2ed1) y en prod (Firebase Hosting); plan 29 cerrado

**Plan activo (2026-11-25)**: plan 35, `docs/plans/plan35-drones-corgo77.md`, v5.48.0.
- Hecho:
  - Generador con fichas de máquina (`machine`, `combatNumber`, `homebrew`), tipos, `corgo77.json` (33 fichas) y `corgo77.ts` regenerado.
  - Sello en el bestiario, el Fixer y Data Packs; `enemyInitiativeBase` (las máquinas tiran iniciativa con su CN).
  - Test `corgo77.test.ts`, docs.
  - tsc, 851 tests y build OK. Probado en el navegador (dev `plan35-dev`, puerto 5180): filtro con 33 fichas y sello, ficha del Chimera con la fila de máquina y nota de licencia, Griffin al encuentro con 20/20 e iniciativa 16 (CN 14).
- Dudas de la transcripción, sin preguntar todavía:
  - Las ametralladoras del PDF dicen "Damage N/A", así que se cargaron con 2d6 de Autofire.
  - Varios humanoides no traen arma de fuego.
  - Hay cargadores con más balas que su capacidad, y se dejaron como los imprime el PDF.
  - Los tiers los elegimos nosotros.
  - Todo está anotado en `notes` y `doubts` del JSON.
- Falta: push, PR, beta y prod (cada uno con su OK).
- Push, beta y prod: cada uno con su OK.
- El plan 34 (Night Market Index) sigue reservado y sin empezar.

**Versión de la app**: v5.47.0 en `main` @ ef9cf3a (PR #101) y en la beta (gh-pages ab4b155, bundle `main-a28MoSCF.js`; el bundle principal ahora se llama `main-*` porque hay varias entradas). En Firebase prod (hosting `index-C1snalmV.js`) sigue la v5.45.0 [Claude Code · 2026-11-21].

**Plan activo**: plan 29 (`docs/plans/plan29-owlbear-coberturas.md`): v5.46.0 y v5.47.0 en `main` (PR #101) y en la beta. Desvío pedido por Giuliano: v5.47.1 saca la extensión del Omni-Deck a su propio proyecto (`C:\Users\TeseoHeracles\cpr-owlbear-coberturas`, repo https://github.com/Notefuk/cpr-owlbear-coberturas, publicada en `https://notefuk.github.io/cpr-owlbear-coberturas/manifest.json`). Perfil de Owlbear de Giuliano ya apunta a la URL publicada (probado en The Spry Tag: panel y menú cargan). v5.47.1 mergeada en `main` (PR #102, 7d3584a) [Claude Code · 2026-11-21]. En la beta desde gh-pages 3db2ed1 (sin `/owlbear/`, que ahora da 404). En prod desde el 2026-11-21 (Firebase Hosting `cpr-omni-deck-prod`, build de main 7d3584a; sin reglas de Firestore). Plan 29 cerrado [Claude Code · 2026-11-21]. Después sigue el plan 34 [Claude Code · 2026-11-21].

## Traspaso
- Cierra: [Claude Code · 2026-11-13]
- Rama y último commit: `main` @ 8dfe717 (PR #97, squash del plan 33). Este checkpoint vive en `claude/checkpoint-post-97`. Pusheada: no — falta OK. [Claude Code · 2026-11-14]
- A medias: nada. tsc, 806 tests y build pasan en v5.40.0.
- Siguiente paso exacto: la v5.44.0 está en `main`, la beta (gh-pages 337cc88), las reglas de Firestore de prod y prod hosting (`index-CBo7sMP1.js`) [Claude Code · 2026-11-14]. Lo próximo es el plan de equipo y vehículos (Cutiemas, Vehiclemas, VA-11 Hall-A): planificar y preguntar antes de codear.
- Notas: el creador guiado está en `features/gm/GuidedNpcCreator.tsx` y las plantillas en `data/npcCreationGuidelines.ts` (los puntos de STAT no cuentan LUCK). Erratas del libro guardadas tal cual: Flenser SW 13, Stringer Death Save 4; Drop y Paddles: la lista de pp.168-170 difiere de la ficha, se usa la ficha. Hay un solo pack: `frontend/src/data/core-rules.cprpack.json` (770 ítems). `scripts/extract_core_pack.py <salida.json>` escribe aparte (genera 405 ítems) y se niega a pisar el pack de la app; lo nuevo se copia a mano.
- Preguntas abiertas para Giuliano: ninguna.

## En curso (a cargo)
- [Claude Code · 2026-11-20] **Plan 29** (`docs/plans/plan29-owlbear-coberturas.md`), rama `claude/plan29-owlbear-coberturas` sobre `main` bf2af23, worktree `C:\Users\TeseoHeracles\cpr-wt-plan29` (con su propio `node_modules`; dev server `plan29-dev`, puerto 5179, en el `.claude/launch.json` de la carpeta de PDFs).
  - Hecho: v5.46.0. `data/coverTable.ts` (Core p.182-183, shield p.350), `engine/cover.ts` + `engine/__tests__/cover.test.ts`, `COVER_HP_TABLE` y `COVER_RULES_EXPLANATION` en `data/rulesCheatSheet.ts` derivados de la tabla, presets del HUD (`equipShieldPreset` y `equipCoverPreset` en `CombatHudView.tsx`, clave local `cpr_shield_cover_sdp_v2`). Registro en `docs/canon-audit/v5.46.0-cobertura.md`. tsc, 845 tests y build OK; probado en el navegador.
  - Hecho: v5.47.0 [Claude Code · 2026-11-21]. Extensión probada en la sala "The Spry Tag" de Giuliano con dos cuentas: GM (su cuenta, "Browser 2" en Claude in Chrome) y jugador "Silver Dragon" (cuenta 1swordhie, "Browser 1"). Agregada a su perfil desde `http://localhost:5179/owlbear/manifest.json` y activada en esa sala. Probado: marcar Concrete gruesa, 17 de daño deja 8/25, otros 17 la destruyen y avisa "Sobran 9", Restaurar, panel, el jugador ve solo "Aplicar daño" y su daño de 10 deja 15/25 en las dos pestañas, el jugador no ve "Cobertura" en un token sin marcar, borrar el objeto borra la etiqueta. Los rectángulos de prueba se borraron. Docs de versión y nota de instalación en `README.md` hechos.
    - Código en `frontend/src/owlbear/` (`coverItem.ts`, `background.ts`, `CoverMenu.tsx`, `CoverPanel.tsx`, `useObr.ts`, `owlbear.css`), páginas en `frontend/owlbear/*.html`, ícono en `frontend/public/owlbear/`, CORS de `/owlbear/**` en `firebase.json`, `@owlbear-rodeo/sdk` 3.1.0.
    - El manifest lo genera el plugin `owlbearManifest` de `vite.config.ts`: Owlbear no acepta rutas relativas ("Invalid URL"); van con `/owlbear/` (dev y prod) o `/Cyberpunk-/owlbear/` (beta).
    - Chrome pide permiso de red local para que owlbear.rodeo lea `localhost` (solo en la prueba local).
    - El daño de un jugador va por `OBR.broadcast` y lo aplica el cliente del GM (con id para no repetir).
  - Desvío v5.47.1 [Claude Code · 2026-11-21]: Giuliano pidió separar la extensión en su propio proyecto. Hecho: proyecto `C:\Users\TeseoHeracles\cpr-owlbear-coberturas` (build, 11 tests, README con la tabla de sincronía; manifest en `/` local y `/cpr-owlbear-coberturas/` para GitHub Pages con `npm run build:pages`), y del Omni-Deck se borró todo lo de Owlbear (rama `claude/owlbear-separada`, sobre `claude/docs-pr101`).
  - Siguiente: con OK de Giuliano, (1) ~~PR a `main`~~ hecho: PR #102 mergeado (squash 7d3584a) [Claude Code · 2026-11-21]; (2) ~~crear el repo y publicar~~ hecho [Claude Code · 2026-11-21]: `main` d465721 y `gh-pages` df303cd en `Notefuk/cpr-owlbear-coberturas`, Pages activo y los 5 archivos responden 200 con CORS; (3) ~~URL en el perfil de Owlbear~~ hecho [Claude Code · 2026-11-21]: se quitó la de localhost, se agregó la publicada y se activó en The Spry Tag; (4) ~~beta~~ hecha [Claude Code · 2026-11-21]: gh-pages 3db2ed1, build:beta de main 7d3584a; ~~prod~~ hecho [Claude Code · 2026-11-21]: `deploy --only hosting --project prod` con la v5.47.1; `/owlbear/` da 404 en prod. El deploy a prod quedó frenado antes de subir nada.
- [Claude Code · 2026-11-20] **v5.45.0 DLC Everyday Items**: publicada en `main` (PR #99), la beta y prod. No queda nada pendiente. Este checkpoint vive en `claude/checkpoint-post-99`, sin pushear.
- [Claude Code · 2026-11-14] **Plan 33** (`docs/plans/plan33-going-quiet-tech-civiles.md`). PDFs en `Documents/CP RED TEST ANTIGRAVITY/DLC-Supplements/` (página impresa = índice).
  - Hecho: plan guardado. v5.41.0: ítems `gq-*`, `engine/flashOfLuck.ts` + `FlashOfLuckPanel` (campo `flashOfLuck` en la ficha, `flashOfLuckEnabled` en useCombatStore, `flashOfLuck` en la campaña y en `firestore.rules`), `engine/netStealth.ts` + `NetStealthPanel`. v5.42.0: `data/inventedTechUpgrades.ts` + `features/roles/InventedTechUpgradesPanel.tsx` (en NET & ROLES → rol Tech), campo `inventedUpgrades` en la ficha, etiqueta 🧪 en el Street Lab. v5.43.0: `data/cemkCyberwareEnhancements.ts` + `CyberwareEnhancementsPanel` (Ripperdoc) + `CritChoicePicker` (HUD), campo `cyberwareEnhancements` en la ficha, `ignoreSpBelow7`/`extraAblation` en `calculateIncomingImpact`, arma `monowire-2077`. v5.44.0: `data/enemies-src/everyday-people.json` + `BOOK_SPECS` (20 civiles, `abbreviated`), `enemyStatLabel` ("—"), botón "Civiles" en el bestiario, nivel `civilian` en `npcCreationGuidelines.ts`.
  - Siguiente: nada pendiente del plan 33.
  - Decisiones: civiles abreviados sin inventar STATs; Tech Upgrades solo catálogo y precio; enhancements solo 2077; Flash of Luck apagada, la prende el GM.

## Último trabajo terminado
- [Claude Code · 2026-11-13] Plan 31 cerrado: resto del Interface RED Vol. 5, v5.29.0 a v5.34.0 (PR #91), publicado en la beta, en las reglas de Firestore y en prod. Ramas borradas.
- [Claude Code · 2026-11-13] Plan 30 cerrado: Solo of Fortune 2045 y ACPA, v5.25.0 a v5.28.0 (PR #89), publicado en la beta y en prod.
- [Claude Code · 2026-11-12] v5.21.0 (plan 28 I): pestaña MODO GM (PR #79), publicada en la beta y en prod.
- [Claude Code · 2026-11-11] Plan 27 cerrado con la v5.20.0 (PR #77):
  - pregens del Single Shot Pack con Neuroport;
  - 8 NET;
  - 13 PNJ de IR2 e IR4;
  - aventuras de Halloween;
  - Hardened revisado contra IR2.
  Interface RED 1-4 quedan en ✅ (sin Elflines) y el plan 22 queda cerrado.
- Versiones anteriores: `CHANGELOG_AND_ARCHITECTURE.md`.

## Contexto permanente
- **Método de canon:**
  - Un subagente `cpr-worker` extrae el texto del PDF a un JSON con página, en `docs/plans/work/<plan>/`. Yo lo valido contra el texto y lo cargo; el registro va en `docs/canon-audit/`.
  - pypdf no renderiza. Para diagramas y tablas sirve `extract_text(extraction_mode='layout')`.
  - Página impresa = PDF − 1 en IR1, IR2 e IR4. IR3 es imagen: se citan los DLC sueltos. Going Metal: impresa = PDF + 90.
- **Generadores (no se editan a mano los TS que generan):**
  - `scripts/gen_enemies.py`: de `data/enemies-src/*.json` (core, cemk, hardened, interface-red) a `frontend/src/data/enemies/`. JSON con indent 1.
  - `scripts/gen_gm_tables.py`: tablas del GM.
- **Pack:** las dos copias (`frontend/src/data/` y `data/`) deben quedar idénticas. No correr `scripts/extract_core_pack.py`, que está desincronizado.
- **Decisiones de Giuliano:**
  - Todo canon: borrar lo inventado, sin homebrew. NET Actions según CEMK (hasta 3).
  - [Claude Code · 2026-11-25] Única excepción: los 33 drones y robots de **Corgo's 77 Collection V3** (plan 35). Van con `homebrew: true`, la fuente `homebrew_corgo77` y el sello violeta 🧪 HOMEBREW, visibles y filtrables. Las armas homebrew de ese PDF no entran al catálogo. Cualquier otro homebrew necesita un OK nuevo.
  - Elflines Online queda fuera de alcance.
- **PDFs:** `C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\`, con las carpetas `Core-Rules\`, `Sourcebooks\` (Interface RED 1-4), `DLC-Supplements\` (Hardened en `Hardened-Enemies\`) y `Reference-Aids\`.
- **Publicar:**
  - GitHub CLI: `GH_CONFIG_DIR=.tools/gh-config .tools/gh/bin/gh.exe` (PR con `--squash`).
  - Beta: desde `frontend/`, `npm run build:beta`, después `git init` en `dist`, branch `gh-pages`, push -f y borrar `dist/.git`.
  - Prod: desde `frontend/`, `npm run build` y después `node scripts/firebase-with-jdk.mjs deploy --only hosting --project prod`. Reglas con `--only firestore`, siempre con OK aparte.
- **Dev server:** `.claude/launch.json` (`omni-deck-dev`, puerto 5173).
- **Cobertura con copia en otro proyecto** [Claude Code · 2026-11-21]: `data/coverTable.ts`, `engine/cover.ts` y `engine/__tests__/cover.test.ts` tienen copia en `src/rules/` de la extensión de Owlbear (`C:\Users\TeseoHeracles\cpr-owlbear-coberturas`). Si se cambian valores, nombres o firmas, se cambian en los dos y se corre `npm test` en los dos. No renombrar los `id` de material.

## Próximos pasos
1. Plan 28, v5.22.0: actores guardados.
2. Plan 28, v5.23.0: pedir tiradas, atacar con un actor, dar ítems y notas.
3. Sin plan: libros que quedan en la Biblioteca (⬜ 19, 🟡 3), combate (discrepancias 16-19 y 21-23). Detalle en `PROJECT_STATUS_AND_ROADMAP.md`.

## Notas y bloqueos
- **Seguridad:** `origin` sin token. Push con Git Credential Manager; `gh` con su propio login en `.tools/gh-config`. No volver a pegar tokens en la URL.
- El hook `Stop` solo corre en sesiones abiertas en la carpeta del repo.
