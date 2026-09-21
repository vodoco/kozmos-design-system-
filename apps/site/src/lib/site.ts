/**
 * Facts the site states in more than one place, kept here so that changing one
 * changes every page.
 */

/**
 * Whether the four public packages are on npm. While false, every install
 * instruction says so and points at the repository instead; flip it in the
 * commit that follows the first `changeset publish`, once
 * `npm view @kozmos/react version` answers.
 */
export const PACKAGES_PUBLISHED = false;

/**
 * Whether search engines may index the site. False until the public launch:
 * a pre-release deploy should not be found. Every page then carries
 * `<meta name="robots" content="noindex">`.
 */
export const SITE_INDEXABLE = false;

/** The packages a web consumer installs, in the order the README lists them. */
export const PUBLIC_PACKAGES = [
  {
    name: "@kozmos/react",
    summary: "The React components, their stylesheet and the ThemeProvider.",
  },
  {
    name: "@kozmos/tokens",
    summary: "Every token as CSS variables, JavaScript, Swift and Kotlin.",
  },
  {
    name: "@kozmos/icons",
    summary: "The icon registry and the outlines Kozmos owns.",
  },
  {
    name: "@kozmos/product-contracts",
    summary: "Platform-neutral shapes for POI, floor, route and map data.",
  },
] as const;

/** The name the browser tab and the header use. */
export const SITE_NAME = "Kozmos";

/** Where the theme choice is remembered. Only this site reads or writes it. */
export const THEME_STORAGE_KEY = "kozmos-site-theme";

/** Builds a page title the way every route does. */
export function pageTitle(title?: string) {
  return title ? `${title} · Kozmos design system` : "Kozmos design system";
}
