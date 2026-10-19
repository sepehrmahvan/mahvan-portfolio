'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/Button';
import type { CreateUserInput } from '@/types/user';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  role: z.string().min(1),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

interface UserFormProps {
  onSubmit: (values: CreateUserInput) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function UserForm({ onSubmit, onCancel, isSubmitting }: UserFormProps) {
  const { t } = useTranslation(['users', 'common']);
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'viewer',
      password: '',
    },
  });

  return (
    <form
      className="flex flex-col gap-4 pt-2"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <TextField name="firstName" control={control} label={t('form.firstName')} />
      <TextField name="lastName" control={control} label={t('form.lastName')} />
      <TextField
        name="email"
        control={control}
        label={t('form.email')}
        ltr
        type="email"
      />
      <TextField name="role" control={control} label={t('form.role')} />
      <TextField
        name="password"
        control={control}
        label={t('form.password')}
        type="password"
        ltr
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outlined" onClick={onCancel}>
          {t('common:cancel')}
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {t('common:save')}
        </Button>
      </div>
    </form>
  );
}
