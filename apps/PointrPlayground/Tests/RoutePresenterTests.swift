import CoreLocation
import XCTest
import Kozmos
@testable import KozmosPointrQA

/// The route values the SDK returns, onto the Kozmos routing contracts.
final class RoutePresenterTests: XCTestCase {
    private func step(_ id: Int, type: Int, distance: Double = 20, duration: Double = 15,
                      transition: Bool = false, accessible: Bool? = nil, floor: String = "b:1") -> SDKRoute.Step {
        SDKRoute.Step(id: id, message: "Step \(id)", messageType: type, distanceMetres: distance, durationSeconds: duration,
                      isTransition: transition, transitionIsAccessible: accessible, floorId: floor,
                      coordinate: CLLocationCoordinate2D(latitude: 42.36 + Double(id) * 0.0001, longitude: -71.02))
    }

    private var withStairs: SDKRoute {
        SDKRoute(distanceMetres: 250, durationSeconds: 200, steps: [
            step(0, type: 16), step(1, type: 3), step(2, type: 9, distance: 0, duration: 30, transition: true, accessible: false, floor: "b:0"),
            step(3, type: 4, floor: "b:0"), step(4, type: 13, floor: "b:0"),
        ])
    }

    private var stepFree: SDKRoute {
        SDKRoute(distanceMetres: 310, durationSeconds: 260, steps: [
            step(0, type: 16), step(1, type: 10, distance: 0, duration: 60, transition: true, accessible: true, floor: "b:0"),
            step(2, type: 18, floor: "b:0"),
        ])
    }

    func testTheSDKsMessageTypesMapOntoTheFourArrows() {
        let expectations: [(Int, DirectionType)] = [
            (0, .straight), (1, .straight), (16, .straight), (17, .straight), (5, .straight),
            (3, .left), (6, .left), (4, .right), (7, .right),
            (2, .destination), (13, .destination), (14, .destination), (18, .destination),
            (22, .destination), (23, .destination), (24, .destination), (25, .destination), (26, .destination),
            (8, .straight), (9, .straight), (10, .straight), (11, .straight), (27, .straight), (-1, .straight),
        ]
        for (type, arrow) in expectations {
            XCTAssertEqual(SDKRoutePresenter.directionType(forMessageType: type), arrow, "message type \(type)")
        }
    }

    func testAStepThatCoversNoGroundShowsNoDistance() {
        XCTAssertNil(SDKRoutePresenter.distanceLabel(for: step(0, type: 9, distance: 0)))
        XCTAssertNil(SDKRoutePresenter.distanceLabel(for: step(0, type: 9, distance: 0.6)))
        XCTAssertEqual(SDKRoutePresenter.distanceLabel(for: step(0, type: 16, distance: 12.4)), "12 m")
    }

    func testWhatRemainsIsSummedFromTheCurrentStep() {
        let remaining = withStairs.remaining(from: 2)
        XCTAssertEqual(remaining.distanceMetres, 40, accuracy: 0.001)
        XCTAssertEqual(remaining.durationSeconds, 60, accuracy: 0.001)
        XCTAssertEqual(withStairs.remaining(from: 0).distanceMetres, 80, accuracy: 0.001)
        XCTAssertEqual(withStairs.remaining(from: 99).distanceMetres, 0, accuracy: 0.001)
    }

    func testTheFormatsMatchTheFixturePlayground() {
        XCTAssertEqual(RouteFormat.distance(999.4), "999 m")
        XCTAssertEqual(RouteFormat.distance(1000), "1.0 km")
        XCTAssertEqual(RouteFormat.distance(1234), "1.2 km")
        XCTAssertEqual(RouteFormat.duration(0), "1 min")
        XCTAssertEqual(RouteFormat.duration(60), "1 min")
        XCTAssertEqual(RouteFormat.duration(61), "2 min")
        XCTAssertEqual(RouteFormat.duration(200), "4 min")
        let now = Date(timeIntervalSince1970: 1_700_000_000)
        XCTAssertNotEqual(RouteFormat.arrival(in: 3600, from: now), RouteFormat.arrival(in: 0, from: now))
    }

    /// Not ready is the SDK's and passes; no route is the venue's.
    func testTheNotReadyStateOffersARetryAndNoRouteAnotherStartingPoint() {
        XCTAssertEqual(SDKRoutePresenter.recovery(for: .error), .tryAgain)
        XCTAssertEqual(SDKRoutePresenter.recovery(for: .noRoute), .chooseAnotherOrigin)
        XCTAssertNil(SDKRoutePresenter.recovery(for: .calculating))
        XCTAssertNil(SDKRoutePresenter.recovery(for: .ready))
        XCTAssertNil(SDKRoutePresenter.recovery(for: .idle))
    }

    /// Readiness arriving repeats the request only while the not-ready message shows in the picker.
    func testReadinessRetriesOnlyTheNotReadyPicker() {
        XCTAssertTrue(SDKRoutePresenter.retriesOnReadiness(phase: .routeSetup, status: .error))
        XCTAssertFalse(SDKRoutePresenter.retriesOnReadiness(phase: .routeSetup, status: .noRoute))
        XCTAssertFalse(SDKRoutePresenter.retriesOnReadiness(phase: .routeSetup, status: .calculating))
        XCTAssertFalse(SDKRoutePresenter.retriesOnReadiness(phase: .browse, status: .error))
        XCTAssertFalse(SDKRoutePresenter.retriesOnReadiness(phase: .directions, status: .error))
    }

    func testUsesInaccessibleTransitionsReadsTheSDKsFlag() {
        XCTAssertTrue(withStairs.usesInaccessibleTransitions)
        XCTAssertFalse(stepFree.usesInaccessibleTransitions)
        let unknown = SDKRoute(distanceMetres: 10, durationSeconds: 10, steps: [step(0, type: 27, transition: true, accessible: nil)])
        XCTAssertFalse(unknown.usesInaccessibleTransitions, "a transition the SDK says nothing about is not called stairs")
    }
}
