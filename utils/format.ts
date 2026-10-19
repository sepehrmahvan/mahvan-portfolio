import type { Locale } from '@/types/locale';

function intlLocale(locale: Locale): string {
  if (locale === 'fa') return 'fa-IR-u-ca-persian';
  if (locale === 'ar') return 'ar-EG';
  if (locale === 'ru') return 'ru-RU';
  if (locale === 'zh') return 'zh-CN';
  if (locale === 'ja') return 'ja-JP';
  if (locale === 'de') return 'de-DE';
  return 'en-US';
}

function numberLocale(locale: Locale): string {
  if (locale === 'fa') return 'fa-IR';
  if (locale === 'ar') return 'ar-EG';
  if (locale === 'ru') return 'ru-RU';
  if (locale === 'zh') return 'zh-CN';
  if (locale === 'ja') return 'ja-JP';
  if (locale === 'de') return 'de-DE';
  return 'en-US';
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(numberLocale(locale), options).format(value);
}

export function formatDate(
  value: string | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
}

export function formatDateTime(
  value: string | Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return formatDate(value, locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}
