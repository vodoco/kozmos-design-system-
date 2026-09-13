# Figma Core Gap Audit

Generated: 2026-05-21

This audit compares the current Kozmos Core library against selected Pointr
Cloud Dashboard and Pointr Maps Express reference nodes. It is intended as a
scope gate before adding SDK, dashboard, CMS, or map-specific component sets.

## Sources Checked

- Pointr Cloud Dashboard v9: taxonomy workflow section
  - https://www.figma.com/design/b8dqhE3CPxitYfqlXuQJTC?node-id=15703-113650
- Pointr Maps Express: branded Express/onboarding/welcome flows
  - https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=18518-29917
- Pointr Maps Express: theme support
  - https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=16415-43319
- Pointr Maps Express: rate your experience
  - https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=19922-8556
- Pointr Maps Express: logo placement and whitelabeling
  - https://www.figma.com/design/BwtG2COVRqUWGPrIvP4jxr?node-id=11673-277621

## Current Core Coverage

Current Core already covers the repeated base controls seen in the reference
files: Button, IconButton, Input, Textarea, Search, Select, Checkbox, Radio,
Switch, Slider, Badge, Counter, Card, Tabs, Dialog, Drawer, Popover, Menu,
Tooltip, Toast, Alert, EmptyState, Avatar, Accordion, Breadcrumb, Link,
Separator, Skeleton, Progress, Spinner, Box, Stack, Container, Chip, and
SegmentedControl.

The reference files heavily use older or local versions of these same ideas:
buttons, text inputs, dropdown items, tags, counters, tabs, menus, search boxes,
accordions, drawers, map controls, and icon-heavy map symbols.

## Remaining Core List After Second Scan

The second scan now leaves one product-evidenced Core candidate:

1. SearchBar or Combobox

Status: Chip, Drawer, Table, List, Pagination, SegmentedControl, and EmptyState
are now implemented and linked across React, SwiftUI, Compose, Code Connect, and
the canonical Figma component sets.

Do not promote domain cards, map shells, POI rows, wayfinding journey cards,
analytics charts, or white-label placement rules into Core. Those should be
SDK, dashboard, CMS, or product-library compositions.

Do not promote device-specific surfaces into Core either. Dynamic Island,
watch/wearable, kiosk, landscape, AR, VR, and XR work should live in a
Platform / Form-Factor lane until product screenshots and platform constraints
prove which pieces are genuinely reusable primitives.

## Promoted In This Pass

These appear repeatedly across dashboard and Maps Express flows and are not
inherently map-specific.

- **Chip**
  - Evidence: Cloud Dashboard has many tag/small/default and Tags instances;
    Maps Express theme and rating pages use Tags heavily.
  - Recommendation: build Core `Chip` as the one compact filter/category
    primitive. Keep `Badge` for passive metadata and do not promote `Tag` as a
    second Core primitive unless a future semantic split becomes unavoidable.
    Chip should support neutral, brand, destructive, selected, removable, and
    size states.

- **SegmentedControl / ToggleGroup**
  - Evidence: taxonomy type selectors, filter tabs, and theme support controls
    repeatedly behave like segmented choices.
  - Recommendation: promoted as a Core selection primitive. Do not model every
    dashboard "type selector" as a separate component.

- **Drawer / Sheet**
  - Evidence: sideDrawer, side-drawer button groups, drawer/bottom/info, and
    onboarding overlays appear in both dashboard and map references.
  - Recommendation: promoted as a generic Core `Drawer` shell with side
    variants. Dashboard, SDK, and maps libraries should own the actual contents.

## Data Display Promotion

- **Table / Data Row / List**
  - Evidence: taxonomy workflow uses rows, columns, metadata tables, listItem,
    and tree/dropdown item structures. Dashboard surfaces will need this before
    analytics/CMS screens are credible.
  - Recommendation: promote low-level Table and List primitives. Keep taxonomy
    rows, POI rows, and CMS rows as product compositions.

## Promote To Core Next

- **SearchBar / Combobox**
  - Evidence: Cloud Dashboard uses Global Search Box, Search Box, search
    containers, type filtering, and typed dropdown flows.
  - Recommendation: Core should either extend `Search` into a full SearchBar
    pattern or add Combobox for searchable option lists.

- **EmptyState** (completed)
  - Evidence: sparse direct evidence in these nodes, but dashboard and SDK
    workflows will need non-data, loading, and permission-empty states.
  - Result: promoted as a generic icon/title/description/action pattern and
    linked to canonical component set `347:5316`.

## Consider After Core Expansion

These are reusable, but they need clearer API or product validation before they
become Core.

- **FieldWrapper / FormField**
  - The references show repeated label, hint, input, validation, and helper
    structures. This is probably a code/anatomy primitive more than a visible
    Figma component set.

- **Toolbar / Header / Sidebar / Navigation**
  - Present in both product families, but APIs differ sharply between dashboard,
    mobile SDK, and map shell. Start as documented layout patterns before
    promoting a canonical component.

- **Banner / Notification**
  - There are notification and customBanner references. We already have Alert
    and Toast, so only promote Banner if it has persistent page-level behavior
    distinct from Alert.

- **DatePicker / TimePicker**
  - Weak evidence in these selected nodes. Useful for dashboard/CMS, but not a
    blocker for sealing Core.

- **Stepper / Wizard**
  - The taxonomy workflow includes multi-step language and metadata flows.
    Promote only if multiple products share the same stepper behavior.

## Keep Product Or SDK Specific

These should not become Core component sets yet. They should be built in SDK,
dashboard, CMS, or maps packages by composing Core primitives.

- POI cards and POI list items
- Wayfinding cards, route summaries, journey cards, and direction cards
- Floor selector, level selector, building selector, and facility selector
- Map controls, map overlays, map attribution, map logos, pins, markers, blue
  dot, geofences, symbols, path nodes, and transition states
- Quick access map shortcuts
- White-label and partner logo placement rules
- Dashboard taxonomy type selectors, taxonomy rows, publish modules, and map
  content side drawers
- Analytics charts, metric cards, and dashboard-specific data visualizations

## Recommended Next Build Order

1. Create/link canonical Figma component sets for the newly added React form
   wave: Combobox, MultiSelect, Listbox, DatePicker, DateRangePicker,
   TimePicker, and FileUpload / DropZone.
2. Decide whether FormField / FieldWrapper becomes a visible Figma component
   set or remains a code-only anatomy primitive documented through the input
   families.
3. Then move to lower-priority Core candidates: SearchBar, PasswordInput,
   CheckboxGroup, RadioGroup, RangeSlider, OTPInput, ScrollArea, Tree,
   Stepper, Timeline, and Rating.

After those, switch to SDK/dashboard-specific libraries and compose POI,
wayfinding, direction, analytics, CMS, and map-shell components from Core.

## Platform / Form-Factor Follow-Up

Track these in a separate lane, not as Core backlog inflation:

- Dynamic Island / Live Activity states: compact, minimal, expanded, Lock
  Screen, StandBy, Smart Stack, and fallback web/fullscreen presentations.
- Watch and wearable surfaces: tiles, complications, route glances,
  notifications, confirmations, and tiny list/detail flows.
- AR / VR / XR surfaces: spatial panels, anchored prompts, placement guides,
  passthrough overlays, gaze/focus rings, and immersive route guidance.
- Kiosk mode: idle screen, language selector, large action controls, route
  launcher, QR handoff, session timeout, offline state, and accessibility
  controls.
- Landscape and large-screen modes: split panes, map with side panel,
  list-detail, supporting pane, command panel, and bottom-sheet-to-side-panel
  adaptations.

Next evidence needed: Pointr Cloud, mobile SDK, web SDK, kiosk, and spatial or
AR screenshots/project links. Use those references to decide whether each item
is a platform component, product composition, or a missing Core primitive.
