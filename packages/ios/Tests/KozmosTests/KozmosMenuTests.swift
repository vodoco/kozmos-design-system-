import XCTest
@testable import Kozmos

final class KozmosMenuTests: XCTestCase {
    func testLegacyInitializerMapsStringItemsToBasicContent() {
        let menu = KozmosMenu(title: "Actions", items: ["Rename", "Duplicate"], onSelect: { _ in })

        XCTAssertEqual(menu.title, "Actions")
        XCTAssertEqual(menu.content.contentType, .basic)
        XCTAssertNil(menu.content.label)
        XCTAssertEqual(menu.content.items.map(\.text), ["Rename", "Duplicate"])
    }

    func testStructuredContentCanRepresentSubmenu() {
        let content = KozmosMenuContent(
            label: "Workspace",
            items: [
                KozmosMenuItem(text: "Members"),
                KozmosMenuItem(text: "Share", submenuItems: ["Invite people", "Export"])
            ],
            contentType: .submenu
        )
        let menu = KozmosMenu(title: "Workspace", content: content)

        XCTAssertEqual(menu.content.label, "Workspace")
        XCTAssertEqual(menu.content.contentType, .submenu)
        XCTAssertEqual(menu.content.items[1].submenuItems, ["Invite people", "Export"])
    }
}
