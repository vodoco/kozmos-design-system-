# Figma Component Backlog

This backlog tracks React code components that do not yet have canonical Core
Figma component sets in `Kozmos DS - Core Library`.

Generated context:

- Code inventory source: `packages/react/src/components`
- Current Core Figma v1 component sets: Button, IconButton, Badge, Card, Tabs,
  Tooltip, Dialog, Popover, Menu, Toast, Checkbox, Radio, Switch, Input,
  Textarea, Search, Select, Slider, Progress, Spinner, Avatar, Alert
- Icon source components already exist on the Figma `Icons` page, so `Icon` is
  treated separately from this component-set backlog.
- React placeholder Code Connect files already exist for Drawer,
  FloatingActionButton, Grid, SplitButton, Stack, and ToggleButton, but they
  still use `node-id=TBD` until matching Figma component sets are built.

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

Build `Label`, `Text`, `Heading`, `Separator`, `Box`, `Stack`, `Container`, and
`FieldWrapper` first. They reduce clone pressure in every composite component
and let Card/Dialog/Menu/Form examples become real composition instead of local
frames.
