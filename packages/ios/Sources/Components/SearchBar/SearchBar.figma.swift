import SwiftUI
import Figma

struct KozmosSearchBarConnect: FigmaConnect {
    let component = KozmosSearchBar.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=682-15111"

    @FigmaString("Placeholder Text")
    var placeholder: String = "Search..."

    @FigmaString("Value Text")
    var value: String = ""

    var body: some View {
        KozmosSearchBar(
            text: .constant(self.value),
            placeholder: self.placeholder
        )
    }
}
