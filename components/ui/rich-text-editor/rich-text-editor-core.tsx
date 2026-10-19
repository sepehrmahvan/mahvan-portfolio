"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "@/hooks/use-translation";
import {
  applyRichTextEditorDirection,
  getRichTextEditorConfig,
  getRichTextEditorDirection,
} from "./config";
import "./rich-text-editor.css";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((module) => module.CKEditor),
  { ssr: false },
);

export type RichTextEditorCoreProps = {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  placeholder?: string;
  id?: string;
  error?: boolean;
  className?: string;
};

export function RichTextEditorCore({
  value,
  onChange,
  minHeight = 200,
  placeholder,
  id,
  error = false,
  className = "",
}: RichTextEditorCoreProps) {
  const { t, locale } = useTranslation();
  const [editorClass, setEditorClass] = useState<any>(null);
  const direction = getRichTextEditorDirection(locale);

  const editorConfig = useMemo(
    () => getRichTextEditorConfig(locale, t),
    [locale, t],
  );

  useEffect(() => {
    let cancelled = false;

    import("@ckeditor/ckeditor5-build-classic")
      .then((module) => {
        if (cancelled) return;
        setEditorClass(() => module.default ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setEditorClass(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      id={id}
      dir={direction}
      className={`rich-text-editor rounded-xl border bg-white transition-colors ${
        error ? "border-platform-error" : "border-gray-200"
      } ${className}`.trim()}
      style={{ "--rich-text-min-height": `${minHeight}px` } as CSSProperties}
    >
      {editorClass ? (
        <CKEditor
          key={locale}
          editor={editorClass}
          config={{
            ...editorConfig,
            placeholder: placeholder ?? "",
          }}
          data={value}
          onReady={(editor: any) => {
            applyRichTextEditorDirection(editor, locale);
          }}
          onChange={(_: any, editor: any) => {
            onChange(editor.getData());
          }}
        />
      ) : (
        <p className="px-4 py-6 text-center text-sm text-platform-gray">
          {t("common.richTextEditor.loading")}
        </p>
      )}
    </div>
  );
}
