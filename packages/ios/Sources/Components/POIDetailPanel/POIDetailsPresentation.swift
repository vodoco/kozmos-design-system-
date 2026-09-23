import Foundation

/// Already-localized display data, not raw SDK/taxonomy objects. The product
/// adapter decides ordering, icon ownership, tone, and which facts to highlight.
public struct KozmosPOIDetailsPresentation: Sendable, Hashable, Codable {
    public var summary: [KozmosPOIDetailSummary]
    public var groups: [KozmosPOIDetailAttributeGroup]
    public var tags: [KozmosPOIDetailTag]
    public var supplementaryActions: [KozmosPOIDetailAction]
    public var travelEstimate: KozmosTravelEstimatePresentation?
    public var openingHours: KozmosPOIOpeningHours?
    public var description: KozmosPOIDetailDescription?

    public init(
        summary: [KozmosPOIDetailSummary] = [],
        groups: [KozmosPOIDetailAttributeGroup] = [],
        tags: [KozmosPOIDetailTag] = [],
        supplementaryActions: [KozmosPOIDetailAction] = [],
        travelEstimate: KozmosTravelEstimatePresentation? = nil,
        openingHours: KozmosPOIOpeningHours? = nil,
        description: KozmosPOIDetailDescription? = nil
    ) {
        self.summary = summary
        self.groups = groups
        self.tags = tags
        self.supplementaryActions = supplementaryActions
        self.travelEstimate = travelEstimate
        self.openingHours = openingHours
        self.description = description
    }

    /// JSON callers get the same empty-collection defaults as Swift callers.
    /// Wrong types still throw; this does not silently repair malformed data.
    public init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        summary = try values.decodeIfPresent([KozmosPOIDetailSummary].self, forKey: .summary) ?? []
        groups = try values.decodeIfPresent([KozmosPOIDetailAttributeGroup].self, forKey: .groups) ?? []
        tags = try values.decodeIfPresent([KozmosPOIDetailTag].self, forKey: .tags) ?? []
        supplementaryActions = try values.decodeIfPresent([KozmosPOIDetailAction].self, forKey: .supplementaryActions) ?? []
        travelEstimate = try values.decodeIfPresent(KozmosTravelEstimatePresentation.self, forKey: .travelEstimate)
        openingHours = try values.decodeIfPresent(KozmosPOIOpeningHours.self, forKey: .openingHours)
        description = try values.decodeIfPresent(KozmosPOIDetailDescription.self, forKey: .description)
    }

    /// A POI has one row of at most three equal-width highlights. Callers must
    /// order by product priority before passing these; never sort by label.
    public var visibleSummary: [KozmosPOIDetailSummary] { Array(summary.prefix(3)) }
}

public struct KozmosPOIDetailSummary: Sendable, Hashable, Identifiable, Codable {
    public let id: String
    public let label: String
    public let value: String
    public let detail: String?
    public let systemImage: String?
    public let iconUrl: String?
    public let iconMonochrome: Bool?
    public let priceLevel: Int?
    public let tone: KozmosPOIDetailTone?

    public init(id: String, label: String, value: String, detail: String? = nil,
                systemImage: String? = nil, iconUrl: String? = nil,
                iconMonochrome: Bool? = nil, priceLevel: Int? = nil,
                tone: KozmosPOIDetailTone? = nil) {
        self.id = id; self.label = label; self.value = value; self.detail = detail
        self.systemImage = systemImage; self.iconUrl = iconUrl
        self.iconMonochrome = iconMonochrome; self.priceLevel = priceLevel; self.tone = tone
    }
}

public enum KozmosPOIDetailTone: String, Sendable, Hashable, Codable {
    case neutral, success, warning, danger, brand
}

public struct KozmosPOIDetailTag: Sendable, Hashable, Identifiable, Codable {
    public let id: String
    public let label: String
    public let systemImage: String?
    public let iconUrl: String?
    public let iconMonochrome: Bool?

    public init(id: String, label: String, systemImage: String? = nil,
                iconUrl: String? = nil, iconMonochrome: Bool? = nil) {
        self.id = id; self.label = label; self.systemImage = systemImage
        self.iconUrl = iconUrl; self.iconMonochrome = iconMonochrome
    }

    init(service: KozmosPOIServicePresentation) {
        self.init(id: service.id, label: service.label,
                  systemImage: service.iconName.map(KozmosIcon.symbolName(for:)))
    }
}

public struct KozmosPOIDetailAttributeGroup: Sendable, Hashable, Identifiable, Codable {
    public let id: String
    public let heading: String
    public let items: [KozmosPOIDetailTag]
    public init(id: String, heading: String, items: [KozmosPOIDetailTag]) {
        self.id = id; self.heading = heading; self.items = items
    }
}

/// Additional product intents do not expand the shared core action enum.
public struct KozmosPOIDetailAction: Sendable, Hashable, Identifiable, Codable {
    public let action: String
    public let label: String
    public let systemImage: String?
    public var id: String { action }
    public init(action: String, label: String, systemImage: String? = nil) {
        self.action = action; self.label = label; self.systemImage = systemImage
    }
}

public struct KozmosPOIOpeningHours: Sendable, Hashable, Codable {
    public struct Row: Sendable, Hashable, Identifiable, Codable {
        public let id: String
        public let day: String
        public let hours: String
        public init(id: String, day: String, hours: String) {
            self.id = id; self.day = day; self.hours = hours
        }
    }
    public let label: String
    public let summary: String
    public let rows: [Row]
    public let note: String?
    public init(label: String, summary: String, rows: [Row], note: String? = nil) {
        self.label = label; self.summary = summary; self.rows = rows; self.note = note
    }
}

public struct KozmosPOIDetailDescription: Sendable, Hashable, Codable {
    public let preview: String
    public let full: String
    public init(preview: String, full: String) { self.preview = preview; self.full = full }
}
