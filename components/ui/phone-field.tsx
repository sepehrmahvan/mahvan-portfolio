"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { forwardRef, useCallback, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { CountryFlag } from "@/components/shared/country-flag";
import { useLocalizedNumber } from "@/components/shared/localized-number";
import {
  countryDialCodes,
  DEFAULT_COUNTRY_DIAL_CODE,
  getCountryByCode,
  type CountryDialCode,
} from "@/constants/country-dial-codes";
import { useTranslation } from "@/hooks/use-translation";
import { translate } from "@/lib/i18n";
import { outlinedInputMetrics, selectMenuPaperSx } from "./field-styles";
import { toLatinDigits } from "@/utils/localized-number";

export type PhoneFieldValue = {
  countryCode: string;
  number: string;
};

export const defaultPhoneFieldValue: PhoneFieldValue = {
  countryCode: DEFAULT_COUNTRY_DIAL_CODE,
  number: "",
};

export type PhoneFieldProps = {
  value: PhoneFieldValue;
  onChange: (value: PhoneFieldValue) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  fullWidth?: boolean;
  className?: string;
};

function sanitizePhoneNumber(value: string) {
  return toLatinDigits(value).replace(/\D/g, "");
}

const IR_MOBILE_LENGTH = 10;

/** نرمال‌سازی شماره هنگام تایپ — بدون صفر اول */
export function normalizePhoneNumberInput(
  raw: string,
  countryCode: string,
): string {
  const digits = sanitizePhoneNumber(raw).replace(/^0+/, "");
  const maxLength =
    countryCode === DEFAULT_COUNTRY_DIAL_CODE ? IR_MOBILE_LENGTH : 15;

  return digits.slice(0, maxLength);
}

export function validatePhoneNumber(
  value: PhoneFieldValue,
  lng?: string,
): true | string {
  const number = toLatinDigits(value.number ?? "").replace(/\D/g, "");

  if (!number) {
    return translate("validation.required.phone", { lng });
  }

  if (number.startsWith("0")) {
    return translate("validation.phone.noLeadingZero", { lng });
  }

  if (value.countryCode === DEFAULT_COUNTRY_DIAL_CODE) {
    if (number.length !== IR_MOBILE_LENGTH) {
      return translate("validation.phone.mustBeTenDigits", { lng });
    }
    if (!number.startsWith("9")) {
      return translate("validation.phone.mustStartWithNine", { lng });
    }
    if (!/^9\d{9}$/.test(number)) {
      return translate("validation.phone.invalid", { lng });
    }
    return true;
  }

  if (number.length < 6) {
    return translate("validation.phone.invalid", { lng });
  }

  return true;
}

export function getFullPhoneNumber(value: PhoneFieldValue): string {
  const country = getCountryByCode(value.countryCode);
  const dialDigits = country?.dialCode.replace(/\D/g, "") ?? "";
  const numberDigits = sanitizePhoneNumber(value.number);
  if (!numberDigits) return "";
  return `+${dialDigits}${numberDigits}`;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  function PhoneField(
    {
      value,
      onChange,
      onBlur,
      inputRef,
      label,
      placeholder,
      helperText,
      error = false,
      disabled = false,
      required = false,
      name,
      id,
      fullWidth = true,
      className,
    },
    ref,
  ) {
    const { t } = useTranslation();
    const fieldId = id ?? name ?? "phone-field";
    const resolvedPlaceholder = placeholder ?? t("common.phone.placeholder");
    const [focused, setFocused] = useState(false);
    const { format, formatInText } = useLocalizedNumber();

    const renderCountryValue = useCallback(
      (code: string) => {
        const country = getCountryByCode(code);
        if (!country) return null;

        return (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              direction: "ltr",
              unicodeBidi: "isolate",
            }}
          >
            <CountryFlag code={country.code} size={22} />
            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
              {formatInText(country.dialCode)}
            </Box>
          </Box>
        );
      },
      [formatInText],
    );

    const handleCountryChange = (event: SelectChangeEvent<string>) => {
      const countryCode = event.target.value;
      onChange({
        countryCode,
        number: normalizePhoneNumberInput(value.number, countryCode),
      });
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...value,
        number: normalizePhoneNumberInput(event.target.value, value.countryCode),
      });
    };

    const displayPhoneNumber = value.number ? format(value.number) : "";

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocused(false);
      }
    };

    return (
      <Box
        className={className}
        sx={{
          position: "relative",
          width: fullWidth ? "100%" : undefined,
        }}
      >
        {label ? (
          <Box
            component="label"
            htmlFor={fieldId}
            sx={{
              position: "absolute",
              top: -8,
              insetInlineStart: 12,
              zIndex: 1,
              px: 0.5,
              bgcolor: "background.paper",
              color: error
                ? "error.main"
                : focused
                  ? "primary.main"
                  : "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 500,
              lineHeight: 1.2,
              pointerEvents: "none",
            }}
          >
            {label}
            {required ? (
              <Box component="span" sx={{ color: "error.main", ms: 0.25 }}>
                *
              </Box>
            ) : null}
          </Box>
        ) : null}
        <Box
          dir="ltr"
          id={fieldId}
          role="group"
          aria-invalid={error}
          aria-label={label}
          aria-describedby={helperText ? `${fieldId}-helper` : undefined}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          sx={{
            display: "flex",
            alignItems: "center",
            height: outlinedInputMetrics.height.medium,
            minHeight: outlinedInputMetrics.height.medium,
            px: outlinedInputMetrics.paddingX,
            borderRadius: "4px !important",
            border: "1px solid",
            borderColor: error
              ? "error.main"
              : focused
                ? "primary.main"
                : "divider",
            bgcolor: "background.paper",
            transition: "border-color 0.2s ease",
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
            boxSizing: "border-box",
            "&:hover": {
              borderColor: error
                ? "error.main"
                : focused
                  ? "primary.main"
                  : "text.disabled",
            },
          }}
        >
          <Select
            value={value.countryCode}
            onChange={handleCountryChange}
            disabled={disabled}
            variant="standard"
            disableUnderline
            displayEmpty
            inputProps={{
              "aria-label": t("common.phone.countryCodeAria"),
            }}
            IconComponent={({ className, ...props }) => (
              <HiChevronDown
                {...props}
                aria-hidden
                className={`${className ?? ""} size-4 text-platform-gray`}
              />
            )}
            renderValue={renderCountryValue}
            sx={{
              flexShrink: 0,
              direction: "ltr",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                py: 0,
                pl: 0.5,
                pr: "22px !important",
                minWidth: 88,
                minHeight: "unset",
              },
              "& .MuiSelect-icon": {
                right: 0,
                color: "text.secondary",
              },
            }}
            MenuProps={{
              slotProps: {
                paper: {
                  elevation: 0,
                  sx: {
                    ...selectMenuPaperSx,
                    maxHeight: 320,
                    direction: "ltr",
                  },
                },
              },
            }}
          >
            {countryDialCodes.map((country: CountryDialCode) => (
              <MenuItem
                key={country.code}
                value={country.code}
                sx={{
                  direction: "ltr",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                }}
              >
                <CountryFlag code={country.code} size={20} />
                <Box component="span" sx={{ flex: 1, fontWeight: 500 }}>
                  {t(`countries.${country.code}`)}
                </Box>
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  {formatInText(country.dialCode)}
                </Box>
              </MenuItem>
            ))}
          </Select>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              alignSelf: "stretch",
              my: "12px",
              mx: 1,
              borderColor: "divider",
            }}
          />

          <Box
            component="input"
            name={name}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={resolvedPlaceholder}
            value={displayPhoneNumber}
            onChange={handleNumberChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            ref={ref ?? inputRef}
            sx={{
              flex: 1,
              minWidth: 0,
              border: 0,
              outline: 0,
              background: "transparent",
              direction: "ltr",
              fontWeight: 600,
              color: "text.primary",
              fontFamily: "inherit",
              fontSize: outlinedInputMetrics.fontSize,
              lineHeight: outlinedInputMetrics.lineHeight,
              p: 0,
              textAlign: "left",
              "&::placeholder": {
                color: "text.disabled",
                opacity: 1,
              },
              "&:disabled": {
                cursor: "not-allowed",
              },
            }}
          />
        </Box>

        {helperText ? (
          <FormHelperText id={`${fieldId}-helper`} error={error}>
            {helperText}
          </FormHelperText>
        ) : null}
      </Box>
    );
  },
);
