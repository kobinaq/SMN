/** Minimal Lexical JSON builders for imported rich text. Plain text nodes only: no formatting is invented. */

type TextNode = { type: "text"; detail: 0; format: 0; mode: "normal"; style: ""; text: string; version: 1 };

const text = (value: string): TextNode => ({ type: "text", detail: 0, format: 0, mode: "normal", style: "", text: value, version: 1 });

const block = (type: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
  type,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
  ...extra,
});

export type LexicalBlock = ReturnType<typeof block>;

export const paragraph = (value: string): LexicalBlock => block("paragraph", [text(value)], { textFormat: 0, textStyle: "" });

export const heading = (tag: "h2" | "h3" | "h4", value: string): LexicalBlock => block("heading", [text(value)], { tag });

export const bulletList = (items: readonly string[]): LexicalBlock =>
  block(
    "list",
    items.map((item, index) => ({ type: "listitem", format: "", indent: 0, version: 1, direction: "ltr", value: index + 1, children: [text(item)] })),
    { listType: "bullet", start: 1, tag: "ul" },
  );

export function lexicalRoot(children: LexicalBlock[]) {
  return { root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children } };
}

export const paragraphsDoc = (values: readonly string[]) => lexicalRoot(values.map(paragraph));
