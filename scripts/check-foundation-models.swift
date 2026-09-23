// A check of on-device Apple Intelligence for the QA app's companion: does this Mac (and so its
// simulators) offer the Foundation Models system model, and can it turn a traveller's request into
// a typed place request? Build and run:
//   xcrun swiftc -parse-as-library -O -o /tmp/fm-check scripts/check-foundation-models.swift && /tmp/fm-check
// On 2026-09-21 this Mac (macOS 26.6.2) answered "unavailable, reason: appleIntelligenceNotEnabled":
// Apple Intelligence is off in System Settings; the framework itself compiles and runs.

import Foundation
import FoundationModels

@Generable
struct PlaceRequest {
    @Guide(description: "The kind of place asked for, as one or two words, e.g. restaurant, coffee, toilet, gate, shop")
    var placeKind: String
    @Guide(description: "Dietary or accessibility requirements named in the request, e.g. vegan, halal, wheelchair; empty when none")
    var requirements: [String]
    @Guide(description: "A named location the place should be near, e.g. gate B22; empty when none")
    var near: String
}

@main
struct Check {
    static func main() async {
        let model = SystemLanguageModel.default
        switch model.availability {
        case .available:
            print("availability: available")
        case .unavailable(let reason):
            print("availability: unavailable, reason: \(reason)")
            return
        }
        let session = LanguageModelSession(instructions: "You turn a traveller's request inside an airport into a structured place request. Do not invent requirements that were not asked for.")
        let started = Date()
        do {
            let answer = try await session.respond(to: "vegan restaurants near gate B22", generating: PlaceRequest.self)
            let ms = Int(Date().timeIntervalSince(started) * 1000)
            print("guided: kind=\(answer.content.placeKind) requirements=\(answer.content.requirements) near=\(answer.content.near) in \(ms) ms")
            let second = try await session.respond(to: "where can I buy a phone charger", generating: PlaceRequest.self)
            print("guided 2: kind=\(second.content.placeKind) requirements=\(second.content.requirements) near=\(second.content.near)")
        } catch {
            print("error: \(error)")
        }
    }
}
