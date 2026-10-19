"use client";

import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";
import { useMemo } from "react";
import DatePicker from "react-multi-date-picker";
import type DateObject from "react-date-object";
import { DateFieldInput } from "./date-field-input";
import {
  dateObjectToIsoDate,
  dateToDateObject,
  getDatePickerLocaleConfig,
  isoDateToDateObject,
} from "@/lib/date/date-picker-config";
import { useTranslation } from "@/hooks/use-translation";
import { getDirection } from "@/store/locale";
import "./date-field.css";

type BaseDateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  size?: MuiTextFieldProps["size"];
  minDate?: Date;
  maxDate?: Date;
};

export type DateFieldProps = BaseDateFieldProps;

export function DateField({
  label,
  value,
  onChange,
  helperText,
  error = false,
  disabled = false,
  required = false,
  fullWidth = true,
  className,
  name,
  id,
  size = "medium",
  minDate,
  maxDate,
}: DateFieldProps) {
  const { locale } = useTranslation();
  const direction = getDirection(locale);
  const { calendar, locale: calendarLocale, displayFormat } = getDatePickerLocaleConfig(locale);
  const fieldId = id ?? name ?? label.replace(/\s+/g, "-");

  const pickerValue = useMemo(
    () => isoDateToDateObject(value, calendar),
    [value, calendar],
  );

  const pickerMinDate = useMemo(
    () => (minDate ? dateToDateObject(minDate, calendar) : undefined),
    [minDate, calendar],
  );

  const pickerMaxDate = useMemo(
    () => (maxDate ? dateToDateObject(maxDate, calendar) : undefined),
    [maxDate, calendar],
  );

  const handleChange = (date: DateObject | DateObject[] | null) => {
    if (!date || Array.isArray(date)) {
      onChange("");
      return;
    }

    onChange(dateObjectToIsoDate(date));
  };

  return (
    <DatePicker
      value={pickerValue ?? ""}
      onChange={handleChange}
      calendar={calendar}
      locale={calendarLocale}
      format={displayFormat}
      minDate={pickerMinDate}
      maxDate={pickerMaxDate}
      calendarPosition="bottom-center"
      arrow={false}
      containerClassName={`boushehr-date-picker ${direction === "ltr" ? "boushehr-date-picker-ltr" : ""}`}
      render={
        <DateFieldInput
          label={label}
          helperText={helperText}
          error={error}
          disabled={disabled}
          required={required}
          fieldId={fieldId}
          name={name}
          fullWidth={fullWidth}
          size={size}
          className={className}
          onClear={() => onChange("")}
        />
      }
    />
  );
}
