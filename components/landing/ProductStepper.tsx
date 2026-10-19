'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

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
  /** When false, pause auto-advance and freeze entrance. */
  active?: boolean;
  className?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;
const STEP_MS = 2200;

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.18 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease },
  },
};

/**
 * Vertical product-build stepper for the Build chapter center rail.
 * Cascades in, then quietly cycles the active stage while mounted.
 */
export function ProductStepper({
  ariaLabel,
  eyebrow,
  stages,
  active = true,
  className,
}: ProductStepperProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active || reduceMotion || stages.length < 2) return undefined;
    const id = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % stages.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [active, reduceMotion, stages.length]);

  useEffect(() => {
    if (!active) setCurrent(0);
  }, [active]);

  const progress = stages.length <= 1 ? 1 : current / (stages.length - 1);

  return (
    <motion.ol
      aria-label={ariaLabel}
      initial={reduceMotion ? false : 'hidden'}
      animate={active ? 'show' : 'hidden'}
      variants={reduceMotion ? undefined : listVariants}
      className={cn(
        'relative flex w-full max-w-[18rem] flex-col gap-0 py-2',
        className,
      )}
    >
      <motion.p
        variants={reduceMotion ? undefined : itemVariants}
        className="mb-6 text-[0.72rem] font-black tracking-[0.22em] text-zinc-400 uppercase md:text-[0.78rem]"
      >
        {eyebrow}
      </motion.p>

      {/* Spine */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[3.25rem] bottom-3 start-[0.9rem] w-[2px] overflow-hidden bg-zinc-200"
      >
        <motion.span
          className="absolute inset-x-0 top-0 origin-top bg-[#0B6E4F]"
          style={{ height: '100%' }}
          initial={false}
          animate={{
            scaleY: reduceMotion ? 1 : Math.max(0.08, progress),
          }}
          transition={{ duration: 0.65, ease }}
        />
      </div>

      {stages.map((stage, index) => {
        const isActive = index === current;
        const isDone = index < current;

        return (
          <motion.li
            key={stage.index}
            variants={reduceMotion ? undefined : itemVariants}
            className="relative flex gap-4 pb-7 last:pb-0 md:gap-5 md:pb-8"
          >
            <span className="relative z-10 mt-0.5 flex size-[1.85rem] shrink-0 items-center justify-center">
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: isActive || isDone ? LANDING_COURT_GREEN : '#d4d4d8',
                  backgroundColor:
                    isActive || isDone ? LANDING_COURT_GREEN : '#ffffff',
                }}
                animate={
                  reduceMotion || !isActive
                    ? { scale: 1 }
                    : { scale: [1, 1.12, 1] }
                }
                transition={
                  isActive && !reduceMotion
                    ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.35, ease }
                }
              />
              {isActive && !reduceMotion ? (
                <motion.span
                  aria-hidden
                  className="absolute inset-[-6px] rounded-full border border-[#0B6E4F]/35"
                  initial={{ opacity: 0.7, scale: 0.85 }}
                  animate={{ opacity: 0, scale: 1.55 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
              ) : null}
              <span
                className={cn(
                  'relative text-[0.68rem] font-black leading-none',
                  isActive || isDone ? 'text-white' : 'text-zinc-400',
                )}
              >
                {stage.index}
              </span>
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <motion.p
                className={cn(
                  'text-[0.95rem] font-black uppercase tracking-tight transition-colors duration-300 md:text-[1.05rem]',
                  isActive ? 'text-[#0B6E4F]' : isDone ? 'text-zinc-700' : 'text-zinc-400',
                )}
                animate={
                  reduceMotion
                    ? undefined
                    : { x: isActive ? 2 : 0, opacity: isActive || isDone ? 1 : 0.72 }
                }
                transition={{ duration: 0.35, ease }}
              >
                {stage.title}
              </motion.p>
              <motion.p
                className="mt-1.5 text-[0.82rem] font-medium leading-snug text-zinc-500 md:text-[0.88rem]"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: isActive ? 1 : 0.45,
                        y: isActive ? 0 : 2,
                      }
                }
                transition={{ duration: 0.35, ease }}
              >
                {stage.detail}
              </motion.p>
            </div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
