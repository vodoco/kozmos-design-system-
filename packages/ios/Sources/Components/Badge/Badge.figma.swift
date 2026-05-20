import SwiftUI
import Figma

struct KozmosBadgeConnect: FigmaConnect {
    let component = KozmosBadge.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=78-246"

    @FigmaString("Label Text")
    var label: String = "Badge"

    @FigmaEnum(
        "Variant",
        mapping: [
            "Default": KozmosBadge.KozmosBadgeVariant.`default`,
            "Destructive": KozmosBadge.KozmosBadgeVariant.destructive,
            "Outline": KozmosBadge.KozmosBadgeVariant.outline,
            "Secondary": KozmosBadge.KozmosBadgeVariant.secondary,
            "Ghost": KozmosBadge.KozmosBadgeVariant.ghost,
            "Link": KozmosBadge.KozmosBadgeVariant.link
        ]
    )
    var badgeVariant: KozmosBadge.KozmosBadgeVariant = .default

    @FigmaEnum(
        "Size",
        mapping: [
            "Default": KozmosBadge.KozmosBadgeSize.`default`,
            "Small": KozmosBadge.KozmosBadgeSize.sm,
            "Large": KozmosBadge.KozmosBadgeSize.lg,
            "Icon": KozmosBadge.KozmosBadgeSize.icon
        ]
    )
    var size: KozmosBadge.KozmosBadgeSize = .default

    @FigmaBoolean("Show Counter")
    var showCounter: Bool = false

    var body: some View {
        KozmosBadge(
            self.label,
            variant: self.badgeVariant,
            size: self.size,
            counter: "12",
            showCounter: self.showCounter
        )
    }
}
