# Plan 4: Ripperdoc visual estilo Cyberpunk 2077 (v4.6.0)

> [Claude Code · 2026-10-21] Aprobado por Giuliano el 2026-10-21. Plan inmutable: el avance va en `CHECKPOINT.md`. Se usa el número 4 porque el plan 3 perdido conserva su número.

## Decisiones de Giuliano
- Figura: holograma de contorno (silueta humana completa en SVG, contorno cian con glow, rejilla interna, línea de escaneo animada, zonas que se iluminan).
- Slots: estilo 2077 (columnas de cuadrados biselados, líneas guía zona↔cuerpo, panel de detalle de la zona seleccionada).
- Arte: usar las ilustraciones de las cartas del Mission Kit para los implantes que tienen carta; el resto con ícono por tipo.

## Alcance
Solo visual y de estructura: **no cambia ninguna regla, dato ni acción del store** (instalar, quitar, terapia, FBC funcionan igual). Mismo contrato de hover/click por zona.

## Fase 1: Extraer componentes (sin cambio visual)
`CyberwareRipperdocView.tsx` tiene 2235 líneas con el SVG inline (l. 1339-1757). Se extrae a `features/cyberware/`:
- `ripperdocZones.ts`: `AnatomicalZoneKey`, `ZoneConfig`, `ZONE_CONFIGS` (+ campos nuevos `color` y `hotspot` con la forma/ancla de cada zona en el viewBox), `itemMatchesZone`, `LEG_CYBER_IDS`, `COVERING_CYBER_IDS`.
- `HoloBody.tsx` (props: `hoveredZone`, `selectedZone`, `installedCountByZone`, `onHover`, `onSelect`).
- `ZoneCard.tsx`, `SlotBox.tsx`, `GoingMetalBanner.tsx`.
Verificación: tsc + tests + captura antes/después idéntica.

## Fase 2: Figura holográfica nueva (`HoloBody.tsx`)
- Silueta humana completa (cabeza, cuello, torso, brazos, manos, piernas, pies) en un solo `path` de contorno + capa interna de rejilla recortada con `clipPath`; glow con filtros SVG; línea de escaneo y pulso con keyframes CSS en `index.css` (sin librerías nuevas).
- Hotspots por zona generados desde `ZONE_CONFIGS` con `.map` (reemplaza ~60 ternarios): cerebro (Frontal Cortex), ojos (Ocular), oídos (Auditory), columna/torso (Operating System), órganos (Skeleton & Organs), piel (Integumentary), brazos y manos, piernas y pies, y nuevo hotspot de Fashionware.
- Estados: reposo (contorno tenue), hover (zona encendida con su color), seleccionada (encendida fija + marcador), con implantes (puntos/contador sobre la zona).
- Accesible: cada hotspot con `role="button"`, `aria-label` y foco por teclado.

## Fase 3: Slots y layout estilo 2077
- `SlotBox`: cuadrado biselado (`clip-path`), vacío con patrón tenue y "+"; instalado con miniatura (carta o ícono), nombre, badge de HL y color de la zona. Ámbar/amarillo 2077 para selección.
- Líneas guía SVG desde cada tarjeta de zona hasta su hotspot en desktop (`xl`); en pantallas chicas se ocultan.
- Panel de detalle de la zona seleccionada (lateral o debajo de la figura): implantes instalados grandes con stats (HL, costo, instalación, descripción) y el catálogo filtrado; reutiliza los modales y handlers existentes.
- Responsive: en móvil y tablet la figura va arriba, luego las zonas en 1-2 columnas (`order-*`); torres HUM/ARMOR se vuelven barras horizontales compactas (sin `min-h-[640px]`).
- Utilidades CSS nuevas en `index.css`: `.holo-glow`, `.scanline`, `.chamfer-slot`, variables de color por zona.

## Fase 4: Arte del Mission Kit
- Copiar las cartas de ciberware de `Cyberpunk Edgerunners Mission Kit Digital\Individual Weapon and Cyberware Cards` a `frontend/public/cemk/cyberware/` (solo las de ciberware, redimensionadas a miniatura web), como ya se hace con los tokens.
- `cyberwareCardArt.ts`: mapa id de ciberware → imagen. El scout verifica qué ids del pack corresponden a cada carta; sin correspondencia clara, ícono.
- Clic en la miniatura abre la carta completa en el modal de inspección.

## Fase 5: Limpieza y cierre
- Textos viejos: "INTERFACE RED VOL. 3" (l. 684), "16 Implantes Cyborg" (l. 693), chip "FBC / Going Metal (-14 HL)" (l. 1183), "(Going Metal) (Going Metal)" (l. 922).
- Verificar si `animate-in` funciona (no está `tailwindcss-animate`); si no, reemplazar por keyframes propios.
- Capturas en desktop y móvil, tsc, tests, build. Docs firmados, changelog in-app con `author`, commit, PR, publicar en gh-pages.

## Ejecución y costo
- Scout: líneas exactas y mapeo de cartas. Worker (Sonnet): una fase por vez, con specs cerradas mías; reviso cada diff y una captura en el navegador antes de seguir.
- Rama `claude/v4.6.0-ripperdoc-2077`.

## Fuera de alcance
Cambios de reglas o datos de ciberware, 3D/WebGL, sonidos, nuevas dependencias.
