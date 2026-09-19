import Foundation
import PointrKit
import Kozmos

/// A contact action the host can perform for a place, its address already
/// validated. The card shows the action; only the host opens the address.
enum SDKPOIContact: Equatable {
    case website(URL)
    case call(URL)
    case email(URL)

    var url: URL {
        switch self {
        case .website(let url), .call(let url), .email(let url): return url
        }
    }
}

/// One of the SDK's POI buttons as plain values, so the mapping can be tested
/// without a `PTRPoiButton`.
struct SDKPOIButton: Equatable {
    enum Kind: Int {
        case unknown = 0, href = 1, tel = 2, mailto = 3, custom = 4
    }
    var name: String
    var kind: Kind
    var intent: String
}

/// Everything the card needs for a selected place, and what the host keeps
/// for itself: the contact addresses behind the actions, and the diagnostics
/// for whatever the data did not let it show.
struct SDKPOIDetails: Equatable {
    var presentation: KozmosPOIDetailsPresentation
    var contacts: [String: SDKPOIContact]
    var issues: [String]
}

enum SDKPOIAdapter {
    /// PointrKit's "absent" for the numeric POI fields — rating, price.
    static let absent = -999_999

    /// The keys PointrKit models on `PTRPoi` itself. The same keys can sit in
    /// a feature's attributes; the typed fields are the parsed form and win.
    static let modelledKeys: Set<String> = [
        "name", "description", "images", "logo", "tags", "keywords", "buttons", "openingHours", "rating", "priceRange",
    ]

    /// Where Design-QA's CMS keeps opening hours: the taxonomy's `openingHours`
    /// object is empty on every one of its places, and the venue types hours
    /// into these two custom keys instead, one plain and one as escaped HTML.
    static let hoursTextKeys = ["hours of operation text", "Hours of Operation / Schedule"]

    // Floor selection in the SDK is by building + level index, not a POI's
    // inherited feature identifier. Models returned by different managers can
    // represent the same floor with different feature identifiers.
    static func floorId(_ level: PTRLevel?) -> String {
        guard let level else { return "" }
        return "\(level.building.identifier):\(level.index)"
    }

    /// The rule the Kozmos card applies to artwork it is handed — HTTPS, a
    /// host, no credentials in the address — applied here first, so the card
    /// is never handed an address it would refuse and show as unavailable.
    static func https(_ value: String?) -> String? {
        guard let value, let url = URL(string: value), url.scheme?.lowercased() == "https",
              url.host != nil, url.user == nil, url.password == nil else { return nil }
        return value
    }

    /// Gallery items from the SDK's image list. Numbered after filtering, so
    /// "image 2 of 2" is the second image a visitor can see.
    static func media(poiId: String, name: String, urls: [String]) -> [KozmosPOIMediaPresentation] {
        urls.compactMap(https).enumerated().map { index, src in
            .init(id: "\(poiId)-image-\(index)", src: src, alt: "\(name), image \(index + 1)")
        }
    }

    static func presentation(_ poi: PTRPoi) -> KozmosPOIPresentation {
        .init(id: poi.identifier, name: poi.name,
              floorId: floorId(poi.position.level),
              floorLabel: poi.position.level?.name ?? "Floor unavailable",
              buildingId: poi.position.building?.identifier,
              buildingLabel: poi.position.building?.name,
              logo: https(poi.logoUrl).map { .init(src: $0, alt: poi.name) },
              media: media(poiId: poi.identifier, name: poi.name, urls: poi.imageUrls ?? []),
              actions: [.favourite, .bookmark])
    }

    static func details(_ poi: PTRPoi) -> SDKPOIDetails {
        details(
            name: poi.name,
            attributes: poi.attributes,
            rating: poi.rating, ratingMax: poi.ratingMax, ratingCount: Int(poi.numberOfRatings),
            priceRange: Int(poi.priceRange), priceMax: Int(poi.priceMax),
            structuredHourSlots: (poi.openingHours ?? []).reduce(0) { $0 + $1.timeSlots.count },
            buttons: (poi.buttons ?? []).map {
                SDKPOIButton(name: $0.name, kind: SDKPOIButton.Kind(rawValue: Int($0.action.rawValue)) ?? .unknown, intent: $0.intent)
            },
            tags: poi.tags ?? [],
            longDescription: poi.longDescription)
    }

    /// The same mapping on plain values, so every rule below has a test that
    /// needs no SDK object.
    static func details(
        name: String, attributes: [String: Any],
        rating: Double, ratingMax: Double, ratingCount: Int,
        priceRange: Int, priceMax: Int,
        structuredHourSlots: Int, buttons: [SDKPOIButton],
        tags: [String], longDescription: String?
    ) -> SDKPOIDetails {
        var issues: [String] = []

        // Taxonomy properties travel in the feature's attributes, beside the
        // CMS's own keys. The SDK's typed fields replace their raw twins, and
        // the hours keys this adapter reads itself are not unknown to it.
        var values = attributes.filter { !modelledKeys.contains($0.key) && !hoursTextKeys.contains($0.key) }
        var custom: [String: KozmosPOIDetailSummary] = [:]
        if let highlight = ratingHighlight(rating: rating, max: ratingMax, count: ratingCount) {
            values["rating"] = rating
            custom["rating"] = highlight
        }
        if priceRange != absent, priceRange > 0 {
            if priceMax == 4 {
                values["priceRange"] = priceRange
            } else {
                issues.append("Price scale is \(priceMax), not the card's 4")
            }
        }
        let presented = TaxonomyPresenter.present(values, customHighlights: custom)
        issues += presented.issues

        var contacts: [String: SDKPOIContact] = [:]
        var actions: [KozmosPOIDetailAction] = []
        for button in buttons {
            guard let (contact, fallbackLabel, symbol) = contact(for: button) else {
                issues.append(button.kind == .href || button.kind == .tel || button.kind == .mailto
                    ? "Invalid \(button.name.isEmpty ? "contact" : button.name) address"
                    : "Unsupported button action: \(button.name)")
                continue
            }
            let base = contactId(contact)
            let id = contacts[base] == nil ? base : "\(base)-\(actions.count + 1)"
            contacts[id] = contact
            actions.append(KozmosPOIDetailAction(
                action: id, label: button.name.isEmpty ? fallbackLabel : button.name, systemImage: symbol))
        }

        let hours = openingHours(structuredSlots: structuredHourSlots, attributes: attributes)
        issues += hours.issues

        // These are SDK-provided free-text tags, not taxonomy enum values.
        // Do not infer icons or expose raw attributes as polished display labels.
        let tagItems = Array(Set(tags)).sorted().map { KozmosPOIDetailTag(id: $0, label: $0) }

        return SDKPOIDetails(
            presentation: KozmosPOIDetailsPresentation(
                summary: presented.summary, groups: presented.groups, tags: tagItems,
                supplementaryActions: actions, openingHours: hours.presentation,
                description: description(longDescription, name: name)),
            contacts: contacts, issues: issues)
    }

    // MARK: - The SDK's numeric fields

    /// PointrKit gives a rating as numbers — a value, its maximum, a count —
    /// where the taxonomy only says "object". Absent is its sentinel, or a
    /// scale of zero, or a value off the scale.
    static func ratingHighlight(rating: Double, max: Double, count: Int) -> KozmosPOIDetailSummary? {
        guard rating != Double(absent), max > 0, rating >= 0, rating <= max else { return nil }
        let detail: String? = count > 0 ? (count == 1 ? "1 review" : "\(count) reviews") : nil
        return KozmosPOIDetailSummary(
            id: "rating", label: "Rating", value: "\(format(rating)) / \(format(max))",
            detail: detail, systemImage: "star")
    }

    private static func format(_ number: Double) -> String {
        number == number.rounded() ? String(Int(number)) : String(format: "%.1f", number)
    }

    // MARK: - Contact actions

    /// A button becomes an action only with an address the host can open:
    /// a web address with a scheme, a telephone number with digits in it, an
    /// email address with a mailbox and a host. Nothing else is opened.
    static func contact(for button: SDKPOIButton) -> (SDKPOIContact, String, String)? {
        let intent = button.intent.trimmingCharacters(in: .whitespacesAndNewlines)
        switch button.kind {
        case .href:
            guard let url = URL(string: intent), let scheme = url.scheme?.lowercased(),
                  ["http", "https"].contains(scheme), url.host != nil, url.user == nil, url.password == nil
            else { return nil }
            return (.website(url), "Website", "globe")
        case .tel:
            let digits = intent.filter { $0.isNumber || $0 == "+" }
            guard digits.filter(\.isNumber).count >= 3, let url = URL(string: "tel:\(digits)") else { return nil }
            return (.call(url), "Call", "phone")
        case .mailto:
            let address = intent.lowercased().hasPrefix("mailto:") ? String(intent.dropFirst(7)) : intent
            let parts = address.split(separator: "@", omittingEmptySubsequences: false)
            guard parts.count == 2, !parts[0].isEmpty, parts[1].contains("."), !address.contains(" "),
                  let url = URL(string: "mailto:\(address)") else { return nil }
            return (.email(url), "Email", "envelope")
        case .unknown, .custom:
            return nil
        }
    }

    private static func contactId(_ contact: SDKPOIContact) -> String {
        switch contact {
        case .website: return "website"
        case .call: return "call"
        case .email: return "email"
        }
    }

    // MARK: - Opening hours

    /// Hours as the venue wrote them, never an open-or-closed status: the card
    /// shows the text and says so. PointrKit's structured schedule is decoded
    /// but not rendered — 10.3.0 does not document which day its first entry
    /// is, and every Design-QA schedule is empty, so the order cannot be
    /// measured either. A schedule with slots is reported, not guessed at.
    static func openingHours(structuredSlots: Int, attributes: [String: Any])
        -> (presentation: KozmosPOIOpeningHours?, issues: [String]) {
        var issues: [String] = []
        if structuredSlots > 0 {
            issues.append("Structured opening hours present (\(structuredSlots) slots) but not rendered: day order is undocumented")
        }
        let text = hoursTextKeys.lazy
            .compactMap { attributes[$0] as? String }
            .map(plainText)
            .first { !$0.isEmpty }
        guard let text else { return (nil, issues) }
        return (KozmosPOIOpeningHours(
            label: "Opening hours", summary: text, rows: [],
            note: "As listed by the venue. Not a live opening status."), issues)
    }

    // MARK: - Description

    /// The SDK's long description, as plain text, unless it is only the name
    /// again — Design-QA has places whose description is "Alamo ".
    static func description(_ raw: String?, name: String) -> KozmosPOIDetailDescription? {
        guard let raw else { return nil }
        let text = plainText(raw)
        guard !text.isEmpty, text.caseInsensitiveCompare(name.trimmingCharacters(in: .whitespaces)) != .orderedSame
        else { return nil }
        let preview = text.count > 200 ? String(text.prefix(200)) + "…" : text
        return KozmosPOIDetailDescription(preview: preview, full: text)
    }

    /// The CMS stores rich text as HTML, escaped once or twice. This unescapes
    /// until stable, turns block ends into line breaks, drops the tags and
    /// tidies whitespace. It interprets nothing: no script, no styles, no links.
    static func plainText(_ html: String) -> String {
        var text = html
        for _ in 0..<3 {
            let decoded = text
                .replacingOccurrences(of: "&lt;", with: "<")
                .replacingOccurrences(of: "&gt;", with: ">")
                .replacingOccurrences(of: "&quot;", with: "\"")
                .replacingOccurrences(of: "&#39;", with: "'")
                .replacingOccurrences(of: "&nbsp;", with: " ")
                .replacingOccurrences(of: "&amp;", with: "&")
            if decoded == text { break }
            text = decoded
        }
        text = text.replacingOccurrences(of: "<br[^>]*>|</p>|</div>|</li>", with: "\n", options: [.regularExpression, .caseInsensitive])
        text = text.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression)
        return text.components(separatedBy: .newlines)
            .map { $0.replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression).trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
            .joined(separator: "\n")
    }
}
