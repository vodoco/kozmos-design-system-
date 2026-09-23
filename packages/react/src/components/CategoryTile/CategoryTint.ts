/**
 * A category's colours, as its tile, its chip and its pin wear them: the
 * accent draws the icon, the strokes and the label; the fill fills a count
 * pill or counter, with the ink that reads on it. The taxonomy's eight
 * quick-access colours are the `--semantics-category-accent-*`, `-fill-*` and
 * `-on-fill-*` variables; `pnpm tokens:contrast:check` holds each fill's ink
 * to 4.5:1.
 */
export interface CategoryTint {
  accent: string;
  fill: string;
  onFill: string;
}
