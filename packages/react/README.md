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

## Adaptive map hosts

`AdaptiveMapShell` uses its container's dimensions, supports logical RTL panel
placement, and accepts host-supplied hinge-free `usableRegions`. Give it a definite
height, or a bounded parent for its default `height: 100%`; it no longer enforces
a 448px minimum. `panelPresentation` overrides the automatic side/bottom layout,
and `panelFraction` controls bottom-panel height.

`onLayoutChange` receives shell-local renderer/panel bounds and occlusion rectangles,
plus physical camera padding relative to the renderer bounds. The shell does not own
the map engine: the host adapter applies renderer resizing and camera padding.
`onCollisionInsetsChange` and `--kozmos-map-inset-*` expose the resolved padding too.

Pass keyboard overlap through `safeAreaInsets` only if it has not already resized the
host. `usableRegions` is a layout input, not automatic device detection; refresh it
when the host or posture changes. Keep slot component identities and keys stable to
preserve state and the renderer instance across those changes.

```tsx
import type { ReactNode } from "react";
import { AdaptiveMapShell } from "@kozmos/react";
import type { AdaptiveMapLayoutSnapshot } from "@kozmos/react";

export function MapHost({
  renderer,
  details,
  updateRenderer,
}: {
  renderer: ReactNode;
  details: ReactNode;
  updateRenderer: (layout: AdaptiveMapLayoutSnapshot) => void;
}) {
  return (
    <AdaptiveMapShell
      style={{ height: "100dvh" }}
      map={renderer}
      panel={details}
      onLayoutChange={updateRenderer}
    />
  );
}
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
