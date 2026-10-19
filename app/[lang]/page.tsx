import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LandingPage } from '@/components/landing/LandingPage';
import { getLandingDictionary } from '@/lib/i18n/server';
import { isLocale } from '@/types/locale';

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getLandingDictionary(lang);
  return { title: meta.title, description: meta.description };
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <LandingPage content={getLandingDictionary(lang)} locale={lang} />;
}
