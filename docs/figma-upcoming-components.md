# Figma Component Backlog

This backlog tracks components that should become part of the expanded Core
library in `Kozmos DS - Core Library`. It includes existing React components
that do not yet have canonical Core Figma component sets and net-new Core
components identified during the 2026-05-23 cross-design-system research pass.

Generated context:

- Current 2026-06-21 status: the old "upcoming Core" component waves have been
  closed for the current domain-neutral Core lane. `STATUS.md` reports Core at
  68/68 across Web, tests, linked Web Code Connect, iOS, linked iOS Code
  Connect, Android, and linked Android Code Connect. Treat the older wave notes
  below as historical rationale, not as the active missing-component list.
- No current `.figma.*` mapping files contain `node-id=TBD`. Future additions
  should still use Update over Rebuild to preserve node IDs and should pass
  `pnpm figma:parse:linked`, `pnpm figma:parse:native:linked`, component
  contracts, token contrast contracts, and visual QA before being considered
  complete.
- Active next work is polish and governance: refresh stale documentation,
  verify token contrast contracts, perform Figma visual QA on crowded/collapsed
  layouts, and keep Product / SDK examples separate from Core component sets.

- Code inventory source: `packages/react/src/components`
- Current linked Core Figma component sets: Link, Separator, Skeleton, Box,
  Stack, Grid, Container, Breadcrumb, Accordion, Button, IconButton, Counter,
  Badge, Card, List, Table, Tabs, Pagination, Tooltip, Dialog, Drawer, Popover,
  Menu, Checkbox, Radio, Switch, Input, Textarea, Search, Select, Slider,
  Progress, Spinner, Alert, EmptyState, Toast, Avatar, Chip, and
  SegmentedControl.
- Chip, Drawer, Grid, List, Table, Pagination, and SegmentedControl are now
  linked in the React, SwiftUI, and Compose Core Code Connect publish lanes.
- Icon source components already exist on the Figma `Icons` page, so `Icon` is
  treated separately from this component-set backlog.
- React placeholder Code Connect files already exist for FloatingActionButton,
  SplitButton, and ToggleButton, but they still use `node-id=TBD` until matching
  canonical Figma component sets are linked.

Update 2026-05-24: FloatingActionButton, SplitButton, and ToggleButton have
now been promoted into the Figma build flow. The next expansion pass is the
form and picker wave: FormField / FieldWrapper, Combobox, MultiSelect /
Listbox, DatePicker / DateRangePicker / TimePicker, and FileUpload / DropZone.

Update 2026-05-25: the importer picker now surfaces the form and picker wave
with wired component-set generators for FormField, Combobox, MultiSelect,
Listbox, DatePicker, DateRangePicker, TimePicker, and FileUpload. DropZone is
represented by FileUpload `Content=Dropzone` because React exports DropZone as
a FileUpload alias.

## Core v1 Freeze

Core v1 is treated as frozen after the 2026-05-20 audit with zero warnings,
zero transparent-surface QA issues, and no contrast failures. Future work should
preserve existing component set names and node IDs in place unless an explicit
archive/migration is requested.

User note: the library should still receive fine-tuning and polish passes after
new components land. Recommendations are welcome, especially for component
proportions, naming, docs clarity, and visual fidelity, but every added or tuned
component must pass the relevant importer, contract, parsing, build, and visual
QA checks before being considered done.

## Recently Completed Core Expansion

These low-risk primitives and composition helpers have either landed as Figma
component sets or, for typography-only entries, as text styles:

- Text
- Heading
- Link
- Label
- Separator
- Skeleton
- Box
- Stack
- Container
- Breadcrumb
- Accordion

Text, Heading, and Label are intentionally not Core component sets in Figma;
they live as text styles/tokens and code components. Link and Separator remain
component sets because they carry interaction or visual anatomy beyond raw
typography.

## Accepted Core Expansion Scope

The current direction is to include the full domain-neutral Core set, not just
the smallest product-derived subset. Each item still needs the normal design,
API, accessibility, Figma, Code Connect, and platform parity checks before it is
treated as shipped.

### Wave 0: Close Existing Scaffolds

These already have Code Connect scaffolds or Figma importer work and should be
closed before adding more placeholders.

- SegmentedControl (closed: linked to `309:5165`)
- Grid (closed: linked to `359:1574`)
- ToggleButton
- SplitButton
- FloatingActionButton

### Wave 1: Form Completeness

These fill the biggest generic product-form gaps and unblock dashboard, CMS,
configuration, and filtering flows.

- FormField / FieldWrapper (React anatomy hardened; Figma importer builder
  added with a shared child content slot)
- NumberInput / NumberField / Spinbutton (React, SwiftUI, and Compose code
  added; Figma importer and Code Connect scaffolds added; Figma component set
  build/link pending)
- Combobox / Autocomplete (React primitive and Figma importer builder added;
  Figma component-set build/link and Code Connect node ID pending)
- MultiSelect / Listbox (React primitives and Figma importer builders added;
  Figma component-set build/link and Code Connect node IDs pending)
- PasswordInput (React primitive and Figma importer builder added; Figma
  component-set build/link and Code Connect node ID pending)
- SearchBar
- CheckboxGroup
- RadioGroup
- RangeSlider

### Wave 2: Date, File, And Verification Inputs

- DateField
- DatePicker (React API hardened; Figma importer builder added with closed
  field and open calendar examples)
- DateRangePicker (React primitive added; Figma importer builder added with
  closed two-field and open range-calendar examples)
- TimeField
- TimePicker (React API hardened; Figma importer builder added with closed
  field and open time-list examples)
- Calendar
- FileUpload / DropZone (React primitive hardened with multiple-file,
  validation, drag/drop, and accessibility support; Figma importer builder
  added with DropZone represented as `Content=Dropzone`)
- FileTrigger
- OTPInput / PINInput (React API hardened; Figma importer builder added; Figma
  component set built and React Code Connect linked to node `475:38745`)

### Wave 3: Navigation, Structure, And Disclosure

- BottomNavigation
- NavigationRail
- Navbar / TopNavigation
- Sidebar / SideNavigation
- NavigationMenu
- CommandPalette / CommandMenu
- Stepper / ProgressTracker
- Tree / TreeView (React primitive hardened with tree semantics, keyboard
  behavior, counts, metadata, and safe nested row actions; Figma importer
  builder added with Basic/Count/Actions content examples)
- Timeline (Figma importer builder added; component set built and Code Connect
  linked across React, SwiftUI, and Compose)
- ScrollArea
- Collapsible / Disclosure
- Resizable / SplitPane / WindowSplitter

### Wave 4: Data Display And Utility Primitives

- AvatarGroup
- DescriptionList
- KeyValue / LabeledValue
- Metric / Stat
- Code
- CodeBlock / CodeSnippet
- Keyboard / Kbd
- Image / Thumbnail
- AspectRatio
- Spacer
- Inline / Flex
- VisuallyHidden
- FocusRing
- Portal
- DataGrid
- TreeGrid

### Wave 5: Feedback, Status, And Overlay Depth

- AlertDialog
- ConfirmDialog
- Banner
- InlineMessage
- SectionMessage / Callout
- LoadingOverlay
- Meter
- StatusDot / StatusLight
- HoverCard
- ContextMenu
- Sheet
- BottomSheet
- Backdrop / Blanket
- Spotlight / Tour

### Wave 6: Specialized But Still Core

- ColorField
- ColorSwatch
- ColorSwatchPicker
- ColorSlider
- ColorArea
- ColorWheel
- Rating
- FilterBar
- AppliedFilters
- SortControl
- ButtonGroup
- Toolbar

## Composition Dependencies

These should come before more composite work because Card, Dialog, forms,
navigation, and product cards should compose from them instead of cloning their
visuals.

- Label
- Text
- Heading
- Link
- Separator
- FieldWrapper
- Box
- Stack
- Container
- Grid

## Actions And Inputs

- FloatingActionButton
- SplitButton
- ToggleButton
- ButtonGroup
- Toolbar
- NumberInput (React, SwiftUI, and Compose code added; Figma importer and Code
  Connect scaffolds added; Figma component set build/link pending)
- PasswordInput (React primitive and Figma importer builder added; Figma
  component-set build/link pending)
- Combobox
- MultiSelect
- DatePicker
- DateRangePicker
- TimePicker
- DateField
- TimeField
- Calendar
- FileUpload / DropZone alias
- FileTrigger
- OTPInput / PINInput (builder added; Figma component set built and React Code
  Connect linked to node `475:38745`)
- Rating
- Stepper
- SearchBar
- ColorField
- ColorSwatch

## Layout, Navigation, And Data Display

- Accordion
- Breadcrumb
- BottomNavigation
- Navbar
- NavigationMenu
- NavigationRail
- CommandPalette
- Pagination (implemented and linked)
- Sidebar
- ScrollArea
- Tree (React primitive hardened; Figma importer builder added with row count
  and action anatomy examples)
- TreeGrid
- List (implemented and linked)
- Table (implemented and linked)
- DataGrid
- DescriptionList
- KeyValue
- Metric
- Timeline (Figma importer builder added; component set built and Code Connect
  linked across React, SwiftUI, and Compose)
- Chip (implemented and linked)
- SegmentedControl (implemented and linked)

`Tag` remains available in code as a legacy/static label component, but Core
promotion should use `Chip` for compact selectable, removable, and filterable
items. Avoid adding both to the Figma Core library unless a future platform
requirement creates a clear semantic split.

## Feedback And Overlays

- Backdrop
- BottomSheet
- Drawer (implemented and linked)
- EmptyState
- AlertDialog
- ConfirmDialog
- Banner
- InlineMessage
- SectionMessage
- LoadingOverlay
- Meter
- StatusDot
- HoverCard
- ContextMenu
- Sheet
- Spotlight
- Skeleton

## Map And Product Components

- DirectionStep
- FloorSelector
- LocationPin
- MapControlsGroup
- MapOverlay
- MapView
- NavigationAnnouncer
- POICard
- RouteSummary
- RoutingInputGroup
- SaveLocationCard
- UserLocationMarker
- WayfindingCard

## Platform / Form-Factor Components

These should not be mixed into the domain-neutral Core lane. They need their
own platform and product validation because the same primitive can behave very
differently on Dynamic Island, watch, kiosk, landscape, and spatial surfaces.

- DynamicIsland
- FeedbackCard
- ThemeProvider

DynamicIsland is the canonical name for the iOS live activity surface. Avoid
`IslandDisplay` or generic island naming unless a non-Apple platform abstraction
is intentionally being designed.

Recommended expansion lanes:

- Dynamic Island / Live Activity: compact, minimal, expanded, Lock Screen,
  StandBy, Smart Stack, and fallback web/fullscreen presentations.
- Watch / wearable: tile, complication, glance card, notification, compact
  list, confirmation, and map/route glance patterns.
- Spatial / AR / VR / XR: spatial panel, anchored prompt, placement guide,
  gaze/focus affordance, immersive overlay, passthrough scrim, and spatial
  tooltip patterns.
- Kiosk: idle screen, language selector, large action, route launcher, QR
  handoff, session timeout, offline state, and accessibility controls.
- Landscape / large screen: split pane, map with side panel, list-detail,
  supporting pane, command panel, and bottom-sheet-to-side-panel adaptations.

Use platform guidance as constraints, not as a reason to duplicate Core
controls. The form-factor lane should compose Button, IconButton, Card, Dialog,
Drawer, Sheet, List, Grid, Tabs, Progress, EmptyState, and map/product
components rather than cloning their anatomy.

`GlassSettingsPanel` is treated as an internal/dev-only control surface and is
not part of the public NPM or Figma component roadmap.

## Net-New Components Needed In Code

These are not present as current React component directories and need a code API
before Figma promotion.

- DateField
- TimeField
- Calendar
- FileTrigger
- ColorField
- ColorSwatch
- ColorSwatchPicker
- ColorSlider
- ColorArea
- ColorWheel
- CheckboxGroup
- RadioGroup
- RangeSlider
- NavigationMenu
- NavigationRail
- CommandPalette
- ButtonGroup
- Toolbar
- AspectRatio
- Spacer
- Inline
- VisuallyHidden
- FocusRing
- Portal
- Collapsible
- Resizable
- SplitPane
- DescriptionList
- KeyValue
- Metric
- AvatarGroup
- Code
- CodeBlock
- Kbd
- DataGrid
- TreeGrid
- AlertDialog
- ConfirmDialog
- Banner
- InlineMessage
- SectionMessage
- LoadingOverlay
- Meter
- StatusDot
- HoverCard
- ContextMenu
- Sheet
- Spotlight
- FilterBar
- AppliedFilters
- SortControl
- LiveActivity
- WatchTile
- WatchComplication
- SpatialPanel
- SpatialToolbar
- AnchorPrompt
- PlacementGuide
- KioskShell
- IdleScreen
- LargeScreenShell
- ListDetailLayout
- SupportingPane

## Product / SDK And Platform Wave (2026-08-24)

The importer now has builders for every remaining Product / SDK component plus
the two platform/form-factor surfaces. Eighteen sets were added:

| Component             | Axis                   | Values                                   |
| --------------------- | ---------------------- | ---------------------------------------- |
| AdaptiveMapShell      | `PanelPlacement`       | Start, End                               |
| BrowseCategoriesPanel | `Content`              | Basic, Search, Empty                     |
| CategoryTile          | `State`                | Default, Selected, Disabled              |
| DynamicIsland         | `State`                | Compact, Expanded, Minimal               |
| FeedbackCard          | `State`                | Default, Submitting, Success             |
| MapControlButton      | `Presentation`         | IconOnly, Labelled                       |
| MapControlsGroup      | `LocationPresentation` | IconOnly, Labelled                       |
| MapOverlay            | `Width`                | Auto, Small, Medium, Large, Full         |
| POIDetailPanel        | `Presentation`         | Inline, Sheet, Panel                     |
| POIMediaGallery       | `Content`              | Single, Multiple, Empty                  |
| POIResultCard         | `State`                | Default, Selected, Featured, Unavailable |
| POIResultList         | `Content`              | Basic, Selected, Empty                   |
| RouteOptionCard       | `State`                | Default, Selected, Warning, Unavailable  |
| RoutePreviewPanel     | `Status`               | Idle, Calculating, Ready, NoRoute, Error |
| RouteSummary          | `State`                | Preview, Active                          |
| RoutingInputGroup     | `Content`              | TwoPoints, ThreePoints                   |
| SaveLocationCard      | `State`                | Default, Saved                           |
| UserLocationMarker    | `Heading`              | Hidden, Visible                          |

`DynamicIsland` and `FeedbackCard` sit in a new `Platform / Form-Factor` layout
section rather than in Product / SDK, matching how `STATUS.md` lanes them.

Five of these close variant-parity gaps against real React props, so the axis
names are load-bearing and must stay single tokens for the analyzer to match
them: `panelPlacement`, `presentation`, `locationPresentation`, `width`, and
`presentation` again for POIDetailPanel. `pnpm components:variant:check` now
reports 1/25 Figma gaps, down from 6/25, and the remaining one is `Icon`, which
is intentional — icons are source components on the `Icons` page.

Still to do for this wave: build the sets in Figma, review them, and write the
Code Connect files for React, SwiftUI, and Compose.

## Code-Ready, Figma Builder Pending

These now have React implementations and importer visibility, but still need
canonical Figma component-set generators plus Code Connect node IDs.

- None. The Product / SDK and platform wave above closed the last of them.
  DropZone remains intentionally covered by FileUpload `Content=Dropzone`,
  FieldWrapper by the `FormField` set, and GlassSettingsPanel is internal-only.

FormField, Combobox, MultiSelect, Listbox, DatePicker, DateRangePicker,
TimePicker, and FileUpload have moved out of this list because their importer
builders are now wired; they still need the Figma component sets to be built,
reviewed, published, and linked to Code Connect.

## Immediate Next Recommendation

Start with Wave 0, then Wave 1. That gives Core the highest leverage without
creating a large number of Figma-only or code-only placeholders.

1. Build/link ToggleButton, SplitButton, and FloatingActionButton or explicitly
   move them out of Core publish lanes.
2. Build/link FormField, Combobox, MultiSelect, Listbox, DatePicker,
   DateRangePicker, TimePicker, and FileUpload from the importer. SearchBar can
   follow once we decide whether it remains a Search variant or becomes a
   separate component.

---

## Pointr Cloud dashboard — what Core actually needs (2026-08-30)

Read from the product file `O1piybZEETp5oSqTtGjH39` over the REST API, not from
screenshots: `2007:24537` (Buildings Listed during Expert Review), `2007:26407`
(Scope:Campus), `3704:29452` (Review panel). Sizes below are measured.

**The headline is that most of it already exists.** The dashboard is built from
an older product library — `listItem`, `foldersIcons`, `showHideButton`,
`.Buttons Master *`, `Text-Inputs`, `notifierBox/Side-Drawer-Footer` — none of
which are Core names. So the gap is mostly _adoption_, not construction, and the
genuinely new components are fewer than the screens suggest.

### The drawer already has the anatomy that was asked about

Core's `Drawer` (`232:2042`) is built as:

```
Side=Right
  Drawer Header   Drawer Header Content  +  Drawer Close (44x44)
  Drawer Body     Body Text  +  Content Slot [SLOT]
  Drawer Footer   Secondary Action  +  Primary Action
```

That is header-with-close, a real body slot, and a two-action footer — the Save
and Exit row and the close button, already there. Pointr's `sideDrawer`
(400x765) matches it structurally: `drawerHeader` + `x-close`, a `body`, and
`notifierBox/Side-Drawer-Footer` (400x80) holding two 180x48 buttons.

Three differences worth deciding on rather than copying:

- Pointr's close is **24x24**; Core's `Drawer Close` is **44x44** and meets the
  touch minimum. Core is right; the product should adopt the larger target.
- Pointr's footer is **80** tall with 48px buttons, Core's is **44** with 44px.
  Someone has to pick.
- Pointr's footer is an instance of `notifierBox/Side-Drawer-Footer` — a
  notifier box doing double duty as a footer. Core should not copy that
  conflation.

And this is where the invalid assets come from. `Drawer` carries three unbound
SLOT properties — `Drawer Body`, `Slot`, `Slot2` — while the set contains one
real `Content Slot [SLOT]` node. They are a half-finished attempt at exactly the
slot API the dashboard needs, never attached. That is why Figma refuses to
publish the set, and why deleting them would have been the wrong move.

### Missing from Core

| Component          | From                 | Measured | Notes                                                                                      |
| ------------------ | -------------------- | -------- | ------------------------------------------------------------------------------------------ |
| **ActionBar**      | `Metadata Buttons`   | 400x68   | Cancel left, action group right. Horizontal auto-layout with a spacer, not a Stack.        |
| **StatusStrip**    | `FateStrip · step 7` | 400x37   | One line of tonal status ("Published just now"). Despite the name it is not a `Stepper`.   |
| **MagnitudeBlock** | `magnitude`          | 400x118  | `banner` (400x66) over `metrics` (400x52). A summary-plus-stats block.                     |
| **ChangeList**     | `changelog`          | 400x1105 | Four groups — new, updated, deleted, preserved — each a header over rows.                  |
| **DrawerToolbar**  | `content-filter`     | 320x80   | Search plus filter buttons between header and body. Likely a Drawer slot, not a component. |

`ChangeList` has its colour foundation already: `Semantics.Diff.New`,
`.Updated`, `.Deleted` and `.Override` were added in `5589dfd` for exactly this
app. Only the fourth needs a decision — the changelog's group is "preserved",
the token is "Override", and they may not be the same idea.

### Fixes to existing Core components

- **`TreeChildItem` needs more actions.** A Pointr `listItem` row carries five
  — edit, lock, eye, flag, overflow — plus a show/hide toggle. Core declares two
  action icon slots and renders one, which is why `Action 2 Icon` is unbound.
  This wants an `Actions` count axis, not a second hardcoded slot.
- **`MultiSelect` chip labels.** `Chip 1 Text` and `Chip 2 Text` cannot bind,
  because the chips are nested `Chip` instances whose label is driven by the
  Chip's own `Label Text`. Forwarding the nested instance's property is the fix.
  The dashboard uses 100 `Tags`, so this is not hypothetical.
- **`Drawer` slots.** Bind `Drawer Body` to the real `Content Slot` node and
  drop the stray `Slot` / `Slot2`.
- **`ColorPicker`.** `Hex Label Text` and `Palette Text` have no nodes. Three
  siblings — `Mode Text`, `Hue Label Text`, `Alpha Label Text` — were already
  deleted rather than wired. Decide whether this family is wanted at all.

### Sequence

1. **Unblock publishing.** The four sets above carry eight unbound properties
   and Figma will not publish them. Wiring `Drawer` and `MultiSelect` is the
   real fix; removing `ColorPicker`'s two is likely right; `TreeChildItem`'s
   waits on the actions axis.
2. **Drawer slot API**, since it is the component the dashboard leans on hardest
   and the work is already half done.
3. **ActionBar and StatusStrip** — small, self-contained, and used on both
   screens.
4. **ChangeList and MagnitudeBlock** — larger, and specific to the review flow.
5. **`TreeChildItem` actions axis** — needs a decision on maximum count before
   it can be built.

### Decisions needed before building

- Footer height and button size: Pointr's 80/48 or Core's 44/44.
- How many row actions `TreeChildItem` should support, and whether the overflow
  ("dots-horizontal") is one of them or separate.
- Whether "preserved" maps to `Semantics.Diff.Override` or wants its own token.
- Whether these live in Core or in a Pointr Cloud lane beside Product / SDK.
  They are dashboard patterns, not wayfinding ones, and Core is domain-neutral
  by policy — see `docs/figma-core-gap-audit.md`.
