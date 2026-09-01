import SwiftUI
import Figma

struct KozmosBottomNavigationConnect: FigmaConnect {
    let component = KozmosBottomNavigation.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=728-6447"

    @FigmaEnum(
        "Count",
        mapping: [
            "Three": 3,
            "Four": 4,
            "Five": 5
        ]
    )
    var count: Int = 3

    @FigmaEnum(
        "Active",
        mapping: [
            "One": 0,
            "Two": 1,
            "Three": 2,
            "Four": 3,
            "Five": 4
        ]
    )
    var activeIndex: Int = 0

    @FigmaString("Item 1 Text")
    var item1Label: String = "Home"

    @FigmaString("Item 2 Text")
    var item2Label: String = "Search"

    @FigmaString("Item 3 Text")
    var item3Label: String = "Routes"

    @FigmaString("Item 4 Text")
    var item4Label: String = "Alerts"

    @FigmaString("Item 5 Text")
    var item5Label: String = "More"

    var body: some View {
        let allItems = [
            (icon: "house", title: self.item1Label),
            (icon: "magnifyingglass", title: self.item2Label),
            (icon: "point.topleft.down.curvedto.point.bottomright.up", title: self.item3Label),
            (icon: "bell", title: self.item4Label),
            (icon: "ellipsis", title: self.item5Label)
        ]

        KozmosBottomNavigation(
            selection: .constant(self.activeIndex),
            items: Array(allItems.prefix(self.count))
        )
    }
}
