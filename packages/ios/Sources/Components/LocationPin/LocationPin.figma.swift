import SwiftUI
import Figma

struct KozmosLocationPinConnect: FigmaConnect {
    let component = KozmosLocationPin.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6847"

    @FigmaString("Label Text")
    var label: String = "Cafe"

    @FigmaEnum(
        "Size",
        mapping: [
            "Sm": KozmosLocationPinSize.sm,
            "Md": KozmosLocationPinSize.md,
            "Lg": KozmosLocationPinSize.lg
        ]
    )
    var size: KozmosLocationPinSize = .md

    @FigmaEnum(
        "State",
        mapping: ["Default": false, "Selected": true, "Featured": false, "OffFloor": false, "Disabled": false]
    )
    var selected: Bool = false

    @FigmaEnum(
        "State",
        mapping: ["Default": false, "Selected": false, "Featured": true, "OffFloor": false, "Disabled": false]
    )
    var featured: Bool = false

    @FigmaEnum(
        "State",
        mapping: ["Default": false, "Selected": false, "Featured": false, "OffFloor": true, "Disabled": false]
    )
    var offFloor: Bool = false

    @FigmaEnum(
        "State",
        mapping: ["Default": false, "Selected": false, "Featured": false, "OffFloor": false, "Disabled": true]
    )
    var isDisabled: Bool = false

    // variant is a per-venue colour role and labelPlacement belongs to the map
    // renderer, so neither is a Figma variant axis.
    var body: some View {
        KozmosLocationPin(
            size: self.size,
            label: self.label,
            selected: self.selected,
            featured: self.featured,
            offFloor: self.offFloor,
            isDisabled: self.isDisabled
        )
    }
}
