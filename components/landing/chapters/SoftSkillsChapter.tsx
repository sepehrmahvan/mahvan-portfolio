'use client';

import { Laptop } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
} from 'motion/react';
import Image from 'next/image';
import { type CSSProperties, useState } from 'react';

import { MobileHeroAtmosphere } from '@/components/landing/mobile/MobileHeroAtmosphere';
import OptionWheel from '@/components/ui/OptionWheel/OptionWheel';
import TextType from '@/components/ui/TextType/TextType';
import { useIsLaptopUp } from '@/hooks/useMinWidth';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { ProductStepper } from '../ProductStepper';
import { useLandingScroll } from '../LandingScrollContext';
import {
  LANDING_COURT_GREEN,
  LANDING_COURT_GREEN_CLASS,
  LANDING_SHELL,
} from '../shell';
import { isChapterStep } from '../timeline';

interface SoftSkillsChapterProps {
  content: LandingDictionary['softSkills'];
  locale: Locale;
}

const ease = [0.16, 1, 0.3, 1] as const;

/** Dark Hairline strokes for the light Build section (laptop+). */
const LAPTOP_VARS = {
  '--hairline-plate': 'transparent',
  '--hairline-hi': '#18181b',
  '--hairline-edge': '#3f3f46',
  '--hairline-mid': '#71717a',
  '--hairline-lo': '#a1a1aa',
  '--hairline-stroke': '1.1',
} as CSSProperties;

/**
 * Section 3 — Build.
 * Mobile/tablet: hero-like kinetic court-green stage.
 * Desktop / iPad Pro landscape: wheel + model/stepper + aside on white.
 */
export function SoftSkillsChapter({ content, locale }: SoftSkillsChapterProps) {
  const { time, reduceMotion } = useLandingScroll();
  const laptopUp = useIsLaptopUp();
  const [active, setActive] = useState(() =>
    isChapterStep(time.get(), 'soft-skills'),
  );
  const isRtl = isRtlLocale(locale);
  const defaultSelected = Math.min(
    Math.max(0, content.defaultSelected ?? 0),
    Math.max(0, content.stack.length - 1),
  );
  const stepperTone = laptopUp ? 'light' : 'dark';

  useMotionValueEvent(time, 'change', (value) => {
    setActive(isChapterStep(value, 'soft-skills'));
  });

  const modelStepper = (
    <div className="flex h-full min-h-0 w-full items-stretch justify-center gap-2.5 sm:gap-3 xl:gap-4">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease, delay: reduceMotion ? 0 : 0.1 }}
        className="relative h-full min-h-0 w-[min(28vw,7.5rem)] shrink-0 self-stretch overflow-hidden sm:w-[min(24vw,9rem)] md:w-[min(20vw,10rem)] lg:aspect-912/1724 lg:w-auto"
      >
        <Image
          src="/images/my-model.webp"
          alt="Sepehr Mahvan"
          fill
          sizes="(max-width: 1024px) 160px, 320px"
          className="object-cover object-top lg:object-contain"
        />
      </motion.div>
      <ProductStepper
        ariaLabel={content.stepper.ariaLabel}
        eyebrow={content.stepper.eyebrow}
        stages={content.stepper.stages}
        active={active}
        tone={stepperTone}
        className="h-full min-h-0 max-w-[min(100%,13.5rem)] flex-1 self-stretch sm:max-w-58 md:max-w-70 lg:max-w-76 xl:max-w-74"
      />
    </div>
  );

  return (
    <div
      aria-label={content.ariaLabel}
      role="region"
      className="pointer-events-none absolute inset-0 z-25"
    >
      {!laptopUp ? <MobileHeroAtmosphere index="03" /> : null}

      {/* Stack wheel — laptop+ only */}
      <AnimatePresence mode="sync">
        {active && laptopUp ? (
          <motion.div
            key="soft-skills-wheel"
            initial={reduceMotion ? false : { opacity: 0, x: -48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={{ duration: 0.55, ease }}
            className="pointer-events-auto absolute inset-y-0 left-0 hidden w-[min(36vw,18rem)] lg:block lg:w-[min(40vw,20rem)]"
          >
            <OptionWheel
              items={content.stack}
              defaultSelected={defaultSelected}
              textColor="#71717a"
              activeColor={LANDING_COURT_GREEN}
              side="left"
              fontSize={3.15}
              spacing={1.35}
              curve={1}
              tilt={6}
              blur={1}
              fade={0.18}
              minOpacity={0.22}
              smoothing={220}
              inset={0}
              loop
              autoplay={!reduceMotion}
              autoplayInterval={2400}
              draggable
              soundUrl=""
              soundVolume={0.5}
              className="h-full w-full"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Model + stepper — iPad portrait+ mid band; desktop leaves room for wheel */}
      <AnimatePresence mode="sync">
        {active && laptopUp ? (
          <motion.div
            key="soft-skills-stepper"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease, delay: reduceMotion ? 0 : 0.08 }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              'pointer-events-none absolute top-16 bottom-7.5 z-10 hidden items-stretch justify-center md:flex lg:top-17',
              isRtl
                ? 'right-4 left-[min(48vw,calc(28rem+1.5rem))] font-(family-name:--font-fa) lg:right-[min(36vw,18rem)] lg:left-[min(48vw,calc(32rem+2rem))]'
                : 'left-4 right-[min(48vw,calc(28rem+1.5rem))] font-(family-name:--font-en) lg:left-[min(36vw,18rem)] lg:right-[min(48vw,calc(32rem+2rem))]',
            )}
          >
            {modelStepper}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Mobile / tablet: hero-like kinetic composition ── */}
      <AnimatePresence mode="sync">
        {active && !laptopUp ? (
          <motion.div
            key="soft-skills-mobile"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.55, ease }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              LANDING_SHELL,
              'pointer-events-auto absolute inset-0 z-20 flex flex-col justify-between pt-20 pb-6',
              isRtl
                ? 'font-(family-name:--font-fa)'
                : 'font-(family-name:--font-en)',
            )}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 shrink-0 bg-[#0B6E4F]" />
                <p
                  className={cn(
                    'text-[0.68rem] tracking-[0.28em] text-emerald-200/80 uppercase',
                    isRtl ? 'font-normal' : 'font-black',
                  )}
                >
                  {content.eyebrow}
                </p>
              </div>

              <h2
                className={cn(
                  'max-w-[16ch] text-[clamp(1.65rem,7.5vw,2.35rem)] leading-[0.95] tracking-[-0.02em] text-white',
                  isRtl ? 'font-normal' : 'font-black',
                )}
              >
                {content.title}
              </h2>

              <div className="relative h-8 w-full max-w-[14rem]" aria-hidden>
                <span className="absolute top-1/2 start-0 h-[2px] w-full origin-start bg-[#0B6E4F] shadow-[0_0_18px_rgb(11_110_79_/_0.55)]" />
                <span className="absolute top-1/2 start-0 size-2 -translate-y-1/2 rounded-full bg-emerald-300" />
              </div>

              <TextType
                as="p"
                text={content.typeLines}
                typingSpeed={75}
                pauseDuration={1500}
                deletingSpeed={50}
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
                className="max-w-[28ch] text-sm font-medium leading-relaxed text-emerald-100/90 sm:text-base"
              />

              {content.focus?.length ? (
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] font-black tracking-[0.16em] text-white/40 uppercase">
                  {content.focus.map((item, index) => (
                    <li key={item} className="flex items-center gap-3">
                      {index > 0 ? (
                        <span
                          aria-hidden
                          className="h-1 w-1 rounded-full bg-emerald-500/60"
                        />
                      ) : null}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="relative mt-4 h-[min(46dvh,22rem)] w-full shrink-0">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[-8%] rounded-[1.5rem] bg-[radial-gradient(circle,rgb(11_110_79_/_0.28)_0%,transparent_68%)]"
              />
              <div className="relative z-1 h-full w-full">{modelStepper}</div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Desktop aside: type + laptop ── */}
      {laptopUp ? (
        <div
          className={cn(
            LANDING_SHELL,
            'pointer-events-none absolute inset-x-0 top-0 z-20 h-full',
          )}
        >
          <div className="relative h-full">
            <AnimatePresence mode="sync">
              {active ? (
                <motion.div
                  key="soft-skills-aside"
                  initial={reduceMotion ? false : { opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 28 }}
                  transition={{
                    duration: 0.6,
                    ease,
                    delay: reduceMotion ? 0 : 0.12,
                  }}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  lang={locale}
                  className={cn(
                    'pointer-events-auto absolute inset-x-0 top-16 bottom-3 flex max-w-none flex-col items-stretch gap-3 overflow-y-auto py-2 sm:top-20 sm:bottom-4 sm:gap-4',
                    'justify-start md:inset-y-auto md:top-[18%] md:bottom-8 md:left-auto md:right-0 md:w-[min(44vw,24rem)] md:justify-between xl:justify-start md:gap-5 md:overflow-visible md:py-0 lg:w-[min(40vw,28rem)] lg:top-[20%]',
                    isRtl
                      ? 'font-(family-name:--font-fa)'
                      : 'font-(family-name:--font-en)',
                  )}
                >
                  <TextType
                    as="p"
                    text={content.typeLines}
                    typingSpeed={75}
                    pauseDuration={1500}
                    deletingSpeed={50}
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
                      'mx-auto w-full max-w-[18ch] text-center text-base font-black uppercase leading-snug tracking-tight sm:max-w-[20ch] sm:text-lg md:max-w-[17ch] md:text-[1.25rem] lg:max-w-[26ch] lg:text-[1.5rem]',
                      LANDING_COURT_GREEN_CLASS,
                    )}
                  />

                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: reduceMotion ? 0 : 0.16,
                      ease,
                    }}
                    className="flex w-full justify-center"
                  >
                    <div
                      className="mx-auto -mt-2 w-full max-w-72 sm:-mt-3 sm:max-w-96 md:-mt-4 md:max-w-full"
                      style={LAPTOP_VARS}
                    >
                      <Laptop
                        theme="light"
                        intensity={0.7}
                        play={!reduceMotion}
                        label="Interactive laptop"
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      ) : null}
    </div>
  );
}
