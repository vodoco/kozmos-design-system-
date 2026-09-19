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
        let floorId: String
        let coordinate: CLLocationCoordinate2D

        static func == (lhs: Step, rhs: Step) -> Bool {
            lhs.id == rhs.id && lhs.message == rhs.message && lhs.messageType == rhs.messageType
                && lhs.distanceMetres == rhs.distanceMetres && lhs.durationSeconds == rhs.durationSeconds
                && lhs.isTransition == rhs.isTransition && lhs.transitionIsAccessible == rhs.transitionIsAccessible
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
/// which option is which, what a warning says, how a step's arrow is chosen.
enum SDKRoutePresenter {
    enum OptionID {
        static let quickest = "quickest"
        static let stepFree = "step-free"
    }

    /// The two options the preview offers, from the two calculations. A
    /// calculation that found nothing is an option the visitor can see but
    /// not choose, with the reason on it.
    static func options(quickest: SDKRoute?, stepFree: SDKRoute?, selected: String) -> [KozmosRouteOptionPresentation] {
        [(OptionID.quickest, "Quickest", KozmosRoutePreference.quickest, quickest),
         (OptionID.stepFree, "Step-free", KozmosRoutePreference.stepFree, stepFree)].map { id, label, preference, route in
            guard let route else {
                return KozmosRouteOptionPresentation(
                    id: id, label: label, durationSeconds: 0, durationLabel: "—", distanceMetres: 0, distanceLabel: "—",
                    preference: preference, selected: false, available: false,
                    warning: preference == .stepFree ? "No step-free route was found" : "No route was found")
            }
            return KozmosRouteOptionPresentation(
                id: id, label: label,
                durationSeconds: route.durationSeconds, durationLabel: RouteFormat.duration(route.durationSeconds),
                distanceMetres: route.distanceMetres, distanceLabel: RouteFormat.distance(route.distanceMetres),
                preference: preference, selected: id == selected, available: true,
                warning: preference == .quickest && route.usesInaccessibleTransitions ? "Uses stairs or escalators" : nil)
        }
    }

    static func travelEstimate(_ route: SDKRoute) -> KozmosTravelEstimatePresentation {
        KozmosTravelEstimatePresentation(
            durationSeconds: route.durationSeconds, durationLabel: RouteFormat.duration(route.durationSeconds),
            distanceMetres: route.distanceMetres, distanceLabel: RouteFormat.distance(route.distanceMetres),
            mode: "walking", modeLabel: "Walking")
    }

    /// `PTRDirectionMessageType` onto the design system's four arrows. The
    /// system has no arrow for a transition — stairs, a lift, an escalator, a
    /// building change — or for turning back; those keep the SDK's own words
    /// under a straight arrow. A gap for the design system, recorded, not
    /// papered over with a symbol of the host's own.
    static func directionType(forMessageType messageType: Int) -> DirectionType {
        switch messageType {
        case 3, 6: return .left            // turn left, slightly left
        case 4, 7: return .right           // turn right, slightly right
        case 2, 13, 14, 18, 22, 23, 24, 25, 26: return .destination
        default: return .straight
        }
    }

    /// A step that covers no ground — a lift, a level change — shows no distance.
    static func distanceLabel(for step: SDKRoute.Step) -> String? {
        step.distanceMetres >= 1 ? RouteFormat.distance(step.distanceMetres) : nil
    }
}
