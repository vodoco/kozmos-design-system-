import SwiftUI
import Figma

struct KozmosSplitButtonConnect: FigmaConnect {
    let component = KozmosSplitButton.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2332"

    @FigmaString("Label Text")
    var label: String = "Action"

    var body: some View {
        KozmosSplitButton(
            label: self.label,
            mainAction: {},
            menuItems: [
                ("Action 1", {}),
                ("Action 2", {})
            ]
        )
    }
}
