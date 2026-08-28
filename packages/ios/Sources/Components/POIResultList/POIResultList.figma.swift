import SwiftUI
import Figma

struct KozmosPOIResultListConnect: FigmaConnect {
    let component = KozmosPOIResultList<EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8171"

    @FigmaString("Result Count Text")
    var resultCountLabel: String = "12 results"

    var body: some View {
        KozmosPOIResultList(
            items: [],
            resultCountLabel: self.resultCountLabel,
            onSelect: { _ in }
        ) {
            EmptyView()
        }
    }
}
