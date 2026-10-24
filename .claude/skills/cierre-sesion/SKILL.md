---
name: cierre-sesion
description: Cierra la sesión dejando todo listo para la próxima (de Claude Code o de Antigravity) - checkpoint comprimido con sección Traspaso, docs firmados, commit y push. Úsala cuando Giuliano diga que se va, que corta, que sigue otro día, que pasa a Antigravity, o pida "cerrar", "comprimir" o "dejar todo listo".
---

# Cierre de sesión

Protocolo completo en `docs/COWORK.md` §4. Antigravity sigue el mismo en `.agent/skills/cierre-sesion/SKILL.md`.

1. **Punto estable**: si hay código a medias, déjalo compilando (`npx tsc -b --noEmit` en `frontend`). Si no se puede, anota exactamente qué rompe.
2. **Comprimir `CHECKPOINT.md`** (skill `checkpoint`):
   - Cabecera con `[Claude Code · AAAA-MM-DD]`, versión y plan activo.
   - "Último trabajo terminado": solo lo relevante; lo viejo ya está en `CHANGELOG_AND_ARCHITECTURE.md`, bórralo.
   - Sección **`## Traspaso`** (justo debajo de la cabecera), reemplazando la anterior:
     ```
     ## Traspaso
     - Cierra: [Claude Code · AAAA-MM-DD]
     - Rama y último commit: <rama> @ <hash corto> (pusheada: sí/no)
     - A medias: <archivo:líneas — qué falta>
     - Siguiente paso exacto: <una acción concreta>
     - Preguntas abiertas para Giuliano: <o "ninguna">
     ```
3. **Docs**: si se cerró una versión, entradas firmadas en los docs de la lista "Al cerrar una versión" de `docs/INDEX.md`, con changelog in-app `author: 'Claude Code'` (skill `cpr-version-release`) [Claude Code · 2026-10-24].
4. **Commit y push**: commit con `Autor-IA: Claude Code` y push de la rama. No dejes trabajo solo en local.
5. **Respuesta a Giuliano**: 3-5 líneas con dónde quedó todo y el primer paso de la próxima sesión.
