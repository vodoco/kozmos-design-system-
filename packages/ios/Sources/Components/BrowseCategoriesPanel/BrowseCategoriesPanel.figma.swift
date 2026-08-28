import SwiftUI
import Figma

struct KozmosBrowseCategoriesPanelConnect: FigmaConnect {
    let component = KozmosBrowseCategoriesPanel<Image, EmptyView, EmptyView, EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8026"

    @FigmaString("Panel Label Text")
    var label: String = "Browse categories"

    var body: some View {
        KozmosBrowseCategoriesPanel(
            categories: [],
            label: self.label,
            onSelect: { _ in },
            renderIcon: { _ in Image(systemName: "fork.knife") },
            search: { EmptyView() },
            actions: { EmptyView() },
            emptyState: { EmptyView() }
        )
    }
}
