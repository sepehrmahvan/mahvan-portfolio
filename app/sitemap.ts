import type { MetadataRoute } from 'next';

import { languageAlternates, siteUrl } from '@/lib/seo/site';
import { locales } from '@/types/locale';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'fa' ? 1 : 0.8,
    alternates: {
      languages: languageAlternates(),
    },
  }));
}
