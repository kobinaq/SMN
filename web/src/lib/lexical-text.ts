/** Walk a Payload Lexical document into plain paragraphs. */

type LexicalTextChild = { text?: unknown; children?: LexicalTextChild[] };
type LexicalNode = { children?: LexicalTextChild[] };

function collectText(node: LexicalTextChild | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  return (node.children || []).map(collectText).join("");
}

export function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const root = (value as { root?: LexicalNode }).root;
  if (!root?.children) return "";
  return root.children
    .map((node) => collectText(node).trim())
    .filter(Boolean)
    .join("\n\n");
}

export function lexicalToParagraphs(value: unknown): string[] {
  const text = lexicalToPlainText(value);
  return text ? text.split(/\n\n+/) : [];
}
