import SwiftUI
import Figma

struct KozmosDatePickerConnect: FigmaConnect {
    let component = KozmosDatePicker.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=438-4292"

    @FigmaString("Label Text")
    var label: String = "Date"

    var body: some View {
        KozmosDatePicker(
            selection: .constant(Date()),
            label: self.label
        )
    }
}
