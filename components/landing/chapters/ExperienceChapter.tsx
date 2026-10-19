'use client';

import { Phone } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

import CardSwap from '@/components/ui/CardSwap/CardSwap';
import TextType from '@/components/ui/TextType/TextType';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { useLandingScroll } from '../LandingScrollContext';
import { LANDING_COURT_GREEN_CLASS, LANDING_INSET_END } from '../shell';
import { isChapterStep } from '../timeline';

interface ExperienceChapterProps {
  content: LandingDictionary['experience'];
  locale: Locale;
}

const ease = [0.16, 1, 0.3, 1] as const;
/** Tail of asli.mp4 — plays once per visit to the Ship section. */
const BG_VIDEO_SRC = '/video/asli.mp4';
const BG_VIDEO_START = 8.8;
const BG_VIDEO_END = 9.5;

const PHONE_VARS = {
  '--hairline-plate': 'transparent',
  '--hairline-hi': '#18181b',
  '--hairline-edge': '#3f3f46',
  '--hairline-mid': '#71717a',
  '--hairline-lo': '#a1a1aa',
  '--hairline-stroke': '1.1',
} as CSSProperties;

/** Section 4: typed ship copy above CardSwap; Phone + status densify the right. */
export function ExperienceChapter({ content, locale }: ExperienceChapterProps) {
  const { time } = useLandingScroll();
  const reduceMotion = useReducedMotion() ?? false;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(
    () => reduceMotion || isChapterStep(time.get(), 'experience'),
  );
  const isRtl = isRtlLocale(locale);
  const galleryItems = useMemo(
    () =>
      content.gallery.map((item) => ({
        title: item.title,
        image: item.image,
        alt: item.alt,
      })),
    [content.gallery],
  );

  useMotionValueEvent(time, 'change', (value) => {
    setActive(isChapterStep(value, 'experience'));
  });

  // Play 8.5→10 once on enter; hold the end frame. Re-enter plays again.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= BG_VIDEO_END - 0.04) {
        video.pause();
        video.currentTime = BG_VIDEO_END;
      }
    };

    if (!active) {
      video.pause();
      video.removeEventListener('timeupdate', onTimeUpdate);
      return;
    }

    if (reduceMotion) {
      video.pause();
      const freeze = () => {
        video.currentTime = BG_VIDEO_END;
      };
      if (video.readyState >= 1) freeze();
      else video.addEventListener('loadedmetadata', freeze, { once: true });
      return () => {
        video.removeEventListener('loadedmetadata', freeze);
      };
    }

    video.muted = true;
    const start = () => {
      video.currentTime = BG_VIDEO_START;
      void video.play().catch(() => undefined);
    };

    if (video.readyState >= 1) start();
    else video.addEventListener('loadedmetadata', start, { once: true });

    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      video.pause();
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', start);
    };
  }, [active, reduceMotion]);

  return (
    <div
      aria-label={content.galleryLabel}
      role="region"
      className="pointer-events-none absolute inset-0 z-25"
    >
      <video
        ref={videoRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        src={BG_VIDEO_SRC}
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controls={false}
      />

      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="experience-stage"
            initial={reduceMotion ? false : { opacity: 0, x: -56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              'pointer-events-auto absolute inset-x-3 top-[12%] bottom-[4%] z-10 flex max-w-none flex-col items-stretch justify-start gap-3 overflow-y-auto sm:justify-center sm:gap-4 md:inset-y-[9%] md:left-0 md:right-auto md:inset-x-auto md:bottom-[5%] md:w-[min(54vw,40rem)] md:gap-5 md:overflow-visible md:px-4 lg:w-[min(50vw,44rem)]',
              isRtl
                ? 'font-(family-name:--font-fa)'
                : 'font-(family-name:--font-en)',
            )}
          >
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.08, ease }}
              className="text-center text-[0.7rem] font-black tracking-[0.22em] text-zinc-500 uppercase md:text-xs"
            >
              {content.eyebrow}
            </motion.p>

            <TextType
              as="p"
              text={content.typeLines}
              typingSpeed={70}
              pauseDuration={1600}
              deletingSpeed={45}
              deleteMode="backspace"
              typeEffect="none"
              mistakes={0}
              cursorStyle="underscore"
              cursorGlide
              showCursor
              cursorColor="currentColor"
              prefixColor="currentColor"
              cursorBlinkDuration={0.5}
              cursorCharacter="_"
              prefix=""
              loop={!reduceMotion}
              className={cn(
                'w-full text-center text-lg font-black uppercase leading-snug tracking-tight sm:text-xl md:text-2xl lg:text-[1.75rem]',
                LANDING_COURT_GREEN_CLASS,
              )}
            />

            <motion.ul
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.18, ease }}
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.68rem] font-black tracking-[0.16em] text-zinc-500 uppercase md:text-[0.72rem]"
            >
              {content.focus.map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden className="h-1 w-1 rounded-full bg-zinc-400" />
                  ) : null}
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <div className="mx-auto h-[min(48dvh,420px)] w-full max-w-[22rem] sm:h-[min(54dvh,480px)] sm:max-w-130 md:h-[min(58dvh,520px)]">
              <CardSwap
                items={galleryItems}
                width={480}
                height={340}
                cardDistance={60}
                verticalDistance={70}
                depth={90}
                skewAmount={6}
                visibleCards={4}
                cardRadius={18}
                delay={4000}
                speed={1}
                bounce={0.35}
                parallax={0.5}
                hoverSpread={0.12}
                dim={0.5}
                autoplay={!reduceMotion}
                pauseOnHover
                draggable
                theme="light"
                className="h-full w-full"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="experience-aside"
            initial={reduceMotion ? false : { opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.55, ease, delay: reduceMotion ? 0 : 0.14 }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              'pointer-events-auto absolute top-1/2 z-10 hidden w-[min(28vw,16rem)] -translate-y-1/2 flex-col items-center gap-4 lg:flex lg:w-[min(40vw,18rem)]',
              LANDING_INSET_END,
              isRtl
                ? 'font-(family-name:--font-fa)'
                : 'font-(family-name:--font-en)',
            )}
          >
            <div className="w-full" style={PHONE_VARS}>
              {/* Docs: https://hairline.lucasmarkes.com/docs#figures */}
              <Phone
                theme="light"
                intensity={0.65}
                play={!reduceMotion}
                label="Interactive phone"
                className="w-full"
              />
            </div>
            <p className="text-center text-[0.68rem] font-black tracking-[0.18em] text-zinc-600 uppercase md:text-[0.72rem]">
              <span
                aria-hidden
                className="me-2 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-emerald-500"
              />
              {content.status}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
