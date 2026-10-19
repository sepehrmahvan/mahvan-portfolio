'use client';

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect } from 'react';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from 'react-i18next';

import { getOptions, namespaces, type Namespace } from '@/lib/i18n/settings';
import type { Locale } from '@/types/locale';

const runsOnServerSide = typeof window === 'undefined';

void i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? [...getOptions().supportedLngs] : [],
  });

export function useTranslation(locale: Locale, ns?: Namespace | Namespace[]) {
  const translator = useTranslationOrg(ns ?? namespaces);
  const { i18n } = translator;

  useEffect(() => {
    if (i18n.resolvedLanguage !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return translator;
}

export { i18next };
