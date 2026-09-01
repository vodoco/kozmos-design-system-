import Foundation

/// Platform-neutral, already-localized presentation models.
///
/// These mirror the TypeScript contracts in `@kozmos/product-contracts` so that
/// React, SwiftUI, and Compose Product / SDK components describe the same shape.
///
/// API and map-SDK objects must be adapted into these contracts outside UI
/// components. Human-readable labels are included alongside machine values so
/// each platform renders the same meaning without embedding English formatters.

public enum KozmosPOIAvailability: String, Sendable, Hashable, CaseIterable {
    case open
    case closed
    case unknown
}

public enum KozmosPOIAccessRestrictions: String, Sendable, Hashable, CaseIterable {
    /// The POI is known to have no access restrictions.
    ///
    /// Reference this case fully qualified — `KozmosPOIAccessRestrictions.none` —
    /// wherever the value is optional, so it is never confused with `Optional.none`.
    case none
    case present
    case unknown
}

public enum KozmosPOIAction: String, Sendable, Hashable, CaseIterable {
    case navigate
    case favourite
    case bookmark
    case share
    case order
}

public struct KozmosPOIMediaPresentation: Sendable, Hashable, Identifiable {
    public let id: String
    public let src: String
    public let alt: String

    public init(id: String, src: String, alt: String) {
        self.id = id
        self.src = src
        self.alt = alt
    }
}

public struct KozmosPOIServicePresentation: Sendable, Hashable, Identifiable {
    public let id: String
    public let label: String
    public let iconName: String?

    public init(id: String, label: String, iconName: String? = nil) {
        self.id = id
        self.label = label
        self.iconName = iconName
    }
}

public struct KozmosPOILogoPresentation: Sendable, Hashable {
    public let src: String
    public let alt: String

    public init(src: String, alt: String) {
        self.src = src
        self.alt = alt
    }
}

public struct KozmosPOIPresentation: Sendable, Hashable, Identifiable {
    public let id: String
    public let name: String
    public let categoryId: String?
    public let categoryLabel: String?
    public let floorId: String
    public let floorLabel: String
    public let buildingId: String?
    public let buildingLabel: String?
    public let logo: KozmosPOILogoPresentation?
    public let media: [KozmosPOIMediaPresentation]
    public let availability: KozmosPOIAvailability?
    public let availabilityLabel: String?
    public let description: String?
    public let accessRestrictions: KozmosPOIAccessRestrictions?
    public let accessRestrictionsLabel: String?
    public let services: [KozmosPOIServicePresentation]?
    public let actions: [KozmosPOIAction]

    public init(
        id: String,
        name: String,
        categoryId: String? = nil,
        categoryLabel: String? = nil,
        floorId: String,
        floorLabel: String,
        buildingId: String? = nil,
        buildingLabel: String? = nil,
        logo: KozmosPOILogoPresentation? = nil,
        media: [KozmosPOIMediaPresentation] = [],
        availability: KozmosPOIAvailability? = nil,
        availabilityLabel: String? = nil,
        description: String? = nil,
        accessRestrictions: KozmosPOIAccessRestrictions? = nil,
        accessRestrictionsLabel: String? = nil,
        services: [KozmosPOIServicePresentation]? = nil,
        actions: [KozmosPOIAction] = []
    ) {
        self.id = id
        self.name = name
        self.categoryId = categoryId
        self.categoryLabel = categoryLabel
        self.floorId = floorId
        self.floorLabel = floorLabel
        self.buildingId = buildingId
        self.buildingLabel = buildingLabel
        self.logo = logo
        self.media = media
        self.availability = availability
        self.availabilityLabel = availabilityLabel
        self.description = description
        self.accessRestrictions = accessRestrictions
        self.accessRestrictionsLabel = accessRestrictionsLabel
        self.services = services
        self.actions = actions
    }

    /// Floor and building joined the same way every platform renders it.
    public var locationLabel: String {
        [floorLabel, buildingLabel]
            .compactMap { $0 }
            .filter { !$0.isEmpty }
            .joined(separator: " · ")
    }

    /// Single-character fallback used when no logo artwork is supplied.
    public var logoFallbackInitial: String {
        name.prefix(1).uppercased()
    }
}

public struct KozmosTravelEstimatePresentation: Sendable, Hashable {
    public let durationSeconds: Double
    public let durationLabel: String
    public let distanceMetres: Double?
    public let distanceLabel: String?
    public let mode: String?
    public let modeLabel: String?

    public init(
        durationSeconds: Double,
        durationLabel: String,
        distanceMetres: Double? = nil,
        distanceLabel: String? = nil,
        mode: String? = nil,
        modeLabel: String? = nil
    ) {
        self.durationSeconds = durationSeconds
        self.durationLabel = durationLabel
        self.distanceMetres = distanceMetres
        self.distanceLabel = distanceLabel
        self.mode = mode
        self.modeLabel = modeLabel
    }
}

public struct KozmosPOIResultPresentation: Sendable, Hashable {
    public let poiId: String
    public let resultIndex: Int
    public let selected: Bool
    public let featured: Bool
    public let floorId: String
    public let travelEstimate: KozmosTravelEstimatePresentation?
    public let available: Bool?
    public let unavailableReason: String?

    public init(
        poiId: String,
        resultIndex: Int,
        selected: Bool = false,
        featured: Bool = false,
        floorId: String,
        travelEstimate: KozmosTravelEstimatePresentation? = nil,
        available: Bool? = nil,
        unavailableReason: String? = nil
    ) {
        self.poiId = poiId
        self.resultIndex = resultIndex
        self.selected = selected
        self.featured = featured
        self.floorId = floorId
        self.travelEstimate = travelEstimate
        self.available = available
        self.unavailableReason = unavailableReason
    }

    /// Mirrors the web rule: only an explicit `false` marks a result unavailable.
    public var isAvailable: Bool {
        available != false
    }

    /// Returns a copy with `selected` driven by the single canonical selection ID.
    public func selecting(_ selectedPoiId: String?) -> KozmosPOIResultPresentation {
        guard let selectedPoiId else { return self }
        return KozmosPOIResultPresentation(
            poiId: poiId,
            resultIndex: resultIndex,
            selected: selectedPoiId == poiId,
            featured: featured,
            floorId: floorId,
            travelEstimate: travelEstimate,
            available: available,
            unavailableReason: unavailableReason
        )
    }
}

public struct KozmosFloorPresentation: Sendable, Hashable, Identifiable {
    public let id: String
    public let label: String
    public let shortLabel: String
    public let disabled: Bool

    public init(id: String, label: String, shortLabel: String, disabled: Bool = false) {
        self.id = id
        self.label = label
        self.shortLabel = shortLabel
        self.disabled = disabled
    }
}

public struct KozmosCategoryPresentation: Sendable, Hashable, Identifiable {
    public let id: String
    public let label: String
    public let iconName: String?
    public let selected: Bool
    public let disabled: Bool
    public let resultCount: Int?
    public let resultCountLabel: String?

    public init(
        id: String,
        label: String,
        iconName: String? = nil,
        selected: Bool = false,
        disabled: Bool = false,
        resultCount: Int? = nil,
        resultCountLabel: String? = nil
    ) {
        self.id = id
        self.label = label
        self.iconName = iconName
        self.selected = selected
        self.disabled = disabled
        self.resultCount = resultCount
        self.resultCountLabel = resultCountLabel
    }
}

public enum KozmosRoutePreference: String, Sendable, Hashable, CaseIterable {
    case quickest
    case stepFree = "step-free"
    case custom
}

public struct KozmosRouteOptionPresentation: Sendable, Hashable, Identifiable {
    public let id: String
    public let label: String
    public let durationSeconds: Double
    public let durationLabel: String
    public let distanceMetres: Double
    public let distanceLabel: String
    public let preference: KozmosRoutePreference
    public let selected: Bool
    public let available: Bool
    public let warning: String?

    public init(
        id: String,
        label: String,
        durationSeconds: Double,
        durationLabel: String,
        distanceMetres: Double,
        distanceLabel: String,
        preference: KozmosRoutePreference,
        selected: Bool = false,
        available: Bool = true,
        warning: String? = nil
    ) {
        self.id = id
        self.label = label
        self.durationSeconds = durationSeconds
        self.durationLabel = durationLabel
        self.distanceMetres = distanceMetres
        self.distanceLabel = distanceLabel
        self.preference = preference
        self.selected = selected
        self.available = available
        self.warning = warning
    }
}

public enum KozmosRouteReadiness: String, Sendable, Hashable, CaseIterable {
    case idle
    case calculating
    case ready
    case noRoute = "no-route"
    case error
}

public enum KozmosMapReadiness: String, Sendable, Hashable, CaseIterable {
    case loading
    case ready
    case error
    case offline
    case unsupported
}

public enum KozmosUserLocationState: String, Sendable, Hashable, CaseIterable {
    case off
    case locating
    case following
    case heading
    case permissionDenied = "permission-denied"
    case stale
    case unavailable
}

public struct KozmosMapCollisionInsets: Sendable, Hashable {
    public let top: Double
    public let right: Double
    public let bottom: Double
    public let left: Double

    public static let zero = KozmosMapCollisionInsets()

    public init(top: Double = 0, right: Double = 0, bottom: Double = 0, left: Double = 0) {
        self.top = top
        self.right = right
        self.bottom = bottom
        self.left = left
    }
}
