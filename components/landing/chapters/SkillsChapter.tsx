'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
} from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import Folder from '@/components/ui/Folder/Folder';
import { useMinWidth } from '@/hooks/useMinWidth';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { useLandingScroll } from '../LandingScrollContext';
import { LANDING_COURT_GREEN, LANDING_COURT_GREEN_CLASS, LANDING_SHELL } from '../shell';
import { isChapterStep } from '../timeline';

interface SkillsChapterProps {
  content: LandingDictionary['skills'];
  locale: Locale;
}

const ease = [0.16, 1, 0.3, 1] as const;
const PROMPT_CYCLE_MS = 3800;
/** Matches Tailwind `xl` — desktop side rail / mid folder. */
const DESKTOP_RAIL_MIN = 1280;

/**
 * Section 2 — Discover.
 * Mobile/tablet: open kinetic stage (no white panel) matching hero language.
 * Desktop xl+: folder mid + transparent copy rail over the video.
 */
export function SkillsChapter({ content, locale }: SkillsChapterProps) {
  const { time, skillsRevealReady, reduceMotion } = useLandingScroll();
  const desktopRail = useMinWidth(DESKTOP_RAIL_MIN);
  const [onSkillsStep, setOnSkillsStep] = useState(() =>
    isChapterStep(time.get(), 'skills'),
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
      className="pointer-events-none absolute inset-0 z-30 overflow-x-hidden overflow-y-hidden xl:overflow-hidden"
    >
      {/* Mid stage Folder — desktop only */}
      <AnimatePresence mode="sync">
        {active && desktopRail ? (
          <motion.div
            key="skills-folder"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.65, ease, delay: reduceMotion ? 0 : 0.06 }}
            className="pointer-events-auto absolute top-1/2 left-[42%] -translate-x-1/2 -translate-y-1/2 2xl:left-[44%]"
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
              size={1.05}
              frost={0.2}
              tilt={0.45}
              speed={1}
              bounce={0.4}
              peek={!reduceMotion}
              intro={!reduceMotion}
              draggable
              zoomOnClick
              theme="light"
              className="origin-center scale-[1.15] 2xl:scale-[1.28]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Copy stage */}
      <AnimatePresence mode="sync">
        {active ? (
          <motion.div
            key="skills-stage"
            initial={reduceMotion ? false : { opacity: 0, y: desktopRail ? 0 : 28, x: desktopRail ? 36 : 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: desktopRail ? 0 : 16, x: desktopRail ? 24 : 0 }}
            transition={{ duration: 0.55, ease, delay: reduceMotion ? 0 : 0.1 }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={locale}
            className={cn(
              'pointer-events-auto absolute z-10 flex max-w-none flex-col',
              // Mobile/tablet: copy scrolls above a reserved folder foot (avoids crop).
              'inset-x-0 top-0 bottom-0 min-h-0',
              LANDING_SHELL,
              'pt-20 pb-3',
              // Desktop: side rail over video.
              'xl:inset-y-0 xl:left-auto xl:right-5 xl:inset-x-auto xl:w-[min(44vw,32rem)] xl:justify-center xl:gap-5 xl:overflow-visible xl:px-0 xl:py-16 2xl:right-10 2xl:w-[min(38vw,36rem)]',
              isRtl
                ? 'font-(family-name:--font-fa)'
                : 'font-(family-name:--font-en)',
            )}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain sm:gap-4 xl:flex-none xl:gap-5 xl:overflow-visible">
              {/* Eyebrow + rule — mobile kinetic language */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.12, ease }}
                className="flex items-center gap-3 xl:hidden"
              >
                <span aria-hidden className="h-px w-8 shrink-0 bg-[#0B6E4F]" />
                <p
                  className={cn(
                    'text-[0.68rem] tracking-[0.28em] text-emerald-200/80 uppercase',
                    isRtl ? 'font-normal' : 'font-black',
                  )}
                >
                  {content.eyebrow}
                </p>
              </motion.div>

              <motion.h2
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.16, ease }}
                className={cn(
                  'max-w-[16ch] text-[clamp(1.65rem,7.5vw,2.35rem)] leading-[0.95] tracking-[-0.02em] text-white xl:max-w-[22ch] xl:text-4xl xl:uppercase xl:tracking-tight xl:text-zinc-950 2xl:max-w-[24ch] 2xl:text-[2.65rem]',
                  isRtl ? 'font-normal' : 'font-black',
                )}
              >
                {content.title}
              </motion.h2>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.18, ease }}
                className="relative h-8 w-full max-w-[14rem] xl:hidden"
                aria-hidden
              >
                <span className="absolute top-1/2 start-0 h-[2px] w-full origin-start bg-[#0B6E4F] shadow-[0_0_18px_rgb(11_110_79_/_0.55)]" />
                <span className="absolute top-1/2 start-0 size-2 -translate-y-1/2 rounded-full bg-emerald-300" />
              </motion.div>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.2, ease }}
                className="max-w-[36ch] text-sm font-medium leading-relaxed text-white/55 sm:text-[0.95rem] xl:max-w-[48ch] xl:text-base xl:text-zinc-600"
              >
                {content.body}
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.24, ease }}
                className="flex flex-col gap-4"
              >
                <p className="text-[0.65rem] font-black tracking-[0.22em] text-white/40 uppercase xl:text-zinc-400">
                  {content.listenLabel}
                </p>

                <div className="relative min-h-24 sm:min-h-28 md:min-h-30 xl:min-h-32">
                  <AnimatePresence mode="wait">
                    {current ? (
                      <motion.div
                        key={current.label}
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, y: 18, filter: 'blur(8px)' }
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
                            'text-[0.65rem] font-black tracking-[0.2em] uppercase sm:text-[0.7rem]',
                            desktopRail
                              ? LANDING_COURT_GREEN_CLASS
                              : 'text-emerald-300',
                          )}
                        >
                          {String(activePrompt + 1).padStart(2, '0')}
                        </p>
                        <p className="mt-1.5 text-xl font-black uppercase leading-[1.05] tracking-tight text-white sm:mt-2 sm:text-2xl md:text-[1.65rem] xl:text-[1.85rem] xl:text-zinc-950">
                          {current.label}
                        </p>
                        <p className="mt-2 max-w-[40ch] text-sm font-medium leading-relaxed text-white/50 sm:mt-3 sm:text-[0.95rem] xl:max-w-[48ch] xl:text-zinc-500">
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
                          'border focus-visible:outline-2 focus-visible:outline-offset-4',
                          isOn
                            ? 'border-[#0B6E4F] bg-[#0B6E4F] text-white focus-visible:outline-emerald-200 xl:focus-visible:outline-zinc-900'
                            : 'border-white/20 text-white/45 hover:border-emerald-400/50 hover:text-emerald-100 focus-visible:outline-white xl:border-zinc-200 xl:text-zinc-400 xl:hover:border-zinc-400 xl:hover:text-zinc-700 xl:focus-visible:outline-zinc-900',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>

                <div className="h-px w-full overflow-hidden bg-white/15 xl:bg-zinc-200">
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
            </div>

            {/*
              Phone + tablet folder: light paper/ink (readable titles), green shell.
              Reserved foot + overflow-visible so flap/peek is not cropped.
            */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.28, ease }}
              className="relative z-20 mt-3 flex h-[13.5rem] w-full shrink-0 items-end justify-center overflow-visible pb-2 sm:h-[14.5rem] xl:hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_bottom,rgb(11_110_79_/_0.35)_0%,transparent_70%)]"
              />
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
                size={0.82}
                frost={0.2}
                tilt={0.4}
                speed={1}
                bounce={0.4}
                peek={!reduceMotion}
                intro={!reduceMotion}
                draggable
                zoomOnClick
                theme="light"
                className="relative z-1"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
