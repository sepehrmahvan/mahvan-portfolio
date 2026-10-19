import {
  defaultNS,
  type Namespace,
} from '@/lib/i18n/settings';
import type { LandingDictionary } from '@/types/landing';
import type { Locale } from '@/types/locale';

import arAuth from '@/locales/ar/auth.json';
import arCommon from '@/locales/ar/common.json';
import arLanding from '@/locales/ar/landing.json';
import arUsers from '@/locales/ar/users.json';
import enAuth from '@/locales/en/auth.json';
import enCommon from '@/locales/en/common.json';
import enLanding from '@/locales/en/landing.json';
import enUsers from '@/locales/en/users.json';
import faAuth from '@/locales/fa/auth.json';
import faCommon from '@/locales/fa/common.json';
import faLanding from '@/locales/fa/landing.json';
import faUsers from '@/locales/fa/users.json';
import ruAuth from '@/locales/ru/auth.json';
import ruCommon from '@/locales/ru/common.json';
import ruLanding from '@/locales/ru/landing.json';
import ruUsers from '@/locales/ru/users.json';
import deAuth from '@/locales/de/auth.json';
import deCommon from '@/locales/de/common.json';
import deLanding from '@/locales/de/landing.json';
import deUsers from '@/locales/de/users.json';
import jaAuth from '@/locales/ja/auth.json';
import jaCommon from '@/locales/ja/common.json';
import jaLanding from '@/locales/ja/landing.json';
import jaUsers from '@/locales/ja/users.json';
import zhAuth from '@/locales/zh/auth.json';
import zhCommon from '@/locales/zh/common.json';
import zhLanding from '@/locales/zh/landing.json';
import zhUsers from '@/locales/zh/users.json';

type DictValue = string | Dict | readonly DictValue[];
type Dict = { readonly [key: string]: DictValue };

const resources: Record<Locale, Record<Namespace, Dict>> = {
  fa: {
    common: faCommon,
    auth: faAuth,
    users: faUsers,
    landing: faLanding as unknown as Dict,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    users: enUsers,
    landing: enLanding as unknown as Dict,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    users: arUsers,
    landing: arLanding as unknown as Dict,
  },
  ru: {
    common: ruCommon,
    auth: ruAuth,
    users: ruUsers,
    landing: ruLanding as unknown as Dict,
  },
  zh: {
    common: zhCommon,
    auth: zhAuth,
    users: zhUsers,
    landing: zhLanding as unknown as Dict,
  },
  ja: {
    common: jaCommon,
    auth: jaAuth,
    users: jaUsers,
    landing: jaLanding as unknown as Dict,
  },
  de: {
    common: deCommon,
    auth: deAuth,
    users: deUsers,
    landing: deLanding as unknown as Dict,
  },
};

const landingDictionaries: Record<Locale, LandingDictionary> = {
  fa: faLanding,
  en: enLanding,
  ar: arLanding,
  ru: ruLanding,
  zh: zhLanding,
  ja: jaLanding,
  de: deLanding,
};

function readKey(dict: Dict, key: string): string | undefined {
  const parts = key.split('.');
  let current: DictValue | undefined = dict;

  for (const part of parts) {
    if (!current || typeof current === 'string' || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Dict)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

/** Full landing content (including lists) for passing to client components. */
export function getLandingDictionary(locale: Locale): LandingDictionary {
  return landingDictionaries[locale];
}

export type TranslateFn = (
  key: string,
  options?: { defaultValue?: string },
) => string;

/**
 * Server-side translations from statically imported JSON.
 * Avoids dynamic `import()` so Cache Components can prerender/navigate instantly.
 */
export async function getTranslation(
  locale: Locale,
  ns: Namespace | Namespace[] = defaultNS,
) {
  const namespaces = Array.isArray(ns) ? ns : [ns];
  const primary = namespaces[0] ?? defaultNS;

  const t: TranslateFn = (key, options) => {
    if (key.includes(':')) {
      const [nsName, rest] = key.split(':', 2);
      const dict = resources[locale][nsName as Namespace];
      if (dict && rest) {
        return readKey(dict, rest) ?? options?.defaultValue ?? key;
      }
    }

    for (const namespace of namespaces) {
      const value = readKey(resources[locale][namespace], key);
      if (value !== undefined) return value;
    }

    return (
      readKey(resources[locale][primary], key) ??
      options?.defaultValue ??
      key
    );
  };

  return {
    t,
    i18n: { language: locale },
  };
}
