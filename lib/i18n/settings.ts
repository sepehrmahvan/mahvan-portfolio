import type { Locale } from '@/types/locale';
import { defaultLocale, locales } from '@/types/locale';

export const i18nLocales = locales;
export const i18nDefaultLocale = defaultLocale;

export const namespaces = ['common', 'auth', 'users', 'landing'] as const;

export type Namespace = (typeof namespaces)[number];

export const defaultNS: Namespace = 'common';

export function getOptions(locale: Locale = i18nDefaultLocale, ns: Namespace | Namespace[] = defaultNS) {
  return {
    supportedLngs: [...i18nLocales],
    fallbackLng: i18nDefaultLocale,
    lng: locale,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
  };
}
