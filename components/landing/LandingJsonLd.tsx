import { siteUrl } from '@/lib/seo/site';
import type { LandingDictionary } from '@/types/landing';
import type { Locale } from '@/types/locale';

interface LandingJsonLdProps {
  content: LandingDictionary;
  locale: Locale;
}

/** Person + WebSite + ProfessionalService graph for the portfolio home. */
export function LandingJsonLd({ content, locale }: LandingJsonLdProps) {
  const pageUrl = `${siteUrl}/${locale}`;
  const sameAs = content.contact.socials.map((social) => social.url);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: content.nav.name,
        inLanguage: locale,
        description: content.meta.description,
        publisher: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        name: content.meta.title,
        description: content.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Sepehr Mahvan',
        alternateName: ['سپهر مهوان', 'Mahvan'],
        url: pageUrl,
        jobTitle: content.hero.role,
        description: content.meta.description,
        email: content.contact.email,
        telephone: content.contact.phoneHref,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tehran',
          addressCountry: 'IR',
        },
        knowsAbout: [
          'TypeScript',
          'React',
          'Next.js',
          'Node.js',
          'PostgreSQL',
          'Full-stack product engineering',
          'Web platforms',
        ],
        sameAs,
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#service`,
        name: content.meta.title,
        description: content.meta.description,
        url: pageUrl,
        provider: { '@id': `${siteUrl}/#person` },
        areaServed: ['IR', 'Worldwide'],
        serviceType: [
          'Full-stack web development',
          'Product engineering',
          'Platform design',
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
