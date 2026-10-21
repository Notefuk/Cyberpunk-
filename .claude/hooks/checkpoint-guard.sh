#!/bin/bash
# Hook Stop: si hay archivos cambiados (sin commitear) más nuevos que CHECKPOINT.md,
# frena el cierre del turno y pide actualizar el checkpoint con la skill `checkpoint`.
input="$(cat)"
# Evita el bucle: si ya se frenó una vez en este turno, deja terminar.
if echo "$input" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f CHECKPOINT.md ] || exit 0
cp_mtime=$(stat -c %Y CHECKPOINT.md 2>/dev/null || echo 0)
stale=""
while IFS= read -r line; do
  f="${line:3}"
  f="${f#\"}"; f="${f%\"}"
  [ "$f" = "CHECKPOINT.md" ] && continue
  [ -f "$f" ] || continue
  m=$(stat -c %Y "$f" 2>/dev/null || echo 0)
  if [ "$m" -gt "$cp_mtime" ]; then
    stale="$f"
    break
  fi
done < <(git status --porcelain -uall 2>/dev/null)
if [ -n "$stale" ]; then
  echo "{\"decision\":\"block\",\"reason\":\"CHECKPOINT.md está desactualizado ($stale cambió después). Actualízalo con la skill checkpoint (firma [Claude Code · fecha]) antes de terminar.\"}"
fi
exit 0
