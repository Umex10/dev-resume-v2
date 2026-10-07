import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type ThemeRegistration } from "shiki";
import type { CodeLang, KeyFile } from "@/content/types";

/** Keywords + annotations → accent, strings → accent2, comments → mute, rest → ink. CSS variables, never hex. */
const THEME: ThemeRegistration = {
  name: "umex",
  type: "dark",
  colors: { "editor.background": "transparent", "editor.foreground": "var(--ink)" },
  tokenColors: [
    { settings: { foreground: "var(--ink)" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "var(--mute)" } },
    {
      scope: ["string", "string.quoted", "punctuation.definition.string", "string.template"],
      settings: { foreground: "var(--acc2)" },
    },
    {
      scope: [
        "keyword",
        "storage.modifier",
        "storage.type",
        "constant.language",
        "variable.language.this",
        "storage.type.annotation",
        "punctuation.definition.annotation",
        "meta.declaration.annotation",
        "entity.name.type.annotation",
        "keyword.other.special-method.dockerfile",
      ],
      settings: { foreground: "var(--acc)" },
    },
    // Type references are not keywords — keep them in ink like the design's highlighter.
    {
      scope: ["storage.type.java", "storage.type.generic.java", "storage.type.object.array.java", "entity.name.type", "support.type", "support.class"],
      settings: { foreground: "var(--ink)" },
    },
    { scope: ["punctuation.definition.template-expression", "meta.template.expression"], settings: { foreground: "var(--ink)" } },
    // Operators and YAML plain scalars / keys read as plain text in the design.
    {
      scope: ["keyword.operator", "string.unquoted.plain", "string.unquoted.block", "entity.name.tag.yaml", "punctuation.definition.block.sequence.item.yaml"],
      settings: { foreground: "var(--ink)" },
    },
  ],
};

const LANG: Record<CodeLang, string> = {
  java: "java",
  ts: "typescript",
  tsx: "tsx",
  yaml: "yaml",
  proto: "proto",
  docker: "docker",
};

let highlighter: ReturnType<typeof createHighlighter> | null = null;
function getHighlighter() {
  highlighter ??= createHighlighter({ themes: [THEME], langs: Object.values(LANG) });
  return highlighter;
}

export function readCode(source: string): Promise<string> {
  return readFile(path.join(process.cwd(), "content", "code", source), "utf8");
}

export async function highlight(code: string, lang: CodeLang): Promise<string> {
  "use cache";
  const h = await getHighlighter();
  return h.codeToHtml(code.replace(/\n+$/, ""), { lang: LANG[lang], theme: "umex" });
}

export type HighlightedFile = Omit<KeyFile, "source"> & { html: string };

export async function highlightFiles(files: KeyFile[]): Promise<HighlightedFile[]> {
  return Promise.all(
    files.map(async ({ source, ...f }) => ({ ...f, html: await highlight(await readCode(source), f.lang) })),
  );
}
