import Image from "next/image";
import Link from "next/link";
import { translate } from "@/lib/i18n";

/** نسبت واقعی فایل لوگو: ۱۳۲۳×۱۰۷۳ */
export const LOGO_NATIVE_WIDTH = 1323;
export const LOGO_NATIVE_HEIGHT = 1073;

type LogoProps = {
  className?: string;
  imageClassName?: string;
  locale?: string;
  /** ارتفاع نمایشی به پیکسل؛ عرض با نسبت واقعی حفظ می‌شود */
  height?: number;
  priority?: boolean;
  href?: string | null;
  alt?: string;
  "aria-hidden"?: boolean;
};

export function Logo({
  className,
  imageClassName,
  locale,
  height = 44,
  priority = false,
  href = "/",
  alt,
  "aria-hidden": ariaHidden,
}: LogoProps) {
  const resolvedAlt =
    alt ?? translate("common.brand.logoAlt", { lng: locale });

  const image = (
    <Image
      src="/assets/images/logo.png"
      alt={ariaHidden ? "" : resolvedAlt}
      width={LOGO_NATIVE_WIDTH}
      height={LOGO_NATIVE_HEIGHT}
      priority={priority}
      aria-hidden={ariaHidden}
      className={`w-auto max-w-none shrink-0 object-contain ${imageClassName ?? ""}`}
      style={{ height, width: "auto" }}
    />
  );

  if (href === null) {
    return image;
  }

  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center ${className ?? ""}`}
      aria-label={ariaHidden ? undefined : resolvedAlt}
    >
      {image}
    </Link>
  );
}
