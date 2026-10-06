// Ekstrak plain text dari Portable Text blocks (Sanity) untuk keperluan search.
// Menelusuri children[].text (span) dan field code (code block).
export function extractTextFromBlocks(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  const parts: string[] = [];

  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const n = node as Record<string, unknown>;
    if (typeof n.text === "string" && n.text) parts.push(n.text);
    if (typeof n.code === "string" && n.code) parts.push(n.code);
    if (Array.isArray(n.children)) walk(n.children);
  };

  walk(blocks);
  return parts.join(" ");
}
