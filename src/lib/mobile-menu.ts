import { useSyncExternalStore } from "react";

let isOpen = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const mobileMenuStore = {
  get: () => isOpen,
  set: (open: boolean) => {
    if (isOpen === open) return;
    isOpen = open;
    if (typeof document !== "undefined") {
      if (open) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }
    emit();
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useMobileMenuOpen() {
  return useSyncExternalStore(
    mobileMenuStore.subscribe,
    mobileMenuStore.get,
    () => false
  );
}
