'use client';

import { Laptop } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
} from 'motion/react';
import Image from 'next/image';
import { type CSSProperties, useState } from 'react';

import OptionWheel from '@/components/ui/OptionWheel/OptionWheel';
import TextType from '@/components/ui/TextType/TextType';
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

/** Dark Hairline strokes for the light Build section. */
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
 * Phone: type + laptop + compact model/stepper stack.
 * iPad: model+stepper mid-left, aside right (no wheel).
 * Desktop / iPad Pro landscape: wheel + model/stepper + aside.
 */
export function SoftSkillsChapter({ content, locale }: SoftSkillsChapterProps) {
  const { time, reduceMotion } = useLandingScroll();
  const [active, setActive] = useState(() =>
    isChapterStep(time.get(), 'soft-skills'),
  );
  const isRtl = isRtlLocale(locale);
  const defaultSelected = Math.min(
    Math.max(0, content.defaultSelected ?? 0),
    Math.max(0, content.stack.length - 1),
  );

  useMotionValueEvent(time, 'change', (value) => {
    setActive(isChapterStep(value, 'soft-skills'));
  });

  const modelStepper = (
    <div className="flex h-full min-h-0 w-full items-stretch justify-center gap-2.5 sm:gap-3 xl:gap-4">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease, delay: reduceMotion ? 0 : 0.1 }}
        // Same band height as before. Large monitors: width follows image aspect (912×1724) so no crop.
        className="relative h-full min-h-0 w-[min(28vw,7.5rem)] shrink-0 self-stretch overflow-hidden sm:w-[min(24vw,9rem)] md:w-[min(20vw,10rem)] lg:aspect-[912/1724] lg:w-auto"
      >
        <Image
          src="/images/my-model.png"
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
        className="h-full min-h-0 max-w-[min(100%,13.5rem)] flex-1 self-stretch sm:max-w-[14.5rem] lg:max-w-[17rem] xl:max-w-[18.5rem]"
      />
    </div>
  );

  return (
    <div
      aria-label={content.ariaLabel}
      role="region"
      className="pointer-events-none absolute inset-0 z-25"
    >
      {/* Stack wheel — laptop / iPad Pro landscape+ only */}
      <AnimatePresence mode="sync">
        {active ? (
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

      {/* Model + stepper — iPad portrait+ (md); phone uses in-flow copy below */}
      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="soft-skills-stepper"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease, delay: reduceMotion ? 0 : 0.08 }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              'pointer-events-none absolute top-16 bottom-[30px] z-10 hidden items-stretch justify-center md:flex lg:top-[4.25rem]',
              // iPad: full mid band. Desktop: leave room for wheel + aside.
              isRtl
                ? 'right-4 left-[min(48vw,calc(28rem+1.5rem))] font-(family-name:--font-fa) lg:right-[min(36vw,18rem)] lg:left-[min(48vw,calc(32rem+2rem))]'
                : 'left-4 right-[min(48vw,calc(28rem+1.5rem))] font-(family-name:--font-en) lg:left-[min(36vw,18rem)] lg:right-[min(48vw,calc(32rem+2rem))]',
            )}
          >
            {modelStepper}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Aside + phone stack */}
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
                  // Phone: stacked column. iPad+: right rail only.
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

                {/* Phone-only model + stepper under the laptop */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: reduceMotion ? 0 : 0.2,
                    ease,
                  }}
                  className="h-[min(42dvh,17.5rem)] w-full shrink-0 md:hidden"
                >
                  {modelStepper}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
