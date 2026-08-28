import SwiftUI

public enum KozmosRouteSummaryState {
    case active
    case preview
}

public struct KozmosRouteSummary<TransportModeIcon: View>: View {
    private let etaText: String
    private let distanceText: String
    private let state: KozmosRouteSummaryState
    private let onEndRoute: () -> Void
    private let onStartNavigation: (() -> Void)?
    private let transportModeIcon: TransportModeIcon
    private let showsTransportModeIcon: Bool

    public init(
        etaText: String,
        distanceText: String,
        state: KozmosRouteSummaryState = .active,
        onEndRoute: @escaping () -> Void,
        onStartNavigation: (() -> Void)? = nil,
        @ViewBuilder transportModeIcon: () -> TransportModeIcon
    ) {
        self.etaText = etaText
        self.distanceText = distanceText
        self.state = state
        self.onEndRoute = onEndRoute
        self.onStartNavigation = onStartNavigation
        self.transportModeIcon = transportModeIcon()
        self.showsTransportModeIcon = true
    }

    public var body: some View {
        VStack(spacing: KozmosDimensions.primitivesLayoutSpacing200) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                if showsTransportModeIcon {
                    transportModeIcon
                        .frame(width: 40, height: 40)
                        .foregroundColor(KozmosColors.primitivesColorsTheme500)
                        .background(KozmosColors.primitivesColorsTheme500.opacity(0.12))
                        .clipShape(Circle())
                }

                VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing25) {
                    Text(etaText)
                        .font(.title3.weight(.bold))
                        .foregroundColor(KozmosColors.primitivesColorsForeground100)

                    Text(distanceText)
                        .font(.subheadline.weight(.medium))
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                }

                Spacer()

                if state == .active {
                    Button(action: onEndRoute) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .bold))
                            .frame(width: 40, height: 40)
                            .foregroundColor(KozmosColors.componentsPrimaryButtonsDangerButtonForegroundContentIdle)
                            .background(KozmosColors.componentsPrimaryButtonsDangerButtonBackgroundIdle)
                            .clipShape(Circle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("End route")
                }
            }

            if state == .preview, let onStartNavigation {
                KozmosButton("Start Navigation", size: .lg, action: onStartNavigation)
                    .frame(maxWidth: .infinity)
            }
        }
        .padding(KozmosDimensions.primitivesLayoutSpacing200)
        .background(KozmosColors.primitivesColorsBackground0.opacity(0.9))
        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                .stroke(KozmosColors.primitivesColorsForeground900.opacity(0.08), lineWidth: 1)
        )
        .shadow(color: KozmosColors.primitivesColorsForeground900.opacity(0.14), radius: 16, x: 0, y: 10)
    }
}

public extension KozmosRouteSummary where TransportModeIcon == EmptyView {
    init(
        etaText: String,
        distanceText: String,
        state: KozmosRouteSummaryState = .active,
        onEndRoute: @escaping () -> Void,
        onStartNavigation: (() -> Void)? = nil
    ) {
        self.etaText = etaText
        self.distanceText = distanceText
        self.state = state
        self.onEndRoute = onEndRoute
        self.onStartNavigation = onStartNavigation
        self.transportModeIcon = EmptyView()
        self.showsTransportModeIcon = false
    }
}
