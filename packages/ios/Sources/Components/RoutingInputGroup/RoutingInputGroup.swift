import SwiftUI

public struct KozmosRoutePoint: Identifiable, Equatable {
    public let id: String
    public let value: String
    public let placeholder: String?

    public init(id: String, value: String, placeholder: String? = nil) {
        self.id = id
        self.value = value
        self.placeholder = placeholder
    }
}

public struct KozmosRoutingInputGroup: View {
    @Environment(\.kozmosAnalytics) private var trackEvent

    private let points: [KozmosRoutePoint]
    private let onPointChange: (String, String) -> Void
    private let onSwap: (() -> Void)?
    private let onAddPoint: (() -> Void)?
    private let onRemovePoint: ((String) -> Void)?

    public init(
        points: [KozmosRoutePoint],
        onPointChange: @escaping (String, String) -> Void,
        onSwap: (() -> Void)? = nil,
        onAddPoint: (() -> Void)? = nil,
        onRemovePoint: ((String) -> Void)? = nil
    ) {
        self.points = points
        self.onPointChange = onPointChange
        self.onSwap = onSwap
        self.onAddPoint = onAddPoint
        self.onRemovePoint = onRemovePoint
    }

    public var body: some View {
        HStack(alignment: .top, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
            routeTimeline

            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                ForEach(Array(points.enumerated()), id: \.element.id) { index, point in
                    HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                        TextField(
                            point.placeholder ?? defaultPlaceholder(for: index),
                            text: Binding(
                                get: { point.value },
                                set: { onPointChange(point.id, $0) }
                            )
                        )
                        .textFieldStyle(.plain)
                        .font(KozmosTypography.subheadline)
                        .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing150)
                        .frame(height: 40)
                        .background(KozmosColors.primitivesColorsForeground900.opacity(0.05))
                        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous))

                        if canRemove(index: index), let onRemovePoint {
                            Button {
                                trackEvent(KozmosAnalyticsEvent(eventName: "point_removed", component: "RoutingInputGroup", properties: ["pointId": point.id]))
                                onRemovePoint(point.id)
                            } label: {
                                Image(systemName: "xmark")
                                    .font(.system(size: 14, weight: .bold))
                                    .frame(width: 36, height: 36)
                                    .foregroundColor(KozmosColors.primitivesColorsEmotionalDanger600)
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel("Remove route point")
                        }
                    }
                }
            }

            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                if points.count == 2, let onSwap {
                    iconAction(systemName: "arrow.up.arrow.down", label: "Swap route points") {
                        trackEvent(KozmosAnalyticsEvent(eventName: "points_swapped", component: "RoutingInputGroup"))
                        onSwap()
                    }
                    .padding(.top, 28)
                }

                if let onAddPoint {
                    iconAction(systemName: "plus", label: "Add route point") {
                        trackEvent(KozmosAnalyticsEvent(eventName: "point_added", component: "RoutingInputGroup"))
                        onAddPoint()
                    }
                }
            }
        }
        .padding(KozmosDimensions.primitivesLayoutSpacing200)
        .background(KozmosColors.primitivesColorsBackground0.opacity(0.9))
        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                .stroke(KozmosColors.primitivesColorsForeground900.opacity(0.08), lineWidth: 1)
        )
        .shadow(color: KozmosColors.primitivesColorsForeground900.opacity(0.12), radius: 14, x: 0, y: 8)
    }

    private var routeTimeline: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing75) {
            ForEach(Array(points.enumerated()), id: \.element.id) { index, _ in
                if index == points.count - 1 {
                    Image(systemName: "mappin")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(KozmosColors.primitivesColorsTheme500)
                } else {
                    Circle()
                        .strokeBorder(index == 0 ? KozmosColors.primitivesColorsTheme500 : KozmosColors.primitivesColorsForeground500, lineWidth: 2)
                        .background(
                            Circle()
                                .fill(index == 0 ? KozmosColors.primitivesColorsTheme500.opacity(0.18) : Color.clear)
                        )
                        .frame(width: 14, height: 14)
                }

                if index < points.count - 1 {
                    Capsule()
                        .fill(KozmosColors.primitivesColorsForeground300)
                        .frame(width: 2, height: 36)
                }
            }
        }
        .padding(.top, 12)
    }

    private func iconAction(systemName: String, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.system(size: 15, weight: .bold))
                .frame(width: 40, height: 40)
                .foregroundColor(KozmosColors.primitivesColorsForeground100)
                .background(KozmosColors.primitivesColorsForeground900.opacity(0.05))
                .clipShape(Circle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }

    private func defaultPlaceholder(for index: Int) -> String {
        index == 0 ? "Choose Starting Point" : "Choose Destination"
    }

    private func canRemove(index: Int) -> Bool {
        points.count > 2 && index > 0 && index < points.count - 1
    }
}
