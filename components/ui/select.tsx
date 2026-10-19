"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControl, { type FormControlProps } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { type SelectChangeEvent } from "@mui/material/Select";
import { forwardRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import {
  getLegendCollapseSx,
  outlinedFieldSx,
  requiredAsteriskSx,
  selectIconSx,
  selectMenuPaperSx,
} from "./field-styles";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldBaseProps = {
  label: string;
  options: SelectOption[];
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  fullWidth?: boolean;
  size?: FormControlProps["size"];
  className?: string;
};

export type SelectFieldSingleProps = SelectFieldBaseProps & {
  multiple?: false;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
};

export type SelectFieldMultipleProps = SelectFieldBaseProps & {
  multiple: true;
  value: string[];
  onChange: (event: SelectChangeEvent<string[]>) => void;
};

export type SelectFieldProps =
  | SelectFieldSingleProps
  | SelectFieldMultipleProps;

export const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(
  function SelectField(props, ref) {
    const {
      label,
      options,
      onBlur,
      inputRef,
      helperText,
      error = false,
      disabled = false,
      required = false,
      name,
      id,
      fullWidth = true,
      size = "medium",
      className,
      multiple = false,
      value,
      onChange,
    } = props;

    const fieldId = id ?? name ?? label.replace(/\s+/g, "-");
    const labelId = `${fieldId}-label`;
    const [focused, setFocused] = useState(false);
    const hasValue = multiple
      ? Array.isArray(value) && value.length > 0
      : typeof value === "string" && value.length > 0;
    const labelShrink = hasValue || focused;

    const renderValue = (selected: unknown) => {
      if (multiple) {
        const selectedValues = Array.isArray(selected)
          ? selected.filter((item): item is string => typeof item === "string")
          : [];
        if (selectedValues.length === 0) return "";
        return selectedValues
          .map(
            (item) =>
              options.find((option) => option.value === item)?.label ?? item,
          )
          .join("، ");
      }

      if (typeof selected !== "string" || !selected) return "";
      return options.find((option) => option.value === selected)?.label ?? "";
    };

    return (
      <FormControl
        ref={ref}
        fullWidth={fullWidth}
        error={error}
        disabled={disabled}
        required={required}
        size={size}
        className={className}
        variant="outlined"
        sx={requiredAsteriskSx}
      >
        <InputLabel id={labelId} shrink={labelShrink}>
          {label}
        </InputLabel>

        <MuiSelect
          id={fieldId}
          name={name}
          labelId={labelId}
          label={label}
          multiple={multiple}
          value={value}
          onChange={onChange as (event: SelectChangeEvent<unknown>) => void}
          onBlur={onBlur}
          inputRef={inputRef}
          onOpen={() => setFocused(true)}
          onClose={() => setFocused(false)}
          displayEmpty
          renderValue={renderValue}
          IconComponent={({ className: iconClassName, style, ...iconProps }) => (
            <HiChevronDown
              {...iconProps}
              aria-hidden
              className={`${iconClassName ?? ""} block! size-5 text-platform-gray`}
              style={{
                ...style,
                right: "auto",
                left: "auto",
                insetInlineEnd: 12,
                insetInlineStart: "auto",
              }}
            />
          )}
          sx={{
            ...outlinedFieldSx,
            ...selectIconSx,
            "& .MuiSelect-select": {
              paddingInlineEnd: "40px",
            },
            ...getLegendCollapseSx(labelShrink),
          }}
          MenuProps={{
            autoFocus: false,
            slotProps: {
              paper: {
                elevation: 0,
                sx: selectMenuPaperSx,
              },
            },
          }}
        >
          {options.map((option) => {
            const selected = multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value;

            return (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {multiple ? (
                  <>
                    <Checkbox
                      checked={selected}
                      size="small"
                      tabIndex={-1}
                      disableRipple
                      sx={{ p: 0, marginInlineEnd: 1 }}
                    />
                    <ListItemText primary={option.label} />
                  </>
                ) : (
                  option.label
                )}
              </MenuItem>
            );
          })}
        </MuiSelect>

        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  },
);
