"use client";

import Box from "@mui/material/Box";
import MuiPagination from "@mui/material/Pagination";
import type { SxProps, Theme } from "@mui/material/styles";
import { paginationSx } from "./control-styles";

export type PaginationProps = {
  /** Current page (1-indexed). */
  page: number;
  /** Total number of pages. */
  count: number;
  /** Called with the new page number (1-indexed). */
  onChange: (page: number) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  siblingCount?: number;
  boundaryCount?: number;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  /** Hide the control when there is only one page. @default true */
  hideWhenSingle?: boolean;
  align?: "center" | "start" | "end";
  className?: string;
  sx?: SxProps<Theme>;
  "aria-label"?: string;
};

const alignMap = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
} as const;

export function Pagination({
  page,
  count,
  onChange,
  disabled = false,
  size = "medium",
  siblingCount = 1,
  boundaryCount = 1,
  showFirstButton = false,
  showLastButton = false,
  hideWhenSingle = true,
  align = "center",
  className,
  sx,
  "aria-label": ariaLabel,
}: PaginationProps) {
  const safeCount = Math.max(1, count);
  const safePage = Math.min(Math.max(page, 1), safeCount);

  if (hideWhenSingle && safeCount <= 1) {
    return null;
  }

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        justifyContent: alignMap[align],
        width: "100%",
      }}
    >
      <MuiPagination
        page={safePage}
        count={safeCount}
        disabled={disabled}
        size={size}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        color="primary"
        shape="rounded"
        variant="outlined"
        aria-label={ariaLabel}
        onChange={(_event, nextPage) => onChange(nextPage)}
        sx={[paginationSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      />
    </Box>
  );
}
