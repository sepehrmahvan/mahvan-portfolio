'use client';

import { type GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataGrid } from '@/components/data-grid/DataGrid';
import { UserForm } from '@/components/users/UserForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageContainer } from '@/components/layout/PageContainer';
import { useCreateUser } from '@/hooks/queries/useCreateUser';
import { useUsers } from '@/hooks/queries/useUsers';
import { useLocale } from '@/hooks/useDirection';
import { formatDate } from '@/utils/format';
import type { User } from '@/types/user';

export function UsersTable() {
  const { t } = useTranslation(['users', 'common']);
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useUsers({ page: 1, pageSize: 25 });
  const createUser = useCreateUser();

  const columns = useMemo<GridColDef<User>[]>(
    () => [
      {
        field: 'name',
        headerName: t('columns.name'),
        flex: 1,
        minWidth: 160,
        valueGetter: (_value, row) => `${row.firstName} ${row.lastName}`,
      },
      {
        field: 'email',
        headerName: t('columns.email'),
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'role',
        headerName: t('columns.role'),
        width: 120,
      },
      {
        field: 'createdAt',
        headerName: t('columns.createdAt'),
        width: 160,
        valueFormatter: (value: string) => formatDate(value, locale),
      },
    ],
    [locale, t],
  );

  return (
    <PageContainer
      title={t('title')}
      description={t('subtitle')}
      actions={
        <Button variant="contained" onClick={() => setOpen(true)}>
          {t('add')}
        </Button>
      }
    >
      <DataGrid
        rows={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.id}
        emptyTitle={t('table.empty')}
      />

      <Modal
        open={open}
        title={t('add')}
        onClose={() => setOpen(false)}
      >
        <UserForm
          isSubmitting={createUser.isPending}
          onCancel={() => setOpen(false)}
          onSubmit={async (values) => {
            await createUser.mutateAsync(values);
            setOpen(false);
          }}
        />
      </Modal>
    </PageContainer>
  );
}
