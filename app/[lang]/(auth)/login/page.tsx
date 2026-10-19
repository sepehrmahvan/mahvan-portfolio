'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { GuestGuard } from '@/auth/guards';
import { TextField } from '@/components/form/TextField';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { routes } from '@/constants/routes';
import { useLocale } from '@/hooks/useDirection';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const locale = useLocale();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <GuestGuard>
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">{t('login')}</h1>
          <LanguageSwitcher />
        </div>
        <p className="text-sm text-slate-500">{t('demoHint')}</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(async (values) => {
            const result = await authService.login(values);
            setSession(result.token, result.user);
            router.replace(routes.users(locale));
          })}
        >
          <TextField
            name="email"
            control={control}
            label={t('email')}
            type="email"
            ltr
          />
          <TextField
            name="password"
            control={control}
            label={t('password')}
            type="password"
            ltr
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={formState.isSubmitting}
          >
            {t('submitLogin')}
          </Button>
        </form>
        <p className="text-sm text-slate-600">
          {t('noAccount')}{' '}
          <Link className="text-teal-700 underline" href={routes.register(locale)}>
            {t('register')}
          </Link>
        </p>
      </main>
    </GuestGuard>
  );
}
