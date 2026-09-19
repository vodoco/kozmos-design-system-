import XCTest
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

}
