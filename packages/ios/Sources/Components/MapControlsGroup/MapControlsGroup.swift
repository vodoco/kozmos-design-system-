import SwiftUI

public struct KozmosMapControlsGroup: View {
    /// Minimum comfortable hit target, and the width the group reports.
    private static let controlSize: CGFloat = 44

    @Environment(\.kozmosAnalytics) private var trackEvent

    private let compassBearing: Double
    private let onZoomIn: (() -> Void)?
    private let onZoomOut: (() -> Void)?
    private let onCompassReset: (() -> Void)?
    private let onMyLocation: (() -> Void)?
    private let locationPresentation: KozmosMapControlButtonPresentation
    private let locationLabel: String
    private let locationStateLabel: String?

    public init(
        compassBearing: Double = 0,
        onZoomIn: (() -> Void)? = nil,
        onZoomOut: (() -> Void)? = nil,
        onCompassReset: (() -> Void)? = nil,
        onMyLocation: (() -> Void)? = nil,
        locationPresentation: KozmosMapControlButtonPresentation = .iconOnly,
        locationLabel: String = "Locate me",
        locationStateLabel: String? = nil
    ) {
        self.compassBearing = compassBearing
        self.onZoomIn = onZoomIn
        self.onZoomOut = onZoomOut
        self.onCompassReset = onCompassReset
        self.onMyLocation = onMyLocation
        self.locationPresentation = locationPresentation
        self.locationLabel = locationLabel
        self.locationStateLabel = locationStateLabel
    }

    public var body: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
            VStack(spacing: 0) {
                controlButton(
                    systemName: "plus",
                    accessibilityLabel: "Zoom in",
                    actionName: "zoom_in",
                    action: onZoomIn
                )

                // A `Divider` here would stretch the whole group across the
                // map: it is horizontally greedy, and nothing else in the
                // stack constrains the width.
                Rectangle()
                    .fill(KozmosColors.primitivesColorsForeground300)
                    .frame(width: Self.controlSize, height: 1)

                controlButton(
                    systemName: "minus",
                    accessibilityLabel: "Zoom out",
                    actionName: "zoom_out",
                    action: onZoomOut
                )
            }
            .background(surfaceColor)
            .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusContainer, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusContainer, style: .continuous)
                    .stroke(KozmosColors.primitivesColorsForeground900.opacity(0.08), lineWidth: 1)
            )
            .kozmosElevation(KozmosShadows.semanticsElevationFloating)

            if let onCompassReset {
                controlButton(
                    systemName: "safari",
                    accessibilityLabel: "Reset bearing",
                    actionName: "compass_reset",
                    action: onCompassReset
                )
                .rotationEffect(.degrees(compassBearing))
                .background(surfaceColor)
                .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusContainer, style: .continuous))
                .kozmosElevation(KozmosShadows.semanticsElevationFloating)
            }

            if let onMyLocation {
                KozmosMapControlButton(
                    label: locationLabel,
                    systemImage: "location.fill",
                    stateLabel: locationStateLabel,
                    presentation: locationPresentation,
                    pressed: true
                ) {
                    trackEvent(
                        KozmosAnalyticsEvent(
                            eventName: "my_location_triggered",
                            component: "MapControlsGroup"
                        )
                    )
                    onMyLocation()
                }
            }
        }
    }

    private var surfaceColor: Color {
        KozmosColors.primitivesColorsBackground0.opacity(0.88)
    }

    private func controlButton(
        systemName: String,
        accessibilityLabel: String,
        actionName: String,
        action: (() -> Void)?
    ) -> some View {
        Button {
            trackEvent(KozmosAnalyticsEvent(eventName: actionName, component: "MapControlsGroup"))
            action?()
        } label: {
            Image(systemName: systemName)
                .font(.system(size: 18, weight: .semibold))
                .frame(width: Self.controlSize, height: Self.controlSize)
                .foregroundColor(KozmosColors.primitivesColorsForeground100)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(accessibilityLabel)
    }
}
