import SwiftUI

/// Layout of the floor selector, mirroring the React `FloorSelector.variant`.
public enum KozmosFloorSelectorVariant: String, CaseIterable, Sendable {
    case verticalList = "vertical-list"
    case horizontalList = "horizontal-list"
    case compactStepper = "compact-stepper"
}

/// Switches the active level of a venue.
///
/// Mirrors the React `FloorSelector` API. `selectedFloor` is the canonical
/// floor ID, never a display label, and the component reports selection rather
/// than deriving it.
public struct KozmosFloorSelector: View {
    private let floors: [String]
    @Binding private var selectedFloor: String
    private let variant: KozmosFloorSelectorVariant
    private let label: String
    @Environment(\.kozmosAnalytics) private var trackEvent

    public init(
        floors: [String],
        selectedFloor: Binding<String>,
        variant: KozmosFloorSelectorVariant = .verticalList,
        label: String = "Floor selector"
    ) {
        self.floors = floors
        self._selectedFloor = selectedFloor
        self.variant = variant
        self.label = label
    }

    private func select(_ floor: String) {
        trackEvent(
            KozmosAnalyticsEvent(
                eventName: "floor_selected",
                component: "FloorSelector",
                properties: ["floor": floor]
            )
        )
        withAnimation { selectedFloor = floor }
    }

    private var selectedIndex: Int {
        floors.firstIndex(of: selectedFloor) ?? 0
    }

    public var body: some View {
        container
            .padding(KozmosDimensions.primitivesLayoutSpacing75)
            .background(KozmosColors.primitivesColorsBackground0.opacity(0.9))
            .cornerRadius(KozmosDimensions.primitivesLayoutRadius300)
            .shadow(
                color: KozmosColors.primitivesColorsForeground900.opacity(0.1),
                radius: 4,
                x: 0,
                y: 2
            )
            .accessibilityElement(children: .contain)
            .accessibilityLabel(label)
    }

    @ViewBuilder
    private var container: some View {
        switch variant {
        case .verticalList:
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ForEach(floors, id: \.self) { floor in
                    floorButton(floor)
                }
            }
        case .horizontalList:
            HStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                ForEach(floors, id: \.self) { floor in
                    floorButton(floor)
                }
            }
        case .compactStepper:
            VStack(spacing: KozmosDimensions.primitivesLayoutSpacing100) {
                stepperButton(systemImage: "chevron.up", offset: -1, label: "Floor up")
                floorButton(selectedFloor)
                stepperButton(systemImage: "chevron.down", offset: 1, label: "Floor down")
            }
        }
    }

    private func floorButton(_ floor: String) -> some View {
        let isSelected = selectedFloor == floor
        return Button {
            select(floor)
        } label: {
            Text(floor)
                .font(.subheadline)
                .bold()
                .frame(
                    width: KozmosDimensions.primitivesLayoutSizing500,
                    height: KozmosDimensions.primitivesLayoutSizing500
                )
                .background(isSelected ? KozmosColors.primitivesColorsTheme500 : Color.clear)
                .foregroundColor(
                    isSelected
                        ? KozmosColors.primitivesColorsBackground0
                        : KozmosColors.primitivesColorsForeground100
                )
                .cornerRadius(KozmosDimensions.primitivesLayoutRadius300)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(floor)
        .accessibilityAddTraits(isSelected ? [.isButton, .isSelected] : .isButton)
    }

    /// Steps through the floor list. `offset` is in list order, so -1 is the
    /// entry above the current one.
    private func stepperButton(systemImage: String, offset: Int, label: String) -> some View {
        let target = selectedIndex + offset
        let enabled = floors.indices.contains(target)

        return Button {
            if enabled { select(floors[target]) }
        } label: {
            Image(systemName: systemImage)
                .font(.system(size: 14, weight: .bold))
                .frame(
                    width: KozmosDimensions.primitivesLayoutSizing500,
                    height: KozmosDimensions.primitivesLayoutSizing500
                )
                .foregroundColor(KozmosColors.primitivesColorsForeground500)
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
        .opacity(enabled ? 1 : 0.4)
        .accessibilityLabel(label)
    }
}
