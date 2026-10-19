# CPR OMNI-DECK // Lista Maestra de Adaptación y Contenido (Checklist)

> **PROPÓSITO**: Esta lista permite verificar de un solo vistazo el progreso de adaptación de las reglas, mecánicas y libros oficiales de tu biblioteca de PDFs a la aplicación, organizada por **dependencias arquitectónicas en 6 Fases (v2.0 a v4.0)**.

**Leyenda de Estados:**
* `[x] COMPLETADO`: Implementado en código real, validado con las reglas oficiales y en funcionamiento en la interfaz.
* `[~] EN PROGRESO`: Estructura o datos parciales cargados, requiere más pulido o módulos secundarios.
* `[ ] PENDIENTE`: En cola de desarrollo planificado para esa Fase.

---

## 🏛️ FASE 0 (v2.0 – v2.3): Cimientos, Ficha Real, Persistencia, Motor Matemático y Catálogo Core [COMPLETADO]

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

## 📦 FASE 1 (v2.4 – v2.5): Maniquí Ripperdoc 2077, Machete de Reglas, Economía €$ e Inventario / Consola GM [COMPLETADO]
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

## 📚 FASE 2 (v2.6 – v2.9): Disparos Apuntados, Creador de Personajes Guiado, Biblioteca de Enemigos, Compendio de Reglas Nuevas (FBC/2077) y Expansión de Libros PDF [COMPLETADO]
- [x] **Selector Interactivo de Disparos Apuntados en Combate Activo (`CombatHudView.tsx` & `combatEngine.ts`)**:
  - Penalizador canónico automático de `-8` a la tirada de ataque.
  - Restricción estricta de ROF 1 (armas con ROF 2 o ráfaga limitadas a 1 único disparo al apuntar).
  - Efectos mecánicos automatizados por localización:
    - **Cabeza**: El daño que penetra armadura (`SP`) se multiplica `×2` directo a HP.
    - **Pierna**: Aplica automáticamente estado crítico *Pierna Rota* (`Broken Leg`: `-4 MOVE`, mínimo 1).
    - **Objeto Sostenido (Held Item)**: Provoca Desarme automático (`Disarm`), el objetivo suelta el arma u objeto sostenido.
- [x] **🧙‍♂️ Creador de Personajes Guiado Desde Cero (Wizard Paso a Paso & Onboarding para Novatos) (`CharacterCreatorWizard.tsx` & `characterCreationData.ts`)**:
  - **Los 3 Sistemas Oficiales de Creación + Plantillas 2077**:
    - Soporte completo para las 3 metodologías del Core Rulebook: *Streetrat (Plantillas Rápidas)*, *Edgerunner (Tiradas Rápidas)* y *Complete Package (Compra por Puntos)*.
    - Integración de las plantillas pregeneradas oficiales de la Era 2077 de *Cyberpunk Edgerunners Mission Kit (CEMK 2077)*.
  - **Generador de Lifepath Híbrido (Tirada de Dados o Escritura Libre)**:
    - Tablas completas canónicas: origen cultural, personalidad, estilo de ropa, peinado, detalle afectivo, valores, sentimientos hacia las personas, persona más valorada, posesión más preciada, trasfondo familiar y entorno de crianza.
    - Historial de romances trágicos y amigos leales.
    - **Sistema Profundo de Enemigos**: Quién es el enemigo, qué causó la enemistad, qué recursos/alianzas puede arrojar en tu contra, y cómo planeas vengarte si se cruzan.
    - **Control Total Híbrido**: En cada tirada o etapa del Lifepath y Enemigos, el jugador puede **tirar `1d10`/`1d6` automáticamente O escribir/editar libremente a mano** para forjar su propia historia sin estar atado a la aleatoriedad.
  - **Economía Inicial, Tienda de Inicio y Regla Opcional "Vender el Alma / Empezar con Deuda" (*Selling Out / In Debt*)**:
    - Presupuesto reglamentario de inicio: `2,550 €$` para armas, blindajes, cyberware y equipo general + `800 €$` exclusivos para Moda, Ropa y Estilo de Vida.
    - Paquetes de equipo base por Rol con selección automática o personalizable en tienda integrada durante la creación.
    - **Regla Opcional de Mesa "Empezar con Deuda / Vender el Alma"**: Toggle configurable de común acuerdo con el GM y los jugadores para acceder a fondos iniciales adicionales o cibernética avanzada/de grado militar/corporativo desde el día 1, a cambio de adquirir una deuda monetaria o una obligación peligrosa con un fixer o megacorporación.
  - **UX Guiada para Principiantes con Hover Tooltips en STATS y Conceptos**:
    - Asistente paso a paso limpio, sin muros de texto abrumadores ni jerga sin explicar.
    - Hover tooltips táctiles interactivos en cada una de las 10 estadísticas (`INT`, `REF`, `DEX`, `TECH`, `COOL`, `WILL`, `LUCK`, `MOVE`, `BODY`, `EMP`), habilidades derivadas y conceptos de combate, explicando en lenguaje simple y claro qué hace cada estadística y cómo impacta en las tiradas para jugadores sin experiencia previa.
- [x] **👹 Biblioteca Masiva de Enemigos, Goons y Jefes Pregenerados (Acceso Rápido para el GM) (`EnemiesCompendiumPanel.tsx` & `enemiesCatalog.ts`)**:
  - **Precarga de Fichas de Amenazas Listas para el Combate**:
    - Catálogo completo de 44 combatientes preconstruidos: *Mooks / Grunts / Lieutenants / Mini-Bosses / Bosses* del *Core Rulebook*.
    - Variantes mejoradas *Hardened Mooks / Hardened Lieutenants / Hardened Mini-Bosses* de DLCs oficiales.
    - Facciones completas y PNJs con nombre y estadísticas de *Danger Gal Dossier*.
    - Enemigos y operativos de *Tales of the RED*, ciberpsicópatas callejeros y leyendas icónicas como **Adam Smasher**.
    - Plantillas de enemigos y gángsters de la Era 2077 de *CEMK 2077*.
  - **Filtros Rápidos & Despliegue en 1 Clic**:
    - Filtros tácticos por facción (*Arasaka, Militech, Maelstrom, Tyger Claws, Bozos, 6th Street, NCPD, MaxTac, Edgerunners Independientes*), nivel de amenaza y era (*2045 vs 2077*).
    - Botón de 1 clic para inyectar enemigos instantáneamente al HUD de Combate / Tracker de Iniciativa o generar un encuentro en segundos.
- [x] **Compendio Dedicado para Nuevos Sistemas de Reglas de Expansiones (`rulesCheatSheet.ts` & `expansionRulesData.ts` & `RulesCheatSheetDrawer.tsx`)**:
  - Reglas completas de Full Body Conversions (FBC) de *Interface RED Vol 3* (cuerpos ciborg, chasis, blindajes estructurales, penalizaciones de humanidad y protocolos médicos).
  - Sistemas de la Era 2077 de *Cyberpunk Edgerunners Mission Kit (CEMK)* (Neuroport universal, Quickhacks vs Netrunning clásico, armas Power/Tech/Smart y mecánicas de Ciberpsicosis).
  - Reglas de DLCs oficiales (aditivos y dispersión osmótica de *Hornet's Pharmacy*, salvamento náutico, ciberware exótico).
  - **Descripciones Contextuales e Introductorias por Sistema**: Resumen explicativo de lore y mecánicas en cada ficha de sistema (p. ej., explicando que *FBC* implica trasplantar el cerebro en una biovaina dentro de un chasis de cromo completo, o que el *Neuroport 2077* es el implante unificado con Holocall, HUD y vulnerabilidad a Quickhacks).
- [x] **Filtro por Libro Origen (`sourceBook`) en Compendio Maestro con Badges Visuales (`CompendiumView.tsx` & `core-rules.cprpack.json`)**:
  - Selector de filtrado interactivo por manual fuente (*Core Book*, *Black Chrome*, *CEMK 2077*, *Danger Gal Dossier*, *Interface RED Vol 1-3*, *DLCs Oficiales*).
  - Badges visuales temáticos con código de color e icono distintivo por cada manual en las tarjetas del catálogo.
  - **Descripciones Introductorias por Libro**: Sinopsis contextual accesible en el selector que resume qué aporta cada manual a nivel de ambientación, catálogo y reglas.
- [x] **Extracción de `Black Chrome Tech & Style Guide`**:
  - 170+ ítems de catálogo de lujo de Night City integrados en el compendio maestro.
  - Reglas completas de vehículos terrestres y aéreos con SDP, asientos y velocidad de combate.
  - Armas exóticas especializadas (Rostović, SovOil, Faisal's Customs).
  - Linear Frames avanzados (Fūma Kotarō, Vermilion, SWAT).
- [x] **Extracción de `Cyberpunk Edgerunners Mission Kit (CEMK 2077)`**:
  - Reglas de la Era 2077: Neuroport universal (Agente + Biomonitor + Chipware integrado).
  - Conversión de armas 2077: *Power* (rebotes), *Tech* (perforación de cobertura) y *Smart* (guiado).
  - Mecánicas de Ciberpsicosis y Estrés 2077.
- [x] **Extracción de `Danger Gal Dossier`**:
  - Perfiles de PNJs, mooks y jefes listos para combate integrados en el catálogo de enemigos.
  - Equipo encubierto y de espionaje corporativo.
- [x] **Extracción de `Interface RED (Vol 1-3) & DLCs Oficiales`**:
  - Hornet's Pharmacy (aditivos químicos, dispersión osmótica y fármacos experimentales).
  - Reglas completas de Full Body Conversion (FBC) y chasis cyborg.
- [x] **Selector Global de Era (2045 vs 2077)**:
  - Ajuste dinámico de interfaz y reglas disponibles según la época seleccionada.

---

## 💎 CATÁLOGO DE MÓDULOS PREMIUM & EXPANSIONES (Paridad Companion App — Separados por Nombre)

> **ALCANCE Y METODOLOGÍA**: Estos 5 módulos corresponden a los paquetes de expansión Premium de la *Cyberpunk RED Companion App* identificados en las capturas de pantalla del usuario. Para garantizar máxima fidelidad y cero duplicación, esta sección desglosa las adiciones pendientes específicas paquete por paquete, integrándose directamente con la arquitectura del Omni-Deck en **Fase 3** y **Fase 4**.

### 1. `GOING METAL` (Auditoría de Paridad Completa — *Interface RED Vol. 3*)
*Módulo de conversión a cuerpo completo y cibernética de alta gama (*Interface RED Vol. 3*).*
* **✅ Ya Implementado (Fase 3)**:
  - [x] **Addition of Full Body Conversions**: Arquitectura canónica de FBC con chasis desacoplado del cerebro orgánico.
  - [x] **13 Cuerpos FBC (`13 FBC Bodies`)**: Los 13 chasis oficiales completos (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.).
  - [x] **16 Nuevas Piezas de Cyberware FBC (`16 New Pieces of Cyberware`)**: Implantes exclusivos y adaptados para cuerpos cyborg.
  - [x] **About FBCs Section**: Sección canónica explicativa en compendio sobre lore, conversión y biovainas.
  - [x] **Modo Interactivo FBC en Hoja de Personaje y Ripperdoc**: Conmutador para transformar un personaje activo en Full Body Conversion aplicando automáticamente sus reglas de chasis intercambiable, inmunidades y cálculo de Humanidad/Reparación.
* **⏳ Pendiente de Cierre Going Metal**:
  - [ ] **Verificar/añadir el `New External Linear Frame` específico**: Comprobar y dar de alta la variante canónica externa individualizada de Going Metal si no figura ya como Linear Frame independiente.
  - [ ] **Verificar/añadir el `New Grenade Type`**: Comprobar y dar de alta el tipo específico de granada de Going Metal (Laser/Chaff o variante especializada) en el catálogo de arrojables.

### 2. `NIGHT CITY 2045` (Interactive Atlas & Campaign Gazetteer — Planeado para Fase 5 / Premium Expansion)
*Módulo integral de cartografía táctica urbana, geopolítica distrital y generador narrativo de misiones para Director de Juego y jugadores.*
- [ ] **Interactive map of Night City**: Atlas interactivo en formato vectorial SVG/Canvas con navegación táctica y zoom fluido.
- [ ] **700+ searchable Locations**: Más de 700 localizaciones canónicas indexadas y buscables al instante.
- [ ] **25 searchable Districts**: Cobertura exhaustiva de los 25 distritos de Night City 2045 con límites georreferenciados.
- [ ] **Ability to filter locations by medical, transportation, etc.**: Filtros por categoría de servicio (médico, transporte, armerías, Night Markets, corporativo, ripperdocs, etc.).
- [ ] **73 searchable Factions, with their associated hangout locations on the interactive map**: 73 facciones urbanas con sus guaridas y zonas de influencia desplegables en el mapa interactivo.
- [ ] **112 new NPCs, each with their corresponding district**: 112 nuevos personajes no jugadores indexados y vinculados a su distrito territorial.
- [ ] **130 plot hooks to inspire GMs and players**: 130 ganchos narrativos y semillas de misiones listos para detonar en mesa.
- [ ] **Interactive map automatically unlocks for your players while hosting an online session**: Desbloqueo automático del mapa interactivo para jugadores conectados en sesión remota/local.
- [ ] **Ability to add your own custom locations to the interactive map**: Herramienta de autor para dar de alta ubicaciones personalizadas (Custom Locations) con coordenadas y notas.
- [ ] **Custom locations visible and searchable for players connected to online session**: Sincronización en vivo de ubicaciones personalizadas para que sean visibles y buscables por los jugadores.

### 3. `CYBERFISTS OF FURY` (Artes Marciales Completas — *Interface RED Vol. 4*)
*Módulo de combate desarmado avanzado, disciplinas milenarias y técnicas especiales de combate cuerpo a cuerpo.*
- [x] **23 Nuevas Formas/Estilos de Artes Marciales (`23 New Martial Art Forms`)** (además de Aikido, Karate, Judo y Taekwondo del Core Book).
- [x] **46 Nuevos Movimientos Especiales de Artes Marciales (`46 New Martial Art Moves`)** integrados en el HUD de Combate para ejecutar llaves, golpes especiales y combos con sus requisitos de STATS y DVs.

### 4. `SOLO OF FORTUNE` (ACPA Power Armor & Heavy Ordinance Expansion — Planeado para Fase 5 / Premium Expansion)
*Módulo de exoesqueletos blindados pesados, tecnología militar de vanguardia y balística pesada corporativa.*
- [ ] **ACPA Armor Type (Assisted Combat Personnel Armor)**: Nueva categoría canónica de blindaje de combate asistido con reglas estructurales de chasis.
- [ ] **Custom ACPA Builder**: Taller de ensamblaje modular para diseñar, configurar y costear armaduras de poder personalizadas.
- [ ] **10 ACPAs**: 10 chasis oficiales completos de ACPA listos para equipar, tripular y desplegar en combate.
- [ ] **13 New Weapons**: 13 nuevas armas militares y pesadas de grado bélico.
- [ ] **8 New Weapon Attachments**: 8 nuevos accesorios tácticos especializados para armamento ACPA y militar.
- [ ] **15 New Weapon Range Tables**: 15 nuevas matrices y tablas de rango de combate por metro adaptadas a armamento pesado.
- [ ] **12 New Ammunition & Explosives**: 12 tipos de municiones especiales, proyectiles pesados y explosivos de demolición.
- [ ] **3 New Armor Sets**: 3 nuevos conjuntos completos de blindaje corporal táctico.
- [ ] **10 New Pieces of Gear**: 10 nuevas piezas de equipo especializado para operadores pesados.

### 5. `DANGER GAL DOSSIER` (Expansión Completa de Facciones, Creador de NPCs y Tema Visual)
*Módulo de inteligencia civil, agencias de detectives, facciones encubiertas y diseño de encuentros.*
*(Nota: En Fase 2 ya se integró una primera tanda de operativos y armas de Danger Gal).*
- [x] **Completar los 118 PNJs Oficiales (`118 New NPCs`)** distribuidos en las **15 Facciones (`15 Factions`)**.
- [x] **Nuevo Flujo de Creación de PNJs Personalizados (`New Workflow for Custom NPCs`)** para el Director de Juego.
- [x] **Tema Visual "Danger Gal" (`Danger Gal Theme`)** seleccionable en la interfaz y **Retratos de Personajes (`New Character Portraits`)**.

---

## 🧠 FASE 3 (v3.0 – v3.5): Sistemas Profundos, Oneshot Oficial & Companion App [COMPLETADO]
- [x] **Maniquí Anatómico de Ciberware & Menú Ripperdoc (`CyberwareRipperdocView.tsx`)**:
  - Silueta holográfica en A-Pose con flechas conectoras hacia las 8 zonas corporales + Fashionware.
  - Ranuras de opción visuales estilo 2077 con ilustraciones vectoriales, telemetría de Humanidad/SP e instalador Ripperdoc con tirada Xd6.
- [x] **Simulador de Pisos de Red 2045 (`NetAndRolesDeckView.tsx` & `netAndRolesData.ts`)**:
  - Escalera virtual de pisos de red: Archivos, Nodos de Control, Contraseñas, Black ICE.
  - Contador de Acciones de Red (Net Actions) basado en el Rango de Interfaz.
  - Combate Netrunner vs Black ICE con rez/derez de programas.
- [x] **Sistema de Quickhacking 2077 (`NetAndRolesDeckView.tsx`)**:
  - Hackeo inalámbrico en combate utilizando pool de RAM.
  - Quickhacks ofensivos y de control (Short Circuit, Cyberware Malfunction, Overheat).
- [x] **Habilidades de Rol Específicas**:
  - Solos (Combat Awareness), Medtechs (Farmacia/Cirugía/Criogenia), Techs (Maker), Nomads (Moto).
- [x] **Paridad y Superación de Funciones Premium de Cyberpunk RED Companion App (`FixerDeckView.tsx`, `NetAndRolesDeckView.tsx`, etc.)**:
  - Generador y gestor interactivo de encuentros y combate táctico multiobjetivo (tracking dinámico de Mooks y Bosses en tiempo real, turnos de iniciativa, monitoreo de HP/SP y tiradas grupales).
  - Gestor completo de vehículos y monturas con seguimiento de SDP (puntos de daño estructural), blindaje, asientos, armas montadas y maniobras de persecución.
  - Creador y simulador de Arquitecturas de Red personalizadas multietapa con guardado, edición y exportación.
  - Exportación e importación universal de fichas de personajes y NPCs en formatos estándar (JSON interoperable y PDF imprimible fiel a la hoja oficial de personaje).
  - Consola de Director de Juego (Fixer Deck) enriquecida con notas secretas por escena, tablas de botín (loot tables) automáticas y bitácora cronológica de eventos.
- [x] **Integración Módulo Premium `GOING METAL` (FBCs & Ciberware)**:
  - Completar los 13 Cuerpos FBC oficiales (+6 chasis restantes sobre los 7 de Fase 2).
  - 16 nuevas piezas de ciberware FBC, nuevo Linear Frame externo y nuevo tipo de granada.
  - Conmutador interactivo FBC en Hoja de Personaje y Ripperdoc (`CyberwareRipperdocView.tsx`) con chasis intercambiables, inmunidades de borgware y recálculo automático de Humanidad/Reparación.
- [x] **Integración Módulo Premium `CYBERFISTS OF FURY` (Artes Marciales Avanzadas — *Interface RED Vol. 4*)**:
  - 23 nuevas formas/estilos de artes marciales (sumadas a Aikido, Karate, Judo y Taekwondo).
  - 46 nuevos movimientos especiales de artes marciales integrados en el HUD de Combate (`CombatHudView.tsx`) para ejecutar llaves, golpes especiales y combos con sus requisitos de STATs y DVs.
- [x] **Integración Módulo Premium `DANGER GAL DOSSIER` (Expansión de Facciones, NPCs y Estilo)**:
  - Completar los 118 PNJs oficiales en sus 15 facciones en el bestiario táctico (`EnemiesCompendiumPanel.tsx`).
  - Flujo de creación de PNJs personalizados (*New Workflow for Custom NPCs*) integrado en la Consola Fixer (`FixerDeckView.tsx`).
  - Tema visual "Danger Gal" (neón rosa/magenta/negro) y nuevos retratos de personajes oficiales.
- [x] **Aventura Oneshot Oficial `RED CHROME CARGO (CEMK 2077 Edition)` (`RedChromeCargoView.tsx` & `redChromeCargoData.ts`)**:
  - Mapa original canónico extraído del PDF oficial (`hammerhead-map.png`) con visor zoom pantalla completa y grilla táctica de 4 vagones (*Rear, Middle, Front, Driver*).
  - Screamsheet original de Night City Today (`screamsheet-p2.png`) con traducción bilingüe inglés/español y Modo Jugadores sin spoilers de GM.
  - Precarga automática de los 7 Edgerunners oficiales de CEMK 2077 en el Roster (David, Lucy, Rebecca, Maine, Kiwi, Falco, Pilar).
  - Escalado dinámico por cantidad de jugadores (2 a 7 PJs) y selector de era (2077 CEMK vs 2045 Clásico).
  - Fichas maestras tácticas de enemigos (Guardias de la Red Chrome Legion, Oficial y Torreta Automática) con armaduras SP, armas, ciberware 2077 con vulnerabilidades de Quickhacks y loot saqueable con 1 clic al inventario de los PJs.
  - Mainframe NET de 5 pisos interactivo con Black ICE *Hellhound* (20 REZ), Eye-Dee de Manifiesto Militar Militech y control de torreta.
  - Las 4 Cajas de Hornet con asignación de cargadores (2 manos ocupadas) y pago automático de Hornet (`2,000 €$` a cada jugador).
- [x] **Portal Interactivo de Changelogs, Inventario de Contenido y Documentación (`SystemChangelogAndDocsView.tsx` & `systemDocsAndChangelogData.ts`)**:
  - Nueva pestaña permanente `📜 DOCS & CHANGELOG` en la barra superior del Omni-Deck para consultar toda la documentación sin salir de la app.
  - Registro interactivo y buscable versión por versión desde la `v1.0.0` hasta la `v3.5.0` con clasificación por categoría, impacto y archivos modificados.
  - Inventario en vivo del catálogo total: 391+ ítems oficiales, 8 sistemas de reglas de expansiones, 44+ enemigos y 118 PNJs de Danger Gal Dossier, 23 artes marciales y 46 movimientos especiales.
  - Visualizador de arquitectura técnica desacoplada (Zustand Stores, Motores matemáticos puros, Flujo COMP/CON y Árbol de archivos).
  - Monitor en vivo del Roadmap de desarrollo por fases (Fases 0 a 3 completadas, especificaciones para Fases 4 y 5).

---

## 🎲 FASE 4 (v3.5 – v3.9): Mini-VTT Táctico, Clima, Homebrew y Audio/VFX [PENDIENTE]
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
- [ ] **Integración Módulo Premium `NIGHT CITY 2045` (Atlas Interactivo, Distritos, Facciones y Plot Hooks)**:
  - Mapa interactivo de Night City 2045 con navegación táctica SVG/Canvas.
  - 25 distritos buscables y 700+ ubicaciones buscables con filtros por tipo (*Médico, Transporte, Night Markets, Corporativo, Ripperdocs, Bares, etc.*).
  - 73 facciones buscables con guaridas y zonas de influencia asociadas directamente en el mapa.
  - 112 nuevos PNJs de distrito vinculados a sus zonas territoriales.
  - Generador de 130 ganchos de trama / misiones (*Plot Hooks*) para inspirar a GMs y jugadores.
  - Creador y gestor de ubicaciones personalizadas (*Custom Locations*) para añadir y compartir en mesa.
- [ ] **Integración Módulo Premium `SOLO OF FORTUNE` (Armaduras de Poder ACPA & Arsenal Pesado)**:
  - Soporte de tipo de armadura ACPA (*Assisted Combat Personnel Armor*) y Constructor Personalizado de ACPA (*Custom ACPA Builder*).
  - 10 modelos oficiales de ACPA listos para equipar y pilotar.
  - 13 nuevas armas, 8 nuevos accesorios de armas y 15 nuevas tablas de rango de armas dedicadas.
  - 12 nuevas municiones y explosivos, 3 nuevos sets de armadura y 10 nuevas piezas de equipo.

---

## 🔍 FASE 5 (v4.0): Auditoría Integral del Sistema (UI, Mecánicas y Revisión Manual por Manual de los ~60 PDFs) [PENDIENTE]
- [ ] **Guía de Verificación y Checklist de Auditoría Oficial**:
  - Matriz formal de validación cruzada para cada mecánica implementada contra el texto oficial de las reglas de R. Talsorian Games.
  - Criterios de aceptación rigurosos de fidelidad matemática: DVs por metro, fórmulas de daño, ablación de SP, penalizadores situacionales y multiplicadores críticos.
- [ ] **Paseo Interactivo Funcional de la Interfaz (Live UI/Functional Walkthrough)**:
  - Recorrido exhaustivo por cada vista del sistema (`CombatHudView`, `StreetLabView`, `CompendiumView`, `CyberwareRipperdocView`, `FixerDeckView`, `DataPacksView`, etc.).
  - Validación de ergonomía de combate, legibilidad táctil de ciberware, respuesta háptica/visual y flujo sin fricción para el usuario en mesa de juego.
  - Pruebas de estrés de UI en múltiples resoluciones, pantallas táctiles y modos de alto contraste.
- [ ] **Auditoría Exhaustiva Manual por Manual (~60 PDFs Oficiales)**:
  - Revisión sistemática de cada uno de los ~60 PDFs oficiales y DLCs de Cyberpunk RED en la biblioteca:
    - Verificación de completitud de catálogo: armas, blindajes, ciberware, drogas, programas, equipo, vehículos y exóticos.
    - Detección e incorporación de erratas oficiales y ajustes de balanceo canónicos (FAQs oficiales y errata de R. Talsorian Games).
    - Homologación de identificadores únicos, categorías y atributos en los data packs (`.cprpack.json`).
