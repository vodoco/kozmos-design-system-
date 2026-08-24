import XCTest
@testable import Kozmos

/// These derivations are duplicated across React, SwiftUI, and Compose. They are
/// the pieces most likely to drift silently, so they are asserted directly
/// rather than only exercised through a view.
final class ProductContractsTests: XCTestCase {
    private func makePOI(
        name: String = "Gate 42",
        floorLabel: String = "Level 2",
        buildingLabel: String? = "Terminal B"
    ) -> KozmosPOIPresentation {
        KozmosPOIPresentation(
            id: "poi-1",
            name: name,
            floorId: "floor-2",
            floorLabel: floorLabel,
            buildingLabel: buildingLabel
        )
    }

    // MARK: - locationLabel

    func testLocationLabelJoinsFloorAndBuilding() {
        XCTAssertEqual(makePOI().locationLabel, "Level 2 · Terminal B")
    }

    func testLocationLabelOmitsMissingBuilding() {
        XCTAssertEqual(makePOI(buildingLabel: nil).locationLabel, "Level 2")
    }

    func testLocationLabelOmitsEmptyBuilding() {
        XCTAssertEqual(makePOI(buildingLabel: "").locationLabel, "Level 2")
    }

    // MARK: - logoFallbackInitial

    func testLogoFallbackInitialIsUppercasedFirstCharacter() {
        XCTAssertEqual(makePOI(name: "boots").logoFallbackInitial, "B")
    }

    func testLogoFallbackInitialHandlesEmptyName() {
        XCTAssertEqual(makePOI(name: "").logoFallbackInitial, "")
    }

    func testLogoFallbackInitialHandlesNonLatinName() {
        XCTAssertEqual(makePOI(name: "İstanbul").logoFallbackInitial, "İ")
    }

    // MARK: - isAvailable

    private func makeResult(available: Bool?) -> KozmosPOIResultPresentation {
        KozmosPOIResultPresentation(
            poiId: "poi-1",
            resultIndex: 1,
            floorId: "floor-2",
            available: available
        )
    }

    func testOnlyExplicitFalseMarksResultUnavailable() {
        XCTAssertTrue(makeResult(available: nil).isAvailable)
        XCTAssertTrue(makeResult(available: true).isAvailable)
        XCTAssertFalse(makeResult(available: false).isAvailable)
    }

    // MARK: - selecting

    func testSelectingDerivesSelectionFromCanonicalId() {
        let result = KozmosPOIResultPresentation(
            poiId: "poi-1",
            resultIndex: 1,
            selected: false,
            floorId: "floor-2"
        )

        XCTAssertTrue(result.selecting("poi-1").selected)
        XCTAssertFalse(result.selecting("poi-2").selected)
    }

    func testSelectingWithNilPreservesExistingFlag() {
        let selected = KozmosPOIResultPresentation(
            poiId: "poi-1",
            resultIndex: 1,
            selected: true,
            floorId: "floor-2"
        )

        XCTAssertTrue(selected.selecting(nil).selected)
    }

    func testSelectingPreservesEveryOtherField() {
        let estimate = KozmosTravelEstimatePresentation(
            durationSeconds: 120,
            durationLabel: "2 min"
        )
        let result = KozmosPOIResultPresentation(
            poiId: "poi-1",
            resultIndex: 3,
            selected: false,
            featured: true,
            floorId: "floor-2",
            travelEstimate: estimate,
            available: false,
            unavailableReason: "Closed for maintenance"
        )

        let reselected = result.selecting("poi-1")

        XCTAssertEqual(reselected.resultIndex, 3)
        XCTAssertTrue(reselected.featured)
        XCTAssertEqual(reselected.floorId, "floor-2")
        XCTAssertEqual(reselected.travelEstimate, estimate)
        XCTAssertEqual(reselected.available, false)
        XCTAssertEqual(reselected.unavailableReason, "Closed for maintenance")
    }

    // MARK: - Identifier parity with the web

    func testResultIdentifierMatchesEncodeURIComponent() {
        XCTAssertEqual(kozmosPOIResultIdentifier("poi-1"), "poi-result-poi-1")
        XCTAssertEqual(kozmosPOIResultIdentifier("a b"), "poi-result-a%20b")
        XCTAssertEqual(kozmosPOIResultIdentifier("a/b"), "poi-result-a%2Fb")
        XCTAssertEqual(kozmosPOIResultIdentifier("café"), "poi-result-caf%C3%A9")
    }

    func testResultIdentifierLeavesUnreservedCharactersIntact() {
        XCTAssertEqual(
            kozmosPOIResultIdentifier("-_.!~*'()"),
            "poi-result--_.!~*'()"
        )
    }

    // MARK: - Raw values shared with the other platforms

    func testHyphenatedEnumRawValuesMatchTheSharedContract() {
        XCTAssertEqual(KozmosRoutePreference.stepFree.rawValue, "step-free")
        XCTAssertEqual(KozmosRouteReadiness.noRoute.rawValue, "no-route")
        XCTAssertEqual(KozmosUserLocationState.permissionDenied.rawValue, "permission-denied")
    }
}
