import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isComponentName,
  laneOf,
  readDescription,
  readLaneSets,
  readSnippets,
  slugOf,
  typeText,
} from "./generate-reference.mjs";

test("slugs keep acronyms whole", () => {
  assert.equal(slugOf("Button"), "button");
  assert.equal(slugOf("AdaptiveMapShell"), "adaptive-map-shell");
  assert.equal(slugOf("POIDetailPanel"), "poi-detail-panel");
  assert.equal(slugOf("AISearchButton"), "ai-search-button");
  assert.equal(slugOf("OTPInput"), "otp-input");
  assert.equal(slugOf("POICard"), "poi-card");
});

test("lane sets are read from the status script's source", () => {
  const sets = readLaneSets(`
    const INTERNAL_COMPONENT_NAMES = new Set(["GlassSettingsPanel"]);
    const PRODUCT_SDK_COMPONENT_NAMES = new Set([
      "AdaptiveMapShell",
      "MapView",
    ]);
    const CODE_ONLY_UTILITY_COMPONENT_NAMES = new Set(["Text"]);
    const PLATFORM_FORM_FACTOR_COMPONENT_NAMES = new Set(["DynamicIsland"]);
  `);
  assert.equal(laneOf("MapView", sets), "product-sdk");
  assert.equal(laneOf("Text", sets), "code-only");
  assert.equal(laneOf("DynamicIsland", sets), "platform-form-factor");
  assert.equal(laneOf("Button", sets), "core");
  assert.throws(() => readLaneSets("nothing here"), /INTERNAL_COMPONENT_NAMES not found/);
});

test("the description is the first prose paragraph after the title", () => {
  const mdx = `import { Meta } from "@storybook/blocks";
import * as Stories from "./Surface.stories";

<Meta of={Stories} />

# Surface

What a surface over content is made of. **Solid** is the default on every
platform.

<Canvas of={Stories.Default} />
`;
  assert.equal(
    readDescription(mdx),
    "What a surface over content is made of. Solid is the default on every platform.",
  );
  assert.equal(readDescription("# Tag\n\n<Canvas />\n"), "");
});

test("snippets come from the PlatformSnippets block, dedented, first of each platform", () => {
  const mdx = `
<PlatformSnippets
    react={\`
import { Button } from "@kozmos/react";
export function Example() {
  return <Button>Go</Button>;
}
    \`}
    swift={\`
import SwiftUI

KozmosButton("Go")
    \`}
    kotlin={\`
KozmosButton(text = "Go")
    \`}
/>
<PlatformSnippets react={\`second\`} />
`;
  const snippets = readSnippets(mdx);
  assert.deepEqual(Object.keys(snippets).sort(), ["kotlin", "react", "swift"]);
  assert.equal(
    snippets.react,
    `import { Button } from "@kozmos/react";\nexport function Example() {\n  return <Button>Go</Button>;\n}`,
  );
  assert.equal(snippets.swift, "import SwiftUI\n\nKozmosButton(\"Go\")");
});

test("helpers and constants are not components", () => {
  assert.equal(isComponentName("Button"), true);
  assert.equal(isComponentName("CardHeader"), true);
  assert.equal(isComponentName("buttonVariants"), false);
  assert.equal(isComponentName("BUTTON_EMOTIONS"), false);
  assert.equal(isComponentName("POIDetailPanel"), true);
});

test("prop types read as one line", () => {
  assert.equal(
    typeText({ name: "enum", value: [{ value: '"sm"' }, { value: '"lg"' }] }),
    '"sm" | "lg"',
  );
  assert.equal(typeText({ name: "boolean" }), "boolean");
  assert.equal(typeText({ name: "signature", raw: "(value: string) => void" }), "(value: string) => void");
  assert.equal(typeText(undefined), "");
});
