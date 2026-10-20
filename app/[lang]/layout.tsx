import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { kalameh, satoshi } from '@/lib/fonts';
import { AppProviders } from '@/providers/AppProviders';
import { isLocale, isRtlLocale, locales, type Locale } from '@/types/locale';

import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Sepehr Mahvan | Full-Stack Product Engineer',
    template: '%s',
  },
  description:
    'Full-stack product engineer building web platforms with TypeScript, Next.js, and React.',
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Allow blocking while locale-aware providers settle under Cache Components. */
export const instant = false;

export default async function LangLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const direction = isRtlLocale(locale) ? 'rtl' : 'ltr';
  const fontFamily = isRtlLocale(locale)
    ? 'font-[family-name:var(--font-fa)]'
    : 'font-[family-name:var(--font-en)]';

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${kalameh.variable} ${satoshi.variable} ${fontFamily} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-950">
        <AppProviders locale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
}
