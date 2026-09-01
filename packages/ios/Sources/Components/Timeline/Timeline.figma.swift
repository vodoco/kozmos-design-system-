import SwiftUI
import Figma

struct KozmosTimelineConnect: FigmaConnect {
    let component = KozmosTimeline<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=660-4393"

    @FigmaEnum(
        "Content",
        mapping: [
            "Basic": "basic",
            "Detailed": "detailed"
        ]
    )
    var content: String = "detailed"

    @FigmaEnum(
        "Density",
        mapping: [
            "Default": KozmosTimelineDensity.default,
            "Compact": KozmosTimelineDensity.compact
        ]
    )
    var density: KozmosTimelineDensity = .default

    @FigmaString("Item 1 Time")
    var item1Time: String = "09:00"

    @FigmaString("Item 1 Title")
    var item1Title: String = "Created"

    @FigmaString("Item 1 Description")
    var item1Description: String = "Initial event captured."

    @FigmaString("Item 2 Time")
    var item2Time: String = "10:30"

    @FigmaString("Item 2 Title")
    var item2Title: String = "Reviewed"

    @FigmaString("Item 2 Description")
    var item2Description: String = "Status changed by the team."

    @FigmaString("Item 3 Time")
    var item3Time: String = "Now"

    @FigmaString("Item 3 Title")
    var item3Title: String = "Published"

    @FigmaString("Item 3 Description")
    var item3Description: String = "Latest update is ready."

    var body: some View {
        let isDetailed = self.content == "detailed"

        KozmosTimeline(density: self.density) {
            AnyView(
                Group {
                    KozmosTimelineItem {
                        if isDetailed {
                            KozmosTimelineTime(self.item1Time)
                        }
                        KozmosTimelineTitle(self.item1Title)
                        if isDetailed {
                            KozmosTimelineDescription(self.item1Description)
                        }
                    }
                    KozmosTimelineItem {
                        if isDetailed {
                            KozmosTimelineTime(self.item2Time)
                        }
                        KozmosTimelineTitle(self.item2Title)
                        if isDetailed {
                            KozmosTimelineDescription(self.item2Description)
                        }
                    }
                    KozmosTimelineItem(isLast: true) {
                        if isDetailed {
                            KozmosTimelineTime(self.item3Time)
                        }
                        KozmosTimelineTitle(self.item3Title)
                        if isDetailed {
                            KozmosTimelineDescription(self.item3Description)
                        }
                    }
                }
            )
        }
    }
}
