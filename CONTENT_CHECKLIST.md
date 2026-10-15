# CPR OMNI-DECK // Lista Maestra de Adaptación y Contenido (Checklist)

> **PROPÓSITO**: Esta lista permite verificar de un solo vistazo el progreso de adaptación de las reglas, mecánicas y libros oficiales de tu biblioteca de PDFs a la aplicación, sin tener que revisar el código fuente.

**Leyenda de Estados:**
* `[x] COMPLETADO`: Adaptado en código, validado con las reglas oficiales y funcionando en la interfaz.
* `[~] EN PROGRESO`: Estructura o datos parciales cargados, requiere más pulido o módulos secundarios.
* `[ ] PENDIENTE`: En cola de desarrollo planificado.

---

## ⚡ 1. Selector de Era: 2045 (RED) vs 2077 (Edgerunners CEMK)
- [ ] **Mapeo de Reglas 2045 (Time of the RED)**:
  - Ciberdecks físicos conectados por cables de interfaz.
  - Escasez de economía de posguerra (Night Markets y precios estándar).
  - Ciberware modular clásico y pérdida de Humanidad tradicional.
- [ ] **Mapeo de Reglas 2077 (Edgerunners Mission Kit)**:
  - **Neuroport Universal**: Integra teléfono agente, biomonitor, HUD y ranuras de chipware.
  - **Quickhacking**: Hackeo rápido inalámbrico en combate mediante memoria RAM.
  - **Borgware 2077**: Sandevistan Militech "David Martinez", Monocables térmicos, Brazos Gorilla 2077.
  - **Reglas de Ciberpsicosis 2077**: Estados de disociación y estrés neurológico.

---

## 🔫 2. Conversión de Armas 2077: Power, Tech y Smart
- [ ] **Módulo de Conversión de Armas**:
  - *Power Weapons*: Rebote balístico en superficies sólidas para golpear tras esquinas.
  - *Tech Weapons*: Carga electromagnética que atraviesa paredes y coberturas destruyendo su SP/HP.
  - *Smart Weapons*: Micro-proyectiles teledirigidos con Smartlink que ignoran modificadores de cobertura parcial.
- [ ] **Guía Explicativa de Modos de Fuego**:
  - Disparo único (Single Shot).
  - Fuego Supresivo (Suppressive Fire): Zona de 6x6m que obliga a chequeo de concentración/voluntad.
  - Autofire: Ráfaga de 10 balas contra tabla de DVs de Autofire multiplicando el daño por margen de éxito.

---

## 🗄️ 3. Gestión y Persistencia de Fichas (Browser Storage & Modo GM)
- [ ] **Persistencia Total en Navegador (IndexedDB)**:
  - Todas las fichas de jugadores y PNJs se guardan permanentemente en la memoria local del navegador sin necesidad de servidores externos.
  - Cero riesgo de caída de servidores; funciona 100% offline.
- [ ] **Control de Acceso / Contraseña de GM**:
  - Modo Jugador: Solo puede ver y modificar su personaje asignado.
  - Modo Director de Juego (GM): Protegido con PIN/contraseña local para ver el roster completo, editar cualquier ficha y manejar encuentros secretos.
- [ ] **Gestor de Roster**: Subir, descargar, clonar y organizar carpetas de personajes para distintas campañas.

---

## 📖 4. Compendio con Filtro por Libro / Expansión y Saber Específico
- [ ] **Filtro Dropdown por Suplemento**:
  - Filtro exclusivo por libro: *Core Rulebook v1.24*, *Black Chrome*, *Danger Gal Dossier*, *Interface RED Vol 1-3*, *Edgerunners Mission Kit*, *DLCs*.
- [ ] **Ficha de Resumen de Libro (Lore & Mechanics)**:
  - Al seleccionar un suplemento, muestra una vista de resumen con:
    - El contexto y trasfondo histórico del libro.
    - Las nuevas mecánicas exclusivas que introduce (ej. *Interface RED Vol 3*: Reglas completas de Full Body Conversion / Chasis de Cyborgs y mecas).
    - Catálogo filtrado de todos los ítems específicos de ese manual.

---

## 💻 5. Netrunning Clásico (2045) y Generador de Arquitecturas de Red
- [ ] **Simulador de Pisos de Red (NET Architecture Runner)**:
  - Representación visual de la arquitectura piso por piso (Archivos cifrados, Nodos de Control, Black ICE, Contraseñas).
- [ ] **Contador de Acciones de Red (Net Actions)**:
  - Seguimiento de acciones por turno según el Rango de Interfaz del Netrunner.
- [ ] **Combate en la Red**:
  - Ataque a programas hostiles, rez/derez de software y tiradas de Virus.

---

## 🛠️ 6. Sistema Completo de Homebrew y Conversión CP2020
- [ ] **Creador Universal de Ítems Homebrew**:
  - Formulario para crear Armas personalizadas (daño, cargador, modos, DVs).
  - Creador de Ciberware custom con costes de Humanidad y ranuras anatómicas.
  - Creador de Drogas personalizadas con efectos benéficos, secundarios y DVs de adicción.
- [ ] **Módulo de Conversión CP2020 a CPR (*Old Guns Never Die*)**:
  - Reglas oficiales de adaptación para traer armas y equipo clásico de Cyberpunk 2020 a las estadísticas de Cyberpunk RED.

---

## 🏷️ 7. Badges de Libros e Iconos de Armas Míticas
- [ ] **Iconos / Badges de Fuente**:
  - Mini-badges visuales de bajo peso para identificar al instante el origen de cada objeto (*Core*, *BC*, *DGD*, *CEMK*, *IR1*, *IR2*, *IR3*).
- [ ] **Tarjetas de Armas Legendarias y Míticas**:
  - Marcos especiales con ilustraciones / placeholders para armas icónicas del canon (Malorian de Johnny Silverhand, Escopeta de Rebecca "Carnage", etc.).

---

## 🔊 8. Efectos de Audio y Visuales (SFX / VFX Táctiles)
- [ ] **Efectos de Sonido Táctiles (SFX)**:
  - Clic metálico al recargar cargadores.
  - Sonido de disparo al presionar ATTACK.
  - Rodar de dados en la consola de combate.
  - Zumbido cibernético al activar Sandevistan / Kerenzikov.
  - Chisporroteo eléctrico al ser hackeado o recibir daño cerebral.
- [ ] **Efectos Visuales (VFX)**:
  - Micro-glitch en la pantalla al sufrir daño de Netrunning.
  - Pulso rojo en los bordes de la pantalla al entrar en Herida Grave.

---

## 📜 9. Machete de Reglas Rápidas (Cheat Sheet de Bolsillo)
- [ ] **Panel de Reglas Rápidas en 1 Clic**:
  - **Presa y Agarre (Grapple)**: Tirada enfrentada de `Brawling`, requisitos de BODY y opciones de acción (arrastrar, usar como escudo humano, derribar).
  - **Asfixia (Chokehold)**: Reglas de ahogamiento (BODY x 2 de daño directo a HP por turno ignorando armadura).
  - **Coberturas y Puntos de Estructura (SP/HP de Objetos)**:
    - Puerta de coche: SP 10 / HP 15.
    - Barrera de hormigón: SP 20 / HP 30.
    - Tabique de pladur / madera: SP 5 / HP 10.
    - Blindaje de búnker corporativo: SP 25 / HP 50.

---

## 🗺️ 10. Mini-VTT Táctico (Cuadrícula de Combate y Coberturas)
- [ ] **Tablero Táctico en Cuadrícula**:
  - Cuadrícula interactiva calibrada en metros/yardas (1 casilla = 2x2 metros).
- [ ] **Colocación de Elementos en 1 Clic**:
  - Tokens de jugadores y pandilleros.
  - Muros y esquinas.
  - Bloques de cobertura simples (coches, barricadas, barreras) con su SP/HP integrado para destruirse con fuego continuado.
- [ ] **Regla de Medición**: Medir distancia exacta entre el atacante y el objetivo para seleccionar la franja de DV automáticamente.

---

## 💰 11. Economía, Billetera y Registro de Transacciones (€$)
- [ ] **Billetera de Eurodólares (€$)**: Contador de fondos actuales.
- [ ] **Registro de Transacciones (Ledger)**:
  - Entrada de cobros por encargo (ej. *"Pago de Falco por la chaqueta: +1.500 eb"*).
  - Descuentos por gastos de vida y compras en Night Market.

---

## 🎒 12. Inventario y Capacidad de Carga (ENC)
- [ ] **Cálculo de Carga Máxima**: Determinado por el atributo `BODY` (Págs. 83 y 105).
- [ ] **Ranuras**: Equipado en manos, funda rápida, mochila y almacén del piso franco.

---

## 🧪 13. Drogas Callejeras y Sistema de Adicción
- [ ] **Catálogo Oficial de Drogas** (Black Lace, Blue Glass, Smash, Synthcoke).
- [ ] **Temporizador de Duración y Tirada de Adicción**: DVs de Adicción Primaria y Secundaria.

---

## 🌦️ 14. Clima y Peligros Ambientales (Night City Weather DLC)
- [ ] **Selector de Clima Activo**: Lluvia ácida, tormenta de polvo, smog tóxico y cielo rojo sangre.

---

## 🧠 15. Terapia, Humanidad y Salud Mental
- [ ] **Seguimiento de Empatía Base vs Ajustada**: Alerta de Ciberpsicosis (Humanidad < 10).
- [ ] **Calculadora de Terapia Oficial** (Pág. 229) para recuperar Humanidad con tirada de dados.

---

## 🎭 16. Habilidades Específicas de los 10 Roles
- [ ] **Lawman (Backup / Refuerzos)**: Spawner en 1 clic de policías de patrulla, detectives, SWAT o Max-Tac según el rango.
- [ ] **Exec (Teamwork)**: Esbirros corporativos precargados (guardaespaldas, chofer, netrunner) y Trauma Team.
- [ ] **Medtech (Medicine)**: Fabricación de fármacos y cirugía.
- [ ] **Tech (Maker)**: Tiempos y DVs de invención, mejora y fabricación.
- [ ] **Solo (Combat Awareness)**: Asignador de puntos de combate en iniciativa.
- [ ] **Fixer, Nomad, Rockerboy, Media, Netrunner**.

---

## 👥 17. Compendio de PNJs y Fichas Precargadas
- [ ] **Leyendas y Edgerunners**: Adam Smasher, David Martinez, Lucy, Rebecca, Maine, Falco.
- [ ] **Facciones de Danger Gal Dossier**: NCPD, Maelstrom, Tyger Claws, Arasaka, Militech, Trauma Team.
- [ ] **Enemigos Genéricos (Mooks & Hardened)**.

---

## 🦾 18. Maniquí Anatómico de Ciberware estilo Cyberpunk 2077
- [ ] **Silueta de Esqueleto Humanoide en Pose Neutral**:
  - Nodos clicables para Córtex frontal, Ojos, Brazos (Gorilla/Mantis/Monocable), Esqueleto y Piernas.
  - Panel lateral con ranuras de opciones y pérdida de Humanidad.

---

## ⚡ 19. Cyberdecks y Quickhacking 2077
- [ ] **Monitor de Memoria RAM** y catálogo de Quickhacks con placeholders visuales.

---

## 📥 20. Importador Universal de Fichas
- [ ] **Soporte de Formatos**: Companion App (códigos/JSON), PDFs oficiales y JSON de Omni-Deck.

---

## 📸 21. Banco de Capturas de la Companion App (Pendiente de Usuario)
- [ ] **Revisión de Features Premium**: Integrar cualquier función útil adicional a partir de las fotos que envíe el usuario.

---

## 🎲 22. Reglas del Core Rulebook ya Adaptadas (Estado Actual)
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
