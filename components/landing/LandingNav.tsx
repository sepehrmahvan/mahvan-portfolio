'use client';

import { ListIcon, XIcon } from '@phosphor-icons/react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  type Variants,
} from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import type { LandingDictionary } from '@/types/landing';
import type { Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { LandingLanguageMenu } from './LandingLanguageMenu';
import { useLandingScroll } from './LandingScrollContext';
import { LANDING_SHELL } from './shell';
import {
  SNAP_CONTACT_INDEX,
  SNAP_PROJECTS_INDEX,
  SNAP_STEP_COUNT,
  chapterAt,
  chapterOrder,
  type ChapterId,
} from './timeline';

interface LandingNavProps {
  content: LandingDictionary['nav'];
  locale: Locale;
}

const ease = [0.16, 1, 0.3, 1] as const;

const shell: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, when: 'beforeChildren', staggerChildren: 0.06 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

function sectionIsActive(active: ChapterId | null, id: ChapterId) {
  if (!active) return false;
  if (active === id) return true;
  if (id === 'skills' && active === 'about') return true;
  return false;
}

export function LandingNav({ content, locale }: LandingNavProps) {
  const { time, progress, scrollToChapter, scrollToContact, reduceMotion } = useLandingScroll();
  const [active, setActive] = useState<ChapterId | null>('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  const chapterCount = chapterOrder.length;

  const syncActiveFromProgress = (value: number) => {
    const projectsMark = SNAP_PROJECTS_INDEX / (SNAP_STEP_COUNT - 1);
    const contactMark = SNAP_CONTACT_INDEX / (SNAP_STEP_COUNT - 1);
    if (value >= contactMark - 0.02) {
      setActive((previous) => (previous === 'contact' ? previous : 'contact'));
      return;
    }
    if (value >= projectsMark - 0.02) {
      setActive((previous) => (previous === 'projects' ? previous : 'projects'));
      return;
    }
    const current = chapterAt(time.get()) ?? 'hero';
    setActive((previous) => (previous === current ? previous : current));
  };

  useMotionValueEvent(time, 'change', () => {
    syncActiveFromProgress(progress.get());
  });

  useMotionValueEvent(progress, 'change', (value) => {
    syncActiveFromProgress(value);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (id: ChapterId) => {
    setMenuOpen(false);
    scrollToChapter(id);
  };

  /** Section 3 (Build): light page → dark ink, fully transparent header (no veil/blur). */
  const onLight = active === 'soft-skills';
  /** Sections 1–2 + 4+: dark top shadow veil (same as hero/skills). */
  const showDarkVeil = !onLight;

  return (
    <>
      {/* Measured story rail */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div
          role="progressbar"
          aria-label={content.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative h-1 w-full bg-white/25"
        >
          <motion.div
            style={{ scaleX: progress }}
            className="absolute inset-y-0 start-0 origin-left w-full bg-white rtl:origin-right"
          />
        </div>
      </div>

      <motion.header
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={reduceMotion ? undefined : shell}
        className="pointer-events-none fixed inset-x-0 top-0 z-40"
      >
        {/* Transparent on Build; dark gradient veil elsewhere (incl. experience). */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 transition-colors duration-300',
            showDarkVeil
              ? 'h-28 bg-linear-to-b from-zinc-950/55 via-zinc-950/20 to-transparent'
              : 'h-16 bg-transparent lg:h-[4.25rem]',
          )}
        />
        <div className="pointer-events-auto relative border-b border-transparent bg-transparent">
          <nav
            aria-label={content.name}
            className={cn(
              LANDING_SHELL,
              'grid h-16 grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 lg:h-[4.25rem]',
            )}
          >
            {/* Brand */}
            <motion.div variants={reduceMotion ? undefined : item} className="min-w-0">
              <button
                type="button"
                onClick={() => go('hero')}
                className={cn(
                  'group flex max-w-full items-center gap-3 text-start focus-visible:outline-2 focus-visible:outline-offset-4',
                  onLight
                    ? 'focus-visible:outline-zinc-950'
                    : 'focus-visible:outline-white',
                )}
              >
                <span
                  className={cn(
                    'relative h-9 w-[3.8rem] shrink-0 transition-opacity group-hover:opacity-90 md:h-10 md:w-[4.25rem]',
                    onLight && 'brightness-0',
                  )}
                >
                  <Image
                    src="/images/mahvan-logo.png"
                    alt=""
                    width={1630}
                    height={965}
                    priority
                    className="size-full object-contain object-center"
                  />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block truncate text-sm font-semibold tracking-tight md:text-[15px]',
                      onLight
                        ? 'text-zinc-950'
                        : 'text-white [text-shadow:0_1px_14px_rgb(0_0_0/0.55)]',
                    )}
                  >
                    {content.name}
                  </span>
                  <span
                    dir="ltr"
                    className={cn(
                      'mt-0.5 hidden font-mono text-[10px] tracking-[0.18em] uppercase sm:block',
                      onLight
                        ? 'text-zinc-600'
                        : 'text-white/90 [text-shadow:0_1px_10px_rgb(0_0_0/0.5)]',
                    )}
                  >
                    {content.role}
                    {content.stack ? ` · ${content.stack}` : null}
                  </span>
                </span>
              </button>
            </motion.div>

            {/* Desktop sections */}
            <motion.ul
              variants={reduceMotion ? undefined : item}
              className="hidden items-center gap-1 md:flex"
            >
              {content.sections.map((section) => {
                const id = section.id as ChapterId;
                const isActive = sectionIsActive(active, id);
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => go(id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'group relative flex items-baseline gap-2 px-3 py-2 text-[13px] font-medium tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-4',
                        onLight
                          ? 'text-zinc-600 hover:text-zinc-950 focus-visible:outline-zinc-950 aria-[current=true]:text-zinc-950'
                          : 'text-white/90 [text-shadow:0_1px_12px_rgb(0_0_0/0.5)] hover:text-white focus-visible:outline-white aria-[current=true]:text-white',
                      )}
                    >
                      <span
                        dir="ltr"
                        className={cn(
                          'font-mono text-[10px] tracking-[0.16em]',
                          onLight
                            ? 'text-zinc-400 group-hover:text-zinc-700 group-aria-[current=true]:text-zinc-700'
                            : 'text-white/75 group-hover:text-white group-aria-[current=true]:text-white',
                        )}
                      >
                        {section.index}
                      </span>
                      <span>{section.label}</span>
                      {isActive ? (
                        <motion.span
                          layoutId="landing-nav-underline"
                          className={cn(
                            'absolute inset-x-3 -bottom-px h-px',
                            onLight ? 'bg-zinc-950' : 'bg-white',
                          )}
                          transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </motion.ul>

            {/* Actions */}
            <motion.div
              variants={reduceMotion ? undefined : item}
              className="flex items-center justify-end gap-2 md:gap-3"
            >
              <p
                className={cn(
                  'me-1 hidden items-center gap-2 text-[11px] lg:flex',
                  onLight
                    ? 'text-zinc-600'
                    : 'text-white/90 [text-shadow:0_1px_10px_rgb(0_0_0/0.45)]',
                )}
              >
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70 opacity-60" />
                  <span className="relative size-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="tracking-wide">{content.availability}</span>
              </p>

              <LandingLanguageMenu locale={locale} label={content.language} />

              <button
                type="button"
                onClick={scrollToContact}
                className={cn(
                  'hidden h-9 items-center px-3 text-[12px] font-semibold tracking-tight transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 sm:inline-flex sm:px-4',
                  onLight
                    ? 'border border-zinc-950 bg-zinc-950 text-white focus-visible:outline-zinc-950'
                    : 'border border-white bg-white text-zinc-950 focus-visible:outline-white',
                )}
              >
                {content.contact}
              </button>

              <button
                type="button"
                className={cn(
                  'grid size-9 place-items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 md:hidden',
                  onLight
                    ? 'border border-zinc-300 text-zinc-950 hover:border-zinc-950 focus-visible:outline-zinc-950'
                    : 'border border-white/25 text-white hover:border-white hover:bg-white hover:text-zinc-950 focus-visible:outline-white',
                )}
                aria-expanded={menuOpen}
                aria-controls="landing-mobile-nav"
                aria-label={menuOpen ? content.menuClose : content.menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? <XIcon size={18} weight="bold" /> : <ListIcon size={18} weight="bold" />}
              </button>
            </motion.div>
          </nav>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              id="landing-mobile-nav"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="pointer-events-auto border-b border-white/10 bg-zinc-950/90 py-4 backdrop-blur-xl md:hidden reduced-transparency:bg-zinc-950"
            >
              <div className={LANDING_SHELL}>
              <ul className="grid gap-1">
                <li>
                  <button
                    type="button"
                    onClick={() => go('hero')}
                    className="flex w-full items-baseline justify-between gap-4 px-2 py-3 text-start text-white"
                  >
                    <span className="text-base font-semibold">{content.name}</span>
                    <span dir="ltr" className="font-mono text-[10px] tracking-[0.16em] text-white/70">
                      01
                    </span>
                  </button>
                </li>
                {content.sections.map((section) => {
                  const id = section.id as ChapterId;
                  const isActive = sectionIsActive(active, id);
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => go(id)}
                        aria-current={isActive ? 'true' : undefined}
                        className="flex w-full items-baseline justify-between gap-4 px-2 py-3 text-start text-white/90 aria-[current=true]:text-white"
                      >
                        <span className="text-base font-medium">{section.label}</span>
                        <span
                          dir="ltr"
                          className="font-mono text-[10px] tracking-[0.16em] text-white/70"
                        >
                          {section.index}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="flex items-center gap-2 text-xs text-white/90">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {content.availability}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToContact();
                  }}
                  className="h-10 border border-white bg-white px-4 text-xs font-semibold text-zinc-950"
                >
                  {content.contact}
                </button>
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-white/30" dir="ltr">
                {chapterCount} chapters · narrative scroll
              </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
