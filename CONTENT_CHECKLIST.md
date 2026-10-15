# CPR OMNI-DECK // Lista Maestra de Adaptación y Contenido (Checklist)

> **PROPÓSITO**: Esta lista permite verificar de un solo vistazo el progreso de adaptación de las reglas, mecánicas y libros oficiales de tu biblioteca de PDFs a la aplicación, sin tener que revisar el código fuente.

**Leyenda de Estados:**
* `[x] COMPLETADO`: Adaptado en código, validado con las reglas oficiales y funcionando en la interfaz.
* `[~] EN PROGRESO`: Estructura o datos parciales cargados, requiere más pulido o módulos secundarios.
* `[ ] PENDIENTE`: En cola de desarrollo planificado.

---

## ⚡ 1. Selector de Era: 2045 (RED) vs 2077 (Edgerunners CEMK)

### ¿Qué cambia y qué se gana al cambiar de Era?
- [ ] **Mapeo de Reglas 2045 (Time of the RED)**:
  - Ciberdecks físicos conectados por cables de interfaz.
  - Escasez de economía de posguerra (Night Markets y precios estándar).
  - Ciberware modular clásico y pérdida de Humanidad tradicional.
- [ ] **Mapeo de Reglas 2077 (Edgerunners Mission Kit)**:
  - **Neuroport Universal**: Todo personaje 2077 inicia con Neuroport (integra teléfono agente, biomonitor, interfaz visual HUD y ranuras de chipware).
  - **Quickhacking**: Reemplaza el netrunning clásico por hackeo rápido inalámbrico en combate mediante memoria RAM.
  - **Categorías de Armas 2077**: 
    - *Power Weapons*: Rebote balístico en superficies.
    - *Tech Weapons*: Carga electromagnética que atraviesa coberturas.
    - *Smart Weapons*: Micro-proyectiles teledirigidos (requiere Smartlink).
  - **Borgware 2077**: Sandevistan Militech "David Martinez", Monocable térmico, Brazos de Gorila 2077.
  - **Reglas de Ciberpsicosis 2077**: Nuevos estados de disociación y estrés neurológico del anime.

---

## 💰 2. Economía, Billetera y Registro de Transacciones (€$)
- [ ] **Billetera de Eurodólares (€$)**: Contador táctil de fondos actuales.
- [ ] **Registro de Transacciones (Ledger)**: Historial detallado de ingresos y egresos.
  - [ ] Entrada de cobro con motivo (ej. *"Pago de Falco por el encargo de la chaqueta: +1.500 eb"*).
  - [ ] Registro de compras en Night Market y sobornos.
  - [ ] Descuentos por coste de vida mensual (Alquiler, Kibble, Prepak).
- [ ] **Acciones Rápidas de Dinero**: Botones rápidos de cobro y pago a miembros del equipo.

---

## 🎒 3. Inventario y Capacidad de Carga (ENC)
- [ ] **Cálculo de Carga Máxima**: Determinado por el atributo `BODY` (Págs. 83 y 105).
- [ ] **Gestión de Ranuras**:
  - Objetos equipados en manos (armas activas, escudos).
  - Objetos en funda / cartuchera de extracción rápida.
  - Mochila / Petate de viaje.
  - Almacén en apartamento / base de operaciones.
- [ ] **Penalizaciones por Sobrecarga**: Reducción automática de MOV al superar el límite de peso.

---

## 🧪 4. Drogas Callejeras y Sistema de Adicción
- [ ] **Catálogo Oficial de Drogas** (Pág. 357 y *Hornet's Pharmacy*):
  - Black Lace (Inmune a penalizaciones de Herida Grave, reduce EMP).
  - Blue Glass (Alucinógeno que aumenta percepción pero desorienta).
  - Smash (Alcohol callejero euforizante).
  - Synthcoke (+1 a REF, riesgo alto de adicción).
- [ ] **Contador de Duración de Efectos**: Temporizador de turnos/horas activo.
- [ ] **Tirada Automática de Adicción**: DVs de Adicción Primaria y Secundaria con seguimiento de síndrome de abstinencia.

---

## 🌦️ 5. Clima y Peligros Ambientales (Night City Weather DLC)
- [ ] **Selector de Clima Activo**:
  - Lluvia Ácida (*Acid Rain*): Desgaste progresivo de SP de armadura cada 10 minutos.
  - Tormenta de Polvo (*Dust Storm*): Penalizador a tiradas de ataque a distancia mayores de 12m.
  - Smog Tóxico: Tiradas de salvación contra toxinas sin respirador.
  - Ola de Calor (*Heat Wave*): Fatiga y mayor consumo de agua.
  - Cielo Rojo Sangre (*Blood Red Sky*): Visibilidad reducida y efecto atmosférico.

---

## 🧠 6. Terapia, Humanidad y Salud Mental
- [ ] **Seguimiento de Empatía Base vs Ajustada**:
  - Base EMP recalculada automáticamente según la pérdida total de Humanidad (HL).
  - Alertas visuales al entrar en riesgo de Ciberpsicosis (Humanidad < 10).
- [ ] **Calculadora de Terapia Oficial** (Pág. 229):
  - Terapia Estándar (Coste en eb, tirada de recuperación de Humanidad).
  - Terapia Extrema para Borgware.
  - Registro de sesiones de terapia y recuperación con tirada de dados.

---

## 🎭 7. Habilidades Específicas de los 10 Roles
- [ ] **Lawman (Backup / Refuerzos - Pág. 159)**:
  - **Generador/Spawner de Refuerzos en 1 Clic**: Según el rango del Lawman (Rangos 1-4: 2 Policías de patrulla; Rangos 5-7: 2 Agentes de investigación; Rangos 8-9: Equipo SWAT de 4 agentes; Rango 10: Equipo Max-Tac).
  - Al pulsar el botón, **spawnea instantáneamente las fichas completas de los policías en el combate**.
- [ ] **Exec (Teamwork - Pág. 154)**:
  - Selector de equipo corporativo: Guardaespaldas, Chofer, Netrunner o Técnico con sus fichas completas precargadas.
  - Cobertura médica corporativa de Trauma Team (Silver/Executive).
- [ ] **Medtech (Medicine - Pág. 150)**:
  - Asignación de puntos a Cirugía, Medicina de Campo y Farmacéutica.
  - Fabricación de compuestos (Speedheal, Steroids, Antibiotics).
- [ ] **Tech (Maker - Pág. 148)**:
  - Sistema de Fabricación, Modificación, Mejora e Invención de tecnología con tiempos y DVs.
- [ ] **Solo (Combat Awareness - Pág. 147)**:
  - Asignador de puntos de combate al iniciar la iniciativa: *Damage Absorb, Initiative Reaction, Precision Attack, Spot Weakness, Threat Detection*.
- [ ] **Netrunner (Interface - Pág. 148)**:
  - Contador de Acciones de Red (Net Actions) por turno según el Rango de Interfaz.
  - Acciones rápidas de escaneo, backdoor, control y virus.
- [ ] **Fixer (Operator - Pág. 160)**:
  - Niveles de acceso de mercado (Everyday, Costly, Premium, Expensive, Very Expensive, Luxury, Super Luxury).
- [ ] **Nomad (Moto - Pág. 162)**:
  - Acceso al garaje familiar y mejoras de chasis/armamento de vehículos.
- [ ] **Rockerboy (Charismatic Impact - Pág. 145)**:
  - Control de masas y rangos de admiradores.
- [ ] **Media (Credibility - Pág. 152)**:
  - Rueda de rumores pasiva y tiradas de publicación de exclusivas.

---

## 👥 8. Compendio de PNJs y Fichas Precargadas
- [ ] **Personajes Legendarios y de Ficción**:
  - **Adam Smasher** (Ficha completa de combate con estadísticas máximas, Sandevistan, Metalgear y lanzamisiles).
  - **Personajes de Edgerunners**: David Martinez, Lucy, Rebecca, Maine, Falco, Kiwi, Pilar, Dorio.
- [ ] **Biblioteca de Facciones de Danger Gal Dossier**:
  - NCPD y Max-Tac.
  - Pandillas: Maelstrom, Tyger Claws, 6th Street, Valentinos, The Mox, Voodoo Boys.
  - Megacorporaciones: Arasaka, Militech, Trauma Team, Kang Tao, Petrochem, Biotechnica.
- [ ] **Enemigos Genéricos (Mooks & Hardened)**:
  - Boostergangers débiles, matones callejeros, tenientes blindados y mini-jefes.

---

## 🦾 9. Maniquí Anatómico de Ciberware estilo Cyberpunk 2077
- [ ] **Silueta de Esqueleto Humanoide en Pose Neutral**:
  - Vista gráfica interactiva del cuerpo.
- [ ] **Nodos de Instalación con Iconos Clicables**:
  - *Cortex Frontal / Procesador Neural*.
  - *Sistema Ocular (Ciberojos izquierdo y derecho)*.
  - *Sistema Auditivo (Ciberoídos)*.
  - *Sistema Circulatorio (Biomonitor, Blood Pump)*.
  - *Sistema Nervioso (Kerenzikov / Sandevistan)*.
  - *Sistema Tegumentario (Subdermal Armor / Skinweave)*.
  - *Esqueleto (Linear Frame Sigma/Beta)*.
  - *Brazos (Brazo izquierdo, Brazo derecho, Armas Pop-up, Gorilla Arms, Mantis Blades, Monowire)*.
  - *Piernas (Pierna izquierda, Pierna derecha, Jump Boosters)*.
- [ ] **Panel Lateral de Detalles al pulsar un nodo**:
  - Muestra el implante, ranuras de opciones ocupadas/libres, coste de Humanidad y nivel de instalación médica (Mall, Clínica, Hospital).

---

## ⚡ 10. Cyberdecks y Quickhacking 2077
- [ ] **Interfaz de Cyberdeck 2077**:
  - Selector de Cyberdeck (Arasaka Mk.4, Militech Paraline, Netwatch Netdriver, Tetratronic Rippler).
  - Monitor de **Memoria RAM disponible vs Máxima**.
- [ ] **Catálogo de Quickhacks con Placeholders Visuales 2077**:
  - *Combate*: Cortocircuito (Short Circuit), Sobrecalentamiento (Overheat), Falla de Ciberware (Cyberware Malfunction), Sinapsis (Synapse Burnout).
  - *Control*: Reinicio de Óptica (Reboot Optics), Bloqueo de Armas (Weapon Glitch), Inmovilizar (Crippled Movement).
  - *Sigilo*: Ping, Borrado de Memoria (Memory Wipe).
  - *Supremos*: Suicidio (Suicide), Ciberpsicosis (Cyberpsychosis).
- [ ] **Cálculo de Dificultad (DV) y Consumo de RAM** por cada hackeo rápido.

---

## 📥 11. Importador Universal de Fichas de Personaje
- [ ] **Soporte de Formatos**:
  - Exportaciones de la Companion App oficial (códigos de compartir y JSONs).
  - Formato JSON estándar de Omni-Deck.
  - Extractor / escáner de PDFs de hojas de personaje rellenables oficiales.
- [ ] **Especificación de Datos Requeridos para Importación**:
  - `stats`: INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP (Valores 2-10).
  - `skills`: Diccionario de habilidades con rangos 0-10.
  - `role`: Nombre del rol y rango de habilidad especial (1-10).
  - `vitals`: HP actual/máximo, SP Cabeza/Cuerpo, Humanidad actual/máxima.
  - `weapons`: Lista con IDs de armas, munición actual y accesorios.
  - `armor`: IDs de armadura de cabeza y cuerpo.
  - `cyberware`: Lista de implantes y ubicaciones.
- [ ] **Validador de Esquemas**: Verificación automática de datos con informe de errores amigable si faltan campos.

---

## 🎲 12. Reglas del Core Rulebook ya Adaptadas (Estado Actual)
- [x] **Resolución de Tiradas Básicas**: `STAT + Habilidad + 1d10` contra DV.
- [x] **Críticos y Pifias**: Explosión en 10, deducción en 1.
- [x] **Selector Global de Distancias**: 0-6m, 7-12m, 13-25m, 26-50m, 51-100m, 101-200m, 201-400m, 401-800m.
- [x] **Tabla Oficial de DVs por Arma (Pág. 174)**: Pistolas, SMGs, Escopetas, Rifles de Asalto, Francotiradores, etc.
- [x] **Detección de Zona Óptima**: Marcador verde `★ ÓPTIMO`.
- [x] **Modo Autofire**: Consumo de 10 balas y multiplicador de daño por margen de éxito.
- [x] **Puntos de Vida y Herida Grave**: Barra de HP con alerta al llegar al 50%.
- [x] **Blindaje Cabeza y Torso**: Contador numérico, ablación `[-1]` y reparación.
- [x] **Heridas Críticas de Cabeza y Cuerpo (Págs. 187-188)**: 22 heridas con mecánicas, iconos dinámicos y botón `[ TRATAR / CURAR ]`.
- [x] **Recuadros Visuales e Iconos (`ItemVisualPlaceholder.tsx`)**: Para armas, blindajes, ciberware y programas.
- [x] **Cargador Interactivo**: Descuento de proyectiles en tiempo real y recarga.
