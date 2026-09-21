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
    ok(
      boundVariableName(component.fills[0]) === "Category/Accent/Yellow" &&
        Math.abs(component.fills[0].opacity - 0.12) < 1e-9,
      "the accent at 12 % behind",
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
        boundVariableName(label.fills[0]) === "Category/Accent/Yellow",
      "the label 15/20 in the accent",
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
        boundVariableName(crossVector.strokes[0]) === "Category/Accent/Yellow",
      "the clear's cross is a 16 x-close in the accent",
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
        boundVariableName(badge.fills[0]) === "Colors/theme/500" &&
        Math.abs(badge.fills[0].opacity - 0.1) < 1e-9,
      `${type}: a 40 disc in the theme's colour at 10 %`,
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
  }
}

// --- Summary ---------------------------------------------------------------------

console.log(
  `\n${passes} passed, ${failures} failed — ${path.relative(ROOT, PLUGIN)}`,
);
process.exit(failures === 0 ? 0 : 1);
