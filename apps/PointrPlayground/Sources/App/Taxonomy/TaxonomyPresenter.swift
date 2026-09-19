import Foundation
import Kozmos

/// The web example adapter, `POITaxonomy.fixtures.ts`, ported rule for rule:
/// a place's taxonomy property values in, already-presented highlights and
/// chip groups out, with a diagnostic for everything refused. The product
/// policy lives here, not in the dictionary — which properties are highlights
/// only, which colours become which tones, how a wait is worded — so a native
/// card presents a property exactly as the web card does.
enum TaxonomyPresenter {
    struct Result: Equatable {
        var summary: [KozmosPOIDetailSummary] = []
        var groups: [KozmosPOIDetailAttributeGroup] = []
        var issues: [String] = []
    }

    /// From the supplied reference screens: these appear in the highlight row
    /// and never as chips, though the dictionary gives them an order too.
    static let highlightOnly: Set<String> = ["rating", "priceRange", "crowdLevel", "waitTime", "occupancyStatus"]

    /// Dictionary colours onto the card's tones. Anything else stays neutral;
    /// no colour is invented for a value the dictionary left uncoloured.
    static let tones: [String: KozmosPOIDetailTone] = [
        "theme_successColor": .success,
        "theme_alertColor": .warning,
        "theme_dangerColor": .danger,
        "theme_themeColor": .brand,
    ]

    /// Value types this presenter can show. Objects — rating, opening hours —
    /// need their own formatter and are refused with a diagnostic.
    static let presentable: Set<String> = ["array", "enum", "boolean", "integer", "text"]

    static func present(
        _ values: [String: Any],
        dictionary: TaxonomyDictionary = .pinned,
        customHighlights: [String: KozmosPOIDetailSummary] = [:],
        formatWait: (Int) -> String = { "\($0) min wait" }
    ) -> Result {
        var result = Result()
        // One line, not one per key: a CMS export carries dozens of its own.
        let unknown = values.keys.filter { dictionary.properties[$0] == nil }.sorted()
        if !unknown.isEmpty { result.issues.append("Unknown properties: \(unknown.joined(separator: ", "))") }

        var highlights: [(order: Int, item: KozmosPOIDetailSummary)] = []
        var groups: [KozmosPOIDetailAttributeGroup] = []
        let ordered = dictionary.properties.sorted { lhs, rhs in
            let left = lhs.value.display.order ?? Int.max, right = rhs.value.display.order ?? Int.max
            return left != right ? left < right : lhs.key < rhs.key
        }
        for (key, definition) in ordered {
            guard let raw = values[key], !isAbsent(raw) else { continue }
            let display = definition.display
            // Contact actions, content objects and internal identifiers are not generic tags.
            if display.action != nil || (display.order == nil && display.highlight == nil) { continue }
            if let custom = customHighlights[key], let priority = display.highlight {
                highlights.append((priority, custom.replacing(id: key)))
                continue
            }
            let valueType = definition.valueType
            guard presentable.contains(valueType) else {
                result.issues.append("Requires a specialized formatter: \(key)")
                continue
            }
            let array = raw as? [Any]
            if (valueType == "array") != (array != nil) {
                result.issues.append("Invalid value shape: \(key)")
                continue
            }
            var items: [KozmosPOIDetailTag] = []
            var seen = Set<String>()
            for candidate in array ?? [raw] {
                guard let scalar = Scalar(candidate), scalar.isValid(for: definition) else {
                    result.issues.append("Invalid value: \(key)")
                    continue
                }
                guard seen.insert(scalar.key).inserted else { continue }
                let resolved = display.valueDisplay?[scalar.key]
                // false only has visible meaning when the dictionary names it.
                if case .bool(false) = scalar, resolved == nil { continue }
                let iconUrl = resolved?.iconUrl
                    ?? (valueType == "boolean" || valueType == "integer" ? definition.iconUrl : nil)
                items.append(KozmosPOIDetailTag(
                    id: "\(key):\(scalar.key)", label: resolved?.displayName ?? scalar.key,
                    iconUrl: iconUrl, iconMonochrome: iconUrl == nil ? nil : true))
            }
            guard !items.isEmpty else { continue }

            if let priority = display.highlight {
                let rawScalar = Scalar(raw)
                let resolved = rawScalar.flatMap { display.valueDisplay?[$0.key] }
                let color = resolved?.color ?? display.color
                let label = display.displayName ?? key
                var value = valueType == "array" ? label : items[0].label
                var priceLevel: Int?
                if key == "priceRange", case .integer(let level)? = rawScalar {
                    priceLevel = level
                    value = "\(level) of 4"
                }
                if key == "waitTime", case .integer(let minutes)? = rawScalar { value = formatWait(minutes) }
                let iconUrl = key == "priceRange" ? nil : (resolved?.iconUrl ?? definition.iconUrl)
                highlights.append((priority, KozmosPOIDetailSummary(
                    id: key, label: label, value: value, iconUrl: iconUrl,
                    iconMonochrome: iconUrl == nil ? nil : true, priceLevel: priceLevel,
                    tone: color.map { tones[$0] ?? .neutral } ?? .neutral)))
            }
            if display.order != nil, !highlightOnly.contains(key), !["description", "tags"].contains(key) {
                let segment = definition.segment
                if let index = groups.firstIndex(where: { $0.id == segment }) {
                    groups[index] = KozmosPOIDetailAttributeGroup(
                        id: segment, heading: segment, items: groups[index].items + items)
                } else {
                    groups.append(KozmosPOIDetailAttributeGroup(id: segment, heading: segment, items: items))
                }
            }
        }
        // A wait rides on the crowd level when both exist; alone it is its own highlight.
        if let crowd = highlights.firstIndex(where: { $0.item.id == "crowdLevel" }),
           let wait = highlights.firstIndex(where: { $0.item.id == "waitTime" }) {
            highlights[crowd].item = highlights[crowd].item.replacing(detail: highlights[wait].item.value)
            highlights.remove(at: wait)
        }
        result.groups = groups
        result.summary = highlights.enumerated()
            .sorted { $0.element.order != $1.element.order ? $0.element.order < $1.element.order : $0.offset < $1.offset }
            .prefix(3)
            .map(\.element.item)
        return result
    }

    /// Null, an empty string and an empty array are absent. Zero and false are values.
    static func isAbsent(_ raw: Any) -> Bool {
        if raw is NSNull { return true }
        if let string = raw as? String { return string.isEmpty }
        if let array = raw as? [Any] { return array.isEmpty }
        return false
    }

    /// A JSON scalar as it arrives from the SDK's feature attributes, where a
    /// boolean and a number are both `NSNumber` and only the Core Foundation
    /// type tells them apart.
    enum Scalar: Equatable {
        case bool(Bool)
        case integer(Int)
        case number(Double)
        case string(String)

        init?(_ value: Any) {
            if let number = value as? NSNumber {
                if CFGetTypeID(number) == CFBooleanGetTypeID() {
                    self = .bool(number.boolValue)
                } else {
                    let double = number.doubleValue
                    // The web's safe-integer test: finite, integral, and exact.
                    if double.isFinite, double == double.rounded(), abs(double) <= 9_007_199_254_740_991 {
                        self = .integer(number.intValue)
                    } else {
                        self = .number(double)
                    }
                }
                return
            }
            if let string = value as? String {
                self = .string(string)
                return
            }
            return nil
        }

        /// The dictionary's key for this value: how `valueDisplay` names it.
        var key: String {
            switch self {
            case .bool(let value): return value ? "true" : "false"
            case .integer(let value): return String(value)
            case .number(let value): return String(value)
            case .string(let value): return value
            }
        }

        func isValid(for definition: TaxonomyDictionary.Property) -> Bool {
            switch definition.valueType {
            case "boolean":
                if case .bool = self { return true }
                return false
            case "integer":
                guard case .integer(let value) = self else { return false }
                return Double(value) >= (definition.validation.min ?? -.infinity)
                    && Double(value) <= (definition.validation.max ?? .infinity)
            default:
                guard case .string(let value) = self,
                      !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return false }
                return definition.validation.options.map { $0.contains(value) } ?? true
            }
        }
    }
}

extension KozmosPOIDetailSummary {
    func replacing(id newId: String? = nil, detail newDetail: String? = nil) -> KozmosPOIDetailSummary {
        KozmosPOIDetailSummary(
            id: newId ?? id, label: label, value: value, detail: newDetail ?? detail,
            systemImage: systemImage, iconUrl: iconUrl, iconMonochrome: iconMonochrome,
            priceLevel: priceLevel, tone: tone)
    }
}
