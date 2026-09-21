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
import fs from "node:fs";
import path from "node:path";
import {
  FONTS,
  MockNode,
  boundPaintOpacityDrops,
  boundVariableName,
  createFigmaMock,
  freshStats,
  hexOf,
  loadPlugin,
  mockComponentSet,
  mockIconComponent,
  mockVariables,
  payloadVariables,
  resetSearchStats,
  searchStats,
} from "./lib/figma-plugin-harness.mjs";

const ROOT = process.cwd();
const PLUGIN = path.resolve(
  process.argv[2] || "figma/foundations-importer/code.js",
);
const contract = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "packages/tokens/src/component-contracts.json"),
    "utf8",
  ),
).components;

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
    "chevron-left",
    "chevron-right",
    "chevron-up",
    "chevron-down",
    "navigation-pointer-01",
    "bookmark",
    "share-01",
    "edit-01",
    "stars-01",
    "plus",
    "minus",
    "compass-01",
    "loading-01",
    "switch-vertical-01",
  ]) {
    icons.appendChild(mockIconComponent(name));
  }
  return [components, icons];
}

const variableByName = mockVariables([
  "Colors/background/0",
  "Colors/foreground/0",
  "Colors/foreground/400",
  "Colors/foreground/500",
  "Colors/foreground/1000",
  "Colors/theme/100",
  "Colors/theme/500",
  "Colors/theme/700",
  "Colors/emotional/alert/900",
  "Colors/background/100",
  "Colors/background/200",
  "Primary Buttons/themed/button/background/idle",
  "Primary Buttons/themed/button/foreground/content/idle",
  "CategoryField/height",
  "CategoryField/icon/size",
  "CategoryField/pill/height",
  "CategoryField/clear/size",
  "CategoryField/label/font-size",
  "CategoryField/label/line-height",
  "AISearchButton/size",
  "AISearchButton/icon/size",
  "Data/Red",
  "Data/Yellow",
  "Colors/emotional/success/500",
  "Data/Teal",
  "Data/Blue",
  "Data/Purple",
  "DirectionStep/instruction/font-size",
  "DirectionStep/instruction/line-height",
  "DirectionStep/meta/font-size",
  "DirectionStep/meta/line-height",
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
  "Colors/transparent/inverted/10",
  "Border/bevel/top",
  "Overlay/Scrim",
]);

const figma = createFigmaMock({ pages: pages() });
const plugin = loadPlugin({ pluginPath: PLUGIN, figma });

const named = (node, name) => node.findOne((child) => child.name === name);

// Figma keeps no paint opacity on a bound colour, so a translucent token wash
// is a layer of its own: the paint bound at full strength, the layer at the
// wash's opacity, first in its parent so the content sits on it, absolute and
// stretched with the parent.
function isWash(parent, name, variable, opacity, width, height) {
  const wash = parent && named(parent, name);
  return Boolean(
    wash &&
    parent.children[0] === wash &&
    wash.fills.length === 1 &&
    boundVariableName(wash.fills[0]) === variable &&
    (wash.fills[0].opacity ?? 1) === 1 &&
    Math.abs(wash.opacity - opacity) < 1e-9 &&
    wash.width === width &&
    wash.height === height &&
    wash.layoutPositioning === "ABSOLUTE" &&
    wash.constraints.horizontal === "STRETCH" &&
    wash.constraints.vertical === "STRETCH",
  );
}

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
        square.fills.length === 1 &&
          boundVariableName(square.fills[0]) === "Colors/background/0",
        "selected: the square keeps its background",
      );
      ok(
        isWash(
          square,
          "Selection Wash",
          "Category/Accent/Yellow",
          0.05,
          tile.squareSize,
          tile.squareSize,
        ),
        "selected: the accent at 5 % over it, as a wash layer",
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
            (ring.strokes[0].opacity ?? 1) === 1 &&
            Math.abs(ring.opacity - 0.2) < 1e-9 &&
            ring.fills.length === 0,
          "the ring is the accent at 20 % by layer opacity, no fill",
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
      square &&
        square.fills.length === 1 &&
        !named(square, "Selection Wash") &&
        !named(square, "Selection Ring"),
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
      number && boundVariableName(number.fills[0]) === "Colors/foreground/0",
      "off the floor: the number in the foreground on the white disc (Olcay, 2026-09-21)",
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

// --- IconButton ------------------------------------------------------------------

section("IconButton");
{
  const large = contract.iconButton.sizes.large;
  const token = plugin.COMPONENT_FLOAT_TOKENS.find(
    (entry) => entry.name === "IconButton/size/large",
  );
  ok(
    token && token.value === large.width && token.value === large.height,
    `the large icon button is ${large.width} (token ${token && token.value})`,
  );
  const icon = plugin.COMPONENT_FLOAT_TOKENS.find(
    (entry) => entry.name === "IconButton/icon/size/large",
  );
  ok(
    icon && icon.value === large.iconSize,
    `its icon is ${large.iconSize} (token ${icon && icon.value})`,
  );
}

// --- POIDetailPanel --------------------------------------------------------------

section("POIDetailPanel");
{
  async function paint(value) {
    const component = figma.createComponent();
    const stats = freshStats();
    await plugin.updatePOIDetailPanelVariant(component, {
      value,
      variableByName,
      fonts: FONTS,
      stats,
    });
    return { component, stats };
  }
  const { component: sheet } = await paint("Sheet");
  ok(
    sheet.fills.length === 0 && sheet.strokes.length === 0,
    "sheet: no surface or border of its own",
  );
  ok(
    sheet.topLeftRadius === plugin.KOZMOS_RADIUS.control &&
      sheet.topRightRadius === plugin.KOZMOS_RADIUS.control &&
      sheet.cornerRadius === plugin.KOZMOS_RADIUS.none,
    "sheet: only the top corners round, at the control radius",
  );
  ok(
    !named(sheet, "Grabber"),
    "sheet: no grabber of its own — the sheet draws the handle",
  );
  for (const slot of ["Media Slot", "Services Slot"]) {
    const node = named(sheet, slot);
    ok(
      node && boundVariableName(node.fills[0]) === "Colors/background/0",
      `sheet: ${slot} is white on the sheet's grey`,
    );
  }
  const { component: panel } = await paint("Panel");
  ok(
    boundVariableName(panel.fills[0]) === "Surface/0" &&
      boundVariableName(panel.strokes[0]) === "Border/Subtle",
    "panel: keeps its surface and border",
  );
  const services = named(panel, "Services Slot");
  ok(
    services && boundVariableName(services.fills[0]) === "Surface/100",
    "panel: the services block stays muted",
  );
}

// --- CategoryField ---------------------------------------------------------------

section("CategoryField");
{
  ok(
    typeof plugin.updateCategoryFieldVariant === "function" &&
      typeof plugin.buildCategoryFieldComponent === "function" &&
      typeof plugin.updateCategoryFieldComponent === "function",
    "CategoryField has a painter, a Build and an Update",
  );
  ok(
    typeof plugin.expectedVariantAxesForComponentSetName === "function" &&
      JSON.stringify(
        plugin.expectedVariantAxesForComponentSetName("CategoryField"),
      ) === JSON.stringify({ Tint: plugin.CATEGORY_TINTS }),
    "the set expects Tint",
  );
  ok(
    Array.isArray(plugin.PRODUCT_SDK_UPDATE_SEQUENCE) &&
      plugin.PRODUCT_SDK_UPDATE_SEQUENCE.some(
        ([name]) => name === "CategoryField",
      ),
    "CategoryField is in the Product / SDK update sequence",
  );

  async function paint(value) {
    const component = figma.createComponent();
    const stats = freshStats();
    await plugin.updateCategoryFieldVariant(component, {
      value,
      variableByName,
      fonts: FONTS,
      stats,
    });
    return { component, stats };
  }

  if (typeof plugin.updateCategoryFieldVariant === "function") {
    const { component, stats } = await paint("Yellow");
    ok(
      component.name === "Tint=Yellow",
      `named by its tint (got "${component.name}")`,
    );
    ok(component.height === 48, `48 tall (got ${component.height})`);
    ok(
      component.cornerRadius === plugin.KOZMOS_RADIUS.control,
      "the control radius",
    );
    ok(
      boundVariableName(component.strokes[0]) === "Category/Accent/Yellow" &&
        component.strokeWeight === 1,
      "a 1 border in the accent",
    );
    ok(component.fills.length === 0, "the field paints no fill of its own");
    ok(
      isWash(component, "Tint Wash", "Category/Accent/Yellow", 0.12, 320, 48) &&
        named(component, "Tint Wash").cornerRadius ===
          plugin.KOZMOS_RADIUS.control,
      "the accent at 12 % behind, as a wash layer at the control radius",
    );
    ok(
      component.paddingLeft === 12 && component.paddingRight === 8,
      "12 before the icon, 8 after the clear",
    );
    const icon = named(component, "Icon");
    ok(
      icon && icon.type === "INSTANCE" && icon.width === 28,
      "a 28 icon instance",
    );
    const vector = icon && icon.findOne((node) => node.type === "VECTOR");
    ok(
      vector &&
        boundVariableName(vector.strokes[0]) === "Category/Accent/Yellow" &&
        Math.abs(vector.strokeWeight - (2 * 28) / 24) < 1e-9,
      "the icon in the accent, its stroke scaled to 28",
    );
    const label = named(component, "Label Text");
    ok(
      label &&
        label.fontSize === 15 &&
        label.lineHeight.value === 20 &&
        boundVariableName(label.fills[0]) === "Colors/foreground/0",
      "the label 15/20 in the foreground (Olcay, 2026-09-21)",
    );
    const pill = named(component, "Count Pill");
    ok(
      pill &&
        pill.height === 22 &&
        pill.cornerRadius === plugin.KOZMOS_RADIUS.pill &&
        boundVariableName(pill.fills[0]) === "Category/Fill/Yellow",
      "a 22 pill filled with the category's fill",
    );
    const count = named(component, "Count Text");
    ok(
      count && boundVariableName(count.fills[0]) === "Category/OnFill/Yellow",
      "the digits in the fill's ink",
    );
    const clear = named(component, "Clear Button");
    ok(
      clear &&
        clear.width === 32 &&
        clear.height === 32 &&
        clear.fills.length === 0,
      "a 32 clear with no fill",
    );
    const cross = clear && named(clear, "Clear Icon");
    const crossVector =
      cross && cross.findOne((node) => node.type === "VECTOR");
    ok(
      cross &&
        cross.width === 16 &&
        crossVector &&
        boundVariableName(crossVector.strokes[0]) === "Colors/foreground/0",
      "the clear's cross is a 16 x-close in the foreground",
    );
    ok(
      stats.warnings.length === 0,
      `no warnings (${stats.warnings.join(" | ")})`,
    );
  }

  if (typeof plugin.updateCategoryFieldVariant === "function") {
    const { component } = await paint("Theme");
    const pill = named(component, "Count Pill");
    const count = named(component, "Count Text");
    ok(
      pill &&
        boundVariableName(pill.fills[0]) ===
          "Primary Buttons/themed/button/background/idle" &&
        count &&
        boundVariableName(count.fills[0]) ===
          "Primary Buttons/themed/button/foreground/content/idle",
      "theme: the pill is the themed button's fill and ink",
    );
    ok(
      boundVariableName(component.strokes[0]) === "Colors/theme/500",
      "theme: the border in the theme's colour",
    );
  }

  if (typeof plugin.configureCategoryFieldProperties === "function") {
    const variants = [];
    for (const tint of ["Theme", "Red"]) {
      const { component } = await paint(tint);
      variants.push(component);
    }
    const set = figma.combineAsVariants(variants, figma.currentPage);
    set.name = "CategoryField";
    const stats = freshStats();
    await plugin.configureCategoryFieldProperties(set, stats);
    const definitions = set.componentPropertyDefinitions;
    const byBase = (base, type) =>
      Object.keys(definitions).find(
        (key) => key.split("#")[0] === base && definitions[key].type === type,
      );
    const showCount = byBase("Show Count", "BOOLEAN");
    const iconProperty = byBase("Icon", "INSTANCE_SWAP");
    ok(
      showCount && definitions[showCount].defaultValue === true,
      "a Show Count boolean, on by default",
    );
    ok(
      byBase("Label Text", "TEXT") && byBase("Count Text", "TEXT"),
      "Label Text and Count Text properties",
    );
    ok(iconProperty, "an Icon instance-swap property");
    const pill = named(variants[1], "Count Pill");
    ok(
      pill &&
        pill.componentPropertyReferences &&
        pill.componentPropertyReferences.visible === showCount,
      "the pill's visibility is Show Count",
    );
    const icon = named(variants[1], "Icon");
    ok(
      icon &&
        icon.componentPropertyReferences &&
        icon.componentPropertyReferences.mainComponent === iconProperty,
      "the icon swaps through Icon",
    );
    set.remove();
  }
}

// --- BrowseCategoriesPanel ----------------------------------------------------

section("BrowseCategoriesPanel");
{
  const taxonomy = [
    ["Entrances & Exits", "Green"],
    ["Check-in & Baggage", "Turquoise"],
    ["Security & Immigration", "Red"],
    ["Gates", "Yellow"],
    ["Customer Service", "Blue"],
    ["Parking & Ground Transport", "Navy"],
    ["Dining", "Orange"],
    ["Shopping", "Pink"],
  ];
  // A CategoryTile set for the panel to instance, painted by the plugin itself.
  const tiles = [];
  ok(
    Array.isArray(plugin.CATEGORY_TINTS) &&
      typeof plugin.updateCategoryTileVariant === "function" &&
      typeof plugin.configureCategoryTileProperties === "function",
    "a CategoryTile with a Tint axis to instance",
  );
  for (const tint of plugin.CATEGORY_TINTS || []) {
    const component = figma.createComponent();
    await plugin.updateCategoryTileVariant(component, {
      props: { state: "Default", tint },
      variableByName,
      fonts: FONTS,
      stats: freshStats(),
    });
    tiles.push(component);
  }
  const tileSet = figma.combineAsVariants(tiles, figma.currentPage);
  tileSet.name = "CategoryTile";
  for (const variant of tiles) {
    variant.variantProperties = Object.fromEntries(
      variant.name.split(",").map((part) => part.trim().split("=")),
    );
  }
  if (typeof plugin.configureCategoryTileProperties === "function") {
    await plugin.configureCategoryTileProperties(tileSet, freshStats());
  }

  const component = figma.createComponent();
  const stats = freshStats();
  await plugin.updateBrowseCategoriesPanelVariant(component, {
    value: "Basic",
    variableByName,
    fonts: FONTS,
    stats,
  });
  const grid = named(component, "Category Grid");
  ok(grid, "a Category Grid");
  const rows = grid
    ? grid.children.filter((row) => row.name.startsWith("Category Row"))
    : [];
  ok(
    rows.length === 2 && rows.every((row) => row.children.length === 4),
    "two rows of four",
  );
  ok(
    grid &&
      grid.itemSpacing === 8 &&
      rows.every((row) => row.itemSpacing === 8),
    "gap 8 both ways",
  );
  const instances = rows.flatMap((row) => row.children);
  ok(
    instances.length === 8 &&
      instances.every((tile) => tile.type === "INSTANCE"),
    "eight live CategoryTile instances",
  );
  taxonomy.forEach(([label, tint], index) => {
    const tile = instances[index];
    const labelNode =
      tile && tile.findOne((node) => node.name === "Label Text");
    const digits = tile && tile.findOne((node) => node.name === "Counter Text");
    ok(
      tile &&
        tile.mainComponent &&
        tile.mainComponent.name === `State=Default, Tint=${tint}` &&
        labelNode &&
        labelNode.characters === label &&
        digits &&
        /^\d+$/.test(digits.characters),
      `tile ${index + 1} is ${label} in ${tint} with a count`,
    );
  });
  ok(
    instances.every((tile) => tile.isExposedInstance === true),
    "each tile is exposed",
  );
  ok(
    stats.warnings.length === 0,
    `no warnings (${stats.warnings.join(" | ")})`,
  );
  tileSet.remove();
}

// --- DirectionStep ---------------------------------------------------------------

section("DirectionStep");
{
  ok(
    Array.isArray(plugin.DIRECTION_STEP_TYPES) &&
      plugin.DIRECTION_STEP_TYPES.length === 14 &&
      plugin.DIRECTION_STEP_TYPES.includes("TurnBack"),
    "fourteen direction types",
  );
  ok(
    typeof plugin.expectedVariantAxesForComponentSetName === "function" &&
      JSON.stringify(
        plugin.expectedVariantAxesForComponentSetName("DirectionStep"),
      ) === JSON.stringify({ Type: plugin.DIRECTION_STEP_TYPES }),
    "the set expects the fourteen",
  );
  async function paint(value) {
    const component = figma.createComponent();
    const stats = freshStats();
    await plugin.updateDirectionStepVariant(component, {
      value,
      variableByName,
      fonts: FONTS,
      stats,
    });
    return { component, stats };
  }
  for (const [type, iconName] of [
    ["TurnBack", "flip-backward"],
    ["LiftDown", "arrow-down"],
    ["Destination", "marker-pin-01"],
    ["Straight", "arrow-up"],
  ]) {
    const { component, stats } = await paint(type);
    const badge = named(component, "Direction Icon");
    const icon = badge && badge.findOne((node) => node.type === "INSTANCE");
    const vector = icon && icon.findOne((node) => node.type === "VECTOR");
    ok(
      badge &&
        badge.width === 40 &&
        badge.fills.length === 0 &&
        isWash(badge, "Direction Wash", "Colors/theme/500", 0.1, 40, 40) &&
        named(badge, "Direction Wash").type === "ELLIPSE",
      `${type}: a 40 disc in the theme's colour at 10 %, as a wash layer`,
    );
    ok(
      icon &&
        icon.width === 24 &&
        icon.mainComponent.name === `Icon / ${iconName}` &&
        vector &&
        boundVariableName(vector.strokes[0]) === "Colors/theme/500",
      `${type}: a 24 ${iconName} icon in the theme's colour`,
    );
    ok(!named(component, "Direction Glyph"), `${type}: no typed glyph`);
    ok(
      stats.warnings.length === 0,
      `${type}: no warnings (${stats.warnings.join(" | ")})`,
    );
  }
}

// --- AISearchButton --------------------------------------------------------------

section("AISearchButton");
{
  ok(
    Array.isArray(plugin.AI_SEARCH_BUTTON_STATES) &&
      plugin.AI_SEARCH_BUTTON_STATES.join(",") === "Default,Disabled",
    "Default and Disabled",
  );
  ok(
    typeof plugin.expectedVariantAxesForComponentSetName === "function" &&
      JSON.stringify(
        plugin.expectedVariantAxesForComponentSetName("AISearchButton"),
      ) === JSON.stringify({ State: plugin.AI_SEARCH_BUTTON_STATES }),
    "the set expects State",
  );
  ok(
    plugin.PRODUCT_SDK_UPDATE_SEQUENCE.some(
      ([name]) => name === "AISearchButton",
    ),
    "AISearchButton is in the Product / SDK update sequence",
  );
  async function paint(value) {
    const component = figma.createComponent();
    const stats = freshStats();
    await plugin.updateAISearchButtonVariant(component, {
      value,
      variableByName,
      fonts: FONTS,
      stats,
    });
    return { component, stats };
  }
  const painted =
    typeof plugin.updateAISearchButtonVariant === "function"
      ? await paint("Default")
      : { component: figma.createComponent(), stats: freshStats() };
  const { component, stats } = painted;
  ok(
    typeof plugin.updateAISearchButtonVariant === "function",
    "AISearchButton has a painter",
  );
  ok(
    component.width === 48 &&
      component.height === 48 &&
      component.cornerRadius === plugin.KOZMOS_RADIUS.pill,
    "a 48 circle",
  );
  const ring = named(component, "Ring");
  ok(ring && ring.type === "ELLIPSE" && ring.width === 48, "a 48 ring");
  const gradient = ring && ring.fills[0];
  const stops = (gradient && gradient.gradientStops) || [];
  const stopNames = stops.map((stop) =>
    boundVariableName({ boundVariables: stop.boundVariables }),
  );
  ok(
    gradient && gradient.type === "GRADIENT_ANGULAR" && stops.length === 7,
    "the ring is a conic gradient of seven stops",
  );
  ok(
    stopNames.join(",") ===
      "Data/Red,Data/Yellow,Colors/emotional/success/500,Data/Teal,Data/Blue,Data/Purple,Data/Red",
    `the stops are the six data colours, red back to red (got ${stopNames.join(",")})`,
  );
  const disc = named(component, "Disc");
  ok(
    disc &&
      disc.width === 43 &&
      disc.x === 2.5 &&
      disc.y === 2.5 &&
      boundVariableName(disc.fills[0]) === "Colors/background/0",
    "a 43 disc inset 2.5, in the background colour",
  );
  const icon = named(component, "Icon");
  const vector = icon && icon.findOne((node) => node.type === "VECTOR");
  ok(
    icon &&
      icon.width === 16 &&
      icon.mainComponent.name === "Icon / stars-01" &&
      vector &&
      boundVariableName(vector.strokes[0]) === "Colors/theme/500",
    "a 16 sparkles icon in the theme's colour",
  );
  ok(
    stats.warnings.length === 0,
    `no warnings (${stats.warnings.join(" | ")})`,
  );
  if (typeof plugin.updateAISearchButtonVariant === "function") {
    const { component: disabled } = await paint("Disabled");
    ok(disabled.opacity === 0.5, "disabled: at 50 %");
  }
}

// --- Typed glyphs become icons -----------------------------------------------------

section("Glyphs");
{
  const stats = freshStats();
  const header = await plugin.productSdkPanelHeader({
    title: "Kozmos Cafe",
    titleNodeName: "Title Text",
    closeGlyph: "×",
    width: 348,
    fonts: FONTS,
    variableByName,
    stats,
  });
  const close = named(header, "Close Slot");
  const icon = close && named(close, "Close Slot Icon");
  ok(
    icon &&
      icon.type === "INSTANCE" &&
      icon.mainComponent.name === "Icon / x-close",
    "the panel header's close is an x-close icon",
  );
  ok(!named(header, "Close Slot Glyph"), "no typed × remains");
  const component = figma.createComponent();
  await plugin.updatePOIDetailPanelVariant(component, {
    value: "Panel",
    variableByName,
    fonts: FONTS,
    stats: freshStats(),
  });
  for (const [action, iconName] of [
    ["Navigate", "navigation-pointer-01"],
    ["Save", "bookmark"],
    ["Share", "share-01"],
  ]) {
    const button = named(component, `${action} Action`);
    const mark = button && named(button, `${action} Action Icon`);
    ok(
      mark &&
        mark.mainComponent.name === `Icon / ${iconName}` &&
        !named(button, `${action} Action Glyph`),
      `the POI panel's ${action} is a ${iconName} icon`,
    );
  }
}

// --- Icon fallbacks -----------------------------------------------------------------

section("Icon fallbacks");
{
  const token = { name: "Colors/foreground/0", fallback: "#000000" };
  const stats = freshStats();
  const helper = typeof plugin.productSdkIconInstance === "function";
  ok(helper, "the plugin has the curated-icon helper");
  const symbol = !helper
    ? undefined
    : await plugin.productSdkIconInstance({
        iconName: "no-such-icon",
        token,
        size: 16,
        sizeToken: null,
        variableByName,
        stats,
        owner: "Test",
      });
  ok(
    symbol === null,
    "a symbol the file lacks draws nothing, never the default",
  );
  ok(
    helper &&
      stats.warnings.length === 1 &&
      /Curated Icons/.test(stats.warnings[0]),
    "and says to run Curated Icons",
  );
  const slot = !helper
    ? null
    : await plugin.productSdkIconInstance({
        iconName: "no-such-icon",
        token,
        size: 24,
        sizeToken: null,
        variableByName,
        stats: freshStats(),
        owner: "Test",
        fallbackToDefault: true,
      });
  ok(
    slot &&
      slot.mainComponent.name === `Icon / ${plugin.DEFAULT_CURATED_ICON_NAME}`,
    "a slot whose symbol is product data takes the library's default",
  );
}

// --- FloorSelector and MapControlsGroup ----------------------------------------------

section("FloorSelector");
{
  const component = figma.createComponent();
  const stats = freshStats();
  await plugin.updateFloorSelectorVariant(component, {
    value: "CompactStepper",
    variableByName,
    fonts: FONTS,
    stats,
  });
  for (const [name, iconName] of [
    ["Stepper Up", "chevron-up"],
    ["Stepper Down", "chevron-down"],
  ]) {
    const stepper = named(component, name);
    const icon = stepper && named(stepper, `${name} Icon`);
    ok(
      icon &&
        icon.mainComponent.name === `Icon / ${iconName}` &&
        !named(stepper, `${name} Glyph`),
      `${name} is a ${iconName} icon`,
    );
  }
}

section("MapControlsGroup");
{
  const component = figma.createComponent();
  const stats = freshStats();
  await plugin.updateMapControlsGroupVariant(component, {
    value: "IconOnly",
    variableByName,
    fonts: FONTS,
    stats,
  });
  for (const [name, iconName] of [
    ["Zoom In Button", "plus"],
    ["Zoom Out Button", "minus"],
    ["Compass Button", "compass-01"],
  ]) {
    const button = named(component, name);
    const icon = button && named(button, `${name} Icon`);
    ok(
      icon &&
        icon.mainComponent.name === `Icon / ${iconName}` &&
        !named(button, `${name} Glyph`),
      `${name} is a ${iconName} icon`,
    );
  }
}

// --- An icon that lost its tint is repaired on Update -----------------------------

section("Icon tint repair");
{
  const token = "Primary Buttons/themed/button/foreground/content/idle";
  const config = { foreground: token, foregroundFallback: "#FFFFFF" };
  const source = figma.root.findOne(
    (node) => node.type === "COMPONENT" && node.name === "Icon / search-md",
  );
  const ready =
    source &&
    typeof plugin.createIconSlotInstance === "function" &&
    typeof plugin.syncIconSlotInstance === "function";
  ok(ready, "the icon slot helpers and a source icon");
  if (ready) {
    const icon = plugin.createIconSlotInstance(
      source,
      token,
      "#FFFFFF",
      variableByName,
      freshStats(),
      16,
      null,
    );
    const vector = icon.findOne((node) => node.type === "VECTOR");
    ok(
      vector && boundVariableName(vector.strokes[0]) === token,
      "a fresh icon is bound to its token",
    );
    // What the file held on 2026-09-21: the right label, a plain black paint.
    vector.strokes = [
      { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1, visible: true },
    ];
    const stats = freshStats();
    plugin.syncIconSlotInstance(icon, config, variableByName, stats, 16, null);
    ok(
      boundVariableName(vector.strokes[0]) === token,
      "Update re-binds a black icon whose label was already right",
    );
    ok(stats.iconSlotPaintRepairs === 1, "and counts the repair");
    const again = freshStats();
    plugin.syncIconSlotInstance(icon, config, variableByName, again, 16, null);
    ok(
      !again.iconSlotPaintRepairs && again.iconSlotRetintsSkipped === 1,
      "a second Update finds the paint right and skips",
    );

    // The dark-mode failures in the 2026-09-21 audit: Secondary, Glass,
    // Outline and Ghost take Colors/foreground/0, whose light value is the
    // Icons page glyph's own black. An unbound black glyph matched the
    // fallback, passed as right, and stayed black on the dark surfaces (1.0
    // on Outline and Ghost, 1.61 on Secondary, 1.2 on Glass). A variable in
    // the file must be bound; the fallback serves only when it is missing.
    const neutralToken = "Colors/foreground/0";
    const neutral = { foreground: neutralToken, foregroundFallback: "#000000" };
    const neutralIcon = plugin.createIconSlotInstance(
      source,
      neutralToken,
      "#000000",
      variableByName,
      freshStats(),
      16,
      null,
    );
    const neutralVector = neutralIcon.findOne((node) => node.type === "VECTOR");
    neutralVector.strokes = [
      { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1, visible: true },
    ];
    const neutralStats = freshStats();
    plugin.syncIconSlotInstance(
      neutralIcon,
      neutral,
      variableByName,
      neutralStats,
      16,
      null,
    );
    ok(
      boundVariableName(neutralVector.strokes[0]) === neutralToken,
      "an unbound black icon is bound to Colors/foreground/0, though its colour matches the fallback",
    );
    ok(neutralStats.iconSlotPaintRepairs === 1, "and the repair is counted");

    const missingToken = "Colors/not-in-this-file/500";
    const missing = { foreground: missingToken, foregroundFallback: "#000000" };
    const loneIcon = plugin.createIconSlotInstance(
      source,
      missingToken,
      "#000000",
      variableByName,
      freshStats(),
      16,
      null,
    );
    const loneVector = loneIcon.findOne((node) => node.type === "VECTOR");
    loneVector.strokes = [
      { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1, visible: true },
    ];
    const loneStats = freshStats();
    plugin.syncIconSlotInstance(
      loneIcon,
      missing,
      variableByName,
      loneStats,
      16,
      null,
    );
    ok(
      !loneStats.iconSlotPaintRepairs && loneStats.iconSlotRetintsSkipped === 1,
      "with its variable missing from the file, the fallback colour is right",
    );
  }
}

// --- Translucent token paints ---------------------------------------------------

section("Translucent token paints");
{
  const frame = figma.createFrame();
  frame.layoutMode = "VERTICAL";
  frame.resize(320, 240);
  const ready = typeof plugin.appendScrollAreaScrollbar === "function";
  ok(ready, "ScrollArea's scrollbar helper");
  if (ready) {
    plugin.appendScrollAreaScrollbar({
      component: frame,
      name: "Vertical Scrollbar",
      vertical: true,
      metrics: { width: 320, height: 240 },
      variableByName,
      stats: freshStats(),
    });
    const track = named(frame, "Vertical Scrollbar");
    ok(
      track &&
        boundVariableName(track.fills[0]) === "Colors/foreground/500" &&
        (track.fills[0].opacity ?? 1) === 1 &&
        Math.abs(track.opacity - 0.32) < 1e-9,
      "ScrollArea's track is foreground/500 at 32 % by layer opacity",
    );
  }
  const source = fs.readFileSync(PLUGIN, "utf8");
  ok(
    !/paintFromVariableWithOpacity/.test(source),
    "no helper gives a bound paint an opacity",
  );
  ok(
    /setTranslucentTokenPaint\(\s*handle,\s*"fills",\s*\{ name: "Colors\/foreground\/500", fallback: "#747B8B" \},\s*0\.36,/.test(
      source,
    ),
    "BottomSheet's handle is foreground/500 at 36 % by layer opacity",
  );
}

section("A translucent token rides on the paint");
{
  // What the file draws, rendered over REST on 2026-09-21: a bound paint's
  // opacity shows and the variable's own alpha does not. Build ed50a03a1912
  // bound every paint at 1, and Button's Glass came out opaque: a near-white
  // pill under a near-white label in Dark, 1.03 to 1.
  const alphaOf = (hex) => Number.parseInt(hex.slice(7, 9), 16) / 255;
  const near = (a, b) => typeof a === "number" && Math.abs(a - b) < 0.002;
  const ready =
    typeof plugin.createButtonVariant === "function" &&
    typeof plugin.createBackdropVariant === "function" &&
    typeof plugin.solidPaintToRgba === "function";
  ok(ready, "Button's and Backdrop's painters and the audit's paint reader");
  if (ready) {
    const glass = await plugin.createButtonVariant({
      variant: "Glass",
      size: "Default",
      state: "Default",
      variableByName,
      fonts: FONTS,
      textStyle: null,
      stats: freshStats(),
    });
    const fill = glass.fills[0];
    const stroke = glass.strokes[0];
    ok(
      boundVariableName(fill) === "Colors/transparent/inverted/10" &&
        near(fill.opacity, alphaOf("#FCFCFD1A")),
      `Glass's fill is transparent/inverted/10 at its 10 % (${fill && fill.opacity})`,
    );
    ok(
      boundVariableName(stroke) === "Border/bevel/top" &&
        near(stroke.opacity, alphaOf("#FFFFFF80")),
      `Glass's bevel is Border/bevel/top at its 50 % (${stroke && stroke.opacity})`,
    );
    // The audit, as in Dark: the label (foreground/0, #FFFFFF) on the Glass
    // fill over Surface/0 (#000000). Its paint reader takes the paint's
    // opacity, as the file draws.
    const context = plugin.createVariableContext([], []);
    const read = plugin.solidPaintToRgba(fill, context, "Dark");
    const onBlack = {
      r: read.r * read.a,
      g: read.g * read.a,
      b: read.b * read.a,
    };
    const lin = (v) =>
      v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    const lum = (c) =>
      0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const darkRatio = (1 + 0.05) / (lum(onBlack) + 0.05);
    ok(
      darkRatio >= 4.5,
      `the audit reads Glass's label in Dark at 4.5 or more (${darkRatio.toFixed(2)})`,
    );

    const backdrop = await plugin.createBackdropVariant({
      props: { visibility: "Visible" },
      variableByName,
      stats: freshStats(),
    });
    ok(
      boundVariableName(backdrop.fills[0]) === "Overlay/Scrim" &&
        near(backdrop.fills[0].opacity, alphaOf("#00000080")),
      `Backdrop's scrim is Overlay/Scrim at its 50 % (${backdrop.fills[0] && backdrop.fills[0].opacity})`,
    );
  }

  // The mock itself: it keeps a bound paint at its token's own alpha and
  // drops a strength laid on an opaque token, which is what the file did.
  const before = boundPaintOpacityDrops.length;
  const probe = figma.createRectangle();
  probe.name = "Probe";
  probe.fills = [
    {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 },
      opacity: alphaOf("#FCFCFD1A"),
      boundVariables: {
        color: {
          type: "VARIABLE_ALIAS",
          id: "VariableID:Colors/transparent/inverted/10",
        },
      },
    },
  ];
  const keptAlpha = probe.fills[0].opacity;
  probe.fills = [
    {
      type: "SOLID",
      color: { r: 0, g: 0, b: 0 },
      opacity: 0.05,
      boundVariables: {
        color: { type: "VARIABLE_ALIAS", id: "VariableID:Colors/theme/500" },
      },
    },
  ];
  const droppedStrength = probe.fills[0].opacity;
  const recorded = boundPaintOpacityDrops.length - before;
  boundPaintOpacityDrops.splice(before);
  ok(
    near(keptAlpha, alphaOf("#FCFCFD1A")) &&
      droppedStrength === undefined &&
      recorded === 1,
    "the mock keeps a token's own alpha on the paint and drops a laid-on strength",
  );
}

section("Surface QA specs name real variants");
{
  const groups = plugin.SURFACE_QA_COMPONENT_GROUPS;
  const ready =
    Array.isArray(groups) &&
    typeof plugin.expectedVariantAxesForComponentSetName === "function";
  ok(ready, "the Surface QA specs and the expected axes are reachable");
  if (ready) {
    const specs = groups.flatMap((group) => group.rows.flat());
    const wrong = specs.filter((spec) => {
      const axes = plugin.expectedVariantAxesForComponentSetName(
        spec.componentSetName,
      );
      if (!axes) return true;
      const pairs = spec.variantName.split(", ").map((pair) => pair.split("="));
      const named = pairs.map(([key]) => key);
      return (
        named.length !== Object.keys(axes).length ||
        !Object.keys(axes).every((key) => named.includes(key)) ||
        !pairs.every(([key, value]) => (axes[key] || []).includes(value))
      );
    });
    ok(
      specs.length > 0 && wrong.length === 0,
      `every Surface QA instance names a variant its set has (${wrong
        .map((spec) => `${spec.componentSetName} / ${spec.variantName}`)
        .join("; ")})`,
    );
  }
}

// --- Typography: the audit's guess follows the field painters -----------------------

section("Typography inference");
{
  // Each field painter draws its label-like texts with the Medium label style;
  // the audit guesses a style from the set and the node's name. On 2026-09-21
  // the guess called 160 of those texts stale in the live file.
  const cases = [
    ["DateRangePicker", "Start Label Text", "fieldLabel"],
    ["DateRangePicker", "End Label Text", "fieldLabel"],
    ["DateRangePicker", "Start Month Text", "fieldLabel"],
    ["DatePicker", "Month Text", "fieldLabel"],
    ["FormField", "Required Mark", "fieldLabel"],
    ["FileUpload", "Browse Text", "fieldLabel"],
    ["FileUpload", "Drop Text", "fieldText"],
    ["Input", "Label Text", "fieldLabel"],
    ["Input", "Optional Text", "fieldMeta"],
    ["Input", "Value Text", "fieldText"],
  ];
  const ready = typeof plugin.inferTextStyleKeyForComponentText === "function";
  ok(ready, "the audit's style guess is reachable");
  for (const [setName, textName, expected] of ready ? cases : []) {
    const set = new MockNode("COMPONENT_SET", setName);
    const component = new MockNode("COMPONENT", "State=Default");
    const text = new MockNode("TEXT", textName);
    component.appendChild(text);
    set.appendChild(component);
    const key = plugin.inferTextStyleKeyForComponentText(text, set);
    ok(
      key === expected,
      `${setName} · ${textName} is ${expected} (got ${key})`,
    );
  }
  const source = fs.readFileSync(PLUGIN, "utf8");
  ok(
    /browse\.name = "Browse Text";[\s\S]{0,400}?applyFieldLabelTypography\(\s*browse,/.test(
      source,
    ) && !/browse\.fontName = fonts\.medium/.test(source),
    "FileUpload's browse text takes the Medium label style, no weight override",
  );
}

// --- Component lookups -------------------------------------------------------------

// Painters ask for an icon once per variant: 1,044 times in the Tree block. A
// lookup that searched the pages in order walked the whole Components page,
// 27k nodes in the live file, before it reached Icons, 28.7 million node
// visits for the three Tree sets, and Update All Core stalled there. An icon
// is looked up on Icons first and kept while it is still in the file under
// its name.
section("Component lookups");
{
  const registry = fs.readFileSync(
    path.join(ROOT, "packages/icons/src/registry.ts"),
    "utf8",
  );
  const iconNames = [
    ...registry
      .slice(
        registry.indexOf("export const kozmosIconNames = ["),
        registry.indexOf("] as const"),
      )
      .matchAll(/^\s+"([a-z0-9-]+)",$/gm),
  ].map((match) => match[1]);
  const components = new MockNode("PAGE", "Components");
  const decoy = mockIconComponent("chevron-down");
  const decoyHolder = new MockNode("FRAME", "Pasted Example");
  decoyHolder.appendChild(decoy);
  components.appendChild(decoyHolder);
  for (let index = 0; index < 200; index += 1) {
    components.appendChild(new MockNode("FRAME", `Filler ${index}`));
  }
  const elsewhere = new MockNode("PAGE", "Examples");
  const strayIcon = new MockNode("COMPONENT", "Icon / only-in-examples");
  elsewhere.appendChild(strayIcon);
  const icons = new MockNode("PAGE", "Icons");
  for (const name of iconNames) icons.appendChild(mockIconComponent(name));
  const lookupFigma = createFigmaMock({
    pages: [components, icons, elsewhere],
  });
  const lookupPlugin = loadPlugin({ pluginPath: PLUGIN, figma: lookupFigma });
  const ready =
    typeof lookupPlugin.findKozmosIconSourceComponent === "function" &&
    typeof lookupPlugin.treeItemComponentConfig === "function";
  ok(ready, "the icon lookup and the Tree painter are reachable");
  if (ready) {
    const find = lookupPlugin.findKozmosIconSourceComponent;
    const canonical = icons.findChild(
      (node) => node.name === "Icon / chevron-down",
    );

    resetSearchStats();
    const first = await find("chevron-down");
    ok(
      first === canonical,
      "an icon comes from the Icons page, not a same-named copy on Components",
    );
    ok(
      !searchStats.pageSearches.Components,
      `an icon on Icons is found without searching Components (searched: ${JSON.stringify(searchStats.pageSearches)})`,
    );

    resetSearchStats();
    const again = await find("chevron-down");
    ok(
      again === canonical && searchStats.visits === 0,
      `an icon found once is not searched for again (${searchStats.visits} nodes visited)`,
    );

    canonical.remove();
    const replacement = mockIconComponent("chevron-down");
    icons.appendChild(replacement);
    const afterRemoval = await find("chevron-down");
    ok(
      afterRemoval === replacement,
      "a removed icon is not handed out; its replacement on Icons is",
    );

    replacement.name = "Icon / chevron-down-renamed";
    const afterRename = await find("chevron-down");
    ok(
      afterRename !== replacement,
      "a renamed icon is not handed out under its old name",
    );

    const stray = await find("only-in-examples");
    ok(
      stray === strayIcon,
      "an icon missing from Icons is still found on another page",
    );

    const config = lookupPlugin.treeItemComponentConfig();
    const actionRow = config
      .combinations()
      .find(
        (props) =>
          props.content === "Actions" &&
          props.state === "Selected" &&
          props.type === "Parent",
      );
    ok(Boolean(actionRow), "the Tree has a selected parent row with actions");
    if (actionRow) {
      resetSearchStats();
      const row = lookupFigma.createComponent();
      await config.updateVariant(row, {
        props: actionRow,
        variableByName,
        fonts: FONTS,
        stats: freshStats(),
      });
      const searched = Object.keys(searchStats.pageSearches);
      ok(
        searched.every((page) => page === "Icons"),
        `a Tree row's icons are read from Icons alone (searched: ${searched.join(", ") || "none"})`,
      );
      const instances = row.findAll((node) => node.type === "INSTANCE");
      ok(
        instances.length >= 3 &&
          instances.every(
            (instance) =>
              instance.mainComponent && instance.mainComponent.parent === icons,
          ),
        `every icon in the row is an instance of an Icons page component (${instances.length} instances)`,
      );
    }
  }
}

// --- What the audit reads under a wash ----------------------------------------------

// A translucent wash is a layer of its own at the back of the frame. The
// contrast audit composites it, at the paint's alpha times the layer's
// opacity, into what the frame's content sits on: CategoryField's yellow
// label on its 12 % wash is 1.77, not the 1.92 of the label on white the
// audit would read if it skipped the layer, nor 1.0 if it took the layer
// opaque.
section("What the audit reads under a wash");
{
  const ready =
    typeof plugin.contrastChildBackground === "function" &&
    typeof plugin.createVariableContext === "function" &&
    typeof plugin.updateCategoryFieldVariant === "function" &&
    typeof plugin.updateDirectionStepVariant === "function";
  ok(ready, "the audit's background and the two painters are reachable");
  if (ready) {
    const context = plugin.createVariableContext([], []);
    const white = { r: 1, g: 1, b: 1, a: 1 };
    const rgb = (paint) => ({ ...paint.color, a: 1 });
    const luminance = (c) => {
      const lin = (v) =>
        v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    };
    const ratio = (a, b) => {
      const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    const over = (top, alpha, under) => ({
      r: top.r * alpha + under.r * (1 - alpha),
      g: top.g * alpha + under.g * (1 - alpha),
      b: top.b * alpha + under.b * (1 - alpha),
      a: 1,
    });

    const field = figma.createComponent();
    await plugin.updateCategoryFieldVariant(field, {
      value: "Yellow",
      variableByName,
      fonts: FONTS,
      stats: freshStats(),
    });
    const wash = named(field, "Tint Wash");
    const icon = named(field, "Icon");
    const glyph = icon && icon.findOne((node) => node.type === "VECTOR");
    // A build without the wash layer fails here rather than stopping the run.
    ok(wash && glyph, "the field draws its wash layer and an icon glyph");
    if (wash && glyph) {
      const read = plugin.contrastChildBackground(
        field,
        white,
        context,
        "Light",
      );
      const expected = over(rgb(wash.fills[0]), wash.opacity, white);
      ok(
        ["r", "g", "b"].every((k) => Math.abs(read[k] - expected[k]) < 1e-6),
        "the audit reads the field's content on its 12 % wash, composited",
      );
      const measured = ratio(rgb(glyph.strokes[0]), read);
      ok(
        Math.abs(measured - 1.77) < 0.01 &&
          measured < ratio(rgb(glyph.strokes[0]), white) - 0.1,
        `the yellow icon reads ${measured.toFixed(2)} on the wash, below its ${ratio(rgb(glyph.strokes[0]), white).toFixed(2)} on white`,
      );
    }

    const step = figma.createComponent();
    await plugin.updateDirectionStepVariant(step, {
      value: "Straight",
      variableByName,
      fonts: FONTS,
      stats: freshStats(),
    });
    const disc = named(step, "Direction Icon");
    const discWash = disc && named(disc, "Direction Wash");
    ok(disc && discWash, "the step draws its disc's wash layer");
    if (disc && discWash) {
      const discRead = plugin.contrastChildBackground(
        disc,
        white,
        context,
        "Light",
      );
      const discTruth = over(rgb(discWash.fills[0]), discWash.opacity, white);
      ok(
        Math.abs(discRead.r - discTruth.r) < 1e-6 &&
          Math.abs(discRead.g - discTruth.g) < 1e-6 &&
          Math.abs(discRead.b - discTruth.b) < 1e-6,
        "the direction glyph is read on its disc's 10 % wash",
      );
    }
  }
}

// --- Decorative icons -------------------------------------------------------------------

// The category tile's and field's symbol is named by the label beside it, so
// WCAG 1.4.11 does not ask 3:1 of it (Olcay, 2026-09-21). The painters mark
// it; the audit measures it apart and reports a shortfall as an advisory,
// never as a failure and never silently. A control's glyph stays held to 3:1.
section("Decorative icons");
{
  const ready =
    typeof plugin.isDecorativeIcon === "function" &&
    typeof plugin.auditNodeContrast === "function" &&
    typeof plugin.createContrastAuditResult === "function";
  ok(ready, "the decorative mark and the audit's traversal are reachable");
  if (ready) {
    const tile = figma.createComponent();
    await plugin.updateCategoryTileVariant(tile, {
      props: { state: "Default", tint: "Yellow" },
      variableByName,
      fonts: FONTS,
      stats: freshStats(),
    });
    const tileIcon = tile.findOne(
      (node) => node.type === "INSTANCE" && node.name === "Icon",
    );
    ok(
      tileIcon && plugin.isDecorativeIcon(tileIcon),
      "the tile's category icon is marked decorative",
    );
    const field = figma.createComponent();
    await plugin.updateCategoryFieldVariant(field, {
      value: "Yellow",
      variableByName,
      fonts: FONTS,
      stats: freshStats(),
    });
    const fieldIcon = named(field, "Icon");
    const clearIcon = named(field, "Clear Icon");
    ok(
      fieldIcon &&
        plugin.isDecorativeIcon(fieldIcon) &&
        clearIcon &&
        !plugin.isDecorativeIcon(clearIcon),
      "the field's category icon is decorative; its clear's cross is not",
    );

    const context = plugin.createVariableContext([], []);
    const result = plugin.createContrastAuditResult();
    plugin.auditNodeContrast(
      tile,
      { r: 1, g: 1, b: 1, a: 1 },
      false,
      result,
      context,
      tile.name,
      "Light",
    );
    ok(
      result.nonTextFailures === 0 &&
        result.decorativePairs >= 1 &&
        result.decorativeBelowThree >= 1 &&
        result.decorativeShortfalls[0].kind === "decorative",
      `the yellow tile's icon is measured as decorative: ${result.decorativeBelowThree} below 3:1, ${result.nonTextFailures} failures`,
    );
    const source = fs.readFileSync(PLUGIN, "utf8");
    ok(
      /record\.contrast\.decorativeBelowThree > 0[\s\S]{0,400}?record\.advisories\.push\(/.test(
        source,
      ),
      "a decorative shortfall is reported as an advisory",
    );
  }
}

// --- The audit reads every fill ----------------------------------------------------

// Figma paints a node's fills bottom to top, so a second fill covers the first.
// c7d1d88351a7 drew each Selected CategoryTile square white under an opaque
// tint, its icon in the tint: rendered over REST the icon is not there to see,
// while the audit, reading the first fill alone, measured it on white at 1.92
// and passed six of the nine tints (2026-09-21).
section("The audit reads every fill");
{
  const ready =
    typeof plugin.auditNodeContrast === "function" &&
    typeof plugin.createContrastAuditResult === "function" &&
    typeof plugin.createVariableContext === "function";
  ok(ready, "the audit's traversal is reachable");
  if (ready) {
    const context = plugin.createVariableContext([], []);
    const white = { r: 1, g: 1, b: 1 };
    const black = { r: 0, g: 0, b: 0 };
    const yellow = { r: 0xf9 / 255, g: 0xac / 255, b: 0x17 / 255 };
    const solid = (color, opacity = 1) => ({
      type: "SOLID",
      color,
      opacity,
      visible: true,
    });
    const luminance = (c) => {
      const lin = (v) =>
        v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    };
    const ratio = (a, b) => {
      const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    const audit = (frame) => {
      const result = plugin.createContrastAuditResult();
      plugin.auditNodeContrast(
        frame,
        { ...white, a: 1 },
        false,
        result,
        context,
        "Stacked",
        "Light",
      );
      return result;
    };
    const square = (fills, glyphColor) => {
      const frame = new MockNode("FRAME", "Icon Square");
      frame.fills = fills;
      const glyph = new MockNode("VECTOR", "Glyph");
      glyph.strokes = [solid(glyphColor)];
      frame.appendChild(glyph);
      return frame;
    };

    const covered = audit(square([solid(white), solid(yellow)], yellow));
    ok(
      covered.nonTextFailures === 1 &&
        Math.abs(covered.minNonTextContrast - 1) < 1e-9,
      `a glyph in the colour of the fill on top reads 1:1 (read ${covered.minNonTextContrast && covered.minNonTextContrast.toFixed(2)})`,
    );
    const tint = 0.2;
    const washed = audit(square([solid(white), solid(yellow, tint)], yellow));
    const under = {
      r: yellow.r * tint + white.r * (1 - tint),
      g: yellow.g * tint + white.g * (1 - tint),
      b: yellow.b * tint + white.b * (1 - tint),
    };
    ok(
      Math.abs(washed.minNonTextContrast - ratio(yellow, under)) < 1e-9,
      `a translucent fill on top is composited: ${washed.minNonTextContrast && washed.minNonTextContrast.toFixed(2)}, expected ${ratio(yellow, under).toFixed(2)}`,
    );

    const panel = new MockNode("FRAME", "Panel");
    panel.fills = [solid(white), solid(black)];
    const label = new MockNode("TEXT", "Label Text");
    label.characters = "Label";
    label.fills = [solid(white)];
    panel.appendChild(label);
    const text = audit(panel);
    ok(
      text.textFailures === 0 && Math.abs(text.minTextContrast - 21) < 1e-9,
      `white text on a black fill over white reads 21:1 (read ${text.minTextContrast && text.minTextContrast.toFixed(2)})`,
    );
  }
}

// --- Every set's text carries a style ------------------------------------------------

// The audit held a hand-kept list of the sets to hold to their text styles, and
// FileUpload was not on it: its 32 browse labels lost their style on
// c7d1d88351a7, a weight set after the style detaching it, and no audit said
// so (2026-09-21).
section("Every set's text carries a style");
{
  const ready =
    typeof plugin.auditComponentSet === "function" &&
    typeof plugin.createAuditPerformance === "function";
  ok(ready, "the set audit is reachable");
  if (ready) {
    const textWarnings = (name, withUnstyled) => {
      const set = mockComponentSet(name, [
        {
          properties: { State: "Default" },
          build: (variant) => {
            variant.resize(320, 48);
            const styled = new MockNode("TEXT", "Label Text");
            styled.characters = "Label";
            styled.textStyleId = "S:field-label,";
            variant.appendChild(styled);
            if (withUnstyled) {
              const bare = new MockNode("TEXT", "Browse Text");
              bare.characters = "Click to upload";
              variant.appendChild(bare);
            }
          },
        },
      ]);
      const record = plugin.auditComponentSet(
        set,
        "Components",
        plugin.createVariableContext([], []),
        plugin.createAuditPerformance(),
      );
      return record.warnings.filter((warning) =>
        /text style|typography/i.test(warning),
      );
    };
    const fileUpload = textWarnings("FileUpload", true);
    ok(
      fileUpload.length === 1 &&
        /^1 text node\(s\) are missing Figma text styles/.test(fileUpload[0]),
      `FileUpload's unstyled label is reported: ${JSON.stringify(fileUpload)}`,
    );
    const button = textWarnings("Button", true);
    ok(
      button.length === 1,
      `a set with no bound typography reports its unstyled text once, not twice (${button.length})`,
    );
    ok(
      textWarnings("FileUpload", false).length === 0,
      "a set whose text all carries styles reports nothing",
    );
  }
}

// --- The product sets audit clean ------------------------------------------------------

// Every variant of the four sets the audit of 2026-09-21 20:38 warned on,
// painted as Update paints it and audited in Light and Dark with the token
// values the importer writes: no text below 4.5:1, no control below 3:1, and
// the category symbols, named by their labels, measured apart as decorative.
// Their c7d1d88351a7 drawings read five warnings live; replayed through this
// build's Update, none.
section("The product sets audit clean");
{
  const painters = [
    "updateDirectionStepVariant",
    "updateLocationPinVariant",
    "updateCategoryTileVariant",
    "updateCategoryFieldVariant",
  ];
  const ready =
    painters.every((name) => typeof plugin[name] === "function") &&
    typeof plugin.auditComponentContrast === "function";
  ok(ready, "the four painters and the contrast audit are reachable");
  if (ready) {
    const tokens = payloadVariables([...variableByName.keys()]);
    const context = plugin.createVariableContext(
      tokens.collections,
      tokens.variables,
    );
    const tints = plugin.CATEGORY_TINTS;
    const sets = [
      [
        "DirectionStep",
        plugin.DIRECTION_STEP_TYPES.map((value) => [
          "updateDirectionStepVariant",
          { value },
        ]),
      ],
      [
        "LocationPin",
        plugin.LOCATION_PIN_STATES.flatMap((state) =>
          plugin.LOCATION_PIN_SIZES.flatMap((size) =>
            tints.map((tint) => [
              "updateLocationPinVariant",
              { props: { state, size, tint } },
            ]),
          ),
        ),
      ],
      [
        "CategoryTile",
        plugin.CATEGORY_TILE_STATES.flatMap((state) =>
          tints.map((tint) => [
            "updateCategoryTileVariant",
            { props: { state, tint } },
          ]),
        ),
      ],
      [
        "CategoryField",
        tints.map((value) => ["updateCategoryFieldVariant", { value }]),
      ],
    ];
    for (const [name, variants] of sets) {
      const set = new MockNode("COMPONENT_SET", name);
      for (const [painter, args] of variants) {
        const component = figma.createComponent();
        await plugin[painter](component, {
          ...args,
          variableByName: tokens.variableByName,
          fonts: FONTS,
          stats: freshStats(),
        });
        set.appendChild(component);
      }
      const contrast = plugin.auditComponentContrast(
        set,
        set.children,
        context,
      );
      const modes = contrast.byMode
        .map(
          (mode) =>
            `${mode.mode} text ${mode.minTextContrast}, non-text ${mode.minNonTextContrast}`,
        )
        .join("; ");
      ok(
        contrast.byMode.length === 2 &&
          contrast.textFailures === 0 &&
          contrast.nonTextFailures === 0,
        `${name}: ${variants.length} variants, no failure in Light or Dark (${modes}; ${contrast.failures
          .slice(0, 3)
          .map((f) => `${f.mode} ${f.node} ${f.ratio}`)
          .join(", ")})`,
      );
      if (name === "CategoryTile" || name === "CategoryField") {
        ok(
          contrast.decorativeBelowThree > 0 &&
            contrast.decorativeShortfalls.every(
              (shortfall) => shortfall.kind === "decorative",
            ),
          `${name}: the category symbols below 3:1 are measured as decorative (${contrast.decorativeBelowThree})`,
        );
      }
    }
  }
}

// --- Layout sizing Figma accepts ---------------------------------------------------

// A run on 2026-09-21 logged 319 layout sizing calls Figma refused: HUG on
// icon instances and a rectangle, which have no content to hug, and FILL on
// a node outside an auto-layout parent or before it was appended. The harness
// refuses what Figma refuses; every config painter, and the Slider, must ask
// for sizing Figma accepts.
section("Layout sizing Figma accepts");
{
  const sizingIcons = new MockNode("PAGE", "Icons");
  const registry = fs.readFileSync(
    path.join(ROOT, "packages/icons/src/registry.ts"),
    "utf8",
  );
  for (const match of registry
    .slice(
      registry.indexOf("export const kozmosIconNames = ["),
      registry.indexOf("] as const"),
    )
    .matchAll(/^\s+"([a-z0-9-]+)",$/gm)) {
    sizingIcons.appendChild(mockIconComponent(match[1]));
  }
  const sizingFigma = createFigmaMock({
    pages: [new MockNode("PAGE", "Components"), sizingIcons],
  });
  const sizingPlugin = loadPlugin({ pluginPath: PLUGIN, figma: sizingFigma });
  const ready =
    Array.isArray(sizingPlugin.layoutSizingFailures) &&
    typeof sizingPlugin.resetLayoutSizingFailures === "function";
  ok(ready, "the plugin records the sizing Figma refuses");
  const source = fs.readFileSync(PLUGIN, "utf8");
  const configNames = [
    ...source.matchAll(/^function ([a-zA-Z]+ComponentConfig)\(\)/gm),
  ].map((match) => match[1]);
  const painters = configNames
    .filter((name) => typeof sizingPlugin[name] === "function")
    .map((name) => {
      const config = sizingPlugin[name]();
      return {
        name: config.componentName || name,
        variants: config.combinations(),
        paint: (component, props) =>
          config.updateVariant(component, {
            props,
            variableByName,
            fonts: FONTS,
            stats: freshStats(),
          }),
      };
    });
  if (typeof sizingPlugin.updateSliderVariant === "function") {
    const variants = [];
    for (const state of sizingPlugin.SLIDER_STATES) {
      for (const status of sizingPlugin.SLIDER_STATUSES) {
        for (const type of sizingPlugin.SLIDER_TYPES) {
          variants.push({ state, status, type });
        }
      }
    }
    painters.push({
      name: "Slider",
      variants,
      paint: (component, props) =>
        sizingPlugin.updateSliderVariant(component, {
          ...props,
          variableByName,
          fonts: FONTS,
          stats: freshStats(),
        }),
    });
  }
  ok(painters.length >= 19, `${painters.length} painters are measured`);
  for (const painter of ready ? painters : []) {
    sizingPlugin.resetLayoutSizingFailures();
    for (const props of painter.variants) {
      await painter.paint(sizingFigma.createComponent(), props);
    }
    const refused = sizingPlugin.layoutSizingFailures.slice();
    ok(
      refused.length === 0,
      `${painter.name} asks only for sizing Figma accepts${
        refused.length
          ? ` (${refused.length} refused, e.g. ${refused
              .slice(0, 2)
              .map((f) => `${f.node} ${f.axis}=${f.value}`)
              .join("; ")})`
          : ""
      }`,
    );
  }
}

// --- The build a run names ---------------------------------------------------------

// A pasted audit or a panel is only evidence about the build that produced it,
// and Figma can keep an older import running. The panel asks once it loads and
// shows the answer; the audit report carries it.
section("The build a run names");
{
  const posted = [];
  const buildFigma = createFigmaMock({ pages: pages() });
  buildFigma.ui.postMessage = (message) => posted.push(message);
  const buildPlugin = loadPlugin({ pluginPath: PLUGIN, figma: buildFigma });
  const stamp = (fs
    .readFileSync(PLUGIN, "utf8")
    .match(/const PLUGIN_BUILD = "([0-9a-f]+)";/) || [])[1];
  ok(Boolean(stamp), "the plugin carries a build stamp");
  const handler = buildFigma.ui.onmessage;
  ok(typeof handler === "function", "the plugin listens to the panel");
  if (typeof handler === "function") {
    await handler({ type: "ui-ready" });
    const reply = posted.find((message) => message.type === "plugin-build");
    ok(
      Boolean(reply) && reply.build === stamp,
      `the panel's ready message is answered with the build (${reply ? reply.build : "no answer"})`,
    );
  }
  const source = fs.readFileSync(PLUGIN, "utf8");
  ok(
    /const audit = \{[\s\S]{0,400}?pluginBuild: PLUGIN_BUILD,/.test(source),
    "the audit report names the build that wrote it",
  );
  ok(Boolean(buildPlugin), "the plugin loads for the build check");
}

section("Bound paint opacities");
// Every painter above ran against a mock that keeps a bound paint at its
// token's own alpha and drops any other opacity; a strength goes on the layer.
ok(
  boundPaintOpacityDrops.length === 0,
  `no painter laid a strength on a bound paint (${boundPaintOpacityDrops
    .slice(0, 6)
    .map((drop) => `${drop.node}: ${drop.token} at ${drop.opacity}`)
    .join(", ")})`,
);

// --- Summary ---------------------------------------------------------------------

console.log(
  `\n${passes} passed, ${failures} failed — ${path.relative(ROOT, PLUGIN)}`,
);
process.exit(failures === 0 ? 0 : 1);
