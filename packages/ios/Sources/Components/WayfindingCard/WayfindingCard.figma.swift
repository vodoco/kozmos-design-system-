import SwiftUI
import Figma

struct KozmosWayfindingCardConnect: FigmaConnect {
    let component = KozmosWayfindingCard<Text>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6893"

    @FigmaString("Title Text")
    var title: String = "Navigation"

    @FigmaString("Body Text")
    var body_: String = "Route content"

    var body: some View {
        KozmosWayfindingCard(title: self.title, onClose: {}) {
            Text(self.body_)
        }
    }
}
