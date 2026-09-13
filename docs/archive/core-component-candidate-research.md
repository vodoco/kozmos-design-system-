# Core Component Candidate Research

Generated: 2026-05-23

This note expands the Core backlog beyond the prior Pointr reference scan. It
uses the current Kozmos repo inventory plus public design-system and
accessibility references to identify domain-neutral components that could
reasonably belong in Core before moving into SDK, dashboard, CMS, or map
product libraries.

Status update: 2026-06-21

The candidate research below is historical input, not the current completion
table. The active source of truth is `STATUS.md` and
`docs/figma-library-manifest.json`. Current Core is complete for the agreed
domain-neutral lane: 68/68 components are present and linked across Web,
SwiftUI, and Compose. There are no current `node-id=TBD` mapping placeholders.
The next work is not more blind Core promotion; it is source-of-truth cleanup,
token contrast governance, Figma visual QA, and then a separate Product / SDK
or Platform / Form-Factor lane for map, wayfinding, kiosk, dashboard, and
device-specific compositions.

## Working Definition

Core should contain primitives and generic patterns that are useful across
multiple product surfaces. It should not contain product domain objects,
map-specific controls, POI cards, route summaries, analytics dashboards, or
CMS-specific rows. Those should compose Core primitives in product libraries.

Platform and form-factor surfaces also should not inflate Core by default.
Dynamic Island, watch, kiosk, landscape, AR, VR, and XR patterns need their own
lane because they are constrained by device ergonomics, presentation states,
platform APIs, and product context. Promote only the underlying primitives back
into Core when they remain useful outside that form factor.

## Sources Checked

- Current Kozmos component inventory: `packages/react/src/components`
- Current manifest inventory: `docs/figma-library-manifest.json`
- Material Design components: https://m2.material.io/components
- Material 3 Android component APIs and release notes:
  https://developer.android.com/jetpack/androidx/releases/compose-material3
- Carbon Design System components:
  https://carbondesignsystem.com/components/overview/components/
- Atlassian Design System components: https://atlassian.design/components
- React Spectrum component index and picker docs:
  https://react-spectrum.adobe.com/v3/ColorPicker.html
- WAI-ARIA Authoring Practices patterns:
  https://www.w3.org/WAI/ARIA/apg/patterns/
- Radix Primitives overview:
  https://www.radix-ui.com/primitives/docs/overview/introduction
- Shopify Polaris index table and filters references:
  https://polaris-react.shopify.com/components/tables/index-table
  https://polaris-react.shopify.com/components/selection-and-input/filters
- Primer SelectPanel reference:
  https://primer.style/product/components/select-panel/
- Apple Human Interface Guidelines, Live Activities:
  https://developer.apple.com/design/human-interface-guidelines/live-activities
- Apple Human Interface Guidelines, spatial layout:
  https://developer.apple.com/design/human-interface-guidelines/spatial-layout
- Android XR UI design guidance:
  https://developer.android.com/design/ui/xr
- Android large-screen canonical layouts:
  https://developer.android.com/develop/ui/views/layout/canonical-layouts

## Current Kozmos Core State

Canonical linked Core today covers these component families:

- Layout and structure: Box, Stack, Grid, Container, Card, Separator.
- Actions and text actions: Button, IconButton, Link.
- Selection and forms: Input, Textarea, Search, Select, Checkbox, Radio,
  Switch, Slider, Chip, SegmentedControl.
- Navigation and disclosure: Breadcrumb, Pagination, Tabs, Accordion.
- Overlays: Dialog, Drawer, Menu, Popover, Tooltip.
- Feedback: Alert, Toast, Progress, Spinner, Skeleton.
- Data display and status: List, Table, Badge, Counter, Avatar.
- Icons: Icon source components exist separately from component-set Core.

Currently scaffolded but still needing canonical Figma node IDs or promotion
closure:

- FloatingActionButton
- SplitButton
- ToggleButton

Existing code-only components that are plausible Core candidates:

- Backdrop, BottomNavigation, BottomSheet, DatePicker, EmptyState,
  FieldWrapper, FileUpload, OTPInput, Rating, ScrollArea, SearchBar, Sidebar,
  Stepper, TimePicker, Timeline, Tree.

Existing code-only components that should remain product or SDK specific unless
their API is intentionally generalized:

- DirectionStep, FloorSelector, LocationPin, MapControlsGroup, MapOverlay,
  MapView, POICard, RouteSummary, RoutingInputGroup, SaveLocationCard,
  UserLocationMarker, WayfindingCard.

Existing form-factor components that should remain in the Platform /
Form-Factor lane until validated across products:

- DynamicIsland
- FeedbackCard

## High-Confidence Core Candidates

These appear repeatedly across major design systems, have clear accessibility
patterns, and are generic enough for Kozmos Core.

| Candidate                  | Why it belongs in Core                                                                                                            | Current Kozmos state                                                                                         | Priority |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| Grid                       | Layout primitive present in Atlassian, Spectrum, and most app systems; avoids ad hoc dashboard grids.                             | React, SwiftUI, Compose, Figma importer, and linked Code Connect complete for `359:1574`.                    | P0       |
| FormField / FieldWrapper   | Normalizes label, helper, error, required, disabled, and description anatomy for every input.                                     | React anatomy hardened with description, helper, error, required, optional, and label-action support.        | P0       |
| NumberInput / NumberField  | Carbon has Number input; Spectrum has NumberField; WAI-ARIA has Spinbutton. Needed for quantities, levels, zoom, counts, timings. | React, SwiftUI, and Compose code added; Figma importer and Code Connect scaffolds added; build/link pending. | P0       |
| Combobox / Autocomplete    | Spectrum, Radix, Primer SelectPanel, ARIA APG, and Polaris filtering patterns all validate this as a core complex input.          | React primitive and Figma importer builder added; build/link and Code Connect node ID pending.               | P0       |
| MultiSelect / Listbox      | Natural companion to Combobox for tags, filters, assigned users, categories, and facilities.                                      | React primitives and Figma importer builders added; build/link and Code Connect node IDs pending.            | P0       |
| SearchBar                  | Already in code; Material 3 has SearchBar APIs; Polaris filters depend on query fields.                                           | Code exists.                                                                                                 | P1       |
| EmptyState                 | Atlassian and Polaris treat it as a core status pattern; needed for tables, lists, permissions, and search misses.                | React, SwiftUI, Compose, Figma, and linked Code Connect complete.                                            | P1       |
| DatePicker                 | Material, Carbon, Spectrum, Atlassian, and ARIA examples all support date-picking as a core form control.                         | React API hardened around shared field anatomy.                                                              | P1       |
| DateRangePicker            | Important for dashboards, analytics, schedules, filters, and reporting.                                                           | React primitive added.                                                                                       | P1       |
| TimePicker / TimeField     | Material, Carbon, Spectrum all support time selection.                                                                            | React API hardened around shared field anatomy.                                                              | P1       |
| FileUpload / DropZone      | Carbon and Spectrum include file-trigger/drop-zone patterns; useful for imports and media.                                        | React primitive hardened with drag/drop, multiple files, max-file/size validation, and DropZone alias.       | P1       |
| OTPInput / PINInput        | Generic auth/verification control with existing code.                                                                             | React API hardened; Figma importer builder added; Figma component set built and React Code Connect linked.   | P1       |
| ToggleButton / ToggleGroup | Spectrum, Material, and ARIA toolbar patterns support toggleable controls distinct from segmented choice.                         | Code and scaffold exist.                                                                                     | P1       |
| SplitButton                | Common enterprise action pattern for a primary action plus related menu.                                                          | Code and scaffold exist.                                                                                     | P1       |
| FloatingActionButton       | Material core action pattern, especially for mobile/map shells. Keep generic if promoted.                                         | Code and scaffold exist.                                                                                     | P2       |
| BottomSheet                | Material bottom sheet pattern and useful mobile overlay. Could be Drawer side variant or separate component.                      | Code exists.                                                                                                 | P2       |
| ScrollArea                 | Common low-level primitive for contained scroll regions and menus.                                                                | Code exists.                                                                                                 | P2       |
| Tree / TreeView            | ARIA APG, Spectrum, Atlassian table-tree patterns; useful for nested navigation and hierarchy.                                    | Code exists.                                                                                                 | P2       |
| Timeline                   | Useful generic history/event display. Keep product content out of Core.                                                           | Code exists.                                                                                                 | P2       |
| Rating                     | Generic feedback input; promote only if product demand is recurring.                                                              | Code exists.                                                                                                 | P3       |

## Broad Candidate Inventory

### Actions

- Button
- IconButton
- Link
- Pressable / Anchor primitive
- FloatingActionButton
- SplitButton
- ToggleButton
- ToggleGroup
- ButtonGroup
- Toolbar

### Forms And Inputs

- Form
- FormField / FieldWrapper
- Label
- HelpText / FormMessage
- Input / TextField
- PasswordInput
- NumberInput / NumberField / Spinbutton
- Textarea
- SearchField
- SearchBar
- Select
- Combobox / Autocomplete
- MultiSelect
- Listbox
- Checkbox
- CheckboxGroup
- Radio
- RadioGroup
- Switch
- Slider
- RangeSlider
- DateField
- DatePicker
- DateRangePicker
- TimeField
- TimePicker
- Calendar
- ColorField
- ColorPicker
- ColorSlider
- ColorSwatch
- ColorSwatchPicker
- FileUpload
- DropZone
- FileTrigger
- OTPInput / PINInput
- Rating

### Selection, Filters, And Choice

- Chip
- Tag
- Badge
- Lozenge / Status label
- SegmentedControl
- ContentSwitcher
- FilterBar
- AppliedFilters
- SortControl
- ViewTabs / saved views

### Navigation

- Breadcrumb
- Pagination
- Tabs
- Menu
- NavigationMenu
- TopNavigation / Navbar
- Sidebar / SideNavigation
- BottomNavigation
- NavigationRail
- Stepper / ProgressTracker
- CommandPalette / CommandMenu

### Layout And Utilities

- Box
- Stack
- Inline / Flex
- Grid
- Container
- Separator / Divider
- Spacer
- AspectRatio
- Bleed / Inset
- ScrollArea
- Backdrop / Blanket
- Portal
- FocusRing
- VisuallyHidden
- Collapsible / Disclosure
- Resizable / SplitPane / WindowSplitter

### Data Display

- Text
- Heading
- Code
- CodeBlock / CodeSnippet
- Keyboard / Kbd
- Icon
- Avatar
- AvatarGroup
- Image / Thumbnail
- Card
- List
- DescriptionList
- KeyValue / LabeledValue
- Metric / Stat
- Counter
- Table
- DataTable
- DataGrid
- Tree
- TreeGrid
- Timeline
- Calendar display

### Feedback And Status

- Alert
- AlertDialog
- Banner
- InlineMessage
- SectionMessage / Callout
- Toast
- Progress
- ProgressTracker
- Spinner
- Skeleton
- EmptyState
- LoadingOverlay
- Meter
- StatusDot / StatusLight

### Overlays

- Dialog
- ConfirmDialog
- Drawer
- Sheet
- BottomSheet
- Popover
- HoverCard
- Tooltip
- Menu
- ContextMenu
- SelectPanel / CommandPanel
- Spotlight / Tour

### Platform And Form-Factor

These are tracked separately from Core. They should be designed from product
screens and platform guidance, then composed from Core primitives where
possible.

- DynamicIsland / LiveActivity
- LiveActivityCompact
- LiveActivityMinimal
- LiveActivityExpanded
- WatchTile
- WatchComplication
- WatchNotification
- WatchAction
- SpatialPanel
- SpatialToolbar
- SpatialTooltip
- AnchorPrompt
- PlacementGuide
- GazeFocusRing
- PassthroughScrim
- ImmersiveOverlay
- KioskShell
- KioskIdleScreen
- KioskLanguageSelector
- KioskSessionTimeout
- KioskAccessibilityControls
- LargeScreenShell
- ListDetailLayout
- SupportingPane
- MapWithSidePanel
- MapWithBottomSheet
- LandscapeToolbar

## Color Picker Recommendation

ColorPicker is a valid Core candidate, but it should not be in the next wave
unless Kozmos expects product users to edit themes, brand colors, map layer
colors, or data visualization palettes. Spectrum treats color input as a family
of ColorField, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, and
ColorWheel. For Kozmos, a pragmatic Core split would be:

1. ColorSwatch and ColorField first.
2. ColorPicker popover second.
3. Advanced ColorSlider, ColorArea, ColorWheel only if theme tooling needs it.

## Recommended Build Order

### Wave 0: Close Existing Scaffolds

1. SegmentedControl: linked to the canonical Figma set `309:5165`.
2. Grid: linked to the canonical Figma set `359:1574`; keep future fixes as
   in-place Update Grid runs to preserve that node ID.
3. ToggleButton, SplitButton, FloatingActionButton: either build Figma sets or
   move them out of Core publish lanes until the need is clear.

### Wave 1: Form Completeness

1. FormField / FieldWrapper
2. NumberInput: React, SwiftUI, and Compose code added; Figma importer and Code
   Connect scaffolds added; component-set build/link pending.
3. Combobox: React primitive and Figma importer builder added; component-set
   build/link and Code Connect node pending.
4. MultiSelect / Listbox: React primitives and Figma importer builders added;
   component-set build/link and Code Connect nodes pending.
5. SearchBar

### Wave 2: Date, Files, And Empty States

1. EmptyState
2. DatePicker: React API hardened; Figma component set pending.
3. DateRangePicker: React primitive added; Figma component set pending.
4. TimePicker / TimeField: TimePicker React API hardened; Figma component set
   pending.
5. FileUpload / DropZone: React primitive hardened; Figma component set
   pending.
6. OTPInput: React API hardened; Figma importer builder added; Figma component
   set built and React Code Connect linked to node `475:38745`.

### Wave 3: Navigation And Data Structure

1. BottomNavigation or NavigationRail
2. Sidebar / SideNavigation
3. Tree / TreeView
4. Timeline
5. ScrollArea
6. Stepper / ProgressTracker

### Wave 4: Specialized But Still Core

1. ColorField / ColorSwatch
2. ColorPicker
3. Rating
4. AvatarGroup
5. Code / CodeBlock / Kbd
6. Metric / Stat
7. Meter / StatusLight

## Recommended Non-Core Boundary

Keep these out of Core unless they are rebuilt as generic shells:

- POI cards, wayfinding cards, route summaries, direction steps.
- Floor selectors, building selectors, map layer selectors, indoor-map controls.
- Map view, map overlays, user location marker, location pins, attribution, map
  logos, geofences, paths, and live navigation states.
- Dashboard-specific taxonomy rows, publish modules, analytics cards, custom CMS
  rows, and saved-view business logic.
- Full charting primitives unless a separate data-visualization package is
  planned.
