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
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing75) {
                // The icon's square: 64, radius Control, the container edge;
                // the selection shows on it. The label sits under it.
                icon
                    .frame(width: KozmosDimensions.primitivesLayoutSizing300, height: KozmosDimensions.primitivesLayoutSizing300)
                    .foregroundColor(KozmosColors.primitivesColorsTheme500)
                    .frame(width: KozmosDimensions.primitivesLayoutSizing800, height: KozmosDimensions.primitivesLayoutSizing800)
                    .background(
                        category.selected
                            ? KozmosColors.primitivesColorsTheme500.opacity(0.05)
                            : KozmosColors.primitivesColorsBackground0
                    )
                    .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusControl, style: .continuous)
                            .stroke(
                                category.selected ? KozmosColors.primitivesColorsTheme500 : KozmosColors.semanticsBorderSubtle,
                                lineWidth: category.selected ? 2 : 1
                            )
                    )
                    .accessibilityHidden(true)

                Text(category.label)
                    .font(KozmosTypography.caption2)
                    .foregroundColor(KozmosColors.primitivesColorsForeground100)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .fixedSize(horizontal: false, vertical: true)

                if let resultCountLabel = category.resultCountLabel {
                    Text(resultCountLabel)
                        .font(KozmosTypography.caption)
                        .foregroundColor(KozmosColors.primitivesColorsForeground500)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(KozmosDimensions.primitivesLayoutSpacing50)
            .contentShape(Rectangle())
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
