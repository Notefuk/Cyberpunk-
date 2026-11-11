# Planes de features

Cada feature grande se planifica antes de codear y el plan aprobado se guarda aquí.

- Nombre: `planN-<slug>.md` (ej. `plan1-modo-settings.md`), con el siguiente número libre.
- Firma en la primera línea: `[Claude Code · AAAA-MM-DD]` o `[Antigravity · AAAA-MM-DD]`.
- **Inmutable**: un plan aprobado no se edita nunca. Si cambia, se escribe `planN+1-...` que referencia al anterior.
- El avance contra el plan se registra en `CHECKPOINT.md` (raíz), no aquí.

Contenido sugerido de un plan: objetivo, decisiones tomadas con el usuario (preguntas y respuestas), archivos a tocar, pasos ordenados, reglas/libros citados, criterio de terminado.

## Índice y estado [Claude Code · 2026-10-23]

| Plan | Qué es | Versiones | Estado |
|---|---|---|---|
| 1. `plan1-auditoria-core.md` | Arreglos de la auditoría del Core | v4.0.3 a v4.2.1 | ✅ Terminado |
| 2. `plan2-auditoria-expansiones.md` | Contenido canon de CEMK, Interface RED y Going Metal | v4.3.0 a v4.5.0 | ✅ Terminado |
| 3. (perdido) | Enemigos | — | Lo reemplazó el plan 6 |
| 4. `plan4-ripperdoc-visual-2077.md` | Ripperdoc visual estilo 2077 | v4.6.0 | ✅ Terminado |
| 5. `plan5-canon-audit.md` | Canonizar el contenido inventado | v4.6.1, v4.6.2 y v4.7.0 hechas | ⏳ Faltan Black Chrome con el catálogo de vehículos y los docs con totales reales |
| 6. `plan6-enemigos-canon-cemk.md` | Enemigos canon porteados a CEMK | v4.7.0 hecha | ⏸️ En pausa: v4.7.1 Danger Gal y v4.7.2 New Gear |
| 7. `plan7-creador-personajes.md` | Creador de personajes | v4.8.0 a v4.8.2 + v4.9.4 | ✅ Terminado (el Modo Novato se detalló en el plan 12) |
| 8. `plan8-roles-core-cemk.md` | Roles y rangos Core + CEMK | v4.9.0 a v4.9.3 | ✅ Terminado (detallado en los planes 9, 10 y 11) |
| 9. `plan9-v491-motor-roles-ip.md` | Motor de roles, avance con IP y modo GM | v4.9.1 | ✅ Terminado |
| 10. `plan10-v492-roles-combate.md` | Herramientas de rol de combate | v4.9.2 | ✅ Terminado |
| 11. `plan11-v493-roles-sociales.md` | Herramientas de rol sociales y de oficio | v4.9.3 + arreglo v4.9.3.1 | ✅ Terminado |
| 12. `plan12-v494-modo-novato.md` | Modo Novato del creador | v4.9.4 | ✅ Terminado |
| 13. `plan13-v494-cierre-creador.md` | Cierre del creador: STATs del Core p.72, Grafted Muscle, ciberware repetible | v4.9.4 | ✅ Terminado [Claude Code · 2026-10-24] |
| 14. `plan14-martial-arts.md` | Martial Arts canon | v4.9.5 | ✅ Terminado [Claude Code · 2026-10-24] |
| 15. `plan15-v496-martial-moves-hud.md` | Movimientos especiales de Martial Arts en el HUD | v4.9.6 | ✅ Terminado [Claude Code · 2026-10-24] |
| 16. `plan16-firebase-mesa-online.md` | Firebase: cuentas, fichas en la nube y mesa compartida | v5.0.0 a v5.2.0 | ⏳ v5.0.0 en `main` (PR #34) y en gh-pages como beta; prueba con cuentas reales hecha [Claude Code · 2026-10-27]; falta la estable en Firebase Hosting; siguen v5.1.0 y v5.2.0 [Claude Code · 2026-10-24] |
| 17. `plan17-sync-cuota.md` | Sync a prueba de cuota: v4.9.7 de preparación y capa de sync del plan 16 | v4.9.7 (+ v5.0.0 y v5.1.0) | ⏳ v4.9.7 y la capa de sync de la v5.0.0 hechas; falta la parte de la v5.1.0 [Claude Code · 2026-10-24] |
| 18. `plan18-v5-campanias.md` | v5.0.0 etapa 5: campañas, link de invitación y vista de la party (el GM ya edita las fichas de sus jugadores) | v5.0.0 | ✅ Terminado (v5.0.0, en `main` por el PR #34) [Claude Code · 2026-10-25] |
| 19. `plan19-v510-mesa-compartida.md` | v5.1.0 mesa compartida: reloj y era de la campaña, encuentro unificado y compartido, log de tiradas de la mesa | v5.1.0 | ✅ Terminado: en `main` (PR #37), en gh-pages (beta) y en Firebase prod (estable), probado con cuentas reales [Claude Code · 2026-10-28] |
| 20. `plan20-gm-actua-sobre-la-mesa.md` | Fase 3 del plan 16: el GM actúa sobre los PJ (daño, críticas, condiciones, Humanidad, €$; v5.2.0) y secretos en la nube, revelar y PIN solo local (v5.3.0) | v5.2.0 / v5.3.0 | ⏳ v5.2.0 en `main`, beta y prod; v5.3.0 terminada en código en `claude/v5.3.0-gm` (probada con dos usuarios en el emulador), falta publicarla [Claude Code · 2026-10-28] |
| 21. `plan21-creador-tienda-ficha.md` | Creador más libre (texto libre, STATs, rol arriba, idiomas, skills de arma y Autofire, paquete en Complete Package), tienda con detalle, pestañas, disponibilidad, rebuilds y vivienda, y ficha que explica (STATs, armas, Martial Arts, Medtech) | v5.4.0 / v5.5.0 / v5.6.0 | ✅ Terminado: v5.4.0 y v5.5.0 en `main`, beta y prod; v5.6.0 en `main`, beta y prod [Claude Code · 2026-10-30] |
| 22. `plan22-interface-blackchrome-fbc.md` | Terminar Interface RED 1-4 (todo su contenido, también reglas y Elflines), Black Chrome y Black Chrome+ (con catálogo de vehículos nuevo, borrando lo inventado) y cerrar FBC | v5.10.0 en adelante (tentativos) | 🔁 Reemplazado: Black Chrome por el plan 26 y lo que quedaba (Interface RED y FBC, sin Elflines) por el plan 27 [Claude Code · 2026-11-10] |
| 23. `plan23-streetlab-hud-comodidades.md` | Comodidades: skills favoritas, reparar armadura explicado (Core p.140), comprar desde Street Lab, nombre propio de ítems; bandeja izquierda del HUD | v5.8.0 / v5.9.0 | ✅ Terminado: v5.8.0 y v5.9.0 en `main` (PR #48), beta y prod [Claude Code · 2026-10-30] |
| 24. `plan24-pasar-ficha.md` | Pasarle una ficha de la nube a otro jugador con un código de 24 h (traspaso de dueño); sigue en la campaña si el que la recibe es miembro | v5.10.0 | ✅ Terminado: en `main` (PR #56), beta y prod, con sus reglas [Claude Code · 2026-11-04] |
| 25. `plan25-fichas-fijas-y-npc.md` | Fichas fijas en la nube: suben solas, entran solas a la campaña del jugador y no se borran; fichas de jugador y de NPC (el NPC no lo abre el jugador, va al combate como enemigo) | v5.11.0 | ✅ Terminado: en `main` (PR #58), beta y prod, con sus reglas [Claude Code · 2026-11-06]; arreglo en v5.11.1 |
| 26. `plan26-black-chrome.md` | Todo Black Chrome y Black Chrome+: 166 ítems (borrar los inventados), catálogo de vehículos con Nomad Access (borrar los inventados), generador de Night Markets y Economics 101; reemplaza la parte de Black Chrome del plan 22 | v5.12.0 a v5.14.0 | ✅ Hecho: v5.12.0 (PR #61), v5.13.0 (PR #62) y v5.14.0 (PR #63) en `main`, beta y prod; auditoría y arreglos en v5.14.1 (`docs/canon-audit/v5.14.1-auditoria-plan26.md`) [Claude Code · 2026-11-10] |
| 27. `plan27-interface-red-fbc.md` | Lo que quedaba del plan 22: cierre de FBC, ítems de Interface RED 1-4, movilidad, vivienda, pestaña nueva del GM (logros, cajas, clima, citas, colecciones, chatarra), pregens de Single Shot con Neuroport y PNJ de Jumpstart; Elflines queda afuera | v5.15.0 a v5.20.0 | ⏳ En curso: v5.15.0 en `main` (PR #67), beta y prod; v5.16.0 en `main` (PR #69), beta y prod; v5.17.0 en `main` (PR #71) y prod; v5.18.0 en `main` (PR #73), beta y prod; v5.19.0 terminada en `claude/v5.19.0-pestana-gm`, sin pushear; sigue v5.20.0 [Claude Code · 2026-11-11] |

Pendientes y temas sin plan: `PROJECT_STATUS_AND_ROADMAP.md`, sección 0.
