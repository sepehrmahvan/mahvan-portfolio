'use client';

import { Phone } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
} from 'motion/react';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

import { MobileShipAtmosphere } from '@/components/landing/mobile/MobileShipAtmosphere';
import CardSwap from '@/components/ui/CardSwap/CardSwap';
import TextType from '@/components/ui/TextType/TextType';
import { useIsLaptopUp } from '@/hooks/useMinWidth';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { useLandingScroll } from '../LandingScrollContext';
import {
  LANDING_COURT_GREEN_CLASS,
  LANDING_INSET_END,
  LANDING_INSET_START,
} from '../shell';
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

/**
 * Section 4 — Ship.
 * Placement always matches English: copy + carousel on the physical left,
 * phone on the physical right. Locale only changes font + string content.
 */
export function ExperienceChapter({ content, locale }: ExperienceChapterProps) {
  const { time, reduceMotion } = useLandingScroll();
  const laptopUp = useIsLaptopUp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(() =>
    isChapterStep(time.get(), 'experience'),
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !laptopUp) return;

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
  }, [active, laptopUp, reduceMotion]);

  const copyFont = isRtl
    ? 'font-(family-name:--font-fa)'
    : 'font-(family-name:--font-en)';

  return (
    <div
      aria-label={content.galleryLabel}
      role="region"
      // Isolate from <html dir="rtl"> so absolute left/right never mirror.
      dir="ltr"
      className="pointer-events-none absolute inset-0 z-25"
    >
      {laptopUp ? (
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
      ) : (
        <MobileShipAtmosphere />
      )}

      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="experience-stage"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.55, ease }}
            className={cn(
              'pointer-events-auto absolute top-[11%] bottom-[3%] z-10 flex max-w-none flex-col items-stretch justify-start gap-3 overflow-y-auto sm:top-[12%] sm:justify-center sm:gap-4 md:top-[8%] md:bottom-[5%] md:gap-4 md:overflow-visible md:px-3 lg:gap-5 lg:px-4',
              // Physical LEFT rail (same as English) — ! so nothing overrides under RTL html.
              LANDING_INSET_START,
              'right-3! w-auto md:right-auto! md:w-[min(52vw,28rem)] lg:w-[min(50vw,40rem)] xl:w-[min(50vw,44rem)]',
              // Desktop keeps slide-from-left feel via child motion; mobile uses vertical stage.
              copyFont,
            )}
          >
            <div
              lang={locale}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="flex w-full flex-col items-stretch gap-3 sm:gap-4 md:gap-4 lg:gap-5"
            >
              {/* Mobile: live status beacon (phone is desktop-only) */}
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.04,
                  ease,
                }}
                className={cn(
                  'mx-auto flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3.5 py-1.5 text-[0.65rem] font-black tracking-[0.2em] text-emerald-200/95 uppercase backdrop-blur-sm lg:hidden',
                )}
              >
                <span
                  aria-hidden
                  className="relative flex size-2"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative size-2 rounded-full bg-emerald-400" />
                </span>
                {content.status}
              </motion.p>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : 0.08,
                  ease,
                }}
                className={cn(
                  'text-center text-[0.7rem] font-black tracking-[0.22em] uppercase md:text-xs',
                  laptopUp ? 'text-zinc-500' : 'text-white/45',
                )}
              >
                {content.eyebrow}
              </motion.p>

              <motion.h2
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : 0.1,
                  ease,
                }}
                className="sr-only"
              >
                {content.title}
              </motion.h2>

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
                  laptopUp
                    ? LANDING_COURT_GREEN_CLASS
                    : 'text-emerald-300',
                )}
              />

              <motion.ul
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.18,
                  ease,
                }}
                className={cn(
                  'flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.68rem] font-black tracking-[0.16em] uppercase md:text-[0.72rem]',
                  laptopUp ? 'text-zinc-500' : 'text-white/40',
                )}
              >
                {content.focus.map((item, index) => (
                  <li key={item} className="flex items-center gap-3">
                    {index > 0 ? (
                      <span
                        aria-hidden
                        className={cn(
                          'h-1 w-1 rounded-full',
                          laptopUp ? 'bg-zinc-400' : 'bg-emerald-500/60',
                        )}
                      />
                    ) : null}
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>

              {/* Gallery sits in the pulse band on mobile */}
              <div
                className={cn(
                  'mx-auto h-[min(42dvh,320px)] w-full max-w-[18rem] sm:h-[min(48dvh,400px)] sm:max-w-88 md:h-[min(52dvh,440px)] md:max-w-full lg:h-[min(58dvh,520px)]',
                  !laptopUp &&
                    'relative before:pointer-events-none before:absolute before:inset-[-12%] before:rounded-[2rem] before:bg-[radial-gradient(circle,rgb(11_110_79_/_0.22)_0%,transparent_68%)] before:content-[""]',
                )}
              >
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
                  theme={laptopUp ? 'light' : 'dark'}
                  className="relative z-1 h-full w-full"
                />
              </div>
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
            className={cn(
              // Phone stays laptop+ — dark Hairline strokes need the light video stage.
              'pointer-events-auto absolute top-1/2 z-10 hidden w-[min(32vw,16rem)] -translate-y-1/2 flex-col items-center gap-3 lg:flex lg:gap-4 xl:w-[min(40vw,18rem)]',
              LANDING_INSET_END,
              copyFont,
            )}
          >
            <div className="w-full" style={PHONE_VARS}>
              <Phone
                theme="light"
                intensity={0.65}
                play={!reduceMotion}
                label="Interactive phone"
                className="w-full"
              />
            </div>
            <p
              lang={locale}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="text-center text-[0.62rem] font-black tracking-[0.18em] text-zinc-600 uppercase lg:text-[0.72rem]"
            >
              <span
                aria-hidden
                className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-emerald-500"
              />
              {content.status}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
