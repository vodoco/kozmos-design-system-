import SwiftUI

/// How much of the shell a docked panel takes up.
///
/// The shell's panel is not a modal sheet — the map keeps receiving touches at
/// every detent — so it carries its own detent type rather than reusing
/// SwiftUI's `PresentationDetent`, which only applies to presented sheets.
public enum KozmosMapPanelDetent: Hashable, Sendable {
    /// A peek: the panel's own header row and nothing more.
    case collapsed
    /// The resting height, where the map and the panel share the shell.
    case medium
    /// Nearly the whole shell, for reading a long panel.
    case large
    /// A share of the shell's height.
    case fraction(Double)
    /// An exact height in points.
    case height(CGFloat)

    /// Outside this range there is either no map or no panel worth showing.
    static let usableFractions: ClosedRange<Double> = 0.12...0.94

    /// A collapsed panel still has to fit the grab handle and a header row.
    static let minimumCollapsedHeight: CGFloat = 112

    func height(in shellHeight: CGFloat) -> CGFloat {
        let maximum = shellHeight * CGFloat(Self.usableFractions.upperBound)
        switch self {
        case .collapsed:
            // Proportional on a tall phone, but never so short on a landscape
            // or split-screen shell that the handle and header stop fitting.
            return min(max(shellHeight * 0.18, Self.minimumCollapsedHeight), shellHeight * 0.4)
        case .medium:
            return shellHeight * 0.48
        case .large:
            return shellHeight * 0.88
        case .fraction(let value):
            let clamped = min(
                max(value, Self.usableFractions.lowerBound),
                Self.usableFractions.upperBound
            )
            return shellHeight * CGFloat(clamped)
        case .height(let points):
            return min(max(points, 0), maximum)
        }
    }

    var accessibilityDescription: String {
        switch self {
        case .collapsed: return "Collapsed"
        case .medium: return "Half height"
        case .large: return "Expanded"
        case .fraction(let value): return "\(Int((value * 100).rounded())) percent"
        case .height(let points): return "\(Int(points.rounded())) points"
        }
    }
}

/// Movement below this reads as a tap on the panel's grab handle rather than a
/// drag. A generic type cannot hold a static stored property, so it lives here.
private let kozmosMapPanelTapSlop: CGFloat = 6

/// Height of the shell's own top bar, so the floating controls can start below
/// it instead of underneath it.
private struct KozmosMapShellTopBarHeightKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}

/// Width of the controls column, which is part of what the map has to keep
/// clear.
private struct KozmosMapShellControlsWidthKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}

/// Adaptive container that layers a map, its controls, and a detail panel.
///
/// Mirrors the React `AdaptiveMapShell`. The shell owns layout, safe areas, and
/// z-ordering only.
///
/// It reports through `onCollisionInsetsChange` how much of the map its own
/// chrome is covering — the top bar, the controls column, and the panel at its
/// settled detent — merged with any `collisionInsets` the caller adds. The map
/// renderer needs those to pad its camera: layout alone cannot move SDK labels,
/// routes, attribution, or marker collision boxes. The reported insets follow
/// the detent the panel has settled on, not the live drag, so the camera does
/// not chase a moving sheet.
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
    private let panelDetentBinding: Binding<KozmosMapPanelDetent>?
    private let panelDetents: [KozmosMapPanelDetent]
    private let collisionInsets: KozmosMapCollisionInsets
    private let onCollisionInsetsChange: ((KozmosMapCollisionInsets) -> Void)?

    private let hasControls: Bool
    private let hasTopBar: Bool
    private let hasPanel: Bool
    private let hasMapStatusContent: Bool

    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @State private var topBarHeight: CGFloat = 0
    @State private var controlsWidth: CGFloat = 0
    @State private var uncontrolledDetent: KozmosMapPanelDetent?
    @State private var dragTranslation: CGFloat = 0

    private static var grabberRowHeight: CGFloat { KozmosDimensions.primitivesLayoutSpacing400 }

    public init(
        mapLabel: String = "Map",
        mapStatus: KozmosMapReadiness = .ready,
        panelLabel: String = "Map details",
        panelPlacement: PanelPlacement = .end,
        panelDetent: Binding<KozmosMapPanelDetent>? = nil,
        panelDetents: [KozmosMapPanelDetent] = [.collapsed, .medium, .large],
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
        self.panelDetentBinding = panelDetent
        self.panelDetents = panelDetents.isEmpty ? [.medium] : panelDetents
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

    // MARK: - Detents

    /// The detent set in ascending height order, with duplicates removed.
    func orderedDetents(in shellHeight: CGFloat) -> [KozmosMapPanelDetent] {
        var seen = Set<CGFloat>()
        return panelDetents
            .sorted { $0.height(in: shellHeight) < $1.height(in: shellHeight) }
            .filter { seen.insert($0.height(in: shellHeight).rounded()).inserted }
    }

    /// The detent the panel has settled on — the caller's if it is controlling
    /// the panel, otherwise the shell's own.
    func activeDetent(in shellHeight: CGFloat) -> KozmosMapPanelDetent {
        if let panelDetentBinding { return panelDetentBinding.wrappedValue }
        if let uncontrolledDetent { return uncontrolledDetent }
        let ordered = orderedDetents(in: shellHeight)
        if ordered.contains(.medium) { return .medium }
        return ordered.isEmpty ? .medium : ordered[ordered.count / 2]
    }

    private func setDetent(_ detent: KozmosMapPanelDetent) {
        if let panelDetentBinding {
            panelDetentBinding.wrappedValue = detent
        } else {
            uncontrolledDetent = detent
        }
    }

    /// The height the panel rests at, ignoring any drag in progress.
    func settledPanelHeight(in shellHeight: CGFloat) -> CGFloat {
        let ordered = orderedDetents(in: shellHeight)
        let height = activeDetent(in: shellHeight).height(in: shellHeight)
        guard let smallest = ordered.first?.height(in: shellHeight),
              let largest = ordered.last?.height(in: shellHeight)
        else { return height }
        return min(max(height, smallest), largest)
    }

    /// The height to draw right now, following the finger between detents.
    private func livePanelHeight(in shellHeight: CGFloat) -> CGFloat {
        let ordered = orderedDetents(in: shellHeight)
        let smallest = ordered.first?.height(in: shellHeight) ?? settledPanelHeight(in: shellHeight)
        let largest = ordered.last?.height(in: shellHeight) ?? settledPanelHeight(in: shellHeight)
        // Dragging up is a negative translation, and makes the panel taller.
        return min(max(settledPanelHeight(in: shellHeight) - dragTranslation, smallest), largest)
    }

    /// The detent closest to a height, used to snap a drag once it ends.
    func nearestDetent(to height: CGFloat, in shellHeight: CGFloat) -> KozmosMapPanelDetent? {
        orderedDetents(in: shellHeight).min {
            abs($0.height(in: shellHeight) - height) < abs($1.height(in: shellHeight) - height)
        }
    }

    private var showsGrabber: Bool {
        hasPanel && !isRegularWidth && panelDetents.count > 1
    }

    // MARK: - Collision insets

    /// What the shell's own chrome is covering, merged with the caller's own
    /// insets. Each edge takes whichever is larger.
    func resolvedCollisionInsets(in size: CGSize) -> KozmosMapCollisionInsets {
        let edgePadding = KozmosDimensions.primitivesLayoutSpacing200
        let sidePanelWidth = hasPanel && isRegularWidth
            ? min(416, size.width * 0.42) + edgePadding * 2
            : 0
        let dockedPanelHeight = hasPanel && !isRegularWidth
            ? settledPanelHeight(in: size.height)
            : 0
        let controlsColumn = hasControls ? controlsWidth + edgePadding * 2 : 0
        let controlsOnLeading = panelPlacement == .end

        return KozmosMapCollisionInsets(
            top: max(collisionInsets.top, hasTopBar ? Double(topBarHeight) : 0),
            right: max(
                collisionInsets.right,
                Double(controlsOnLeading ? sidePanelWidth : controlsColumn)
            ),
            bottom: max(collisionInsets.bottom, Double(dockedPanelHeight)),
            left: max(
                collisionInsets.left,
                Double(controlsOnLeading ? controlsColumn : sidePanelWidth)
            )
        )
    }

    // MARK: - Body

    public var body: some View {
        GeometryReader { geometry in
            let insets = resolvedCollisionInsets(in: geometry.size)

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
                        .background(
                            GeometryReader { proxy in
                                Color.clear.preference(
                                    key: KozmosMapShellTopBarHeightKey.self,
                                    value: proxy.size.height
                                )
                            }
                        )
                        .zIndex(3)
                }

                if hasControls {
                    controls
                        .background(
                            GeometryReader { proxy in
                                Color.clear.preference(
                                    key: KozmosMapShellControlsWidthKey.self,
                                    value: proxy.size.width
                                )
                            }
                        )
                        .padding(KozmosDimensions.primitivesLayoutSpacing200)
                        // Both slots are anchored to the top edge, so the
                        // controls clear whatever the top bar occupies rather
                        // than sitting underneath it.
                        .padding(.top, hasTopBar ? topBarHeight : 0)
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
            .onPreferenceChange(KozmosMapShellTopBarHeightKey.self) { topBarHeight = $0 }
            .onPreferenceChange(KozmosMapShellControlsWidthKey.self) { controlsWidth = $0 }
            .onAppear { onCollisionInsetsChange?(insets) }
            .onChange(of: insets) { onCollisionInsetsChange?($0) }
        }
        .frame(minHeight: 448)
        .background(KozmosColors.primitivesColorsBackground100)
        .clipped()
    }

    // MARK: - Panel

    @ViewBuilder
    private func panelContainer(in geometry: GeometryProxy) -> some View {
        if isRegularWidth {
            panel
                .frame(width: min(416, geometry.size.width * 0.42))
                .frame(maxHeight: .infinity)
                .background(KozmosColors.primitivesColorsBackground0)
                .clipShape(
                    RoundedRectangle(
                        cornerRadius: KozmosDimensions.semanticsRadiusPanel,
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
            VStack(spacing: 0) {
                if showsGrabber {
                    grabber(in: geometry.size.height)
                }

                panel
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            }
            // An explicit height rather than a cap: the panel is laid out at
            // whatever the detent gives it, so a footer stays on the sheet's
            // bottom edge at every detent instead of falling off the screen.
            .frame(
                width: geometry.size.width,
                height: livePanelHeight(in: geometry.size.height),
                alignment: .top
            )
            .background(KozmosColors.primitivesColorsBackground0)
            .clipShape(
                KozmosPanelShape(
                    radius: KozmosDimensions.semanticsRadiusPanel,
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

    private func grabber(in shellHeight: CGFloat) -> some View {
        let detent = activeDetent(in: shellHeight)

        return Capsule()
            .fill(KozmosColors.primitivesColorsForeground300)
            .frame(width: KozmosDimensions.primitivesLayoutSizing500, height: 5)
            .frame(maxWidth: .infinity)
            .frame(height: Self.grabberRowHeight)
            // The whole row is the target: a 5pt capsule is not a hit area.
            .contentShape(Rectangle())
            // One gesture handles both the drag and the tap. Two separate
            // recognisers on the same view fight, and the tap wins.
            //
            // The coordinate space has to be global: the handle is inside the
            // panel it resizes, so a local space would move with every frame of
            // the drag and feed back into the translation it is measuring.
            .gesture(
                DragGesture(minimumDistance: 0, coordinateSpace: .global)
                    .onChanged { value in
                        dragTranslation = value.translation.height
                    }
                    .onEnded { value in
                        withAnimation(.spring(response: 0.34, dampingFraction: 0.88)) {
                            dragTranslation = 0

                            if abs(value.translation.height) < kozmosMapPanelTapSlop {
                                setDetent(cycledDetent(from: detent, in: shellHeight))
                                return
                            }

                            // Predicted translation carries the flick's
                            // velocity, so a fast short drag still lands on the
                            // detent the visitor was aiming for.
                            let target = settledPanelHeight(in: shellHeight)
                                - value.predictedEndTranslation.height
                            if let nearest = nearestDetent(to: target, in: shellHeight) {
                                setDetent(nearest)
                            }
                        }
                    }
            )
            .accessibilityElement()
            .accessibilityLabel("Panel height")
            .accessibilityValue(detent.accessibilityDescription)
            .accessibilityHint("Swipe up or down to resize the panel")
            .accessibilityAdjustableAction { direction in
                let step = direction == .increment ? 1 : -1
                withAnimation(.spring(response: 0.34, dampingFraction: 0.88)) {
                    setDetent(steppedDetent(from: detent, by: step, in: shellHeight))
                }
            }
    }

    /// Tapping the handle walks up the detents and wraps back to the shortest.
    private func cycledDetent(
        from detent: KozmosMapPanelDetent,
        in shellHeight: CGFloat
    ) -> KozmosMapPanelDetent {
        let ordered = orderedDetents(in: shellHeight)
        guard let index = ordered.firstIndex(of: detent) else { return detent }
        return ordered[(index + 1) % ordered.count]
    }

    /// VoiceOver's increment and decrement move one detent without wrapping.
    private func steppedDetent(
        from detent: KozmosMapPanelDetent,
        by step: Int,
        in shellHeight: CGFloat
    ) -> KozmosMapPanelDetent {
        let ordered = orderedDetents(in: shellHeight)
        guard let index = ordered.firstIndex(of: detent) else { return detent }
        let target = min(max(index + step, 0), ordered.count - 1)
        return ordered[target]
    }
}

public extension KozmosAdaptiveMapShell where TopBar == EmptyView {
    init(
        mapLabel: String = "Map",
        mapStatus: KozmosMapReadiness = .ready,
        panelLabel: String = "Map details",
        panelPlacement: PanelPlacement = .end,
        panelDetent: Binding<KozmosMapPanelDetent>? = nil,
        panelDetents: [KozmosMapPanelDetent] = [.collapsed, .medium, .large],
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
            panelDetent: panelDetent,
            panelDetents: panelDetents,
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
        panelDetent: Binding<KozmosMapPanelDetent>? = nil,
        panelDetents: [KozmosMapPanelDetent] = [.collapsed, .medium, .large],
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
            panelDetent: panelDetent,
            panelDetents: panelDetents,
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
