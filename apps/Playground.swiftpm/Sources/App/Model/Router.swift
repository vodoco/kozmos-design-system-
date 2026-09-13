import SwiftUI
import Kozmos

/// One instruction in a route, already resolved to the floor it happens on and
/// the point the walker reaches once it is done.
struct RouteStep: Identifiable, Equatable {
    let id: Int
    let type: DirectionType
    let instruction: String
    /// Nil for a step that covers no ground, such as riding the lift.
    let distanceMetres: Double?
    let durationSeconds: Double
    let floorId: String
    let position: CGPoint
}

/// The part of a route that stays on one floor. The map only ever draws the
/// leg belonging to the floor currently on screen.
struct RouteLeg: Equatable {
    let floorId: String
    let points: [CGPoint]
}

struct VenueRoute: Equatable {
    let legs: [RouteLeg]
    let steps: [RouteStep]
    let distanceMetres: Double
    let durationSeconds: Double
    let floorChanges: Int

    func leg(onFloor floorId: String) -> [CGPoint] {
        legs.first { $0.floorId == floorId }?.points ?? []
    }
}

/// Turns venue geometry into walkable routes.
///
/// Everything a Kozmos component renders — distances, durations, instructions —
/// is derived here and handed over already localized, which is what the product
/// contracts ask for: components present, the app decides.
enum VenueRouter {

    // MARK: - Geometry

    /// An orthogonal path that leaves the origin, joins the main corridor, and
    /// approaches the destination from it.
    static func polyline(from origin: CGPoint, to destination: CGPoint) -> [CGPoint] {
        let spine = PlanSpace.corridorX
        let raw = [
            origin,
            CGPoint(x: spine, y: origin.y),
            CGPoint(x: spine, y: destination.y),
            destination
        ]
        return raw.reduce(into: [CGPoint]()) { points, next in
            if let last = points.last, hypot(last.x - next.x, last.y - next.y) < 0.5 { return }
            points.append(next)
        }
    }

    static func lengthInMetres(of points: [CGPoint]) -> Double {
        guard points.count > 1 else { return 0 }
        return zip(points, points.dropFirst()).reduce(0) { total, pair in
            total + Double(hypot(pair.1.x - pair.0.x, pair.1.y - pair.0.y)) * PlanSpace.metresPerUnit
        }
    }

    /// Plan Y grows downwards, so a positive cross product is a turn to the
    /// walker's right.
    private static func turn(_ previous: CGPoint, _ vertex: CGPoint, _ next: CGPoint) -> DirectionType {
        let incoming = CGPoint(x: vertex.x - previous.x, y: vertex.y - previous.y)
        let outgoing = CGPoint(x: next.x - vertex.x, y: next.y - vertex.y)
        let cross = incoming.x * outgoing.y - incoming.y * outgoing.x
        if cross > 0.5 { return .right }
        if cross < -0.5 { return .left }
        return .straight
    }

    // MARK: - Routing

    static func route(
        in venue: Venue,
        from origin: CGPoint,
        onFloor originFloorId: String,
        originLabel: String,
        to destination: VenuePOI,
        preference: KozmosRoutePreference
    ) -> VenueRoute {
        var legs: [RouteLeg] = []
        let sameFloor = originFloorId == destination.floorId

        if sameFloor {
            legs.append(RouteLeg(floorId: originFloorId, points: polyline(from: origin, to: destination.position)))
        } else {
            legs.append(RouteLeg(floorId: originFloorId, points: polyline(from: origin, to: PlanSpace.core)))
            legs.append(RouteLeg(floorId: destination.floorId, points: polyline(from: PlanSpace.core, to: destination.position)))
        }

        let floorChanges = sameFloor ? 0 : 1
        let levelsTraversed = abs(
            (venue.floors.firstIndex { $0.id == originFloorId } ?? 0)
                - (venue.floors.firstIndex { $0.id == destination.floorId } ?? 0)
        )
        let verticalTransport = preference == .stepFree ? "lift" : "stairs"

        // Step-free routing keeps to the accessible core and the wider western
        // corridor, so it covers more ground at a gentler pace. Applying that
        // per step rather than to the total keeps the instruction list and the
        // route summary in agreement.
        let distanceFactor = preference == .stepFree ? 1.18 : 1.0
        let paceFactor = preference == .stepFree ? 1.1 : 1.0
        let transferSeconds = Double(levelsTraversed) * (preference == .stepFree ? 45 : 28)

        func walkingSeconds(_ metres: Double) -> Double {
            metres / PlanSpace.metresPerSecond * paceFactor
        }

        var steps: [RouteStep] = []

        for (legIndex, leg) in legs.enumerated() {
            let isFirstLeg = legIndex == 0
            let isLastLeg = legIndex == legs.count - 1

            for index in 0..<(leg.points.count - 1) {
                let start = leg.points[index]
                let end = leg.points[index + 1]
                let segmentMetres = lengthInMetres(of: [start, end]) * distanceFactor

                let isFinalSegment = isLastLeg && index == leg.points.count - 2
                if isFinalSegment {
                    steps.append(
                        RouteStep(
                            id: steps.count,
                            type: .destination,
                            instruction: "Arrive at \(destination.presentation.name)",
                            distanceMetres: segmentMetres,
                            durationSeconds: walkingSeconds(segmentMetres),
                            floorId: leg.floorId,
                            position: end
                        )
                    )
                    continue
                }

                let type: DirectionType
                let instruction: String
                if index == 0 {
                    type = .straight
                    instruction = isFirstLeg
                        ? "Leave \(originLabel) and join the main corridor"
                        : "Step out of the \(verticalTransport) and join the main corridor"
                } else {
                    type = turn(leg.points[index - 1], start, end)
                    switch type {
                    case .left: instruction = "Turn left along the main corridor"
                    case .right: instruction = "Turn right along the main corridor"
                    case .straight: instruction = "Continue along the main corridor"
                    case .destination: instruction = "Continue to the destination"
                    }
                }

                steps.append(
                    RouteStep(
                        id: steps.count,
                        type: type,
                        instruction: instruction,
                        distanceMetres: segmentMetres,
                        durationSeconds: walkingSeconds(segmentMetres),
                        floorId: leg.floorId,
                        position: end
                    )
                )
            }

            if !isLastLeg {
                let nextFloorLabel = venue.floor(legs[legIndex + 1].floorId)?.presentation.label
                    ?? legs[legIndex + 1].floorId
                steps.append(
                    RouteStep(
                        id: steps.count,
                        type: .straight,
                        instruction: "Take the \(verticalTransport) to \(nextFloorLabel)",
                        distanceMetres: nil,
                        durationSeconds: transferSeconds,
                        floorId: legs[legIndex + 1].floorId,
                        position: PlanSpace.core
                    )
                )
            }
        }

        return VenueRoute(
            legs: legs,
            steps: steps,
            distanceMetres: steps.compactMap(\.distanceMetres).reduce(0, +),
            durationSeconds: steps.map(\.durationSeconds).reduce(0, +),
            floorChanges: floorChanges
        )
    }
}

// MARK: - Formatting

/// Kozmos components take labels that are already written for the reader, so
/// every number the UI shows is formatted here first.
enum VenueFormat {
    static func distance(_ metres: Double) -> String {
        metres >= 1000
            ? String(format: "%.1f km", metres / 1000)
            : "\(Int(metres.rounded())) m"
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

    static func results(_ count: Int) -> String {
        count == 1 ? "1 result" : "\(count) results"
    }
}
