'use client';

import type { MotionValue } from 'motion/react';
import { createContext, useContext } from 'react';

import type { ChapterId } from './timeline';

export interface LandingScrollContextValue {
  /** Active snap step index (0 … SNAP_STEP_COUNT-1). */
  time: MotionValue<number>;
  /** Discrete snap progress through chapters + contact, 0 to 1. */
  progress: MotionValue<number>;
  reduceMotion: boolean;
  /**
   * Hero copy may enter only after the intro video holds on the full face.
   * True immediately when reduced motion is preferred.
   */
  heroRevealReady: boolean;
  /**
   * Skills copy may enter only after the scroll-out video beat (2s→4s) finishes.
   */
  skillsRevealReady: boolean;
  scrollToChapter: (id: ChapterId) => void;
  scrollToContact: () => void;
}

export const LandingScrollContext = createContext<LandingScrollContextValue | null>(null);

export function useLandingScroll(): LandingScrollContextValue {
  const value = useContext(LandingScrollContext);
  if (!value) {
    throw new Error('useLandingScroll must be used inside <LandingPage>');
  }
  return value;
}
