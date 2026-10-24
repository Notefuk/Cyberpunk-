// Debounce con espera máxima (v4.9.7, plan17). [Claude Code · 2026-10-24]
export interface Debounced<A extends unknown[]> {
  (...args: A): void;
  flush(): void;
  cancel(): void;
  pending(): boolean;
}

export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
  opts?: { maxWait?: number }
): Debounced<A> {
  const maxWait = opts?.maxWait;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let maxTimer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: A | null = null;

  const clearTimers = () => {
    if (timer !== null) clearTimeout(timer);
    if (maxTimer !== null) clearTimeout(maxTimer);
    timer = null;
    maxTimer = null;
  };

  const fire = () => {
    const args = lastArgs;
    clearTimers();
    lastArgs = null;
    if (args) fn(...args);
  };

  const debounced = ((...args: A) => {
    lastArgs = args;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(fire, wait);
    if (maxWait !== undefined && maxTimer === null) {
      maxTimer = setTimeout(fire, maxWait);
    }
  }) as Debounced<A>;

  debounced.flush = () => {
    if (lastArgs) fire();
  };
  debounced.cancel = () => {
    clearTimers();
    lastArgs = null;
  };
  debounced.pending = () => lastArgs !== null;

  return debounced;
}
