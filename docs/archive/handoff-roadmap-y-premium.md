# Roadmap de fase 4 y módulos premium (handoff)

> [Claude Code · 2026-10-24] Archivado al ordenar la documentación. Copia textual de `AI_CONTEXT_HANDOFF.md` (secciones 4 y 5). No se actualiza más.

---

## 🔮 4. Phase 4 Roadmap: GM Role Master Control Deck & Modular Settings
The next major architectural milestone is **Phase 4**:
1. **⚙️ MODO SETTINGS & MODULARIDAD GLOBAL (Prender / Apagar Sistemas)**:
   - Capacidad en configuración del sistema y perfil del personaje para activar o desactivar módulos globales completos según el tipo de mesa:
     - *Full Body Conversions (Going Metal)*: Ocultar chasis cyborg si la campaña es de nivel callejero o purista orgánica.
     - *Garaje & Vehículos Nómada*: Ocultar panel de vehículos si el personaje no conduce ni posee vehículos.
     - *Quickhacking & Cyberware CEMK 2077*: Desactivar mecánicas de 2077 para mesas puristas de la Era del Rojo (2045).
     - *Dojo de Artes Marciales*: Ocultar disciplinas marciales para personajes que no usan combate cuerpo a cuerpo desarmado.
     - *Consola NET & Pisos de Red*: Ocultar herramientas de Netrunning en grupos sin Netrunners.
2. **GM Master Screen (`FixerDeckView.tsx` / `GmRoleMasterControlDeck.tsx`)**:
   - Tablero unificado para el Árbitro para orquestar y reaccionar a las 10 Habilidades de Rol en vivo.
   - Arbitraje de tiradas de *Combat Awareness*, *Interface*, *Maker* (tiempos de fabricación), *Medicine* (lotes farmacéuticos y criocámaras), *Backup* (cronómetros de refuerzos), y *Charismatic Impact* (audiencias y favores).
3. **Multi-Participant Combat Initiative Tracker**:
   - Sincronización bidireccional entre la ficha del jugador activo, los 44 goons del catálogo y los 118 PNJs de *Danger Gal Dossier*.
4. **Generador Procedural de Encuentros & Clima Callejero**:
   - Tablas de calor urbano por distrito (Watson, City Center, Santo Domingo, Pacifica, Combat Zone) y eventos ambientales (lluvia ácida, smog rojo, interferencias EMP).
5. **Seguimiento de Economía & Campaña**:
   - Alquiler mensual, cuotas de deuda corporativa y gastos de estilo de vida (Core p. 377).

---

## 💎 5. Premium Modules & Fases Futuras (Paridad Companion App)
Desglose canónico derivado directamente de la catalogación oficial de la *Cyberpunk RED Companion App*, garantizando cero duplicación:

### A. `NIGHT CITY 2045` (Interactive Atlas & Campaign Gazetteer — Planeado para Fase 5 / Premium Expansion)
* **Interactive map of Night City**: Atlas interactivo en formato vectorial SVG/Canvas con navegación táctica y zoom fluido.
* **700+ searchable Locations**: Más de 700 localizaciones canónicas indexadas y buscables al instante.
* **25 searchable Districts**: Cobertura exhaustiva de los 25 distritos de Night City 2045 con límites georreferenciados.
* **Ability to filter locations by medical, transportation, etc.**: Filtros por categoría de servicio (médico, transporte, armerías, Night Markets, corporativo, ripperdocs, etc.).
* **73 searchable Factions, with their associated hangout locations on the interactive map**: 73 facciones urbanas con sus guaridas y zonas de influencia desplegables en el mapa.
* **112 new NPCs, each with their corresponding district**: 112 nuevos personajes no jugadores indexados y vinculados a su distrito territorial.
* **130 plot hooks to inspire GMs and players**: 130 ganchos narrativos y semillas de misiones listos para detonar en mesa.
* **Interactive map automatically unlocks for your players while hosting an online session**: Desbloqueo automático del mapa interactivo para jugadores conectados en sesión remota/local.
* **Ability to add your own custom locations to the interactive map**: Herramienta de autor para dar de alta ubicaciones personalizadas (Custom Locations) con coordenadas y notas.
* **Custom locations visible and searchable for players connected to online session**: Sincronización en vivo de ubicaciones personalizadas para que sean visibles y buscables por los jugadores.

### B. `SOLO OF FORTUNE` (ACPA Power Armor & Heavy Ordinance Expansion — Planeado para Fase 5 / Premium Expansion)
* **ACPA Armor Type (Assisted Combat Personnel Armor)**: Nueva categoría canónica de blindaje de combate asistido con reglas estructurales de chasis.
* **Custom ACPA Builder**: Taller de ensamblaje modular para diseñar, configurar y costear armaduras de poder personalizadas.
* **10 ACPAs**: 10 chasis oficiales completos de ACPA listos para equipar, tripular y desplegar en combate.
* **13 New Weapons**: 13 nuevas armas militares y pesadas de grado bélico.
* **8 New Weapon Attachments**: 8 nuevos accesorios tácticos especializados para armamento ACPA y militar.
* **15 New Weapon Range Tables**: 15 nuevas matrices y tablas de rango de combate por metro adaptadas a armamento pesado.
* **12 New Ammunition & Explosives**: 12 tipos de municiones especiales, proyectiles pesados y explosivos de demolición.
* **3 New Armor Sets**: 3 nuevos conjuntos completos de blindaje corporal táctico.
* **10 New Pieces of Gear**: 10 nuevas piezas de equipo especializado para operadores pesados.

### C. `GOING METAL` (Auditoría de Paridad Completa)
* **✅ Ya Implementado (Fase 3)**:
  - *Addition of Full Body Conversions*: Arquitectura canónica de FBC con chasis desacoplado del cerebro orgánico.
  - *13 FBC Bodies*: 13 cuerpos FBC oficiales completos (Aquarius, Dragoon, Enforcer, Samson, Wingman, Gemini, Spyder, etc.).
  - *16 New Pieces of Cyberware*: 16 implantes exclusivos para chasis cyborg y blindajes estructurales.
  - *About FBCs Section*: Guía canónica de lore, protocolos de instalación y conversión en compendio.
* **⏳ Pendiente de Cierre Going Metal**:
  - *Verificar/añadir el `New External Linear Frame` específico*: Comprobar y dar de alta la variante canónica externa individualizada de Going Metal si no figura ya como Linear Frame independiente.
  - *Verificar/añadir el `New Grenade Type`*: Comprobar y dar de alta el tipo específico de granada de Going Metal (Laser/Chaff o variante especializada) en el catálogo de arrojables.

---

