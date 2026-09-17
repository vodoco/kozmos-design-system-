# @kozmos/icons

Icon components and the name registry for the Kozmos design system.

## Install

```sh
npm install @kozmos/icons react lucide-react
```

`lucide-react` is a peer dependency: some Kozmos icons are drawn from it, and
the rest carry their own outlines.

## Use

Most apps reach icons through `@kozmos/react`, by name:

```tsx
import { Icon } from "@kozmos/react";

<Icon name="calendar" />;
```

Or directly:

```tsx
import { getIconComponent, resolveIconName } from "@kozmos/icons";

const Calendar = getIconComponent("calendar");
resolveIconName("back"); // "arrow-left"
```

Names are stable keys such as `arrow-left`, `bell-01` and `calendar`.
`kozmosIconNames` lists every one, and `resolveIconName` turns an alias — `add`,
`back`, `close`, `delete` — into its key. Icons with their own outlines are also
named exports, for example `import { Heart } from "@kozmos/icons"`.

## Licence

MIT
