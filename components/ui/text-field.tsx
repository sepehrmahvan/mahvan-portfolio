"use client";

import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import { forwardRef } from "react";
import { outlinedFieldSx } from "./field-styles";

type BaseTextFieldProps = {
  label: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export type TextFieldProps = BaseTextFieldProps &
  Omit<
    MuiTextFieldProps,
    "label" | "helperText" | "error" | "fullWidth" | "variant" | "className"
  >;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      helperText,
      error = false,
      fullWidth = true,
      className,
      size = "medium",
      id,
      name,
      sx,
      slotProps,
      ...props
    },
    ref,
  ) {
    const fieldId = id ?? name ?? label.replace(/\s+/g, "-");

    return (
      <MuiTextField
        {...props}
        id={fieldId}
        name={name}
        label={label}
        helperText={helperText}
        error={error}
        fullWidth={fullWidth}
        className={className}
        size={size}
        variant="outlined"
        inputRef={ref}
        sx={{
          ...outlinedFieldSx,
          ...(typeof sx === "object" && !Array.isArray(sx) ? sx : {}),
        }}
        slotProps={slotProps}
      />
    );
  },
);
