# Plan 10: v4.9.2, herramientas de rol de combate

[Claude Code · 2026-10-22]

Este plan detalla la v4.9.2 del plan 8 (`plan8-roles-core-cemk.md`) y le suma lo que Giuliano decidió el 2026-10-22. Los planes 8 y 9 no se modifican.

## Contexto
Estado del código antes de esta versión:
- **Solo**: de las 6 opciones de Combat Awareness solo se aplica Precision Attack. Spot Weakness solo suma en Cyberfists. Damage Deflection, Initiative Reaction, Threat Detection y Fumble Recovery no tienen efecto. El HUD no tiene contador de Round ni tiradas de Iniciativa o de Perception.
- **Netrunner**:
  - el rango de Interface solo existe para el rol Netrunner;
  - las NET Actions están fijas en 3;
  - los Quickhacks no miran la era ni el Neuroport;
  - el alcance se elige a mano;
  - Red Chrome Cargo usa `roleRank || 4` para cualquier rol.
- **Medtech**:
  - el Speedheal no tiene límite;
  - la síntesis suma Pharmaceuticals + Cryosystem y no cobra;
  - no hay tiradas de tratamiento de Heridas Críticas ni de estabilización (hay un solo botón TRATADA/ACTIVA);
  - no existe reloj de partida.
- **Nomad**:
  - la tirada de vehículo usa una skill fija en 4 y no suma Moto;
  - el motorpool no se limita por rango;
  - sus vehículos genéricos del Core no están en el catálogo.

## Decisiones de Giuliano (2026-10-22)
1. **Round**: contador en el HUD, "Round N" con un botón "Siguiente Round". Al pasar de Round se reinician el primer daño recibido, el primer ataque exitoso, el Quickhack por objetivo y las NET Actions gastadas.
2. **Tiradas de Iniciativa y Perception** en el HUD, con Initiative Reaction y Threat Detection.
3. **Reloj simple de partida**:
   - "Día N · Beat N" con botones "Nuevo Beat" y "Nuevo día", guardado en el dispositivo;
   - el Speedheal queda registrado con paciente, día y Beat (híbrido: 1 por Beat por Medtech y 1 por día por paciente);
   - el paciente se elige entre las fichas guardadas.
4. **Motorpool**:
   - se agregan los vehículos genéricos del Core, con sus stats y página;
   - el Family Motorpool elige entre ellos según el rango de Moto (Core p.162);
   - los modelos con nombre quedan para comprar.
5. **Síntesis de fármacos corregida al Core**: la skill exacta se verifica en el PDF, se cobran los 200 €$ de materiales y solo se sintetizan los fármacos conocidos.
6. **Tabla de Heridas Críticas**: selector propio, independiente del modo 2045/2077. Opciones: "Core 2d6, con amputaciones" o "CEMK 1d6". En CEMK los Quickhacks no generan Críticas (RB p.12). Esto decide la discrepancia 20.
7. **Tratamiento de Heridas Críticas, herramienta completa**:
   - por herida, Quick Fix y Treatment con el skill y el DV del libro;
   - 1d10 + TECH + skill del médico contra el DV;
   - Quick Fix vence con "Nuevo día";
   - Treatment quita la herida;
   - Surgery solo si el médico es Medtech;
   - Treatment no se lo puede hacer uno mismo;
   - Cybertech en las heridas de ciberware.
   El Medtech puede tirar por otros de tres formas:
   - **genérica**: elige el skill y el DV;
   - **con una herida de la tabla**: la elige y tira contra su DV;
   - **con la herida concreta de un jugador**: la elige entre las fichas guardadas y el resultado se aplica a esa ficha.
8. **Estabilización**: TECH + First Aid o Paramedic + 1d10 contra DV10, 13 o 15 según el estado de herida (Core p.222, CEMK RB p.14). Si sale bien, reinicia la penalidad de Death Save. Si estaba Mortally Wounded, queda en 1 HP; en 2045 se agrega la nota de inconsciente 1 minuto (Core p.223).
9. **Lo que sigue del plan 8**:
   - Interface para cualquier rol que tenga override;
   - NET Actions por rango;
   - Quickhacks según la era y el Neuroport;
   - firewall base en los rangos 1-2;
   - alcance 6, 8 o 50 m (Range Upgrade y Cyberdeck Port);
   - Moto suma a las 6 skills de vehículo;
   - el ajuste de 2077 del Nomad.

## Partes (workers con archivos separados)
- **Datos**:
  - `data/creation-src/cemk-critical-injuries.json` y `core-vehicles.json`, con página, generados a `data/creation/`;
  - las cadenas de Quick Fix y Treatment del Core pasan a estructura (`[{skill, dv}]`).
- **Motor puro**, con tests:
  - `engine/medicalRules.ts`: DV de estabilización, tratamientos posibles por herida, quién puede usar Surgery, vencimiento del Quick Fix y síntesis;
  - `engine/combatAwareness.ts`: Damage Deflection, Spot Weakness, Fumble Recovery, Iniciativa y Perception;
  - `getInterfaceRank(sheet)` en `engine/roleRules.ts`.
- **Stores**:
  - `store/gameClockStore.ts`: día, Beat y registro de Speedheal;
  - `store/rulesSettingsStore.ts`: tabla de Críticos;
  - el Round en `useCombatStore`;
  - acciones para modificar heridas y HP de otra ficha.
- **UI**:
  - HUD (`CombatHudView.tsx`): Round, Iniciativa, Perception, efectos del Solo, Interface y NET Actions, Quickhacks, panel de heridas con tratamiento y estabilización;
  - componente nuevo `MedtechTreatmentPanel` (patient, herida, tirada);
  - `NetAndRolesDeckView.tsx`: Netrunner, síntesis, Speedheal con reloj, vehículos con Moto y motorpool;
  - `RedChromeCargoView.tsx`: Interface.

## Verificación
- `tsc`, tests y build.
- **Navegador**:
  - Hardpoint con Damage Deflection en el primer daño del Round y no en el segundo;
  - Iniciativa con +4;
  - Bluescreen con 3 NET Actions;
  - un Netrunner de rango 1 con 2 NET Actions y Quickhacks DV6;
  - Quickhacks bloqueados en 2045 sin Neuroport;
  - Insurance curando a dos aliados (Speedheal bloqueado en el mismo Beat y para el mismo paciente en el mismo día);
  - Treatment de una herida de otra ficha;
  - estabilización;
  - Wrench tirando Drive con +4;
  - motorpool limitado por rango;
  - tabla de Críticos CEMK.
- Celular a 375 px.
