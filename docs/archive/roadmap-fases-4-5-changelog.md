# Roadmap de fases 4 y 5 (versión del changelog)

> [Claude Code · 2026-10-24] Archivado al ordenar la documentación. Copia textual de `CHANGELOG_AND_ARCHITECTURE.md` (sección "Roadmap y Evolución de Fases", escrita hasta v4.0). No se actualiza más.

---

## 🔮 Roadmap y Evolución de Fases (Fases 4 y 5 Pendientes)

Las Fases 0, 1, 2 y 3 se encuentran **COMPLETADAS**. Los siguientes módulos representan las especificaciones para las fases subsiguientes. **Ningún componente debe intentar importarlos mientras no existan en disco**:

### Fase 2 (v2.6 – v2.9): Disparos Apuntados, Creador Guiado, Biblioteca de Enemigos, Compendio y Expansión PDF [COMPLETADO]
* Selector Interactivo de Disparos Apuntados (`CombatHudView.tsx` & `combatEngine.ts`):
  - Penalizador canónico `-8`, restricción ROF 1, Cabeza (`×2` daño penetrante), Pierna (`Broken Leg -4 MOVE`), Objeto Sostenido (`Disarm`).
* Creador de Personajes Guiado Desde Cero (`src/features/creator/CharacterCreatorWizard.tsx`):
  - 3 métodos oficiales (*Streetrat*, *Edgerunner*, *Complete Package*) + plantillas 2077 (*CEMK*).
  - Lifepath híbrido (tirada de dados o redacción libre) con módulo detallado de Enemigos.
  - Economía inicial (`2,550 €$` + `800 €$` moda), paquetes por Rol y toggle opcional "Empezar con Deuda / Vender el Alma".
  - Onboarding para novatos con hover tooltips explicativos en STATs, habilidades y conceptos de reglas.
* Biblioteca Masiva de Enemigos y Jefes para el GM (`src/features/gm/EnemiesCompendiumPanel.tsx`):
  - Fichas pregeneradas listas para combate: Core Mooks/Lieutenants/Bosses, Hardened variants, Danger Gal Dossier, Tales of the RED, CEMK 2077, ciberpsicópatas y Adam Smasher.
  - Filtros por facción (Arasaka, Militech, Maelstrom, Tyger Claws, etc.), amenaza y era con inyección en 1 clic al combate.
* Compendio Dedicado para Reglas Nuevas de Expansiones (`src/features/compendium/CompendiumView.tsx` & `src/data/expansionRulesData.ts`):
  - Full Body Conversions (FBC) de *Interface RED Vol 3*, Reglas Era 2077 de *CEMK* (Neuroport, armas Power/Tech/Smart, Ciberpsicosis), DLCs (*Hornet's Pharmacy*).
  - Descripciones contextuales e introductorias de lore y mecánicas en cada sistema.
* Filtro de Libro Origen (`sourceBook`), Badges Visuales y Sinopsis de Manual (`src/features/compendium/CompendiumView.tsx`):
  - Filtro interactivo por manual con sinopsis de contenido y badges temáticos.
* Extracción e integración de `data/black-chrome.cprpack.json`:
  - 170+ ítems de lujo, vehículos con SDP y armas exóticas.
* Extracción e integración de `data/cemk-2077.cprpack.json`:
  - Reglas 2077 (Edgerunners Mission Kit): Neuroport integrado, armas Power/Tech/Smart y ciberpsicosis.
* Extracción e integración de `data/danger-gal.cprpack.json` & `data/interface-red.cprpack.json`.

### Fase 3 (v3.0 – v3.5): Sistemas Profundos, Oneshot Oficial & Companion App [COMPLETADO]
* `src/features/netroles/NetAndRolesDeckView.tsx` & `src/data/netAndRolesData.ts`:
  - Simulador piso a piso de Arquitecturas de Red (Archivos, Nodos de Control, Black ICE).
  - Gestor de memoria RAM y software de hackeo en combate para la era 2077 (Quickhacks).
  - Habilidades de Rol Específicas: Solos (Combat Awareness), Medtechs (Farmacia/Cirugía/Criogenia), Techs (Maker), Nomads (Moto/Garaje).
* `src/features/oneshot/RedChromeCargoView.tsx` & `src/data/redChromeCargoData.ts`:
  - Centro de comando táctico interactivo para la aventura oficial Red Chrome Cargo CEMK 2077 (mapa del tren, grilla táctica de 4 vagones, Screamsheet original, 7 Edgerunners CEMK precargados, Mainframe NET de 5 pisos, botín y pago de Hornet).
* `src/features/docs/SystemChangelogAndDocsView.tsx` & `src/data/systemDocsAndChangelogData.ts`:
  - Portal in-app de documentación, registro interactivo de changelogs versión por versión (`v1.0.0` a `v3.5.0`), visor de inventario canónico y arquitectura técnica.
* Paridad y Superación de Funciones Premium de Cyberpunk RED Companion App:
  - Gestor táctico de encuentros y combate multiobjetivo con seguimiento dinámico de Mooks/Bosses e iniciativa en `CombatHudView.tsx` y `FixerDeckView.tsx`.
  - Seguimiento de vehículos, monturas, SDP, blindaje y maniobras en la pestaña Garaje de `NetAndRolesDeckView.tsx`.
  - Creador y simulador de Arquitecturas de Red personalizadas multietapa con exportación.
  - Exportación e importación universal (JSON / PDF imprimible estilo hoja oficial).
  - Consola Fixer enriquecida: notas de sesión secretas, generador de botín y registro cronológico.
* **Integración de Módulos Premium Companion App (Fase 3)**:
  - **`Going Metal` (FBC & Cyberware)**: 13 Cuerpos FBC (+6 chasis restantes sobre los 7 de Fase 2), 16 piezas de cyberware FBC, nuevo Linear Frame externo, nueva granada y conmutador interactivo FBC en Hoja de Personaje y Ripperdoc (`CyberwareRipperdocView.tsx`).
  - **`Cyberfists of Fury` (Artes Marciales Avanzadas)**: 23 nuevas formas de artes marciales y 46 movimientos especiales integrados en `CombatHudView.tsx` con evaluación de requisitos de STATs y DVs.
  - **`Danger Gal Dossier` (Facciones, NPCs & Tema)**: 118 PNJs oficiales en 15 facciones en `EnemiesCompendiumPanel.tsx`, flujo de creación de PNJs custom en `FixerDeckView.tsx`, tema visual "Danger Gal" y nuevos retratos de personajes oficiales.

### Fase 4 (v3.9.x – v4.0): GM Role Master Control Deck, Tracker de Iniciativa, Orquestación de Roles & Campaña
* **GM Role Master Control Deck (`GmRoleMasterControlState`)**:
  - Consola central para el Árbitro para orquestar y arbitrar en tiempo real las 10 Habilidades de Rol oficiales de Cyberpunk RED:
    - **Solo (Combat Awareness)**: Priorización de amenazas y bonificaciones de spotter en telemetría.
    - **Netrunner (Interface)**: Topología de arquitectura de red activa, seguimiento de pisos y nivel de alerta de Black ICE.
    - **Tech (Maker)**: Cronómetros y cálculo de DVs para Jury Rig, Field Upgrade, Fabrication e Invention.
    - **Medtech (Medicine)**: Seguimiento de lotes de síntesis de fármacos, crioterapia activa y días de terapia.
    - **Media (Credibility)**: Gestión de rumores, publicaciones en la Red y verificación de fuentes.
    - **Exec (Teamwork)**: Gestión de nóminas, lealtad y cobertura de operativos corporativos subordinados.
    - **Lawman (Backup)**: Tiempos de respuesta de refuerzos policiales y tiradas de radio de auxilio.
    - **Fixer (Operator)**: Arbitraje de disponibilidad de mercados negros, contactos y márgenes de regateo.
    - **Nomad (Moto)**: Mantenimiento de vehículos del clan, mejoras mecánicas y soporte de convoy.
    - **Rockerboy (Charismatic Impact)**: Tamaño de audiencia, categoría del local y economía de favores de fans.
* **Tracker Táctico de Iniciativa de Combate**:
  - Secuencia de turnos multiobjetivo con inserción fluida de PNJs desde el catálogo de 44 enemigos base y 118 operativos de *Danger Gal Dossier*.
* **Generador de Encuentros & Peligros Ambientales**:
  - Tablas de calor urbano por distrito de Night City y condiciones climáticas extremas (lluvia ácida, smog tóxico, tormenta electromagnética).
* **Gestor de Economía y Campaña**:
  - Registro de deudas, alquileres mensuales (Container, Cube, Studio, Penthouse) y estilo de vida (Core pg. 377).
* `src/components/MiniVTT.tsx`:
  - Rejilla táctil 2x2m con obstáculos y regla de distancia en metros vinculada a tabla de DVs.
* `src/components/HomebrewBuilderModal.tsx`:
  - Creador universal de armas, drogas y ciberware casero con algoritmo de conversión 2020 a RED.
* `src/utils/sfx.ts` & `src/utils/vfx.ts`:
  - Audio sintetizado táctil para disparos, recargas, zumbidos de Sandevistan y efectos visuales de glitch/herida.
* **Integración de Módulos Premium Companion App (Fase 4)**:
  - **`Night City 2045` (Atlas Interactivo & Cartografía Urbana)**: Mapa interactivo en SVG/Canvas, 25 distritos buscables, 700+ ubicaciones con filtros por categoría, 73 facciones buscables con guaridas georreferenciadas, 112 nuevos PNJs de distrito, 130 ganchos de trama (plot hooks) y creador de ubicaciones personalizadas (Custom Locations).
  - **`Solo of Fortune` (Armaduras de Poder ACPA & Arsenal Militar)**: Tipo de armadura ACPA (*Assisted Combat Personnel Armor*) y Constructor Personalizado de ACPA (*Custom ACPA Builder*), 10 modelos ACPA equipables, 13 nuevas armas, 8 accesorios de armas, 15 tablas de rango dedicadas, 12 municiones y explosivos, 3 sets de blindaje y 10 piezas de equipo.

### 💎 Índice de Módulos Premium por Nombre (Paridad Companion App)
> Especificaciones derivadas directamente de las capturas de la Companion App oficial. Este índice mantiene el desglose por pack independiente y deja preparado el espacio para las próximas capturas enviadas por el usuario.

* **1. `GOING METAL` (Auditoría de Paridad Completa — Full Body Conversions)**:
  - **✅ Ya Implementado (Fase 3)**:
    - **Addition of Full Body Conversions**: Arquitectura canónica de FBC con chasis desacoplado del cerebro orgánico.
    - **13 Cuerpos FBC (`13 FBC Bodies`)**: Los 13 chasis oficiales completos (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.).
    - **16 Nuevas Piezas de Cyberware FBC (`16 New Pieces of Cyberware`)**: Implantes exclusivos y adaptados para cuerpos cyborg.
    - **About FBCs Section**: Guía canónica de lore, protocolos de instalación y conversión en compendio.
    - **Modo Interactivo FBC en Hoja de Personaje y Ripperdoc**: Conmutador para transformar un personaje activo en Full Body Conversion aplicando automáticamente sus reglas de chasis intercambiable, inmunidades y cálculo de Humanidad/Reparación.
  - **⏳ Pendiente de Cierre Going Metal**:
    - **Verificar/añadir el `New External Linear Frame` específico**: Comprobar y dar de alta la variante canónica externa individualizada de Going Metal si no figura ya como Linear Frame independiente.
    - **Verificar/añadir el `New Grenade Type`**: Comprobar y dar de alta el tipo específico de granada de Going Metal (Laser/Chaff o variante especializada) en el catálogo de arrojables.
* **2. `NIGHT CITY 2045` (Interactive Atlas & Campaign Gazetteer — Planeado para Fase 5 / Premium Expansion)**:
  - **Interactive map of Night City**: Mapa interactivo de Night City en SVG/Canvas con controles de navegación táctica.
  - **700+ searchable Locations**: Más de 700 ubicaciones canónicas buscables con ficha detallada.
  - **25 searchable Districts**: 25 distritos buscables con límites territoriales georreferenciados.
  - **Ability to filter locations by medical, transportation, etc.**: Filtros por categoría de servicio (médico, transporte, armerías, Night Markets, corporativo, ripperdocs, etc.).
  - **73 searchable Factions, with their associated hangout locations on the interactive map**: 73 facciones buscables con guaridas y zonas de influencia desplegables en el mapa interactivo.
  - **112 new NPCs, each with their corresponding district**: 112 nuevos PNJs indexados y vinculados a su distrito territorial correspondiente.
  - **130 plot hooks to inspire GMs and players**: 130 ganchos narrativos y semillas de misiones listos para detonar en mesa.
  - **Interactive map automatically unlocks for your players while hosting an online session**: Desbloqueo automático del mapa interactivo para jugadores conectados en sesión remota/local.
  - **Ability to add your own custom locations to the interactive map**: Capacidad de dar de alta ubicaciones personalizadas (Custom Locations) con coordenadas y notas.
  - **Custom locations visible and searchable for players connected to online session**: Ubicaciones personalizadas visibles y buscables en tiempo real para los jugadores de la sesión.
* **3. `CYBERFISTS OF FURY` (Artes Marciales Completas — *Interface RED Vol. 4*)**:
  - **23 Nuevas Formas/Estilos de Artes Marciales (`23 New Martial Art Forms`)** (además de Aikido, Karate, Judo y Taekwondo del Core Book).
  - **46 Nuevos Movimientos Especiales de Artes Marciales (`46 New Martial Art Moves`)** integrados en el HUD de Combate para ejecutar llaves, golpes especiales y combos con sus requisitos de STATS y DVs.
* **4. `SOLO OF FORTUNE` (ACPA Power Armor & Heavy Ordinance Expansion — Planeado para Fase 5 / Premium Expansion)**:
  - **ACPA Armor Type (Assisted Combat Personnel Armor)**: Nuevo tipo canónico de armadura pesada asistida con reglas de integridad de chasis.
  - **Custom ACPA Builder**: Taller de ensamblaje modular para diseñar, configurar y costear armaduras de poder personalizadas.
  - **10 ACPAs**: 10 chasis oficiales completos de ACPA listos para equipar y pilotar.
  - **13 New Weapons**: 13 nuevas armas militares y pesadas de alto calibre.
  - **8 New Weapon Attachments**: 8 nuevos accesorios tácticos especializados para armamento ACPA y militar.
  - **15 New Weapon Range Tables**: 15 nuevas tablas y matrices de rango de combate por metro adaptadas a armamento pesado.
  - **12 New Ammunition & Explosives**: 12 tipos de municiones especiales, proyectiles pesados y explosivos de demolición.
  - **3 New Armor Sets**: 3 nuevos conjuntos de blindaje corporal táctico.
  - **10 New Pieces of Gear**: 10 nuevas piezas de equipo especializado para operadores pesados.
* **5. `DANGER GAL DOSSIER` (Expansión Completa de Facciones, Creador de NPCs y Tema Visual)**:
  - *(Nota: En Fase 2 ya se integró una primera tanda de operativos y armas de Danger Gal).*
  - **Completar los 118 PNJs Oficiales (`118 New NPCs`)** distribuidos en las **15 Facciones (`15 Factions`)**.
  - **Nuevo Flujo de Creación de PNJs Personalizados (`New Workflow for Custom NPCs`)** para el Director de Juego.
  - **Tema Visual "Danger Gal" (`Danger Gal Theme`)** seleccionable en la interfaz y **Retratos de Personajes (`New Character Portraits`)**.
* **6. `SETTINGS & MODULARIDAD GLOBAL` (Prender / Apagar Sistemas por Campaña o Personaje — Planeado para Fase 4 / Future Architecture)**:
  - **Modular System Switches**: Conmutadores reactivos en la configuración global de la aplicación y por personaje para habilitar o desactivar subsistemas completos:
    - *Full Body Conversions (Going Metal)*: Ocultación completa de biovainas y chasis FBC para mesas a nivel de calle orgánicas.
    - *Garaje & Vehículos Nómada*: Desactivación de la pestaña y mecánicas vehiculares si el personaje no dispone de transporte o la campaña es exclusivamente peatonal.
    - *Quickhacking & Cyberware CEMK 2077*: Aislamiento de software y ciberware 2077 para mesas con ambientación histórica estricta de la Era del Rojo (2045).
    - *Dojo de Artes Marciales*: Ocultación de las 27 disciplinas y 54 movimientos de Cyberfists of Fury si el edgerunner no utiliza combate marcial desarmado.
    - *Consola y Pisos de Netrunning*: Ocultación de la suite de ciberdecks y simulación de arquitectura de Red en mesas sin Netrunners activos.
* **[Espacio Reservado para Próximos Módulos Premium]**:
  - *(Ranuras preparadas para capturas adicionales: Black Chrome Packs, Interface RED Vol. 1-2 Packs, etc.)*

### Fase 5 (v4.0): Auditoría Integral del Sistema (UI, Mecánicas y Revisión de ~60 PDFs)
* Guía de Verificación y Checklist de Auditoría Oficial contra reglas de R. Talsorian Games.
* Paseo Interactivo Funcional de la Interfaz (Live UI/Functional Walkthrough) en todas las vistas principales.
* Auditoría Exhaustiva Manual por Manual (~60 PDFs oficiales y DLCs) verificando completitud, balanceo canónico y erratas.

---

