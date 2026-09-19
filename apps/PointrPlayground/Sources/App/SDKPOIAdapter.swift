import Foundation
import PointrKit
import Kozmos

enum SDKPOIAdapter {
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

    static func details(_ poi: PTRPoi) -> KozmosPOIDetailsPresentation {
        // These are SDK-provided free-text tags, not taxonomy enum values.
        // Do not infer icons or expose raw attributes as polished display labels.
        let tags = Array(Set(poi.tags ?? [])).sorted().map {
            KozmosPOIDetailTag(id: $0, label: $0)
        }
        let description = poi.longDescription.flatMap { value -> KozmosPOIDetailDescription? in
            guard !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return nil }
            let preview = value.count > 200 ? String(value.prefix(200)) + "…" : value
            return .init(preview: preview, full: value)
        }
        return .init(tags: tags, description: description)
    }
}
