import SwiftUI

/// A scrollable grid of browsable categories with optional search and actions.
///
/// Mirrors the React `BrowseCategoriesPanel`. The panel renders whatever
/// categories it is given; filtering, searching, and result counts belong to
/// the consuming app.
public struct KozmosBrowseCategoriesPanel<Icon: View, Search: View, Actions: View, EmptyStateContent: View>: View {
    private let categories: [KozmosCategoryPresentation]
    private let label: String
    private let onSelect: (String) -> Void
    private let renderIcon: (KozmosCategoryPresentation) -> Icon
    private let search: Search
    private let actions: Actions
    private let emptyState: EmptyStateContent
    private let hasSearch: Bool
    private let hasActions: Bool

    private let columns = [
        GridItem(.adaptive(minimum: 140), spacing: KozmosDimensions.primitivesLayoutSpacing150)
    ]

    public init(
        categories: [KozmosCategoryPresentation],
        label: String = "Browse categories",
        onSelect: @escaping (String) -> Void,
        @ViewBuilder renderIcon: @escaping (KozmosCategoryPresentation) -> Icon,
        @ViewBuilder search: () -> Search,
        @ViewBuilder actions: () -> Actions,
        @ViewBuilder emptyState: () -> EmptyStateContent
    ) {
        self.categories = categories
        self.label = label
        self.onSelect = onSelect
        self.renderIcon = renderIcon
        self.search = search()
        self.actions = actions()
        self.emptyState = emptyState()
        self.hasSearch = Search.self != EmptyView.self
        self.hasActions = Actions.self != EmptyView.self
    }

    public var body: some View {
        VStack(spacing: 0) {
            if hasSearch || hasActions {
                HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                    if hasSearch {
                        search.frame(maxWidth: .infinity, alignment: .leading)
                    }
                    if hasActions {
                        actions.layoutPriority(1)
                    }
                }
                .padding(KozmosDimensions.primitivesLayoutSpacing200)

                Divider().overlay(KozmosColors.primitivesColorsForeground300)
            }

            ScrollView {
                if categories.isEmpty {
                    emptyState
                        .frame(maxWidth: .infinity)
                        .padding(KozmosDimensions.primitivesLayoutSpacing300)
                        .background(KozmosColors.primitivesColorsBackground100.opacity(0.4))
                        .clipShape(RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: KozmosDimensions.semanticsRadiusPanel, style: .continuous)
                                .strokeBorder(
                                    KozmosColors.primitivesColorsForeground300,
                                    style: StrokeStyle(lineWidth: 1, dash: [4, 4])
                                )
                        )
                } else {
                    LazyVGrid(columns: columns, spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                        ForEach(categories) { category in
                            KozmosCategoryTile(category: category, onSelect: onSelect) {
                                renderIcon(category)
                            }
                        }
                    }
                }
            }
            .padding(KozmosDimensions.primitivesLayoutSpacing200)
        }
        .frame(maxWidth: .infinity)
        .background(KozmosColors.primitivesColorsBackground0)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(label)
    }
}

public extension KozmosBrowseCategoriesPanel where Search == EmptyView, Actions == EmptyView {
    init(
        categories: [KozmosCategoryPresentation],
        label: String = "Browse categories",
        onSelect: @escaping (String) -> Void,
        @ViewBuilder renderIcon: @escaping (KozmosCategoryPresentation) -> Icon,
        @ViewBuilder emptyState: () -> EmptyStateContent
    ) {
        self.init(
            categories: categories,
            label: label,
            onSelect: onSelect,
            renderIcon: renderIcon,
            search: { EmptyView() },
            actions: { EmptyView() },
            emptyState: emptyState
        )
    }
}
