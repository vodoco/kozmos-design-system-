import XCTest
import SwiftUI
@testable import Kozmos

final class BoxTests: XCTestCase {
    func testBoxRender() {
        let view = Box { Text("Hello") }
        XCTAssertNotNil(view)
    }
}
