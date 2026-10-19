'use client';

import { type ReactNode, useEffect } from 'react';

import { useAuthStore } from '@/store/auth.store';
import type { Locale } from '@/types/locale';

import { I18nProvider } from './I18nProvider';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  locale: Locale;
  children: ReactNode;
}

function AuthHydrator({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return children;
}

export function AppProviders({ locale, children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <I18nProvider locale={locale}>
        <ThemeProvider locale={locale}>
          <AuthHydrator>{children}</AuthHydrator>
        </ThemeProvider>
      </I18nProvider>
    </QueryProvider>
  );
}
