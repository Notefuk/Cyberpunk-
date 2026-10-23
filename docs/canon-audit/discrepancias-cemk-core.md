# Discrepancias CEMK vs Core RED

[Claude Code · 2026-10-22]

Regla de Giuliano (plan 7): CEMK es el libro más nuevo y tiene prioridad en la creación de personajes, pero **cada discrepancia se le pregunta** antes de implementarla. Este archivo lista las detectadas, con las páginas de los dos libros y el estado.

Páginas: Core = Core Rulebook v1.24, página impresa. RB = CEMK Rule Book, página impresa. Folios = CEMK Character Folios (página del PDF, no tienen número impreso).

## Creación de personajes (decididas en el plan 7)

| # | Tema | CEMK | Core RED | Decisión |
|---|---|---|---|---|
| 1 | Roles | 7 roles (HB p.2) | 10 roles (pp. 30-39) | Los 7 CEMK primero y Media, Exec y Lawman con la etiqueta "Core RED" (RB p.25 lo permite) |
| 2 | Nombre del rol musical | "Rocker" | "Rockerboy" | Se muestra "Rocker" |
| 3 | Habilidad de rol | Versión simple, +4 (Folios) | Completa en rango 4 (pp. 143-162) | Core completa por defecto, con la opción CEMK por personaje |
| 4 | Skills | 46 (RB pp. 2-3) | 66 (pp. 81-85) | Se muestran las 66, cada una con la etiqueta de su libro; se mantiene el costo ×2 del Core |
| 5 | Método de creación | Solo pregens; el RB no trae reglas para crear desde cero (RB pp. 25-27) | Streetrat, Edgerunner y Complete Package (pp. 40-42) | Pregens CEMK primero y los 3 métodos del Core |
| 6 | Lifepath | Tablas rápidas con d6 (RB pp. 19-24) | Tablas completas y por rol (pp. 44-70) | Se elige; CEMK por defecto |
| 7 | Dinero inicial | Lo que imprime cada Folio | 500 €$ + paquete, o 2,550 + 800 €$ (pp. 98, 104-105) | Según el método |
| 8 | Humanidad | Los Folios no la imprimen | EMP×10 menos la HL (p.111) | Regla del Core, también para las pregens CEMK |
| 9 | Neuroport y ciberware del Core | El Neuroport cubre Holophone, Neural Link y Personal Link (RB pp. 35-36) | El paquete del rol trae Agent, Neural Link e Interface Plugs (pp. 103, 117) | En 2077 se quitan del paquete del Core; en 2045 queda intacto |

## Detectadas en la extracción de v4.8.1 (decididas por Giuliano el 2026-10-22)

| # | Tema | Detalle | Estado |
|---|---|---|---|
| 10 | Skill "Surgery" | La ficha de Insurance (Folios) tiene Surgery con BASE 12, pero no está en la lista de skills del RB. En el Core, Surgery es una especialidad de Medicine (Medtech, p.149) | **Decidida**: es canon en los dos libros como skill exclusiva del Medtech que sale de su habilidad de rol. CEMK RB pp. 13-14 (tabla de Críticos p.13 y texto de Treatment p.14): "the Surgery Skill only available to Medtechs"; el Folio de Insurance la da con BASE 12 en su habilidad de rol. En el Core es la especialidad Surgery de Medicine (p.149). No va en la lista general de skills |
| 11 | Check de "Performance" | La regla de COOL (RB p.5) nombra una Check de Performance que no está entre las 46 skills del RB | **Decidida**: se ignora (no se crea skill ni mapeo) |
| 12 | Rango de rol en los Folios | Solo Bluescreen imprime su rango (Interface 4); los otros 6 no lo imprimen | **Decidida**: rango 4 para los 7 |
| 13 | Nombre de la habilidad de rol en CEMK | El RB solo nombra Operator, Moto e Interface; los Folios no imprimen el nombre de las otras 4 | **Decidida**: nombres del Core (Medicine, Charismatic Impact, Combat Awareness, Maker), con la etiqueta "nombre del Core" |
| 14 | Lifepath CEMK, tablas de relación | Las dos tablas "The relationship" (RB p.23) no tienen rótulo. El ejemplo de RB p.24 dice que un 6 da "enemigo vuelto amigo", pero en la tabla ese resultado es el 5 | **Decidida**: gana la tabla impresa (5 = enemigo vuelto amigo, 6 = afición compartida); el ejemplo de p.24 queda anotado como error del libro. La asignación Amigos/Enemigos por contenido se mantiene |
| 15 | Arma de Wrench | La Kang Tao L-69 Zhuo imprime 3d6 en el bloque del arma y 4d6 en la tabla de ataques (Folios) | **Decidida**: se muestran ambos (3d6 del bloque y 4d6 de la tabla de ataques y el modo Shell), con nota en la ficha |

## Roles y rangos (plan 8, v4.9.0) [Claude Code · 2026-10-22]

Decididas por Giuliano al aprobar el plan 8: rangos del Core 1-10 más los ajustes de 2070s (RB p.25); sin versión CEMK +4; NET Actions del Core (p.197); Fixer con el mejor Reach; Speedheal híbrido; Thorn "Solo Core". Las de abajo son lecturas que el libro no deja claras; todas las decidió Giuliano el 2026-10-22.

| # | Tema | Detalle | Decisión |
|---|---|---|---|
| 24 | Tope por especialidad de Maker | El Core (pp. 147-149) dice que cada subida da 1 rango en 2 especialidades distintas; no imprime un tope | **Decidida**: ninguna especialidad supera el rango de Maker |
| 25 | Field Expertise contra el Folio de Maven | Field Expertise 4 suma a Basic Tech, Cybertech, Electronics/Security Tech, Weaponstech y las 3 Tech de vehículos; el Folio (p.25) resume solo dos | **Decidida**: se aplica completa (el Folio es una versión simplificada) |
| 26 | Pharmaceuticals da Medical Tech | En el Core, cada punto en Pharmaceuticals da 1 nivel de Medical Tech (pp. 149-150); el Folio de Insurance no lo lista | **Decidida**: Insurance convertida tiene Medical Tech 1 (su Speedheal exige el punto en Pharmaceuticals) |
| 27 | Puntos de Medicine al rango 1 | El Core no dice si el rango 1 ya trae su punto | **Decidida**: 1 punto por rango (N puntos en rango N) |
| 28 | Reach del Fixer no es monótono | Core p.160: R5-6 Night Market hasta Super Luxury una vez al mes, R7-8 Very Expensive, R9 Luxury, R10 Super Luxury | Se transcribe tal cual; en 2077 rige el mejor Reach (decisión del plan 8) |
| 29 | Believability de Media | Core pp. 151-153: "X de 10" con 1d10, sin decir la comparación | **Decidida**: se cree con 1d10 ≤ Believability más bonos; con más, no se cree |
| 30 | Empate en el Loyalty Save del Exec | Core pp. 153-157: "tirar 1d6 por debajo de la Loyalty" | **Decidida**: el empate falla |
| 31 | Company Netrunner del Exec | Core pp. 153-157: Cyberdeck de 7 slots con 6 programas | **Decidida, no es error**: Killer es Black ICE y la Black ICE propia ocupa 2 slots (Core p.204), así que los 6 programas llenan los 7 |
| 32 | Exec rango 4 | El Core no da beneficio en R4 | Se transcribe tal cual: en 2045 no hay nada; en 2077 queda el ajuste Expensive (RB p.25) |
| 33 | Alcance de Jack In en 2077 | RB p.16 dice 50 m; RB p.26 da 6 m, 8 m "con el hardware adecuado" o 50 m con Cyberdeck Port | **Decidida**: 6 m con cyberdeck común, 8 m con el Range Upgrade del cyberdeck (Core p.208, 100 €$) y 50 m con el Cyberdeck Port del Neuroport (RB pp. 16, 36). RB p.16 resume asumiendo el Cyberdeck Port |

## Creador en 2077 (halladas al probar PJs, decididas por Giuliano el 2026-10-22)

| # | Tema | Detalle | Decisión |
|---|---|---|---|
| 34 | Internal Agent del Fixer y del Exec | Viene en su paquete (Core p.117); el Neuroport trae Holophone (RB pp. 35-36) | **Decidida**: en 2077 se quita del paquete, con la nota "Lo cubre el Neuroport". En 2045 queda |
| 35 | Biomonitor de los paquetes | Es una de las 7 piezas del Neuroport (RB p.35) y varios paquetes lo traen (Core p.117) | **Decidida**: en 2077 se quita; si el libro da una alternativa "o" (Techhair del Exec) se puede elegir. Lo mismo vale para Interface Plugs o Wolvers del Nomad |
| 36 | Nota del Folio en la pestaña de rol | Se mostraba en cualquier personaje del rol | **Decidida**: solo en la ficha del Folio (incluidas las copias del creador); en la guía de roles queda como referencia |
| 37 | Munición Incendiary Shotgun Shell del Medtech | El paquete (Core p.98) la nombra así y no se encontraba en el catálogo | **Decidida**: es la Incendiary Ammunition del Core (p.345, disponible para Shotgun Shells); el paquete apunta a esa entrada |
| 38 | Backup del Lawman en Rango 10 con un 6 | Core p.158: "unless you are Rank 10, in which case two separate backup groups will arrive", sin decir cuáles | **Decidida** (Giuliano, 2026-10-23): llegan dos grupos independientes de Rango 10 (National Law Enforcement). Aplicada en v4.9.3. [Claude Code · 2026-10-23] |

## Martial Arts (plan 14, auditoría del 2026-10-23) [Claude Code · 2026-10-23]

Auditoría de `data/cyberfistsMartialArtsData.ts` contra Core pp. 83, 137, 176-182, 360 y 411 e Interface RED Vol. 4 pp. 73-83: los 55 movimientos (Recovery, 8 del Core y 46 de IR4) coinciden en requisito, DV, una vez por turno, Acción y efecto. Las de abajo las decidió Giuliano el 2026-10-23.

| # | Tema | Detalle | Decisión |
|---|---|---|---|
| 39 | Citas y texto sin fuente | Faltaban las páginas de las formas del Core (pp. 179-180); creación citaba "p.86" (es pp. 81, 88 y 90); "p.181" sobraba; el Neuroport con 2 sockets no citaba fuente (es CEMK RB p.36); frases de ambientación inventadas en el texto de reglas | **Decidida**: se corrige todo según el libro y se quita lo que no tiene fuente |
| 40 | Contact Combat (Krav Maga, IR4 p.79) | La lista de formas, ¿califica al ataque y al movimiento, o solo al movimiento? | **Decidida**: como está escrito en el libro: la herida crítica viene de un ataque o movimiento de Aikido, Boxing, Judo, Karate, Krav Maga o Wrestling |
| 41 | Skill Chip y movimientos especiales | Core p.178 pide "al menos 1 punto en la forma"; p.360 da el chip a nivel 3, sin decir si cuenta | **Decidida**: el chip cuenta; con el chip equipado se usan los movimientos de la forma |
| 42 | Counter Throw (Judo, p.179) | "esquivaste todos los ataques cuerpo a cuerpo desde tu último turno" si nadie te atacó | **Decidida**: hace falta haber esquivado al menos uno |
| 43 | Golpe a la cabeza con −8 (Bone Breaking y Pressure Point, pp. 179-180) | El libro no dice si duplica el daño como un Aimed Shot a la cabeza | **Decidida**: sí, se trata como Aimed Shot a la cabeza (daño doble que pasa la armadura), más la herida |
| 44 | Desarme (Disarming Combination de Aikido, Disarming Technique de Arnis) | El objeto queda "en tus manos o en el piso" sin decir quién elige | **Decidida**: elige el que desarma |
| 45 | STATs clave por forma | El libro no los define; solo DEX para tirar y mínimos en algunos movimientos | **Decidida**: DEX más los STATs que piden sus movimientos, marcado "según los requisitos de sus movimientos" |
| 46 | Mínimo 2d6 con ciberbrazo | Core p.176 lo da a Brawling; la tabla de Martial Arts (p.178) no lo menciona | **Decidida** (al aprobar el plan 14): no aplica a Martial Arts |
| 47 | Herida que no está en la tabla CEMK (1d6) | Pressure Point Strike (Spinal Injury) y Knockout Punch (Broken Jaw): la tabla CEMK (RB p.13) no las tiene | **Decidida** (plan 15): se usa la herida del Core (pp. 187-188) aunque esté elegida la tabla CEMK |
| 48 | Inicio del turno para "una vez por turno" y requisitos del turno | El HUD solo tenía "Siguiente Round" | **Decidida** (plan 15): botón "Fin de turno" en el HUD; "Siguiente Round" también reinicia el registro del turno |

## Combate (van a un plan aparte, después del plan 7)

No se tocan en el plan 7. Se deciden una por una con Giuliano en el plan de combate.

| # | Tema |
|---|---|
| 16 | Evasion contra disparos |
| 17 | Aimed Shot |
| 18 | Umbral de Seriously Wounded |
| 19 | Mortally Wounded |
| 20 | Tabla de Críticos 1d6 (RB p.13) o 2d6 (Core). **Decidida** (Giuliano, 2026-10-22, plan 10): selector propio, independiente del modo 2045/2077, "Core 2d6 con amputaciones" (pp. 187-188) o "CEMK 1d6" (RB p.13); en CEMK los Quickhacks no generan Críticas (RB p.12). Aplicada en v4.9.2. [Claude Code · 2026-10-22] |
| 21 | Voice Stress Analyzer |
| 22 | Costo y HL del ciberware que está en los dos libros |
| 23 | Si las armas del Core usan Power, Smart y Tech (RB p.8) |
