# Plan 11: v4.9.3, herramientas de rol sociales y de oficio

[Claude Code · 2026-10-23]

Este plan detalla la v4.9.3 del plan 8 (`plan8-roles-core-cemk.md`) con lo que Giuliano decidió el 2026-10-23. Los planes 8, 9 y 10 no se modifican.

## Contexto
Estado del código antes de esta versión:
- **Tech (Maker)**:
  - la tirada de Maker suma TECH + Basic Tech + rango de Maker para cualquier objeto, sin leer el reparto por especialidad (`makerAllocation`);
  - los materiales cuestan la mitad del precio, que no es la regla del libro;
  - solo hay Upgrade Expertise de armas y de armadura;
  - los proyectos de ejemplo ("Modificación Cañón Silenciador", "Fabricación Granada Flashbang") son inventados y se muestran a cualquier ficha.
- **Fixer, Exec, Lawman, Media, Rockerboy**: no hay herramientas, solo la guía de texto generada desde `ROLE_RANKS`. El Fixer tiene `fixerReach` en el motor, pero no tiene UI.
- **Datos**: las tablas de estos roles ya están en `data/creation-src/role-ranks-*.json` con su página, generadas a `ROLE_RANKS.roles.<Rol>.tables`.

## Decisiones de Giuliano (2026-10-23)
1. **Team Members del Exec**: se guardan como un registro dentro de la ficha del Exec, con puesto, fila del d6, STATs, HP actual, Death Save, Loyalty y paquete fijo. No son fichas aparte.
2. **Fin de sesión**: un botón "Fin de sesión" en el reloj de partida, junto a "Nuevo Beat" y "Nuevo día". Hace tres cosas (Core pp. 156-157):
   - recorta la Loyalty a 10;
   - marca como renuncia a quien quedó por debajo de 0;
   - deja pendiente el reemplazo, que llega con Loyalty 1 y descuenta solo los 200 €$ de honorarios de la ficha.
3. **Backup del Lawman**: una tarjeta en el HUD con la cuenta regresiva "llega en N Rondas", que baja con "Siguiente Round". Al llegar muestra:
   - los stats del grupo;
   - el HP de cada agente;
   - un botón de tirada Combat Number + 1d10;
   - la nota de que el Backup no esquiva balas (Core p.159).
4. **Registros en la ficha**: solo los fans del Rockerboy (nombre y tamaño: persona, grupo de hasta 6 o grupo enorme), con el bloqueo de 1 semana si falla un favor. Los contactos del Fixer no se registran.
5. **Skill de Maker**: la app sugiere la skill según el tipo de objeto y el jugador la puede cambiar:
   - arma: Weaponstech;
   - armadura y ropa: Basic Tech o Fashion;
   - ciberware: Cybertech;
   - electrónica: Electronics/Security Tech;
   - vehículo: Land, Sea o Air Vehicle Tech.
   La tirada es TECH + esa skill + rango de la especialidad (de `makerAllocation`) + 1d10 (Core p.148).
6. **Rumores de Media**: tiradas a demanda, sin contador semanal:
   - pasiva: Credibility + 1d10 contra DV 7/9/11/13, y se informa el rumor más alto superado (Core p.151);
   - activa: STAT + skill elegida + 1d10 contra DV 13/15/17/21.
7. **Haggle del Fixer**: la contraparte sale de una ficha guardada, de un enemigo del bestiario o de números escritos a mano.
   - Tirada: COOL + Trading + Operator + 1d10 contra COOL + Trading (+ Operator si la otra parte es Fixer) + 1d10 (Core p.159).
   - El empate lo gana el que se defiende (Core p.129: "In case of a tie, the Defender always wins").
   - Si gana, el Fixer elige un trato de su rango o inferior, uno por transacción.
8. **Favores del Rockerboy**: se muestra la tabla de favores y lugares del libro para el rango actual y los superiores.
   - El favor se escribe libre, y el GM elige el rango que requiere.
   - Si ese rango supera el del Rockerboy, falla automáticamente.
   - Si no, se tira Rango + 1d10 contra DV 8/10/12 según el tamaño del grupo (Core pp. 144-145).

## Reglas que se aplican tal cual el libro (Core, página impresa)
- **Rockerboy** (pp. 144-145):
  - Convertir en fan: Charismatic Impact + 1d10 contra DV 8/10/12, fuera de combate salvo que te detesten. El libro no da penalidad por fallar (`doubts`).
  - Favor fallido: no se puede pedir el mismo favor a los mismos fans durante una semana.
  - En 2077, objetos Expensive pieza por pieza desde R4 (RB p.25).
- **Fixer** (pp. 159-161):
  - tratos por rango: R1-2 ±10%, R3-4 uno gratis cada 5, R5-6 +20% de pago, R7-8 pago en dos cuotas, R9 ±20%, R10 doble pago;
  - Grease por rango, como texto;
  - Reach con `fixerReach` (el mejor valor entre Core y 2077, decisión 28).
- **Media** (pp. 151-153):
  - Believability: 1d10 ≤ Believability + bonos (decisión 29). Los bonos de evidencia son +1 y +2, acumulables hasta +3, y no se gasta LUCK.
  - Access, Audience e Impact se muestran como texto.
- **Exec** (pp. 153-157):
  - beneficios por rango: Signing Bonus, Corporate Housing, Trauma Team; R4 no tiene beneficio (decisión 32);
  - Team Members: 1 desde R3, 2 desde R5 y 3 desde R9. Se elige el puesto (Bodyguard, Covert Operative, Driver, Netrunner, Technician) y se tira 1d6 para la fila de STATs. HP, Seriously Wounded y Death Save salen de BODY y WILL. Usan solo Light Armorjack.
  - Loyalty: arranca en 1d6 + 1 y sube o baja con las tablas del libro.
  - Loyalty Save: 1d6 por debajo de la Loyalty; el empate falla (decisión 30). Con Loyalty 0 o menos, el miembro intenta traicionar.
- **Lawman** (pp. 158-159):
  - Llamada (es una Acción): 1d10 ≤ rango de Backup. Si nadie responde, se reintenta el Turno siguiente.
  - Llegada: 1d6 Rondas. Con un 6 llega el grupo siguiente al llamado, aunque supere el rango (ejemplo del libro en p.158).
  - Se puede llamar a un grupo del rango propio o inferior.
  - En R10 llegan dos grupos, y los 2 agentes siguen en el caso.
  - Combat Number + 1d10 vale como Skill Base ofensiva y defensiva. El SP cubre cuerpo y cabeza.
- **Tech, Maker** (pp. 147-149):
  - Field Expertise: suma su rango a 7 skills de Tech y permite improvisar una reparación como Acción, que dura 10 minutos por rango.
  - Upgrade Expertise: materiales de la misma categoría de precio, 1 mejora por objeto; un vehículo cuenta como 1.000 €$ (Very Expensive).
  - Fabrication Expertise: materiales de una categoría menos (en Super Luxury, la mitad del precio). Un objeto Cheap cuesta 5 €$.
  - Invention Expertise: el GM fija la categoría, mínimo Expensive.
  - DV y tiempo según la tabla de p.149 (`makerDvTime`): 9 y 1 h; 13 y 6 h; 17 y 1 día; 21 y 1 semana; 24 y 2 semanas; 29 y 1 mes; 29 y 1 mes por cada 10.000 €$.
  - Categoría de precio por monto: 10 Cheap, 20 Everyday, 50 Costly, 100 Premium, 500 Expensive, 1.000 Very Expensive, 5.000 Luxury y 10.000 o más Super Luxury (Core pp. 338-339).
  - Si falla, se reinicia con los materiales intactos; si falla una Invention, se vuelve a empezar.
- **Proyectos de ejemplo inventados**: se quitan, y la lista arranca vacía.

## Partes (workers con archivos separados)
- **Motor puro** (`engine/socialRoleRules.ts` nuevo, y `engine/makerRules.ts` nuevo, con tests):
  - Rockerboy: tirada de fan, tirada de favor con bloqueo por rango y por semana.
  - Fixer: Haggle opuesto con empate a favor del que se defiende, y los tratos de su rango o inferiores.
  - Media: rumor pasivo con el DV más alto superado, rumor activo y Believability.
  - Exec: Team Members por rango, generación de un miembro, Loyalty inicial, cambios de Loyalty, Loyalty Save y fin de sesión.
  - Lawman: llamada, llegada (con el 6) y grupos disponibles.
  - Maker: categoría de precio por monto, DV y tiempo, costo de materiales por especialidad, skill sugerida por tipo, tirada y duración del Field Expertise.
- **Datos**: si falta un campo numérico (por ejemplo los DV activos de Media o los tratos de Haggle como lista), se agrega en `data/creation-src/role-ranks-*.json` y se regenera con `scripts/gen_creation.py`.
- **Ficha y stores**:
  - `CharacterSheet` gana campos opcionales `execTeam?` y `rockerboyFans?`; no hace falta migración, solo subir `APP_VERSION`.
  - Acciones del store para esos registros.
  - El estado del Backup del Lawman va en `useCombatStore`, con grupo, Rondas restantes y HP por agente, y baja con `nextRound`.
  - "Fin de sesión" se agrega en `gameClockStore` y `GameClockBar`.
- **UI** (componentes nuevos en `features/roles/`, montados en la pestaña de roles de `NetAndRolesDeckView.tsx`):
  - `RockerboyPanel`, `FixerPanel`, `MediaPanel`, `ExecPanel`, `LawmanPanel` y `MakerPanel`, este último en reemplazo de la tirada de Maker actual;
  - la tarjeta del Backup en `CombatHudView.tsx`;
  - cada panel muestra su página y los ajustes de 2077 donde aplican.

## Verificación
- `tsc`, tests y build.
- **Navegador**:
  - Thorn convierte en fans a un grupo y pide un favor (bloqueado si excede el rango, y bloqueado una semana si falla);
  - Connect regatea contra una ficha guardada, con el empate a favor del que se defiende, y elige un trato de su rango;
  - un Media de rango 4 tira un rumor pasivo y uno activo, y publica con Believability y evidencia;
  - un Exec de rango 5 genera 2 Team Members, les tira Loyalty Save, los daña y cura, y "Fin de sesión" recorta la Loyalty y maneja la renuncia;
  - un Lawman de rango 4 llama al Backup, la tarjeta baja con "Siguiente Round", y con un 6 llega el grupo siguiente;
  - Maven sube un arma con Weaponstech + Upgrade Expertise contra el DV de su categoría y fabrica un objeto con materiales de una categoría menos;
  - celular a 375 px.
