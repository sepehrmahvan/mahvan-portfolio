'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { type ReactNode, useMemo } from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

import { createAppTheme } from '@/lib/mui/theme';
import { isRtlLocale, type Locale } from '@/types/locale';

interface ThemeProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function ThemeProvider({ locale, children }: ThemeProviderProps) {
  const direction = isRtlLocale(locale) ? 'rtl' : 'ltr';
  const theme = useMemo(
    () => createAppTheme(locale, direction),
    [locale, direction],
  );

  return (
    <AppRouterCacheProvider
      key={locale}
      options={{
        enableCssLayer: true,
        key: direction === 'rtl' ? 'muirtl' : 'muiltr',
        stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : [prefixer],
      }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
