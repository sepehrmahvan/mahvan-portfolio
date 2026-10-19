import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getToken, removeToken } from '@/auth/token';
import { env } from '@/constants/env';
import type { ApiError } from '@/types/api';
import { defaultLocale, type Locale } from '@/types/locale';

let currentLocale: Locale = defaultLocale;

export function setAxiosLocale(locale: Locale): void {
  currentLocale = locale;
}

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Accept-Language'] = currentLocale;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const normalized: ApiError = {
      message:
        error.response?.data?.message ??
        error.message ??
        'An unexpected error occurred',
      status: error.response?.status ?? 0,
      code: error.response?.data?.code,
    };

    if (normalized.status === 401 && typeof window !== 'undefined') {
      removeToken();
    }

    return Promise.reject(normalized);
  },
);
