"use client";

import MuiCheckbox, {
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { forwardRef } from "react";
import { checkboxSx, controlLabelSx } from "./control-styles";

export type CheckboxFieldProps = {
  label: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  checked: boolean;
  onChange: MuiCheckboxProps["onChange"];
  onBlur?: MuiCheckboxProps["onBlur"];
  indeterminate?: boolean;
};

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField(
    {
      label,
      helperText,
      error = false,
      disabled = false,
      required = false,
      name,
      id,
      className,
      checked,
      onChange,
      onBlur,
      indeterminate = false,
    },
    ref,
  ) {
    const fieldId = id ?? name ?? label.replace(/\s+/g, "-");

    return (
      <FormControl
        error={error}
        disabled={disabled}
        required={required}
        className={className}
        component="fieldset"
        variant="standard"
      >
        <FormControlLabel
          label={label}
          sx={controlLabelSx}
          control={
            <MuiCheckbox
              id={fieldId}
              name={name}
              checked={checked}
              onChange={onChange}
              onBlur={onBlur}
              indeterminate={indeterminate}
              disableRipple
              sx={checkboxSx}
              slotProps={{ input: { ref } }}
            />
          }
        />

        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  },
);
