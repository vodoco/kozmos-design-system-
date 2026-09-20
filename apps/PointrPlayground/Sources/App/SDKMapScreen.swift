import SwiftUI
import UIKit
import PointrKit
import Kozmos

struct SDKMapScreen: View {
    @StateObject private var session = SDKSession()
    /// The sheet rests collapsed on the search row and the first tile row, as
    /// the prototype's does; the field's focus opens it to large.
    @State private var detent: KozmosMapPanelDetent = .collapsed
    /// Where the search sheet was when a place opened, restored when the
    /// place's card closes or its route ends.
    @State private var searchDetent: KozmosMapPanelDetent = .collapsed
    @FocusState private var searchFocused: Bool
    /// Whether the manoeuvre card over the map is open into the itinerary.
    @State private var itineraryExpanded = false
    /// The shell docks its panel as a sheet on compact widths and floats it
    /// beside the map on regular ones; the card has to match.
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    /// The places a query names, on every floor.
    private var matches: [PTRPoi] {
        let query = trimmedQuery
        guard !query.isEmpty else { return [] }
        return session.pois.filter { $0.name.localizedCaseInsensitiveContains(query) }
            .sorted { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
    }

    var body: some View {
        Group {
            if let widget = session.widget {
                KozmosAdaptiveMapShell(
                    mapLabel: "Design-QA indoor map", mapStatus: session.failure != nil ? .error : (session.status == "Ready" ? .ready : .loading),
                    panelLabel: panelLabel, panelPlacement: .end,
                    controlsPlacement: .bottom, panelDetent: $detent,
                    // Navigating, the sheet also fits its summary; browsing, the
                    // prototype's three stops.
                    panelDetents: session.phase == .directions ? [.collapsed, .content, .medium, .large] : [.collapsed, .medium, .large],
                    // The prototype's sheet is glass; the system's default is solid.
                    panelSurface: .glass,
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
                    // The shell's top slot spans the map's width; the row and the
                    // card keep a margin from the edges, as the fixture playground does.
                    topBar: { topBar.padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200) },
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
        .onChange(of: session.phase) { phase in
            itineraryExpanded = false
            // Navigating, the sheet holds a summary and a row of buttons: it
            // rests fitted to them, and the map has the rest. Choosing a
            // starting point needs the picker's list: half height. Back from
            // a route, the search sheet returns where it was.
            switch phase {
            case .directions: detent = .content
            case .routeSetup: detent = .medium
            case .browse: detent = searchDetent
            }
        }
        // A place opens at half height and remembers where the search sheet
        // was; its card closing returns there, query and results intact.
        .onChange(of: session.selected?.identifier) { id in
            guard session.phase == .browse else { return }
            if id != nil {
                searchDetent = detent
                searchFocused = false
                detent = .medium
            } else {
                detent = searchDetent
            }
        }
        // Tapping the field opens the sheet to large, where the results have
        // the height; a drag that lands anywhere else drops the focus.
        .onChange(of: searchFocused) { focused in if focused { detent = .large } }
        .onChange(of: detent) { detent in if detent != .large { searchFocused = false } }
    }

    /// Browsing and choosing a starting point, the search bar; navigating, the
    /// current manoeuvre over the map, opening into the whole itinerary — the
    /// prototype's instruction card.
    @ViewBuilder private var topBar: some View {
        if session.phase == .directions, let step = currentStep {
            KozmosManoeuvreCard(
                type: SDKRoutePresenter.directionType(forMessageType: step.messageType, transitionSubType: step.transitionSubType),
                instruction: step.message,
                detail: [SDKRoutePresenter.distanceLabel(for: step), session.stepFloorLabel(step.id)]
                    .compactMap { $0 }.joined(separator: " · "),
                isExpanded: itineraryExpanded,
                onToggle: { withAnimation { itineraryExpanded.toggle() } },
                // The prototype's card and sheet are glass; the system's default is solid.
                surface: .glass
            ) {
                KozmosItinerary(
                    origin: session.origin?.name ?? "",
                    steps: (session.route?.steps ?? []).map { step in
                        KozmosItineraryStep(
                            id: String(step.id), instruction: step.message,
                            type: SDKRoutePresenter.directionType(forMessageType: step.messageType, transitionSubType: step.transitionSubType),
                            isCurrent: step.id == session.stepIndex)
                    },
                    destination: session.selected?.name ?? "")
            }
        }
        // Browsing, the top slot is empty: the search row is the sheet's
        // first row, as the prototype's is.
    }

    private var currentStep: SDKRoute.Step? {
        guard let steps = session.route?.steps, steps.indices.contains(session.stepIndex) else { return nil }
        return steps[session.stepIndex]
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
            searchSheet
        }
    }

    // MARK: - The search sheet

    /// The prototype's initial sheet: the search row pinned first, then what
    /// the row's state calls for — the quick-access tiles at rest, the recent
    /// places when the empty field is focused, the results for a query or a
    /// tile. Every part is a Kozmos component; the shell draws the surface.
    @ViewBuilder private var searchSheet: some View {
        VStack(spacing: 0) {
            // The row 8 under the handle's row, as the prototype's field sits
            // 23 from the sheet's top; what follows brings its own top margin.
            searchRow
                .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200)
                .padding(.top, KozmosDimensions.primitivesLayoutSpacing100)
            if let category = session.category {
                resultsList(session.places(in: category), countLabel: "\(session.places(in: category).count) places in \(category.name)")
            } else if !trimmedQuery.isEmpty {
                resultsList(matches, countLabel: "\(matches.count) places")
            } else if searchFocused, !session.recents.isEmpty {
                recentsList
            } else {
                tiles
            }
        }
        // One container for the sheet, so its identifier and value are its
        // own and not every child's. The value is for the flow test, which
        // picks its building by its place count (handoff item G).
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("search-sheet")
        .accessibilityValue(session.poiDataReady ? "\(session.pois.count) POIs loaded" : "loading")
    }

    private var trimmedQuery: String { session.query.trimmingCharacters(in: .whitespacesAndNewlines) }

    /// The row's four forms, as the prototype's: the field with the AI search;
    /// focused and empty, a Cancel beside it; with a query, Filters between
    /// them; a tile chosen, its chip and count in the field's place. Filters
    /// and the AI search have no flow in this milestone; they are here to be
    /// seen where the prototype puts them.
    @ViewBuilder private var searchRow: some View {
        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            if let category = session.category {
                KozmosChip(text: category.name, variant: .brand, onRemove: session.clearCategory) {
                    tileIcon(category, size: 16)
                }
                .accessibilityIdentifier("category-chip")
                KozmosCounter("\(session.places(in: category).count)")
                Spacer(minLength: 0)
            } else {
                KozmosSearchBar(text: $session.query, placeholder: "Search", focused: $searchFocused, onClear: { searchFocused = false })
                    .accessibilityIdentifier("search-field")
                if searchFocused, trimmedQuery.isEmpty {
                    KozmosButton("Cancel", variant: .ghost, action: cancelSearch)
                        .accessibilityIdentifier("search-cancel")
                }
            }
            if session.category != nil || !trimmedQuery.isEmpty {
                KozmosIconButton(iconName: "slider.horizontal.3", variant: .outline, action: {})
                    .accessibilityLabel("Filters")
            }
            KozmosAISearchButton(action: {})
        }
    }

    private func cancelSearch() {
        searchFocused = false
        session.query = ""
    }

    /// The taxonomy's eighteen tiles (the two personal ones first), on the
    /// system's grid, in the sheet: no surface or rule of its own.
    private var tiles: some View {
        KozmosBrowseCategoriesPanel(
            categories: QuickAccess.tiles.map { KozmosCategoryPresentation(id: $0.id, label: $0.name) },
            label: "Quick access",
            presentation: .sheet,
            onSelect: { id in
                guard let category = QuickAccess.category(id: id) else { return }
                searchFocused = false
                session.choose(category: category)
            },
            renderIcon: { presentation in
                if let category = QuickAccess.category(id: presentation.id) { tileIcon(category, size: 24) }
            },
            emptyState: { Text("No quick access for this venue.") }
        )
    }

    /// The taxonomy's published icon, drawn in the theme's colour as the
    /// prototype draws its tiles; the personal tiles use a symbol.
    @ViewBuilder private func tileIcon(_ category: QuickAccessCategory, size: CGFloat) -> some View {
        switch category.icon {
        case .symbol(let name):
            Image(systemName: name).font(.system(size: size * 0.85, weight: .medium))
        case .bundled(let name):
            if let image = UIImage(named: name) {
                Image(uiImage: image).renderingMode(.template).resizable().scaledToFit().frame(width: size, height: size)
            } else {
                Image(systemName: "square.dashed").font(.system(size: size * 0.85))
            }
        }
    }

    private func resultsList(_ places: [PTRPoi], countLabel: String) -> some View {
        KozmosPanelScrollView {
            KozmosPOIResultList(
                items: places.enumerated().map { index, poi in
                    .init(poi: SDKPOIAdapter.presentation(poi),
                          result: .init(poiId: poi.identifier, resultIndex: index, floorId: SDKPOIAdapter.floorId(poi.position.level)))
                },
                resultCountLabel: countLabel,
                // A dot before the floor of a result on the floor the map shows.
                currentFloorId: session.selectedFloorId,
                onSelect: { id in if let poi = session.pois.first(where: { $0.identifier == id }) { session.select(poi) } },
                emptyState: { Text("No places match.") })
            .padding(KozmosDimensions.primitivesLayoutSpacing200)
        }
        .scrollDismissesKeyboard(.interactively)
    }

    /// The places opened this session, under the prototype's header and count.
    private var recentsList: some View {
        KozmosPanelScrollView {
            VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                    Text("Recently visited").font(KozmosTypography.footnote).fontWeight(.semibold)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                        .accessibilityAddTraits(.isHeader)
                    KozmosCounter("\(session.recents.count)")
                }
                KozmosPOIResultList(
                    items: session.recents.enumerated().map { index, poi in
                        .init(poi: SDKPOIAdapter.presentation(poi),
                              result: .init(poiId: poi.identifier, resultIndex: index, floorId: SDKPOIAdapter.floorId(poi.position.level)))
                    },
                    resultCountLabel: "\(session.recents.count) recent places",
                    label: "Recently visited",
                    currentFloorId: session.selectedFloorId,
                    onSelect: { id in if let poi = session.pois.first(where: { $0.identifier == id }) { session.select(poi) } },
                    emptyState: { EmptyView() })
            }
            .padding(KozmosDimensions.primitivesLayoutSpacing200)
        }
        .scrollDismissesKeyboard(.interactively)
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
            // The shell's scroll view: the list scrolls at the largest detent,
            // and an upward drag grows the sheet first.
            KozmosPanelScrollView {
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

    /// The prototype's navigation sheet: the destination with End beside it,
    /// what is left and when it ends, the rail; then the step buttons. The
    /// steps themselves are in the card over the map.
    var directionsPanel: some View {
        let route = session.route
        let steps = route?.steps ?? []
        let remaining = route?.remaining(from: session.stepIndex) ?? (distanceMetres: 0, durationSeconds: 0)
        let total = route?.distanceMetres ?? 0
        return VStack(spacing: 0) {
            KozmosRouteSummary(
                destination: session.selected?.name ?? "Directions",
                durationText: RouteFormat.duration(remaining.durationSeconds),
                distanceText: RouteFormat.distance(remaining.distanceMetres),
                arrivalText: "Arrive \(RouteFormat.arrival(in: remaining.durationSeconds))",
                surface: .glass,
                onEndRoute: session.endRoute
            ) {
                KozmosRouteProgressRail(
                    // By ground covered, so a lift or a level change — no
                    // distance — does not move the disc; by step when the
                    // route covers no ground at all.
                    progress: total > 0 ? (total - remaining.distanceMetres) / total
                        : (steps.count > 1 ? Double(session.stepIndex) / Double(steps.count - 1) : 1),
                    type: currentStep.map { SDKRoutePresenter.directionType(forMessageType: $0.messageType, transitionSubType: $0.transitionSubType) } ?? .destination,
                    label: "Step \(session.stepIndex + 1) of \(steps.count)")
            }
            .padding(KozmosDimensions.primitivesLayoutSpacing200)
            .onChange(of: session.stepIndex) { index in
                // Next and Previous keep VoiceOver's focus on the button; the
                // step that changed under it is announced.
                if steps.indices.contains(index) {
                    let step = steps[index]
                    let parts = ["Step \(index + 1) of \(steps.count).", step.message,
                                 SDKRoutePresenter.distanceLabel(for: step), session.stepFloorLabel(step.id)]
                    UIAccessibility.post(notification: .announcement, argument: parts.compactMap { $0 }.joined(separator: ", "))
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
