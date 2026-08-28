import SwiftUI

/// A horizontally paged gallery of POI photography.
///
/// Mirrors the React `POIMediaGallery`, including its controlled/uncontrolled
/// index behaviour: pass `activeIndex` to drive it externally, otherwise the
/// gallery tracks its own position. Renders nothing when `media` is empty, so
/// venues without licensed imagery simply show no gallery.
public struct KozmosPOIMediaGallery: View {
    private let media: [KozmosPOIMediaPresentation]
    private let label: String
    private let activeIndex: Int?
    private let previousLabel: String
    private let nextLabel: String
    private let positionLabel: (Int, Int) -> String
    private let onActiveIndexChange: ((Int) -> Void)?

    @State private var internalIndex: Int

    public init(
        media: [KozmosPOIMediaPresentation],
        label: String,
        positionLabel: @escaping (Int, Int) -> String,
        activeIndex: Int? = nil,
        defaultActiveIndex: Int = 0,
        previousLabel: String = "Previous image",
        nextLabel: String = "Next image",
        onActiveIndexChange: ((Int) -> Void)? = nil
    ) {
        self.media = media
        self.label = label
        self.positionLabel = positionLabel
        self.activeIndex = activeIndex
        self.previousLabel = previousLabel
        self.nextLabel = nextLabel
        self.onActiveIndexChange = onActiveIndexChange
        self._internalIndex = State(initialValue: defaultActiveIndex)
    }

    private var isControlled: Bool { activeIndex != nil }

    private var currentIndex: Int {
        let raw = activeIndex ?? internalIndex
        return min(max(raw, 0), max(media.count - 1, 0))
    }

    private func selectIndex(_ index: Int, proxy: ScrollViewProxy) {
        let nextIndex = min(max(index, 0), media.count - 1)
        if !isControlled { internalIndex = nextIndex }
        onActiveIndexChange?(nextIndex)
        withAnimation { proxy.scrollTo(media[nextIndex].id, anchor: .leading) }
    }

    public var body: some View {
        if media.isEmpty {
            EmptyView()
        } else {
            ScrollViewReader { proxy in
                VStack(alignment: .leading, spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                    HStack {
                        Text(positionLabel(currentIndex + 1, media.count))
                            .font(.caption)
                            .foregroundColor(KozmosColors.primitivesColorsForeground500)
                            .accessibilityAddTraits(.updatesFrequently)

                        Spacer(minLength: KozmosDimensions.primitivesLayoutSpacing150)

                        if media.count > 1 {
                            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                                KozmosIconButton(
                                    iconName: "chevron.left",
                                    isDisabled: currentIndex == 0
                                ) {
                                    selectIndex(currentIndex - 1, proxy: proxy)
                                }
                                .accessibilityLabel(previousLabel)

                                KozmosIconButton(
                                    iconName: "chevron.right",
                                    isDisabled: currentIndex == media.count - 1
                                ) {
                                    selectIndex(currentIndex + 1, proxy: proxy)
                                }
                                .accessibilityLabel(nextLabel)
                            }
                            .accessibilityElement(children: .contain)
                            .accessibilityLabel("\(label) controls")
                        }
                    }

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: KozmosDimensions.primitivesLayoutSpacing150) {
                            ForEach(media) { item in
                                AsyncImage(url: URL(string: item.src)) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    KozmosColors.primitivesColorsBackground100
                                }
                                .frame(width: 260, height: 195)
                                .clipped()
                                .clipShape(
                                    RoundedRectangle(
                                        cornerRadius: KozmosDimensions.semanticsRadiusPanel,
                                        style: .continuous
                                    )
                                )
                                .accessibilityLabel(item.alt)
                                .id(item.id)
                            }
                        }
                    }
                }
                .accessibilityElement(children: .contain)
                .accessibilityLabel(label)
            }
        }
    }
}
