# Platform / Form-Factor Roadmap

Generated: 2026-05-28

This roadmap tracks surfaces that are adjacent to Core but should not be
treated as domain-neutral Core components yet. These patterns are shaped by
device ergonomics, platform APIs, presentation states, and product context.

## Scope Rule

Core owns reusable primitives: Button, IconButton, Card, Dialog, Drawer, Sheet,
Popover, List, Grid, Tabs, Progress, EmptyState, FieldWrapper, inputs, and
tokens.

Platform / Form-Factor owns device-specific shells, states, and adaptations:
Dynamic Island, watch, kiosk, landscape, spatial, AR, VR, and XR.

Product / SDK owns map, wayfinding, POI, routing, dashboard, CMS, and analytics
compositions.

Promote something back to Core only when it remains useful without a specific
device, product, map, or operating-system presentation model.

## Sources

- Apple Human Interface Guidelines, Live Activities:
  https://developer.apple.com/design/human-interface-guidelines/live-activities
- Apple Human Interface Guidelines, spatial layout:
  https://developer.apple.com/design/human-interface-guidelines/spatial-layout
- Android XR UI design guidance:
  https://developer.android.com/design/ui/xr
- Android large-screen canonical layouts:
  https://developer.android.com/develop/ui/views/layout/canonical-layouts
- Android dedicated devices / lock task mode:
  https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode

## Candidate Families

| Family                         | Candidate components                                                                                                                                                             | First evidence needed                                                                      | Core dependencies                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Dynamic Island / Live Activity | DynamicIsland, LiveActivityCompact, LiveActivityMinimal, LiveActivityExpanded, LiveActivityLockScreen, LiveActivityStandBy                                                       | iOS SDK route, arrival, loading, reroute, and handoff states                               | Icon, Text, Badge, Progress, Button, Card                         |
| Watch / Wearable               | WatchTile, WatchComplication, WatchNotification, WatchAction, WatchRouteGlance, WatchList                                                                                        | watch or wearable SDK flows, route glance, ETA, arrival, alert states                      | Icon, Text, Button, Progress, List                                |
| Spatial / AR / VR / XR         | SpatialPanel, SpatialToolbar, SpatialTooltip, AnchorPrompt, PlacementGuide, GazeFocusRing, PassthroughScrim, ImmersiveOverlay                                                    | AR navigation, POI placement, route preview, permission, calibration, lost-tracking states | Card, Button, IconButton, Progress, EmptyState, Tooltip           |
| Kiosk                          | KioskShell, KioskIdleScreen, KioskLanguageSelector, KioskLargeAction, KioskRouteLauncher, KioskQRCodeHandoff, KioskSessionTimeout, KioskOfflineState, KioskAccessibilityControls | kiosk home, search, route start, QR handoff, timeout, offline, accessibility states        | Button, SearchBar, Card, Dialog, Grid, EmptyState, Progress       |
| Landscape / Large Screen       | LargeScreenShell, ListDetailLayout, SupportingPane, SplitPane, MapWithSidePanel, MapWithBottomSheet, CommandPanel, LandscapeToolbar                                              | tablet, dashboard, web SDK, landscape mobile, and map side-panel states                    | Grid, Container, Stack, Sidebar, Drawer, BottomSheet, List, Table |

## Design Quality Bar

- Use Core primitives inside form-factor components wherever possible.
- Keep component names tied to user-facing purpose, not implementation detail.
- Model states explicitly: idle, loading, success, warning, error, unavailable,
  empty, offline, and permission-blocked.
- Treat responsive behavior as a first-class variant or documented layout rule.
- Test touch, remote, keyboard, focus, voiceover/screen reader, and reduced
  motion expectations where the platform supports them.
- Do not clone map/product content into this lane; consume Product / SDK
  compositions when the content is domain-specific.

## Recommended Build Order

1. DynamicIsland / LiveActivity: complete stories, tests, Code Connect
   position, and platform-specific state matrix.
2. KioskShell and KioskIdleScreen: these are likely high-value for Pointr
   deployment and should expose accessibility controls from the start.
3. Landscape / LargeScreenShell: define adaptive map/list/detail rules before
   adding more dashboard-specific layout components.
4. Watch / Wearable: build after route-glance and notification screenshots are
   available.
5. Spatial / AR / VR / XR: research and prototype from real product flows
   before committing to public component APIs.

## Open Questions For Evidence Review

- Which Pointr Cloud Dashboard surfaces need a large-screen shell rather than
  normal responsive Core layouts?
- Which mobile SDK screens have watch, Dynamic Island, or Live Activity states?
- Which web SDK screens need kiosk or landscape-specific interaction models?
- Are AR / VR / XR surfaces production commitments, experiments, or future
  design explorations?
- Which product states must work offline or in a managed-device kiosk session?
