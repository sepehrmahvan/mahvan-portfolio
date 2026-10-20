import { defaultLocale, locales, type Locale } from '@/types/locale';

/** Cloudflare Pages free domain — override with NEXT_PUBLIC_SITE_URL if needed. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://mahvan.pages.dev'
);

export function localePath(locale: Locale, path = ''): string {
  const clean = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${siteUrl}/${locale}${clean}`;
}

export function languageAlternates(path = ''): Record<string, string> {
  const clean = path.startsWith('/') ? path : path ? `/${path}` : '';
  const map: Record<string, string> = {};
  for (const locale of locales) {
    map[locale] = `${siteUrl}/${locale}${clean}`;
  }
  map['x-default'] = `${siteUrl}/${defaultLocale}${clean}`;
  return map;
}
