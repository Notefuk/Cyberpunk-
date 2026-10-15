# CPR OMNI-DECK // Lista Maestra de Adaptación y Contenido (Checklist)

> **PROPÓSITO**: Esta lista permite verificar de un solo vistazo el progreso de adaptación de las reglas, mecánicas y libros oficiales de tu biblioteca de PDFs a la aplicación, sin tener que revisar el código fuente.

**Leyenda de Estados:**
* `[x] COMPLETADO`: Adaptado en código, validado con las reglas oficiales y funcionando en la interfaz.
* `[~] EN PROGRESO`: Estructura o datos parciales cargados, requiere más pulido o módulos secundarios.
* `[ ] PENDIENTE`: En cola para siguientes fases.

---

## 🎲 1. Mecánicas del Sistema (Core Rules Engine)

### Combate y Resolución Básica
- [x] **Resolución de Tiradas Básicas**: `STAT + Habilidad + 1d10` contra Dificultad (DV).
- [x] **Críticos y Pifias (Explosión)**: Tirar un 10 explota sumando otro 1d10; tirar un 1 explota restando 1d10.
- [x] **Selector Global de Distancias**: Brackets de 0-6m, 7-12m, 13-25m, 26-50m, 51-100m, 101-200m, 201-400m, 401-800m.
- [x] **Tabla Oficial de DVs por Arma (Pág. 174)**: Pistolas, Subfusiles, Escopetas, Rifles de Asalto, Francotiradores, Arcos y Pesadas.
- [x] **Detección de Zona Óptima (Sweet Spot)**: Marcador visual `★ ÓPTIMO` en la franja con menor dificultad de cada arma.
- [x] **Modo Autofire (Ráfagas de 10 balas)**: 
  - [x] Consumo obligatorio de 10 proyectiles del cargador.
  - [x] Tabla de DVs específica de Autofire (Pág. 174).
  - [x] Multiplicador de daño `2d6 * margen de éxito` (hasta x3 en SMG, x4 en Rifle de Asalto).
- [x] **Combate Cuerpo a Cuerpo**: Tirada enfrentada contra la DEX + Evasión del objetivo.
- [ ] **Tiradas de Daño Automáticas**: Botón para rodar dados de daño (`3d6`, `5d6`) y restar automáticamente del blindaje/vida.
- [ ] **Salvaciones de Muerte (Death Saves)**: Contador de penalizador acumulativo por turno y tirada de 1d10 contra BODY.

### Salud, Blindaje y Estados
- [x] **Puntos de Vida (HP)**: Barra interactiva con botones delta rápida (`-5`, `-1`, `+1`, `+5`, `Descanso Total`).
- [x] **Umbral de Herida Grave (Seriously Wounded)**: Se activa automáticamente al llegar al 50% de HP o menos, aplicando la penalización de -2 a acciones.
- [x] **Blindaje de Cabeza y Cuerpo (SP)**: Indicador numérico táctil independiente para cada zona.
- [x] **Ablación de Blindaje**: Botones dedicados de `[-1 ABLACIÓN]` que reducen el SP tras recibir daño penetrante.
- [x] **Reparación de Blindaje**: Botón de un toque para restaurar el SP a su máximo nominal.
- [x] **Reserva de Suerte (Luck Pool)**: Pips interactivos táctiles para gastar y reiniciar suerte por sesión.
- [x] **Módulo de Heridas Críticas (Critical Injuries - Págs. 187-188)**:
  - [x] Tabla de Heridas Críticas en Cabeza (Tirada 2d6 con 11 resultados únicos).
  - [x] Tabla de Heridas Críticas en Cuerpo (Tirada 2d6 con 11 resultados únicos).
  - [x] Iconos temáticos dinámicos (Cráneo agrietado, Cerebro con trauma, Ojo dañado, Hueso roto, etc.).
  - [x] Desglose de penalizaciones en reglas, DVs de Primeros Auxilios/Paramédico y Cirugía.
  - [x] Botón `[ TRATAR / CURAR ]` para remover la herida al ser atendido médicamente.
  - [x] Contador en la barra superior del personaje.

---

## 📚 2. Catálogo de Libros y Suplementos (Data Packs)

### A. Cyberpunk RED Core Rulebook (v1.24)
- **Armas y Munición**:
  - [x] 12 Armas estándar del Night Market (Pistolas Ligera/Media/Pesada/Muy Pesada, SMG, Heavy SMG, Escopeta, Rifle de Asalto, Francotirador, Arcos, Lanzagranadas, Lanzacohetes, Armas Melee Ligeras/Medias/Pesadas/Muy Pesadas).
  - [ ] Munición especial (Armor Piercing, Incendiaria, Expansiva, Balas de goma, Smart).
  - [ ] Accesorios para armas (Smartgun Link, Miras telescópicas, Cargadores ampliados/tambor, Silenciadores, Bayoneta).
  - [ ] Armas exóticas del Core (Malorian Arms, Kendachi Mono-Three, etc.).
- **Blindajes**:
  - [x] Las 9 armaduras estándar (Leathers, Kevlar, Light Armorjack, Bodyweight Suit, Medium Armorjack, Heavy Armorjack, Flak, Metalgear, Escudo Antidisturbios).
  - [ ] Penalizaciones activas al movimiento y reflejos (-2 / -4 REF, DEX, MOVE) aplicadas automáticamente a la ficha.
- **Ciberware**:
  - [x] Ciberware básico esencial (Neuralware, Interface Plugs, Sandevistan, Kerenzikov, Ciberojos, Ciberbrazo, Ciberpierna, Subdermal Armor).
  - [ ] Lista completa de opciones de Ciberojo (MicroOptics, Targeting Scope, Teleoptics, Visión Térmica, etc.).
  - [ ] Lista completa de opciones de Ciberbrazo/Pierna (Big Knucks, Pop-up weapons, Jump Boosters, etc.).
  - [ ] Ciberware interno y externo (Biomonitor, Chemskin, Techhair, Skinweave, etc.).
  - [ ] Borgware (Linear Frame Sigma/Beta, Cybermatrix).
- **Netrunning**:
  - [x] Programas básicos (Sword, Banhammer, Nerve Scrub, Armor, Hellhound Black ICE).
  - [ ] Lista completa de Programas Defensivos y Ofensivos.
  - [ ] Lista completa de Black ICE (Wisp, Raven, Skunk, Scorpion, Dragon, etc.).
  - [ ] Ciberdecks y hardware de expansión.
- **Equipo General y Servicios**:
  - [ ] Agentes (Smartphones AI) y electrónica.
  - [ ] Herramientas de Tech y Medtech (Medscanner, Techscanner, Cryopump).
  - [ ] Drogas callejeras (Black Lace, Blue Glass, Smash, Synthcoke) con efectos de adicción.
  - [ ] Estilo de vida, vivienda y moda (Bags of Prepak, Kibble, Estilo Asia Pop, Urban Flash, etc.).

---

### B. Black Chrome & Black Chrome Plus
- [ ] Armamento de lujo y exótico (Nokota, Arasaka, Malorian exclusivos).
- [ ] Ciberware lineal de alta gama y mejoras corporales estéticas.
- [ ] Catálogo completo de vehículos (Motos, Aerodinos AV, Blindados Nomad) con SDP y asientos.
- [ ] Mejoras vehiculares (Blindaje reforzado, armamento montado, asientos eyectables).
- [ ] Ropa y blindajes blindados de alta costura.

---

### C. Edgerunners Mission Kit (CEMK 2077)
- [ ] Integración del sistema de **Neuroports** (conector cerebral estándar 2077).
- [ ] Mecánica de **Quickhacks** para Netrunners de la era 2077.
- [ ] Armamento 2077 (Tech Weapons con penetración de coberturas, Smart Weapons con seguimiento, Power Weapons con rebote).
- [ ] Borgware moderno de la serie de anime (Sandevistan Militech "David Martinez", Monocables 2077).
- [ ] Nuevas reglas de pérdida de Humanidad y Ciberpsicosis rápida 2077.

---

### D. Danger Gal Dossier
- [ ] Base de datos de PNJs por facción (NCPD, Maelstrom, Tyger Claws, Trauma Team, Danger Gal, Arasaka, Militech).
- [ ] Importador de enemigos al combate en 1 clic con estadísticas listas.
- [ ] Habilidades de facción y reglas especiales de líderes.

---

### E. Suplementos y DLCs Oficiales Gratuitos
- [ ] **Serie 12 Days**: Gunmas, Cybermas, Gearmas, Vehiclemas, Cutiemas, REDmas.
- [ ] **Hardened Enemies**: Hardened Mooks, Lieutenants y Mini-Bosses para partidas desafiantes.
- [ ] **Hornet's Pharmacy**: Compuestos químicos, drogas experimentales y venenos.
- [ ] **Woodchipper's Garage**: Armas explosivas y trampas artesanales.
- [ ] **Elflines Online**: Reglas completas del MMO de realidad virtual de Night City.
- [ ] **Reglas de Modo Solitario (Single-Player Mode)**: Tablas de oráculos y eventos de calle.

---

## 🖥️ 3. Interfaz y Experiencia de Usuario (UI/UX)
- [x] **Diseño Visual Militar COMP/CON**:
  - [x] Paneles con corte en ángulo (*chamfered corners*).
  - [x] Tipografía triple: *Rajdhani* (Tech), *Inter* (UI), *JetBrains Mono* (Stats).
  - [x] Feedback háptico en el ratón (`cursor: pointer` y compresión al clic `active:scale-95`).
- [x] **Recuadros Visuales de Armas y Armaduras (`ItemVisualPlaceholder.tsx`)**:
  - [x] Marcos para Pistolas, Rifles, SMGs, Escopetas, Melee y Pesadas.
  - [x] Marcos para Blindaje de Cabeza y Torso.
  - [x] Integración en el combate activo y en las tarjetas del Compendio.
- [x] **Cargador Interactivo**: Consumo de balas por disparo y botón de recarga al vaciarse.
- [x] **Selector de Era**: Interruptor en cabecera entre 2045 RED y 2077 CEMK.
- [x] **Registro de Combate (Dice Feed)**: Desglose completo de fórmula y margen de éxito.
- [ ] **Ficha de Personaje Interactiva (Street Lab)**: Asignación de Puntos de Atributos, compra de habilidades y equipamiento.
- [ ] **Generador de Lifepath Interactivo**: Tiradas de origen cultural, estilo personal, amantes y enemigos.
- [ ] **Panel de Directora de Juego (Fixer Deck)**: Tracker de iniciativa con tiradas grupales y creador de pisos de Red.
