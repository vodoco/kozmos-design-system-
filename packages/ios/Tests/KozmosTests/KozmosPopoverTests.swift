import SwiftUI
import XCTest
@testable import Kozmos

final class KozmosPopoverTests: XCTestCase {
    func testGenericInitializerPreservesCustomContentContract() {
        let modifier = KozmosPopover(isPresented: .constant(true), side: .right) {
            Text("Custom popover content")
        }

        XCTAssertEqual(modifier.side, .right)
        XCTAssertNil(modifier.title)
        XCTAssertNil(modifier.description)
    }

    func testStructuredInitializerMapsPopoverAnatomy() {
        let modifier: KozmosPopover<EmptyView> = KozmosPopover(
            isPresented: .constant(true),
            side: .bottom,
            title: "Transit filters",
            description: "Choose which route details are visible."
        )

        XCTAssertEqual(modifier.side, .bottom)
        XCTAssertEqual(modifier.title, "Transit filters")
        XCTAssertEqual(modifier.description, "Choose which route details are visible.")
    }
}
