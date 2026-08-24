import SwiftUI
import Figma

struct KozmosCardBasicConnect: FigmaConnect {
    let component = KozmosCard<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=87-2536"
    var variant = ["Content": "Basic"]

    @FigmaString("Body Text")
    var bodyText: String = "Use card body content for short supporting detail."

    var body: some View {
        KozmosCard {
            AnyView(
                KozmosCardContent {
                    Text(self.bodyText)
                }
            )
        }
    }
}

struct KozmosCardHeaderConnect: FigmaConnect {
    let component = KozmosCard<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=87-2536"
    var variant = ["Content": "Header"]

    @FigmaString("Title Text")
    var title: String = "Card title"

    @FigmaString("Description Text")
    var description: String = "Supporting description."

    @FigmaString("Body Text")
    var bodyText: String = "Use card body content for short supporting detail."

    var body: some View {
        KozmosCard {
            AnyView(
                VStack(alignment: .leading, spacing: 0) {
                    KozmosCardHeader {
                        KozmosCardTitle(self.title)
                        KozmosCardDescription(self.description)
                    }
                    KozmosCardContent {
                        Text(self.bodyText)
                    }
                }
            )
        }
    }
}

struct KozmosCardFullConnect: FigmaConnect {
    let component = KozmosCard<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=87-2536"
    var variant = ["Content": "Full"]

    @FigmaString("Title Text")
    var title: String = "Card title"

    @FigmaString("Description Text")
    var description: String = "Supporting description."

    @FigmaString("Body Text")
    var bodyText: String = "Use card body content for short supporting detail."

    var body: some View {
        KozmosCard {
            AnyView(
                VStack(alignment: .leading, spacing: 0) {
                    KozmosCardHeader {
                        KozmosCardTitle(self.title)
                        KozmosCardDescription(self.description)
                    }
                    KozmosCardContent {
                        Text(self.bodyText)
                    }
                    KozmosCardFooter {
                        KozmosButton("Cancel", variant: .outline, action: {})
                        KozmosButton("Save", action: {})
                    }
                }
            )
        }
    }
}
