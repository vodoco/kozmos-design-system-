import XCTest
import SwiftUI
@testable import Kozmos

/// What VoiceOver gets from the routing parts: one element per step, the
/// instruction first, the arrow silent; the summary's icon silent too.
final class KozmosDirectionStepTests: XCTestCase {
    func testAStepReadsAsInstructionThenDistanceThenDuration() {
        XCTAssertEqual(
            KozmosDirectionStep.accessibilityDescription(
                instruction: "Take Elevator down to First Floor", distance: "58 m", duration: "Second Floor"),
            "Take Elevator down to First Floor, 58 m, Second Floor")
    }

    func testAbsentAndEmptyPartsAreNotRead() {
        XCTAssertEqual(KozmosDirectionStep.accessibilityDescription(instruction: "Destination", distance: nil, duration: nil),
                       "Destination")
        XCTAssertEqual(KozmosDirectionStep.accessibilityDescription(instruction: "Turn Left", distance: "", duration: "First Floor"),
                       "Turn Left, First Floor")
    }


    #if os(iOS)
    /// Every direction has a glyph the platform can draw: rendered in the
    /// theme colour, each one leaves theme pixels behind.
    @MainActor func testEveryDirectionDrawsAnArrow() async throws {
        for type in DirectionType.allCases {
            let view = KozmosDirectionStep(type: type, instruction: "Go").padding(8).background(Color.white)
            let pixels = try await RenderedPixels.render(view, size: CGSize(width: 240, height: 80))
            XCTAssertNotNil(pixels.boundingBox(in: CGRect(x: 0, y: 0, width: 80, height: 80), where: RenderedPixels.isTheme),
                            "\(type) draws no arrow: no such symbol")
        }
    }
    #endif
}

