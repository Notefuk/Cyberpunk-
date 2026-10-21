#!/bin/bash
# Hook SessionStart: carga el estado compartido con Antigravity al iniciar o retomar la sesión.
# Lo que imprime este script entra en el contexto de Claude Code.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
echo "=== Inicio de sesión (protocolo docs/COWORK.md §2) ==="
echo "Rama: $(git branch --show-current 2>/dev/null) · último commit: $(git log -1 --format='%h %s' 2>/dev/null)"
pending=$(git status --porcelain 2>/dev/null | wc -l)
[ "$pending" -gt 0 ] && echo "Atención: $pending archivo(s) sin commitear en el árbol de trabajo."
echo "Antes de trabajar: git pull, revisa la sección Traspaso y 'En curso' (no toques lo que está a cargo de Antigravity)."
echo
[ -f CHECKPOINT.md ] && cat CHECKPOINT.md
exit 0
