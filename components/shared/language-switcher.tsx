"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiCheck, HiChevronDown, HiGlobeAlt } from "react-icons/hi";
import {
  localeConfig,
  locales,
  type Locale,
  useLocaleStore,
} from "@/store/locale";
import { useTranslation } from "@/hooks/use-translation";
import { localizePath, stripLocalePrefix } from "@/utils/locale-path";

const DROPDOWN_MIN_WIDTH = 176;
const DROPDOWN_OFFSET = 8;
const VIEWPORT_PADDING = 8;

type DropdownPosition = {
  top: number;
  left: number;
};

function getDropdownPosition(
  button: HTMLButtonElement,
  dropdownHeight = 120,
  dropdownWidth = DROPDOWN_MIN_WIDTH,
): DropdownPosition {
  const rect = button.getBoundingClientRect();
  const isRtl = document.documentElement.dir === "rtl";
  const spaceBelow = window.innerHeight - rect.bottom;
  const openAbove =
    spaceBelow < dropdownHeight + DROPDOWN_OFFSET &&
    rect.top > dropdownHeight + DROPDOWN_OFFSET;

  // Align to the button's inline-start, then clamp so it never leaves the viewport.
  let left = isRtl ? rect.right - dropdownWidth : rect.left;
  const maxLeft = window.innerWidth - dropdownWidth - VIEWPORT_PADDING;
  left = Math.max(VIEWPORT_PADDING, Math.min(left, maxLeft));

  return {
    top: openAbove
      ? rect.top - dropdownHeight - DROPDOWN_OFFSET
      : rect.bottom + DROPDOWN_OFFSET,
    left,
  };
}

type LanguageSwitcherProps = {
  fullWidth?: boolean;
  preferDropUp?: boolean;
  className?: string;
};

export function LanguageSwitcher({
  fullWidth = false,
  preferDropUp = false,
  className = "",
}: LanguageSwitcherProps) {
  const locale = useLocaleStore((state: any) => state.locale);
  const setLocale = useLocaleStore((state: any) => state.setLocale);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = localeConfig[locale as Locale];

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const dropdownHeight =
      dropdownRef.current?.offsetHeight ?? locales.length * 52 + 12;
    const position = getDropdownPosition(buttonRef.current, dropdownHeight);

    if (preferDropUp) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - dropdownHeight - DROPDOWN_OFFSET,
        left: position.left,
      });
      return;
    }

    setPosition(position);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      updatePosition();
    });

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, locale, preferDropUp]);

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }

    const pathWithoutLocale = stripLocalePrefix(pathname);
    const search =
      typeof window !== "undefined" ? window.location.search : "";
    const currentHref = `${pathWithoutLocale}${search}`;

    router.push(localizePath(currentHref, nextLocale));
    setLocale(nextLocale);
    setOpen(false);
  };

  const dropdown = (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-label={t("common.locale.availableLanguages")}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        minWidth: DROPDOWN_MIN_WIDTH,
        zIndex: 9999,
      }}
      className={`overflow-hidden rounded-xl border border-platform-border/70 bg-platform-white p-1.5 shadow-[0_16px_40px_rgba(0,43,71,0.16)] transition-all duration-200 ease-out ${
        open
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-1 scale-95 opacity-0"
      }`}
    >
      {locales.map((item) => {
        const option = localeConfig[item];
        const isActive = item === locale;

        return (
          <button
            key={item}
            type="button"
            role="option"
            aria-selected={isActive}
            onClick={() => handleSelect(item)}
            className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start transition-colors ${
              isActive
                ? "bg-primary-main/10 text-black"
                : "text-platform-gray hover:bg-platform-background hover:text-black"
            }`}
          >
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{option.nativeLabel}</span>
              <span className="text-xs text-platform-gray-light">
                {option.label}
              </span>
            </span>
            {isActive ? (
              <HiCheck className="size-4 shrink-0 text-black" aria-hidden />
            ) : (
              <span className="size-4 shrink-0" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.locale.selectLanguage")}
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) updatePosition();
        }}
        className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-platform-white px-3 text-sm font-medium text-platform-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/60 ${
          fullWidth ? "w-full justify-between" : ""
        } ${className}`.trim()}
      >
        <HiGlobeAlt className="size-4 text-platform-black" aria-hidden />
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <span className="sm:hidden">{current.shortLabel}</span>
        <HiChevronDown
          className={`size-4 text-platform-black transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {mounted && open ? createPortal(dropdown, document.body) : null}
    </>
  );
}
