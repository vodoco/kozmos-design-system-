import SwiftUI
import Kozmos

/// The map camera.
///
/// A floor plan is taller than the strip of screen left uncovered by the top
/// bar and the panel, so the plan fills the visible width and pans to keep the
/// point of interest in view — the same thing a real map SDK does with the
/// collision insets the shell hands back.
private struct PlanLayout {
    let scale: CGFloat
    let origin: CGPoint

    init(size: CGSize, insets: EdgeInsets, focus: CGPoint, zoom: CGFloat) {
        let visible = CGSize(
            width: max(size.width - insets.leading - insets.trailing, 1),
            height: max(size.height - insets.top - insets.bottom, 1)
        )

        scale = visible.width / PlanSpace.size.width * zoom

        let planSize = CGSize(
            width: PlanSpace.size.width * scale,
            height: PlanSpace.size.height * scale
        )
        let centre = CGPoint(
            x: insets.leading + visible.width / 2,
            y: insets.top + visible.height / 2
        )

        func axis(
            planLength: CGFloat,
            visibleLength: CGFloat,
            leadingInset: CGFloat,
            centred: CGFloat
        ) -> CGFloat {
            guard planLength > visibleLength else {
                return leadingInset + (visibleLength - planLength) / 2
            }
            let lowerBound = leadingInset + visibleLength - planLength
            return min(leadingInset, max(lowerBound, centred))
        }

        origin = CGPoint(
            x: axis(
                planLength: planSize.width,
                visibleLength: visible.width,
                leadingInset: insets.leading,
                centred: centre.x - focus.x * scale
            ),
            y: axis(
                planLength: planSize.height,
                visibleLength: visible.height,
                leadingInset: insets.top,
                centred: centre.y - focus.y * scale
            )
        )
    }

    func point(_ value: CGPoint) -> CGPoint {
        CGPoint(x: origin.x + value.x * scale, y: origin.y + value.y * scale)
    }

    func rect(_ value: CGRect) -> CGRect {
        CGRect(
            x: origin.x + value.minX * scale,
            y: origin.y + value.minY * scale,
            width: value.width * scale,
            height: value.height * scale
        )
    }

    func length(_ value: CGFloat) -> CGFloat { value * scale }
}

/// The floor plan itself.
///
/// Kozmos ships the map *container* (`KozmosMapView`) and the map *furniture*
/// (`KozmosLocationPin`, `KozmosUserLocationMarker`) but not a renderer, so the
/// plan is drawn here — using only Kozmos colour and radius tokens, the way a
/// real SDK layer would be themed.
struct VenueMapCanvas: View {
    let floor: VenueFloor
    let pois: [VenuePOI]
    let selectedPOIId: String?
    let destinationPOIId: String?
    let highlightedPOIIds: Set<String>
    let routePoints: [CGPoint]
    let userPosition: CGPoint?
    let userHeading: Double
    let zoom: CGFloat
    /// Screen the map keeps clear of the top bar, the controls, and the panel.
    let insets: EdgeInsets
    /// The plan point the camera keeps in view.
    let focus: CGPoint
    let onSelect: (String) -> Void

    var body: some View {
        GeometryReader { geometry in
            let layout = PlanLayout(size: geometry.size, insets: insets, focus: focus, zoom: zoom)

            ZStack(alignment: .topLeading) {
                slab(layout)
                corridors(layout)
                rooms(layout)
                core(layout)

                if routePoints.count > 1 {
                    routeLine(layout)
                }

                pins(layout)

                if let userPosition {
                    KozmosUserLocationMarker(heading: userHeading)
                        .position(layout.point(userPosition))
                }
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .clipped()
            .animation(.easeInOut(duration: 0.25), value: zoom)
            .animation(.easeInOut(duration: 0.25), value: focus)
            .animation(.easeInOut(duration: 0.3), value: floor.id)
        }
        .background(KozmosColors.primitivesColorsBackground200)
        .accessibilityElement(children: .contain)
        .accessibilityLabel("\(floor.presentation.label) floor plan")
    }

    // MARK: - Plan layers

    private func slab(_ layout: PlanLayout) -> some View {
        let rect = layout.rect(CGRect(x: 2, y: 2, width: 96, height: 166))
        return RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
            .fill(KozmosColors.semanticsSurface100)
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                    .stroke(KozmosColors.primitivesColorsBackground400, lineWidth: 1)
            )
            .frame(width: rect.width, height: rect.height)
            .position(x: rect.midX, y: rect.midY)
    }

    private func corridors(_ layout: PlanLayout) -> some View {
        ForEach(PlanSpace.corridors.indices, id: \.self) { index in
            let rect = layout.rect(PlanSpace.corridors[index])
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusMarker, style: .continuous)
                .fill(KozmosColors.semanticsSurface0)
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
        }
    }

    private func rooms(_ layout: PlanLayout) -> some View {
        ForEach(floor.rooms) { room in
            let rect = layout.rect(room.rect)
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                .fill(KozmosColors.primitivesColorsBackground0)
                .overlay(
                    RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                        .stroke(KozmosColors.primitivesColorsBackground400, lineWidth: 1)
                )
                .overlay(
                    Group {
                        // A wrapped label would run over the marker beneath it,
                        // and below this width it is unreadable anyway.
                        if rect.width >= 56 {
                            Text(room.label)
                                .font(KozmosTypography.caption2)
                                .foregroundColor(KozmosColors.primitivesColorsForeground500)
                                .lineLimit(1)
                                .minimumScaleFactor(0.6)
                                .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing50)
                                .frame(width: rect.width)
                                .offset(y: -rect.height / 2 + KozmosDimensions.primitivesLayoutSpacing150)
                        }
                    }
                )
                .frame(width: rect.width, height: rect.height)
                .position(x: rect.midX, y: rect.midY)
                .accessibilityHidden(true)
        }
    }

    private func core(_ layout: PlanLayout) -> some View {
        let rect = layout.rect(PlanSpace.coreRect)
        return RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusMarker, style: .continuous)
            .fill(KozmosColors.primitivesColorsTheme100)
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusMarker, style: .continuous)
                    .stroke(KozmosColors.primitivesColorsTheme300, lineWidth: 1)
            )
            .overlay(
                KozmosIcon("building-01", size: .sm, color: .primary)
            )
            .frame(width: rect.width, height: rect.height)
            .position(x: rect.midX, y: rect.midY)
            .accessibilityHidden(true)
    }

    private func routeLine(_ layout: PlanLayout) -> some View {
        let path = Path { path in
            let points = routePoints.map(layout.point)
            path.move(to: points[0])
            points.dropFirst().forEach { path.addLine(to: $0) }
        }

        return ZStack {
            path.stroke(
                KozmosColors.primitivesColorsTheme500.opacity(0.18),
                style: StrokeStyle(lineWidth: layout.length(7), lineCap: .round, lineJoin: .round)
            )
            path.stroke(
                KozmosColors.primitivesColorsTheme500,
                style: StrokeStyle(lineWidth: layout.length(2.6), lineCap: .round, lineJoin: .round)
            )
        }
        .accessibilityHidden(true)
    }

    private func pins(_ layout: PlanLayout) -> some View {
        let labelled = labelledPins
        return ForEach(pois) { poi in
            KozmosLocationPin(
                variant: variant(for: poi),
                size: size(for: poi),
                label: labelled.contains(poi.id) ? poi.presentation.name : nil,
                labelPlacement: poi.position.y > PlanSpace.size.height * 0.75 ? .top : .bottom,
                selected: poi.id == selectedPOIId,
                featured: poi.featured,
                isDisabled: poi.presentation.availability == .closed,
                onSelect: { onSelect(poi.id) }
            )
            .position(layout.point(poi.position))
        }
    }

    private var labelledPins: Set<String> {
        var labelled = highlightedPOIIds
        if let selectedPOIId { labelled.insert(selectedPOIId) }
        if let destinationPOIId { labelled.insert(destinationPOIId) }
        return labelled
    }

    /// Resting pins recede; the ones the visitor is working with come forward.
    private func variant(for poi: VenuePOI) -> KozmosLocationPinVariant {
        if poi.id == destinationPOIId { return .accent }
        if poi.id == selectedPOIId || highlightedPOIIds.contains(poi.id) { return .primary }
        return .secondary
    }

    private func size(for poi: VenuePOI) -> KozmosLocationPinSize {
        if poi.id == destinationPOIId { return .lg }
        if poi.id == selectedPOIId || highlightedPOIIds.contains(poi.id) { return .md }
        return .sm
    }
}
