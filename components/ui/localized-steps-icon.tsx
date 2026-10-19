"use client";

import { FiCheck } from "react-icons/fi";
import { useTranslation } from "@/hooks/use-translation";
import { formatLocalizedNumber } from "@/utils/localized-number";

type LocalizedStepsIconProps = {
  index: number;
  status?: string;
};

export function LocalizedStepsIcon({ index, status }: LocalizedStepsIconProps) {
  const { locale } = useTranslation();

  if (status === "finish") {
    return (
      <span className="rc-steps-icon flex items-center justify-center" aria-hidden>
        <FiCheck className="size-4 stroke-3" />
      </span>
    );
  }

  return (
    <span className="rc-steps-icon">
      {formatLocalizedNumber(index + 1, locale)}
    </span>
  );
}
