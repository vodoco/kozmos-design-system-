import Foundation

/// The taxonomy's published quick-access bar for aviation, as the prototype's
/// tiles show it: sixteen categories in the taxonomy's order, each with its
/// published icon. Vendored from
/// `https://pointrmapstorage.blob.core.windows.net/taxonomy/10.12.0/quick-access/aviation.json`
/// (release 10.12.0, not the mutable `latest`) into `Resources/QuickAccess`,
/// with the icons the file names, so the sheet needs no network for them.
///
/// A category's matchers name taxonomy types (`mainType`, `subType`,
/// `serviceTypes`) that the SDK's `PTRPoi` does not carry — it has a name,
/// tags and keywords. Until the SDK exposes a place's type, a tile searches
/// those by the taxonomy's own words for the matched types — each type's
/// display name and its `alsoKnownAs` aliases, or a matcher's service types —
/// derived by `scripts/sync-ios-quick-access.mjs` into `QuickAccessTerms`,
/// and recorded in the docs as a stand-in, never as the taxonomy's own matching.
struct QuickAccessCategory: Identifiable, Hashable {
    let id: String
    let name: String
    /// The bundled image, or a system symbol for the two tiles the prototype
    /// puts first: favourites and bookmarks.
    let icon: Icon
    /// Lower-case phrases a place's name, tags or keywords are matched on: a
    /// phrase matches when its words run together in the text, whole.
    let terms: [String]
    /// The category's colour, from the icon the taxonomy publishes for it.
    let tint: Tint

    enum Icon: Hashable {
        case bundled(String)
        case symbol(String)
    }

    /// The taxonomy names its quick-access icons by colour — its eight — and
    /// the system carries that palette as `Semantics.Category`; the theme's
    /// colours are the personal tiles'.
    enum Tint: String, Hashable, CaseIterable {
        case theme, yellow, orange, turquoise, red, blue, navy, green, pink

        static func from(iconUrl: String) -> Tint {
            let name = iconUrl.split(separator: "/").last.map(String.init) ?? ""
            let stem = name.replacingOccurrences(of: ".png", with: "")
            guard let suffix = stem.split(separator: "-").last.map(String.init) else { return .theme }
            switch suffix {
            case "yellow": return .yellow
            case "orange": return .orange
            case "turquoise", "teal": return .turquoise
            case "red": return .red
            case "blue": return .blue
            case "navy": return .navy
            case "green": return .green
            case "pink", "purple": return .pink
            default: return .theme
            }
        }
    }
}

enum QuickAccess {
    static let version = "10.12.0"
    static let favouritesId = "favourites"
    static let bookmarksId = "bookmarks"

    /// The two personal tiles, then the taxonomy's sixteen.
    static var tiles: [QuickAccessCategory] {
        [
            QuickAccessCategory(id: favouritesId, name: "Favourites", icon: .symbol("heart"), terms: [], tint: .theme),
            QuickAccessCategory(id: bookmarksId, name: "Bookmarks", icon: .symbol("bookmark"), terms: [], tint: .theme)
        ] + categories
    }

    static let categories: [QuickAccessCategory] = {
        guard let url = Bundle.main.url(forResource: "aviation-\(version)", withExtension: "json"),
              let data = try? Data(contentsOf: url) else { return [] }
        return parse(data, terms: QuickAccessTerms.json.data(using: .utf8))
    }()

    static func category(id: String) -> QuickAccessCategory? { tiles.first { $0.id == id } }

    /// The published file's categories, in its order, each with the words
    /// the generator derived for it from the taxonomy.
    static func parse(_ data: Data, terms: Data? = nil) -> [QuickAccessCategory] {
        guard let raw = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else { return [] }
        let generated = terms.flatMap { try? JSONSerialization.jsonObject(with: $0) as? [String: Any] }
        let phrasesByName: [String: [String]] = (generated?["categories"] as? [[String: Any]] ?? []).reduce(into: [:]) { result, entry in
            if let name = entry["name"] as? String { result[name] = entry["phrases"] as? [String] ?? [] }
        }
        return raw.compactMap { entry in
            guard let name = entry["name"] as? String, !name.isEmpty else { return nil }
            let id = slug(name)
            return QuickAccessCategory(
                id: id, name: name, icon: .bundled("quick-access-\(id)"),
                terms: phrasesByName[name] ?? [name.lowercased()],
                tint: QuickAccessCategory.Tint.from(iconUrl: entry["iconUrl"] as? String ?? "")
            )
        }
    }

    /// Whether a place, by its name and the free text it carries, is one of
    /// the category's: one of the category's phrases running whole through
    /// the words of the name, a tag or a keyword.
    static func matches(_ category: QuickAccessCategory, name: String, freeText: [String]) -> Bool {
        guard !category.terms.isEmpty else { return false }
        let texts = ([name] + freeText).map(words)
        let phrases = category.terms.map(words).filter { !$0.isEmpty }
        return phrases.contains { phrase in texts.contains { text in contains(text, phrase) } }
    }

    /// Every category's count of places, in one pass over the places: each
    /// place's words are split once and tried against every category's
    /// phrases, so a venue's whole quick-access bar is counted at once. It
    /// agrees with `matches` place by place. The personal tiles are not
    /// counted here; they count what the session has marked.
    static func counts(of categories: [QuickAccessCategory], places: [(name: String, freeText: [String])]) -> [String: Int] {
        let phrasesByCategory = categories.map { category in
            (id: category.id, phrases: category.terms.map(words).filter { !$0.isEmpty })
        }
        var counts = Dictionary(uniqueKeysWithValues: categories.map { ($0.id, 0) })
        for place in places {
            let texts = ([place.name] + place.freeText).map(words)
            for entry in phrasesByCategory where entry.phrases.contains(where: { phrase in texts.contains { contains($0, phrase) } }) {
                counts[entry.id, default: 0] += 1
            }
        }
        return counts
    }

    /// The tiles the sheet shows: every tile until the venue's places are
    /// counted; then those with at least one place, in the tiles' order — a
    /// tile that would lead to no result leaves the grid (Olcay, 21st).
    static func visibleTiles(counts: [String: Int]?) -> [QuickAccessCategory] {
        guard let counts else { return tiles }
        return tiles.filter { (counts[$0.id] ?? 0) > 0 }
    }

    static func contains(_ text: [String], _ phrase: [String]) -> Bool {
        guard phrase.count <= text.count else { return false }
        return (0...(text.count - phrase.count)).contains { start in
            Array(text[start..<(start + phrase.count)]) == phrase
        }
    }

    static func slug(_ name: String) -> String {
        words(name).joined(separator: "-")
    }

    /// Lower-case words: letters and digits, split on anything else.
    static func words(_ text: String) -> [String] {
        text.lowercased()
            .split { !($0.isLetter || $0.isNumber) }
            .map(String.init)
    }
}
