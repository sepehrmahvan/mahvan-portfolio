/**
 * Header rail matching HeroChapter's absolute side offsets.
 * Absolute `left/right-*` is relative to the padding edge (padding does not add),
 * so nav gutters must equal only: left/right-3 | md:6 | lg:8 | xl:12
 * on the same max-w-[1800px] rail as the hero wrapper.
 */
export const LANDING_SHELL =
  'mx-auto w-full max-w-[1800px] px-3 md:px-6 lg:px-8 xl:px-12';

/** Absolute side inset matching `LANDING_SHELL` gutters. */
export const LANDING_INSET_START = 'left-3 md:left-6 lg:left-8 xl:left-12';
export const LANDING_INSET_END = 'right-3 md:right-6 lg:right-8 xl:right-12';

/** Imperial court green — extrabold display ink across landing chapters. */
export const LANDING_COURT_GREEN = '#0B6E4F';
export const LANDING_COURT_GREEN_CLASS = 'text-[#0B6E4F]';
