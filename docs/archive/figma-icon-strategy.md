# Figma Icon Strategy

Last checked: 2026-05-18

## Recommendation

Use the existing Pointr Icon Library as the artwork source, but build a curated Kozmos icon source set inside `Kozmos DS - Core Library`.

The design system should own icon usage contracts, not the full icon catalogue:

- `Icon` defines sizes, colors, accessibility expectations, and Code Connect examples.
- `IconButton`, `Button`, inputs, menu items, navigation, and cards expose icon slots with instance-swap properties where Figma supports them.
- Pointr Icon Library remains the upstream source library for symbol artwork.
- `Kozmos DS - Core Library` owns a curated local icon source layer for icons used by components.
- `@kozmos/icons` owns the code-facing icon names and curated registry used by React components.

Source library:

- File: Pointr Icon Library
- File key: `PpbQbvpNTMvwqCx9dD4efJ`
- Line icon root: `181:128951`
- Initial inspected icon count: 1,176 published icon components across 19 categories

## Why Not Rebuild Every Icon Now

The codebase uses `lucide-react` for React icon rendering, and the local `@kozmos/icons` package now provides a curated Pointr-name registry over that rendering layer. Rebuilding all 1,176 icons into the Kozmos core Figma file would slow component work and create ownership ambiguity.

The risk is duplication: if Kozmos Core contains copies of the full Pointr icon set, designers can accidentally edit the wrong icon set or drift from the source library.

## What To Do Now

Do a light integration pass before icon-consuming components:

1. Ensure the Pointr Icon Library is available to `Kozmos DS - Core Library`.
2. Keep `docs/figma-pointr-icon-catalog.json` current with `pnpm figma:icons`.
3. Use the plugin's `Build Icons` / `Update Icons` actions to create the curated local `Icon / ...` source set.
4. Keep `Icon / Slot Default` as the single local fallback for icon-consuming components before the curated set exists.
5. Set Button and IconButton `Icon` slots to prefer the curated local `Icon / ...` source components.

## Current Implementation

The local Figma plugin creates one lightweight `Icon / Slot Default` component on the `Utilities` page and a curated source set on the `Icons` page. The curated set mirrors the 38 names in `@kozmos/icons`, imports Pointr source components by component key, and names local components as `Icon / search-md`, `Icon / x-close`, etc. Each local icon is a 24px viewbox whose nested `Pointr Source` is stretched Left+Right and Top+Bottom, so component slots can resize icons without clipping or fixed-size overflow.

Button and IconButton instances use a single `Icon` instance-swap property rendered as a direct icon instance. The plugin applies the consuming component's foreground token to tintable fill/stroke layers on the icon instance. This keeps the layer model simple while still allowing the Button/IconButton variant to own the visible foreground color.

The plugin should not generate a separate fallback component for every icon color token, icon size, or color context. If older `Icon / Slot / ...` fallback components exist, the updater removes them after rebinding Button and IconButton.

In code, `@kozmos/icons` exposes:

- `kozmosIconDefinitions`
- `kozmosIconNames`
- `kozmosIconRegistry`
- `getIconComponent(name)`
- `getIconDefinition(name)`

React `Icon` now supports both forms:

```tsx
<Icon name="search-md" />
<Icon icon={Search} />
```

## Component Rules

- Use icons as nested instances, not as variant axes.
- Prefer an `Icon` or `Leading icon` / `Trailing icon` instance-swap property.
- Prefer direct fill/stroke overrides on generated icon slots. Use a mask wrapper only if a source icon cannot preserve color overrides through instance swapping.
- Curated icon source components must keep their nested `Pointr Source` at `x=0`, `y=0`, full 24px size, and Left+Right / Top+Bottom constraints.
- Keep icon size controlled by the consuming component, not by arbitrary icon artwork size.
- Do not create a Button variant per icon.
- Decorative icons should be hidden from assistive tech in code.
- Informative icons need an accessible label or adjacent text.

## Code Connect Implication

React can receive icons as either a registry `name` or a raw Lucide component. Figma should expose icon slots, while Code Connect examples can show a representative registry icon. The icon artwork itself does not need one Code Connect file per symbol unless we decide to publish every Pointr icon as a first-class generated React component later.

## Later Work

If the Pointr Icon Library becomes unstable or hard to govern, promote a curated subset into `Kozmos DS - Core Library`:

- Navigation/action icons
- Status icons
- Map/domain icons
- Product-specific glyphs

Until then, keep Pointr Icon Library as a separate source library and consume it from Kozmos components.
