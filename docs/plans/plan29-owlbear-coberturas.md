[Claude Code · 2026-11-12] [Claude Code · 2026-11-20]

> Aprobado por Giuliano el 2026-11-20. Antes de aprobarlo se actualizó: los números de versión pasaron de v5.25.0 y v5.26.0 (que usó el plan 30) a v5.46.0 y v5.47.0, y la línea de `equipShieldPreset` se corrigió contra `main` (v5.45.0). Desde acá el plan es inmutable.

# Plan 29: extensión de Owlbear Rodeo para coberturas

## Objetivo

Dar mapas y tokens a la mesa sin reescribir la app: se usa Owlbear Rodeo como tablero y se le agrega una extensión propia que maneja la cobertura del Core (p.182) como objeto del mapa, con sus HP a la vista de todos.

De paso se corrige la tabla de cobertura de la app, que hoy no coincide con el libro.

## De dónde sale

Giuliano preguntó por pasar todo a FoundryVTT. Se descartó: sería reescribir la interfaz (unas 35.000 líneas de React) y tirar la sincronización. Lo que faltaba eran mapas y tokens, y lo que más le interesa del tablero es el sistema de coberturas.

## Decisiones tomadas con Giuliano (2026-11-12)

| Pregunta | Respuesta |
|---|---|
| Qué entra en la primera versión | Cobertura como objeto y daño a la cobertura. Línea de fuego y DV por distancia quedan para un plan posterior. |
| Quién marca y quién daña | El GM marca un objeto como cobertura. Cualquier jugador le carga daño. Todos ven los HP. |
| Qué pasa a 0 HP | El objeto queda en el mapa marcado como destruido. El GM lo borra o lo restaura. |
| Tabla de la app que no es canon | Se corrige dentro de este plan: una sola tabla con cita, usada por la extensión, la cheat sheet y los presets del HUD. |

## Regla canon (Core p.182, PDF p.183, verificada contra el PDF v1.24)

- Estás a cubierto si estás del todo detrás de algo que para una bala. Si tienen línea de visión, no estás a cubierto. No hay cobertura parcial.
- Una sección de 2 m por 2 m (1 casilla) se ataca igual que a un personaje. A 0 HP la cobertura se destruye.
- El daño que sobra se pierde y no pasa al que está detrás. La excepción son los explosivos (Core p.174).
- La cobertura fina se puede mover un poco; la gruesa no, salvo con BODY 10 o equipo especial.
- La cobertura de acero no recibe daño de Martial Arts ni Brawling, salvo de un personaje con Cyberarm o BODY 10 o más.

| Tipo | Gruesa | Fina |
|---|---|---|
| Steel | 50 HP | 25 HP |
| Stone | 40 HP | 20 HP |
| Bulletproof Glass | 30 HP | 15 HP |
| Concrete | 25 HP | 10 HP |
| Wood | 20 HP | 5 HP |
| Plaster/Foam/Plastic | 15 HP | 0 HP (no es cobertura) |

## Qué está mal hoy en la app

- `frontend/src/data/rulesCheatSheet.ts`, `COVER_HP_TABLE` (líneas 37 a 103): tiene materiales y HP que no están en el libro (drywall 10/20, madera 5/15, metal fino 25/50, ladrillo 25/50, hormigón 25/50, hielo 15/30) y le falta Stone.
- `COVER_RULES_EXPLANATION` (líneas 27 a 35): dice que el excedente pasa con "munición de área o armamento Tech especializado". El libro solo exceptúa los explosivos.
- `frontend/src/features/combat/CombatHudView.tsx`, `equipShieldPreset` (línea 1199 en adelante): presets de cobertura con 15, 25 y 35 SDP, que no salen de la tabla. El texto de ayuda cita "pp. 183-187".
- El Bulletproof Shield de 10 HP hay que verificarlo contra el Core antes de tocarlo.

## Qué verifiqué del SDK de Owlbear (docs.owlbear.rodeo, 2026-11-12)

- Una extensión es un sitio web con un `manifest.json` (`name`, `version`, `manifest_version`, `description`, `action`, `background_url`). Se instala pegando la URL del manifest en Owlbear.
- `OBR.scene.items`: `getItems`, `updateItems`, `addItems`, `deleteItems`, `getItemAttachments`, `getItemBounds`, `onChange`.
- Cada ítem tiene `metadata` para datos propios. La convención es prefijar la clave con un dominio invertido.
- `OBR.contextMenu.create`: entrada en el menú de un ítem seleccionado, con filtros por rol (`GM`, `PLAYER`), por permisos y por claves del ítem, y con un `embed` para mostrar un formulario propio.
- `OBR.scene.grid`: `getScale`, `getDpi`, `getDistance`. No se usa en este plan; queda para el de línea de fuego y DV.

No verificado todavía, se resuelve en el paso 4:

- Si un jugador puede actualizar un ítem que no es suyo. Si no puede, el jugador manda el daño con `OBR.broadcast` y lo aplica el cliente del GM.
- Límite de tamaño del `metadata` y forma exacta de `KeyFilter`.
- Cómo se adjunta una etiqueta de texto a un ítem para que lo siga.
- Cabeceras CORS que pide Owlbear para leer el manifest desde Firebase Hosting (GitHub Pages ya las manda).

## Diseño

### Datos y motor (compartidos por la app y la extensión)

- `frontend/src/data/coverTable.ts` (nuevo): las 6 filas de la tabla, con `id`, nombre del libro, HP gruesa, HP fina y la cita.
- `frontend/src/engine/cover.ts` (nuevo), funciones puras:
  - `coverMaxHp(material, thickness)`: HP según la tabla; `null` para Plaster/Foam/Plastic fina, que no es cobertura.
  - `applyCoverDamage(cover, damage)`: baja los HP, nunca por debajo de 0, marca `destroyed` a 0 y devuelve el excedente perdido para mostrarlo.
  - `canDamageSteelUnarmed(hasCyberarm, body)`: la restricción del acero.
- `frontend/src/engine/__tests__/cover.test.ts` (nuevo): cada caso cita Core p.182, incluido el ejemplo de Gina (concreto grueso 25 HP, 17 de daño, quedan 8).

### Corrección en la app

- `rulesCheatSheet.ts`: `COVER_HP_TABLE` se arma desde `coverTable.ts`; se borran las filas inventadas y se corrige el texto de la excepción.
- `RulesCheatSheetDrawer.tsx`: solo lo necesario para leer la tabla nueva.
- `CombatHudView.tsx`: los presets de cobertura pasan a elegir material y grosor de la tabla; se corrige la cita de página. Edición quirúrgica.
- Si cambia la forma de `shieldCover` guardado, se sube el sufijo de la clave de `localStorage` y se revisa la copia en la nube.

### Extensión

- Vive dentro de `frontend/` como segunda entrada de Vite, para importar `engine/` y `data/` sin duplicar y publicarse junto con la app:
  - `frontend/owlbear/background.html`: registra el menú contextual.
  - `frontend/owlbear/cover.html`: formulario embebido en el menú (marcar, dañar, restaurar, quitar).
  - `frontend/owlbear/index.html`: popover de la acción, con la lista de coberturas de la escena y la tabla.
  - `frontend/src/owlbear/`: código React de esas páginas.
  - `frontend/public/owlbear/manifest.json` e ícono.
  - `frontend/vite.config.ts`: `build.rollupOptions.input` con las páginas nuevas.
- Dependencia nueva: `@owlbear-rodeo/sdk`.
- Queda publicada en `<sitio>/owlbear/manifest.json`, en la beta y en prod.
- Dato guardado en cada ítem, clave `io.github.notefuk.cpr/cover`: `{ material, thickness, maxHp, hp, destroyed }`.
- Flujo:
  1. El GM selecciona una forma o imagen, abre "Cobertura", elige material y grosor. Se guarda el dato y aparece una etiqueta adjunta, por ejemplo `Concrete gruesa 25/25 HP`.
  2. Cualquier jugador selecciona la cobertura, carga el daño y confirma. La etiqueta se actualiza para todos. Si sobra daño, se avisa que se pierde (Core p.182).
  3. A 0 HP el ítem queda semitransparente y la etiqueta dice `DESTRUIDA`. El GM puede restaurarla o borrarla.
  4. Con Steel se muestra el aviso de Martial Arts y Brawling. Los explosivos los resuelve el GM a mano.

## Fuera de alcance

- Línea de fuego entre atacante y blanco, y DV por distancia según el arma.
- Conexión con la app: leer fichas o el encuentro de Firebase desde Owlbear, o devolver daño al HUD.
- Escudo humano y explosivos automáticos.
- Publicar la extensión en la tienda de Owlbear.

## Pasos

1. **v5.46.0, cobertura canon en la app.** `coverTable.ts`, `cover.ts` y sus tests. Verificar el Bulletproof Shield contra el Core.
2. Corregir la cheat sheet y los presets del HUD. Registro en `docs/canon-audit/v5.46.0-cobertura.md`.
3. Cerrar la v5.46.0: `tsc`, tests, build, docs de versión y changelog in-app con `author: 'Claude Code'`.
4. **v5.47.0, extensión.** Resolver los cuatro puntos no verificados del SDK con una prueba mínima en una sala de Owlbear.
5. Entrada de Vite, manifest, página de fondo y menú contextual "Cobertura" para el GM.
6. Formulario de daño para todos, etiqueta adjunta y estado destruida.
7. Popover con la lista de coberturas de la escena y la tabla.
8. Prueba en una sala real con dos navegadores (GM y jugador). La cuenta de Owlbear la pone Giuliano.
9. Cerrar la v5.47.0: docs de versión, changelog in-app y una nota de instalación en el `README.md`.

Publicar (push, beta, prod) se pide con un OK por cada uno, como siempre.

## Criterio de terminado

- `npx tsc -b --noEmit`, `npm test` y `npm run build` con 0 errores.
- La cheat sheet y el HUD muestran solo la tabla del Core p.182.
- En una sala de Owlbear, con el manifest cargado por URL: el GM marca una cobertura, un jugador le carga daño, los dos ven los HP actualizados y a 0 queda destruida.
- El ejemplo de Gina del libro da el mismo resultado en el test y en el tablero.
