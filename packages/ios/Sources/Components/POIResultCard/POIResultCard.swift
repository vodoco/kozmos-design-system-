import SwiftUI

/// Characters `encodeURIComponent` leaves untouched. Matching the web escaping
/// exactly keeps the identifier identical on all three platforms.
private let kozmosPOIResultIdentifierAllowed = CharacterSet(
    charactersIn: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'()"
)

/// Stable identifier for a POI result, shared with map markers so a pin and its
/// list row can be kept in sync from one selection ID.
///
/// Produces the same value as the web `getPOIResultDomId`.
public func kozmosPOIResultIdentifier(_ poiId: String) -> String {
    let encoded = poiId
        .addingPercentEncoding(withAllowedCharacters: kozmosPOIResultIdentifierAllowed) ?? poiId
    return "poi-result-\(encoded)"
}

/// A POI search/list result row.
///
/// Mirrors the React `POIResultCard`. Selection is reported upward only; the
/// card renders exactly the state described by `poi` and `result`.
public struct KozmosPOIResultCard: View {
    @Environment(\.kozmosAnalytics) private var trackEvent

    private let poi: KozmosPOIPresentation
    private let result: KozmosPOIResultPresentation
    private let featuredLabel: String
    private let selectionLabel: String?
    private let onSelect: (String) -> Void

    public init(
        poi: KozmosPOIPresentation,
        result: KozmosPOIResultPresentation,
        featuredLabel: String = "Featured",
        selectionLabel: String? = nil,
        onSelect: @escaping (String) -> Void
    ) {
        self.poi = poi
        self.result = result
        self.featuredLabel = featuredLabel
        self.selectionLabel = selectionLabel
        self.onSelect = onSelect
    }

    private var available: Bool { result.isAvailable }

    private var accessibilityDescription: String {
        if let selectionLabel { return selectionLabel }
        return [
            result.featured ? featuredLabel : nil,
            poi.name,
            poi.categoryLabel,
            poi.locationLabel,
            poi.availabilityLabel,
            result.travelEstimate?.durationLabel,
            available ? nil : result.unavailableReason
        ]
        .compactMap { $0 }
        .joined(separator: ", ")
    }

    /// An unavailable result is still readable, but must not be announced as an
    /// actionable button. `.isSelected` only applies to a selectable card.
    private var accessibilityTraits: AccessibilityTraits {
        guard available else { return [] }
        return result.selected ? [.isButton, .isSelected] : .isButton
    }

    private func handleSelect() {
        guard available else { return }
        trackEvent(
            KozmosAnalyticsEvent(
                eventName: "poi_result_selected",
                component: "POIResultCard",
                properties: [
                    "poiId": poi.id,
                    "resultIndex": result.resultIndex,
                    "featured": result.featured
                ]
            )
        )
        onSelect(poi.id)
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            if result.featured {
                HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                    Image(systemName: "star.fill")
                        .font(.caption2)
                        .accessibilityHidden(true)
                    Text(featuredLabel)
                        .font(.caption.weight(.semibold))
                }
                .foregroundColor(KozmosColors.componentsPrimaryButtonsAlertButtonForegroundContentIdle)
                .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing100)
                .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing50)
                .background(KozmosColors.componentsPrimaryButtonsAlertButtonBackgroundIdle)
                .clipShape(
                    RoundedRectangle(
                        cornerRadius: KozmosDimensions.primitivesLayoutRadius100,
                        style: .continuous
                    )
                )
                .padding(.leading, KozmosDimensions.primitivesLayoutSpacing200)
            }

            Button(action: handleSelect) {
                HStack(alignment: .center, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                    Text("\(result.resultIndex)")
                        .font(.subheadline.weight(.bold))
                        .foregroundColor(KozmosColors.componentsPrimaryButtonsThemedButtonForegroundContentIdle)
                        .frame(width: 32, height: 32)
                        .background(KozmosColors.componentsPrimaryButtonsThemedButtonBackgroundIdle)
                        .clipShape(Circle())
                        .accessibilityHidden(true)

                    VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing25) {
                        Text(poi.name)
                            .font(.body.weight(.semibold))
                            .foregroundColor(KozmosColors.primitivesColorsForeground100)
                            .lineLimit(1)

                        if let categoryLabel = poi.categoryLabel {
                            Text(categoryLabel)
                                .font(.subheadline)
                                .foregroundColor(KozmosColors.primitivesColorsForeground500)
                                .lineLimit(1)
                        }

                        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                            Image(systemName: "mappin.and.ellipse")
                                .font(.footnote)
                                .accessibilityHidden(true)
                            Text(poi.locationLabel)
                                .font(.subheadline)
                                .lineLimit(1)
                        }
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)

                        if let availabilityLabel = poi.availabilityLabel {
                            Text(availabilityLabel)
                                .font(.caption.weight(.semibold))
                                .foregroundColor(
                                    poi.availability == .open
                                        ? KozmosColors.componentsPrimaryButtonsSuccessButtonBackgroundIdle
                                        : KozmosColors.primitivesColorsForeground500
                                )
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(alignment: .trailing, spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                        logo

                        if let travelEstimate = result.travelEstimate {
                            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing50) {
                                Image(systemName: "clock")
                                    .font(.caption2)
                                    .accessibilityHidden(true)
                                Text(travelEstimate.durationLabel)
                                    .font(.caption.weight(.medium))
                            }
                            .foregroundColor(KozmosColors.primitivesColorsForeground100)
                        }
                    }
                }
                .frame(minHeight: 96)
                .padding(KozmosDimensions.primitivesLayoutSpacing200)
            }
            .buttonStyle(.plain)
            .disabled(!available)
            .opacity(available ? 1 : 0.6)

            if !available, let unavailableReason = result.unavailableReason {
                Divider().overlay(KozmosColors.primitivesColorsForeground300)

                Text(unavailableReason)
                    .font(.caption)
                    .foregroundColor(KozmosColors.primitivesColorsForeground500)
                    .padding(.horizontal, KozmosDimensions.primitivesLayoutSpacing200)
                    .padding(.vertical, KozmosDimensions.primitivesLayoutSpacing100)
            }
        }
        .background(KozmosColors.primitivesColorsBackground0)
        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius300, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius300, style: .continuous)
                .stroke(
                    result.selected
                        ? KozmosColors.primitivesColorsTheme500
                        : KozmosColors.primitivesColorsForeground300,
                    lineWidth: result.selected ? 2 : 1
                )
        )
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(accessibilityDescription)
        .accessibilityAddTraits(accessibilityTraits)
        .accessibilityAction {
            // No-ops when unavailable; the traits above already withhold the
            // button affordance so VoiceOver does not offer the action.
            handleSelect()
        }
        .accessibilityIdentifier(kozmosPOIResultIdentifier(poi.id))
    }

    @ViewBuilder
    private var logo: some View {
        if let logo = poi.logo, let url = URL(string: logo.src) {
            AsyncImage(url: url) { image in
                image.resizable().aspectRatio(contentMode: .fit)
            } placeholder: {
                KozmosColors.primitivesColorsBackground100
            }
            .frame(width: 40, height: 40)
            .clipShape(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100, style: .continuous)
            )
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100, style: .continuous)
                    .stroke(KozmosColors.primitivesColorsForeground300, lineWidth: 1)
            )
            .accessibilityLabel(logo.alt)
        } else {
            Text(poi.logoFallbackInitial)
                .font(.subheadline.weight(.bold))
                .foregroundColor(KozmosColors.primitivesColorsForeground500)
                .frame(width: 40, height: 40)
                .background(KozmosColors.primitivesColorsBackground100)
                .clipShape(
                    RoundedRectangle(cornerRadius: KozmosDimensions.primitivesLayoutRadius100, style: .continuous)
                )
                .accessibilityHidden(true)
        }
    }
}
