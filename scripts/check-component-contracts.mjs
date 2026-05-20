import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractPath = path.join(
  root,
  "packages/tokens/src/component-contracts.json",
);
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function getJsonPath(value, segments) {
  return segments.reduce((current, segment) => current?.[segment], value);
}

function fail(message) {
  throw new Error(message);
}

function assertContains(filePath, content, pattern, label) {
  const ok =
    pattern instanceof RegExp
      ? pattern.test(content)
      : content.includes(pattern);
  if (!ok) {
    fail(`${filePath}: missing ${label}`);
  }
}

function assertNotContains(filePath, content, pattern, label) {
  const ok =
    pattern instanceof RegExp
      ? !pattern.test(content)
      : !content.includes(pattern);
  if (!ok) {
    fail(`${filePath}: unexpected ${label}`);
  }
}

function assertMissing(filePath, label) {
  if (fs.existsSync(path.join(root, filePath))) {
    fail(`${filePath}: unexpected ${label}`);
  }
}

function assertJsonPathEquals(filePath, value, segments, expected, label) {
  const actual = getJsonPath(value, segments);
  if (actual !== expected) {
    fail(
      `${filePath}: expected ${label} to be ${expected}, received ${String(actual)}`,
    );
  }
}

function assertFigmaPayloadDarkValue(filePath, payload, canonicalName, expected) {
  const variable = payload.variables.find(
    (entry) => entry.canonicalName === canonicalName,
  );
  if (!variable) {
    fail(`${filePath}: missing variable ${canonicalName}`);
  }

  const actual = variable.values?.dark?.value;
  if (actual !== expected) {
    fail(
      `${filePath}: expected ${canonicalName} dark value to be ${expected}, received ${String(actual)}`,
    );
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenValuePattern(name, value) {
  return new RegExp(
    `name:\\s*"${escapeRegExp(name)}",\\s*value:\\s*${escapeRegExp(String(value))}\\b`,
    "s",
  );
}

function assertOrder(filePath, content, before, after, label) {
  const beforeIndex = content.indexOf(before);
  const afterIndex = content.indexOf(after);
  if (beforeIndex === -1 || afterIndex === -1 || beforeIndex > afterIndex) {
    fail(`${filePath}: invalid order for ${label}`);
  }
}

function assertAllVariants(filePath, content, variants, mapper, label) {
  for (const variant of variants) {
    assertContains(
      filePath,
      content,
      mapper(variant),
      `${label} variant "${variant}"`,
    );
  }
}

const files = {
  figma: "figma/foundations-importer/code.js",
  figmaUi: "figma/foundations-importer/ui.html",
  figmaReadme: "figma/foundations-importer/README.md",
  figmaLinked: "figma.linked.config.json",
  reactText: "packages/react/src/components/Text/Text.tsx",
  reactButton: "packages/react/src/components/Button/Button.tsx",
  reactIconButton: "packages/react/src/components/IconButton/IconButton.tsx",
  reactCounter: "packages/react/src/components/Counter/Counter.tsx",
  reactCounterFigma: "packages/react/src/components/Counter/Counter.figma.tsx",
  reactBadge: "packages/react/src/components/Badge/Badge.tsx",
  reactBadgeFigma: "packages/react/src/components/Badge/Badge.figma.tsx",
  reactCardFigma: "packages/react/src/components/Card/Card.figma.tsx",
  reactTabsFigma: "packages/react/src/components/Tabs/Tabs.figma.tsx",
  reactCheckbox: "packages/react/src/components/Checkbox/Checkbox.tsx",
  reactRadio: "packages/react/src/components/Radio/Radio.tsx",
  reactSwitch: "packages/react/src/components/Switch/Switch.tsx",
  reactInput: "packages/react/src/components/Input/Input.tsx",
  reactInputFigma: "packages/react/src/components/Input/Input.figma.tsx",
  reactSelect: "packages/react/src/components/Select/Select.tsx",
  reactSlider: "packages/react/src/components/Slider/Slider.tsx",
  reactTextareaFigma:
    "packages/react/src/components/Textarea/Textarea.figma.tsx",
  reactSearchFigma: "packages/react/src/components/Search/Search.figma.tsx",
  reactSelectFigma: "packages/react/src/components/Select/Select.figma.tsx",
  reactSliderFigma: "packages/react/src/components/Slider/Slider.figma.tsx",
  reactProgressFigma:
    "packages/react/src/components/Progress/Progress.figma.tsx",
  reactSpinnerFigma: "packages/react/src/components/Spinner/Spinner.figma.tsx",
  reactAvatarFigma: "packages/react/src/components/Avatar/Avatar.figma.tsx",
  reactAlertFigma: "packages/react/src/components/Alert/Alert.figma.tsx",
  reactTailwindConfig: "packages/react/tailwind.config.js",
  reactTooltip: "packages/react/src/components/Tooltip/Tooltip.tsx",
  reactTooltipFigma: "packages/react/src/components/Tooltip/Tooltip.figma.tsx",
  reactIndex: "packages/react/src/index.ts",
  vueIndex: "packages/vue/src/index.ts",
  figmaManifest: "docs/figma-library-manifest.json",
  figmaManifestScript: "scripts/figma-build-manifest.mjs",
  nativeStubGenerator: "scripts/skills/generate-native-stubs.js",
  iosFigmaLinked: "packages/ios/figma.linked.config.json",
  iosButton: "packages/ios/Sources/Components/Button/Button.swift",
  iosIconButton: "packages/ios/Sources/Components/IconButton/IconButton.swift",
  iosCounter: "packages/ios/Sources/Components/Counter/Counter.swift",
  iosCounterFigma: "packages/ios/Sources/Components/Counter/Counter.figma.swift",
  iosBadge: "packages/ios/Sources/Components/Badge/Badge.swift",
  iosBadgeFigma: "packages/ios/Sources/Components/Badge/Badge.figma.swift",
  iosCheckbox: "packages/ios/Sources/Components/Checkbox/Checkbox.swift",
  iosRadio: "packages/ios/Sources/Components/Radio/Radio.swift",
  iosSwitch: "packages/ios/Sources/Components/Switch/Switch.swift",
  iosInput: "packages/ios/Sources/Components/Input/Input.swift",
  iosTooltip: "packages/ios/Sources/Components/Tooltip/Tooltip.swift",
  androidButton:
    "packages/android/src/main/java/com/kozmos/components/Button/Button.kt",
  androidFigmaLinked: "packages/android/figma.linked.config.json",
  androidIconButton:
    "packages/android/src/main/java/com/kozmos/components/IconButton/IconButton.kt",
  androidCounter:
    "packages/android/src/main/java/com/kozmos/components/Counter/Counter.kt",
  androidCounterFigma:
    "packages/android/src/main/java/com/kozmos/components/Counter/Counter.figma.kt",
  androidBadge:
    "packages/android/src/main/java/com/kozmos/components/Badge/Badge.kt",
  androidBadgeFigma:
    "packages/android/src/main/java/com/kozmos/components/Badge/Badge.figma.kt",
  androidCheckbox:
    "packages/android/src/main/java/com/kozmos/components/Checkbox/Checkbox.kt",
  androidRadio:
    "packages/android/src/main/java/com/kozmos/components/Radio/Radio.kt",
  androidSwitch:
    "packages/android/src/main/java/com/kozmos/components/Switch/Switch.kt",
  androidInput:
    "packages/android/src/main/java/com/kozmos/components/Input/Input.kt",
  androidTooltip:
    "packages/android/src/main/java/com/kozmos/components/Tooltip/Tooltip.kt",
  androidThemeTokens:
    "packages/android/src/main/java/com/kozmos/tokens/KozmosThemeTokens.kt",
  androidThemeProvider:
    "packages/android/src/main/java/com/kozmos/components/ThemeProvider/ThemeProvider.kt",
  tokensDark: "packages/tokens/src/tokens-dark.json",
  figmaFoundationsPayload: "docs/figma-foundations-payload.json",
  iosColors: "packages/ios/Sources/KozmosColors.swift",
  androidColorsDark:
    "packages/android/src/main/java/com/kozmos/tokens/KozmosColorsDark.kt",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, filePath]) => [key, read(filePath)]),
);
const tokensDark = JSON.parse(source.tokensDark);
const figmaFoundationsPayload = JSON.parse(source.figmaFoundationsPayload);

const {
  button,
  iconButton,
  counter,
  badge,
  checkbox,
  radio,
  switch: switchContract,
  input,
} = contract.components;
const target = button.sizes.default.height;

if (target !== 44)
  fail("component contract must keep the current v1 target at 44px");

// React and Vue parity.
assertNotContains(
  files.reactIndex,
  source.reactIndex,
  "GlassSettingsPanel",
  "dev-only GlassSettingsPanel public React export",
);
assertNotContains(
  files.vueIndex,
  source.vueIndex,
  "KozmosGlassSettingsPanel",
  "dev-only GlassSettingsPanel public Vue wrapper",
);
assertNotContains(
  files.figmaManifest,
  source.figmaManifest,
  "GlassSettingsPanel",
  "dev-only GlassSettingsPanel Figma manifest entry",
);
assertContains(
  files.figmaManifestScript,
  source.figmaManifestScript,
  "INTERNAL_COMPONENT_NAMES",
  "internal component manifest exclusion list",
);
assertContains(
  files.figmaManifestScript,
  source.figmaManifestScript,
  "GlassSettingsPanel",
  "GlassSettingsPanel manifest exclusion",
);
assertNotContains(
  files.nativeStubGenerator,
  source.nativeStubGenerator,
  "GlassSettingsPanel",
  "dev-only GlassSettingsPanel native stub generation",
);
assertMissing(
  "packages/react/src/components/GlassSettingsPanel/GlassSettingsPanel.tsx",
  "dev-only GlassSettingsPanel React source",
);
assertMissing(
  "packages/ios/Sources/Components/GlassSettingsPanel/KozmosGlassSettingsPanel.swift",
  "dev-only GlassSettingsPanel iOS public stub",
);
assertMissing(
  "packages/android/src/main/java/com/kozmos/components/GlassSettingsPanel/GlassSettingsPanel.kt",
  "dev-only GlassSettingsPanel Android public stub",
);
assertContains(
  files.reactButton,
  source.reactButton,
  /default:\s*["']h-11 px-4 py-2["']/,
  "44px default Button class",
);
assertContains(
  files.reactButton,
  source.reactButton,
  /sm:\s*["']h-11 rounded-md px-3["']/,
  "44px small Button class",
);
assertContains(
  files.reactButton,
  source.reactButton,
  /icon:\s*["']h-11 w-11["']/,
  "44px icon Button class",
);
assertContains(
  files.reactIconButton,
  source.reactIconButton,
  "h-11 w-11 px-0",
  "44px IconButton root class",
);
assertContains(
  files.reactCounter,
  source.reactCounter,
  "h-5 min-w-5 px-1.5 text-xs",
  "React Counter default size class",
);
assertContains(
  files.reactCounter,
  source.reactCounter,
  "h-[18px] min-w-[18px] px-[5px] text-[11px]",
  "React Counter small size class",
);
assertContains(
  files.reactCounter,
  source.reactCounter,
  "formatCounterValue",
  "React Counter normalizes legacy wrapped values",
);
assertContains(
  files.reactCounterFigma,
  source.reactCounterFigma,
  'figma.enum("Tone"',
  "Counter Code Connect tone mapping",
);
assertContains(
  files.reactCounterFigma,
  source.reactCounterFigma,
  'figma.enum("Size"',
  "Counter Code Connect size mapping",
);
assertContains(
  files.reactCounterFigma,
  source.reactCounterFigma,
  'figma.string("Counter Text")',
  "Counter Code Connect text mapping",
);
assertContains(
  files.reactCounterFigma,
  source.reactCounterFigma,
  "node-id=149-13430",
  "Counter Code Connect node ID",
);
assertContains(
  files.reactBadge,
  source.reactBadge,
  /default:\s*["']h-11 px-4 py-2["']/,
  "44px default Badge class",
);
assertContains(
  files.reactBadge,
  source.reactBadge,
  /sm:\s*["']h-11 rounded-md px-3["']/,
  "44px small Badge class",
);
assertContains(
  files.reactBadge,
  source.reactBadge,
  /icon:\s*["']h-11 w-11["']/,
  "44px icon Badge class",
);
assertContains(
  files.reactBadge,
  source.reactBadge,
  "Counter",
  "React Badge composes Counter",
);
assertContains(
  files.reactBadge,
  source.reactBadge,
  "gap-1 rounded-md",
  "React Badge uses 4px content gap",
);
assertContains(
  files.reactCheckbox,
  source.reactCheckbox,
  "min-h-11",
  "React Checkbox 44px row target",
);
assertContains(
  files.reactCheckbox,
  source.reactCheckbox,
  "h-5 w-5",
  "React Checkbox 20px visual control",
);
assertContains(
  files.reactCheckbox,
  source.reactCheckbox,
  "border-input",
  "React Checkbox neutral unchecked border",
);
assertContains(
  files.reactRadio,
  source.reactRadio,
  "min-h-11",
  "React Radio 44px row target",
);
assertContains(
  files.reactRadio,
  source.reactRadio,
  "h-5 w-5",
  "React Radio 20px visual control",
);
assertContains(
  files.reactRadio,
  source.reactRadio,
  "border-input",
  "React Radio neutral unchecked border",
);
assertContains(
  files.reactRadio,
  source.reactRadio,
  "error?: boolean",
  "React Radio item error API",
);
assertContains(
  files.reactSwitch,
  source.reactSwitch,
  "min-h-11",
  "React Switch 44px row target",
);
assertContains(
  files.reactSwitch,
  source.reactSwitch,
  "h-6 w-11",
  "React Switch 44x24 visual track",
);
assertContains(
  files.reactSwitch,
  source.reactSwitch,
  "h-5 w-5",
  "React Switch 20px visual thumb",
);
assertContains(
  files.reactSwitch,
  source.reactSwitch,
  "border-muted-foreground bg-muted-foreground",
  "React Switch neutral unchecked track",
);
assertContains(
  files.reactInput,
  source.reactInput,
  "h-11",
  "React Input 44px field height",
);
assertContains(
  files.reactInput,
  source.reactInput,
  "rounded-md",
  "React Input 8px radius class",
);
assertContains(
  files.reactInput,
  source.reactInput,
  "--primitives-colors-foreground-500",
  "React Input neutral border token",
);
assertContains(
  files.reactInput,
  source.reactInput,
  "label?: string",
  "React Input label API",
);
assertContains(
  files.reactInput,
  source.reactInput,
  "helperText?: string",
  "React Input helper text API",
);
assertContains(
  files.reactInput,
  source.reactInput,
  "status?: InputStatus",
  "React Input validation status API",
);
assertContains(
  files.reactSelect,
  source.reactSelect,
  "flex h-11 w-full",
  "React SelectTrigger 44px field height",
);
assertContains(
  files.reactSlider,
  source.reactSlider,
  "border-[color:var(--primitives-colors-foreground-500)] bg-secondary",
  "React Slider inactive track boundary",
);
assertContains(
  files.reactInputFigma,
  source.reactInputFigma,
  'helperText: figma.boolean("Show Helper Text"',
  "Input Code Connect helper visibility mapping",
);
assertContains(
  files.reactInputFigma,
  source.reactInputFigma,
  'true: figma.string("Helper Text")',
  "Input Code Connect helper text mapping",
);
assertContains(
  files.reactInputFigma,
  source.reactInputFigma,
  "false: undefined",
  "Input Code Connect hides helper text by default",
);
assertContains(
  files.reactBadgeFigma,
  source.reactBadgeFigma,
  'counterProps: figma.boolean("Show Counter"',
  "Badge Code Connect counter visibility mapping",
);
assertContains(
  files.reactBadgeFigma,
  source.reactBadgeFigma,
  'figma.nestedProps("Counter"',
  "Badge Code Connect nested Counter mapping",
);
assertContains(
  files.reactTextareaFigma,
  source.reactTextareaFigma,
  'figma.enum("State"',
  "Textarea Code Connect state mapping",
);
assertContains(
  files.reactTextareaFigma,
  source.reactTextareaFigma,
  "node-id=80-328",
  "Textarea Code Connect node ID",
);
assertContains(
  files.reactTextareaFigma,
  source.reactTextareaFigma,
  'label: figma.string("Label Text")',
  "Textarea Code Connect label mapping",
);
assertContains(
  files.reactTextareaFigma,
  source.reactTextareaFigma,
  'placeholder: figma.string("Placeholder Text")',
  "Textarea Code Connect placeholder mapping",
);
assertContains(
  files.reactSearchFigma,
  source.reactSearchFigma,
  'figma.enum("State"',
  "Search Code Connect state mapping",
);
assertContains(
  files.reactSearchFigma,
  source.reactSearchFigma,
  "node-id=80-391",
  "Search Code Connect node ID",
);
assertContains(
  files.reactSearchFigma,
  source.reactSearchFigma,
  'label: figma.string("Label Text")',
  "Search Code Connect label mapping",
);
assertContains(
  files.reactSearchFigma,
  source.reactSearchFigma,
  'placeholder: figma.string("Placeholder Text")',
  "Search Code Connect placeholder mapping",
);
assertContains(
  files.reactSelectFigma,
  source.reactSelectFigma,
  'disabled: figma.enum("State"',
  "Select Code Connect disabled state mapping",
);
assertContains(
  files.reactSelectFigma,
  source.reactSelectFigma,
  "node-id=80-432",
  "Select Code Connect node ID",
);
assertContains(
  files.reactSelectFigma,
  source.reactSelectFigma,
  'autoFocus: figma.enum("State"',
  "Select Code Connect focus state mapping",
);
assertContains(
  files.reactSelectFigma,
  source.reactSelectFigma,
  'placeholder: figma.string("Placeholder Text")',
  "Select Code Connect placeholder mapping",
);
assertContains(
  files.reactSliderFigma,
  source.reactSliderFigma,
  'disabled: figma.enum("State"',
  "Slider Code Connect disabled state mapping",
);
assertContains(
  files.reactSliderFigma,
  source.reactSliderFigma,
  "node-id=80-473",
  "Slider Code Connect node ID",
);
assertContains(
  files.reactSliderFigma,
  source.reactSliderFigma,
  'label: figma.string("Label Text")',
  "Slider Code Connect label mapping",
);
assertContains(
  files.reactProgressFigma,
  source.reactProgressFigma,
  'value: figma.enum("Value"',
  "Progress Code Connect value enum mapping",
);
assertContains(
  files.reactProgressFigma,
  source.reactProgressFigma,
  "node-id=83-252",
  "Progress Code Connect node ID",
);
assertContains(
  files.reactProgressFigma,
  source.reactProgressFigma,
  '"100": 100',
  "Progress Code Connect numeric value mapping",
);
assertContains(
  files.reactSpinnerFigma,
  source.reactSpinnerFigma,
  'size: figma.enum("Size"',
  "Spinner Code Connect size mapping",
);
assertContains(
  files.reactSpinnerFigma,
  source.reactSpinnerFigma,
  "node-id=83-261",
  "Spinner Code Connect node ID",
);
assertContains(
  files.reactAvatarFigma,
  source.reactAvatarFigma,
  'src: figma.string("Image URL")',
  "Avatar Code Connect image URL mapping",
);
assertContains(
  files.reactAvatarFigma,
  source.reactAvatarFigma,
  "node-id=83-272",
  "Avatar Code Connect node ID",
);
assertContains(
  files.reactAvatarFigma,
  source.reactAvatarFigma,
  'alt: figma.string("Alt Text")',
  "Avatar Code Connect alt text mapping",
);
assertContains(
  files.reactAvatarFigma,
  source.reactAvatarFigma,
  'fallback: figma.string("Fallback")',
  "Avatar Code Connect fallback mapping",
);
assertContains(
  files.reactAlertFigma,
  source.reactAlertFigma,
  "import { Alert, AlertDescription, AlertTitle }",
  "Alert Code Connect composed subcomponent import",
);
assertContains(
  files.reactAlertFigma,
  source.reactAlertFigma,
  "node-id=83-308",
  "Alert Code Connect node ID",
);
assertContains(
  files.reactAlertFigma,
  source.reactAlertFigma,
  'description: figma.string("Description")',
  "Alert Code Connect description mapping",
);
assertContains(
  files.reactAlertFigma,
  source.reactAlertFigma,
  "<AlertTitle>{title}</AlertTitle>",
  "Alert Code Connect title composition",
);
assertContains(
  files.reactAlertFigma,
  source.reactAlertFigma,
  "<AlertDescription>{description}</AlertDescription>",
  "Alert Code Connect description composition",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  'variant: { Content: "Basic" }',
  "Card Code Connect Basic variant filter",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  'variant: { Content: "Header" }',
  "Card Code Connect Header variant filter",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  'variant: { Content: "Full" }',
  "Card Code Connect Full variant filter",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  "node-id=87-2536",
  "Card Code Connect node ID",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  'title: figma.string("Title Text")',
  "Card Code Connect title mapping",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  'description: figma.string("Description Text")',
  "Card Code Connect description mapping",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  'body: figma.string("Body Text")',
  "Card Code Connect body mapping",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  "<CardHeader>",
  "Card Code Connect header composition",
);
assertContains(
  files.reactCardFigma,
  source.reactCardFigma,
  "<CardFooter",
  "Card Code Connect footer composition",
);
assertContains(
  files.reactTabsFigma,
  source.reactTabsFigma,
  "node-id=90-3387",
  "Tabs Code Connect node ID",
);
assertContains(
  files.reactTabsFigma,
  source.reactTabsFigma,
  'defaultValue: figma.enum("Active"',
  "Tabs Code Connect active mapping",
);
assertContains(
  files.reactTabsFigma,
  source.reactTabsFigma,
  'disabled: figma.enum("State"',
  "Tabs Code Connect disabled mapping",
);
assertContains(
  files.reactTabsFigma,
  source.reactTabsFigma,
  'tab1Text: figma.string("Tab 1 Text")',
  "Tabs Code Connect first tab label mapping",
);
assertContains(
  files.reactTabsFigma,
  source.reactTabsFigma,
  "<TabsList>",
  "Tabs Code Connect list composition",
);
assertContains(
  files.reactTabsFigma,
  source.reactTabsFigma,
  "<TabsTrigger",
  "Tabs Code Connect trigger composition",
);
assertContains(
  files.reactTooltipFigma,
  source.reactTooltipFigma,
  'side: figma.enum("Side"',
  "Tooltip Code Connect side mapping",
);
assertContains(
  files.reactTooltipFigma,
  source.reactTooltipFigma,
  "node-id=91-4672",
  "Tooltip Code Connect node ID",
);
assertContains(
  files.reactTooltipFigma,
  source.reactTooltipFigma,
  'children: figma.string("Content Text")',
  "Tooltip Code Connect content text mapping",
);
assertContains(
  files.reactTooltipFigma,
  source.reactTooltipFigma,
  "<TooltipContent side={side}>{children}</TooltipContent>",
  "Tooltip Code Connect content composition",
);
assertContains(
  files.reactTooltip,
  source.reactTooltip,
  "TooltipPrimitive.Arrow",
  "React Tooltip arrow rendering",
);
assertContains(
  files.reactTooltip,
  source.reactTooltip,
  "overflow-visible",
  "React Tooltip content lets the arrow protrude",
);
assertContains(
  files.iosTooltip,
  source.iosTooltip,
  "public enum KozmosTooltipSide",
  "iOS Tooltip side API",
);
assertContains(
  files.iosTooltip,
  source.iosTooltip,
  "KozmosTooltipTip",
  "iOS Tooltip triangular tip",
);
assertContains(
  files.iosTooltip,
  source.iosTooltip,
  "Path { path in",
  "iOS Tooltip custom tip path",
);
assertContains(
  files.androidTooltip,
  source.androidTooltip,
  "enum class KozmosTooltipSide",
  "Android Tooltip side API",
);
assertContains(
  files.androidTooltip,
  source.androidTooltip,
  "TooltipTip",
  "Android Tooltip triangular tip",
);
assertContains(
  files.androidTooltip,
  source.androidTooltip,
  "Canvas",
  "Android Tooltip custom tip path",
);
assertContains(
  files.androidTooltip,
  source.androidTooltip,
  "PopupPositionProvider",
  "Android Tooltip measured popup positioning",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Counter/Counter.figma.tsx",
  "Linked Code Connect includes Counter template",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Counter/Counter.tsx",
  "Linked Code Connect includes Counter source",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Card/Card.figma.tsx",
  "Linked Code Connect includes Card template",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Card/Card.tsx",
  "Linked Code Connect includes Card source",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Tabs/Tabs.figma.tsx",
  "Linked Code Connect includes Tabs template",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Tabs/Tabs.tsx",
  "Linked Code Connect includes Tabs source",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Tooltip/Tooltip.figma.tsx",
  "Linked Code Connect includes Tooltip template",
);
assertContains(
  files.figmaLinked,
  source.figmaLinked,
  "src/components/Tooltip/Tooltip.tsx",
  "Linked Code Connect includes Tooltip source",
);
assertContains(
  files.vueIndex,
  source.vueIndex,
  "KozmosButton = createVueWrapper(ReactButton)",
  "Vue Button wraps React Button",
);
assertContains(
  files.vueIndex,
  source.vueIndex,
  "KozmosCounter = createVueWrapper(ReactCounter)",
  "Vue Counter wraps React Counter",
);
assertContains(
  files.vueIndex,
  source.vueIndex,
  "KozmosBadge = createVueWrapper(ReactBadge)",
  "Vue Badge wraps React Badge",
);
assertContains(
  files.vueIndex,
  source.vueIndex,
  "KozmosIconButton = createVueWrapper(IconButton)",
  "Vue IconButton wraps React IconButton",
);

// Figma generator parity.
for (const tokenName of [
  "Button/height/small",
  "Button/height/default",
  "Button/height/large",
  "Button/height/icon",
  "IconButton/size/small",
  "IconButton/size/default",
  "IconButton/size/large",
  "Badge/height/small",
  "Badge/height/default",
  "Badge/height/large",
  "Badge/height/icon",
  "Checkbox/height/default",
  "Radio/height/default",
  "Switch/height/default",
  "Input/field/height",
  "Search/field/height",
  "Select/trigger/height",
  "Slider/height/default",
]) {
  assertContains(
    files.figma,
    source.figma,
    tokenValuePattern(tokenName, target),
    `${tokenName} token at ${target}px`,
  );
}
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Button/width/icon", target),
  "Button icon width token at 44px",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Badge/width/icon", target),
  "Badge icon width token at 44px",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Badge/gap", badge.content.gap),
  "Badge gap token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Badge/icon/size", badge.content.iconSize),
  "Badge icon size token",
);
assertContains(
  files.figma,
  source.figma,
  "Counter / v1",
  "Counter component set generation",
);
assertContains(
  files.figma,
  source.figma,
  "Text / v1",
  "Text component set generation",
);
for (const tokenName of [
  "Text/font-size/xs",
  "Text/line-height/xs",
  "Text/font-size/base",
  "Text/line-height/base",
  "Text/font-size/4xl",
  "Text/line-height/4xl",
]) {
  assertContains(
    files.figma,
    source.figma,
    `name: "${tokenName}"`,
    `${tokenName} component typography token`,
  );
}
assertContains(
  files.figma,
  source.figma,
  "const TEXT_SIZES = [",
  "Text size axis registry",
);
assertContains(
  files.figma,
  source.figma,
  "const TEXT_WEIGHTS =",
  "Text weight axis registry",
);
assertContains(
  files.figma,
  source.figma,
  "const TEXT_TONES =",
  "Text tone axis registry",
);
assertContains(
  files.figma,
  source.figma,
  "async function buildTextComponent()",
  "Text build handler",
);
assertContains(
  files.figma,
  source.figma,
  "async function updateTextComponent()",
  "Text update handler",
);
assertContains(
  files.figma,
  source.figma,
  'componentSetName: "Text / v1"',
  "Text documentation metadata",
);
assertContains(
  files.figmaUi,
  source.figmaUi,
  '<option value="text">Text / v1</option>',
  "Text UI picker option",
);
assertContains(
  files.figmaUi,
  source.figmaUi,
  'build: "build-text"',
  "Text UI build action",
);
assertContains(
  files.figmaReadme,
  source.figmaReadme,
  "Select **Text / v1**",
  "Text importer documentation",
);
assertContains(
  files.reactText,
  source.reactText,
  "'4xl': 'text-4xl'",
  "React Text 4xl size",
);
assertContains(
  files.reactText,
  source.reactText,
  "destructive: 'text-destructive'",
  "React Text destructive tone",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Counter/height/small", counter.sizes.small.height),
  "Counter small height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Counter/height/default", counter.sizes.default.height),
  "Counter default height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Counter/min-width/small", counter.sizes.small.minWidth),
  "Counter small min-width token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern(
    "Counter/min-width/default",
    counter.sizes.default.minWidth,
  ),
  "Counter default min-width token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Counter/padding/x/small", counter.sizes.small.paddingX),
  "Counter small horizontal padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern(
    "Counter/padding/x/default",
    counter.sizes.default.paddingX,
  ),
  "Counter default horizontal padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Counter/radius", counter.content.radius),
  "Counter radius token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Counter/font-size/small", counter.content.fontSizeSmall),
  "Counter small font size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern(
    "Counter/font-size/default",
    counter.content.fontSizeDefault,
  ),
  "Counter default font size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern(
    "Counter/line-height/small",
    counter.content.lineHeightSmall,
  ),
  "Counter small line height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern(
    "Counter/line-height/default",
    counter.content.lineHeightDefault,
  ),
  "Counter default line height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Badge/counter/height", badge.content.counterHeight),
  "Badge counter height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Badge/counter/padding/x", badge.content.counterPaddingX),
  "Badge counter horizontal padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Badge/counter/radius", badge.content.counterRadius),
  "Badge counter radius token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Badge/counter/font-size", badge.content.counterFontSize),
  "Badge counter font size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern(
    "Badge/counter/line-height",
    badge.content.counterLineHeight,
  ),
  "Badge counter line height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Checkbox/control/size", checkbox.size.controlSize),
  "Checkbox visual control token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Radio/control/size", radio.size.controlSize),
  "Radio visual control token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Radio/dot/size", radio.size.dotSize),
  "Radio checked dot token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Switch/track/width", switchContract.size.trackWidth),
  "Switch visual track width token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Switch/track/height", switchContract.size.trackHeight),
  "Switch visual track height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Switch/thumb/size", switchContract.size.thumbSize),
  "Switch visual thumb token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Input/width/default", input.size.width),
  "Input default width token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Input/field/padding/x", input.size.paddingX),
  "Input horizontal padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Input/gap", input.size.gap),
  "Input label-field gap token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Input/field/radius", input.content.radius),
  "Input field radius token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Textarea/field/height", 80),
  "Textarea default field height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Slider/thumb/size", radio.size.controlSize),
  "Slider thumb visual size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Progress/width/default", input.size.width),
  "Progress default width token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Progress/height/default", 8),
  "Progress track height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Spinner/size/medium", 24),
  "Spinner medium size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Avatar/size/default", 40),
  "Avatar default size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Alert/width/default", 360),
  "Alert default width token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Alert/padding", 16),
  "Alert padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Card/width/default", 360),
  "Card default width token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Card/padding", 24),
  "Card padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Card/radius", 16),
  "Card radius token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tabs/list/height", 44),
  "Tabs list height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tabs/list/radius", 16),
  "Tabs outer radius token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tabs/trigger/height", 36),
  "Tabs trigger height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tabs/trigger/radius", 12),
  "Tabs trigger radius is outer radius minus inset",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tabs/trigger/font-size", 14),
  "Tabs trigger font-size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tooltip/padding/x", 12),
  "Tooltip horizontal padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tooltip/padding/y", 6),
  "Tooltip vertical padding token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tooltip/radius", 8),
  "Tooltip radius token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tooltip/tip/size", 8),
  "Tooltip tip size token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tooltip/tip/height", 4),
  "Tooltip tip height token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tooltip/side-offset", 4),
  "Tooltip side offset token",
);
assertContains(
  files.figma,
  source.figma,
  tokenValuePattern("Tooltip/content/font-size", 14),
  "Tooltip content font-size token",
);
assertContains(
  files.figma,
  source.figma,
  'SURFACE_QA_PAGE_NAME = "QA / Transparent Surfaces"',
  "Surface QA page constant",
);
assertContains(
  files.figma,
  source.figma,
  "async function buildSurfaceQaPage()",
  "Surface QA page builder",
);
assertContains(
  files.figma,
  source.figma,
  "async function reorganizeComponentsPage()",
  "Components page reorganize action",
);
assertContains(
  files.figma,
  source.figma,
  "COMPONENT_PAGE_LAYOUT_ORDER",
  "Components page measured layout order",
);
assertContains(
  files.figma,
  source.figma,
  "measureComponentSetLayoutBounds",
  "Components page layout measures visible child bounds",
);
assertContains(
  files.figma,
  source.figma,
  "COMPONENT_PAGE_LAYOUT_MIN_HEIGHTS",
  "Components page layout uses safety footprints",
);
assertContains(
  files.figma,
  source.figma,
  "setExplicitVariableModeForCollection",
  "Surface QA applies explicit Light/Dark variable modes",
);
assertContains(
  files.figma,
  source.figma,
  "Map Layer / fill-extrusion",
  "Surface QA product map fill-extrusion layer",
);
assertContains(
  files.figma,
  source.figma,
  "Map Layer / symbol_label",
  "Surface QA product map symbol_label layer",
);
assertContains(
  files.figma,
  source.figma,
  "surfaceQa = await auditSurfaceQaPage",
  "Surface QA audit summary",
);
assertContains(
  files.figma,
  source.figma,
  "auditSurfaceQaPanelContrast",
  "Surface QA audits live-instance contrast on host surfaces",
);
assertContains(
  files.figma,
  source.figma,
  'kind: "surface-contrast"',
  "Surface QA reports contrast failures as audit issues",
);
assertContains(
  files.figma,
  source.figma,
  'Glass: {\n      background: "Colors/transparent/inverted/10",\n      foreground: "Colors/foreground/0"',
  "Glass Button foreground follows mode-aware text-foreground token",
);
assertContains(
  files.figma,
  source.figma,
  'background: "Colors/theme/600"',
  "Figma filled brand surfaces use accessible brand token",
);
assertContains(
  files.figma,
  source.figma,
  'rangeFill: "Colors/theme/600"',
  "Figma range fills use accessible brand token",
);
assertContains(
  files.figma,
  source.figma,
  'foreground: "Colors/theme/600"',
  "Figma text-only brand content uses accessible brand token",
);
assertContains(
  files.reactTailwindConfig,
  source.reactTailwindConfig,
  /DEFAULT:\s*["']var\(--primitives-colors-theme-600\)["']/,
  "React primary color uses accessible brand token",
);
assertContains(
  files.reactTailwindConfig,
  source.reactTailwindConfig,
  /foreground:\s*["']var\(--primitives-colors-foreground-1000\)["']/,
  "React filled tone foregrounds are mode-aware",
);
assertContains(
  files.reactTailwindConfig,
  source.reactTailwindConfig,
  /ring:\s*["']var\(--primitives-colors-theme-600\)["']/,
  "React focus ring uses accessible brand token",
);
assertContains(
  files.figmaUi,
  source.figmaUi,
  "Build Surface QA",
  "Surface QA plugin action",
);
assertContains(
  files.figmaUi,
  source.figmaUi,
  "build-surface-qa",
  "Surface QA UI posts plugin message",
);
assertContains(
  files.figmaUi,
  source.figmaUi,
  "Reorganize Components",
  "Components page reorganize plugin action",
);
assertContains(
  files.figmaUi,
  source.figmaUi,
  "reorganize-components",
  "Components page reorganize UI posts plugin message",
);
assertContains(
  files.figmaReadme,
  source.figmaReadme,
  "Build Surface QA",
  "Surface QA plugin documentation",
);
assertContains(
  files.figma,
  source.figma,
  'trackStroke: "Colors/foreground/500"',
  "Slider inactive track accessible boundary token",
);
assertContains(
  files.figma,
  source.figma,
  'trackStroke: "Colors/foreground/500"',
  "Progress inactive track accessible boundary token",
);
assertContains(
  files.figma,
  source.figma,
  'const INPUT_STATES = ["Default", "Focus", "Disabled", "Readonly"]',
  "Input interaction state axis",
);
assertContains(
  files.figma,
  source.figma,
  'const INPUT_STATUSES = ["Default", "Error", "Warning", "Success"]',
  "Input validation status axis",
);
assertContains(
  files.figma,
  source.figma,
  'const TEXTAREA_STATES = ["Default", "Focus", "Disabled", "Readonly"]',
  "Textarea interaction state axis",
);
assertContains(
  files.figma,
  source.figma,
  'const SEARCH_STATES = ["Default", "Focus", "Disabled", "Readonly"]',
  "Search interaction state axis",
);
assertContains(
  files.figma,
  source.figma,
  'const SELECT_STATES = ["Default", "Focus", "Disabled"]',
  "Select interaction state axis",
);
assertContains(
  files.figma,
  source.figma,
  'const SLIDER_STATES = ["Default", "Focus", "Disabled"]',
  "Slider interaction state axis",
);
assertContains(
  files.figma,
  source.figma,
  'const PROGRESS_VALUES = ["0", "25", "50", "75", "100"]',
  "Progress value axis",
);
assertContains(
  files.figma,
  source.figma,
  'const SPINNER_SIZES = ["Small", "Medium", "Large", "XLarge"]',
  "Spinner size axis",
);
assertContains(
  files.figma,
  source.figma,
  'const AVATAR_CONTENT = ["Fallback", "Image"]',
  "Avatar content axis",
);
assertContains(
  files.figma,
  source.figma,
  'const ALERT_VARIANTS = ["Default", "Destructive", "Success", "Warning", "Info"]',
  "Alert variant axis",
);
assertContains(
  files.figma,
  source.figma,
  'const COUNTER_TONES = ["Neutral", "Brand", "Destructive", "Inverse"]',
  "Counter tone axis",
);
assertContains(
  files.figma,
  source.figma,
  'const COUNTER_SIZES = ["Small", "Default"]',
  "Counter size axis",
);
assertContains(
  files.figma,
  source.figma,
  'const CARD_CONTENT = ["Basic", "Header", "Full"]',
  "Card content axis",
);
assertContains(
  files.figma,
  source.figma,
  'const TABS_COUNTS = ["Two", "Three", "Four"]',
  "Tabs count axis",
);
assertContains(
  files.figma,
  source.figma,
  'const TABS_ACTIVE = ["One", "Two", "Three", "Four"]',
  "Tabs active axis",
);
assertContains(
  files.figma,
  source.figma,
  'const TABS_STATES = ["Default", "Focus", "Disabled"]',
  "Tabs interaction state axis",
);
assertContains(
  files.figma,
  source.figma,
  'const TOOLTIP_SIDES = ["Top", "Right", "Bottom", "Left"]',
  "Tooltip side axis",
);
assertContains(
  files.figma,
  source.figma,
  'const DIALOG_CONTENT = ["Basic", "Form", "Footer"]',
  "Dialog content axis",
);
assertContains(
  files.figma,
  source.figma,
  'const POPOVER_SIDES = ["Top", "Right", "Bottom", "Left"]',
  "Popover side axis",
);
assertContains(
  files.figma,
  source.figma,
  'const MENU_CONTENT = ["Basic", "Checkbox", "Radio", "Submenu"]',
  "Menu content axis",
);
assertContains(
  files.figma,
  source.figma,
  'const TOAST_CONTENT = ["Basic", "Action"]',
  "Toast content axis",
);
assertContains(
  files.figma,
  source.figma,
  'const FOCUS_VISIBLE_PROPERTY_NAME = "Focus Visible"',
  "shared Focus Visible component property name",
);
assertContains(
  files.figma,
  source.figma,
  'setLayoutSizingHorizontal(field, "FILL")',
  "Input field fills resizable instance width",
);
assertContains(
  files.figma,
  source.figma,
  'setTextAutoResize(placeholder, "TRUNCATE")',
  "Input placeholder truncates instead of hugging content",
);
assertContains(
  files.figma,
  source.figma,
  'helper.visible = status !== "Default"',
  "Input helper text hidden by default",
);
assertContains(
  files.figma,
  source.figma,
  "helper.characters = helperTextForInputStatus(status)",
  "Input helper text keeps non-zero default content",
);
assertContains(
  files.figma,
  source.figma,
  "if (node && node.visible === false) return",
  "Contrast audit ignores hidden component-property content",
);
assertContains(
  files.figma,
  source.figma,
  "syncFocusRing(component",
  "Button and IconButton focus ring generation",
);
assertContains(
  files.figma,
  source.figma,
  "syncFocusRing(control",
  "Checkbox and Radio focus ring generation",
);
assertContains(
  files.figma,
  source.figma,
  "syncFocusRing(track",
  "Switch focus ring generation",
);
assertContains(
  files.figma,
  source.figma,
  "syncFocusRing(field",
  "Input focus ring generation",
);
assertContains(
  files.figma,
  source.figma,
  "syncFocusRing(thumb",
  "Slider thumb focus ring generation",
);
assertContains(
  files.figma,
  source.figma,
  /minimumTouchTargetPass:\s*minimumInteractiveSize >= 44/,
  "44px audit threshold",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Button", stats)',
  "Button Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Badge", stats)',
  "Badge Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  /configureNamedTextProperty\(\s*componentSet,\s*"Counter Text"/,
  "Counter Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  /createNestedComponentInstance\(\{\s*componentSetName:\s*"Counter \/ v1"/,
  "Badge composes nested Counter instance",
);
assertContains(
  files.figma,
  source.figma,
  "configureBadgeCounterVisibilityProperty",
  "Badge Show Counter component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureBadgeIconSlot",
  "Badge Icon instance-swap binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Checkbox", stats)',
  "Checkbox Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Radio", stats)',
  "Radio Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Switch", stats)',
  "Switch Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Input", stats)',
  "Input Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configurePlaceholderTextProperty(componentSet, "Placeholder", stats)',
  "Input Placeholder Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureHelperTextProperty(componentSet, "Helper text", stats)',
  "Input Helper Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureHelperVisibilityProperty(componentSet, stats)",
  "Input helper visibility component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Textarea", stats)',
  "Textarea Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Search", stats)',
  "Search Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureLabelTextProperty(componentSet, "Slider", stats)',
  "Slider Label Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureTabsProperties(componentSet, stats)",
  "Tabs text and focus component property binding",
);
assertContains(
  files.figma,
  source.figma,
  /configureNamedTextProperty\(\s*componentSet,\s*label,\s*label,/s,
  "Tabs numbered tab label property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureTooltipProperties(componentSet, stats)",
  "Tooltip component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureNamedTextProperty(\n    componentSet,\n    "Content Text"',
  "Tooltip Content Text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureDialogProperties(componentSet, stats)",
  "Dialog text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configurePopoverProperties(componentSet, stats)",
  "Popover text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureMenuProperties(componentSet, stats)",
  "Menu text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureToastProperties(componentSet, stats)",
  "Toast text component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "syncTooltipTip",
  "Tooltip side-aware tip generation",
);
assertContains(
  files.figma,
  source.figma,
  "figma.createFrame()",
  "Tooltip tip uses a stable absolute wrapper",
);
assertContains(
  files.figma,
  source.figma,
  "figma.createVector()",
  "Tooltip tip uses an explicit vector triangle",
);
assertContains(
  files.figma,
  source.figma,
  "setVectorNetworkAsync",
  "Tooltip tip uses dynamic-page vector network API",
);
assertContains(
  files.figma,
  source.figma,
  '"Tip Fill"',
  "Tooltip tip vector fill child",
);
assertContains(
  files.figma,
  source.figma,
  "tooltipTipVectorNetwork",
  "Tooltip tip vector network",
);
assertContains(
  files.figma,
  source.figma,
  "regions: [",
  "Tooltip tip vector has a filled region",
);
assertContains(
  files.figma,
  source.figma,
  "tooltipTipIntegrity",
  "Tooltip tip audit",
);
assertContains(
  files.figma,
  source.figma,
  'configureNamedTextProperty(componentSet, "Fallback", "Fallback"',
  "Avatar Fallback component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'componentSet,\n    "Image URL"',
  "Avatar Image URL component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'configureNamedTextProperty(componentSet, "Title", "Title"',
  "Alert Title component property binding",
);
assertContains(
  files.figma,
  source.figma,
  'componentSet,\n    "Description"',
  "Alert Description component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "configureFocusVisibleProperty(componentSet, stats)",
  "Focus Visible component property binding",
);
assertContains(
  files.figma,
  source.figma,
  "node.componentPropertyReferences.visible === result.propertyName",
  "Focus Visible property audit",
);
assertContains(
  files.figma,
  source.figma,
  'ring.layoutPositioning = "ABSOLUTE"',
  "Focus ring uses absolute positioning",
);
assertContains(
  files.figma,
  source.figma,
  'horizontal: "STRETCH"',
  "Focus ring stretches with resized controls",
);
assertContains(
  files.figma,
  source.figma,
  "focusVisibleProperty.geometryIssueCount > 0",
  "Focus ring geometry audit warning",
);
assertOrder(
  files.figma,
  source.figma,
  "target.appendChild(ring);",
  'ring.layoutPositioning = "ABSOLUTE"',
  "Focus ring appended before absolute positioning",
);
assertContains(
  files.figma,
  source.figma,
  'findKozmosIconSourceComponent("check")',
  "Checkbox generated mark uses curated check icon",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedCheckboxControl",
  "Checkbox non-text contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedCheckboxMark",
  "Checkbox mark contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedRadioControl",
  "Radio non-text contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedRadioDot",
  "Radio checked-dot contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedSwitchTrack",
  "Switch non-text contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedSwitchThumb",
  "Switch thumb contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedInputField",
  "Input field contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedSliderTrack",
  "Slider track contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedSliderThumb",
  "Slider thumb contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedProgressTrack",
  "Progress track contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedCardAction",
  "Card footer action local-background contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "auditSliderTrackPaints",
  "Slider track contrast boundary audit",
);
assertContains(
  files.figma,
  source.figma,
  "auditSliderThumbPaints",
  "Slider thumb contrast boundary audit",
);
assertContains(
  files.figma,
  source.figma,
  "auditCardActionPaints",
  "Card action text contrast audit",
);
assertContains(
  files.figma,
  source.figma,
  "Colors/foreground/400",
  "Card description uses accessible muted foreground",
);
assertContains(
  files.figma,
  source.figma,
  '"nested-component-instance"',
  "Nested component composition audit marker",
);
assertContains(
  files.figma,
  source.figma,
  "isGeneratedNestedComponentInstance(node)",
  "Composite audit treats nested component instances as ownership boundaries",
);
assertContains(
  files.figma,
  source.figma,
  "auditCompositionIntegrity",
  "Composite component clone-frame audit",
);
assertContains(
  files.figma,
  source.figma,
  "createNestedComponentInstance",
  "Composite component nested instance creation",
);
assertContains(
  files.figma,
  source.figma,
  "applyTabsTriggerTypography",
  "Tabs trigger typography bindings",
);
assertContains(
  files.figma,
  source.figma,
  'setSharedPluginData(RUN_NAMESPACE, "kind", "tabs-trigger")',
  "Tabs trigger audit marker",
);
assertContains(
  files.figma,
  source.figma,
  "syncFocusRing(trigger",
  "Tabs active trigger focus ring generation",
);
assertContains(
  files.figma,
  source.figma,
  "references.characters = propertyName",
  "Figma Label Text characters property reference",
);
assertContains(
  files.figma,
  source.figma,
  "variantProperties: variantProperties.properties",
  "Figma variant property audit output",
);
assertContains(
  files.figma,
  source.figma,
  "normalizeComponentSetVariantProperties",
  "Figma stale variant property cleanup",
);
assertContains(
  files.figma,
  source.figma,
  "safeComponentPropertyDefinitions",
  "Figma component property definition error recovery",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildButtonComponent",
  "Figma Button rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildCheckboxComponent",
  "Figma Checkbox build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildCheckboxComponent",
  "Figma Checkbox rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildRadioComponent",
  "Figma Radio build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildRadioComponent",
  "Figma Radio rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildSwitchComponent",
  "Figma Switch build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildSwitchComponent",
  "Figma Switch rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildInputComponent",
  "Figma Input build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildInputComponent",
  "Figma Input rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildTextareaComponent",
  "Figma Textarea build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildTextareaComponent",
  "Figma Textarea rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildSearchComponent",
  "Figma Search build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildSearchComponent",
  "Figma Search rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildSelectComponent",
  "Figma Select build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildSelectComponent",
  "Figma Select rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildSliderComponent",
  "Figma Slider build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildSliderComponent",
  "Figma Slider rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildProgressComponent",
  "Figma Progress build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildProgressComponent",
  "Figma Progress rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildSpinnerComponent",
  "Figma Spinner build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildSpinnerComponent",
  "Figma Spinner rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildAvatarComponent",
  "Figma Avatar build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildAvatarComponent",
  "Figma Avatar rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildAlertComponent",
  "Figma Alert build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildAlertComponent",
  "Figma Alert rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildCardComponent",
  "Figma Card build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildCardComponent",
  "Figma Card rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildTabsComponent",
  "Figma Tabs build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildTabsComponent",
  "Figma Tabs rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildTooltipComponent",
  "Figma Tooltip build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildTooltipComponent",
  "Figma Tooltip rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildDialogComponent",
  "Figma Dialog build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildDialogComponent",
  "Figma Dialog rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildPopoverComponent",
  "Figma Popover build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildPopoverComponent",
  "Figma Popover rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildMenuComponent",
  "Figma Menu build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildMenuComponent",
  "Figma Menu rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "buildToastComponent",
  "Figma Toast build action",
);
assertContains(
  files.figma,
  source.figma,
  "rebuildToastComponent",
  "Figma Toast rebuild recovery action",
);
assertContains(
  files.figma,
  source.figma,
  "documentComponentLibrary",
  "Figma component documentation action",
);
assertContains(
  files.figma,
  source.figma,
  'COMPONENT_DOCS_PAGE_NAME = "Docs"',
  "Figma component docs catalog page",
);
assertContains(
  files.figma,
  source.figma,
  "DOCS_COLUMNS = 3",
  "Figma component docs side-by-side grid",
);
assertContains(
  files.figma,
  source.figma,
  "removeGeneratedSplitDocPages",
  "Figma split docs page cleanup",
);
assertContains(
  files.figma,
  source.figma,
  "applyComponentSetDescription",
  "Figma right-panel description refresh",
);
assertContains(
  files.figma,
  source.figma,
  "applyDocsPreviewOverrides",
  "Figma docs preview property override",
);
assertContains(
  files.figma,
  source.figma,
  "hasOwnedFocusNode(componentSet)",
  "Figma focus audit uses owned focus nodes",
);
if (
  source.figma.includes(
    "componentSet.description && /focus/i.test(componentSet.description)",
  )
) {
  fail(
    `${files.figma}: focus audit must not infer focus support from description prose`,
  );
}
assertContains(
  files.figma,
  source.figma,
  "archiveGeneratedNodesForRebuild",
  "Figma corrupted component archive before rebuild",
);
assertContains(
  files.figma,
  source.figma,
  "isArchivePageName",
  "Figma active-library audit excludes archive health",
);

// Native API and target-size parity.
assertAllVariants(
  files.iosButton,
  source.iosButton,
  button.variants,
  (variant) => `case ${variant === "default" ? "`default`" : variant}`,
  "iOS Button",
);
assertContains(
  files.iosButton,
  source.iosButton,
  "minHeight: 44",
  "iOS Button 44px minimum height",
);
assertContains(
  files.iosButton,
  source.iosButton,
  "minWidth: size == .icon ? 44 : nil",
  "iOS Button icon 44px minimum width",
);
assertContains(
  files.iosButton,
  source.iosButton,
  ".tint(foregroundColor)",
  "iOS Button loading indicator foreground tint",
);

assertAllVariants(
  files.iosIconButton,
  source.iosIconButton,
  iconButton.variants,
  (variant) => `case ${variant === "default" ? "`default`" : variant}`,
  "iOS IconButton",
);
assertContains(
  files.iosIconButton,
  source.iosIconButton,
  ".frame(width: 44, height: 44)",
  "iOS IconButton 44px frame",
);
assertContains(
  files.iosIconButton,
  source.iosIconButton,
  ".tint(foregroundColor)",
  "iOS IconButton loading indicator foreground tint",
);

assertAllVariants(
  files.iosCounter,
  source.iosCounter,
  counter.tones,
  (tone) => `case ${tone}`,
  "iOS Counter",
);
assertContains(
  files.iosCounter,
  source.iosCounter,
  "public struct KozmosCounter",
  "iOS Counter public view",
);
assertContains(
  files.iosCounter,
  source.iosCounter,
  "public enum KozmosCounterSize",
  "iOS Counter size API",
);
assertContains(
  files.iosCounter,
  source.iosCounter,
  "size == .sm ? 18 : 20",
  "iOS Counter 18px/20px dimensions",
);
assertContains(
  files.iosCounter,
  source.iosCounter,
  "size == .sm ? 5 : KozmosDimensions.primitivesLayoutSpacing75",
  "iOS Counter 5px/6px horizontal padding",
);
assertContains(
  files.iosCounter,
  source.iosCounter,
  "size == .sm ? 11 : 12",
  "iOS Counter 11px/12px font sizes",
);
assertContains(
  files.iosCounter,
  source.iosCounter,
  ".monospacedDigit()",
  "iOS Counter tabular numeric rendering",
);
assertContains(
  files.iosCounter,
  source.iosCounter,
  "normalizedText",
  "iOS Counter normalizes legacy wrapped values",
);
assertContains(
  files.iosCounterFigma,
  source.iosCounterFigma,
  "node-id=149-13430",
  "iOS Counter Code Connect node ID",
);
assertContains(
  files.iosCounterFigma,
  source.iosCounterFigma,
  '@FigmaString("Counter Text")',
  "iOS Counter Code Connect text mapping",
);
assertContains(
  files.iosCounterFigma,
  source.iosCounterFigma,
  '@FigmaEnum(\n        "Tone"',
  "iOS Counter Code Connect tone mapping",
);
assertContains(
  files.iosCounterFigma,
  source.iosCounterFigma,
  '@FigmaEnum(\n        "Size"',
  "iOS Counter Code Connect size mapping",
);
assertContains(
  files.iosFigmaLinked,
  source.iosFigmaLinked,
  "Sources/Components/Counter/Counter.figma.swift",
  "iOS linked Code Connect includes Counter",
);

assertAllVariants(
  files.iosBadge,
  source.iosBadge,
  badge.variants,
  (variant) => `case ${variant === "default" ? "`default`" : variant}`,
  "iOS Badge",
);
for (const sizeName of ["`default`", "sm", "lg", "icon"]) {
  assertContains(
    files.iosBadge,
    source.iosBadge,
    `case ${sizeName}`,
    `iOS Badge size "${sizeName}"`,
  );
}
assertContains(
  files.iosBadge,
  source.iosBadge,
  "minHeight: 44",
  "iOS Badge 44px minimum height",
);
assertContains(
  files.iosBadge,
  source.iosBadge,
  "minWidth: size == .icon ? 44 : nil",
  "iOS Badge icon 44px minimum width",
);
assertContains(
  files.iosBadge,
  source.iosBadge,
  "counter: String? = nil",
  "iOS Badge counter API",
);
assertContains(
  files.iosBadge,
  source.iosBadge,
  "showCounter: Bool = false",
  "iOS Badge counter visibility API",
);
assertContains(
  files.iosBadge,
  source.iosBadge,
  "KozmosCounter(counter, tone: counterTone)",
  "iOS Badge composes Counter",
);
assertContains(
  files.iosBadge,
  source.iosBadge,
  "HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50)",
  "iOS Badge uses 4px content gap",
);
assertContains(
  files.iosBadge,
  source.iosBadge,
  "size != .icon && showCounter && counter != nil",
  "iOS Badge hides Counter for icon-only variants",
);
assertContains(
  files.iosBadgeFigma,
  source.iosBadgeFigma,
  "node-id=78-246",
  "iOS Badge Code Connect node ID",
);
assertContains(
  files.iosBadgeFigma,
  source.iosBadgeFigma,
  '@FigmaString("Label Text")',
  "iOS Badge Code Connect label mapping",
);
assertContains(
  files.iosBadgeFigma,
  source.iosBadgeFigma,
  '@FigmaBoolean("Show Counter")',
  "iOS Badge Code Connect counter visibility mapping",
);
assertContains(
  files.iosFigmaLinked,
  source.iosFigmaLinked,
  "Sources/Components/Badge/Badge.figma.swift",
  "iOS linked Code Connect includes Badge",
);

assertContains(
  files.iosCheckbox,
  source.iosCheckbox,
  "disabled: Bool = false",
  "iOS Checkbox disabled API",
);
assertContains(
  files.iosCheckbox,
  source.iosCheckbox,
  "error: Bool = false",
  "iOS Checkbox error API",
);
assertContains(
  files.iosCheckbox,
  source.iosCheckbox,
  ".frame(minHeight: 44",
  "iOS Checkbox 44px row target",
);
assertContains(
  files.iosCheckbox,
  source.iosCheckbox,
  "frame(width: 20, height: 20)",
  "iOS Checkbox 20px visual control",
);
assertContains(
  files.iosRadio,
  source.iosRadio,
  "disabled: Bool = false",
  "iOS Radio disabled API",
);
assertContains(
  files.iosRadio,
  source.iosRadio,
  "error: Bool = false",
  "iOS Radio error API",
);
assertContains(
  files.iosRadio,
  source.iosRadio,
  ".frame(minHeight: 44",
  "iOS Radio 44px row target",
);
assertContains(
  files.iosRadio,
  source.iosRadio,
  ".frame(width: 20, height: 20)",
  "iOS Radio 20px visual control",
);
assertContains(
  files.iosRadio,
  source.iosRadio,
  ".frame(width: 10, height: 10)",
  "iOS Radio checked dot",
);
assertContains(
  files.iosSwitch,
  source.iosSwitch,
  "disabled: Bool = false",
  "iOS Switch disabled API",
);
assertContains(
  files.iosSwitch,
  source.iosSwitch,
  "error: Bool = false",
  "iOS Switch error API",
);
assertContains(
  files.iosSwitch,
  source.iosSwitch,
  ".frame(minHeight: 44",
  "iOS Switch 44px row target",
);
assertContains(
  files.iosSwitch,
  source.iosSwitch,
  ".frame(width: 44, height: 24)",
  "iOS Switch 44x24 visual track",
);
assertContains(
  files.iosSwitch,
  source.iosSwitch,
  ".frame(width: 20, height: 20)",
  "iOS Switch 20px visual thumb",
);
assertContains(
  files.iosInput,
  source.iosInput,
  "disabled: Bool = false",
  "iOS Input disabled API",
);
assertContains(
  files.iosInput,
  source.iosInput,
  "readOnly: Bool = false",
  "iOS Input readOnly API",
);
assertContains(
  files.iosInput,
  source.iosInput,
  "status: KozmosInputStatus = .default",
  "iOS Input validation status API",
);
assertContains(
  files.iosInput,
  source.iosInput,
  "helperText: String? = nil",
  "iOS Input helper text API",
);
assertContains(
  files.iosInput,
  source.iosInput,
  "error: Bool = false",
  "iOS Input error API",
);
assertContains(
  files.iosInput,
  source.iosInput,
  ".frame(height: 44",
  "iOS Input 44px field height",
);
assertContains(
  files.iosInput,
  source.iosInput,
  "primitivesLayoutRadius100",
  "iOS Input 8px field radius",
);
assertContains(
  files.iosInput,
  source.iosInput,
  "KozmosDimensions.primitivesLayoutSpacing150",
  "iOS Input 12px horizontal padding",
);

assertAllVariants(
  files.androidButton,
  source.androidButton,
  button.variants,
  (variant) => {
    const name =
      variant === "default"
        ? "Default"
        : variant[0].toUpperCase() + variant.slice(1);
    return name;
  },
  "Android Button",
);
assertContains(
  files.androidButton,
  source.androidButton,
  "KozmosButtonSize.Sm -> 44.dp",
  "Android Button small 44dp height",
);
assertContains(
  files.androidButton,
  source.androidButton,
  "KozmosButtonSize.Default -> 44.dp",
  "Android Button default 44dp height",
);
assertContains(
  files.androidButton,
  source.androidButton,
  "KozmosButtonSize.Icon -> 44.dp",
  "Android Button icon 44dp height",
);
assertContains(
  files.androidButton,
  source.androidButton,
  "Modifier.width(44.dp)",
  "Android Button icon 44dp width",
);
assertContains(
  files.androidButton,
  source.androidButton,
  "color = LocalContentColor.current",
  "Android Button loading indicator foreground color",
);
assertContains(
  files.androidButton,
  source.androidButton,
  "KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle",
  "Android Button themed runtime token",
);

assertAllVariants(
  files.androidIconButton,
  source.androidIconButton,
  iconButton.variants,
  (variant) => {
    const name =
      variant === "default"
        ? "Default"
        : variant[0].toUpperCase() + variant.slice(1);
    return name;
  },
  "Android IconButton",
);
assertContains(
  files.androidIconButton,
  source.androidIconButton,
  "modifier.size(44.dp)",
  "Android IconButton 44dp frame",
);
assertContains(
  files.androidIconButton,
  source.androidIconButton,
  "color = LocalContentColor.current",
  "Android IconButton loading indicator foreground color",
);
assertContains(
  files.androidIconButton,
  source.androidIconButton,
  "KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle",
  "Android IconButton themed runtime token",
);

assertAllVariants(
  files.androidCounter,
  source.androidCounter,
  counter.tones,
  (tone) => {
    const name =
      tone === "brand"
        ? "Brand"
        : tone[0].toUpperCase() + tone.slice(1);
    return name;
  },
  "Android Counter",
);
assertContains(
  files.androidCounter,
  source.androidCounter,
  "enum class CounterSize",
  "Android Counter size API",
);
assertContains(
  files.androidCounter,
  source.androidCounter,
  "fun KozmosCounter",
  "Android Counter composable",
);
assertContains(
  files.androidCounter,
  source.androidCounter,
  "if (size == CounterSize.Sm) 18.dp else 20.dp",
  "Android Counter 18dp/20dp dimensions",
);
assertContains(
  files.androidCounter,
  source.androidCounter,
  "if (size == CounterSize.Sm) 5.dp else KozmosDimensions.primitivesLayoutSpacing75",
  "Android Counter 5dp/6dp horizontal padding",
);
assertContains(
  files.androidCounter,
  source.androidCounter,
  "if (size == CounterSize.Sm) 11.sp else 12.sp",
  "Android Counter 11sp/12sp font sizes",
);
assertContains(
  files.androidCounter,
  source.androidCounter,
  ".widthIn(min = minWidth)",
  "Android Counter minimum width",
);
assertContains(
  files.androidCounter,
  source.androidCounter,
  "normalizeCounterText",
  "Android Counter normalizes legacy wrapped values",
);
assertContains(
  files.androidCounterFigma,
  source.androidCounterFigma,
  "node-id=149-13430",
  "Android Counter Code Connect node ID",
);
assertContains(
  files.androidCounterFigma,
  source.androidCounterFigma,
  '@FigmaProperty(FigmaType.Text, "Counter Text")',
  "Android Counter Code Connect text mapping",
);
assertContains(
  files.androidCounterFigma,
  source.androidCounterFigma,
  '@FigmaProperty(FigmaType.Enum, "Tone")',
  "Android Counter Code Connect tone mapping",
);
assertContains(
  files.androidCounterFigma,
  source.androidCounterFigma,
  '@FigmaProperty(FigmaType.Enum, "Size")',
  "Android Counter Code Connect size mapping",
);
assertContains(
  files.androidFigmaLinked,
  source.androidFigmaLinked,
  "src/main/java/com/kozmos/components/Counter/Counter.figma.kt",
  "Android linked Code Connect includes Counter",
);

assertAllVariants(
  files.androidBadge,
  source.androidBadge,
  badge.variants,
  (variant) => {
    const name =
      variant === "default"
        ? "Default"
        : variant[0].toUpperCase() + variant.slice(1);
    return name;
  },
  "Android Badge",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  ".height(44.dp)",
  "Android Badge 44dp height",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  "Modifier.width(44.dp)",
  "Android Badge icon 44dp width",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  "KozmosThemeTokens.componentsPrimaryButtonsThemedButtonBackgroundIdle",
  "Android Badge themed runtime token",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  "counter: String? = null",
  "Android Badge counter API",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  "showCounter: Boolean = false",
  "Android Badge counter visibility API",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  "KozmosCounter(",
  "Android Badge composes Counter",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  "Arrangement.spacedBy(KozmosDimensions.primitivesLayoutSpacing50)",
  "Android Badge uses 4px content gap",
);
assertContains(
  files.androidBadge,
  source.androidBadge,
  "size != BadgeSize.Icon && showCounter && counter != null",
  "Android Badge hides Counter for icon-only variants",
);
assertContains(
  files.androidBadgeFigma,
  source.androidBadgeFigma,
  "node-id=78-246",
  "Android Badge Code Connect node ID",
);
assertContains(
  files.androidBadgeFigma,
  source.androidBadgeFigma,
  '@FigmaProperty(FigmaType.Text, "Label Text")',
  "Android Badge Code Connect label mapping",
);
assertContains(
  files.androidBadgeFigma,
  source.androidBadgeFigma,
  '@FigmaProperty(FigmaType.Boolean, "Show Counter")',
  "Android Badge Code Connect counter visibility mapping",
);
assertContains(
  files.androidFigmaLinked,
  source.androidFigmaLinked,
  "src/main/java/com/kozmos/components/Badge/Badge.figma.kt",
  "Android linked Code Connect includes Badge",
);
assertContains(
  files.androidCheckbox,
  source.androidCheckbox,
  ".heightIn(min = 44.dp)",
  "Android Checkbox 44dp row target",
);
assertContains(
  files.androidCheckbox,
  source.androidCheckbox,
  "error: Boolean = false",
  "Android Checkbox error API",
);
assertContains(
  files.androidCheckbox,
  source.androidCheckbox,
  "KozmosThemeTokens.primitivesColorsTheme500",
  "Android Checkbox themed runtime checked token",
);
assertContains(
  files.androidCheckbox,
  source.androidCheckbox,
  "KozmosThemeTokens.primitivesColorsEmotionalDanger600",
  "Android Checkbox error token",
);
assertContains(
  files.androidRadio,
  source.androidRadio,
  ".heightIn(min = 44.dp)",
  "Android Radio 44dp row target",
);
assertContains(
  files.androidRadio,
  source.androidRadio,
  "enabled: Boolean = true",
  "Android Radio enabled API",
);
assertContains(
  files.androidRadio,
  source.androidRadio,
  "error: Boolean = false",
  "Android Radio error API",
);
assertContains(
  files.androidRadio,
  source.androidRadio,
  "KozmosThemeTokens.primitivesColorsTheme500",
  "Android Radio themed runtime checked token",
);
assertContains(
  files.androidRadio,
  source.androidRadio,
  "KozmosThemeTokens.primitivesColorsEmotionalDanger600",
  "Android Radio error token",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  ".heightIn(min = 44.dp)",
  "Android Switch 44dp row target",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  ".width(44.dp)",
  "Android Switch 44dp visual track width",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  ".height(24.dp)",
  "Android Switch 24dp visual track height",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  ".size(20.dp)",
  "Android Switch 20dp visual thumb",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  "enabled: Boolean = true",
  "Android Switch enabled API",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  "error: Boolean = false",
  "Android Switch error API",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  "KozmosThemeTokens.primitivesColorsTheme500",
  "Android Switch themed runtime checked token",
);
assertContains(
  files.androidSwitch,
  source.androidSwitch,
  "KozmosThemeTokens.primitivesColorsEmotionalDanger600",
  "Android Switch error token",
);
assertContains(
  files.androidInput,
  source.androidInput,
  ".height(44.dp)",
  "Android Input 44dp field height",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "enabled: Boolean = true",
  "Android Input enabled API",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "readOnly: Boolean = false",
  "Android Input readOnly API",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "status: KozmosInputStatus = KozmosInputStatus.Default",
  "Android Input validation status API",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "helperText: String? = null",
  "Android Input helper text API",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "error: Boolean = false",
  "Android Input error API",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "KozmosThemeTokens.primitivesColorsForeground500",
  "Android Input neutral border token",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "KozmosThemeTokens.primitivesColorsEmotionalDanger600",
  "Android Input error token",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "KozmosThemeTokens.primitivesColorsEmotionalAlert600",
  "Android Input warning token",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "KozmosThemeTokens.primitivesColorsEmotionalSuccess600",
  "Android Input success token",
);
assertContains(
  files.androidInput,
  source.androidInput,
  "primitivesLayoutRadius100",
  "Android Input 8px field radius",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "LocalKozmosUseDarkTokens",
  "Android runtime dark token selector",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "KozmosColorsDark.componentsPrimaryButtonsThemedButtonBackgroundIdle",
  "Android dark component token source",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "KozmosColorsDark.primitivesColorsTheme500",
  "Android dark primitive checked token source",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "KozmosColorsDark.primitivesColorsEmotionalDanger600",
  "Android dark primitive error token source",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "KozmosColorsDark.primitivesColorsEmotionalAlert600",
  "Android dark primitive warning token source",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "KozmosColorsDark.primitivesColorsEmotionalSuccess600",
  "Android dark primitive success token source",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "KozmosColorsDark.primitivesColorsBackground100",
  "Android dark Input disabled background token source",
);
assertContains(
  files.androidThemeTokens,
  source.androidThemeTokens,
  "KozmosColorsDark.primitivesColorsForeground400",
  "Android dark Input placeholder token source",
);
assertContains(
  files.androidThemeProvider,
  source.androidThemeProvider,
  "LocalKozmosUseDarkTokens provides useDarkTheme",
  "Android ThemeProvider dark token binding",
);

assertJsonPathEquals(
  files.tokensDark,
  tokensDark,
  [
    "Components",
    "Primary Buttons",
    "themed",
    "button",
    "background",
    "idle",
    "$value",
  ],
  "#7EA2F6",
  "dark themed primary button background",
);
assertJsonPathEquals(
  files.tokensDark,
  tokensDark,
  [
    "Components",
    "Primary Buttons",
    "danger",
    "button",
    "background",
    "idle",
    "$value",
  ],
  "#EE7E95",
  "dark destructive primary button background",
);
assertJsonPathEquals(
  files.tokensDark,
  tokensDark,
  [
    "Components",
    "Secondary Buttons",
    "themed",
    "button",
    "foreground",
    "content",
    "idle",
    "$value",
  ],
  "#7EA2F6",
  "dark secondary button themed foreground",
);
assertJsonPathEquals(
  files.tokensDark,
  tokensDark,
  ["Semantics", "Data", "Blue", "$value"],
  "#60A5FA",
  "dark semantic data blue",
);
assertJsonPathEquals(
  files.tokensDark,
  tokensDark,
  ["Semantics", "Data", "Red", "$value"],
  "#F87171",
  "dark semantic data red",
);
assertJsonPathEquals(
  files.tokensDark,
  tokensDark,
  ["Semantics", "Data", "Yellow", "$value"],
  "#FBBF24",
  "dark semantic data yellow",
);
assertFigmaPayloadDarkValue(
  files.figmaFoundationsPayload,
  figmaFoundationsPayload,
  "Components/Primary Buttons/themed/button/background/idle",
  "#7EA2F6",
);
assertFigmaPayloadDarkValue(
  files.figmaFoundationsPayload,
  figmaFoundationsPayload,
  "Components/Primary Buttons/danger/button/background/idle",
  "#EE7E95",
);
assertFigmaPayloadDarkValue(
  files.figmaFoundationsPayload,
  figmaFoundationsPayload,
  "Components/Secondary Buttons/themed/button/foreground/content/idle",
  "#7EA2F6",
);
assertFigmaPayloadDarkValue(
  files.figmaFoundationsPayload,
  figmaFoundationsPayload,
  "Semantics/Data/Blue",
  "#60A5FA",
);
assertFigmaPayloadDarkValue(
  files.figmaFoundationsPayload,
  figmaFoundationsPayload,
  "Semantics/Data/Red",
  "#F87171",
);
assertFigmaPayloadDarkValue(
  files.figmaFoundationsPayload,
  figmaFoundationsPayload,
  "Semantics/Data/Yellow",
  "#FBBF24",
);
assertContains(
  files.iosColors,
  source.iosColors,
  'UIColor(hex: "#7EA2F6") : UIColor(hex: "#0D44C2")',
  "iOS dark themed primary button background stays blue",
);
assertContains(
  files.iosColors,
  source.iosColors,
  'UIColor(hex: "#EE7E95") : UIColor(hex: "#B01736")',
  "iOS dark destructive primary button background stays red",
);
assertContains(
  files.androidColorsDark,
  source.androidColorsDark,
  "val componentsPrimaryButtonsThemedButtonBackgroundIdle = Color(0xff7ea2f6)",
  "Android dark themed primary button background stays blue",
);
assertContains(
  files.androidColorsDark,
  source.androidColorsDark,
  "val componentsPrimaryButtonsDangerButtonBackgroundIdle = Color(0xffee7e95)",
  "Android dark destructive primary button background stays red",
);

console.log("Component contract parity ok");
