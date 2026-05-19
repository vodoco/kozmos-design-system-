import SwiftUI
import XCTest
@testable import Kozmos

final class KozmosToastTests: XCTestCase {
    func testMessageInitializerPreservesLegacyContract() {
        let view = KozmosToast(isPresented: .constant(true), message: "Scheduled: Catch up")

        XCTAssertEqual(view.title, "Scheduled: Catch up")
        XCTAssertNil(view.description)
        XCTAssertNil(view.actionTitle)
        XCTAssertTrue(view.showsCloseButton)
        XCTAssertEqual(view.autoDismissAfter, 3)
    }

    func testStructuredInitializerMapsToastAnatomy() {
        let view = KozmosToast(
            isPresented: .constant(true),
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
            actionTitle: "Undo",
            showsCloseButton: false,
            autoDismissAfter: nil,
            onAction: {}
        )

        XCTAssertEqual(view.title, "Scheduled: Catch up")
        XCTAssertEqual(view.description, "Friday, February 10, 2023 at 5:57 PM")
        XCTAssertEqual(view.actionTitle, "Undo")
        XCTAssertFalse(view.showsCloseButton)
        XCTAssertNil(view.autoDismissAfter)
        XCTAssertNotNil(view.onAction)
    }
}
