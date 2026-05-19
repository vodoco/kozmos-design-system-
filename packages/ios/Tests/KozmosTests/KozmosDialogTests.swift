import SwiftUI
import XCTest
@testable import Kozmos

final class KozmosDialogTests: XCTestCase {
    func testGenericInitializerPreservesCustomContentContract() {
        let view = KozmosDialog(isPresented: .constant(true)) {
            Text("Custom payload")
        }

        XCTAssertNil(view.title)
        XCTAssertNil(view.description)
        XCTAssertNil(view.bodyText)
        XCTAssertTrue(view.showsCloseButton)
        XCTAssertNil(view.primaryActionTitle)
        XCTAssertNil(view.secondaryActionTitle)
    }

    func testStructuredInitializerMapsDialogAnatomy() {
        let view: KozmosDialog<EmptyView> = KozmosDialog(
            isPresented: .constant(true),
            title: "Edit profile",
            description: "Make changes to your profile here.",
            bodyText: "Use dialog body content for a short task, form, or confirmation.",
            primaryActionTitle: "Save changes",
            secondaryActionTitle: "Cancel",
            showsCloseButton: false,
            onPrimaryAction: {},
            onSecondaryAction: {}
        )

        XCTAssertEqual(view.title, "Edit profile")
        XCTAssertEqual(view.description, "Make changes to your profile here.")
        XCTAssertEqual(view.bodyText, "Use dialog body content for a short task, form, or confirmation.")
        XCTAssertEqual(view.primaryActionTitle, "Save changes")
        XCTAssertEqual(view.secondaryActionTitle, "Cancel")
        XCTAssertFalse(view.showsCloseButton)
        XCTAssertNotNil(view.onPrimaryAction)
        XCTAssertNotNil(view.onSecondaryAction)
    }
}
