#!/usr/bin/env node
/**
 * Cross-platform variant parity report.
 *
 * `check-completion.ts` proves that a file exists. This script looks inside the
 * files and compares the variant surface each platform actually exposes:
 *
 *   React    cva `variants: { axis: { value } }` blocks and union-typed props
 *   SwiftUI  `public enum Kozmos<Component><Axis> { case value }`
 *   Compose  `enum class Kozmos<Component><Axis> { Value }`
 *   Figma    `expectedVariantAxesForComponentSetName` in the importer plugin
 *
 * React is treated as the reference surface because it is the only platform at
 * 97/97 with stories and tests. A gap therefore means "this axis or value is in
 * React but the other platform cannot express it".
 *
 * Values are compared case-insensitively with separators stripped, so
 * `step-free`, `stepFree`, and `StepFree` are the same value.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REACT_DIR = path.join(ROOT, "packages/react/src/components");
const IOS_DIR = path.join(ROOT, "packages/ios/Sources/Components");
const ANDROID_DIR = path.join(
  ROOT,
  "packages/android/src/main/java/com/kozmos/components",
);
const VUE_INDEX = path.join(ROOT, "packages/vue/src/index.ts");
const PLUGIN = path.join(ROOT, "figma/foundations-importer/code.js");

// Axes that describe runtime behaviour rather than a visual variant. Native
// platforms express these as plain parameters, so a missing enum is not a gap.
const BEHAVIOURAL_AXES = new Set(["asChild", "type", "as"]);

// The same value spelled differently per platform. React uses CSS-ish short
// names, Figma uses designer-facing words, native follows Swift/Kotlin casing.
const VALUE_ALIASES = new Map(
  Object.entries({
    sm: "small",
    md: "medium",
    lg: "large",
    xl: "xlarge",
    xs: "xsmall",
    col: "column",
    horizontal: "row",
    vertical: "column",
    error: "destructive",
    danger: "destructive",
    // Heading rank: React numbers them, native enums prefix with H.
    h1: "1",
    h2: "2",
    h3: "3",
    h4: "4",
    h5: "5",
    h6: "6",
  }),
);

/**
 * Axis names that mean the same thing across platforms. An alias is only used
 * when React does not itself declare that name as a separate axis, so a
 * component with both `variant` and `status` is still compared strictly.
 */
const AXIS_ALIASES = {
  variant: ["status", "tone", "style"],
  tone: ["variant", "status"],
  direction: ["orientation"],
  orientation: ["direction"],
  placement: ["side", "position"],
};

/**
 * Axes deliberately not mirrored on a platform, with the reason. These are
 * decisions on record, not backlog. Keyed `Component.axis` -> platforms.
 */
const INTENTIONAL = {
  "Sidebar.variant": {
    figma: "Modelled as part of the Content axis: SIDEBAR_CONTENT is Basic, Sections, Tools, Rail, so the rail variant is expressible. A separate Variant axis would multiply the set without adding a state designers cannot already pick.",
  },
  "LocationPin.variant": {
    figma: "Colour role is a token override in Figma, not a variant. Crossing 4 colours with the 5 State variants would produce 20+ variants for a marker whose colour is usually themed per venue.",
  },
  "LocationPin.labelPlacement": {
    figma: "Label placement is a layout concern owned by the map renderer, which positions the marker and its label against collision boxes.",
  },
  "FloatingActionButton.placement": {
    figma: "Positioning is the parent's job on native: a FAB is placed by a ZStack alignment or Scaffold's floatingActionButton slot, not by a variant on the button. The React values are CSS position classes with no visual difference.",
    ios: "Positioning is the parent's job on native: a FAB is placed by a ZStack alignment or Scaffold's floatingActionButton slot, not by a variant on the button. The React values are CSS position classes with no visual difference.",
    android: "Positioning is the parent's job on native: a FAB is placed by a ZStack alignment or Scaffold's floatingActionButton slot, not by a variant on the button. The React values are CSS position classes with no visual difference.",
  },
  "SearchBar.variant": {
    ios: "Pure CSS positioning. The React implementation itself notes that floating coordinates are delegated to the MapOverlay container, so on native the parent owns placement and the axis carries no visual difference.",
    android: "Pure CSS positioning. The React implementation itself notes that floating coordinates are delegated to the MapOverlay container, so on native the parent owns placement and the axis carries no visual difference.",
  },
  "MapOverlay.width": {
    ios: "Overlay sizing is a container concern on native: the host lays the overlay out with frame/width modifiers and Kozmos spacing tokens rather than a fixed t-shirt scale.",
    android: "Overlay sizing is a container concern on native: the host lays the overlay out with frame/width modifiers and Kozmos spacing tokens rather than a fixed t-shirt scale.",
  },
  "ScrollArea.snap": {
    figma: "Scroll snapping needs a different container on native, not a flag: Compose requires a Lazy list with rememberSnapFlingBehavior, and SwiftUI paging is iOS 17+ while the package targets iOS 16. An enum here would be a no-op on both platforms.",
    ios: "Scroll snapping needs a different container on native, not a flag: Compose requires a Lazy list with rememberSnapFlingBehavior, and SwiftUI paging is iOS 17+ while the package targets iOS 16. An enum here would be a no-op on both platforms.",
    android: "Scroll snapping needs a different container on native, not a flag: Compose requires a Lazy list with rememberSnapFlingBehavior, and SwiftUI paging is iOS 17+ while the package targets iOS 16. An enum here would be a no-op on both platforms.",
  },
  "Stack.align": {
    figma: "Alignment stays a product-code choice to avoid variant explosion (plugin README).",
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Stack.justify": {
    figma: "Justification stays a product-code choice to avoid variant explosion (plugin README).",
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Stack.wrap": {
    figma: "Wrapping stays a product-code choice to avoid variant explosion (plugin README).",
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Stack.gap": {
    figma: "The Figma set is documented as canonical Gap 2/4/6 examples, not the full scale (plugin README). Spacing comes from Kozmos variables rather than one variant per step, consistent with the Stack/Grid layout decision.",
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Stack.direction": {
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    figma: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.align": {
    figma: "Alignment stays a product-code choice to avoid variant explosion (plugin README).",
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.justify": {
    figma: "Justification stays a product-code choice to avoid variant explosion (plugin README).",
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.flow": {
    figma: "Dense placement and flow stay in product code (plugin README).",
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.cols": {
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    figma: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.rows": {
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    figma: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.gap": {
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    figma: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.xGap": {
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    figma: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Grid.yGap": {
    ios: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    android: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
    figma: "Layout stays a platform primitive: native uses VStack/HStack/Row/Column and LazyVerticalGrid with KozmosDimensions spacing. Mirroring CSS axes would import Tailwind's numeric gap scale and web 12-column semantics into Swift/Kotlin, and wrap/baseline/reverse cannot be expressed faithfully as container parameters.",
  },
  "Text.size": {
    ios: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    android: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    figma: "Text is a typography token/style, not a Figma component set (STATUS.md).",
  },
  "Text.weight": {
    ios: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    android: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    figma: "Text is a typography token/style, not a Figma component set (STATUS.md).",
  },
  "Text.align": {
    ios: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    android: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    figma: "Text is a typography token/style, not a Figma component set (STATUS.md).",
  },
  "Text.color": {
    ios: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    android: "Typography stays a platform primitive: native uses .font()/MaterialTheme.typography with Kozmos type tokens and text styles, not component variants. Same reasoning as Stack and Grid.",
    figma: "Text is a typography token/style, not a Figma component set (STATUS.md).",
  },
};

const normalizeRaw = (value) =>
  String(value).toLowerCase().replace(/[-_\s]/g, "");

const normalize = (value) => {
  const raw = normalizeRaw(value);
  return VALUE_ALIASES.get(raw) || raw;
};

/** A prop whose only values are booleans is not a variant axis. */
const isBooleanAxis = (values) =>
  values.length > 0 &&
  values.every((value) => value === "true" || value === "false");

function readDirSafe(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true })
    : [];
}

function componentNames() {
  return readDirSafe(REACT_DIR)
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

/**
 * Object keys at exactly depth 1 of a balanced `{...}` block.
 *
 * The offsets must be anchored: scanning every character would also match the
 * suffixes of a key ("default" would yield default, efault, fault, ...).
 */
function depthOneKeys(block) {
  const keys = [];
  let depth = 0;
  let anchored = false;

  for (let index = 0; index < block.length; index += 1) {
    const char = block[index];

    if (char === "{") {
      depth += 1;
      anchored = depth === 1;
      continue;
    }
    if (char === "}") {
      depth -= 1;
      anchored = false;
      continue;
    }
    if (char === ",") {
      anchored = depth === 1;
      continue;
    }
    if (/\s/.test(char)) continue;

    if (depth === 1 && anchored) {
      // Numeric keys are legitimate cva values (Grid `cols: { 1: …, 12: … }`).
      const match = block
        .slice(index)
        .match(/^["']?([a-zA-Z0-9][a-zA-Z0-9-]*)["']?\s*:/);
      if (match) keys.push({ name: match[1], index });
    }
    anchored = false;
  }

  return keys;
}

/** Balanced-brace slice starting at the `{` at or after `from`. */
function braceBlock(source, from) {
  const start = source.indexOf("{", from);
  if (start === -1) return null;
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  return null;
}

function reactAxes(component) {
  const file = readIfExists(path.join(REACT_DIR, component, `${component}.tsx`));
  if (!file) return null;

  const axes = {};

  // 1. class-variance-authority blocks.
  let cursor = file.indexOf("variants:");
  while (cursor !== -1) {
    const block = braceBlock(file, cursor);
    if (block) {
      for (const axis of depthOneKeys(block)) {
        const axisBlock = braceBlock(block, axis.index);
        if (!axisBlock) continue;
        // Skip `defaultVariants: { variant: "default" }` — its values are
        // strings, not nested blocks, so it yields no depth-1 keys of its own.
        const values = depthOneKeys(axisBlock).map((key) => key.name);
        if (values.length) {
          axes[axis.name] = [
            ...new Set([...(axes[axis.name] || []), ...values]),
          ];
        }
      }
    }
    cursor = file.indexOf("variants:", cursor + 1);
  }

  // 2. Union-typed props on the exported Props interface.
  const propsMatch = file.match(
    new RegExp(`export interface ${component}Props[\\s\\S]*?\\n\\}`),
  );
  if (propsMatch) {
    for (const match of propsMatch[0].matchAll(
      /^\s+([a-zA-Z][a-zA-Z0-9]*)\??:\s*((?:"[^"]+"\s*\|\s*)+"[^"]+")\s*;/gm,
    )) {
      const axis = match[1];
      const values = [...match[2].matchAll(/"([^"]+)"/g)].map((v) => v[1]);
      if (values.length > 1) {
        axes[axis] = [...new Set([...(axes[axis] || []), ...values])];
      }
    }
  }

  return axes;
}

/** Native enums are named Kozmos<Component><Axis>. */
/**
 * Enums deliberately named for a shared family rather than one component.
 * Keyed `Component.axis` -> the enum's bare name.
 */
const ENUM_NAME_ALIASES = {
  "AdaptiveMapShell.panelPlacement": "MapPanelPlacement",
};

function nativeAxes(component, files, enumPattern, language) {
  const axes = {};
  let found = false;

  for (const file of files) {
    const source = readIfExists(file);
    if (source === null) continue;
    found = true;

    for (const match of source.matchAll(enumPattern)) {
      const enumName = match[1];
      const bare = enumName.replace(/^Kozmos/, "");

      // Two naming shapes are in use: a top-level `KozmosButtonVariant`, and an
      // enum nested inside the component struct as plain `Presentation`.
      let axis;
      if (bare.toLowerCase().startsWith(component.toLowerCase())) {
        axis = bare.slice(component.length);
      } else if (!/^Kozmos/.test(enumName)) {
        axis = bare;
      } else {
        const aliased = Object.entries(ENUM_NAME_ALIASES).find(
          ([key, value]) =>
            key.startsWith(`${component}.`) && value === bare,
        );
        if (aliased) axis = aliased[0].split(".")[1];
      }
      if (!axis) continue;

      const block = braceBlock(source, match.index + match[0].length - 1);
      if (!block) continue;

      const values = enumBodyValues(block, language);
      if (values.length) {
        axes[axis] = [...new Set([...(axes[axis] || []), ...values])];
      }
    }
  }

  return found ? axes : null;
}


/**
 * Values declared in a Swift or Kotlin enum body.
 *
 * A line-anchored regex is not enough: both languages allow several entries on
 * one line (`Default, Info, Success` in Kotlin, `case a, b` in Swift), and
 * Kotlin entries may carry constructor arguments (`Quickest("quickest")`).
 */
function enumBodyValues(block, language) {
  let body = block.slice(1, -1);

  // Kotlin separates entries from members with `;`; Swift declares members
  // after the cases, so cut at the first `func`/`var`/`init`.
  if (language === "kotlin") {
    const semicolon = body.indexOf(";");
    if (semicolon !== -1) body = body.slice(0, semicolon);
  }

  const values = [];

  if (language === "swift") {
    for (const match of body.matchAll(/\bcase\s+([^\n]+)/g)) {
      for (const part of splitTopLevel(match[1])) {
        const name = part.trim().replace(/^`|`$/g, "").match(/^([a-zA-Z][a-zA-Z0-9]*)/);
        if (name) values.push(name[1]);
      }
    }
    return values;
  }

  for (const part of splitTopLevel(body)) {
    const cleaned = part.trim();
    if (!cleaned) continue;
    // Stop at the first non-entry member (a nested declaration or annotation).
    if (/^(companion|fun|val|var|override|@|\/\/)/.test(cleaned)) continue;
    const name = cleaned.match(/^([A-Z][A-Za-z0-9_]*)/);
    if (name) values.push(name[1]);
  }

  return values;
}

/** Split on commas that are not inside (), [], {}, or a string. */
function splitTopLevel(text) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let current = "";

  for (const char of text) {
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if ("([{".includes(char)) depth += 1;
    if (")]}".includes(char)) depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  parts.push(current);
  return parts;
}


/**
 * Every enum declared anywhere in a native package, keyed by name.
 *
 * A component often types an axis with an enum owned by another component —
 * MapControlsGroup takes a `KozmosMapControlButtonPresentation`. Scanning only
 * the component's own declarations reports those axes as missing.
 */
function collectPackageEnums(rootDir, extension, enumPattern, language) {
  const enums = {};

  const walk = (dir) => {
    for (const entry of readDirSafe(dir)) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(extension)) continue;
      const source = readIfExists(full);
      if (source === null) continue;
      for (const match of source.matchAll(enumPattern)) {
        const block = braceBlock(source, match.index + match[0].length - 1);
        if (!block) continue;
        const values = enumBodyValues(block, language);
        if (values.length) enums[match[1]] = values;
      }
    }
  };

  walk(rootDir);
  return enums;
}

/** Axes typed by an enum in the component's declaration, e.g. `size: KozmosXSize`. */
function axesFromParameters(files, packageEnums) {
  const axes = {};

  for (const file of files) {
    const source = readIfExists(file);
    if (source === null) continue;
    for (const match of source.matchAll(
      /\b([a-z][a-zA-Z0-9]*)\s*:\s*(Kozmos[A-Za-z0-9]+)/g,
    )) {
      const values = packageEnums[match[2]];
      if (values) axes[match[1]] = values;
    }
  }

  return axes;
}

function iosAxes(component) {
  const dir = path.join(IOS_DIR, component);
  const files = readDirSafe(dir)
    .filter((entry) => entry.name.endsWith(".swift"))
    .map((entry) => path.join(dir, entry.name));
  if (!files.length) return null;
  const declared = nativeAxes(
    component,
    files,
    /public enum ([A-Za-z0-9]+)[^{]*\{/g,
    "swift",
  );
  const packageEnums = collectPackageEnums(
    IOS_DIR,
    ".swift",
    /public enum (Kozmos[A-Za-z0-9]+)[^{]*\{/g,
    "swift",
  );
  return { ...axesFromParameters(files, packageEnums), ...declared };
}

function androidAxes(component) {
  const dir = path.join(ANDROID_DIR, component);
  const files = readDirSafe(dir)
    .filter((entry) => entry.name.endsWith(".kt"))
    .map((entry) => path.join(dir, entry.name));
  if (!files.length) return null;
  const declared = nativeAxes(
    component,
    files,
    /enum class ([A-Za-z0-9]+)[^{]*\{/g,
    "kotlin",
  );
  const packageEnums = collectPackageEnums(
    ANDROID_DIR,
    ".kt",
    /enum class (Kozmos[A-Za-z0-9]+)[^{]*\{/g,
    "kotlin",
  );
  return { ...axesFromParameters(files, packageEnums), ...declared };
}

function figmaAxes() {
  const source = readIfExists(PLUGIN);
  if (!source) return {};

  const arrays = {};
  for (const match of source.matchAll(
    /^const ([A-Z0-9_]+) = \[([^\]]*)\];/gm,
  )) {
    arrays[match[1]] = [...match[2].matchAll(/"([^"]+)"/g)].map((v) => v[1]);
  }

  const start = source.indexOf(
    "function expectedVariantAxesForComponentSetName(",
  );
  if (start === -1) return {};
  const region = source.slice(start, start + 40000);

  const byComponent = {};
  for (const match of region.matchAll(
    /canonicalName === "([A-Za-z]+)"\)\s*\{\s*return \{([\s\S]*?)\};/g,
  )) {
    const component = match[1];
    const axes = {};
    for (const axisMatch of match[2].matchAll(
      /([A-Za-z]+):\s*([A-Z0-9_]+)/g,
    )) {
      const values = arrays[axisMatch[2]];
      if (values && values.length) axes[axisMatch[1]] = values;
    }
    if (Object.keys(axes).length) byComponent[component] = axes;
  }

  return byComponent;
}

function compareAxes(component, platform, reference, target) {
  const missingAxes = [];
  const missingValues = [];
  const booleanProps = [];
  const intentional = [];

  for (const [axis, values] of Object.entries(reference)) {
    if (BEHAVIOURAL_AXES.has(axis)) continue;

    if (isBooleanAxis(values)) {
      booleanProps.push(axis);
      continue;
    }

    const decision = INTENTIONAL[`${component}.${axis}`];
    if (decision && decision[platform]) {
      intentional.push(`${axis}: ${decision[platform]}`);
      continue;
    }

    const aliases = (AXIS_ALIASES[normalizeRaw(axis)] || []).filter(
      (alias) =>
        !Object.keys(reference).some(
          (other) => normalizeRaw(other) === normalizeRaw(alias),
        ),
    );
    const acceptable = [axis, ...aliases].map(normalizeRaw);

    const targetAxis = Object.keys(target).find((candidate) =>
      acceptable.includes(normalizeRaw(candidate)),
    );

    if (!targetAxis) {
      missingAxes.push(`${axis} (${values.join(", ")})`);
      continue;
    }

    const renamed =
      normalizeRaw(targetAxis) !== normalizeRaw(axis)
        ? ` [named "${targetAxis}" here]`
        : "";
    const targetValues = target[targetAxis].map(normalize);
    const absent = values.filter((v) => !targetValues.includes(normalize(v)));
    if (absent.length) {
      missingValues.push(`${axis}${renamed}: ${absent.join(", ")}`);
    }
  }

  // Axes the platform exposes that React does not — usually a Figma-only
  // composition axis (Dialog Content, Drawer Side) rather than a defect.
  const extraAxes = Object.keys(target).filter(
    (candidate) =>
      !Object.keys(reference).some(
        (axis) => normalize(axis) === normalize(candidate),
      ),
  );

  return { missingAxes, missingValues, booleanProps, intentional, extraAxes };
}

function main() {
  const figma = figmaAxes();
  // Vue has no per-component directories: every component is re-exported from
  // index.ts through `createVueWrapper(ReactComponent)`. Counting directories
  // reports 3/98 and is simply wrong.
  const vueIndex = readIfExists(VUE_INDEX) || "";
  // A directory does not always export a component of the same name: the Radio
  // directory exports RadioGroup and RadioGroupItem.
  const VUE_DIRECTORY_ALIASES = { radio: "radiogroup" };

  const vueComponents = new Set(
    [
      ...vueIndex.matchAll(
        /export const Kozmos([A-Za-z0-9]+)\s*=\s*\n?\s*createVueWrapper/g,
      ),
    ].map((match) => match[1].toLowerCase()),
  );

  const rows = [];

  for (const component of componentNames()) {
    const react = reactAxes(component);
    if (react === null) continue;

    const ios = iosAxes(component);
    const android = androidAxes(component);
    const figmaComponent = figma[component] || null;

    rows.push({
      component,
      react,
      reactAxisCount: Object.keys(react).length,
      ios: ios === null ? "missing" : compareAxes(component, "ios", react, ios),
      android:
        android === null
          ? "missing"
          : compareAxes(component, "android", react, android),
      figma:
        figmaComponent === null
          ? "missing"
          : compareAxes(component, "figma", react, figmaComponent),
      vue: vueComponents.has(
        VUE_DIRECTORY_ALIASES[component.toLowerCase()] ||
          component.toLowerCase(),
      ),
    });
  }

  const json = process.argv.includes("--json");
  if (json) {
    process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
    return;
  }

  const withVariants = rows.filter((row) => row.reactAxisCount > 0);
  const report = [];

  for (const row of withVariants) {
    const problems = [];
    for (const platform of ["ios", "android", "figma"]) {
      const result = row[platform];
      if (result === "missing") {
        problems.push(`${platform}: component/set absent`);
        continue;
      }
      if (result.missingAxes.length) {
        problems.push(`${platform} missing axes -> ${result.missingAxes.join("; ")}`);
      }
      if (result.missingValues.length) {
        problems.push(
          `${platform} missing values -> ${result.missingValues.join("; ")}`,
        );
      }
    }
    if (!row.vue) problems.push("vue: component absent");
    if (problems.length) report.push({ component: row.component, problems });
  }

  console.log("Variant parity vs React\n");
  console.log(`Components scanned:            ${rows.length}`);
  console.log(`Components declaring variants: ${withVariants.length}`);
  console.log(`Components with gaps:          ${report.length}\n`);

  for (const entry of report) {
    console.log(entry.component);
    for (const problem of entry.problems) console.log(`  - ${problem}`);
  }

  const totals = { ios: 0, android: 0, figma: 0, vue: 0 };
  for (const row of withVariants) {
    for (const platform of ["ios", "android", "figma"]) {
      const result = row[platform];
      if (
        result === "missing" ||
        result.missingAxes.length ||
        result.missingValues.length
      ) {
        totals[platform] += 1;
      }
    }
    if (!row.vue) totals.vue += 1;
  }

  console.log("\nComponents with variant gaps by platform:");
  for (const [platform, count] of Object.entries(totals)) {
    console.log(`  ${platform.padEnd(8)} ${count}/${withVariants.length}`);
  }

  // Figma composition axes with no React prop. These are usually anatomy
  // choices (Dialog Content, Drawer Side) rather than defects, but they are the
  // variations a designer can pick that code cannot currently name.
  const figmaOnly = rows
    .filter((row) => row.figma !== "missing" && row.figma.extraAxes.length)
    .map((row) => ({ component: row.component, axes: row.figma.extraAxes }));

  console.log(
    `\nFigma axes with no React prop (${figmaOnly.length} components):`,
  );
  for (const entry of figmaOnly) {
    console.log(`  ${entry.component}: ${entry.axes.join(", ")}`);
  }

  const noVariants = rows.filter((row) => row.reactAxisCount === 0);
  console.log(
    `\nComponents with no React variant axis at all: ${noVariants.length}/${rows.length}`,
  );
  console.log(
    "  (their variations are compositional and only expressed in Figma)",
  );

  const iosMissing = rows.filter((row) => row.ios === "missing").length;
  const androidMissing = rows.filter((row) => row.android === "missing").length;
  const figmaMissing = rows.filter((row) => row.figma === "missing").length;
  const vueMissing = rows.filter((row) => !row.vue).length;

  console.log("\nComponents absent entirely by platform:");
  console.log(`  ios      ${iosMissing}/${rows.length}`);
  console.log(`  android  ${androidMissing}/${rows.length}`);
  console.log(`  figma    ${figmaMissing}/${rows.length}`);
  console.log(`  vue      ${vueMissing}/${rows.length}`);
}

main();
