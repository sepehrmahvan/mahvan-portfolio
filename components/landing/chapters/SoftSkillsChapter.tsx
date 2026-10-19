'use client';

import { Laptop } from '@lucasmarkes/hairline/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { type CSSProperties, useState } from 'react';

import OptionWheel from '@/components/ui/OptionWheel/OptionWheel';
import TextType from '@/components/ui/TextType/TextType';
import ThoughtLine from '@/components/ui/ThoughtLine/ThoughtLine';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { ProductStepper } from '../ProductStepper';
import { useLandingScroll } from '../LandingScrollContext';
import { LANDING_COURT_GREEN, LANDING_COURT_GREEN_CLASS } from '../shell';
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

/** Section 3: stack wheel left; laptop + process rail + type line on the right. */
export function SoftSkillsChapter({ content, locale }: SoftSkillsChapterProps) {
  const { time } = useLandingScroll();
  const reduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState(
    () => reduceMotion || isChapterStep(time.get(), 'soft-skills'),
  );
  const isRtl = isRtlLocale(locale);
  const defaultSelected = Math.min(
    Math.max(0, content.defaultSelected ?? 0),
    Math.max(0, content.stack.length - 1),
  );

  useMotionValueEvent(time, 'change', (value) => {
    setActive(isChapterStep(value, 'soft-skills'));
  });

  return (
    <div
      aria-label={content.ariaLabel}
      role="region"
      className="pointer-events-none absolute inset-0 z-25"
    >
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
              // Open band between the stack wheel and the right aside (lg+).
              'pointer-events-none absolute inset-y-0 z-10 hidden items-center justify-center lg:flex',
              isRtl
                ? 'right-[min(40vw,20rem)] left-[min(52vw,calc(36rem+2.5rem))] font-(family-name:--font-fa)'
                : 'left-[min(40vw,20rem)] right-[min(52vw,calc(36rem+2.5rem))] font-(family-name:--font-en)',
            )}
          >
            <ProductStepper
              ariaLabel={content.stepper.ariaLabel}
              eyebrow={content.stepper.eyebrow}
              stages={content.stepper.stages}
              active={active}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="soft-skills-aside"
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 28 }}
            transition={{ duration: 0.6, ease, delay: reduceMotion ? 0 : 0.12 }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              'pointer-events-auto absolute inset-x-3 top-16 bottom-4 z-20 flex max-w-none flex-col items-stretch justify-start gap-4 overflow-y-auto py-2 sm:justify-center sm:gap-5 md:inset-y-0 md:left-auto md:right-6 md:inset-x-auto md:w-[min(72vw,40rem)] md:justify-center md:gap-6 md:overflow-visible md:py-24 lg:right-6 lg:w-[min(52vw,36rem)] lg:py-28 xl:right-12',
              isRtl
                ? 'font-(family-name:--font-fa)'
                : 'font-(family-name:--font-en)',
            )}
          >
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.1, ease }}
              className="text-center text-[0.7rem] font-black tracking-[0.22em] text-zinc-500 uppercase md:text-xs"
            >
              {content.eyebrow}
            </motion.p>

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
                'w-full text-center text-lg font-black uppercase leading-snug tracking-tight sm:text-xl md:text-2xl lg:text-[1.85rem]',
                LANDING_COURT_GREEN_CLASS,
              )}
            />

            {/* Laptop first on phone; tablet gets process rail. Center stepper stays lg+. */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.16, ease }}
              className="grid w-full grid-cols-1 items-center gap-4 sm:gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(12rem,0.85fr)] md:gap-6"
            >
              <div className="mx-auto w-full max-w-[18rem] sm:max-w-[22rem] md:mx-0 md:max-w-none" style={LAPTOP_VARS}>
                {/* Docs: https://hairline.lucasmarkes.com/docs#figures */}
                <Laptop
                  theme="light"
                  intensity={0.7}
                  play={!reduceMotion}
                  label="Interactive laptop"
                  className="w-full"
                />
              </div>

              <div className="hidden justify-center text-zinc-800 md:flex md:justify-start">
                <ThoughtLine
                  label={content.processLabel}
                  doneLabel={content.doneLabel}
                  steps={content.steps}
                  working={!reduceMotion}
                  settleAfter={0}
                  showTimer={false}
                  collapsible={false}
                  collapseOnSettle={false}
                  color={LANDING_COURT_GREEN}
                  glyphColor={LANDING_COURT_GREEN}
                  fontSize={13}
                />
              </div>
            </motion.div>

            <motion.ul
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.32, ease }}
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
