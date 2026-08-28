"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe "mounted" flag: false on the server/first client render,
 * true after. Gate persisted-cart UI behind this to avoid hydration mismatch.
 */
export function useMounted() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () => true,
    () => false
  );
}
