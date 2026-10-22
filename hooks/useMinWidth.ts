'use client';

import { useEffect, useState } from 'react';

/** Client-only `matchMedia('(min-width: …px)')` — starts `false` until mounted. */
export function useMinWidth(minWidth: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [minWidth]);

  return matches;
}

/** Tailwind `lg` — treat as laptop and up for heavy media. */
export const LAPTOP_MIN_WIDTH = 1024;

export function useIsLaptopUp(): boolean {
  return useMinWidth(LAPTOP_MIN_WIDTH);
}
