# Pointr Icon Library Integration Report

Last checked: 2026-05-18

## What Was Found

The Pointr Icon Library is accessible with the current Figma token.

- File key: `PpbQbvpNTMvwqCx9dD4efJ`
- Line icon root: `181:128951`
- Published icon components: 1,176
- Categories: 19
- Catalogue output: `docs/figma-pointr-icon-catalog.json`

## Recommendation

Keep Pointr Icon Library as the artwork source and make Kozmos own the usage contract through a curated local icon source set.

This gives designers the full existing symbol library in Figma, while code uses stable names through `@kozmos/icons`. It avoids copying 1,176 icons into the core design-system file and keeps Button/IconButton variants from exploding into one variant per glyph.

The local plugin now builds the curated `@kozmos/icons` subset into `Kozmos DS - Core Library` as `Icon / ...` source components on the `Icons` page. These are source components for instance-swap slots; consuming components apply their foreground token through direct fill/stroke overrides on the icon instance. Each nested `Pointr Source` is constrained Left+Right and Top+Bottom inside a 24px local icon component to avoid clipping or fixed-size overflow when used at 14px, 16px, or 20px.

## Implementation

Added a repeatable catalogue command:

```bash
pnpm figma:icons
```

Added a curated code registry in `@kozmos/icons` using Pointr/Figma names:

```tsx
import { Icon } from "@kozmos/react";

<Icon name="search-md" />
<Icon name="marker-pin-01" />
<Icon name="x-close" />
```

The old API still works:

```tsx
import { Search } from "lucide-react";

<Icon icon={Search} />;
```

`@kozmos/icons` is publishable with public access, matching `@kozmos/tokens`. This matters because `@kozmos/react` now depends on it.

## Current Scope

The first code registry is intentionally curated, not all 1,176 icons. It covers common product and UI needs:

- Actions: `plus`, `minus`, `edit-01`, `trash-01`, `upload-01`, `download-01`
- Navigation: `arrow-left`, `arrow-right`, `chevron-left`, `chevron-right`, `menu-01`
- Status: `check`, `x-close`, `alert-circle`, `alert-triangle`, `info-circle`
- Product/map: `map-01`, `marker-pin-01`, `navigation-pointer-01`, `route`, `building-01`
- Utility: `search-md`, `settings-01`, `calendar`, `clock`, `lock-01`, `wifi`, `scan`, `qr-code-01`

## Next Decision

Do not generate all React SVG components yet. The better next step is to keep using the curated registry while building icon-consuming components such as `SearchBar`, `Input`, and `Menu`.

Generate exact SVG React components later only if visual parity with the Pointr icon artwork becomes more important than the current lucide-compatible implementation.
