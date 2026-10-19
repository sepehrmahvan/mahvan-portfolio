import { getToken } from '@/auth/token';
import type { AuthUser } from '@/types/user';

export function hasSession(): boolean {
  return Boolean(getToken());
}

export function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('mahvan_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function writeStoredUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem('mahvan_user');
    return;
  }
  localStorage.setItem('mahvan_user', JSON.stringify(user));
}
