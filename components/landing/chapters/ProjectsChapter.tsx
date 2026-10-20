'use client';

import { ArrowUpRightIcon } from '@phosphor-icons/react';
import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
} from 'motion/react';
import Image from 'next/image';
import { forwardRef, useEffect, useRef, useState } from 'react';

import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { useLandingScroll } from '../LandingScrollContext';
import { LANDING_SHELL } from '../shell';

interface ProjectsChapterProps {
  content: LandingDictionary['projects'];
  locale: Locale;
}

const ease = [0.16, 1, 0.3, 1] as const;

const shellVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease },
  },
};

/** Post-video work: editorial feature stage + selectable project rail. */
export const ProjectsChapter = forwardRef<HTMLElement, ProjectsChapterProps>(
  function ProjectsChapter({ content, locale }, ref) {
    const { reduceMotion } = useLandingScroll();
    const isRtl = isRtlLocale(locale);
    const stageRef = useRef<HTMLDivElement>(null);
    const inView = useInView(stageRef, { amount: 0.35 });
    const activeMotion = reduceMotion || inView;

    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const project = content.items[active] ?? content.items[0];

    useEffect(() => {
      if (reduceMotion || paused || !inView || content.items.length < 2) return;
      const id = window.setInterval(() => {
        setActive((prev) => (prev + 1) % content.items.length);
      }, 4200);
      return () => window.clearInterval(id);
    }, [content.items.length, inView, paused, reduceMotion]);

    const openProject = (index: number) => {
      const target = content.items[index];
      if (!target?.url) return;
      window.open(target.url, '_blank', 'noopener,noreferrer');
    };

    return (
      <section
        ref={ref}
        id="projects"
        aria-label={content.ariaLabel}
        className="relative isolate min-h-[100dvh] w-full bg-black"
      >
        <div
          ref={stageRef}
          dir={isRtl ? 'rtl' : 'ltr'}
          lang={locale}
          className={cn(
            LANDING_SHELL,
            // min-h fills short viewports; grows with content so the section can scroll.
            'relative z-10 grid min-h-[100dvh] grid-cols-1 items-stretch gap-5 py-16 sm:gap-6 sm:py-16 md:grid-cols-1 md:gap-8 md:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:gap-12 lg:py-24 xl:gap-14',
            isRtl
              ? 'font-(family-name:--font-fa)'
              : 'font-(family-name:--font-en)',
          )}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <motion.div
            className="flex flex-col justify-center gap-6 sm:gap-8 md:gap-10"
            initial={false}
            animate={activeMotion ? 'show' : 'hidden'}
            variants={reduceMotion ? undefined : shellVariants}
          >
            <header className="flex flex-col gap-3 sm:gap-4">
              <motion.div
                variants={reduceMotion ? undefined : fadeUp}
                className="flex items-center gap-3"
              >
                <span aria-hidden className="h-px w-8 bg-white md:w-10" />
                <p className="text-[0.68rem] font-black tracking-[0.26em] text-white uppercase md:text-[0.72rem]">
                  {content.eyebrow}
                </p>
              </motion.div>

              <motion.h2
                variants={reduceMotion ? undefined : fadeUp}
                className="max-w-[14ch] text-2xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-3xl md:max-w-[16ch] md:text-4xl lg:max-w-[12ch] lg:text-5xl xl:text-[3.25rem]"
              >
                {content.title}
              </motion.h2>

              <motion.p
                variants={reduceMotion ? undefined : fadeUp}
                className="max-w-[40ch] text-sm font-medium leading-relaxed text-white/80 sm:text-base md:max-w-[48ch] md:text-lg"
              >
                {content.body}
              </motion.p>
            </header>

            <motion.ul
              variants={reduceMotion ? undefined : fadeUp}
              className="flex flex-col border-t border-white/15"
              role="listbox"
              aria-label={content.ariaLabel}
            >
              {content.items.map((item, index) => {
                const selected = index === active;
                return (
                  <li key={item.title} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onDoubleClick={() => openProject(index)}
                      className={cn(
                        'group flex w-full items-baseline justify-between gap-4 border-b border-white/15 py-3.5 text-start transition-colors',
                        selected ? 'text-white' : 'text-white/45 hover:text-white/80',
                      )}
                    >
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span
                          dir="ltr"
                          className="font-mono text-[0.65rem] font-bold tracking-[0.16em] tabular-nums"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate text-sm font-semibold tracking-tight md:text-base">
                          {item.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          'hidden shrink-0 text-[0.68rem] font-medium tracking-tight md:inline',
                          selected ? 'text-white/70' : 'text-white/30',
                        )}
                      >
                        {item.subtitle}
                      </span>
                    </button>
                  </li>
                );
              })}
            </motion.ul>

            <motion.p
              variants={reduceMotion ? undefined : fadeUp}
              className="text-[0.68rem] font-black tracking-[0.18em] text-white/50 uppercase"
            >
              {content.openHint}
            </motion.p>
          </motion.div>

          <motion.div
            variants={reduceMotion ? undefined : fadeUp}
            initial={false}
            animate={activeMotion ? 'show' : 'hidden'}
            className="relative order-first flex flex-col justify-center gap-4 sm:gap-5 md:gap-6 lg:order-none"
          >
            {/* 16:9 preview — description lives in the band below */}
            <button
              type="button"
              onClick={() => openProject(active)}
              className="group relative aspect-video w-full overflow-hidden border border-white/15 bg-zinc-950 text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              aria-label={`${project.title}. ${content.openHint}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.title}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, scale: 1.04, filter: 'blur(8px)' }
                  }
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={
                    reduceMotion
                      ? undefined
                      : { opacity: 0, scale: 0.98, filter: 'blur(6px)' }
                  }
                  transition={{ duration: 0.55, ease }}
                  className="absolute inset-0"
                >
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>

              <span className="absolute end-3 top-3 grid size-10 place-items-center border border-white/40 bg-black/35 text-white backdrop-blur-sm transition-colors group-hover:border-white group-hover:bg-white group-hover:text-black md:end-4 md:top-4 md:size-11">
                <ArrowUpRightIcon size={20} weight="bold" />
              </span>
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${project.title}-copy`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease }}
                className="flex min-h-[7.5rem] flex-col gap-2 border-t border-white/15 pt-4 sm:min-h-[8.5rem] md:min-h-[9rem] md:pt-5"
              >
                <p className="text-[0.65rem] font-black tracking-[0.2em] text-white/55 uppercase">
                  {project.subtitle}
                </p>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-black tracking-tight text-white md:text-2xl">
                    {project.title}
                  </h3>
                </div>
                <p className="max-w-[48ch] text-sm font-medium leading-relaxed text-white/70 md:text-[0.95rem]">
                  {project.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    );
  },
);
