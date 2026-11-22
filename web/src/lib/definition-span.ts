/**
 * Span for the last row of a gap-coloured definition grid.
 * An odd count in 2 columns otherwise leaves the container background
 * showing through as an empty cell. Below `md` the grid is one column,
 * so these classes do not apply.
 */
export function definitionCellSpan(
  index: number,
  count: number,
  columns: 2 | 3,
): string | undefined {
  if (count <= 0) return undefined;
  const remainder = count % columns;
  if (remainder === 0) return undefined;
  const rowStart = count - remainder;
  if (index < rowStart) return undefined;
  const position = index - rowStart;
  if (remainder === 1 && position === 0) {
    return columns === 3 ? "md:col-span-3" : "md:col-span-2";
  }
  if (columns === 3 && remainder === 2 && position === 1) {
    return "md:col-span-2";
  }
  return undefined;
}
