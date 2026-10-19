"use client";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import MuiRadio from "@mui/material/Radio";
import RadioGroup, {
  type RadioGroupProps,
} from "@mui/material/RadioGroup";
import { forwardRef } from "react";
import { controlLabelSx, fieldsetLabelSx, radioSx } from "./control-styles";

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioGroupFieldProps = {
  label?: string;
  options: RadioOption[];
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  row?: boolean;
  value: string;
  onChange: RadioGroupProps["onChange"];
  onBlur?: RadioGroupProps["onBlur"];
};

export const RadioGroupField = forwardRef<HTMLDivElement, RadioGroupFieldProps>(
  function RadioGroupField(
    {
      label,
      options,
      helperText,
      error = false,
      disabled = false,
      required = false,
      name,
      id,
      className,
      row = false,
      value,
      onChange,
      onBlur,
    },
    ref,
  ) {
    const fieldId = id ?? name ?? label?.replace(/\s+/g, "-");

    return (
      <FormControl
        error={error}
        disabled={disabled}
        required={required}
        className={className}
        component="fieldset"
        variant="standard"
      >
        {label ? (
          <FormLabel component="legend" id={fieldId} sx={fieldsetLabelSx}>
            {label}
          </FormLabel>
        ) : null}

        <RadioGroup
          ref={ref}
          aria-labelledby={label ? fieldId : undefined}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          row={row}
          sx={{ gap: row ? 2 : 0.5, mt: label ? 0.5 : 0 }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              label={option.label}
              sx={{
                ...controlLabelSx,
                alignItems: "center",
              }}
              control={<MuiRadio disableRipple sx={radioSx} />}
            />
          ))}
        </RadioGroup>

        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  },
);
