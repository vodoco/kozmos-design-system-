import SwiftUI

public enum KozmosMenuContentType: String, CaseIterable {
    case basic
    case checkbox
    case radio
    case submenu
}

public struct KozmosMenuItem: Identifiable, Hashable {
    public let id: String
    public let text: String
    public let shortcut: String?
    public let isChecked: Bool
    public let isSelected: Bool
    public let submenuItems: [String]

    public init(
        id: String? = nil,
        text: String,
        shortcut: String? = nil,
        isChecked: Bool = false,
        isSelected: Bool = false,
        submenuItems: [String] = []
    ) {
        self.id = id ?? text
        self.text = text
        self.shortcut = shortcut
        self.isChecked = isChecked
        self.isSelected = isSelected
        self.submenuItems = submenuItems
    }
}

public struct KozmosMenuContent: Hashable {
    public let label: String?
    public let items: [KozmosMenuItem]
    public let contentType: KozmosMenuContentType

    public init(
        label: String? = nil,
        items: [KozmosMenuItem],
        contentType: KozmosMenuContentType = .basic
    ) {
        self.label = label
        self.items = items
        self.contentType = contentType
    }
}

public struct KozmosMenu: View {
    let title: String
    let content: KozmosMenuContent
    let onItemSelect: (KozmosMenuItem) -> Void
    
    public init(title: String, items: [String], onSelect: @escaping (String) -> Void) {
        self.title = title
        self.content = KozmosMenuContent(items: items.map { KozmosMenuItem(text: $0) })
        self.onItemSelect = { item in onSelect(item.text) }
    }

    public init(
        title: String,
        content: KozmosMenuContent,
        onItemSelect: @escaping (KozmosMenuItem) -> Void = { _ in }
    ) {
        self.title = title
        self.content = content
        self.onItemSelect = onItemSelect
    }
    
    public var body: some View {
        Menu(title) {
            if let label = content.label {
                Text(label)
                    .font(KozmosTypography.caption)
                    .foregroundColor(KozmosColors.primitivesColorsForeground500)
                Divider().overlay(KozmosColors.semanticsBorderSubtle)
            }

            ForEach(content.items) { item in
                menuRow(for: item)
            }
        }
    }

    @ViewBuilder
    private func menuRow(for item: KozmosMenuItem) -> some View {
        switch content.contentType {
        case .basic:
            Button {
                onItemSelect(item)
            } label: {
                HStack {
                    Text(item.text)

                    if let shortcut = item.shortcut {
                        Spacer()
                        Text(shortcut)
                            .foregroundColor(KozmosColors.primitivesColorsForeground500)
                    }
                }
            }
        case .checkbox:
            Button {
                onItemSelect(item)
            } label: {
                Label(item.text, systemImage: item.isChecked ? "checkmark" : "square")
            }
        case .radio:
            Button {
                onItemSelect(item)
            } label: {
                Label(item.text, systemImage: item.isSelected ? "largecircle.fill.circle" : "circle")
            }
        case .submenu:
            if item.submenuItems.isEmpty {
                Button(item.text) {
                    onItemSelect(item)
                }
            } else {
                Menu(item.text) {
                    ForEach(item.submenuItems, id: \.self) { submenuItem in
                        Button(submenuItem) {
                            onItemSelect(
                                KozmosMenuItem(
                                    id: "\(item.id)/\(submenuItem)",
                                    text: submenuItem
                                )
                            )
                        }
                    }
                }
            }
        }
    }
}
