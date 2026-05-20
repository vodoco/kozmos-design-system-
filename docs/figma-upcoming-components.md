# Figma Component Backlog

This backlog tracks React code components that do not yet have canonical Core
Figma component sets in `Kozmos DS - Core Library`.

Generated context:

- Code inventory source: `packages/react/src/components`
- Current Core Figma v1 component sets: Button, IconButton, Badge, Card, Tabs,
  Tooltip, Dialog, Popover, Menu, Toast, Checkbox, Radio, Switch, Input,
  Textarea, Search, Select, Slider, Progress, Spinner, Avatar, Alert, Counter
- Icon source components already exist on the Figma `Icons` page, so `Icon` is
  treated separately from this component-set backlog.
- React placeholder Code Connect files already exist for Drawer,
  FloatingActionButton, Grid, SplitButton, Stack, and ToggleButton, but they
  still use `node-id=TBD` until matching Figma component sets are built.

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

## Wave 2 Scope

Wave 2 starts with low-risk primitives and composition helpers:

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
- SegmentedControl
- DatePicker
- TimePicker
- FileUpload
- OTPInput
- Rating
- Stepper
- SearchBar

## Layout, Navigation, And Data Display

- Accordion
- Breadcrumb
- BottomNavigation
- Navbar
- Pagination
- Sidebar
- ScrollArea
- Tree
- List
- Table
- Timeline
- Chip
- Tag

## Feedback And Overlays

- Backdrop
- BottomSheet
- Drawer
- EmptyState
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

## App/Provider Components

These may need docs, examples, or Code Connect rather than visible Figma
components.

- DynamicIsland
- FeedbackCard
- ThemeProvider

`GlassSettingsPanel` is treated as an internal/dev-only control surface and is
not part of the public NPM or Figma component roadmap.

## Next Recommendation

Build Wave 2 in the order above, then evaluate `FieldWrapper` and `Grid` before
starting heavier product/navigation components. This gives the library reusable
text, spacing, boundary, and disclosure primitives before composite work resumes.
