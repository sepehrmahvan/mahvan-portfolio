'use client';

import { useMotionValueEvent } from 'motion/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { useLandingScroll } from '@/components/landing/LandingScrollContext';
import { MobileHeroAtmosphere } from '@/components/landing/mobile/MobileHeroAtmosphere';
import { isChapterStep } from '@/components/landing/timeline';
import { useIsLaptopUp } from '@/hooks/useMinWidth';
import { cn } from '@/utils/cn';

const VIDEO_SRC = '/video/asli.mp4';
/** Still from the hold beat — fills the stage while mp4 buffers. */
const VIDEO_POSTER = '/video/asli-poster.webp';

/** Skip poster / turnaround still. */
export const HERO_VIDEO_INTRO_START = 0.25;
/** Intro ends here — hero content may enter. */
export const HERO_VIDEO_INTRO_END = 2;
/** Fire hero copy while intro is still settling (~0.45s before hold). */
const HERO_CONTENT_REVEAL_AT = 1.25;
/** Scroll-out ends here — skills content may enter. Rest unused. */
export const HERO_VIDEO_SCROLL_END = 4.08;
/** Forward 2→end: mild speed bump (soft in/out, faster mid). */
const FORWARD_RATE_BASE = 1.08;
const FORWARD_RATE_PEAK = 1.4;

/** Lower capture rate — reverse strip is lighter on weak CPUs/GPUs. */
const CAPTURE_FPS = 18;
const CAPTURE_INTERVAL_MS = 1000 / CAPTURE_FPS;
/** Hard cap so reverse never holds dozens of full-res canvases. */
const MAX_CAPTURE_FRAMES = 28;
const BEAT_MS = (HERO_VIDEO_SCROLL_END - HERO_VIDEO_INTRO_END) * 1000;
/** Fire hero re-enter before reverse finishes (~0.6s early). */
const REVERSE_ANNOUNCE_AT = 0.3;

/** Approximate wall-clock for the eased forward beat (avg rate ~1.28×). */
export const HERO_FORWARD_WALL_S =
  (HERO_VIDEO_SCROLL_END - HERO_VIDEO_INTRO_END) /
  (FORWARD_RATE_BASE + ((FORWARD_RATE_PEAK - FORWARD_RATE_BASE) * 2) / Math.PI);

export type HeroVideoHandle = {
  playScrollOut: () => void;
  resetToHold: () => void;
};

type Phase = 'boot' | 'intro' | 'hold' | 'forward' | 'done' | 'reverse';

interface HeroVideoBackgroundProps {
  reduceMotion: boolean;
  /** Desktop: clear hero copy while the mp4 boots (avoids flash before video). */
  onIntroReset?: () => void;
  /** Fired when intro is far enough that hero copy may enter. */
  onIntroHold?: () => void;
  onScrollDone?: () => void;
}

function waitFor(
  target: EventTarget,
  event: string,
  timeoutMs = 6000,
): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      target.removeEventListener(event, finish);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    target.addEventListener(event, finish);
  });
}

async function seekPaused(video: HTMLVideoElement, time: number) {
  video.pause();
  if (video.readyState < 1) await waitFor(video, 'loadedmetadata');
  if (Math.abs(video.currentTime - time) < 0.03) return;
  const seeked = waitFor(video, 'seeked', 2000);
  video.currentTime = time;
  await seeked;
  video.pause();
}

/**
 * Hero/skills shared video:
 * boot → intro (0.25→2) → hold
 * forward (2→4) + capture frames → done
 * reverse paints captures 4→2 → hold
 */
export const HeroVideoBackground = forwardRef<HeroVideoHandle, HeroVideoBackgroundProps>(
  function HeroVideoBackground(
    { reduceMotion, onIntroReset, onIntroHold, onScrollDone },
    ref,
  ) {
    const laptopUp = useIsLaptopUp();
    const { time } = useLandingScroll();
    const [atmosphereIndex, setAtmosphereIndex] = useState('01');
    /** Mobile/tablet: no playback — still fire reveal callbacks. */
    const skipPlay = reduceMotion || !laptopUp;
    const videoRef = useRef<HTMLVideoElement>(null);

    useMotionValueEvent(time, 'change', (value) => {
      setAtmosphereIndex(isChapterStep(value, 'skills') ? '02' : '01');
    });
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const grabRef = useRef<HTMLCanvasElement | null>(null);
    const phaseRef = useRef<Phase>('boot');
    const framesRef = useRef<HTMLCanvasElement[]>([]);
    const rafRef = useRef(0);
    const lastGrabRef = useRef(0);
    /** Bumps on every playScrollOut / resetToHold to drop stale async work. */
    const generationRef = useRef(0);
    const onIntroResetRef = useRef(onIntroReset);
    const onIntroHoldRef = useRef(onIntroHold);
    const onScrollDoneRef = useRef(onScrollDone);
    onIntroResetRef.current = onIntroReset;
    onIntroHoldRef.current = onIntroHold;
    onScrollDoneRef.current = onScrollDone;

    const [ready, setReady] = useState(false);
    const [overlayOn, setOverlayOn] = useState(false);

    const stopRaf = useCallback(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    }, []);

    const clearFrames = useCallback(() => {
      framesRef.current = [];
    }, []);

    const grabFrame = useCallback((video: HTMLVideoElement) => {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) return;

      if (!grabRef.current) grabRef.current = document.createElement('canvas');
      const grab = grabRef.current;
      if (grab.width !== w || grab.height !== h) {
        grab.width = w;
        grab.height = h;
      }
      const gctx = grab.getContext('2d', { alpha: false });
      if (!gctx) return;
      gctx.drawImage(video, 0, 0, w, h);

      const sheet = document.createElement('canvas');
      sheet.width = w;
      sheet.height = h;
      const sctx = sheet.getContext('2d', { alpha: false });
      if (!sctx) return;
      sctx.drawImage(grab, 0, 0);
      const list = framesRef.current;
      list.push(sheet);
      if (list.length > MAX_CAPTURE_FRAMES) {
        list.splice(0, list.length - MAX_CAPTURE_FRAMES);
      }

      const overlay = overlayRef.current;
      if (overlay && (overlay.width !== w || overlay.height !== h)) {
        overlay.width = w;
        overlay.height = h;
      }
    }, []);

    const paintOverlay = useCallback((source: HTMLCanvasElement) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext('2d', { alpha: false });
      if (!ctx) return;
      if (overlay.width !== source.width || overlay.height !== source.height) {
        overlay.width = source.width;
        overlay.height = source.height;
      }
      ctx.drawImage(source, 0, 0);
    }, []);

    /**
     * Imperative show/hide. Pass `syncState: false` on reverse start so React
     * setState does not hitch the first painted frames.
     */
    const showOverlayNow = useCallback((on: boolean, syncState = true) => {
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.opacity = on ? '1' : '0';
        overlay.style.pointerEvents = on ? 'auto' : 'none';
      }
      if (syncState) setOverlayOn(on);
      else {
        requestAnimationFrame(() => setOverlayOn(on));
      }
    }, []);

    const reachHold = useCallback(
      async (announce: boolean, gen?: number) => {
        const expected = gen ?? generationRef.current;
        const video = videoRef.current;
        stopRaf();
        if (generationRef.current !== expected) return;
        phaseRef.current = 'hold';
        // Seek under the overlay first. Do NOT await requestVideoFrameCallback —
        // it often never fires on a paused video after seek, which freezes the
        // overlay and blocks hero re-enter. Double-rAF is enough for a paint.
        if (video) await seekPaused(video, HERO_VIDEO_INTRO_END);
        if (generationRef.current !== expected) return;
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        if (generationRef.current !== expected) return;
        showOverlayNow(false);
        requestAnimationFrame(() => {
          if (generationRef.current === expected) clearFrames();
        });
        if (announce) onIntroHoldRef.current?.();
      },
      [clearFrames, showOverlayNow, stopRaf],
    );

    const playScrollOut = useCallback(() => {
      const video = videoRef.current;
      const gen = ++generationRef.current;
      stopRaf();
      clearFrames();
      showOverlayNow(false);
      if (video) {
        video.pause();
        video.playbackRate = 1;
      }

      if (!video || skipPlay) {
        void (async () => {
          if (video?.src) await seekPaused(video, HERO_VIDEO_SCROLL_END);
          if (generationRef.current !== gen) return;
          phaseRef.current = 'done';
          onScrollDoneRef.current?.();
        })();
        return;
      }

      void (async () => {
        phaseRef.current = 'forward';
        lastGrabRef.current = 0;
        video.playbackRate = FORWARD_RATE_BASE;
        await seekPaused(video, HERO_VIDEO_INTRO_END);
        if (generationRef.current !== gen || phaseRef.current !== 'forward') return;

        try {
          await video.play();
        } catch {
          if (generationRef.current !== gen) return;
          video.playbackRate = 1;
          await seekPaused(video, HERO_VIDEO_SCROLL_END);
          if (generationRef.current !== gen) return;
          phaseRef.current = 'done';
          onScrollDoneRef.current?.();
          return;
        }

        if (generationRef.current !== gen || phaseRef.current !== 'forward') {
          video.pause();
          return;
        }

        const span = HERO_VIDEO_SCROLL_END - HERO_VIDEO_INTRO_END;

        const tick = (now: number) => {
          if (
            generationRef.current !== gen ||
            phaseRef.current !== 'forward'
          ) {
            return;
          }

          const u = Math.min(
            1,
            Math.max(0, (video.currentTime - HERO_VIDEO_INTRO_END) / span),
          );
          const bump = Math.sin(u * Math.PI);
          video.playbackRate =
            FORWARD_RATE_BASE + bump * (FORWARD_RATE_PEAK - FORWARD_RATE_BASE);

          if (
            !document.hidden &&
            now - lastGrabRef.current >= CAPTURE_INTERVAL_MS
          ) {
            lastGrabRef.current = now;
            grabFrame(video);
          }

          if (video.currentTime >= HERO_VIDEO_SCROLL_END - 0.03) {
            grabFrame(video);
            video.pause();
            video.playbackRate = 1;
            video.currentTime = HERO_VIDEO_SCROLL_END;
            phaseRef.current = 'done';
            rafRef.current = 0;
            if (generationRef.current === gen) onScrollDoneRef.current?.();
            return;
          }

          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      })();
    }, [clearFrames, grabFrame, skipPlay, showOverlayNow, stopRaf]);

    const resetToHold = useCallback(() => {
      const video = videoRef.current;
      const gen = ++generationRef.current;
      stopRaf();
      if (!video) {
        void reachHold(true, gen);
        return;
      }

      video.pause();
      video.playbackRate = 1;

      if (skipPlay) {
        void reachHold(true, gen);
        return;
      }

      const frames = framesRef.current;
      if (frames.length < 2) {
        // No strip — lightweight reverse scrub (fewer seeks than before).
        void (async () => {
          phaseRef.current = 'reverse';
          let announced = false;
          const from = Math.min(
            HERO_VIDEO_SCROLL_END,
            Math.max(video.currentTime, HERO_VIDEO_INTRO_END),
          );
          const steps = 18;
          for (let i = 1; i <= steps; i++) {
            if (
              generationRef.current !== gen ||
              phaseRef.current !== 'reverse'
            ) {
              return;
            }
            const t = i / steps;
            const eased = t * t * (3 - 2 * t);
            await seekPaused(video, from + (HERO_VIDEO_INTRO_END - from) * eased);
            if (!announced && t >= REVERSE_ANNOUNCE_AT) {
              announced = true;
              onIntroHoldRef.current?.();
            }
          }
          if (generationRef.current !== gen) return;
          await reachHold(!announced, gen);
        })();
        return;
      }

      phaseRef.current = 'reverse';
      const last = frames.length - 1;
      paintOverlay(frames[last]!);
      showOverlayNow(true, false);

      let announced = false;
      let lastIndex = last;
      const easeOut = (t: number) => 1 - (1 - t) ** 2.4;
      const started = performance.now();

      const tick = (now: number) => {
        if (
          generationRef.current !== gen ||
          phaseRef.current !== 'reverse'
        ) {
          return;
        }
        const t = Math.min(1, (now - started) / BEAT_MS);
        const eased = easeOut(t);
        const index = Math.max(0, Math.min(last, Math.round(last * (1 - eased))));
        if (index !== lastIndex) {
          lastIndex = index;
          const frame = frames[index];
          if (frame) paintOverlay(frame);
        }

        if (!announced && t >= REVERSE_ANNOUNCE_AT) {
          announced = true;
          onIntroHoldRef.current?.();
        }

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        void reachHold(!announced, gen);
      };

      rafRef.current = requestAnimationFrame(tick);
    }, [paintOverlay, reachHold, skipPlay, showOverlayNow, stopRaf]);

    useImperativeHandle(ref, () => ({ playScrollOut, resetToHold }), [
      playScrollOut,
      resetToHold,
    ]);

    useEffect(() => {
      const video = videoRef.current;
      let cancelled = false;
      stopRaf();
      clearFrames();
      setOverlayOn(false);
      setReady(false);
      phaseRef.current = 'boot';

      // Phone / tablet / reduced-motion: no mp4 — unlock copy immediately.
      if (skipPlay) {
        setReady(true);
        phaseRef.current = 'hold';
        onIntroHoldRef.current?.();
        return () => {
          cancelled = true;
          stopRaf();
          clearFrames();
        };
      }

      // Desktop: hide hero copy until the intro is on screen.
      onIntroResetRef.current?.();

      if (!video) return;

      const run = async () => {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;

        try {
          video.load();
        } catch {
          // ignore
        }

        // Prefer first decodable frame over full buffer — keeps poster short-lived.
        if (video.readyState < 2) {
          await Promise.race([
            waitFor(video, 'loadeddata', 4000),
            waitFor(video, 'canplay', 4000),
            waitFor(video, 'canplaythrough', 4000),
          ]);
        }
        if (cancelled) return;

        await seekPaused(video, HERO_VIDEO_INTRO_START);
        if (cancelled) return;

        phaseRef.current = 'intro';
        try {
          await video.play();
        } catch {
          if (cancelled) return;
          await seekPaused(video, HERO_VIDEO_INTRO_END);
          setReady(true);
          phaseRef.current = 'hold';
          onIntroHoldRef.current?.();
          return;
        }

        if (cancelled) {
          video.pause();
          return;
        }
        // Video is painting — poster can fade. Copy still waits for reveal beat.
        setReady(true);

        let announced = false;
        const tick = () => {
          if (cancelled || phaseRef.current !== 'intro') return;
          // Only after the video is actually playing past the reveal mark.
          if (
            !announced &&
            video.readyState >= 2 &&
            video.currentTime >= HERO_CONTENT_REVEAL_AT
          ) {
            announced = true;
            onIntroHoldRef.current?.();
          }
          if (video.currentTime >= HERO_VIDEO_INTRO_END - 0.02) {
            video.pause();
            video.currentTime = HERO_VIDEO_INTRO_END;
            phaseRef.current = 'hold';
            rafRef.current = 0;
            if (!announced) onIntroHoldRef.current?.();
            return;
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      };

      void run();

      return () => {
        cancelled = true;
        stopRaf();
        clearFrames();
        video.pause();
      };
    }, [clearFrames, skipPlay, stopRaf]);

    return (
      <div
        aria-hidden
        className={cn(
          'relative h-full w-full overflow-hidden',
          laptopUp ? 'bg-zinc-950' : 'bg-[#03140f]',
        )}
      >
        {laptopUp ? (
          <>
            {/* Instant paint while the mp4 buffers — kill the long black stage. */}
            <img
              src={VIDEO_POSTER}
              alt=""
              decoding="async"
              fetchPriority="high"
              className={cn(
                'absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-500',
                ready ? 'opacity-0' : 'opacity-100',
              )}
            />
            <video
              ref={videoRef}
              className={cn(
                'relative z-[1] h-full w-full object-cover transition-opacity duration-500',
                ready ? 'opacity-100' : 'opacity-0',
              )}
              src={VIDEO_SRC}
              poster={VIDEO_POSTER}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
            />
          </>
        ) : (
          <MobileHeroAtmosphere index={atmosphereIndex} />
        )}
        <canvas
          ref={overlayRef}
          className={cn(
            'absolute inset-0 z-[2] h-full w-full object-cover',
            overlayOn ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        />
      </div>
    );
  },
);
