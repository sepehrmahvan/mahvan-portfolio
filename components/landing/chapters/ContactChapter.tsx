'use client';

import {
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  PhoneIcon,
  TelegramLogoIcon,
  WhatsappLogoIcon,
} from '@phosphor-icons/react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import DitherVeil from '@/components/ui/DitherVeil/DitherVeil';
import Velaris from '@/components/ui/velaris';
import type { LandingDictionary } from '@/types/landing';
import { isRtlLocale, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

import { LANDING_COURT_GREEN, LANDING_INSET_END } from '../shell';

/** Court-green Velaris palette for the contact stage. */
const VELARIS_COLORS = ['#86efac', '#34d399', LANDING_COURT_GREEN, '#022c22'];

interface ContactChapterProps {
  content: LandingDictionary['contact'];
  locale: Locale;
}

const SOCIAL_ICONS = {
  linkedin: LinkedinLogoIcon,
  github: GithubLogoIcon,
  telegram: TelegramLogoIcon,
  whatsapp: WhatsappLogoIcon,
} as const;

const ease = [0.16, 1, 0.3, 1] as const;

const columnVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease },
  },
};

const titleReveal: Variants = {
  hidden: { opacity: 0, y: 32, rotateX: 24, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 16,
      mass: 0.8,
      filter: { duration: 0.5, ease },
    },
  },
};

const rowReveal: Variants = {
  hidden: { opacity: 0, x: -16, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease },
  },
};

const socialList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const socialPop: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

/** Section 6: Velaris stage; contact copy pinned left, portrait right. */
export const ContactChapter = forwardRef<HTMLElement, ContactChapterProps>(
  function ContactChapter({ content, locale }, ref) {
    const reduceMotion = useReducedMotion() ?? false;
    const isRtl = isRtlLocale(locale);
    const localRef = useRef<HTMLElement | null>(null);
    // Defer WebGL (Velaris + DitherVeil) until near the section.
    const [stageReady, setStageReady] = useState(false);

    useEffect(() => {
      const node = localRef.current;
      if (!node) return undefined;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setStageReady(true);
        },
        { rootMargin: '25% 0px', threshold: 0.01 },
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    const setRefs = (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <section
        ref={setRefs}
        id="contact"
        aria-label={content.ariaLabel}
        className="relative isolate min-h-[100dvh] w-full overflow-hidden bg-[#020807]"
      >
        {stageReady ? (
        <Velaris
          height="100dvh"
          className="min-h-[100dvh] bg-transparent"
          bg="#020807"
          colors={VELARIS_COLORS}
          speed={reduceMotion ? 0 : 1.4}
          grain={0.22}
        >
          <div className="relative min-h-[100dvh] w-full">
            {/* Contact details — physical left rail. */}
            <motion.div
              dir={isRtl ? 'rtl' : 'ltr'}
              lang={locale}
              className={cn(
                'pointer-events-auto absolute inset-x-3 top-16 bottom-4 z-20 flex max-w-none flex-col justify-start gap-6 overflow-y-auto py-4 text-white sm:justify-center sm:gap-8 sm:py-10 md:inset-y-0 md:left-3 md:right-auto md:inset-x-auto md:w-[min(48vw,36rem)] md:justify-center md:gap-10 md:overflow-visible md:py-28 lg:left-6 xl:left-12',
                '[&_a]:text-white [&_h2]:text-white [&_p]:text-white [&_span]:text-white [&_svg]:fill-white [&_svg]:text-white',
                isRtl
                  ? 'font-(family-name:--font-fa)'
                  : 'font-(family-name:--font-en)',
              )}
              style={{ perspective: 900, color: '#ffffff' }}
              initial={reduceMotion ? false : 'hidden'}
              animate="show"
              variants={reduceMotion ? undefined : columnVariants}
            >
              <header>
                <motion.p
                  variants={reduceMotion ? undefined : fadeUp}
                  className="text-[0.7rem] font-black tracking-[0.22em] text-white uppercase md:text-xs"
                  style={{ color: '#ffffff' }}
                >
                  {content.eyebrow}
                </motion.p>
                <motion.h2
                  variants={reduceMotion ? undefined : titleReveal}
                  className="mt-3 max-w-[14ch] text-2xl font-black uppercase leading-tight tracking-tight text-white whitespace-normal sm:max-w-none sm:text-3xl sm:whitespace-nowrap md:text-4xl lg:text-[2.75rem]"
                  style={{ color: '#ffffff' }}
                >
                  {content.title}
                </motion.h2>
                <motion.p
                  variants={reduceMotion ? undefined : fadeUp}
                  className="mt-4 max-w-[36ch] text-sm font-medium leading-relaxed text-white sm:text-base md:text-lg"
                  style={{ color: '#ffffff' }}
                >
                  {content.body}
                </motion.p>
              </header>

              <motion.ul
                variants={reduceMotion ? undefined : socialList}
                className="flex flex-col gap-4"
              >
                <motion.li variants={reduceMotion ? undefined : rowReveal}>
                  <a
                    href={`mailto:${content.email}`}
                    className="group inline-flex items-center gap-3 text-white transition-opacity hover:opacity-80"
                    style={{ color: '#ffffff' }}
                  >
                    <EnvelopeSimpleIcon
                      size={22}
                      weight="bold"
                      color="#ffffff"
                      className="shrink-0"
                    />
                    <span
                      className="text-base font-semibold tracking-tight text-white md:text-lg"
                      style={{ color: '#ffffff' }}
                    >
                      {content.email}
                    </span>
                  </a>
                </motion.li>
                <motion.li variants={reduceMotion ? undefined : rowReveal}>
                  <a
                    href={`tel:${content.phoneHref}`}
                    className="group inline-flex items-center gap-3 text-white transition-opacity hover:opacity-80"
                    style={{ color: '#ffffff' }}
                    dir="ltr"
                  >
                    <PhoneIcon
                      size={22}
                      weight="bold"
                      color="#ffffff"
                      className="shrink-0"
                    />
                    <span
                      className="text-base font-semibold tracking-tight text-white md:text-lg"
                      style={{ color: '#ffffff' }}
                    >
                      {content.phone}
                    </span>
                  </a>
                </motion.li>
                <motion.li variants={reduceMotion ? undefined : rowReveal}>
                  <div
                    className="inline-flex items-center gap-3 text-white"
                    style={{ color: '#ffffff' }}
                  >
                    <MapPinIcon
                      size={22}
                      weight="bold"
                      color="#ffffff"
                      className="shrink-0"
                    />
                    <span
                      className="text-base font-medium tracking-tight text-white md:text-lg"
                      style={{ color: '#ffffff' }}
                    >
                      {content.location}
                    </span>
                  </div>
                </motion.li>
              </motion.ul>

              <div>
                <motion.p
                  variants={reduceMotion ? undefined : fadeUp}
                  className="mb-3 text-[0.68rem] font-black tracking-[0.18em] text-white uppercase"
                  style={{ color: '#ffffff' }}
                >
                  {content.socialLabel}
                </motion.p>
                <motion.ul
                  variants={reduceMotion ? undefined : socialList}
                  className="flex flex-wrap items-center gap-3"
                >
                  {content.socials.map((social) => {
                    const Icon =
                      SOCIAL_ICONS[social.id as keyof typeof SOCIAL_ICONS] ??
                      LinkedinLogoIcon;
                    return (
                      <motion.li
                        key={social.id}
                        variants={reduceMotion ? undefined : socialPop}
                      >
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="inline-flex size-11 items-center justify-center border border-white/40 bg-white/10 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                          style={{ color: '#ffffff' }}
                        >
                          <Icon size={20} weight="bold" color="currentColor" />
                        </a>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            </motion.div>

            {/* Portrait — physical right rail, transparent backdrop over Velaris. */}
            <div
              className={cn(
                'pointer-events-auto absolute inset-y-[12%] z-10 hidden w-[min(46vw,28rem)] md:block',
                LANDING_INSET_END,
              )}
            >
              <DitherVeil
                src={content.portrait}
                pattern="floyd"
                pixelSize={3}
                inkColor="#000000"
                paperColor="#f2f2f2"
                revealRadius={220}
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
            </div>
          </div>
        </Velaris>
        ) : (
          <div className="min-h-[100dvh] w-full bg-[#020807]" aria-hidden />
        )}
      </section>
    );
  },
);
