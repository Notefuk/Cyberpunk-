# Cyberpunk RED & 2077 // Omni-Deck Companion App & GM Command Hub

[![Cyberpunk RED](https://img.shields.io/badge/System-Cyberpunk%20RED-red.svg)](https://talsorianstore.com/collections/cyberpunk)
[![CEMK 2077](https://img.shields.io/badge/Era-2077%20Edgerunners%20Mission%20Kit-yellow.svg)](https://talsorianstore.com/collections/cyberpunk)
[![Version](https://img.shields.io/badge/Version-v3.5.0-cyan.svg)](CHANGELOG_AND_ARCHITECTURE.md)
[![Live Web App](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-emerald.svg)](https://notefuk.github.io/Cyberpunk-/)

> **OMNI-DECK** es una aplicación web táctica, modular y de alto rendimiento inspirada en el modelo COMP/CON, diseñada como estación de combate, hoja de personaje viva, ripperdoc interactivo y centro de mando para el Director de Juego tanto para **Cyberpunk RED (Era del Rojo, 2045)** como para **Cyberpunk 2077 (Edgerunners Mission Kit - CEMK)**.

🌐 **Aplicación Web Desplegada en Vivo**: [https://notefuk.github.io/Cyberpunk-/](https://notefuk.github.io/Cyberpunk-/)

---

## ⚡ Características Principales y las 9 Pestañas del Omni-Deck

La interfaz superior (**TopHudBar**) proporciona acceso instantáneo y persistente a las 9 herramientas maestras del sistema con monitoreo de vitals (HP, SP Cabeza/Cuerpo, Humanidad, Suerte LUCK):

### 1. 🎯 Combate Activo (`CombatHudView.tsx`)
- **Matriz de DVs por Metro Oficial (`rangeTables.ts`)**: 8 rangos de distancia (`0-6m` a `401-800m`) con resaltado automático del **punto óptimo** (`★ ÓPTIMO`).
- **Tiradas Desacopladas de Acierto y Daño**: Resolución canónica de `STAT + Skill + 1d10` con explosión en `10` y pifia en `1`. Tirada separada de `Xd6` con detección automática de dos o más `6`s para infligir **Herida Crítica** (+5 HP).
- **Ablación de Blindaje en Tiempo Real**: Comparación directa contra el SP de la localización impactada reduciendo 1 punto de SP (o 2 con munición perforante).
- **Selector Interactivo de Disparos Apuntados**: Penalizador canónico automático de `-8`, restricción ROF 1, Cabeza (`×2` daño penetrante), Pierna (`Broken Leg -4 MOVE`), Objeto Sostenido (`Disarm`).
- **Autofire y Fuego Supresivo**: Consumo automático de 10 proyectiles, multiplicación `Margen * 2d6` y área de 6×6m.
- **Artes Marciales Avanzadas (*Cyberfists of Fury*)**: 23 estilos de artes marciales y 46 movimientos especiales integrados con validación de requisitos de STATs y DVs.

### 2. 🧬 Personaje Bio & Street Lab (`StreetLabView.tsx`)
- **Hoja de Personaje Viva y Vitals**: 10 Estadísticas Primarias (INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP) y 16 habilidades con contadores reactivos.
- **Cálculo Matemático Canónico (`characterEngine.ts`)**: Puntos de Golpe (`MaxHP`), umbral de Herida Grave (`Seriously Wounded` con penalizador `-2`), Empatía/Humanidad y Death Save.
- **Heridas Críticas Interactivas (2d6)**: Tablas completas del Core Book (pg. 187-188) para Cabeza y Cuerpo con botones de `[ TRATAR ]` y `[ CURAR ]`.
- **Economía y Gestión de Carga**: Cartera de Eurodólares (€$) con registro de transacciones, cálculo de peso según BODY y toggle de penalización por sobrepeso situacional.
- **Conmutador Full Body Conversion (FBC)**: Integración con *Going Metal* para transformar al personaje en cyborg con chasis intercambiables e inmunidades de borgware.

### 3. 🛠️ Creador de Personajes Guiado (`CharacterCreatorWizard.tsx`)
- **Asistente en 6 Pasos**: Métodos oficiales *Streetrat* (plantillas rápidas), *Edgerunner* (tiradas balanceadas) y *Complete Package* (asignación por puntos) + plantillas 2077 (*CEMK*).
- **Lifepath Canónico Interactivo**: Generador por tiradas o redacción libre con módulo detallado de aliados y enemigos.
- **Economía Inicial Automatizada**: `2,550 €$` en equipo inicial, `800 €$` en moda/estilo, paquetes de equipo por Rol y opción "Empezar con Deuda / Vender el Alma".
- **Tooltips Explicativos**: Onboarding táctico con guía de reglas y descripciones de habilidades para jugadores novatos.

### 4. 🦾 Cyberware Ripperdoc 2077 & Going Metal (`CyberwareRipperdocView.tsx`)
- **Maniquí Holográfico Táctico**: Silueta corporal en A-Pose con conectores interactivos hacia las 8 ranuras anatómicas y Fashionware.
- **Catálogo de 96 Implantes Core + 16 FBCs**: Instalación visual con consumo de Humanidad, ranuras de opción, telemetría de SP y soporte de chasis FBC (*Going Metal*).
- **Reglas Ripperdoc**: Tirada de cirugía y pérdida de Humanidad (Nd6) con cálculo reactivo sobre el pool de EMP.

### 5. 💻 Netrunning 2045, Quickhacks 2077, Garaje & 10 Roles (`NetAndRolesDeckView.tsx`)
- **Simulador de Pisos de Red 2045**: Recorrido piso a piso de arquitecturas NET con Archivos DV, Contraseñas, Nodos de Control y combate interactivo contra Black ICE (27 programas canónicos). Contador de Acciones de Red (Net Actions) según Rango de Interfaz.
- **Sistema de Quickhacking 2077**: Hackeo en combate inalámbrico mediante memoria RAM y ciberware compatible (Short Circuit, Overheat, Cyberware Malfunction).
- **Garaje de Vehículos y Monturas**: Seguimiento de SDP (Puntos de Daño Estructural), blindaje SP, armas montadas y maniobras de conducción.
- **Consolas Dedicadas para los 10 Roles Oficiales**:
  - **Solo**: Reparto táctico de puntos de *Combat Awareness* (Damage Soak, Precision Attack, Threat Detection, etc.).
  - **Medtech**: Especializaciones de *Medicine* (Farmacia con síntesis de drogas, Cirugía y Criogenia).
  - **Tech**: Especialización *Maker* (Fabricación, Modificación, Invención y Reparación).
  - **Nomad**: Especialización *Moto* (Mejoras mecánicas y flotas de vehículos).
  - **Rockerboy, Netrunner, Fixer, Media, Exec y Lawman**: Herramientas específicas de rol.

### 6. 📚 Compendio Doble: 391 Ítems Canónicos & 8 Sistemas de Expansiones (`CompendiumView.tsx`)
- **Catálogo Maestro Multi-Libro (391 Ítems)**: Armas, blindajes, accesorios, municiones especiales, ciberware, drogas, equipo general, cyberdecks y programas extraídos directamente de los libros oficiales (*Core Rulebook, Black Chrome, CEMK 2077, Danger Gal Dossier, Interface RED*).
- **Filtros por Libro Origen (`sourceBook`)**: Badges visuales temáticos, búsqueda por texto libre y sinopsis de cada manual.
- **Equipamiento Directo en 1 Clic**: Botones de equipar en mano principal/secundaria, armaduras de cabeza/cuerpo e instalación de ciberware sin fricción.
- **Compendio de 8 Sistemas de Reglas de Expansiones (`expansionRulesData.ts`)**: Reglas de Full Body Conversions (*Interface RED Vol 3*), Reglas de la Era 2077 (*CEMK 2077*), drogas avanzadas (*Hornet's Pharmacy*), etc.

### 7. 📦 Gestor de Paquetes .cprpack (`DataPacksView.tsx`)
- Arquitectura desacoplada estilo COMP/CON para inspeccionar, cargar y validar paquetes de datos modulares en formato JSON estándar (`.cprpack.json`).

### 8. 🕶️ Consola GM Fixer & Bestiario de 162+ Enemigos (`FixerDeckView.tsx` & `EnemiesCompendiumPanel.tsx`)
- **Consola del Director de Juego con PIN Local (`0000`)**: Alternador entre vista de jugador y panel del GM.
- **Tracker Táctico Multiobjetivo**: Iniciativa dinámica, seguimiento grupal de HP/SP de esbirros y bosses, y tiradas grupales.
- **Bestiario Completo de 162+ Adversarios**: 44 enemigos Core/Tales of the RED + 118 PNJs oficiales de *Danger Gal Dossier* en 15 facciones (Arasaka, Militech, Maelstrom, Tyger Claws, Trauma Team, etc.) con inyección instantánea al combate.
- **Herramientas de Campaña**: Notas secretas por escena, generador de botín aleatorio y registro cronológico de eventos.

### 9. 🚂 Aventura Oneshot Oficial: Red Chrome Cargo CEMK 2077 (`RedChromeCargoView.tsx`)
- **Centro de Mando Táctico en 2 Columnas**:
  - **Columna Izquierda (Mapa Permanente)**: Plano esquemático canónico del tren Maglev Hammerhead extraído del PDF oficial (`hammerhead-map.png`) con visor zoom de pantalla completa, grilla interactiva de 4 vagones (*Rear, Middle, Front, Driver*), fichas descriptivas y botonera 2×3 para las 6 tiradas de habilidad de la escena con selector de personaje activo.
  - **Columna Derecha (3 Pestañas Tácticas)**:
    1. *👹 Enemigos, Armadura, Cyberware 2077 & Loot*: Escalado automático según cantidad de jugadores (2 a 7 PJs) y modo de era (2077 CEMK vs 2045). Fichas maestras tácticas con desglose de armaduras, armas, ciberware con vulnerabilidades de Quickhacks y botín saqueable con 1 clic directo a la cartera o inventario del PJ activo.
    2. *💻 Mainframe (5 Pisos NET) & Las 4 Cajas / Pago Hornet*: Nodos Backdoor, Eye-Dee de Manifiesto Militar Militech, combate contra Black ICE Hellhound (20 REZ), anulación de torreta, gestión de las 4 cajas con ocupación de manos y botón dorado de pago automático de Hornet (`2,000 €$` a cada PJ).
    3. *📰 Screamsheet Original & Historia / Notas GM*: Imagen canónica del periódico Night City Today (`screamsheet-p2.png`) con zoom, artículo bilingüe inglés/español y Modo Jugadores sin spoilers de GM.
- **Roster Precargado de los 7 Edgerunners CEMK**: David Martinez, Lucy, Rebecca, Maine, Kiwi, Falco y Pilar listos para jugar con sus armas icónicas, ciberware y estadísticas oficiales.

### 10. 📜 Portal de Documentación & Changelog In-App (`SystemChangelogAndDocsView.tsx`)
- Pestaña dedicada para consultar toda la documentación del sistema sin abandonar la aplicación web: historial interactivo de versiones (`v1.0.0` – `v3.5.0`), inventario en vivo del catálogo, diagrama de arquitectura técnica desacoplada y estado del roadmap de desarrollo.

---

## 🗺️ Estructura Real del Proyecto

```text
cpr-omni-deck/
├── .agent/
│   └── skills/
│       └── cpr-pdf-extractor/
│           └── SKILL.md                  # Protocolo de extracción CLI y esquema .cprpack.json
├── data/
│   └── core-rules.cprpack.json           # Catálogo maestro canónico (272 ítems oficiales)
├── scripts/
│   ├── extract_core_pack.py              # Ingesta y validación real de páginas del Core Rulebook
│   ├── find_sections.py                  # Inspector de bookmarks y outline del PDF
│   └── inspect_pdf_pages.py              # Inspector CLI UTF-8 de páginas por rango
├── frontend/
│   ├── public/
│   │   ├── hammerhead-map.png            # Plano esquemático canónico del tren Hammerhead
│   │   └── screamsheet-p2.png            # Recorte canónico original del Screamsheet pág. 2
│   ├── src/
│   │   ├── components/
│   │   │   └── ItemVisualPlaceholder.tsx # Frames tácticos vectoriales por categoría
│   │   ├── data/
│   │   │   ├── characterCreationData.ts  # Catálogo canónico de creación, Lifepath y pregenerados
│   │   │   ├── core-rules.cprpack.json   # Catálogo maestro multi-libro (368 ítems canónicos)
│   │   │   ├── criticalInjuries.ts       # Tablas oficiales 2d6 de heridas críticas (Head/Body)
│   │   │   ├── cyberfistsMartialArtsData.ts # 23 artes marciales y 46 movimientos (Interface RED 4)
│   │   │   ├── enemiesCatalog.ts         # Bestiario táctico de 44 enemigos Core/Tales + 118 Danger Gal
│   │   │   ├── expansionRulesData.ts     # Compendio de 8 sistemas de reglas de expansiones (FBC/2077)
│   │   │   ├── goingMetalFbcData.ts      # 13 chasis FBC, 16 cyberware borg e inmunidades (Interface RED 3)
│   │   │   ├── netAndRolesData.ts        # Arquitecturas de red 2045, Quickhacks 2077 y 10 Roles
│   │   │   ├── rangeTables.ts            # Matrices oficiales de DVs por metro y Autofire
│   │   │   ├── redChromeCargoData.ts     # Misión oficial Red Chrome Cargo CEMK 2077
│   │   │   ├── rulesCheatSheet.ts        # Machete canónico de reglas de combate y coberturas
│   │   │   └── systemDocsAndChangelogData.ts # Base de datos de versiones, inventario y arquitectura
│   │   ├── engine/
│   │   │   ├── characterEngine.ts        # Motor matemático: HP máx, humanidad, penalizadores
│   │   │   └── combatEngine.ts           # Motor de resolución: d10 explosivo, Xd6, heridas críticas
│   │   ├── features/
│   │   │   ├── combat/
│   │   │   │   └── CombatHudView.tsx     # HUD de combate táctico, selector de DVs y dados
│   │   │   ├── compendium/
│   │   │   │   └── CompendiumView.tsx    # Compendio modular de 8 categorías con equipamiento
│   │   │   ├── creator/
│   │   │   │   └── CharacterCreatorWizard.tsx # Asistente guiado de 6 pasos para creación de PJs
│   │   │   ├── cyberware/
│   │   │   │   └── CyberwareRipperdocView.tsx # Menú Ripperdoc 2077 con maniquí holográfico
│   │   │   ├── docs/
│   │   │   │   └── SystemChangelogAndDocsView.tsx # Portal in-app de documentación e historial
│   │   │   ├── gm/
│   │   │   │   ├── EnemiesCompendiumPanel.tsx # Bestiario con filtros por facción e inyección
│   │   │   │   └── FixerDeckView.tsx     # Consola GM Fixer con PIN, control global y monitor
│   │   │   ├── layout/
│   │   │   │   └── TopHudBar.tsx         # Barra superior persistente con vitals del edgerunner
│   │   │   ├── netroles/
│   │   │   │   └── NetAndRolesDeckView.tsx # Simulador Netrunning 2045, Quickhacks 2077 y 10 Roles
│   │   │   ├── oneshot/
│   │   │   │   └── RedChromeCargoView.tsx # Centro de mando táctico de Red Chrome Cargo CEMK
│   │   │   ├── packs/
│   │   │   │   └── DataPacksView.tsx     # Gestor de paquetes .cprpack estilo COMP/CON
│   │   │   ├── rules/
│   │   │   │   └── RulesCheatSheetDrawer.tsx # Drawer táctico deslizable con machete de reglas
│   │   │   └── sheet/
│   │   │       └── StreetLabView.tsx     # Ficha completa, editor de stats y roster de personajes
│   │   ├── store/
│   │   │   ├── useCharacterStore.ts      # Store Zustand con persistencia (fichas, inventario)
│   │   │   └── useCombatStore.ts         # Store Zustand de combate (DVs, objetivos, logs)
│   │   ├── types/
│   │   │   └── cyberpunk.ts              # Tipos canónicos de TypeScript de Cyberpunk RED
│   │   ├── App.tsx                       # Integrador de vistas principales del Omni-Deck
│   │   ├── index.css                     # Tokens visuales militares tácticos y chamfered corners
│   │   └── main.tsx                      # Punto de entrada Vite + React
│   ├── index.html                        # Google Fonts (Rajdhani, Inter, JetBrains Mono)
│   ├── package.json                      # React 19 + TypeScript 5.8 + Vite 6 + Tailwind v4
│   └── vite.config.ts                    # Configuración de compilación con base path relativa
├── CHANGELOG_AND_ARCHITECTURE.md         # Registro exhaustivo de arquitectura y changelog maestro
├── CONTENT_CHECKLIST.md                  # Checklist de cobertura de reglas por fases (Fases 0 a 5)
├── README.md                             # ESTE DOCUMENTO
├── Dockerfile                            # Contenedor Docker para ejecución aislada
├── docker-compose.yml                    # Runner multi-plataforma
└── start_app.bat                         # Lanzador en 1 clic para Windows
```

---

## 🚀 Arranque Local y Desarrollo

### Requisitos Previos
- **Node.js**: v18.0.0 o superior (recomendado v20+)
- **NPM**: v9.0.0 o superior

### 1. Iniciar en Modo Desarrollo (One-Click en Windows)
Haz doble clic sobre el archivo `start_app.bat` o ejecuta en la terminal:
```bash
cd frontend
npm install
npm run dev
```
La aplicación se abrirá automáticamente en tu navegador en `http://localhost:5173/`.

### 2. Verificar Compilación y Linter
Para comprobar la integridad tipográfica de TypeScript y la conformidad de estilos sin errores:
```bash
cd frontend
npx oxlint
npm run build
```

---

## 🌐 Despliegue en GitHub Pages

El proyecto está preconfigurado para compilar con rutas relativas (`base: './'`), lo que permite alojar la aplicación directamente en cualquier servidor web estático o GitHub Pages:

1. Ejecuta la compilación de producción:
```bash
cd frontend
npm run build
```
2. La carpeta resultante `frontend/dist/` contiene los archivos estáticos listos para producción (`index.html`, assets optimizados, imágenes y hojas de estilo CSS).
3. Publica la rama o la carpeta `dist/` en GitHub Pages desde **Settings ➔ Pages** en tu repositorio.
