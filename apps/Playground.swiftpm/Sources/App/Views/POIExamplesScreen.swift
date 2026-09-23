import SwiftUI
import Kozmos

struct POIExample: Decodable, Identifiable {
    let id: String
    let title: String
    let poi: KozmosPOIPresentation
    let details: KozmosPOIDetailsPresentation

    static let loaded = Result { try JSONDecoder().decode([Self].self, from: Data(POIExampleData.json.utf8)) }
}

struct POIExamplesScreen: View {
    var body: some View {
        NavigationStack {
            Group {
                switch POIExample.loaded {
                case .success(let examples):
                    List {
                        Section {
                            ForEach(examples) { example in
                                NavigationLink(example.title) { POIExampleScreen(example: example) }
                            }
                        } footer: {
                            Text("The same fixture data as Storybook. Actions are local demonstrations; no booking, calling, sharing or routing service is contacted.")
                        }
                    }
                case .failure(let error):
                    Text("Could not load POI examples: \(error.localizedDescription)").padding()
                }
            }
            .navigationTitle("POI examples")
        }
    }
}

private struct POIExampleScreen: View {
    let example: POIExample
    @Environment(\.dismiss) private var dismiss
    @State private var favourites = false
    @State private var bookmarked = false
    @State private var actionStates: [KozmosPOIAction: KozmosPOIActionState] = [:]
    @State private var supplementaryStates: [String: KozmosPOIActionState] = [:]
    @State private var actionStatesExample = false

    private var states: [KozmosPOIAction: KozmosPOIActionState] {
        var result = actionStates
        result[.favourite] = .init(pressed: favourites)
        result[.bookmark] = .init(pressed: bookmarked)
        if actionStatesExample {
            result[.navigate] = .init(disabled: true, message: "Route unavailable. Select a starting point.", messageTone: .error)
        }
        return result
    }

    private var extraStates: [String: KozmosPOIActionState] {
        if actionStatesExample, let action = example.details.supplementaryActions.first {
            return [action.action: .init(loading: true, message: "Request in progress (example state).")]
        }
        return supplementaryStates
    }

    var body: some View {
        KozmosPOIDetailPanel(
            poi: example.poi,
            actionLabels: [.navigate: "Go", .favourite: "Favourite", .bookmark: "Bookmark", .share: "Share", .order: "Order"],
            onAction: { action, _ in
                switch action {
                case .favourite: favourites.toggle()
                case .bookmark: bookmarked.toggle()
                default: actionStates[action] = .init(message: "\(action == .navigate ? "Route" : action.rawValue.capitalized) requested (example only).")
                }
            },
            actionStates: states,
            onClose: { dismiss() },
            details: example.details,
            supplementaryActionStates: extraStates,
            onSupplementaryAction: { action, _ in
                supplementaryStates[action] = .init(message: "\(action.capitalized) requested (example only).")
            }
        )
        .padding(.horizontal, 12)
        .navigationTitle(example.title)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Toggle("Action states", isOn: $actionStatesExample)
                    .toggleStyle(.button)
            }
        }
    }
}
