import Link from 'next/link';
import { notFound } from 'next/navigation';

import { routes } from '@/constants/routes';
import { getTranslation } from '@/lib/i18n/server';
import { isLocale, type Locale } from '@/types/locale';

export default async function RegisterPage({
  params,
}: PageProps<'/[lang]/register'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const { t } = await getTranslation(locale, 'auth');

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">{t('register')}</h1>
      <p className="text-sm text-slate-500">{t('hasAccount')}</p>
      <Link href={routes.login(locale)} className="text-teal-700 underline">
        {t('login')}
      </Link>
    </main>
  );
}
