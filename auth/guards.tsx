'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { hasSession } from '@/auth/session';
import { routes } from '@/constants/routes';
import { isLocale, type Locale } from '@/types/locale';

interface GuardProps {
  children: ReactNode;
}

function useLang(): Locale {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang;
  if (lang && isLocale(lang)) return lang;
  return 'fa';
}

export function AuthGuard({ children }: GuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lang = useLang();

  useEffect(() => {
    if (!hasSession()) {
      router.replace(`${routes.login(lang)}?next=${encodeURIComponent(pathname)}`);
    }
  }, [lang, pathname, router]);

  if (!hasSession()) {
    return null;
  }

  return children;
}

export function GuestGuard({ children }: GuardProps) {
  const router = useRouter();
  const lang = useLang();

  useEffect(() => {
    if (hasSession()) {
      router.replace(routes.users(lang));
    }
  }, [lang, router]);

  if (hasSession()) {
    return null;
  }

  return children;
}
