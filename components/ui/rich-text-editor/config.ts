import type { Locale } from "@/store/locale/locale.types";

type TranslateFn = (key: string) => string;

export function getRichTextEditorDirection(locale: Locale) {
  return locale === "fa" ? "rtl" : "ltr";
}

export function getRichTextEditorConfig(locale: Locale, t: TranslateFn) {
  const language = locale === "fa" ? "fa" : "en";

  return {
    language: { ui: language, content: language },
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "link",
      "blockQuote",
      "|",
      "bulletedList",
      "numberedList",
    ],
    heading: {
      options: [
        {
          model: "paragraph" as const,
          title: t("common.richTextEditor.paragraph"),
          class: "ck-heading_paragraph",
        },
        {
          model: "heading2" as const,
          view: "h2",
          title: t("common.richTextEditor.heading2"),
          class: "ck-heading_heading2",
        },
        {
          model: "heading3" as const,
          view: "h3",
          title: t("common.richTextEditor.heading3"),
          class: "ck-heading_heading3",
        },
      ],
    },
  };
}

export function applyRichTextEditorDirection(editor: any, locale: Locale) {
  const isRtl = locale === "fa";

  try {
    const root = editor?.editing?.view?.document?.getRoot?.();
    if (!root) return;

    editor.editing.view.change((writer: any) => {
      writer.setStyle("direction", isRtl ? "rtl" : "ltr", root);
      writer.setStyle("text-align", isRtl ? "right" : "left", root);
    });
  } catch {
    // ignore editor init styling errors
  }
}
