import CoreLocation
import Foundation
import PointrKit
import Kozmos

/// A route as plain values, so everything below the SDK call is testable
/// without a `PTRRoute`. Distances are metres and times seconds, as
/// PointrKit's reference states for `walkingDistance` and `travelTime`.
struct SDKRoute: Equatable {
    struct Step: Equatable, Identifiable {
        let id: Int
        /// The SDK's own instruction text, already worded.
        let message: String
        /// `PTRDirectionMessageType`'s raw value.
        let messageType: Int
        let distanceMetres: Double
        let durationSeconds: Double
        let isTransition: Bool
        /// For a transition: whether it is step-free, as the SDK knows it.
        let transitionIsAccessible: Bool?
        /// For a transition: the taxonomy's subtype — elevator, escalator,
        /// stairs, ramp, moving-walkway… — as the SDK carries it.
        let transitionSubType: String?
        let floorId: String
        let coordinate: CLLocationCoordinate2D

        static func == (lhs: Step, rhs: Step) -> Bool {
            lhs.id == rhs.id && lhs.message == rhs.message && lhs.messageType == rhs.messageType
                && lhs.distanceMetres == rhs.distanceMetres && lhs.durationSeconds == rhs.durationSeconds
                && lhs.isTransition == rhs.isTransition && lhs.transitionIsAccessible == rhs.transitionIsAccessible
                && lhs.transitionSubType == rhs.transitionSubType
                && lhs.floorId == rhs.floorId && lhs.coordinate.latitude == rhs.coordinate.latitude
                && lhs.coordinate.longitude == rhs.coordinate.longitude
        }
    }

    let distanceMetres: Double
    let durationSeconds: Double
    let steps: [Step]
    /// Every position along the route, for framing the map.
    let coordinates: [CLLocationCoordinate2D]

    static func == (lhs: SDKRoute, rhs: SDKRoute) -> Bool {
        lhs.distanceMetres == rhs.distanceMetres && lhs.durationSeconds == rhs.durationSeconds && lhs.steps == rhs.steps
            && lhs.coordinates.count == rhs.coordinates.count
    }

    init(distanceMetres: Double, durationSeconds: Double, steps: [Step], coordinates: [CLLocationCoordinate2D] = []) {
        self.distanceMetres = distanceMetres
        self.durationSeconds = durationSeconds
        self.steps = steps
        self.coordinates = coordinates
    }

    init(_ route: PTRRoute) {
        self.init(
            distanceMetres: Double(route.walkingDistance),
            durationSeconds: Double(route.travelTime),
            steps: route.directions.enumerated().map { index, direction in
                Step(id: index, message: direction.message, messageType: direction.messageType.rawValue,
                     distanceMetres: Double(direction.distance), durationSeconds: Double(direction.duration),
                     isTransition: direction.isTransition,
                     transitionIsAccessible: direction.transitionInfo?.isAccessible,
                     transitionSubType: direction.transitionInfo?.subType,
                     floorId: SDKPOIAdapter.floorId(direction.position.level),
                     coordinate: direction.position.coordinate)
            },
            coordinates: route.nodes.map(\.position.coordinate))
    }

    /// Whether any transition on the route is one the SDK does not call step-free.
    var usesInaccessibleTransitions: Bool {
        steps.contains { $0.isTransition && $0.transitionIsAccessible == false }
    }

    /// What is left from a step onwards, for the directions header.
    func remaining(from stepIndex: Int) -> (distanceMetres: Double, durationSeconds: Double) {
        let rest = steps.dropFirst(max(stepIndex, 0))
        return (rest.reduce(0) { $0 + $1.distanceMetres }, rest.reduce(0) { $0 + $1.durationSeconds })
    }
}

/// The words the routing surfaces use for the route's numbers. The same rules
/// as the fixture playground's, so the two apps read alike.
enum RouteFormat {
    static func distance(_ metres: Double) -> String {
        metres >= 1000 ? String(format: "%.1f km", metres / 1000) : "\(Int(metres.rounded())) m"
    }

    static func duration(_ seconds: Double) -> String {
        let minutes = Int((seconds / 60).rounded(.up))
        return minutes <= 1 ? "1 min" : "\(minutes) min"
    }

    private static let clock: DateFormatter = {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        formatter.dateStyle = .none
        return formatter
    }()

    static func arrival(in seconds: Double, from now: Date = Date()) -> String {
        clock.string(from: now.addingTimeInterval(seconds))
    }
}

/// Route values onto the Kozmos routing contracts. Product policy lives here:
/// how a step's arrow is chosen, what a failure offers. There are no
/// wayfinding modes yet, so no options: one route, and its directions.
enum SDKRoutePresenter {
    /// `PTRDirectionMessageType` and, for a transition, the taxonomy's
    /// subtype, onto the design system's directions. A level change names
    /// its means when the SDK does — lift, escalator, stairs — and shows the
    /// direction of travel otherwise; an inter-building or same-level
    /// transition is a transition; turning back is its own arrow.
    static func directionType(forMessageType messageType: Int, transitionSubType: String? = nil) -> DirectionType {
        switch messageType {
        case 3, 6: return .left            // turn left, slightly left
        case 4, 7: return .right           // turn right, slightly right
        case 5: return .turnBack
        case 2, 13, 14, 18, 22, 23, 24, 25, 26: return .destination
        case 8, 11, 12: return .transition // same level, inter-building, virtual inter-building
        case 9: return levelChange(transitionSubType, up: false)
        case 10: return levelChange(transitionSubType, up: true)
        default: return .straight
        }
    }

    /// The taxonomy's transition subtypes, as `search_taxonomy` lists them:
    /// elevator and wheelchair-lift are lifts; escalator is an escalator;
    /// stairs, staircase and interior-step are stairs; the rest — ramp,
    /// moving-walkway, raise-… — show the direction alone.
    static func levelChange(_ subType: String?, up: Bool) -> DirectionType {
        switch subType?.lowercased() {
        case "elevator", "wheelchair-lift": return up ? .liftUp : .liftDown
        case "escalator": return up ? .escalatorUp : .escalatorDown
        case "stairs", "staircase", "interior-step": return up ? .stairsUp : .stairsDown
        default: return up ? .levelUp : .levelDown
        }
    }

    /// A step that covers no ground — a lift, a level change — shows no distance.
    static func distanceLabel(for step: SDKRoute.Step) -> String? {
        step.distanceMetres >= 1 ? RouteFormat.distance(step.distanceMetres) : nil
    }

    /// What the picker offers when a calculation produced no route.
    enum Recovery: Equatable {
        case tryAgain
        case chooseAnotherOrigin
    }

    /// Not ready is the SDK's and passes — measured on Design-QA, the site's
    /// wayfinding data was ready 239 ms after the building loaded — so the same
    /// request is worth repeating. No route is the venue's: another starting
    /// point is the only way on.
    static func recovery(for status: KozmosRouteReadiness) -> Recovery? {
        switch status {
        case .error: return .tryAgain
        case .noRoute: return .chooseAnotherOrigin
        case .idle, .calculating, .ready: return nil
        }
    }

    /// Whether readiness arriving repeats the request by itself: only while
    /// the visitor is looking at the not-ready message in the picker.
    static func retriesOnReadiness(phase: SDKSession.Phase, status: KozmosRouteReadiness) -> Bool {
        phase == .routeSetup && status == .error
    }
}
