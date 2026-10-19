function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Mahvan',
  isDev: process.env.NODE_ENV === 'development',
} as const;

export function getServerEnv() {
  return {
    ...env,
    apiSecret: process.env.API_SECRET
      ? required('API_SECRET', process.env.API_SECRET)
      : undefined,
  };
}
