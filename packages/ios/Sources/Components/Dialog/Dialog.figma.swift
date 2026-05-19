import SwiftUI
import Figma

struct KozmosDialogBasicConnect: FigmaConnect {
    let component = KozmosDialog<EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8101"
    var variant = ["Content": "Basic"]

    @FigmaString("Title Text")
    var title: String = "Edit profile"

    @FigmaString("Description Text")
    var description: String = "Make changes to your profile here."

    @FigmaString("Body Text")
    var bodyText: String = "Use dialog body content for a short task, form, or confirmation."

    var body: some View {
        KozmosDialog(
            isPresented: .constant(true),
            title: self.title,
            description: self.description,
            bodyText: self.bodyText
        )
    }
}

struct KozmosDialogFormConnect: FigmaConnect {
    let component = KozmosDialog<EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8101"
    var variant = ["Content": "Form"]

    @FigmaString("Title Text")
    var title: String = "Edit profile"

    @FigmaString("Description Text")
    var description: String = "Make changes to your profile here."

    @FigmaString("Body Text")
    var bodyText: String = "Use dialog body content for a short task, form, or confirmation."

    @FigmaString("Primary Action Text")
    var primaryActionTitle: String = "Save changes"

    var body: some View {
        KozmosDialog(
            isPresented: .constant(true),
            title: self.title,
            description: self.description,
            bodyText: self.bodyText,
            primaryActionTitle: self.primaryActionTitle,
            onPrimaryAction: {}
        )
    }
}

struct KozmosDialogFooterConnect: FigmaConnect {
    let component = KozmosDialog<EmptyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8101"
    var variant = ["Content": "Footer"]

    @FigmaString("Title Text")
    var title: String = "Review changes"

    @FigmaString("Description Text")
    var description: String = "Confirm the details before continuing."

    @FigmaString("Body Text")
    var bodyText: String = "Use dialog body content for a short task, form, or confirmation."

    @FigmaString("Primary Action Text")
    var primaryActionTitle: String = "Save changes"

    @FigmaString("Secondary Action Text")
    var secondaryActionTitle: String = "Cancel"

    var body: some View {
        KozmosDialog(
            isPresented: .constant(true),
            title: self.title,
            description: self.description,
            bodyText: self.bodyText,
            primaryActionTitle: self.primaryActionTitle,
            secondaryActionTitle: self.secondaryActionTitle,
            onPrimaryAction: {},
            onSecondaryAction: {}
        )
    }
}
