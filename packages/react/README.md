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

Import the stylesheet once and put a `ThemeProvider` around each module (or the whole app):

```ts
import "@kozmos/react/style.css";
```

It holds the token variables for both themes and the styles the components
use, so there is no Tailwind configuration to add. `@kozmos/react/dist/style.css`
resolves to the same file, for code that already imports that path.

Tokens, utilities and the component reset are scoped to provider boundaries.
Unrelated host content is not reset. This build requires native CSS `@scope`,
including nested scopes with `:scope`; the production browser/WebView support
matrix must be approved and tested before release. Unsupported browsers receive
no component styles, not a legacy fallback.

For an application that deliberately wants Tailwind's **global** reset, optionally
import `@kozmos/react/reset.css` before its own host styles. It is never imported
automatically. Do not also import the token package's global CSS into an embedded
module. Ordinary host resets/utilities are covered; this is not Shadow DOM isolation
against arbitrary high-specificity or `!important` host rules. `rem` units still
follow the host document's root font size.

## Use

```tsx
import { Button, Icon, ThemeProvider } from "@kozmos/react";

export function SaveButton() {
  return (
    <ThemeProvider defaultTheme="light">
      <Button emotion="success">
        <Icon name="check" />
        Save
      </Button>
    </ThemeProvider>
  );
}
```

`emotion` is one of `themed`, `neutral`, `success`, `danger`, `informative` or
`alert`.

## Dark mode

`ThemeProvider` owns its DOM scope, never `<html>`. Sibling and nested providers
can use different themes. It follows live system changes by default. Persistence
is opt-in: supply a product-owned `storageKey`; the old `vite-ui-theme` default
is no longer read or written. Storage errors do not disable theme changes.

```tsx
import { ThemeProvider } from "@kozmos/react";

<ThemeProvider defaultTheme="system">{app}</ThemeProvider>;
```

Use `theme` and `onThemeChange` for controlled state; the caller then owns persistence.
`useTheme()` returns `theme`, `resolvedTheme` and `setTheme`. SSR and first hydration
use `defaultTheme` with `defaultSystemTheme="light"` as the system fallback, then
restore storage/system preferences after mount. An initial colour change is possible;
provide a server-known controlled theme to avoid it.

Set `dir="rtl"` on the provider to configure CSS and Radix keyboard navigation.
Nested providers inherit direction; an outer provider defaults to LTR. Supply
CSS-variable overrides through `tokens={{ "--your-variable": "value" }}` so they
follow overlays too. Unrelated ancestor inline styles/fonts are not copied into
portals.

## Runtime design configuration

For the experimental glass controls, use `DesignConfigProvider`. It includes the
same scoped ThemeProvider and owned portals; `KozmosTheme` is now a compatibility
name for this implementation, not a separate token injector.

```tsx
import type { ReactNode } from "react";
import { DesignConfigProvider } from "@kozmos/react";

export function GlassModule({ children }: { children: ReactNode }) {
  return (
    <DesignConfigProvider
      defaultTheme="light"
      initialConfig={{ glass: { frost: 20 }, noise: false }}
    >
      {children}
    </DesignConfigProvider>
  );
}
```

Use `initialConfig` for uncontrolled defaults or `config`/`onConfigChange` for
controlled values. Partial `glass` and `accessibility` inputs are deeply merged and
validated. Persistence is opt-in through `persistKey` and ignored for controlled
configuration. A surrounding ThemeProvider's preference is inherited unless this
provider explicitly sets `theme`, `defaultTheme` or a theme `storageKey`.

`tokens` are declarative: updates and removed keys apply to content and owned
overlays. Legacy primitive shorthand (`colors-background-0`) still expands to
`--primitives-colors-background-0`; full CSS-variable names are preferred.
`injectRuntimeTokens` is deprecated; it merges overrides, with an empty value
removing a key. Declarative tokens take precedence.

Noise is confined to glass backgrounds, never a fixed page overlay. SVG effect IDs
are instance-owned; pointer effects use the hovered surface, including in portals.
For multiple independently hydrated React roots, supply distinct React
`identifierPrefix` values consistently on server and client.

Migration: old `KozmosTheme config={...}` now means **controlled** configuration;
use `initialConfig` if descendants should change it without a callback. The implicit
`kozmos-design-config` storage key is no longer used. `preset` and `splay` have no
rendered effect and are deprecated. `roundness`/`shadow` affect legacy aliases only,
not semantic radius/elevation roles; customize those tokens directly. These effects
are not a cross-platform styling contract or a complete reduced-motion policy.

## Adaptive map hosts

`AdaptiveMapShell` uses its container's dimensions, supports logical RTL panel
placement, and accepts host-supplied hinge-free `usableRegions`. Give it a definite
height, or a bounded parent for its default `height: 100%`; it no longer enforces
a 448px minimum. `panelPresentation` overrides the automatic side/bottom layout,
and `panelFraction` requests bottom-panel height. The resolved height can be reduced
to reserve space for measured map controls; read the actual bounds from the callback.

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

## Overlay ownership

`PopoverContent`, `DialogContent`, `DrawerContent`, `BottomSheetContent`,
`MenuContent`, `SelectContent` and `TooltipContent` accept `portalContainer`.
Omit it for automatic ownership: the closest ThemeProvider supplies a stable
body-level root carrying its theme, token overrides and direction. This escapes
clipped/transformed module ancestors. Explicit destinations opt out of that CSS
inheritance and must sit inside an appropriate styled Kozmos scope. Keep them
stable while an overlay is open.

```tsx
import { Button, Popover, PopoverTrigger, PopoverContent } from "@kozmos/react";

export function HelpPopover({ overlayLayer }: { overlayLayer: HTMLElement }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Help</Button>
      </PopoverTrigger>
      <PopoverContent portalContainer={overlayLayer}>
        Help content
      </PopoverContent>
    </Popover>
  );
}
```

Without a provider, legacy placement remains document body for portalled components
and inline for Tooltip, but styles now require a Kozmos scope. Explicit `null` uses
the body and bypasses the owned theme scope. Wait for a custom target to exist before
opening content. An explicit Radix Root `dir` overrides the provider's direction.

This does **not** scope modal focus trapping, outside-content hiding or scroll locking
to one widget: modal behavior remains document-wide. Toast and MenuSubContent remain
inline unless composed with an explicit exported portal; inline content inherits its
nearest DOM scope.

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
