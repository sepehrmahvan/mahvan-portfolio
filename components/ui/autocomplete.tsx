"use client";

import MuiAutocomplete, {
  type AutocompleteProps,
} from "@mui/material/Autocomplete";
import { useTheme } from "@mui/material/styles";
import { forwardRef, useMemo, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { useTranslation } from "@/hooks/use-translation";
import {
  autocompleteChipSx,
  autocompletePaperSx,
  getAutocompleteEndAdornmentSx,
  outlinedFieldSx,
} from "./field-styles";
import { TextField } from "./text-field";

export type AutocompleteOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type AutocompleteFieldProps = {
  label: string;
  options: AutocompleteOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  className?: string;
  multiple?: boolean;
  freeSolo?: boolean;
  /** Hide selected chips; useful when selection is shown elsewhere (e.g. a table). */
  hideTags?: boolean;
  /**
   * Search-only input: never show selected values/chips inside the field.
   * Selection is expected to be displayed elsewhere (e.g. a table).
   */
  searchOnly?: boolean;
  loading?: boolean;
  clearable?: boolean;
  placeholder?: string;
  noOptionsText?: string;
  loadingText?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  filterOptions?: AutocompleteProps<
    AutocompleteOption,
    boolean,
    boolean,
    boolean
  >["filterOptions"];
};

function getOptionLabel(option: AutocompleteOption | string) {
  return typeof option === "string" ? option : option.label;
}

function isOptionEqual(
  option: AutocompleteOption | string,
  selected: AutocompleteOption | string,
) {
  const optionValue = typeof option === "string" ? option : option.value;
  const selectedValue =
    typeof selected === "string" ? selected : selected.value;
  return optionValue === selectedValue;
}

function toStoredValue(
  option:
    | AutocompleteOption
    | string
    | (AutocompleteOption | string)[]
    | null
    | undefined,
  multiple: boolean,
): string | string[] {
  if (multiple) {
    if (!Array.isArray(option)) return [];
    return option.map((item) =>
      typeof item === "string" ? item : item.value,
    );
  }

  if (!option || Array.isArray(option)) return "";
  return typeof option === "string" ? option : option.value;
}

function toAutocompleteValue(
  value: string | string[],
  options: AutocompleteOption[],
  multiple: boolean,
  freeSolo: boolean,
): AutocompleteOption | AutocompleteOption[] | string | null {
  if (multiple) {
    const values = Array.isArray(value) ? value : [];
    return values
      .map((item) => {
        const matched = options.find((option) => option.value === item);
        if (matched) return matched;
        if (freeSolo) return { value: item, label: item };
        return null;
      })
      .filter((item): item is AutocompleteOption => item !== null);
  }

  if (Array.isArray(value) || !value) return null;

  const matched = options.find((option) => option.value === value);
  if (matched) return matched;
  if (freeSolo) return value;
  return null;
}

export const AutocompleteField = forwardRef<
  HTMLDivElement,
  AutocompleteFieldProps
>(function AutocompleteField(
  {
    label,
    options,
    value,
    onChange,
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
    freeSolo = false,
    hideTags = false,
    searchOnly = false,
    loading = false,
    clearable = true,
    placeholder,
    noOptionsText,
    loadingText,
    filterOptions,
  },
  ref,
) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchInputValue, setSearchInputValue] = useState("");
  const endAdornmentSx = useMemo(
    () => getAutocompleteEndAdornmentSx(theme.direction),
    [theme.direction],
  );
  const fieldId = id ?? name ?? label.replace(/\s+/g, "-");
  const hideSelectedInInput = searchOnly || hideTags;
  const autocompleteValue = useMemo(
    () => toAutocompleteValue(value, options, multiple, freeSolo),
    [value, options, multiple, freeSolo],
  );

  const handleChange: AutocompleteProps<
    AutocompleteOption,
    boolean,
    boolean,
    boolean
  >["onChange"] = (_event, newValue) => {
    onChange(toStoredValue(newValue, multiple));
    if (searchOnly) {
      setSearchInputValue("");
    }
  };

  return (
    <MuiAutocomplete
      ref={ref}
      id={fieldId}
      className={className}
      fullWidth={fullWidth}
      size={size}
      multiple={multiple}
      freeSolo={freeSolo}
      disabled={disabled}
      loading={loading}
      disableClearable={!clearable}
      options={options}
      value={autocompleteValue}
      onChange={handleChange}
      inputValue={searchOnly ? searchInputValue : undefined}
      onInputChange={
        searchOnly
          ? (_event, nextValue, reason) => {
              if (reason === "reset") {
                setSearchInputValue("");
                return;
              }
              setSearchInputValue(nextValue);
            }
          : undefined
      }
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqual}
      getOptionDisabled={(option) =>
        typeof option === "string" ? false : Boolean(option.disabled)
      }
      filterOptions={filterOptions}
      renderValue={hideSelectedInInput ? () => null : undefined}
      clearOnBlur={searchOnly}
      selectOnFocus={!searchOnly}
      handleHomeEndKeys
      noOptionsText={noOptionsText ?? t("common.autocomplete.noOptions")}
      loadingText={loadingText ?? t("common.loading.generic")}
      popupIcon={
        <HiChevronDown aria-hidden className="size-5 text-platform-gray" />
      }
      slotProps={{
        paper: {
          elevation: 0,
          sx: autocompletePaperSx,
        },
        chip: {
          size: "small",
          sx: autocompleteChipSx,
        },
      }}
      sx={{
        ...endAdornmentSx,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          inputRef={inputRef}
          onBlur={onBlur}
          sx={{
            ...outlinedFieldSx,
            ...endAdornmentSx,
            "& .MuiOutlinedInput-root": {
              paddingInlineEnd: multiple ? "8px" : undefined,
            },
          }}
        />
      )}
    />
  );
});
