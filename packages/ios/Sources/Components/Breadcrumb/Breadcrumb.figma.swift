import SwiftUI
import Figma

struct KozmosBreadcrumbBasicConnect: FigmaConnect {
    let component = KozmosBreadcrumb.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1048"
    var variant = ["Content": "Basic"]

    @FigmaString("Item 1 Text")
    var item1: String = "Home"

    @FigmaString("Item 2 Text")
    var item2: String = "Library"

    @FigmaString("Current Page Text")
    var currentPage: String = "Component"

    var body: some View {
        KozmosBreadcrumb(
            items: [self.item1, self.item2, self.currentPage],
            onSelect: { _ in }
        )
    }
}

struct KozmosBreadcrumbEllipsisConnect: FigmaConnect {
    let component = KozmosBreadcrumb.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1048"
    var variant = ["Content": "Ellipsis"]

    @FigmaString("Item 1 Text")
    var item1: String = "Home"

    @FigmaString("Current Page Text")
    var currentPage: String = "Component"

    var body: some View {
        KozmosBreadcrumb(
            items: [self.item1, "...", self.currentPage],
            onSelect: { _ in }
        )
    }
}
