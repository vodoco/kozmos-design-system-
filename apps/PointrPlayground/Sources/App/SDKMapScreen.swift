import SwiftUI
import UIKit
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
                    panelLabel: panelLabel, panelPlacement: .end,
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

    private var panelLabel: String {
        switch session.phase {
        case .browse: return session.selected?.name ?? "QA places"
        case .routeSetup: return "Starting point"
        case .directions: return "Directions"
        }
    }

    @ViewBuilder private var panel: some View {
        switch session.phase {
        case .browse: browsePanel
        case .routeSetup: routeSetupPanel
        case .directions: directionsPanel
        }
    }

    @ViewBuilder private var browsePanel: some View {
        if let poi = session.selected {
            KozmosPOIDetailPanel(
                poi: SDKPOIAdapter.presentation(poi),
                actionLabels: [.navigate: "Go", .favourite: "Favourite", .bookmark: "Save"],
                onAction: { action, id in
                    switch action {
                    case .navigate:
                        session.startRouteSetup()
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
                    Text("Saved and favourite states are local to this session. A route starts from a place you choose: there is no live positioning in this milestone.")
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

/// The two routing surfaces, composed from Kozmos parts as the fixture
/// playground composes them. The host adds only the starting-point picker,
/// which the playground does not need: it has an entrance to start from.
/// There is no preview step: the directions open as soon as a route exists.
extension SDKMapScreen {
    private var originItems: [KozmosPOIResultListItem] {
        session.originCandidates.enumerated().map { index, poi in
            .init(poi: SDKPOIAdapter.presentation(poi),
                  result: .init(poiId: poi.identifier, resultIndex: index, floorId: SDKPOIAdapter.floorId(poi.position.level)))
        }
    }

    var routeSetupPanel: some View {
        VStack(spacing: 0) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                KozmosIconButton(iconName: "chevron.left", variant: .ghost, action: session.cancelRouteSetup)
                    .accessibilityLabel("Back to place details")
                VStack(alignment: .leading, spacing: 2) {
                    Text("Directions").font(KozmosTypography.headline).accessibilityAddTraits(.isHeader)
                    Text("to \(session.selected?.name ?? "")").font(KozmosTypography.subheadline)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(KozmosDimensions.primitivesLayoutSpacing200)
            KozmosSearchBar(text: $session.originQuery, placeholder: "Choose a starting point")
                .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200)
            routeStatusRow
                .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200)
                .padding(.top, KozmosDimensions.primitivesLayoutSpacing150)
            ScrollView {
                KozmosPOIResultList(
                    items: originItems,
                    resultCountLabel: "\(session.originCandidates.count) places",
                    label: "Starting points",
                    onSelect: session.chooseOrigin,
                    emptyState: { Text("No places match.") })
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
            }
            .scrollDismissesKeyboard(.interactively)
        }
    }

    /// What the calculation is doing, in the picker: the directions open by
    /// themselves once a route exists, so only waiting and failure show here.
    @ViewBuilder private var routeStatusRow: some View {
        switch session.routeStatus {
        case .calculating:
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                KozmosSpinner()
                Text("Working out the way from \(session.origin?.name ?? "there")…").font(KozmosTypography.subheadline)
                    .foregroundColor(KozmosColors.primitivesColorsForeground500)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        case .error, .noRoute:
            VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                Text(session.routeMessage ?? "").font(KozmosTypography.subheadline)
                    .fixedSize(horizontal: false, vertical: true)
                if SDKRoutePresenter.recovery(for: session.routeStatus) == .tryAgain {
                    KozmosButton("Try again", action: session.retryRouteCalculation)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        case .idle, .ready:
            EmptyView()
        }
    }

    var directionsPanel: some View {
        let route = session.route
        let steps = route?.steps ?? []
        let remaining = route?.remaining(from: session.stepIndex) ?? (distanceMetres: 0, durationSeconds: 0)
        return VStack(spacing: 0) {
            KozmosRouteSummary(
                etaText: "Arrive \(RouteFormat.arrival(in: remaining.durationSeconds))",
                distanceText: "\(RouteFormat.distance(remaining.distanceMetres)) · \(RouteFormat.duration(remaining.durationSeconds)) left",
                state: .active,
                onEndRoute: session.endRoute
            ) {
                KozmosIcon("navigation-pointer-01", size: .md, color: .primary)
            }
            .padding(KozmosDimensions.primitivesLayoutSpacing200)
            HStack {
                Text("Step \(session.stepIndex + 1) of \(steps.count) · to \(session.selected?.name ?? "")")
                    .font(KozmosTypography.subheadline).foregroundColor(KozmosColors.primitivesColorsForeground500)
                Spacer()
            }
            .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200)
            .padding(.bottom, KozmosDimensions.primitivesLayoutSpacing100)
            KozmosSeparator()
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                        ForEach(steps) { step in
                            KozmosDirectionStep(
                                type: SDKRoutePresenter.directionType(forMessageType: step.messageType),
                                instruction: step.message,
                                distance: SDKRoutePresenter.distanceLabel(for: step),
                                duration: session.stepFloorLabel(step.id))
                            .opacity(step.id == session.stepIndex ? 1 : 0.45)
                            // The dimming is visual; VoiceOver hears the trait.
                            .accessibilityAddTraits(step.id == session.stepIndex ? .isSelected : [])
                            .id(step.id)
                        }
                    }
                    .padding(KozmosDimensions.primitivesLayoutSpacing200)
                }
                .onChange(of: session.stepIndex) { index in
                    withAnimation { proxy.scrollTo(index, anchor: .center) }
                    // Next and Previous keep VoiceOver's focus on the button;
                    // the step that changed under it is announced.
                    if steps.indices.contains(index) {
                        let step = steps[index]
                        let parts = ["Step \(index + 1) of \(steps.count).", step.message,
                                     SDKRoutePresenter.distanceLabel(for: step), session.stepFloorLabel(step.id)]
                        UIAccessibility.post(notification: .announcement, argument: parts.compactMap { $0 }.joined(separator: ", "))
                    }
                }
            }
            KozmosSeparator()
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                KozmosIconButton(iconName: "chevron.left", variant: .outline, isDisabled: session.stepIndex == 0,
                                 action: session.rewindStep)
                    .accessibilityLabel("Previous step")
                if session.stepIndex >= steps.count - 1 {
                    KozmosButton("Finish", action: session.endRoute).frame(maxWidth: .infinity)
                } else {
                    KozmosButton("Next step", action: session.advanceStep).frame(maxWidth: .infinity)
                }
            }
            .padding(KozmosDimensions.primitivesLayoutSpacing200)
        }
    }
}

/// Embed the supported map-only widget. Never traverse private UIKit subviews.
struct SDKMapHost: UIViewControllerRepresentable {
    let widget: PTRMapWidgetViewController
    func makeUIViewController(context: Context) -> PTRMapWidgetViewController { widget }
    func updateUIViewController(_ controller: PTRMapWidgetViewController, context: Context) {}
}
