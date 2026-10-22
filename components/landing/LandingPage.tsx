'use client';

import { MotionConfig } from 'motion/react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useLandingSnap } from '@/hooks/useLandingSnap';
import type { LandingDictionary } from '@/types/landing';
import type { Locale } from '@/types/locale';

import { ContactChapter } from './chapters/ContactChapter';
import { ExperienceChapter } from './chapters/ExperienceChapter';
import { HeroChapter } from './chapters/HeroChapter';
import { ProjectsChapter } from './chapters/ProjectsChapter';
import { SkillsChapter } from './chapters/SkillsChapter';
import { SoftSkillsChapter } from './chapters/SoftSkillsChapter';
import {
  HeroVideoBackground,
  type HeroVideoHandle,
} from './HeroVideoBackground';
import { LandingNav } from './LandingNav';
import { LandingScrollContext, type LandingScrollContextValue } from './LandingScrollContext';

interface LandingPageProps {
  content: LandingDictionary;
  locale: Locale;
}

export function LandingPage({ content, locale }: LandingPageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const softSkillsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HeroVideoHandle>(null);
  const reduceMotion = false;
  const [heroRevealReady, setHeroRevealReady] = useState(false);
  const [skillsRevealReady, setSkillsRevealReady] = useState(false);

  const onIntroHold = useCallback(() => {
    setHeroRevealReady(true);
  }, []);

  const onScrollDone = useCallback(() => {
    setSkillsRevealReady(true);
  }, []);

  const sections = useMemo(
    () => ({
      hero: heroRef,
      skills: skillsRef,
      softSkills: softSkillsRef,
      experience: experienceRef,
      projects: projectsRef,
      contact: contactRef,
    }),
    [],
  );

  const onLeaveHero = useCallback(() => {
    // Hide hero copy so the landing enter animation can replay on return.
    setHeroRevealReady(false);
    videoRef.current?.playScrollOut();
  }, []);

  const onEnterHero = useCallback(() => {
    // Start reverse first — unmounting skills in the same turn janks the first frames.
    videoRef.current?.resetToHold();
    requestAnimationFrame(() => {
      setSkillsRevealReady(false);
    });
  }, []);

  const { time, progress, scrollToChapter, scrollToContact } = useLandingSnap(
    sections,
    reduceMotion,
    { onLeaveHero, onEnterHero },
  );

  const value = useMemo<LandingScrollContextValue>(
    () => ({
      time,
      progress,
      reduceMotion,
      heroRevealReady,
      skillsRevealReady,
      scrollToChapter,
      scrollToContact,
    }),
    [
      time,
      progress,
      reduceMotion,
      heroRevealReady,
      skillsRevealReady,
      scrollToChapter,
      scrollToContact,
    ],
  );

  return (
    <MotionConfig reducedMotion="never">
      <LandingScrollContext.Provider value={value}>
        <LandingNav content={content.nav} locale={locale} />

        <main className="relative overscroll-none bg-white">
          {/*
            Sticky pin: video holds in the viewport while skills slides up over it.
            Parent only wraps hero + skills so later chapters unpin cleanly.
          */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none sticky top-0 z-0 h-[100dvh] overflow-hidden"
            >
              <HeroVideoBackground
                ref={videoRef}
                reduceMotion={reduceMotion}
                onIntroHold={onIntroHold}
                onScrollDone={onScrollDone}
              />
            </div>

            <section
              id="hero"
              ref={heroRef}
              className="relative z-10 -mt-[100dvh] min-h-[100dvh] overflow-hidden bg-transparent"
            >
              <HeroChapter
                content={content.hero}
                contactLabel={content.nav.contact}
                portraitSrc={content.contact.portrait}
                locale={locale}
              />
            </section>

            <section
              id="skills"
              ref={skillsRef}
              className="relative z-20 min-h-[100dvh] overflow-hidden bg-transparent"
            >
              <SkillsChapter content={content.skills} locale={locale} />
            </section>
          </div>

          <section
            id="soft-skills"
            ref={softSkillsRef}
            className="relative min-h-[100dvh] overflow-hidden bg-[#03140f] lg:bg-white"
          >
            <SoftSkillsChapter content={content.softSkills} locale={locale} />
          </section>

          <section
            id="experience"
            ref={experienceRef}
            className="relative min-h-[100dvh] overflow-hidden bg-[#05080a] lg:bg-zinc-100"
          >
            <ExperienceChapter content={content.experience} locale={locale} />
          </section>

          <ProjectsChapter
            ref={projectsRef}
            content={content.projects}
            locale={locale}
          />

          <ContactChapter
            ref={contactRef}
            content={content.contact}
            locale={locale}
          />
        </main>
      </LandingScrollContext.Provider>
    </MotionConfig>
  );
}
