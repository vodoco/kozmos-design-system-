/**
 * The design tokens, read from the stylesheets the tokens package ships —
 * every variable, its light and dark values, and the description the
 * generator wrote beside it. The foundations pages are drawn from this, so
 * they cannot drift from what the components use.
 */
import light from "@kozmos/tokens/dist/css/variables-light.css?raw";
import dark from "@kozmos/tokens/dist/css/variables-dark.css?raw";
import { mergeThemes, rampOf, type TokenEntry } from "./tokens-core";

export type { TokenEntry } from "./tokens-core";
export { px, shortName, stepOf } from "./tokens-core";

export const tokens: readonly TokenEntry[] = mergeThemes(light, dark);

const byName = new Map(tokens.map((entry) => [entry.name, entry]));

export function token(name: string): TokenEntry | undefined {
  return byName.get(name);
}

/** Every token whose name starts with the prefix, in stylesheet order. */
export function tokensWithPrefix(prefix: string): TokenEntry[] {
  return tokens.filter((entry) => entry.name.startsWith(prefix));
}

/** The tokens of one ramp — `--primitives-colors-theme-<n>` — by step. */
export function ramp(prefix: string): TokenEntry[] {
  return rampOf(tokens, prefix);
}
