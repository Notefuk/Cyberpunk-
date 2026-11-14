[Claude Code · 2026-10-21]

# Registro de canonización (plan 5)

Registro de canonización del plan 5: por cada libro, qué se perdió, qué se ganó y qué se corrigió respecto al canon, con libro y página.

| Libro | Estado | Detalle |
|---|---|---|
| Interface RED Vol. 4 — Cyberfists of Fury | Canon completo (v4.5.1) | [v4.5.1-cyberfists.md](v4.5.1-cyberfists.md) |
| Going Metal | Canon (v4.5.0) | — |
| Danger Gal Dossier | Canon completo (plan 32, v5.35.0 a v5.40.0): 15 facciones, 118 fichas con porte CEMK, New Gear, vehículos de facción, NET del CrAB Lord y creador de PNJ guiado. Fuera: la aventura The Incident [Claude Code · 2026-11-14] | [v5.35.0-v5.40.0-danger-gal.md](v5.35.0-v5.40.0-danger-gal.md) |
| Hardened (16 PNJ) | Canon (v4.7.0). El Punknaught entró con la movilidad de Interface RED (v5.17.0, `engine/punknaught.ts`) [Claude Code · 2026-11-14] | `v4.7.0-enemigos-core-cemk-hardened.md` |
| Core Rulebook, PNJ pp. 412-416 (10) | Canon (v4.7.0) | `v4.7.0-enemigos-core-cemk-hardened.md` |
| CEMK, PNJ (14) | Canon (v4.7.0), con porte CEMK para todos | `v4.7.0-enemigos-core-cemk-hardened.md` |
| Red Chrome Cargo | Canon (v4.7.0) | `v4.7.0-rcc-notes.md` |
| Hornet's Pharmacy | Canon (v4.6.2) | [v4.6.2-farmacia-gunmas-errata.md](v4.6.2-farmacia-gunmas-errata.md) |
| 12 Days of Gunmas | Canon (v4.6.2) | [v4.6.2-farmacia-gunmas-errata.md](v4.6.2-farmacia-gunmas-errata.md) |
| Black Chrome y Black Chrome+ | Canon (plan 26, v5.12.0 a v5.14.1) [Claude Code · 2026-11-14] | [v5.12.0](v5.12.0-black-chrome-items.md), [v5.13.0](v5.13.0-black-chrome-vehicles.md), [v5.14.0](v5.14.0-night-markets.md), [v5.14.1](v5.14.1-auditoria-plan26.md) |
| Errata v1.25 | Canon (v4.6.2) | [v4.6.2-farmacia-gunmas-errata.md](v4.6.2-farmacia-gunmas-errata.md) |
| Core Rulebook, creación (pp. 40-119) + Easy Mode + CEMK (RB, Folios) | Datos canon (v4.8.1); wizard en v4.8.2 | [v4.8.1-creador.md](v4.8.1-creador.md), [discrepancias-cemk-core.md](discrepancias-cemk-core.md) |
| Interface RED Vol. 1-3 | Canon con el plan 27 (v5.15.0 a v5.20.0). Solo Elflines Online queda fuera de alcance [Claude Code · 2026-11-10] [Claude Code · 2026-11-11] | [v5.15.0](v5.15.0-fbc-y-ciberware-interface-red.md) a [v5.20.0](v5.20.0-pregens-pnj-interface-red.md) |

## Totales reales [Claude Code · 2026-11-14]
- Pack (`frontend/src/data/core-rules.cprpack.json`): 770 ítems (244 armas, 32 armaduras, 21 attachments, 28 municiones, 212 ciberware, 29 drogas, 177 de equipo, 27 programas).
- Bestiario: 179 fichas (Core 10, CEMK 14, Hardened 16, Interface RED 21, Danger Gal Dossier 118).
- Martial Arts: 27 formas y 54 movimientos (4 del Core y 23 de Interface RED 4).
- La copia vieja `data/core-rules.cprpack.json` de la raíz (371 ítems) se borró [Claude Code · 2026-11-14]: el único pack es el de `frontend/src/data`.
