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
/// those by the words of its matchers, derived here and recorded in the docs
/// as a stand-in, never as the taxonomy's own matching.
struct QuickAccessCategory: Identifiable, Hashable {
    let id: String
    let name: String
    /// The bundled image, or a system symbol for the two tiles the prototype
    /// puts first: favourites and bookmarks.
    let icon: Icon
    /// Lower-case whole words a place's name, tags or keywords are matched on.
    let terms: [String]

    enum Icon: Hashable {
        case bundled(String)
        case symbol(String)
    }
}

enum QuickAccess {
    static let version = "10.12.0"
    static let favouritesId = "favourites"
    static let bookmarksId = "bookmarks"

    /// Words every matcher carries and no place is named by.
    static let stopWords: Set<String> = ["space", "and", "the", "of", "in", "for", "a", "an", "to"]

    /// The two personal tiles, then the taxonomy's sixteen.
    static var tiles: [QuickAccessCategory] {
        [
            QuickAccessCategory(id: favouritesId, name: "Favourites", icon: .symbol("heart"), terms: []),
            QuickAccessCategory(id: bookmarksId, name: "Bookmarks", icon: .symbol("bookmark"), terms: [])
        ] + categories
    }

    static let categories: [QuickAccessCategory] = {
        guard let url = Bundle.main.url(forResource: "aviation-\(version)", withExtension: "json"),
              let data = try? Data(contentsOf: url) else { return [] }
        return parse(data)
    }()

    static func category(id: String) -> QuickAccessCategory? { tiles.first { $0.id == id } }

    /// The published file's categories, in its order.
    static func parse(_ data: Data) -> [QuickAccessCategory] {
        guard let raw = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else { return [] }
        return raw.compactMap { entry in
            guard let name = entry["name"] as? String, !name.isEmpty else { return nil }
            let matchers = entry["match"] as? [[String: Any]] ?? []
            let id = slug(name)
            return QuickAccessCategory(id: id, name: name, icon: .bundled("quick-access-\(id)"), terms: terms(name: name, matchers: matchers))
        }
    }

    /// A category's search words: the words of its name and of every
    /// matcher's `mainType`, `subType` and `serviceTypes`, lower-cased, without
    /// the stop words, three letters or longer, each once, in first-seen order.
    static func terms(name: String, matchers: [[String: Any]]) -> [String] {
        var seen = Set<String>()
        var result: [String] = []
        func add(_ text: String) {
            for word in words(text) where word.count >= 3 && !stopWords.contains(word) && seen.insert(word).inserted {
                result.append(word)
            }
        }
        add(name)
        for matcher in matchers {
            if let mainType = matcher["mainType"] as? String { add(mainType) }
            if let subType = matcher["subType"] as? String { add(subType) }
            for service in matcher["serviceTypes"] as? [String] ?? [] { add(service) }
        }
        return result
    }

    /// Whether a place, by its name and the free text it carries, is one of
    /// the category's: any of the category's words as a whole word of any of
    /// the place's.
    static func matches(_ category: QuickAccessCategory, name: String, freeText: [String]) -> Bool {
        guard !category.terms.isEmpty else { return false }
        let placeWords = Set(([name] + freeText).flatMap(words))
        return category.terms.contains { placeWords.contains($0) }
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
