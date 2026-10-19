"use client";

import MuiRating from "@mui/material/Rating";
import type { SxProps, Theme } from "@mui/material/styles";
import { starRatingSx } from "./control-styles";

export type StarRatingProps = {
  /** Rating value between 0 and `max`. */
  value: number;
  /** Maximum number of stars. @default 5 */
  max?: number;
  /** Minimum increment for fractional ratings. @default 1 */
  precision?: number;
  /** Visual size of the stars. @default "medium" */
  size?: "small" | "medium" | "large";
  className?: string;
  sx?: SxProps<Theme>;
  "aria-label"?: string;
};

export function StarRating({
  value,
  max = 5,
  precision = 1,
  size = "medium",
  className,
  sx,
  "aria-label": ariaLabel,
}: StarRatingProps) {
  const normalizedValue = Math.min(Math.max(value, 0), max);

  return (
    <MuiRating
      value={normalizedValue}
      max={max}
      precision={precision}
      size={size}
      readOnly
      className={className}
      sx={[starRatingSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      aria-label={ariaLabel}
    />
  );
}
