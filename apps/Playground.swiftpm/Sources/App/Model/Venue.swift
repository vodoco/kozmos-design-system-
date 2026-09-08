import SwiftUI
import Kozmos

/// The coordinate space every floor plan is authored in.
///
/// Plans are drawn in fixed design units and aspect-fitted at render time, so a
/// plan keeps its proportions whatever shape the map viewport happens to be.
enum PlanSpace {
    static let size = CGSize(width: 100, height: 170)

    /// X of the main corridor. Routes are snapped to it, the way a person
    /// actually walks a building rather than cutting through walls.
    static let corridorX: CGFloat = 50

    /// The vertical circulation core — the lifts and stairs a route uses to
    /// change floor.
    static let core = CGPoint(x: 50, y: 85)
    static let coreRect = CGRect(x: 43, y: 76, width: 14, height: 18)

    /// Corridor footprints, in draw order.
    static let corridors: [CGRect] = [
        CGRect(x: 44, y: 8, width: 12, height: 154),
        CGRect(x: 8, y: 79, width: 84, height: 12)
    ]

    /// One design unit in metres. Turns plan geometry into walking distances.
    static let metresPerUnit: Double = 0.55

    /// Comfortable indoor walking pace, in metres per second.
    static let metresPerSecond: Double = 1.25
}

struct PlanRoom: Identifiable, Equatable {
    let id: String
    let label: String
    let rect: CGRect
}

struct VenueFloor: Identifiable, Equatable {
    let presentation: KozmosFloorPresentation
    let rooms: [PlanRoom]

    var id: String { presentation.id }
}

struct VenuePOI: Identifiable, Equatable {
    let presentation: KozmosPOIPresentation
    let position: CGPoint
    let featured: Bool

    var id: String { presentation.id }
    var floorId: String { presentation.floorId }
    var categoryId: String { presentation.categoryId ?? "" }
}

struct VenueCategory: Identifiable {
    let id: String
    let label: String
    /// A Kozmos icon name. The set is small, so every category here is one the
    /// design system can actually draw.
    let iconName: String
}

struct Venue {
    let name: String
    let buildingId: String
    let buildingLabel: String
    let floors: [VenueFloor]
    let pois: [VenuePOI]
    let categories: [VenueCategory]

    /// Where the visitor is standing when the app opens.
    let originFloorId: String
    let originPosition: CGPoint
    let originLabel: String

    // Lookups the map and the panels reach for on every update, resolved once.
    private let floorsById: [String: VenueFloor]
    private let poisById: [String: VenuePOI]
    private let poisByFloor: [String: [VenuePOI]]

    init(
        name: String,
        buildingId: String,
        buildingLabel: String,
        floors: [VenueFloor],
        pois: [VenuePOI],
        categories: [VenueCategory],
        originFloorId: String,
        originPosition: CGPoint,
        originLabel: String
    ) {
        self.name = name
        self.buildingId = buildingId
        self.buildingLabel = buildingLabel
        self.floors = floors
        self.pois = pois
        self.categories = categories
        self.originFloorId = originFloorId
        self.originPosition = originPosition
        self.originLabel = originLabel
        self.floorsById = Dictionary(uniqueKeysWithValues: floors.map { ($0.id, $0) })
        self.poisById = Dictionary(uniqueKeysWithValues: pois.map { ($0.id, $0) })
        self.poisByFloor = Dictionary(grouping: pois, by: \.floorId)
    }

    func floor(_ id: String) -> VenueFloor? {
        floorsById[id]
    }

    func poi(_ id: String) -> VenuePOI? {
        poisById[id]
    }

    func pois(onFloor floorId: String) -> [VenuePOI] {
        poisByFloor[floorId] ?? []
    }
}

// MARK: - Fixture

extension Venue {
    static let kozmosHQ: Venue = {
        let building = (id: "bldg-a", label: "Building A")

        func floor(
            _ id: String,
            _ label: String,
            _ shortLabel: String,
            _ rooms: [(String, String, CGRect)]
        ) -> VenueFloor {
            VenueFloor(
                presentation: KozmosFloorPresentation(id: id, label: label, shortLabel: shortLabel),
                rooms: rooms.map { PlanRoom(id: $0.0, label: $0.1, rect: $0.2) }
            )
        }

        let floors: [VenueFloor] = [
            floor("l3", "Level 3", "L3", [
                ("l3-vega", "Vega Boardroom", CGRect(x: 8, y: 12, width: 34, height: 32)),
                ("l3-eng", "Engineering", CGRect(x: 8, y: 48, width: 34, height: 24)),
                ("l3-wellness", "Wellness Studio", CGRect(x: 8, y: 98, width: 34, height: 28)),
                ("l3-print", "Print Point", CGRect(x: 8, y: 130, width: 34, height: 22)),
                ("l3-terrace", "Roof Terrace", CGRect(x: 58, y: 12, width: 34, height: 30)),
                ("l3-lab", "Hardware Lab", CGRect(x: 58, y: 46, width: 34, height: 26)),
                ("l3-help", "IT Help Point", CGRect(x: 58, y: 98, width: 34, height: 26)),
                ("l3-stair", "East Stair", CGRect(x: 58, y: 128, width: 34, height: 24))
            ]),
            floor("l2", "Level 2", "L2", [
                ("l2-orion", "Orion", CGRect(x: 8, y: 12, width: 34, height: 28)),
                ("l2-lyra", "Lyra", CGRect(x: 8, y: 44, width: 34, height: 24)),
                ("l2-focus", "Focus Pods", CGRect(x: 8, y: 98, width: 34, height: 26)),
                ("l2-print", "Print Hub", CGRect(x: 8, y: 128, width: 34, height: 24)),
                ("l2-design", "Design Studio", CGRect(x: 58, y: 12, width: 34, height: 34)),
                ("l2-kitchen", "Team Kitchen", CGRect(x: 58, y: 50, width: 34, height: 22)),
                ("l2-quiet", "Quiet Zone", CGRect(x: 58, y: 98, width: 34, height: 26)),
                ("l2-lockers", "Locker Bay", CGRect(x: 58, y: 128, width: 34, height: 24))
            ]),
            floor("l1", "Level 1", "L1", [
                ("l1-reception", "Reception", CGRect(x: 8, y: 12, width: 34, height: 30)),
                ("l1-lounge", "Visitor Lounge", CGRect(x: 8, y: 46, width: 34, height: 26)),
                ("l1-lockers", "Locker Bay", CGRect(x: 8, y: 98, width: 34, height: 26)),
                ("l1-west", "West Exit", CGRect(x: 8, y: 128, width: 34, height: 24)),
                ("l1-juice", "Juice Bar", CGRect(x: 58, y: 12, width: 34, height: 26)),
                ("l1-mail", "Mail & Print", CGRect(x: 58, y: 42, width: 34, height: 30)),
                ("l1-security", "Security Desk", CGRect(x: 58, y: 98, width: 34, height: 26)),
                ("l1-east", "East Exit", CGRect(x: 58, y: 128, width: 34, height: 24))
            ]),
            floor("b1", "Basement 1", "B1", [
                ("b1-shuttle", "Shuttle Bay", CGRect(x: 8, y: 12, width: 34, height: 34)),
                ("b1-bike", "Bike Store", CGRect(x: 8, y: 50, width: 34, height: 26)),
                ("b1-parkA", "Parking A", CGRect(x: 8, y: 98, width: 34, height: 54)),
                ("b1-ev", "EV Charging", CGRect(x: 58, y: 12, width: 34, height: 30)),
                ("b1-lockers", "Locker Bay", CGRect(x: 58, y: 46, width: 34, height: 26)),
                ("b1-parkB", "Parking B", CGRect(x: 58, y: 98, width: 34, height: 54))
            ])
        ]

        let categories: [VenueCategory] = [
            VenueCategory(id: "meeting", label: "Meeting rooms", iconName: "users-01"),
            VenueCategory(id: "desks", label: "Team desks", iconName: "user-01"),
            VenueCategory(id: "wellness", label: "Wellness", iconName: "activity"),
            VenueCategory(id: "print", label: "Print & scan", iconName: "scan"),
            VenueCategory(id: "lockers", label: "Lockers", iconName: "lock-01"),
            VenueCategory(id: "info", label: "Info desks", iconName: "info-circle"),
            VenueCategory(id: "exits", label: "Exits", iconName: "arrow-right"),
            VenueCategory(id: "shuttle", label: "Shuttle & parking", iconName: "bus")
        ]

        let floorLabels = Dictionary(uniqueKeysWithValues: floors.map { ($0.id, $0.presentation.label) })
        let categoryLabels = Dictionary(uniqueKeysWithValues: categories.map { ($0.id, $0.label) })

        func poi(
            _ id: String,
            _ name: String,
            category: String,
            floor floorId: String,
            at position: CGPoint,
            availability: KozmosPOIAvailability = .open,
            availabilityLabel: String? = nil,
            description: String? = nil,
            restricted: Bool = false,
            restrictionLabel: String? = nil,
            services: [String] = [],
            featured: Bool = false
        ) -> VenuePOI {
            VenuePOI(
                presentation: KozmosPOIPresentation(
                    id: id,
                    name: name,
                    categoryId: category,
                    categoryLabel: categoryLabels[category],
                    floorId: floorId,
                    floorLabel: floorLabels[floorId] ?? floorId,
                    buildingId: building.id,
                    buildingLabel: building.label,
                    availability: availability,
                    availabilityLabel: availabilityLabel ?? {
                        switch availability {
                        case .open: return "Open now"
                        case .closed: return "Closed"
                        case .unknown: return nil
                        }
                    }(),
                    description: description,
                    accessRestrictions: restricted ? .present : KozmosPOIAccessRestrictions.none,
                    accessRestrictionsLabel: restricted
                        ? (restrictionLabel ?? "Employee badge required")
                        : "Open to all visitors",
                    services: services.isEmpty
                        ? nil
                        : services.enumerated().map {
                            KozmosPOIServicePresentation(id: "\(id)-svc-\($0.offset)", label: $0.element)
                        },
                    actions: [.navigate, .favourite, .share]
                ),
                position: position,
                featured: featured
            )
        }

        let pois: [VenuePOI] = [
            // Level 1
            poi("l1-reception", "Reception Desk", category: "info", floor: "l1", at: CGPoint(x: 25, y: 27),
                description: "Sign in, collect a visitor badge, and pick up meeting-room passes.",
                services: ["Visitor sign-in", "Badge collection", "Step-free access"],
                featured: true),
            poi("l1-lounge", "Visitor Lounge", category: "wellness", floor: "l1", at: CGPoint(x: 25, y: 59),
                description: "Waiting area with soft seating and refreshments.",
                services: ["Seating", "Water", "Guest Wi-Fi"]),
            poi("l1-lockers", "Locker Bay L1", category: "lockers", floor: "l1", at: CGPoint(x: 25, y: 111),
                services: ["Day lockers", "Parcel drop"]),
            poi("l1-west", "West Exit", category: "exits", floor: "l1", at: CGPoint(x: 25, y: 140),
                description: "Street-level exit onto the west plaza.",
                services: ["Step-free access"]),
            poi("l1-juice", "Juice Bar", category: "wellness", floor: "l1", at: CGPoint(x: 75, y: 25),
                description: "Cold-press juices, coffee, and pastries.",
                services: ["Card payment", "Takeaway"]),
            poi("l1-mail", "Mail & Print Room", category: "print", floor: "l1", at: CGPoint(x: 75, y: 57),
                restricted: true,
                services: ["A3 colour", "Scanning", "Franking"]),
            poi("l1-security", "Security Desk", category: "info", floor: "l1", at: CGPoint(x: 75, y: 111),
                description: "Lost property, access passes, and out-of-hours entry.",
                services: ["Lost property", "24/7 staffed"]),
            poi("l1-east", "East Exit", category: "exits", floor: "l1", at: CGPoint(x: 75, y: 140),
                services: ["Step-free access"]),

            // Level 2
            poi("l2-orion", "Orion Meeting Room", category: "meeting", floor: "l2", at: CGPoint(x: 25, y: 26),
                description: "Twelve-seat room set up for hybrid meetings.",
                restricted: true,
                services: ["12 seats", "Video conferencing", "Whiteboard", "Step-free access"]),
            poi("l2-lyra", "Lyra Meeting Room", category: "meeting", floor: "l2", at: CGPoint(x: 25, y: 56),
                description: "Six-seat room, bookable on the day.",
                services: ["6 seats", "Display", "Whiteboard"]),
            poi("l2-focus", "Focus Pods", category: "desks", floor: "l2", at: CGPoint(x: 25, y: 111),
                description: "Four single-person pods for calls and deep work.",
                services: ["4 pods", "Power", "Acoustic panels"]),
            poi("l2-print", "Print Hub L2", category: "print", floor: "l2", at: CGPoint(x: 25, y: 140),
                services: ["A4 colour", "Secure release"]),
            poi("l2-design", "Design Studio", category: "desks", floor: "l2", at: CGPoint(x: 75, y: 29),
                description: "Product design neighbourhood, desks 201–228.",
                services: ["28 desks", "Pin-up wall", "Large-format printer"]),
            poi("l2-kitchen", "Team Kitchen", category: "wellness", floor: "l2", at: CGPoint(x: 75, y: 61),
                services: ["Coffee", "Dishwasher", "Recycling"]),
            poi("l2-quiet", "Quiet Zone", category: "desks", floor: "l2", at: CGPoint(x: 75, y: 111),
                description: "Silent working area — no calls or meetings.",
                services: ["18 desks", "No calls"]),
            poi("l2-lockers", "Locker Bay L2", category: "lockers", floor: "l2", at: CGPoint(x: 75, y: 140),
                services: ["Assigned lockers"]),

            // Level 3
            poi("l3-vega", "Vega Boardroom", category: "meeting", floor: "l3", at: CGPoint(x: 25, y: 28),
                description: "Executive boardroom with a dedicated AV operator.",
                restricted: true, restrictionLabel: "Booking and host approval required",
                services: ["20 seats", "AV support", "Catering", "Step-free access"],
                featured: true),
            poi("l3-eng", "Engineering Neighbourhood", category: "desks", floor: "l3", at: CGPoint(x: 25, y: 60),
                description: "Platform and mobile teams, desks 301–344.",
                services: ["44 desks", "Standing desks"]),
            poi("l3-wellness", "Wellness Studio", category: "wellness", floor: "l3", at: CGPoint(x: 25, y: 112),
                description: "Bookable room for stretching, prayer, and quiet time.",
                services: ["Bookable", "Mats provided", "Step-free access"]),
            poi("l3-print", "Print Point L3", category: "print", floor: "l3", at: CGPoint(x: 25, y: 141),
                services: ["A4 mono", "Secure release"]),
            poi("l3-terrace", "Roof Terrace", category: "wellness", floor: "l3", at: CGPoint(x: 75, y: 27),
                availability: .closed, availabilityLabel: "Closed until 12:00",
                description: "Outdoor terrace, weather permitting.",
                services: ["Outdoor seating", "Shade"]),
            poi("l3-lab", "Hardware Lab", category: "desks", floor: "l3", at: CGPoint(x: 75, y: 59),
                restricted: true, restrictionLabel: "Lab induction required",
                services: ["Bench space", "ESD protected"]),
            poi("l3-help", "IT Help Point", category: "info", floor: "l3", at: CGPoint(x: 75, y: 111),
                description: "Walk-up desk for laptops, access, and peripherals.",
                services: ["Walk-up", "Loan equipment"]),

            // Basement 1
            poi("b1-shuttle", "Shuttle Bay", category: "shuttle", floor: "b1", at: CGPoint(x: 25, y: 29),
                description: "Campus shuttle to the north and south car parks.",
                services: ["Every 15 min", "Step-free access"]),
            poi("b1-bike", "Bike Store", category: "lockers", floor: "b1", at: CGPoint(x: 25, y: 63),
                restricted: true,
                services: ["60 spaces", "Repair stand", "Showers"]),
            poi("b1-ev", "EV Charging", category: "shuttle", floor: "b1", at: CGPoint(x: 75, y: 27),
                description: "Eight bays, 22 kW.",
                services: ["8 bays", "22 kW", "App payment"]),
            poi("b1-lockers", "Locker Bay B1", category: "lockers", floor: "b1", at: CGPoint(x: 75, y: 59),
                services: ["Day lockers"])
        ]

        return Venue(
            name: "Kozmos HQ",
            buildingId: building.id,
            buildingLabel: building.label,
            floors: floors,
            pois: pois,
            categories: categories,
            originFloorId: "l1",
            originPosition: CGPoint(x: 50, y: 152),
            originLabel: "Main Entrance"
        )
    }()
}
