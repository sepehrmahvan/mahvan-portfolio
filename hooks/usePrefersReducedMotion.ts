'use client';

/**
 * Portfolio motion is intentional (hero video, snap scroll, chapter reveals).
 * OS "Reduce motion" is ignored so the landing never ships dry/static on
 * machines that leave that accessibility toggle on by default.
 *
 * Wire a real user toggle here later if you need an in-app opt-out.
 */
export function getPrefersReducedMotion(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return false;
}
