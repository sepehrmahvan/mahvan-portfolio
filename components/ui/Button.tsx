'use client';

import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';

export type ButtonProps = MuiButtonProps;

/** Thin MUI Button wrapper used across form and auth surfaces. */
export function Button(props: ButtonProps) {
  return <MuiButton {...props} />;
}
