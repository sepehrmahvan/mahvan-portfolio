'use client';

import { motion, type Variants } from 'motion/react';

import { cn } from '@/utils/cn';

import { useLandingScroll } from './LandingScrollContext';
import { LANDING_COURT_GREEN } from './shell';

export type ProductStage = {
  index: string;
  title: string;
  detail: string;
};

interface ProductStepperProps {
  ariaLabel: string;
  eyebrow: string;
  stages: ProductStage[];
  /** When false, hide entrance. */
  active?: boolean;
  className?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

/**
 * Vertical build pipeline — all stages shown complete (green), no step cycling.
 * iPad (md–lg): larger dots + type. Desktop (xl+): previous laptop sizes.
 */
export function ProductStepper({
  ariaLabel,
  eyebrow,
  stages,
  active = true,
  className,
}: ProductStepperProps) {
  const { reduceMotion } = useLandingScroll();

  return (
    <motion.div
      initial={reduceMotion ? false : 'hidden'}
      animate={active ? 'show' : 'hidden'}
      variants={reduceMotion ? undefined : listVariants}
      className={cn(
        'relative flex h-full min-h-0 w-full max-w-[14.5rem] flex-col md:max-w-[17.5rem] lg:max-w-[19rem] xl:max-w-[18.5rem]',
        className,
      )}
    >
      <motion.p
        variants={reduceMotion ? undefined : itemVariants}
        className="mb-2 shrink-0 text-[0.58rem] font-black tracking-[0.2em] text-zinc-400 uppercase sm:mb-2.5 sm:text-[0.62rem] md:mb-3.5 md:text-[0.8rem] lg:mb-4 lg:text-[0.85rem] xl:mb-3.5 xl:text-[0.75rem]"
      >
        {eyebrow}
      </motion.p>

      <ol
        aria-label={ariaLabel}
        className="relative flex min-h-0 flex-1 flex-col justify-between"
      >
        {/* Spine — center tracks circle radius per breakpoint */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-2 bottom-2 start-[0.55rem] w-px bg-[#0B6E4F] sm:start-[0.7rem] md:start-[1.2rem] md:w-0.5 lg:start-[1.25rem] xl:top-2.5 xl:bottom-2.5 xl:start-[1.05rem]"
        />

        {stages.map((stage) => (
          <motion.li
            key={stage.index}
            variants={reduceMotion ? undefined : itemVariants}
            className="relative flex min-h-0 gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-4"
          >
            {/*
              Phone: compact. iPad md/lg: oversized. Desktop xl+: prior laptop sizes.
            */}
            <span className="relative z-10 mt-0.5 flex size-[1.15rem] shrink-0 items-center justify-center sm:size-[1.4rem] md:size-10 lg:size-10 xl:size-8">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border-[1.5px] md:border-2"
                style={{
                  borderColor: LANDING_COURT_GREEN,
                  backgroundColor: LANDING_COURT_GREEN,
                }}
              />
              <span className="relative text-[0.52rem] font-black leading-none text-white sm:text-[0.58rem] md:text-[0.85rem] lg:text-[0.85rem] xl:text-[0.75rem]">
                {stage.index}
              </span>
            </span>

            <div className="min-w-0 flex-1 pt-px md:pt-1 xl:pt-px">
              <p className="text-[0.7rem] font-black uppercase tracking-tight text-[#0B6E4F] sm:text-[0.78rem] md:text-[1.05rem] lg:text-[1.1rem] xl:text-base">
                {stage.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[0.65rem] font-medium leading-snug text-zinc-500 sm:line-clamp-none sm:text-[0.7rem] md:mt-1 md:text-[0.9rem] md:leading-snug lg:text-[0.95rem] xl:mt-1 xl:text-[0.88rem]">
                {stage.detail}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
