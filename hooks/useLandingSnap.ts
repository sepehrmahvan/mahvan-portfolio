'use client';

import {
  animate,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

import { HERO_FORWARD_WALL_S } from '@/components/landing/HeroVideoBackground';
import {
  SNAP_CONTACT_INDEX,
  SNAP_PROJECTS_INDEX,
  SNAP_STEP_COUNT,
  snapIndexForChapter,
  snapTimeForIndex,
  type ChapterId,
} from '@/components/landing/timeline';

/** Non-hero section snap — keep short for weak devices. */
const SCROLL_DURATION = 0.32;
/** Hero ↔ skills: match the sped-up forward/reverse video wall-clock. */
const HERO_EXIT_DURATION = HERO_FORWARD_WALL_S;
const TOUCH_THRESHOLD = 48;
const EDGE_EPS = 4;
const KEY_PAGE_FACTOR = 0.9;
const SMOOTH_EASE = [0.45, 0.05, 0.25, 1] as const;
/** Extra ms after scroll tween before accepting the next gesture. */
const UNLOCK_TAIL_MS = 48;

type ProjectsBounds = {
  top: number;
  maxScroll: number;
  atTop: boolean;
  atBottom: boolean;
  canScroll: boolean;
};

function projectsBounds(section: HTMLElement): ProjectsBounds {
  const top = sectionScrollTop(section);
  const maxScroll = Math.max(top, top + section.offsetHeight - window.innerHeight);
  const y = window.scrollY;
  return {
    top,
    maxScroll,
    atTop: y <= top + EDGE_EPS,
    atBottom: y >= maxScroll - EDGE_EPS,
    canScroll: maxScroll > top + EDGE_EPS,
  };
}

export type LandingSnapHooks = {
  /** Fired when leaving the hero snap (any destination). */
  onLeaveHero?: () => void;
  /** Fired when returning to the hero snap. */
  onEnterHero?: () => void;
};

function clampStep(index: number): number {
  return Math.max(0, Math.min(SNAP_STEP_COUNT - 1, index));
}

function sectionScrollTop(section: HTMLElement): number {
  return section.getBoundingClientRect().top + window.scrollY;
}

export interface LandingSnapApi {
  time: MotionValue<number>;
  progress: MotionValue<number>;
  scrollToChapter: (id: ChapterId) => void;
  scrollToContact: () => void;
}

export type LandingSectionRefs = {
  hero: RefObject<HTMLElement | null>;
  skills: RefObject<HTMLElement | null>;
  softSkills: RefObject<HTMLElement | null>;
  experience: RefObject<HTMLElement | null>;
  projects: RefObject<HTMLElement | null>;
  contact: RefObject<HTMLElement | null>;
};

/**
 * One wheel / swipe / key press = one full-viewport section.
 * Scroll lock is held until the tween finishes (not a fixed timer) to avoid
 * step/video desync on slow devices.
 */
export function useLandingSnap(
  sections: LandingSectionRefs,
  reduceMotion: boolean,
  hooks: LandingSnapHooks = {},
): LandingSnapApi {
  const time = useMotionValue(0);
  const progress = useMotionValue(0);
  const stepRef = useRef(0);
  const lockedRef = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchLastY = useRef<number | null>(null);
  const animationsRef = useRef<AnimationPlaybackControls[]>([]);
  const hooksRef = useRef(hooks);
  const sectionsRef = useRef(sections);
  const reduceMotionRef = useRef(reduceMotion);
  hooksRef.current = hooks;
  sectionsRef.current = sections;
  reduceMotionRef.current = reduceMotion;

  const stopAnimations = useCallback(() => {
    animationsRef.current.forEach((animation) => animation.stop());
    animationsRef.current = [];
  }, []);

  const clearUnlockTimer = useCallback(() => {
    if (unlockTimer.current) {
      clearTimeout(unlockTimer.current);
      unlockTimer.current = null;
    }
  }, []);

  const unlock = useCallback(() => {
    clearUnlockTimer();
    lockedRef.current = false;
  }, [clearUnlockTimer]);

  /** Hard lock until unlock(); safety timeout only as a fallback. */
  const lockWithFallback = useCallback(
    (fallbackMs: number) => {
      lockedRef.current = true;
      clearUnlockTimer();
      unlockTimer.current = setTimeout(() => {
        lockedRef.current = false;
        unlockTimer.current = null;
      }, fallbackMs);
    },
    [clearUnlockTimer],
  );

  const sectionForStep = useCallback((index: number): HTMLElement | null => {
    const s = sectionsRef.current;
    if (index >= SNAP_CONTACT_INDEX) return s.contact.current;
    if (index >= SNAP_PROJECTS_INDEX) return s.projects.current;
    if (index === 0) return s.hero.current;
    if (index === 1) return s.skills.current;
    if (index === 2) return s.softSkills.current;
    return s.experience.current;
  }, []);

  const resolveTargetScroll = useCallback(
    (next: number, previous: number): number => {
      const section = sectionForStep(next);
      if (!section) return window.scrollY;
      if (next === SNAP_PROJECTS_INDEX && previous === SNAP_CONTACT_INDEX) {
        return projectsBounds(section).maxScroll;
      }
      return sectionScrollTop(section);
    },
    [sectionForStep],
  );

  const goToStep = useCallback(
    (rawIndex: number) => {
      const next = clampStep(rawIndex);
      const previous = stepRef.current;
      if (next === previous) return;

      const reduce = reduceMotionRef.current;
      // Any exit from hero must drive the shared video (nav can skip skills).
      const leavingHero = previous === 0 && next > 0;
      const enteringHero = previous !== 0 && next === 0;
      const duration =
        reduce ? 0 : leavingHero || enteringHero ? HERO_EXIT_DURATION : SCROLL_DURATION;
      const scrollMs = Math.round(duration * 1000);

      if (leavingHero) hooksRef.current.onLeaveHero?.();
      if (enteringHero) hooksRef.current.onEnterHero?.();

      stepRef.current = next;
      stopAnimations();
      // Hold gestures until tween settles; fallback covers stalled animations.
      lockWithFallback(Math.max(scrollMs + UNLOCK_TAIL_MS + 200, 900));

      const targetProgress = next / (SNAP_STEP_COUNT - 1);
      time.set(snapTimeForIndex(next));
      progress.set(targetProgress);

      const finishScroll = () => {
        const liveTop = resolveTargetScroll(next, previous);
        window.scrollTo({ top: liveTop, behavior: 'auto' });
        clearUnlockTimer();
        unlockTimer.current = setTimeout(unlock, UNLOCK_TAIL_MS);
      };

      // Recalculate after layout (sticky / negative margin) settles.
      const run = () => {
        const targetScroll = resolveTargetScroll(next, previous);

        if (scrollMs === 0) {
          window.scrollTo({ top: targetScroll, behavior: 'auto' });
          finishScroll();
          return;
        }

        const fromScroll = window.scrollY;
        animationsRef.current = [
          animate(fromScroll, targetScroll, {
            duration,
            ease: SMOOTH_EASE,
            onUpdate: (value) => {
              window.scrollTo({ top: value, behavior: 'auto' });
            },
            onComplete: finishScroll,
          }),
        ];
      };

      requestAnimationFrame(run);
    },
    [
      clearUnlockTimer,
      lockWithFallback,
      progress,
      resolveTargetScroll,
      stopAnimations,
      time,
      unlock,
    ],
  );

  const goToStepRef = useRef(goToStep);
  goToStepRef.current = goToStep;

  const scrollToChapter = useCallback((id: ChapterId) => {
    goToStepRef.current(snapIndexForChapter(id));
  }, []);

  const scrollToContact = useCallback(() => {
    goToStepRef.current(SNAP_CONTACT_INDEX);
  }, []);

  useEffect(() => {
    if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'auto' });

    const scrollProjectsBy = (delta: number): boolean => {
      if (stepRef.current !== SNAP_PROJECTS_INDEX) return false;
      const section = sectionsRef.current.projects.current;
      if (!section) return false;
      const { top, maxScroll, atTop, atBottom, canScroll } = projectsBounds(section);
      if (!canScroll) return false;
      if (delta > 0 && atBottom) return false;
      if (delta < 0 && atTop) return false;
      const next = Math.min(maxScroll, Math.max(top, window.scrollY + delta));
      window.scrollTo({ top: next, behavior: 'auto' });
      return true;
    };

    const move = (direction: 1 | -1) => {
      if (lockedRef.current) return;
      goToStepRef.current(stepRef.current + direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (delta === 0) return;
      event.preventDefault();
      if (lockedRef.current) return;
      if (scrollProjectsBy(delta)) return;
      move(delta > 0 ? 1 : -1);
    };

    const onTouchStart = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? null;
      touchStartY.current = y;
      touchLastY.current = y;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (stepRef.current !== SNAP_PROJECTS_INDEX || lockedRef.current) return;
      const y = event.touches[0]?.clientY;
      const last = touchLastY.current;
      if (y == null || last == null) return;
      const delta = last - y;
      touchLastY.current = y;
      if (delta === 0) return;
      if (scrollProjectsBy(delta)) {
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      const startY = touchStartY.current;
      touchStartY.current = null;
      touchLastY.current = null;
      if (startY == null || lockedRef.current) return;
      const endY = event.changedTouches[0]?.clientY;
      if (endY == null) return;
      const dy = startY - endY;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;

      if (stepRef.current === SNAP_PROJECTS_INDEX) {
        const section = sectionsRef.current.projects.current;
        if (section) {
          const { atTop, atBottom, canScroll } = projectsBounds(section);
          if (canScroll && ((dy > 0 && !atBottom) || (dy < 0 && !atTop))) {
            return;
          }
        }
      }

      event.preventDefault();
      move(dy > 0 ? 1 : -1);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (lockedRef.current) {
        if (
          event.key === 'ArrowDown' ||
          event.key === 'ArrowUp' ||
          event.key === 'PageDown' ||
          event.key === 'PageUp' ||
          event.key === ' ' ||
          event.key === 'Home' ||
          event.key === 'End'
        ) {
          event.preventDefault();
        }
        return;
      }

      const page = Math.round(window.innerHeight * KEY_PAGE_FACTOR);

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          event.preventDefault();
          if (scrollProjectsBy(event.key === 'ArrowDown' ? Math.min(96, page) : page)) {
            return;
          }
          move(1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          if (
            scrollProjectsBy(
              event.key === 'ArrowUp' ? -Math.min(96, page) : -page,
            )
          ) {
            return;
          }
          move(-1);
          break;
        case 'Home':
          event.preventDefault();
          goToStepRef.current(0);
          break;
        case 'End':
          event.preventDefault();
          goToStepRef.current(SNAP_CONTACT_INDEX);
          break;
        default:
          break;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      clearUnlockTimer();
      stopAnimations();
    };
  }, [clearUnlockTimer, stopAnimations]);

  return { time, progress, scrollToChapter, scrollToContact };
}
