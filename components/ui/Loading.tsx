'use client';

import CircularProgress from '@mui/material/CircularProgress';

import { cn } from '@/utils/cn';

interface LoadingProps {
  className?: string;
  size?: number;
}

export function Loading({ className, size = 32 }: LoadingProps) {
  return (
    <div
      className={cn('flex items-center justify-center py-10', className)}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={size} />
    </div>
  );
}
