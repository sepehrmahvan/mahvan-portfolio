import { notFound } from 'next/navigation';

import { DocumentLocale } from '@/components/shared/document-locale';
import { AppProviders } from '@/providers/AppProviders';
import { isLocale, isRtlLocale, locales, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;

  return (
    <div
      className={cn(
        'min-h-full',
        isRtlLocale(locale)
          ? 'font-[family-name:var(--font-fa)]'
          : 'font-[family-name:var(--font-en)]',
      )}
    >
      <AppProviders locale={locale}>
        <DocumentLocale locale={locale} />
        {children}
      </AppProviders>
    </div>
  );
}
