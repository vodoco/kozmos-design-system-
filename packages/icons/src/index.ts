/**
 * The registry is the package's surface: `getIconComponent`, the names, the
 * definitions, and the icons this package owns.
 *
 * It deliberately does **not** re-export lucide wholesale any more. It did, and
 * the moment the first owned outline landed that made two different icons
 * reachable under one name — `import { Heart }` drew lucide's, while
 * `getIconComponent("heart")` drew Pointr's, and nothing told the caller which
 * one they had. Nothing in this repository used the re-export; a consumer that
 * wants an icon outside the set imports `lucide-react` directly, which is
 * already a peer dependency.
 */
export * from "./registry.js";
export * from "./pointr/icons.generated.js";
export * from "./taxonomy/icons.generated.js";
