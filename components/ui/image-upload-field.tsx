"use client";

import CircularProgress from "@mui/material/CircularProgress";
import type { ChangeEvent, ReactNode } from "react";
import { FiUploadCloud } from "react-icons/fi";

export type ImageUploadFieldProps = {
  label?: string;
  hint?: string;
  uploadLabel: string;
  loadingLabel?: string;
  value?: string;
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  error?: boolean;
  helperText?: string;
  accept?: string;
  previewAlt?: string;
  className?: string;
  actionIcon?: ReactNode;
  required?: boolean;
  disabled?: boolean;
};

export function ImageUploadField({
  label = "",
  hint,
  uploadLabel,
  loadingLabel,
  value,
  onFileSelect,
  isUploading = false,
  error = false,
  helperText,
  accept = "image/png,image/jpeg,image/svg+xml,image/webp",
  previewAlt = "",
  className = "",
  actionIcon,
  required = false,
  disabled = false,
}: ImageUploadFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onFileSelect(file);
  };

  const isInteractive = !disabled && !isUploading;

  return (
    <div className={className}>
      {label ? (
        <p className="mb-2 text-sm font-semibold text-platform-gray">
          {label}
          {required && !disabled ? (
            <span className="text-[#ED2E2E]"> *</span>
          ) : null}
        </p>
      ) : null}

      <label
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 transition-colors ${
          error
            ? "border-platform-error bg-red-50/40"
            : "border-platform-border bg-platform-background"
        } ${
          isInteractive
            ? "cursor-pointer hover:border-primary-main/50 hover:bg-primary-main/5"
            : "cursor-default pointer-events-none opacity-85"
        }`}
      >
        {!disabled ? (
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={isUploading}
            onChange={handleChange}
          />
        ) : null}
        <span className="flex size-12 items-center justify-center rounded-full text-platform-gray">
          {isUploading ? (
            <CircularProgress
              size={28}
              aria-label={loadingLabel ?? uploadLabel}
            />
          ) : (
            actionIcon ?? <FiUploadCloud className="text-2xl" aria-hidden />
          )}
        </span>
        <span className="text-sm text-platform-gray">
          {isUploading ? (loadingLabel ?? uploadLabel) : uploadLabel}
          {!isUploading && required && !label && !disabled ? (
            <span className="text-[#ED2E2E]"> *</span>
          ) : null}
        </span>
        {hint ? <span className="text-xs text-platform-gray-light">{hint}</span> : null}
      </label>

      {helperText ? (
        <p className={`mt-1.5 text-xs ${error ? "text-platform-error" : "text-platform-gray"}`}>
          {helperText}
        </p>
      ) : null}

      {value && !isUploading ? (
        <img
          src={value}
          alt={previewAlt}
          className="mt-3 max-h-56 w-full rounded-2xl border border-platform-border/60 object-contain"
        />
      ) : null}
    </div>
  );
}
