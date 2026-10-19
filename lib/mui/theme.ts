'use client';

import { createTheme, type Direction, type Theme } from '@mui/material/styles';
import { arEG, deDE, enUS, faIR, jaJP, ruRU, zhCN } from '@mui/material/locale';

import { isRtlLocale, type Locale } from '@/types/locale';

function muiLocaleFor(locale: Locale) {
  if (locale === 'fa') return faIR;
  if (locale === 'ar') return arEG;
  if (locale === 'ru') return ruRU;
  if (locale === 'zh') return zhCN;
  if (locale === 'ja') return jaJP;
  if (locale === 'de') return deDE;
  return enUS;
}

export function createAppTheme(locale: Locale, direction: Direction): Theme {
  const muiLocale = muiLocaleFor(locale);

  return createTheme(
    {
      direction,
      cssVariables: true,
      typography: {
        fontFamily: isRtlLocale(locale)
          ? 'var(--font-fa), Tahoma, sans-serif'
          : 'var(--font-en), system-ui, sans-serif',
      },
      shape: {
        borderRadius: 8,
      },
      palette: {
        mode: 'light',
        primary: {
          main: '#0f766e',
        },
        secondary: {
          main: '#334155',
        },
        background: {
          default: '#f8fafc',
          paper: '#ffffff',
        },
      },
    },
    muiLocale,
  );
}
