---
name: checkpoint
description: Actualiza CHECKPOINT.md con el estado vivo del trabajo (último trabajo terminado, qué quedó a medias con archivos y líneas, próximos pasos, bloqueos). Úsala al terminar cada tarea o paso, antes de compactar contexto, antes de cambiar de herramienta y cada vez que el hook Stop lo pida.
---

# Checkpoint

`CHECKPOINT.md` (raíz del repo) es el estado vivo compartido entre Claude Code y Antigravity. Mantenerlo al día es obligatorio.

## Cuándo
- Al terminar cada paso o tarea (no solo al cerrar una versión).
- Antes de compactar contexto o cuando la conversación ya es larga.
- Antes de que el usuario cambie de herramienta o cierre la sesión.
- Cuando el hook `Stop` (`checkpoint-guard.sh`) frena el turno.

## Cómo
1. Lee `CHECKPOINT.md` (es corto). No lo reescribas entero: edita solo las secciones que cambiaron.
2. Cabecera: `**Última actualización**: [Claude Code · AAAA-MM-DD]`, versión de la app y plan activo.
3. **Último trabajo terminado**: una viñeta firmada por versión o paso cerrado. Reemplaza lo viejo en vez de acumular historial (el historial vive en `CHANGELOG_AND_ARCHITECTURE.md`).
4. **En curso**: qué está hecho y qué falta, con archivo y líneas aproximadas, en orden. Rama donde vive el trabajo.
5. **Próximos pasos** y **Notas y bloqueos**: preguntas pendientes al usuario, decisiones tomadas, desvíos del plan y por qué.
6. No borres firmas de Antigravity: agrega la tuya debajo.
7. Si hay trabajo a medias, commitéalo junto con el checkpoint. **Nunca pushees sin el OK explícito de Giuliano** (`docs/PRINCIPIOS.md`) [Claude Code · 2026-10-24]:
   - Antes de pedirlo, decile la rama y el destino, los commits que suben (`git log origin/<rama>..HEAD --oneline`) y si `tsc`, los tests y el build pasan.
   - Un OK cubre un solo push, no los siguientes.
   - Si no está para darlo, dejá todo commiteado en local y anotá en el Traspaso "pusheada: no — falta OK".
   - Un trabajo que no está en GitHub se pierde: por eso el OK se pide enseguida, no al final de la sesión.
