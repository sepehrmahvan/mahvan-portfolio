'use client';

import { create } from 'zustand';

import { removeToken, setToken } from '@/auth/token';
import { readStoredUser, writeStoredUser } from '@/auth/session';
import type { AuthUser } from '@/types/user';

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  hydrate: () => void;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  hydrate: () => {
    set({ user: readStoredUser(), hydrated: true });
  },
  setSession: (token, user) => {
    setToken(token);
    writeStoredUser(user);
    set({ user });
  },
  clearSession: () => {
    removeToken();
    writeStoredUser(null);
    set({ user: null });
  },
}));
