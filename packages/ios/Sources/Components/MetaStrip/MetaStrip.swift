import SwiftUI

/// One fact in a `KozmosMetaStrip`: a label and the value it describes.
///
/// The label is not optional even when it is not drawn. A tile reading `$$$$`
/// or `4.5` is clear to someone looking at it and meaningless to someone
/// listening, so the label always reaches VoiceOver.
public struct KozmosMetaStripItem: Identifiable {
    public let id: String
    public let label: String
    public let value: String
    public let showLabel: Bool
    public let systemImage: String?

    public init(
        id: String? = nil,
        label: String,
        value: String,
        showLabel: Bool = false,
        systemImage: String? = nil
    ) {
        self.id = id ?? label
        self.label = label
        self.value = value
        self.showLabel = showLabel
        self.systemImage = systemImage
    }
}

/// A row of small facts about one thing, each a label and a value.
///
/// Measured from the SDK's POI detail card (`HbFSXhCPxKUy2fWa5x9TKO`, node
/// `241:4772`, 2026-09-14): a 64-tall strip of bordered tiles. It scrolls
/// rather than wrapping, because a fact tile on a second row reads as a
/// different kind of thing.
///
/// Domain-neutral: it knows about facts, not about places.
public struct KozmosMetaStrip: View {
    private let items: [KozmosMetaStripItem]
    private let accessibilityLabel: String

    public init(_ accessibilityLabel: String, items: [KozmosMetaStripItem]) {
        self.accessibilityLabel = accessibilityLabel
        self.items = items
    }

    public var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                    if index > 0 {
                        Rectangle()
                            .fill(KozmosColors.semanticsBorderSubtle)
                            .frame(width: 1)
                    }
                    tile(item)
                }
            }
        }
        .frame(height: Self.height)
        .background(KozmosColors.primitivesColorsBackground0)
        .overlay(alignment: .top) { divider }
        .overlay(alignment: .bottom) { divider }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(accessibilityLabel)
    }

    private var divider: some View {
        Rectangle()
            .fill(KozmosColors.semanticsBorderSubtle)
            .frame(height: 1)
    }

    private func tile(_ item: KozmosMetaStripItem) -> some View {
        VStack(spacing: 2) {
            HStack(spacing: 4) {
                if let systemImage = item.systemImage {
                    Image(systemName: systemImage)
                        .font(.system(size: 16))
                        .accessibilityHidden(true)
                }
                Text(item.value)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(KozmosColors.primitivesColorsForeground0)
            }
            if item.showLabel {
                Text(item.label)
                    .font(.system(size: 12))
                    .foregroundColor(KozmosColors.primitivesColorsForeground400)
            }
        }
        .padding(.horizontal, 16)
        .frame(minWidth: Self.minTileWidth, maxHeight: .infinity)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(item.label)
        .accessibilityValue(item.value)
    }

    private static let height: CGFloat = 64
    private static let minTileWidth: CGFloat = 128
}
