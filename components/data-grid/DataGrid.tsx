'use client';

import {
  DataGrid as MuiDataGrid,
  type DataGridProps,
} from '@mui/x-data-grid';
import { arSD, deDE, enUS, faIR, jaJP, ruRU, zhCN } from '@mui/x-data-grid/locales';

import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { useLocale } from '@/hooks/useDirection';

interface AppDataGridProps extends DataGridProps {
  emptyTitle?: string;
}

function gridLocaleText(locale: ReturnType<typeof useLocale>) {
  if (locale === 'fa') return faIR.components.MuiDataGrid.defaultProps.localeText;
  if (locale === 'ar') return arSD.components.MuiDataGrid.defaultProps.localeText;
  if (locale === 'ru') return ruRU.components.MuiDataGrid.defaultProps.localeText;
  if (locale === 'zh') return zhCN.components.MuiDataGrid.defaultProps.localeText;
  if (locale === 'ja') return jaJP.components.MuiDataGrid.defaultProps.localeText;
  if (locale === 'de') return deDE.components.MuiDataGrid.defaultProps.localeText;
  return enUS.components.MuiDataGrid.defaultProps.localeText;
}

export function DataGrid({
  emptyTitle,
  loading,
  rows,
  ...props
}: AppDataGridProps) {
  const locale = useLocale();
  const localeText = gridLocaleText(locale);

  if (loading) {
    return <Loading />;
  }

  if (!loading && (!rows || rows.length === 0)) {
    return <EmptyState title={emptyTitle ?? '—'} />;
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
      <MuiDataGrid
        {...props}
        rows={rows}
        autoHeight
        disableRowSelectionOnClick
        localeText={localeText}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
          ...props.initialState,
        }}
      />
    </div>
  );
}
