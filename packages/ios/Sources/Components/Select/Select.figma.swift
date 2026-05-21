import SwiftUI
import Figma

struct KozmosSelectConnect: FigmaConnect {
    let component = KozmosSelect<Text, KozmosSelectItem>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=80-432"

    @FigmaString("Placeholder Text")
    var placeholder: String = "Select option"

    var body: some View {
        KozmosSelect {
            Text(self.placeholder)
        } content: {
            KozmosSelectItem(
                value: "option",
                label: "Option",
                selection: .constant("")
            )
        }
    }
}
