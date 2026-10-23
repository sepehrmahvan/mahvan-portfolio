'use client';

import { useSyncExternalStore } from 'react';

/** Client-only `matchMedia('(min-width: …px)')` — sync on first client paint. */
export function useMinWidth(minWidth: number): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia(`(min-width: ${minWidth}px)`).matches,
    () => false,
  );
}

/** Tailwind `lg` — treat as laptop and up for heavy media. */
export const LAPTOP_MIN_WIDTH = 1024;

export function useIsLaptopUp(): boolean {
  return useMinWidth(LAPTOP_MIN_WIDTH);
}
