# @kozmos/react

React components for the Kozmos design system — core controls, plus map, POI
and wayfinding compositions — styled entirely from Kozmos tokens.

## Install

```sh
npm install @kozmos/react react react-dom
```

React 18 and 19 are both supported. `@kozmos/tokens`, `@kozmos/icons` and
`@kozmos/product-contracts` are installed with it.

## Set up

Import the stylesheet once, at the root of the app:

```ts
import "@kozmos/react/style.css";
```

It holds the token variables for both themes and the styles the components
use, so there is no Tailwind configuration to add. `@kozmos/react/dist/style.css`
resolves to the same file, for code that already imports that path.

**It also includes a global CSS reset** (Tailwind's preflight): `body` loses its
margin, headings inherit their size and weight, and images and SVGs become
block-level. The components depend on it. In an app that has its own base
styles, import Kozmos before them so they win, and check headings and images
after adding it.

## Use

```tsx
import { Button, Icon } from "@kozmos/react";

export function SaveButton() {
  return (
    <Button emotion="success">
      <Icon name="check" />
      Save
    </Button>
  );
}
```

`emotion` is one of `themed`, `neutral`, `success`, `danger`, `informative` or
`alert`.

## Dark mode

Light is the default. Set `data-theme="dark"` on `<html>`, or on any ancestor,
and the variables — and every component — follow.

`ThemeProvider` manages that attribute. It follows the system preference unless
a theme is chosen, and remembers the choice in `localStorage` under
`storageKey`:

```tsx
import { ThemeProvider } from "@kozmos/react";

<ThemeProvider defaultTheme="system">{app}</ThemeProvider>;
```

## Analytics

Components report interactions, such as a toggle being pressed. With no
provider those events are dropped, and a warning is logged once. To receive
them, in batches:

```tsx
import { AnalyticsProvider } from "@kozmos/react";

<AnalyticsProvider onDispatch={(events) => send(events)}>
  {app}
</AnalyticsProvider>;
```

Events are flushed every 2000ms unless `batchDelayMs` says otherwise.

## Licence

MIT
