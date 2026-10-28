// Escritura agrupada a localStorage: junta cambios seguidos y guarda una sola vez (v4.9.7, plan17). [Claude Code · 2026-10-24]
import { useEffect, useRef } from 'react';
import { debounce } from '../utils/debounce';

export function createStorageWriter(
  key: string,
  wait = 1500,
  maxWait = 5000
): { write(serialized: string): void; flush(): void; cancel(): void } {
  const debounced = debounce(
    (serialized: string) => {
      try {
        localStorage.setItem(key, serialized);
      } catch (e) {
        console.error('Failed to save ' + key + ':', e);
      }
    },
    wait,
    { maxWait }
  );
  return {
    write(serialized: string) {
      debounced(serialized);
    },
    flush() {
      debounced.flush();
    },
    cancel() {
      debounced.cancel();
    },
  };
}

export function useDebouncedLocalStorage(
  key: string,
  value: unknown,
  serialize: (v: unknown) => string = JSON.stringify,
  /** false: no escribe (p. ej. secretos del GM que viven en la nube, v5.3.0). [Claude Code · 2026-10-28] */
  enabled = true
): void {
  const writerRef = useRef<ReturnType<typeof createStorageWriter> | null>(null);
  if (writerRef.current === null) writerRef.current = createStorageWriter(key);
  const writer = writerRef.current;

  useEffect(() => {
    if (enabled) writer.write(serialize(value));
    else writer.cancel();
    // serialize se omite a propósito: solo importa el cambio de valor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  // Guarda lo pendiente al cerrar la pestaña o al desmontar.
  useEffect(() => {
    const onPageHide = () => writer.flush();
    if (typeof window !== 'undefined') window.addEventListener('pagehide', onPageHide);
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('pagehide', onPageHide);
      writer.flush();
    };
  }, [writer]);
}
