'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import type { Locale } from '@/types/locale';

/** Soft redirect without throwing NEXT_REDIRECT (cleaner under static export / Turbopack). */
export function RootRedirect({ locale }: { locale: Locale }) {
  const router = useRouter();
  const href = `/${locale}`;

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <main className="grid min-h-[100dvh] place-items-center p-6">
      <a href={href} className="text-sm font-semibold text-zinc-700 underline-offset-4 hover:underline">
        Mahvan
      </a>
    </main>
  );
}
