import SwiftUI

public struct KozmosSaveLocationCard: View {
    @Environment(\.kozmosAnalytics) private var trackEvent

    private let title: String
    private let description: String
    private let isSaved: Bool
    private let onSaveToggle: (() -> Void)?
    private let onRouteToLocation: (() -> Void)?
    private let onEditNote: (() -> Void)?

    public init(
        title: String = "Mark My Car",
        description: String = "Remember where you parked",
        isSaved: Bool = false,
        onSaveToggle: (() -> Void)? = nil,
        onRouteToLocation: (() -> Void)? = nil,
        onEditNote: (() -> Void)? = nil
    ) {
        self.title = title
        self.description = description
        self.isSaved = isSaved
        self.onSaveToggle = onSaveToggle
        self.onRouteToLocation = onRouteToLocation
        self.onEditNote = onEditNote
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing200) {
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing200) {
                Image(systemName: "car.fill")
                    .font(.system(size: 22, weight: .semibold))
                    .frame(width: 48, height: 48)
                    .foregroundColor(isSaved ? KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle : KozmosColors.primitivesColorsForeground100)
                    .background(isSaved ? KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle : KozmosColors.primitivesColorsBackground0)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(KozmosColors.primitivesColorsForeground900.opacity(0.08), lineWidth: 1))

                VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing25) {
                    Text(title)
                        .font(.headline.weight(.semibold))
                        .foregroundColor(KozmosColors.primitivesColorsForeground100)

                    Text(description)
                        .font(KozmosTypography.subheadline)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                }

                Spacer()

                if isSaved, let onEditNote {
                    Button(action: onEditNote) {
                        Image(systemName: "pencil")
                            .frame(width: 36, height: 36)
                            .foregroundColor(KozmosColors.primitivesColorsForeground500)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Edit location note")
                }
            }

            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                Button {
                    trackEvent(KozmosAnalyticsEvent(eventName: "save_toggled", component: "SaveLocationCard", properties: ["isSaved": String(!isSaved)]))
                    onSaveToggle?()
                } label: {
                    Label(isSaved ? "Remove Location" : "Save Location", systemImage: "mappin")
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity, minHeight: 44)
                }
                .foregroundColor(isSaved ? KozmosColors.primitivesColorsTheme500 : KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle)
                .background(isSaved ? Color.clear : KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle)
                .overlay(
                    RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                        .stroke(isSaved ? KozmosColors.primitivesColorsTheme500 : Color.clear, lineWidth: 1)
                )
                .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous))
                .buttonStyle(.plain)

                if isSaved, let onRouteToLocation {
                    Button {
                        trackEvent(KozmosAnalyticsEvent(eventName: "route_requested", component: "SaveLocationCard"))
                        onRouteToLocation()
                    } label: {
                        Label("Guide Me", systemImage: "location.north.fill")
                            .font(.subheadline.weight(.semibold))
                            .frame(maxWidth: .infinity, minHeight: 44)
                    }
                    .foregroundColor(KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle)
                    .background(KozmosColors.primitivesColorsEmotionalSuccess600)
                    .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous))
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(KozmosDimensions.primitivesLayoutSpacing300)
        .background(KozmosColors.primitivesColorsBackground0.opacity(0.9))
        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                .stroke(KozmosColors.primitivesColorsForeground900.opacity(0.08), lineWidth: 1)
        )
        .kozmosElevation(KozmosShadows.semanticsElevationFloating)
    }
}
