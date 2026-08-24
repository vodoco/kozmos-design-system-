import SwiftUI
import Figma

struct KozmosTimePickerConnect: FigmaConnect {
    let component = KozmosTimePicker.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=444-12011"

    @FigmaString("Label Text")
    var label: String = "Time"

    var body: some View {
        KozmosTimePicker(
            selection: .constant(Date()),
            label: self.label
        )
    }
}
