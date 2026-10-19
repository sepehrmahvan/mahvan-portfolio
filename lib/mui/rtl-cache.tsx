'use client';

import createCache, { type EmotionCache } from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

import type { Locale } from '@/types/locale';

/** Creates an Emotion cache for the active locale (RTL uses stylis-plugin-rtl). */
export function createMuiCache(locale: Locale): EmotionCache {
  const isRtl = locale === 'fa';
  return createCache({
    key: isRtl ? 'muirtl' : 'muiltr',
    stylisPlugins: isRtl ? [prefixer, rtlPlugin] : [prefixer],
  });
}
