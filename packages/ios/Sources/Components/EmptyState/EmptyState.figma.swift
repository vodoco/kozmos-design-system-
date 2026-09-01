import SwiftUI
import Figma

struct KozmosEmptyStateBasicConnect: FigmaConnect {
    let component = KozmosEmptyState<EmptyView, EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=347-5316"
    var variant = ["Content": "Basic"]

    @FigmaString("Title Text")
    var title: String = "No results found"

    @FigmaString("Description Text")
    var description: String = "Try adjusting your filters or search terms."

    var body: some View {
        KozmosEmptyState(
            title: self.title,
            description: self.description
        )
    }
}

struct KozmosEmptyStateIconConnect: FigmaConnect {
    let component = KozmosEmptyState<Image, EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=347-5316"
    var variant = ["Content": "Icon"]

    @FigmaString("Title Text")
    var title: String = "No results found"

    @FigmaString("Description Text")
    var description: String = "Try adjusting your filters or search terms."

    var body: some View {
        KozmosEmptyState(
            title: self.title,
            description: self.description
        ) {
            Image(systemName: "magnifyingglass")
        } action: {
            EmptyView()
        }
    }
}

struct KozmosEmptyStateActionConnect: FigmaConnect {
    let component = KozmosEmptyState<Image, KozmosButton>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=347-5316"
    var variant = ["Content": "Action"]

    @FigmaString("Title Text")
    var title: String = "No results found"

    @FigmaString("Description Text")
    var description: String = "Try adjusting your filters or search terms."

    var body: some View {
        KozmosEmptyState(
            title: self.title,
            description: self.description
        ) {
            Image(systemName: "magnifyingglass")
        } action: {
            KozmosButton("Clear filters", variant: .outline, action: {})
        }
    }
}
