import SwiftUI

/// Adaptive container that layers a map, its controls, and a detail panel.
///
/// Mirrors the React `AdaptiveMapShell`. The shell owns layout, safe areas, and
/// z-ordering only. `collisionInsets` are surfaced back to the caller through
/// `onCollisionInsetsChange` so the map renderer can pad its camera — layout
/// alone cannot move SDK labels, routes, attribution, or marker collision boxes.
public struct KozmosAdaptiveMapShell<Map: View, Controls: View, TopBar: View, Panel: View, MapStatusContent: View>: View {
    public enum PanelPlacement {
        case start
        case end
    }

    private let map: Map
    private let mapLabel: String
    private let mapStatus: KozmosMapReadiness
    private let mapStatusContent: MapStatusContent
    private let controls: Controls
    private let topBar: TopBar
    private let panel: Panel
    private let panelLabel: String
    private let panelPlacement: PanelPlacement
    private let collisionInsets: KozmosMapCollisionInsets
    private let onCollisionInsetsChange: ((KozmosMapCollisionInsets) -> Void)?

    private let hasControls: Bool
    private let hasTopBar: Bool
    private let hasPanel: Bool
    private let hasMapStatusContent: Bool

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    public init(
        mapLabel: String = "Map",
        mapStatus: KozmosMapReadiness = .ready,
        panelLabel: String = "Map details",
        panelPlacement: PanelPlacement = .end,
        collisionInsets: KozmosMapCollisionInsets = .zero,
        onCollisionInsetsChange: ((KozmosMapCollisionInsets) -> Void)? = nil,
        @ViewBuilder map: () -> Map,
        @ViewBuilder mapStatusContent: () -> MapStatusContent,
        @ViewBuilder controls: () -> Controls,
        @ViewBuilder topBar: () -> TopBar,
        @ViewBuilder panel: () -> Panel
    ) {
        self.mapLabel = mapLabel
        self.mapStatus = mapStatus
        self.panelLabel = panelLabel
        self.panelPlacement = panelPlacement
        self.collisionInsets = collisionInsets
        self.onCollisionInsetsChange = onCollisionInsetsChange
        self.map = map()
        self.mapStatusContent = mapStatusContent()
        self.controls = controls()
        self.topBar = topBar()
        self.panel = panel()
        self.hasControls = Controls.self != EmptyView.self
        self.hasTopBar = TopBar.self != EmptyView.self
        self.hasPanel = Panel.self != EmptyView.self
        self.hasMapStatusContent = MapStatusContent.self != EmptyView.self
    }

    /// Wide layouts float the panel beside the map; compact layouts dock it to
    /// the bottom edge, matching the web breakpoint behaviour.
    private var isRegularWidth: Bool {
        #if os(iOS)
        return horizontalSizeClass == .regular
        #else
        return true
        #endif
    }

    public var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .topLeading) {
                map
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .accessibilityElement(children: .contain)
                    .accessibilityLabel(mapLabel)

                if mapStatus != .ready, hasMapStatusContent {
                    mapStatusContent
                        .frame(width: geometry.size.width, height: geometry.size.height)
                        .background(KozmosColors.primitivesColorsBackground0.opacity(0.8))
                        .accessibilityAddTraits(.updatesFrequently)
                        .zIndex(2)
                }

                if hasTopBar {
                    topBar
                        .frame(maxWidth: 672)
                        .frame(width: geometry.size.width, alignment: .center)
                        .padding(.top, KozmosDimensions.primitivesLayoutSpacing200)
                        .zIndex(3)
                }

                if hasControls {
                    controls
                        .padding(KozmosDimensions.primitivesLayoutSpacing200)
                        .frame(
                            width: geometry.size.width,
                            alignment: panelPlacement == .end ? .topLeading : .topTrailing
                        )
                        .zIndex(3)
                }

                if hasPanel {
                    panelContainer(in: geometry)
                        .zIndex(4)
                }
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
        }
        .frame(minHeight: 448)
        .background(KozmosColors.primitivesColorsBackground100)
        .clipped()
        .onAppear { onCollisionInsetsChange?(collisionInsets) }
        .onChange(of: collisionInsets) { newValue in
            onCollisionInsetsChange?(newValue)
        }
    }

    @ViewBuilder
    private func panelContainer(in geometry: GeometryProxy) -> some View {
        if isRegularWidth {
            panel
                .frame(width: min(416, geometry.size.width * 0.42))
                .frame(maxHeight: .infinity)
                .background(KozmosColors.primitivesColorsBackground0)
                .clipShape(
                    RoundedRectangle(
                        cornerRadius: KozmosDimensions.primitivesLayoutRadius300,
                        style: .continuous
                    )
                )
                .shadow(color: KozmosColors.primitivesColorsForeground900.opacity(0.18), radius: 24, x: 0, y: 12)
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
                .frame(
                    width: geometry.size.width,
                    height: geometry.size.height,
                    alignment: panelPlacement == .end ? .trailing : .leading
                )
                .accessibilityElement(children: .contain)
                .accessibilityLabel(panelLabel)
        } else {
            panel
                .frame(maxWidth: .infinity)
                .frame(maxHeight: geometry.size.height * 0.64)
                .background(KozmosColors.primitivesColorsBackground0)
                .clipShape(
                    KozmosPanelShape(
                        radius: KozmosDimensions.primitivesLayoutRadius300,
                        roundsBottom: false
                    )
                )
                .shadow(color: KozmosColors.primitivesColorsForeground900.opacity(0.18), radius: 24, x: 0, y: -8)
                .frame(
                    width: geometry.size.width,
                    height: geometry.size.height,
                    alignment: .bottom
                )
                .accessibilityElement(children: .contain)
                .accessibilityLabel(panelLabel)
        }
    }
}

public extension KozmosAdaptiveMapShell where TopBar == EmptyView {
    init(
        mapLabel: String = "Map",
        mapStatus: KozmosMapReadiness = .ready,
        panelLabel: String = "Map details",
        panelPlacement: PanelPlacement = .end,
        collisionInsets: KozmosMapCollisionInsets = .zero,
        onCollisionInsetsChange: ((KozmosMapCollisionInsets) -> Void)? = nil,
        @ViewBuilder map: () -> Map,
        @ViewBuilder mapStatusContent: () -> MapStatusContent,
        @ViewBuilder controls: () -> Controls,
        @ViewBuilder panel: () -> Panel
    ) {
        self.init(
            mapLabel: mapLabel,
            mapStatus: mapStatus,
            panelLabel: panelLabel,
            panelPlacement: panelPlacement,
            collisionInsets: collisionInsets,
            onCollisionInsetsChange: onCollisionInsetsChange,
            map: map,
            mapStatusContent: mapStatusContent,
            controls: controls,
            topBar: { EmptyView() },
            panel: panel
        )
    }
}

public extension KozmosAdaptiveMapShell
where TopBar == EmptyView, MapStatusContent == EmptyView, Controls == EmptyView {
    init(
        mapLabel: String = "Map",
        panelLabel: String = "Map details",
        panelPlacement: PanelPlacement = .end,
        collisionInsets: KozmosMapCollisionInsets = .zero,
        onCollisionInsetsChange: ((KozmosMapCollisionInsets) -> Void)? = nil,
        @ViewBuilder map: () -> Map,
        @ViewBuilder panel: () -> Panel
    ) {
        self.init(
            mapLabel: mapLabel,
            mapStatus: .ready,
            panelLabel: panelLabel,
            panelPlacement: panelPlacement,
            collisionInsets: collisionInsets,
            onCollisionInsetsChange: onCollisionInsetsChange,
            map: map,
            mapStatusContent: { EmptyView() },
            controls: { EmptyView() },
            topBar: { EmptyView() },
            panel: panel
        )
    }
}
