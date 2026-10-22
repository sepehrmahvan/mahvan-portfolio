'use client';

import { Keyboard } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  type Variants,
} from 'motion/react';
import { type CSSProperties, useState } from 'react';

import DitherVeil from '@/components/ui/DitherVeil/DitherVeil';
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
  /** Same label as the nav contact control. */
  contactLabel: string;
  /** Contact portrait — shown on mobile hero between name and about. */
  portraitSrc: string;
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

/** Mobile-only: stacked stage — brand first, no glass card. */
const mobileListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

const mobileLineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: 'blur(14px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      mass: 0.8,
      filter: { duration: 0.55, ease },
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: { duration: 0.32, ease },
  },
};

/** Left-band intro: each line enters/exits on its own, one after another. */
export function HeroChapter({
  content,
  contactLabel,
  portraitSrc,
  locale,
}: HeroChapterProps) {
  const { time, heroRevealReady, reduceMotion, scrollToContact } = useLandingScroll();
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
        'mt-4 text-[1.50rem] tracking-tight text-[#0B6E4F]',
        isRtl ? 'font-normal tracking-[0.01em]' : 'font-black',
      ),
      text: content.role,
    },
    {
      key: 'body',
      className: cn(
        'mt-3 max-w-[24ch] text-[1.25rem] leading-snug text-zinc-700',
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
        {/* ── Mobile / tablet: full-bleed kinetic stage (no glass) ── */}
        <AnimatePresence mode="sync">
          {active ? (
            <motion.div
              key="hero-mobile"
              dir={isRtl ? 'rtl' : 'ltr'}
              lang={locale}
              variants={mobileListVariants}
              initial={reduceMotion ? false : 'hidden'}
              animate="show"
              exit="exit"
              className={cn(
                'absolute inset-0 z-10 flex flex-col px-1 pt-2 pb-2 lg:hidden',
                isRtl
                  ? 'font-(family-name:--font-fa)'
                  : 'font-(family-name:--font-en)',
              )}
            >
              {/* Top band — greeting + name */}
              <div className="flex shrink-0 flex-col gap-3 pt-2">
                <motion.div
                  variants={reduceMotion ? undefined : mobileLineVariants}
                  className="flex items-center gap-3"
                >
                  <span
                    aria-hidden
                    className="h-px w-8 shrink-0 bg-[#0B6E4F]"
                  />
                  <p
                    className={cn(
                      'text-[0.68rem] tracking-[0.28em] text-emerald-200/80 uppercase',
                      isRtl ? 'font-normal' : 'font-black',
                    )}
                  >
                    {content.greeting}
                  </p>
                </motion.div>

                <motion.h1
                  variants={reduceMotion ? undefined : mobileLineVariants}
                  className={cn(
                    'max-w-[11ch] text-[clamp(2.35rem,11vw,3.75rem)] leading-[0.9] tracking-[-0.03em] text-white',
                    isRtl ? 'font-normal' : 'font-black',
                  )}
                >
                  {content.name}
                </motion.h1>

                <motion.div
                  variants={reduceMotion ? undefined : mobileLineVariants}
                  className="relative h-6 w-full max-w-[14rem]"
                  aria-hidden
                >
                  <span className="absolute top-1/2 start-0 h-[2px] w-full origin-start bg-[#0B6E4F] shadow-[0_0_18px_rgb(11_110_79_/_0.55)]" />
                  <span className="absolute top-1/2 start-0 size-2 -translate-y-1/2 rounded-full bg-emerald-300" />
                </motion.div>
              </div>

              {/* Mid — contact portrait (same asset as section 6) */}
              <motion.div
                variants={reduceMotion ? undefined : mobileLineVariants}
                className="pointer-events-auto relative mx-auto my-2 h-[min(34dvh,15.5rem)] w-full max-w-[15rem] min-h-0 flex-1"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-[55%] bg-[radial-gradient(ellipse_at_bottom,rgb(11_110_79_/_0.4)_0%,transparent_72%)]"
                />
                <DitherVeil
                  src={portraitSrc}
                  pattern="floyd"
                  pixelSize={3}
                  inkColor="#000000"
                  paperColor="#f2f2f2"
                  revealRadius={160}
                  softness={0.55}
                  linger={1.1}
                  fit="contain"
                  rimColor="#0B6E4F"
                  palette="duotone"
                  levels={2}
                  contrast={1.25}
                  brightness={0.05}
                  rim={0}
                  reverse={false}
                  wander={false}
                  clickBurst={!reduceMotion}
                  transparentBackdrop
                  className="absolute inset-0 h-full w-full"
                />
              </motion.div>

              {/* Bottom band — about + contact CTA */}
              <div className="flex shrink-0 flex-col gap-2.5 pb-1">
                <motion.p
                  variants={reduceMotion ? undefined : mobileLineVariants}
                  className={cn(
                    'max-w-[22ch] text-base leading-snug tracking-[0.04em] text-emerald-100/95 sm:text-lg',
                    isRtl ? 'font-normal' : 'font-black',
                  )}
                >
                  {content.role}
                </motion.p>
                <motion.p
                  variants={reduceMotion ? undefined : mobileLineVariants}
                  className={cn(
                    'max-w-[32ch] text-sm leading-relaxed text-white/55 sm:text-[0.95rem]',
                    isRtl ? 'font-normal' : 'font-medium',
                  )}
                >
                  {content.body}
                </motion.p>
                <motion.div variants={reduceMotion ? undefined : mobileLineVariants}>
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className={cn(
                      'pointer-events-auto mt-1 inline-flex h-11 items-center justify-center border border-white bg-white px-5 text-[0.8rem] tracking-[0.08em] text-zinc-950 uppercase transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#0B6E4F] hover:border-[#0B6E4F] hover:text-white active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
                      isRtl ? 'font-normal' : 'font-black',
                    )}
                  >
                    {contactLabel}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ── Desktop: original left-band layout ── */}
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
                'absolute inset-s-0 top-[47%] z-10 hidden w-[min(37rem,45vw)] -translate-y-1/2 flex-col items-start text-start perspective-[1100px] lg:flex',
                isRtl
                  ? 'font-(family-name:--font-fa)'
                  : 'font-(family-name:--font-en)',
              )}
            >
              <motion.p
                key="greeting"
                custom={{ index: 0, from: fromEdge } satisfies LineCustom}
                variants={reduceMotion ? undefined : lineVariants}
                className={cn(
                  'text-[1.75rem] tracking-wide text-[#0B6E4F]',
                  isRtl ? 'font-normal' : 'font-black',
                )}
              >
                {content.greeting}
              </motion.p>

              {isRtl ? (
                <motion.h1
                  key="name"
                  custom={{ index: 1, from: fromEdge } satisfies LineCustom}
                  variants={reduceMotion ? undefined : lineVariants}
                  id="hero-title"
                  className="mt-2 -ms-1 max-w-[8.5ch] text-4xl font-normal leading-[0.95] text-zinc-950 lg:text-[5.25rem] xl:text-[6rem]"
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
                  className="pointer-events-auto relative -ms-2 h-30 w-full max-w-104 text-zinc-950 xl:h-33 xl:max-w-md"
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

              <motion.div
                custom={{ index: 4, from: fromEdge } satisfies LineCustom}
                variants={reduceMotion ? undefined : lineVariants}
                className="mt-6"
              >
                <button
                  type="button"
                  onClick={scrollToContact}
                  className={cn(
                    'pointer-events-auto inline-flex h-11 items-center justify-center border border-[#0B6E4F] bg-[#0B6E4F] px-5 text-[0.85rem] tracking-tight text-white transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-950 hover:border-zinc-950 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B6E4F]',
                    isRtl ? 'font-normal' : 'font-semibold',
                  )}
                >
                  {contactLabel}
                </button>
              </motion.div>
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
