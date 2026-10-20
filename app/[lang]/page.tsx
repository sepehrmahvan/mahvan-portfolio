import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LandingJsonLd } from '@/components/landing/LandingJsonLd';
import { LandingPage } from '@/components/landing/LandingPage';
import { getLandingDictionary } from '@/lib/i18n/server';
import { languageAlternates, localePath, siteUrl } from '@/lib/seo/site';
import { isLocale } from '@/types/locale';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const { meta } = getLandingDictionary(lang);
  const pageUrl = localePath(lang);
  const keywords = meta.keywords
    ? meta.keywords.split(/[،,]/).map((part) => part.trim()).filter(Boolean)
    : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    keywords,
    alternates: {
      canonical: pageUrl,
      languages: languageAlternates(),
    },
    openGraph: {
      type: 'website',
      locale: lang,
      url: pageUrl,
      siteName: 'Sepehr Mahvan',
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getLandingDictionary(lang);

  return (
    <>
      <LandingJsonLd content={content} locale={lang} />
      <LandingPage content={content} locale={lang} />
    </>
  );
}
