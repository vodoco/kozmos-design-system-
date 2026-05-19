import XCTest
import SwiftUI
@testable import Kozmos

final class KozmosButtonSnapshotTests: XCTestCase {
    func testButtonDefaultVariant() {
        let view = KozmosButton("Label Binding", action: {})
        
        XCTAssertEqual(view.label, "Label Binding")
        XCTAssertEqual(view.variant, .default)
        XCTAssertEqual(view.size, .default)
        XCTAssertFalse(view.isDisabled)
        XCTAssertFalse(view.isLoading)
    }

    func testButtonDestructiveVariant() {
        let view = KozmosButton("Delete Item", variant: .destructive, action: {})
        XCTAssertEqual(view.label, "Delete Item")
        XCTAssertEqual(view.variant, .destructive)
    }

    func testButtonDisabledState() {
        let view = KozmosButton("Cannot Execute", isDisabled: true, action: {})
        XCTAssertTrue(view.isDisabled)
        XCTAssertFalse(view.isLoading)
    }

    func testButtonLoadingState() {
        let view = KozmosButton("Processing...", isLoading: true, action: {})
        XCTAssertFalse(view.isDisabled)
        XCTAssertTrue(view.isLoading)
    }
}
