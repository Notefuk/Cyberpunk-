# CPR OMNI-DECK // Project Status & Master Development Roadmap

> **ESTADO DEL PROYECTO**: Versión Activa **`v5.42.0`** (Plan 33 II: Invented Tech Upgrades) en `claude/plan33-v5.42.0`, sin pushear; en `main`, la beta y prod está la v5.40.0 [Claude Code · 2026-11-14]
> **FECHA DE CORTE**: [Claude Code · 2026-10-28]  
> **PLAN ACTIVO**: ninguno en curso [Claude Code · 2026-11-14]. Último terminado y publicado: plan 32 (Danger Gal Dossier). Estado de todos los planes en `docs/plans/README.md`.  
> **ARQUITECTURA**: React 19 + TypeScript 5.8 + Vite + Tailwind CSS v4 + Zustand 5  
> **ALINEACIÓN**: Reglas oficiales Cyberpunk RED Core Rulebook + CEMK 2077 + Interface RED Vol. 1-4 + Danger Gal Dossier.

---

## 🧭 0. Planes y estado vivo [Claude Code · 2026-10-23]

> Pendientes y temas sin plan. El estado de cada plan está en `docs/plans/README.md`, el avance paso a paso en `CHECKPOINT.md` y qué es cada documento en `docs/INDEX.md`. Lo histórico de v4.0.x está en `docs/archive/`.

[Claude Code · 2026-10-24] El estado de cada plan está **solo** en `docs/plans/README.md` (fuente única; antes se repetía acá y se desfasaba).

**Pendiente de planes aprobados**: nada [Claude Code · 2026-11-14]. Los cuatro pendientes que había acá se hicieron: Black Chrome con su catálogo de vehículos (plan 26), Danger Gal con su New Gear (plan 32) y los docs con totales reales (cierre de los planes 5 y 6).

**Sin plan todavía (unos 4 planes):**
- **Combate**: discrepancias 16-19 y 21-23 (Evasion contra disparos, Aimed Shot, umbral de Seriously Wounded, Mortally Wounded, Voice Stress Analyzer, costo y HL del ciberware que está en los dos libros, y si las armas del Core usan Power/Smart/Tech).
- ~~**Fichas entre dispositivos**~~: ahora es el plan 16 (Firebase). [Claude Code · 2026-10-24]
- **Modo Settings y GM Master Screen** (`FixerDeckView.tsx`).
- **Libros nuevos**: ~~Interface RED Vol. 1-3~~ (hecho en el plan 27, sin Elflines) [Claude Code · 2026-11-14], Gang Guide, Woodchipper, Must-Have Cyberware y Midnight with the Upload. Probablemente un plan por libro.
- **Módulos premium** (ideas viejas de v4.0): Night City 2045 como atlas interactivo y ~~Solo of Fortune (armaduras ACPA)~~ (hecho en el plan 30) [Claude Code · 2026-11-14]. Detalle en `docs/archive/handoff-roadmap-y-premium.md`. [Claude Code · 2026-10-24]

**Arreglos chicos anotados:**
- La mejora de armadura del Maker usa siempre 100 €$ y DV 17 (la ficha no guarda el precio de la armadura).
- El bestiario no trae Trading (el Haggle contra un enemigo usa 0).
- Desborde horizontal en celular: Street Lab, barra de pestañas de la vista de roles y barra del centro del HUD.
- El Range Upgrade del cyberdeck (Core p.208) no está en el modelo de ficha.
- ~~Seguridad: revocar el token de GitHub de la URL del remote `origin`~~: hecho (checkpoint da562f5). [Claude Code · 2026-10-24]

---

## 🔒 1. Matriz de Cumplimiento de Contratos Técnicos

* **Cero Desviación de Reglas**: Todas las mecánicas (DVs, tablas de rango, ablación, críticos, STATs) replican estrictamente los manuales impresos de R. Talsorian Games.
* **Arquitectura Offline-First**: Toda la información y estados se persisten en `localStorage` del navegador y en los catálogos JSON/TS empaquetados en el bundle, permitiendo ejecución en búnker sin conexión.
* **Integridad del Bundle**: 0 errores de TypeScript (`tsc -b --noEmit`) y 0 advertencias críticas en el empaquetado de producción (`npm run build`).

---

Las secciones 1 a 3 de v4.0.2 (resumen, módulos, roadmap por fases) están en `docs/archive/status-v4.0.2-secciones-1-a-3.md`. [Claude Code · 2026-10-24]
