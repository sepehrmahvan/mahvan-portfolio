"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { useTheme, type SxProps, type Theme } from "@mui/material/styles";
import {
  DataGrid as MuiDataGrid,
  type DataGridProps as MuiDataGridProps,
  type GridColDef,
  type GridPaginationModel,
  type GridRowId,
  type GridRowIdGetter,
  type GridRowSelectionModel,
  type GridSortModel,
  type GridValidRowModel,
} from "@mui/x-data-grid";
import { enUS, faIR } from "@mui/x-data-grid/locales";
import { useLocaleStore } from "@/store/locale";
import { formatLocalizedNumber } from "@/utils/localized-number";

export type {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
  GridRowSelectionModel,
  GridRowId,
} from "@mui/x-data-grid";

export type DataGridProps<R extends GridValidRowModel = GridValidRowModel> = {
  rows: readonly R[];
  columns: readonly GridColDef<R>[];
  /** Total row count from the API (required for server-side pagination). */
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel?: GridSortModel;
  onSortModelChange?: (model: GridSortModel) => void;
  loading?: boolean;
  pageSizeOptions?: number[];
  getRowId?: GridRowIdGetter<R>;
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  rowSelectionModel?: GridRowSelectionModel;
  onRowSelectionModelChange?: MuiDataGridProps["onRowSelectionModelChange"];
  keepNonExistentRowsSelected?: boolean;
  /** Fixed height of the grid container. Ignored when `autoHeight` is true. @default 520 */
  height?: number | string;
  autoHeight?: boolean;
  /** Fixed row height in pixels. */
  rowHeight?: number;
  className?: string;
  sx?: SxProps<Theme>;
  localeText?: MuiDataGridProps["localeText"];
  /** Extra DataGrid props (server modes / filters / skeleton stay controlled). */
  slotProps?: MuiDataGridProps["slotProps"];
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

function getDataGridSx(isRtl: boolean): SxProps<Theme> {
  return {
    height: "100%",
    width: "100%",
    border: "1px solid",
    borderColor: "rgba(0, 43, 71, 0.08)",
    borderRadius: 4,
    overflow: "hidden",
    fontFamily: "inherit",
    backgroundColor: "common.white",
    direction: isRtl ? "rtl" : "ltr",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#F1F5F9",
      color: "text.primary",
      borderBottom: "1px solid rgba(0, 43, 71, 0.08)",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#F1F5F9",
      color: "text.primary",
      "&:focus, &:focus-within": {
        outline: "none",
      },
    },
    "& .MuiDataGrid-columnHeaderTitleContainer": {
      justifyContent: "center",
    },
    "& .MuiDataGrid-columnHeaderTitleContainerContent": {
      justifyContent: "center",
      minWidth: 0,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600,
      textAlign: "center",
      width: "auto",
      flexShrink: 1,
      minWidth: 0,
    },
    "& .MuiDataGrid-cell": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    "& .MuiDataGrid-iconButtonContainer": {
      visibility: "visible",
      width: "auto",
    },
    "& .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortButton":
      {
        opacity: 1,
      },
    "& .MuiDataGrid-iconButtonContainer .MuiIconButton-root, & .MuiDataGrid-menuIconButton, & .MuiDataGrid-columnHeader .MuiIconButton-root":
      {
        color: "text.secondary",
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "transparent",
          color: "primary.main",
        },
        "&.Mui-focusVisible, &:focus": {
          backgroundColor: "transparent",
        },
      },
    "& .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root, & .MuiDataGrid-sortIcon":
      {
        color: "inherit",
        opacity: 1,
      },
    "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-iconButtonContainer .MuiIconButton-root, & .MuiDataGrid-columnHeader--sorted .MuiDataGrid-iconButtonContainer .MuiIconButton-root":
      {
        backgroundColor: "transparent",
      },
    "& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortButton, & .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon":
      {
        color: "primary.main",
        opacity: 1,
      },
    "& .MuiDataGrid-menuIcon, & .MuiDataGrid-menuIconButton": {
      display: "none",
    },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-columnHeaders .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller--header":
      {
        backgroundColor: "#F1F5F9",
      },
    "& .MuiDataGrid-main, & .MuiDataGrid-virtualScroller, & .MuiDataGrid-overlayWrapper":
      {
        backgroundColor: "common.white",
      },
    "& .MuiDataGrid-overlay": {
      backgroundColor: "common.white",
      color: "text.secondary",
    },
    "& .MuiDataGrid-cellSkeleton": {
      justifyContent: "center",
      "& .MuiSkeleton-root": {
        transformOrigin: "center",
      },
    },
    "& .DataGrid-row--even": {
      backgroundColor: "rgba(0, 43, 71, 0.04)",
    },
    "& .DataGrid-row--odd": {
      backgroundColor: "common.white",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "rgba(0, 43, 71, 0.08)",
    },
    "& .MuiDataGrid-row:focus, & .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within":
      {
        outline: "none",
      },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid rgba(0, 43, 71, 0.1)",
      backgroundColor: "#F8FAFC",
      minHeight: 56,
      color: "text.secondary",
    },
    "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-selectIcon, & .MuiTablePagination-actions":
      {
        color: "text.secondary",
      },
    "& .MuiTablePagination-actions .MuiIconButton-root": {
      color: "text.secondary",
      "&:hover": {
        backgroundColor: "rgba(0, 43, 71, 0.08)",
        color: "text.primary",
      },
      "&.Mui-disabled": {
        color: "rgba(0, 43, 71, 0.3)",
      },
    },
    "& .MuiTablePagination-displayedRows": {
      display: "none",
    },
  };
}

export function DataGrid<R extends GridValidRowModel = GridValidRowModel>({
  rows,
  columns,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  loading = false,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  getRowId,
  checkboxSelection = false,
  disableRowSelectionOnClick = true,
  rowSelectionModel,
  onRowSelectionModelChange,
  keepNonExistentRowsSelected = false,
  height = 520,
  autoHeight = false,
  rowHeight,
  className,
  sx,
  localeText,
  slotProps,
}: DataGridProps<R>) {
  const theme = useTheme();
  const locale = useLocaleStore((state: any) => state.locale);
  // MUI resets the page to 0 when rowCount drops to 0, which happens while the next page is loading.
  const isLoadingWithoutCount = loading && rowCount === 0;
  const [stableRowCount, setStableRowCount] = useState(rowCount);
  if (!isLoadingWithoutCount && rowCount !== stableRowCount) {
    setStableRowCount(rowCount);
  }
  const effectiveRowCount = isLoadingWithoutCount ? stableRowCount : rowCount;
  const isRtl = theme.direction === "rtl";
  const gridLocale = isRtl ? faIR : enUS;
  const resolvedColumns = columns.map((column) => ({
    ...column,
    align: "center" as const,
    headerAlign: "center" as const,
  }));
  const resolvedPageSizeOptions = pageSizeOptions.map((size) => ({
    value: size,
    label: formatLocalizedNumber(size, locale),
  }));

  return (
    <Box
      className={className}
      sx={{
        width: "100%",
        ...(autoHeight ? {} : { height }),
      }}
    >
      <MuiDataGrid
        rows={rows}
        columns={resolvedColumns}
        getRowId={getRowId}
        loading={loading}
        rowCount={effectiveRowCount}
        pagination
        paginationMode="server"
        sortingMode={onSortModelChange ? "server" : "client"}
        // Unsorted icon looks like ascending; start with desc so the first click visibly flips the arrow.
        sortingOrder={["desc", "asc"]}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        pageSizeOptions={resolvedPageSizeOptions}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        keepNonExistentRowsSelected={keepNonExistentRowsSelected}
        disableColumnFilter
        disableColumnMenu
        disableColumnResize
        showColumnVerticalBorder={false}
        autoHeight={autoHeight}
        rowHeight={rowHeight}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "DataGrid-row--even"
            : "DataGrid-row--odd"
        }
        localeText={{
          ...gridLocale.components.MuiDataGrid.defaultProps.localeText,
          ...localeText,
        }}
        slotProps={{
          ...slotProps,
          loadingOverlay: {
            ...slotProps?.loadingOverlay,
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        sx={[
          getDataGridSx(isRtl),
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      />
    </Box>
  );
}
