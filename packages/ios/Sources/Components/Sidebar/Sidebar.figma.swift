import SwiftUI
import Figma

struct KozmosSidebarBasicConnect: FigmaConnect {
    let component = KozmosSidebar<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6807"
    var variant = ["Content": "Basic"]

    var body: some View {
        KozmosSidebar(
            variant: .expanded,
            header: {
                Text("Header")
            },
            navigation: {
                AnyView(Text("Navigation"))
            },
            tools: {
                EmptyView()
            },
            footer: {
                Text("Footer")
            }
        )
    }
}

struct KozmosSidebarSectionsConnect: FigmaConnect {
    let component = KozmosSidebar<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6807"
    var variant = ["Content": "Sections"]

    var body: some View {
        KozmosSidebar(
            variant: .expanded,
            header: {
                Text("Header")
            },
            navigation: {
                AnyView(
                    VStack(alignment: .leading) {
                        Text("Section")
                        Text("Navigation")
                    }
                )
            },
            tools: {
                EmptyView()
            },
            footer: {
                Text("Footer")
            }
        )
    }
}

struct KozmosSidebarToolsConnect: FigmaConnect {
    let component = KozmosSidebar<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6807"
    var variant = ["Content": "Tools"]

    var body: some View {
        KozmosSidebar(
            variant: .expanded,
            header: {
                Text("Header")
            },
            navigation: {
                AnyView(
                    VStack(alignment: .leading) {
                        Text("Section")
                        Text("Navigation")
                    }
                )
            },
            tools: {
                Text("Tools")
            },
            footer: {
                Text("Footer")
            }
        )
    }
}

struct KozmosSidebarRailConnect: FigmaConnect {
    let component = KozmosSidebar<AnyView>.self
    let figmaNodeUrl = "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6807"
    var variant = ["Content": "Rail"]

    var body: some View {
        KozmosSidebar(
            variant: .rail,
            header: {
                Text("Header")
            },
            navigation: {
                AnyView(Text("Navigation"))
            },
            tools: {
                EmptyView()
            },
            footer: {
                Text("Footer")
            }
        )
    }
}
