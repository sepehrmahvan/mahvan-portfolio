'use client';

import { I18nextProvider } from 'react-i18next';
import { type ReactNode, useEffect } from 'react';

import { i18next } from '@/lib/i18n/client';
import { setAxiosLocale } from '@/lib/axios';
import type { Locale } from '@/types/locale';

interface I18nProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  useEffect(() => {
    void i18next.changeLanguage(locale);
    setAxiosLocale(locale);
  }, [locale]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
