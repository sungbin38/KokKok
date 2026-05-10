import { useSyncExternalStore } from 'react';

let demo = false;
const listeners = new Set<() => void>();

export function enableDemoMode() {
  if (demo) return;
  demo = true;
  for (const l of listeners) l();
}

export function isDemoMode() {
  return demo;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useDemoMode() {
  return useSyncExternalStore(subscribe, () => demo, () => demo);
}
