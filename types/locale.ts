export const locales = ['fa', 'en', 'ar', 'ru', 'zh', 'ja', 'de'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fa';

/** Locales that lay out right-to-left. Add new RTL languages here. */
export const rtlLocales = ['fa', 'ar'] as const satisfies readonly Locale[];

/** Native endonym for each locale — extend when adding a language. */
export const localeLabels: Record<Locale, string> = {
  fa: 'فارسی',
  en: 'English',
  ar: 'العربية',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  de: 'Deutsch',
};

/** Short code shown in compact UI (header trigger, etc.). */
export const localeCodes: Record<Locale, string> = {
  fa: 'FA',
  en: 'EN',
  ar: 'AR',
  ru: 'RU',
  zh: 'ZH',
  ja: 'JA',
  de: 'DE',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtlLocale(locale: Locale): boolean {
  return (rtlLocales as readonly Locale[]).includes(locale);
}
