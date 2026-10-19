import acceptLanguage from 'accept-language';
import { NextResponse, type NextRequest } from 'next/server';

import { getTokenFromCookieHeader } from '@/auth/token';
import {
  isProtectedPath,
  isPublicPath,
  routes,
} from '@/constants/routes';
import {
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from '@/types/locale';

acceptLanguage.languages([...locales]);

function getLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const header = request.headers.get('Accept-Language');
  const matched = acceptLanguage.get(header);
  if (matched && isLocale(matched)) {
    return matched;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const segments = pathname.split('/');
  const localeSegment = segments[1];
  const locale: Locale = isLocale(localeSegment) ? localeSegment : defaultLocale;

  const token = getTokenFromCookieHeader(request.headers.get('cookie'));

  if (isProtectedPath(pathname) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = routes.login(locale);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isPublicPath(pathname) && token && pathname.includes('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = routes.users(locale);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
