'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import Folder from '@/components/ui/Folder/Folder';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { useLandingScroll } from '../LandingScrollContext';
import { LANDING_COURT_GREEN, LANDING_COURT_GREEN_CLASS } from '../shell';
import { isChapterStep } from '../timeline';

interface SkillsChapterProps {
  content: LandingDictionary['skills'];
  locale: Locale;
}

const ease = [0.16, 1, 0.3, 1] as const;
const PROMPT_CYCLE_MS = 3800;

/**
 * Section 2 — Discover.
 * Character (video) left → Folder fills the mid gap → intake stage on the right.
 */
export function SkillsChapter({ content, locale }: SkillsChapterProps) {
  const { time, skillsRevealReady } = useLandingScroll();
  const reduceMotion = useReducedMotion() ?? false;
  const [onSkillsStep, setOnSkillsStep] = useState(
    () => reduceMotion || isChapterStep(time.get(), 'skills'),
  );
  const [activePrompt, setActivePrompt] = useState(0);
  const [paused, setPaused] = useState(false);
  const isRtl = isRtlLocale(locale);
  const facets = content.facets ?? [];
  const active = onSkillsStep && skillsRevealReady;
  const current = facets[activePrompt] ?? facets[0];
  const folderItems = useMemo(() => {
    if (content.folderItems?.length) {
      return content.folderItems.map((item) =>
        item.image
          ? { title: item.title, image: item.image, alt: item.alt }
          : { title: item.title, description: item.description },
      );
    }
    return facets.map((facet) => ({
      title: facet.label,
      description: facet.detail,
    }));
  }, [content.folderItems, facets]);
  const folderLabel = content.folderLabel ?? content.listenLabel;

  useMotionValueEvent(time, 'change', (value) => {
    setOnSkillsStep(isChapterStep(value, 'skills'));
  });

  useEffect(() => {
    if (!active || reduceMotion || paused || facets.length < 2) return;
    const id = window.setInterval(() => {
      setActivePrompt((prev) => (prev + 1) % facets.length);
    }, PROMPT_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [active, facets.length, paused, reduceMotion]);

  useEffect(() => {
    if (!active) setActivePrompt(0);
  }, [active]);

  return (
    <div
      aria-label={content.title}
      role="region"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      {/* Mid stage — Folder holds the gaze between character and copy. */}
      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="skills-folder"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.65, ease, delay: reduceMotion ? 0 : 0.06 }}
            className="pointer-events-auto absolute top-1/2 left-[42%] hidden -translate-x-1/2 translate-y-[-52%] md:block lg:left-[44%]"
          >
            <Folder
              label={folderLabel}
              items={folderItems}
              onItemClick={(_item, index) => {
                if (index < facets.length) setActivePrompt(index);
              }}
              mode="flap"
              variant="solid"
              color={LANDING_COURT_GREEN}
              paperColor="#ffffff"
              tabPosition="right"
              openOn="click"
              size={1.35}
              frost={0.2}
              tilt={0.45}
              speed={1}
              bounce={0.4}
              peek={!reduceMotion}
              intro={!reduceMotion}
              draggable
              zoomOnClick
              theme="light"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Right intake stage */}
      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="skills-stage"
            initial={reduceMotion ? false : { opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.55, ease, delay: reduceMotion ? 0 : 0.1 }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              'pointer-events-auto absolute inset-x-3 top-20 bottom-6 z-10 flex max-w-none flex-col justify-end gap-4 overflow-y-auto pb-2 sm:justify-center sm:gap-5 md:inset-y-0 md:left-auto md:right-3 md:inset-x-auto md:w-[min(42vw,28rem)] md:justify-center md:gap-6 md:overflow-visible md:py-20 lg:right-6 lg:w-[min(38vw,28rem)] xl:right-12',
              isRtl
                ? 'font-(family-name:--font-fa)'
                : 'font-(family-name:--font-en)',
            )}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.12, ease }}
              className="flex items-center gap-3"
            >
              <span aria-hidden className="h-px w-8 bg-zinc-300" />
              <p className="text-[0.68rem] font-black tracking-[0.26em] text-zinc-500 uppercase md:text-[0.72rem]">
                {content.eyebrow}
              </p>
            </motion.div>

            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.16, ease }}
              className="max-w-[14ch] text-2xl font-black uppercase leading-[0.96] tracking-tight text-zinc-950 sm:text-3xl md:max-w-[12ch] md:text-4xl lg:text-[2.65rem]"
            >
              {content.title}
            </motion.h2>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.2, ease }}
              className="max-w-[36ch] text-sm font-medium leading-relaxed text-zinc-600 md:max-w-[34ch] md:text-base"
            >
              {content.body}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.24, ease }}
              className="flex flex-col gap-4"
            >
              <p className="text-[0.65rem] font-black tracking-[0.22em] text-zinc-400 uppercase">
                {content.listenLabel}
              </p>

              {/* One prompt at a time — fills vertical space without accordion clutter. */}
              <div className="relative min-h-38 md:min-h-42">
                <AnimatePresence mode="wait">
                  {current ? (
                    <motion.div
                      key={current.label}
                      initial={
                        reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }
                      }
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { opacity: 0, y: -12, filter: 'blur(6px)' }
                      }
                      transition={{ duration: 0.4, ease }}
                      className="absolute inset-x-0 top-0"
                    >
                      <p
                        className={cn(
                          'text-[0.7rem] font-black tracking-[0.2em] uppercase',
                          LANDING_COURT_GREEN_CLASS,
                        )}
                      >
                        {String(activePrompt + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-2 text-2xl font-black uppercase leading-[1.05] tracking-tight text-zinc-950 md:text-[1.65rem] lg:text-[1.85rem]">
                        {current.label}
                      </p>
                      <p className="mt-3 max-w-[32ch] text-sm font-medium leading-relaxed text-zinc-500 md:text-[0.95rem]">
                        {current.detail}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap items-center gap-2" role="tablist">
                {facets.map((facet, index) => {
                  const isOn = index === activePrompt;
                  return (
                    <button
                      key={facet.label}
                      type="button"
                      role="tab"
                      aria-selected={isOn}
                      aria-label={facet.label}
                      onClick={() => setActivePrompt(index)}
                      className={cn(
                        'h-9 min-w-9 px-2.5 font-mono text-[0.7rem] font-semibold tracking-[0.14em] tabular-nums transition-colors duration-300',
                        'border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900',
                        isOn
                          ? 'border-[#0B6E4F] bg-[#0B6E4F] text-white'
                          : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700',
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              {/* Progress bar under the selectors */}
              <div className="h-px w-full overflow-hidden bg-zinc-200">
                <motion.div
                  key={activePrompt}
                  className="h-full origin-left"
                  style={{ backgroundColor: LANDING_COURT_GREEN }}
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: PROMPT_CYCLE_MS / 1000, ease: 'linear' }
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
