import SwiftUI
import Figma

struct KozmosNavbarBasicConnect: FigmaConnect {
    let component = KozmosNavbar.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6765"
    var variant = ["Content": "Basic"]

    var body: some View {
        KozmosNavbar(
            logo: {
                Text("Logo")
            },
            context: {
                EmptyView()
            },
            navigation: {
                EmptyView()
            },
            primaryAction: {
                EmptyView()
            },
            actions: {
                EmptyView()
            },
            utilities: {
                EmptyView()
            },
            account: {
                EmptyView()
            }
        )
    }
}

struct KozmosNavbarActionsConnect: FigmaConnect {
    let component = KozmosNavbar.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6765"
    var variant = ["Content": "Actions"]

    var body: some View {
        KozmosNavbar(
            logo: {
                Text("Logo")
            },
            context: {
                EmptyView()
            },
            navigation: {
                EmptyView()
            },
            primaryAction: {
                EmptyView()
            },
            actions: {
                Text("Actions")
            },
            utilities: {
                EmptyView()
            },
            account: {
                EmptyView()
            }
        )
    }
}

struct KozmosNavbarContextualConnect: FigmaConnect {
    let component = KozmosNavbar.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6765"
    var variant = ["Content": "Contextual"]

    var body: some View {
        KozmosNavbar(
            logo: {
                Text("Logo")
            },
            context: {
                VStack(alignment: .leading) {
                    Text("Context")
                }
            },
            navigation: {
                Text("Navigation")
            },
            primaryAction: {
                KozmosButton("Primary action", action: {})
            },
            actions: {
                Text("Actions")
            },
            utilities: {
                Text("Utility")
            },
            account: {
                Text("Account")
            }
        )
    }
}
