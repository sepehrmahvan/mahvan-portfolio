"use client";

import { useCallback } from "react";
import { useLocaleStore } from "@/store/locale";
import type { Locale } from "@/store/locale/locale.types";
import {
  formatLocalizedDigitsInText,
  formatLocalizedNumber,
  toLatinDigits,
} from "@/utils/localized-number";

export function useLocalizedNumber() {
  const locale = useLocaleStore((state: any) => state.locale);

  const format = useCallback(
    (value: string | number) => formatLocalizedNumber(value, locale),
    [locale],
  );

  const formatInText = useCallback(
    (value: string | number) => formatLocalizedDigitsInText(value, locale),
    [locale],
  );

  const normalize = useCallback((value: string) => toLatinDigits(value), []);

  return {
    locale,
    format,
    formatInText,
    normalize,
  };
}

export type LocalizedNumberProps = {
  value: string | number;
  locale?: Locale;
  className?: string;
  /** برای پیش‌شماره‌ها و متن‌هایی مثل +98 */
  preserveText?: boolean;
};

export function LocalizedNumber({
  value,
  locale,
  className,
  preserveText = false,
}: LocalizedNumberProps) {
  const storeLocale = useLocaleStore((state: any) => state.locale);
  const resolvedLocale = locale ?? storeLocale;
  const formatted = preserveText
    ? formatLocalizedDigitsInText(value, resolvedLocale)
    : formatLocalizedNumber(value, resolvedLocale);

  return <span className={className}>{formatted}</span>;
}
