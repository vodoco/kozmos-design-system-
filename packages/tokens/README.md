# @kozmos/tokens

The Kozmos design tokens, generated from one source for the web, iOS and
Android.

## Install

```sh
npm install @kozmos/tokens
```

## CSS

```css
@import "@kozmos/tokens/css/light.css";
@import "@kozmos/tokens/css/dark.css";
```

The light file defines every variable on `:root`; the dark file redefines them
under `[data-theme="dark"]`, so setting that attribute on `<html>` switches the
theme.

```css
.panel {
  background: var(--primitives-colors-background-0);
  border-radius: calc(var(--semantics-radius-container) * 1px);
}
```

Radius values are unitless numbers, so that the web, iOS and Android read one
scale — hence the `calc`. The files are also reachable by their built paths,
such as `@kozmos/tokens/dist/css/variables-light.css`.

## JavaScript

```ts
import {
  PrimitivesColorsTheme500,
  SemanticsRadiusControl,
} from "@kozmos/tokens";

PrimitivesColorsTheme500; // "#135bec"
SemanticsRadiusControl; // 16
```

Every token is a named export, as ES module or CommonJS. **These are the light
theme's values** — the module has no dark counterpart; use the CSS variables
where the theme can change.

## Swift and Kotlin

Generated sources ship under `dist/ios` and `dist/android`. The Kozmos iOS and
Android packages are built from these same files.

## Licence

MIT
