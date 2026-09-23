# @kozmos-ds/icons

Icon components and the name registry for the Kozmos design system.

## Install

```sh
npm install @kozmos-ds/icons react lucide-react
```

`lucide-react` is a peer dependency: some Kozmos icons are drawn from it, and
the rest carry their own outlines.

## Use

Most apps reach icons through `@kozmos-ds/react`, by name:

```tsx
import { Icon } from "@kozmos-ds/react";

<Icon name="calendar" />;
```

Or directly:

```tsx
import { getIconComponent, resolveIconName } from "@kozmos-ds/icons";

const Calendar = getIconComponent("calendar");
resolveIconName("back"); // "arrow-left"
```

Names are stable keys such as `arrow-left`, `bell-01` and `calendar`.
`kozmosIconNames` lists every one, and `resolveIconName` turns an alias — `add`,
`back`, `close`, `delete` — into its key. Icons with their own outlines are also
named exports, for example `import { Heart } from "@kozmos-ds/icons"`.

## Taxonomy symbols

The taxonomy's quick-access symbols are here too, as the taxonomy publishes
them: solid pictograms rather than outlines, named `taxonomy-` and their type —
`taxonomy-entrance-exit`, `taxonomy-food-beverage-space` — and exported as
components. A symbol fills with its colour, so a category's accent tints it:

```tsx
import { TaxonomyEntranceExit } from "@kozmos-ds/icons";

<TaxonomyEntranceExit color="var(--semantics-category-accent-green)" />;
```

Their definitions say `source: "taxonomy"` and the release they come from. To
add one, name its published SVG in `scripts/build-taxonomy-icons.mjs` and run
`node scripts/build-taxonomy-icons.mjs --fetch` from the repository root.

## Licence

MIT
