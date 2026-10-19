import { isLocale, type Locale } from '@/types/locale';

export const AUTH_TOKEN_COOKIE = 'mahvan_token';

export const routes = {
  home: (lang: Locale) => `/${lang}`,
  login: (lang: Locale) => `/${lang}/login`,
  register: (lang: Locale) => `/${lang}/register`,
  forgotPassword: (lang: Locale) => `/${lang}/forgot-password`,
  users: (lang: Locale) => `/${lang}/users`,
} as const;

export const publicPaths = ['/login', '/register', '/forgot-password'] as const;

export const protectedPathPrefixes = ['/users'] as const;

export function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && isLocale(segments[1])) {
    return `/${segments.slice(2).join('/')}`.replace(/\/$/, '') || '/';
  }
  return pathname;
}

export function isPublicPath(pathname: string): boolean {
  const path = stripLocale(pathname);
  return path === '/' || publicPaths.some((p) => path === p || path.startsWith(`${p}/`));
}

export function isProtectedPath(pathname: string): boolean {
  const path = stripLocale(pathname);
  return protectedPathPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
