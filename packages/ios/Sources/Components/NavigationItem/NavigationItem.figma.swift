import SwiftUI
import Figma

struct KozmosNavigationItemConnect: FigmaConnect {
    let component = KozmosNavigationItem.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=861-7297"

    @FigmaString("Label Text")
    var label: String = "Overview"

    @FigmaEnum(
        "Placement",
        mapping: [
            "Top": KozmosNavigationItemPlacement.top,
            "Side": KozmosNavigationItemPlacement.side,
            "Rail": KozmosNavigationItemPlacement.rail
        ]
    )
    var placement: KozmosNavigationItemPlacement = .side

    @FigmaEnum(
        "Density",
        mapping: [
            "Default": KozmosNavigationItemDensity.default,
            "Compact": KozmosNavigationItemDensity.compact
        ]
    )
    var density: KozmosNavigationItemDensity = .default

    @FigmaEnum(
        "Content",
        mapping: [
            "Label": KozmosNavigationItemContent.label,
            "Icon Label": KozmosNavigationItemContent.iconLabel,
            "Icon Only": KozmosNavigationItemContent.iconOnly,
            "Badge": KozmosNavigationItemContent.badge,
            "Trailing": KozmosNavigationItemContent.trailing
        ]
    )
    var content: KozmosNavigationItemContent = .label

    @FigmaEnum(
        "State",
        mapping: [
            "Default": KozmosNavigationItemState.default,
            "Hover": KozmosNavigationItemState.hover,
            "Selected": KozmosNavigationItemState.selected,
            "Focus": KozmosNavigationItemState.focus,
            "Disabled": KozmosNavigationItemState.disabled
        ]
    )
    var state: KozmosNavigationItemState = .default

    @FigmaBoolean("Focus Visible")
    var focusVisible: Bool = false

    var body: some View {
        switch self.content {
        case .label:
            KozmosNavigationItem(
                label: self.label,
                placement: self.placement,
                density: self.density,
                content: .label,
                state: self.state,
                selected: self.state == .selected,
                disabled: self.state == .disabled,
                focusVisible: self.focusVisible
            )
        case .iconOnly:
            KozmosNavigationItem(
                label: nil,
                placement: self.placement,
                density: self.density,
                content: .iconOnly,
                state: self.state,
                selected: self.state == .selected,
                disabled: self.state == .disabled,
                focusVisible: self.focusVisible
            ) {
                Image(systemName: "house")
            }
        case .badge:
            KozmosNavigationItem(
                label: self.label,
                placement: self.placement,
                density: self.density,
                state: self.state,
                selected: self.state == .selected,
                disabled: self.state == .disabled,
                focusVisible: self.focusVisible,
                icon: {
                    Image(systemName: "house")
                },
                badge: {
                    Text("3")
                }
            )
        case .trailing:
            KozmosNavigationItem(
                label: self.label,
                placement: self.placement,
                density: self.density,
                state: self.state,
                selected: self.state == .selected,
                disabled: self.state == .disabled,
                focusVisible: self.focusVisible,
                icon: {
                    Image(systemName: "gearshape")
                },
                trailing: {
                    Image(systemName: "chevron.right")
                }
            )
        case .iconLabel:
            KozmosNavigationItem(
                label: self.label,
                placement: self.placement,
                density: self.density,
                content: .iconLabel,
                state: self.state,
                selected: self.state == .selected,
                disabled: self.state == .disabled,
                focusVisible: self.focusVisible
            ) {
                Image(systemName: "house")
            }
        }
    }
}
