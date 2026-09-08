import XCTest
import SwiftUI
@testable import Kozmos

/// Property assertions on the FloorSelector's API.
///
/// The component used to take `[String]` only, which forced a venue to make its
/// canonical floor IDs double as the visible labels. These cover the
/// presentation-based API and the stepper's handling of closed levels.
final class KozmosFloorSelectorTests: XCTestCase {
    private let levels = [
        KozmosFloorPresentation(id: "level-3", label: "Level 3", shortLabel: "L3"),
        KozmosFloorPresentation(id: "level-2", label: "Level 2", shortLabel: "L2", disabled: true),
        KozmosFloorPresentation(id: "level-1", label: "Level 1", shortLabel: "L1"),
        KozmosFloorPresentation(id: "basement-1", label: "Basement 1", shortLabel: "B1")
    ]

    func testPresentationInitKeepsIdSeparateFromLabel() {
        let view = KozmosFloorSelector(floors: levels, selectedFloor: .constant("level-1"))

        XCTAssertEqual(view.floors.map(\.id), ["level-3", "level-2", "level-1", "basement-1"])
        XCTAssertEqual(view.floors.map(\.shortLabel), ["L3", "L2", "L1", "B1"])
        XCTAssertEqual(view.selectedFloor, "level-1")
        XCTAssertEqual(view.variant, .verticalList)
    }

    /// The string API is for venues whose IDs already read as labels, so each
    /// entry stands in for all three fields.
    func testStringInitMirrorsIdIntoBothLabels() {
        let view = KozmosFloorSelector(floors: ["L2", "L1", "G"], selectedFloor: .constant("L1"))

        XCTAssertEqual(view.floors.map(\.id), ["L2", "L1", "G"])
        XCTAssertEqual(view.floors.map(\.label), ["L2", "L1", "G"])
        XCTAssertEqual(view.floors.map(\.shortLabel), ["L2", "L1", "G"])
        XCTAssertFalse(view.floors.contains { $0.disabled })
    }

    func testSelectedIndexTracksTheCanonicalId() {
        let view = KozmosFloorSelector(floors: levels, selectedFloor: .constant("basement-1"))
        XCTAssertEqual(view.selectedIndex, 3)
    }

    func testUnknownSelectionFallsBackToTheFirstFloor() {
        let view = KozmosFloorSelector(floors: levels, selectedFloor: .constant("mezzanine"))
        XCTAssertEqual(view.selectedIndex, 0)
    }

    /// Level 2 is closed, so stepping down from Level 3 lands on Level 1.
    func testStepperSkipsDisabledFloors() {
        let view = KozmosFloorSelector(
            floors: levels,
            selectedFloor: .constant("level-3"),
            variant: .compactStepper
        )
        XCTAssertEqual(view.reachableIndex(step: 1), 2)
    }

    func testStepperStopsAtTheEndsOfTheList() {
        let top = KozmosFloorSelector(floors: levels, selectedFloor: .constant("level-3"))
        XCTAssertNil(top.reachableIndex(step: -1))

        let bottom = KozmosFloorSelector(floors: levels, selectedFloor: .constant("basement-1"))
        XCTAssertNil(bottom.reachableIndex(step: 1))
    }

    func testStepperReturnsNilWhenEveryRemainingFloorIsDisabled() {
        let view = KozmosFloorSelector(
            floors: [
                KozmosFloorPresentation(id: "level-1", label: "Level 1", shortLabel: "L1"),
                KozmosFloorPresentation(id: "basement-1", label: "Basement 1", shortLabel: "B1", disabled: true)
            ],
            selectedFloor: .constant("level-1")
        )
        XCTAssertNil(view.reachableIndex(step: 1))
    }

    func testEmptyFloorListHasNothingToStepTo() {
        let view = KozmosFloorSelector(floors: [KozmosFloorPresentation](), selectedFloor: .constant("level-1"))
        XCTAssertNil(view.reachableIndex(step: 1))
        XCTAssertNil(view.reachableIndex(step: -1))
    }
}
