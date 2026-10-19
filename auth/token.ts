import { AUTH_TOKEN_COOKIE } from '@/constants/routes';

const STORAGE_KEY = AUTH_TOKEN_COOKIE;

function canUseDom(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function getToken(): string | null {
  if (!canUseDom()) return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setToken(token: string): void {
  if (!canUseDom()) return;
  localStorage.setItem(STORAGE_KEY, token);
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
}

export function removeToken(): void {
  if (!canUseDom()) return;
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
}

export function getTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_TOKEN_COOKIE}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(AUTH_TOKEN_COOKIE.length + 1)) || null;
}
