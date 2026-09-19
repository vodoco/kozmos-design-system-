import Foundation

/// The version-pinned taxonomy projection the web POI examples use — value
/// types, validation, display rules and icon addresses for every property —
/// decoded once from the literal `scripts/sync-ios-taxonomy.mjs` generates.
/// Pinned rather than fetched: the taxonomy and PointrKit are versioned
/// separately, and a card must not change shape because a dictionary did.
struct TaxonomyDictionary: Decodable {
    struct ValueDisplay: Decodable, Equatable {
        var displayName: String?
        var iconUrl: String?
        var color: String?
    }

    struct Validation: Decodable, Equatable {
        var type: String
        var min: Double?
        var max: Double?
        var options: [String]?
    }

    struct Display: Decodable, Equatable {
        var displayName: String?
        var order: Int?
        var highlight: Int?
        var action: String?
        var color: String?
        var iconUrl: String?
        var valueDisplay: [String: ValueDisplay]?
    }

    struct Property: Decodable, Equatable {
        var valueType: String
        var segment: String
        var iconUrl: String?
        var validation: Validation
        var display: Display
    }

    let source: String
    let version: String
    let properties: [String: Property]

    static let pinned: TaxonomyDictionary = {
        do {
            return try JSONDecoder().decode(TaxonomyDictionary.self, from: Data(TaxonomyProjection.json.utf8))
        } catch {
            // Generated at build time from a checked-in JSON file; failing to
            // decode it is a build defect, not a runtime condition.
            fatalError("The generated taxonomy projection does not decode: \(error)")
        }
    }()
}
