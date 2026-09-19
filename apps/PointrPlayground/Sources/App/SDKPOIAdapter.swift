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
    static func https(_ value: String?) -> String? {
        guard let value, let url = URL(string: value), url.scheme == "https", url.host != nil else { return nil }
        return value
    }

    static func presentation(_ poi: PTRPoi) -> KozmosPOIPresentation {
        .init(id: poi.identifier, name: poi.name,
              floorId: floorId(poi.position.level),
              floorLabel: poi.position.level?.name ?? "Floor unavailable",
              buildingId: poi.position.building?.identifier,
              buildingLabel: poi.position.building?.name,
              logo: https(poi.logoUrl).map { .init(src: $0, alt: poi.name) },
              media: (poi.imageUrls ?? []).enumerated().compactMap { index, value in
                  https(value).map { .init(id: "\(poi.identifier)-image-\(index)", src: $0, alt: "\(poi.name), image \(index + 1)") }
              },
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
