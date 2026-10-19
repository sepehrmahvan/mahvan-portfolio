"use client";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { forwardRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useTranslation } from "@/hooks/use-translation";
import { localeConfig } from "@/store/locale/locale.types";
import { TextField, type TextFieldProps } from "./text-field";

export type PasswordFieldProps = Omit<TextFieldProps, "type">;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ slotProps, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const { t, locale } = useTranslation();
    const direction = localeConfig[locale].dir;

    return (
      <TextField
        {...props}
        ref={ref}
        dir={direction}
        type={visible ? "text" : "password"}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  aria-label={
                    visible
                      ? t("common.password.hide")
                      : t("common.password.show")
                  }
                  onClick={() => setVisible((current) => !current)}
                  edge="end"
                  size="small"
                  sx={{ color: "text.secondary" }}
                >
                  {visible ? (
                    <HiEyeOff aria-hidden className="size-5" />
                  ) : (
                    <HiEye aria-hidden className="size-5" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    );
  },
);
