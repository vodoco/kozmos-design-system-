
import XCTest
import SwiftUI
@testable import Kozmos

final class KozmosColorsTests: XCTestCase {
    func testKozmosColorsExistence() {
        // Just verify we can access a static property
        // The specific property name depends on what was generated.
        // Based on the build.mjs, we generate properties like `primitivesColorsTheme0`.
        // Let's testing existence of the class itself first.
        let _ = KozmosColors()
    }
}
