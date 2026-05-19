import SwiftUI
import Figma

struct KozmosToastBasicConnect: FigmaConnect {
    let component = KozmosToast.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8189"
    var variant = ["Content": "Basic"]

    @FigmaString("Title Text")
    var title: String = "Notification"

    @FigmaString("Description Text")
    var description: String = "Your changes have been saved."

    var body: some View {
        KozmosToast(
            isPresented: .constant(true),
            title: self.title,
            description: self.description,
            autoDismissAfter: nil
        )
    }
}

struct KozmosToastActionConnect: FigmaConnect {
    let component = KozmosToast.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8189"
    var variant = ["Content": "Action"]

    @FigmaString("Title Text")
    var title: String = "Notification"

    @FigmaString("Description Text")
    var description: String = "Your changes have been saved."

    @FigmaString("Action Text")
    var actionTitle: String = "Undo"

    var body: some View {
        KozmosToast(
            isPresented: .constant(true),
            title: self.title,
            description: self.description,
            actionTitle: self.actionTitle,
            autoDismissAfter: nil,
            onAction: {}
        )
    }
}
