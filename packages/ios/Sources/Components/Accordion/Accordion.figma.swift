import SwiftUI
import Figma

struct KozmosAccordionClosedConnect: FigmaConnect {
    let component = KozmosAccordion<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-977"
    var variant = ["State": "Closed"]

    @FigmaString("Trigger Text")
    var trigger: String = "What is Kozmos?"

    var body: some View {
        KozmosAccordion {
            AnyView(
                KozmosAccordionItem {
                    KozmosAccordionTrigger(
                        value: "item-1",
                        title: self.trigger,
                        selection: Binding<String?>.constant(nil)
                    )
                }
            )
        }
    }
}

struct KozmosAccordionOpenConnect: FigmaConnect {
    let component = KozmosAccordion<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-977"
    var variant = ["State": "Open"]

    @FigmaString("Trigger Text")
    var trigger: String = "What is Kozmos?"

    @FigmaString("Content Text")
    var content: String = "Kozmos provides shared design system primitives."

    var body: some View {
        KozmosAccordion {
            AnyView(
                KozmosAccordionItem {
                    VStack(spacing: 0) {
                        KozmosAccordionTrigger(
                            value: "item-1",
                            title: self.trigger,
                            selection: Binding<String?>.constant("item-1")
                        )
                        KozmosAccordionContent(
                            value: "item-1",
                            selection: Binding<String?>.constant("item-1")
                        ) {
                            Text(self.content)
                        }
                    }
                }
            )
        }
    }
}
