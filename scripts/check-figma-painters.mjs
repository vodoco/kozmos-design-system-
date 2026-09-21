/**
 * Measure what the Figma importer's painters draw, without Figma.
 *
 * The plugin runs inside Figma, so until now a painter's output could only be
 * checked by running the import and reading the file back — one round per
 * try, and `pnpm figma:verify` compares structure, not paint. This evaluates
 * `code.js` against the harness in `scripts/lib/figma-plugin-harness.mjs`,
 * calls a painter the way Build and Update do, and asserts the numbers the
 * component contract names: a 64 square, a counter 4 beyond its edges, a
 * paint bound to the category's variable. Each assertion is a fact about a
 * node the painter wrote; none is a picture.
 *
 * Usage: node scripts/check-figma-painters.mjs [path/to/code.js]
 */
import path from "node:path";
import {
  FONTS,
  MockNode,
  boundVariableName,
  createFigmaMock,
  freshStats,
  hexOf,
  loadPlugin,
  mockComponentSet,
  mockIconComponent,
  mockVariables,
} from "./lib/figma-plugin-harness.mjs";

const ROOT = process.cwd();
const PLUGIN = path.resolve(
  process.argv[2] || "figma/foundations-importer/code.js",
);
const contract = (
  await import(
    path.join(ROOT, "packages/tokens/src/component-contracts.json"),
    { with: { type: "json" } }
  )
).default.components;

let failures = 0;
let passes = 0;
function ok(condition, message) {
  if (condition) {
    passes += 1;
    return;
  }
  failures += 1;
  console.log(`  FAIL  ${message}`);
}
function section(title) {
  console.log(`\n${title}`);
}

// --- The file the painters expect ------------------------------------------

const CATEGORY_NAMES = [
  "Yellow",
  "Orange",
  "Turquoise",
  "Red",
  "Blue",
  "Navy",
  "Green",
  "Pink",
];

function counterSet() {
  const variants = [];
  for (const tone of ["Neutral", "Brand", "Destructive", "Inverse"]) {
    for (const size of ["Small", "Default"]) {
      variants.push({
        properties: { Tone: tone, Size: size },
        build: (variant) => {
          const height = size === "Small" ? 18 : 20;
          variant.resize(height, height);
          variant.layoutMode = "HORIZONTAL";
          variant.fills = [
            { type: "SOLID", color: { r: 0.07, g: 0.36, b: 0.93 }, opacity: 1 },
          ];
          const text = new MockNode("TEXT", "Counter Text");
          text.characters = "2";
          text.fontSize = size === "Small" ? 11 : 12;
          text.componentPropertyReferences = { characters: "Counter Text#1:0" };
          variant.appendChild(text);
        },
      });
    }
  }
  const set = mockComponentSet("Counter", variants);
  set.componentPropertyDefinitions = {
    "Counter Text#1:0": { type: "TEXT", defaultValue: "2" },
  };
  return set;
}

function pages() {
  const components = new MockNode("PAGE", "Components");
  components.appendChild(counterSet());
  const icons = new MockNode("PAGE", "Icons");
  for (const name of [
    "search-md",
    "x-close",
    "marker-pin-01",
    "arrow-up",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "flip-backward",
    "map-01",
  ]) {
    icons.appendChild(mockIconComponent(name));
  }
  return [components, icons];
}

const variableByName = mockVariables([
  "Colors/background/0",
  "Colors/foreground/0",
  "Colors/foreground/400",
  "Colors/foreground/1000",
  "Colors/theme/100",
  "Colors/theme/500",
  "Colors/theme/700",
  "Colors/emotional/alert/900",
  "Surface/0",
  "Surface/100",
  "Border/Subtle",
  ...CATEGORY_NAMES.flatMap((name) => [
    `Category/Accent/${name}`,
    `Category/Fill/${name}`,
    `Category/OnFill/${name}`,
  ]),
  "CategoryTile/square/size",
  "CategoryTile/icon/size",
  "CategoryTile/label/font-size",
  "CategoryTile/label/line-height",
  "LocationPin/label/font-size",
  "LocationPin/label/line-height",
]);

const figma = createFigmaMock({ pages: pages() });
const plugin = loadPlugin({ pluginPath: PLUGIN, figma });

const named = (node, name) => node.findOne((child) => child.name === name);

// --- CategoryTile --------------------------------------------------------------

section("CategoryTile");
{
  const tile = contract.categoryTile.content;
  ok(
    Array.isArray(plugin.CATEGORY_TINTS) &&
      plugin.CATEGORY_TINTS.join(",") ===
        ["Theme", ...CATEGORY_NAMES].join(","),
    "CATEGORY_TINTS is Theme plus the taxonomy's eight, in the sprite's order",
  );
  ok(
    typeof plugin.updateCategoryTileVariant === "function" &&
      typeof plugin.categoryTileVariantCombinations === "function",
    "CategoryTile is a planned matrix of State × Tint",
  );
  if (typeof plugin.categoryTileVariantCombinations === "function") {
    ok(
      plugin.categoryTileVariantCombinations().length === 3 * 9,
      "27 variants: three states by nine tints",
    );
  }

  async function paint(state, tint) {
    const component = figma.createComponent();
    const stats = freshStats();
    await plugin.updateCategoryTileVariant(component, {
      props: { state, tint },
      variableByName,
      fonts: FONTS,
      stats,
    });
    return { component, stats };
  }

  if (typeof plugin.updateCategoryTileVariant === "function") {
    const { component, stats } = await paint("Selected", "Yellow");
    ok(
      component.name === "State=Selected, Tint=Yellow",
      `variant named by both axes (got "${component.name}")`,
    );
    const square = named(component, "Icon Square");
    ok(square, "an Icon Square");
    if (square) {
      ok(
        square.width === tile.squareSize && square.height === tile.squareSize,
        `the square is ${tile.squareSize} (got ${square.width}×${square.height})`,
      );
      ok(
        square.cornerRadius === plugin.KOZMOS_RADIUS.control,
        "the square's radius is the control role",
      );
      ok(
        boundVariableName(square.strokes[0]) === "Category/Accent/Yellow" &&
          square.strokeWeight === 1,
        "selected: a 1 stroke bound to the category's accent",
      );
      ok(
        square.fills.length === 2 &&
          boundVariableName(square.fills[0]) === "Colors/background/0" &&
          boundVariableName(square.fills[1]) === "Category/Accent/Yellow" &&
          Math.abs(square.fills[1].opacity - 0.05) < 1e-9,
        "selected: the background with the accent at 5 % over it",
      );
      ok(square.clipsContent === false, "the square does not clip its counter");
      const ring = named(square, "Selection Ring");
      ok(ring, "selected: a Selection Ring");
      if (ring) {
        ok(
          ring.width === tile.squareSize + 2 &&
            ring.height === tile.squareSize + 2 &&
            ring.x === -1 &&
            ring.y === -1 &&
            ring.layoutPositioning === "ABSOLUTE",
          "the ring is 1 outside the square on every side",
        );
        ok(
          boundVariableName(ring.strokes[0]) === "Category/Accent/Yellow" &&
            Math.abs(ring.strokes[0].opacity - 0.2) < 1e-9 &&
            ring.fills.length === 0,
          "the ring is the accent at 20 %, no fill",
        );
      }
      const icon = named(square, "Icon");
      ok(icon && icon.type === "INSTANCE", "the icon is a swappable instance");
      if (icon) {
        ok(
          icon.width === tile.iconSize && icon.height === tile.iconSize,
          `the icon is ${tile.iconSize}`,
        );
        const vector = icon.findOne((node) => node.type === "VECTOR");
        ok(
          vector &&
            boundVariableName(vector.strokes[0]) === "Category/Accent/Yellow",
          "the icon's stroke is bound to the accent",
        );
      }
      const counter = named(square, "Counter");
      ok(
        counter && counter.type === "INSTANCE",
        "the count is the system's Counter",
      );
      if (counter) {
        ok(
          counter.layoutPositioning === "ABSOLUTE" &&
            counter.y === -tile.counterOverhang &&
            counter.x + counter.width ===
              tile.squareSize + tile.counterOverhang,
          `the counter sits ${tile.counterOverhang} beyond the square's top and right edges (x ${counter.x}, y ${counter.y}, w ${counter.width})`,
        );
        ok(
          boundVariableName(counter.fills[0]) === "Category/Fill/Yellow",
          "the counter's fill is the category's fill",
        );
        const digits = counter.findOne((node) => node.type === "TEXT");
        ok(
          digits &&
            boundVariableName(digits.fills[0]) === "Category/OnFill/Yellow",
          "the digits are the fill's ink",
        );
        ok(
          counter.isExposedInstance === true,
          "the counter is exposed for its text",
        );
        ok(
          counter.constraints.horizontal === "MAX" &&
            counter.constraints.vertical === "MIN",
          "the counter is pinned to the top-right",
        );
      }
    }
    const label = named(component, "Label Text");
    ok(label && label.type === "TEXT", "a Label Text");
    if (label) {
      ok(
        label.fontSize === tile.labelFontSize &&
          label.lineHeight.value === tile.labelLineHeight,
        `the label is ${tile.labelFontSize}/${tile.labelLineHeight} (got ${label.fontSize}/${label.lineHeight && label.lineHeight.value})`,
      );
      ok(label.maxLines === 2, "the label is two lines at most");
      ok(
        boundVariableName(label.fills[0]) === "Colors/foreground/0",
        "the label keeps the foreground colour under a tint",
      );
      ok(label.textAlignHorizontal === "CENTER", "the label is centred");
    }
    ok(
      stats.warnings.length === 0,
      `no warnings (${stats.warnings.join(" | ")})`,
    );
  }

  if (typeof plugin.updateCategoryTileVariant === "function") {
    const { component } = await paint("Default", "Theme");
    const square = named(component, "Icon Square");
    ok(
      square && boundVariableName(square.strokes[0]) === "Border/Subtle",
      "default: the subtle border",
    );
    ok(
      square && square.fills.length === 1 && !named(square, "Selection Ring"),
      "default: no accent wash, no ring",
    );
    const icon = square && named(square, "Icon");
    const vector = icon && icon.findOne((node) => node.type === "VECTOR");
    ok(
      vector && boundVariableName(vector.strokes[0]) === "Colors/theme/500",
      "theme: the icon in the theme's colour",
    );
    const counter = square && named(square, "Counter");
    ok(
      counter &&
        hexOf(counter.fills[0]) === "#125CED" &&
        !counter.fills[0].boundVariables,
      "theme: the counter keeps its own brand fill",
    );
    ok(component.opacity === 1, "default: full opacity");
  }

  if (typeof plugin.updateCategoryTileVariant === "function") {
    const { component } = await paint("Disabled", "Red");
    ok(component.opacity === 0.5, "disabled: the tile at 50 %");
    const square = named(component, "Icon Square");
    ok(square && !named(square, "Selection Ring"), "disabled: no ring");
  }

  ok(
    plugin.COMPONENT_FLOAT_TOKENS.some(
      (token) =>
        token.name === "CategoryTile/square/size" &&
        token.value === tile.squareSize,
    ) &&
      plugin.COMPONENT_FLOAT_TOKENS.some(
        (token) =>
          token.name === "CategoryTile/icon/size" &&
          token.value === tile.iconSize,
      ) &&
      plugin.COMPONENT_FLOAT_TOKENS.some(
        (token) =>
          token.name === "CategoryTile/label/font-size" &&
          token.value === tile.labelFontSize,
      ) &&
      plugin.COMPONENT_FLOAT_TOKENS.some(
        (token) =>
          token.name === "CategoryTile/label/line-height" &&
          token.value === tile.labelLineHeight,
      ),
    "the tile's component variables carry the contract's numbers",
  );
  ok(
    typeof plugin.expectedVariantAxesForComponentSetName === "function" &&
      JSON.stringify(
        plugin.expectedVariantAxesForComponentSetName("CategoryTile"),
      ) ===
        JSON.stringify({
          State: plugin.CATEGORY_TILE_STATES,
          Tint: plugin.CATEGORY_TINTS,
        }),
    "the set expects State and Tint",
  );
}

// --- LocationPin --------------------------------------------------------------

section("LocationPin");
{
  const pin = contract.locationPin;
  ok(
    typeof plugin.locationPinVariantCombinations === "function" &&
      plugin.locationPinVariantCombinations().length === 5 * 3 * 9,
    "135 variants: five states by three sizes by nine tints",
  );
  ok(
    typeof plugin.expectedVariantAxesForComponentSetName === "function" &&
      JSON.stringify(
        plugin.expectedVariantAxesForComponentSetName("LocationPin"),
      ) ===
        JSON.stringify({
          State: plugin.LOCATION_PIN_STATES,
          Size: plugin.LOCATION_PIN_SIZES,
          Tint: plugin.CATEGORY_TINTS,
        }),
    "the set expects State, Size and Tint",
  );
  ok(
    typeof plugin.parseLocationPinVariantName === "function" &&
      JSON.stringify(
        plugin.parseLocationPinVariantName("State=Selected, Size=Lg"),
      ) === JSON.stringify({ state: "Selected", size: "Lg", tint: "Theme" }),
    "a pre-Tint variant name reads as the theme's",
  );

  async function paint(state, size, tint) {
    const component = figma.createComponent();
    const stats = freshStats();
    await plugin.updateLocationPinVariant(component, {
      props: { state, size, tint },
      variableByName,
      fonts: FONTS,
      stats,
    });
    return { component, stats };
  }

  if (typeof plugin.updateLocationPinVariant === "function") {
    const { component, stats } = await paint("Default", "Md", "Red");
    ok(
      component.name === "State=Default, Size=Md, Tint=Red",
      `variant named by three axes (got "${component.name}")`,
    );
    const marker = named(component, "Pin Marker");
    ok(marker, "a Pin Marker");
    if (marker) {
      ok(
        marker.width === pin.sizes.default.diameter,
        `the md marker is ${pin.sizes.default.diameter} (got ${marker.width})`,
      );
      ok(
        boundVariableName(marker.fills[0]) === "Category/Fill/Red",
        "tinted: the marker is the category's fill",
      );
    }
    const number = named(component, "Number Text");
    ok(
      number && boundVariableName(number.fills[0]) === "Category/OnFill/Red",
      "tinted: the number is the fill's ink",
    );
    ok(
      stats.warnings.length === 0,
      `no warnings (${stats.warnings.join(" | ")})`,
    );
  }

  if (typeof plugin.updateLocationPinVariant === "function") {
    const { component } = await paint("Featured", "Md", "Red");
    const marker = named(component, "Pin Marker");
    ok(
      marker &&
        boundVariableName(marker.fills[0]) === "Colors/emotional/alert/900",
      "featured: keeps the alert colour under a tint",
    );
    const number = named(component, "Number Text");
    ok(
      number && boundVariableName(number.fills[0]) === "Colors/foreground/1000",
      "featured: the number stays white",
    );
  }

  if (typeof plugin.updateLocationPinVariant === "function") {
    const { component } = await paint("OffFloor", "Sm", "Blue");
    const marker = named(component, "Pin Marker");
    ok(
      marker &&
        boundVariableName(marker.fills[0]) === "Colors/background/0" &&
        boundVariableName(marker.strokes[0]) === "Category/Fill/Blue",
      "off the floor: a hollow ring stroked in the category's fill",
    );
    const number = named(component, "Number Text");
    ok(
      number && boundVariableName(number.fills[0]) === "Category/Fill/Blue",
      "off the floor: the number in the category's fill",
    );
  }

  if (typeof plugin.updateLocationPinVariant === "function") {
    const { component } = await paint("Disabled", "Lg", "Green");
    const marker = named(component, "Pin Marker");
    ok(
      component.opacity === 0.5 &&
        marker &&
        boundVariableName(marker.fills[0]) === "Category/Fill/Green",
      "disabled: the category's fill at 50 %",
    );
  }

  if (typeof plugin.updateLocationPinVariant === "function") {
    const { component } = await paint("Selected", "Md", "Theme");
    const marker = named(component, "Pin Marker");
    ok(
      marker &&
        boundVariableName(marker.fills[0]) === "Colors/theme/700" &&
        marker.width === pin.sizes.default.diameter + 8,
      "theme: the theme's colour, and a selected pin grows by 8",
    );
  }
}

// --- Summary ---------------------------------------------------------------------

console.log(
  `\n${passes} passed, ${failures} failed — ${path.relative(ROOT, PLUGIN)}`,
);
process.exit(failures === 0 ? 0 : 1);
