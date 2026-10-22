# Plan 9: v4.9.1, motor de roles y avance con IP

[Claude Code · 2026-10-22]

Este plan detalla la v4.9.1 del plan 8 (`plan8-roles-core-cemk.md`, que no se modifica) y le suma lo que Giuliano pidió el 2026-10-22: un contador general de IP y un panel con las skills que no son de combate.

## Decisiones de Giuliano (2026-10-22)
1. **Bajar rango o skill**: solo en modo GM. Fuera del modo GM, el botón − queda deshabilitado.
2. **Modo GM**: un interruptor general en la ficha. Vale para todas las fichas del dispositivo y queda recordado.
3. **Dar IP**: cualquiera puede sumar o restar. Tiene que haber un contador general con los totales de cada situación:
   - ganados;
   - gastados en rol, skills y artes marciales;
   - ajustes manuales;
   - disponibles;
   - historial.
4. **Otras skills**: la ficha suma un panel con las 66 skills del Core (no solo las 16 de combate). Cada una muestra la etiqueta x2 donde corresponde, su nivel y su base, y se sube con IP.
5. Las del plan 8 siguen igual:
   - costos del Core p.410: skill 20 × nivel nuevo, skills x2 40 × nivel nuevo, rango de rol 60 × rango nuevo, sin saltear niveles;
   - los IP de las fichas nuevas arrancan en 0, y las fichas guardadas conservan los suyos;
   - se quita el selector "CEMK simple (+4)";
   - los Folios quedan en rango 4 del Core con su reparto;
   - migración v4 con copia previa.

## Partes
- **Motor puro** (`frontend/src/engine/roleRules.ts`, con tests):
  - costos de IP;
  - NET Actions por rango de Interface (Core p.197);
  - DV máximo de Quickhack (RB p.25);
  - si se pueden usar Quickhacks según la era y el Neuroport (RB p.26);
  - el mejor Reach del Fixer: Core pp. 159-161 contra RB p.25;
  - la información del rango con sus ajustes de 2077;
  - el Speedheal híbrido: 1 por Beat por Medtech y 1 por día por paciente;
  - el reparto de Maker (2 especialidades por rango, tope = rango; discrepancia 24);
  - el reparto de Medicine (1 punto por rango, máximo 5 por especialidad; discrepancias 26 y 27).
- **Datos y store**:
  - en `CharacterSheet` se agregan `makerAllocation`, `medicineAllocation` e `ipLog`;
  - acciones nuevas: `raiseRoleRankWithIp`, `raiseSkillWithIp`, `raiseGeneralSkillWithIp` y `setGeneralSkill`;
  - `adjustImprovementPoints` y `trainMartialArtWithIp` registran cada movimiento en `ipLog`;
  - el default de IP pasa de 120 a 0;
  - el modo GM vive en `cpr_gm_free_edit_v1`;
  - reparto de los Folios en `data/folioRoleAllocations.ts`: Maven Field 4 con 4 libres, Insurance Surgery 2, Pharmaceuticals 1 con Speedheal, 1 libre y Medical Tech 1;
  - migración 3 → 4:
    - `cemk` pasa a `core`;
    - los Folios guardados reciben su reparto;
    - el saldo previo de IP queda como primera entrada del historial.
- **Creador**: se quitan el selector +4 y su texto en el resumen. La ficha nueva sale con `roleAbilityVariant: 'core'`, 0 IP e historial vacío.
- **Ficha (Street Lab)**:
  - el interruptor de modo GM;
  - el contador y el historial de IP;
  - el + de rango y de skills cobra IP (en modo GM edita libre);
  - el − y el selector de rango, solo en modo GM;
  - el panel "Otras skills";
  - el reparto de Combat Awareness, Maker y Medicine en la pestaña de rol.

## Verificación
- `tsc`, tests y build.
- **Navegador**:
  - subir rango y skills con IP;
  - ver que bloquea sin IP;
  - el modo GM;
  - el contador de IP;
  - la migración de una ficha guardada de v3;
  - Maven e Insurance con su reparto;
  - el creador sin el selector;
  - celular a 375 px.
