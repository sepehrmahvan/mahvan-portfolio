"use client";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import MuiSwitch, {
  type SwitchProps as MuiSwitchProps,
} from "@mui/material/Switch";
import { forwardRef } from "react";
import { controlLabelSx, switchSx } from "./control-styles";

export type SwitchFieldProps = {
  label: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  checked: boolean;
  onChange: MuiSwitchProps["onChange"];
  onBlur?: MuiSwitchProps["onBlur"];
};

export const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(
  function SwitchField(
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
          labelPlacement="start"
          sx={{
            ...controlLabelSx,
            width: "100%",
            justifyContent: "space-between",
            marginInlineStart: 0,
          }}
          control={
            <MuiSwitch
              id={fieldId}
              name={name}
              checked={checked}
              onChange={onChange}
              onBlur={onBlur}
              disableRipple
              sx={switchSx}
              slotProps={{ input: { ref } }}
            />
          }
        />

        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  },
);
