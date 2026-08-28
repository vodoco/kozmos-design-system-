import SwiftUI
import Figma

struct KozmosFloorSelectorConnect: FigmaConnect {
    let component = KozmosFloorSelector.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6786"

    @FigmaString("Selected Floor Text")
    var selectedFloor: String = "L1"

    @FigmaEnum(
        "Variant",
        mapping: [
            "VerticalList": KozmosFloorSelectorVariant.verticalList,
            "HorizontalList": KozmosFloorSelectorVariant.horizontalList,
            "CompactStepper": KozmosFloorSelectorVariant.compactStepper
        ]
    )
    var floorSelectorVariant: KozmosFloorSelectorVariant = .verticalList

    // floors carries the canonical level IDs and their ordering, which the
    // Figma set shows as three examples but cannot express.
    var body: some View {
        KozmosFloorSelector(
            floors: ["L2", "L1", "G"],
            selectedFloor: .constant(self.selectedFloor),
            variant: self.floorSelectorVariant
        )
    }
}
