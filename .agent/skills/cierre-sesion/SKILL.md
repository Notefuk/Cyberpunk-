---
name: cierre-sesion
description: Cierra la sesión de Antigravity dejando todo listo para la próxima (de Antigravity o de Claude Code) - checkpoint comprimido con sección Traspaso, docs firmados, commit y push. Úsala cuando el usuario diga que se va, que corta, que sigue otro día, que pasa a Claude Code, o pida "cerrar", "comprimir" o "dejar todo listo".
---

# Cierre de sesión (Antigravity)

Protocolo completo en `docs/COWORK.md` §4. Claude Code sigue el mismo en `.claude/skills/cierre-sesion/SKILL.md`.

1. **Punto estable**: si hay código a medias, déjalo compilando (`npx tsc -b --noEmit` en `frontend`). Si no se puede, anota exactamente qué rompe.
2. **Comprimir `CHECKPOINT.md`**:
   - Cabecera con `[Antigravity · AAAA-MM-DD]`, versión y plan activo.
   - "Último trabajo terminado": solo lo relevante; lo viejo ya está en `CHANGELOG_AND_ARCHITECTURE.md`, bórralo. No borres firmas de Claude Code.
   - Sección **`## Traspaso`** (justo debajo de la cabecera), reemplazando la anterior:
     ```
     ## Traspaso
     - Cierra: [Antigravity · AAAA-MM-DD]
     - Rama y último commit: <rama> @ <hash corto> (pusheada: sí/no)
     - A medias: <archivo:líneas — qué falta>
     - Siguiente paso exacto: <una acción concreta>
     - Preguntas abiertas para el usuario: <o "ninguna">
     ```
3. **Docs**: si se cerró una versión, entradas firmadas `[Antigravity · AAAA-MM-DD]` en CHANGELOG, HANDOFF, STATUS, CONTENT_CHECKLIST y changelog in-app con `author: 'Antigravity'`.
4. **Commit y push**: commit con `Autor-IA: Antigravity` y push de la rama (delegar en `github-web-deployer` si además hay que publicar). No dejes trabajo solo en local.
5. **Respuesta al usuario**: 3-5 líneas con dónde quedó todo y el primer paso de la próxima sesión.