'use client';

import { Keyboard } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import { type CSSProperties, useState } from 'react';

import TechText from '@/components/ui/TechText/TechText';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { useLandingScroll } from '../LandingScrollContext';
import { LANDING_COURT_GREEN_CLASS, LANDING_SHELL } from '../shell';
import { isChapterStep } from '../timeline';

/** Dark Hairline strokes over the light hero video. */
const KEYBOARD_VARS = {
  '--hairline-plate': 'transparent',
  '--hairline-hi': '#18181b',
  '--hairline-edge': '#3f3f46',
  '--hairline-mid': '#71717a',
  '--hairline-lo': '#a1a1aa',
  '--hairline-stroke': '1.15',
} as CSSProperties;

interface HeroChapterProps {
  content: LandingDictionary['hero'];
  locale: Locale;
}

const ease = [0.16, 1, 0.3, 1] as const;

/** Parent only orchestrates stagger — no shared box motion. */
const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

type LineCustom = { index: number; from: 1 | -1 };

/** Per-line motion; enters/exits from the open outer edge (left LTR, right RTL). */
const lineVariants: Variants = {
  hidden: ({ index, from }: LineCustom) => ({
    opacity: 0,
    x: from * (48 + index * 10),
    y: 28 + index * 4,
    rotateX: 36 + index * 4,
    filter: 'blur(12px)',
  }),
  show: ({ index }: LineCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 110 - index * 6,
      damping: 15 + index,
      mass: 0.75 + index * 0.05,
      filter: { duration: 0.5, ease },
    },
  }),
  exit: ({ index, from }: LineCustom) => ({
    opacity: 0,
    x: from * (56 + index * 8),
    y: -14 - index * 4,
    rotateX: -12,
    filter: 'blur(10px)',
    transition: {
      duration: 0.38 + index * 0.02,
      ease,
    },
  }),
};

/** Left-band intro: each line enters/exits on its own, one after another. */
export function HeroChapter({ content, locale }: HeroChapterProps) {
  const { time, heroRevealReady } = useLandingScroll();
  const reduceMotion = useReducedMotion() ?? false;
  const [onHeroStep, setOnHeroStep] = useState(
    () => reduceMotion || isChapterStep(time.get(), 'hero'),
  );
  const isRtl = isRtlLocale(locale);
  /** Enter/exit from the outer edge of the open side band. */
  const fromEdge: 1 | -1 = isRtl ? 1 : -1;
  /** Wait for eye→face video hold before copy enters. */
  const active = onHeroStep && heroRevealReady;

  useMotionValueEvent(time, 'change', (value) => {
    setOnHeroStep(isChapterStep(value, 'hero'));
  });

  const lines = [
    {
      key: 'role',
      className: cn(
        'mt-4 text-base sm:mt-5 sm:text-lg md:text-xl lg:text-[1.75rem]',
        LANDING_COURT_GREEN_CLASS,
        isRtl ? 'font-normal tracking-[0.01em]' : 'font-black tracking-tight',
      ),
      text: content.role,
    },
    {
      key: 'body',
      className: cn(
        'mt-3 max-w-[22ch] text-base leading-snug text-zinc-700 sm:mt-4 sm:max-w-[20ch] sm:text-lg md:max-w-[22ch] md:text-xl lg:max-w-[24ch] lg:text-[1.25rem]',
        isRtl ? 'font-normal' : 'font-bold',
      ),
      text: content.body,
    },
  ];

  return (
    <div aria-label="Introduction" role="region" className="pointer-events-none absolute inset-0 z-20">
      {/*
        Shell matches the header rail. Inner relative box is the content area only,
        so right-0 lines up with the Contact button (same content edge as nav).
      */}
      <div className={cn(LANDING_SHELL, 'h-full pt-16 pb-10 md:pt-20')}>
        <div className="relative h-full">
        <AnimatePresence mode="sync">
          {active ? (
            <motion.div
              key="hero-intro"
              dir={isRtl ? 'rtl' : 'ltr'}
              lang={locale}
              variants={listVariants}
              initial={reduceMotion ? false : 'hidden'}
              animate="show"
              exit="exit"
              className={cn(
                'absolute top-[42%] start-0 w-[min(100%,19.5rem)] -translate-y-1/2 perspective-[1100px] sm:top-[47%] sm:w-[min(32rem,52vw)] md:w-[min(38rem,46vw)]',
                'flex flex-col items-start text-start',
                isRtl
                  ? 'font-(family-name:--font-fa)'
                  : 'font-(family-name:--font-en)',
              )}
            >
              {/* greeting */}
              <motion.p
                key="greeting"
                custom={{ index: 0, from: fromEdge } satisfies LineCustom}
                variants={reduceMotion ? undefined : lineVariants}
                className={cn(
                  'text-xl tracking-wide md:text-2xl lg:text-[1.75rem]',
                  isRtl ? 'font-normal' : 'font-black',
                  LANDING_COURT_GREEN_CLASS,
                )}
              >
                {content.greeting}
              </motion.p>

              {/* Name: TechText only on English; Persian stays solid type. */}
              {isRtl ? (
                <motion.h1
                  key="name"
                  custom={{ index: 1, from: fromEdge } satisfies LineCustom}
                  variants={reduceMotion ? undefined : lineVariants}
                  id="hero-title"
                  className="mt-2 -ms-1 max-w-[8.5ch] text-4xl font-normal leading-[0.95] text-zinc-950 sm:text-5xl md:text-7xl lg:text-[5.25rem] xl:text-[6rem]"
                >
                  {content.name}
                </motion.h1>
              ) : (
                <motion.div
                  key="name"
                  custom={{ index: 1, from: fromEdge } satisfies LineCustom}
                  variants={reduceMotion ? undefined : lineVariants}
                  id="hero-title"
                  role="heading"
                  aria-level={1}
                  className="pointer-events-auto relative -ms-2 h-10 w-full max-w-[16rem] text-zinc-950 sm:-ms-5 sm:h-12 sm:max-w-[18rem] md:h-26 md:max-w-88 lg:h-30 lg:max-w-104 xl:h-33 xl:max-w-md"
                >
                  <TechText
                    text={content.name}
                    fontWeight={900}
                    fontSize={170}
                    reveal="letter"
                    dashLength={4}
                    dashGap={2}
                    specks={15}
                    intro="none"
                    introDuration={2}
                    clickKick
                    guides={false}
                    fontFamily=""
                    letterSpacing={-0.05}
                    accentColor="currentColor"
                    reach={200}
                    softness={0.7}
                    lineStyle="dashed"
                    strokeWidth={1.5}
                    speed={1}
                    bounce={0.4}
                    selection
                    labels
                    color="currentColor"
                    align="left"
                    draggable
                    sweep
                  />
                </motion.div>
              )}

              {lines.map((line, index) => (
                <motion.p
                  key={line.key}
                  custom={{ index: index + 2, from: fromEdge } satisfies LineCustom}
                  variants={reduceMotion ? undefined : lineVariants}
                  className={line.className}
                >
                  {line.text}
                </motion.p>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Hairline Keyboard — right edge flush with header Contact button. */}
        <AnimatePresence mode="sync">
          {active ? (
            <motion.div
              key="hero-keyboard"
              initial={reduceMotion ? false : { opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.5, ease, delay: reduceMotion ? 0 : 0.06 }}
              className="pointer-events-auto absolute top-1/2 -right-16 hidden w-[min(52vw,36rem)] -translate-y-1/2 flex-col justify-center md:flex"
              style={KEYBOARD_VARS}
            >
              {/* Docs: https://hairline.lucasmarkes.com/docs#figures */}
              <Keyboard
                theme="light"
                intensity={0.75}
                play={!reduceMotion}
                label="Interactive keyboard"
                className="w-full"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
