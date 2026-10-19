"use client";

import FormControl, { type FormControlProps } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useState } from "react";
import type { CustomComponentProps } from "react-multi-date-picker";
import { FiCalendar, FiX } from "react-icons/fi";
import { getLegendCollapseSx, outlinedFieldSx, requiredAsteriskSx } from "./field-styles";

type DateFieldInputProps = CustomComponentProps & {
  label: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  fieldId: string;
  name?: string;
  fullWidth?: boolean;
  size?: FormControlProps["size"];
  className?: string;
  onClear: () => void;
};

export function DateFieldInput({
  label,
  value = "",
  openCalendar,
  onFocus,
  helperText,
  error = false,
  disabled = false,
  required = false,
  fieldId,
  name,
  fullWidth = true,
  size = "medium",
  className,
  onClear,
}: DateFieldInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const labelShrink = hasValue || focused;

  const handleOpen = () => {
    if (disabled) return;
    setFocused(true);
    openCalendar?.();
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      disabled={disabled}
      required={required}
      size={size}
      className={className}
      variant="outlined"
      sx={requiredAsteriskSx}
    >
      <InputLabel htmlFor={fieldId} shrink={labelShrink}>
        {label}
      </InputLabel>

      <OutlinedInput
        id={fieldId}
        name={name}
        label={label}
        readOnly
        value={value}
        notched={labelShrink}
        onClick={handleOpen}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
          openCalendar?.();
        }}
        onBlur={() => setFocused(false)}
        endAdornment={
          <InputAdornment position="end" className="gap-0.5">
            {hasValue ? (
              <IconButton
                size="small"
                aria-label="clear date"
                disabled={disabled}
                onClick={(event) => {
                  event.stopPropagation();
                  onClear();
                }}
              >
                <FiX aria-hidden />
              </IconButton>
            ) : null}
            <IconButton
              size="small"
              aria-label="open calendar"
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                handleOpen();
              }}
            >
              <FiCalendar aria-hidden />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          ...outlinedFieldSx,
          ...getLegendCollapseSx(labelShrink),
          cursor: disabled ? "not-allowed" : "pointer",
          "& .MuiOutlinedInput-input": {
            cursor: disabled ? "not-allowed" : "pointer",
          },
        }}
      />

      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}
