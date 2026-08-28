import SwiftUI

/// A single browsable category cell.
///
/// Mirrors the React `CategoryTile`: the tile owns presentation and selection
/// semantics only. Category identity, labels, counts, and selected state are
/// supplied by the consuming app through `KozmosCategoryPresentation`.
public struct KozmosCategoryTile<Icon: View>: View {
    @Environment(\.kozmosAnalytics) private var trackEvent

    private let category: KozmosCategoryPresentation
    private let isDisabled: Bool
    private let onSelect: (String) -> Void
    private let icon: Icon

    public init(
        category: KozmosCategoryPresentation,
        isDisabled: Bool = false,
        onSelect: @escaping (String) -> Void,
        @ViewBuilder icon: () -> Icon
    ) {
        self.category = category
        self.isDisabled = isDisabled
        self.onSelect = onSelect
        self.icon = icon()
    }

    private var disabled: Bool { category.disabled || isDisabled }

    public var body: some View {
        Button {
            trackEvent(
                KozmosAnalyticsEvent(
                    eventName: "category_selected",
                    component: "CategoryTile",
                    properties: ["categoryId": category.id]
                )
            )
            onSelect(category.id)
        } label: {
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                icon
                    .frame(width: 40, height: 40)
                    .foregroundColor(KozmosColors.primitivesColorsTheme500)
                    .accessibilityHidden(true)

                Text(category.label)
                    .font(.subheadline.weight(.medium))
                    .foregroundColor(KozmosColors.primitivesColorsForeground100)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)

                if let resultCountLabel = category.resultCountLabel {
                    Text(resultCountLabel)
                        .font(.caption)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                }
            }
            .frame(maxWidth: .infinity, minHeight: 112)
            .padding(KozmosDimensions.primitivesLayoutSpacing150)
            .background(
                category.selected
                    ? KozmosColors.primitivesColorsTheme500.opacity(0.05)
                    : KozmosColors.primitivesColorsBackground0
            )
            .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                    .stroke(
                        category.selected
                            ? KozmosColors.primitivesColorsTheme500
                            : KozmosColors.primitivesColorsForeground300,
                        lineWidth: category.selected ? 2 : 1
                    )
            )
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .opacity(disabled ? 0.5 : 1)
        .accessibilityLabel(category.label)
        .accessibilityValue(category.resultCountLabel ?? "")
        .accessibilityAddTraits(category.selected ? [.isButton, .isSelected] : .isButton)
    }
}

public extension KozmosCategoryTile where Icon == EmptyView {
    init(
        category: KozmosCategoryPresentation,
        isDisabled: Bool = false,
        onSelect: @escaping (String) -> Void
    ) {
        self.init(category: category, isDisabled: isDisabled, onSelect: onSelect) {
            EmptyView()
        }
    }
}
