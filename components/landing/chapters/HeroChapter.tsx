'use client';

import { Keyboard } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  type Variants,
} from 'motion/react';
import { type CSSProperties, useState } from 'react';

import TechText from '@/components/ui/TechText/TechText';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { useLandingScroll } from '../LandingScrollContext';
import { LANDING_SHELL } from '../shell';
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
  const { time, heroRevealReady, reduceMotion } = useLandingScroll();
  const [onHeroStep, setOnHeroStep] = useState(() => isChapterStep(time.get(), 'hero'));
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
        // Mobile/iPad: separated band under a hairline. Desktop: original green role.
        'mt-4 w-full border-t border-white/25 pt-4 text-sm tracking-[0.14em] text-white/90 uppercase sm:mt-5 sm:pt-5 sm:text-base md:text-lg',
        'lg:mt-4 lg:w-auto lg:border-0 lg:pt-0 lg:text-[1.50rem] lg:normal-case lg:tracking-tight lg:text-[#0B6E4F]',
        isRtl ? 'font-normal lg:tracking-[0.01em]' : 'font-black lg:tracking-tight',
      ),
      text: content.role,
    },
    {
      key: 'body',
      className: cn(
        // Mobile/iPad: softer secondary copy. Desktop: original zinc body.
        'mt-3 max-w-[28ch] text-sm leading-relaxed text-white/65 sm:mt-3.5 sm:max-w-[26ch] sm:text-base md:max-w-[28ch] md:text-lg',
        'lg:mt-3 lg:max-w-[24ch] lg:text-[1.25rem] lg:leading-snug lg:text-zinc-700',
        isRtl ? 'font-normal' : 'font-medium lg:font-bold',
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
                // Mobile / iPad: centered white copy, 30px from bottom, soft glass panel.
                'absolute inset-x-0 bottom-0 z-10 mx-auto flex w-[min(100%,22rem)] flex-col items-center px-4 py-5 text-center perspective-[1100px] sm:w-[min(28rem,88vw)] sm:px-5 sm:py-6 md:w-[min(34rem,72vw)]',
                'rounded-2xl border border-white/15 bg-zinc-950/35 shadow-[0_8px_32px_rgb(0_0_0/0.2)] backdrop-blur-md backdrop-saturate-150',
                // Desktop: original left-band layout (no glass).
                'lg:inset-x-auto lg:inset-s-0 lg:top-[47%] lg:bottom-auto lg:mx-0 lg:w-[min(37rem,45vw)] lg:-translate-y-1/2 lg:items-start lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-start lg:shadow-none lg:backdrop-blur-none lg:backdrop-saturate-100',
                isRtl
                  ? 'font-(family-name:--font-fa)'
                  : 'font-(family-name:--font-en)',
              )}
            >
              {/* greeting — eyebrow on glass; full green weight on desktop */}
              <motion.p
                key="greeting"
                custom={{ index: 0, from: fromEdge } satisfies LineCustom}
                variants={reduceMotion ? undefined : lineVariants}
                className={cn(
                  'text-[0.7rem] font-black tracking-[0.22em] text-white/70 uppercase md:text-[0.75rem]',
                  'lg:text-[1.75rem] lg:normal-case lg:tracking-wide lg:text-[#0B6E4F]',
                  isRtl ? 'font-normal lg:font-normal' : 'lg:font-black',
                )}
              >
                {content.greeting}
              </motion.p>

              {/* Mobile/iPad: solid white name. Desktop: TechText (EN) or solid (RTL). */}
              <motion.h1
                key="name-compact"
                custom={{ index: 1, from: fromEdge } satisfies LineCustom}
                variants={reduceMotion ? undefined : lineVariants}
                className={cn(
                  'mt-3 max-w-[12ch] text-4xl leading-[0.95] text-white sm:mt-3.5 sm:text-5xl md:text-6xl lg:hidden',
                  isRtl ? 'font-normal' : 'font-black',
                )}
              >
                {content.name}
              </motion.h1>

              {isRtl ? (
                <motion.h1
                  key="name"
                  custom={{ index: 1, from: fromEdge } satisfies LineCustom}
                  variants={reduceMotion ? undefined : lineVariants}
                  id="hero-title"
                  className="mt-2 -ms-1 hidden max-w-[8.5ch] text-4xl font-normal leading-[0.95] text-zinc-950 lg:block lg:text-[5.25rem] xl:text-[6rem]"
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
                  className="pointer-events-auto relative -ms-2 hidden h-10 w-full max-w-[16rem] text-zinc-950 lg:block lg:h-30 lg:max-w-104 xl:h-33 xl:max-w-md"
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
                  className={cn(line.className, 'max-lg:mx-auto')}
                >
                  {line.text}
                </motion.p>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Hairline Keyboard — desktop only; opposite the copy (LTR right / RTL left). */}
        <AnimatePresence mode="sync">
          {active ? (
            <motion.div
              key="hero-keyboard"
              initial={
                reduceMotion ? false : { opacity: 0, x: isRtl ? -36 : 36 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: isRtl ? -28 : 28 }}
              transition={{ duration: 0.5, ease, delay: reduceMotion ? 0 : 0.06 }}
              className={cn(
                'pointer-events-auto absolute top-1/2 hidden w-[min(52vw,36rem)] -translate-y-1/2 flex-col justify-center lg:flex',
                isRtl ? '-left-16' : '-right-16',
              )}
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
