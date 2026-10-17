# CPR OMNI-DECK // Lista Maestra de Adaptación y Contenido (Checklist)

> **PROPÓSITO**: Esta lista permite verificar de un solo vistazo el progreso de adaptación de las reglas, mecánicas y libros oficiales de tu biblioteca de PDFs a la aplicación, organizada por **dependencias arquitectónicas en 5 Sprints**.

**Leyenda de Estados:**
* `[x] COMPLETADO`: Implementado en código real, validado con las reglas oficiales y en funcionamiento en la interfaz.
* `[~] EN PROGRESO`: Estructura o datos parciales cargados, requiere más pulido o módulos secundarios.
* `[ ] PENDIENTE`: En cola de desarrollo planificado para ese Sprint.

---

## 🏛️ SPRINT 0: Cimientos, Ficha Real, Persistencia, Motor Matemático y Catálogo Core [COMPLETADO]

### 1. Motor de Reglas & Matemáticas Canónicas (`characterEngine.ts` & `combatEngine.ts`)
- [x] **Cálculo Canónico de Puntos de Golpe (HP)**:
  - Fórmula oficial: `10 + 5 * ceil((BODY + WILL) / 2)`.
- [x] **Umbral de Herida Grave (Seriously Wounded)**:
  - Activación automática al llegar a $\le \text{ceil}(\text{MaxHP} / 2)$.
  - Aplica penalizador global de `-2` a todas las acciones con `MOVE` mínimo de 1.
- [x] **Humanidad y Empatía**:
  - `MaxHumanity = EMP * 10`. Impacto reactivo al instalar/desinstalar ciberware.
- [x] **Pool de Suerte Táctil (LUCK)**:
  - Barra de pips interactiva para gastar en tiradas críticas con botón de restauración completa.
- [x] **Tirada de Ataque en 2 Clics**:
  - Tirada de impacto desacoplada: `STAT + Skill + 1d10`.
  - Explosión crítica en `10` (`+1d10` adicional acumulativo).
  - Pifia crítica en `1` (`-1d10` restado).
- [x] **Tirada de Daño Independiente (`Xd6`)**:
  - Daño separado del acierto. Detección automática de dos o más `6`s para infligir Herida Crítica (+5 daño directo a HP).
- [x] **Ablación de Blindaje en Tiempo Real**:
  - Comparación de daño contra `SP` actual de la localización (Cabeza/Cuerpo).
  - Daño excedente penetra a HP; el blindaje se reduce en 1 punto (o 2 con munición perforante).
- [x] **Matriz de DVs por Metro y Autofire (`rangeTables.ts`)**:
  - 8 brackets de distancia estándar (`0-6m`, `7-12m`, `13-25m`, `26-50m`, `51-100m`, `101-200m`, `201-400m`, `401-800m`).
  - Sweet spot óptimo resaltado en verde (`★ ÓPTIMO`).
  - Modo Autofire: consume 10 balas, compara con tabla de Autofire y multiplica `(Margen de Acierto) * 2d6` hasta el tope del arma (x3 o x4).
  - Fuego Supresivo (Suppressive Fire) con zona de 6x6m.

### 2. Ficha de Personaje & Gestión de Roster (`StreetLabView.tsx` & `useCharacterStore.ts`)
- [x] **10 Estadísticas Primarias (STATs)**: INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP con contadores `[+]` / `[-]`.
- [x] **16 Habilidades de Combate & Soporte**: Armas cortas, armas largas, armas pesadas, artes marciales, combate cuerpo a cuerpo, esquiva, primeros auxilios, etc.
- [x] **Fichas Predefinidas de Alto Nivel**: `V (Valerie)` (Solo Rango 4) y `Kiwi` (Netrunner Rango 4).
- [x] **Persistencia en LocalStorage (Zustand)**: Fichas, equipo y heridas persisten automáticamente en el navegador.
- [x] **Gestor de Roster**: Creación de nuevos edgerunners, cambio de personaje activo y borrado seguro.
- [x] **Heridas Críticas Interactivas (2d6)**:
  - Tablas completas de Cabeza y Cuerpo de las páginas 187-188 del Core Book.
  - Generador con 1 clic, estados `[ TRATAR ]` y `[ CURAR ]` con iconos temáticos (cráneo, cerebro, ojo, hueso, etc.).

### 3. Catálogo Canónico Maestro (272 Ítems Oficiales en `core-rules.cprpack.json`)
- [x] **Armas (66 ítems)**:
  - Armas cuerpo a cuerpo ligeras, medias, pesadas y muy pesadas.
  - Armas a distancia estándar (Pistolas, Subfusiles, Escopetas, Fusiles, Francotirador, Arcos, Lanzagranadas, Lanzacohetes).
  - Variantes oficiales de calidad y marca (Dai Lung, Militech Avenger, Arasaka Minami 10, Nomad Long Rifle, GunMart, etc.).
  - Las 15 Armas Exóticas del Core: Air Pistol, Battleglove, Constitution Arms Hurricane, Dartgun, Flamethrower, Kendachi Mono-Three, Malorian Arms 3516, Microwaver, Militech Cowboy U-56, Rhinemetall EMG-86 Railgun, Shrieker, SlamDance Inc. Fang, Stun Baton, Stun Gun, Tsunami Arms Helix.
- [x] **Blindajes (10 ítems)**:
  - Leathers, Kevlar, Light Armorjack, Bodyweight Suit, Medium Armorjack, Heavy Armorjack, Flak, Metalgear, Bulletproof Shield, Radiation Suit.
- [x] **Accesorios de Armas (10 ítems)**:
  - Bayoneta, Cargador Tambor, Cargador Extendido, Lanzagranadas acoplado, Chasis pesado, Mira Nocturna IR, Escopeta acoplada, Enlace Smartgun, Mira de Francotirador, Silenciador.
- [x] **Municiones (13 tipos)**:
  - Básica, Perforante, Biotoxina, EMP, Expansiva, Granada Aturdidora, Incendiaria, Veneno, Goma, Sueño, Smart, Humo, Gas Lacrimógeno.
- [x] **Ciberware (96 implantes)**:
  - Cobertura completa de las 7 categorías: Fashionware, Neuralware, Cyberoptics, Cyberaudio, Internal Body, External Body, Cyberlimbs y Borgware.
- [x] **Drogas Callejeras & Fármacos (9 tipos)**:
  - Black Lace, Blue Glass, Boost, Smash, Synthcoke, Timewarp, Rapidetox, Speedheal, Stim con duraciones, efectos primarios, secundarios y DVs de adicción.
- [x] **Equipo General (41 ítems)**:
  - Agent, Airhypo, Máscara anti-smog, Analizador químico, Cyberdecks, Gafas inteligentes, Traje de radiación, Herramientas, etc.
- [x] **Programas de Netrunning & Black ICE (27 programas)**:
  - Boosters (Eraser, See Ya, Speedy Gonzalvez, Worm), Defenders (Armor, Flak, Shield), Attackers (Banhammer, Sword, DeckKRASH, Hellbolt, Nervescrub, Poison Flatline, Superglue, Vrizzbolt) y Black ICE (Asp, Giant, Hellhound, Kraken, Liche, Raven, Scorpion, Skunk, Wisp, Dragon, Killer, Sabertooth).

### 4. Vistas Modulares del Sistema
- [x] **`TopHudBar.tsx`**: Barra superior táctica con vitals en tiempo real, selector de edgerunner y pool de suerte.
- [x] **`CombatHudView.tsx`**: Interfaz de combate con selector de distancia, cargadores interactivos y registro de dados.
- [x] **`CompendiumView.tsx`**: Compendio modular de 8 categorías con búsqueda, botones de equipamiento directo de armas, blindajes cabeza/cuerpo e instalación de ciberware.
- [x] **`DataPacksView.tsx`**: Gestor de paquetes .cprpack estilo COMP/CON con conteos reales y vista previa de expansiones.
- [x] **`scripts/inspect_pdf_pages.py`**: Inspector CLI de páginas en UTF-8 limpio para PDFs de reglas.
- [x] **`scripts/extract_core_pack.py`**: Extractor verificado contra el PDF oficial de 458 páginas.
- [x] **`.agent/skills/cpr-pdf-extractor/SKILL.md`**: Skill documentada para agentes de IA.

---

## 📦 SPRINT 1: Utilidades de Mesa - Cheat Sheet, Economía €$ e Inventario [COMPLETADO]
- [x] **Machete de Reglas Rápidas (`rulesCheatSheet.ts` & `RulesCheatSheetDrawer.tsx`)**:
  - Reglas de Grappling, Choking (`BODY * 2` de daño directo ignorando armadura) y Lanzamiento de enemigos.
  - Tabla de Coberturas y Objetos destructibles con SP/HP (Puerta de coche, Muro de hormigón, Mampara de pladur, Escudo anti-disturbios).
  - Reglas de Asfixia, Caídas, Fuego y Ahogamiento.
- [x] **Gestor de Inventario & Cartera / Sobrepeso Situacional (`StreetLabView.tsx` & `characterEngine.ts`)**:
  - Seguimiento de Eurodólares (€$) con registro de ingresos y gastos de Night Market.
  - Capacidad de carga según BODY con toggle de penalización por sobrepeso situacional (-2 REF/DEX/MOVE).
  - Control de reservas de munición comprada en lotes de 10.
- [x] **Modo Director de Juego & Bloqueo por PIN (`FixerDeckView.tsx`)**:
  - Alternador de rol: Vista Jugador (restringida a su personaje) vs Consola GM Fixer (acceso a todos los edgerunners y notas ocultas).
  - Protección de modificaciones con contraseña o PIN local (`0000` por defecto).

---

## 📚 SPRINT 2: Expansión de Libros PDF y Reglas 2077 vs 2045 [PENDIENTE]
- [ ] **Extracción de `Black Chrome Tech & Style Guide`**:
  - 170+ ítems de catálogo de lujo de Night City.
  - Reglas completas de vehículos terrestres y aéreos con SDP, asientos y velocidad de combate.
  - Armas exóticas especializadas (Rostović, SovOil, Faisal's Customs).
  - Linear Frames avanzados (Fūma Kotarō, Vermilion, SWAT).
- [ ] **Extracción de `Cyberpunk Edgerunners Mission Kit (CEMK 2077)`**:
  - Reglas de la Era 2077: Neuroport universal (Agente + Biomonitor + Chipware integrado).
  - Conversión de armas 2077: *Power* (rebotes), *Tech* (perforación de cobertura) y *Smart* (guiado).
  - Mecánicas de Ciberpsicosis y Estrés 2077.
- [ ] **Extracción de `Danger Gal Dossier`**:
  - Perfiles de PNJs, mooks y jefes listos para combate.
  - Equipo encubierto y de espionaje corporativo.
- [ ] **Extracción de `Interface RED (Vol 1-3) & DLCs Oficiales`**:
  - Hornet's Pharmacy (aditivos químicos, dispersión osmótica y fármacos experimentales).
  - Reglas completas de Full Body Conversion (FBC) y chasis cyborg.
- [ ] **Selector Global de Era (2045 vs 2077)**:
  - Ajuste dinámico de interfaz y reglas disponibles según la época seleccionada.

---

## 🧠 SPRINT 3: Sistemas Profundos - Maniquí Cyberware, Netrunning 2045, Quickhacks y Roles [PENDIENTE]
- [x] **Maniquí Anatómico de Ciberware & Menú Ripperdoc (`CyberwareRipperdocView.tsx`)**:
  - Silueta holográfica en A-Pose con flechas conectoras hacia las 8 zonas corporales + Fashionware.
  - Ranuras de opción visuales estilo 2077 con ilustraciones vectoriales, telemetría de Humanidad/SP e instalador Ripperdoc con tirada Xd6.
- [ ] **Simulador de Pisos de Red 2045 (`NetArchitectureRunner.tsx`)**:
  - Escalera virtual de pisos de red: Archivos, Nodos de Control, Contraseñas, Black ICE.
  - Contador de Acciones de Red (Net Actions) basado en el Rango de Interfaz.
  - Combate Netrunner vs Black ICE con rez/derez de programas.
- [ ] **Sistema de Quickhacking 2077 (`QuickhacksDeck.tsx`)**:
  - Hackeo inalámbrico en combate utilizando pool de RAM.
  - Quickhacks ofensivos y de control (Short Circuit, Cyberware Malfunction, Overheat).
- [ ] **Habilidades de Rol Específicas**:
  - Solos (Combat Awareness), Medtechs (Farmacia/Cirugía/Criogenia), Techs (Maker), Nomads (Moto).

---

## 🎲 SPRINT 4: VTT Táctico, Clima, Homebrew y Audio/VFX [PENDIENTE]
- [ ] **Mini-VTT Táctico (`MiniVTT.tsx`)**:
  - Rejilla táctica 2x2m interactiva en canvas/SVG.
  - Colocación de tokens de edgerunners y enemigos.
  - Obstáculos y coberturas destructibles con SP/HP trackeable.
  - Regla de medición de distancias vinculada directamente a la tabla de DVs del arma activa.
- [ ] **Generador de Condiciones Atmosféricas y Clima de Night City**:
  - Lluvia ácida, tormenta de smog rojo, calor radiactivo y sus penalizadores en combate.
- [ ] **Creador Universal de Homebrew (`HomebrewBuilderModal.tsx`)**:
  - Formulario para diseñar armas, ciberware, drogas y blindajes caseros.
  - Algoritmo de conversión oficial de Cyberpunk 2020 a RED (*Old Guns Never Die*).
- [ ] **Efectos Táctiles de Audio & Visuales (SFX / VFX)**:
  - Clics metálicos de recarga, detonaciones procedurales y zumbidos de Sandevistan vía Web Audio API.
  - Vignetting rojo al caer en Herida Grave y glitch visual ante daño de Netrunning.
