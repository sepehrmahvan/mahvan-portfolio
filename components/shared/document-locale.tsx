'use client';

import { useEffect } from 'react';

import { isRtlLocale, type Locale } from '@/types/locale';

/** Keep `<html lang/dir>` in sync for locale segments under the root layout. */
export function DocumentLocale({ locale }: { locale: Locale }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = isRtlLocale(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
