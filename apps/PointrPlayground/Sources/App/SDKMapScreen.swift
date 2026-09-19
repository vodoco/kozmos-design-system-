import SwiftUI
import PointrKit
import Kozmos

struct SDKMapScreen: View {
    @StateObject private var session = SDKSession()
    @State private var detent: KozmosMapPanelDetent = .medium
    /// The shell docks its panel as a sheet on compact widths and floats it
    /// beside the map on regular ones; the card has to match.
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    private var matches: [PTRPoi] {
        let query = session.query.trimmingCharacters(in: .whitespacesAndNewlines)
        return session.pois.filter {
            (query.isEmpty ? SDKPOIAdapter.floorId($0.position.level) == session.selectedFloorId : $0.name.localizedCaseInsensitiveContains(query))
        }.sorted { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
    }

    var body: some View {
        Group {
            if let widget = session.widget {
                KozmosAdaptiveMapShell(
                    mapLabel: "Design-QA indoor map", mapStatus: session.failure != nil ? .error : (session.status == "Ready" ? .ready : .loading),
                    panelLabel: session.selected?.name ?? "QA places", panelPlacement: .end,
                    controlsPlacement: .bottom, panelDetent: $detent,
                    panelDetents: [.collapsed, .medium, .large],
                    onCollisionInsetsChange: session.setChromeInsets,
                    map: { SDKMapHost(widget: widget) },
                    mapStatusContent: {
                        VStack {
                            Text(session.failure ?? session.status)
                            if session.failure != nil { KozmosButton("Retry", action: session.retry) }
                        }.padding(16)
                    },
                    controls: {
                        // The shell proposes this slot only the height left
                        // between the top bar and the sheet. At a tall detent
                        // the whole cluster no longer fits, and drawn anyway it
                        // overflowed upward over the search bar. Zoom yields to
                        // pinch first; the levels stay while they fit.
                        ViewThatFits(in: .vertical) {
                            controls(widget, zoom: true)
                            controls(widget, zoom: false)
                            // Not `EmptyView`: it adds no child at all, and
                            // with nothing fitting `ViewThatFits` falls back to
                            // its last real child — the levels, over the search.
                            Color.clear.frame(width: 0, height: 0)
                        }
                    },
                    topBar: { KozmosSearchBar(text: $session.query, placeholder: "Search this building") },
                    panel: { panel }
                )
            } else {
                VStack(spacing: 16) {
                    Text("Kozmos × Pointr QA").font(KozmosTypography.title2)
                    if session.failure == nil { ProgressView() }
                    Text(session.failure ?? session.status).multilineTextAlignment(.center)
                    if session.failure != nil { KozmosButton("Retry", action: session.retry) }
                }.padding(24)
            }
        }
        .task { session.start() }
        .onDisappear { session.stop() }
    }

    /// `.bottom` gives the slot the full width of the map and leaves the corner
    /// to the caller. Anchored to the trailing edge, where a thumb reaches,
    /// rather than centred over the places the map is showing. Levels sit
    /// outermost, as in the fixture playground.
    private func controls(_ widget: PTRMapWidgetViewController, zoom: Bool) -> some View {
        HStack(alignment: .bottom, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
            Spacer(minLength: 0)
            if zoom {
                KozmosMapControlsGroup(onZoomIn: { session.zoom(1) }, onZoomOut: { session.zoom(-1) },
                                       onCompassReset: { widget.mapViewController.resetNorth() })
            }
            KozmosFloorSelector(
                floors: (session.building?.levels ?? []).sorted { $0.index < $1.index }.map {
                    .init(id: SDKPOIAdapter.floorId($0), label: $0.name, shortLabel: $0.shortName)
                },
                selectedFloor: .init(get: { session.selectedFloorId }, set: session.selectFloor),
                variant: .collapsible)
        }
    }

    @ViewBuilder private var panel: some View {
        if let poi = session.selected {
            KozmosPOIDetailPanel(
                poi: SDKPOIAdapter.presentation(poi),
                actionLabels: [.favourite: "Favourite", .bookmark: "Save"],
                onAction: { action, id in
                    switch action {
                    case .favourite:
                        if !session.favourites.insert(id).inserted { session.favourites.remove(id) }
                    case .bookmark:
                        if !session.saved.insert(id).inserted { session.saved.remove(id) }
                    default: break
                    }
                },
                actionStates: [
                    .favourite: .init(pressed: session.favourites.contains(poi.identifier)),
                    .bookmark: .init(pressed: session.saved.contains(poi.identifier))
                ],
                onClose: session.closeSelection,
                // The shell draws the container — background, corners, shadow
                // and grab handle. The card's own bordered card inside it was
                // a second container.
                presentation: horizontalSizeClass == .regular ? .panel : .sheet,
                details: session.selectedDetails?.presentation ?? .init(),
                supplementaryActionStates: session.actionStates,
                onSupplementaryAction: session.perform(action:poiId:))
        } else {
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    Text(session.building?.name ?? "Design-QA").font(KozmosTypography.title2)
                    Text("Live SDK data · browse-only milestone").font(KozmosTypography.footnote)
                    Text(session.poiDataReady ? "\(session.pois.count) POIs loaded in this building" : "Loading site POI data…")
                        .font(KozmosTypography.caption)
                    if let failure = session.failure { Text(failure).accessibilityAddTraits(.isStaticText) }
                    else if session.status != "Ready" { Text(session.status).font(KozmosTypography.footnote) }
                    Text("Saved and favourite states are local to this session. Routing is not connected yet.")
                        .font(KozmosTypography.caption)
                        .foregroundStyle(.secondary)
                    KozmosPOIResultList(
                        items: matches.enumerated().map { index, poi in
                            .init(poi: SDKPOIAdapter.presentation(poi),
                                  result: .init(poiId: poi.identifier, resultIndex: index, floorId: SDKPOIAdapter.floorId(poi.position.level)))
                        },
                        resultCountLabel: "\(matches.count) places",
                        onSelect: { id in if let poi = session.pois.first(where: { $0.identifier == id }) { session.select(poi) } },
                        emptyState: { Text("No places available for this floor or search.") })
                }.padding(16)
            }
        }
    }
}

/// Embed the supported map-only widget. Never traverse private UIKit subviews.
struct SDKMapHost: UIViewControllerRepresentable {
    let widget: PTRMapWidgetViewController
    func makeUIViewController(context: Context) -> PTRMapWidgetViewController { widget }
    func updateUIViewController(_ controller: PTRMapWidgetViewController, context: Context) {}
}
