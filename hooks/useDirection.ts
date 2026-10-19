'use client';

import { useParams } from 'next/navigation';

import { isLocale, isRtlLocale, type Locale } from '@/types/locale';

export type Direction = 'rtl' | 'ltr';

export function useDirection(): Direction {
  const locale = useLocale();
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang;
  if (lang && isLocale(lang)) return lang;
  return 'fa';
}
