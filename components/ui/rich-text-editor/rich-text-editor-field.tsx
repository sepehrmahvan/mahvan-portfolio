"use client";

import { useId } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { getRichTextEditorDirection } from "./config";
import { RichTextEditorCore } from "./rich-text-editor-core";

export type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  className?: string;
};

export function RichTextEditor({
  label,
  value,
  onChange,
  minHeight = 200,
  placeholder,
  error = false,
  helperText,
  required = false,
  className = "",
}: RichTextEditorProps) {
  const { locale } = useTranslation();
  const fieldId = useId();
  const direction = getRichTextEditorDirection(locale);

  return (
    <div className={`w-full ${className}`.trim()} dir={direction}>
      <label
        htmlFor={fieldId}
        className={`mb-2 block text-start text-sm font-medium ${
          error ? "text-platform-error" : "text-platform-gray"
        }`}
      >
        {label}
        {required ? <span className="text-platform-error"> *</span> : null}
      </label>

      <RichTextEditorCore
        id={fieldId}
        value={value}
        onChange={onChange}
        minHeight={minHeight}
        placeholder={placeholder}
        error={error}
      />

      {helperText ? (
        <p className={`mt-1.5 text-start text-xs ${error ? "text-platform-error" : "text-platform-gray"}`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
