import SwiftUI
import Figma

struct KozmosTextareaConnect: FigmaConnect {
    let component = KozmosTextarea.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=80-328"

    @FigmaString("Placeholder Text")
    var placeholder: String = "Placeholder"

    var body: some View {
        KozmosTextarea(
            text: .constant(""),
            placeholder: self.placeholder
        )
    }
}
