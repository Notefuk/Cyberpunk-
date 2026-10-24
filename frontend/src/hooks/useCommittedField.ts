// Campo de texto con commit diferido: guarda al salir, con Enter o tras 1,5 s sin escribir (v4.9.7, plan17). [Claude Code · 2026-10-24]
import { useEffect, useRef, useState } from 'react';
import { debounce } from '../utils/debounce';

export const COMMIT_DELAY_MS = 1500;
export const COMMIT_MAX_WAIT_MS = 5000;

export interface CommitController {
  change(draft: string): void;
  flush(): void;
  cancel(): void;
  isDirty(): boolean;
}

export function createCommitController(
  commit: (value: string) => void,
  opts?: { delay?: number; maxWait?: number }
): CommitController {
  let draft = '';
  let dirty = false;

  // El flag dirty evita guardar dos veces el mismo borrador; si el texto ya es igual al de la ficha
  // lo filtra el hook, que conoce el valor actual.
  const run = () => {
    if (!dirty) return;
    dirty = false;
    commit(draft);
  };

  const debounced = debounce(run, opts?.delay ?? COMMIT_DELAY_MS, {
    maxWait: opts?.maxWait ?? COMMIT_MAX_WAIT_MS,
  });

  return {
    change(next: string) {
      draft = next;
      dirty = true;
      debounced();
    },
    flush() {
      if (!dirty) return;
      debounced.cancel();
      run();
    },
    cancel() {
      debounced.cancel();
      dirty = false;
    },
    isDirty() {
      return dirty;
    },
  };
}

export function useCommittedField(
  value: string,
  commit: (value: string) => void,
  opts?: { delay?: number; maxWait?: number; resetKey?: string }
): {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  onBlur: () => void;
  onKeyDown: (e: { key: string; currentTarget?: { blur?: () => void } }) => void;
} {
  const [draft, setDraft] = useState(value);
  const commitRef = useRef(commit);
  commitRef.current = commit;
  const valueRef = useRef(value);
  valueRef.current = value;
  const controllerRef = useRef<CommitController | null>(null);
  if (controllerRef.current === null) {
    // No guarda si el texto ya es igual al valor actual de la ficha.
    controllerRef.current = createCommitController((v) => {
      if (v !== valueRef.current) commitRef.current(v);
    }, opts);
  }
  const controller = controllerRef.current;

  useEffect(() => {
    if (!controller.isDirty()) setDraft(value);
  }, [value, controller]);

  // resetKey (por ejemplo el id de la ficha activa): si cambia con un borrador pendiente, se descarta
  // para no guardarlo en otra ficha. Al hacer clic en otro lado el campo ya guardó por onBlur.
  const resetKey = opts?.resetKey;
  const lastResetKey = useRef(resetKey);
  useEffect(() => {
    if (lastResetKey.current === resetKey) return;
    lastResetKey.current = resetKey;
    controller.cancel();
    setDraft(valueRef.current);
  }, [resetKey, controller]);

  useEffect(() => {
    const onPageHide = () => controller.flush();
    if (typeof window !== 'undefined') window.addEventListener('pagehide', onPageHide);
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('pagehide', onPageHide);
      controller.flush();
    };
  }, [controller]);

  return {
    value: draft,
    onChange: (e) => {
      setDraft(e.target.value);
      controller.change(e.target.value);
    },
    onBlur: () => controller.flush(),
    onKeyDown: (e) => {
      if (e.key === 'Enter') controller.flush();
    },
  };
}
